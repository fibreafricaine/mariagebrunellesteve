import asyncio
from playwright.async_api import async_playwright

async def scrape_page(browser, url, name):
    print(f"Scraping {url}...")
    page = await browser.new_page()
    try:
        await page.goto(url, wait_until="networkidle", timeout=60000)
        # Wait a bit extra for dynamic react rendering
        await asyncio.sleep(5)
        
        # Get text content of the body
        text_content = await page.inner_text("body")
        
        # Save text content
        filename_text = f"scraped_{name}_text.txt"
        with open(filename_text, "w", encoding="utf-8") as f:
            f.write(text_content)
        print(f"Saved text to {filename_text}")
        
        # Let's check for specific selectors
        # e.g. schedule events, stories, faqs
        # We can also save the page HTML
        html_content = await page.content()
        filename_html = f"scraped_{name}_page.html"
        with open(filename_html, "w", encoding="utf-8") as f:
            f.write(html_content)
        print(f"Saved HTML to {filename_html}")
            
    except Exception as e:
        print(f"Error scraping {url}: {e}")
    finally:
        await page.close()

async def main():
    async with async_playwright() as p:
        # Launch browser (headless by default)
        try:
            browser = await p.chromium.launch()
        except Exception as launch_err:
            print("Chromium launch failed, attempting to install chromium...", launch_err)
            # We will run a command outside this script if it fails, or try launch other browsers if chromium fails
            return
            
        urls = {
            "welcome": "https://withjoy.com/tryphene-et-brady",
            "schedule": "https://withjoy.com/tryphene-et-brady/schedule",
            "fiancailles": "https://withjoy.com/tryphene-et-brady/nos-fiancailles",
            "info": "https://withjoy.com/tryphene-et-brady/informations-utiles",
            "contact": "https://withjoy.com/tryphene-et-brady/contact"
        }
        
        for name, url in urls.items():
            await scrape_page(browser, url, name)
            
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
