<?php

class PlantillaGAE
{
    private $pdf;
    private $table;
    private $config;
    private $datosGenerales;
    private $widthFormato;
    private $heightFormato;
    private $isFirst;
    private $withArray;
    private $alingsArray;
    private $proyecto;
    private $pageNum;
    private $estructura;
    private $datestructura;

    public function __construct($pdf, $config, $datos)
    {
        $this->estructura = new EstructuraModel();
        $this->datestructura = new DatEstructuraModel();
        $this->pdf = $pdf;
        $this->pdf->SetX(0);
        $this->pdf->SetY(0);
        $this->table = new Table($this->pdf);
        $this->config = $config;
        $this->pageNum = $this->config['hoja'] ? $this->config['hoja'] : 1;
        $entidades = array();
        $estructuras = array();
        foreach ($datos['plantilla'] as $identificador) {
            $elemento = $this->datestructura->damePadresEntidades($identificador, $config['idproyecto'], true);
            if (count($elemento) > 0) {
                $entidades = array_merge($entidades, $elemento);
            } else {
                $elemento = $this->estructura->dameDatosEstructura($identificador, $config['idproyecto']);
                $estructuras [] = $elemento[0];
            }
        }
        $this->datosGenerales = array_merge($entidades, $estructuras);
        $this->widthFormato = $pdf->fwPt;
        $this->heightFormato = $pdf->fhPt;
        $proyecto = $datos['proyecto'];
        $this->proyecto = $proyecto;
        $this->withArray = array(95, 12, 20, 20, 17, 17, 17);
        $this->alingsArray = array('L', 'C', 'C', 'C', 'C', 'C', 'C');
        $this->pdf->SetTopMargin(10);
        $this->pdf->SetLeftMargin(8);
    }

    public function dameTotalesCargos($cargos)
    {
        $totales = array(
            'cantidad' => 0, 'ocupados' => 0,);
        foreach ($cargos as $cargo) {
            $totales['cantidad'] += $cargo['cantidad'];
            $totales['ocupados'] += $cargo['cantidad_real'];
        }

        return $totales;
    }

    public function createAnexo()
    {
        foreach ($this->datosGenerales as $index => $value) {
            if (is_numeric($index)) {
                $this->hijos = $this->estructura->dameHijosEstructura(
                                                $value['idfila'], false, 0, 0, true, array(7, 8, 9)
                );
                $cargosGenerales = $this->datestructura->dameCargosInEstructura(
                                                       $value['idfila'], $this->config['idproyecto'], false
                );
                if (count($cargosGenerales['general']) > 0) {
                    $this->cargos = $cargosGenerales['directos'];
                    $this->totalCargos = self::dameTotalesCargos($cargosGenerales['general']);
                    $this->config['tipo'] = $value['tipo'];
                    $this->config['plantilla'] = $value['codigo'];
                    $this->config['denominacion'] = $value['denominacion'];
                    $this->config['idconcepto'] = $value['idconcepto'];
                    $this->config['provincia'] = $value['dpa']['Provincia'];
                    $this->config['municipio'] = $value['dpa']['Municipio'];
                    $this->isFirst = ($index == 0);
                    if ($this->isFirst) {
                        $this->pdf->AddPage('P');
                        $this->createHeaderResolucion();
                        $this->createProyectoInfo();
                        $this->addPageNo();
                    } else {
                        $this->isEndPage(6, true);
                    }
                    $this->table->SetWidths($this->withArray);
                    $this->table->SetAligns($this->alingsArray);
                    $this->addContent(true);
                    $arr = array(
                        array('text' => utf8_decode('Total'), 'align' => 'R'), '', '', '',
                        $this->totalCargos['ocupados'], $this->totalCargos['cantidad'], $this->totalCargos['cantidad']);
                    $this->pdf->SetFont('Arial', 'B', 8);
                    $this->table->Row($arr, 1, 1);
                    $this->pdf->Ln(2);
                }
            }
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
        $this->pageNum++;
        $this->pdf->SetX($x);
        $this->pdf->SetY($y);
        $this->pdf->SetFont('Arial', '', 8);
    }

    private function createHeaderResolucion()
    {
        if ($this->config['infoProyecto']) {
            $this->pdf->SetY(20);
        } else {
            $this->pdf->SetY(10);
        }
        $this->pdf->SetFont('Arial', 'BI', 13);
        $this->pdf->Cell(0, 10, utf8_decode('ANEXO 2'), 0, 1, 'C');
        if ($this->config['idresolucion'] && $this->config['header']) {
            $this->pdf->Cell(0, 10, utf8_decode($this->config['resolucion']), 0, 1, 'C');
        }
        if ($this->config['aprueba'] && $this->config['elabora']) {
            $this->pdf->SetFont('Arial', '', 10);
            $this->pdf->Ln(10);
            $widthMitad = ($this->pdf->w - $this->pdf->rMargin - $this->pdf->x) / 2;
            $this->pdf->Cell($widthMitad, 10, utf8_decode($this->config['aprueba']), 0, 0, 'C');
            $this->pdf->Cell($widthMitad, 10, utf8_decode($this->config['elabora']), 0, 1, 'C');
            $this->pdf->SetFont('Arial', 'B', 8);
            $this->pdf->Cell($widthMitad, 10, 'Aprueba', 0, 0, 'C');
            $this->pdf->Cell($widthMitad, 10, 'Elabora', 0, 1, 'C');
        }
        $this->pdf->Ln(5);
    }

    private function createInfoPlantilla()
    {
        $this->pdf->SetFont('Arial', 'B', 8);
        $y = $this->pdf->GetY();
        $sizePlantilla = array_sum($this->withArray);
        $sizePlantilla = $sizePlantilla - ($this->withArray[count($this->withArray) - 1]);
        $this->pdf->Cell($sizePlantilla, 5, 'MODELO P-2: PLANTILLA DE CARGOS', '0', 1, 'L');
        $this->pdf->Cell(
                  $sizePlantilla, 5, utf8_decode(Util::fixTitle($this->config['tipo'])) . ': ' .
                                utf8_decode($this->config['denominacion']), '0', 1, 'L'
        );
        $this->pdf->Cell($sizePlantilla, 5, 'Tipo de Plantilla: Total', '0', 1, 'L');
        $this->pdf->Cell(50, 5, 'Provincia: ' . utf8_decode($this->config['provincia']), '0', 0, 'L');
        $this->pdf->Cell(50, 5, 'Municipio: ' . utf8_decode($this->config['municipio']), '0', 1, 'L');
        $y += 12;
        $this->pdf->SetY($y + 10);
    }

    private function createHeaderTable()
    {
        $this->pdf->SetFont('Arial', 'B', 8);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->Cell($this->withArray[0], 10, utf8_decode('Cargos'), 1, 1, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + $this->withArray[0]);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->Cell($this->withArray[1], 5, utf8_decode('Grupo'), 'TLR', 1, 'C');
        $this->pdf->SetX($x);
        $this->pdf->Cell($this->withArray[1], 5, utf8_decode('Escala'), 'BLR', 0, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + $this->withArray[1]);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->Cell($this->withArray[2], 5, utf8_decode('Categoría'), 'TLR', 1, 'C');
        $this->pdf->SetX($x);
        $this->pdf->Cell($this->withArray[2], 5, utf8_decode('Ocupacional'), 'BLR', 0, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + $this->withArray[2]);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->Cell($this->withArray[3], 5, utf8_decode('Nivel de'), 'TLR', 1, 'C');
        $this->pdf->SetX($x);
        $this->pdf->Cell($this->withArray[3], 5, utf8_decode('Preparación'), 'BLR', 0, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + $this->withArray[2]);
        $this->pdf->Cell($this->withArray[4], 10, utf8_decode('Cubierta'), 1, 0, 'C');
        $this->pdf->Cell($this->withArray[5], 10, utf8_decode('Propuesta'), 1, 0, 'C');
        $this->pdf->Cell($this->withArray[6], 10, utf8_decode('Aprobada'), 1, 1, 'C');
        $this->pdf->SetFont('Arial', '', 8);
        $this->pdf->SetY($y + 10);
    }

    /**
     * @param $campo
     * @param $object
     *
     * @return string
     */
    private function getAbrevDenom($campo, $object)
    {
        return ($object['id' . $campo]) ? !empty($object['abrev_' . $campo]) ? $object['abrev_' .
        $campo] : $object[$campo] : '-';
    }

    private function addContent($haveHeader = false, $esHijo = false)
    {
        if ($haveHeader) {
            $this->createInfoPlantilla();
            $this->createHeaderTable();
        }
        $total = 0;
        $totalReal = 0;
        $cargosInmediatos = $this->cargos;
        if (count($cargosInmediatos) > 0) {
            if (!$esHijo) {
                $arr = array(
                    utf8_decode($this->config['denominacion']), '', '', '', '', '', '',);
                $estilo = 'B';
                $estilo .= (($this->config['idconcepto'] == 1 || $this->config['idconcepto'] == 5)) ? 'U' : '';
                $this->pdf->SetFont('Arial', $estilo, 8);
                $this->table->Row($arr);
            }
            foreach ($cargosInmediatos as $index => $cargo) {
                $denominacion = $cargo['denominacion'];
                $categoria = $this->getAbrevDenom('categocup', $cargo);
                $preparacion = $this->getAbrevDenom('preparacion', $cargo);
                $grado = $this->getAbrevDenom('grado', $cargo);
                $valor = (!$cargo['idcategocup'] && $this->config['militares']) ? $grado : $categoria;
                $cantidad = $cargo['cantidad'];
                $cantidadReal = $cargo['cantidad_real'];
                $total += $cantidad;
                $totalReal += $cantidadReal;
                $grupoSalario = $cargo['grupocomplejidad'];
                $arr = array(
                    utf8_decode($denominacion), $grupoSalario, utf8_decode($valor), utf8_decode($preparacion),
                    $cantidadReal, $cantidad, $cantidad);
                $this->isEndPage(2, false, ($index < (count($cargosInmediatos))));
                $this->pdf->SetFont('Arial', '', 8);
                $this->table->Row($arr);
            }
        }
        $cantidadHijos = count($this->hijos);
        if ($cantidadHijos > 0) {
            foreach ($this->hijos as $index => $hijo) {
                $denominacion = $hijo['denominacion'];
                $cargosGenerales = $this->datestructura->dameCargosInEstructura(
                                                       $hijo['id'], $this->config['idproyecto'], false
                );
                $this->cargos = $cargosGenerales['directos'];
                if (count($cargosGenerales['general']) > 0) {
                    $arr = array(
                        utf8_decode($denominacion), '', '', '', '', '', '',);
                    $this->isEndPage(2, false, ($index < ($cantidadHijos)));
                    $estilo = 'B';
                    $estilo .= (($hijo['idconcepto'] == 1 || $hijo['idconcepto'] == 5)) ? 'U' : '';
                    $this->pdf->SetFont('Arial', $estilo, 8);
                    $this->table->Row($arr);
                    $this->hijos = $this->estructura->dameHijosEstructura(
                                                    $hijo['id'], false, 0, $this->config['idproyecto'], true,
                                                    array(7, 8, 9)
                    );
                    $this->addContent(false, true);
                    $totalCargos = self::dameTotalesCargos($cargosGenerales['general']);
                    $arr = array(
                        array('text' => 'Subtotal ' . utf8_decode($hijo['denominacion']), 'align' => 'R'), '', '', '',
                        $totalCargos['ocupados'], $totalCargos['cantidad'], $totalCargos['cantidad']);
                    if (!$esHijo) {
                        $this->pdf->SetFont('Arial', 'B', 8);
                        $this->table->Row($arr, 1, 1);
                    }
                }
            }
        }
    }

    /**
     * Funcion encargada de comprobar si queda espacio disponible para mostrar el contenido, sino, salto de linea
     *
     * @param      $countToTest
     * @param bool $newPlantilla
     * @param bool $haveContent
     *
     * @return bool
     */
    private function isEndPage($countToTest, $newPlantilla = false, $haveContent = true)
    {
        $maxPos = $this->pdf->hPt / $this->pdf->k - 20;
        if (($this->pdf->GetY() + ($countToTest * 10)) >= $maxPos) {
            $this->newPage();
            $this->pdf->Ln(10);
            if (!$newPlantilla && $haveContent) {
                $this->createHeaderTable();
            }

            return true;
        }
    }

    /**
     * Funcion encargada de crear una nueva pagina con todos los elementos necesarios en la misma, dígase
     * fondo superior, numero de pagina y orientacion horizontal
     */
    private function newPage()
    {
        $this->pdf->AddPage('P');
        $this->createProyectoInfo();
        $this->addPageNo();
    }

    private function createProyectoInfo()
    {
        $dir = $_SERVER['DOCUMENT_ROOT'] . '/metadatos/comun/recursos/imagenes/borde.jpg';
        $this->pdf->Image($dir, 0, 0, 0, 30, 'jpg', '');
        $datos = $this->proyecto;
        if ($datos && $this->config['infoProyecto']) {
            $this->pdf->SetFont('Arial', 'B', 8);
            $y = $this->pdf->GetY();
            $this->pdf->SetY(10);
            $this->pdf->Cell(0, 5, 'PROYECTO', 0, 1, 'L');
            $this->pdf->SetFont('Arial', '', 8);
            $this->pdf->MultiCell(60, 5, utf8_decode(Util::fixTitle($datos)), 0, 1, 'L');
            $this->pdf->SetY($y);
        }
    }
}