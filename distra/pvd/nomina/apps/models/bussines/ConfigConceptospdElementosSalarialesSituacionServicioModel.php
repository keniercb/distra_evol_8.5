<?php

/**
 * Modelo de negocio para gestionar las configuraciones de los conceptos de pd.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Modelo de negocio
 * @uses ConfigConceptospdElementosSalarialesSituacionServicioModel.
 * @copyright UCID
 * @version 1.0
 */
class ConfigConceptospdElementosSalarialesSituacionServicioModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function ConfigConceptospdElementosSalarialesSituacionServicioModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    public function obtenerListadoConceptospdElementosSalariales($inicio = 0, $limite = 10) {
        //Retornando el listado de tipos de nómina.
        return ConfigConceptospdElementosSalarialesSituacionServicio::obtenerListadoConceptospdElementosSalariales($inicio, $limite);
    }
    
     /**
     * Obtener un listado de los datos de los tipos de nómina.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    public function obtenerConceptospdElementoSalarialxElementoSalSituacion($idelementoSalarialSituacion) {
        return ConfigConceptospdElementosSalarialesSituacionServicio::obtenerConceptospdElementoSalarialxElementoSalSituacion($idelementoSalarialSituacion);
    }  
    

    /**
     * Obtener la cantidad total de tipos de nómina.
     *
     * @return int Cantidad total de tipos de nómina.
     */
    public function obtenerCantidadTotalConceptospdElementoSalarialxElementoSalSituacion($idelementoSalarialSituacion) {
        //Retornando la cantidad total de tipos de nómina.
        return ConfigConceptospdElementosSalarialesSituacionServicio::obtenerCantidadTotalConceptospdElementoSalarialxElementoSalSituacion($idelementoSalarialSituacion);
    }
    
    /**
     * Insertar un tipo de nómina.
     * 
     * @param string $denom     Denominacion del tipo de nómina.
     * @param string $finicio   Fecha de inicio de creacion del tipo de nómina.
     * @param string $ffin      Fecha de fin de uso del tipo de nómina.
     * @param string $descrip   Descripcion del tipo de nómina.
     */
    public function adicionarConceptospdElementosSalariales($idconcepto, $idtarifa, $fechainicio, $fechafin, 
        $idcargo) {
	     $objDomain = new ConfigConceptospdElementosSalarialesSituacionServicio();
		 $existe = $objDomain->existeidConcepto($idconcepto, $idcargo);
		 if($existe==0){
         $objDomain->idconceptopercepciondescuento = $idconcepto;
         $objDomain->idtarifa = $idtarifa;
         $objDomain->fechainicio = $fechainicio;
         $objDomain->fechafin = $fechafin;
         $objDomain->idcargosocupados = $idcargo;
         $objDomain->save();
         }
        
        
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
    public function modificarConceptospdElementosSalariales($idconceptoPdsituacioservicio, $idconcepto, $idtarifa, $fechainicio, $fechafin, 
        $idcargo) {
        //Obteniendo el tipo de nómina a modificar.
        $objDomain = ConfigConceptospdElementosSalarialesSituacionServicio::obtenerObjConceptospdElementoSalarialDadoId($idconceptoPdsituacioservicio);
        if($idconcepto == $objDomain->idconceptopercepciondescuento){
           $objDomain->idconceptopercepciondescuento = $idconcepto;
           $objDomain->idtarifa = $idtarifa;
           $objDomain->fechainicio = $fechainicio;
           $objDomain->fechafin = $fechafin;
           $objDomain->idcargosocupados = $idcargo;
        
           $objDomain->save();
	        }else{
		   $objDomainEscala = new ConfEscalaElementoSalarialSituacionServicio();
		   $existeEscalaSituacion = $objDomainEscala->existeConfEscalaElementoSalarialDadoIdConfConfepto($idconceptoPdsituacioservicio);
		   if($existeEscalaSituacion==true){
		   $objDomainEscalaDelete = $objDomainEscala->obtenerConfEscalaElementoSalarialDadoIdConfConfepto($idconceptoPdsituacioservicio);
		   $idescala = $objDomainEscalaDelete[0]['idescalaelementosalarialsituacionservicio'];
		   $objDel = $objDomainEscala->obtenerObjConfEscalaElementoSalarialDadoId($idescala);
		   $objDel->delete();
	       }
		   		   
		   $objDomain->idconceptopercepciondescuento = $idconcepto;
           $objDomain->idtarifa = $idtarifa;
           $objDomain->fechainicio = $fechainicio;
           $objDomain->fechafin = $fechafin;
           $objDomain->idcargosocupados = $idcargo;
           
           $objDomain->save();
		 }
     }

    /**
     * Eliminar un tipo de nómina.
     * 
     * @param int $idtiponomina    Identificador del tipo de nómina.
     */
    public function eliminarConceptospdElementosSalariales($idconceptoPdsituacioservicio) {
        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('ConfigConceptospdElementosSalarialesSituacionServicio')
				->where('idconceptpelementsalarialessituacionservicio = ?', $idconceptoPdsituacioservicio)
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
