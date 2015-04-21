// Basic implementation of the runtime system of VirtualCSS.

var _ = lodash;
var buildCSSRule = require('buildCSSRule').buildCSSRule;

var classCounter = 0;

var generateSelector = function(selectorStr, body) {
  var content = _.map(body, (value, key) => buildCSSRule(key, value)).join('\n');
  return `${selectorStr} {\n${content}\n}`;
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
    return !(key.startsWith('$') || key.startsWith(':') || key.startsWith('['));
  });
  return filterObjectKeys(ruleSpec, nestedKeys);
}

var generateRule = function(ruleName, ruleSpec, inherited_classes) {
  var content = '';
  var className = getClassName(ruleName);
  var classSelector = '.' + className;
  var combinedClassName = inherited_classes + ' ' + classSelector;

  var ret = {
    $ruleName: ruleName,
    $spec: ruleSpec,
    className: combinedClassName,
  };

  // TODO: Support attributes here as well.
  var pseudoSelectors = getPseudoSelectors(ruleSpec);

  // Generate the CSS for the main class.
  content += generateSelector(classSelector, ruleSpec['$BASE'] || {});

  // Generate the CSS for the pseudo selectors.
  content += _.map(pseudoSelectors, (value, key) => {
    return generateSelector(classSelector + key, value);
  }).join('\n');


  // Generate the CSS for the nested selectors. For these, call `generateRule`
  // recursivly again and pass the `combinedClassName` as base class to
  // inherit from.
  var nestedRules = getNestedRules(ruleSpec);
  content += _.map(nestedRules, (value, key) => {
    var [rule_ret, rule_content] = generateRule(key, value, combinedClassName);
    ret[key] = rule_ret;
    return rule_content;
  }).join('\n');

  return [ret, content];
}

module.exports.create = function(spec) {
  var content = '';
  var ret = {};

  return _.forEach(spec, (ruleSpec, ruleName) => {
    var [rule_ret, rule_content] = generateRule(ruleName, ruleSpec, '');
    ret[ruleName] = rule_ret;
  });

  // Mount the comptued CSS on the page.
  mountCSSContent(content);

  return ret;
}

module.exports.composer = function(spec) {

}

module.exports.compose = function() {
  // TODO:
}

module.exports.function = function() {
  // TODO:
}

var mountCSSContent = function(content) {
  console.log('TODO: Mount CSS content', content);
}

