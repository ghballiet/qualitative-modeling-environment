function placeDrag() {
  var start = function() {
    this.ox = this.attr('x');
    this.oy = this.attr('y');
    this.oo = this.attr('opacity');
        
    this.text.ox = this.text.attr('x');
    this.text.oy = this.text.attr('y');
    
    this.handle.ox = this.handle.attr('cx');
    this.handle.oy = this.handle.attr('cy');
    this.handle.oo = this.handle.attr('opacity');
    
    this.attr('opacity', .5);
    this.handle.attr('opacity', .5);
    
    this.toFront();
    this.text.toFront();
    this.handle.toFront();
    
    var i = null;
    for(i=0; i<this.children.length; i++)
      this.children[i].start();
  };
  
  var move = function(dx, dy) {
    this.attr({
      x: this.ox + dx,
      y: this.oy + dy
    });
    
    this.text.attr({
      x: this.text.ox + dx,
      y: this.text.oy + dy
    });
    
    this.handle.attr({
      cx: this.handle.ox + dx,
      cy: this.handle.oy + dy
    });
    
    var i = null;
    for(i=0; i<this.children.length; i++)
      this.children[i].move(dx, dy);
  };
  
  var end = function() {
    this.attr('opacity', this.oo);
    this.handle.attr('opacity', this.handle.oo);
    this.save();
    
    var i = null;
    for(i=0; i<this.children.length; i++)
      this.children[i].end();
      
    var r2 = this.getPair();
    
    r2.attr({
      x: this.attr('x'),
      y: this.attr('y'),
      height: this.attr('height'),
      width: this.attr('width')
    });
    
    r2.handle.attr({
      cx: this.handle.attr('cx'),
      cy: this.handle.attr('cy')
    });
    
    r2.text.attr({
      x: this.text.attr('x'),
      y: this.text.attr('y')
    });
    
    var j = null; 
  };
  
  return {
    start: start,
    move: move,
    end: end
  };
}

function handleDrag() {
  var start = function() {
    this.ox = this.attr('cx');
    this.oy = this.attr('cy');
    
    this.parent.ow = this.parent.attr('width');
    this.parent.oh = this.parent.attr('height');
    
    this.parent.text.ox = this.parent.text.attr('x');
    this.parent.text.oy = this.parent.text.attr('y');    
  };
  
  var move = function(dx, dy) {
    var nWidth = this.parent.ow + dx;
    var nHeight = this.parent.oh + dy;

    this.attr({
      cx: this.ox + dx,
      cy: this.oy + dy
    });
  
    this.parent.attr({
      width: nWidth,
      height: nHeight
    });
  
    this.parent.text.attr({
      x: this.paper.center(this.parent).cx
    });
  };
  
  var end = function() {
    this.parent.save();
    
    var r2 = this.parent.getPair();
    
    r2.attr({
      x: this.parent.attr('x'),
      y: this.parent.attr('y'),
      width: this.parent.attr('width'),
      height: this.parent.attr('height')
    });
    
    r2.handle.attr({
      cx: this.attr('cx'),
      cy: this.attr('cy')
    });
    
    r2.text.attr({
      x: this.parent.text.attr('x'),
      y: this.parent.text.attr('y')
    });
  };
  
  return {
    start: start,
    move: move,
    end: end
  };
}

function entityDrag() {
  var start = function() {
    this.ox = this.attr('x');
    this.oy = this.attr('y');
    this.oo = this.attr('opacity');
    
    this.text.ox = this.text.attr('x');
    this.text.oy = this.text.attr('y');
    
    this.toFront();
    this.text.toFront();
    
    this.attr('opacity', .5);
        
    var i = null;
    for(i=0; i<this.links.length; i++)
      this.links[i].fadeOut();
    
    var j = null;
    for(j=0; j<this.assoc.length; j++)
      this.assoc[j].fadeOut();
  };
  
  var move = function(dx, dy) {
    var r2 = this.getPair();
    
    this.attr({
      x: this.ox + dx,
      y: this.oy + dy
    });
    
    this.text.attr({
      x: this.text.ox + dx,
      y: this.text.oy + dy
    });
  };
  
  var end = function() {
    var r2 = this.getPair();
    
    this.attr('opacity', this.oo);
    this.save();
    this.toFront();
    this.text.toFront();
    
    var i = null;
    
    var j = null;
    for(j=0; j<r2.links.length; j++) {
      r2.links[j].fadeOut();
    }
    
    r2.attr({
      x: this.attr('x'),
      y: this.attr('y')
    });
    
    var j = null;
    for(j=0; j<r2.links.length; j++) {
      r2.links[j].fadeIn();
      r2.links[j].redraw();
    }
    
    r2.text.attr({
      x: this.text.attr('x'),
      y: this.text.attr('y')
    });
    
    for(i=0; i<this.links.length; i++) {
      var link = this.links[i];
      link.fadeIn();
      link.redraw();
    }
    
    var j;
    for(j=0; j<this.assoc.length; j++) {
      this.assoc[j].fadeIn();
      this.assoc[j].redraw();
    }
    
    this.paper.fadeIn();
  };
  
  
  return {
    start: start,
    move: move,
    end: end
  };
}