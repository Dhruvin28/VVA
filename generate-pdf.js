const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set a wide viewport for best layout
    await page.setViewport({ width: 1440, height: 900 });

    // Load the HTML file
    const filePath = path.resolve(__dirname, 'main.html');
    await page.goto(`file:///${filePath.replace(/\\/g, '/')}`, {
        waitUntil: 'networkidle0',
        timeout: 60000
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');

    // Small delay to ensure all CSS gradients and backgrounds render
    await new Promise(r => setTimeout(r, 2000));

    // Generate PDF
    await page.pdf({
        path: path.resolve(__dirname, 'VAVA-Portfolio.pdf'),
        format: 'A4',
        printBackground: true,          // Critical: preserves all backgrounds, gradients, colors
        preferCSSPageSize: false,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        displayHeaderFooter: false,
        scale: 0.65,                    // Scale down to fit the wide layout onto A4
    });

    console.log('PDF generated successfully: VAVA-Portfolio.pdf');
    await browser.close();
})();
