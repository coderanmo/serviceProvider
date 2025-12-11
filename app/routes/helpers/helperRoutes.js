let express=require('express')
const { helperAuthRoutes } = require('./helperAuthRoutes')
const { helperServiceRoutes } = require('./helperServiceRoutes')
let helperRoutes=express.Router()

helperRoutes.use('/helper-account',helperAuthRoutes)
helperRoutes.use('/helper-service',helperServiceRoutes)
module.exports={helperRoutes}