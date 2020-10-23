'use strict'

const express = require('express')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error){
            res.status(403).send({message: `El usuario o secret no coinciden`})
        }else{
            res.json({
                message: "Microservicio de tokens",
                authData
            })
        }
    })
    res.send({ message: "Microservicio de tokens" })
})

app.post('/token/:id/:secret',(req, res) => {
    console.log(req.body)
    let id = req.params.id
    let secret = req.params.secret

    const user = {id: id}
    jwt.sign({user}, secret, (err, token)=> {
        res.json({
            jwt: token
        })
    })
})

//Authorizathion: Bearer <token>
async function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
    }else{
        res.status(400).send({message: `El usuario o secret no coinciden`})
    }
}

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})