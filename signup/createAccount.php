<?
date_default_timezone_set('America/Phoenix');
// session_start();
include_once('../includes/php/db.php');
init();

$name = $_POST['name'];
$surname = $_POST['surname'];
$email = $_POST['email'];
$pass = md5($_POST['password']);

$q = 'INSERT INTO user VALUES (NULL, :name, :surname, :email, :pass, 0)';
$d = array(
  ':name' => $name,
  ':surname' => $surname,
  ':email' => $email,
  ':pass' => $pass
);
pStmt($q, $d);

$t1 = sprintf('%s %s - Pollution', $name, $surname);
$t2 = sprintf('%s %s - Predator/Prey', $name, $surname);
$desc = sprintf('Created %s by %s', date('r'), $email);

$qm = 'INSERT INTO model VALUES (NULL, :name, :desc)';
pStmt($qm, array(':name' => $t1, ':desc' => $desc));
pStmt($qm, array(':name' => $t2, ':desc' => $desc));

$rm = query(sprintf('SELECT id FROM model WHERE name LIKE "%%%s %s%%"', addslashes($name), addslashes($surname)));

$q2 = 'SELECT id FROM user WHERE name=:name AND surname=:surname AND email=:email';
$d2 = array(':name' => $name, ':surname' => $surname, ':email' => $email);
$r2 = pQuery($q2, $d2);
$r2 = $r2[0];
$id = $r2['id'];

foreach($rm as $row) {
  $q = 'INSERT INTO owns VALUES (:model, :user)';
  $d = array(':model' => $row['id'], ':user' => $id);
  pStmt($q, $d);
}

$_POST['msg'] = 'Account created. Please log in below.';
header('Location: ../login');

close();
?>