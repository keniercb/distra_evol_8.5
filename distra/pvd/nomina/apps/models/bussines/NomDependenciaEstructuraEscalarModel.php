<?php

/**
 * Modelo de negocio para gestionar las dependencias de las estructuras escalares.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomDependenciaEstructuraEscalar, Entidad dependencia de estructura escalar(Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomDependenciaEstructuraEscalarModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomDependenciaEstructuraEscalarModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las dependencias de las estructuras escalares dado un identificador de la estructura escalar.
     * 
     * @param int $idestrucesc  Identificador de la estructur escalar.
     * @return array Listado de dependencias de estructuras escalares
     */
    public function obtenerListadoDependenciasEstructurasEscalares($idestrucesc) {
		
        //Retornando el listado de dependencias de estructuras escalares.
        return NomDependenciaEstructuraEscalar::obtenerListadoDependenciasEstructurasEscalares($idestrucesc);
    }

    /**
     * Insertar una dependencia de estructura escalar.
     * 
     * @param int $idestrucesc     	  		Identificador de la estructura escalar.
	 * @param int $idadyacente     	   		Identificador de la estructura adyacente.
	 * @param int $idconceptotarifa     	Identificador de la tarifa de concepto.
     */
    public function adicionarDependenciaEstructuraEscalar($idestrucesc, $idadyacente, $idconceptotarifa) {

        //Se crea el objeto de dependencia de estructura escalar.
        $objDepEstructuraEsc = new NomDependenciaEstructuraEscalar();

        //Insertando los datos de la dependencia de estructura escalar.
		$objDepEstructuraEsc->idestructuraescalar = $idestrucesc;
		$objDepEstructuraEsc->idestructuraescalaradyacente = $idadyacente;
        $objDepEstructuraEsc->idconceptopdtarifa = $idconceptotarifa;

        //Guardando los datos.
        $objDepEstructuraEsc->save();
    }

    /**
     * Eliminar una dependencia de estructura escalar.
     * 
     * @param int $iddepestrucesc    Identificador de la dependencia de estructura escalar.
     */
    public function eliminarDependenciaEstructuraEscalar($iddepestrucesc) {

        //Obteniendo la estructura escalar a eliminar.
        $objDepEstructuraEsc = NomDependenciaEstructuraEscalar::obtenerObjDependenciaEstructuraEscalarDadoId($iddepestrucesc);
		
        //Borrando la estructura escalar.
        $objDepEstructuraEsc->delete();
    }
}