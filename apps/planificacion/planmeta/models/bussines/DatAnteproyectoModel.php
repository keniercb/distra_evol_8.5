<?php

class DatAnteproyectoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardatAnteproyecto(DatAnteproyecto $datAnteproyecto)
    {
        $datAnteproyecto->save();
        return $datAnteproyecto;
    }

    public function modificardatAnteproyecto($datAnteproyecto)
    {
        $datAnteproyecto->save();
    }

    public function eliminardatAnteproyecto($datAnteproyecto)
    {
        $datAnteproyecto->delete();
    }

    public function eliminarAnteproyectosDadoIds($ids)
    {
        $query = Doctrine_Query::create();
        $query->addWhere('ap.idaprobacion <> 4');
        $query->delete('DatAnteproyecto ap')->whereIn(
            'ap.idanteproyecto', $ids
        );
        return $query->execute();
    }

    public function aprobarDesaprobarDocumentos($idsdocs, $aprobar, $rector)
    {
        $query = Doctrine_Query::create();

        if ($aprobar != 0) {
            if ($rector) {
                $value = 4;
            } else {
                $value = 3;
            }

            $query->update('DatAnteproyecto')->set('idaprobacion', $value)
                ->whereIn('idanteproyecto', $idsdocs);
            return $query->execute();
        } else {
            $value = 1;

            $query->update('DatAnteproyecto')->set('idaprobacion', $value)
                ->whereIn('idanteproyecto', $idsdocs);
            return $query->execute();
            /*foreach ($idsdocs as $value) {
                $tb = Doctrine::getTable('DatAnteproyecto')->find($value);
                if ($tb->idaprobacion == 3 || $tb->idaprobacion == 4) {
                    $tb->idaprobacion = 1;
                    $tb->save();
                    $resultado = 1;
                } else {
                    $vers = DatPlanificacionnae::ultimaVersion($tb->numero, 0);
                    if ($vers[0]['MAX'] == $tb->version) {
                        $resultado
                            = DatPlanificacionnae::duplicarModificarDocumento(
                            $tb->idanteproyecto, $tb->idusuario, array(),
                            array(), 1
                        );
                    } else {
                        $resultado = 3;
                    }
                }

            }
            return $resultado;*/
        }

    }

    public function exportarPorPartidas($parametros)
    {
        if ($parametros->idreporte == 2) {
            $result = NomEjercicioplanificacion::listarEjercicioActual();
            $parametros->idejercicio = $result[0]['idejercicio'];
            $parametros->denomejercicio = $result[0]['ejercicio'];
        }

        $contador = 0;
        if ($parametros->partidas == "" && $parametros->recursos == "") {

            $todaspartidasaux = self::listarTodasLasPartidasPadresGastos($mostrarCodigo = true);
            foreach ($todaspartidasaux->data as $key => $valorPar) {
                $partidas[$contador]['idpartida'] = $valorPar['idpartida'];
                $partidas[$contador]['codigo'] = $valorPar['codigo'];
                $partidas[$contador]['denominacion'] = $valorPar['denominacion'];
                $partidas[$contador]['tipo'] = $valorPar['tipo'];
                $contador++;
            }

            $todaspartidasaux122 = self::listarTodasLasPartidasRecursos($mostrarCodigo = true);
            foreach ($todaspartidasaux122->data as $key => $valorParr) {
                $partidas[$contador]['idrecurso'] = $valorParr['idrecurso'];
                $partidas[$contador]['codigo'] = $valorParr['codigo'];
                $partidas[$contador]['denominacion'] = $valorParr['denominacion'];
                $partidas[$contador]['tipo'] = $valorParr['tipo'];
                $contador++;
            }

            $datosPintarGasto = DatAnteproyecto::obtenerObjGastoParaPintar(
                $parametros
            );

            $datosPintarRecurso = DatAnteproyecto::obtenerObjRecursoParaPintar($parametros);


        } else if ($parametros->partidas != "" && $parametros->recursos == "") {
            $todaspartidasaux1 = self::listarTodasLasPartidasPadresGastos($mostrarCodigo = true);
            $partidasaux1 = explode(',', $parametros->partidas);
            foreach ($todaspartidasaux1->data as $valorPar) {
                if (in_array($valorPar['idpartida'], $partidasaux1)) {
                    $partidas[$contador]['idpartida'] = $valorPar['idpartida'];
                    $partidas[$contador]['codigo'] = $valorPar['codigo'];
                    $partidas[$contador]['denominacion'] = $valorPar['denominacion'];
                    $partidas[$contador]['tipo'] = $valorPar['tipo'];
                    $contador++;
                }
            }

            $datosPintarGasto = DatAnteproyecto::obtenerObjGastoParaPintar($parametros);
            $datosPintarRecurso = array();

        } else if ($parametros->partidas == "" && $parametros->recursos != "") {
            $todaspartidasaux12 = self::listarTodasLasPartidasRecursos($mostrarCodigo = true);
            $partidasaux1 = explode(',', $parametros->recursos);
            foreach ($todaspartidasaux12->data as $valorPar1) {
                if (in_array($valorPar1['idrecurso'], $partidasaux1)) {
                    $partidas[$contador]['idpartida'] = $valorPar1['idrecurso'];
                    $partidas[$contador]['codigo'] = $valorPar1['codigo'];
                    $partidas[$contador]['denominacion'] = $valorPar1['denominacion'];
                    $partidas[$contador]['tipo'] = $valorPar1['tipo'];
                    $contador++;
                }
            }

            $datosPintarGasto = array();

            $datosPintarRecurso = DatAnteproyecto::obtenerObjRecursoParaPintar(
                $parametros
            );
        }

        if ($parametros->idreporte == 1) {
            $tabla .= '<tr><h1 style="padding-top: 20px; text-align: center"><strong>Resumen de Presupuesto por Partidas</strong></h1></tr>';
            $tabla .= '<p style="text-align: center"><strong>Entidad:</strong> ' . $parametros->denomentidad . '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <strong>Ejercicio:</strong> ' . $parametros->denomejercicio . '</p>';
            $tabla .= '<br>';
            $tabla
                .= '<table border="1" bordercolor="black"  width="50%"  cellpadding="0"
                        cellspacing="0" style=" margin-top:0.1cm; margin-left: auto; margin-right: auto;">';
            if ($parametros->resumen == "false" && $parametros->general == "false") {

                foreach ($parametros->naes as $valorNae) {
                    $totalPresupuestoNae = 0;
                    $totalPresupuestoNae1 = 0;
                    $dibujar = true;
                    $dibujaraux = true;
                    $dibujaraux1 = true;
                    $denominacionNae = NomNae::obtenerTodasNaes($valorNae);


                    //aki se comprueba si el idnae actual esta en el arrglo $datosPintarGasto que devuelve los datos de los objetos de gastos y devuelve la denominacion del NAE
                    $existeNaeEnObjetogasto = self::get_value_from_array(
                        $valorNae, $datosPintarGasto, 'idnae', 'denominacionnae'
                    );

                    //aki se comprueba si el idnae actual esta en el arrglo $datosPintarRecurso que devuelve los datos de los recursos financieros y devuelve la denominacion del NAE
                    $existeNaeEnRecursoFinanciero = self::get_value_from_array(
                        $valorNae, $datosPintarRecurso, 'idnae',
                        'denominacionnae'
                    );

                    if (($existeNaeEnObjetogasto[0] != "")
                        || ($existeNaeEnRecursoFinanciero[0] != "")
                    ) {

                        foreach ($partidas as $valorPartidas) {
                            $totalPresupuestoComp = 0;
                            $totalPresupuestoComp1 = 0;
                            $existeParEnObjetogasto = false;
                            $existeParEnRecursoFinanciero = false;

                            foreach ($datosPintarGasto as $valorGastoAux) {
                                if ($valorGastoAux['codigogastodividido'] == $valorPartidas['codigo'] && $valorGastoAux['idnae'] == $valorNae) {
                                    $existeParEnObjetogasto = true;
                                    $totalPresupuestoComp += $valorGastoAux['presupuestoactual'];
                                }
                            }

                            foreach ($datosPintarRecurso as $valorRecursoAux) {
                                if ($valorRecursoAux['codigorecurso']
                                    == $valorPartidas['codigo']
                                    && $valorRecursoAux['idnae'] == $valorNae
                                ) {
                                    $existeParEnRecursoFinanciero = true;
                                    $totalPresupuestoComp1 += $valorRecursoAux['presupuestoactual'];
                                }
                            }

                            if ($existeParEnObjetogasto
                                || $existeParEnRecursoFinanciero
                            ) {

                                if ($dibujar && ($totalPresupuestoComp != 0 || $totalPresupuestoComp1 != 0) ) {
                                    $dibujar = false;
                                    $tabla
                                        .= '<thead>
                        <td colspan="4" style="text-align: center"><strong> '
                                        . $denominacionNae[0]['codigo']
                                        . '-'
                                        . $denominacionNae[0]['denominacion']
                                        . '<strong></td>';


                                    $tabla
                                        .= '<thead>
                        <td style="text-align: center"><strong>Código</strong> </td>
                        <td style="text-align: center"><strong>Denominación</strong> </td>
                        <td style="text-align: center"><strong>Tipo</strong> </td>
                        <td style="text-align: center"><strong>Presupuesto</strong> </td>';
                                }

                                foreach ($datosPintarGasto as $valorGasto) {
                                    if ($valorNae == $valorGasto['idnae']
                                        && $valorGasto['codigogastodividido']
                                        == $valorPartidas['codigo']
                                    ) {
                                        $tabla
                                            .= '<tr style="text-align:CENTER;" >

										<td  width="">'
                                            . $valorGasto['codigogasto']
                                            . '</td>
										<td  width="">'
                                            . $valorGasto['denominacion'] . '</td>
										<td  width="">Gasto</td>
										<td  width="">'
                                            . number_format($valorGasto['presupuestoactual'], '3', '.', ',') . '</td>
									</tr>
								  </thead>';
                                        $totalPresupuestoNae += $valorGasto['presupuestoactual'];
                                    }
                                }

                                if ($dibujaraux && $totalPresupuestoNae != 0) {
                                    $dibujaraux = false;
                                    $tabla
                                        .= '<tr style="text-align:CENTER;" >
										<td style="text-align: left;background-color:#BBBBBB;" colspan="3"><strong>Total</strong></td>
										<td  style="text-align: center;background-color:#BBBBBB;">'
                                        . number_format(
                                            $totalPresupuestoNae, '3', '.', ','
                                        ) . '</td>
									</tr>';
                                }

                                foreach ($datosPintarRecurso as $valorRecurso) {
                                    if ($valorNae == $valorRecurso['idnae']
                                        && $valorRecurso['codigorecurso']
                                        == $valorPartidas['codigo']
                                    ) {
                                        $tabla
                                            .= '<tr style="text-align:CENTER;" >
										<td  width="">'
                                            . $valorRecurso['codigorecurso'] . '</td>
										<td  width="">'
                                            . $valorRecurso['denominacion'] . '</td>
										<td  width="">Recurso</td>
										<td  width="">'
                                            . number_format($valorRecurso['presupuestoactual'], '3', '.', ',')
                                            . '</td>
									</tr>
								  </thead>';
                                        $totalPresupuestoNae1 += $valorRecurso['presupuestoactual'];
                                    }
                                }

                            }
                        }
                        if ($dibujaraux1 && $totalPresupuestoNae1 != 0) {
                            $dibujaraux1 = false;
                            $tabla
                                .= '<tr style="text-align:CENTER;" >
										<td style="text-align: left;background-color:#BBBBBB;" colspan="3"><strong>Total</strong></td>
										<td  style="text-align: center;background-color:#BBBBBB;">'
                                . number_format(
                                    $totalPresupuestoNae1, '3', '.', ','
                                ) . '</td>
									</tr>';
                        }
                    }
                }


            } else if ($parametros->resumen == "true" && $parametros->general == "false") {

                foreach ($parametros->naes as $valorNae) {
                    $totalPresupuestoNae1 = 0;
                    $totalPresupuestoNae11 = 0;
                    $dibujar1 = true;
                    $total = "";
                    $noEntro = true;
                    $denominacionNae = NomNae::obtenerTodasNaes($valorNae);


                    //aki se comprueba si el idnae actual esta en el arrglo $datosPintarGasto que devuelve los datos de los objetos de gastos y devuelve la denominacion del NAE
                    $existeNaeEnObjetogasto = self::get_value_from_array(
                        $valorNae, $datosPintarGasto, 'idnae', 'denominacionnae'
                    );

                    //aki se comprueba si el idnae actual esta en el arrglo $datosPintarRecurso que devuelve los datos de los recursos financieros y devuelve la denominacion del NAE
                    $existeNaeEnRecursoFinanciero = self::get_value_from_array(
                        $valorNae, $datosPintarRecurso, 'idnae',
                        'denominacionnae'
                    );

                    if ($existeNaeEnObjetogasto[0] != ""
                        || $existeNaeEnRecursoFinanciero[0] != ""
                    ) {

                        $datosGastoRecurso = array_merge($datosPintarGasto,$datosPintarRecurso);


                        foreach ($partidas as $valorPartidas) {
                            $totalPresupuesto = 0;
                            $totalPresupuesto1 = 0;
                            $existeParEnObjetogasto = false;
                            $existeParEnRecursoFinanciero = false;

                            foreach ($datosGastoRecurso as $ind => $valorGastoRecAux) {
                                if ($valorGastoRecAux['codigogastodividido'] == $valorPartidas['codigo'] && $valorGastoRecAux['idnae'] == $valorNae && $valorPartidas['tipo'] == 'Gasto') {
                                    $existeParEnObjetogasto = true;
                                    $totalPresupuesto += $valorGastoRecAux['presupuestoactual'];
                                    $totalPresupuestoNae1 += $valorGastoRecAux['presupuestoactual'];
                                    $total = '<tr style="text-align:LEFT;" >
										<td style="t
                               ext-align: left;background-color:#BBBBBB;" colspan="3"><strong>Total</strong></td>
										<td  style="text-align: center;background-color:#BBBBBB;">'
                                        . number_format($totalPresupuestoNae1, '3', '.', ',') . '</td>
									</tr>';
                                } else if ($valorGastoRecAux['codigorecurso'] == $valorPartidas['codigo'] && $valorGastoRecAux['idnae'] == $valorNae) {
                                    $tabla .= $total;
                                    $total = "";
                                    $noEntro = false;
                                    $existeParEnRecursoFinanciero = true;
                                    $totalPresupuesto1 += $valorGastoRecAux['presupuestoactual'];
                                    $totalPresupuestoNae11 += $valorGastoRecAux['presupuestoactual'];
                                }
                            }
                            if ($existeParEnObjetogasto
                                || $existeParEnRecursoFinanciero
                            ) {

                                if ($dibujar1 && ($totalPresupuestoNae1 != 0 || $totalPresupuestoNae11 != 0)) {
                                    $dibujar1 = false;
                                    $tabla
                                        .= '<thead>
                        <td colspan="4" style="text-align: center"><strong> '. $denominacionNae[0]['codigo']. '-'. $denominacionNae[0]['denominacion']. '<strong></td>';

                                    $tabla.= '<thead>
                        <td style="text-align: center"><strong>Código</strong> </td>
                        <td style="text-align: center"><strong>Denominación</strong> </td>
                        <td style="text-align: center"><strong>Tipo</strong> </td>
                        <td style="text-align: center"><strong>Presupuesto</strong> </td>';
                                }

                                if($valorPartidas['tipo'] == 'Gasto'){
                                    $tabla
                                        .= '<tr style="text-align:CENTER;" >
										<td  width="">'
                                        . $valorPartidas['codigo'] . '</td>
										<td  width="">'
                                        . $valorPartidas['denominacion'] . '</td>
										<td  width="">' . $valorPartidas['tipo']
                                        . '</td>
										<td  width="">' . number_format($totalPresupuesto, '3', '.', ',') . '</td>
									</tr>
								  </thead>';
                                } else {
                                    $tabla
                                        .= '<tr style="text-align:CENTER;" >
										<td  width="">'
                                        . $valorPartidas['codigo'] . '</td>
										<td  width="">'
                                        . $valorPartidas['denominacion'] . '</td>
										<td  width="">' . $valorPartidas['tipo']
                                        . '</td>
										<td  width="">' . number_format($totalPresupuesto1, '3', '.', ',') . '</td>
									</tr>
								  </thead>';
                                }
                            }
                        }
                        if($noEntro){
                            $tabla
                                .= '<tr style="text-align:LEFT;" >
										<td style="text-align: left;background-color:#BBBBBB;" colspan="3"><strong>Total</strong></td>
										<td  style="text-align: center;background-color:#BBBBBB;">'
                                . number_format($totalPresupuestoNae1, '3', '.', ',') . '</td>
									</tr>';
                        } else {
                            $tabla
                                .= '<tr style="text-align:LEFT;" >
										<td style="text-align: left;background-color:#BBBBBB;" colspan="3"><strong>Total</strong></td>
										<td  style="text-align: center;background-color:#BBBBBB;">'
                                . number_format($totalPresupuestoNae11, '3', '.', ',') . '</td>
									</tr>';
                        }



                    }
                }
            } else if ($parametros->general == "true") {

                $sumaTotalGasto = 0;
                $sumaTotalIngresos = 0;

                if ($parametros->partidas == "" && $parametros->recursos == "") {
                    $arregloRecurso = array();
                    $cont1 = 0;
                    $datosPintarRecursoUnik = array();
                    foreach ($datosPintarRecurso as $valorRec) {
                        if (!in_array($valorRec['codigorecurso'], $arregloRecurso)) {
                            $datosPintarRecursoUnik[$cont1]['codigorecurso'] = $valorRec['codigorecurso'];
                            $datosPintarRecursoUnik[$cont1]['denominacion'] = $valorRec['denominacion'];
                            $arregloRecurso[] = $valorRec['codigorecurso'];
                            $cont1++;
                        }
                    }
                    $cont2 = 0;
                    $arregloGast = array();
                    $datosPintarGastoUnik = array();
                    foreach ($datosPintarGasto as $valorGast) {
                        if (!in_array($valorGast['codigogasto'], $arregloGast)) {
                            $datosPintarGastoUnik[$cont2]['codigogasto'] = $valorGast['codigogasto'];
                            $datosPintarGastoUnik[$cont2]['codigogastodividido'] = $valorGast['codigogastodividido'];
                            $denom = NomObjetogasto::obtenerObjGastoPadre($valorGast['codigogasto']);
                            $datosPintarGastoUnik[$cont2]['denominacion'] = $denom[0]['denominacion'];
                            $arregloGast[] = $valorGast['codigogasto'];
                            $cont2++;
                        }
                    }


                    $tabla
                        .= '<thead>
                        <td style="text-align: center"><strong>Código</strong> </td>
                        <td style="text-align: center"><strong>Denominación</strong> </td>
                        <td style="text-align: center"><strong>Tipo</strong> </td>
                        <td style="text-align: center"><strong>Presupuesto</strong> </td> </thead>';

                    foreach ($datosPintarGastoUnik as $valorgastoUnik) {
                        $valorPresupuestoActualGasto = 0;
                        foreach ($datosPintarGasto as $valorGastos) {
                            if ($valorGastos['codigogasto'] == $valorgastoUnik['codigogasto']) {
                                $valorPresupuestoActualGasto += $valorGastos['presupuestoactual'];
                            }
                        }
                        $sumaTotalGasto += $valorPresupuestoActualGasto;

                        $tabla
                            .= '<tr style="text-align:CENTER;" >
										<td  width="">' . $valorgastoUnik['codigogasto'] . '</td>
										<td  width="">' . $valorgastoUnik['denominacion'] . '</td>
										<td  width="">Gasto</td>
										<td  width="">' . number_format($valorPresupuestoActualGasto, '3', '.', ',') . '</td>
									</tr>';
                    }

                    $tabla
                        .= '<tr style="background-color:#BBBBBB;">
										<td style="text-align:Left;" colspan="3"><strong> Total</strong></td>
										<td style="text-align:Center;">' . number_format($sumaTotalGasto, '3', '.', ',') . '</td>
									</tr>
								  ';

                    foreach ($datosPintarRecursoUnik as $valorRecursoUnik) {
                        $valorPresupuestoActualRec = 0;
                        foreach ($datosPintarRecurso as $valorRecurso) {
                            if ($valorRecurso['codigorecurso'] == $valorRecursoUnik['codigorecurso']) {
                                $valorPresupuestoActualRec += $valorRecurso['presupuestoactual'];
                            }
                        }

                        $tabla
                            .= '<tr style="text-align:CENTER;" >
										<td  width="">' . $valorRecursoUnik['codigorecurso'] . '</td>
										<td  width="">' . $valorRecursoUnik['denominacion'] . '</td>
										<td  width="">Recurso</td>
										<td  width="">' . number_format($valorPresupuestoActualRec, '3', '.', ',') . '</td>
									</tr>
								  </thead>';
                        $sumaTotalIngresos += $valorPresupuestoActualRec;
                    }

                    $tabla
                        .= '<tr style="background-color:#BBBBBB;">
										<td style="text-align:Left;" colspan="3"><strong> Total</strong></td>
										<td style="text-align:Center;">' . number_format($sumaTotalIngresos, '3', '.', ',') . '</td>
									</tr>
								  </thead>';
                } else if ($parametros->partidas != "" && $parametros->recursos == "") {


                    $cont2 = 0;
                    $arregloGast = array();
                    $datosPintarGastoUnik = array();
                    foreach ($datosPintarGasto as $valorGast) {
                        if (!in_array($valorGast['codigogasto'], $arregloGast)) {
                            $datosPintarGastoUnik[$cont2]['codigogasto'] = $valorGast['codigogasto'];
                            $datosPintarGastoUnik[$cont2]['codigogastodividido'] = $valorGast['codigogastodividido'];
                            /*$denom = NomObjetogasto::obtenerObjGastoPadre($valorGast['codigogasto']);
                            $datosPintarGastoUnik[$cont2]['denominacion'] = $denom[0]['denominacion'];*/
                            $datosPintarGastoUnik[$cont2]['denominacion'] = $valorGast['denominacion'];
                            $arregloGast[] = $valorGast['codigogasto'];
                            $cont2++;
                        }
                    }

                    foreach ($datosPintarGastoUnik as $valorgastoUnik) {
                        $valorPresupuestoActualGasto = 0;
                        foreach ($datosPintarGasto as $valorGastos) {
                            if ($valorGastos['codigogasto'] == $valorgastoUnik['codigogasto']) {
                                $valorPresupuestoActualGasto += $valorGastos['presupuestoactual'];
                            }
                        }
                        $sumaTotalGasto += $valorPresupuestoActualGasto;

                        $tabla
                            .= '<tr style="text-align:CENTER;" >
										<td  width="">' . $valorgastoUnik['codigogasto'] . '</td>
										<td  width="">' . $valorgastoUnik['denominacion'] . '</td>
										<td  width="">Gasto</td>
										<td  width="">' . number_format($valorPresupuestoActualGasto, '3', '.', ',') . '</td>
									</tr>
								  </thead>';
                    }

                    $tabla
                        .= '<tr style="background-color:#BBBBBB;">
										<td style="text-align:Left;" colspan="3"><strong> Total</strong></td>
										<td style="text-align:Center;">' . number_format($sumaTotalGasto, '3', '.', ',') . '</td>
									</tr>
								  </thead>';
                } else if ($parametros->partidas == "" && $parametros->recursos != "") {

                    $arregloRecurso = array();
                    $cont1 = 0;
                    $datosPintarRecursoUnik = array();
                    foreach ($datosPintarRecurso as $valorRec) {
                        if (!in_array($valorRec['codigorecurso'], $arregloRecurso)) {
                            $datosPintarRecursoUnik[$cont1]['codigorecurso'] = $valorRec['codigorecurso'];
                            $datosPintarRecursoUnik[$cont1]['denominacion'] = $valorRec['denominacion'];
                            $arregloRecurso[] = $valorRec['codigorecurso'];
                            $cont1++;
                        }
                    }

                    foreach ($datosPintarRecursoUnik as $valorRecursoUnik) {
                        $valorPresupuestoActualRec = 0;
                        foreach ($datosPintarRecurso as $valorRecurso) {
                            if ($valorRecurso['codigorecurso'] == $valorRecursoUnik['codigorecurso']) {
                                $valorPresupuestoActualRec += $valorRecurso['presupuestoactual'];
                            }
                        }

                        $tabla
                            .= '<tr style="text-align:CENTER;" >
										<td  width="">' . $valorRecursoUnik['codigorecurso'] . '</td>
										<td  width="">' . $valorRecursoUnik['denominacion'] . '</td>
										<td  width="">Recurso</td>
										<td  width="">' . number_format($valorPresupuestoActualRec, '3', '.', ',') . '</td>
									</tr>
								  </thead>';
                        $sumaTotalIngresos += $valorPresupuestoActualRec;
                    }


                    $tabla
                        .= '<tr style="background-color:#BBBBBB;">
										<td style="text-align:Left;" colspan="3"><strong> Total</strong></td>
										<td style="text-align:Center;">' . number_format($sumaTotalIngresos, '3', '.', ',') . '</td>
									</tr>
								  </thead>';
                }
            }

        } else {
            if ($parametros->idreporte == 2) {

                $tabla .= '<tr><h1 style="padding-top: 20px; text-align: center"><strong>Resumen Total de Presupuesto por Partidas</strong></h1></tr>';
                $tabla .= '<tr><div style="position: absolute; "><div style="float: left; padding-left: 700px;"> <strong>Entidad:</strong> '
                    . $parametros->denomentidad . '</div>';
                $tabla .= '<div style="float: left; padding-left: 150px; "><strong>Ejercicio: '
                    . $parametros->denomejercicio
                    . '</strong></div></div></tr>';
                $tabla .= '<br>';
                $tabla
                    .= '<table border="1" bordercolor="black"  width="30%"  cellpadding="0" cellspacing="0" style="margin-top:1cm; margin-left: auto; margin-right: auto">';
                foreach ($parametros->naes as $valorNae) {
                    $denominacionNae = NomNae::obtenerTodasNaes($valorNae);
                    $totalPresupuestoTotalNae = 0;


                    $totalPresupuestoGasto = 0;
                    $totalPresupuestoRecurso = 0;
                    foreach ($datosPintarGasto as $valorGasto) {
                        if ($valorNae == $valorGasto['idnae']) {
                            $totalPresupuestoGasto += $valorGasto['presupuestoactual'];
                        }
                    }

                    foreach ($datosPintarRecurso as $valorRecurso) {
                        if ($valorNae == $valorRecurso['idnae']) {
                            $totalPresupuestoRecurso += $valorRecurso['presupuestoactual'];
                        }
                    }

                    $totalPresupuestoTotalNae = $totalPresupuestoGasto
                        + $totalPresupuestoRecurso;

                    if ($totalPresupuestoTotalNae != 0) {
                        $tabla
                            .= '<thead>
                        <td colspan="4" style="text-align: center"><strong> '
                            . $denominacionNae[0]['codigo']
                            . '-' . $denominacionNae[0]['denominacion']
                            . '<strong></td>';

                        $tabla
                            .= '<tr style="text-align:CENTER;" >
                                    <td  width="">Objeto Gasto: </td>
									<td  width="">' . number_format(
                                $totalPresupuestoGasto, '3', '.', ','
                            ) . '</td>
									</tr>
								  </thead>';


                        $tabla
                            .= '<tr style="text-align:CENTER;" >
                                 <td  width="">Recurso Financiero: </td>
								 <td  width="">' . number_format(
                                $totalPresupuestoRecurso, '3', '.', ','
                            ) . '</td>
									</tr>
								  </thead>';

                        $tabla
                            .= ' <td style="text-align: left;background-color:#BBBBBB;" colspan="1"><strong>Total</strong> </td>
                        <td style="text-align: center; background-color:#BBBBBB;"><strong>'
                            . number_format(
                                $totalPresupuestoTotalNae, '3', '.', ','
                            ) . '</strong> </td>';
                    }

                }

            }
        }

        echo $tabla;

    }

    function get_value_from_array($needle, $arr, $key_of_search,
                                  $name_of_key_to_return_value
    )
    {
        if (is_array($arr)) {
            for ($i = 0; $i < sizeof($arr); $i++) {
                $row = $arr[$i];
                if ($row[$key_of_search] === $needle) {
                    return $row[$name_of_key_to_return_value];
                }
            }
        }
        return false;
    }

    public function listarTodasLasPartidasPadresGastos($mostrarCodigo)
    {
        $resultgasto = NomObjetogasto::obtenerObjetosGastosPadres();

        $cont = 0;
        if ($mostrarCodigo) {
            foreach ($resultgasto as $value) {
                $datos->data[$cont]['idpartida'] = $value['idobjetogasto'];
                $datos->data[$cont]['codigo'] = $value['codigo'];
                $datos->data[$cont]['denominacion'] = $value['denominacion'];
                $datos->data[$cont]['tipo'] = 'Gasto';
                $cont++;
            }
        } else {
            foreach ($resultgasto as $value) {
                $datos->data[$cont]['idpartida'] = $value['idobjetogasto'];
                $datos->data[$cont]['codigo'] = $value['codigo'];
                $datos->data[$cont]['denominacion'] = $value['codigo'] . ' ' . $value['denominacion'];
                $datos->data[$cont]['tipo'] = 'Gasto';
                $cont++;
            }
        }


        return $datos;
    }

    public function listarTodasLasPartidasRecursos($mostrarCodigo)
    {
        $resultRecurso = NomRecursofinanciero::obtenerTodosRecursosFinancieros();

        $cont = 0;
        if ($mostrarCodigo) {
            foreach ($resultRecurso as $value1) {
                $datos->data[$cont]['idrecurso'] = $value1['idrecursofinanciero'];
                $datos->data[$cont]['codigo'] = $value1['codigo'];
                $datos->data[$cont]['denominacion'] = $value1['denominacion'];
                $datos->data[$cont]['tipo'] = 'Recurso';
                $cont++;
            }
        } else {
            foreach ($resultRecurso as $value1) {
                $datos->data[$cont]['idrecurso'] = $value1['idrecursofinanciero'];
                $datos->data[$cont]['codigo'] = $value1['codigo'];
                $datos->data[$cont]['denominacion'] = $value1['codigo'] . ' '. $value1['denominacion'];
                $datos->data[$cont]['tipo'] = 'Recurso';
                $cont++;
            }
        }


        return $datos;
    }

}


