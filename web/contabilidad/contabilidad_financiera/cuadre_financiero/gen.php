<?php
    $include = '../../../../comun/frameworks/Doctrine/Doctrine.php';
    include ($include);
    spl_autoload_register(array('Doctrine', 'autoload'));
    
    $conn = Doctrine_Manager::connection('pgsql://postgres:postgres@10.12.163.7/contabilidad');    
    Doctrine::generateModelsFromDb('models/domain');
?>
