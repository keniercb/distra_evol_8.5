<?php
class PDFPlancolectivo extends fpdf
{
    private $table;
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 9);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página '.$this->PageNo()), 0, 0, 'R');
    }
}

class ReportepdfplancolectivoModel extends ZendExt_Model
{
    public function reportepdfplancolectivoModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura, $desde, $hasta)
    {
        $pdf = new PDFPlancolectivo('L', 'mm', 'a4');
        $this->table = new Tablec($pdf);
        $datos = DatAccionnModel::getAccionesPlan($idestructura, $desde, $hasta);
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);
        $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $denomest = $estructura[0]->denominacion;
        $pdf->Cell(270, 10, utf8_decode('Plan de capacitación '.$denomest.'.'), 0, 0, 'C', 0);
        $pdf->Ln();
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $no = 1;
        foreach ($datos as $p =>$val) {
            $pdf->SetFont('Arial', 'B', 11);
            $y = $pdf->GetY();
            if ($y >= '170') {
                $pdf->AddPage();
                $pdf->Cell(270, 10, utf8_decode('Área: '.$val['estructura']), 0, 0, 'L', 0);
                $pdf->Ln();
                $this->crearEncabezadoPrincipal($pdf);
            } else if ($p>0 && $val['idestructura'] != $datos[$p-1]['idestructura']) {
                $pdf->Cell(270, 10, utf8_decode('Área: '.$val['estructura']), 0, 0, 'L', 0);
                $pdf->Ln();
                $this->crearEncabezadoPrincipal($pdf);
                $no = 1;
            } else if ($p == 0) {
                $pdf->Cell(270, 10, utf8_decode('Área: '.$val['estructura']), 0, 0, 'L', 0);
                $pdf->Ln();
                $this->crearEncabezadoPrincipal($pdf);
            }
            $widthHeaderTable = array(15, 100, 70, 25, 25, 30);
            $align = ['C', 'L', 'L', 'C', 'C', 'C'];
            $this->table->SetAligns($align);
            $this->table->SetWidths($widthHeaderTable);
            $pdf->SetFont('Arial', '', 11);
            $lugar = (empty($val['lugar'])) ? ' / Lugar no definido': ' / '.$val['lugar'];
            $arr = array(
                ['text' => ($no), 'border' => 'LRT'],
                ['text' => utf8_decode($val['denominacion'].$lugar), 'border' => 'RT'],
                ['text' => '1-' . utf8_decode($val['participantes'][0]['nombreyapellidos']), 'border' => 'RT'],
                ['text' => utf8_decode($val['fdesde']), 'border' => 'RT'],
                ['text' => utf8_decode($val['fhasta']), 'border' => 'RT'],
                ['text' => utf8_decode($val['duracion']), 'border' => 'RT']
            );
            $this->table->Row($arr);
            foreach ($val['participantes'] as $pospart => $part) {
                if ($pospart > 0) {
                    if ($pdf->GetY() >= '180') {
                        $pdf->Cell(265, 0.1, '', 'T', 0, 'C', 0);
                        $pdf->AddPage();
                        $pdf->SetFont('Arial', 'B', 11);
                        $pdf->Cell(270, 10, utf8_decode('Área: ' . $val['estructura']), 0, 0, 'L', 0);
                        $pdf->Ln();
                        $this->crearEncabezadoPrincipal($pdf);
                    }
                    $pdf->SetFont('Arial', '', 11);
                    $widthHeaderTable = array(15, 100, 70, 25, 25, 30);
                    $align = ['C', 'L', 'L', 'C', 'C', 'C'];
                    $this->table->SetAligns($align);
                    $this->table->SetWidths($widthHeaderTable);
                    $npart = $pospart + 1;
                    $arr = array(
                        ['text' => '', 'border' => 'LR'], ['text' => '', 'border' => 'R'],
                        ['text' => $npart . '-' . utf8_decode($part['nombreyapellidos']), 'border' => 'R'],
                        ['text' => '', 'border' => 'R'], ['text' => '', 'border' => 'R'],
                        ['text' => '', 'border' => 'R']
                        );
                    $this->table->Row($arr);
                }
            }
            $no++;
            if ($val['idestructura'] != $datos[$p+1]['idestructura']) {
                $pdf->Cell(265, 0.1, '', 'T', 0, 'C', 0);
                $pdf->Ln();
            }
        }
        $pdf->Cell(265, 0.1, '', 'T', 0, 'C', 0);
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf)
    {
        $pdf->SetLeftMargin(15);
        $pdf->SetLineWidth(0.3);
        $pdf->SetFillColor(200);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
        $pdf->Cell(100, 8, utf8_decode('Acción de capacitación / Lugar'), 1, 0, 'C', 1);
        $pdf->Cell(70, 8, utf8_decode('Participantes'), 1, 0, 'C', 1);
        $pdf->Cell(25, 8, 'Desde', 1, 0, 'C', 1);
        $pdf->Cell(25, 8, 'Hasta', 1, 0, 'C', 1);
        $pdf->Cell(30, 8, utf8_decode('Duración(días)'), 1, 0, 'C', 1);
        $pdf->Ln();
    }
}