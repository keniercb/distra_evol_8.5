<?php
require_once '../../HTML.php';
$ge = new ZendExt_Soporte_HTML('../Planillas/conComp.html');
$ge->VistaPrevia();
$ge->Salvar('../Generados/muchashojas.pdf');
