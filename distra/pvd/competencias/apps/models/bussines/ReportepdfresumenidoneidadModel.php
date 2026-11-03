<?php
class PDFResumenidoneidad extends fpdf
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

class ReportepdfresumenidoneidadModel extends ZendExt_Model
{
    public function reportepdfresumenidoneidadModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura, $idcargo, $tipo)
    {
        $pdf = new PDFResumenidoneidad('L', 'mm', 'a4');
        $datos = $this->getPersonas($idestructura, $idcargo, $tipo);
        $this->crearEncabezadoPrincipal($pdf, 'Resumen de idoneidad.');
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos->datos);
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
            } else if ($val['idoneo'] == 2 || $val['idoneo'] == 0) {
                $idon = 'No';
            }
            if ($pdf->GetY() >= '520') {
                $pdf->SetFont('Arial', '', 10);
                $pdf->Cell(40, 6, utf8_decode($val['numid']), 'LRB', 0, 'C', 0);
                $pdf->Cell(100, 6, utf8_decode($val['nombreyapellidos']), 'RB', 0, 'L', 0);
                $pdf->Cell(110, 6, utf8_decode($val['cargo']), 'RB', 0, 'L', 0);
                $pdf->Cell(20, 6, $idon, 'RB', 1, 'C', 0);
            } else {
                $pdf->SetFont('Arial', '', 10);
                $pdf->Cell(40, 6, utf8_decode($val['numid']), 'LR', 0, 'C', 0);
                $pdf->Cell(100, 6, utf8_decode($val['nombreyapellidos']), 'R', 0, 'L', 0);
                $pdf->Cell(110, 6, utf8_decode($val['cargo']), 'R', 0, 'L', 0);
                $pdf->Cell(20, 6, $idon, 'R', 1, 'C', 0);
            }
        }
        $pdf->Cell(270, 0.1, '', 'T', 0, 'C', 0);
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $titulo)
    {
        if (!empty($titulo)) {
            $pdf->SetLeftMargin(15);
            $pdf->AddPage();
            $pdf->SetFont('Arial', 'B', 16);
            $pdf->Cell(265, 8, utf8_decode($titulo), 0, 0, 'C', 0);
            $pdf->Ln(10);
            $pdf->SetLineWidth(0.3);
            $pdf->SetFillColor(200);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(40, 8, 'No. de identidad', 1, 0, 'C', 1);
            $pdf->Cell(100, 8, 'Apellidos y nombres', 1, 0, 'C', 1);
            $pdf->Cell(110, 8, 'Cargo', 1, 0, 'C', 1);
            $pdf->Cell(20, 8, 'Idoneo', 1, 0, 'C', 1);
            $pdf->Ln();
        } else {
            $pdf->SetLineWidth(0.3);
            $pdf->SetFillColor(200);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(40, 8, 'No. de identidad', 1, 0, 'C', 1);
            $pdf->Cell(100, 8, 'Apellidos y nombres', 1, 0, 'C', 1);
            $pdf->Cell(110, 8, 'Cargo', 1, 0, 'C', 1);
            $pdf->Cell(20, 8, 'Idoneo', 1, 0, 'C', 1);
            $pdf->Ln();
        }
    }

    private function getPersonas($idestructura, $idcargo, $tipo)
    {
        if ($tipo == 1) {
            $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
                null,
                $idestructura,
                $idcargo,
                null,
                null,
                1
            );
            $modeloNegocio = new DatCompetenciaModel();
            foreach ($datos->datos as $p=>$per) {
                $comp = $modeloNegocio->getCompetenciaByPersonaCargo($per['idcargo'], $per['idpersona']);
                if (count($comp) > 0) {
                    $datos->datos[$p]['idoneo'] = 1; // idoneo
                    foreach ($comp as $valc) {
                        if ($valc['idoneo'] == 2) {
                            $datos->datos[$p]['idoneo'] = 2;
                        }
                    }
                }
            }
        } else {
            $datos = DatIdoneidadModel::getPersonasByEstructura($idestructura, null, null, null);
        }
        return $datos;
    }
}