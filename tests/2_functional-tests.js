/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  //test('#example Test GET /api/books', function(done){
  //   chai.request(server)
  //    .get('/api/books')
  //    .end(function(err, res){
  //      assert.equal(res.status, 200);
  //      assert.isArray(res.body, 'response should be an array');
  //      assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //      assert.property(res.body[0], 'title', 'Books in array should contain title');
  //      assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //      done();
  //    });
  //});
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'Huckleberry Finn'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(typeof(res.body), 'object');
            assert.property(res.body, 'title', 'return object should contain title');
            assert.property(res.body, '_id', 'return object should contain _id')
            assert.equal(res.body.title, 'Huckleberry Finn')
            done();
          })

        //done();
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title:''})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          })

        //done();
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'res.body should be an array');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          })
        //done();
      });      
      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/60272db975aa40127402377b')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            done();
          })
        
        
        //done();
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get('/api/books/602759839f0bf81d0bfc523d')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(typeof(res.body), 'object');
            assert.property(res.body, '_id', 'return object should contain _id');
            assert.property(res.body, 'title', 'return object should contain title');
            assert.property(res.body, 'comments', 'return object should contain comments');
            assert.equal(res.body._id, '602759839f0bf81d0bfc523d');
            done();
          })
        //done();
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/6027598d9f0bf81d0bfc5240')
          .send({
            comment: 'Amazing'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(typeof(res.body), 'object');
            assert.property(res.body, '_id', 'return object should contain _id');
            assert.property(res.body, 'title', 'return object should contain title');
            assert.property(res.body, 'comments', 'return object should contain comments');
            assert.equal(res.body._id, '6027598d9f0bf81d0bfc5240');
            assert.equal(res.body.comments[res.body.comments.length-1], 'Amazing');
            done();
          })
        //done();
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post('/api/books/6027598d9f0bf81d0bfc5240')
          .send({
            comment: ''
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          })
        //done();
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/60275dcf5b8d1d1eb8c7ece9')
          .send({
            comment:'Great'
          })
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete('/api/books/60275e77820bf91eecb43a75')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          })

        //done();
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/60275883bc300e1c66b2ca0c')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists')
            done();
          })
      });

    });

  });

});