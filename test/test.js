var supertest = require("supertest");
var should = require("should");
var assert = require('chai').assert;

var server = supertest.agent("http://localhost:3000");

// Begin Unit Test  -- Description of Unit Test
describe("unit test api's endpoints", function () {
    // Begin Test Case -- contains end function which indicates end of test case
    it("/api/ping", function (done) {
        server
            .get("/api/ping")
            .expect('content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                res.body.success.should.equal("true");
                done();
            });
    });

    it("/api/posts", function (done) {
        server
            .get("/api/posts")
            .expect('content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.should.equal("Tags parameter is required")
                done();
            });
    });

    it("/api/posts?tags=''", function (done) {
        server
            .get("/api/posts?tags=" + "")
            .expect('content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.should.equal("Please pass valid value of tags parameter")
                done();
            });
    });

    it("/api/posts?tags=health", function (done) {
        server
            .get("/api/posts?tags='health'")
            .expect('content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                assert.isObject(res.body);
                assert.isArray(res.body.posts);
                assert.isArray(res.body.posts[0].tags)
                assert.containsAllKeys(res.body.posts[0], ["author", "authorId", "id", "likes", "popularity", "reads", "tags"]);
                assert.isNotEmpty(res.body.posts[0].tags)
                done();
            });
    });

    it("/api/posts?tags='health'&sortBy= is not valid key", function (done) {
        var sortByValues = ['id', 'likes', 'popularity', 'reads'];
        var parameterValue = 'likess';
        server
            .get("/api/posts?tags='health'&sortBy=" + parameterValue)
            .expect('content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.should.equal("sortBy parameter is invalid")
                assert.doesNotHaveAnyKeys(sortByValues, parameterValue);
                done();
            });
    });

    it("/api/posts?tags='health'&sortBy= is valid key", function (done) {
        var sortByValues = ['id', 'likes', 'popularity', 'reads'];
        var parameterValue = 'likes';
        server
            .get("/api/posts?tags='health'&sortBy=" + parameterValue)
            .expect('content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                !assert.doesNotHaveAnyKeys(sortByValues, parameterValue);
                assert.isObject(res.body);
                assert.isArray(res.body.posts);
                assert.isArray(res.body.posts[0].tags)
                assert.containsAllKeys(res.body.posts[0], ["author", "authorId", "id", "likes", "popularity", "reads", "tags"]);
                assert.isNotEmpty(res.body.posts[0].tags)
                done();
            });
    });

    it("/api/posts?tags='health'&sortBy=likes&direction= is not valid key", function (done) {
        var directionValues = ['asc', 'desc'];
        var parameterValue = 'ascc';
        server
            .get("/api/posts?tags='health'&sortBy=likes&direction=" + parameterValue)
            .expect('content-Type', /json/)
            .expect(400)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.error.should.equal("direction parameter is invalid")
                assert.doesNotHaveAnyKeys(directionValues, parameterValue);
                done();
            });
    });

    it("/api/posts?tags='health'&sortBy=likes&direction= is valid key", function (done) {
        var directionValues = ['asc', 'desc'];
        var parameterValue = 'desc';
        server
            .get("/api/posts?tags='health'&sortBy=likes&direction=" + parameterValue)
            .expect('content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                !assert.doesNotHaveAnyKeys(directionValues, parameterValue);
                assert.isObject(res.body);
                assert.isArray(res.body.posts);
                assert.isArray(res.body.posts[0].tags)
                assert.containsAllKeys(res.body.posts[0], ["author", "authorId", "id", "likes", "popularity", "reads", "tags"]);
                assert.isNotEmpty(res.body.posts[0].tags)
                done();
            });
    });
});

