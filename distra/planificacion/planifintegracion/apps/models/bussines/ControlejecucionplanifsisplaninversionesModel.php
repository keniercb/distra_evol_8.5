<?php

class ControlejecucionplanifsisplaninversionesModel extends ControlejecucionplanifModel
{

    //Lista los niveles de actividad mayores que cero dada una entidad y un ejercicio
    public function listarNivelesAct($params)
    {
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
                        if ($datos['field'] == 'nivelactividadfinal') {
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
                            $condiciones[] = $sqlNNA
                                . $datos['data']['value'];
                        } else {
                            if ($datos['field'] == 'nivelactvreal') {
                                $sqlNNA = " SUM(x.nivelactvreal)";
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
                                if ($datos['field'] == 'pendiente') {
                                    $sqlNNA = "COALESCE((SUM(x.nivelactividadfinal) - COALESCE(SUM(x.nivelactvreal),0)),0)";
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
        $Having = "";
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
        $data = DatControlejecucionnivelactividadsisplaninversiones::listarNivelesAct($params, $strEspecialidades, $strEntidades, $WHERE, $offsetLimit, $Having);
        return $data;
    }

}
