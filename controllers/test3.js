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
    // 'Closed': true,
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

    await getTask();

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
};



function getTask(){
    return new Promise((resolve) => {
        let _url = 'http://211.151.182.240:8000/api/v1/tasks?project=46&assigned_to=193';
        let _headers = {
            'Connection': 'keep-alive',
            'Host': '211.151.182.240:8000',
            'Origin': 'http://taiga.ebnew.com',
            'Accept': 'application/json, text/plain, */*',
            'Authorization': 'Bearer eyJ1c2VyX2F1dGhlbnRpY2F0aW9uX2lkIjoxOTN9:1eitBE:cf7dGu0C3-5NRTQh-_7Dn_XO4VU',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
        };
        superagent.get(_url)
            .set(_headers)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                let _obj=[];
                for (let val of res.body) {
                    console.log(val['status_extra_info'].name)
                    if (!_finishFlag[val['status_extra_info'].name]) {
                        console.log(val.subject, val['status_extra_info'].name, '不同值');
                        _obj.push({
                            time: val['created_date'],
                            name: val.subject + val['status_extra_info'].name
                        });
                    }
                }
                arr2 = _obj;
                resolve();
            })
    })
}

module.exports = [
    {
        method: 'get',
        uri: '/test3',
        fn: test3,
    }
];
