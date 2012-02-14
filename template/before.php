<?
date_default_timezone_set('America/Phoenix');
session_start();
include_once('../includes/php/session.php');
if($_POST['loginRequired'] == md5(true))
  loginRequired();
if(isset($_POST['loggedInRedirect']) && isLoggedIn())
  header('Location: ' . $_POST['loggedInRedirect']);
  
function menuLink($text, $url) {
  printf('<li><a href="%s" tabindex="-1">%s</a></li>', $url, $text);
}
?>
<html>
  <head>
    <!-- meta -->
    <meta http-equiv="imagetoolbar" content="false"/>
    <meta name="viewport" content="width=device-width;
				   initial-scale=1.0;
				   maximum-scale=1.0;
				   user-scalable=0;"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <meta name="apple-mobile-web-app-status-bar-style"
	  content="black"/>
    <meta name="format-detection" content="telephone=no"/>
    <meta name="robots" content="noindex, nofollow">
    
    <!-- css -->
    <!--<link href='http://fonts.googleapis.com/css?family=Chivo:400,900'
      rel='stylesheet' type='text/css'> -->
    <link href='http://fonts.googleapis.com/css?family=Signika+Negative:300,400,700|Droid+Sans:400,700|Pacifico'
      rel='stylesheet' type='text/css'>
    <link type="text/css" rel="stylesheet"
      href="../includes/css/reveal.css">    
    <link type="text/css" rel="stylesheet" 
      href="../includes/css/style.css">
    <link type="text/css" rel="stylesheet"
      href="../includes/css/text.css">
    <link type="text/css" rel="stylesheet"
      href="../includes/css/dialog.css">
    <?
    if(isset($_POST['extra_css'])) {
      foreach($_POST['extra_css'] as $css)
        printf('<link type="text/css" rel="stylesheet" href="../includes/css/%s">',
          $css);
    }
    ?>

    <!-- js -->
    <script src="../includes/js/modernizr.custom.js"></script>
    <script src="../includes/js/raphael-min.js"></script>
    <script src="../includes/js/jquery-1.6.2.min.js"></script>
    <script src="../includes/js/jquery-ui-custom.min.js"></script>
    <script src="../includes/js/jquery.reveal.js"></script>
    <script src="../includes/js/g.raphael.js"></script>
<?
if(isset($_POST['extra_js'])) {
  foreach($_POST['extra_js'] as $js) {
    printf("    <script src=\"../includes/min/%s\"></script>\n", 
      $js);
  }
}
?>
    
    <script>
    if($.browser.mozilla) {
      var link = $('<link>').attr('type','text/css');
      link.attr('rel','stylesheet');
      link.attr('href','../includes/css/ff.css');
      $('head').append(link);
    }      
    
    Modernizr.load({
      test: Modernizr.flexbox,
      nope: '../includes/js/flexie.min.js'
    });
    </script>

    <title>Systems Modeling</title>
  </head>
  <body>
    <input type="hidden" name="userId" value="<? echo $_SESSION['userId']; ?>" id="userId">
    <div id="wrapper">
      <div id="top">
        <div id="logo"><a href="../" tabindex="-1">modello</a></div>
<?
if(isLoggedIn()) {
?>      
        <div class="userinfo">
          <!-- <img src="<? echo $_SESSION['avatar']; ?>" class="avatar"/> -->
        </div>
        <ul class="actions">
<?
menuLink('View Models', '../gallery');
menuLink('Logout', '../logout');
?>
        </ul>
<?
} else {
?>
        <ul class="actions">
<?
menuLink('Create an Account', '../signup');
menuLink('Sign In', '../login');
?>
        </ul>
<? 
}
?>        
      </div>
      <div id="header">
        <div id="nav">
          <span id="btnText">Show Text</span>
          <!-- <span id="btnGraphics">Hide Graphics</span> -->
          <span id="addPlace">Add Place</span>
          <span id="addEntity">Add Entity</span>
          <span id="addHypothesis">Add Hypothesis</span>
          <span id="addFact">Add Empirical Fact</span>
          <!-- <span id="btnPrint">Print Diagram</span> -->
          <span id="btnFacts">Show Facts</span>
          <span id="btnPredictions">Show Predictions</span>
          <span id="btnReset">Reset Model</span>
          <div id="zoomControls">
            <span id="zoomIn">&#x2795;</span><span id="zoomReset">&#x25cf;</span><span id="zoomOut">&#x2796;</span>
          </div>
        </div>
      </div>
      <div id="content">