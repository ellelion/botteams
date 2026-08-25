#!/usr/bin/env python3
# /// script
# requires-python = ">=3.9"
# dependencies = ["google-auth>=2.30,<3"]
# ///
"""Read-only Google Ads keyword ideas for Ellelion SEO/AEO/GEO research."""

from __future__ import annotations

import argparse
import datetime as dt
import importlib.util
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional


DEFAULT_API_VERSION = "v25"
ADS_SCOPE = "https://www.googleapis.com/auth/adwords"
PRODUCTION_LEVELS = {"basic", "standard"}
DEFAULT_ENV_FILE = Path.home() / ".secrets/ellelion/google-ads.env"
DEFAULT_CREDENTIALS_FILE = (
    Path.home() / ".secrets/ellelion/google-ads-service-account.json"
)

GEO_TARGETS = {
    "AU": "2036",
    "CA": "2124",
    "DE": "2276",
    "ES": "2724",
    "FR": "2250",
    "GB": "2826",
    "IL": "2376",
    "IN": "2356",
    "JP": "2392",
    "KR": "2410",
    "MX": "2484",
    "US": "2840",
}

LANGUAGE_TARGETS = {
    "ar": "1019",
    "de": "1001",
    "en": "1000",
    "es": "1003",
    "fr": "1002",
    "he": "1027",
    "iw": "1027",
    "it": "1004",
    "ja": "1005",
    "ko": "1012",
    "pt": "1014",
    "zh_cn": "1017",
    "zh_tw": "1018",
}

ENV_KEYS = {
    "GOOGLE_ADS_ACCESS_LEVEL",
    "GOOGLE_ADS_ACCESS_TOKEN",
    "GOOGLE_ADS_ACCOUNT_HAS_SPEND",
    "GOOGLE_ADS_ADC_FILE",
    "GOOGLE_ADS_API_VERSION",
    "GOOGLE_ADS_CREDENTIALS_FILE",
    "GOOGLE_ADS_CUSTOMER_ID",
    "GOOGLE_ADS_DEVELOPER_TOKEN",
    "GOOGLE_ADS_LOGIN_CUSTOMER_ID",
}


def load_env_file(path: Path = DEFAULT_ENV_FILE) -> None:
    """Load known keys without overriding the calling process environment."""
    if not path.is_file():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        if key not in ENV_KEYS or key in os.environ:
            continue
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            value = value[1:-1]
        os.environ[key] = value


def clean_customer_id(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    cleaned = re.sub(r"\D", "", value)
    return cleaned or None


def google_auth_available() -> bool:
    try:
        return importlib.util.find_spec("google.oauth2.service_account") is not None
    except ModuleNotFoundError:
        return False


def credentials_path() -> Optional[Path]:
    raw = os.getenv("GOOGLE_ADS_CREDENTIALS_FILE") or os.getenv("GOOGLE_ADS_ADC_FILE")
    if raw:
        return Path(raw).expanduser()
    if DEFAULT_CREDENTIALS_FILE.is_file():
        return DEFAULT_CREDENTIALS_FILE
    return None


def get_access_token() -> str:
    direct = os.getenv("GOOGLE_ADS_ACCESS_TOKEN")
    if direct:
        return direct

    key_path = credentials_path()
    if not key_path or not key_path.is_file():
        raise RuntimeError("Dedicated Google Ads service-account credentials are missing")
    try:
        from google.auth.transport.requests import Request
        from google.oauth2 import service_account
    except ImportError as exc:
        raise RuntimeError(
            "google-auth is missing; rerun scripts/install-agent-tooling.sh or use uv run --script"
        ) from exc

    try:
        credentials = service_account.Credentials.from_service_account_file(
            str(key_path), scopes=[ADS_SCOPE]
        )
        credentials.refresh(Request())
    except Exception as exc:  # google-auth exposes provider-specific exception types
        raise RuntimeError("Dedicated Google Ads credentials could not mint a token") from exc
    if not credentials.token:
        raise RuntimeError("Dedicated Google Ads credentials returned an empty token")
    return str(credentials.token)


def config_state() -> Dict[str, Any]:
    developer_token = os.getenv("GOOGLE_ADS_DEVELOPER_TOKEN")
    customer_id = clean_customer_id(os.getenv("GOOGLE_ADS_CUSTOMER_ID"))
    login_customer_id = clean_customer_id(os.getenv("GOOGLE_ADS_LOGIN_CUSTOMER_ID"))
    access_level = os.getenv("GOOGLE_ADS_ACCESS_LEVEL", "test").strip().lower()
    api_version = os.getenv("GOOGLE_ADS_API_VERSION", DEFAULT_API_VERSION).strip()
    key_path = credentials_path()
    direct_token = bool(os.getenv("GOOGLE_ADS_ACCESS_TOKEN"))
    key_configured = bool(key_path and key_path.is_file())
    auth_dependency_ready = direct_token or google_auth_available()
    missing: List[str] = []
    if not developer_token:
        missing.append("GOOGLE_ADS_DEVELOPER_TOKEN")
    if not customer_id:
        missing.append("GOOGLE_ADS_CUSTOMER_ID")
    if not login_customer_id:
        missing.append("GOOGLE_ADS_LOGIN_CUSTOMER_ID")
    if not direct_token and not key_configured:
        missing.append("GOOGLE_ADS_CREDENTIALS_FILE")
    if key_configured and not auth_dependency_ready:
        missing.append("google-auth")

    production_access = access_level in PRODUCTION_LEVELS
    return {
        "accessLevel": access_level,
        "apiVersion": api_version,
        "credentialSource": (
            "access-token" if direct_token else "service-account" if key_configured else "missing"
        ),
        "customerIdConfigured": bool(customer_id),
        "dedicatedAuthConfigured": direct_token or key_configured,
        "developerTokenConfigured": bool(developer_token),
        "googleAuthInstalled": google_auth_available(),
        "loginCustomerIdConfigured": bool(login_customer_id),
        "missing": missing,
        "productionAccessDeclared": production_access,
        "ready": not missing and production_access,
    }


def doctor(args: argparse.Namespace) -> int:
    state = config_state()
    if args.live and state["ready"]:
        try:
            get_access_token()
            state["liveCredentialCheck"] = "passed"
        except RuntimeError as exc:
            state["liveCredentialCheck"] = "failed"
            state["liveCredentialError"] = str(exc)
            state["ready"] = False
    elif args.live:
        state["liveCredentialCheck"] = "skipped-not-ready"
    print(json.dumps(state, indent=2, sort_keys=True))
    return 0 if state["ready"] else 2


def seed_payload(args: argparse.Namespace) -> Dict[str, Any]:
    keywords = args.keyword or []
    if len(keywords) > 20:
        raise RuntimeError("Use at most 20 --keyword values per request")
    if args.site:
        return {"siteSeed": {"site": args.site}}
    if keywords and args.url:
        return {"keywordAndUrlSeed": {"keywords": keywords, "url": args.url}}
    if keywords:
        return {"keywordSeed": {"keywords": keywords}}
    if args.url:
        return {"urlSeed": {"url": args.url}}
    raise RuntimeError("Provide --keyword, --url, or --site")


def resolve_geo_ids(args: argparse.Namespace) -> List[str]:
    resolved = list(args.geo_id or [])
    for value in args.geo or []:
        key = value.strip().upper()
        if key not in GEO_TARGETS:
            raise RuntimeError(
                "Unknown --geo value. Use a supported country code or numeric --geo-id"
            )
        resolved.append(GEO_TARGETS[key])
    if not resolved:
        raise RuntimeError("Provide --geo or --geo-id")
    if len(resolved) > 10:
        raise RuntimeError("Google Ads permits at most 10 geo targets per request")
    if any(not value.isdigit() for value in resolved):
        raise RuntimeError("Every --geo-id must be numeric")
    return list(dict.fromkeys(resolved))


def resolve_language_id(args: argparse.Namespace) -> str:
    if args.language_id:
        if not args.language_id.isdigit():
            raise RuntimeError("--language-id must be numeric")
        return args.language_id
    if not args.language:
        raise RuntimeError("Provide --language or --language-id")
    key = args.language.strip().lower().replace("-", "_")
    if key not in LANGUAGE_TARGETS:
        raise RuntimeError(
            "Unknown --language value. Use a supported code or numeric --language-id"
        )
    return LANGUAGE_TARGETS[key]


def safe_http_error(exc: urllib.error.HTTPError) -> str:
    raw = exc.read().decode("utf-8", errors="replace")
    try:
        payload = json.loads(raw)
        error = payload.get("error", {})
        message = error.get("message") or "Google Ads API request failed"
        details = error.get("details", [])
        request_id = exc.headers.get("request-id")
        return json.dumps(
            {
                "httpStatus": exc.code,
                "message": message,
                "requestId": request_id,
                "details": details,
            },
            sort_keys=True,
        )
    except json.JSONDecodeError:
        return f"HTTP {exc.code}: {raw[:1000]}"


def ideas(args: argparse.Namespace) -> int:
    state = config_state()
    if not state["ready"]:
        raise RuntimeError(
            "Google Ads production access is not ready. Run doctor. KeywordPlanIdeaService "
            "requires Basic or Standard Access; Explorer and Test Access are insufficient."
        )

    developer_token = os.environ["GOOGLE_ADS_DEVELOPER_TOKEN"]
    customer_id = clean_customer_id(os.environ["GOOGLE_ADS_CUSTOMER_ID"])
    login_customer_id = clean_customer_id(os.environ["GOOGLE_ADS_LOGIN_CUSTOMER_ID"])
    assert customer_id and login_customer_id
    geo_ids = resolve_geo_ids(args)
    language_id = resolve_language_id(args)
    body = {
        "language": f"languageConstants/{language_id}",
        "geoTargetConstants": [f"geoTargetConstants/{geo}" for geo in geo_ids],
        "includeAdultKeywords": False,
        "keywordPlanNetwork": "GOOGLE_SEARCH",
        "pageSize": min(args.limit, 10000),
        **seed_payload(args),
    }
    endpoint = (
        f"https://googleads.googleapis.com/{state['apiVersion']}/customers/"
        f"{customer_id}:generateKeywordIdeas"
    )
    request = urllib.request.Request(
        endpoint,
        data=json.dumps(body).encode("utf-8"),
        method="POST",
        headers={
            "Authorization": f"Bearer {get_access_token()}",
            "Content-Type": "application/json",
            "developer-token": developer_token,
            "login-customer-id": login_customer_id,
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=args.timeout) as response:
            payload = json.load(response)
            request_id = response.headers.get("request-id")
    except urllib.error.HTTPError as exc:
        raise RuntimeError(f"Google Ads API returned {safe_http_error(exc)}") from exc

    results = payload.get("results", [])
    results.sort(
        key=lambda item: int(
            item.get("keywordIdeaMetrics", {}).get("avgMonthlySearches", 0) or 0
        ),
        reverse=True,
    )
    account_has_spend = os.getenv("GOOGLE_ADS_ACCOUNT_HAS_SPEND", "false").lower() == "true"
    output = {
        "apiVersion": state["apiVersion"],
        "metricsPrecision": "standard" if account_has_spend else "approximate-no-spend",
        "nextPageToken": payload.get("nextPageToken"),
        "requestId": request_id,
        "results": results[: args.limit],
        "retrievedAt": dt.datetime.now(dt.timezone.utc).isoformat(),
        "seed": seed_payload(args),
        "source": "Google Ads KeywordPlanIdeaService.GenerateKeywordIdeas",
        "target": {
            "accountHasSpend": account_has_spend,
            "geoTargetIds": geo_ids,
            "languageId": language_id,
            "network": "GOOGLE_SEARCH",
        },
        "totalSize": payload.get("totalSize"),
    }
    print(json.dumps(output, indent=2, sort_keys=True))
    return 0


def parser() -> argparse.ArgumentParser:
    root = argparse.ArgumentParser(
        description="Read-only Google Ads keyword ideas for SEO/AEO/GEO research"
    )
    root.add_argument(
        "--env-file",
        type=Path,
        default=DEFAULT_ENV_FILE,
        help="private config file; default ~/.secrets/ellelion/google-ads.env",
    )
    commands = root.add_subparsers(dest="command", required=True)

    doctor_parser = commands.add_parser("doctor", help="check configuration without secrets")
    doctor_parser.add_argument("--live", action="store_true", help="also mint a short-lived token")
    doctor_parser.set_defaults(handler=doctor)

    ideas_parser = commands.add_parser("ideas", help="generate keyword ideas and metrics")
    ideas_parser.add_argument("--keyword", action="append", help="seed keyword; repeat as needed")
    ideas_parser.add_argument("--url", help="seed one public page URL")
    ideas_parser.add_argument("--site", help="seed an entire owned public site")
    ideas_parser.add_argument("--geo", action="append", help="country code such as US or IL")
    ideas_parser.add_argument("--geo-id", action="append", help="numeric Google geo criterion ID")
    ideas_parser.add_argument("--language", help="language code such as en, de, es, he, or ja")
    ideas_parser.add_argument("--language-id", help="numeric Google language criterion ID")
    ideas_parser.add_argument("--limit", type=int, default=100, help="maximum results (1-10000)")
    ideas_parser.add_argument("--timeout", type=int, default=60, help="HTTP timeout in seconds")
    ideas_parser.set_defaults(handler=ideas)
    return root


def main() -> int:
    args = parser().parse_args()
    load_env_file(args.env_file.expanduser())
    if args.command == "ideas":
        if args.site and (args.keyword or args.url):
            print("error: --site cannot be combined with --keyword or --url", file=sys.stderr)
            return 2
        if args.limit < 1 or args.limit > 10000:
            print("error: --limit must be between 1 and 10000", file=sys.stderr)
            return 2
        for raw_url in [args.url, args.site]:
            if raw_url and urllib.parse.urlparse(raw_url).scheme not in {"http", "https"}:
                print("error: --url and --site require an http(s) URL", file=sys.stderr)
                return 2
    try:
        return args.handler(args)
    except (RuntimeError, urllib.error.URLError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
