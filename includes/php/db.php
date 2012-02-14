<?
$GLOBALS['db'] = null;
$GLOBALS['dbFile'] = realpath('../includes/db/main.db');

function doMD5($string) {
  return md5($string);
}

// rewritten to work with PDO instead
function init() {  
  $GLOBALS['db'] = new PDO('sqlite:' . $GLOBALS['dbFile']);
  $GLOBALS['db']->sqliteCreateFunction('md5','doMD5');
}

function initCustom($loc) {
  $GLOBALS['db'] = new PDO('sqlite:' . realpath($loc));
  $GLOBALS['db']->sqliteCreateFunction('md5','doMD5');
}

function init2() {
  $GLOBALS['db'] = new PDO('sqlite:' . realpath('../db/main.db'));
  $GLOBALS['db']->sqliteCreateFunction('md5','doMD5');
}

function close() {
  $GLOBALS['db'] = null;
}

// simply executes a query
function query($q) {
  $query = $GLOBALS['db']->query($q);
  $rows = $query->fetchAll();

  return $rows;
}

function stmt($q) {
  return $GLOBALS['db']->exec($q);
}

// executes a parameterized Query
function pQuery($q, $items) {
  $stmt = $GLOBALS['db']->prepare($q);
  $stmt->execute($items);
  $result = $stmt->fetchAll();

  return $result;
}

function pStmt($q, $items) {
  $stmt = $GLOBALS['db']->prepare($q);
  $val = $stmt->execute($items);
    
  return $val;
}

?>