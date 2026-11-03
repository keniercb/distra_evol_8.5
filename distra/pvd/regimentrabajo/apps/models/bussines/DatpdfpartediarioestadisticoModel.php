<?php

class PDFPartediario extends fpdf
{
}


class DatpdfpartediarioestadisticoModel extends ZendExt_Model
{

    public function DatpdfpartediarioestadisticoModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($arreglo, $fecha, $horareporte, $cantidad, $causas, $tienecategorias)
    {

        $pdf = new PDFPartediario('L', 'mm',array(600,750)
            /*'A3'*/);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->SetAutoPageBreak(true);
        $pdffinal = $this->cabeceraReporte($pdf, $arreglo, $fecha, $horareporte, $cantidad, $causas);
        $pdffinal = $this->cuerpoReporte($pdf, $arreglo, $cantidad, $causas, $tienecategorias);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $arreglo, $cantidad, $causas, $tienecategorias)
    {

        $pdf->SetFont('Arial', '', 11);
        $pdf->SetX(10);
        if($tienecategorias == true)
        {
            $pdf->Cell(249, 15, "Datos generales", 1, 0, "C");
            foreach($causas as $key => $causa)
            {
                $pdf->Cell((20 * (count($causa['childrens'])))+30, 15, $causa['denom'], 1, 0, "C");
            }
            $pdf->Ln(15);
        }
        $pdf->Cell(10, 15, "No.", 1, 0, "C");
        $pdf->Cell(110, 15, "Entidad-UM", 1, 0, "C");
        $pdf->Cell(22, 15, "Por plantilla", 1, 0, "C");
        $pdf->Cell(17, 15, "Cubierto", 1, 0, "C");
        $pdf->Cell(33, 15, "Fuera de plantilla", 1, 0, "C");
        $pdf->Cell(15, 15, "Total", 1, 0, "C");
        $pdf->Cell(20, 15, "Presentes", 1, 0, "C");
        $pdf->Cell(22, 15, "Total Fuera", 1, 0, "C");
        if($tienecategorias == true)
        {
            foreach ($causas as $key => $causa) {
                foreach ($causa['childrens'] as $key => $caus) {
                    $pdf->Cell(20, 15, $caus['denom'], 1, 0, "C");
                }
                $pdf->Cell(30, 15, 'Subtotal '.$causa['denom'], 1, 0, "C");
            }
        }
        else
        {
            foreach ($causas as $key => $caus) {
                $pdf->Cell(20, 30, $caus['denom'], 1, 0, "C");
            }
        }

        $pdf->Ln(15);

        foreach ($arreglo as $i => $datos) {
            $pdf->Cell(10, 10, $i + 1, 1, 0, "");
            $pdf->Cell(110, 10, "" . utf8_decode("" . $datos['denomentidad']), 1, 0, "");
            $pdf->Cell(22, 10, "" . utf8_decode("" . $datos['porplantilla']), 1, 0, "C");
            $pdf->Cell(17, 10, "" . utf8_decode("" . $datos['cubierto']), 1, 0, "C");
            $pdf->Cell(33, 10, "" . utf8_decode("" . $datos['fueraplantilla']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $datos['totalpersonas']), 1, 0, "C");
            $pdf->Cell(20, 10, "" . utf8_decode("" . $datos['presente']), 1, 0, "C");
            $pdf->Cell(22, 10, "" . utf8_decode("" . $datos['totalfuera']), 1, 0, "C");
            if($tienecategorias == true)
            {
                foreach ($causas as $key => $causa) {
                    foreach ($causa['childrens'] as $key => $caus) {
                        $pdf->Cell(20, 10, $datos[$caus['dataindex']], 1, 0, "C");
                    }
                    $temp = explode('/', $causa['dataindex']);
                    $pdf->Cell(30, 10, $datos['subtotal/'. $temp[1]], 1, 0, "C");
                }
            }
            else
            {
                foreach ($causas as $key => $caus) {
                    $pdf->Cell(20, 10, $datos[$caus['dataindex']], 1, 0, "C");
                }
            }
            $pdf->Ln(10);
        }

        /***********************FIRMA***************************/
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Ln(30);
        $pdf->SetX(20);
        $pdf->Write(10,'ELABORADO POR:');
        $pdf->SetX(300);
        $pdf->SetX(60);
        $pdf->Write(10,'____________________________________________');
        $pdf->SetX(400);
        $pdf->Write(10,'REVISADO POR:');
        $pdf->SetX(300);
        $pdf->SetX(440);
        $pdf->Write(10,'____________________________________________');
        $pdf->SetX(300);
        $pdf->Ln();
        $pdf->SetX(225);
        $pdf->Write(40,'APROBADO POR:');
        $pdf->SetX(300);
        $pdf->SetX(265);
        $pdf->Write(40,'____________________________________________');
        $pdf->SetX(300);

        return $pdf;
    }

    public function cabeceraReporte($pdf, $arreglo, $fecha, $horareporte, $cantidad, $causas)
    {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Text(5, 20, "" . utf8_decode("PARTE DIARIO SOBRE LA SITUACIÓN DEL PERSONAL"));
        $pdf->Ln(20);

        $pdf->SetFont('Arial', '', 12);
        $pdf->Text(5, 30, "FECHA:" . ' ' . $fecha . ' - ' . $horareporte);
        $pdf->Ln(10);

        return $pdf;
    }
}