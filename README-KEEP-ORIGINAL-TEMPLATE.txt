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
- The GitHub Pages custom domain is villateagchildrenshome.org. In Safaricom's DNS manager, remove conflicting web-hosting records for @ and www, add A records for @ pointing to 185.199.108.153, 185.199.109.153, 185.199.110.153, and 185.199.111.153, and add a CNAME for www pointing to mutukudennis300.github.io. Keep the CNAME file in the published site.
- In the repository's Settings > Pages, set the custom domain to villateagchildrenshome.org and enable Enforce HTTPS after DNS has propagated and the certificate is ready. The current domain points to Safaricom hosting and shows an empty directory until its DNS records are changed.
- DNS changes must be made by someone with access to the Safaricom account. Allow time for DNS propagation, then verify both https://villateagchildrenshome.org and https://www.villateagchildrenshome.org and confirm the www address redirects to the apex domain.
- In Google Search Console, add villateagchildrenshome.org as a Domain property and copy Google's verification TXT record into Safaricom DNS at the root (@, or the equivalent blank host field). Add it alongside the website records; do not replace the A or CNAME records. Verify ownership after the TXT record propagates.
- Once the website changes are published and the custom domain is serving the site, submit https://villateagchildrenshome.org/sitemap.xml in Search Console's Sitemaps report and request indexing for the home page. Google decides when and whether pages appear in search results.
- The site's factual content, general location, and published photographs have been reviewed and approved by Villa Teag management.
- The privacy and safeguarding policies have been reviewed and approved by management.
- The contact and volunteer forms use FormSubmit and deliver submissions to villateag@gmail.com. Complete FormSubmit's first-use email activation if prompted, then test both forms on the deployed site.
- Check mobile navigation, keyboard access, links, photos, and form delivery on the deployed site.
- Keep contact details, policies, and published content current when organisational information changes.
