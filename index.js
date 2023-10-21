const express = require('express');
const cors = require('cors');
require('./configs/database')
const routes = require('./routes/routes');

const main = async () => {
    const app = express();
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    const port = 3000;

    routes(app);
    
    app.listen(port,() => {
    console.log('Server is running on port $(port)');
    });
}

main().catch((e)=>console.error(e))