const express= require('express')
const router = new express.Router()
const User = require('../models/user.model')
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')
// const multer = require('multer')
//register
router.post('/register', async(req, res)=>{
    user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateToken()
        res.send({
            status:1,
            message:'added',
            data: {user, token}
        })
    }
    catch(e){
        res.send({
            status:0,
            message:e.message,
            data:''
        })
    }
})
//login
router.post('/login', async(req,res)=>{
    try{
        user = await User.findUserByCredentials(req.body.email, req.body.password)
        const token = await user.generateToken()
        res.status(200).send({
            error:null,
            apiStatus:true,
            data: {user, token}
        })
    }
    catch(e){
        res.status(400).send({
            error: e.message,
            apiStatus:false,
            data:'login error'  
        })
    }
})
//log out
router.post('/logout', auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter(singleToken=>{
            return singleToken.token != req.token
        })
        await req.user.save()
        req.status(200).send({
            error:null,
            apiStatus:true,
            data:'logged out successfully '
        })
    }
    catch(e){
       req.status(400).send({
           error: e.message,
           apiStatus:false,
           data: e.message
       }) 
    }
})
//log out from all
router.post('/logoutAll', auth, async(req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send({
            error: null,
            apiStatus: true,
            data: 'logged out successfully'
        })
    }
    catch(e){
        res.status(400).send({
            error: e.message,
            apiStatus: false,
            data: e.message
        })
    }
})
//get user
router.get('/user/me', auth, async(req,res)=>{
    res.status(200).send({
        error: null,
        apiStatus:true,
        data: {user: req.user}
    })
})
//edit status 
router.post('/user/me/changeStatus', auth, async(req, res)=>{
    try{
        req.user.status = !req.user.status
        await req.user.save()
        res.status(200).send({
            error:null,
            apiStatus:true,
            message:'status changed',
            data:{user: req.user},
        })
        }
        catch(e){
        res.status(400).send({
            error: e.message,
            apiStatus: false,
            data: '',
            message: 'status change problem'
        })
        }
})
//edit password
router.post('/user/changePassword', auth, async(req, res)=>{
    try{
        if(!req.body.old_pass || req.body.new_pass) throw new Error('Invalid data')
        const matched = await bcrypt.compare(req.body.old_pass , req.body.password)
        if(!matched) throw new Error('invalid user old password')
        req.user.password = req.body.new_pass
        await req.user.save()
        res.status(200).send({
            error: null,
            apiStatus: true,
            data: {user: req.user},
            message: 'password changed'
        })
    }
    catch(e){
    res.status(400).send({
        error: e.message,
        apiStatus: false,
        data: '',
        message: 'password change problem'
    })
        }
})
//edit image
// let storage = multer.diskStorage({
//     destination:function(req, file, cb) { cb(null, 'images')},
//     limits:{fileSize:1},
//     filename:function(req, file, cb) {
//         if(!file.originalname.match(/\.(jpg|png)$/)){
//             return cb(new Error('error'))
//         }
//       cb(null, Date.now()+'.'+file.originalname.split('.').pop())
//     }
    
// })
// let upload = multer({ storage })

// router.post('/user/imgChange', auth, upload.single('profile'), async(req, res)=>{
//     req.user.image = `${req.file.destination}/${req.file.filename}`
//     await req.user.save()
//     try{res.send({
//         user:req.user
//     })
//     }catch(e){res.send(e.message)}
// })

//edit special attr in user
router.patch('/user/me', auth, async(req, res)=>{
    const allowedUpdates = ['name', 'phone', 'address']
    const validateEdits = updates.every(update=> allowedUpdates.includes(update))
    if(!validateEdits) return res.status(400).send({
        error:true,
        apiStatus:false,
        message:'unavailable updates'
    })
    try{
        updates.forEach(update=>req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send({
            error: null,
            apiStatus:true,
            data: {user: req.user}
        })
    }
    catch(error){
        res.status(400).send({
            error: error.message,
            apiStatus:false,
            data: 'unable to update'
        })
    }
})
//delete user
router.delete('/user/me', auth, async(req, res)=>{
    try{
        await req.user.remove()
        res.status(200).send({
            error: null,
            apiStatus: true,
            data: 'deleted'
        })
    }
    catch(error){
        res.status(400).send({
            error: error.message,
            apiStatus: false,
            data: 'delete error'
        })
    }
})
module.exports = router