<?php

/**
 * Utility clas for requiring configuration files
 *
 * @author Kenier Cumba Bueno
 */
class LogisticaConfigHelper implements ISingletonClass
{

    /**
     * Default extension for files
     */
    const EXT = '.php';

    /**
     * Singleton instance of ZendExt_Logistica
     *
     * @var ZendExt_Logistica
     */
    private static $instance = null;

    /**
     * Array that contains configuration vars.
     *
     * @type string
     */
    private $config;

    private function __construct()
    {
        $this->config = array();
    }

    /**
     * Creates a new instance of class ZendExt_Logistica
     *
     * @return LogisticaConfigHelper
     */
    static function __init()
    {
        if (null === self::$instance) {
            self::$instance = new LogisticaConfigHelper;
        }
        return self::$instance;
    }

    /**
     * Loads a configuration file, configuration file must returns an array
     *
     * @param string $config Name of config group
     *
     * @return ZendExt_Logistica
     */
    function loadConfig($config, $ext = '')
    {
        $this->config = $this->loadFile($config, $ext);
        return $this;
    }

    /**
     * Requires a new file
     *
     * @param string $file
     * @param string $ext
     *
     * @return type
     */
    function loadFile($file, $ext = '')
    {
        if (!$ext) {
            $ext = self::EXT;
        }
        return include $file . $ext;
    }

    /**
     * Returns an array offset or object property loaded from configuration file
     *
     * @return array
     */
    function get($offset, $default = null)
    {
        if (!is_array($this->config) && !is_object($this->config)) {
            die('Config file must return an array or an object.');
        }
        return (is_array($this->config) && array_key_exists($offset, $this->config))
            ? $this->config[$offset]
            :
            (isset($this->config->$offset) ? $this->config->$offset : $default);
    }

    public function __get($name)
    {
        return $this->get($name);
    }

    /**
     * Test function to magic autoload files
     *
     * @param type $class
     */
    function auto_load($class)
    {
        include_once $class . self::EXT;
        return $this;
    }

    /**
     * Adds paths to global include path. Paths must be configured in configuration file
     *
     * @param string $config Name of configuration file
     */
    function setIncludePath($config)
    {
        set_include_path(get_include_path() . PATH_SEPARATOR . $this->loadConfig($config)->get('include_path'));
        return $this;
    }

    /**
     * Function to register default autolader
     */
    function registerAutoload()
    {
        spl_autoload_register(array('LogisticaConfigHelper', 'auto_load'));
        return $this;
    }

    public function eliminarDirectorio($carpeta)
    {
        foreach (glob($carpeta . "/*") as $archivos_carpeta) {
            if (is_dir($archivos_carpeta)) {
                $this->eliminarDirectorio($archivos_carpeta);
            } else {
                unlink($archivos_carpeta);
            }
        }
        rmdir($carpeta);
    }

}
