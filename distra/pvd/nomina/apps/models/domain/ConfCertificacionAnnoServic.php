<?php

class ConfCertificacionAnnoServic extends BaseConfCertificacionAnnoServic
{

    public function setUp()
    {
        parent:: setUp();
    }


    public function getByid($idcertificacionannoservc)
    {
        return Doctrine::getTable('ConfCertificacionAnnoServic')->find($idcertificacionannoservc);
    }

    public static function getPersonaentidad($identidad, $texto, $limite = 15, $inicio = 0)
    {
//doc.entidad

        $sql = "select distinct(dp.idpersona), dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.sexo,dco.fecharegistro as fdesde, dco.identidad, pln.orden, nfe.nivel,
                (CASE WHEN dco.idcargo is not null THEN nc.denominacion ELSE 'Sin cargo ocupado' END) as cargo, dco.idcargo,dco.fechavencimiento as fhasta,
                (pln.orden ||'-'|| (CASE WHEN dco.idplantillanominal is not null THEN (select cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN pln.denominacion <> '' THEN pln.denominacion ELSE 'Sin plantilla nominal' END)) as nombreplantilla,
                cer.antuguedad as antiguedad,
                (CASE WHEN cer.faltaentidad is not null THEN cer.faltaentidad  ELSE dco.fecharegistro END) as fechacert,
                cer.reporteantiguedad
                from mod_persona.dat_persona dp
                       INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = $identidad)
                        LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dco.idcargo)
                        INNER JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo)
                        LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
                        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
                        LEFT JOIN mod_nomina.conf_plantillanominalcargo plnc on(plnc.idcargo = dco.idcargo)
                        LEFT JOIN mod_nomina.conf_plantillanominal pln on(pln.idplantillanominal = plnc.idplantillanominal)
                        LEFT JOIN mod_nomina.conf_certificacionannoservc cer on(cer.idpersona = dp.idpersona and cer.identidad = $identidad)
                        WHERE ((dp.feliminado) >= now() or dp.feliminado is null)
                        and (dco.fechavencimiento >= now() or dco.fechavencimiento is null) order by (pln.orden) ASC,(nfe.nivel) ASC limit {$limite} offset {$inicio}
                        ";


        $sqltexto = " select distinct(dp.idpersona), dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.sexo,dco.fecharegistro as fdesde, dco.identidad,pln.orden,nfe.nivel,
                (CASE WHEN dco.idcargo is not null THEN nc.denominacion ELSE 'Sin cargo ocupado' END) as cargo, dco.idcargo,dco.fechavencimiento as fhasta,
                (CASE WHEN pln.idplantillanominal is not null THEN pln.denominacion ELSE 'Sin plantilla nominal' END) as nombreplantilla,cer.antuguedad as antiguedad,
                (CASE WHEN cer.faltaentidad is not null THEN cer.faltaentidad  ELSE dco.fecharegistro END) as fechacert
                from mod_persona.dat_persona dp
                       INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona and dco.identidad = $identidad)
                        LEFT JOIN mod_estructuracomp.dat_cargo dc ON (dc.idcargo = dco.idcargo)
                         INNER JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo)
                        LEFT JOIN mod_estructuracomp.nom_cargo nc ON (nc.idnomcargo = dc.idnomcargo)
                        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
                        LEFT JOIN mod_nomina.conf_plantillanominalcargo plnc on(plnc.idcargo = dco.idcargo)
                        LEFT JOIN mod_nomina.conf_plantillanominal pln on(pln.idplantillanominal = plnc.idplantillanominal)
                        LEFT JOIN mod_nomina.conf_certificacionannoservc cer on(cer.idpersona = dp.idpersona and cer.identidad = $identidad)
                        WHERE ((dp.feliminado) >= now() or dp.feliminado is null)
                        and (dco.fechavencimiento >= now() or dco.fechavencimiento is null)
                        and dp.nombre ilike '%$texto%' or dp.snombre ilike '%$texto%' or dp.papel ilike '%$texto%' or dp.sapel ilike '%$texto%'
                        order by (cer.antuguedad) ASC";


        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if (!empty($texto)) {
            return $conn->fetchAll($sqltexto);
        } else {

            return $conn->fetchAll($sql);
        }

    }

    public static function obtenerAnnoservcdadoidpersona($idpersona, $identidad)
    {

        //Devolviendo el listado de tipos de pago en forma de arreglo.
        return Doctrine_Query::create()
            ->from('ConfCertificacionAnnoServic cfa')
            ->where('cfa.idpersona =? and cfa.identidad = ?', array($idpersona, $identidad))
            ->fetchArray();
    }

    public static function obtenerAnnoservcyFechadadoidpersona($idpersona, $identidad)
    {

        //Devolviendo el listado de tipos de pago en forma de arreglo.
        return Doctrine_Query::create()
            ->from('ConfCertificacionAnnoServic cfa')
            ->where('cfa.idpersona =? and cfa.identidad = ?',array($idpersona,$identidad) )
            ->fetchArray();
    }

    public static function obtenerPersonasCertificadas($identidad)
    {

        $sql = "select distinct(dp.idpersona),pln.idplantillanominal, cont.cdgocontable as codigo,dpdi.numero as ci, dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.sexo, pln.denominacion as nombreplantilla,
			    dco.identidad, dco.idcargo, dco.idcargo, cer.faltaentidad as fechacertif, cer.annosservc as annosserv,cer.mesesservicio as mesesserv,cer.annosserventidad as serventidad, cer.antuguedad as antiguedad 
			from mod_persona.dat_persona dp 
			INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona ) 
			LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona AND dpdi.principal = 1) 
			LEFT JOIN mod_nomina.conf_plantillanominalcargo plnc on(plnc.idcargo = dco.idcargo) 
			LEFT JOIN mod_nomina.conf_plantillanominal pln on(pln.idplantillanominal = plnc.idplantillanominal) 
			INNER JOIN mod_nomina.conf_certificacionannoservc cer on(cer.idpersona =dp.idpersona) 
			LEFT JOIN mod_nomina.conf_personacdgocontable cont on(cont.idpersona=cer.idpersona) 
			WHERE dco.identidad = $identidad order by (pln.idplantillanominal) ASC";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }

    public static function obtenerPersonasCambioCategoria($identidad)
    {

        $sql = "select distinct(dp.idpersona),pln.idplantillanominal, cont.cdgocontable as codigo,dpdi.numero as ci,
 dp.nombre, dp.snombre, dp.papel, dp.sapel, dp.sexo,
 doc.fdesde,pln.denominacion as nombreplantilla,doc.identidad,
 dco.idcargo,
 cer.faltaentidad as fechacertif, cer.annosservc as annosserv,cer.mesesservicio as mesesserv,cer.annosserventidad as serventidad, cer.antuguedad as antiguedad
                from mod_persona.dat_persona dp
                        INNER JOIN mod_persona.dat_personaentidad doc ON (doc.idpersona = dp.idpersona )
                        LEFT JOIN mod_persona.dat_situacionlaboral dps ON (dps.idpersonaentidad = doc.idpersonaentidad)
                        INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idpersona = dp.idpersona )
                        LEFT JOIN mod_persona.dat_docidentidad dpdi ON (dpdi.idpersona = dp.idpersona  AND dpdi.principal = 1)
                        LEFT JOIN mod_nomina.conf_plantillanominalcargo plnc on(plnc.idcargo = dco.idcargo and plnc.idcargo = dps.idcargo)
                        LEFT JOIN mod_nomina.conf_plantillanominal pln on(pln.idplantillanominal = plnc.idplantillanominal)
                        INNER JOIN mod_nomina.conf_certificacionannoservc cer on(cer.idpersona =dp.idpersona)
                        LEFT JOIN mod_nomina.conf_personacdgocontable cont on(cont.idpersona=cer.idpersona)
                        WHERE ((dps.fhasta is null) or (doc.fhasta is null)) and (dps.idcargo is not null)
                        and cer.antuguedad = '5,1'
                        or cer.antuguedad = '10,1'
                        or cer.antuguedad = '15,1'
                        or cer.antuguedad = '25,1'
                        or cer.antuguedad = '30,1'
                        and doc.identidad = $identidad order by (pln.idplantillanominal) ASC  ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r;
    }
}

