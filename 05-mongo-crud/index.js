const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
require('dotenv').config();
const {
    connect,
    getDB
} = require('./MongoUtil');

const ObjectId = require('mongodb').ObjectId;
const helpers = require('handlebars-helpers')(
    {
        'handlebars': hbs.handlebars
    }
)

const app = express();
app.set('view engine', 'hbs');

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// for forms to work
app.use(express.urlencoded({
    extended:false
}));

async function main() {
    // connect to the mongodb
    // first arg of the MongoClient.connect() is the URI (or your connection string)
    await connect(process.env.MONGO_URI, "tgc16-food")

    // SETUP ROUTES
    app.get('/', async function (req, res) {
        const db = getDB();
        let allFood = await db.collection('food_records').find({}).toArray();
        res.render('all_food.hbs',{
            'foodRecords':allFood
        })
    })

    app.get('/food/add', async function(req,res){
        // read in all the possible tags
        // const db = getDB();
        // let allTags = await db.collection('all_tags').find().toArray();
        res.render('add_food.hbs',{
            // 'tags': allTags
        })
    })

    app.post('/food/add', async function(req,res){
        // step 1. extract info from form
        // let foodName = req.body.foodName;
        // let calories = req.body.calories;
        // let tags = req.body.tags;
        let { foodName, calories, tags} = req.body;  // <-- object destructuring
       
        // convert tags to be an array if it is not an array
        let tagArray = [];
        // check if tags is not undefined or null or empty string (meaning the user selects at least one checkbox)
        if (tags) {
            // check if tags is an array
            if (Array.isArray(tags)) {
                tagArray = tags;
            } else {
                // it means that tags is a single string
                // so put it into an array as the only element
                tagArray = [tags]
            }
        }

        // step 2 and 3. insert in the collection
        let db = getDB();
        await db.collection('food_records').insertOne({
            'name': foodName,
            'calories': calories,
            'tags': tagArray
        });

        res.send("form recieved");
    })

    app.get('/food/:food_id/edit', async function(req,res){
        // get the record with the id in the parameter
        let foodRecord = await getDB().collection('food_records').findOne({
            '_id': ObjectId(req.params.food_id)
        })

        res.render('edit_food.hbs',{
            'food':foodRecord
        })
    } )

    app.post('/food/:food_id/edit', async function(req,res){

        let tags = req.body.tags || [];
        tags = Array.isArray(tags) ? tags : [tags];

        let foodDocument = {
            'name': req.body.foodName,
            'calories':req.body.calories,
            
        }

        await getDB().collection('food_records').updateOne({
            '_id': ObjectId(req.params.food_id)
        },{
            '$set': {
                'name': foodDocument.name,
                'calories': foodDocument.calories,
                'tags': foodDocument.tags
            }
        })

        //    await getDB().collection('food_records').updateOne({
        //     '_id': ObjectId(req.params.food_id)
        // },{
        //     '$set': {
        //         ...foodDocument  // spread operator
        //     }
        // })

        // await getDB().collection('food_records').updateOne({
        //     '_id': ObjectId(req.params.food_id)
        // },{
        //     '$set': {
        //         ...foodDocument,  // spread operator
        //         'tags': tags // replace the tags from foodDocument with whatever tags is
        //     }
        // })


        res.redirect('/')
    })
}

main();


app.listen(3000, function () {
    console.log("Server has started")
});