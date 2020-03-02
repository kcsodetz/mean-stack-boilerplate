# MEAN Stack Boilerplate

This MEAN (Mongo, Express, Angular, and Node) Stack boilerplate is what I use for all my web projects.
##
![Node.js CI](https://github.com/kcsodetz/mean-stack-boilerplate/workflows/Node.js%20CI/badge.svg)
## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

1) Node package manager

    ```sh
    sudo apt-get install nodejs
    ```

2) Create a mongodb cluster and get the nodeJS [connection driver](https://docs.atlas.mongodb.com/driver-connection/).

### Running a Dev Environment

1) Using the `env.sample` file as a template, create your own .env file for essential environment variables.

    ```sh
	$ cd backend/
    $ cp env.sample .env
    ```

2) Change the values in the newly created `.env` file.

    ```file
	# Mongo connection driver
	MONGODB_HOST=mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[database][?options]]

	# Port number
	PORT=[port number]

	# JWT Secret for token authentication
	JWT_SECRET=[JSON web token]

	# Email address for mail notifications
	EMAIL_ADDRESS=[email address]

	# Username, password, and email for unit tests
	TEST_USERNAME=[unit test name]
	TEST_PASSWORD=[unit test password]
	TEST_EMAIL=[unit test email]

	# OAuth Client ID, secret, and refresh token for nodemailer
	OAUTH_CLIENT_ID=[oauth client ID]
	OAUTH_CLIENT_SECRET=[oauth client secret]
	OAUTH_REFRESH_TOKEN=[oauth refresh token] 
    ```

   * MONGODB_HOST - [Connection driver](https://docs.atlas.mongodb.com/driver-connection/) for mongodb.
   * PORT - Backend port number.
   * JWT_SECRET - JWT secret for token authentication.
   * EMAIL_ADDRESS - Email address for mail notifications (user registration, user password reset, etc).
   * TEST_USERNAME - Username for unit testing.
   * TEST_PASSWORD - Password for unit testing.
   * TEST_EMAIL - Email for unit testing.
   * OAUTH_CLIENT_ID - Client ID from [Google developers console](developers.google.com).
   * OAUTH_CLIENT_SECRET - Client secret from [Google developers console](developers.google.com).
   * OAUTH_REFRESH_TOKEN - Client ID from [Google OAuth](https://developers.google.com/oauthplayground/).

3) From the backend directory, run the following to start the local node app.

    ```sh
    $ node app.js
    The application is running on localhost:[port_num]
    ```

4) To start the frontend, open a new terminal and navigate to `frontend/boilerplate/` and run:
  
   ```sh
   $ ng serve -o
   ** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **

   Time: 22540ms
   chunk {main} main.js, main.js.map (main) 114 kB [initial] [rendered]
   chunk {polyfills} polyfills.js, polyfills.js.map (polyfills) 236 kB [initial] [rendered]
   chunk {runtime} runtime.js, runtime.js.map (runtime) 6.08 kB [entry] [rendered]
   chunk {scripts} scripts.js, scripts.js.map (scripts) 1.88 kB  [rendered]
   chunk {styles} styles.js, styles.js.map (styles) 2.06 MB [initial] [rendered]
   chunk {vendor} vendor.js, vendor.js.map (vendor) 5.34 MB [initial] [rendered]
     ℹ ｢wdm｣: Compiled successfully.
   ```

## Running the tests

Tests are done with the the mocha and chai frameworks. Only back end tests have been written. To run, navigate to the root of the `backend/` folder and run:

```sh
$ npm test
USER TESTS
------------------------------------------------------------------------


The application is running on localhost:5000
  Test Register
    Register without password
      ✓ Should return 400
    Register without username
      ✓ Should return 400
    Register without email
      ✓ Should return 400
    Register with invalid email
      ✓ Should return 400
    Register with short username
      ✓ Should return 400
    Register with short password
      ✓ Should return 400
    Register with correct info
      ✓ Should return 200
    Register duplicate username
      ✓ Should return 400
    Register duplicate email
      ✓ Should return 400
Test /user/register completed.


  9 passing (1s)

...
```

## Built With

* [MongoDB](https://www.mongodb.com/) - Database
* [AngularJS](https://angularjs.org/) - Frontend framework
* [ExpressJS](https://expressjs.com/) - Backend framework
* [NodeJS](https://nodejs.org/en/) - JS runtime environment

## Authors

* **Ken Sodetz** - [kcsodetz](https://github.com/kcsodetz)
