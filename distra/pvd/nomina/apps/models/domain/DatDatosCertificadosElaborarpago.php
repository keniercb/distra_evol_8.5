<?php

class DatDatosCertificadosElaborarpago extends BaseDatosCertificadosElaborarpago
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatNomina', array(
            'local' => 'idnomina',
            'foreign' => 'idnomina',
            'refClass' => 'DatNominaDatos'
        ));
    }

    public static function obtenerObj($iddatoscertificadoselaborarpago)
    {
        return Doctrine::getTable('DatDatosCertificadosElaborarpago')->find($iddatoscertificadoselaborarpago);
    }


    public static function obtenerDatosCertificadosIdElaborarPagos($idelaborarpagos)
    {
        $sqlDoctrine = Doctrine_Query::create()->select('*')
            ->from('DatDatosCertificadosElaborarpago')
            ->where('idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchArray();
        return $sqlDoctrine;
    }

    public static function obtenerIdDatosIdElaborarPagos($idelaborarpagos)
    {
        $sqlDoctrine = Doctrine_Query::create()->select('iddatoscertificadoselaborarpago')
            ->from('DatDatosCertificadosElaborarpago')
            ->where('idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchOne()
            ->iddatoscertificadoselaborarpago;
        return $sqlDoctrine;
    }

    public static function obtenerDatosCertificadosSerializados($idelaborarpagos)
    {
        $sqlDoctrine = Doctrine_Query::create()->select('datoscetificados')
            ->from('DatDatosCertificadosElaborarpago')
            ->where('idelaborarpagos = ?', array($idelaborarpagos))
            ->fetchOne()
            ->datoscetificados;
        return $sqlDoctrine;
    }

}
