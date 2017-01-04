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
            if( exp.type !== 'ObjectExpression' ){
                return;
            }
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
                if( node.name.name !== 'FormattedMessage' ||
                    node.attributes[0].type === 'JSXSpreadAttribute' ){
                        return;
                }

                const attrs = node.attributes
                    .reduce( (obj,item) => {
                        if(item.type === 'JSXSpreadAttribute' || item.name.value === 'values'){
                            return obj;
                        }

                        if( item.value.type === 'Literal' ){
                            obj[item.name.name] = item.value.value;
                        }

                        if( item.value.type === 'JSXExpressionContainer' && item.name.name === 'description'){
                            obj[item.name.name] = expressionToObj(item.value.expression)
                        }
                        return obj;
                    }, {});

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
