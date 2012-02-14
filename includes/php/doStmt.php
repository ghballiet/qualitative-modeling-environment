<?
include_once(realpath('db.php'));
$GLOBALS['dbFile'] = realpath('../db/main.db');
init();

$q = $_POST['query'];
$queries = explode(';', $q);
$d = $_POST['data'];
$r = null;

if(sizeof($queries) > 1) {
  foreach($queries as $q2) {
    query($q2);
  }
  print json_encode(array('Done.'));
} else {
  if($d == null) {
    $r = query($q);
  } else {
    $r = pStmt($q, $d);
  }

  print json_encode($r);  
}

close();
?>