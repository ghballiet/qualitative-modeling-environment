<?
include_once('../includes/php/db.php');
$GLOBALS['dbFile'] = realpath('../includes/db/main.db');
init();

function getInfo($id, $model) {
  $model = intval($model);    
  $id = intval($id);

  $q = 'SELECT e.*, e2.name AS loc FROM entity e, entity e2 WHERE ' . 
    'e.model=:id AND e.id=:eid AND ((e.location=e2.id) OR ' . 
    ' (e.id<=:amt)) AND e2.model=:id ORDER BY e.kind, e.name, e2.name';

  $res = pQuery($q, array(':id'=>$model, ':eid'=>$id, 
    ':amt'=>0));
    
  if(sizeof($res) == 0) {
    $q = 'SELECT * FROM entity WHERE id=:id';
    return pQuery($q, array(':id'=>$id));
  }
  return $res;
}

function toName($name) {
  $name = strtoupper($name);
  $name = str_replace(' ','-', $name);
  return $name;
}

function toNamedParams($name) {
  
}

$model = $_GET['model'];
$type = $_GET['type'];
$excludeShapes = $_GET['excludeShapes'];
$excludeLinks = $_GET['excludeLinks'];
$excludeFacts = $_GET['excludeFacts'];

$model = intval($model);
$res = null;

$qExcludeShapes = 'SELECT e.*, e2.name AS loc FROM entity e, entity e2 WHERE ' . 
  'e.model=' . $model . ' AND ((e.location<>-1 AND e.location=e2.id) OR ' .
  'e.location=0 AND e2.id=e.id) AND e2.model=' . $model . 
  ' AND e.id NOT IN (' . $excludeShapes . ') AND e2.id NOT IN (' . $excludeShapes . ') ORDER BY ' . 
  'e.kind, e.name, e2.name';
$qShapes = 'SELECT e.*, e2.name AS loc FROM entity e, entity e2 WHERE ' . 
  'e.model=:id AND ((e.location<>:amt AND e.location=e2.id) OR ' .
  'e.location=0 AND e2.id=e.id) AND e2.model=:id ORDER BY ' . 
  'e.kind, e.name, e2.name';
if(!isset($_GET['excludeShapes']) || $excludeShapes == null)
  $res = pQuery($qShapes, array(':id'=>$model, ':amt'=>-1));
else
  $res = query($qExcludeShapes);

$str = '';

foreach($res as $r) {
  $name = $r['name'];
  $loc = $r['loc'];
  $kind = $r['kind'];
  
  $name = toName($name);
  $loc = toName($loc);
  
  if($r['location'] != 0)
    $str .= sprintf("%s %s in the %s\n", $kind, $name, $loc);
  else
    $str .= sprintf("%s %s\n", $kind, $name);
}

$r3 = null;

$qExcludeLinks = 'SELECT * FROM link WHERE model=' . $model . ' AND id NOT IN (' . $excludeLinks . ')';
$qLinks = 'SELECT * FROM link WHERE model=:id';
if(!isset($_GET['excludeLinks']) || $excludeLinks == null)
  $r3 = pQuery($qLinks, array(':id'=>$model));
else
  $r3 = query($qExcludeLinks);

foreach($r3 as $r) {
  $sInfo = getInfo($r['start'], $model);
  $sInfo = $sInfo[0];
  $eInfo = getInfo($r['end'], $model);
  $eInfo = $eInfo[0];
  
  $str .= sprintf("claim %s in the %s %s with %s in the %s\n",
    toName($sInfo['name']), toName($sInfo['loc']), toName($r['type']), 
    toName($eInfo['name']), toName($eInfo['loc']));
}

$qExcludeFacts = 'SELECT * FROM fact WHERE model=' . $model . ' AND id NOT IN (' . $excludeFacts . ')';
$qFacts = 'SELECT * FROM fact WHERE model=:id';
$r2 = null;

if(!isset($_GET['excludeFacts']) || $excludeFacts == null)
  $r2 = pQuery($qFacts, array(':id'=>$model));
else
  $r2 = query($qExcludeFacts);

foreach($r2 as $r) {
  $sInfo = getInfo($r['start'], $model);
  $sInfo = $sInfo[0];
  $eInfo = getInfo($r['end'], $model);
  $eInfo = $eInfo[0];
  
  $str .= sprintf("fact %s in the %s %s with %s",
    toName($sInfo['name']), toName($sInfo['loc']), toName($r['type']),
    toName($eInfo['name']));
  
  if($eInfo['loc'] != null)
    $str .= sprintf(" in the %s", toName($eInfo['loc']));
  
  $str .= "\n";
}

$str .= "done\n";

$txtPath = tempnam('/tmp', 'lsp');
$encodePath = tempnam('/tmp', 'lsp');
$txtFile = fopen($txtPath, 'a+');
$encodeFile = fopen($encodePath, 'a+');
$encodeContents = file_get_contents(realpath('../includes/lisp/encode2.lisp'));

$top = '(load "newqual")' . "\n" .
  '(load-content "' . $txtPath . '")';

fwrite($txtFile, $str);

$encodeContents = $top . $encodeContents;
fwrite($encodeFile, $encodeContents);
fclose($txtFile);
fclose($encodeFile);

// printf("%o\n", fileperms($txtPath));
// 
// printf("%o", fileperms($txtPath));
chmod($txtPath, 0777);
chmod($encodePath, 0755);

// printf("%o", filename($txtPath));
// 
// printf("%o\n", fileperms($txtPath));

$arr = array('places', 'quantities', 'claims', 'facts', 'predictions', 'beliefs');

$cmd = realpath('../includes/lisp/get_struct2.sh') . ' ' . $type . ' ' . 
  realpath($encodePath);

print shell_exec($cmd);

?>