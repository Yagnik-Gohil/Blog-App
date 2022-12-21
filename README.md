# Blog App created in React, Type Script, Mongo DB, Node js and Express

## Features

• Create, Read and Update Blog with image upload

• User Authentication with JWT

• react-icons , Bootstrap

## How to use

① fork the repository and clone locally

② in /blog, run `npm install` to install dependencies. move to /backend and run `npm install` again

③ create config.env file inside /backend. `/blog/backend/config.env` and copy below variables in it.
```
NODE_ENV=development
PORT=8000

DATABASE_LINK=mongodb+srv://Your_DB_Username:<DATABASE_PASSWORD>@cluster45.obtvkghn.mongodb.net/ArtistDB?retryWrites=true&w=majority
DATABASE_PASSWORD=Your_DB_Password

JWT_SECRET=this-is-my-super-secure-jwt-secret
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```
④ once installation is complete, in /blog run `npm start`. move to /backend and run `nodemon server.js` to get your local copy running in the browser.

