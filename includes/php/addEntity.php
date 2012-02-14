<?
include_once('db.php');
initCustom('../db/main.db');

$name = $_REQUEST['name'];
$kind = $_REQUEST['kind'];
$loc = $_REQUEST['loc'];
$model = $_REQUEST['model'];
$x = $_REQUEST['x'];
$y = $_REQUEST['y'];
$w = $_REQUEST['w'];
$h = $_REQUEST['h'];

$shape = null;
$placement = null;

$db = $GLOBALS['db'];
$db->beginTransaction();

// first, create a new entity
$q1 = sprintf('INSERT INTO entity VALUES (NULL,"%s","%s",%s,%s)',
  $name, $kind, $loc, $model);
$db->exec($q1);

// fetch the ID of the new entity
$rows = query('SELECT MAX(id) AS id FROM entity');
$id = $rows[0]['id'];


// insert the appropriate values into placement
$q2 = sprintf("INSERT INTO placement VALUES(%s,%s,%s,%s,%s)",
  $id, $x, $y, $w, $h);
$db->exec($q2);
  
// grab the newest values
$shape = query('SELECT * FROM entity WHERE id=' . $id);
$placement = query('SELECT * FROM placement WHERE entity=' . $id);

$shape = $shape[0];
$placement = $placement[0];

$data = array(
  'id'=>$shape['id'],
  'name'=>$shape['name'],
  'kind'=>$shape['kind'],
  'loc'=>$shape['location'],
  'model'=>$shape['model'],
  'x'=>$placement['x'],
  'y'=>$placement['y'],
  'width'=>$placement['width'],
  'height'=>$placement['height']
);

print json_encode($data, true);

// commit all the changes
$db->commit();

close();
?>