<?php

class DatSolicitud711 extends BaseDatSolicitud711 {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function adicionarSolicitud711($parametros){

        $idp = $parametros['idejercicio'];
        $denomejer = $parametros['ejercicio'];
        
        $newsol = new DatSolicitud711();
        $newsol->idplan711 = $idp;
        $newsol->nosolicitud = $parametros ['nosolicit'];
        $newsol->identidadcliente = $parametros['idempcliente'];
        $newsol->idtiposolicitudplan= $parametros['tipoplan'];
        if($parametros['tipoplan']==1254){
            $newsol->identidaddestino = $parametros['idempdestino'];
            $newsol->iddatosffsol= $parametros['idff'];
            $newsol->otrosgastos= $parametros['otrosg'];
            $newsol->idcodigodecc= $parametros['idcodigodecc'];
            $newsol->iddatosffsol_old= $parametros['idff'];
            $newsol->textnosolicitudo= 'PN-'.$parametros['abreviatura'].'-'.$denomejer.'/'.$parametros ['nosolicit'];
        }
        if($parametros['tipoplan']==1255){
            $newsol->estaconsolidada= false;
            $newsol->paraconsolidar= $parametros['paraconsolidar'];
            $newsol->esconsolidada = $parametros['esconsolidada'];
            $newsol->iddatostarea = $parametros['idtarea'];
            $newsol->idproductoindicador = $parametros['indicador'];
            $codigoaprob= 'TI 15 FAR '.substr($denomejer,2,2);
            $newsol->codigoaprob = $parametros['nombrecliente'];
            $newsol->textnosolicitudo= 'DIP-'.$parametros['abreviatura'].'-'.$denomejer.'/'.$parametros ['nosolicit'];
        }
        
        $newsol->iddirector= $parametros['iddirector'];
        $newsol->idespecialista= $parametros['idespecialista'];
        $newsol->iddirectorecon= $parametros['iddirectorecon'];
        $newsol->idespecialistacs= ($parametros['idespecialistacs'] == "") ? NULL : $parametros['idespecialistacs']; 
        $newsol->idcomprador= ($parametros['idcomprador'] == "") ? NULL : $parametros['idcomprador'];
        $newsol->iddatosempimp= $parametros['idempimp'];        
        $newsol->iddatoscc= $parametros['idcc'];
        $newsol->iddatosestado= 5040;
        $newsol->descripciongeneral= $parametros['descripgen'];
        
        $newsol->totalgeneral= $parametros['totalg'];
        $newsol->suministrototal= $parametros['suminist'];
        $newsol->flete= $parametros['flete'];
        $newsol->seguro= $parametros['seguro'];
        $newsol->antecedentes= $parametros['antecedentes'];
        $newsol->lugarentrega= $parametros['lugarent'];
        $newsol->nombreentidad= $parametros['nombreentidad'];
        $newsol->iddatosgrupcomercial= ($parametros['idgrupcom'] == "") ? NULL : $parametros['idgrupcom'];
        $newsol->idcodigocupdunas= ($parametros['idcodigocupdunas'] == "") ? NULL : $parametros['idcodigocupdunas'];
        
        //print_r($newsol); die;
        $newsol->save();
        Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        return $newsol;
    }
    
    public function modificarSolicitud711($parametros){
		
	$conn = Doctrine_Manager::connection();
            
            $identidaddestino = ($parametros['idempdestino'] != null) ? $parametros['idempdestino'] : 'null';
            $suministrototal = ($parametros['suminist'] != null) ? $parametros['suminist'] : 'null';
            $otrosgastos = ($parametros['otrosg'] != null) ? $parametros['otrosg'] : 'null';
            $idespecialista = ($parametros['otrosg'] != null) ? $parametros['otrosg'] : 'null';
            $idespecialistacs = ($parametros['idespecialistacs'] == "") ? "NULL" : $parametros['idespecialistacs']; 
            $idcomprador = ($parametros['idcomprador'] == "") ? "NULL" : $parametros['idcomprador'];
            $iddatosgrupcomercial = ($parametros['idgrupcom'] == "") ? "NULL" : $parametros['idgrupcom'];
            //if ($parametros['tipoplan'] == 1255) {
                $idtarea= ($parametros['idtarea'] == "") ? "NULL" : $parametros['idtarea'];
                $indicador =  ($parametros['indicador'] == "") ? "NULL" : $parametros['indicador'];
            //}
                $idff= ($parametros['idff'] == "") ? "NULL" : $parametros['idff'];
		$paraconsolidar= ($parametros['paraconsolidar'] == "") ? "NULL" : $parametros['paraconsolidar'];
        
            $iddatosgrupcomercial = ($parametros['idgrupcom'] == "") ? "NULL" : $parametros['idgrupcom'];
            $idcodigocupdunas = ($parametros['idcodigocupdunas'] == "") ? "NULL" : $parametros['idcodigocupdunas'];
            $nombrecliente = ($parametros['nombrecliente'] == "") ? "NULL" : $parametros['nombrecliente'];
            $sqlupd = "UPDATE mod_plan711.dat_solicitud711
                SET 
                   identidaddestino = $identidaddestino,
                   idespecialista= {$parametros['idespecialista']},
                   idespecialistacs= $idespecialistacs,
                   idcomprador= $idcomprador,
                   iddatosffsol= $idff,
                   iddatosffsol_old= $idff,
                   iddatosestado= 5041,
                   descripciongeneral= '{$parametros['descripgen']}',
                   suministrototal= $suministrototal,
                   otrosgastos= $otrosgastos,
                   totalgeneral= {$parametros['totalg']},
                   flete= {$parametros['flete']},
                   seguro= {$parametros['seguro']},
                   antecedentes= '{$parametros['antecedentes']}',
                   lugarentrega= '{$parametros['lugarent']}',
                   iddatosgrupcomercial= $iddatosgrupcomercial,
                   iddatostarea= $idtarea,
                   idproductoindicador= $indicador,
                   idcodigocupdunas= $idcodigocupdunas,
                   paraconsolidar= $paraconsolidar, 	
                   codigoaprob= '$nombrecliente' 	
              WHERE idsolicitud711 = {$parametros['idsolicitud711']}";
            $conn->execute($sqlupd);     
        return 1;
    }
    
    public function ActualizarValorReal($parametros){
        //print_r($parametros);die;
		
	$conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_solicitud711
                SET 
                   valorreal= '{$parametros['montoreal']}'
              WHERE idsolicitud711 = {$parametros['idsolicitud711']}";
        if ($parametros['montoreal'] == 0) {
            $sqlupd = "UPDATE mod_plan711.dat_solicitud711
                SET 
                   valorreal= null
              WHERE idsolicitud711 = {$parametros['idsolicitud711']}";
        }
        //print_r($sqlupd); die;
            $conn->execute($sqlupd);     
        return 1;
    }
    
    public function ActualizarFFSol($idsolicitud){	
	$conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_solicitud711
                SET 
                   iddatosffsol= null
              WHERE idsolicitud711 = $idsolicitud";
            $conn->execute($sqlupd);     
        return 1;
    }
    
    public function AdicionarProductos($productos, $solicitud){
	$conn = Doctrine_Manager::connection();
        for ($i = 0; $i < count($productos); $i++) {
            $t1 = ($productos[$i]['trimestre1'] != null) ? $productos[$i]['trimestre1'] : 0;
            $t2 = ($productos[$i]['trimestre2'] != null) ? $productos[$i]['trimestre2'] : 0;
            $t3 = ($productos[$i]['trimestre3'] != null) ? $productos[$i]['trimestre3'] : 0;
            $t4 = ($productos[$i]['trimestre4'] != null) ? $productos[$i]['trimestre4'] : 0;
            $p = floatval($productos[$i]['precio']);
            $sqlinsert = "INSERT INTO mod_plan711.dat_solicitudproductos(
                                    idsolicitud711, idproducto711, cantidad, 
                                    trimestre1, trimestre2, trimestre3, trimestre4, precio, descripcion, urlimagen, nombreimg)
                            VALUES ($solicitud, {$productos[$i]['idproducto711']}, {$productos[$i]['cantidad']}, 
                                    $t1,$t2, $t3, $t4,{$p}, '{$productos[$i]['descripcion']}','{$productos[$i]['urlimagen']}', '{$productos[$i]['nombreimg']}')";
            $conn->execute($sqlinsert);                    
        }
        return 1;
    }
    
    public function EliminarProductos($solicitud){
	$conn = Doctrine_Manager::connection();
            $sqldel = "DELETE FROM mod_plan711.dat_solicitudproductos
                        WHERE idsolicitud711 =$solicitud";
            $conn->execute($sqldel);     
        return 1;
    }
	
    public function AdicionarServSol($servsol, $solicitud){
	$conn = Doctrine_Manager::connection();
        for ($i = 0; $i < count($servsol); $i++) {
            $sqlinsert = "INSERT INTO mod_plan711.dat_solicitudservsol(
								idsolicitud711, iddatosservsol)
							VALUES ($solicitud, {$servsol[$i]})";
            $conn->execute($sqlinsert);                    
        }
        return 1;
    }
	
    public function EliminarServSol($solicitud){
	$conn = Doctrine_Manager::connection();
            $sqldel = "DELETE FROM mod_plan711.dat_solicitudservsol
                        WHERE idsolicitud711 =$solicitud";
            $conn->execute($sqldel);      
        return 1;
    }
    
    public function AdicionarFuenteSol($fuente,$solicitud, $monto, $idcontrato){
        $monto = floatval(str_replace(',','',$monto));
	$conn = Doctrine_Manager::connection();
        $sqlinsert = "INSERT INTO mod_plan711.dat_solicitudfuentesf(
                                    idsolicitud711, iddatosff, monto, idcontrato)
                            VALUES ($solicitud, $fuente, $monto, $idcontrato)";
        $conn->execute($sqlinsert);
        return 1;
    }
	
    public function listarSolicitudes711($parametros) {
        $idplan= $parametros['idplan711'];
        $idejercicio= $parametros['idejercicio'];        
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        $addWhereFF = "";
        $salidaiddatosff = "0";
        $salidamontoff = "0";
        $leftjoin ="";
        $orderby="";
		
        if ($parametros['idejercicio']) {
            $addWhere .= " AND dat_plan711.idplan711 = {$parametros['idejercicio']}";
        }
        if ($parametros['idplan711']) {
            $addWhere .= " AND dat_solicitud711.idplan711 = {$parametros['idplan711']}";
        }
        if ($parametros ['identidad']) {
            $addWhere .= " AND dat_solicitud711.identidadcliente = {$parametros ['identidad']}" ;
        }
        if ($parametros['idempimp']) {
            $addWhere .= " AND dat_solicitud711.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere .= " AND dat_solicitud711.iddatoscc = {$parametros['idcc']}";
        }
	if ($parametros['paraconsolidar']) {
            $addWhere .= " AND dat_solicitud711.paraconsolidar = {$parametros['paraconsolidar']}";
        }
        if ($parametros['fechainicio'] || $parametros['fechafin']) {
            $addWhere .= " AND dat_solicitud711.fechacreacion between '{$parametros['fechainicio']}' and '{$parametros['fechafin']}'";
        }
        if ($parametros['idff']) {
            $salidaiddatosff = "solicitudF.iddatosff";
            $salidamontoff = "solicitudF.montoff";
            $addWhere .= " AND ((dat_solicitud711.iddatosffsol is not null and dat_solicitud711.iddatosffsol = {$parametros['idff']}) OR solicitudF.iddatosff = {$parametros['idff']})";
            $addWhereFF .= "where dat_solicitudfuentesf.iddatosff = {$parametros['idff']}";
            
            $leftjoin ="left join (SELECT idsolicitud711, iddatosff, sum(monto) as montoff
                        FROM mod_plan711.dat_solicitudfuentesf $addWhereFF group by idsolicitud711, iddatosff) solicitudF on (solicitudF.idsolicitud711 = dat_solicitud711.idsolicitud711) 
                     ";
        }
        if ($parametros['tipoplan']) {
            $addWhere .= " AND dat_solicitud711.idtiposolicitudplan = {$parametros['tipoplan']}";
        }
        if ($parametros['esconsolidada']==true) {
                $addWhere .= " AND ((dat_solicitud711.idsolicitud711 in (SELECT idsolicitud711consolidad as idsolicitud711
                                        FROM mod_plan711.dat_solicitudconsolidad where idsolicitud711padre = {$parametros['idsolicitud711']})) 
                                            or 
                                        (dat_solicitud711.idsolicitud711 not in (SELECT idsolicitud711consolidad as idsolicitud711
                                        FROM mod_plan711.dat_solicitudconsolidad where idsolicitud711padre != {$parametros['idsolicitud711']}) or dat_solicitud711.paraconsolidar != true))
				
				";
                $orderby="dat_solicitud711.estaconsolidada desc,";                        
        }
        if ($parametros['pacon']==1 && $parametros['idsolicitud711']==null) {
                $addWhere .= " AND (dat_solicitud711.estaconsolidada != true and dat_solicitud711.esconsolidada != true) and "
                        . "(spp.iddatossituacion= 5018 or spp.iddatossituacion= 5019 or spp.iddatossituacion= 5021 or spp.iddatossituacion= 5022 or spp.iddatossituacion is null) and "
                        . "dat_solicitud711.iddatosestado = 5042";
        }
        if ($parametros['idsolicitud711']!=null && $parametros['esconsolidada']==false) {
                $addWhere .= " AND dat_solicitud711.idsolicitud711 = {$parametros['idsolicitud711']}";
        }
        if ($parametros['revision']!=null) {
                $addWhere .= " AND (dat_solicitud711.estaconsolidada != true and dat_solicitud711.esconsolidada != true) ";
        }
        if ($parametros['nosolicitud']!=null) {
                $addWhere .= " AND upper(dat_solicitud711.textnosolicitudo) LIKE " . "upper('%" . $parametros['nosolicitud']. "%')";
        }
        if ($parametros['descripcion']!=null) {
                $addWhere .= " AND upper(dat_solicitud711.descripciongeneral) LIKE " . "upper('%" . $parametros['descripcion']. "%')";
        }
        if ($parametros['anno']!=null) {
                $addWhere.=" AND nom_ejercicioplanificacion.ejercicio = '{$parametros['anno']}'";
        }
        
        if ($parametros['idindicador']!=null) {
                $addWhere.=" AND dat_solicitud711.idproductoindicador = {$parametros['idindicador']}";
        }
        
        if ($parametros['serv']!=null) {
            ///$addWhere.=" AND dat_solicitud711.valorreal is not null ";
        }
        $leftjoin .=", ";
        if ($parametros['filtros']) {
                foreach ($parametros['filtros'] as $datos) {
                    if ($datos['field'] == 'nosolicitud') {
                        $addWhere .= " AND upper(dat_solicitud711.textnosolicitudo) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    }elseif ($datos ['field'] == 'nombreentidad') {
                        $addWhere .= " AND upper(dat_solicitud711.nombreentidad) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    }elseif ($datos ['field'] == 'denominacion') {
                        $addWhere .= " AND upper(dat_solicitud711.descripciongeneral) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    }elseif ($datos ['field'] == 'descripciongeneral') {
                        $addWhere .= " AND upper(dat_solicitud711.descripciongeneral) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    } else if ($datos ['field'] == 'fecha') {
                        $fecha = explode('/', $datos ['data']['value']);
                        $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                        if ($datos['data']['comparison'] == 'lt') {
                            $condiciones[] = " obs.fecha::date<'{$fecha}'";
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $condiciones[] = " obs.fecha::date>'{$fecha}'";
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $condiciones[] = "  obs.fecha::date='{$fecha}'";
                        }
                    }elseif ($datos ['field'] == 'suministrototal') {
                        if ($datos['data']['comparison'] == 'lt') {
                            $addWhere .= " AND dat_solicitud711.suministrototal <{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $addWhere .= " AND dat_solicitud711.suministrototal >{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $addWhere .= " AND dat_solicitud711.suministrototal ={$datos['data']['value']}";
                        }
                    }elseif ($datos ['field'] == 'valorreal') {
                        if ($datos['data']['comparison'] == 'lt') {
                            $addWhere .= " AND dat_solicitud711.valorreal <{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $addWhere .= " AND dat_solicitud711.valorreal >{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $addWhere .= " AND dat_solicitud711.valorreal ={$datos['data']['value']}";
                        }
                    }elseif ($datos ['field'] == 'totalgeneral') {
                        if ($datos['data']['comparison'] == 'lt') {
                            $addWhere .= " AND dat_solicitud711.totalgeneral <{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $addWhere .= " AND dat_solicitud711.totalgeneral >{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $addWhere .= " AND dat_solicitud711.totalgeneral ={$datos['data']['value']}";
                        }    
                    }elseif ($datos ['field'] == 'gerente') {
                        $addWhere .= " AND upper(pers.nombre) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                  
                    }
                    elseif ($datos ['field'] =='paraconsolidar') {
			$addWhere .= " AND dat_solicitud711.paraconsolidar = {$datos['data']['value']}";
                    }	
                    elseif ($datos ['field'] == 'situacionpedido') {
                        $addWhere .= " AND upper (n2.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }
                    /*elseif ($datos ['field'] == 'numeropieza') {
                        $addWhere .= " AND upper (numeropieza) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }elseif ($datos ['field'] == 'clasificacion') {
                        $addWhere .= " AND upper (tc.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }elseif ($datos ['field'] == 'codigo') {
                        $addWhere .= " AND upper (dc.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";     */              
                }
            }
            

        $delimitando = "";
        if ($parametros['start'] != null && $parametros['limit'] != null) {
            $start = $parametros['start'];
            $limit = $parametros['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }

        //print_r($sql); die;
        $sql = "SELECT 
                    dat_solicitud711.idsolicitud711, 
                    dat_solicitud711.idplan711, 
                    dat_solicitud711.identidadcliente, 
                    dat_solicitud711.identidaddestino, 
                    dat_solicitud711.iddatosempimp, 
                    $salidaiddatosff as iddatosff,  
                    $salidamontoff as montoff,  
                    dat_solicitud711.iddatoscc, 
                    dat_solicitud711.iddatosestado,
                    n1.denominacion,
                    dat_solicitud711.fechapresped, 
                    dat_solicitud711.fechacreacion,
                    dat_solicitud711.descripciongeneral, 
                    dat_solicitud711.suministrototal, 
                    dat_solicitud711.otrosgastos, 
                    dat_solicitud711.totalgeneral, 
                    dat_solicitud711.flete,
                    (dat_solicitud711.suministrototal::numeric*(dat_solicitud711.flete::numeric/100)) as valorflete,
                    dat_solicitud711.seguro, 
                    (dat_solicitud711.suministrototal::numeric*(dat_solicitud711.seguro::numeric/100)) as valorseguro, 
                    dat_solicitud711.antecedentes, 
                    dat_solicitud711.lugarentrega, 
                    dat_solicitud711.nosolicitud as n, 
                    dat_solicitud711.nopedido, 
                    dat_codigodecc.codigo,
                    dat_codigodecc.idcodigodecc,
                    n2.denominacion as situacionpedido,
                    n2.iddatosnomenclador as idsp,
                    nom_ejercicioplanificacion.ejercicio,
                    pers.nombre as gerente,
                    dat_solicitud711.idespecialista,
                    dat_solicitud711.idgerente,
                    dat_solicitud711.iddirector,
                    dat_solicitud711.aperturacredito,
                    dat_solicitud711.valorreal,
                    spp.iddatossituacion,
                    dat_solicitud711.textnosolicitudo as nosolicitud,
                    dat_solicitud711.paraconsolidar,
                    dat_solicitud711.estaconsolidada,
                    dat_solicitud711.esconsolidada,
                    dat_solicitud711.iddatostarea,
                    dat_solicitud711.iddirectorecon,
                    dat_solicitud711.idespecialistacs,
                    dat_solicitud711.idcomprador,
                    dat_solicitud711.idtiposolicitudplan,                    
                    dat_solicitud711.idcodigocupdunas,                    
                    dat_solicitud711.nombreentidad,
                    dat_solicitud711.codigoaprob,
                    dat_solicitud711.iddatosgrupcomercial,
                    dat_solicitud711.idproductoindicador,
                    dat_solicitud711.listaaprobacion,
                    dat_solicitud711.iddatosffsol as idfuente,
                    dat_producto711.denominacion as indicador,
                    dat_solicitud711.codigoaprob as nombrecliente,
                    sum(Coalesce(sum(Coalesce(valorreal,totalgeneral)),0.000000)) over() as totalpresentado,
                    sum (Case when (idgerente is not null) then Coalesce(Coalesce(valorreal,totalgeneral), 0.000000) else 0.000000 end) over() as totalpresentdoimport,
                    sum (Case when (esconsolidada = false or esconsolidada is null) then Coalesce(Coalesce(valorreal,totalgeneral), 0.000000) else 0.000000 end) over() as valorfar,
                    count(dat_solicitud711.idsolicitud711) over() as totalsolitudes,
                    sum(suministrototal) over() as totalsolicitado,
                    sum(Case when esconsolidada = false then totalgeneral else 0.000000 end ) over() as totalsolicitadofar,
                    sum(valorreal) over() as totalcontratado,
                    sum(Case when esconsolidada = false then Coalesce(valorreal, 0.000000) else 0.000000 end) over() as totalcontratadofar,
                    sum(Case when esconsolidada = true then Coalesce(totalgeneral, 0.000000) else 0.000000 end) over() as totalconsolidado
                  FROM 
                    mod_plan711.dat_plan711, 
                    mod_plan711.dat_solicitud711                    
                    left join mod_plan711.dat_solicitudsituacion spp on (dat_solicitud711.idsolicitud711 = spp.idsolicitud711 and activo = 1)
                    left join mod_planificacion.nom_datosnomenclador n2 on (n2.iddatosnomenclador = spp.iddatossituacion) 
                    left join mod_plan711.dat_personadel711 pers on (dat_solicitud711.idgerente = pers.idpersonadel711)
                    left join mod_plan711.dat_codigodecc on (dat_solicitud711.idcodigodecc = dat_codigodecc.idcodigodecc)
                    left join mod_plan711.dat_producto711 on (dat_solicitud711.idproductoindicador = dat_producto711.idproducto711 and tipo=1)
                    $leftjoin
                    mod_planificacion.nom_datosnomenclador n1,
                    mod_planificacion.nom_ejercicioplanificacion
                  WHERE 
                    dat_solicitud711.idplan711 = dat_plan711.idplan711 AND
                    n1.iddatosnomenclador = dat_solicitud711.iddatosestado and dat_plan711.idejercicio = nom_ejercicioplanificacion.idejercicio $addWhere
                    Group by
                    dat_solicitud711.idsolicitud711, 
                    dat_solicitud711.idplan711, 
                    dat_solicitud711.identidadcliente, 
                    dat_solicitud711.identidaddestino, 
                    dat_solicitud711.iddatosempimp, 
                    iddatosff,  
                    montoff,  
                    dat_solicitud711.iddatoscc, 
                    dat_solicitud711.iddatosestado,
                    n1.denominacion, 
                    dat_solicitud711.fechapresped, 
                    dat_solicitud711.descripciongeneral, 
                    dat_solicitud711.suministrototal, 
                    dat_solicitud711.otrosgastos, 
                    dat_solicitud711.totalgeneral, 
                    dat_solicitud711.antecedentes, 
                    dat_solicitud711.lugarentrega, 
                    dat_solicitud711.nosolicitud, 
                    dat_solicitud711.nopedido, 
                    dat_codigodecc.codigo,
                    dat_codigodecc.idcodigodecc,
                    n2.denominacion,
                    n2.iddatosnomenclador,
                    nom_ejercicioplanificacion.ejercicio,
                    pers.nombre,
                    dat_solicitud711.idespecialista,
                    dat_solicitud711.idgerente,
                    dat_solicitud711.iddirector,
                    dat_solicitud711.aperturacredito,
                    dat_solicitud711.valorreal,
                    spp.iddatossituacion,
                    dat_solicitud711.textnosolicitudo,
                    dat_solicitud711.estaconsolidada,
                    dat_solicitud711.esconsolidada,
                    dat_solicitud711.iddatostarea,
                    dat_solicitud711.iddirectorecon,
                    dat_solicitud711.idespecialistacs,
                    dat_solicitud711.idcomprador,
                    dat_solicitud711.idtiposolicitudplan,                    
                    dat_solicitud711.nombreentidad,
                    dat_solicitud711.codigoaprob,
                    dat_producto711.denominacion
            order by $orderby dat_solicitud711.nosolicitud ASC"
                . "$delimitando"
        ;
        //print_r($sql); die; 
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
        
    }
    
    public function listarProductos($parametros) {
        
        $conn = Doctrine_Manager::connection();
        $sql="";
        $addWhere = "true";
        
        $delimitando = "";
        if ($parametros['start'] != null && $parametros['limit'] != null) {
            $start = $parametros['start'];
            $limit = $parametros['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
            
        if($parametros['iddatoscodigo']!='100.0.00'){
            
            if (!is_null($parametros['productossel'])) {
                $ids= implode(',', $parametros['productossel']);
                $addWhere .= " AND p.idproducto711 in ($ids)";
            }
            if (!is_null($parametros['idplan711'])) {
                $addWhere .= " AND p.idplan711 = {$parametros['idplan711']}";
            }
            if (!is_null($parametros ['tipo'])) {
                $addWhere .= " AND p.tipo = {$parametros ['tipo']}" ;
            }
//            if (!is_null($parametros['idempimp'])) {
//                $addWhere .= " AND p.iddatosempimp = {$parametros['idempimp']}";
//            }
            
            $sql = "SELECT idproducto711,
                            p.denominacion as suministro,
                            precio,
                            codigocup, 
                            um.denominacion as unidadmedida,
                            p.numeropieza,
                            count(*) over() as total
                     FROM mod_plan711.dat_producto711 p
                          LEFT JOIN mod_planificacion.nom_datosnomenclador um ON
                            p.iddatosunidadmedida = um.iddatosnomenclador
                     WHERE ";
        }else{
            $addWhere = " and true";
            
            $tipoc= $parametros['iddatoscodigo'];

            $sql = "SELECT idproducto711,
                            p.denominacion as denominacion,
                            dc.denominacion as codigo,
                            tc.denominacion as clasificacion,
                            count(*) over() as total
                     FROM mod_plan711.dat_producto711 p
                          LEFT JOIN mod_planificacion.nom_datosnomenclador dc ON (p.iddatoscodigo = dc.iddatosnomenclador)
                          LEFT JOIN mod_planificacion.nom_datosnomenclador tc ON (p.iddatostipocodigo = tc.iddatosnomenclador)
                     WHERE dc.denominacion = '$tipoc'"; 
        }
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'suministro') {
                    $addWhere .= " AND upper(p.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                }elseif ($datos ['field'] == 'precio') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND precio <{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND precio >{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND precio ={$datos['data']['value']}";
                    }
                }elseif ($datos ['field'] == 'codigocup') {
                    $addWhere .= " AND codigocup LIKE " . "'%" . $datos['data']['value']. "%'";                   
                }elseif ($datos ['field'] == 'importadora') {
                    $addWhere .= " AND upper (p1.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                }elseif ($datos ['field'] == 'numeropieza') {
                    $addWhere .= " AND upper (numeropieza) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                }elseif ($datos ['field'] == 'clasificacion') {
                    $addWhere .= " AND upper (tc.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                }elseif ($datos ['field'] == 'codigo') {
                    $addWhere .= " AND upper (dc.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                }
            }
        } 
        
        $sql.= " $addWhere $delimitando";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
        
    }
    
    public function listarProductosFAR($parametros) {
        
        $conn = Doctrine_Manager::connection();
        $sql="";
        $addWhere = "and true ";
            
            if (!is_null($parametros['productossel'])) {
                $ids= implode(',', $parametros['productossel']);
                $addWhere .= " AND p.idproducto711 in ($ids)";
            }
            if (!is_null($parametros['idplan711'])) {
                $addWhere .= " AND dat_distribucioncod.idplan711 = {$parametros['idplan711']}";
            }
            if (!is_null($parametros ['tipo'])) {
                $addWhere .= " AND p.tipo = {$parametros ['tipo']}" ;
            }
            /*if (!is_null($parametros['idempimp'])) {
                $addWhere .= " AND p.iddatosempimp = {$parametros['idempimp']}";
            }*/
         
            if ( $parametros['idcc'] ) {
                if($parametros['idcc']!='1247'){
                    $addWhere .= " AND dat_distribucioncod.iddatoscodigo = {$parametros['idcc']}";
                }
                if($parametros['idcc']=='1247'){
                    $addWhere .= " AND p.iddatoscodigo!=1247";
            }
            }
            if ($parametros['filtros']) {
                foreach ($parametros['filtros'] as $datos) {
                    if ($datos['field'] == 'denominacion' || $datos['field'] == 'suministro') {
                        $addWhere .= " AND upper(p.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    }elseif ($datos ['field'] == 'precio') {
                        if ($datos['data']['comparison'] == 'lt') {
                            $addWhere .= " AND precio <{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $addWhere .= " AND precio >{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $addWhere .= " AND precio ={$datos['data']['value']}";
                        }
                    }elseif ($datos ['field'] == 'codigocup') {
                        $addWhere .= " AND codigocup LIKE " . "'%" . $datos['data']['value']. "%'";                   
                    }elseif ($datos ['field'] == 'importadora') {
                        $addWhere .= " AND upper (p1.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }elseif ($datos ['field'] == 'numeropieza') {
                        $addWhere .= " AND upper (numeropieza) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }elseif ($datos ['field'] == 'clasificacion') {
                        $addWhere .= " AND upper (tc.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }elseif ($datos ['field'] == 'codigo') {
                        $addWhere .= " AND upper (dc.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                }
            }
            }

            $delimitando = "";
            if ($parametros['start'] != null && $parametros['limit'] != null) {
                $start = $parametros['start'];
                $limit = $parametros['limit'];
                $delimitando = " OFFSET $start LIMIT $limit ";
            }

            $sql = "SELECT 
                        sum(dat_distribucioncod.cantidad) as cantidad, 
                        p.denominacion as suministro, 
                        p.codigocup,  
                        dat_distribucioncod.precio,
                        um.denominacion as unidadmedida,
                        p.numeropieza,
                        p.idproducto711,
                        count(*) over() as total
                      FROM 
                        mod_plan711.dat_producto711 p
                        LEFT JOIN mod_planificacion.nom_datosnomenclador um ON (p.iddatosunidadmedida = um.iddatosnomenclador), 
                        mod_plan711.dat_distribucioncod
                      WHERE 
                        p.idproducto711 = dat_distribucioncod.idproducto711 
                        $addWhere 
                      group by   suministro, 
                        p.codigocup, 
                        dat_distribucioncod.precio,
                        unidadmedida,
                        p.numeropieza,
                        p.idproducto711
                       $delimitando";
            
            //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        //var_dump(count($arrayResult)); die;
        if(count($arrayResult)==0){
            //var_dump('dfdfg'); die;
            $addWhere = " true ";
            
            if (!is_null($parametros['productossel'])) {
                $ids= implode(',', $parametros['productossel']);
                $addWhere .= " AND p.idproducto711 in ($ids)";
            }
            /*if (!is_null($parametros['idplan711'])) {
                $addWhere .= " AND p.idplan711 = {$parametros['idplan711']}";
            }*/
            if (!is_null($parametros ['tipo'])) {
                $addWhere .= " AND p.tipo = {$parametros ['tipo']}" ;
            }
            /*if (!is_null($parametros['idempimp'])) {
                $addWhere .= " AND p.iddatosempimp = {$parametros['idempimp']}";
            }*/
            if ($parametros['filtros']) {
                foreach ($parametros['filtros'] as $datos) {
                    if ($datos['field'] == 'denominacion' || $datos['field'] == 'suministro') {
                        $addWhere .= " AND upper(p.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
                    }elseif ($datos ['field'] == 'precio') {
                        if ($datos['data']['comparison'] == 'lt') {
                            $addWhere .= " AND precio <{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $addWhere .= " AND precio >{$datos['data']['value']}";
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $addWhere .= " AND precio ={$datos['data']['value']}";
                        }
                    }elseif ($datos ['field'] == 'codigocup') {
                        $addWhere .= " AND codigocup LIKE " . "'%" . $datos['data']['value']. "%'";                   
                    }elseif ($datos ['field'] == 'importadora') {
                        $addWhere .= " AND upper (p1.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }elseif ($datos ['field'] == 'numeropieza') {
                        $addWhere .= " AND upper (numeropieza) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }elseif ($datos ['field'] == 'clasificacion') {
                        $addWhere .= " AND upper (tc.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }elseif ($datos ['field'] == 'codigo') {
                        $addWhere .= " AND upper (dc.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                    }
                }
            }
            
            $sql = "SELECT  idproducto711,
                            p.denominacion as suministro,
                            precio,
                            codigocup, 
                            um.denominacion as unidadmedida,
                            p.numeropieza,
                            0 as cantidad,
                            count(*) over() as total
                     FROM mod_plan711.dat_producto711 p
                          LEFT JOIN mod_planificacion.nom_datosnomenclador um ON
                            p.iddatosunidadmedida = um.iddatosnomenclador
                     WHERE $addWhere $delimitando";
            
            
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        }
        return $arrayResult;
        
    }
    
    public function listarProdEnSol($parametros) {
        
        $conn = Doctrine_Manager::connection();
        $sql="";
        $ids= implode(',', $parametros['solconsolidar']);
        
        $sql = "SELECT
                    ni.denominacion as suministro, 
                    sum (sp.cantidad) as cantidad, 
                    sum (sp.trimestre1) as trimestre1, 
                    sum (sp.trimestre2) as trimestre2, 
                    sum (sp.trimestre3) as trimestre3, 
                    sum (sp.trimestre4) as trimestre4,  
                    sp.precio,
                    um.abreviaturaunidadmedida as unidadmedida,
                    ni.idindicador as idproducto711,
                    ni.codigo as codigocup,
                    ni.numeropieza
                  FROM 
                    --mod_plan711.dat_producto711
                    --LEFT JOIN mod_planificacion.nom_datosnomenclador um ON dat_producto711.iddatosunidadmedida = um.iddatosnomenclador, 
                    mod_plan711.dat_solicitudproductos sp					
                    LEFT OUTER JOIN mod_datosmaestros.nom_indicador ni ON (ni.idindicador = sp.idproducto711)
                    LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (ni.idumedida = um.idunidadmedida)
                  WHERE 
                    ni.idindicador = sp.idproducto711 and idsolicitud711 in ($ids)
                    group by ni.denominacion,
                    sp.precio,
                    um.abreviaturaunidadmedida,
                    ni.idindicador,
                    ni.codigo";
            
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        
        
        return $arrayResult;
        
    }
    
    public function listarPersonas($parametros) {
        
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        
        if ($parametros['identidad']) {
            $addWhere .= " AND p.identidad = {$parametros['identidad']}";
        }
        if ($parametros['idempimp']) {
            $addWhere .= " AND p.iddatosempimp = {$parametros['idempimp']}";
        }
        
        $sql = "SELECT idpersonadel711,
                        nombre,
                        apellidos,
                        correoelec,
                        telefono,
                        empimp.denominacion as empresaimportadora,
                        tipoper.denominacion as tipopersona,
                        unicomp.denominacion as unidadcompra,
                        cat.denominacion as categoria
                 FROM mod_plan711.dat_personadel711 p
                      LEFT JOIN mod_planificacion.nom_datosnomenclador empimp ON p.iddatosempimp
                        = empimp.iddatosnomenclador
                      INNER JOIN mod_planificacion.nom_datosnomenclador tipoper ON
                        p.idtipopersona = tipoper.iddatosnomenclador
                      LEFT JOIN mod_planificacion.nom_datosnomenclador unicomp ON
                        p.idunidadcompra = unicomp.iddatosnomenclador
                      LEFT JOIN mod_planificacion.nom_datosnomenclador cat ON p.iddatoscategoria
                        = cat.iddatosnomenclador
                     WHERE p.idtipopersona = {$parametros['uri']} AND
                       p.activo = 1 $addWhere";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
        
    }
    
    public function Solicitudes711TotalImporte($parametros) {
        $idplan= $parametros['idplan711'];
        $idejercicio= $parametros['idejercicio'];        
        $conn = Doctrine_Manager::connection();
        $addWhereFF = "";
        $salidaiddatosff = "0";
        $salidamontoff = "0";
        $leftjoin =", ";
		
        if ($parametros['idejercicio']) {
            $addWhere .= " AND dat_plan711.idejercicio = {$parametros['idejercicio']}";
        }
        if ($parametros ['identidad']) {
            $addWhere .= " AND dat_solicitud711.identidadcliente = {$parametros ['identidad']}" ;
        }
        if ($parametros['idempimp']) {
            $addWhere .= " AND dat_solicitud711.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere .= " AND dat_solicitud711.iddatoscc = {$parametros['idcc']}";
        }
        if ($parametros['idff']) {
            $salidaiddatosff = "solicitudF.iddatosff";
            $salidamontoff = "solicitudF.montoff";
            $leftjoin ="left join (SELECT idsolicitud711, iddatosff, sum(monto) as montoff
                        FROM mod_plan711.dat_solicitudfuentesf $addWhereFF group by idsolicitud711, iddatosff) solicitudF on (solicitudF.idsolicitud711 = dat_solicitud711.idsolicitud711), 
                     ";
            $addWhere .= " AND ((dat_solicitud711.iddatosffsol is not null and dat_solicitud711.iddatosffsol = {$parametros['idff']}) OR solicitudF.iddatosff = {$parametros['idff']})";
            $addWhereFF .= "where dat_solicitudfuentesf.iddatosff = {$parametros['idff']}";
        }
                
        $sql = "Select  
       Coalesce(sum(Coalesce(valorreal,suministrototal)),0.000000) as total
	FROM mod_plan711.dat_solicitud711 $leftjoin
            where $addWhere";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
        
    }
	
    public function UltimoNoSolicitud($parametros) {
        $idplan= $parametros['idplan711'];
        $idejercicio= $parametros['idejercicio'];        
        $conn = Doctrine_Manager::connection();
        $addWhere = "true";
        if ($parametros['idejercicio']) {
            $addWhere .= " AND dat_plan711.idplan711 = {$parametros['idejercicio']}";
        }
        if ($parametros ['idempcliente']) {
            $addWhere .= " AND dat_solicitud711.identidadcliente = {$parametros ['idempcliente']}" ;
        }
                
        $sql = "Select max(nosolicitud) as nosolicitud
					FROM 
                    mod_plan711.dat_plan711, 
                    mod_plan711.dat_solicitud711
                  WHERE 
                    dat_solicitud711.idplan711 = dat_plan711.idplan711 AND $addWhere";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult[0]['nosolicitud'];
        
    }
    
    public function Aprobar($parametros){
        $idaprob=NULL;
        $idestado=NULL;
        
        switch ($parametros['aprobacion']){
            case 1:
				//aprobado especialista economico empresa
                $idaprob=1;
                $idestado=5073;
                break;
            case 2:
				//aprobado especialista OSDE ATM
                $idaprob=2;
                $idestado=5064;
                break;
            case 3:
				//aprobado especialista OSDE Area tecnica
                $idaprob=6;
                $idestado=5066;
                break;
            case 4:
				//aprobado especialista OSDE direcccion de inversiones
                $idaprob=4;
                $idestado=5065;
                break;
            case 5:
				//aprobado especialista OSDE direcccion
                $idaprob=5;
                $idestado=5042;
                break;
            case 6:
		//aprobado especialista OSDE finanzas
                $idaprob=3;
                $idestado=5159;
                break;
            case 7:
                //aprobado especialista de empresa qe crea la solicitud 711
                $idaprob = 7;
                $idestado = 5133;
                break;
        }
	$conn = Doctrine_Manager::connection();
        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET  iddatosestado=$idestado, listaaprobacion = listaaprobacion||$idaprob
                      WHERE idsolicitud711= {$parametros['idsolicitud711']}";
        $conn->execute($sqlinsert);
        $arrayResult= self::DameSolicitudesConsolidadas($parametros);
        foreach ($arrayResult as $value) {
            $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET  iddatosestado=$idestado, listaaprobacion = listaaprobacion||$idaprob
                      WHERE idsolicitud711= {$value['idsolicitud711']}";
            $conn->execute($sqlinsert);
        }
        return 1;
    }

    public function Desaprobar($parametros){
        $idestado=NULL;
        
        switch ($parametros['aprobacion']){
            case 1:
				//desaprobado especialista economico empresa
                $idestado=5072;
                break;
            case 2:
				//desaprobado especialista OSDE ATM
                $idestado=5071;
                break;
            case 3:
				//desaprobado especialista OSDE Area tecnica
                $idestado=5070;
                break;
            case 4:
				//desaprobado especialista OSDE direcccion de inversiones
                $idestado=5069;
                break;
            case 5:
				//desaprobado especialista OSDE direcccion
                $idestado=5043;
                break;
            case 6:
				//desaprobado especialista OSDE finanzas
                $idestado=5135;
                break;
            case 7:
				//desaprobado especialista direcccion de inversiones
                $idestado=5134;
                break;	
        }

	$conn = Doctrine_Manager::connection();
        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET  iddatosestado=$idestado, listaaprobacion='0'
                      WHERE idsolicitud711= {$parametros['idsolicitud711']}";
        $conn->execute($sqlinsert);
        $arrayResult= self::DameSolicitudesConsolidadas($parametros);
        foreach ($arrayResult as $value) {
            $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET  iddatosestado=$idestado, listaaprobacion='0'
                      WHERE idsolicitud711= {$value['idsolicitud711']}";
            $conn->execute($sqlinsert);
        }
        return 1;
    }  
    
    public function ActualizarDatosGerente($parametros){
        $conn = Doctrine_Manager::connection();
        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET idgerente={$parametros['idgerente']}, nopedido = '{$parametros['nopedido']}', fechapresped= '{$parametros['fechapres']}' 
                      WHERE idsolicitud711= {$parametros['idsolicitud711']}";
        $conn->execute($sqlinsert);
        $arrayResult= self::DameSolicitudesConsolidadas($parametros);
        foreach ($arrayResult as $value) {
            $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET idgerente={$parametros['idgerente']}, nopedido = '{$parametros['nopedido']}', fechapresped= '{$parametros['fechapres']}' 
                      WHERE idsolicitud711= {$value['idsolicitud711']}";
            $conn->execute($sqlinsert);
        }
        return 1;
    }
    
    public function ActualizarFechaPresentacion($parametros){
        $conn = Doctrine_Manager::connection();
        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET fechapresped= '{$parametros['fechapres']}'
                      WHERE idsolicitud711= {$parametros['idsolicitud711']}";
        $conn->execute($sqlinsert);
        $arrayResult= self::DameSolicitudesConsolidadas($parametros);
        foreach ($arrayResult as $value) {
            $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET fechapresped= '{$parametros['fechapres']}'
                      WHERE idsolicitud711= {$value['idsolicitud711']}";
            $conn->execute($sqlinsert);
        }
        return 1;
    }
    
    public function AperturarCancelar($parametros){
        $conn = Doctrine_Manager::connection();
        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET aperturacredito= '{$parametros['aperturacredito']}'
                      WHERE idsolicitud711= {$parametros['idsolicitud711']}";
        $conn->execute($sqlinsert);
        
        $arrayResult= self::DameSolicitudesConsolidadas($parametros);
        foreach ($arrayResult as $value) {
            $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                        SET fechapresped= '{$parametros['fechapres']}'
                      WHERE idsolicitud711= {$value['idsolicitud711']}";
            $conn->execute($sqlinsert);
        }
        return 1;
    }
    
    public function listarServicEnSol($parametros){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT distinct iddatosservsol,idsolicitud711, nom_datosnomenclador.denominacion 
                        FROM mod_plan711.dat_solicitudservsol
                        LEFT JOIN mod_planificacion.nom_datosnomenclador ON dat_solicitudservsol.iddatosservsol
                        = nom_datosnomenclador.iddatosnomenclador where idsolicitud711= {$parametros['idsolicitud711']}";
        //print_r($sql); die;                
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarProductosSolitud($parametros){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT sp.idsolicitudproductos, 
                       sp.idsolicitud711, 
                       sp.idproducto711, 
                       sp.cantidad, 
                    sp.trimestre1, 
                    sp.trimestre2, 
                    sp.trimestre3, 
                    sp.trimestre4, 
                    sp.precio, 
                    ni.denominacion as suministro,
                    um.denominacionunidadmedida as unidadmedida,
                    upper(um.abreviaturaunidadmedida) as descrip, 
                    ni.codigo, 
                    (cantidad*sp.precio)as valor,
                    ni.numeropieza, 
                    coalesce(sp.distribuido,0) as distribuido, 
                    coalesce((sp.cantidad-sp.distribuido),0) as falta ,
                    sp.descripcion,
                    sp.urlimagen,
                    sp.nombreimg, 
                    sol.identidadcliente,
                    sol.totalgeneral,
                    sol.textnosolicitudo,
                    sol.descripciongeneral					
               FROM mod_plan711.dat_solicitudproductos sp
                    
                    LEFT OUTER JOIN mod_datosmaestros.nom_indicador ni ON (ni.idindicador = sp.idproducto711)
                    LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (ni.idumedida = um.idunidadmedida)
                    inner join mod_plan711.dat_solicitud711 sol on (sp.idsolicitud711 = sol.idsolicitud711)

                    
                     --LEFT JOIN mod_plan711.dat_producto711 p ON p.idproducto711 = dat_solicitudproductos.idproducto711
                     --LEFT JOIN mod_planificacion.nom_datosnomenclador um ON p.iddatosunidadmedida = um.iddatosnomenclador 
                        where sp.idsolicitud711 = {$parametros['idsolicitud711']}
						order by idproducto711";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
        
    public function CambiarSituacionPedido($parametros){
        $conn = Doctrine_Manager::connection();
        $band=true;
        if($parametros['idsituacionpedido']==9){
            $sql1 = "SELECT 
                        mod_plan711.dat_solicitud711.idsolicitud711,
                        mod_plan711.dat_contrato.idcontrato,
                        mod_plan711.dat_embarque.idembarque,
                        mod_plan711.dat_embarque.fechareal AS accion,
                        mod_plan711.dat_embarqueformapago.idembarqueformapago,
                        mod_plan711.dat_embarqueformapago.fechareal AS embarque
                      FROM
                        mod_plan711.dat_solicitud711
                        INNER JOIN mod_plan711.dat_contrato ON (mod_plan711.dat_solicitud711.idsolicitud711 = mod_plan711.dat_contrato.idsolicitud711)
                        INNER JOIN mod_plan711.dat_embarque ON (mod_plan711.dat_contrato.idcontrato = mod_plan711.dat_embarque.idcontrato)
                        LEFT JOIN mod_plan711.dat_embarqueformapago ON (mod_plan711.dat_embarque.idembarque = mod_plan711.dat_embarqueformapago.idembarque)
                      WHERE
                        dat_solicitud711.idsolicitud711 = {$parametros['idsolicitud711']}";
            $arrayResult1 = $conn->execute($sql1)->fetchAll(PDO::FETCH_ASSOC);
            //var_dump($arrayResult1); die;
            if(!is_null($arrayResult1)){
                foreach ($arrayResult1 as $value){
                    if($value[accion]== NULL || $value['embarque']==NULL){
                        $msg='La solicitud no se puede actualizar, pues faltan fechas reales en el contrato por actualizar';
                        $band=false;
                        break;
                    }
                }
            }else{
                $band=false;
            }
            
        }
        if($band==true){
			$sql = "SELECT idsolicitudsituacion, idsolicitud711, iddatossituacion, activo
						FROM mod_plan711.dat_solicitudsituacion where idsolicitud711 = {$parametros['idsolicitud711']}";
			$arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
			if(!is_null($arrayResult)){
				$sqlinsert = "UPDATE mod_plan711.dat_solicitudsituacion
									SET activo=0
								WHERE idsolicitud711= {$parametros['idsolicitud711']}";
				$conn->execute($sqlinsert);
			}
			$idsituacion =null;
			switch ($parametros['idsituacionpedido']) {
				case 1://Contratado
					$idsituacion= 5024; 
                                        $arrayResult= self::DameSolicitudesConsolidadas($parametros);
                                        foreach ($arrayResult as $value) {
                                            if($value['iddatosestado']!=5042){
                                                return "Alguna de las solicitudes consolidadas no esta aprobada por la direcci�n";
                                            }
                                        }
					break;
				case 2://Devuelto
					$idsituacion= 5020; 
					break;
				case 3://En proceso de contratacion
					$idsituacion= 5023; 
                                        if($parametros['motivo']!=""){
//                                                        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
//                                                                        SET  iddatosestado= 5041, listaaprobacion='0'
//                                                                      WHERE idsolicitud711= {$parametros['idsolicitud711']}";
//                                                        $conn->execute($sqlinsert); 
//                                                        $arrayResult= self::DameSolicitudesConsolidadas($parametros);
//                                                        foreach ($arrayResult as $value) {
//                                                            $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
//                                                                            SET  iddatosestado= 5041, listaaprobacion='0'
//                                                                        WHERE idsolicitud711= {$value['idsolicitud711']}";
//                                                            $conn->execute($sqlinsert);
//                                                        }
                                        }
					break;
				case 4://En solicitud de ofertas
					$idsituacion= 5018; 
					break;
				case 5://Ofertas pendientes
					$idsituacion= 5019; 
					break;
				case 6://Para comite importadora
					$idsituacion= 5021; 
					break;
				case 7://Para comite GAE
					$idsituacion= 5022; 
					break;
				case 8://Suministrado parcialmente
					$idsituacion= 5025; 
					break;
				case 9://Suministrado completamente
					$idsituacion= 5026; 
					break;
				case 10://Puesta en marcha
					$idsituacion= 5086; 
					break;
				case 11://cancelado
					$idsituacion= 1245;
					$sqlinsertd = "UPDATE mod_plan711.dat_solicitud711
							SET suministrototal= 0, totalgeneral = 0
						  WHERE idsolicitud711= {$parametros['idsolicitud711']}";
					$conn->execute($sqlinsertd);
                                        
                                        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                                                        SET  iddatosestado= 5060, listaaprobacion='0'
                                                      WHERE idsolicitud711= {$parametros['idsolicitud711']}";
                                        $conn->execute($sqlinsert);                                        
					break;
                                case 12://En proceso de contratacion
                                        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                                                        SET  iddatosestado= 5041, listaaprobacion='0'
                                                      WHERE idsolicitud711= {$parametros['idsolicitud711']}";
                                        $conn->execute($sqlinsert); 
                                        $sqlinsert = "UPDATE mod_plan711.dat_solicitudsituacion
									SET activo=0
								WHERE idsolicitud711= {$parametros['idsolicitud711']}";
                                        $conn->execute($sqlinsert);
                                        return 1;
					break;    
			};
		   
			$sqlinsert = "INSERT INTO mod_plan711.dat_solicitudsituacion(
								idsolicitud711, iddatossituacion, activo)
							VALUES ( {$parametros['idsolicitud711']}, $idsituacion, 1)";
			$conn->execute($sqlinsert);
			
			$arrayResult= self::DameSolicitudesConsolidadas($parametros);
			if ($parametros['idsituacionpedido']!= 11){
				foreach ($arrayResult as $value) {
                                        $sqlinsert = "UPDATE mod_plan711.dat_solicitudsituacion
									SET activo=0
								WHERE idsolicitud711= {$value['idsolicitud711']}";
                                        $conn->execute($sqlinsert);
					$sqlinsert = "INSERT INTO mod_plan711.dat_solicitudsituacion(
									idsolicitud711, iddatossituacion, activo)
								VALUES ( {$value['idsolicitud711']}, $idsituacion, 1)";
					$conn->execute($sqlinsert);
                                        if($parametros['idsituacionpedido'] == 1){
                                            $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                                                                       SET valorreal= totalgeneral
                                                                     WHERE idsolicitud711 = {$value['idsolicitud711']}";
                                            $conn->execute($sqlinsert);
                                        }
				}
			}else{
					$sqlinsert = "DELETE FROM mod_plan711.dat_solicitudconsolidad
									WHERE idsolicitud711padre =  {$parametros['idsolicitud711']}";
					$conn->execute($sqlinsert);
					
				foreach ($arrayResult as $value) {
					$sqlinsert = "UPDATE mod_plan711.dat_solicitud711
								   SET estaconsolidada= false
								 WHERE idsolicitud711 = {$value['idsolicitud711']}";
					$conn->execute($sqlinsert);
				}	
			}
			
			return 1;
        }else{
            return $msg;
        }
    }    
    
    public function DameFuenteDeSolicitud($id){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT iddatosff
                        FROM mod_plan711.dat_solicitudfuentesf where idsolicitud711= $id";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function DameFuenteCodigoCC($id){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idcodigodecc, idplan711, iddatoscc, codigo, identidad, iddatosempimp
                    FROM mod_plan711.dat_codigodecc where idcodigodecc= $id";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function DameDatosPersona($id){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idpersonadel711, nombre, apellidos, nombre||' '||apellidos as nombrecompleto, idtipopersona, identidad, 
                    iddatosempimp, iddatoscategoria, correoelec, telefono, idunidadcompra, 
                    activo, nombrepertenece, ocultar
               FROM mod_plan711.dat_personadel711 where idpersonadel711= $id";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function ListarPersonasSolicitud($id){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    mod_plan711.dat_personadel711.idpersonadel711,
                    mod_plan711.dat_personadel711.nombre,
                    mod_plan711.dat_personadel711.apellidos,
                    mod_plan711.dat_personadel711.idtipopersona,
                    mod_plan711.dat_personadel711.identidad,
                    mod_plan711.dat_personadel711.iddatosempimp,
                    mod_plan711.dat_personadel711.iddatoscategoria,
                    mod_plan711.dat_personadel711.correoelec,
                    mod_plan711.dat_personadel711.telefono,
                    mod_plan711.dat_personadel711.idunidadcompra,
                    mod_plan711.dat_personadel711.activo,
                    mod_plan711.dat_personadel711.nombrepertenece
                  FROM
                    mod_plan711.dat_personadel711
                    LEFT OUTER JOIN mod_plan711.dat_solicitud711 esp ON (esp.iddirector = mod_plan711.dat_personadel711.idpersonadel711)
                    LEFT OUTER JOIN mod_plan711.dat_solicitud711 dir ON (dir.idespecialista = mod_plan711.dat_personadel711.idpersonadel711)
                    LEFT OUTER JOIN mod_plan711.dat_solicitud711 den ON (den.idgerente = mod_plan711.dat_personadel711.idpersonadel711)
                  WHERE
                    esp.idsolicitud711 = $id OR 
                    dir.idsolicitud711 = $id OR 
                    den.idsolicitud711 = $id";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function adicionarListaConsolidada($solconsolidar,$solicitud){
        //var_dump($solconsolidar); die;
	$conn = Doctrine_Manager::connection();
        for ($i = 0; $i < count($solconsolidar); $i++) {
            $sqlinsert = "INSERT INTO mod_plan711.dat_solicitudconsolidad(
                                idsolicitud711padre, idsolicitud711consolidad)
                            VALUES ($solicitud, $solconsolidar[$i])";
            $conn->execute($sqlinsert);
        }
        return 1;
    }
    
    public function ActualizarListaConsolidada($solconsolidar){
        $conn = Doctrine_Manager::connection();
        for ($i = 0; $i < count($solconsolidar); $i++) {
            $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                            SET estaconsolidada= true
                          WHERE idsolicitud711= {$solconsolidar[$i]}";
            $conn->execute($sqlinsert);
        }
        return 1;
    }
    
    public function ActualizarSolicitudesConsolidada($parametros){
        //$conn = Doctrine_Manager::connection();
        //var_dump($parametros['solconsolidar'][])
        for ($i = 0; $i < count($parametros['solconsolidar']); $i++) {
            $solicitudold = Doctrine::getTable('DatSolicitud711')->find($parametros['solconsolidar'][$i]);
            $totalreal=$solicitudold->totalgeneral;
            $arestar=0;
            $asumar=0;
            $susproductos = DatProducto711::DameProductosDe711($parametros['solconsolidar'][$i]);
            for ($j = 0; $j < count($parametros['productos']); $j++) {
                for ($h = 0; $h < count($susproductos); $h++) {
                    if($parametros['productos'][$j]['idproducto711']== $susproductos[$h]['idproducto711']){
                        $arestar+=$susproductos[$h]['cantidad']*$susproductos[$h]['precio'];
                        $asumar+=$susproductos[$h]['cantidad']*$parametros['productos'][$j]['precio'];
                        DatProducto711::ActualizarPrecioProd($susproductos[$h]['idsolicitudproductos'],$parametros['productos'][$j]['precio']);
                    }
                }                
            }
            $totalreal=$totalreal-$arestar;
            $totalreal=$totalreal+$asumar;
            $solicitudold->totalgeneral=$totalreal;
            $solicitudold->save();
            //$conn->execute($sqlinsert);
        }
        return 1;
    }
    
    public function ListarEntProdConsolidado($parametros){
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    mod_plan711.dat_solicitudproductos.idsolicitudproductos,
                    mod_plan711.dat_solicitudproductos.idsolicitud711,
                    mod_plan711.dat_solicitud711.idsolicitud711 as solentidad,
                    mod_plan711.dat_solicitudproductos.cantidad,
                    coalesce(distribuido,0) AS distribuido,
                    ni.denominacion,
                    mod_plan711.dat_solicitudproductos.idproducto711,
                    cantidad * dat_solicitudproductos.precio AS valor,
                    mod_plan711.dat_solicitud711.nombreentidad,
                    mod_plan711.dat_solicitud711.textnosolicitudo,
                    coalesce((cantidad-distribuido),0) AS falta,
                    mod_plan711.dat_solicitud711.totalgeneral,
                    mod_plan711.dat_solicitudproductos.precio,
                    mod_plan711.dat_solicitud711.identidadcliente 
                  FROM
                    mod_plan711.dat_solicitudproductos                     
                    LEFT OUTER JOIN mod_datosmaestros.nom_indicador ni ON (ni.idindicador = dat_solicitudproductos.idproducto711)
                    --LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (ni.idumedida = um.idunidadmedida)
                    --INNER JOIN mod_plan711.dat_producto711 ON (mod_plan711.dat_solicitudproductos.idproducto711 = mod_plan711.dat_producto711.idproducto711)
                    INNER JOIN mod_plan711.dat_solicitudconsolidad ON (mod_plan711.dat_solicitudproductos.idsolicitud711 = mod_plan711.dat_solicitudconsolidad.idsolicitud711consolidad)
                    INNER JOIN mod_plan711.dat_solicitud711 ON (mod_plan711.dat_solicitudproductos.idsolicitud711 = mod_plan711.dat_solicitud711.idsolicitud711)
                  WHERE
                    mod_plan711.dat_solicitudconsolidad.idsolicitud711padre = {$parametros['idsolicitud711']} AND 
                    ni.idindicador = {$parametros['idproducto711']}
					order by mod_plan711.dat_solicitud711.idsolicitud711";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function ActualizarSuministros($idsol,$idprod, $distrib){
        $conn = Doctrine_Manager::connection();
        $sqlinsert = "UPDATE mod_plan711.dat_solicitudproductos
                        SET 
                            distribuido=$distrib
                        WHERE idsolicitud711= $idsol and idproducto711 = $idprod";
        $conn->execute($sqlinsert);
        return 1;
    }
    
    public function ActualizarPreciosConsolidados($solictud){
        $conn = Doctrine_Manager::connection();
        $sqlinsert = "UPDATE mod_plan711.dat_solicitudproductos
                        SET 
                            precio={$solictud[4]}
                        WHERE idsolicitud711= {$solictud[2]} and idproducto711 = {$solictud[1]} 
                              and idsolicitudproductos = {$solictud[0]}";
        $conn->execute($sqlinsert);
        
        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                SET 
                   totalgeneral= {$solictud[7]}	
              WHERE idsolicitud711 = {$solictud[2]}";
        $conn->execute($sqlinsert);
        return 1;
    }
    
    public function EliminarListaSolCons($idsolicitud){
        $conn = Doctrine_Manager::connection();
        $sqlinsert = "UPDATE mod_plan711.dat_solicitud711
                            SET estaconsolidada= false
                          WHERE idsolicitud711 in (Select idsolicitud711consolidad as idsolicitud711 from mod_plan711.dat_solicitudconsolidad where idsolicitud711padre =$idsolicitud)";
        $conn->execute($sqlinsert);
        $sqldel = "DELETE FROM mod_plan711.dat_solicitudconsolidad
                        WHERE idsolicitud711padre =$idsolicitud";
        $conn->execute($sqldel);
        return 1;
    }

    public function CrearTablaTemporalCUP($nombretabla){
        //$query = "Select mod_plan711.crear_tabla('{$nombretabla}')";
        $query = "CREATE TABLE IF NOT EXISTS mod_plan711.{$nombretabla}(
			              codigo character varying(255),
                          denominacion character varying,
                          precio numeric(30,6),
                          cantidad numeric(30,6),
                          descripcion text)";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        //$conn->commit();
        return 1;
    }
    
    public function CrearTablaTemporalNumP($nombretabla){
        //$query = "Select mod_plan711.crear_tabla('{$nombretabla}')";
        $query = "CREATE TABLE IF NOT EXISTS mod_plan711.{$nombretabla}(
			              numero_pieza character varying(255),
                          denominacion character varying,
                          precio numeric(30,6),
                          cantidad numeric(30,6),
                          descripcion text)";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        //$conn->commit();
        return 1;
    }
    public function EliminarTablaTemporal($nombretabla){

        $conn = Doctrine_Manager::connection();
        $sql = "DROP TABLE IF EXISTS mod_plan711.{$nombretabla}";
        $conn->execute($sql);
        $conn->commit();
        return 1;
    }
    public function InsertarTablaTemporal($nombretabla,$datos){
        $conn = Doctrine_Manager::connection();
        
        $datos['codigo']=($datos['codigo']=="") ? 'NULL' : $datos['codigo'];
        $datos['denominacion']=($datos['denominacion']=="") ? 'NULL' : $datos['denominacion'];
        $datos['precio']=($datos['precio']=="") ? 'NULL' : $datos['precio'];
        $datos['cantidad']=($datos['cantidad']=="") ? 'NULL' : $datos['cantidad'];
        $datos['descripcion']=($datos['descripcion']=="") ? 'NULL' : $datos['descripcion']; 
        
        $sql = "INSERT INTO mod_plan711.{$nombretabla}(
                                codigo, denominacion, precio, cantidad, descripcion)
                    VALUES ('{$datos['codigo']}', '{$datos['denominacion']}', {$datos['precio']}, {$datos['cantidad']},'{$datos['descripcion']}');";
        $conn->execute($sql);
        //$conn->commit();
        return 1;
    }
    public function InsertarTablaTemporalNumP($nombretabla,$datos){

        $conn = Doctrine_Manager::connection();
        $datos['codigo']=($datos['numeropieza']=="") ? 'NULL' : $datos['numeropieza'];
        $datos['denominacion']=($datos['denominacion']=="") ? 'NULL' : $datos['denominacion'];
        $datos['precio']=($datos['precio']=="") ? 'NULL' : $datos['precio'];
        $datos['cantidad']=($datos['cantidad']=="") ? 'NULL' : $datos['cantidad'];
        $datos['descripcion']=($datos['descripcion']=="") ? 'NULL' : $datos['descripcion']; 
        
        $sql = "INSERT INTO mod_plan711.{$nombretabla}(
                            numero_pieza, denominacion, precio, cantidad, descripcion)
                VALUES ('{$datos['numeropieza']}', '{$datos['denominacion']}', {$datos['precio']}, {$datos['cantidad']},'{$datos['descripcion']}');";
        $conn->execute($sql);
        //$conn->commit();
        return 1;
    }
    public function SelectAllTablaTemporal($nombretabla, $tipotabla){

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT codigo, denominacion, precio, cantidad, descripcion
                        FROM mod_plan711.{$nombretabla};";
        if($tipotabla == 2){
            $sql = "SELECT numero_pieza, denominacion, precio, cantidad, descripcion
                        FROM mod_plan711.{$nombretabla};";
        }                
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function DameSolicitudesConsolidadas($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dat_solicitud711.estaconsolidada, 
                    dat_solicitud711.idsolicitud711, 
                    dat_solicitud711.totalgeneral, 
                    dat_solicitud711.identidadcliente, 
                    dat_solicitud711.iddatosestado, 
                    dat_solicitudconsolidad.idsolicitud711padre
                  FROM 
                    mod_plan711.dat_solicitud711, 
                    mod_plan711.dat_solicitudconsolidad
                  WHERE 
                    dat_solicitud711.idsolicitud711 = dat_solicitudconsolidad.idsolicitud711consolidad and  idsolicitud711padre= {$param['idsolicitud711']}";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function listarConsolidadas($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
				  sol.idplan711, 
				  sol.descripciongeneral, 
				  sol.textnosolicitudo, 
				  sol.idsolicitud711,
				  sol.descripciongeneral||' '||sol.textnosolicitudo as descripcion
				FROM 
				  mod_plan711.dat_solicitud711 sol
				  left join mod_plan711.dat_solicitudsituacion ss on (sol.idsolicitud711 = ss.idsolicitud711 and ss.activo = 1)
				WHERE 
				  sol.esconsolidada = true 
				   AND (ss.iddatossituacion!=1245 or ss.iddatossituacion is null)
				   AND 
				  sol.idplan711 = {$param['idplan711']}
				  order by nosolicitud";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }	

    public function listarEmpresasEnConsolidado($param) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    mod_plan711.dat_solicitud711.nombreentidad,
                    mod_plan711.dat_solicitud711.identidadcliente,
                    sum(mod_plan711.dat_solicitud711.totalgeneral) as totalgeneral
                  FROM
                    mod_plan711.dat_solicitudconsolidad
                    INNER JOIN mod_plan711.dat_solicitud711 ON (mod_plan711.dat_solicitudconsolidad.idsolicitud711consolidad = mod_plan711.dat_solicitud711.idsolicitud711)
                  WHERE
                    mod_plan711.dat_solicitudconsolidad.idsolicitud711padre = {$param['idsolicitud711']}
                    group by mod_plan711.dat_solicitud711.nombreentidad ,mod_plan711.dat_solicitud711.identidadcliente";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function listarSolicitudes711Reportes($parametros) {
        $conn = Doctrine_Manager::connection();
        $addWhere = "and true";
        $addWhereFF = "";
        $salidaiddatosff = "0";
        $salidamontoff = "0";
        $leftjoin ="";
        $orderby="";
		
        if ($parametros['idplan711']) {
            $addWhere .= " AND dat_solicitud711.idplan711 = {$parametros['idplan711']}";
        }
        if ($parametros ['identidad']!=null) {
            $addWhere .= " AND dat_solicitud711.identidadcliente = {$parametros ['identidad']}" ;
        }
		
	//var_dump($parametros['idff'] . 'asdass'); die;
        if ($parametros['idempimp']) {
            $addWhere .= " AND dat_solicitud711.iddatosempimp = {$parametros['idempimp']}";
        }
        if ($parametros['idcc']) {
            $addWhere .= " AND dat_solicitud711.iddatoscc = {$parametros['idcc']}";
        }
		if ($parametros['idff']!=null) {
            $addWhere .= " AND dat_solicitud711.iddatosffsol = {$parametros['idff']}";
        }
		
        if ($parametros['fechainicio'] || $parametros['fechafin']) {
            $addWhere .= " AND dat_solicitud711.fechacreacion between '{$parametros['fechainicio']}' and '{$parametros['fechafin']}'";
        }      
        if ($parametros['idsp']!=null && $parametros['idsp']!='p') {
            $addWhere .= " AND n2.iddatosnomenclador = {$parametros['idsp']}";
        }
		if ($parametros['esconsolidada']) {
            $addWhere .= " AND dat_solicitud711.esconsolidada = true";
        }
        
        if ($parametros['presentado']) {
            $addWhere .= " AND dat_solicitud711.nopedido is not null";
        }
        
        if ($parametros['idsolicitud711']) {
            $addWhere .= " AND dat_solicitud711.idsolicitud711 = {$parametros['idsolicitud711']}";
        }
        //print_r($sql); die;
        $sql = "SELECT 
                    dat_solicitud711.idsolicitud711, 
                    dat_solicitud711.idplan711, 
                    dat_solicitud711.identidadcliente, 
                    dat_solicitud711.iddatosempimp,
                    emimp.denominacion as importadora,
                    --$salidaiddatosff as iddatosff,  
                    --$salidamontoff as montoff,  
                    dat_solicitud711.iddatoscc, 
                    cod.denominacion as codigofar, 
                    dat_solicitud711.iddatosestado,
                    n1.denominacion,
                    dat_solicitud711.fechapresped, 
                    dat_solicitud711.fechacreacion,
                    dat_solicitud711.descripciongeneral, 
                    dat_solicitud711.suministrototal, 
                    dat_solicitud711.otrosgastos, 
                    dat_solicitud711.totalgeneral, 
                    dat_solicitud711.antecedentes, 
                    dat_solicitud711.lugarentrega, 
                    dat_solicitud711.nosolicitud as n, 
                    dat_solicitud711.nopedido, 
                    dat_codigodecc.codigo,
                    dat_codigodecc.idcodigodecc,
                    n2.denominacion as situacionpedido,
                    n2.iddatosnomenclador as idsp,
                    nom_ejercicioplanificacion.ejercicio,
                    pers.nombre as gerente,
                    dat_solicitud711.idespecialista,
                    dat_solicitud711.idgerente,
                    dat_solicitud711.iddirector,
                    dat_solicitud711.aperturacredito,
                    dat_solicitud711.valorreal,
                    spp.iddatossituacion,
                    dat_solicitud711.textnosolicitudo as nosolicitud,
                    dat_solicitud711.paraconsolidar,
                    dat_solicitud711.estaconsolidada,
                    dat_solicitud711.esconsolidada,
                    dat_solicitud711.iddatostarea,
                    dat_solicitud711.iddirectorecon,
                    dat_solicitud711.idespecialistacs,
                    dat_solicitud711.idcomprador,
                    dat_solicitud711.idtiposolicitudplan,                    
                    tp.denominacion as tipoplan,                    
                    dat_solicitud711.nombreentidad,
                    dat_solicitud711.codigoaprob,
                    dat_solicitud711.iddatosgrupcomercial,
                    dat_solicitud711.idproductoindicador,
                    dat_solicitud711.listaaprobacion,
                    dat_solicitud711.iddatosffsol as idfuente,
                    ff.denominacion as fuente,
                    dat_producto711.denominacion as indicador,
                    sum(suministrototal) over() as totalsolicitado,
		    sum(totalgeneral) over() as totalsolicitadofar,
    		    sum(Case when dat_solicitud711.nopedido is not null then Coalesce(suministrototal, valorreal) else 0.000000 end) over() as totalpresentadonegocio,
		    sum(Case when dat_solicitud711.nopedido is not null then Coalesce(totalgeneral, valorreal) else 0.000000 end) over() as totalpresentadofar,
                    sum(valorreal) over() as totalcontratado,
                    sum(valorreal) over() as totalcontratadofar,
                    count(dat_solicitud711.idsolicitud711) over() as totalsolitudes
                  FROM 
                    mod_plan711.dat_plan711, 
                    mod_plan711.dat_solicitud711                    
                    left join mod_plan711.dat_solicitudsituacion spp on (dat_solicitud711.idsolicitud711 = spp.idsolicitud711 and activo = 1)
                    left join mod_planificacion.nom_datosnomenclador n2 on (n2.iddatosnomenclador = spp.iddatossituacion) 
                    left join mod_planificacion.nom_datosnomenclador tp on (tp.iddatosnomenclador = dat_solicitud711.idtiposolicitudplan) 
                    left join mod_planificacion.nom_datosnomenclador ff on (ff.iddatosnomenclador = dat_solicitud711.iddatosffsol) 
                    left join mod_planificacion.nom_datosnomenclador cod on (cod.iddatosnomenclador = dat_solicitud711.iddatoscc) 
                    left join mod_planificacion.nom_datosnomenclador emimp on (emimp.iddatosnomenclador = dat_solicitud711.iddatosempimp) 
                    left join mod_plan711.dat_personadel711 pers on (dat_solicitud711.idgerente = pers.idpersonadel711)
                    left join mod_plan711.dat_codigodecc on (dat_solicitud711.idcodigodecc = dat_codigodecc.idcodigodecc)
                    left join mod_plan711.dat_producto711 on (dat_solicitud711.idproductoindicador = dat_producto711.idproducto711 and tipo=1),
					
                    mod_planificacion.nom_datosnomenclador n1,
                    mod_planificacion.nom_ejercicioplanificacion
                  WHERE 
                    dat_solicitud711.idplan711 = dat_plan711.idplan711 AND
                    n1.iddatosnomenclador = dat_solicitud711.iddatosestado and dat_plan711.idejercicio = nom_ejercicioplanificacion.idejercicio $addWhere
                    Group by
                    dat_solicitud711.idsolicitud711, 
                    dat_solicitud711.idplan711, 
                    dat_solicitud711.identidadcliente, 
                    dat_solicitud711.identidaddestino, 
                    dat_solicitud711.iddatosempimp,
                    emimp.denominacion,
                    cod.denominacion,
                    tp.denominacion,
                    ff.denominacion,
                    --iddatosff,  
                    --montoff,  
                    dat_solicitud711.iddatoscc, 
                    dat_solicitud711.iddatosestado,
                    n1.denominacion, 
                    dat_solicitud711.fechapresped, 
                    dat_solicitud711.descripciongeneral, 
                    dat_solicitud711.suministrototal, 
                    dat_solicitud711.otrosgastos, 
                    dat_solicitud711.totalgeneral, 
                    dat_solicitud711.antecedentes, 
                    dat_solicitud711.lugarentrega, 
                    dat_solicitud711.nosolicitud, 
                    dat_solicitud711.nopedido, 
                    dat_codigodecc.codigo,
                    dat_codigodecc.idcodigodecc,
                    n2.denominacion,
                    n2.iddatosnomenclador,
                    nom_ejercicioplanificacion.ejercicio,
                    pers.nombre,
                    dat_solicitud711.idespecialista,
                    dat_solicitud711.idgerente,
                    dat_solicitud711.iddirector,
                    dat_solicitud711.aperturacredito,
                    dat_solicitud711.valorreal,
                    spp.iddatossituacion,
                    dat_solicitud711.textnosolicitudo,
                    dat_solicitud711.estaconsolidada,
                    dat_solicitud711.esconsolidada,
                    dat_solicitud711.iddatostarea,
                    dat_solicitud711.iddirectorecon,
                    dat_solicitud711.idespecialistacs,
                    dat_solicitud711.idcomprador,
                    dat_solicitud711.idtiposolicitudplan,                    
                    dat_solicitud711.nombreentidad,
                    dat_solicitud711.codigoaprob,
                    dat_producto711.denominacion
            order by dat_solicitud711.nosolicitud ASC"              
        ;
        //print_r('<pre>');print_r($sql); die; 
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
        
    }
    
    public function RevisarSolicitudes($parametros) {
        $ids= implode(',', $parametros['solconsolidar']);
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT textnosolicitudo, nombre, codigo, precio from mod_plan711.f_comprobarsolicitud(
                    array[$ids],
                    '{$parametros['usuario']}');";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function DameRevision($parametros) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT textnosolicitudo, nombre, codigo, precio from resultado_".$parametros['usuario'];
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function ListarIndNivelPlanif($filtros, $start, $limit, $tipoplan) {
        $addWhere = "";
        $addWaving = "";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere.=" and i.codigo LIKE '" . $datos['data']['value'] . "%'";
                }
                if ($datos['field'] == 'numeropieza') {
                    $addWhere.=" and upper(i.numeropieza) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'denominacion') {
                    $addWhere.=" and upper(i.denominacion) LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } elseif ($datos['field'] == 'precio') {
                    if ($tipoplan == 1)
                        $campo = "ipl.precioventa";
                    else
                        $campo = "ipl.precio";
                    if ($datos['data']['comparison'] == "gt") {
                        $addWhere.=" and $campo>" . $datos['data']['value'];
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $addWhere.=" and $campo<" . $datos['data']['value'];
                    } else {
                        $addWhere.=" and $campo=" . $datos['data']['value'];
                    }
                } elseif ($datos['field'] == 'umedida') {
                    $addWhere.=" and i.idumedida=" . $datos['data']['value'];
                } elseif ($datos['field'] == 'centrobalance') {
                    $addWhere.=" and cb.identidaddatosnomenclador=" . $datos['data']['value'];
                } elseif ($datos['field'] == 'viaadquisicion') {
                    $addWaving.=" having list(va.denominacion) LIKE '%" . $datos['data']['value'] . "%'";
                }
            }
        }
        $query = "SELECT count(*) OVER() as total,
		i.idindicador,
                        i.codigo,
                        i.estado,
                        i.idformato,
                        i.denominacion,
                        i.precio,
                        ipl.precioventa,
                        list(va.denominacion) as viaadquisicion,
                        i.numeropieza,
                        ed.identidad,
                        i.idumedida
                 FROM mod_datosmaestros.nom_indicador i
                      LEFT JOIN mod_datosmaestros.nom_indicadorplanif ipl 
                      ON i.idindicador = ipl.idindicador
                      left JOIN mod_datosmaestros.dat_indicadorcentrobalance cb 
                      ON i.idindicador  = cb.idindicador
                      left JOIN mod_planificacion.dat_entidaddatosnomenclador ed 
                      ON cb.identidaddatosnomenclador = ed.identidaddatosnomenclador
                      LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion v 
                      ON i.idindicador  = v.idindicador
                      LEFT JOIN mod_datosmaestros.nom_viaadquisicion va 
                      ON va.idviaadquisicion  = v.idviaadquisicion
                 WHERE 
                       (i.estado = 1 /*AND
                       ipl.nivelplanif = 1 AND
                       ipl.idaprobacion = 4*/) and length(i.codigo)>=10
                       $addWhere
                       group by i.idindicador,
                        i.codigo,
                        i.estado,
                        i.idformato,
                        i.denominacion,
                        ipl.precio,
                        ipl.precioventa,
                         i.numeropieza,
                         ed.identidad,
                         i.idumedida
                         --having list(va.denominacion) LIKE '%CONCENTRACION DE COMPRAS, Importacion directa%' or list(va.denominacion) LIKE '%Importacion directa%'
                 ORDER BY i.codigo offset $start
                       limit $limit";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }
}