const { app } = require('../index.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const Jobs = require('../models/jobs')
const Users = require('../models/users')
const should = chai.should()

// const user = request.body.user 

  before(async () => {
    await Users.deleteMany({});
  });

  after(async () => {
    await Users.deleteMany({});
  });

    before(async () => {
      await Jobs.deleteMany({});
    });

    after(async () => {
      await Jobs.deleteMany({});
    });

chai.use(chaiHttp)

describe('Jobs', () => {

    


    it('Should list all jobs', (done) => {
        chai
          .request(app)
          .post("/jobs/get")
          .send({ "user": { "role": "Builder" } })
          .end((err, res) => {
            res.should.have.property("status", 200);
            res.body.should.be.a("array");
            done();
          });

            
    })


    let id = "";

    it("should add a user", (done) => {
      chai
        .request(app)
        .post("/users/register")
        .set('Token', 'json')
        .set('content-type', 'application/json')
        .send({
          'name': 'name',
          'email': 'nanme@name.com',
          'password': 'password'
        })
        .end((err, res) => {
          res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("user");
            res.body.user.should.have.property("name")
            res.body.user.should.have.property("email");
            res.body.user.should.have.property("_id");

          //   res.body.name.should.equal("test");
          //   res.body.description.should.equal("test");
          id = res.body.user._id
          done();
        });
    });

    it("edit a user", (done) => {
      chai
        .request(app)
        .put(`/users/${id}`)
        .set("Token", "json")
        .set("content-type", "application/json")
        .send({
          name: "name2",
          email: "nanme@name.com",
          password: "password",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("user");
          res.body.user.should.have.property("name");
          res.body.user.should.have.property("email");
          res.body.user.should.have.property("_id");
          res.body.user.name.should.equal("name2")

          //   res.body.name.should.equal("test");
          //   res.body.description.should.equal("test");
          id = res.body.user._id;
          done();
        });
    });


    
    let jobid = ""

    it("should add a job", (done) => {
      chai
        .request(app)
        .post("/jobs/")
        .set("Token", "json")
        .set("content-type", "application/json")
        .send({
          "client": id,
          "description": "New Job",
          "buildAddress": "6 Langdon Lane Bellmere 4510",
          "designDocs": [],
        })
        .end((err, res) => {
          console.log(res);
          console.log(err);
          res.should.have.status(200);
          jobid = res.body.user.jobs[0]
          done();
        });
    });

    it("should edit a job", (done) => {
      chai
        .request(app)
        .patch(`/jobs/${jobid}`)
        .set("Token", "json")
        .set("content-type", "application/json")
        .send({
          client: id,
          description: "Edited Job",
          buildAddress: "6 Langdon Lane Bellmere 4510",
          designDocs: [],
        })
        .end((err, res) => {
          console.log(res);
          console.log(err);
          res.should.have.status(200);
          res.body.description.should.equal("Edited Job")
          done();
        });
    });

})