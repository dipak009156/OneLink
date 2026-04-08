const puppeteer = require('puppeteer-core')
const path = require('path')

/**
 * Generates a PDF buffer from an HTML string.
 * @param {string} html - Fully rendered HTML string
 * @returns {Promise<Buffer>} PDF buffer
 */
const generatePdf = async (html) => {
  let browser = null
  try {
    // Windows Common Chrome Paths
    const executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    })

    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    
    // Evaluate some CSS to ensure print backgrounds are on
    await page.addStyleTag({ content: 'body { -webkit-print-color-adjust: exact; }' })

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true
    })

    return pdfBuffer
  } catch (err) {
    console.error('PDF Generation Error:', err)
    throw err
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

module.exports = { generatePdf }
