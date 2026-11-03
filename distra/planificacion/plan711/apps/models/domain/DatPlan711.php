<?php

class DatPlan711 extends BaseDatPlan711 {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function listarPlanes711($params){
        $conn = Doctrine_Manager::connection();
        $addWhere = "true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'ejercicio') {
                    $addWhere .= " AND upper(nom_ejercicioplanificacion.ejercicio) LIKE " . "'%" . $datos['data']['value']. "%'";
                }elseif ($datos ['field'] == 'actual') {
                    $addWhere .= " AND dat_plan711.actual= ".$datos['data']['value'];                    
                }elseif ($datos ['field'] == 'montototal') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND dat_plan711.montotoal <{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND dat_plan711.montototal >{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND dat_plan711.montototal ={$datos['data']['value']}";
                    }
                }elseif ($datos ['field'] == 'idestado') {
                    $addWhere .= " AND nom_ejercicioplanificacion.idestado= ".$datos['data']['value'];                    
                }
            }
        } 
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
                
        $sql = "SELECT 
                    nom_ejercicioplanificacion.ejercicio as ejer_real,
                    substr(nom_ejercicioplanificacion.ejercicio,0,5) as ejercicio,
		    nom_datosnomenclador.denominacion as idestado,
                    nom_ejercicioplanificacion.actual, 
                    dat_plan711.montototal, 
                    dat_plan711.idplan711, 
                    dat_plan711.idejercicio,
                    COALESCE (count(mot.idmotivomodif),0) as cantmodif
                  FROM 
                    mod_planificacion.nom_ejercicioplanificacion,
		    mod_planificacion.nom_datosnomenclador,
		    mod_plan711.dat_plan711	
		    left join (SELECT idmotivomodif, identificador
			FROM mod_plan711.dat_motivomodificacion) mot on (
                    mot.identificador like '%'||dat_plan711.idejercicio||'/'||dat_plan711.idplan711||'%')
                  WHERE 
                    nom_ejercicioplanificacion.idejercicio = dat_plan711.idejercicio and 
                    nom_datosnomenclador.iddatosnomenclador = nom_ejercicioplanificacion.idestado and
                    dat_plan711.activo = true
                    and  $addWhere and dat_plan711.idtipoplan = {$params['tipoplan']}
		  GROUP BY nom_ejercicioplanificacion.ejercicio, nom_ejercicioplanificacion.idestado, nom_ejercicioplanificacion.actual,
                    dat_plan711.montototal, 
                    dat_plan711.idplan711, 
                    dat_plan711.idejercicio,
                    nom_datosnomenclador.denominacion
                  order by actual desc $delimitando";
        //print_r($sql);die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarFFyCC($param) {
        $uri= $param['uri'];
        $idejer = $param['idejercicio'];
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true ";
        if ($param['idempimp']) {
            $addWhere.= " and pscc.iddatosempimp = {$param['idempimp']}";
        }
        if ($param['idcc']) {
            $addWhere.= " and pscc.iddatoscc = {$param['idcc']}";
        }
                
        $sql = "SELECT 
                    pscc.monto, 
                    pscc.iddatosff,
                    p.denominacion as denominacionff,
		    pscc.iddatoscc, 	
                    p1.denominacion as denominacioncc,
                    pscc.idplanfuentescc,
                    sum(pscc.monto) over() as total
                    FROM
                        mod_plan711.dat_plan711 p711
                        INNER JOIN mod_plan711.dat_planfuentescc pscc ON (p711.idplan711 = pscc.idplan711)
                        left JOIN mod_planificacion.nom_datosnomenclador p ON (pscc.iddatosff = p.iddatosnomenclador and p.idtiponomenclador = 5001)          
                        INNER JOIN mod_planificacion.nom_datosnomenclador p1 ON (pscc.iddatoscc = p1.iddatosnomenclador)
                        left JOIN mod_planificacion.nom_tiponomenclador p2 ON (p1.idtiponomenclador = p2.idtiponomenclador and p2.uritiponomenclador = '$uri')	
                  WHERE 
                    p711.idplan711 = {$param['idplan711']}
                    and p1.iddatosnomenclador = pscc.iddatoscc $addWhere
                    group by 
                        pscc.monto, 
                        pscc.iddatosff,
                        p.denominacion,
                        pscc.iddatoscc, 	
                        p1.denominacion,
                        pscc.idplanfuentescc    
                    order by denominacioncc";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarFFyCCAux($param) {
        $uri= $param['uri'];
        $idejer = $param['idejercicio'];
        $addWhere = "and true ";
        if ($param['identidad']) {
            $addWhere.= " and identidad = {$param['identidad']}";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    pc.iddatoscc, 	
                    p1.denominacion as denominacioncc,
                    coalesce (dc.valor, 0) as monto
                  FROM 
                    mod_plan711.dat_planfuentescc pc
                    left join mod_plan711.dat_distribucioncodentidad dc on (pc.idplan711 = dc.idplan711 $addWhere  and pc.iddatoscc = dc.iddatoscodigo and dc.idproducto711 is null)          
                    INNER JOIN mod_planificacion.nom_datosnomenclador p1 ON (pc.iddatoscc = p1.iddatosnomenclador)
                  WHERE
                    pc.idplan711={$param['idplan711']}
                    order by denominacioncc";
                    
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarMontoDisponible($param) {
        $uri= $param['uri'];
        $idejer = $param['idejercicio'];
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT pscc.monto as monto,
                    pscc.iddatosff,
                    p.denominacion as denominacionff,
                    pscc.iddatoscc,        
                    p1.denominacion as denominacioncc
                    ,p711.idejercicio
                    ,(select coalesce (sum (d.monto),0) from mod_plan711.dat_distribucion d where (d.idplan711 = pscc.idplan711
                     and d.iddatosff = pscc.iddatosff and d.iddatoscc = pscc.iddatoscc and d.iddatosempimp = {$param['idempimp']}
                                                            )) as totaldistribuido                  
                FROM
                  mod_plan711.dat_plan711 p711
                  INNER JOIN mod_plan711.dat_planfuentescc pscc ON (p711.idplan711 = pscc.idplan711)
                  INNER JOIN mod_planificacion.nom_datosnomenclador p ON (pscc.iddatosff = p.iddatosnomenclador and p.idtiponomenclador = 5001)                  
                  INNER JOIN mod_planificacion.nom_datosnomenclador p1 ON (pscc.iddatoscc = p1.iddatosnomenclador)
                  left JOIN mod_planificacion.nom_tiponomenclador p2 ON (p1.idtiponomenclador = p2.idtiponomenclador and p2.uritiponomenclador = '$uri')
                  where
                  p711.idplan711 = $idejer and pscc.iddatosempimp = {$param['idempimp']}
                  order by
                  pscc.iddatoscc";
        //print_r($sql); die;          
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function adicionarPlan($param, $idejercicio){
        $nuevoplan = new DatPlan711();
        $nuevoplan->montototal = $param['montototal'];
        $nuevoplan->idejercicio = $idejercicio;
        $nuevoplan->idtipoplan = $param['tipoplan'];
        $nuevoplan->activo = true;
        $nuevoplan->save();
        return 1;
    }
    
    public function insertarPlanFuentes($idplan, $distribuc){
        //$nuevoffccplan = new DatPlanFuentesCC();
//        var_dump($distribuc); die;
        foreach ($distribuc as $value) {
            $nuevoffccplan = new DatPlanFuentesCC();
            $nuevoffccplan->idplan711 = $idplan;
            $nuevoffccplan->iddatosff = $value['iddatosff'];
            $nuevoffccplan->iddatoscc = $value['iddatoscc'];
            $nuevoffccplan->iddatosempimp = $value['iddatosempimp'];
            $nuevoffccplan->monto = ($value['monto'] != null) ? $value['monto']: 0;
            $nuevoffccplan->save();
        }
        return 1;
    }
    
    public function insertarDistribuncionCod($idplan, $distribuc, $parametros){
        
        foreach ($parametros['relcodind'] as $value2) {
            foreach ($value2[1] as $value3) {
                $nuevodistcod = new DatDistribucioncod();
                $nuevodistcod->idplan711 = $idplan;
                $nuevodistcod->idproducto711 = $value3[2];
                $nuevodistcod->iddatoscodigo = $value2[0][0];
                $nuevodistcod->iddatosempimp = $parametros['idempimp'];
                $nuevodistcod->valor = ($value3[6] != null) ? floatval(str_replace(',','',$value3[6])) : 0;
                $nuevodistcod->precio = ($value3[5] != null) ? floatval(str_replace(',','',$value3[5])) : NULL;
                $nuevodistcod->cantidad = ($value3[4] != null) ? $value3[4] : NULL;
                $nuevodistcod->save();
            }
        }
        
        return 1;
    }
    
    public function ActualizarFFyCC($parametros, $idplan, $distribuc){
        $conn = Doctrine_Manager::connection();
        $addWhere = "true ";
        foreach ($distribuc as $value) {
            if($parametros['tipoplan']!=1255){
                $addWhere = "iddatosff = {$value['iddatosff']}";
            }
            $query = "UPDATE mod_plan711.dat_planfuentescc
                        SET monto={$value['monto']}
                      WHERE $addWhere and iddatoscc = {$value['iddatoscc']} and idplan711 = $idplan and iddatosempimp = {$value['iddatosempimp']}";
            $conn->execute($query);
            $sql = "Select monto from mod_plan711.dat_planfuentescc where $addWhere and iddatoscc = {$value['iddatoscc']} and iddatosempimp = {$value['iddatosempimp']} and idplan711 = $idplan";
            $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            //var_dump($value['iddatosempimp']); 
            //print_r($arrayResult); die;
            if(count($arrayResult)==0){
                $nuevoffccplan = new DatPlanFuentesCC();
                $nuevoffccplan->idplan711 = $idplan;
                $nuevoffccplan->iddatosff = $value['iddatosff'];
                $nuevoffccplan->iddatoscc = $value['iddatoscc'];
                $nuevoffccplan->iddatosempimp = $value['iddatosempimp'];
                $nuevoffccplan->monto = ($value['monto'] != null) ? $value['monto']: 0;
                $nuevoffccplan->save();
            }
        }
        
        return 1;
    }
    public function ActualizarMontoPrecios($parametros, $idplan, $distribuc){
        
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT iddistribucioncodentidad, idplan711, identidad, iddatoscodigo, 
                        idproducto711, iddatosempimp, cantidad, valor, precio
                   FROM mod_plan711.dat_distribucioncodentidad
                   WHERE idplan711 = $idplan and cantidad is not null";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);        
        
        $addWhere = "true ";
        foreach ($parametros['relcodind'] as $value) {
            foreach ($value[1] as $value2) {
                foreach ($arrayResult as $value3){
                    //var_dump($value3['idproducto711']); die;
                    if($value2[2]==$value3['idproducto711']){
                        $val=floatval($value2[5])*floatval($value3['cantidad']);
                        $query = "UPDATE mod_plan711.dat_distribucioncodentidad
                                SET valor=$val, precio={$value2[5]}
                              WHERE idplan711 = $idplan and identidad={$value3['identidad']} and iddistribucioncodentidad={$value3['iddistribucioncodentidad']}";
                        $conn->execute($query); 
                    }
                                                                                                       
                }
            }
        }
        return 1;
    }
    
    public function cambiarEstado($param) {
        $modelonomenclador = new NomDatosnomenclador();
        $valor->uri = 'estadosejercicio';
        $resultados2 = $modelonomenclador->getDatosNomPorUriTipoNomIdestado($valor);
        $idestado= null;
        foreach ($resultados2 as $value){
            if ($value['denominacion']== $param['estado']){
                $idestado= $value['iddatosnomenclador'];
            }
        }
        $conn = Doctrine_Manager::connection();
          
            $query = "UPDATE mod_planificacion.nom_ejercicioplanificacion
                        SET idestado=$idestado
                      WHERE idejercicio = {$param['idejercicio']}";
            $conn->execute($query);
        return 1;
    }
    
    public function listarDistribucionCod($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dc.iddistribucioncod,
                    dc.idproducto711,
                    dc.iddatoscodigo,
                   coalesce (ni.denominacion, p.denominacion) as denominacion,
                    um.denominacionunidadmedida,
                    um.abreviaturaunidadmedida,
                    dc.valor,
                    dc.cantidad,
                    dc.precio,
                    dn.denominacion as denominaciondatoscodigo,
                    dn2.denominacion as denom2,
                    ni.idindicador as ind,
                    ni.codigo,
                    ni.numeropieza,
                    p.idproducto711 as pi711
                  FROM
                    mod_plan711.dat_distribucioncod dc
                    LEFT OUTER JOIN mod_datosmaestros.nom_indicador ni ON (ni.idindicador = dc.idproducto711)
                    LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (ni.idumedida = um.idunidadmedida)
                    LEFT OUTER JOIN mod_plan711.dat_producto711 p ON (dc.idproducto711 = p.idproducto711)
                    LEFT OUTER JOIN mod_planificacion.nom_datosnomenclador dn ON (p.iddatostipocodigo = dn.iddatosnomenclador)
                    LEFT OUTER JOIN mod_planificacion.nom_datosnomenclador dn2 ON (p.iddatoscodigo = dn2.iddatosnomenclador)
                    where (dc.idplan711 = {$param['idplan711']})
                    order by denominacion asc
                  ";
                            
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarDistribucionCodAux($idplan) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT iddistribucioncod, idplan711, idproducto711, valor, iddatoscodigo, 
                        iddatosempimp, cantidad, precio
                   FROM mod_plan711.dat_distribucioncod
                  WHERE 
                    dat_distribucioncod.idplan711 = $idplan";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function EliminarDistribCod($idplan){
        $conn = Doctrine_Manager::connection();
        $query = "DELETE FROM mod_plan711.dat_distribucioncod
                    WHERE idplan711 = $idplan";
        $conn->execute($query);
        return 1;
    }
    
}
