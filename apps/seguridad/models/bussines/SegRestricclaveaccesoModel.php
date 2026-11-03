<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class SegRestricclaveaccesoModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    function insertarclave($clave)
    {
        try {
            $clave->save();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    function modificarclave($clave)
    {
        try {
            $clave->save();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

    function eliminarclave($clave)
    {
        try {
            $clave->delete();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw $ee;
        }
    }

}