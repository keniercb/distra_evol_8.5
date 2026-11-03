<?php
class PDFPlanindividual extends fpdf
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

class ReportepdfplanindivModel extends ZendExt_Model
{
    public function reportepdfplanindivModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idpersona, $fdesde, $fhasta)
    {
        $pdf = new PDFPlanindividual('L', 'mm', 'a4');
        $this->table = new Tablec($pdf);
        $datos = DatAccionparticipanteModel::getAccionesNecByPersona($idpersona, $fdesde, $fhasta);
        $persona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona($idpersona);
        $this->crearEncabezadoPrincipal($pdf, 'Plan individual de capacitación', $persona->data[0]);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $no = 1;
        foreach ($datos as $val) {
            $pdf->SetFont('Arial', 'B', 11);
            $y = $pdf->GetY();
            if ($y >= '170') {
                $pdf->Cell(270, 0.1, '', 'T', 0, 'C', 0);
                $pdf->AddPage();
                $pdf->SetFont('Arial', 'B', 11);
                $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
                $pdf->Cell(110, 8, utf8_decode('Acción de capacitación'), 1, 0, 'C', 1);
                $pdf->Cell(25, 8, 'Fecha inicio', 1, 0, 'C', 1);
                $pdf->Cell(25, 8, 'Fecha fin', 1, 0, 'C', 1);
                $pdf->Cell(95, 8, 'Aseguramientos', 1, 0, 'C', 1);
                $pdf->Ln();
            }
            $widthHeaderTable = array(15, 110, 25, 25, 95);
            $align = ['C', 'L', 'C', 'L'];
            $this->table->SetAligns($align);
            $this->table->SetWidths($widthHeaderTable);

            $arr = array(
                ['text' => ($no), 'border' => 'LR'],
                ['text' => utf8_decode($val['denominacion']), 'border' => 'R'],
                ['text' => utf8_decode($val['fdesde']), 'border' => 'R'],
                ['text' => utf8_decode($val['fhasta']), 'border' => 'R'],
                ['text' => utf8_decode($val['aseguramientos']), 'border' => 'R']
            );
            $this->table->Row($arr);
            $nn = 1;
            foreach ($val['necesidades'] as $nec) {
                if ($pdf->GetY() >= '180') {
                    $pdf->Cell(265, 0.1, '', 'T', 0, 'C', 0);
                    $pdf->AddPage();
                    $pdf->SetFont('Arial', 'B', 11);
                    $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
                    $pdf->Cell(110, 8, utf8_decode('Acción de capacitación'), 1, 0, 'C', 1);
                    $pdf->Cell(25, 8, 'Fecha inicio', 1, 0, 'C', 1);
                    $pdf->Cell(25, 8, 'Fecha fin', 1, 0, 'C', 1);
                    $pdf->Cell(95, 8, 'Aseguramientos', 1, 0, 'C', 1);
                    $pdf->Ln();
                }
                $pdf->SetFont('Arial', '', 11);
                $widthHeaderTable = array(15, 110, 25, 25, 95);
                $align = ['C', 'L', 'C', 'L'];
                $this->table->SetAligns($align);
                $this->table->SetWidths($widthHeaderTable);
                $arr = array(
                    ['text' => 'N-'.$nn, 'border' => 'LR'],
                    ['text' => utf8_decode('    '.$nec), 'border' => 'R'],
                    ['text' => '', 'border' => 'R'],
                    ['text' => '', 'border' => 'R'],
                    ['text' => '', 'border' => 'R']
                );
                $this->table->Row($arr);
                $nn++;
            }
            $no++;
        }
        $pdf->Cell(270, 0.1, '', 'T', 0, 'C', 0);
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo, $persona)
    {
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(265, 8, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(17, 6, utf8_decode('Nombre: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(247, 6, utf8_decode($persona['nombreapellidos']), 0, 1, 'L', 0);
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($persona['identidad']);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(17, 6, utf8_decode('Entidad:'), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(247, 6, utf8_decode($entidad[0]->denominacion), 0, 1, 'L', 0);
        $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($persona['idarea']);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(11, 6, utf8_decode('Área: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(244, 6, utf8_decode($area[0]->denominacion), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(14, 6, utf8_decode('Cargo: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(251, 6, utf8_decode($persona['denomcargo']), 0, 1, 'L', 0);
        $pdf->Ln();
        $pdf->SetLineWidth(0.3);
        $pdf->SetFillColor(200);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
        $pdf->Cell(110, 8, utf8_decode('Acción de capacitación'), 1, 0, 'C', 1);
        $pdf->Cell(25, 8, 'Fecha inicio', 1, 0, 'C', 1);
        $pdf->Cell(25, 8, 'Fecha fin', 1, 0, 'C', 1);
        $pdf->Cell(95, 8, 'Aseguramientos', 1, 0, 'C', 1);
        $pdf->Ln();
    }
}