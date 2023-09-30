# Meet Near Me Scraper

🤖 Much like Google, OpenAI, and other data organizations, gathering data (responsibly) from sites around the internet is central to the goal of MeetNear.me. This project aims to create a Node.js utility API that can accept an ingestion target URL from users and then parse it with the goal of extracting any listed events and their associated metadata.

The utility is written in Node.js and uses various utilities to gather data, parse it, present it to the user for validation of the metadata targets, and then ultimately ingest it into the database.

## Getting Started

1. The project uses two API keys, which need to be stored in a file called `.env`
1. Copy the existing `.env.example`, and rename it to `.env`
1. Add the API Key values from AWS Secrets Manager in the Meet Near Me AWS org
