<?php
/**
 * Created by PhpStorm.
 * User: kmilo
 * Date: 4/6/2018
 * Time: 20:50
 * Script para ayudar a crear las clases modelos de una BD
 * Se ejecuta desde la consola del SO
 */

require_once (substr(__FILE__, 0, strrpos(__FILE__, '/apps/')) . '/lib/Doctrine/Doctrine.php');

spl_autoload_register(array('Doctrine', 'autoload'));

$esquema = "mod_seguridad";
$directorioSalida = 'models';

$conn = Doctrine_Manager::connection('pgsql://postgres:postgres@localhost/zeolides-23');
//todo No funciona que tome solo las tablas de un esquema
$conn->exec('SET search_path TO '.$esquema.';');
$conn->setName('doctrine');
try {
    Doctrine_Core::generateModelsFromDb(
        $directorioSalida,
        array('doctrine'),
        array('generateTableClasses' => false)
    );
}catch(Exception $e){
    var_dump($e);die;
}

//todo Consumir de los fiecheros de configuración la conexión a BD
//$dirCerts = substr(
//        $_SERVER['DOCUMENT_ROOT'],
//        0,
//        strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
//    ) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR
//    . 'auth' . DIRECTORY_SEPARATOR;
//$rSA = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
//$password = $rSA->decrypt($servidorauth["password"]);
