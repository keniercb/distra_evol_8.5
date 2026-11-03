<?php

class DatTipoinversionprogramaModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function obtenerArrayIdDatosGrupoNom($param,$cargaDesdeGrid) {
//pre_r($param);
//pre_r($cargaDesdeGrid);die;
        $datos = DatTipoinversionprograma::getArrayIdDatosGrupo($param, null, $cargaDesdeGrid);
        return $datos;
    }
    public function adicionarNomenclador($iddatos, $idnomenclador) {
        $nomenclador = NomNomenclador::buscarNomenclador($idnomenclador);
        foreach ($iddatos as $key => $val) {
            $existe = NomNomenclador::getNomenclador($nomenclador, $val);
            if (isset($existe[0])){
                return false;
            } else {
                NomNomenclador::adicionarNomenclador($nomenclador, $val);
            }
        }

//		if($nomenclador[0]['tabla']=='dat_tipoinversionprograma'){
//			foreach ($iddatos as $key => $val) {
//				$esxiste = DatTipoinversionprograma::getNomenclador($val);
//				if($esxiste[0] !=""){
//					$datos = array();
//					 return false;
//				}else{
//					$datos = DatTipoinversionprograma::adicionarNomenclador($val,$idnomenclador);
//				}
//			  
//			}
//		} else if($nomenclador[0]['tabla']=='dat_formapropiedad'){
//			$esxiste = DatFormapropiedad::getNomenclador($val);
//			foreach ($iddatos as $key => $val) {
//				if($esxiste[0]!=""){
//					$datos = array();
//					 return $datos;
//				}else{
//					$datos = DatFormapropiedad::adicionarNomenclador($val,$idnomenclador);
//				}
//			}
//		} else if($nomenclador[0]['tabla']=='dat_caracteristica'){
//			$esxiste = DatCaracteristica::getNomenclador($val);
//			foreach ($iddatos as $key => $val) {
//				if($esxiste[0]!=""){
//					$datos = array();
//					 return $datos;
//				}else{
//					$datos = DatCaracteristica::adicionarNomenclador($val,$idnomenclador);
//				}
//			}
//		} else if($nomenclador[0]['tabla']=='dat_estado'){
//			$esxiste = DatEstado::getNomenclador($val);
//			foreach ($iddatos as $key => $val) {
//				if($esxiste[0]!=""){
//					$datos = array();
//					 return $datos;
//				}else{
//					$datos = DatEstado::adicionarNomenclador($val,$idnomenclador);
//				}
//			}
//		} else if($nomenclador[0]['tabla']=='dat_objetivo'){
//			$esxiste = DatObjetivo::getNomenclador($val);
//			foreach ($iddatos as $key => $val) {
//				if($esxiste[0]!=""){
//					$datos = array();
//					 return $datos;
//				}else{
//					$datos = DatObjetivo::adicionarNomenclador($val,$idnomenclador);
//				}
//			}
//		} else if($nomenclador[0]['tabla']=='dat_estadoce'){
//			$esxiste = DatEstadoce::getNomenclador($val);
//			foreach ($iddatos as $key => $val) {
//				if($esxiste[0]!=""){
//					$datos = array();
//					 return $datos;
//				}else{
//					 $datos = DatEstadoce::adicionarNomenclador($val,$idnomenclador);
//				}
//			 
//			}
//		} else if($nomenclador[0]['tabla']=='dat_efectocomercial'){
//			$esxiste = DatEfectocomercial::getNomenclador($val);
//			foreach ($iddatos as $key => $val) {
//				if($esxiste[0]!=""){
//					$datos = array();
//					 return $datos;
//				}else{
//					 $datos = DatEfectocomercial::adicionarNomenclador($val,$idnomenclador);
//				}
//			 
//			}
//		}  else if($nomenclador[0]['tabla']=='dat_tipofinanciamiento'){
//			$esxiste = DatTipofinanciamiento::getNomenclador($val);
//			foreach ($iddatos as $key => $val) {
//				if($esxiste[0]!=""){
//					$datos = array();
//					 return $datos;
//				}else{
//					 $datos = DatTipofinanciamiento::adicionarNomenclador($val,$idnomenclador);
//				}
//			 
//			}
//		}  else if($nomenclador[0]['tabla']=='dat_financista'){
//			$esxiste = DatFinancista::getNomenclador($val);
//			foreach ($iddatos as $key => $val) {
//				if($esxiste[0]!=""){
//					$datos = array();
//					 return $datos;
//				}else{
//					 $datos = DatFinancista::adicionarNomenclador($val,$idnomenclador);
//				}
//			 
//			}
//		} 

        return true;
    }
	
	public function eliminarNomenclador($iddatonomenclador,$idnomenclador) {
		$nomenclador =  NomNomenclador::buscarNomenclador($idnomenclador);
                NomNomenclador::eliminarNomenclador($iddatonomenclador, $nomenclador);
//		if($nomenclador[0]['tabla']=='dat_tipoinversionprograma'){
//			$datos = DatTipoinversionprograma::eliminarNomenclador($iddatonomenclador,$idnomenclador);
//		} else if($nomenclador[0]['tabla']=='dat_formapropiedad'){
//			$datos = DatFormapropiedad::eliminarNomenclador($iddatonomenclador,$idnomenclador);
//		} else if($nomenclador[0]['tabla']=='dat_caracteristica'){
//			$datos = DatCaracteristica::eliminarNomenclador($iddatonomenclador,$idnomenclador);
//		} else if($nomenclador[0]['tabla']=='dat_estado'){
//			$datos = DatEstado::eliminarNomenclador($iddatonomenclador,$idnomenclador);
//		} else if($nomenclador[0]['tabla']=='dat_objetivo'){
//			$datos = DatObjetivo::eliminarNomenclador($iddatonomenclador,$idnomenclador);
//		} else if($nomenclador[0]['tabla']=='dat_estadoce'){
//			$datos = DatEstadoce::eliminarNomenclador($iddatonomenclador,$idnomenclador);
//		} 
        return true;
//        return $datos;
    }
    
   
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}
