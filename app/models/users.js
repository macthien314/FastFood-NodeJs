const MainModel 	= require(__path_schemas + 'users');


module.exports = {
    listItems : (params,option) => {
        // coppy params
        const queryFind = { ...params };

        let find,select,sort;

        // Create fields remove
        let removeFields = ['select','sort','page','limit'];

        // Remove fields 
        removeFields.forEach(param => delete queryFind[param]);

        // Create query string
        let queryStr = JSON.stringify(queryFind);

        // replace 
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, find => `$${find}`); 

        //parse
        find = JSON.parse(queryStr);

        // select fields
        if(params.select){
            select = params.select.split(',').join(' ');
        }

        // sort fields
        if(params.sort){
            sort = params.sort.split(',').join(' ');
        }

        //pagination
        const page  = parseInt(params.page) || 1;
        const limit = parseInt(params.limit) || 10;
        const skip  = ( page-1 )*limit;

        if(option.task == 'all'){
            return MainModel
                .find(find)
                .select(select)
                .sort(sort)
                .skip(skip).limit(limit)
        }
        if(option.task == 'one'){
            return MainModel
                .findById(params.id)
                .select({})
        }
    },
    create : async (item) => {
        const user = await new MainModel(item).save();
        return  await user.getSignedJwtToken();
        // return new MainModel(item).save();
    },
    deleteItem : (params,option) => { 
        if(option.task == 'one'){
            return MainModel
                .deleteOne({_id : params.id})
        }
    },
    editItem : async (params,option) => { 
        if(option.task == 'edit'){
            const user = await MainModel.findById(params.id)
            const userNew =  await user.updateNew(params.body);
            await MainModel.updateOne({_id : params.id},userNew)
            return userNew;
        }
    }, 
   
}