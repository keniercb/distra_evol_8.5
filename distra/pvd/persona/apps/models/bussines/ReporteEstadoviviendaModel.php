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

class ReporteEstadoviviendaModel extends ZendExt_Model
{

    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($datos)
    {

        $pdf = new PDF('P', 'mm', 'A3');
        $this->crearEncabezadoPrincipal($pdf, 'Datos  Estado de la vivienda', $datos);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {

        $pdf->SetFont('Times', '', 12);
        $datosbyentity = array();

        foreach ($datos as $p => $value) {
            $datosbyentity[$value['idarea']][0] = $value['ueb'];
            $datosbyentity[$value['idarea']][1] = array();
        }

        foreach ($datos as $p => $value) {
            $result = array();
            $result['numid'] = $value['numid'];
            $result['nombreyapellidos'] = $value['nombreyapellidos'];
            $result['cargo'] = $value['cargo'];
            $result['estadovivienda'] = $value['estadovivienda'];
            $result['convivencia'] = $value['convivencia'];
            array_push($datosbyentity [$value['idarea']][1], $result);

        }


        foreach ($datosbyentity as $k => $val) {
            $y = $pdf->GetY();
            if ($y >= '510') {
                $pdf->AddPage();
                $this->getEncabezado($pdf);
            }

            $pdf->Cell(286, 10, utf8_decode($val[0]), 1, 1, 'L', 0);
            foreach ($val[1] as $p => $va) {
                $pdf->Cell(13, 10, $p + 1, 1, 0, 'C', 0);
                $pdf->Cell(33, 10, utf8_decode($va['numid']), 1, 0, 'L', 0);
                $pdf->Cell(70, 10, utf8_decode($va['nombreyapellidos']), 1, 0, 'L', 0);
                $pdf->Cell(80, 10, utf8_decode($va['cargo']), 1, 0, 'L', 0);
                $pdf->Cell(40, 10, utf8_decode($va['estadovivienda']), 1, 0, 'L', 0);
                $pdf->Cell(50, 10, utf8_decode($va['convivencia']), 1, 1, 'L', 0);
            }
        }
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo, $datos)
    {
        $pdf->SetLeftMargin(5);
        $pdf->AddPage();
        $pdf->SetFont('Times', 'B', 18);
        $pdf->SetLineWidth(0.5);
        $pdf->Cell(290, 10, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln(10);
        $pdf->SetFont('Times', 'B', 12);
        //Creando el encabezado inicial estatico
        $pdf->Ln(10);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(13, 10, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(33, 10, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(70, 10, 'Apellidos y nombres', 1, 0, 'C', 0);
        $pdf->Cell(80, 10, 'Cargo', 1, 0, 'C', 0);
        $pdf->Cell(40, 10, 'Estado de la vivienda', 1, 0, 'C', 0);
        $pdf->Cell(50, 10, utf8_decode('Situación de convivencia'), 1, 1, 'C', 0);

    }

    private function getEncabezado(&$pdf)
    {
        $pdf->SetFont('Times', 'B', 12);
        $pdf->SetLineWidth(0.5);
        //Creando el encabezado inicial estatico
        $pdf->Ln(10);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(13, 10, 'No.', 1, 0, 'C', 0);
        $pdf->Cell(33, 10, 'No. de identidad', 1, 0, 'C', 0);
        $pdf->Cell(70, 10, 'Apellidos y nombres', 1, 0, 'C', 0);
        $pdf->Cell(80, 10, 'Cargo', 1, 0, 'C', 0);
        $pdf->Cell(40, 10, 'Estado de la vivienda', 1, 0, 'C', 0);
        $pdf->Cell(50, 10, utf8_decode('Situación de convivencia'), 1, 0, 'C', 0);
        $pdf->SetFont('Times', '', 12);
    }
}