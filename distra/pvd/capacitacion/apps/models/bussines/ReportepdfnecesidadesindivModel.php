<?php
class PDFNecesidadesindividuales extends fpdf
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

class ReportepdfnecesidadesindivModel extends ZendExt_Model
{
    public function reportepdfnecesidadesindivModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idpersona)
    {
        $pdf = new PDFNecesidadesindividuales('L', 'mm', 'a4');
        $this->table = new Tablec($pdf);
        $datos = DatNecesidad::getNecesidadesByPersona(1, $idpersona, null, 0);
        $persona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona($datos[0]['idpersona']);
        $this->crearEncabezadoPrincipal($pdf, 'Reporte individual de necesidades de capacitación', $persona->data[0]);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $pdf->SetFont('Arial', '', 11);
        $no = 1;
        foreach ($datos as $val) {
            $y = $pdf->GetY();
            if ($y >= '170') {
                $pdf->AddPage();
            }
            $widthHeaderTable = array(15, 140, 40, 70);
            $align = ['C', 'L', 'C', 'L'];
            $this->table->SetAligns($align);
            $this->table->SetWidths($widthHeaderTable);
            if ($pdf->GetY() >= '520') {
                $pdf->Cell(265, 0.1, '', 'T', 0, 'C', 0);
                $arr = array(
                    ['text' => ($no), 'border' => 'LRB'],
                    ['text' => utf8_decode($val['necesidad']), 'border' => 'RB'],
                    ['text' => utf8_decode($val['fregistro']), 'border' => 'RB'],
                    ['text' => utf8_decode($val['modoformacion']), 'border' => 'RB']
                );
            } else {
                $arr = array(
                    ['text' => ($no), 'border' => 'LR'],
                    ['text' => utf8_decode($val['necesidad']), 'border' => 'R'],
                    ['text' => utf8_decode($val['fregistro']), 'border' => 'R'],
                    ['text' => utf8_decode($val['modoformacion']), 'border' => 'R']
                );
            }
            $this->table->Row($arr);
            $no++;
        }
        $pdf->Cell(265, 0.1, '', 'T', 0, 'C', 0);
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
        $pdf->Cell(140, 8, utf8_decode('Necesidad de capacitación'), 1, 0, 'C', 1);
        $pdf->Cell(40, 8, 'Fecha', 1, 0, 'C', 1);
        $pdf->Cell(70, 8, utf8_decode('Propuesta de modo de formación'), 1, 0, 'C', 1);
        $pdf->Ln();
    }
}