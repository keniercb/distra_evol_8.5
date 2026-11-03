<?php

/**
 * Modelo de negocio para gestionar las configuraciones a las escalas de la situacion del servicio.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses ConfEscalaElementoSalarialSituacionServicioModel.
 * @copyright UCID
 * @version 1.0
 */
class ConfEscalaElementoSalarialSituacionServicioModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function ConfEscalaElementoSalarialSituacionServicioModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las estructuras escalares dado un identificador de la tarifa de concepto.
     * 
     * @param int $idconceptotarifa  Identificador de la tarifa del concepto.
     * @return array Listado de estructuras escalares
     */
    public function obtenerListadoConfEscalaElementoSalarial() {
		
        //Retornando el listado de estructuras escalares.
        return ConfEscalaElementoSalarialSituacionServicio::obtenerListadoConfEscalaElementoSalarial();
    }
    
    public function existeConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales) {
		
        //Retornando el listado de estructuras escalares.
        return ConfEscalaElementoSalarialSituacionServicio::existeConfEscalaElementoSalarialDadoIdConfConfepto($idconfconceptospdelementossalariales);
    }

    /**
     * Insertar una estructura escalar.
     * 
     * @param string $denominacion     	  		Denominación de la estructura escalar.
	 * @param int $idtipocampo      	   		Identificador del tipo de campo.
	 * @param int $idnomenclador     			Identificador del nomenclador de referencia.
	 * @param int $nivel     	   				Nivel de la estructura escalar.
     * @param int $idtipoentrada     			Identificador del tipo de entrada.
	 * @param int $idreporte     				Identificador del tipo de reporte.
	 * @param int $idvarreporte     			Identificador de la variable del tipo de reporte.
	 * @param int $idconceptotarifa     		Identificador de la tarifa de concepto.
     */
    
    public function adicionarEscalaXConcepto($idestructuraescalar, $idconfconceptospdelementossalariales,
        $importe, $fechainicio, $fechafin, $idconceptpelementsalarialessituacionservicio){ 
		$objEscConf = new ConfEscalaElementoSalarialSituacionServicio();
        //Insertando los datos de la escala tarifa.
		
		$objEscConf->idescalatarifa = ($idestructuraescalar)? $idestructuraescalar : null;
        $objEscConf->idconceptopercepciondescuento = ($idconfconceptospdelementossalariales)? $idconfconceptospdelementossalariales : null;
		$objEscConf->importe = ($importe)? $importe : null;
		$objEscConf->fechainicio = ($fechainicio)? $fechainicio : null;
		$objEscConf->fechafin = ($fechafin)? $fechafin : null;
		$objEscConf->idconceptpelementsalarialessituacionservicio = ($idconceptpelementsalarialessituacionservicio)? $idconceptpelementsalarialessituacionservicio : null;
		//Guardando los datos.
		//print_r($objEscConcepto);die;
		$objEscConf->save();
        return true;
        
    }

    /**
     * Modificar un tipo de nómina.
     * 
     * @param int $idtiponomina   Identificador del tipo de nómina.
     * @param string $denom     Denominacion del tipo de nómina.
     * @param string $finicio   Fecha de inicio de creacion del tipo de nómina.
     * @param string $ffin      Fecha de fin de uso del tipo de nómina.
     * @param string $descrip   Descripcion del tipo de nómina.
     */
    public function modificarEscalaXConcepto($idescalaelementosalarialsituacionservicio, $idestructuraescalar, $idconfconceptospdelementossalariales,
        $importe, $fechainicio, $fechafin, $idconceptpelementsalarialessituacionservicio) {
        $objEscConcepto = new ConfEscalaElementoSalarialSituacionServicio();
        $objEscConf = $objEscConcepto->obtenerObjConfEscalaElementoSalarialDadoId($idescalaelementosalarialsituacionservicio);
        
        $objEscConf->idescalatarifa = ($idestructuraescalar)? $idestructuraescalar : null;
        $objEscConf->idconceptopercepciondescuento = ($idconfconceptospdelementossalariales)? $idconfconceptospdelementossalariales : null;
		$objEscConf->importe = ($importe)? $importe : null;
		$objEscConf->fechainicio = ($fechainicio)? $fechainicio : null;
		$objEscConf->fechafin = ($fechafin)? $fechafin : null;
		$objEscConf->idconceptpelementsalarialessituacionservicio = ($idconceptpelementsalarialessituacionservicio)? $idconceptpelementsalarialessituacionservicio : null;
		//Guardando los datos.
		$objEscConf->save();
        return true;
     }

    /**
     * Eliminar un tipo de nómina.
     * 
     * @param int $idtiponomina    Identificador del tipo de nómina.
     */
    public function eliminarEscalaXConcepto($idescalaelemsal) {

        //Obteniendo el tipo de nómina a eliminar.
        $objEscConf = ConfEscalaElementoSalarialSituacionServicio::obtenerObjConfEscalaElementoSalarialDadoId($idescalaelemsal);
        //Borrando el tipo de nómina.
        $objEscConf->delete();
    }
}
