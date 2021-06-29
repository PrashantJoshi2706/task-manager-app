
const express = require('express');
const User = require('../models/user');
const router = express.Router();
const sharp = require('sharp');
const {sendingMail} = require('../emails/account');
const auth = require('../middleware/auth');
const multer = require('multer');
/*create a new user */
router.post('/users', async (req, res)=>{
    const user = new User(req.body);
    try{
        const token = await user.generateAuthToken();
       await user.save();
       sendingMail(user.email, user.name)
       res.send({user, token});
    }
    catch(e){
        res.status(400).send(e);
        console.log(e);
    }
});

/*login part */

router.post('/user/login', async (req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }
    catch(e){
        res.status(404).send({Error: "user does not exist"})
    }
})
/*rea the profile of user */
router.get('/users/me', auth,async (req, res)=>{
    try{
        res.send(req.user);
    }
    catch(e){
        res.status(500).send(e);
    }
});

/*update the user */

router.patch('/user/me', auth,async (req, res)=>{
    const update = Object.keys(req.body);
    const allowedUpdates = ['name', 'password', 'email', 'age'];
    const isValidOperation = update.every((ele)=> allowedUpdates.includes(ele))

    if(!isValidOperation){
        return res.status(404).send({error: 'invalid Operation'});
    }
    try{
         //const user = await User.findById(_id);
         update.forEach((element)=> req.user[element] = req.body[element] );
        //const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});

         await req.user.save();
        res.send(req.user);
    }
    catch(e){
        res.status(500).send(e);
    }
});
/*delete the user account */
router.delete('/user/me', auth,async (req, res)=>{
    try{
        await req.user.remove();
        sendingCancelMail(req.user.email, req.user.name);
        res.send(req.user);
    }
    catch(e){
            res.status(500).send();
    }
});
/*logout from the given login place */
router.post('/users/logout', auth,async (req, res)=>{
    try{
        
        req.user.tokens = req.user.tokens.filter(token=>{
            return token.token !== req.token;
        })
        await req.user.save();
        res.send()
        
    }
    catch(e){
        res.status(500).send(e)
    }

});
/*logout from all places */
router.post('/users/logoutall', auth, async (req,res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    }
    catch(e){
        res.status(500).send(e);
    }
});
/*upload picture of user */
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true) 
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message});
});
/*delete the picture */
router.delete('/users/me/avatar', auth, async (req, res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send();
});
/*get the picture of the user from the database */
router.get('/users/:id/avatar', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png');
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send();
    } 
})

module.exports = router;