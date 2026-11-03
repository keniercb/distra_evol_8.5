<?php

class PDFPartesCuerpo extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 8);
        $this->Cell(100, 8, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(20, 8, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 8, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
    }
}


class ReportepdfComportamientoModel extends ZendExt_Model
{
    public function PartesCuerpopdf()
    {
        parent::ZendExt_Model();

    }

    public function CrearReportePDF($idestructura, $annoini, $annofin)
    {

        $pdf = new PDFPartesCuerpo('L', 'mm', 'letter');
        $pdf->AddPage();
        $modeloNegocio = new DatAnalisisModel();
        $datos = $modeloNegocio->getDatosComportamiento($idestructura, $annoini, $annofin);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos, $annoini, $annofin);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos, $annoini, $annofin)
    {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetX(65);
        $pdf->Cell(143, 8, utf8_decode('COMPORTAMIENTO DE LOS ACCIDENTES DE TRABAJO ATENDIENDO A LA EDAD DE LOS LESIONADOS'), 0, 1, 'C');
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->SetX(5);
        $pdf->Cell(50, 16, utf8_decode('EDAD'), 1, 0, 'C');
        $pdf->Cell(220, 8, utf8_decode('AÑO'), 1, 1, 'C');

        $redades = array('menos17' => '- de 17 años', 'entre1725' => 'De 17 a 25 años', 'entre2640' => 'De 26 a 40 años', 'entre4150' => 'De 41 a 50 años', 'entre5160' => 'De 51 a 60 años', 'mayor60' => '+ 60 años',);
        $rannos = array();
        $init = $annoini;
        $longannos = (220 / ($annofin - $annoini + 1));
        $pdf->SetX(55);
        while ($init <= $annofin) {
            $rannos[$init] = $init;
            $pdf->Cell($longannos, 8, utf8_decode($init), 1, 0, 'C');
            foreach ($datos as $dat) {
                $result[$dat['anno']] = $dat;
            }
            $init++;
        }
        $pdf->Ln();
        $pdf->SetFont('Arial', '', 9);

        foreach ($redades as $key => $edad) {
            $pdf->SetX(5);
            $pdf->Cell(50, 8, utf8_decode($edad), 1, 0, 'C');
            foreach ($rannos as $anno) {
                $pdf->Cell($longannos, 8, ($result[$anno][$key] ? $result[$anno][$key] : 0), 1, 0, 'C');
            }
            $pdf->Cell(0.1, 8, '', 0, 1);
        }
        return $pdf;
    }
}
