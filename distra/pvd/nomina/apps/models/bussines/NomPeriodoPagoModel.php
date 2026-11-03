<?php

/**
 * Modelo de negocio para gestionar los periodos de pago.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomPeriodoPago, Entidad periodo de pago (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomPeriodoPagoModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomPeriodoPagoModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los periodos de pago.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de periodos de pago.
     */
    public function obtenerListadoPeriodosPago($inicio = 0, $limite = 10) {

        //Retornando el listado de periodos de pago.
        return NomPeriodoPago::obtenerListadoPeriodosPago($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de periodos de pago.
     *
     * @return int Cantidad total de periodos de pago.
     */
    public function obtenerCantidadTotalPeriodosPago() {

        //Retornando la cantidad total de periodos de pago.
        return NomPeriodoPago::obtenerCantidadTotalPeriodosPago();
    }

    /**
     * Insertar un periodo de pago.
     * 
     * @param string $denom     Denominacion del periodo de pago.
     * @param string $finicio   Fecha de inicio de creacion del periodo de pago.
     * @param string $ffin      Fecha de fin de uso del periodo de pago.
     * @param string $descrip   Descripcion del periodo de pago.
	 * @param int $cantdias   	Cantidad de d�as del periodo de pago.
     */
    public function adicionarPeriodoPago($denom, $finicio, $ffin, $descrip, $cantdias, $tipoperiodo) {

        try {
            if(!NomPeriodoPago::findByIdOrDenom($denom)){
                //Se crea el objeto del periodo de pago.
                $objPeriodoPago = new NomPeriodoPago();

                //Insertando los datos del periodo de pago.
                $objPeriodoPago->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objPeriodoPago->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objPeriodoPago->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objPeriodoPago->descripcion = $descrip;
                $objPeriodoPago->cantidaddias = $cantdias;
                $objPeriodoPago->tipoperiodo = $tipoperiodo;

                //Guardando los datos.
                $objPeriodoPago->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }

    }
    
    /**
     * Modificar un periodo de pago.
     * 
     * @param int $idperiodo    Identificador del periodo de pago.
     * @param string $denom     Denominacion del periodo de pago.
     * @param string $finicio   Fecha de inicio de creacion del periodo de pago.
     * @param string $ffin      Fecha de fin de uso del periodo de pago.
     * @param string $descrip   Descripcion del periodo de pago.
	 * @param int $cantdias   	Cantidad de d�as del periodo de pago.
     */
    public function modificarPeriodoPago($idperiodo, $denom, $finicio, $ffin, $descrip, $cantdias, $tipoperiodo) {
       

        try {
//          print_r(NomPeriodoPago::findByIdOrDenom($denom,$idperiodo));die;
            if(!NomPeriodoPago::findByIdOrDenom($denom,$idperiodo)){

                //Obteniendo el periodo de pago a modificar.
                $objPeriodoPago = NomPeriodoPago::obtenerObjPeriodoPagoDadoId($idperiodo);

                //Modificando los datos del periodo de pago.
                $objPeriodoPago->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objPeriodoPago->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objPeriodoPago->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objPeriodoPago->descripcion = $descrip;
                $objPeriodoPago->cantidaddias = $cantdias;
                $objPeriodoPago->tipoperiodo = $tipoperiodo;
                //Guardando los datos.
                $objPeriodoPago->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar un periodo de pago.
     * 
     * @param int $idperiodo    Identificador del periodo de pago.
     */
    public function eliminarPeriodoPago($idperiodopago) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomPeriodoPago')
				->where('idperiodopago = ?', $idperiodopago)
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
