const Koa = require('koa');
const Router = require('koa-route');
const Static = require('koa-static');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const path = require('path');
const mysql = require('./mysql');

const app = new Koa();

app.use(Static(path.join(__dirname)));
app.use(bodyParser());

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

app.use(Router.get('/', async ctx => {
    ctx.response.type = 'html';
    ctx.response.body = fs.createReadStream('./index.html');
}));

app.use(Router.get('/data', async ctx => {
    let data = await mysql.getMySql();
    console.log(data);
    ctx.response.body = data;
}));

app.use(Router.post('/user', async ctx => {
    ctx.request.body.sex = ctx.request.body.sex === 'man' ? 1 : 0;
    ctx.response.body = await mysql.addInfo(ctx.request.body);
}));

app.listen(3000);
