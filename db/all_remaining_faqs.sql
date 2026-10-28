-- ১. PDF Split
UPDATE tool_pages SET faq_json = '[
  {"q":"Is Split PDF free?","a":"Yes, 100% free."},
  {"q":"How do I split a PDF?","a":"Upload and select the pages you want to extract."},
  {"q":"Can I split all pages?","a":"Yes, you can separate every page into individual files."},
  {"q":"Is my data safe?","a":"Yes, files are processed locally in your browser."},
  {"q":"Does it work on mobile?","a":"Yes, fully responsive."},
  {"q":"Is there a size limit?","a":"No strict limit, but large files take time."},
  {"q":"Do I need an account?","a":"No."},
  {"q":"Will quality drop?","a":"No, original quality is preserved."},
  {"q":"Can I split password-protected PDFs?","a":"You must unlock them first."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"How fast is it?","a":"A few seconds."},
  {"q":"Can I merge after splitting?","a":"Yes, use the Merge tool."},
  {"q":"Do you add watermarks?","a":"No."},
  {"q":"What if it fails?","a":"Retry or check file integrity."},
  {"q":"Is it legal?","a":"Yes, if you have rights."},
  {"q":"Are files deleted?","a":"Yes, immediately."},
  {"q":"Need to install software?","a":"No."},
  {"q":"Can I split by custom range?","a":"Yes."},
  {"q":"Does it work on Windows?","a":"Yes."},
  {"q":"Unlimited usage?","a":"Yes."}
]' WHERE slug = 'pdf-split';

-- ২. PDF Compress
UPDATE tool_pages SET faq_json = '[
  {"q":"Is compression free?","a":"Yes."},
  {"q":"How much can I compress?","a":"Up to 80% smaller."},
  {"q":"Is quality lost?","a":"Minimal loss."},
  {"q":"Can I compress large files?","a":"Yes, up to 50MB."},
  {"q":"Is it safe?","a":"Yes."},
  {"q":"Does it work on mobile?","a":"Yes."},
  {"q":"Do I need to sign up?","a":"No."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"How fast?","a":"Few seconds."},
  {"q":"Can I see size change?","a":"Yes, live preview."},
  {"q":"Is there a limit?","a":"No."},
  {"q":"Do you store files?","a":"No."},
  {"q":"Can I compress password PDFs?","a":"Unlock first."},
  {"q":"Is it legal?","a":"Yes."},
  {"q":"Can I compress scanned PDFs?","a":"Yes."},
  {"q":"What if it fails?","a":"Try again."},
  {"q":"Are files deleted?","a":"Yes."},
  {"q":"Does it work on Windows?","a":"Yes."},
  {"q":"Can I download immediately?","a":"Yes."},
  {"q":"Unlimited usage?","a":"Yes."}
]' WHERE slug = 'pdf-compress';

-- ৩. Image Compress
UPDATE tool_pages SET faq_json = '[
  {"q":"Is image compression free?","a":"Yes."},
  {"q":"Which formats supported?","a":"JPG, PNG, WebP."},
  {"q":"How much can I reduce?","a":"Up to 80%."},
  {"q":"Is quality lost?","a":"Minimal."},
  {"q":"Can I compress multiple images?","a":"Yes."},
  {"q":"Is it safe?","a":"Yes."},
  {"q":"Does it work on mobile?","a":"Yes."},
  {"q":"Do I need an account?","a":"No."},
  {"q":"Can I see size change?","a":"Yes, live preview."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"How fast?","a":"Very fast."},
  {"q":"Is there a limit?","a":"No."},
  {"q":"Do you store images?","a":"No."},
  {"q":"Can I convert formats?","a":"Yes."},
  {"q":"Is it legal?","a":"Yes."},
  {"q":"Does it work on Windows?","a":"Yes."},
  {"q":"What if it fails?","a":"Retry."},
  {"q":"Can I compress transparent PNGs?","a":"Yes."},
  {"q":"Are files deleted?","a":"Yes."},
  {"q":"Can I compress for web?","a":"Yes."}
]' WHERE slug = 'image-compress';

-- ৪. Age Calculator
UPDATE tool_pages SET faq_json = '[
  {"q":"How is age calculated?","a":"Exact years, months, and days."},
  {"q":"Does it handle leap years?","a":"Yes."},
  {"q":"Can I find my age in the future?","a":"Yes."},
  {"q":"Is it free?","a":"Yes."},
  {"q":"Does it work on mobile?","a":"Yes."},
  {"q":"Is my data stored?","a":"No."},
  {"q":"Can I share the result?","a":"Yes."},
  {"q":"Does it show days of the week?","a":"Not yet."},
  {"q":"Can I use it for official forms?","a":"Yes, accurate."},
  {"q":"Is there an app?","a":"No."},
  {"q":"How accurate?","a":"100%."},
  {"q":"Do I need an account?","a":"No."},
  {"q":"Can I calculate pet age?","a":"Yes."},
  {"q":"Does it work offline?","a":"No."},
  {"q":"Is it legal?","a":"Yes."},
  {"q":"Can I calculate age on a specific date?","a":"Yes."},
  {"q":"Is it fast?","a":"Instant."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"Are there ads?","a":"No."},
  {"q":"Unlimited usage?","a":"Yes."}
]' WHERE slug = 'age-calculator';