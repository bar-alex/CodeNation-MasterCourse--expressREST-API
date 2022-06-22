require("./db/connection");
const express = require("express");
var cors = require('cors');
const app = express();
const port = process.env.PORT || 5001;
const userRouter = require("./user/routes");

app.use(cors());

// these 3 endpoints map to the same static webpage - documenting the usage of the API
app.use('/info',express.static('public'));
app.use('/api-help',express.static('public'));

// enable json and link the user endpoints
app.use(express.json());
app.use(cors());
app.use(userRouter);

// starting the server
app.listen(port,()=>{
    console.log(`Listening on port ${port} || for usage information open http://localhost:${port}/api-help`);
});
