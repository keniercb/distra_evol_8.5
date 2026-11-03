<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class SegCompartimentacionrolesModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function insertarRolesDominio($arrayIns, $arrayElim)
    {
        if (count($arrayElim))
            foreach ($arrayElim as $objElim) {
                SegCompartimentacionroles::
                    eliminarRolesDominio($objElim->idrol, $objElim->iddominio);
            }
        if (count($arrayIns))
            foreach ($arrayIns as $obj) {
                $obj->save();
            }
        return true;
    }

}