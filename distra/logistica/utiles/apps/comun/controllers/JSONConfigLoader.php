<?php

/**
 * Clase Singleton para la carga de ficheros json
 *
 * @author Kenier
 */
class JSONConfigLoader
{

    /**
     * Extension de los ficheros de configuracion
     */
    const EXT = '.json';

    /**
     * Arreglo donde se almacenan los valores de configuracion
     *
     * @var type
     */
    private $jsonConfig;

    /**
     * Instancia de la clase JSONConfigLoader para garantizar que la
     * clase sea singleton
     *
     * @var JSONConfigLoader
     */
    private static $jsonLoader = null;

    /**
     * Constructor de la clase
     */
    private function __construct()
    {
        $this->jsonConfig = array();
    }

    /**
     * Metodo para acceder a la isntancia de la clase
     *
     * @return JSONConfigLoader
     */
    public static function __init()
    {
        if (null == self::$jsonLoader) {
            self::$jsonLoader = new JSONConfigLoader;
        }
        return self::$jsonLoader;
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
        $text = file_get_contents($file . self::EXT, FILE_USE_INCLUDE_PATH);
        $this->jsonConfig = json_decode(utf8_encode($text), true);
        if(json_last_error() != JSON_ERROR_NONE){
            $msg = 'Error desconocido';
            switch (json_last_error()){
                case JSON_ERROR_DEPTH:
                    echo 'Excedido tamaño máximo de la pila';
                    break;
                case JSON_ERROR_STATE_MISMATCH:
                    echo 'Desbordamiento de buffer o los modos no coinciden';
                case JSON_ERROR_CTRL_CHAR:
                    echo 'Encontrado carácter de control no esperado';
                    break;
                case JSON_ERROR_SYNTAX:
                    echo 'Error de sintaxis, JSON mal formado';
                    break;
                case JSON_ERROR_UTF8:
                    echo 'Caracteres UTF-8 malformados, posiblemente están mal codificados';
                    break;
            }
            throw new Exception('Ocurri&oacute; un error leyendo el fichero de definicion de compornetes'.' '. $msg);
        }
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
        return (isset($this->jsonConfig[$name])) ? $this->jsonConfig[$name] : null;
    }

}
