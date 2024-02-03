import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
app.set('view engine', 'ejs');

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "mydotolist",
  password: "usufjas2",
  port: 54321,
});
db.connect()

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let personalitems = [{ id: 1, title: "Buy milk" },
{ id: 2, title: "Finish homework" }];

let professionalitems = [{ id: 1, title: "Buy milk" },
{ id: 2, title: "Finish homework" }];


app.get("/",function(req,res){
  res.render("landingpage");
})

app.get("/get", async(req, res) =>{
  try{
    const result1 = await db.query("SELECT * FROM personal ORDER BY id ASC");
    const result2 = await db.query("SELECT * FROM professional ORDER BY id ASC");
    personalitems = result1.rows;
    professionalitems = result2.rows;
    if(req.query.mainbtn ==="personal") {
    res.render("personal", {newListItems: personalitems});
    }else{
      res.render("professional", {newListItems:professionalitems});
    }
  }catch(err){
    console.log(err);
  }
  });

 app.post("/addpersonal", async (req,res)=>{
    const item = req.body.newitem;
    try {
      await db.query("INSERT INTO personal (title) VALUES ($1)", [item]);
      res.redirect("/get?mainbtn=personal");
    } catch (err) {
      console.log(err);
    }
 } );

 app.post("/addprofessional", async (req,res)=>{
  const item = req.body.newitem;
  try {
    await db.query("INSERT INTO professional (title) VALUES ($1)", [item]);
    res.redirect("/get");
  } catch (err) {
    console.log(err);
  }
} );

    app.post("/deletepersonal",async(req,res)=>{
      const id = req.body.deletebtn;
      try{
      await db.query("DELETE FROM personal WHERE id =$1",[id]);
      res.redirect("/get?mainbtn=personal");
      }catch(err){
        console.log(err);
      }
    })

    app.post("/deleteprofessional",async(req,res)=>{
      const id = req.body.deletebtn;
      try{
      await db.query("DELETE FROM professional WHERE id =$1",[id]);
      res.redirect("/get");
      }catch(err){
        console.log(err);
      }
    })

    app.post("/editpersonal",async(req,res)=>{
      const item = req.body.updatedItemTitle;
      const id = req.body.updatedItemId;
      try {
      await db.query("UPDATE personal SET title = ($1) WHERE id = $2", [item, id]);
      res.redirect("/get?mainbtn=personal");
      } catch (err) {
       console.log(err);
      }
        });



    app.post("/editprofessional",async(req,res)=>{
      const item = req.body.updatedItemTitle;
      const id = req.body.updatedItemId;
    try {
    await db.query("UPDATE professional SET title = ($1) WHERE id = $2", [item, id]);
    res.redirect("/get");
    } catch (err) {
    console.log(err);
    }
    })

    app.listen(4000, function() {
    console.log("Server started on port 4000");
    });
      