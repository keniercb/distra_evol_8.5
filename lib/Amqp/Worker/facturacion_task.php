<?php

/**
 * @autor Equipo de Arquitectura UCID
 *
 * @package    Amqp
 * @subpackage Worker
 * @version    1.0
 */
if (isset($_SERVER['PWD']))
    $dir_index = $_SERVER['PWD'];
else
    $dir_index = $_SERVER['SCRIPT_FILENAME'];
//Se carga el fichero de configuracion del componente pasado por parametro
$dir_MT = substr($dir_index, 0, strrpos($dir_index, 'lib'));
$config_file = $dir_MT . 'apps' . DIRECTORY_SEPARATOR . 'comun' . DIRECTORY_SEPARATOR . 'config.php';

if (!is_readable($config_file)) {
    throw new Exception('No se pudo leer el fichero de configuracion. Acceso denegado.');
} else {
    //Se inicializa la variable de configuración
    $config = array();

    //Se incluye el fichero de configuracion.
    include_once ($config_file);
    if (!isset($config['include_path']))
        throw new Exception('El framework no esta configurado correctamente.');

    //Se inicializa el include path de php a partir de la variable de configuracion
    set_include_path($config['include_path']);

    //Se realiza la autocarga de las clases de Zend
    $loader_file = $dir_MT . 'lib' . DIRECTORY_SEPARATOR . 'Zend' . DIRECTORY_SEPARATOR . 'Loader' . DIRECTORY_SEPARATOR . 'Autoloader.php';
    if (!@include_once($loader_file))
        throw new Exception('El framework no esta configurado correctamente.');
    $autoloader = Zend_Loader_Autoloader::getInstance();
    $autoloader->setFallbackAutoloader(true);

    //Se crea el registro de objetos, variables y arreglos
    $register = new Zend_Registry(array(), ArrayObject::ARRAY_AS_PROPS);
    //Se guarda el registro en el singelton de Registro
    Zend_Registry :: setInstance($register);

    //Se guarda en el singleton la configuracion del framework.
    $configApp = new ZendExt_App_Config();
    $register->config = $configApp->configApp($config);



    $taskRunner=new Amqp_Task_Mgr();

    $state= true;
    while(true){
        //captura la fecha del sistema en ese momento
        $date=getdate();
        //todo captura la fecha de configuracion de la aplicacion
        $config_date=$this->integrator->facturacion->GetFechaConcfiguracion();
        //&& $date['minutes']==47 && $date['seconds']==40
        //validacion segun el dia del mes que haya sido definido
        if($date['mday']==$config_date && $state==true ){

            $taskRunner->runTask('facturacion', array('data'=>$date));
            $state=false;
        }
        if($date['mday']!=$config_date){
           $state = true;
        }
    }

}