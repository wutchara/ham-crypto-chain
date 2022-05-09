const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser.json());

const getChain = () => {
    return blockchain.chain;
}

app.get('/api/blocks', (req, res) => {
    console.log('Access: ', '/api/blocks');
    res.json(getChain());
});

app.post('/api/mine', (req, res) => {
    const body = req.body;
    console.log('Access: ', '/api/mine', body);
    blockchain.addBlock({
        data: body.data
    });

    res.json(getChain());
});

const port = 3000;
app.listen(port, () => {
    console.log('Running on localhost:' + port);
});