/**
 * @fileoverview Tests for RuleContext object.
 * @author Kevin Partington
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var assert = require("chai").assert,
    sinon = require("sinon"),
    leche = require("leche"),
    realESLint = require("../../lib/eslint"),
    RuleContext = require("../../lib/rule-context");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("RuleContext", function() {
    var sandbox = sinon.sandbox.create(),
        ruleContext, eslint;

    beforeEach(function() {
        eslint = leche.fake(realESLint);
        ruleContext = new RuleContext("fake-rule", eslint, 2, {}, {}, {}, require("espree").parse);
    });

    describe("report()", function() {

        describe("old-style call with location", function() {
            it("should call eslint.report() with rule ID and severity prepended", function() {
                var node = {},
                    location = {},
                    message = "Message",
                    messageOpts = {};

                var mockESLint = sandbox.mock(eslint);

                mockESLint.expects("report")
                    .once()
                    .withArgs("fake-rule", 2, node, location, message, messageOpts);

                ruleContext.report(node, location, message, messageOpts);

                mockESLint.verify();
            });
        });

        describe("old-style call without location", function() {
            it("should call eslint.report() with rule ID and severity prepended", function() {
                var node = {},
                    message = "Message",
                    messageOpts = {};

                var mockESLint = sandbox.mock(eslint);

                mockESLint.expects("report")
                    .once()
                    .withArgs("fake-rule", 2, node, message, messageOpts);

                ruleContext.report(node, message, messageOpts);

                mockESLint.verify();
            });
        });

        describe("new-style call with all options", function() {
            it("should call eslint.report() with rule ID and severity prepended and all new-style options", function() {
                var node = {},
                    location = {},
                    message = "Message",
                    messageOpts = {},
                    fixerObj = {},
                    fix = sandbox.mock().returns(fixerObj).once();

                var mockESLint = sandbox.mock(eslint);

                mockESLint.expects("report")
                    .once()
                    .withArgs("fake-rule", 2, node, location, message, messageOpts, fixerObj);

                ruleContext.report({
                    node: node,
                    loc: location,
                    message: message,
                    data: messageOpts,
                    fix: fix
                });

                fix.verify();
                mockESLint.verify();
            });
        });

    });

    describe("parse()", function() {
        it("is present", function() {
            assert.isFunction(ruleContext.parse);
        });
        it("works", function() {
            assert.isObject(ruleContext.parse("function answer() { return 42; }"));
        });
    });

});
