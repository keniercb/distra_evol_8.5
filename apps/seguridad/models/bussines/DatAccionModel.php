<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatAccionModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function insertaraccion($accion)
    {
        $accion->save();
        $objAccCompart = new DatAccionCompartimentacion();
        $objAccCompart->idaccion = $accion->idaccion;
        $objAccCompart->iddominio = $this->global->Perfil->iddominio;
        $objAccCompart->save();
        return $accion->idaccion;
    }

    public function modificaraccion($instance)
    {
        $instance->save();
        return true;
    }

    public function eliminaraccion($instance)
    {
        $instance->delete();
        return true;
    }

}