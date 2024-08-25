// https://github.com/probberechts/d3-soccer v0.1.0 Copyright 2021 undefined
(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-shape'), require('d3-color'), require('d3-scale'), require('d3-scale-chromatic')) :
typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-shape', 'd3-color', 'd3-scale', 'd3-scale-chromatic'], factory) :
(global = global || self, factory(global.d3 = global.d3 || {}, global.d3, global.d3, global.d3, global.d3, global.d3));
}(this, (function (exports, d3Selection, d3Shape, d3Color, d3Scale, colorScale) { 'use strict';

var pitchLenght = 105;
var pitchWidth = 68;
var spadlResults = [{
  "label": "Fail"
}, {
  "label": "Success"
}, {
  "label": "Offside"
}, {
  "label": "Own goal"
}, {
  "label": "Yellow card"
}, {
  "label": "Red card"
}];
var spadlActionTypes = [{
  "label": "Pass"
}, {
  "label": "Cross"
}, {
  "label": "Throw in"
}, {
  "label": "Freekick (cross)"
}, {
  "label": "Freekick (short)"
}, {
  "label": "Corner (cross)"
}, {
  "label": "Corner (short)"
}, {
  "label": "Dribble"
}, {
  "label": "Foul"
}, {
  "label": "Tackle"
}, {
  "label": "Interception"
}, {
  "label": "Shot"
}, {
  "label": "Penalty"
}, {
  "label": "Freekick (shot)"
}, {
  "label": "Save"
}, {
  "label": "Claim"
}, {
  "label": "Punch"
}, {
  "label": "Pick up"
}, {
  "label": "Clearance"
}, {
  "label": "Bad touch"
}, {
  "label": "-"
}, {
  "label": "Carry"
}, {
  "label": "Goal kick"
}];
var spadlBodyparts = [{
  "label": "Foot"
}, {
  "label": "Head"
}, {
  "label": "Other"
}];

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "@import url(\"https://fonts.googleapis.com/css2?family=Open+Sans&display=swap\");:root{--background-color:#fff;--color:#333;--color-meta:grey;--pitch-line-color:grey;--pitch-shade-color:grey}.dark-theme{--background-color:#162939;--color:#43fcd5;--color-meta:#f3efef;--pitch-line-color:#ccc;--pitch-shade-color:#ccc}:root{background-color:#fff;background-color:var(--background-color);font-family:Open Sans}.styles_pitch__FfcY4{stroke:grey;stroke:var(--pitch-line-color);fill:grey;fill:var(--pitch-line-color)}.styles_pitch__FfcY4 .styles_shaded__3Z3aN{fill:grey;fill:var(--pitch-shade-color);opacity:.1;stroke:0}.styles_tooltip__18QcU{font-family:Open Sans;position:absolute;background:#fff;pointer-events:none;z-index:6;align-items:center;transform:translateX(20px) translateY(0) translateY(-14px);opacity:0;display:flex;box-shadow:0 3px 6px rgba(0,0,0,.16)}.styles_tooltip__18QcU table{border-collapse:collapse;border-spacing:0;background-color:#fff;empty-cells:show;-webkit-box-shadow:7px 7px 12px -9px #777;-moz-box-shadow:7px 7px 12px -9px #777;box-shadow:7px 7px 12px -9px #777;opacity:.9}.styles_tooltip__18QcU table th{background-color:#aaa;font-size:14px;padding:2px 5px;text-align:left;color:#fff}.styles_tooltip__18QcU table tr{border:1px solid #ccc}.styles_tooltip__18QcU table td{font-size:13px;padding:3px 6px;background-color:#fff;border-left:1px dotted #999}.styles_header__3F_M8 .styles_h1__SWkxh{font-size:32px;fill:#333;fill:var(--color)}.styles_header__3F_M8 .styles_h2__1uKw6{font-size:21px;fill:grey;fill:var(--color-meta)}.styles_header__3F_M8 .styles_circle__26r9b{stroke:grey;stroke:var(--color-meta)}.styles_actions_table__34weY{font-size:.8em}.styles_actions_table__34weY :last-child{margin-bottom:0}.styles_actions_table__34weY table{border-collapse:collapse;background-color:transparent}.styles_actions_table__34weY table th{padding:8px 5px;line-height:1.625;vertical-align:bottom;border-bottom:2px solid #d8d9da}.styles_actions_table__34weY table td{padding:8px 5px;line-height:1.625;vertical-align:top;border-top:1px solid #ededed}";
var css = {"pitch":"styles_pitch__FfcY4","shaded":"styles_shaded__3Z3aN","tooltip":"styles_tooltip__18QcU","header":"styles_header__3F_M8","h1":"styles_h1__SWkxh","h2":"styles_h2__1uKw6","circle":"styles_circle__26r9b","actions_table":"styles_actions_table__34weY"};
styleInject(css_248z);

function pitch () {
  var clip = {
    top: 0,
    right: pitchLenght,
    bottom: pitchWidth,
    left: 0
  };
  var height = 300;
  var rotated = false;
  var width = (-clip.left + clip.right) / (-clip.top + clip.bottom) * height;
  var pitchstrokewidth = .5;
  var dirOfPlay = false;
  var shadeMiddleThird = false;
  var drawGoalsFn = drawGoalsAsLine;

  function drawGoalsAsBox(lines) {
    lines.append("rect").style("stroke-width", pitchstrokewidth).style("fill", "none").attr("x", -2).attr("y", pitchWidth / 2 - 3.66).attr("width", 2).attr("height", 7.32);
    lines.append("rect").style("stroke-width", pitchstrokewidth).style("fill", "none").attr("x", pitchLenght).attr("y", pitchWidth / 2 - 3.66).attr("width", 2).attr("height", 7.32);
  }

  function drawGoalsAsLine(lines) {
    lines.append("rect").style("stroke-width", 0).attr("x", -pitchstrokewidth * 1.5).attr("y", pitchWidth / 2 - 3.66).attr("width", pitchstrokewidth * 3).attr("height", 7.32);
    lines.append("rect").style("stroke-width", 0).attr("x", pitchLenght - pitchstrokewidth * 1.5).attr("y", pitchWidth / 2 - 3.66).attr("width", pitchstrokewidth * 3).attr("height", 7.32);
  }

  function chart(g) {
    g.each(function () {
      var pitch = d3Selection.select(this).append("svg").attr("width", width).attr("height", height).attr("viewBox", function () {
        var width = clip.right - clip.left;
        var height = clip.bottom - clip.top;
        var xdim, ydim, xpad, ypad;

        if (rotated) {
          xpad = height === pitchWidth ? 4 : 2;
          ypad = width === pitchLenght ? 4 : 2;
          xdim = -clip.left + clip.right + ypad;
          ydim = -clip.top + clip.bottom + xpad;
        } else {
          xpad = height === pitchWidth ? 4 : 2;
          ypad = width === pitchLenght ? 4 : 2;
          ydim = -clip.top + clip.bottom + xpad;
          xdim = -clip.left + clip.right + ypad;
        }

        return "-2 -2 ".concat(xdim, " ").concat(ydim);
      }).append("g").attr("id", "pitch").attr("transform", "translate(".concat(-clip.left, ", ").concat(-clip.top, ")rotate(").concat(rotated ? -90 : 0, " 0 0)translate(").concat(rotated ? -105 : 0, " 0)"));
      pitch.append("g").attr("id", "below");
      var lines = pitch.append("g").attr("id", "lines").attr("class", css.pitch).attr("pointer-events", "none"); // Halfway line

      lines.append("line").style("stroke-width", pitchstrokewidth).attr("x1", pitchLenght / 2).attr("y1", 0).attr("x2", pitchLenght / 2).attr("y2", pitchWidth); // Centre circle 

      lines.append("circle").style("stroke-width", pitchstrokewidth).style("fill", 'none').attr("cx", pitchLenght / 2).attr("cy", pitchWidth / 2).attr("r", 9.15);
      lines.append("circle").style("stroke-width", 0).attr("cx", pitchLenght / 2).attr("cy", pitchWidth / 2).attr("r", pitchstrokewidth); // Penalty arcs

      var arc1 = d3Shape.arc().innerRadius(9.15).outerRadius(9.15).startAngle(38 * (Math.PI / 180)) //converting from degs to radians
      .endAngle(142 * (Math.PI / 180)); //just radians

      lines.append("path").style("stroke-width", pitchstrokewidth).attr("d", arc1).attr("transform", "translate(11," + pitchWidth / 2 + ")");
      var arc2 = d3Shape.arc().innerRadius(9.15).outerRadius(9.15).startAngle(218 * (Math.PI / 180)) //converting from degs to radians
      .endAngle(322 * (Math.PI / 180)); //just radians

      lines.append("path").style("stroke-width", pitchstrokewidth).attr("d", arc2).attr("transform", "translate(" + (pitchLenght - 11) + "," + pitchWidth / 2 + ")"); // Goal areas

      lines.append("rect").style("stroke-width", pitchstrokewidth).style("fill", 'none').attr("x", 0).attr("y", pitchWidth / 2 - 9.16).attr("width", 5.5).attr("height", 18.32);
      lines.append("rect").style("stroke-width", pitchstrokewidth).style("fill", 'none').attr("x", pitchLenght - 5.5).attr("y", pitchWidth / 2 - 9.16).attr("width", 5.5).attr("height", 18.32); // Penalty areas

      lines.append("rect").style("stroke-width", pitchstrokewidth).style("fill", "none").attr("x", 0).attr("y", pitchWidth / 2 - 20.16).attr("width", 16.5).attr("height", 40.32);
      lines.append("rect").style("stroke-width", pitchstrokewidth).style("fill", "none").attr("x", pitchLenght - 16.5).attr("y", pitchWidth / 2 - 20.16).attr("width", 16.5).attr("height", 40.32); // Penalty marks

      lines.append("circle").style("stroke-width", 0).attr("cx", 11).attr("cy", pitchWidth / 2).attr("r", pitchstrokewidth);
      lines.append("circle").style("stroke-width", 0).attr("cx", pitchLenght - 11).attr("cy", pitchWidth / 2).attr("r", pitchstrokewidth); // Direction of play

      if (dirOfPlay) {
        lines.append("polygon").attr("class", css.shaded).attr("points", "\n                  25,".concat(pitchWidth / 2 - 2, " \n                  35,").concat(pitchWidth / 2 - 2, " \n                  35,").concat(pitchWidth / 2 - 5, " \n                  40,").concat(pitchWidth / 2, " \n                  35,").concat(pitchWidth / 2 + 5, " \n                  35,").concat(pitchWidth / 2 + 2, " \n                  25,").concat(pitchWidth / 2 + 2, " \n                  25,").concat(pitchWidth / 2 - 2, "\n                "));
      } // Pitch boundaries


      lines.append("rect").style("stroke-width", pitchstrokewidth).attr("fill", "none").attr("x", 0).attr("y", 0).attr("width", pitchLenght).attr("height", pitchWidth); // Goals

      drawGoalsFn(lines);
      pitch.append("g").attr("id", "above"); // Middle third

      if (shadeMiddleThird) {
        lines.append("rect").attr("class", css.shaded).attr("fill", "#fff").attr("x", 35).attr("y", 0).attr("width", 35).attr("height", pitchWidth);
      }
    });
  }

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = +_;
    width = (-clip.left + clip.right) / (-clip.top + clip.bottom) * height;
    return chart;
  };

  chart.width = function () {
    return width;
  };

  chart.rotate = function (_) {
    if (!arguments.length) return rotated;
    rotated = Boolean(_);
    return chart;
  };

  chart.showDirOfPlay = function (_) {
    if (!arguments.length) return dirOfPlay;
    dirOfPlay = Boolean(_);
    return chart;
  };

  chart.shadeMiddleThird = function (_) {
    if (!arguments.length) return shadeMiddleThird;
    shadeMiddleThird = Boolean(_);
    return chart;
  };

  chart.pitchStrokeWidth = function (_) {
    if (!arguments.length) return pitchstrokewidth;
    pitchstrokewidth = +_;
    return chart;
  };

  chart.goals = function (_) {
    if (!arguments.length) return drawGoalsFn;
    if (_ === "box") drawGoalsFn = drawGoalsAsBox;else if (_ === "line") drawGoalsFn = drawGoalsAsLine;else drawGoalsFn = _;
    return chart;
  };

  chart.clip = function (_) {
    if (!arguments.length) return [[clip.left, clip.top], [clip.right, clip.bottom]];
    clip = {
      top: _[0][1],
      bottom: _[1][1],
      left: _[0][0],
      right: _[1][0]
    };
    width = (-clip.left + clip.right) / (-clip.top + clip.bottom) * height;
    return chart;
  };

  return chart;
}

function d3Extent(values, valueof) {
  let min;
  let max;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null) {
        if (min === undefined) {
          if (value >= value) min = max = value;
        } else {
          if (min > value) min = value;
          if (max < value) max = value;
        }
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null) {
        if (min === undefined) {
          if (value >= value) min = max = value;
        } else {
          if (min > value) min = value;
          if (max < value) max = value;
        }
      }
    }
  }
  return [min, max];
}

function max(values, valueof) {
  let max;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null
          && (max < value || (max === undefined && value >= value))) {
        max = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null
          && (max < value || (max === undefined && value >= value))) {
        max = value;
      }
    }
  }
  return max;
}

// Interpolate values for a function of the form `f(x, y) = z` within a 1x1 square (from (x, y) = (0, 0) to (1, 1)) by providing 16 points at it's edges and around it ((-1, -1), (0, -1), (1, -1), (2, -1), (0, -1), (0, 0), ..., (3, 3)).
// Takes in the 16 values for z as a 2D array and an options object. Make sure the first selector corresponds to x position (e.g. points[x][y]). This is the rotated from the visual layout if you declare the array in javascript manually. Also, keep in mind that values[0][0] actually corresponds to the value for (-1, -1).
// You can set `options.scaleX` and `options.scaleY` to multiply the positions input to the interpolator by before interpolating. defaults = 1
// You can set `options.translateX` and `options.translateY` to add to the positions input to the interpolator before interpolating (but after scaling). defaults = 0
// Returns a function that takes two arguments (x, y) and returns the interpolated value.
function createInterpolator(values, options={}) {
  options = Object.assign({
    extrapolate: false,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0
  }, options);

  //Coefficients: first number corresponds to x's exponent in the polynomial, the second to y's.
  const a00 = values[1][1],
        a01 = (-1/2)*values[1][0] + (1/2)*values[1][2],
        a02 = values[1][0] + (-5/2)*values[1][1] + 2*values[1][2] + (-1/2)*values[1][3],
        a03 = (-1/2)*values[1][0] + (3/2)*values[1][1] + (-3/2)*values[1][2] + (1/2)*values[1][3],
        a10 = (-1/2)*values[0][1] + (1/2)*values[2][1],
        a11 = (1/4)*values[0][0] + (-1/4)*values[0][2] + (-1/4)*values[2][0] + (1/4)*values[2][2],
        a12 = (-1/2)*values[0][0] + (5/4)*values[0][1] + (-1)*values[0][2] + (1/4)*values[0][3] + (1/2)*values[2][0] + (-5/4)*values[2][1] + values[2][2] + (-1/4)*values[2][3],
        a13 = (1/4)*values[0][0] + (-3/4)*values[0][1] + (3/4)*values[0][2] + (-1/4)*values[0][3] + (-1/4)*values[2][0] + (3/4)*values[2][1] + (-3/4)*values[2][2] + (1/4)*values[2][3],
        a20 = values[0][1] + (-5/2)*values[1][1] + 2*values[2][1] + (-1/2)*values[3][1],
        a21 = (-1/2)*values[0][0] + (1/2)*values[0][2] + (5/4)*values[1][0] + (-5/4)*values[1][2] + (-1)*values[2][0] + values[2][2] + (1/4)*values[3][0] + (-1/4)*values[3][2],
        a22 = values[0][0] + (-5/2)*values[0][1] + 2*values[0][2] + (-1/2)*values[0][3] + (-5/2)*values[1][0] + (25/4)*values[1][1] + (-5)*values[1][2] + (5/4)*values[1][3] + 2*values[2][0] + (-5)*values[2][1] + 4*values[2][2] + (-1)*values[2][3] + (-1/2)*values[3][0] + (5/4)*values[3][1] + (-1)*values[3][2] + (1/4)*values[3][3],
        a23 = (-1/2)*values[0][0] + (3/2)*values[0][1] + (-3/2)*values[0][2] + (1/2)*values[0][3] + (5/4)*values[1][0] + (-15/4)*values[1][1] + (15/4)*values[1][2] + (-5/4)*values[1][3] + (-1)*values[2][0] + 3*values[2][1] + (-3)*values[2][2] + values[2][3] + (1/4)*values[3][0] + (-3/4)*values[3][1] + (3/4)*values[3][2] + (-1/4)*values[3][3],
        a30 = (-1/2)*values[0][1] + (3/2)*values[1][1] + (-3/2)*values[2][1] + (1/2)*values[3][1],
        a31 = (1/4)*values[0][0] + (-1/4)*values[0][2] + (-3/4)*values[1][0] + (3/4)*values[1][2] + (3/4)*values[2][0] + (-3/4)*values[2][2] + (-1/4)*values[3][0] + (1/4)*values[3][2],
        a32 = (-1/2)*values[0][0] + (5/4)*values[0][1] + (-1)*values[0][2] + (1/4)*values[0][3] + (3/2)*values[1][0] + (-15/4)*values[1][1] + 3*values[1][2] + (-3/4)*values[1][3] + (-3/2)*values[2][0] + (15/4)*values[2][1] + (-3)*values[2][2] + (3/4)*values[2][3] + (1/2)*values[3][0] + (-5/4)*values[3][1] + values[3][2] + (-1/4)*values[3][3],
        a33 = (1/4)*values[0][0] + (-3/4)*values[0][1] + (3/4)*values[0][2] + (-1/4)*values[0][3] + (-3/4)*values[1][0] + (9/4)*values[1][1] + (-9/4)*values[1][2] + (3/4)*values[1][3] + (3/4)*values[2][0] + (-9/4)*values[2][1] + (9/4)*values[2][2] + (-3/4)*values[2][3] + (-1/4)*values[3][0] + (3/4)*values[3][1] + (-3/4)*values[3][2] + (1/4)*values[3][3];

  return (x, y) => {
    x = (x * options.scaleX) + options.translateX;
    y = (y * options.scaleY) + options.translateY;

    if(x < 0 || y < 0 || x > 1 || y > 1) throw 'cannot interpolate outside the square from (0, 0) to (1, 1): (' + x + ', ' + y + ')';

    const x2 = x*x,
          x3 = x*x2,
          y2 = y*y,
          y3 = y*y2;

    return (a00 + a01*y + a02*y2 + a03*y3) +
           (a10 + a11*y + a12*y2 + a13*y3) * x +
           (a20 + a21*y + a22*y2 + a23*y3) * x2 +
           (a30 + a31*y + a32*y2 + a33*y3) * x3;
  }
}

// Interpolate values for a function of the form `f(x, y) = z` within an (m-3)x(n-3) rectangle (from (x, y) = (1, 1) to (m-2, n-2)) by providing m x n samples for z.
// Takes in the m x n values for z as a 2D array and an options object. If `options.extrapolate` is true, this will get modified. Make sure the first selector corresponds to x position (e.g. points[x][y]). This is the rotated from the visual layout if you declare the array in javascript manually. Also, keep in mind that for this function, values[0][0] actually does corresponds to the value for (0, 0).
// If `options.extrapolate` is true, the `values` arrays will be modified to allow for interpolating from (-1, -1) to (m, n) by linearly estimating a margin of 2 more values on each side. This is useful, for example, to interpolate values of an image all the way to the edge of the pixels on the edge (corresponding to -0.5 < x < m-0.5 and -0.5 < y < n-0.5). default = false
// You can set `options.scaleX` and `options.scaleY` to multiply the positions input to the interpolators by before interpolating. defaults = 1
// You can set `options.translateX` and `options.translateY` to add to the positions input to the interpolators before interpolating (but after scaling). defaults = 0
// Returns a function that takes two arguments (x, y) and returns the interpolated value.
function createGridInterpolator(values, options={}) {
  options = Object.assign({
    extrapolate: false,
    scaleX: 1,
    scaleY: 1,
    translateX: 0,
    translateY: 0
  }, options);

  const m = values.length;
  const n = values[0].length;
  const interpolators = [];

  if(options.extrapolate) {
    //Extrapolate X
    values[-2] = [];
    values[-1] = [];
    values[m] = [];
    values[m+1] = [];
    for(var y = 0; y < n; y++) {
      const leftDelta = values[0][y] -  values[1][y];
      const rightDelta = values[m-1][y] - values[m-2][y];
      values[-2][y] = values[0][y] + 2*leftDelta;
      values[-1][y] = values[0][y] + leftDelta;
      values[m][y] = values[m-1][y] + rightDelta;
      values[m+1][y] = values[m-1][y] + 2*rightDelta;
    }

    //Extrapolate Y
    for(var x = -2; x < m+2; x++) {
      const bottomDelta = values[x][0] - values[x][1];
      const topDelta = values[x][n-1] - values[x][n-2];
      values[x][-2] = values[x][0] + 2*bottomDelta;
      values[x][-1] = values[x][0] + bottomDelta;
      values[x][n] = values[x][n-1] + topDelta;
      values[x][n+1] = values[x][n-1] + 2*topDelta;
    }

    //Populate interpolator arrays
    for(var x = -1; x < m; x++) interpolators[x] = [];
  }else {
    //Populate interpolator arrays
    for(var x = 1; x < m-2; x++) interpolators[x] = [];
  }

  return (x, y) => {
    x = (x * options.scaleX) + options.translateX;
    y = (y * options.scaleY) + options.translateY;

    if(options.extrapolate) {
      if(x < -1 || y < -1 || x > m || y > n) throw 'cannot interpolate outside the rectangle from (-1, -1) to (' + m + ', ' + n + ') even when extrapolating: (' + x + ', ' + y + ')';
    }else {
      if(x < 1 || y < 1 || x > m-2 || y > n-2) throw 'cannot interpolate outside the rectangle from (1, 1) to (' + (m-2) + ', ' + (n-2) + '): (' + x + ', ' + y + '), you might want to enable extrapolating';
    }

    var blX = Math.floor(x);// The position of interpolator's (0, 0) for this point
    var blY = Math.floor(y);

    if(options.extrapolate) {//If you're trying to interpolate on the top or right edges of what can be interpolated, you have to interpolate in the region to the left or bottom respectively.
      if(x === m) blX--;
      if(y === n) blY--;
    }else {
      if(x === m-2) blX--;
      if(y === n-2) blY--;
    }


    if(!interpolators[blX][blY]) {
      interpolators[blX][blY] = createInterpolator([
        [values[blX-1][blY-1], values[blX-1][blY], values[blX-1][blY+1], values[blX-1][blY+2]],
        [values[blX+0][blY-1], values[blX+0][blY], values[blX][blY+1], values[blX][blY+2]],
        [values[blX+1][blY-1], values[blX+1][blY], values[blX+1][blY+1], values[blX+1][blY+2]],
        [values[blX+2][blY-1], values[blX+2][blY], values[blX+2][blY+1], values[blX+2][blY+2]]
      ], {
        translateX: -blX,
        translateY: -blY
      });
    }
    const interpolator = interpolators[blX][blY];
    
    return interpolator(x, y);
  }
}

// These are just helper functions for when you need to interpolate multiple sets of values (e.g. components of color in an image).
// Instead of taking in 2D value arrays they expect 3D arrays, where the last index corresponds to the set/ surface (e.g. values[x][y][s])
function createMultiInterpolator(values, options={}) {
  const s = values[0][0].length;
  const interpolators = [];
  for(var i = 0; i < s; i++) interpolators[i] = createInterpolator(values.map(col => col.map(vals => vals[i])), options);
  return (x, y) => {
    return interpolators.map(interpolator => interpolator(x, y));
  }
}

function createMultiGridInterpolator(values, options={}) {
  const s = values[0][0].length;
  const interpolators = [];
  for(var i = 0; i < s; i++) interpolators[i] = createGridInterpolator(values.map(col => col.map(vals => vals[i])), options);
  return (x, y) => {
    return interpolators.map(interpolator => interpolator(x, y));
  }
}

var bicubicInterpolate = {
  createInterpolator: createInterpolator,
  createGridInterpolator: createGridInterpolator,
  createMultiInterpolator: createMultiInterpolator,
  createMultiGridInterpolator: createMultiGridInterpolator
};
var bicubicInterpolate_2 = bicubicInterpolate.createGridInterpolator;

function position(el, parent) {
  var elPos = el.node().getBoundingClientRect();
  var vpPos = parent.node().getBoundingClientRect();
  return {
    top: elPos.top - vpPos.top,
    left: elPos.left - vpPos.left,
    width: elPos.width,
    bottom: elPos.bottom - vpPos.top,
    height: elPos.height,
    right: elPos.right - vpPos.left
  };
}

var grid = function grid() {
  function grid(d) {
    var data = [];
    var gx = d.length;
    var gy = d[0].length;
    var incx = pitchLenght / gx;
    var incy = pitchWidth / gy;
    var max_v = 0.;

    for (var x = 0; x < gx; x++) {
      for (var y = 0; y < gy; y++) {
        if (d[x][y] > max_v) {
          max_v = d[x][y];
        }

        data.push({
          i: x,
          j: y,
          x: x * incx,
          y: y * incy,
          width: incx,
          height: incy,
          value: d[x][y]
        });
      }
    }

    return data;
  }

  return grid;
};
var rectbin = function rectbin() {
  var dx = 0.1,
      dy = 0.1,
      x = function x(d) {
    return d[0];
  },
      y = function y(d) {
    return d[1];
  };

  function trunc(x) {
    return x < 0 ? Math.ceil(x) : Math.floor(x);
  }

  function rectbin(points) {
    var binsById = {};
    var xExtent = [0, 105];
    var yExtent = [0, 68]; //var xExtent = d3.extent(points, function(d, i){ return x.call(rectbin, d, i) ;});
    //var yExtent = d3.extent(points, function(d, i){ return y.call(rectbin, d, i) ;});

    for (var Y = yExtent[0], pj = 0; Y < yExtent[1] - 0.0001; Y += dy, pj++) {
      for (var X = xExtent[0], pi = 0; X < xExtent[1] - 0.0001; X += dx, pi++) {
        var id = pi + '-' + pj;
        var bin = binsById[id] = [];
        bin.i = pi;
        bin.j = pj;
        bin.x = X;
        bin.y = Y;
        bin.width = dx;
        bin.height = dy;
        bin.value = 0;
      }
    }

    points.forEach(function (point, i) {
      var py = y.call(rectbin, point, i) / dy;
      var pj = trunc(py);
      var px = x.call(rectbin, point, i) / dx;
      var pi = trunc(px);
      var id = pi + '-' + pj;
      var bin = binsById[id];

      if (bin) {
        bin.push(point);
        bin.value += 1;
      }
    });
    return Object.values(binsById);
  }

  rectbin.x = function (_) {
    if (!arguments.length) return x;
    x = _;
    return rectbin;
  };

  rectbin.y = function (_) {
    if (!arguments.length) return y;
    y = _;
    return rectbin;
  };

  rectbin.dx = function (_) {
    if (!arguments.length) return dx;
    dx = _;
    return rectbin;
  };

  rectbin.dy = function (_) {
    if (!arguments.length) return dy;
    dy = _;
    return rectbin;
  };

  return rectbin;
};
function heatmap (pitch) {
  var enableInteraction = false,
      selected = [undefined, undefined],
      onSelect = function onSelect() {
    return;
  },
      onDeselect = function onDeselect() {
    return;
  },
      color = d3Scale.scaleSequential(colorScale.interpolateGreens).domain([undefined, undefined]),
      stroke = '#00000011',
      selStroke = '#FF6600',
      strokewidth = 0.0,
      interpolated = false,
      parent_el = 'body',
      selStrokewidth = 0.5;

  function chart(g) {
    g.each(function (data) {
      var selx = selected[0];
      var sely = selected[1];

      if (color.domain().some(isNaN)) {
        color.domain(d3Extent(data, function (d) {
          return d.value;
        }));
      }

      var draw = g.call(pitch).select("#below");
      var join = draw.selectAll("rect.cell") // these
      .data(data);
      var enterSel = join.enter().append("rect").attr("id", function (d) {
        return "cell(".concat(d.i, ",").concat(d.j, ")");
      }).attr("class", "cell").attr("x", function (d) {
        return d.x;
      }).attr("y", function (d) {
        return d.y;
      }).attr("width", function (d) {
        return d.width;
      }).attr("height", function (d) {
        return d.height;
      }).attr("data", function (d) {
        return d.value;
      }).style("stroke", function (d) {
        return selx === d.x && sely === d.y ? selStroke : stroke;
      }).style("stroke-width", function (d) {
        return selx === d.x && sely === d.y ? selStrokewidth : strokewidth;
      }).style("fill", function (d) {
        return interpolated ? 'transparent' : color(+d.value);
      }).style("cursor", enableInteraction ? "crosshair" : "default").on('mouseover', function (d) {
        if (enableInteraction) d3Selection.select(this).style('stroke', selStroke).style('stroke-width', selStrokewidth);
        onSelect(d.x, d.y, d.value);
      }).on('mouseout', function (d) {
        if (enableInteraction) d3Selection.select(this).style('stroke', stroke).style('stroke-width', strokewidth);
        onDeselect(d.x, d.y, d.value);
      });
      join.merge(enterSel).transition().attr("x", function (d) {
        return d.x;
      }).attr("y", function (d) {
        return d.y;
      }).attr("width", function (d) {
        return d.width;
      }).attr("height", function (d) {
        return d.height;
      }).attr("data", function (d) {
        return d.value;
      }).style("fill", function (d) {
        return interpolated ? 'transparent' : color(+d.value);
      });
      join.exit().transition().attr('width', 0).attr('height', 0).remove();

      if (interpolated) {
        var gx = max(data, function (d) {
          return d.i;
        }) + 1;
        var gy = max(data, function (d) {
          return d.j;
        }) + 1;
        var grid = [];

        for (var x = 0; x < gx; x++) {
          grid.push([]);

          for (var y = 0; y < gy; y++) {
            grid[x].push(data.find(function (d) {
              return d.i === x && d.j === y;
            }).value);
          }
        }

        var canvas = d3Selection.select(parent_el).style('position', 'relative').append("canvas").style("z-index", -1).style("position", 'absolute').style("pointer-events", 'none');
        var bbox = position(g.select('#below'), d3Selection.select(parent_el));
        var n = parseInt(bbox.height);
        var m = parseInt(bbox.width);
        var scaleX = (pitch.clip()[1][0] - pitch.clip()[0][0]) / 105;
        var scaleY = (pitch.clip()[1][1] - pitch.clip()[0][1]) / 68;

        if (pitch.rotate()) {
          scaleY = (pitch.clip()[1][1] - pitch.clip()[0][1]) / 105;
          scaleX = (pitch.clip()[1][0] - pitch.clip()[0][0]) / 68;
        }

        canvas.attr("width", m * scaleX).attr("height", n * scaleY).style("left", bbox.left + "px").style("top", bbox.top + "px");
        var gridInterpolator = bicubicInterpolate_2(grid, {
          extrapolate: true,
          scaleX: pitch.rotate() ? gx / n : gx / m,
          scaleY: pitch.rotate() ? gy / m : gy / n,
          translateX: -.5,
          translateY: -.5
        });
        var context = canvas.node().getContext("2d"),
            image = context.createImageData(m, n);
        var l = 0;

        for (var j = 0; j < n; ++j) {
          for (var i = 0; i < m; ++i) {
            var v;
            if (pitch.rotate()) v = gridInterpolator(n - j, i);else v = gridInterpolator(i, j);
            var c = d3Color.rgb(color(v || 0));
            image.data[l + 0] = c.r;
            image.data[l + 1] = c.g;
            image.data[l + 2] = c.b;
            image.data[l + 3] = 255;
            l += 4;
          }
        }

        context.putImageData(image, 0, 0);
      }
    });
  }

  chart.colorScale = function (_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };

  chart.selected = function (_) {
    if (!arguments.length) return selected;
    selected = _;
    return chart;
  };

  chart.enableInteraction = function (_) {
    if (!arguments.length) return enableInteraction;
    enableInteraction = Boolean(_);
    return chart;
  };

  chart.interpolate = function (_) {
    if (!arguments.length) return interpolated;
    interpolated = Boolean(_);
    return chart;
  };

  chart.parent_el = function (_) {
    if (!arguments.length) return parent_el;
    parent_el = _;
    return chart;
  };

  chart.onSelect = function (f) {
    onSelect = f;
    return chart;
  };

  chart.onDeselect = function (f) {
    onDeselect = f;
    return chart;
  };

  return chart;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var noop = {value: function() {}};

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || (t in _) || /[\s.]/.test(t)) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return {type: t, name: name};
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function(typename, callback) {
    var _ = this._,
        T = parseTypenames(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) if ((t = (typename = T[i]).type) && (t = get(_[t], typename.name))) return t;
      return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set(_[t], typename.name, callback);
      else if (callback == null) for (t in _) _[t] = set(_[t], typename.name, null);
    }

    return this;
  },
  copy: function() {
    var copy = {}, _ = this._;
    for (var t in _) copy[t] = _[t].slice();
    return new Dispatch(copy);
  },
  call: function(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) args[i] = arguments[i + 2];
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  },
  apply: function(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) t[i].value.apply(that, args);
  }
};

function get(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({name: name, value: callback});
  return type;
}

function nopropagation() {
  d3Selection.event.stopImmediatePropagation();
}

function noevent() {
  d3Selection.event.preventDefault();
  d3Selection.event.stopImmediatePropagation();
}

function nodrag(view) {
  var root = view.document.documentElement,
      selection = d3Selection.select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
}

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection = d3Selection.select(view).on("dragstart.drag", null);
  if (noclick) {
    selection.on("click.drag", noevent, true);
    setTimeout(function() { selection.on("click.drag", null); }, 0);
  }
  if ("onselectstart" in root) {
    selection.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

function constant(x) {
  return function() {
    return x;
  };
}

function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
  this.target = target;
  this.type = type;
  this.subject = subject;
  this.identifier = id;
  this.active = active;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this._ = dispatch;
}

DragEvent.prototype.on = function() {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !d3Selection.event.ctrlKey && !d3Selection.event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(d) {
  return d == null ? {x: d3Selection.event.x, y: d3Selection.event.y} : d;
}

function defaultTouchable() {
  return navigator.maxTouchPoints || ("ontouchstart" in this);
}

function d3Drag() {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = dispatch("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection) {
    selection
        .on("mousedown.drag", mousedowned)
      .filter(touchable)
        .on("touchstart.drag", touchstarted)
        .on("touchmove.drag", touchmoved)
        .on("touchend.drag touchcancel.drag", touchended)
        .style("touch-action", "none")
        .style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var gesture = beforestart("mouse", container.apply(this, arguments), d3Selection.mouse, this, arguments);
    if (!gesture) return;
    d3Selection.select(d3Selection.event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    nodrag(d3Selection.event.view);
    nopropagation();
    mousemoving = false;
    mousedownx = d3Selection.event.clientX;
    mousedowny = d3Selection.event.clientY;
    gesture("start");
  }

  function mousemoved() {
    noevent();
    if (!mousemoving) {
      var dx = d3Selection.event.clientX - mousedownx, dy = d3Selection.event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag");
  }

  function mouseupped() {
    d3Selection.select(d3Selection.event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(d3Selection.event.view, mousemoving);
    noevent();
    gestures.mouse("end");
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches = d3Selection.event.changedTouches,
        c = container.apply(this, arguments),
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(touches[i].identifier, c, d3Selection.touch, this, arguments)) {
        nopropagation();
        gesture("start");
      }
    }
  }

  function touchmoved() {
    var touches = d3Selection.event.changedTouches,
        n = touches.length, i, gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        noevent();
        gesture("drag");
      }
    }
  }

  function touchended() {
    var touches = d3Selection.event.changedTouches,
        n = touches.length, i, gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function() { touchending = null; }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches[i].identifier]) {
        nopropagation();
        gesture("end");
      }
    }
  }

  function beforestart(id, container, point, that, args) {
    var p = point(container, id), s, dx, dy,
        sublisteners = listeners.copy();

    if (!d3Selection.customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function() {
      if ((d3Selection.event.subject = s = subject.apply(that, args)) == null) return false;
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return true;
    })) return;

    return function gesture(type) {
      var p0 = p, n;
      switch (type) {
        case "start": gestures[id] = gesture, n = active++; break;
        case "end": delete gestures[id], --active; // nobreak
        case "drag": p = point(container, id), n = active; break;
      }
      d3Selection.customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
    };
  }

  drag.filter = function(_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant(!!_), drag) : filter;
  };

  drag.container = function(_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant(_), drag) : container;
  };

  drag.subject = function(_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant(_), drag) : subject;
  };

  drag.touchable = function(_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant(!!_), drag) : touchable;
  };

  drag.on = function() {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function(_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
}

/**
 * actions - draws a sequence of SPADL actions
 * on a pitch.
 *
 */

function actions (pitch) {
  var scale = 4;
  var showTooltip = false;
  var draggable = false;
  var teamColors = {};

  var onUpdate = function onUpdate() {
    return undefined;
  };
  /**
   * chart - constructor function.
   * Appends the plot to the g selection.
   *
   * @param g - d3 selection of elements to which the plot will be appended.
   */


  function chart(g) {
    g.each(function (data) {
      // Create the soccer pitch
      var actionsLayer = d3Selection.select(this).call(pitch).select("#above"); // Create an arrow symbol

      actionsLayer.append("svg:defs").append("svg:marker").attr("id", "triangle").attr("refX", 11).attr("refY", 6).attr("dy", 6).attr("markerWidth", 12).attr("markerHeight", 12).attr("orient", "auto").append("path").attr("d", "M 0 0 12 6 0 12 3 6");
      var dragHandler = d3Drag().on("start", function () {
        d3Selection.select(this).classed("active", true);
      }).on("drag", function (d) {
        var _d3Mouse = d3Selection.mouse(actionsLayer.node()),
            _d3Mouse2 = _slicedToArray(_d3Mouse, 2),
            x = _d3Mouse2[0],
            y = _d3Mouse2[1];

        var marker = d3Selection.select(this).attr("marker");
        d3Selection.select(this).attr("transform", "translate(" + x + "," + y + ")");
        var action = d3Selection.select("#action-".concat(d.action_id));

        if (marker === "marker-start") {
          action.select('line').attr("x1", x).attr("y1", y);
          var prev_action = d3Selection.select("#action-".concat(d.action_id - 1));
          prev_action.select('line').attr("x2", x).attr("y2", y);
        } else {
          action.select('line').attr("x2", x).attr("y2", y);
        }
      }).on("end", function (d) {
        var _d3Mouse3 = d3Selection.mouse(actionsLayer.node()),
            _d3Mouse4 = _slicedToArray(_d3Mouse3, 2),
            x = _d3Mouse4[0],
            y = _d3Mouse4[1];

        var marker = d3Selection.select(this).attr("marker");
        d3Selection.select(this).classed("active", false);
        var newData = data.slice();

        if (marker === "marker-start") {
          newData.find(function (a) {
            return a.action_id === d.action_id;
          })["start_x"] = x;
          newData.find(function (a) {
            return a.action_id === d.action_id;
          })["start_y"] = 68 - y;
          var prevAction = newData.find(function (a) {
            return a.action_id === d.action_id - 1;
          });

          if (prevAction) {
            prevAction["end_x"] = x;
            prevAction["end_y"] = 68 - y;
          }
        } else {
          newData.find(function (a) {
            return a.action_id === d.action_id;
          })["end_x"] = x;
          newData.find(function (a) {
            return a.action_id === d.action_id;
          })["end_y"] = 68 - y;
        }

        onUpdate(newData);
      }); // Select a unique color for each team

      var defaultColors = ["#FDB913", "#87CEEB"];

      var _iterator = _createForOfIteratorHelper(data),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var action = _step.value;

          if (action.team_id in teamColors === false) {
            if (Object.keys(teamColors).length >= 2) throw "You specified ids of teams that do not occur in the data!";else teamColors[action.team_id] = defaultColors[Object.keys(teamColors).length];
          }
        } // Draw the actions

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var update = actionsLayer.selectAll('g.action').data(data);
      update.each(function (d, i) {
        d3Selection.select(this).selectAll("*").remove();
        var action = d3Selection.select(this).attr("class", "action").attr('id', "action-".concat(d.action_id)).call(actiontypePlotFn[d.type_id]["plot"], d, i + 1, teamColors[d.team_id], scale);
        action.selectAll('g.symbol').on('mouseover', function (d) {
          return showTooltip && showTooltip.show(d);
        }).on('mouseout', function () {
          return showTooltip && showTooltip.hide();
        });
      });
      update.enter().append('g').attr("class", "action").each(function (d, i) {
        var action = d3Selection.select(this).attr("class", "action").attr('id', "action-".concat(d.action_id)).call(actiontypePlotFn[d.type_id]["plot"], d, i + 1, teamColors[d.team_id], scale);
        action.selectAll('g.symbol').on('mouseover', function (d) {
          return showTooltip && showTooltip.show(d);
        }).on('mouseout', function () {
          return showTooltip && showTooltip.hide();
        });
      });
      var last_action = actionsLayer.selectAll(".action:last-of-type");
      var mend = last_action.selectAll("g.marker-end").data(function (d) {
        return [d];
      }).enter().append('g').attr('class', 'marker marker-end').attr('marker', 'marker-end').attr('transform', function (d) {
        return "translate(" + d.end_x + "," + (68 - d.end_y) + ")";
      });
      mend.append('circle').attr('stroke-width', 0).attr('fill', "#000").attr('opacity', 0).attr('r', 2);
      update.exit().remove();
      if (draggable) dragHandler(actionsLayer.selectAll("g.marker"));
    });
  }

  chart.showTooltip = function (_) {
    if (!arguments.length) return showTooltip;
    showTooltip = _;
    return chart;
  };

  chart.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return chart;
  };

  chart.draggable = function (_) {
    if (!arguments.length) return draggable;
    draggable = Boolean(_);
    return chart;
  };

  chart.teamColors = function (_) {
    if (!arguments.length) return teamColors;
    teamColors = _;
    return chart;
  };

  chart.onUpdate = function (f) {
    if (!arguments.length) return onUpdate;
    onUpdate = f;
    return chart;
  };

  return chart;
}
var actiontypePlotFn = [{
  "label": "Pass",
  "plot": plotPass,
  "symbol": symbolPass
}, {
  "label": "Cross",
  "plot": plotPass,
  "symbol": symbolPass
}, {
  "label": "Throw in",
  "plot": plotPass,
  "symbol": symbolPass
}, {
  "label": "Freekick (cross)",
  "plot": plotPass,
  "symbol": symbolPass
}, {
  "label": "Freekick (short)",
  "plot": plotPass,
  "symbol": symbolPass
}, {
  "label": "Corner (cross)",
  "plot": plotPass,
  "symbol": symbolPass
}, {
  "label": "Corner (short)",
  "plot": plotPass,
  "symbol": symbolPass
}, {
  "label": "Dribble",
  "plot": plotDribble,
  "symbol": symbolDribble
}, {
  "label": "Foul",
  "plot": plotFoulWon,
  "symbol": symbolFoulWon
}, {
  "label": "Tackle",
  "plot": plotBlock,
  "symbol": symbolBlock
}, {
  "label": "Interception",
  "plot": plotBlock,
  "symbol": symbolBlock
}, {
  "label": "Shot",
  "plot": plotShot,
  "symbol": symbolShot
}, {
  "label": "Penalty",
  "plot": plotShot,
  "symbol": symbolShot
}, {
  "label": "Freekick (shot)",
  "plot": plotShot,
  "symbol": symbolShot
}, {
  "label": "Save",
  "plot": plotBlock,
  "symbol": symbolBlock
}, {
  "label": "Claim",
  "plot": plotBlock,
  "symbol": symbolBlock
}, {
  "label": "Punch",
  "plot": plotClearance,
  "symbol": symbolClearance
}, {
  "label": "Pick up",
  "plot": plotBlock,
  "symbol": symbolBlock
}, {
  "label": "Clearance",
  "plot": plotClearance,
  "symbol": symbolClearance
}, {
  "label": "Bad touch",
  "plot": plotBlock,
  "symbol": symbolBlock
}, {
  "label": "-",
  "plot": function plot() {
    return null;
  },
  "symbol": function symbol() {
    return null;
  }
}, {
  "label": "Carry",
  "plot": plotCarry,
  "symbol": function symbol() {
    return null;
  }
}, {
  "label": "Goal kick",
  "plot": plotPass,
  "symbol": symbolPass
}];

function plotShot(g, d, i, color, scale) {
  var strokeWidth = .1 * scale;
  var shot = g.classed('shot', true); // .on('mouseover', showDetail)
  // .on('mouseout', hideDetail)
  // line

  shot.append("line").attr("x1", function (d) {
    return d.start_x;
  }).attr("y1", function (d) {
    return 68 - d.start_y;
  }).attr("x2", function (d) {
    return d.end_x;
  }).attr("y2", function (d) {
    return 68 - d.end_y;
  }).attr("stroke-width", strokeWidth).attr("stroke", "black").attr("marker-end", "url(#triangle)");
  var mstart = shot.append('g').attr('class', 'marker').attr('marker', 'marker-start').attr('transform', function (d) {
    return "translate(" + d.start_x + "," + (68 - d.start_y) + ")";
  });
  mstart.call(symbolShot, d, i, color, scale);
}

function symbolShot(g, d, i, color, scale) {
  var radius = 1 * scale;
  var strokeWidth = .1 * scale;
  var shot = g.append('g').attr('class', 'symbol shot');
  shot.append('circle').attr('r', radius).attr('stroke-width', strokeWidth).attr('stroke', "grey").attr('fill', color);
  shot.append("text").attr('text-anchor', 'middle').attr("dominant-baseline", "central").style('font-size', radius * .8 + 'px').attr('fill', d3Color.hsl(color).l >= 0.6 ? "#000" : "#fff").text(i);
}

function plotPass(g, d, i, color, scale) {
  var strokeWidth = .1 * scale;
  var pass = g.classed('pass', true); // .on('mouseover', showDetail)
  // .on('mouseout', hideDetail)
  // line

  pass.append("line").attr("x1", function (d) {
    return d.start_x;
  }).attr("y1", function (d) {
    return 68 - d.start_y;
  }).attr("x2", function (d) {
    return d.end_x;
  }).attr("y2", function (d) {
    return 68 - d.end_y;
  }).attr("stroke-width", strokeWidth).attr("stroke", "#000").attr("marker-end", "url(#triangle)"); // start point

  var mstart = pass.append('g').attr('class', 'marker').attr('marker', 'marker-start').attr('transform', function (d) {
    return "translate(" + d.start_x + "," + (68 - d.start_y) + ")";
  });
  mstart.call(symbolPass, d, i, color, scale);
}

function symbolPass(g, d, i, color, scale) {
  var radius = 1 * scale;
  var strokeWidth = .1 * scale;
  var pass = g.append('g').attr('class', 'symbol pass');
  pass.append('circle').attr('r', radius).attr('stroke-width', strokeWidth).attr('stroke', color).attr('fill', "#fff");
  pass.append("text").attr('text-anchor', 'middle').attr("dominant-baseline", "central").style('font-size', radius * .8 + 'px').attr('fill', "#000").text(i);
}

function plotDribble(g, d, i, color, scale) {
  var strokeWidth = .1 * scale;
  var dribble = g.classed('dribble', true); // .on('mouseover', showDetail)
  // .on('mouseout', hideDetail)
  // line

  dribble.append("line").attr("x1", function (d) {
    return d.start_x;
  }).attr("y1", function (d) {
    return 68 - d.start_y;
  }).attr("x2", function (d) {
    return d.end_x;
  }).attr("y2", function (d) {
    return 68 - d.end_y;
  }).attr("stroke-width", strokeWidth).style("stroke-dasharray", "1,1").attr("stroke", "black").attr("marker-end", "url(#triangle)");
  var mstart = dribble.append('g').attr('class', 'marker').attr('marker', 'marker-start').attr('transform', function (d) {
    return "translate(" + d.start_x + "," + (68 - d.start_y) + ")";
  });
  mstart.call(symbolDribble, d, i, color, scale);
}

function symbolDribble(g, d, i, color, scale) {
  var radius = 1 * scale;
  var strokeWidth = .1 * scale;
  var dribble = g.append('g').attr('class', 'symbol dribble');
  dribble.append('circle').attr('r', radius).attr('stroke-width', strokeWidth).attr('stroke', color).attr('fill', "#fff");
  dribble.append("text").attr('text-anchor', 'middle').attr("dominant-baseline", "central").style('font-size', radius * .8 + 'px').attr('fill', "#000").text(i);
}

function plotCarry(g, d, i, color, scale) {
  var strokeWidth = .05;
  var radius = 1 * scale;
  var carry = g.classed('carry', true); // line

  carry.append("line").attr("x1", function (d) {
    return d.start_x;
  }).attr("y1", function (d) {
    return 68 - d.start_y;
  }).attr("x2", function (d) {
    return d.end_x;
  }).attr("y2", function (d) {
    return 68 - d.end_y;
  }).attr("stroke-width", strokeWidth).style("stroke-dasharray", "0.4,0.4").attr("stroke", "grey");
  var mstart = carry.append('g').attr('class', 'marker').attr('marker', 'marker-start').attr('transform', function (d) {
    return "translate(" + d.start_x + "," + (68 - d.start_y) + ")";
  });
  mstart.append('circle').attr('stroke-width', 0).attr('fill', "#000").attr('opacity', 0).attr('r', radius);
}

function plotClearance(g, d, i, color, scale) {
  var clearance = g.classed('clearance', true); // start point

  var mstart = clearance.append('g').attr('class', 'marker').attr('marker', 'marker-start').attr('transform', function (d) {
    return "translate(" + d.start_x + "," + (68 - d.start_y) + ")";
  });
  mstart.call(symbolClearance, d, i, color, scale);
}

function symbolClearance(g, d, i, color, scale) {
  var size = 2 * scale * scale;
  var strokeWidth = .1 * scale;
  var clearance = g.append('g').attr('class', 'symbol clearance');
  var triangle = d3Shape.symbol().size(size).type(d3Shape.symbolTriangle);
  clearance.append("path").attr('fill', color).attr('stroke', 'grey').attr('stroke-width', strokeWidth).attr("d", triangle);
  clearance.append("text").attr("dominant-baseline", "central").style("text-anchor", "middle").style('font-size', scale * .8 + 'px').attr('fill', d3Color.hsl(color).l >= 0.6 ? "#000" : "#fff").text(i);
}

function plotBlock(g, d, i, color, scale) {
  var block = g.classed('block', true); // start point

  var mstart = block.append('g').attr('class', 'marker').attr('marker', 'marker-start').attr('transform', function (d) {
    return "translate(" + d.start_x + "," + (68 - d.start_y) + ")";
  });
  mstart.call(symbolBlock, d, i, color, scale);
}

function symbolBlock(g, d, i, color, scale) {
  var size = 2 * scale;
  var strokeWidth = .1 * scale;
  var block = g.append('g').attr('class', 'symbol block');
  block.append('rect').attr('x', -size / 2).attr('y', -size / 2).attr('width', size).attr('height', size).attr('stroke-width', strokeWidth).attr('stroke', "grey").attr('fill', color);
  block.append("text").attr('text-anchor', 'middle').attr("dominant-baseline", "central").style("text-anchor", "middle").style('font-size', size * .4 + 'px').attr('fill', d3Color.hsl(color).l >= 0.6 ? "#000" : "#fff").text(i);
}

function plotFoulWon(g, d, i, color, scale) {
  var foul = g.classed('foul', true); // start point

  var mstart = foul.append('g').attr('class', 'marker').attr('marker', 'marker-start').attr('transform', function (d) {
    return "translate(" + d.start_x + "," + (68 - d.start_y) + ")";
  });
  mstart.call(symbolFoulWon, d, i, color, scale);
}

function symbolFoulWon(g, d, i, color, scale) {
  var size = 2 * scale * scale;
  var strokeWidth = .1 * scale;
  var foul = g.append('g').attr('class', 'symbol foul');
  var symbol = d3Shape.symbol().size(size).type(d3Shape.symbolCross);
  foul.append("path").attr('fill', color).attr('stroke', 'grey').attr('stroke-width', strokeWidth).attr("d", symbol);
  foul.append("text").attr("dominant-baseline", "central").style("text-anchor", "middle").style('font-size', scale * .8 + 'px').attr('fill', d3Color.hsl(color).l >= 0.6 ? "#000" : "#fff").text(i);
}

function actions_table () {
  var scale = 9,
      tableColumns = {
    "symbol": "",
    "team_name": "Team",
    "player_name": "Player",
    "type_id": "Type",
    "result_id": "Result"
  },
      teamColors = {};

  function tabulate(g, columns) {
    g.html("");
    var table = g.append("table"),
        thead = table.append("thead"),
        tbody = table.append("tbody"); // append the header row

    thead.append("tr").selectAll("th").data(Object.values(columns)).enter().append("th").text(function (column) {
      return column;
    });
    return tbody;
  } // For each small multiple…


  function chart(g) {
    g.each(function (data) {
      // Select a unique color for each team
      var defaultColors = ["#FDB913", "#87CEEB"];

      var _iterator = _createForOfIteratorHelper(data),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var action = _step.value;

          if (action.team_id in teamColors === false) {
            if (Object.keys(teamColors).length >= 2) throw "You specified ids of teams that do not occur in the data!";else teamColors[action.team_id] = defaultColors[Object.keys(teamColors).length];
          }
        } // create the table

      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var elTable = d3Selection.select(this).attr('class', css.actions_table);
      var tbody = tabulate(elTable, tableColumns); // Update the table

      var uTable = tbody.selectAll("tr").data(data);
      var rows = uTable.enter().append("tr").attr('id', function (d) {
        return d.action_id;
      });
      uTable.exit().remove(); // create a cell in each row for each column

      rows.selectAll("td").data(function (row, i) {
        return Object.keys(tableColumns).map(function (column) {
          return {
            column: column,
            value: row[column],
            i: i,
            data: row
          };
        });
      }).enter().append("td").each(function (d) {
        if (d.column === "symbol") {
          d3Selection.select(this).attr("class", d.column).style("text-align", "center").append('svg').attr("height", 20).attr("width", 20).call(actiontypePlotFn[d.data.type_id]["symbol"], d.data, d.i + 1, teamColors[d.data.team_id], scale).select('g').attr('transform', 'translate(10,10)');
        } else {
          d3Selection.select(this).attr("class", d.column).html(function (d) {
            if (d.column === "type_id") {
              return spadlActionTypes[+d.value]['label'];
            } else if (d.column === "result_id") {
              return spadlResults[+d.value]['label'];
            } else if (d.column === "bodypart_id") {
              return spadlBodyparts[+d.value]['label'];
            } else {
              return d.value;
            }
          });
        }
      });
    });
  }

  chart.tableColumns = function (d) {
    if (!arguments.length) return tableColumns;
    tableColumns = d;
    return chart;
  };

  chart.scale = function (_) {
    if (!arguments.length) return scale;
    scale = _;
    return chart;
  };

  chart.teamColors = function (_) {
    if (!arguments.length) return teamColors;
    teamColors = _;
    return chart;
  };

  return chart;
}

var pug = (function(exports) {

  var pug_has_own_property = Object.prototype.hasOwnProperty;

  /**
   * Merge two attribute objects giving precedence
   * to values in object `b`. Classes are special-cased
   * allowing for arrays and merging/joining appropriately
   * resulting in a string.
   *
   * @param {Object} a
   * @param {Object} b
   * @return {Object} a
   * @api private
   */

  exports.merge = pug_merge;
  function pug_merge(a, b) {
    if (arguments.length === 1) {
      var attrs = a[0];
      for (var i = 1; i < a.length; i++) {
        attrs = pug_merge(attrs, a[i]);
      }
      return attrs;
    }

    for (var key in b) {
      if (key === 'class') {
        var valA = a[key] || [];
        a[key] = (Array.isArray(valA) ? valA : [valA]).concat(b[key] || []);
      } else if (key === 'style') {
        var valA = pug_style(a[key]);
        valA = valA && valA[valA.length - 1] !== ';' ? valA + ';' : valA;
        var valB = pug_style(b[key]);
        valB = valB && valB[valB.length - 1] !== ';' ? valB + ';' : valB;
        a[key] = valA + valB;
      } else {
        a[key] = b[key];
      }
    }

    return a;
  }
  /**
   * Process array, object, or string as a string of classes delimited by a space.
   *
   * If `val` is an array, all members of it and its subarrays are counted as
   * classes. If `escaping` is an array, then whether or not the item in `val` is
   * escaped depends on the corresponding item in `escaping`. If `escaping` is
   * not an array, no escaping is done.
   *
   * If `val` is an object, all the keys whose value is truthy are counted as
   * classes. No escaping is done.
   *
   * If `val` is a string, it is counted as a class. No escaping is done.
   *
   * @param {(Array.<string>|Object.<string, boolean>|string)} val
   * @param {?Array.<string>} escaping
   * @return {String}
   */
  exports.classes = pug_classes;
  function pug_classes_array(val, escaping) {
    var classString = '', className, padding = '', escapeEnabled = Array.isArray(escaping);
    for (var i = 0; i < val.length; i++) {
      className = pug_classes(val[i]);
      if (!className) continue;
      escapeEnabled && escaping[i] && (className = pug_escape(className));
      classString = classString + padding + className;
      padding = ' ';
    }
    return classString;
  }
  function pug_classes_object(val) {
    var classString = '', padding = '';
    for (var key in val) {
      if (key && val[key] && pug_has_own_property.call(val, key)) {
        classString = classString + padding + key;
        padding = ' ';
      }
    }
    return classString;
  }
  function pug_classes(val, escaping) {
    if (Array.isArray(val)) {
      return pug_classes_array(val, escaping);
    } else if (val && typeof val === 'object') {
      return pug_classes_object(val);
    } else {
      return val || '';
    }
  }

  /**
   * Convert object or string to a string of CSS styles delimited by a semicolon.
   *
   * @param {(Object.<string, string>|string)} val
   * @return {String}
   */

  exports.style = pug_style;
  function pug_style(val) {
    if (!val) return '';
    if (typeof val === 'object') {
      var out = '';
      for (var style in val) {
        /* istanbul ignore else */
        if (pug_has_own_property.call(val, style)) {
          out = out + style + ':' + val[style] + ';';
        }
      }
      return out;
    } else {
      return val + '';
    }
  }
  /**
   * Render the given attribute.
   *
   * @param {String} key
   * @param {String} val
   * @param {Boolean} escaped
   * @param {Boolean} terse
   * @return {String}
   */
  exports.attr = pug_attr;
  function pug_attr(key, val, escaped, terse) {
    if (val === false || val == null || !val && (key === 'class' || key === 'style')) {
      return '';
    }
    if (val === true) {
      return ' ' + (terse ? key : key + '="' + key + '"');
    }
    var type = typeof val;
    if ((type === 'object' || type === 'function') && typeof val.toJSON === 'function') {
      val = val.toJSON();
    }
    if (typeof val !== 'string') {
      val = JSON.stringify(val);
      if (!escaped && val.indexOf('"') !== -1) {
        return ' ' + key + '=\'' + val.replace(/'/g, '&#39;') + '\'';
      }
    }
    if (escaped) val = pug_escape(val);
    return ' ' + key + '="' + val + '"';
  }
  /**
   * Render the given attributes object.
   *
   * @param {Object} obj
   * @param {Object} terse whether to use HTML5 terse boolean attributes
   * @return {String}
   */
  exports.attrs = pug_attrs;
  function pug_attrs(obj, terse){
    var attrs = '';

    for (var key in obj) {
      if (pug_has_own_property.call(obj, key)) {
        var val = obj[key];

        if ('class' === key) {
          val = pug_classes(val);
          attrs = pug_attr(key, val, false, terse) + attrs;
          continue;
        }
        if ('style' === key) {
          val = pug_style(val);
        }
        attrs += pug_attr(key, val, false, terse);
      }
    }

    return attrs;
  }
  /**
   * Escape the given string of `html`.
   *
   * @param {String} html
   * @return {String}
   * @api private
   */

  var pug_match_html = /["&<>]/;
  exports.escape = pug_escape;
  function pug_escape(_html){
    var html = '' + _html;
    var regexResult = pug_match_html.exec(html);
    if (!regexResult) return _html;

    var result = '';
    var i, lastIndex, escape;
    for (i = regexResult.index, lastIndex = 0; i < html.length; i++) {
      switch (html.charCodeAt(i)) {
        case 34: escape = '&quot;'; break;
        case 38: escape = '&amp;'; break;
        case 60: escape = '&lt;'; break;
        case 62: escape = '&gt;'; break;
        default: continue;
      }
      if (lastIndex !== i) result += html.substring(lastIndex, i);
      lastIndex = i + 1;
      result += escape;
    }
    if (lastIndex !== i) return result + html.substring(lastIndex, i);
    else return result;
  }
  /**
   * Re-throw the given `err` in context to the
   * the pug in `filename` at the given `lineno`.
   *
   * @param {Error} err
   * @param {String} filename
   * @param {String} lineno
   * @param {String} str original source
   * @api private
   */

  exports.rethrow = pug_rethrow;
  function pug_rethrow(err, filename, lineno, str){
    if (!(err instanceof Error)) throw err;
    if ((typeof window != 'undefined' || !filename) && !str) {
      err.message += ' on line ' + lineno;
      throw err;
    }
    try {
      str = str || require('fs').readFileSync(filename, 'utf8');
    } catch (ex) {
      pug_rethrow(err, null, lineno);
    }
    var context = 3
      , lines = str.split('\n')
      , start = Math.max(lineno - context, 0)
      , end = Math.min(lines.length, lineno + context);

    // Error context
    var context = lines.slice(start, end).map(function(line, i){
      var curr = i + start + 1;
      return (curr == lineno ? '  > ' : '    ')
        + curr
        + '| '
        + line;
    }).join('\n');

    // Alter exception message
    err.path = filename;
    err.message = (filename || 'Pug') + ':' + lineno
      + '\n' + context + '\n\n' + err.message;
    throw err;
  }
  return exports
})({});

function actionTooltipFn(locals) {var pug_html = "", pug_interp;var pug_debug_filename, pug_debug_line;try {var pug_debug_sources = {};
;var locals_for_with = (locals || {});(function (bodypart, end, player, result, start, team, time, type) {
pug_html = pug_html + "\u003Ctable\u003E";
pug_html = pug_html + "\u003Ctr\u003E";
pug_html = pug_html + "\u003Cth colspan=\"2\"\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = type) ? "" : pug_interp)) + "\u003C\u002Fth\u003E\u003C\u002Ftr\u003E";
pug_html = pug_html + "\u003Ctr\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + "Player\u003C\u002Ftd\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = player) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
pug_html = pug_html + "\u003Ctr\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + "Team\u003C\u002Ftd\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = team) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
pug_html = pug_html + "\u003Ctr\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + "Result\u003C\u002Ftd\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = result) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
pug_html = pug_html + "\u003Ctr\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + "Body part\u003C\u002Ftd\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = bodypart) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
pug_html = pug_html + "\u003Ctr\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + "Time\u003C\u002Ftd\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + (pug.escape(null == (pug_interp = Math.floor(time / 60)) ? "" : pug_interp));
pug_html = pug_html + " min ";
pug_html = pug_html + (pug.escape(null == (pug_interp = time % 60) ? "" : pug_interp));
pug_html = pug_html + " sec\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
pug_html = pug_html + "\u003Ctr\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + "Start\u003C\u002Ftd\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + "x=";
pug_html = pug_html + (pug.escape(null == (pug_interp = start.x.toFixed(2)) ? "" : pug_interp));
pug_html = pug_html + " , y=";
pug_html = pug_html + (pug.escape(null == (pug_interp = start.y.toFixed(2)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E";
pug_html = pug_html + "\u003Ctr\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + "End\u003C\u002Ftd\u003E";
pug_html = pug_html + "\u003Ctd\u003E";
pug_html = pug_html + "x=";
pug_html = pug_html + (pug.escape(null == (pug_interp = end.x.toFixed(2)) ? "" : pug_interp));
pug_html = pug_html + " , y=";
pug_html = pug_html + (pug.escape(null == (pug_interp = end.y.toFixed(2)) ? "" : pug_interp)) + "\u003C\u002Ftd\u003E\u003C\u002Ftr\u003E\u003C\u002Ftable\u003E";
}.call(this,"bodypart" in locals_for_with?locals_for_with.bodypart:typeof bodypart!=="undefined"?bodypart:undefined,"end" in locals_for_with?locals_for_with.end:typeof end!=="undefined"?end:undefined,"player" in locals_for_with?locals_for_with.player:typeof player!=="undefined"?player:undefined,"result" in locals_for_with?locals_for_with.result:typeof result!=="undefined"?result:undefined,"start" in locals_for_with?locals_for_with.start:typeof start!=="undefined"?start:undefined,"team" in locals_for_with?locals_for_with.team:typeof team!=="undefined"?team:undefined,"time" in locals_for_with?locals_for_with.time:typeof time!=="undefined"?time:undefined,"type" in locals_for_with?locals_for_with.type:typeof type!=="undefined"?type:undefined));} catch (err) {pug.rethrow(err, pug_debug_filename, pug_debug_line, pug_debug_sources[pug_debug_filename]);}return pug_html;}

function action_tooltip () {
  var tooltip = d3Selection.select("#tooltip");

  function chart(g) {
    if (!tooltip.size()) {
      tooltip = g.append("div").attr("class", css.tooltip).attr("id", "tooltip");
    }
  }

  chart.show = function (d) {
    tooltip.html(actionTooltipFn({
      type: spadlActionTypes[d.type_id].label,
      player: d.player_name || d.player_id,
      team: d.team_name || d.team_id,
      result: spadlResults[d.result_id].label,
      bodypart: spadlBodyparts[d.bodypart_id].label,
      time: d.time_seconds,
      start: {
        x: d.start_x,
        y: d.start_y
      },
      end: {
        x: d.end_x,
        y: d.end_y
      }
    }));
    tooltip.style("opacity", .95).style("left", d3Selection.event.pageX + "px").style("top", d3Selection.event.pageY + "px");
    return chart;
  };

  chart.hide = function () {
    tooltip.style("opacity", 0);
    return chart;
  };

  return chart;
}

function scoreline () {
  var height = 23;
  var team_width = 45;
  var score_width = 40;
  var clock_width = 40;
  var width = 2 * team_width + score_width + clock_width;
  var teams = [{
    "label": "H",
    "color": "#87CEEB"
  }, {
    "label": "A",
    "color": "#FDB913"
  }];
  var score = [0, 0];
  var updateScore;
  var clock = 0;
  var updateClock;

  function chart(g) {
    g.each(function () {
      var elem = d3Selection.select(this); // Home team

      var elem_team1 = elem.append('g');
      elem_team1.append('rect').attr("x", 0).attr("y", 0).attr("width", team_width).attr("height", height).attr('fill', teams[0].color);
      elem_team1.append('text').text(teams[0].label).attr("x", 5).attr("y", height / 2).attr("dominant-baseline", "middle").attr("fill", "white"); // Away time

      var elem_team2 = elem.append('g').attr('transform', "translate(".concat(team_width + score_width, ", 0)"));
      elem_team2.append('rect').attr("x", 0).attr("y", 0).attr("width", team_width + 6).attr("height", height).attr('fill', teams[1].color);
      elem_team2.append('text').text(teams[1].label).attr("x", 5).attr("y", height / 2).attr("dominant-baseline", "middle").attr("fill", "white"); // Score

      elem.append('text').attr("id", "scoreline").text("".concat(score[0], " : ").concat(score[1])).attr("x", 5 + team_width).attr("y", height / 2).attr("dominant-baseline", "middle").attr("fill", "black"); // Clock

      var elem_clock = elem.append('g');
      elem_clock.append('polyline').attr('points', "".concat(width - clock_width, ",").concat(height / 2, "\n                         ").concat(width - clock_width + 6, ",0\n                         ").concat(width, ",0\n                         ").concat(width, ",").concat(height, "\n                         ").concat(width - clock_width + 6, ",").concat(height)).attr("fill", "white");
      elem_clock.append('text').attr("id", "clock").text("".concat(clock, "'")).attr("x", width - clock_width + 15).attr("y", height / 2).attr("dominant-baseline", "middle").attr("fill", "black"); // Background

      elem.append('rect').attr("x", 0).attr("y", 0).attr("width", width).attr("height", height).attr('fill', 'rgba(0,0,0,0)').attr('stroke', 'black').attr('stroke-width', .5);

      updateClock = function updateClock() {
        elem.select('#clock').text("".concat(clock, "'"));
      };

      updateScore = function updateScore() {
        elem.select('#scoreline').text("".concat(score[0], " : ").concat(score[1]));
      };
    });
  }

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = +_;
    return chart;
  };

  chart.teams = function (value) {
    if (!arguments.length) return teams;
    teams = value;
    return chart;
  };

  chart.score = function (value) {
    if (!arguments.length) return score;
    score = value;
    if (typeof updateScore === 'function') updateScore();
    return chart;
  };

  chart.clock = function (value) {
    if (!arguments.length) return clock;
    clock = value;
    if (typeof updateClock === 'function') updateClock();
    return chart;
  };

  return chart;
}

function header () {
  var hed = undefined;
  var subhed = undefined;
  var img = undefined;

  function chart(g) {
    g.each(function () {
      var header = d3Selection.select(this).append('g').attr('id', 'header').attr('class', css.header);
      var defs = header.append("defs").attr("id", "imgdefs");
      var imgpattern = defs.append("pattern").attr("id", "imgpattern").attr("height", 1).attr("width", 1).attr("x", "0").attr("y", "0");
      imgpattern.append("image").attr("x", 0).attr("y", 10).attr("height", 80).attr("xlink:href", img);
      header.append("circle").attr("class", css.circle).attr("r", 40).attr("cy", 50).attr("cx", 50).attr("fill", "url(#imgpattern)");
      header.append('text').attr("class", css.h2).attr("x", 110).attr("y", 40).text(subhed);
      header.append('text').attr("class", css.h1).attr("x", 110).attr("y", 80).attr("font-weight", 'bold').text(hed);
    });
  }

  chart.hed = function (_) {
    if (!arguments.length) return hed;
    hed = _;
    return chart;
  };

  chart.subhed = function (_) {
    if (!arguments.length) return subhed;
    subhed = _;
    return chart;
  };

  chart.img = function (_) {
    if (!arguments.length) return img;
    img = _;
    return chart;
  };

  return chart;
}

function header_match () {
  var hed = "Premier League";
  var logo_home = undefined;
  var logo_away = undefined;
  var score = [0, 0];

  function chart(g) {
    g.each(function () {
      var scoreboard = d3Selection.select(this).append('g').attr('id', 'scoreboard').attr('class', '.hed');
      scoreboard.append("svg:image").attr("xlink:href", logo_home).attr("width", 40).attr("x", 0).attr("y", 25);
      scoreboard.append("svg:image").attr("xlink:href", logo_away).attr("width", 40).attr("x", 130).attr("y", 25);
      scoreboard.append('text').attr("x", 0).attr("y", 10).style("font-size", "16px").style('fill', 'grey').text(hed);
      scoreboard.append('text').attr("x", 55).attr("y", 55).attr("font-weight", 'bold').style("font-size", "32px").style('fill', 'black').text("".concat(score[0], " : ").concat(score[1]));
    });
  }

  chart.hed = function (_) {
    if (!arguments.length) return hed;
    hed = _;
    return chart;
  };

  chart.logoHome = function (_) {
    if (!arguments.length) return logo_home;
    logo_home = _;
    return chart;
  };

  chart.logoAway = function (_) {
    if (!arguments.length) return logo_away;
    logo_away = _;
    return chart;
  };

  chart.score = function (_) {
    if (!arguments.length) return score;
    score = _;
    return chart;
  };

  return chart;
}

exports.actionTooltip = action_tooltip;
exports.actions = actions;
exports.actionsTable = actions_table;
exports.grid = grid;
exports.header = header;
exports.heatmap = heatmap;
exports.matchHeader = header_match;
exports.pitch = pitch;
exports.rectbin = rectbin;
exports.scoreline = scoreline;

Object.defineProperty(exports, '__esModule', { value: true });

})));
