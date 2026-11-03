<?php

/**
 * ZendExt_Exception_Log
 *
 * Gestor de excepciones de log
 *
 * @author     Omar Antonio Diaz Pena
 * @package    ZendExt
 * @subpackage ZendExt_Exception
 * @copyright  Centro UCID
 * @version    1.0-0
 */
class ZendExt_Exception_Log extends ZendExt_Exception_Base
{

    /**
     * ZendExt_Exception_Log
     *
     * Constructor de la clase
     *
     * @param ZendExt_Exception $pParent - Excepcion padre
     *
     * @return void.
     */
    public function ZendExt_Exception_Log($pParent)
    {
        parent::ZendExt_Exception_Base($pParent);
    }

    /**
     * GenerateTraceException($exception)
     *
     * Genera una nueva traza de tipo excepcion
     *
     * @param $exception Excepcion de tipo ZendExt_Exception_Log
     */
    public function GenerateTraceException($exception)
    {
        $trace = ZendExt_Aspect_Trace::getInstance();
        $trace->exceptionTraceAction($exception);
    }

    public function getIdException()
    {
        return $this->_parent->getIdException();
    }

    public function getType()
    {
        return $this->_parent->getType();
    }

    public function getMessage()
    {
        return $this->_parent->getMessage();
    }

    public function getDescription()
    {
        return $this->_parent->getDescription();
    }

    public function getInnerException()
    {
        return $this->_parent->getInnerException();
    }

    /**
     * toString
     *
     * Convierte la excepcion a cadena
     *
     * @return string
     */
    public function toString()
    {
        $fecha = date('d/m/y');
        $hora = date('h:i:s');

        $interiores = $this->getInnerExceptions();
        $interiores = ($interiores == '') ? '<No posee>' : $interiores;

        $str
            = "
----------------------------------------------------------------------
Excepcion: 
Codigo: " . $this->_parent->getIdException() . "
Clase: " . $this->_parent->getClass() . "
Metodo: " . $this->_parent->getMethod() . "
Descripcion: " . $this->_parent->getMessage() /* $this->parent->getDescription() */ . "
Traza: 
" . $this->_parent->getTraceAsString() . "
Linea: " . $this->_parent->getLine() . "
Fichero: " . $this->_parent->getFile() . "
Fecha: $fecha
Hora:  $hora
Excepciones Interiores: 
$interiores
";
        return $str;
    }

    /**
     * write
     *
     * Escribe la excepcion en cadena en un fichero log
     *
     * @param string $pStr - excepcion en cadena
     *
     * @return void
     */
    public function write($pStr)
    {
        $configInstance = Zend_Registry::get('config');

        //Se intenta abrir el fichero para escribir al final del mismo
        $file = @fopen($configInstance->exception_log_file, "a");
        if (!$file) {
            $file = @fopen($configInstance->exception_log_file, "w+");
        }
        if ($file) { //Si se pudo abrir o crear el fichero
            //Escribo el log y cierro el fichero
            fputs($file, $pStr);
            fclose($file);
        } else {
            //Todo Hacer algo para avisar al administrador del sistema un correo 
            //para que restaure los permisos de escritura de apache en el MT
        }
    }

    /**
     * handle
     *
     * Gestionar las excepciones de log
     *
     * @return void.
     */
    public function handle()
    {
        $this->GenerateTraceException($this);
        ZendExt_Logger::write($this->toString());
    }

    private function sendSupportIncidence()
    {
        $config = json_decode(file_get_contents(DIR_ABS_MT . 'apps/comun/recursos/json/ceinclient.json'));
        if ($config->dir) {
            if ($this->_parent->getIdException() == 'NOCONTROLLED') {
                $register = Zend_Registry::getInstance();
                $moduleReference = $register->config->module_reference;
                $perfil = ZendExt_GlobalConcept::getInstance()->Perfil;
                $licencia = json_decode(file_get_contents(DIR_ABS_MT . "/app.json"), true);

                if (!$licencia['idcliente'] || !$licencia['producto']) {
                    return;
                } else {
                    $idproducto = $licencia['idproducto'];
                }
                $parametros = array();
                $parametros['descripcion'] = str_replace("'", "", $this->_parent->getTraceAsString() . "\n" . $this->getInnerExceptions());
                $parametros['funcionalidad'] = $moduleReference;
                $parametros['pathname'] = "";
                $parametros['via'] = 5;
                $parametros['imagen'] = "";

                if (!ZendExt_IoC::getInstance()->gestor_ncclient->compararDescripciones(
                    array(
                        "descripcion" => $parametros['descripcion'],
                        "idusuario" => $perfil->idusuario,
                        "idproducto" => $idproducto
                    ))['success']) {
                    ZendExt_IoC::getInstance()->gestor_ncclient->adicionarIncidencia($parametros);
                }
            }
        }
    }

}
