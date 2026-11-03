<?php
require_once '../../Rtf.php';
$ge = new ZendExt_Soporte_Rtf('../Planillas/cartalista.rtf');
//---Modificar los datos unicos
$campos= array('#!Encabezado!#','#!Lugar!#','#!Fecha!#','#!Destinatario!#','#!Cuerpo!#','#!Firma!#','#!Pie!#',);
$valores= array('Universidad de las Ciencias Informaticas','Ciudad de la Habana','22 de Octubre de 2008','Rector','A continuacion le muestro el listado de los estudiantes que estan en el proyecto ERP.','Zerafin Sanchez','Proyecto ERP-CUBA');
$equivalencias= array($campos, $valores);
$ge->Modificar_Planilla($equivalencias);
//---Modificar la lista
$campos= array("#!Nombre!#","#!Apellidos!#","#!Telefono!#");
$valores1= array('Gregorio','Sanza','6465458');
$valores2= array('Aureliano','Buendia','2546987');
$valores3= array('Ursula','Iguaran','4689754');
$valores4= array('Juvenal','Urbino','5658795');
$valores5= array('Pipo','Perez','6326598');
$valores6= array('Artura','Perez','1568957');
$equivalencias= array($campos,$valores1,$valores2,$valores3,$valores4,$valores5,$valores6);

$ge->Listar($equivalencias,'$');
$ge->Salvar('../Generados/cartalista.doc');
