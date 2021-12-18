import express from 'express'
import upload from '../services/upload.js'
import Products from '../services/productos.js'
import {io} from '../app.js'
const router = express.Router();
const productsService = new Products()



//GET - Devuelve todos los productos
router.get('/',(req,res)=>{
    productsService.getAll().then(result=>{
        res.send(result)
    })
})

//GET - Devuelve un producto según su ID
router.get('/:pid',(req,res)=>{
    let id = req.params.pid;
    id = parseInt(id)
    productsService.getById(id).then(result=>{
        res.send(result);
    })
})

//POST - Recibe y agrega un producto, y lo devuelve con su ID asignado
router.post('/', /* authMiddleware, */ upload.single('image'),(req,res)=>{
    let file = req.file;
    let event = req.body;
    event.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename;
    productsService.save(event).then(result=>{
        res.send(result);
        })
})

//PUT - Recibe y actualiza un producto según si ID
router.put('/:pid',(req,res)=>{
    let body = req.body;
    let id = parseInt(req.params.pid)
    contenedor.updateProducto(id,body).then(result=>{
        res.send(result)
    })
})

//DELETE - Elimina un producto según su ID
router.delete('/:pid',(req,res)=>{
    let id = parseInt(req.params.pid);
    contenedor.deleteById(id).then(result=>{
        res.send(result);
    })
})

export default router;