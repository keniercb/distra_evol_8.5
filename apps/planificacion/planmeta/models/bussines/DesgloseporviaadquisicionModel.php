<?php

class DesgloseporviaadquisicionModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarDesglosePorViaYOrgano($params, $start = 0, $limit = 20
    ) {
        $arrayParamsCond[] = $params['idindicador'];
        $arrayParamsCond[] = $params['idindicador'];
        $arrayParamsCond[] = $params['idindicador'];
        $arrayParamsCond[] = $params['idindicador'];
        $arrayParamsCond[] = $params['identidad'];
        $arrayParamsCond[] = $params['idmodelo'];
        $arrayParamsCond[] = $params['idejercicio'];
        $arrayParamsCond[] = $start;
        $arrayParamsCond[] = $limit;

        $con = Doctrine_Manager::connection();
        if ($params['listar']) {
            $query = "SELECT d.iddesgviaadquisorgsat AS iddesgviaadquisorgsat,
       d.cantidad AS cantidad,
       d.idaprobacion AS idaprobacion,
       d.idorganosatisface AS idorganosatisface,
       m.idindicadorviaadquisicionorganosatisface AS
         idindicadorviaadquisicionorganosatisface,
       m2.idindicador AS idindicador,
       m3.idviaadquisicion AS idviaadquisicion,
       m3.denominacion AS denovia,
       round((d.cantidad * ind.precio),6) as importe,
       m4.denominacion AS denominacionorg
FROM mod_planificacion.dat_desgviaadquisorgsat d
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface m
       ON d.idindicadorviaadquisicionorganosatisface =
       m.idindicadorviaadquisicionorganosatisface
       INNER JOIN mod_datosmaestros.nom_indicadorplanif ind
       ON d.idindicador =
       ind.idindicador
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion m2 ON
       m.idviaadquisicion = m2.idviaadquisicion
     LEFT JOIN mod_datosmaestros.nom_viaadquisicion m3 ON m2.idviaadquisicion =
       m3.idviaadquisicion
     LEFT JOIN mod_datosmaestros.nom_organosatisface m4 ON d.idorganosatisface =
       m4.idorganosatisface
       WHERE m.idindicador = {$params['idindicador']}
       AND m2.idindicador = {$params['idindicador']} AND d.idindicador = {$params['idindicador']}
       AND d.identidad = {$params['identidad']} AND d.idmodelo = {$params['idmodelo']}
       AND m.idindicador = {$params['idindicador']} AND d.idejercicio = {$params['idejercicio']}";
            $res->data = $con->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        }
        if ($params['contar']) {
            $query = "SELECT count(d.iddesgviaadquisorgsat) as total
FROM mod_planificacion.dat_desgviaadquisorgsat d
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface m
       ON d.idindicadorviaadquisicionorganosatisface =
       m.idindicadorviaadquisicionorganosatisface
     INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion m2 ON
       m.idviaadquisicion = m2.idviaadquisicion
     LEFT JOIN mod_datosmaestros.nom_viaadquisicion m3 ON m2.idviaadquisicion =
       m3.idviaadquisicion
     LEFT JOIN mod_datosmaestros.nom_organosatisface m4 ON d.idorganosatisface =
       m4.idorganosatisface
       WHERE m.idindicador = {$params['idindicador']}
       AND m2.idindicador = {$params['idindicador']} AND d.idindicador = {$params['idindicador']}
       AND d.identidad = {$params['identidad']} AND d.idmodelo = {$params['idmodelo']}
       AND m.idindicador = {$params['idindicador']} AND d.idejercicio = {$params['idejercicio']}";
            $res->total = $con->execute($query)->fetchAll(PDO::FETCH_COLUMN);
            $res->total = $res->total[0];
        }
        return $res;
    }

    public function eliminarDesglose($parametros) {
        if ($parametros['desgloses'][0] != null) {
            $query = Doctrine_Query::create();
            $query->delete('DatDesgviaadquisorgsat')
                    ->whereIn('iddesgviaadquisorgsat', $parametros['desgloses']);
            $query->addWhere(
                    'idindicador = ? AND idmodelo=? AND identidad =? AND idejercicio=?', array($parametros['idindicador'], $parametros['idmodelo'],
                $parametros['identidad'],
                $parametros['idejercicio'])
            );
            $query->execute();
        }
        return 20;
    }

    public function desglosar($parametros) {
        $res = 20;
        foreach ($parametros['arraydesglose'] as $value) {
            if ($value->iddesgviaadquisorgsat) {
                $objdesgvia = DatDesgviaadquisorgsat::existeElemento(
                                $value->iddesgviaadquisorgsat
                );
                $objdesgvia->cantidad = doubleval($value->cantidad);
                $objdesgvia->save();
            } else {
                $idorganosatisfaceAsoc = $value->denominacionorg;
            }
            if ($value->denominacionorg && $value->denovia && $idorganosatisfaceAsoc
            ) {
                $idinviaorgs = DatIndicadorviaadquisicionorganosatisface::obtenerId(
                                $parametros['idindicador'], $value->denominacionorg, $value->denovia
                );

                $existedesglose = DatDesgviaadquisorgsat::existeDesglose(
                                $idinviaorgs, $parametros, $idorganosatisfaceAsoc
                );
                if ($existedesglose->iddesgviaadquisorgsat == null) {
                    $desgvia = new DatDesgviaadquisorgsat();
                    $desgvia->idejercicio = $parametros['idejercicio'];
                    $desgvia->identidad = $parametros['identidad'];
                    $desgvia->idindicador = $parametros['idindicador'];
                    $desgvia->idmodelo = $parametros['idmodelo'];
                    $desgvia->idindicadorviaadquisicionorganosatisface = $idinviaorgs;
                    $desgvia->idorganosatisface = $idorganosatisfaceAsoc;
                    $desgvia->cantidad = doubleval($value->cantidad);
                    $desgvia->idaprobacion = 1;
                    $desgvia->save();
                } else {
                    $res = 26;
                }
            }
        }
        return $res;
    }

    public function listarOS_XPorNivel($nivelarbol) {
        $data->data = NomOrganosatisface::obtenerOrgSatisfacePorNivel(
                        $nivelarbol
        );
        foreach ($data->data as $indice => $valor) {
            unset($data->data[$indice]);
            $data->data[$indice]['idorganosatisface'] = $valor['idorganosatisface'];
            $data->data[$indice]['denominacion'] = $valor['denominacion'];
        }
        return $data;
    }

    public function exportar($parametros) {

        $tituloreporte = 'DesgloseViaAdquisicion';
        $extension = '.xls';
        header(
                "Content-type: application/vnd.ms-" . $tipo . "; name='" . $tipo
                . "';Charset=iso-8859-1"
        );
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header(
                "Content-disposition: attachment; filename=" . $tituloreporte
                . $extension
        );
        header("Pragma: no-cache");
        header("Expires: 0");

        echo '<HTML><HEAD> <META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html;'
        . 'charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";

        echo " <h3> <caption >INDICADORES POR VIA DE ADQUISICION</caption> </h3> ";

        echo '<tr>';
        echo "<th colspan=\"13\"> ENTIDAD: " . $parametros['entidad']
        . "</th>\n";
        echo '</tr>';
        echo '<tr>';
        echo "<th colspan=\"13\"> PLAN: " . $parametros['plan']
        . "</th>\n";
        echo '</tr>';

        echo '<tr>';
        echo '<th>C&oacute;digo</th>';
        echo '<th align=left>No pieza </th>';
        echo '<th align=left>Denominaci&oacute;n</th>';
        echo '<th align=left>UM </th>';
        echo '<th align=left>Precio </th>';
        echo '<th align=left>Centro de Balance </th>';
        echo '<th align=left>Demanda</th>';
        echo '<th align=left>Desglosado </th>';
        echo '<th align=left>Aprobado </th>';
        echo '<th align=left>Importe </th>';
        echo '<th align=left>Vía de adquisición </th>';
        echo '<th align=left>Órgano que satisface </th>';
        echo '<th align=left>Cantidad desglosada</th>';
        echo '<th align=left>Importe del desglose</th>';
        echo '</tr>';

        foreach ($parametros['filt'] as $filtro) {
            $obj_filtro['field'] = $filtro->field;
            $obj_filtro['data']['type'] = $filtro->data->type;
            if ($obj_filtro['data']['type'] == 'numeric') {
                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
            }
            if ($obj_filtro['data']['type'] == 'list') {
                $obj_filtro['data']['value'] = $filtro->data->value[0];
            } else {
                $obj_filtro['data']['value'] = $filtro->data->value;
            }
            $nuevos_filtros[] = $obj_filtro;
        }
        $parametros['filtros'] = CentrodebalanceModel::ordenarFiltrosListarExportarDesgVA($nuevos_filtros);

        $parametros['contar'] = true;
        $parametros['listar'] = false;
        $cantIndicadoresExportar = CentrodebalanceModel::listarIndicadoresVia($start, $limit, $parametros);

        $cantRegistro = 10000;
        $cantPaginas = (int) ($cantIndicadoresExportar->total / $cantRegistro);
        if (fmod($cantIndicadoresExportar->total, $cantRegistro) > 0) {
            $cantPaginas++;
        }
        unset($cantIndicadoresExportar);
        $start = 0;
        $parametros['contar'] = false;
        $parametros['listar'] = true;
        $parametros['exp'] = true;
        $integrator = ZendExt_IoC::getInstance();
        $parametros['identidad'] = $parametros['idcb'];
        for ($i = 1; $i <= $cantPaginas; $i++) {
            $parametros['start'] = $start;
            $parametros['limit'] = $cantRegistro;
            $indicadores = CentrodebalanceModel::listarIndicadoresVia($parametros['start'], $parametros['limit'], $parametros);
            $start += $cantRegistro;
            foreach ($indicadores->data as $value) {
                $parametros['idindicador'] = $value['idindicador'];
                if ($value['desglosado'] == 1 || $value['desglosado'] == 2) {
                    $desgloses = $data = self::listarDesglosePorViaYOrgano($parametros, $start, $limit);
                    foreach ($desgloses->data as $v) {
                        echo '<tr>';
                        echo "<td>" . $value['codigo'] . "</td>";
                        echo "<td>" . $value['numeropieza'] . "</td>";
                        echo "<td>" . $value['denominacion'] . "</td>";
                        $UM = $integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                                Array($value['idumedida'])
                        );
                        echo "<td>" . $UM[0]['denominacionunidadmedida'] . "</td>\n";
                        echo "<td>" . $value['precio'] . "</td>";
                        echo "<td>" . $value['denominacioncb'] . "</td>";
                        echo "<td>" . $value['demanda'] . "</td>";
                        if ($value['desglosado'] == 1)
                            echo "<td>Sí</td>";
                        else
                        if ($value['desglosado'] == 2)
                            echo "<td>Parcial</td>";
                        else
                            echo "<td>No</td>";

                        if ($value['idaprobacion'] == 1)
                            echo "<td>No</td>";
                        else
                            echo "<td>Sí</td>";
                        echo "<td>" . $value['importe'] . "</td>";
                        echo "<td>" . $v['denovia'] . "</td>";
                        echo "<td>" . $v['denominacionorg'] . "</td>";
                        echo "<td>" . $v['cantidad'] . "</td>";
                        echo "<td>" . $v['cantidad'] * $value['precio'] . "</td>";

                        echo '</tr>';
                    }
                }
                else {
                    echo '<tr>';
                    echo "<td>" . $value['codigo'] . "</td>";
                    echo "<td>" . $value['numeropieza'] . "</td>";
                    echo "<td>" . $value['denominacion'] . "</td>";
                    $UM = $integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                            Array($value['idumedida'])
                    );
                    echo "<td>" . $UM[0]['denominacionunidadmedida'] . "</td>\n";
                    echo "<td>" . $value['precio'] . "</td>";
                    echo "<td>" . $value['denominacioncb'] . "</td>";
                    echo "<td>" . $value['demanda'] . "</td>";
                    if ($value['desglosado'] == 1)
                        echo "<td>Sí</td>";
                    else
                    if ($value['desglosado'] == 2)
                        echo "<td>Parcial</td>";
                    else
                        echo "<td>No</td>";
                    if ($value['idaprobacion'] == 1)
                        echo "<td>No</td>";
                    else
                        echo "<td>Sí</td>";
                    echo '</tr>';
                }
            }
        }

        echo '</table>';

        echo '</BODY></HTML>';
    }

}

//fin clase