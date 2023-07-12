const express = require('express');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 3000;
const indexRouter = require("./routes/index.js");


app.use(express.json()) 
app.use(cookieParser())
app.use("", indexRouter) 


app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요!');
});


