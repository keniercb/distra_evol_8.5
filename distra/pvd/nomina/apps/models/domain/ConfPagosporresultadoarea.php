<?php

class ConfPagosporresultadoarea extends BaseConfPagosporresultadoarea
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomAreas', array('local' => 'idarea', 'foreign' => 'idarea'));
    }

    public function getByid($idpagoporresultadoarea)
    {
        return Doctrine::getTable('ConfPagosporresultadoarea')->find($idpagoporresultadoarea)->toArray();
    }

    /* Devuelve todas las areas incluidas en el pago con sus montos en caso de tenerlos
     *  dado el $idpagoresultado
     *
     * */

    public function getAreasPagoPorResultadoDadoIdPago($idestructura, $idpagoporresultado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT DISTINCT 
                  na.denominacion as area,
                  na.idarea,
                  na.composicion,
                  ccpr.idpagoporresultado
                FROM mod_nomina.nom_areas na
                INNER JOIN mod_nomina.nom_areascargos nac ON (nac.idarea = na.idarea)
                INNER JOIN mod_nomina.conf_cargospagoporresultado ccpr ON (ccpr.idcargo = nac.idcargo and ccpr.idarea = nac.idarea)
                INNER JOIN mod_nomina.conf_pagosporresultado cpr ON (cpr.idpagoporresultado = ccpr.idpagoporresultado and cpr.idpagoporresultado = {$idpagoporresultado})
                LEFT JOIN mod_nomina.conf_agrupadorareas caa ON (caa.idpagoporresultado = cpr.idpagoporresultado and caa.identidad = {$idestructura})
                LEFT JOIN mod_nomina.conf_formulasareasmontos cfam ON (cfam.idagrupadorarea = caa.idagrupador)
                WHERE
                  na.idestructura         = {$idestructura} and
                  ccpr.idpagoporresultado = {$idpagoporresultado} and
                  nac.idcargo IN (SELECT ccpr2.idcargo FROM mod_nomina.conf_cargospagoporresultado ccpr2 WHERE ccpr2.idpagoporresultado = {$idpagoporresultado})";
        //print_r($sql);die;
        return $conn->fetchAll($sql);

    }

    public function getMontoAreaPagoPorResultado($idarea, $idpagoporresultado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT cpra.monto
                FROM mod_nomina.conf_pagosporresultadoarea cpra
                WHERE cpra.idarea = ? and cpra.idpagoporresultado = ?";
        return $conn->fetchOne($sql, array($idarea, $idpagoporresultado));
    }


    /*Devuelve las areas configuradas al pago con sus respectivos montos
     *
     * */
    public function getAreasConfiguradasPorPago($idpagoporresultado)
    {
        $query = new Doctrine_Query();
        $result = $query->select('confPag.*,nomArea.denominacion as area')
            ->from('ConfPagosporresultadoarea confArea')
            ->innerJoin('confArea.NomAreas nomArea')
            ->Where("confArea.idpagoporresultado= $idpagoporresultado");
        return $result->fetchArray();

    }

    public function eliminarAreasDelPago($idpagoresultado, $idarea)
    {
        $sql = "delete from mod_nomina.conf_pagosporresultadoarea
            WHERE mod_nomina.conf_pagosporresultadoarea.idpagoporresultado = ? and idarea = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idpagoresultado, $idarea));
    }

    public function eliminarMontosTodasAreasPagoPorResultado($identidad, $idpagoporresultado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "DELETE FROM mod_nomina.conf_pagosporresultadoarea
                        WHERE idpagoporresultado = ?;";
        return $conn->execute($sql, array($idpagoporresultado));
    }

    public function obtenerComposicionDadoIdPagoResultado($idestructura, $idpagoporresultado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT na.composicion as composicion
                FROM mod_nomina.nom_areas na
                INNER JOIN mod_nomina.conf_pagosporresultadoarea cpra ON (cpra.idarea = na.idarea)
                WHERE cpra.idpagoporresultado = ? and  na.idestructura = ?";
        return $conn->fetchAll($sql, array($idpagoporresultado, $idestructura));
    }

    public function obtenerAreasCargosEntidadPagoResultado($idpagoporresultado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT nac.idcargo 
                FROM mod_nomina.nom_areascargos nac
                INNER JOIN mod_nomina.conf_pagosporresultadoarea cpra ON (cpra.idarea = nac.idarea)
                WHERE cpra.idpagoporresultado = ?";
        return $conn->fetchAll($sql, array($idpagoporresultado));
    }

    public function getAreasMontosPagoPorResultado($identidad, $idpagoporresultado)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT * FROM mod_nomina.conf_pagosporresultadoarea cpra
                INNER JOIN mod_nomina.conf_agrupadorareas caa ON (caa.idpagoporresultado = cpra.idpagoporresultado)
                WHERE caa.identidad = ? and cpra.idpagoporresultado = ?";
        return $conn->fetchAll($sql, array($identidad, $idpagoporresultado));
    }

    public function getIdPagoPorResultadoAreaxPagoResultadoxIdArea($idpagoporresultado, $area)
    {
        $query = new Doctrine_Query();
        $result = $query->select('idpagoporresultadoarea')
            ->from('ConfPagosporresultadoarea')
            ->Where("idpagoporresultado = ? and idarea = ?", array($idpagoporresultado, $area));
        return $result->fetchOne()->idpagoporresultadoarea;

    }

}

