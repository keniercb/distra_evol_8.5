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


class DatpdfEstModel extends ZendExt_Model
{

    public function DatpdfEstModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($datos, $fecha)
    {

        $pdf = new PDFParteporfecha('P', 'mm', 'A4');
        $pdf->AddPage();
        $this->table = new Tableml($pdf);
        $pdffinal = $this->cabeceraReporte($pdf, $fecha);
        $pdffinal = $this->cuerpoReporte($pdf, $datos, $fecha);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $datos, $fecha)
    {
        $array = array();
        $result = array();
        foreach($datos as $key => $value){
            $array[$value['idarea']] = $value['denomarea'];
        }
        $resultado = array_unique($array);
        foreach($resultado as $key => $value){
            foreach($datos as $key1 => $valor){
                $result[$key]['area'] = $value;
                if($key == $valor['idarea']){
                    $result[$key]['total'] += 1;
                    if($valor['idcausa'] == -1){
                        $result[$key]['sinregistro'] += 1;
                    }else{
                        if($valor['idcausa'] == 3){
                            $result[$key]['llegadatarde'] += 1;
                        }else if(!empty($valor['fechahoraentrada']) || (!empty($valor['idcausa']) && $valor['afectasalario'] == 0 && $valor['idcausa'] != 3)){
                            $result[$key]['presentes'] += 1;
                        }else {
                            $result[$key]['ausentes'] += 1;
                        }
                    }
                }
            }
        }

        foreach ($result as $key => $valor) {
            $y = $pdf->GetY();
            if ($y >= '260') {
                $pdf->AddPage();
                $this->cabeceraReporte($pdf, $fecha);
            }
            $widthHeaderTable = array(75, 15, 15, 15, 20, 35);
            $align = ['L', 'C', 'C', 'C', 'C', 'C'];
            $arr = array(
                utf8_decode("" . $valor['area'])
            );
            if ($valor['total'])
                array_push($arr, utf8_decode($valor['total']));
            else
                array_push($arr, '0');
            if ($valor['presentes'])
                array_push($arr, utf8_decode($valor['presentes']));
            else
                array_push($arr, '0');
            if ($valor['ausentes'])
                array_push($arr, utf8_decode($valor['ausentes']));
            else
                array_push($arr, '0');
            if ($valor['llegadatarde'])
                array_push($arr, utf8_decode($valor['llegadatarde']));
            else
                array_push($arr, '0');
            if ($valor['sinregistro'])
                array_push($arr, utf8_decode($valor['sinregistro']));
            else
                array_push($arr, '0');

            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $this->table->Row($arr, 0, 0, 7);
        }
        return $pdf;
    }

    public function cabeceraReporte($pdf, $fecha)
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Text(10, 15, utf8_decode("Resumen estadístico de la asistencia"));
        $pdf->Ln(5);

        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Text(10, 20, "Entidad: " . utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'));
        $pdf->Ln(10);

        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Text(10, 25, "Fecha: " . utf8_decode("" . $fecha));
        $pdf->Ln(5);

        $pdf->SetFont('Arial', 'B', 7);
        $pdf->SetFillColor(200);
        $pdf->Cell(75, 5, "" . utf8_decode("Área"), 1, 0, "", true);
        $pdf->Cell(15, 5, "Total", 1, 0, "C", true);
        $pdf->Cell(15, 5, "Presentes", 1, 0, "C", true);
        $pdf->Cell(15, 5, "Ausentes", 1, 0, "C", true);
        $pdf->Cell(20, 5, "Llegadas tarde", 1, 0, "C", true);
        $pdf->Cell(35, 5, "Sin registro de asistencia", 1, 0, "C", true);
        $pdf->Ln(5);

        return $pdf;
    }
}