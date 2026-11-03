<?php

class Table extends TCPDF {

    private $pdf;
    private $widths;
    private $aligns;

    /**
     * Constructor de la clase
     *
     * @copyright Copyright (c) 2013 xetid.
     */
    function Table($pdf) {
        $this->pdf = $pdf;
    }

    function SetWidths($w) {
        //Set the array of column widths
        $this->widths = $w;
    }

    /**
     * Descripción del método: Para establecer el ancho de página.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @modify    : Ing. Yoandry Borges.
     * @modify    : Ing. Pedro Jiménez.
     *
     * @param $a alineación que va a tomar la página al ser dibujada según el formato
     *
     * @copyright Copyright (c) 2013 xetid.
     */
    function SetAligns($a) {
        //Set the array of column alignments
        $this->aligns = $a;
    }

    function Row($data, $paint = 0, $border = 0) {
        $nb = 0;
        $temp = 0;
        for ($i = 0; $i < count($data); $i++) {
            $text = (array_key_exists('text', $data[$i])) ? $data[$i][text] : $data[$i];
            $nb = max($nb, $this->NbLines($this->widths[$i] + 5, $text));
            if ($temp < $nb) {
                $temp = $nb;
            }
        }
        $h = 5 * $nb;
        //Issue a page break first if needed
        $this->CheckPageBreak($h);
        //Draw the cells of the row
        for ($i = 0; $i < count($data); $i++) {
            $text = (array_key_exists('text', $data[$i])) ? $data[$i]['text'] : $data[$i];
            $black = (array_key_exists('black', $data[$i])) ? 1 : 0;
            $border = (array_key_exists('border', $data[$i])) ? $data[$i]['border'] : $border;
            $a = (array_key_exists('align', $data[$i])) ? $data[$i]['align'] : null;
            $fill = (array_key_exists('fill', $data[$i])) ? $data[$i]['fill'] : $paint;
            $w = $this->widths[$i];
            $a = (!$a) ? $this->aligns[$i] : $a;
            //Save the current position
            $x = $this->pdf->GetX();
            $y = $this->pdf->GetY();
            //Draw the border
            $this->pdf->Rect($x, $y, $w, $h);
            //Print the text
            if ($black) {
                $this->pdf->SetFont('helvetica', 'B', 10);
            }
            $this->pdf->MultiCell($w, 5, $text, $border, $a, $fill);
            if ($black) {
                $this->pdf->SetFont('helvetica', '', 10);
            }
            //Put the position to the right of the cell
            $this->pdf->SetXY($x + $w, $y);
        }
        //Go to the next line
        $this->pdf->Ln($h);
    }

    /**
     * Descripción del método: Para establecer el ancho de página.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @modify    : Ing. Yoandry Borges.
     * @modify    : Ing. Pedro Jiménez.
     *
     * @param $h valida la cantidad de veces que debe ser picado el texto según su tamaño
     *
     * @copyright Copyright (c) 2013 xetid.
     */
    function CheckPageBreak($h) {
        //If the height h would cause an overflow, add a new page immediately
        if ($this->pdf->GetY() + $h > $this->pdf->PageBreakTrigger) {
            $this->pdf->AddPage($this->pdf->CurOrientation);
            $this->pdf->SetFont('helvetica', '', 8);
            $this->pdf->SetXY(280, 5);
            $this->pdf->MultiCell('', '', 'Pag. ' . $this->pdf->PageNo(), 0, 'J', 0, 3, '', '', true, 0, true);
            $this->pdf->SetFont('helvetica', '', 7);
            $this->pdf->Ln(10);
        }
    }

    /**
     * Descripción del método: Para establecer el ancho de página.
     *
     * @author    : Ing. Osvaldo M. Gonzalez.
     * @modify    : Ing. Yoandry Borges.
     * @modify    : Ing. Pedro Jiménez.
     *
     * @param $w   ancho de la página al ser dibujada según el formato.
     * @param $txt cantidad de líneas que presenta el texto.
     *
     * @return int.
     * @copyright Copyright (c) 2013 xetid.
     */
    function NbLines($w, $txt) {
        //Computes the number of lines a MultiCell of width w will take
        $cw = & $this->pdf->CurrentFont['cw'];
        if ($w == 0) {
            $w = $this->pdf->w - $this->pdf->rMargin - $this->pdf->x;
        }
        $wmax = ($w - 2 * $this->pdf->lMargin) * 1000 / $this->pdf->FontSize;
        $s = str_replace("\r", '', $txt);
        $nb = strlen($s);
        if ($nb > 0 and $s[$nb - 1] == "\n") {
            $nb--;
        }
        $sep = -1;
        $i = 0;
        $j = 0;
        $l = 0;
        $nl = 1;
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

    function CenterTableHorizontal() {
        $total = 0;
        foreach ($this->widths as $value) {
            $total += $value;
        }
        $withFormato = $this->pdf->fwPt;
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
        $this->pdf->SetX($valorComprobante - ($total / 2));
    }

    public function createHeaderTable() {
        $h = 1;
        $this->pdf->SetFont('helvetica', 'B', 10);
        $this->pdf->SetFillColor(200, 200, 200);
        $valores = array();
        $valores[] = 'Denominación del cargo';
        $valores[] = 'Cargo';
        $valores[] = 'EMC';
        $valores[] = 'CPP';
        $valores[] = 'GradoPP';
        $valores[] = 'Salario';
        $valores[] = 'No';
        $valores[] = 'Expediente';
        $valores[] = 'Grado Apellido y Nombres';
        $valores[] = 'Fec.Nomb';
        $valores[] = 'Orden';
        $valores[] = 'De quién';
        self::Row($valores);
    }

    public function SetY($y, $resetx = true, $rtloff = false) {
        $y = floatval($y);
        if ($resetx) {
            //reset x
            if (!$rtloff AND $this->rtl) {
                $this->x = $this->w - $this->rMargin;
            } else {
                $this->x = $this->lMargin;
            }
        }
        if ($y >= 0) {
            $this->y = $y;
        } else {
            $this->y = $this->h + $y;
        }
        if ($this->y < 0) {
            $this->y = 0;
        }
        if ($this->y > $this->h) {
            $this->y = $this->h;
        }
    }

}

