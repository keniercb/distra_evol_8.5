<?php

class GenerarPdfEjecucion {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;
    protected $ejercicio;
    protected $idejercicio;
    protected $tipos;
    protected $arrayUM;
    protected $integrator;

    function __construct($parametros) {

        $this->params = $parametros;
        $this->reporte = $parametros['reporte'];
        $this->objejecucion = new DatEjecucionoaceModel();


        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('MEP');
        $this->pdf->SetTitle('Ejecucion ');
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
        if ($this->pdf->GetY() > 276) {
            $this->createHeader();
            $this->pdf->AddPage();
        }
        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);



// Close and output PDF document
        ob_clean();
        $this->pdf->Output(" Ejecucion.pdf", 'I');
        return true;
    }

    private function createHeader() {
// set JPEG quality

        $obj = new DatEjecucionoaceModel();
        $todos = $obj->idIndic();
        foreach ($todos as $t => $value) {
            if ($obj->listarDemanda($this->params, $value['idindicador']) == null) {
                continue;
            } else {
                $ind[] = $obj->listarDemanda($this->params, $value['idindicador']);
            }
        }
        if ($this->reporte == 0) {
            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', 'B', 10);

            $this->pdf->Cell(120, 5, 'DIRECCION ECONOMÍA', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(3);
            $this->pdf->Cell(125, 5, 'RESUMEN DE CONTRATACIÓN', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(10);
            $this->pdf->Cell(30, 5, 'Código', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(40, 5, 'Denominación', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(30, 5, 'Centro Balance', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(30, 5, 'Cantidad Contratado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(30, 5, 'Importe Contratado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(40, 5, 'Órgano que satisface', 1, 1, 'L', false, '', 1);
            foreach ($ind as $k_data) {
                foreach ($k_data->data as $valor) {
                    $integrator = ZendExt_IoC::getInstance();
                    $datosentidad = $integrator->metadatos->DameEstructura($valor['identidad']);
                    $importecontratado = $valor['contratado'] * $valor['preciocontrado'];
                    $this->pdf->SetFont('Times', 'Arial', 10);
                    $this->pdf->Cell(30, 5, $valor['codigo'], 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(40, 5, $valor['denominacion'], 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(30, 5, $datosentidad[0]->denominacion, 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(30, 5, number_format($valor['contratado'], '0', '.', ','), 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(30, 5, number_format($importecontratado, '0', '.', ','), 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(40, 5, $valor['organosatisface'], 1, 1, 'L', false, '', 1);
                }
            }
        } else if ($this->reporte == 1) {
            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', 'B', 10);

            $this->pdf->Cell(120, 5, 'DIRECCION ECONOMÍA', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(3);
            $this->pdf->Cell(135, 5, 'RESUMEN DE EJECUCIÓN DE LA DEMANDA', 0, 1, 'R', false, '', 1);
            $this->pdf->Ln(10);
            $this->pdf->Cell(30, 5, 'Código', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(40, 5, 'Denominación', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(30, 5, 'Centro Balance', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(30, 5, 'Cantidad Contratado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(30, 5, 'Importe Contratado', 1, 0, 'L', false, '', 1);
            $this->pdf->Cell(40, 5, 'Órgano que satisface', 1, 1, 'L', false, '', 1);
            foreach ($ind as $k_data) {
                foreach ($k_data->data as $valor) {
                    $integrator = ZendExt_IoC::getInstance();
                    $datosentidad = $integrator->metadatos->DameEstructura($valor['identidad']);
                    $importeejecutado = $valor['ejecutado'] * $valor['precioejecutado'];
                    $this->pdf->SetFont('Times', 'Arial', 10);
                    $this->pdf->Cell(30, 5, $valor['codigo'], 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(40, 5, $valor['denominacion'], 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(30, 5, $datosentidad[0]->denominacion, 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(30, 5, number_format($valor['ejecutado'], '0', '.', ','), 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(30, 5, number_format($importeejecutado, '0', '.', ','), 1, 0, 'L', false, '', 1);
                    $this->pdf->Cell(40, 5, $valor['organosatisface'], 1, 1, 'L', false, '', 1);
                }
            }
        }
    }

}

?>
