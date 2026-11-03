<?php
class PDFResumennoidoneo extends fpdf
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

class ReportepdfnoidoneoModel extends ZendExt_Model
{
    public function ReportepdfnoidoneoModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura, $idcargo, $tipo)
    {
        $pdf = new PDFResumennoidoneo('L', 'mm', 'a4');
        $datos = $this->getPersonas($idestructura, $idcargo, $tipo);
        $this->crearEncabezadoPrincipal($pdf, 'Listado de trabajadores no idoneos.');
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
            if ($pdf->GetY() >= '520') {
                $pdf->SetFont('Arial', '', 10);
                $pdf->Cell(40, 6, utf8_decode($val['numid']), 'LRB', 0, 'C', 0);
                $pdf->Cell(100, 6, utf8_decode($val['nombreyapellidos']), 'RB', 0, 'L', 0);
                $pdf->Cell(130, 6, utf8_decode($val['cargo']), 'RB', 1, 'L', 0);
            } else {
                $pdf->SetFont('Arial', '', 10);
                $pdf->Cell(40, 6, utf8_decode($val['numid']), 'LR', 0, 'C', 0);
                $pdf->Cell(100, 6, utf8_decode($val['nombreyapellidos']), 'R', 0, 'L', 0);
                $pdf->Cell(130, 6, utf8_decode($val['cargo']), 'R', 1, 'L', 0);
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
            $pdf->Cell(130, 8, 'Cargo', 1, 0, 'C', 1);
            $pdf->Ln();
        } else {
            $pdf->SetLineWidth(0.3);
            $pdf->SetFillColor(200);
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(40, 8, 'No. de identidad', 1, 0, 'C', 1);
            $pdf->Cell(100, 8, 'Apellidos y nombres', 1, 0, 'C', 1);
            $pdf->Cell(130, 8, 'Cargo', 1, 0, 'C', 1);
            $pdf->Ln();
        }
    }

    private function getPersonas($idestructura, $idcargo, $tipo)
    {
        if ($tipo == 1) {
            $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
                null, $idestructura, $idcargo, null, null, 1
            );
            $result = Array();
            $modeloNegocio = new DatCompetenciaModel();
            foreach ($datos->datos as $per) {
                if ($this->esta($per['idpersona'], $result) == 2) {
                    $comp = $modeloNegocio->getCompetenciaByPersonaCargo($per['idcargo'], $per['idpersona']);
                    if (count($comp) > 0) {
                        $idoneo = true;
                        foreach ($comp as $valc) {
                            if ($valc['idoneo'] == 2) {
                                $idoneo = false;
                            }
                        }
                        if ($idoneo == false) {
                            array_push($result, $per);
                        }
                    }
                }
            }
        } else {
            $datos = DatIdoneidadModel::getPersonasByEstructura($idestructura, null, null, null, 1);
            $result = $datos->datos;
        }       
        return $result;
    }

    private function esta($valor, $array)
    {
        $r = 2;
        foreach ($array as $valc) {
            if ($valc['idpersona'] == $valor) {
                $r = 1;
            }
        }
        return $r;
    }
}