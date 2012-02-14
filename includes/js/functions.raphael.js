Raphael.fn.center = function(elem) {  
  var x = elem.attr('x');
  var y = elem.attr('y');
  var width = elem.attr('width');
  var height = elem.attr('height');
  
  var cx = x + (width / 2);
  var cy = y + (height / 2);
  
  return { cx: cx, cy: cy };
};

Raphael.fn.anchors = function(elem) {
  var nw = {
    x: elem.attr('x'),
    y: elem.attr('y')
  };
  var n = {
    x: this.center(elem).cx,
    y: elem.attr('y')
  };
  var ne = {
    x: elem.attr('x') + elem.attr('width'),
    y: elem.attr('y')
  };
  var e = {
    x: elem.attr('x') + elem.attr('width'),
    y: this.center(elem).cy
  };
  var se = {
    x: elem.attr('x') + elem.attr('width'),
    y: elem.attr('y') + elem.attr('height')
  };
  var s = {
    x: this.center(elem).cx,
    y: elem.attr('y') + elem.attr('height')
  };
  var sw = {
    x: elem.attr('x'),
    y: elem.attr('y') + elem.attr('height')
  };
  var w = {
    x: elem.attr('x'),
    y: this.center(elem).cy
  };
  
  return {
    nw: nw,
    n: n,
    ne: ne,
    e: e,
    se: se,
    s: s,
    sw: sw,
    w: w
  };
};

Raphael.fn.message = function(txt) {
  var fontSize = 14;
  
  var text = this.text(this.width / 2, fontSize, txt);
  
  var rw = (txt.length * fontSize / 2) + fontSize;
  var rh = 2.5 * fontSize;
  var rx = (this.width / 2) - (rw / 2);
  var ry = fontSize / -2;
    
  var rect = this.rect(rx, ry, rw, rh, fontSize / 2);
  
  text.attr({
    'font': fontSize + 'px Signika Negative'
  });
  
  rect.attr({
    'fill': '#ffc40d',
    'stroke': 'transparent'
  });
  
  rect.text = text;
  rect.toFront();
  text.toFront();
  
  return rect;
};

Raphael.fn.line = function(start, end) {
  var x1 = this.center(start).cx;
  var y1 = this.center(start).cy;
  var x2 = this.center(end).cx;
  var y2 = this.center(end).cy;
  
  var path = this.path('M' + x1 + ',' + y1 + ',' + x2 + ',' + y2);
  
  path.coords = {
    x1: x1,
    y1: y1,
    x2: x2,
    y2: y2
  };
  
  return path;
};

Raphael.fn.triangle = function(point, height) {
  var str = 'M0,0,' + (height*2) + ',0,' + height + ',' + height 
    + ' z';
  
  var path = this.path(str);
  
  return path;
};

Raphael.fn.fadeOut = function(item) {
  var faded = .05;
  
  this.highlighted = item;
  
  for(var i in this.allShapes) {
    var s = this.allShapes[i];
    
    if(s.kind == 'place')
      continue;
      
    s.attr({
      opacity: faded
    });
    
    s.text.attr({
      opacity: faded
    });
  }
  
  for(var j in this.allLinks) {
    var l = this.allLinks[j];
    l.attr({
      opacity: faded
    });
    
    l.arrow.attr({
      opacity: faded
    });
    
    l.hideLabel();
    if(l.selected != null) {
      l.selected.remove();
      l.selected = null;
    }
  }
  
  this.faded = true;
};

Raphael.fn.fadeIn = function() {
  var faded = 1;

  this.highlighted = null;
  
  if(this.labels != null)
    this.labels.remove();

  for(var i in this.allShapes) {
    var s = this.allShapes[i];

    if(s.kind == 'place')
      continue;
      
    s.attr({
      opacity: faded
    });
    
    s.text.attr({
      opacity: faded
    });
  }

  for(var j in this.allLinks) {
    var l = this.allLinks[j];
    l.animate({
      opacity: faded
    }, 500, '>');
    
    if(l.arrow != null) {
      l.arrow.attr({
        opacity: faded
      });
    }
    
    if(l.hideLabel != null)    
      l.hideLabel();
    
    if(l.selected != null) {
      l.selected.remove();
      l.selected = null;
    }
  }
  
  this.faded = false;
};

Raphael.fn.trapezoid = function(shape, kind) {
  var x = shape.attr('x');
  var y = shape.attr('y');
  var w = shape.attr('width');
  var h = shape.attr('height');
  
  var x1 = x;
  var x2;
  var x3;
  
  if(kind == 'increases') {
    x2 = x1 + w;
    x3 = x2;
  } else {
    x2 = x1;
    x3 = x2 + w;
  }
  
  var y1 = y + shape.attr('r');
  
  var th = h / 2.0;
  var ty = y - th + shape.attr('r');
  
  var p1 = {x: x1, y: y1};
  var p2 = {x: x2, y: ty};
  var p3 = {x: x3, y: y1};
  
  var path = this.buildPath([p1, p2, p3]);
  
  // var path = this.path('M' + x + ',' + y + ',' + x2 + ',' + ty + ',' + x2 + ',' + y1 + 'z');
  path.attr({
    fill: this.colors[shape.kind + 'Fill'],
    stroke: this.colors[shape.kind + 'Stroke'],
    'stroke-width': '0px',
    opacity: 1
  });
  
  return path;
};

Raphael.fn.outline = function(shape, kind) {
  var trap = shape.assoc[0];
  var tPath = trap.attr('path');
  var x1 = tPath[0][1];
  var x2 = tPath[1][1];
  var x3 = tPath[2][1];
  var y1 = tPath[0][2];
  var y2 = tPath[1][2];
  var y3 = tPath[2][2];
  
  var p1 = {
    x: shape.attr('x'),
    y: shape.attr('y') + shape.attr('height')
  };
  
  var p2 = {
    x: shape.attr('x'), 
    y: shape.attr('y')
  };
  
  var p3 = {
    x: x2,
    y: y2
  };
  
  var p4 = {
    x: x3,
    y: y3
  };
  
  var p5 = {
    x: x3,
    y: shape.attr('y') + shape.attr('height')
  };
  
  var path = this.buildPath([p1, p2, p3, p4, p5]);
  
  return path;
};

Raphael.fn.buildPath = function(points) {
  var str = 'M';
  str += points[0].x + ',' + points[0].y;
  
  var i;
  for(i=1; i<points.length; i++) {
    str += ',' + points[i].x + ',' + points[i].y;
  }
  
  str += 'z';
  
  return this.path(str);
};

Raphael.fn.redraw = function() {
  // console.log(zoom, zoomTimes);
  var paper = this;
  // redraw shapes
  for(var i in this.allLinks) {
    var l = this.allLinks[i];
    l.fadeOut();
    l.arrowSize *= zoom;
    l.strokeSize *= zoom;
    l.attr('stroke-width', l.strokeSize + 'px');
  }
  for(var i in this.allShapes) {
    var s = this.allShapes[i];
    var x = s.attr('x');
    var y = s.attr('y');
    var w = s.attr('width');
    var h = s.attr('height');
    if(zoomTimes == 1) {
      s.zx = x;
      s.zy = y;
      s.zh = h;
      s.zw = w;
    }
    s.attr({
      x: x * zoom,
      y: y * zoom,
      width: w * zoom,
      height: h * zoom
    });
    if(s.handle) {
      var hx = s.handle.attr('cx');
      var hy = s.handle.attr('cy');
      var hr = s.handle.attr('r');
      if(zoomTimes == 1) {
        s.handle.zx = hx;
        s.handle.zy = hy;
        s.handle.zr = hr;
      }
      s.handle.attr({
        cx: hx * zoom,
        cy: hy * zoom,
        r: hr * zoom
      });
    }
    if(s.text) {
      var tx = s.text.attr('x');
      var ty = s.text.attr('y');
      var size = s.text.attr('font').match(/^.*px/)[0].replace('px','');
      size = parseFloat(size);
      if(zoomTimes == 1) {
        s.text.zx = tx;
        s.text.zy = ty;
        s.text.zf = size;
      }
      s.text.attr({
        x: tx * zoom,
        y: ty * zoom,
        font: (size * zoom) + 'px Signika Negative'
      });
    }
  }
  for(var i in this.allLinks) {
    var l = this.allLinks[i];
    l.fadeIn();
    l.redraw();
  }
}

Raphael.fn.resetZoom = function() {
  var paper = this;
  
  if(zoom == 1.0 && zoomTimes == 0)
    return false;

  for(var i in this.allLinks) {
    var l = this.allLinks[i];
    l.fadeOut();
    l.arrowSize = 6;
    l.strokeSize = 2;
    l.attr('stroke-width', l.strokeSize + 'px');
  }
  for(var i in this.allShapes) {
    var s = this.allShapes[i];
    s.attr({
      x: s.zx,
      y: s.zy,
      width: s.zw,
      height: s.zh
    });
    if(s.handle) {
      s.handle.attr({
        cx: s.handle.zx,
        cy: s.handle.zy,
        r: s.handle.zr
      });
    }
    if(s.text) {
      s.text.attr({
        x: s.text.zx,
        y: s.text.zy,
        font: s.text.zf + 'px Signika Negative'
      });
    }
  }
  for(var i in this.allLinks) {
    var l = this.allLinks[i];
    l.fadeIn();
    l.redraw();
  }
}

var fadeEasing = 'ease-in-out';
var fadeTiming = 250;
var fadeOpacity = 0.15;

Raphael.el.fadeOut = function() {
  var id = this.id;
  var i = 0;
  this.animate({
    opacity: fadeOpacity
  }, fadeTiming, fadeEasing);
  this.text.animate({
    opacity: fadeOpacity
  }, fadeTiming, fadeEasing);
  if(this.paper === modelPaper) {
    factPaper.allShapes[id].disabled = true;
    factPaper.allShapes[id].fadeOut(true);
  }
  for(i=0; i<this.links.length; i++) {
    $('input[name="chkLink' + this.links[i].id + '"]').removeAttr('checked');
    this.links[i].end.disabled = true;
    this.links[i].start.disabled = true;
    this.links[i].animate({
      opacity: fadeOpacity
    }, fadeTiming, fadeEasing).arrow.animate({
      opacity: fadeOpacity
    }, fadeTiming, fadeEasing);
  }
}

Raphael.el.fadeIn = function() {
  var id = this.id;
  var i = 0;
  this.animate({
    opacity: 1
  }, fadeTiming, fadeEasing);
  this.text.animate({
    opacity: 1
  }, fadeTiming, fadeEasing);
  if(this.paper == modelPaper) {
    delete factPaper.allShapes[id].disabled;
    factPaper.allShapes[id].fadeIn(true);
  }
  for(i=0; i<this.links.length; i++) {
    $('input[name="chkLink' + this.links[i].id + '"]').attr('checked', 'checked');
    this.links[i].animate({
      opacity: 1
    }, fadeTiming, fadeEasing).arrow.animate({
      opacity: 1
    }, fadeTiming, fadeEasing);      
  }    
}

Raphael.el.fadeInLink = function() {
  this.animate({
    opacity: 1
  }, fadeTiming, fadeEasing).arrow.animate({
    opacity: 1
  }, fadeTiming, fadeEasing);
}

Raphael.el.fadeOutLink = function() {
  this.animate({
    opacity: fadeOpacity
  }, fadeTiming, fadeEasing).arrow.animate({
    opacity: fadeOpacity
  }, fadeTiming, fadeEasing);
}