<?php


class DatPieFirmaDefDocumento extends BaseDatPieFirmaDefDocumento
{
    public function setUp()
    {
        parent::setUp();
    }

    public static function getByIdEstructuraAndIdFuncionalidad($idestructura, $idfuncionalidad)
    {
        $obj = Doctrine::getTable('DatPieFirmaDefDocumento')
            ->findBySql('idestructura = ? and idfuncionalidad = ?', array($idestructura, $idfuncionalidad));
        return $obj->toArray();
    }

    public static function deleteByIdEstructuraAndIdFuncionalidad($idestructura, $idfuncionalidad)
    {
        $obj = Doctrine::getTable('DatPieFirmaDefDocumento')
            ->findBySql('idestructura = ? and idfuncionalidad = ?', array($idestructura, $idfuncionalidad));
        $obj->delete();
        return true;
    }
}