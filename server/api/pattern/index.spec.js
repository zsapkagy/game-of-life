'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var patternCtrlStub = {
  nextGeneration: 'patternCtrl.nextGeneration'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var patternIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './pattern.controller': patternCtrlStub
});

describe('Pattern API Router:', function() {
  it('should return an express router instance', function() {
    patternIndex.should.equal(routerStub);
  });

  describe('POST /api/patterns/next-generation', function() {
    it('should route to pattern.controller.nextGeneration', function() {
      routerStub.post
        .withArgs('/next-generation', 'patternCtrl.nextGeneration')
        .should.have.been.calledOnce;
    });
  });
});
