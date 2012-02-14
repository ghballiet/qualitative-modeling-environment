Raphael.fn.entity = function(id, name, kind, x, y, w, h) {
  var fontSize = 14;
  
  x *= zoom;
  y *= zoom;
  w *= zoom;
  h *= zoom;
      
  var text = this.text(x, y, name);

  var rw = text.getBBox().width + (3.5 * fontSize * zoom);
  var rh = text.getBBox().height + (fontSize * zoom);
  var rx = x;
  var ry = y;
  var rect = this.rect(rx, ry, rw, rh, 0);
  
  // set various attributes
  rect.id = id;
  rect.name = name;
  rect.kind = kind;
  
  text.attr({
    fill: '#fff',
    font: (fontSize * zoom) + 'px Signika Negative',
    x: this.center(rect).cx,
    y: this.center(rect).cy
  });
  
  rect.attr({
    opacity: 1,
    fill: this.colors[kind + 'Fill'],
   stroke: this.colors[kind + 'Stroke'],
    'stroke-width': '0px',   
  });
  
  rect.text = text;
  text.parent = rect;
  
  rect.links = this.set();
  
  rect.start = entityDrag().start;
  rect.move = entityDrag().move;
  rect.end = entityDrag().end;
  rect.save = saveShape;
  
  rect.drag(rect.move, rect.start, rect.end);
  
  rect.toFront();
  text.toFront();
  
  rect.getPair = function() {
    var r2;
    if(this.paper.showFacts) {
      r2 = modelPaper.allShapes[this.id];
    } else {
      r2 = factPaper.allShapes[this.id];
    }
    return r2;
  };
  
  rect.highlight = function() {
    this.attr({
      opacity: .25
    });

    this.text.attr({
      opacity: .25
    });
  };
  
  rect.select = function() {
    this.attr({
      opacity: 1
    });
    
    this.text.attr({
      opacity: 1
    });
  };
  
  rect.assoc = this.set();
  
  return rect;
};

Raphael.fn.deleteEntities = function() {
  var paper = this;
  for(var i in this.allLinks) {
    var l = this.allLinks[i];
    l.arrow.remove();
    l.remove();
    delete this.allLinks[i];
  }
  delete this.allLinks;
  this.allLinks = new Array();
  
  for(var i in this.allEntities) {
    var e = this.allEntities[i];
    e.text.remove();
    if(e.handle)
      e.handle.remove();
    e.remove();
    delete this.allShapes[i];
  }
}

Raphael.fn.drawEntities = function(data) {
  // draws entities
  for(var i in data) {
    var e = data[i];
    // // console.log(e.kind + ': ' + e.name);
    e.x = parseInt(e.x);
    e.y = parseInt(e.y);
    e.width = parseInt(e.width);
    e.height = parseInt(e.height);
    
    var loc = parseInt(e.location);
    var id = parseInt(e.id);
    
    if(loc == -1)
      return false;
    
    var entity = this.entity(id, e.name, e.kind, e.x, e.y, 
      e.width, e.height);
   
    this.allShapes[id] = entity;
    this.allEntities[id] = entity;
    
    if(loc != 0) {
      entity.parent = this.allShapes[loc];      
      this.allShapes[loc].children.push(entity);
      
      if(this.showFacts) {
        var pname = this.allShapes[loc].name.toLowerCase();
        this.relShapes[entity.name.toLowerCase() + '@' + pname] = entity;
      }
    }
    
    if(!this.showFacts)
      this.addEntity(entity);
  }
};

Raphael.fn.getEntities = function() {
  var query = 'SELECT e.*, p.* FROM entity e, placement p ' +
    'WHERE e.id=p.entity AND e.kind<>:kind AND e.model=:model';
  var data = { ':kind': 'place', ':model': this.model };
  
  var paper = this;
    
  $.post(this.qUrl, {query: query, data: data}, function(d) {
    // console.log(d);
    // return false;
    paper.drawEntities(d);    
    
    if(paper.showFacts == false)
      paper.getLinks();
    else
      paper.getFacts();
  });  
};