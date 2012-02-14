<?
include_once(realpath('db.php'));
$GLOBALS['dbFile'] = realpath('../db/main.db');
init();

$q = $_POST['query'];
$d = $_POST['data'];
$r = null;

if($d == null) {
  $r = query($q);
} else {
  $r = pQuery($q, $d);
}

print json_encode($r);

close();
?>