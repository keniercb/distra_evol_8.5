<?php

class DatDistribucion extends BaseDatDistribucion {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function MontoTotal($parametros){
        $conn = Doctrine_Manager::connection();
        $addWhere = "true";
        $addWhere = "and true";
        $addWhereFF = "";
        $salidaiddatosff = "0";
        $salidamontoff = "0";
        $leftjoin =", ";
        
        if ($parametros['idempimp']) {
            $addWhere .= " AND dat_distribucion.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere .= " AND dat_distribucion.iddatoscc = {$parametros['idcc']}";
        }
        if ($parametros['idff']) {
            $addWhere .= " AND dat_distribucion.iddatosff = {$parametros['idff']}";
        }
        if ($parametros['idejercicio']) {
            $addWhere .= " AND dat_plan711.idplan711 = {$parametros['idejercicio']}";
        }
        if ($parametros['identidad']) {
            $addWhere .= " AND dat_distribucion.identidad = {$parametros['identidad']}";
        }
        
        $addWhere1 = "true";
        if ($parametros['idplan711']) {
            $addWhere1 .= " AND dat_plan711.idplan711 = {$parametros['idplan711']}";
        }
        if ($parametros ['identidad']) {
            $addWhere1 .= " AND dat_solicitud711.identidadcliente = {$parametros ['identidad']}" ;
        }
        if ($parametros['idempimp']) {
            $addWhere1 .= " AND dat_solicitud711.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere1 .= " AND dat_solicitud711.iddatoscc = {$parametros['idcc']}";
        }
        if ($parametros['tipoplan']) {
            $addWhere1 .= " AND dat_solicitud711.idtiposolicitudplan = {$parametros['tipoplan']}";
        }
        if ($parametros['idff']) {
            $salidaiddatosff = "solicitudF.iddatosff";
            $salidamontoff = "solicitudF.montoff";
            $leftjoin ="left join (SELECT idsolicitud711, iddatosff, sum(monto) as montoff
                        FROM mod_plan711.dat_solicitudfuentesf $addWhereFF group by idsolicitud711, iddatosff) solicitudF on (solicitudF.idsolicitud711 = dat_solicitud711.idsolicitud711), 
                     ";
            $addWhere1 .= " AND ((dat_solicitud711.iddatosffsol is not null and dat_solicitud711.iddatosffsol = {$parametros['idff']}) OR solicitudF.iddatosff = {$parametros['idff']})";
            $addWhereFF .= "where dat_solicitudfuentesf.iddatosff = {$parametros['idff']}";
        }
                
        $sql = "Select 
                   Coalesce((suma1.total1-suma2.total2),0.000000) as montototal
                from
            (SELECT 
            sum(dat_distribucion.monto) as total1
          FROM 
            mod_plan711.dat_plan711, 
            mod_plan711.dat_distribucion
          WHERE 
            dat_plan711.idplan711 = dat_distribucion.idplan711 $addWhere) as suma1, 
            (Select 
       Coalesce(sum(Coalesce(solicitudF.montoff,suministrototal)),0.000000) as total2
	FROM mod_plan711.dat_solicitud711
		left join (SELECT idsolicitud711, iddatosff, sum(monto) as montoff
                        FROM mod_plan711.dat_solicitudfuentesf $addWhereFF 
                        group by idsolicitud711, iddatosff) solicitudF on (solicitudF.idsolicitud711 = dat_solicitud711.idsolicitud711),  
                mod_plan711.dat_plan711
                where $addWhere1 AND dat_solicitud711.idplan711 = dat_plan711.idplan711 AND
                     iddatosestado != 5060 
                     ) as suma2";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        
        
//                
//        $sql = "Select 
//       Coalesce(sum(Coalesce(importeejecutado,importepedido)),0.00) as total
//	FROM mod_plan711.dat_solicitud711 where $addWhere";
        
        return $arrayResult;
    }
    
    public function listarDistribucion($parametros) {
        //$uri= $param['uri'];
        $addWhere="and true";
        if ($parametros['idempimp']) {
            $addWhere .= " and dat_distribucion.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere .= " and p1.iddatosnomenclador = {$parametros['idcc']}";
        }
        if ($parametros['idff']) {
            $addWhere .= " and p.iddatosnomenclador = {$parametros['idff']}";
        }
        if ($parametros['identidad']) {
            $addWhere .= " and dat_distribucion.identidad = {$parametros['identidad']} ";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dat_distribucion.monto as monto, 
                    dat_distribucion.iddatosff,
                    p.denominacion as denominacionff,
		    dat_distribucion.iddatoscc, 	
                    p1.denominacion as denominacioncc,
                    sum(dat_distribucion.monto) over() as total
                  FROM 
                    mod_plan711.dat_plan711, 
                    mod_plan711.dat_distribucion,
                    (Select nom_datosnomenclador.denominacion, nom_datosnomenclador.iddatosnomenclador from mod_planificacion.nom_datosnomenclador  
			where nom_datosnomenclador.idtiponomenclador = 5001) as p,
		    (Select nom_datosnomenclador.denominacion, nom_datosnomenclador.iddatosnomenclador from mod_planificacion.nom_datosnomenclador  
			where nom_datosnomenclador.idtiponomenclador = 5002) as p1		
                  WHERE 
                    dat_plan711.idplan711 = dat_distribucion.idplan711 AND
                    dat_plan711.idplan711 = {$parametros['idejercicio']}  
                    and p.iddatosnomenclador = dat_distribucion.iddatosff $addWhere and p1.iddatosnomenclador = dat_distribucion.iddatoscc
                  group by monto, 
                    dat_distribucion.iddatosff,
                    denominacionff,
		    dat_distribucion.iddatoscc, 	
                    denominacioncc";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function  adicionarModificarDistr($parametros, $distribuc){
        
        $conn = Doctrine_Manager::connection();
        /*$idp= Doctrine::getTable('DatPlan711')
                        ->findByDql("idejercicio= {$parametros['idejercicio']}");*/
        $idplan = $parametros['idejercicio'];              
        
        $sqldelete = "DELETE FROM mod_plan711.dat_distribucion
                            WHERE iddatosempimp = {$parametros['idempimp']} and identidad = {$parametros['identidad']}"
                            . "and idplan711 = $idplan";
        $conn->execute($sqldelete);
        
        $modelonomenclador = new NomDatosnomenclador();
        $valor->uri = 'Conceptodecompra';
        $resultados2 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $arrayaux = array();
        $cont=0;
        for ($i = 0; $i < count($resultados2); $i++) {
            if ($resultados2[$i]['denominacion'] != '-') {
                for ($index1 = 0; $index1 < count($distribuc); $index1++) {
                    $arrayaux[$cont]['idplan711']= $idplan;
                    $arrayaux[$cont]['iddatosff']= $distribuc[$index1]['iddatosff'];
                    $arrayaux[$cont]['iddatoscc']= $resultados2[$i]['iddatosnomenclador'];
                    $arrayaux[$cont]['iddatosempimp']= $parametros['idempimp'];
                    $arrayaux[$cont]['identidad']= $parametros['identidad'];
                    $arrayaux[$cont]['monto']= floatval(str_replace(',','',$distribuc[$index1][$resultados2[$i]['iddatosnomenclador']]));
                    $cont++;
                }
            }
        }
        
        for ($i = 0; $i < count($arrayaux); $i++) {
            $sqlinsert = "INSERT INTO mod_plan711.dat_distribucion(
                                idplan711, iddatosff, iddatoscc, iddatosempimp, 
                                identidad, monto)
                        VALUES ({$arrayaux[$i]['idplan711']}, {$arrayaux[$i]['iddatosff']}, {$arrayaux[$i]['iddatoscc']},
                            {$arrayaux[$i]['iddatosempimp']}, 
                                {$arrayaux[$i]['identidad']}, {$arrayaux[$i]['monto']})";
            $conn->execute($sqlinsert);                    
        }
        
        return 1;
    }
}
