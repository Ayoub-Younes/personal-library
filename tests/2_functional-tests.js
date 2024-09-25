const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let book;
suite('Functional Tests', function() {
  this.timeout(20000);
 
  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {

      test('Test POST /api/books with title', function(done) {
        chai
        .request(server)
        .keepOpen()
        .post('/api/books')
        .send({
         title: 'Ayoub'
        })
        .end((err,res)=>{
          book= res.body
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.include(res.body, {title:'Ayoub'});
          done()
        })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai
        .request(server)
        .keepOpen()
        .post('/api/books')
        .end((err,res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'text/html');
          assert.equal(res.text, "missing required field title");
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
  
      test('Test GET /api/books',  function(done){
      chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){

      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/666829e3d539470000000000')
        .end(function(err, res){
         assert.equal(res.status, 200);
         assert.equal(res.type, "text/html")
         assert.equal(res.text, "no book exists");
         done();
      });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        let url = `/api/books/${book._id}`;
        chai.request(server)
        .get(url)
        .end(function(err, res){
         assert.equal(res.status, 200);
         assert.equal(res.type, "application/json")
         assert.include(res.body, {_id: book._id});
         done();
      });
      });
      
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        let url = `/api/books/${book._id}`;
        chai
        .request(server)
        .keepOpen()
        .post(url)
        .send({
          comment: 'C1'
        })
        .end((err,res)=>{
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.include(res.body.comments, 'C1');
          done()
        })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        let url = `/api/books/${book._id}`;
        chai.request(server)
        .post(url)
        .end(function(err, res){
         assert.equal(res.status, 200);
         assert.equal(res.type, "text/html")
         assert.equal(res.text, "missing required field comment");
         done();
      });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        let url = '/api/books/666829e3d539470000000000';
        chai.request(server)
        .post(url)
        .send({
          comment: 'C1'
        })
        .end(function(err, res){
         assert.equal(res.status, 200);
         assert.equal(res.type, "text/html")
         assert.equal(res.text, "no book exists");
         done();
      });
      });
      
    });
   
    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        let url = `/api/books/${book._id}`;
        chai.request(server)
        .delete(url)
        .end(function(err, res){
         assert.equal(res.status, 200);
         assert.equal(res.type, "text/html")
         assert.equal(res.text,'delete successful');
         done();
      });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        let url = '/api/books/666829e3d539470000000000';
        chai.request(server)
        .delete(url)
        .end(function(err, res){
         assert.equal(res.status, 200);
         assert.equal(res.type, "text/html")
         assert.equal(res.text,'no book exists');
         done();
      });
      });

    });

  });
  
});

