-- ১. Protect PDF (Lock) আপডেট
UPDATE tool_pages SET 
intro_text = 'Learn how to add a secure password to your PDF files. Protect sensitive information like bank statements, contracts, and personal documents with AES-256 encryption.',
faq_json = '[
  {"q":"Is this PDF Protect tool free?","a":"Yes, you can add passwords to your PDFs completely free of charge."},
  {"q":"How secure is the password protection?","a":"We use industry-standard AES-256 encryption, which is highly secure."},
  {"q":"Do you store my password?","a":"No, your password is never saved or logged on our servers."},
  {"q":"Can I set permissions for printing?","a":"Yes, our backend allows setting specific permissions like disabling printing or copying."},
  {"q":"Does it work on mobile phones?","a":"Yes, it is fully compatible with mobile browsers."},
  {"q":"Can I remove the password later?","a":"Yes, use our Unlock PDF tool to remove it if you know the password."},
  {"q":"What is the maximum file size?","a":"You can upload files up to 50MB."},
  {"q":"Will the PDF open on any device?","a":"Yes, password-protected PDFs can be opened on Adobe Reader, Mac Preview, etc."},
  {"q":"Is my data safe?","a":"Yes, files are processed securely and deleted immediately after download."},
  {"q":"Do I need to create an account?","a":"No, you can use the tool anonymously."},
  {"q":"Can I protect multiple files at once?","a":"Currently, you can process one file at a time."},
  {"q":"What happens if I forget the password?","a":"Unfortunately, without the password, the PDF cannot be opened."},
  {"q":"Does it add a watermark?","a":"No, we do not add watermarks."},
  {"q":"Does it work on Mac?","a":"Yes, it works in any modern browser on Mac or Windows."},
  {"q":"How long does it take?","a":"Processing usually takes just a few seconds."},
  {"q":"Is there a limit to how many times I can use it?","a":"No, you can use it unlimited times."},
  {"q":"Can I protect a scanned PDF?","a":"Yes, any valid PDF can be protected."},
  {"q":"What if the tool fails?","a":"Try refreshing the page or checking your internet connection."},
  {"q":"Is it legal to protect a PDF?","a":"Yes, protecting your own documents is perfectly legal."},
  {"q":"Do I need to install software?","a":"No, everything runs online."}
]' WHERE slug = 'pdf-protect';

-- ২. Unlock PDF আপডেট
UPDATE tool_pages SET 
intro_text = 'Remove passwords from your PDF files instantly. If you have a locked PDF that you own and need to remove the password, our free tool can help you.',
faq_json = '[
  {"q":"Is this PDF Unlock tool free?","a":"Yes, it is 100% free."},
  {"q":"Can I unlock a PDF without a password?","a":"No, you must provide the current password to remove it."},
  {"q":"Is it legal to unlock a PDF?","a":"Only unlock documents you own or have explicit permission to access."},
  {"q":"How fast is the unlocking process?","a":"It is very fast, usually taking just a few seconds."},
  {"q":"Will the quality be lost?","a":"No, the original formatting and images are preserved perfectly."},
  {"q":"Does it work on scanned PDFs?","a":"Yes, encryption does not affect image quality."},
  {"q":"Can I unlock multiple PDFs at once?","a":"One file at a time is supported."},
  {"q":"Is my password stored?","a":"No, the password is only used for the decryption process and immediately discarded."},
  {"q":"Does it work on all devices?","a":"Yes, it works on smartphones, tablets, and computers."},
  {"q":"Do you add a watermark?","a":"No watermarks are added."},
  {"q":"What is the maximum file size?","a":"Up to 50MB."},
  {"q":"Can I unlock a PDF if I forgot the password?","a":"No, we do not support password cracking."},
  {"q":"Does it work on Mac?","a":"Yes, it runs in your browser."},
  {"q":"Is there a limit to usage?","a":"No limits."},
  {"q":"How long does it take?","a":"Seconds."},
  {"q":"Can I unlock a file with printing restrictions?","a":"Yes, it removes all restrictions."},
  {"q":"Do I need an account?","a":"No signup required."},
  {"q":"What if it fails?","a":"Check if your password is correct."},
  {"q":"Do you keep my files?","a":"No, files are deleted immediately."},
  {"q":"Is it safe?","a":"Yes, highly secure."}
]' WHERE slug = 'pdf-unlock';

-- ৩. Merge PDF আপডেট
UPDATE tool_pages SET 
intro_text = 'Combine multiple PDF documents into one single file. Our tool is perfect for organizing invoices, merging study materials, or compiling reports.',
faq_json = '[
  {"q":"Is this PDF Merge tool free?","a":"Yes, completely free."},
  {"q":"How many PDFs can I merge?","a":"You can merge as many files as you want."},
  {"q":"Will the quality be reduced?","a":"No, the original quality is preserved."},
  {"q":"Can I reorder the files?","a":"Yes, you can drag and drop to set the order."},
  {"q":"Are my files safe?","a":"Yes, files are processed in your browser."},
  {"q":"Does it work on mobile?","a":"Yes, fully responsive."},
  {"q":"Is there a size limit?","a":"No strict limit."},
  {"q":"Can I merge password-protected PDFs?","a":"You must unlock them first."},
  {"q":"Do you store my files?","a":"No, your files never leave your device."},
  {"q":"Does it add watermarks?","a":"No."},
  {"q":"Can I merge PDFs on Mac?","a":"Yes."},
  {"q":"How long does it take?","a":"A few seconds."},
  {"q":"Is it legal?","a":"Yes, if you own the files."},
  {"q":"Do I need an account?","a":"No."},
  {"q":"Can I merge images into the PDF?","a":"No, use Image to PDF."},
  {"q":"What if it fails?","a":"Retry with smaller files."},
  {"q":"Need to install software?","a":"No."},
  {"q":"Does it work on Windows?","a":"Yes."},
  {"q":"Can I merge from Google Drive?","a":"Download first."},
  {"q":"Unlimited usage?","a":"Yes."}
]' WHERE slug = 'pdf-merge';