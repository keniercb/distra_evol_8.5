<?php

class DatDemandatiempo extends BaseDatDemandatiempo {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatDemanda', array('local' => 'iddemanda', 'foreign' => 'iddemanda'));
        $this->hasOne('NomDatosnomenclador', array('local' => 'iddatosnomenclador', 'foreign' => 'iddatosnomenclador'));
        $this->hasOne('NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasMany('DatControlejecucion', array('local' => 'iddemandatiempo', 'foreign' => 'iddemandatiempo'));
        $this->hasMany('HisObservacioncontrol', array('local' => 'iddemandatiempo', 'foreign' => 'iddemandatiempo'));
    }

    public function listarPlanProduccionProveedor($params) {
        $condiciones = array();
        $addHaving = "having true";
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
                } else
                if ($datos['field'] == 'idprograma' || $datos['field'] == 'iddestino' || $datos['field'] == 'identidadcliente') {
                    $condiciones[] = "dem." . $datos['field'] . " = " . $datos['data']['value'] . " ";
                } elseif ($datos['field'] == 'idusuario') {
                    $condiciones[] = "demt." . $datos['field'] . " = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'identidadproveedor') {
                    $condiciones[] = "eos.identidad = " . $datos['data']['value'] . " ";
                }
                if ($datos ['field'] == 'cantidadconfirmada') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "dem." . $datos['field'] . " >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "dem." . $datos['field'] . "  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "dem." . $datos['field'] . " =" . $datos ['data'] ['value'];
                    }
                } else
                if ($datos['field'] == 'idaprobacion') {
                    $condiciones[] = "dem.idaprobacionplan = " . $datos['data']['value'] . " ";
                } else if ($datos ['field'] == 'totaldesagregado') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addHaving.=" AND COALESCE(sum(demt.enero), 0.000) + COALESCE(sum(demt.febrero), 0.000) +
                            COALESCE(sum(demt.marzo), 0.000) + COALESCE(sum(demt.abril), 0.000) +
                            COALESCE(sum(demt.mayo), 0.000) + COALESCE(sum(demt.junio), 0.000) +
                            COALESCE(sum(demt.julio), 0.000) + COALESCE(sum(demt.agosto), 0.000) +
                            COALESCE(sum(demt.septiembre), 0.000) + COALESCE(sum(demt.octubre), 0.000) +
                            COALESCE(sum(demt.noviembre), 0.000) + COALESCE(sum(demt.diciembre), 0.000)" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'diferencia') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addHaving.=" AND dem.cantidadconfirmada -(COALESCE(sum(demt.enero), 0.000) + COALESCE(sum(demt.febrero), 0.000) +
                            COALESCE(sum(demt.marzo), 0.000) + COALESCE(sum(demt.abril), 0.000) +
                            COALESCE(sum(demt.mayo), 0.000) + COALESCE(sum(demt.junio), 0.000) +
                            COALESCE(sum(demt.julio), 0.000) + COALESCE(sum(demt.agosto), 0.000) +
                            COALESCE(sum(demt.septiembre), 0.000) + COALESCE(sum(demt.octubre), 0.000) + 
                            COALESCE(sum(demt.noviembre), 0.000) + COALESCE(sum(demt.diciembre), 0.000))" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'importetotal') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addHaving.=" AND COALESCE(sum(demt.importe),0.000)" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'importetotaldivisa') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addHaving.=" AND COALESCE(sum(demt.importedivisa),0.000)" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'fecha') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $condiciones[] = " demt.fecha::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $condiciones[] = " demt.fecha::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $condiciones[] = "  demt.fecha::date='{$fecha}'";
                    }
                } else if ($datos['field'] == 'enero' || $datos['field'] == 'febrero' ||
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
                    $addHaving.=" AND COALESCE(sum(demt." . $datos['field'] . "), 0.000)" . $cond . $datos['data']['value'];
                }
//               
            }
        }
        $condicion_identidad = " AND eos.identidad = {$params['identidad']}";
        if ($params['tipo'] == 3) {
            $condicion_identidad = "";
        }
        $WHERE = "";
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
        $query = "SELECT x.iddemanda,
       x.codigo,
       x.denominacion,
       x.idumedida,
       x.cantidadconfirmada,
       x.idaprobacion,
       x.identidadcliente,
       x.identidadproveedor,
       x.idusuario,
       x.fecha,
       x.iddestino,
       x.idprograma,
       x.enero,
       x.febrero,
       x.marzo,
       x.abril,
       x.mayo,
       x.junio,
       x.julio,
       x.agosto,
       x.septiembre,
       x.octubre,
       x.noviembre,
       x.diciembre,
       x.totaldesagregado,
       x.diferencia,
       x.importetotal,
       x.importetotaldivisa,
       COALESCE(sum(x.importetotal) OVER(PARTITION BY x.idejercicio), 0.00) as importetotalmn, 
       COALESCE(sum(x.importetotaldivisa) OVER(PARTITION BY x.idejercicio), 0.00 ) as importetotalcuc,
       count(*) OVER() as total
        FROM (
                        SELECT dem.iddemanda,
                            ind.codigo,
                            ind.denominacion,
                            ind.idumedida,
                            dem.cantidadconfirmada,
                            dem.idaprobacionplan as idaprobacion,
                            eos.identidad as identidadproveedor,
                            dem.identidadcliente,
                            dem.idejercicio,
                            COALESCE((
                                SELECT DISTINCT demt1.idusuario
                                FROM mod_planproeza.dat_demandatiempo demt1
                                WHERE demt1.iddemanda = demt.iddemanda
                                GROUP BY demt1.idusuario,
                                         demt1.fecha
                                HAVING demt1.fecha = max(demt.fecha)),dem.idusuario) as idusuario,
                            COALESCE((max(demt.fecha)),dem.fecha) as fecha,
                            dem.iddestino,
                            dem.idprograma,
                            COALESCE(sum(demt.enero), 0.000) as enero,
                            COALESCE(sum(demt.febrero), 0.000) as febrero,
                            COALESCE(sum(demt.marzo), 0.000) as marzo,
                            COALESCE(sum(demt.abril), 0.000) as abril,
                            COALESCE(sum(demt.mayo), 0.000) as mayo,
                            COALESCE(sum(demt.junio), 0.000) as junio,
                            COALESCE(sum(demt.julio), 0.000) as julio,
                            COALESCE(sum(demt.agosto), 0.000) as agosto,
                            COALESCE(sum(demt.septiembre), 0.000) as septiembre,
                            COALESCE(sum(demt.octubre), 0.000) as octubre,
                            COALESCE(sum(demt.noviembre), 0.000) as noviembre,
                            COALESCE(sum(demt.diciembre), 0.000) as diciembre,
                            (COALESCE(sum(demt.enero), 0.000) + COALESCE(sum(demt.febrero), 0.000) +
                            COALESCE(sum(demt.marzo), 0.000) + COALESCE(sum(demt.abril), 0.000) +
                            COALESCE(sum(demt.mayo), 0.000) + COALESCE(sum(demt.junio), 0.000) +
                            COALESCE(sum(demt.julio), 0.000) + COALESCE(sum(demt.agosto), 0.000) +
                            COALESCE(sum(demt.septiembre), 0.000) + COALESCE(sum(demt.octubre), 0.000) + COALESCE(sum(demt.noviembre), 0.000) + COALESCE(sum(demt.diciembre), 0.000)) as totaldesagregado,
                            dem.cantidadconfirmada -(COALESCE(sum(demt.enero), 0.000) + COALESCE(sum(demt.febrero), 0.000) + COALESCE(sum(demt.marzo), 0.000) + 
                            COALESCE(sum(demt.abril), 0.000) + COALESCE(sum(demt.mayo), 0.000) + COALESCE(sum(demt.junio), 0.000) + COALESCE(sum(demt.julio), 0.000) + 
                            COALESCE(sum(demt.agosto), 0.000) + COALESCE(sum(demt.septiembre), 0.000) + COALESCE(sum(demt.octubre), 0.000) + COALESCE(sum(demt.noviembre), 0.000) +
                            COALESCE(sum(demt.diciembre), 0.000)) as diferencia,
                            COALESCE(sum(demt.importe),0.000) as importetotal,
                            COALESCE(sum(demt.importedivisa),0.000) as importetotaldivisa
                     FROM mod_planproeza.dat_demanda dem
                          INNER JOIN mod_datosmaestros.nom_indicador ind 
                          ON (dem.idindicador = ind.idindicador AND ind.estado = 1)
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                          ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                          INNER JOIN mod_planproeza.dat_entidadorganosatisface eos 
                          ON (eos.identidadorganosatisface = dem.identidadorganosatisface $condicion_identidad)
                              
                          LEFT JOIN mod_planproeza.dat_demandatiempo demt 
                          ON (dem.iddemanda = demt.iddemanda)
                        WHERE dem.idejercicio = {$params['idejercicio']} 
                              AND dem.idaprobacion=4
                              AND dem.extraplan = 0
                              $WHERE
                        GROUP BY dem.iddemanda,
                                 ind.codigo,
                                 ind.denominacion,
                                 ind.idumedida,
                                 demt.iddemanda,
                                 eos.identidad
                                 $addHaving
                        ) x    
                        ORDER BY x.codigo $delimitando";
//        print_r($query);die;
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarPlanProduccionProductor($params) {
        $condiciones = array();
        $addHaving = "HAVING TRUE";
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
                } else
                if ($datos['field'] == 'idprograma' || $datos['field'] == 'iddestino' || $datos['field'] == 'identidadcliente') {
                    $condiciones[] = "dem." . $datos['field'] . " = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'idusuario') {
                    $condiciones[] = "demt." . $datos['field'] . " = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'idaprobacion') {
                    $condiciones[] = "dem.idaprobacionplan = " . $datos['data']['value'] . " ";
                } else
                if ($datos['field'] == 'identidadproveedor') {
                    $condiciones[] = "eos.identidad = " . $datos['data']['value'] . " ";
                } else
                if ($datos ['field'] == 'cantidaddesglosada') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "demt." . $datos['field'] . " >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "demt." . $datos['field'] . "  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "demt." . $datos['field'] . " =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'preciodesglosado') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "demt." . $datos['field'] . " >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "demt." . $datos['field'] . "  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "demt." . $datos['field'] . " =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'preciodesglosadodivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "demt." . $datos['field'] . " >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "demt." . $datos['field'] . "  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "demt." . $datos['field'] . " =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'totaldesagregado') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addHaving.=" AND COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) + 
                                COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000) + COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + 
                                COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) +
                                COALESCE(demt.diciembre, 0.000)" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'diferencia') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addHaving.=" AND demt.cantidaddesglosada -(COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + 
                                COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000) + COALESCE(demt.julio, 0.000) + 
                                COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) +
                                COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000))" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'importetotal') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $condiciones[] = "demt.importe" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'importetotaldivisa') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $condiciones[] = "demt.importedivisa" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'fecha') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $condiciones[] = " demt.fecha::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $condiciones[] = " demt.fecha::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $condiciones[] = "  demt.fecha::date='{$fecha}'";
                    }
                } else if ($datos['field'] == 'enero' || $datos['field'] == 'febrero' ||
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
                    $addHaving.=" AND COALESCE(demt." . $datos['field'] . ", 0.000)" . $cond . $datos['data']['value'];
                }
            }
        }
//               

        $WHERE = "";
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
        $query = " SELECT 
                                demt.iddemandatiempo,
                                dem.iddemanda,
                                ind.codigo,
                                ind.denominacion,
                                ind.idumedida,
                                dem.cantidadconfirmada,
                                demt.cantidaddesglosada,
                                demt.preciodesglosado,
                                demt.preciodesglosadodivisa,
                                dem.identidadcliente,
                                eos.identidad as identidadproveedor,
                                demt.identidad,
                                dem.iddestino,
                                dem.idprograma,
                                dem.idaprobacionplan as idaprobacion,
                                COALESCE(demt.enero, 0.000) as enero,
                                COALESCE(demt.febrero, 0.000) as febrero,
                                COALESCE(demt.marzo, 0.000) as marzo,
                                COALESCE(demt.abril, 0.000) as abril,
                                COALESCE(demt.mayo, 0.000) as mayo,
                                COALESCE(demt.junio, 0.000) as junio,
                                COALESCE(demt.julio, 0.000) as julio,
                                COALESCE(demt.agosto, 0.000) as agosto,
                                COALESCE(demt.septiembre, 0.000) as septiembre,
                                COALESCE(demt.octubre, 0.000) as octubre,
                                COALESCE(demt.noviembre, 0.000) as noviembre,
                                COALESCE(demt.diciembre, 0.000) as diciembre,
                                (COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) + 
                                COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000) + COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + 
                                COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) +
                                COALESCE(demt.diciembre, 0.000)) as totaldesagregado,
                                demt.cantidaddesglosada -(COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + 
                                COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000) + COALESCE(demt.julio, 0.000) + 
                                COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) +
                                COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) as diferencia,
                                demt.importe as importetotal,
                                demt.importedivisa as importetotaldivisa,
                                demt.idusuario,
                                demt.fecha,                                
                                COALESCE(sum(demt.importe) OVER(PARTITION BY demt.identidad), 0.00) as importetotalmn,
                                COALESCE(sum(demt.importedivisa) OVER(PARTITION BY demt.identidad), 0.00) as importetotalcuc,
                                count(*) OVER() as total
                         FROM mod_planproeza.dat_demanda dem
                              INNER JOIN mod_datosmaestros.nom_indicador ind 
                              ON (dem.idindicador = ind.idindicador AND ind.estado = 1)
                              INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                              ON (ind.idindicador = indp.idindicador AND indp.nivelplanif = 1 AND indp.idaprobacion = 4)
                              INNER JOIN mod_planproeza.dat_entidadorganosatisface eos 
                              ON (eos.identidadorganosatisface = dem.identidadorganosatisface)
                              INNER JOIN mod_planproeza.dat_demandatiempo demt 
                              ON (dem.iddemanda = demt.iddemanda AND demt.identidad = {$params['identidad']})
                         WHERE dem.idejercicio = {$params['idejercicio']} AND dem.extraplan = 0
                             $WHERE
                         GROUP BY demt.iddemandatiempo,dem.iddemanda, ind.codigo, ind.denominacion, ind.idumedida,eos.identidad
                             $addHaving
                         ORDER BY ind.codigo  $delimitando";
        //print_r($query);die;
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarPlanProduccionDesagregado($params) {
        $condiciones = array();
        $addHaving = "having true";
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {

                if ($datos ['field'] == 'cantidaddesglosada') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "demt." . $datos['field'] . " >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "demt." . $datos['field'] . "  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "demt." . $datos['field'] . " =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'preciodesglosado') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "demt." . $datos['field'] . " >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "demt." . $datos['field'] . "  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "demt." . $datos['field'] . " =" . $datos ['data'] ['value'];
                    }
                } else if ($datos ['field'] == 'preciodesglosadodivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $condiciones[] = "demt." . $datos['field'] . " >" . $datos ['data'] ['value'];
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $condiciones[] = "demt." . $datos['field'] . "  <" . $datos ['data'] ['value'];
                    } else {
                        $condiciones[] = "demt." . $datos['field'] . " =" . $datos ['data'] ['value'];
                    }
                } else
                if ($datos['field'] == 'identidad' || $datos['field'] == 'idusuario') {
                    $condiciones[] = "demt." . $datos['field'] . " = " . $datos['data']['value'] . " ";
                } else if ($datos ['field'] == 'totaldesagregado') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addHaving.=" AND COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) + 
                            COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000) + COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + 
                            COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) +
                            COALESCE(demt.diciembre, 0.000)" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'diferencia') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $addHaving.=" AND demt.cantidaddesglosada -(COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + 
                            COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000) + COALESCE(demt.julio, 0.000) + 
                            COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) +
                            COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000))" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'importetotal') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $condiciones[] = "demt.importe" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'importetotaldivisa') {
                    $cond = "";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    } else
                        $cond = "=";
                    $condiciones[] = "demt.importedivisa" . $cond . $datos['data']['value'];
                }else if ($datos ['field'] == 'fecha') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $condiciones[] = " demt.fecha::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $condiciones[] = " demt.fecha::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $condiciones[] = "  demt.fecha::date='{$fecha}'";
                    }
                } else if ($datos['field'] == 'enero' || $datos['field'] == 'febrero' ||
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
                    $addHaving.=" AND COALESCE(demt." . $datos['field'] . ", 0.000)" . $cond . $datos['data']['value'];
                }
            }
        }
        $WHERE = "";
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
        if ($params['tipo'] == 2 || $params['tipo'] == 3) {
          
            $query = "SELECT demt.iddemandatiempo,
                            demt.identidad,     
                            demt.cantidaddesglosada,
                            demt.preciodesglosado,
                            demt.preciodesglosadodivisa,
                            dem.idaprobacionplan as idaprobacion,
                            COALESCE(demt.enero, 0.000) as enero,
                            COALESCE(demt.febrero, 0.000) as febrero,
                            COALESCE(demt.marzo, 0.000) as marzo,
                            COALESCE(demt.abril, 0.000) as abril,
                            COALESCE(demt.mayo, 0.000) as mayo,
                            COALESCE(demt.junio, 0.000) as junio,
                            COALESCE(demt.julio, 0.000) as julio,
                            COALESCE(demt.agosto, 0.000) as agosto,
                            COALESCE(demt.septiembre, 0.000) as septiembre,
                            COALESCE(demt.octubre, 0.000) as octubre,
                            COALESCE(demt.noviembre, 0.000) as noviembre,
                            COALESCE(demt.diciembre, 0.000) as diciembre,
                            (COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + COALESCE(demt.abril, 0.000) + 
                            COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000) + COALESCE(demt.julio, 0.000) + COALESCE(demt.agosto, 0.000) + 
                            COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) + COALESCE(demt.noviembre, 0.000) +
                            COALESCE(demt.diciembre, 0.000)) as totaldesagregado,
                            demt.cantidaddesglosada -(COALESCE(demt.enero, 0.000) + COALESCE(demt.febrero, 0.000) + COALESCE(demt.marzo, 0.000) + 
                            COALESCE(demt.abril, 0.000) + COALESCE(demt.mayo, 0.000) + COALESCE(demt.junio, 0.000) + COALESCE(demt.julio, 0.000) + 
                            COALESCE(demt.agosto, 0.000) + COALESCE(demt.septiembre, 0.000) + COALESCE(demt.octubre, 0.000) +
                            COALESCE(demt.noviembre, 0.000) + COALESCE(demt.diciembre, 0.000)) as diferencia,      
                            demt.importe as importetotal,     
                            demt.importedivisa as importetotaldivisa,     
                            demt.idusuario,
                            demt.fecha,
                            count(*) OVER() as total
                     FROM mod_planproeza.dat_demandatiempo demt     
                     INNER JOIN mod_planproeza.dat_demanda dem 
                     ON (dem.iddemanda = demt.iddemanda)
                     WHERE demt.iddemanda = {$params['iddemanda']}
                     $WHERE
                     GROUP BY demt.iddemandatiempo,
                     dem.idaprobacionplan
                     $addHaving
                     $delimitando";
        }
        
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarEntidadesEjecutoras($params) {
        $conn = Doctrine_Manager::connection();
        $limitado = "";
        if ($params['start'] && $params['limit'])
            $limitado = "OFFSET " . $params['start'] . "LIMIT " . $params['limit'];
        $query = "SELECT edn.identidad,count(*) OVER() as total
                    FROM mod_planificacion.dat_entidaddatosnomenclador edn
                    INNER JOIN mod_planificacion.nom_datosnomenclador dn 
                    ON (edn.iddatosnomenclador = dn.iddatosnomenclador AND dn.uridatosnomenclador  = 'ejecutor' AND edn.identidad IN ({$params['entidades']}))
                    WHERE edn.identidad NOT IN (
                                                SELECT dt.identidad
                                                FROM mod_planproeza.dat_demandatiempo dt
                                                where dt.iddemanda = {$params['iddemanda']}) $limitado";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function adicionarDesag($params) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO 
                    mod_planproeza.dat_demandatiempo
                  (iddemanda,
                    idusuario,
                    identidad)
                  VALUES 
                  ({$params['iddemanda']},
                    {$params['idusuario']},
                    {$params['identidad']})";

        $con->execute($query);
        return 1;
    }

    public function eliminarDesag($params) {
        $con = Doctrine_Manager::connection();
        $query = "DELETE FROM 
                    mod_planproeza.dat_demandatiempo 
                  WHERE 
                    iddemandatiempo = {$params['iddemandatiempo']}";
        $con->execute($query);
        return 1;
    }

    public function listadoDesagValidasDadoDemanda($params) {
        $con = Doctrine_Manager::connection();
        $query = "WITH datos AS
                (WITH consulta as (SELECT DISTINCT iddemanda,
                                          count(*) OVER() as totalvalidados
                                   FROM mod_planproeza.dat_demandatiempo demt
                                   WHERE iddemanda = {$params->iddemanda} AND
                                         cantidaddesglosada > 0 AND
                                         (preciodesglosado > 0 OR
                                         preciodesglosadodivisa > 0) AND
                                         cantidaddesglosada =(enero + febrero +
                                           marzo + abril + mayo + junio + julio
                                           + agosto + septiembre + octubre +
                                           noviembre + diciembre))
                SELECT count(*) OVER() as total,
                       COALESCE(c.totalvalidados, 0) as totalvalidados,
                       demt.cantidaddesglosada as plantalleres
                FROM mod_planproeza.dat_demandatiempo demt
                LEFT JOIN consulta c 
                ON (demt.iddemanda = c.iddemanda)
                WHERE demt.iddemanda = {$params->iddemanda})
                SELECT d.total,
                       d.totalvalidados,
                       sum(plantalleres) as plantalleres
                FROM datos d
                GROUP BY d.total,
                         d.totalvalidados";

        $data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        //print_r($data);die();
        return $data;
    }

//    public function listadoTotalDesagValidasDadoDemanda($params) {
//        $con = Doctrine_Manager::connection();
//        $query = "SELECT sum(enero + febrero + marzo + abril + mayo + junio + julio + agosto +
//                    septiembre + octubre + noviembre + diciembre) as totaldesagregado
//                    FROM mod_planproeza.dat_demandatiempo demt
//                    WHERE iddemanda = {$params->iddemanda} ";
//
//        $data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
//        return $data;
//    }
}

//fin clase


