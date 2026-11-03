<?php

/**
 * Modelo de negocio para gestionar las estructuras escalares.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomEstructuraEscalar, Entidad estructura escalar(Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomEstructuraEscalarModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomEstructuraEscalarModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las estructuras escalares dado un identificador de la tarifa de concepto.
     * 
     * @param int $idconceptotarifa  Identificador de la tarifa del concepto.
     * @return array Listado de estructuras escalares
     */
    public function obtenerListadoEstructurasEscalares($idconceptotarifa) {
		
        //Retornando el listado de estructuras escalares.
        return NomEstructuraEscalar::obtenerListadoEstructurasEscalares($idconceptotarifa);
    }

    /**
     * Insertar una estructura escalar.
     * 
     * @param string $denominacion     	  		Denominaci�n de la estructura escalar.
	 * @param int $idtipocampo      	   		Identificador del tipo de campo.
	 * @param int $idnomenclador     			Identificador del nomenclador de referencia.
	 * @param int $nivel     	   				Nivel de la estructura escalar.
     * @param int $idtipoentrada     			Identificador del tipo de entrada.
	 * @param int $idreporte     				Identificador del tipo de reporte.
	 * @param int $idvarreporte     			Identificador de la variable del tipo de reporte.
	 * @param int $idconceptotarifa     		Identificador de la tarifa de concepto.
     */
    public function adicionarEstructuraEscalar($denominacion, $idtipocampo, $idnomenclador, $nivel, $idtipoentrada, $idreporte, $idvarreporte, $idconceptotarifa,$lugaresdecimales) {

        //Se crea el objeto de estructura escalar.
        $objEstructuraEsc = new NomEstructuraEscalar();

        //Insertando los datos de la estructura escalar.
		$objEstructuraEsc->denominacion = $denominacion;
		$objEstructuraEsc->idtipocampo = $idtipocampo;
		$objEstructuraEsc->idnomencladorreferencia = ($idnomenclador)? $idnomenclador : null;
		$objEstructuraEsc->nivel = $nivel;
		$objEstructuraEsc->idtipoentrada = $idtipoentrada;
		$objEstructuraEsc->idconfreportescertificaciones = ($idreporte)? $idreporte : null;
		$objEstructuraEsc->idvariablesconfreportescertificaciones = ($idvarreporte)? $idvarreporte : null;
        $objEstructuraEsc->idconceptopdtarifa = $idconceptotarifa;
        $objEstructuraEsc->lugaresdecimales = ($lugaresdecimales)? $lugaresdecimales : 2;//print_r($objEstructuraEsc);die;

        //Guardando los datos.
        $objEstructuraEsc->save();
    }

    /**
     * Modificar una estructura escalar.
     * 
     * @param int $idestrucesc   				Identificador de la estructura escalar.
     * @param string $denominacion     	  		Denominaci�n de la estructura escalar.
	 * @param int $idtipocampo      	   		Identificador del tipo de campo.
	 * @param int $idnomenclador     			Identificador del nomenclador de referencia.
	 * @param int $nivel     	   				Nivel de la estructura escalar.
     * @param int $idtipoentrada     			Identificador del tipo de entrada.
	 * @param int $idreporte     				Identificador del tipo de reporte.
	 * @param int $idvarreporte     			Identificador de la variable del tipo de reporte.
	 * @param int $idconceptotarifa     		Identificador de la tarifa de concepto.
     */
    public function modificarEstructuraEscalar($idestrucesc, $denominacion, $idtipocampo, $idnomenclador, $nivel, $idtipoentrada, $idreporte, $idvarreporte, $idconceptotarifa) {

        //Obteniendo la estructura escalar a modificar.
        $objEstructuraEsc = NomEstructuraEscalar::obtenerObjEstructuraEscalarDadoId($idestrucesc);

        //Modificando los datos de la estructura escalar.
		$objEstructuraEsc->denominacion = $denominacion;
		$objEstructuraEsc->idtipocampo = $idtipocampo;
		$objEstructuraEsc->idnomencladorreferencia = ($idnomenclador)? $idnomenclador : null;
		$objEstructuraEsc->nivel = $nivel;
		$objEstructuraEsc->idtipoentrada = $idtipoentrada;
		$objEstructuraEsc->idconfreportescertificaciones = ($idreporte)? $idreporte : null;
		$objEstructuraEsc->idvariablesconfreportescertificaciones = ($idvarreporte)? $idvarreporte : null;
        $objEstructuraEsc->idconceptopdtarifa = $idconceptotarifa;

        //Guardando los datos.
        $objEstructuraEsc->save();
    }

    /**
     * Eliminar una estructura escalar.
     * 
     * @param int $idestrucesc    Identificador de la estructura escalar.
     */
    public function eliminarEstructuraEscalar($idestrucesc) {
        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomEstructuraEscalar')
				->where('idestructuraescalar = ?', $idestrucesc)
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
