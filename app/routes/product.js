const express = require('express')
const router = express.Router();
var asyncHandler = require(__path_middleware + 'async');
var ErrorResponse = require(__path_utils + 'ErrorResponse');
var { protect, authorize } = require(__path_middleware + 'auth');
const cloudinary = require('cloudinary').v2;
const controllerName = 'product';
// const MainValidate	= require(__path_validates + controllerName);
const { check, validationResult } = require("express-validator");
const notify = require(__path_configs + 'notify');
const MainModel = require(__path_models + controllerName);
const util = require('node:util');

const uploader = require('../middleware/uploader');

/* GET users listing. */
router.get("/", asyncHandler(async (req, res, next) => {


  const data = await MainModel.listItems(req.query, { 'task': 'all' });
  res.status(200).json({
    success: true,
    count: data.length,
    data: data
  })

}))

router.get("/:id", asyncHandler(async (req, res, next) => {
  const data = await MainModel.listItems({ 'id': req.params.id }, { 'task': 'one' });
  res.status(200).json({
    success: true,
    data: data
  })
}))
var cpUpload = uploader.fields([
  { name: 'image01' },
  { name: 'image02' },
  { name: 'image03' },
]);
router.post("/add", cpUpload, protect, authorize("publisher", "admin"), asyncHandler(async (req, res, next) => {

  const fileData = req.files;
  req.body.image01 = fileData.image01[0].path;
  req.body.image02 = fileData.image02[0].path;
  req.body.image03 = fileData.image03[0].path;
  const error = await validateReq(req, res, next);
  if (error) {
    if (fileData) {
      cloudinary.api.delete_resources([fileData.image01[0].filename, fileData.image02[0].filename, fileData.image03[0].filename])
    }
  }
  // let params = [];
  // params.id = makeId(8);
  // params.name = req.body.name;
  // params.status = req.body.status;
  if (!error) {
    const data = await MainModel.create(req.body);
    res.status(200).json({
      success: true,
      data: data
    })
  }


}))

router.put("/edit/:id", cpUpload, protect, authorize("publisher", "admin"), asyncHandler(async (req, res, next) => {
  // const error = await validateReq(req, res, next);
  
  // if (!error) {
  let body = req.body;
  const data = await MainModel.editItems({ 'id': req.params.id, 'body': body }, { 'task': 'edit' });
  res.status(200).json({
    success: true,
    data: data
  })
  // }
}))

router.delete("/delete/:id", protect, authorize("publisher", "admin"), asyncHandler(async (req, res, next) => {
  const data = await MainModel.deleteItems({ 'id': req.params.id }, { 'task': 'one' });
  res.status(200).json({
    success: true,
    data: data
  })
}))

router.put('/event/:type/:id', asyncHandler(async (req, res, next) => {
  const data = await MainModel.event({ 'id': req.params.id, 'type': req.params.type })
  if (!data) return res.status(200).json({ success: true, data: "Sai trạng thái cập nhật" })
  res.status(200).json({
    success: true,
    data: data
  })
}))


module.exports = router;
// makeId = (number) => {
//   let text = "";
//   let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

//   for (let i = 0; i < number; i++)
//     text += possible.charAt(Math.floor(Math.random() * possible.length));

//   return text;
// }

const validateReq = async (req, res, next) => {
  const options = {
    title: { min: 5, max: 80 },
    desc: { min: 10, max: 500 },

  }
  await check('title', util.format(notify.ERROR_NAME, options.title.min, options.title.max)).isLength({ min: options.title.min, max: options.title.max }).run(req);
  await check('desc', util.format(notify.ERROR_NAME, options.desc.min, options.desc.max)).isLength({ min: options.desc.min, max: options.desc.max }).run(req);
  let errors = validationResult(req);
  if (errors.isEmpty() === false) {
    next(new ErrorResponse(400, errors));
    return true;
  }
  return false;
}



