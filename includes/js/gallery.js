$(document).ready(function() {
  var dbUrl = '../includes/php/doQuery.php';
  var deleteModelUrl = '../includes/php/deleteModel.php';
  
  function getModels() {
    var data = {};
    var userId = $('#userId').val();
    var query = 'SELECT DISTINCT m.* FROM model m, owns o, user u WHERE (m.id=o.model_id ' + 
      'AND o.user_id=' + userId + ') OR (u.id=' + userId + ' AND u.isAdmin=1) ORDER BY m.name';
    $.post(dbUrl, { query: query, data: data }, function(d) {
      d = $.parseJSON(d);
      for(var i in d) {
        addModel(d[i]);
      }
    });
  }
  
  function addModel(data) {
    var div = $('<div />');
    div.attr('id', 'model' + data.id).addClass('model');
    var del = $('<a />').attr('href', '#').addClass('delete').html('&#215;').click(function(e) {
      e.preventDefault();
      deleteModel(data.id);
    });
    var url = '../home?model=' + data.id;
    var link = $('<a />').attr('href', url).addClass('link');
    var title = $('<h3 />');
    var par = $('<p />').text(data.description);
    title.text(data.name);
    if(data.name.indexOf('- Pollution') == -1 && data.name.indexOf('- Predator/Prey') == -1)
      link.html(del);
    link.append(title);
    link.append(par);
    div.append(link);
    $('#models').append(div);
  }
  
  function deleteModel(id) {
    var data = { model: id };
    if(confirm('Are you sure you want to delete this model?')) {
      $.post(deleteModelUrl, data, function(d) {
        console.log(d);
        var div = $('#model' + id);
        div.fadeOut('fast', function() { div.remove(); });
      });
    }
  }
  
  getModels();
});