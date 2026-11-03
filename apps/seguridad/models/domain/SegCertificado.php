<?php

/**
 * Clase dominio de ceriticado para el acceso a datos.
 *
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0.0
 */
class SegCertificado extends BaseSegCertificado
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'SegUsuario',
            array('local' => 'idusuario', 'foreign' => 'idusuario')
        );
    }

    public function existecertificado($idusuario, $mac)
    {
        $query = Doctrine_Query::create();
        $certificado = $query->select('c.idcertificado, c.idusuario')
            ->from('SegCertificado c')
            ->where("c.idusuario = ? and c.mac = ?", array($idusuario, $mac))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $certificado;
    }

    public function verificarcertificado($certificado)
    {
        $query = Doctrine_Query::create();
        $certificado = $query->select('idusuario,idcertificado')
            ->from('SegCertificado')
            ->where("valor = ?", $certificado)
            ->execute();
        return $certificado;
    }

    static public function existcertificado($certificado)
    {
        $query = Doctrine_Query::create();
        $certificado = $query->from('SegCertificado')
            ->where("valor = ?", $certificado)
            ->count();
        return $certificado;
    }

    public function getCertificadoByIdUsuario($idusuario)
    {
        $query = Doctrine_Query::create();
        $certificado = $query->select('c.idcertificado, c.valor')
            ->from('SegCertificado c')
            ->where("c.idusuario = ?", $idusuario)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $certificado;
    }

    public function getCertificadoByUserAndMac($usuario, $mac)
    {
        $query = Doctrine_Query::create();
        $datos = $query->select('c.idcertificado, c.valor, c.mac, c.idusuario')
            ->from('SegCertificado c')
            ->innerjoin('c.SegUsuario u')
            ->where("c.mac = ? and u.nombreusuario = ?", array($mac, $usuario))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $datos;
    }

    public function createOrUpdateCertificado($payload)
    {
        $existId = $this->existecertificado($payload['idusuario'], $payload['mac']);
        $objCertificado = new SegCertificado();
        if ($existId) {
            $objCertificado->assignIdentifier($existId[0]['idcertificado']);
        }
        $objCertificado->fromArray($payload);
        $objCertificado->save();
        return $objCertificado;
    }

}