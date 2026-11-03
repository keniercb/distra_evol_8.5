<?php

class PDFPromedioTrabajadores extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($datentidad->idestructura);
        $this->SetY(-15);
        $this->SetX(5);
        $this->SetFont('Arial', 'I', 10);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
    }
}

class DatpdfpromediotrabajadoresModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($datos, $fdesde, $fhasta, $denomestructura)
    {
        $pdf = new PDFPromedioTrabajadores('L', 'mm', 'A3');
        $pdf->AddPage();
        $this->table = new Tableml($pdf);
        $pdffinal = $this->crearEncabezadoPrincipal($pdf, $datos, $fdesde, $fhasta, $denomestructura);
        $pdffinal = $this->crearCuerpo($pdf, $datos, $fdesde, $fhasta);
        ob_clean();
        $pdffinal->Output();
    }

    private function crearCuerpo($pdf, $datos, $fdesde, $fhasta)
    {
        $pdf->SetFont('Arial', '', 12);
        $pdf->SetFillColor(200);
        $cantidad = count($datos['columnas']);
        $tamano = 60 + $cantidad;
        foreach ($datos['datos'] as $k => $valores) {
            $y = $pdf->GetY();
            if ($y >= '250') {
                $pdf->AddPage();
                $this->getEncabezado($pdf, $datos, $fdesde, $fhasta);
            }
            $widthHeaderTable = array(60);
            $align = ['L'];
            $arr = array(
                utf8_decode($valores['concepto'])
            );

            foreach ($datos['columnas'] as $j => $value) {
                array_push($arr, utf8_decode($valores[$value]));
                array_push($widthHeaderTable, 15);
                array_push($align, 'C');
            }
            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $this->table->Row($arr, 0, 0, 12);
        }
        $pdf->SetLeftMargin(10);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(75, 5, utf8_decode('Promedio de Trabajadores: '. $datos['promediototal']), 0, 1, 'C', 0);
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $datos, $fdesde, $fhasta, $denomestructura)
    {
        $pdf->SetLeftMargin(10);
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->SetLineWidth(0);
        $pdf->Cell(550, 5, utf8_decode('Promedio de Trabajadores'), 0, 1, 'C', 0);
        $pdf->Ln(5);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(30, 5, utf8_decode($denomestructura), 0, 1, 'L', 0);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(30, 5, $fdesde . ' - ' . $fhasta, 0, 1, 'L', 0);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetFillColor(200);
        $pdf->Cell(60, 10, utf8_decode('Conceptos/Días'), 1, 0, 'C', true);

        foreach ($datos['columnas'] as $j => $value) {
            $pdf->Cell(15, 10, $value, 1, 0, 'C', true);
        }
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 12);
        return $pdf;
    }

    private function getEncabezado(&$pdf, $datos, $fdesde, $fhasta)
    {
        $pdf->SetLeftMargin(10);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetFillColor(200);
        $pdf->Cell(60, 10, utf8_decode('Conceptos/Días'), 1, 0, 'C', true);
        foreach ($datos['columnas'] as $j => $value) {
            $pdf->Cell(15, 10, $value, 1, 0, 'C', true);
        }
        $pdf->SetFont('Arial', '', 12);
        $pdf->Ln(10);
    }

}

