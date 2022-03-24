Show all the databases in your server

show databases;
To set the active database sample_airbnb

use sample_training;
To know what is the current database

db
To see all the collections in the current actiee database:

show collections
Find documents
Generic syntax:



db.<name of collection>.find()
Prettify the result:
db.companies.find().pretty()






db.companies.find().pretty().limit(5);

## 1a
db.companies.find({
    'founded_year' :2006
    },{
        'name': 1,
        'founded_year':1
    }).pretty();


## 1b

db.companies.find({
    "founded_year":{
        '$gte':2000
        }      
},{ "name" :1,
    "founded_year":1
}).pretty();

## 1c
    db.companies.find({
    "founded_year" :{
        '$gte':1900,
        '$lte':2010
        }
        },{ 'name':1,
            'founded_year':1
    }).pretty();




## 2a
    ```
db.companies.find({
    'ipo.valuation_amount':{
        '$gte':100000000
    }
},{
    'name':1,
    'ipo':1
})


db.companies.find({
    ''ipo.valuation_currency_code':'USD',
    

})


## perfume collection

db.perfume.insertMany([
    {
        'name':'spring',
        'country':'germany',
        'cost': '$45',
        'type':'smell of fresh spring'
    },
    {
        'name':'summer',
        'country':'italy',
        'cost': '$50',
        'type':'smell of vibrant energy'
    }
])

## add array attributes from  perfume 
db.perfume.updateOne({
    '_id':ObjectId("623cbd2db6366ca99675dde2"),
}, {
    '$push': {
        'capacity': '100ml'
    }
})

## add one properties string
db.perfume.updateOne({
        '_id':ObjectId("623cbd2db6366ca99675dde2")
}, {
    '$set': {
        'capacity':'100ml'
    }
})

Delete object 
db.perfume.deleteOne({
    '_id': ObjectId("623cbd2db6366ca99675dde2")
})



## remove array attributes to  perfume 
db.perfume.updateOne({
    '_id':ObjectId("623cbd2db6366ca99675dde2"),
}, {
    '$pull': {
        'capacity': '100ml'
    }
})

## self notes 