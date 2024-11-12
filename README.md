
## Description

This project retrieve and update information about the system solar planets. 


## Dependencies
```
node 12.x - Check Dockerfile
```

### Framework
```
NestJS: https://nestjs.com/
```

## Build

Installing NodeJs
```sh
We recommend to use NVM (Node Version Manager)
https://github.com/nvm-sh/nvm
```

## Installation

```bash
$ npm install
```

## Running the app

You can setting up local variables on the file `.env`

It's necessary a mongodb database running for that you can run this command inside de path `./db`:

```bash
# Create a mongodb container
$ docker-compose -f stack.yml up

```

Using npm: 

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

Using Docker:

```bash
$ docker build -t solar-system-service .

$ docker run -e PORT=3000 -p 3000:3000 solar-system

```

## Test

```bash
# unit tests
$ npm run test

# integration tests
$ npm run test:integration

# test coverage
$ npm run test:cov
```

## Useful links 

### Swagger
```bash
# Dev
https://solar-system-service-env-dev.herokuapp.com/swagger

#Prod
https://solar-system-service-env-prod.herokuapp.com/swagger
```
