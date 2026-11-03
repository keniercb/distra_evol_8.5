<?php

class DatProducto711 extends BaseDatProducto711 {
    
    public function setUp() {
        parent::setUp();
    }
    
    public function listarProductos711($params){
        $conn = Doctrine_Manager::connection();
        $addWhere = "true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $addWhere .= " AND upper(prod.denominacion) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";
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
                }elseif ($datos ['field'] == 'plan') {
                    $addWhere .= " AND upper (nom_ejercicioplanificacion.ejercicio) LIKE " . "'%" . strtoupper($datos['data']['value']). "%'";                   
                }
            }
        } 
        if ($params['tipo']!=NULL) {
            $addWhere.=" AND prod.tipo = {$params['tipo']}";
        }
        
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
                
        $sql = "SELECT idproducto711, prod.denominacion, precio, codigocup, iddatosunidadmedida,p.denominacion as um, 
                        iddatosempimp, p1.denominacion as importadora, numeropieza, prod.tipo, substring(nom_ejercicioplanificacion.ejercicio, 0, 5) as plan,
                        count(*) over() as total
                FROM mod_plan711.dat_producto711 prod
                        left JOIN mod_planificacion.nom_datosnomenclador p ON (prod.iddatosunidadmedida = p.iddatosnomenclador)
                        left JOIN mod_planificacion.nom_datosnomenclador p1 ON (prod.iddatosempimp = p1.iddatosnomenclador) 
			left JOIN mod_plan711.dat_plan711 ON (mod_plan711.dat_plan711.idplan711 = prod.idplan711)
                        left JOIN mod_planificacion.nom_ejercicioplanificacion ON (mod_plan711.dat_plan711.idejercicio = mod_planificacion.nom_ejercicioplanificacion.idejercicio)
                        where $addWhere and prod.activo=1 
                $delimitando;";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function AdicionarProductos($paramestros){
        $prod = new DatProducto711();
        $prod->denominacion = $paramestros['denom'];
        $prod->precio = $paramestros['precio'];
        $prod->codigocup = $paramestros['codigocup'];
        $prod->iddatosunidadmedida = $paramestros['um'];
        $prod->iddatosempimp = $paramestros['idempimp'];
        $prod->numeropieza = $paramestros['numeropieza'];
        $prod->tipo = 0;
        $prod->save();
        return 1;
    }
    
    public function AdicionarIndicador($paramestros){
        $prod = new DatProducto711();
        $prod->denominacion = $paramestros['denom'];
        $prod->iddatoscodigo = $paramestros['iddatoscodigo'];
        $prod->iddatostipocodigo = $paramestros['iddatostipocodigo'];
        $prod->tipo = 1;
        $prod->save();
        return 1;
    }
    
    public function AdicionarTarea($paramestros){
        $prod = new DatProducto711();
        $prod->denominacion = $paramestros['denom'];
        $prod->iddatostipocodigo = $paramestros['iddatostipocodigo'];
        $prod->tipo = 2;
        $prod->idplan711 = $paramestros['idplan711'];
        $prod->save();
        return 1;
    }
    
    public function ModificarProductos($paramestros){
        $conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_producto711
                        SET  
                        denominacion='{$paramestros['denom']}', 
                        precio={$paramestros['precio']}, 
                        iddatosunidadmedida={$paramestros['um']},
                        numeropieza = '{$paramestros['numeropieza']}', 
                        codigocup ='{$paramestros['codigocup']}'
                      WHERE idproducto711={$paramestros['idproducto711']};";
            $conn->execute($sqlupd);     
        return 1;
    }
    
    public function EliminarProductos($paramestros){
        
        $conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_producto711
                        SET  
                        activo=0                        
                      WHERE idproducto711={$paramestros['idproducto711']};";
            $conn->execute($sqlupd);     
        return 1;
    }
    
    public function ExisteProductos711($params){
        $conn = Doctrine_Manager::connection();
        $addWhere = "true";
        if ($params['tipo']!=NULL) {
            $addWhere.=" AND prod.tipo = {$params['tipo']}";
        }
        
        if ($params['filtros']['field'] == 'codigocup') {
            $addWhere .= " AND codigocup = " . "'" . $params['filtros']['data']['value'] . "'";
        }
        
        $sql = "SELECT idproducto711, prod.denominacion, precio, codigocup, iddatosunidadmedida,p.denominacion as um, 
                        iddatosempimp, p1.denominacion as importadora, numeropieza, prod.tipo, substring(nom_ejercicioplanificacion.ejercicio, 0, 5) as plan,
                        count(*) over() as total
                FROM mod_plan711.dat_producto711 prod
                        left JOIN mod_planificacion.nom_datosnomenclador p ON (prod.iddatosunidadmedida = p.iddatosnomenclador)
                        left JOIN mod_planificacion.nom_datosnomenclador p1 ON (prod.iddatosempimp = p1.iddatosnomenclador) 
			left JOIN mod_plan711.dat_plan711 ON (mod_plan711.dat_plan711.idplan711 = prod.idplan711)
                        left JOIN mod_planificacion.nom_ejercicioplanificacion ON (mod_plan711.dat_plan711.idejercicio = mod_planificacion.nom_ejercicioplanificacion.idejercicio)
                        where $addWhere and prod.activo=1 ;";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    public function DameProductosDe711($idsolictud){
        $conn = Doctrine_Manager::connection();
        
        $sql = "SELECT idsolicitudproductos, idsolicitud711, idproducto711, cantidad, 
                    trimestre1, trimestre2, trimestre3, trimestre4, precio, distribuido, 
                    urlimagen, nombreimg, descripcion
                FROM mod_plan711.dat_solicitudproductos where idsolicitud711 = $idsolictud";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function ActualizarPrecioProd($id, $precio){
        $conn = Doctrine_Manager::connection();
            $sqlupd = "UPDATE mod_plan711.dat_solicitudproductos
                        SET   
                        precio=$precio
                       WHERE idsolicitudproductos = $id;";
            $conn->execute($sqlupd);     
        return 1;
    }
    
    public function AprobarEnMaestro1($id, $precio){
        $conn = Doctrine_Manager::connection();
                $sqlupd = "UPDATE mod_datosmaestros.nom_indicador
       SET estado = 1;";
                $conn->execute($sqlupd); 
                
        return 1;
    }
    
    public function AprobarEnMaestro2($id, $precio){
                $conn2 = Doctrine_Manager::connection();
                $sqlupd2 = "UPDATE mod_datosmaestros.nom_indicadorplanif
       SET nivelplanif=1,idaprobacion=4;";
            $conn2->execute($sqlupd2); 
        return 1;
    }
            
    public function Productos711DadoEntidad($params){
        $conn = Doctrine_Manager::connection();
        $addWhere = "true ";
        if ($params['identidad']!=NULL) {
            $addWhere.=" AND dat_solicitud711.identidadcliente = {$params['identidad']}";
        }
        if ($params['arrayIdsolicitud711']!=NULL) {
            $addWhere.=" AND dat_solicitud711.idsolicitud711 in ({$params['arrayIdsolicitud711']})";
        }
        if ($params['anno']!=NULL) {
            $addWhere.=" AND nom_ejercicioplanificacion.ejercicio = '{$params['anno']}'";
        }
        if ($params['denominacion']!=NULL) {
            $addWhere.=" AND upper(nom_indicador.denominacion) like upper('%{$params['denominacion']}'%)";
        }
        if ($params['numeropieza']!=NULL) {
            $addWhere.=" AND upper(nom_indicador.numeropieza) like upper('%{$params['numeropieza']}'%)";
        }
        if ($params['codigo']!=NULL) {
            $addWhere.=" AND upper(nom_indicador.codigo) like upper('%{$params['codigo']}'%)";
        }
        if ($params['denominacionunidadmedida']!= NULL) {
            $addWhere.=" AND upper(nom_unidadmedida.denominacionunidadmedida) like upper('%{$params['denominacionunidadmedida']}'%)";
        }
        if ($params['abreviaturaunidadmedida']!= NULL) {
            $addWhere.=" AND upper(nom_unidadmedida.abreviaturaunidadmedida) like upper('%{$params['abreviaturaunidadmedida']}'%)";
        }
        if ($params['idumedida']!=NULL) {
            $addWhere.=" AND nom_unidadmedida.idumedida = {$params['idumedida']}";
        }
        if ($params['nosolicitud']!=NULL) {
            $addWhere.=" AND dat_solicitud711.textnosolicitudo like upper('%{$params['nosolicitud']}'%)";
        }
                
        $sql = "SELECT 
                    dat_solicitudproductos.idproducto711 as idindicador, 
                    substring(array_agg(dat_solicitudproductos.idsolicitud711)::text,2,(length(array_agg(dat_solicitudproductos.idsolicitud711)::text)-2)) as arregloidsolicitud,
                    substring(array_agg(dat_solicitud711.textnosolicitudo)::text,2,(length(array_agg(dat_solicitud711.textnosolicitudo)::text)-2)) as nosolicitud,
                    sum(dat_solicitudproductos.cantidad) as sumacantidad, 
                    substring(array_agg(dat_solicitudproductos.cantidad)::text,2,(length(array_agg(dat_solicitudproductos.cantidad)::text)-2)) as arreglocantidad,
                    dat_solicitud711.identidadcliente,
                    count(dat_solicitudproductos.idproducto711) as cantrepproducto,
                    nom_ejercicioplanificacion.ejercicio, 
                    nom_ejercicioplanificacion.idejercicio, 
                    nom_ejercicioplanificacion.actual, 
                    nom_ejercicioplanificacion.idestado, 
                    nom_indicador.denominacion, 
                    nom_indicador.numeropieza, 
                    nom_indicador.codigo, 
                    nom_indicador.idumedida, 
                    nom_unidadmedida.denominacionunidadmedida, 
                    nom_unidadmedida.abreviaturaunidadmedida
                  FROM 
                    mod_plan711.dat_solicitudproductos
                    INNER JOIN mod_datosmaestros.nom_indicador ON (mod_plan711.dat_solicitudproductos.idproducto711 = mod_datosmaestros.nom_indicador.idindicador)
                    INNER JOIN mod_plan711.dat_solicitud711 ON (mod_plan711.dat_solicitudproductos.idsolicitud711 = mod_plan711.dat_solicitud711.idsolicitud711)
                    INNER JOIN mod_plan711.dat_plan711 dat_plan7111 ON (mod_plan711.dat_solicitud711.idplan711 = dat_plan7111.idplan711)
                    INNER JOIN mod_planificacion.nom_ejercicioplanificacion ON (dat_plan7111.idejercicio = mod_planificacion.nom_ejercicioplanificacion.idejercicio)
                    INNER JOIN mod_datosmaestros.nom_unidadmedida ON (mod_datosmaestros.nom_indicador.idumedida = mod_datosmaestros.nom_unidadmedida.idunidadmedida)
                  WHERE 
                    $addWhere
                  GROUP BY
                    dat_solicitudproductos.idproducto711,
                    dat_solicitud711.identidadcliente,
                    nom_ejercicioplanificacion.ejercicio, 
                    nom_ejercicioplanificacion.idejercicio, 
                    nom_ejercicioplanificacion.actual, 
                    nom_ejercicioplanificacion.idestado,
                    nom_indicador.denominacion, 
                    nom_indicador.numeropieza, 
                    nom_indicador.codigo, 
                    nom_indicador.idumedida, 
                    nom_unidadmedida.denominacionunidadmedida, 
                    nom_unidadmedida.abreviaturaunidadmedida
                  ORDER BY idproducto711";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
}
