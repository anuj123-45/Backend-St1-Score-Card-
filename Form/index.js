const fs = require("fs");

const express = require("express");
const records=require('./data.json');
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

var myObj;
app.post("/result", (req, res) => {
  var student_Id = req.body.s_id;
  var s_name = req.body.fname;
  var address = req.body.tarea;
  var math = parseInt(req.body.maths);
  var phy = parseInt(req.body.phy);
  var chem = parseInt(req.body.chem);
  var bio = parseInt(req.body.bio);
  var eng = parseInt(req.body.eng);

  var total = parseInt(math + phy + chem + bio + eng);
  var avg = parseInt(total / 5);
  var grade;
  if (avg >= 90 && avg<=100) {
    grade = "A";
  } else if (avg >= 80 && avg<90) {
    grade = "B";
  } else if (avg >= 70 && avg<80) {
    grade = "C";
  } else if (avg >= 60 && avg<70) {
    grade = "D";
  } else if (avg >= 33 && avg < 60) {
    grade = "E";
  } else if (avg < 33) {
    grade = "F";
  }

   let obj={
    StudentId : parseInt(`${student_Id}`),
    StudentName : `${s_name}` ,
    Address : `${address}` ,
    Total_Marks_Obtained : parseInt(`${total}`) ,
    Average : parseInt(`${avg}`) , 
    Grade : `${grade}` 
   }
   
   var data=fs.readFileSync("data.json");
   myObj=JSON.parse(data);
   myObj.push(obj);



   var updatedData=JSON.stringify(myObj);

   fs.writeFile("data.json",updatedData,(err)=>{
    if(err){
      console.log(err);
    }

    else {
      console.log("New Data added");
    }
   })


   fs.readFile("data.json",(err)=>{
    if(err){
      console.log(err);
    }

    else {
      console.log(fs.readFileSync("data.json").toString());
    }
   })

   return res.json({"Student Data":obj});
});

   
app.get("/get/all",(req,res)=>{
  return res.json({"Student Data":records});
} )


app.listen(5000, () => {
  console.log("Server is running");
});
