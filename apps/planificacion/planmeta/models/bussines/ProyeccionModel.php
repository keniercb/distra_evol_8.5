<?php

class ProyeccionModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    //Listar grid de proyecciones
    public function listarProyeccion($params) {
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $condiciones[] = "upper(p.denominacion) LIKE  "
                            . ("'%"
                            . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                } elseif ($datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(p.descripcion) LIKE  "
                            . ("'%"
                            . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'");
                } elseif ($datos['field'] == 'fecha') {
                    if ($datos['data']['comparison'] == 'gt'
                    ) {
                        $fecha = (date_format(
                                        date_create($datos['data']['value']), 'd/m/Y'
                        ));
                        $condiciones[] = "   fecha > '"
                                . $fecha . "'";
                    }
                    if ($datos['data']['comparison'] == 'lt'
                    ) {
                        $fecha = (date_format(
                                        date_create($datos['data']['value']), 'd/m/Y'
                        ));
                        $condiciones[] = "   fecha <  '"
                                . $fecha
                                . "'";
                    }
                    if ($datos['data']['comparison'] == 'eq'
                    ) {
                        $fecha = (date_format(
                                        date_create($datos['data']['value']), 'd/m/Y'
                        ));
                        $condiciones[] = "   fecha = '"
                                . $fecha
                                . "'";
                    }
                } elseif ($datos['field'] == 'componente') {
                    $componente = array();
                    $componente = split(
                            ",", $datos['data']['value']
                    );
                    $idcomponente = array();

                    foreach ($componente as $dat) {
                        if ($dat == 'Niveles de actividad') {
                            $idcomponente[] = 1;
                        }
                        if ($dat == 'Plan') {
                            $idcomponente[] = 2;
                        }
                        if ($dat == 'Balance material') {
                            $idcomponente[] = 3;
                        }
                    }
                    $idcomponente = implode(',', $idcomponente);
                    $condiciones[] = "p.componente IN ($idcomponente)";
                } elseif ($datos['field'] == 'tipo') {
                    $tipo = array();
                    $tipo = split(
                            ",", $datos['data']['value']
                    );
                    $idtipo = array();

                    foreach ($tipo as $dat) {
                        if ($dat == 'Lineal') {
                            $idtipo[] = 1;
                        }
                        if ($dat == 'Progresiva') {
                            $idtipo[] = 0;
                        }
                    }
                    $idtipo = implode(',', $idtipo);
                    $condiciones[] = "p.lineal IN ($idtipo)";
                } else if ($datos['field'] == 'planes'
                ) {
                    $condiciones[] = "(SELECT list(m.denominacion) FROM mod_planificacion.dat_modelo m where m.idmodelo = ANY (p.planes) ) LIKE  "
                            . ("'%"
                            . $datos['data']['value'] . "%'");
                } else if ($datos['field'] == 'ejerciciobase'
                ) {
                    $condiciones[] = "p.idejerciciobase = {$datos ['data']['value']}";
                } else if ($datos['field'] == 'importeingreso'
                ) {
                    $sqlII = "p.importeingreso";
                    if ($datos['data']['comparison'] == 'lt'
                    ) {
                        $sqlII = $sqlII
                                . "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt'
                        ) {
                            $sqlII = $sqlII
                                    . ">";
                        } else {
                            $sqlII = $sqlII
                                    . "=";
                        }
                    }
                    $condiciones[] = $sqlII
                            . $datos['data']['value'];
                } else if ($datos['field'] == 'importegasto'
                ) {
                    $sqlIG = "p.importegasto";
                    if ($datos['data']['comparison'] == 'lt'
                    ) {
                        $sqlIG = $sqlIG
                                . "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt'
                        ) {
                            $sqlIG = $sqlIG
                                    . ">";
                        } else {
                            $sqlIG = $sqlIG
                                    . "=";
                        }
                    }
                    $condiciones[] = $sqlIG
                            . $datos['data']['value'];
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
        $params['where'] = $WHERE;
        $params['total'] = FALSE;
        $data->data = DatProyeccion::listarProyeccion($params);
        $params['total'] = TRUE;
        $data->total = DatProyeccion::listarProyeccion($params);
        $data->total = $data->total[0]['count'];
        return $data;
    }

    //Listar grid de proyecciones x ejercicio
    public function listarProyeccionporejercicio($params) {
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'ejercicioproyectado'
                ) {
                    $condiciones[] = "pe.idejercicioproyectado = {$datos ['data']['value']}";
                } else if ($datos['field'] == 'importeingreso'
                ) {
                    $sqlII = "pe.importeingreso";
                    if ($datos['data']['comparison'] == 'lt'
                    ) {
                        $sqlII = $sqlII
                                . "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt'
                        ) {
                            $sqlII = $sqlII
                                    . ">";
                        } else {
                            $sqlII = $sqlII
                                    . "=";
                        }
                    }
                    $condiciones[] = $sqlII
                            . $datos['data']['value'];
                } else if ($datos['field'] == 'importegasto'
                ) {
                    $sqlIG = "pe.importegasto";
                    if ($datos['data']['comparison'] == 'lt'
                    ) {
                        $sqlIG = $sqlIG
                                . "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt'
                        ) {
                            $sqlIG = $sqlIG
                                    . ">";
                        } else {
                            $sqlIG = $sqlIG
                                    . "=";
                        }
                    }
                    $condiciones[] = $sqlIG
                            . $datos['data']['value'];
                } else if ($datos['field'] == 'porciento'
                ) {
                    $sqlimporte = "pe.porciento";
                    if ($datos['data']['comparison'] == 'lt'
                    ) {
                        $sqlimporte = $sqlimporte
                                . "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt'
                        ) {
                            $sqlimporte = $sqlimporte
                                    . ">";
                        } else {
                            $sqlimporte = $sqlimporte
                                    . "=";
                        }
                    }
                    $condiciones[] = $sqlimporte
                            . $datos['data']['value'];
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

        $params['where'] = $WHERE;
        $params['total'] = FALSE;
        $data->data = DatProyeccionporejercicio::listarProyeccionporejercicio($params);
        $params['total'] = TRUE;
        $data->total = DatProyeccionporejercicio::listarProyeccionporejercicio($params);
        $data->total = $data->total[0]['count'];
        return $data;
    }

    //Adicionar o modificar una proyeccion
    public function adicionarProyeccion($params) {
        if ($params['idproyeccion']) {
            $proy = Doctrine::getTable('DatProyeccion')->findByDql("idproyeccion = {$params['idproyeccion']}");
            if ($proy[0]->porciento != $params['porciento']) {
                $proy[0]->porciento = $params['porciento'];
                $params['cambiarXejercicio'] = 1;
                $params['cambiarPorciento'] = 1;
            }
            if ($proy[0]->idejerciciobase != $params['idejercicio'] || $proy[0]->componente != $params['componente'] || $proy[0]->planes != "{" . $params['planes'] . "}") {
                if ($proy[0]->idejerciciobase != $params['idejercicio'])
                    $proy[0]->idejerciciobase = $params['idejercicio'];
                if ($proy[0]->componente != $params['componente'])
                    $proy[0]->componente = $params['componente'];
                if ($proy[0]->planes != "{" . $params['planes'] . "}")
                    $proy[0]->planes = "{" . $params['planes'] . "}";

                $params['porc'] = 100;
                $importes = self::calcularImportesBase($params);
                $proy[0]->importegasto = $importes[0]['importegasto'];
                $proy[0]->importeingreso = $importes[0]['importeingreso'];
                $params['cambiarXejercicio'] = 1;
            }
            $params['proyeccion'] = $proy[0];
            DatProyeccion::modificarProyeccion($params);
        }
        else {
            $params['porc'] = 100;
            $importes = self::calcularImportesBase($params);
            $params['importegasto'] = $importes[0]['importegasto'];
            $params['importeingreso'] = $importes[0]['importeingreso'];
            DatProyeccion::adicionarProyeccion($params);
        }
        return 1;
    }

    //Adicionar o modificar una proyeccion por ejercicio
    public function adicionarProyeccionporejercicio($params) {
        $existeproyejerc = DatProyeccionporejercicio::verificarExistetciaEjercicio($params);
        if (count($existeproyejerc) != 0)
            return 3;
        else {
            if ($params['idproyeccionxejercicio']) {
                $proyxejercicio = Doctrine::getTable('DatProyeccionporejercicio')
                        ->findByDql("idproyeccionporejercicio = {$params['idproyeccionxejercicio']}");
                if ($params['tipo'] == 1) {
                    if ($proyxejercicio[0]->porciento != $params['porciento']) {
                        $proyxejercicio[0]->porciento = $params['porciento'];

                        $proyxejercicio[0]->importegasto = $params['porciento'] * $params['importegasto'] / 100;
                        $proyxejercicio[0]->importeingreso = $params['porciento'] * $params['importeingreso'] / 100;
                    }
                }
                if ($proyxejercicio[0]->idejercicioproyectado != $params['idejercicio'])
                    $proyxejercicio[0]->idejercicioproyectado = $params['idejercicio'];

                $params['proyxejercicio'] = $proyxejercicio[0];
                DatProyeccionporejercicio::modificarProyeccionxejercicio($params);
            }
            else {
                $order = DatProyeccionporejercicio::obtenerOrden($params);
                $params['orden'] = $order;
                if ($params['tipo'] == 1) {
                    $params['importegasto'] = $params['porciento'] * $params['importegasto'] / 100;
                    $params['importeingreso'] = $params['porciento'] * $params['importeingreso'] / 100;
                } else {
                    $ultporciento = DatProyeccionporejercicio::obtenerPorcientoUltimo($params);
                    if ($ultporciento == -1)
                        $auxporciento = $params['porciento'];
                    else {
                        $auxporciento = $ultporciento * $params['porciento'] / 100;
                    }
                    $params['importegasto'] = $auxporciento * $params['importegasto'] / 100;
                    ;
                    $params['importeingreso'] = $auxporciento * $params['importeingreso'] / 100;

                    $params['porciento'] = $auxporciento;
                }
                DatProyeccionporejercicio::adicionarProyeccionxejercicio($params);
            }
            return 1;
        }
    }

    //Eliminar proyecciones
    public function eliminarProyeccion($idproyecciones) {
        DatProyeccion::eliminarProyeccion($idproyecciones);
        return 1;
    }

    //Eliminar proyecciones por ejercicio
    public function eliminarProyeccionxejercicio($idproyeccionporejercicio) {
        DatProyeccionporejercicio::eliminarProyeccionxejercicio($idproyeccionporejercicio);
        return 1;
    }

    //Eliminar proyecciones por ejercicio todos
    public function eliminarProyeccionxejercicioTodos($idproyeccion) {
        DatProyeccionporejercicio::eliminarProyeccionxejercicioTodos($idproyeccion);
        return 1;
    }

    //Exportar
    public function exportarAExcel($params) {
        if ($params['tipo'] == 'resumen')
            $titulo = 'Resumen';
        if ($params['tipo'] == 'detalles')
            $titulo = 'Detalles';
        if ($params['tipo'] == 'general')
            $titulo = 'General';

        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header(
                'Content-Disposition: attachment;filename='
                . $titulo . '.xls'
        );
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';

        echo "<div > 
	<div style = 'margin-left: 40px'>  
	<h2 style=\"font-family: Arial; font-size: 12px;\">Proyección de la planificación <br> 
	$titulo 
        <br> 
        </h2>         
        Entidad: {$params['entidad']}<br>            
        Componente: {$params['comp']}<br>
        Planes: {$params['planes']}<br>
        Tipo: {$params['tipoProy']}<br>
        Ejercicio base: {$params['ejerciciobase']}<br>
        Importe total ingresos: {$params['importeingreso']}<br>
        Importe total gastos: {$params['importegasto']}<br>
        <br>
	</div> 
	</div>";

        echo "<table border=1>\n";
        echo "<tr>";
        echo '<th>No.</th>';
        echo '<th>Ejercicio proyectado</th>';
        echo '<th>Porciento</th>';
        echo '<th>Importe ingreso</th>';
        echo '<th>Importe gasto</th>';
        echo "</tr>";
        $params['total'] = TRUE;
        $params['where'] = "";

        $cant = DatProyeccionporejercicio::listarProyeccionporejercicio($params);
        $cant = $cant[0]['count'];

        $cantxpag = 1000;
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
            $params['total'] = FALSE;
            $arrayAnnos = DatProyeccionporejercicio::listarProyeccionporejercicio($params);

            $offset += $paso;

            foreach ($arrayAnnos as $anno) {
                echo "<tr>";
                echo "<td align=left>" . $anno['numero'] . "</td>";
                echo "<td align=left>" . $anno['ejercicioproyectado'] . "</td>";
                echo "<td align=rigth>" . $anno['porciento'] . "</td>";
                echo "<td align=rigth>" . $anno['importeingreso'] . "</td>";
                echo "<td align=rigth>" . $anno['importegasto'] . "</td>";

                unset($arrayAnnos[$k]);
                echo "</tr>";
            }
            unset($arrayAnnos);
        }
        echo "</table>\n";

        if ($params['tipo'] == 'detalles' || $params['tipo'] == 'general') {
            $ent = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
            $identidades = implode(",", $ent);
            $arrdenommodelos = explode(",", $params['planes']);
            $arridmodelos = self::obtenerIds($arrdenommodelos);
            $arridmodelos = explode(",", $arridmodelos);
        }


        if ($params['tipo'] == 'detalles') {
            foreach ($arridmodelos as $key => $v) {
                echo "<div > 
	<div style = 'margin-left: 40px'>  
	<h2 style=\"font-family: Arial; font-size: 12px;\">Plan: $arrdenommodelos[$key]
        </h2>   
	</div> 
	</div>";

                echo "<table border=1>\n";
                echo "<tr>";
                echo '<th>Código</th>';
                echo '<th>Denominación</th>';
                if ($params['componente'] != 1)
                    echo '<th>UM</th>';

                if ($params['componente'] != 1)
                    echo '<th>Cantidad</th>';
                else
                    echo '<th>Nivel de actividad</th>';

                echo '<th>Importe ingreso</th>';
                echo '<th>Importe gasto</th>';
                echo "</tr>";
                $params['total'] = TRUE;
                $params['where'] = "";

                $modeloActEnt = new DatActividadentidad();
                if ($params['componente'] == 1)
                    $cant = DatActividadentidad::listarDetallesNcont($identidades, $params['idejerciciobase'], $v);
                if ($params['componente'] == 2)
                    $cant = DatPlanificacion::listarDetallescont($identidades, $params['idejerciciobase'], $v);
                if ($params['componente'] == 3)
                    $cant = DatPlanificacion::listarDetallesBcont($identidades, $params['idejerciciobase'], $v);
                $cant = $cant[0];

                $cantxpag = 1000;
                $cantpag = (int) ($cant / $cantxpag);
                if (fmod($cant, $cantxpag) > 0) {
                    $cantpag++;
                }
                unset($cant);

                $offset = 0; //start
                $paso = $cantxpag; //limit
                $modeloActEnt = new DatActividadentidad();

                for ($i = 0; $i < $cantpag; $i++) {
                    $params['start'] = $offset;
                    $params['limit'] = $paso;
                    $params['total'] = FALSE;
                    if ($params['componente'] == 1)
                        $arrayAnnos = DatActividadentidad::listarDetallesN($identidades, $params['idejerciciobase'], $params['porciento'], $v);
                    if ($params['componente'] == 2)
                        $arrayAnnos = DatPlanificacion::listarDetalles($identidades, $params['idejerciciobase'], $v, $params['porciento']);
                    if ($params['componente'] == 3)
                        $arrayAnnos = DatPlanificacion::listarDetallesB($identidades, $params['idejerciciobase'], $v, $params['porciento']);

                    $offset += $paso;

                    foreach ($arrayAnnos as $anno) {
                        echo "<tr>";
                        echo "<td align=left>" . $anno['codigo'] . "</td>";
                        echo "<td align=left>" . $anno['denominacion'] . "</td>";
                        if ($params['componente'] != 1)
                            echo "<td align=left>" . $anno['abreviaturaunidadmedida'] . "</td>";
                        echo "<td align=rigth>" . round($anno['cantidad'], 6) . "</td>";
                        echo "<td align=rigth>" . round($anno['importeingreso'], 3) . "</td>";
                        echo "<td align=rigth>" . round($anno['importegasto'], 3) . "</td>";

                        unset($arrayAnnos[$k]);
                        echo "</tr>";
                    }
                    unset($arrayAnnos);
                }
                echo "</table>\n";
            }
        }

        if ($params['tipo'] == 'general') {

            foreach ($arridmodelos as $key => $v) {
                echo "<div > 
	<div style = 'margin-left: 40px'>  
	<h2 style=\"font-family: Arial; font-size: 12px;\">" . $arrdenommodelos[$key] . " 
        </h2>   
	</div> 
	</div>";

                echo "<table border=1>\n";
                echo "<tr>";
                if ($params['componente'] != 1)
                    echo '<th colspan="3">Datos del indicador</th>';
                else {
                    echo '<th colspan="2">Datos de la actividad</th>';
                }

                echo "<th colspan=3> Ejercicio base: " . $params['ejerciciobase'] . "</th>";
                $ejerciciosProyectados = DatProyeccionporejercicio::listarEjerciciosPorProyeccion($params);
                foreach ($ejerciciosProyectados as $key => $value) {
                    echo "<th colspan=3>" . $value['ejercicio'] . "</th>";
                }
                echo "</tr>";

                echo "<tr>";
                echo '<th>Código</th>';
                echo '<th>Denominación</th>';
                if ($params['componente'] != 1)
                    echo '<th>UM</th>';
                if ($params['componente'] != 1)
                    echo '<th>Cantidad</th>';
                else
                    echo '<th>Nivel de actividad</th>';
                echo '<th>Importe ingreso</th>';
                echo '<th>Importe gasto</th>';
                foreach ($ejerciciosProyectados as $value) {
                    if ($params['componente'] != 1)
                        echo '<th>Cantidad</th>';
                    else
                        echo '<th>Nivel de actividad</th>';
                    echo '<th>Importe ingreso</th>';
                    echo '<th>Importe gasto</th>';
                }
                echo "</tr>";

                $params['total'] = TRUE;
                $params['where'] = "";
                $modeloActEnt = new DatActividadentidad();

                if ($params['componente'] == 1)
                    $cant = DatActividadentidad::listarDetallesNcont($identidades, $params['idejerciciobase'], $v);
                if ($params['componente'] == 2)
                    $cant = DatPlanificacion::listarDetallescont($identidades, $params['idejerciciobase'], $v);
                if ($params['componente'] == 3)
                    $cant = DatPlanificacion::listarDetallesBcont($identidades, $params['idejerciciobase'], $v);
                $cant = $cant[0];

                $cantxpag = 1000;
                $cantpag = (int) ($cant / $cantxpag);
                if (fmod($cant, $cantxpag) > 0) {
                    $cantpag++;
                }
                unset($cant);

                $offset = 0; //start
                $paso = $cantxpag; //limit

                $modeloActEnt = new DatActividadentidad();
                for ($i = 0; $i < $cantpag; $i++) {
                    $params['start'] = $offset;
                    $params['limit'] = $paso;
                    $params['total'] = FALSE;

                    if ($params['componente'] == 1)
                        $arrayAnnos = DatActividadentidad::listarDetallesN($identidades, $params['idejerciciobase'], 100, $v);
                    if ($params['componente'] == 2)
                        $arrayAnnos = DatPlanificacion::listarDetalles($identidades, $params['idejerciciobase'], $v, 100);
                    if ($params['componente'] == 3)
                        $arrayAnnos = DatPlanificacion::listarDetallesB($identidades, $params['idejerciciobase'], $v, 100);

                    $offset += $paso;

                    foreach ($arrayAnnos as $anno) {
                        echo "<tr>";
                        echo "<td align=left>" . $anno['codigo'] . "</td>\n";
                        echo "<td align=left>" . $anno['denominacion'] . "</td>\n";
                        if ($params['componente'] != 1)
                            echo "<td align=left>" . $anno['abreviaturaunidadmedida'] . "</td>\n";

                        echo "<td align=rigth>" . round($anno['cantidad'], 6) . "</td>\n";
                        echo "<td align=rigth>" . round($anno['importeingreso'], 3) . "</td>\n";
                        echo "<td align=rigth>" . round($anno['importegasto'], 3) . "</td>\n";

                        foreach ($ejerciciosProyectados as $value) {
                            echo "<td align=rigth>" . round(($anno['cantidad'] * $value['porciento'] / 100), 6) . "</td>\n";
                            echo "<td align=rigth>" . round(($anno['importeingreso'] * $value['porciento'] / 100), 3) . "</td>\n";
                            echo "<td align=rigth>" . round(($anno['importegasto'] * $value['porciento'] / 100), 3) . "</td>\n";
                        }
                        unset($arrayAnnos[$k]);
                        echo "</tr>";
                    }
                    unset($arrayAnnos);
                }
                echo "</table>\n";
            }
        }

        echo '</BODY></HTML>';
    }

    /*     * *******Metodos auxiliares*************** */

    //Listar ejercicios para filtros de los grids
    public function listarEjercicios() {
        $data = NomEjercicioplanificacion::listarEjercicio();
        return $data;
    }

    //Listar planes para filtros del grid de proyecciones
    public function listarPlanes() {
        $data = DatModelo::listarModelos();
        return $data;
    }

    //Calcular importes base
    public function calcularImportesBase($params) {
        $modeloActEnt = new DatActividadentidad();
        if ($params['componente'] == 2)
            $importes = DatPlanificacion::calcularImporteTotal($params);
        if ($params['componente'] == 3)
            $importes = DatPlanificacion::calcularImporteTotalB($params);
        if ($params['componente'] == 1)
            $importes = DatActividadentidad::calcularImporteTotalN($params);

        return $importes;
    }

    //Obtener ids dadas denominaciones
    public function obtenerIds($arrdenominaciones) {
        $ids = "";
        foreach ($arrdenominaciones as $key => $value) {
            $aux = Doctrine::getTable(
                            "DatModelo"
                    )->findByDql(
                    "denominacion like '$value'"
            );
            if ($key != 0)
                $ids.=',' . $aux[0]->idmodelo;
            else
                $ids.=$aux[0]->idmodelo;
        }
        return $ids;
    }

}
