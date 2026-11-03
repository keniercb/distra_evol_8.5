<?php
class PDFEvaluacionriesgo extends fpdf
{
    private $pdf;
    private $alingsArray;
    private $datos;
    function Footer()
    {

    }
}
class ReportepdfevaluacionriesgoModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura, $entidad)
    {
        $pdf = new PDFEvaluacionriesgo('L', 'mm', 'a4');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        $objDS = new DatRiesgoModel();
        $datos = $objDS->getRiesgo(null, $idestructura);
        if (isset($idestructura)) {
            $est = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
            $estructura = $est[0]->denominacion;
        }
        $this->crearEncabezadoPrincipal('EVALUACIÓN DE RIESGOS', $estructura, $entidad);
        $pdfNGeneral = $this->crearCuerpo($datos->datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($datos)
    {
        $this->pdf->SetFont('Arial', '', 12);
        $no = 0;
        foreach ($datos as $val) {
            $y = $this->pdf->GetY();
            if ($y >= '180') {
                $this->crearEncabezadoPrincipal();
                $this->pdf->SetFont('Arial', '', 12);
            }
            $no++;
            $widthHeaderTable = array(20, 20, 30, 30, 70, 30, 30, 30, 25);
            $align = ['C', 'C', 'C', 'C', 'C', 'C', 'C', 'C', 'C'];
            $this->alingsArray = $align;
            $this->table->SetAligns($this->alingsArray);
            $this->table->SetWidths($widthHeaderTable);
            $magnitud = '';
            if (!empty($val['gradopeligrosidad'])) {
                $magnitud = 'GP = '. $val['gradopeligrosidad']. ' '. utf8_decode($val['magnitud']);
            }
            $eventos = '';
            $dateventos = DatRiesgoevento::getEventosByRiesgo($val['idriesgo']);
            foreach ($dateventos as $eve) {
                $eventos .= $eve['evento'] .'. ';
            }
            $consecuencias = '';
            $datconsecuencias = DatRconsecuencia::getConsecuenciasByRiesgo($val['idriesgo']);
            foreach ($datconsecuencias as $cons) {
                $consecuencias .= $cons['consecuencia'] . '. ';
            }
            $peligros = '';
            $datpeligros = DatRpeligro::getPeligrosByRiesgo($val['idriesgo']);
            foreach ($datpeligros as $pel) {
                $peligros .= $pel['peligro'] . '. ';
            }
            $medidas = '';
            $datmedidas = DatMedida::getMedidasByRiesgo($val['idriesgo']);
            foreach ($datmedidas as $med) {
                $medidas .= $med['medida'] . ' ';
            }
            $arr = array(utf8_decode($val['sistema']), utf8_decode($val['partesistema']),
                utf8_decode($val['denomriesgo']), utf8_decode($eventos), utf8_decode($consecuencias),
                utf8_decode($peligros), utf8_decode($medidas), $magnitud,
                $val['orden']);
            $this->table->Row($arr, 0, 0);
        }
        return $this->pdf;
    }

    private function crearEncabezadoPrincipal($titulo, $area, $entidad)
    {
        $this->pdf->SetLeftMargin(5);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Arial', 'B', 14);
        $this->pdf->SetLineWidth(0.3);
        if ($titulo) {
            $this->pdf->Cell(285, 10, utf8_decode($titulo), 0, 0, 'C', 0);
            $this->pdf->Ln();
        }
        //Creando el encabezado inicial estatico
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->Cell(180, 6, 'ENTIDAD: '. $entidad, 1, 0, 'L', 0);
        $this->pdf->Cell(105, 6, 'MANDO: ', 1, 1, 'L', 0);
        $this->pdf->Cell(285, 6, utf8_decode('LUGAR DONDE SE REALIZA LA EVALUACIÓN: ').utf8_decode($area), 1, 1, 'L', 0);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->MultiCell(20, 15, utf8_decode('SISTEMA'), 1, 'C', 0);
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 20);
        $this->pdf->MultiCell(20, 5, utf8_decode('PARTE DEL SISTEMA'), 1, 'C', 0);
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 40);
        $this->pdf->MultiCell(30, 15, utf8_decode('RIESGO'), 1, 'C', 0);
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 70);
        $this->pdf->Cell(30, 15, utf8_decode('EVENTO'), 1, 0, 'C', 0);
        $x = $this->pdf->GetX();
        $this->pdf->MultiCell(70, 15, utf8_decode('CONSECUENCIAS'), 1, 'C', 0);
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 70);
        $this->pdf->MultiCell(30, 7.5, utf8_decode('FACTOR DE RIESGO'), 1, 'C', 0);
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 100);
        $this->pdf->MultiCell(30, 7.5, utf8_decode('MEDIDA PREVENTIVA'), 1, 'C', 0);
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 130);
        $this->pdf->MultiCell(30, 7.5, utf8_decode('MAGNITUD DEL RIESGO'), 1, 'C', 0);
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 160);
        $this->pdf->MultiCell(25, 7.5, utf8_decode('ORDEN DE PRIORIDAD'), 1, 'C', 0);
    }


}