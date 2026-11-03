<?php

/**
 * Modelo de negocio
 *
 * @author
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoPago, Entidad tipo de pago (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomPartidagastoModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomPartidagastoModel() {
        parent::ZendExt_Model();
    }

    public function obtenerListadoPartida($inicio = 0, $limite = 10) {

        //Retornando el listado de tipos de pago.
        return NomPartidagasto::obtenerListadoNAE($inicio, $limite);
    }

    public function obtenerCantidadTotalPartida($inicio = 0, $limite = 10) {

        //Retornando el listado de tipos de pago.
        return NomPartidagasto::obtenerCantidadTotalPartida($inicio, $limite);
    }

    public function adicionarPartidaGasto($denom, $finicio, $ffin, $descrip /*,$idtipopartidagasto*/) {

        $bool = NomPartidagasto::existeDenominacionTipoPago($denom);

         if(!$bool){
            //Se crea el objeto
            $objpartidagasto = new NomPartidagasto();

            //Insertando los datos
            $objpartidagasto->denominacion = $denom;
            $fecha=split('/',$finicio);
            $objpartidagasto->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
            $fecha=split('/',$ffin);
            $objpartidagasto->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
            $objpartidagasto->descripcion = $descrip;
//            $objpartidagasto->idtipopartidagasto = $idtipopartidagasto;

            //Guardando los datos.
            $objpartidagasto->save();
            return true;
        }else{
            return false;
        }

    }

    public function modificarPartidaGasto($idpartidagasto, $denom, $finicio, $ffin, $descrip /*,$idtipopartidagasto*/) {
        $bool = NomPartidagasto::existeDenominacionTipoPago($denom);

        if(!$bool){
            //Obteniendo el periodo
            $objPeriodoPago = NomPartidagasto::obtenerObjPartidaPagoDadoId($idpartidagasto);

            //Modificando los datos
            $objPeriodoPago->denominacion = $denom;
            $fecha=split('/',$finicio);
            $objPeriodoPago->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
            $fecha=split('/',$ffin);
            $objPeriodoPago->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
            $objPeriodoPago->descripcion = $descrip;
//            $objPeriodoPago->idtipopartidagasto = $idtipopartidagasto;

            //Guardando los datos.
            $objPeriodoPago->save();
            return true;
        }else{
            return false;
        }

    }

    public function eliminarPartidaGasto($idpartidagasto) {

        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomPartidagasto')
                ->where('idnivelactiveconom = ?', $idpartidagasto)
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
