const utils = require("../utils");
const axios = require('axios');
const nodeCache = require("node-cache");

const myCache = new nodeCache({ stdTTL: 10 });

module.exports = {
    fetchAPIData: async function () {
        var options = {
            'method': 'GET',
            'url': 'https://api.hatchways.io/assessment/blog/posts?tag=tech'
        };

        if (myCache.has("todos")) {
            console.log("Getting it from cache");
            return myCache.get("todos");
        } else {
            var axios_res = await axios(options);
            var api_res = axios_res.data;

            myCache.set("todos", api_res);
            console.log("Getting it from API");
            return api_res;
        }
    },
    validateQueryParameter: function (req, res) {
        if (req == null) {
            return;
        }

        if (req.query.tags == null) {
            res.status(400).json(utils.sendErrorResponse("Tags parameter is required"));
            return false;
        }

        if (req.query.sortBy != null) {
            var sortBy = (req.query.sortBy).toUpperCase();
            if (sortBy != "ID" && sortBy != "READS" && sortBy != "LIKES" && sortBy != "POPULARITY") {
                res.status(400).json(utils.sendErrorResponse("sortBy parameter is invalid"));
                return false;
            }
        }

        if (req.query.direction != null) {
            var direction = (req.query.direction).toUpperCase();
            if (direction != "ASC" && direction != "DESC") {
                res.status(400).json(utils.sendErrorResponse("direction parameter is invalid"));
                return false;
            }
        }

        return true;
    }
}