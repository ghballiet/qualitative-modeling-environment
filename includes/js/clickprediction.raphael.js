function clickPred(pred) {
  // fade everything out
  modelPaper.fadeOut(pred);

  // build a set of explanation objects
  var explanationSet = pred.paper.set();
  
  // highlight each explanation
  for(var i in pred.explanations) {
    var explanation = pred.explanations[i];
    var direction = explanation[0];
    var paths = explanation[1];
    
    if(direction == null) {
      var lId = paths[0].toLowerCase().replace(/-/g, ' ');
      var direction = modelPaper.relLinks[lId].kind;
    }
    
    // clean up direction
    direction = direction.toLowerCase().replace(/-/g, '');
    
    // put all links in a single group
    var linkSet = pred.paper.set();
    linkSet.direction = direction;
    
    // for each path, highlight the relevant link
    for(var j in paths) {
      var linkId = paths[j];
      linkId = linkId.toLowerCase().replace(/-/g, ' ');
      var link = modelPaper.relLinks[linkId];
      link.highlight(pred.paper.colors[direction + 'Stroke']);
      linkSet.push(link);        
    }
    // save the links
    explanationSet.push(linkSet);
    linkSet.parent = explanationSet;
    
    // find the first element in the set without a label
    var first = null;
    
    var k;
    for(k=0; k<linkSet.length; k++) {
      if(linkSet[k].label == null) {
        first = linkSet[k];
        break;
      }
    }
    
    // get the number
    var num = parseInt(i);
    
    // add the label
    var label = first.showLabel(num + 1, 0);
    linkSet.label = label;
    
    // save the links with the bg
    label[0].links = linkSet;
    
    // set up the select behavior
    label[0].select = function() {
      var explanations = this.links.parent;
      
      var e;
      for(e=0; e<explanations.length; e++) {
        explanations[e].label.attr('opacity', .4);
        var f;
        for(f=0; f<explanations[e].length; f++) {
          explanations[e][f].highlight(this.links.direction);
        }
      }
      
      this.attr('opacity', .8);
      this.text.attr('opacity', .8);
      
      var g;
      for(g=0; g<this.links.length; g++) {
        this.links[g].select(this.links.direction);       
      }
      
      this.toFront();
      this.text.toFront();
    };
    
    label[0].click(function() {
      this.select();
    });
  }
  
  if(explanationSet.length == 1) {
    explanationSet[0].label[0].select();
  }
}