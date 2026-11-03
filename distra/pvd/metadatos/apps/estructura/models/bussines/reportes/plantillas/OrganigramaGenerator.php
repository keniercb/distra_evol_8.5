<?php

class OrganigramaGenerator
{
    private $pdf;
    private $datos;
    private $maxWidth;
    private $middle;
    private $xs;
    private $restNodes = array();
    private $addColumnRight;
    private $pageNum;
    private $config;
    /**Variables de configuración*/
    private $ajusteFontSize = 6;
    private $resizeBoxChild = 0;
    private $widthGeneral = 0;

    public function __construct($pdf, $config, $pageNum, $datos)
    {
        $this->addColumnRight = 0;
        $this->pdf = $pdf;
        $this->datos = $datos;
        $this->config = $config;
        $this->pageNum = $pageNum;
        $this->addColumnRight = 0;
        $this->restNodes['total'] = 0;
        $this->restNodes['painted'] = 0;
        $this->restNodes['have'] = false;
        $this->limitPageFormat();
        $this->maxWidth = ($this->pdf->wPt / $this->pdf->k);
        $this->middle = $this->maxWidth / 2;
        $this->pdf->SetFillColor(200, 200, 200);
        $this->xs = array();
        $this->widthGeneral = $this->datos['min'];
        if ($config['ajustar']) {
            $this->resizeBoxChild = 3;
            $this->fixGeneralWidth();
        }
    }

    private function fixGeneralWidth()
    {
        $widthPdf = $this->pdf->fwPt;
        $widthPdf -= ($this->pdf->rMargin) * 2;
        $total = $this->datos['total'];
        $fixGeneralWidht = $widthPdf / $total; //TOTAL GENERAL ENTRE LOS CUADROS
        $fixGeneralWidht -= ($total - 2); // MENOS ESPACIO ENTRE CUADROS
        if ($fixGeneralWidht < $this->widthGeneral) {
//        $this->ajusteFontSize-=1;
            $this->ajusteFontSize = round((6 * $fixGeneralWidht) / $this->widthGeneral);
        }
        $this->widthGeneral = $fixGeneralWidht;
//      Util::msg('GENERAL: '.$this->widthGeneral);
//      Util::msg('FIX: '.$fixGeneralWidht);
//      die;
    }

    private function limitPageFormat()
    {
        $widthPdf = $this->pdf->fwPt;
        switch ($widthPdf){
            case 595.28: //A4
                $this->pdf->SetRightMargin(30);
                $this->pdf->SetLeftMargin(30);
                break;
            case 612:
                //carta y legal
                $this->pdf->SetRightMargin(40);
                $this->pdf->SetLeftMargin(40);
                break;
        }
    }

    public function createOrganigrama($complete = false, $start = true)
    {
        $this->createHeaderOrganigrama($start, $complete);
        $this->pdf->SetFont('Arial', 'B', 7);
        $widthGeneral = $this->widthGeneral;
        $starts = $this->setRootNode($widthGeneral, $complete);
        $this->createTree(
             $complete, $widthGeneral, $this->datos['datos']['hijos'], $starts, count($this->datos['datos']['hijos'])
        );
        $this->addPageNo();
        if ($this->restNodes['have']) {
            $this->pdf->AddPage('L');
            $this->pageNum += 1;
            $this->addColumnRight = 0;
            $this->pdf->SetTopMargin(10);
            $this->setRestNodes();
        }

        return $this->pageNum;
    }

    private function addPageNo()
    {
        $this->pdf->SetFont('Arial', 'B', 10);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $maxPos = $this->pdf->hPt / $this->pdf->k - 21;
        $this->pdf->SetY($maxPos);
        $this->pdf->Cell(0, '', $this->pageNum, 0, 1, 'C');
        $this->pdf->SetX($x);
        $this->pdf->SetY($y);
        $this->pdf->SetFont('Arial', '', 8);
    }

    private function setRestNodes()
    {
        $this->createOrganigrama(true, false);
    }

    private function setRootNode($widthGeneral, $complete = false)
    {
        $text = $this->datos['datos']['denominacion'];
        $width = strlen($text) * 2.2;
        $start = $this->middle - ($width / 2);
        $this->createNode(
             $start, $width, $text, 1, 1, 5, !array_key_exists('hijos', $this->datos['datos']), 1, 0, 4, false
        );
        $hijos = $this->datos['datos']['hijos'];
        $countHijos = count($hijos);
        if ($complete) {
            $countHijos = $this->restNodes['total'];
        }

        return $this->createLinesNode($start + $width / 2, $widthGeneral, $hijos, 1, $countHijos - 1, $complete);
    }

    private function createTree(
        $complete, $widthGeneral, $hijos, $starts, $total = 0, $nivel = 2, $columnNode = 0, $leftPos = array()
    )
    {
        $y = $this->pdf->GetY();
        if ($nivel < $this->datos['nivel']) {
            $i = $this->restNodes['painted'];
            if ($this->restNodes['total'] > 0) {
                if ($i) {
                    $j = $i + $this->restNodes['total'];
                } else {
                    $j = $this->restNodes['total'];
                }
            } else {
                $j = count($hijos);
            }
            $posIndex = 0;
            $limitesAnteriore = array();
            foreach ($hijos as $index => $hijo) {
                if ($index >= $i && $index < $j) {
                    $this->pdf->SetY($y);
                    $st = $starts[$nivel - 1]['start'];
                    $this->pdf->SetFont('Arial', '', $this->ajusteFontSize);
                    if (array_key_exists($posIndex, $st)) {
                        $this->createNode(
                             $st[$posIndex] - $widthGeneral / 2, $widthGeneral, $hijo['denominacion']
                        );
                        if ($nivel < ($this->datos['nivel'] - 1)) {
                            $start = $this->createLinesNode(
                                          $st[$posIndex], $widthGeneral, $hijo['hijos'], $nivel,
                                          count($hijo['hijos']) - 1, $complete
                            );
                            $limitesAnteriore[$posIndex] = $this->createTree(
                                                                $complete, $widthGeneral, $hijo['hijos'], $start,
                                                                $total, $nivel + 1, $posIndex, $limitesAnteriore
                            );
                        } else {
                            $this->pdf->Ln(2);
                            $limitesAnteriore[$posIndex] = $this->createTree(
                                                                $complete, $widthGeneral, $hijo['hijos'], $starts,
                                                                $total, $nivel + 1, $posIndex, $limitesAnteriore
                            );
                        }
                    }
                    $posIndex++;
                }
            }
        } else {
            $this->pdf->SetY($y);
            $xLine = $starts[$nivel - 2]['start'][$columnNode] - ($widthGeneral / 2);
            $yLine = $this->pdf->GetY() + 2;
            foreach ($hijos as $index => $hijo) {
                if ($this->limitHeight(20)) {
                    $this->createHijosRestantes(
                         $total, $yLine, $widthGeneral, $leftPos, $columnNode, $hijos, $index,
                         $starts[$nivel - 2]['start']
                    );
                    break;
                }
                $this->pdf->Ln(2);
                $this->pdf->SetFont('Arial', '', $this->ajusteFontSize - 1);
                $this->pdf->SetTextColor(0, 0, 0);
                $this->createNode(($xLine + 5) - 2, $widthGeneral - $this->resizeBoxChild, $hijo['denominacion']);
                if ($this->pdf->GetX() > $this->addColumnRight) {
                    $this->addColumnRight = $this->pdf->GetX();
                }
            }
            $ySons = $this->pdf->GetY();
            if (count($hijos) > 0) {
                $widthLine = ($xLine + 5) - $xLine;
                $widthLine = $widthLine - 2;
                $this->pdf->SetX($xLine);
                $this->pdf->Cell(($widthLine / 2), ($yLine - $ySons), '', 1, 0, '', 1);
                $this->pdf->SetY($y);
            }

            return $ySons + 2;
        }
    }

    private function createHijosRestantes(
        $total, $yPadre, $widthGeneral, $limitesAnteriores, $posIndexPadre, $hijos, $startHijos, $xsLine
    )
    {
        if ($this->valueCompare($total, $posIndexPadre)) {
            $x = ($xsLine[$posIndexPadre] - $widthGeneral) - ($widthGeneral / 2) - 3;
            $this->createColumnLeftHijos($yPadre, $x, $widthGeneral, $posIndexPadre, $hijos, $startHijos, $xsLine);
        } else {
            if ($this->comparePosIndexPadre($total, $posIndexPadre)) {
                $x = ((($xsLine[$posIndexPadre] - $widthGeneral / 2)) + $widthGeneral);
                $x += $widthGeneral / 2 - ($widthGeneral / 4) + 2;
                $this->createColumnRightHijos($yPadre, $x, $widthGeneral, $posIndexPadre, $hijos, $startHijos, $xsLine);
            } else {
                $this->createLeftHijos(
                     $total, $yPadre, $widthGeneral, $limitesAnteriores, $posIndexPadre, $hijos, $startHijos, $xsLine
                );
            }
        }
    }

    private function createLeftHijos(
        $total, $yPadre, $widthGeneral, $limitesAnteriores, $posIndexPadre, $hijos, $startHijos, $xsLine, $iteracion = 0
    )
    {
        $maxY = 0;
        foreach ($limitesAnteriores as $limite) {
            if ($limite > $maxY) {
                $maxY = $limite;
            }
        }
        if ($posIndexPadre <= 0) {
            $iteracion++;
            $xPrimero = $xsLine[0];
            $xDiferencia = $xsLine[1] - $xsLine[0];
            $wMedioNodo = $widthGeneral / 2;
            $x = $xPrimero - (($xDiferencia + $wMedioNodo) * $iteracion);
            $x += $iteracion;
        } else {
            $x = ($xsLine[$posIndexPadre - 1] - $widthGeneral / 2);
        }
        $xLine = ($x);
        $this->pdf->SetY($maxY + 10);
        $this->createOrgForm(
             $total, $yPadre, $widthGeneral, $limitesAnteriores, $posIndexPadre, $hijos, $startHijos, $xsLine,
             $iteracion, $xLine, $x, $maxY
        );
    }

    private function createColumnRightHijos(
        $yPadre, $xPadre, $widthGeneral, $posIndexPadre, $hijos, $startHijos, $xsLine
    )
    {
        $this->pdf->SetY($yPadre);
        $this->pdf->SetX($xPadre);
        $this->pdf->SetX($xPadre - 100);
        foreach ($hijos as $index => $hijo) {
            if ($index >= $startHijos) {
                if (!$this->limitHeight(20)) {
                    $this->pdf->SetFont('Arial', '', 6);
                    $this->pdf->SetTextColor(0, 0, 0);
                    $this->createNode(($xPadre) - 2, $widthGeneral, $hijo['denominacion']);
                    $this->pdf->Ln(2);
                    if ($this->pdf->GetX() > $this->addColumnRight) {
                        $this->addColumnRight = $this->pdf->GetX();
                    }
                } else {
                    $this->createColumnRightHijos(
                         $yPadre, $xPadre + $widthGeneral + 2, $widthGeneral, $posIndexPadre, $hijos, $index, $xsLine
                    );
                    break;
                }
            }
        }
    }

    private function createColumnLeftHijos(
        $yPadre, $xPadre, $widthGeneral, $posIndexPadre, $hijos, $startHijos, $xsLine
    )
    {
        $this->pdf->SetY($yPadre + 10);
        $this->pdf->SetX($xPadre);
        $this->pdf->Cell($widthGeneral + 3, 2, '', 0, 0, '', 1);
        $this->pdf->SetY($yPadre + 15);
        foreach ($hijos as $index => $hijo) {
            if ($index >= $startHijos) {
                if (!$this->limitHeight(20)) {
                    $this->pdf->SetFont('Arial', '', 6);
                    $this->pdf->SetTextColor(0, 0, 0);
                    $this->createNode(($xPadre) - 2, $widthGeneral, $hijo['denominacion']);
                    $this->pdf->Ln(2);
                } else {
                    $this->createColumnRightHijos(
                         $yPadre, $xPadre + $widthGeneral, $widthGeneral, $posIndexPadre, $hijos, $index, $xsLine
                    );
                    break;
                }
            }
        }
    }

    private function createLinesNode($posMiddleParent, $widthGeneral, $hijos, $nivel, $total, $complete)
    {
        $widthGeneral += ($this->resizeBoxChild) ? 2 : 4;
        $xs = array();
        if (is_array($hijos)) {
            $xs = $this->lineCreate($posMiddleParent, $widthGeneral, $hijos, $nivel, $total, $complete, $xs);
        }
        if (count($xs[$nivel]['start']) == 1) {
            $xs[$nivel]['start'][0] = $posMiddleParent;
        }

        return $xs;
    }

    private function searchTotal($total, $widthGeneral)
    {
        if ($this->limitWidth($total * $widthGeneral)) {
            return self::searchTotal($total - 1, $widthGeneral);
        } else {
            return $total;
        }
    }

    private function createNode($start, $width, $text, $border = 1, $fill = 0, $h = 5, $isLine = true)
    {
        $h = ($this->resizeBoxChild) ? 3 : $h;
        $this->pdf->SetX($start);
        $this->pdf->MultiCell($width, $h, utf8_decode($text), $border, 'C', $fill);
        if (!$isLine) {
            $widthMiddle = $width / 2;
            $this->pdf->SetX($start);
            $this->pdf->Cell($widthMiddle, 5, '', 'R');
            $this->pdf->Cell($widthMiddle, 5, '', 'L');
            $this->pdf->Ln();
        }
    }

    private function limitHeight($height)
    {
        $maxPos = $this->pdf->hPt / $this->pdf->k - 20;
        if (($this->pdf->GetY() + $height) >= $maxPos) {
            return true;
        }
    }

    private function limitWidth($width)
    {
        if ((($this->pdf->GetX() + $width) >= $this->maxWidth) || ($this->addColumnRight + $width) >= $this->maxWidth
        ) {
            return true;
        }
    }

    private function createHeaderOrganigrama($inicial, $complete)
    {
        if (!$inicial) {
            $this->createTopPage();
        }
        $this->pdf->SetFont('Arial', 'B', 10);
        $title = 'Organigrama: ' . $this->datos['organo']['tipo'] . ' ' . $this->datos['organo']['denominacion'];
        $this->pdf->MultiCell(0, 5, utf8_decode($title), 0, 'C');
        if ($complete) {
            $this->pdf->SetFont('Arial', 'B', 7);
            $this->pdf->MultiCell(0, 5, utf8_decode(Util::fixTitle('(Continuación)')), 0, 'C');
        }
        $this->pdf->Ln(7);
        $this->pdf->SetFont('Arial', '', 10);
    }

    private function createTopPage()
    {
        $dir = $_SERVER['DOCUMENT_ROOT'] . '/metadatos/comun/recursos/imagenes/borde.jpg';
        $this->pdf->Image($dir, 0, 0, 0, 30, 'jpg', '');
    }

    /**
     * @param $total
     * @param $posIndexPadre
     *
     * @return bool
     */
    private function valueCompare($total, $posIndexPadre)
    {
        return ($posIndexPadre == 0) && ($total > 1 && $total < 6);
    }

    /**
     * @param $total
     * @param $posIndexPadre
     *
     * @return bool
     */
    private function comparePosIndexPadre($total, $posIndexPadre)
    {
        return (($posIndexPadre == ($total - 1)) && ($total < 6)) || ($posIndexPadre == 0) && ($total == 1);
    }

    /**
     * @param $posMiddleParent
     * @param $widthGeneral
     * @param $hijos
     * @param $nivel
     * @param $total
     * @param $complete
     * @param $xs
     *
     * @return mixed
     */
    private function lineCreate($posMiddleParent, $widthGeneral, $hijos, $nivel, $total, $complete, $xs)
    {
        if ($total == 1) {
            $xs[$nivel]['start'][] = $posMiddleParent - $widthGeneral / 2;
            $xs[$nivel]['start'][] = $posMiddleParent + $widthGeneral / 2;
            $this->pdf->SetX($posMiddleParent - $widthGeneral / 2);
            $this->pdf->Cell($widthGeneral, 5, '', 'LTR');
            $this->pdf->Ln();
            $this->restNodes['total'] = 0;
            $this->restNodes['have'] = false;

            return $xs;
        } else {
            if ($complete) {
                $this->restNodes['painted'] += $total + 1;
                $newTotal = (count($hijos) - $this->restNodes['painted']);
                $isPar = ($newTotal % 2) == 0 ? 1 : 2;
                $total = $newTotal - $isPar;
            }
            if ($this->limitWidth($total * $widthGeneral)) {
                $total = self::searchTotal($total, $widthGeneral);
                $this->restNodes['total'] = $total + 1;
                $this->restNodes['have'] = true;
            } else {
                $this->restNodes['total'] = 0;
                $this->restNodes['have'] = false;
            }
            $isPar = ($total % 2) == 0;
            $widthControl = ($isPar) ? $widthGeneral * $total / 2
                : $widthGeneral / 2 + $widthGeneral * ($total - 1) / 2;
            $this->pdf->SetX($posMiddleParent - $widthControl);
            $pos = 0;
            while ($pos < $total) {
                $xs[$nivel]['start'][$pos] = $this->pdf->GetX();
                $this->pdf->Cell($widthGeneral, 5, '', 'LTR');
                $pos++;
            }
            $xs[$nivel]['start'][$pos] = $this->pdf->GetX();
            $this->pdf->Ln();

            return $xs;
        }
    }

    /**
     * @param $total
     * @param $yPadre
     * @param $widthGeneral
     * @param $limitesAnteriores
     * @param $posIndexPadre
     * @param $hijos
     * @param $startHijos
     * @param $xsLine
     * @param $iteracion
     * @param $xLine
     * @param $x
     * @param $maxY
     */
    private function createOrgForm(
        $total, $yPadre, $widthGeneral, $limitesAnteriores, $posIndexPadre, $hijos, $startHijos, $xsLine, $iteracion,
        $xLine, $x, $maxY
    )
    {
        if (!$this->limitHeight(20)) {
            $this->pdf->SetX($xLine);
            $xLine = ($x + 5);
            $this->pdf->Cell($widthGeneral + 6, 2, '', 0, 0, '', 1);
            $this->pdf->SetX($xLine);
            $this->pdf->SetY($maxY + 12);
            foreach ($hijos as $index => $hijo) {
                if ($index >= $startHijos) {
                    if (!$this->limitHeight(20)) {
                        $this->pdf->Ln(2);
                        $this->pdf->SetFont('Arial', '', 6);
                        $this->pdf->SetTextColor(0, 0, 0);
                        $this->createNode(($xLine) - 2, $widthGeneral, $hijo['denominacion']);
                    } else {
                        $this->createLeftHijos(
                             $total, $yPadre, $widthGeneral, $limitesAnteriores, $posIndexPadre - 1, $hijos, $index,
                             $xsLine, $iteracion
                        );
                        break;
                    }
                }
            }
        }
    }
}