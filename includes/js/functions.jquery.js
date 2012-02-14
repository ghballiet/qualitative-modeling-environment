$(document).ready(function() {
  menuClickEvents();
  closeClickEvents();
  locationPicker();
  textEvents();
  
  $('#right, #facts').click(function() {
    if($('#left').is(':visible'))
      $('#btnText').click();
  });
  
  $(document).keydown(function(e) {
    if(e.keyCode == 187 && e.metaKey == true) {
      e.preventDefault();
      zoomIn();
      return false;
    } else if(e.keyCode == 189 && e.metaKey == true) {
      e.preventDefault();
      zoomOut();
      return false;
    } else if(e.keyCode == 48 && e.metaKey == true) {
      e.preventDefault();
      zoomReset();
      return false;
    }
  });
});

$.fn.saveChanges = function() {
  var parent = $(this).parent();
  var id = parseInt(parent.attr('id').replace('r',''));
  var text = $(this).text().trim();    
  
  // save model shape
  var modelShape = modelPaper.allShapes[id];
  modelShape.name = text;
  modelShape.text.attr('text', text);
  modelShape.save();
  
  // update prediction shape
  var factShape = factPaper.allShapes[id];
  factShape.name = text;
  factShape.text.attr('text', text);
}

function textEvents() {
  $('span.name').live('keydown', function(e) {
    // detect newlines
    if(e.keyCode === 13) {
      e.preventDefault();
      $(this).blur();
    }
  });
  $('span.name').live('blur', function() {
    $(this).saveChanges();
  });
}

function getQueryParams() {
  var qs = document.location.search;
  qs = qs.split("+").join(" ");
  var params = {},
  tokens,
  re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(qs)) {
    params[decodeURIComponent(tokens[1])]
      = decodeURIComponent(tokens[2]);
  }

  return params;
}

function menuClickEvents() {
  $('#btnText').click(function() {
    if($('#left').is(':visible')) {
      $('#left, #left2').fadeOut('fast');
      $(this).text('Show Text');
    } else {
      $('#left, #left2').fadeIn('fast');
      $(this).text('Hide Text');
    }
  });
  
  $('#btnGraphics').click(function() {
    if($('#right').is(':visible')) {
      $('#right').hide();
      $(this).text('Show Graphics');
    } else {
      $('#right').show();
      $(this).text('Hide Graphics');
    }
  });
  
  $('#addPlace').click(function() {
    addPlace();
  });
  
  $('#addEntity').click(function() {
    addEntity();
  });
  
  $('#addHypothesis').click(function() {
    addHypothesis();
  });
  
  $('#addFact').click(function() { addFact(); });
  
  $('#btnFacts').click(function() {
    if($('#facts').is(':visible')) {
      $(this).text('Show Facts');
      $('#facts').hide();
    } else {
      $(this).text('Hide Facts');
      $('#facts').show();
    }
  });
  
  $('#btnPredictions').click(function() {
    if(factPaper.generatedPredictions == null) {
      factPaper.getPredictions();
      $(this).text('Hide Predictions');
    } else {
      $(this).text('Show Predictions');
      clearEverything();
    }
  });
  
  $('#btnReset').click(function() {
    var model = getQueryParams().model;
    var url = '../includes/php/resetModel.php';
    if(confirm('Are you sure? This will delete all places, entities, hypotheses' + 
      ' and facts associted with this model, and CANNOT BE UNDONE.')) {
      $.post(url, { model: model }, function(d) {
        console.log(d);
        clearEverything();
      });
    }
  });
  
  $('#zoomIn').click(function() { zoomIn(); });
  $('#zoomReset').click(function() { zoomReset(); });
  $('#zoomOut').click(function() { zoomOut(); });
}

function closeClickEvents() {
  $('.deleteBtn').live('click', function() {
    var row = $(this).parent();
    var modal = $('#myModal');
    var close = $('<a />').addClass('close-reveal-modal');
    close.html('&#215;');
    
    var wrap = $('<div />').addClass('item');
    
    var confirmText = $('<p />').text('Are you sure you want to ' + 
      'delete this element? This cannot be undone.');
      
    var btn = $('<input />').attr('type', 'button').val('Delete');
    btn.addClass('del');
    

    wrap.append(btn);
    
    var c = row.clone();
    wrap.append(c);
      
    modal.html(confirmText);
    
    modal.append(wrap);
    
    modal.append(close);    
    modal.reveal({
      animation: 'none'
    });
    
    btn.click(function() {
      deleteItem(c.attr('id'));
    });
  });
}

function locationPicker() {
  $('div.row span.location').live('click', function(e) {
    e.preventDefault();
    
    var elem = $(this);
    var url = '../includes/php/doQuery.php';
    
    var query = 'SELECT * FROM entity WHERE kind=:kind';
    var data = { ':kind': 'place' };
    
    $.post(url, { query: query, data: data }, function(d) {
      // need to build the dropdown, and handle change functionality
      // here
    });
  });
}

function addPlace() {
  var modal = $('#myModal');
  var title = $('<h1 />').text('Add a Place');
  modal.html(title);
  
  var wrap = $('<div />').addClass('item');
  
  var close = $('<a />').addClass('close-reveal-modal');
  close.html('&#215;');
  modal.append(close);

  var txt = $('<input >').attr({
    name: 'name',
    type: 'text',
    placeholder: 'Name',
    required: 'true'
  });
  
  var loc = $('<select />').attr({
    name: 'location',
    required: 'true'
  });
  
  loc.append($('<option />').text('').val(0));
  
  var span = $('<span />').text('in');
  var btn = $('<input />').attr('type', 'button').val('Add Place');
  wrap.append(txt).append(span).append(loc).append(btn);
  
  var model = getQueryParams().model;
  
  var q = 'SELECT * FROM entity WHERE kind=:kind AND model=:model ORDER BY name';
  var d = { 
    ':kind': 'place',
    ':model': model
  };
  
  $.post(modelPaper.qUrl, { data: d, query: q }, function(data) {
    for(var i in data) {
      var place = data[i];
      var o = $('<option />').text(place.name).val(place.id);
      loc.append(o);
    }
  });  
  
  modal.append(wrap);  

  modal.reveal({
    animation: 'none'
  });
  
  txt.focus();
  btn.click(function() {
    var t = txt.val();
    var l = loc.val();
    var k = 'place';
    
    saveEntity(t, l, k, getQueryParams().model);
    
    $(modal).find('a').click();
  });  
}

function addEntity() {
  var modal = $('#myModal');
  var title = $('<h1 />').text('Add an Entity');
  modal.html(title);
  
  var model = getQueryParams().model;
  
  var wrap = $('<div />').addClass('item');
  
  var close = $('<a />').addClass('close-reveal-modal');
  close.html('&#215;');
  modal.append(close);
  
  var s = $('<span />').text('in');
  
  var txt = $('<input >').attr({
    name: 'name',
    type: 'text',
    placeholder: 'Name',
    required: 'true'
  });
  
  var loc = $('<select />').attr({
    name: 'location',
    required: 'true'
  });
  
  var span = $('<span />').text('is');
  
  var kind = $('<select />').attr({
    name: 'kind',
    required: 'true'
  });
  var o1 = $('<option />').val('stable').text('stable');
  var o2 = $('<option />').val('transient').text('transient');
  kind.append(o1).append(o2);
  
  var btn = $('<input />').attr('type', 'button').val('Add Entity');
  
  wrap.append(txt).append(s).append(loc).append(span).append(kind).append(btn);
  
  var q = 'SELECT * FROM entity WHERE kind=:kind AND model=:model ORDER BY name';
  var d = { ':kind': 'place', ':model': model };
  
  $.post(modelPaper.qUrl, { data: d, query: q }, function(data) {
    for(var i in data) {
      var place = data[i];
      var o = $('<option />').text(place.name).val(place.id);
      loc.append(o);
    }
  });  
  
  modal.append(wrap);
  
  modal.reveal({
    animation: 'none'
  });  
  
  txt.focus();
  btn.click(function() {
    var t = txt.val();
    var l = loc.val();
    var k = kind.val();
    
    saveEntity(t, l, k, model);
    
    $(modal).find('a').click();
  });  
}

function addHypothesis() {
  var modal = $('#myModal');
  var title = $('<h1 />').text('Add a Hypothesis');
  modal.html(title);
  
  var wrap = $('<div />').addClass('item');
  
  var close = $('<a />').addClass('close-reveal-modal');
  close.html('&#215;');
  modal.append(close);
  
  var model = getQueryParams().model;

  var start = $('<select />').attr('name', 'start');  
  var end = $('<select />').attr('name', 'end');
  var type = $('<select />').attr('name', 'type');
  type.append($('<option />').text('increases').val('increases'));
  type.append($('<option />').text('decreases').val('decreases'));
  type.css('margin-left', '1em');
  var btn = $('<input />').attr('type', 'button').val('Add Hypothesis');
  var text = $('<span />').text('with');
  
  var q = 'SELECT DISTINCT e.id as id, e.name as name, f.name as loc FROM entity e, entity f ' +
    'WHERE e.location=f.id AND e.model=:id ORDER BY e.name';
    
  var data = { ':id': model };
  
  $.post(modelPaper.qUrl, { data: data, query: q }, function(d) {
    for(var i in d) {
      var row = d[i];
      var str = row.name + ' in ' + row.loc;
      var opt = $('<option />').val(row.id).text(str);
      start.append(opt);
      end.append(opt.clone());
    }
  });
  
  wrap.append(start).append(type).append(text).append(end).append(btn);
  
  modal.append(wrap);

  modal.reveal({
    animation: 'none'
  });  
  
  start.focus();
  
  btn.click(function() {
    var st = start.val();
    var ty = type.val();
    var en = end.val();
    
    saveHypothesis(st, ty, en, model);
    
    $(modal).find('a').click();
  });
}

function addFact() {
  var modal = $('#myModal');
  var title = $('<h1 />').text('Add an Empirical Fact');
  modal.html(title);
  
  var wrap = $('<div />').addClass('item');
  var close = $('<a />').addClass('close-reveal-modal').html('&#215;');
  modal.append(close);
  
  
  var start = $('<select />').attr('name', 'start');  
  var end = $('<select />').attr('name', 'end');
  var type = $('<select />').attr('name', 'type');
  type.append($('<option />').text('increases').val('increases'));
  type.append($('<option />').text('decreases').val('decreases'));
  type.append($('<option />').text('does not change').val('does not change'));
  type.css('margin-left', '1em');
  var btn = $('<input />').attr('type', 'button').val('Add Fact');
  var text = $('<span />').text('with');
  
  var q = 'SELECT DISTINCT e.id as id, e.name as name, f.name as loc FROM entity e, entity f ' +
    'WHERE e.location=f.id AND e.model=:id AND e.kind <> :kind';
    
  var data = { ':id': getQueryParams().model, ':kind': 'place' };
  
  $.post(modelPaper.qUrl, { data: data, query: q }, function(d) {
    for(var i in d) {
      var row = d[i];
      var str = row.name + ' in ' + row.loc;
      var opt = $('<option />').val(row.id).text(str);
      start.append(opt);
      end.append(opt.clone());
    }
  });
  
  wrap.append(start).append(type).append(text).append(end).append(btn);
  
  modal.append(wrap);
  
  modal.reveal({
    animation: 'none'
  });
  
  start.focus();
  
  btn.click(function() {
    var st = start.val();
    var ty = type.val();
    var en = end.val();
    var model = getQueryParams().model;
    
    saveFact(st, ty, en, model);
    
    $(modal).find('a').click();
  });
}

function zoomIn() {
  // if(zoom < 3.0) {
  //   zoom += 0.1;
  //   redrawEverything();
  // }
  zoom = 1.1;
  zoomTimes++;
  redrawEverything();
}

function zoomOut() {
 //  if(zoom > 0.2) {
 //    zoom -= 0.1;
 //    redrawEverything();
 // }
 zoom = 0.9;
 zoomTimes++;
 redrawEverything();
}

function zoomReset() {
  modelPaper.resetZoom();
  factPaper.resetZoom();
}

function redrawEverything() {
  modelPaper.redraw();
  factPaper.redraw();
}

function clearEverything() {
  showFacts = $('#facts').is(':visible');
  $('#btnFacts').html('Show Facts');
  $('#facts').show();
  $('#right, #facts, div.group > div').html('');
  $('#predictions').remove();
  modelPaper = initCanvas();
  factPaper = initFacts();
}