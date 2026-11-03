<?php

class CartatecnologicaindustrialModel extends ZendExt_Model {

    public function listarCartatecnologica($params) {
        $result = DatCartatecindustrial::listarCartatecnologica($params);
        return $result;
    }

    public function listarIndicadoresAdicionarCartatecnologica($params) {
        $result = DatCartatecindustrial::listarIndicadoresAdicionarCartatecnologica($params);
        return $result;
    }

    public function adicionarCartatecnologica($params) {
        $modificados = 0;
        if ($params['idcartatecindustrial']) {
            $objDatCartatecindustrial = Doctrine::getTable('DatCartatecindustrial')->findByDql("idcartatecindustrial = {$params['idcartatecindustrial']}");

            $objDatCartatecindustrial[0]->idindicadorsalida = $params['idindicador'];
            $objDatCartatecindustrial[0]->denominacion = $params['denominacion'];
            $objDatCartatecindustrial[0]->descripcion = $params['descripcion'];
            $objDatCartatecindustrial[0]->cantidad = $params['cantidad'];

            $objDatCartatecindustrial[0]->save();
            $modificados = 1;
        } else {
            $objDatCartatecindustrial = new DatCartatecindustrial();

            $objDatCartatecindustrial->denominacion = $params['denominacion'];
            $objDatCartatecindustrial->descripcion = $params['descripcion'];
            $objDatCartatecindustrial->cantidad = $params['cantidad'];
            $objDatCartatecindustrial->idindicadorsalida = $params['idindicador'];

            $objDatCartatecindustrial->save();
            $modificados = 1;
        }

        return $modificados;
    }

    public function eliminarCartatecnologica($params) {
        $actualizados = 0;
        if ($params['idcartatecindustrial'][0] != null) {
            $idcartatecindustrial_lista = implode(',', $params['idcartatecindustrial']);
            $actualizados = DatCartatecindustrial::eliminarCartatecnologica($idcartatecindustrial_lista);
        }
        return $actualizados;
    }

    public function aprobarCartatecnologica($params) {
        $modificados = 0;
        if ($params['idcartatecindustrial'][0] != null) {
            if ($params['idaprobacion'] == 4) {
                $idcartatecindustrial_arreglo = array();
                foreach ($params['idcartatecindustrial'] as $key => $value) {
                    $params['idcartatecindustrial'] = $value;
                    $data = CartatecnologicaindustrialModel::listarActividadesCartatecnologica($params);

                    if ($data[0] != null) {
                        $idcartatecindustrial_arreglo[] = $value;
                        $modificados++;
                    }
                }

                if ($idcartatecindustrial_arreglo[0] != null) {
                    $idcartatecindustrial_lista = implode(',', $idcartatecindustrial_arreglo);
                    DatCartatecindustrial::aprobarCartatecnologica($idcartatecindustrial_lista, $params);
                }
            } else {
                $idcartatecindustrial_lista = implode(',', $params['idcartatecindustrial']);
                DatCartatecindustrial::aprobarCartatecnologica($idcartatecindustrial_lista, $params);
                $modificados++;
            }
        }

        return $modificados;
    }

    public function listarActividadesCartatecnologica($params) {
        $result = DatCartatecindustrialactividad::listarActividadesCartatecnologica($params);
        return $result;
    }

    public function listarActividadesAdicionarActividadesCartatecnologica($params) {
        $result = DatCartatecindustrialactividad::listarActividadesAdicionarActividadesCartatecnologica($params);
        return $result;
    }

    public function adicionarActividadesCartatecnologica($params) {
        $modificados = 0;
        foreach ($params['idactividades'] as $valorIdactividad) {
            if ($valorIdactividad != null) {
                $objDatCartatecindustrialactividad = new DatCartatecindustrialactividad();
                $objDatCartatecindustrialactividad->idcartatecindustrial = $params['idcartatecindustrial'];
                $objDatCartatecindustrialactividad->idactividad = $valorIdactividad;
                $objDatCartatecindustrialactividad->save();
                $modificados = 1;
            }
        }

        return $modificados;
    }

    public function eliminarActividadesCartatecnologica($params) {
        $actualizados = 0;
        if ($params['idactividades'][0] != null) {
            $idactividades_lista = implode(',', $params['idactividades']);
            $actualizados = DatCartatecindustrialactividad::eliminarActividadesCartatecnologica($idactividades_lista);
        }
        return $actualizados;
    }

    public function exportarCartatecnologica($params) {
        //Ajustando los parámetros de los filtros al formato 'listar'
        $nuevos_filtros = array();
        foreach ($params['filtros'] as $filtro) {
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
        $params['filtros'] = $nuevos_filtros;
        //Fin de los filtros
        //UM
        $params['array_um'] = array();
        foreach ($params['um'] as $valorUM) {
            $params['array_um'][$valorUM['idunidadmedida']] = $valorUM['abreviaturaunidadmedida'];
        }
        unset($params['um']);

        //Creando el encabezado
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; '
        . 'charset=utf-8"></HEAD><BODY>';

        if ($params['tipo'] == 1) {
            header("Content-Disposition: attachment;filename=cartas_tecnologicas.xls");
            echo"<H2 align=center>Cartas tecnológicas</H2>";
        } else
        if ($params['tipo'] == 2) {
            header("Content-Disposition: attachment;filename=actividades_cartas_tecnologicas.xls");
            echo"<H2 align=center>Actividades de las cartas tecnológicas</H2>";
        } else
        if ($params['tipo'] == 3) {
            header("Content-Disposition: attachment;filename=datos_cartas_tecnologicas.xls");
            echo"<H2 align=center>Datos de la carta tecnológica</H2>";
        }

        //encabezados
        if ($params['tipo'] == 1) {
            echo "<table border=1 cellspacing=0 width=60%>  
             <th align=center>Denominación</th>
             <th align=center>Descripción</th>
             <th align=center>Indicador de salida</th>
             <th align=center>UM</th>
             <th align=center>Cantidad</th>
             <th align=center>Aprobado</th>";
            echo "</tr>";
        } else
        if ($params['tipo'] == 2) {
            echo "<table border=1 cellspacing=0 width=60%>  
             <th COLSPAN=6 align=center>Cartas tecnológicas</th>
             <th COLSPAN=5 align=center>Actividades</th>
             </tr>
             <tr>
             <th align=center>Denominación</th>
             <th align=center>Descripción</th>
             <th align=center>Indicador de salida</th>
             <th align=center>UM</th>
             <th align=center>Cantidad</th>
             <th align=center>Aprobado</th>
             <th align=center>Código</th>
             <th align=center>Denominación</th>
             <th align=center>Descripción</th>
             <th align=center>Estado</th>
             <th align=center>Aprobado</th>";
            echo "</tr>";
        }

        //Obteniendo los datos
        if ($params['tipo'] == 1 || $params['tipo'] == 2) {
            $datos = CartatecnologicaindustrialModel::listarCartatecnologica($params);
            foreach ($datos as $key => $value) {
                echo "<tr>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacion'])) . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['descripcion'] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacionindicador'])) . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $value['cantidad'] . "</td>";

                if ($value['idaprobacion'] == 4)
                    echo"<td align=center style=\"mso-number-format:'@';\" >" . "Sí" . "</td>";
                else
                    echo"<td align=center style=\"mso-number-format:'@';\" >" . "No" . "</td>";

                if ($params['tipo'] == 2) {
                    //datos de las actividades
                    $params['idcartatecindustrial'] = $value['idcartatecindustrial'];
                    $datos_actividades = CartatecnologicaindustrialModel::listarActividadesCartatecnologica($params);
                    foreach ($datos_actividades as $key2 => $actividad) {
                        if ($key2 != 0) {
                            echo "<tr>";
                            echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacion'])) . "</td>";
                            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['descripcion'] . "</td>";
                            echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacionindicador'])) . "</td>";
                            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";
                            echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $value['cantidad'] . "</td>";

                            if ($value['idaprobacion'] == 4)
                                echo"<td align=center style=\"mso-number-format:'@';\" >" . "Sí" . "</td>";
                            else
                                echo"<td align=center style=\"mso-number-format:'@';\" >" . "No" . "</td>";
                        }
                        echo"<td align=left style=\"mso-number-format:'@';\" >" . $actividad['codigo'] . "</td>";
                        echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($actividad['denominacion'])) . "</td>";
                        echo"<td align=left style=\"mso-number-format:'@';\" >" . $actividad['descripcion'] . "</td>";

                        if ($value['estado'] == 1)
                            echo"<td align=center style=\"mso-number-format:'@';\" >" . "Sí" . "</td>";
                        else
                            echo"<td align=center style=\"mso-number-format:'@';\" >" . "No" . "</td>";

                        if ($value['idaprobacion'] == 4)
                            echo"<td align=center style=\"mso-number-format:'@';\" >" . "Rector" . "</td>";
                        else if ($value['idaprobacion'] == 3)
                            echo"<td align=center style=\"mso-number-format:'@';\" >" . "Especialista" . "</td>";
                        else
                            echo"<td align=center style=\"mso-number-format:'@';\" >" . "No" . "</td>";
                        echo "</tr>";
                    }
                }
            }
        } else
        if ($params['tipo'] == 3) {
            echo"<H4 align=center>Carta tecnológica</H4>";
            echo "<table border=1 cellspacing=0 width=60%>  
                <th align=center>Denominación</th>
                <th align=center>Descripción</th>
                <th align=center>Indicador de salida</th>
                <th align=center>UM</th>
                <th align=center>Cantidad</th>
                <th align=center>Aprobado</th>";
            echo "</tr>";

            //datos de la carta tecnologica
            $obj_filtro['field'] = 'idcartatecindustrial';
            $obj_filtro['data']['value'] = $params['idcartatecindustrial'][0];
            $params['filtros'][] = $obj_filtro;
            $datos = CartatecnologicaindustrialModel::listarCartatecnologica($params);
            $value = $datos[0];

            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacion'])) . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['descripcion'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacionindicador'])) . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $value['cantidad'] . "</td>";
            if ($value['idaprobacion'] == 4)
                echo"<td align=center style=\"mso-number-format:'@';\" >" . "Sí" . "</td>";
            else
                echo"<td align=center style=\"mso-number-format:'@';\" >" . "No" . "</td>";
            echo "</tr>";

            echo "</table>\n";

            //datos de las actividades
            echo"<H4 align=center>Actividades</H4>";
            echo "<table border=1 cellspacing=0 width=60%>  
                    <th align=center>Código</th>
                    <th align=center>Denominación</th>
                    <th align=center>Descripción</th>
                    <th align=center>Estado</th>
                    <th align=center>Aprobado</th>";
            echo "</tr>";

            $params['idcartatecindustrial'] = $value['idcartatecindustrial'];
            $datos_actividades = CartatecnologicaindustrialModel::listarActividadesCartatecnologica($params);
            foreach ($datos_actividades as $key2 => $actividad) {
                echo "<tr>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $actividad['codigo'] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($actividad['denominacion'])) . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $actividad['descripcion'] . "</td>";

                if ($value['estado'] == 1)
                    echo"<td align=center style=\"mso-number-format:'@';\" >" . "Sí" . "</td>";
                else
                    echo"<td align=center style=\"mso-number-format:'@';\" >" . "No" . "</td>";

                if ($value['idaprobacion'] == 4)
                    echo"<td align=center style=\"mso-number-format:'@';\" >" . "Rector" . "</td>";
                else if ($value['idaprobacion'] == 3)
                    echo"<td align=center style=\"mso-number-format:'@';\" >" . "Especialista" . "</td>";
                else
                    echo"<td align=center style=\"mso-number-format:'@';\" >" . "No" . "</td>";
                echo "</tr>";
            }

            echo "</table>\n";

            //datos de los indicadores en la norma
            echo"<H4 align=center>Indicadores</H4>";
            echo "<table border=1 cellspacing=0 width=60%> 
                    <th align=center>Código</th>
                    <th align=center>Denominación</th>
                    <th align=center>Precio</th>
                    <th align=center>Naturaleza</th>
                    <th align=center>UM</th>
                    <th align=center>Cantidad</th>
                    <th align=center>Importe</th>";
            echo "</tr>";

            $naturalezas = DatBasescalculoModel::obtenerNaturalezas();
            $array_naturalezas = array();
            foreach ($naturalezas as $key => $value) {
                $array_naturalezas[$value['naturaleza']] = $value['denominacion'];
            }
            unset($naturalezas);
            $datos_indicadores = DatCartatecindustrialactividad::obtenerIndicadoresxCarta($params);
            foreach ($datos_indicadores as $key2 => $indicador) {
                echo "<tr>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $indicador['codigo'] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($indicador['denominacion'])) . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $indicador['precio'] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $array_naturalezas[$indicador['idnaturaleza']] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$indicador['idumedida']] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $indicador['cantidad'] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000';\" >" . round($indicador['importe'], 3) . "</td>";

                echo "</tr>";
            }
            unset($array_naturalezas);

            echo "</table>\n";
            //datos de los cargos
            echo"<H4 align=center>Cargos</H4>";
            echo "<table border=1 cellspacing=0 width=60%> 
                    <th align=center>Denominación</th>
                    <th align=center>Cantidad</th>
                    <th align=center>Duración en horas</th>";
            echo "</tr>";

            $integrator = ZendExt_IoC::getInstance();
            $cargos = $integrator->metadatos->buscarCargo("", null, 0);

            $array_cargos = array();
            foreach ($cargos as $key => $value) {
                $array_cargos[$value['idnomcargo']] = $value['denominacion'];
            }
            unset($integrator);
            unset($cargos);


            $datos_cargos = DatCartatecindustrialactividad::obtenerCargosxCarta($params);
            foreach ($datos_cargos as $key2 => $cargo) {
                echo "<tr>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $array_cargos[$cargo['idcargo']] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $cargo['cantidad'] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $cargo['duracion'] . "</td>";

                echo "</tr>";
            }
            unset($array_cargos);

            echo "</table>\n";

            //datos de los activos
            echo"<H4 align=center>Activos</H4>";
            echo "<table border=1 cellspacing=0 width=60%> 
                    <th align=center>Código</th>
                    <th align=center>Denominación</th>
                    <th align=center>Cantidad</th>";
            echo "</tr>";

            $datos_activos = DatCartatecindustrialactividad::obtenerActivosxCarta($params);
            foreach ($datos_activos as $key2 => $activo) {
                echo "<tr>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $activo['codigo'] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($activo['denominacion'])) . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $activo['cantidad'] . "</td>";
                echo "</tr>";
            }

            echo "</table>\n";
        }

        echo "</table>\n";
        echo"<H6 align=right> <br/>";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

}
