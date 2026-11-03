<?php

/**
 * Modelo de negocio para gestionar los obras.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomObra, Entidad obra (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomObraModel extends ZendExt_Model {

    /**
      * Constructor de la clase.
     */
    public function NomObraModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los obras.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de obras.
     */
    public function obtenerListadoObra($inicio = 0, $limite = 10) {
         //Retornando el listado de obras.
        $arrayreturn = array();
        $cont = 0;
        $arrayObra = NomObra::obtenerListadoObra($inicio, $limite);
		foreach($arrayObra as $i=>$value){
		  $arrayreturn[$cont]['idobra'] = $value['idobra'];
		  $arrayreturn[$cont]['denominacion'] = $value['denominacion'];
		  $arrayreturn[$cont]['fechainicio'] = $value['fechainicio'];
		  $arrayreturn[$cont]['fechafin'] = $value['fechafin'];
		  $arrayreturn[$cont]['descripcion'] = $value['descripcion'];
		  $cont++;
		}
		
		return $arrayreturn;
    }

    /**
     * Obtener la cantidad total de obras.
     *
     * @return int Cantidad total de obras.
     */
    public function obtenerCantidadTotalObra() {

        //Retornando la cantidad total de obras.
        return NomObra::obtenerCantidadTotalObra();
    }

    /**
     * Insertar un obra.
     * 
     * @param string $denom     Denominacion del obra.
	 * @param numeric $acum     Acumula vacaciones.
     * @param date $finicio   	Fecha de inicio de creacion del obra.
     * @param date $ffin      	Fecha de fin de uso del obra.
     * @param string $descrip   Descripcion del obra.
     */
      public function adicionarObra($denom, $finicio, $ffin, $descrip) {
        //Se crea el objeto del obra.
        $objObra = new NomObra();
      
        //Insertando los datos del obra.
        $objObra->denominacion = $denom;
		$fecha=split('/',$finicio); 
        $objObra->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objObra->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objObra->descripcion = $descrip;

        //Guardando los datos.
        $objObra->save();
        
    }

    /**
     * Modificar un obra.
     * 
     * @param int $idobra   	Identificador del obra.
     * @param string $denom       	Denominacion del obra.
	 * @param numeric $acum     	Acumula vacaciones.
     * @param date $finicio   		Fecha de inicio de creacion del obra.
     * @param date $ffin      		Fecha de fin de uso del obra.
     * @param string $descrip   	Descripcion del obra.
     */
    public function modificarObra($idobra, $denom, $finicio, $ffin, $descrip) {
        //Obteniendo el obra a modificar.
        $objObra = NomObra::obtenerObjObraDadoId($idobra);
        
        //Modificando los datos del obra.
        $objObra->denominacion = $denom;
		$fecha=split('/',$finicio); 
        $objObra->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objObra->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
		$objObra->descripcion = $descrip;
        
        //Guardando los datos.
        $objObra->save();
    }

    /**
     * Eliminar un obra.
     * 
     * @param int $idobra    Identificador del obra.
     */
    public function eliminarObra($idobra) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomObra')
				->where('idobra = ?', $idobra)
				->execute();
			return $r;
		}catch (Exception $e){
            if($e->getCode() == 23503){//Code for foreignKeyViolation
                return 2;
            }else{
                return 1;
            }
        }
    }
}
