<?php

/**
 * Modelo de negocio para gestionar las variables auxiliares de fórmula.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomVariableAuxiliarFormula, Entidad variables auxiliares de fórmulas (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomVariableAuxiliarFormulaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomVariableAuxiliarFormulaModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las variables auxiliares dado un identificador de concepto.
     * 
     * @param int $idconcepto  Identificador  del concepto.
     * @return array Listado de variables auxiliares.
     */
    public function obtenerListadoVariablesAuxiliares($idconcepto) {
		
        //Retornando el listado de variables auxiliares.
        return NomVariableAuxiliarFormula::obtenerListadoVariablesAuxiliares($idconcepto);
    }

    /**
     * Insertar una variable auxiliar.
     * 
     * @param string $denominacion     	  	Denominación de la variable auxiliar.
	 * @param int $idtipoentrada      	   	Identificador del tipo de entrada.
	 * @param int $idreporte     	   		Identificador del reporte.
	 * @param int $idvarreporte     	   	Identificador de la variable del tipo de reporte.
     * @param int $idconcepto     			Identificador de concepto.
     */
    public function adicionarVariableAuxiliarFormula($denominacion, $idtipoentrada, $idreporte, $idvarreporte, $idconcepto) {

        //Se crea el objeto de variable auxiliar.
        $objVariableAuxiliar = new NomVariableAuxiliarFormula();

        //Insertando los datos de variable auxiliar.
		$objVariableAuxiliar->denominacion = $denominacion;
		$objVariableAuxiliar->idtipoentrada = $idtipoentrada;
		$objVariableAuxiliar->idconfreportescertificaciones = ($idreporte)? $idreporte : null;
		$objVariableAuxiliar->idvariablesconfreportescertificaciones = ($idvarreporte)? $idvarreporte : null;
        $objVariableAuxiliar->idconceptopercepciondescuento = $idconcepto;

        //Guardando los datos.
        $objVariableAuxiliar->save();
    }

    /**
     * Modificar una variable auxiliar.
     * 
     * @param int $idvariableaux    		Identificador de la variable auxiliar.
     * @param string $denominacion     	  	Denominación de la variable auxiliar.
	 * @param int $idtipoentrada      	   	Identificador del tipo de entrada.
	 * @param int $idreporte     	   		Identificador del reporte.
	 * @param int $idvarreporte     	   	Identificador de la variable del tipo de reporte.
     * @param int $idconcepto     			Identificador de concepto.
     */
    public function modificarVariableAuxiliarFormula($idvariableaux, $denominacion, $idtipoentrada, $idreporte, $idvarreporte, $idconcepto) {

        //Obteniendo la variable auxiliar a modificar.
        $objVariableAuxiliar = NomVariableAuxiliarFormula::obtenerObjVariableAuxiliarDadoId($idvariableaux);

        //Modificando los datos de la variable auxiliar.
		$objVariableAuxiliar->denominacion = $denominacion;
		$objVariableAuxiliar->idtipoentrada = $idtipoentrada;
		$objVariableAuxiliar->idconfreportescertificaciones = ($idreporte)? $idreporte : null;
		$objVariableAuxiliar->idvariablesconfreportescertificaciones = ($idvarreporte)? $idvarreporte : null;
        $objVariableAuxiliar->idconceptopercepciondescuento = $idconcepto;

        //Guardando los datos.
        $objVariableAuxiliar->save();
    }

    /**
     * Eliminar una variable auxiliar.
     * 
     * @param int $idvariableaux    Identificador de la variable auxiliar.
     */
    public function eliminarVariableAuxiliarFormula($idvariableaux) {
        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomVariableAuxiliarFormula')
				->where('idvariableauxiliarformula = ?', $idvariableaux)
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
