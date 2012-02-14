<?
$_POST['extra_js'] = array(
  '../js/ajax.raphael.js',
  '../js/drag.raphael.js',
  '../js/functions.raphael.js',
  '../js/text.raphael.js',
  '../js/explanations.raphael.js',
  '../js/places.raphael.js',
  '../js/entities.raphael.js',
  '../js/links.raphael.js',
  '../js/clickprediction.raphael.js',
  '../js/predictions.raphael.js',
  '../js/facts.raphael.js',
  '../js/init.raphael.js',
  '../js/functions.jquery.js'
);
$_POST['loginRequired'] = md5(true);
$model = $_GET['model'];
include_once('../template/before.php');
include_once('../includes/php/db.php');
init();
$q = 'SELECT * FROM owns WHERE user_id=:id AND model_id=:model';
$id = $_SESSION['userId'];
$r = pQuery($q, array(':id'=> $id, ':model'=> $model));
if(sizeof($r) != 1 && !$_SESSION['isAdmin']) {
  printf('<script type="text/javascript">');
  printf('document.location = "../"');
  printf('</script>');
}
?>
<div id="left">
  <div class="group">
    <h1>Places</h1>
    <div id="places"></div>
  </div>
  <div class="group">
    <h1>Entities</h1>
    <div id="entities"></div>
  </div>
  <div class="group">
    <h1>Hypotheses</h1>
    <div id="links"></div>
  </div>
</div>
<div id="left2">
  <div class="group">
    <h1>Empirical Facts</h1>
    <div id="empirical-facts"></div>
  </div>
</div>
<div id="facts"></div>
<div id="right"></div>

<?
close();
include_once('../template/after.php');
?>