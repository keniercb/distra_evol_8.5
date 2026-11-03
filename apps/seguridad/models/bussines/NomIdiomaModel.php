<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class NomIdiomaModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertaridioma($idioma)
    {
        $idioma->save();
    }

    function modificaridioma($idioma)
    {
        $idioma->save();
    }

    function eliminaridioma($idioma)
    {
        $idioma->delete();
    }

}