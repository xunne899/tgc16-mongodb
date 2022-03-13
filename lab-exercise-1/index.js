// const express = require('express');
// const hbs = require('hbs');
// const wax = require('wax-on');
// require('dotenv').config();
// const {
//     connect,
//     getDB
// } = require('./MongoUtil');

// const app = express();
// app.set('view engine', 'hbs');

// wax.on(hbs.handlebars);
// wax.setLayoutPath('./views/layouts');

// async function main() {
//     // connect to the mongodb
//     // first arg of the MongoClient.connect() is the URI (or your connection string)
//     await connect(process.env.MONGO_URI, "animal_shelter")

//     // SETUP ROUTES
//     app.get('/', async function (req, res) {
//         const data = await getDB().collection('animals') // select the listingsAndReviews collection
//             .find({}    
//             ,{'projection':{
//                 'name': 1,
//                 'age':1 ,
//                 'type':1 ,
//                 'gender':1
//             }
//             })
//             .toArray(); // find all documents

//         res.render('listings',{
//             'listings':data
//         });
//     })
// }

// main();


// app.listen(3000, function () {
//     console.log("Server has started")
// });

// EXPRESS AND OTHER SETUP
const express = require('express');
const MongoUtil = require('./MongoUtil.js')
// const { getDB, connect} = require('./MongoUtil.js) <-- import in functions directly
//                                                        if we do that, then no need MongoUtil in front, can just those functions directly
const hbs = require('hbs')
const wax = require('wax-on')

// load in environment variables
require('dotenv').config();

// create the app
const app = express();
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))

// setup template inheritance
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')


async function main() {
    const MONGO_URI=process.env.MONGO_URI;
    await MongoUtil.connect(MONGO_URI, "tgc16_shelter");

    app.get('/', async function(req,res){
        let allAnimals = await MongoUtil.getDB().collection('animals').find({}).toArray();
        res.render('all_animals.hbs',{
            'animals':allAnimals
        })
    })
 
    app.get('/animals/add', function(req,res){
        res.render('add_animal.hbs')
    } )

    app.post('/animals/add', async function(req,res){
        await MongoUtil.getDB().collection('animals').insertOne(req.body);
        res.redirect('/'); // instruct the browser to go to the / route
    })

}

main();

// LISTEN
app.listen(3000, ()=>{
    console.log("Express is running")
    
})