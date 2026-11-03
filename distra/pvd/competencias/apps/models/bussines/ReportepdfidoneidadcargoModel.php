<?php
class PDFResumenidoneidadcargo extends fpdf
{

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

class ReportepdfidoneidadcargoModel extends ZendExt_Model
{
    public function reportepdfidoneidadcargoModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($personas, $idcargo)
    {
        $pdf = new PDFResumenidoneidadcargo('L', 'mm', 'a4');
        $datos = $this->getIdoneidadAction($personas, $idcargo);
        $this->crearEncabezadoPrincipal($pdf, 'Resumen de idoneidad.', $idcargo);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        foreach ($datos as $val) {
            $y = $pdf->GetY();
            if ($y >= '510' ) {
                $pdf->AddPage();
                $this->getEncabezado($pdf);
            }
            $idon = '';
            if ($val['idoneo'] == 1) {
                $idon = 'Si';
            } else if ($val['idoneo'] == 2) {
                $idon = 'No';
            }
            if ($pdf->GetY() >= '520') {
                $pdf->SetFont('Arial', '', 10);
                $pdf->Cell(40, 6, utf8_decode($val['numid']), 'LRB', 0, 'C', 0);
                $pdf->Cell(100, 6, utf8_decode($val['nombreapellidos']), 'RB', 0, 'L', 0);
                $pdf->Cell(110, 6, utf8_decode($val['denomcargo']), 'RB', 0, 'L', 0);
                $pdf->Cell(20, 6, $idon, 'RB', 1, 'C', 0);
            } else {
                $pdf->SetFont('Arial', '', 10);
                $pdf->Cell(40, 6, utf8_decode($val['numid']), 'LR', 0, 'C', 0);
                $pdf->Cell(100, 6, utf8_decode($val['nombreapellidos']), 'R', 0, 'L', 0);
                $pdf->Cell(110, 6, utf8_decode($val['denomcargo']), 'R', 0, 'L', 0);
                $pdf->Cell(20, 6, $idon, 'R', 1, 'C', 0);
            }
        }
        $pdf->Cell(270, 0.1, '', 'T', 0, 'C', 0);
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo, $idcargo)
    {
        if (!empty($titulo)) {
            $pdf->SetLeftMargin(15);
            $pdf->AddPage();
            $pdf->SetFont('Arial', 'B', 16);
            $cargo = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idcargo);
            $pdf->Cell(265, 8, utf8_decode($titulo), 0, 0, 'C', 0);
            $pdf->Ln(10);

            $pdf->SetLineWidth(0.3);
            $pdf->SetFillColor(200);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(265, 8, utf8_decode('Cargo: '.$cargo[0]->denominacion), 0, 0, 'L', 0);
            $pdf->Ln(10);
            $pdf->Cell(40, 8, 'No. de identidad', 1, 0, 'C', 1);
            $pdf->Cell(100, 8, 'Nombre y apellidos', 1, 0, 'C', 1);
            $pdf->Cell(110, 8, 'Cargo actual', 1, 0, 'C', 1);
            $pdf->Cell(20, 8, 'Idoneo', 1, 0, 'C', 1);
            $pdf->Ln();
        } else {
            $pdf->SetLineWidth(0.3);
            $pdf->SetFillColor(200);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(40, 8, 'No. de identidad', 1, 0, 'C', 1);
            $pdf->Cell(100, 8, 'Nombre y apellidos', 1, 0, 'C', 1);
            $pdf->Cell(110, 8, 'Cargo actual', 1, 0, 'C', 1);
            $pdf->Cell(20, 8, 'Idoneo', 1, 0, 'C', 1);
            $pdf->Ln();
        }
    }

    function getIdoneidadAction($personas, $idcargo)
    {
        $dpersonas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona($personas);
        $modeloNegocio = new DatCompetenciaModel();
        foreach ($dpersonas->data as $p=>$per) {
            $dpersonas->data[$p]['idpersona'] = $per['idpersona'];
            $comp = $modeloNegocio->getCompetenciaByPersonaCargo($idcargo, $per['idpersona']);
            if (count($comp) > 0) {
                $dpersonas->data[$p]['idoneo'] = 1; // idoneo
                foreach ($comp as $valc) {
                    if ($valc['idoneo'] == 2) {
                        $dpersonas->data[$p]['idoneo'] = 2;
                    }
                }
            }
        }//print_r($dpersonas->data);die;
        return $dpersonas->data;
    }
}