<?php

/**
 * Clase Singleton para la carga de ficheros json
 *
 * @author Kenier
 */
class InitConfigLoader
{

    /**
     * Extension de los ficheros de configuracion
     */
    const EXT = '.ini';

    /**
     * Arreglo donde se almacenan los valores de configuracion
     *
     * @var type
     */
    private $initConfig;

    /**
     * Instancia de la clase JSONConfigLoader para garantizar que la
     * clase sea singleton
     *
     * @var JSONConfigLoader
     */
    private static $initLoader = null;

    /**
     * Constructor de la clase
     */
    private function __construct()
    {
        $this->initConfig = array();
    }

    /**
     * Metodo para acceder a la isntancia de la clase
     *
     * @return JSONConfigLoader
     */
    public static function __init()
    {
        if (null == self::$initLoader) {
            self::$initLoader = new InitConfigLoader;
        }
        return self::$initLoader;
    }

    /**
     * Metodo que carga los valores cofiguracion desde un fichero json
     *
     * @param string $file
     *
     * @return JSONConfigLoader Description
     */
    public function load($file)
    {
        $this->initConfig = parse_ini_file($file . self::EXT);
        return $this;
    }

    /**
     *
     * @param type $name
     *
     * @return type
     */
    public function __get($name)
    {
        return (isset($this->initConfig[$name])) ? $this->initConfig[$name] : null;
    }

    public function writeFile($array, $file){
       $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . ''
         . 'logistica/utiles/comun/recursos/';
        $nLine = "\n";
        $fHandler = fopen($dir .''.$file.self::EXT,'w+');

        $fileOutput = '';
        foreach ($array as $key => $value){
            $fileOutput .= $key.'='.$value.$nLine;
        }
        $succes= fwrite($fHandler,$fileOutput);
        fclose($fHandler);
        return $succes;
    }

}
