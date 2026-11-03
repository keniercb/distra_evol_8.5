<?php
class DatCandidatoModel extends ZendExt_Model
{

	function __construct()
	{
		$this->objDomain = new DatCandidato();
	}

    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	public function getCandidatosByProceso($idproceso, $start, $limit, $filtro)
	{
		$datos = Array();
		$datos = DatCandidato::getCandidatos($idproceso, $start, $limit, $filtro);
		$r->datos = $datos;
		$r->cantidad = DatCandidato::getCantCandidatos($idproceso, $filtro);
		return $r;
	}

	public function getProcesosByPersona($idpersona)
	{
		$datos = Array();
		$datos = DatCandidato::getProcesosByPersona($idpersona);
		return $datos;
	}
	
	public function addCandidato($idproceso, $idviareclutamiento, $arrcandidatos)
	{
		try {
            $idvia = ($idviareclutamiento!='')?$idviareclutamiento: null;
			$res = 1;
			foreach($arrcandidatos as $v) {
				if(DatCandidato::existePersCdtoActivo($idproceso, $v->idpersona) == 0) {
					$perfil = $_SESSION['Zeolides']['perfil'];
					$candidato = new DatCandidato();
					$candidato->idproceso = $idproceso;
					$candidato->idpersona = $v->idpersona;
                    $candidato->idprocesoorigen = (empty($v->idproceso))?null:$v->idproceso;
					$candidato->idviareclutamiento = $idvia;
					$candidato->idusuario = $perfil['idusuario'];
					$candidato->save();
					$tecnicasproc = DatProcesotecnica::getTecnicaByProceso($idproceso);
					if ($tecnicasproc) {//si tienes tecnicas busco con quien estÃ¡n compartidas
						$procComp = ConfComptecnica::getIdProcTecByTecnicaModelo($idproceso, $tecnicasproc[0]['idtecnica'], $tecnicasproc[0]['idmodelo']);
						foreach ($procComp as $proc) {
							$cand = DatCandidato::existeCandidatoProceso($proc['idproceso'], $v->idpersona, $tecnicasproc[0]['idprocesotecnica']);
							if ($cand) {
								$resultadotecnica = DatResultadotecnica::getResByIdproctecnicaCandTodo($proc['idprocesotecnica'], $cand['idcandidato']);
								if ($resultadotecnica) {break;}
							}
						}
						if ($resultadotecnica) {
							$obj = new DatResultadotecnica();
							$obj->idprocesotecnica = $tecnicasproc[0]['idprocesotecnica'];
							$obj->idcandidato = $candidato->idcandidato;
							$obj->save();
							if ($resultadotecnica[0]['resultado']) {
								$indicadores = DatIndicadortecnica::getIndicadorSeleccionByIdresultadotecnica($resultadotecnica[0]['idresultadotecnica']);
								foreach ($indicadores as $ind) {
									$objind = new DatIndicadortecnica();
									$objind->idresultadotecnica = $obj->idresultadotecnica;
									$objind->idindicadorplanilla = $ind['idindicadorplanilla'];
									$objind->resultado = $ind['resultado'];
									$objind->complemento = $ind['complemento'];
									$objind->save();
								}
								$obj->resultado = $resultadotecnica[0]['resultado'];
								$obj->save();
							}
						}
					}
				} else {
					$res = 2;
				}
			}
			return $res;
		} catch (Exception $e) {
			return false;
		}
	}
	
	public function excluirCandidato($arr, $idmotivoexclusion, $observexclusion)
	{
		try {
			$fecha = date('d/m/Y');
			foreach ($arr as $k => $v) {
				$dcand = DatCandidato::getById($v);
				$dcand->fhasta = $fecha;
				$dcand->save();
				$objexcluir = new DatExcluido();
				$objexcluir->idcandidato = $v;
				$objexcluir->fexclusion = $fecha;
				$objexcluir->idmotivoexclusion = $idmotivoexclusion;
				$objexcluir->observexclusion = $observexclusion;
				$objexcluir->tipo = 2;
				$objexcluir->save();
			}
			return true;
		} catch (Exception $e) {
			return false;
		}
	}
	
	public function deleteCandidatos($arr)
    {
        try {
            foreach ($arr as $k => $v) {
                $dcand = DatCandidato::getById($v);
                $dcand->delete();
            }
            return true;
        } catch (Exception $e) {
            if($e->GetCode() == 23503){
                return false;
            }
        }
    }

    public function updateViaRecCandidato($idcandidato, $idviareclutamiento)
    {
        try {
            $dcand = DatCandidato::getById($idcandidato);
            $dcand->idviareclutamiento = $idviareclutamiento;
            $dcand->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
	
	public function getExcluidosByProceso($idproceso, $start, $limit, $filtro)
	{
		$datos = Array();
		$datos = DatCandidato::getExcluidos($idproceso, $start, $limit, $filtro);
		$r->datos = $datos;
		$r->cantidad = DatCandidato::getCantExcluidos($idproceso, $filtro);
		return $r;
	}
	
	public function reincorporarCandidatoByProceso($idproceso, $arrCandidatos, $idmotivoreincorporacion, $observreincorporacion)
	{
		try {
			$arrActivos = DatCandidato::getIdPersActByProceso($idproceso);
			foreach ($arrCandidatos as $v) {
				$candidato = DatCandidato::getById($v->idcandidato);
				$activar = 'SI';
				$msg = false;
				foreach ($arrActivos as $k) {
					if ($candidato->idpersona == $k['idpersona'])
						$activar = 'NO';
				}
				if ($activar == 'SI') {
					$candidato->fhasta = null;
					$candidato->save();
					$objexcluir = DatExcluido::getById($v->idexcluido);
					$objexcluir->freincorporacion = date('d/m/Y');
					$objexcluir->idmotivoreincorporacion = $idmotivoreincorporacion;
					$objexcluir->observreincorporacion = $observreincorporacion;
					$objexcluir->save();
					$resultado = DatResultadoseleccion::getIdByCandidato($candidato->idcandidato);
					if ($resultado[0]['idresultadoseleccion']) {
						$resultadosel = DatResultadoseleccion::getById($resultado[0]['idresultadoseleccion']);
						if ($resultadosel->seleccion == 1) {
							$resultadosel->seleccion = 0;
							$resultadosel->save();
						}
					}
					$msg = true;
				} else {
					$msg = false;
				}
			}
			$r['success'] = true;
			if ($msg == false) {
				$r['msg'] = false;
			} else {
				$r['msg'] = true;
			}
			
			return $r;
		} catch (Exception $e) {
			$r['success'] = false;
			$r['msg'] = $e;
			return $r;
		}
	}
	
	//Devuelve un arreglo con todos los candidatos
	public function getRecCandidato($start, $limit, $filtro, $idproceso, $idestado, $personas) {
		try{
			$r['datos'] = DatCandidato::getRecCandidato($start, $limit, $filtro, $idproceso, $idestado, $personas);
			$r['cantidad'] = DatCandidato::getCantRecCandidato($filtro, $idproceso, $idestado, $personas);
			$r['success'] = true;
			return $r;
		} catch (Exception $e) {
			$r['success'] = false;
			$r['msg'] = $e;
			return $r;
		}
	}
	
	//Función que devuelve los datos (Personales y del proceso) de un candidato dado el id.
	public function getDatosRecById($idcandidato) 
	{
		try {
			$r['datos'] = DatCandidato::getDatosRecById($idcandidato);
			$r['success'] = true;
			return $r;
		} catch (Exception $e) {
			$r['success'] = false;
			$r['msg'] = $e;
			return $r;
		}
	}

    public function updateCandidato($idcandidato, $observacion) 
	{
        try {
            $obj = DatCandidato::getById($idcandidato);
            $obj->observacion = $observacion;
            $obj->save();
            return 1;
        } catch (Exception $e) {
            return 0;
        }
    }


	public function addProcesoActivo($valores, $idpersona)
	{
		try {
				foreach($valores as $v) {
				    $candidato = new DatCandidato();
					$candidato->idproceso = $v['idproceso'];
					$candidato->idpersona = $idpersona;
					$candidato->observacion = $v['observacion'];
					$candidato->idviareclutamiento = $v['idviareclutamiento'];
					$candidato->save();
				}
		} catch (Exception $e) {
			return false;
		}
	}


	public function modProcesoActivo(array $data, array $ids)
	{
		try {
			if (count($data) > 0 && count($ids) > 0) {
				$collection = $this->objDomain->getByIdcandidato($ids, false);
				if (count($collection) > 0) {

					foreach ($collection as $p => $v) {
						foreach ($data[$v->idcandidato] as $k => $val) {
							$collection[$p]->$k = (!empty($val)) ? $val : null;
						}
					}
					if ($collection->isModified()) {
						$collection->save();
					}
				}
			}
		} catch (Doctrine_Collection_Exception $e) {
			throw $e;
		}
	}

	public function delProcesoActivo($id, $idPersona)
	{
		try {
			return $this->objDomain->delProcesoActivo(Utiles::reflectArray($id), $idPersona);
		} catch (Exception $e) {
			throw $e;
		}
	}




}
