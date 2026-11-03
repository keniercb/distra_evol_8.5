<?php

/**
 * Class PlantillaMTSS
 */
class PlantillaCayo
{

    /**
     * @var
     */
    private $pdf;
    /**
     * @var Table
     */
    private $table;
    /**
     * @var
     */
    private $config;
    /**
     * @var array
     */
    private $datosGenerales;
    /**
     * @var
     */
    private $widthFormato;
    /**
     * @var
     */
    private $heightFormato;
    /**
     * @var
     */
    private $isFirst;
    /**
     * @var array
     */
    private $withArray;
    /**
     * @var array
     */
    private $alingsArray;
    /**
     * @var
     */
    private $proyecto;
    /**
     * @var
     */
    private $pageNum;
    /**
     * @var EstructuraModel
     */
    private $estructura;
    /**
     * @var DatEstructuraModel
     */
    private $datestructura;
    /**
     * @var complementos salariales
     */
    private $complementos;
    /**
     * @var identificadores de los complementos salariales
     */
    private $arrayIdComplementos;
    private $cantidadCargos;
    private $totalesSalario = array('base' => 0, 'subTotal' => 0, 'total' => 0);

    /**
     * @param $pdf
     * @param $config
     * @param $datos
     */
    public function __construct($pdf, $config, $datos)
    {
//Util::msg($config);
        $this->complementos = AuxComplemento::dameComplementos();
        foreach ($this->complementos as $index => $value) {
            $this->complementos[$index]['total'] = 0;
            $this->complementos[$index]['subTotal'] = 0;
        }
        $this->arrayIdComplementos = Util::getArrayByField($this->complementos, 'idconceptopercepciondescuento');
        $this->estructura = new EstructuraModel();
        $this->datestructura = new DatEstructuraModel();
        $this->pdf = $pdf;
        $this->pdf->SetX(0);
        $this->pdf->SetY(0);
        $this->table = new Table($this->pdf);
        $this->config = $config;
        $this->pageNum = $config['hoja'];
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
        $this->pdf->SetTopMargin(10);
        $this->pdf->SetLeftMargin(8);
    }

    /**
     * @return mixed
     */
    public function createAnexo()
    {

        foreach ($this->datosGenerales as $index => $value) {
            if (is_numeric($index)) {
                $this->hijos = $this->estructura->dameHijosEstructura(
                    $value['idfila'], false, 0, $this->config['idproyecto'], true,
                    array(7, 8, 9)
                );
                $cargosGenerales = $this->datestructura->dameCargosInEstructura(
                    $value['idfila'], $this->config['idproyecto'], false
                );
                $this->isFirst = true;
                $this->cantidadCargos = 1;
                if (count($cargosGenerales['general']) > 0) {
                    $this->cargos = $cargosGenerales['directos'];
                    $this->totalCargos = self::dameTotalesCargos($cargosGenerales['general']);
                    $this->config['tipo'] = $value['tipo'];
                    $this->config['plantilla'] = $value['codigo'];
                    $this->config['denominacion'] = $value['denominacion'];
                    $this->config['ueb'] = $value['denominacion'];
                    $this->config['organizacion'] = false;
                    $this->config['empresa'] = false;
                    if (!array_search($value['idtipo'], array(1, 2, 6, 8))) {
                        $ruta = $this->estructura->dameRutaEstructura(
                            array($value['idfila']), true, $this->config['idproyecto']
                        );
                        $interno = false;
                        if (!array_search($value['idtipo'], array(3, 4))) {
                            $interno = self::findIsDepartamento($ruta);
                        }
                        if (!$interno) {
                            $this->config['empresa'] = $this->findEntidadPadre($ruta, 1);
                            $this->config['organizacion'] = $this->findEntidadPadre($ruta, 2);
                        }
                    }
                    if ($this->isFirst) {
                        $this->pdf->AddPage('L');
                        $this->createHeaderResolucion();
                        $this->createProyectoInfo();
                        $this->isFirst = false;
                    } else {
                        $this->isEndPage(2, true);
                    }
                    $this->table->SetWidths($this->withArray);
                    $this->table->SetAligns($this->alingsArray);
                    $this->createInfoPlantilla();
                    $this->addContent(true, false, true);
                    $arr = array(
                        '', array('text' => 'Total ', 'align' => 'R'), '', '', '', '', '',
                        $this->totalesSalario['base']);
                    $this->completeSubTotalesValues('total', $arr);
                    $arr[] = $this->totalesSalario['total'];
                    $arr[] = $this->totalCargos['cantidad'];
                    $this->pdf->SetFont('Arial', 'B', 8);
                    $this->table->Row($arr, 1, 1);
                    $this->pdf->Ln(2);
                    $this->resetComplementos('', true);
                    $this->totalesSalario['base'] = 0;
                    $this->totalesSalario['total'] = 0;
                    $this->totalesSalario['subTotal'] = 0;
                }
            }
        }
        $this->pieFirmas();

        return $this->pageNum;
    }

    private function createProyectoInfo()
    {
        $y = $this->pdf->GetY();
        $widthPageNo = $this->pdf->w - ($this->pdf->lMargin + $this->pdf->rMargin);
        $wText = 20;
        $widthPageNo -= $wText;
        $this->pdf->SetY(5);
        $this->pdf->SetFont('Arial', 'B', 7.5);
        $this->pdf->Cell($widthPageNo, 5, '', 0, 0, 'R');
        $this->pdf->Cell($wText, 5, utf8_decode('" ORDINARIO "'), 0, 1, 'C');
        $this->pdf->Cell($widthPageNo, 5, '', 0, 0, 'R');
        $this->pdf->Cell($wText, 5, utf8_decode('. ' . $this->pageNum . ' .'), 0, 1, 'C');
        $this->pageNum += 1;
        $this->pdf->SetY($y);
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

    /**
     *
     */
    private function createHeaderResolucion()
    {
        if ($this->config['infoProyecto']) {
            $this->pdf->SetY(20);
        } else {
            $this->pdf->SetY(10);
        }
        $this->pdf->SetFont('Arial', 'B', 12);
        $this->pdf->Cell(0, 10, utf8_decode('MÓDULO DE LA PLANTILLA DE CARGOS'), 0, 1, 'C');
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->Ln(2);

        $resolucion = $this->config['reso'];
        $resolLenght = strlen($resolucion) * 2.2 + 10;

       if ($this->config['formato']=='A4'){$posResolucion = 77;}
      else if  ($this->config['formato']=='Legal'){$posResolucion = 135.4;}
     else if ($this->config['formato']=='Letter'){$posResolucion = 59.4;}

        $this->pdf->Cell($this->pdf->w - $resolLenght - $posResolucion, 30, utf8_decode('Resolución: '), 0, 0, 'R');  // /* - 50*/
        $this->pdf->SetFont('Arial', 'I', 10);
        $this->pdf->Cell(0, 10, utf8_decode($resolucion), 0, 1, 'L');
        $this->pdf->Ln(2);
    }

    private function createInfoPlantilla()
    {
        $this->pdf->SetFont('Arial', 'B', 10);
        $widthInfo = array(72, 165, 13, 0);
        $sizePlantilla = array_sum($widthInfo);
        $sizePlantilla = $sizePlantilla - ($widthInfo[count($widthInfo) - 1]);
        if ($this->config['organizacion']) {
            if ($this->config['tipo'] != 3 || $this->config['tipo'] != 4) {
                self::infoPrimeraFila();
            }
            self::infoSegundaFila();
            self::infoTerceraFila();
        } else {
            $this->pdf->Cell(
                $sizePlantilla, 5, utf8_decode('Denominación: ' . $this->config['denominacion']), '0', 1, 'L'
            );
            $this->pdf->Cell($sizePlantilla, 5, ' ', '0', 0, 'L');
        }
        $this->pdf->Ln(5);
    }

    /**
     *
     */
    private function createHeaderTable()
    {
        $height = 32;
        $minWidthColumnPagos = 60;
        $maxWidthColumnCargos = 100 - ($this->config['formato'] == 'Letter' ? 14 : 0);
        $cantidadComplementos = count($this->complementos);
        $widthColumnPagos = 10 * $cantidadComplementos;
        $widthColumnPagos = $widthColumnPagos < $minWidthColumnPagos ? $minWidthColumnPagos : $widthColumnPagos;
        $widthAjusteComplementos = 2;
        if ($cantidadComplementos <= 6) {
            $widthAjusteComplementos = 12 / $cantidadComplementos;
        } else {
            $maxWidthColumnCargos -= ($cantidadComplementos - 6) * 10;
        }
        $this->pdf->SetFont('Arial', 'B', 10);
        $widthHeaderTable = array(10, $maxWidthColumnCargos, 15, 10, 10, 15, 10, 15);
        $this->pdf->Cell($widthHeaderTable[0], $height, 'No.', 1, 0, 'C');
        $this->pdf->Cell($widthHeaderTable[1], $height, 'Cargo', 1, 0, 'C');
        $this->addVerticalColumn($height, '  Norma Jurídica    que Aprueba el    Cargo', 3);
        $this->addVerticalColumn($height, 'Categoría Ocupacional', 2);
        $this->addVerticalColumn($height, '  Nivel de   Preparación', 2);
        $this->addVerticalColumn($height, '      Clasificación           (Directo e   Indirecto)', 3);
        $this->addVerticalColumn($height, 'Grupo Escala', 2, 2);
        $this->addVerticalColumn($height, 'Salario Escala', 3, 3);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $haveComplementos = count($this->complementos) > 0;
        if ($haveComplementos) {
            $textoPago = 'Pagos Adicionales Asociados al Puesto de Trabajo';
            $alturaPagos = $cantidadComplementos > 8 ? 10 : 5;
            $this->pdf->MultiCell(
                $widthColumnPagos, $alturaPagos, utf8_decode($textoPago), 1, 'C'
            );
            $y += 10;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            foreach ($this->complementos as $value) {
                $abreviatura = $value['abreviatura'];
                $widthHeaderTable[] = $widthAjusteComplementos * 5;
                $this->addVerticalColumn(
                    $height - 10, utf8_decode(strtoupper($abreviatura)), $widthAjusteComplementos,
                    $widthAjusteComplementos
                );
            }
        }
        $widthHeaderTable[] = 15; // Tamaño Salario
        $widthHeaderTable[] = 20; // Tamaño Cantidad
        $y = $this->pdf->GetY();
        $x = $this->pdf->GetX();
        $this->pdf->SetY($y - ($haveComplementos ? 10 : 0));
        $this->pdf->SetX($x);
        $this->addVerticalColumn($height, '  Salario Total del    Cargo', 3, 1.5);
        $y = $this->pdf->GetY();
        $x = $this->pdf->GetX();
        $this->pdf->SetY($y - 10);
        $this->pdf->SetX($x);
        $this->pdf->Rect($x, $y, $widthHeaderTable[count($widthHeaderTable) - 1], $height);
        $yT = $this->pdf->GetY();
        $this->pdf->Text($x + 2, $y + 16, 'Cantidad');
        $this->pdf->Text($x + 7, $y + 20, 'de');
        $this->pdf->Text($x + 4, $y + 24, 'Plazas');
        $this->pdf->SetY($yT + $height + 2.5);
        $this->pdf->Ln();
        $align = ['C', 'L'];
        foreach ($widthHeaderTable as $index => $value) {
            if ($index > 1) {
                $align[] = 'C';
            }
        }
        $this->withArray = $widthHeaderTable;
        $this->alingsArray = $align;
        $this->table->SetWidths($widthHeaderTable);
        $this->table->SetAligns($align);
    }

    /**
     * @param bool $haveHeader
     * @param bool $esHijo
     * @param bool $inmediato
     */
    private function addContent($haveHeader = false, $esHijo = false, $inmediato = false)
    {
        if ($haveHeader) {
            $this->createHeaderTable();
        }
        $total = 0;
        $cargosInmediatos = $this->cargos;
        $arrayIdCargos = Util::getArrayByField($cargosInmediatos, 'id');
        $importesCargos = MetadatosServices::getInstance()->dameElementoSalarial(
            $arrayIdCargos, $this->arrayIdComplementos
        );
        if (count($cargosInmediatos) > 0) {
            if (!$esHijo && !$inmediato) {
                $arr = array('', utf8_decode($this->config['denominacion']));
                $arr = $this->completeBlankValues($arr);
                $arr[] = '';
                $arr[] = '';
                $arr[] = '';
                $arr[] = '';
                $arr[] = '';
                $arr[] = '';
                $arr[] = '';
                $estilo = 'B';
                $estilo .= (($this->verificaConcepto($this->config['idconcepto']))) ? 'U' : '';
                $this->pdf->SetFont('Arial', $estilo, 8);
                $this->table->Row($arr);
                $this->table->SetWidths($this->withArray);
            }
            foreach ($cargosInmediatos as $index => $cargo) {
                $denominacion = $cargo['denominacion'];
                $categoria = $this->getAbrevDenom('categocup', $cargo);
                $preparacion = $this->getAbrevDenom('preparacion', $cargo);
                $valor = ($cargo['idcategocup']) ? $categoria : '-';
                $cantidad = $cargo['cantidad'];
                $normajuridica = $cargo['normajuridica'];
                $escala = $cargo['abrev_escala'];
                $total += $cantidad;
                $grupoSalario = $cargo['grupocomplejidad'];
                $salario = floatval($cargo['salario']);
                $this->totalesSalario['base'] += $salario;
                $arr = array(
                    ($this->cantidadCargos++), utf8_decode($denominacion),utf8_decode($normajuridica), /*utf8_decode($escala),*/ utf8_decode($valor),
                    utf8_decode($preparacion), $cargo['indirecto'] ? 'I' : 'D', $grupoSalario, $salario);
                $conceptos = $importesCargos[$cargo['id']]['conceptos'];
                $this->completeImportesValues($conceptos, $arr, $salario);
                $arr[] = $salario;
                $arr[] = $cantidad;
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
                    $estilo = 'B';
                    $estilo .= (($this->verificaConcepto($hijo['idconcepto']))) ? 'U' : '';
                    $this->pdf->SetFont('Arial', $estilo, 8);
                    $this->addLimitRow($denominacion, (9 + count($this->complementos)));
                    $this->isEndPage(2, false, ($index < ($cantidadHijos)));
                    $this->hijos = $this->estructura->dameHijosEstructura(
                        $hijo['id'], false, 0, $this->config['idproyecto'], true,
                        array(7, 8, 9)
                    );
                    $this->addContent(false, true);
                    $totalSalariosCargos = self::dameTotalesSalariosCargos($cargosGenerales['general']);
                    $totalCargos = self::dameTotalesCargos($cargosGenerales['general']);
                    $arr = array('', array('text' => 'Subtotal ' . utf8_decode($hijo['denominacion']), 'align' => 'R'));
                    $arr[] = '';
                    $arr[] = '';
                    $arr[] = '';
                    $arr[] = '';
                    $arr[] = '';
                    $arr[] = $totalSalariosCargos;
                    $this->completeSubTotalesValues('subTotal', $arr);
                    $arr[] = $this->totalesSalario['subTotal'];
                    $arr [] = $totalCargos['cantidad'];
                    $this->pdf->SetFont('Arial', 'B' . ($esHijo ? 'I' : ''), 8);
                    if (!$esHijo) {
                        $this->table->Row($arr, 1, 1);
                    } else {
                        $this->table->Row($arr);
                    }
                    $this->resetComplementos('subTotal');
                    $this->totalesSalario['subTotal'] = 0;
                }
            }
        }
    }

    private function pieFirmas()
    {
        if ($this->config['aprueba'] && $this->config['elabora']) {
//            $this->table->stablishFooter(30);
            $this->pdf->SetFont('Arial', '', 10);
            $widthMitad = ($this->pdf->w - $this->pdf->rMargin - $this->pdf->x) / 2;
            $this->pdf->SetFont('Arial', 'B', 10);
            $this->pdf->Cell($widthMitad, 10, 'Aprueba', 0, 0, 'C');
            $this->pdf->Cell($widthMitad, 10, 'Elabora', 0, 1, 'C');
            $this->pdf->SetFont('Arial', 'B', 9);
            $line = '';
            $lenCargoAprueba = strlen($this->config['aprueba']['cargo']);
            $lenCargoElabora = strlen($this->config['elabora']['cargo']);
            $this->createLineFirma($lenCargoAprueba, $lenCargoElabora, $line);
            $this->pdf->Cell($widthMitad, 5, utf8_decode($line), 0, 0, 'C');
            $this->pdf->Cell($widthMitad, 5, utf8_decode($line), 0, 1, 'C');
            $this->pdf->Cell($widthMitad, 5, utf8_decode($this->config['aprueba']['persona']), 0, 0, 'C');
            $this->pdf->Cell($widthMitad, 5, utf8_decode($this->config['elabora']['persona']), 0, 1, 'C');
            $y = $this->pdf->GetY();
            $x = $this->pdf->GetX();
            $this->pdf->MultiCell($widthMitad, 5, utf8_decode($this->config['aprueba']['cargo']), 0, 'C');
            $this->pdf->SetY($y);
            $this->pdf->SetX($x + $widthMitad);
            $this->pdf->MultiCell($widthMitad, 5, utf8_decode($this->config['elabora']['cargo']), 0, 'C');
        }
    }

    /**
     * **************************  UTILES DEL REPORTE ***************************************
     */
    private function infoPrimeraFila($border = 0)
    {
        $y = $this->pdf->GetY();
        $widthInfo = array(78);
        $this->pdf->MultiCell(
            $widthInfo[0], 5, utf8_decode('UEB o Unidad Estructural de la Empresa: '), $border, 'L'
        );
        $this->backLine($y, $widthInfo[0]);
        $this->pdf->SetFont('Arial', 'I', 10);
         $this->pdf->MultiCell(0, 5, utf8_decode($this->config['ueb']), $border, 'L');
    }

    private function infoSegundaFila($addFecha = true, $border = 0)
    {
        $widthInfo = array(32, 210, 16, 0);
        $y = $this->pdf->GetY();
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->MultiCell(
            $widthInfo[0], 5, utf8_decode('Empresa u OSD: '), $border, 'L'
        );

        $this->backLine($y, $widthInfo[0]);
        $y = $this->pdf->GetY() ;
        $this->pdf->SetFont('Arial', 'I', 10);
        $this->pdf->MultiCell($widthInfo[1], 5, utf8_decode($this->config['empresa']), $border, 'L');
        if ($addFecha) {
            $this->backLine($y,  $widthInfo[1] - 28);  //$widthInfo[0] + $widthInfo[1]
            $this->pdf->SetFont('Arial', 'B', 10);
            $y = $this->pdf->GetY();
            $this->pdf->MultiCell($widthInfo[2], 5, utf8_decode('Año: '), $border, 'R');
            $this->backLine($y, $widthInfo[0] + $widthInfo[1] + $widthInfo[2]);
            $this->pdf->SetFont('Arial', 'I', 10);
          //  $year = getdate()['year'];
            $this->pdf->MultiCell($widthInfo[3], 5, utf8_decode($year), $border, 'L');
        }
    }

    private function infoTerceraFila($addFecha = true, $border = 0)
    {
        $widthInfo = array(65, 145, 48);
        $y = $this->pdf->GetY();
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->MultiCell( $widthInfo[0], 5, utf8_decode('Organización Superior de Dirección: '), $border, 'L');
        $this->backLine($y, $widthInfo[0]);
        $y = $this->pdf->GetY() ;
        $this->pdf->SetFont('Arial', 'I', 10);
        $this->pdf->MultiCell($widthInfo[1], 5, utf8_decode($this->config['organizacion']), $border, 'L');
        if ($addFecha) {
            $this->backLine($y, $widthInfo[1] +41);  //$widthInfo[0] + $widthInfo[1]
            $this->pdf->SetFont('Arial', 'B', 10);
            $fecha = getdate();
            $year = $fecha['year'];
           // $fecha = $fecha['mday'] . '/' . $fecha['mon'] . '/' . $year;
            $this->pdf->SetFont('Arial', 'B', 10);
            $y = $this->pdf->GetY() ;
            $this->pdf->MultiCell($widthInfo[2], 5, utf8_decode('Fecha de Puesta en Vigor: '), $border, 'R');
            $this->backLine($y, $widthInfo[0] + $widthInfo[1] + $widthInfo[2]);
            $this->pdf->SetFont('Arial', 'I', 10);
            $this->pdf->MultiCell($widthInfo[3], 5, utf8_decode($fecha), $border, 'L');
        }
    }

    /**
     * @param $campo
     * @param $object
     *
     * @return string
     */
    private function getAbrevDenom($campo, $object)
    {
        return ($object['id' . $campo]) ? !empty($object['abrev_' . $campo]) ? $object['abrev_' . $campo] : $object[$campo] : '-';
    }

    /**
     * @param $cargos
     *
     * @return array
     */
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

    public function dameTotalesSalariosCargos($cargos)
    {
        $totales = 0;
        foreach ($cargos as $cargo) {
            $totales += $cargo['salario'];
        }

        return $totales;
    }

    private function findIsDepartamento($arrayRuta)
    {
        $arrayRuta = array_reverse($arrayRuta);
        $tempEntidad = null;
        foreach ($arrayRuta as $index => $ruta) {
            if ($index > 0) {
                if ($ruta['idnomeav'] == 3 || $ruta['idnomeav'] == 4) {
                    return false;
                } else {
                    if ($ruta['idnomeav'] == 5) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    private function findEntidadPadre($arrayRuta, $nivel)
    {
        $arrayRuta = array_reverse($arrayRuta);
        $tempEntidad = null;
        foreach ($arrayRuta as $index => $ruta) {
            if ($ruta['idnomeav'] == 3 || $ruta['idnomeav'] == 4) {
                $tempEntidad = $arrayRuta[$index]['denominacion'];
                $nivel--;
                if ($nivel == 0) {
                    break;
                }
            }
        }

        return $tempEntidad;
    }

    private function backLine($y, $width)
    {
        $x = $this->pdf->GetX();
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + $width);
    }

    private function addVerticalColumn($w, $text, $salto, $space = 1)
    {
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->Rotate(90, $x + ($w / 2), $y + ($w / 2));
        $this->pdf->MultiCell($w, $space * 5, utf8_decode($text), 1, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + (5 * $salto));
        $this->pdf->Rotate(0);
    }

    private function addLimitRow($text, $content, $space = 1, $break = 1, $align = 'L')
    {
        $widthSpace = 0;
        $widthContent = 0;
        $rest = 0;
        foreach ($this->withArray as $index => $size) {
            if ($index < $space) {
                $widthSpace += $size;
            } else {
                if ($index <= $content) {
                    $widthContent += $size;
                } else {
                    $rest += $size;
                }
            }
        }
        $this->pdf->Cell($widthSpace, 5, '', 'LTB', 0, '');
        $this->pdf->Cell($widthContent, 5, utf8_decode($text), 'TBR', 0, $align);
        if ($rest) {
            $this->pdf->Cell($rest, 5, '', 0, 0, '');
        }
        if ($break) {
            $this->pdf->Ln();
        }
    }

    private function completeImportesValues($arrayImportes, &$arr, &$salario)
    {
        foreach ($this->complementos as $index => $complemento) {
            $valor = floatval($arrayImportes[$complemento['idconceptopercepciondescuento']]['importe']);
            $this->complementos[$index]['total'] += $valor;
            $this->complementos[$index]['subTotal'] += $valor;
            $arr[] = $valor;
            $salario += $valor;
        }
        $this->totalesSalario['subTotal'] += $salario;
        $this->totalesSalario['total'] += $salario;
    }

    private function completeSubTotalesValues($campo, &$arr)
    {
        foreach ($this->complementos as $complemento) {
            $arr[] = $complemento[$campo];
        }
    }

    private function resetComplementos($campo = 'total', $both = false)
    {
        foreach ($this->complementos as $index => $complemento) {
            if ($both) {
                $this->complementos[$index]['total'] = 0;
                $this->complementos[$index]['subTotal'] = 0;
            } else {
                $this->complementos[$index][$campo] = 0;
            }
        }
    }

    private function completeBlankValues($result, $value = '')
    {
        for ($i = 0; $i < count($this->complementos); $i++) {
            $result[] = $value;
        }

        return $result;
    }

    private function createLineFirma($lenAprueba, $lenElabora, &$line)
    {
        $width = $lenAprueba > $lenElabora ? $lenAprueba : $lenElabora;
        $width -= 20;
        for ($i = 0; $i < $width; $i++) {
            $line .= '_';
        }
    }

    private function verificaConcepto($tipo)
    {
        return $tipo == 1 || $tipo == 5;
    }

    /**
     * Funcion encargada de crear una nueva pagina con todos los elementos necesarios en la misma, dígase
     * fondo superior, numero de pagina y orientacion horizontal
     */
    private function newPage()
    {
        $this->pdf->AddPage('L');
        $this->createProyectoInfo();
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
            $this->pdf->Ln($this->proyecto ? 15 : 10);
            if (!$newPlantilla && $haveContent) {
                $this->createHeaderTable();
            }

            return true;
        }
    }
}