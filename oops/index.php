<?
$_POST['extra_css'] = array('oops.css', 'login.css');
$_POST['extra_js'] = array('jquery.placeholder.min.js');
$_POST['loggedInRedirect'] = '../gallery';
include_once('../template/before.php');
?>

<div class="wrap">
  <div id="menu">
    <h1>Fill in the form below to reset your password.</h1>
    <?
    if(isset($_SESSION['errorMsg'])) {
      printf('<p class="err">%s</p>', $_SESSION['errorMsg']);
      unset($_SESSION['errorMsg']);
    }
    ?>
    <form id="login" action="oops.php" method="post">
      <input type="submit" id="cont" value="Reset Password"/>
    </form>
  </div>
</div>

<?
include_once('../template/after.php');
?>