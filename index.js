const express = require('express');
const server = express();
const port = 8080;

server.listen(port, () => {
    console.log(`Escuchando puerto ${port}`);
})
server.use(express.json());
//server.use(urlencoded({extended: true}));

const { promises: fs } = require('fs')

class Container {
    constructor (path) {
        this.path = path;
    }

    async getById(id) {
        try {
            const products = await this.getAll();
            const filteredProduct = await products.slice([id-1], [id])
            console.log(filteredProduct)
            return (filteredProduct);
        } catch (error) {
            console.log('Ocurrió un error0', error)
            return [];
        }
    }

    async getAll() {
        try {
            const file = await fs.readFile(`./products.txt`, "utf-8");   
            return JSON.parse(file);
        } catch (error) {
            console.log('Ocurrió un error1', error)
            return [];
        }
    }
}

const newContainer = new Container(`./products.txt`)
const products = newContainer.getAll()

server.get("/productos", (req, res) => {
    res.send(products);
})

server.get("/productoRandom", (req, res) => {
    const nDeCeros = products[products.length - 1].id.length;
    let multiplicador = "1" + "0" * nDeCeros;
    const randomId = Math.random() * parseInt(multiplicador);
    const randomProduct = newContainer.getById(randomId);
    res.send(randomProduct);
})