var colors = {
  // placeFill: '#333333',
  // placeStroke: '#1a1a1a',
  placeFill: '#efefef',
  placeStroke: '#999',
  stableFill: '#0393cd',
  stableStroke: '#036f9a',
  transientFill: '#c67605',
  transientStroke: '#945904',
  increasesStroke: '#46a546',
  decreasesStroke: '#9d261d',
  // increasesStroke: 'green',
  // decreasesStroke: 'red',
  // doesnotchangeStroke: 'yellow'
  doesnotchangeStroke: '#ffc40d',
  variesambiguouslyStroke: '#7a43b6'
};

var modelPaper = null;
var factPaper = null;
var paperWidth = null;
var paperHeight = null;
var showFacts = false;
var zoom = 1.0; 
var zoomTimes = 0;

$(document).ready(function() {
  modelPaper = initCanvas();
  factPaper = initFacts();
  $('#left, #left2').draggable({
    containment: 'parent',
    stack: '#left, #left2'
  });
  $('#right, #facts').draggable({
    containment: 'parent',
    stack: '#right, #facts',
    cancel: 'svg'
  }).resizable();
  $('#facts').resizable('option', 'alsoResize', '#right, #right svg, #facts svg');
});

function initCanvas() {
  $.ajaxSetup({
    dataType: 'json'
  });
  
  paperHeight = $('#right').height();  
  paperWidth = $('#right').width();
  
  if($.browser.mozilla && paperHeight < 900)
    paperHeight = 900;

  var paper = Raphael('right', paperWidth, paperHeight);
  paper.model = parseInt(getQueryParams()['model']);
  $('#right').prepend($('<h1 />').text('Hypotheses'));
  $('#right').resizable({
    'alsoResize': '#facts, #facts svg, #right svg',
    'handles': 'se'
  });
  
  paper.qUrl = '../includes/php/doQuery.php';
  paper.sUrl = '../includes/php/doStmt.php';
  paper.dbUrls = {
    entity: '../includes/php/addEntity.php',
  };
  paper.allShapes = {};
  paper.relShapes = {};
  paper.allLinks = {};
  paper.allLinkData = {};
  paper.allLinkSet = null;
  paper.relLinks = {};
  paper.labels = paper.set();
  paper.allPlaces = {};
  paper.allEntities = {};
  paper.allHypotheses = {};
  
  paper.highlighted = null;
  
  paper.showFacts = false;

  paper.colors = colors;
  
  paper.getPlaces();  
  return paper;
}

function initFacts() {
  $.ajaxSetup({
    dataType: 'json'
  });

  var paper = Raphael('facts', paperWidth, paperHeight);
  paper.model = parseInt(getQueryParams()['model']);
  $('#facts').prepend($('<h1 />').text('Facts and Predictions'));
  $('#facts').resizable({
    'alsoResize': '#right, #right svg, #facts svg',
    'handles': 'se'
  });

  paper.qUrl = '../includes/php/doQuery.php';
  paper.sUrl = '../includes/php/doStmt.php';
  paper.allShapes = {};
  paper.relShapes = {};  
  paper.allLinks = {};
  paper.allLinkData = {};
  paper.allLinkSet = null;
  paper.allPlaces = {};
  paper.allEntities = {};
  paper.allHypotheses = {};

  paper.showFacts = true;

  paper.colors = colors;

  paper.getPlaces();
    
  return paper;
  
  if(showFacts)
    $('#btnFacts').click();
} 

function canvasLoaded() {
}