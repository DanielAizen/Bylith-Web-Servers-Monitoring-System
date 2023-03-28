## Description
I've create a web server monitoring system while using NestJs. There's a postman .json file attached for your convinence, in addition I've created a dockerfile and docker-compose. 
I've completed the assigment without the 'Bonus'.

### Known Bugs
I had an issue with the multiple updates. I tried to resolve the issue but couldn't find a solution.

## Installation

```bash
$ npm install
$ docker run -d -p 5342:5342 bylith-web-monitoring
$ docker-compose up
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

In order to start the worker - call the postman endpoint located under 'Health Status'

## License

Nest is [MIT licensed](LICENSE).
