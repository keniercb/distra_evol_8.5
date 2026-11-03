<?php

/**
 * ZendExt_Aspect_Validation
 *
 * Valida las precondiciones y parámetros de una acción según su especificación
 * en el fichero validation.xml
 *
 * @author     Oiner Gomez Baryolo
 * @see        Actualizado por Darien García Tejo 29-06-2012
 * @see        Actualizado por Ernesto Martínez Riverón 13-02-2015
 * @copyright  UCID-ERP Cuba
 * @package    ZendExt
 * @subpackage ZendExt_Aspect
 * @version    2.0-0
 */
final class ZendExt_Aspect_Validation implements ZendExt_Aspect_ISinglenton
{
    /**
     * Constructor de la clase, es privado para impedir que pueda
     * ser instanciado y de esta forma garantizar que la instancia
     * sea un singlenton
     *
     * @return void
     */
    private function __construct()
    {

    }

    /**
     * Obtención de la instancia de la clase, ya que esta no puede ser
     * instanciada directamente debido a que es un singlenton
     *
     * @return ZendExt_Aspect_Validation - Instancia de la clase
     */
    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    /**
     * Validación de los parámetros utilizados en una acción y de sus precondiciones.
     *
     * @param SimpleXMLElement $action Elemento xml que representa la acción.
     *
     * @throws ZendExt_Exception - Excepción declarada en el xml de excepciones
     * @return void
     */
    public function preValidateAction(SimpleXMLElement $action = null)
    {
        // Si es un objeto
        if ($action instanceof SimpleXMLElement) {
            // Dada una acción se recorren todas las precondiciones.
            if ($action->precondition) {
                foreach ($action->precondition as $preconditions) {
                    $this->checkConditions($preconditions);
                }
            }
        }
    }

    /**
     * Validación de las postcondiciones de una acción.
     *
     * @param SimpleXMLElement $action Elemento xml que representa la acción.
     *
     * @throws ZendExt_Exception - Excepción declarada en el xml de excepciones
     * @return void
     */
    public function postValidateAction(SimpleXMLElement $action = null)
    {
        // Si es un objeto
        if ($action instanceof SimpleXMLElement) {
            // Dada una acción se recorren todas las postcondition.
            if ($action->postcondition) {
                foreach ($action->postcondition as $postcondition) {
                    $this->checkConditions($postcondition);
                }
            }
        }
    }

    /**
     * Validación de los parámetros utilizados por una acción según el
     * tipo de dato.
     *
     * @param SimpleXmlElement $action Acción a la cual se le validarán los parámetros.
     *
     * @return void | ZendExt_Exception
     */
    public function validateParamsAction(SimpleXMLElement $action)
    {
        $postParams =  count($_REQUEST);
        if ($action->param) {
            $cant = 0;
            $paramsNull = 0;
            // Se recorren los params para realizar la validacion de los mismos.
            foreach ($action->param as $param) {
                $nameField = (string)$param['name'];
                $typeField = (string)$param['type'];
               // $postField = $this->isValue(trim($_POST["$nameField"]));// Poner post si es solo por post
                $postField = $this->isValue(trim($_REQUEST["$nameField"]));
                $notNull = (string)$param['not_null'];
                $lpostfield = strlen($postField);
                $cant++;
               /* if(!array_key_exists($nameField,$_POST) && $notNull == "false") {// Poner post si es solo por post
                    $paramsNull++;
                }*/
                if(!array_key_exists($nameField,$_REQUEST) && $notNull == "false") {
                    $paramsNull++;
                }
                // Si lo que viene por POST esta vacio y es un campo obligatorio.
                if ($lpostfield == 0 && $notNull == "true") {
                    $nullError = (string)$param['null_error'];
                    $this->Exception($nullError, 'EV005',true,true);
                }
                elseif (strlen($postField) > 0) {
                    // Se valida que el parámetro que viene por POST tenga una longitud menor que la definida.
                    if (isset($param['max_lenght'])) {
                        if ($lpostfield > (integer)$param['max_lenght']) {
                            $this->Exception((string)$param['error_length'], 'MAXLENGTH',true,true);
                        }
                    }
                    // Se valida que el parámetro que viene por POST tenga un valor mayor que el definido.
                    if (isset($param['min_value'])) {
                        if ($postField < (integer)$param['min_value']) {
                            $this->Exception((string)$param['error_min_value'], 'MINVALUE',true,true);
                        }
                    }
                    // Se valida que el parámetro que viene por POST tenga un valor menor que el definido.
                    if (isset($param['max_value'])) {
                        if ($postField > (integer)$param['max_value']) {
                            $this->Exception((string)$param['error_max_value'], 'MAXVALUE',true,true);
                        }
                    }
                    // Se obtienen las expresiones regulares.
                    $expressions = $this->getRegEspressions();
                    // Si se cargo el xml de expresiones regulares.
                    if ($expressions && $lpostfield) {
                        if($typeField == "json"){
                            $value = json_decode($postField);
                            if($value == NULL && $lpostfield>2){
                                $this->Exception(null, 'EV006',true,true);
                            }
                        }else{
                            $typeRegexp = (string)$expressions->$typeField;
                            // Se verifica si hay una expresión regular para este tipo.
                            if ($typeRegexp) {                                
                                // Si el campo enviado no es válido.
                                if (!preg_match($typeRegexp . "i", "$postField")) {
                                    $typeError = (string)$param['type_error'];
                                    $this->Exception($typeError, 'EV006',true,true);
                                }
                            } else {
                                $this->Exception(null, 'EV007',true,true);
                            }
                        }
                    }
                }
            }
            if($cant != $postParams+$paramsNull)
                $this->Exception(null, 'EV015',true,true);
        }
        else if($postParams){
                 $this->Exception(null, 'EV013',true);
        }

    }

    /**
     * Verifica las precondiciones de la accion
     *
     * @param SimpleXMLElement $action , accion a la cual se le van a chequear las precondiciones
     *
     * @return void
     */
    private function checkConditions(SimpleXMLElement $conditions)
    {

        // Por cada precondicion recorro todas las validaciones que existen dentro de el xml de excepciones.
        foreach ($conditions->validator as $validator) {
            // En cada validación dada la clase se crea una instancia de ella.
            $class = (string)$validator['class'];
            $method = (string)$validator['method'];
            // Si no hay una clase declarada para el validador.
            if (!$class) {
                $this->Exception(null, 'EV008',false);

            } elseif (!class_exists($class)) {// Si la clase no existe.
                $this->Exception(null, 'EV009',false);
            } elseif (!$method) { // Si el método no esta declarado.
                $this->Exception(null, 'EV010',false);
            }
            $object = new $class();
            // Si el método no existe.
            if (!method_exists($object, $method)) {
                $this->Exception(null, 'EV011',false);
            } else {
                // Si la accion realizada no es valida.
                if (!$object->$method()) {
                    $errorCode = (string)$validator['error'];
                    $this->Exception($errorCode, 'EV012',false);
                }
            }
        }
    }

    /**
     * Obtención de las expresiones regulares utilizando el componente de
     * respuesta rápida ZendExt_FastResponse
     *
     * @return SimpleXMLElement - esxpresiones regulares
     */
    private function getRegEspressions()
    {
        //Si no se han cargado las expresesiones regulares se cargan
        static $expressions;
        if (!$expressions) {
            $expressions = ZendExt_FastResponse::getXML('expresiones');
        }
        return $expressions;
    }

    /**
     * Dispara una excepción controlada por el sistema según el código,
     * si en el primer código se pasa null se dispara la excepción con
     * el segundo
     *
     * @throws ZendExt_Exception - excepciones controladas por el sistema
     */
    private function Exception($errorCode, $auxCode = null, $validateParams = false, $incorrectParam = false)
    {
        if($validateParams){
            $register = Zend_Registry::getInstance();
            $array = array('skipExtends' => true, 'allowModifications' => true);
            $config = new Zend_Config_Ini($register->config->security_config, null, $array);
            if ($config->validation->typeException == "passive" || ($config->validation->typeException == "medium" && $incorrectParam == false)) {
                $configInstance = Zend_Registry::get('config');              
                     $dirXml = $register->config->xml->excepciones;
                     if (file_exists($dirXml)) {
                         $_xml = @simplexml_load_file($dirXml);
                         if (!$_xml instanceof SimpleXMLElement) {
                             throw new ZendExt_FastResponse_Exception('excepciones', true);
                         }
                         $lang = (isset($register->session)) ? $register->session->perfil['idioma'] : "es";
                         if($errorCode)
                             $pStr = $this->buildStringException($_xml->$errorCode, $lang,$_SERVER["REQUEST_URI"]);
                         else
                             $pStr = $this->buildStringException($_xml->$auxCode, $lang,$_SERVER["REQUEST_URI"]);
                     
                     ZendExt_Logger::write($pStr);
                    
                }
            }
            else{
                if ($errorCode) {
                    throw new ZendExt_Exception($errorCode);
                } elseif ($auxCode) {
                    throw new ZendExt_Exception($auxCode, null);
                }
            }
        }else {
            if ($errorCode) {
                throw new ZendExt_Exception($errorCode);
            } elseif ($auxCode) {
                throw new ZendExt_Exception($auxCode, null);
            }
        }
    }  

    private function buildStringException($exception,$lang,$uri)
    {
        $fecha = date('d/m/y');
        $hora = date('h:i:s');
        $info = explode("index.php",$uri);
        $controllerAction = explode("/",$info[1]);
        $str
            = "
----------------------------------------------------------------------
Excepcion:
Módulo: " . $info[0] . "
Clase: " . $controllerAction[1] . "Controller
Metodo: " . $controllerAction[2] . "Action
Descripcion: " . $exception->$lang->mensaje . "
Fecha: $fecha
Hora:  $hora
";
        return $str;
    }
    private function isValue($valor){
        if($valor!="undefined" && $valor!="null" && $valor!="NULL")
            return $valor;
        else
            return null;
    }

}
