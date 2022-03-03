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

// This function, given food_id and note_id, get the note specified
// food_id is the id of the food record
// note_id is the id of the note
async function getNote(food_id, note_id){
    let db = getDB();
    let foodRecord = await db.collection(COLLECTION_NAME)
                            .findOne({
                                '_id':ObjectId(food_id)
                            },{
                                'projection':{
                                    'name':1,
                                    'notes': {
                                        /* project one element from the notes array */
                                        '$elemMatch':{
                                            '_id':ObjectId(note_id)
                                        }
                                    },
                                }
                            })
    return foodRecord;
}

// defining COLLECTION_NAME so that we can change
// the collection name easier next time
const COLLECTION_NAME = "food_records";

async function main() {
    // connect to the mongodb
    // first arg of the MongoClient.connect() is the URI (or your connection string)
    await connect(process.env.MONGO_URI, "tgc16-food")

    // SETUP ROUTES
    app.get('/', async function (req, res) {
        const db = getDB();
        // if the criteria object is empty then
        // it means to fetch all the records from the collectrion
        let allFood = await db.collection(COLLECTION_NAME).
                        find({}).toArray();
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
        await db.collection(COLLECTION_NAME).insertOne({
            'name': foodName,
            'calories': calories,
            'tags': tagArray
        });

        res.redirect('/');
    })

    app.get('/food/:food_id/edit', async function(req,res){
        // get the record with the id in the parameter
        let foodRecord = await getDB().collection(COLLECTION_NAME).findOne({
            '_id': ObjectId(req.params.food_id)
        })

        if (!Array.isArray(foodRecord.tags)) {
            if (foodRecord.tags) {
                foodRecord.tags = [foodRecord.tags];
            } else {
                foodRecord.tags = [];
            }
        }

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
            'tags': tags
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

    
    app.get('/food/:food_id/delete', async function(req,res){
        let foodRecord = await getDB().collection(COLLECTION_NAME).findOne({
            '_id': ObjectId(req.params.food_id)
        })
        res.render('delete_product.hbs',{
            'foodRecord': foodRecord
        })
    })

    app.post('/food/:food_id/delete', async function(req,res){
        let food_id = req.params.food_id;
        await getDB().collection(COLLECTION_NAME).deleteOne({
            '_id':ObjectId(food_id)
        })
        res.redirect('/')
    })

    // 
    app.get('/food/:food_id/notes/add', async function(req,res){
        let db = getDB();
        let foodRecord = await db.collection(COLLECTION_NAME)
                                 .findOne({
                                    '_id': ObjectId(req.params.food_id)
                                 })
        res.render('add_note.hbs',{
            'food':foodRecord
        })
    })

    app.post('/food/:food_id/notes/add', async function(req,res){
        let foodRecordId = req.params.food_id;
        let noteContent = req.body.note_content;
        await getDB().collection(COLLECTION_NAME)
                    .updateOne({
                        "_id":ObjectId(foodRecordId)
                    },{
                        '$push':{
                            'notes':{
                                '_id': new ObjectId(),
                                'content': noteContent
                                
                            }
                        }
                    })
        // always send a response from your route
        res.redirect('/')
    })

    app.get('/food/:food_id/notes', async function(req,res){
        let foodRecord = await getDB()
                            .collection(COLLECTION_NAME)
                            .findOne({
                                '_id':ObjectId(req.params.food_id)
                            },{
                                'projection':{
                                    'name':1,
                                    'notes':1
                                }
                            })
                        
        res.render('all_notes.hbs',{
            'foodRecord':foodRecord
        })
    })

    app.get('/food/:food_id/notes/:note_id', async function(req,res){
        let foodRecord = await getNote(req.params.food_id, req.params.note_id);
        // res.json(foodRecord.notes[0]);
        res.render('edit_note.hbs', {
            'foodRecord': foodRecord
        })
    })

    await app.post('/food/:food_id/notes/:note_id', async function(req,res){
        let db = getDB();
        await db.collection(COLLECTION_NAME).updateOne({
            '_id':ObjectId(req.params.food_id),
            'notes._id':ObjectId(req.params.note_id)
        },{
            '$set':{
                'notes.$.content': req.body.note_content
            }
        })

        res.redirect(`/food/${req.params.food_id}/notes`)
    })

    app.get('/food/:food_id/notes/:note_id/delete', async function(req,res){
        let foodRecord = await getNote(req.params.food_id, req.params.note_id);
        res.render('delete_note.hbs',{
            'foodRecord': foodRecord
        })

    })

    app.post('/food/:food_id/notes/:note_id/delete', async function(req,res){
        let db = getDB();
        await db.collection(COLLECTION_NAME)
                .updateOne({
                    '_id': ObjectId(req.params.food_id)
                },{
                    '$pull':{
                        'notes':{
                            '_id':ObjectId(req.params.note_id)
                        }
                    }
                })
        res.redirect(`/food/${req.params.food_id}/notes`)
    })
}

main();


app.listen(3000, function () {
    console.log("Server has started")
});