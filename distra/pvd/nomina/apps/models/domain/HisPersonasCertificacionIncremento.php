<?php

class HisPersonasCertificacionIncremento extends BaseHisPersonasCertificacionIncremento {


    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idhispersonacertificacionincremento)
    {
        return Doctrine::getTable('HisPersonasCertificacionIncremento')->find($idhispersonacertificacionincremento);
    }

    public function getHisPersonasxEntidad($idestructura,$fecha)
    {
        $sql = "select his.*,pn.denominacion as nombreplantilla, pn.idplantillanominal
             from mod_nomina.his_personacertificacionincremento his
             left join  mod_nomina.dat_cargosocupados co on(co.idpersona = his.idpersona )
             left join  mod_nomina.conf_plantillanominalcargo pnc on (pnc.idcargo = co.idcargo )
             left join mod_nomina.conf_plantillanominal pn on(pnc.idplantillanominal = pn.idplantillanominal)
              where his.idestructura = ?  AND his.fdesde =  ''' $fecha''' ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idestructura));
        return $r;
    }
}
