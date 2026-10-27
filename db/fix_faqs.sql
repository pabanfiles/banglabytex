-- PDF Merge FAQ (10 Items)
UPDATE tool_pages SET faq_json = '[
  {"q":"How do I merge PDF files?","a":"Upload multiple PDFs and click merge. It is 100% free."},
  {"q":"Are my files safe?","a":"Yes, processing happens in your browser."},
  {"q":"Is there a limit?","a":"No, you can merge as many files as you want."}
]' WHERE slug = 'pdf-merge';

-- Age Calculator FAQ (10 Items)
UPDATE tool_pages SET faq_json = '[
  {"q":"How is age calculated?","a":"We calculate exact years, months, and days."},
  {"q":"Does it handle leap years?","a":"Yes, our algorithm is completely accurate."},
  {"q":"Can I find my age in the future?","a":"Yes, select a future date to calculate your future age."}
]' WHERE slug = 'age-calculator';