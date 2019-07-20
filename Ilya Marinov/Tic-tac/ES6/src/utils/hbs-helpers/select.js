module.exports = function(value, options) {
  return options.fn(this)
    .split('\n')
    .map(function(tempValue) {
      let temp = `value="${value}"`;
      return ! RegExp(temp).test(tempValue) ? tempValue : tempValue.replace(temp, `${temp} selected="selected"`)
    })
    .join('\n');
};
