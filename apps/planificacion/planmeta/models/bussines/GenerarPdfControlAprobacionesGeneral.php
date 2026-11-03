<?php

/**
 * Created by PhpStorm.
 * User: Julio
 * Date: 24/02/2016
 * Time: 8:11
 */
class GenerarPdfControlAprobacionesGeneral extends TCPDF {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;

    function __construct($parametros) {

        //$this->idejercicio = $parametros->idejercicio;
        // Create new PDF document
        $this->pdf = new TCPDF('P', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);
        // $this->responsable=$parametros['responsable'];
        $this->datos = $parametros->datos;
        $this->total = $parametros->totalporcolumna;
        $this->responsable = $parametros->responsable;
        $this->pdt = $parametros->pdteadistribuir;
        $this->ttgeneral = $parametros->total;

        // Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('SISPLAN');
        $this->pdf->SetTitle('Tabla Resumen de las Aprobaciones');
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
        $this->createHeaderTable2();
        $this->createHeaderTable3();
        $this->createBodyTable();
        $this->createBodyTable2();
        $this->createBodyTable3();
        $this->createBodyTable4();
        //$this->pdf->setY(267);
        //$this->createBodyTable();
        //$this->addContenido();
        if ($this->pdf->GetY() > 258) {
            $this->pdf->setY(350);
            $this->piedePagina();
            $this->pdf->AddPage();
        } else {
            $this->pdf->setY(350);
            $this->piedePagina();
        }
        ob_clean();

        $this->pdf->Output("Control de las Aprobaciones", 'I');
        return true;
    }

    private function createHeader() {
        $var = explode(",", $this->responsable);
        $el = 'APROBACIÓN';







        // $this->pdf->Cell(120, 5,'APROBACIÓN No '/*.$this->datos[0]['aprobacion']*/, 0, 1, 'R');
        // $this->pdf->Cell(200, 5, '"Ejemplar No."_____', 0, 1, 'R');


        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', '', 16);
        $this->pdf->Cell(280, 5, 'Resumen de las Aprobaciones', 0, 1, 'C');

        $this->pdf->Ln();


        // $this->pdf->Cell(120, 5,'APROBACIÓN No '/*.$this->datos[0]['aprobacion']*/, 0, 1, 'R');
        // $this->pdf->Cell(200, 5, '"Ejemplar No."_____', 0, 1, 'R');
    }

    private function createHeaderTable() {
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 9);
        $this->pdf->Cell(30, 5, '', 'LTR', 0, 'C');
        $this->pdf->Cell(83, 4, 'Pagos Externos', 'LTRB', 0, 'C');
        $this->pdf->Cell(109, 4, 'Pagos Internos', 'LTRB', 0, 'C');
        $this->pdf->SetFont('Times', '', 10);
        $this->pdf->Cell(15, 3, '', 'LTR', 0, 'C');
        $this->pdf->Cell(16, 3, '', 'LTR', 0, 'C');
        $this->pdf->Cell(20, 3, '', 'LTR', 0, 'C');
        $this->pdf->Cell(15, 3, '', 'LTR', 1, 'C');
    }

    private function createHeaderTable2() {
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(30, 3, 'Centros de Balance', 'LR', 0, 'C');
        $this->pdf->SetFont('Times', 'S', 8);
        $this->pdf->Cell(28, 3, 'Importacion Directa', 'LRB', 0, 'C');
        $this->pdf->Cell(22, 3, 'Oper.NC', 'LR', 0, 'C');
        $this->pdf->Cell(18, 3, 'Contingencia', 'LR', 0, 'C');
        $this->pdf->Cell(15, 3, 'Total ', 'LR', 0, 'C');
        $this->pdf->Cell(29, 3, 'Servicios y Otros Pagos ', 'LR', 0, 'C');
        $this->pdf->Cell(25, 3, 'Concen. Compras ', 'LR', 0, 'C');
        $this->pdf->Cell(22, 3, 'Oper.NC', 'LR', 0, 'C');
        $this->pdf->Cell(18, 3, 'Contingencia', 'LR', 0, 'C');
        $this->pdf->Cell(15, 3, 'Total ', 'LR', 0, 'C');
        $this->pdf->Cell(15, 3, 'Total ', 'LR', 0, 'C');
        // $this->pdf->SetFont('Times', '', 10);
        $this->pdf->Cell(16, 3, 'OACE', 'LR', 0, 'C');
        $this->pdf->Cell(20, 3, 'Balance Central', 'LR', 0, 'C');
        $this->pdf->Cell(15, 3, 'Total', 'LR', 1, 'C');
        /* $this->pdf->SetFont('Times', '', 10);
          $this->pdf->Cell(12, 3, '', 'LTR', 0, 'C');
          $this->pdf->Cell(12, 3, '', 'LTR', 0, 'C');
          $this->pdf->Cell(12, 3, '', 'LTR', 1, 'C'); */
    }

    private function createHeaderTable3() {
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', '', 6);
        $this->pdf->Cell(30, 3, '', 'LRB', 0, 'C');
        $this->pdf->Cell(14, 3, 'Liquido', 'LRB', 0, 'C');
        $this->pdf->Cell(14, 3, 'Credito', 'LRB', 0, 'C');
        $this->pdf->Cell(22, 3, '', 'LRB', 0, 'C');
        $this->pdf->Cell(18, 3, '', 'LB', 0, 'C');
        $this->pdf->Cell(15, 3, '', 'LBR', 0, 'C');


        $this->pdf->Cell(29, 3, '', 'LRB', 0, 'C');

        $this->pdf->Cell(25, 3, '', 'LRB', 0, 'C');


        $this->pdf->Cell(22, 3, '', 'LRB', 0, 'C');
        $this->pdf->Cell(18, 3, '', 'LRB', 0, 'C');
        $this->pdf->Cell(15, 3, '', 'LBR', 0, 'C');
        // $this->pdf->SetFont('Times', '', 10);
        $this->pdf->Cell(15, 3, ' ', 'LBR', 0, 'C');
        // $this->pdf->SetFont('Times', '', 10);
        $this->pdf->Cell(16, 3, '', 'LBR', 0, 'C');
        $this->pdf->Cell(20, 3, '', 'LBR', 0, 'C');
        $this->pdf->Cell(15, 3, '', 'LBR', 1, 'C');
        /* $this->pdf->SetFont('Times', '', 10);
          $this->pdf->Cell(12, 3, '', 'LTR', 0, 'C');
          $this->pdf->Cell(12, 3, '', 'LTR', 0, 'C');
          $this->pdf->Cell(12, 3, '', 'LTR', 1, 'C'); */
    }

    private function createBodyTable() {
        foreach ($this->datos as $data) {
            $this->pdf->setJPEGQuality(75);
            $this->pdf->SetFont('Times', '', 8);
            $this->pdf->Cell(30, 3, $data['denentidad'], 'LRTB', 0, 'C');
            $this->pdf->Cell(14, 3, $data['datos']['importdirectaliq'], 'LRB', 0, 'C');
            $this->pdf->Cell(14, 3, $data['datos']['importdirectacred'], 'LRB', 0, 'C');


            $this->pdf->Cell(22, 3, $data['datos']['operacionesncex'], 'LRB', 0, 'C');
            $this->pdf->Cell(18, 3, $data['datos']['continex'], 'LB', 0, 'C');
            $this->pdf->Cell(15, 3, $data['datos']['totalexterno'], 'LBR', 0, 'C');

            $this->pdf->Cell(29, 3, $data['datos']['servyotrospag'], 'LRB', 0, 'C');

            $this->pdf->Cell(25, 3, $data['datos']['concdecomp'], 'LRB', 0, 'C');


            $this->pdf->Cell(22, 3, $data['datos']['operacionesncin'], 'LRB', 0, 'C');
            $this->pdf->Cell(18, 3, $data['datos']['continin'], 'LRB', 0, 'C');
            $this->pdf->Cell(15, 3, $data['datos']['totalinterno'], 'LBR', 0, 'C');
            // $this->pdf->SetFont('Times', '', 10);
            $this->pdf->Cell(15, 3, $data['datos']['totaldivisa'], 'LBR', 0, 'C');
            // $this->pdf->SetFont('Times', '', 10);
            $this->pdf->Cell(16, 3, $data['datos']['oace'], 'LBR', 0, 'C');
            $this->pdf->Cell(20, 3, $data['datos']['balancecentral'], 'LBR', 0, 'C');
            $this->pdf->Cell(15, 3, $data['datos']['total'], 'LBR', 1, 'C');
        }
    }

    private function createBodyTable2() {
        $this->pdf->SetFillColor(220, 255, 220);
        $this->pdf->SetFont('Times', 'B', 8);

        $this->pdf->MultiCell(30, 3, 'Total a Distribuir', 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(14, 3, $this->total['importdirectaliq'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(14, 3, $this->total['importdirectacred'], 1, 'C', 1, 0, '', '', true);


        $this->pdf->MultiCell(22, 3, $this->total['operacionesncex'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(18, 3, $this->total['continex'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(15, 3, $this->total['totalexterno'], 1, 'C', 1, 0, '', '', true);

        $this->pdf->MultiCell(29, 3, $this->total['servyotrospag'], 1, 'C', 1, 0, '', '', true);

        $this->pdf->MultiCell(25, 3, $this->total['concdecomp'], 1, 'C', 1, 0, '', '', true);


        $this->pdf->MultiCell(22, 3, $this->total['operacionesncin'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(18, 3, $this->total['continin'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(15, 3, $this->total['totalinterno'], 1, 'C', 1, 0, '', '', true);
        // $this->pdf->SetFont('Times', '', 10);
        $this->pdf->MultiCell(15, 3, $this->total['totaldivisa'], 1, 'C', 1, 0, '', '', true);
        // $this->pdf->SetFont('Times', '', 10);
        $this->pdf->MultiCell(16, 3, $this->total['oace'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(20, 3, $this->total['balancecentral'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(15, 3, $this->total['total'], 1, 'C', 1, 1, '', '', true);
    }

    private function createBodyTable3() {
        $this->pdf->SetFillColor(213, 204, 079);
        $this->pdf->SetFont('Times', 'B', 8);

        $this->pdf->MultiCell(30, 3, 'Pendiente a Distribuir', 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(14, 3, $this->pdt['importdirectaliq'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(14, 3, $this->pdt['importdirectacred'], 1, 'C', 1, 0, '', '', true);


        $this->pdf->MultiCell(22, 3, $this->pdt['operacionesncex'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(18, 3, $this->pdt['continex'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(15, 3, $this->pdt['totalexterno'], 1, 'C', 1, 0, '', '', true);

        $this->pdf->MultiCell(29, 3, $this->pdt['servyotrospag'], 1, 'C', 1, 0, '', '', true);

        $this->pdf->MultiCell(25, 3, abs($this->pdt['concdecomp']), 1, 'C', 1, 0, '', '', true);


        $this->pdf->MultiCell(22, 3, abs($this->pdt['operacionesncin']), 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(18, 3, abs($this->pdt['continin']), 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(15, 3, abs($this->pdt['totalinterno']), 1, 'C', 1, 0, '', '', true);
        // $this->pdf->SetFont('Times', '', 10);
        $this->pdf->MultiCell(15, 3, abs($this->pdt['totaldivisa']), 1, 'C', 1, 0, '', '', true);
        // $this->pdf->SetFont('Times', '', 10);
        $this->pdf->MultiCell(16, 3, abs($this->pdt['oace']), 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(20, 3, abs($this->pdt['balancecentral']), 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(15, 3, abs($this->pdt['total']), 1, 'C', 1, 1, '', '', true);
    }

    private function createBodyTable4() {
        $this->pdf->SetFillColor(063, 136, 143);
        $this->pdf->SetFont('Times', 'B', 8);

        $this->pdf->MultiCell(30, 3, 'Total', 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(14, 3, $this->ttgeneral['importdirectaliq'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(14, 3, $this->ttgeneral['importdirectacred'], 1, 'C', 1, 0, '', '', true);


        $this->pdf->MultiCell(22, 3, $this->ttgeneral['operacionesncex'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(18, 3, $this->ttgeneral['continex'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(15, 3, $this->ttgeneral['totalexterno'], 1, 'C', 1, 0, '', '', true);

        $this->pdf->MultiCell(29, 3, $this->ttgeneral['servyotrospag'], 1, 'C', 1, 0, '', '', true);

        $this->pdf->MultiCell(25, 3, $this->ttgeneral['concdecomp'], 1, 'C', 1, 0, '', '', true);


        $this->pdf->MultiCell(22, 3, $this->ttgeneral['operacionesncin'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(18, 3, $this->ttgeneral['continin'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(15, 3, $this->ttgeneral['totalinterno'], 1, 'C', 1, 0, '', '', true);
        // $this->pdf->SetFont('Times', '', 10);
        $this->pdf->MultiCell(15, 3, $this->ttgeneral['totaldivisa'], 1, 'C', 1, 0, '', '', true);
        // $this->pdf->SetFont('Times', '', 10);
        $this->pdf->MultiCell(16, 3, $this->ttgeneral['oace'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(20, 3, $this->ttgeneral['balancecentral'], 1, 'C', 1, 0, '', '', true);
        $this->pdf->MultiCell(15, 3, $this->ttgeneral['total'], 1, 'C', 1, 1, '', '', true);
    }

    private function piedePagina() {
        $var = explode(",", $this->responsable);
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 12);

        $this->pdf->Cell(255, 5, 'APROBADO:' . '  ' . $var[0], 0, 1, 'R');
        $this->pdf->Cell(260, 5, $var[2], 0, 1, 'R');
        $this->pdf->Cell(250, 5, $var[1], 0, 1, 'R');




        $this->pdf->Ln();
    }

}
