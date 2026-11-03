<?php

class DatConfiguraciontipoaccion extends BaseDatConfiguraciontipoaccion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipoaccionimportar',
            array('local' => 'idtipoaccion', 'foreign' => 'idtipoaccion')
        );
        $this->hasOne(
            'DatConfiguracionimportar',
            array('local' => 'idconfiguracion', 'foreign' => 'idconfiguracion')
        );
        $this->hasOne(
            'NomServicioimportar',
            array('local' => 'idservicio', 'foreign' => 'idservicio')
        );
    }

    public static function obtenerConfigTipoAccionDadoIds($idtipoaccion,
        $idconfiguracion
    ) 
    {
        $configtipoaccion = Doctrine::getTable('DatConfiguraciontipoaccion')
            ->find(
                array($idconfiguracion, $idtipoaccion)
            );
        return $configtipoaccion;
    }

    public static function obtenerServicioDadoIdsConfig($idtipoaccion,
        $idconfiguracion
    ) 
    {
        $query = Doctrine_Query::create();
        $query->select('dcta.idservicio, nsi.*')->from(
            'DatConfiguraciontipoaccion dcta'
        )->innerJoin(
            'dcta.NomServicioimportar nsi'
        )->where(
            'dcta.idtipoaccion = ? and dcta.idconfiguracion = ?',
            array($idtipoaccion, $idconfiguracion)
        );
        $result = $query->fetchOne();
        return $result;
    }

}
