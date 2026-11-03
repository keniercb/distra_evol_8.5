<?php

class ConfCargosCertificacionIncremento extends BaseConfCargosCertificacionIncremento {


    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idcargoscertificacionincremento)
    {
        return Doctrine::getTable('ConfCargosCertificacionIncremento')->find($idcargoscertificacionincremento);
    }

    public function existeCargo($idcargo,$idestructura)
    {
        $sql = "select count(idcargo) from mod_nomina.conf_cargoscertificacionincremento where idcargo = $idcargo and idestructura=$idestructura  ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getCargoxEntidad($idestructura)
    {
        $sql = "select cci.*,  (CASE WHEN pn.denominacion is not null THEN pn.denominacion ELSE 'Sin plantilla nominal' END) as nombreplantilla,pn.idplantillanominal
                from mod_nomina.conf_cargoscertificacionincremento cci
                left join mod_nomina.conf_plantillanominalcargo pnc on(cci.idcargo = pnc.idcargo)
                left join mod_nomina.conf_plantillanominal pn on(pnc.idplantillanominal = pn.idplantillanominal)
                where cci.idestructura = ? ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idestructura));
        return $r;
    }

}
