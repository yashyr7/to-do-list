const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
var _ = require('lodash');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect('mongodb+srv://<username>:<password>@cluster0.xvasd.mongodb.net/todolistDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const itemSchema = {
  name: String
};

const Item = mongoose.model("item", itemSchema);

const eat = new Item({
  name: "Eat"
})

const sleep = new Item({
  name: "Sleep"
})

const repeat = new Item({
  name: "Repeat"
})

const defaultItems = [eat, sleep, repeat];


app.get("/", (req, res) => {
  Item.find({}, (err, result) => {
    if(err) {
      console.log("ERROR IS HERE: " + err);
    } else {
      if(result.length === 0) {
        Item.insertMany(defaultItems, (err) => {
          if(err) {
            console.log(err)
          }
        })
        res.redirect("/");
      }
      res.render("list", {listTitle: date.getDay(), newListItems: result});
    }
  })
})

const listSchema = {
  name: String,
  items: [itemSchema]
}
const List = mongoose.model("List", listSchema);

app.get("/:name", (req, res) => {
  let listName = _.capitalize(req.params.name)
  List.findOne({name: listName}, (err, q) => {
    if(err) {
      console.log(err);
    } else {
      if(q) {
        res.render("list", {listTitle: q.name, newListItems: q.items});
      } else {
        const list = new List({
          name: listName,
          items: defaultItems
        })
        list.save(() => {
          res.redirect("/" + listName);
        });
        
      }
    }
  })
})

app.post("/", (req, res) => {
  let itemName = req.body.newItem;
  let listName = req.body.list;
  const newItem = new Item({
    name: itemName
  });

  if(listName === date.getDay()) {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, (err, q) => {
      if(err) {
        console.log(err);
      } else {
        q.items.push(newItem);
        q.save();
        res.redirect("/" + listName)
      }
    })
  }
})

app.post("/delete", (req, res) => {
  let itemID = req.body.checkbox;
  let listName = req.body.listName;
  if(listName === date.getDay()) {
    Item.deleteOne({_id: itemID}, (err) => {
      if(err) {
        console.log(err);
      }
    })
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: itemID}}}, (err) => {
      if(err) {
        console.log(err);
      } else {
        res.redirect("/" + listName);
      }
    })
  }
  
})

app.get("/about", (req, res) => {
  res.render("about");
})

let port = process.env.PORT;

if(port == NULL || port == "") {
  port = 3000
}

app.listen(port);