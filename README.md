This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It's a Full-Stack app using API Routes so you'll need to run MongoDB in order to run this app, this is handled by our docker-compose.yaml.

## Getting Started

To run the Next.js app along with MongoDB:

```
docker-compose up --build --watch
```

the ---watch flag will tell docker compose to watch the files for changes, so you'll see any change without restarting the app.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Seeding the database

The project has a script to seed the database, once you launch the app with docker-compose,
First create .env file and put this:

```
MONGODB_URI=mongodb://127.0.0.1:27017/test
```

Then in another terminal execute the following command:

```
pnpm db:seed
```

Beware that db:seed will wipe out the tokens previously stored in the database before inserting the seed data.

Of course you'll need to install pnpm first, the pnpm version we use is put inside package.json as `packageManager` field, you can install it using corepack that comes with Node.js 22+ like this:

```
corepack enable
corepack install
```

This will install the pnpm version we configured inside package.json.
