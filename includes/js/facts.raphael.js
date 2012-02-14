Raphael.fn.fact = function(id, start, end, kind) {  
  if(end == null) {
    // handle time
    var trap = this.trapezoid(start, kind);
    
    trap.start = start;
    trap.kind = kind;
    
    trap.fadeOut = function() {
      this.oo = this.attr('opacity');
      this.attr('opacity', 0);
    };
    
    trap.fadeIn = function() {
      this.attr('opacity', 1);
    };
    
    trap.redraw = function() {
      var path = this.paper.trapezoid(this.start, this.kind);
      this.attr('path', path.attr('path'));
      path.remove();
      
      this.toFront();
    };
    
    trap.prediction = null;
    
    trap.click(function() {
      clickPred(this.prediction);
    });
    
    start.assoc.push(trap);
    
    return trap;
  }
  
  var path = this.line(start, end);
  
  path.id = id;
  path.start = start;
  path.end = end;
  path.kind = kind;
  
  kind = kind.replace(/ /g,'');
  
  path.attr({
    stroke: this.colors[kind + 'Stroke'],
    opacity: 1,
    'stroke-width': '2px'
  });
  
  path.coords = function() {
    var p = this.attr('path');
    return {
      x1: p[0][1],
      y1: p[0][2],
      x2: p[1][1],
      y2: p[1][2]
    };
  };
  
  path.drawDot = function() {
    var dot = this.paper.circle(this.coords().x1, this.coords().y1, 5);
    dot.attr({
      fill: this.paper.colors[kind + 'Stroke'],
      stroke: 'transparent',
      opacity: .8
    });
    
    dot.parent = this;
    
    dot.transport = function() {
      if(this.parent.attr('opacity') > 0 && 
      this.attr('opacity') == 0)
      this.attr('opacity', 0.8);
            
      this.attr({
        cx: this.parent.coords().x1,
        cy: this.parent.coords().y1,
      }).animateAlong(this.parent, 1500, false, function() {
        this.transport();
      });
    };
    
    this.dot = dot;
    
    dot.transport();
  };
  
  path.fadeOut = function() {
    this.oo = 1
    // this.dot.attr('opacity', 0);    
    this.attr('opacity', 0);
    
    if(this.arrow != null) {
      this.arrow.remove();
    }
  };
  
  path.fadeIn = function() {
    this.attr('opacity', this.oo);
  };
  
  path.redraw = function() {
    if(this.end != null) {
      var line = this.paper.line(this.start, this.end);
      this.attr('path', line.attr('path'));
      line.remove();      
    }
    
    this.drawArrow();
    
    this.toFront();
    // this.dot.toFront();
    this.start.toFront();
    this.start.text.toFront();

    if(this.end != null) {
      this.end.toFront();
      this.end.text.toFront();
    }
  };
  
  path.drawArrow = function() {
    if(this.arrow != null) {
      this.arrow.remove();
      this.arrow = null;
    }

    var len = this.getTotalLength();
    var mid = this.getPointAtLength(len / 2.0);
    var arrow = this.paper.g.triangle(mid.x, mid.y, 6);
    
    var st = this.start;
    var en = this.end;
    
    var cst = this.paper.center(start);
    var cen = this.paper.center(end);
    
    var sx = cst.cx;
    var sy = cst.cy;
    var ex = cen.cx;
    var ey = cen.cy;
    
    var angle = mid.alpha;
    
    var ang = Math.atan2(sx - ex, sy - ey);
    
    ang = ang * (180 / Math.PI);
    
    if(ang < 0)
      ang = 360 + ang;
      
    ang += 180;
    
    arrow.translate(0, 1.5);

    arrow.rotate(-1 * ang, true);
    
    var k = this.kind.replace(/ /g, '');
    
    arrow.attr({
      fill: this.paper.colors[k + 'Stroke'],
      stroke: 'transparent'
    });
    
    this.arrow = arrow;
  }
  
  path.drawArrow();
  
  // removed... for now
  // path.drawDot();
        
  return path;
}

Raphael.fn.drawFacts = function(data) {
  // actually draw the links
  this.allLinkData = data;
  
  this.allLinkSet = this.set();
  
  for(var i in data) {    
    var l = data[i];    
    var start = parseInt(l.start);
    var end = parseInt(l.end);
    var id = parseInt(l.id);

    start = this.allShapes[start];  
    end = this.allShapes[end];
      
    var link = this.fact(id, start, end, l.type);
    
    this.allLinks[id] = link;
    this.allLinkSet.push(link);

    start.toFront();
    start.text.toFront();
    
    if(end != null) {
      start.links.push(link);      
      end.links.push(link);
      end.toFront();
      end.text.toFront();
    }
    
    this.addFact(link);
  }
};

Raphael.fn.getFacts = function() {
  // grab links from the database
  var q = 'SELECT * FROM fact WHERE model=:model';
  var data = {':model': this.model};
  
  var paper = this;  
  
  $.post(this.qUrl, {query: q, data: data}, function(d) {
    // console.log(d);
    paper.drawFacts(d);
  });
};