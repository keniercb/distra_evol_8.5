<?php

class GenerarPdfResumenInversion {

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
    public $quienPintados;

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
        $this->idInversion = $parametros['idinversion'];
        $this->objinversion = new DatInversion();
        $this->objinversionModel = new InversionesModel();
//print_r(explode(',', $this->entidadesDen));die('eeeddfd');

        $this->pdf = new TCPDF('L', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('Resumen de Inversiones');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

// set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
        $this->pdf->SetMargins(20, 20, 20);

// set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export() {

        $this->pdf->AddPage();
        $this->createHeader();
        $this->pdf->Ln(5);
        if ($this->pdf->GetY() > 265) {
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
        $this->pdf->Output("Resumen Inversion.pdf", 'I');
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
        $idEstr = array();
        $entidadesDenom = explode(',', $this->entidadesDen);
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
        $arrEntidades = implode(",", $idEstr);
        $inversionesXentidad = $this->objinversion->listarInversionesXentidad($this->idejercicio, $arrEntidades);
        array_unshift($this->entidadesDen, $this->organismoden);
        $totalPlan = 0;
        $totalComoFinancia = 0;
        $totalCredito = 0;
        $totalContado = 0;
        $totalFondoBasico = 0;
        $totalRendimientoInver = 0;
        $totalInversInicioAno = 0;
        $totalCuotaInversProceso =0;
        $totalQuienfinancia = 0;

//        $quienPintados = array();
        $idFinancistas = array();
        foreach ($inversionesXentidad as $valIn) {
            $quienFinancia = $this->objinversion->listarDenomFinancista($valIn['idinversion'], 9900000103,$this->idejercicio);
            foreach ($quienFinancia as $key => $quien) {
                if (!in_array($quien['denominacion'], $quienPintados)) {
                    $quienPintados[] = $quien['denominacion'];
                    $idFinancistas[] = $quien['idfinancista'];
                }
            }
            $totalPlan += $valIn['plan'];
            $totalComoFinancia += $valIn['totalcomosefinancia'];
            $totalCredito += $valIn['credito'];
            $totalContado += $valIn['contado'];
            $totalFondoBasico += $valIn['fondobasico'];
            $totalRendimientoInver += $valIn['rendinversion'];
            $totalInversInicioAno += $valIn['inverprocpniano'];
            $totalCuotaInversProceso += $valIn['cuotainverproc'];
            $totalQuienfinancia += $valIn['totalquienfinancia'];
        }


        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(70, 5, 'Plan: ' . $this->idejercicioden, 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(200, 5, 'Ministerio de economía y planificación', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(100, 5, 'UM: Miles Pesos', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->MultiCell(400, 5, 'Organismo: ' . $this->organismoden, 0, 'L', 0, 3, '', '', true, 0, true);
        $this->pdf->Cell(100, 5, 'UM: Miles Pesos', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(100, 5, '', 0, 0, 'R', false, '', 1);
        $this->pdf->Cell(50, 5, 'Fecha: ' . date('d-m-Y'), 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Hora: ' . date('H:i:s'), 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Observaciones:', 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Times', 'Arial', 8);
        $this->pdf->MultiCell(255+(26*  count($quienPintados)), 15, $this->observacion, 1, 'L', 0, 3, '', '', true, 0, true);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(14);
        $this->pdf->Cell(35, 15, 'OACE/Entidad/Inversiones', 1, 0, 'L', false, '', 1);
//        $this->pdf->MultiCell(35, 15, 'OACE/Entidad/Inversiones', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->Cell(30, 15, 'Plan(Incluye plan de preparacion)', 1, 0, 'L', false, '', 1);
//        $this->pdf->MultiCell(30, 15, 'Plan(Incluye plan de preparacion)', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->Cell(30, 15, 'Total Cómo se financia', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 15, 'Crédito', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 15, 'Contado', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 15, 'Total Quién financia', 1, 0, 'L', false, '', 1);

        foreach ($quienPintados as $key => $quien) {
            $this->pdf->MultiCell(26, 15, $quien, 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        }

        //print_r($inversionesXentidad);die;

        $this->pdf->MultiCell(20, 15, 'Fondos básicos a poner en explotacion', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(20, 15, 'Rendimiento de la inversión', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(20, 15, 'Inversiones en proceso al inicio del año', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(20, 15, 'Cuota de inversiones en proceso', 'LTRB', 'T', 0, 1, '', '', true, 0, false, true, 10, 'T', true);

        $this->pdf->Cell(35, 5, 'Total OACE', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 5, number_format($totalPlan, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(30, 5, number_format($totalComoFinancia, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(25, 5, number_format($totalCredito, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(25, 5, number_format($totalContado, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(30, 5, number_format($totalQuienfinancia, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        foreach ($quienPintados as $quienP) {
            $totalQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista(/* $this->ids */$arrEntidades, 9900000103,$this->idejercicio);
            $valor = 0;
            foreach ($totalQuienXfinancista as $totalXQuien) {
                if ($quienP == $totalXQuien['denominacion']) {
                    $valor = $totalXQuien['totalquien'];
                    break;
                }
            }
            $this->pdf->Cell(26, 5, number_format($valor, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        }
        $this->pdf->Cell(20, 5, number_format($totalFondoBasico, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(20, 5, number_format($totalRendimientoInver, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(20, 5, number_format($totalInversInicioAno, '2', '.', ' '), 1, 0, 'R', false, '', 1);
        $this->pdf->Cell(20, 5, number_format($totalCuotaInversProceso, '2', '.', ' '), 1, 1, 'R', false, '', 1);

        $denominacion = '';
        // $denomEntidades = explode(",", $this->entidadesDen);
        $denomOrganismos = explode(",", $this->organismoden);

        foreach ($denomOrganismos as $k => $value) {
            $totalPlanOrg[] += $val['plan'];
            $idorg = $arrayOrganismos[0][$k];
            $totalPlanOrg = array();
            $totalComoFinanciaOrg = array();
            $totalCreditoOrg = array();
            $totalContadoOrg = array();
            $totalFondoBasicoOrg = array();
            $totalRendimientoInverOrg = array();
            $totalInversInicioAnoOrg = array();
            $totalCuotaInversProcesoOrg = array();
            $totalQuienfinanciaOrg = array();
            foreach ($inversionesXentidad as $key => $val) {
                if ($arrayOrganismos[0][$k] == $val['idestructuracomun']) {
                    $totalPlanOrg[] += $val['plan'];
                    $totalComoFinanciaOrg[] = $val['totalcomosefinancia'];
                    $totalCreditoOrg[] = $val['credito'];
                    $totalContadoOrg[] = $val['contado'];
                    $totalFondoBasicoOrg[] = $val['fondobasico'];
                    $totalRendimientoInverOrg[] = $val['rendinversion'];
                    $totalInversInicioAnoOrg[] = $val['inverprocpniano'];
                    $totalCuotaInversProcesoOrg[] = $val['cuotainverproc'];
                    $totalQuienfinanciaOrg[] = $val['totalquienfinancia'];
                }
            }
//            if ($this->pdf->GetY() > 253) {
//                self::encabezado($quienPintados);
//            }
            $organismo = $arrayOrganismos[0][$k];
            $this->pdf->SetFont('Times', 'B', 10);
            $altura = self::CalcularAltura($value, 35);
            if ($this->pdf->GetY() + $altura > 265) {
                $this->pdf->AddPage();
                self::encabezado($quienPintados);
            }
            $this->pdf->MultiCell(35, $altura, $value, 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);

            // $this->pdf->Cell(35, 5, $value, 1, 0, 'L', false, '', 1);

            $this->pdf->Cell(30, $altura, number_format(array_sum($totalPlanOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(30, $altura, number_format(array_sum($totalComoFinanciaOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(25, $altura, number_format(array_sum($totalCreditoOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(25, $altura, number_format(array_sum($totalContadoOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(30, $altura, number_format(array_sum($totalQuienfinanciaOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);

            foreach ($quienPintados as $quienP) {
                $totalQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($arrayOrganismos[0][$k], 9900000103,$this->idejercicio);
                $valor = 0;
                foreach ($totalQuienXfinancista as $totalXQuien) {
                    if ($quienP == $totalXQuien['denominacion']) {
                        $valor = $totalXQuien['totalquien'];
                        break;
                    }
                }
                $this->pdf->Cell(26, $altura, number_format($valor, '2', '.', ' '), 1, 0, 'R', false, '', 1);
            }
            $this->pdf->Cell(20, $altura, number_format(0, '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(20, $altura, number_format(0, '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(20, $altura, number_format(0, '2', '.', ' '), 1, 0, 'R', false, '', 1);
            $this->pdf->Cell(20, $altura, number_format(0, '2', '.', ' '), 1, 1, 'R', false, '', 1);
            foreach ($inversionesXentidad as $key => $val) {
                //                if ($entidades[$k] == $val['idestructuracomun']) {

                if ($arrayOrganismos[0][$k] == $val['idestructuracomun']) {
//                    if ($this->pdf->GetY() > 253) {
//                        self::encabezado($quienPintados);
//                    }
                    $this->pdf->SetFont('Times', 'B', 10);
                    $altura = self::CalcularAltura($val['denominacion'], 35);
                    if ($this->pdf->GetY() + $altura > 265) {
                        $this->pdf->AddPage();
                        self::encabezado($quienPintados);
                    }
                    $this->pdf->MultiCell(35, $altura, '       ' . $val['denominacion'], 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                    //$this->pdf->Cell(35, 5, '       ' . $val['denominacion'], 1, 0, 'L', false, '', 1);
                    //$this->pdf->MultiCell(35, 5, '       ' . $val['denominacion'], 1, 'L', 0, 3, '', '', true, 0, true);

                    $this->pdf->Cell(30, $altura, number_format($val['plan'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(30, $altura, number_format($val['totalcomosefinancia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(25, $altura, number_format($val['credito'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(25, $altura, number_format($val['contado'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(30, $altura, number_format($val['totalquienfinancia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);


                    //print_r($idFinancistas);die;
                    foreach ($idFinancistas as $quienP) {
                        //$valorquienFinancia = $this->objinversion->listarDenomFinancista($val['idinversion'], 9900000103);
                        $valorquienFinancia = $this->objinversion->listarValorPlanPorFinancista($val['idinversion'], 9900000103,$this->idejercicio );

                        if (count($valorquienFinancia) > 0) {
                            foreach ($valorquienFinancia as $quien) {
                                $valor = number_format(0, '2', '.', ' ');
                                if ($quienP == $quien['idfinancista']) {
                                    $valor = number_format($quien['valor'], '2', '.', ' ');
                                    break;
                                }
                            }
                            $this->pdf->Cell(26, $altura, $valor, 1, 0, 'R', false, '', 1);
                        } else {
                            $this->pdf->Cell(26, $altura, number_format(0, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        }
                    }
                    $this->pdf->Cell(20, $altura, number_format(array_sum($totalFondoBasicoOrg), '3', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, $altura, number_format(array_sum($totalRendimientoInverOrg), '3', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, $altura, number_format(array_sum($totalInversInicioAnoOrg), '3', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, $altura, number_format(array_sum($totalCuotaInversProcesoOrg), '3', '.', ' '), 1, 1, 'R', false, '', 1);
                }
            }

            foreach ($idEntidades as $pos => $value) {//entidades hijas del organismo
//Obtener los totales por entidades...
                $totalPlanEnt = array();
                $totalComoFinanciaEnt = array();
                $totalCreditoEnt = array();
                $totalContadoEnt = array();
                $totalFondoBasicoEnt = array();
                $totalRendimientoInverEnt = array();
                $totalInversInicioAnoEnt = array();
                $totalCuotaInversProcesoEnt = array();
                $totalQuienfinanciaEnt = array();
                foreach ($inversionesXentidad as $key => $val) {
                    if ($value['identidad'] == $val['idestructuracomun'] && $idorg != $value['identidad']) {
                        $totalPlanEnt[] += $val['plan'];
                        $totalComoFinanciaEnt[] = $val['totalcomosefinancia'];
                        $totalCreditoEnt[] = $val['credito'];
                        $totalContadoEnt[] = $val['contado'];
                        $totalFondoBasicoEnt[] = $val['fondobasico'];
                        $totalRendimientoInverEnt[] = $val['rendinversion'];
                        $totalInversInicioAnoEnt[] = $val['inverprocpniano'];
                        $totalCuotaInversProcesoEnt[] = $val['cuotainverproc'];
                        $totalQuienfinanciaEnt[] = $val['totalquienfinancia'];
                    }
                }
                $denotabla = $value['entidad'];
                if ($organismo != $value['identidad']) {
                    $altura = self::CalcularAltura($denotabla, 35);

                    if ($this->pdf->GetY() + $altura > 265) {
                        $this->pdf->AddPage();
                        self::encabezado($quienPintados);
                    }

                    $this->pdf->SetFont('Times', 'B', 10);
                    $this->pdf->MultiCell(35, $altura, '   ' . $denotabla, 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                    // $this->pdf->Cell(35, $altura, '   ' . $denotabla, 1, 0, 'L', false, '', 2);
//                   $this->pdf->MultiCell(35, $altura,'  ' . $denotabla, 1, 'L', 0, 0, '', '', true, 0, true);
                    $this->pdf->MultiCell(30, $altura, number_format(array_sum($totalPlanEnt), '2', '.', ' '), 1, 'R', 0, 0, '', '', true, 0, true);
                    $this->pdf->MultiCell(30, $altura, number_format(array_sum($totalComoFinanciaEnt), '2', '.', ' '), 1, 'R', 0, 0, '', '', true, 0, true);
                    $this->pdf->MultiCell(25, $altura, number_format(array_sum($totalCreditoEnt), '2', '.', ' '), 1, 'R', 0, 0, '', '', true, 0, true);
                    $this->pdf->MultiCell(25, $altura, number_format(array_sum($totalContadoEnt), '2', '.', ' '), 1, 'R', 0, 0, '', '', true, 0, true);
                    $this->pdf->MultiCell(30, $altura, number_format(array_sum($totalQuienfinanciaEnt), '2', '.', ' '), 1, 'R', 0, 0, '', '', true, 0, true);


                    foreach ($quienPintados as $p => $quienP) {
                        $totaQuienXfinancista = $this->objinversion->listarTotalQuienXfinancista($value['identidad'], 9900000103,$this->idejercicio); //$arrayOrganismos[0]
                        $valor = 0;
                        foreach ($totaQuienXfinancista as $totalXQuien) {
                            if ($quienP == $totalXQuien['denominacion']) {
                                $valor = $totalXQuien['totalquien'];
                                break;
                            }
                        }
                        $this->pdf->Cell(26, $altura, number_format($valor, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    }
                    $this->pdf->Cell(20, $altura, number_format(array_sum($totalFondoBasicoOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, $altura, number_format(array_sum($totalRendimientoInverOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, $altura, number_format(array_sum($totalInversInicioAnoOrg), '2', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, $altura, number_format(array_sum($totalCuotaInversProcesoOrg), '2', '.', ' '), 1, 1, 'R', false, '', 1);


                    foreach ($inversionesXentidad as $key => $val) {
                        //                if ($entidades[$k] == $val['idestructuracomun']) {
                        if ($value['identidad'] == $val['idestructuracomun']) {

                            $this->pdf->SetFont('Times', 'N', 10);
                            $altura = self::CalcularAltura($val['denominacion'], 35);
                            if ($this->pdf->GetY() + $altura > 265) {
                                $this->pdf->AddPage();
                                self::encabezado($quienPintados);
                            }

                            //$this->pdf->Cell(35, $altura, '       ' . $val['denominacion'], 1, 0, 'L', 0, 0, 0, true, 'T', 'T');
                            $this->pdf->MultiCell(35, $altura, '       ' . $val['denominacion'], 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                            $this->pdf->Cell(30, $altura, number_format($val['plan'], '2', '.', ' '), 1, 0, 'R', false, '', 1);

                            $this->pdf->Cell(30, $altura, number_format($val['totalcomosefinancia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(25, $altura, number_format($val['credito'], '2', '.', ' '), 1, 0, 'R', false, '', 1);

                            $this->pdf->Cell(25, $altura, number_format($val['contado'], '2', '.', ' '), 1, 0, 'R', false, '', 1);

                            $this->pdf->Cell(30, $altura, number_format($val['totalquienfinancia'], '2', '.', ' '), 1, 0, 'R', false, '', 1);

                            foreach ($idFinancistas as $quienP) {
                                //$valorquienFinancia = $this->objinversion->listarDenomFinancista($val['idinversion'], 9900000103);
                                $valorquienFinancia = $this->objinversion->listarValorPlanPorFinancista($val['idinversion'], 9900000103,$this->idejercicio );
                                if (count($valorquienFinancia) > 0) {
                                    foreach ($valorquienFinancia as $quien) {
                                        $valor = number_format(0, '2', '.', ' ');
                                        if ($quienP == $quien['idfinancista']) {
                                            $valor = number_format($quien['valor'], '2', '.', ' ');
                                            break;
                                        }
                                    }
                                    $this->pdf->Cell(26, $altura, $valor, 1, 0, 'R', false, '', 1);
                                } else {
                                    $this->pdf->Cell(26, $altura, number_format(0, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                }
                            }
                            $this->pdf->Cell(20, $altura, number_format($val['fondobasico'], '3', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, $altura, number_format($val['rendinversion'], '3', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, $altura, number_format($val['inverprocpniano'], '3', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, $altura, number_format($val['cuotainverproc'], '3', '.', ' '), 1, 1, 'R', false, '', 1);
                        }
                    }
                }
            }
        }
    }

    public function encabezado($quienPintados) {
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(14);
        $this->pdf->MultiCell(35, 15, 'OACE/Entidad/Inversiones', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
//        $this->pdf->Cell(30, 10, 'Plan(Incluye plan de preparacion)', 1, 0, 'L', false, '', 1);
        $this->pdf->MultiCell(30, 15, 'Plan(Incluye plan de preparacion)', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->Cell(30, 15, 'Total Cómo se financia', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 15, 'Crédito', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 15, 'Contado', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(30, 15, 'Total Quién financia', 1, 0, 'L', false, '', 1);

        foreach ($quienPintados as $key => $quien) {
            $this->pdf->MultiCell(26, 15, $quien, 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        }

        $this->pdf->MultiCell(20, 15, 'Fondos básicos a poner en explotacion', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(20, 15, 'Rendimiento de la inversión', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(20, 15, 'Inversiones en proceso al inicio del año', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(20, 15, 'Cuota de inversiones en proceso', 'LTRB', 'T', 0, 1, '', '', true, 0, false, true, 10, 'T', true);
    }

    public function piedePagina() {
        $this->pdf->Cell(90, 5, 'Aprobado por: ' . $this->aprobadopor, 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Elaborado por: ' . $this->elaboradopor, 0, 1, 'R', false, '', 1);
    }

    public function CalcularAltura($texto, $ancho) {
        $cantidad_lineas = strlen($texto);
        // if ($cantidad_lineas > $ancho) {
        $aux = $cantidad_lineas / ($ancho / 2);
        if (is_float($aux)) {
            $aux1 = explode(".", $aux);
        }
        $aux2 = $aux1[0] + 1;
        $altura = 5 * $aux2;
        //  } else {
        //     $altura = 5;
        // }
        return $altura;
    }

}
