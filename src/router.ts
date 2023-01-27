import crypto from "crypto";
import { Router } from "express";
import path from 'path'
import fs from 'fs'

const __dirname = path.resolve()
const dbPath = path.resolve(__dirname, 'base.json');
const router = Router()
const __access_token__ = "GNBYCY4jeibFGfzc"
const __token__ = "3PwfEsXts4Af6kbP"
const __token_crypted__ = crypto.createHash('sha256').update(__token__).digest('base64');

router.get("/products", (req, res) => {
    res.sendFile(dbPath)
})

router.get("/products/:id", (req, res) => {
    const token = req.cookies.refreshToken;
    if (crypto.createHash('sha256').update(token).digest('base64') === __token_crypted__) {
        const file = fs.readFileSync(dbPath, 'utf-8')
        const objs = JSON.parse(file)
        for (let i = 0; i < objs.length; i++) {
            const e = objs[i];
            if (e.id === Number(req.params.id)) {
                return res.json(e);
            }
        }
    }
    res.json({ "code": 401 })
})

router.post("/check", (req, res) => {
    const token = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    try {
        if (crypto.createHash('sha256').update(token).digest('base64') === __token_crypted__ && accessToken === __access_token__) {
            return res.json({ "code": 1 })
        }
    }
    catch (e) {
        console.log(e);
    }
    res.json({ "code": 401 })
})

router.post("/set", (req, res) => {
    const token = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    try {
        if (crypto.createHash('sha256').update(token).digest('base64') === __token_crypted__ && accessToken === __access_token__) {
            console.log(req.body);
            return res.json({ "code": 1 })
        }
    }
    catch (e) {
        console.log(e);
    }
    res.json({ "code": 401 })
})

router.post("/auth", (req, res) => {
    const { login, password } = req.body
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
        res.cookie('refreshToken', __token__, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
        res.cookie('accessToken', __access_token__, { maxAge: 30 * 24 * 60 * 60 * 1000 })
        return res.json({ "code": 1 })
    }
    res.json({ "code": code })
})

export default router;