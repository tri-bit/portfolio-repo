# Porfolio Repo

Skills overview and code examples for prospective clients.

Contact: jim@jimwelch*dot*dev

# Production projects & code examples

## Magic Horse Auction - MERN Stack

[https://magichorseauction.com/](https://magichorseauction.com/)

Sole developer / designer / tester.

A complete rebuild of the MagicHorseAuction.com auction website built in react (nextjs) with a nodejs backend. (MERN stack) No code reused - previous platform was wordpress + plugins.
Over 2m invoiced in first 14 months of launch.

- No theme used - built on top of react-bootstrap
- Bidding page uses websockets to update price / bid history in realtime
- Admin auction cms, also allows admin to delete bids (made in user error) and recalculate
- Stripe integration (creating invoices with stripe hosted payment page for completed auctions)
- Twilio / Mailgun integrations for text / email notifications respectively
- Imported / converting the over 3k users from SQL to the new Mongo DB (old wordpress passwords not carried over)
- User classified ads system
- Internal banner bd system with impression / click tracking

![screenshot 1](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/MagicHorseAuction-screenshot2.jpg)
![screenshot 2](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/MagicHorseAuction-screenshot1.jpg)

## RPM Employee Portal - MERN Stack

Sole developer / designer (and tester.)
Built from client request to design and assign quizzes. Extended to include simple ticket system, locations (managed by client) and employee database.

[Portal Demo Video](https://media55.sfo2.cdn.digitaloceanspaces.com/portfolio/media/rpm_portal.mp4)

[![Project Video](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/RPMPortal_video.jpg?raw=true)](https://media55.sfo2.cdn.digitaloceanspaces.com/portfolio/media/rpm_portal.mp4)

## BISD World - React SPA / Node backend

[https://www.bisd.world/](https://www.bisd.world/)

School district website that displays submitted alumni information. 3D Globe mesh asset via Sketchfab.

- Three.js 3D rotatable globe display (via react-three-fiber)
- Frontend pulls alumni data via GraphQL queries, plotting points on the globe by the received latitude & longitude

![screenshot 1](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/BISDWorld-screenshot1.jpg)

## Pulse Projects DB - NextJs + React Three Fiber

[https://pls-db-demo.cr.mou459038.xyz/](https://pls-db-demo.cr.mou459038.xyz/)

Personal crpyto themed experimental site with WebGL (react-three-fiber) background.

![screenshot 1](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/Pdb-screenshot1.jpg)

# My Open Source Projects

## Drizop

React file drop component, including image previews and loading progress bar:

https://github.com/tri-bit/drizop

![alt text](https://github.com/tri-bit/drizop/blob/master/docs/images/drizop_07.png?raw=true "Example2")
![alt text](https://github.com/tri-bit/drizop/blob/master/docs/images/drizop_02.png?raw=true "Example2")

## React Json Previewer

React javascript object contents previewer:

https://github.com/tri-bit/react-json-previewer

![alt text](https://github.com/tri-bit/react-json-previewer/blob/master/docs/intro_image.png?raw=true "Example")

# Code Examples

Tools/Components I wrote during the development of Magic Horse Auction:

## Bidder Testing Tool:

Node + Puppeteer project than runs bidding scripts on debug auctions, checks expected values and logs test results. Up to 5 virtual bidders at once.

https://github.com/tri-bit/portfolio-repo/tree/main/examples/mha/tools/auctiontester

## SQL Exporter CLI Tool:

Node CLI tool to connect to SQL server and export previous site's wordpress user data. (For conversion into MongoDB)

https://github.com/tri-bit/portfolio-repo/tree/main/examples/mha/tools/sqlexporter

## Form Builder React Components

Builds form from array - features & code:

https://github.com/tri-bit/portfolio-repo/tree/main/examples/mha/mhaform

Example showing the form validation correctly warning/blocking form submission attempt because of Labeled Input's _required:true_ property:

![alt text](https://github.com/tri-bit/portfolio-repo/blob/main/examples/mha/mhaform/media/MHAForm01.png?raw=true "Example")

## S3 Helper

Helper tool to archive S3 buckets and upload local directory to specific 'directory' in the S3 bucket. I may eventualy release as an standalone github repo / npm package (after a bit more testing - it's only been used on Digital Ocean's S3 compatible plaform so far.)

https://github.com/tri-bit/portfolio-repo/tree/main/examples/mha/tools/s3helper

# Unity Game Development

In the first half of the 2010s I solo developed several mobile games in C# using the unity engine.

[Trailer for one of my android/iphone games 'Diamondback' (2012)](https://media55.sfo2.cdn.digitaloceanspaces.com/portfolio/media/Diamondback_Trailer_Web.mp4)

# Design examples

While my goals are primarily developer oriented I do have experience creating website designs **without themes.** (Primarily in Webflow.) While I do create custom elements in photoshop, etc when needed I am not a traditional logo/graphic designer.

## Designworks Group (Current Employer)

https://www.designworksgroup.com/

[![Website Thumbnail](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/designexamples/designworksgroup.png?raw=true)](https://www.designworksgroup.com/)

## Twisted Smith Designs

https://www.twistedsmithdesigns.com

[![Website Thumbnail](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/designexamples/twistedsmithdesigns.png?raw=true)](https://www.twistedsmithdesigns.com)

## Rocking M Ranch

https://www.rockingmranchdistillery.com/

Product photography by Ren Risner.

[![Website Thumbnail](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/designexamples/rockingmranch.png?raw=true)](https://www.rockingmranchdistillery.com/)

## I.d.e.a. WF

https://www.ideawf.com/

Graphics sourced from Adobe Stock.

[![Website Thumbnail](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/designexamples/ideawf.png?raw=true)](https://www.ideawf.com/)

## RPM Storage Management (Main Site)

https://www.rpmstoragemanagement.com/

In addition to svg icon animations (using anime.js) I coded a custom tachometer animation used on the homepage.

[![Website Thumbnail](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/designexamples/rpmstorage.png?raw=true)](https://www.rpmstoragemanagement.com/)

## Starbrite Cleaners

http://starbritecleanerstx.com/

This is a old (2015) site but I'm proud of the dynamic layout. (Wordpress platform, site theme basically ignored, with alot of jQuery to create the dynamic layout/animation.) Starbrite logo by Stephen Fleming.

[![Website Thumbnail](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/designexamples/starbrite.png?raw=true)](http://starbritecleanerstx.com/)
