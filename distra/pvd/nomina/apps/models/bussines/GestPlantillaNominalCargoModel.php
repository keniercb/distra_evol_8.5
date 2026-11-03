<?php

/**
 * Modelo de negocio para gestionar los cargos de plantillas nominales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses ConfPlantillaNominalCargo, Entidad cargo plantilla nominal (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class GestPlantillaNominalCargoModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function GestPlantillaNominalCargoModel() {
        parent::ZendExt_Model();
    }
	
	/**
     * Obtener la estructura de plantillas nominales dado un identificador de plantilla.
     * 
     * @param int $idplantilla  	Identificador de la plantilla nominal.
     * @param bool $cheked  		Mostrar los nodos para chequear.
     * @return array Estructura de plantillas nominales.
     */
    public function obtenerEstructuraPlantillaNominal($idplantilla, $chek) {
		
		//Se obtienen los cargos de la plantilla especificada.
		$arrayCargos = ConfPlantillaNominalCargo::obtenerCargosByIdPlantilla($idplantilla);
		$arrArbol = array();
		
		if(count($arrayCargos) > 0){
		    //Se obtienen los �conos de la aplicaci�n.
			$arriconos = $this->integrator->metadatos->obtenerConceptos();
			
			//Arreglo auxiliar con los cargos que contiene esa plantilla.
			$arrayAux = array();
			foreach($arrayCargos as $valor=>$value){
				$arrayAux[]=$value['idcargo'];
			}
			$arrCaminosCargos = $this->integrator->metadatos->getRutaEstructura($arrayAux);
			//print_r($arrCaminosCargos);die;
			$rcaminos = array();
			$contrcaminos = 0;
			foreach($arrCaminosCargos as $cc=>$rcam){
			  $rid = explode('/', $arrCaminosCargos[$cc]['rutaId']);
			  $rtext = explode('/', $rcam['rutaDenominacion']);
			  foreach($rtext as $t=>$text){
			    $rcaminos[$contrcaminos]['idfila'] = $rid[$t];
				if($t==0){
				$rcaminos[$contrcaminos]['idpadre'] = $rcaminos[$contrcaminos]['idfila'];
				}else{
				$rcaminos[$contrcaminos]['idpadre'] = $rid[$t-1];
				}
				$estruc = $this->integrator->metadatos->DameEstructura($rid[$t]);
				//print_r($estruc);die;
				$rcaminos[$contrcaminos]['idnomeav'] = $estruc[0]->idtipo;
				$rcaminos[$contrcaminos]['denominacion'] = $text;
			    $contrcaminos++;
			  }
			}
			for($i=0; $i<count($rcaminos); $i++){
              for($j=$i+1; $j<count($rcaminos); $j++){
		        if($rcaminos[$i]['idfila'] == $rcaminos[$j]['idfila']){
		         unset($rcaminos[$j]);
		         $rcaminos = array_values($rcaminos);
		        }
		    }
			}
			if(count($rcaminos) > 0){
			   
			    foreach($rcaminos as $i => $nodo){
					if($nodo['idfila'] == $nodo['idpadre']){
						$n = $this->conformarNodo($nodo, $arriconos, $chek);
						$n['children'] = $this->conformarArbolRecursivo($rcaminos, $nodo, $arriconos, $chek);
						$n['expanded'] = true;
						$arrArbol[] = $n;
					}
				}   
			}
		}
		//print_r($arrArbol);die;
		return $arrArbol;		
    }
	
	/**
	 * Funci�n auxiliar para conformar los nodos del �rbol.
	 *
	 * @param array nodo    	Datos del cargo.
	 * @param array arriconos 	Datos de los �conos de la aplicaci�n.
	 *
	 * @return array Nodo.
	 */
	private function conformarNodo($nodo, $arriconos, $chek){
	       
	        $icono = $nodo['idnomeav'];
			foreach($arriconos as $key=>$value){
				if($value['idconcepto']==$icono)
				    $icono = $value['icon'];
			}
			$arr = array();
			$arr['id']     = $nodo['idfila'];
			$arr['text']   = $nodo['denominacion'];
			$arr['tipoestructura'] = $nodo['idnomeav'];
			$arr['icon'] = $icono;
			//$arr['icon'] = $nodo['icon'];
			if($nodo['idnomeav'] == 7)
				$arr['leaf'] = true;
			else $arr['leaf'] = false;
			if($chek){
				$arr['checked'] = false;
			}
            $arr['qtip'] ='<b>'.$nodo['denominacion'].'</b>';
		return $arr;
	}
	
	/**
	 * Funci�n auxiliar para conformar el �rbol de manera recursiva.
	 *
	 * @param array arrCaminos  Todos los cargos.
	 * @param array nodo    	Datos del cargo.
	 * @param array arriconos 	Datos de los �conos de la aplicaci�n.
	 *
	 * @return array Nodo.
	 */
	private function conformarArbolRecursivo($arrCaminos, $nodo, $arriconos, $chek){
		    if($nodo['idnomeav'] == 7)
			  return;
			$arrHijos = $this->buscarHijos($arrCaminos, $nodo['idfila']);
			
			$arrArbol = array();
			foreach($arrHijos as $k => &$v){
				$n = $this->conformarNodo($v, $arriconos, $chek);
				$n['children'] = $this->conformarArbolRecursivo($arrCaminos, $v, $arriconos, $chek);
				$n['expanded'] = true;
				$arrArbol[] = $n;
				$i++;
			}
			return $arrArbol;
	}
	
	/**
	 * Funci�n auxiliar para obtener los hijos dado un id del padre.
	 *
	 * @param array arrCaminos  	Todos los cargos.
	 * @param int idpadre    		Datos del cargo.
	 *
	 * @return array Arreglo de hijos.
	 */
	private function buscarHijos($arrCaminos, $idpadre){
		$arr = array();
		foreach($arrCaminos as $k => $v){
		   if($v['idpadre'] == $idpadre && $v['idfila'] != $idpadre){
				$arr[] = $v;
		   }
		  
		}
		
		return $arr;
	}
	
	/**
     * Obtener la estructura restante de estructura y composici�n.
     * 
	 * @param int $identidad  		Identificador de la entidad.
     * @return array Estructura restantes.
     */
	public function obtenerEstructuraRestantes($identidad, $nodo){
		 
		//Se obtiene el arreglo de iconos.
		//$arriconos = $this->integrator->metadatos->BuscartodosnomencladoresEAV();
		
		$arrArbol = array();
		
		if($nodo == 'root'){
		    
			$arrayEstru=$this->integrator->metadatos->DameEstructura($identidad);
		    //print_r($arrayEstru);die;
			if($arrayEstru[0]->idnomeav!=''){
				$icon=$this->buscarIcono($arriconos,$arrayEstru[0]->idnomeav);
				$icono = '/metadatos/comun/recursos/iconos/'.$icon.'.gif';
			}
			$arrArbol[0]['id']   = $arrayEstru[0]->idestructura;
			$arrArbol[0]['text']   = $arrayEstru[0]->denominacion;
			$arrArbol[0]['tipoestructura'] = $arrayEstru[0]->idnomeav;
			$arrArbol[0]['icon'] = $arrayEstru[0]->icon;			
			if($arrayEstru[0]->idnomeav == 4 || $arrayEstru[0]->idnomeav == 5){
				$arrArbol[0]['checked'] = false;
				$arrArbol[0]['leaf'] = true;
			}else{
				$arrArbol[0]['leaf'] = false;
			}
			//$arrArbol[0]['qtip'] ='<b>'.$arrayEstru[0]->text.'</b>';
		}else{
			$arrayCargos = ConfPlantillaNominalCargo::obtenerCargosRegistradorByIdEstruc($identidad);
			$arrayAux = array();

			foreach ($arrayCargos as $key => $value) {
				$arrayAux[] = $value['idcargo'];
			}

			$hijosest = $this->integrator->metadatos->DameHijosEstructura($nodo);
			$lug=0;
			
			foreach($hijosest as $x=>$y){
				$exit = in_array ( $y->id, $arrayAux);
				$expicono = explode('=',$y->icon);
				$icono = '';
				if(count($expicono) > 1){
				  $icono = '/metadatos/comun/recursos/iconos/'.$expicono[1].'.gif';
				}
				//print_r($y->idconcepto);die;
				$arrArbol[$lug]['id']=$y->id;
				$arrArbol[$lug]['text']   = $y->text;
				$arrArbol[$lug]['tipoestructura'] = $y->idconcepto;
				$arrArbol[$lug]['icon'] =  $y->icon;
				if($y->idconcepto == 7){
					if(!$exit){
						$arrArbol[$lug]['checked'] = false;
						$arrArbol[$lug]['text']   = '<font style="color:green; font-weight:bold;">'.$y->text.'</font>';
					}else{
						$sql = "SELECT cpn.denominacion
								FROM mod_nomina.conf_plantillanominal cpn 
								inner join  mod_nomina.conf_plantillanominalcargo cpnc using (idplantillanominal)
								where cpnc.idcargo = ? and cpn.fechafin is null";
							$mg = Doctrine_Manager::getInstance();
							$conn = $mg->getCurrentConnection();
							$r = $conn->fetchOne($sql, array($y->id));

						$arrArbol[$lug]['text']   = $y->text .' (usados en: <font style="color:red; font-weight:bold;">'. $r .'</font>)';
					}
					$arrArbol[$lug]['leaf'] = true;
				}else {
					$arrArbol[$lug]['leaf'] = false;
				}
				//$arrArbol[$lug]['qtip'] ='<b>'.$y->text.'</b>';
				$lug++;
				
			}
		}
		
		return $arrArbol;
	}	
	
	/**
	 * Funci�n utilizada para buscar un icno de una estructura.
	 *
	 * @param $arr		Array de iconos.
	 * @param $id 		Identificador del icono.
	 *
	 * return stirn Icono
	 */
	private function buscarIcono($arr, $id){
	   foreach($arr as $i => $v){
	     if($v['idnomeav'] == $id) return $v['icono'];
	   }
	   return 'No conocido';
	}	
	
	/**
     * Insertar una estructura de plantilla nominal.
     * 
     * @param int $idplantilla     	Identificador de la plantilla nominal.
	 * @param int $identidad    	Identificador de la plantilla nominal.
	 * @param int $arrayCargos    	Arreglo de cargos.
     */
    public function adicionarEstructuraPlantillaNominal($idplantilla, $identidad, $arrayCargos ){
		//Se obtiene los cargos por estructura.
		//$estruccargos=$this->integrator->metadatos->BuscarCargosXIdestructuraSinDominio($identidad);

		/*$arrayCargosEstruc=array();
		foreach($estruccargos as $e=>$value){
			$arrayCargosEstruc[$e]=$value['idcargo'];
		}

		//Se obtienen los cargos seleccionados
		foreach($arrayCargos as $v){
			$aux=array();
			$todosaux=$this->integrator->metadatos->BuscarCargosXIdestructuraSinDominio($v);
			foreach($todosaux as $t=>$val){
				$aux[$t]=$val['idcargo'];
			}
			$arrayCargosEstruc = array_diff($arrayCargosEstruc,$aux); 
		}*/
		
		//Se obtienen los cargos registrados en las plantillas de esa entidad, para verificar que no se repitan
		$arrayCargosReg = ConfPlantillaNominalCargo::obtenerCargosRegistradorByIdEstruc($identidad);

		$arrayCargosEstruc = array();
		//Se verifican los que se van a insertar con los registrados.
		foreach($arrayCargos as $i => $c){
			$encontrado = 2;
			foreach($arrayCargosReg as $j => $cr){
				if($c == $cr){
					$encontrado = 1;
					break;
				}
			}
			if($encontrado == 2){
				$arrayCargosEstruc[] = $c;
			}
		}


		foreach($arrayCargosEstruc as $k => $c){
			//Se crea el objeto de la estruc plantilla nominal.
			$objEsctPlantillaN = new ConfPlantillaNominalCargo();
			//Insertando los datos de la  estructura plantilla nominal.
			$objEsctPlantillaN->idcargo = $c;
			$objEsctPlantillaN->idplantillanominal = $idplantilla;
			//Guardando los datos.
			$objEsctPlantillaN->save();
		}
	}
		

	/**
     * Eliminar una estructura de plantilla nominal.
     * 
     * @param int $idplantilla     	Identificador de la plantilla nominal.
	 * @param int $arrayCargos    	Arreglo de cargos.
     */
    public function eliminarEstructuraPlantillaNominal($idplantilla, $arrayCargos){
        
    	ConfPlantillaNominalCargo::eliminarArrayCargos($idplantilla, $arrayCargos);
    	
    }



















	

    /**
     * Eliminar una plantilla nominal.
     * 
     * @param int $idplantilla    Identificador de la plantilla nominal.
     */
    public function eliminarPlantillaNominal($idplantilla) {
		
        //Obteniendo la plantilla nominal a modificar.
        $objPlantillaN = ConfPlantillaNominal::obtenerObjPlantillaNominalDadoId($idplantilla);

        //Borrando la plantilla nominal.
        $objPlantillaN->delete();
    }
	
	public function getCargos($identidad,$areas){
		$cont=0;
		$arrayCargos=array();
		foreach($areas as $k=>$v){
			$Cargos =ConfPlantillaNominalCargo::getCargos($identidad,$v);
			if(count($Cargos)>0){
				array_push($arrayCargos, $Cargos);
				
			}
		}
		$contp=0;
		$arrayidpersona=array();
		//print_r($arrayCargos);die;
		foreach($arrayCargos as $s=>$q){
			foreach($q as $w=>$d){
				$idpersona = DatCargosOcupados::getIdpersonas($d['idcargo'],$identidad);
				if(count($idpersona)>0){
					$arrayidpersona[$contp]['idpersona']=$idpersona[0]['idpersona'];
					$arrayidpersona[$contp]['idarea']=$d['idarea'];
					$arrayidpersona[$contp]['area']=$d['area'];
					$contp++;
				}
			}
			/*$idpersona = DatCargosOcupados::getIdpersonas($q['idcargo'],$identidad);*/
			
		}
		//print_r($arrayidpersona);die;
		return $arrayidpersona;
	
	}
}
