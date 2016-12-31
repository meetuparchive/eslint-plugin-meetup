/**
 * @fileoverview An ESLint plugin for validating trn message definitions in web platform apps
 * @author Michael McGahan
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/trn"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("trn", rule, {

    valid: [
        "defineMessages({ fooMessage: { id: 'foo', defaultMessage: 'bar', description: { text: 'foo bar', jira: '1234' } } });",
    ],

    invalid: [
        {
          code: "defineMessages({ fooMessage: { id: 'foo', defaultMessage: 'bar', description: { text: 'foo bar' } } });",
            errors: [{
                message: "each message description must have a 'jira' property",
                type: "Property"
            }]
        }
    ]
});
