<?php

class GenerarPdfResumenInversionMUSD {

    protected $pdf;
    protected $table;
    protected $entidad;
    protected $identidad;
    protected $fechainicio;
    protected $fechafin;
    protected $confeccionadopor;
    protected $aprobadopor;
    protected $observaciones;
    protected $withArray;
    protected $alignsArray;
    protected $ejercicio;
    protected $idejercicio;
    protected $tipos;
    protected $arrayUM;
    protected $integrator;

    function __construct($parametros) {
        $this->idorganismo = $parametros['idorganismo'];
        $this->identidad = $parametros['identidad'];
        $this->idejercicioden = $parametros['idejercicioden'];
        $this->idejercicio = $parametros['idejercicio'];
        $this->aprobadopor = $parametros['aprobadopor'];
        $this->elaboradopor = $parametros['elaboradopor'];
        $this->organismoden = $parametros['organismoden'];
        $this->observacion = $parametros['observacion'];
        $this->identiDen = $parametros['identiDen'];
        $this->reporte = $parametros['reporte'];
        $this->entidadeshijas = $parametros['entidadeshijas'];
        $this->entidadesDen = $parametros['entidadesDen'];
        $this->params = $parametros;
        $this->ids = $parametros['ids'];
        $this->objinversion = new DatInversion();
        $this->objinversionModel = new InversionesModel();


        $this->pdf = new TCPDF('L', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('Resumen de Inversiones MUSD');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

// set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
        $this->pdf->SetMargins(25, 25, 25);

// set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export() {
        $this->pdf->AddPage();
        $this->createHeader();
        $this->pdf->Ln(5);
        if ($this->pdf->GetY() > 258) {
            $this->pdf->setY(265);
            $this->piedePagina();
            $this->pdf->AddPage();
        } else {
            $this->pdf->setY(265);
            $this->piedePagina();
        }
        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);

// Close and output PDF document
        ob_clean();
        $this->pdf->Output(" Resumen Inversion MUSD.pdf", 'I');
        return true;
    }

    private function createHeader() {
// set JPEG quality
        foreach ($this->ids as $ident) {
            $organismos = stripslashes($ident);
//            $entidades = implode(',', $idEntidades[0]);
            $arrayOrganismos[] = explode(',', $organismos);
        }
        if (count($arrayOrganismos[1]) > 0) {
            //$arrayOrganismos[0] estan los organismos seleccionados y en [1] las entidades seleccionadas
            $entidades = array_merge($arrayOrganismos[0], $arrayOrganismos[1]);
        } else {
            $entidades = $arrayOrganismos[0];
        }
        $arrayDeOrganismos = explode(',', $this->organismoden);
        $idEntidades = array();
        if ($this->identidad == null) {
            foreach ($arrayOrganismos[0] as $key => $ident) {
                $hijas = $this->objinversionModel->cargarEntHijas($ident, $arrayDeOrganismos[$key]); //ENTIDADES HIJAS
                if (count($hijas) > 0) {
                    $idEntidades = array_merge($idEntidades, $hijas); //toidas las entidades coninciden
                } else {
                    $idEntidades[count($idEntidades)]['identidad'] = $ident; //toidas las entidades coninciden
                    $idEntidades[count($idEntidades) - 1]['entidad'] = $arrayDeOrganismos[$key]; //toidas las entidades coninciden
                }
            }
            foreach ($idEntidades as $key => $valu) {
                $idEstr[] = $valu['identidad']; //todas las entidades del organismo
            }
        } else {
            $IDEntidades = explode(",", $this->identidad);
            foreach ($arrayOrganismos[0] as $key => $ident) {
                $idEstr = array();
                $idSeleccionadas = $this->objinversionModel->dadoArrayEntidades($ident, $arrayDeOrganismos[$key], $IDEntidades); //ENTIDADES HIJAS seleccionadas
                if (count($idSeleccionadas) > 0) {
                    $idEntidades = $idSeleccionadas;
                    foreach ($idEntidades as $key => $valu) {
                        $idEstr[] = $valu['identidad']; //todas las entidades del organismo
                    }
                }
            }
        }
        $arridEntidades = implode(",", $idEstr);
        $inversionesXentidadMUSD = $this->objinversion->listarDatosReporteResumenInverMUSD($this->idejercicio, $arridEntidades, 9900000046);
        // print_r($inversionesXentidadMUSD);die;
        $totalComoFinancia = array();
        $totalQuienfinancia = array();
        $totalCredito = array();
        $totalPlan = array();
        $totalContado = array();
        $totalErogacionLiquido = array();
        $totalContratacionExterna = array();

        $quienPintados = array();
        $idFinancistas = array();
        foreach ($inversionesXentidadMUSD as $valIn) {
            $quienFinancia = $this->objinversion->listarDenomFinancista($valIn['idinversion'], 9900000046, $arridEntidades);
            foreach ($quienFinancia as $key => $quien) {
                if (!in_array($quien['denominacion'], $quienPintados)) {
                    $quienPintados[] = $quien['denominacion'];
                    $idFinancistas[] = $quien['idfinancista'];
                }
            }
            $totalPlan[] += $valIn['plan'];
            $totalComoFinancia[] += $valIn['totalcomosefinancia'];
            $totalCredito[] += $valIn['credito'];
            $totalContado[] += $valIn['contado'];
            $totalQuienfinancia[] += $valIn['totalquienfinancia'];
            $totalErogacionLiquido[] += $valIn['erogacionliquido'];
            $totalContratacionExterna[] += $valIn['contratacionexterna'];
        }//print_r($totalContratacionExterna);die;


        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(70, 5, 'Plan: ' . $this->idejercicioden, 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(200, 5, 'Ministerio de economía y planificación', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(50, 5, 'Organismo: ' . $this->organismoden, 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(100, 5, '', 0, 0, 'R', false, '', 1);
        $this->pdf->Cell(50, 5, 'Fecha: ' . date('d-m-Y'), 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Hora: ' . date('H:i:s'), 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Observaciones:', 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 8);
        $this->pdf->MultiCell(270+(30*  count($quienPintados)), 15, $this->observacion, 1, 'L', 0, 3, '', '', true, 0, true);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(14);
        $this->pdf->Cell(45, 10, 'OACE/Entidad/Inversiones', 1, 0, 'L', false, '', 1);
//        $this->pdf->Cell(45, 5, 'OACE/Entidad/Inversiones', 1, 0, 'L', false, '', 1);
//        $this->pdf->Cell(30, 5, 'Plan(Incluye plan de preparacion)', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 10, 'Plan(Incluye plan de preparacion)', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 10, 'Total Cómo se financia', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 10, 'Crédito', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 10, 'Contado', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 10, 'Total Quién financia', 1, 0, 'L', false, '', 1);

        foreach ($quienPintados as $key => $quien) {
            $this->pdf->MultiCell(30, 10, $quien, 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        }
        $this->pdf->MultiCell(50, 10, 'Erogación a líquido de la importación', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(35, 10, 'Contratación externa', 'LTRB', 'T', 0, 1, '', '', true, 0, false, true, 10, 'T', true);
//        $this->pdf->Cell(50, 15, 'Erogación a líquido de la importación', 1, 0, 'L', false, '', 1);
//        $this->pdf->Cell(35, 15, 'Contratación externa', 1, 1, 'L', false, '', 1);
        $this->pdf->Cell(45, 5, 'Total', 1, 0, 'L', false, '', 1);

        // print_r($totalPlan);die;
        $this->pdf->Cell(30, 5, number_format(array_sum($totalPlan), '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(30, 5, number_format(array_sum($totalComoFinancia), '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(25, 5, number_format(array_sum($totalCredito), '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(25, 5, number_format(array_sum($totalContado), '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(30, 5, number_format(array_sum($totalQuienfinancia), '2', '.', ' '), 1, 0, 'R', false, '', 1);
        foreach ($quienPintados as $p => $quienP) {
            $totalQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($arridEntidades, 9900000046,$this->idejercicio);
            $valor = 0;
            foreach ($totalQuienXfinancista as $totalXQuien) {
                if ($quienP == $totalXQuien['denominacion']) {
                    $valor = $totalXQuien['totalquien'];
                    break;
                }
            }
            $this->pdf->Cell(30, 5, number_format($valor, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        }
        $this->pdf->Cell(50, 5, number_format(array_sum($totalErogacionLiquido), '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(35, 5, number_format(array_sum($totalContratacionExterna), '2', '.', ' '), 1, 1, 'R', false, '', 1);
        $denomOrganismos = explode(",", $this->organismoden);
        foreach ($denomOrganismos as $pos => $value1) {
            $organismo = $arrayOrganismos[0][$pos];
            $totalPlanO = array();
            $totalComoFinanciaO = array();
            $totalCreditoO = array();
            $totalContadoO = array();
            $totalQuienfinanciaO = array();
            $totalErogacionLiquidoO = array();
            $totalContratacionExternaO = array();
            $idorg = $arrayOrganismos[0][$pos];
            foreach ($inversionesXentidadMUSD as $valIn) {
                if ($arrayOrganismos[0][$pos] == $valIn['idestructuracomun']) {
                    $quienFinancia = $this->objinversion->listarDenomFinancista($valIn['idinversion'], 9900000046);
                    foreach ($quienFinancia as $key => $quien) {
                        if (!in_array($quien['denominacion'], $quienPintados)) {
                            $quienPintados[] = $quien['denominacion'];
                            $idFinancistas[] = $quien['idfinancista'];
                        }
                    }
                    $totalPlanO[] += $valIn['plan'];
                    $totalComoFinanciaO[] += $valIn['totalcomosefinancia'];
                    $totalCreditoO[] += $valIn['credito'];
                    $totalContadoO[] += $valIn['contado'];
                    $totalQuienfinanciaO[] += $valIn['totalquienfinancia'];
                    $totalErogacionLiquidoO[] += $valIn['erogacionliquido'];
                    $totalContratacionExternaO[] += $valIn['contratacionexterna'];
                }
            }//print_r($totalPlanO);die;
            $this->pdf->SetFont('Times', 'B', 10);

            $altura = self::CalcularAltura($value1, 45);
            if ($this->pdf->GetY() + $altura > 265) {
                $this->pdf->AddPage();
                self::encabezado($quienPintados);
            }
            $this->pdf->MultiCell(45, $altura, $value1, 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
//            $this->pdf->Cell(45, 5, $value1, 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(30, $altura, number_format(array_sum($totalPlanO), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(30, $altura, number_format(array_sum($totalComoFinanciaO), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(25, $altura, number_format(array_sum($totalCreditoO), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(25, $altura, number_format(array_sum($totalContadoO), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(30, $altura, number_format(array_sum($totalQuienfinanciaO), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            foreach ($quienPintados as $p => $quienP) {
                $totalQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($arrayOrganismos[0][$pos], 9900000046,$this->idejercicio);
                $valor = 0;
                foreach ($totalQuienXfinancista as $totalXQuien) {
                    if ($quienP == $totalXQuien['denominacion']) {
                        $valor = $totalXQuien['totalquien'];
                        break;
                    }
                }
                $this->pdf->Cell(30, $altura, number_format($valor, '2', '.', ' '), 1, 0, 'R', false, '', 1);
            }
            $this->pdf->Cell(50, $altura, number_format(array_sum($totalErogacionLiquidoO), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(35, $altura, number_format(array_sum($totalContratacionExternaO), '2', '.', ' '), 1, 1, 'R', false, '', 1);
            foreach ($inversionesXentidadMUSD as $key => $val) {//INVERSIONES DEL ORGANISMO
                $this->pdf->SetFont('Times', 'Arial', 10);
                if ($arrayOrganismos[0][$pos] == $val['idestructuracomun']) {
                    $altura = self::CalcularAltura($val['denominacion'], 45);
                    if ($this->pdf->GetY() + $altura > 265) {
                        $this->pdf->AddPage();
                        self::encabezado($quienPintados);
                    }

                    $this->pdf->SetFont('Times', 'B', 10);
                    $this->pdf->MultiCell(45, $altura, $val['denominacion'], 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                    //  $this->pdf->Cell(45, 5, '   ' . $val['denominacion'], 1, 0, 'L', false, '', 1);

                    $this->pdf->Cell(30, $altura, number_format($val['plan'], '2', '.', ' '), 1, 0, 'R', false, '', 1);

                    $this->pdf->Cell(30, $altura, number_format($val['totalcomosefinancia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(25, $altura, number_format($val['credito'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(25, $altura, number_format($val['contado'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(30, $altura, number_format($val['totalquienfinancia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    foreach ($idFinancistas as $quienP) {
                        $valorquienFinancia = $this->objinversion->listarDenomFinancista($val['idinversion'], 9900000046);
                        if (count($valorquienFinancia) > 0) {
                            foreach ($valorquienFinancia as $quien) {
                                $valor = number_format(0, '2', '.', ' ');
                                if ($quienP == $quien['idfinancista']) {
                                    $valor = number_format($quien['valor'], '2', '.', ' ');
                                    break;
                                }
                            }
                            $this->pdf->Cell(30, $altura, $valor, 1, 0, 'R', false, '', 1);
                        } else {
                            $this->pdf->Cell(30, $altura, number_format(0, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        }
                    }
                    $this->pdf->Cell(50, $altura, number_format($val['erogacionliquido'], '3', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(35, $altura, number_format($val['contratacionexterna'], '3', '.', ' '), 1, 1, 'R', false, '', 1);
                }
            }
            $denominacion = '';

            // print_r($denomEntidades);die;
            foreach ($idEntidades as $k => $value) {
                $totalPlanOrg = array();
                $totalComoFinanciaOrg = array();
                $totalCreditoOrg = array();
                $totalContadoOrg = array();
                $totalErogacionLiquidoOrg = array();
                $totalContratacionExternaOrg = array();
                $totalQuienfinanciaOrg = array();
                $denotabla = $value['entidad'];
                $denominacion = $value['entidad'];
                foreach ($inversionesXentidadMUSD as $valIn) {
                    if ($value['identidad'] == $val['idestructuracomun'] && $idorg != $value['identidad']) {
                        $quienFinancia = $this->objinversion->listarDenomFinancista($valIn['idinversion'], 9900000046);
                        foreach ($quienFinancia as $key => $quien) {
                            if (!in_array($quien['denominacion'], $quienPintados)) {
                                $quienPintados[] = $quien['denominacion'];
                                $idFinancistas[] = $quien['idfinancista'];
                            }
                        }
                        $totalPlanOrg[] += $valIn['plan'];
                        $totalComoFinanciaOrg[] += $valIn['totalcomosefinancia'];
                        $totalCreditoOrg[] += $valIn['credito'];
                        $totalContadoOrg[] += $valIn['contado'];
                        $totalQuienfinanciaOrg[] += $valIn['totalquienfinancia'];
                        $totalErogacionLiquidoOrg[] += $valIn['erogacionliquido'];
                        $totalContratacionExternaOrg[] += $valIn['contratacionexterna'];
                    }
                }
                if ($organismo != $value['identidad']) {
                    $this->pdf->SetFont('Times', 'B', 10);
                    //   $this->pdf->Cell(45, 5, $denotabla, 1, 0, 'L', false, '', 1);
                    $altura = self::CalcularAltura($denotabla, 45);
                    if ($this->pdf->GetY() + $altura > 265) {
                        $this->pdf->AddPage();
                        self::encabezado($quienPintados);
                    }

                    $this->pdf->MultiCell(45, $altura, $denotabla, 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                    $this->pdf->Cell(30, $altura, number_format(array_sum($totalPlanOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(30, $altura, number_format(array_sum($totalComoFinanciaOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(25, $altura, number_format(array_sum($totalCreditoOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(25, $altura, number_format(array_sum($totalContadoOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(30, $altura, number_format(array_sum($totalQuienfinanciaOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    foreach ($quienPintados as $key => $quienP) {

                        $totalQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($value['identidad'], 9900000046,$this->idejercicio);
                        $valor = 0;
                        foreach ($totalQuienXfinancista as $totalXQuien) {
                            if ($quienP == $totalXQuien['denominacion']) {
                                $valor = $totalXQuien['totalquien'];
                                break;
                            }
                        }
                        $this->pdf->Cell(30, $altura, number_format($valor, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    }
                    $this->pdf->Cell(50, $altura, number_format(array_sum($totalErogacionLiquidoOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(35, $altura, number_format(array_sum($totalContratacionExternaOrg), '2', '.', ' '), 1, 1, 'R', false, '', 1);
                    foreach ($inversionesXentidadMUSD as $key => $val) {
                        $this->pdf->SetFont('Times', 'Arial', 10);
                        if ($value['identidad'] == $val['idestructuracomun']) {
                            $altura = self::CalcularAltura($val['denominacion'], 45);
                            if ($this->pdf->GetY() + $altura > 265) {
                                $this->pdf->AddPage();
                                self::encabezado($quienPintados);
                            }
                            $this->pdf->MultiCell(45, $altura, $val['denominacion'], 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                            //   $this->pdf->Cell(45, 5, '   ' . $val['denominacion'], 1, 0, 'L', false, '', 1);

                            $this->pdf->Cell(30, $altura, number_format($val['plan'], '2', '.', ' '), 1, 0, 'R', false, '', 1);

                            $this->pdf->Cell(30, $altura, number_format($val['totalcomosefinancia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(25, $altura, number_format($val['credito'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(25, $altura, number_format($val['contado'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(30, $altura, number_format($val['totalquienfinancia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            foreach ($idFinancistas as $quienP) {
                                $valorquienFinancia = $this->objinversion->listarDenomFinancista($val['idinversion'], 9900000046);
                                if (count($valorquienFinancia) > 0) {
                                    foreach ($valorquienFinancia as $quien) {
                                        $valor = number_format(0, '2', '.', ' ');
                                        if ($quienP == $quien['idfinancista']) {
                                            $valor = number_format($quien['valor'], '2', '.', ' ');
                                            break;
                                        }
                                    }
                                    $this->pdf->Cell(30, $altura, $valor, 1, 0, 'R', false, '', 1);
                                } else {
                                    $this->pdf->Cell(30, $altura, number_format(0, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                }
                            }
                            $this->pdf->Cell(50, $altura, number_format($val['erogacionliquido'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(35, $altura, number_format($val['contratacionexterna'], '2', '.', ' '), 1, 1, 'R', false, '', 1);
                        }
                    }
                }
            }
        }
    }

    public function encabezado($quienPintados) {
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(14);
        $this->pdf->Cell(45, 10, 'OACE/Entidad/Inversiones', 1, 0, 'L', false, '', 1);
//        $this->pdf->Cell(45, 5, 'OACE/Entidad/Inversiones', 1, 0, 'L', false, '', 1);
//        $this->pdf->Cell(30, 5, 'Plan(Incluye plan de preparacion)', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 10, 'Plan(Incluye plan de preparación)', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 10, 'Total Cómo se financia', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 10, 'Crédito', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 10, 'Contado', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 10, 'Total Quién financia', 1, 0, 'L', false, '', 1);

        foreach ($quienPintados as $key => $quien) {
            $this->pdf->MultiCell(30, 10, $quien, 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        }
        $this->pdf->MultiCell(50, 10, 'Erogación a líquido de la importación', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(35, 10, 'Contratación externa', 'LTRB', 'T', 0, 1, '', '', true, 0, false, true, 10, 'T', true);
    }
    public function piedePagina() {
        $this->pdf->Cell(90, 5, 'Aprobado por: ' . $this->aprobadopor, 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Elaborado por: ' . $this->elaboradopor, 0, 1, 'R', false, '', 1);
    }

    public function CalcularAltura($texto, $ancho) {
        $cantidad_lineas = strlen($texto);
        // if ($cantidad_lineas > $ancho) {
        $aux = $cantidad_lineas / $ancho;
        if (is_float($aux)) {
            $aux1 = explode(".", $aux);
        }
        $aux2 = $aux1[0] + 1;
        $altura = 10 * $aux2;
        //  } else {
        //     $altura = 5;
        // }
        return $altura;
    }

}
