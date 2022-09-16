const express=require('express')
var mysql = require('mysql');
const path = require('path')
const app=express()
const port = 8080

var pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : '',
    database        : '2123szft_elso'
  });

app.use(express.urlencoded({extended:true}));

app.get('/users', (req,res)=>{
    pool.query('SELECT * FROM users', (err,results)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(results)
        }
    });
})

app.get('/newuser',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname+'/newuser.html'));
})

app.get('/moduser',(req,res)=>{
    res.status(200).sendFile(path.join(__dirname+'/moduser.html'));
})

app.post('/newuser',(req,res)=>{
    var data ={
        "name": req.body.name,
        "email": req.body.email,
        "passwd1": req.body.passwd1,
        "passwd2": req.body.passwd2
    }
    if(data.passwd1!=data.passwd2){
        res.status(200).send('A megadott jelszavak nem egyeznek!')
    } else{
        pool.query(`INSERT INTO users VALUES(null, '${data.name}', '${data.email}', SHA1('${data.passwd1}'))`,(err,results)=>{
            if(err){
                res.status(500).send(err)
            }else{
                res.status(200).send(results)
            }
        })
        
    }
})

app.post('/moduser',(req,res)=>{
    var data ={
        "uID":req.body.uID,
        "name": req.body.name,
        "email": req.body.email,
        "passwd1": req.body.passwd1,
        "passwd2": req.body.passwd2
    }
    if(data.passwd1!=data.passwd2){
        res.status(200).send('A megadott jelszavak nem egyeznek!')
    } else{
        pool.query(`UPDATE users SET name='${data.name}', email='${data.email}', passwd=SHA1('${data.passwd1}') WHERE ID=${data.uID}`,(err,results)=>{
            if(err){
                res.status(500).send(err)
            }else{
                res.status(200).send(results)
            }
        })
        
    }
})

app.get('/deleteuser/:ID',(req,res)=>{
    var userID=req.params.ID
    pool.query(`DELETE FROM users WHERE ID=${userID}`,(err,results)=>{
        if(err){
            res.status(500).send(err)
        }else{
            res.status(200).send(results)
        }
    })
})

app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}...`)
})