UPDATE posts SET content = '## Why PDFs get large

A PDF file carries everything the reader needs: pages, fonts, images, annotations. When someone scans a paper document and saves it as a PDF, each page is stored as a full-colour image. A single page at 300 DPI can weigh five to ten megabytes. Multiply that by twenty pages and you have a file that is difficult to email and impossible to upload to a portal that accepts only a small file.

Photographs inside a PDF are the main culprit. A scanned page is stored as a JPEG, and the JPEG inside the PDF is often saved at a very high quality because the scanner does not know what the final use will be. Text and vector shapes are small by comparison.

## The right way to shrink a PDF

There are two honest ways to reduce a PDF. The first is to recompress the images inside. The second is to rebuild the file with object streams so the internal structure is tighter. The first gives the biggest saving, but it changes the images. The second keeps the pages looking the same and only saves a few percent.

The best result usually comes from a combination: shrink large images first, then rebuild the file. If the original photos are still available, compress them with an image compressor before you build the PDF, and the output will be small from the start.

## Checking the result

Open the compressed file in a reader, scroll to a page with fine text and a page with a photo, and check the edges. If the text is still sharp and the photo still looks natural, the size reduction is safe. If the text is blurry, you have gone too far.

Always keep a copy of the original PDF. Compressing twice stacks the loss. Rebuilding from the original each time gives the best quality at the smallest size.

## When the file cannot shrink further

Some PDFs are already close to the smallest possible size. If a form is text-only and was exported by a modern tool, it is already tight. In that case, the only remaining saving comes from removing unnecessary pages or splitting the file into smaller parts. The split tool on this site can help with the second option.' WHERE id = 1;
UPDATE posts SET content = '## Why image quality matters

Every time you save a JPEG, the encoder throws away some detail to keep the file small. That is fine once. Repeat the same save on the already-compressed file and the damage compounds. Photos start to look soft, text develops a glow, and smooth areas like sky turn into blocky patches.

The right way to keep quality is to compress once from the original. Keep the original in a safe folder, compress a copy to the target size, and use that copy for sharing. If you need a smaller version later, compress a copy of the original, not of the copy.

## Choosing a target size

A small reduction to around 85 to 90 percent of the original file size usually looks identical. A moderate reduction to 70 percent loses a little detail in smooth areas. Going below 50 percent rarely looks good unless the image is mostly solid colour.

The target depends on where the image will be used. A profile picture shown at 200 pixels wide does not need the full resolution of a 12-megapixel photo. A print of the same photo does. Match the resolution to the final display size and then choose the quality.

## A practical workflow

Start with the original. Crop to the part you need, because a smaller frame keeps the subject sharper at the same file size. Then resize to the final pixel size. Finally, compress to the target file size. Doing this in the right order means one encode instead of three, and the result stays clean.

## What to avoid

Do not compress a screenshot that will be read on screen; take a fresh screenshot instead. Do not compress a PNG with transparency to JPEG unless you accept white corners. Do not assume the smallest file is the best; quality matters for anything printed or shown on a large display.' WHERE id = 2;
UPDATE posts SET content = '## Why exact age matters

Age is simple until someone asks for it exactly. Exam forms cut off at a specific date, sports categories use birth-year brackets, and pension rules change by month. A rough answer like around forty can put you in the wrong group.

An exact age calculator compares two dates and gives you the answer in years, months and days. From there you can read off any other unit you need: total days for a custody tracker, total weeks for a pregnancy, total months for a policy.

## How the calculation works

The tool subtracts the year, then the month, then the day, borrowing from the month above when the day is negative. Leap years are handled by the calendar itself: 29 February in a leap year exists, and the difference uses the real date.

A common mistake is to count only whole years. If you were born on 29 February, some calculators quietly move your birthday to 28 February in non-leap years. The correct answer for an official form is to check the specific rule of that form.

## Using the target date

The target date lets you answer questions like how old will I be on the exam date or what was my age on a past anniversary. Set the target date and the same three-number answer appears. This is useful for retirement planning, exam eligibility, and legal age calculations on a specific day.

## Privacy

Your birth date is personal. A good age calculator does not send it to a server. Everything runs in the browser, and the result disappears when you close the tab.' WHERE id = 3;
UPDATE posts SET content = '## What a PDF to Word conversion needs

A PDF describes how a page looks, not how the text is structured. A Word document stores paragraphs, headings, tables and lists. Converting one to the other means guessing the structure. A clean PDF exported from Word is easy. A scanned PDF is hard, because the converter must first recognise the text, then group it into paragraphs.

A browser-based converter works best for text-based PDFs, where the text is stored inside the file as selectable characters. Scanned PDFs need OCR, and OCR introduces errors even on clean pages.

## Getting the best result

Start from a clean source. If the PDF was exported from Word, keep the original DOCX and convert from that instead. If the only source is a scan, run OCR first and correct obvious errors before you edit the layout.

Check the page breaks. Converters often break paragraphs at odd places because the PDF has no paragraph markers. Fixing the breaks in Word takes a few minutes and gives a much better document.

## When to keep the PDF

If you only need to read or share the file, keep the PDF. A PDF looks the same on every device. Word documents change layout when the fonts are missing. Convert to Word only when you need to edit the text or copy it out.

## Privacy

A good converter runs locally or on a trusted server. Read the tool privacy note before uploading a confidential document.' WHERE id = 5;
UPDATE posts SET content = '## Why edit a PDF at all

PDFs are meant to be final, but real life needs small edits: fixing a typo in a cover letter, adding a signature image, filling a form field, or correcting a date. A full PDF editor is powerful but heavy. Many small edits can be done with simpler tools that run in the browser.

## Common edits and the right tool

For text on a page, a text extraction tool plus a new PDF rebuild is safer than trying to patch the original. For images, an image compressor or cropper handles the change, then the image can be re-inserted. For signatures, a transparent PNG over the page works in most cases. For page order, split and merge are enough.

## Checking the result

Open the edited PDF in a strict reader like Adobe Acrobat Reader. Check that the edit is on the correct page, that the layout did not shift, and that the file still opens without warnings. Some tools quietly re-encode images; check that photos still look sharp.

## Privacy

Anything confidential should stay on your device. Use browser-based tools where the processing happens locally, and keep a copy of the original in case something goes wrong.' WHERE id = 8;