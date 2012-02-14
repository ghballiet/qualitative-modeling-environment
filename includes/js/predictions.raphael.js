Raphael.fn.prediction = function(id, start, end, kind, paths) {  
  if(start == null)  {
    var pred = this.outline(end, kind);
    
    pred.id = id;
    pred.start = {
      name: 'time',
      kind: 'time'
    };
    pred.end = end;
    pred.explanations = paths;
    pred.kind = kind;
    
    kind = kind.replace(/ /g, '');
    
    pred.attr({
      opacity: 1,
      stroke: this.colors[kind + 'Stroke'],
      'stroke-width': '4px'
    });
    
    pred.fadeOut = function() {
      this.oo = this.attr('opacity');
      this.attr('opacity', 0);
    };
    
    pred.fadeIn = function() {
      if(this.oo == null || this.oo < 1)
        this.oo = 1;
      this.attr('opacity', 1);
    };
    
    pred.redraw = function() {
      var path = this.paper.outline(this.end, this.kind);
      this.attr('path', path.attr('path'));
      path.remove();
      this.toFront();
    };
    
    pred.click(function() {      
      clickPred(this);
    });
    
    end.assoc[0].prediction = pred;
    
    return pred;
  }
  
  var path = this.line(start, end);
  
  path.id = id;
  path.start = start;
  path.end = end;
  path.kind = kind;
  path.explanations = paths;
  
  kind = kind.replace(/ /g, '');
    
  path.attr({
    stroke: this.colors[kind + 'Stroke'],
    opacity: .3,
    'stroke-width': '8px'
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
    this.oo = 0.4;
    // this.dot.attr('opacity', 0);    
    this.attr('opacity', 0);
  };
  
  path.fadeIn = function() {
    this.attr('opacity', this.oo);
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
    line.remove();
  };
    
  path.click(function(e) {
    clickPred(path);
  });
  
  // removed... for now
  // path.drawDot();
        
  return path;
};

Raphael.fn.drawPredictions = function(data) {
  for(var i in data) {
    var p = data[i];
    p.from = p.from.toLowerCase();
    p.from = p.from.replace(/-/g, ' ');
    p.to = p.to.toLowerCase();
    p.to = p.to.replace(/-/g, ' ');
    
    var from = this.relShapes[p.from];
    var to = this.relShapes[p.to];
    var id = parseInt(p.id.replace('p',''));
    var type = p.direction;
    
    type = type.toLowerCase();  
    type = type.replace(/-/g,' ');
    
    var pred = this.prediction(id, from, to, type, p.paths);
    
    pred.toFront();      

    if(from != null) {
      from.links.push(pred);
      pred.start.toFront();
      pred.start.text.toFront();    
    }

    to.links.push(pred);
    pred.end.toFront();
    pred.end.text.toFront();
    
    this.addPrediction(pred);
  }
};

Raphael.fn.getPredictions = function() {
  // gets the predictions (generated by the backend)
  var url = '../text/?model=' + this.model + '&type=predictions';
  var excludeShapes = [];
  var excludeLinks = [];
  var excludeFacts = [];
  var paper = this;
  for(var i in this.allShapes) {
    var s = this.allShapes[i];
    var t = modelPaper.allShapes[i];
    if(s.disabled) {
      excludeShapes.push(s.id);
      var j = 0;
      for(j=0; j<t.links.length; j++)
        excludeLinks.push(t.links[j].id);
      var k = 0;
      for(k=0; k<s.links.length; k++)
        excludeFacts.push(s.links[k].id);
    }
  }
  
  var strExcludeShapes = excludeShapes.join(',');
  if(strExcludeShapes.length > 0)
    url += '&excludeShapes=' + strExcludeShapes;
  
  var strExcludeLinks = excludeLinks.join(',');
  if(strExcludeLinks.length > 0)
    url += '&excludeLinks=' + strExcludeLinks;
  
  var strExcludeFacts = excludeFacts.join(',');
  if(strExcludeFacts.length > 0)
    url += '&excludeFacts=' + strExcludeFacts;
        
  $.get(url, function(d) {
    var group = $('<div />').addClass('group');
    var h1 = $('<h1 />').html('Predictions');
    var div = $('<div />').attr('id', 'predictions');
    group.html(h1).append(div);
    $('#left2').append(group);
    // console.log(d);
    paper.generatedPredictions = true;
    paper.drawPredictions(d);    
  });
};