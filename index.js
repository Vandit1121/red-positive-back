const express = require('express');
const cors = require('cors');
require("./db/config");
const ejs = require('ejs');
const bodyParser = require("body-parser");
const userDetail = require("./models/userDetailModel");
const nodemailer = require("nodemailer");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(cors());

app.post("/sendDetails", async (req, res) => {
    if(req.body._id==='null'){
        // console.log(req.body);  
        const details = await new userDetail({name:req.body.name,phoneNumber:req.body.phoneNumber,email:req.body.email,hobbies:req.body.hobbies});
        await details.save().then(() => {
            console.log("Success");
            // res.redirect(req.get('referer'));
            // location.reload();   
        });
    }
    else{
        await userDetail.findByIdAndUpdate(req.body._id,{name:req.body.name,phoneNumber:req.body.phoneNumber,email:req.body.email,hobbies:req.body.hobbies});
    }
});

app.get("/", async (req, res) => {
    const users = await userDetail.find();
    res.json(users);
});


app.post("/sendEmail", async (req, res) => {
    const data = req.body;
    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: true, // true for 465, false for other ports
        auth: {
            user: 'shahvandit005@gmail.com',
            pass: process.env.emailPass, // generated ethereal password
        },
        headers: {
            "x-priority": "1",
            "x-msmail-priority": "High",
            importance: "high"
        }
    });

    let htmlData = `
    <h3>Here is the details selected</h3> 
  <table>
    <tr>
      <th>Id</th>
      <th>Name</th>
      <th>Phone Number</th>
      <th>Email</th>
      <th>Hobbies</th>
    </tr>
    <tbody>
    `
    data.forEach(function (item) {
        htmlData += `  
        <tr>
        <td>${item._id}</td>
        <td>${item.name}</td>
        <td>${item.phoneNumber}</td>
        <td>${item.email}</td>
        <td>${item.hobbies}</td>
      </tr>
      `
    })

    htmlData += `
    </tbody>
  </table>
`
    console.log(htmlData);

    var mailOptions = {
        from: 'Vandit Shah <shahvandit005@gmail.com>',
        to: 'info@redpositive.in',
        subject: 'Details of Users',
        // html: ejs.renderFile(__dirname + '/index.ejs', { data: data })
        html: htmlData
        //     ejs: ' '
    };
    // 'info@redpositive.in'
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("Email Sent");
            // res.redirect("/refresh");
        }
    })
});

app.get('/refresh', function(req, res) {
    res.redirect(req.get('referer'));
  });
  
  
app.post("/deleteData",async (req, res) => {
    const id = req.body._id;
    const response = await userDetail.findByIdAndDelete(id); 
    // console.log(response);
})

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running");
});