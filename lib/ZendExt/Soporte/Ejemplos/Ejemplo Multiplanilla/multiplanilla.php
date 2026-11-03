<?php
require_once '../../Rtf.php';
$campos= array("#!Nombre!#","#!Apellido!#","#!Telefono!#");
$valores1= array('Gregorio','Sanza','6465458');
$valores2= array('Aureliano','Buendia','2546987');
$valores3= array('Ursula','Iguaran','4689754');
$valores4= array('Juvenal','Urbino','5658795');
$valores5= array('Pipo','Perez','6326598');
$valores6= array('Artura','Perez','1568957');
$equivalencias= array($campos,$valores1,$valores2,$valores3,$valores4,$valores5,$valores6);

$ge = new ZendExt_Soporte_Rtf('../Planillas/Multiplanilla.rtf');
$ge->Modificar_Planilla($equivalencias);
$ge->Salvar('../Generados/Multiplanilla.doc');
