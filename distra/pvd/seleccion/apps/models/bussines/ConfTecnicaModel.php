<?php
class ConfTecnicaModel extends ZendExt_Model
{
    function __construct()
    {
	
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	public function getValoresByIdEscala($idescala)
	{
		$tipoescala = ConfTecnica::getTipoEscala($idescala);
		$valores = Array();
		if ($tipoescala[0]['tipoescala'] == 0) {
			$valores = ConfTecnica::getValorEscalaNumerica($idescala);
		} else {
			$valores = ConfTecnica::getValorEscalaCualitativa($idescala);
		} 
		return $valores;
	}
	
	/**
	* Función que devuelve todas las planillas evaluativas que pueden ser empleadas como técnica de selección.
	*
	* @return array
	* @throws Exception
	*/
	public function getPlanilla()
	{
		try {
			$arr['data'] = ConfTecnica::getPlanillaActiva();
			$arr['total'] = count($arr['data']);
			foreach ($arr['data'] AS $k => $v) {
				if(!$v['descripcion']) {
					$arr['data'][$k]['descripcion'] = 'SIN DESCRIPCIÓN';
				}
				if(!$v['fhasta']) {
					$arr['data'][$k]['fhasta'] = 'NO DEFINIDO';
				}
				if($v['cantd'] == null) {
					$arr['data'][$k]['cantd'] = 'NO DEFINIDO';
				}
			}
			return $arr;
		} catch (Exception $e) {
			throw  $e;
		}
	}
	
	/**
	* Función que devuelve todas las planillas evaluativas que están usadas como técnica de selección.
	*
	* @return array
	* @throws Exception
	*/
	public function getTecnica()
	{
		try {
			$arr['data'] = ConfTecnica::getTecnica();
			$arr['total'] = count($arr['data']);
			foreach ($arr['data'] AS $k => $v) {
				if(!$v['descripcion']) {
					$arr['data'][$k]['descripcion'] = 'SIN DESCRIPCIÓN';
				}
				if(!$v['fhasta']) {
					$arr['data'][$k]['fhasta'] = 'NO DEFINIDO';
				}
				if($v['cantd'] == null) {
					$arr['data'][$k]['cantd'] = 'NO DEFINIDO';
				}
			}
			return $arr;
		} catch (Exception $e) {
			throw $e;
		}
	}
	
	public function getTecnicaNoProceso($idproceso)
	{
		try {
			$arr['data'] = ConfTecnica::getTecnicaNoProceso($idproceso);			
			return $arr;
		} catch (Exception $e) {
			throw $e;
		}
	}

    public function activarPlanilla($idplanilla, $fechafin)
    {
        try {
         
            ConfTecnica::activarPlanilla($idplanilla, $fechafin);
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
	
	/**
	* Función para obtener las planillas que son usadas técnicas de selección y están inactivas.
	*
	* @return ?
	* @throws Exception
	*/
	public function getPlanillaNoActiva()
	{
		try {
			$arr = ConfTecnica::getPlanillaNoActiva();
			if(count($arr)) {
				$res['success'] = true;
				$res['data'] = $arr;
			} else {
                $res['data'] = Array();
                $res['success'] = false;
            }
            return $res;
		} catch (Exception $e) {
			throw $e;
		}
	}
	
	/**
	* Función para insertar las planillas como técnicas de selección.
	*
	* @return array
	* @throws Exception
	*/
	public function addPlanillaTecnica($arrTec)
	{
		try {
			foreach($arrTec as $k => $v) {
				$ctecnica = new ConfTecnica();
				$ctecnica->idplanilla = $v;
				$ctecnica->save();
			}
			return $res['success'] = true;
		} catch (Exception $e) {
			$res['success'] = false;
			$res['data'] = $e;
			return $res;
		}
	}
	
	/**
	* Función para eliminar una planilla como técnica de selección.
	* @param $idtecnica
	*/
	public function delPlanillaTecnica($idtecnica)
	{
        $ctecnica = ConfTecnica::getById($idtecnica);
        try{
            $ctecnica->delete();
            return true;
        } catch(Exception $e){
            if($e->GetCode() == 23503){
                return false;
            }
        }
    }
	
	/**
	* Función para obtener los modelos de una técnica.
	*
	* @param $idtecnica
	*/
	public function getModeloByTecnica($idtecnica)
	{
		try {
			$arr = ConfComptecnica::getModeloByTecnica($idtecnica);
			$res['success'] = true;
			$res['data'] = $arr;
			return $res;
		} catch (Exception $e) {
			$res['success'] = false;
			$res['data'] = $e;
			return $res;
		}
	}
	
	/**
	* Función que devuelve los procesos de dado una técnica y un modelo.
	*
	* @param $tecnica   Identificador de la técnica de selección.
	* @param $idmodelo  Identificador del modelo de la técnica de selección.
	* @param $start     Número inicial de la tupla a obtener.
	* @param $limit     Límite de tuplas a obtener en la consulta.
	*
	* @return array
	*/
	public function getProcesoByTecnicaModelo($idtecnica, $idmodelo, $start, $limit)	
	{
		try {
			$procesos = DatProcesotecnica::getProcesoByTecnicaModelo($idtecnica, $idmodelo, $start, $limit);
			$res = Array();
			foreach ($procesos as $i => $val) {
				$res[$i]['idproceso'] = $val['idproceso'];	
				$res[$i]['denominacion'] = $val['denominacion'];
				$res[$i]['fdesde'] = $val['fdesde'];
				$res[$i]['fhasta'] = $val['fhasta'];
				$res[$i]['recurso'] = $val['recurso'];
				$cargos = DatProcesocargo::getCargosByIdProceso($val['idproceso']);
				foreach ($cargos as $h => $v) { 
					$datcargo = DatProcesocargo::getDenomCargosById($v['idcargo'], $v['homologo']);
					if (!$res[$i]['cargos']) {
						$res[$i]['cargos'] = $datcargo[0]['denominacion'];
					} else {
						$res[$i]['cargos'] = $res[$i]['cargos'].', '.$datcargo[0]['denominacion'];
					}			
				}
			}
			$arr['success'] = true;
			$arr['data'] = $res;
			$arr['total'] = DatProcesotecnica::getCantProcesoByTecnicaModelo($idtecnica, $idmodelo);
			return $arr;
		} catch (Exception $e) {
			$arr['success'] = false;
			$arr['data'] = $e;
			return $arr;
		}
	}
}
