<?php
include 'PDF_MC_Table.php';
class PDFPartediario extends fpdf
{
    function Footer()
    {
        $this->SetFont('Arial', 'B', 10);
        $this->Ln(30);
        $this->SetX(20);
        $this->Write(10,'ELABORADO POR:');
        $this->SetX(300);
        $this->SetX(55);
        $this->Write(10,'__________________________');
        $this->SetX(200);
        $this->Write(10,'REVISADO POR:');
        $this->SetX(300);
        $this->SetX(230);
        $this->Write(10,'_________________________');
        $this->SetX(300);
        $this->Ln();
        $this->SetX(112);
        $this->Write(40,'APROBADO POR:');
        $this->SetX(300);
        $this->SetX(144);
        $this->Write(40,'_________________________');
        $this->SetX(300);

        $this->Cell(0,100,' '.$this->PageNo(),0,0,'C');
    }
}


class DatpdfpartediarionominalModel extends ZendExt_Model
{

    public function DatpdfpartediarionominalModel()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte($arreglo, $fecha, $estructura, $horareporte, $resultado)
    {
        $pdf = new PDFPartediario('L', 'mm',/*array(600,565)*/
            'A3');
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 22);
        $pdffinal = $this->cabeceraReporte($pdf, $arreglo, $fecha, $estructura, $horareporte);
        $pdffinal = $this->cuerpoReporte($pdf, $arreglo, $resultado);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $arreglo, $resultado)
    {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetX(5);
        $pdf->SetFillColor(100, 100);
        $pdf->Cell(10, 10, "No.", 0, 0, "");
        $pdf->Cell(100, 10, "Nombres y apellidos", 0, 0, "");
        $pdf->Cell(100, 10, "" . utf8_decode("Grado militar, categoría y llamado"), 0, 0, "");
        $pdf->Cell(100, 10, "Cargo", 0, 0, "");
        $pdf->Cell(100, 10, "Causa y lugar de destino", 0, 0, "");
        $pdf->Cell(50, 10, "Observaciones", 0, 0, "");
        $pdf->Ln(10);
        foreach ($resultado as $j => $value) {
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->SetX(5);
            $pdf->Cell(50, 10, utf8_decode("Área: ") . ' ' . utf8_decode("" . $value), 0, 0, "");
            $pdf->Ln(10);
            foreach ($arreglo as $i => $datos) {
              if ($j == $datos['idarea']) {
                    $pdf->SetFont('Arial', '', 12);
                    $pdf->SetX(5);
                    $pdf->Cell(10, 10, $i + 1, 0, 0, "");
                    $pdf->Cell(100, 10, "" . utf8_decode("" . $datos['nombreapellidos']), 0, 0, "");
                    $pdf->Cell(100, 10, "" . utf8_decode("" . $datos['gradocategoriallamado']), 0, 0, "");
                    $pdf->Cell(100,10,"".utf8_decode("".$datos['denomcargo']),0,0, "");
                    $pdf->Cell(100, 10, "" . utf8_decode("" . $datos['causa']), 0, 0, "");
                    $pdf->Cell(50, 10, "" . utf8_decode("" . $datos['observacion']), 0, 0, "");
                    $pdf->Ln(10);
               }
            }
        }
        return $pdf;
    }

    public function cabeceraReporte($pdf, $arreglo, $fecha, $estructura, $horareporte)
    {
        $pdf->SetFont('Arial', 'B', 13);
        $pdf->Text(5, 20, "" . utf8_decode("RELACIÓN NOMINAL SOBRE LA SITUACIÓN DEL PERSONAL"));
        $pdf->Ln(20);

        $pdf->SetFont('Arial', '', 15);
        $pdf->Text(5, 30, "UM-ENTIDAD:" . ' ' . utf8_decode("" . $estructura));
        $pdf->Ln(20);

        $pdf->SetFont('Arial', '', 13);
        $pdf->Text(5, 40, "FECHA:" . ' ' . $fecha . ' - ' . $horareporte);
        $pdf->Ln(10);

        return $pdf;
    }
}