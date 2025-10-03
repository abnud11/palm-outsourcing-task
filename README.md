This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app). It's a Full-Stack app using API Routes so you'll need to run MongoDB in order to run this app, this is handled by our docker-compose.yaml.

## Getting Started

To run the Next.js app along with MongoDB:

```
docker-compose up --build --watch
```

the ---watch flag will tell docker compose to watch the files for changes, so you'll see any change without restarting the app.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
