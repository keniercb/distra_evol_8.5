<?php

class HisCargosOcupados extends BaseHisCargosOcupados {

    public function setUp() {
        parent::setUp();       
        $this->hasOne('NomSituacionLaboral', array('local' => 'idsituacionlaboral', 'foreign' => 'idsituacionlaboral'));
    }

    public function obtenerListadoCargosOcupadosActual($idpersona, $identidad, $inicio = 0, $limite = 15) {
        try {
            $query  = new Doctrine_Query();
            $result = $query->select('dco.idhiscargosocupados, dco.idpersona, dco.idcargo, dco.identidad, dco.fecharegistro, dco.fechaaplicacion,
                                    dco.fechavencimiento, dco.observaciones, dco.idsituacionlaboral, nsl.denominacion as denomsituacionlaboral, dco.idcajacajero, dco.idpersonacuentabancariamn')
                    ->from('HisCargosOcupados dco')
                    ->leftJoin('dco.NomSituacionLaboral nsl')
                    ->where('idpersona = ? and identidad = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($idpersona, $identidad))
                    ->limit($limite)
                    ->offset($inicio)
                    ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e){
            throw $e;
        }
    }
     
    public function obtenerListadoCargosOcupadosEntidad($identidad, $inicio = 0, $limite = 15) {
        try {
            $query  = new Doctrine_Query();
            $result = $query->select('dco.idhiscargosocupados, dco.idpersona, dco.idcargo, dco.identidad, dco.fecharegistro, dco.fechaaplicacion,
                                    dco.fechavencimiento, dco.observaciones, dco.idsituacionlaboral, nsl.denominacion as denomsituacionlaboral, dco.idcajacajero, dco.idpersonacuentabancariamn')
                    ->from('HisCargosOcupados dco')
                    ->leftJoin('dco.NomSituacionLaboral nsl')
                    ->where('identidad = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($identidad))
                    ->limit($limite)
                    ->offset($inicio)
                    ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e){
            throw $e;
        }
    }
    
     public static function obteneridhiscargosocupadosPersona($idpersona, $identidad, $inicio = 0, $limite = 10) {
	
        return Doctrine_Query::create()->select('idcargo as idcargo')
                ->from('HisCargosOcupados as dco')
                ->where('idpersona = ? and identidad = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($idpersona, $identidad))
                ->limit($limite)
                ->offset($inicio)
                ->fetchArray();
   }
   
    public static function obteneridhiscargosocupadosPersonaEntidad($idpersona, $identidad, $idcargo) {
	     return Doctrine_Query::create()->select('idhiscargosocupados AS idhiscargosocupados')
                ->from('HisCargosOcupados')
                ->where('idpersona = ? and identidad = ? and idcargo = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($idpersona, $identidad, $idcargo))
                ->fetchOne()
                ->idhiscargosocupados;
   }
   
   public static function obtenerIdCargosXIdCargoOcupado($idhiscargosocupados) {
	     return Doctrine_Query::create()->select('idcargo AS idcargo')
                ->from('HisCargosOcupados')
                ->where('idhiscargosocupados = ? ', array($idhiscargosocupados))
                ->fetchOne()
                ->idcargo;
   }
   
   public function obtenerListadoCargosOcupadosHistorico($idpersona, $identidad, $inicio = 0, $limite = 15){
        try{
            $query  = new Doctrine_Query();
            $result = $query->select('dco.idhiscargosocupados, dco.idpersona, dco.idcargo, dco.identidad, dco.fecharegistro, dco.fechaaplicacion,
                                    dco.fechavencimiento, dco.observaciones, dco.idsituacionlaboral, nsl.denominacion as denomsituacionlaboral, dco.idcajacajero')
                    ->from('HisCargosOcupados dco')
                    ->leftJoin('dco.NomSituacionLaboral nsl')
                    ->where('idpersona = ? and identidad = ?', array($idpersona, $identidad))
                    ->limit($limite)
                    ->offset($inicio)
                    ->execute();
            return $result->toArray();
        }  catch (Doctrine_Exception $e){
            throw $e;
        }
    }
    
    public function cantdCargosOcupadosxPersona($idpersona, $identidad){
        try {
            $query  = new Doctrine_Query();
            $result = $query->select('dco.idhiscargosocupados, dco.idpersona, dco.idcargo, dco.identidad, dco.fecharegistro, dco.fechaaplicacion,
                                    dco.fechavencimiento, dco.observaciones, dco.idsituacionlaboral, nsl.denominacion as denomsituacionlaboral, dco.idcajacajero')
                    ->from('HisCargosOcupados dco')
                    ->leftJoin('dco.NomSituacionLaboral nsl')
                    ->where('idpersona = ? and identidad = ? and (fechavencimiento is null or fechavencimiento >= now()) and fechaaplicacion <= now() ', array($idpersona, $identidad))
                    ->count();
            return $result;
        } catch (Doctrine_Exception $e){
            throw $e;
        }
    }
    
    public function cantdCargosOcupadosHistoricoxPersona($idpersona, $identidad){
        try{
            $query  = new Doctrine_Query();
            $result = $query->select('dco.idhiscargosocupados, dco.idpersona, dco.idcargo, dco.identidad, dco.fecharegistro, dco.fechaaplicacion,
                                    dco.fechavencimiento, dco.observaciones, dco.idsituacionlaboral, nsl.denominacion as denomsituacionlaboral, dco.idcajacajero')
                    ->from('HisCargosOcupados dco')
                    ->leftJoin('dco.NomSituacionLaboral nsl')
                    ->where('idpersona = ? and identidad = ? and (fechavencimiento <= now())', array($idpersona, $identidad))
                    ->count();
            return $result;
        }  catch (Doctrine_Exception $e){
            throw $e;
        }
    }
    
    public function verficarExistenciadelCargo($idpersona, $identidad, $idcargo, $idplantillanominal){
        try {
            $query  = new Doctrine_Query();
            if($idcargo != null){
                $result = $query//->select('idpersona')
                        ->from('HisCargosOcupados')                    
                        ->where('idpersona = ? and identidad = ? and idplantillanominal = ? and idcargo = ?', array($idpersona, $identidad, $idplantillanominal, $idcargo))
                        ->count();
                if ($result == 0){
                    return false;
                }else{
                    return true;
                }
            }else {
                return false;
            }            
        } catch (Doctrine_Exception $e){
            throw $e;
        }
    }
    
    public function verificarExistenciadelaSituacionLaboral($idpersona, $identidad, $idsituacionlaboral, $idplantillanominal){
        try {
            $query  = new Doctrine_Query();
            $result = $query
                    ->from('HisCargosOcupados')                    
                    ->where('idpersona = ? and identidad = ? and idplantillanominal = ? and idsituacionlaboral = ?', array($idpersona, $identidad, $idplantillanominal, $idsituacionlaboral))
                    ->count();
            if ($result == 0){
                return false;
            }else{
                return true;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
    


    public function obtenerListadoPersonas($identidad, $limit = 15, $start = 0){
        try {
            $queryObj = Doctrine_Query::create()
                ->select('distinct(dco.idpersona) as idpersona')
                ->from('HisCargosOcupados dco')  
                ->where('dco.identidad = ? and dco.fechavencimiento > now() or dco.fechavencimiento is null', $identidad)             
                ->orderBy('dco.idpersona DESC')
                ->limit($limit)
                ->offset($start);				
            //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
            $queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'dco','p');
            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $exc) {
            throw $exc;
        }
    }
  
    public function obtenerListadoPersonasOcupanCargosEntidad($identidad,$limit = 15, $start = 0){
        try {
            $queryObj = Doctrine_Query::create()
                ->select('dco.idpersona')
                ->from('HisCargosOcupados dco')                
                ->orderBy('dco.idpersona DESC')
                ->where('dco.identidad = ?', array($identidad))
                ->limit($limit)
                ->offset($start);				
            //Agregando a la consulta de usuarios las sentencias DQL que devuelve los datos de la persona.
            $queryObj = ZendExt_IoC_Inter::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 'dco','p');
            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $exc) {
            throw $e;
        }
    }
	
	public function obtenerCantidadPersonas($identidad){
        try {
            $queryObj = Doctrine_Query::create()
                ->select('distinct(dco.idpersona) as idpersona')
                ->from('HisCargosOcupados dco')  
                ->where('dco.identidad = ? and (dco.fechavencimiento > now() or dco.fechavencimiento is null)', $identidad)             
                ->count();
            return $queryObj;
        } catch (Doctrine_Exception $exc) {
            throw $e;
        }
    }
	  public function verficarExistenciadelCargoMod($idpersona, $identidad, $idcargo, $idhiscargosocupados, $idplantillanominal){
        try {
            $query  = new Doctrine_Query();
            if($idcargo != null){
                $result = $query//->select('idpersona')
                        ->from('HisCargosOcupados')                    
                        ->where('idpersona = ? and identidad = ? and idplantillanominal = ? and idcargo = ? and idhiscargosocupados <> ?', array($idpersona, $identidad, $idplantillanominal, $idcargo, $idhiscargosocupados))
                        ->count();
                if ($result == 0){
                    return false;
                }else{
                    return true;
                }
            }else {
                return false;
            }            
        } catch (Doctrine_Exception $e){
            throw $e;
        }
    }
	
	  public function verificarExistenciadelaSituacionLaboralMod($idpersona, $identidad, $idsituacionlaboral, $idhiscargosocupados, $idplantillanominal){
        try {
            $query  = new Doctrine_Query();
            $result = $query
                    ->from('HisCargosOcupados')                    
                    ->where('idpersona = ? and identidad = ? and idplantillanominal = ? and idsituacionlaboral = ? and idhiscargosocupados <> ?', array($idpersona, $identidad, $idplantillanominal, $idsituacionlaboral, $idhiscargosocupados))
                    ->count();
            if ($result == 0){
                return false;
            }else{
                return true;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
    
    /*Todas las personas que ocupan cargos en la entidad dada*/
    public function obtenerPersonasOcupanCargos($identidad){
        $sql = "select distinct (idpersona), idhiscargosocupados
					from mod_nomina.dat_cargosocupados 
					where identidad = ? and (fechavencimiento >= now() or fechavencimiento is null);";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($identidad));
    }
    
    /*Cargos ocupados de las personas pasadas por parametros*/
    public function obtenerCargosOcupadosPersonas($arrPersonas){
        $sql = "select distinct (idpersona), idhiscargosocupados
					from mod_nomina.dat_cargosocupados 
					where idpersona in (".implode(',', $arrPersonas).") and (fechavencimiento >= now() or fechavencimiento is null);";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql);
    }
    
    /*Devuelve todas las personas que ocupan cargos que tienen configurado el periodo de pago que se pasa por parametro en la entidad dada*/
    public function obtenerPersonasOcupanCargosPeriodo($identidad, $idperiodopago){
        $sql = "select distinct (dco.idpersona), dco.idhiscargosocupados
					from mod_nomina.dat_cargosocupados dco
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo)
					left join mod_nomina.conf_elementosalarialsituacionservicio cesss on (cesss.idcargoocupado = dco.idhiscargosocupados)
					where dco.identidad = ? and (cesc.idperiodopago = ? or cesss.idperiodopago = ?) and (dco.fechavencimiento >= now() or dco.fechavencimiento is null);";

		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($identidad, $idperiodopago, $idperiodopago));
    }
    
    /*Devuelve todos los cargos y situaciones que tienen configurado en el periodo de pago que se pasa por parametro en la entidad dada de una persona*/
    public function obtenerCargosOcupadosPersonaPeriodo($identidad, $idpersona, $idperiodopago){
        $sql = "select dco.*, nsl.denominacion as denomsituacionlaboral
					from mod_nomina.dat_cargosocupados dco
					left join mod_nomina.nom_situacionlaboral nsl on (nsl.idsituacionlaboral = dco.idsituacionlaboral)
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo)
					left join mod_nomina.conf_elementosalarialsituacionservicio cesss on (cesss.idcargoocupado = dco.idhiscargosocupados)
					where dco.identidad = ? and dco.idpersona = ? and (cesc.idperiodopago = ? or cesss.idperiodopago = ?) and (dco.fechavencimiento >= now() or dco.fechavencimiento is null);";

		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($identidad, $idpersona, $idperiodopago, $idperiodopago));
    }
    
    public function obtenerPersonaElaborarPagoCargosOcupados($arridhiscargosocupados){
        $sql = "select dco.*, nsl.denominacion as denomsituacionlaboral
					from mod_nomina.dat_cargosocupados dco
					left join mod_nomina.nom_situacionlaboral nsl on (nsl.idsituacionlaboral = dco.idsituacionlaboral)
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo)
					left join mod_nomina.conf_elementosalarialsituacionservicio cesss on (cesss.idcargoocupado = dco.idhiscargosocupados)
					where dco.idhiscargosocupados in (".implode(',', $arridhiscargosocupados).");";

		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql);
    }
    
    /*Devuelve todos los conceptos de percepciones y descuentos asociados al cargo o situacion laboral*/
    public function obtenerConceptosPDAsociados($idhiscargosocupados){
		$sql = "select * from mod_nomina.dat_cargosocupados where idhiscargosocupados = ? and (fechavencimiento >= now() or fechavencimiento is null);";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$rco = $conn->fetchAll($sql, array($idhiscargosocupados));
		if(count($rco) > 0){
			if($rco[0]['idsituacionlaboral'] != ''){
				$sql = "select idconceptopercepciondescuento 
							from mod_nomina.conf_conceptpelementsalarialessituacionservicio 
							where idhiscargosocupados = ? and (fechafin >= now() or fechafin is NULL);";
				$a = array($idhiscargosocupados);
			}else{
				$sql = "select cesc.*, ccpds.idconceptopercepciondescuento 
							from mod_nomina.conf_elementosalarialcargo cesc
							inner join mod_nomina.conf_conceptospdelementossalariales ccpds on (ccpds.idelementosalarialcargo = cesc.idelementosalarialcargo) 
							where cesc.idcargo = ? and (cesc.fechafin >= now() or cesc.fechafin is NULL);";
				$a = array($rco[0]['idcargo']);
			}
			$datos = $conn->fetchAll($sql, $a);
			$r->datos = $datos;
			if(count($datos) > 0)
				$r->resultado = 1;
			else 
				$r->resultado = -1;
			
		}else{
			$r->resultado = -1;
		}
		
		return $r;
	}
	
	/*Devuelve la config de elementos salariales al cargo o a la situacion laboral*/
    public function obtenerConfElementosAsociados($idhiscargosocupados){
		$sql = "select * from mod_nomina.dat_cargosocupados where idhiscargosocupados = ? and (fechavencimiento >= now() or fechavencimiento is null);";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$rco = $conn->fetchAll($sql, array($idhiscargosocupados));
		$datos = null;
		if(count($rco) > 0){
			if($rco[0]['idsituacionlaboral'] != ''){
				$sql = "select * 
							from mod_nomina.conf_elementosalarialsituacionservicio 
							where idcargoocupado = ? and (fechafin >= now() or fechafin is NULL);";
				$a = array($idhiscargosocupados);
				$datos = $conn->fetchAll($sql, $a);
				if(count($datos) > 0){
					//No hago nada
				}else{
					$sql = "select * 
							from mod_nomina.conf_elementosalarialcargo 
							where idcargo = ? and (fechafin >= now() or fechafin is NULL);";
					$a = array($rco[0]['idcargo']);
					$datos = $conn->fetchAll($sql, $a);
				}
			}else{
				$sql = "select * 
							from mod_nomina.conf_elementosalarialcargo 
							where idcargo = ? and (fechafin >= now() or fechafin is NULL);";
				$a = array($rco[0]['idcargo']);
			}
			$datos = $conn->fetchAll($sql, $a);
			$r->datos = $datos;
			if(count($datos) > 0)
				$r->resultado = 1;
			else 
				$r->resultado = -1;
			
		}else{
			$r->resultado = -1;
		}
		
		return $r;
	}
	
	public function obtenerPersonasNoOcupanCargosContenidasEnArr($identidad, $idplantillanominal, $cajacajero, $arrPersonasPeriodoPago){
		$sql = "select distinct(dco.idpersona), dco.idhiscargosocupados, dco.idcargo, dco.idsituacionlaboral
					from mod_nomina.dat_cargosocupados dco
					where dco.identidad = ? and dco.fechaaplicacion <= now() and (dco.fechavencimiento >= now() or dco.fechavencimiento is null)
					and dco.idcargo is null  and dco.idsituacionlaboral is not null and dco.idplantillanominal = ? and dco.idcajacajero = ? and dco.idpersona in(".implode(',',$arrPersonasPeriodoPago).");";
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		$r = $conn->fetchAll($sql, array($identidad, $idplantillanominal, $cajacajero));
		return $r;
	}

    public function insertHistoricoCargosOcupados($objDatCargosOcupadosSave){
        $objHistorico = new HisCargosOcupados();
        $objHistorico->idhiscargosocupados = $objDatCargosOcupadosSave->idcargosocupados;
        $objHistorico->idpersona = $objDatCargosOcupadosSave->idpersona;
        $objHistorico->idcargo = $objDatCargosOcupadosSave->idcargo;
        $objHistorico->identidad = $objDatCargosOcupadosSave->identidad;
        $objHistorico->fecharegistro = $objDatCargosOcupadosSave->fecharegistro;
        $objHistorico->fechaaplicacion = $objDatCargosOcupadosSave->fechaaplicacion;
        $objHistorico->fechavencimiento = $objDatCargosOcupadosSave->fechavencimiento;
        $objHistorico->observaciones = $objDatCargosOcupadosSave->observaciones;
        $objHistorico->idsituacionlaboral = $objDatCargosOcupadosSave->idsituacionlaboral;
        $objHistorico->idcajacajero = $objDatCargosOcupadosSave->idcajacajero;
        $objHistorico->idcentrocosto = $objDatCargosOcupadosSave->idcentrocosto;
        $objHistorico->idpersonacuentabancariamn = $objDatCargosOcupadosSave->idpersonacuentabancariamn;
        $objHistorico->idpersonacuentabancariacuc = $objDatCargosOcupadosSave->idpersonacuentabancariacuc;
        $objHistorico->numerocontable = $objDatCargosOcupadosSave->numerocontable;
        $objHistorico->idplantillanominal = $objDatCargosOcupadosSave->idplantillanominal;
        $objHistorico->save();
    }
}
