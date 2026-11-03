<?php

class ProyeccionsisplaninversionesModel extends ProyeccionModel {

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
        } else {
            $params['porc'] = 100;
            $importes = self::calcularImportesBase($params);
            $params['importegasto'] = $importes[0]['importegasto'];
            $params['importeingreso'] = $importes[0]['importeingreso'];
            DatProyeccion::adicionarProyeccion($params);
        }
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
            $ent = ProyeccionModel::buscarEntidades($params['identidad']);
            $identidades = implode(",", $ent);
            $arrdenommodelos = explode(",", $params['planes']);
            $arridmodelos = ProyeccionModel::obtenerIds($arrdenommodelos);
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

                if ($params['componente'] == 1)
                    $cant = DatActividadentidadsisplaninversiones::listarDetallesNcont($identidades, $params['idejerciciobase'], $v);
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

                for ($i = 0; $i < $cantpag; $i++) {
                    $params['start'] = $offset;
                    $params['limit'] = $paso;
                    $params['total'] = FALSE;
                    if ($params['componente'] == 1)
                        $arrayAnnos = DatActividadentidadsisplaninversiones::listarDetallesN($identidades, $params['idejerciciobase'], $params['porciento'], $v);
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
                    $cant = DatActividadentidadsisplaninversiones::listarDetallesNcont($identidades, $params['idejerciciobase'], $v);
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
                        $arrayAnnos = DatActividadentidadsisplaninversiones::listarDetallesN($identidades, $params['idejerciciobase'], 100, $v);
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

    //Calcular importes base
    public function calcularImportesBase($params) {
        if ($params['componente'] == 2)
            $importes = DatPlanificacion::calcularImporteTotal($params);
        if ($params['componente'] == 3)
            $importes = DatPlanificacion::calcularImporteTotalB($params);
        if ($params['componente'] == 1)
            $importes = DatActividadentidadsisplaninversiones::calcularImporteTotalN($params);

        return $importes;
    }

}
