const express = require('express')
const router = express.Router();

const customerController = require('../controllers/customerController')

 
//router.get('/',customerController.list)

router.all('/contacts',customerController.list)
router.all('/contacts/:id?',customerController.getContact)
router.all('/contacts.save',customerController.save)
router.all('/contacts.delete/:id?',customerController.deleteContact)
// router.get('/*', ()=>{
//     return res.status(201).json({error:'error'})  
// })

module.exports = router;