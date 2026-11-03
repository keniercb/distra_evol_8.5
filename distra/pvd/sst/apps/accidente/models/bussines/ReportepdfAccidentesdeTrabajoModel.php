<?php

class PDFAccidentesdeTrabajo extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(100, 8, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(20, 8, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 8, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
    }
}


class ReportepdfAccidentesdeTrabajoModel extends ZendExt_Model
{
    public function InfoGeneralpdf()
    {
        parent::ZendExt_Model();

    }

    public function CrearReportePDF($idestructura)
    {

        $pdf = new PDFAccidentesdeTrabajo('L', 'mm', 'letter');
        $pdf->AddPage();
        $modeloNegocio = new DatAnalisisModel();
        $datos = $modeloNegocio->getDatosAccidentes($idestructura);
        //print_r($datos);die;
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {

        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetX(65);
        $pdf->Cell(143, 8, 'DATOS SOBRE ACCIDENTES DE TRABAJO DEL PERSONAL CIVIL Y MILITAR', 0, 1, 'C');
        $pdf->SetFont('Arial', 'B', 9);

        $padre = $datos[0]['padre'];
        $pdf->Cell(240, 8, utf8_decode($padre), 1, 0, 'L');
        $pdf->Cell(20, 8, utf8_decode('Cantidad'), 1, 1, 'C');

        foreach ($datos as $dat) {
            if ($padre == $dat['padre']) {
                $pdf->SetFont('Arial', '', 9);
                $y = $pdf->GetY();
                $pdf->MultiCell(240, 8, utf8_decode($dat['denominacion']), 1, 'L', 0);
                $y2 = $pdf->GetY();
                $pdf->SetY($y);
                $pdf->SetX(250);
                $pdf->Cell(20, ($y2 - $y), utf8_decode($dat['cantidad']), 1, 1, 'C');
            } else {
                $pdf->SetFont('Arial', 'B', 9);
                $padre = $dat['padre'];
                $pdf->Cell(240, 8, utf8_decode($padre), 1, 0, 'L');
                $pdf->Cell(20, 8, '', 1, 1, 'C');
                $pdf->SetFont('Arial', '', 9);
                $y = $pdf->GetY();
                $pdf->MultiCell(240, 8, utf8_decode($dat['denominacion']), 1, 'L', 0);
                $y2 = $pdf->GetY();
                $pdf->SetY($y);
                $pdf->SetX(250);
                $pdf->Cell(20, ($y2 - $y), utf8_decode($dat['cantidad']), 1, 1, 'C');

            }


        }
        return $pdf;
    }
}
