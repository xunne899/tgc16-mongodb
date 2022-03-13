
// console.log(process.env.MONGO_URI)


const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on')
require('dotenv').config();

// Bring in the mongoclient
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.set('view engine', 'hbs');

wax.on(hbs.handlebars);
// wax.setLayoutPath('./views/layouts');

async function main() {
    // connect to the mongodb
    // first arg of the MongoClient.connect() is the URI (or your connection string)
    const client = await MongoClient.connect(process.env.MONGO_URI,{
        useUnifiedTopology: true
    })

    // SETUP ROUTES
    // SETUP ROUTES
    app.get('/', async function (req, res) {
        const db = client.db('sample_airbnb');// select the sample_airbnb database
       const data = await db.collection('listingsAndReviews') // select the listingsAndReviews collection
                        .find({
                            'beds':{
                                "$gte":3
                            }
                        },{
                            'projection':{
                                'name':1,
                                'description': 1
                            }
                        })
                        .limit(10)
                        .toArray(); // find all documents
        
            res.render('listings.hbs',{
                            'listings': data
                })
    })
}

main();


app.listen(3000, function () {
    console.log("Server has started")
});