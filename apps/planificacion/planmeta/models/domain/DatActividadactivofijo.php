<?php

class DatActividadactivofijo extends BaseDatActividadactivofijo {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'NomActividad', array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
        $this->hasOne(
                'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

    public function listarActivos($parametros) {
        $sqlWhere = "";
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $sqlWhere .= " AND ind." . $datos['field'] . " LIKE '" . $datos['data']['value'] . "%'";
                } elseif ($datos ['field'] == 'denominacion') {
                    $sqlWhere .= " AND upper(ind.denominacion) LIKE '%" . strtoupper($datos ['data'] ['value']) . "%' ";
                } elseif ($datos ['field'] == 'cantidad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $sqlWhere .= " AND aaf.cantidad > {$datos ['data'] ['value']} ";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $sqlWhere .= " AND aaf.cantidad < {$datos ['data'] ['value']} ";
                    } else {
                        $sqlWhere .= " AND aaf.cantidad = {$datos ['data'] ['value']} ";
                    }
                } elseif ($datos ['field'] == 'idusuario') {
                    $sqlWhere .= " AND aaf.idusuario = {$datos ['data'] ['value']} ";
                }
            }
        }
        $delimitando = "";
        if ($parametros['start'] != null && $parametros['limit']) {
            $delimitando = " LIMIT {$parametros['limit']} OFFSET {$parametros['start']} ";
        }
        $conn = Doctrine_Manager::connection();
        $sqlUno = "SELECT 
                    aaf.idindicador,
                    ind.denominacion,
                   aaf.idactividad,
                    aaf.cantidad,
                    aaf.idactividadactivofijo,
                    aaf.idusuario,
                    aaf.fecha,
                    ind.codigo,
                    count(*) OVER() as total
                  FROM 
                    mod_planificacion.dat_actividadactivofijo  aaf
                    INNER JOIN mod_datosmaestros.nom_indicador ind
                    ON (ind.idindicador = aaf.idindicador)
  
                    WHERE aaf.idactividad={$parametros['idactividad']}
                     $sqlWhere
                     $delimitando
                  ";
        $data = $conn->execute($sqlUno)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function listarActivosAddActivos($parametros) {

        $addWhere = "";
        if ($parametros ['filtros']) {
            foreach ($parametros ['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $addWhere.=" AND ind.codigo LIKE '" . $datos['data']['value'] . "%'";
                } elseif ($datos ['field'] == 'numeropieza') {
                    $addWhere.=" AND ind.numeropieza LIKE '" . $datos['data']['value'] . "%'";
                } elseif ($datos ['field'] == 'estado') {
                    if ($datos['data']['value'] == 'Si' || $datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'si' || $datos['data']['value'] == 'sí') {
                        $addWhere .= " AND ind.estado = 1 ";
                    } else {
                        $addWhere .= " AND ind.estado = 0 ";
                    }
                } elseif ($datos ['field'] == 'idaprobacion') {
                    if ($datos['data']['value'] == 'Si' || $datos['data']['value'] == 'Sí' || $datos['data']['value'] == 'si' || $datos['data']['value'] == 'sí') {
                        $addWhere .= " AND indp.idaprobacion = 3 ";
                    } else {
                        if ($datos ['data'] ['value'] == "Rector") {
                            $addWhere .= " AND indp.idaprobacion = 4 ";
                        } else {
                            $addWhere .= " AND (indp.idaprobacion = 1) ";
                        }
                    }
                } elseif ($datos ['field'] == 'denominacion') {
                    $addWhere.=" AND upper(ind.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'descripcion') {
                    $addWhere.=" AND upper(ind.descripcion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'idumedida') {
                    $addWhere.=" AND ind.idumedida = {$datos['data']['value']}";
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos['data']['comparison'] == 'eq')
                        $addWhere.=" AND indp.precio = {$datos['data']['value']}";
                    else if ($datos['data']['comparison'] == 'gt')
                        $addWhere.=" AND indp.precio > {$datos['data']['value']}";
                    else
                        $addWhere.=" AND indp.precio < {$datos['data']['value']}";
                }elseif ($datos ['field'] == 'preciodivisa') {
                    if ($datos['data']['comparison'] == 'eq')
                        $addWhere.=" AND indp.preciodivisa = {$datos['data']['value']}";
                    else if ($datos['data']['comparison'] == 'gt')
                        $addWhere.=" AND indp.preciodivisa > {$datos['data']['value']}";
                    else
                        $addWhere.=" AND indp.preciodivisa < {$datos['data']['value']}";
                } elseif ($datos ['field'] == 'idcentrobalance') {
                    $addWhere.=" AND indc.identidaddatosnomenclador = {$datos['data']['value']}";
                } elseif ($datos ['field'] == 'idnaturaleza') {
                    $addWhere.=" AND ind.idnaturaleza = {$datos['data']['value']}";
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $sqlUno = "SELECT  ind.idindicador,
                            ind.denominacion,
                            ind.codigo,
                            ind.estado,
                            count(*) OVER() as total,
                            indp.idaprobacion,
                            ind.descripcion,
                            indp.precio,
                            indp.preciodivisa,
                            ind.idumedida,
                            ind.numeropieza,
                            ind.idnaturaleza as idnaturaleza,
                            ind.idumedida,
                            indc.identidaddatosnomenclador as idcentrobalance                         
                          FROM mod_datosmaestros.nom_indicador ind
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador =
                            indp.idindicador)
                          INNER JOIN mod_datosmaestros.nom_indicadorhoja indh ON (ind.idindicador =
                            indh.idindicador)
                          INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance indc ON (
                            ind.idindicador = indc.idindicador) ---preguntar por esta restricion
                          WHERE  indp.nivelplanif = 1
                          $addWhere
                          AND ind.estado = 1 
                          AND indh.explotacion=1
                          AND indp.idaprobacion = 4 
                          AND ind.idindicador NOT IN (
                                                SELECT aaf.idindicador
                                                FROM mod_planificacion.dat_actividadactivofijo aaf
                                                WHERE aaf.idactividad = {$parametros['idactividad']}
                                                     )
                          ORDER BY ind.codigo 
                          OFFSET {$parametros['start']}
                          LIMIT {$parametros['limit']}";
        $data->data = $conn->execute($sqlUno)->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];



        return $data;
    }

}
