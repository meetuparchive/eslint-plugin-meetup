/**
 * @fileoverview An ESLint plugin for validating trn message definitions in web platform apps
 * @author Michael McGahan
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "An ESLint plugin for validating trn message definitions in web platform apps",
            category: "Fill me in",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            CallExpression: function(node) {
                if (node.callee.name === "defineMessages" ||
                    node.callee.property.name === "defineMessages") {
                    if (!node.arguments.length) {
                      context.report(node, "defineMessages() called without argument or first argument is null")
                      return;
                    }
                    node.arguments[0].properties.forEach(message => {
                        const description = message.value.properties
                              .find(p => p.key.name === "description");
                        if (!description) {
                            context.report(message, "each message must have a description")
                            return;
                        }

                        if (!description.value.properties.find(p => p.key.name === "jira")) {
                            context.report(description, "each message description must have a 'jira' property")
                            return;
                        }
                    });
                }
            }

        };
    }
};
