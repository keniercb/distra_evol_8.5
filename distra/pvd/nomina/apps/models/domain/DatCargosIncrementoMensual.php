<?php

class DatCargosIncrementoMensual extends BaseDatCargosIncrementoMensual {


    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idcargoincrementomensual)
    {
        return Doctrine::getTable('DatCargosIncrementoMensual')->find($idcargoincrementomensual);
    }

    public function existeCargo($idcargo,$idestructura)
    {
        $sql = "select count(idcargo) from mod_nomina.dat_cargoincrementomensual where idcargo = $idcargo and idestructura=$idestructura  ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getCargoxEntidad($idestructura)
    {
        $sql = "select cim.*, (CASE WHEN pn.denominacion is not null THEN pn.denominacion ELSE 'Sin plantilla nominal' END) as nombreplantilla, pn.idplantillanominal
                from mod_nomina.dat_cargoincrementomensual cim
                left join mod_nomina.conf_plantillanominalcargo pnc on(cim.idcargo = pnc.idcargo)
                left join mod_nomina.conf_plantillanominal pn on(pnc.idplantillanominal = pn.idplantillanominal)
                where cim.idestructura = ? ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idestructura));
        return $r;
    }

    public function existeCargoAnual($idcargo,$idestructura)
    {
        $sql = "select count(cim.idcargoscertificacionincremento)
                from mod_nomina.conf_cargoscertificacionincremento cim
                left join mod_nomina.conf_plantillanominalcargo pnc on(cim.idcargo = pnc.idcargo)
                left join mod_nomina.conf_plantillanominal pn on(pnc.idplantillanominal = pn.idplantillanominal)
                where cim.idestructura = $idestructura and cim.idcargo = $idcargo ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

public function dameplantilla($idcargo,$idestructura)
{
    $sql = "select pn.denominacion as nombreplantilla
            from mod_nomina.conf_cargoscertificacionincremento cim
            left join mod_nomina.conf_plantillanominalcargo pnc on(cim.idcargo = pnc.idcargo)
            left join mod_nomina.conf_plantillanominal pn on(pnc.idplantillanominal = pn.idplantillanominal)
            where cim.idestructura = $idestructura and cim.idcargo = $idcargo ";
    $mg = Doctrine_Manager::getInstance();
    $conn = $mg->getCurrentConnection();
    $r = $conn->fetchAll($sql);
    return $r;
}


}
