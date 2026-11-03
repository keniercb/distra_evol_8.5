<?php

/**
 *Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatFuncionalidadDatAccionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_funcionalidad_dat_accion(
        $datFuncionalidadDatAccion
    )
    {
        $datFuncionalidadDatAccion->save();
    }

    public function modificardat_funcionalidad_dat_accion(
        $datFuncionalidadDatAccion
    )
    {
        $datFuncionalidadDatAccion->save();
    }

    public function eliminardat_funcionalidad_dat_accion(
        $datFuncionalidadDatAccion
    )
    {
        $datFuncionalidadDatAccion->delete();
    }
}