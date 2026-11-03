<?php
class DatResultadoseleccionModel extends ZendExt_Model
{
    
    public function setUp()
    {
        parent::ZendExt_Model();
    }
	
	/**
     * Aplica el modelo de selección para un proceso
	 * @param $idproceso
     * @param $idexpresionmatematica
     */
    public function aplicarModeloSeleccion($idproceso, $idexpresionmatematica)
    {
        $r->cantPers = 0;
        //1- Buscar los candidatos que hayan finalizado todas las técnicas de ese proceso
        $arrCandidatos = DatResultadotecnica::getCandidatosConTecnicasFinalizadas($idproceso);//print_r($arrCandidatos);die;
	   //Valido que si no hay personas que hayan cumplido con todas las técnicas no aplicar modelo de selección
        if(count($arrCandidatos)==0){
            return $r;
        }
        //2- Aplicar modelos por persona
        $idcandidato = $arrCandidatos[0]['idcandidato'];
        $i = 0;
        //3- Formo estructura de arreglo para aplicar los modelos por persona
        foreach ($arrCandidatos as $key => $cand) {
            if ($idcandidato != $cand['idcandidato']) {
                $idcandidato = $cand['idcandidato'];
                ++$i;
            }
            $arrValues[$i]['idpersona'] = $cand['idpersona'];
            $arrValues[$i]['idcandidato'] = $cand['idcandidato'];
            $valor = ($cand['resultado'] != null)?$cand['resultado']:$cand['valor'];
            $arrValues[$i]['resultado'][] = array(
                'idindicador' => $cand['idplanilla'],
                'valor'       => $valor
            );
        }
        try {
            $arrIdPersonsSelected = array();
            //4- Aplico modelos por persona
            foreach ($arrValues as $value) {
                //Ejecuta modelo de seleccion
                $result = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica(
                    $idexpresionmatematica, $value['resultado']
                );
                if ($result->valor == 1) {
                    $perfil = $_SESSION['Zeolides']['perfil'];
					//Guarda resultado seleccion
					$dcResulSelect = new DatResultadoseleccion();
					$dcResulSelect->idcandidato = $value['idcandidato'];
                    $dcResulSelect->idusuario = $perfil['idusuario'];
					$dcResulSelect->save();
                    //Almacena los identificadores de las personas seleccionadas
                    $arrIdPersonsSelected[] = $value['idpersona'];
                } else {
                    //Almacena los identificadores de las personas rechazadas
					$dcand = DatCandidato::getById($value['idcandidato']);
					$fecha = date('d/m/Y');
					$dcand->fhasta = $fecha;
					$dcand->save();
                    $objexcluir = new DatExcluido();
                    $objexcluir->idcandidato = $value['idcandidato'];
                    $objexcluir->fexclusion = $fecha;
                    $objexcluir->tipo = 1;
                    $objexcluir->save();
                }
            }  
            $r->cantPers = count($arrIdPersonsSelected);
            return $r;
        } catch (Exception $e) {
            throw $e;
        }
    }

	public function getCandidatosPreseleccionados($idproceso, $start = 0, $limit = 15, $filtro)
	{	
		try{
			$r->data = DatResultadoseleccion::getCandidatosPreseleccionados($idproceso, $start = 0, $limit = 15, $filtro);
			$r->cantidad = DatResultadoseleccion::cantCandidatosPreseleccionados($idproceso, $filtro);
			return $r;
		} catch (Exception $e) {
            throw $e;
        }
	}
	
	public function getCandidatosSeleccionados($idproceso, $start = 0, $limit = 15, $filtro)
	{	
		try{
			$datos = DatResultadoseleccion::getCandidatosSeleccionados($idproceso, $start = 0, $limit = 15, $filtro);
            foreach ($datos as $k=>$valor) {
                $ubicacion = ZendExt_IoC::getInstance()->metadatos->DameEstructura($valor['ubicacion']);
                $datos[$k]['ubicacion'] =  $ubicacion[0]->denominacion;
            }
            $r->data = $datos;
			$r->cantidad = DatResultadoseleccion::cantCandidatosSeleccionados($idproceso, $filtro);
			return $r;
		} catch (Exception $e) {
            throw $e;
        }
	}
	
	public function setCandidatosSelec($arrCandResSelec, $seleccion)
	{	
		try{
            $perfil = $_SESSION['Zeolides']['perfil'];
			foreach ($arrCandResSelec as $val) {
				$obj = DatResultadoseleccion::getById($val);
				$obj->seleccion = $seleccion;
				$obj->fseleccion = ($seleccion == 1)?date('d/m/Y'):null;
                $obj->ubicacion = null;
                $obj->idusuario = $perfil['idusuario'];
				$obj->save();
			}
			return true;
		} catch (Exception $e) {
            return false;
        }
	}

    public function guardarUbicacion($ubicacion, $idresultadoseleccion)
    {
        try{
            $obj = DatResultadoseleccion::getById($idresultadoseleccion);
            $obj->ubicacion = $ubicacion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

	public function getCandidatosSeleccionadosByUbicacion($start = 0, $limit = 15, $ubicaciones, $idcargo,  $numid, $nombre, $papel, $sapel)
	{	
		try{
			$r->datos = DatResultadoseleccion::getCandidatosSeleccionadosByUbicacion($start = 0, $limit = 15, $ubicaciones, $idcargo, $numid, $nombre, $papel, $sapel);
			$r->cantidad = DatResultadoseleccion::cantCandidatosSeleccionadosByUbicacion($ubicaciones, $idcargo, $numid, $nombre, $papel, $sapel);
			return $r;
		} catch (Exception $e) {
            throw $e;
        }
	}
}
