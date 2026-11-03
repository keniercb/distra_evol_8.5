<?php
class PDFEvalimpacto extends fpdf
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

class ReportepdfEvalimpactoModel extends ZendExt_Model
{
    public function reportepdfevalimpactoModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idaccionparticipante, $idpersona)
    {
        $pdf = new PDFEvalimpacto('L', 'mm', 'a4');
        $this->table = new Tablec($pdf);
        $datos = DatEvalimpactoModel::getIndicadoresParticipante($idaccionparticipante);
        $persona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona($idpersona);
        $this->crearEncabezadoPrincipal($pdf, 'Evaluación de impacto', $persona->data[0]);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $no = 1;
        foreach ($datos as $p =>$val) {
            $y = $pdf->GetY();
            if ($y >= '170') {
                $pdf->AddPage();
                $pdf->SetFont('Arial', 'B', 11);
                $pdf->Cell(17, 6, 'Periodo:', 0, 0, 'L', 0);
                $pdf->SetFont('Arial', '', 11);
                $pdf->Cell(270, 6, utf8_decode($val['periodo']), 0, 1, 'L', 0);
                $pdf->Ln();
                $this->crearEncabezadoPrincipal($pdf);
            } else if (($p>0 && $val['idperiodo'] != $datos[$p-1]['idperiodo']) || ($p == 0)) {
                $pdf->SetFont('Arial', 'B', 11);
                $pdf->Cell(17, 6, 'Periodo:', 0, 0, 'L', 0);
                $pdf->SetFont('Arial', '', 11);
                $pdf->Cell(270, 6, utf8_decode($val['periodo']), 0, 1, 'L', 0);
                $this->crearEncabezadoPrincipal($pdf);
                $no = 1;
            }
            $pdf->SetFont('Arial', '', 11);
            $widthHeaderTable = array(15, 110, 25, 25, 95);
            $align = ['C', 'L', 'C', 'L'];
            $this->table->SetAligns($align);
            $this->table->SetWidths($widthHeaderTable);
            $arr = array(
                ['text' => ($no), 'border' => 'LR'],
                ['text' => utf8_decode($val['indicador']), 'border' => 'R'],
                ['text' => utf8_decode($val['valor']), 'border' => 'R'],
                ['text' => utf8_decode($val['fecha']), 'border' => 'R'],
                ['text' => utf8_decode($val['complemento']), 'border' => 'R']
            );
            $this->table->Row($arr);
            $no++;
            if ($val['idperiodo'] != $datos[$p+1]['idperiodo']) {
                $pdf->Cell(270, 0.1, '', 'T', 0, 'C', 0);
                $pdf->Ln();
            }
        }
        $pdf->Cell(270, 0.1, '', 'T', 0, 'C', 0);
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo, $persona)
    {
        if (!empty($titulo)) {
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
        } else {
            $pdf->SetLineWidth(0.3);
            $pdf->SetFillColor(200);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
            $pdf->Cell(110, 8, 'Indicador', 1, 0, 'C', 1);
            $pdf->Cell(25, 8, utf8_decode('Evaluación'), 1, 0, 'C', 1);
            $pdf->Cell(25, 8, 'Fecha', 1, 0, 'C', 1);
            $pdf->Cell(95, 8, 'Complemento', 1, 0, 'C', 1);
            $pdf->Ln();
        }
    }
}