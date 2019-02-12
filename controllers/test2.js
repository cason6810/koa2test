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


const arr = [];
let arr2 = [];
const test2 = async (ctx, next) => {
    // ctx.state = {
    //     title: 'title'
    // };

    await loopModel();

    // await getUrl().then(()=>{});

    ctx.body = arr2;

    // await ctx.render('hello', {
    //     title: 'search',
    //     bodya: arr2
    // })
};

function loopModel() {
    return new Promise((resolve) => {
        for (let key in d) {
            for (let val of d[key]) {
                getProjectList(key, val).then((_obj) => {
                    getTask(_obj.urlFlag, _obj.assignId, _obj._tempProjectList, _obj.headers);
                    resolve();
                });
            }
        }
    })
}

/**
 * 获取参与的项目列表
 * 其中 运营需求 无修改权限，任务状态无法更新，暂不处理 id:100
 * @param urlFlag 是任务还是bug
 * @param assignId 指派人的id
 */
function getProjectList(urlFlag, assignId) {
    let _url = _domainName + '/api/v1/projects?member=' + assignId + '&order_by=user_order';
    let headers = {
        'Connection': 'keep-alive',
        'Host': '211.151.182.240:8000',
        'Origin': 'http://taiga.ebnew.com',
        'Accept': 'application/json, text/plain, */*',
        'Authorization': 'Bearer eyJ1c2VyX2F1dGhlbnRpY2F0aW9uX2lkIjoxOTN9:1eitBE:cf7dGu0C3-5NRTQh-_7Dn_XO4VU',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
    };

    return new Promise((resolve) => {
        let _tempProjectList = [];
        superagent.get(_url)
            .set(headers)
            .end((err, res) => {
                for (let val of res.body) {
                    if (val.id !== 100) {
                        _tempProjectList.push(val.id)
                    }
                }
                console.log(assignId);
                let _obj = {
                    urlFlag: urlFlag,
                    assignId: assignId,
                    _tempProjectList: _tempProjectList,
                    headers: headers,
                };
                resolve(_obj);
                getTask(urlFlag, assignId, _tempProjectList, headers);
            });
    });

}

function getTask(_urlFlag, _assignId, _tempProjectList, _headers) {
    let _url = '';
    for (let val of _tempProjectList) {
        _url = _domainName + '/api/v1/' + _urlFlag + 's?project=' + val + '&assigned_to=' + _assignId;

        superagent.get(_url)
            .set(_headers)
            .end((err, res) => {
                if (err) {
                    // console.log(err);
                    return;
                }
                let _obj=[];
                for (let val of res.body) {
                    if (!_finishFlag[val['status_extra_info'].name]) {
                        console.log(val.subject, val['status_extra_info'].name, '不同值');
                        _obj.push({
                            time: val['created_date'],
                            name: val.subject + val['status_extra_info'].name
                        });
                    }
                }
                arr2 = _obj;
            });
    }

}

function getUrl() {
    return new Promise((resolve) => {
        superagent.get(url)
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    return;
                }
                let html = res.text,
                    $ = cheerio.load(html, {
                        decodeEntities: false
                    }); //用cheerio解析页面数据

                //下面类似于jquery的操作，前端的小伙伴们肯定很熟悉啦
                $("#pane-news ul li").each((index, element) => {
                    let $text = $(element).text().trim();
                    arr.push($text);
                });
                resolve();
            });
    })
}

module.exports = [
    {
        method: 'get',
        uri: '/test2',
        fn: test2,
    }
];
