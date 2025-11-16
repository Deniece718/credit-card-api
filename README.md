# credit-card-api

### Overview

This is a **Node.js** + **Express** + **Typescript** backend service that powers a credit card dashboard for user to managing: companies, cards, invoices, spending limit.
and transactions.
The service provides a clean REST API with request validation, database storage (MongoDB), and API documentation via Swagger UI.


### Deploymemt

* **Clone and Install Dependencies**
```bash
git clone https://github.com/Deniece718/credit-card-api.git
cd credit-card-api
npm install
```
* **Setup Environment Variables**
```bash
HTTP_PORT=3000
MONGO_URI='your mongodb uri'
```
* **Build and Run**
```bash
npm run build && npm start
```


### API Documentation

```bash
http://localhost:3000/api-docs
```

### Test and Run

In this project, considering time requried and complexity of api implementation I only cover partial endpoints of each routes. If provided more time, I will follow cards.test.ts file as example to apply for other test files, considering the calledTimes and callWith for every testcase. Besides, if each endpoint requries more complex 
logic, then another layer of describe should be wrapped and beforeEach, afterEach handle will be introduced.

```bash
npm test
```