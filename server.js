const express = require('express')
const bodyParser = require('body-parser')
const res = require('express/lib/response')
const MongoClient = require('mongodb').MongoClient
const app = express()
const connectionString = 'mongodb+srv://dbBruce:oo2h74Elq9KInYlx@cluster0.b9mtg.mongodb.net/?retryWrites=true&w=majority'
app.set('view engine', 'ejs')


app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(bodyParser.json())



let quotesCollection
let db 

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    db = client.db('star-wars-quotes')
    quotesCollection = db.collection('quotes')
  })
  .catch(error => console.error(error))



app.listen(3000, function() {
    console.log('listening on 3000')
})




app.get('/', (req, res) => {
    // res.send('Hello World!')
    const cursor = db.collection('quotes').find().toArray() 
    .then(results => {
        // console.log(results)
        // console.log(cursor)
        // res.sendFile(__dirname + '/index.html')
        // res.render(view, locals)
        res.render('index.ejs', {quotes: results })


    })
    
    .catch(error => console.error(error))

} )

app.put('/quotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
        { name: 'Yoda' },
        {
          $set: {
            name: req.body.name,
            quote: req.body.quote
          }
        },
        {
          upsert: true
        }
      )
        .then(result => {
            console.log(result)
            res.json('Success')

    })
        .catch(error => console.error(error))
      
  })

  app.delete('/quotes', (req, res) => {
    quotesCollection.deleteOne(
      { name: req.body.name }
    )
    .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vadar's quote`)
      })
      .catch(error => console.error(error))
  })
  
  
  
  

app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/')
        // console.log(result)
      })
      .catch(error => console.error(error))
  })
  

console.log('May Node be with you')