<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 02/11/2017
 * Time: 10:21
 */

class NotificacionService extends ZendExt_Model
{
    public function NotificacionService()
    {
        parent::ZendExt_Model();
    }

    public function enviarCorreo($identidad, $iddominio, $datos)
    {
        $obj = new NotificacionModel();
        return $obj->enviarCorreo($identidad, $iddominio, $datos);
    }
}