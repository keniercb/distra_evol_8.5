<?php

class PlantillaMTSS
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
    private $headerPrinted = false;
    public $aprueba;
    public $elabora;

    private $estructura;
    private $datestructura;

    public function PlantillaMTSS($pdf, $config, $datos)
    {
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
//            foreach ($datos['plantilla'] as $identificador) {
//                $elemento = $this->datestructura->damePadresEntidades($identificador, $config['idproyecto'], TRUE);
//                if (count($elemento) > 0) {
//                    $entidades = array_merge($entidades, $elemento);
//                } else {
//                    $elemento       = $this->estructura->dameDatosEstructura($identificador, $config['idproyecto']);
//                    $estructuras [] = $elemento[0];
//                }
//            }
        foreach ($datos['plantilla'] as $identificador) { 

            $elemento = $this->estructura->dameDatosEstructura($identificador, $config['idproyecto']);
            //print_r($elemento);die;
            $estructuras [] = $elemento[0];
        }
        $this->datosGenerales = $estructuras;
        $this->widthFormato = $pdf->fwPt;
        $this->heightFormato = $pdf->fhPt;
        $proyecto = $datos['proyecto'];
        $this->proyecto = $proyecto;
        $this->withArray = array(60, 10, 22, 22, 22, 22);
        $this->alingsArray = array('L', 'C', 'C', 'C', 'C', 'C');
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

    public function createAnexoOriginal()
    {
        $margen=30;
        foreach ($this->datosGenerales as $index => $value) {
            if (is_numeric($index)) {
                $this->hijos = $this->estructura->dameHijosEstructura(
                    $value['idfila'], FALSE, 0, $this->config['idproyecto'], TRUE,
                    array(7, 8, 9)
                );

                $cargosGenerales = $this->datestructura->dameCargosInEstructura(
                    array($value['idfila']), $this->config['idproyecto'], FALSE
                );

                if (count($cargosGenerales['general']) > 0 && count($this->datosGenerales)) {
                    $this->cargos = $cargosGenerales['directos'];

                    $this->totalCargos = self::dameTotalesCargos($cargosGenerales['general']);
                    $this->config['tipo'] = $value['tipo'];
                    $this->config['plantilla'] = $value['codigo'];
                    $this->config['denominacion'] = $value['denominacion'];
                    $this->isFirst = ($index == 0);
                    if ($this->isFirst) {
                        $this->pdf->AddPage('P');
                        $this->createProyectoInfo();
                    } else {
                        $this->isEndPage(6, TRUE);
                    }
                    $this->table->SetWidths($this->withArray);
                    $this->table->SetAligns($this->alingsArray);
                    $this->addContent(TRUE);
                    $this->pdf->SetX($margen);
                    $arr = array(
                        array('text' => 'Total ', 'align' => 'R'), '', '', $this->totalCargos['cantidad'], '', '');
                    $this->pdf->SetFont('Arial', 'B', 8);
                    $this->table->Row($arr, 1, 1);
                    $this->pdf->Ln(2);
                }
            }
        }

        return $this->pageNum;
    }

    public function createAnexo($aprueba, $elabora)
    {
        $this->aprueba = $aprueba;
        $this->elabora = $elabora;
        //$this->aprueba = is_array($aprueba) && isset($aprueba['nombre']) ? $aprueba['nombre'] : '';
        $margen=30;
        foreach ($this->datosGenerales as $index => $value) {
            if (is_numeric($index)) {
                $this->hijos = $this->estructura->dameHijosEstructuraCompleta(
                    $value['idfila'], FALSE, 0, $this->config['idproyecto'], TRUE
                );


                $cargosGenerales = $this->datestructura->dameCargosInEstructura(
                    array($value['idfila']), $this->config['idproyecto'], FALSE
                );

                if (count($cargosGenerales['general']) > 0 && count($this->datosGenerales)) {
                    $this->cargos = $cargosGenerales['directos'];

                    $this->totalCargos = self::dameTotalesCargos($cargosGenerales['general']);
                    $this->config['tipo'] = $value['tipo'];
                    $this->config['plantilla'] = $value['codigo'];
                    $this->config['denominacion'] = $value['denominacion'];
                    $this->isFirst = ($index == 0);
                    if ($this->isFirst) {
                        $this->pdf->AddPage('P');
                        $this->createProyectoInfo();
                        $this->createInfoPlantilla();
                    } else {
                        $this->isEndPage(6, TRUE);
                    }
                    $this->table->SetWidths($this->withArray);
                    $this->table->SetAligns($this->alingsArray);
                    $this->addContent(TRUE);
                    $this->pdf->SetX($margen);
                    /*$arr = array(
                        array('text' => 'Total ', 'align' => 'R'), '', '', $this->totalCargos['cantidad'], '', '');*/
                    $arr = array(
                        array('text' => 'Total ', 'align' => 'R', 'border' => 1),
                        array('text' => '', 'border' => 1),
                        array('text' => '', 'border' => 1),
                        array('text' => $this->totalCargos['cantidad'], 'border' => 1),
                        array('text' => '', 'border' => 1),
                        array('text' => '', 'border' => 1)
                    );

                    $this->pdf->SetFont('Arial', 'B', 8);
                    $this->table->Row($arr, 1, 1);
                    $this->pdf->Ln(2);
                }
            }
        }

        return $this->pageNum;
    }


    private function createInfoPlantilla($break = FALSE)
{
    // Validar que las claves existan para evitar errores
    $apruebaper = isset($this->aprueba['persona']) ? $this->aprueba['persona'] : '';
    $elaboraper = isset($this->elabora['persona']) ? $this->elabora['persona'] : '';
    $apruebacar = isset($this->aprueba['cargo']) ? $this->aprueba['cargo'] : '';
    $elaboracar = isset($this->elabora['cargo']) ? $this->elabora['cargo'] : '';

    if ($this->headerPrinted) {
        // Ya se imprimió el encabezado, no hacer nada
        return;
    }

    // Encabezado
    $this->pdf->SetFont('Arial', 'B', 12);
    $this->pdf->SetX(10);
    $this->pdf->Cell(0, 7, utf8_decode('Ministerio de Trabajo y Seguridad social'), 0, 1, 'C');

    $this->pdf->SetFont('Arial', '', 10);
    $this->pdf->Cell(0, 6, utf8_decode('Resolución No.29/2014 de fecha veintisiete de junio del dos mil catorce'), 0, 1, 'C');
    $this->pdf->SetFont('Arial', 'B', 12);
    $this->pdf->Cell(0, 7, utf8_decode('ANEXO No. 14'), 0, 1, 'C');
    $this->pdf->SetFont('Arial', '', 10);
    $this->pdf->Cell(0, 7, utf8_decode('Reporte plantillas de cargos'), 0, 1, 'C');
    $this->pdf->Ln(10);

    // Posición vertical inicial para las firmas
    $startY = $this->pdf->GetY();

    // Ancho y alto para cada bloque de firma
    $signatureWidth = 60;
    $lineHeight = 5;
    $lineThickness = 0.5; // Grosor de la línea
    $spaceBetweenTextAndLine = 10; // Espacio en mm entre el texto y la línea

    // Posición X para "Aprueba"
    $xAprueba = 30;
    // Posición X para "Elabora"
    $xElabora = $xAprueba + $signatureWidth + 40; // separación horizontal

    // --- "Aprueba" ---
    $this->pdf->SetXY($xAprueba, $startY);
    $this->pdf->SetFont('Arial', 'B', 10);
    $this->pdf->Cell($signatureWidth, $lineHeight, utf8_decode('Aprueba'), 0, 1, 'L');

    // Línea para firma
    $this->pdf->SetXY($xAprueba, $startY + $lineHeight + $spaceBetweenTextAndLine);
    $this->pdf->SetLineWidth($lineThickness);
    $this->pdf->Cell($signatureWidth, 0, '', 'B', 1, 'L');

    // Nombre persona que aprueba
    $this->pdf->SetXY($xAprueba, $startY + $lineHeight + $spaceBetweenTextAndLine + 2);
    $this->pdf->SetFont('Arial', '', 10);
    $this->pdf->Cell($signatureWidth, $lineHeight, utf8_decode($apruebaper), 0, 1, 'L');

    // Cargo persona que aprueba
    $this->pdf->SetXY($xAprueba, $startY + $lineHeight + $spaceBetweenTextAndLine + 2 + $lineHeight);
    $this->pdf->SetFont('Arial', 'B', 10);
    $this->pdf->Cell($signatureWidth, $lineHeight, utf8_decode($apruebacar), 0, 1, 'L');

    // --- "Elabora" ---
    $this->pdf->SetXY($xElabora, $startY);
    $this->pdf->SetFont('Arial', 'B', 10);
    $this->pdf->Cell($signatureWidth, $lineHeight, utf8_decode('Elabora'), 0, 1, 'L');

    // Línea para firma
    $this->pdf->SetXY($xElabora, $startY + $lineHeight + $spaceBetweenTextAndLine);
    $this->pdf->SetLineWidth($lineThickness);
    $this->pdf->Cell($signatureWidth, 0, '', 'B', 1, 'L');

    // Nombre persona que elabora
    $this->pdf->SetXY($xElabora, $startY + $lineHeight + $spaceBetweenTextAndLine + 2);
    $this->pdf->SetFont('Arial', '', 10);
    $this->pdf->Cell($signatureWidth, $lineHeight, utf8_decode($elaboraper), 0, 1, 'L');

    // Cargo persona que elabora
    $this->pdf->SetXY($xElabora, $startY + $lineHeight + $spaceBetweenTextAndLine + 2 + $lineHeight);
    $this->pdf->SetFont('Arial', 'B', 10);
    $this->pdf->Cell($signatureWidth, $lineHeight, utf8_decode($elaboracar), 0, 1, 'L');

    $this->pdf->Ln(10);

    // Guardamos la posición para el contenido siguiente
    $y = $this->pdf->GetY();

    // Tamaño para la plantilla
    $sizePlantilla = 60; // Puedes ajustar este valor si quieres

    if ($this->config['plantilla']) {
        $this->pdf->SetX(100);
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->Cell(30, 5, utf8_decode('Denominación: ' . $this->config['denominacion']), 0, 1, 'C');

        $this->pdf->SetX(80);
        $this->pdf->Cell($sizePlantilla, 5, utf8_decode('Plantilla: ' . $this->config['plantilla']), 0, 0, 'C');
    } else {
        $this->pdf->SetX(0);
        $this->pdf->Cell($sizePlantilla, 5, utf8_decode('Denominación: ' . $this->config['denominacion']), 0, 1, 'C');
        $this->pdf->Cell($sizePlantilla, 5, ' ', 0, 0, 'C');
    }

    if (!$this->isFirst && !$break && !($this->pdf->GetY() == 35)) {
        $this->pdf->Cell($this->withArray[count($this->withArray) - 1], '', '', 0, 1, 'C');
    }

    $this->pdf->SetY($y + 10);
    $this->headerPrinted = true;
}


    private function createHeaderTable()
    { 
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->SetX(30);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->Cell($this->withArray[0], 5, utf8_decode('Descripción'), 'TL', 1, 'C');
        $this->pdf->SetX($x);
        $this->pdf->Cell($this->withArray[0], 5, utf8_decode('Órganos / Cargo / Técnica'), 'BL', 0, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + $this->withArray[0] - 12);

        $this->pdf->SetFont('Arial', 'B', 10);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->Cell($this->withArray[5], 5, utf8_decode(''), 'TR', 1, 'C');
        $this->pdf->SetX($x);
        $this->pdf->Cell($this->withArray[5], 5, utf8_decode(''), 'BR', 0, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + $this->withArray[5]);

        if ($this->config['civiles'] && $this->config['militares']) {
            $x = $this->pdf->GetX();
            $y = $this->pdf->GetY();
            $this->pdf->Cell($this->withArray[1], 5, utf8_decode('Categoría ocupacional'), 'T', 1, 'C');
            $this->pdf->SetX($x);
            $this->pdf->Cell($this->withArray[1], 5, utf8_decode('Grado militar'), 'BLR', 0, 'C');
            $this->pdf->SetY($y);
            $this->pdf->SetX($x + $this->withArray[1]);
        } else {
            if ($this->config['militares']) {
                $this->pdf->Cell($this->withArray[1], 10, utf8_decode('Grado militar'), 1, 0, 'C');
            } else {
                $x = $this->pdf->GetX();
                $y = $this->pdf->GetY();
                $this->pdf->Cell($this->withArray[1] + 12, 5, utf8_decode('Categoría'), 'T', 1, 'C');
                $this->pdf->SetX($x);
                $this->pdf->Cell($this->withArray[1] + 12, 5, utf8_decode('Ocupacional'), 'B', 0, 'C');
                $this->pdf->SetY($y);
                $this->pdf->SetX($x + $this->withArray[2]);
            }
        }
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->Cell($this->withArray[2], 5, utf8_decode('Cantidad'), 'TLR', 1, 'C');
        $this->pdf->SetX($x);
        $this->pdf->Cell($this->withArray[2], 5, utf8_decode('de cargos'), 'BLR', 0, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + $this->withArray[2]);
        $x = $this->pdf->GetX();
        $this->pdf->Cell($this->withArray[3], 5, utf8_decode('Nivel de'), 'TLR', 0, 'C');
        $this->pdf->Cell($this->withArray[4], 5, utf8_decode('Grupo'), 'TLR', 1, 'C');
        $this->pdf->SetX(($x));
        $y = $this->pdf->GetY();
        $this->pdf->Cell($this->withArray[3], 5, utf8_decode('Preparación'), 'BLR', 0, 'C');
        $this->pdf->Cell($this->withArray[4], 5, utf8_decode('Escala'), 'BLR', 0, 'C');
        $this->pdf->SetFont('Arial', '', 10);
        $this->pdf->SetY($y + 5);
    }

    private
    function addContentOriginal($haveHeader = FALSE, $esHijo = FALSE)
    {
        if ($haveHeader) {
            $this->createInfoPlantilla();
            $this->createHeaderTable();
        }
        $total = 0;
        $totalReal = 0;

        //obtengo los hijos inmediatos y los pinto

        $cargosInmediatos = $this->cargos;

        if (count($cargosInmediatos) > 0) {
            //No es hijo, el primer nodo
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
                $categoria = !empty($cargo['abrev_categocup']) ? $cargo['abrev_categocup'] : '-';//($cargo['idcategocup']) ? !empty($cargo['abrev_categocup']) ? $cargo['abrev_categocup'] : $cargo['categocup'] : '-';
                $grado = ($cargo['idgrado']) ? !empty($cargo['abrev_grado']) ? $cargo['abrev_grado'] : $cargo['grado'] : '-';
                $valor = (!$cargo['idcategocup'] && $this->config['militares']) ? $grado : $categoria;
                $cantidad = $cargo['cantidad'];
                $cantidadReal = $cargo['cantidad_real'];
                $total += $cantidad;
                $totalReal += $cantidadReal;
                $preparacion = (!$cargo['idpreparacion']) ? '-' : $cargo['abrev_preparacion'] ? $cargo['abrev_preparacion'] : $cargo['preparacion'];
                $grupo_salario = $cargo['grupocomplejidad'];
                $arr = array(
                    utf8_decode($denominacion), utf8_decode($valor), $cantidad, utf8_decode($preparacion), $grupo_salario);
                $this->isEndPage(2, FALSE, ($index < (count($cargosInmediatos))));
                $this->pdf->SetFont('Arial', '', 8);
                $this->table->Row($arr);
            }


        }

        $cantidadHijos = count($this->hijos);
        //De las estructuras hijas
        if ($cantidadHijos > 0) {
            /* print_r('<pre/>');
             print_r($this->hijos);die;*/
            foreach ($this->hijos as $index => $hijo) {
                $denominacion = $hijo['denominacion'];
                $cargosGenerales = $this->datestructura->dameCargosInEstructura2(
                    $hijo['id'], $this->config['idproyecto'], FALSE
                );
                //Guardo sus cargos inmediatos
                $this->cargos = $cargosGenerales['directos'];
                if (count($cargosGenerales['general']) > 0) {
                    $arr = array(
                        utf8_decode($denominacion), '', '', '', '');
                    $this->isEndPage(2, FALSE, ($index < ($cantidadHijos)));
                    $estilo = 'B';
                    $this->pdf->SetFont('Arial', $estilo, 8);
                    $this->table->Row($arr);
                    $this->hijos = $this->estructura->dameHijosEstructura(
                        $hijo['id'], FALSE, 0, $this->config['idproyecto'], TRUE,
                        array(7, 8, 9)
                    );
                    $this->addContent(FALSE, TRUE);
                    $totalCargos = self::dameTotalesCargos($cargosGenerales['general']);
                    $arr = array(
                        array('text' => 'Subtotal ' . utf8_decode($hijo['denominacion']), 'align' => 'R'), '', '',
                        $totalCargos['cantidad'], '', '');
                    $this->pdf->SetFont('Arial', 'B' . ($esHijo ? 'I' : ''), 8);
                    if (!$esHijo) {
                        $this->table->Row($arr, 1, 'TL');
                    } else {
                        $this->table->Row($arr, 0, 'TL');
                    }
                }
            }
        }
    }

    private function addContentModificado($haveHeader = FALSE, $esHijo = FALSE)
    {
        if ($haveHeader) {
            $this->createInfoPlantilla();
            $this->createHeaderTable();
        }
        $total = 0;
        $totalReal = 0;

        //obtengo los hijos inmediatos y los pinto

        $cargosInmediatos = $this->cargos;
        
        if (count($cargosInmediatos) > 0) {
            //No es hijo, el primer nodo
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
                $categoria = !empty($cargo['abrev_categocup']) ? $cargo['abrev_categocup'] : '-';//($cargo['idcategocup']) ? !empty($cargo['abrev_categocup']) ? $cargo['abrev_categocup'] : $cargo['categocup'] : '-';
                $grado = ($cargo['idgrado']) ? !empty($cargo['abrev_grado']) ? $cargo['abrev_grado'] : $cargo['grado'] : '-';
                $valor = (!$cargo['idcategocup'] && $this->config['militares']) ? $grado : $categoria;
                $cantidad = $cargo['cantidad'];
                $cantidadReal = $cargo['cantidad_real'];
                $total += $cantidad;
                $totalReal += $cantidadReal;
                $preparacion = (!$cargo['idpreparacion']) ? '-' : $cargo['abrev_preparacion'] ? $cargo['abrev_preparacion'] : $cargo['preparacion'];
                $grupo_salario = $cargo['grupocomplejidad'];
                $arr = array(
                    utf8_decode($denominacion), utf8_decode($valor), $cantidad, utf8_decode($preparacion), $grupo_salario);
                $this->isEndPage(2, FALSE, ($index < (count($cargosInmediatos))));
                $this->pdf->SetFont('Arial', '', 8);
                $this->table->Row($arr);
            }


        }

        $cantidadHijos = count($this->hijos);
        //De las estructuras hijas
        if ($cantidadHijos > 0) {
            /* print_r('<pre/>');
             print_r($this->hijos);die;*/
            foreach ($this->hijos as $index => $hijo) {
                $denominacion = $hijo['denominacion'];
                $cargosGenerales = $this->datestructura->dameCargosInEstructura2(
                    $hijo['id'], $this->config['idproyecto'], FALSE
                );
                //Guardo sus cargos inmediatos
                $this->cargos = $cargosGenerales['directos'];
                if (count($cargosGenerales['general']) > 0) {
                    $arr = array(
                        utf8_decode($denominacion), '', '', '', '');
                    $this->isEndPage(2, FALSE, ($index < ($cantidadHijos)));
                    $estilo = 'B';
                    $this->pdf->SetFont('Arial', $estilo, 8);
                    $this->table->Row($arr);
                    $this->hijos = $this->estructura->dameHijosEstructura(
                        $hijo['id'], FALSE, 0, $this->config['idproyecto'], TRUE,
                        array(7, 8, 9)
                    );
                    $this->addContent(FALSE, TRUE);
                    $totalCargos = self::dameTotalesCargos($cargosGenerales['general']);
                    $arr = array(
                        array('text' => 'Subtotal ' . utf8_decode($hijo['denominacion']), 'align' => 'R'), '',
                        $totalCargos['cantidad'], '', '');
                    $this->pdf->SetFont('Arial', 'B' . ($esHijo ? 'I' : ''), 8);
                    if (!$esHijo) {
                        $this->table->Row($arr, 1, 1);
                    } else {
                        $this->table->Row($arr);
                    }
                }
            }
        }
    }

    private function addContent($haveHeader = FALSE, $esHijo = FALSE)
    {
        if ($haveHeader) {
            $this->createInfoPlantilla();
            $this->createHeaderTable();
        }
        $arrayCantidades[] = array();
        $total = 0;
        $totalReal = 0;

        $nodosHijos = $this->hijos;

        $nodoshijosorg = array();
        $arrayID = array();

        foreach ($nodosHijos as $index => $hijo) {
            if ($hijo['idconcepto'] != 7) {
                $arrayID[$hijo['id']] = $hijo['id'];
            }
        }

        foreach ($nodosHijos as $index => $hijo) {
            if ($hijo['idconcepto'] != 7) {
                $nodoshijosorg[$arrayID[$hijo['id']]][] = $hijo;
            } else {
                $nodoshijosorg[$arrayID[$hijo['_parent']]][] = $hijo;
            }
        }

        // print_r($nodoshijosorg);die;

        foreach ($nodoshijosorg as $ipPadre => $nodosHijos) {
            if(count($nodosHijos) > 1){

                // uksort($nodosHijos, function ($a, $b) {
                //     return 1;
                // })

                foreach ($nodosHijos as $index => $hijo) {
                    $margen = 30;
                    if ($hijo['idconcepto'] == 7) {
                        $principal = ($hijo['principal']) ? ' EP ' : '';
                        $jefebrigada = ($hijo['jefebrigada']) ? ' JB ' : '';
                        $principalOjefebrigada = $jefebrigada . $principal;
                        $denominacion = $hijo['denominacion'];
                        $categoria = !empty($hijo['abrev_categocup']) ? $hijo['abrev_categocup'] : '-';//($hijo['idcategocup']) ? !empty($hijo['abrev_categocup']) ? $hijo['abrev_categocup'] : $hijo['categocup'] : '-';
                        $grado = ($hijo['idgrado']) ? !empty($hijo['abrev_grado']) ? $hijo['abrev_grado'] : $hijo['grado'] : '-';
                        $valor = (!$hijo['idcategocup'] && $this->config['militares']) ? $grado : $categoria;
                        $cantidad = $hijo['cantidad'];
                        $cantidadReal = $hijo['cantidad_real'];
                        $total += $cantidad;
                        $totalReal += $cantidadReal;
                        $preparacion = (!$hijo['idpreparacion']) ? '-' : $hijo['abrev_preparacion'] ? $hijo['abrev_preparacion'] : $hijo['preparacion'];
                        $grupo_salario = $hijo['grupocomplejidad'];
                        $arr = array(
                            utf8_decode($denominacion), utf8_decode($principalOjefebrigada), utf8_decode($valor), $cantidad, utf8_decode($preparacion), $grupo_salario);
                        $this->isEndPage(3, FALSE, ($index < (count($nodosHijos))));
                        $this->pdf->SetX($margen);
                        $this->pdf->SetFont('Arial', '', 8);
                        $this->table->Row($arr);

                    } else {
                        $arr = array(
                            utf8_decode($hijo['denominacion']), '', '', '', '', '', '',);
                        $estilo = 'B';
                        $estilo .= (($hijo['idconcepto'] == 1 || $hijo['idconcepto'] == 5)) ? 'U' : '';
                        $this->isEndPage(3, FALSE, ($index < (count($nodosHijos))));
                        $this->pdf->SetX($margen);
                        $this->pdf->SetFont('Arial', $estilo, 8);
                        $this->table->Row($arr);
                    }

                }
            }


            if ($total > 0) {
                /*  $y=$this->pdf->GetY();
                  $this->pdf->SetFont('Arial', 'B' . ($esHijo ? 'I' : ''), 8);
                  //$w, $h, $txt, $border = 0, $align = 'J', $fill = 0
                  $this->pdf->MultiCell(104, 5, 'Subtotal ' . utf8_decode($nodosHijos[0]['denominacion']), 'TLB', 'C', 1);
                  $this->pdf->SetY($y);
                  $this->pdf->SetX(112);
                  //$w, $h = 0, $txt = '', $border = 0, $ln = 0, $align = '', $fill = 0, $link = ''
                  $this->pdf->Cell(22, 5, $total, 'TLBR',1, 'C', 1);
                  $this->pdf->SetY($y);
                  $this->pdf->SetX(112+22);
                  $this->pdf->Cell(44, 5, '', 'TLBR',1, 'C', 1);*/
                $this->pdf->SetX($margen);
                $arr = array(
                    array('text' => 'Subtotal ' /*. utf8_decode($nodosHijos[0]['denominacion'])*/, 'align' => 'R', 'border' => 1),
                    array('text' => '', 'border' => 1),
                    array('text' => '', 'border' => 1),
                    array('text' => $total, 'border' => 1),
                    array('text' => '', 'border' => 1),
                    array('text' => '', 'border' => 1)
                );
                $this->pdf->SetFont('Arial', 'B' . ($esHijo ? 'I' : ''), 8);
                $this->table->Row($arr, 1);
                $total = 0;
                $totalReal = 0;
            }


        }
        /*print_r('<pre/>');
        print_r($nodoshijosorg);die;*/

        //obtengo los hijos inmediatos y los pinto
        /*$cargosInmediatos = $this->cargos;

        if (count($cargosInmediatos) > 0) {
            //No es hijo, el primer nodo
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
                       $categoria = ($cargo['idcategocup']) ? !empty($cargo['abrev_categocup']) ? $cargo['abrev_categocup'] : $cargo['categocup'] : '-';
                       $grado = ($cargo['idgrado']) ? !empty($cargo['abrev_grado']) ? $cargo['abrev_grado'] : $cargo['grado'] : '-';
                       $valor = (!$cargo['idcategocup'] && $this->config['militares']) ? $grado : $categoria;
                       $cantidad = $cargo['cantidad'];
                       $cantidadReal = $cargo['cantidad_real'];
                       $total += $cantidad;
                       $totalReal += $cantidadReal;
                       $preparacion = (!$cargo['idpreparacion']) ? '-' : $cargo['abrev_preparacion'] ? $cargo['abrev_preparacion'] : $cargo['preparacion'];
                       $grupo_salario = $cargo['grupocomplejidad'];
                       $arr = array(
                           utf8_decode($denominacion), utf8_decode($valor), $cantidad, utf8_decode($preparacion), $grupo_salario);
                       $this->isEndPage(2, FALSE, ($index < (count($cargosInmediatos))));
                       $this->pdf->SetFont('Arial', '', 8);
                       $this->table->Row($arr);
                   }




        }*/

        //$cantidadHijos = count($this->hijos);
        //De las estructuras hijas
        /*if ($cantidadHijos > 0) {

            foreach ($this->hijos as $index => $hijo) {
                $denominacion = $hijo['denominacion'];
                $cargosGenerales = $this->datestructura->dameCargosInEstructura2(
                    $hijo['id'], $this->config['idproyecto'], FALSE
                );
                //Guardo sus cargos inmediatos
                $this->cargos = $cargosGenerales['directos'];
                if (count($cargosGenerales['general']) > 0) {
                    $arr = array(
                        utf8_decode($denominacion), '', '', '', '');
                    $this->isEndPage(2, FALSE, ($index < ($cantidadHijos)));
                    $estilo = 'B';
                    $this->pdf->SetFont('Arial', $estilo, 8);
                    $this->table->Row($arr);
                    $this->hijos = $this->estructura->dameHijosEstructura(
                        $hijo['id'], FALSE, 0, $this->config['idproyecto'], TRUE,
                        array(7, 8, 9)
                    );
                    $this->addContent(FALSE, TRUE);
                    $totalCargos = self::dameTotalesCargos($cargosGenerales['general']);
                    $arr = array(
                        array('text' => 'Subtotal ' . utf8_decode($hijo['denominacion']), 'align' => 'R'), '',
                        $totalCargos['cantidad'], '', '');
                    $this->pdf->SetFont('Arial', 'B' . ($esHijo ? 'I' : ''), 8);
                    if (!$esHijo) {
                        $this->table->Row($arr, 1, 1);
                    } else {
                        $this->table->Row($arr);
                    }
                }
            }
        }*/
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
    private
    function isEndPage($countToTest, $newPlantilla = FALSE, $haveContent = TRUE)
    {
        $maxPos = $this->pdf->hPt / $this->pdf->k - 20;
        if (($this->pdf->GetY() + ($countToTest * 10)) >= $maxPos) {
            $this->newPage();
            $this->pdf->Ln($this->proyecto ? 15 : 10);
            if (!$newPlantilla && $haveContent) {
                $this->createInfoPlantilla(TRUE);
                $this->createHeaderTable();
            }

            return TRUE;

        }
    }

    /**
     * Funcion encargada de crear una nueva pagina con todos los elementos necesarios en la misma, dígase
     * fondo superior, numero de pagina y orientacion horizontal
     */
    private
    function newPage()
    {
        $this->pdf->AddPage('P');
        $this->createProyectoInfo();
        $this->pageNum += 1;
    }

    private
    function createProyectoInfo()
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