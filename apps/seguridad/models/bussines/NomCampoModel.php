<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class NomCampoModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertarcampo($campo)
    {
        $campo->save();
        return true;
    }

    function modificarcampo($campo)
    {
        $campo->save();
        return true;
    }

    function eliminarcampo($campo)
    {
        $campo->delete();
        return true;
    }

}