const fs            = require('fs');
const mongoose      = require('mongoose');
var colors          = require('colors');

const pathConfig        = require('./path');
global.__base           = __dirname + '/';
global.__path_app       = __base + pathConfig.folder_app + '/';

global.__path_configs   = __path_app + pathConfig.folder_configs + '/';

const databaseConfig  = require(__path_configs + 'database');


mongoose.set('strictQuery', true);
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@${databaseConfig.database}.so6n0gl.mongodb.net/?retryWrites=true&w=majority`);
  console.log('connected'.magenta);

}

const ProductSchemas       = require('./app/schemas/product');
const CategorySchemas    = require('./app/schemas/category');
const UsersSchemas      = require('./app/schemas/users');

const Product = JSON.parse(
    fs.readFileSync(`${__dirname}/app/_data/product.json`,'utf-8')
)
const Category = JSON.parse(
    fs.readFileSync(`${__dirname}/app/_data/category.json`,'utf-8')
)
const Users = JSON.parse(
    fs.readFileSync(`${__dirname}/app/_data/users.json`,'utf-8')
)

const importData = async () => {
    try {
        await CategorySchemas.create(Category)
        await ProductSchemas.create(Product)
        await UsersSchemas.create(Users)
        console.log('importData...'.bgCyan);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

const deleteData = async () => {
    try {
        await ProductSchemas.deleteMany({})
        await CategorySchemas.deleteMany({})
        await UsersSchemas.deleteMany({})
        console.log('deleteData...'.bgCyan);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}

if(process.argv[2] === '-i'){
    importData();
}else if(process.argv[2] === '-d'){
    deleteData();
}