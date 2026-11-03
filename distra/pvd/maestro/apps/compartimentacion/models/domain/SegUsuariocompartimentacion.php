<?php
class SegUsuariocompartimentacion extends BaseSegUsuariocompartimentacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('SegCompartimentacion', array('local' => 'idcompartimentacion', 'foreign' => 'idcompartimentacion'));
    }

    public function getById($idusuariocompartimentacion)
    {
        return Doctrine::getTable('SegUsuariocompartimentacion')->find($idusuariocompartimentacion);
    }

    public function getCompartimentacionesByUser($idusuario)
    {
        $queryObj = Doctrine_Query::create()
            ->select('d.*, c.denominacion as denomcompartimentacion')
            ->from('SegUsuariocompartimentacion d')
			->innerJoin('d.SegCompartimentacion c')
			->where("d.idusuario = '$idusuario'");
        return $queryObj->fetchArray();
    }

    public function deleteByUsuario($idusuario)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('SegUsuariocompartimentacion c')
            ->where("c.idusuario = '$idusuario'")
            ->execute();
    }
}
