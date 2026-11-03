<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatSistemaModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function insertarsistema($arrayObjServidores, $sistema)
    {
        $sistema->save();
        if ($arrayObjServidores) {
            foreach ($arrayObjServidores as $servidor)
                $servidor->save();
        }
    }

    public function modificarsistema($arrayObjServidores, $sistema)
    {
        $sistema->save();
        if ($arrayObjServidores) {
            foreach ($arrayObjServidores as $servidor)
                $servidor->save();
        }
    }

    public function registrarConexiones($arrayObjServidores)
    {
        if (count($arrayObjServidores) > 0) {
            foreach ($arrayObjServidores as $servidor)
                $servidor->save();
        }
    }

}