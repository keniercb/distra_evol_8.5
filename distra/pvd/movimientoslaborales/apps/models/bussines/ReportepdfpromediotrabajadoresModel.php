<?php

class PDFPromediotrabajadores extends fpdf
{

    function Footer()
    {
    }
}


class ReportepdfpromediotrabajadoresModel extends ZendExt_Model
{

    public function DatpdfModel()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte($estructura, $fdesde, $fhasta, $datos)
    {
        $pdf = new PDFPromediotrabajadores('P', 'mm', 'A3');
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 22);
        $pdffinal = $this->cabeceraPricipalReporte($pdf, $estructura, $fdesde, $fhasta, $datos['resultado'], $datos['catocup']);
        $pdffinal = $this->cuerpoReporte($pdf, $estructura, $fdesde, $fhasta, $datos);
        ob_clean();
        $pdffinal->Output();
    }

    private function cuerpoReporte($pdf, $estructura, $fdesde, $fhasta, $datos)
    {
        $pdf->SetLeftMargin(25);
        $pdf->SetFont('Arial', '', 9);

        $fini = explode('-', $fdesde);
        $ff = explode('-', $fhasta);
        $finicio = date_create($fini[0] . '-' . $fini[1] . '-' . $fini[2]);
        $ffin = date_create($ff[0] . '-' . $ff[1] . '-' . $ff[2]);

        $y = $pdf->GetY();
        if ($y >= '510') {
            $pdf->AddPage();
            $this->cabeceraReporte($pdf, $estructura, $fdesde, $fhasta, $datos['resultado'], $datos['catocup']);
            $pdf->SetFont('Arial', '', 9);
        }
        $dia = intval($finicio->format("d"));
        $mes = intval($finicio->format("m"));
        $ano = intval($finicio->format("A"));

        foreach ($datos['resultado'] as $k => $val) {
            $totaltrabajadores = 0;
            $totalmujeres = 0;
            $pdf->Cell(50, 10, $k, 1, 0, "C", 0);
            $pdf->Cell(17.5, 10, $val['total']['total'], 1, 0, "C", 0);
            $pdf->Cell(17.5, 10, $val['total']['mujer'], 1, 0, "C", 0);
            foreach ($val as $key => $v) {
                if ($key != 'total') {
                    $pdf->Cell(17.5, 10, $v['total'], 1, 0, "C", 0);
                    $pdf->Cell(17.5, 10, $v['mujer'], 1, 0, "C", 0);
                }
            }

            $pdf->Ln(10);
        }

        $pdf->SetFillColor(200);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(50, 10, 'SUMA', 1, 0, "T", 1);
        $pdf->Cell(17.5, 10, $datos['suma']['total']['total'], 1, 0, "C", 1);
        $pdf->Cell(17.5, 10, $datos['suma']['total']['mujer'], 1, 0, "C", 1);
        foreach ($datos['catocup'] as $key => $cat) {
            $pdf->Cell(17.5, 10, $datos['suma'][$cat]['total'], 1, 0, "C", 1);
            $pdf->Cell(17.5, 10, $datos['suma'][$cat]['mujer'], 1, 0, "C", 1);
        }

        $pdf->Ln(10);
        $pdf->Cell(50, 10, utf8_decode('PROM TRAB SEGÚN REGISTRO'), 1, 0, "T", 1);
        $pdf->Cell(17.5, 10, $datos['promedio']['total']['total'], 1, 0, "C", 1);
        $pdf->Cell(17.5, 10, $datos['promedio']['total']['mujer'], 1, 0, "C", 1);
        foreach ($datos['catocup'] as $key => $cat) {
            $pdf->Cell(17.5, 10, $datos['promedio'][$cat]['total'], 1, 0, "C", 1);
            $pdf->Cell(17.5, 10, $datos['promedio'][$cat]['mujer'], 1, 0, "C", 1);
        }

        $pdf->Ln(10);
        $pdf->Cell(50, 10, utf8_decode('PROMEDIO ADICIONES'), 1, 0, "T", 1);
        $pdf->Cell(17.5, 10, $datos['adiciones']['total']['total'], 1, 0, "C", 1);
        $pdf->Cell(17.5, 10, $datos['adiciones']['total']['mujer'], 1, 0, "C", 1);
        foreach ($datos['catocup'] as $key => $cat) {
            if($datos['adiciones'][$cat]['total'])
                $pdf->Cell(17.5, 10, $datos['adiciones'][$cat]['total'], 1, 0, "C", 1);
            else
                $pdf->Cell(17.5, 10, '0', 1, 0, "C", 1);
            if($datos['adiciones'][$cat]['mujer'])
                $pdf->Cell(17.5, 10, $datos['adiciones'][$cat]['mujer'], 1, 0, "C", 1);
            else
                $pdf->Cell(17.5, 10, '0', 1, 0, "C", 1);
        }
        $pdf->Ln(10);
        $pdf->Cell(50, 10, utf8_decode('PROMEDIO DEDUCCIONES'), 1, 0, "T", 1);
        $pdf->Cell(17.5, 10, $datos['deduciones']['total']['total'], 1, 0, "C", 1);
        $pdf->Cell(17.5, 10, $datos['deduciones']['total']['mujer'], 1, 0, "C", 1);
        foreach ($datos['catocup'] as $key => $cat) {
            if($datos['deduciones'][$cat]['total'])
                $pdf->Cell(17.5, 10, $datos['deduciones'][$cat]['total'], 1, 0, "C", 1);
            else
                $pdf->Cell(17.5, 10, '0', 1, 0, "C", 1);
            if($datos['deduciones'][$cat]['mujer'])
                $pdf->Cell(17.5, 10, $datos['deduciones'][$cat]['mujer'], 1, 0, "C", 1);
            else
                $pdf->Cell(17.5, 10, '0', 1, 0, "C", 1);
        }
        $pdf->Ln(10);
        $pdf->Cell(50, 10, utf8_decode('PROMEDIO TOTAL GENERAL'), 1, 0, "T", 1);
        $pdf->Cell(17.5, 10, $datos['promediototal']['total']['total'], 1, 0, "C", 1);
        $pdf->Cell(17.5, 10, $datos['promediototal']['total']['mujer'], 1, 0, "C", 1);
        foreach ($datos['catocup'] as $key => $cat) {
            if($datos['promediototal'][$cat]['total'])
                $pdf->Cell(17.5, 10, $datos['promediototal'][$cat]['total'], 1, 0, "C", 1);
            else
                $pdf->Cell(17.5, 10, '0', 1, 0, "C", 1);
            if($datos['promediototal'][$cat]['mujer'])
                $pdf->Cell(17.5, 10, $datos['promediototal'][$cat]['mujer'], 1, 0, "C", 1);
            else
                $pdf->Cell(17.5, 10, '0', 1, 0, "C", 1);
        }
        return $pdf;
    }

    private
    function cabeceraPricipalReporte(&$pdf, $estructura, $fdesde, $fhasta, $personasPorCatOcupacional, $catocup)
    {
        $pdf->SetLeftMargin(25);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(250, 8, utf8_decode('PROMEDIO DE TRABAJADORES'), 0, 1, 'C', 0);
        $pdf->SetFillColor(200);
        $pdf->Ln(5);
        $pdf->SetFont('Arial', '', 10);
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($estructura);
        $pdf->Cell(230, 10, "ENTIDAD: " . utf8_decode($entidad[0]->denominacion), 0, 0, "L", 0);
        $pdf->Ln(10);
        $pdf->Cell(123, 10, "FECHA: " . date('d/m/Y'), 0, 0, "L", 0);

        $fini = explode('-', $fdesde);
        $ff = explode('-', $fhasta);
        $finicio = substr($fini[2], 0, 2) . '/' . $fini[1] . '/' . $fini[0];
        $ffin = substr($ff[2], 0, 2) . '/' . $ff[1] . '/' . $ff[0];

        $pdf->Cell(122, 10, utf8_decode("PERÍODO: " . $finicio . ' - ' . $ffin), 0, 0, "L", 0);
        $pdf->Ln(15);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(50, 10, utf8_decode('DÍAS DEL'), 'LTR', 0, "C", 1);

        $pdf->Cell(35, 10, utf8_decode("TOTAL REGISTRO"), 1, 0, "C", 1);
        foreach ($catocup as $i => $val) {
            $pdf->Cell(35, 10, utf8_decode($val), 1, 0, "C", 1);
        }

        $pdf->Ln(10);
        $pdf->Cell(50, 10, utf8_decode("CALENDARIO"), 'LRB', 0, "C", 1);

        $pdf->Cell(17.5, 10, 'TOTAL', 1, 0, "C", 1);
        $pdf->Cell(17.5, 10, 'MUJERES', 1, 0, "C", 1);
        foreach ($catocup as $i => $val) {
            $pdf->Cell(17.5, 10, 'TOTAL', 1, 0, "C", 1);
            $pdf->Cell(17.5, 10, 'MUJERES', 1, 0, "C", 1);
        }
        $pdf->Ln(10);

        return $pdf;
    }

    private
    function cabeceraReporte(&$pdf, $estructura, $fdesde, $fhasta, $personasPorCatOcupacional, $catocup)
    {
        $pdf->SetLeftMargin(25);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(50, 10, utf8_decode('DÍAS DEL'), 'LTR', 0, "C", 1);

        foreach ($catocup as $key => $cat) {
            $pdf->Cell(35, 10, utf8_decode($cat), 1, 0, "C", 1);
        }
        $pdf->Cell(35, 10, utf8_decode("TOTAL REGISTRO"), 1, 0, "C", 1);
        $pdf->Ln(10);
        $pdf->Cell(50, 10, utf8_decode("CALENDARIO"), 'LRB', 0, "C", 1);

        foreach ($catocup as $key => $cat) {
            $pdf->Cell(17.5, 10, 'TOTAL', 1, 0, "C", 1);
            $pdf->Cell(17.5, 10, 'MUJERES', 1, 0, "C", 1);
        }
        $pdf->Cell(17.5, 10, 'TOTAL', 1, 0, "C", 1);
        $pdf->Cell(17.5, 10, 'MUJERES', 1, 0, "C", 1);
        $pdf->Ln(10);
        return $pdf;
    }


}