<?
$_POST['extra_css'] = array('gallery.css');
$_POST['extra_js'] = array('gallery.min.js');
$_POST['loginRequired'] = md5(true);
include_once('../template/before.php');
include_once(realpath('../includes/php/db.php'));
init();
?>
<div id="gallery">
  <div id="myModal" class="reveal-modal">
    <a class="close-reveal-modal">&#215;</a>
    <h1>Add a New Model</h1>
    <form method="post" action="saveModel.php">
      <input type="hidden" name="uid" id="uid" value="<? echo $_SESSION['userId']; ?>">
      <input type="text" name="name" id="name" placeholder="Type the name of the model here." required />
      <textarea name="desc" id="desc" placeholder="Briefly describe the model here." required></textarea>
      <input type="submit" value="Continue" />
    </form>
  </div>
  <div id="header">
    <h1>Available Models</h1>
    <a href="#" id="btnAddModel" data-reveal-id="myModal">Add New</a>
  </div>
  <div id="models">
  </div>
</div>

<?
close();
include_once('../template/after.php');
?>