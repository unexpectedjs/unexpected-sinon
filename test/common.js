/*global sinon:true, unexpected:true, unexpectedSinon:true*/
sinon = require('sinon');
unexpected = require('unexpected').clone();
unexpectedSinon = process.env.COVERAGE ?
    require('../lib-cov/unexpected-sinon') :
    require('../lib/unexpected-sinon');
unexpected.installPlugin(unexpectedSinon);
