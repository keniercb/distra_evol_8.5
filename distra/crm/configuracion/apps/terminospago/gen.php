<?php

$include = '../../../../comun/frameworks/Doctrine/Doctrine.php';
include ($include);
spl_autoload_register(array('Doctrine', 'autoload'));

$conn = Doctrine_Manager::connection('pgsql://erp:erp2008@10.12.171.4/erp');
Doctrine::generateModelsFromDb('models/domain');
