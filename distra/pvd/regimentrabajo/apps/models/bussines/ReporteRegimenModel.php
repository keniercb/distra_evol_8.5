<?php
$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);

class PDF extends FPDF
{
    function Footer()
    {

    }
}

class ReporteRegimenModel extends ZendExt_Model
{

    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($datos,$denonregimen)
    {
        $pdf = new PDF('P', 'mm', 'a3');
        $this->crearEncabezadoPrincipal($pdf, 'Datos  Régimen de trabajo', $datos,$denonregimen);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos,$denonregimen);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos,$denonregimen)
    {
        $pdf->SetFont('Times', '', 12);
        foreach ($datos as $k => $val) {
            $y = $pdf->GetY();
            if ($y >= '510') {
                $pdf->AddPage();
                $this->getEncabezado($pdf);
            }
            $pdf->Cell(13, 10, $k + 1, 1, 0, 'C', 0);
            $pdf->Cell(42, 10, utf8_decode($val['numid']), 1, 0, 'L', 0);
            $pdf->Cell(50, 10, utf8_decode($val['nombreyapellidos']), 1, 0, 'L', 0);
            $pdf->Cell(60, 10, utf8_decode($val['cargo']), 1, 0, 'L', 0);
            $pdf->Cell(50, 10, utf8_decode($val['grupodescanso']), 1, 0, 'L', 0);
            $pdf->Cell(60, 10, utf8_decode($val['turnodetrabajo']), 1, 1, 'L', 0);
        }
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo, $datos,$denonregimen)
    {
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Times', 'B', 16);
        $pdf->SetLineWidth(0.5);
        $pdf->Cell(240, 10, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln(10);
        $pdf->SetFont('Times', 'B', 16);

        $pdf->Cell(100, 10, utf8_decode('Régimen de trabajo:') .$denonregimen, 0, 0, 'L', 0);
        //Creando el encabezado inicial estatico
        $pdf->Ln(10);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(13, 10, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(42, 10, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(50, 10, 'Apellidos y nombres', 1, 0, 'C', 0);
        $pdf->Cell(60, 10, 'Cargo', 1, 0, 'C', 0);
        $pdf->Cell(50, 10, 'Grupo de descanso', 1, 0, 'C', 0);
        $pdf->Cell(60, 10, 'Turno de trabajo', 1, 1, 'C', 0);

    }

    private function getEncabezado(&$pdf)
    {
        $pdf->SetFont('Times', 'B', 16);
        $pdf->SetLineWidth(0.5);
        //Creando el encabezado inicial estatico
        $pdf->Ln(10);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(13, 10, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(42, 10, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(50, 10, 'Apellidos y nombres', 1, 0, 'C', 0);
        $pdf->Cell(60, 10, 'Cargo', 1, 0, 'C', 0);
        $pdf->Cell(50, 10, 'Grupo de descanso', 1, 0, 'C', 0);
        $pdf->Cell(60, 10, 'Turno de trabajo', 1, 1, 'C', 0);
        $pdf->SetFont('Times', '', 12);
    }
}