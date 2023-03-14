var express                 = require('express');
var router                  = express.Router();

router.use('/product',require('./product'));
router.use('/category',require('./category'));
router.use('/users',require('./users'));
router.use('/auth',require('./auth'));

module.exports = router;