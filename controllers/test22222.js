// const superagent = require('superagent');
const cheerio = require('cheerio');
const request = require('superagent');
require('superagent-charset')(request);

let url = 'https://news.baidu.com/'; //百度新闻地址
let arr = [];

let test2 = async (ctx, next) => {
    let a2 = await _getUrl();
    await ctx.render('hello', {
        url: '/hello',
        title: 'Hello Koa 2!',
        arr: arr
    });
};

module.exports = [
    {
        method: 'get',
        uri: '/test2',
        fn: test2,
    }
];

function _getUrl() {
    request.get(url)
        .charset('utf-8')//当前页面编码格式
        .end((err, sres) => { //页面获取到的数据
            let html = sres.text,
                $ = cheerio.load(html, {
                    decodeEntities: false
                }); //用cheerio解析页面数据

            //下面类似于jquery的操作，前端的小伙伴们肯定很熟悉啦
            $("#pane-news ul li").each((index, element) => {
                let $text = $(element).text();
                // console.log($text)
                arr.push($text);
            });
            console.log(1)
            // ctx.body = arr;
        });
}