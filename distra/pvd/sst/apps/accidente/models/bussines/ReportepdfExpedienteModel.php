<?php
class PDFExpediente extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(100, 8, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        $this->Cell(20, 8, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 8, utf8_decode('Página '.$this->PageNo()), 0, 0, 'R');
    }
}

class ReportepdfExpedienteModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idaccidente)
    {
        $pdf = new PDFExpediente('P', 'mm', 'a4');
        $datos = DatAccidenteModel::getDatosAccidente($idaccidente);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $pdf->SetLeftMargin(5);
        $pdf->SetFillColor(200);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(200, 8, 'Expediente del accidente', 1, 1, 'C', 1);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(13, 8, 'Lugar: ', 'L', 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(187, 8, utf8_decode($datos['lugar']), 'R', 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(35, 8, 'Tipo de accidente: ', 'L', 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(65, 8, utf8_decode($datos['tipoaccidente']), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(39, 8, 'Forma del accidente: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(61, 8, utf8_decode($datos['formaaccidente']), 'R', 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(30, 8, 'Tipo de agente: ', 'L', 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(70, 8, utf8_decode($datos['tipoagente']), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(15, 8, 'Agente: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(85, 8, utf8_decode($datos['agente']), 'R', 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(13, 8, 'Fecha: ', 'L', 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(87, 8, utf8_decode($datos['fecha']), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(11, 8, 'Hora: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(89, 8, utf8_decode($datos['hora']), 'R', 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(48, 8, 'Equiparado al de trabajo: ', 'L', 0, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(152, 8, $datos['equiparado'], 'R', 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(200, 8, utf8_decode('Descripción: '), 'TRL', 1, 'L', 0);
        $pdf->SetFont('Arial', '', 11);
        $pdf->MultiCell(200, 8, utf8_decode($datos['descripcion']), 'LR', 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(200, 8, 'Implicados: ', 'LRT', 1, 'L', 0);
        $pdf->SetFont('Arial', '', 12);
        foreach ($datos['implicados'] as $imp) {
            $pdf->Cell(200, 8, '-  '.utf8_decode($imp['nombreyapellidos']), 'LR', 1, 'L', 0);
        }
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(200, 8, 'Causas: ', 'LRT', 1, 'L', 0);
        $pdf->SetFont('Arial', '', 12);
        foreach ($datos['causas'] as $c) {
            $pdf->Cell(200, 8, '-  '.utf8_decode($c['denominacion']), 'LR', 1, 'L', 0);
        }
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(200, 8, 'Recomendaciones: ', 'LRT', 1, 'L', 0);
        $pdf->SetFont('Arial', '', 12);
        foreach ($datos['recomendaciones'] as $rec) {
            $pdf->Cell(200, 8, '-  '.utf8_decode($rec['recomendacion']), 'LR', 1, 'L', 0);
        }
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(200, 8, 'Conclusiones: ', 'LRT', 1, 'L', 0);
        $pdf->SetFont('Arial', '', 12);
        foreach ($datos['conclusiones'] as $con) {
            $pdf->Cell(200, 8, '-  '.utf8_decode($con['conclusion']), 'LR', 1, 'L', 0);
        }
        $pdf->Cell(200, 1, '', 'LRB', 1, 'L', 0);

        return $pdf;
    }
}