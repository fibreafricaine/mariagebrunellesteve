import asyncio
from playwright.async_api import async_playwright
import sys

async def run_tests():
    print("Starting automated tests for Brunelle & Steve wedding site...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Enable console and error logging for debugging
        page.on("pageerror", lambda err: print(f"PAGE ERROR: {err}"))
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        
        try:
            # 1. Load the page
            url = "http://localhost:8000/"
            print(f"Loading {url}...")
            await page.goto(url, wait_until="networkidle", timeout=15000)
            
            # 2. Check title
            title = await page.title()
            print(f"Page Title: {title}")
            assert "Brunelle & Steve" in title, "Title should contain Brunelle & Steve"
            
            # 3. Check countdown elements
            days = await page.inner_text("#days")
            hours = await page.inner_text("#hours")
            minutes = await page.inner_text("#minutes")
            seconds = await page.inner_text("#seconds")
            print(f"Countdown State: {days}d {hours}h {minutes}m {seconds}s")
            assert days.isdigit() and int(days) >= 0, "Days should be a non-negative number"
            
            # 4. Fill and submit RSVP form
            print("Testing RSVP Form submission...")
            await page.fill("#rsvp-name", "Test Guest")
            # Select 2 guests
            await page.select_option("#rsvp-guests", "2")
            await page.fill("#rsvp-message", "Félicitations aux mariés !")
            
            # Submit form
            await page.click(".rsvp-submit-btn")
            await page.wait_for_timeout(1000) # wait for animation
            
            # Check success message
            success_visible = await page.is_visible("#rsvp-success")
            print(f"RSVP Success message visible: {success_visible}")
            assert success_visible, "Success message should be visible after RSVP submission"
            
            # 5. Check localStorage
            rsvps_json = await page.evaluate("localStorage.getItem('wedding_rsvp_list')")
            print(f"RSVPs stored in localStorage: {rsvps_json}")
            assert rsvps_json is not None, "RSVP should be saved in localStorage"
            assert "Test Guest" in rsvps_json, "Stored RSVP should contain guest name"
            
            # 6. Test Lightbox
            print("Testing photo gallery Lightbox...")
            # Click first gallery item
            await page.click(".gallery-item[data-index='0']")
            await page.wait_for_timeout(500) # wait for transition
            
            lightbox_visible = await page.is_visible("#lightbox")
            print(f"Lightbox visible: {lightbox_visible}")
            assert lightbox_visible, "Lightbox should open when clicking a gallery item"
            
            lightbox_img_src = await page.get_attribute("#lightbox-img", "src")
            print(f"Lightbox image source: {lightbox_img_src}")
            assert "WhatsApp" in lightbox_img_src, "Lightbox image should load correct source file"
            
            # Close lightbox
            await page.click("#lightbox-close")
            await page.wait_for_timeout(500)
            lightbox_visible_after = await page.is_visible("#lightbox")
            print(f"Lightbox visible after closing: {lightbox_visible_after}")
            
            print("--- ALL TESTS PASSED SUCCESSFULLY! ---")
            
        except Exception as e:
            print(f"Test failed: {e}")
            sys.exit(1)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(run_tests())
