<?php

/**
 * ExportarImportarModel
 *
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificaci�n
 * @ subpackage Planificaci�n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class RecuperacionesModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function generarReporte($params) {
        $str = '';
        $rep [] = array('op' => 'rcpxc', 'dsc' => 'RESUMEN COMPARATIVO DEL PLAN POR CONCEPTOS.');
        $rep [] = array('op' => 'rpxva', 'dsc' => 'RESUMEN DEL PLAN POR VIAS DE ADQUISICION.');

        switch ($params['tipo']) {
            case 'rpxva':
                $str = self::getRPXVA($params);
                break;
            case 'rcpxc':
                $str = self::getRCPXC($params);
                break;
        }
        if ($str != '' && ($params['formato'] == 'html' || $params['formato'] == 'xls')) {
            if ($params['formato'] == 'xls') {
                header("Pragma: public");
                header("Expires: 0");
                header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                header("Content-Type: application/force-download");
                header("Content-Type: application/octet-stream");
                header("Content-Type: application/download");
                header("Content-Disposition: attachment;filename =RESUMEN_COMPARATIVO_DEL_PLAN_POR_CONCEPTOS.xls");
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
                echo "</br></br> REPORTE " . ($k + 1) . "</br> tipo: " . $v['op'] . '</br> DESCRIPCION: ' . $v['dsc'];
            }
            echo '</br></br>LOS FORMATOS VALIDOS SON:</br>';
            echo '</br> FORMATO 1 </br> formato: html <br> MUESTRA EL REPORTE EN LA PAGINA WEB PARA IMPRIMIR</br>';
            echo '</br> FORMATO 2 </br> formato: xls <br> MUESTRA UNA VENTANA DE DESCARGA PARA GUARDAR EL ARCHIVO CON EL REPORTE</br>';
        }
        return;
    }

    public function getRCPXC($params) {
        $conn = Doctrine_Manager :: connection();
        $sql
                = "select * from mod_planifrecuperacion.f_resumen_comparativo_del_plan_por_conceptos()"; //identidad, idmodelo, idtabla,iddesglose, idejercicio,especialidad
        $res = $conn->execute($sql)->fetchAll(PDO::FETCH_NUM); //PDO::FETCH_ASSOC,PDO::FETCH_NUM
        $table = '<table border="1">';
        $table
                .= '
          <col width="50" span="11" />
          <tr >
            <td colspan="13" align="center" valign="middle"><span class="Estilo1">RESUMEN COMPARATIVO DEL PLAN POR CONCEPTOS</span></td>
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
            foreach ($res as $k => $v) {
                $table .= "<tr>
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
                $f2 += $v[6];
                $f3 += $v[7];
                $f4 += $v[8];
                $f5 += $v[9];
                $f6 += $v[2];
                $f7 += $v[3];
                $f8 += $v[4];
                $f9 += $v[5];
                $f10 += $v[10];
                $f11 += $v[11];
                $f12 += $v[12];
                $f13 += $v[13];
            }
            $table .= "<tr>
                    <td >TOTAL</td>
                    <td >$f2</td>
                    <td >$f3</td>
                    <td >$f4</td>
                    <td >$f5</td>
                    <td >$f6</td>
                    <td >$f7</td>
                    <td >$f8</td>
                    <td >$f9</td>
                    <td >$f10</td>
                    <td >$f11</td>
                    <td >$f12</td>
                    <td >$f13</td>
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

    public function getRPXVA($params) {
        return '';
    }

    public function mostrarReporte($parametros) {
        switch ($parametros->idreporte) {
            case 1:
                $cuerporeporte = $this->genererReporteResumenPorViaAdquisicion($parametros);
                break;
            case 2:
                $cuerporeporte = $this->genererReporteResumenPlanPorConceptos($parametros);
                break;
            case 3:
                $cuerporeporte = $this->genererReporteResumenProductosPorOACE($parametros);
                break;
            case 4:
                $cuerporeporte = $this->genererReporteResumenProductosSIPorOrganoSatisface($parametros);
                break;
            case 5:
                $cuerporeporte = $this->genererReporteDemandaPlanInversiones($parametros);
                break;
            case 6:
                $cuerporeporte = $this->genererReporteBalance($parametros);
                break;
            case 7:
                $cuerporeporte = $this->generarReporteAjuste($parametros);
                break;
            case 8:
                $cuerporeporte = $this->generarReporteDiferenciaPrecio($parametros);
                break;
        }
        return $cuerporeporte;
    }

    public function genererReporteResumenPorViaAdquisicion($parametros) {

        switch ($parametros->formatoreporte) {
            case 1: //HTML
                $cuerporeporte = $this->configurarHojaReporte($parametros);

                $cadenaENCABEZADO = '';
                $cadenaENCABEZADOVIAADQUISICION = '';
                $cadenaSUBENCABEZADOVIAADQUISICION = '';
                $idviasadquisicion = array();
                $parametros->indicadoresvisitados = array();
                $parametros->indices_posicion_vias = array();

                $totalcolumnas = 5;
                //procedo a calcular el ancho en % de cada columna 
                if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != ''
                ) {
                    $totalVA = count($parametros->arrayviasadquisicion);
                    $totalcolumnas = $totalcolumnas + $totalVA;
                    $porcientoxcolumna = 100 / $totalcolumnas;
                    $total_vias = 0;
                    foreach ($parametros->arrayviasadquisicion as $indice => $viaadquisicion) {
                        $idvia = $viaadquisicion->idvia;
                        $parametros->indices_posicion_vias[$idvia] = $indice;
                        $arrayidvias_unidimensional[] = $viaadquisicion->idvia;
                        $cadenaENCABEZADOVIAADQUISICION
                                .= '<td colspan="2" rowspan="2" width="' . $porcientoxcolumna . '%">'
                                . $viaadquisicion->denominacion . '</td>';
                        $cadenaSUBENCABEZADOVIAADQUISICION .= '<td height="21" width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
															  <td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                        $total_vias++;
                    }
                    $parametros->total_vias = $total_vias;
                } else {
                    $arrayVA = NomViaadquisicion::Obtener_via_adquisicion();
                    $totalVA = count($arrayVA->data);
                    $totalcolumnas = $totalcolumnas + $totalVA;
                    $porcientoxcolumna = 100 / $totalcolumnas;
                    $total_vias = 0;
                    foreach ($arrayVA->data as $indice => $va) {
                        $idvia = $va['idviaadquisicion'];
                        $parametros->indices_posicion_vias[$idvia] = $indice;
                        $arrayidvias_unidimensional[] = $va['idviaadquisicion'];
                        $cadenaENCABEZADOVIAADQUISICION
                                .= '<td colspan="2" rowspan="2" width="' . $porcientoxcolumna . '%">'
                                . $va['denominacion'] . '</td>';
                        $cadenaSUBENCABEZADOVIAADQUISICION .= '<td height="21" width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
															  <td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                        $total_vias++;
                    }
                    $parametros->total_vias = $total_vias;
                }
                $parametros->arrayidvias = $arrayidvias_unidimensional;
                $parametros->arrayidvias_unidimensional = implode(',', $arrayidvias_unidimensional);
                $cadenaENCABEZADO
                        = $cadenaENCABEZADOVIAADQUISICION . '</tr><tr> </tr><tr>' . $cadenaSUBENCABEZADOVIAADQUISICION;

                $parametros->anchocolspan = $totalcolumnas + 2 + ($totalVA * 2);

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>RESUMEN DEL PLAN POR VÍA DE ADQUISICIÓN<strong></td></tr>';
                $cuerporeporte .= "</table>";
                //creando la tabla con las columnas fijas
                $cuerporeporte
                        .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
								  <thead>
									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td rowspan="3" height="62" width="' . $porcientoxcolumna . '%">C&oacute;digo</td>
										<td rowspan="3" width="' . $porcientoxcolumna . '%">Descripci&oacute;n</td>
										<td rowspan="3" width="' . $porcientoxcolumna . '%">UM</td>
										<td rowspan="3" width="' . $porcientoxcolumna . '%">Precio</td>
										<td colspan="2" rowspan="2" width="'
                        . $porcientoxcolumna . '%">Total general</td>';

                //anexando el resto de las columnas
                $cuerporeporte = $cuerporeporte . $cadenaENCABEZADO;
                $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
										 <td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';


                //filtro y compartimentacion por centros de balance
                if ($parametros->arrayidcentrobalance[0]->idcentrobalance != null && $parametros->arrayidcentrobalance[0]->idcentrobalance != ''
                ) {
                    foreach ($parametros->arrayidcentrobalance as $centrobalance) {
                        $arrayidcentrosbalance_unidimensional[] = $centrobalance->idcentrobalance;
                    }
                    $parametros->arrayidcentrosbalance = $arrayidcentrosbalance_unidimensional;
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
                                $arrayidorgandos_unidimensional, $this->buscarEntidadesHijas($idorgano->idorgano)
                        );
                    }

                } else {
                    $arrayorganosdemandantes = $this->cargarOrganosDemandantes(); //$this->cargarOrganosIdDemandantes();
                    if (isset($arrayorganosdemandantes[0])) {
                        foreach ($arrayorganosdemandantes as $organo) {
                            $arrayidorgandos_unidimensional[] = $organo['identidad'];
                        }
                    }
                }
                $parametros->arrayidorganos = $arrayidorgandos_unidimensional;
                $parametros->arrayidorganos_unidimensional = implode(',', $arrayidorgandos_unidimensional);

                $total = 0;
                if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != '') {
                    foreach ($parametros->arrayplanes as $plan) {
                        $parametros->idplan = $plan->idplan;
                        $nombreplan = $plan->denominacion;
                        $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                        $cuerporeporte .= ' 	<td colspan="14"><strong>' . $nombreplan . '</strong></td>';
                        $cuerporeporte .= ' </tr>';
                        $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                        $cuerporeporte .= $arraydatos['cuerporeporte'];
                        $total = $total + $arraydatos['subtotal'];
                    }
                } else {
                    $arrayplanesexistentes = DatPlanificacion::obtenerPlanesPorEjercicio(
                                    $parametros->idejercicio, $parametros->denoclasifplanrep
                    );

                    if (isset($arrayplanesexistentes[0]['idmodelo'])) {

                        foreach ($arrayplanesexistentes as $key => $plan) {

                            $parametros->idplan = $plan['idmodelo'];
                            $nombreplan = $plan['denominacion'];
                            $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                            $cuerporeporte .= ' 	<td colspan="' . $parametros->anchocolspan . '"><strong>'
                                    . $nombreplan . '</strong></td>';
                            $cuerporeporte .= ' </tr>';
                            $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                            $cuerporeporte .= $arraydatos['cuerporeporte'];
                            $total = $total + $arraydatos['subtotal']; //}

                        }
                    }
                }

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

        switch ($parametros->formatoreporte) {
            case 1:
                $cuerporeporte = $this->configurarHojaReporte($parametros);
                $cadenaENCABEZADOSECTORES = '';
                $cadenaSUBENCABEZADOSECTORES = '';
                $totalcolumnas = 5;

                //procedo a calcular el ancho en % de cada columna 
                if ($parametros->arraysectores[0]->idsector != null && $parametros->arraysectores[0]->idsector != '') {

                    $totalSR = count($parametros->arraysectores);
                    $totalcolumnas = $totalcolumnas + $totalSR;
                    $porcientoxcolumna = 100 / $totalcolumnas;
                    $total_sectores = 0;
                    foreach ($parametros->arraysectores as $indice => $sector) {
                        $idsector = $sector->idsector;
                        $parametros->indices_posicion_sectores[$idsector] = $indice;
                        $arrayidsectores_unidimensional[] = $idsector;
                        $cadenaENCABEZADOSECTORES .= '<td colspan="2" rowspan="2" width="' . $porcientoxcolumna . '%">'
                                . $sector->denominacion . '</td>';
                        $cadenaSUBENCABEZADOSECTORES .= '<td height="21" width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
															  <td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                        $total_sectores++;
                    }
                    $parametros->total_sectores = $total_sectores;
                } else {
                    $datosnommodel = new NomDatosnomencladorModel();
                    $arraySR = $datosnommodel->listarSR();
                    $totalSR = count($arraySR);
                    $totalcolumnas = $totalcolumnas + $totalSR;
                    $porcientoxcolumna = 100 / $totalcolumnas;
                    $total_sectores = 0;
                    foreach ($arraySR as $indice => $sectorrama) {
                        $idsector = $sectorrama['iddatosnomenclador'];
                        $parametros->indices_posicion_sectores[$idsector] = $indice;
                        $arrayidsectores_unidimensional[] = $idsector;
                        $cadenaENCABEZADOSECTORES .= '<td colspan="2" rowspan="2" width="' . $porcientoxcolumna . '%">'
                                . $sectorrama['nom_datosnomenclador_denominacion'] . '</td>';
                        $cadenaSUBENCABEZADOSECTORES .= '<td height="21" width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
															  <td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                        $total_sectores++;
                    }
                    $parametros->total_sectores = $total_sectores;
                }

                $parametros->arrayidsectores = $arrayidsectores_unidimensional;
                $parametros->arrayidsectores_unidimensional = implode(',', $arrayidsectores_unidimensional);
                $cadenaENCABEZADO = $cadenaENCABEZADOSECTORES . '</tr><tr> </tr><tr>' . $cadenaSUBENCABEZADOSECTORES;

                $parametros->anchocolspan = $totalcolumnas + 1 + ($totalSR);

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>RESUMEN DE PRODUCTOS POR OACE<strong></td></tr>';
                $cuerporeporte .= "</table>";
                //creando la tabla con las columnas fijas
                $cuerporeporte
                        .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
								  <thead>
									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td rowspan="3" height="62" width="' . $porcientoxcolumna . '%">C&oacute;digo</td>
										<td rowspan="3" width="' . $porcientoxcolumna . '%">Denominaci&oacute;n</td>
										<td rowspan="3" width="' . $porcientoxcolumna . '%">UM</td>
										<td rowspan="3" width="' . $porcientoxcolumna . '%">Precio</td>
										<td colspan="2" rowspan="2" width="'
                        . $porcientoxcolumna . '%">Total general</td>';
                //anexando el resto de las columnas
                $cuerporeporte = $cuerporeporte . $cadenaENCABEZADO;
                $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
										 <td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';

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
                                $arrayidorgandos_unidimensional, $this->buscarEntidadesHijas($idorgano->idorgano)
                        );
                    }
                } else {
                    $arrayorganosdemandantes = $this->cargarOrganosDemandantes();
                    if (isset($arrayorganosdemandantes[0])) {
                        foreach ($arrayorganosdemandantes as $organo) {
                            $arrayidorgandos_unidimensional[] = $organo['identidad'];
                        }
                    }
                }
                $parametros->arrayidorganos = $arrayidorgandos_unidimensional;
                $parametros->arrayidorganos_unidimensional = implode(',', $arrayidorgandos_unidimensional);

                //filtro por planes
                $cont = 0;
                if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != '') {
                    foreach ($parametros->arrayplanes as $plan) {
                        $arrayunidimensional_idplan[] = $plan->idplan;
                        $cont++;
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

                //filtro por vias de adquisicion
                $existeBCD = 0;
                $cadenauriBCD = '';
                $existeMINISTERIOS = 0;
                $cadenauriMINISTERIOS = '';
                $existeMEP = 0;
                $cadenauriMEP = '';
                if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != ''
                ) {
                    $cont = 0;
                    foreach ($parametros->arrayviasadquisicion as $indice => $viaadquisicion) {
                        $uriviaadquisicion = $viaadquisicion->uriviaadquisicion;
                        if ($uriviaadquisicion == 'importacion directa' || $uriviaadquisicion == 'sustitucionimportaciones'
                        ) {
                            $existeBCD = 1;
                            if ($cadenauriBCD != '') {
                                $cadenauriBCD = $cadenauriBCD . ",'" . "'" . $uriviaadquisicion . "'";
                            } else {
                                $cadenauriBCD = "'" . $uriviaadquisicion . "'";
                            }
                        }
                        if ($uriviaadquisicion == 'oace') {
                            $existeMINISTERIOS = 1;
                            if ($cadenauriMINISTERIOS != '') {
                                $cadenauriMINISTERIOS = $cadenauriMINISTERIOS . "," . "'" . $uriviaadquisicion . "'";
                            } else {
                                $cadenauriMINISTERIOS = "'" . $uriviaadquisicion . "'";
                            }
                        }
                        if ($uriviaadquisicion == 'balanceador central') {
                            $existeMEP = 1;
                            if ($cadenauriMEP != '') {
                                $cadenauriMEP = $cadenauriMEP . "," . "'" . $uriviaadquisicion . "'";
                            } else {
                                $cadenauriMEP = "'" . $uriviaadquisicion . "'";
                            }
                        }
                    }
                } else {
                    $existeBCD = 1;
                    $existeMINISTERIOS = 1;
                    $existeMEP = 1;
                    $cadenauriBCD = "'importacion directa','sustitucionimportaciones'";
                    $cadenauriMINISTERIOS = "'oace'";
                    $cadenauriMEP = "'balanceador central'";
                }
                if ($existeMEP == 1) {
                    $arraydatos = array();
                    $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                    $cuerporeporte .= ' 	<td colspan="' . $parametros->anchocolspan . '"><strong>MEP</strong></td>';
                    $cuerporeporte .= ' </tr>';
                    $parametros->cadenauri = $cadenauriMEP;
                    $parametros->existeMEP = $existeMEP;
                    $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                    $cuerporeporte .= $arraydatos['cuerporeporte'];
                    $total = $total + $arraydatos['subtotal'];
                }
                if ($existeBCD == 1) {
                    $arraydatos = array();
                    $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                    $cuerporeporte .= ' 	<td colspan="'
                            . $parametros->anchocolspan . '"><strong>Balanceador Central(Divisas)</strong></td>';
                    $cuerporeporte .= ' </tr>';
                    $parametros->cadenauri = $cadenauriBCD;
                    $parametros->existeBCD = $existeBCD;
                    $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                    $cuerporeporte .= $arraydatos['cuerporeporte'];
                    $total = $total + $arraydatos['subtotal'];
                }
                if ($existeMINISTERIOS == 1) {
                    $arraydatos = array();
                    $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                    $cuerporeporte
                            .= ' 	<td colspan="' . $parametros->anchocolspan . '"><strong>Ministerios</strong></td>';
                    $cuerporeporte .= ' </tr>';
                    $parametros->cadenauri = $cadenauriMINISTERIOS;
                    $parametros->existeMINISTERIOS = $existeMINISTERIOS;
                    $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                    $cuerporeporte .= $arraydatos['cuerporeporte'];
                    $total = $total + $arraydatos['subtotal'];
                }

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

    public function genererReporteResumenProductosPorOACE($parametros) {
        $cuerporeporte = $this->configurarHojaReporte($parametros);
        $cadenaENCABEZADOSECTORES = '';
        $cadenaSUBENCABEZADOSECTORES = '';

        $totalcolumnas = 3;
        $porcientoxcolumna = 100 / $totalcolumnas;
        //creando el titulo del reporte
        $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
        $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>RESUMEN COMPARATIVO DEL PLAN POR CONCEPTOS<strong></td></tr>';
        $cuerporeporte .= "</table>";
        //creando la tabla con las columnas fijas
        $cuerporeporte
                .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
						  <thead>
							<tr style="text-align:CENTER;background-color:#BBBBBB;">
								<td colspan="4" rowspan="3" height="62" width="' . $porcientoxcolumna . '%">Concepto</td>
								<td colspan="4" height="62" width="' . $porcientoxcolumna . '%">Plan A&ntilde;o anterior</td>
								<td colspan="4" width="' . $porcientoxcolumna . '%">Plan A&ntilde;o actual</td>
								<td colspan="4" width="' . $porcientoxcolumna . '%">Diferencia</td>
							</tr> 

							<tr style="text-align:CENTER;CENTER;background-color:#BBBBBB;"> 
								<td rowspan="2" height="62" width="' . ($porcientoxcolumna / 4) . '%">TOTAL</td>
								 <td colspan="2" width="' . ($porcientoxcolumna / 2) . '%">MEP</td>
								 <td width="' . ($porcientoxcolumna / 4) . '%">RESTO</td>
								 <td rowspan="2" height="62" width="' . ($porcientoxcolumna / 4) . '%">TOTAL</td>
								 <td colspan="2" width="' . ($porcientoxcolumna / 2) . '%">MEP</td>
								 <td width="' . ($porcientoxcolumna / 4) . '%">RESTO</td>
								 <td rowspan="2" height="62" width="' . ($porcientoxcolumna / 4) . '%">TOTAL</td>
								 <td colspan="2" width="' . ($porcientoxcolumna / 2) . '%">MEP</td>
								 <td width="' . ($porcientoxcolumna / 4) . '%">RESTO</td>
							</tr>
							<tr style="text-align:CENTER;CENTER;background-color:#BBBBBB;">
								  <td height="41" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">RECURSOS</div></td>
								  <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">FINANC.</div>      <div align="center">CENTRAL</div></td>
								  <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">OACE</div>      <div align="center"></div></td>
								  <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">RECURSOS</div></td>
								  <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">FINANC.</div>      <div align="center">CENTRAL</div></td>
								  <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">OACE</div>      <div align="center"></div></td>
								  <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">RECURSOS</div></td>
								  <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">FINANC.</div>      <div align="center">CENTRAL</div></td>
								  <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">OACE</div>      <div align="center"></div></td>
							</tr></thead><tbody>';

        //filtro por centros de balance
        if ($parametros->arrayidcentrobalance[0]->idcentrobalance != null && $parametros->arrayidcentrobalance[0]->idcentrobalance != '') {
            foreach ($parametros->arrayidcentrobalance as $centrobalance) {
                $arrayidcentrosbalance_unidimensional[] = $centrobalance->idcentrobalance;
            }
            $parametros->arrayidcentrobalance = $arrayidcentrosbalance_unidimensional;
            $parametros->arrayidcentrobalance_unidimensional = implode(',', $arrayidcentrosbalance_unidimensional);
        }

        //filtro y compartimentacion por organos demandantes
        $iddominio = $this->global->Perfil->iddominio;
        $integrator = ZendExt_IoC::getInstance();
        $arrayidorgandos_unidimensional = array();

        if (isset($parametros->arrayidorganos[0])) {
            foreach ($parametros->arrayidorganos as $idorgano) {
                $arrayidorgandos_unidimensional = array_merge(
                        $arrayidorgandos_unidimensional, $this->buscarEntidadesHijas($idorgano->idorgano)
                );
            }
        } else {

            $arrayorganosdemandantes = $this->cargarOrganosDemandantes();
            if (isset($arrayorganosdemandantes[0])) {
                foreach ($arrayorganosdemandantes as $organo) {
                    $arrayidorgandos_unidimensional[] = $organo['id'];
                    $arrayidorgandos_unidimensional = array_merge(
                            $arrayidorgandos_unidimensional, $this->buscarEntidadesHijas($organo['id'])
                    );
                }
            }
        }
        $parametros->arrayidorganos = $arrayidorgandos_unidimensional;
        $parametros->arrayidorganos_unidimensional = implode(',', $arrayidorgandos_unidimensional);
       if ($parametros->arraytipogastos[0]->idtipogasto != null && $parametros->arraytipogastos[0]->idtipogasto != ''
        ) {
            $parametros->arrayunidimensional_uritipogasto = '';
            $totalfinalAnt = 0;
            $totalfinalAct = 0;
            $totalfinalDif = 0;
            foreach ($parametros->arraytipogastos as $tipogasto) {
                //agrupando los conceptos por la categoria del plan
                $cuerporeporte .= ' <tr style="text-align:CENTER;background-color:#DDDDDD;">';
                if ($tipogasto->idtipogasto == 1) {
                    $uri = "gastoscorriente";
                    $cuerporeporte .= ' 	<td colspan="16"><strong>Gastos Corrientes<strong></td>';
                    $cuerporeporte .= ' </tr>';
                    $parametros->arrayunidimensional_uritipogasto = "'" . $uri . "'";

                    $subtotalanterior = 0;
                    $subtotal = 0;
                    $subtotalDif = 0;
                } else {
                    $uri = "gastoscapital";
                    $cuerporeporte .= ' 	<td colspan="16"><strong>Gastos Capital<strong></td>';
                    $parametros->arrayunidimensional_uritipogasto = "'" . $uri . "'";

                    $subtotalanterior = 0;
                    $subtotal = 0;
                    $subtotalDif = 0;
                }

                //filtro por planes
                if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != '') {

                    $cont = 0;
                   foreach ($parametros->arrayplanes as $plan) {
                        if ($plan->uridatosnomenclador == $uri) {
                            $cont++;
                            $idplan = $plan->idplan;
                            $parametros->idplan = $idplan;
                            $resul1 = DatPlanificacion::consulta3_1($parametros, $parametros->idejercicioante);
                            $resul2 = DatPlanificacion::consulta3_2($parametros, $parametros->idejercicioante);
                            $resul3 = DatPlanificacion::consulta3_3($parametros, $parametros->idejercicioante);
                            $totalanterior = $resul1 + $resul2 + $resul3;
                            $cuerporeporte
                                    .= '<tr style="text-align:CENTER;height:auto" height=auto>
													<td height="21" colspan="4" width="' . ($porcientoxcolumna / 4)
                                    . '%"><div align="left"> ' . $plan->denominacion . '</div></td>
													';
                            //poniendo las columnas vacions del plan anterior
                            $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $totalanterior . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resul1 . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resul2 . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resul3 . '</div></td>';

                            $subtotalanterior = $subtotalanterior + $totalanterior;

                            //consulta para obtener el plan sumarizado
                            $resultado1 = DatPlanificacion::consulta3_1($parametros, $parametros->idejercicio);
                            $resultado2 = DatPlanificacion::consulta3_2($parametros, $parametros->idejercicio);
                            $resultado3 = DatPlanificacion::consulta3_3($parametros, $parametros->idejercicio);
                            $total = $resultado1 + $resultado2 + $resultado3;
                            $cuerporeporte
                                    .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $total . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resultado1 . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resultado2 . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resultado3 . '</div></td>';

                            $subtotal = $subtotal + $total;

                            //poniendo las columnas vacions de la diferencia

                            $diftotal = $total - $totalanterior;
                            $difrecursos = $resultado1 - $resul1;
                            $difFC = $resultado2 - $resul2;
                            $difOACE = $resultado3 - $resul3;

                            $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $diftotal . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $difrecursos . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $difFC . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $difOACE . '</div></td>';

                            $subtotalDif = $subtotalDif + $diftotal;

                            $cuerporeporte .= '</tr>';
                        }
                    }
                    $subtotaldif = $subtotaldif + $diftotal;
                    //************************

                    $cuerporeporte .= '<tr style="text-align:CENTER;height:auto" height=auto>
				<td height="21" colspan="4" width="' . ($porcientoxcolumna / 4)
                            . '%"><div align="left"> ' . '<strong>SUB-TOTAL :</strong>' . '</div></td>
				<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                            . $subtotalanterior . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
                                                                                                 <td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                            . $subtotal . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
                                                                                                 <td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                            . $subtotalDif . '</div></td>
							                                         <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td> </tr>';


                    //************************

                    if ($cont == 0) {
                        $cuerporeporte .= ' 	<td colspan="16"><center><strong>-<strong></center></td>';
                        $cuerporeporte .= ' </tr>';
                    }
                } else {

                    $arrayplanes = DatPlanificacion::obtenerPlanesPorEjercicioTipoGastoUniAnterior($parametros);

                    if (isset($arrayplanes[0])) {
                        //$cont = 0;
                        $subtotal = 0;
                        foreach ($arrayplanes as $plan) {
                            $idplan = $plan['idmodelo'];
                            $parametros->idplan = $idplan;
                            $resul1 = DatPlanificacion::consulta3_1($parametros, $parametros->idejercicioante);
                            $resul2 = DatPlanificacion::consulta3_2($parametros, $parametros->idejercicioante);
                            $resul3 = DatPlanificacion::consulta3_3($parametros, $parametros->idejercicioante);
                            $totalanterior = $resul1 + $resul2 + $resul3;
                            $cuerporeporte
                                    .= '<tr style="text-align:CENTER;height:auto" height=auto>
													<td height="21" colspan="4" width="' . ($porcientoxcolumna / 4)
                                    . '%"><div align="left"> ' . $plan['denominacion'] . '</div></td>
													';
                            //poniendo las columnas vacions del plan anterior
                            $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $totalanterior . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resul1 . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resul2 . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resul3 . '</div></td>';

                            $subtotalanterior = $subtotalanterior + $totalanterior;

                            //consulta para obtener el plan sumarizado
                            $resultado1 = DatPlanificacion::consulta3_1($parametros, $parametros->idejercicio);
                            $resultado2 = DatPlanificacion::consulta3_2($parametros, $parametros->idejercicio);
                            $resultado3 = DatPlanificacion::consulta3_3($parametros, $parametros->idejercicio);
                            $total = $resultado1 + $resultado2 + $resultado3;
                            $cuerporeporte
                                    .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $total . '</div></td>
											 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resultado1 . '</div></td>
											 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resultado2 . '</div></td>
											 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $resultado3 . '</div></td>';
                            $subtotal = $subtotal + $total;

                            //poniendo las columnas vacions de la diferencia

                            $diftotal = $total - $totalanterior;
                            $difrecursos = $resultado1 - $resul1;
                            $difFC = $resultado2 - $resul2;
                            $difOACE = $resultado3 - $resul3;

                            $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $diftotal . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $difrecursos . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $difFC . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                    . $difOACE . '</div></td>';

                            $subtotalDif = $subtotalDif + $diftotal;

                            $cuerporeporte .= '</tr>';
                        }

                        //************************

                        $cuerporeporte .= '<tr style="text-align:CENTER;height:auto" height=auto>
				<td height="21" colspan="4" width="' . ($porcientoxcolumna / 4)
                                . '%"><div align="left"> ' . '<strong>SUB-TOTAL :</strong>' . '</div></td>
				<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                . $subtotalanterior . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
                                                                                                 <td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                . $subtotal . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
                                                                                                 <td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                                . $subtotalDif . '</div></td>
							                                         <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td> </tr>';
                        //************************

                    } else {
                        $cuerporeporte .= ' 	<td colspan="16"><center><strong>-<strong></center></td>';
                        $cuerporeporte .= ' </tr>';
                    }
                }
                $totalfinalAnt = $totalfinalAnt + $subtotalanterior;
                $totalfinalAct = $totalfinalAct + $subtotal;
                $totalfinalDif = $totalfinalDif + $subtotalDif;
            }
            $cuerporeporte .= ' <tr>';
            $cuerporeporte .= '<tr style="text-align:CENTER;height:auto;background-color:#BBBBBB;" height=auto>
				<td height="21" colspan="4" width="' . ($porcientoxcolumna / 4)
                    . '%"><div align="left"> ' . '<strong>TOTAL :</strong>' . '</div></td>
				<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                    . $totalfinalAnt . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
                                                                                                 <td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                    . $totalfinalAct . '</div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
                                                                                                 <td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                    . $totalfinalDif . '</div></td>
							                                         <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td>
												 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center"> </div></td> </tr>';

            $cuerporeporte .= ' </tr>';
        }
        $cuerporeporte .= "</tbody></table>";
        $cuerporeporte .= "</div></div>";

        return $cuerporeporte;
    }

    public function genererReporteResumenProductosSIPorOrganoSatisface($parametros) {

        switch ($parametros->formatoreporte) {
            case 1:
                $cuerporeporte = $this->configurarHojaReporte($parametros);
                $cadenaENCABEZADOOACE = '';
                $cadenaSUBENCABEZADOOACE = '';
                $totalcolumnas = 5;
                $totalOACE = 0;
                //procedo a calcular el ancho en % de cada columna 
                if ($parametros->arrayoace[0]->idoace != null && $parametros->arrayoace[0]->idoace != '') {
                    $totalOACE = count($parametros->arrayoace);
                    $totalcolumnas = $totalcolumnas + $totalOACE;
                    $porcientoxcolumna = 100 / $totalcolumnas;
                    $total_oace = 0;
                    foreach ($parametros->arrayoace as $indice => $oace) {
                        $idoace = $sector->idoace;
                        $parametros->indices_posicion_oace[$idoace] = $indice;
                        $arrayidoace_unidimensional[] = $idoace;
                        $cadenaENCABEZADOOACE .= '<td colspan="2" rowspan="2" width="' . $porcientoxcolumna . '%">'
                                . $oace->denominacion . '</td>';
                        $cadenaSUBENCABEZADOOACE .= '<td height="21" width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
															  <td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                        $total_oace++;
                    }
                    $parametros->total_oace = $total_oace;

                    $parametros->arrayidoace = $arrayidoace_unidimensional;
                    $parametros->arrayidoace_unidimensional = implode(',', $arrayidoace_unidimensional);
                } else {
                    $datosnommodel = new NomOrganosatisfaceModel();
                    $arrayOACE = $datosnommodel->listarOrganoSatisfaceSustitucionImp();
                    if (isset($arrayOACE[0]['idorganosatisface'])) {
                        $totalOACE = count($arrayOACE);
                        $parametros->totalOACE = $totalOACE;
                        $totalcolumnas = $totalcolumnas + $totalOACE;
                        $porcientoxcolumna = 100 / $totalcolumnas;
                        $total_oace = 0;
                        foreach ($arrayOACE as $indice => $oace) {
                            $idoace = $oace['idorganosatisface'];
                            $parametros->indices_posicion_oace[$idoace] = $indice;
                            $arrayidoace_unidimensional[] = $idoace;
                            $cadenaENCABEZADOOACE .= '<td colspan="2" rowspan="2" width="' . $porcientoxcolumna . '%">'
                                    . $oace['denominacion'] . '</td>';
                            $cadenaSUBENCABEZADOOACE .= '<td height="21" width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
																  <td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';
                            $total_oace++;
                        }
                        $parametros->total_oace = $total_oace;

                        $parametros->arrayidoace = $arrayidoace_unidimensional;
                        $parametros->arrayidoace_unidimensional = implode(',', $arrayidoace_unidimensional);
                    }
                }

                $cadenaENCABEZADO = $cadenaENCABEZADOOACE . '</tr><tr> </tr><tr>' . $cadenaSUBENCABEZADOOACE;

                $parametros->anchocolspan = $totalcolumnas + 1 + ($totalOACE);

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>RESUMEN PRODUCTOS SI POR ORGANO QUE SATISFACEN<strong></td></tr>';
                $cuerporeporte .= "</table>";
                //creando la tabla con las columnas fijas
                $cuerporeporte
                        .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
								  <thead>
									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td rowspan="3" height="62" width="' . $porcientoxcolumna . '%">C&oacute;digo</td>
										<td rowspan="3" width="' . $porcientoxcolumna . '%">Denominaci&oacute;n</td>
										<td rowspan="3" width="' . $porcientoxcolumna . '%">UM</td>
										<td rowspan="3" width="' . $porcientoxcolumna . '%">Precio</td>
										<td colspan="2" rowspan="2" width="'
                        . $porcientoxcolumna . '%">Total general</td>';
                //anexando el resto de las columnas
                $cuerporeporte = $cuerporeporte . $cadenaENCABEZADO;
                $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">cant.</td>
										 <td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;background-color:#BBBBBB;">valor</td>';

                //filtro y compartimentacion por centros de balance
                if ($parametros->arrayidcentrobalance[0]->idcentrobalance != null && $parametros->arrayidcentrobalance[0]->idcentrobalance != ''
                ) {
                    foreach ($parametros->arrayidcentrobalance as $centrobalance) {
                        $arrayidcentrosbalance_unidimensional[] = $centrobalance->idcentrobalance;
                    }
                    $parametros->arrayidcentrobalance = $arrayidcentrosbalance_unidimensional;
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
                                $arrayidorgandos_unidimensional, $this->buscarEntidadesHijas($idorgano->idorgano)
                        );
                    }
                } else {
                    $arrayorganosdemandantes = $this->cargarOrganosDemandantes();
                    if (isset($arrayorganosdemandantes[0])) {
                        foreach ($arrayorganosdemandantes as $organo) {
                            $arrayidorgandos_unidimensional[] = $organo['identidad'];
                        }
                    }
                }
                $parametros->arrayidorganos = $arrayidorgandos_unidimensional;
                $parametros->arrayidorganos_unidimensional = implode(',', $arrayidorgandos_unidimensional);

                //filtro por planes
                $cont = 0;
                if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != '') {
                    foreach ($parametros->arrayplanes as $plan) {
                        $arrayunidimensional_idplan[] = $plan->idplan;
                        $cont++;
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


                $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                $cuerporeporte .= $arraydatos['cuerporeporte'];
                $total = $total + $arraydatos['subtotal'];

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
                return $cuerporeporte;
                break;
        }
    }

    public function obtenerCuerpoReporteResumenProductosPorOACE($parametros) {
        //filtro por planes
        $cont = 0;
        if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != '') {
            foreach ($parametros->arrayplanes as $plan) {
                $idplan = $plan->idplan;
                $parametros->idplan = $idplan;
                $cuerporeporte
                        = '<tr style="text-align:CENTER;height:auto" height=auto>
									<td height="21" colspan="4" width="' . ($porcientoxcolumna / 4)
                        . '%"><div align="left"> ' . $plan->denominacion . '</div></td>
									';
                //poniendo las columnas vacions del plan anterior
                $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>';

                //consulta para obtener el plan sumarizado
                $resultado1 = DatPlanificacion::consulta3_1($parametros);
                $resultado2 = DatPlanificacion::consulta3_2($parametros);
                $resultado3 = DatPlanificacion::consulta3_3($parametros);
                $total = $resultado1 + $resultado2 + $resultado3;
                $cuerporeporte
                        .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">' . $total . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">' . $resultado1 . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">' . $resultado2 . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                        . $resultado3 . '</div></td>';


                //poniendo las columnas vacions del plan proximo
                $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>';

                $cuerporeporte .= '</tr>';
            }
        } else {
            $arrayplanes = DatPlanificacion::obtenerPlanesPorEjercicioTipoGasto($parametros);
            if (isset($arrayplanes[0])) {
                $cont = 0;
                foreach ($arrayplanes as $plan) {
                    $idplan = $plan['idmodelo'];
                    $parametros->idplan = $idplan;
                    $cuerporeporte
                            = '<tr style="text-align:CENTER;height:auto" height=auto>
									<td height="21" colspan="4" width="' . ($porcientoxcolumna / 4)
                            . '%"><div align="left"> ' . $plan['denominacion'] . '</div></td>
									';
                    //poniendo las columnas vacions del plan anterior
                    $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>';

                    //consulta para obtener el plan sumarizado
                    $resultado1 = DatPlanificacion::consulta3_1($parametros);
                    $resultado2 = DatPlanificacion::consulta3_2($parametros);
                    $resultado3 = DatPlanificacion::consulta3_3($parametros);
                    $total = $resultado1 + $resultado2 + $resultado3;
                    $cuerporeporte
                            .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">' . $total . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">' . $resultado1 . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">' . $resultado2 . '</div></td>
								 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">'
                            . $resultado3 . '</div></td>';

                    //poniendo las columnas vacions del plan proximo
                    $cuerporeporte .= '<td height="21" width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>
									 <td width="' . ($porcientoxcolumna / 4) . '%"><div align="center">-</div></td>';

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
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>DEMANDA POR PLANES PARA INVERSIONES<strong></td></tr>';
                $cuerporeporte .= "</table>";
                //creando la tabla con las columnas fijas
                $cuerporeporte
                        .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
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
                $total_sectores = 0;
                if ($parametros->arraysectores[0]->idsector != null && $parametros->arraysectores[0]->idsector != '') {
                    foreach ($parametros->arraysectores as $indice => $sector) {
                        $arrayidsectores_unidimensional[] = $sector->idsector;
                        $total_sectores++;
                    }
                    $parametros->arrayidsectores = $arrayidsectores_unidimensional;
                    $parametros->arrayidsectores_unidimensional = implode(',', $arrayidsectores_unidimensional);
                }
                $parametros->total_sectores = $total_sectores;

                //filtro por destino
                $total_destinos = 0;
                if ($parametros->arraydestinos[0]->iddestino != null && $parametros->arraydestinos[0]->iddestino != ''
                ) {
                    foreach ($parametros->arraydestinos as $indice => $destino) {
                        $arrayiddestinos_unidimensional[] = $destino->iddestino;
                        $total_destinos++;
                    }
                    $parametros->arrayiddestinos = $arrayiddestinos_unidimensional;
                    $parametros->arrayiddestinos_unidimensional = implode(',', $arrayiddestinos_unidimensional);
                }
                $parametros->total_destinos = $total_destinos;

                //filtro por vias de adquisicion(la primera que aparezca)
                $total_vias = 0;
                if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != ''
                ) {
                    foreach ($parametros->arrayviasadquisicion as $indice => $viaadquisicion) {
                        $arrayidvias_unidimensional[] = $viaadquisicion->idvia;
                        $total_vias++;
                    }
                } else {
                    $arrayVA = NomViaadquisicion::Obtener_via_adquisicion();
                    foreach ($arrayVA->data as $indice => $va) {
                        $arrayidvias_unidimensional[] = $va['idviaadquisicion'];
                        $total_vias++;
                    }
                }
                $parametros->arrayidvias = $arrayidvias_unidimensional;
                $parametros->arrayidvias_unidimensional = implode(',', $arrayidvias_unidimensional);
                $parametros->total_vias = $total_vias;

                //filtro por organos demandantes
                $iddominio = $this->global->Perfil->iddominio;
                $integrator = ZendExt_IoC::getInstance();
                $total_organos = 0;
                $arrayidorgandos_unidimensional = array();
                if (isset($parametros->arrayidorganos[0])) {
                    foreach ($parametros->arrayidorganos as $idorgano) {
                        $arrayidorgandos_unidimensional = array_merge(
                                $arrayidorgandos_unidimensional, $this->buscarEntidadesHijas($idorgano->idorgano)
                        );
                        $total_organos++;
                    }
                    $parametros->arrayidorganos = $arrayidorgandos_unidimensional;
                    $parametros->arrayidorganos_unidimensional = implode(',', $arrayidorgandos_unidimensional);
                }
                $parametros->total_organos = count($arrayidorgandos_unidimensional); //$total_organos;

                $total_centrosbalance = 0;
                if ($parametros->arrayidcentrobalance[0]->idcentrobalance != null && $parametros->arrayidcentrobalance[0]->idcentrobalance != ''
                ) {
                    foreach ($parametros->arrayidcentrobalance as $centrobalance) {
                        $arrayidcentrosbalance_unidimensional[] = $centrobalance->idcentrobalance;
                        $total_centrosbalance++;
                    }
                    $parametros->arrayidcentrosbalance_unidimensional = implode(
                            ',', $arrayidcentrosbalance_unidimensional
                    );
                }
                $parametros->totalcentrobalance = $total_centrosbalance;

                //filtro por planes
                $total = 0;
                if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != '') {
                    foreach ($parametros->arrayplanes as $plan) {
                        $parametros->idplan = $plan->idplan;
                        $nombreplan = $plan->denominacion;
                        $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                        $cuerporeporte .= ' 	<td colspan="16"><strong>' . $nombreplan . '</strong></td>';
                        $cuerporeporte .= ' </tr>';
                        $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                        $cuerporeporte .= $arraydatos['cuerporeporte'];
                        $total = $total + $arraydatos['subtotal'];
                    }
                } else {
                    $arrayplanesexistentes = DatPlanificacion::obtenerPlanesPorEjercicio(
                                    $parametros->idejercicio, $parametros->denoclasifplanrep
                    );
                    if (isset($arrayplanesexistentes[0]['idmodelo'])) {
                        foreach ($arrayplanesexistentes as $key => $plan) {
                            $parametros->idplan = $plan['idmodelo'];
                            $nombreplan = $plan['denominacion'];
                            $cuerporeporte .= ' <tr style="text-align:CENTER;">';
                            $cuerporeporte .= ' 	<td colspan="' . $parametros->anchocolspan . '"><strong>'
                                    . $nombreplan . '</strong></td>';
                            $cuerporeporte .= ' </tr>';
                            $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                            $cuerporeporte .= $arraydatos['cuerporeporte'];
                            $total = $total + $arraydatos['subtotal'];
                        }
                    }
                }

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

    public function genererReporteBalance($parametros) {

        switch ($parametros->formatoreporte) {
            case 1:
                $cuerporeporte = $this->configurarHojaReporte($parametros);
                $totalcolumnas = 16;
                $porcientoxcolumna = 100 / $totalcolumnas;

                $parametros->anchocolspan = $totalcolumnas;

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>DATOS DEL BALANCE MATERIAL<strong></td></tr>';
                $cuerporeporte .= "</table>";

                $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                $cuerporeporte .= $arraydatos['cuerporeporte'];
                $total = $arraydatos['subtotal'];
                if ($parametros->idreporte != 6) {
                    //calculando y mostrando el total
                    $cuerporeporte .= ' <tr style="text-align:LEFT;background-color:#BBBBBB;">';
                    $cuerporeporte
                            .=
                            ' 	<td colspan="' . $parametros->anchocolspan . '"><strong>TOTAL: ' . $total . '<strong></td>';
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
                $porcientoxcolumna = 100 / $totalcolumnas;

                $parametros->anchocolspan = $totalcolumnas;

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="50%"  cellpadding="0" cellspacing="0" style="margin-top:1cm;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>RESUMEN DE AJUSTES AL PLAN<strong></td></tr>';
                $cuerporeporte .= "</table>";

                $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
                $cuerporeporte .= $arraydatos['cuerporeporte'];
//                
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
                $porcientoxcolumna = 100 / $totalcolumnas;

                $parametros->anchocolspan = $totalcolumnas;

                //creando el titulo del reporte
                $cuerporeporte .= '<table border="0" width="100%"  cellpadding="0" cellspacing="0" style="margin-top:1cm;">';
                $cuerporeporte .= '<tr style="text-align:CENTER;"><td><strong>RESUMEN POR DIFERENCIA DE PRECIO<strong></td></tr>';
                $cuerporeporte .= "</table>";

                $arraydatos = $this->obtenerCuerpoReporteIndicadores($parametros);
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
        if ($parametros->arraytipogasto[0]->idtipogasto != null && $parametros->arraytipogasto[0]->idtipogasto != '') {
            foreach ($parametros->arraytipogasto as $tipogasto) {
                if ($tipogasto->idtipogasto == 1) {
                    $arrayunidimensional_uritipogasto[] = 'gastoscorriente';
                } else {
                    $arrayunidimensional_uritipogasto[] = 'gastoscapital';
                }
            }
            $parametros->arrayunidimensional_uritipogasto = implode("','", $arrayunidimensional_uritipogasto);
            $arrayplanesxejerc = DatPlanificacion::obtenerPlanesPorEjercicioTipoGasto($parametros);
        } else {
            $arrayplanesxejerc = DatPlanificacion::obtenerPlanesPorEjercicio(
                            $parametros->idejercicio, $parametros->denclasificplan
            );
        }
        return $arrayplanesxejerc;
    }

    public function obtenerPlanesPorEjercicioReporte_3($parametros) {
        if ($parametros->arraytipogasto[0]->idtipogasto != null && $parametros->arraytipogasto[0]->idtipogasto != '') {
            foreach ($parametros->arraytipogasto as $tipogasto) {
                if ($tipogasto->idtipogasto == 1) {
                    $arrayunidimensional_uritipogasto[] = 'gastoscorriente';
                } else {
                    $arrayunidimensional_uritipogasto[] = 'gastoscapital';
                }
            }
            $parametros->arrayunidimensional_uritipogasto = implode("','", $arrayunidimensional_uritipogasto);
            $arrayplanesxejerc = DatPlanificacion::obtenerPlanesPorEjercicioTipoGastoReporte_3($parametros);
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
                    $arrayidorgandos_unidimensional[] = $idorgano->idorgano;
                }
            } else {
                $arrayidorgandos_unidimensional[] = $parametros->entidad;
                $arrayentidades = $this->integrator->metadatos->DameEstructurasinChecked($parametros->entidad);
                if (isset($arrayentidades[0]['id'])) {
                    foreach ($arrayentidades as $entidad) {
                        $arrayidorgandos_unidimensional[] = $entidad['id'];
                    }
                }
            }
            $parametros->arrayidorganos = $arrayidorgandos_unidimensional;
            $parametros->arrayidorganos_unidimensional = implode(',', $arrayidorgandos_unidimensional);

            //filtro por vias de adquisicion
            if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != ''
            ) {
                $totalVA = count($parametros->arrayviasadquisicion);
                $total_vias = 0;
                foreach ($parametros->arrayviasadquisicion as $indice => $viaadquisicion) {
                    $idvia = $viaadquisicion->idvia;
                    $arrayidvias_unidimensional[] = $viaadquisicion->idvia;
                    $total_vias++;
                }
                $parametros->total_vias = $total_vias;
            } else {
                $arrayVA = NomViaadquisicion::Obtener_via_adquisicion();
                $totalVA = count($arrayVA->data);
                $total_vias = 0;
                foreach ($arrayVA->data as $indice => $va) {
                    $idvia = $va['idviaadquisicion'];
                    $arrayidvias_unidimensional[] = $va['idviaadquisicion'];
                    $total_vias++;
                }
                $parametros->total_vias = $total_vias;
            }
            $parametros->arrayidvias = $arrayidvias_unidimensional;
            $parametros->arrayidvias_unidimensional = implode(',', $arrayidvias_unidimensional);

            //filtro por planes
            $total = 0;
            if ($parametros->arrayplanes[0]->idplan != null && $parametros->arrayplanes[0]->idplan != '') {
                foreach ($parametros->arrayplanes as $plan) {
                    $arrayidplanes_unidimensional = $plan->idplan;

                }
            } else {
                $arrayplanesexistentes = DatPlanificacion::obtenerPlanesPorEjercicio($parametros->idejercicio);

                if (isset($arrayplanesexistentes[0]['idmodelo'])) {
                    foreach ($arrayplanesexistentes as $key => $plan) {
                        $arrayidplanes_unidimensional = $plan['idmodelo'];

                    }
                }
            }
            $parametros->arrayidplanes = $arrayidplanes_unidimensional;
            $parametros->arrayidplanes_unidimensional = implode(',', $arrayidplanes_unidimensional);


            $arrayindicadores = DatPlanificacion::obtenerIndicadoresReporteResumenPorViaAdquisicion($parametros);
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
        $altohojainicial = $alto - 2;
        $anchohoja = $ancho - 2;
        $anchohojainicial = $ancho - 2;

        $orientacionhoja = "portrait";
        if ($parametros->posicionhoja == 2) {
            $orientacionhoja = "landscape";
            $altohoja = $ancho - 2;
            $anchohoja = $alto - 2;
            $temp = $ancho;
            $ancho = $alto;
            $alto = $temp;
        }


        $cuerporeporte
                = "<style type='text/css'>
                 @media all {body{display: block; background: none no-repeat scroll 100% 100% #666666;}}
                 @media print {*{visibility: visible;  padding: 0 !important; } div{ top:0; right:0; bottom:0; left:0; #AP{margin-top: 1cm;}}}
                 
				 @page{height:" . $alto . "cm;width:" . $ancho . "cm;size:" . $orientacionhoja . ";}
				 </style>";

        $cuerporeporte .= "<div style='margin:auto;width:"
                . $ancho . "cm;height:auto;background-color:white;padding:1cm 0.5cm 1cm 0.5cm;'>";
        $cuerporeporte .= "<div style='width:100%;'>";


        return $cuerporeporte;
    }

    public function obtenerCuerpoReporteIndicadores($parametros) {
        $cuerporeporteindicadores = '';
        $subtotal = 0;

        switch ($parametros->idreporte) {
            case 1:
                $arrayindicadores = DatPlanificacion::obtenerIndicadoresReporteResumenPorViaAdquisicion($parametros);
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
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['cantidad'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['importe'] . '</td>';

                            //escribiendo valores en las columnas segun la via de adquisicion
                            $idviaadquisicion = $indicador['idviaadquisicion'];
                            $posicion_idvia = $parametros->indices_posicion_vias[$idviaadquisicion];
                            for ($i = 0; $i < $posicion_idvia; $i++) {
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['cantidad'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['importe'] . '</td>';

                            for ($i = $posicion_idvia + 1; $i < $parametros->total_vias; $i++) {
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' </tr>';
                        }

                        //calculando el subtotal por importe o valor
                        $subtotal = $subtotal + $indicador['importe'];
                    }
                }
                break;
            case 2:
                $arrayindicadores = DatPlanificacion::obtenerIndicadoresReporteResumenComparativoPlanPorConceptos(
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
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['cantidad'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['importe'] . '</td>';

                            //escribiendo valores en las columnas segun la via de adquisicion
                            $idsector = $indicador['idsector'];
                            $posicion_idsector = $parametros->indices_posicion_sectores[$idsector];
                            for ($i = 0; $i < $posicion_idsector; $i++) {
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['cantidad'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['importe'] . '</td>';

                            for ($i = $posicion_idsector + 1; $i < $parametros->total_sectores; $i++) {
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' </tr>';
                        }

                        //calculando el subtotal por importe o valor
                        $subtotal = $subtotal + $indicador['importe'];
                    }
                }
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
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['codigo'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['nombreindicador'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['nombreum'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['precio'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['cantidad'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['importe'] . '</td>';

                            //escribiendo valores en las columnas segun la via de adquisicion
                            $idoace = $indicador['idoace'];
                            $posicion_idoace = $parametros->indices_posicion_oace[$idoace];
                            for ($i = 0; $i < $posicion_idoace; $i++) {
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['cantidad'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" >'
                                    . $indicador['importe'] . '</td>';
                            for ($i = $posicion_idoace + 1; $i < $parametros->total_oace; $i++) {
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                                $cuerporeporteindicadores .= ' 	<td width="' . ($porcientoxcolumna / 2) . '%" style="text-align:CENTER;">-</td>';
                            }
                            $cuerporeporteindicadores .= ' </tr>';
                        }

                        //calculando el subtotal por importe o valor
                        $subtotal = $subtotal + $indicador['importe'];
                    }
                }
                break;
            /*
             * SI POR CASUALIDAD TE MANDAN A TRABAJAR EN ESTE REPORTE POR FAVOR CONTACTE CON ESTE USUARIO
             * ODURAN   ELLA TIENE LA SOLUCION A ESE PROBLEMA
             */
            case 6:
                //print_r('aaa');die;
                if (!(bool) $parametros->balancear) {
                    if ($parametros->comportamiento != 2) {

                        //obteniendo la cadena de iddatosnomenclador de los cb a filtrar
                        //dependiendo de la seleccion o de la entidad logueada
                        if ($parametros->idcentrosb[0]->idcentrobalance != null) {
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
                        $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador($idcentrosb);

                        foreach ($entidaddatosnom as $p => $s) {
                            $entidaddatosnom[$p]['identidaddatosnomenclador'] = $s['identidaddatosnomenclador'];
                            $paraobtplanes[] = $s['identidaddatosnomenclador'];
                            $idebtdatnompatodas[$p] = $s['identidaddatosnomenclador'];
                            //$entidaddatosnom[$p]['denominacion'] = $parametros->nombresCB[$p]['denominacion'];
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
                            $cuerporeporteindicadores = $cuerporeporteindicadores . self::obtenerEntidadesHijosPlanesIndicadoresDelReporteBm($parametros);
                            if ($parametros->controladorcb == 2) {
                                $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                                $cuerporeporteindicadores
                                        .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE TOTAL DEL CENTRO DE BALANCE: ' . number_format(
                                                $parametros->importetotaldelcb, '3', '.', ','
                                        ) . '</td>';
                            }
                            $parametros->importetotaldelreportecb = $parametros->importetotaldelreportecb + $parametros->importetotaldelcb;
                        }
                        $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                        $cuerporeporteindicadores
                                .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE TOTAL: ' . number_format(
                                        $parametros->importetotaldelreportecb, '3', '.', ','
                                ) . '</td>';
                    } else {
                        $cuerporeporteindicadores = $cuerporeporteindicadores . self::obtenerEntidadesHijosPlanesIndicadoresDelReporteBm($parametros);
                    }
                } else {

                    foreach ($parametros->idcentrosb as $p => $s) {
                        $idcentrosb[$p] = $s->idcentrobalance;
                    }
                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador($idcentrosb);

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
                        $datosentidad = $parametros->integ->metadatos->DameEstructura($parametros->identidad);
                        $parametros->k->denominacion = $datosentidad[0]->denominacion;
                        $parametros->importetotalentidad = 0;
                        foreach ($model as $key => $k) {
                            $parametros->idmodelo = $k['idmodelo'];
                            $parametros->denominacionplan = $k['denominacion'];

                            $totalind = DatAjusteexistenciacb::contarIndicadoresTotalReporteCB($parametros);

                            $cantRegistro = 13000;
                            if ($totalind <= 13000)
                                $cantPaginas = 1;
                            else {
                                $cantPaginas = (int) ($totalind / $cantRegistro);
                                if (fmod($totalind, $cantRegistro) > 0)
                                    $cantPaginas++;
                            }
                            $start = 0;
                            $parametros->limit = $cantRegistro;
                            //$cantPaginas=1;
                            $parametros->importeplanentidad = 0;
                            for ($i = 1; $i <= $cantPaginas; $i++) {
                                $parametros->iteracion = $i;
                                if ($i == $cantPaginas)
                                    $parametros->iteracionF = 5;
                                $parametros->start = $start;
                                $parametros->indicad = DatAjusteexistenciacb::obtenerDatosDelReporteCBBalancear($parametros);

                                $start += $cantRegistro;

                                if ($parametros->indicad[0] != null) {
                                    $cont = 2;
                                    $cuerporeporteindicadores .=self::pintarDatosReporteBalance($parametros);
                                    $parametros->indicad = null;
                                }
                            }
                        }
                        if ($cont == 2) {
                            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                            $cuerporeporteindicadores
                                    .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE TOTAL DEL CENTRO DE BALANCE: ' . number_format(
                                            $parametros->importetotalentidad, '3', '.', ','
                                    ) . '</td>';
                        }
                        $parametros->importetotal = $parametros->importetotal + $parametros->importetotalentidad;
                    }
                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                    $cuerporeporteindicadores
                            .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE TOTAL: ' . number_format(
                                    $parametros->importetotal, '3', '.', ','
                            ) . '</td>';

                }

                break;
            case 5:
                $arrayindicadores = DatPlanificacion::obtenerIndicadoresReporteDemandaPlanInversiones($parametros);
                if (isset($arrayindicadores[0]['idindicador'])) {
                    foreach ($arrayindicadores as $posicionind => $indicador) {
                        $idindicador = $indicador['idindicador'];
                        $idviaadquisicion = $indicador['idviaadquisicion'];
                        $precio = $indicador['precio'];

                        if ($parametros->mostrarindicadores == 'true') {
                            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;">';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['organodemandante'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['codigo'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['numeropieza'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['nombreindicador'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['nombreum'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['precio'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['centrobalance'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['cantidad'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['importemn'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['importefs'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['importecont'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['importetotal'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['viaadquisicion'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['organosatisface'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['sectorrama'] . '</td>';
                            $cuerporeporteindicadores .= ' 	<td>' . $indicador['destino'] . '</td>';
                            $cuerporeporteindicadores .= ' </tr>';
                        }
                        //calculando el subtotal por importe o valor
                        $subtotal = $subtotal + $indicador['importetotal'];
                    }
                }
                break;
            case 7:
                $cuerporeporteindicadores = $cuerporeporteindicadores . self::obtenerEntidadesHijosPlanesIndicadoresDelReporteAjuste($parametros);
                break;
            case 8:
                $cuerporeporteindicadores = $cuerporeporteindicadores . self::obtenerEntidadesHijosIndicadoresDelReporteDiferenciaPrecio($parametros);
                break;
        }


        $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';

        $cuerporeporteindicadores .= ' </tr>';

        $arraydatos['subtotal'] = $subtotal;
        $arraydatos['cuerporeporte'] = $cuerporeporteindicadores;
        return $arraydatos;
    }

    public function obtenerEntidadesHijosPlanesIndicadoresDelReporteAjuste($parametros) {

        //idvia es donde viene el id entidad
        $total_vias = 0;
        if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != ''
        ) {
            foreach ($parametros->arrayviasadquisicion as $indice => $viaadquisicion) {
                $arrayidvias_unidimensional[] = $viaadquisicion->idvia;
                $total_vias++;
            }
        }
        $parametros->arrayidvias = $arrayidvias_unidimensional;
        $parametros->total_vias = $total_vias;

        if ($parametros->idorgansodem[0]->idvia != null) {
            foreach ($parametros->idorgansodem as $key => $k) {
                $parametros->k = $k;
                $parametros->hijosentidad = self::buscarEntidadesHijas($parametros->k->idvia, $parametros->integ);
                array_push($parametros->hijosentidad, $parametros->k->idvia);
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
                    foreach ($model as $pos => $value) {
                        $parametros->idplan = $value['idmodelo'];
                        $parametros->denominacionplan = $value['denominacion'];
                        // Ahora viene el metodo q devuelve los datos a pintar...
                        $parametros->datos[$pos] = DatPlanificacion::obtImportesIniFinAjuste($parametros);
                        $parametros->datos[$pos]['denomplan'] = $value['denominacion'];
                    }
                    //aqui va el metodo de pintar
                    $cuerporeporteindicadores .=self::pintarDatosAjustePlan($parametros);
                }
            }
        } elseif ($parametros->esrector == 'true') {

            $arrayorganosdemandantes = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            if (isset($arrayorganosdemandantes[0])) {
                $arrayorganosdemandantes = $parametros->integ->metadatos->DameHijosEstructura(
                        $arrayorganosdemandantes[0]['identidad']
                );
            }
            foreach ($arrayorganosdemandantes as $key => $k) {
                $parametros->k = $k;
                $parametros->k->idvia = $parametros->k->idestructura;
                $parametros->hijosentidad = self::buscarEntidadesHijas($parametros->k->idvia, $parametros->integ);
                array_push($parametros->hijosentidad, $parametros->k->idvia);
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
                    foreach ($model as $pos => $value) {
                        $parametros->idplan = $value['idmodelo'];
                        $parametros->denominacionplan = $value['denominacion'];
                        // Ahora viene el metodo q devuelve los datos a pintar...
                        $parametros->datos[$pos] = DatPlanificacion::obtImportesIniFinAjuste($parametros);
                        $parametros->datos[$pos]['denomplan'] = $value['denominacion'];
                    }

                    $cuerporeporteindicadores .=self::pintarDatosAjustePlan($parametros);
                }
            }
        } else {
            $parametros->k->idvia = $parametros->identidadlog;
            $parametros->k->denominacion = $parametros->denominacionlog;
            $parametros->hijosentidad = self::buscarEntidadesHijas($parametros->k->idvia, $parametros->integ);
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
                foreach ($model as $pos => $value) {
                    $parametros->idplan = $value['idmodelo'];
                    $parametros->denominacionplan = $value['denominacion'];
                    // Ahora viene el metodo q devuelve los datos a pintar...
                    $parametros->datos[$pos] = DatPlanificacion::obtImportesIniFinAjuste($parametros);
                    $parametros->datos[$pos]['denomplan'] = $value['denominacion'];
                }

                $cuerporeporteindicadores .=self::pintarDatosAjustePlan($parametros);
            }
        }
        return $cuerporeporteindicadores;
    }

    public function obtenerEntidadesHijosIndicadoresDelReporteDiferenciaPrecio($parametros) {

        if ($parametros->arrayoace[0]->idoace != null && $parametros->arrayoace[0]->idoace != '') {

            foreach ($parametros->arrayoace as $indice => $oace) {
                $idoace = $oace->idoace;
                $arrayidoace_unidimensional[] = $idoace;
            }
            $parametros->arrayidoace = $arrayidoace_unidimensional;
            $parametros->arrayidoace = implode(',', $arrayidoace_unidimensional);
        }

        //idvia es donde viene el id entidad
        if ($parametros->idorgansodem[0]->idvia != null) {
            $parametros->count = 0;
            foreach ($parametros->idorgansodem as $key => $k) {
                $parametros->count += 1;
                $parametros->k = $k;
                $parametros->hijosentidad = self::buscarEntidadesHijas($parametros->k->idvia, $parametros->integ);
                array_push($parametros->hijosentidad, $parametros->k->idvia);

                if ($parametros->idcentrosb[0]->idcentrobalance != null) {

                    foreach ($parametros->idcentrosb as $p => $s) {
                        $idcentrosb[$p] = $s->idcentrobalance;
                    }

                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador($idcentrosb);

                    foreach ($entidaddatosnom as $p => $s) {
                        $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                        $identidades[$p] = $s['identidad'];
                    }

                    $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los idcentrobalance para comparar con p.idcentrobalance
                } else {
                    if ($parametros->esrector != 'true') {
                        $idcentrosb[] = $parametros->identidadlog;
                    } else {
                        $arrcb = DatEntidaddatosnomenclador::getCB();
                        foreach ($arrcb as $p => $s) {
                            $idcentrosb[$p] = $s['identidad'];
                        }
                    }
                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador($idcentrosb);
                    foreach ($entidaddatosnom as $p => $s) {
                        $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                        $identidades[$p] = $s['identidad'];
                    }
                    $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los idcentrobalance para comparar con p.idcentrobalance
                }
                if ($key == 0) {
                    $parametros->iteracion = 1;
                } else {
                    $parametros->iteracion = 0;
                }
                if ($parametros->hijosentidad[0] != null && $parametros->idcentrosb[0] != null) {

                    // se buscan los planes
                    if ($parametros->idmodelos[0]->idplan != null) {
                        foreach ($parametros->idmodelos as $p => $k) {
                            $parametros->arrayidplan[$p] = $k->idplan;
                        }
                    }

                    $parametros->datosActual = DatPlanificacion::obtIndicadoresDiferenciaPrecio($parametros, $parametros->idejercicio);
                    $parametros->datosAnterior = DatPlanificacion::obtIndicadoresDiferenciaPrecio($parametros, $parametros->idejercicioante);

                    //aqui va el metodo de pintar 
                    $cuerporeporteindicadores .=self::pintarDatosDiferenciaPrecio($parametros);
                }
            }
        } else if ($parametros->esrector == 'true') {

            $arrayorganosdemandantes = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            if (isset($arrayorganosdemandantes[0])) {
                $arrayorganosdemandantes = $parametros->integ->metadatos->DameHijosEstructura(
                        $arrayorganosdemandantes[0]['identidad']
                );
            }
            $parametros->count = 0;
            foreach ($arrayorganosdemandantes as $key => $k) {
                $parametros->count += 1;
                $parametros->k = $k;
                $parametros->k->idvia = $parametros->k->idestructura;
                $parametros->hijosentidad = self::buscarEntidadesHijas($parametros->k->idvia, $parametros->integ);
                array_push($parametros->hijosentidad, $parametros->k->idvia);

                if ($parametros->idcentrosb[0]->idcentrobalance != null) {

                    foreach ($parametros->idcentrosb as $p => $s) {
                        $idcentrosb[$p] = $s->idcentrobalance;
                    }

                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador($idcentrosb);

                    foreach ($entidaddatosnom as $p => $s) {
                        $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                        $identidades[$p] = $s['identidad'];
                    }

                    $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los idcentrobalance para comparar con p.idcentrobalance
                } else {
                    if ($parametros->esrector != 'true') {
                        $idcentrosb[] = $parametros->identidadlog;
                    } else {
                        $arrcb = DatEntidaddatosnomenclador::getCB();
                        foreach ($arrcb as $p => $s) {
                            $idcentrosb[$p] = $s['identidad'];
                        }
                    }
                    $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador($idcentrosb);
                    foreach ($entidaddatosnom as $p => $s) {
                        $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                        $identidades[$p] = $s['identidad'];
                    }
                    $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los idcentrobalance para comparar con p.idcentrobalance
                }
                if ($key == 0) {
                    $parametros->iteracion = 1;
                } else {
                    $parametros->iteracion = 0;
                }
                if ($parametros->hijosentidad[0] != null && $parametros->idcentrosb[0] != null) {
                    // Ahora viene el metodo q devuelve los datos a pintar...
                    $parametros->datosActual = DatPlanificacion::obtIndicadoresDiferenciaPrecio($parametros, $parametros->idejercicio);
                    $parametros->datosAnterior = DatPlanificacion::obtIndicadoresDiferenciaPrecio($parametros, $parametros->idejercicioante);

                    //aqui va el metodo de pintar      

                    $cuerporeporteindicadores .=self::pintarDatosDiferenciaPrecio($parametros);
                }
            }
        } else {
            $parametros->k->idvia = $parametros->identidadlog;
            $parametros->k->denominacion = $parametros->denominacionlog;
            $parametros->hijosentidad = self::buscarEntidadesHijas($parametros->k->idvia, $parametros->integ);
            array_push($parametros->hijosentidad, $parametros->k->idvia);

            if ($parametros->idcentrosb[0]->idcentrobalance != null) {

                foreach ($parametros->idcentrosb as $p => $s) {
                    $idcentrosb[$p] = $s->idcentrobalance;
                }

                $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador($idcentrosb);

                foreach ($entidaddatosnom as $p => $s) {
                    $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                    $identidades[$p] = $s['identidad'];
                }

                $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los idcentrobalance para comparar con p.idcentrobalance
            } else {
                if ($parametros->esrector != 'true') {
                    $idcentrosb[] = $parametros->identidadlog;
                } else {
                    $arrcb = DatEntidaddatosnomenclador::getCB();
                    foreach ($arrcb as $p => $s) {
                        $idcentrosb[$p] = $s['identidad'];
                    }
                }
                $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador($idcentrosb);
                foreach ($entidaddatosnom as $p => $s) {
                    $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
                    $identidades[$p] = $s['identidad'];
                }
                $parametros->idcentrosb = $entidaddatosnom; //en este array estan contenidos los idcentrobalance para comparar con p.idcentrobalance
            }

            $parametros->iteracion = 1;

            if ($parametros->hijosentidad[0] != null && $parametros->idcentrosb[0] != null) {
                // Ahora viene el metodo q devuelve los datos a pintar...
                $parametros->datosActual = DatPlanificacion::obtIndicadoresDiferenciaPrecio($parametros, $parametros->idejercicio);
                $parametros->datosAnterior = DatPlanificacion::obtIndicadoresDiferenciaPrecio($parametros, $parametros->idejercicioante);

                //aqui va el metodo de pintar      

                $cuerporeporteindicadores .=self::pintarDatosDiferenciaPrecio($parametros);
            }
        }







        return $cuerporeporteindicadores;
    }

    public function obtenerEntidadesHijosPlanesIndicadoresDelReporteBm($parametros) {

        //obteniendo la cadena de identidades de los od a filtrar
        //dependiendo de la seleccion o de la entidad logueada
        $espcompcb = 0;
        //idvia es donde biene el id entidad disculpen el nombre
        $parametros->importetotalindicadores = 0;
        if ($parametros->idorgansodem[0]->idvia != null) {//aqui rector
            foreach ($parametros->idorgansodem as $key => $k) {
                $parametros->k = $k;
                $cuerporeporteindicadores = $cuerporeporteindicadores . self::obtenerHijosPlanesIndicadores($parametros);
            }
            if ($parametros->comportamiento == 2) {
                $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                $cuerporeporteindicadores
                        .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE TOTAL: ' . number_format(
                                $parametros->importetotalindicadores, '3', '.', ','
                        ) . '</td>';
            }
        } else {
            if ($parametros->esrector == 'true') {

                $parametros->importetotalindicadores = 0;
                $arrayorganosdemandantes = DatEntidaddatosnomenclador::obtenerEntidadRectora();
                if (isset($arrayorganosdemandantes[0])) {
                    $arrayorganosdemandantes = $parametros->integ->metadatos->DameHijosEstructura(
                            $arrayorganosdemandantes[0]['identidad']
                    );
                }

                foreach ($arrayorganosdemandantes as $key => $k) {
                    $parametros->k = $k;
                    $parametros->k->idvia = $parametros->k->idestructura;
                    $cuerporeporteindicadores = $cuerporeporteindicadores . self::obtenerHijosPlanesIndicadores($parametros);
                }

                if ($parametros->comportamiento == 2) {
                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                    $cuerporeporteindicadores
                            .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE TOTAL: ' . number_format(
                                    $parametros->importetotalindicadores, '3', '.', ','
                            ) . '</td>';
                }
            } else {
                $espcompcb = 2;
                if ($parametros->comportamiento == 2) {
                    $parametros->importetotalindicadores = 0;

                    $parametros->k->idvia = $parametros->identidadlog;
                    $parametros->k->denominacion = $parametros->denominacionlog;

                    $cuerporeporteindicadores = $cuerporeporteindicadores . self::obtenerHijosPlanesIndicadores($parametros);
                    if ($parametros->comportamiento == 2) {
                        $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                        $cuerporeporteindicadores
                                .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE TOTAL: ' . number_format(
                                        $parametros->importetotalindicadores, '3', '.', ','
                                ) . '</td>';
                    }
                } else {
                    foreach ($parametros->entidaddatosnom as $key => $k) {
                        $entidaddatosn[] = $parametros->entidaddatosnom[$key]['identidaddatosnomenclador'];
                    }

                    $ident = DatPlanificacion::obtenerEntidadesQueDemandanByIdCentrosB($entidaddatosn);

                    $datos = array();
                    if (isset($ident[0])) {
                        $arrayEntidades = array();
                        foreach ($ident as $key => $k) {
                            $arrayEntidades[] = $k['identidad'];
                        }
                        $entidadescad = implode(',', $arrayEntidades);
                        $dat = DatAjusteexistenciaod::listarEntidades($entidadescad);
                    }
                    foreach ($dat as $key => $k) {
                        $parametros->k->idvia = $k['id'];
                        $parametros->k->denominacion = $k['text'];
                        $cuerporeporteindicadores = $cuerporeporteindicadores . self::obtenerHijosPlanesIndicadores($parametros);
                    }
                }
            }
        }
        return $cuerporeporteindicadores;
    }

    public function obtenerHijosPlanesIndicadores($parametros) {
        $parametros->hijosentidad = self::buscarEntidadesHijas($parametros->k->idvia, $parametros->integ);
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
        $iddatonomenclador = DatEntidaddatosnomenclador::getIdentidaddatosnomenclador($parametros->k->idvia);
        $parametros->identidaddatosnom = $iddatonomenclador[0]['identidaddatosnomenclador'];
        $parametros->importetotalentidad = 0;
        if ($parametros->hijosentidad[0] != null && $model[0] != null) {
            $parametros->hijosentidad = implode(',', $parametros->hijosentidad);
            $controlar = 0;
            foreach ($model as $key => $value) {
                $parametros->idplan = $value['idmodelo'];
                $parametros->denominacionplan = $value['denominacion'];
                $totalind = DatAjusteexistenciaod::contarIndicadoresTotalReporteOD($parametros);

                $cantRegistro = 13000;
                if ($totalind <= 13000)
                    $cantPaginas = 1;
                else {
                    $cantPaginas = (int) ($totalind / $cantRegistro);
                    if (fmod($totalind, $cantRegistro) > 0)
                        $cantPaginas++;
                }
                $start = 0;
                $parametros->limit = $cantRegistro;

                $parametros->importeplanentidad = 0;
                for ($i = 1; $i <= $cantPaginas; $i++) {
                    $parametros->iteracion = $i;
                    if ($i == $cantPaginas)
                        $parametros->iteracionF = 5;
                    $parametros->start = $start;
                    $parametros->indicad = DatAjusteexistenciaod::obtenerDatosDelReporteOD($parametros);
                  ;
                    $start += $cantRegistro;

                    if ($parametros->indicad[0] != null) {

                        $controlar = 2;
                        $cuerporeporteindicadores .=self::pintarDatosReporteBalance($parametros);
                        $parametros->indicad = null;
                    }
                }

          }
            if ($controlar == 2) {
                if ($parametros->comportamiento == 2) {
                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                    $cuerporeporteindicadores
                            .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE ENTIDAD: ' . number_format(
                                    $parametros->importetotalentidad, '3', '.', ','
                            ) . '</td>';
                } else {
                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
                    $cuerporeporteindicadores
                            .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE DE LA ENTIDAD PARA EL CENTRO DE BALANCE: ' . number_format(
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
                    .= '<table border="1" bordercolor="black"  width="100%" align="center" cellpadding="0" cellspacing="0" style="margin-top:1cm;table-layout:fixed;">
					
                                                                       <thead>
                                                                       
                                                                       <td colspan="' . $parametros->anchocolspan . '" > ' . $CB . '&nbsp&nbsp&nbsp ENTIDAD:&nbsp ' . $parametros->k->denominacion .
                    '&nbsp;&nbsp;&nbsp PLAN:&nbsp;&nbsp;&nbsp ' . $parametros->denominacionplan . '</td>
                                                                  
									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td  width="' . 100 / 16 . '%">C&oacute;digo</td>
										<td  width="' . 100 / 15 . '%">No.Pieza</td>
										<td  width="' . 100 / 9 . '%">Denominaci&oacute;n</td>
										<td  width="' . 100 / 11 . '%">Centro de Balance</td>
										<td   width="' . 100 / 17 . '%">Necesidad</td>
										<td   width="' . 100 / 18 . '%">CTE</td>
										<td   width="' . 100 / 17 . '%">Demanda</td>
                                                                                <td   width="' . 100 / 19 . '%">Precio</td>
                                                                                <td   width="' . 100 / 19 . '%">Importe</td>
										<td   width="' . 100 / 20 . '%">Importe mlc</td>
										<td   width="' . 100 / 17 . '%">Importe flete</td>
										<td   width="' . 100 / 14 . '%">Importe contingencia</td>
                                                                                <td   width="' . 100 / 19 . '%">Importe fila</td>
										<td   width="' . 100 / 13 . '%">V&iacute;a de Adquisici&oacuten</td>
										<td   width="' . 100 / 12 . '%">&Oacute;rgano que Satisface</td>
										<td   width="' . 100 / 20 . '%">Aprobado</td>
									</tr>
								  </thead>';
        }

        if (isset($parametros->indicad[0]['idindicador'])) {
            foreach ($parametros->indicad as $posicionind => $indicador) {

                if ($parametros->mostrarindicadores == 'true') {
                    $parametros->importeplanentidad = $parametros->importeplanentidad + $indicador['importe'];

                    $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;">';
                    $cuerporeporteindicadores
                            .= ' 	<td width="' . (100 / 16) . '%" >' . $indicador['codigo'] . '</td>';
                    if ($indicador['numeropieza']) {
                        $cuerporeporteindicadores
                                .= ' 	<td width="' . (100 / 15) . '%" >' . $indicador['numeropieza'] . '</td>';
                    } else {
                        $cuerporeporteindicadores
                                .=
                                ' 	<td style="text-align:CENTER", width="' . (100 / 15) . '%" >' . "-" . '</td>';
                    }

                    $cuerporeporteindicadores
                            .= ' 	<td width="' . (100 / 9) . '%" >' . $indicador['denominacion'] . '</td>';
                    $cuerporeporteindicadores
                            .= ' 	<td width="' . (100 / 11) . '%" >' . $indicador['denominacioncb'] . '</td>';
                    $cuerporeporteindicadores .= ' 	<td width="' . (100 / 17) . '%" >' . number_format(
                                    $indicador['necesidad'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td width="' . (100 / 18) . '%" >' . number_format(
                                    $indicador['coberturatotalestimada'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td width="' . (100 / 17) . '%" >' . number_format(
                                    $indicador['demanda'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td width="' . (100 / 19) . '%" >' . number_format(
                                    $indicador['precio'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td width="' . (100 / 19) . '%" >' . number_format(
                                    $indicador['importe'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td width="' . (100 / 20) . '%" >' . number_format(
                                    $indicador['importemlc'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td width="' . (100 / 17) . '%" >' . number_format(
                                    $indicador['flete'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td width="' . (100 / 14) . '%" >' . number_format(
                                    $indicador['contingencia'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores .= ' 	<td width="' . (100 / 19) . '%" >' . number_format(
                                    $indicador['importefila'], '3', '.', ','
                            ) . '</td>';
                    $cuerporeporteindicadores
                            .= ' 	<td width="' . (100 / 13) . '%" >' . $indicador['viaadquisicion'] . '</td>';
                    if ($indicador['organosatisface']) {
                        $cuerporeporteindicadores
                                .=
                                ' 	<td width="' . (100 / 12) . '%" >' . $indicador['organosatisface'] . '</td>';
                    } else {
                        $cuerporeporteindicadores
                                .=
                                ' 	<td style="text-align:CENTER", width="' . (100 / 12) . '%" >' . "-" . '</td>';
                    }

                    if ($indicador['idaprobacion'] == 1) {
                        $cuerporeporteindicadores
                                .=
                                ' 	<td style="text-align:CENTER", width="' . (100 / 20) . '%" >' . NO . '</td>';
                    } else {
                        $cuerporeporteindicadores
                                .=
                                ' 	<td style="text-align:CENTER", width="' . (100 / 20) . '%" >' . SI . '</td>';
                    }
                    $cuerporeporteindicadores .= ' </tr>';
                }
            }
            //calculando el subtotal por importe o valor
            $subtotal = $arrayindicadores['total'];

            $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;background-color:#DDDDDD;">';
            if ($parametros->iteracionF == 5) {
                $cuerporeporteindicadores
                        .= ' 	<td colspan="' . $parametros->anchocolspan . '" >IMPORTE PLAN: ' . number_format(
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
                        .= '<table border="1" bordercolor="black"  width="50%"  cellpadding="0" cellspacing="0" style="margin-top:1cm;">
					
                                                                       <thead>
                                                                       
                                                                       <td colspan="' . $parametros->anchocolspan . '" ><strong> ' . '&nbsp&nbsp&nbsp ENTIDAD:&nbsp ' . $parametros->k->denominacion . '<strong></td>
                                                                  
									<tr style="text-align:CENTER;background-color:#BBBBBB;" >
										<td  width="' . 40 / 16 . '%"><strong>Planes<strong></td>
										<td  width="' . 40 / 15 . '%"><strong>Importe Inicial<strong></td>
										<td  width="' . 40 / 9 . '%"><strong>Importe Ajustado<strong></td>
										<td  width="' . 100 / 11 . '%"><strong>Importe Final<strong></td>										
									</tr>
								  </thead>';
            }

            foreach ($parametros->datos as $posicionind => $plan) {

                $cuerporeporteindicadores .= ' <tr style="text-align:LEFT;">';

                $cuerporeporteindicadores
                        .= ' 	<td width="' . (40 / 11) . '%" >' . $plan['denomplan'] . '</td>';

                $cuerporeporteindicadores .= ' 	<td width="' . (40 / 17) . '%" >' . number_format(
                                $plan[0]['importeincial'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores .= ' 	<td width="' . (40 / 18) . '%" >' . number_format(
                                $plan[0]['ajuste'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores .= ' 	<td width="' . (40 / 17) . '%" >' . number_format(
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
                    .= ' 	<td style="text-align:CENTER;" width="' . (40 / 11) . '%" ><strong>TOTAL:<strong></td>';

            $cuerporeporteindicadores .= ' 	<td width="' . (40 / 17) . '%" >' . number_format(
                            $importeincialTotal, '3', '.', ','
                    ) . '</td>';

            $cuerporeporteindicadores .= ' 	<td width="' . (40 / 18) . '%" >' . number_format(
                            $ajusteTotal, '3', '.', ','
                    ) . '</td>';

            $cuerporeporteindicadores .= ' 	<td width="' . (40 / 17) . '%" >' . number_format(
                            $importefinalTotal, '3', '.', ','
                    ) . '</td>';

            $cuerporeporteindicadores .= ' </tr>';
          return $cuerporeporteindicadores;
        }
    }

    public function pintarDatosDiferenciaPrecio($parametros) {

        $difercantidad = 0;
        $diferprecio = 0;
        $cuerporeporteindicadores = '';

        if ($parametros->iteracion == 1) {
            //creando la tabla con las columnas fijas
            $cuerporeporteindicadores
                    .= '              <table border="1" bordercolor="black" width="100%" cellspacing="0" cellpadding="0" style="margin-top:1cm;">
                                          <col width="74" />
                                          <col width="194" />
                                          <col width="55" />
                                          <col width="80" span="6" />
                                          <col width="133" />
                                          <col width="124" />
                                          <tr height="20">
                                             <td style="text-align:CENTER;" rowspan="3" height="91" width="74"><strong>CODIGO<strong></td>
                                             <td style="text-align:CENTER;" rowspan="3" width="194"><strong>DESCRIPCION<strong></td>
                                             <td style="text-align:CENTER;" rowspan="3" width="55"><strong>UM<strong></td>
                                             <td style="text-align:CENTER;" colspan="3" rowspan="2" width="240"><strong>A&Ntilde;O ' . $parametros->ejercicioAnterior . '<strong></td>
                                             <td style="text-align:CENTER;" colspan="3" rowspan="2" width="240"><strong>A&Ntilde;O ' . $parametros->ejercicioActual . '<strong></td>
                                             <td style="text-align:CENTER;background-color:#FFFF00;" colspan="2" rowspan="2" width="257"><strong>DIFERENCIA<strong></td>
                                             </tr>
                                             <tr height="20"> </tr>
                                             <tr height="51">
                                             <td style="text-align:CENTER;" height="51" width="80"><strong>PRECIO<strong></td>
                                             <td style="text-align:CENTER;" width="80"><strong>CANTIDAD<strong></td>
                                             <td style="text-align:CENTER;" width="80"><strong>IMPORTE<strong></td>
                                             <td style="text-align:CENTER;" width="80"><strong>PRECIO<strong></td>
                                             <td style="text-align:CENTER;" width="80"><strong>CANTIDAD<strong></td>
                                             <td style="text-align:CENTER;" width="80"><strong>IMPORTE<strong></td>
                                             <td style="text-align:CENTER;background-color:#FFFF00;" width="133"><strong>Diferencia por    cantidad<strong></td>
                                             <td style="text-align:CENTER;background-color:#FFFF00;" width="124"><strong>Diferencia por precio&nbsp;<strong></td>
                                                                                       </tr>';
        }
        $difcantidad = 0;
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
                        } else if ($parametros->datosActual[$pos]['cantidad'] > $datoant['cantidad']) {
                            //(Cantidad del ejercicio actual – Cantidad del ejercicio anterior) * Precio del ejercicio anterior /1000.
                            $parametros->datosActual[$pos]['difercantidad'] = ((($parametros->datosActual[$pos]['cantidad'] - $datoant['cantidad']) * $datoant['precio']) / 1000);
                        } else if ($parametros->datosActual[$pos]['cantidad'] < $datoant['cantidad']) {
                            //(Cantidad del ejercicio actual – Cantidad del ejercicio anterior) * Precio del ejercicio anterior /1000.
                            $parametros->datosActual[$pos]['difercantidad'] = ((($parametros->datosActual[$pos]['cantidad'] - $datoant['cantidad']) * $datoant['precio']) / 1000);
                        } else {
                            $parametros->datosActual[$pos]['difercantidad'] = 0;
                        }

                        // Obteniendo el valor de la diferencia de precio
                        if ($datoant['cantidad'] == 0) {
                            $parametros->datosActual[$pos]['diferprecio'] = 0;
                        } else {
                            //Cantidad (ejercicio actual) * (Precio (ejercicio actual) – Precio (ejercicio anterior)/1000).
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

            foreach ($parametros->datosActual as $posicionind => $indicador) {

                $cuerporeporteindicadores .= '<tr height="20">';

                $cuerporeporteindicadores
                        .= ' <td height="20" width="74">' . $indicador['codigo'] . '</td>';

                $cuerporeporteindicadores
                        .= ' <td width="194">' . $indicador['denominacion'] . '</td>';

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
                        .= ' <td style="background-color:#FFFF00;" width="133">' . number_format(
                                $indicador['difercantidad'], '3', '.', ','
                        ) . '</td>';

                $parametros->totalDifPrecio += $indicador['diferprecio'];
                $cuerporeporteindicadores
                        .= ' <td style="background-color:#FFFF00;" width="124">' . number_format(
                                $indicador['diferprecio'], '3', '.', ','
                        ) . '</td>';

                $cuerporeporteindicadores .= ' </tr>';
            }

            if (count($parametros->idorgansodem) == $parametros->count) {
                $cuerporeporteindicadores .= '<tr height="20">';

                $cuerporeporteindicadores
                        .= ' <td style="text-align:CENTER;background-color:#FFFF00;" "height="20" width="74"><strong>TOTAL<strong></td>
						<td style="background-color:#FFFF00;" width="194"> </td>
						<td style="background-color:#FFFF00;" width="55"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>
						<td style="background-color:#FFFF00;" width="80"> </td>';
                $cuerporeporteindicadores
                        .= ' <td style="background-color:#FFFF00;" width="133">' . number_format(
                                $parametros->totalDifCantidad, '3', '.', ','
                        ) . '</td>';
                $cuerporeporteindicadores
                        .= ' <td style="background-color:#FFFF00;" width="124">' . number_format(
                                $parametros->totalDifPrecio, '3', '.', ','
                        ) . '</td> </tr>';
            }
        }
        return $cuerporeporteindicadores;
    }

    public function cargarOrganosDemandantes() {
        $arraycompentidadOC = NomDatosnomenclador::getDatosNomPorUriDatosNom('rectorbalance');
        $arrayorganosdemandantes = array();
        if (isset($arraycompentidadOC[0])) {
            $idcomportamiento = $arraycompentidadOC[0]['iddatosnomenclador'];
            $integrator = ZendExt_IoC::getInstance();
            $arrayorganosdemandantes = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            if (isset($arrayorganosdemandantes[0])) {
                $arrayorganosdemandantes = $integrator->metadatos->DameHijosEstructura(
                        $arrayorganosdemandantes[0]['identidad']
                );
                $array = Array();
                 //print_r($arrayorganosdemandantes);die;
                foreach ($arrayorganosdemandantes as $key => $organodemandante) {

                    // $denominacion = $datosentidad[0]->denominacion;
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

        $arraycompentidadOC = NomDatosnomenclador::getDatosNomPorUriDatosNom('rectorbalance');
        $arrayorganosdemandantes = array();
        if (isset($arraycompentidadOC[0])) {
            $idcomportamiento = $arraycompentidadOC[0]['iddatosnomenclador'];
            $integrator = ZendExt_IoC::getInstance();
            $arrayorganosdemandantes = DatEntidaddatosnomenclador::obtenerEntidadRectora();
            if (isset($arrayorganosdemandantes[0])) {
                $arrayorganosdemandantes = $integrator->metadatos->DameHijosEstructura(
                        $arrayorganosdemandantes[0]['identidad']
                );
            }
        }
        $array = Array();
        if ($parametros['orgrecto'] == 'true') {


            if ($arrayorganosdemandantes[0] != null)
                foreach ($arrayorganosdemandantes as $key => $organodemandante) {


                    $array[$key]['id'] = $organodemandante->id;
                    $array[$key]['text'] = $organodemandante->text;
                    $array[$key]['checked'] = false;
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
        $arraycompentidadOC = NomDatosnomenclador::getDatosNomPorUriDatosNom('organoconsumidor');
        $arrayorganosdemandantes = array();
        if (isset($arraycompentidadOC[0])) {
            $idcomportamiento = $arraycompentidadOC[0]['iddatosnomenclador'];
            $integrator = ZendExt_IoC::getInstance();
            $arrayorganosdemandantes = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcomportamiento);
        }
        return $arrayorganosdemandantes;
    }

    public function buscarEntidadesHijas($identidad) {

        $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad);

        $entidades_hijas = array();

        foreach ($dominios as $entidad_hija) {

            if ($entidad_hija->leaf == true) {
                $entidades_hijas[] = $entidad_hija->idestructura;
            } else {

                $entidades_hijas = array_merge(
                        $entidades_hijas, self::buscarEntidadesHijas($entidad_hija->idestructura)
                );
            }
        }

        return $entidades_hijas;
    }

    //LISTA LOS CENTROS DE BALANCE EN DEPENDENCIA DE LA ENTIDAD LOGUEADA
    //SE USA SOLO PARA LA RECUPERACION DE BALANCE MATERIAL
    public function listarCentrosBalanceRecuperacion($rector, $cb, $od, $identidad) {

        $i = 0;
        if ($rector == 'true') {
            $centbal = DatEntidaddatosnomenclador::getCB();
            if ($centbal) {
                foreach ($centbal as $k => $valor) {
                    $dat[$i]['identidad'] = $valor['identidad'];
                    $enti = $this->integrator->metadatos->DameEstructura($valor['identidad']);
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
                $enti = $this->integrator->metadatos->DameEstructura($identidad);
                $datos[0]['denominacion'] = $enti[0]->denominacion;
            } else {
                if ($cb && $od) {
                    $datos[0]['identidad'] = $identidad;
                    $enti = $this->integrator->metadatos->DameEstructura($identidad);
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
            if ($parametros['identidad'][0] != null || ($parametros['orgrecto'] != 'true')) {

                if ($parametros['identidad'][0] == null)
                    $identidades[] = $parametros['identidadlog'];
                else
                    $identidades = explode(",", $parametros['identidad']);
                $entidaddatosnom = "";

                $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador($identidades);

                foreach ($entidaddatosnom as $key => $k) {
                    $entidaddatosnom[$key] = $k['identidaddatosnomenclador'];
                }

                $parametros['identtidaddes'] = DatPlanificacion::obtenerEntidadesQueDemandanByIdCentrosB($entidaddatosnom);

                $datos = array();
                if (isset($parametros['identtidaddes'][0])) {
                    $arrayEntidades = array();
                    foreach ($parametros['identtidaddes'] as $key => $k) {
                        $arrayEntidades[] = $k['identidad'];
                    }
                    $entidadescad = implode(',', $arrayEntidades);
                    $datos = DatAjusteexistenciaod::listarEntidades($entidadescad);
                }
            } else {
                $datos = self::cargarODRecuperacionCB($parametros);
            }
        } else {
            $datos = self::cargarODRecuperacionCB($parametros);
        }
        return $datos;
    }

    public function EntidadesQueDemandanAUnCB($parametros) {
        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['identidadlog']);


        $parametros['identtidaddes'] = DatPlanificacion::obtenerEntidadesQueDemandanByIdCB(
                        $entidaddatosnom[0]['identidaddatosnomenclador']
        );

        if (isset($parametros['identtidaddes'][0])) {
            $arrayEntidades = array();
            foreach ($parametros['identtidaddes'] as $key => $k) {
                $arrayEntidades[] = $k['identidad'];
            }
        }
        return $arrayEntidades;
    }

}
