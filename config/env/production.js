/**
 * @file development config
 * @author *__ author __*{% if: *__ email __* %}(*__ email __*){% /if %}
 */

'use strict';

module.exports = {

    webpack: {
        cssExtract: false,
        cssSourceMap: false,
        jsSourceMap: false,
        output: {
            assetsDir: 'static',
            publicPath: ''
        }
    }

};
