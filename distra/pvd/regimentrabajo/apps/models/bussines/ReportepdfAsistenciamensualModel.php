<?php

class PDFReporteAsistencia extends fpdf
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

class ReportepdfAsistenciamensualModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($datos, $columnas, $fechdesde, $fechhasta, $resultado, $tiporeporte, $trtMilitares)
    {

       // $pdf = new PDFReporteAsistencia('L', 'mm', array(750, 720));
        $pdf = new PDFReporteAsistencia('L', 'mm', array(750, 810));
        $pdf->AddPage();
        $this->table = new Tableml($pdf);
        $pdffinal = $this->crearEncabezadoPrincipal($pdf, $datos, $columnas, $fechdesde, $fechhasta, $tiporeporte, $trtMilitares);
        $pdffinal = $this->crearCuerpo($pdf, $datos, $columnas, $fechdesde, $fechhasta, $resultado, $tiporeporte, $trtMilitares);
        ob_clean();
        $pdffinal->Output();
    }

    private function crearCuerpo($pdf, $datos, $columnas, $fechdesde, $fechhasta, $resultado, $tiporeporte, $trtMilitares)
    {
        $pdf->SetFont('Arial', '', 12);
        $contA = 1;
        foreach ($resultado as $jarea => $valuearea) {
            $pdf->SetFillColor(200);
            $cantidad = count($columnas);
            if($trtMilitares)
                $cantidad += 0.71;
            $tamano = 10 + 30 + 40 + 50 + $cantidad * 17 + 15 * 3 + 12 * 7;
            $pdf->Cell($tamano, 10, "" . utf8_decode("" . $valuearea), 1, 1, "", true);
            foreach ($datos as $k => $valores) {
                if ($valuearea == $valores['denomarea']) {
                    $y = $pdf->GetY();
                    if ($y >= '700') {
                        $pdf->AddPage();
                        $this->getEncabezado($pdf, $columnas, $fechdesde, $fechhasta, $tiporeporte, $trtMilitares);
                    }
                    $widthHeaderTable = array(10,30,40,50);
                    $align = ['L','L','L','L'];
                    $arr = array(
                        $contA,utf8_decode($valores['numid'])
                    );
                    array_push($arr, utf8_decode($valores['nombreapellidos']));
                    array_push($arr, utf8_decode($valores['denomcargo']));

                    foreach ($columnas as $j => $value) {
                        array_push($arr, utf8_decode($valores[$value]));
                        array_push($widthHeaderTable, 17);
                        array_push($align, 'C');
                    }

                    array_push($arr, $valores['ft']);
                    array_push($arr, $valores['trt']);
                    array_push($arr, $valores['hp']);
                    array_push($arr, $valores['he']);
                    array_push($arr, $valores['diaslab']);
                    array_push($arr, $valores['diastrab']);
                    array_push($arr, $valores['hf']);
                    array_push($arr, $valores['hft']);
                    array_push($arr, $valores['hte']);
                    array_push($arr, $valores['hrl']);
                    if($trtMilitares)
                        array_push($arr,$valores['diastrabmilit']);

                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 12);
                    array_push($widthHeaderTable, 12);
                    array_push($widthHeaderTable, 12);
                    array_push($widthHeaderTable, 12);
                    array_push($widthHeaderTable, 12);
                    array_push($widthHeaderTable, 12);
                    array_push($widthHeaderTable, 12);
                    if($trtMilitares)
                        array_push($widthHeaderTable,12);

                    array_push($align, 'C');
                    array_push($align, 'C');
                    array_push($align, 'C');
                    array_push($align, 'C');
                    array_push($align, 'C');
                    array_push($align, 'C');
                    array_push($align, 'C');
                    array_push($align, 'C');
                    array_push($align, 'C');
                    array_push($align, 'C');
                    if($trtMilitares)
                        array_push($align, 'C');

                    $this->alingsArray = $align;
                    $this->table->SetAligns($this->alingsArray);
                    $this->table->SetWidths($widthHeaderTable);
                    $this->table->Row($arr,0,0,12);
                    $contA++;
                }
            }
        }
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $datos, $columnas, $fechdesde, $fechhasta, $tiporeporte, $trtMilitares)
    {
        $pdf->SetLeftMargin(10);
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->SetLineWidth(0);
        $pdf->Cell(750, 5, utf8_decode('RESUMEN DE ASISTENCIA'), 0, 1, 'C', 0);
        $pdf->Ln(5);

        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(30, 5, utf8_decode('Entidad: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(50, 5, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 1, 'L', 0);
        $pdf->Ln(5);

        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(30, 5, utf8_decode('Período: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 18);
        $pdf->Cell(50, 5, $fechdesde . ' - ' . $fechhasta, 0, 1, 'L', 0);
        $pdf->Ln(5);
        if ($tiporeporte == 1) {
            $reporte = 'Horas Trabajadas';
        } else {
            $reporte = 'Horas Perdidas';
        }
        $pdf->Cell(20, 6, "" . utf8_decode("Reporte de ") . ' ' . $reporte, 0, 0, 'L', 0);

        $pdf->Ln(15);

        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetFillColor(200);
        $pdf->Cell(10, 10, 'No', 1, 0, 'C', true);
        $pdf->Cell(30, 10, 'CI', 1, 0, 'C', true);
        $pdf->Cell(40, 10, 'Nombre y apellidos', 1, 0, 'C', true);
        $pdf->Cell(50, 10, 'Cargo', 1, 0, 'C', true);

        foreach ($columnas as $j => $value) {
            $pdf->Cell(17, 10, $value, 1, 0, 'C', true);
        }
        $pdf->SetFillColor(200);
        $pdf->Cell(15, 10, 'FT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'TRT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HP', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HE', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'DL', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'DT', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HF', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HFT', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HTE', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HRL', 1, 0, 'C', true);
        if($trtMilitares)
            $pdf->Cell(12, 10, 'DTM', 1, 0, 'C', true);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 12);
        return $pdf;
    }

    private function getEncabezado(&$pdf, $columnas, $fechdesde, $fechhasta, $tiporeporte, $trtMilitares)
    {
        $pdf->SetLeftMargin(10);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetFillColor(200);
        $pdf->Cell(10, 10, 'No', 1, 0, 'C', true);
        $pdf->Cell(30, 10, 'CI', 1, 0, 'C', true);
        $pdf->Cell(40, 10, 'Nombre y apellidos', 1, 0, 'C', true);
        $pdf->Cell(50, 10, 'Cargo', 1, 0, 'C', true);
        foreach ($columnas as $j => $value) {
            $pdf->Cell(17, 10, $value, 1, 0, 'C', true);
        }
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(15, 10, 'FT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'TRT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HP', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HE', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'DL', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'DT', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HF', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HFT', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HTE', 1, 0, 'C', true);
        $pdf->Cell(12, 10, 'HRL', 1, 0, 'C', true);
        if($trtMilitares)
            $pdf->Cell(12, 10, 'DTM', 1, 0, 'C', true);
        $pdf->SetFont('Arial', '', 12);
        $pdf->Ln(10);
    }

}

