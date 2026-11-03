<?php

/**
 * Created by PhpStorm.
 * User: Julio
 * Date: 24/02/2016
 * Time: 8:11
 */
class GenerarPdfControlAprobaciones extends TCPDF {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;

    function __construct($parametros) {

        //$this->idejercicio = $parametros->idejercicio;
        // Create new PDF document
        $this->pdf = new TCPDF('P', PDF_UNIT, 'Carta', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);
        $this->responsable = $parametros['responsable'];
        $this->datos = $parametros['datos'];
        unset($this->datos['totalgeneral']);
        $this->totalgeneral = $parametros['datos']['totalgeneral'];
        // Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('SISPLAN');
        $this->pdf->SetTitle('Control de las Aprobaciones');
        $this->pdf->SetSubject('Ministerio de las Fuerzas Armadas Revolucionarias');
        $this->pdf->SetKeywords('Indicadores, Control, SISPLAN');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

        // set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $this->pdf->SetMargins(5, 15, 3);

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
        $this->createBodyTable();
        // $this->pdf->setY(267);
        //$this->createBodyTable();
        //$this->addContenido();
        if ($this->pdf->GetY() > 258) {
            $this->pdf->setY(262);
            $this->piedePagina();
            $this->pdf->AddPage();
        } else {
            $this->pdf->setY(262);
            $this->piedePagina();
        }
        ob_clean();

        $this->pdf->Output("Control de las Aprobaciones", 'I');
        return true;
    }

    private function createHeader() {
        $var = explode(",", $this->responsable);
        $el = 'APROBACIÓN';


        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', '', 10);
        $this->pdf->Cell(186, 5, '"Ordinario"', 0, 1, 'R');
        $this->pdf->Cell(200, 5, '"Ejemplar No."_____', 0, 1, 'R');
        $this->pdf->Ln();
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 12);
        $this->pdf->Cell(120, 5, $var[1], 0, 1, 'R');
        $this->pdf->Cell(135, 5, $var[2], 0, 1, 'R');
        $this->pdf->Ln();
        $this->pdf->Ln();
        $this->pdf->Cell(50, 5, 'APROBADO:', 0, 1, 'L');
        $this->pdf->Ln();
        $this->pdf->Cell(120, 5, $var[0], 0, 1, 'R');
        $this->pdf->Ln();
        $this->pdf->Cell(50, 5, 'APROBACION No. ' . substr($this->datos[0]['aprobacion'], 1, -1), 0, 1, 'L');
        $this->pdf->Cell(50, 5, $this->datos[0]['entidad'], 0, 1, 'L');

        // $this->pdf->Cell(120, 5,'APROBACIÓN No '/*.$this->datos[0]['aprobacion']*/, 0, 1, 'R');
        // $this->pdf->Cell(200, 5, '"Ejemplar No."_____', 0, 1, 'R');
    }

    private function createHeaderTable() {
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', '', 7);
        $this->pdf->Cell(25, 3, 'CODIGO', 'LTRB', 0, 'C');
        $this->pdf->Cell(100, 3, 'DESCRIPCION', 'LTRB', 0, 'C');
        $this->pdf->Cell(23, 3, 'CANT', 'LTRB', 0, 'C');
        $this->pdf->Cell(23, 3, 'PRECIO', 'LTRB', 0, 'C');
        $this->pdf->Cell(29, 3, 'VALOR(MCUC)', 'LTRB', 1, 'C');
    }

    private function createBodyTable() {
        foreach ($this->datos as $data) {
            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', 'B', 12);
            $this->pdf->Cell(25, 3, ' ', 'LR', 0, 'C');
            $this->pdf->Cell(100, 3, $data['denominacion'], 'LR', 0, 'C');
            $this->pdf->Cell(23, 3, ' ', 'LR', 0, 'C');
            $this->pdf->Cell(23, 3, ' ', 'LR', 0, 'C');
            $this->pdf->Cell(29, 3, ' ', 'LR', 1, 'C');
            foreach ($data['arreglo'] as $pepe) {
                $this->pdf->setJPEGQuality(75);
                $this->pdf->SetFont('Times', '', 12);
                $this->pdf->Cell(25, 3, $pepe['codigo'], 'LR', 0, 'C');
                $this->pdf->Cell(100, 3, $pepe['denominacion'], 'LR', 0, 'L');
                $this->pdf->Cell(23, 3, ' ', 'LR', 0, 'C');
                $this->pdf->Cell(23, 3, ' ', 'LR', 0, 'C');
                $this->pdf->Cell(29, 3, $pepe['importe'], 'LR', 1, 'C');
                foreach ($pepe['arreglo'] as $loco) {
                    $this->pdf->setJPEGQuality(75);
                    $this->pdf->SetFont('Times', '', 12);
                    $this->pdf->Cell(25, 3, '', 'LR', 0, 'C');
                    $this->pdf->Cell(100, 3, "             " . $loco['indicador'], 'LR', 0, 'L');
                    $this->pdf->Cell(23, 3, $loco['cantidad'], 'LR', 0, 'C');
                    $this->pdf->Cell(23, 3, $loco['precio'], 'LR', 0, 'C');
                    $this->pdf->Cell(29, 3, '------', 'LR', 1, 'C');
                }
            }//PONER EL IMPORTE TOTAL
            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', 'B', 12);
            $this->pdf->Cell(25, 3, ' ', 'LR', 0, 'C');
            $this->pdf->Cell(100, 3, 'SUB TOTAL', 'LR', 0, 'R');
            $this->pdf->Cell(23, 3, ' ', 'LR', 0, 'C');
            $this->pdf->Cell(23, 3, ' ', 'LR', 0, 'C');
            $this->pdf->Cell(29, 3, $data['totalvia'], 'LR', 1, 'C');
        }
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 12);
        $this->pdf->Cell(25, 3, ' ', 'LR', 0, 'C');
        $this->pdf->Cell(100, 3, '', 'LR', 0, 'R');
        $this->pdf->Cell(23, 3, ' ', 'LR', 0, 'C');
        $this->pdf->Cell(23, 3, ' ', 'LR', 0, 'C');
        $this->pdf->Cell(29, 3, ' ', 'LR', 1, 'C');
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 12);
        $this->pdf->Cell(25, 3, ' ', 'LRB', 0, 'C');
        $this->pdf->Cell(100, 3, 'TOTAL GENERAL', 'LRB', 0, 'R');
        $this->pdf->Cell(23, 3, ' ', 'LRB', 0, 'C');
        $this->pdf->Cell(23, 3, ' ', 'LRB', 0, 'C');
        $this->pdf->Cell(29, 3, $this->totalgeneral, 'LRB', 1, 'C');
        /* $this->pdf->setJPEGQuality(75);
          $this->pdf->SetFont('Times', '', 7);
          $this->pdf->Cell(25, 3, 'CODIGO', 'LTRB', 0, 'C');
          $this->pdf->Cell(100, 3, 'DESCRIPCION', 'LTRB', 0, 'C');
          $this->pdf->Cell(23, 3, 'CANT', 'LTRB', 0, 'C');
          $this->pdf->Cell(23, 3, 'PRECIO', 'LTRB', 0, 'C');
          $this->pdf->Cell(29, 3, 'VALOR(MCUC)', 'LTRB', 0, 'C'); */
    }

    private function piedePagina() {
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(150, 5, 'Nota: Las cantidades y valores son indicativas y los precios referativos', 0, 1, 'L');
        $this->pdf->Cell(99, 5, 'El financiamiento liquido se realizara puntualmente', 0, 0, 'C');
    }

}
