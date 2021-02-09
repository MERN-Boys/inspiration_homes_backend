const { app } = require('../index.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const Jobs = require('../models/jobs')
const Users = require('../models/users')
const should = chai.should()

// const user = request.body.user 



chai.use(chaiHttp)

describe('Jobs', () => {

    before(async () => {
        await Jobs.deleteMany({})
    })

    after(async () => {
        await Jobs.deleteMany({})
    })



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


    it("should add a user", (done) => {
      chai
        .request(app)
        .post("users/register")
        .set('Token', 'json')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
          'name': 'name',
          'email': 'name@name.com',
          'password': 'password'
        })
        .end((err, res) => {
          console.log(res);
          console.log(err)
          res.should.have.status(201);
          //   res.body.should.be.a("object");
          //   res.body.should.have.property("name");
          //   res.body.should.have.property("description");
          //   res.body.should.have.property("_id");
          //   res.body.name.should.equal("test");
          //   res.body.description.should.equal("test");
          done();
        });
    });



    // it("should add a job", (done) => {
    //   chai
    //     .request(app)
    //     .post("jobs/")
    //     .send({
    //       "client": "60112a6e5d720c04ca3ca07e",
    //       "jobTitle": "New Job",
    //       "buildAddress": "6 Langdon Lane Bellmere 4510",
    //     })
    //     .end((err, res) => {
    //         console.log(res)
    //       res.should.have.status(201);
    //     //   res.body.should.be.a("object");
    //     //   res.body.should.have.property("name");
    //     //   res.body.should.have.property("description");
    //     //   res.body.should.have.property("_id");
    //     //   res.body.name.should.equal("test");
    //     //   res.body.description.should.equal("test");
    //       done();
    //     });
    // });

})