<?php

class HisCargosCertificacionIncremento extends BaseHisCargosCertificacionIncremento {


    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idcargoscertificacionincremento)
    {
        return Doctrine::getTable('ConfCargosCertificacionIncremento')->find($idcargoscertificacionincremento);
    }

    public function getCargoxEntidadHis($idestructura,$fecha)
    {
        $sql = "select his.*,pn.denominacion as nombreplantilla, pn.idplantillanominal
                from mod_nomina.his_cargoscertificacionincremento his
                left join mod_nomina.conf_plantillanominalcargo pnc on(his.idcargo = pnc.idcargo)
                left join mod_nomina.conf_plantillanominal pn on(pnc.idplantillanominal = pn.idplantillanominal)
                where his.idestructura = ?  AND his.fdesde =  ''' $fecha'''";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idestructura));
        return $r;
    }

}
