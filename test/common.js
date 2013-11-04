sinon = require('sinon');
expect = process.env.COVERAGE ?
    require('../lib-cov/unexpected-sinon') :
    require('../lib/unexpected-sinon');
