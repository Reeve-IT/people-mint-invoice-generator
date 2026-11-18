# People-Mint Invoice Generator

A static, browser-based invoice generator prototype. No server or installation is required.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in Chrome or Edge. (VS Code Live Server also works.)
3. Replace the clearly marked blank company-detail placeholders in `config.js` with verified details before issuing invoices.
4. The official logo is stored at `assets/people-mint-logo.png.jpeg` and configured in `config.js`.
5. Fill in the invoice form and click **Download PDF**. In the print dialog, choose **Save as PDF**.

## Important setup
- Set `gstin` in `config.js` only if a verified company GSTIN should appear on the invoice. The optional Client GSTIN is entered per invoice and is retained with saved invoices.
- GSTINs are informational only. The invoice does not calculate or add GST or other tax charges. Confirm invoice wording and tax treatment with the company's accountant.
- This prototype saves invoice records in the current browser's local storage only. Records do not sync between computers or browsers and can be lost if browser data is cleared.
- The invoice number is entered/generated in the browser. This prototype does not provide centralized, collision-proof invoice numbering for multiple users.

## Publish a preview link
You can publish this static folder using GitHub Pages or Netlify. The source and configuration are public when published from a public repository, so never add private credentials or real client invoices. Saved invoices remain in each browser's local storage. For a client-facing production system, add authentication, secure server-side storage, backups, role permissions and audit history first.
