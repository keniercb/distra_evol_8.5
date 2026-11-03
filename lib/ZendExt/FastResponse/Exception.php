<?php
/**
 * ZendExt_FastResponse_Exception
 *
 * Gestor de excepciones de ZendExt_FastResponse
 *
 * @author     Yoandry Morejon Borbon
 * @package    ZendExt
 * @subpackage ZendExt_FastResponse
 * @copyright  UCID-ERP Cuba
 * @version    1.0-0
 */
class ZendExt_FastResponse_Exception extends Exception
{
    /**
     * __construct
     *
     * Constructor de la clase
     *
     * @param string  $pXml   - identificador del xml a cargar
     * @param boolean $pFound - bandera para determinar si se encontro o no el xml
     *
     * @return void
     */
    function __construct($pXml, $pFound)
    {
        if ($pFound == true) {
            $msg = "El xml '$pXml' contiene errores.";
        } else {
            $msg = "El xml '$pXml' no fue encontrado.";
        }
        parent::__construct($msg);
    }
}
