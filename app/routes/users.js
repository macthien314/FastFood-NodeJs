

const express = require('express')
const router = express.Router();
const controllerName = 'users';

const { check, validationResult } = require("express-validator");
const notify = require(__path_configs + 'notify');
const MainModel = require(__path_models + controllerName);
const util = require('node:util');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/ErrorResponse');
var { protect, authorize } = require(__path_middleware + 'auth')

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
  if (!data) {
    return res.status(200).json({
      success: true,
      data: 'Dữ liệu rỗng'
    })
  }
  res.status(200).json({
    success: true,
    data: data
  })
}))

router.post("/add", protect, authorize("admin"), asyncHandler(async (req, res, next) => {
  const error = await validateReq(req, res, next);
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

router.put("/edit/:id", asyncHandler(async (req, res, next) => {
  const error = await validateReq(req, res, next);
  if (!error) {
    let body = req.body;
    const data = await MainModel.editItem({ 'id': req.params.id, 'body': body }, { 'task': 'edit' });
    res.status(200).json({
      success: true,
      data: data
    })
  }
}))

router.delete('/delete/:id', protect, authorize("admin"), asyncHandler(async (req, res, next) => {
  const data = await MainModel.deleteItem({ 'id': req.params.id }, { 'task': 'one' })
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
    username: { min: 6, max: 100 },
    // enum: ['user', 'publisher'],
    password: { min: 4, max: 1000 },

  }
  await check('username', util.format(notify.ERROR_NAME, options.username.min, options.username.max)).isLength({ min: options.username.min, max: options.username.max }).run(req);
  await check('email', util.format(notify.ERROR_EMAIL)).matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).run(req);
  // await check('role',util.format(notify.ERROR_ROLE)).isIn(options.enum).run(req);
  await check('password', util.format(notify.ERROR_NAME, options.password.min, options.password.max)).isLength({ min: options.password.min, max: options.password.max }).run(req);
  let errors = validationResult(req);
  if (errors.isEmpty() === false) {
    next(new ErrorResponse(400, errors));
    return true;
  }
  return false;
}