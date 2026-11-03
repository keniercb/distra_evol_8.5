<?php

class ConfConceptosporTiposySistemasPago extends BaseConfConceptosporTiposySistemasPago {

    public function setUp(){
        parent::setUp();
        
    }
	
	 public static function existeConfConceptosporTiposySistemasPago($idconceptopercepciondescuento, $idtipopago, $identidad, $idsistemapago) {
	    if($idsistemapago == ""){
		//Devolviendo la cantidad total de los CONCEPTOS.
        $query = new Doctrine_Query ();
        $result = $query->from('ConfConceptosporTiposySistemasPago p')
                ->where('idconceptopercepciondescuento = ? and idtipopago = ? and identidad = ?', array($idconceptopercepciondescuento, $idtipopago, $identidad))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
		if(count($result)>0){
		   return "existe";	
	         }else{
		   return "no existe";
		}
		}else{
		//Devolviendo la cantidad total de los CONCEPTOS.
        $query = new Doctrine_Query ();
        $result = $query->from('ConfConceptosporTiposySistemasPago p')
                ->where('idconceptopercepciondescuento = ? and idtipopago = ? and identidad = ? and idsistemapago = ? ', array($idconceptopercepciondescuento, $idtipopago, $identidad, $idsistemapago))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
		if(count($result)>0){
		   return "existe";	
	         }else{
		   return "no existe";
		}
      }
     }

    public static function cantidadConfConceptosporTiposySistemasPagoxEntidadTipoPago($idconceptopercepciondescuento, $idtipopago, $identidad) {
        //Devolviendo la cantidad total de los CONCEPTOS.
        $sql = "select count(ccpsp.idconfconceptosportiposysistemaspago) as cantidad from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
				where idconceptopercepciondescuento = {$idconceptopercepciondescuento} and idtipopago = {$idtipopago} and identidad = {$identidad};";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchOne($sql);
    }

    public static function dadoId($idconceptopercepciondescuento, $idtipopago, $identidad, $idsistemapago) {

        /*$query = new Doctrine_Query ();
        $result = $query->from('ConfConceptosporTiposySistemasPago p')
                ->where('idconceptopercepciondescuento = ? and idtipopago = ? and identidad = ?', array($idconceptopercepciondescuento, $idtipopago, $identidad))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();*/
        return Doctrine_Query::create()
            ->from('ConfConceptosporTiposySistemasPago')
            ->where('idconceptopercepciondescuento = ? and idtipopago = ? and identidad = ?', array($idconceptopercepciondescuento, $idtipopago, $identidad))
            ->fetchArray();

     }
    
    public static function obtenerConfConceptosporTiposySistemasPago($inicio, $limite, $identidad, $idtipopago, $idsistemapago, $sedesglosa, $buscar, $texto) {
		 
		$cadenalimite = (($inicio != null) and ($limite != null)) ? " limit $limite offset $inicio ":" ";
		if($sedesglosa == 1){ //and tcpd.denominacion ilike '%$texto%'
			$sql = "select ccpsp.*, ncpd.*, tcpd.denominacion as tipoconcepto from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			left join mod_nomina.nom_conceptopercepciondescuento ncpd on (ncpd.idconceptopercepciondescuento = ccpsp.idconceptopercepciondescuento)
			left join mod_nomina.nom_tipoconceptopercepciondescuento tcpd on (tcpd.idtipoconceptopd = ncpd.idtipoconceptopd)
			where identidad = ? and idtipopago = ? and idsistemapago = ? and ncpd.denominacion ILIKE '%$texto%' order by ncpd.denominacion". $cadenalimite ." ;";
			$a = array($identidad, $idtipopago, $idsistemapago);
		}else{
			$sql = "select ccpsp.*, ncpd.*, tcpd.denominacion as tipoconcepto from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			left join mod_nomina.nom_conceptopercepciondescuento ncpd on (ncpd.idconceptopercepciondescuento = ccpsp.idconceptopercepciondescuento)
			left join mod_nomina.nom_tipoconceptopercepciondescuento tcpd on (tcpd.idtipoconceptopd = ncpd.idtipoconceptopd)
			where identidad = ? and idtipopago = ? and ncpd.denominacion ILIKE '%$texto%' order by ncpd.denominacion". $cadenalimite ." ;";
			$a = array($identidad, $idtipopago);
		}
		
        $mg = Doctrine_Manager::getInstance();
		$conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, $a);
    }

    public static function obtenerConfConceptosporTiposySistemasPagoPorIdEstructura($identidad, $arrtipospago) {
        $sql = "select ccpsp.*, ccpsp.idtipopago, ncpd.denominacion, ntp.denominacion as denomtipopago  from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			left join mod_nomina.nom_conceptopercepciondescuento ncpd on (ncpd.idconceptopercepciondescuento = ccpsp.idconceptopercepciondescuento)
			left join mod_nomina.nom_tipopago ntp on (ntp.idtipopago = ccpsp.idtipopago)
			where identidad = ? and ccpsp.idtipopago in (" . implode(',', $arrtipospago) . ") order by ncpd.denominacion;";
        $a = array($identidad);
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, $a);
    }
    
    public static function obtenerCantidadConfConceptosporTiposySistemasPago($identidad, $idtipopago, $idsistemapago, $sedesglosa) {
        if($sedesglosa == 1){
			$sql = "select count(ccpsp.*) as cantidad from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			left join mod_nomina.nom_conceptopercepciondescuento ncpd on (ncpd.idconceptopercepciondescuento = ccpsp.idconceptopercepciondescuento)
			left join mod_nomina.nom_tipoconceptopercepciondescuento tcpd on (tcpd.idtipoconceptopd = ncpd.idtipoconceptopd)
			where identidad = ? and  idtipopago = ? and idsistemapago = ? ;";
			$a = array($identidad, $idtipopago, $idsistemapago);
		}else{
			$sql = "select count(ccpsp.*) as cantidad from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			left join mod_nomina.nom_conceptopercepciondescuento ncpd on (ncpd.idconceptopercepciondescuento = ccpsp.idconceptopercepciondescuento)
			left join mod_nomina.nom_tipoconceptopercepciondescuento tcpd on (tcpd.idtipoconceptopd = ncpd.idtipoconceptopd)
			where identidad = ? and idtipopago = ?;";
			$a = array($identidad, $idtipopago);
		}
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $c = $conn->fetchAll($sql, $a);
        return $c[0]['cantidad'];
    }
    
    public static function obtenerExistentes($identidad, $idtipopago, $idsistemapago, $sedesglosa, $arrConceptos) {
        if($sedesglosa == 1){
			$sql = "select * from mod_nomina.conf_conceptosportiposysistemaspago 
			where identidad = ? and idtipopago = ? and idsistemapago = ? and idconceptopercepciondescuento in (".implode(',',$arrConceptos).");";
			$a = array($identidad, $idtipopago, $idsistemapago);
		}else{
			$sql = "select ccpsp.* from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			where identidad = ? and idtipopago = ? and idconceptopercepciondescuento in (".implode(',',$arrConceptos).");";
			$a = array($identidad, $idtipopago);
		}
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, $a);
    }
    
    public static function obtenerConfConceptosExistentes($identidad, $idtipopago, $idsistemapago, $sedesglosa, $arrConceptos) {
        if($sedesglosa == 1){
			$sql = "select distinct ccpsp.idconceptopercepciondescuento, nc.denominacion, 1 as tipo,  nc.idconceptopercepciondescuento as id
			from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			inner join mod_nomina.nom_conceptopercepciondescuento nc on (nc.idconceptopercepciondescuento = ccpsp.idconceptopercepciondescuento)
			inner join mod_nomina.conf_conceptospdformasysistemaspago c1 on (c1.idconfconceptosportiposysistemaspago = ccpsp.idconfconceptosportiposysistemaspago)
			where ccpsp.identidad = ? and ccpsp.idtipopago = ? and ccpsp.idsistemapago = ? and c1.formacalculo = 1 and ccpsp.idconceptopercepciondescuento in (".implode(',',$arrConceptos).");";
			
			$sqlv = "select distinct dv.denominacion, 2 as tipo, dv.idvariableauxconceptospdformasysistemaspago as id, dv.idvariableauxconceptospdformasysistemaspago
			from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			inner join mod_nomina.conf_conceptospdformasysistemaspago c1 on (c1.idconfconceptosportiposysistemaspago = ccpsp.idconfconceptosportiposysistemaspago)
			left join mod_nomina.dat_variableauxconceptospdformasysistemaspago dv on (dv.idconfconceptospdformasysistemaspago = c1.idconfconceptospdformasysistemaspago )
			where ccpsp.identidad = ? and ccpsp.idtipopago = ? and ccpsp.idsistemapago = ? and dv.formaentrada = 1 and ccpsp.idconceptopercepciondescuento in (".implode(',',$arrConceptos).");";
			
			$a = array($identidad, $idtipopago, $idsistemapago);
		}else{
			$sql = "select distinct ccpsp.idconceptopercepciondescuento, nc.denominacion, 1 as tipo,  nc.idconceptopercepciondescuento as id
			from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			inner join mod_nomina.nom_conceptopercepciondescuento nc on (nc.idconceptopercepciondescuento = ccpsp.idconceptopercepciondescuento)
			inner join mod_nomina.conf_conceptospdformasysistemaspago c1 on (c1.idconfconceptosportiposysistemaspago = ccpsp.idconfconceptosportiposysistemaspago)
			where ccpsp.identidad = ? and ccpsp.idtipopago = ? and c1.formacalculo = 1 and ccpsp.idconceptopercepciondescuento in (".implode(',',$arrConceptos).");";
			
			$sqlv = "select distinct dv.idvariableauxconceptospdformasysistemaspago, dv.denominacion, 2 as tipo, dv.idvariableauxconceptospdformasysistemaspago as id
			from mod_nomina.conf_conceptosportiposysistemaspago ccpsp
			inner join mod_nomina.conf_conceptospdformasysistemaspago c1 on (c1.idconfconceptosportiposysistemaspago = ccpsp.idconfconceptosportiposysistemaspago)
			left join mod_nomina.dat_variableauxconceptospdformasysistemaspago dv on (dv.idconfconceptospdformasysistemaspago = c1.idconfconceptospdformasysistemaspago )
			where ccpsp.identidad = ? and ccpsp.idtipopago = ? and dv.formaentrada = 1 and ccpsp.idconceptopercepciondescuento in (".implode(',',$arrConceptos).");";
			
			$a = array($identidad, $idtipopago);
		}
 
		$mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r->conceptos = $conn->fetchAll($sql, $a);
        $r->variables = $conn->fetchAll($sqlv, $a);
        return $r;
    }
    
    public function obtenerTodosCalculoConceptoPDTiposFormasySistemasporPeriodoPago($identidad){
		$sql = "select fsp1.idtipopago, fsp1.idsistemapago, fsp1.idconceptopercepciondescuento, fsp2.idperiodopago, fsp2.formacalculo, fsp2.idexpresionmatematica, dv.idvariableauxconceptospdformasysistemaspago, dv.formaentrada, dv.idconfreportescertificaciones, dv.idvariablesconfreportescertificaciones
					from mod_nomina.conf_conceptosportiposysistemaspago fsp1
					left join mod_nomina.conf_conceptospdformasysistemaspago fsp2 on (fsp2.idconfconceptosportiposysistemaspago = fsp1.idconfconceptosportiposysistemaspago)
					left join mod_nomina.dat_variableauxconceptospdformasysistemaspago dv on (dv.idconfconceptospdformasysistemaspago = fsp2.idconfconceptospdformasysistemaspago)
					where fsp1.identidad = ?;";
		$mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad));
	}

    public function dameIdidconfconceptosportiposysistemaspago($identidad,$idtipopago,$idconceptopercepciondescuento){
        $query = new Doctrine_Query ();
        $result = $query->from('ConfConceptosporTiposySistemasPago p')
            ->where('idconceptopercepciondescuento = ? and idtipopago = ? and identidad = ?', array($idconceptopercepciondescuento, $idtipopago, $identidad))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->fetchOne();
        return $result;
    }
 
}
