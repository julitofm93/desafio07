import database from '../config.js';

export default class Productos{
    constructor(){
        database.schema.hasTable('productos').then(result=>{
            if(!result){
                database.schema.createTable('productos', table=>{
                    table.increments();
                    table.string('nombre').notNullable;
                    table.string('descripcion').notNullable;
                    table.integer('codigo').notNullable;
                    table.integer('precio').notNullable;
                    table.integer('stock').notNullable;
                    table.string('thumbnail').notNullable;
                    table.timestamps(true, true);
                }).then(result=>{
                    console.log("tabla creada")
                })
            }
        })
    }

    getAll = async () => {
        try{
            let productos = await database.select().table('productos');
            return {status:"succes", payload:productos}
        }catch(error){
            return {status:"error", message:error}
        }
    }

    getById = async (id) => {
        try{
            let product = await database.select().table('productos').where('id',id).first();
            if(product){
                return {status:"succes", payload:product}
            }else{
                return {status:"error", message:"producto not found"}
            }
            }catch(error){
                return {status:"error", message:error}
            }
        }
    
    save = async (product) => {
        try{
            let exists = await database.table('productos').select().where('codigo', product.codigo).first();
            if(exists) return {status:"error", message:"Product already exists"}
            let result = await database.table('productos').insert(product)
            return {status:"succes", payload:result}
        }catch(error){
            return {status:"error", message:error}
        }
    }
}
