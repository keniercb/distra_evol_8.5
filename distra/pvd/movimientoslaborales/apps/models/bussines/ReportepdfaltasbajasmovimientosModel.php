<?php
class PDFAltasbajasmov extends fpdf
{
    private $pdf;
    private $table;
    private $alingsArray;
    function Footer()
    {
    }
}

class ReportepdfaltasbajasmovimientosModel extends ZendExt_Model
{

    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($tipo,$desde, $hasta, $datos)
    {
        $pdf = new PDFAltasbajasmov('L', 'mm', 'a4');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        $this->crearEncabezadoPrincipal(
            $pdf,
            'Registro de '.$tipo.'s desde '.$desde.' - '.$hasta,
            $tipo
        );
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos, $tipo);
        if (ob_get_level()) {
            while (ob_get_level()) {
            ob_end_clean();
            }
        }
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos, $tipo)
    {
        $pdf->SetFont('Arial', '', 8);
        $entidadInicial = $datos[0]['denomentidad'];
        $areaInicial = $datos[0]['denomarea'];
        foreach ($datos as $k=>$val) {
            $this->pdf->SetFont('Arial', 'B', 8);
            $y = $this->pdf->GetY();
            if ($val['denomentidad'] != $datos[$k - 1]['denomentidad']) {
                if ($y >= '190' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado();
                }
                $this->pdf->SetFillColor(230, 230, 230);
                $this->pdf->Cell(287, 6, utf8_decode($val['denomentidad']), 1, 1, 'C', 1);;
            } else {
                if ($y >= '190' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado();
                }
            }
            $y = $this->pdf->GetY();
            if ($val['idarea'] != $datos[$k - 1]['idarea']) {
                if ($y >= '190' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado();
                }
                $this->pdf->Cell(287, 6, utf8_decode($val['denomarea']), 1, 1, 'L', 0);;
            } else {
                if ($y >= '190' ) {
                    $this->pdf->AddPage();
                    $this->getEncabezado();
                }
            }

            $widthHeaderTable = array(7, 22, 70, 18, 50, 50, 70);
            $align = ['C', 'C', 'L', 'C', 'L', 'L', 'L'];
            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $arr = array(
                $k+1,
                utf8_decode(' '.$val['numid']),
                utf8_decode($val['nombreyapellidos']),
                ($tipo == 'alta')?utf8_decode(' '.$val['fdesde']):utf8_decode(' '.$val['fhasta']),
                utf8_decode(' '.$val['tipocontrato']),
                utf8_decode(' '.$val['motivo']),
                utf8_decode(' '.$val['cargo'])
            );
            $this->table->Row($arr, 0, 0, 8);
        }
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo, $tipo)
    {
        $textf = ($tipo == 'movimiento')?'movim':$tipo;
        $pdf->SetLeftMargin(5);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetLineWidth(0.1);
        $pdf->SetFillColor(200);
        $pdf->Cell(240, 8, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln(8);
        $pdf->SetFont('Arial', 'B', 8);
        //Creando el encabezado inicial estatico
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(7, 8, 'No.', 1, 0, 'C', 1);
        $pdf->Cell(22, 8, 'No. Identidad', 1, 0, 'C', 1);
        $pdf->Cell(70, 8, 'Apellidos y nombres', 1, 0, 'C', 1);
        $pdf->Cell(18, 8, 'F. de '.$textf, 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Tipo de contrato', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, ($tipo == 'alta')?utf8_decode('Situación laboral'):'Motivo de '.$tipo, 1, 0, 'C', 1);
        $pdf->Cell(70, 8, utf8_decode('Denominación del cargo'), 1, 1, 'C', 1);
    }

    private function getEncabezado(&$pdf, $tipo)
    {
        $textf = ($tipo == 'movimiento')?'movim':$tipo;
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->SetLineWidth(0.3);
        $pdf->SetFillColor(200);
        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(230, 230, 230);
        $pdf->Cell(7, 8, 'No.', 1, 0, 'C', 1);
        $pdf->Cell(22, 8, 'No. Identidad', 1, 0, 'C', 1);
        $pdf->Cell(70, 8, 'Apellidos y nombres', 1, 0, 'C', 1);
        $pdf->Cell(18, 8, 'F. de '.$textf, 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Tipo de contrato', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, ($tipo == 'alta')?utf8_decode('Situación laboral'):'Motivo de '.$tipo, 1, 0, 'C', 1);
        $pdf->Cell(70, 8, utf8_decode('Denominación del cargo'), 1, 1, 'C', 1);
        $pdf->SetFont('Arial', '', 8);
    }
}