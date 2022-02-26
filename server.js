const express =require("express")
const fs = require('fs');
const multer = require('multer');
const app=express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(__dirname+"/files"))

//HomeScreen
app.get("/",(req,res)=>{
    res.send("Welcome to Home Screen")
})

//get allfiles 
app.get("/allfiles",(req,res)=>{
    let data=[];
    fs.readdir(__dirname+"/files", (err, files) => {
        files.forEach(file => {
            data.push(file.split("-")[1].split(".")[0])
        });
        console.log(data)
        res.send(data);
    }); 
})

//get data by id
app.get("/files/:id",(req,res)=>{
    fs.readdir(__dirname+"/files", (err, files) => {
        files.forEach(file => {
            if(file.split("-")[0]==req.params.id){
                res.sendFile(__dirname+"/files/"+file);
            }
        });
        
    }); 
})



//download
app.get("/download/:id",(req,res)=>{
    fs.readdir(__dirname+"/files", (err, files) => {
        files.forEach(file => {
            if(file.split("-")[0]==req.params.id){
                var path=__dirname+ "/files/";
                var newName=file.split("-")[1];
                res.download(__dirname+"/files/"+file,newName);


            }
        });
        
    });
    
})



//upload
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'files')
    },
    filename: function (req, file, cb) {
        var data=[]
        fs.readdir(__dirname+"/files", (err, files) => {
            files.forEach(myfile => {
                data.push(myfile)
            }); 
        cb(null,data.length+"-"+ file.originalname.split(".")[0]+ '.txt' )
        });
      
    }
  })
   
var upload = multer({ storage: storage })

app.post("/upload",upload.single('file'),(req,res)=>{
    res.send("Successfully uploading");
})








//listen
app.listen(process.env.PORT || 3000,()=>{
 console.log("Server is Working...")
})

