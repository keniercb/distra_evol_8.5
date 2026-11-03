<?php 
class DatControlador extends BaseDatControlador
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEstructuracontrol', array('local'=>'idestructuracontrol','foreign'=>'idestructuracontrol'));
        $this->hasMany('DatControlado', array('local'=>'idcontrolador','foreign'=>'idcontrolador'));
        $this->hasMany('DatMovimientos', array('local'=>'idcontrolador','foreign'=>'idcontrolador'));
    }

    public function getById($idcontrolador)
    {
        return Doctrine::getTable('DatControlador')->find($idcontrolador);
    }

    public function getControladorByIdestructuracontrol($idestructuracontrol)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*, dc.*, dm.*')
            ->from('DatControlador c')
            ->leftJoin('c.DatControlado dc')
            ->leftJoin('c.DatMovimientos dm')
            ->where("c.idestructuracontrol = '$idestructuracontrol'");
        return $queryObj->fetchArray();
    }

    public function getControladorByIdestructuracontrolsimple($idestructuracontrol)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('DatControlador c')
            ->where("c.idestructuracontrol = '$idestructuracontrol'");
        return $queryObj->fetchArray();
    }

    public function getControladorByIdcargoIdpersona($idestructuracontrol, $idcargo, $idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('c.*')
            ->from('DatControlador c')
            ->where(
                "c.idestructuracontrol='$idestructuracontrol' and c.idcargo='$idcargo' and c.idpersona='$idpersona'"
            );
        return $queryObj->fetchArray();
    }

    public function deleteControladorByEstControl($idestructuracontrol)
    {
        $queryObj = Doctrine_Query::create()
            ->delete()
            ->from('DatControlador c')
            ->where("c.idestructuracontrol = '$idestructuracontrol'")
            ->execute();
    }
}