VILLA TEAG CHILDREN'S HOME — STATIC WEBSITE

This project is a plain HTML/CSS/JavaScript website. Open index.html through a local or hosted web server for the intended page navigation and asset paths.

ASSETS
- css/bootstrap.min.css is the locally bundled Bootstrap stylesheet used by the pages.
- js/bootstrap.bundle.min.js is the matching Bootstrap JavaScript bundle.
- Original, non-WebP photos belong in images_backup/.
- The website uses WebP photos from images/, resized to at most 1800 pixels and saved at quality 75.
- Run .\convert.bat from PowerShell or Command Prompt in the project folder to convert new photos from images_backup/ into images/. The script skips existing WebP files, keeps the originals, and updates gallery-images.json so new photos appear in the gallery.
- The converter asks for alt text for each new photo when run interactively. Existing alt text is preserved on later runs.
- Conversion requires Python 3 and Pillow. Install Pillow with: py -3 -m pip install -r requirements-convert.txt
- On Windows, use .\convert.bat rather than the bare command "convert", which is reserved for the system disk-conversion utility.
- Bootstrap Icons are loaded from jsDelivr, so those icons require an internet connection.

DEPLOYMENT CHECKS
- The site's factual content, general location, and published photographs have been reviewed and approved by Villa Teag management.
- The privacy and safeguarding policies have been reviewed and approved by management.
- The contact and volunteer forms use FormSubmit and deliver submissions to villateag@gmail.com. Complete FormSubmit's first-use email activation if prompted, then test both forms on the deployed site.
- Check mobile navigation, keyboard access, links, photos, and form delivery on the deployed site.
- Keep contact details, policies, and published content current when organisational information changes.
