<?php

class GenerarPdfEmisionInversion {

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

    function __construct($parametros, $whereInversion, $whereOtrosIndicadores) {
        $this->idorganismo = $parametros['idorganismo'];
//        $this->identidad = $parametros['identidad'];
        $this->idejercicioden = $parametros['idejercicioden'];
        $this->idejercicio = $parametros['idejercicio'];
        $this->aprobadopor = $parametros['aprobadopor'];
        $this->elaboradopor = $parametros['elaboradopor'];
        $this->organismoden = $parametros['organismoden'];
        $this->forma = $parametros['forma'];
        $this->formaden = $parametros['formaden'];
        //print_r($this->formaden);die;
        $this->observacion = $parametros['observacion'];
        $this->clasrpt = $parametros['clasrpt'];
        $this->identiDen = $parametros['identiDen'];
        $this->reporte = $parametros['reporte'];
        $this->entidadeshijas = $parametros['entidadeshijas'];
        $this->entidadesDen = $parametros['entidadesDen'];
        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->objinversion = new DatInversion();
        $this->objinversionModel = new InversionesModel();
        $this->objinversionreporte = new InversionesReportesModel();
        $this->table = new Table($this->pdf);
	// print_r($this->table);die('eee');
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('INVERSION EMISIÓN');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

        $this->params = $parametros;
	// print_r($this->params);die('eee');

        $this->whereInversion = $whereInversion;
        $this->whereOtrosIndicadores = $whereOtrosIndicadores;
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        $this->pdf->SetMargins(15, 25, 15);
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export() {
        if ($this->idorganismo == "") {
            $organismosArray = $this->objinversionreporte->cargarOrganismosYNombre();
            unset($organismosArray[0]);
            //pre_r($organismosArray);die;
            //$organismosArray[0] =100000532 ;

            foreach ($organismosArray as $k => $orgPadre) {
                $datosEstructura = DatInversion::getDatosEstructura($orgPadre['id']);
                $vacia = $this->createHeader($orgPadre['id'], $orgPadre['denom'], $datosEstructura['codigo']);
                if ($vacia != 0) {
                    $this->pdf->Ln(5);
                    if ($this->pdf->GetY() > 210) {
                        $this->pdf->setY(210);
                        $this->piedePagina();
                        $this->pdf->AddPage();
                    } else {
                        $this->pdf->setY(210);
                        $this->piedePagina();
                    }
                    $this->pdf->Ln();
                    $this->pdf->SetAutoPageBreak(TRUE, 20);
                }
            }
        } else {
            $organismosArray = explode(',', $this->idorganismo);
            $orgaDenArray = explode(',', $this->organismoden);
            foreach ($organismosArray as $k => $orgPadre) {
                
        //el servicio esta dando error, buscar el codigo de la entidad padre sin 
        //servicio y paasarselo a este metodo y descomentariar donde esta comentariado
//                $datosEstructura = $this->integrator->metadatos->DameEstructura($orgPadre);//100000535
                $datosEstructura = DatInversion::getDatosEstructura($orgPadre);
                //pre_r($datosEstructura['codigo']);die;
                $vacia = $this->createHeader($orgPadre, $orgaDenArray[$k], $datosEstructura['codigo']);
                if ($vacia != 0) {
                    $this->pdf->Ln(5);
                    if ($this->pdf->GetY() > 210) {
                        $this->pdf->setY(210);
                        $this->piedePagina();
                        $this->pdf->AddPage();
                    } else {
                        $this->pdf->setY(210);
                        $this->piedePagina();
                    }
                    $this->pdf->Ln();
                    $this->pdf->SetAutoPageBreak(TRUE, 20);
                }
            }
        }
        ob_clean();
        $this->pdf->Output("INVERSION EMISIÓN.pdf", 'I');
        return true;
    }

//encabezado de las paginas
    private function createHeaderTable($identidades, $denOrgPadre, $sumaOrg, $cmpsVal, $valorUSD, $codigoOrgPadre) {
// print_r($this->clasrpt);die;
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Helvetica', 'B', 10);
        $this->pdf->Cell(250, 5, '', 0, 1, 'C', false, '');
        $this->pdf->Cell(145, 5, $this->clasrpt, 0, 1, 'R', false, '');
        $this->pdf->Cell(50, 5, 'Plan ' . $this->idejercicioden, 0, 1, 'L', false, '');
        $this->pdf->Cell(70, 5, 'Ministerio de Economía y Planificación', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(70, 5, 'INVERSIONES', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(2);
        $this->pdf->Cell(70, 5, 'Directivo Mínimo Anual', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(2);
        $this->pdf->Ln(2);
        //$this->pdf->Cell(400, 5, 'Monto Total del Plan Anual de Ejecución física- ', 0, 0, 'L', false, '', 1);

        if ($this->formaden != '') {
            $this->pdf->Cell(270, 5, 'Monto Total del Plan Anual de Ejecución física- '.$this->formaden, 0, 1, 'L', false, '', 1);
            $this->pdf->Ln(2);
        }else{
            $todasFormasPropiedad = DatInversion::getDatosFormaPropiedad();
            $formasden = '';
            foreach($todasFormasPropiedad as $k=> $forma){
                if($k == 0)
                    $formasden = $forma['denominacion'];
                else
                    $formasden .= ', '. $forma['denominacion'];
            }
            $this->pdf->Cell(270, 5, 'Monto Total del Plan Anual de Ejecución física- '.$formasden, 0, 1, 'L', false, '', 1);
            $this->pdf->Ln(2);
        }
        
        $this->pdf->MultiCell(185, 5, /*'Entidad: '.$codigoOrgPadre.' - '.*/$denOrgPadre, 0, 'L', 0, 3, '', '', true, 0, true);        
        $this->pdf->Cell(145, 5, 'UM: Miles Pesos', 0, 1, 'R', false, '', 1);
        
        $this->pdf->Cell(100, 5, '', 0, 0, 'R', false, '', 1);
        $this->pdf->SetFont('Helvetica', 'B', 10);
        $this->pdf->Ln(3);
        $this->pdf->SetFillColor(220, 221, 217);
        $this->pdf->MultiCell(80, 10, 'DESCRIPCIÓN', 'TB', 'L', false, 0, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(17, 10, 'TOTAL', 'TB', 'C', false, 0, '', '', true, 0, false, true, 5, 'T', true);
        $cont = 0;
        $tipo_reporte = 'emision';
        $data = $this->objinversion->listarTipInversion($identidades, $this->params, $tipo_reporte);
        $cmps = $this->objinversion->ListarCmpPorInv($data);

        $this->pdf->SetFont('Helvetica', 'B', 8);
        foreach ($cmps as $cmp) {
            //if (strlen($cmp['denominacion']) > 20) {
                $this->pdf->MultiCell(20, 10, $cmp['denominacion'], 'TB', 'C', false, 0, '', '', true, 0, false, true, 5, 'T', true);
            /*} else {
                $this->pdf->MultiCell(20, 10, $cmp['denominacion'], 'TB', 'C', false, 0, '', '', true, 0, false, true, 5, 'T', true);
            }*/
            $cont++;
        }
        //$this->pdf->MultiCell(23, 10, 'Importaciones MUSD', 'TB', 'C', false, 1, '', '', true, 0, false, true, 5, 'T', true);
        $this->pdf->MultiCell(1, 10, '', 'TB', 'C', false, 1, '', '', true, 0, false, true, 5, 'T', true);
    }

    private function createHeader($idOrgPadre, $denOrgPadre, $codigoOrgPadre) {
        $invPro = 125;
        $fondo = 124;
        /*pre_r($idOrgPadre);
        pre_r($denOrgPadre);die;*/
//-----------------TOTAL DEL PADRE---------------------------
        $entidadesgeneral = $this->objinversionreporte->getEntidades(array($idOrgPadre), $this->entidadeshijas);
        $cont = 0;
        $tipo_reporte = 'emision';
        //pre_r($this->whereInversion);die;
       /* pre_r($entidadesgeneral);die;*/
        $valorXcmp = $this->objinversion->ListarValxCmpPlan($data, $this->params, $this->whereInversion, $entidadesgeneral);
        //pre_r($valorXcmp);die;
        //$valorXcmpUSD = $this->objinversion->ListarValxCmpUSD($data, $this->params, $this->whereInversion, $entidadesgeneral);

        $totalizarPrograma = 1;
        $selectInversion = 0;
        $valorTotalCUP = $this->objinversion->ListarValPlanxPrograma($data, $this->params, $this->whereInversion, $entidadesgeneral, $totalizarPrograma, $selectInversion);

        //$valorUSD = 0;
        //$valorUSD = $valorXcmpUSD[0];
        $cmps = $this->objinversion->ListarCmpPorInv($data);
        $contador = count($cmps);
        foreach ($cmps as $key => $cmp) {
            foreach ($valorXcmp as $ke => $vCmp) {
                if ($vCmp['idnombreetapa'] == $cmp['idnombreetapa']) {
                    $cmps[$key]['totalCmp'] = $vCmp['totalcomp'];
                }
            }
        }

//
//------------------------------------------------------     END TOTAL       ---------------------------------------------------

        $sumaOrg = 0;
        $cup = 0;
        //-----------------INVERSIONES DE CADA  ORGANISMO---------------------------
        $identidades = $entidadesgeneral;
        $sumaplanPrepCup = $this->objinversion->ListarPlanPreparacionReporteEmisionCUP($this->params, /* $value */ $identidades, $this->whereInversion);
        $sumaplanPrepUsd = $this->objinversion->ListarPlanPreparacionReporteEmisionUSD($this->params, /* $value */ $identidades, $this->whereInversion);

        if ($valorTotalCUP[0]['totalinv'] != 0 /*|| $valorUSD != 0*/) {
            $this->pdf->AddPage();
            $this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
            $this->pdf->SetFont('Helvetica', 'B', 8);

            if ($contador != 0) {
                $this->pdf->SetFillColor(220, 221, 217);
                $this->pdf->SetFont('Helvetica', 'B', 8);

                if ($this->pdf->GetY() > 210) {
                    $this->piedePagina();
                    $this->pdf->AddPage();
                    $this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
                }
                $this->pdf->Cell(80, 5, 'TOTAL '/* . ' '. $codigoOrgPadre. ' - '*/ . ' '. $denOrgPadre, 0, 0, 'L', false, '', 1);
//			7/12/2018 se mando a sumar el capital de trabajo al total de inversiones, Sandra......
                $totalCapitalTrabajo = 0;
                /*foreach ($valorXcmp as $ke => $vCmp) {
                    if ($vCmp['idnombreetapa'] == 76) {
                        $totalCapitalTrabajo = $vCmp['totalcomp'];
                    }
                }*/
                $this->pdf->Cell(17, 5, number_format($valorTotalCUP[0]['totalinv']  + $totalCapitalTrabajo, '2', '.', ' '), 0, 0, 'R', false, '', 1);
				
                foreach ($cmps as $key => $v) {
                    if (strlen($v['denominacion']) > 20) {
                        if ($v['totalCmp'] != 0)
                            $this->pdf->Cell(20, 5, number_format($v['totalCmp'], '2', '.', ' '), 0, 0, 'R', false, '', 1);
                        else
                            $this->pdf->Cell(20, 5, '', 0, 0, 'R', false, '', 1);
                    }else {
                        if ($v['totalCmp'] != 0)
                            $this->pdf->Cell(20, 5, number_format($v['totalCmp'], '2', '.', ' '), 0, 0, 'R', false, '', 1);
                        else
                            $this->pdf->Cell(20, 5, '', 0, 0, 'R', false, '', 1);
                    }
                }
                if ($valorUSD != 0)
                    $this->pdf->Cell(20, 5, number_format($valorUSD, '0', '.', ' '), 0, 1, 'R', false, '', 1);
                else
                    $this->pdf->Cell(20, 5, '', 0, 1, 'R', false, '', 1);

                if ($this->pdf->GetY() > 210) {
                    $this->piedePagina();
                    $this->pdf->AddPage();
                    $this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
                }

                //Fila de plan de preparacion
                /*$this->pdf->SetFont('Helvetica', 'A', 8);
                $this->pdf->Cell(80, 5, '    ' . 'PLAN DE PREPARACION', 0, 0, 'L', false, '', 1);

                //Valor de plan de preparacion CUP
                if ($sumaplanPrepCup[0]['preparacioncup'] != 0)
                    $this->pdf->Cell(17, 5, number_format($sumaplanPrepCup[0]['preparacioncup'], '2', '.', ' '), 0, 0, 'R', false, '', 1);
                else
                    $this->pdf->Cell(17, 5, '', 0, 0, 'R', false, '', 1);

                $this->pintarFilasI($contador);*/
                $fondos = 124; // FONDOS BASICOS
                $sumaplanFondos = $this->objinversion->listarIndicadorOtros($fondos, $this->idejercicio, $this->idejercicioden, $identidades, $this->whereInversion);
                
                //Valor de plan de preparacion CUP
                if ($sumaplanPrepUsd[0]['preparacionusd'] != 0) {
                    //$this->pdf->Cell(20, 5, number_format($sumaplanPrepUsd[0]['preparacionusd'], '2', '.', ' '), 0, 1, 'R', false, '', 1);
                    $this->pdf->Cell(80, 5, '    ' . 'Fondos básicos a poner en explotación', 0, 0, 'L', false, '', 1);
                } else {
                    //$this->pdf->Cell(17, 5, '', 0, 1, 'R', false, '', 1);
                    $this->pdf->Cell(80, 5, '    ' . 'Fondos básicos a poner en explotación', 0, 0, 'L', false, '', 1);
                }
                if ($sumaplanFondos[0]['sum'] != 0) {
                     $this->pdf->Cell(17, 5, number_format($sumaplanFondos[0]['sum'], '2', '.', ' '), 0, 1, 'R', false, '', 1);
                } else {
                     $this->pdf->Cell(17, 5, '', 0, 1, 'R', false, '', 1);
                }

                //Fila para el valor de capital de trabajo inicial
                // $totalCapitalTrabajo = 0;
                // foreach ($valorXcmp as $ke => $vCmp) {
                    // if ($vCmp['idnombreetapa'] == 76) {
                        // $totalCapitalTrabajo = $vCmp['totalcomp'];
                    // }
                // }
		//Sandra mando a quitarlo 13/12/2017
		//Sandra mando a ponerlo el 7/12/2018
		//Sandra mando a quitarlo el 10/12/2019
                /*if($totalCapitalTrabajo !=0){
					$this->pdf->Cell(80, 5, '    ' . 'CAPITAL DE TRABAJO INICIAL', 0, 0, 'L', false, '', 1);
                    $this->pdf->Cell(17, 5, number_format($totalCapitalTrabajo, '2', '.', ' '), 0, 0, 'R', false, '', 1);
                } else
                    $this->pdf->Cell(17, 5, '', 0, 0, 'R', false, '', 1);*/


                /*if ($this->pdf->GetY() > 210) {
                    $this->piedePagina();
                    $this->pdf->AddPage();
                    $this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
                }
                $this->pintarFilas($contador);
                $this->pdf->SetTextColor(8, 8, 8);
                $denominacion = '';

                $totalizarPrograma = 0;
                $selectInversion = 0;
                $valorTotalPorProgramaCUP = $this->objinversion->ListarValPlanxPrograma($data, $this->params, $this->whereInversion, $entidadesgeneral, $totalizarPrograma, $selectInversion);
                $totalizarPrograma = 0;
                $selectInversion = 1;
                $valorInversionesProgramaCUP = $this->objinversion->ListarValPlanxPrograma($data, $this->params, $this->whereInversion, $entidadesgeneral, $totalizarPrograma, $selectInversion);
                foreach ($valorTotalPorProgramaCUP as $key => $val) {
                    if ($val['totalcomp'] != 0) {
                        if ($val['iddatosnomenclador'] != '2202') {
                            $this->pdf->SetFont('Helvetica', 'B', 8);
                            if ($this->pdf->GetY() > 210) {
                                $this->piedePagina();
                                $this->pdf->AddPage();
                                $this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
                            }
                            $this->pdf->Cell(80, 5, '    ' . $val['denominacion'], 0, 0, 'L', false, '', 1);
                            $this->pdf->Cell(17, 5, $val['totalcomp'], 0, 0, 'R', false, '', 1);
                            $this->pintarFilas($contador);
                            foreach ($valorInversionesProgramaCUP as $k => $inversion) {
                                $this->pdf->SetFont('Helvetica', 'A', 8);
                                if ($inversion['totalcomp'] != 0) {
                                    if ($val['idtipoinversionprograma'] == $inversion['idtipoinversionprograma']) {
                                        if ($this->pdf->GetY() > 210) {
                                            $this->piedePagina();
                                            $this->pdf->AddPage();
                                            $this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
                                        }
                                        $this->pdf->Cell(80, 5, '        ' . $inversion['denominversion'], 0, 0, 'L', false, '', 1);
                                        $this->pdf->Cell(17, 5, $inversion['totalcomp'], 0, 0, 'R', false, '', 1);
                                        $this->pintarFilas($contador);
                                    }
                                }
                            }
                        } else {
                            $denInvNNominal = $val['denominacion'];
                            $valInvNNominal = $val['totalcomp'];
                        }
                    }
                }
                if ($valInvNNominal != 0) {
                    $this->pdf->SetFont('Helvetica', 'B', 8);
                    if ($this->pdf->GetY() > 210) {
                        $this->piedePagina();
                        $this->pdf->AddPage();
                        $this->createHeaderTable($entidadesgeneral, $denOrgPadre, $sumaOrg, $cmps, $valorUSD, $codigoOrgPadre);
                    }
                    $this->pdf->Cell(80, 5, '    ' . $denInvNNominal, 0, 0, 'L', false, '', 1);
                    $this->pdf->Cell(17, 5, $valInvNNominal, 0, 0, 'R', false, '', 1);
                    $this->pintarFilas($contador);
                }*/
            }
            return 1;
        } else {
            return 0;
        }
    }

    public function piedePagina() {
        $this->pdf->Ln(5);
        $this->pdf->SetFont('Helvetica', 'B', 10);
        if ($this->observacion != '')
            $this->pdf->MultiCell(185, 15, $this->observacion, 0, 'L', 0, 3, '', '', true, 0, true);
        /*else
            $this->pdf->MultiCell(185, 15, 'Se faculta al Ministro de los OACE o al Presidente de las
           OSDE, de los CAP y del CAM Isla de la juventud, a decidir sobre la desagregación de las
           inversiones no nominales, sin exceder el total autorizado.', 0, 'L', 0, 3, '', '', true, 0, true);*/
        $this->pdf->Ln(5);

        $this->pdf->Cell(90, 0, 'Aprobado por: ', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(10);
        if ($this->aprobadopor != '')
            $this->pdf->Cell(90, 0, $this->aprobadopor, 0, 0, 'L', false, '', 1);
        /*else{
            $this->pdf->Cell(90, 5, 'Ricardo Cabrisas Ruiz', 0, 0, 'L', false, '', 1);
        }*/

		

        $this->pdf->Cell(50, 0, 'Fecha: ', 0, 1, 'R', false, '', 1);
        $this->pdf->Cell(90, 5, '      Ministro ', 0, 1, 'L', false, '', 1);
        $this->pdf->SetFont('Helvetica', 'B', 8);
    }

    public function pintarFilas($cant) {
        for ($i = 0; $i < $cant - 1; $i++) {
            $this->pdf->Cell(20, 5, '', 0, 0, 'L', false, '', 1);
        }
        $this->pdf->Cell(20, 5, '', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(20, 5, '', 0, 1, 'L', false, '', 1);
    }

    public function pintarFilasI($cant) {
        for ($i = 0; $i < $cant - 1; $i++) {
            $this->pdf->Cell(20, 5, '', 0, 0, 'L', false, '', 1);
        }
        $this->pdf->Cell(20, 5, '', 0, 0, 'L', false, '', 1);
    }

}
