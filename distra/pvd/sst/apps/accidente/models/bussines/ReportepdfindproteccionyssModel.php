<?php
class PDFIndicadoresproteccion extends fpdf
{
    private $pdf;
    private $alingsArray;
    private $datos;
    function Footer()
    {

    }
}
class ReportepdfindproteccionyssModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura)
    {

        $pdf = new PDFIndicadoresproteccion('P', 'mm', 'a4');
        $this->pdf = $pdf;
        $datos = DatAccidenteModel::getAccidentesReporteIndic($idestructura);
        $pdfNGeneral = $this->conformarReporte($datos);
        $pdfNGeneral->Output();

    }

    private function conformarReporte($datos)
    {
        $this->pdf->SetLineWidth(0.5);
        $this->pdf->SetLeftMargin(5);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(
            202, 20, utf8_decode('INDICADORES SELECCIONADOS DE PROTECCIÓN DEL TRABAJO Y SEGURIDAD SOCIAL'), 1, 1, 'C', 0
        );

        $this->pdf->Cell(102, 15, 'INDICADORES', 1, 0, 'C', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 'LTR', 1, 'C', 0);
        $this->pdf->SetX($this->pdf->GetX()+102);
        $this->pdf->Cell(25, 5, 'de Medida', 'LR', 0, 'C', 0);
        $x = $this->pdf->GetX();
        $this->pdf->SetY($this->pdf->GetY()-5);
        $this->pdf->SetX($x);
        $this->pdf->Cell(15, 5, 'Fila', 'LTR', 1, 'C', 0);
        $this->pdf->SetX($x);
        $this->pdf->Cell(15, 5, 'No.', 'LR', 0, 'C', 0);
        $this->pdf->SetY($this->pdf->GetY()-5);
        $this->pdf->SetX($x+15);
        $this->pdf->Cell(60, 5, 'Real', 'LTRB', 1, 'C', 0);
        $this->pdf->SetX($x+15);
        $this->pdf->Cell(30, 5, utf8_decode('Año actual'), 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, utf8_decode('Año anterior'), 1, 0, 'C', 0);
        $this->pdf->Ln();
        $this->pdf->Cell(102, 5, 'A', 1, 0, 'C', 0);
        $this->pdf->Cell(25, 5, 'B', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, 'C', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, '1', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, '2', 1, 1, 'C', 0);
        $this->pdf->Cell(202, 10, 'PERIODICIDAD TRIMESTRAL', 1, 1, 'C', 0);
        $this->pdf->SetFont('Times', '', 10);
        $this->pdf->Cell(102, 5, 'Total de accidentes de trabajo', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '01', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->canttrabuno, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->canttrabdos, 1, 1, 'C', 0);
        $this->pdf->Cell(102, 5, '  De ello: Mortales', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '02', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->canttrabunom, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->canttrabdosm, 1, 1, 'C', 0);
        $this->pdf->Cell(102, 5, 'Total de accidentes equiparados al de trabajo', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '03', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantequipuno, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantequipdos, 1, 1, 'C', 0);
        $this->pdf->Cell(102, 5, '  De ello: Mortales', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '04', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantequipunom, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantequipdosm, 1, 1, 'C', 0);
        $this->pdf->Cell(102, 5, 'Lesionados por accidentes de trabajo', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '05', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantlesuno, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantlesdos, 1, 1, 'C', 0);
        $this->pdf->Cell(102, 5, '  De ello: Mujeres', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '06', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantlesunom, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantlesdosm, 1, 1, 'C', 0);
        $this->pdf->Cell(102, 5, 'Fallecidos por accidentes de trabajo', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '07', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantfalltrab, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantfalltrabant, 1, 1, 'C', 0);
        $this->pdf->Cell(102, 5, '  De ello: Mujeres', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '08', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantfalltrabm, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantfalltrabmant, 1, 1, 'C', 0);
        $this->pdf->Cell(102, 5, 'Lesionados por accidentes equiparados al de trabajo', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '09', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantlesequipuno, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantlesequipdos, 1, 1, 'C', 0);
        $this->pdf->Cell(102, 5, '  De ello: Mujeres', 1, 0, 'L', 0);
        $this->pdf->Cell(25, 5, 'Unidad', 1, 0, 'C', 0);
        $this->pdf->Cell(15, 5, '10', 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantlesequip1m, 1, 0, 'C', 0);
        $this->pdf->Cell(30, 5, $datos->cantlesequipdosm, 1, 1, 'C', 0);
        $this->pdf->Ln(40);
        return $this->pdf;
    }


}