Raphael.fn.addPlace = function(shape) {
  var row = $('<div />').addClass('row');
  row.attr('id', 'p' + shape.id);

  var del = $('<span />').addClass('deleteBtn');
  del.html('&#x2715;');
  row.append(del);
  
  var name = $('<span />').addClass('name');
  name.text(shape.name);
  // name.attr('contenteditable', true);
  row.append(name);
  
  if(shape.parent != null) {
    row.append(' in ');
    var parent = $('<span />').addClass('location');
    parent.text(shape.parent.name + ' ');
    row.append(parent);
  }
  
  $('#places').append(row);
};

Raphael.fn.addEntity = function(shape) {
  var row = $('<div />').addClass('row');
  row.attr('id', 'r' + shape.id);
  
  var del = $('<span />').addClass('deleteBtn');
  del.html('&#x2715;');
  row.append(del);
  
  var chk = $('<input />').attr({
    type: 'checkbox',
    name: 'chk' + shape.id,
    checked: 'checked'
  }).addClass('chkInclude');
  chk.change(function() {
    if($(this).is(':checked'))
      shape.fadeIn();
    else
      shape.fadeOut();
  });
  row.append(chk);
  
  var name = $('<span />').addClass('name');
  name.text(shape.name)
  // name.attr('contenteditable', true);
  row.append(name);
  
  if(shape.parent != null) {
    row.append(' in ');
    var parent = $('<span />').addClass('location');
    parent.text(shape.parent.name + ' ');
    row.append(parent);
  }
  
  row.append('is ');
  
  var kind = $('<span />').addClass(shape.kind);
  kind.text(shape.kind);
  row.append(kind);

  $('#entities').append(row);
};

Raphael.fn.addLink = function(shape) {
  var row = $('<div />').addClass('row');
  row.attr('id', 'l' + shape.id);
  
  var del = $('<span />').addClass('deleteBtn');
  del.html('&#x2715;');
  row.append(del);
  
  var chk = $('<input />').attr({
    type: 'checkbox',
    name: 'chkLink' + shape.id,
    checked: 'checked'
  }).addClass('chkInclude');
  chk.change(function() {
    if($(this).is(':checked'))
      shape.fadeInLink();
    else
      shape.fadeOutLink();
  });
  row.append(chk);
  
  var start = $('<span />').addClass(shape.start.kind);
  start.text(shape.start.name);
  row.append(start);
  
  if(shape.start.parent != null) {
    row.append(' in ');
    var parent = $('<span />').addClass('location');
    parent.text(shape.start.parent.name + ' ');
    row.append(parent);
  }
  
  var kind = $('<span />').addClass(shape.kind);
  kind.text(shape.kind);
  row.append(kind);
  
  row.append(' with ');
  
  var end = $('<span />').addClass(shape.end.kind);
  end.text(shape.end.name);
  row.append(end);
  
  if(shape.end.parent != null) {
    row.append(' in ');
    var parent = $('<span />').addClass('location');
    parent.text(shape.end.parent.name + ' ');
    row.append(parent);
  }
  
  $('#links').append(row);
}

Raphael.fn.addFact = function(shape) {
  var row = $('<div />').addClass('row');
  row.attr('id', 'f' + shape.id);
  
  var del = $('<span />').addClass('deleteBtn');
  del.html('&#x2715;');
  row.append(del);
  
  var start = $('<span />').addClass(shape.start.kind);
  start.text(shape.start.name);
  row.append(start);
  
  if(shape.start.parent != null) {
    row.append(' in ');
    var parent = $('<span />').addClass('location');
    parent.text(shape.start.parent.name + ' ');
    row.append(parent);
  }
  
  var kind = $('<span />').addClass(shape.kind.replace(/ /g, '-'));
  kind.text(shape.kind);
  row.append(kind);
  
  row.append(' with ');

  var end = $('<span />');
  if(shape.end != null) {
    end.addClass(shape.end.kind);
    end.text(shape.end.name);    
    row.append(end);
    if(shape.end.parent != null) {
      row.append(' in ');
      var parent = $('<span />').addClass('location');
      parent.text(shape.end.parent.name + ' ' );
      row.append(parent);
    }    
  } else {
    end.addClass('time');
    end.text('time');
    row.append(end);
  }
    
  $('#empirical-facts').append(row);
}

Raphael.fn.addPrediction = function(shape) {
  var row = $('<div />').addClass('row');
  
  var end = $('<span />');
  if(shape.end != null) {
    end.addClass(shape.end.kind);
    end.text(shape.end.name);    
    row.append(end);
    if(shape.end.parent != null) {
      row.append(' in ');
      var parent = $('<span />').addClass('location');
      parent.text(shape.end.parent.name + ' ' );
      row.append(parent);
    } else {
      row.append(' ');
    }
  } else {
    end.addClass('time');
    end.text('time');
    row.append(end);
  }
  
    
  var kind = $('<span />').addClass(shape.kind.replace(/ /g, '-'));
  kind.text(shape.kind);
  row.append(kind);
  
  row.append(' with ');
  
  var start = $('<span />');
  if(shape.start != null) {
    start.addClass(shape.start.kind);
    start.text(shape.start.name);
    row.append(start);
    if(shape.start.parent != null) {
      row.append(' in ');
      var parent = $('<span />').addClass('location');
      parent.text(shape.start.parent.name + ' ');
      row.append(parent);
    }
  } else {
    start.addClass('time');
    start.text('time ');
    row.append(start);
  }
    
  $('#predictions').append(row);
}