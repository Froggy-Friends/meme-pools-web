This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Define Environment Variables

Create a `.env` file in the root directory and add the following:

```bash
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
MORALIS_API_KEY=
FROG_FUN_API_URL=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_PUSHER_CLUSTER=
NEXT_PUBLIC_PUSHER_KEY=
PUSHER_APP_ID=
PUSHER_SECRET=
NEXT_PUBLIC_ETH_CHAIN_ID=
NEXT_PUBLIC_BASE_CHAIN_ID=
NEXT_PUBLIC_SOLANA_CHAIN_ID=
BLOB_READ_WRITE_TOKEN=
```

Ask a developer on the team for the values to these environment variables.

**Important: Make sure the POSTGRES_PRISMA_URL schema is set to dev to run the app on the dev environment**

### Install Dependencies

```bash
npm install
```

### Generate Prisma DB Definitions

The npm install script triggers the 'postinstall' script in package.json to generate prisma db definitions.
When the database definition changes you need to genearte new prisma definitions like this:

```bash
npm i -g prisma
prisma generate
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Prisma DB Migrations

Frog-fun-web is the source of truth for db schema updates.
Changes are made through prisma db migrations (db changes).

Migration steps:

1. Make changes to schema.prisma file
2. Run `npx prisma migrate dev --name short_description_underscored` (add unique description with underscores)
3. Review the new migration file prisma generated in the `prisma/migrations` folder
4. For production migrations run `npx prisma migrate deploy`
5. Update prisma client with `npx prisma generate`
