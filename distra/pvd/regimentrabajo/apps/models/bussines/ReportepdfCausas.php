<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDF_Rotate extends FPDF
{
    var $angle = 0;

    function Rotate($angle, $x = -1, $y = -1)
    {
        if ($x == -1)
            $x = $this->x;
        if ($y == -1)
            $y = $this->y;
        if ($this->angle != 0)
            $this->_out('Q');
        $this->angle = $angle;
        if ($angle != 0) {
            $angle *= M_PI / 180;
            $c = cos($angle);
            $s = sin($angle);
            $cx = $x * $this->k;
            $cy = ($this->h - $y) * $this->k;
            $this->_out(sprintf('q %.5f %.5f %.5f %.5f %.2f %.2f cm 1 0 0 1 %.2f %.2f cm', $c, $s, -$s, $c, $cx, $cy, -$cx, -$cy));
        }
    }

    function _endpage()
    {
        if ($this->angle != 0) {
            $this->angle = 0;
            $this->_out('Q');
        }
        parent::_endpage();
    }
}

class PDF extends PDF_Rotate
{
    function RotatedText($x, $y, $txt, $angle)
    {
        //Text rotated around its origin
        $this->Rotate($angle, $x, $y);
        $this->Text($x, $y, $txt);
        $this->Rotate(0);
    }

    function RotatedImage($file, $x, $y, $w, $h, $angle)
    {
        //Image rotated around its upper-left corner
        $this->Rotate($angle, $x, $y);
        $this->Image($file, $x, $y, $w, $h);
        $this->Rotate(0);
    }
}


class pdfCausas extends PDF
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($datentidad->idestructura);
        $this->SetY(-15);
        $this->SetX(5);
        $this->SetFont('Arial', 'I', 10);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
    }
}

class ReportepdfCausas extends ZendExt_Model
{
    public $anchohoja = 279;

    public function Causaspdf()
    {
        parent::ZendExt_Model();

    }

    public function exportar($idreporte, $idestructura, $fini, $ffin)
    {
        $pdf = new pdfCausas('L', 'mm', 'letter');
        $pdf->AddPage();
        $modeloNegocio = new DatApaModel();
        $datos = $modeloNegocio->getReporte($idreporte, $idestructura, $fini, $ffin);

        $pdfNGeneral = $this->crearCuerpo($pdf, $datos);
        $pdfNGeneral->Output();
    }


    private function crearCuerpo($pdf, $datos)
    {
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->setX(86);
        $pdf->Cell(100, 8, utf8_decode('Resumen indicadores por reporte'), 0, 1, "C");
        $pdf->setX(2);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(50, 45, utf8_decode('Entidad'), 1, 0, "C");
        $longcausas = (($this->anchohoja - 50) / count($datos->indicadores)) - (4 / count($datos->indicadores));
        $x = $pdf->getX() + 3 +($longcausas/2);
        $y = $pdf->getY() + 45;


        $positionx = $longcausas ;
        foreach ($datos->indicadores as $i => $in) {
            $concat = ($pdf->GetStringWidth($in['denominacion']) > 30) ? '...' : '';
            $pdf->Cell($longcausas, 45, ' ', 1, 0, 'C');
            if ($i == 0) {
                $pdf->RotatedText($x, $y, utf8_decode(substr($in['denominacion'], 0, 20)) . $concat, 90);

            } else {
                $pdf->RotatedText($x + $positionx, $y, utf8_decode(substr($in['denominacion'], 0, 20)) . $concat, 90);
                $x = $x + $positionx ;
            }
        }

        $pdf->Ln();
        $pdf->SetFont('Arial', '', 9);
        foreach ($datos->data as $dat) {
            $pdf->setX(2);
            $concatentidad = ($pdf->GetStringWidth($dat['denom']) > 25) ? '...' : '';
            $pdf->Cell(50, 8, utf8_decode(substr($dat['denom'], 0, 30)) . $concatentidad, 1, 0, 'L');

            foreach ($datos->indicadores as $ind) {
                $time = explode(':', $dat[$ind['idindicador']]);
                $timefinal = $time[0] . ':' . $time[1];
                $pdf->Cell($longcausas, 8, $timefinal, 1, 0, "C");
            }
            $pdf->Ln();
        }
        return $pdf;
    }
}
