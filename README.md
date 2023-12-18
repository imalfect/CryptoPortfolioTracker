# Monetis
Monetis is a simple portfolio tracker made using React.

## Live deployment
This project is deployed on Vercel and can be found [here](https://monetis.vercel.app/).

## Tech Stack
This project uses:
- Next.js
- Drizzle ORM
- NextAuth
- Postgres
- shadcn/ui
- Framer Motion
- TailwindCSS

## Setting up
You can set up this project locally to make changes/test it out. These instructions were written for Linux, however you should be able to use them to set up the environment on other platforms as well.

### Prerequisites
Before continuing, make sure you have [pnpm](https://pnpm.io/) and [Node.js](https://nodejs.org/en) installed. [Git](https://git-scm.com/) is also recommended, but it is not required if you decide to download the source code instead of cloning the repository.

### Downloading the source code
Clone the GitHub repository or download the source code and unpack it.

```bash
$ git clone https://github.com/imalfect/Monetis
```

### Downloading the dependencies
Download the required dependencies using pnpm.

```bash
$ pnpm install
```

### Setting up the environment
Copy the `.env.example` file as `.env` and replace the placeholders as described.

```bash
$ cp .env.example .env
```

```bash
$ nano .env
```
(or your favorite editor)

### Configuring the database
Configure the database using scripts.

```bash
$ pnpm run db:push
```
**NOTE**: Monetis is configured to run properly with vercel, therefore ?ssl=true is added to the connection. If you wish to disable it, edit the `drizzle.config.ts` and `db/index.ts` files.

### Starting Next.js in development mode
Start Next.js in development mode

```bash
$ pnpm dev
```

## Success
Congratulations! You have successfully managed to set up a development environment for Monetis.

If you encounter any issues, feel free to create an issue on our GitHub. Pull requests are welcome!
