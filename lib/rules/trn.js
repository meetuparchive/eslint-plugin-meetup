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

        const expressionToObj = exp => {
            return exp.properties.reduce( (obj, prop) => {
                obj[prop.key.name] = prop.value.value;
                return obj;
            }, {});
        }

        const reportNoDesc = node => context.report( node, "each message must have a description");
        const reportNoJira = node => context.report( node, "each message description must have a 'jira' property");

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
            JSXOpeningElement: function(node){
                const attrs = node.attributes
                    .reduce( (obj,item) => {
                        if(item.type === 'JSXSpreadAttribute'){
                            return obj;
                        }

                        if( item.value.type === 'Literal' ){
                            obj[item.name.name] = item.value.value;
                        }

                        if( item.value.type === 'JSXExpressionContainer' ){
                            obj[item.name.name] = expressionToObj(item.value.expression)
                        }
                        return obj;
                    }, {});

                if( node.attributes[0].type === 'JSXSpreadAttribute'){
                    return;
                }

                if( !attrs.description){
                    reportNoDesc(node);
                }

                if( !attrs.description || !attrs.description.jira ){
                    reportNoJira(node);
                }

            },

            CallExpression: function(node) {
                if (node.callee.name === "defineMessages" ||
                    (node.callee.property || {}).name === "defineMessages") {
                    if (!node.arguments.length) {
                      context.report(node, "defineMessages() called without argument or first argument is null")
                      return;
                    }

                    node.arguments[0].properties.forEach(message => {
                        const description = (message.value.properties || [])
                              .find(p => p.key.name === "description");
                        if (!description) {
                            reportNoDesc(message);
                        }

                        if ( !description || !(description.value.properties || []).find(p => p.key.name === "jira")) {
                            reportNoJira(message);
                        }
                    });
                }
            }

        };
    }
};
