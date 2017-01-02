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

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {
			JSXOpeningElement: function(node){
				const argToObj = node.attributes
					//.filter( node => node.value.type === 'Literal' )
					.reduce( (obj,item) => {
						if( item.value.type === 'Literal' ){
							obj[item.name.name] = item.value.value;
							//console.log(item.name.name, '=', item.value.value)
						}

						if( item.value.type === 'JSXExpressionContainer' ){
							obj[item.name.name] = expressionToObj(item.value.expression)
							//console.log(item.name.name, '=', expressionToObj(item.value.expression))
						}
						return obj;
					}, {});
				console.log( argToObj);
			},

            CallExpression: function(node) {
                if (node.callee.name === "defineMessages" ||
                    (node.callee.property || {}).name === "defineMessages") {
                    if (!node.arguments.length) {
                      context.report(node, "defineMessages() called without argument or first argument is null")
                      return;
                    }
					//to make generic
					//const defineMessages = "function defineMessages(){ return arguments[0]; }\n";
					//console.log( eval( defineMessages + context.eslint.getSource()));
                    node.arguments[0].properties.forEach(message => {
                        const description = (message.value.properties || [])
                              .find(p => p.key.name === "description");
                        if (!description) {
                            context.report(message, "each message must have a description")
                            return;
                        }

                        if (!(description.value.properties || []).find(p => p.key.name === "jira")) {
                            context.report(description, "each message description must have a 'jira' property")
                            return;
                        }
                    });
                }
            }

        };
    }
};
