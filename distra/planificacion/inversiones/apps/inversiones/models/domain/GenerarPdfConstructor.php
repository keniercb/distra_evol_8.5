<?php

class GenerarPdfConstructor {

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
        $this->integrator = $parametros['integrator'];
        $this->total = array();
        $this->totalorgent = array();
        $this->idejercicioden = $parametros['idejercicioden'];
        $this->idejercicio = $parametros['idejercicio'];
        $this->aprobadopor = $parametros['aprobadopor'];
        $this->elaboradopor = $parametros['elaboradopor'];
        $this->organismoden = $parametros['organismoden'];
        $this->observacion = $parametros['observacion'];
        $this->constructor = $parametros['constructor'];
        $this->identiDen = $parametros['identiDen'];
        $this->reporte = $parametros['reporte'];
        $this->entidadeshijas = $parametros['entidadeshijas'];
        $this->entidadesDen = $parametros['entidadesDen'];
        $this->params = $parametros;
        $this->ids = $parametros['entidades'];
        $this->mp = $parametros['mp'];
        $this->usd = $parametros['usd'];
        $this->const = $parametros['arrayconstructor'];
        $this->objinversion = new DatInversion();
        $this->objinversionModel = new InversionesModel();
        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);


        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('Construcción y Montaje');
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
        $this->pdf->Output("Cosntructor.pdf", 'I');
        return true;
    }

    private function createHeader() {
// set JPEG quality
        $organismosArray = explode(',', $this->idorganismo);
        $orgaDenArray = explode(',', $this->organismoden);

        foreach ($organismosArray as $key => $valor) {
            $idestructurasaux[$key]['identidad'] = $valor;
            $idestructurasaux[$key]['entidad'] = $orgaDenArray[$key];
        }

        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(70, 5, 'Plan:  ' . $this->idejercicioden, 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(50, 5, 'Ministerio de economía y planificación', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(100, 5, 'Construcción y montaje', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(100, 5, 'UM: Miles Pesos - Miles USD', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(50, 5, 'Observaciones:', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Fecha: ' . date('d-m-Y'), 0, 0, 'R', false, '', 1);
        $this->pdf->Cell(50, 5, 'Hora: ' . date('H:i:s'), 0, 1, 'R', false, '', 1);
        $this->pdf->Ln(5);
        $this->pdf->SetFont('Times', 'Arial', 8);
        $this->pdf->MultiCell(200, 15, $this->observacion, 1, 'L', 0, 3, '', '', true, 0, true);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(6);

        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(6);
        if ($this->params['chequeado'] == 1) {
            $this->pdf->Cell(140, 5, '', 0, 0, 'L', false, '', 1);
            $this->pdf->Cell(60, 5, 'PLAN', 1, 1, 'C', false, '', 1);
            $this->pdf->Cell(100, 5, 'Organismo inversionista/Constructor/Inversión', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(40, 5, 'Provincia', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(30, 5, 'MP', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(30, 5, 'MUSD', 1, 1, 'C', false, '', 1);
        } else {
            $this->pdf->Cell(100, 5, '', 0, 0, 'L', false, '', 1);
            $this->pdf->Cell(100, 5, 'PLAN', 1, 1, 'C', false, '', 1);
            $this->pdf->Cell(100, 5, 'Organismo inversionista/Constructor/Inversión', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(50, 5, 'MP', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(50, 5, 'MUSD', 1, 1, 'C', false, '', 1);
        }

        foreach ($idestructurasaux as $key => $valOrg) {
            $this->totalorgent = array();
            self::pintar($valOrg);
            $hijasorg = self::cargarEntidades($valOrg['identidad']);
            foreach ($hijasorg as $k => $val) {
                self::pintar($val);
            }
            if ($this->pdf->GetY() > 265) {
                self::encabezado();
            }
            $this->pdf->SetFillColor(220, 221, 217);
            if ($this->params['chequeado'] == 1) {
                $this->pdf->SetFont('Times', 'B', 10);
                $this->pdf->Cell(100, 5, 'Total del organismo ' . $valOrg['entidad'], 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(40, 5, '', 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($this->totalorgent['cup'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($this->totalorgent['usd'], '2', '.', ' '), 1, 1, 'R', true, '', 1);
            } else {

                $this->pdf->SetFont('Times', 'B', 10);
                $this->pdf->Cell(100, 5, 'Total del organismo ' . $valOrg['entidad'], 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(50, 5, number_format($this->totalorgent['cup'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(50, 5, number_format($this->totalorgent['usd'], '2', '.', ' '), 1, 1, 'R', true, '', 1);
            }
            $this->pdf->SetFillColor(255, 255, 255);
        }
        if ($this->pdf->GetY() > 265) {
            self::encabezado();
        }
        $this->pdf->SetFillColor(220, 221, 217);
        if ($this->params['chequeado'] == 1) {
            $this->pdf->SetFont('Times', 'B', 10);
            $this->pdf->Cell(100, 5, 'TOTAL', 1, 0, 'L', true, '', 1);
            $this->pdf->Cell(40, 5, '', 1, 0, 'L', true, '', 1);
            $this->pdf->Cell(30, 5, number_format($this->total['cup'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(30, 5, number_format($this->total['usd'], '2', '.', ' '), 1, 1, 'R', true, '', 1);
        } else {

            $this->pdf->SetFont('Times', 'B', 10);
            $this->pdf->Cell(100, 5, 'TOTAL', 1, 0, 'L', true, '', 1);
            $this->pdf->Cell(50, 5, number_format($this->total['cup'], '2', '.', ' '), 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(50, 5, number_format($this->total['usd'], '2', '.', ' '), 1, 1, 'R', true, '', 1);
        }
        $this->pdf->SetFillColor(255, 255, 255);
    }

    public function pintar($valOrg) {
        $datos = $this->objinversion->listarConstructorDenominacionC($this->params, $this->ids, $valOrg['identidad']);

        if (count($datos) > 0) {

            $totUSDent = 0;
            $totMPent = 0;
            $longitud = count($datos);
            for ($k = 0; $k <= $longitud; $k++) {
                $totUSDent+=$datos[$k]['usd'];
                $totMPent+=$datos[$k]['cup'];
            }
            $this->total['usd']+=$totUSDent;
            $this->total['cup']+=$totMPent;

            if ($this->pdf->GetY() > 265) {
                self::encabezado();
            }
            $this->pdf->SetFont('Times', 'B', 10);
            $this->pdf->SetFillColor(204, 255, 204);
            if ($this->params['chequeado'] == 1) {
                $this->pdf->Cell(100, 5, 'Entidad - ' . $valOrg['entidad'], 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(40, 5, '', 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($totMPent, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(30, 5, number_format($totUSDent, '2', '.', ' '), 1, 1, 'R', true, '', 1);
            } else {
                $this->pdf->Cell(100, 5, 'Entidad - ' . $valOrg['entidad'], 1, 0, 'L', true, '', 1);
                $this->pdf->Cell(50, 5, number_format($totMPent, '2', '.', ' '), 1, 0, 'R', true, '', 1);
                $this->pdf->Cell(50, 5, number_format($totUSDent, '2', '.', ' '), 1, 1, 'R', true, '', 1);
            }
            $this->pdf->SetFillColor(255, 255, 255);
            $this->totalorgent['usd']+=$totUSDent;
            $this->totalorgent['cup']+=$totMPent;

            $totUSDinv = 0;
            $totMPinv = 0;
            $totalesInv = array();
            $denomcont = $datos[0]['dencont'];
            $ident = $datos[0]['idestructuracomun'];
            for ($ke = 0; $ke <= $longitud; $ke++) {
                if ($ident == $datos[$ke]['idestructuracomun']) {
                    if ($denomcont == $datos[$ke]['dencont']) {
                        $totUSDinv+=$datos[$ke]['usd'];
                        $totMPinv+=$datos[$ke]['cup'];
                    } else {
                        $totalesInv[$datos[$ke - 1]['idconstructor']] ['usd'] = $totUSDinv;
                        $totalesInv[$datos[$ke - 1]['idconstructor']] ['cup'] = $totMPinv;
                        $denomcont = $datos[$ke]['dencont'];
                        $totUSDinv = 0;
                        $totMPinv = 0;
                        $totUSDinv+=$datos[$ke]['usd'];
                        $totMPinv+=$datos[$ke]['cup'];
                    }
                } else {
                    $totalesInv[$datos[$ke - 1]['idconstructor']] ['usd'] = $totUSDinv;
                    $totalesInv[$datos[$ke - 1]['idconstructor']] ['cup'] = $totMPinv;
                    $ident = $datos[$ke]['idestructuracomun'];
                    $denomcont = $datos[$ke]['dencont'];
                    $totUSDinv = 0;
                    $totMPinv = 0;
                }
            }

            $denomcont = "";
            foreach ($datos as $key => $value) {

                if ($this->pdf->GetY() > 265) {
                    self::encabezado();
                }
                if ($this->params['chequeado'] == 1) {
                    if ($denomcont != $value['dencont']) {
                        $this->pdf->SetFont('Times', 'B', 10);
                        $this->pdf->Cell(100, 5, '  ' . $value['dencont'], 1, 0, 'L', false, '', 1);
                        $this->pdf->Cell(40, 5, '', 1, 0, 'L', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($totalesInv[$value['idconstructor']] ['cup'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($totalesInv[$value['idconstructor']] ['usd'], '2', '.', ' '), 1, 1, 'R', false, '', 1);
                        if ($this->pdf->GetY() > 265) {
                            self::encabezado();
                        }

                        $this->pdf->SetFont('Times', '', 10);
                        $this->pdf->Cell(100, 5, '  ' . $value['denominacion'], 1, 0, 'L', false, '', 1);
                        $this->pdf->Cell(40, 5, $value['prov'], 1, 0, 'L', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($value['cup'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($value['usd'], '2', '.', ' '), 1, 1, 'R', false, '', 1);

                        $denomcont = $value['dencont'];
                    } else {
                        $this->pdf->SetFont('Times', '', 10);
                        $this->pdf->Cell(100, 5, '  ' . $value['denominacion'], 1, 0, 'L', false, '', 1);
                        $this->pdf->Cell(40, 5, $value['prov'], 1, 0, 'L', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($value['cup'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        $this->pdf->Cell(30, 5, number_format($value['usd'], '2', '.', ' '), 1, 1, 'R', false, '', 1);
                    }
                } else {
                    if ($denomcont != $value['dencont']) {
                        $this->pdf->SetFont('Times', '', 10);
                        $this->pdf->Cell(100, 5, '  ' . $value['dencont'], 1, 0, 'L', false, '', 1);
                        $this->pdf->Cell(50, 5, number_format($totalesInv[$value['idconstructor']] ['cup'], '2', '.', ' '), 1, 0, 'R', false, '', 1);
                        $this->pdf->Cell(50, 5, number_format($totalesInv[$value['idconstructor']] ['usd'], '2', '.', ' '), 1, 1, 'R', false, '', 1);
                        $denomcont = $value['dencont'];
                    }
                }
            }
        }
    }

    public function cargarEntidades($idorg) {
        $entidades = array();
        $dominios = $this->integrator->metadatos->DameHijosEstructura($idorg);
        if ($dominios[0] != "") {
            foreach ($dominios as $key => $k) {
                $entidades_hijas = array();
                $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                $entidades = array_merge($entidades_hijas, $entidades);
            }
        }
        return $entidades;
    }

    public function entidadesHijas($identidad, $text) {
        $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad);
        $entidades_hijas = array();
        $entidades_hijas[0]['identidad'] = $identidad;
        $entidades_hijas[0]['entidad'] = $text;
        foreach ($dominios as $key => $entidad_hija) {
            if ($entidad_hija->leaf == 1) {
                $entidades_hijas[$key + 1]['identidad'] = $entidad_hija->id;
                $entidades_hijas[$key + 1]['entidad'] = $entidad_hija->text;
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id, $entidad_hija->text));
            }
        }
        return $entidades_hijas;
    }

    public function piedePagina() {
        $this->pdf->Cell(90, 5, 'Aprobado por: ' . $this->aprobadopor, 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Elaborado por: ' . $this->elaboradopor, 0, 1, 'R', false, '', 1);
    }

    public function encabezado() {
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(6);
        if ($this->params['chequeado'] == 1) {
            $this->pdf->Cell(140, 5, '', 0, 0, 'L', false, '', 1);
            $this->pdf->Cell(60, 5, 'PLAN', 1, 1, 'C', false, '', 1);
            $this->pdf->Cell(100, 5, 'Organismo inversionista/Constructor/Inversión', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(40, 5, 'Provincia', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(30, 5, 'MP', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(30, 5, 'MUSD', 1, 1, 'C', false, '', 1);
        } else {
            $this->pdf->Cell(100, 5, '', 0, 0, 'C', false, '', 1);
            $this->pdf->Cell(100, 5, 'PLAN', 1, 1, 'C', false, '', 1);
            $this->pdf->Cell(100, 5, 'Organismo inversionista/Constructor/Inversión', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(50, 5, 'MP', 1, 0, 'C', false, '', 1);
            $this->pdf->Cell(50, 5, 'MUSD', 1, 1, 'C', false, '', 1);
        }
    }

}

?>
