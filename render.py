#!/usr/bin/env python3
"""Render meme/index.html to meme.png at 1280 by 1200."""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
HTML = ROOT / "meme" / "index.html"
OUT = ROOT / "meme.png"


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path="/usr/bin/google-chrome",
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        page = browser.new_page(viewport={"width": 1280, "height": 1200}, device_scale_factor=1)
        page.goto(HTML.as_uri())
        page.screenshot(path=str(OUT), clip={"x": 0, "y": 0, "width": 1280, "height": 1200})
        browser.close()
    print(OUT)


if __name__ == "__main__":
    main()
