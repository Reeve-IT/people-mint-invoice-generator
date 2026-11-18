# People-Mint Invoice Generator

A static, browser-based invoice generator prototype. No server or installation is required.

## Run locally
1. Extract the ZIP.
2. Open `index.html` in Chrome or Edge. (VS Code Live Server also works.)
3. Replace the clearly marked blank company-detail placeholders in `config.js` with verified details before issuing invoices.
4. Add the official logo at `assets/logo.png` and set `logoPath: "assets/logo.png"` in `config.js`.
5. Fill in the invoice form and click **Download PDF**. In the print dialog, choose **Save as PDF**.

## Important setup
- `config.js` intentionally contains no private company identifiers or payment details. Add only verified company information before issuing invoices.
- GST fields and GST calculations are intentionally omitted because the business has said it is not currently GST-registered. Confirm invoice wording and tax treatment with the company's accountant.
- This prototype saves invoice records in the current browser's local storage only. Records do not sync between computers or browsers and can be lost if browser data is cleared.
- The invoice number is entered/generated in the browser. This prototype does not provide centralized, collision-proof invoice numbering for multiple users.

## Publish a preview link
You can publish this static folder using GitHub Pages or Netlify. The source and configuration are public when published from a public repository, so never add private credentials or real client invoices. Saved invoices remain in each browser's local storage. For a client-facing production system, add authentication, secure server-side storage, backups, role permissions and audit history first.
