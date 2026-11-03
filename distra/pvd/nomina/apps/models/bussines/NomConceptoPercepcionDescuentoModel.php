<?php

/**
 * Modelo de negocio para gestionar los conceptos de percepción y descuentos.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomConceptoPercepcionDescuento, Entidad concepto de percepción y descuento (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomConceptoPercepcionDescuentoModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomConceptoPercepcionDescuentoModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los conceptos.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de conceptos de percepciones y descuentos.
     */
    public function obtenerListadoConceptosPD($inicio = 0, $limite = 10, $criterio = null) {
        //Retornando el listado de conceptos de percepciones y descuentos.
        return NomConceptoPercepcionDescuento::obtenerListadoConceptosPD1($inicio, $limite, $criterio);
    }
    
    public function obtenerListadoTodosConceptosPD() {
        
        //Retornando el listado de conceptos de percepciones y descuentos.
        //return NomConceptoPercepcionDescuento::obtenerListadoTodosConceptosPD();
        return NomConceptoPercepcionDescuento::obtenerListadoSoloConceptosPDEscalaValores();
    }
    public function obtenerListadoTodosConceptosPDESP($idsituacionlaboral) {

        //Retornando el listado de conceptos de percepciones y descuentos.
        $datos = NomConceptoPercepcionDescuento::obtenerListadoTodosConceptosPDESP($idsituacionlaboral);

        if(count($datos) == 0){
            return NomConceptoPercepcionDescuento::obtenerListadoTodosConceptos();
        }else{
            return $datos;
        }

    }
    public function obtenerConceptosPD($idconcepto) {

        //Retornando el listado de conceptos de percepciones y descuentos.
        return NomConceptoPercepcionDescuento::obtenerConceptosPD($idconcepto);
    }

    /**
     * Obtener la cantidad total de conceptos.
     *
     * @return int Cantidad total de conceptos de percepciones y descuentos.
     */
    public function obtenerCantidadTotalConceptosPD($criterio = null) {

        //Retornando la cantidad total de conceptos de percepciones y descuentos.
        return NomConceptoPercepcionDescuento::obtenerCantidadTotalConceptosPD($criterio);
    }

    /**
     * Obtener el arreglo de tipos de conceptos.
     *
     * @return array Listado de tipos de conceptos.
     */
    public function obtenerArregloTiposConceptosPD() {

        //Retornando el listado de tipos de conceptos.
        return NomTipoConceptoPD::obtenerTodosTiposConceptosPD();
    }
	
	/**
     * Obtener el arreglo de formas de cálculo.
     *
     * @return array Listado de formas de cálculo.
     */
    public function obtenerArregloFormasCalculo($tipo) {

        if($tipo == 'tarifa'){

            //Retornando el listado de formas de cálculo.
            return NomFormaCalculo::obtenerFormasCalculoDadoArrayIds(array(1, 2, 3));
        }else{
            
            //Retornando el listado de formas de cálculo.
            return NomFormaCalculo::obtenerFormasCalculoDadoArrayIds(array(1, 2));
        }
    }

    /**
     * Obtener el arreglo de formas de entrada.
     *
     * @param string $tipo          Tipo de formas de entrada a cargar.
     *
     * @return array Listado de formas de entrada.
     */
    public function obtenerArregloFormasEntrada($tipo) {

        if($tipo == 'varaux'){

            //Retornando el listado de formas de entrada.
            return NomTipoEntrada::obtenerTiposEntradaDadoArrayIds(array(1, 2));
        }else{
            
            //Retornando el listado de formas de entrada.
            return NomTipoEntrada::obtenerTiposEntradaDadoArrayIds(array(1, 3, 4));
        }
    }

    /**
     * Obtener el arreglo de tipos de campo.
     *
     * @return array Listado de tipos de campos.
     */
    public function obtenerArregloTiposCampos() {

        //Retornando el listado de tipos de campo.
        return NomTipoCampo::obtenerTodosTiposCampo();
    }

    /**
     * Obtener el arreglo de nomencladores de referencia.
     *
     * @return array Listado de nomencladores de referencia.
     */
    public function obtenerArregloNomencladores() {

        //Retornando el listado de nomencladores de referencia.
        return NomNomencladorReferencia::obtenerTodosNomencladoresReferencia();
    }

    /**
     * Obtener el arreglo de operadores de comparación.
     *
     * @return array Listado de operadores de comparación.
     */
    public function obtenerArregloOperadoresComparacion() {

        //Retornando el listado de operadores de comparación.
        return NomOperadorComparacion::obtenerTodosOperadoresComparacion();
    }

    /**
     * Obtener el arreglo de valores del nomenclador de refenrencia especificado.
     *
     * @param int $idnomenclador   Identificador del nomenclador.
     *
     * @return array Listado de valores del nomenclador de refenrencia.
     */
    public function obtenerArregloValoresNomencladorReferencia($idnomenclador) {

        //Retornando el listado de valores del nomenclador de refenrencia.
        return NomNomencladorReferencia::ObtenerDatosNomenclador($idnomenclador, 1);
    }

    /**
     * Insertar un concepto de percepción y descuento.
     * 
     * @param string $abrev         Abreviatura del concepto.
     * @param string $denom         Denominacion del concepto.
     * @param string $finicio       Fecha de inicio de creacion del concepto.
     * @param string $ffin          Fecha de fin de uso del concepto.
     * @param string $descrip       Descripcion del concepto.
     * @param int $idtipoconcepto   Identificador del tipo concepto.
     */
    public function adicionarConceptoPercepcionDescuento($abrev, $denom,$esdescuento, $idformula,
                                                         $finicio, $ffin, $descrip, $idtipoconcepto) {

        //Se crea el objeto del concepto de percepción y descuento.
        $objConcepto = new NomConceptoPercepcionDescuento();
//      print_r(!$objConcepto->existeAbreviaturaConcepto($abrev));die;
      if(!$objConcepto->existeDenominacionConcepto($denom)
        &&!$objConcepto->existeAbreviaturaConcepto($abrev)){

        //Insertando los datos del concepto de percepción y descuento.
        $objConcepto->abreviatura = $abrev;
        $objConcepto->denominacion = $denom;
        $fecha=split('/',$finicio);
        $objConcepto->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);
        $objConcepto->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objConcepto->descripcion = $descrip;
        $objConcepto->idtipoconceptopd = $idtipoconcepto;
       //$esdescuento1=($esdescuento)?1:0;

        $objConcepto->esdescuentoaplicarunaves = $esdescuento;
        $objConcepto->formulaaplicardescuentounaves = $idformula;

        //Guardando los datos.
        $objConcepto->save();
        return 1;
      }else{

        return 0;
      }


    }

    /**
     * Modificar un concepto de percepción y descuento.
     *  
     * @param int $idconcepto       Identificador del sector salarial.
     * @param string $abrev         Abreviatura del concepto.
     * @param string $denom         Denominacion del concepto.
     * @param string $finicio       Fecha de inicio de creacion del concepto.
     * @param string $ffin          Fecha de fin de uso del concepto.
     * @param string $descrip       Descripcion del concepto.
     * @param int $idtipoconcepto   Identificador del tipo concepto.
     */
    public function modificarConceptoPercepcionDescuento($idconcepto, $abrev, $denom,$esdescuento, $idformula, $finicio, $ffin, $descrip, $idtipoconcepto ) {

        //Obteniendo el concepto de percepción y descuento a modificar.
        $objConcepto = NomConceptoPercepcionDescuento::obtenerObjConceptoDadoId($idconcepto);
     //print_r($objConcepto);die;
      if(!$objConcepto->existeDenominacionConcepto($denom,$idconcepto)
        &&!$objConcepto->existeAbreviaturaConcepto($abrev,$idconcepto)){
        //Modificando los datos del concepto de percepción y descuento.
        $objConcepto->abreviatura = $abrev;
        $objConcepto->denominacion = $denom;
        $fecha=split('/',$finicio); 
        $objConcepto->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objConcepto->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objConcepto->descripcion = $descrip;
        $objConcepto->idtipoconceptopd = $idtipoconcepto;

        $objConcepto->esdescuentoaplicarunaves = $esdescuento;
        $objConcepto->formulaaplicardescuentounaves = $idformula;

        //Guardando los datos.
        $objConcepto->save();
        return 1;
      }else{
        return 0;
      }
    }

    /**
     * Eliminar un concepto de percepción y descuento.
     * 
     * @param int $idconcepto    Identificador del concepto de percepción y descuento.
     */
    public function eliminarConceptoPercepcionDescuento($idconcepto) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomConceptoPercepcionDescuento')
				->where('idconceptopercepciondescuento = ?', $idconcepto)
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
