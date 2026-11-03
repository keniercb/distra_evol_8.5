<?php
require_once '../../HTML.php';
$ge = new ZendExt_Soporte_HTML('../Planillas/tabla1.html');
/*$campos=array("#!NombreCompleto!#","#!CI!#","#!Direccion!#","#!sexo!#");
$valores = array("Urbino Campos","70123456432","Paso diez","M");
$equivalencias= array($campos,$valores);
$ge->Modificar_Planilla($equivalencias);
$campos= array("#!Nombre!#","#!Apellidos!#","#!Telefono!#");
$valores1= array('Gregorio','Sanza','6465458');
$valores2= array('Aureliano','Buendia','2546987');
$valores3= array('Ursula','Iguaran','4689754');
$valores4= array('Juvenal','Urbino','5658795');
$valores5= array('Pipo','Perez','6326598');
$valores6= array('Artura','Perez','1568957');
$equivalencias= array($campos,$valores1,$valores2,$valores3,$valores4,$valores5,$valores6);
$ge->Listar($equivalencias,'$');*/
$ge->VistaPrevia();
$ge->Salvar('../Generados/tabla1.pdf');
//header("location:../Generados/tabla.html");
