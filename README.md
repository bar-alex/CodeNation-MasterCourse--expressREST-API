## CodeNation-MasterCourse--expressREST-API

A simple express and NodeJS app to create a server that serves a REST API

- CRUD operations against a MongoDB with Mongoose
- Automatic authentication with JsonWebToken

It allows for the login of users and superusers (admins) and CRUD operations are allowed only to admins and the user affected by the operation (i.e. a normal user can update it's own info)

#### These are the paths available for it's usage (-< input; -> output)

```
GET     /api-help                                  -> returns a webpage that describes the API entry points and usage

POST    /user           -< body:{username, email, password}    -> returns token    :: adds user to list of users
POST    /login          -< body:{username, password}           -> returns token

GET     /users          -< header:token            -> depending on the token, returns a list of all or just non-admin users
GET     /users/admin    -< header:token (admin)    -> return list of admin users

GET     /user/token       -< header:token              -> returns the token's user details, without the password

GET     /user/*userName*  -< header:token (self/admin) -> returns the user's details, without the password
PUT     /user/*userName*  -< body:{email, password}, header:token (self/admin) -> updates user info
DELETE  /user/*userName*  -< header:token (self/admin) -> deletes the user in database
```

#### Usage scenarios
```
- POST /user with {username, password, email}   will allow to add a user without requiring any credentials
- POST /login with a {username, password}       will login a user am=nd return an authentication token

- Logged in users will be known by transmitting the token in the 'Authorization' header

- GET /users        (requires token in 'Authorization' header) will return a list of all users
- GET /users/admin  (requires admin token) will return a list of all admin users

- GET /user/token      with header:token will return the token's user details (except password)

- GET /user/*userName* with header:token will return the user's details (except password) if the token belongs to him or 
to an admin
- PUT /user/*userName* with {email, password} and header:token will update the specified user details if the token belongs 
to him or an admin
- DELETE /user/*userName* with header:token will delete the user if the token belongs to him or to an admin
```
