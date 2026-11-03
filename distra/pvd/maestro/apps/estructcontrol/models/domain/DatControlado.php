<?php 
class DatControlado extends BaseDatControlado
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatControlador', array('local'=>'idcontrolador','foreign'=>'idcontrolador'));
    }

    public function getById($idcontrolado)
    {
        return Doctrine::getTable('DatControlado')->find($idcontrolado);
    }

    public function getControladoByIdcontrolador($idcontrolador)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('DatControlado c')
            ->where("c.idcontrolador = '$idcontrolador'");
        return $queryObj->fetchArray();
    }

    public function getControladoByIdcontroladorCargo($idcontrolador, $idcargoarea)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('DatControlado c')
            ->where("c.idcontrolador = '$idcontrolador' and (c.idcargo = '$idcargoarea' or c.idarea = '$idcargoarea')");
        return $queryObj->fetchArray();
    }
}