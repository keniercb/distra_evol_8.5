<?php

class ConfFormulasAreasMontos extends BaseConfFormulasAreasMontos
{

    public function obtenerFormulasAreasMontosXId($idformulaareamonto)
    {
        return Doctrine::getTable('ConfFormulasAreasMontos')->find($idformulaareamonto);
    }

    public function obtenerConfFormulasAreasMontosXIdAgrupador($idagrupador)
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfFormulasAreasMontos')
            ->where('idagrupadorarea = ?', array($idagrupador))
            ->orderBy('idformulaareamonto ASC')
            ->fetchArray();
    }

    public function obtenerIdAreasMontosXIdAgrupador($idagrupador)
    {
        return Doctrine_Query::create()
            ->select('idarea')
            ->from('ConfFormulasAreasMontos')
            ->where('idagrupadorarea = ?', array($idagrupador))
            ->orderBy('idarea ASC')
            ->fetchArray();
    }

    public function obtenerExpresionMatematicaxIdAreassXIdAgrupador($idagrupador, $idarea)
    {
        return Doctrine_Query::create()
            ->select('idformula')
            ->from('ConfFormulasAreasMontos')
            ->where('idagrupadorarea = ? and idarea = ?', array($idagrupador, $idarea))
            ->orderBy('idarea ASC')
            ->fetchOne()
            ->idformula;
    }

    public function obtenerTodosConfFormulasAreasMontos()
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfFormulasAreasMontos')
            ->fetchArray();
    }

    public function obtenerTodasAreasAgrupadores($identidad, $idpagoporresultado)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "select cfam.*, caa.identidad, caa.idpagoporresultado
                from mod_nomina.conf_formulasareasmontos cfam 
                inner join mod_nomina.conf_agrupadorareas caa on (caa.idagrupador = cfam.idagrupadorarea)
                where caa.identidad = ? and caa.idpagoporresultado = ?;";
        return $conn->fetchAll($sql, array($identidad, $idpagoporresultado));
    }

    public function existeArea($idagrupador, $idarea)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "select * from mod_nomina.conf_formulasareasmontos where idagrupadorarea = ? and idarea = ?;";
        $coincidencia = $conn->fetchAll($sql, array($idagrupador, $idarea));
        return (empty($coincidencia)) ? 0 : 1;
    }
}
