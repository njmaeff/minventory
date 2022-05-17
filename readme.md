# Minventory
Minventory is a simple application enabling users to create, edit, and remove items. Users can revert edits, deletions, and the creation of inventory items on the history page.

## Usage

### Inventory Tab

- Add a new item by clicking the **Add** button.
- Edit an existing item by clicking the **Edit** button under **Actions**.
- Delete an item by clicking the **Remove** button under **Actions**.

### History Tab

- Revert a deleted item by clicking the **Revert** button under **Actions**


## Features

- **CRUD** (create, read, update, delete) functionality for inventory items.
- Ability to add comments to a deleted item and revert the deletion.

## Stack
This app is a full-stack application, so we need a database and intermediate API for the front-end to speak to the database.

### Database
The production database for this application is the [Replit Database](https://docs.replit.com/hosting/using-a-database) which is a primitive key-value store.

We can use a local db.json file that functionally acts like a key-value store for development. We have a unique client for using this database located here [pages/api/lib/dbLocal.ts](https://github.com/njmaeff/minventory/tree/trunk/pages/api/lib/dbLocal.ts).

### Back-End
We use [NextJS API Routes](https://nextjs.org/docs/api-routes/introduction) for our API layer and translate a post request body into instructions for operating on the database. A response is crafted and sent back to the front end. Our database API is here [pages/api/db.api.ts](https://github.com/njmaeff/minventory/tree/trunk/pages/api/db.api.ts)

### Front-End
For the front end, the app uses NextJS. NextJS is a full-stack framework that offers pre-configured React and Typescript support. The framework allows us to write our front-end and back-end code using the same programming language. The most significant benefit of creating an app using NextJS is the ability to share library code and type declarations between front-end and back-end code. Another advantage is rendering our data into the front-end page if we desire on the server.


## Running on Replit

Manually
```bash
yarn start
# runs yarn install, yarn seed, yarn build, next start
```

Or click the start button.

## Local Development

Clone the git repository
```bash
git clone https://github.com/njmaeff/minventory
```

Install dependencies.
```bash
yarn install
```

Add the seed data.
```bash
yarn seed-dev
```

Start the application.
```bash
yarn dev
```

## Maintenance

There are two scripts you can use for maintenance:

Backup the database
```bash
yarn backup backup.json
```

Restore the database
```bash
yarn restore backup.json
```
