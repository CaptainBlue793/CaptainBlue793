"""Build the profile README's compact stats graphic from public GitHub data."""

from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parents[1]
USERNAME = "CaptainBlue793"
API = "https://api.github.com"


def get_json(path: str) -> dict | list:
    headers = {
        "Accept": "application/vnd.github+json",
        "User-Agent": "CaptainBlue793-profile-dashboard",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = Request(f"{API}{path}", headers=headers)
    with urlopen(request, timeout=20) as response:
        return json.load(response)


def public_repositories() -> list[dict]:
    repositories: list[dict] = []
    page = 1
    while True:
        batch = get_json(f"/users/{USERNAME}/repos?type=owner&per_page=100&page={page}")
        if not isinstance(batch, list):
            raise ValueError("Expected a list of repositories from GitHub")
        repositories.extend(batch)
        if len(batch) < 100:
            return repositories
        page += 1


def graphic(theme: str, repositories: int, stars: int, followers: int) -> str:
    palette = {
        "light": {"text": "#24292f", "muted": "#57606a", "rule": "#d0d7de", "accent": "#6d42d8"},
        "dark": {"text": "#f0f6fc", "muted": "#8b949e", "rule": "#30363d", "accent": "#b39aff"},
    }[theme]
    metrics = (
        ("PUBLIC REPOSITORIES", repositories, 96),
        ("STARS RECEIVED", stars, 289),
        ("FOLLOWERS", followers, 530),
    )
    columns = "\n".join(
        f'<text x="{x}" y="91" class="value">{value:,}</text>'
        f'<text x="{x}" y="119" class="label">{label}</text>'
        for label, value, x in metrics
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="676" height="158" viewBox="0 0 676 158" role="img" aria-labelledby="title desc">
<title id="title">Palak Deb Patra — GitHub at a glance</title>
<desc id="desc">{repositories:,} public repositories, {stars:,} stars received by owned non-fork repositories, and {followers:,} followers.</desc>
<style>
  .heading {{ fill: {palette['accent']}; font: 700 13px Arial, Helvetica, sans-serif; letter-spacing: 1.6px; }}
  .value {{ fill: {palette['text']}; font: 700 34px Arial, Helvetica, sans-serif; text-anchor: middle; }}
  .label {{ fill: {palette['muted']}; font: 600 10px Arial, Helvetica, sans-serif; letter-spacing: 1px; text-anchor: middle; }}
  .note {{ fill: {palette['muted']}; font: 12px Arial, Helvetica, sans-serif; }}
</style>
<text x="12" y="24" class="heading">GITHUB / AT A GLANCE</text>
<path d="M12 37H664M12 138H664" fill="none" stroke="{palette['rule']}"/>
<path d="M180 54V123M397 54V123" fill="none" stroke="{palette['rule']}"/>
{columns}
<text x="12" y="154" class="note">Public data · stars from owned non-fork repos · refreshed weekly</text>
</svg>
'''


def main() -> None:
    user = get_json(f"/users/{USERNAME}")
    if not isinstance(user, dict):
        raise ValueError("Expected a user record from GitHub")
    repos = public_repositories()
    count = int(user["public_repos"])
    if count != len(repos):
        raise ValueError(f"Repository count mismatch: user reports {count}, API returned {len(repos)}")
    stars = sum(int(repo["stargazers_count"]) for repo in repos if not repo["fork"])
    followers = int(user["followers"])
    for theme in ("light", "dark"):
        target = ROOT / "Icons" / "tech" / f"dashboard-{theme}.svg"
        target.write_text(graphic(theme, count, stars, followers), encoding="utf-8", newline="\n")
    print(f"Dashboard updated: {count} public repos, {stars} stars, {followers} followers")


if __name__ == "__main__":
    main()
