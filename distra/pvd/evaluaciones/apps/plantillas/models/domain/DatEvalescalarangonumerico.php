<?php

class DatEvalescalarangonumerico extends BaseDatEvalescalarangonumerico
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatEvalescala', array('local' => 'idescala', 'foreign' => 'idescala'));
        $this->hasMany(
            'NomEvalvaloresnumericos', array('local' => 'idescalarangonumerico', 'foreign' => 'idescalarangonumerico')
        );
    }

    public function Buscar($idescala)
    {
        $query = new Doctrine_Query ();
        $temp = $query->from('DatEvalescalarangonumerico')
            ->where("idescala = ?", $idescala)
            ->execute()
            ->toArray();
        return $temp;
    }


    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalescalarangonumerico')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 10, $inicio = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalescalarangonumerico')->limit($limite = 10)->offset($inicio = 0)->execute();
        return $result->toArray();
    }

    public function getValoresEscala($idescala)
    {
        $query = Doctrine_Manager::getInstance();
        $sql
            = 'select rn.idescalarangonumerico, vn.denom, vn.idvaloresnumericos
				from mod_evaluaciones.dat_evalescalarangonumerico rn
				inner join mod_evaluaciones.nom_evalvaloresnumericos vn on(rn.idescalarangonumerico = vn.idescalarangonumerico)
				where rn.idescala = ' . $idescala;
        $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function findByIdescala($idescala)
    {
        return $DatEvalregla = Doctrine::getTable('DatEvalescalarangonumerico')->findByDql("idescala = {$idescala}");
    }

}