<?php

class ConfConceptospdFormasySistemasPago extends BaseConfConceptospdFormasySistemasPago {

    public function setUp(){
        parent::setUp();
        
    }
    
    public static function obtenerConfConceptospdFormasySistemasPago($idconfconceptosportiposysistemaspago, $idperiodopago) {
        $w = 'idconfconceptosportiposysistemaspago = ? ';
        $a[] = $idconfconceptosportiposysistemaspago;
        if($idperiodopago){
			$w .= 'and idperiodopago = ?';
			$a[] = $idperiodopago;
		}
        
        return Doctrine_Query::create()
                ->from('ConfConceptospdFormasySistemasPago')
                ->where($w, $a)
                ->fetchArray();
    }
	
	 public static function obtenerIdConfconceptospdFormasySistemasPago($idconfconceptosportiposysistemaspago) {

        //Devolviendo id de la tabla.
        return Doctrine_Query::create()->select('idconfconceptospdformasysistemaspago AS idconfconceptospdformasysistemaspago')
                        ->from('ConfConceptospdFormasySistemasPago')
                        ->where('idconfconceptosportiposysistemaspago = ?', array($idconfconceptosportiposysistemaspago))
                        ->fetchOne()
                        ->idconfconceptospdformasysistemaspago;
    }
	
	public static function obtenerObjConfconceptospdFormasySistemasPago($idconfconceptospdformasysistemaspago) {
        return Doctrine::getTable('ConfConceptospdFormasySistemasPago')->find($idconfconceptospdformasysistemaspago);
    }

    public static function existenvariables($idconfconceptosportiposysistemaspago) {

        //Devolviendo id de la tabla.
        return Doctrine_Query::create()->select('idconfconceptospdformasysistemaspago AS idconfconceptospdformasysistemaspago,formacalculo,idexpresionmatematica,idperiodopago,lugaresdecimales,idconfconceptosportiposysistemaspago,')
            ->from('ConfConceptospdFormasySistemasPago')
            ->where('idconfconceptosportiposysistemaspago = ?', array($idconfconceptosportiposysistemaspago))
            ->fetchArray();
    }

    public static function existenvariablesaux($idconfconceptospdformasysistemaspago) {

        //Devolviendo id de la tabla.
        return Doctrine_Query::create()->select('*')
            ->from('DatVarAuxConceptospdFormasySistemasPago')
            ->where('idconfconceptospdformasysistemaspago = ?', array($idconfconceptospdformasysistemaspago))
            ->fetchArray();
    }

    public static function obtenerConceptosPDXTipoPago($identidad, $idtipopago)
    {
        $sqlConceptos = "select ncpd.idconceptopercepciondescuento, ncpd.abreviatura, ncpd.denominacion, tc.denominacion as tipoconcepto
							from mod_nomina.conf_conceptosportiposysistemaspago ccfsp
							inner join mod_nomina.nom_conceptopercepciondescuento ncpd on (ncpd.idconceptopercepciondescuento = ccfsp.idconceptopercepciondescuento)
							inner join mod_nomina.nom_tipoconceptopercepciondescuento tc on (tc.idtipoconceptopd = ncpd.idtipoconceptopd)
							where ccfsp.identidad = ? and ccfsp.idtipopago = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sqlConceptos, array($identidad, $idtipopago));
        return $r;
    }
 
}
