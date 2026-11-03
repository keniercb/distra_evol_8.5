<?php

class ConfAgrupadorAreas extends BaseConfAgrupadorAreas
{

    public function obtenerAgrupadoresXId($idagrupador)
    {
        return Doctrine::getTable('ConfAgrupadorAreas')->find($idagrupador);
    }

    public function obtenerAgrupadoresXIdPagoPorResultado($identidad,$idpagoporresultado)
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfAgrupadorAreas')
            ->where('identidad = ? and idpagoporresultado = ?', array($identidad,$idpagoporresultado))
            ->orderBy('idagrupador')
            ->fetchArray();
    }

    public function obtenerCantidadAgrupadoresXIdPagoPorResultado($identidad,$idpagoporresultado)
    {
        return Doctrine_Query::create()
            ->select('count(idagrupador) as cantidad')
            ->from('ConfAgrupadorAreas')
            ->where('identidad = ? and idpagoporresultado = ?', array($identidad,$idpagoporresultado))
            ->fetchOne()
            ->cantidad;
    }

    public function obtenerTodosAgrupadores()
    {
        return Doctrine_Query::create()
            ->select('*')
            ->from('ConfAgrupadorAreas')
            ->fetchArray();
    }

    public function existeAgrupador($identidad, $idpagoporresultado, $denominacion)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "select * from mod_nomina.conf_agrupadorareas where identidad = ? and idpagoporresultado = ? and denominacion = ?;";
        $coincidencia = $conn->fetchAll($sql, array($identidad, $idpagoporresultado, $denominacion));
        return (empty($coincidencia)) ? 0 : 1;
    }

    //Areas de la entidad configuradas para un pago por resultados con configuraciones de formulas para los montos
    public function obtenerAreasConfiguradasEntidadFormulas($identidad, $idpagoporresultado)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "select DISTINCT(na.idarea)
               from mod_nomina.nom_areas na
               inner join mod_nomina.nom_areascargos nac on (nac.idarea = na.idarea)
               inner join mod_nomina.conf_cargospagoporresultado ccpr on (ccpr.idcargo = nac.idcargo)
               left join mod_nomina.conf_formulasareasmontos cfam on (cfam.idarea = na.idarea)
               inner join mod_nomina.conf_agrupadorareas caa on (caa.idagrupador = cfam.idagrupadorarea)
               where na.idestructura = ? and ccpr.idpagoporresultado = ? and (caa.idpagoporresultado = ? and cfam.idformulaareamonto is not null);";
        return $conn->fetchAll($sql, array($identidad, $idpagoporresultado, $idpagoporresultado));

    }

    //Areas de la entidad configuradas para un pago por resultados con configuraciones de formulas para los montos
    public function obtenerAreasNoConfiguradasEntidadFormulas($identidad,$idpagoresultado, $arrayareas)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sql = "select DISTINCT(na.idarea), na.denominacion
               from mod_nomina.nom_areas na
               inner join mod_nomina.nom_areascargos nac on (nac.idarea = na.idarea)
               inner join mod_nomina.conf_cargospagoporresultado ccpr on (ccpr.idcargo = nac.idcargo)
               where na.idestructura = ? and ccpr.idpagoporresultado = ? and na.idarea not in(" . implode(',', $arrayareas) . ");";
        return $conn->fetchAll($sql, array($identidad, $idpagoresultado));

    }

}
