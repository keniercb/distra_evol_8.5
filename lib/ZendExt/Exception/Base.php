<?php

/**
 * ZendExt_Exception_Base
 *
 * Clase abstracta de la cual que realiza la gestion basica de excepciones
 *
 * @author     Omar Antonio Diaz Peña
 * @package    ZendExt
 * @subpackage ZendExt_Exception
 * @copyright  Centro UCID.
 * @version    1.0-0
 */
abstract class ZendExt_Exception_Base
{

    /**
     * Excepcion padre
     *
     * @var ZendExt_Exception_Log|ZendExt_Exception_LogPresentacion|
     *        ZendExt_Exception_Blind|Ext_Exception_Presentacion
     */
    protected $_parent;

    /**
     * Constructor
     *
     * @param ZendExt_Exception_Log|ZendExt_Exception_LogPresentacion|ZendExt_Exception_Blind|
     *          Ext_Exception_Presentacion $pParent - Excepcion padre.
     *
     * @return void.
     */
    public function ZendExt_Exception_Base($pParent)
    {
        $this->_parent = $pParent;
    }

    /**
     * getInnerExceptions
     *
     * Retorna las excepciones interiores en forma de texto.
     *
     * @return string
     */
    public function getInnerExceptions()
    {
        $result = '';
        $inner = $this->_parent->getInnerException();
        while ($inner instanceof ZendExt_Exception) {
            $result .= $inner->getInstance()->toString();
            $inner = $inner->getInnerException();
        }
        if ($inner instanceof Exception || $inner instanceof ZendExt_Exception_NotDefined) {
            $result .= $inner->__toString();
        }
        return $result;
    }

    /**
     * toString
     *
     * Metodo abstracto para convertir la excepción a cadena
     *
     * @return string
     */
    abstract public function toString();

    /**
     * handle
     *
     * Metodo abstracto para personalizar la forma de gestionar el tipo de
     * excepciones.
     *
     * @return void.
     */
    abstract public function handle();
}
