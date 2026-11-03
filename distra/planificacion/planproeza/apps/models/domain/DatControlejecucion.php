<?php

class DatControlejecucion extends BaseDatControlejecucion {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatDemandatiempo', array('local' => 'iddemandatiempo', 'foreign' => 'iddemandatiempo'));
    }

    public function listarControlEjecucionProductor($params) {
        $addWhere = "where true";
        $addHaving = "having true";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere.=" AND d.codigo LIKE '" . $datos['data']['value'] . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $addWhere.=" AND upper(d.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                    } else {
                        if ($datos['field'] == 'idumedida' || $datos['field'] == 'tieneobservacion' || $datos['field'] == 'iddestino' || $datos['field'] == 'idprograma' || $datos['field'] == 'identidadcliente') {
                            if ($datos['field'] == 'idumedida')
                                $addWhere.=" AND d.idumedida =" . $datos['data']['value'];
                            if ($datos['field'] == 'iddestino')
                                $addWhere.=" AND d.iddestino =" . $datos['data']['value'];
                            if ($datos['field'] == 'idprograma')
                                $addWhere.=" AND d.idprograma =" . $datos['data']['value'];
                            if ($datos['field'] == 'identidadcliente')
                                $addWhere.=" AND d.identidadcliente =" . $datos['data']['value'];
                            if ($datos['field'] == 'tieneobservacion')
                                $addWhere.=" AND d.tieneobservacion =" . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'enero' || $datos['field'] == 'febrero' ||
                                    $datos['field'] == 'marzo' || $datos['field'] == 'abril' ||
                                    $datos['field'] == 'mayo' || $datos['field'] == 'junio' ||
                                    $datos['field'] == 'julio' || $datos['field'] == 'agosto' ||
                                    $datos['field'] == 'septiembre' || $datos['field'] == 'octubre' ||
                                    $datos['field'] == 'noviembre' || $datos['field'] == 'diciembre') {
                                $cond = "";
                                if ($datos['data']['comparison'] == "gt") {
                                    $cond = ">";
                                } elseif ($datos['data']['comparison'] == "lt") {
                                    $cond = "<";
                                } else
                                    $cond = "=";
                                $addHaving.=" AND COALESCE(sum(d." . $datos['field'] . "), 0.000)" . $cond . $datos['data']['value'];
                            }
                            else {
                                if ($datos['field'] == 'plan' || $datos['field'] == 'ajuste' || $datos['field'] == 'importeplan' || $datos['field'] == 'importeajustado' || $datos['field'] == 'importeajustadodivisa' || $datos['field'] == 'importeplandivisa' || $datos['field'] == 'precio' || $datos['field'] == 'preciodivisa') {
                                    $cond = "";
                                    if ($datos['data']['comparison'] == "gt") {
                                        $cond = ">";
                                    } elseif ($datos['data']['comparison'] == "lt") {
                                        $cond = "<";
                                    } else
                                        $cond = "=";
                                    $addWhere.=" AND d." . $datos['field'] . $cond . $datos['data']['value'];
                                } else {
                                    if ($datos['field'] == 'cantreal' || $datos['field'] == 'planfinal' || $datos['field'] == 'diferencia' || $datos['field'] == 'importereal' || $datos['field'] == 'importerealdivisa' || $datos['field'] == 'diferenciaimporte' || $datos['field'] == 'diferenciaimportedivisa') {
                                        $cond = "";
                                        if ($datos['data']['comparison'] == "gt") {
                                            $cond = ">";
                                        } elseif ($datos['data']['comparison'] == "lt") {
                                            $cond = "<";
                                        } else
                                            $cond = "=";
                                        if ($datos['field'] == 'cantreal')
                                            $addHaving.=" AND COALESCE(sum(d.cantreal), 0.000)" . $cond . $datos['data']['value'];
                                        if ($datos['field'] == 'diferencia')
                                            $addHaving.=" AND (d.plan + d.ajuste) - COALESCE(sum(d.cantreal), 0.000)" . $cond . $datos['data']['value'];
                                        if ($datos['field'] == 'planfinal')
                                            $addHaving.=" AND (d.plan + d.ajuste)" . $cond . $datos['data']['value'];
                                        if ($datos['field'] == 'importereal')
                                            $addHaving.=" AND d.precio * COALESCE(sum(d.cantreal), 0.000)" . $cond . $datos['data']['value'];
                                        if ($datos['field'] == 'importerealdivisa')
                                            $addHaving.=" AND d.preciodivisa * COALESCE(sum(d.cantreal), 0.000)" . $cond . $datos['data']['value'];
                                        if ($datos['field'] == 'diferenciaimporte')
                                            $addHaving.=" AND d.importeajustado -(d.precio * COALESCE(sum(d.cantreal), 0.000))" . $cond . $datos['data']['value'];
                                        if ($datos['field'] == 'diferenciaimportedivisa')
                                            $addHaving.=" AND  d.importeajustadodivisa -(d.preciodivisa * COALESCE(sum(d.cantreal), 0.000))" . $cond . $datos['data']['value'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET " . $params['start'] . "LIMIT " . $params['limit'];
        }
        $conn = Doctrine_Manager::connection();
        $query = " WITH datos AS (SELECT
                       dem.iddemanda,
                      dem.idejercicio,
                      dem.idprograma,
                      dem.iddestino,
                      demt.iddemandatiempo,
                      dem.identidadcliente,
                      ind.codigo,
                      ind.denominacion,
                      ind.idumedida,
                      dem.extraplan,
                      demt.preciodesglosado as precio,
                      demt.preciodesglosadodivisa as preciodivisa,
                      COALESCE(demt.cantidaddesglosada, 0.000)  as plan,
                      COALESCE(demt.ajusteplan, 0.000) as ajuste,
                      sum(COALESCE(ce.cantidadproducida, 0.000)) as cantreal,
                      demt.importe as importeplan,
                      demt.importedivisa as importeplandivisa,
                      COALESCE(demt.importeajustado, 0.000) as importeajustado,
                      COALESCE(demt.importeajustadodivisa, 0.000) as importeajustadodivisa,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 1
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as enero,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 2
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as febrero,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 3
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as marzo,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 4
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as abril,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 5
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as mayo,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 6
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as junio,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 7
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as julio,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 8
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as agosto,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 9
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as septiembre,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 10
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as octubre,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 11
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as noviembre,
                    CASE
                      WHEN EXTRACT(MONTH FROM ce.fecha) = 12
                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                      ELSE 0
                    END as diciembre
               FROM mod_planproeza.dat_demanda dem
                    INNER JOIN mod_datosmaestros.nom_indicador ind
                    ON (dem.idindicador = ind.idindicador AND ind.estado = 1)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                    ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                    INNER JOIN mod_planproeza.dat_demandatiempo demt
                    ON (dem.iddemanda = demt.iddemanda AND demt.identidad = {$params['identidad']})
                    LEFT JOIN mod_planproeza.dat_controlejecucion ce
                    ON(ce.iddemandatiempo = demt.iddemandatiempo)
                    LEFT JOIN mod_planificacion.nom_ejercicioplanificacion e
                    ON(dem.idejercicio = e.idejercicio AND e.ejercicio = EXTRACT(YEAR FROM ce.fecha)::VARCHAR)
                   
               WHERE dem.idaprobacionplan = 4 AND dem.idejercicio = {$params['idejercicio']}
               GROUP BY dem.iddemanda,
                        dem.idejercicio,
                        dem.idprograma,
                        dem.extraplan,
                        dem.iddestino,
                        ind.codigo,
                        ind.denominacion,
                        ind.idumedida,
                        demt.preciodesglosado,
                        demt.preciodesglosadodivisa,
                        demt.importe,
                        ce.fecha,
                        demt.iddemandatiempo,
                        dem.identidadcliente,
                        demt.cantidaddesglosada
                        )
, obs as (select DISTINCT CASE
                  WHEN oc.iddemandatiempo IS NOT NULL THEN 1
                  else 0
                end as tieneobservacion,
       dt.iddemandatiempo
FROM mod_planproeza.his_observacioncontrol oc
     INNER JOIN mod_planproeza.dat_demandatiempo dt ON dt.iddemandatiempo =
       oc.iddemandatiempo)
SELECT d.iddemanda,
       d.idprograma,
       d.iddestino,
       d.identidadcliente,
       d.iddemandatiempo,
       d.codigo,
       d.extraplan,
       d.denominacion,
       d.idumedida,
       d.precio,
       d.preciodivisa,
       d.plan,
       d.ajuste,
        COALESCE(o.tieneobservacion, 0) as tieneobservacion,
       (d.plan + d.ajuste) as planfinal,
       COALESCE(sum(d.cantreal), 0.000) as cantreal,
       (d.plan + d.ajuste) - COALESCE(sum(d.cantreal), 0.000) as diferencia,
       d.importeplan,
       d.importeplandivisa,
       d.importeajustado,
       d.importeajustadodivisa,
       d.precio * COALESCE(sum(d.cantreal), 0.000) as importereal,
       d.preciodivisa * COALESCE(sum(d.cantreal), 0.000) as importerealdivisa,
       d.importeajustado -(d.precio * COALESCE(sum(d.cantreal), 0.000)) as diferenciaimporte,
       d.importeajustadodivisa -(d.preciodivisa * COALESCE(sum(d.cantreal), 0.000)) as diferenciaimportedivisa,
       COALESCE(sum(d.enero), 0.000) as enero,
       COALESCE(sum(d.febrero), 0.000) as febrero,
       COALESCE(sum(d.marzo), 0.000) as marzo,
       COALESCE(sum(d.abril), 0.000) as abril,
       COALESCE(sum(d.mayo), 0.000) as mayo,
       COALESCE(sum(d.junio), 0.000) as junio,
       COALESCE(sum(d.julio), 0.000) as julio,
       COALESCE(sum(d.agosto), 0.000) as agosto,
       COALESCE(sum(d.septiembre), 0.000) as septiembre,
       COALESCE(sum(d.octubre), 0.000) as octubre,
       COALESCE(sum(d.noviembre), 0.000) as noviembre,
       COALESCE(sum(d.diciembre), 0.000) as diciembre,
       COALESCE(sum(d.importeplan) OVER(PARTITION BY d.idejercicio), 0.00) as importeplantotalmn,
       COALESCE(sum(d.importeplandivisa) OVER(PARTITION BY d.idejercicio), 0.00) as importeplantotalcuc,
       COALESCE(sum(d.importeajustado) OVER(PARTITION BY d.idejercicio), 0.00) as importeajustadototalmn,
       COALESCE(sum(d.importeajustadodivisa) OVER(PARTITION BY d.idejercicio), 0.00) as importeajustadototalcuc,
       COALESCE(sum(d.precio * COALESCE(sum(d.cantreal), 0.000)) OVER(PARTITION BY d.idejercicio), 0.00) as importerealtotalmn,
       COALESCE(sum(d.preciodivisa * COALESCE(sum(d.cantreal), 0.000)) OVER(PARTITION BY d.idejercicio), 0.00) as importerealtotalcuc,
       COALESCE(sum(d.importeajustado -(d.precio * COALESCE(sum(d.cantreal), 0.000))) OVER(PARTITION BY d.idejercicio), 0.00) as diferenciaimportetotalmn,
       COALESCE(sum( d.importeajustadodivisa -(d.preciodivisa * COALESCE(sum(d.cantreal), 0.000))) OVER(PARTITION BY d.idejercicio), 0.00) as diferenciaimportetotalcuc,
       
       count(*) OVER() as total
FROM datos d
LEFT JOIN obs o ON d.iddemandatiempo = o.iddemandatiempo
$addWhere
GROUP BY 
         d.iddemanda,
         o.tieneobservacion,
         d.idejercicio,
         d.idprograma,
         d.iddestino,
         d.codigo,
         d.denominacion,
         d.idumedida,
         d.precio,
         d.extraplan,
         d.preciodivisa,
         d.plan,
         d.iddemandatiempo,
         d.importeplan,
         d.importeplandivisa,
         d.identidadcliente,
         d.ajuste,
         d.importeajustado,
         d.importeajustadodivisa
       $addHaving
ORDER BY d.codigo $delimitando";
        //print_r($query);die;
        $data->data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function listarControlEjecucionProductorxFecha($params) {
        $addWhere = "";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'cantidadproducida') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addWhere.=" AND ce.cantidadproducida" . $cond . $datos['data']['value'];
                } else if ($datos['field'] == 'fecha') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND ce.fecha::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND ce.fecha::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND ce.fecha::date='{$fechafin}'";
                    }
                } else if ($datos['field'] == 'fechamodificacion') {
                    $fechafin = explode('/', $datos ['data']['value']);
                    $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/' . $fechafin[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND ce.fechamodificacion::date<'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND ce.fechamodificacion::date>'{$fechafin}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND ce.fechamodificacion::date='{$fechafin}'";
                    }
                } else if ($datos['field'] == 'idusuario') {
                    $addWhere .= " AND ce.idusuario='{$datos['data']['value']}'";
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET " . $params['start'] . "LIMIT " . $params['limit'];
        }
        $conn = Doctrine_Manager::connection();
        $query = " SELECT idcontrolejecucion,
                          cantidadproducida,
                          fecha,
                          idusuario,
                          fechamodificacion,
                          count(*) OVER() as total
                  FROM mod_planproeza.dat_controlejecucion ce
                  WHERE iddemandatiempo = {$params['iddemandatiempo']}
                  $addWhere
                  ORDER BY fecha $delimitando";
        $data->data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function listarControlEmpresaRector($params) {
        $addWhere = "where true";
        $addHaving = "having true";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere.=" AND p.codigo LIKE '" . $datos['data']['value'] . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $addWhere.=" AND upper(p.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                    } else {
                        if ($datos['field'] == 'idumedida' || $datos['field'] == 'tieneobservacion' || $datos['field'] == 'iddestino' || $datos['field'] == 'idprograma' || $datos['field'] == 'identidadcliente' || $datos['field'] == 'identidaduim') {
                            if ($datos['field'] == 'idumedida')
                                $addWhere.=" AND p.idumedida =" . $datos['data']['value'];
                            if ($datos['field'] == 'iddestino')
                                $addWhere.=" AND p.iddestino =" . $datos['data']['value'];
                            if ($datos['field'] == 'idprograma')
                                $addWhere.=" AND p.idprograma =" . $datos['data']['value'];
                            if ($datos['field'] == 'identidadcliente')
                                $addWhere.=" AND p.identidadcliente =" . $datos['data']['value'];
                            if ($datos['field'] == 'identidaduim')
                                $addWhere.=" AND p.identidaduim =" . $datos['data']['value'];
                            if ($datos['field'] == 'tieneobservacion')
                                $addWhere.=" AND p.tieneobservacion =" . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'enero' || $datos['field'] == 'febrero' ||
                                    $datos['field'] == 'marzo' || $datos['field'] == 'abril' ||
                                    $datos['field'] == 'mayo' || $datos['field'] == 'junio' ||
                                    $datos['field'] == 'julio' || $datos['field'] == 'agosto' ||
                                    $datos['field'] == 'septiembre' || $datos['field'] == 'octubre' ||
                                    $datos['field'] == 'noviembre' || $datos['field'] == 'diciembre') {
                                $cond = "";
                                if ($datos['data']['comparison'] == "gt") {
                                    $cond = ">";
                                } elseif ($datos['data']['comparison'] == "lt") {
                                    $cond = "<";
                                } else
                                    $cond = "=";
                                $addWhere.=" AND " . $datos['field'] . $cond . $datos['data']['value'];
                            }
                            else {
                                if ($datos['field'] == 'plan' || $datos['field'] == 'ajuste' || $datos['field'] == 'planfinal' || $datos['field'] == 'estimado' || $datos['field'] == 'importeplan' || $datos['field'] == 'importeajustado' || $datos['field'] == 'importeajustadodivisa' || $datos['field'] == 'importeplandivisa' || $datos['field'] == 'diferencia' || $datos['field'] == 'diferenciaimporte' || $datos['field'] == 'diferenciaimportedivisa') {
                                    $cond = "";
                                    if ($datos['data']['comparison'] == "gt") {
                                        $cond = ">";
                                    } elseif ($datos['data']['comparison'] == "lt") {
                                        $cond = "<";
                                    } else
                                        $cond = "=";
                                    if ($datos['field'] == 'plan')
                                        $addHaving.=" AND sum(p.plan)" . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'ajuste')
                                        $addHaving.=" AND sum(p.ajuste)" . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'planfinal')
                                        $addHaving.=" AND sum(p.planfinal)" . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'estimado')
                                        $addHaving.=" AND sum(p.estimado)" . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'importeplan')
                                        $addHaving.=" AND sum(p.importeplan)" . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'importeajustado')
                                        $addHaving.=" AND sum(p.importeajustado)" . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'importeajustadodivisa')
                                        $addHaving.=" AND sum(p.importeajustadodivisa)" . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'importeplandivisa')
                                        $addHaving.=" AND sum(p.importedivisa)" . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'diferencia')
                                        $addHaving.=" AND sum(p.planfinal) - c.cantreal " . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'diferenciaimporte')
                                        $addHaving.=" AND sum(p.importeajustado) - c.importereal" . $cond . $datos['data']['value'];
                                    if ($datos['field'] == 'diferenciaimportedivisa')
                                        $addHaving.=" AND sum(p.importeajustadodivisa) - c.importerealdivisa" . $cond . $datos['data']['value'];
                                } else {
                                    if ($datos['field'] == 'cantreal' || $datos['field'] == 'importereal' || $datos['field'] == 'importerealdivisa') {
                                        $cond = "";
                                        if ($datos['data']['comparison'] == "gt") {
                                            $cond = ">";
                                        } elseif ($datos['data']['comparison'] == "lt") {
                                            $cond = "<";
                                        } else
                                            $cond = "=";
                                        $addWhere.=" AND c." . $datos['field'] . $cond . $datos['data']['value'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET " . $params['start'] . "LIMIT " . $params['limit'];
        }
        $condicion_identidad = " AND eos.identidad = {$params['identidad']}";
        $identidadUIM = "";
        $pIdentidadUIM = "";
        $groupByIdentidadUIM = "";
        if ($params['tipo'] == 3) {
            $condicion_identidad = "";
            $identidadUIM = " eos.identidad as identidaduim,";
            $groupByIdentidadUIM = " eos.identidad,";
            $pIdentidadUIM = " p.identidaduim,";
        }
        $conn = Doctrine_Manager:: connection();
        $sql = "WITH plan AS (
              SELECT DISTINCT 
                     dem.idejercicio,
                     dem.idprograma,
                     dem.iddestino,
                     dem.iddemanda,
                     dem.extraplan,
                     dem.identidadcliente,
                    
                     $identidadUIM
                     ind.codigo,
                     ind.denominacion,
                     ind.idumedida,
                     COALESCE(dem.cantidadconfirmada, 0.000) as plan,
                     sum(COALESCE(demt.ajusteplan, 0.000)) as ajuste,
                     COALESCE(dem.cantidadconfirmada, 0.000) + sum(COALESCE(demt.ajusteplan, 0.000)) as planfinal,
                     COALESCE(dem.estimacion, 0.000) as estimado,
                     COALESCE(sum(demt.importe), 0.000) as importeplan,
                     COALESCE(sum(demt.importedivisa), 0.000) as importedivisa,
                     COALESCE(sum(demt.importeajustado), 0.000) as importeajustado,
                     COALESCE(sum(demt.importeajustadodivisa), 0.000) as importeajustadodivisa
                     
              FROM mod_planproeza.dat_demanda dem
                   INNER JOIN mod_datosmaestros.nom_indicador ind 
                   ON (dem.idindicador = ind.idindicador AND ind.estado = 1)
                   INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                   ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                   INNER JOIN mod_planproeza.dat_entidadorganosatisface eos 
                   ON (eos.identidadorganosatisface = dem.identidadorganosatisface $condicion_identidad)
                   LEFT JOIN mod_planproeza.dat_demandatiempo demt 
                   ON (dem.iddemanda = demt.iddemanda )                 
                           
              WHERE dem.idejercicio = {$params['idejercicio']} AND dem.idaprobacionplan = 4
              GROUP BY ind.codigo,
                       ind.denominacion,
                       ind.idumedida,
                       dem.identidadcliente,
                       $groupByIdentidadUIM
                       dem.idprograma,
                       dem.iddestino,
                       dem.iddemanda
                       ),
control AS (WITH ejecucion AS (SELECT dem.iddemanda,
                                      ind.codigo,
                                      sum(COALESCE(ce.cantidadproducida, 0.000)) as cantreal,
                                      CASE
                                        WHEN dem.extraplan = 1 
                                        THEN (indp.precio * sum(COALESCE(ce.cantidadproducida, 0.000)))::numeric (19,3)
                                        ELSE demt.preciodesglosado * sum(COALESCE(ce.cantidadproducida, 0.000))
                                      END as importereal,
                                      CASE
                                        WHEN dem.extraplan = 1 
                                        THEN (indp.preciodivisa * sum(COALESCE(ce.cantidadproducida, 0.000)))::numeric (19,3)
                                        ELSE demt.preciodesglosadodivisa * sum(COALESCE(ce.cantidadproducida, 0.000))
                                      END as importerealdivisa,                                       
                                      CASE
                                        WHEN EXTRACT(MONTH FROM ce.fecha) = 1 
                                        THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                        ELSE 0
                                      END as enero,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 2 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as febrero,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 3 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as marzo,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 4 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as abril,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 5 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as mayo,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 6 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as junio,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 7 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as julio,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 8 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as agosto,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 9 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as septiembre,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 10 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as octubre,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 11 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as noviembre,
                                    CASE
                                      WHEN EXTRACT(MONTH FROM ce.fecha) = 12 
                                      THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                                      ELSE 0
                                    END as diciembre
                               FROM mod_planproeza.dat_demanda dem
                                    INNER JOIN mod_datosmaestros.nom_indicador ind 
                                    ON (dem.idindicador = ind.idindicador AND ind.estado = 1)
                                    INNER JOIN mod_datosmaestros.nom_indicadorplanif indp
                                    ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                                    LEFT JOIN mod_planproeza.dat_demandatiempo demt 
                                    ON (dem.iddemanda = demt.iddemanda)
                                    INNER JOIN mod_planproeza.dat_entidadorganosatisface eos 
                                    ON (eos.identidadorganosatisface = dem.identidadorganosatisface $condicion_identidad)
                                    LEFT JOIN mod_planproeza.dat_controlejecucion ce 
                                    ON (ce.iddemandatiempo = demt.iddemandatiempo)
                                    LEFT JOIN mod_planificacion.nom_ejercicioplanificacion e 
                                    ON (dem.idejercicio = e.idejercicio AND e.ejercicio = EXTRACT(YEAR FROM ce.fecha)::VARCHAR)
                               WHERE dem.idejercicio = {$params['idejercicio']} AND dem.idaprobacionplan = 4
                               GROUP BY ind.codigo,
                                        ce.fecha,
                                        indp.precio,
                                        indp.preciodivisa,
                                        demt.preciodesglosado,
                                        demt.preciodesglosadodivisa,
                                        dem.iddemanda) 
 SELECT e.iddemanda,
        e.codigo,
        sum(e.cantreal) as cantreal,
        sum(e.importereal) as importereal,
        sum(e.importerealdivisa) as importerealdivisa,
        COALESCE(sum(e.enero), 0.000) as enero,
        COALESCE(sum(e.febrero), 0.000) as febrero,
        COALESCE(sum(e.marzo), 0.000) as marzo,
        COALESCE(sum(e.abril), 0.000) as abril,
        COALESCE(sum(e.mayo), 0.000) as mayo,
        COALESCE(sum(e.junio), 0.000) as junio,
        COALESCE(sum(e.julio), 0.000) as julio,
        COALESCE(sum(e.agosto), 0.000) as agosto,
        COALESCE(sum(e.septiembre), 0.000) as septiembre,
        COALESCE(sum(e.octubre), 0.000) as octubre,
        COALESCE(sum(e.noviembre), 0.000) as noviembre,
        COALESCE(sum(e.diciembre), 0.000) as diciembre
 FROM ejecucion e
 GROUP BY e.codigo,
          e.iddemanda), obs as (select DISTINCT CASE
                  WHEN oc.iddemandatiempo IS NOT NULL THEN 1
                  else 0
                end as tieneobservacion,
       dt.iddemanda
FROM mod_planproeza.his_observacioncontrol oc
     INNER JOIN mod_planproeza.dat_demandatiempo dt ON dt.iddemandatiempo =
       oc.iddemandatiempo
            INNER JOIN mod_planproeza.dat_demanda d ON dt.iddemanda =
       d.iddemanda)
SELECT DISTINCT p.idprograma,
       p.iddestino,
       p.iddemanda,
       p.extraplan,
       p.identidadcliente,
      
       $pIdentidadUIM
       p.codigo,
       p.denominacion as denominacion,
       p.idumedida,
       COALESCE(o.tieneobservacion, 0) as tieneobservacion,
       sum(p.plan) as plan,
       sum(p.ajuste) as ajuste,
       sum(p.planfinal) as planfinal,
       sum(p.estimado) as estimado,
       sum(p.importeplan) as importeplan,
       sum(p.importedivisa) as importeplandivisa,
       sum(p.importeajustado) as importeajustado,  
       sum(p.importeajustadodivisa) as importeajustadodivisa,
       c.cantreal,
       sum(p.planfinal) - c.cantreal as diferencia,
       c.importereal,
       c.importerealdivisa,
       sum(p.importeajustado) - c.importereal as diferenciaimporte,
       sum(p.importeajustadodivisa) - c.importerealdivisa as diferenciaimportedivisa,
       
       enero,
       febrero,
       marzo,
       abril,
       mayo,
       junio,
       julio,
       agosto,
       septiembre,
       octubre,
       noviembre,
       diciembre,
       COALESCE(sum(p.importeplan) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalmn, 
       COALESCE(sum(p.importedivisa) OVER(PARTITION BY p.idejercicio), 0.00) as importeplantotalcuc, 
       COALESCE(sum(p.importeajustado) OVER(PARTITION BY p.idejercicio), 0.00) as importeajustadototalmn, 
       COALESCE(sum(p.importeajustadodivisa) OVER(PARTITION BY p.idejercicio), 0.00) as importeajustadototalcuc, 
       COALESCE(sum(c.importereal) OVER(PARTITION BY p.idejercicio), 0.00) as importerealtotalmn, 
       COALESCE(sum(c.importerealdivisa) OVER(PARTITION BY p.idejercicio), 0.00) as importerealtotalcuc, 
       COALESCE(sum( sum(p.importeajustado) - c.importereal) OVER(PARTITION BY p.idejercicio), 0.00) as diferenciaimportetotalmn, 
       COALESCE(sum( sum(p.importeajustadodivisa) - c.importerealdivisa ) OVER(PARTITION BY p.idejercicio), 0.00) as diferenciaimportetotalcuc, 
       count(*) OVER() as total
FROM plan p
     INNER JOIN control c ON (p.codigo = c.codigo AND p.iddemanda = c.iddemanda)
          LEFT JOIN obs o ON o.iddemanda = p.iddemanda
$addWhere
GROUP BY p.idprograma,
         p.iddestino,
         p.codigo,
         p.denominacion,
         p.extraplan,       
         p.idumedida,
         c.cantreal,
         c.importereal,
         c.importerealdivisa,
         enero,
         febrero,
         marzo,
         abril,
         mayo,
         junio,
         julio,
         agosto,
         septiembre,
         octubre,
         noviembre,
         diciembre,
         p.identidadcliente,
         $pIdentidadUIM
         p.iddemanda,
         p.importeplan,
         p.importedivisa,
         p.importeajustado,
         p.importeajustadodivisa,
         p.idejercicio,
         o.tieneobservacion
         $addHaving
ORDER BY p.codigo $delimitando";
       // print_r($sql);die;
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function listarControlEmpresaTaller($params) {
        $addWhere = "where true";
        $addHaving = "having true";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'enero' || $datos['field'] == 'febrero' ||
                        $datos['field'] == 'marzo' || $datos['field'] == 'abril' ||
                        $datos['field'] == 'mayo' || $datos['field'] == 'junio' ||
                        $datos['field'] == 'julio' || $datos['field'] == 'agosto' ||
                        $datos['field'] == 'septiembre' || $datos['field'] == 'octubre' ||
                        $datos['field'] == 'noviembre' || $datos['field'] == 'diciembre') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addHaving.=" AND COALESCE(sum(d." . $datos['field'] . "), 0.000)" . $cond . $datos['data']['value'];
                }
                else {
                    if ($datos['field'] == 'plan' || $datos['field'] == 'ajuste' || $datos['field'] == 'importeplan' || $datos['field'] == 'importeajustado' || $datos['field'] == 'importeajustadodivisa' || $datos['field'] == 'importeplandivisa' || $datos['field'] == 'precio' || $datos['field'] == 'preciodivisa') {
                        $cond = "";
                        if ($datos['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $cond = "<";
                        } else
                            $cond = "=";
                        $addWhere.=" AND d." . $datos['field'] . $cond . $datos['data']['value'];
                    } else {
                        if ($datos['field'] == 'cantreal' || $datos['field'] == 'planfinal' || $datos['field'] == 'diferencia' || $datos['field'] == 'importereal' || $datos['field'] == 'importerealdivisa' || $datos['field'] == 'diferenciaimporte' || $datos['field'] == 'diferenciaimportedivisa') {
                            $cond = "";
                            if ($datos['data']['comparison'] == "gt") {
                                $cond = ">";
                            } elseif ($datos['data']['comparison'] == "lt") {
                                $cond = "<";
                            } else
                                $cond = "=";
                            if ($datos['field'] == 'cantreal')
                                $addHaving.=" AND COALESCE(sum(d.cantreal), 0.000)" . $cond . $datos['data']['value'];
                            if ($datos['field'] == 'diferencia')
                                $addHaving.=" AND (d.plan + d.ajuste) - COALESCE(sum(d.cantreal), 0.000)" . $cond . $datos['data']['value'];
                            if ($datos['field'] == 'importereal')
                                $addHaving.=" AND d.precio * COALESCE(sum(d.cantreal), 0.000)" . $cond . $datos['data']['value'];
                            if ($datos['field'] == 'importerealdivisa')
                                $addHaving.=" AND d.preciodivisa * COALESCE(sum(d.cantreal), 0.000)" . $cond . $datos['data']['value'];
                            if ($datos['field'] == 'diferenciaimporte')
                                $addHaving.=" AND d.importeajustado -(d.precio * COALESCE(sum(d.cantreal), 0.000))" . $cond . $datos['data']['value'];
                            if ($datos['field'] == 'diferenciaimportedivisa')
                                $addHaving.=" AND d.importeajustadodivisa -(d.preciodivisa * COALESCE(sum(d.cantreal), 0.000))" . $cond . $datos['data']['value'];
                            if ($datos['field'] == 'planfinal') {
                                $addWhere.=" AND (d.plan + d.ajuste)" . $cond . $datos['data']['value'];
                            }
                        } else {
                            if ($datos['field'] == 'identidad') {
                                $addWhere.=" AND d.identidad =" . $datos['data']['value'];
                            }
                        }
                    }
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $delimitando = " OFFSET " . $params['start'] . "LIMIT " . $params['limit'];
        }
        $conn = Doctrine_Manager:: connection();
        $sql = "WITH datos AS (SELECT 
                        demt.iddemandatiempo,
                        demt.identidad,
                        demt.preciodesglosado as precio,
                        demt.preciodesglosadodivisa as preciodivisa,
                        COALESCE(demt.cantidaddesglosada, 0.000)  as plan,
                        COALESCE(demt.ajusteplan, 0.000) as ajuste,
                        sum(COALESCE(ce.cantidadproducida, 0.000)) as cantreal,
                        demt.importe as importeplan,
                        demt.importedivisa as importeplandivisa,
                        demt.importeajustado,
                        demt.importeajustadodivisa,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 1 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as enero,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 2 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as febrero,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 3 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as marzo,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 4 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as abril,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 5 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as mayo,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 6 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as junio,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 7 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as julio,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 8 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as agosto,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 9 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as septiembre,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 10 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as octubre,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 11 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as noviembre,
                        CASE
                          WHEN EXTRACT(MONTH FROM ce.fecha) = 12 
                          THEN sum(COALESCE(ce.cantidadproducida, 0.000))
                          ELSE 0
                        END as diciembre
               FROM mod_planproeza.dat_demanda dem
                    INNER JOIN mod_datosmaestros.nom_indicador ind 
                    ON (dem.idindicador = ind.idindicador AND ind.estado = 1)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                    ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                    INNER JOIN mod_planproeza.dat_demandatiempo demt 
                    ON (dem.iddemanda = demt.iddemanda AND dem.iddemanda =  {$params['iddemanda']})
                    LEFT JOIN mod_planproeza.dat_controlejecucion ce 
                    ON (ce.iddemandatiempo = demt.iddemandatiempo)
                    LEFT JOIN mod_planificacion.nom_ejercicioplanificacion e 
                    ON (dem.idejercicio = e.idejercicio AND dem.idejercicio = e.idejercicio AND e.ejercicio = EXTRACT(YEAR FROM ce.fecha)::VARCHAR)
               GROUP BY demt.iddemandatiempo,
                        demt.identidad,
                        demt.preciodesglosado,
                        demt.preciodesglosadodivisa,                        
                        demt.importe,
                        demt.importedivisa,
                        demt.importeajustado,
                        demt.importeajustadodivisa,
                        ce.fecha,
                        demt.cantidaddesglosada,
                        demt.ajusteplan)
SELECT d.iddemandatiempo,
       d.identidad,
       d.precio,
       d.preciodivisa,
       d.plan,
       d.ajuste,
       (d.plan + d.ajuste) as planfinal,
       COALESCE(sum(d.cantreal), 0.000) as cantreal,
       (d.plan + d.ajuste) - COALESCE(sum(d.cantreal), 0.000) as diferencia,
       d.importeplan,
       d.importeplandivisa,
       d.importeajustado,
       d.importeajustadodivisa,
       d.precio * COALESCE(sum(d.cantreal), 0.000)as importereal,
       d.preciodivisa * COALESCE(sum(d.cantreal), 0.000) as importerealdivisa,
       d.importeajustado -(d.precio * COALESCE(sum(d.cantreal), 0.000)) as diferenciaimporte,
       d.importeajustadodivisa -(d.preciodivisa * COALESCE(sum(d.cantreal), 0.000)) as diferenciaimportedivisa,
       COALESCE(sum(d.enero), 0.000) as enero,
       COALESCE(sum(d.febrero), 0.000) as febrero,
       COALESCE(sum(d.marzo), 0.000) as marzo,
       COALESCE(sum(d.abril), 0.000) as abril,
       COALESCE(sum(d.mayo), 0.000) as mayo,
       COALESCE(sum(d.junio), 0.000) as junio,
       COALESCE(sum(d.julio), 0.000) as julio,
       COALESCE(sum(d.agosto), 0.000) as agosto,
       COALESCE(sum(d.septiembre), 0.000) as septiembre,
       COALESCE(sum(d.octubre), 0.000) as octubre,
       COALESCE(sum(d.noviembre), 0.000) as noviembre,
       COALESCE(sum(d.diciembre), 0.000) as diciembre,
       count(*) OVER() as total
FROM datos d
$addWhere
GROUP BY d.iddemandatiempo,
         d.identidad,
         d.precio,
         d.preciodivisa,
         d.plan,
         d.ajuste,
         d.importeajustado,
         d.importeajustadodivisa,
         d.importeplandivisa,       
         d.importeplan
         $addHaving
ORDER BY d.identidad $delimitando";
       //print_r($sql);die;
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function listarIndicadores($params) {
        $condiciones = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condiciones[] = "ind." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(ind." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'idumedida') {
                    $condiciones[] = "ind.idumedida = " . $datos['data']['value'] . " ";
                } else if ($datos ['field'] == 'precio') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "indp.precio >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "indp.precio <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "indp.precio =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'preciodivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "indp.preciodivisa >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "indp.preciodivisa <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "indp.preciodivisa =" . $datos ['data'] ['value'];
                    }
                }
            }
        }
        //Fin de los filtros
        $WHERE = "WHERE TRUE";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = "AND " . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT ind.idindicador,
                         ind.codigo,
                         ind.denominacion,                              
                         ind.idumedida,                              
                         (indp.precio)::numeric (19,3) as precio,
                         (indp.preciodivisa)::numeric (19,3) as preciodivisa,
                         eos.identidadorganosatisface,
                         count(*) OVER() as total
                  FROM mod_datosmaestros.nom_indicador ind
                  INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                  ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND ind.estado = 1 AND indp.idaprobacion = 4)
                  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface indos 
                  ON (ind.idindicador = indos.idindicador)
                  INNER JOIN mod_planproeza.dat_entidadorganosatisface eos 
                  ON (indos.idorganosatisface = eos.idorganosatisface AND eos.identidad = {$params['identidad']})                              
                  $WHERE ORDER BY ind.codigo $delimitando";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
