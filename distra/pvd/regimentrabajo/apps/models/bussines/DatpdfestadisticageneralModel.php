<?php

class PDFPartediario extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 9);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
    }
}


class DatpdfestadisticageneralModel extends ZendExt_Model
{

    public function DatpdfestadisticageneralModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($arreglo, $fdesde, $fhasta, $tiporeporte)
    {
        $pdf = new PDFPartediario('L', 'mm', 'A3');
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 20);
        $this->table = new Tableml($pdf);
        $pdffinal = $this->cabeceraReporte($pdf, $arreglo, $fdesde, $fhasta);
        $pdffinal = $this->cuerpoReporte($pdf, $arreglo, $arreglo['causasP'], $arreglo['causasA'], true, $tiporeporte);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $arreglo, $causasP, $causasA, $tienecategorias, $tiporeporte)
    {

        $pdf->SetFont('Arial', '', 12);
        $pdf->SetX(10);
        $pdf->SetFillColor(200);

        if ($tiporeporte == 1)
            $DG = 125;
        else if ($tiporeporte == 2)
            $DG = 95;
        else if ($tiporeporte == 3)
            $DG = 62;
        else if ($tiporeporte == 4)
            $DG = 77;

        $pdf->Cell($DG, 15, "Datos generales", 1, 0, "C", 1);

        $pdf->Cell((15 * (count($causasP)) + 42), 15, 'Presentes', 1, 0, "C", 1);
        $pdf->Cell((15 * (count($causasA)) + 20), 15, 'Ausentes', 1, 0, "C", 1);

        $pdf->Ln(15);

        $align1 = ['C'];
        if ($tiporeporte == 1) {
            $arr1 = array(utf8_decode("" . 'Estructura'));
            $widthHeaderTable1 = array(70);
        } else if ($tiporeporte == 2) {
            $arr1 = array(utf8_decode("" . 'Categoría ocupacional'));
            $widthHeaderTable1 = array(40);
        } else if ($tiporeporte == 3) {
            $arr1 = array(utf8_decode("" . 'Fecha'));
            $widthHeaderTable1 = array(40);
        } else if ($tiporeporte == 4) {
            $arr1 = array(utf8_decode("" . 'Género'));
            $widthHeaderTable1 = array(40);
        }

        if ($tiporeporte == 1 || $tiporeporte == 2) {
            array_push($arr1, utf8_decode("Por plantilla"));
            array_push($widthHeaderTable1, 18);
            array_push($align1, 'C');
        }

        if ($tiporeporte != 3) {
            array_push($arr1, utf8_decode("Real"));
            //array_push($arr1, utf8_decode("Sin registro"));
            array_push($widthHeaderTable1, 15);
            //array_push($widthHeaderTable1, 20);
            array_push($align1, 'C');
            //array_push($align1, 'C');
        }
        /*if ($tiporeporte == 3) {
            array_push($arr1, utf8_decode("Sin registro"));
            array_push($widthHeaderTable1, 20);
            array_push($align1, 'C');
        }*/
        array_push($arr1, utf8_decode("Con asistencia"));
        array_push($arr1, utf8_decode("Total presentes"));
        array_push($arr1, utf8_decode("En la entidad"));
        array_push($widthHeaderTable1, 22);
        array_push($widthHeaderTable1, 22);
        array_push($widthHeaderTable1, 20);
        array_push($align1, 'C');
        array_push($align1, 'C');
        array_push($align1, 'C');

        foreach ($causasP as $key => $causaP) {
            array_push($arr1, $causaP['denom']);
            array_push($widthHeaderTable1, 15);
            array_push($align1, 'C');
        }

        array_push($arr1, utf8_decode("Total ausentes"));
        array_push($widthHeaderTable1, 20);
        array_push($align1, 'C');

        foreach ($causasA as $key => $causaA) {
            array_push($arr1, $causaA['denom']);
            array_push($widthHeaderTable1, 15);
            array_push($align1, 'C');
        }
        $this->alingsArray = $align1;
        $this->table->SetAligns($this->alingsArray);
        $this->table->SetWidths($widthHeaderTable1);
        $this->table->Row($arr1, 0, 0, 12);

        $totalpplantilla = 0;
        $totalcubierto = 0;
        $totalpresente = 0;
        $totaltotalfuera = 0;
        $totalcausa = array();

        foreach ($arreglo['datos'] as $i => $datos) {
            if ($tiporeporte != 3) {
                $totalpplantilla = $totalpplantilla + $datos['porplantilla'];
                $totalcubierto = $totalcubierto + $datos['cubierto'];
            }

            if ($tiporeporte == 1)
                $widthHeaderTable = array(70);
            else
                $widthHeaderTable = array(40);
            $align = ['L'];
            $arr = array(utf8_decode("" . $datos['estructura']));

            if ($tiporeporte == 1 || $tiporeporte == 2) {
                array_push($arr, utf8_decode($datos['porplantilla']));
                array_push($widthHeaderTable, 18);
                array_push($align, 'L');
            }
            if ($tiporeporte != 3) {
                array_push($arr, utf8_decode($datos['cubierto']));
                //array_push($arr, utf8_decode($datos['sinregistro']));
                array_push($widthHeaderTable, 15);
                //array_push($widthHeaderTable, 20);
                array_push($align, 'L');
                //array_push($align, 'L');
            }
            /*if ($tiporeporte == 3) {
                array_push($arr, utf8_decode($datos['sinregistro']));
                array_push($widthHeaderTable, 20);
                array_push($align, 'L');
            }*/
            if ($datos['totalasistencia'])
                array_push($arr, utf8_decode($datos['totalasistencia']));
            else
                array_push($arr, '0');
            if ($datos['presente'])
                array_push($arr, utf8_decode($datos['presente']));
            else
                array_push($arr, '0');
            if ($datos['presentesreal'])
                array_push($arr, utf8_decode($datos['presentesreal']));
            else
                array_push($arr, '0');

            array_push($widthHeaderTable, 22);
            array_push($widthHeaderTable, 22);
            array_push($widthHeaderTable, 20);
            array_push($align, 'L');
            array_push($align, 'L');
            array_push($align, 'L');


            foreach ($causasP as $key => $causaP) {
                if ($datos[$causaP['dataindex']])
                    array_push($arr, $datos[$causaP['dataindex']]);
                else
                    array_push($arr, '0');
                array_push($widthHeaderTable, 15);
                array_push($align, 'C');
            }
            if ($datos['totalfuera'])
                array_push($arr, utf8_decode($datos['totalfuera']));
            else
                array_push($arr, '0');
            array_push($widthHeaderTable, 20);
            array_push($align, 'C');

            foreach ($causasA as $key => $causaA) {
                if ($datos[$causaA['dataindex']])
                    array_push($arr, $datos[$causaA['dataindex']]);
                else
                    array_push($arr, '');
                array_push($widthHeaderTable, 15);
                array_push($align, 'C');
            }
            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $this->table->Row($arr, 0, 0, 11);
        }

        return $pdf;
    }

    public function cabeceraReporte($pdf, $arreglo, $fdesde, $fhasta)
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $pdf->SetX(25);
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(68, 8, utf8_decode('Reporte estadístico de la asistencia'), 0, 1, 'C', 0);
        $pdf->Ln(1);

        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(30, 6, utf8_decode('Entidad: ' . $datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 1, 'L', 0);
        $pdf->Ln(1);

        $pdf->SetFont('Arial', '', 12);
        $pdf->Cell(30, 6, utf8_decode('Período: ' . $fdesde . ' - ' . $fhasta), 0, 1, 'L', 0);
        $pdf->Ln(5);

        return $pdf;
    }
}