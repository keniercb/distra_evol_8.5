<?php
class PDFTiposDocIdent extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial','I',9);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página '.$this->PageNo()), 0, 0, 'R');
    }
}

class ReportePDFTiposDocumentoModel extends ZendExt_Model
{

    public function ReportePDFTiposDocumentoModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($datos, $listadopersonas)
    {
        if ($listadopersonas) {
            $pdf = new PDFTiposDocIdent('P', 'mm', 'a3');
            $this->crearEncabezadoPrincipalPersonas($pdf, 'Listado de personas');
            $pdfNGeneral = $this->crearCuerpoPersonas($pdf, $datos);
            $pdfNGeneral->Output();
        } else {
            $pdf = new PDFTiposDocIdent('P', 'mm', 'a3');
            $this->crearEncabezadoPrincipal($pdf, 'Tipos de documento de identificación');
            $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
            $pdfNGeneral->Output();
        }
    }

    private function crearCuerpo($pdf, $datos)
    {
        $pdf->SetFont('Arial', '', 10);
        $pdf->Ln(8);
        
        foreach ($datos as $k => $val) {
            $y = $pdf->GetY();
            if ($y >= '510' ) {
                $pdf->AddPage();
                $this->getEncabezado($pdf);
                $pdf->Ln(8);
            }
            $pdf->Cell(15, 8, $k+1, 1, 0, 'C', 0);
            $pdf->Cell(175, 8, utf8_decode($val['tipodocumento']), 1, 0, 'L', 0);
            $pdf->Cell(45, 8, utf8_decode($val['cantidad']), 1, 0, 'C', 0);
            $pdf->Cell(40, 8, utf8_decode($val['cantidadprincipal']), 1, 0, 'C', 0);
            $pdf->Ln(8);
        }
        
        return $pdf;
    }
    
    private function crearCuerpoPersonas($pdf, $datos)
    {
        $pdf->SetFont('Arial', '', 10);
        $pdf->Ln(8);
        
        foreach ($datos as $k => $val) {
            $y = $pdf->GetY();
            if ($y >= '510' ) {
                $pdf->AddPage();
                $this->getEncabezadoPersonas($pdf);
                $pdf->Ln(8);
            }
            $pdf->Cell(15, 8, $k+1, 1, 0, 'C', 0);            
            $pdf->Cell(60, 8, utf8_decode($val['docident']), 1, 0, 'L', 0);
            $pdf->Cell(50, 8, utf8_decode($val['nombre']), 1, 0, 'L', 0);
            $pdf->Cell(50, 8, utf8_decode($val['snombre']), 1, 0, 'L', 0);
            $pdf->Cell(50, 8, utf8_decode($val['papel']), 1, 0, 'L', 0);
            $pdf->Cell(50, 8, utf8_decode($val['sapel']), 1, 0, 'L', 0);
            $pdf->Ln(8);
        }
        
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo)
    {
        $pdf->SetLeftMargin(10);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->SetLineWidth(0.3);
        $pdf->Cell(265, 8, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln();
        $pdf->SetFont('Arial', 'B', 11);

        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(200);
        $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
        $pdf->Cell(175, 8, 'Tipo de documento', 1, 0, 'C', 1);
        $pdf->Cell(45, 8, 'Cant. de personas', 1, 0, 'C', 1);
        $pdf->Cell(40, 8, 'Como principal', 1, 0, 'C', 1);
    }
   
    private function crearEncabezadoPrincipalPersonas(&$pdf, $titulo)
    {
        $pdf->SetLeftMargin(10);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->SetLineWidth(0.3);
        $pdf->Cell(265, 8, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln();
        $pdf->SetFont('Arial', 'B', 11);

        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(200);
        $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
        $pdf->Cell(60, 8, 'Doc. de identidad', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Nombre', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Segundo nombre', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Primer apellido', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Segundo apellido', 1, 0, 'C', 1);
    }

    private function getEncabezado(&$pdf)
    {
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->SetLineWidth(0.3);
        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(200);
        $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
        $pdf->Cell(175, 8, 'Tipo de documento', 1, 0, 'C', 1);
        $pdf->Cell(45, 8, 'Cant. de personas', 1, 0, 'C', 1);
        $pdf->Cell(40, 8, 'Como principal', 1, 0, 'C', 1);
        $pdf->SetFont('Arial', '', 10);
    }
    
    private function getEncabezadoPersonas(&$pdf)
    {
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->SetLineWidth(0.3);
        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(200);
        $pdf->Cell(15, 8, 'No.', 1, 0, 'C', 1);
        $pdf->Cell(60, 8, 'Doc. de identidad', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Nombre', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Segundo nombre', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Primer apellido', 1, 0, 'C', 1);
        $pdf->Cell(50, 8, 'Segundo apellido', 1, 0, 'C', 1);
        $pdf->SetFont('Arial', '', 10);
    }
}