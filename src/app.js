//DEPENDENCIAS
import express from 'express';
import {engine} from'express-handlebars';
import cors from 'cors'
import productosRouter from './routes/productos.js'
import upload from './services/upload.js'
import __dirname from './utils.js';
import Products from './services/productos.js'
import {Server} from 'socket.io'

const app = express();


//CONFIGURO EL SERVIDOR
const server = app.listen(8080,()=>{
    console.log("server listening on port 8080")
})

//DECLARO EL SERVIDOR DEL SOCKET
export const io = new Server(server)


const productsService = new Products()


app.engine('handlebars',engine())
app.set('views', './views')
app.set('view engine', 'handlebars')
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());
app.use(express.static(__dirname+'public'))
app.use('/api/productos',productosRouter);

app.post('/api/uploadfile',upload.single('file'),(req,res)=>{
    const file = req.file;
    if(!file||file.length===0){
        res.status(500).send({message:"No se subio ningun archivo"})
    }
    res.send(file);
})

app.get('/views/productos',(req,res)=>{
    productsService.getAll().then(result=>{
        let info = result.payload;
        let preparedObject = {
            productos : info
        }
        
        res.render('productos', preparedObject)
        
    })
})

//SOCKET
let messages = []
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`)
    let productosSocket = await productsService.getAll();
    socket.emit('updateProductos', productosSocket)
    socket.emit('messagelog', messages)
    //Recibe la informacion del input
    socket.on('message', data=>{
        //Le indicamos que con la informacion del input devuela el mensaje con la info
        //con el 'io.emit' hacemos que ese mensaje se envie a todos los clientes
        messages.push(data)
        io.emit('messageLog',messages)
    })
})