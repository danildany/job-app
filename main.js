const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();
app.use(express.urlencoded({ extended: false }));
const db = require('./config/database')
db.authenticate()
.then(()=>{console.log('Database conected ...')})
.catch((err)=>{
    console.log('error:' + err)
})
//handlebars
app.engine('handlebars', exphbs({defaultLayout:'base'}));
app.set('view engine', 'handlebars');
//set static folder
app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=>{
    res.render('index',{layout:'landing'});
})
app.use('/gigs',require('./routes/gigs'))


const PORT = process.env.PORT || 8080;
app.listen(PORT,console.log('Server started at port ' + PORT));
