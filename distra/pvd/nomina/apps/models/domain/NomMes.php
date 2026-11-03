<?php

class NomMes extends BaseNomMes {

    public function setUp(){
        parent::setUp();
        
    }
    
    public static function obtenerNomMes($idmes) {
	    return Doctrine::getTable('NomMes')->find($idmes);
    }

    public static function obtenerArrNomMes($idmes){
        $sql = Doctrine_Query::create()
             ->from('NomMes')
             ->where('idmes = ?', array($idmes))
             ->fetchArray();
        return $sql;
    }

    public static function obteneTodosNomMes(){
        $sql = Doctrine_Query::create()
            ->from('NomMes')
            ->fetchArray();
        return $sql;
    }

    public static function obtenerDenominacionXIdmes($idmes) {

        //Devolviendo la cantidad total de tipos de nómina.
        return Doctrine_Query::create()->select('denominacion AS denominacion')
            ->from('NomMes')
            ->where('idmes=?', array($idmes))
            ->fetchOne()
            ->denominacion;
    }

    static public function obtenerNoMesXDenominacion($denominacion) {
        return Doctrine_Query::create()->select('idmes AS idmes')
            ->from('NomMes')
            ->where('denominacion ilike ?', array($denominacion))
            ->fetchOne();
    }
 
}
