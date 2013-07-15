#!/usr/bin/env node

var fs = require("fs");
var program = require("commander");
var cheerio = require("cheerio");
var restler = require("restler");

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";

var assertFileExists = function (infile) {
    var instr = infile.toString();
    if (!fs.existsSync(instr)) {
        console.log("{0} does not exist.  Exiting.", instr);
        process.exit(1);
    }
    return instr;
};

var assertFileExistsOrUrl = function (infileOrUrl) {
    var instr = infileOrUrl.toString();
    if (instr.indexOf("http") == 0) {
        return instr;
    } else {
        return assertFileExists(infileOrUrl);
    }
};

var cheerioHtmlFile = function (htmlText) {
    return cheerio.load(htmlText);
};

var loadChecks = function (checksFile) {
    return JSON.parse(removeBom(fs.readFileSync(checksFile).toString()));
};

var checkHtmlFile = function (htmlFile, checksFile) {
    var $ = cheerioHtmlFile(htmlFile);
    var checks = loadChecks(checksFile).sort();
    var out = {};
    for (var i in checks) {
        var present = $(checks[i]).length > 0;
        out[checks[i]] = present;
    }
    return out;
};

var clone = function (fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var removeBom = function (str) {
    var bomMarker = "\ufeff";
    if (str.indexOf(bomMarker) == 0) {
        return str.substr(bomMarker.length);
    } else {
        return str;
    }
};

var doWork = function (htmlText, checksFilePath) {
    var checkJson = checkHtmlFile(htmlText, checksFilePath);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
};

if (require.main == module) {
    program.option("-c, --checks <check_file>", "path to checks.json", clone(assertFileExists), CHECKSFILE_DEFAULT).option("-f, --file <html_file>", "Path to index.html", clone(assertFileExistsOrUrl), HTMLFILE_DEFAULT).parse(process.argv);

    var htmlPath = program["file"];
    var checksFilePath = program["checks"];

    if (htmlPath.indexOf("http") == 0) {
        //todo
        restler.get(htmlPath).on("complete", function (resultOrError) {
            doWork(resultOrError, checksFilePath);
        });
    } else {
        var htmlText = fs.readFileSync(htmlPath).toString();
        doWork(htmlText, checksFilePath);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}

