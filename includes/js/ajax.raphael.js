function saveShape() {
  // saves shape information via AJAX
  // // console.log('Saving: ' + this.id + ' - ' + this.name);
  
  var data = {
    ':id': this.id,
    ':x': this.attr('x'),
    ':y': this.attr('y'),
    ':w': this.attr('width'),
    ':h': this.attr('height')
  };
  
  if(zoomTimes != 1 && this.zx != null) {
    data[':x'] = this.zx;
    data[':y'] = this.zy;
    data[':w'] = this.zw;
    data[':h'] = this.zh;
  }
  
  var q = 'UPDATE placement SET x=:x, y=:y, width=:w, height=:h ' +
    'WHERE entity=:id';
    
  var paper = this.paper;    
  var id = this.id;
  var name = this.name;
  var msg = paper.message('Saving...');
  var url = paper.sUrl;
  
  $.post(paper.sUrl, { query: q, data: data }, function(d) {
    setTimeout(function() {
      msg.text.remove();
      msg.remove();
      saveShapeName(id, name, url);
    }, 10);
  });
}

function saveShapeName(id, name, url) {
  // save the shape name using ajax
  var q = 'UPDATE entity SET name=:name WHERE id=:id';
  var data = {
    ':id': id,
    ':name': name
  };
  
  // console.log(q, data, url);
  
  $.post(url, { query: q, data: data }, function(d) {
    // console.log(d);
  });
}

function saveEntity(name, location, kind, model) {
  model = parseInt(model);
  location = parseInt(location);
    
  var parent = null;
  var x = null;
  var y = null;
  var w = 50;
  var h = 30;
  
  // add logic for null parent
  if(modelPaper.allShapes[location] == null) {
    x = 20;
    y = 20;
  } else {
    parent = modelPaper.allShapes[location];
    x = parent.attr('x') + 10;
    y = parent.attr('y') + 10;
  }
    
  var data = {
    name: name,
    loc: location,
    kind: kind,
    model: model,
    x: x,
    y: y,
    w: w,
    h: h
  };
  
  $.post(modelPaper.dbUrls.entity, data, function(d) {
    console.log(d);
    clearEverything();    
  });
}

function saveHypothesis(start, type, end, model) {
  var q = 'INSERT INTO link VALUES (NULL, :start, :type, :end, :model)';
  
  start = parseInt(start);
  end = parseInt(end);
  model = parseInt(model);
  
  var data = {
    ':start': start,
    ':type': type,
    ':end': end,
    ':model': model
  };
  
  $.post(modelPaper.sUrl, {query: q, data:data}, function(d) {      
    clearEverything();
  });
}

function saveFact(start, type, end, model) {
  var q = 'INSERT INTO fact VALUES (NULL, :start, :type, :end, :model)';
  
  start = parseInt(start);
  end = parseInt(end);
  model = parseInt(model);
  
  var data = {
    ':start': start,
    ':type': type,
    ':end': end,
    ':model': model
  };
  
  $.post(modelPaper.sUrl, {query: q, data:data}, function(d) {
    clearEverything();    
  });
}

function deleteItem(id) {
  // deleting
  // console.log('Deleting: ' + id);
  var table;

  var type = id.substring(0,1);
  
  var mapping = {
    p: 'entity',
    r: 'entity',    
    l: 'link',
    f: 'fact'
  };
  
  var table = mapping[type];
  var id = parseInt(id.replace(type, ''));
  
  // build the rest of the query accordingly
  if(type == 'p') {
    deletePlace(id);
  } else if(type == 'r') {
    deleteEntity(id);
  } else if(type == 'l') {
    deleteLink(id);
  } else if(type == 'f') {
    deleteFact(id);
  }
}

function deletePlace(id) {
  var url = '../includes/php/deletePlace.php';
  $.post(url, { id: id }, function(d) {
    console.log(d);
    $('a.close-reveal-modal').click();
    clearEverything();
    $('#myModal a').click();
  });
}

function deleteEntity(id) {
  var url = '../includes/php/deleteEntity.php';
  $.post(url, { id: id }, function(d) {
    console.log(d);
    $('a.close-reveal-modal').click();
    clearEverything();
    $('#myModal a').click();
  });  
}

function deleteLink(id) {
  var url = '../includes/php/deleteLink.php';
  $.post(url, { id: id }, function(d) {
    console.log(d);
    $('a.close-reveal-modal').click();
    clearEverything();
    $('#myModal a').click();
  });
}

function deleteFact(id) {
  var url = '../includes/php/deleteFact.php';
  $.post(url, { id: id }, function(d) {
    console.log(d);
    $('a.close-reveal-modal').click();
    clearEverything();
    $('#myModal a').click();
  });  
}