const { servicesModel } = require("../../models/servicesModel")

let showCategoryHelper=async (req,res)=>{
  let obj
  await servicesModel.find().select('servicesName')
  .then((resApi)=>{
    obj={
        status:1,
        data:resApi
    }
  })
  .catch((error)=>{
    obj={
        status:0,
        msg:'no data'
    }
  })
  res.send(obj)
}

module.exports={showCategoryHelper}