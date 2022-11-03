//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewURLParser: true });

const articleSchema = {
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema);

const arr = [{
  title: "What is Lorem Ipsum?",
  content: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
}, {
  title: "Why do we use it?",
  content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like)."
}, {
  title: "Where can I get some?",
  content: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc."
}];



// Default article list.js
app.get("/", function (req, res) {
  Article.find(function (err, foundItems) {
    if (!err) {
      if (foundItems.length === 0) {
        Article.insertMany(arr, function (error) {
          if (!error) {
            console.log("Saved Successfully");
          }
        });
      }
      res.render("list", { listTitle: "Today", newItemList: foundItems });
    }
  });

});

/* Route created for all articles GET-POST-DELETE*/
app.route('/articles')
  .get(function (req, res) {

    Article.find(function (err, foundItems) {
      if (!err) {
        res.send(foundItems);
      } else {
        res.send(err);
      }
    });

  })
  .post(function (req, res) {
    titles = req.body.title;
    contents = req.body.content;

    let article = new Article({
      title: titles,
      content: contents
    });

    article.save(function (err) {
      if (!err) {
        res.send("Successfully added New Article");
      } else {
        res.send(err);
      }
    });

  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("Deleted all articles");
      } else {
        res.send(err);
      }
    });
  });

/* Route created for all articles GET-POST-DELETE*/

/* ----------------------------------------------------------------------------------------------------------- */

/* Route created for all specific artile GET-PUT-PATCH-DELETE*/

app.route('/articles/:articleTitle')
  .get(function (req, res) {
    let searched_item = req.params.articleTitle;
    console.log(searched_item);
    Article.findOne({ title: searched_item }, function (err, data) {
      if (!err) {
        if (data) {
          res.send(data);
        } else {
          res.send("There is no record");
        }
      }
      else {
        res.send(err);
      }
    });
  })
  .put(function (req, res) {
    current_title = req.params.articleTitle;
    uptaded_title = req.body.title;
    uptaded_content = req.body.content;

    Article.updateOne(
      { title: current_title },
      { title: uptaded_title, content: uptaded_content },
      { overwrite: ture },
      function (err, data) {
        if (data) {
          if (!err) {
            res.send("Updated successfully");
          } else {
            res.send(err);
          }
        } else {
          res.send("There is no record");
        }
      });

  })
  .patch(function (req, res) {
    current_title = req.params.articleTitle;

    Article.updateOne(
      { title: current_title },
      { $set: req.body },
      function (err, data) {
        if (data) {
          if (!err) {
            res.send("Updated successfully");
          } else {
            res.send("Error");
          }
        } else {
          res.send("There is no record");
        }
      });

  })
  .delete(function (req, res) {
    let deletedItem = req.params.articleTitle;

    Article.findOneAndRemove({ title: deletedItem }, function (err, data) {
      if (data) {
        if (!err) {
          res.send("Item Deleted");
        }
        else {
          res.send(err);
        }
      } else {
        res.send("There is no record");
      }
    });
  });

/* Route created for all specific artile GET-PUT-PATCH-DELETE*/



app.listen(3000, function () {
  console.log("Server started on port 3000");
});