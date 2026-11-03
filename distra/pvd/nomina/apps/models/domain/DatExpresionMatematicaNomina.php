<?php

class DatExpresionMatematicaNomina extends BaseDatExpresionMatematicaNomina
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany("DatElementoExpresionMatematicaNomina", array('local' => 'idexpresionmatematica', 'foreign' => 'idexpresionmatematica'));
    }

    public function Buscar($idexpresionmatematica)
    {
        try {
            $temp = Doctrine::getTable('DatExpresionMatematicaNomina')->find($idexpresionmatematica);
            return $temp;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function buscarExpArray($idexpresionmatematica)
    {
        $sql = Doctrine_Query::create();
        $sql->from('DatExpresionMatematicaNomina')
            ->where('idexpresionmatematica = ?', array($idexpresionmatematica));
        return $sql->fetchArray();
    }

    public function GetTodos()
    {
        $sql = "select * from mod_utiles.dat_expresionmatematica ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchAll($sql);
        return $result;
    }

    public function GetTodosporarrIdExpMat($arrIdexpresionmatematica)
    {
        $result = array();
        if (count($arrIdexpresionmatematica) > 0) {
            $sql = "select * from  mod_utiles.dat_expresionmatematica where idexpresionmatematica in (" . implode(',', $arrIdexpresionmatematica) . ");";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $result = $conn->fetchAll($sql);
        }
        return $result;
    }

    public function obtenerCamposFormula($idexpresionmatematica) {
        $sql = "select * from mod_utiles.dat_expresionmatematica dem
            where dem.idexpresionmatematica = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idexpresionmatematica));
        return $r;
    }

}