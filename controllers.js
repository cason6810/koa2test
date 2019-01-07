const fs = require('fs');

function addRoutes(router, routes) {
    for (let route of routes) {
        switch (route.method) {
            case 'post':
                router.post(route.uri, route.fn);
                console.log(`Register post url: ${route.uri}`);
                break;
            case 'get':
                router.get(route.uri, route.fn);
                console.log(`Register get url: ${route.uri}`);
                break;
            default:
                console.log(`Invalid url: ${route}`)
        }
    }
}

function addControllers(router) {
    let files = fs.readdirSync(__dirname + '/controllers');

    let controllerFiles = files.filter(f => {
        return f.endsWith('.js')
    });

    for (let controllerFile in controllerFiles) {
        console.log(`process controller: ${controllerFile}...`);
        console.log(controllerFiles[controllerFile]);
        let routes = require(__dirname + '/controllers/' + controllerFiles[controllerFile]);
        addRoutes(router, routes);
    }
}

module.exports = () => {
    let router = require('koa-router')();
    addControllers(router);
    return router.routes();
};