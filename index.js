import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
];

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "123456789",
  port: 5432,
});
db.connect();
async function getItems(){
  const result=await db.query("select * from items");
  let items=[];
  
  result.rows.forEach((item)=> {
    items.push(item);
  });
  return items;
}

app.get("/", async (req, res) => {
  try{
  items = await getItems();
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
}catch(err){
  console.log(err);
}
});

app.post("/add", async (req, res) => {
  try{
  const item = req.body.newItem;
  console.log(item);
  await db.query("insert into items (title) values ($1)",[item]);
  res.redirect("/");
}catch(err){
  console.log(err);
}
});

app.post("/edit", async (req, res) => {
  try{
  const updatedItem=req.body.updatedItemTitle;
  const id=req.body.updatedItemId;
  await db.query("update items set title=$1 where id=$2",[updatedItem,id]);
  res.redirect("/");
}catch(err){
  console.log(err);
}
});

app.post("/delete", async(req, res) => {
  try{
  const id=req.body.deleteItemId;
  await db.query("delete from items where id=$1",[id]);
  res.redirect("/");
}catch(err){
  console.log(err);
}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
