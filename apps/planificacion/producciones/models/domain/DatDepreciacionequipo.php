<?php

class DatDepreciacionequipo extends BaseDatDepreciacionequipo {

    public function setUp() {
        parent::setUp();
        $this->HasMany(
                'DatCartatecnologicadepreciacionequipo', array('local' => 'iddepreciacionequipo', 'foreign' => 'iddepreciacionequipo')
        );
    }

    public function listarIndicadoresParaAdicionar($params) {
        $addWhere = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " AND upper(ind.codigo) LIKE  " . "'" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'denominacion') {
                    $addWhere .= " AND upper(ind.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'descripcion') {
                    $addWhere .= " AND upper(ind.descripcion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'idumedida') {
                    $addWhere .= " AND ind.idumedida ={$datos['data']['value']}";
                } elseif ($datos['field'] == 'idnaturaleza') {
                    $addWhere .= " AND ind.idnaturaleza ={$datos['data']['value']}";
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND indp.precio<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND indp.precio>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND indp.precio={$datos['data']['value']}";
                    }
                } elseif ($datos['field'] == 'numeropieza') {
                    $addWhere .= " AND upper(ind.numeropieza) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                }
            }
        }
        $delimitando = "";
        if ($params['start'] != null && $params['limit'] != null) {
            $start = $params['start'];
            $limit = $params['limit'];
            $delimitando = " OFFSET $start LIMIT $limit ";
        }

        $conn = Doctrine_Manager:: connection();

        $query = "SELECT ind.idindicador,
                    ind.codigo,
                    ind.denominacion,
                    ind.descripcion,
                    ind.numeropieza,
                    ind.idumedida,
                    indp.precio,
                    ind.idnaturaleza,
                    count(*) OVER() as total
             FROM mod_datosmaestros.nom_indicador ind
                  INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON indp.idindicador =
                    ind.idindicador
             WHERE indp.nivelplanif = 1 AND
                   indp.idaprobacion = 4 AND
                   ind.estado = 1 AND
                   ind.idindicador not in (SELECT depr.idindicador FROM mod_spouam.dat_depreciacionequipo depr )
                $addWhere
             ORDER BY ind.codigo $delimitando";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarDepreciaciones($params) {

        $addWhere = "true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " AND upper(ind.codigo) LIKE  " . "'" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'denominacion') {
                    $addWhere .= " AND upper(ind.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'descripcion') {
                    $addWhere .= " AND upper(ind.descripcion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'cantidad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND depr.cantidad<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND depr.cantidad>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND depr.cantidad={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND indp.precio<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND indp.precio>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND indp.precio={$datos['data']['value']}";
                    }
                } elseif ($datos['field'] == 'numeropieza') {
                    $addWhere .= " AND upper(ind.numeropieza) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'valoraf') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND round((depr.cantidad*indp.precio),3)<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND round((depr.cantidad*indp.precio),3)>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND round((depr.cantidad*indp.precio),3)={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'tasadepreciacion') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND depr.tasadepreciacion<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND depr.tasadepreciacion>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND depr.tasadepreciacion={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'depreciacionanual') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere .= " AND round((depr.cantidad * indp.precio * depr.tasadepreciacion),3)<{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere .= " AND round((depr.cantidad * indp.precio * depr.tasadepreciacion),3)>{$datos['data']['value']}";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere .= " AND round((depr.cantidad * indp.precio * depr.tasadepreciacion),3)={$datos['data']['value']}";
                    }
                } elseif ($datos ['field'] == 'enuso') {
                    if ($datos['data']['value'] == 1) {
                        $addWhere .= " AND depr.iddepreciacionequipo IN (SELECT ect.iddepreciacionequipo FROM mod_spouam.dat_equipocarta ect)";
                    } else {
                        $addWhere .= " AND depr.iddepreciacionequipo NOT IN (SELECT ect.iddepreciacionequipo FROM mod_spouam.dat_equipocarta ect)";
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

        $asociadasAEquipos = "";
        if ($params['idcartatecnologica'] != null) {
            $idcartatec = $params['idcartatecnologica'];
            $asociadasAEquipos = " AND depr.iddepreciacionequipo NOT IN
                    (SELECT iddepreciacionequipo FROM mod_spouam.dat_equipocarta WHERE idcartatecnologica = $idcartatec) 
                    AND indp.precio > 0 AND depr.cantidad > 0 AND depr.tasadepreciacion > 0";
        }

        $conn = Doctrine_Manager:: connection();
        $query = "SELECT 
                    depr.iddepreciacionequipo,
                    depr.idindicador,
                    depr.cantidad,
                    depr.tasadepreciacion,
                    ind.codigo,
                    ind.denominacion,
                    ind.descripcion,
                    ind.numeropieza,
                    indp.precio,
                        CASE
                          WHEN depr.iddepreciacionequipo IN (SELECT ect.iddepreciacionequipo FROM mod_spouam.dat_equipocarta ect) THEN 1
                          ELSE 0
                        END as enuso,
                    round((depr.cantidad*indp.precio),3) as valoraf,
                    round((depr.cantidad * indp.precio * depr.tasadepreciacion),3) as depreciacionanual,
                    count(*) OVER() as total
                 FROM 
                    mod_spouam.dat_depreciacionequipo depr 
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
                    ON indp.idindicador =depr.idindicador
                    INNER JOIN mod_datosmaestros.nom_indicador ind
                    ON ind.idindicador =depr.idindicador
                    where  $addWhere $asociadasAEquipos
                    ORDER BY ind.codigo $delimitando";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function DameDeprAnualEquipo($iddepreciacionequipo) {
        $conn = Doctrine_Manager:: connection();
        $query = "SELECT 
           depr.iddepreciacionequipo,
           round((depr.cantidad * indp.precio * depr.tasadepreciacion),3) as depreciacionanual
        FROM 
           mod_spouam.dat_depreciacionequipo depr 
           INNER JOIN mod_datosmaestros.nom_indicadorplanif indp 
           ON indp.idindicador =depr.idindicador
           where  depr.iddepreciacionequipo = $iddepreciacionequipo";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}

//fin clase 