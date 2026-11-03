<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatGestorModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertarnomgestor($gestor)
    {
        $gestor->save();
    }

    function modificarnomgestor($instance)
    {
        $instance->save();
    }

    function eliminarnomgestor($instance)
    {
        $instance->delete();
    }

}