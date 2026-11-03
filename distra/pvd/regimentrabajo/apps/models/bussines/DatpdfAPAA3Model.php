<?php

class PDFAPAA3 extends fpdf
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


class DatpdfAPAA3Model extends ZendExt_Model
{

    public function DatpdfAPAModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($result, $causas, $mes, $denomestructura, $fecha, $resultado, $fechdesde, $fechhasta, $trtMilitares,$tipohoja)
    {
        if($tipohoja == 3)
            $formato = 'A3';
        else if($tipohoja == 1)
            $formato = array(594,841);
        else if($tipohoja == 0)
            $formato = array(841,1189);

        $pdf = new PDFAPAA3('L', 'mm', $formato);
        $pdf->AddPage();
        $this->table = new Tableml($pdf);
        $pdffinal = $this->cabeceraReporte($pdf, $mes, $denomestructura, $fecha, $causas, $fechdesde, $fechhasta, $trtMilitares,$tipohoja);
        $pdffinal = $this->cuerpoReporte($pdf, $result, $causas, $mes, $denomestructura, $fecha, $resultado, $fechdesde, $fechhasta, $trtMilitares,$tipohoja);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $result, $causas, $mes, $denomestructura, $fecha, $resultado, $fechdesde, $fechhasta, $trtMilitares,$tipohoja)
    {
        $contA = 1;
        $cell_width = 15;
        foreach ($resultado as $jarea => $valuearea) {
            $pdf->SetFont('Arial', '', 11);
            $pdf->SetFillColor(200);
            $cantidad = count($causas);
            if($trtMilitares)
                $cantidad += 1;
            $tamano = 10 + 30 + 60 + 70 + $cantidad * $cell_width + 180;
            $pdf->Cell($tamano, 5, "" . utf8_decode("" . $valuearea), 1, 1, "", true);
            foreach ($result as $k => $valores) {
                if ($valuearea == $valores['denomarea']) {
                    $y = $pdf->GetY();
                    if($tipohoja == 3)
                        $valor = '250';
                    else if($tipohoja == 1)
                        $valor = '550';
                    else if($tipohoja == 0)
                        $valor = '800';
                    if ($y >= $valor) {
                        $pdf->AddPage();
                        $this->getEncabezado($pdf, $mes, $denomestructura, $fecha, $causas, $fechdesde, $fechhasta, $trtMilitares);
                    }
                    $widthHeaderTable = array(10,30,60,70);
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

                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    array_push($widthHeaderTable, 15);
                    if($trtMilitares)
                        array_push($widthHeaderTable,15);

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
                    $this->table->Row($arr,0,0,11);
                    $contA++;
                }
            }
        }

        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Write(70, '_________________________________________________');
        $pdf->SetX(400);
        $pdf->Write(70, '_________________________________________________');
        $pdf->Ln(5);
        $pdf->SetX(50);
        $pdf->Write(70, 'Elaborado por:');
        $pdf->SetX(450);
        $pdf->Write(70, utf8_decode('Revisado por:'));
        $pdf->Ln(30);
        $pdf->SetX(200);
        $pdf->Write(70, '_________________________________________________');
        $pdf->Ln(5);
        $pdf->SetX(245);
        $pdf->Write(70, 'Aprobado por:');
		
		/*$pdf->Ln(30);
        $pdf->SetX(30);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(70, 5, utf8_decode('Autorizado'), "T", 0, 'C', 0);
        $pdf->Cell(90, 5, "", 0, 0, 'C', 0);
        $pdf->Cell(70, 5, utf8_decode('Aprobado'), "T", 0, 'C', 0);
        $pdf->Ln(5);*/
		
        return $pdf;
    }

    public function cabeceraReporte($pdf, $mes, $denomestructura, $fecha, $causas, $fechdesde, $fechhasta, $trtMilitares,$tipohoja)
    {
        $datentidad = $_SESSION['Zeolides']['entidad'];

        //$entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($datentidad->idestructura);

       /* if (!empty($entidad[0]->logo)) {
            $image = explode(';', $entidad[0]->logo);
            $extension = explode('/', $image[0]);
            $pdf->Image($entidad[0]->logo, 110, 10, 80, 20, $extension[1]);
            $pdf->Ln(25);
        }*/
        if($tipohoja == 3){
            $valor = '550';
            $valor1 = '500';
        }else if($tipohoja == 1){
            $valor = '850';
            $valor1 = '800';
        }else if($tipohoja == 0){
            $valor = '1150';
            $valor1 = '1100';
        }
        $pdf->SetLeftMargin(5);

        $pdf->SetFont('Arial', 'B', 16);
        $pdf->SetLineWidth(0);
        $pdf->Cell($valor, 5, utf8_decode('MODELO SC-4-05 - PRENOMINA'), 0, 1, 'C', 0);
        $pdf->Ln(5);

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(20, 5, utf8_decode('Entidad: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(40, 5, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 1, 'L', 0);
        $pdf->Ln(2);

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(20, 5, utf8_decode('Código: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(40, 5, utf8_decode($datentidad->codigo), 0, 1, 'L', 0);
        $pdf->Ln(2);

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(20, 5, utf8_decode('Período: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(40, 5, $fechdesde . ' - ' . $fechhasta, 0, 0, 'L', 0);
        $pdf->Ln(5);

        $pdf->Cell($valor1, 5, '', 0, 0, 'L', 0);

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(10, 5, utf8_decode('No: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(30, 5, $mes, 0, 1, 'L', 0);
        $pdf->Ln(5);

        $pdf->SetFont('Arial', 'B', 12);
//        $pdf->SetFillColor(193, 213, 240);
        $pdf->SetFillColor(200);

        $widthHeaderTable = array(10,30,60,70);
        $align = ['L','L','L','L'];
        $arr = array(
            'No.',utf8_decode("No. Identidad")
        );
        array_push($arr, utf8_decode("Nombres y apellidos"));
        array_push($arr, utf8_decode("Cargo"));
        foreach ($causas as $ind => $causa) {
            array_push($widthHeaderTable, 15);
            array_push($align, 'C');
            array_push($arr, utf8_decode("" . $causa['denom']));
        }
        array_push($arr, 'TOTAL');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'SC');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'FT');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'TRT');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HP');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HE');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'DL');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'DT');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HF');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HFT');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HTE');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HRL');array_push($widthHeaderTable, 15);array_push($align, 'C');
        if($trtMilitares)
            array_push($arr, 'DTM');array_push($widthHeaderTable, 15);array_push($align, 'C');
        $this->alingsArray = $align;
        $this->table->SetAligns($this->alingsArray);
        $this->table->SetWidths($widthHeaderTable);
        $this->table->Row($arr,0,0,11);

        /*$pdf->Cell(10, 10, "No.", 1, 0, "", true);
        $pdf->Cell(30, 10, "" . utf8_decode("No. Identidad"), 1, 0, "", true);
        $pdf->Cell(60, 10, "Nombres y apellidos", 1, 0, "", true);
        $pdf->Cell(70, 10, "Cargo", 1, 0, "", true);
        foreach ($causas as $ind => $causa) {
            $pdf->Cell(15, 10, "" . utf8_decode("" . $causa['denom']), 1, 0, "C", true);
        }
        $pdf->Cell(15, 10, 'TOTAL', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'SC', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'FT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'TRT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HP', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HE', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'DL', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'DT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HF', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HFT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HTE', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HRL', 1, 0, 'C', true);
        if($trtMilitares)
            $pdf->Cell(15, 10, 'DTM', 1, 0, 'C', true);
        $pdf->Ln(10);*/

        return $pdf;
    }

    public function getEncabezado($pdf, $mes, $denomestructura, $fecha, $causas, $fechdesde, $fechhasta, $trtMilitares)
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $pdf->SetLeftMargin(5);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 12);
//        $pdf->SetFillColor(193, 213, 240);
        $pdf->SetFillColor(200);

        $widthHeaderTable = array(10,30,60,70);
        $align = ['L','L','L','L'];
        $arr = array(
            'No.',utf8_decode("No. Identidad")
        );
        array_push($arr, utf8_decode("Nombres y apellidos"));
        array_push($arr, utf8_decode("Cargo"));
        foreach ($causas as $ind => $causa) {
            array_push($widthHeaderTable, 15);
            array_push($align, 'C');
            array_push($arr, utf8_decode("" . $causa['denom']));
        }
        array_push($arr, 'TOTAL');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'SC');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'FT');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'TRT');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HP');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HE');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'DL');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'DT');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HF');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HFT');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HTE');array_push($widthHeaderTable, 15);array_push($align, 'C');
        array_push($arr, 'HRL');array_push($widthHeaderTable, 15);array_push($align, 'C');
        if($trtMilitares)
            array_push($arr, 'DTM');array_push($widthHeaderTable, 15);array_push($align, 'C');
        $this->alingsArray = $align;
        $this->table->SetAligns($this->alingsArray);
        $this->table->SetWidths($widthHeaderTable);
        $this->table->Row($arr,0,0,11);
        /*$pdf->Cell(10, 10, "No.", 1, 0, "", true);
        $pdf->Cell(30, 10, "" . utf8_decode("No. Identidad"), 1, 0, "", true);
        $pdf->Cell(60, 10, "Nombres y apellidos", 1, 0, "", true);
        $pdf->Cell(70, 10, "Cargo", 1, 0, "", true);
        foreach ($causas as $ind => $causa) {
            $pdf->multiCell(15, 10, "" . utf8_decode("" . $causa['denom']), 1, 0, "C", true);
        }
        $pdf->Cell(15, 10, 'TOTAL', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'SC', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'FT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'TRT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HP', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HE', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'DL', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'DT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HF', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HFT', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HTE', 1, 0, 'C', true);
        $pdf->Cell(15, 10, 'HRL', 1, 0, 'C', true);
        if($trtMilitares)
            $pdf->Cell(15, 10, 'DTM', 1, 0, 'C', true);
        $pdf->Ln(10);*/

        return $pdf;
    }

}