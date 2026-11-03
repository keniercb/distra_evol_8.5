<?php

/**
 * ZendExt_Logger
 *
 * Reportar logs al syslog
 *
 * @author    Marlen Caballero Ricardo
 * @package   ZendExt
 * @copyright UCID-ERP Cuba
 * @version   1.0-0
 */
class ZendExt_Logger
{
    private static $fileMaxSize = 104857600.0;

    public function __construct()
    {

    }

    // static public function getInstance() {
    // static $instance;
    // if (!isset($instance)) {
    // $instance = new self();
    // }
    // return $instance;
    // }

    static public function logger(array $p = array())
    {
        $params = "";
        foreach ($p as $c => $v) {
            $params .= (string)$c . ": " . (string)$v . " ";
        }
        //print_r($params);
        exec('logger -t Quarseg' . " " . $params);
    }

    /**
     * - Escribe informacion pasada por parametro en los
     * logs del MT (por defecto escribe en el log de excepciones).
     *
     * @param STRING - Detalles a insertar en el log.
     * @param STRING|NULL - Direccion del log a editar.
     */
    static public function write($pStr, $log_dir = null)
    {
        $date = new DateTime("now");
        $configInstance = Zend_Registry::get('config');
        if($log_dir !== null) {
            $dir = $log_dir;
        } else {
            $dir = $configInstance->exception_log_file;
        }

        if(file_exists($dir)) {
            $file = @fopen($dir, "a");
        } else {
            if($log_dir !== null) {
                $log_type = explode('/', explode('log/', $dir)[1])[0];
                $log_path = explode('exception.log', $configInstance->exception_log_file)[0];
                if ($log_path && !is_dir($log_path . $log_type))
                    mkdir($log_path . $log_type);
            }
            $file = @fopen($dir, "a");
        }

        $fileSize = fstat($file)['size'];

        if ($fileSize >= self::$fileMaxSize) {
            rename(
                $dir, $dir . $date->format('d') . '-' . $date->format('m')
                . '-' . $date->format('Y').'|'.$date->format('H'). 'h'
                . $date->format('i'). 'm' . $date->format('s'). 's'
            );
            $file = @fopen($dir, "+w");
        }

        if ($file) {
            fputs($file, $pStr);
            fclose($file);
        }
    }

}

