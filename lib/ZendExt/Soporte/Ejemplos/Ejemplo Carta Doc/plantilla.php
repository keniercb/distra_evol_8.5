<?php
require_once '../../Rtf.php';
//---Sacar los datos del post y conformar las equivalencias
$campos= array('#!Encabezado!#','#!Lugar!#','#!Fecha!#','#!Destinatario!#','#!Cuerpo!#','#!Firma!#','#!Pie!#',);
$valores= array($_POST['encabezado'],$_POST['lugar'],$_POST['fecha'],$_POST['destinatario'],$_POST['mensaje'],$_POST['firma'],$_POST['pie']);
$equivalencias= array($campos,$valores);
$generador = new ZendExt_Soporte_Rtf('../Planillas/carta.rtf');
$generador->Modificar_Planilla($equivalencias);
$generador->Salvar('../Generados/carta.doc');
