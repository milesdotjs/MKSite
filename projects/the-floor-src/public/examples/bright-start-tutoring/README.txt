Bright Start Tutoring - your website files
=========================================

This folder is a complete website. It was made with The Floor, a free tool
that turns a few clicks into a generic small-business site, on purpose.
Nothing here was written by a developer or by an AI.

FIRST: UNZIP IT
---------------
If you are reading this inside the ZIP file, unzip it first or nothing
will work properly:
  Windows:  right-click the ZIP file, choose "Extract All...", then open
            the new folder it creates.
  Mac:      double-click the ZIP file. A folder with the same name appears
            next to it.

WHAT'S IN THE FOLDER
--------------------
  index.html     your home page
  services.html  your services page
  about.html     your about page
  contact.html   your contact page
  styles.css     the colours, fonts and layout
  assets/        your logo and pictures, and the fonts the site uses
  README.txt     this file

TO LOOK AT IT
-------------
Double-click index.html. It opens in your web browser, and every menu link
works, straight from this folder. No internet connection needed.

TO PUT IT ONLINE (FREE, ABOUT 20 MINUTES)
-----------------------------------------
Any "static host", meaning a service that publishes plain files like these,
will host this folder for free. The simplest is Netlify Drop:

  1. Go to https://app.netlify.com/drop in your browser.
  2. It asks you to create a free account. Do that (email, or sign in with
     Google or GitHub).
  3. Drag the UNZIPPED folder onto the page: the folder that contains
     index.html. Not the ZIP file, and not the folder around it.
  4. In under a minute you get a web address that looks like
     https://quiet-river-1a2b3c.netlify.app. Open it. That's your site,
     live, with the padlock (https) already on.
  5. To change the random name, open the site in Netlify and go to
     Site configuration > Site details > Change site name. Still free.

Cloudflare Pages works the same way (Workers & Pages > Create > Upload
assets). GitHub Pages also hosts sites like this for free, but it needs a
code repository, so it's more steps.

TO USE YOUR OWN DOMAIN NAME (OPTIONAL, ABOUT AN HOUR, THEN SOME WAITING)
------------------------------------------------------------------------
A domain name (yourbusiness.com) costs roughly $10 to $20 a year from a
"registrar" such as Namecheap, Porkbun or Cloudflare. Buy it yourself, in
your own account, and never give the login to anyone.

Then in Netlify open your site and go to Domain management > Add a domain.
Type the domain you bought and follow the steps. It will ask you to add one
or two settings, called DNS records, in your registrar's control panel.
Copy them exactly. The domain can take anywhere from a few minutes to a
day to start working. The padlock comes on by itself once it does.

If this step defeats you, paying a developer for an hour to do it is
reasonable. It should not cost more than that.

TO CHANGE SOMETHING LATER
-------------------------
Easiest: go back to The Floor in the same browser on the same computer you
used before. Your answers are saved there and nowhere else, so keep this
ZIP as your backup. Change what you like, download again, unzip, and drag
the new folder onto your site's Deploys page in Netlify. It replaces the
old version.

You can also edit the words directly. Open any .html file in Notepad
(Windows) or TextEdit (Mac). Not Word: it will break the file.

Any developer can take this folder over. It's plain HTML with nothing
unusual in it, which is exactly what you'd want to hand someone.

WHAT THIS SITE DOESN'T DO
-------------------------
  - The contact form doesn't send anything. It needs a service behind it.
    The email link beside it does work. If you'd rather not show a form
    that does nothing, ask a developer to connect it or remove it.
  - Nothing helps people find it on Google beyond the page titles. For a
    local business, a free Google Business Profile (google.com/business)
    does more for that than the website itself. Set one up and put this
    site's address in it.
  - Your pictures went in exactly as you gave them, not made smaller.
  - There's no booking, payments, analytics, or anything specific to how
    your business works.

That's the point. If you're paying someone to build a website, they should
be adding things this site doesn't have. The Reality Check page in the tool
lists what to ask for.
