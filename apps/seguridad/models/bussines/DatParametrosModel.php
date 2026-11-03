<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatParametrosModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertarparametro($parametro)
    {
        $parametro->save();
    }

    function modificarparametro($parametro)
    {
        $parametro->save();
    }

    function eliminarparametro($parametro)
    {
        $parametro->delete();
    }

}