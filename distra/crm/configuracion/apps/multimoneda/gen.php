<?php
//Direccion de la carpeta de publicacion
$dirwww = $_SERVER['DOCUMENT_ROOT'];

//Direccion del fichero Doctrine.php
$dirdoctrine
    = $dirwww . '/repo/VDesarrollo/comun/frameworks/Doctrine/Doctrine.php';

//Inclusion del fichero Doctrine.php
require_once($dirdoctrine);

//Inicailizar autocarga de clases y ficheros de Doctrine
spl_autoload_register(array('Doctrine', 'autoload'));

//Realizo la conexion a la BD
$conn = Doctrine_Manager::connection(
    'pgsql://postgres:postgres@localhost/configuracion'
);

//Genero los modelos en la carpeta modsec
Doctrine::generateModelsFromDb('modelos');
