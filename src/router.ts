import crypto from "crypto";
import { Router } from "express";
import path from 'path'
import fs from 'fs'
import { IProduct } from "./models.js";

const __dirname = path.resolve()
const database = path.resolve(__dirname, 'baseNew.json');
const router = Router()
const __access_token__ = "GNBYCY4jeibFGfzc"
const __token__ = "3PwfEsXts4Af6kbP"
const __token_crypted__ = crypto.createHash('sha256').update(__token__).digest('base64');

const validate = (refreshToken: string, accessToken?: string) => {
    const hash = crypto.createHash('sha256').update(refreshToken).digest('base64');
    if (accessToken) {
        return (hash === __token_crypted__ && accessToken === __access_token__);
    }
    return (hash === __token_crypted__);
}

router.get("/products", (req, res) => {
    res.sendFile(database)
})

router.get("/products/:id", (req, res) => {
    try {
        if (validate(req.cookies.refreshToken)) {
            const file = fs.readFileSync(database, 'utf-8')
            const objs: IProduct[] = JSON.parse(file)
            for (let i = 0; i < objs.length; i++) {
                const e = objs[i];
                if (e.id === Number(req.params.id)) {
                    return res.json(e);
                }
            }
            res.json({ "code": 509 })
        }
    }
    catch (e) {
        console.log(e);
    }
    res.json({ "code": 401 })
})

router.post("/check", (req, res) => {
    try {
        if (validate(req.cookies.refreshToken, req.cookies.accessToken)) {
            return res.json({ "code": 1 })
        }
    }
    catch (e) {
        console.log(e);
    }
    res.json({ "code": 401 })
})

router.post("/set", (req, res) => {
    try {
        if (validate(req.cookies.refreshToken, req.cookies.accessToken)) {
            const arr: IProduct[] = req.body;
            fs.writeFileSync(database, JSON.stringify(arr));
            return res.json({ "code": 1 })
        }
    }
    catch (e) {
        console.log(e);
    }
    res.json({ "code": 401 })
})

router.post("/set/:id", (req, res) => {
    try {
        if (validate(req.cookies.refreshToken, req.cookies.accessToken)) {
            const text = fs.readFileSync(database, 'utf8');
            const items: IProduct[] = JSON.parse(text);
            const newObj: IProduct = { ...req.body };
            const arr: IProduct[] = [];
            for (let i = 0; i < items.length; i++) {
                const e = items[i];
                if (e.id === newObj.id) {
                    arr.push(newObj)
                }
                else {
                    arr.push(e);
                }
            }
            fs.writeFileSync(database, JSON.stringify(arr));
            return res.json({ "code": 1 })
        }
    }
    catch (e) {
        console.log(e);
    }
    res.json({ "code": 401 })
})

router.post("/auth", (req, res) => {
    const { login, password }: { login: string, password: string } = req.body
    const _login = "3MIwrOxpm1xcu01aDLv+BRhj+kovvHRuJHBBnni+tb8="
    const _pword = "NeiIbnopMaS2MkNtuHIY/6/2msSS1jgh9wtzTuDvBTk="
    const login_ = crypto.createHash('sha256').update(login).digest('base64');
    const pword_ = crypto.createHash('sha256').update(password).digest('base64');

    let code = 0;

    if (login_ === _login) {
        code = 1;
    }
    else {
        return res.json({ "code": 2 })
    }

    if (pword_ === _pword) {
        code = 1;
    }
    else {
        return res.json({ "code": 3 })
    }

    if (code === 1) {
        res.cookie('refreshToken', __token__, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true })
        res.cookie('accessToken', __access_token__, { maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'none', secure: true })
        return res.json({ "code": 1 })
    }
    res.json({ "code": code })
})

export default router;