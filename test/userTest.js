const { app } = require("../index.js");
const mongoose = require("mongoose");
const chai = require("chai");
const chaiHttp = require("chai-http");
const Jobs = require("../models/jobs");
const Users = require("../models/users");
const should = chai.should();

// const user = request.body.user

chai.use(chaiHttp);

describe("Users", () => {
  before(async () => {
    await Users.deleteMany({});
  });

  after(async () => {
    await Users.deleteMany({});
  });



  it("should add a user", (done) => {
    chai
      .request(app)
      .post("users/register")
      .set("Token", "json")
      .set("content-type", "application/x-www-form-urlencoded")
      .send({
        name: "name",
        email: "name@name.com",
        password: "password",
      })
      .end((err, res) => {
        console.log(res);
        console.log(err);
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

});
