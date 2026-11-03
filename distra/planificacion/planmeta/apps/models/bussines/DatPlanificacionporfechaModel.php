<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

class DatPlanificacionporfechaModel extends ZendExt_Model {

    public function init() {
        parent::ZendExt_Model();
    }

    public function listarIndEjecsinmodelo($parametros) {
        $condiciones = array();
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $datos) {

                if ($datos['field'] == 'codigo') {
                    $condiciones[] = " ind.codigo LIKE '"
                            . $datos['data']['value']
                            . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condiciones[] = "upper(ind.denominacion) LIKE  "
                                . ("'%"
                                . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                    } else {
                        if ($datos['field'] == 'cantidad') {
                            $sqlNNA = "(p.cantidad + p.ajuste) ";
                            if ($datos['data']['comparison'] == 'lt') {
                                $sqlNNA = $sqlNNA . "<";
                            } else {
                                if ($datos['data']['comparison'] == 'gt') {
                                    $sqlNNA = $sqlNNA . ">";
                                } else {
                                    $sqlNNA = $sqlNNA . "=";
                                }
                            }
                            $condiciones[] = $sqlNNA . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'cantidadreal') {
                                $sqlNNA = " COALESCE (v.cantreal,0)";
                                if ($datos['data']['comparison'] == 'lt') {
                                    $sqlNNA = $sqlNNA . "<";
                                } else {
                                    if ($datos['data']['comparison'] == 'gt') {
                                        $sqlNNA = $sqlNNA . ">";
                                    } else {
                                        $sqlNNA = $sqlNNA . "=";
                                    }
                                }
                                $condiciones[] = $sqlNNA
                                        . $datos['data']['value'];
                            } else {
                                if ($datos['field'] == 'cantidadpordesglozar') {
                                    $sqlNNA = " ((p.cantidad + p.ajuste) - COALESCE (v.cantreal,0))";
                                    if ($datos['data']['comparison'] == 'lt') {
                                        $sqlNNA = $sqlNNA . "<";
                                    } else {
                                        if ($datos['data']['comparison'] == 'gt'
                                        ) {
                                            $sqlNNA = $sqlNNA . ">";
                                        } else {
                                            $sqlNNA = $sqlNNA . "=";
                                        }
                                    }
                                    $condiciones[] = $sqlNNA
                                            . $datos['data']['value'];
                                } else {
                                    if ($datos['field'] == 'umedida') {
                                        $condiciones[] = " p.idunidadmedida = "
                                                . $datos['data']['value'];
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $WHERE = "";
        foreach ($condiciones as $condicion) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $condicion;
            } else {
                $WHERE = $WHERE . " AND " . $condicion;
            }
        }
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }
        if (!$parametros['limit']) {
            $parametros['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$parametros['start']}
                          LIMIT  {$parametros['limit']}";

        if ($parametros['glob'] == 'false' || $parametros['esHoja']) {
            $data = DatPlanificacionporfecha::listarIndEjecsinmodelo($parametros, $WHERE, $offsetLimit);
        } else {
            $data = DatPlanificacionporfecha::listarIndEjecConssinmodelo($parametros, $WHERE, $offsetLimit);
        }
        return $data;
    }

    public function listarPlanifporfecha($params) {
        //temporal falta el filtrado
        $query = new Doctrine_Query();
        $querytotal = new Doctrine_Query();

        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'cantidad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $query->addWhere(
                                "napf.nivelactividad <" . $datos ['data']['value']
                        );
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $query->addWhere(
                                "napf.nivelactividad >" . $datos ['data']['value']
                        );
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $query->addWhere(
                                "napf.nivelactividad =" . $datos ['data']['value']
                        );
                    }
                } else {
                    if ($datos ['field'] == 'fechainicio'
                    ) { //[data][comparision]  lt=antes 	gt=despues  eq=en
                        $fechainicio = explode('/', $datos ['data']['value']);
                        $fechainicio = $fechainicio[1] . '/' . $fechainicio[0]
                                . '/' . $fechainicio[2];
                        if ($datos['data']['comparison'] == 'lt') {
                            $query->addWhere(
                                    "napf.fechainicio <'" . $fechainicio . "'"
                            );
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $query->addWhere(
                                    "napf.fechainicio >'" . $fechainicio . "'"
                            );
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $query->addWhere(
                                    "napf.fechainicio ='" . $fechainicio . "'"
                            );
                        }
                    } else {
                        if ($datos ['field'] == 'fechafin') {
                            $fechafin = explode('/', $datos ['data']['value']);
                            $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/'
                                    . $fechafin[2];
                            if ($datos['data']['comparison'] == 'lt') {
                                $query->addWhere(
                                        "napf.fechafin <'" . $fechafin . "'"
                                );
                            }
                            if ($datos['data']['comparison'] == 'gt') {
                                $query->addWhere(
                                        "napf.fechafin >'" . $fechafin . "'"
                                );
                            }
                            if ($datos['data']['comparison'] == 'eq') {
                                $query->addWhere(
                                        "napf.fechafin ='" . $fechafin . "'"
                                );
                            }
                        }
                    }
                }
            }
        }
        $data->data = $query->from('DatPlanificacionporfecha napf')
                ->addWhere(
                        'napf.idplanificacion = ?', array($params['idplanificacion'])
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->offset($params['start'])
                ->limit($params['limit'])
                ->execute();

        $data->total = $querytotal->select('COUNT(*) as total')
                        ->from('DatPlanificacionporfecha napf')
                        ->addWhere(
                                'napf.idplanificacion = ?', array($params['idplanificacion'])
                        )
                        ->execute()->getFirst()->total;
        foreach ($data->data as $indice => $valor) {
            $data->data[$indice]['cantidad'] = number_format(
                    $valor['cantidad'], '3', '.', ','
            );
        }
        return $data;
    }

    public function adicionar_modif_planifporfecha($params) {

        foreach ($params['desgloses'] as $desglose) {
            if ($desglose->idplanificacionporfecha != null) {
                $objNivActPorFecha = Doctrine::getTable(
                                'DatPlanificacionporfecha'
                        )->find(
                        $desglose->idplanificacionporfecha
                );

                $objNivActPorFecha->cantidad = $desglose->cantidad;
                $objNivActPorFecha->fechainicio = $desglose->fechainicio;
                $objNivActPorFecha->fechafin = $desglose->fechafin;
                $objNivActPorFecha->save();
            } else {
                $objNivActPorFecha = new DatPlanificacionporfecha();
                $objNivActPorFecha->idplanificacion = $params['idplanificacion'];
                $objNivActPorFecha->cantidad = $desglose->cantidad;
                $objNivActPorFecha->fechainicio = $desglose->fechainicio;
                $objNivActPorFecha->fechafin = $desglose->fechafin;
                $objNivActPorFecha->save();
            }
        }
        return '24';
    }

    public function eliminarIndDesgloses($params) {
        //temporal falta el filtrado
        if ($params['desgloses'][0] != null) {
            $query = new Doctrine_Query();
            $query->delete('DatPlanificacionporfecha')
                    ->from('DatPlanificacionporfecha napf')
                    ->addWhere(
                            'napf.idplanificacion = ?', array($params['idplanificacion'])
                    )
                    ->whereIn('napf.idplanificacionporfecha', $params['desgloses'])
                    ->execute();
        }
        return '24';
    }

    public function exportarIndAExcel($params) {

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = ZendExt_GlobalConcept::getInstance()->Perfil->idioma;
        $etiquetas = file_get_contents(
                $dirApps
                . "/planificacion/planmeta/views/idioma/{$idioma}/desgloseporfecha/desgloseporfecha.json"
        );
        unset($idioma);
        unset($dirApps);
        $etiquetas = str_replace("{", "", $etiquetas);
        $etiquetas = str_replace("}", "", $etiquetas);
        $etiquetas = str_replace("\n", "", $etiquetas);
        $etiquetas = str_replace("'", "", $etiquetas);
        $etiquetas = split(",", $etiquetas);
        $arrayEtiq = array();

        foreach ($etiquetas as $key => $valor) {
            $arrayEtiqueta = split(":", $valor);
            $indice = str_replace("\r", "", $arrayEtiqueta[0]);
            $indice = str_replace(" ", "", $indice);
            $arrayEtiq [$indice] = $arrayEtiqueta[1];
            unset($etiquetas[$key]);
        }
        unset($etiquetas);
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=desgloses.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        echo "<tr>\n";
        echo "<th colspan = 5 align=left>Demanda de indicadores</th>";

        echo "</tr>";
        echo "<tr>\n";
        echo '<th>Código</th>';
        echo '<th>Denominación</th>';
        echo '<th>Cantidad planificada</th>';
        echo '<th>Cantidad desglosada</th>';
        echo '<th>Cantidad por desglosar</th>';
        echo "</tr>";
        $params['contar'] = 3;
        $params['listar'] = 2;
        
            $d = self::listarIndEjecsinmodelo($params);
        $cant = $d->total;
        $cantxpag = 10000;
        $cantpag = (int) ($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        unset($cant);
        $offset = 0; //start
        $paso = $cantxpag; //limit
        for ($i = 0; $i < $cantpag; $i++) {
            $params['start'] = $offset;
            $params['limit'] = $paso;
            $params['contar'] = 2;
            $params['listar'] = 3;
                $d = self::listarIndEjecsinmodelo($params);
            $arrayDnaxf = $d->data;
            foreach ($arrayDnaxf as $value) {
                echo "<tr> <td align=right style=\"mso-number-format:'@';\" >"
                . $value['codigo'] . "</td>
             <td align=center >" . $value['denominacion'] . "</td>
             <td align=right>" . number_format($value['cantidad'], '3', '.', ',') . "</td>
             <td align=right>" . number_format($value['cantidadreal'], '3', '.', ',') . "</td>
             <td align=right>" . number_format($value['cantidadpordesglozar'], '3', '.', ',') . "</td>";
            }
            $offset += $paso;
        }
        echo "</table>";
    }

}
