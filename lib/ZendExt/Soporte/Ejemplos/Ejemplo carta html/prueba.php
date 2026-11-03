<?php
require_once '../../HTML.php';
$ge = new ZendExt_Soporte_HTML('../Planillas/carta.html');
//---Modificar los datos unicos
$campos= array('#!Encabezado!#','#!Lugar!#','#!Fecha!#','#!Destinatario!#','#!Cuerpo!#','#!Firma!#','#!Pie!#',);
$valores= array('Universidad de las Ciencias Informaticas','Ciudad de la Habana','22 de Octubre de 2008','Rector','A continuacion le muestro el listado de los estudiantes que estan en el proyecto ERP.','Zerafin Sanchez','Proyecto ERP-CUBA');
$equivalencias= array($campos, $valores);
$ge->Modificar_Planilla($equivalencias);
$ge->Salvar('../Generados/carta.pdf');
