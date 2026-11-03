<?php

class DatNivelactividadporfechasisplaninversionesModel extends DatNivelactividadporfechaModel {

    public function exportarAExcel($params) {
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = ZendExt_GlobalConcept::getInstance()->Perfil->idioma;
        $etiquetas = file_get_contents($dirApps . "/planificacion/planmeta/views/idioma/{$idioma}/desgloseporfecha/desgloseporfecha.json");
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
        echo "<th colspan = 5 align=left>Niveles de actividad</th>";

        echo "</tr>";
        echo "<tr>\n";
        echo '<th>Código</th>';
        echo '<th>Denominación</th>';
        echo '<th>Nivel actividad BP</th>';
        echo '<th>Nivel actividad inversión</th>';
        echo '<th>Nivel actividad proyecto</th>';
        echo '<th>Nivel actividad planificado</th>';
        echo '<th>Nivel actividad desglosado</th>';
        echo '<th>Nivel actividad por desglosar</th>';
        echo "</tr>";
        $d = self::listarNivelesAct($params);

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
            $d = self::listarNivelesAct($params);
            $arrayDnaxf = $d->data;
            foreach ($arrayDnaxf as $value) {
                echo "<tr> <td align=right style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>
             <td align=center >" . $value['denominacion'] . "</td>
             <td align=right>" . number_format($value['nivelactividadbp'], '3', '.', ',') . "</td>
             <td align=right>" . number_format($value['nivelactividadinv'], '3', '.', ',') . "</td>
             <td align=right>" . number_format($value['nivelactividadproy'], '3', '.', ',') . "</td>
             <td align=right>" . number_format($value['nivelactividad'], '3', '.', ',') . "</td>
             <td align=right>" . number_format($value['nivelactividadreal'], '3', '.', ',') . "</td>
             <td align=right>" . number_format($value['nivelactividadpordesglozar'], '3', '.', ',') . "</td>";
            }
            $offset += $paso;
        }
        echo "</table>";
    }

    public function listarNivelesAct($params) {
        $condiciones = array();
        $arraysalida = array_filter($params['id_especialidades']);
        if (empty($arraysalida)) {
            return -1;
        }
        $strEntidades = implode(',', $params['entidades']);
        $strEspecialidades = implode(',', $arraysalida);
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $condic[] = "a.codigo LIKE '" . $datos['data']['value'] . "%'";
                } else {
                    if ($datos['field'] == 'denominacion') {
                        $condic[] = "upper(a.denominacion) LIKE  " . ("'%" . strtoupper($datos['data']['value']) . "%'");
                    } else {
                        if ($datos['field'] == 'nivelactividad') {
                            $sqlNNA = " SUM(x.nivelactividadfinal)";
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
                            if ($datos['field'] == 'nivelactividadreal') {
                                $sqlNNA = " SUM(x.nivelactividadxfecha)";
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
                                if ($datos['field'] == 'nivelactividadpordesglozar') {
                                    $sqlNNA = " COALESCE((SUM(x.nivelactividadfinal) - COALESCE(SUM(x.nivelactividadxfecha), 0)), 0)";
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
                                    if ($datos['field'] == 'nivelactividadbp') {
                                        $sqlNNA = " SUM(x.nivelactividadbp)";
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
                                        if ($datos['field'] == 'nivelactividadinv') {
                                            $sqlNNA = " SUM(x.nivelactividadinv)";
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
                                            if ($datos['field'] == 'nivelactividadproy') {
                                                $sqlNNA = " SUM(x.nivelactividadproy)";
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
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $Having = "having true";
        foreach ($condiciones as $condicion) {
            if ($Having == "") {
                $Having = 'AND ' . $condicion;
            } else {
                $Having = $Having . " AND " . $condicion;
            }
        }

        $WHERE = "";

        foreach ($condic as $co) {
            if ($WHERE == "") {
                $WHERE = 'AND ' . $co;
            } else {
                $WHERE = $WHERE . " AND " . $co;
            }
        }

        if (!$params['start']) {
            $params['start'] = 0;
        }
        if (!$params['limit']) {
            $params['limit'] = 1;
        }
        $offsetLimit = " OFFSET  {$params['start']}
                LIMIT  {$params['limit']}";
        $data = DatNivelactividadporfechasisplaninversiones::listarNivelesAct($params, $strEspecialidades, $strEntidades, $WHERE, $offsetLimit, $Having);
        return $data;
    }

    public function listarNivelactividadporfecha($params) {
        //temporal falta el filtrado
        $query = new Doctrine_Query();
        $querytotal = new Doctrine_Query();
        $addWhere = "";
        $addWhereI = "";
        $addWhereP = "";
        $where="";
        //filtro del tipo afuera afuera WHERE x.tipo = 1

        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'nivelactividad') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $addWhere.=" AND nf.nivelactividad <" . $datos ['data']['value'];
                        $addWhereI.=" AND inf.nivelactividadinversion <" . $datos ['data']['value'];
                        $addWhereP.=" AND enf.nivelactividad <" . $datos ['data']['value'];
                    }
                    if ($datos['data']['comparison'] == 'gt') {
                        $addWhere.=" AND nf.nivelactividad >" . $datos ['data']['value'];
                        $addWhereI.=" AND inf.nivelactividadinversion >" . $datos ['data']['value'];
                        $addWhereP.=" AND enf.nivelactividad >" . $datos ['data']['value'];
                    }
                    if ($datos['data']['comparison'] == 'eq') {
                        $addWhere.=" AND nf.nivelactividad =" . $datos ['data']['value'];
                        $addWhereI.=" AND inf.nivelactividadinversion =" . $datos ['data']['value'];
                        $addWhereP.=" AND enf.nivelactividad =" . $datos ['data']['value'];
                    }
                } else {
                    if ($datos ['field'] == 'fechainicio'
                    ) {
                        $fechainicio = explode('/', $datos ['data']['value']);
                        $fechainicio = $fechainicio[1] . '/' . $fechainicio[0]
                                . '/' . $fechainicio[2];
                        if ($datos['data']['comparison'] == 'lt') {
                            $addWhere.=" AND nf.fechainicio <'" . $fechainicio . "'";
                            $addWhereI.=" AND inf.fechainicio <'" . $fechainicio . "'";
                            $addWhereP.=" AND enf.fechainicio <'" . $fechainicio . "'";
                        }
                        if ($datos['data']['comparison'] == 'gt') {
                            $addWhere.=" AND nf.fechainicio >'" . $fechainicio . "'";
                            $addWhereI.=" AND inf.fechainicio >'" . $fechainicio . "'";
                            $addWhereP.=" AND enf.fechainicio >'" . $fechainicio . "'";
                        }
                        if ($datos['data']['comparison'] == 'eq') {
                            $addWhere.=" AND nf.fechainicio ='" . $fechainicio . "'";
                            $addWhereI.=" AND inf.fechainicio ='" . $fechainicio . "'";
                            $addWhereP.=" AND enf.fechainicio ='" . $fechainicio . "'";
                        }
                    } else {
                        if ($datos ['field'] == 'fechafin') {
                            $fechafin = explode('/', $datos ['data']['value']);
                            $fechafin = $fechafin[1] . '/' . $fechafin[0] . '/'
                                    . $fechafin[2];
                            if ($datos['data']['comparison'] == 'lt') {
                                $addWhere.=" AND nf.fechafin <'" . $fechafin . "'";
                                $addWhereI.=" AND inf.fechafin <'" . $fechafin . "'";
                                $addWhereP.=" AND enf.fechafin <'" . $fechafin . "'";
                            }
                            if ($datos['data']['comparison'] == 'gt') {
                                $addWhere.=" AND nf.fechafin >'" . $fechafin . "'";
                                $addWhereI.=" AND inf.fechafin >'" . $fechafin . "'";
                                $addWhereP.=" AND enf.fechafin >'" . $fechafin . "'";
                            }
                            if ($datos['data']['comparison'] == 'eq') {
                                $addWhere.=" AND nf.fechafin ='" . $fechafin . "'";
                                $addWhereI.=" AND inf.fechafin ='" . $fechafin . "'";
                                $addWhereP.=" AND enf.fechafin ='" . $fechafin . "'";
                            }
                        } else {
                            if ($datos['field'] == 'tipo') {
                                $tipo = array();
                                $tipo = split(",", $datos['data']['value']);
                                $iddatosnom = array();
                                $iddatosnomcad = '';
                                foreach ($tipo as $dat) {
                                    if ($dat == 'Inversión') {
                                        $iddatosnom[] = 2;
                                    }
                                    if ($dat == 'Proyecto') {
                                        $iddatosnom[] =3;
                                    }
                                    if ($dat == 'Bases para el plan') {
                                        $iddatosnom[] = 1;
                                    }
                                }
                                if ($iddatosnom[0]) {
                                    $iddatosnomcad = implode(',', $iddatosnom);
                                    $where="WHERE x.tipo in($iddatosnomcad)";
                                }
                            }
                        }
                    }
                }
            }
        }
        $data = DatNivelactividadporfechasisplaninversiones::listarDesgloseNivelesAct($params, $addWhere, $addWhereI, $addWhereP, $where);
        return $data;
    }

}
