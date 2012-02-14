<?
include_once('db.php');
initCustom('../db/main.db');
$db = $GLOBALS['db'];
$model = intval($_REQUEST['model']);
$num = 0;

$db->beginTransaction();
// delete all facts associated with the model
$num += pStmt('DELETE FROM fact WHERE model=:model', array(':model'=>$model));

// delete all hypotheses associated with the model
$num += pStmt('DELETE FROM link WHERE model=:model', array(':model'=>$model));

// delete all entities associated with the model (and their respective
// placements)
$rows = pQuery('SELECT * FROM entity WHERE model=:model', array(':model'=>$model));
foreach($rows as $r) {
  $id = intval($r['id']);
  $num += pStmt('DELETE FROM placement WHERE entity=:id', array(':id'=>$id));
  $num += pStmt('DELETE FROM entity WHERE id=:id', array(':id'=>$id));
}

// delete ownership of the model
$num += pStmt('DELETE FROM owns WHERE model_id=:model', array(':model'=>$model));

// delete the model
$num += pStmt('DELETE FROM model WHERE id=:model', array(':model'=>$model));

$db->commit();

print json_encode(array('rows_affected'=>$num), true);

close();
?>