<?php

class ExistenciaspublicasModel extends BaseModel
{
    public function cargarExistencia($filtro)
    {
        $identidad1 = $filtro['identidad'];
        $where = "";
        $orderby = "";
        $group2 = "";
        
       // error_log("Filtros recibidos: " . print_r($filtro, true));
        
        // Determinar si estamos cargando detalles o registros principales
        if ($filtro['detalles'])  {
            $select = ", p.idproducto,ent.idestructura AS entidad_id,dep.idestructura AS almacen_id, ni.numeropieza AS codproveedor,(p.cantidad - COALESCE((
                SELECT SUM(cc.cantidad)
                FROM mod_logistica.dat_cantidadcomprometida cc
                WHERE cc.estado = 1 AND cc.idproducto = p.idproducto
                ), 0)) AS disponible,
                p.cantidad AS existencia,
                num.abreviaturaunidadmedida AS umedida,
                num.abreviaturaunidadmedida AS umop,
                ent.denominacion AS entidad,
                dep.denominacion AS almacen";
                
            $join = "JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
                JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
                JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
                JOIN mod_estructuracomp.v_dametodasestructuras ent ON p.idestructuracomun = ent.idestructura
                JOIN mod_estructuracomp.v_dametodasestructuras dep ON p.idestructura = dep.idestructura
                LEFT JOIN mod_datosmaestros.nom_marca m ON m.idmarca = nih.idmarca
                LEFT JOIN mod_datosmaestros.nom_modelo mm ON mm.idmodelo = nih.idmodelo";
                
            $group = "ni.idindicador, p.idproducto, ent.idestructura, dep.idestructura, ni.numeropieza, 
                ent.denominacion, dep.denominacion, p.cantidad, num.abreviaturaunidadmedida, nih.descripcionventa";
                
            $group2 = ", ni.denominacion, ni.descripcion";
                
            $orderby = "ent.idestructura, dep.idestructura, ni.numeropieza";
        } else {
            $select = "";
            $join = "JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
                JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
                JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
                LEFT JOIN mod_datosmaestros.nom_marca m ON m.idmarca = nih.idmarca
                LEFT JOIN mod_datosmaestros.nom_modelo mm ON mm.idmodelo = nih.idmodelo";
                
            $group = "ni.idindicador, ni.numeropieza, nih.descripcionventa, ni.denominacion, ni.descripcion, nat.denominacion, m.denominacion, mm.denominacion, num.abreviaturaunidadmedida";
            
            $orderby = "ni.numeropieza";
        }
          if ($filtro['codigo']) {
            $where .= "and ni.numeropieza ILIKE '%{$filtro['codigo']}%'";
        }
         if ($filtro['denominacion']) {
            $where .= "and ni.denominacion ILIKE '%{$filtro['denominacion']}%'";
        }
         if ($filtro['naturaleza']) {
            $where .= "and ni.idnaturaleza = '{$filtro['naturaleza']}'";
        }
         if ($filtro['umedida']) {
            $where .= "and num.abreviaturaunidadmedida   ILIKE '%{$filtro['umedida']}%'";
        }
         if ($filtro['marca']) {
            $where .= "and m.denominacion ILIKE '%{$filtro['marca']}%'";
        }
         if ($filtro['modelo']) {
            $where .= "and mm.denominacion ILIKE '%{$filtro['modelo']}%'";
        }
        if ($filtro['idindicador']) {
            $where .= "and ni.idindicador = '{$filtro['idindicador']}'";
        }  
         if ($filtro['almacen']) {
            $where .= "and dep.denominacion = '{$filtro['almacen']}'";
        }
      
//        if ($filtro['idministerio']) {
//            $where = "and dp.idestructuracomun = '{$filtro['idministerio']}'";
//        } 
       
        $filtro['identidad'] = $this->global->Estructura->idestructura;
        if ($filtro['idsubordinacion']) {
            $filtro['identidad'] = $filtro['idsubordinacion'];
        }
       
        if ($filtro['criterio']) {
            $where .= "and (ni.numeropieza ILIKE '%{$filtro['criterio']}%' or ni.denominacion ILIKE '%{$filtro['criterio']}%')";
        }

        
        //error_log("Cláusula WHERE: " . $where);
        
        // Base SQL query
        $sql = "SELECT 
            ni.idindicador,
            p.idproducto,
            ent.idestructura AS entidad_id,
            dep.idestructura AS almacen_id,
                        ni.numeropieza AS codigo,
            (p.cantidad - COALESCE((
                SELECT SUM(cc.cantidad)
                FROM mod_logistica.dat_cantidadcomprometida cc
                WHERE cc.estado = 1 AND cc.idproducto = p.idproducto
            ), 0)) AS disponible,
            p.cantidad AS existencia,
                        UPPER(COALESCE(nih.descripcionventa, ni.denominacion)) AS denominacion,
                        ni.descripcion,
            num.abreviaturaunidadmedida AS umedida,
                        nat.denominacion AS naturaleza,
                        m.denominacion AS marca,
                        mm.denominacion AS modelo,
            ent.denominacion AS entidad,
            dep.denominacion AS almacen,
            count(*) over() as cantidad
                        
                        FROM mod_logistica.dat_producto p
                        JOIN mod_datosmaestros.nom_indicador ni ON p.idindicador = ni.idindicador
                        JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
                            JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
                            JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
            JOIN mod_estructuracomp.v_dametodasestructuras ent ON p.idestructuracomun = ent.idestructura
            JOIN mod_estructuracomp.v_dametodasestructuras dep ON p.idestructura = dep.idestructura
                            LEFT JOIN mod_datosmaestros.nom_marca m ON m.idmarca = nih.idmarca
                            LEFT JOIN mod_datosmaestros.nom_modelo mm ON mm.idmodelo = nih.idmodelo
                        INNER JOIN (
                            SELECT DISTINCT dp.idproducto
                            FROM mod_logistica.dat_producto dp
                            INNER JOIN mod_datosmaestros.nom_indicador nni ON nni.idindicador = dp.idindicador
                            INNER JOIN mod_logdistribucion.conf_depositopublico dpu ON dpu.iddeposito = dp.idestructura AND dpu.iddeposito IS NOT NULL
                            LEFT JOIN mod_logdistribucion.dat_depositonaturaleza dn ON dn.idnaturaleza = nni.idnaturaleza
                        ) q ON q.idproducto = p.idproducto
            WHERE
            p.cantidad > 0
            AND ent.idestructura = $identidad1
            $where
            /*AND dep.idestructura = 200536327*/";
            
        error_log("SQL Query: " . $sql);//print_r($sql);die;
        
        // Establecer valores predeterminados para paginación
        $start = isset($filtro['start']) ? intval($filtro['start']) : 0;
        $limit = isset($filtro['limit']) ? intval($filtro['limit']) : 25;
        
        try {
            $datos = Doctrine_Manager::connection()->fetchAll(
                $sql . " OFFSET ? LIMIT ?", array($start, $limit)
            );
            
            return array(
                'cantidad' => (isset($datos[0]) && isset($datos[0]['cantidad'])) ? $datos[0]['cantidad'] : 0,
                'datos' => $datos
            );
        } catch (Exception $e) {
            error_log("Error en consulta SQL: " . $e->getMessage());
            error_log("Traza: " . $e->getTraceAsString());
            // Retornamos un array vacío válido para evitar errores en el cliente
            return array('cantidad' => 0, 'datos' => array());
        }
    }
    
    // Los otros métodos permanecen igual
   
     static public function obtenerCodigo($params) {
        // Código existente sin cambios
        $sql = "SELECT DISTINCT
            ni.numeropieza AS codigo, dep.idestructura
                        
                        FROM mod_logistica.dat_producto p
                        JOIN mod_datosmaestros.nom_indicador ni ON p.idindicador = ni.idindicador
                        JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
                            JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
                            JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
            JOIN mod_estructuracomp.v_dametodasestructuras ent ON p.idestructuracomun = ent.idestructura
            JOIN mod_estructuracomp.v_dametodasestructuras dep ON p.idestructura = dep.idestructura
                            LEFT JOIN mod_datosmaestros.nom_marca m ON m.idmarca = nih.idmarca
                            LEFT JOIN mod_datosmaestros.nom_modelo mm ON mm.idmodelo = nih.idmodelo
                        LEFT JOIN (
                            SELECT DISTINCT dp.idproducto
                            FROM mod_logistica.dat_producto dp
                            INNER JOIN mod_datosmaestros.nom_indicador nni ON nni.idindicador = dp.idindicador
                            INNER JOIN mod_logdistribucion.conf_depositopublico dpu ON dpu.iddeposito = dp.idestructura AND dpu.iddeposito IS NOT NULL
                            LEFT JOIN mod_logdistribucion.dat_depositonaturaleza dn ON dn.idnaturaleza = nni.idnaturaleza
                        ) q ON q.idproducto = p.idproducto
            WHERE
            p.cantidad > 0
             AND ent.idestructura = $params order by ni.numeropieza";
            
        error_log("SQL Query: " . $sql);
        
        // Establecer valores predeterminados para paginación
        $start = isset($filtro['start']) ? intval($filtro['start']) : 0;
        $limit = isset($filtro['limit']) ? intval($filtro['limit']) : 25;
        
        try {
            $datos = Doctrine_Manager::connection()->fetchAll(
                $sql
            );
            
            return $datos;
        } catch (Exception $e) {
            error_log("Error en consulta SQL: " . $e->getMessage());
            error_log("Traza: " . $e->getTraceAsString());
            // Retornamos un array vacío válido para evitar errores en el cliente
            return array('cantidad' => 0, 'datos' => array());
        }
    }
     static public function obtenerDenominacion($params) {
        // Código existente sin cambios
        $sql = "SELECT DISTINCT
            ni.denominacion AS denominacion, ni.denominacion
                        
                        FROM mod_logistica.dat_producto p
                        JOIN mod_datosmaestros.nom_indicador ni ON p.idindicador = ni.idindicador
                        JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
                            JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
                            JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
            JOIN mod_estructuracomp.v_dametodasestructuras ent ON p.idestructuracomun = ent.idestructura
            JOIN mod_estructuracomp.v_dametodasestructuras dep ON p.idestructura = dep.idestructura
                            LEFT JOIN mod_datosmaestros.nom_marca m ON m.idmarca = nih.idmarca
                            LEFT JOIN mod_datosmaestros.nom_modelo mm ON mm.idmodelo = nih.idmodelo
                        LEFT JOIN (
                            SELECT DISTINCT dp.idproducto
                            FROM mod_logistica.dat_producto dp
                            INNER JOIN mod_datosmaestros.nom_indicador nni ON nni.idindicador = dp.idindicador
                            INNER JOIN mod_logdistribucion.conf_depositopublico dpu ON dpu.iddeposito = dp.idestructura AND dpu.iddeposito IS NOT NULL
                            LEFT JOIN mod_logdistribucion.dat_depositonaturaleza dn ON dn.idnaturaleza = nni.idnaturaleza
                        ) q ON q.idproducto = p.idproducto
            WHERE
            p.cantidad > 0
            AND ent.idestructura = $params order by ni.denominacion";
            
        error_log("SQL Query: " . $sql);
        
        // Establecer valores predeterminados para paginación
        $start = isset($filtro['start']) ? intval($filtro['start']) : 0;
        $limit = isset($filtro['limit']) ? intval($filtro['limit']) : 25;
        
        try {
            $datos = Doctrine_Manager::connection()->fetchAll(
                $sql
            );
            
            return $datos;
        } catch (Exception $e) {
            error_log("Error en consulta SQL: " . $e->getMessage());
            error_log("Traza: " . $e->getTraceAsString());
            // Retornamos un array vacío válido para evitar errores en el cliente
            return array('cantidad' => 0, 'datos' => array());
        }
    }
    
     static public function obtenerAlmacen($params) {
        // Código existente sin cambios
        $sql = "SELECT DISTINCT
            dep.denominacion AS almacen, dep.idestructura
                        
                        FROM mod_logistica.dat_producto p
                        JOIN mod_datosmaestros.nom_indicador ni ON p.idindicador = ni.idindicador
                        JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
                            JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
                            JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
            JOIN mod_estructuracomp.v_dametodasestructuras ent ON p.idestructuracomun = ent.idestructura
            JOIN mod_estructuracomp.v_dametodasestructuras dep ON p.idestructura = dep.idestructura
                            LEFT JOIN mod_datosmaestros.nom_marca m ON m.idmarca = nih.idmarca
                            LEFT JOIN mod_datosmaestros.nom_modelo mm ON mm.idmodelo = nih.idmodelo
                        LEFT JOIN (
                            SELECT DISTINCT dp.idproducto
                            FROM mod_logistica.dat_producto dp
                            INNER JOIN mod_datosmaestros.nom_indicador nni ON nni.idindicador = dp.idindicador
                            INNER JOIN mod_logdistribucion.conf_depositopublico dpu ON dpu.iddeposito = dp.idestructura AND dpu.iddeposito IS NOT NULL
                            LEFT JOIN mod_logdistribucion.dat_depositonaturaleza dn ON dn.idnaturaleza = nni.idnaturaleza
                        ) q ON q.idproducto = p.idproducto
            WHERE
            p.cantidad > 0
            AND ent.idestructura = $params order by dep.denominacion";
            
        error_log("SQL Query: " . $sql);
        
        // Establecer valores predeterminados para paginación
        $start = isset($filtro['start']) ? intval($filtro['start']) : 0;
        $limit = isset($filtro['limit']) ? intval($filtro['limit']) : 25;
        
        try {
            $datos = Doctrine_Manager::connection()->fetchAll(
                $sql
            );
            
            return $datos;
        } catch (Exception $e) {
            error_log("Error en consulta SQL: " . $e->getMessage());
            error_log("Traza: " . $e->getTraceAsString());
            // Retornamos un array vacío válido para evitar errores en el cliente
            return array('cantidad' => 0, 'datos' => array());
        }
    }
     static public function obtenerMarca($params) {
        // Código existente sin cambios
        $sql = "SELECT DISTINCT
                m.denominacion AS marca, 
                m.idmarca 
                FROM mod_logistica.dat_producto p
                JOIN mod_datosmaestros.nom_indicador ni ON p.idindicador = ni.idindicador
                JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
                JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
                JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
                JOIN mod_estructuracomp.v_dametodasestructuras ent ON p.idestructuracomun = ent.idestructura
                JOIN mod_estructuracomp.v_dametodasestructuras dep ON p.idestructura = dep.idestructura
                LEFT JOIN mod_datosmaestros.nom_marca m ON m.idmarca = nih.idmarca
                LEFT JOIN mod_datosmaestros.nom_modelo mm ON mm.idmodelo = nih.idmodelo
                LEFT JOIN (
                    SELECT DISTINCT dp.idproducto
                    FROM mod_logistica.dat_producto dp
                    INNER JOIN mod_datosmaestros.nom_indicador nni ON nni.idindicador = dp.idindicador
                    INNER JOIN mod_logdistribucion.conf_depositopublico dpu ON dpu.iddeposito = dp.idestructura AND dpu.iddeposito IS NOT NULL
                    LEFT JOIN mod_logdistribucion.dat_depositonaturaleza dn ON dn.idnaturaleza = nni.idnaturaleza
                ) q ON q.idproducto = p.idproducto
                WHERE
                    p.cantidad > 0
                    AND m.idmarca IS NOT NULL
                    AND ent.idestructura = $params 
                ORDER BY marca";
                
            error_log("SQL Query: " . $sql);
        
        // Establecer valores predeterminados para paginación
        $start = isset($filtro['start']) ? intval($filtro['start']) : 0;
        $limit = isset($filtro['limit']) ? intval($filtro['limit']) : 25;
        
        try {
            $datos = Doctrine_Manager::connection()->fetchAll(
                $sql
            );
            
            return $datos;
        } catch (Exception $e) {
            error_log("Error en consulta SQL: " . $e->getMessage());
            error_log("Traza: " . $e->getTraceAsString());
            // Retornamos un array vacío válido para evitar errores en el cliente
            return array('cantidad' => 0, 'datos' => array());
        }
    }
    static public function obtenerModelo($params) {
        // Código existente sin cambios
        $sql = "SELECT DISTINCT
    mm.denominacion AS modelo, 
    mm.idmodelo 
FROM mod_logistica.dat_producto p
JOIN mod_datosmaestros.nom_indicador ni ON p.idindicador = ni.idindicador
JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
JOIN mod_estructuracomp.v_dametodasestructuras ent ON p.idestructuracomun = ent.idestructura
JOIN mod_estructuracomp.v_dametodasestructuras dep ON p.idestructura = dep.idestructura
LEFT JOIN mod_datosmaestros.nom_marca m ON m.idmarca = nih.idmarca
LEFT JOIN mod_datosmaestros.nom_modelo mm ON mm.idmodelo = nih.idmodelo
LEFT JOIN (
    SELECT DISTINCT dp.idproducto
    FROM mod_logistica.dat_producto dp
    INNER JOIN mod_datosmaestros.nom_indicador nni ON nni.idindicador = dp.idindicador
    INNER JOIN mod_logdistribucion.conf_depositopublico dpu ON dpu.iddeposito = dp.idestructura AND dpu.iddeposito IS NOT NULL
    LEFT JOIN mod_logdistribucion.dat_depositonaturaleza dn ON dn.idnaturaleza = nni.idnaturaleza
) q ON q.idproducto = p.idproducto
WHERE
    p.cantidad > 0
    AND mm.idmodelo IS NOT NULL
    AND ent.idestructura = $params 
ORDER BY modelo";
                
            error_log("SQL Query: " . $sql);
        
        // Establecer valores predeterminados para paginación
        $start = isset($filtro['start']) ? intval($filtro['start']) : 0;
        $limit = isset($filtro['limit']) ? intval($filtro['limit']) : 25;
        
        try {
            $datos = Doctrine_Manager::connection()->fetchAll(
                $sql
            );
            
            return $datos;
        } catch (Exception $e) {
            error_log("Error en consulta SQL: " . $e->getMessage());
            error_log("Traza: " . $e->getTraceAsString());
            // Retornamos un array vacío válido para evitar errores en el cliente
            return array('cantidad' => 0, 'datos' => array());
        }
    }
     static public function obtenerUmedida($params) {
        // Código existente sin cambios
        $sql = "SELECT DISTINCT
  num.abreviaturaunidadmedida AS umedida, 
  num.abreviaturaunidadmedida 
FROM mod_logistica.dat_producto p
JOIN mod_datosmaestros.nom_indicador ni ON p.idindicador = ni.idindicador
JOIN mod_datosmaestros.nom_indicadorhoja nih ON ni.idindicador = nih.idindicador
JOIN mod_datosmaestros.nom_unidadmedida num ON num.idunidadmedida = ni.idumedida
JOIN mod_datosmaestros.nom_naturaleza nat ON nat.idnaturaleza = ni.idnaturaleza
JOIN mod_estructuracomp.v_dametodasestructuras ent ON p.idestructuracomun = ent.idestructura
JOIN mod_estructuracomp.v_dametodasestructuras dep ON p.idestructura = dep.idestructura
LEFT JOIN mod_datosmaestros.nom_marca m ON m.idmarca = nih.idmarca
LEFT JOIN mod_datosmaestros.nom_modelo mm ON mm.idmodelo = nih.idmodelo
LEFT JOIN (
    SELECT DISTINCT dp.idproducto
    FROM mod_logistica.dat_producto dp
    INNER JOIN mod_datosmaestros.nom_indicador nni ON nni.idindicador = dp.idindicador
    INNER JOIN mod_logdistribucion.conf_depositopublico dpu ON dpu.iddeposito = dp.idestructura AND dpu.iddeposito IS NOT NULL
    LEFT JOIN mod_logdistribucion.dat_depositonaturaleza dn ON dn.idnaturaleza = nni.idnaturaleza
) q ON q.idproducto = p.idproducto
WHERE
    p.cantidad > 0
    AND ent.idestructura = $params
ORDER BY umedida";
                
            error_log("SQL Query: " . $sql);
        
        // Establecer valores predeterminados para paginación
        $start = isset($filtro['start']) ? intval($filtro['start']) : 0;
        $limit = isset($filtro['limit']) ? intval($filtro['limit']) : 25;
        
        try {
            $datos = Doctrine_Manager::connection()->fetchAll(
                $sql
            );
            
            return $datos;
        } catch (Exception $e) {
            error_log("Error en consulta SQL: " . $e->getMessage());
            error_log("Traza: " . $e->getTraceAsString());
            // Retornamos un array vacío válido para evitar errores en el cliente
            return array('cantidad' => 0, 'datos' => array());
        }
    }
    public function obtenerMarcas() {
        // Código existente sin cambios
    }
    
    public function obtenerModelos() {
        // Código existente sin cambios
    }
    
    public function obtenerEntidades() {
        // Código existente sin cambios
    }
    
    public function obtenerAlmacenes() {
        // Código existente sin cambios
    }
}