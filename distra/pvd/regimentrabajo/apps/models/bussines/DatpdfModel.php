<?php
include 'PDF_MC_Table.php';

class PDFParteporfecha extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 7);
        $this->Cell(70, 10, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
    }
}


class DatpdfModel extends ZendExt_Model
{

    public function DatpdfModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($arreglo, $fecha, $agrupador)
    {

//        $pdf = new PDFParteporfecha('P', 'mm',/*array(600,565)*/
//            'A4');
        $pdf = new PDFParteporfecha('L', 'mm', 'A3');
        $pdf->AddPage();
        $this->table = new Tableml($pdf);
        $pdffinal = $this->cabeceraReporte($pdf, $fecha);
        $pdffinal = $this->cuerpoReporte($pdf, $arreglo, $fecha, $agrupador);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $arreglo, $fecha, $agrupador)
    {
        $array = array();
        foreach ($arreglo as $key => $value) {
            if ($agrupador == 1) {
                if ($value['idcausa'] == -1)
                    $array[-1] = 'Sin registro de asistencia';
                else if ($value['idcausa'] == -2)
                    $array[-2] = 'Sin Causa';
                else
                    $array[$value['idcausa']] = $value['causa'];
            } else {
                $array[$value['idarea']] = $value['denomarea'];
            }
        }
        $resultado = array_unique($array);

        $contA = 1;
        foreach ($resultado as $j => $value) {
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->SetX(10);
            $pdf->Cell(545, 10, "" . utf8_decode("" . $value), 1, 1, "", true);
            foreach ($arreglo as $i => $datos) {
                $pdf->SetX(10);
                if ($agrupador == 1) {
                    if (!empty($datos['idcausa']))
                    $agrup = $datos['causa'];
                } else if ($agrupador == 2) {
                    $agrup = $datos['denomarea'];
                }

                if ($value == $agrup) {
                    $y = $pdf->GetY();
                    if ($y >= '250') {
                        $pdf->AddPage();
                        $this->cabeceraReporte($pdf, $fecha);
                    }
                    $pdf->SetFont('Arial', '', 12);
                    $widthHeaderTable = array(10, 60, 65, 30, 30, 30, 30, 50, 25, 25, 25, 55, 55, 55);
                    $align = ['L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'];
                    $arr = array(
                        $contA, utf8_decode("" . $datos['nombreapellidos'])
                    );
                    array_push($arr, utf8_decode($datos['denomcargo']));
                    array_push($arr, utf8_decode($datos['fechaentrada']));
                    array_push($arr, utf8_decode($datos['fechahoraentrada']));
                    array_push($arr, utf8_decode($datos['fechasalida']));
                    array_push($arr, utf8_decode($datos['fechahorasalida']));
                    if ($datos['idcausa'] == -1 || $datos['idcausa'] == -2)
                        array_push($arr, '');
                    else
                        array_push($arr, utf8_decode($datos['causa']));
                    array_push($arr, utf8_decode($datos['fdesde']));
                    array_push($arr, utf8_decode($datos['fhasta']));
                    array_push($arr, utf8_decode($datos['hrsdescontadas']));
                    array_push($arr, utf8_decode($datos['personacontrola']));
                    array_push($arr, utf8_decode($datos['personamodifica']));
                    array_push($arr, utf8_decode($datos['personacertifica']));

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

    public function cabeceraReporte($pdf, $fecha)
    {
        $pdf->SetX(25);
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(62, 8, utf8_decode('Reporte nominal de la asistencia'), 0, 1, 'C', 0);
        $pdf->Ln(1);
        $pdf->SetX(10);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(16, 6, utf8_decode('Entidad: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(30, 6, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 1, 'L', 0);
        $pdf->Ln(1);
        $pdf->SetX(10);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(16, 6, utf8_decode('Fecha: ' . $fecha), 0, 0, 'L', 0);
        $pdf->Ln(10);

        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetX(10);
        $pdf->SetFillColor(200);
        $pdf->Cell(10, 10, "No", 1, 0, "C", 1);
        $pdf->Cell(60, 10, "Nombres y apellidos", 1, 0, "C", 1);
        $pdf->Cell(65, 10, "Cargo", 1, 0, "C", 1);
        $pdf->Cell(30, 10, "Fecha entrada", 1, 0, "C", 1);
        $pdf->Cell(30, 10, "Hora entrada", 1, 0, "C", 1);
        $pdf->Cell(30, 10, "Fecha salida", 1, 0, "C", 1);
        $pdf->Cell(30, 10, "Hora salida", 1, 0, "C", 1);
        $pdf->Cell(50, 10, "Causa", 1, 0, "C", 1);
        $pdf->Cell(25, 10, "Desde", 1, 0, "C", 1);
        $pdf->Cell(25, 10, "Hasta", 1, 0, "C", 1);
        $pdf->Cell(25, 10, "Perdidas", 1, 0, "C", 1);
        $pdf->Cell(55, 10, "Controlado por", 1, 0, "C", 1);
        $pdf->Cell(55, 10, "Modificado por", 1, 0, "C", 1);
        $pdf->Cell(55, 10, "Certificado por", 1, 0, "C", 1);
        $pdf->Ln(10);

        return $pdf;
    }
}