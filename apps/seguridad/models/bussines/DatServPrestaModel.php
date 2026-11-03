<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatServPrestaModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertarservicio($instance)
    {
        $instance->save();
    }

    function eliminarservicio($instance)
    {
        $instance->delete();
    }

    function modificarservicio($instance)
    {
        $instance->save();
    }

}