<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatAccionDatReporteModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function insertaraccionreporte($arrayRepoAcc)
    {

        foreach ($arrayRepoAcc as $valor)
            $valor->save();

        return true;
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