<?php

class HisReportesCertificaciones extends BaseHisReportesCertificaciones {

    public function setUp(){
        parent::setUp();
        $this->hasMany('ConfReportesCertificaciones', array(
             'local' => 'idconfreportescertificaciones',
             'foreign' => 'idreportecertificacion',
             'refClass' => 'HisReportesCertificaciones'
        ));
        
       
    }
    
	 public static function obtenerObjReporteDadoId($idreportescertificaciones) {
        return Doctrine::getTable('HisReportesCertificaciones')->find($idreportescertificaciones);
    }
	
    public static function obtenerListadoReportesCertificacionesHis($idconfreportescertificaciones, $identidad, $inicio = 0, $limite = 10) {
        return Doctrine_Query::create()
                ->from('HisReportesCertificaciones')
                //->where('(idconfreportescertificaciones = ? and identidad = ? and (fechafin is null or fechafin >= now())) or (estado = 1 and idconfreportescertificaciones = ? and identidad = ?)', array($idconfreportescertificaciones, $identidad, $idconfreportescertificaciones, $identidad))
                ->where('idconfreportescertificaciones = ? and identidad = ?', array($idconfreportescertificaciones, $identidad))
                //->orderBy('fechafin')
                ->limit($limite)
                ->offset($inicio)
                ->fetchArray();
    }

    public static function obtenerCantidadReportesCertificacionesActual($idconfreportescertificaciones, $identidad) {
        return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
                        ->from('HisReportesCertificaciones')
                        ->where('(idconfreportescertificaciones = ? and identidad = ? and (fechafin is null or fechafin >= now())) or (estado = 1 and idconfreportescertificaciones = ? and identidad = ?)', array($idconfreportescertificaciones, $identidad, $idconfreportescertificaciones, $identidad))
                        ->fetchOne()
                        ->cantidad;
    }
    
    public static function obtenerCantidadReportesCertificacionesHistorico($idconfreportescertificaciones, $identidad) {
        return Doctrine_Query::create()->select('COUNT(*) AS cantidad')
                        ->from('HisReportesCertificaciones')
                        ->where('(idconfreportescertificaciones = ? and identidad = ? and (fechafin is not null and fechafin < now())) and estado <> 1', array($idconfreportescertificaciones, $identidad))
                        ->fetchOne()
                        ->cantidad;
    }
    
    public static function obtenerDatosConfVariables($idconfreportescertificaciones, $soloID = 2){
        $objConfVar = new ConfVariablesReportesCertificaciones();
        $objNom = new NomNomencladorReferencia();
        
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
							where {$w} estado = 3 and identidad = ? ORDER BY confreportescertificaciones limit ? offset ? ;";
							
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
							where {$w} estado = 3 and identidad = ?;";
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
                
                //Formateo las fecha a aaaa-mm-dd
                $ff = explode('/', $fechafinperiodo);
                $fechafinperiodo = $ff[2].'-'.$ff[1].'-'.$ff[0];
                $fi = explode('/', $fechainicioperiodo);
                $fechainicioperiodo = $fi[2].'-'.$fi[1].'-'.$fi[0];
                
                $w = "WHERE dr.estado = 3 and dr.idconfreportescertificaciones = ? and der.idelemento = ? and dver.idvariablesconfreportescertificaciones = ? ";
                $mesanyopago .= "-01"; //Completo la fecha del mes de pago
                
                //Periodo de pago y reporte se aplica en periodo de vigencia
                if($modopago ==  1 && $aplicaren == 1){
					$w .= "and (('{$fechainicioperiodo}'::date BETWEEN dr.fechainicio AND dr.fechafin) OR ('{$fechafinperiodo}'::date BETWEEN dr.fechainicio AND dr.fechafin)) ";
				}
				//Periodo de pago y reporte se aplica en fecha de aplicacion
				else if($modopago ==  1 && $aplicaren == 2){
					$w .= "and ('{$fechainicioperiodo}'::date >= dr.fechainicio or '{$fechafinperiodo}'::date >= dr.fechainicio) ";
				}
				//Mes de pago y reporte se aplica en periodo de vigencia
				else if($modopago ==  2 && $aplicaren == 1){
					$w .= "and ('{$mesanyopago}'::date BETWEEN dr.fechainicio AND dr.fechafin) ";
				}
				//Mes de pago y reporte se aplica en fecha de aplicacion
				else if($modopago ==  2 && $aplicaren == 2){
					$w .= "and ('{$mesanyopago}'::date >= dr.fechainicio) ";
				}
				
                $sql = "SELECT dr.idreportescertificaciones, der.idelemento, dver.valor 
							FROM mod_nomina.dat_reportescertificaciones dr
							INNER JOIN mod_nomina.dat_elementosreportescertificaciones der on (der.idreportescertificaciones = dr.idreportescertificaciones and der.aprobado = 1)
							INNER JOIN mod_nomina.dat_variableselementosreportescertificaciones dver on (dver.idelementosreportescertificaciones = der.idelementosreportescertificaciones)
							{$w}";
				$mg = Doctrine_Manager::getInstance();
				$conn = $mg->getCurrentConnection();
				return  $conn->fetchAll($sql, array($idconfreportescertificaciones, $idelemento, $idvariablesconfreportescertificaciones));

    }
    
}
