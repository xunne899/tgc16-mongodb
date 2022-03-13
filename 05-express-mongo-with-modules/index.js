const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const {
    connect,
    getDB
} = require('./MongoUtil');

const app = express();
app.set('view engine', 'hbs');

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

async function main() {
    // connect to the mongodb
    // first arg of the MongoClient.connect() is the URI (or your connection string)
    await connect(process.env.MONGO_URI, "sample_airbnb")

    // SETUP ROUTES
    app.get('/', async function (req, res) {
        const data = await getDB().collection('listingsAndReviews') // select the listingsAndReviews collection
            .find({
                'beds':{
                '$gte':3}
            },{
                'projection':{
                'name': 1,
                'beds': 1 ,
                'description':1
                }
            })
            .limit(10)
            .toArray(); // find all documents

        res.render('listings',{
            'listings':data
        });
    })
}

main();


app.listen(3000, function () {
    console.log("Server has started")
});