#!/usr/bin/env python3
"""Hardened HTTPS fetching for Sie-sucht-Sie snapshot importers.

Every request is limited to the market hosts, pinned to a validated public IP,
bounded in size and checked against the expected content type.
"""
from __future__ import annotations

import ipaddress
import re
import socket
import time
from urllib.parse import unquote, urljoin, urlparse

import requests
import urllib3
from requests.structures import CaseInsensitiveDict

SOURCE_HOSTS = {"sie-sucht-sie.de", "www.sie-sucht-sie.de"}
MAX_RESPONSE_BYTES = 10 * 1024 * 1024
MAX_REDIRECTS = 5
FETCH_TIMEOUT = (10, 30)
MAX_URL_PATH_LENGTH = 8192
MAX_DECODE_ROUNDS = 32
FORBIDDEN_IMAGE_PATH = re.compile(r"/(?:user-media|member-media|members?|profiles?|profile-images?|mitglieder)(?:/|$)", re.I)
USER_AGENT = "Sie-sucht-Sie migration snapshot/1.0"


class FetchPolicyError(RuntimeError):
    """The importer refused a network request that violates its source policy."""


def _safe_authority(parsed, allowed_hosts: set[str]) -> bool:
    if parsed.hostname is None or parsed.hostname.lower() not in allowed_hosts:
        return False
    if parsed.username is not None or parsed.password is not None:
        return False
    try:
        port = parsed.port
    except ValueError:
        return False
    return port in {None, 443 if parsed.scheme == "https" else 80}


def _parse_url(url: str):
    try:
        return urlparse(url)
    except (TypeError, ValueError):
        return None


def _safe_urljoin(base: str, reference: str) -> str:
    try:
        joined = urljoin(base, reference)
    except (TypeError, ValueError) as error:
        raise FetchPolicyError(f"Refusing malformed URL reference: {reference}") from error
    if _parse_url(joined) is None:
        raise FetchPolicyError(f"Refusing malformed URL reference: {reference}")
    return joined


def _decode_path_fully(path: str) -> str | None:
    if len(path) > MAX_URL_PATH_LENGTH:
        return None
    decoded = path
    for _ in range(MAX_DECODE_ROUNDS):
        try:
            next_value = unquote(decoded, errors="strict")
        except UnicodeDecodeError:
            return None
        if next_value == decoded:
            return None if "%" in decoded else decoded
        decoded = next_value
        if len(decoded) > MAX_URL_PATH_LENGTH:
            return None
    return None


def validate_source_url(url: str) -> tuple[str, ...]:
    parsed = _parse_url(url)
    if parsed is None:
        raise FetchPolicyError(f"Refusing malformed source URL: {url}")
    if parsed.scheme != "https" or not _safe_authority(parsed, SOURCE_HOSTS) or parsed.fragment:
        raise FetchPolicyError(f"Refusing source URL outside the HTTPS market allowlist: {url}")
    try:
        addresses = socket.getaddrinfo(parsed.hostname, parsed.port or 443, type=socket.SOCK_STREAM)
    except socket.gaierror as error:
        raise FetchPolicyError(f"Could not resolve approved source host: {parsed.hostname}") from error
    if not addresses:
        raise FetchPolicyError(f"Approved source host resolved to no addresses: {parsed.hostname}")
    approved = []
    for address in addresses:
        ip = ipaddress.ip_address(address[4][0])
        if not ip.is_global:
            raise FetchPolicyError(f"Refusing non-public source address for {parsed.hostname}: {ip}")
        approved.append(str(ip))
    return tuple(sorted(set(approved)))


def _request_pinned(url: str, address: str) -> requests.Response:
    """Fetch from the exact validated IP while retaining TLS SNI/hostname checks."""
    parsed = _parse_url(url)
    if parsed is None or parsed.hostname is None:
        raise FetchPolicyError(f"Refusing malformed source URL: {url}")
    target = parsed.path or "/"
    if parsed.query:
        target += f"?{parsed.query}"
    pool = urllib3.HTTPSConnectionPool(
        host=address,
        port=parsed.port or 443,
        assert_hostname=parsed.hostname,
        server_hostname=parsed.hostname,
        cert_reqs="CERT_REQUIRED",
        ca_certs=requests.certs.where(),
        timeout=urllib3.Timeout(connect=FETCH_TIMEOUT[0], read=FETCH_TIMEOUT[1]),
        maxsize=1,
        block=True,
    )
    raw = pool.urlopen(
        "GET",
        target,
        headers={"Host": parsed.hostname, "User-Agent": USER_AGENT, "Accept-Encoding": "identity"},
        redirect=False,
        retries=False,
        preload_content=False,
    )
    response = requests.Response()
    response.status_code = raw.status
    response.headers = CaseInsensitiveDict(raw.headers)
    response.url = url
    response.raw = raw
    return response


def _read_bounded_response(response: requests.Response, expected_types: tuple[str, ...]) -> requests.Response:
    try:
        content_type = response.headers.get("Content-Type", "").split(";", 1)[0].strip().lower()
        if not content_type or not any(content_type == expected or content_type.startswith(f"{expected}+") for expected in expected_types):
            raise FetchPolicyError(f"Unexpected response content type: {content_type or 'missing'}")
        try:
            declared_size = int(response.headers.get("Content-Length", "0"))
        except ValueError as error:
            raise FetchPolicyError("Invalid Content-Length from source") from error
        if declared_size < 0 or declared_size > MAX_RESPONSE_BYTES:
            raise FetchPolicyError(f"Invalid or oversized Content-Length from source: {declared_size}")
        chunks = []
        size = 0
        for chunk in response.iter_content(chunk_size=64 * 1024):
            if not chunk:
                continue
            size += len(chunk)
            if size > MAX_RESPONSE_BYTES:
                raise FetchPolicyError(f"Response exceeds {MAX_RESPONSE_BYTES} bytes")
            chunks.append(chunk)
        response._content = b"".join(chunks)
        response._content_consumed = True
        return response
    finally:
        response.close()


def fetch(url: str, attempts: int = 4, expected_types: tuple[str, ...] = ("text/html", "application/xml", "text/xml")) -> requests.Response:
    last = None
    for attempt in range(attempts):
        current = url
        for redirect_count in range(MAX_REDIRECTS + 1):
            approved_addresses = validate_source_url(current)
            connection_errors = []
            last = None
            for address in approved_addresses:
                try:
                    last = _request_pinned(current, address)
                    break
                except (OSError, urllib3.exceptions.HTTPError) as error:
                    connection_errors.append(str(error))
            if last is None:
                if attempt + 1 == attempts:
                    raise FetchPolicyError(f"All approved source addresses failed: {'; '.join(connection_errors)}")
                break
            if last.status_code in {301, 302, 303, 307, 308}:
                location = last.headers.get("Location")
                last.close()
                if not location or redirect_count == MAX_REDIRECTS:
                    raise FetchPolicyError("Source exceeded the safe redirect limit")
                current = _safe_urljoin(current, location)
                continue
            if last.status_code == 200:
                return _read_bounded_response(last, expected_types)
            last.close()
            break
        time.sleep(0.7 * (attempt + 1))
    assert last is not None
    return last
