
const fs = require('fs-extra');

const path = require('path');

const glob = require('glob');

const config = require('./config');

const list = config.list;

const src = path.join(__dirname, '../dist/dest');

const root = path.resolve(__dirname, '../dist');
//

const clearEnv = function(result, env) {
    const s = '<div[^>]*data-hide-env=(' + env + ').*?[^>]*>(.*?)</div>';
    //console.log(s);

    const re = new RegExp(s, 'g');

    return result.replace(re, '');
};

const clearOtherEnv = function(result, env) {
    const envList = [];

    let ruleEnv = '';

    list.forEach(function(item) {
        if (item.env != env) {
            envList.push(item.env);
        }
    });

    ruleEnv = envList.join('|');

    const s = '<div[^>]*data-env=(' + ruleEnv + ').*?[^>]*>(.*?)</div>';
    //console.log(s);

    const re = new RegExp(s, 'g');

    return result.replace(re, '');
};
//端口替换

const portReplace = function(obj) {
    //list.forEach(obj => {
    const entryHtml = glob.sync(root + '/' + obj.title + '/*.html');

    const publicUrl = obj.url + config.appUrl;

    const baseUrl = publicUrl + 'assets';

    const env = obj.env;

    entryHtml.forEach(f => {
        fs.readFile(f, 'utf8', function(err, data) {
            if (err) {
                throw err;
            }

            // var result = data.replace(
            //     /(={1})((\.)?\/assets)/gi,
            //     '$1' + baseUrl
            // );
            let result = data.replace(
                /(={1}(\")?(\')?)((\.)?\/assets\/)/gi,
                '$1' + baseUrl + '/'
            );

            result = result.replace(/<ctEnv>/gi, env);
            result = result.replace(/<ctVersion>/gi, config.appVersion);
            result = result.replace(
                /(={1}(\")?(\')?)((\.)?\/static\/)/gi,
                '$1' + baseUrl + '/'
            );

            result = result.replace(/<ctAppPublic>/g, publicUrl);

            result = clearEnv(result, env);
            result = clearOtherEnv(result, env);

            fs.writeFile(f, result, 'utf8', function(err) {
                if (err) {
                    throw err;
                }
            });
        });
    });
    //});
};

//拷贝项目
const copy = function() {
    list.forEach(obj => {
        const url = path.join(__dirname, '../dist/', obj.title);

        fs.copy(src, url, function(err) {
            if (err) {
                throw err;
            }
            portReplace(obj);
            console.log(obj.title + ' copy success!');
        });
    });
};

module.exports.init = function() {
    copy();
};
