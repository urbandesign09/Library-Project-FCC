/*
*
*
*       Complete the API routing below
*       
*       
*/
'use strict';
const mongoose = require ('mongoose');
const {ObjectID} = require ('mongodb');

module.exports = function (app, model) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      model.find().exec(function(err, data){
        if (err) return (err);
        res.json(data);
      })
    })
    
    .post(function (req, res){
      let title = req.body.title;

      console.log(title);
      //if no title
      if (!title){
        return res.send('missing required field title')
      }
      else{
        //if there is a title
        const newBook = new model({title: title});
        newBook.save(function(err, data){
          if (err) return (err);
          res.json({
            _id: data._id,
            title: data.title,
          })
        })
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      model.remove().exec(function(err, data){
        if (err) return (err);
        res.send('complete delete successful')
      })

    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      model.findById(bookid).exec(function(err, data){
        if (err) return (err);
        if (!data){
          return res.send('no book exists')
        }
        res.json(data);
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      
      if(!bookid){
        return res.send('missing required field id') 
      } 
      else if(!comment){
        return res.send('missing required field comment')
      }
      else{
        model.findById({_id:bookid}, function(err, book){
          if(err) return (err)
          if(!book){
            return res.send('no book exists')
          }
          else {
            book.comments.push(comment);
            book.commentcount+1;
            book.save(function(err, data){
                if (err) return (err);
                if (!data){
                   return res.send('no book exists')
                } 
                res.json({
                  _id: data._id,
                  title: data.title,
                  comments: data.comments
                })
            })          
          }
        })
          
      }
      //adds comments to a book
      //pushes comments to the array
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;

      model.remove({_id: bookid}).exec(function(err, data){
        if (err) return (err);
        if(data.deletedCount === 0){
          return res.send('no book exists');
        }
        res.send('delete successful');
      })


      //if successful response will be 'delete successful'
    });
  
};

