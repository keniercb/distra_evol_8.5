<?php

class DatVarAuxConceptospdFormasySistemasPago extends BaseDatVariablesAuxConceptospdFormasySistemasPago {

    public function setUp(){
        parent::setUp();
        
    }
    
    public static function obtenerVariablesAuxiliaresPorConfConceptosGeneralesNomina($idconfconceptospdformasysistemaspago) {
        $sql = "select dva.*, cvrc.denominacion as denominacionvariabletiporeporte, ctrc.denominacion as denominaciontiporeporte
		from mod_nomina.dat_variableauxconceptospdformasysistemaspago dva
		left join mod_nomina.conf_tiporeportescertificaciones ctrc on (ctrc.idconfreportescertificaciones = dva.idconfreportescertificaciones)
		left join mod_nomina.conf_variablestiporeportescertificaciones cvrc on (cvrc.idvariablesconfreportescertificaciones = dva.idvariablesconfreportescertificaciones)
		where dva.idconfconceptospdformasysistemaspago = ?
		order by dva.denominacion ;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idconfconceptospdformasysistemaspago));
    }
	
	public static function obtenerIdDatVarAuxConceptospdFormasySistemasPago($idconfconceptospdformasysistemaspago) {
	    //Devolviendo id de la tabla.
        return Doctrine_Query::create()->select('idvariableauxconceptospdformasysistemaspago AS idvariableauxconceptospdformasysistemaspago')
                        ->from('DatVarAuxConceptospdFormasySistemasPago')
                        ->where('idconfconceptospdformasysistemaspago = ?', array($idconfconceptospdformasysistemaspago))
                        ->fetchOne()
                        ->idvariableauxconceptospdformasysistemaspago;
    }
	
	public static function obtenerDatVarAuxConceptospdFormasySistemasPago($idvariableauxconceptospdformasysistemaspago) {
	    return Doctrine::getTable('DatVarAuxConceptospdFormasySistemasPago')->find($idvariableauxconceptospdformasysistemaspago);
    }
 
}
