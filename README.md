# Email Marketing Application

1. Overview:

A Mailchimp-like email marketing platform where companies can:
Register and authenticate
Import contacts
Create audiences
Create email campaigns
Schedule campaigns
Send transactional emails through Brevo
Track delivery/open analytics using webhooks

2. Tech Stack

`Frontend`
• Next.js
• TypeScript
• Tailwind CSS
`Backend`
• Node.js
• Express.js
• TypeScript
• Prisma ORM
`Database`
• PostgreSQL (Neon)
`Queue`
• Redis
• BullMQ
`Email Provider`
• Brevo Transactional Email API

3. Architecture
Next.js Client
        |
        |
Express API
        |
        |
Prisma ORM
        |
        |
PostgreSQL
        |
        |
Campaign Scheduler
        |
        |
BullMQ + Redis
        |
        |
Brevo API
        |
        |
Webhook
        |
        |
Analytics Update

4. Features

Authentication
✅ Register
✅ Login
✅ JWT authentication
✅ Protected routes

Contacts
✅ Create contacts
✅ Update contacts
✅ Delete contacts
✅ Pagination
✅ Search
✅ CSV import

Audiences
✅ Create audiences
✅ Add contacts

Campaigns
✅ Create campaigns
✅ Manual recipients
✅ Audience recipients
✅ Schedule campaigns
✅ Send emails

Analytics
✅ Sent count
✅ Open tracking
✅ Brevo webhook integration

5. Deployment

Frontend: Vercel
Backend: Render
Database: Neon PostgreSQL
Queue: Redis

Webhook Configuration
Brevo webhook endpoint:
https://email-marketing-app-cv8z.onrender.com/api/webhooks/brevo

Events:
Delivered
Opened
Unique opened
Clicked
Bounced

6. Description:
Since we're using memory storage, the uploaded CSV is already available as a Buffer.
The time zone is in UTC time zone
`Audience works:`
For these audiences to work, your contacts must actually have matching customFields. For example: If your contacts don't currently have customFields like these, those audiences won't match anyone. 
filterField = which custom field to check
filterValue = the value it must match
{
  "name": "Amit",
  "email": "amit@gmail.com",
  "customFields": {
    "plan": "Premium",
    "city": "Mumbai"
  }
},
{
  "name": "Rahul",
  "email": "rahul@gmail.com",
  "customFields": {
    "role": "Student",
    "city": "Mumbai"
  }
}

• When a campaign is scheduled, it's added to a BullMQ queue backed by Redis. On application startup, the server recovers any pending scheduled campaigns from PostgreSQL and re-queues them if necessary. When the scheduled time arrives, a BullMQ worker invokes the existing sendCampaign() service, sends the email through Brevo, and updates the campaign status.
`Example Output:` That confirms that BullMQ scheduling is working correctly. The key part of this log is: Processing campaign
Server running on port 5000 ✅ Redis Connected Queued campaign cmrompp6d00034g4zmnp2zngt with delay 207214916ms Queued campaign cmrp4zfxu000360257l4w3eta with delay 34414912ms Queued campaign cmrplamri0001dxi1c857toqb with delay 18214910ms Queued campaign cmrplwucj0001z0ovx5lqv84h with delay 18754908ms Recovered 4 scheduled campaign(s) Processing campaign cmrpmrm4h0001by72lfog26u5 Campaign cmrpmrm4h0001by72lfog26u5 sent successfully Job 38 completed,

## Email Analytics Notes
Email delivery and open analytics are updated through Brevo Transactional Webhooks.

The application successfully:
- Sends campaigns through Brevo Transactional Email API.
- Stores the Brevo message ID with each campaign.
- Receives webhook events from Brevo.
- Updates openedCount automatically when `opened` or `unique_opened` events are received.

During testing, Gmail temporarily rate-limited emails sent from Brevo's shared sending domain, causing `deferred` events instead of `delivered` events.

Because deliveredCount depends on receiving a `delivered` webhook event from Brevo, it remains 0 until Brevo confirms successful delivery.

Example webhook events handled:
- delivered → increments deliveredCount
- opened / unique_opened → increments openedCount

The email client blocked the tracking pixel (common for some email clients).


7. Known Limitation
Delivery analytics depend on Brevo webhook events.
During testing, Gmail temporarily rate-limited emails sent through Brevo shared sending domains. This resulted in deferred events instead of delivered events.
Opened analytics were verified successfully using Brevo unique_opened/opened webhook events.