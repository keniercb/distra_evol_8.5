<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class SegDominioModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertardominio($dominio)
    {
        $dominio->save();
    }

    function modificardominio($dominio)
    {
        $dominio->save();
    }

    function eliminardominio($dominio)
    {
        $dominio->delete();
    }

}