<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class SegCertificadoModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model('seguridad');
    }

    public function insertarcertificado($objCertificado)
    {
        $objCertificado->save();
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->commit();
    }

    public function modificarcertificado($objCertificado)
    {
        $objCertificado->save();
    }

    public function updateCertificado($objCertificado)
    {
        $objCertificado->save();
        $this->conn->commit();
    }

}