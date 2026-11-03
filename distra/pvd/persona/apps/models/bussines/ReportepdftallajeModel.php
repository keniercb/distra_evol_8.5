<?php
class PDFTallaje extends fpdf
{
    function Footer()
    {
    }
}

class ReportepdftallajeModel extends ZendExt_Model
{

    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($datos)
    {
        $pdf = new PDFTallaje('P', 'mm', 'a3');
        $this->crearEncabezadoPrincipal($pdf, 'Datos de Tallaje',$datos);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $pdf->SetFont('Times', '', 14);
        foreach ($datos->data as $k=>$val) {
            $y = $pdf->GetY();
            if ($y >= '510' ) {
                $pdf->AddPage();
                $this->getEncabezado($pdf);
            }
            $pdf->Cell(15, 10, $k+1, 1, 0, 'C', 0);
            $pdf->Cell(40, 10, utf8_decode($val['numid']), 1, 0, 'L', 0);
            $pdf->Cell(80, 10, utf8_decode($val['nombreyapellidos']), 1, 0, 'L', 0);
            $pdf->Cell(80, 10, utf8_decode($val['cargo']), 1, 0, 'L', 0);
            $pdf->Cell(30, 10, utf8_decode($val['denomnorma']), 1, 0, 'L', 0);
            $pdf->Cell(30, 10, utf8_decode($val['denomtalla']), 1, 1, 'L', 0);

        }
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo,$datos)
    {
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Times', 'B', 18);
        $pdf->SetLineWidth(0.5);
        $pdf->Cell(240, 10, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln(10);
        $pdf->SetFont('Times', 'B', 16);

        $pdf->Cell(100, 10, 'Prenda:'.$datos->data[0]['denomprenda'], 0, 0, 'L', 0);
        //Creando el encabezado inicial estatico
        $pdf->Ln(10);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(15, 10, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(40, 10, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(80, 10, 'Apellidos y nombres', 1, 0, 'C', 0);
        $pdf->Cell(80, 10, 'Cargo', 1, 0, 'C', 0);
        $pdf->Cell(30, 10, 'Norma', 1, 0, 'C', 0);
        $pdf->Cell(30, 10, 'Talla', 1, 1, 'C', 0);
    }

    private function getEncabezado(&$pdf)
    {
        $pdf->SetFont('Times', 'B', 16);
        $pdf->SetLineWidth(0.5);
        //Creando el encabezado inicial estatico
        $pdf->Ln(10);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(15, 10, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(40, 10, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(80, 10, 'Apellidos y nombres', 1, 0, 'C', 0);
        $pdf->Cell(80, 10, 'Cargo', 1, 0, 'C', 0);
        $pdf->Cell(30, 10, 'Norma', 1, 0, 'C', 0);
        $pdf->Cell(30, 10, 'Talla', 1, 1, 'C', 0);
        $pdf->SetFont('Times', '', 12);
    }
}