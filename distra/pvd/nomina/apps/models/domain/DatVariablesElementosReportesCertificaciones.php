<?php

class DatVariablesElementosReportesCertificaciones extends BaseDatVariablesElementosReportesCertificaciones
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatReportesCertificaciones', array(
            'local' => 'idelementosreportescertificaciones',
            'foreign' => 'idelementosreportescertificaciones',
            'refClass' => 'DatVariablesElementosReportesCertificaciones'
        ));
    }

    public static function getByid($idvariableselementosreportescertificaciones)
    {
        return Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($idvariableselementosreportescertificaciones);
    }

    public static function obtenerVariablesElementosReportesCertificaciones($arrIdsElementos)
    {
       $sql = "SELECT dverc.idvariableselementosreportescertificaciones, dverc.idelementosreportescertificaciones, dverc.idvariablesconfreportescertificaciones, dverc.valor,
                cvtrc.min,cvtrc.max, cvtrc.calculable,cvtrc.idexpresionmatematica
                FROM mod_nomina.dat_variableselementosreportescertificaciones dverc
                inner join mod_nomina.conf_variablestiporeportescertificaciones cvtrc on (cvtrc.idvariablesconfreportescertificaciones = dverc.idvariablesconfreportescertificaciones)
                WHERE idelementosreportescertificaciones IN (" . implode(',', $arrIdsElementos) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public static function obtenerValorVariableXIdElementoArrayReportes($idElemento, $arrIdsReportes, $idvariablesconfreportescertificacionesreportesanteriores)
    {
        $sql = "SELECT dverc.valor
                FROM mod_nomina.dat_variableselementosreportescertificaciones dverc
                inner join mod_nomina.dat_elementosreportescertificaciones der on (der.idelementosreportescertificaciones = dverc.idelementosreportescertificaciones and der.idelemento = {$idElemento})
                inner join mod_nomina.dat_reportescertificaciones dr on (dr.idreportescertificaciones = der.idreportescertificaciones and dr.idreportescertificaciones IN (" . implode(',', $arrIdsReportes) . "))
                inner join mod_nomina.conf_tiporeportescertificaciones ctr on (ctr.idconfreportescertificaciones = dr.idconfreportescertificaciones)
                inner join mod_nomina.conf_variablestiporeportescertificaciones cvtrc on (cvtrc.idconfreportescertificaciones = ctr.idconfreportescertificaciones and cvtrc.idvariablesconfreportescertificaciones = {$idvariablesconfreportescertificacionesreportesanteriores})
                WHERE dverc.idvariablesconfreportescertificaciones = {$idvariablesconfreportescertificacionesreportesanteriores};";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public static function obtenerValorVariablexIdConfVariableFeschasReporte($idvariablesconfreportescertificaciones, $idpersona, $identidad, $fechainicio, $fechafin)
    {
        $valorpersreporte = 0;
		$sql = "SELECT dvar.valor
              FROM mod_nomina.dat_variableselementosreportescertificaciones dvar
              INNER JOIN mod_nomina.dat_elementosreportescertificaciones de on (dvar.idelementosreportescertificaciones = de.idelementosreportescertificaciones)
              INNER JOIN mod_nomina.dat_reportescertificaciones drc on (drc.idreportescertificaciones = de.idreportescertificaciones)
              INNER JOIN mod_nomina.conf_tiporeportescertificaciones ctr on (ctr.idconfreportescertificaciones = drc.idconfreportescertificaciones)
              INNER JOIN mod_nomina.conf_variablestiporeportescertificaciones cvr on (cvr.idconfreportescertificaciones = drc.idconfreportescertificaciones and cvr.idvariablesconfreportescertificaciones = ?)
              WHERE drc.identidad = ? and dvar.idvariablesconfreportescertificaciones = ? and de.idelemento = ? and ((drc.fechainicio >= '{$fechainicio}'::date) and (drc.fechafin <= '{$fechafin}'::date));";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $valores =  $conn->fetchAll($sql, array($idvariablesconfreportescertificaciones,$identidad, $idvariablesconfreportescertificaciones, $idpersona));
		foreach($valores as $rv){
		  $valorpersreporte = number_format($valorpersreporte + $rv['valor'], 2, '.', '');
		}
		return $valorpersreporte;
    }

    public static function obtenerValorVariableAntiguedad($idreportescertificaciones, $idelemento)
    {

        $sql = "SELECT dvar.*, cvr.denominacion
              FROM mod_nomina.dat_variableselementosreportescertificaciones dvar
              INNER JOIN mod_nomina.dat_elementosreportescertificaciones de on (de.idelementosreportescertificaciones = dvar.idelementosreportescertificaciones)
              INNER JOIN mod_nomina.dat_reportescertificaciones drc on (drc.idreportescertificaciones = de.idreportescertificaciones)
              INNER JOIN mod_nomina.conf_tiporeportescertificaciones ctr on (ctr.idconfreportescertificaciones = drc.idconfreportescertificaciones)
              INNER JOIN mod_nomina.conf_variablestiporeportescertificaciones cvr on (cvr.idconfreportescertificaciones = drc.idconfreportescertificaciones)
              WHERE cvr.tipovariable = 30 and drc.idreportescertificaciones = ? and de.idelementosreportescertificaciones = ? and cvr.idvariablesconfreportescertificaciones = dvar.idvariablesconfreportescertificaciones;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idreportescertificaciones, $idelemento));
    }

    public static function obtenerValorVariableAntiguedadEntidad($idreportescertificaciones, $idelemento)
    {

        $sql = "SELECT dvar.*, cvr.denominacion
              FROM mod_nomina.dat_variableselementosreportescertificaciones dvar
              INNER JOIN mod_nomina.dat_elementosreportescertificaciones de on (dvar.idelementosreportescertificaciones = de.idelementosreportescertificaciones)
              INNER JOIN mod_nomina.dat_reportescertificaciones drc on (drc.idreportescertificaciones = de.idreportescertificaciones)
              INNER JOIN mod_nomina.conf_tiporeportescertificaciones ctr on (ctr.idconfreportescertificaciones = drc.idconfreportescertificaciones)
              INNER JOIN mod_nomina.conf_variablestiporeportescertificaciones cvr on (cvr.idconfreportescertificaciones = drc.idconfreportescertificaciones)
              WHERE cvr.tipovariable = 31 and drc.idreportescertificaciones = ? and de.idelementosreportescertificaciones = ? and cvr.idvariablesconfreportescertificaciones = dvar.idvariablesconfreportescertificaciones;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idreportescertificaciones, $idelemento));
    }

    public static function obtenerIdVariablesElementosReportesCertificaciones($idelemento)
    {
        return Doctrine_Query::create()
            ->select('idvariableselementosreportescertificaciones')
            ->from('DatVariablesElementosReportesCertificaciones')
            ->whereIn('idelementosreportescertificaciones', $idelemento)
            ->fetchArray();
    }

    public static function obtenerDatVariablesElementosReportesCertificacionesXConf($idelemento, $idconfvariable)
    {
        return Doctrine_Query::create()
            ->select('idvariableselementosreportescertificaciones')
            ->from('DatVariablesElementosReportesCertificaciones')
            ->where('idelementosreportescertificaciones = ? and idvariablesconfreportescertificaciones = ?', array($idelemento, $idconfvariable))
            ->fetchArray();
    }

    public function obtenerValorVariablesElementoDadoIdVariable($idvariableConfTReporte, $identidad, $fechainicio = null, $fechafin = null, $idconfreportescertificaciones)
    {
        $sql = "SELECT
                  del.idelemento,
                  dv.valor
                FROM
                  mod_nomina.dat_variableselementosreportescertificaciones dv
                inner join mod_nomina.dat_elementosreportescertificaciones del on (del.idelementosreportescertificaciones = dv.idelementosreportescertificaciones)
                inner join mod_nomina.dat_reportescertificaciones dr on (dr.idreportescertificaciones = del.idreportescertificaciones)
                inner join mod_nomina.conf_tiporeportescertificaciones ctr on (ctr.idconfreportescertificaciones = dr.idconfreportescertificaciones and ctr.idconfreportescertificaciones = ?)
                inner join mod_nomina.conf_variablestiporeportescertificaciones confvar on (confvar.idconfreportescertificaciones = ctr.idconfreportescertificaciones and confvar.idvariablesconfreportescertificaciones = '{$idvariableConfTReporte}')
                where  dr.identidad in (".$identidad.")
                  and (('{$fechainicio}'::date BETWEEN dr.fechainicio AND dr.fechafin) and ('{$fechafin}'::date BETWEEN dr.fechainicio AND dr.fechafin)) and dv.idvariablesconfreportescertificaciones = '{$idvariableConfTReporte}'";

        $mg = Doctrine_Manager::getInstance();//print_r($sql);die;
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idconfreportescertificaciones));
    }

    public static function obtenerValorVariablesElementoDadoIdReporteIdPersona($idreporte, $idpersona, $idconfvariable)
    {
        $sql = "SELECT
                  dv.valor
                FROM
                  mod_nomina.dat_variableselementosreportescertificaciones dv
                inner join mod_nomina.dat_elementosreportescertificaciones del on (del.idelementosreportescertificaciones = dv.idelementosreportescertificaciones)
                inner join mod_nomina.dat_reportescertificaciones dr on (dr.idreportescertificaciones = del.idreportescertificaciones)
                where dr.idreportescertificaciones = ? and del.idelemento = ? and dv.idvariablesconfreportescertificaciones = ?
                ";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idreporte, $idpersona, $idconfvariable));
    }

    public static function obtenerVariablesXElementosReportesCertificaciones($idelemento)
    {
        return Doctrine_Query::create()
            ->from('DatVariablesElementosReportesCertificaciones')
            ->whereIn('idelementosreportescertificaciones', $idelemento)
            ->fetchArray();
    }

    public static function obtenerValorDatVariablesElementosReportesCertificacionesXConf($idelemento, $idconfvariable)
    {
        $valor = Doctrine_Query::create()
            ->select('valor')
            ->from('DatVariablesElementosReportesCertificaciones')
            ->where('idelementosreportescertificaciones = ? and idvariablesconfreportescertificaciones = ?', array($idelemento, $idconfvariable))
            ->fetchArray();
        return $valor[0]['valor'];
    }

    public function cargarValorPersonasReportes($idestructura, $fechainicio, $fechafin)
    {
        $sql = "SELECT dr.idconfreportescertificaciones, ctr.denominacion as tiporeporte, der.idelemento, 
                dver.idvariablesconfreportescertificaciones, dver.valor,
                dver.idvariableselementosreportescertificaciones
                FROM mod_nomina.dat_reportescertificaciones dr
                LEFT JOIN mod_nomina.dat_elementosreportescertificaciones der
                    on (der.idreportescertificaciones = dr.idreportescertificaciones)
                LEFT JOIN mod_nomina.conf_tiporeportescertificaciones ctr
                    on (ctr.idconfreportescertificaciones = dr.idconfreportescertificaciones)
                LEFT JOIN mod_nomina.dat_variableselementosreportescertificaciones dver
                    on (dver.idelementosreportescertificaciones = der.idelementosreportescertificaciones)
                WHERE dr.identidad = ? AND dr.fechainicio <= '{$fechainicio}'::date AND
                    (dr.fechafin >= '{$fechafin}'::date OR dr.fechafin IS NULL)";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrR = $conn->fetchAll($sql, array($idestructura));

        $arrReportes = array();

        foreach ($arrR as $v) {
            $arrReportes[$v['idelemento']]->reporte[$v['idconfreportescertificaciones']]->tiporeporte = $v['tiporeporte'];
            $arrReportes[$v['idelemento']]->reporte[$v['idconfreportescertificaciones']]
                ->variable[$v['idvariablesconfreportescertificaciones']] = ($v['valor'] == null || $v['valor'] == '') ? 0.00 : $v['valor'];
        }

        return $arrReportes;
    }

    public static function obtenerValorVariableXIdElementoReporte($idElemento, $idreportescertificaciones, $idvariablesconfreportescertificaciones)
    {
        $sql = "SELECT dverc.valor
                FROM mod_nomina.dat_variableselementosreportescertificaciones dverc
                inner join mod_nomina.dat_elementosreportescertificaciones der on (der.idelementosreportescertificaciones = dverc.idelementosreportescertificaciones and der.idelemento = {$idElemento})
                inner join mod_nomina.dat_reportescertificaciones dr on (dr.idreportescertificaciones = der.idreportescertificaciones and dr.idreportescertificaciones = {$idreportescertificaciones})
                inner join mod_nomina.conf_tiporeportescertificaciones ctr on (ctr.idconfreportescertificaciones = dr.idconfreportescertificaciones)
                inner join mod_nomina.conf_variablestiporeportescertificaciones cvtrc on (cvtrc.idconfreportescertificaciones = ctr.idconfreportescertificaciones and cvtrc.idvariablesconfreportescertificaciones = {$idvariablesconfreportescertificaciones})
                WHERE dverc.idvariablesconfreportescertificaciones = {$idvariablesconfreportescertificaciones};";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchOne($sql);
    }

    public static function existeDatVariablesElementosReportesCertificaciones($idelemento, $idconfvariable)
    {
        return Doctrine_Query::create()
            ->select('count(idvariableselementosreportescertificaciones) as cantidad')
            ->from('DatVariablesElementosReportesCertificaciones')
            ->where('idelementosreportescertificaciones = ? and idvariablesconfreportescertificaciones = ?', array($idelemento, $idconfvariable))
            ->fetchOne()
            ->cantidad;
    }

    public static function obtenerIdDatVariablesElementosReportesCertificaciones($idelemento, $idconfvariable)
    {
        $valor = Doctrine_Query::create()
            ->select('idvariableselementosreportescertificaciones')
            ->from('DatVariablesElementosReportesCertificaciones')
            ->where('idelementosreportescertificaciones = ? and idvariablesconfreportescertificaciones = ?', array($idelemento, $idconfvariable))
            ->fetchArray();
        return $valor[0]['idvariableselementosreportescertificaciones'];
    }

}
