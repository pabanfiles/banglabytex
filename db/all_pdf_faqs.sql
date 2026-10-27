-- Merge PDF FAQ
UPDATE tool_pages SET faq_json = '[
  {"q":"Is this PDF merge tool free?","a":"Yes, 100% free with no limits."},
  {"q":"Do I need to sign up?","a":"No, you can merge PDFs instantly."},
  {"q":"Are my files safe?","a":"Yes, processing happens securely."},
  {"q":"How many PDFs can I merge?","a":"You can merge unlimited files."},
  {"q":"Will the quality drop?","a":"No, original quality is preserved."},
  {"q":"Can I reorder files?","a":"Yes, you can drag and drop."},
  {"q":"Does it work on mobile?","a":"Yes, fully responsive."},
  {"q":"Is there a size limit?","a":"No strict limit."},
  {"q":"Can I merge password-protected PDFs?","a":"You must unlock them first."},
  {"q":"Do you keep my files?","a":"No, files are deleted immediately."},
  {"q":"Can I use it offline?","a":"No, internet is required initially."},
  {"q":"Does it add a watermark?","a":"No watermarks are added."},
  {"q":"Does it work on Mac?","a":"Yes, works on any browser."},
  {"q":"How long does it take?","a":"Usually a few seconds."},
  {"q":"Is it legal?","a":"Yes, if you have the rights."},
  {"q":"Can I merge images?","a":"No, use the Image to PDF tool."},
  {"q":"What if it fails?","a":"Try refreshing and retrying."},
  {"q":"Need to install software?","a":"No, runs in your browser."},
  {"q":"Can I merge Google Drive PDFs?","a":"Download them first."},
  {"q":"Is there a usage limit?","a":"No, it is unlimited."}
]' WHERE slug = 'pdf-merge';

-- Split PDF FAQ
UPDATE tool_pages SET faq_json = '[
  {"q":"Is the split tool free?","a":"Yes, completely free."},
  {"q":"How do I split a PDF?","a":"Upload and select pages to split."},
  {"q":"Can I split specific pages?","a":"Yes, you can choose page ranges."},
  {"q":"Is my data safe?","a":"Yes, files are not stored."},
  {"q":"Does it work on mobile?","a":"Yes, fully responsive."},
  {"q":"Can I split into single pages?","a":"Yes, easily."},
  {"q":"Is there a limit?","a":"No limit."},
  {"q":"Do I need an account?","a":"No signup needed."},
  {"q":"Will quality drop?","a":"No, quality is preserved."},
  {"q":"Can I split password-protected PDFs?","a":"Unlock them first."},
  {"q":"Does it work on Mac?","a":"Yes, on any browser."},
  {"q":"How fast is it?","a":"Very fast, a few seconds."},
  {"q":"Can I merge after splitting?","a":"Yes, use the merge tool."},
  {"q":"Do you add watermarks?","a":"No."},
  {"q":"Is there a size limit?","a":"No strict limit."},
  {"q":"What if it fails?","a":"Retry or check file integrity."},
  {"q":"Can I split an entire folder?","a":"No, only files."},
  {"q":"Need to install?","a":"No software needed."},
  {"q":"Is it legal?","a":"Yes, if you have rights."},
  {"q":"Are files deleted?","a":"Yes, immediately."}
]' WHERE slug = 'pdf-split';

-- Compress PDF FAQ
UPDATE tool_pages SET faq_json = '[
  {"q":"Is compression free?","a":"Yes, 100% free."},
  {"q":"How much can I compress?","a":"Up to 80% smaller."},
  {"q":"Is quality lost?","a":"Minimal loss, optimized."},
  {"q":"Can I compress large files?","a":"Yes, up to 50MB."},
  {"q":"Is it safe?","a":"Yes, secure processing."},
  {"q":"Does it work on mobile?","a":"Yes."},
  {"q":"Can I compress multiple PDFs?","a":"Yes, one by one."},
  {"q":"Do I need to sign up?","a":"No."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"How fast is it?","a":"Few seconds."},
  {"q":"Can I see the size change?","a":"Yes, live preview."},
  {"q":"What if quality is bad?","a":"Adjust percentage."},
  {"q":"Is there a limit?","a":"No."},
  {"q":"Do you store files?","a":"No."},
  {"q":"Can I compress password PDFs?","a":"Unlock first."},
  {"q":"Is it legal?","a":"Yes."},
  {"q":"Does it work on Windows?","a":"Yes."},
  {"q":"Can I compress scanned PDFs?","a":"Yes."},
  {"q":"What if it fails?","a":"Try again."},
  {"q":"Are files deleted?","a":"Yes."}
]' WHERE slug = 'pdf-compress';

-- Image Compress FAQ
UPDATE tool_pages SET faq_json = '[
  {"q":"Is image compression free?","a":"Yes, 100% free."},
  {"q":"Which formats supported?","a":"JPG, PNG, WebP."},
  {"q":"How much can I reduce?","a":"Up to 80%."},
  {"q":"Is quality lost?","a":"Minimal, optimized."},
  {"q":"Can I compress multiple images?","a":"Yes."},
  {"q":"Is it safe?","a":"Yes, secure."},
  {"q":"Does it work on mobile?","a":"Yes."},
  {"q":"Do I need an account?","a":"No."},
  {"q":"Can I see size change?","a":"Yes, live preview."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"How fast?","a":"Very fast."},
  {"q":"Is there a limit?","a":"No."},
  {"q":"Do you store images?","a":"No."},
  {"q":"Can I convert formats?","a":"Yes, use converter."},
  {"q":"Is it legal?","a":"Yes."},
  {"q":"Does it work on Windows?","a":"Yes."},
  {"q":"What if it fails?","a":"Retry."},
  {"q":"Can I compress transparent PNGs?","a":"Yes, transparency preserved."},
  {"q":"Are files deleted?","a":"Yes."},
  {"q":"Can I compress for web?","a":"Yes, ideal for web."}
]' WHERE slug = 'image-compress';