const mongoose 			= require('mongoose');
const databaseConfig 	= require(__path_configs + 'database');
const {Schema} 			= require('mongoose');

var schema = new mongoose.Schema({ 
    title 		    : String,
	category	    : {
						id : {type: Schema.Types.ObjectId},
						name : String
					},
	category_id		: {
							type: Schema.Types.ObjectId,
							ref: 'category',
							required: true
						},
	price		    : Number,
	desc		    : String,
	image01         :String,
	image02         :String,
	image03         :String


});

module.exports = mongoose.model(databaseConfig.col_product, schema );