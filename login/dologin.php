<?
session_start();
$email = $_POST['email'];
$password = $_POST['password'];
include_once(realpath('../includes/php/db.php'));
init();

$password = md5($password);

$q = 'SELECT * FROM user WHERE email=:email AND password=:pass';
$d = array(
  ':email' => $email,
  ':pass' => $password
);

$results = pQuery($q, $d);

if(sizeof($results) != 1) {
  $_SESSION['errorMsg'] = 'Invalid login. Please try again.';
  header('Location: ../login');
} else {
 doLogin($results[0]['name'], $results[0]['surname'], $results[0]['email'], $results[0]['id'], $results[0]['isAdmin']);
}

function doLogin($name, $surname, $email, $id, $isAdmin) {
  $_SESSION['name'] = $name;
  $_SESSION['surname'] = $surname;
  $_SESSION['userName'] = $name . ' ' . $surname;
  $_SESSION['email'] = $email;
  $_SESSION['loggedIn'] = true;
  $_SESSION['avatar'] = 'http://gravatar.com/avatar/' . md5($email);
  $_SESSION['userId'] = $id;
  $_SESSION['isAdmin'] = $isAdmin == 1;
  header('Location: ../gallery');
}

close();
?>