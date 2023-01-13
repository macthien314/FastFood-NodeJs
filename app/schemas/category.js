const mongoose = require('mongoose');
const databaseConfig = require(__path_configs + 'database');

var schema = new mongoose.Schema({ 
    name 		    : String,
});

schema.virtual('product', {
	ref: 'products', //The Model to use
	localField: '_id', //Find in Model, where localField 
	foreignField: 'category_id', // is equal to foreignField
 });
 
 // Set Object and Json property to true. Default is set to false
 schema.set('toObject', { virtuals: true });
 schema.set('toJSON', { virtuals: true });



module.exports = mongoose.model(databaseConfig.col_category, schema );