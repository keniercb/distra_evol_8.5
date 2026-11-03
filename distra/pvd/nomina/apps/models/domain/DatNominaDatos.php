<?php

class DatNominaDatos extends BaseDatNominaDatos {

    public function setUp() {
        parent::setUp();
        $this->hasMany('DatNomina', array(
            'local' => 'idnomina',
            'foreign' => 'idnomina',
            'refClass' => 'DatNominaDatos'
        ));
    }

    public static function obtenerObj($idnominadatos) {
        return Doctrine::getTable('DatNominaDatos')->find($idnominadatos);
    }

    public function obtenerDatosNomina($idnomina) {
        $sql = "select * from mod_nomina.dat_nominadatos where idnomina = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idnomina));
    }

    public function obtenerDatosNominaArray($arrayidnomina) {
        $sql = "select * from mod_nomina.dat_nominadatos where idnomina in (" . implode(',', $arrayidnomina) . ");";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerDatosNominaPorElaborarPago($idelaborarpago) {
        $sql = "select nd.*, n.idplantillanominal from mod_nomina.dat_nominadatos nd
					inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
					where n.idelaborarpago = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idelaborarpago));
    }

    public function obtenerIdNominaPorElaborarPago($idelaborarpago) {
        $sql = "select n.idnomina from mod_nomina.dat_nominadatos nd
					inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
					where n.idelaborarpago = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idelaborarpago));
    }

    public function obtenerValoresNominaPorElaborarPago($idelaborarpago) {
        $sql = "select nd.valores from mod_nomina.dat_nominadatos nd
					inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
					where n.idelaborarpago = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchOne($sql, array($idelaborarpago));
    }

    public function obtenerDatosNominaPorElaborarPagoCentroCosto($idelaborarpago) {
        $sql = "select cc.idcentrocosto, nd.* from mod_nomina.dat_nominadatos nd
					inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
					inner join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = n.idplantillanominal)
					inner join mod_nomina.conf_plantillanominalcentrocosto cc on (cc.idplantillanominal = pn.idplantillanominal)
					where n.idelaborarpago = ?
					group by nd.idnominadatos;";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idelaborarpago));
    }

    public function obtenerDatosNominaPlantillaPorElaborarPago($idelaborarpago) {
        $sql = "select n.cajacajero, nd.*, pn.idplantillanominal,pn.orden, pn.codigo, pn.orden ||'-'|| pn.denominacion as denominacion from mod_nomina.dat_nominadatos nd
                                 inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
                                 inner join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = n.idplantillanominal)
                                 where n.idelaborarpago = ? and pn.fechafin is null
                                 order by pn.orden;
					;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idelaborarpago));
    }
	
	public function obtenerDatosNominaPlantillaPorElaborarPagoPDF($idelaborarpago) {
        $sql = "select n.cajacajero, nd.*, pn.idplantillanominal,pn.orden, pn.codigo, pn.orden ||'-'|| pn.denominacion as denominacion from mod_nomina.dat_nominadatos nd
                                 inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
                                 inner join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = n.idplantillanominal)
                                 where n.idelaborarpago = ?
                                 order by pn.orden;
					;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idelaborarpago));
    }

    public function obtenerDatosNominaPlantillaPorElaborarPagoArray($idelaborarpagos) {
        $idelaborarpagos = is_array($idelaborarpagos) ? implode(',', $idelaborarpagos) : $idelaborarpagos;
        $sql = "select n.cajacajero, nd.*, pn.idplantillanominal,pn.orden, pn.codigo, pn.orden ||'-'|| pn.denominacion as denominacion from mod_nomina.dat_nominadatos nd
                                 inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
                                 inner join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = n.idplantillanominal)
                                 where n.idelaborarpago in ({$idelaborarpagos}) and pn.fechafin is null order by pn.orden;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function obtenerDatosNominaEfectivoPorElaborarPago($idelaborarpago) {
        $sql = "select nd.*, n.idplantillanominal from mod_nomina.dat_nominadatos nd
					inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
					where n.idelaborarpago = ? and n.cajacajero = 1;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idelaborarpago));
    }

    public function obtenerDatosNominaCajeroPorArrayElaborarPago($arrayidelaborarpago) {
        $sql = "select nd.valores from mod_nomina.dat_nominadatos nd
					inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
					where n.idelaborarpago in (" . implode(',', $arrayidelaborarpago) . ") and n.cajacajero = 2;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public static function obtenerIdDatosNomina($idnomina) {
        return Doctrine_Query::create()->select('p.idnominadatos AS idnominadatos')
                        ->from('DatNominaDatos p')
                        ->where('p.idnomina = ?', array($idnomina))
                        ->fetchOne()
                ->idnominadatos;
    }
	
	public static function obtenerIdDatosNominaArray($idnomina) {
        $sqlDoctrine = Doctrine_Query::create()->select('p.idnominadatos AS idnominadatos')
                        ->from('DatNominaDatos p')
                        ->where('p.idnomina = ?', array($idnomina))
                        ->fetchArray();
		return $sqlDoctrine;
    }

    public static function obtenerDatosNominaIdNomina($idnomina) {
        $sqlDoctrine = Doctrine_Query::create()->select('count(p.idnominadatos) AS cantidad')
            ->from('DatNominaDatos p')
            ->where('p.idnomina = ?', array($idnomina))
            ->fetchOne()
            ->cantidad;
        return $sqlDoctrine;
    }
	
	public static function existePorIdNomina($idnomina) {
        $sqlDoctrine = Doctrine_Query::create()->select('p.idnominadatos AS idnominadatos')
                        ->from('DatNominaDatos p')
                        ->where('p.idnomina = ?', array($idnomina))
                        ->fetchArray();
        if(count($sqlDoctrine)>0){
		  return "Existe";
		}else{
		  return "No existe";
		}  
    }

    public function obtenerEstructuraNominaPorElaborarPago($idelaborarpago) {
        $sql = "select nd.estructura from mod_nomina.dat_nominadatos nd
					inner join mod_nomina.dat_nomina n on (n.idnomina = nd.idnomina)
					where n.idelaborarpago = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($idelaborarpago));
    }
}
