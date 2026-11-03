<?php

class GenerarPdfModeloGastosCostos {

    protected $pdf;
    protected $table;

    function __construct($parametros) {
        $this->params = $parametros;
        $this->pdf = new TCPDF('P', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('XETID');
        $this->pdf->SetTitle('Gastos');
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
        $this->pdf->Output(" Gastos.pdf", 'I');
        return true;
    }

    private function createHeader() {
        $this->pdf->setJPEGQuality(75);
        //TÍTULO
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->setColor('red');
        $this->pdf->Cell(120, 5, 'ENTIDAD: ' . $this->params->denomentidad, 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 'PERIODO: ' . $this->params->denomejercicio, 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 'UM:  MP', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(3);
        $this->pdf->Cell(120, 5, 'GASTOS Y COSTOS', 0, 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, '', 0, 0, 'C', false, '', 1);
        $this->pdf->setColor('text', 240, 32, 16);
        $this->pdf->Cell(25, 5, 'MODELO 2', 0, 1, 'R', false, '', 1);
        $this->pdf->setColor('text', 0, 0, 0);
        $this->pdf->Ln(3);

        //COLUMNAS
        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(80, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PERIODO', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PERIODO', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(50, 5, 'CRECIMIENTO', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(50, 5, 'GASTOS COMEDOR Y C', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(50, 5, 'OTROS GASTOS', 1, 1, 'C', true, '', 1);

        $this->pdf->Cell(80, 5, 'ELEMENTOS DE GASTOS', 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 'BASE', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'PLANIFICADO', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'EN MP', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'EN %', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'P. BASE', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'P. PLANIF', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'P. BASE', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'P. PLANIF', 1, 1, 'C', true, '', 1);



        //DATOS        
        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->SetFillColor(255, 255, 255);

        $this->pdf->Cell(80, 5, 'MATERIAS PRIMAS Y MATERIALES', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'COMBUSTIBLES', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'ENERGÍA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(80, 5, 'TOTAL GASTO MATERIAL', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(80, 5, 'SALARIO TOTAL SIN ESTÍMULO (Incluye 9.09%)', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'SALARIO DE ESTÍMULO (Incluye 9.09 %)', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(80, 5, 'FONDO DE SALARIO TOTAL', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(80, 5, 'DEPRECIACIÓN DE AFT', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'AMORTIZACIÓN DE GASTOS DIFERIDOS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'AMORTIZACIÓN DE AFT INTANGIBLES', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(80, 5, 'TOTAL DEPRECIACIÓN Y AMORTIZACIÓN', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(80, 5, 'SERVICIOS DE TERCEROS.COOPERACIONES', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'SERVICIOS DE TERCEROS.REPARACIONES Y MANTTO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'SERVICIOS DE TERCEROS.TELF Y COMUNICACIONES', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'SERVICIOS DE TERCEROS.OTROS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(80, 5, 'TOTAL SERVICIOS  DE TERCEROS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(80, 5, 'COMISIÓN DE SERVICIOS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'OTROS GASTOS-PROVISIÓN RACIONALIZACIÓN Y C Y TEC', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'OTROS GASTOS-CAPACITACIÓN', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'OTROS GASTOS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(80, 5, 'TOTAL OTROS GASTOS MONETARIOS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(80, 5, 'TOTAL DE GASTOS', 'LB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', true, '', 1);

        $this->pdf->Cell(80, 5, 'PROMEDIO DE TRABAJADORES', 'LB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', true, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(80, 5, 'SALARIO MEDIO SIN ESTIMULOS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'SALARIO MEDIO DE ESTIMULOS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'SALARIO MEDIO TOTAL', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'SALARIO SIN ESTIMULOS POR PESO DE VALOR AGREGADO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'SALARIO DE ESTIMULOS POR PESO DE VALOR AGREGADO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(80, 5, 'SALARIO TOTAL POR PESO DE VALOR AGREGADO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 4, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'COSTO TOTAL DE PRODUCCION', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(80, 5, '(+) S I   INVENTARIOS PROD INSUMO(Cta 196)', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, '(-) S F  INVENTARIOS PROD INSUMO(Cta 196)', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(80, 5, 'COSTO DE LA PRODUCCION BRUTA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(80, 5, '(+) S I  PRODUCCION EN PROCESO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, '(- ) S F PRODUCCION EN PROCESO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, '(- )  INVERSIONES  CON M P TERMINADAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, '(-)  REPARACIONES CAPITALES CON M P TERMINADAS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->Cell(80, 5, 'COSTO DE LA PRODUCCION MERCANTIL', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'N', 8);
        $this->pdf->Cell(80, 5, '(+) S I  INVENTARIOS PROD. TERMINADA AL COSTO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, '(-) S F  INVENTARIOS PROD. TERMINADA AL COSTO', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->SetFont('Times', 'B', 8);
        $this->pdf->SetFillColor(180, 180, 180);
        $this->pdf->Cell(80, 5, 'COSTO DE VENTA TOTAL', 'LB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', true, '', 1);

        $this->pdf->Cell(80, 5, ' ENERGÍA EN KILOWAT', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'COMBUSTIBLES EN KILOGRAMOS', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'PRECIO PROMEDIO DEL KILOWAT', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'PRECIO PROMEDIO DEL KILOGRAMO COMBUSTIBLE', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'INDICE INTENSIDAD ENERGÉTICA', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);

        $this->pdf->Cell(80, 5, 'INDICE DE CONSUMO COMBUSTIBLE', 'LB', 0, 'L', false, '', 1);
        $this->pdf->Cell(25, 5, 1, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 2, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LB', 0, 'C', false, '', 1);
        $this->pdf->Cell(25, 5, 3, 'LBR', 1, 'C', false, '', 1);
    }

}

?>
