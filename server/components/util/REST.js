var querystring = require('querystring');
var https = require('https');

module.exports = {
    get: function (host, endpoint, token, data, success) {
        this.call(host, endpoint, token, 'GET', data, success);
    },
    post: function (host, endpoint, token, data, success) {
        this.call(host, endpoint, token, 'POST', data, success);
    },
    call: function (host, endpoint, token, method, data, success) {
        var dataString = JSON.stringify(data);
        var headers = {};

        if (method == 'GET') {
            endpoint += '?' + querystring.stringify(data);
        }
        else {
            headers = {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length
            };
        }

        headers['Authorization'] = 'Bearer ' + token;

        var options = {
            host: host,
            path: endpoint,
            method: method,
            headers: headers
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf-8');

            var responseString = '';

            res.on('data', function (data) {
                responseString += data;
            });

            res.on('end', function () {
                var responseObject = JSON.parse(responseString);
                success(responseObject);
            });
        });

        req.write(dataString);
        req.end();
    }
}