<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatServicioDatSistemaModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertarserviciocons($instance)
    {
        $instance->save();
    }

    function modificarserviciocons($instance)
    {
        $instance->save();
    }

}