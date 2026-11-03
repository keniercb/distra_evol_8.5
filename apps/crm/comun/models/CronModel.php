<?php


class CronModel extends ZendExt_Model
{
    public function __construct()
    {
        $this->includeFiles();
        parent::ZendExt_Model();
    }

    public function test()
    {
        $instance = Doctrine::getTable('DatContrato')->find(3);
        $nombre = explode('-', $instance->nombre);
        $cant = 0;
        if (count($nombre) == 2) {
            $cant = (int)$nombre[1];
        }
        $instance->nombre = $nombre[0] . $cant++;
        $instance->save();
        /*$address = array('amartinez@xetid.cu');
        $subject = 'Correo desde CRM';
        $msg = 'Esto es una prueba no te estreses';
        $this->_mailer->sendMail($address, $subject, $msg);*/
    }

    public function includeFiles()
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];

        //Direccion del fichero de configuracion
        $config_file = substr($dirindex, 0, strrpos($dirindex, 'web')) . 'apps/crm/config.php';

        if (!file_exists($config_file)) { //Si no existe el fichero de configuracion
            //Se dispara una excepcion
            throw new Exception('El fichero de configuracion no existe');
        } elseif (!is_readable($config_file)) { //Si no se puede leer
            //Se dispara una excepcion
            throw new Exception('No se pudo leer el fichero de configuracion. Acceso denegado.');
        } else { //Si existe el fichero y se puede leer
            //Se inicializa la variable de configuración
            $config = array();

            //Se incluye el fichero
            include_once($config_file);

            if (!isset($config['include_path'])) {
                throw new Exception('El framework no esta configurado correctamente.');
            }

            //Se inicializa el include path de php a partir de la variable de configuracion
            set_include_path($config['include_path']);

            //Se inicia la carga automatica de clases y ficheros
            $loader_file = 'Zend/Loader.php';
            if (!@include_once($loader_file)) {
                throw new Exception('El framework no esta configurado correctamente.');
            }
        }
    }
}

$cron = new CronModel();
$cron->test();