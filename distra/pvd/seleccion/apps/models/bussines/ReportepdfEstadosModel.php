<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDFEstado extends fpdf
{
}

class ReportepdfEstadosModel extends ZendExt_Model
{
    public function ReportepdfEstadosModel()
    {
        parent::ZendExt_Model();

    }

    public function exportarestado($filters,$idestructura)
    {
        $pdf = new PDFEstado('L', 'mm', 'A3');
        $pdf->AddPage();
        $idproceso = $filters[0]->value;
        $idestado = $filters[1]->value;
        $obj = new DatCandidato();
        $datos = $obj->getCandidatosRe($idproceso, $idestado,$idestructura);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetMargins(200, 10);

        $w = 0;
        $proc = $datos[$w]['idproceso'];
        // print_r($datos);die;
        while ($datos[$w]['idproceso'] == $proc) {
            $pdf->SetFont('Arial', 'B', 15);
            $pdf->SetMargins(200, 10);
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($datos[$w]['idestructura']);
            $pdf->SetX(20);
            $pdf->Cell(25, 15, "Entidad: " , 'LTB', 0);
            $pdf->SetFont('Arial', '', 15);
            $pdf->Cell(375, 15, utf8_decode("" . $entidad[0]->denominacion), 'TB', 0);
            $pdf->Cell(100, 15, "Fecha:",  'TBR', 0, "");
            $pdf->Ln(15);
            $pdf->SetX(20);
            $pdf->SetFont('Arial', 'B', 15);
            $pdf->Cell(25, 15, "Proceso:" , 'LT', 0, "");
            $pdf->SetFont('Arial', '', 15);
            $pdf->Cell(475, 15,  utf8_decode("" . $datos[$w]['proceso']), 'R', 0, "");
            $pdf->Ln(15);
            $pdf->SetX(20);
            $pdf->SetFont('Arial', 'B', 15);
            $pdf->Cell(50, 15, "Fecha de inicio:" , 'L', 0, "");
            $pdf->SetFont('Arial', '', 15);
            $pdf->Cell(450, 15,  $datos[$w]['fdesde'], 'R', 0, "");
            $pdf->Ln(15);
            $pdf->SetX(20);
            $pdf->SetFont('Arial', 'B', 15);
            $pdf->Cell(60, 15, "Fecha de terminaci�n:" , 'LB', 0, "");
            $pdf->SetFont('Arial', '', 15);
            $pdf->Cell(440, 15,  $datos[$w]['fhasta'], 'R', 0, "");
            $pdf->Ln(15);

            $pdf->SetX(20);
            $pdf->SetFont('Arial', 'B', 15);
            $pdf->Cell(100, 15, " No. Identidad", 1, 0, "C");
            $pdf->Cell(300, 15, " Candidato", 1, 0, "C");
            $pdf->Cell(100, 15, " Estado", 1, 0, "C");
            $pdf->Ln(15);


            do {
                $pdf->SetFont('Arial', '', 15);
                $pdf->SetX(20);
                $pdf->Cell(100, 15, $datos[$w]['numero'], 1, 0, "C");
                $pdf->Cell(300, 15, "" . utf8_decode("" . $datos[$w]['nombre']), 1, 0, "C");
                $pdf->Cell(100, 15, "" . utf8_decode("" . $datos[$w]['estado']), 1, 0, "C");
                $pdf->Ln(15);
                $w++;
            } while ($datos[$w]['idproceso'] == $proc);
            $proc = $datos[$w]['idproceso'];

            $pdf->Ln(30);
            if ($w == count($datos)) {
                break;
            }
        }


        return $pdf;
    }
}
