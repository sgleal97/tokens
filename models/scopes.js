'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MicroSchema = Schema({
    microservicio: String,
    id: Number,
    secret: String,
    scopes: String
})

module.exports = mongoose.model('Micro', MicroSchema)