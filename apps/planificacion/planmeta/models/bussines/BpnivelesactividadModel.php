<?php

class BpnivelesactividadModel extends ZendExt_Model {

    public function listarNivelesActividad($params) {
        $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
        $params ['nivel'] = $arrayResFormatoUltimonivel[1];

        if ($params['glob'] == 'true' && $params['hoja'] == 'false') {
            //se consolida
            $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
            $entidades = implode(',', $entidades);
        } else {
            //no se consolida
            $entidades = $params['identidad'];
        }
        $params['identidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($entidades);
        if ($params['identidades'][0] == null || $params['identidades'][0] == '' || !$params['identidades'][0]) {
            //no hay entidades OD
            $data->data = array();
            $data->total = 0;
            return $data;
        } else {
            $integrator = ZendExt_IoC::getInstance();
            $params['idespecialidades'] = array();
            foreach ($params['identidades'] as $valor) {
                $datosEntidad = $integrator->metadatos->DameEstructura($valor);
                //la especialidad aun no esta en $params['idespecialidades']
                if (!in_array($datosEntidad [0]->idespecialidad, $params['idespecialidades']))
                    $params['idespecialidades'][] = $datosEntidad [0]->idespecialidad;
            }
            $params['identidades'] = implode(',', $params['identidades']);
            $params['idespecialidades'] = implode(',', $params['idespecialidades']);
        }
        return DatActividadentidad::listarNivelesActividad($params);
    }

    public function modificarNivelesActividad($params) {
        $iddatosnomenclador = DatActespcomportamiento::obtenerIdDatosNom();
        $arrayIddatosnomenclador = array($iddatosnomenclador['demandada'],
            $iddatosnomenclador['compartida'],
            $iddatosnomenclador['propia']);
        unset($iddatosnomenclador);
        foreach ($params['actividades'] as $nivactividad) {
            $ajuste = null;
            //me interesa automatico y manual
            $asocActentalmacenado = DatActividadentidad::buscarXEjercicio($params['identidad'], $nivactividad->idactividad, $params['idejercicio'], true, true, false)->getFirst();
            switch ($nivactividad->campo_modif) {
                case'nivelManual':
                    $nivelactividadmanual = round(doubleval($nivactividad->nivelactividadmanual), 4);
                    /* Adicionar o actualizar */
                    if ($asocActentalmacenado->DatActividadentidadmanual->idactividadentidad == null || $asocActentalmacenado->DatActividadentidadmanual->idactividadentidad == '') {
                        /* Adicionar */
                        $flujo = 'add';
                        $nuevaAsocactent = $this->crearAsociacionActEnt($nivactividad->idactividad, $arrayIddatosnomenclador, $params['espcomp'], $params['identidad'], $params['idejercicio'], $params['idusuario']);
                        $nuevaAsocactentmanual = new DatActividadentidadmanual();
                        $nuevaAsocactentmanual->idactividadentidad = $nuevaAsocactent->idactividadentidad;
                        $nuevaAsocactentmanual->nivelactividadmanual = $nivelactividadmanual;
                        $nuevaAsocactentmanual->save();
                    } else {
                        /* Actualizar */
                        $flujo = 'act';
                        $asocActentalmacenado->idusuario = $params['idusuario'];
                        $asocActentalmacenado->fecha = null;
                        $asocActentalmacenado->save();
                        $asocActentalmacenado->DatActividadentidadmanual->nivelactividadmanual = $nivelactividadmanual;
                        $asocActentalmacenado->DatActividadentidadmanual->save();
                    }
                    break;

                case 'ajuste':
                    $ajuste = round(doubleval($nivactividad->ajuste), 4);
                    if (is_a($asocActentalmacenado, DatActividadentidad)) {
                        $asocActentalmacenado->idusuario = $params['idusuario'];
                        $asocActentalmacenado->fecha = null;
                        $asocActentalmacenado->ajuste = $ajuste;
                        $asocActentalmacenado->save();
                    }
                    break;
            }
            if (is_a($asocActentalmacenado, DatActividadentidad)) {
                $asocActentalmacenado->free();
            }
            /* Actualizar actividades asociadas por automatico */
            $this->actualizarAsociacionesAutomaticas($nivactividad->idactividad, $params['identidad'], $params['espcomp'], $arrayIddatosnomenclador, $params['idejercicio'], $params['idusuario']);
        }
        return true;
    }

    //Utilizado como servicio
    public function crearAsociacionActEnt($idactividad, $arrayIddatosnomenclador, $idespecialidadDemandante, $identidad, $idejercicio, $idusuario) {
        $de = Doctrine_Manager::getInstance();
        $conn = $de->getCurrentConnection();
        $nuevaAsocactent = new DatActividadentidad();
        $nuevaAsocactent->idactespcomportamiento = DatActespcomportamiento::buscarActEspDemandante($idactividad, $arrayIddatosnomenclador, $idespecialidadDemandante)->getFirst()->idactespcomportamiento;
        $nuevaAsocactent->identidad = $identidad;
        $nuevaAsocactent->idactividad = $idactividad;
        $nuevaAsocactent->idejercicio = $idejercicio;
        $nuevaAsocactent->idusuario = $idusuario;
        $nuevaAsocactent->save();
        $conn->commit();
        $conn->beginTransaction();
        return $nuevaAsocactent;
    }

    //Utilizado como servicio
    public function actualizarAsociacionesAutomaticas($idactividadGeneradora, $identidad, $idespecialidadDemandante, $arrayIddatosnomenclador, $idejercicio, $idusuario) {
        $reglaModel = new DatReglaModel();
        $arrayreglas = $reglaModel->buscarActividadesRelacionadasPorReglasAUnaActiv($idactividadGeneradora, $idejercicio, $idespecialidadDemandante, true);
        if (count($arrayreglas)) {
            foreach ($arrayreglas as $regla) {
                $actividadEntidad = DatActividadentidad::buscarXEjercicio(
                                $identidad, $regla['idactividaddestino'], $idejercicio, true, true, true
                        )->getFirst();
                if (!$actividadEntidad) {
                    $actividadEntidad = new DatActividadentidad();

                    $actividadEntidad->idactespcomportamiento = DatActespcomportamiento::buscarActEspDemandante(
                                    $regla['idactividaddestino'], $arrayIddatosnomenclador, $idespecialidadDemandante
                            )->getFirst()->idactespcomportamiento;

                    $actividadEntidad->identidad = $identidad;
                    $actividadEntidad->idusuario = $idusuario;
                    $actividadEntidad->idactividad = $regla['idactividaddestino'];
                    $actividadEntidad->idejercicio = $idejercicio;
                }
                if (!$actividadEntidad->DatActividadentidadautomatico->idregla) {

                    $actividadEntidad->DatActividadentidadautomatico = new DatActividadentidadautomatico();
                    $actividadEntidad->DatActividadentidadautomatico->idregla = $regla['idregla'];
                }

                $var = DatActividadentidadautomatico::getNivelAutomatico(
                                $regla['idactividaddestino'], $idejercicio, $identidad
                );
                $actividadEntidad->DatActividadentidadautomatico->nivelactividadautomatico = $var[0];
                $actividadEntidad->save();

                $this->actualizarAsociacionesAutomaticas(
                        $regla['idactividaddestino'], $identidad, $idespecialidadDemandante, $arrayIddatosnomenclador, $idejercicio
                );
            }
        }
    }

    public function aprobarDesaprobarNivelTodos($params) {
        //si no es una hoja se buscan las entidades
        //hijas que sean organos demandantes
        if ($params['hoja'] == 'false') {
            $arrenthijas = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
            $arrenthijas[] = $params['identidad'];
            $arrenthijas = implode(',', $arrenthijas);
            $entidadesOd = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($arrenthijas);
            $strarrayentidades = implode(',', $entidadesOd);
        } else {
            //si es hoja solo se usa la entidad seleccionada
            $strarrayentidades = $params['identidad'];
        }
        //preparar los parametros para la llamada a las funciones
        $strarrayentidades = "{" . $strarrayentidades . "}";
        $arrayParametros = array();
        $conn = Doctrine_Manager::connection();
        $arrayParametros[0] = $strarrayentidades;
        $arrayParametros[1] = $params['idejercicio'];
        $arrayParametros[2] = $params['idaprobacion'];

        //aprobar del especialista solo
        //aprobara/desaprobara los niveles de actividad
        if ($params['esrector'] == 'false') {
            $query = "select * from mod_planificacion.f_aprobartodoslosniveles(?,?,?)";
        } else {
            //aprobar del rector aprobara/desaprobara
            //los niveles de actividad o los ajustes
            $query = "select * from mod_planificacion.f_aprobartodoslosnivelesrector(?,?,?)";
        }
        $res = $conn->execute($query, $arrayParametros);
        $result = $res->fetchAll();
        if ($params['esrector'] == 'false') {

            return ($result[0]['f_aprobartodoslosniveles'] );
        } else {
            return ($result[0]['f_aprobartodoslosnivelesrector'] );
        }
    }

    public function aprobarDesaprobarNivel($params) {

        if ($params['actividades'][0] != null) {
            $queryUpdate = Doctrine_Query::create();
            $queryUpdate->update("DatActividadentidad")->set(
                    "idaprobacion", $params['idaprobacion']
            )->whereIn('idactividad', $params['actividades'])->addWhere(
                    'identidad = ? AND idejercicio=?', array($params['identidad'], $params['idejercicio'])
            );
//
            $queryUpdate->execute();
        }

        return true;
    }

    public function exportarAExcel($params) {
        //cargando etiquetas
        $params['array_etiq'] = FuncionesGlobalesModel::cargarEtiquetas('bpnivelesactividad');
        //indica que es el exportar para que no ponga offset y limit
        $params['exportar'] = 1;
        //Ajustando los parámetros de los filtros al formato 'listar'
        $nuevos_filtros = [];
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

        //obtener los modelos
        $arraymodelos = array();
        if ($params['tipo'] == 1) {
            $modelos = DatEntidadmodelo::servBP_getModeloAsocEntidad($params['identidad']);
            foreach ($modelos as $k => $valor) {
                $arraymodelos[$valor ['idmodelo']] = $valor ['denominacion'];
            }
            unset($modelos);
        } else {
            //si es con desgloses se exporta de un solo modelo
            $arraymodelos[$params['idmodelo']] = $params['modelo'];
        }

        //preparando excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        if ($params['tipo'] == 1) {
            header('Content-Disposition: attachment;filename=Niveles.xls');
        } else {
            header('Content-Disposition: attachment;filename=NivelesConDesglose.xls');
        }
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";

        //titulo
        echo "<H2 align=left>Niveles de actividad de la entidad: {$params['text']}</H2>";
        echo "</tr>";
        //columnas
        echo '<th>' . $params['array_etiq']['lbCodigo'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbDenominacion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbDescripcion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNivelAutomatico'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNivelManual'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNivelActividad'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbAjuste'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNAAjustado'] . '</th>'; //
        echo '<th>' . $params['array_etiq']['lbAprobacion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbPlan'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbImporte'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbImporteAjustado'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbImporteFinal'] . '</th>';
        //columnas dinamicas a mostrar
        if ($params['tipo'] == 2) {
            echo '<th align=left>' . $params['array_etiq']['lbNivelActividad'] . '</th>';
            $columnasDinam = NomTipomodelo::getColumnasDinamicasSegunModelo($params['idmodelo']);
            foreach ($columnasDinam as $value) {
                //$encabezado .= "<th align=left>" . $value['etiqueta'] . "</th>";
                echo '<th align=left>' . $value['etiqueta'] . '</th>';
            }
        }
        echo "</tr>";

        //Obteniendo los datos
        $datos = BpnivelesactividadModel::listarNivelesActividad($params);

        //Mostrando los datos
        foreach ($datos->data as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacion'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['descripcion'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['nivelactividadautomatico'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['nivelactividadmanual'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['nivelactividad'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['ajuste'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['nivelactividadfinal'] . "</td>";
            //mostrar la aprobacion
            if ($value['idaprobacion'] == 1) {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_etiq']['lbNo'] . "</td>";
            } elseif ($value['idaprobacion'] == 3) {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_etiq']['lbSi'] . "</td>";
            } elseif ($value['idaprobacion'] == 4) {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_etiq']['lbRector'] . "</td>";
            } elseif ($value['idaprobacion'] == 5) {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $params['array_etiq']['lbAjuste'] . "</td>";
            }
            if ($value['idmodelo']) {
                echo "<td align=left style=\"mso-number-format:'@';\" >" . $arraymodelos[$value['idmodelo']] . "</td>";
            } else {
                echo "<td align=left style=\"mso-number-format:'@';\" >" . "-" . "</td>";
            }
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importe'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importeajuste'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importefinal'] . "</td>";

            //si se va a exportar con desgloses
            if ($params['tipo'] == 2) {
                $params['idactividad'] = $value['idactividad'];
                $result = DatActividadentidad::getDatosDesgloseActividad($params);
                foreach ($result as $key => $valor) {
                    echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $valor['nivelactivdesglosado'] . "</td>";
                    $denomDatos = explode(',', $valor['denominacion']);
                    foreach ($denomDatos as $den) {
                        echo"<td align=left style=\"mso-number-format:'@';\" >" . $den . "</td>";
                    }
                }
            }
            echo "</tr>";
        }
        echo " <tr >
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> Importe Total: </th>

             <th align=right style=\"mso-number-format:'#,##0.000000';\">" . $value['importetotal'] . "</th>
             <th align=right style=\"mso-number-format:'#,##0.000000';\">" . $value['importeajustetotal'] . "</th>
             <th align=right style=\"mso-number-format:'#,##0.000000';\">" . $value['importefinaltotal'] . "</th>
             </tr>";
        echo "</table>\n";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

    public function verDetalles($params) {
        //cargando etiquetas
        /*         * ***Ver si este metodo se puedo poner
         * en un lugar global para ser usado por varios */
        $params['array_etiq'] = FuncionesGlobalesModel::cargarEtiquetas('bpnivelesactividad');
        //preparando aprobacion
        $arrayAprobaciones[1] = $params['array_etiq']['lbNo'];
        $arrayAprobaciones[2] = $params['array_etiq']['lbNo'];
        $arrayAprobaciones[3] = $params['array_etiq']['lbSi'];
        $arrayAprobaciones[4] = $params['array_etiq']['lbRector'];

        //obteniendo unidades de medida
        $UnidadMed = $params['integrator']->datosmaestros->listarUnidadesMedidaTodas();

        $arrayUms = array();
        foreach ($UnidadMed as $um) {
            $arrayUms[$um ['idunidadmedida']] = $um ['denominacionunidadmedida'];
        }
        unset($UnidadMed);

        //obteniendo centros de balance
        $CentroBalance = ComportamientoEntidaddinamicoModel::listarCentroBalance();
        $arrayCb = array();
        foreach ($CentroBalance as $cb) {
            $arrayCb[$cb ['idcentrobalance']] = $cb ['centrobalance'];
        }
        unset($CentroBalance);

        //preparando excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header('Content-Disposition: attachment;filename=Detalles_actividad.xls');
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        //titulo
        echo "<H2 align=left>{$params['text']}</H2>";
        echo "<H2 align=left>Detalles de la actividad : {$params['actividad']}</H2>";
        echo "<table border=1>\n";
        echo "<H3 align=left>{$params['array_etiq']['lbComparte']}</H3>";
        echo "</tr>";
        //columnas

        echo '<th align=left>' . $params['array_etiq']['lbEspecialidad'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbEntidad'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNivelActividad'] . '</th>';
        echo "</tr>";

        //Obteniendo los datos
        $datos = NomActividadModel::listarCompartida($params);

        //Mostrando los datos
        foreach ($datos->data as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacionespecialidad'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacionentidad'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['nivel'] . "</td>";
            echo "</tr>";
        }
        echo "</table>\n";

        echo "<table border=1>\n";
        echo "<H3 align=left>{$params['array_etiq']['lbNormas']}</H3>";
        echo "</tr>";

        //columnas
        echo '<th align=left>' . $params['array_etiq']['lbCodigo'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNroPieza'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbDenominacion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbUnidadMedida'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbPreciomn'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbPreciomlc'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbActivado'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbAprobado'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNivelPlanificacion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbCentroBalance'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNorma'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbBase'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNecesidad'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbImporteMN'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbImportemlc'] . '</th>';
        echo "</tr>";

        //Obteniendo los datos
        $datosNormas = DatNorma::listarNormasDeActividad($params);

        //Mostrando los datos
        foreach ($datosNormas->data as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['numeropieza'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacion'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $arrayUms[$value['idumedida']] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['precio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['preciodivisa'] . "</td>";
            if ($value['estado'] == 1) {
                echo"<td align=left style=\"mso-number-format:'@';\" > Sí </td>";
            } else {
                echo"<td align=left style=\"mso-number-format:'@';\" > No </td>";
            }
            echo "<td align=center  style=\"mso-number-format:'@';\" >" . $arrayAprobaciones[$value['idaprobacion']] . "</td>\n";
            if ($value['nivelplanif'] == 1) {
                echo"<td align=left style=\"mso-number-format:'@';\" > Sí </td>";
            } else {
                echo"<td align=left style=\"mso-number-format:'@';\" > No </td>";
            }
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $arrayCb[$value['idcentrobalance']] . "</td>\n";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantplanif'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['cantbase'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['necesidad'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importe'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importedivisa'] . "</td>";
            echo "</tr>";
        }
        echo " <tr >
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> </th>
             <th align=left> Importe Total: </th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importetotal'] . "</th>
             <th align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importedivisatotal'] . "</th>
             </tr>";
        echo "</table>\n";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

    public function verCalculosySalidas($params) {
        //cargando etiquetas
        $params['array_etiq'] = FuncionesGlobalesModel::cargarEtiquetas('bpnivelesactividad');

        //preparando aprobacion
        $arrayAprobaciones[1] = $params['array_etiq']['lbNo'];
        $arrayAprobaciones[2] = $params['array_etiq']['lbNo'];
        $arrayAprobaciones[3] = $params['array_etiq']['lbSi'];
        $arrayAprobaciones[4] = $params['array_etiq']['lbRector'];

        //si esta marcado el global se buscan las entidades
        //hijas que sean organos demandantes
        if ($params['global'] == 'true') {
            $arrenthijas = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
            $arrenthijas[] = $params['identidad'];
            $arrenthijas = implode(',', $arrenthijas);
            $params['entidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($arrenthijas);
        } else {
            //si es hoja solo se usa la entidad seleccionada
            $params['entidades'][] = $params['identidad'];
        }

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=verCalculosySalidas.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        //titulo
        echo "<H2 align=left>{$params['text']}</H2>";

        //pintar la tabla de los calculos
        echo "<H2 align=left>Cálculos</H2>";
        echo "<table border=1>\n";
        echo "</tr>";

        //columnas
        $params['tipo'] = 1;
        BpnivelesactividadModel::pintarColumnas($params);
        echo "</tr>";

        //buscar los datos para los calculos
        $datos = DatBasescalculoModel::exportarCalculoOSalida($params);
        BpnivelesactividadModel::pintarDatos($datos);

        //pintar la tabla de las salidas
        echo "<H2 align=left>Salidas</H2>";
        echo "<table border=1>\n";
        echo "</tr>";
        //columnas
        $params['tipo'] = 2;
        BpnivelesactividadModel::pintarColumnas($params);
        echo "</tr>";
        //buscar los datos para las salidas
        $datossalida = DatBasescalculoModel::exportarCalculoOSalida($params);

        BpnivelesactividadModel::pintarDatos($datossalida);
    }

    public function pintarColumnas($params) {
        echo '<th align=left>' . $params['array_etiq']['lbCodigoactividad'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbDenominacionactividad'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbNivelActividad'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbCodigo'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbDenominacion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbUnidadMedida'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbPlan'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbPreciomn'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbPreciomlc'] . '</th>';
        if ($params['tipo'] == 1) {
            //normas
            echo '<th align=left>' . $params['array_etiq']['lbNecesidad'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbImporteMN'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbImportemlc'] . '</th>';
        } else {
            //salidas
            echo '<th align=left>' . $params['array_etiq']['lbNecesidadSalida'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbImporteMNSalida'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbImportemlcSalida'] . '</th>';
        }
    }

    public function pintarDatos($datos) {
        $importePorAct = 0;
        $importePorActMlc = 0;
        $importeTotal = 0;
        $importeTotalMlc = 0;
        foreach ($datos->data as $k => $value) {
            if ($datos->data[$k - 1]['codactividad'] != $value['codactividad']) {
                if ($k != 0) {
                    echo " <tr> <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th>Importe total por actividad:</th>
                            <th align=right>" . $importePorAct . "</th>
                            <th align=right>" . $importePorActMlc . "</th>
                            </tr>";
                }
                $importePorAct = 0;
                $importePorActMlc = 0;
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codactividad'] . "</td>";
                echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denomactividad'] . "</td>";
                echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['nivelactividad'] . "</td>";
            } else {
                echo "<tr>
                    <td align=left><font color=white>'</font>-<font color=white>'</font></td>
                    <td align=left><font color=white>'</font>-<font color=white>'</font></td>
                    <td align=left><font color=white>'</font>-<font color=white>'</font></td>";
            }
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacion'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['abrevum'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacionmod'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['precio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['preciodivisa'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['necesidadredondeada'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importe'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.000';\">" . $value['importemlc'] . "</td>";

            $importePorAct += $value['importe'];
            $importePorActMlc += $value['importemlc'];
            $importeTotal += $value['importe'];
            $importeTotalMlc += $value['importemlc'];
        }
        echo "<tr>   <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th>Importe total por actividad:</th>
                            <th align=right>" . $importePorAct . "</th>
                            <th align=right>" . $importePorActMlc . "</th>
                </tr> ";
        echo "<tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
             <th>Importe Total:</th>
             <th align=right>" . $importeTotal . "</th>
             <th align=right>" . $importeTotalMlc . "</th>
            </tr>
</table>";
    }

    public function copiarPegarNiveles($params) {
        $arrayParametros = array();
        $conn = Doctrine_Manager::connection();
        $arrayParametros[0] = $params['idejercicio'];
        $arrayParametros[1] = $params['identidadorigen'];
        $arrayParametros[2] = $params['identidaddestino'];
        $arrayParametros[3] = $params['idesp_ident_origen'];
        $arrayParametros[4] = $params['idesp_ident_destino'];

        $query = "select * from mod_planificacion.f_copiarpegarniveles(?,?,?,?,?)";

        $res = $conn->execute($query, $arrayParametros);
        $result = $res->fetchAll();

        if ($result[0]['f_copiarpegarniveles']) {
            return 1;
        } else {
            return 2;
        }
    }

    /* Metodos del ajustar multiple y todos */

    public function cargarImporteInicial($params) {
        $res = implode(",", $params['arrayidactividad']);

        if ($params['arrayidactividad']) {
            $paramsQuery = array($res, $params['idejercicio'], $params['identidad']);
        } else {
            $paramsQuery = array(null, $params['idejercicio'], $params['identidad']);
        }
        $query = "select * from mod_planificacion.f_calcimporteinicial(?,?,?);";
        $conn = Doctrine_Manager::connection();

        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            return $result[0]['f_calcimporteinicial'];
        } else {
            return '23';
        }
    }

    public function calcularAjuste($params) {
        $res = implode(",", $params['arrayidactividad']);
        if ($params['arrayidactividad']) {
            $paramsQuery = array($res, $params['idejercicio'], $params['identidad'], $params['porcientoajuste']);
        } else {
            $paramsQuery = array(null, $params['idejercicio'], $params['identidad'], $params['porcientoajuste']);
        }
        $query = "select * from mod_planificacion.f_calcajuste(?,?,?,?);";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            return $result[0]['f_calcajuste'];
        } else {
            return '23';
        }
    }

    public function insertarAjusteNivel($params) {
        $res = implode(",", $params['arrayidactividad']);
        if ($params['arrayidactividad']) {
            $paramsQuery = array("{" . $res . "}", $params['idejercicio'], $params['identidad']);
        } else {
            $paramsQuery = array(null, $params['idejercicio'], $params['identidad']);
        }
        $query = "select * from mod_planificacion.f_insertarajustenivel(?,?,?);";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            return $result[0]['f_insertarajustenivel'];
        } else {
            return '23';
        }
    }

    /* Desglose */

    public function obtenerColumnasDesglose($idtipomodelo) {
        $datoscolumnas = Array();
        if ($idtipomodelo != null) {
            //buscar las columnas que tiene el desglose
            $nomColumnas = DatDesglose::columnasDesglose($idtipomodelo);

            foreach ($nomColumnas as $key => $value) {
                $datoscolumnas[$key]['idtiponomenclador'] = $value['idtiponomenclador'];
                $datoscolumnas[$key]['uritiponomenclador'] = $value['uritiponomenclador'];
                $datoscolumnas[$key]['denominacion'] = $value['denominacion'];
                $datoscolumnas[$key]['iddesglosetiponomenclador'] = $value['iddesglosetiponomenclador'];
                //buscar los datos nomenclador de cada columa
                $datoscolumnas[$key]['datoscolumnas'] = DatDesglose::datosXTiponomenclador($value['idtiponomenclador']);
            }
        }
        return $datoscolumnas;
    }

    public function listarDesgloseNivelesActividad($params) {
        $actividadentidad = DatActividadentidad::obtenerIdActividadEntidad($params['identidad'], $params['idactividad'], $params['idejercicio']);
        $params['idactividadentidad'] = $actividadentidad[0];

        $arrayfilas->data = array();
        if ($params['idactividadentidad'] != null) {
            $params['where'] = "";
            if (is_array($params['filtros'])) {
                foreach ($params['filtros'] as $datos) {
                    if ($datos['field'] == 'nivelactividad') {
                        if ($datos['data']['comparison'] == 'lt') {
                            $sqlSigno = "<";
                            $params['where'] = " and ROUND(dn.nivelactivdesglosado,4) < {$datos['data']['value']}";
                        } else {
                            if ($datos['data']['comparison'] == 'gt') {
                                $sqlSigno = ">";
                                $params['where'] = " and ROUND(dn.nivelactivdesglosado,4) > {$datos['data']['value']}";
                            } else {
                                $sqlSigno = "=";
                                $params['where'] = " and ROUND(dn.nivelactivdesglosado,4) = {$datos['data']['value']}";
                            }
                        }
                    }
                }
            }

            $datos = DatDesgloseentidadnivel::listarDesgloses($params);
            $cantregistros = count($datos);
            $cont = 0;
            $arrayfilas->data = array();

            if ($cantregistros > 0) {
                foreach ($datos as $y => $valueDos) {
                    if ($y < $cantregistros) {
                        if ($valueDos['iddesgloseentidadnivel'] == $datos[$y + 1]['iddesgloseentidadnivel']
                        ) {
                            $arrayfilas->data[$cont][$valueDos['uritiponomenclador']] = $valueDos['iddatosnomenclador'];
                        } else {
                            $arrayfilas->data[$cont]['nivelactividad'] = $valueDos['nivelactivdesglosado'];
                            $arrayfilas->data[$cont]['idusuario'] = $valueDos['idusuario'];
                            $arrayfilas->data[$cont]['fecha'] = $valueDos['fecha'];
                            ;
                            $arrayfilas->data[$cont]['iddesgloseentidadnivel'] = $valueDos['iddesgloseentidadnivel'];
                            $arrayfilas->data[$cont++][$valueDos['uritiponomenclador']] = $valueDos['iddatosnomenclador'];
                        }
                    }
                }
            } else {
                $arrayfilas->data = array();
            }
            //hay que hacerlo aparte pq si son mas de un
            //tipo nomenclador en el desglose no funciona el count over
            $total = DatDesgloseentidadnivel::totalDesgloseNivelesActividad($params);
            $arrayfilas->total = $total[0];
        }

        return $arrayfilas;
    }

    public function guardarDesgloses($params) {
        $actividadentidad = DatActividadentidad::obtenerIdActividadEntidad(
                        $params['identidad'], $params['idactividad'], $params['idejercicio']
        );
        $params['idactividadentidad'] = $actividadentidad[0];
        DatDesgloseentidadnivel::eliminarDesgloseTodos($params);
        //insertando en dat_desgloseentidadnivel
        foreach ($params['desglose'] as $valueDos) {
            if ($valueDos->nivelactividad != 0) {

                $objDesgloseentidadnivel = new DatDesgloseentidadnivel();
                $objDesgloseentidadnivel->idactividadentidad = $params['idactividadentidad'];
                $objDesgloseentidadnivel->idejercicio = $params['idejercicio'];
                $objDesgloseentidadnivel->idusuario = $params['idusuario'];
                $objDesgloseentidadnivel->fecha = null;
                $objDesgloseentidadnivel->nivelactivdesglosado = $valueDos->nivelactividad;

                $objDesgloseentidadnivel->save();
                $iddesgloseentidadnivel = $objDesgloseentidadnivel->iddesgloseentidadnivel;

                foreach ($params['columnas'] as $valueUno) {
                    $objDesglosedatosnomenclador = new DatDesglosedatosnomenclador( );
                    $denom = $valueUno->denom;
                    $objDesglosedatosnomenclador->iddatosnomenclador = $valueDos->$denom;
                    $objDesglosedatosnomenclador->iddesgloseentidadnivel = $iddesgloseentidadnivel;
                    $objDesglosedatosnomenclador->iddesglosetiponomenclador = $valueUno->id;
                    $objDesglosedatosnomenclador->save();
                }
            }
        }
        return 20;
    }

    public function eliminarDesglose($params) {

        $actividadentidad = DatActividadentidad::obtenerIdActividadEntidad(
                        $params['identidad'], $params['idactividad'], $params['idejercicio']
        );
        $params['idactividadentidad'] = $actividadentidad[0];
        $result = DatDesgloseentidadnivel::eliminarDesgloseVarios($params);
        return $result;
    }

    /* FUNCION DE INTEGRACION DE BASE DEL PLAN CON PLAN */

    public function actualizarPlan($params) {
        $arrayColumnasnomencladastablametadato = DatModeloModel::servicioBp($params['idtipomodelo']);
        $arrayParametros = array();
        $arrayParametros[] = $params['identidad'];
        $arrayParametros[] = $params ['idmodelo'];
        $arrayParametros[] = $arrayColumnasnomencladastablametadato['idtabla'];
        $arrayParametros[] = $params ['iddesglose'];
        $arrayParametros[] = $params['idejercicio'];

        //en dependencia si el plan es de gasto o de ingreso
        //se utiliza un precio u otro
        if ($params['tipoplan'] == 1) {
            //plan de ingreso
            $arrayParametros[] = 'ip.precioventa';
        } elseif ($params['tipoplan'] == 0) {
            //plan de gasto
            $arrayParametros[] = 'ip.precio';
        } 
        $arrayParametros[] = $params['idusuario'];
        $conn = Doctrine_Manager:: connection();
        $query = "select * from mod_planificacion.f_integraciondesglose(?,?,?,?,?,?,?)";
        $res = $conn->execute($query, $arrayParametros);
        $result = $res->fetchAll();

        $querySalida = "select * from mod_planificacion.f_integraciondesglosesalida(?,?,?,?,?,?,?)";
        $resSalida = $conn->execute($querySalida, $arrayParametros);
        $resultSalida = $resSalida->fetchAll();
        if ($result[0][f_integraciondesglose] == 1 || $resultSalida[0][f_integraciondesglosesalida] == 1) {
            return 1;
        } else {
            return 2;
        }
    }

    /* Metodos de Importar niveles de actividad */

    public function importarFichero($idusuario) {
        //creando el arreglo de las columnas fijas
        $columnas = array();
        $columnas[0][0] = "Código de la actividad";
        $columnas[0][1] = 0;

        $columnas[1][0] = "Denominación";
        $columnas[1][1] = 0;

        $columnas[2][0] = "Nivel de actividad manual";
        $columnas[2][1] = 0;

        //leyendo el excel
        $filename = $_FILES['file']['tmp_name'];
        $file = $filename;
        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($file);
        $dat = $data->sheets[0]['cells'];

        //obteniendo las columnas del excel
        $columnasExcel = array();
        foreach ($dat[0] as $k => $col) {
            $columnasExcel[$k][0] = $col;
            $columnasExcel[$k][1] = $k;
        }
        //convirtiendo el arreglo de datos en un text
        $datos = serialize($dat);

        //eliminando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarnivelesxls" . $idusuario);

        //creando tabla donde se guardan los datos del excel
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importarnivelesxls" . $idusuario . " (xls TEXT) WITH (OIDS = FALSE)");

        //almacenando los datos en la BD para usarlos en la próxima petición
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importarnivelesxls" . $idusuario . "(xls) VALUES ('" . $datos . "')");

        $data = array('columnas' => $columnas, 'columnasExcel' => $columnasExcel);
        return $data;
    }

    //validar datos a importar
    public function importarDatosRelacionados($relaciones, $identidad, $idejercicio, $idespecialidad, $idusuario) {
        $datos = DatActividadentidad::obtenerDatosCargados($idusuario);
        //preparando datos para crear tabla dinamica
        //en esta variable se guarda, de las columnas,
        //la posicion de su columna correspondiente en el excel
        $posiciones = array();
        foreach ($relaciones as $rel) {
            if ($rel->denominacionOS == "Código de la actividad") {
                $posiciones['codigo'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Denominación") {
                $posiciones['denominacion'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Nivel de actividad manual") {
                $posiciones['namanual'] = $rel->posicioncolumnaExcel;
                continue;
            }
        }
        DatActividadentidad::crearTablaTemporal($idusuario);
        foreach ($datos as $j => $row) {
            //ignorando los datos del encabezado de la tabla
            if ($j == 0) {
                continue;
            }
            //dando valor a la codigo si viene vacio
            if ($row[$posiciones['codigo']]) {
                $codigo = utf8_encode($row[$posiciones['codigo']]);
            } else {
                $codigo = "-";
            }
            //dando valor al namanual si viene vacio
            $namanual = 0;
            if ($row[$posiciones['namanual']]) {
                $n = BpnivelesactividadModel::validarNumericPositivo($row[$posiciones['namanual']]);
                if ($n != 'no')
                    $namanual = $n;
            }
            DatActividadentidad::insertarDatosTablaTemporal($idusuario, $codigo, $namanual);
        }
        BpnivelesactividadModel::validarDatosImportados($idusuario, $idespecialidad, $idejercicio, $identidad);
    }

    private function validarNumericPositivo($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor) && $valor >= 0) {
            return $valor;
        }
        return 'no';
    }

//Validar datos importados
    private function validarDatosImportados($idusuario, $idespecialidad, $idejercicio, $identidad) {
        try {
            //Buscando los datosnomenclador para los mensajes de validación
            $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
            foreach ($array_ests_dnom as $k => $dn) {
                unset($array_ests_dnom[$k]);
                $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
            }

            $formato = NomActividad::obtener_ConfFormato_UltimoNivel();
            $idformato = $formato[0];
            $ultimoNivel = $formato[1];

            $result = DatActividadentidad::listarDatosTablaTemporal($idusuario, $idejercicio, $idespecialidad, $identidad);
            foreach ($result as $value) {
                if ($idformato == null) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['noexisteformatoactividades']);
                    continue;
                }
                if ($value['idactividad'] == null) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['codigoactvacio']);
                    continue;
                }
                if ($value['nivel'] != $ultimoNivel) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['actividadnoesultimonivel']);
                    continue;
                }if ($value['idaprobacion'] != 4) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['laactividadestadesaprobada']);
                    continue;
                }
                if ($value['estado'] != 1) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['laactividadestadesactivada']);
                    continue;
                }
                if (!$value['norma']) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['laactividadnoestanormada']);
                    continue;
                }
                if ($value['aprobadonivel'] == 3 || $value['aprobadonivel'] == 4) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['elniveldeactividadestaaprobado']);
                    continue;
                }
                if (!$value['idactespcomportamiento']) {
                    DatActividadentidad::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['laactividadnoestacompartida']);
                    continue;
                }
                DatActividadentidad::insertarEnLaTablaTemporal($value, $idusuario, $array_ests_uri);
            }
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //inserta todos los datos validados correctamente
    public function insertarDatosImportar($params, $idespecialidad, $idusuario) {

        $data = DatActividadentidad::listarDatosAImportar($idusuario);

        foreach ($data as $nivactividadOrigen) {
            $idactividadentidadOrigen = null;
            if ($nivactividadOrigen['namanual'] == 0) {
                if ($nivactividadOrigen['idactividadentidad'] != null) {
                    $idactividadentidadOrigen = $nivactividadOrigen['idactividadentidad'];
                    BpnivelesactividadModel::eliminarActividadEntidadOrigen($idactividadentidadOrigen);
                }
            } else {
                if ($nivactividadOrigen['idactividadentidad'] == null) {
                    //creo el idactividadentidad
                    $idactividadentidadOrigen = BpnivelesactividadModel::crearActividadEntidad($nivactividadOrigen['idactespcomportamiento'], $nivactividadOrigen['idactividad'], $params['identidad'], $params['idejercicio']);
                    //creo el nivel manual
                    BpnivelesactividadModel::crearNivelManual($idactividadentidadOrigen, $nivactividadOrigen['namanual']);
                } else {
                    $idactividadentidadOrigen = $nivactividadOrigen['idactividadentidad'];

                    $actEntManualOrigen = Doctrine::getTable('DatActividadentidadmanual')->findByDql("idactividadentidad = {$nivactividadOrigen['idactividadentidad']}");

                    if ($actEntManualOrigen[0]->idactividadentidad != null) {
                        //actualizar na manual
                        $actEntManualOrigen[0]->nivelactividadmanual = $nivactividadOrigen['namanual'];
                        $actEntManualOrigen[0]->save();
                    } else {
                        //creo el nivel manual
                        BpnivelesactividadModel::crearNivelManual($nivactividadOrigen['idactividadentidad'], $nivactividadOrigen['namanual']);
                    }
                }
            }
            if ($idactividadentidadOrigen != null) {
                //actualizando niveles automaticos
                $arrayreglas = Doctrine::getTable('DatRegla')->findByDql("idactividadorigen = {$nivactividadOrigen['idactividad']} and idejercicio={$params['idejercicio']}");
                foreach ($arrayreglas as $regla) {
                    //calculando nivel auto
                    $ajusteOrigen = Doctrine::getTable('DatActividadentidad')->findByDql("idactividadentidad = $idactividadentidadOrigen");
                    $nivelAutoOrigen = Doctrine::getTable('DatActividadentidadautomatico')->findByDql("idactividadentidad = $idactividadentidadOrigen");
                    if ($regla->idnorma == null) {
                        $nivelAutoDestino = ($nivactividadOrigen['namanual'] + $nivelAutoOrigen[0]->nivelactividadautomatico + $ajusteOrigen[0]->ajuste) / $regla->valorcontrol * $regla->nivelactividadbase;
                    } else {
                        $normaOrigen = Doctrine::getTable('DatNorma')->findByDql("idnorma = {$regla->idnorma}");
                        $nivelAutoDestino = $normaOrigen[0]->necesidad * ($nivactividadOrigen['namanual'] + $nivelAutoOrigen[0]->nivelactividadautomatico + $ajusteOrigen[0]->ajuste) / $regla->valorcontrol * $regla->nivelactividadbase;
                    }
                    $actEntDestino = Doctrine::getTable('DatActividadentidad')->findByDql("idactividad = $regla->idactividaddestino and idejercicio={$params['idejercicio']} and identidad={$params['identidad']}");
                    if ($actEntDestino[0]->idactividadentidad == null) {
                        $actEspDestino = Doctrine::getTable('DatActespcomportamiento')->findByDql("idactividad = $regla->idactividaddestino and idespecialidad=$idespecialidad");
                        //creo el idactividadentidad
                        if ($actEspDestino[0]->idactespcomportamiento != null) {
                            $idactividadentidadautoDestino = BpnivelesactividadModel::crearActividadEntidad($actEspDestino[0]->idactespcomportamiento, $regla->idactividaddestino, $params['identidad'], $params['idejercicio']);
                            //creo el nivel auomatico
                            BpnivelesactividadModel::crearNivelAutomatico($idactividadentidadautoDestino, $nivelAutoDestino, $regla->idregla);
                        }
                    } else {
                        $idactividadentidadautoDestino = $actEntDestino[0]->idactividadentidad;
                        $actEntAutoDestino = Doctrine::getTable('DatActividadentidadautomatico')->findByDql("idactividadentidad = $idactividadentidadautoDestino");
                        if ($actEntAutoDestino[0]->idactividadentidad != null) {
                            //actualizar na auto
                            $actEntAutoDestino[0]->nivelactividadautomatico = $nivelAutoDestino;
                            $actEntAutoDestino[0]->save();
                        } else {
                            //creo el nivel auto
                            BpnivelesactividadModel::crearNivelAutomatico($idactividadentidadautoDestino, $nivelAutoDestino, $regla->idregla);
                        }
                    }                //si $nivelAutoDestino es 0 y no hay mas niveles eliminar act ent sino eliminat actent automatico
                    if ($nivelAutoDestino == 0) {
                        BpnivelesactividadModel::eliminarActividadEntidadDestino($idactividadentidadautoDestino);
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarnivelesxls" . $idusuario);
        //eliminando tabla temporal dinámica
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarniveles" . $idusuario);
    }

    public function crearNivelManual($idactividadentidad, $nivelmanual) {
        $nuevaActEntManual = new DatActividadentidadmanual();
        $nuevaActEntManual->idactividadentidad = $idactividadentidad;
        $nuevaActEntManual->nivelactividadmanual = $nivelmanual;
        $nuevaActEntManual->save();
    }

    public function crearNivelAutomatico($idactividadentidad, $nivelautomatico, $idregla) {
        $nuevaActEntAuto = new DatActividadentidadautomatico();
        $nuevaActEntAuto->idactividadentidad = $idactividadentidad;
        $nuevaActEntAuto->nivelactividadautomatico = $nivelautomatico;
        $nuevaActEntAuto->idregla = $idregla;
        $nuevaActEntAuto->save();
    }

    public function crearActividadEntidad($idactespcomportamiento, $idactividad, $identidad, $idejercicio) {
        $de = Doctrine_Manager::getInstance();
        $conn = $de->getCurrentConnection();
        $nuevaAsocactent = new DatActividadentidad();
        $nuevaAsocactent->idactespcomportamiento = $idactespcomportamiento;
        $nuevaAsocactent->identidad = $identidad;
        $nuevaAsocactent->idactividad = $idactividad;
        $nuevaAsocactent->idejercicio = $idejercicio;
        $nuevaAsocactent->save();
        $conn->commit();
        $conn->beginTransaction();
        return $nuevaAsocactent->idactividadentidad;
    }

    public function eliminarActividadEntidadOrigen($idactividadentidad) {
        $nivelAutoOrigen = Doctrine::getTable('DatActividadentidadautomatico')->findByDql("idactividadentidad = $idactividadentidad");
        $nivelAutoOrigen = $nivelAutoOrigen[0]->nivelactividadautomatico;
        $nivelCartaTecOrigen = Doctrine::getTable('DatActividadentidadproduccion')->findByDql("idactividadentidad = $idactividadentidad");
        $nivelCartaTecOrigen = $nivelCartaTecOrigen[0]->nivelactividadproduccion;
        if (($nivelAutoOrigen == 0 || $nivelAutoOrigen == null) && ($nivelCartaTecOrigen == 0 || $nivelCartaTecOrigen == null)) {
            //no existe ningun otro nivel de actividad para esta actividadentidad
            $query = new Doctrine_Query();
            $query->delete()->from('DatActividadentidad')->where("idactividadentidad=$idactividadentidad")->execute();
        } else {
            //eliminar de ae manual
            $query = new Doctrine_Query();
            $query->delete()->from('DatActividadentidadmanual')->where("idactividadentidad=$idactividadentidad")->execute();
        }
    }

    public function eliminarActividadEntidadDestino($idactividadentidad) {
        $nivelmanualDestino = Doctrine::getTable('DatActividadentidadmanual')->findByDql("idactividadentidad = $idactividadentidad");
        $nivelmanualDestino = $nivelmanualDestino[0]->nivelactividadmanual;
        $nivelCartaTecDestino = Doctrine::getTable('DatActividadentidadproduccion')->findByDql("idactividadentidad = $idactividadentidad");
        $nivelCartaTecDestino = $nivelCartaTecDestino[0]->nivelactividadproduccion;
        if (($nivelmanualDestino == 0 || $nivelmanualDestino == null) && ($nivelCartaTecDestino == 0 || $nivelCartaTecDestino == null)) {
            //no existe ningun otro nivel de actividad para esta actividadentidad
            $query = new Doctrine_Query();
            $query->delete()->from('DatActividadentidad')->where("idactividadentidad=$idactividadentidad")->execute();
        } else {
            //eliminar de ae automatico
            $query = new Doctrine_Query();
            $query->delete()->from('DatActividadentidadautomatico')->where("idactividadentidad=$idactividadentidad")->execute();
        }
    }

}
