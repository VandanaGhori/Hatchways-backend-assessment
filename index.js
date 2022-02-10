var express = require("express");
var app = express();

var posts = require("./controller/posts");
const utils = require("./utils");

const port = 3000;

app.get('/api/ping', function (req, res) {
    res.status(200).json(utils.sendSuccessResponse("true"));
});

app.get('/api/posts', async function (req, res) {
    var result = posts.validateQueryParameter(req, res);

    var tags = req.query.tags != null || req.query.tags != undefined ? (req.query.tags).trim() : "";
    var sortBy = req.query.sortBy != null || req.query.sortBy != undefined ? sortBy = (req.query.sortBy).trim().toLowerCase() : sortBy = "id";
    var direction = req.query.direction != null || req.query.direction != undefined ? (req.query.direction).trim().toLowerCase() : direction = "asc";

    var json_data = await posts.fetchAPIData();

    var sorted_array = [];
    if (result != false && (json_data != null || json_data != undefined)) {
        if (tags.trim().length == 0) {
            res.status(400).json(utils.sendErrorResponse("Please pass valid value of tags parameter"))
            return
        }

        var tags = tags.split(",");
        //console.log("Split = " + tags.length);

        for (let i = 0; i < tags.length; i++) {
            var tag = tags[i];
            for (let j = 0; j < json_data.posts.length; j++) {
                result = (json_data.posts[j].tags).find(s => tag.indexOf(s) > -1)
                if (result != undefined && !sorted_array.includes(json_data.posts[j])) {
                    sorted_array.push(json_data.posts[j]);
                }
            }
        }

        if (sorted_array.length == 0) {
            res.status(200).json(utils.sendSuccessResponse("No matches found for the given value for tags parameter"))
            return
        }

        if (direction != null && direction != undefined && direction == "desc") {
            sorted_array.sort((a, b) => {
                if (sortBy == "reads") {
                    return b.reads - a.reads;
                } else if (sortBy == "likes") {
                    return b.likes - a.likes;
                } else if (sortBy == "popularity") {
                    return b.popularity - a.popularity;
                } else {
                    return b.id - a.id;
                }
            });
        } else {
            sorted_array.sort((a, b) => {
                if (sortBy == "reads") {
                    return a.reads - b.reads;
                } else if (sortBy == "likes") {
                    return a.likes - b.likes;
                } else if (sortBy == "popularity") {
                    return a.popularity - b.popularity;
                } else {
                    return a.id - b.id;
                }
            });
        }

        json_data.posts = [];
        json_data.posts = sorted_array;

        //console.log("Filtered Array = " + JSON.stringify(json_data));
        res.json(json_data);
    }
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});