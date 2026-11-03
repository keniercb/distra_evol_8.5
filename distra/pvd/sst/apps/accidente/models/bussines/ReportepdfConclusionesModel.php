<?php
class PDFConclusiones extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 9);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página '.$this->PageNo()), 0, 0, 'R');
    }
}

class ReportepdfConclusionesModel extends ZendExt_Model
{
    public function ReportepdfConclusionesModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idaccidente)
    {
        $pdf = new PDFConclusiones('P', 'mm', 'a4');
        $datos = DatAccidenteconclusiones::getConclusiones($idaccidente);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo(&$pdf, $datos)
    {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->AddPage();
        $pdf->Cell(265, 8, 'Conclusiones:', 0, 0, 'L', 0);
        $pdf->Ln();
        $pdf->SetFont('Arial', '', 12);
        foreach ($datos as $p =>$val) {
            $pdf->MultiCell(265, 8, ($p + 1).'- '.utf8_decode($val['conclusion']), 0, 'L');
            $pdf->Ln(0, 11);
        }
        return $pdf;
    }
}