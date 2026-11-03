<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatSerautenticacionModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function eliminarservauth($instance)
    {
        $instance->delete();
        return true;
    }

    function insertar($tiposerv)
    {
        $tiposerv->save();
    }

    function modificarservidor($servidor)
    {
        $servidor->save();
    }

    function modificarservidorsabd($servidor)
    {
        $servidor->save();
    }

    function eliminarservidor($instance)
    {
        $instance->delete();
    }

}