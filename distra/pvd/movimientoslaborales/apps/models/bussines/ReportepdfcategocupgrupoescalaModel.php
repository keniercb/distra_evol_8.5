<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDFCategocupgrupoescala extends fpdf
{
}

class ReportepdfcategocupgrupoescalaModel extends ZendExt_Model
{
    public function ReportepdfcategocupgrupoescalaModel()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte($idestructura)
    {
        $modeloDatos = new DatoscategocupgrupoescalaModel();
        
        $datos = $modeloDatos->getDatos($idestructura);
        
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $entidad = $entidad[0]->denominacion;
        
        $pdf = new PDFCategocupgrupoescala('P', 'mm', 'a3');   
        
        $this->crearEncabezadoPrincipal($pdf, 'Distribución de los Trabajadores por Categoría Ocupacional y Grupo de la Escala', $entidad);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();        
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
            $pdf->Cell(17, 8, utf8_decode($val['denominacion']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['totaloperarios']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['mujeresoperarios']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['totalservicio']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['mujeresservicio']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['totaladministrativos']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['mujeresadministrativos']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['totaltecnicos']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['mujerestecnicos']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['totalcuadros']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['mujerescuadros']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['total']), 1, 0, 'C', 0);
            $pdf->Cell(21.5, 8, utf8_decode($val['mujerestotal']), 1, 0, 'C', 0);
            $pdf->Ln(8);
        }
        
        return $pdf;
    }
    
    private function getEncabezado(&$pdf)
    {
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->SetLineWidth(0.3);
        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(210);
        $pdf->MultiCell(17, 8, 'Grupo Escala', 1, 'C', 1);
        $pdf->Ln(-16);
        $pdf->setX(27);
        $pdf->Cell(43, 16, 'Operarios', 1, 0, 'C', 1);
        $pdf->Cell(43, 16, 'Servicio', 1, 0, 'C', 1);
        $pdf->Cell(43, 16, 'Administrativos', 1, 0, 'C', 1);
        $pdf->Cell(43, 16, utf8_decode('Técnicos'), 1, 0, 'C', 1);
        $pdf->Cell(43, 16, 'Cuadros', 1, 0, 'C', 1);
        $pdf->Cell(43, 16, 'Total', 1, 0, 'C', 1);
        
        $pdf->Ln(16);
        $pdf->Cell(17, 8, 'A', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->SetFont('Arial', '', 10);
    }
    
    private function crearEncabezadoPrincipal(&$pdf, $titulo, $entidad)
    {
        $fechaactual = date('d/m/Y');
        
        $pdf->SetLeftMargin(10);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->SetLineWidth(0.3);
        $pdf->Cell(265, 8, utf8_decode($titulo), 0, 0, 'C', 0);
        $pdf->Ln();
        $pdf->SetFont('Arial', '', 11);
        $pdf->Cell(265, 8, utf8_decode('Entidad: ' . $entidad . '      ' . $fechaactual), 0, 0, 'C', 0);
        $pdf->Ln();
        $pdf->SetFont('Arial', 'B', 11);        
        
        //Creando el encabezado inicial estatico
        $pdf->Ln(8);
        $pdf->SetFillColor(210);
        $pdf->MultiCell(17, 8, 'Grupo Escala', 1, 'C', 1);
        $pdf->Ln(-16);
        $pdf->setX(27);
        $pdf->Cell(43, 16, 'Operarios', 1, 0, 'C', 1);
        $pdf->Cell(43, 16, 'Servicio', 1, 0, 'C', 1);
        $pdf->Cell(43, 16, 'Administrativos', 1, 0, 'C', 1);
        $pdf->Cell(43, 16, utf8_decode('Técnicos'), 1, 0, 'C', 1);
        $pdf->Cell(43, 16, 'Cuadros', 1, 0, 'C', 1);
        $pdf->Cell(43, 16, 'Total', 1, 0, 'C', 1);
        
        $pdf->Ln(16);
        $pdf->Cell(17, 8, 'A', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Total', 1, 0, 'C', 1);
        $pdf->Cell(21.5, 8, 'Mujeres', 1, 0, 'C', 1);
    }
    
}