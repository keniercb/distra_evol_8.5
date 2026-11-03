<?php

class PDFAPA extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($datentidad->idestructura);
        $this->SetY(-15);
        $this->SetX(5);
        $this->SetFont('Arial', 'I', 7);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');

    }
}


class DatpdfAPAModel extends ZendExt_Model
{

    public function DatpdfAPAModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($result, $causas, $mes, $denomestructura, $fecha, $resultado, $fechdesde, $fechhasta, $trtMilitares)
    {
        $pdf = new PDFAPA('L', 'mm', 'A4');
        $pdf->AddPage();
        $this->table = new Tableml($pdf);
        $pdffinal = $this->cabeceraReporte($pdf, $mes, $denomestructura, $fecha, $causas, $fechdesde, $fechhasta, $trtMilitares);
        $pdffinal = $this->cuerpoReporte($pdf, $result, $causas, $mes, $denomestructura, $fecha, $resultado, $fechdesde, $fechhasta, $trtMilitares);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $result, $causas, $mes, $denomestructura, $fecha, $resultado, $fechdesde, $fechhasta, $trtMilitares)
    {
        $pdf->SetFont('Arial', '', 7);
        $contA = 1;
        $cell_width = 10;
        foreach ($resultado as $jarea => $valuearea) {
            $pdf->SetFillColor(200);
            $cantidad = count($causas);
            if($trtMilitares)
                $cantidad += 0.80;
            $tamano = 5 + 20 + 40 + 45 + $cantidad * $cell_width + 104;
            $pdf->Cell($tamano, 5, "" . utf8_decode("" . $valuearea), 1, 1, "", true);
            foreach ($result as $k => $valores) {
                if ($valuearea == $valores['denomarea']) {
                    $y = $pdf->GetY();
                    if ($y >= '180') {
                        $pdf->AddPage();
                        $this->getEncabezado($pdf, $mes, $denomestructura, $fecha, $causas, $fechdesde, $fechhasta, $trtMilitares);
                    }
                    $widthHeaderTable = array(5,20,40,45);
                    $align = ['L','L','L','L'];
                    $arr = array(
                        $contA,utf8_decode($valores['numid'])
                    );
                    array_push($arr, utf8_decode($valores['nombreapellidos']));
                    array_push($arr, utf8_decode($valores['denomcargo']));

                    foreach ($causas as $j => $causa) {
                        if ($valores[$causa['dataindex'].'_horas']) {
                            $hora1 = $valores[$causa['dataindex'].'_horas'];
                        } else {
                            $hora1 = '';
                        }
                        array_push($arr, $hora1);
                        array_push($widthHeaderTable, $cell_width);
                        array_push($align, 'C');
                    }
                    if ($valores['total'] != '') {
                        $total1 = $valores['total'];
                    } else {
                        $total1 = '';
                    }

                    array_push($arr, $total1);
                    array_push($arr, $valores['sc']);
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

                    array_push($widthHeaderTable, 10);
                    array_push($widthHeaderTable, 8);
                    array_push($widthHeaderTable, 10);
                    array_push($widthHeaderTable, 10);
                    array_push($widthHeaderTable, 10);
                    array_push($widthHeaderTable, 8);
                    array_push($widthHeaderTable, 8);
                    array_push($widthHeaderTable, 8);
                    array_push($widthHeaderTable, 8);
                    array_push($widthHeaderTable, 8);
                    array_push($widthHeaderTable, 8);
                    array_push($widthHeaderTable, 8);
                    if($trtMilitares)
                        array_push($widthHeaderTable,8);

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
                    array_push($align, 'C');
                    array_push($align, 'C');
                    if($trtMilitares)
                        array_push($align, 'C');

                    $this->alingsArray = $align;
                    $this->table->SetAligns($this->alingsArray);
                    $this->table->SetWidths($widthHeaderTable);
                    $this->table->Row($arr,0,0,7);
                    $contA++;
                }
            }
        }
        $pdf->SetFont('Arial', 'B', 7);
        $pdf->Write(40, '_________________________________________________');

        $pdf->SetX(200);
        $pdf->Write(40, '_________________________________________________');

        $pdf->Ln(5);
        $pdf->SetX(30);
        $pdf->Write(40, 'Elaborado por:');

        $pdf->SetX(230);
        $pdf->Write(40, utf8_decode('Revisado por:'));

        $pdf->Ln(20);
        $pdf->SetX(100);
        $pdf->Write(40, '_________________________________________________');
        $pdf->Ln(5);
        $pdf->SetX(125);
        $pdf->Write(40, 'Aprobado por:');
        return $pdf;
    }

    public function cabeceraReporte($pdf, $mes, $denomestructura, $fecha, $causas, $fechdesde, $fechhasta, $trtMilitares)
    {
        $datentidad = $_SESSION['Zeolides']['entidad'];

        //$entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($datentidad->idestructura);

       /* if (!empty($entidad[0]->logo)) {
            $image = explode(';', $entidad[0]->logo);
            $extension = explode('/', $image[0]);
            $pdf->Image($entidad[0]->logo, 110, 10, 80, 20, $extension[1]);
            $pdf->Ln(25);
        }*/

        $pdf->SetLeftMargin(5);

        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetLineWidth(0);
        $pdf->Cell(280, 5, utf8_decode('MODELO SC-4-05 - PRENOMINA'), 0, 1, 'C', 0);
        $pdf->Ln(5);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(14, 5, utf8_decode('Entidad: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(30, 5, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 1, 'L', 0);
        $pdf->Ln(2);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(14, 5, utf8_decode('Código: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(30, 5, utf8_decode($datentidad->codigo), 0, 1, 'L', 0);
        $pdf->Ln(2);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(14, 5, utf8_decode('Período: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(30, 5, $fechdesde . ' - ' . $fechhasta, 0, 0, 'L', 0);
        //$pdf->Ln(5);
        $pdf->Cell(210, 5, '', 0, 0, 'L', 0);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(5, 5, utf8_decode('No: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(30, 5, $mes, 0, 1, 'L', 0);
        $pdf->Ln(5);

        $pdf->SetFont('Arial', 'B', 7);
//        $pdf->SetFillColor(193, 213, 240);
        $pdf->SetFillColor(200);
        $pdf->Cell(5, 5, "No", 1, 0, "", true);
        $pdf->Cell(20, 5, "" . utf8_decode("No. Identidad"), 1, 0, "", true);
        $pdf->Cell(40, 5, "Nombres y apellidos", 1, 0, "", true);
        $pdf->Cell(45, 5, "Cargo", 1, 0, "", true);
        foreach ($causas as $ind => $causa) {
            $pdf->Cell(10, 5, "" . utf8_decode("" . $causa['denom']), 1, 0, "C", true);
        }
        $pdf->Cell(10, 5, 'TOTAL', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'SC', 1, 0, 'C', true);
        $pdf->Cell(10, 5, 'FT', 1, 0, 'C', true);
        $pdf->Cell(10, 5, 'TRT', 1, 0, 'C', true);
        $pdf->Cell(10, 5, 'HP', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HE', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'DL', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'DT', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HF', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HFT', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HTE', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HRL', 1, 0, 'C', true);
        if($trtMilitares)
            $pdf->Cell(8, 5, 'DTM', 1, 0, 'C', true);
        $pdf->Ln(5);

        return $pdf;
    }

    public function getEncabezado($pdf, $mes, $denomestructura, $fecha, $causas, $fechdesde, $fechhasta, $trtMilitares)
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $pdf->SetLeftMargin(5);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 7);
//        $pdf->SetFillColor(193, 213, 240);
        $pdf->SetFillColor(200);
        $pdf->Cell(5, 5, "No", 1, 0, "", true);
        $pdf->Cell(20, 5, "" . utf8_decode("No. Identidad"), 1, 0, "", true);
        $pdf->Cell(40, 5, "Nombres y apellidos", 1, 0, "", true);
        $pdf->Cell(45, 5, "Cargo", 1, 0, "", true);
        foreach ($causas as $ind => $causa) {
            $pdf->Cell(10, 5, "" . utf8_decode("" . $causa['denom']), 1, 0, "C", true);
        }
        $pdf->Cell(10, 5, 'TOTAL', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'SC', 1, 0, 'C', true);
        $pdf->Cell(10, 5, 'FT', 1, 0, 'C', true);
        $pdf->Cell(10, 5, 'TRT', 1, 0, 'C', true);
        $pdf->Cell(10, 5, 'HP', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HE', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'DL', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'DT', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HF', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HFT', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HTE', 1, 0, 'C', true);
        $pdf->Cell(8, 5, 'HRL', 1, 0, 'C', true);
        if($trtMilitares)
            $pdf->Cell(8, 5, 'DTM', 1, 0, 'C', true);
        $pdf->Ln(5);

        return $pdf;
    }

}