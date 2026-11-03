<?php

class ConfPersonasCertificacionIncremento extends BasePersonasCertificacionIncremento {


    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idpersonacertificacionincremento)
    {
        return Doctrine::getTable('ConfPersonasCertificacionIncremento')->find($idpersonacertificacionincremento);
    }

    public function existePersona($idpersona,$idestructura)
    {
        $sql = "select count(idpersona) from mod_nomina.conf_personacertificacionincremento where idpersona = $idpersona and idestructura=$idestructura  ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public function getPersonasxEntidad($idestructura)
    {
        $sql = "select cpi.*,(CASE WHEN pn.denominacion is not null THEN pn.denominacion ELSE 'Sin plantilla nominal' END) as nombreplantilla, pn.idplantillanominal
             from mod_nomina.conf_personacertificacionincremento cpi
             left join  mod_nomina.dat_cargosocupados co on(co.idpersona = cpi.idpersona )
             left join  mod_nomina.conf_plantillanominalcargo pnc on (pnc.idcargo = co.idcargo )
             left join mod_nomina.conf_plantillanominal pn on(pnc.idplantillanominal = pn.idplantillanominal)
                where cpi.idestructura = ? ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idestructura));
        return $r;
    }

    public function getPersonaIncCero($idestructura)
    {
        $sql = "SELECT * FROM mod_nomina.conf_personacertificacionincremento where idestructura = ? and (incremento = 0.0 or incremento = 0);
 ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idestructura));
        return $r;
    }

    public function getAntigEntidadxPersona($idestructura,$idpersona)
    {
        $sql = "select cer.annosserventidadincremental as annos,cer.mesesserventidadincremental as meses
                from mod_nomina.conf_certificacionannoservc cer
                where cer.identidad = ?
                AND cer.idpersona = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idestructura,$idpersona));
        return $r;
    }

    public function getPersonaInc($idestructura,$idpersona)
    {
        $sql = "select pcer.idpersonacertificacionincremento as idtabla,pcer.incremento
                from mod_nomina.conf_personacertificacionincremento pcer
                where pcer.idestructura = ?
                AND pcer.idpersona = ? ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idestructura,$idpersona));
        return $r;
    }

    public function getAntiguedadxId($idtabla)
    {
        $sql = "select pci.idpersonacertificacionincremento as idtabla, cer.idcertificacionannoservc as idtablacert,pci.annosserventidadincremental as annos,pci.mesesserventidadincremental as meses,
cer.annosservc,cer.mesesservicio
                from mod_nomina.conf_personacertificacionincremento pci
                inner join mod_nomina.conf_certificacionannoservc cer
                ON(pci.idpersona = cer.idpersona)
                where pci.idpersonacertificacionincremento = ?
                ";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idtabla));
        return $r;

    }

}
