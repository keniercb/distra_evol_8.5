<?php
/**
 * Descripción de la clase: Generada por Doctrine Generate
 * @author Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version Release: @package_version@
 */
class Tableml extends fpdf
{
    private $_pdf;
    private $_widths;
    private $_aligns;

    /**
     * Constructor de la clase
     * @copyright Copyright (c) 2013 xetid.
     */
    function Tableml($pdf)
    {
        $this->_pdf = $pdf;
    }

    function SetWidths($w)
    {
        $this->_widths = $w;
    }

    function SetAligns($a)
    {
        $this->_aligns = $a;
    }

    function Row($data, $paint = 0, $border = 0, $tam = 10, $h = 0)
    {
        $nb = 0;
        $temp = 0;
        for ($i = 0; $i < count($data); $i++) {
            if (substr_count($data[$i], '/jpg;') >= 1) {
                $text = '';
            } else {
                $text = (array_key_exists('text', $data[$i])) ? $data[$i][text] : $data[$i];
            }
            $nb = max($nb, $this->NbLines($this->_widths[$i], $text));
            if ($temp < $nb) {
                $temp = $nb;
            }
        }
        $h = ($h > 0)?$h:6 * $nb;
        $this->CheckPageBreak($h);
        for ($i = 0; $i < count($data); $i++) {
            $text = (array_key_exists('text', $data[$i])) ? $data[$i]['text'] : $data[$i];
            $black = (array_key_exists('black', $data[$i])) ? 1 : 0;
            $border = (array_key_exists('border', $data[$i])) ? $data[$i]['border'] : $border;
            $a = (array_key_exists('align', $data[$i])) ? $data[$i]['align'] : NULL;
            $fill = (array_key_exists('fill', $data[$i])) ? $data[$i]['fill'] : $paint;
            $w = $this->_widths[$i];
            $a = (!$a) ? $this->_aligns[$i] : $a;
            $x = $this->_pdf->GetX();
            $y = $this->_pdf->GetY();
            $this->_pdf->Rect($x, $y, $w, $h);
            if ($black) {
                $this->_pdf->SetFont('Arial', 'B', $tam);
            } else {
                $this->_pdf->SetFont('Arial', '', $tam);
            }
            if (substr_count($text, '/jpg;') >= 1) {
                list($imagenBase64,) = explode(';', utf8_decode($text));
                list(, $extension) = explode('/', $imagenBase64);
                $this->_pdf->Image($text, $x, $y, 24, 24, $extension);

            } else {
                $this->_pdf->MultiCell($w, 6, $text, $border, $a, $fill);
            }
            if ($black) {
                $this->_pdf->SetFont('Arial', '', $tam);
            }
            $this->_pdf->SetXY($x + $w, $y);
        }
        $this->_pdf->Ln($h);
    }

    function CheckPageBreak($h)
    {
        if ($this->_pdf->GetY() + $h > $this->_pdf->PageBreakTrigger) {
            $this->_pdf->AddPage($this->_pdf->CurOrientation);
        }
    }

    function NbLines($w, $txt)
    {
        $cw =& $this->_pdf->CurrentFont['cw'];
        if ($w == 0) {
            $w = $this->_pdf->w - $this->_pdf->rMargin - $this->_pdf->x;
        }
        $wmax = ($w - 2 * $this->_pdf->cMargin) * 1000 / $this->_pdf->FontSize;
        $s = str_replace("\r", '', $txt);
        $nb = strlen($s);
        if ($nb > 0 and $s[$nb - 1] == "\n") {
            $nb--;
        }
        $sep = -1;
        $i = 0;
        $j = 0;
        $l = 0;
        $nl= 1;
        while ($i < $nb) {
            $c = $s[$i];
            if ($c == "\n") {
                $i++;
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
                continue;
            }
            if ($c == ' ') {
                $sep = $i;
            }
            $l += $cw[$c];
            if ($l > $wmax) {
                if ($sep == -1) {
                    if ($i == $j) {
                        $i++;
                    }
                } else {
                    $i = $sep + 1;
                }
                $sep = -1;
                $j = $i;
                $l = 0;
                $nl++;
            } else {
                $i++;
            }
        }
        return $nl;
    }

    function CenterTableHorizontal()
    {
        $total = 0;
        foreach ($this->_widths as $value) {
            $total += $value;
        }
        $withFormato = $this->_pdf->fwPt;
        switch ($withFormato) {
            case 841.89: //A3
                $valorComprobante = 565 / 2;
                break;
            case 595.28: //A4
                $valorComprobante = 150;
                break;
            case 612: //Letter & Legal
                $valorComprobante = 230 / 2;
                break;
        }
        $this->_pdf->SetX($valorComprobante - ($total / 2));
    }
    function stablishFooter($paddingBottom)
    {
        $maxPos = $this->_pdf->hPt / $this->_pdf->k - 20;
        $this->_pdf->SetY($maxPos - $paddingBottom);
    }
}