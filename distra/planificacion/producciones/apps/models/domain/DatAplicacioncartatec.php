<?php

class DatAplicacioncartatec extends BaseDatAplicacioncartatec {

    public function setUp() {
        parent::setUp();
    }

    public function listarProducciones($params) {
        $addWhere = "";
        if ($params['fechaInicio']) {
            $params['fechaInicio'] = date('Y-m-d H:i:s', strtotime($params['fechaInicio']));
            $addWhere = $addWhere . " AND (prod.fechainicio >= '{$params['fechaInicio']}' OR prod.fechainicio IS NULL) ";
        }
        if ($params['fechaFin']) {
            $params['fechaFin'] = date('Y-m-d H:i:s', strtotime($params['fechaFin']));
            $addWhere = $addWhere . " AND (prod.fechafin <= '{$params['fechaFin']}' OR prod.fechafin IS NULL) ";
        }
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $addWhere .= " AND upper(ct.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'producto') {
                    $addWhere .= " AND upper(ind.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'valorrendimiento') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND ct.valorrendimiento<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND ct.valorrendimiento>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND ct.valorrendimiento={$datos['data']['value']}";
                    }
                } elseif ($datos['field'] == 'idumedidarendimiento') {
                    $addWhere .= " AND ct.idumedidarendimiento ={$datos['data']['value']}";
                } elseif ($datos ['field'] == 'nivelactividad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND prod.nivelactividad<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND prod.nivelactividad>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND prod.nivelactividad={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'volumenproduccionhistorico') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND prod.volumenproduccionhistorico<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND prod.volumenproduccionhistorico>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND prod.volumenproduccionhistorico={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'productividadest') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND prod.productividadest<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND prod.productividadest>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND prod.productividadest={$datos['data']['value']}";
                    }
                } elseif ($datos['field'] == 'idvariablecontrol') {
                    $addWhere .= " AND ct.idvariablecontrol ={$datos['data']['value']}";
                } elseif ($datos ['field'] == 'fechainicio') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND prod.fechainicio::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND prod.fechainicio::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND prod.fechainicio::date='{$fechafin}'";
                    }
                } elseif ($datos ['field'] == 'fecha') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND prod.fecha::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND prod.fecha::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND prod.fecha::date='{$fechafin}'";
                    }
                } elseif ($datos ['field'] == 'fechafin') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND prod.fechafin::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND prod.fechafin::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND prod.fechafin::date='{$fechafin}'";
                    }
                } elseif ($datos['field'] == 'idaprobacion') {
                    $addWhere .= " AND prod.idaprobacion ={$datos['data']['value']}";
                } elseif ($datos['field'] == 'idtipomodelo') {
                    $addWhere .= " AND ct.idtipomodelo ={$datos['data']['value']}";
                } elseif ($datos['field'] == 'idusuario') {
                    $addWhere .= " AND prod.idusuario ={$datos['data']['value']}";
                } elseif ($datos ['field'] == 'fechamodificacion') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND prod.fechamodificacion::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND prod.fechamodificacion::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND prod.fechamodificacion::date='{$fechafin}'";
                    }
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $orden = "";
        if ($params['ordenarProd'])
            $orden = "ind.denominacion,";
        $conn = Doctrine_Manager::connection();
        $query = "SELECT prod.idaplicacioncartatec,
                        prod.idcartatecnologica,
                        ct.denominacion as denominacion,
                        ind.denominacion as producto,
                        ct.valorrendimiento,
                        ct.idumedidarendimiento,
                        prod.nivelactividad,
                        prod.volumenproduccionhistorico,
                        prod.productividadest,
                        ct.idvariablecontrol,
                        prod.fechainicio,
                        prod.fechafin,
                        prod.fecha,
                        CASE WHEN prod.asegurado > 0 THEN TRUE ELSE FALSE END AS asegurado,
                        prod.idaprobacion,
                        ct.idtipomodelo,
                        prod.idusuario,
                        prod.fechamodificacion,
                        count(*) OVER() as total
                 FROM mod_spouam.dat_aplicacioncartatec prod
                      INNER JOIN mod_spouam.dat_cartatecnologica ct ON (prod.idcartatecnologica =
                        ct.idcartatecnologica)
                      INNER JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador =
                        ct.idindicador)
                      WHERE prod.identidad = {$params['identidad']} $addWhere 
                      ORDER BY $orden ct.denominacion, prod.idaplicacioncartatec
                       $delimitando";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function eliminarProducciones($idaplicacioncartatec_lista) {
        $conn = Doctrine_Manager::connection();
        $query = "DELETE 
                    FROM mod_spouam.dat_aplicacioncartatec 
                  WHERE 
                    idaplicacioncartatec IN($idaplicacioncartatec_lista) AND
                 idaprobacion = 1;";
        $conn->execute($query);
        return true;
    }

    public function listarCartasEnProduccion() {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT (idcartatecnologica)
                    FROM mod_spouam.dat_aplicacioncartatec";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        return $data;
    }

    public function obtenerActividadesProducciones($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                    a.codigo,
                    a.denominacion,
                    ca.plazo,
                    np.fechainicio,
                    np.fechafin,
                    dn.denominacion as etapa,  
                    ca.porciento,
                      CASE WHEN s.idservicio is NULL
                      THEN COALESCE(sum(ip.precio*n.necesidad*p.nivelactividad),0) 
                      ELSE COALESCE(sum(ip.precio*n.necesidad*p.nivelactividad*s.gasto),0) 
                    END as importe,
                    CASE WHEN s.idservicio is NULL
                          THEN ''
                    ELSE aca.denominacion  
                    END as actividadorigen
                  FROM 
                  mod_spouam.dat_aplicacioncartatec p
                     LEFT JOIN  mod_spouam.dat_actividadentidadprodcartatec np
                     ON(p.idaplicacioncartatec=np.idaplicacioncartatec)
                    LEFT JOIN mod_spouam.dat_cartatecnologicaactividad ca
                    ON(np.idcartatecnologicaactividad=ca.idcartatecnologicaactividad)    
                    LEFT JOIN mod_planificacion.nom_datosnomenclador dn
                    ON(dn.iddatosnomenclador=ca.idetapa) 
                    LEFT JOIN mod_planificacion.dat_actividadentidad ae
                    ON(np.idactividadentidad=ae.idactividadentidad)
                    LEFT JOIN mod_planificacion.nom_actividad a
                    ON(ae.idactividad=a.idactividad)
                    LEFT JOIN mod_planificacion.nom_ejercicioplanificacion e
                    ON(np.fechainicio BETWEEN e.fechainicio and e.fechafin)
                    LEFT JOIN mod_planificacion.dat_norma n
                    ON(n.idejercicio=e.idejercicio and n.idactividad=a.idactividad)
                    LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip
                    ON(ip.idindicador=n.idindicador and ip.nivelplanif=1 and ip.idaprobacion=4)
                    LEFT JOIN mod_spouam.dat_servicio s  
                    ON(s.idaplicacioncartatec=np.idaplicacioncartatec and s.idcartatecnologicaactividad=np.idcartatecnologicaactividad)
                    LEFT JOIN mod_planificacion.nom_actividad aca
                    ON(ca.idactividad=aca.idactividad)
                    where p.idaplicacioncartatec={$params['idaplicacioncartatec']} 
                    GROUP BY ca.idcartatecnologicaactividad,
                    np.nivelactividadproduccion,
                    a.codigo,
                    a.denominacion,
                    ca.plazo,
                    np.fechainicio,
                    np.fechafin,
                    dn.denominacion,  
                    ca.porciento,
                    aca.denominacion,
                    s.idservicio
                    order by np.fechainicio, a.codigo";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerIndicadoresProducciones($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                    i.codigo,
                    i.denominacion,
                    ip.precio,
                    i.idnaturaleza,
                    i.idumedida,
                    COALESCE(sum(n.necesidad), 0) as cantidad,                    
                    CASE WHEN s.idservicio is NULL
                    THEN COALESCE(sum(ip.precio*n.necesidad*p.nivelactividad),0) 
                    ELSE COALESCE(sum(ip.precio*n.necesidad*p.nivelactividad*s.gasto),0) 
                    END as importe
                    
                  FROM 
                  mod_spouam.dat_aplicacioncartatec p
                     LEFT JOIN  mod_spouam.dat_actividadentidadprodcartatec np
                     ON(p.idaplicacioncartatec=np.idaplicacioncartatec)
                    LEFT JOIN mod_spouam.dat_cartatecnologicaactividad ca
                    ON(np.idcartatecnologicaactividad=ca.idcartatecnologicaactividad)    
                    LEFT JOIN mod_planificacion.nom_datosnomenclador dn
                    ON(dn.iddatosnomenclador=ca.idetapa) 
                    LEFT JOIN mod_planificacion.dat_actividadentidad ae
                    ON(np.idactividadentidad=ae.idactividadentidad)
                    LEFT JOIN mod_planificacion.nom_actividad a
                    ON(ae.idactividad=a.idactividad)
                    LEFT JOIN mod_planificacion.nom_ejercicioplanificacion e
                    ON(np.fechainicio BETWEEN e.fechainicio and e.fechafin)
                    LEFT JOIN mod_planificacion.dat_norma n
                    ON(n.idejercicio=e.idejercicio and n.idactividad=a.idactividad)
                    LEFT JOIN mod_datosmaestros.nom_indicador i
                    ON(i.idindicador=n.idindicador)
                    LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip
                    ON(ip.idindicador=i.idindicador and ip.nivelplanif=1 and ip.idaprobacion=4)
                    LEFT JOIN mod_spouam.dat_servicio s  
                    ON(s.idaplicacioncartatec=np.idaplicacioncartatec and s.idcartatecnologicaactividad=np.idcartatecnologicaactividad)
                    LEFT JOIN mod_planificacion.nom_actividad aca
                    ON(ca.idactividad=aca.idactividad)
                    where p.idaplicacioncartatec={$params['idaplicacioncartatec']} 
                    GROUP BY i.codigo,
                            i.denominacion,
                            ip.precio,
                            i.idnaturaleza,
                            i.idumedida,
                            s.idservicio
                    ORDER BY i.codigo";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerImporteProduccion($idaplicacioncartatec) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                        sum( CASE WHEN s.idservicio is NULL
                            THEN COALESCE((ip.precio*n.necesidad*p.nivelactividad),0) 
                            ELSE COALESCE((ip.precio*n.necesidad*p.nivelactividad*s.gasto),0) 
                          END ) as importe
                        FROM 
                        mod_spouam.dat_aplicacioncartatec p
                        INNER JOIN mod_spouam.dat_cartatecnologica c
                          ON(p.idcartatecnologica=c.idcartatecnologica)
                          INNER JOIN mod_datosmaestros.nom_indicador i
                          ON(i.idindicador=c.idindicador)  
                          LEFT JOIN  mod_spouam.dat_actividadentidadprodcartatec np
                           ON(p.idaplicacioncartatec=np.idaplicacioncartatec)
                           LEFT JOIN mod_planificacion.dat_actividadentidad ae
                          ON(np.idactividadentidad=ae.idactividadentidad)
                          LEFT JOIN mod_planificacion.nom_actividad a
                          ON(ae.idactividad=a.idactividad)
                          LEFT JOIN mod_planificacion.nom_ejercicioplanificacion e
                          ON(np.fechainicio BETWEEN e.fechainicio and e.fechafin)
                          LEFT JOIN mod_planificacion.dat_norma n
                          ON(n.idejercicio=e.idejercicio and n.idactividad=a.idactividad)
                          LEFT JOIN mod_datosmaestros.nom_indicadorplanif ip
                          ON(ip.idindicador=n.idindicador and ip.nivelplanif=1 and ip.idaprobacion=4)
                           LEFT JOIN mod_spouam.dat_servicio s  
                          ON(s.idaplicacioncartatec=np.idaplicacioncartatec and s.idcartatecnologicaactividad=np.idcartatecnologicaactividad)  
                          where p.idaplicacioncartatec=$idaplicacioncartatec";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarActividadesAddServicio($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "actv." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(actv." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                }
            }
        }//Fin de los filtros

        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $start = $params['start'];
        $limit = $params['limit'];

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT actv.idactividad,
                        actv.codigo,
                        actv.denominacion,
                        actv.descripcion,
                        count(*) over() as total
                 FROM mod_planificacion.nom_actividad actv
                   INNER JOIN mod_planificacion.dat_actespcomportamiento aec 
                   ON (actv.idactividad = aec.idactividad AND aec.idespecialidad = {$params['idespecialidad']})
                   INNER JOIN mod_planificacion.nom_datosnomenclador dn 
                   ON(aec.iddatosnomenclador = dn.iddatosnomenclador)
                   INNER JOIN mod_planificacion.dat_norma n
                   ON(n.idejercicio={$params['idejercicio']} and n.idactividad=actv.idactividad)
                   INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                   ON(ip.idindicador=n.idindicador and ip.nivelplanif=1 and ip.idaprobacion=4)
                 WHERE actv.estado = 1 AND
                       actv.idaprobacion = 4 AND
                       actv.nivel = 4 AND
                       actv.idactividad not in({$params['idactividadorigen']}) AND
                        (dn.uridatosnomenclador = 'propia' OR
                        dn.uridatosnomenclador = 'compartida') $WHERE
                            group by actv.idactividad
                 OFFSET $start LIMIT $limit";
        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function getPlanesEntidad($identidad, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT (p.idplan) as id,
       CASE
         WHEN m.idplan is NULL THEN true
         ELSE false
       END as leaf,
       p.denominacion,
       p.codigo,
       p.descripcion,
       1 as tipo
FROM mod_planificacion.dat_plan p
     INNER JOIN mod_planificacion.dat_modelo m ON (p.idplan = m.idplan)
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON (m.idmodelo = em.idmodelo AND em.identidad = $identidad)
     INNER JOIN mod_spouam.dat_cartatecnologica ct ON (ct.idmodelo = m.idmodelo)
     INNER JOIN mod_spouam.dat_cartatecnologicaactividad cta ON (cta.idcartatecnologica = ct.idcartatecnologica AND cta.porciento > 0)
     INNER JOIN mod_spouam.dat_cartatecnologicaentidad cte ON (cte.idcartatecnologica = ct.idcartatecnologica AND cte.identidad = em.identidad)
     INNER JOIN mod_spouam.dat_aplicacioncartatec pr ON (pr.idcartatecnologicaentidad = cte.idcartatecnologicaentidad AND (pr.idaprobacion = 3 OR pr.idaprobacion = 4))
     INNER JOIN mod_spouam.dat_actividadentidadprodcartatec aepct ON (aepct.idaplicacioncartatec = pr.idaplicacioncartatec AND aepct.idcartatecnologicaactividad = cta.idcartatecnologicaactividad)
     INNER JOIN mod_planificacion.dat_actividadentidad ae ON (aepct.idactividadentidad = ae.idactividadentidad and ae.idejercicio = $idejercicio)
WHERE p.idplan = p.idpadre
order by p.denominacion";
        //print_r($sql);die;
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function getModelosPlan($identidad, $node, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT (m.idmodelo) as id,
       m.denominacion,
       m.descripcion,
       true as leaf,
       2 as tipo,
       tm.denominacion as tipomodelo,
       m.uriruta as ruta
FROM mod_planificacion.dat_modelo m
     INNER JOIN mod_planificacion.nom_tipomodelo tm ON (tm.idtipomodelo = m.idtipomodelo)
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON (m.idmodelo = em.idmodelo AND em.identidad = $identidad)
     INNER JOIN mod_spouam.dat_cartatecnologica ct ON (ct.idmodelo = m.idmodelo)
     INNER JOIN mod_spouam.dat_cartatecnologicaactividad cta ON (cta.idcartatecnologica = ct.idcartatecnologica AND cta.porciento > 0)
     INNER JOIN mod_spouam.dat_cartatecnologicaentidad cte ON (cte.idcartatecnologica = ct.idcartatecnologica AND cte.identidad = em.identidad)
     INNER JOIN mod_spouam.dat_aplicacioncartatec pr ON (pr.idcartatecnologicaentidad = cte.idcartatecnologicaentidad AND (pr.idaprobacion = 3 OR pr.idaprobacion = 4))
     INNER JOIN mod_spouam.dat_actividadentidadprodcartatec aepct ON (aepct.idaplicacioncartatec = pr.idaplicacioncartatec AND aepct.idcartatecnologicaactividad = cta.idcartatecnologicaactividad)
     INNER JOIN mod_planificacion.dat_actividadentidad ae ON (aepct.idactividadentidad = ae.idactividadentidad and ae.idejercicio = $idejercicio)
WHERE m.idplan = $node
order by m.denominacion";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function obtenerDatosActualizarPlan($identidad, $idmodelo, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT  ct.idindicador,
       CASE
         WHEN m.tipoplan = 1 THEN ip.precioventa
         ELSE ip.precio
       END AS precio,
       ip.preciodivisa,
       i.idumedida,
       icb.identidaddatosnomenclador as idcentrobalance,
       em.identidadmodelo,
       (
         select LIST(DISTINCT va.denominacion)
         from mod_datosmaestros.dat_indicadorviaadquisicion iva
              LEFT JOIN mod_datosmaestros.nom_viaadquisicion va ON iva.idviaadquisicion = va.idviaadquisicion
         WHERE ct.idindicador = iva.idindicador
       ) as via,
       (
         select LIST(DISTINCT os.denominacion)
         from mod_datosmaestros.dat_indicadorviaadquisicion iva
              LEFT JOIN mod_datosmaestros.nom_viaadquisicion va ON iva.idviaadquisicion = va.idviaadquisicion
              LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivos ON (iva.idindicador = ivos.idindicador AND iva.idviaadquisicion = ivos.idviaadquisicion)
              LEFT JOIN mod_datosmaestros.nom_organosatisface os ON (ivos.idorganosatisface = os.idorganosatisface AND os.ordender - os.ordenizq = 1)
         WHERE ct.idindicador = iva.idindicador
       ) as organo,
       sum(((ct.valorrendimiento * aepct.nivelactividadproduccion) * cta.porciento) / 100) as valorplan
FROM mod_planificacion.dat_actividadentidad ae
     INNER JOIN mod_spouam.dat_actividadentidadprodcartatec aepct ON (aepct.idactividadentidad = ae.idactividadentidad)
     INNER JOIN mod_spouam.dat_aplicacioncartatec pr ON (pr.idaplicacioncartatec = aepct.idaplicacioncartatec AND (pr.idaprobacion = 3 OR pr.idaprobacion = 4))
     INNER JOIN mod_spouam.dat_cartatecnologica ct ON (ct.idcartatecnologica = pr.idcartatecnologica AND ct.idmodelo = $idmodelo)
     INNER JOIN mod_spouam.dat_cartatecnologicaentidad cte ON (cte.idcartatecnologica = ct.idcartatecnologica AND cte.identidad = ae.identidad)
     INNER JOIN mod_spouam.dat_cartatecnologicaactividad cta ON (cta.idcartatecnologica = ct.idcartatecnologica AND cta.porciento > 0 AND cta.idactividad = ae.idactividad)
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON (em.idmodelo = ct.idmodelo AND em.identidad = ae.identidad)
     inner JOIN mod_planificacion.dat_modelo m ON (m.idmodelo = em.idmodelo)
     INNER JOIN mod_datosmaestros.nom_indicador i ON (ct.idindicador = i.idindicador)
     inner join mod_datosmaestros.nom_indicadorplanif ip on (ip.idindicador = i.idindicador)
     INNER JOIN mod_datosmaestros.nom_unidadmedida um ON i.idumedida = um.idunidadmedida
     INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb ON (i.idindicador = icb.idindicador)
WHERE ae.idejercicio = $idejercicio and
      ae.identidad = $identidad AND
      i.estado = 1 AND
      ip.idaprobacion = 4 AND
      ip.nivelplanif = 1
GROUP BY ct.idindicador,
         m.tipoplan,
         ip.precioventa,
         ip.precio,
         em.identidadmodelo,
         ip.preciodivisa,
         i.idumedida,
         icb.identidaddatosnomenclador";
        
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

}
