<?php

class PDFInfoEstadistica extends fpdf
{
    function Footer()
    {
        $this->Cell(0,10,$this->PageNo(),0,0,'R');
    }
}


class DatpdfInfoEstModel extends ZendExt_Model
{

    public function DatpdfInfoEstModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($result,$mes,$denomestructura,$fecha,$fechdesde,$fechhasta)
    {

        $pdf = new PDFInfoEstadistica('L', 'mm',/*array(600,565)*/
            'A3');
        $pdf->AddPage();
        $pdffinal = $this->cabeceraReporte($pdf,$mes,$denomestructura,$fecha,$fechdesde,$fechhasta);
        $pdffinal = $this->cuerpoReporte($pdf,$result,$mes,$denomestructura,$fecha,$fechdesde,$fechhasta);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $result,$mes,$denomestructura,$fecha,$fechdesde,$fechhasta)
    {
        foreach ($result as $j => $value) {
            $y = $pdf->GetY();
            if ($y >= '250' ) {
                $pdf->AddPage();
                $this->cabeceraReporte($pdf, $mes,$denomestructura,$fecha,$fechdesde,$fechhasta);
            }
            $pdf->SetFont('Times', '', 14);
            $pdf->SetX(15);
            $pdf->Cell(10, 10, $j + 1, 1, 0, "");
            $pdf->Cell(150, 10, "" . utf8_decode("" . $value->text), 1, 0, "");
            $pdf->Cell(50, 10, "" . utf8_decode("" . $value->ft), 1, 0, "");
            $pdf->Cell(60, 10, "" . utf8_decode("" . $value->trt), 1, 0, "");
            $pdf->Cell(50, 10, "" . utf8_decode("" . $value->hp), 1, 0, "");
            $pdf->Cell(50, 10, "" . utf8_decode("" . $value->he), 1, 0, "");
            $pdf->Cell(50, 10, "" . utf8_decode("" . $value->hf), 1, 0, "");
            $pdf->Cell(80, 10, "" . utf8_decode("" . $value->hft), 1, 0, "");
            $pdf->Ln(10);
        }

        /***********************FIRMA***************************/
        $pdf->SetFont('Times', 'B', 12);
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

    public function cabeceraReporte($pdf, $mes,$denomestructura,$fecha,$fechdesde,$fechhasta)
    {
        $mes = $this->getMes($mes);
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Text(15, 20, utf8_decode('Reporte estadístico de la asistencia del mes de '.$mes));
        $pdf->Ln(10);

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Text(15, 30, "" . utf8_decode("" . $denomestructura));
        $pdf->Ln(10);

        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Text(15, 40, utf8_decode("Período: ") . ' ' . $fechdesde. ' - '.$fechhasta);
        $pdf->Ln(20);

        $pdf->SetFont('Times', 'B', 14);
        $pdf->SetX(15);
        $pdf->SetFillColor(200,220,255);
        $pdf->Cell(10, 10, "No.", 1, 0, "",true);
        $pdf->Cell(150, 10, "" . utf8_decode("Entidad|Área|Cargo"), 1, 0, "C",true);
        $pdf->Cell(50, 10, "Fondo de tiempo", 1, 0, "C",true);
        $pdf->Cell(60, 10, "Tiempo real trabajado", 1, 0, "C",true);
        $pdf->Cell(50, 10, "Horas perdidas", 1, 0, "C",true);
        $pdf->Cell(50, 10, "Horas extras", 1, 0, "C",true);
        $pdf->Cell(50, 10, "Horas feriadas", 1, 0, "C",true);
        $pdf->Cell(80, 10, "Horas feriadas trabajadas", 1, 0, "C",true);
        $pdf->Ln(10);
        return $pdf;
    }

    private function getMes($mesnum)
    {
        if ($mesnum == 1){ return 'Enero';
        } else if ($mesnum == 2){ return 'Febrero';
        } else if ($mesnum == 3){ return 'Marzo';
        } else if ($mesnum == 4){ return 'Abril';
        } else if ($mesnum == 5){ return 'Mayo';
        } else if ($mesnum == 6){ return 'Junio';
        } else if ($mesnum == 7){ return 'Julio';
        } else if ($mesnum == 8){ return 'Agosto';
        } else if ($mesnum == 9){ return 'Septiembre';
        } else if ($mesnum == 10){ return 'Octubre';
        } else if ($mesnum == 11){ return 'Noviembre';
        } else if ($mesnum == 12){ return 'Diciembre';
        } else {return '';}
    }
}