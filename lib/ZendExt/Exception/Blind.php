<?php

/**
 * ZendExt_Exception_Blind
 *
 * Gestor de excepciones ciegas
 *
 * @author     Omar Antonio Diaz Peña
 * @package    ZendExt
 * @subpackage ZendExt_Exception
 * @copyright  Centro UCID
 * @version    1.0-0
 */
class ZendExt_Exception_Blind extends ZendExt_Exception_Base
{

    /**
     * ZendExt_Exception_Blind
     *
     * Constructor de la clase
     *
     * @param ZendExt_Exception_Log $pParent - Excepcion padre
     *
     * @return void.
     */
    public function ZendExt_Exception_Blind($pParent)
    {
        parent::ZendExt_Exception_Base($pParent);
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
        return "
						----------------------------------------------------------------------
	   				   Excepción: 
					   Código: " . $this->_parent->getIdException() . ",
					   Descripción: " . $this->_parent->getDescription();
    }

    /**
     * handle
     *
     * Gestionar las excepciones.
     *
     * @return void.
     * @ignore este metodo no posee implementacion pues la excepciones ciegas
     * no deben ser mangejadas, solamente son para navegar dentro de las aplicaciones.
     */
    public function handle()
    {

    }

}
