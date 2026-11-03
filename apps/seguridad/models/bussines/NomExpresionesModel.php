<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class NomExpresionesModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertarexpresion($expresion)
    {
        $expresion->save();
    }

    function modificarexpresion($expresion)
    {
        $expresion->save();
    }

}