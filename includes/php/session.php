<?
function isLoggedIn() {
  return isset($_SESSION['loggedIn']);
}

function loginRequired() {
  if(!isLoggedIn())
    header('Location: ../');
}

function logout() {
  // logs a user out of the session completely
  session_destroy();
  header('Location: ../');
}

?>