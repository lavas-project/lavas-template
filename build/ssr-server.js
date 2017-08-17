/**
 * @file ssr server
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

const Koa = require('koa');
const Router = require('koa-router');
const serve = require('koa-static');
const rendererFactory = require('./ssr-renderer');
const config = require('./config');
const routeManager = require('./route-manager');
const isProd = process.env.NODE_ENV === 'production';

const app = new Koa();
const router = new Router();

(async () => {

    if (isProd) {
        require('./prerender');
    }

    app.use(serve(config.webpack.output.path));

    // init renderer factory
    rendererFactory.initRenderer(app);

    router.all('*', async ctx => {

        if (routeManager.shouldPrerender(ctx.path)) {
            ctx.body = await routeManager.prerender(ctx.path);
        }
        else {
            /* eslint-disable fecs-prefer-async-await */
            let renderer = await rendererFactory.getRenderer();

            ctx.body = await new Promise((resolve, reject) => {
                // render to string
                renderer.renderToString(ctx, (err, html) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(html);
                });
            });
            /* eslint-enable fecs-prefer-async-await */
        }
    });

    app.use(router.routes());
    app.use(router.allowedMethods());

    let port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log('server started at localhost:' + port);
    });
})();
