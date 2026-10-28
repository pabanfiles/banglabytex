-- ১. Image to PDF (২০টি FAQ)
UPDATE tool_pages SET faq_json = '[
  {"q":"Is this Image to PDF converter free?","a":"Yes, our tool is 100% free with no hidden charges or watermarks."},
  {"q":"How do I convert multiple images into one PDF?","a":"Simply upload your images, and our tool will automatically combine them into a single PDF in the order you select."},
  {"q":"Are my images uploaded to your server?","a":"No, all processing happens directly in your browser. Your images never leave your device, ensuring 100% privacy."},
  {"q":"Can I reorder the images before creating the PDF?","a":"Currently, images are added in the order you select them. We recommend selecting them in the desired sequence."},
  {"q":"What image formats are supported?","a":"We support JPG, JPEG, PNG, and WebP formats."},
  {"q":"Is there a limit on how many images I can convert?","a":"There is no strict limit, but converting a very large number of high-resolution images may slow down your browser."},
  {"q":"Will the image quality be reduced?","a":"No, we embed the images at their original resolution to maintain the highest possible quality."},
  {"q":"Does it work on mobile phones?","a":"Yes, the tool is fully responsive and works perfectly on iOS and Android devices."},
  {"q":"Do I need to install any software?","a":"No, you only need a modern web browser like Chrome, Safari, or Edge."},
  {"q":"Can I convert transparent PNGs to PDF?","a":"Yes, transparent areas will be preserved and rendered correctly in the PDF."},
  {"q":"How long does the conversion take?","a":"It usually takes just a few seconds depending on the size of the images."},
  {"q":"Is there a file size limit?","a":"While there is no strict limit, browser memory limits may apply for extremely large files (e.g., over 50MB per image)."},
  {"q":"Can I password-protect the resulting PDF?","a":"Not directly here, but you can use our Protect PDF tool after creating the PDF."},
  {"q":"Does it add a watermark?","a":"No, your PDF will be completely clean and watermark-free."},
  {"q":"Can I merge PDFs after converting images?","a":"Yes, you can use our Merge PDF tool to combine this new PDF with existing ones."},
  {"q":"Is it legal to convert images to PDF?","a":"Yes, as long as you have the rights to the images, it is perfectly legal."},
  {"q":"Can I use this tool offline?","a":"You need an internet connection to load the page initially, but processing happens locally."},
  {"q":"Will the PDF work on all PDF readers?","a":"Yes, it creates a standard PDF compatible with Adobe Reader, Mac Preview, etc."},
  {"q":"How do I download the PDF?","a":"Click the Convert button and the PDF will automatically download to your device."},
  {"q":"Do you store my files?","a":"No, we do not store any files. Everything is processed securely in your browser."
]' WHERE slug = 'image-to-pdf';

-- ২. Image Color Picker (২০টি FAQ)
UPDATE tool_pages SET faq_json = '[
  {"q":"How do I use the Image Color Picker?","a":"Upload any image, then click anywhere on the image to instantly get the HEX color code of that pixel."},
  {"q":"Is this tool free?","a":"Yes, it is completely free and requires no signup."},
  {"q":"Can I get RGB values instead of HEX?","a":"Our tool currently provides the HEX code, which is the standard for web design."},
  {"q":"How accurate is the color picker?","a":"It is 100% accurate as it reads the exact pixel data from your uploaded image."},
  {"q":"Is my image uploaded to a server?","a":"No, the image is processed locally in your browser using the HTML5 Canvas API."},
  {"q":"What image formats are supported?","a":"You can use JPG, PNG, WebP, or GIF files."},
  {"q":"Can I copy the HEX code easily?","a":"Yes, there is a copy button next to the HEX code for one-click copying."},
  {"q":"Does it work on mobile phones?","a":"Yes, you can tap on the image on your phone to pick colors."},
  {"q":"Can I pick a color from a specific area?","a":"You can click anywhere. For more precision, zoom in on the image before clicking."},
  {"q":"Do you save the images I upload?","a":"No, we do not save, store, or share your images."},
  {"q":"Is it useful for web designers?","a":"Absolutely! It is perfect for extracting brand colors or finding the exact shade to use in CSS."},
  {"q":"Can I use it for digital art?","a":"Yes, it is a great tool for referencing colors for digital painting or graphic design."},
  {"q":"What is a HEX code?","a":"A HEX code is a 6-digit code (like #FFFFFF) used in HTML and CSS to represent colors."},
  {"q":"Does the tool work on Mac?","a":"Yes, it works on any operating system with a modern browser."},
  {"q":"What if the color doesn''t look right?","a":"Make sure you are clicking on the exact pixel. Zooming in can help."},
  {"q":"Is there a limit to image size?","a":"Very large images may take a moment to load in the browser, but there is no strict limit."},
  {"q":"Do I need an account?","a":"No account is required."},
  {"q":"Can I use this for print design?","a":"HEX is for screen. For print, you would need CMYK, but HEX is a good starting point."},
  {"q":"Are there ads on the page?","a":"We aim to keep the experience clean and fast, with minimal interruptions."},
  {"q":"How do I clear the image?","a":"Simply refresh the page to start over with a new image."
]' WHERE slug = 'image-color-picker';

-- ৩. Image Watermark (২০টি FAQ)
UPDATE tool_pages SET faq_json = '[
  {"q":"How do I add a watermark to my image?","a":"Upload your image, type your watermark text, and click apply. The tool will add the text to your image."},
  {"q":"Is this watermark tool free?","a":"Yes, it is 100% free to use."},
  {"q":"Can I choose the watermark position?","a":"Currently, the watermark is placed at the bottom-left. We plan to add position options soon."},
  {"q":"Can I change the color of the watermark?","a":"The current version uses a semi-transparent white color for visibility. Advanced color options are coming."},
  {"q":"Is my image safe?","a":"Yes, all processing is done in your browser. Your images are never uploaded."},
  {"q":"What formats are supported?","a":"JPG, PNG, and WebP are supported."},
  {"q":"Does it work on mobile?","a":"Yes, fully responsive on all devices."},
  {"q":"Can I use an image as a watermark?","a":"Currently, only text watermarks are supported."},
  {"q":"Will the watermark ruin my image?","a":"No, it is applied with transparency so the image remains visible."},
  {"q":"Can I remove the watermark later?","a":"Since the watermark is baked into the image, you should keep a backup of the original."},
  {"q":"Is there a limit to the text length?","a":"No, but longer text may go off-screen. We recommend short text."},
  {"q":"Do you store my images?","a":"No, we do not store anything."},
  {"q":"Can I watermark multiple images?","a":"Currently, one at a time."},
  {"q":"What font is used?","a":"We use a bold sans-serif font for maximum visibility."},
  {"q":"Does it work offline?","a":"No, you need an internet connection to load the tool."},
  {"q":"Is it useful for photographers?","a":"Yes, it is great for protecting your photos before sharing them online."},
  {"q":"Can I use it for business?","a":"Yes, you can use it for personal or commercial projects."},
  {"q":"How large is the watermark?","a":"The font size is fixed, but we may add a size slider in the future."},
  {"q":"Is the watermark transparent?","a":"Yes, it has an opacity of 60% so it blends nicely."},
  {"q":"How do I save the image?","a":"Click the button and it will download automatically."
]' WHERE slug = 'image-watermark';

-- ৪. Favicon Generator (২০টি FAQ)
UPDATE tool_pages SET faq_json = '[
  {"q":"What is a Favicon?","a":"A favicon is the small icon that appears in the browser tab next to your website title."},
  {"q":"How do I generate a favicon?","a":"Upload any square image, and our tool will resize it to 64x64 pixels and convert it to PNG."},
  {"q":"Is it free?","a":"Yes, completely free."},
  {"q":"What size should my original image be?","a":"For best results, use an image that is at least 512x512 pixels and square."},
  {"q":"Can I use a non-square image?","a":"It will be stretched to a square, which might distort it. We recommend a square image."},
  {"q":"Is my image safe?","a":"Yes, it is processed locally in your browser."},
  {"q":"What format is the output?","a":"The output is a PNG file, which is widely supported."},
  {"q":"Where do I put the favicon on my site?","a":"You upload it to your site root and link it in the HTML head tag."},
  {"q":"Does it work on mobile?","a":"Yes."},
  {"q":"Can I generate an .ico file?","a":"Currently, we generate PNG. Most modern browsers support PNG favicons."},
  {"q":"Do I need an account?","a":"No."},
  {"q":"Do you store my image?","a":"No, it is discarded after processing."},
  {"q":"Is it good for SEO?","a":"A favicon helps with branding and user trust, which indirectly helps SEO."},
  {"q":"Can I use it for multiple sites?","a":"Yes, you can generate as many as you want."},
  {"q":"What if my image has a transparent background?","a":"Transparency is preserved in the PNG output."},
  {"q":"How fast is it?","a":"Instant."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"Can I resize the favicon later?","a":"You can re-upload and generate a new one if needed."},
  {"q":"Is it legal?","a":"Yes, if you own the image."},
  {"q":"How do I download it?","a":"Click the generate button and it will download."
]' WHERE slug = 'favicon-generator';

-- ৫. Background Remover (২০টি FAQ)
UPDATE tool_pages SET faq_json = '[
  {"q":"How does this Background Remover work?","a":"It analyzes the image and removes pixels that are close to pure white, making them transparent."},
  {"q":"Is it AI-powered?","a":"No, this is a fast, browser-based threshold tool. It works best on images with solid white backgrounds."},
  {"q":"Is it free?","a":"Yes, 100% free."},
  {"q":"What types of images work best?","a":"Product photos or portraits taken against a plain white wall or studio backdrop."},
  {"q":"Will it remove complex backgrounds?","a":"Not perfectly. For complex backgrounds, you might need an AI tool. We are working on adding AI soon."},
  {"q":"Is my image uploaded?","a":"No, it runs entirely in your browser."},
  {"q":"What formats are supported?","a":"JPG, PNG, and WebP."},
  {"q":"Does it work on mobile?","a":"Yes."},
  {"q":"What is the output format?","a":"It outputs a transparent PNG."},
  {"q":"Can I adjust the sensitivity?","a":"Currently, the threshold is fixed at 200 (out of 255). We may add a slider later."},
  {"q":"Do you store the image?","a":"No."},
  {"q":"Is it good for e-commerce?","a":"Yes, it is perfect for quickly removing white backgrounds from product photos."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"Is there a size limit?","a":"Large images may take a second, but no strict limit."},
  {"q":"Do I need an account?","a":"No."},
  {"q":"How do I download?","a":"Click the button and it downloads instantly."},
  {"q":"What if the background isn''t removed?","a":"The background might not be pure white. Try a different image."},
  {"q":"Can I use it for logos?","a":"Yes, if the logo has a white background."},
  {"q":"Is it legal?","a":"Yes."},
  {"q":"Can I remove black backgrounds?","a":"Not yet. This version is tuned for white."}
]' WHERE slug = 'bg-remover';

-- ৬. Image Resizer (২০টি FAQ)
UPDATE tool_pages SET faq_json = '[
  {"q":"How do I resize an image?","a":"Upload your image, enter the desired width and height, and click resize."},
  {"q":"Is it free?","a":"Yes."},
  {"q":"Will resizing distort my image?","a":"If you change the aspect ratio, yes. To avoid this, calculate the proportional height or width."},
  {"q":"What formats are supported?","a":"JPG, PNG, WebP."},
  {"q":"Is my image safe?","a":"Yes, it never leaves your browser."},
  {"q":"Can I resize to a specific pixel size?","a":"Yes, you can enter exact pixel values."},
  {"q":"Does it work on mobile?","a":"Yes."},
  {"q":"Can I upscale an image?","a":"Yes, but enlarging may cause pixelation."},
  {"q":"Do you store my image?","a":"No."},
  {"q":"Do I need an account?","a":"No."},
  {"q":"What is the maximum size?","a":"Browser memory limits apply, but typically handles up to 20-30MP images."},
  {"q":"How fast is it?","a":"Instant."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"Can I resize multiple images?","a":"One at a time."},
  {"q":"Is the quality preserved?","a":"We use high-quality canvas rendering."},
  {"q":"Can I resize for social media?","a":"Yes, e.g., 1080x1080 for Instagram."},
  {"q":"How do I download?","a":"Click resize and it downloads automatically."},
  {"q":"Is it legal?","a":"Yes."},
  {"q":"Does it work offline?","a":"No."},
  {"q":"Can I keep the aspect ratio?","a":"Not automatically yet, but you can calculate it manually."}
]' WHERE slug = 'image-resize';

-- ৭. Image Converter (২০টি FAQ)
UPDATE tool_pages SET faq_json = '[
  {"q":"How do I convert an image format?","a":"Upload your image, select the target format (PNG, JPG, WebP), and click convert."},
  {"q":"Is it free?","a":"Yes."},
  {"q":"What formats can I convert to?","a":"PNG, JPG, and WebP."},
  {"q":"Will quality be lost?","a":"Converting to JPG involves slight compression, but we use high quality (90%). PNG and WebP are lossless/high quality."},
  {"q":"Is my image uploaded?","a":"No, it is processed locally."},
  {"q":"Does it work on mobile?","a":"Yes."},
  {"q":"Do you store my image?","a":"No."},
  {"q":"Do I need an account?","a":"No."},
  {"q":"Can I convert WebP to JPG?","a":"Yes, this is one of the most popular uses."},
  {"q":"Can I convert PNG to WebP?","a":"Yes."},
  {"q":"How fast is it?","a":"Instant."},
  {"q":"Does it work on Mac?","a":"Yes."},
  {"q":"Is there a limit?","a":"No strict limit."},
  {"q":"Can I convert multiple images?","a":"One at a time."},
  {"q":"What is the output quality?","a":"We use 90% quality for JPG to balance size and quality."},
  {"q":"How do I download?","a":"Click convert and it downloads automatically."},
  {"q":"Is it legal?","a":"Yes."},
  {"q":"Does it work offline?","a":"No."},
  {"q":"Can I batch convert?","a":"Not yet."},
  {"q":"Does it preserve transparency?","a":"Yes, when converting to PNG or WebP."}
]' WHERE slug = 'image-convert';