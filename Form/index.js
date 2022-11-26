require("dotenv").config();

/* file system */
const fs = require("fs");

/* importing express */
const express = require("express");

/* importing mongoose */
const mongoose = require("mongoose");

/* importing schema */
const records = require("./data.json");

/* initializing express */
const app = express();
const path = require("path");

const bodyParser = require("body-parser");

const studentModel = require("./schema");
const { log } = require("console");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection established");
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
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
  if (avg >= 90 && avg <= 100) {
    grade = "A";
  } else if (avg >= 80 && avg < 90) {
    grade = "B";
  } else if (avg >= 70 && avg < 80) {
    grade = "C";
  } else if (avg >= 60 && avg < 70) {
    grade = "D";
  } else if (avg >= 33 && avg < 60) {
    grade = "E";
  } else if (avg < 33) {
    grade = "F";
  }

  let obj = {
    StudentId: parseInt(`${student_Id}`),
    StudentName: `${s_name}`,
    Address: `${address}`,
    Total_Marks_Obtained: parseInt(`${total}`),
    Average: parseInt(`${avg}`),
  };

  studentModel.create({
    studentid: req.body.s_id,
    name: req.body.fname,
    address: req.body.tarea,
    avgr: Number(avg),
    totalmarks: Number(total),
    gradeof: String(grade),
  });

  var data = fs.readFileSync("data.json");
  myObj = JSON.parse(data);
  myObj.push(obj);

  var updatedData = JSON.stringify(myObj);

  fs.writeFile("data.json", updatedData, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("New Data added");
    }
  });

  fs.readFile("data.json", (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(fs.readFileSync("data.json").toString());
    }
  });

  return res.json({ message: "Data saved successfully" });
});

/* API for fetching all student details  (get request)*/
app.get("/get/all", (req, res) => {
  return res.json({ "Student Data": records });
});

/* API for  updating student name on the basis of s_id (put request)*/

app.put("/update/:id", async (req, res) => {
  const updateRecord = await studentModel.findOneAndUpdate(
    {
      studentid: Number(req.params.id),
    },
    {
      name: req.body.sfname,
    },
    {
      new: true,
    }
  );

  return res.json({ message: "Student Name Updated" });
});

/* API for deleting the student from record on the basis of s_id (delete request)*/

app.delete("/delete/:id", async (req, res) => {
  const updatedRecord = await studentModel.findOneAndDelete({
    studentid: parseInt(req.params.id),
  });
  return res.json({ updatedRecord, message: "Current Record Deleted" });
});

app.listen(5000, () => {
  console.log("Server is running");
});
