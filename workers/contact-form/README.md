# Contact form Worker

The endpoint of the contact page's form (`/uk-UA/atlas/contact-us`): it takes the request as JSON, checks it, and
emails it to the founders through [Resend](https://resend.com), with the sender as Reply-To. Nothing is stored.

- Only the pages in `ALLOWED_ORIGINS` (`wrangler.jsonc`) may post; five requests a minute per IP.
- A filled-in hidden `website` field (the form's bot trap) gets a 200 and no email.
- Responses: `200 {ok}`, `400` invalid, `413` too large, `429` too many, `502` Resend failed (logged).

## Setup (once)

1. **Resend:** add the domain `daat.ua` (Domains → Add) and put the DNS records it shows into Cloudflare's DNS for
   daat.ua; wait for "Verified". Create an API key with "Sending access".
2. **Deploy:**
   ```sh
   cd workers/contact-form
   npm install
   npx wrangler login
   npx wrangler secret put RESEND_API_KEY   # the key from step 1
   npx wrangler secret put MAIL_TO          # e.g. olena@…,serhii@…
   npm run deploy                           # serves it at https://forms.daat.ua
   ```
3. **The site:** set `PUBLIC_CONTACT_FORM_URL=https://forms.daat.ua` in Railway's service variables (and in `.env`
   for local tries) and redeploy.

## Local

`npm run dev` runs it at http://localhost:8787 with secrets from `.dev.vars` (git-ignored):

```
RESEND_API_KEY=re_…
MAIL_TO=you@example.com
```
