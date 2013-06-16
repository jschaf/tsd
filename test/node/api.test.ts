///<reference path="../_ref.ts" />

declare var assert:chai.Assert;

var tsd = require("../../deploy/tsd");

var fs = require('fs');
var path = require('path');
var rimraf  = require('rimraf');

var _:UnderscoreStatic = <any>require('../../libs/underscore');

// tsd config
var config = {
    "version": "v2",
    "typingsPath": "typings",
    "libPath": "lib",
    "repo": {
        "uriList": [{
                "sourceType": "1",
                "source": "http://www.tsdpm.com/repository_v2.json"
            }
        ]
    }
};

describe('api', () =>{
    var cwd = <any>process.cwd();

    function clean(done) {
        rimraf("typings", function (err) {
            if (err) throw new Error('Unable to remove test directory');
            setTimeout(done, 100);
        });
    }

    before(function (done) {
        process.chdir(path.join("test/node"));
        clean(done);
    });

    after(function (done) {
        process.chdir(cwd);
        done();
    });

    describe('load-config', () =>{

        it('Should call load config callback', (done) =>{

            tsd.load(config, function (tsd, er) {
                if (er) throw er;

                done();
            });
        });

        it('Callback "tsd" parameter cannot be null' , (done) =>{

            tsd.load(config, function (tsd, er) {
                if (er) throw er;

                assert.isNotNull(tsd);
                done();
            });
        });
    });

    describe('install', () =>{

        it('Should install jquery and backbone typings', (done) =>{

            tsd.load(config, function (tsd, er) {
                if (er) throw er;

                tsd.commands.install(["jquery", "backbone"], function (er, data) {
                if (er) throw er;
                    assert.ok(fs.existsSync(path.join("typings", "DefinitelyTyped", "jquery")));
                    assert.ok(fs.existsSync(path.join("typings", "DefinitelyTyped", "backbone")));
                    done();
                });
            });

        });
    });
});
