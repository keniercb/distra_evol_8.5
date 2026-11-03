<?php

class ConfVarAuxSNC225 extends BaseConfVarAuxSNC225 {

    public function setUp(){
        parent::setUp();
        
    }
    
    public static function obtenerConfVarAuxSNC225($idvariableaux) {
	    return Doctrine::getTable('ConfVarAuxSNC225')->find($idvariableaux);
    }

    public static function obtenerConfVariableAuxiliar($idregistsalartiempservc){
        $sql = Doctrine_Query::create()
             ->from('ConfVarAuxSNC225')
             ->where('idregistsalartiempservc = ?', array($idregistsalartiempservc))
             ->fetchArray();
        return $sql;
    }

    public static function obtenerArrConfVariableAuxiliar($idvblesgblesregsaltmpserv){
        $sql = Doctrine_Query::create()
            ->from('ConfVarAuxSNC225')
            ->where('idvblesgblesregsaltmpserv = ?', array($idvblesgblesregsaltmpserv))
            ->fetchArray();
        return $sql;
    }

    public static function obtenerIdVariableConReporte($idvblesgblesregsaltmpserv){
        $sql = Doctrine_Query::create()
            ->select('idvariablesconfreportescertificaciones')
            ->from('ConfVarAuxSNC225')
            ->where('idvblesgblesregsaltmpserv = ?', array($idvblesgblesregsaltmpserv))
            ->fetchOne()
            ->idvariablesconfreportescertificaciones;
        return $sql;
    }
 
}
