<?php
class PDFCostos extends fpdf
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

class ReportepdfCostosModel extends ZendExt_Model
{
    public function ReportepdfCostosModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idaccidente)
    {
        $pdf = new PDFCostos('P', 'mm', 'a3');
        $datos = DatAccidentecosto::getCostos($idaccidente);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo(&$pdf, $datos)
    {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->AddPage();
        $pdf->Cell(265, 8, 'Costos:', 0, 0, 'L', 0);
        $pdf->Ln();
        $pdf->SetFont('Arial', '', 12);
        foreach ($datos as $p =>$val) {
            //$pdf->MultiCell(265, 8, ($p + 1).'- '.utf8_decode($val['denominacion'].'ddddddddddddddddddddddddddddsssssssssssaeeeeeeera afasd fadfseeeeeeeeeeeeeeeeeeeeeeeeeee dsafadsfa dsfad'), 1, 'L');
            $pdf->Cell(230, 8, ($p + 1).'- '.utf8_decode($val['denominacion']), 1, 0, 'L');
            $pdf->Cell(48, 8, utf8_decode($val['importe']), 1, 0, 'R');
            $pdf->Ln(8);
        }
        return $pdf;
    }
}