<?php

class GenerarPdfErroresImportar extends TCPDF {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;

    function __construct($errores) {
        $this->errores = $errores;
        // Create new PDF document
        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

        // Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('ERROR');
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
            $this->pdf->AddPage();
        } else {
            $this->pdf->setY(267);
        }
        ob_clean();

        $this->pdf->Output("Errores.pdf", 'I');
        return true;
    }

    private function createHeader() {
        // set JPEG quality

        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(200, 5, 'EERORES DE LOS DATOS A IMPORTAR', 0, 1, 'L', false, '', 1);
    }

    private function createHeaderTable() {

        $this->pdf->SetFillColor(204, 255, 204);
        $this->pdf->Cell(92, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(36, 5, 'REPOSICION', 1, 0, 'C', false, '', 1);
        $this->pdf->Cell(36, 5, 'INCREMENTO', 1, 0, 'C', false, '', 1);
    }

    private function addContenido() {
        foreach($this->errores as $error){
            $this->pdf->Cell(36, 5, $error, 1, 0, 'C', false, '', 1);
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