const express = require('express')
const router = express.Router();
var asyncHandler = require(__path_middleware + 'async');
var ErrorResponse = require(__path_utils + 'ErrorResponse');
var { protect, authorize } = require(__path_middleware + 'auth');

const controllerName = 'product';
// const MainValidate	= require(__path_validates + controllerName);
const { check, validationResult } = require("express-validator");
const notify = require(__path_configs + 'notify');
const MainModel = require(__path_models + controllerName);
const util = require('node:util');


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

router.post("/add", protect, authorize("publisher", "admin"), asyncHandler(async (req, res, next) => {
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

router.put("/edit/:id", protect, authorize("publisher", "admin"), asyncHandler(async (req, res, next) => {
  const error = await validateReq(req, res, next);

  if (!error) {
    let body = req.body;
    const data = await MainModel.editItems({ 'id': req.params.id, 'body': body }, { 'task': 'edit' });
    res.status(200).json({
      success: true,
      data: data
    })
  }
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
    name: { min: 5, max: 80 },
    description: { min: 10, max: 500 },

  }
  await check('name', util.format(notify.ERROR_NAME, options.name.min, options.name.max)).isLength({ min: options.name.min, max: options.name.max }).run(req);
  await check('description', util.format(notify.ERROR_NAME, options.description.min, options.description.max)).isLength({ min: options.description.min, max: options.description.max }).run(req);
  let errors = validationResult(req);
  if (errors.isEmpty() === false) {
    next(new ErrorResponse(400, errors));
    return true;
  }
  return false;
}