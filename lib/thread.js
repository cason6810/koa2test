// 多线程模拟
// 只是成功场景，下载失败未处理

const TotalTaskCount = 30; // 一共有1000个链接
const MaxConcurrency = 10; // 同时下载的链接数最大不超过10
const url = []; // 1000个下载链接组成的数组

// 模拟url
for (let i = 0; i <= TotalTaskCount; i++) {
    url.push(`url-${i}`);
}

// 下载的方法，下载成功后resolve，失败后reject
const download = function (urlStr) {
    // 返回Promise, 当下载完成的时候resolve
    // setTimeout 模拟下载，随机成功时间，实际场景待测
    return new Promise((resolve, reject) => {
        let _time = parseInt(Math.random()*1000)+1000;
        if (_time > 700) {
            setTimeout(() => {
                console.log(urlStr);
                resolve(urlStr);
            }, _time);
        }else {
            reject();
        }
    });
};


let todoList = []; // 下载队列
let nextIndex = 0; // 总下载序，已进行下载队列的序号
// 初始使用队列 MaxConcurrency
for (let j = 0; j < MaxConcurrency; j++) {
    // 生成 Promise 并 push 进下载队列，首次必定为 MaxConcurrency 个
    let task = download(url[nextIndex]).then(() => {
        return j;
    }); // 注意这里resolve的值是任务在todoList的脚标，方便我们在Promise.race之后找到完成的任务脚标
    todoList.push(task);
    nextIndex++;
}

const run = async function (todo) {
    await Promise.race(todo)
        .then((res) => {
        // res 队列中已完的标记，用来替换
            // 这里index等于Promise.race第一个完成的任务的脚标
            if (nextIndex <=TotalTaskCount) {
                todo[res] = download(url[nextIndex]).then(() => {
                    return res;
                }); // 一旦有一个任务完成，马上把他替换成一个新的任务，继续下载
                nextIndex++;
            }
        }).catch((res) => {
            console.log(res, 'catch');
        }); // 这里index等于Promise.race第一个完成的任务的脚标

    // 控制线程达到数组总数时不再调用，避免死循环
    if (nextIndex !== TotalTaskCount) {
        await run(todo);
    }
};
run(todoList);