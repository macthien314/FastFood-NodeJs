

const express = require('express')
const router = express.Router();
const controllerName = 'auth';
const systemConfig  = require(__path_configs + 'system');
const util  = require('node:util');
const {check, validationResult } = require("express-validator");
const notify = require(__path_configs + 'notify');
const MainModel = require(__path_models + controllerName);

const asyncHandler = require('../middleware/async');
var ErrorResponse   = require(__path_utils + 'ErrorResponse');
var {protect , authorize}   = require(__path_middleware + 'auth');

router.post('/register',asyncHandler(async (req,res, next) => {
    let error = await validateReq(req, res, next);
    if(!error){
      const token = await MainModel.create(req.body);
      if(token){
        saveCookieResponse(res,201,token);

      }
    }
}))

router.post('/login',asyncHandler(async (req,res, next) => {
    const token = await MainModel.login(req.body,res);
    if(token){
        saveCookieResponse(res,201,token);
    }
}))

router.get('/me',protect,asyncHandler(async (req,res, next) => {
    res.status(200).json({
        success : true,
        user : req.user
    })
}))

router.post('/forgotPassword',asyncHandler(async (req,res, next) => {
    const result = await MainModel.forgotPassword(req.body)
    if(!result) res.status(401).json({success : true , message : "Email không tồn tại"})
    res.status(200).json({
        success : true,
        data : result
    })
}))

router.post('/resetPassword/:resetToken',asyncHandler(async (req,res, next) => {
    let err = await validateResetPass(req,res, next);
    if(!err){
        const user = await MainModel.resetPassword({resetToken : req.params.resetToken , password : req.body.password})
        if(!user) res.status(401).json({success : true , massage : "Không tồn tại Token"})
        res.status(201)
        .json({
            success : true,
            user
        })
    }
}))

router.get('/logout',protect,asyncHandler(async (req,res, next) => {
    res.status(200)
    .cookie('token','none',{
        expirers : new Date (
            Date.now() + 10 * 1000
        ),
        httpOnly : true
    })
    .json({
        success : true,
    })
}))


module.exports = router;

const saveCookieResponse = (res,statusCode,token) => {
    const options = {
        expirers : new Date (
            Date.now() + systemConfig.COOKIE_EXP * 24 * 60 * 60 * 1000
            // Date.now() + 10000
        ),
        httpOnly : true
    }

    res.status(statusCode)
    .cookie('token',token,options)
    .json({
        success : true,
        token
    })
}

// makeId = (number) => {
//   let text = "";
//   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//   for (let i = 0; i < number; i++)
//     text += possible.charAt(Math.floor(Math.random() * possible.length));

//   return text;
// }

const validateReq = async (req, res, next) =>{
  const options = {
    username: { min: 6, max: 100 },
    enum: ['user'],
    password: { min: 4, max: 20 },

  }
  await check('username', util.format(notify.ERROR_NAME, options.username.min, options.username.max)).isLength({ min: options.username.min, max: options.username.max }).run(req);
  await check('email',util.format(notify.ERROR_EMAIL)).matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).run(req);
//   await check('role',util.format(notify.ERROR_ROLE)).isIn(options.enum).run(req);
  await check('password',util.format(notify.ERROR_NAME, options.password.min, options.password.max)).isLength({ min: options.password.min, max: options.password.max }).run(req);
  let errors = validationResult(req);
  if(errors.isEmpty() === false) {
     next(new ErrorResponse(400, errors));
     return true;
  }
  return false;
}

const validateResetPass = async (req, res, next) =>{
    const options = {

      password: { min: 6, max: 20 },
  
    }
    
    await check('password',util.format(notify.ERROR_NAME, options.password.min, options.password.max)).isLength({ min: options.password.min, max: options.password.max }).run(req);
    let errors = validationResult(req);
    if(errors.isEmpty() === false) {
       next(new ErrorResponse(400, errors));
       return true;
    }
    return false;
  }