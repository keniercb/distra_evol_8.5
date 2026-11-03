<?php

/**
 * ExportarImportarModel
 *
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class RecuperacionesModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function generarReporte($params) {
        $str = '';
        $rep [] = array('op' => 'rcpxc',
            'dsc' => 'RESUMEN COMPARATIVO DEL PLAN POR CONCEPTOS.');
        $rep [] = array('op' => 'rpxva',
            'dsc' => 'RESUMEN DEL PLAN POR VIAS DE ADQUISICION.');

        switch ($params['tipo']) {
            case 'rpxva':
                $str = self::getRPXVA();
                break;
            case 'rcpxc':
                $str = self::getRCPXC();
                break;
        }
        if ($str != '' && ($params['formato'] == 'html' || $params['formato'] == 'xls')
        ) {
            if ($params['formato'] == 'xls') {
                header("Pragma: public");
                header("Expires: 0");
                header(
                        "Cache-Control: must-revalidate, post-check=0, pre-check=0"
                );
                header("Content-Type: application/force-download");
                header("Content-Type: application/octet-stream");
                header("Content-Type: application/download");
                header(
                        "Content-Disposition: attachment;filename =RESUMEN_COMPARATIVO_DEL_PLAN_POR_CONCEPTOS.xls"
                );
                header("Content-Transfer-Encoding: binary ");
                echo $str;
            } elseif ($params['formato'] == 'html') {
                echo $str;
            }
        } else {
            echo 'POR FAVOR VERIFIQUE. </br>';
            echo 'NO EXISTE UNA OPCION CONFIGURADA PARA EL REPORTE SOLICITADO.</br>';
            echo 'LAS OPCIONES VALIDAS SON:';
            foreach ($rep as $k => $v) {
                echo "</br></br> REPORTE " . ($k + 1) . "</br> tipo: "
                . $v['op'] . '</br> DESCRIPCION: ' . $v['dsc'];
            }
            echo '</br></br>LOS FORMATOS VALIDOS SON:</br>';
            echo '</br> FORMATO 1 </br> formato: html <br> MUESTRA EL REPORTE EN LA PAGINA WEB PARA IMPRIMIR</br>';
            echo '</br> FORMATO 2 </br> formato: xls <br> MUESTRA UNA VENTANA DE DESCARGA PARA GUARDAR EL ARCHIVO
                  CON EL REPORTE</br>';
        }
        return;
    }

    public function getRCPXC() {
        $conn = Doctrine_Manager:: connection();
        $sql = "select * from mod_planifrecuperacion.f_resumen_comparativo_del_plan_por_conceptos()";
        $res = $conn->execute($sql)->fetchAll(
                PDO::FETCH_NUM
        ); //PDO::FETCH_ASSOC,PDO::FETCH_NUM
        $table = '<table border="1">';
        $table
                .= '
          <col width="50" span="11" />
          <tr >
            <td colspan="13" align="center" valign="middle"><span class="Estilo1">RESUMEN COMPARATIVO
                DEL PLAN POR CONCEPTOS</span></td>
          </tr>
          <tr>
            <td width="200" rowspan="4" align="center" valign="middle">CONCEPTOS</td>
            <td colspan="4" align="center" valign="middle">PLAN A&Ntilde;O ANTERIOR</td>
            <td colspan="4" align="center" valign="middle">PLAN A&Ntilde;O ACTUAL</td>
            <td colspan="4" align="center" valign="middle">DIFERENCIA</td>
          </tr>
          <tr>
            <td rowspan="3" align="center" valign="middle">TOTAL</td>
            <td colspan="2" align="center" valign="middle">MEP</td>
            <td rowspan="3" align="center" valign="middle">RESTO OACE</td>
            <td rowspan="3" align="center" valign="middle">TOTAL</td>
            <td colspan="2" align="center" valign="middle">MEP</td>
            <td rowspan="3" align="center" valign="middle">RESTO OACE</td>
            <td rowspan="3" align="center" valign="middle">TOTAL</td>
            <td colspan="2" align="center" valign="middle">MEP</td>
            <td rowspan="3" align="center" valign="middle">RESTO OACE</td>
          </tr>
          <tr>
            <td rowspan="2" align="center" valign="middle">RECURSOS</td>
            <td rowspan="2" align="center" valign="middle">FINANC. CENTRAL</td>
            <td rowspan="2" align="center" valign="middle">RECURSOS</td>
            <td rowspan="2" align="center" valign="middle">FINANC. CENTRAL</td>
            <td rowspan="2" align="center" valign="middle">RECURSOS</td>
            <td rowspan="2" align="center" valign="middle">FINANC. CENTRAL</td>
          </tr>
          <tr>';
        if ($res[0]) {
            foreach ($res as $v) {
                $table
                        .= "<tr>
                    <td >$v[0]</td>
                    <td >$v[6]</td>
                    <td >$v[7]</td>
                    <td >$v[8]</td>
                    <td >$v[9]</td>
                    <td >$v[2]</td>
                    <td >$v[3]</td>
                    <td >$v[4]</td>
                    <td >$v[5]</td>
                    <td >$v[10]</td>
                    <td >$v[11]</td>
                    <td >$v[12]</td>
                    <td >$v[13]</td>
                </tr>";
                $fDos += $v[6];
                $fTres += $v[7];
                $fCuatro += $v[8];
                $fCinco += $v[9];
                $fSeis += $v[2];
                $fSiete += $v[3];
                $fOcho += $v[4];
                $fNueve += $v[5];
                $fDiez += $v[10];
                $fOnce += $v[11];
                $fDoce += $v[12];
                $fTrece += $v[13];
            }
            $table
                    .= "<tr>
                    <td >TOTAL</td>
                    <td >$fDos</td>
                    <td >$fTres</td>
                    <td >$fCuatro</td>
                    <td >$fCinco</td>
                    <td >$fSeis</td>
                    <td >$fSiete</td>
                    <td >$fOcho</td>
                    <td >$fNueve</td>
                    <td >$fDiez</td>
                    <td >$fOnce</td>
                    <td >$fDoce</td>
                    <td >$fTrece</td>
                </tr>";
        } else {
            $table
                    .= '<tr>
                    <td colspan="13" align="center" valign="middle">NO EXISTEN DATOS DISPONIBLES.</td>
                <tr>
                <tr>
                    <td >TOTAL</td><td >-</td><td >-</td><td >-</td><td >-</td>
                    <td >-</td><td >-</td><td >-</td><td >-</td><td >-</td>
                    <td >-</td><td >-</td><td >-</td>
                <tr>';
        }
        $table .= '</table>';
        return $table;
    }

    public function getRPXVA() {
        return '';
    }

    public function mostrarReporte($parametros) {
        switch ($parametros->idreporte) {
            case 1:
                $cuerporeporte = $this->genererReporteResumenPorViaAdquisicion(
                        $parametros
                );
                break;
            case 2:
                $cuerporeporte = $this->genererReporteResumenProductosPorOACE(
                        $parametros
                );
                break;
            case 3:
                $cuerporeporte = $this->genererReporteResumenPlanPorConceptos(
                        $parametros
                );
                break;
            case 4:
                $cuerporeporte = $this->genererReporteResumenProductosSIPorOrganoSatisface(
                        $parametros
                );
                break;
            case 5:
                $cuerporeporte = $this->genererReporteDemandaPlanInversiones(
                        $parametros
                );
                break;
            case 6:
                $cuerporeporte = $this->genererReporteBalance($parametros);
                break;
            case 7:
                $cuerporeporte = $this->generarReporteAjuste($parametros);
                break;
            case 8:
                $cuerporeporte = $this->generarReporteDiferenciaPrecio(
                        $parametros
                );
                break;
            case 10:
                $cuerporeporte = $this->genererReporteGeneral(
                        $parametros
                );
                break;
        }
        return $cuerporeporte;
    }

    public function genererReporteGeneral($parametros) {
        //formando la cadena del ejercicio
        $temp = Doctrine::getTable('NomEjercicioplanificacion')->findByDql("idejercicio=$parametros->idejercicio");
        $cadenaejercicio = $temp[0]->ejercicio;

        //formando la cadena del componente
        if ($parametros->componente == 1)
            $cadenacomponente = "Niveles de actividad";
        if ($parametros->componente == 2)
            $cadenacomponente = "Plan";
        if ($parametros->componente == 3)
            $cadenacomponente = "Balance material";

        //formando una cadena con las entidades involucradas
        if (count($parametros->identidades) != 1)
            $cadenaentidades = "Entidades: ";
        else
            $cadenaentidades = "Entidad: ";

        foreach ($parametros->identidades as $key => $entidad) {
            $temp = $this->integrator->metadatos->DameEstructura(
                    $entidad
            );
            $cadenaentidades.=$temp [0]->denominacion;
            if ($key != count($parametros->identidades) - 1)
                $cadenaentidades.=", ";
        }
        //formando arreglo con los idplanes involucrados
        if ($parametros->casop == 1)
            $idplanes = explode(',', $parametros->planes);
        else {
            $idplanes = $parametros->planes;
        }
        $parametros->planes = $idplanes;

        //formando una cadena con los planes involucrados
        if (count($parametros->planes) != 1)
            $cadenaplanes = "Planes: ";
        else
            $cadenaplanes = "Plan: ";

        foreach ($parametros->planes as $key => $plan) {
            $temp = Doctrine::getTable('DatModelo')->findByDql("idmodelo=$plan");
            $cadenaplanes.=$temp[0]->denominacion;
            if ($key != count($parametros->planes) - 1)
                $cadenaplanes.=", ";
        }
        //buscando configuración del reporte
        $cuerporeporte = $this->configurarHojaReporte($parametros);
        $totalcolumnas = 16;
        $parametros->anchocolspan = $totalcolumnas;

        //creando el título del reporte
        $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0"
                    cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
        $cuerporeporte .= '<tr style="text-align:CENTER;"><td>
                    <strong>Proyección de la planificación<strong></td></tr>';
        $cuerporeporte .= "<tr style='text-align:LEFT;'><td>
                    <strong>Componente: $cadenacomponente<strong></td></tr>";

        $cuerporeporte .= "<tr style='text-align:LEFT;'><td>
                    <strong>$cadenaentidades<strong></td></tr>";

        $cuerporeporte .= "<tr style='text-align:LEFT;'><td>
                    <strong>$cadenaplanes<strong></td></tr>";

        $cuerporeporte .= "<tr style='text-align:LEFT;'><td>
                    <strong>Ejercicio: $cadenaejercicio  &nbsp&nbsp&nbspImporte total gastos:
                    $parametros->importebaseG  &nbsp&nbsp&nbspImporte total ingresos:
                    $parametros->importebaseV<strong></td></tr>";
        $cuerporeporte .= "</table>";

        $cuerporeporte .= $this->pintarReporteGeneral(
                $parametros
        );
        if ($parametros->detalle == 1 || ($parametros->anualQuinq == 3 && $parametros->porcientoEntreAnnos != 1))
            $cuerporeporte .= $this->pintarReporteDetalle(
                    $parametros
            );
        //cerrando la tabla y la hoja
        $cuerporeporte .= "</tbody></table></div>";
        $cuerporeporte .= "</div>";
        return $cuerporeporte;
    }

    public function pintarReporteGeneral($parametros) {
        $cuerporeporteindicadores = "";
        $cuerporeporteindicadores
                .= '<table border="1" bordercolor="black"  width="30%" align="center"
                cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
                                 <thead>
									<tr style="text-align:CENTER;background-color:#BBBBBB;">
									    <td  width="' . 5 . '%"><strong>Años</strong></td>
										<td  width="' . 5 . '%"><strong>Porciento</strong></td>
										<td  width="' . 10 . '%"><strong>Importe gastos</strong></td>
										<td  width="' . 10 . '%"><strong>Importe ingresos</strong></td>
									</tr>
								  </thead>';
        if ($parametros->detalle == 1 && $parametros->numbdetalle == 'porciento1' && $parametros->anualQuinq == 2)
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;background-color:rgba(22, 187, 103, 0.43);">';
        else
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;">';
        $cuerporeporteindicadores.= ' 	<td style="text-align:CENTER;">Año 1</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->porciento1 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importe1 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importeV1 . '</td>';
        $cuerporeporteindicadores .= ' </tr>';

        if ($parametros->detalle == 1 && $parametros->numbdetalle == 'porciento2' && $parametros->anualQuinq == 2)
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;background-color:rgba(22, 187, 103, 0.43);">';
        else
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;">';
        $cuerporeporteindicadores.= ' 	<td style="text-align:CENTER;">Año 2</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->porciento2 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importe2 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importeV2 . '</td>';
        $cuerporeporteindicadores .= ' </tr>';

        if ($parametros->detalle == 1 && $parametros->numbdetalle == 'porciento3' && $parametros->anualQuinq == 2)
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;background-color:rgba(22, 187, 103, 0.43);">';
        else
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;">';
        $cuerporeporteindicadores.= ' 	<td style="text-align:CENTER;">Año 3</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->porciento3 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importe3 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importeV3 . '</td>';
        $cuerporeporteindicadores .= ' </tr>';

        if ($parametros->detalle == 1 && $parametros->numbdetalle == 'porciento4' && $parametros->anualQuinq == 2)
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;background-color:rgba(22, 187, 103, 0.43);">';
        else
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;">';
        $cuerporeporteindicadores.= ' 	<td style="text-align:CENTER;">Año 4</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->porciento4 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importe4 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importeV4 . '</td>';
        $cuerporeporteindicadores .= ' </tr>';

        if ($parametros->detalle == 1 && $parametros->numbdetalle == 'porciento5' && $parametros->anualQuinq == 2)
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;background-color:rgba(22, 187, 103, 0.43);">';
        else
            $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;">';
        $cuerporeporteindicadores.= ' 	<td style="text-align:CENTER;">Año 5</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->porciento5 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importe5 . '</td>';
        $cuerporeporteindicadores.= ' 	<td>' . $parametros->importeV5 . '</td>';
        $cuerporeporteindicadores .= ' </tr>';

        $cuerporeporteindicadores .= "</table>";
        return $cuerporeporteindicadores;
    }

    public function pintarReporteDetalle($parametros) {
        $arrentp = array();

        foreach ($parametros->identidades as $entidad) {
            $arrentp = array_merge(
                    $arrentp, DatActividadentidad::auxObtenerEntidadesHijasComun($entidad)
            );
        }
        $identidades = implode(",", $arrentp);
        $idejercicio = $parametros->idejercicio;
        if ($parametros->detalle == 1) {
            if ($parametros->numbdetalle == 'porciento1')
                $parametros->porciento = $parametros->porciento1;
            if ($parametros->numbdetalle == 'porciento2')
                $parametros->porciento = $parametros->porciento2;
            if ($parametros->numbdetalle == 'porciento3')
                $parametros->porciento = $parametros->porciento3;
            if ($parametros->numbdetalle == 'porciento4')
                $parametros->porciento = $parametros->porciento4;
            if ($parametros->numbdetalle == 'porciento5')
                $parametros->porciento = $parametros->porciento5;
        }

        //pintando datos separados por plan
        $cuerporeporteindicadores = "";
        foreach ($parametros->planes as $plan) {
            if ($parametros->anualQuinq == 2) {
                $totalIG = 0;
                $totalII = 0;
            }
            if ($parametros->anualQuinq == 3) {
                $parametros->porciento = 100;
                $totalIGAnno1 = 0;
                $totalIIAnno1 = 0;
                $totalIGAnno2 = 0;
                $totalIIAnno2 = 0;
                $totalIGAnno3 = 0;
                $totalIIAnno3 = 0;
                $totalIGAnno4 = 0;
                $totalIIAnno4 = 0;
                $totalIGAnno5 = 0;
                $totalIIAnno5 = 0;
            }
            $temp = Doctrine::getTable('DatModelo')->findByDql("idmodelo=$plan");
            $denomplan = $temp[0]->denominacion;

            $cuerporeporteindicadores .= '<table border="0" width="100%" align="center" cellpadding="0"
                                          cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
            $cuerporeporteindicadores .= "<tr style='text-align:LEFT;'>
                                          <td><strong>Plan: $denomplan<strong></td>
                                          </tr>";
            $cuerporeporteindicadores .= "</table>";


            $modeloActEnt = new DatActividadentidad();
            if ($parametros->componente == 1)
                $datosaux = DatActividadentidad::listarDetallesN($identidades, $idejercicio, $parametros->porciento, $plan);
            if ($parametros->componente == 2)
                $datosaux = DatPlanificacion::listarDetalles($identidades, $idejercicio, $plan, $parametros->porciento);
            if ($parametros->componente == 3)
                $datosaux = DatPlanificacion::listarDetallesB($identidades, $idejercicio, $plan, $parametros->porciento);

            $cuerporeporteindicadores
                    .= '<table border="1" bordercolor="black"  width="100%" align="center"
                           cellpadding="0" cellspacing="0" style="margin-top:1cm;">
                           <thead>
						   <tr style="text-align:CENTER;background-color:#BBBBBB;" >';

            if ($parametros->anualQuinq == 2) {
                $cuerporeporteindicadores .= '<td  width="' . 10 . '%"><strong>Código</strong></td>
										      <td  width="' . 42 . '%"><strong>Denominación</strong></td>';
                if ($parametros->componente != 1) {
                    $cuerporeporteindicadores .= '<td  width="' . 12 . '%">UM</td>';
                }
                $cuerporeporteindicadores .= '<td  width="' . 12 . '%"><strong>Cantidad</strong></td>
										      <td  width="' . 12 . '%"><strong>Importe gasto</strong></td>
                                              <td  width="' . 12 . '%"><strong>Importe ingreso</strong></td>';
            }

            if ($parametros->anualQuinq == 3) {

                $cuerporeporteindicadores .= '<td colspan="3" "><strong>Datos del indicador </strong></td>
                                                  <td  colspan="3"><strong>Año 1</strong></td>
                                                  <td  colspan="3"><strong>Año 2</strong></td>
                                                  <td  colspan="3"><strong>Año 3</strong></td>
                                                  <td colspan="3"><strong>Año 4</strong></td>
                                                  <td  colspan="3"><strong>Año 5</strong></td>
                                                  </tr>

                                                  <tr style="text-align:CENTER;background-color:#BBBBBB;">
                                                  <td><strong>Código</strong></td>
										          <td width="' . 25 . '%"><strong>Denominación</strong></td>';
                if ($parametros->componente != 1) {
                    $cuerporeporteindicadores .= '<td><strong>UM</strong></td>';
                }

                $cuerporeporteindicadores .= '
                                        <td><strong>Cantidad</strong></td>
										<td><strong>Importe gasto</strong></td>
                                        <td><strong>Importe ingreso</strong></td>

                                        <td><strong>Cantidad</strong></td>
										<td><strong>Importe gasto</strong></td>
                                        <td><strong>Importe ingreso</strong></td>

                                        <td><strong>Cantidad</strong></td>
										<td><strong>Importe gasto</strong></td>
                                        <td><strong>Importe ingreso</strong></td>

                                        <td><strong>Cantidad</strong></td>
										<td><strong>Importe gasto</strong></td>
                                        <td><strong>Importe ingreso</strong></td>

                                        <td><strong>Cantidad</strong></td>
										<td><strong>Importe gasto</strong></td>
                                        <td><strong>Importe ingreso</strong></td></tr>';
            }

            $cuerporeporteindicadores .= '	</tr>  </thead>';


            foreach ($datosaux as $indicador) {
                $cuerporeporteindicadores .= ' <tr style="text-align:RIGHT;">';
                $cuerporeporteindicadores.= ' 	<td style="text-align:LEFT;" >' . $indicador['codigo'] . '</td>';
                $cuerporeporteindicadores.= ' 	<td style="text-align:LEFT;" >' . $indicador['denominacion'] . '</td>';
                if ($parametros->componente != 1)
                    $cuerporeporteindicadores.= ' 	<td style="text-align:CENTER;" >' . $indicador['abreviaturaunidadmedida'] . '</td>';
                if ($parametros->anualQuinq == 2) {
                    $cuerporeporteindicadores.= ' 	<td>' . number_format($indicador['cantidad'], '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format($indicador['importegasto'], '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format($indicador['importeingreso'], '3', '.', ',') . '</td>';
                }

                if ($parametros->anualQuinq == 3) {
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['cantidad'] * $parametros->porciento1 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importegasto'] * $parametros->porciento1 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importeingreso'] * $parametros->porciento1 / 100), '3', '.', ',') . '</td>';

                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['cantidad'] * $parametros->porciento2 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importegasto'] * $parametros->porciento2 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importeingreso'] * $parametros->porciento2 / 100), '3', '.', ',') . '</td>';

                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['cantidad'] * $parametros->porciento3 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importegasto'] * $parametros->porciento3 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importeingreso'] * $parametros->porciento3 / 100), '3', '.', ',') . '</td>';

                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['cantidad'] * $parametros->porciento4 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importegasto'] * $parametros->porciento4 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importeingreso'] * $parametros->porciento4 / 100), '3', '.', ',') . '</td>';

                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['cantidad'] * $parametros->porciento5 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importegasto'] * $parametros->porciento5 / 100), '3', '.', ',') . '</td>';
                    $cuerporeporteindicadores.= ' 	<td>' . number_format(($indicador['importeingreso'] * $parametros->porciento5 / 100), '3', '.', ',') . '</td>';
                }

                $cuerporeporteindicadores .= ' </tr>';
                if ($parametros->anualQuinq == 2) {
                    $totalIG+=$indicador['importegasto'];
                    $totalII+=$indicador['importeingreso'];
                }
                if ($parametros->anualQuinq == 3) {
                    $totalIGAnno1+=$indicador['importegasto'] * $parametros->porciento1 / 100;
                    $totalIIAnno1+=$indicador['importeingreso'] * $parametros->porciento1 / 100;
                    $totalIGAnno2+=$indicador['importegasto'] * $parametros->porciento2 / 100;
                    $totalIIAnno2+=$indicador['importeingreso'] * $parametros->porciento2 / 100;
                    $totalIGAnno3+=$indicador['importegasto'] * $parametros->porciento3 / 100;
                    $totalIIAnno3+=$indicador['importeingreso'] * $parametros->porciento3 / 100;
                    $totalIGAnno4+=$indicador['importegasto'] * $parametros->porciento4 / 100;
                    $totalIIAnno4+=$indicador['importeingreso'] * $parametros->porciento4 / 100;
                    $totalIGAnno5+=$indicador['importegasto'] * $parametros->porciento5 / 100;
                    $totalIIAnno5+=$indicador['importeingreso'] * $parametros->porciento5 / 100;
                }
            }
            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT; background-color:#BBBBBB;">';

            if ($parametros->componente != 1)
                $cuerporeporteindicadores .= ' 	<td colspan="' . 4 . '"><strong>TOTAL <strong></td>';
            else
                $cuerporeporteindicadores .= ' 	<td colspan="' . 3 . '"><strong>TOTAL <strong></td>';

            if ($parametros->anualQuinq == 2) {
                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIG, '3', '.', ',') . '<strong></td>';
                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalII, '3', '.', ',') . '<strong></td>';
            }

            if ($parametros->anualQuinq == 3) {
                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIGAnno1, '3', '.', ',') . '<strong></td>';
                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIIAnno1, '3', '.', ',') . '<strong></td>';

                $cuerporeporteindicadores.= ' 	<td><strong></strong></td>';

                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIGAnno2, '3', '.', ',') . '<strong></td>';
                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIIAnno2, '3', '.', ',') . '<strong></td>';

                $cuerporeporteindicadores.= ' 	<td><strong></strong></td>';

                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIGAnno3, '3', '.', ',') . '<strong></td>';
                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIIAnno3, '3', '.', ',') . '<strong></td>';

                $cuerporeporteindicadores.= ' 	<td><strong></strong></td>';

                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIGAnno4, '3', '.', ',') . '<strong></td>';
                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIIAnno4, '3', '.', ',') . '<strong></td>';

                $cuerporeporteindicadores.= ' 	<td><strong></strong></td>';

                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIGAnno5, '3', '.', ',') . '<strong></td>';
                $cuerporeporteindicadores.= ' 	<td style="text-align:RIGHT;" ><strong>' . number_format($totalIIAnno5, '3', '.', ',') . '<strong></td>';
            }
            $cuerporeporteindicadores .= ' </tr>';
        }
        $cuerporeporteindicadores .= "</table>";
        return $cuerporeporteindicadores;
    }

    public function genererReporteResumenPorViaAdquisicion($parametros) {
        switch ($parametros->formatoreporte) {
            case 1: //HTML
                $cuerporeporte = $this->configurarHojaReporte($parametros);
                $cadenaENCABEZADO = '';
                $cadenaENCABEZADOVIAADQUISICION = '';
                $cadenaSUBENCABEZADOVIAADQUISICION = '';

                $parametros->indicadoresvisitados = array();
                $parametros->indicesPosicionVias = array();

                $totalcolumnas = 6;
                //procedo a calcular el ancho en % de cada columna
                if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != '') {
                    $totalVA = count($parametros->arrayviasadquisicion);
                    if ($totalVA > 5)
                        $totalVA = 5;
                    $totalcolumnas = $totalcolumnas + $totalVA;
                    $porcientoxcolumna = 100 / $totalcolumnas;
                    $totalVias = 0;
                    $contador = 0;
                    foreach (
                    $parametros->arrayviasadquisicion as $indice => $viaadquisicion
                    ) {
                        if ($contador < 5) {
                            $idvia = $viaadquisicion->idvia;
                            $parametros->indicesPosicionVias[$idvia] = $indice;
                            $arrayidviasUnidimensional[] = $viaadquisicion->idvia;
                            $cadenaENCABEZADOVIAADQUISICION
                                    .= '<td colspan="2" rowspan="2" width="'
                                    . $porcientoxcolumna . '%">'
                                    . $viaadquisicion->denominacion . '</td>';
                            $cadenaSUBENCABEZADOVIAADQUISICION .= '<td height="21" width="'
                                    . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">
                            cant.</td> <td width="'
                                    . ($porcientoxcolumna / 2)
                                    . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                            $totalVias++;
                            $contador++;
                        } else
                            break;
                    }
                    $parametros->totalVias = $totalVias;
                } else {
                    $arrayVA = NomViaadquisicion::Obtener_via_adquisicion(5);

                    $totalVA = count($arrayVA->data);
                    $totalcolumnas = $totalcolumnas + $totalVA;
                    $porcientoxcolumna = 100 / $totalcolumnas;
                    $totalVias = 0;
                    foreach ($arrayVA->data as $indice => $va) {
                        $idvia = $va['idviaadquisicion'];
                        $parametros->indicesPosicionVias[$idvia] = $indice;
                        $arrayidviasUnidimensional[] = $va['idviaadquisicion'];
                        $cadenaENCABEZADOVIAADQUISICION
                                .= '<td colspan="2" rowspan="2" width="'
                                . $porcientoxcolumna . '%">'
                                . $va['denominacion'] . '</td>';
                        $cadenaSUBENCABEZADOVIAADQUISICION .= '<td height="21" width="'
                                . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">
                            cant.</td> <td width="'
                                . ($porcientoxcolumna / 2)
                                . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                        $totalVias++;
                    }
                    $parametros->totalVias = $totalVias;
                }
                $parametros->arrayidvias = $arrayidviasUnidimensional;
                $parametros->arrayidviasUnidimensional = implode(
                        ',', $arrayidviasUnidimensional
                );
                $cadenaENCABEZADO = $cadenaENCABEZADOVIAADQUISICION . '</tr><tr> </tr><tr>'
                        . $cadenaSUBENCABEZADOVIAADQUISICION;

                $parametros->anchocolspan = $totalcolumnas + ($totalVA);
                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0" cellspacing="0"
                                   style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td>
                                   <strong>RESUMEN DEL PLAN POR VÍA DE ADQUISICIÓN<strong></td></tr>';
                $cuerporeporte .= "</table>";
                //creando la tabla con las columnas fijas
                $cuerporeporte
                        .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0"
                         cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
								  <thead>
									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td rowspan="3" height="62" width="'
                        . $porcientoxcolumna . '%">C&oacute;digo</td>
										<td rowspan="3" width="'
                        . $porcientoxcolumna . '%">Descripci&oacute;n</td>
										<td rowspan="3" width="'
                        . $porcientoxcolumna . '%">UM</td>
										<td rowspan="3" width="'
                        . $porcientoxcolumna . '%">Precio</td>
										<td colspan="2" rowspan="2" width="'
                        . $porcientoxcolumna . '%">Total general</td>';

                //anexando el resto de las columnas
                $cuerporeporte = $cuerporeporte . $cadenaENCABEZADO;
                $cuerporeporte .= '<td height="21" width="'
                        . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
										 <td width="' . ($porcientoxcolumna / 2)
                        . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';


                //filtro y compartimentacion por centros de balance
                if ($parametros->arrayidcentrobalance[0]->idcentrobalance != null && $parametros->arrayidcentrobalance[0]->idcentrobalance != ''
                ) {
                    foreach (
                    $parametros->arrayidcentrobalance as $centrobalance
                    ) {
                        $arrayidcentrosbalanceUnidimensional[] = $centrobalance->idcentrobalance;
                    }
                    $parametros->arrayidcentrosbalance = $arrayidcentrosbalanceUnidimensional;
                    $parametros->arrayidcentrobalanceUnidimensional = implode(
                            ',', $arrayidcentrosbalanceUnidimensional
                    );
                }

                $arrayidorgandosUnidimensional = array();
                if (isset($parametros->arrayidorganos[0])) {
                    foreach ($parametros->arrayidorganos as $idorgano) {
                        $arrayidorgandosUnidimensional = array_merge(
                                $arrayidorgandosUnidimensional, DatActividadentidad::auxObtenerEntidadesHijasComun($idorgano->idorgano)
                        );
                    }
                } else {
                    $arrayidorgandosUnidimensional = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->identidadlog);
                }
                $parametros->arrayidorganos = $arrayidorgandosUnidimensional;
                $parametros->arrayidorganosUnidimensional = implode(',', $arrayidorgandosUnidimensional);

                $total = 0;
                if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != ''
                ) {
                    foreach ($parametros->arrayplanes as $plan) {
                        $parametros->idplan = $plan->idplan;
                        $nombreplan = $plan->denominacion;
                        $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                        $cuerporeporte .= ' 	<td colspan="14"><strong>'
                                . $nombreplan . '</strong></td>';
                        $cuerporeporte .= ' </tr>';
                        $arraydatos = $this->obtenerCuerpoReporteIndicadores(
                                $parametros
                        );
                        $cuerporeporte .= $arraydatos['cuerporeporte'];
                        $total = $total + $arraydatos['subtotal'];
                    }
                } else {
                    $arrayplanesexistentes = DatPlanificacion::obtenerPlanesPorEjercicio(
                                    $parametros->idejercicio, $parametros->denoclasifplanrep
                    );

                    if (isset($arrayplanesexistentes[0]['idmodelo'])) {

                        foreach ($arrayplanesexistentes as $plan) {

                            $parametros->idplan = $plan['idmodelo'];
                            $nombreplan = $plan['denominacion'];
                            $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                            $cuerporeporte .= ' 	<td colspan="'
                                    . $parametros->anchocolspan . '"><strong>'
                                    . $nombreplan . '</strong></td>';
                            $cuerporeporte .= ' </tr>';


                            $arraydatos = $this->obtenerCuerpoReporteIndicadores(
                                    $parametros
                            );
                            $cuerporeporte .= $arraydatos['cuerporeporte'];
                            $total = $total + $arraydatos['subtotal']; //}
                        }
                    }
                }

                //calculando y mostrando el total
                $cuerporeporte .= ' <tr style="text-align:LEFT;background-color:#BBBBBB;">';
                $cuerporeporte
                        .= ' 	<td colspan="' . $parametros->anchocolspan
                        . '"><strong>TOTAL: ' . number_format($total, 3, '.', ',') . '<strong></td>';
                $cuerporeporte .= ' </tr>';
                //cerrando la tabla y la hoja
                $cuerporeporte .= "</tbody></table></div>";
                $cuerporeporte .= "</div>";

                return $cuerporeporte;
                break;
        }
    }

    public function genererReporteResumenProductosPorOACE($parametros) {
        switch ($parametros->formatoreporte) {
            case 1:
                $cuerporeporte = $this->configurarHojaReporte($parametros);
                $totalcolumnas = 6;
                //procedo a calcular el ancho en % de cada columna
                $parametros->anchocolspan = $totalcolumnas + 1;

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>RESUMEN DE PRODUCTOS POR OACE<strong></td></tr>';
                $cuerporeporte .= "</table>";
                //creando la tabla con las columnas fijas
                $cuerporeporte
                        .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
								  <thead>
									<tr style="text-align:CENTER;background-color:#BBBBBB;font-size:10.0pt;" >
										<td rowspan="3" height="45" width="' . 16 . '%">C&oacute;digo</td>
										<td rowspan="3" width="' . 16 . '%">Denominaci&oacute;n</td>
										<td rowspan="3" width="' . 16 . '%">UM</td>
                                                                                <td rowspan="3" width="' . 16 . '%">&Oacute;rgano que Satisface</td>
										<td rowspan="3" width="' . 16 . '%">Precio</td>
										<td colspan="2" rowspan="2" width="' . 16 . '%">Total general</td> </tr><tr> </tr><tr>';

                $cuerporeporte .= '<td height="21" width="' . 8 . '%" style="text-align:CENTER;background-color:#BBBBBB;font-size:10.0pt;">cant.</td>
										 <td width="' . 8 . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td> ';

                //filtro y compartimentacion por centros de balance
                $cont = 0;
                if ($parametros->arrayidcentrobalance[0]->idcentrobalance != null && $parametros->arrayidcentrobalance[0]->idcentrobalance != ''
                ) {
                    foreach ($parametros->arrayidcentrobalance as $centrobalance) {
                        $arrayidcentrosbalance_unidimensional[] = $centrobalance->idcentrobalance;
                        $cont++;
                    }
                    $parametros->totalcentrobalance = $cont;
                    $parametros->arrayidcentrobalance_unidimensional = implode(
                            ',', $arrayidcentrosbalance_unidimensional
                    );
                }

                //filtro y compartimentacion por organos demandantes
                $iddominio = $this->global->Perfil->iddominio;
                $integrator = ZendExt_IoC::getInstance();
                $arrayidorgandos_unidimensional = array();

                if (isset($parametros->arrayidorganos[0])) {
                    foreach ($parametros->arrayidorganos as $idorgano) {
                        $arrayidorgandos_unidimensional = array_merge(
                                $arrayidorgandos_unidimensional, DatActividadentidad::auxObtenerEntidadesHijasComun($idorgano->idorgano)
                        );
                    }
                } else {
                    $arrayidorgandos_unidimensional = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->identidadlog);
                }
                $parametros->arrayidorganos = $arrayidorgandos_unidimensional;
                $parametros->arrayidorganos_unidimensional = implode(',', $arrayidorgandos_unidimensional);

                //filtro por planes
                $cont = 0;
                if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != '') {
                    $datosplanes = DatPlanificacion::obtenerPlanesPorEjercicio(
                                    $parametros->idejercicio, $parametros->denoclasifplanrep
                    );
                    $todosplanes = $parametros->arrayplanes;
                    unset($parametros->arrayplanes);
                    foreach ($todosplanes as $keyplan => $plan) {
                        $arrayunidimensional_idplan[] = $plan->idplan;
                        $cont++;
                        foreach ($datosplanes as $planes1) {
                            if ($planes1['idmodelo'] == $plan->idplan) {
                                $parametros->arrayplanes[$keyplan]['idmodelo'] = $plan->idplan;
                                $parametros->arrayplanes[$keyplan]['denominacion'] = $plan->denominacion;
                                $parametros->arrayplanes[$keyplan]['idtipomodelo'] = $planes1['idtipomodelo'];
                            }
                        }
                    }
                    $parametros->totalplanes = $cont;
                    $parametros->arrayunidimensional_idplan = implode(',', $arrayunidimensional_idplan);
                } else {
                    $parametros->arrayplanes = DatPlanificacion::obtenerPlanesPorEjercicio(
                                    $parametros->idejercicio, $parametros->denoclasifplanrep
                    );

                    foreach ($parametros->arrayplanes as $plan) {

                        $arrayunidimensional_idplan[] = $plan['idmodelo'];
                        $cont++;
                    }
                    $parametros->totalplanes = $cont;
                    $parametros->arrayunidimensional_idplan = implode(',', $arrayunidimensional_idplan);
                }

                $arraydatos = array();
                $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                $cuerporeporte .= $arraydatos['cuerporeporte'];
                $total = /* $total + */$arraydatos['subtotal'];

                //calculando y mostrando el total
                $cuerporeporte .= ' <tr style="text-align:LEFT;background-color:#BBBBBB;">';
                $cuerporeporte
                        .=
                        ' 	<td colspan="' . $parametros->anchocolspan . '"><strong>TOTAL: ' . $total . '<strong></td>';
                $cuerporeporte .= ' </tr>';
                //cerrando la tabla y la hoja
                $cuerporeporte .= "</tbody></table></div>";
                $cuerporeporte .= "</div>";

                return $cuerporeporte;
                break;
        }
    }

    public function genererReporteResumenPlanPorConceptos($parametros) {
        $cuerporeporte = $this->configurarHojaReporte($parametros);
        $objentmodelo = new DatEntidadmodelo();
        $model = new NomViaadquisicionModel();

        $cont = 0;
        if (!isset($parametros->arrayidorganos[0])) {
            $datosaux = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->identidadlog);
            foreach ($datosaux as $value) {
                $parametros->entidades[$cont] = $value;
                $cont++;
            }
        } else {
            foreach ($parametros->arrayidorganos as $value) {
                $datosaux = DatActividadentidad::auxObtenerEntidadesHijasComun($value->idorgano);
                foreach ($datosaux as $value) {
                    $parametros->entidades[$cont] = $value;
                    $cont++;
                }
            }
        }

        $entidades = implode(",", $parametros->entidades);

        if ($parametros->arrayviasadquisicion[0]->idvia != "") {
            foreach ($parametros->arrayviasadquisicion as $key => $valuevias) {
                $viasdenomaux [] = $valuevias->denominacion;
                $vias[$key]->idvia = $valuevias->idvia;
                $vias[$key]->denominacion = $valuevias->denominacion;
            }
            $viasdenom = implode(",", $viasdenomaux);
        } else {
            $data = $model->listarViaAdq();
            foreach ($data->data as $key => $valuevias) {
                $vias[$key]->idvia = $valuevias['idviaadquisicion'];
                $vias[$key]->denominacion = $valuevias['denominacion'];
            }
            $viasdenom = "Todas";
        }

        if (count($parametros->arrayidorganos) != 0) {
            foreach ($parametros->arrayidorganos as $valueorganos) {
                $organosdenomaux [] = $valueorganos->organoden;
            }
            $organosdenom = implode(",", $organosdenomaux);
        } else {

            $organosdenom = "Todos";
        }

        if (count($parametros->arraytipogastos) == 1) {
            if ($parametros->arraytipogastos[0]->idtipogasto == 1) {
                $urigasto [0] = 'gastos corriente';
            } else {
                $urigasto[0] = 'gastos capital';
            }
        } else {
            $urigasto [0] = 'gastos corriente';
            $urigasto [1] = 'gastos capital';
        }

        if (count($parametros->arrayplanes) != 0) {
            foreach ($parametros->arrayplanes as $valueplanes) {
                $planesidux [] = $valueplanes->idplan;
            }
            $planesid = implode(",", $planesidux);
        } else {
            $planesid = false;
        }

        if ($parametros->arrayidcentrobalance[0]->idcentrobalance != "") {
            foreach ($parametros->arrayidcentrobalance as $valuecentros) {
                $centrosidux [] = $valuecentros->idcentrobalance;
                $centrosdenomux [] = $valuecentros->denominacion;
            }
            $centrosdenom = implode(",", $centrosdenomux);
            $centrosid = implode(",", $centrosidux);
        } else {
            $objcentro = new CentrodebalanceModel();
            $centros = $objcentro->listarTodos("CB");
            foreach ($centros as $valuecentros) {
                $centrosidux [] = $valuecentros['identidad'];
            }
            $centrosid = implode(",", $centrosidux);
            $centrosdenom = "Todos";
        }

        $modelosunik = $objentmodelo->getModelosdadoEntidades($entidades, $urigasto, $planesid/* , $centrosid, $parametros->denoclasifplanrep */);

        /* $idsmodelos = array();
          $cont = 0;
          $modelosunik = array();
          foreach ($modelos as $key => $valuemod) {
          if (!in_array($valuemod['idmodelo'], $idsmodelos)) {
          $idsmodelos[] = $valuemod['idmodelo'];
          $modelosunik[$cont]['idmodelo'] = $valuemod['idmodelo'];
          $modelosunik[$cont]['denominacion'] = $valuemod['denominacion'];
          $modelosunik[$cont]['idmodelo'] = $valuemod['idmodelo'];
          $modelosunik[$cont]['denomgasto'] = $valuemod['denomgasto'];
          $modelosunik[$cont]['uridatosnomenclador'] = $valuemod['uridatosnomenclador'];
          $modelosunik[$cont]['uriruta'] = $valuemod['uriruta'];
          $cont++;
          }
          } */

        $cuerporeporte .= '<body >';
        $cuerporeporte .= '<div style="width=140cm">';
        $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
        $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>RESUMEN COMPARATIVO DEL PLAN POR CONCEPTOS<strong></td></tr>';
        $cuerporeporte .= "</table>";
        $cuerporeporte .= "<tr></tr><tr></tr>";
        $cuerporeporte .= '<table border="0" width="100%"  cellpadding="0" cellspacing="0" style="margin-top:1cm;">';
        $cuerporeporte .= '<tr style="text-align:LEFT;"><td><strong>&Oacute;rgano(s) Demandante(s): ' . utf8_decode($organosdenom) . '<strong></td></tr>';
        $cuerporeporte .= '<tr style="text-align:LEFT;"><td><strong>V&iacute;a(s) Adquisici&oacute;n: ' . utf8_decode($viasdenom) . ' <strong></td></tr>';
        $cuerporeporte .= '<tr style="text-align:LEFT;"><td><strong>Centros de Balance: ' . utf8_decode($centrosdenom) . '<strong></td></tr>';
        if ($parametros->denoclasifplanrep) {
            $cuerporeporte .= '<tr style="text-align:LEFT;"><td><strong>Clasificaci&oacute;n del Plan: ' . $parametros->denoclasifplanrep . ' <strong></td></tr>';
        }
        $cuerporeporte .= "</table>";


        if (count($modelosunik) != 0) {
            foreach ($modelosunik as $key => $value123) {
                $datos12[] = $value123['idmodelo'];
                if ($value123['tipogasto'] == 0) {
                    $modelosGastoscap[] = $value123['idmodelo'];
                } else {
                    $modelosGastosCorr[] = $value123['idmodelo'];
                }
            }
            $modelosaux = implode(",", $datos12);
            $modelosauxGastoscap = implode(",", $modelosGastoscap);
            $modelosauxGastosCorr = implode(",", $modelosGastosCorr);


            $contador = 0;
            foreach ($vias as $key12 => $value23) {
                $valorestodos = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $value23->idvia, $parametros->idejercicioante, $modelosaux);
                $valorestodos1 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $value23->idvia, $parametros->idejercicio, $modelosaux);
                if ($valorestodos[0]['total'] == "") {
                    $sumas[$key12]['suma' . $key12] = 0;
                } else {
                    $sumas[$key12]['suma' . $key12] = $valorestodos[0]['total'];
                }

                if ($valorestodos1[0]['total'] == "") {
                    $sumas1[$key12]['suma' . $key12] = 0;
                } else {
                    $sumas1[$key12]['suma' . $key12] = $valorestodos1[0]['total'];
                }

                if ($sumas[$key12]['suma' . $key12] != 0 && $sumas1[$key12]['suma' . $key12] != 0) {
                    $vias1[$contador]->idvia = $value23->idvia;
                    $vias1[$contador]->denominacion = $value23->denominacion;
                    $diferencia[$contador]['diferencia' . $contador] = $sumas1[$key12]['suma' . $key12] - $sumas[$key12]['suma' . $key12];
                    $contador++;
                } else if ($sumas[$key12]['suma' . $key12] != 0 || $sumas1[$key12]['suma' . $key12] != 0) {
                    $vias1[$contador]->idvia = $value23->idvia;
                    $vias1[$contador]->denominacion = $value23->denominacion;
                    $diferencia[$contador]['diferencia' . $contador] = $sumas1[$key12]['suma' . $key12] - $sumas[$key12]['suma' . $key12];
                    $contador++;
                } else {
                    $sumas[$key12]['eliminar'] = 1;
                    $sumas1[$key12]['eliminar'] = 1;
                }
            }

            $contvias = count($vias1);
            $cuerporeporte .= ' <table border=1 cellspacing=0>';
            $cuerporeporte .= '<tr style="text-align:CENTER;" bgcolor="#BBBBBB"><td></td>';
            $cuerporeporte .= '<td width = 380></td>';
            $cuerporeporte .= '<td colspan=' . $contvias . '><strong>' . $parametros->ejercicioAnterior . '<strong></td>';
            $cuerporeporte .= '<td width = 380></td>';
            $cuerporeporte .= '<td colspan=' . $contvias . '><strong>' . $parametros->ejercicioActual . '<strong></td>';
            $cuerporeporte .= '<td width = 380></td>';
            $cuerporeporte .= '<td colspan=' . $contvias . '><strong>Diferencia<strong></td></tr>';
            $cuerporeporte .= ' <tr style=text-align:CENTER; bgcolor="#BBBBBB">';
            $cuerporeporte .= '<td width = 380><strong>Planes</strong></td>';
            $cuerporeporte .= '<td width = 380><strong>Totales</strong></td>';
            foreach ($vias1 as $value5) {
                $cuerporeporte .= '<td>' . utf8_decode($value5->denominacion) . '</td>';
            }
            $cuerporeporte .= '<td width = 380><strong>Totales</strong></td>';
            foreach ($vias1 as $value56) {
                $cuerporeporte .= '<td>' . utf8_decode($value56->denominacion) . '</td>';
            }
            $cuerporeporte .= '<td width = 380><strong>Totales</strong></td>';
            foreach ($vias1 as $value567) {
                $cuerporeporte .= '<td>' . utf8_decode($value567->denominacion) . '</td>';
            }
            $cuerporeporte .= "</tr>";

            foreach ($modelosunik as $key => $value1) {
                //aki son los gastos capitales
                if ($value1['tipogasto'] == 0) {
                    $datos[$key]['denomodelo'] = $value1['denominacion'];
                    $datos[$key]['idmodelo'] = $value1['idmodelo'];
                    $datos[$key]['denomgasto'] = $value1['denomgasto'];
                    $datos[$key]['urigasto'] = $value1['uridatosnomenclador'];
                    foreach ($vias1 as $key1 => $value) {
                        $valores = $objentmodelo->getCantidadAjustePorEntModelo($entidades, $value1['idmodelo'], $value->idvia, $parametros->idejercicioante);
                        $valores1 = $objentmodelo->getCantidadAjustePorEntModelo($entidades, $value1['idmodelo'], $value->idvia, $parametros->idejercicio);
                        $sumatoria = 0;
                        $sumatoria1 = 0;
                        foreach ($valores as $value2) {
                            $sumatoria += (($value2['cantidad'] + $value2['ajuste']) * $value2['precio']) + (((($value2['cantidad'] + $value2['ajuste']) * $value2['precio']) * $value2['flete']) / 100) + (((($value2['cantidad'] + $value2['ajuste']) * $value2['precio']) * $value2['contingencia']) / 100);
                        }
                        foreach ($valores1 as $value22) {
                            $sumatoria1 += (($value22['cantidad'] + $value22['ajuste']) * $value22['precio']) + (((($value22['cantidad'] + $value22['ajuste']) * $value22['precio']) * $value22['flete']) / 100) + (((($value22['cantidad'] + $value22['ajuste']) * $value22['precio']) * $value22['contingencia']) / 100);
                        }
                        $datos[$key]['via' . $key1] = $sumatoria;
                        $datos[$key]['viaant' . $key1] = $sumatoria1;
                        $datos[$key]['diferencia' . $key1] = $sumatoria1 - $sumatoria;
                    }
                } else {
                    $datos1[$key]['denomodelo'] = $value1['denominacion'];
                    $datos1[$key]['idmodelo'] = $value1['idmodelo'];
                    $datos1[$key]['denomgasto'] = $value1['denomgasto'];
                    $datos1[$key]['urigasto'] = $value1['uridatosnomenclador'];
                    foreach ($vias1 as $key1 => $value) {
                        $valores = $objentmodelo->getCantidadAjustePorEntModelo($entidades, $value1['idmodelo'], $value->idvia, $parametros->idejercicioante);
                        $valores1 = $objentmodelo->getCantidadAjustePorEntModelo($entidades, $value1['idmodelo'], $value->idvia, $parametros->idejercicio);
                        $sumatoria = 0;
                        $sumatoria1 = 0;
                        foreach ($valores as $value2) {
                            $sumatoria += (($value2['cantidad'] + $value2['ajuste']) * $value2['precio']) + (((($value2['cantidad'] + $value2['ajuste']) * $value2['precio']) * $value2['flete']) / 100) + (((($value2['cantidad'] + $value2['ajuste']) * $value2['precio']) * $value2['contingencia']) / 100);
                        }
                        foreach ($valores1 as $value22) {
                            $sumatoria1 += (($value22['cantidad'] + $value22['ajuste']) * $value22['precio']) + (((($value22['cantidad'] + $value22['ajuste']) * $value22['precio']) * $value22['flete']) / 100) + (((($value22['cantidad'] + $value22['ajuste']) * $value22['precio']) * $value22['contingencia']) / 100);
                        }
                        $datos1[$key]['via' . $key1] = $sumatoria;
                        $datos1[$key]['viaant' . $key1] = $sumatoria1;
                        $datos1[$key]['diferencia' . $key1] = $sumatoria1 - $sumatoria;
                    }
                }
            }

            $colspan = 360 + 1 + $contvias * 3;
            $sumaPlanTotal = 0;
            $sumaPlan1Total = 0;
            $sumaDifTotal = 0;
            //para los gastos capital
            $cuerporeporte .= '<tr style=text-align:CENTER;><td colspan=' . $colspan . '>GASTOS CAPITAL</td></tr>';

            foreach ($datos as $value6) {
                $sumaGastosCapital = 0;
                $sumaPlan = 0;
                $sumaPlan1 = 0;
                $sumaDif = 0;
                for ($index = 0; $index < $contvias; $index++) {
                    $sumaGastosCapital += $value6['via' . $index];
                    $sumaGastosCapital += $value6['viaant' . $index];
                }
                if ($sumaGastosCapital != 0) {
                    $cuerporeporte .= ' <tr style=text-align:CENTER;>';
                    $cuerporeporte .= '<td>' . $value6['denomodelo'] . '</td>';

                    for ($index12 = 0; $index12 < $contvias; $index12++) {
                        $sumaPlan += $value6['via' . $index12];
                    }
                    $sumaPlanTotal += $sumaPlan;

                    for ($index13 = 0; $index13 < $contvias; $index13++) {
                        $sumaPlan1 += $value6['viaant' . $index13];
                    }
                    $sumaPlan1Total += $sumaPlan1;

                    for ($index14 = 0; $index14 < $contvias; $index14++) {
                        $sumaDif += $value6['diferencia' . $index14];
                    }
                    $sumaDifTotal +=$sumaDif;

                    $cuerporeporte .= '<td width = 380><strong>' . number_format($sumaPlan, '3', '.', ',') . '</strong></td>';

                    for ($index = 0; $index < $contvias; $index++) {
                        $cuerporeporte .= '<td>' . number_format($value6['via' . $index], '3', '.', ',') . '</td>';
                    }

                    $cuerporeporte .= '<td width = 380><strong>' . number_format($sumaPlan1, '3', '.', ',') . '</strong></td>';

                    for ($index1 = 0; $index1 < $contvias; $index1++) {
                        $cuerporeporte .= '<td>' . number_format($value6['viaant' . $index1], '3', '.', ',') . '</td>';
                    }

                    $cuerporeporte .= '<td width = 380><strong>' . number_format($sumaDif, '3', '.', ',') . '</strong></td>';

                    for ($index2 = 0; $index2 < $contvias; $index2++) {
                        $cuerporeporte .= '<td>' . number_format($value6['diferencia' . $index2], '3', '.', ',') . '</td>';
                    }
                }
            }

            //----------------------------------------

            $cuerporeporte .= ' <tr style=text-align:CENTER;>';
            $cuerporeporte .= '<td width = 380><strong>Total Gastos Capital</strong></td>';
            $cuerporeporte .= '<td width = 380><strong> ' . number_format($sumaPlanTotal, '3', '.', ',') . '</strong> </td>';
            foreach ($vias1 as $valuevia) {
                $valorviatotal = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia->idvia, $parametros->idejercicioante, $modelosauxGastoscap);

                if (!$valorviatotal[0]['total']) {
                    $cuerporeporte .= '<td><strong> ' . number_format(0, '3', '.', ',') . '</strong></td>';
                } else {
                    $cuerporeporte .= '<td><strong> ' . number_format($valorviatotal[0]['total'], '3', '.', ',') . '</strong></td>';
                }
            }
            $cuerporeporte .= '<td width = 380><strong> ' . number_format($sumaPlan1Total, '3', '.', ',') . '</strong> </td>';

            foreach ($vias1 as $valuevia1) {
                $valorviatotal1 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia1->idvia, $parametros->idejercicio, $modelosauxGastoscap);
                if (!$valorviatotal1[0]['total']) {
                    $cuerporeporte .= '<td><strong> ' . number_format(0, '3', '.', ',') . '</strong></td>';
                } else {
                    $cuerporeporte .= '<td><strong> ' . number_format($valorviatotal1[0]['total'], '3', '.', ',') . '</strong></td>';
                }
            }

            $cuerporeporte .= '<td width = 380><strong> ' . number_format($sumaDifTotal, '3', '.', ',') . '</strong> </td>';

            foreach ($vias1 as $valuevia2) {
                $valorviatotaldif = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia2->idvia, $parametros->idejercicioante, $modelosauxGastoscap);
                $valorviatotaldif1 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia2->idvia, $parametros->idejercicio, $modelosauxGastoscap);
                if (!$valorviatotaldif[0]['total'] && !$valorviatotaldif1[0]['total']) {
                    $cuerporeporte .= '<td><strong> ' . number_format(0, '3', '.', ',') . '</strong></td>';
                } else {
                    $cuerporeporte .= '<td><strong> ' . number_format(($valorviatotaldif1[0]['total'] - $valorviatotaldif[0]['total']), '3', '.', ',') . '</strong></td>';
                }
            }

            $cuerporeporte .= "</tr>";

            //--------------------------------

            $sumaPlanTotal1 = 0;
            $sumaPlan1Total1 = 0;
            $sumaDifTotal1 = 0;

            //para los gastos corrientes
            $cuerporeporte .= '<tr style=text-align:CENTER;><td colspan=' . $colspan . '>GASTOS CORRIENTES</td></tr>';
            foreach ($datos1 as $value7) {
                $sumaGastosCorrientes = 0;
                $sumaPlan = 0;
                $sumaPlan1 = 0;
                $sumaDif = 0;
                for ($index = 0; $index < $contvias; $index++) {
                    $sumaGastosCorrientes += $value7['via' . $index];
                    $sumaGastosCorrientes += $value7['viaant' . $index];
                }
                if ($sumaGastosCorrientes != 0) {
                    $cuerporeporte .= ' <tr style=text-align:CENTER;>';
                    $cuerporeporte .= '<td>' . $value7['denomodelo'] . '</td>';

                    for ($index12 = 0; $index12 < $contvias; $index12++) {
                        $sumaPlan += $value7['via' . $index12];
                    }
                    $sumaPlanTotal1 += $sumaPlan;

                    for ($index13 = 0; $index13 < $contvias; $index13++) {
                        $sumaPlan1 += $value7['viaant' . $index13];
                    }
                    $sumaPlan1Total1 += $sumaPlan1;

                    for ($index14 = 0; $index14 < $contvias; $index14++) {
                        $sumaDif += $value7['diferencia' . $index14];
                    }
                    $sumaDifTotal1 += $sumaDif;

                    $cuerporeporte .= '<td width = 380><strong>' . number_format($sumaPlan, '3', '.', ',') . '</strong></td>';

                    for ($index = 0; $index < $contvias; $index++) {
                        $cuerporeporte .= '<td>' . number_format($value7['via' . $index], '3', '.', ',') . '</td>';
                    }

                    $cuerporeporte .= '<td width = 380><strong>' . number_format($sumaPlan1, '3', '.', ',') . '</strong></td>';

                    for ($index1 = 0; $index1 < $contvias; $index1++) {
                        $cuerporeporte .= '<td>' . number_format($value7['viaant' . $index1], '3', '.', ',') . '</td>';
                    }

                    $cuerporeporte .= '<td width = 380><strong>' . number_format($sumaDif, '3', '.', ',') . '</strong></td>';

                    for ($index2 = 0; $index2 < $contvias; $index2++) {
                        $cuerporeporte .= '<td>' . number_format($value7['diferencia' . $index2], '3', '.', ',') . '</td>';
                    }
                }
            }

            //----------------------------------------

            $cuerporeporte .= ' <tr style=text-align:CENTER;>';
            $cuerporeporte .= '<td width = 380><strong>Total Gastos Corriente</strong></td>';
            $cuerporeporte .= '<td width = 380><strong> ' . number_format($sumaPlanTotal1, '3', '.', ',') . '</strong> </td>';

            foreach ($vias1 as $valuevia4) {
                $valorviatotal4 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia4->idvia, $parametros->idejercicioante, $modelosauxGastosCorr);
                if (!$valorviatotal4[0]['total']) {
                    $cuerporeporte .= '<td><strong> ' . number_format(0, '3', '.', ',') . '</strong></td>';
                } else {
                    $cuerporeporte .= '<td><strong> ' . number_format($valorviatotal4[0]['total'], '3', '.', ',') . '</strong></td>';
                }
            }

            $cuerporeporte .= '<td width = 380><strong> ' . number_format($sumaPlan1Total1, '3', '.', ',') . '</strong> </td>';

            foreach ($vias1 as $valuevia5) {
                $valorviatotal5 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia5->idvia, $parametros->idejercicio, $modelosauxGastosCorr);
                if (!$valorviatotal5[0]['total']) {
                    $cuerporeporte .= '<td><strong> ' . number_format(0, '3', '.', ',') . '</strong></td>';
                } else {
                    $cuerporeporte .= '<td><strong> ' . number_format($valorviatotal5[0]['total'], '3', '.', ',') . '</strong></td>';
                }
            }

            $cuerporeporte .= '<td width = 380><strong> ' . number_format($sumaDifTotal1, '3', '.', ',') . '</strong> </td>';

            foreach ($vias1 as $valuevia3) {
                $valorviatotaldif2 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia3->idvia, $parametros->idejercicioante, $modelosauxGastosCorr);
                $valorviatotaldif3 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia3->idvia, $parametros->idejercicio, $modelosauxGastosCorr);
                if (!$valorviatotaldif2[0]['total'] && !$valorviatotaldif3[0]['total']) {
                    $cuerporeporte .= '<td><strong> ' . number_format(0, '3', '.', ',') . '</strong></td>';
                } else {
                    $cuerporeporte .= '<td><strong> ' . number_format(($valorviatotaldif3[0]['total'] - $valorviatotaldif2[0]['total']), '3', '.', ',') . '</strong></td>';
                }
            }

            $cuerporeporte .= "</tr>";

            //--------------------------------

            $cuerporeporte .= ' <tr style=text-align:CENTER bgcolor="#BBBBBB" ;>';
            $cuerporeporte .= '<td width = 380><strong>Totales</strong></td>';
            $cuerporeporte .= '<td width = 380><strong> ' . number_format(($sumaPlanTotal + $sumaPlanTotal1), '3', '.', ',') . '</strong> </td>';

            foreach ($vias1 as $valuevia6) {
                $valorviatotalsuma = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia6->idvia, $parametros->idejercicioante, $modelosaux);
                if (!$valorviatotalsuma[0]['total']) {
                    $cuerporeporte .= '<td><strong> ' . number_format(0, '3', '.', ',') . '</strong></td>';
                } else {
                    $cuerporeporte .= '<td><strong> ' . number_format($valorviatotalsuma[0]['total'], '3', '.', ',') . '</strong></td>';
                }
            }
            $cuerporeporte .= '<td width = 380><strong> ' . number_format(($sumaPlan1Total1 + $sumaPlan1Total), '3', '.', ',') . '</strong> </td>';

            foreach ($vias1 as $valuevia7) {
                $valorviatotalsuma2 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia7->idvia, $parametros->idejercicio, $modelosaux);
                if (!$valorviatotalsuma2[0]['total']) {
                    $cuerporeporte .= '<td><strong> ' . number_format(0, '3', '.', ',') . '</strong></td>';
                } else {
                    $cuerporeporte .= '<td><strong> ' . number_format($valorviatotalsuma2[0]['total'], '3', '.', ',') . '</strong></td>';
                }
            }

            $cuerporeporte .= '<td width = 380><strong> ' . number_format(($sumaDifTotal1 + $sumaDifTotal), '3', '.', ',') . '</strong> </td>';

            foreach ($vias1 as $valuevia7) {
                $valorviatotalsuma4 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia7->idvia, $parametros->idejercicioante, $modelosaux);
                $valorviatotalsuma5 = $objentmodelo->getTotalCantidadAjustePorVia($entidades, $valuevia7->idvia, $parametros->idejercicio, $modelosaux);
                if (!$valorviatotalsuma4[0]['total'] && !$valorviatotalsuma5[0]['total']) {
                    $cuerporeporte .= '<td><strong> ' . number_format(0, '3', '.', ',') . '</strong></td>';
                } else {
                    $cuerporeporte .= '<td><strong> ' . number_format(($valorviatotalsuma5[0]['total'] - $valorviatotalsuma4[0]['total']), '3', '.', ',') . '</strong></td>';
                }
            }
        }

        $cuerporeporte .= "</tr>";
        $cuerporeporte .= ' <tr style=text-align:CENTER;>';
        $cuerporeporte .= "</table>";
        $cuerporeporte .= '</div>';
        $cuerporeporte .= '</body>';

        echo $cuerporeporte;
    }

    public function genererReporteResumenProductosSIPorOrganoSatisface($parametros
    ) {
        switch ($parametros->formatoreporte) {
            case 1:
                $cuerporeporte = $this->configurarHojaReporte($parametros);
                $cadenaENCABEZADOOACE = '';
                $cadenaSUBENCABEZADOOACE = '';
                $totalcolumnas = 5;
                $totalOACE = 0;
                //procedo a calcular el ancho en % de cada columna
                if ($parametros->arrayoace[0]->idoace != null && $parametros->arrayoace[0]->idoace != ''
                ) {
                    $totalOACE = count($parametros->arrayoace);
                    if ($totalOACE > 5)
                        $totalOACE = 5;
                    $totalcolumnas = $totalcolumnas + $totalOACE;
                    $porcientoxcolumna = 100 / $totalcolumnas;
                    $totalOace = 0;
                    $contador = 0;
                    foreach ($parametros->arrayoace as $indice => $oace) {
                        if ($contador < 5) {
                            $idoace = $oace->idoace;
                            $parametros->indicesPosicionOace[$idoace] = $indice;
                            $arrayidoaceUnidimensional[] = $idoace;
                            $cadenaENCABEZADOOACE .= '<td colspan="2" rowspan="2" width="'
                                    . $porcientoxcolumna . '%">'
                                    . $oace->denominacion . '</td>';
                            $cadenaSUBENCABEZADOOACE .= '<td height="21" width="'
                                    . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">
                            cant.</td> <td width="'
                                    . ($porcientoxcolumna / 2)
                                    . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                            $totalOace++;
                            $contador++;
                        }
                    }
                    $parametros->totalOace = $totalOace;

                    $parametros->arrayidoace = $arrayidoaceUnidimensional;
                    $parametros->arrayidoaceUnidimensional = implode(
                            ',', $arrayidoaceUnidimensional
                    );
                } else {
                    $datosnommodel = new NomOrganosatisfaceModel();
                    $arrayOACE = $datosnommodel->listarOrganoSatisfaceSustitucionImp(5);
                    if (isset($arrayOACE[0]['idorganosatisface'])) {
                        $totalOACE = count($arrayOACE);
                        $parametros->totalOACE = $totalOACE;
                        $totalcolumnas = $totalcolumnas + $totalOACE;
                        $porcientoxcolumna = 100 / $totalcolumnas;
                        $totalOace = 0;
                        foreach ($arrayOACE as $indice => $oace) {
                            $idoace = $oace['idorganosatisface'];
                            $parametros->indicesPosicionOace[$idoace] = $indice;
                            $arrayidoaceUnidimensional[] = $idoace;
                            $cadenaENCABEZADOOACE .= '<td colspan="2" rowspan="2" width="'
                                    . $porcientoxcolumna . '%">'
                                    . $oace['denominacion'] . '</td>';
                            $cadenaSUBENCABEZADOOACE .= '<td height="21" width="'
                                    . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">
                                cant.</td>  <td width="'
                                    . ($porcientoxcolumna / 2)
                                    . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                            $totalOace++;
                        }
                        $parametros->totalOace = $totalOace;

                        $parametros->arrayidoace = $arrayidoaceUnidimensional;
                        $parametros->arrayidoaceUnidimensional = implode(
                                ',', $arrayidoaceUnidimensional
                        );
                    }
                }

                $cadenaENCABEZADO = $cadenaENCABEZADOOACE
                        . '</tr><tr> </tr><tr>' . $cadenaSUBENCABEZADOOACE;

                $parametros->anchocolspan = $totalcolumnas + 1 + ($totalOACE);

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0"
                cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td>
                <strong>RESUMEN PRODUCTOS SI POR ORGANO QUE SATISFACEN<strong></td></tr>';
                $cuerporeporte .= "</table>";
                //creando la tabla con las columnas fijas
                $cuerporeporte
                        .= '<table border="1" bordercolor="black"  width="100%" align="center"
                cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
								  <thead>
									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td rowspan="3" height="62" width="'
                        . $porcientoxcolumna . '%">C&oacute;digo</td>
										<td rowspan="3" width="'
                        . $porcientoxcolumna . '%">Denominaci&oacute;n</td>
										<td rowspan="3" width="'
                        . $porcientoxcolumna . '%">UM</td>
										<td rowspan="3" width="'
                        . $porcientoxcolumna . '%">Precio</td>
										<td colspan="2" rowspan="2" width="'
                        . $porcientoxcolumna . '%">Total general</td>';
                //anexando el resto de las columnas
                $cuerporeporte = $cuerporeporte . $cadenaENCABEZADO;
                $cuerporeporte .= '<td height="21" width="'
                        . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">
                    cant.</td> <td width="' . ($porcientoxcolumna / 2)
                        . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';

                //filtro y compartimentacion por centros de balance
                if ($parametros->arrayidcentrobalance[0]->idcentrobalance != null && $parametros->arrayidcentrobalance[0]->idcentrobalance != ''
                ) {
                    foreach (
                    $parametros->arrayidcentrobalance as $centrobalance
                    ) {
                        $arrayidcentrosbalanceUnidimensional[] = $centrobalance->idcentrobalance;
                    }
                    $parametros->arrayidcentrobalance = $arrayidcentrosbalanceUnidimensional;
                    $parametros->arrayidcentrobalanceUnidimensional = implode(
                            ',', $arrayidcentrosbalanceUnidimensional
                    );
                }

                //filtro y compartimentacion por organos demandantes
                //$iddominio = $this->global->Perfil->iddominio;
                //$integrator = ZendExt_IoC::getInstance();
                $arrayidorgandosUnidimensional = array();
                if (isset($parametros->arrayidorganos[0])) {
                    foreach ($parametros->arrayidorganos as $idorgano) {
                        $arrayidorgandosUnidimensional = array_merge(
                                $arrayidorgandosUnidimensional, DatActividadentidad::auxObtenerEntidadesHijasComun($idorgano->idorgano)
                        );
                    }
                } else {
                    $arrayorganosdemandantes = $this->cargarOrganosDemandantes(
                    );
                    if (isset($arrayorganosdemandantes[0])) {
                        foreach ($arrayorganosdemandantes as $organo) {
                            $arrayidorgandosUnidimensional[] = $organo['identidad'];
                        }
                    }
                }
                $parametros->arrayidorganos = $arrayidorgandosUnidimensional;
                $parametros->arrayidorganosUnidimensional = implode(
                        ',', $arrayidorgandosUnidimensional
                );

                //filtro por planes
                $cont = 0;
                if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != ''
                ) {
                    foreach ($parametros->arrayplanes as $plan) {
                        $arrayunidimensionalIdplan[] = $plan->idplan;
                        $cont++;
                    }
                    $parametros->totalplanes = $cont;
                    $parametros->arrayunidimensionalIdplan = implode(
                            ',', $arrayunidimensionalIdplan
                    );
                } else {
                    $parametros->arrayplanes = DatPlanificacion::obtenerPlanesPorEjercicio(
                                    $parametros->idejercicio, $parametros->denoclasifplanrep
                    );

                    foreach ($parametros->arrayplanes as $plan) {

                        $arrayunidimensionalIdplan[] = $plan['idmodelo'];
                        $cont++;
                    }
                    $parametros->totalplanes = $cont;
                    $parametros->arrayunidimensionalIdplan = implode(
                            ',', $arrayunidimensionalIdplan
                    );
                }


                $arraydatos = $this->obtenerCuerpoReporteIndicadores(
                        $parametros
                );
                $cuerporeporte .= $arraydatos['cuerporeporte'];
                $total = $total + $arraydatos['subtotal'];

                //calculando y mostrando el total
                $cuerporeporte .= ' <tr style="text-align:LEFT;background-color:#BBBBBB;">';
                $cuerporeporte
                        .= ' 	<td colspan="' . $parametros->anchocolspan
                        . '"><strong>TOTAL: ' . $total . '<strong></td>';
                $cuerporeporte .= ' </tr>';
                //cerrando la tabla y la hoja
                $cuerporeporte .= "</tbody></table></div>";
                $cuerporeporte .= "</div>";

                return $cuerporeporte;

                break;
        }
    }

    public function obtenerCuerpoReporteResumenProductosPorOACE($parametros) {
        //filtro por planes
        $cont = 0;
        if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != ''
        ) {
            foreach ($parametros->arrayplanes as $plan) {
                $idplan = $plan->idplan;
                $parametros->idplan = $idplan;
                $cuerporeporte = '<tr style="text-align:CENTER;height:auto" height=auto>
									<td height="21" colspan="4" width="'
                        . ($porcientoxcolumna / 4)
                        . '%"><div align="left"> ' . $plan->denominacion . '</div></td>
									';
                //poniendo las columnas vacions del plan anterior
                $cuerporeporte .= '<td height="21" width="'
                        . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%">
								 <div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%">
								 <div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4)
                        . '%"><div align="center">-</div></td>';

                //consulta para obtener el plan sumarizado
                $resultadoUno = DatPlanificacion::consulta3_1($parametros);
                $resultadoDos = DatPlanificacion::consulta3_2($parametros);
                $resultadoTres = DatPlanificacion::consulta3_3($parametros);
                $total = $resultadoUno + $resultadoDos + $resultadoTres;
                $cuerporeporte
                        .= '<td height="21" width="' . ($porcientoxcolumna / 4)
                        . '%"><div align="center">' . $total . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4)
                        . '%"><div align="center">' . $resultadoUno . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4)
                        . '%"><div align="center">' . $resultadoDos . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4)
                        . '%"><div align="center">'
                        . $resultadoTres . '</div></td>';


                //poniendo las columnas vacions del plan proximo
                $cuerporeporte .= '<td height="21" width="'
                        . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%">
								 <div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%">
								 <div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4)
                        . '%"><div align="center">-</div></td>';

                $cuerporeporte .= '</tr>';
            }
        } else {
            $arrayplanes = DatPlanificacion::obtenerPlanesPorEjercicioTipoGasto(
                            $parametros
            );
            if (isset($arrayplanes[0])) {
                $cont = 0;
                foreach ($arrayplanes as $plan) {
                    $idplan = $plan['idmodelo'];
                    $parametros->idplan = $idplan;
                    $cuerporeporte = '<tr style="text-align:CENTER;height:auto" height=auto>
									<td height="21" colspan="4" width="'
                            . ($porcientoxcolumna / 4)
                            . '%"><div align="left"> ' . $plan['denominacion'] . '</div></td>
									';
                    //poniendo las columnas vacions del plan anterior
                    $cuerporeporte .= '<td height="21" width="'
                            . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%">
									 <div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%">
									 <div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4)
                            . '%"><div align="center">-</div></td>';

                    //consulta para obtener el plan sumarizado
                    $resultadoUno = DatPlanificacion::consulta3_1($parametros);
                    $resultadoDos = DatPlanificacion::consulta3_2($parametros);
                    $resultadoTres = DatPlanificacion::consulta3_3($parametros);
                    $total = $resultadoUno + $resultadoDos + $resultadoTres;
                    $cuerporeporte
                            .= '<td height="21" width="' . ($porcientoxcolumna / 4)
                            . '%"><div align="center">' . $total . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4)
                            . '%"><div align="center">' . $resultadoUno . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4)
                            . '%"><div align="center">' . $resultadoDos . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4)
                            . '%"><div align="center">'
                            . $resultadoTres . '</div></td>';

                    //poniendo las columnas vacions del plan proximo
                    $cuerporeporte .= '<td height="21" width="'
                            . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%">
									 <div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%">
									 <div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4)
                            . '%"><div align="center">-</div></td>';

                    $cuerporeporte .= '</tr>';
                }
            }
        }
        return $cuerporeporte;
    }

    public function genererReporteDemandaPlanInversiones($parametros) {

        switch ($parametros->formatoreporte) {
            case 1:
                $cuerporeporte = $this->configurarHojaReporte($parametros);
                $totalcolumnas = 16;
                $porcientoxcolumna = 100 / $totalcolumnas;

                $parametros->anchocolspan = $totalcolumnas;

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0"
                    cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td>
                <strong>DEMANDA POR PLANES PARA INVERSIONES<strong></td></tr>';
                $cuerporeporte .= "</table>";
                //creando la tabla con las columnas fijas
                $cuerporeporte
                        .= '<table border="1" bordercolor="black"  width="100%" align="center"
                        cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
								  <thead>
									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td  width="' . $porcientoxcolumna . '%">&Oacute;rgano demandante</td>
										<td  width="' . $porcientoxcolumna . '%">C&oacute;digo</td>
										<td  width="' . $porcientoxcolumna . '%">No.Pieza</td>
										<td  width="' . $porcientoxcolumna . '%">Denominaci&oacute;n</td>
										<td   width="' . $porcientoxcolumna . '%">UM</td>
										<td   width="' . $porcientoxcolumna . '%">Precio</td>
										<td   width="' . $porcientoxcolumna . '%">Centro de Balance</td>
										<td   width="' . $porcientoxcolumna . '%">Cantidad</td>
										<td   width="' . $porcientoxcolumna . '%">Imp.MN</td>
										<td   width="' . $porcientoxcolumna . '%">Imp.FS</td>
										<td   width="' . $porcientoxcolumna . '%">Imp.Cont</td>
										<td   width="' . $porcientoxcolumna . '%">Imp.Total</td>
										<td   width="' . $porcientoxcolumna . '%">V&iacute;a de Adq.</td>
										<td   width="' . $porcientoxcolumna . '%">&Oacute;rgano Satisface</td>
										<td   width="' . $porcientoxcolumna . '%">Sector Rama</td>
										<td   width="' . $porcientoxcolumna . '%">Destino</td>
									</tr>
								  </thead>';

                //filtro por sector rama
                $totalSectores = 0;
                if ($parametros->arraysectores[0]->idsector != null && $parametros->arraysectores[0]->idsector != ''
                ) {
                    foreach ($parametros->arraysectores as $indice => $sector) {
                        $arrayidsectoresUnidimensional[] = $sector->idsector;
                        $totalSectores++;
                    }
                    $parametros->arrayidsectores = $arrayidsectoresUnidimensional;
                    $parametros->arrayidsectoresUnidimensional = implode(
                            ',', $arrayidsectoresUnidimensional
                    );
                }
                $parametros->totalSectores = $totalSectores;

                //filtro por destino
                $totalDestinos = 0;
                if ($parametros->arraydestinos[0]->iddestino != null && $parametros->arraydestinos[0]->iddestino != ''
                ) {
                    foreach ($parametros->arraydestinos as $indice => $destino) {
                        $arrayiddestinosUnidimensional[] = $destino->iddestino;
                        $totalDestinos++;
                    }
                    $parametros->arrayiddestinos = $arrayiddestinosUnidimensional;
                    $parametros->arrayiddestinosUnidimensional = implode(
                            ',', $arrayiddestinosUnidimensional
                    );
                }
                $parametros->totalDestinos = $totalDestinos;

                //filtro por vias de adquisicion(la primera que aparezca)
                $totalVias = 0;
                if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != ''
                ) {
                    foreach (
                    $parametros->arrayviasadquisicion as $indice => $viaadquisicion
                    ) {
                        $arrayidviasUnidimensional[] = $viaadquisicion->idvia;
                        $totalVias++;
                    }
                } else {
                    $arrayVA = NomViaadquisicion::Obtener_via_adquisicion();
                    foreach ($arrayVA->data as $indice => $va) {
                        $arrayidviasUnidimensional[] = $va['idviaadquisicion'];
                        $totalVias++;
                    }
                }
                $parametros->arrayidvias = $arrayidviasUnidimensional;
                $parametros->arrayidviasUnidimensional = implode(
                        ',', $arrayidviasUnidimensional
                );
                $parametros->totalVias = $totalVias;

                //filtro por organos demandantes
                //$iddominio = $this->global->Perfil->iddominio;
                //$integrator = ZendExt_IoC::getInstance();
                $totalOrganos = 0;
                $arrayidorgandosUnidimensional = array();
                if (isset($parametros->arrayidorganos[0])) {
                    foreach ($parametros->arrayidorganos as $idorgano) {
                        $arrayidorgandosUnidimensional = array_merge(
                                $arrayidorgandosUnidimensional, DatActividadentidad::auxObtenerEntidadesHijasComun($idorgano->idorgano)
                        );
                        $totalOrganos++;
                    }
                    $parametros->arrayidorganos = $arrayidorgandosUnidimensional;
                    $parametros->arrayidorganosUnidimensional = implode(
                            ',', $arrayidorgandosUnidimensional
                    );
                }
                $parametros->totalOrganos = count(
                        $arrayidorgandosUnidimensional
                ); //$totalOrganos;

                $totalCentrosbalance = 0;
                if ($parametros->arrayidcentrobalance[0]->idcentrobalance != null && $parametros->arrayidcentrobalance[0]->idcentrobalance != ''
                ) {
                    foreach (
                    $parametros->arrayidcentrobalance as $centrobalance
                    ) {
                        $arrayidcentrosbalanceUnidimensional[] = $centrobalance->idcentrobalance;
                        $totalCentrosbalance++;
                    }
                    $parametros->arrayidcentrosbalanceUnidimensional = implode(
                            ',', $arrayidcentrosbalanceUnidimensional
                    );
                }
                $parametros->totalcentrobalance = $totalCentrosbalance;

                //filtro por planes
                $total = 0;
                if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != ''
                ) {
                    foreach ($parametros->arrayplanes as $plan) {
                        $parametros->idplan = $plan->idplan;
                        $nombreplan = $plan->denominacion;
                        $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                        $cuerporeporte .= ' 	<td colspan="16"><strong>'
                                . $nombreplan . '</strong></td>';
                        $cuerporeporte .= ' </tr>';
                        $arraydatos = $this->obtenerCuerpoReporteIndicadores(
                                $parametros
                        );

                        $cuerporeporte .= $arraydatos['cuerporeporte'];
                        $total = $total + $arraydatos['subtotal'];
                    }
                } else {
                    $arrayplanesexistentes = DatPlanificacion::obtenerPlanesPorEjercicio(
                                    $parametros->idejercicio, $parametros->denoclasifplanrep
                    );
                    if (isset($arrayplanesexistentes[0]['idmodelo'])) {
                        foreach ($arrayplanesexistentes as $plan) {
                            $parametros->idplan = $plan['idmodelo'];
                            $nombreplan = $plan['denominacion'];
                            $arraydatos = $this->obtenerCuerpoReporteIndicadores(
                                    $parametros
                            );

                            if ($arraydatos['subtotal'] != 0) {
                                $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                                $cuerporeporte .= ' 	<td colspan="'
                                        . $parametros->anchocolspan . '"><strong>'
                                        . $nombreplan . '</strong></td>';
                                $cuerporeporte .= ' </tr>';
                                $cuerporeporte .= $arraydatos['cuerporeporte'];
                                $total = $total + $arraydatos['subtotal'];
                            }
                        }
                    }
                }

                //calculando y mostrando el total
                $cuerporeporte .= ' <tr style="text-align:LEFT;background-color:#BBBBBB;">';
                $cuerporeporte
                        .= ' 	<td colspan="' . $parametros->anchocolspan
                        . '"><strong>TOTAL: ' . $total . '<strong></td>';
                $cuerporeporte .= ' </tr>';
                //cerrando la tabla y la hoja
                $cuerporeporte .= "</tbody></table></div>";
                $cuerporeporte .= "</div>";

                return $cuerporeporte;
                break;
        }
    }

    public function genererReporteBalance($parametros) {

        switch ($parametros->formatoreporte) {
            case 1:
                $cuerporeporte = $this->configurarHojaReporte($parametros);
                $totalcolumnas = 16;
                //$porcientoxcolumna = 100 / $totalcolumnas;

                $parametros->anchocolspan = $totalcolumnas;

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0"
                    cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td>
                    <strong>DATOS DEL BALANCE MATERIAL<strong></td></tr>';
                $cuerporeporte .= "</table>";

                $arraydatos = $this->obtenerCuerpoReporteIndicadores(
                        $parametros
                );

                $cuerporeporte .= $arraydatos['cuerporeporte'];
                $total = $arraydatos['subtotal'];
                if ($parametros->idreporte != 6) {
                    //calculando y mostrando el total
                    $cuerporeporte .= ' <tr style="text-align:LEFT;background-color:#BBBBBB;">';
                    $cuerporeporte
                            .= ' 	<td colspan="' . $parametros->anchocolspan
                            . '"><strong>TOTAL: ' . $total . '<strong></td>';
                    $cuerporeporte .= ' </tr>';
                }
                //cerrando la tabla y la hoja
                $cuerporeporte .= "</tbody></table></div>";
                $cuerporeporte .= "</div>";

                return $cuerporeporte;
                break;
        }
    }

    public function generarReporteAjuste($parametros) {

        switch ($parametros->formatoreporte) {
            case 1:
                $cuerporeporte = $this->configurarHojaReporte($parametros);

                $totalcolumnas = 16;
                //$porcientoxcolumna = 100 / $totalcolumnas;

                $parametros->anchocolspan = $totalcolumnas;

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="50%"  cellpadding="0" cellspacing="0"
                    style="margin-top:1cm;margin-left:1cm;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td>
                    <strong>RESUMEN DE AJUSTES AL PLAN<strong></td></tr>';
                $cuerporeporte .= "</table>";

                $arraydatos = $this->obtenerCuerpoReporteIndicadores(
                        $parametros
                );
                $cuerporeporte .= $arraydatos['cuerporeporte'];
                //cerrando la tabla y la hoja
                $cuerporeporte .= "</tbody></table></div>";
                $cuerporeporte .= "</div>";
                return $cuerporeporte;
                break;
        }
    }

    public function generarReporteDiferenciaPrecio($parametros) {
        switch ($parametros->formatoreporte) {
            case 1:
                $cuerporeporte = $this->configurarHojaReporte($parametros);
                $totalcolumnas = 16;
                //$porcientoxcolumna = 100 / $totalcolumnas;

                $parametros->anchocolspan = $totalcolumnas;

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%"  cellpadding="0"
                        cellspacing="0" style="margin-top:1cm;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td>
                        <strong>RESUMEN POR DIFERENCIA DE PRECIO<strong></td></tr>';
                $cuerporeporte .= "</table>";

                $arraydatos = $this->obtenerCuerpoReporteIndicadores(
                        $parametros
                );
                $cuerporeporte .= $arraydatos['cuerporeporte'];
//
                //cerrando la tabla y la hoja
                $cuerporeporte .= "</tbody></table></div>";
                $cuerporeporte .= "</div>";

                return $cuerporeporte;
                break;
        }
    }

    public function obtenerPlanesPorEjercicio($parametros) {
        if ($parametros->arraytipogasto[0]->idtipogasto != null && $parametros->arraytipogasto[0]->idtipogasto != ''
        ) {
            foreach ($parametros->arraytipogasto as $tipogasto) {
                if ($tipogasto->idtipogasto == 1) {
                    $arrayunidimensionalUritipogasto[] = 'gastoscorriente';
                } else {
                    $arrayunidimensionalUritipogasto[] = 'gastoscapital';
                }
            }
            $parametros->arrayunidimensionalUritipogasto = implode(
                    "','", $arrayunidimensionalUritipogasto
            );
            $arrayplanesxejerc = DatPlanificacion::obtenerPlanesPorEjercicioTipoGasto(
                            $parametros
            );
        } else {
            $arrayplanesxejerc = DatPlanificacion::obtenerPlanesPorEjercicio(
                            $parametros->idejercicio, $parametros->denclasificplan
            );
        }
        return $arrayplanesxejerc;
    }

    public function obtenerPlanesPorEjercicioReporte_3($parametros) {
        if ($parametros->arraytipogasto[0]->idtipogasto != null && $parametros->arraytipogasto[0]->idtipogasto != ''
        ) {
            foreach ($parametros->arraytipogasto as $tipogasto) {
                if ($tipogasto->idtipogasto == 1) {
                    $arrayunidimensionalUritipogasto[] = 'gastoscorriente';
                } else {
                    $arrayunidimensionalUritipogasto[] = 'gastoscapital';
                }
            }
            $parametros->arrayunidimensionalUritipogasto = implode(
                    "','", $arrayunidimensionalUritipogasto
            );
            $arrayplanesxejerc = DatPlanificacion::obtenerPlanesPorEjercicioTipoGastoReporte_3(
                            $parametros
            );
        } else {
            $arrayplanesxejerc = DatPlanificacion::obtenerPlanesPorEjercicio(
                            $parametros->idejercicio, $parametros->denclasificplan
            );
        }
        return $arrayplanesxejerc;
    }

    public function cargarIndicadoresReporte($parametros) {
        if ($parametros->idreporte) {
            //filtro y compartimentacion por organos demandantes
            if (isset($parametros->arrayidorganos[0])) {
                foreach ($parametros->arrayidorganos as $idorgano) {
                    $arrayidorgandosUnidimensional[] = $idorgano->idorgano;
                }
            } else {
                $arrayidorgandosUnidimensional[] = $parametros->entidad;
                $arrayentidades = $this->integrator->metadatos->DameEstructurasinChecked(
                        $parametros->entidad
                );
                if (isset($arrayentidades[0]['id'])) {
                    foreach ($arrayentidades as $entidad) {
                        $arrayidorgandosUnidimensional[] = $entidad['id'];
                    }
                }
            }
            $parametros->arrayidorganos = $arrayidorgandosUnidimensional;
            $parametros->arrayidorganosUnidimensional = implode(
                    ',', $arrayidorgandosUnidimensional
            );

            //filtro por vias de adquisicion
            if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != ''
            ) {
                $totalVA = count($parametros->arrayviasadquisicion);
                $totalVias = 0;
                foreach (
                $parametros->arrayviasadquisicion as $indice => $viaadquisicion
                ) {
                    $idvia = $viaadquisicion->idvia;
                    $arrayidviasUnidimensional[] = $viaadquisicion->idvia;
                    $totalVias++;
                }
                $parametros->totalVias = $totalVias;
            } else {
                $arrayVA = NomViaadquisicion::Obtener_via_adquisicion();
                $totalVA = count($arrayVA->data);
                $totalVias = 0;
                foreach ($arrayVA->data as $indice => $va) {
                    $idvia = $va['idviaadquisicion'];
                    $arrayidviasUnidimensional[] = $va['idviaadquisicion'];
                    $totalVias++;
                }
                $parametros->totalVias = $totalVias;
            }
            $parametros->arrayidvias = $arrayidviasUnidimensional;
            $parametros->arrayidviasUnidimensional = implode(
                    ',', $arrayidviasUnidimensional
            );

            //filtro por planes
            //$total = 0;
            if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != ''
            ) {
                foreach ($parametros->arrayplanes as $plan) {
                    $arrayidplanesUnidimensional = $plan->idplan;
                }
            } else {
                $arrayplanesexistentes = DatPlanificacion::obtenerPlanesPorEjercicio(
                                $parametros->idejercicio
                );

                if (isset($arrayplanesexistentes[0]['idmodelo'])) {
                    foreach ($arrayplanesexistentes as $plan) {
                        $arrayidplanesUnidimensional = $plan['idmodelo'];
                    }
                }
            }
            $parametros->arrayidplanes = $arrayidplanesUnidimensional;
            $parametros->arrayidplanesUnidimensional = implode(
                    ',', $arrayidplanesUnidimensional
            );


            /* $arrayindicadores
              = DatPlanificacion::obtenerIndicadoresReporteResumenPorViaAdquisicion(
              $parametros
              ); */
        }
    }

    public function configurarHojaReporte($parametros) {
        switch ($parametros->dimensioneshoja) {
            case 1:
                $ancho = 21.59;
                $alto = 27.94;
                break;
            case 2:
                $ancho = 29.70;
                $alto = 42.00;
                break;
            case 3:
                $ancho = 21.00;
                $alto = 29.70;
                break;
            case 4:
                $ancho = 27.94;
                $alto = 43.18;
                break;
        }

        $altohoja = $alto - 2;
        //$altohojainicial = $alto - 2;
        $anchohoja = $ancho - 2;
        //$anchohojainicial = $ancho - 2;

        $orientacionhoja = "portrait";
        if ($parametros->posicionhoja == 2) {
            $orientacionhoja = "landscape";
            $altohoja = $ancho - 2;
            $anchohoja = $alto - 2;
            $temp = $ancho;
            $ancho = $alto;
            $alto = $temp;
        }


        $cuerporeporte = "<style type='text/css'>
                 @media all {body{display: block; background: none no-repeat scroll 100% 100% #666666;}}
                 @media print {*{visibility: visible;  padding: 0 !important; } div{ top:0; right:0;
                  bottom:0; left:0; #AP{margin-top: 1cm;}}}

				 @page{height:" . $alto . "cm;width:" . $ancho . "cm;size:"
                . $orientacionhoja . ";}
				 </style>";

        $cuerporeporte .= "<div style='margin:auto;width:"
                . $ancho
                . "cm;height:auto;background-color:white;padding:1cm 0.5cm 1cm 0.5cm;'>";
        $cuerporeporte .= "<div style='width:100%;'>";


        return $cuerporeporte;
    }

    public function obtenerCuerpoReporteIndicadores($parametros) {
        $cuerporeporteindicadores = "";
        $subtotal = 0;
        switch ($parametros->idreporte) {
            case 1:
                $arrayindicadores = DatPlanificacion::obtenerIndicadoresReporteResumenPorViaAdquisicion(
                                $parametros
                );


                if (isset($arrayindicadores[0]['idindicador'])) {
                    foreach ($arrayindicadores as $posicionind => $indicador) {
                        $idindicador = $indicador['idindicador'];
                        $idviaadquisicion = $indicador['idviaadquisicion'];
                        $precio = $indicador['precio'];

                        if ($parametros->mostrarindicadores == 'true') {
                            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;">';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['codigo'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['nombreindicador'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['nombreum'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['precio'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >' . number_format($indicador['cantidad'], 3, '.', ',') . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >' . number_format($indicador['importe'] / 1000, 3, '.', ',') . '</td>';

                            //escribiendo valores en las columnas segun la via de adquisicion
                            $idviaadquisicion = $indicador['idviaadquisicion'];
                            $posicionIdvia = $parametros->indicesPosicionVias[$idviaadquisicion];
                            for ($i = 0; $i < $posicionIdvia; $i++) {
                                $cuerporeporteindicadores .= ' 	<td width="'
                                        . ($porcientoxcolumna / 2)
                                        . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="'
                                        . ($porcientoxcolumna / 2)
                                        . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' 	<td width="'
                                    . ($porcientoxcolumna / 2) . '%" >'
                                    . number_format($indicador['cantidad'], 3, '.', ',') . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="'
                                    . ($porcientoxcolumna / 2) . '%" >'
                                    . number_format($indicador['importe'] / 1000, 3, '.', ',') . '</td>';

                            for ($i = $posicionIdvia + 1; $i < $parametros->totalVias; $i++) {
                                $cuerporeporteindicadores .= ' 	<td width="'
                                        . ($porcientoxcolumna / 2)
                                        . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="'
                                        . ($porcientoxcolumna / 2)
                                        . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' </tr>';
                        }

                        //calculando el subtotal por importe o valor
                        $subtotal = $subtotal + $indicador['importe'];
                    }
                }
                break;
            case 2:
                $subtotal = 0;
                $arrayindicadores = DatPlanificacion::obtenerIndicadoresReporteResumenComparativoPlanPorConceptos(
                                $parametros
                );

                if (isset($arrayindicadores[0]['idindicador'])) {
                    foreach ($arrayindicadores as $posicionind => $indicador) {
                        $idindicador = $indicador['idindicador'];
                        $idviaadquisicion = $indicador['idviaadquisicion'];
                        $precio = $indicador['precio'];

                        if ($parametros->mostrarindicadores == 'true') {
                            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;font-size:10.0pt;">';
                            if ($parametros->idnivel == 3) {
                                $cuerporeporteindicadores .= ' 	<td>'
                                        . $indicador['codigoespecifico'] . '</td>';
                                $cuerporeporteindicadores .= ' 	<td>'
                                        . $indicador['denominacionespecifico']
                                        . '</td>';
                            } elseif ($parametros->idnivel == 2) {
                                $cuerporeporteindicadores .= ' 	<td>'
                                        . $indicador['codigosubgenerico'] . '</td>';
                                $cuerporeporteindicadores .= ' 	<td>'
                                        . $indicador['denominacionsubgenerico']
                                        . '</td>';
                            } elseif ($parametros->idnivel == 1) {
                                $cuerporeporteindicadores .= ' 	<td>'
                                        . $indicador['codigogenerico'] . '</td>';
                                $cuerporeporteindicadores .= ' 	<td>'
                                        . $indicador['denominaciongenerico']
                                        . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td>'
                                        . $indicador['codigo'] . '</td>';
                                $cuerporeporteindicadores .= ' 	<td>'
                                        . $indicador['nombreindicador'] . '</td>';
                            }


                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['denominacionunidadmedida'] . '</td>';

                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['organodemandante'] . '</td>';

                            $cuerporeporteindicadores .= ' 	<td style="font-size:10.0pt;">' . $indicador['precio'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td style="font-size:10.0pt;" width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . number_format($indicador['cantidad'], '3', '.', ',') . '</td>';
                            $cuerporeporteindicadores .= ' 	<td style="font-size:10.0pt;" width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . number_format($indicador['importe'], '3', '.', ',') . '</td>';

                            $cuerporeporteindicadores .= ' </tr>';
                        }

                        //calculando el subtotal por importe o valor
                        $subtotal = number_format(($subtotal + $indicador['importe']), '3', '.', ',');
                    }
                    //$subtotal = $subtotal + $indicador['importe'];
                }


                // }
                break;
            case 3:

                break;
            case 4:
                $arrayindicadores = DatPlanificacion::obtenerIndicadoresReporteResumenProductosSIPorOrganoSatisface(
                                $parametros
                );
                if (isset($arrayindicadores[0]['idindicador'])) {
                    foreach ($arrayindicadores as $posicionind => $indicador) {
                        $idindicador = $indicador['idindicador'];
                        $idviaadquisicion = $indicador['idviaadquisicion'];
                        $precio = $indicador['precio'];

                        if ($parametros->mostrarindicadores == 'true') {
                            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;">';
                            $cuerporeporteindicadores .= ' 	<td>'
                                    . $indicador['codigo'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>'
                                    . $indicador['nombreindicador'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>'
                                    . $indicador['nombreum'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>'
                                    . $indicador['precio'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="'
                                    . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['cantidad'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="'
                                    . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['importe'] . '</td>';

                            //escribiendo valores en las columnas segun la via de adquisicion
                            $idoace = $indicador['idoace'];
                            $posicionIdoace = $parametros->indicesPosicionOace[$idoace];
                            for ($i = 0; $i < $posicionIdoace; $i++) {
                                $cuerporeporteindicadores .= ' 	<td width="'
                                        . ($porcientoxcolumna / 2)
                                        . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="'
                                        . ($porcientoxcolumna / 2)
                                        . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' 	<td width="'
                                    . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['cantidad'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="'
                                    . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['importe'] . '</td>';
                            for (
                            $i = $posicionIdoace + 1; $i < $parametros->totalOace; $i++
                            ) {
                                $cuerporeporteindicadores .= ' 	<td width="'
                                        . ($porcientoxcolumna / 2)
                                        . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="'
                                        . ($porcientoxcolumna / 2)
                                        . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' </tr>';
                        }

                        //calculando el subtotal por importe o valor
                        $subtotal = $subtotal + $indicador['importe'];
                    }
                }
                break;
            /*
             * SI POR CASUALIDAD TE MANDAN A TRABAJAR EN ESTE REPORTE POR FAVOR CONTACTE CON
             * ESTE USUARIO
             * ODURAN   ELLA TIENE LA SOLUCION A ESE PROBLEMA
             */
            case 6:

                if (!(bool) $parametros->balancear) {
                    if ($parametros->comportamiento != 2) {
                        //obteniendo la cadena de iddatosnomenclador de los cb a filtrar
                        //dependiendo de la seleccion o de la entidad logueada
                        if ($parametros->idcentrosb[0]->idcentrobalance != null
                        ) {
                            foreach ($parametros->idcentrosb as $p => $s) {
                                $idcentrosb[$p] = $s->idcentrobalance;
                            }
                        } else {
                            if ($parametros->esrector != 'true') {
                                $idcentrosb[] = $parametros->identidadlog;
                            } else {
                                $arrcb = DatEntidaddatosnomenclador::getCB();
                                foreach ($arrcb as $p => $s) {
                                    $idcentrosb[$p] = $s['identidad'];
                                }
                            }
                        }

                        $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                                        $idcentrosb
                        );

                        foreach ($entidaddatosnom as $p => $s) {
                            $entidaddatosnom[$p]['identidaddatosnomenclador'] = $s['identidaddatosnomenclador'];
                            $paraobtplanes[] = $s['identidaddatosnomenclador'];
                            $idebtdatnompatodas[$p] = $s['identidaddatosnomenclador'];
                        }
                        $parametros->idcentrosb = $idcentrosb;
                        $parametros->paraobtplanes = $paraobtplanes;
                        $parametros->entidaddatosnom = $entidaddatosnom;
                        $parametros->idebtdatnompatodas = $idebtdatnompatodas;
                        $parametros->importetotaldelreportecb = 0;
                        foreach ($parametros->entidaddatosnom as $p => $s) {
                            $parametros->importetotaldelcb = 0;
                            $parametros->iddatnomparacb = $s['identidaddatosnomenclador'];
                            $parametros->controladorcb = 0;
                            $cuerporeporteindicadores = $cuerporeporteindicadores
                                    . self::obtenerEntidadesHijosPlanesIndicadoresDelReporteBm(
                                            $parametros
                            );
                            if ($parametros->controladorcb == 2) {
                                $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                                $cuerporeporteindicadores
                                        .= ' 	<td colspan="'
                                        . $parametros->anchocolspan
                                        . '" >IMPORTE TOTAL DEL CENTRO DE BALANCE: '
                                        . number_format(
                                                $parametros->importetotaldelcb, '3', '.', ','
                                        ) . '</td>';
                            }
                            $parametros->importetotaldelreportecb = $parametros->importetotaldelreportecb + $parametros->importetotaldelcb;
                        }
                        $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                        $cuerporeporteindicadores
                                .= ' 	<td colspan="' . $parametros->anchocolspan
                                . '" >IMPORTE TOTAL: ' . number_format(
                                        $parametros->importetotaldelreportecb, '3', '.', ','
                                ) . '</td>';
                    } else {
                        $cuerporeporteindicadores = $cuerporeporteindicadores
                                . self::obtenerEntidadesHijosPlanesIndicadoresDelReporteBm(
                                        $parametros
                        );
                    }
                } else {

                    foreach ($parametros->idcentrosb as $p => $s) {
                        $idcentrosb[$p] = $s->idcentrobalance;
                    }
                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                                    $idcentrosb
                    );

                    foreach ($entidaddatosnom as $p => $s) {
                        $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                        $identidades[$p] = $s['identidad'];
                    }
                    $parametros->idcentrosb = $entidaddatosnom;
                    $parametros->hijosentidad = $identidades;

                    if ($parametros->idmodelos[0]->idplan != null) {
                        foreach ($parametros->idmodelos as $key => $k) {
                            $model[$key]['idmodelo'] = $k->idplan;
                            $model[$key]['denominacion'] = $k->denominacion;
                        }
                    } else {
                        $model = DatPlanificacion::obtPlanesRepBal($parametros);
                    }
                    $parametros->importetotal = 0;
                    foreach ($parametros->idcentrosb as $ke => $c) {
                        $cont = 0;
                        $parametros->identidad = $parametros->hijosentidad[$ke];
                        $parametros->idcb = $c;
                        $datosentidad = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->identidad); /* $parametros->integ->metadatos->DameEstructura(
                          $parametros->identidad
                          ); */
                        $parametros->k->denominacion = $datosentidad[0]->denominacion;
                        $parametros->importetotalentidad = 0;
                        foreach ($model as $key => $k) {
                            $parametros->idmodelo = $k['idmodelo'];
                            $parametros->denominacionplan = $k['denominacion'];

                            $totalind = DatAjusteexistenciacb::contarIndicadoresTotalReporteCB(
                                            $parametros
                            );

                            $cantRegistro = 13000;
                            if ($totalind <= 13000) {
                                $cantPaginas = 1;
                            } else {
                                $cantPaginas = (int) ($totalind / $cantRegistro);
                                if (fmod($totalind, $cantRegistro) > 0) {
                                    $cantPaginas++;
                                }
                            }
                            $start = 0;
                            $parametros->limit = $cantRegistro;
                            //$cantPaginas=1;
                            $parametros->importeplanentidad = 0;
                            for ($i = 1; $i <= $cantPaginas; $i++) {
                                $parametros->iteracion = $i;
                                if ($i == $cantPaginas) {
                                    $parametros->iteracionF = 5;
                                }
                                $parametros->start = $start;
                                $parametros->indicad = DatAjusteexistenciacb::obtenerDatosDelReporteCBBalancear(
                                                $parametros
                                );

                                $start += $cantRegistro;

                                if ($parametros->indicad[0] != null) {
                                    $cont = 2;
                                    $cuerporeporteindicadores .= self::pintarDatosReporteBalance(
                                                    $parametros
                                    );
                                    $parametros->indicad = null;
                                }
                            }
                        }
                        if ($cont == 2) {
                            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                            $cuerporeporteindicadores
                                    .= ' 	<td colspan="'
                                    . $parametros->anchocolspan
                                    . '" >IMPORTE TOTAL DEL CENTRO DE BALANCE: '
                                    . number_format(
                                            $parametros->importetotalentidad, '3', '.', ','
                                    ) . '</td>';
                        }
                        $parametros->importetotal = $parametros->importetotal + $parametros->importetotalentidad;
                    }
                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                    $cuerporeporteindicadores
                            .= ' 	<td colspan="' . $parametros->anchocolspan
                            . '" >IMPORTE TOTAL: ' . number_format(
                                    $parametros->importetotal, '3', '.', ','
                            ) . '</td>';
                }

                break;
            case 5:

                $arrayindicadores = DatPlanificacion::obtenerIndicadoresReporteDemandaPlanInversiones(
                                $parametros
                );

                if (isset($arrayindicadores[0]['idindicador'])) {
                    foreach ($arrayindicadores as $posicionind => $indicador) {

                        $idindicador = $indicador['idindicador'];
                        $idviaadquisicion = $indicador['idviaadquisicion'];
                        $precio = $indicador['precio'];

                        if ($parametros->mostrarindicadores == 'true') {
                            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;">';

                            if ($indicador['organodemandante'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['organodemandante'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['codigo'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['codigo'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['numeropieza'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['numeropieza'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['nombreindicador'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['nombreindicador'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['nombreum'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['nombreum'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['precio'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['precio'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }


                            if ($indicador['centrobalance'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['centrobalance'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['cantidad'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['cantidad'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['importemn'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['importemn'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['importefs'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['importefs'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['importecont'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['importecont'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['importetotal'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['importetotal'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['viaadquisicion'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['viaadquisicion'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['organosatisface'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['organosatisface'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['sectorrama'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['sectorrama'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            if ($indicador['destino'] != "") {
                                $cuerporeporteindicadores .= ' 	<td>' . $indicador['destino'] . '</td>';
                            } else {
                                $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                            }
                            $cuerporeporteindicadores .= ' </tr>';
                        }
                        //calculando el subtotal por importe o valor
                        $subtotal = $subtotal + $indicador['importetotal'];
                    }
                }
                break;
            case 7:
                $cuerporeporteindicadores = $cuerporeporteindicadores
                        . self::obtenerEntidadesHijosPlanesIndicadoresDelReporteAjuste(
                                $parametros
                );
                break;
            case 8:
                $cuerporeporteindicadores = $cuerporeporteindicadores
                        . self::obtenerEntidadesHijosIndicadoresDelReporteDiferenciaPrecio(
                                $parametros
                );
                break;
        }


        $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';

        $cuerporeporteindicadores .= ' </tr>';

        $arraydatos['subtotal'] = $subtotal;
        $arraydatos['cuerporeporte'] = $cuerporeporteindicadores;
        return $arraydatos;
    }

    public function obtenerEntidadesHijosPlanesIndicadoresDelReporteAjuste($parametros
    ) {
        //idvia es donde viene el id entidad
        $totalVias = 0;
        if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != ''
        ) {
            foreach ($parametros->arrayviasadquisicion as $viaadquisicion) {
                $arrayidviasUnidimensional[] = $viaadquisicion->idvia;
                $totalVias++;
            }
        }
        if ($totalVias != 0) {
            $parametros->arrayidvias = $arrayidviasUnidimensional;
            $parametros->totalVias = $totalVias;
        }

        if ($parametros->idorgansodem[0]->idvia != null) {
            foreach ($parametros->idorgansodem as $key => $k) {
                $parametros->k = $k;
                $parametros->hijosentidad = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->k->idvia);
                // array_push($parametros->hijosentidad, $parametros->k->idvia);
                if ($parametros->idmodelos[0]->idplan != null) {
                    foreach ($parametros->idmodelos as $p => $k) {
                        $model[$p]['idmodelo'] = $k->idplan;
                        $model[$p]['denominacion'] = $k->denominacion;
                    }
                } else {
                    $model = DatPlanificacion::obtPlanesRepAjuste($parametros);
                }
                if ($key == 0) {
                    $parametros->iteracion = 1;
                }
                if ($parametros->hijosentidad[0] != null && $model[0] != null) {
                    $parametros->datos = array();
                    foreach ($model as $pos => $value) {
                        $parametros->idplan = $value['idmodelo'];
                        $parametros->denominacionplan = $value['denominacion'];
                        // Ahora viene el metodo q devuelve los datos a pintar...
                        $parametros->datos[$pos] = DatPlanificacion::obtImportesIniFinAjuste(
                                        $parametros
                        );
                        $parametros->datos[$pos]['denomplan'] = $value['denominacion'];
                    }
                    //aqui va el metodo de pintar
                    $cuerporeporteindicadores .= self::pintarDatosAjustePlan(
                                    $parametros
                    );
                }
            }
        } elseif ($parametros->esrector == 'true') {

            $rectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();



            if (isset($rectora[0])) {
                $excluir = array(7, 8, 9, 10);
                $arrayorganosdemandantes = $parametros->integ->metadatos->DameHijosEstructura(
                        $rectora[0]['identidad'], $excluir
                );
            }
            $can = count($arrayorganosdemandantes);
            $arrayorganosdemandantes[$can]->id = $rectora[0]['identidad'];
            $enti = $this->integrator->metadatos->DameEstructura($rectora[0]['identidad']);
            $arrayorganosdemandantes[$can]->denominacion = $enti[0]->denominacion;

            foreach ($arrayorganosdemandantes as $key => $k) {
                $parametros->k = $k;
                $parametros->k->idvia = $parametros->k->id;
                if ($parametros->k->id != $rectora[0]['identidad']) {
                    $parametros->hijosentidad = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                    $parametros->k->idvia
                    );
                } else {
                    $parametros->hijosentidad = array();
                    $parametros->hijosentidad[0] = $parametros->k->idvia;
                }
                if ($parametros->idmodelos[0]->idplan != null) {
                    foreach ($parametros->idmodelos as $p => $k) {
                        $model[$p]['idmodelo'] = $k->idplan;
                        $model[$p]['denominacion'] = $k->denominacion;
                    }
                } else {
                    $model = DatPlanificacion::obtPlanesRepAjuste($parametros);
                }

                if ($key == 0) {
                    $parametros->iteracion = 1;
                }
                if ($parametros->hijosentidad[0] != null && $model[0] != null) {
                    $parametros->datos = array();
                    foreach ($model as $pos => $value) {
                        $parametros->idplan = $value['idmodelo'];
                        $parametros->denominacionplan = $value['denominacion'];
                        // Ahora viene el metodo q devuelve los datos a pintar...
                        $parametros->datos[$pos] = DatPlanificacion::obtImportesIniFinAjuste(
                                        $parametros
                        );
                        $parametros->datos[$pos]['denomplan'] = $value['denominacion'];
                    }
                    $cuerporeporteindicadores .= self::pintarDatosAjustePlan(
                                    $parametros
                    );
                }
            }
        } else {
            $parametros->k->idvia = $parametros->identidadlog;
            $parametros->k->denominacion = $parametros->denominacionlog;
            $parametros->hijosentidad = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $parametros->k->idvia
            );
            array_push($parametros->hijosentidad, $parametros->k->idvia);
            if ($parametros->idmodelos[0]->idplan != null) {
                foreach ($parametros->idmodelos as $p => $k) {
                    $model[$p]['idmodelo'] = $k->idplan;
                    $model[$p]['denominacion'] = $k->denominacion;
                }
            } else {
                $model = DatPlanificacion::obtPlanesRepAjuste($parametros);
            }
            $parametros->iteracion = 1;
            if ($parametros->hijosentidad[0] != null && $model[0] != null) {
                $parametros->datos = array();
                foreach ($model as $pos => $value) {
                    $parametros->idplan = $value['idmodelo'];
                    $parametros->denominacionplan = $value['denominacion'];
                    // Ahora viene el metodo q devuelve los datos a pintar...
                    $parametros->datos[$pos] = DatPlanificacion::obtImportesIniFinAjuste(
                                    $parametros
                    );
                    $parametros->datos[$pos]['denomplan'] = $value['denominacion'];
                }

                $cuerporeporteindicadores .= self::pintarDatosAjustePlan(
                                $parametros
                );
            }
        }
        return $cuerporeporteindicadores;
    }

    public function obtenerEntidadesHijosIndicadoresDelReporteDiferenciaPrecio($parametros) {

        if ($parametros->arrayoace[0]->idoace != null && $parametros->arrayoace[0]->idoace != ''
        ) {
            foreach ($parametros->arrayoace as $oace) {
                $idoace = $oace->idoace;
                $arrayidoaceUnidimensional[] = $idoace;
            }
            $parametros->arrayidoace = $arrayidoaceUnidimensional;
            $parametros->arrayidoace = implode(
                    ',', $arrayidoaceUnidimensional
            );
        }

        //idvia es donde viene el id entidad
        if ($parametros->idorgansodem[0]->idvia != null) {
            $parametros->count = 0;
            foreach ($parametros->idorgansodem as $key => $k) {
                $parametros->count += 1;
                $parametros->k = $k;
                $parametros->hijosentidad = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $parametros->k->idvia/* , $parametros->integ */
                );
                array_push($parametros->hijosentidad, $parametros->k->idvia);

                if ($parametros->idcentrosb[0]->idcentrobalance != null) {

                    foreach ($parametros->idcentrosb as $p => $s) {
                        $idcentrosb[$p] = $s->idcentrobalance;
                    }

                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                                    $idcentrosb
                    );

                    foreach ($entidaddatosnom as $p => $s) {
                        $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                        $identidades[$p] = $s['identidad'];
                    }

                    $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los
                    // idcentrobalance para comparar con p.idcentrobalance
                } else {
                    if ($parametros->esrector != 'true') {
                        $idcentrosb[] = $parametros->identidadlog;
                    } else {
                        $arrcb = DatEntidaddatosnomenclador::getCB();
                        foreach ($arrcb as $p => $s) {
                            $idcentrosb[$p] = $s['identidad'];
                        }
                    }
                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                                    $idcentrosb
                    );
                    foreach ($entidaddatosnom as $p => $s) {
                        $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                        $identidades[$p] = $s['identidad'];
                    }
                    $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los idcentrobalance
                    // para comparar con p.idcentrobalance
                }
                if ($key == 0) {
                    $parametros->iteracion = 1;
                } else {
                    $parametros->iteracion = 0;
                }
                if ($parametros->hijosentidad[0] != null && $parametros->idcentrosb[0] != null
                ) {

                    // se buscan los planes
                    if ($parametros->idmodelos[0]->idplan != null) {
                        foreach ($parametros->idmodelos as $p => $k) {
                            $parametros->arrayidplan[$p] = $k->idplan;
                        }
                    }

                    $parametros->datosActual = DatPlanificacion::obtIndicadoresDiferenciaPrecio(
                                    $parametros, $parametros->idejercicio
                    );
                    $parametros->datosAnterior = DatPlanificacion::obtIndicadoresDiferenciaPrecio(
                                    $parametros, $parametros->idejercicioante
                    );

                    //aqui va el metodo de pintar
                    $cuerporeporteindicadores .= self::pintarDatosDiferenciaPrecio(
                                    $parametros
                    );
                }
            }
        } else {
            if ($parametros->esrector == 'true') {

                $rectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();

                if (isset($rectora[0])) {
                    $excluir = array(7, 8, 9, 10);
                    $arrayorganosdemandantes = $this->integrator->metadatos->DameHijosEstructura(
                            $rectora[0]['identidad'], $excluir
                    );
                }
                $can = count($arrayorganosdemandantes);
                $arrayorganosdemandantes[$can]->id = $rectora[0]['identidad'];
                $enti = $this->integrator->metadatos->DameEstructura($rectora[0]['identidad']);
                $arrayorganosdemandantes[$can]->text = $enti[0]->denominacion;
                $parametros->count = 0;
                foreach ($arrayorganosdemandantes as $key => $k) {
                    $parametros->count += 1;
                    $parametros->k = $k;
                    $parametros->k->idvia = $parametros->k->id;
                    if ($parametros->k->id != $rectora[0]['identidad']) {
                        $parametros->hijosentidad = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                        $parametros->k->idvia
                        );
                    } else {
                        $parametros->hijosentidad = array();
                        $parametros->hijosentidad[0] = $parametros->k->idvia;
                    }

                    if ($parametros->idcentrosb[0]->idcentrobalance != null) {

                        foreach ($parametros->idcentrosb as $p => $s) {
                            $idcentrosb[$p] = $s->idcentrobalance;
                        }

                        $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                                        $idcentrosb
                        );

                        foreach ($entidaddatosnom as $p => $s) {
                            $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                            $identidades[$p] = $s['identidad'];
                        }

                        $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los
                        // idcentrobalance para comparar con p.idcentrobalance
                    } else {
                        if ($parametros->esrector != 'true') {
                            $idcentrosb[] = $parametros->identidadlog;
                        } else {
                            $arrcb = DatEntidaddatosnomenclador::getCB();
                            foreach ($arrcb as $p => $s) {
                                $idcentrosb[$p] = $s['identidad'];
                            }
                        }
                        $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                                        $idcentrosb
                        );
                        foreach ($entidaddatosnom as $p => $s) {
                            $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                            $identidades[$p] = $s['identidad'];
                        }
                        $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los
                        // idcentrobalance para comparar con p.idcentrobalance
                    }
                    if ($key == 0) {
                        $parametros->iteracion = 1;
                    } else {
                        $parametros->iteracion = 0;
                    }
                    if ($parametros->hijosentidad[0] != null && $parametros->idcentrosb[0] != null
                    ) {
                        // Ahora viene el metodo q devuelve los datos a pintar...
                        $parametros->datosActual = DatPlanificacion::obtIndicadoresDiferenciaPrecio(
                                        $parametros, $parametros->idejercicio
                        );
                        $parametros->datosAnterior = DatPlanificacion::obtIndicadoresDiferenciaPrecio(
                                        $parametros, $parametros->idejercicioante
                        );

                        //aqui va el metodo de pintar
                        $cuerporeporteindicadores .= self::pintarDatosDiferenciaPrecio(
                                        $parametros
                        );
                    }
                }
            } else {
                $parametros->k->idvia = $parametros->identidadlog;
                $parametros->k->denominacion = $parametros->denominacionlog;
                $parametros->hijosentidad = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $parametros->k->idvia
                );
                array_push($parametros->hijosentidad, $parametros->k->idvia);

                if ($parametros->idcentrosb[0]->idcentrobalance != null) {

                    foreach ($parametros->idcentrosb as $p => $s) {
                        $idcentrosb[$p] = $s->idcentrobalance;
                    }

                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                                    $idcentrosb
                    );

                    foreach ($entidaddatosnom as $p => $s) {
                        $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                        $identidades[$p] = $s['identidad'];
                    }

                    $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los
                    // idcentrobalance para comparar con p.idcentrobalance
                } else {
                    if ($parametros->esrector != 'true') {
                        $idcentrosb[] = $parametros->identidadlog;
                    } else {
                        $arrcb = DatEntidaddatosnomenclador::getCB();
                        foreach ($arrcb as $p => $s) {
                            $idcentrosb[$p] = $s['identidad'];
                        }
                    }
                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                                    $idcentrosb
                    );
                    foreach ($entidaddatosnom as $p => $s) {
                        $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                        $identidades[$p] = $s['identidad'];
                    }
                    $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los
                    // idcentrobalance para comparar con p.idcentrobalance
                }

                $parametros->iteracion = 1;

                if ($parametros->hijosentidad[0] != null && $parametros->idcentrosb[0] != null
                ) {
                    // Ahora viene el metodo q devuelve los datos a pintar...
                    $parametros->datosActual = DatPlanificacion::obtIndicadoresDiferenciaPrecio(
                                    $parametros, $parametros->idejercicio
                    );
                    $parametros->datosAnterior = DatPlanificacion::obtIndicadoresDiferenciaPrecio(
                                    $parametros, $parametros->idejercicioante
                    );

                    //aqui va el metodo de pintar

                    $cuerporeporteindicadores .= self::pintarDatosDiferenciaPrecio(
                                    $parametros
                    );
                }
            }
        }


        return $cuerporeporteindicadores;
    }

    public function obtenerEntidadesHijosPlanesIndicadoresDelReporteBm($parametros
    ) {
        //obteniendo la cadena de identidades de los od a filtrar
        //dependiendo de la seleccion o de la entidad logueada
        $espcompcb = 0;
        //idvia es donde biene el id entidad disculpen el nombre
        $parametros->importetotalindicadores = 0;
        if ($parametros->idorgansodem[0]->idvia != null) {//aqui rector
            foreach ($parametros->idorgansodem as $key => $k) {
                $parametros->k = $k;
                $cuerporeporteindicadores = $cuerporeporteindicadores
                        . self::obtenerHijosPlanesIndicadores($parametros);
            }

            if ($parametros->comportamiento == 2) {
                $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                $cuerporeporteindicadores
                        .= ' 	<td colspan="' . $parametros->anchocolspan
                        . '" >IMPORTE TOTAL: ' . number_format(
                                $parametros->importetotalindicadores, '3', '.', ','
                        ) . '</td>';
            }
        } else {
            if ($parametros->esrector == 'true') {
                $parametros->importetotalindicadores = 0;
                $arrayorganosdemandantes = DatEntidaddatosnomenclador::obtenerEntidadRectora();
                if (isset($arrayorganosdemandantes[0])) {
                    $excluir = array(7, 8, 9, 10);
                    $arrayorganosdemandantes = $parametros->integ->metadatos->DameHijosEstructura(
                            $arrayorganosdemandantes[0]['identidad'], $excluir
                    );
                }

                foreach ($arrayorganosdemandantes as $key => $k) {
                    $parametros->k = $k;
                    $parametros->k->idvia = $parametros->k->id;
                    $cuerporeporteindicadores = $cuerporeporteindicadores
                            . self::obtenerHijosPlanesIndicadores($parametros);
                }

                if ($parametros->comportamiento == 2) {
                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                    $cuerporeporteindicadores
                            .= ' 	<td colspan="' . $parametros->anchocolspan
                            . '" >IMPORTE TOTAL: ' . number_format(
                                    $parametros->importetotalindicadores, '3', '.', ','
                            ) . '</td>';
                }
            } else {
                $espcompcb = 2;
                if ($parametros->comportamiento == 2) {
                    $parametros->importetotalindicadores = 0;

                    $parametros->k->idvia = $parametros->identidadlog;
                    $parametros->k->denominacion = $parametros->denominacionlog;

                    $cuerporeporteindicadores = $cuerporeporteindicadores
                            . self::obtenerHijosPlanesIndicadores($parametros);
                    if ($parametros->comportamiento == 2) {
                        $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                        $cuerporeporteindicadores
                                .= ' 	<td colspan="' . $parametros->anchocolspan
                                . '" >IMPORTE TOTAL: ' . number_format(
                                        $parametros->importetotalindicadores, '3', '.', ','
                                ) . '</td>';
                    }
                } else {
                    foreach ($parametros->entidaddatosnom as $key => $k) {
                        $entidaddatosn[] = $parametros->entidaddatosnom[$key]['identidaddatosnomenclador'];
                    }

                    $ident = DatPlanificacion::obtenerEntidadesQueDemandanByIdCentrosB(
                                    $entidaddatosn
                    );

                    //$datos = array();
                    if (isset($ident[0])) {
                        $arrayEntidades = array();
                        foreach ($ident as $key => $k) {
                            $arrayEntidades[] = $k['identidad'];
                        }
                        $entidadescad = implode(',', $arrayEntidades);
                        $dat = DatAjusteexistenciaod::listarEntidades(
                                        $entidadescad
                        );
                    }
                    foreach ($dat as $key => $k) {
                        $parametros->k->idvia = $k['id'];
                        $parametros->k->denominacion = $k['text'];
                        $cuerporeporteindicadores = $cuerporeporteindicadores
                                . self::obtenerHijosPlanesIndicadores($parametros);
                    }
                }
            }
        }
        return $cuerporeporteindicadores;
    }

    public function obtenerHijosPlanesIndicadores($parametros) {
        $parametros->hijosentidad = DatActividadentidad::auxObtenerEntidadesHijasComun(
                        $parametros->k->idvia/* , $parametros->integ */
        );
        array_push($parametros->hijosentidad, $parametros->k->idvia);

        $parametros->identidpadres[] = $parametros->k->idvia;


        if ($parametros->idmodelos[0]->idplan != null) {
            foreach ($parametros->idmodelos as $key => $k) {
                $model[$key]['idmodelo'] = $k->idplan;
                $model[$key]['denominacion'] = $k->denominacion;
            }
        } else {
            $model = DatPlanificacion::obtPlanesRepBal($parametros);
        }

        $iddatonomenclador = DatEntidaddatosnomenclador::getIdentidaddatosnomenclador(
                        $parametros->k->idvia
        );

        $parametros->identidaddatosnom = $iddatonomenclador[0]['identidaddatosnomenclador'];
        $parametros->importetotalentidad = 0;
        if ($parametros->hijosentidad[0] != null && $model[0] != null) {
            $parametros->hijosentidad = implode(',', $parametros->hijosentidad);
            $controlar = 0;
            foreach ($model as $key => $value) {
                $parametros->idplan = $value['idmodelo'];
                $parametros->denominacionplan = $value['denominacion'];

                $totalind = DatAjusteexistenciaod::contarIndicadoresTotalReporteOD(
                                $parametros
                );

                $cantRegistro = 13000;
                if ($totalind <= 13000) {
                    $cantPaginas = 1;
                } else {
                    $cantPaginas = (int) ($totalind / $cantRegistro);
                    if (fmod($totalind, $cantRegistro) > 0) {
                        $cantPaginas++;
                    }
                }
                $start = 0;
                $parametros->limit = $cantRegistro;

                $parametros->importeplanentidad = 0;
                for ($i = 1; $i <= $cantPaginas; $i++) {
                    $parametros->iteracion = $i;
                    if ($i == $cantPaginas) {
                        $parametros->iteracionF = 5;
                    }
                    $parametros->start = $start;
                    $parametros->indicad = DatAjusteexistenciaod::obtenerDatosDelReporteOD(
                                    $parametros
                    );

                    $start += $cantRegistro;

                    if ($parametros->indicad[0] != null) {

                        $controlar = 2;
                        $cuerporeporteindicadores .= self::pintarDatosReporteBalance(
                                        $parametros
                        );
                        $parametros->indicad = null;
                    }
                }
            }
            if ($controlar == 2) {
                if ($parametros->comportamiento == 2) {
                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                    $cuerporeporteindicadores
                            .= ' 	<td colspan="' . $parametros->anchocolspan
                            . '" >IMPORTE ENTIDAD: ' . number_format(
                                    $parametros->importetotalentidad, '3', '.', ','
                            ) . '</td>';
                } else {
                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                    $cuerporeporteindicadores
                            .= ' 	<td colspan="' . $parametros->anchocolspan
                            . '" >IMPORTE DE LA ENTIDAD PARA EL CENTRO DE BALANCE: '
                            . number_format(
                                    $parametros->importetotalentidad, '3', '.', ','
                            ) . '</td>';
                    $parametros->importetotaldelcb = $parametros->importetotaldelcb + $parametros->importetotalentidad;
                }
            }
        }
        $parametros->importetotalindicadores = $parametros->importetotalindicadores + $parametros->importetotalentidad;

        return $cuerporeporteindicadores;
    }

    public function pintarDatosReporteBalance($parametros) {
        $cuerporeporteindicadores = '';
        $CB = '';

        if ($parametros->iteracion == 1) {

            $cuerporeporteindicadores
                    .= '<table border="1" bordercolor="black"   align="center"
                cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;"><thead>
                   <td colspan="'
                    . $parametros->anchocolspan . '" > ' . $CB
                    . '&nbsp&nbsp&nbsp ENTIDAD:&nbsp '
                    . $parametros->k->denominacion .
                    '&nbsp;&nbsp;&nbsp PLAN:&nbsp;&nbsp;&nbsp '
                    . $parametros->denominacionplan . '</td>
									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td  >C&oacute;digo</td>
										<td  >No.Pieza</td>
										<td  >Denominaci&oacute;n</td>
										<td  >Centro de Balance</td>
										<td   ">Necesidad</td>
										<td   >CTE</td>
										<td   >Demanda</td>
                                        <td   >Precio</td>
                                        <td   >Importe</td>
										<td   >Importe mlc</td>
										<td   >Importe flete</td>
										<td   >Importe contingencia</td>
                                        <td   >Importe fila</td>
										<td   >V&iacute;a de Adquisici&oacuten</td>
										<td   >&Oacute;rgano que Satisface</td>
										<td   >Aprobado</td>
									</tr>
								  </thead>';
        }

        if (isset($parametros->indicad[0]['idindicador'])) {
            foreach ($parametros->indicad as $indicador) {

                if ($parametros->mostrarindicadores == 'true') {
                    $parametros->importeplanentidad = $parametros->importeplanentidad + $indicador['importe'];

                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;">';
                    $cuerporeporteindicadores
                            .= ' 	<td >'
                            . $indicador['codigo'] . '</td>';
                    if ($indicador['numeropieza']) {
                        $cuerporeporteindicadores
                                .= ' 	<td  >'
                                . $indicador['numeropieza'] . '</td>';
                    } else {
                        $cuerporeporteindicadores
                                .= ' 	<td style="text-align:CENTER" >' . "-" . '</td>';
                    }

                    $cuerporeporteindicadores
                            .= ' 	<td  >'
                            . $indicador['denominacion'] . '</td>';
                    $cuerporeporteindicadores
                            .= ' 	<td >'
                            . $indicador['denominacioncb'] . '</td>';
                    $cuerporeporteindicadores .= ' 	<td  >' . number_format(
                                    $indicador['necesidad'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td  >' . number_format(
                                    $indicador['coberturatotalestimada'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td  >' . number_format(
                                    $indicador['demanda'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td  >' . number_format(
                                    $indicador['precio'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td  >' . number_format(
                                    $indicador['importe'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td  >' . number_format(
                                    $indicador['importemlc'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td >' . number_format(
                                    $indicador['flete'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td  >' . number_format(
                                    $indicador['contingencia'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td  >' . number_format(
                                    $indicador['importefila'], '3', '.', ','
                            ) . '</td>';
                    if ($indicador['viaadquisicion'] != "") {
                        $cuerporeporteindicadores .= ' 	<td >' . $indicador['viaadquisicion'] . '</td>';
                    } else {
                        $cuerporeporteindicadores .= ' 	<td style="text-align: center">-</td>';
                    }


                    if ($indicador['organosatisface']) {
                        $cuerporeporteindicadores
                                .= ' 	<td >'
                                . $indicador['organosatisface'] . '</td>';
                    } else {
                        $cuerporeporteindicadores
                                .= ' 	<td style="text-align:CENTER" >' . "-" . '</td>';
                    }

                    if ($indicador['idaprobacion'] == 1) {
                        $cuerporeporteindicadores
                                .= ' 	<td style="text-align:CENTER",  >' . NO . '</td>';
                    } else {
                        $cuerporeporteindicadores
                                .= ' 	<td style="text-align:CENTER",  >' . SI . '</td>';
                    }
                    $cuerporeporteindicadores .= ' </tr>';
                }
            }
            //calculando el subtotal por importe o valor
            //$subtotal = $arrayindicadores['total'];

            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
            if ($parametros->iteracionF == 5) {
                $cuerporeporteindicadores
                        .= ' 	<td colspan="' . $parametros->anchocolspan
                        . '" >IMPORTE PLAN: ' . number_format(
                                $parametros->importeplanentidad, '3', '.', ','
                        ) . '</td>';
                $cuerporeporteindicadores .= ' </tr>';

                $parametros->importetotalentidad = $parametros->importetotalentidad + $parametros->importeplanentidad;
            }
        }
        return $cuerporeporteindicadores;
    }

    public function pintarDatosAjustePlan($parametros) {

        $importeincialTotal = 0;
        $ajusteTotal = 0;
        $importefinalTotal = 0;
        $cuerporeporteindicadores = '';
        $parametros->anchocolspan = 10;


        if (isset($parametros->datos[0])) {

            if ($parametros->iteracion == 1) {
                //creando la tabla con las columnas fijas
                $cuerporeporteindicadores
                        .= '<table border="1" bordercolor="black"  width="50%"  cellpadding="0"
                        cellspacing="0" style="margin-top:1cm;"><thead> <td colspan="'
                        . $parametros->anchocolspan . '" ><strong> '
                        . '&nbsp&nbsp&nbsp ENTIDAD:&nbsp '
                        . $parametros->k->denominacion . '<strong></td>

									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td  width="' . 40 / 16 . '%">
										<strong>Planes<strong></td>
										<td  width="' . 40 / 15 . '%">
										<strong>Importe Inicial<strong></td>
										<td  width="' . 40 / 9 . '%">
										<strong>Importe Ajustado<strong></td>
										<td  width="' . 100 / 11 . '%">
										<strong>Importe Final<strong></td>
									</tr>
								  </thead>';
            }


            foreach ($parametros->datos as $plan) {

                $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;">';

                $cuerporeporteindicadores
                        .= ' 	<td width="' . (40 / 11) . '%" >'
                        . $plan['denomplan'] . '</td>';

                $cuerporeporteindicadores .= ' 	<td width="' . (40 / 17)
                        . '%" >' . number_format(
                                $plan[0]['importeincial'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores .= ' 	<td width="' . (40 / 18)
                        . '%" >' . number_format(
                                $plan[0]['ajuste'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores .= ' 	<td width="' . (40 / 17)
                        . '%" >' . number_format(
                                $plan[0]['importefinal'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores .= ' </tr>';

                $importeincialTotal += $plan[0]['importeincial'];
                $ajusteTotal += $plan[0]['ajuste'];
                $importefinalTotal += $plan[0]['importefinal'];
            }
            //calculando el subtotal por importe o valor
            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';

            $cuerporeporteindicadores
                    .= ' 	<td style="text-align:CENTER;" width="' . (40 / 11)
                    . '%" ><strong>TOTAL:<strong></td>';

            $cuerporeporteindicadores .= ' 	<td width="' . (40 / 17) . '%" >'
                    . number_format(
                            $importeincialTotal, '3', '.', ','
                    ) . '</td>';

            $cuerporeporteindicadores .= ' 	<td width="' . (40 / 18) . '%" >'
                    . number_format(
                            $ajusteTotal, '3', '.', ','
                    ) . '</td>';

            $cuerporeporteindicadores .= ' 	<td width="' . (40 / 17) . '%" >'
                    . number_format(
                            $importefinalTotal, '3', '.', ','
                    ) . '</td>';

            $cuerporeporteindicadores .= ' </tr>';
            return $cuerporeporteindicadores;
        }
    }

    public function pintarDatosDiferenciaPrecio($parametros) {

        //$difercantidad = 0;
        //$diferprecio = 0;
        $cuerporeporteindicadores = '';

        if ($parametros->iteracion == 1) {
            //creando la tabla con las columnas fijas
            $cuerporeporteindicadores
                    .= '              <table border="1" bordercolor="black" width="100%"
              cellspacing="0" cellpadding="0" style="margin-top:1cm;">
                                          <col width="74" />
                                          <col width="194" />
                                          <col width="55" />
                                          <col width="80" span="6" />
                                          <col width="133" />
                                          <col width="124" />
                                          <tr height="20">
                                             <td style="text-align:CENTER;" rowspan="3" height="91" width="74">
                                             <strong>CODIGO<strong></td>
                                             <td style="text-align:CENTER;" rowspan="3" width="194">
                                             <strong>DESCRIPCION<strong></td>
                                             <td style="text-align:CENTER;" rowspan="3" width="55">
                                             <strong>UM<strong></td>
                                             <td style="text-align:CENTER;" colspan="3" rowspan="2" width="240">
                                             <strong>A&Ntilde;O '
                    . $parametros->ejercicioAnterior . '<strong></td>
                                             <td style="text-align:CENTER;" colspan="3" rowspan="2" width="240">
                                             <strong>A&Ntilde;O '
                    . $parametros->ejercicioActual . '<strong></td>
                            <td style="text-align:CENTER;background-color:#FFFF00;" colspan="2" rowspan="2" width="257">
                                             <strong>DIFERENCIA<strong></td>
                                             </tr>
                                             <tr height="20"> </tr>
                                             <tr height="51">
                                             <td style="text-align:CENTER;" height="51" width="80">
                                             <strong>PRECIO<strong></td>
                                             <td style="text-align:CENTER;" width="80">
                                             <strong>CANTIDAD<strong></td>
                                             <td style="text-align:CENTER;" width="80">
                                             <strong>IMPORTE<strong></td>
                                             <td style="text-align:CENTER;" width="80">
                                             <strong>PRECIO<strong></td>
                                             <td style="text-align:CENTER;" width="80">
                                             <strong>CANTIDAD<strong></td>
                                             <td style="text-align:CENTER;" width="80">
                                             <strong>IMPORTE<strong></td>
                                             <td style="text-align:CENTER;background-color:#FFFF00;" width="133">
                                             <strong>Diferencia por    cantidad<strong></td>
                                             <td style="text-align:CENTER;background-color:#FFFF00;" width="124">
                                             <strong>Diferencia por precio&nbsp;<strong></td>
                                                                                       </tr>';
        }
        //$difcantidad = 0;
        if ($parametros->datosAnterior[0]['codigo'] != null) {
            foreach ($parametros->datosActual as $pos => $datoactual) {

                foreach ($parametros->datosAnterior as $p => $datoant) {
                    if ($datoactual['codigo'] == $datoant['codigo']) {
                        $parametros->datosActual[$pos]['precioanterior'] = $datoant['precio'];
                        $parametros->datosActual[$pos]['cantidadanterior'] = $datoant['cantidad'];
                        $parametros->datosActual[$pos]['importeanterior'] = $datoant['importe'];

                        // Obteniendo el valor de la diferencia de cantidad
                        if ($datoant['cantidad'] == 0) {
                            $parametros->datosActual[$pos]['difercantidad'] = $parametros->datosActual[$pos]['importe'];
                        } else {
                            if ($parametros->datosActual[$pos]['cantidad'] > $datoant['cantidad']
                            ) {
                                //(Cantidad del ejercicio actual – Cantidad del
                                // ejercicio anterior) * Precio del ejercicio anterior /1000.
                                $parametros->datosActual[$pos]['difercantidad'] = ((($parametros->datosActual[$pos]['cantidad'] - $datoant['cantidad']) * $datoant['precio']) / 1000);
                            } else {
                                if ($parametros->datosActual[$pos]['cantidad'] < $datoant['cantidad']
                                ) {
                                    //(Cantidad del ejercicio actual – Cantidad del
                                    // ejercicio anterior) * Precio del ejercicio anterior /1000.
                                    $parametros->datosActual[$pos]['difercantidad'] = ((($parametros->datosActual[$pos]['cantidad'] - $datoant['cantidad']) * $datoant['precio']) / 1000);
                                } else {
                                    $parametros->datosActual[$pos]['difercantidad'] = 0;
                                }
                            }
                        }

                        // Obteniendo el valor de la diferencia de precio
                        if ($datoant['cantidad'] == 0) {
                            $parametros->datosActual[$pos]['diferprecio'] = 0;
                        } else {
                            //Cantidad (ejercicio actual) * (Precio (ejercicio actual)
                            // – Precio (ejercicio anterior)/1000).
                            $parametros->datosActual[$pos]['diferprecio'] = ((($parametros->datosActual[$pos]['precio'] - $datoant['precio']) * $parametros->datosActual[$pos]['cantidad']) / 1000);
                        }

                        break;
                    } else {
                        if ((count($parametros->datosAnterior) - 1) == $p) {
                            $parametros->datosActual[$pos]['precioanterior'] = $parametros->datosActual[$pos]['precio'];
                            $parametros->datosActual[$pos]['cantidadanterior'] = 0;
                            $parametros->datosActual[$pos]['importeanterior'] = 0;
                            $parametros->datosActual[$pos]['diferprecio'] = 0;
                            $parametros->datosActual[$pos]['difercantidad'] = $parametros->datosActual[$pos]['importe'];
                        }
                    }
                }
            }
        } else {
            foreach ($parametros->datosActual as $pos => $datoactual) {
                $parametros->datosActual[$pos]['precioanterior'] = $parametros->datosActual[$pos]['precio'];
                $parametros->datosActual[$pos]['cantidadanterior'] = 0;
                $parametros->datosActual[$pos]['importeanterior'] = 0;
                $parametros->datosActual[$pos]['diferprecio'] = 0;
                $parametros->datosActual[$pos]['difercantidad'] = $parametros->datosActual[$pos]['importe'];
            }
        }


        if (isset($parametros->datosActual[0])) {

            foreach ($parametros->datosActual as $indicador) {

                $cuerporeporteindicadores .= '<tr height="20">';

                $cuerporeporteindicadores
                        .= ' <td height="20" width="74">' . $indicador['codigo']
                        . '</td>';

                $cuerporeporteindicadores
                        .= ' <td width="194">' . $indicador['denominacion']
                        . '</td>';

                $cuerporeporteindicadores
                        .= ' <td width="55">' . $indicador['unimed'] . '</td>';

                $cuerporeporteindicadores
                        .= ' <td width="80">' . number_format(
                                $indicador['precioanterior'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores
                        .= ' <td width="80">' . number_format(
                                $indicador['cantidadanterior'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores
                        .= ' <td width="80">' . number_format(
                                $indicador['importeanterior'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores
                        .= ' <td width="80">' . number_format(
                                $indicador['precio'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores
                        .= ' <td width="80">' . number_format(
                                $indicador['cantidad'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores
                        .= ' <td width="80">' . number_format(
                                $indicador['importe'], '3', '.', ','
                        ) . '</td>';

                $parametros->totalDifCantidad += $indicador['difercantidad'];
                $cuerporeporteindicadores
                        .= ' <td style="background-color:#FFFF00;" width="133">'
                        . number_format(
                                $indicador['difercantidad'], '3', '.', ','
                        ) . '</td>';

                $parametros->totalDifPrecio += $indicador['diferprecio'];
                $cuerporeporteindicadores
                        .= ' <td style="background-color:#FFFF00;" width="124">'
                        . number_format(
                                $indicador['diferprecio'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores .= ' </tr>';
            }

            if (count($parametros->idorgansodem) == $parametros->count) {
                $cuerporeporteindicadores .= '<tr height="20">';

                $cuerporeporteindicadores
                        .= ' <td style="text-align:CENTER;background-color:#FFFF00;"
                            "height="20" width="74"><strong>TOTAL<strong></td>
						<td style="background-color:#FFFF00;" width="194"> </td>
						<td style="background-color:#FFFF00;" width="55"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>';
                $cuerporeporteindicadores
                        .= ' <td style="background-color:#FFFF00;" width="133">'
                        . number_format(
                                $parametros->totalDifCantidad, '3', '.', ','
                        ) . '</td>';
                $cuerporeporteindicadores
                        .= ' <td style="background-color:#FFFF00;" width="124">'
                        . number_format(
                                $parametros->totalDifPrecio, '3', '.', ','
                        ) . '</td> </tr>';
            }
        }
        return $cuerporeporteindicadores;
    }

    public function cargarOrganosDemandantes() {
        $arraycompentidadOC = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        'rectorbalance'
        );
        $arrayorganosdemandantes = array();
        if (isset($arraycompentidadOC[0])) {
            $integrator = ZendExt_IoC::getInstance();
            $rectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            if (isset($rectora[0])) {
                $excluir = array(7, 8, 9, 10);
                $arrayorganosdemandantes = $integrator->metadatos->DameHijosEstructura(
                        $rectora[0]['identidad'], $excluir
                );
                $array = Array();
                foreach ($arrayorganosdemandantes as $key => $organodemandante) {
                    $array[$key]['id'] = $organodemandante->id;
                    $array[$key]['text'] = $organodemandante->text;
                    $array[$key]['checked'] = false;
                    $array[$key]['leaf'] = true;
                }
            }
        }
        return $array;
    }

    /*
     * metodo que recupera los Organos demandantes que se necesitan en la
     * recuperacion de los datos del Balance Material
     */

    public function cargarODRecuperacionCB($parametros) {

        $arraycompentidadOC = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        'rectorbalance'
        );
        $arrayorganosdemandantes = array();
        if (isset($arraycompentidadOC[0])) {
            //$idcomportamiento = $arraycompentidadOC[0]['iddatosnomenclador'];
            $integrator = ZendExt_IoC::getInstance();
            $rectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            if (isset($rectora[0])) {
                $excluir = array(7, 8, 9, 10);
                $arrayorganosdemandantes = $integrator->metadatos->DameHijosEstructura(
                        $rectora[0]['identidad'], $excluir
                );
            }
            $can = count($arrayorganosdemandantes);
            $arrayorganosdemandantes[$can]->id = $rectora[0]['identidad'];
            $enti = $integrator->metadatos->DameEstructura($rectora[0]['identidad']);
            $arrayorganosdemandantes[$can]->text = $enti[0]->denominacion;
        }
        $array = Array();
        if ($parametros['orgrecto'] == 'true') {
            if ($arrayorganosdemandantes[0] != null) {
                foreach ($arrayorganosdemandantes as $key => $organodemandante) {
                    $array[$key]['id'] = $organodemandante->id;
                    $array[$key]['text'] = $organodemandante->text;
                    $array[$key]['checked'] = false;
                }
            }
        } else {
            if ($arrayorganosdemandantes[0] != null) {
                $c = 0;
                foreach ($arrayorganosdemandantes as $key => $organodemandante) {
                    if ($parametros['identidadlog'] == $organodemandante->id) {
                        $array[$c]['id'] = $organodemandante->id;
                        $array[$c]['text'] = $organodemandante->text;
                        $array[$c++]['checked'] = false;
                    }
                }
            }
        }
        return $array;
    }

    public function cargarOrganosIdDemandantes() {
        $arraycompentidadOC = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        'organoconsumidor'
        );
        $arrayorganosdemandantes = array();
        if (isset($arraycompentidadOC[0])) {
            $idcomportamiento = $arraycompentidadOC[0]['iddatosnomenclador'];
            //$integrator = ZendExt_IoC::getInstance();
            $arrayorganosdemandantes = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                            $idcomportamiento
            );
        }
        return $arrayorganosdemandantes;
    }

    //LISTA LOS CENTROS DE BALANCE EN DEPENDENCIA DE LA ENTIDAD LOGUEADA
    //SE USA SOLO PARA LA RECUPERACION DE BALANCE MATERIAL
    public function listarCentrosBalanceRecuperacion($rector, $cb, $od, $identidad
    ) {
        $i = 0;
        if ($rector == 'true') {
            $centbal = DatEntidaddatosnomenclador::getCB();
            if ($centbal) {
                foreach ($centbal as $valor) {
                    $dat[$i]['identidad'] = $valor['identidad'];
                    $enti = $this->integrator->metadatos->DameEstructura(
                            $valor['identidad']
                    );
                    $dat[$i]['denominacion'] = $enti[0]->denominacion;
                    $i++;
                }

                $datos = $dat;
            } else {
                $datos = 1;
            }
        } else {
            if ($cb && !$od) {
                $datos[0]['identidad'] = $identidad;
                $enti = $this->integrator->metadatos->DameEstructura(
                        $identidad
                );
                $datos[0]['denominacion'] = $enti[0]->denominacion;
            } else {
                if ($cb && $od) {
                    $datos[0]['identidad'] = $identidad;
                    $enti = $this->integrator->metadatos->DameEstructura(
                            $identidad
                    );
                    $datos[0]['denominacion'] = $enti[0]->denominacion;
                } else {
                    if ($od && !$cb) {
                        $datos = 1;
                    }
                }
            }
        }
        return $datos;
    }

    public function listarEntidadesRecuperacion($parametros) {
        if ($parametros['soyCB'] == 1) {
            if ($parametros['identidad'][0] != null || ($parametros['orgrecto'] != 'true')
            ) {

                if ($parametros['identidad'][0] == null) {
                    $identidades[] = $parametros['identidadlog'];
                } else {
                    $identidades = explode(",", $parametros['identidad']);
                }
                $entidaddatosnom = "";

                $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                                $identidades
                );

                foreach ($entidaddatosnom as $key => $k) {
                    $entidaddatosnom[$key] = $k['identidaddatosnomenclador'];
                }

                $parametros['identtidaddes'] = DatPlanificacion::obtenerEntidadesQueDemandanByIdCentrosB(
                                $entidaddatosnom
                );

                $datos = array();
                if (isset($parametros['identtidaddes'][0])) {
                    $arrayEntidades = array();
                    foreach ($parametros['identtidaddes'] as $key => $k) {
                        $arrayEntidades[] = $k['identidad'];
                    }
                    $entidadescad = implode(',', $arrayEntidades);
                    $datos = DatAjusteexistenciaod::listarEntidades(
                                    $entidadescad
                    );
                }
            } else {
                $datos = self::cargarODRecuperacionCB($parametros);
            }
        } else {
            $datos = self::cargarODRecuperacionCB($parametros);
        }
        return $datos;
    }

    public function listarEntidadesDemandantesProyPlanif($parametros) {
        $integrator = ZendExt_IoC::getInstance();
        $excluir = array(7, 8, 9, 10);
        $arrayorganosdemandantes = $integrator->metadatos->DameHijosEstructura(
                $parametros['identidadlog'], $excluir
        );

        if ($arrayorganosdemandantes[0] != null) {
            foreach ($arrayorganosdemandantes as $key => $organodemandante) {
                $array[$key] = $organodemandante->id;
            }
        }
        $entidades = implode(',', $array);
        $datos = DatEntidaddatosnomenclador::obtenerOrgDemDadoArrEnt($entidades);
        $arrayresp = array();
        $modeloActEnt = new DatActividadentidad();
        foreach ($datos as $key => $entidaddemandante) {
            $enthojas = array();
            $enthojas = DatActividadentidad::auxObtenerEntidadesHijasComun($entidaddemandante['identidad']);
            $identidadesh = implode(",", $enthojas);
            if ($parametros['componente'] == 2 || $parametros['componente'] == 3)
                $idplanif = DatPlanificacion::buscarEntidadesPlanif($identidadesh, $parametros['idejercicio']);
            if ($parametros['componente'] == 1)
                $idplanif = DatActividadentidad::buscarEntidadesPlanifNivAct($identidadesh, $parametros['idejercicio']);
            if ($idplanif[0] != null)
                $arrayresp[] = $entidaddemandante;
        }
        return $arrayresp;
    }

    public function EntidadesQueDemandanAUnCB($parametros, $soloEnt = false) {
        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom(
                        $parametros['identidadlog']
        );


        $parametros['identtidaddes'] = DatPlanificacion::obtenerEntidadesQueDemandanByIdCB(
                        $entidaddatosnom[0]['identidaddatosnomenclador']
        );

        if (isset($parametros['identtidaddes'][0])) {
            /*  */
            if ($soloEnt) {
                $arrayEntidades = array();
                foreach ($parametros['identtidaddes'] as $k) {
                    $arrayEntidades[] = $k['identidad'];
                }
                return $arrayEntidades;
            } else
                return $parametros['identtidaddes'];
        } else {
            $parametros['identtidaddes'] = array();
            return $parametros['identtidaddes'];
        }
    }

}
