<?php

/**
 * ZendExt_Exception
 *
 * Gestor vertical de excepciones
 *
 * @author    Omar Antonio Diaz Peña
 * @package   ZendExt
 * @copyright UCID-ERP Cuba.
 * @version   1.0-0
 */
class ZendExt_Exception extends Zend_Exception
{

    /**
     * Identificador de la excepcion
     *
     * @var string
     */
    private $_idException;
    /**
     * Descripcion de la excepcion
     *
     * @var string
     */
    private $_description;
    /**
     * Tipo de excepcion
     *
     * @var string
     */
    private $_type;
    /**
     * Excepcion interna, cualquier excepcion no declarada
     *
     * @var Exception
     */
    private $_innerException = null;
    /**
     * Traza de la excepcion
     *
     * @var string
     */
    private $_trace;
    /**
     * Instancia de excepciones segun el tipo de excepciones
     *
     * @var ZendExt_Exception_Log|ZendExt_Exception_LogPresentacion|
     *        ZendExt_Exception_Blind|Ext_Exception_Presentacion
     */
    private $_instance;
    /**
     * Listado de xml de excepciones por m�dulo.
     *
     * @var array
     */
    private static $_xml = array('comun' => null);

    /**
     * Devuelve el identificador de la excepcion
     *
     * @return string, identificador de la excepcion
     */
    public function getIdException()
    {
        return $this->_idException;
    }

    /**
     * Devuelve la excepcion interna
     *
     * @var Exception, excepcion interna
     */
    public function getInnerException()
    {
        return $this->_innerException;
    }

    /**
     * Devuelve la descripcion de la excepcion
     *
     * @return string, descripcion de la excepcion
     */
    public function getDescription()
    {
        return $this->_description;
    }

    /**
     * Devuelve el tipo de excepcion
     *
     * @return string, tipo de excepcion
     */
    public function getType()
    {
        return $this->_type;
    }

    /**
     * Devuelve la clase que disparo la excepcion declarada
     *
     * @return string, clase que disparo la excepcion
     */
    public function getClass()
    {
        $traces = parent::getTrace();
        return $traces [count($traces) - 1] ['class'];
    }

    /**
     * Devuelve el metodo donde se disparo la excepcion declarada
     *
     * @return string - nombre del donde se disparo la excepcion
     */
    public function getMethod()
    {
        $traces = parent::getTrace();
        return $traces [count($traces) - 1] ['function'];
    }

    /**
     * Maneja la excepcion y en dependencia del tipo la muestra o la guarda en un formato
     *
     * @return void
     */
    public function handle()
    {
        $this->_instance->handle();
    }

    /**
     * Devuelve la instancia de la excepcion disparada segun el tipo
     *
     * @return ZendExt_Exception_Log|ZendExt_Exception_LogPresentacion|
     *           ZendExt_Exception_Blind|Ext_Exception_Presentacion
     */
    public function getInstance()
    {
        return $this->_instance;
    }

    /**
     * Constructor de la clase, dispara la excepcion declarada en el xml de excepciones
     *
     * @param string    $pIdException    - Identificador de la excepcion
     * @param Excepcion $pInnerException - excepcion interna , cualquier excepcion no declarada
     * @param array $values - Array de valores usados en el tipo de
     *                      excepciones ZendExt_Exception_LPWithValues.
     */
    public function ZendExt_Exception($pIdException, $pInnerException = null, $values = false)
    {
        if (!self::$_xml['comun']) {
            self::$_xml['comun'] = ZendExt_FastResponse :: getXML('excepciones');
        }
        if (self::$_xml['comun']->$pIdException) {
            $xmlException = self::$_xml['comun']->$pIdException;
        } else {
            $register = Zend_Registry::getInstance();
            $moduleReference = $register->config->module_reference;
            $modReferenceArr = explode($register->config->directory_separator, $moduleReference);
            $subsystem = $modReferenceArr[0];
            $dirXml = $register->config->dir_aplication . $subsystem . $register->config->directory_separator
                . $register->config->uri_xml_config . 'exception.xml';
            if (file_exists($dirXml)) {
                self::$_xml[$subsystem] = @simplexml_load_file($dirXml);
                if (!self::$_xml[$subsystem] instanceof SimpleXMLElement) {
                    throw new ZendExt_FastResponse_Exception('excepciones', true);
                }
            } else {
                throw new ZendExt_FastResponse_Exception('excepciones', false);
            }
            $xmlException = self::$_xml[$subsystem]->$pIdException;
        }

        if (@$xmlException->tipo) {
            $this->_idException = $pIdException;
            $this->_innerException = $pInnerException;
            $this->_type = (string)$xmlException->tipo;
            $registro = Zend_Registry::getInstance();
            $lang = (isset($registro->session)) ? $registro->session->perfil['idioma'] : false;
            if (!$lang) {
                $lang = 'es';
            }
            $this->_description = (string)$xmlException->$lang->descripcion;
            $exceptionTypes = ZendExt_FastResponse::getXML('tipos_excepciones');
            $currType = $this->_type;
            $exceptionClass = (string)$exceptionTypes->$currType;
            $this->_instance = new $exceptionClass($this, $values);
            parent::__construct((string)$xmlException->$lang->mensaje);
        } else {
            if ($pIdException == 'NODEFINED') {
                throw new ZendExt_Exception_NotDefined("Exception $pIdException not defined.");
            }
            $exception = new ZendExt_Exception_NotDefined("Exception $pIdException not defined.");
            throw new ZendExt_Exception('NODEFINED', $exception);
        }
    }

    /**
     * Devuelve el modulo que disparo la excepcion
     *
     * @return string - Modulo que disparo la excepcion
     */
    public function getModule()
    {
        $explodeDirModule = explode(DIRECTORY_SEPARATOR, $this->getFile());
        $count = count($explodeDirModule);
        for ($i = $count; $i > 0; $i--) {
            if ($explodeDirModule[$i - 1] == 'index.php') {
                return $explodeDirModule[$i - 2];
            }
        }
        return null;
    }

}
