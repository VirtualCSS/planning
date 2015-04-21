// Basic implementation of the runtime system of VirtualCSS.

var _ = require('lodash');
var buildCSSRule = require('./buildCSSRule');

var __DEBUG__ = true;

var classCounter = 0;

var RuleDef = function(ruleName, ruleSpec, className) {
  this.$ruleName = ruleName;
  this.$ruleSpec = ruleSpec;
  this.className = className;
}

var generateSelector = function(selectorStr, body) {
  var content = _.map(body, (value, key) => buildCSSRule(key, value)).join('\n');
  return `${selectorStr} {\n${content}\n}\n`;
}

var getClassName = function(ruleName) {
  return ruleName + `_${classCounter++}`;
}

var filterObjectKeys = function(obj, keys) {
  var ret = {};
  keys.forEach((key) => { ret[key] = obj[key]; });
  return ret;
}

var getPseudoSelectors = function(ruleSpec) {
  var nestedKeys = Object.keys(ruleSpec).filter((key) => {
    return key.startsWith(':');
  });
  return filterObjectKeys(ruleSpec, nestedKeys);
}

var getNestedRules = function(ruleSpec) {
  var nestedKeys = Object.keys(ruleSpec).filter((key) => {
    return !(key.startsWith('!') || key.startsWith(':') || key.startsWith('['));
  });
  return filterObjectKeys(ruleSpec, nestedKeys);
}

var generateRule = function(ruleName, ruleSpec, inherited_classes) {
  // For the case to reassign an existing RuleDef to a new ruleName, like in:
  //
  // > var TextAlignSwitcherStyles = StyleSheet.create({
  // >   childStyle: TextAlignChildStyleDef,
  if (ruleSpec instanceof RuleDef) {
    // Leaving the content empty as the there is nothing new to generate for
    // this rule here.
    return [ruleSpec, ''];
  }

  if (__DEBUG__) {
    console.log('call generateRule: ', ruleName, ruleSpec, inherited_classes);
  }

  var content = '';
  var className = getClassName(ruleName);
  var classSelector = '.' + className;
  var combinedClassName = inherited_classes + ' ' + className;

  var ret = new RuleDef(ruleName, ruleSpec, combinedClassName);

  // Generate the CSS for the main class.
  content += generateSelector(classSelector, ruleSpec['!BASE'] || {});

  // Generate the CSS for the pseudo selectors.
  content += _.map(getPseudoSelectors(ruleSpec), (value, key) => {
    return generateSelector(classSelector + key, value);
  }).join('\n');

  // TODO: Support attributes here as well.

  // Generate the CSS for the nested selectors. For these, call `generateRule`
  // recursivly again and pass the `combinedClassName` as base class to
  // inherit from.
  var nestedRules = getNestedRules(ruleSpec);
  content += _.map(nestedRules, (value, key) => {
    var [rule_def, rule_content] = generateRule(key, value, combinedClassName);
    ret[key] = rule_def;
    return rule_content;
  }).join('\n');

  if (__DEBUG__) {
    ret.$content = content;
  }


  return [ret, content];
}

module.exports.create = function(spec) {
  var content = '';
  var ret = {};

  _.forEach(spec, (ruleSpec, ruleName) => {
    var [rule_def, rule_content] = generateRule(ruleName, ruleSpec, '');
    ret[ruleName] = rule_def;
    content += rule_content;
  });

  // Mount the comptued CSS on the page.
  mountCSSContent(content);

  return ret;
}

module.exports.composer = function(spec) {
  return function(ruleDef) {
    return module.exports.compose(ruleDef, spec);
  }
}

var deepAssign = function(object, source) {
  _.forEach(source, (value, key) => {
    if (object[key] === undefined) {
      object[key] = value;
    } else {
      if (_.isObject(value)) {
        deepAssign(object[key], value);
      } else {
        object[key] = value;
      }
    }
  });
  return object;
}

module.exports.compose = function(ruleDef, spec) {
  var newSpec = deepAssign(_.clone(ruleDef.$ruleSpec, true /* deep clone */), spec);

  // TODO: The following is VERY inefficient. Regenerating the entire `spec`
  // leads to a lot of duplicate CSS content. This is okay for now hoping a
  // later optimisation pass will get rid of the duplication anyway.
  var [rule_def, rule_content] =
      generateRule(ruleDef.$ruleName + '_cmp', newSpec, '');

  // Apply the new generated CSS to the page.
  mountCSSContent(rule_content);

  // Return the rule definition.
  return rule_def;
}

module.exports.function = function() {
  // TODO:
}

var mountCSSContent = function(content) {
  // Create the actual style element and mount it in the document's <head>.
  var style = document.createElement('style');
  style.textContent = content;
  document.head.appendChild(style);
}

