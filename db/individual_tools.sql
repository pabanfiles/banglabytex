-- ১. আগের গ্রুপ টুলগুলো ডিলিট করা (PDF Tools, Image Tools)
DELETE FROM tool_pages WHERE slug IN ('pdf-tools', 'image-tools', 'video-downloader');

-- ২. প্রতিটি আলাদা টুলের জন্য নতুন এন্ট্রি তৈরি করা
INSERT INTO tool_pages (slug, h1_title, meta_desc, intro_text, faq_json, is_active) VALUES 
('pdf-editor', 'Free PDF Editor Online', 'Edit PDF text, images, and links directly in your browser.', 'Edit your PDF files easily without any software.', '[]', 1),
('pdf-merge', 'Merge PDF Files Online Free', 'Combine multiple PDF documents into one.', 'Merge unlimited PDF files into a single document.', '[]', 1),
('pdf-compress', 'Compress PDF Online Free', 'Reduce PDF file size without losing quality.', 'Make your PDF files smaller and easier to share.', '[]', 1),
('pdf-split', 'Split PDF Online Free', 'Separate one PDF into multiple files.', 'Extract specific pages or split a large PDF.', '[]', 1),
('image-compress', 'Compress Image Online Free', 'Reduce JPG, PNG, WebP file sizes.', 'Optimize your images for web use.', '[]', 1),
('image-convert', 'Image Converter Online Free', 'Convert images to different formats.', 'Convert PNG to JPG, WebP, and more.', '[]', 1),
('age-calculator', 'Age Calculator Online Free', 'Calculate your exact age in years, months, and days.', 'Find out exactly how old you are.', '[]', 1),
('percentage-calculator', 'Percentage Calculator Online Free', 'Calculate percentages quickly and easily.', 'Find the percentage of any number instantly.', '[]', 1),
('qr-generator', 'QR Code Generator Online Free', 'Create custom QR codes for links and text.', 'Generate high-quality QR codes instantly.', '[]', 1),
('video-downloader', 'Free Video Downloader Online', 'Download videos from social media.', 'Save your favorite social media videos.', '[]', 1);