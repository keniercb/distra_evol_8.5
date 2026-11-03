<?php

/**
 * Modelo de negocio para gestionar las tarifas de conceptos.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomConceptoPDTarifa, Entidad tarifas de conceptos (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomConceptoPDTarifaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomConceptoPDTarifaModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las tarifas dado un identificador del concepto.
     * 
     * @param int $idconceptopd  Identificador del concepto de percepci�n descuento.
     * @return array Listado de tarifas de conceptos.
     */
    public function obtenerListadoTarifaConcepto($idconceptopd) {
		//Retornando el listado de tarifas de conceptos.
	    $arrayReslt = NomConceptoPDTarifa::obtenerListadoTarifaConcepto($idconceptopd);
		foreach($arrayReslt as $k => &$v){
            $v['importe'] = number_format($v['importe'],$v['lugaresdecimales']);
			if($v['idformacalculo'] == '2'){
				if($v['idformula']){
					$rExpMat = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica(array($v['idformula']));
					if(count($rExpMat) > 0){
						$arrayReslt[$k]['importeformula'] = $rExpMat[0]['expresionamostrar'];
						$arrayReslt[$k]['denomformula'] = $rExpMat[0]['expresionamostrar'];
					}else{
						$arrayReslt[$k]['importeformula'] = '';
						$arrayReslt[$k]['denomformula'] = '';
					}
				}
			}else if($v['idformacalculo'] == '1'){
				$arrayReslt[$k]['importeformula'] = $v['importe'];
			}else{
				$arrayReslt[$k]['importeformula'] = '';
			}
		}
		return $arrayReslt;
    }

    /**
     * Insertar una tarifa de concepto.
     * 
     * @param int $idtarifa     	   Identificador de la tarifa.
	 * @param int $idformacalculo       Identificador de la forma de c�lculo.
	 * @param int $idformula     	   Identificador de la f�rmula.
	 * @param float $importe     	   Importe fijo por esa tarifa.
     * @param int $idconceptopd        Identificador del concepto de percepci�n o descuento.
     */
    public function adicionarTarifaConcepto($idtarifa, $idformacalculo, $idformula, $importe, $lugaresdecimales, $idconceptopd) {

        //Se crea el objeto de tarifa de concepto.
        $objTarifaConcepto = new NomConceptoPDTarifa();

        //Insertando los datos de la tarifa de concepto.
		$objTarifaConcepto->idtarifa = $idtarifa;
		$objTarifaConcepto->idformacalculo = $idformacalculo;
		$objTarifaConcepto->idformula = ($idformula)? $idformula : null;
		$objTarifaConcepto->importe = ($importe)? $importe : null;
		$objTarifaConcepto->lugaresdecimales = ($lugaresdecimales)? $lugaresdecimales : null;
        $objTarifaConcepto->idconceptopercepciondescuento = $idconceptopd;

        //Guardando los datos.
        $objTarifaConcepto->save();
    }

    /**
     * Modificar una tarifa de concepto.
     * 
     * @param int $idconceptotarifa    Identificador de la tarifa de concepto.
     * @param int $idtarifa     	   Identificador de la tarifa.
	 * @param int $idformacalculo       Identificador de la forma de c�lculo.
	 * @param int $idformula     	   Identificador de la f�rmula.
	 * @param float $importe     	   Importe fijo por esa tarifa.
     * @param int $idconceptopd        Identificador del concepto de percepci�n o descuento.
     */
    public function modificarTarifaConcepto($idconceptotarifa, $idtarifa, $idformacalculo, $idformula, $importe, $lugaresdecimales, $idconceptopd) {

        //Obteniendo la tarifa de concepto a modificar.
        $objTarifaConcepto = NomConceptoPDTarifa::obtenerObjTarifaConceptoDadoId($idconceptotarifa);

        //Modificando los datos de la tarifa de concepto.
		$objTarifaConcepto->idtarifa = $idtarifa;
		$objTarifaConcepto->idformacalculo = $idformacalculo;
		$objTarifaConcepto->idformula = ($idformula)? $idformula : null;
		$objTarifaConcepto->importe = ($importe)? $importe : null;
		$objTarifaConcepto->lugaresdecimales = ($lugaresdecimales)? $lugaresdecimales : null;
        $objTarifaConcepto->idconceptopercepciondescuento = $idconceptopd;

        //Guardando los datos.
        $objTarifaConcepto->save();
    }

    /**
     * Eliminar una tarifa de concepto.
     * 
     * @param int $idconceptotarifa    Identificador de la tarifa de concepto.
     */
    public function eliminarTarifaConcepto($idconceptotarifa) {
        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomConceptoPDTarifa')
				->where('idconceptopdtarifa = ?', $idconceptotarifa)
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
