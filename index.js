const mongoose=require("mongoose");
const express=require("express");
const multer=require("multer");
const nodemailer=require("nodemailer");
const ejsLayouts = require("express-ejs-layouts");
//const img=require("../assign/controllers/img");
const storage=multer.diskStorage({
destination: function(req,file,cb){
    return cb(null,"./uploads");
},
filename:function (req,file,cb){
    return cb(null,`${Date.now()}-${file.originalname}`);
},
});
const upload=multer({storage});
const {connectMongo}=require("./connect");
const cookieParser=require("cookie-parser");
const userRoute=require("./routes/user");
const app=express();
const port=8002;
const path=require("path")
app.set("view engine","ejs");
app.set('views',path.resolve("./views"));
const {restrictToLoggedinUserOnly,checkAuth}=require("./middleware/auth");
connectMongo("mongodb://localhost:27017/assign")
.then(()=>console.log("connected to mongo"));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());//middleware
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use("/user",userRoute);
//app.get("/",img);
app.get("/home",restrictToLoggedinUserOnly,async(req,res)=>{
   return res.render("home");
});
app.get("/login",async(req,res)=>{
return res.render("login");
});
app.get("/",async(req,res)=>{
    return res.render("signup");
    });
    
//app.use("/user",restrictToLoggedinUserOnly,userRoute);
app.post("/upload",upload.single("profileImage"),(req,res)=>{
console.log(req.body);
console.log(req.file);
return res.redirect("/home");
});
app.post("/submit_contact_form",(req,res)=>{
const {name,email,message}=req.body;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nita.debajyotiece@gmail.com',
        pass: 'svpb ijqu jpbx otur'
    }
});

// Setup email data
const mailOptions = {
    from: 'nita.debajyotiece@gmail.com',
    to: 'recipient_email@example.com',
    subject: 'New Contact Form Submission',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
        res.status(500).send('Error: Unable to send email');
    } else {
        console.log('Email sent: ' + info.response);
        res.redirect('/?status=success');
    }
});
});
app.listen(port,()=>{
    try{
        console.log("server started: http://localhost:8002");
        }
        catch(error){
            console.log("err");
        }
    });