<?php

class DatDistribucioncodentidad extends BaseDatDistribucioncodentidad {
    
    public function setUp() {
        parent::setUp();
    }

    public function listarDistribucion($parametros) {
        //$uri= $param['uri'];
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dc.idplan711, 
                    dc.identidad, 
                    dc.iddatoscodigo, 
		    nom1.denominacion as dem,
                    p.denominacion as datos, 
		    Coalesce(p.denominacion||Coalesce(('('||nom2.denominacion||')'),''), nom1.denominacion) as denominacion,
                    p.idproducto711, 
                    p.precio, 
                    dc.iddatosempimp, 
                    dc.cantidad, 
                    dc.valor as monto,
                    dc.precio
                FROM mod_plan711.dat_distribucioncodentidad dc
                    left JOIN mod_planificacion.nom_datosnomenclador  nom1 ON (dc.iddatoscodigo = nom1.iddatosnomenclador)
                    left JOIN mod_plan711.dat_producto711 p ON (p.idproducto711 = dc.idproducto711)
		    left JOIN mod_planificacion.nom_datosnomenclador nom2 ON (nom2.iddatosnomenclador = p.iddatostipocodigo)
                where
                    dc.idplan711 = {$parametros['idplan711']} and dc.identidad = {$parametros['identidad']}
		    group by dc.idplan711,dc.identidad,dc.iddatoscodigo,
                    dc.iddatosempimp,dc.cantidad, dc.valor,dc.precio,nom2.denominacion,dem,datos,p.idproducto711
                    order by dem, denominacion, dc.iddatoscodigo asc";
                    
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarDistribucionAux($parametros) {
        $addwhere=" and true";
        if($parametros['identidad']!=null){
            $addwhere.=" and dc.identidad = {$parametros['identidad']}";
        }
        if($parametros['idcc']!=null){
            $addwhere.=" and de.iddatoscodigo = {$parametros['idcc']}";
        }
          
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    de.idplan711,
                    dc.identidad,
                    de.iddatoscodigo, 
                    coalesce(dc.valor, 0) as monto, 
                    coalesce(dc.precio, de.precio) as precio, 
                    coalesce(dc.cantidad, 0) as cantidad,
                    coalesce(dc.idproducto711, de.idproducto711) as idproducto711,
                    Coalesce(ni.denominacion, p2.denominacion) as denominacion,
                    nom3.denominacion as dem,
                    p711.montototal,
                    um.abreviaturaunidadmedida,
                    sum(dc.valor) over() as total,
                    coalesce (nom1.denominacion, nom1.denominacion) as denom2
                  FROM
                    mod_plan711.dat_distribucioncod de
                    left join mod_plan711.dat_distribucioncodentidad dc on (de.idproducto711 = dc.idproducto711 
                                and de.idplan711 = dc.idplan711 and de.iddatoscodigo = dc.iddatoscodigo $addwhere)
                    left JOIN mod_planificacion.nom_datosnomenclador  nom1 ON (de.iddatoscodigo = nom1.iddatosnomenclador)

                    LEFT OUTER JOIN mod_datosmaestros.nom_indicador ni ON (ni.idindicador = de.idproducto711)
                    LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (ni.idumedida = um.idunidadmedida)

                    left JOIN mod_plan711.dat_producto711 p2 ON (p2.idproducto711 = de.idproducto711)
                    left JOIN mod_planificacion.nom_datosnomenclador nom3 ON (nom3.iddatosnomenclador = p2.iddatostipocodigo)
	            inner join 	mod_plan711.dat_plan711 p711 on (de.idplan711 = p711.idplan711)	
		    
                  WHERE
                      de.idplan711 = {$parametros['idplan711']}
                      order by denominacion asc";

        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function listarIndProdDePlan($idplan) {
        //$uri= $param['uri'];
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idplan711, idproducto711
                    FROM mod_plan711.dat_distribucioncodentidad where idplan711 = $idplan and idproducto711 is not null
                    group by idplan711, idproducto711";
                    
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function MontoTotal($parametros) {
        //$uri= $param['uri'];
        $addwhere=" and true";
        if($parametros['identidad']!=null){
            $addwhere.=" and dc.identidad = {$parametros['identidad']}";
        }
        if($parametros['idempimp']!=null){
            $addwhere.=" and dc.iddatosempimp = {$parametros['idempimp']}";
        }
        if($parametros['idcc']!=null){
            $addwhere.=" and dc.iddatoscodigo = {$parametros['idcc']}";
        }
        if($parametros['idindicador']!=null){
            $addwhere.=" and dc.idproducto711 = {$parametros['idindicador']}";
        }
        
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT 
                    dc.idplan711, 
                    dc.iddatoscodigo, 
		    nom1.denominacion as dem,
                    p.denominacion as datos, 
		    Coalesce(coalesce (ni.denominacion, p.denominacion)||Coalesce(('('||(nom2.denominacion)||')'),''), nom1.denominacion) as denominacion,
                    coalesce (ni.idindicador, p.idproducto711) as idproducto711, 
                    p.precio, 
                    dc.iddatosempimp, 
                    sum(dc.cantidad) as cantidad, 
                    sum(dc.valor) as monto,
                    dc.precio,
			              sum (dc.valor) over() as valor
                FROM mod_plan711.dat_distribucioncodentidad dc
                    LEFT OUTER JOIN mod_datosmaestros.nom_indicador ni ON (ni.idindicador = dc.idproducto711)
                    LEFT OUTER JOIN mod_datosmaestros.nom_unidadmedida um ON (ni.idumedida = um.idunidadmedida)
                    left JOIN mod_planificacion.nom_datosnomenclador  nom1 ON (dc.iddatoscodigo = nom1.iddatosnomenclador)
                    left JOIN mod_plan711.dat_producto711 p ON (p.idproducto711 = dc.idproducto711)
		    left JOIN mod_planificacion.nom_datosnomenclador nom2 ON (nom2.iddatosnomenclador = p.iddatostipocodigo)
                where
                    dc.idplan711 = {$parametros['idplan711']} $addwhere
		    group by dc.idplan711,dc.iddatoscodigo,
                    dc.iddatosempimp,dc.precio,nom2.denominacion,dem,datos,p.idproducto711, ni.denominacion, ni.idindicador, dc.valor, dc.idproducto711
                    order by dem, denominacion, dc.iddatoscodigo asc";
        //print_r($sql); die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }
    
    public function  adicionarModificarDistr($parametros, $distribuc){
        //var_dump($distribuc); die;
        $conn = Doctrine_Manager::connection();             
        
        $sqldelete = "DELETE FROM mod_plan711.dat_distribucioncodentidad
                            WHERE identidad = {$parametros['identidad']}"
                            . "and idplan711 = {$parametros['idplan711']}";
        $conn->execute($sqldelete);
        
        for ($i = 0; $i < count($distribuc); $i++) {
            $iddatoscodigo = ($distribuc[$i]['iddatoscodigo'] != null) ? $distribuc[$i]['iddatoscodigo'] : 'null';
            $idproducto = ($distribuc[$i]['idproducto711'] != null) ? $distribuc[$i]['idproducto711'] : 'null';
            
            $cantidad = $distribuc[$i]['cantidad'];
            if(is_null($cantidad)){
                $cantidad='null';
            }
            $precio = ($distribuc[$i]['precio'] != null) ? floatval(str_replace(',','',$distribuc[$i]['precio'])) : 'null';
            $valor = floatval(str_replace(',','',$distribuc[$i]['monto']));
            $sqlinsert = "INSERT INTO mod_plan711.dat_distribucioncodentidad
                            (
                                idplan711, 
                                identidad, 
                                iddatoscodigo, 
                                idproducto711, 
                                iddatosempimp, 
                                cantidad, 
                                valor,
                                precio
                            )
                            VALUES ({$parametros['idplan711']},{$parametros['identidad']}, $iddatoscodigo, $idproducto,
                            {$parametros['idempimp']},
                            $cantidad,
                            $valor,
                            $precio);";                  
            $conn->execute($sqlinsert);                    
        }
        return 1;
    }
}
