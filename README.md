# Cart API

**Project Description**: This project is an API built with Fastify and TypeORM, providing RESTful routes for managing `carts` and `items`. The `cart_items` table is used to establish a relationship between carts and items.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
  - [Carts](#carts)
  - [Items](#items)
- [Database](#database)
- [Challenges](#challenges)

## Installation

1. Clone the repository.
2. Install the required dependencies using npm:

```bash
npm i
```

3. Configure .env file copying the .env.example to fill the environment variables for the project:

```bash
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_NAME=
DB_SCHEMA=
PORT=
```

4. Create the database and then run TypeORM migrations:

```bash
npm run migration:run:dev
# or if you already built the project
npm run migration:run
```

## Usage

1. Run the api using the dev command with `ts-node` or `node`:

```bash
npm run start:dev
# or if you already built the project
npm run start
```

2. The API server will be available at `http://localhost:3000` (assuming it's running on the default port). You can use tools like Postman or curl to interact with the API.

## API Endpoints

### Carts

- **GET /carts/:id**: Get details of a specific cart by ID.
- **POST /carts**: Create a new cart.
- **PUT /carts/:id**: Update an existing cart by ID.
- **DELETE /carts/:id**: Delete a cart by ID.

### Items

- **GET /items/:id**: Get details of a specific item by ID.
- **POST /items**: Create a new item.
- **PUT /items/:id**: Update an existing item by ID.
- **DELETE /items/:id**: Delete an item by ID.

3. You can also leverage the Swagger docs by entering at: http://localhost:3000/docs, and then you can play around and test.

4. In order to get started, first create a Item and then you can create a Cart, it's not possible to create a Cart without items,
   also when creating/updating the cart you can also input the discount and taxes to also calculate the value, the total and subtotal
   are calculated automatically, based on the items, discount and taxes.

## Database

For the database files you can check the modeling at the file db_diagram.png and db_diagram, one is an image and the other is a file to generate the modelling at db diagram.

Also in the migrations folder, you have all the necessary scripts in order to run the migrations for the project and generate the tables.

## Challenges

I was able to finish the API in approximately one hour, a little more, then I decided to just add Swagger to improve the testing on you behalf since all the schemas
were already created for validation/serialization I just utilize it with swagger + swagger-ui, I did not have time to create tests, commenting my code and also to I'm writing this doc
after the time ran out, hope you consider it.
