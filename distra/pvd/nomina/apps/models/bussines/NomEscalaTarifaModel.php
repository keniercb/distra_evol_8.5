<?php

/**
 * Modelo de negocio para gestionar las escalas de tarifas de conceptos.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomEscalaTarifa, Entidad escala de tarifas de conceptos(Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomEscalaTarifaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomEscalaTarifaModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado los datos de las escalas de tarifa de concepto.
     * 
     * @param int $idconceptotarifa  Identificador de la tarifa del concepto.
	 * @param int $idpadre  		 Identificador de la tarifa del concepto.
     * @return array Listado de escalas de tarifa de concepto.
     */
    public function obtenerListadoEscalasTarifaConcepto($idconceptotarifa, $idpadre) {
	
		//Se verifica si las escalas especificadas son ra�z.
		if($idpadre){
			 $arrayVal = NomEscalaTarifa::obtenerListadoEscalasTarifaHijos($idconceptotarifa, $idpadre);

			 foreach($arrayVal as $key => $value){

				$arrayVal[$key]['_is_leaf'] = (NomEscalaTarifa::cantidadHijosEscalaTarifa($value['idescalatarifa']))?false:true;
				$arrayVal[$key]['_parent'] = $idpadre;
				$dependencias = NomDependenciaEstructuraEscalar::obtenerListadoDependenciasEstructurasEscalares($value['idestructuraescalar']);

				$arrayVal[$key]['adyacentes'] = $dependencias;
				
				if($value['tipocampo'] == '2'){
					$arrayVal[$key]['denomescala'] = $value['valorescalar'];
				}else{
					$array =  NomNomencladorReferencia::  obtenerTuplaNomenclador($value['idnomencladorreferencia'], $value['valorescalar']);
					$arrayVal[$key]['denomescala'] = $array[0]['denominacion'];
				}
				
				if(count($arrayVal[$key]['adyacentes']) == 0 && $arrayVal[$key]['_is_leaf']){
					
					if($value['idformacalculo'] == '2'){
						$rExpMat = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica(array($value['idformula']));
						$arrayVal[$key]['importeformula'] = $rExpMat[0]['expresionamostrar'];
						$arrayVal[$key]['denomformula'] = $rExpMat[0]['expresionamostrar'];
					}else if($value['idformacalculo'] == '1'){
						$arrayVal[$key]['importeformula'] = $value['importe'];
					}else{
						$arrayVal[$key]['importeformula'] = '';
					}
				}
			}
			//print_r($arrayVal);die;
			return $arrayVal;
		}else{
			
			$arrayVal = NomEscalaTarifa::obtenerListadoEscalasTarifaRaiz($idconceptotarifa);

			foreach($arrayVal as $key => $value){

				$arrayVal[$key]['_is_leaf'] = (NomEscalaTarifa::cantidadHijosEscalaTarifa($value['idescalatarifa']))?false:true;
				$arrayVal[$key]['_parent'] = null;
				$dependencias = NomDependenciaEstructuraEscalar::obtenerListadoDependenciasEstructurasEscalares($value['idestructuraescalar']);

				$arrayVal[$key]['adyacentes'] = $dependencias;
				
				if($value['tipocampo'] == '2'){
					$arrayVal[$key]['denomescala'] = $value['valorescalar'];
				}else{
					$array =  NomNomencladorReferencia::  obtenerTuplaNomenclador($value['idnomencladorreferencia'], $value['valorescalar']);
					$arrayVal[$key]['denomescala'] = $array[0]['denominacion'];
				}
				
				if(count($arrayVal[$key]['adyacentes']) == 0 && $arrayVal[$key]['_is_leaf']){
					if($value['idformacalculo'] == '2'){
						$rExpMat = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica(array($value['idformula']));
						$arrayVal[$key]['importeformula'] = $rExpMat[0]['expresionamostrar'];
						$arrayVal[$key]['denomformula'] = $rExpMat[0]['expresionamostrar'];
					}else if($value['idformacalculo'] == '1'){
						$arrayVal[$key]['importeformula'] = number_format($value['importe'], $value['lugaresdecimales'], '.', '');//$value['importe'];
					}else{
						$arrayVal[$key]['importeformula'] = '';
					}
				}
			}

			return $arrayVal;
		}
       
    }
	
	/**
     * Obtener un listado los datos de las escalas de tarifa de concepto con su campo de importe o f�rmula.
     * 
	 * @param array Listado de escalas de tarifa de concepto.
     * @return array Listado de escalas de tarifa de concepto.
     */
	public function estructurarSalidaFormula($array){
	
		foreach($array as $k => $v){
			if($v['idformacalculo'] == '2'){
				$rExpMat = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica(array($v['idformula']));
				$array[$k]['importeformula'] = $rExpMat[0]['expresionamostrar'];
				$array[$k]['denomformula'] = $rExpMat[0]['expresionamostrar'];
			}else if($v['idformacalculo'] == '1'){
				$array[$k]['importeformula'] = $v['importe'];
			}else{
				$array[$k]['importeformula'] = '';
			}
		}
		return $array;
	}
	
    /**
     * Insertar una escala.
     * 
	 * @param int $idoperadorcomparacion      	Identificador del operador de comparaci�n.
	 * @param int $valorinicial     			Valor inicial de comparaci�n.
	 * @param int $valorfinal    	   			Valor final de comparaci�n.
     * @param int $idformacalculo     			Identificador de la forma de c�lculo.
	 * @param int $importe     					Importe de la forma de c�lculo.
	 * @param int $idformula     				Identificador de la f�rmula.
	 * @param int $idconceptotarifa     		Identificador de la tarifa de concepto.
	 * @param int $idestructuraescalar     		Identificador de la estructura escalar.
	 * @param string $valorescalar     	  		Valor de la estructura escalar.
	 * @param int $idpadre     	  				Identifificador del padre.
     */
    public function adicionarEscalaTarifa($idoperadorcomparacion, $valorinicial, $valorfinal, $idformacalculo, $importe, $idformula, $idconceptotarifa, $idestructuraescalar, $valorescalar, $idpadre) {

        //Se crea el objeto de escala tarifa.
        $objEscTarif = new NomEscalaTarifa();

        //Insertando los datos de la escala tarifa.
		$objEscTarif->idoperadorcomparacion = ($idoperadorcomparacion)? $idoperadorcomparacion : null;
		$objEscTarif->valorinicial = ($valorinicial)? $valorinicial : null;
		$objEscTarif->valorfinal = ($valorfinal)? $valorfinal : null;
		$objEscTarif->idformacalculo = ($idformacalculo)? $idformacalculo : null;
		$objEscTarif->importe = ($importe)? $importe : null;
		$objEscTarif->idformula = ($idformula)? $idformula : null;
		$objEscTarif->idconceptopdtarifa = $idconceptotarifa;
        $objEscTarif->idestructuraescalar = $idestructuraescalar;
		$objEscTarif->valorescalar = $valorescalar;
		$objEscTarif->idpadre = ($idpadre)? $idpadre : null;

        //Guardando los datos.
        $objEscTarif->save();
    }

    /**
     * Modificar una escala de tarifa.
     * 
     * @param int $idescala   					Identificador de la escala.
     * @param int $idoperadorcomparacion      	Identificador del operador de comparaci�n.
	 * @param int $valorinicial     			Valor inicial de comparaci�n.
	 * @param int $valorfinal    	   			Valor final de comparaci�n.
     * @param int $idformacalculo     			Identificador de la forma de c�lculo.
	 * @param int $importe     					Importe de la forma de c�lculo.
	 * @param int $idformula     				Identificador de la f�rmula.
	 * @param int $idconceptotarifa     		Identificador de la tarifa de concepto.
	 * @param int $idestructuraescalar     		Identificador de la estructura escalar.
	 * @param string $valorescalar     	  		Valor de la estructura escalar.
	 * @param int $idpadre     	  				Identifificador del padre.
     */
    public function modificarEscalaTarifa($idescala, $idoperadorcomparacion, $valorinicial, $valorfinal, $idformacalculo, $importe, $idformula, $idconceptotarifa, $idestructuraescalar, $valorescalar) {

        //Obteniendo el objeto de escala tarifa.
        $objEscTarif = NomEscalaTarifa::obtenerObjEscalaTarifaDadoId($idescala);

        //Insertando los datos de la escala tarifa.
		$objEscTarif->idoperadorcomparacion = ($idoperadorcomparacion)? $idoperadorcomparacion : null;
		$objEscTarif->valorinicial = ($valorinicial)? $valorinicial : null;
		$objEscTarif->valorfinal = ($valorfinal)? $valorfinal : null;
		$objEscTarif->idformacalculo = ($idformacalculo)? $idformacalculo : null;
		$objEscTarif->importe = ($importe)? $importe : null;
		$objEscTarif->idformula = ($idformula)? $idformula : null;
		$objEscTarif->idconceptopdtarifa = $idconceptotarifa;
        $objEscTarif->idestructuraescalar = $idestructuraescalar;
		$objEscTarif->valorescalar = $valorescalar;

        //Guardando los datos.
        $objEscTarif->save();
    }

    /**
     * Eliminar una escala de tarifa.
     * 
     * @param int $idescala    Identificador de la escala.
     */
    public function eliminarEscalaTarifa($idescala) {
		try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomEscalaTarifa')
				->where('idescalatarifa = ?', $idescala)
				->execute();
			return $r;
		}
        catch (Exception $e){
            if($e->getCode() == 23503){//Code for foreignKeyViolation
                return 2;
            }else{
                return 1;
            }
        }
    }
}
