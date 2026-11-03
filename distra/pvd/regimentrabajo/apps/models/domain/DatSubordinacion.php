<?php

class DatSubordinacion extends BaseDatSubordinacion
{

    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idrotacionturno)
    {
        return Doctrine::getTable('DatSubordinacion')->find('idsubordinacion');
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatSubordinacion')->execute ();
        return $result->toArray();
    }

    public function existePrsonaSub($idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select('sub.*')
            ->from('DatSubordinacion sub')
            ->where("sub.idpersona = '$idpersona'");
        return $queryObj->fetchArray();
    }

     public function GetByIdpersonas($idpersonas)
    {
        $queryObj = Doctrine_Query::create()
            ->select('sub.*')
            ->from('DatSubordinacion sub')
            ->where("sub.idpersona in (".implode(',',$idpersonas).")");
        return $queryObj->fetchArray();
    }

    public function existeEstructuraSub($idestructuraasistencia)
    {
        $queryObj = Doctrine_Query::create()
            ->select('sub.*')
            ->from('DatSubordinacion sub')
            ->where("sub.idestructuraasistencia = '$idestructuraasistencia'");
        return $queryObj->fetchArray();
    }

    public function GetAllPersonasSubordinadas()
    {
        $query = new Doctrine_Query ();
        $result = $query->select('ds.idpersona as idpersona')
            ->from('DatSubordinacion ds');
        return $result->fetchArray();
    }

}

