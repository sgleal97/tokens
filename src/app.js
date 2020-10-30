'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const fs = require ('fs')

const Micro = require('../models/scopes')
const Contador = require('../models/contador')

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var privateKey = fs.readFileSync('./private.key','utf8')

var publicKey = fs.readFileSync('./public.key','utf-8')

app.get('/db', (req, res) => {
    Micro.find({}, (err, micro) => {
        if (err) res.status(500).send({message: `Error al realizar la peticion: ${err}`})
        if (!micro) res.status(404).send({message: `Usuarios inexistentes: ${err}`})
        res.status(200).send({micro})
    })
})

app.post('/db', async function(req, res){
    let contador = await Contador.find()
    let id = contador.length

    let contador2 = new Contador()
    contador2.contador = id
    
    contador2.save((err, contadorStore) => {
        if (err) res.status(401).send({message: `Error al guardar generador: ${err}`})//500 Datos invalidos
    })

    let micro = new Micro()

    micro.id = id
    micro.microservicio = req.body.microservicio
    micro.secret = req.body.secret
    micro.scopes = req.body.scopes

    micro.save((err, microStore) => {
        if (err) res.status(401).send({message: `Error al guardar nuevo usuario: ${err}`})//500 Datos invalidos
        res.status(201).send({usuario: microStore})
    })
})

app.post('/token',(req, res) => {
    let id = req.query.id
    let secret = req.query.secret
    var tokenOptions = {
        algorithm: "RS256"
    }
    if (id=="craps" && secret=="manager1"){
        let token = jwt.sign(
            {
                expiresIn: '1h',
                type: 'JWT',
                scopes:[
                    'dados.tirar',
                    'usuarios.login',
                    'usuarios.jugadores.get',
                    'usuarios.jugadores.put',
                    'juegos.generar',
                    'juegos.simular',
                    'torneos.partida.get'
                ]
            },
            privateKey,
            tokenOptions
        )
        res.status(200).json({jwt: token})
    }else{
        res.status(400).json({message:"id o secret incorrecto"})
    }
})

app.get('/prueba', (req, res, next)=>{
    const bearerHeader = req.headers['authorization'];
    const token = bearerHeader.split(" ")[1]
    var verifyOptions = {
        algorithm:"RS256"
    }
    if(!token){
        return res.status(400).send({message: "usuario o secret invalido"})
    }

    const verifiacion = jwt.verify(token,publicKey,verifyOptions,function(err, verifiacion){
        if(err){
            res.status(400).send({message: "Token invalido"})
        }else{
            res.status(201).json(verifiacion)
        }
    })
})

/*app.put('/jugadores/:id', (req, res) => {
    let jugadorId = req.params.id
    let update = req.body

    Usuario.findOneAndUpdate(jugadorId, update, (err, usuarioUpdate) => {
        if (err) res.status(401).send({message: `Error al guardar nuevo usuario: ${err}`})//500 Datos invalidos
        res.status(201).send({usuario: usuarioUpdate})
    })
})

app.delete('/jugadores/:id', (req, res) => {
    let jugadorId = req.params.id

    Usuario.findOne({id: jugadorId}, (err, usuario) => {
        if (err) res.status(500).send({message: `Error al borrar usuario: ${err}`})

        usuario.remove(err => {
            if (!usuario) res.status(404).send({message: `Usuario no encontrado: ${err}`})
            res.status(200).send({message: 'El usuario ha sido eliminado'})
        })
    })
})

app.get('/prueba', (req, res)=>{
})*/

mongoose.connect('mongodb://mongo:27017/usuario', (err, res) => {
    if (err){
        return console.log(`Error al conectar a la base de datos: ${err}`)
    }
    console.log('Conexion a base de datos establecida...')
})

module.exports = app