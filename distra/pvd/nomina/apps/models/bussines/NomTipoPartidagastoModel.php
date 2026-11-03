<?php

/**
 * Modelo de negocio para gestionar los tipos de pago.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoPago, Entidad tipo de pago (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomTipoPartidagastoModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomTipoPartidagastoModel() {
        parent::ZendExt_Model();
    }

    public function obtenerListadoTipoPartida($inicio = 0, $limite = 10) {

        //Retornando el listado de tipos de pago.
        return NomTipoPartidagasto::obtenerListadoTipoPartida($inicio, $limite);
    }
    public function obtenerTodosTipoPartidagasto() {

        //Retornando el listado de tipos de pago.
        return NomTipoPartidagasto::obtenerTodosTipoPartidagasto();


    }

    public function obtenerCantidadTotalTipoPartida($inicio = 0, $limite = 10) {

        //Retornando el listado de tipos de pago.
        return NomTipoPartidagasto::obtenerCantidadTotalTipoPartida($inicio, $limite);
    }

    public function adicionarTiposPartidaGasto($denom, $finicio, $ffin, $descrip) {
        //Se crea el objeto
        $bool=NomTipoPartidagasto::existeDenominacionTipoPartida($denom);
        if(!$bool){
            $objTipopartidagasto = new NomTipoPartidagasto();

            //Insertando los datos
            $objTipopartidagasto->denominacion = $denom;
            $fecha=split('/',$finicio);
            $objTipopartidagasto->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
            $fecha=split('/',$ffin);
            $objTipopartidagasto->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
            $objTipopartidagasto->descripcion = $descrip;

            //Guardando los datos.
            $objTipopartidagasto->save();
            return true;
        }else{
            return false;
        }

    }

    public function modificarTiposPartidaGasto($idtipopartidagasto, $denom, $finicio, $ffin, $descrip) {

      $bool = NomTipoPartidagasto::existeDenominacionTipoPartida($denom);

        if(!$bool){
            //Obteniendo el periodo
            $objPeriodoPago = NomTipoPartidagasto::obtenerObjTipoPartidaPagoDadoId($idtipopartidagasto);

            //Modificando los datos
            $objPeriodoPago->denominacion = $denom;
            $fecha=split('/',$finicio);
            $objPeriodoPago->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
            $fecha=split('/',$ffin);
            $objPeriodoPago->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
            $objPeriodoPago->descripcion = $descrip;


            //Guardando los datos.
            $objPeriodoPago->save();
            return true;
        }else{
            return false;
        }

    }

    public function eliminarTiposPartidaGasto($idtipopartidagasto) {

        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomTipoPartidagasto')
                ->where('idtipopartidagasto = ?', $idtipopartidagasto)
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
