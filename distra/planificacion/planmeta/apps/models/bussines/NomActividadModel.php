<?php

class NomActividadModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    /*     * ************actividades********************** */

    public function Insertar(NomActividad $NomActividad) {
        $NomActividad->save();
    }

//funcion listar actividades
    public function listarActividades($params) {
        $ejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $params['idejercicio'] = $ejercicio[0]['idejercicio'];
        $obj = new NomActividad();
        return $obj->listar($params);
    }

    public function validarTipoModeloConColumnNomencladas($params) {

        $obj = new NomActividad();
        return $obj->validarTipoModeloConColumnNomencladas($params);
    }

//funcion exportar actividades
    public function exportarActividades($params) {
        //cargando etiquetas
        $params['array_etiq'] = self::cargarEtiquetas('bpgestactividades');
        //preparando aprobacion
        $arrayAprobaciones[1] = $params['array_etiq']['lbNo'];
        $arrayAprobaciones[2] = $params['array_etiq']['lbNo'];
        $arrayAprobaciones[3] = $params['array_etiq']['lbSi'];
        $arrayAprobaciones[4] = $params['array_etiq']['lbRector'];
        //preparando activado
        $arrayActivaciones[1] = $params['array_etiq']['lbSi'];
        $arrayActivaciones[0] = $params['array_etiq']['lbNo'];
        //preparando ejercicio
        $ejercicio = NomEjercicioplanificacion::obtenerEjercicioDadoId($params['idejercicio'])[0]['ejercicio'];
        //obteniendo planes
        $planes = DatModelo::GetTodos();
        $arrayPlanes = array();
        foreach ($planes as $k => $value) {
            unset($planes[$k]);
            $arrayPlanes[$value['idmodelo']] = $value['denominacion'];
        }
        unset($planes);
        //obteniendo unidades de medida
        $UnidadMed = $params['integrator']->datosmaestros->listarUnidadesMedidaTodas();
        $arrayUms = array();
        foreach ($UnidadMed as $um) {
            $arrayUms[$um ['idunidadmedida']] = $um ['denominacionunidadmedida'];
        }
        unset($UnidadMed);
        //obteniendo naturalezas
        $Naturalezas = DatBasescalculoModel::obtenerNaturalezas();
        $arrayNaturalezas = array();
        foreach ($Naturalezas as $naturaleza) {
            $arrayNaturalezas[$naturaleza['naturaleza']] = $naturaleza ['denominacion'];
        }
        unset($Naturalezas);
        //obteniendo las especialidades
        $especialidades = NomActividad::obtenerEspecialidadesTodas();
        $arrayesp = array();
        foreach ($especialidades as $esp) {
            $arrayesp[$esp ['idespecialidad']] = $esp ['denominacion'];
        }
        unset($especialidades);

        //obteniendo centros de balance
        $CentroBalance = ComportamientoEntidaddinamicoModel::listarCentroBalance();
        $arrayCb = array();
        foreach ($CentroBalance as $cb) {
            $arrayCb[$cb ['idcentrobalance']] = $cb ['centrobalance'];
        }
        unset($CentroBalance);
        //obteniendo los niveles
        $arrayFormatos = NomActividad::obtener_ConfFormato_UltimoNivel();
        $arrayPartsformat = array();
        foreach ($arrayFormatos[2] as $partformat) {
            $arrayPartsformat[$partformat->nivel] = $partformat->abreviatura;
        }
        unset($arrayFormatos);
        //preparando excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");

        if ($params['tipo'] == 'actividad') {
            header('Content-Disposition: attachment;filename=' . $params['array_etiq']['lbNombreFichero'] . '.xls');
        } elseif ($params['tipo'] == 'norma') {
            header('Content-Disposition: attachment;filename=' . $params['array_etiq']['lbNombreFicheroNorma'] . '.xls');
        } elseif ($params['tipo'] == 'salida') {
            header('Content-Disposition: attachment;filename=' . $params['array_etiq']['lbNombreFicheroSalidas'] . '.xls');
        } elseif ($params['tipo'] == 'regla') {
            header('Content-Disposition: attachment;filename=' . $params['array_etiq']['lbNombreFicheroReglas'] . '.xls');
        }
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        //titulo
        echo "<tr>\n";
        if ($params['tipo'] == 'norma') {
            echo "<H2 align=center>Actividades con normas</H2>";
            echo "<H3>Ejercicio: $ejercicio </H3>";
        } elseif ($params['tipo'] == 'salida') {
            echo "<H2 align=center>Actividades con salidas</H2>";
            echo "<H3>Ejercicio: $ejercicio </H3>";
        } elseif ($params['tipo'] == 'regla') {
            echo "<H2 align=center>Actividades con reglas</H2>";
            echo "<H3>Ejercicio: $ejercicio </H3>";
        }

        echo "<th colspan = 12 align=center>{$params['array_etiq']['lbActividades']}</th>";
        if ($params['tipo'] == 'norma') {
            echo "<th colspan = 16 align=center>{$params['array_etiq']['lbTitleNormas']}</th>";
        }
        if ($params['tipo'] == 'regla') {
            echo "<th colspan = 6 align=center>{$params['array_etiq']['lbTitleReglas']}</th>";
        }
        if ($params['tipo'] == 'salida') {
            echo "<th colspan = 6 align=center>{$params['array_etiq']['lbTitleSalidas']}</th>";
        }
        echo "</tr>";
        //columnas
        echo "<tr>\n";
        echo '<th>' . $params['array_etiq']['lbCodigo'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbDenominacion'] . '</th>';
        echo '<th align=left>' . $params['array_etiq']['lbDescripcion'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbNivel'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbEspecialidad'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbPlan'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbPlanSalida'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbActivado'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbAprobado'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbNormada'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbReglas'] . '</th>';
        echo '<th>' . $params['array_etiq']['lbSalida'] . '</th>';
        if ($params['tipo'] == 'norma') {
            $params['nivel'] = $params['ultimonivel'];
            echo '<th align=left>' . $params['array_etiq']['lbCodigo'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbNumPieza'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbDenominacion'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbNaturaleza'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbCentroBalance'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbUnidadMedida'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbAprobado'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbNivelPlanificacion'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbActivado'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbPreciomn'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbNorma'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbBase'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbNecesidad'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbImporte'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbPreciomlc'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbImportemlc'] . '</th>';
        }
        if ($params['tipo'] == 'regla') {
            $params['nivel'] = $params['ultimonivel'];
            echo '<th align=left>' . $params['array_etiq']['lbDenominacion'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbIndicador'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbValorControl'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbActividadaGenerar'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbNivelBase'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbTipo'] . '</th>';
        }
        if ($params['tipo'] == 'salida') {
            $params['nivel'] = $params['ultimonivel'];
            echo '<th align=left>' . $params['array_etiq']['lbCodigo'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbNumPieza'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbDenominacion'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbUnidadMedida'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbPreciomn'] . '</th>';
            echo '<th align=left>' . $params['array_etiq']['lbMagnitud'] . '</th>';
        }


        //preparando filtros
        if ($params['filtros']) {
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
        }

        $params['filtros'] = $nuevos_filtros;

        $total = self::listarActividades($params);
        $cant = $total->total;

        $cantxpag = 1000;
        $cantpag = (int) ($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        unset($cant);
        $params['limitado'] = true;
        $offset = 0; //start
        $paso = $cantxpag; //limit
        for ($i = 0; $i < $cantpag; $i++) {
            $params['start'] = $offset;
            $params['limit'] = $paso;
            $arrayActvs = self::listarActividades($params)->data;
            $offset += $paso;
            foreach ($arrayActvs as $actividad) {

                if ($params['tipo'] == 'actividad') {
                    echo "<tr>\n";
                    self::imprimirActividades($actividad, $arrayPartsformat, $arrayPlanes, $arrayAprobaciones, $arrayesp);
                    echo "</tr>\n";
                } else if ($params['tipo'] == 'norma') {
                    //si tiene normas las busco con el listar de norma
                    if ($actividad['normada'] == 1) {
                        $parametros['idactividad'] = $actividad['idactividad'];
                        $parametros['idejercicio'] = $params['idejercicio'];
                        $normas = DatNorma::listarNormasPorActividad($parametros);
                        foreach ($normas->data as $norma) {
                            echo "<tr>\n";
                            self::imprimirActividades($actividad, $arrayPartsformat, $arrayPlanes, $arrayAprobaciones, $arrayesp);
                            self::imprimirNormas($norma, $arrayUms, $arrayCb, $arrayActivaciones, $arrayAprobaciones, $arrayNaturalezas);
                        }
                    } else {
                        echo "<tr>\n";
                        self::imprimirActividades($actividad, $arrayPartsformat, $arrayPlanes, $arrayAprobaciones, $arrayesp);
                    }
                } else if ($params['tipo'] == 'regla') {
                    //si tiene reglas las busco con el listar de reglas
                    if ($actividad['reglas'] == 1) {
                        $parametros['idactividad'] = $actividad['idactividad'];
                        $parametros['idejercicio'] = $params['idejercicio'];
                        $reglas = DatRegla::listarReglas($parametros);
                        foreach ($reglas->data as $regla) {
                            echo "<tr>\n";
                            self::imprimirActividades($actividad, $arrayPartsformat, $arrayPlanes, $arrayAprobaciones, $arrayesp);
                            self::imprimirReglas($regla);
                        }
                    } else {
                        echo "<tr>\n";
                        self::imprimirActividades($actividad, $arrayPartsformat, $arrayPlanes, $arrayAprobaciones, $arrayesp);
                    }
                } else if ($params['tipo'] == 'salida') {
                    //si tiene salida las busco con el listar de salida
                    if ($actividad['salida'] == 1) {
                        $parametros['idactividad'] = $actividad['idactividad'];
                        $salidas = DatSalida::listarSalidas($parametros);
                        foreach ($salidas->data as $salida) {
                            echo "<tr>\n";
                            self::imprimirActividades($actividad, $arrayPartsformat, $arrayPlanes, $arrayAprobaciones, $arrayesp);
                            self::imprimirSalidas($salida, $arrayUms);
                        }
                    } else {
                        echo "<tr>\n";
                        self::imprimirActividades($actividad, $arrayPartsformat, $arrayPlanes, $arrayAprobaciones, $arrayesp);
                    }
                }
            }
            unset($arrayActvs);
        }
        echo "</table>\n";
        echo '</BODY></HTML>';
    }

    public function imprimirActividades($actividad, $arrayPartsformat, $arrayPlanes, $arrayAprobaciones, $arrayesp) {

        echo "<td style=\"mso-number-format:'@';\">" . $actividad['codigo'] . "</td>\n" .
        "<td style=\"mso-number-format:'@';\">" . $actividad['denominacion'] . "</td>\n" .
        "<td style=\"mso-number-format:'@';\">" . $actividad['descripcion'] . "</td>\n" .
        "<td style=\"mso-number-format:'@';\">" . $arrayPartsformat[$actividad['nivel']] . "</td>\n" .
        "<td style=\"mso-number-format:'@';\">" . $arrayesp[$actividad['idespecialidad']] . "</td>\n";
        if ($actividad['idmodelo'])
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $arrayPlanes[$actividad['idmodelo']] . "</td>";
        else
            echo "<td >-</td>\n";
        if ($actividad['idmodelosalida'])
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $arrayPlanes[$actividad['idmodelosalida']] . "</td>\n";
        else
            echo "<td >-</td>\n";
        "<td >" . $actividad['estado'] . "</td>\n";
        if ($actividad['estado'] == 1)
            echo "<td align=center> Sí</td>\n";
        else
            echo "<td align=center> No</td>\n";
        echo "<td align=center  style=\"mso-number-format:'@';\" >" . $arrayAprobaciones[$actividad['idaprobacion']] . "</td>\n";
        if ($actividad['normada'] == 1)
            echo "<td align=center> Sí</td>\n";
        else
            echo "<td align=center> No</td>\n";
        if ($actividad['reglas'] == 1)
            echo "<td align=center> Sí</td>\n";
        else
            echo "<td align=center> No</td>\n";
        if ($actividad['salida'] == 1)
            echo "<td align=center> Sí</td>\n";
        else
            echo "<td align=center> No</td>\n";
    }

    public function imprimirNormas($norma, $arrayUms, $arrayCb, $arrayActivaciones, $arrayAprobaciones, $arrayNaturalezas) {
        echo "<td style=\"mso-number-format:'@';\">" . $norma['codigo'] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $norma['numeropieza'] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $norma['denominacion'] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $arrayNaturalezas[$norma['idnaturaleza']] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $arrayCb[$norma['idcentrobalance']] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $arrayUms[$norma['idumedida']] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $arrayAprobaciones[$norma['idaprobacion']] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $arrayActivaciones[$norma['nivelplanif']] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $arrayActivaciones[$norma['estado']] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $norma['precio'] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $norma['cantplanif'] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $norma['cantbase'] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $norma['necesidad'] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $norma['importe'] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $norma['preciodivisa'] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $norma['importedivisa'] . "</td>\n";
    }

    public function imprimirReglas($regla) {
        echo
        "<td align=left style=\"mso-number-format:'@';\" >" . $regla['denominacion'] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $regla['denoindicador'] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $regla['valorcontrol'] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $regla['denoactividad'] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $regla['nivelactividadbase'] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $regla['tipo'] . "</td>\n";
    }

    public function imprimirSalidas($salida, $arrayUms) {
        echo "<td style=\"mso-number-format:'@';\">" . $salida['codigo'] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $salida['numeropieza'] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $salida['denominacion'] . "</td>\n" .
        "<td align=left style=\"mso-number-format:'@';\" >" . $arrayUms[$salida['idumedida']] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $salida['precio'] . "</td>\n" .
        "<td align=right style=\"mso-number-format:'#,##0.000000';\">" . $salida['cantidad'] . "</td>\n";
    }

//funcion aprobar actividades
    public function aprobarDesaprobarVariasActividades($params) {
        $obj = new NomActividad();
        //busco solo las actividades de ultimo nivel
        //involucradas en la seleccion
        $arrTemp[] = 0;
        $actividadesUltimonivelArr = array();
        foreach ($params['actividades'] as $act) {
            if ($actividadesUltimonivelArr[0])
                $actividadesUltimonivelArr = array_merge($actividadesUltimonivelArr, $obj->obtenerUltimoNivel($act->ordender, $act->ordenizq, $act->idarbol, $params['nivel'], $actividadesUltimonivelArr));
            else
                $actividadesUltimonivelArr = array_merge($actividadesUltimonivelArr, $obj->obtenerUltimoNivel($act->ordender, $act->ordenizq, $act->idarbol, $params['nivel'], $arrTemp));
        }
        if ($actividadesUltimonivelArr[0]) {
            $actividadesUltimonivel = implode(',', $actividadesUltimonivelArr);
            if ($params['idaprobacion'] == 1) {
                $actividades = $actividadesUltimonivel;
            } else {//es aprobar
                $actividades = implode(',', $obj->obtenerNormPlan($actividadesUltimonivel));
            }
            if ($actividades) {
                $obj->aprobardesaprobarArrayActividades($actividades, $params['esrector'], $params['idaprobacion']);
                return true;
            } else
                return false;
        } else
            return false;
    }

//funcion activar actividades
    public function activarDesactivarPostordenVariasActividades($params) {
        $obj = new NomActividad();
        return $obj->ActualizarEstado($params);
    }

//funcion eliminar actividades
    public function eliminarVariasActividades($params) {
        //busco solo las actividades que su rama no tiene reglas
        $actEliminar = array();
        $arrVacio[] = 0;

        foreach ($params['idactividades'] as $act) {
            $actividadesUltimonivelArr = array();
            if ($act->nivel != $params['nivel']) {
                $actividadesUltimonivelArr = NomActividad::obtenerUltimoNivel($act->ordender, $act->ordenizq, $act->idarbol, $params['nivel'], $arrVacio);
            } else {
                $actividadesUltimonivelArr[] = $act->idactividad;
            }

            if ($actividadesUltimonivelArr[0] != null) {
                $idactividades = implode(',', $actividadesUltimonivelArr);
                $activ = DatRegla::obtenerActConReglas($idactividades);
                if (empty($activ)) {
                    $actEliminar[] = $act->idactividad;
                }
            } else {
                $actEliminar[] = $act->idactividad;
            }
        }

        if ($actEliminar[0] != null) {
            //eliminar arreglo de actividades
            NomActividad::eliminarArrayAct($actEliminar);
            return true;
        } else
            return false;
    }

//funcion adicionar actividades
    public function adicionarActividad($params) {
        //Se inserta la actividad
        $act = self::auxAdicionarActividad($params);

        // Asociar una actividad a un plan
        if ($act->idactividad && $params['idmodelo']) {
            $modelActMod = new DatActividadModeloModel();
            $modelActMod->adicionar($act->idactividad, $params['idmodelo']);
        }

        // Asociar una actividad a un plan de salida
        if ($act->idactividad && $params['idmodeloSalida']) {
            $modelActMod = new DatActividadmodelosalida();
            $modelActMod->adicionar($act->idactividad, $params['idmodeloSalida']);
        }


        // Compartimentacion de las actividades
        if ($act->nivel == $params['ultimonivel']) {
            //especialidad propia
            $idDatosNom = NomDatosnomenclador::getDatosNomPorUriDatosNom('propia');
            $actespcomp = new DatActespcomportamiento();
            $actespcomp->idactividad = $act->idactividad;
            $actespcomp->idespecialidad = $params['idespecialidad'];
            $actespcomp->iddatosnomenclador = $idDatosNom[0]['iddatosnomenclador'];
            $actespcomp->save();

            //especialidades demandantes
            if ($params['idespecialidadesdem']) {
                $arresp = explode(',', $params['idespecialidadesdem']);
                self::auxCompartimentarActividad($arresp, $act, 'demandada', $params['integrator']);
            }

            //especialidades compartidas
            if ($params['idespecialidadcomp']) {
                $arrespCom = explode(',', $params['idespecialidadcomp']);
                self::auxCompartimentarActividad($arrespCom, $act, 'compartida', $params['integrator']);
            }
        }
        return true;
    }

    public function auxAdicionarActividad($params) {
        $conn = Zend_Registry::get('conexion');
        $act = new NomActividad();
        if ($params['idpadreAdicionar'] != 'false') {
            $act->idpadre = $params['idpadreAdicionar'];
            $act->idarbol = $params['idarbolAdicionar'];
        }
        //se asignan los demas datos a la nueva act
        $act->codigo = $params['codAdicionar'];
        $act->denominacion = $params['denominacion'];
        $act->descripcion = $params['descripcion'];
        $act->estado = 0;
        $act->idaprobacion = 1;
        $act->idformato = $params['idformato'];
        $act->idespecialidad = $params['idespecialidad'];
        $act->nivel = $params['nivelAdicionar'];
        $act->idusuario = $params['idusuario'];
        //se inserta la actividad
        $act->save();
        $conn->commit();
        $conn->beginTransaction();
        return $act;
    }

    public function asociarActPlanes($params) {
        foreach ($params['actividades'] as $p) {

            if (is_object($p)) {
                $p = get_object_vars($p);
            }

            $idactividad = intval($p['idactividad']);

            /**
             * modificando el plan de salida  asociado a la act
             */
            if (is_numeric($params['idmodeloSalida']) == 1) {

                $NomModelo = Doctrine::getTable('DatActividadmodelosalida')->findByDql("idactividad = {$idactividad}");
                if ($NomModelo[0]->idactividadmodelosalida == null) {

                    $modelActMod = new DatActividadmodelosalida();
                    $modelActMod->adicionar($idactividad, $params['idmodeloSalida']);
                } else {
                    $NomModelo[0]->idmodelo = $params['idmodeloSalida'];
                    $NomModelo[0]->save();
                }
            }

            //modificando el plan asociado a la actividad
            if (is_numeric($params['idmodelo']) == 1) {
                $NomModelo = Doctrine::getTable('DatActividadmodelo')->findByDql("idactividad = {$p['idactividad']}");
                if ($NomModelo[0]->idactividadmodelo == null) {
                    $modelActMod = new DatActividadModeloModel();
                    $modelActMod->adicionar($idactividad, $params['idmodelo']);
                } else {
                    //Si se va a cambiar el modelo hay que verificar que si el nuevo modelo es de un
                    //tipo de modelo distinto al anterior hay que eliminar los desgloses asociados
                    //a esa actividad
                    $idmodeloviejo = $NomModelo[0]->idmodelo;
                    $idmodelonuevo = $params['idmodelo'];
                    $mismoTipodeModelo = DatModelo::modeloTieneelMismoTipodeModelo($idmodeloviejo, $idmodelonuevo);
                    if ($mismoTipodeModelo[0] == 0) {
                        //si no tienen el mismo tipo de modelo hay que eliminar los desgloses
                        DatModeloModel::eliminarDesglosesxActividad($idactividad);
                    }
                    $NomModelo[0]->idmodelo = $params['idmodelo'];
                    $NomModelo[0]->save();
                }
            }


            $getIddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
            //modificando a las especialidades demandadas
            if ($params['idespecialidadesdem'] != null) {
                $idDatosnomenclador = $getIddatosnomanclador['demandada'];
                DatActespcomportamiento::eliminarRelacionConEspecialidesRestantes(intval($idactividad), $params['idespecialidadesdem'], $idDatosnomenclador);
                $especialidades = explode(',', $params['idespecialidadesdem']);
                foreach ($especialidades as $sp) {
                    $objParte = Doctrine::getTable('DatActespcomportamiento')->findByDql("idactividad = {$idactividad} AND idespecialidad = {$sp} AND iddatosnomenclador = {$idDatosnomenclador}");
                    if ($objParte[0]->idactividad == null) {
                        $actespcomp = new DatActespcomportamiento();
                        $actespcomp->idactividad = $idactividad;
                        $actespcomp->idespecialidad = $sp;
                        $actespcomp->iddatosnomenclador = $idDatosnomenclador;
                        $actespcomp->save();
                    }
                }
            }

            // modificando a las especialidades compartidas
            if ($params['idespecialidadcomp'] != null) {

                $idDatosnomenclador = $getIddatosnomanclador['compartida'];
                DatActespcomportamiento::eliminarRelacionConEspecialidesRestantes(intval($idactividad), $params['idespecialidadcomp'], $idDatosnomenclador);
                $especialidades = explode(',', $params['idespecialidadcomp']);
                foreach ($especialidades as $sp) {
                    $objParte = Doctrine::getTable('DatActespcomportamiento')->findByDql("idactividad = {$idactividad} AND idespecialidad = {$sp} AND iddatosnomenclador = {$idDatosnomenclador}");
                    if ($objParte[0]->idactividad == null) {
                        $actespcomp = new DatActespcomportamiento();
                        $actespcomp->idactividad = $idactividad;
                        $actespcomp->idespecialidad = $sp;
                        $actespcomp->iddatosnomenclador = $idDatosnomenclador;
                        $actespcomp->save();
                    }
                }
            }
        }

        return true;
    }

//funcion modificar actividad
    public function modificarActividad($params) {
        $idactividad = intval($params['idactividad']);
        //modificando los datos basicos de una actividad
        $NomActividad = Doctrine::getTable('NomActividad')->findByDql("idactividad = {$idactividad}");
        $NomActividad[0]->denominacion = $params['denominacion'];
        $NomActividad[0]->descripcion = $params['descripcion'];
        $NomActividad[0]->codigo = '' . $params['codpadre'] . '' . $params['tfcodigo'];
        $NomActividad[0]->save();

        /**
         * modificando el plan de salida  asociado a la act
         */
        if (is_numeric($params['idmodeloSalidaMod']) == 1) {
            $NomModelo = Doctrine::getTable('DatActividadmodelosalida')->findByDql("idactividad = {$params['idactividad']}");
            if ($NomModelo[0]->idactividadmodelosalida == null) {
                $modelActMod = new DatActividadmodelosalida();
                $modelActMod->adicionar($idactividad, $params['idmodeloSalidaMod']);
            } else {
                $NomModelo[0]->idmodelo = $params['idmodeloSalidaMod'];
                $NomModelo[0]->save();
            }
        }

        //modificando el plan asociado a la actividad
        if (is_numeric($params['idmodeloMod']) == 1) {

            $NomModelo = Doctrine::getTable('DatActividadmodelo')->findByDql("idactividad = {$params['idactividad']}");
            if ($NomModelo[0]->idactividadmodelo == null) {
                $modelActMod = new DatActividadModeloModel();
                $modelActMod->adicionar($idactividad, $params['idmodeloMod']);
            } else {
                //Si se va a cambiar el modelo hay que verificar que si el nuevo modelo es de un
                //tipo de modelo distinto al anterior hay que eliminar los desgloses asociados
                //a esa actividad
                $idmodeloviejo = $NomModelo[0]->idmodelo;
                $idmodelonuevo = $params['idmodeloMod'];
                $mismoTipodeModelo = DatModelo::modeloTieneelMismoTipodeModelo($idmodeloviejo, $idmodelonuevo);
                if ($mismoTipodeModelo[0] == 0) {
                    //si no tienen el mismo tipo de modelo hay que eliminar los desgloses
                    DatModeloModel::eliminarDesglosesxActividad($idactividad);
                }
                $NomModelo[0]->idmodelo = $params['idmodeloMod'];
                $NomModelo[0]->save();
            }
        }


        $getIddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        //modificando a las especialidades demandadas
        if ($params['idespecialidadesdem'] != null) {
            $idDatosnomenclador = $getIddatosnomanclador['demandada'];
            DatActespcomportamiento::eliminarRelacionConEspecialidesRestantes($params['idactividad'], $params['idespecialidadesdem'], $idDatosnomenclador);
            $especialidades = explode(',', $params['idespecialidadesdem']);
            foreach ($especialidades as $sp) {
                $objParte = Doctrine::getTable('DatActespcomportamiento')->findByDql("idactividad = {$idactividad} AND idespecialidad = {$sp} AND iddatosnomenclador = {$idDatosnomenclador}");
                if ($objParte[0]->idactividad == null) {
                    $actespcomp = new DatActespcomportamiento();
                    $actespcomp->idactividad = $idactividad;
                    $actespcomp->idespecialidad = $sp;
                    $actespcomp->iddatosnomenclador = $idDatosnomenclador;
                    $actespcomp->save();
                }
            }
        }

        // modificando a las especialidades compartidas
        if ($params['idespecialidadcomp'] != null) {
            $idDatosnomenclador = $getIddatosnomanclador['compartida'];
            DatActespcomportamiento::eliminarRelacionConEspecialidesRestantes($params['idactividad'], $params['idespecialidadcomp'], $idDatosnomenclador);
            $especialidades = explode(',', $params['idespecialidadcomp']);
            foreach ($especialidades as $sp) {
                $objParte = Doctrine::getTable('DatActespcomportamiento')->findByDql("idactividad = {$idactividad} AND idespecialidad = {$sp} AND iddatosnomenclador = {$idDatosnomenclador}");
                if ($objParte[0]->idactividad == null) {
                    $actespcomp = new DatActespcomportamiento();
                    $actespcomp->idactividad = $idactividad;
                    $actespcomp->idespecialidad = $sp;
                    $actespcomp->iddatosnomenclador = $idDatosnomenclador;
                    $actespcomp->save();
                }
            }
        } else {
            $idDatosnomenclador = $getIddatosnomanclador['compartida'];
            DatActespcomportamiento::eliminarRelacionConEspecialides($params['idactividad'], $idDatosnomenclador);
        }
        return true;
    }

    //funcion compartimentar actividad
    public function auxCompartimentarActividad($arresp, $act, $comp, $int = null) {

        $query = Doctrine_Manager::connection();
        $idDatosNom = NomDatosnomenclador::getDatosNomPorUriDatosNom($comp);

        foreach ($arresp as $idEsp) {
            //buscando especialidades hijas
            if ($idEsp != null && ($idEsp)) {
                $especialidadesresult = $int->datosmaestros->getTodosHijosEspecialidad($idEsp);
                $especialidadesresult[]['idespecialidad'] = $idEsp;
                if ($especialidadesresult[0] != null) {
                    foreach ($especialidadesresult as $valor) {
                        $datActEspComp = new DatActespcomportamiento();
                        $datActEspComp->eliminarCompartimentacion($act->idactividad, intval($valor['idespecialidad']));
                        $actespcomp = new DatActespcomportamiento();
                        $actespcomp->idactividad = $act->idactividad;
                        $actespcomp->idespecialidad = $valor['idespecialidad'];
                        $actespcomp->iddatosnomenclador = $idDatosNom[0]['iddatosnomenclador'];
                        $actespcomp->save();
                    }
                }
            }
        }
    }

    //funcion compartimentar actividad
    public function auxCompartimentarActividadLineal($arresp, $act, $comp) {


        $idDatosNom = NomDatosnomenclador::getDatosNomPorUriDatosNom($comp);

        foreach ($arresp as $idEsp) {
            //buscando especialidades hijas
            if ($idEsp != null && ($idEsp)) {
                DatActespcomportamiento::eliminarCompartimentacion($act->idactividad, $idEsp);
                $actespcomp = new DatActespcomportamiento();
                $actespcomp->idactividad = $act->idactividad;
                $actespcomp->idespecialidad = $idEsp;
                $actespcomp->iddatosnomenclador = $idDatosNom[0]['iddatosnomenclador'];
                $actespcomp->save();
            }
        }
    }

    //funcion duplicar actividad
    public function duplicarActividad($idactorigen, $idpadre, $tfcodigo, $denominacion, $descripcion, $idformato, $idusuario, $idespecialidad, $ultimonivel, $idespecialidadesdem, $idespecialidadcomp, $integrator) {

        $act = new NomActividad();
        if ($idactorigen == $idpadre) {
            //Es del primer nivel
            $act->idpadre = null;
            $act->nivel = 1;
            $act->codigo = $tfcodigo;
            $act->idarbol = null;
        } else {
            //Es del nivel 2 o superior
            $actividadpadre = Doctrine::getTable('NomActividad')->find($idpadre);
            $act->idpadre = $idpadre;
            $act->nivel = $actividadpadre->nivel + 1;
            $act->codigo = $actividadpadre->codigo . $tfcodigo;
            $act->idarbol = $actividadpadre->idarbol;
        }
        // No varian
        $act->denominacion = $denominacion;
        $act->descripcion = $descripcion;
        $act->estado = 0;
        $act->idaprobacion = 1;
        $act->idformato = $idformato;
        $act->idusuario = $idusuario;
        $act->idespecialidad = $idespecialidad;
        $this->Insertar($act);
        if ($act->nivel == $ultimonivel) {
            //Duplicar la asociacion a plan
            $activModelo = DatActividadmodelo:: getModeloActividad($idactorigen);
            if ($activModelo[0]->idactividadmodelo != null) {
                $modelActMod = new DatActividadModeloModel();
                $modelActMod->adicionar($act->idactividad, $activModelo[0]->idmodelo);
            }
            //Duplicar la asociacion a plan de salida
            $activModelosalida = DatActividadmodelosalida::getModeloActividad($idactorigen);
            if ($activModelosalida[0]->idactividadmodelosalida != null) {
                $modelActModsalida = new DatActividadmodelosalida();
                $modelActModsalida->adicionar($act->idactividad, $activModelosalida[0]->idmodelo);
            }
            //Compartimentacion de las actividad
            // especialidad propia
            $idDatosNom = NomDatosnomenclador::getDatosNomPorUriDatosNom('propia');
            $actespcomp = new DatActespcomportamiento();
            $actespcomp->idactividad = $act->idactividad;
            $actespcomp->idespecialidad = $idespecialidad;
            $actespcomp->iddatosnomenclador = $idDatosNom[0]['iddatosnomenclador'];
            $actespcomp->save();
            //especialidades demandantes
            if ($idespecialidadesdem) {
                self::auxCompartimentarActividadLineal($idespecialidadesdem, $act, 'demandada');
            }
            //especialidades compartidas
            if ($idespecialidadcomp) {
                self::auxCompartimentarActividadLineal($idespecialidadcomp, $act, 'compartida');
            }

            //Duplicar las normas
            $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $normas = DatNorma::buscarNormasPorEjercicio($idactorigen, $idejercicio[0]['idejercicio']);
            if ($normas[0]['idindicador'] != null) {
                foreach ($normas as $value) {
                    $normas = new DatNorma();
                    $normas->idactividad = $act->idactividad;
                    $normas->idindicador = $value['idindicador'];
                    $normas->cantbase = $value['cantbase'];
                    $normas->cantplanif = $value['cantplanif'];
                    $normas->version = 1;
                    $normas->idusuario = $idusuario;
                    $normas->idejercicio = $idejercicio[0]['idejercicio'];
                    $normas->necesidad = $value['necesidad'];
                    $normas->fecha = null;
                    $normas->save();
                    //Duplicar reglas asociadas a indicador
                    $reglaNorma = DatRegla::buscarReglas($value['idnorma']);
                    if ($reglaNorma[0]->idregla != null) {
                        foreach ($reglaNorma as $value) {
                            $reglas = new DatRegla();
                            $temp = split('GENERA:', $value->denominacion);
                            $reglas->denominacion = "REGLA DE: " . $act->denominacion . " - GENERA: " . $temp[1];
                            $reglas->idactividaddestino = $value->idactividaddestino;
                            $reglas->valorcontrol = $value->valorcontrol;
                            $reglas->idnorma = $normas->idnorma;
                            $reglas->nivelactividadbase = $value->nivelactividadbase;
                            $reglas->version = 1;
                            $reglas->idusuario = $idusuario;
                            $reglas->idejercicio = $idejercicio[0]['idejercicio'];
                            $reglas->idactividadorigen = $act->idactividad;
                            $reglas->fecha = null;
                            $reglas->save();
                        }
                    }
                }
            }
            //Duplicar las reglas directas desde la actividad(origen)
            $reglaActividad = DatRegla::buscarReglasDirectas($idejercicio[0]['idejercicio'], $idactorigen);
            if ($reglaActividad[0]['idregla'] != null) {
                foreach ($reglaActividad as $value) {
                    $reglas = new DatRegla();
                    $temp = split('GENERA:', $value['denominacion']);
                    $reglas->denominacion = "REGLA DE: " . $act->denominacion . " - Genera: " . $temp[1];
                    $reglas->idactividaddestino = $value['idactividaddestino'];
                    $reglas->valorcontrol = $value['valorcontrol'];
                    $reglas->idnorma = null;
                    $reglas->nivelactividadbase = $value['nivelactividadbase'];
                    $reglas->version = 1;
                    $reglas->idusuario = $idusuario;
                    $reglas->idejercicio = $idejercicio[0]['idejercicio'];
                    $reglas->idactividadorigen = $act->idactividad;
                    $reglas->fecha = null;
                    $reglas->save();
                }
            }
            //Duplicar las salidas
            $salidas = DatSalida:: getSalida($idactorigen);
            if ($salidas[0]['idindicador'] != null) {
                foreach ($salidas as $value) {
                    $salida = new DatSalida();
                    $salida->idactividad = $act->idactividad;
                    $salida->idindicador = $value['idindicador'];
                    $salida->idusuario = $idusuario;
                    $salida->cantidad = $value['cantidad'];
                    $salida->fecha = null;
                    $salida->save();
                }
            }
        } /* else {
          // Buscar actividades descesdientes
          $actvshijasorigen = NomActividad::BuscarHijos($idactorigen);
          //implementar recursividad
          foreach ($actvshijasorigen as $value) {
          }
          } */

        return true;
    }

    private function duplicarNormasActividad($params, $idactorigen, $idnuevaactividad, $idejercicio) {
        $modelnorma = new DatNormaModel();
        $modelnorma->duplicarNormas($params, $idactorigen, $idnuevaactividad, $idejercicio);
        return true;
    }

    private function duplicarReglasActividad($params, $idactorigen, $idnuevaactividad, $idejercicio) {
        $modelregla = new DatNormaModel();
        $modelregla->duplicarReglas($params, $idactorigen, $idnuevaactividad, $idejercicio);
        return true;
    }

    /*     * ************fin de actividades********************** */

    //funcion listar indicadores para buscar, add norma y add salida
    public function listarIndicadorActividades($params) {
        $result = NomIndicador::listarIndicadorActividades($params);
        return $result;
    }

    public function listarActivosAddActivos($params) {
        $result = DatActividadactivofijo::listarActivosAddActivos($params);
        return $result;
    }

    public function listarActivos($params) {
        $result = DatActividadactivofijo::listarActivos($params);
        return $result;
    }

    public function adicionarActivos($params) {
        $almacenados = 0;

        foreach ($params['activos'] as $activo) {

            $actividadConActivo = Doctrine::getTable('DatActividadactivofijo')->findByDql("idactividad = {$params['idactividad']} AND idindicador={$activo->idindicador}");
            if ($actividadConActivo[0]['idindicador'] == null) {
                $nuevoactivo = new DatActividadactivofijo();
                $fechaActual = date("d-m-Y H:i:s");
                if (is_object($nuevoactivo)) {
                    $nuevoactivo->idactividad = $params['idactividad'];
                    $nuevoactivo->cantidad = 1;
                    $nuevoactivo->idindicador = $activo->idindicador;
                    $nuevoactivo->idusuario = $params['idusuario'];
                    $nuevoactivo->fecha = $fechaActual;
                    $nuevoactivo->save();
                    $almacenados++;
                }
            }
        }

        return $almacenados;
    }

    public function eliminarActivos($params) {
        $query = Doctrine_Query::create();
        $query->delete('DatActividadactivofijo')
                ->from('DatActividadactivofijo')
                ->addWhere('idactividad = ?', $params['idactividad'])
                ->whereIn('idindicador', $params['activos']);

        $query->execute();
        return 1;
    }

    public function modificarActivos($params) {
        $fechaActual = date("d-m-Y H:i:s");
        foreach ($params['activos'] as $key => $activo) {
            $modificados = 0;
            $actividadConActivo = Doctrine::getTable('DatActividadactivofijo')->findByDql("idactividad = {$params['idactividad']} AND idindicador={$activo->idindicador}");
            if ($actividadConActivo[0] != null) {

                $actividadConActivo[0]->cantidad = $activo->cantidad;
                $actividadConActivo[0]->idusuario = $params['idusuario'];
                $actividadConActivo[0]->fecha = $fechaActual;
                $actividadConActivo->save();
                $modificados++;
            }
        }
        return $modificados;
    }

    public function actualizarNormadaSegunEjercicioActual($idejercicio) {
        ini_set("max_execution_time", 600); //10min de conexion
//PASOS
        //listar todas las actividades
        //preguntar si tienen algo normado en ese ejercicio
        ////actualizar las actividades:
        //1. poner todas en 0
        //2. las que llevan 1
        $conn = Doctrine_Manager::connection();
        $query = "SELECT act.idactividad
                    FROM mod_planificacion.nom_actividad act
                    INNER JOIN mod_planificacion.dat_norma n ON( n.idactividad = act.idactividad)
                    WHERE n.idejercicio = {$idejercicio}";
        $result = $conn->execute($query);
        $data = $result->fetchAll(PDO::FETCH_COLUMN);

        //Limpio el valor en todas las actividades
        $query = "UPDATE    mod_planificacion.nom_actividad
                      SET       normada = 0";
        $conn->execute($query);

        //Si existe norma
        if ($data[0] != null) {
            $actividades = implode(',', $data);
            //Activo el valor en las que están normadas
            $query = "UPDATE    mod_planificacion.nom_actividad
                      SET       normada = 1
                      WHERE     idactividad IN ({$actividades})";
            $conn->execute($query);
        }
        return 1;
    }

    /*     * ************metodos auxiliares********************* */

    public function calcularCostoDirecto($params) {
        $modelAct = new NomActividad();
        $result = $modelAct->calcularCostoDirecto($params);
        return $result;
    }

    public function cargarEtiquetas($componente) {
        $dirapps = Zend_Registry::getInstance()->config->dir_aplication;
        $idioma = $this->global->Perfil->idioma;
        $etiquetas = file_get_contents($dirapps . "/planificacion/planmeta/views/idioma/{$idioma}/{$componente}/{$componente}.json");
        unset($idioma);
        unset($dirapps);
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
        return $arrayEtiq;
    }

    public function cargarNiveles($integrator) {
        //buscar servicio que devuelva un listado con los niveles del árbol
        //de las actividades, según el formato definido
        /* Obtener el formato de las actividades guardadas en la Base de Datos */
        $idformato = NomActividad::formato($integrator);
        //Obtener nombre del formato
        $nombreformato = $integrator->datosmaestros->buscarFormatoPorID($idformato)->nombre;
        //Obtener la configuracion por nodos de un formato
        $result = array();
        $ultimonivel = 0;
        if ($idformato != null) {
            $result = $integrator->datosmaestros->buscarParteFormato($idformato);
            foreach ($result as $value) {
                if ($value->nivel > $ultimonivel) {
                    $ultimonivel = $value->nivel;
                }
            }
        }
        return array('ultimonivel' => $ultimonivel, 'formato' => $idformato, 'nombreformato' => $nombreformato, 'data' => $result);
    }

    public function listarCentroBalance($integrator) {
        //temporal numero fijo en la BD para Nomdatosnomenclador
        $idcentrobalance = 1;
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);

        foreach ($centrobalance as $k => $valor) {
            $dat[$k]['idcentrobalance'] = $valor['identidaddatosnomenclador'];
            $datosentidad = $integrator->metadatos->DameEstructura($valor['identidad']);
            $dat[$k]['centrobalance'] = $datosentidad[0]->denominacion;
        }

        return array('data' => $dat);
    }

    public function noExisteCodigoAct($codigo, $idActividad = null) {
        $query = new Doctrine_Query();
        $query->select('n.denominacion as denominacion, n.idaprobacion as idaprobacion')
                ->from('NomActividad n')
                ->where('n.codigo = ?', $codigo);
        if ($idActividad != null)
            $query->addWhere('idactividad <> ?', $idActividad);
        $result = $query->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        if (count($result) > 0) {
            return false;
        } else {
            return true;
        }
    }

    public function listarCompartida($params) {
        $temp = NomDatosnomenclador::getDatosNomPorUriDatosNom('compartida');
        $params['iddatosnomenclador'] = $temp[0]['iddatosnomenclador'];
        $result = NomActividad::listarEspPorUriDatosNomenclador($params);
        $integrator = ZendExt_IoC::getInstance();

        foreach ($result->data as $k => $valor) {
            $datosentidad = $integrator->metadatos->DameEstructura($valor['identidad']);
            $result->data[$k]['denominacionentidad'] = $datosentidad[0]->denominacion;

            $datosespecialidad = $integrator->datosmaestros->obtenerEspecialidadPorId($valor['idespecialidad']);
            $result->data[$k]['denominacionespecialidad'] = $datosespecialidad[0]->denespecialidad;
        }
        return $result;
    }

    public function listarDemandada($params) {
        $integrator = ZendExt_IoC::getInstance();
        $temp = NomDatosnomenclador::getDatosNomPorUriDatosNom('demandada');
        $params['iddatosnomenclador'] = $temp[0]['iddatosnomenclador'];
        $result = NomActividad::listarEspPorUri($params);
        foreach ($result->data as $k => $valor) {
            $datosentidad = $integrator->metadatos->DameEstructura($valor['identidad']);
            $result->data[$k]['denominacionentidad'] = $datosentidad[0]->denominacion;
            $datosespecialidad = $integrator->datosmaestros->obtenerEspecialidadPorId($valor['idespecialidad']);
            $result->data[$k]['denominacionespecialidad'] = $datosespecialidad[0]->denespecialidad;
        }
        return $result;
    }

    public function obtenerComportamientoByIdactividad($params) {
        $iddatosnomanclador = array();
        $getIddatosnomanclador = DatActespcomportamiento::obtenerIdDatosNom();
        $iddatosnomanclador[] = $getIddatosnomanclador['propia'];
        $iddatosnomanclador[] = $getIddatosnomanclador['demandada'];
        $iddatosnomanclador[] = $getIddatosnomanclador['compartida'];
        $objectDatActesp = new DatActespcomportamiento();
        $data = $objectDatActesp->getCompartamientos($params, $iddatosnomanclador);
        $integrator = $params['integrator'];
        $result = array();
        foreach ($data as $i => $especialidad) {
            $espp = $integrator->datosmaestros->obtenerEspecialidadPorId(intval($especialidad['idespecialidad']));

            $especialidad['denominacionEsp'] = $espp[0]->denespecialidad;

            if ($especialidad['iddatosnomenclador'] == $getIddatosnomanclador['demandada']) {
                $result['demandada'][] = $especialidad;
            }

            if ($especialidad['iddatosnomenclador'] == $getIddatosnomanclador['compartida']) {
                $result['compartida'][] = $especialidad;
            }

            if ($especialidad['iddatosnomenclador'] == $getIddatosnomanclador['propia']) {
                $result['propia'][] = $especialidad;
            }
        }

        return $result;
    }

    public function listarEspecialidadesCB($especialidades) {
        $obj = new NomActividad();
        return $obj->obtenerEspecialidadesTodas($especialidades);
    }

    /*     * ************fin de metodos auxiliares********************* */
}
