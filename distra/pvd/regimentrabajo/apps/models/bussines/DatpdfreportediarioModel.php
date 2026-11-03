<?php

class PDFReportediario extends fpdf
{

    function Footer()
    {
        $this->Cell(0,10,$this->PageNo(),0,0,'R');
    }
}


class DatpdfreportediarioModel extends ZendExt_Model
{

    public function DatpdfModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($arreglo, $fecha, $estructura, $turnotrabajo, $horareporte, $resultado,$codigo)
    {
        $pdf = new PDFReportediario('L', 'mm',
            'A3');
        $pdf->AddPage();
        $pdffinal = $this->cabeceraReporte($pdf, $arreglo, $fecha, $estructura, $turnotrabajo, $horareporte,$codigo);
        $pdffinal = $this->cuerpoReporte($pdf, $arreglo, $resultado, $fecha, $estructura, $turnotrabajo, $horareporte,$codigo);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $arreglo, $resultado, $fecha, $estructura, $turnotrabajo, $horareporte,$codigo)
    {
        foreach ($resultado as $j => $value) {
            $pdf->SetFont('Times', 'B', 14);
            $pdf->SetX(10);
            $pdf->Cell(535, 10, "" . utf8_decode("" . $value), 1, 0, "",true);
            $pdf->Ln(10);
            foreach ($arreglo as $i => $datos) {
                if ($j == $datos['idarea']) {
                    $y = $pdf->GetY();
                    if ($y >= '270' ) {
                        $pdf->AddPage();
                        $this->cabeceraReporte($pdf, $arreglo, $fecha, $estructura, $turnotrabajo, $horareporte,$codigo);
                    }
                    $pdf->SetFont('Times', '', 14);
                    $pdf->SetX(10);
                    $pdf->Cell(10, 10, $i + 1, 1, 0, "");
                    $pdf->Cell(40, 10, "" . utf8_decode("" . $datos['numid']), 1, 0, "");
                    $pdf->Cell(80, 10, "" . utf8_decode("" . $datos['nombreapellidos']), 1, 0, "");
                    $pdf->Cell(90, 10, "" . utf8_decode("" . $datos['denomcargo']), 1, 0, "");
                    $FHE = explode(' ',$datos['fechahoraentrada']);
                    $HE = explode(':',$FHE[1]);
                    $pdf->Cell(40, 10, "" . utf8_decode("" . $HE[0].':'.$HE[1]), 1, 0, "");
                    $FHS = explode(' ',$datos['fechahorasalida']);
                    $HS = explode(':',$FHS[1]);
                    $pdf->Cell(40, 10, "" . utf8_decode("" . $HS[0].':'.$HS[1]), 1, 0, "");
                    $pdf->Cell(80, 10, "" . utf8_decode("" . $datos['causa']), 1, 0, "");
                    $pdf->Cell(40, 10, "" . utf8_decode("" . $datos['fdesde']), 1, 0, "");
                    $pdf->Cell(40, 10, "" . utf8_decode("" .$datos['fhasta']), 1, 0, "");
                    $pdf->Cell(45, 10, "" . utf8_decode("" .$datos['hrsdescontadas']), 1, 0, "");
                    $pdf->Cell(30, 10, "" . utf8_decode("" .$datos['horasextras']), 1, 0, "");
                    $pdf->Ln(10);
                }
            }
        }

        /***********************FIRMA***************************/
        $pdf->SetFont('Times', 'B', 12);
        $pdf->Ln(30);
        $pdf->SetX(20);
        $pdf->Write(10,'ELABORADO POR:');
        $pdf->SetX(300);
        $pdf->SetX(60);
        $pdf->Write(10,'____________________________________________');
        $pdf->SetX(380);
        $pdf->Write(10,'REVISADO POR:');
        $pdf->SetX(300);
        $pdf->SetX(415);
        $pdf->Write(10,'____________________________________________');
        $pdf->SetX(300);
        $pdf->Ln();
        $pdf->SetX(210);
        $pdf->Write(40,'APROBADO POR:');
        $pdf->SetX(300);
        $pdf->SetX(250);
        $pdf->Write(40,'____________________________________________');
        $pdf->SetX(300);

        return $pdf;
    }

    public function cabeceraReporte($pdf, $arreglo, $fecha, $estructura, $turnotrabajo, $horareporte,$codigo)
    {
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Text(10, 20, "CONTROL DE ASISTENCIA");
        $pdf->Ln(10);

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Text(10, 30, "Entidad: " . utf8_decode("" . $estructura));
        $pdf->Ln(10);

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Text(10, 40, utf8_decode("Código: ") . utf8_decode("" . $codigo));
        $pdf->Ln(10);

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Text(10, 50, "Fecha:" . ' ' . $fecha);
        $pdf->Ln(20);

        $pdf->SetFont('Times', 'B', 14);
        $pdf->SetX(10);
        $pdf->SetFillColor(200,220,255);
        $pdf->Cell(10, 10, "No.", 1, 0, "C",true);
        $pdf->Cell(40, 10, "" . utf8_decode("No.de identidad"), 1, 0, "C",true);
        $pdf->Cell(80, 10, "Nombre y apellidos", 1, 0, "C",true);
        $pdf->Cell(90, 10, "Cargo", 1, 0, "C",true);
        $pdf->Cell(40, 10, "Hora de entrada", 1, 0, "C",true);
        $pdf->Cell(40, 10, "Hora de salida", 1, 0, "C",true);
        $pdf->Cell(80, 10, "Causa", 1, 0, "C",true);
        $pdf->Cell(40, 10, "Desde", 1, 0, "C",true);
        $pdf->Cell(40, 10, "Hasta", 1, 0, "C",true);
        $pdf->Cell(45, 10, "Horas descontadas", 1, 0, "C",true);
        $pdf->Cell(30, 10, "Horas extras", 1, 0, "C",true);
        $pdf->Ln(10);

        return $pdf;
    }
}