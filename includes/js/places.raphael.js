Raphael.fn.place = function(id, name, x, y, w, h) {
  var fontSize = 14;
  
  // console.log(id, x, y, w, h);
  
  x *= zoom;
  y *= zoom;
  w *= zoom;
  h *= zoom;
  
  if(w < 20 || w == null) w = 20;
  if(h < 20 || h == null) h = 50;
  if(x < 10 || x == null) x = 10;
  if(y < 10 || y == null) y = 10;
  
  var rect = this.rect(x, y, w, h, 2);
  var text = this.text(this.center(rect).cx, y + fontSize, name);
  var children = this.set();
  
  // set various attributes
  rect.id = id;
  rect.name = name;
  rect.kind = 'place';
  
  var handleR = 8;
  
  var handle = this.circle(
    this.anchors(rect).se.x - (1.5 * handleR),
    this.anchors(rect).se.y - (1.5 * handleR),
    handleR
  );

  text.attr({
    'fill': '#222',
    'font': fontSize + 'px Signika Negative'
  });
  
  rect.attr({
    stroke: this.colors.placeStroke,
    fill: this.colors.placeFill,
    'stroke-width': '2px',
    opacity: 1
  });
  
  handle.attr({
    stroke: this.colors.placeStroke,
    fill: this.colors.placeFill,
    'stroke-width': '2px',
    opacity: 1
  });
  
  rect.getPair = function() {
    var r2;
    if(this.paper.showFacts) {
      r2 = modelPaper.allShapes[this.id];
    } else {
      r2 = factPaper.allShapes[this.id];
    }
    return r2;
  }
  
  rect.move = placeDrag().move;
  rect.start = placeDrag().start;
  rect.end = placeDrag().end;
  rect.save = saveShape;
  
  rect.text = text;
  rect.handle = handle;
  rect.children = children;
  
  text.parent = rect;
  handle.parent = rect;
  
  handle.move = handleDrag().move;
  handle.start = handleDrag().start;
  handle.end = handleDrag().end;
  
  rect.drag(rect.move, rect.start, rect.end);
  handle.drag(handle.move, handle.start, handle.end);  
  
  return rect;
};

Raphael.fn.drawPlaces = function(data) {
  // draws places
  for(var i in data) {
    var p = data[i];
    // console.log('Place: ' + p.name);
    p.x = parseInt(p.x);
    p.y = parseInt(p.y);
    p.width = parseInt(p.width);
    p.height = parseInt(p.height);
    
    if(p.width + 50 >= this.width) {
      this.setSize(p.width + 50, this.height);
      $(this.canvas).parent().css('min-width', p.width + 50);
    }
    
    if(p.height + 50 >= this.height) {
      this.setSize(this.width, p.height + 50);
      $(this.canvas).parent().css('min-height', p.height + 50);
    }
    
    var loc = parseInt(p.location);
    var id = parseInt(p.id);

    var place = this.place(id, p.name, p.x, p.y, p.width, p.height);
    
    this.allShapes[id] = place;
    this.allPlaces[id] = place;
    
    if(loc != 0) {
      this.allShapes[loc].children.push(place);
      place.parent = this.allShapes[loc];
      
      if(this.showFacts) {
        var pname = this.allShapes[loc].name;
        this.relShapes[p.name.toLowerCase() + '@' + pname.toLowerCase()] = place;
      }
    }
    
    if(!this.showFacts)
      this.addPlace(place);
  }
}

Raphael.fn.getPlaces = function() {
  var query = 'SELECT e.*, p.* FROM entity e, placement p ' +
    'WHERE e.id=p.entity AND e.kind=:kind AND e.model=:model';
  var data = { ':kind': 'place', ':model': this.model };
  
  var paper = this;
    
  $.post(this.qUrl, {query: query, data: data}, function(d) {
    paper.drawPlaces(d);
    paper.getEntities();
  });
};