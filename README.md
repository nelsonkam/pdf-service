# PDF Service

A microservice that, when given a link to a pdf document:

1. Stores the document in local storage and
2. Generates a thumbnail for the document

The service is also able to:
* Detect duplicates
* Push a webhook to notify the API client of the successful processing with exponential backoff if the endpoint fails.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
### Run service with Docker (recommended)

#### Prerequisites

Here's what you have to do before you can run the project.

* Clone the project
* Install Node.js & NPM
* Install [Docker Desktop](https://www.docker.com/)
* Create a `.env` file with the variables in `.env.example`. You can use the values in this [gist](https://gist.github.com/nelsonkam/d65c499a6f53f98c44eccbc0542b9dfc) for development purposes.

#### Run the service

```
$ npm run docker:dev:up
```

### Run service without Docker

#### Prerequisites

Here's what you have to do before you can run the project.

* Clone the project
* Install Node.js & NPM
* Install [GraphicsMagick](http://www.graphicsmagick.org/)
* Install and run a Redis server
* Install and run PostgreSQL
* Create a `.env` file with the variables in `.env.example`. You can use the values in this [gist](https://gist.github.com/nelsonkam/d65c499a6f53f98c44eccbc0542b9dfc) for development purposes.

#### Run the service

```
$ npm install --legacy-peer-deps
$ npx prisma generate --schema ./prisma/schema.prisma
$ npx prisma migrate deploy
$ npm run dev
$ npm run dev:worker
```

### Testing

You can run unit tests with the following command

```
$ npm run test
```

### API documentation

API documentation for this service can be found on the [`/api-docs`](http://localhost:3000/api-docs/) endpoint of the server powered by Swagger.

### Worker Queue

You can view all jobs and their current status on the [`/admin/queues`](http://localhost:3000/admin/queues) endpoint of the server powered by Bull Board.

## Further considerations

Here are a few things that are out of the scope of the project but worth considering:

* Set up integration testing
* Use Amazon S3 for file storage instead of the local filesystem
* Add authentication (Basic Auth at least) to control access to the service
* Rate limiting to prevent abusive usage (if this is an external service)
