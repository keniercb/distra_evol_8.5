<?php

class DatConceptosMontoElaborarPago extends BaseConceptosMontoElaborarPago {

    public function setUp(){
        parent::setUp();
        
    }
    
    public static function obtenerDatConceptosMontoElaborarPago($idconceptoelaborarpago) {
	    return Doctrine::getTable('DatConceptosMontoElaborarPago')->find($idconceptoelaborarpago);
    }

    public static function obtenerArrDatConceptosMontoXElaborarPago($idelaborarpagos){
        return Doctrine_Query::create()
             ->from('DatConceptosMontoElaborarPago')
             ->where('idelaborarpagos = ?', array($idelaborarpagos))
             ->fetchArray();

    }

    public static function obtenerArrDatConceptosMontoXElaborarPagoEstNomina($idelaborarpagos, $idestructuramodelodomina){
        return Doctrine_Query::create()
            ->from('DatConceptosMontoElaborarPago')
            ->where('idelaborarpagos = ? and idestructuramodelodomina = ?', array($idelaborarpagos, $idestructuramodelodomina))
            ->fetchArray();

    }

    public static function obtenerMontoXElaborarPagoEstNomina($idelaborarpagos, $idestructuramodelodomina){
        return Doctrine_Query::create()
            ->select('monto')
            ->from('DatConceptosMontoElaborarPago')
            ->where('idelaborarpagos = ? and idestructuramodelodomina = ?', array($idelaborarpagos, $idestructuramodelodomina))
            ->fetchOne()
            ->monto;
    }

    public static function obtenerDesgloseConceptoCentrosCosto($idelaborarpagos, $idestructuramodelodomina){
        return Doctrine_Query::create()
            ->select('desglosecentcosto')
            ->from('DatConceptosMontoElaborarPago')
            ->where('idelaborarpagos = ? and idestructuramodelodomina = ?', array($idelaborarpagos, $idestructuramodelodomina))
            ->fetchOne()
            ->desglosecentcosto;
    }

    public static function existeMontoXElaborarPagoEstNomina($idelaborarpagos, $idestructuramodelodomina){
        return Doctrine_Query::create()
            ->select('count(idconceptoelaborarpago) as cantidad')
            ->from('DatConceptosMontoElaborarPago')
            ->where('idelaborarpagos = ? and idestructuramodelodomina = ?', array($idelaborarpagos, $idestructuramodelodomina))
            ->fetchOne()
            ->cantidad;
    }
}
