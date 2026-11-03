<?php

class GenerarPdfComponentes extends TCPDF {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;

    function __construct($parametros) {
        $this->mostrarInv = $parametros->mostrarInv;
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
        $this->pdf = new TCPDF('L', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);
        $this->parametros = $parametros;

        // Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('SISPLAN');
        $this->pdf->SetTitle('Componentes');
        $this->pdf->setPrintHeader(false);
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $this->pdf->SetMargins(5, 15, 5);

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
//            $this->piedePagina();
            $this->pdf->AddPage();
        } else {
            $this->pdf->setY(267);
//            $this->piedePagina();
        }
        ob_clean();

        $this->pdf->Output("Componentes.pdf", 'I');
        return true;
    }

    private function createHeader() {
        // set JPEG quality
        $ejercicio = $this->objinversion->idejercicioPorId($this->idejercicio);
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(200, 5, 'Plan ' . $ejercicio, 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(200, 5, 'Componentes en Moneda Total y en Divisa', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(200, 5, 'Ministerio de Economia y Planificacion', 0, 1, 'L', false, '', 1);
        // $this->pdf->Cell(100, 5, 'UM: Miles Pesos - Miles USD', 0, 1, 'L', false, '', 1);
//        $this->pdf->Cell(100, 5, '', 0, 0, 'L', false, '', 1);
//        $this->pdf->Cell(50, 5, 'Fecha: ' . date('d/m/Y'), 0, 0, 'R', false, '', 1);
//        $this->pdf->Cell(50, 5, 'Hora: ' . date('h:i:s'), 0, 1, 'R', false, '', 1);
        $this->pdf->Cell(150, 5, 'Organismos:', 0, 1, 'L', false, '', 1);
        $this->pdf->MultiCell(400, 15, $this->organismo, 0, 'L', 0, 3, '', '', true, 0, true);
    }

    private function createHeaderTable() {
        $componentes = $this->objinversion->getComponentes();

        $this->pdf->SetFillColor(204, 255, 204);
        $this->pdf->Cell(92, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(45, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(20 + (count($componentes) * 25), 5, 'PLAN 2016 MONEDA TOTAL', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(20 + (count($componentes) * 25), 5, 'PLAN 2016 DIVISA', 1, 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(204, 255, 204);
        $this->pdf->MultiCell(92, 10, 'ORGANISMO / PRESUPUESTO MEP', 'LTRB', '', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(45, 10, 'ORGANISMO', 'LTRB', '', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        foreach ($componentes as $value) {
            $this->pdf->MultiCell(20, 10, $value['denominacion'], 'LTRB', '', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        }
        $this->pdf->MultiCell(20, 10, 'TOTAL INVERSION', 'LTRB', 'T', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(20, 10, 'PLAN DE PREPARACION', 'LTRB', '', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        foreach ($componentes as $value) {
            $this->pdf->MultiCell(20, 10, $value['denominacion'], 'LTRB', '', 0, 0, '', '', true, 0, false, true, 10, 'M', true);
        }
        $this->pdf->MultiCell(20, 10, 'TOTAL INVERSION', 'LTRB', '', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
        $this->pdf->MultiCell(20, 10, 'PLAN DE PREPARACION', 'LTRB', '', 0, 1, '', '', true, 0, false, true, 10, 'T', true);
    }

    private function addContenido() {
        $componentes = $this->objinversion->getComponentes();
        $organismo = explode(",", $this->idorganismo);
        $organismoden = explode(",", $this->organismo);

        foreach ($organismo as $ki => $value) {//organismos
            $identidades = Array();
            $valorescompCUP = Array();
            $valorescompUSD = Array();
            $entidades_hijas = Array();
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
            $totalesXcomponentes = [];
            //print_r((array)$this->parametros);die;
            $inversionesSegunFiltros = $this->objinversion->listarTipInversion($entidades_hijas, (array)$this->parametros,'componente');
            $totalesXcomponentes = $this->objinversion->getDatosRptComponentes($this->idejercicio, implode(',', $entidades_hijas), 0, $inversionesSegunFiltros);
            $altura = self::CalcularAltura($organismoden[$ki], 92 / 2);
            //echo '<pre>'; print_r($totalesXcomponentes);die;

            $this->pdf->MultiCell(92, $altura, $organismoden[$ki], 'LTRB', 'T', 0, 0, '', '', true, 0, true, true, $altura, 'T', true);
            $org = explode('-', $organismoden[$ki]);
            $this->pdf->MultiCell(45, 10, $org[1], 'LTRB', '', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
            $posCompUSD = -1;
            $posComp = -1;
            for ($i = 0; $i < count($componentes); $i++) {
                    foreach ($totalesXcomponentes as $dat => $datos) {
                        if ($datos['codigoiso'] == 'CUP') {
                            if (($componentes[$i]['idnombreetapa'] == $datos['idnombreetapa'])) {
                                $valorescompCUP[$i] += $datos['valor'];
                            } else {
                                $valorescompCUP[$i] += 0;
                            }
                        }else {
                            if (($componentes[$i]['idnombreetapa'] == $datos['idnombreetapa'])) {
                                $valorescompUSD[$i] += $datos['valor'];
                            } else {
                                $valorescompUSD[$i] += 0;
                            }
                        }
                }
            }

        //echo '<pre>';print_r($valorescompCUP);die;

            foreach ($valorescompCUP as $valorcomp) {
                $this->pdf->Cell(20, $altura, number_format($valorcomp, '3', '.', ' '), 1, 0, 'R', false, '', 1);
            }

            $this->pdf->Cell(20, $altura, number_format(array_sum($valorescompCUP), '3', '.', ' '), 1, 0, 'R', false, '', 1);
            $pPreparacionCUP = $totalesXcomponentes[0]['planpreparacion'];
            $this->pdf->Cell(20, $altura, number_format($pPreparacionCUP, '3', '.', ' '), 1, 0, 'R', false, '', 1);

            if (count($valorescompUSD) > 0) {
                foreach ($valorescompUSD as $valorcomp) {
                    $this->pdf->Cell(20, $altura, number_format($valorcomp, '3', '.', ' '), 1, 0, 'R', false, '', 1);
                }
            } else {
                for ($v = 0; $v < count($componentes); $v++)
                    $this->pdf->Cell(20, $altura, number_format(0, '3', '.', ' '), 1, 0, 'R', false, '', 1);
            }
            $this->pdf->Cell(20, $altura, number_format(array_sum($valorescompUSD), '3', '.', ' '), 1, 0, 'R', false, '', 1);
            $pPreparacionUSD = $totalesXcomponentes[count($totalesXcomponentes) - 1]['planpreparacion'];
            $this->pdf->Cell(20, $altura, number_format($pPreparacionUSD, '3', '.', ' '), 1, 1, 'R', false, '', 1);

            if ($this->mostrarInv) {
                self::mostrarInversiones($this->idejercicio, implode(',', $entidades_hijas), $componentes);
            }
        }
    }

    public function mostrarInversiones($idejercicio, $entidades_hijas, $componentes) {
        $invXcomponentes = [];
//print_r('<pre>');print_r($entidades_hijas);die;
        $inversionesSegunFiltros = $this->objinversion->listarTipInversion($entidades_hijas, (array)$this->parametros,'componente');
        $invXcomponentes = $this->objinversion->getDatosRptComponentes($idejercicio, $entidades_hijas, 1, $inversionesSegunFiltros);
        $posCompInv = -1;
        $posCompInvUSD = -1;
        $idinversion = -1;
        $contCup = 0;
        $contCuc = 0;
        foreach ($invXcomponentes as $dat => $datos) {
            $idinversion = $datos['idinversion'];
            if ($datos['codigoiso'] == 'CUP') {
                for ($i = $posCompInv + 1; $i < count($componentes); $i++) {
                    if (($componentes[$i]['idnombreetapa'] == $datos['idnombreetapa'])) {
                        $valorescompCUPinv[$i] = $datos['valor'];
                        $posCompInv = $i;
                        break;
                    } else {
                        $valorescompCUPinv[$i] = 0;
                        $posCompInv = $i;
                    }
                    $contCup++;
                }
            } else {
                for ($j = $posCompInvUSD + 1; $j < count($componentes); $j++) {
                    if (($componentes[$j]['idnombreetapa'] == $datos['idnombreetapa'])) {
                        $valorescompUSDinv[$j] = $datos['valor'];
                        $posCompInvUSD = $j;
                        break;
                    } else {
                        $valorescompUSDinv[$j] = 0;
                        $posCompInvUSD = $j;
                    }
                    $contCuc++;
                }
            }
            if ($dat <= count($invXcomponentes) - 1) {
                if ($idinversion != $invXcomponentes[$dat + 1]['idinversion']) {
                    $pPrepaInvCUP = $invXcomponentes[$dat - count($componentes)]['planpreparacion'];
                    $pPreparacionInvUSD = $invXcomponentes[$dat]['planpreparacion'];
                    $altura = self::CalcularAltura($invXcomponentes[$dat]['inversion'], 92 / 2);
                    if ($this->pdf->GetY() + $altura > 265) {
                        $this->pdf->AddPage();
                        $this->pdf->Ln(18);
                        self::createHeaderTable();
                    }
                    $this->pdf->MultiCell(92, $altura, '    ' . $invXcomponentes[$dat]['inversion'], 'LTRB', 'T', false, 0, '', '', true, 0, true, true, $altura, 'T', true);
                    $this->pdf->MultiCell(45, $altura, $datos['organismo'], 'LTRB', '', 0, 0, '', '', true, 0, false, true, 10, 'T', true);
                    for ($l = 0; $l < count($componentes); $l++) {
                        $this->pdf->Cell(20, $altura, number_format(($valorescompCUPinv[$l]) ? $valorescompCUPinv[$l] : 0, '3', '.', ' '), 1, 0, 'R', false, '', 1);
                    }
                    $this->pdf->Cell(20, $altura, number_format(array_sum($valorescompCUPinv)/* + $pPrepaInvCUP */, '3', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, $altura, number_format($pPrepaInvCUP, '3', '.', ' '), 1, 0, 'R', false, '', 1);

                    if (count($valorescompUSDinv) > 0) {
                        for ($k = 0; $k < count($componentes); $k++) {
                            $this->pdf->Cell(20, $altura, number_format(($valorescompUSDinv[$k]) ? $valorescompUSDinv[$k] : 0, '3', '.', ' '), 1, 0, 'R', false, '', 1);
                        }
                    } else {
                        for ($v = 0; $v < count($componentes); $v++)
                            $this->pdf->Cell(20, $altura, number_format(0, '3', '.', ' '), 1, 0, 'R', false, '', 1);
                    }
                    $this->pdf->Cell(20, $altura, number_format(array_sum($valorescompUSDinv) + $pPreparacionInvUSD, '3', '.', ' '), 1, 0, 'R', false, '', 1);
                    $this->pdf->Cell(20, $altura, number_format($pPreparacionInvUSD, '3', '.', ' '), 1, 1, 'R', false, '', 1);

                    $pPreparacionInvUSD = 0;
                    $pPrepaInvCUP = 0;
                    $posCompInv = -1;
                    $posCompInvUSD = -1;
                    $valorescompCUPinv = array();
                    $valorescompUSDinv = array();
                }
            }
        }
    }

    public function CalcularAltura($texto, $ancho) {
        $cantidad_lineas = strlen($texto);
        $aux = $cantidad_lineas / $ancho;
        if (is_float($aux)) {
            $aux1 = explode(".", $aux);
        }
        $aux2 = $aux1[0] + 1;
        $altura = 10 * $aux2;
        return $altura;
    }

    public
            function array_unique_callback(array $arr, callable $callback, $strict = false) {
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

}
