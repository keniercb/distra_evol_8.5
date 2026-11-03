<?php
class DatProcesoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	public function getCargos($filtro)	
	{		
		$cargos = DatProceso::getCargos($filtro);		
		return $cargos;
	}
	
	public function getCargosByIdProceso($idproceso)	
	{		
		$cargos = DatProcesocargo::getCargosByIdProceso($idproceso);		
		return $cargos;
	}

	public function getCompetenciasByProceso($idproceso)
	{
		$cargost = DatProcesocargo::getCargosByIdProceso($idproceso);
		$cargos = Array();
		$especializaciones = Array();
		foreach ($cargost as $c) {
			if ($c['especializacion'] == 1) {
				array_push($especializaciones, $c['idcargo']);
			} else {
				array_push($cargos, $c['idcargo']);
			}
		}
		$comp = DatProceso::getCompetenciasCargo($cargos, $especializaciones);
		if (count($comp) > 0) {
			return $comp;
		} else {
			return array();
		}
	}
	
	public function getProcesos($limite, $inicio, $denom, $cargo, $idestructuraglobal, $cargartodo)
	{
		$objprocesocargo = new DatProcesocargo();
        $entidadesdom = Array();
		array_push($entidadesdom, $idestructuraglobal);
        if ($cargartodo == 1) {
            $entid = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructuraglobal);
            foreach ($entid as $est) {
                array_push($entidadesdom, $est->id);
            }
        }
		$procesos = DatProceso::getProcesos($limite, $inicio, $denom, $cargo, $entidadesdom);
		$resul = Array();
		foreach ($procesos as $i => $val) {
			$resul[$i]['idproceso'] = $val['idproceso'];	
			$resul[$i]['idexpresion'] = $val['idexpresion'];	
			$resul[$i]['denominacion'] = $val['denominacion'];
			$resul[$i]['fdesde'] = $val['fdesde'];
			$resul[$i]['fhasta'] = $val['fhasta'];
			$resul[$i]['recurso'] = $val['recurso'];
            $resul[$i]['cantd'] = $val['cantd'];
            $resul[$i]['idestructura'] = $val['idestructura'];
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val['idestructura']);
            $resul[$i]['estructura'] = $entidad[0]->denominacion;
            $resul[$i]['contratar'] = $val['contratar'];
            if ($val['cantd'] == null || $val['cantd'] >= 0) {
                $resul[$i]['estado'] = 'Actual';
                $resul[$i]['comitesexpirados'] = DatProcesocomite::getComitesExpiradosByIdProceso($val['idproceso']);
                $tecExpiradas = DatProcesotecnica::getTecnicaExpiradasByProceso($val['idproceso']);
                $resul[$i]['tecnicasexpiradas'] = (count($tecExpiradas)>0)?1:0;
                $resul[$i]['planillasexpiradas'] = (count(DatProceso::getPlanillaNoActiva($val['idproceso']))>0)?1:0;
            } else {
                $resul[$i]['estado'] = 'Histórico';
            }
            if ($val['idestructura'] == $idestructuraglobal) {
                $resul[$i]['otro'] = 0;
            }  else {
                $resul[$i]['otro'] = 1;
            }
			$cargos = $objprocesocargo->getCargosByIdProceso($val['idproceso']);
			foreach ($cargos as $h => $v) {
				$datcargo = $objprocesocargo->getDenomCargosById($v['idcargo'], $v['homologo']);
				if (!$resul[$i]['cargos']) {
					$resul[$i]['cargos'] = $datcargo[0]['denominacion'];
				} else {
					$resul[$i]['cargos'] = $resul[$i]['cargos'].', '.$datcargo[0]['denominacion'];
				}			
			}
		}
		$r->datos = $resul;
		$r->cantidad = DatProceso::cantProcesos($denom, $cargo, $entidadesdom);
		return $r;
	}
	
	public function cantProcesos()	
	{
		return DatProceso::cantProcesos(null, null, null);
	}
	
	public function addProceso($denominacion, $fdesde, $fhasta, $recurso, $contratar, $idestructura, $cargos)
	{		
		try{
			$objproceso = new DatProceso();
			$objproceso->denominacion = $denominacion;
			if ($recurso != '') {
				$objproceso->recurso = $recurso;
			}			
			$objproceso->fdesde = $fdesde;
			$objproceso->fhasta = $fhasta;
            $objproceso->contratar = $contratar;
            $objproceso->idestructura = $idestructura;
			$objproceso->save();
			$idproceso = $objproceso->idproceso;
			foreach ($cargos as $i => $val) {
				$objprocesocargo = new DatProcesocargo();
				$objprocesocargo->idproceso = $idproceso;
				$objprocesocargo->idcargo = $val->idcargo;
				$objprocesocargo->homologo = $val->especializacion;
				$objprocesocargo->save();
			}
			return true;
		} catch(Exception $e){
            return false;            
		}
	}
	
	public function modProceso($idproceso, $denominacion, $fdesde, $fhasta, $recurso, $contratar, $cargos)
	{		
		try{
			$objproceso = DatProceso::getById($idproceso);
			$objproceso->denominacion = $denominacion;
			$objproceso->recurso = $recurso;
			$objproceso->fdesde = $fdesde;
			$objproceso->fhasta = $fhasta;
            $objproceso->contratar = $contratar;
			$objproceso->save();
					
			DatProcesocargo::delByIdProceso($idproceso);
			
			$idproceso = $objproceso->idproceso;
			foreach ($cargos as $i => $val) {
				$objprocesocargo = new DatProcesocargo();
				$objprocesocargo->idproceso = $idproceso;
				$objprocesocargo->idcargo = $val->idcargo;
				$objprocesocargo->homologo = $val->especializacion;
				$objprocesocargo->save();
			}
			return true;
		} catch(Exception $e){
            return false;            
		}	
	}
	
	public function delProceso($idproceso)
	{
		$obj = DatProceso::getById($idproceso);         		
		try{
			$obj->delete();
			return true;
		} catch(Exception $e){
			if($e->GetCode() == 23503){
                return false;
            }
		}	
	}
	
	public function modExpresionMatematica($idproceso, $idexpresion)	
	{		
		try{
			$objproceso = DatProceso::getById($idproceso);
			$objproceso->idexpresion = $idexpresion;	
			$objproceso->save();
			return true;
		} catch(Exception $e){
            return false;            
		}	
	}
	
	/**
	 * Función para obtener los modelos de una planillas.
	 * @param idplanilla: Identificador de la planilla.
	 * @return array
	**/
	public function getModeloByPlanilla($idplanilla)
    {
		try {
			return DatProceso::getModeloByPlanilla($idplanilla);
		} catch (Exception $e) {
			throw $e;
		}
    }
	
	public function getDatosGrafica()
    {
		try {
			$r = DatProceso::getDatosGrafica();
			$categories = Array();
			$serieProceso = Array();
			$seriePreseleccionado = Array();
			$serieSeleccionado = Array();
			$serieExcluido = Array();
			foreach($r AS $i => $k) {
				$categories[$i] = $k['denominacion'];
				$serieProceso[$i] = $k['proceso'];
				$seriePreseleccionado[$i] = $k['preseleccionado'];
				$serieSeleccionado[$i] = $k['seleccionado'];
				$serieExcluido[$i] = $k['excluido'];
			}
			$datos['categories'] = $categories;
			$datos['series'][0] = $serieProceso;
			$datos['series'][1] = $seriePreseleccionado;
			$datos['series'][2] = $serieSeleccionado;
			$datos['series'][3] = $serieExcluido;
			$result['success'] = true;
			$result['datos'] = $datos;
			return $result;
		} catch (Exception $e) {
			$result['success'] = false;
			$result['msg'] = $e;
			return $result;
		}
    }
	
	public function getProcesoActivo() {
		try {
			$r['datos'] = DatProceso::getProcesoActivo();
			$r['success'] = true;
		} catch(Exception $e) {
			$r['success'] = false;
			$r['msg'] = $e;
		}
		return $r;
	}
	public function getProcesosActivos() {
		try {
			$r= DatProceso::getProcesoActivo();

		} catch(Exception $e) {
			$r['success'] = false;
			$r['msg'] = $e;
		}
		return $r;
	}


}
