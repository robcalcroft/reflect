# Reflect

## Developing locally

### Prerequisites

- [Node.js](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [PostgreSQL](https://www.postgresql.org)

### Environment

Add a `.env` file in the root of the project. You will need to add config for connecting to PostgresSQL, there is information on how to configure the client library [here](https://node-postgres.com/features/connecting#environment-variables). If you are running PostgreSQL locally with the default settings you will probably only need to set `PGUSER` and `PGPASSWORD`.

### Installing dependencies

Just run `yarn` in the root of the project.

### Scripts

For a list of all scripts see the `scripts` field in the [package.json](package.json).
