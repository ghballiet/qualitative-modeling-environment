Raphael.fn.link = function(id, start, end, kind) {
  var path = this.line(start, end);
  
  path.id = id;
  path.start = start;
  path.end = end;
  path.kind = kind;
  
  kind = kind.replace(' ','');
  
  path.arrowSize = 6;
  path.strokeSize = 2;
  
  path.attr({
    stroke: this.colors[kind + 'Stroke'],
    opacity: 1,
    'stroke-width': path.strokeSize + 'px'
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
    this.oo = this.attr('opacity');
    // this.dot.attr('opacity', 0);    
    this.attr('opacity', 0);
    this.arrow.remove();
  };
  
  path.fadeIn = function() {
    this.attr('opacity', 1);
  };
  
  path.redraw = function() {
    var line = this.paper.line(this.start, this.end);
    this.attr('path', line.attr('path'));
    this.toFront();
    // this.dot.toFront();
    this.start.toFront();
    this.start.text.toFront();
    this.end.toFront();
    this.end.text.toFront();
    this.drawArrow();
    line.remove();
  };
  
  path.highlight = function(color) {
    this.start.highlight();
    this.end.highlight();
    
    this.attr({
      opacity: .25,
    });
    
    this.arrow.attr({
      opacity: .25
    });
    
    if(this.selected != null) {
      this.selected.remove();
      this.selected = null;
    }
  };
  
  path.select = function(direction) {
    this.start.select();
    this.end.select();
    
    this.attr({
      opacity: 1
    });
    
    this.arrow.attr({
      opacity: 1
    });
    
    this.selected = this.clone();
    this.selected.attr({
      'stroke-width': '8px',
      stroke: this.paper.colors[direction + 'Stroke'],
      opacity: .3
    });
    
    this.selected.toFront();
    this.toFront();
    this.start.toFront();
    this.start.text.toFront();
    this.end.toFront();
    this.end.text.toFront();

    if(this.label != null)
      this.label.toFront();
  };
  
  path.showLabel = function(text, offset) {
    var len = this.getTotalLength();
    var mid = this.getPointAtLength((len / 2.0) + offset);
    var num = parseInt(text);
    var lbl = this.paper.g.flag(15, 15 + (num * 30), text);
    
    var bg = lbl[0];
    var txt = lbl[1];
    
    bg.attr({
      fill: this.paper.colors['placeStroke'],
      stroke: 'transparent',
      opacity: .6
    });
    
    txt.attr({
      fill: '#fff',
      font: '14px Signika Negative'
    });
    
    bg.text = txt;
    
    this.paper.labels.push(lbl);
    this.label = lbl;
    return lbl;
  };
    
  path.hideLabel = function() {
    if(this.label != null) {
      this.label.remove();
      this.label = null;
    }
  }
  
  path.drawArrow = function() {
    if(this.arrow != null) {
      this.arrow.remove();
      this.arrow = null;
    } 
    
    var st = this.start;
    var en = this.end;
    
    var cst = this.paper.center(start);
    var cen = this.paper.center(end);
    
    var sx = cst.cx;
    var sy = cst.cy;
    var ex = cen.cx;
    var ey = cen.cy;
    
    var ang = Math.atan2(sx - ex, sy - ey);
    
    ang = ang * (180 / Math.PI);
    
    if(ang < 0)
      ang = 360 + ang;
      
    ang += 180;
    
    // console.log(start.name, end.name, ang);
    
    var len = this.getTotalLength();
    var mid = this.getPointAtLength(len / 2.0);
    var dist = Math.tan(ang) * this.start.attr('height') + Math.sin(ang) * this.start.attr('width');
    var pt = this.getPointAtLength(len - dist);    


    var arrow = this.paper.g.triangle(mid.x, mid.y, path.arrowSize);
    
    arrow.translate(0, 1.5);

    arrow.rotate(-1 * ang, true);
    
    arrow.attr({
      fill: this.paper.colors[this.kind + 'Stroke'],
      stroke: 'transparent'
    });
    
    this.arrow = arrow;
  }
  
  path.mouseover(function(e) {
    var id = this.id;
    var row = $('#l' + id);
    row.addClass('highlight');
  });
  
  path.mouseout(function(e) {
    var id = this.id;
    var row = $('#l' + id);
    row.removeClass('highlight');
  });
  
  path.drawArrow();
  
  // removed... for now
  // path.drawDot();
        
  return path;
}

Raphael.fn.drawLinks = function(data) {
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
    
    // // console.log(id, start.name, l.type, end.name);
    var link = this.link(id, start, end, l.type);
    
    this.allLinks[id] = link;
    this.allLinkSet.push(link);
    this.allHypotheses[id] = link;
    
    start.links.push(link);
    end.links.push(link);
    
    start.toFront();
    start.text.toFront();
    end.toFront();
    end.text.toFront();
    
    if(!this.showFacts) {
      this.addLink(link);
      var from = start.name + '@' + start.parent.name;
      var to = end.name + '@' + end.parent.name;
      var rel = from + '_' + to;
      var rel2 = to + '_' + from;
      rel = rel.toLowerCase();
      rel2 = rel2.toLowerCase();
      this.relLinks[rel] = link;
      this.relLinks[rel2] = link;
    }
  }
};

Raphael.fn.getLinks = function() {
  // grab links from the database
  var q = 'SELECT * FROM link WHERE model=:model';
  var data = {':model': this.model};
  
  var paper = this;  
  
  $.post(this.qUrl, {query: q, data: data}, function(d) {
    paper.drawLinks(d);
    $('#facts').hide(0);
  });
};