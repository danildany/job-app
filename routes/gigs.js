const { raw } = require('express');
const express = require('express');
const Sequelize = require('sequelize');
const router = express.Router();
const db = require('../config/database');
const Gig = require('../models/Gig');
const Op = Sequelize.Op;
//get gig list
router.get('/',(req,res)=>{
    Gig.findAll({raw:true})
    .then(gigs =>res.render('gigs',{gigs}))
    .catch(e=> console.log(e))
});
//display gig form
router.get('/add',(req,res)=>{
    res.render('add')
})


//add a gig
router.post('/add',(req,res)=>{
    
    let { title,technologies,budget,description,contact_email } = req.body;
    let errors = [];
    //validate fields
    if(!title){
        errors.push({text:'Please add a title.'})
    }
    if(!technologies){
        errors.push({text:'Please add the technologies that you need.'})
    }
    if(!description){
        errors.push({text:'Please add a description.'})
    }
    if(!contact_email){
        errors.push({text:'Please add your email.'})
    }
    //check for error
    if(errors.length > 0){
        res.render('add',{
            errors,
            title,
            technologies,
            budget,
            description,
            contact_email
        })
    }else{
        if(!budget){
            budget='Unknown'
        }else{
            budget = '$'+ budget
        }
        technologies = technologies.toLocaleLowerCase().replace(/, /g,',');
        //insert data table
         Gig.create({
            title,technologies,budget,description,contact_email
        })
         .then(gig =>{ 
             res.redirect('/gigs')
        })
        .catch(e=> console.log(e)) 
    }

   
})

router.get('/search',(req,res)=>{
    let { term } = req.query;
    term = term.toLocaleLowerCase();
    Gig.findAll({ raw:true,where:{technologies:{ [Op.like]: '%'+ term +'%' } } })
    .then(gigs=> { 
        res.render('gigs',{gigs})})
    .catch(err=>console.log(err));
})



module.exports = router;