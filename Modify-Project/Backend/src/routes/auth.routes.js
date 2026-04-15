const {Router}=require('express');
const authcontroller=require('../controllers/auth.controller')
const identifyuser=require('../middlewares/auth.middleware')





const router=Router()


router.post('/register',authcontroller.register)
router.post('/login',authcontroller.login)
router.get('/get-me',identifyuser,authcontroller.getme)
router.get('/logout',authcontroller.logout)
router.get('/loggggout',authcontroller.logout)



module.exports=router;