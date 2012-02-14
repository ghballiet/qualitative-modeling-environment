<?
$name = $_POST['name'];
$kind = $_POST['kind'];
$loc = $_POST['loc'];
$model = $_POST['model'];

$q = "BEGIN;\n";
$q .= sprintf("INSERT INTO entity VALUES (NULL,%s,%s,%s,%s);\n",
  $name, $kind, $loc, $model);

$q .= "END;";
?>