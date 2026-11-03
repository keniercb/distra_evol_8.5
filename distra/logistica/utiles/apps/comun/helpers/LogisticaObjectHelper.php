<?php

/**
 * Description of LogisticaObjectHelper
 *
 * @package       Logistica
 * @subpackage    Utiles
 * @author        Kenier Cumba Bueno
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
class LogisticaObjectHelper implements ISingletonClass {

    /**
     * Cosntructor de la clase, crea una nueva instancia
     */
    private function __construct() {
        
    }

    /**
     * Instancia para garantizar el acceso singleton a la clase
     *
     * @var LogisticaObjectHelper
     */
    private static $instance = null;

    /**
     * Metodo que devuelve una nueva instancia de la clase
     *
     * @return LogisticaObjectHelper Instancia singleton
     */
    public static function __init() {
        if (null === self::$instance) {
            self::$instance = new LogisticaObjectHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que sincroniza las variables de un arreglo a un objeto
     *
     * @param stdClass $refObj    Objeto a sincronizar
     * @param array    $arrayData Arreglo con los datos que se asignan al objeto
     *
     * @return void
     */
    public function synchronize(& $refObj, $arrayData = array()) {
        if (count($arrayData)) {
            foreach ($arrayData as $key => $value) {
                $refObj->$key = $value;
            }
        }
    }

    /**
     * Metodo que crea un nuevo objeto desde un arreglo
     *
     * @param array $arrayData Arreglo con los datos
     *
     * @return stdClass El objeto creado
     */
    public function getStdClassFromArray($arrayData = array()) {
        $stdObject = new stdClass();
        $this->synchronize($stdObject, $arrayData);
        return $stdObject;
    }

    /**
     *
     * @param type $stdClass
     *
     * @return type
     */
    public function stdClassToArray($stdClass) {
        return (array) $stdClass;
    }

    /**
     * @param array $arrayData
     * @param string $column
     * @return array
     */
    public function extractValueFromArrayColumn($arrayData = array(), $column = '')
    {
        $arrayResult = array();
        if (count($arrayData)) {
            foreach ($arrayData as $data) {
                if ((is_object($data) && $data->$column) || (is_array($data) && array_key_exists($column, $data))) {

                    is_object($data) ? array_push($arrayResult, $data->$column) : array_push($arrayResult,
                                $data[$column]);
                }
            }
        }

        return $arrayResult;
    }


    /**
     * Elimina los valores nulos de un arreglo
     * @param $refArray
     */
    public function unsetNullValues(& $refArray) {
        foreach ($refArray as $key => $value) {
            if (is_null($value) || $value === '' || (is_string($value) && strlen($value) == 0)) {
                unset($refArray[$key]);
            }
        }
    }

    public function getBooleanStr($value) {
        return $value ? 'true' : 'false';
    }

    /**
     * Elimina los indices especificados de un arreglo
     * @param $refArray
     * @param $columns
     */
    public function unsetArrayValues(&$refArray, $columns) {
        foreach ($columns as $key) {
            unset($refArray[$key]);
        }
    }

    public function _debug($obj, $die = false) {
        if (!is_object($obj) && !is_array($obj)) {
            $obj = array($obj);
        }
        print_r($obj);
//        if($die){
        die();
//        }
    }

    /**
     * Añade un nuevo metodo a un objeto en tiempo de ejecucion
     * @param $object
     * @param $class
     * @param $method
     * @param null $params
     */
    public function decorate($object, $class, $method, $params = null) {
        $instancel = new $class;
        $instancel->$method($object, $params);
    }

    /**
     * @param $number
     * @param int $presition
     * @return float|int
     */
    public function _round($number, $presition = LogisticaGlobal::FACTOR_REDONDEO) {
        if ($number == 0) {
            return 0;
        }
        $valueR = explode('.', $number);
        if ($valueR[$presition + 1] == 5) {
            if ($valueR[$presition] % 2 == 0) {
                return round($number, $presition, PHP_ROUND_HALF_DOWN);
            }
            return round($number, $presition, PHP_ROUND_HALF_UP);
        }
        else {
            return round($number, $presition);
        }
    }

    /**
     * Trunca la parte decimal de un flotante en la precision escpecificada
     * @param $number
     * @param int $presition
     * @return float
     */
    public function truncateFloat($number, $presition = LogisticaGlobal::FACTOR_REDONDEO){
        $root = 10;
        $baseMult = pow($root, $presition);
        $result = ((int)($number*$baseMult))/$baseMult;
        return $this->_numberFormat($result);

    }

    /**
     *  Redondea la parte decimal de un flotante a su multipo de cinco mas cercano
     * @param $number Numero flotante a redondear
     * @return float
     */
   public  function _roundToFive($number){
        $number = number_format($this->_round($number,LogisticaGlobal::FACTOR_REDONDEO),LogisticaGlobal::FACTOR_REDONDEO);
        $partes = explode('.',$number);
        $inferior = $partes[1] - $partes[1]%5;
        $superior = $inferior + 5;
        $partes[1] = (($partes[1] - $inferior) > ($superior - $partes[1]) ) ? $superior : $inferior;
        $partes[1] = ($partes[1] < 10) ? '0'.$partes[1] : $partes[1];
        $number = str_replace(',','',($partes[1] == 100 ? str_replace(',','',$partes[0]) + 1 : implode('.', $partes)));
        return $this->_numberFormat($number);
    }

    public  function _roundDecimaSuperior($number){
        $number = number_format($this->_round($number,LogisticaGlobal::FACTOR_REDONDEO),LogisticaGlobal::FACTOR_REDONDEO);
        $partes = explode('.',$number);
        $inferior = $partes[1] - $partes[1]%10;
        if ($partes[1]%10 == 0) {
            $superior = $inferior;
        } else {
            $superior = $inferior + 10;
        }
        $partes[1] = $superior;
        $partes[1] = ($partes[1] < 10) ? '0'.$partes[1] : $partes[1];
        $number = str_replace(',','',($partes[1] == 100 ? str_replace(',','',$partes[0]) + 1 : implode('.', $partes)));
        return $this->_numberFormat($number);
    }

    /**
     * Convierte un string a su representacion numerica sin separadores de miles
     * @param $number Numero a formatear
     * @param int $presition Presicion de formateo
     * @return float
     */
    public  function _numberFormat($number, $presition = LogisticaGlobal::FACTOR_REDONDEO)
    {
        return number_format($number, $presition,'.','');
    }

    public function guidv4() {
        // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
        $data = openssl_random_pseudo_bytes(16);
        assert(strlen($data) == 16);

        // Set version to 0100
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        // Set bits 6-7 to 10
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);

        // Output the 36 character UUID.
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    public function gcommerceRefundId($params) {
        $almacenId = str_pad($params['coddeposito'], 6, 0, STR_PAD_LEFT);
        $consecutivoDev = str_pad($params['consecutivo'], 6, 0, STR_PAD_LEFT);
        return $almacenId.$consecutivoDev;
    }
}
