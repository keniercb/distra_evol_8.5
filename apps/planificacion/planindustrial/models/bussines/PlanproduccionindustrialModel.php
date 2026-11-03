<?php

class PlanproduccionindustrialModel extends ZendExt_Model {

    public function listarProducciones($params) {
        $result = DatProduccionindustrial::listarProducciones($params);
        return $result;
    }

    public function listarCartatecnologicaAdicionarProducciones($params) {
        $result = DatCartatecindustrial::listarCartatecnologicaAdicionarProducciones($params);
        return $result;
    }

    public function adicionarProducciones($params) {
        $modificados = 0;
        if ($params['identidad'] && $params['idejercicio'] && $params['idcartatecindustrial']) {
            if ($params['idproduccionindustrial']) {
                $objDatProduccionindustrial = Doctrine::getTable('DatProduccionindustrial')->findByDql("idproduccionindustrial = {$params['idproduccionindustrial']}");

                $objDatProduccionindustrial[0]->denominacion = $params['denominacion'];
                $objDatProduccionindustrial[0]->idcartatecindustrial = $params['idcartatecindustrial'];
                $objDatProduccionindustrial[0]->valor = $params['cantidad'];

                $objDatProduccionindustrial[0]->save();
                $modificados = 1;
            } else {
                $objDatProduccionindustrial = new DatProduccionindustrial();

                $objDatProduccionindustrial->identidad = $params['identidad'];
                $objDatProduccionindustrial->idejercicio = $params['idejercicio'];
                $objDatProduccionindustrial->denominacion = $params['denominacion'];
                $objDatProduccionindustrial->idcartatecindustrial = $params['idcartatecindustrial'];
                $objDatProduccionindustrial->valor = $params['cantidad'];
                $objDatProduccionindustrial->idaprobacion = 1;

                $objDatProduccionindustrial->save();
                $modificados = 1;
            }
        }

        return $modificados;
    }

    public function eliminarProducciones($params) {
        $actualizados = 0;
        if ($params['idproduccionindustrial'][0] != null) {
            $idproduccionindustrial_lista = implode(',', $params['idproduccionindustrial']);
            $actualizados = DatProduccionindustrial::eliminarProducciones($idproduccionindustrial_lista);
        }
        return $actualizados;
    }

    public function aprobarProducciones($params) {
        $actualizados = 0;
        if ($params['idproduccionindustrial'][0] != null) {
            $integrator = ZendExt_IoC::getInstance();
            $iddatosnomenclador = $integrator->planmeta->obtenerIdDatosNomEspComp();
            $arrayIddatosnomenclador = array($iddatosnomenclador['demandada'], $iddatosnomenclador['compartida'], $iddatosnomenclador['propia']);
            unset($iddatosnomenclador);
            $datosentidad = $integrator->metadatos->DameEstructura($params['identidad']);
            $params['idespecialidad'] = $datosentidad[0]->idespecialidad;

            foreach ($params['idproduccionindustrial'] as $key => $value) {
                $objDatProduccionindustrial = Doctrine::getTable('DatProduccionindustrial')->findByDql("idproduccionindustrial = {$value}");

                if ($params['idaprobacion'] == 1) {
                    //desaprobar
                    $objDatActividadentidadindustrial = Doctrine::getTable('DatActividadentidadindustrial')->findByDql("idproduccionindustrial={$value}");

                    foreach ($objDatActividadentidadindustrial as $key => $actividadEntidadindustrial) {
                        $objDatActividadentidadindustrial[$key]->delete();
                    }

                    $objDatProduccionindustrial[0]->idaprobacion = $params['idaprobacion'];
                    $objDatProduccionindustrial[0]->save();
                    $actualizados++;
                } else {
                    //aprobar
                    //si tiene valor mayor que 0 se puede aprobar
                    if ($objDatProduccionindustrial[0]->valor > 0) {

                        //si ya estaba aprobada
                        if ($objDatProduccionindustrial[0]->idaprobacion == 3 || $objDatProduccionindustrial[0]->idaprobacion == 4) {
                            $objDatProduccionindustrial[0]->idaprobacion = $params['idaprobacion'];
                            $objDatProduccionindustrial[0]->save();
                            $actualizados++;
                        } else {
                            //obteniendo el objeto cartatecnologicaindustrial
                            $objDatCartatecindustrial = Doctrine::getTable('DatCartatecindustrial')->findByDql("idcartatecindustrial = {$objDatProduccionindustrial[0]->idcartatecindustrial}");
                            $valor = $objDatProduccionindustrial[0]->valor / $objDatCartatecindustrial[0]->cantidad;

                            //obteniendo las actividades de la cartatecnologicaindustrial
                            $objDatCartatecindustrialactividad = Doctrine::getTable('DatCartatecindustrialactividad')->findByDql("idcartatecindustrial = {$objDatProduccionindustrial[0]->idcartatecindustrial}");

                            $contador_actividadesconnorma = 0;
                            foreach ($objDatCartatecindustrialactividad as $actividadCartatec) {
                                $normasenEjercicio = DatNorma::buscarNormasEjercicioAprobacion($actividadCartatec->idactividad, $params['idejercicio']);
                                if (isset($normasenEjercicio[0])) {
                                    $contador_actividadesconnorma ++;
                                }
                            }

                            if ($contador_actividadesconnorma == count($objDatCartatecindustrialactividad)) {
                                foreach ($objDatCartatecindustrialactividad as $actividadCartatec) {
                                    $actEnt = $integrator->planmeta->obtenerIdActividadEntidad($params['identidad'], $actividadCartatec->idactividad, $params['idejercicio'])->getFirst()->idactividadentidad;
                                    if ($actEnt == null || $actEnt == '') {
                                        //craendo relacion activ-ent-ejercicio
                                        $nuevaAsocactent = $integrator->planmeta->crearAsociacionActEnt(
                                                $actividadCartatec->idactividad, $arrayIddatosnomenclador, $params['idespecialidad'], $params['identidad'], $params['idejercicio']
                                        );
                                        $actEnt = $nuevaAsocactent->idactividadentidad;
                                    }

                                    $objDatActividadentidadindustrial = Doctrine::getTable('DatActividadentidadindustrial')->
                                            findByDql("idproduccionindustrial = {$value} AND idcartatecindustrialactividad = {$actividadCartatec->idcartatecindustrialactividad} AND idactividadentidad = {$actEnt}");

                                    $objDatActividadentidadindustrial[0]->idproduccionindustrial = $value;
                                    $objDatActividadentidadindustrial[0]->idcartatecindustrialactividad = $actividadCartatec->idcartatecindustrialactividad;
                                    $objDatActividadentidadindustrial[0]->idactividadentidad = $actEnt;
                                    $objDatActividadentidadindustrial[0]->nivelactividadindustrial = $valor;
                                    $objDatActividadentidadindustrial[0]->save();
                                }
                                $objDatProduccionindustrial[0]->idaprobacion = $params['idaprobacion'];
                                $objDatProduccionindustrial[0]->save();
                                $actualizados++;
                            }
                        }
                    }
                }
            }
        }

        return $actualizados;
    }

    public function exportarProducciones($params) {
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
        echo"<H2 align=left>Entidad: {$params['denoentidad']}</H2>";
        echo"<H2 align=left>Ejercicio: {$params['denoejercicio']}</H2>";
        if ($params['tipo'] == 1) {
            header("Content-Disposition: attachment;filename=producciones.xls");
            echo"<H2 align=center>Producciones</H2>";
        } else
        if ($params['tipo'] == 2) {
            header("Content-Disposition: attachment;filename=actividades_producciones.xls");
            echo"<H2 align=center>Actividades de las producciones</H2>";
        } else
        if ($params['tipo'] == 3) {
            header("Content-Disposition: attachment;filename=datos_producciones.xls");
            echo"<H2 align=center>Datos de la producción</H2>";
        }

        //encabezados
        if ($params['tipo'] == 1) {
            echo "<table border=1 cellspacing=0 width=60%>  
             <th align=center>Denominación</th>
             <th align=center>Carta tecnológica</th>
             <th align=center>Indicador de salida</th>
             <th align=center>UM</th>
             <th align=center>Cantidad</th>
             <th align=center>Aprobado</th>";
            echo "</tr>";
        } else
        if ($params['tipo'] == 2) {
            echo "<table border=1 cellspacing=0 width=60%>  
             <th COLSPAN=6 align=center>Producciones</th>
             <th COLSPAN=5 align=center>Actividades</th>
             </tr>
             <tr>
             <th align=center>Denominación</th>
             <th align=center>Carta tecnológica</th>
             <th align=center>Indicador de salida</th>
             <th align=center>UM</th>
             <th align=center>Cantidad</th>
             <th align=center>Aprobado</th>
             <th align=center>Código</th>
             <th align=center>Denominación</th>
             <th align=center>Descripción</th>
             <th align=center>Estado</th>
             <th align=center>Aprobado</th>
             <th align=center>Nivel de actividad</th>";
            echo "</tr>";
        }

        //Obteniendo los datos
        if ($params['tipo'] == 1 || $params['tipo'] == 2) {
            $datos = PlanproduccionindustrialModel::listarProducciones($params);
            foreach ($datos as $key => $value) {
                echo "<tr>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacion'])) . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacioncarta'] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacionindicador'])) . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $value['valor'] . "</td>";

                if ($value['idaprobacion'] == 4)
                    echo"<td align=center style=\"mso-number-format:'@';\" >" . "Sí" . "</td>";
                else
                    echo"<td align=center style=\"mso-number-format:'@';\" >" . "No" . "</td>";

                if ($params['tipo'] == 2) {
                    //datos de las actividades
                    $params['idproduccionindustrial'] = $value['idproduccionindustrial'];
                    $params['idcartatecindustrial'] = $value['idcartatecindustrial'];
                    $datos_actividades = DatProduccionindustrial::listarActividadesProduccion($params);

                    foreach ($datos_actividades as $key2 => $actividad) {
                        if ($key2 != 0) {
                            echo "<tr>";
                            echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacion'])) . "</td>";
                            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacioncarta'] . "</td>";
                            echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacionindicador'])) . "</td>";
                            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";
                            echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $value['valor'] . "</td>";

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
                        echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $actividad['na'] . "</td>";
                        echo "</tr>";
                    }
                }
            }
        } else
        if ($params['tipo'] == 3) {
            echo"<H4 align=center>Producción</H4>";
            echo "<table border=1 cellspacing=0 width=60%>  
                <th align=center>Denominación</th>
                <th align=center>Carta tecnológica</th>
                <th align=center>Indicador de salida</th>
                <th align=center>UM</th>
                <th align=center>Cantidad</th>
                <th align=center>Aprobado</th>";
            echo "</tr>";

            //datos de la carta tecnologica
            $obj_filtro['field'] = 'idcartatecindustrial';
            $obj_filtro['data']['value'] = $params['idcartatecindustrial'][0];
            $params['filtros'][] = $obj_filtro;
            $params['addWhereProduccion'] = " AND prod.idproduccionindustrial={$params['idproduccionindustrial']} ";
            $datos = PlanproduccionindustrialModel::listarProducciones($params);
            $value = $datos[0];

            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacion'])) . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacioncarta'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($value['denominacionindicador'])) . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idumedida']] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $value['valor'] . "</td>";
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
                    <th align=center>Aprobado</th>
                    <th align=center>Nivel de actividad</th>";
            echo "</tr>";

            $params['idcartatecindustrial'] = $value['idcartatecindustrial'];
            $datos_actividades = DatProduccionindustrial::listarActividadesProduccion($params);
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
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $actividad['na'] . "</td>";
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
                    <th align=center>Importe</th>
                    <th align=center>Demanda</th>
                    <th align=center>Importe de la demnada</th>";
            echo "</tr>";

            $naturalezas = DatBasescalculoModel::obtenerNaturalezas();
            $array_naturalezas = array();
            foreach ($naturalezas as $key => $value) {
                $array_naturalezas[$value['naturaleza']] = $value['denominacion'];
            }
            unset($naturalezas);

            $datos_indicadores = DatProduccionindustrial::obtenerIndicadoresxProduccion($params);

            foreach ($datos_indicadores as $key2 => $indicador) {
                echo "<tr>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $indicador['codigo'] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . str_replace(" ", "&nbsp;", rtrim($indicador['denominacion'])) . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $indicador['precio'] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $array_naturalezas[$indicador['idnaturaleza']] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$indicador['idumedida']] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $indicador['cantidad'] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000';\" >" . round($indicador['importe'], 3) . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000000';\" >" . $indicador['demanda'] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000';\" >" . round($indicador['importedemanda'], 3) . "</td>";

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
