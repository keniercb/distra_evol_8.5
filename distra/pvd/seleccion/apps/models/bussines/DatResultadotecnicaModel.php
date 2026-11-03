<?php
class DatResultadotecnicaModel extends ZendExt_Model
{
    
    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	public function getCandidatos($idproceso, $idprocesotecnica, $start, $limit, $filtro)
	{
		$datos = Array();
		$datos = DatResultadotecnica::getCandidatos($idproceso, $idprocesotecnica, $start, $limit, $filtro);
		foreach ($datos as $k => $v) {
			$datos[$k]['foto'] = ($v['foto'])?'data:image/png;base64,' . $v['foto']: null;
			if($v['resultado'] != null && ($v['tipoescala'] != '')) {
				$res = DatResultadotecnica::getResultado($v['idresultadotecnica'], $v['tipoescala']);
				$datos[$k]['resultado'] = $res[0]['valor'];
				$datos[$k]['color'] = $res[0]['color'];
			} else if ($v['resultado'] != null) {
				$datos[$k]['color'] = '#000000';
			} else {
				$datos[$k]['color'] = null;
			}
		}
		$r->datos = $datos;
		$r->cantidad = DatResultadotecnica::getCantCandidatos($idproceso, $filtro);
		return $r;
	}
		
	public function iniciarTecnica($idprocesotecnica, $arrcandidatos)
	{
		try {
			$algunosCandNo = 1;
			$datosProcTec = DatProcesotecnica::getTecnicaById($idprocesotecnica);
			$proctec = DatProcesotecnica::getTecnicaByProceso($datosProcTec['idproceso']);
			$procComp = ConfComptecnica::getIdProcTecByTecnicaModelo($datosProcTec['idproceso'], $datosProcTec['idtecnica'], $datosProcTec['idmodelo']);
			$comp = count($procComp);
			$procComp[$comp]['idprocesotecnica'] = $idprocesotecnica;
			$procComp[$comp]['idproceso'] = $datosProcTec['idproceso'];
			if ($proctec[0]['idprocesotecnica'] == $idprocesotecnica) {
				foreach($arrcandidatos as $cand) {
					foreach ($procComp as $proc) {
						$candidato = DatCandidato::existeCandidatoProceso($proc['idproceso'], $cand->idpersona, $proc['idprocesotecnica']);
						if ($candidato) {
							$obj = new DatResultadotecnica();
							$obj->idprocesotecnica = $proc['idprocesotecnica'];
							$obj->idcandidato = $candidato['idcandidato'];
							$obj->save();
						}						
					}												
				} 
			} else {
				foreach($arrcandidatos as $cand) {					
					$iniciar = 0;
					$existehito = 0;
					for ($i = 0;$proctec[$i]['idprocesotecnica'] != $idprocesotecnica;$i++) {
						if ($proctec[$i]['hito'] == 1) {
							$existehito = 1;
							$resultado = DatResultadotecnica::getResultadoByIdproctecnica($proctec[$i]['idprocesotecnica'], $cand->idcandidato);
							if (count($resultado) > 0) {
								$iniciar = 1;								
							}
						}						
					}
					if ($existehito == 0) {
						$iniciar = 1;
					}
					if ($iniciar == 1) {
						foreach ($procComp as $proc) {
							$candidato = DatCandidato::existeCandidatoProceso($proc['idproceso'], $cand->idpersona, $proc['idprocesotecnica']);
							if ($candidato) {
								$obj = new DatResultadotecnica();
								$obj->idprocesotecnica = $proc['idprocesotecnica'];
								$obj->idcandidato = $candidato['idcandidato'];
								$obj->save();
							}
						}
					} else {
						$algunosCandNo = 0;
					}
				} 
			}
			return $algunosCandNo;
		} catch (Exception $e) {
			return false;
		}
	}	
	
	public function saveResult($idresultadotecnica, $idplanilla, $idmodelo)
    {
		$objPT = DatResultadotecnica::getById($idresultadotecnica);
		$perfil = $_SESSION['Zeolides']['perfil'];
		$objPT->idusuario = $perfil['idusuario'];
		$objPT->save();
		$proctec = DatResultadotecnica::getProcesoTecById($idresultadotecnica);
		$arrayresultecComp = Array();
		$arrayresultecComp = ConfComptecnica::getIdResTecByTecnicaModelo($proctec[0]['idprocesotecnica'], $proctec[0]['idtecnica'], $proctec[0]['idmodelo']);
        $arrayresultecComp[count($arrayresultecComp)]['idresultadotecnica'] = $idresultadotecnica;
		foreach ($arrayresultecComp as $restec) {
			$arrIndicadores = DatResultadotecnica::getIndicadoresEvalTextByResultTec($restec['idresultadotecnica']);
			$modelo = $this->pIntegrator->evaluaciones->getModeloById($idmodelo);
			$objResulTecSelection = DatResultadotecnica::getById($restec['idresultadotecnica']);
			if (empty($modelo[0]->idescala)) {
				//Caso en que el modelo matematico es el resultado de una expresion matematica
				$r = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica(
					$modelo[0]->idexpresionmatematica, $arrIndicadores
				);
				$objResulTecSelection->resultado = round($r->valor, 2);
			} else {
				//Caso en que el modelo matemático se calcula con hechos
				$arrHechos = $this->pIntegrator->evaluaciones->getHechosByModelo($idmodelo);

				if (!empty($arrHechos)) {
					foreach ($arrHechos as $hecho) {
						$aux = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica(
							$hecho['idexpresionmatematica'], $arrIndicadores
						);
						//Verifico que se haya cumplido la expresión matemática para este hecho
						if ($aux->codigo == 1 && $aux->valor == 1) {
							$objResulTecSelection->resultado = $hecho['peso'];
							break;
						}
					}
				} else {
					return false;
				}
			}
			$objResulTecSelection->fhasta = Date('d/m/Y');
			$objResulTecSelection->save();
			
			$pt = DatProcesotecnica::getById($objResulTecSelection->idprocesotecnica);
			if ($pt->hito == 1) {
				$escala = DatProcesotecnica::getEscalaByProcTec($objResulTecSelection->idprocesotecnica);
				$rt_resultado = null;
				if($escala == 0)
					$rt_resultado = DatResultadotecnica::getById($objResulTecSelection->idresultadotecnica)->resultado;
				else {
					$tipoescala = DatProcesotecnica::getTipoEscalaByProcTec($pt->idprocesotecnica);
					$rt_resArr = DatResultadotecnica::getResultado($objResulTecSelection->idresultadotecnica, $tipoescala[0]['tipoescala']);
					$rt_resultado = $rt_resArr[0]['idvalor'];
				}
				$excluir = 'si';
				switch($pt->condicion) {
						case '==' : {if($rt_resultado == $pt->valor)
										$excluir = 'no';
									 break;
									};
						case '>=' : {if($rt_resultado >= $pt->valor)
										$excluir = 'no';
									 break;
									};
						case '<=' : {if($rt_resultado <= $pt->valor)
										$excluir = 'no';
									 break;
									};
						case '>' :  {if($rt_resultado > $pt->valor)
										$excluir = 'no';
									 break;
									};
						case '<' :  {if($rt_resultado < $pt->valor)
										$excluir = 'no';
									 break;
									};
				}
				if($excluir == 'si'){
					$objcand = DatCandidato::getById($objResulTecSelection->idcandidato);
					$objcand->fhasta = date('d/m/Y');
					$objcand->save();
					$objexcluir = new DatExcluido();
					$objexcluir->idcandidato = $objResulTecSelection->idcandidato;
					$objexcluir->fexclusion = date('d/m/Y');
					$objexcluir->tipo = 1;
					$objexcluir->save();
				}				
			}
		}		
        return true;
    }

    function comprobarValidezResultadoTecnica()
    {
       try{
            $candidatosValidezVencida = DatResultadotecnica::getCandidatosResultadoTecnicaNoValido();
            foreach ($candidatosValidezVencida as $cand) {
                $resultecnica = DatResultadotecnica::getById($cand['idresultadotecnica']);
                $resultecnica->delete();
                if ($cand['idresultadoseleccion']) {
                    $resultselect = DatResultadoseleccion::getById($cand['idresultadoseleccion']);
                    $resultselect->delete();
                }
            }
            return true;
       } catch (Exception $e) {
            return false;
       }
    }
}
