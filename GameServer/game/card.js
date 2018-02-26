/**
 * Created by tangwen on 2018/2/26.
 */
var defines = require("./defines");

const Card = function (value, shape) {
    var that = {};
    that.value = value;
    that.shape = shape;
    return that;
};

module.exports = Card;