<?php
//Direccion de la carpeta de publicacion
$dirwww = $_SERVER['DOCUMENT_ROOT'];
//Direccion del fichero Doctrine.php
$dirDoctrine = $dirwww . '/repo/VDesarrollo/comun/frameworks/Doctrine/Doctrine.php';
//Inclusion del fichero Doctrine.php
require_once($dirDoctrine);
//Inicailizar autocarga de clases y ficheros de Doctrine
spl_autoload_register(array('Doctrine', 'autoload'));
try {
    //Realizo la conexion a la BD
    $conn = Doctrine_Manager::connection(
        'pgsql://postgres:postgres@localhost/mt'
    );
    //Genero los modelos en la carpeta modsec
    Doctrine::generateModelsFromDb('models/domain');
    echo "Modelos generados con exito!!!";
} catch (Doctrine_Exception $e) {
    echo $e;
}
