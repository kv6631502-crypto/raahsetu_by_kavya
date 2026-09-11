"""Supabase access-token validation and application role lookup."""

import os
from typing import Annotated, Literal

import httpx
import psycopg
from fastapi import Depends, Header, HTTPException
from pydantic import BaseModel


class AuthUser(BaseModel):
    id: str
    email: str | None = None
    role: Literal["field_official", "reviewer", "admin"] = "field_official"
    region_code: str | None = None


def require_user(authorization: Annotated[str | None, Header()] = None) -> AuthUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, detail="Sign in as a field official")
    base_url = os.getenv("SUPABASE_URL")
    api_key = os.getenv("SUPABASE_PUBLISHABLE_KEY")
    if not base_url or not api_key:
        token = authorization.removeprefix("Bearer ").strip()
        if os.getenv("ALLOW_DEMO_AUTH", "false").lower() == "true" and token.startswith(("demo", "test")):
            role = "admin" if "admin" in token else "reviewer" if "reviewer" in token else "field_official"
            return AuthUser(id="11111111-1111-1111-1111-111111111111", email="demo@raahsetu.in", role=role, region_code=None)
        raise HTTPException(503, detail="Supabase authentication is not configured")
    try:
        response = httpx.get(
            f"{base_url}/auth/v1/user",
            headers={"apikey": api_key, "Authorization": authorization},
            timeout=8,
        )
    except httpx.HTTPError as exc:
        raise HTTPException(503, detail="Authentication service is unavailable") from exc
    if response.status_code != 200:
        raise HTTPException(401, detail="Session expired or invalid")
    identity = response.json()
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        return AuthUser(id=identity["id"], email=identity.get("email"), role="field_official", region_code=None)
    with psycopg.connect(database_url, sslmode="require") as conn:
        profile = conn.execute(
            "select role,region_code from profiles where id=%s", (identity["id"],)
        ).fetchone()
    if not profile:
        raise HTTPException(403, detail="User profile is not provisioned")
    return AuthUser(id=identity["id"], email=identity.get("email"), role=profile[0], region_code=profile[1])


def require_reviewer(user: Annotated[AuthUser, Depends(require_user)]) -> AuthUser:
    if user.role not in {"reviewer", "admin"}:
        raise HTTPException(403, detail="Reviewer role required")
    return user
