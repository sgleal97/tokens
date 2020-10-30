'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContadorSchema = Schema({
    contador: Number
})

module.exports = mongoose.model('Contador', ContadorSchema)