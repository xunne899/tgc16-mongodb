Show all the databases in your server

show databases;
To set the active database sample_airbnb

use sample_training;
To know what is the current database

db
To see all the collections in the current active database:

show collections
Find documents
Generic syntax:



db.<name of collection>.find()
Prettify the result:
db.companies.find().pretty()


use sample_airbnb

db.listingsAndReviews.find({

    'beds' : 2
    },{
        'name':1, 'address':1, 'beds':1
    }).pretty().limit(5)

db.companies.find().pretty().limit(5);


db.listingsAndReviews.find({
    'beds':2
    },{
        'name':1,
        'address':1,
        'beds':1,  
        'bed_type':1
        
}).pretty().limit(5)

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

db.companies.find({
    'founded_year':{
        '$gte':1800,
        '$lte':2030
    }
},{
    'name':1,
    'founded_year':1
}).pretty()


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


##

db.companies.find({
    'ipo.valuation_amount':{
        '$gte': 1000,
        '$lte': 1000000000
    }

},{
    'name' :1,
    'ipo':1

}).pretty()



##
db.companies.find({
    'number_of_employees':{
        '$gte': 1,
        '$lte': 6
      }
    },{
        'name':1,
        'number_of_employees':1
    
}).pretty().limit(8)


//
db.companies.find({
    'ipo.valuation_currency_code':'USD',
    

}).pretty().limit(5)


##  3b perfume_collection

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



db.perfume.insertMany([
    {
        'name':'autumn',
        'country':'russia',
        'cost': '$95',
        'type':'active sport minty'
    },
    {
        'name':'summer',
        'country':'france',
        'cost': '$80',
        'type':'active energizer'
    },
    {
        'name':'spring',
        'country':'america',
        'cost': '$86',
        'type':'freshness energy'
    },      
    {
        'name':'winter',
        'country':'japan',
        'cost': '$76',
        'type':'icy cold breeze'
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



{ "_id" : ObjectId("62a4984b1e43fabae663e858"), "name" : "autumn", "country" : "russia", "cost" : "$95", "type" : "active sport minty" }
{ "_id" : ObjectId("62a4984b1e43fabae663e859"), "name" : "summer", "country" : "france", "cost" : "$80", "type" : "active energizer" }
{ "_id" : ObjectId("62a4984b1e43fabae663e85a"), "name" : "spring", "country" : "america", "cost" : "$86", "type" : "freshness energy" }
{ "_id" : ObjectId("62a4984b1e43fabae663e85b"), "name" : "winter", "country" : "japan", "cost" : "$76", "type" : "icy cold breeze" }



db.perfume.updateOne({
    "_id" : ObjectId("62a4984b1e43fabae663e858")
    },{
       '$push': {
       "capacity": '200ml'
    }

})


// $push add array 
// $set add string 


db.perfume.updateOne({
    "_id" : ObjectId("62a4984b1e43fabae663e858")
    },{
       '$push': {
       "capacity": '200ml'
    }

})

db.perfume.updateOne({
    "_id" : ObjectId("62a4984b1e43fabae663e858")
    },{
       '$pull': {
       "capacity": '200ml'
    }

})


db.perfume.updateOne({
    "_id" : ObjectId("62a4984b1e43fabae663e858")
    },{
       '$set': {
       "capacity": '200ml'
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



db.perfume.updateOne({
        '_id':ObjectId("623cbd2db6366ca99675dde3")
}, {
    '$set': {
        'capacity':'150ml'
    }
})


db.perfume.updateOne({
       "_id" : ObjectId("62a4984b1e43fabae663e85b")
}, {
    '$set': {
        'capacity':'150ml'
    }
})

"_id" : ObjectId("62a4984b1e43fabae663e859")
"_id" : ObjectId("62a4984b1e43fabae663e85a")


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

## perfume add new collections example