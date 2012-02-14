<?
$_POST['extra_css'] = array('login.css');
$_POST['extra_js'] = array('jquery.placeholder.min.js', 'verifySignUp.min.js');
$_POST['loggedInRedirect'] = '../gallery';
include_once('../template/before.php');
?>

<div class="wrap">
  <div id="menu">
    <h1>Fill in the form to create an account.</h1>
    <?
    if(isset($_SESSION['errorMsg'])) {
      printf('<p class="err">%s</p>', $_SESSION['errorMsg']);
      unset($_SESSION['errorMsg']);
    }
    ?>
    <form id="login" action="createAccount.php" method="post">
      <input type="text" name="name" id="name" required placeholder="First Name"/>
      <input type="text" name="surname" id="surname" required placeholder="Last Name"/>
      <input type="email" name="email" id="email" required placeholder="Email Address"/>
      <input type="email" name="email2" id="email2" required placeholder="Confirm Email Address"/>
      <input type="password" name="password" id="password" required placeholder="Password"/>
      <input type="password" name="password2" id="password2" required placeholder="Confirm Password"/>
      <input type="submit" id="cont" value="Enter your first name." class="err" disabled="disabled"/>
    </form>
  </div>
</div>

<?
include_once('../template/after.php');
?>