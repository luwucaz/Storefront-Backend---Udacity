# Storefront Backend Project

## :package: Used packages
```sh
├── @faker-js/faker@7.6.0
├── @types/bcrypt@5.0.0
├── @types/express@4.17.17
├── @types/jasmine@3.10.7
├── @types/pg@7.14.11
├── bcrypt@5.1.0
├── body-parser@1.20.2
├── db-migrate-pg@1.2.2
├── dotenv@16.0.3
├── express@4.18.2
├── jasmine-spec-reporter@6.0.0
├── jasmine-ts@0.3.3
├── jasmine@3.99.0
├── pg@8.10.0
├── ts-node@10.9.1
├── tsc-watch@4.6.2
└── typescript@5.0.3
```
## :rocket: Technology
```sh
├── ts-node
├── Docker
```

## :construction: How to run:

*  Create a valid .env file
*  Run the docker container
*  Run the script db-up
*  Run the script watch

## :wrench: Using the tests:

All you need to do is:

* Run the 'test' script

That's it.

## :hammer_and_wrench: Step by step to initialize the API:

1 - In the root folder of the project, run the following command.
```sh
npm install
```
2- start Docker with the following command.
```sh
docker-compose up -d
```
3- Copy the file ".env.exemple" to ".env" and configure according to your settings.
```sh
cp .env.example .env
```
4- to perform the migration to the database run the following command.

```sh 
npm run db-up
```
5- right after creating your ".env" configuration file, run the following command in your terminal to generate your API key.
```sh
openssl rand -hex 16
```
6- after generating your API key, copy the code generated in your terminal and paste it in your configuration file ".env" in the location "API_KEY=".
Example:
```sh
API_KEY=43deaa509e04fc991e2f8def5bd095c3
```
7- After configuring the whole environment, let's start our application.
  ```sh
npm run watch
```
