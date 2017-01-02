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

let parserOptions = {
	ecmaVersion: 6,
	ecmaFeatures: {
		experimentalObjectRestSpread: true,
		jsx: true
	}
};


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("trn", rule, {

    valid: [
        "defineMessages({ fooMessage: { id: 'foo', defaultMessage: 'bar', description: { text: 'foo bar', jira: '1234' } } });",
        {
			code : "<FormattedMessage id='foo' defaultMessage='bar' description={{ text: 'foo bar', jira: '1234' }} />",
			parserOptions: parserOptions,
		},
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
