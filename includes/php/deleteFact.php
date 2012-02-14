<?
include_once('db.php');
initCustom('../db/main.db');
$db = $GLOBALS['db'];
$id = intval($_REQUEST['id']);
$num = 0;

$db->beginTransaction();

// delete the fact
$q = 'DELETE FROM fact WHERE id=:id';
$num += pStmt($q, array(':id'=>$id));

$db->commit();

print json_encode(array('rows_affected'=>$num), true);

close();
?>