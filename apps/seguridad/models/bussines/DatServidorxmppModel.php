<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatServidorxmppModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function eliminarServidorxmpp($instance)
    {
        $instance->delete();
        return true;
    }

    function insertarServidorxmpp($tiposerv)
    {
        $tiposerv->save();
    }

    function modificarServidorxmpp($servidor)
    {
        $servidor->save();
    }
}