<?php
class PDFEvalRG extends fpdf
{
    private $table;
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 9);
        $this->Cell(100, 10, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        $this->Cell(50, 10, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página '.$this->PageNo()), 0, 0, 'R');
    }
}

class ReportepdfEvalRGModel extends ZendExt_Model
{
    public function reportepdfevalrgModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idreciengraduado)
    {
        $pdf = new PDFEvalRG('P', 'mm', 'a4');
        $this->table = new Tablec($pdf);
        $datos = DatReciengraduadoModel::getRecienGraduadoById($idreciengraduado);
        $this->crearEncabezadoPrincipal($pdf, 'Evaluación del recién graduado', $datos[0]);
        $eval = DatRgindicadorModel::getEvaluacion($idreciengraduado);
        $pdfNGeneral = $this->crearCuerpo($pdf, $eval);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        foreach ($datos as $p =>$valor) {
            $y = $pdf->GetY();
            if ($y >= '170') {
                $pdf->AddPage();
                $pdf->SetFont('Arial', 'B', 11);
                $pdf->Cell(17, 6, 'Periodo:', 0, 0, 'L', 0);
                $pdf->SetFont('Arial', '', 11);
                $pdf->Cell(270, 6, utf8_decode($valor['periodo']), 0, 1, 'L', 0);
                $pdf->Ln();
                $this->crearEncabezadoPrincipal($pdf);
            } else {
                $pdf->SetFont('Arial', 'B', 11);
                $pdf->Cell(17, 6, 'Periodo:', 0, 0, 'L', 0);
                $pdf->SetFont('Arial', '', 11);
                $pdf->Cell(270, 6, utf8_decode($valor['periodo']), 0, 1, 'L', 0);
                $this->crearEncabezadoPrincipal($pdf);
            }
            $no = 1;
            foreach ($valor['DatEvalrg'] as $pev => $val) {
                $pdf->SetFont('Arial', '', 11);
                $widthHeaderTable = array(15, 150, 25);
                $align = ['C', 'L', 'C'];
                $this->table->SetAligns($align);
                $this->table->SetWidths($widthHeaderTable);
                $arr = array(['text' => ($no), 'border' => 'LR'],
                    ['text' => utf8_decode($val['indicador']), 'border' => 'R'],
                    ['text' => utf8_decode($val['valor']), 'border' => 'R']);
                $this->table->Row($arr);
                $no++;
            }
            $pdf->Cell(190, 0.1, '', 'T', 0, 'C', 0);
            $pdf->Ln();
        }
        $pdf->Cell(190, 0.1, '', 'T', 0, 'C', 0);
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo, $persona)
    {
        if (!empty($titulo)) {
            $pdf->SetLeftMargin(10);
            $pdf->AddPage();
            $pdf->SetFont('Arial', 'B', 12);
            $pdf->Cell(190, 8, utf8_decode($titulo), 0, 0, 'C', 0);
            $pdf->Ln(10);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(17, 6, utf8_decode('Nombre: '), 0, 0, 'L', 0);
            $pdf->SetFont('Arial', '', 11);
            $pdf->Cell(247, 6, utf8_decode($persona['reciengraduado']), 0, 1, 'L', 0);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(30, 6, utf8_decode('Jefe inmediato:'), 0, 0, 'L', 0);
            $pdf->SetFont('Arial', '', 11);
            $pdf->Cell(247, 6, utf8_decode($persona['jefeinmediato']), 0, 1, 'L', 0);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(12, 6, 'Tutor: ', 0, 0, 'L', 0);
            $pdf->SetFont('Arial', '', 11);
            $pdf->Cell(244, 6, utf8_decode($persona['tutor']), 0, 1, 'L', 0);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(12, 6, utf8_decode('Área: '), 0, 0, 'L', 0);
            $pdf->SetFont('Arial', '', 11);
            $pdf->Cell(244, 6, utf8_decode($persona['area']), 0, 1, 'L', 0);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(14, 6, utf8_decode('Cargo: '), 0, 0, 'L', 0);
            $pdf->SetFont('Arial', '', 11);
            $pdf->Cell(251, 6, utf8_decode($persona['cargo']), 0, 1, 'L', 0);
        } else {
            $pdf->SetLineWidth(0.3);
            $pdf->SetFillColor(200);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
            $pdf->Cell(150, 8, 'Indicador', 1, 0, 'C', 1);
            $pdf->Cell(25, 8, utf8_decode('Evaluación'), 1, 0, 'C', 1);
            $pdf->Ln();
        }
    }
}