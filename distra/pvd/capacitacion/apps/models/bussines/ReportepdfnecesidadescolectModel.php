<?php
class PDFNecesidadescolectivas extends fpdf
{
    private $necesidades;
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

class ReportepdfnecesidadescolectModel extends ZendExt_Model
{
    public function reportepdfnecesidadescolectModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura)
    {
        $pdf = new PDFNecesidadescolectivas('L', 'mm', 'a3');
        $identidad = $this->global->Estructura->idestructura;
        $this->necesidades = NomNecesidaddecapacitacion::getNecesidadesActivos(null, $identidad);
        $datos = DatNecesidadModel::getNecesidadesByEstructura($idestructura);
        $pdf->SetLeftMargin(15);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(530, 10, utf8_decode('Reporte colectivo de necesidades de capacitación'), 0, 0, 'C', 0);
        $pdf->Ln(10);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $datos)
    {
        foreach ($datos as $val) {
            if (count($val['personas']) > 0) {
                $y = $pdf->GetY();
                if ($y >= '300' ) {
                    $pdf->AddPage();
                }
                $this->crearEncabezadoPrincipal($pdf, $val['estructura'], $this->necesidades);
                $pdf->SetFont('Arial', '', 12);
                $necGenerales = $this->necesidades;
                foreach ($val['personas'] as $p) {
                    $pdf->SetFont('Arial', '', 14);
                    $pdf->Cell(140, 10, utf8_decode($p['nombre']), 1, 0, 'L', 0);
                    $necPersonas = $this->organizarNecesidad($p['necesidades'], $necGenerales);
                    $necGenerales = $necPersonas->necesidades;
                    foreach ($necPersonas->valores as $n) {
                        if ($n == 1) {
                            $pdf->Cell(10, 10, 'X', 1, 0, 'C', 0);
                        } else {
                            $pdf->Cell(10, 10, '', 1, 0, 'C', 0);
                        }
                    }
                    $pdf->Ln();
                }
                $pdf->SetFont('Arial', 'B', 12);
                $pdf->Cell(140, 10, 'Total', 1, 0, 'L', 0);
                foreach ($necGenerales as $n) {
                    if (empty($n['cant'])) {
                        $pdf->Cell(10, 10, 0, 1, 0, 'C', 0);
                    } else {
                        $pdf->Cell(10, 10, $n['cant'], 1, 0, 'C', 0);
                    }
                }
                $pdf->Ln();
            }
        }
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(530, 10, 'Leyenda', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        foreach ($this->necesidades as $pos => $nec) {
            $pdf->Ln();
            $pdf->Cell(10, 10, utf8_decode(($pos+1).' - '.$nec['necesidad']), 0, 0, 'L', 0);
        }
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $estructura)
    {
        $pdf->SetLeftMargin(15);
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(120, 10, utf8_decode($estructura), 0, 0, 'L', 0);
        $pdf->Ln();
        $pdf->SetLineWidth(0.3);
        $pdf->SetFillColor(200);
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(140, 10, utf8_decode('Nombre y apellidos'), 1, 0, 'L', 1);
        $cant = count($this->necesidades);
        $n = 1;
        while ($cant >= $n) {
            $pdf->Cell(10, 10, $n, 1, 0, 'C', 1);
            $n++;
        }
        $pdf->Ln();
    }

    private function organizarNecesidad($necesidpersonas, $necGen)
    {
        $nec = Array();
        foreach ($this->necesidades as $p => $nn) {
            $esta = 0;
            foreach ($necesidpersonas as $np) {
                if ($nn['idnecesidad'] == $np['idnecesidad']) {
                    $esta = 1;
                    $necGen[$p]['cant'] = (empty($necGen[$p]['cant']))?1:($necGen[$p]['cant']+1);
                }
            }
            if ($esta == 1) {
                array_push($nec, 1);
            } else {
                array_push($nec, 0);
            }
        }
        $result->valores = $nec;
        $result->necesidades = $necGen;
        return $result;
    }

}