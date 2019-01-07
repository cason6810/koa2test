const puppeteer = require('puppeteer');

let hello = async (ctx, next) => {
    await ctx.render('hello', {
        url:'/hello',
        title: 'Hello Koa 2!'
    });
    // ctx.body = 'Hello the fucking world!123'
};

module.exports = [
    {
        method: 'get',
        uri: '/hello',
        fn: hello,
    }
];