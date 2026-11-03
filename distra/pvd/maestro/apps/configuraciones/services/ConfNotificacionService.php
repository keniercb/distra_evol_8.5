<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 13/11/2017
 * Time: 13:39
 */

class ConfNotificacionService extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function obtenerConfigNotificacion($identidad, $iddominio) {
        try {
            $obj = new ConfNotificacionModel();
            return $obj->obtenerConfigByEntidadDominio($identidad, $iddominio);
        } catch (Exception $e) {
            throw $e;
        }
    }
}