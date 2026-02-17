const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5001';
const SCREENSHOT_DIR = path.join(__dirname, 'test_screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR);
}

async function runUITests() {
    console.log('Starting UI Tests (v2)...');
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        // Test 1: Desktop View
        console.log('Testing Desktop View (1920x1080)...');
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

        // Wait for hero to ensure load
        await page.waitForSelector('.hero');
        console.log('Hero section loaded.');

        const title = await page.title();
        console.log(`Page Title: ${title}`);

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop_homepage.png'), fullPage: true });
        console.log('Captured desktop_homepage.png');

        // Verify Nav Links
        const navLinks = await page.$$eval('.nav-links a', links => links.map(l => l.innerText));
        console.log('Navigation Links found:', navLinks.length);

        // Test 2: Mobile View
        console.log('Testing Mobile View (375x812)...');
        await page.setViewport({ width: 375, height: 812 });
        // Give time for layout adjustment
        await new Promise(r => setTimeout(r, 1000));

        // Check for Hamburger
        console.log('Waiting for .hamburger selector...');
        try {
            await page.waitForSelector('.hamburger', { visible: true, timeout: 5000 });
            console.log('Hamburger menu is visible.');
        } catch (e) {
            console.error('Hamburger menu NOT visible. Taking debug screenshot.');
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_debug_fail.png') });
            throw e;
        }

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_homepage.png') }); // fullPage might look weird on mobile
        console.log('Captured mobile_homepage.png');

        // Open Menu
        await page.click('.hamburger');
        await new Promise(r => setTimeout(r, 1000)); // Wait for animation
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile_menu_open.png') });
        console.log('Captured mobile_menu_open.png');

        console.log('UI Tests Completed Successfully.');

    } catch (error) {
        console.error('UI Test Failed:', error);
    } finally {
        await browser.close();
    }
}

runUITests();
