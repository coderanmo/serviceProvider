let express=require('express')
const { showCategoryHelper } = require('../../controllers/helpers/helperCategoryControllers')

let helperServiceRoutes=express.Router()

helperServiceRoutes.get('/service',showCategoryHelper)

module.exports={helperServiceRoutes}
