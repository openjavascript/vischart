"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.distanceAngleToPoint = distanceAngleToPoint;


/**
 * 从长度和角度求坐标点
 * @method  distanceAngleToPoint
 * @param  {Number} _distance
 * @param  {Number} _angle
 * @return Point
 * @static
 */
function distanceAngleToPoint(_distance, _angle) {
    var _radian = _angle * Math.PI / 180;
    return {
        x: Math.cos(_radian) * _distance,
        y: Math.sin(_radian) * _distance
    };
}