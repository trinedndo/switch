import express from "express";
import cors from "cors";
import router from "./router.js";
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "https://isticcebnc.ru"
}))

// app.use(express.session({
//     secret: conf.secret,
//     cookie: { domain: '.yourdomain.com' },
//     store: new MongoStore(conf.sessiondb)
// }));

app.use("/api", router);

const start = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT}`);
        })
    }
    catch (e) {
        console.log(e);
    }
}

start()