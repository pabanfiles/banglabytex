-- ১. Protect PDF (Lock) এর জন্য FAQ
UPDATE tool_pages SET faq_json = '[
  {"q":"Is this PDF Protect tool free?","a":"Yes, 100% free to use."},
  {"q":"How secure is the password protection?","a":"We use AES-256 encryption, the industry standard for security."},
  {"q":"Do you store my password?","a":"No, your password is never saved on our servers."},
  {"q":"Can I set permissions for printing?","a":"Yes, you can restrict printing and copying of the PDF."},
  {"q":"Does it work on mobile?","a":"Yes, it works on all devices."},
  {"q":"Can I remove the password later?","a":"Yes, using our Unlock PDF tool if you know the password."},
  {"q":"What is the maximum file size?","a":"You can upload files up to 50MB."},
  {"q":"Will the PDF still open on any device?","a":"Yes, protected PDFs can be opened on any standard PDF reader."},
  {"q":"Is my data safe?","a":"Yes, files are processed securely and deleted immediately."},
  {"q":"Do I need an account?","a":"No signup is required."}
]' WHERE slug = 'pdf-protect';

-- ২. Unlock PDF এর জন্য FAQ
UPDATE tool_pages SET faq_json = '[
  {"q":"Is this PDF Unlock tool free?","a":"Yes, it is completely free."},
  {"q":"Can I unlock a PDF without a password?","a":"No, you must know the current password to remove it."},
  {"q":"Is it legal to unlock a PDF?","a":"You should only unlock PDFs that you have the right to access."},
  {"q":"How fast is the unlocking process?","a":"It takes only a few seconds."},
  {"q":"Will the quality be lost?","a":"No, the original quality is preserved."},
  {"q":"Does it work on scanned PDFs?","a":"Yes, encryption does not affect scanned images."},
  {"q":"Can I unlock multiple PDFs?","a":"You can process them one by one."},
  {"q":"Is my password stored?","a":"No, it is used only for the unlocking process and discarded."},
  {"q":"Does it work on all devices?","a":"Yes, it runs in your browser."},
  {"q":"Do you add a watermark?","a":"No watermarks are added."}
]' WHERE slug = 'pdf-unlock';