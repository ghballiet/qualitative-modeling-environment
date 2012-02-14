<?
include_once(realpath('db.php'));
$GLOBALS['dbFile'] = realpath('../db/main.db');
init();

$q = $_POST['query'];
$r = null;

$r = stmt($q);

print json_encode($r);

close();
?>