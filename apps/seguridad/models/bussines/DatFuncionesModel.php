<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatFuncionesModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function insertarfuncion($funcion)
    {
        $funcion->save();
    }

    public function modificarfuncion($instance)
    {
        $instance->save();
    }

    public function eliminarfuncion($instance)
    {
        $instance->delete();
    }

}