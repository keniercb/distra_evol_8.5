<?php

class DatBasescalculo extends BaseDatBasescalculo {

    public function setUp() {
        parent::setUp();
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio'));
        $this->hasOne('DatModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasOne('DatEntidadmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
    }

    public function listarCalculos($params) {
        //trabajo con los filtros
        $addWhereFiltros = "";
        $addWhereFiltrosAdentro = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $addWhereFiltros .= " AND r.codigo  LIKE '{$datos ['data'] ['value']}%'";
                } elseif ($datos ['field'] == 'numeropieza') {
                    $addWhereFiltros .= " AND upper(r.numeropieza) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'denominacion') {
                    $addWhereFiltros .= " AND upper(r.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'idumedida') {
                    $addWhereFiltros .= " AND r.idumedida={$datos['data']['value']}";
                } elseif ($datos['field'] == 'modelo') {
                    $addWhereFiltros .= " AND r.idmodelo={$datos['data']['value']}";
                } elseif ($datos['field'] == 'identidaddatosnomenclador') {
                    $addWhereFiltros .= " AND r.identidaddatosnomenclador={$datos['data']['value']}";
                } elseif ($datos['field'] == 'idnaturaleza') {
                    $addWhereFiltros .= " AND r.idnaturaleza IN ({$datos['data']['value']})";
                } elseif ($datos ['field'] == 'idvia') {
                    $addWhereFiltrosAdentro .= " AND iva.idviaadquisicion IN ({$datos['data']['value']})";
                } elseif ($datos ['field'] == 'idorgano') {
                    $addWhereFiltrosAdentro .= " AND ivos.idorganosatisface IN ({$datos['data']['value']})";
                } elseif ($datos['field'] == 'idpais') {
                    $addWhereFiltros .= " AND r.idpais={$datos['data']['value']}";
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhereFiltros .= " AND r.precio >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhereFiltros .= " AND r.precio <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhereFiltros .= " AND r.precio =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'preciodivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhereFiltros .= " AND r.preciodivisa >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhereFiltros .= " AND r.preciodivisa <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhereFiltros .= " AND r.preciodivisa =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'flete') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhereFiltros .= " AND r.flete >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhereFiltros .= " AND r.flete <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhereFiltros .= " AND r.flete =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'contingencia') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhereFiltros .= " AND r.contingencia >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhereFiltros .= " AND r.contingencia <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhereFiltros .= " AND r.contingencia =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'necesidad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhereFiltros .= " AND r.necesidad >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhereFiltros .= " AND r.necesidad <" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhereFiltros .= " AND r.necesidad =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'importe') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhereFiltros .= " AND r.importe >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhereFiltros .= " AND r.importe<" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhereFiltros .= " AND r.importe =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'importeflete') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhereFiltros .= " AND r.importeflete >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhereFiltros .= " AND r.importeflete<" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhereFiltros .= " AND r.importeflete =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'importecontingencia') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhereFiltros .= " AND r.importecontingencia >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhereFiltros .= " AND r.importecontingencia<" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhereFiltros .= " AND r.importecontingencia =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos ['field'] == 'importedivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhereFiltros .= " AND r.importedivisa >" . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhereFiltros .= " AND r.importedivisa<" . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhereFiltros .= " AND r.importedivisa =" . $datos ['data'] ['value'] . "";
                    }
                } elseif ($datos['field'] == 'idtipoplan') {
                    if ($datos['data']['value'] == 'Ingreso')
                        $addWhereFiltros .= " AND r.idtipoplan = 1";
                    elseif ($datos['data']['value'] == 'Gasto')
                        $addWhereFiltros .= "  AND  r.idtipoplan = 0";
                } elseif ($datos['field'] == 'idusuario') {
                    $addWhereFiltros .= " AND r.idusuario ={$datos['data']['value']}";
                } elseif ($datos ['field'] == 'fecha') {
                    $fecha = explode('/', $datos ['data']['value']);
                    $fecha = $fecha[1] . '/' . $fecha[0] . '/' . $fecha[2];
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhereFiltros .= "AND r.fecha::date<'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhereFiltros .= "AND r.fecha::date>'{$fecha}'";
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhereFiltros .= "AND r.fecha::date='{$fecha}'";
                    }
                }
            }
        }
        $delimitador = "";
        if ($params['exportar'] != 1) {
            //el delimitador solo se pone si es el listar
            $delimitador = "OFFSET {$params['start']} LIMIT {$params['limit']}";
        }
        //si viene el plan que se va a actualizar 
        $addWhereModelo = "";
        if ($params['idmodelo'] != -1) {
            $addWhereModelo = "AND  bc.idmodelo = {$params['idmodelo']}";
        }
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT r.idindicador,
                        r.codigo,
                        r.numeropieza,
                        r.denominacion,
                        r.idumedida,
                        r.modelo,
                        r.idmodelo,
                        r.precio,
                        r.preciodivisa,
                        r.necesidad,
                        r.importe,
                        r.importeflete,
                        r.importecontingencia,
                        r.importedivisa,
                        r.identidaddatosnomenclador,
                        r.contingencia,
                        r.flete,
                        r.idnaturaleza,
                        r.idvia,
                        r.idorgano,
                        r.idpais,
                        r.esdirecto,
                        r.idtipoplan,
                        r.idusuario,
                        r.fecha,
                        sum(r.importe) OVER() as importetotal,
                        sum(r.importedivisa) OVER() as importedivisatotal,
                        sum(r.importeflete) OVER() as importefletetotal,
                        sum(r.importecontingencia) OVER() as importecontingenciatotal,
                        count(*) OVER() as total
                 FROM (
                               SELECT bc.idindicador,
                                        i.codigo,
                                        i.numeropieza,
                                        i.denominacion,
                                        i.idumedida,
                                        m.denominacion as modelo,
                                        m.idmodelo,
                                        round(bc.precio, 6) as precio,
                                        round(bc.preciomlc, 6) as preciodivisa,
                                        round(COALESCE(sum(necesidad), 0), 6) as necesidad,
                                        round(COALESCE(sum(importe), 0), 3) as importe,
                                        round(COALESCE(sum(importeflete), 0), 3) as importeflete,
                                        round(COALESCE(sum(importecontingencia), 0), 3) as importecontingencia,
                                        round(COALESCE(sum(importemlc), 0), 3) as importedivisa,
                                        icb.identidaddatosnomenclador,
                                        round(ip.contingencia, 3) as contingencia,
                                        round(ip.flete, 3) as flete,
                                        i.idnaturaleza,
                                        LIST(DISTINCT va.denominacion) as idvia,
                                        LIST(DISTINCT os.denominacion) as idorgano,
                                        i.idpais,
                                        CASE
                                          WHEN im.idindicador IS NULL THEN 0
                                          ELSE 1
                                        END AS esdirecto,
                                        m.tipoplan as idtipoplan,  
                                        bc.idusuario,
                                        bc.fecha
                        FROM mod_planificacion.dat_basescalculo{$params['tabla']} bc
                             INNER JOIN mod_planificacion.dat_modelo m ON m.idmodelo = bc.idmodelo
                             INNER JOIN mod_datosmaestros.nom_indicador i ON (bc.idindicador = i.idindicador AND i.estado = 1)
                             INNER JOIN mod_datosmaestros.nom_indicadorplanif ip on (ip.idindicador = i.idindicador 
                             AND ip.idaprobacion = 4 AND ip.nivelplanif = 1)
                             INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb ON (i.idindicador = icb.idindicador)
                             LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva ON i.idindicador = iva.idindicador
                             LEFT JOIN mod_datosmaestros.nom_viaadquisicion va ON iva.idviaadquisicion = va.idviaadquisicion
                             LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivos ON 
                             (iva.idindicador = ivos.idindicador AND iva.idviaadquisicion = ivos.idviaadquisicion)
                             LEFT JOIN mod_datosmaestros.nom_organosatisface os ON (ivos.idorganosatisface = os.idorganosatisface 
                             AND os.ordender - os.ordenizq = 1)
                             LEFT JOIN mod_datosmaestros.dat_indicadormodelo im ON i.idindicador = im.idindicador
                        WHERE bc.identidad IN ({$params['identidades']})
                                $addWhereModelo 
                                AND bc.idejercicio = {$params['idejercicio']}
                              $addWhereFiltrosAdentro
                        GROUP BY bc.idindicador,
                                 i.codigo,
                                 i.numeropieza,
                                 i.denominacion,
                                 i.idumedida,
                                 m.denominacion,
                                 bc.precio,
                                 bc.preciomlc,
                                 icb.identidaddatosnomenclador,
                                 ip.contingencia,
                                 ip.flete,
                                 i.idnaturaleza,
                                 im.idindicador,
                                 i.idpais,
                                 m.tipoplan,
                                 m.idmodelo, 
                                 bc.idusuario,
                                 bc.fecha
                        ORDER BY i.codigo
                      ) r WHERE true $addWhereFiltros $delimitador";
        $data->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];
        return $data;
    }

}
