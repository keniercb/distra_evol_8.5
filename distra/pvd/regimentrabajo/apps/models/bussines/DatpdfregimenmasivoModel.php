<?php
include 'PDF_MC_Table.php';

class PDFRegimenMasivo extends fpdf
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


class DatpdfregimenmasivoModel extends ZendExt_Model
{

    public function DatpdfregimenmasivoModel()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte($arreglo, $denomarea)
    {
        $pdf = new PDFRegimenMasivo('L', 'mm', 'A4');
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 22);
        $this->table = new Tableml($pdf);
        $pdffinal = $this->cabeceraReporte($pdf, $arreglo);
        $pdffinal = $this->cuerpoReporte($pdf, $arreglo, $denomarea);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $arreglo, $denomarea)
    {
        $contA = 1;
        foreach ($denomarea as $j => $value) {
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->SetX(10);
            $pdf->Cell(275, 8, "" . utf8_decode("" . $value), 1, 1, "", true);
            foreach ($arreglo['datos'] as $i => $datos) {
                $pdf->SetX(10);
              if ($j == $datos['idarea']) {
                    $y = $pdf->GetY();
                    if ($y >= '250') {
                        $pdf->AddPage();
                        $this->cabeceraReporte($pdf, $arreglo);
                    }
                    $pdf->SetFont('Arial', '', 12);
                    $widthHeaderTable = array(10, 60, 65, 55, 55,30);
                    $align = ['L', 'L', 'L', 'L', 'L', 'L'];
                    $arr = array(
                        $contA, utf8_decode("" . $datos['nombreapellidos'])
                    );
                    array_push($arr, utf8_decode($datos['denomcargo']));
                    array_push($arr, utf8_decode($datos['regimentrabajo']));
                    array_push($arr, utf8_decode($datos['grupotrabajo']));
                    array_push($arr, utf8_decode($datos['fdesdert']));

                    $this->alingsArray = $align;
                    $this->table->SetAligns($this->alingsArray);
                    $this->table->SetWidths($widthHeaderTable);
                    $this->table->Row($arr, 0, 0, 12);
                    $contA++;
                }
            }
        }
        return $pdf;
    }

    public function cabeceraReporte($pdf, $arreglo)
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(55, 10, utf8_decode('Régimen de trabajo'), 0, 1, 'C', 0);
        $pdf->Ln(1);
        $pdf->SetX(10);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(16, 6, utf8_decode('Entidad: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(22, 6, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 1, 'L', 0);
        $pdf->Ln(1);
        $pdf->SetX(10);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Ln(5);

        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetX(10);
        $pdf->SetFillColor(200);
        $pdf->Cell(10, 10, "No", 1, 0, "C", 1);
        $pdf->Cell(60, 10, "Nombres y apellidos", 1, 0, "C", 1);
        $pdf->Cell(65, 10, "Cargo", 1, 0, "C", 1);
        $pdf->Cell(55, 10, utf8_decode("Régimen de trabajo"), 1, 0, "C", 1);
        $pdf->Cell(55, 10, "Grupo de trabajo", 1, 0, "C", 1);
        $pdf->Cell(30, 10, "Fecha inicio", 1, 0, "C", 1);
        $pdf->Ln(10);

        return $pdf;
    }
}