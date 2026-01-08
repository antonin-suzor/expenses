# expenses

Entirely free, Cloudflare-deployable, friendly UI to help you fill your [Notion *Personal Finance Tracker*](https://www.notion.so/marketplace/templates/personal-finance-tracker-with-automations?cr=pro%3Anotion), on your phone or computer.

Working example: https://expenses.antonin-suzor.com (type in whatever password, you will access the page but will not be able to send requests)

## How to deploy

Prerequisite: Having [NodeJS](https://nodejs.org/en/download) installed on your local computer.

1. Have a Notion page with Notion's "*Personal Finance Tracker*" template enabled
1. Create a Notion integration in your workspace and give it permissions on the template
1. Get a cloudflare account (it's free !)
1. Download this code
1. Copy the file `.env.example` to `.env` and replace the variables with what you need:
    - The secret key is that of your Notion integration
    - The datasource IDs are those of the expenses/income pages
    - The month IDs are those of the year's month, you can easily extract them from their page link
    - If you have custom tags for expenses/income, you can specify them in a comma-separated way
    - Choose a password that you would like
1. Run the command `npm run deploy`

You should then get a URL where the page is set up correctly. You can access it from anywhere, and it's easier to use than the Notion app.
