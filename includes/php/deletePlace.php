<?
include_once('db.php');
initCustom('../db/main.db');
$db = $GLOBALS['db'];
$id = intval($_REQUEST['id']);
$num = 0;

$db->beginTransaction();

// find all entities associated with this place
$q1 = 'SELECT * FROM entity WHERE location=:id';

// delete associated entities, placements, links and facts
$results = pQuery($q1, array(':id'=>$id));
foreach($results as $r) {
  $q2 = 'DELETE FROM placement WHERE entity=:id';
  $num += pStmt($q2, array(':id'=>$r['id']));
  $q3 = 'DELETE FROM link WHERE start=:id OR end=:id';
  $num += pStmt($q3, array(':id'=>$r['id']));
  $q4 = 'DELETE FROM fact WHERE start=:id OR end=:id';
  $num += pStmt($q4, array(':id'=>$r['id']));
}

// actually delete the place
$q5 = 'DELETE FROM entity WHERE id=:id';
$num += pStmt($q5, array(':id'=>$id));

$db->commit();

print json_encode(array('rows_affected'=>$num), true);

close();
?>