<?php

class GenerarPdfDemandaEquipos extends TCPDF {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;

    function __construct($parametros) {
        $this->idejercicio = $parametros->idejercicio;
        $this->organismo = $parametros->organismo;
        $this->idorganismo = $parametros->idorganismo;
        $this->entidades = $parametros->entidades;
        $this->identidad = $parametros->identidad;
        $this->entidad = $parametros->entidad;
        $this->idmoneda = $parametros->idmoneda;
        $this->idnivel = $parametros->idnivel;
        $this->observaciones = $parametros->observaciones;
        $this->aprobado = $parametros->aprobado;
        $this->elaborado = $parametros->elaborado;
        $this->organismoden = $parametros->organismoden;
        $this->entidadeshijas = $parametros->entidadeshijas;
        $this->checkD = $parametros->checkD;
        $this->entidadDen = $parametros->identiDen;
        $this->objinversion = new DatInversion();
        $this->objinversionModel = new InversionesModel();
        // Create new PDF document
        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

        // Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('SISPLAN');
        $this->pdf->SetTitle('Demanda por Equipos');
        $this->pdf->SetSubject('Ministerio de las Fuerzas Armadas Revolucionarias');
        $this->pdf->SetKeywords('Indicadores, Control, SISPLAN');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

        // set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $this->pdf->SetMargins(5, 5, 5);

        // set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export() {
        $this->pdf->AddPage();
        $this->createHeader();
        $this->pdf->Ln(5);
        $this->createHeaderTable();
        $this->addContenido();
        if ($this->pdf->GetY() > 258) {
            $this->pdf->setY(267);
            $this->piedePagina();
            $this->pdf->AddPage();
        } else {
            $this->pdf->setY(267);
            $this->piedePagina();
        }
        ob_clean();

        $this->pdf->Output("Demanda por Equipos.pdf", 'I');
        return true;
    }

    private function createHeader() {
        // set JPEG quality
        $ejercicio = $this->objinversion->idejercicioPorId($this->idejercicio);
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(200, 5, 'Plan ' . $ejercicio, 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(200, 5, 'DEMANDA DE EQUIPOS', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(200, 5, 'Ministerio de Economia y Planificacion', 0, 1, 'L', false, '', 1);
        // $this->pdf->Cell(100, 5, 'UM: Miles Pesos - Miles USD', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(100, 5, '', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Fecha: ' . date('d/m/Y'), 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Hora: ' . date('h:i:s'), 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Observaciones:', 0, 1, 'L', false, '', 1);
        $this->pdf->MultiCell(200, 15, $this->observaciones, 1, 'L', 0, 3, '', '', true, 0, true);
    }

    private function createHeaderTable() {

        $this->pdf->SetFillColor(204, 255, 204);
        $this->pdf->Cell(92, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(36, 5, 'REPOSICION', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(36, 5, 'INCREMENTO', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(36, 5, 'TOTAL', 1, 1, 'C', false, '', 1);
        $this->pdf->SetFillColor(204, 255, 204);
        $this->pdf->Cell(92, 5, 'Denominacion', 1, 0, 'L', false, '', 1);
        $this->pdf->Cell(16, 5, 'Cantidad', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(20, 5, 'Valor', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(16, 5, 'Cantidad', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(20, 5, 'Valor', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(16, 5, 'Cantidad', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(20, 5, 'Valor', 1, 1, 'C', false, '', 1);
    }

    private function addContenido() {
        $organismo = explode(",", $this->idorganismo);
        $organismoden = explode(",", $this->organismo);
        $arrayEntXOrg = Array();
        $arrayDenEntXOrg = Array();
        $entidades_hijas = Array();
        foreach ($organismo as $ki => $value) {//organismos
            $array = Array();
            $identidades = Array();
            if ($this->identidad != null) {
                $IDEntidades = explode(",", $this->identidad);
                $idSeleccionadas = $this->objinversionModel->dadoArrayEntidades($value, $organismoden[$ki], $IDEntidades); //ENTIDADES HIJAS seleccionadas
                if (count($idSeleccionadas) > 0) {
                    $idestructuras = $idSeleccionadas;
                    foreach ($idestructuras as $key => $valu) {
                        $identidades[$key] = $valu['identidad'];
                    }
                }
            } else {
                $idestructuras = $this->objinversionModel->cargarEntHijas($value, $organismoden[$ki]); //ENTIDADES HIJAS
                foreach ($idestructuras as $key => $valor) {
                    $identidades[$key] = $valor['identidad'];
                }
            }
            if (count($identidades) > 0) {
                $arrayEntXOrg[$ki] = $identidades;
                $arrayDenEntXOrg[$ki] = $idestructuras;
                $entidades_hijas = array_merge($identidades, $entidades_hijas);
            } else {
                $arrayEntXOrg[$ki][0] = $value;
                $arrayDenEntXOrg[$ki][0] = $organismoden[$ki];
                $entidades_hijas[count($entidades_hijas)] = $value;
            }
        }
        //---------calculo total de todos los organismo-------------------------------------------------------------------------
        $sumaTlOrgRep = 0;
        $sumacantOrgRep = 0;
        $sumacantOrgInc = 0;
        $sumaTlOrgInc = 0;
        $tolTlOrg = $this->objinversion->getInversionesOrganismoDemanda($entidades_hijas, $this->idejercicio); //TOTAL DEL ORGANISMO Y SUS ENTIDADES HIJAS
        $planeTl = $this->objinversion->listarPlanesInversiones(implode(',', $entidades_hijas)); //PLANES
        $indTlOrgRepo = $this->objinversion->listarIndicadoresPlan($tolTlOrg, $this->idmoneda, $planeTl[0], $this->idejercicio, $this->idnivel, 4); //INVERSIONES DEL PLAN 1    REPOSICION
        $indTlOrgInc1 = $this->objinversion->listarIndicadoresPlan($tolTlOrg, $this->idmoneda, $planeTl[1], $this->idejercicio, $this->idnivel, 4); //INVERSIONES DEL PLAN 2    INCREMENTO
        foreach ($indTlOrgInc1 as $key => $v) {
            $importOrgInc = round($v['precio'], 2) * $v['cantidad'];
            $sumaTlOrgRep +=$importOrgInc;
            $sumacantOrgRep +=$v['cantidad'];
        }
        foreach ($indTlOrgRepo as $key => $v) {
            $importOrgRep = round($v['precio'], 2) * $v['cantidad'];
            $sumaTlOrgInc += $importOrgRep;
            $sumacantOrgInc +=$v['cantidad'];
        }
        //------------------------------------------TOTAL de todos los organismos-------------------------------------------------------------------------------------
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->SetFillColor(220, 221, 217);
        $this->pdf->Cell(92, 5, "Total", 1, 0, 'L', true, '', 1);
        $this->pdf->Cell(16, 5, $sumacantOrgRep, 1, 0, 'R', true, '', 1);
        $this->pdf->Cell(20, 5, number_format($sumaTlOrgRep, '2', '.', ' '), 1, 0, 'R', true, '', 1);
        $this->pdf->Cell(16, 5, $sumacantOrgInc, 1, 0, 'R', true, '', 1);
        $this->pdf->Cell(20, 5, number_format($sumaTlOrgInc, '2', '.', ' '), 1, 0, 'R', true, '', 1);
        $tol = $sumacantOrgInc + $sumacantOrgRep;
        $this->pdf->Cell(16, 5, $tol, 1, 0, 'R', true, '', 1);
        $sumaFinalOrg = $sumaTlOrgRep + $sumaTlOrgInc;
        $this->pdf->Cell(20, 5, number_format($sumaFinalOrg, '2', '.', ' '), 1, 1, 'R', true, '', 1);

        //-------------------------------------------END TOTAL de todos los organismos------------------------------------------------------------------------------
//////-------------------------- calculos total organismo entidades-------------------------------------------------------------------------
        foreach ($organismo as $ko => $value) {//organismos
            $arrayInv = Array();
            $arrayOrg[0] = $value;
            //////---------------------------calculos total organismo  y sus entidades-------------------------------------------------------------------------
            $sumaOrgEntsRep = 0; //print_r('<pre>');print_r($identidades);die;
            $sumaOrgEntsInc = 0;
            $sumaOrgCantiRepo = 0;
            $sumaOrgCantiInc = 0;
            $tolInvOrgEtns = $this->objinversion->getInversionesOrganismoDemanda($arrayEntXOrg[$ko], $this->idejercicio); //TOTAL DEL ORGANISMO Y SUS ENTIDADES HIJAS
            //  print_r('<pre>');print_r($tolInvOrgEtns);die;
            $planeGenrl = $this->objinversion->listarPlanesInversiones(implode(',', $arrayEntXOrg[$ko])); //PLANES
            $indOrgEnts = $this->objinversion->listarIndicadoresPlan($tolInvOrgEtns, $this->idmoneda, $planeGenrl[0], $this->idejercicio, $this->idnivel, 4); //INVERSIONES DEL PLAN 1    REPOSICION
            $indOrgEnts1 = $this->objinversion->listarIndicadoresPlan($tolInvOrgEtns, $this->idmoneda, $planeGenrl[1], $this->idejercicio, $this->idnivel, 4); //INVERSIONES DEL PLAN 2    INCREMENTO
            foreach ($indOrgEnts1 as $key => $v) {
                $importOrgEnts = round($v['precio'], 2) * $v['cantidad'];
                $sumaOrgCantiRepo +=$v['cantidad'];
                $sumaOrgEntsRep +=$importOrgEnts;
            }
            foreach ($indOrgEnts as $key => $v) {
                $importOrgEnts1 = round($v['precio'], 2) * $v['cantidad'];
                $sumaOrgCantiInc +=$v['cantidad'];
                $sumaOrgEntsInc += $importOrgEnts1;
            }

            //////---------------------------end calculos total organismo entidades-------------------------------------------------------------------------
            //
            //
            //
            //
            //////---------------------------calculos del propio organismo-------------------------------------------------------------------------
            $valorIncOrg = 0;
            $valorRepoOrg = 0;
            $cantincEnt = 0;
            $cantrepoEnt = 0;
            $data = $this->objinversion->getInversionesOrganismoDemanda($arrayOrg, $this->idejercicio); //INVERSIONES DE LOS ORGANISMOS
            /*  print_r('<pre>');
              print_r($arrayOrg);  print_r('<pre>');print_r($arrayEntXOrg); die; */
            $d = $this->objinversion->listarPlanesInversiones($value); //PLANES
            $datosplanOrg = $this->objinversion->listarIndicadoresPlan($data, $this->idmoneda, $d[0], $this->idejercicio, $this->idnivel, 4); //INVERSIONES DEL PLAN 1    REPOSICION
            $datosplanOrg1 = $this->objinversion->listarIndicadoresPlan($data, $this->idmoneda, $d[1], $this->idejercicio, $this->idnivel, 4); //INVERSIONES DEL PLAN 2    INCREMENTO

            foreach ($datosplanOrg1 as $key => $v) {
                $importOrg = round($v['precio'], 2) * $v['cantidad'];
                $cantincEnt += $v['cantidad'];
                $valorIncOrg += $importOrg;
            }//print_r('<pre>');print_r($datosplanOrg1);die;
            foreach ($datosplanOrg as $key => $v) {
                $importOrg1 = round($v['precio'], 2) * $v['cantidad'];
                $valorRepoOrg += $importOrg1;
                $cantrepoEnt += $v['cantidad'];
            }
            //////---------------------------end calculos del propio organismo-------------------------------------------------------------------------

            $this->pdf->SetFont('Times', 'B', 10);
            $this->pdf->SetFillColor(220, 221, 217);
            $altura = self::CalcularAltura("Total del organismo  " . $organismoden[$ko], 92);
            $this->pdf->MultiCell(92, $altura, "Total del organismo  " . $organismoden[$ko], 'LTRB', 'T', true, 0, '', '', true, 0, true, true, $altura, 'T', true);
            $this->pdf->Cell(16, $altura, $sumaOrgCantiRepo, 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(20, $altura, number_format($sumaOrgEntsRep, '2', '.', ' '), 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(16, $altura, $sumaOrgCantiInc, 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(20, $altura, number_format($sumaOrgEntsInc, '2', '.', ' '), 1, 0, 'R', true, '', 1);
            $tol = $sumaOrgCantiInc + $sumaOrgCantiRepo;
            $this->pdf->Cell(16, $altura, $tol, 1, 0, 'R', true, '', 1);
            $sumaFinalCant = $sumaOrgEntsRep + $sumaOrgEntsInc;
            $this->pdf->Cell(20, $altura, number_format($sumaFinalCant, '2', '.', ' '), 1, 1, 'R', true, '', 1);
            //-------------------------------------------END TOTAL------------------------------------------------------------------------------
            $this->pdf->SetFillColor(204, 255, 204);
            $altura = self::CalcularAltura($organismoden[$ko], 35);
            // $this->pdf->Cell(92, 5, "     " . $organismoden[$ko], 1, 0, 'L', true, '', 1);
            $this->pdf->MultiCell(92, $altura, $organismoden[$ko], 'LTRB', 'T', true, 0, '', '', true, 0, true, true, $altura, 'T', true);
            $this->pdf->Cell(16, $altura, $cantrepoEnt, 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(20, $altura, number_format($valorRepoOrg, '2', '.', ' '), 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(16, $altura, $cantincEnt, 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(20, $altura, number_format($valorIncOrg, '2', '.', ' '), 1, 0, 'R', true, '', 1);
            $canttolent = $cantrepoEnt + $cantincEnt;
            $this->pdf->Cell(16, $altura, $canttolent, 1, 0, 'R', true, '', 1);
            $valorImTolEnt = $valorIncOrg + $valorRepoOrg;
            $this->pdf->Cell(20, $altura, number_format($valorImTolEnt, '2', '.', ' '), 1, 1, 'R', true, '', 1);


            if (count($data) != 0) {
                //------------------------------------------TOTAL-------------------------------------------------------------------------------------

                foreach ($data as $k => $val) {
                    $arrayInv[0]['idinversion'] = $val['idinversion'];
                    ///----------------------------------------------CALCULANDO SUMATORIA DE LAS INVERSIONES-----------------------------------
                    $d = $this->objinversion->listarPlanesInversiones($value); //PLANES
                    $datosplan8 = $this->objinversion->listarIndicadoresPlan($arrayInv, $this->idmoneda, $d[0], $this->idejercicio, $this->idnivel); //INVERSIONES DEL PLAN 1    REPOSICION
                    $datosplan5 = $this->objinversion->listarIndicadoresPlan($arrayInv, $this->idmoneda, $d[1], $this->idejercicio, $this->idnivel); //INVERSIONES DEL PLAN 2    INCREMENTO
                    foreach ($datosplan5 as $key => $v) {
                        $datosplan5[$key]['cantidad2'] = $v['cantidad'];
                        $datosplan5[$key]['precio2'] = $v['precio'];
                    }
                    foreach ($datosplan8 as $key => $v) {
                        $datosplan8[$key]['cantidad1'] = $v['cantidad'];
                        $datosplan8[$key]['precio1'] = $v['precio'];
                    }
                    $array3 = array_merge($datosplan8, $datosplan5);
                    $cont = 0;
                    $sumas = array();
                    $Xarbol = array();

                    foreach ($array3 as $key => $value1) {
                        if ($value1['nivel'] == 4) {
                            $sumas['sumaCantRepo'] += $value1['cantidad2'];
                            $sumas['sumaCantInc'] += $value1['cantidad1'];
                            $import = round($value1['precio1'], 2) * $value1['cantidad1'];
                            $sumas['sumaValRepo'] += $import;
                            $import1 = round($value1['precio2'], 2) * $value1['cantidad2'];
                            $sumas['sumaValInc'] += $import1;
                            $cont++;
                            $Xarbol[$value1['idarbol']]['CantRepo'] += $value1['cantidad1'];
                            $Xarbol[$value1['idarbol']]['CantInc'] += $value1['cantidad2'];
                            $importArb = round($value1['precio1'], 2) * $value1['cantidad1'];
                            $Xarbol[$value1['idarbol']]['ValRepo'] += $importArb;
                            $importArb1 = round($value1['precio2'], 2) * $value1['cantidad2'];
                            $Xarbol[$value1['idarbol']]['ValInc'] += $importArb1;
                        }
                    }
                    if ($this->pdf->GetY() + $altura > 265) {
                        $this->pdf->AddPage();
                        self::createHeaderTable();
                    }
                    if (($sumas['sumaValRepo'] != 0) || ($sumas['sumaValInc'] != 0)) {
                        if ($this->checkD == 0) {
                            $this->pdf->SetFont('Times', 'B', 10);
                            $altura = self::CalcularAltura($val['denominacion'], 92);
                            $this->pdf->MultiCell(92, $altura, $val['denominacion'], 'LTRB', 'T', 0, 0, '', '', false, 0, false, true, $altura, 'T', true);
                            $this->pdf->Cell(16, $altura, '', 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, $altura, number_format($sumas['sumaValRepo'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(16, $altura, '', 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(20, $altura, number_format($sumas['sumaValInc'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                            $this->pdf->Cell(16, $altura, '', 1, 0, 'R', false, '', 1);
                            $sumaInvVal = $sumas['sumaValInc'] + $sumas['sumaValRepo'];
                            $this->pdf->Cell(20, $altura, number_format($sumaInvVal, '2', '.', ' '), 1, 1, 'R', false, '', 1);
                        }
                        $denotabla = '';
                        $denotabla1 = '';
                        $denotabla2 = '';
                        $denotabla3 = '';
                        foreach ($array3 as $k => $va) {
                            $idarbol = $va['idarbol'];
                            if ($va['nivel'] == 1 && $va['idinversion'] == $val['idinversion'] && $va['nivel'] <= $this->idnivel) {
                                if ($denotabla != $va['denominacion'] && ($sumas['sumaValInc'] != 0 || $sumas['sumaValRepo'] != 0)) {
                                    $denotabla = $va['denominacion'];
                                    if ($this->pdf->GetY() + $altura > 265) {
                                        $this->pdf->AddPage();
                                        self::createHeaderTable();
                                    }
                                    $this->pdf->SetFillColor(204, 255, 204);
                                    $this->pdf->SetFont('Times', 'Arial', 10);
                                    $altura = self::CalcularAltura($denotabla, 92);
                                    $this->pdf->MultiCell(92, $altura, $denotabla, 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                    //  $this->pdf->Cell(92, $altura, $denotabla, 1, 0, 'L', true, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($Xarbol[$idarbol]['CantRepo'], '0', '.', '  '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(20, $altura, number_format($Xarbol[$idarbol]['ValRepo'], '2', '.', ''), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($Xarbol[$va['idarbol']]['CantInc'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(20, $altura, number_format($Xarbol[$va['idarbol']]['ValInc'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $sumaCantArb = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                    $sumaValesArb = $Xarbol[$va['idarbol']]['ValRepo'] + $Xarbol[$va['idarbol']]['ValInc'];
                                    $this->pdf->Cell(16, $altura, number_format($sumaCantArb, '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(20, $altura, number_format($sumaValesArb, '2', '.', ' '), 1, 1, 'R', true, '', 1);
                                }
                            }
                            if ($va['nivel'] == 2 && $va['idinversion'] == $val['idinversion'] && ($sumas['sumaValInc'] != 0 || $sumas['sumaValRepo'] != 0) && $va['nivel'] <= $this->idnivel) {
                                if ($denotabla1 != $va['denominacion']) {
                                    $denotabla1 = $va['denominacion'];
                                    $denominacion1 = $va['denominacion'];
                                    $altura = self::CalcularAltura($denotabla1, 92);
                                    if ($this->pdf->GetY() + $altura > 265) {
                                        $this->pdf->AddPage();
                                        self::createHeaderTable();
                                    }
                                    $this->pdf->SetFillColor(204, 255, 204);
                                    $this->pdf->SetFont('Times', 'Arial', 10);
                                    $this->pdf->MultiCell(92, $altura, $denotabla1, 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                    // $this->pdf->Cell(92, $altura,  $denotabla1, 1, 0, 'L', true, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($Xarbol[$idarbol]['CantRepo'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(20, $altura, number_format($Xarbol[$idarbol]['ValRepo'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($Xarbol[$va['idarbol']]['CantInc'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(20, $altura, number_format($Xarbol[$va['idarbol']]['ValInc'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $sumaCantArb = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                    $sumaValesArb = $Xarbol[$va['idarbol']]['ValRepo'] + $Xarbol[$va['idarbol']]['ValInc'];
                                    $this->pdf->Cell(16, $altura, number_format($sumaCantArb, '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(20, $altura, number_format($sumaValesArb, '2', '.', ' '), 1, 1, 'R', true, '', 1);
                                }
                            }
                            if ($va['nivel'] == 3 && $va['idinversion'] == $val['idinversion'] && ($sumas['sumaValInc'] != 0 || $sumas['sumaValRepo'] != 0) && $va['nivel'] <= $this->idnivel) {
                                if ($denotabla2 != $va['denominacion']) {
                                    $denotabla2 = $va['denominacion'];
                                    $denominacion2 = $va['denominacion'];
                                    $altura = self::CalcularAltura($denotabla2, 92);
                                    if ($this->pdf->GetY() + $altura > 265) {
                                        $this->pdf->AddPage();
                                        self::createHeaderTable();
                                    }
                                    $this->pdf->SetFillColor(204, 255, 204);
                                    $this->pdf->SetFont('Times', 'Arial', 10);
                                    $this->pdf->MultiCell(92, $altura, $denotabla2, 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                    //  $this->pdf->Cell(92, 5, "             " . $denotabla2, 1, 0, 'L', true, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($Xarbol[$idarbol]['CantRepo'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(20, $altura, number_format($Xarbol[$idarbol]['ValRepo'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($Xarbol[$va['idarbol']]['CantInc'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(20, $altura, number_format($Xarbol[$va['idarbol']]['ValInc'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $sumaCantArb = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                    $sumaValesArb = $Xarbol[$va['idarbol']]['ValRepo'] + $Xarbol[$va['idarbol']]['ValInc'];
                                    $this->pdf->Cell(16, $altura, number_format($sumaCantArb, '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                    $this->pdf->Cell(20, $altura, number_format($sumaValesArb, '2', '.', ' '), 1, 1, 'R', true, '', 1);
                                }
                            }if ($va['nivel'] == 4 && $va['idinversion'] == $val['idinversion'] && ($va['cantidad2'] != 0 || $va['cantidad1'] != 0) && $va['nivel'] <= $this->idnivel) {
                                //   $this->pdf->SetTextColor(0, 0, 0);
                                if ($denotabla3 != $va['denominacion']) {
                                    $denotabla3 = $va['denominacion'];
                                    $altura = self::CalcularAltura($va['denominacion'], 92);
                                    if ($this->pdf->GetY() + $altura > 265) {
                                        $this->pdf->AddPage();
                                        self::createHeaderTable();
                                    }
                                    $this->pdf->SetFont('Times', 'Arial', 10);
                                    $this->pdf->Cell(92, $altura, $va['denominacion'], 1, 0, 'L', false, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($va['cantidad2'], '0', '.', ' '), 1, 0, 'R', false, '', 1);
                                    $importe = $va['cantidad2'] * round($va['precio2'], 2);
                                    $this->pdf->Cell(20, $altura, number_format($importe, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($va['cantidad1'], '0', '.', ' '), 1, 0, 'R', false, '', 1);
                                    $importe1 = $va['cantidad1'] * round($va['precio1'], 2);
                                    $this->pdf->Cell(20, $altura, number_format($importe1, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                    $sumcantOrg = $va['cantidad1'] + $va['cantidad2'];
                                    $this->pdf->Cell(16, $altura, number_format($sumcantOrg, '0', '.', ' '), 1, 0, 'R', false, '', 1);
                                    $tolsurtido = $importe1 * $importe;
                                    $this->pdf->Cell(20, $altura, number_format($tolsurtido, '2', '.', ' '), 1, 1, 'R', false, '', 1);
                                }
                            }
                        }
                    }
                }
            }
            foreach ($arrayDenEntXOrg[$ko] as $k => $valor) {//entidades hijas
                if ($arrayOrg[0] != $valor['identidad']) {
                    $array = Array();
                    $valorIncEnt = 0;
                    $cantIncEnt = 0;
                    $cantRepEnt = 0;
                    $valorRepoEnt = 0;
                    $array[0] = $valor['identidad'];
                    $data = $this->objinversion->getInversionesOrganismoDemanda($array, $this->idejercicio); //INVERSIONES DE LOS ORGANISMOS
                    $di = $this->objinversion->listarPlanesInversiones($valor['identidad']); //PLANES
                    $datosplanEnti = $this->objinversion->listarIndicadoresPlan($data, $this->idmoneda, $di[0], $this->idejercicio, $this->idnivel, 4); //INVERSIONES DEL PLAN 1    REPOSICION
                    $datosplanEnti1 = $this->objinversion->listarIndicadoresPlan($data, $this->idmoneda, $di[1], $this->idejercicio, $this->idnivel, 4); //INVERSIONES DEL PLAN 2    INCREMENTO
                    foreach ($datosplanEnti1 as $key => $v) {
                        $impEnt = round($v['precio'], 2) * $v['cantidad'];
                        $cantIncEnt += $v['cantidad'];
                        $valorIncEnt += $impEnt;
                    }
                    foreach ($datosplanEnti as $key => $v) {
                        $impEnt1 = round($v['precio'], 2) * $v['cantidad'];
                        $cantRepEnt += $v['cantidad'];
                        $valorRepoEnt += $impEnt1;
                    }

                    if (count($data) != 0) {
                        $altura = self::CalcularAltura($valor['entidad'], 92);
                        if ($this->pdf->GetY() + $altura > 265) {
                            $this->pdf->AddPage();
                            self::createHeaderTable();
                        }
                        if ($this->checkD == 0) {
                            $this->pdf->SetFont('Times', 'B', 10);

                            $this->pdf->MultiCell(92, $altura, $valor['entidad'], 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
                            //  $this->pdf->Cell(92, $altura, "     " . $valor['entidad'], 1, 0, 'L', true, '', 1);
                            $this->pdf->Cell(16, $altura, $cantIncEnt, 1, 0, 'R', true, '', 1);
                            $this->pdf->Cell(20, $altura, number_format($valorIncEnt, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                            $this->pdf->Cell(16, $altura, $cantRepEnt, 1, 0, 'R', true, '', 1);
                            $this->pdf->Cell(20, $altura, number_format($valorRepoEnt, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                            $valorcantidadRep = $cantIncEnt + $cantRepEnt;
                            $this->pdf->Cell(16, $altura, $valorcantidadRep, 1, 0, 'R', true, '', 1);
                            $valorImTolEnt = $valorIncEnt + $valorRepoEnt;
                            $this->pdf->Cell(20, $altura, number_format($valorImTolEnt, '2', '.', ' '), 1, 1, 'R', true, '', 1);
                        } 
                        foreach ($data as $k => $val) {

                            $arrayInv[0]['idinversion'] = $val['idinversion'];

                            $datosplan3 = $this->objinversion->listarIndicadoresPlan($arrayInv, $this->idmoneda, $di[0], $this->idejercicio, $this->idnivel); //INVERSIONES DEL PLAN 1    REPOSICION
                            $datosplan4 = $this->objinversion->listarIndicadoresPlan($arrayInv, $this->idmoneda, $di[1], $this->idejercicio, $this->idnivel); //INVERSIONES DEL PLAN 2    INCREMENTO
 
                            foreach ($datosplan4 as $key => $v) {

                                $datosplan4[$key]['cantidad2'] = $v['cantidad'];
                                $datosplan4[$key]['precio2'] = $v['precio'];
                            }
                            foreach ($datosplan3 as $key => $v) {
                                $datosplan3[$key]['cantidad1'] = $v['cantidad'];
                                $datosplan3[$key]['precio1'] = $v['precio'];
                            }
                           
                          
                        $equp = array();// print_r('<pre>');print_r($datosplan3);print_r('--');print_r($datosplan4);die;
                     //   print_r('<pre>');print_r($datosplan3);print_r('--');print_r($datosplan4);die; 
                        $array3 = array_merge($datosplan4, $datosplan3);

                        $i = 0;
                        $y = 0;
                        $sumas = array();
                        $Xarbol = array();
                        // print_r('<pre>');print_r($array3);
                        foreach ($array3 as $key => $value1) {
                            if ($value1['nivel'] == 4) {//print_r('<pre>');print_r($value1);
                                $sumas['sumaCantRepo'] += $value1['cantidad2'];
                                $sumas['sumaCantInc'] += $value1['cantidad1'];
                                $import = round($value1['precio2'], 2) * $value1['cantidad2'];
                                $sumas['sumaValRepo'] += $import;
                                $import1 = round($value1['precio1'], 2) * $value1['cantidad1'];
                                $sumas['sumaValInc'] += $import1;
                                $Xarbol[$value1['idarbol']]['CantRepo'] += $value1['cantidad2'];
                                $Xarbol[$value1['idarbol']]['CantInc'] += $value1['cantidad1'];
                                $importArb = round($value1['precio2'], 2) * $value1['cantidad2'];
                                $Xarbol[$value1['idarbol']]['ValRepo'] += $importArb;
                                $importArb1 = round($value1['precio1'], 2) * $value1['cantidad1'];
                                $Xarbol[$value1['idarbol']]['ValInc'] += $importArb1;
                            }
                        }
                        if (($sumas['sumaValRepo'] != 0) || ($sumas['sumaValInc'] != 0)) {
                            $altura = self::CalcularAltura($val['denominacion'], 92);
                            if ($this->pdf->GetY() + $altura > 265) {
                                $this->pdf->AddPage();
                                self::createHeaderTable();
                            }
                            $this->pdf->SetFont('Times', 'B', 10);
                            if ($this->checkD == 0) {
                                $this->pdf->MultiCell(92, $altura, $val['denominacion'], 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                $this->pdf->Cell(16, $altura, $sumas['sumaCantRepo'], 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(20, $altura, number_format($sumas['sumaValRepo'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(16, $altura, $sumas['sumaCantInc'], 1, 0, 'R', false, '', 1);
                                $this->pdf->Cell(20, $altura, number_format($sumas['sumaValInc'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                $sumacanttt = $sumas['sumaCantInc'] + $sumas['sumaCantRepo'];
                                $this->pdf->Cell(16, $altura, $sumacanttt, 1, 0, 'R', false, '', 1);
                                $sumaInvVal = $sumas['sumaValInc'] + $sumas['sumaValRepo'];
                                $this->pdf->Cell(20, $altura, number_format($sumaInvVal, '2', '.', ' '), 1, 1, 'R', false, '', 1);
                            } /* print_r('<pre>');
                              print_r($array3);
                              die;*/ 
                            $denominacion = '';
                            $denominacion1 = '';
                            $denominacion2 = '';
                                                     //   print_r('<pre>');print_r($array3);die;
                            foreach ($array3 as $k => $va) {
                                $idarbol = $va['idarbol'];
                                if ($va['nivel'] == 1 && $va['idinversion'] == $val['idinversion'] && /* ($sumas['sumaValRepo'] != 0 || $sumas['sumaValInc'] != 0) && */ $va['nivel'] <= $this->idnivel) {
                                    if ($denominacion != $va['denominacion']) {
                                        $denotabla = $va['denominacion'];
                                        $denominacion = $va['denominacion'];
                                        $altura = self::CalcularAltura($denotabla, 92);
                                        if ($this->pdf->GetY() + $altura > 265) {
                                            $this->pdf->AddPage();
                                            self::createHeaderTable();
                                        }
                                        $this->pdf->SetFillColor(204, 255, 204);
                                        $this->pdf->SetFont('Times', 'Arial', 10);
                                        $this->pdf->MultiCell(92, $altura, $denotabla, 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                        $this->pdf->Cell(16, $altura, number_format($Xarbol[$idarbol]['CantRepo'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(20, $altura, number_format($Xarbol[$idarbol]['ValRepo'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(16, $altura, number_format($Xarbol[$va['idarbol']]['CantInc'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(20, $altura, number_format($Xarbol[$va['idarbol']]['ValInc'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $sumaCantArb = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                        $sumaValesArb = $Xarbol[$va['idarbol']]['ValRepo'] + $Xarbol[$va['idarbol']]['ValInc'];
                                        $this->pdf->Cell(16, $altura, number_format($sumaCantArb, '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(20, $altura, number_format($sumaValesArb, '2', '.', ' '), 1, 1, 'R', true, '', 1);
                                    }
                                }
                                if ($va['nivel'] == 2 && $va['idinversion'] == $val['idinversion'] /* && ($sumas['sumaValRepo'] != 0 || $sumas['sumaValInc'] != 0) */ && $va['nivel'] <= $this->idnivel) {
                                    $denotabla1 = $va['denominacion'];
                                    $denominacion1 = $va['denominacion'];
                                    $altura = self::CalcularAltura($denotabla1, 92);
                                    if ($this->pdf->GetY() + $altura > 265) {
                                        $this->pdf->AddPage();
                                        self::createHeaderTable();
                                    }
                                    if ($denominacion1 != $va['denominacion']) {
                                        $this->pdf->SetFillColor(204, 255, 204);
                                        $this->pdf->SetFont('Times', 'Arial', 10);
                                        $this->pdf->MultiCell(92, $altura, $denotabla1, 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                        $this->pdf->Cell(16, $altura, number_format($Xarbol[$idarbol]['CantRepo'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(20, $altura, number_format($Xarbol[$idarbol]['ValRepo'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(16, $altura, number_format($Xarbol[$va['idarbol']]['CantInc'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(20, $altura, number_format($Xarbol[$va['idarbol']]['ValInc'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $sumaCantArb = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                        $this->pdf->Cell(16, $altura, number_format($sumaCantArb, '0', '.', ''), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(20, $altura, '', 1, 1, 'R', true, '', 1);
                                    }
                                }
                                if ($va['nivel'] == 3 && $va['idinversion'] == $val['idinversion']/* && ($sumas['sumaValRepo'] != 0 || $sumas['sumaValInc'] != 0) */ && $va['nivel'] <= $this->idnivel) {
                                    $denotabla2 = $va['denominacion'];
                                    $denominacion2 = $va['denominacion'];
                                    $altura = self::CalcularAltura($denotabla2, 92);
                                    if ($this->pdf->GetY() + $altura > 265) {
                                        $this->pdf->AddPage();
                                        self::createHeaderTable();
                                    }
                                    if ($denominacion2 != $va['denominacion']) {
                                        $this->pdf->SetFillColor(204, 255, 204);
                                        $this->pdf->SetFont('Times', 'Arial', 10);
                                        $this->pdf->MultiCell(92, $altura, $denotabla2, 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
                                        $this->pdf->Cell(16, $altura, number_format($Xarbol[$idarbol]['CantRepo'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(20, $altura, number_format($Xarbol[$idarbol]['ValRepo'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(16, $altura, number_format($Xarbol[$va['idarbol']]['CantInc'], '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(20, $altura, number_format($Xarbol[$va['idarbol']]['ValInc'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $sumaCantArb = $Xarbol[$va['idarbol']]['CantRepo'] + $Xarbol[$va['idarbol']]['CantInc'];
                                        $this->pdf->Cell(16, $altura, number_format($sumaCantArb, '0', '.', ' '), 1, 0, 'R', true, '', 1);
                                        $this->pdf->Cell(20, $altura, '', 1, 1, 'R', true, '', 1);
                                    }
                                }if ($va['nivel'] == 4 && $va['idinversion'] == $val['idinversion'] /* && ($va['cantidad1'] != 0 || $va['cantidad2'] != 0) */ && $va['nivel'] <= $this->idnivel) {
                                    $altura = self::CalcularAltura($va['denominacion'], 92);
                                    if ($this->pdf->GetY() + $altura > 265) {
                                        $this->pdf->AddPage();
                                        self::createHeaderTable();
                                    }
                                    $this->pdf->SetFont('Times', 'Arial', 10);
                                    $this->pdf->Cell(92, $altura, $va['denominacion'], 1, 0, 'L', false, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($va['cantidad2'], '0', '.', ' '), 1, 0, 'R', false, '', 1);
                                    $importe3 = $va['cantidad2'] * round($va['precio2'], 2);

                                    $this->pdf->Cell(20, $altura, number_format($importe3, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                    $this->pdf->Cell(16, $altura, number_format($va['cantidad1'], '0', '.', ' '), 1, 0, 'R', false, '', 1);
                                    $importe4 = $va['cantidad1'] * round($va['precio1'], 2);
                                    $this->pdf->Cell(20, $altura, number_format($importe4, '2', '.', ' '), 1, 0, 'R', false, '', 1);
                                    $valimpo = $va['cantidad1'] + $va['cantidad2'];
                                    $this->pdf->Cell(16, $altura, number_format($valimpo, '0', '', ' '), 1, 0, 'R', false, '', 1);
                                    $importef = $importe4 + $importe3;
                                    $this->pdf->Cell(20, $altura, number_format($importef, '2', '.', ' '), 1, 1, 'R', false, '', 1);
                                }
                            }
                        }
                    }
                }//die('------------');
                }
            }
        }
    }

    public function piedePagina() {

        $this->pdf->Cell(90, 5, 'Aprobado por: ' . $this->aprobado, 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Elaborado por: ' . $this->elaborado, 0, 1, 'R', false, '', 1);
    }

    public function array_unique_callback(array $arr, callable $callback, $strict = false) {
        return array_filter(
                $arr, function ($item) use ($strict, $callback) {
                    static $haystack = array();
                    $needle = $callback($item);
                    if (in_array($needle, $haystack, $strict)) {
                        return false;
                    } else {
                        $haystack[] = $needle;
                        return true;
                    }
                }
        );
    }

    public function CalcularAltura($texto, $ancho) {
        $cantidad_lineas = strlen($texto);
        $aux = $cantidad_lineas / $ancho;
        if (is_float($aux)) {
            $aux1 = explode(".", $aux);
        }
        $aux2 = $aux1[0] + 1;
        $altura = 8 * $aux2;
        return $altura;
    }

}