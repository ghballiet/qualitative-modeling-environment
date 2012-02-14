<?
include_once('db.php');
initCustom('../db/main.db');
$db = $GLOBALS['db'];
$id = intval($_REQUEST['id']);
$num = 0;

$db->beginTransaction();

// delete the entity, and any links
$q2 = 'DELETE FROM placement WHERE entity=:id';
$num += pStmt($q2, array(':id'=>$id));
$q3 = 'DELETE FROM link WHERE start=:id OR end=:id';
$num += pStmt($q3, array(':id'=>$id));
$q4 = 'DELETE FROM fact WHERE start=:id OR end=:id';
$num += pStmt($q4, array(':id'=>$id));

// actually delete the entity
$q5 = 'DELETE FROM entity WHERE id=:id';
$num += pStmt($q5, array(':id'=>$id));

$db->commit();

print json_encode(array('rows_affected'=>$num), true);

close();
?>