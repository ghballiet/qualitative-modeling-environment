<?
include_once('../includes/php/db.php');
init();

$name = $_POST['name'];
$desc = $_POST['desc'];
$userId = $_POST['uid'];

$db = $GLOBALS['db'];
$db->beginTransaction();
$q1 = 'INSERT INTO model VALUES (NULL, :name, :desc)';
pStmt($q1, array(
  ':name' => $name,
  ':desc' => $desc
));

$q2 = 'SELECT MAX(id) AS id FROM model';
$rows = query($q2);
$id = $rows[0]['id'];

$q3 = 'INSERT INTO owns VALUES (:model, :user)';
pStmt($q3, array(
  ':model' => $id,
  ':user' => $userId
));

$db->commit();
close();

header('Location: ../');
?>