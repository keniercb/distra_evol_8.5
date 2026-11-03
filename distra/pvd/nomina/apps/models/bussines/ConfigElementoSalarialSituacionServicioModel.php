<?php
 
/**
 * Modelo de negocio para gestionar los elementos salariales de la situacion del servicio.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses ConfigElementoSalarialSituacionServicioModel.
 * @copyright UCID
 * @version 1.0
 */
class ConfigElementoSalarialSituacionServicioModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function ConfigElementoSalarialSituacionServicioModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    public function obtenerListadoConfigElementoSalarial($inicio = 0, $limite = 10) {
        //Retornando el listado de tipos de nómina.
        return ConfigElementoSalarialSituacionServicio::obtenerListadoElementosSalariales($inicio, $limite);
    }
    
     /**
     * Obtener un listado de los datos de los tipos de nómina.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
   /* public function obtenerListadoElementoSalXIdcargo($idcargo, $inicio = 0, $limite = 10) {
        //Retornando el listado de tipos de nómina.
        return ConfigElementoSalarialCargo::obtenerListadoElemSalXIdcargo($idcargo, $inicio, $limite);
    } */  
    
    public function existeConfElementoSalarialPersonaCargoOcupado($idpersona, $idcargoocupado) {
		
        //Retornando el listado de estructuras escalares.
        return ConfigElementoSalarialSituacionServicio::existeConfElementoSalarialPersonaCargoOcupado($idpersona, $idcargoocupado);
    }

    /**
     * Obtener la cantidad total de tipos de nómina.
     *
     * @return int Cantidad total de tipos de nómina.
     */
    public function obtenerCantidadElementosSalariales() {

        //Retornando la cantidad total de tipos de nómina.
        return ConfigElementoSalarialSituacionServicio::obtenerCantidadElementosSalariales();
    }
    
    public function obtenerCantidadTotalElemSalCargo($idpersona){
    $objElemSal = new ConfigElementoSalarialSituacionServicio();
    $cant  = $objElemSal->obtenerCantidadTotalElemSalPersona($idpersona);
    return $cant;
    }
    
    public function obtenerElemSalPersona($idpersona){
    $objElemSal = new ConfigElementoSalarialSituacionServicio();
    $arr  = $objElemSal->obtenerElemSalPersona($idpersona);
    return $arr;
    }
    /**
     * Insertar un tipo de nómina.
     * 
     * @param string $denom     Denominacion del tipo de nómina.
     * @param string $finicio   Fecha de inicio de creacion del tipo de nómina.
     * @param string $ffin      Fecha de fin de uso del tipo de nómina.
     * @param string $descrip   Descripcion del tipo de nómina.
     */
    public function adicionarElementoSalarial($idsistpago,$idperiodopago, $idgrupoescala, $idsector
        , $idescalasueldocargo, $importe, $finicio, $ffin, $idcargoocupado, $idpersona) {
	     //Se crea el objeto del tipo de nómina.
        $objElemSal = new ConfigElementoSalarialSituacionServicio();
        //Insertando los datos del tipo de nómina.
        $objElemSal->idsistemapago = $idsistpago;
        $objElemSal->idperiodopago = $idperiodopago;
        //$objElemSal->idgrupoescala = $idgrupoescala;
        //$objElemSal->idsectorsalarial = $idsector;
        $objElemSal->idescalasueldocargo = $idescalasueldocargo;
        if($importe == ""){
		  $objElemSal->importe = null;	
		}else{
		  $objElemSal->importe = $importe;	
	    }
        $fecha=split('/',$finicio); 
        $objElemSal->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objElemSal->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objElemSal->idcargoocupado = $idcargoocupado;
        $objElemSal->idpersona = $idpersona;
        //Guardando los datos.
		//print_r($objElemSal);die;
        $objElemSal->save();
        
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
    public function modificarElementoSalarial($idelementosalarial, $idsistpago,$idperiodopago, $idgrupoescala, $idsector
        , $idescalasueldocargo, $importe, $finicio, $ffin, $idcargoocupado, $idpersona) {
        //Obteniendo el tipo de nómina a modificar.
        $objElemSal = ConfigElementoSalarialSituacionServicio::obtenerObjElementoSalarialDadoId($idelementosalarial);
        
        //Modificando los datos del tipo de nómina.
        $objElemSal->idsistemapago = $idsistpago;
        $objElemSal->idperiodopago = $idperiodopago;
        //$objElemSal->idgrupoescala = $idgrupoescala;
        //$objElemSal->idsectorsalarial = $idsector;
        $objElemSal->idescalasueldocargo = $idescalasueldocargo;
        if($importe == ""){
		  $objElemSal->importe = null;	
		}else{
		  $objElemSal->importe = $importe;	
	    }
        $fecha=split('/',$finicio); 
        $objElemSal->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objElemSal->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objElemSal->idcargoocupado = $idcargoocupado;
        $objElemSal->idpersona = $idpersona;
        
        //Guardando los datos.
        $objElemSal->save();
    }

    /**
     * Eliminar un tipo de nómina.
     * 
     * @param int $idtiponomina    Identificador del tipo de nómina.
     */
    public function eliminarElementoSalarial($idelementosalarial) {

        //Obteniendo el tipo de nómina a eliminar.
        $objElemSal = ConfigElementoSalarialSituacionServicio::obtenerObjElementoSalarialDadoId($idelementosalarial);
        //Borrando el tipo de nómina.
        $objElemSal->delete();
    }
}
