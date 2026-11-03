<?php

class DatVariablesPersonasElaborarPagos extends BaseDatVariablesPersonasElaborarPagos {

    public function setUp(){
        parent::setUp();
        $this->hasMany('DatPersonaElaborarPagos', array(
             'local' => 'idpersonaelaborarpagos',
             'foreign' => 'idpersonaelaborarpagos',
             'refClass' => 'DatVariablesPersonasElaborarPagos'
        ));
        $this->hasMany('DatCargosOcupados', array(
             'local' => 'idcargosocupados',
             'foreign' => 'idcargosocupados',
             'refClass' => 'DatVariablesPersonasElaborarPagos'
        ));
        
    }
      
     public static function obtenerVariablesVerificarPersonaElaborarPagos( $origenvariable, $idpersonaelaborarpagos, $idcargosocupados) {
				$id = "";
				switch($origenvariable){
					case 1 : {
						$id = "idconceptopercepciondescuento";
						break;
					}
					case 2 : {
						$id = "idvariableauxconceptospdformasysistemaspago";
						break;
					}
					case 3 : {
						$id = "idvariableauxiliarformula";
						break;
					}
				}
                $sql = "select * from mod_nomina.dat_variablespersonaselaborarpagos	
							where idpersonaelaborarpagos = ?  and origenvariable = ? and idcargosocupados = ?;";
				$mg = Doctrine_Manager::getInstance();
				$conn = $mg->getCurrentConnection();
				$r = $conn->fetchAll($sql, array($idpersonaelaborarpagos, $origenvariable, $idcargosocupados));
				
				$rv = array();
				foreach($r as $i => $v){
					$rv[] = $v[$id];
				}
               return $rv;
    } 
      
        
    public static function obtenerVariablesPersonaElaborarPagos( $idpersonaelaborarpagos, $idcargosocupados) {
                $sql = "select  vpep.*,
								(CASE WHEN vpep.origenvariable = 1 THEN v1.denominacion 
								WHEN vpep.origenvariable = 2 THEN v2.denominacion 
								ELSE v3.denominacion END ) as variable,
								(CASE WHEN vpep.origenvariable = 1 THEN 'Conceptos' 
								WHEN vpep.origenvariable = 2 THEN 'Variables de sistema de pago' 
								ELSE 'Variables de conceptos' END) as tipo,
								(CASE WHEN vpep.origenvariable = 1 THEN 'Tipo de concepto de '||t1.denominacion 
								WHEN vpep.origenvariable = 2 THEN 'Variable auxiliar del concepto de '||v21.denominacion||' en el sistema de pago '|| sp.denominacion
								ELSE 'Variable auxiliar del concepto de '||v31.denominacion END) as detalles
								

							from mod_nomina.dat_variablespersonaselaborarpagos vpep
							left join mod_nomina.nom_conceptopercepciondescuento v1 on (v1.idconceptopercepciondescuento = vpep.idconceptopercepciondescuento)
							left join mod_nomina.nom_tipoconceptopercepciondescuento t1 on (t1.idtipoconceptopd = v1.idtipoconceptopd)

							left join mod_nomina.nom_variableauxiliarformula v3 on (v3.idvariableauxiliarformula = vpep.idvariableauxiliarformula)
							left join mod_nomina.nom_conceptopercepciondescuento v31 on (v31.idconceptopercepciondescuento = v3.idconceptopercepciondescuento)

							left join mod_nomina.dat_variableauxconceptospdformasysistemaspago v2 on (v2.idvariableauxconceptospdformasysistemaspago = vpep.idvariableauxconceptospdformasysistemaspago)
							left join mod_nomina.conf_conceptospdformasysistemaspago conf1 on (conf1.idconfconceptospdformasysistemaspago = v2.idconfconceptospdformasysistemaspago)
							left join mod_nomina.conf_conceptosportiposysistemaspago conf11 on (conf11.idconfconceptosportiposysistemaspago = conf1.idconfconceptosportiposysistemaspago)
							left join mod_nomina.nom_conceptopercepciondescuento v21 on (v21.idconceptopercepciondescuento = conf11.idconceptopercepciondescuento)
							left join mod_nomina.nom_sistemapago sp on (sp.idsistemapago = conf11.idsistemapago)

							where vpep.idpersonaelaborarpagos = ? and vpep.idcargosocupados = ? ORDER BY tipo; ";
				$mg = Doctrine_Manager::getInstance();
				$conn = $mg->getCurrentConnection();
				$r = $conn->fetchAll($sql, array($idpersonaelaborarpagos, $idcargosocupados));
               return $r;
    } 

    public static function obtenerCantidadVariablesPersonaElaborarPagos( $idpersonaelaborarpagos, $idcargosocupados) {
		$sql = "select  COUNT(*) AS cantidad
							from mod_nomina.dat_variablespersonaselaborarpagos	
							where idpersonaelaborarpagos = ? and idcargosocupados = ?;";
				$mg = Doctrine_Manager::getInstance();
				$conn = $mg->getCurrentConnection();
				$r = $conn->fetchAll($sql, array($idpersonaelaborarpagos, $idcargosocupados));
				return $r[0]['cantidad'];
    }
    
    public function devolverValoresVariablesporPeriodosyPersonasCargosOcupados($idelaborarpago, $arrPersonasCargosOcupados){
		$arrPersonas = array(); $arrCargosOcupados = array();
		foreach($arrPersonasCargosOcupados as $i => $p){
			$arrPersonas[] = $p['idpersona'];
			$arrCargosOcupados[] = $p['idcargosocupados'];
		}
		$arrPersonas = array_unique($arrPersonas);
		$arrCargosOcupados = array_unique($arrCargosOcupados);
		
		$sql = "select dpep.idpersona, dvpep.*
					from mod_nomina.dat_personaselaborarpagos dpep
					left join mod_nomina.dat_variablespersonaselaborarpagos dvpep on (dvpep.idpersonaelaborarpagos = dpep.idpersonaelaborarpagos)
					where dpep.idelaborarpagos = ? and dpep.idpersona in (".implode(',', $arrPersonas).") and dvpep.idcargosocupados in (".implode(',', $arrCargosOcupados).");";
							
		$mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
		return $conn->fetchAll($sql, array($idelaborarpago));
		
	}
    
}
