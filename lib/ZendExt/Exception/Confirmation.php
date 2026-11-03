<?php

/**
 * ZendExt_Exception_Confirmation
 *
 * Gestor de confirmaciones
 *
 * @author     Omar Antonio Diaz Peña
 * @package    ZendExt
 * @subpackage ZendExt_Exception
 * @copyright  Centro UCID
 * @version    1.0-0
 */
class ZendExt_Exception_Confirmation extends ZendExt_Exception_Base
{

    /**
     * ZendExt_Exception_Presentation
     *
     * Constructor de la clase
     *
     * @param ZendExt_Exception_Presentation $pParent - Excepcion padre
     *
     * @return void.
     */
    public function ZendExt_Exception_Confirmation($pParent)
    {
        parent :: ZendExt_Exception_Base($pParent);
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
     * Gestionar las excepciones de presentacion
     *
     * @return void.
     */
    public function handle()
    {
        $strException = (string)$this->_parent->getDescription();
        $send->codMsg = 2;
        $send->mensaje = $strException;
        //Este es para mandar en el json los detalles de la excepción.
        $send->detalles = $this->getInnerExceptions();
        if (
//          Para las solicitudes AJAX
            isset($_SERVER['HTTP_X_REQUESTED_WITH']) ||
//          Para las solicitudes POST con ficheros (envíos de formularios)
            strpos($_SERVER['CONTENT_TYPE'],'multipart/form-data;') !== false ||
            strpos($_SERVER['CONTENT_TYPE'],'application/x-www-form-urlencoded;') !== false) {
            echo json_encode($send);
        } //Se imprime la excepcion en codigo json
    }

}
