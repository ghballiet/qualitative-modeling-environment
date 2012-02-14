<?
$_POST['extra_css'] = array('login.css');
$_POST['extra_js'] = array('jquery.placeholder.min.js');
$_POST['loggedInRedirect'] = '../gallery';
include_once('../template/before.php');
?>

<div class="wrap">
  <div id="menu">
    <h1>Welcome! Please log in.</h1>
    <?
    if(isset($_SESSION['errorMsg'])) {
      printf('<p class="err">%s</p>', $_SESSION['errorMsg']);
      unset($_SESSION['errorMsg']);
    } else if(isset($_SESSION['msg'])) {
      printf('<p class="msg">%s</p>', $_SESSION['msg']);
      unset($_SESSION['msg']);
    }
    ?>
    <form id="login" action="dologin.php" method="post">
      <input type="email" name="email" id="email" required placeholder="user@email.com"/>
      <input type="password" name="password" id="password" required placeholder="password"/>
      <input type="submit" value="Continue"/>
    </form>
    <!-- <a class="retrievePassword" href="../oops">I forgot my password.</a> -->
  </div>
</div>

<?
include_once('../template/after.php');
?>