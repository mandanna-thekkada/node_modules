/* */ 
var assignMergeValue = require('./_assignMergeValue'),
    cloneBuffer = require('./_cloneBuffer'),
    cloneTypedArray = require('./_cloneTypedArray'),
    copyArray = require('./_copyArray'),
    initCloneObject = require('./_initCloneObject'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    safeGet = require('./_safeGet'),
    toPlainObject = require('./toPlainObject');
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet(object, key),
      srcValue = safeGet(source, key),
      stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, (key + ''), object, source, stack) : undefined;
  var isCommon = newValue === undefined;
  if (isCommon) {
    var isArr = isArray(srcValue),
        isBuff = !isArr && isBuffer(srcValue),
        isTyped = !isArr && !isBuff && isTypedArray(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      newValue = objValue;
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      } else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        newValue = initCloneObject(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}
module.exports = baseMergeDeep;