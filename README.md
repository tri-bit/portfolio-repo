# Porfolio Repo

Skills overview and code examples for prospective clients.

# Production projects & code examples

## Magic Horse Auction - MERN Stack

Sole developer / designer (and tester.)

A complete rebuild of the MagicHorseAuction.com auction website build in react (nextjs) and a nodejs backend. (MERN stack) No code reused - previous platform was wordpress + plugins.
Over 700k in sales in first 6 months of launch.

Techincal Accomplishments:

- Imported / converting the over 3k users from SQL to the new Mongo DB (old wordpress passwords not carried over)
- No theme used - built on top of react-bootstrap
- Bidding page uses websockets to update price / bid history in realtime
- Stripe integration (creating invoices with stripe hosted payment page for completed auctions)
- Twilio / Mailgun integrations for text / email notifications respectively
- User classified ads system just released

## RPM Employee Portal - MERN Stack

Sole developer / designer (and tester.)
Built from client request to design and assign quizzes. Extended to include simple ticket system, locations (managed by client) and employee database.

[![Project Video](https://github.com/tri-bit/portfolio-repo/blob/main/media/images/RPMPortal_video.jpg?raw=true)](https://s3.us-west-1.wasabisys.com/portfolio3400/sitevideos/rpm_portal.mp4)

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

Magic Horse Auctions related tools / examples

## Bidder Testing Tool:

Node + Puppeteer project than runs bidding scripts on debug auctions, checks expected values and logs test results. Up to 5 virtual bidders at once.

https://github.com/tri-bit/portfolio-repo/tree/main/examples/mha/tools/auctiontester

## SQL Exporter CLI Tool:

Node CLI tool to connect to SQL server and export previous site's wordpress user data. (For conversion into MongoDB)

https://github.com/tri-bit/portfolio-repo/tree/main/examples/mha/tools/sqlexporter

- toadd s3 archiver
