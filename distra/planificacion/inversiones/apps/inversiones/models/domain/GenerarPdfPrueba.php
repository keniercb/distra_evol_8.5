
<?php

class GenerarPdfPrueba extends TCPDF {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;

    function __construct($parametros) {

        // Create new PDF document
        $this->pdf = new TCPDF('L', PDF_UNIT, 'A4', true, 'UTF-8', false);   //A4
        $this->table = new Table($this->pdf);

        // Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('SISPLAN');
        $this->pdf->SetTitle('Reporte Maqueta');
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


        if ($this->pdf->GetY() > 170) {
            $this->pdf->setY(180);
            $this->piedePagina();
            $this->pdf->AddPage();
            $this->createHeader();
        } else {
            $this->pdf->setY(180);
            $this->piedePagina();
        }


        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);

        // Close and output PDF document
        ob_clean();
        $this->pdf->Output("Reporte Maqueta.pdf", 'I');
        return true;
    }

    public function createHeader() {
        // set JPEG quality
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 12);
    }

    private function createHeaderTable() {
        
    }

    private function addContenido() {
        $this->pdf->SetTextColor(255, 255, 255);
        $this->pdf->SetFillColor(0, 0, 0);
        $this->pdf->MultiCell(10, 5, 'pruebaaaaaaaaaaaaayutrytryrtyrtytry', 1,'C', true,0);
        $this->pdf->MultiCell(10, 5, 'gfg', 1,'C', true,0,'','',false);
        // $this->pdf->MultiCell(74, 15, $this->observaciones, 1, 'L', 0, 3, '', '', true, 0, true);
    
    
    }

    public function PiedePagina() {
        
    }

}