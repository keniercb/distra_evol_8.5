<?php

class DatReportesCertificaciones extends BaseDatReportesCertificaciones {
    public function setUp(){
        parent::setUp();
        $this->hasMany('ConfReportesCertificaciones', array(
             'local' => 'idconfreportescertificaciones',
             'foreign' => 'idconfreportescertificaciones',
             'refClass' => 'DatReportesCertificaciones'
        ));

        $this->hasMany('DatElementosReportesCertificaciones', array(
            'local' => 'idreportescertificaciones',
            'foreign' => 'idreportescertificaciones'
        ));
        
       
    }
    
	 public static function obtenerObjReporteDadoId($idreportescertificaciones) {
        return Doctrine::getTable('DatReportesCertificaciones')->find($idreportescertificaciones);
    }
	
    // public static function obtenerListadoReportesCertificacionesActual($idconfreportescertificaciones, $identidad, $inicio, $limite) {
    //     $query = new Doctrine_Query ();
    //     $result = (($inicio != null) and ($limite != null))?
    //     $query->from('DatReportesCertificaciones')
    //             ->where('idconfreportescertificaciones = ? and identidad = ? and idconfreportescertificaciones = ? and identidad = ?', array($idconfreportescertificaciones, $identidad, $idconfreportescertificaciones, $identidad))
    //             ->limit($limite)
    //             ->offset($inicio)
    //             ->fetchArray():
    //             $query->from('DatReportesCertificaciones')
    //             ->where('idconfreportescertificaciones = ? and identidad = ? and idconfreportescertificaciones = ? and identidad = ?', array($idconfreportescertificaciones, $identidad, $idconfreportescertificaciones, $identidad))
    //             ->limit($limite)
    //             ->offset($inicio)
    //             ->fetchArray();
    //     return $result;
    // }
    public static function obtenerListadoReportesCertificacionesActual($idconfreportescertificaciones, $identidad, $inicio, $limite) {
        $sql = "SELECT * FROM mod_nomina.dat_reportescertificaciones 
                WHERE idconfreportescertificaciones = ? and identidad = ? order by idreportescertificaciones DESC;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idconfreportescertificaciones, $identidad));
        return $r;
    }

    public static function cantidadReportesCertificacionesActual($idconfreportescertificaciones, $identidad){
        return Doctrine_Query::create()
        ->select('COUNT(*) AS cantidad')
        ->from('DatReportesCertificaciones')
        ->where('idconfreportescertificaciones = ? and identidad = ? and idconfreportescertificaciones = ? and identidad = ?'
        ,array($idconfreportescertificaciones, $identidad, $idconfreportescertificaciones, $identidad))
        ->fetchArray();
    }

    public function crearReporteCertificacionActivo($identidad,$idusuario,$idconfreportescertificaciones, $finicio, $ffin) {
       $objDatRCertf=new DatReportesCertificaciones();
       $objDatRCertf->idconfreportescertificaciones=$idconfreportescertificaciones;
       $objDatRCertf->identidad=$identidad;
       $objDatRCertf->idusuario=$idusuario;
       $objDatRCertf->fechainicio=$finicio;
       $objDatRCertf->fechafin=$ffin;
       return $objDatRCertf;
    }

    public static function obtenerReportesCertificacionesActual($idconfreportescertificaciones, $identidad) {
        return Doctrine_Query::create()
            ->from('DatReportesCertificaciones')
            ->where('(idconfreportescertificaciones = ? and identidad = ?)', array($idconfreportescertificaciones, $identidad))
            ->orderBy('fechainicio DESC')
            ->fetchArray();
    }

    public static function obtenerReportesCertificaciones($idreportescertificaciones) {
        return Doctrine_Query::create()
            ->from('DatReportesCertificaciones')
            ->where('(idreportescertificaciones = ? )', array($idreportescertificaciones))
            ->fetchArray();
    }

    public static function obtenerCantidadReportesCertificacionesActual($idconfreportescertificaciones, $identidad) {
        return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
            ->from('DatReportesCertificaciones')
            ->where('(idconfreportescertificaciones = ? and identidad = ? and (fechafin is null or fechafin >= now())) or (estado = 1 and idconfreportescertificaciones = ? and identidad = ?)', array($idconfreportescertificaciones, $identidad, $idconfreportescertificaciones, $identidad))
            ->fetchOne()
            ->cantidad;
    }

    public static function obtenerListadoReportesCertificacionesHistorico($idconfreportescertificaciones, $identidad, $inicio = 0, $limite = 10) {
        return Doctrine_Query::create()
                ->from('DatReportesCertificaciones as cvrc')
                ->where('(idconfreportescertificaciones = ? and identidad = ? and (fechafin is not null and fechafin < now())) and estado <> 1', array($idconfreportescertificaciones, $identidad))
                ->orderBy('fechafin')
                ->limit($limite)
                ->offset($inicio)
                ->fetchArray();
    }

    public static function obtenerCantidadReportesCertificacionesHistorico($idconfreportescertificaciones, $identidad) {
        return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
                        ->from('DatReportesCertificaciones')
                        ->where('(idconfreportescertificaciones = ? and identidad = ? and (fechafin is not null and fechafin < now())) and estado <> 1', array($idconfreportescertificaciones, $identidad))
                        ->fetchOne()
                        ->cantidad;
    }

    public static function obtenerIdConfReportesxIdReportes($idreportescertificaciones) {
        return Doctrine_Query::create()->select('idconfreportescertificaciones')
            ->from('DatReportesCertificaciones')
            ->where('idreportescertificaciones = ?', array($idreportescertificaciones))
            ->fetchOne()
            ->idconfreportescertificaciones;
    }
    
    public static function obtenerDatosConfVariables($idconfreportescertificaciones, $soloID = 2, $idreportescertificaciones = null, $idpersona = null){
        $objConfVar = new ConfVariablesReportesCertificaciones();
        $objDatVar = new DatVariablesElementosReportesCertificaciones();
        $objNom = new NomNomencladorReferencia();
        $arrVariables = array();

        $arrVariables = $objConfVar->obtenerListadoVariablesReportesCertificaciones($idconfreportescertificaciones,0,10000);
        $r = array();
                
        foreach($arrVariables as $i => $v){
            $var = null;
            $var->idvariable = $v['idvariablesconfreportescertificaciones'];
            if($soloID == 2){
                $var->variable = $v['denominacion'];
                $var->tipovalor = $v['tipovalor'];
                $var->nivelaplicarvalor = $v['nivelaplicarvalor'];
                $var->nomenclador = $v['nomenclador'];
                $var->lugaresdecimales = $v['lugaresdecimales'];
                $var->tipovariable = $v['tipovariable'];
                $var->min = $v['min'];
                $var->max = $v['max'];
                $var->calculable = $v['calculable'];
                $var->idexpresionmatematica = $v['idexpresionmatematica'];
                $var->tiponomenclador = $v['tiponomenclador'];
                $var->descripcion = $v['descripcion'];
                if($v['tipovalor'] == 1 || $v['tipovalor'] == 5){
                    $var->datosnomenclador = $objNom->ObtenerDatosNomenclador($v['idnomencladorreferencia'], $v['tiponomenclador']);
                }else {
                    $var->datosnomenclador = null;
                }
            }
            $r[] = $var;
        }
        
        return $r;
    }
    
    public static function obtenerTodosReportesCertificaciones($identidad, $modomostrar, $limit = 15, $start = 0) {
				$w = '';
				if($modomostrar == 1){
					$w = "";
				}
					
                $sql = "select drc.*, crc.denominacion as confreportescertificaciones, crc.*
							from mod_nomina.dat_reportescertificaciones	drc
							inner join mod_nomina.conf_tiporeportescertificaciones crc on (crc.idconfreportescertificaciones = drc.idconfreportescertificaciones)
							where {$w} identidad = ? ORDER BY confreportescertificaciones limit ? offset ? ;";
							//where {$w} estado = 3 and identidad = ? ORDER BY confreportescertificaciones limit ? offset ? ;";
							
							//die($sql);
				$mg = Doctrine_Manager::getInstance();
				$conn = $mg->getCurrentConnection();
				$r = $conn->fetchAll($sql, array($identidad, $limit, $start));

               return $r;
    }
    
    public static function cantidadTodosReportesCertificaciones($identidad, $modomostrar) {
				$w = '';
				if($modomostrar == 1){
					$w = "";
				}
					
                $sql = "select count(*) as cantidad
							from mod_nomina.dat_reportescertificaciones	drc
							inner join mod_nomina.conf_tiporeportescertificaciones crc on (crc.idconfreportescertificaciones = drc.idconfreportescertificaciones)
							where {$w} identidad = ?;";
							//where {$w} estado = 3 and identidad = ?;";
				$mg = Doctrine_Manager::getInstance();
				$conn = $mg->getCurrentConnection();
				$r = $conn->fetchAll($sql, array($identidad));

               return $r[0]['cantidad'];
    }
    
    
    /*
     * Funcion para buscar el valor de una persona en reportes para generar la nomina
     * */
    public static function ValorReporteCertificacionesNomina($idconfreportescertificaciones, $idvariablesconfreportescertificaciones, $idelemento, $modopago, $fechainicioperiodo, $fechafinperiodo, $mesanyopago) {
                $objTipoReporte = Doctrine::getTable('ConfReportesCertificaciones')->find($idconfreportescertificaciones);
                $aplicaren = $objTipoReporte->aplicaren;
               //print_r($fechainicioperiodo.'-'.$fechafinperiodo.'-'.$mesanyopago);die;
                //Formateo las fecha a aaaa-mm-dd
                $ff = explode('/', $fechafinperiodo);
                $fechafinperiodo = $ff[2].'-'.$ff[1].'-'.$ff[0];
                $fi = explode('/', $fechainicioperiodo);
                $fechainicioperiodo = $fi[2].'-'.$fi[1].'-'.$fi[0];
                
                $w = "WHERE dr.idconfreportescertificaciones = ? and der.idelemento = ? and dver.idvariablesconfreportescertificaciones = ? ";
                $mesanyopago .= "-01"; //Completo la fecha del mes de pago
                
                //Periodo de pago y reporte se aplica en periodo de vigencia
                if($modopago ==  1 && $aplicaren == 1){
					$w .= "and (('{$fechainicioperiodo}'::date BETWEEN dr.fechainicio AND dr.fechafin) and ('{$fechafinperiodo}'::date BETWEEN dr.fechainicio AND dr.fechafin)) ";
				}
				//Periodo de pago y reporte se aplica en fecha de aplicacion
				else if($modopago ==  1 && $aplicaren == 2){
					$w .= "and ('{$fechainicioperiodo}'::date >= dr.fechainicio and '{$fechafinperiodo}'::date <= dr.fechafin) ";
				}
				//Mes de pago y reporte se aplica en periodo de vigencia
				else if($modopago ==  2 && $aplicaren == 1){
					$w .= "and ('{$mesanyopago}'::date BETWEEN dr.fechainicio AND dr.fechafin) ";
				}
				//Mes de pago y reporte se aplica en fecha de aplicacion
				else if($modopago ==  2 && $aplicaren == 2){
					$w .= "and ('{$mesanyopago}'::date >= dr.fechainicio) ";
				}
				
				$sql = "SELECT dr.idreportescertificaciones, der.idelemento, dver.valor, dver.idvariableselementosreportescertificaciones
							FROM mod_nomina.dat_reportescertificaciones dr
							INNER JOIN mod_nomina.dat_elementosreportescertificaciones der on (der.idreportescertificaciones = dr.idreportescertificaciones)
							INNER JOIN mod_nomina.dat_variableselementosreportescertificaciones dver on (dver.idelementosreportescertificaciones = der.idelementosreportescertificaciones)
							{$w}";
				$mg = Doctrine_Manager::getInstance();
				$conn = $mg->getCurrentConnection();
				return  $conn->fetchAll($sql, array($idconfreportescertificaciones, $idelemento, $idvariablesconfreportescertificaciones));

    }
    
}
