<?php

class HisRetencionesPersona extends BaseHisRetencionesPersona
{

    public static function obtenerHisRetencionesPersona($idretencionpersona)
    {

        //Devolviendo los datos de las vacaciones de una persona en forma de arreglo.
        return Doctrine_Query::create()
            ->from('HisRetencionesPersona vac')
            ->where('vac.idretencionpersona = ?', array($idretencionpersona))
            ->fetchArray();
    }

    public static function obtenerSaldoRestanteRetencionesPersona($idretencionpersona){
        $sql = "SELECT max(saldodeladeudo) as saldorestante
            FROM mod_nomina.his_retencionpersona
            WHERE idretencionpersona = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $result = $conn->fetchOne($sql, array($idretencionpersona));
        return $result;
    }

    public static function obtenerDatosEntidadDadoId($identidad)
    {

        $sql = "select 
	    (CASE WHEN nfe.idconcepto = 3 THEN e.denominacion WHEN nfe.idconcepto = 5 THEN eop.denominacion ELSE '' END) as denominacion,
	    (CASE WHEN nfe.idconcepto = 3 THEN e.abreviatura WHEN nfe.idconcepto = 5 THEN eop.abreviatura ELSE '' END) as abreviatura,
		(CASE WHEN nfe.idconcepto = 3 THEN e.codigo WHEN nfe.idconcepto = 5 THEN eop.codigo ELSE '' END) as codigo,
		(CASE WHEN nfe.idconcepto = 3 THEN e.direccion WHEN nfe.idconcepto = 5 THEN eop.direccion ELSE '' END) as direccion, 
		 ns.abreviatura as sector, nfe.idconcepto
		FROM mod_estructuracomp.nom_filaestruc nfe
		LEFT join mod_estructuracomp.dat_estructura e on(e.idestructura = nfe.idfila AND e.idproyecto = 0)
		LEFT join mod_estructuracomp.nom_sector ns on(ns.idsector = e.idsector AND e.idproyecto = 0)
        LEFT join mod_estructuracomp.dat_estructuraop eop on(eop.idestructuraop = nfe.idfila AND eop.idproyecto = 0)
		WHERE nfe.idfila = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad));
    }

    public static function obtenerHisRetencionesPersonaIdNomina($idnomina)
    {

        //Devolviendo los datos de las vacaciones de una persona en forma de arreglo.
        return Doctrine_Query::create()
            ->from('HisRetencionesPersona vac')
            ->where('vac.idnomina = ?', array($idnomina))
            ->fetchArray();
    }

    public function obtenerUltimaOperacionSubMayorRetenciones($identidad, $fechainicio, $fechafin, $tipoRetencion)
    {
        $rexplodefinicio = explode('/', $fechainicio);
        $fechainicio = $rexplodefinicio[2].'-'.$rexplodefinicio[1].'-'.$rexplodefinicio[0];
        $rexplodeffin = explode('/', $fechafin);
        $fechafin = $rexplodeffin[2].'-'.$rexplodeffin[1].'-'.$rexplodeffin[0];
        $where = "";
        $sql = "SELECT distinct(hr.idretencionpersona),hr.idnomina,
  pcc.cdgocontable,dp.idpersona,di.numero,dp.nombre,dp.snombre,dp.papel,dp.sapel,hr.retenido as cuota,dco.idcargo,tn.denominacion as nomina,
  ((CASE WHEN dco.idplantillanominal IS NOT NULL
  THEN (SELECT cpx.orden ||'-'|| cpx.denominacion FROM mod_nomina.conf_plantillanominal cpx WHERE cpx.idplantillanominal = dco.idplantillanominal)
  WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as area

  FROM mod_nomina.his_retencionpersona hr

  INNER JOIN mod_nomina.dat_retencionpersona dr on (dr.idretencionpersona = hr.idretencionpersona)
  INNER JOIN mod_persona.dat_persona dp on (dp.idpersona = dr.idpersona)
  LEFT JOIN mod_persona.dat_docidentidad di on (dp.idpersona = di.idpersona  and di.principal = 1)
  INNER JOIN mod_nomina.dat_cargosocupados dco on (dco.idpersona = dr.idpersona)
  LEFT JOIN mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
  LEFT JOIN mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = cpnc.idplantillanominal)
  LEFT JOIN mod_nomina.dat_nomina n on (hr.idnomina = n.idnomina)
  LEFT JOIN mod_nomina.dat_elaborarpagos ep on (n.idelaborarpago = ep.idelaborarpagos)
  LEFT JOIN mod_nomina.conf_modelonomina cmn on (ep.idtipopago = cmn.idtipopago)
  LEFT JOIN mod_nomina.nom_tiponomina tn on (cmn.idtiponomina = tn.idtiponomina)
  LEFT JOIN mod_nomina.conf_personacdgocontable pcc on (pcc.idpersona = dp.idpersona and pcc.idestructura = {$identidad})

  WHERE hr.fechaoperacion BETWEEN '{$fechainicio}'::date AND '{$fechafin}'::date AND
  dr.identidad = ? AND
  dr.idtiporetencion = ? AND
  dco.identidad = ?
  ORDER BY area";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        return $conn->fetchAll($sql, array($identidad, $tipoRetencion, $identidad));
    }

    public function obtenerRetencionesPorFechaYtipoRetencion($idretencionpersona)
    {
        $sql = "select h.*
		from mod_nomina.his_retencionpersona h
		where h.idretencionpersona = ? order by h.fechaoperacion, h.idhisretencionpersona DESC limit 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idretencionpersona));
    }

    public function obtenerTodosSubMayorRetenciones($idretencionpersona)
    {
        $sql = "select h.* 
		from mod_nomina.his_retencionpersona h
		where h.idretencionpersona = ? order by h.idnomina ASC";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idretencionpersona));
    }

    public function obtenerHistoricoSubMayorRetenciones($idretencionpersona, $limit, $start)
    {
        $sql = "select h.* , dn.numeronomina,dep.numerocomprobanteoperaciones 
		from mod_nomina.his_retencionpersona h
		left join mod_nomina.dat_nomina dn on (dn.idnomina = h.idnomina)
     left join mod_nomina.dat_elaborarpagos dep on (dep.idelaborarpagos = dn.idelaborarpago)
		where h.idretencionpersona = ? order by h.idnomina DESC limit {$limit} offset {$start}";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idretencionpersona));
    }

    public function obtenerHistoricoSubMayorRetencionesAexportar($idretencionpersona)
    {
        $sql = "select h.* , dn.numeronomina
		from mod_nomina.his_retencionpersona h
		left join mod_nomina.dat_nomina dn on (dn.idnomina = h.idnomina)
		where h.idretencionpersona = ? order by h.fechaoperacion, h.idhisretencionpersona DESC";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idretencionpersona));
    }

    public function obtenerCantidadHistoricoSubMayorRetenciones($idretencionpersona)
    {
        $sql = "select h.*
		from mod_nomina.his_retencionpersona h
		where h.idretencionpersona = ? order by h.fechaoperacion, h.idhisretencionpersona";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idretencionpersona));
    }

    public function obtenerHistoricoSubMayorRetencionesIdNomina($idnomina)
    {
        $sql = "select dr.*,ntr.*, h.*
		from mod_nomina.his_retencionpersona h
		inner join mod_nomina.dat_retencionpersona dr on (dr.idretencionpersona = h.idretencionpersona)
		inner join mod_nomina.nom_tiporetencion ntr on (ntr.idtiporetencion = dr.idtiporetencion)
		where h.idnomina = ?";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idnomina));
    }

    public function obtenerTodasRetencionesEntidad($identidad, $arrTipoRetenciones)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT DISTINCT (dp.idpersona),di.numero,dr.*,ntr.denominacion as denomretencion,
              concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel) as nombrecompleto, 
              ((CASE WHEN dco.idplantillanominal IS NOT NULL THEN (SELECT cpx.orden ||'-'|| cpx.denominacion 
              FROM mod_nomina.conf_plantillanominal cpx WHERE cpx.idplantillanominal = dco.idplantillanominal)
              WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as area
              FROM mod_nomina.dat_retencionpersona dr
              INNER JOIN mod_nomina.nom_tiporetencion ntr on (ntr.idtiporetencion = dr.idtiporetencion)
              INNER JOIN mod_persona.dat_persona dp on (dp.idpersona = dr.idpersona)
              INNER JOIN mod_persona.dat_docidentidad di on (dp.idpersona = di.idpersona and di.principal = 1)
              INNER JOIN mod_nomina.dat_cargosocupados dco on (dco.idpersona = dr.idpersona)
              INNER JOIN mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo)
              INNER JOIN mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = cpnc.idplantillanominal)
              WHERE dr.identidad = ? AND dr.idtiporetencion in ({$arrTipoRetenciones}) 
                and dco.identidad = {$identidad}
              ORDER BY area";
        $r = $conn->fetchAll($sql, array($identidad));
        return $r;
    }

    public function obtenerSaldoAdeudoUltimaOperacion($idretencion)
    {
        $sql = "select h.saldodeladeudo
		from mod_nomina.his_retencionpersona h
		inner join mod_nomina.dat_retencionpersona dr on (dr.idretencionpersona = h.idretencionpersona)
		inner join mod_nomina.nom_tiporetencion ntr on (ntr.idtiporetencion = dr.idtiporetencion)
		where h.idretencionpersona = ? order by idhisretencionpersona desc limit 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchOne($sql, array($idretencion));
    }

    public function obtenerIdDocObligacionUltimaOperacionRetencionCuentaCobrar($iddocumentoobligacion, $importe)
    {
        $sql = "select h.*
		from mod_nomina.his_retencionpersona h
		inner join mod_nomina.dat_retencionpersona dr on (dr.idretencionpersona = h.idretencionpersona)
		where dr.iddocumentoobligacion = ?  and h.retenido = ? order by idhisretencionpersona desc limit 1";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($iddocumentoobligacion, $importe));
    }


}
