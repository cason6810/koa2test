// const superagent = require('superagent');
const cheerio = require('cheerio');
const superagent = require('superagent');
const charset2 = require('superagent-charset');

const _domainName = 'http://211.151.182.240:8000';
const url = "https://news.baidu.com/";

const d = {
    'task': ['193'],
    'issue': ['193']
};
const _finishFlag = {
    'Closed': true,
    '关闭': true,
    '完成': true,
    '已完成': true,
    '验证已通过': true,
    '待回归': true,
    '有待复测': true,
};
const _assign = {
    '193': '贺明明',
    '76': '苏佳才',
    '74': '王李冰'
};


let arr2 = [];
const test3 = async (ctx, next) => {

    await loopModel();

    ctx.body = arr2;

};

function loopModel() {
    return new Promise((resolve) => {
        for (let key in d) {
            for (let val of d[key]) {
                console.log(key, val);
                resolve();
            }
        }
    })
}


module.exports = [
    {
        method: 'get',
        uri: '/test3',
        fn: test3,
    }
];
