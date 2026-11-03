
<?php

class GenerarPdfMaqueta extends TCPDF {

    protected $pdf;
    protected $table;
    protected $withArray;
    protected $alignsArray;

    function __construct($parametros) {

        $this->idejercicio = $parametros->idejercicio;
        $this->ejercicioden = $parametros->ejercicioden;
        $this->entidades = $parametros->entidades;
        $this->idorganismo = $parametros->idorganismo;
        $this->organismoden = $parametros->organismoden;
        $this->idforma = $parametros->idforma;
        $this->idetapa = $parametros->idetapa;
        $this->aprobado = $parametros->aprobado;
        $this->elaborado = $parametros->elaborado;
        $this->observaciones = $parametros->observaciones;
        $this->indicadores = '';
        $this->pintadas = 1;
        $this->pintadas1 = 0;
        $this->pintarcontado = false;
        $this->estacontado = false;
        $this->pintadoscomosefinancia = array();
        $this->pintadosquienfinancia = array();
        $this->inversiones3 = "";
        $this->integrator = $parametros->integrador;
        $this->objetapa = new DatEtapa();
        $this->objinversion = new DatInversion();
        $this->objelemento = new DatElemento();

        $this->financistasGenerales = array();
        $this->cantidadFinancistasGenerales = 0;

        // Create new PDF document
        $this->pdf = new TCPDF('L', PDF_UNIT, 'A4', true, 'UTF-8', false);   //A4
        $this->table = new Table($this->pdf);

        // Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('SISPLAN');
        $this->pdf->SetTitle('Reporte Maqueta');
        $this->pdf->SetSubject('Ministerio de las Fuerzas Armadas Revolucionarias');
        $this->pdf->SetKeywords('Indicadores, Control, SISPLAN');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

        // set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $this->pdf->SetMargins(5, 5, 5);

        // set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export() {
        //print_r('entra');die;
        $this->pdf->AddPage();
        $this->createHeader();
        $this->pdf->Ln(5);
        $this->createHeaderTable();
        $this->addContenido();


        if ($this->pdf->GetY() > 180) {
            $this->pdf->setY(180);
            $this->piedePagina();
            $this->pdf->AddPage();
            $this->createHeader();
        } else {
            $this->pdf->setY(180);
            $this->piedePagina();
        }


        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);

        // Close and output PDF document
        ob_clean();
        $this->pdf->Output("Reporte Maqueta.pdf", 'I');
        return true;
    }

    public function createHeader() {
        // set JPEG quality
        $this->pdf->setJPEGQuality(75);
        $this->pdf->SetFont('Times', 'B', 12);
        $this->pdf->Cell(200, 5, 'Plan: ' . $this->ejercicioden, 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(200, 5, 'Ministerio de Economia y Planificacion', 0, 1, 'L', false, '', 1);
        $this->pdf->Ln(5);
        $this->pdf->Cell(200, 5, 'Reporte Resumen Inversiones ', 0, 1, 'L', false, '', 1);
        $this->pdf->Cell(50, 5, 'Observaciones:', 0, 1, 'L', false, '', 1);

        $organ = explode(",", $this->idorganismo);

        $organismos1 = array();
        foreach ($organ as $k => $valueorg) {
            $organism = self::cargarEntidades($valueorg);
            for ($index9 = 0; $index9 < count($organism); $index9++) {
                $organismos1[] = $organism[$index9]['identidad'];
            }
            $organismos1[] = $valueorg;
        }
        $this->entidades = implode(",", array_values($organismos1));

        //yanila
        // ---------- Todas las inversiones de todas las entidades y formas de propiedad o las seleccionadas --------------------------
        $this->inversiones = $this->objinversion->getInversionesDadoEntidadesYFormaPropiedad($this->idejercicio, $this->entidades, $this->idforma);
		
		$idinversiones = "";
        if(count($this->inversiones) > 0)
            foreach ($this->inversiones as $i=>$inv) {
                if ($i == 0) {
                    $idinversiones .= $inv['idinversion'];
                } else {
                    $idinversiones .=  ",". $inv['idinversion'];
                }
            }

        // ---------- Totales para cada financista de todas las inversiones en todas las formas de propiedad ----------
        $params['idejercicio'] = $this->idejercicio;
        $arregloMonedas = "'".USD."'";
        $this->financistasGenerales = $this->objinversion->TotalPlanEjercicioActualPorCadaFinancista($idinversiones, $params, $arregloMonedas);
// print_r($this->financistasGenerales);die('dede');
        //print_r($financistas);die;
        if(count($this->financistasGenerales) > 0) {
            $this->cantidadFinancistasGenerales = count($this->financistasGenerales);
        }
        // -------- Ancho del cuadro observaciones de acuerdo al ancho de todas las columnas de la tabla de informacion
        $anchoObservaiones = 50 + 15 + 15 + 25 + 15 + 15 + 25 + ($this->cantidadFinancistasGenerales * 25) + 15 + 15;
        $this->pdf->MultiCell($anchoObservaiones, 15, $this->observaciones, 1, 'L', 0, 3, '', '', true, 0, true);
    }

    private function createHeaderTable() {

        $this->pdf->ln(15);
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->Cell(50, 5, '', 0, 0, 'C', true, '', 1);
        $this->pdf->Cell(15, 5, '', 0, 0, 'C', true, '', 1);
        $this->pdf->Cell(15, 5, '', 0, 0, 'C', true, '', 1);

        $altura = 0;
        if($this->cantidadFinancistasGenerales > 0) {
            //-------- Calcular altura para los nombres de los financistas ----------------------
            foreach ($this->financistasGenerales as $f) {
                $alturaA = 0;
                $alturaA = $this->CalcularAltura($f['denominacion'], 25);
                if ($altura < $alturaA) {
                    $altura = $alturaA;
                }
            }
        }else
            $altura = 10;



        // -------- Ancho de FINANCIAMIENTO DE LAS IMPORTACIONES a partir de la columna Total como se financia --------
        $anchoFinanciamiento = 25 + 15 + 15 + 25 + ($this->cantidadFinancistasGenerales * 25) + 15 + 15;
        $this->pdf->Cell($anchoFinanciamiento, 5, 'FINANCIAMIENTO DE LAS IMPORTACIONES', 1, 1, 'C', true, '', 1);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->MultiCell(50, $altura, 'OACE/FORMA DE PROPIEDAD/COMPONENTES', 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
        $this->pdf->Cell(15, $altura, 'PLAN MP', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(15, $altura, 'PLAN MUSD', 1, 0, 'C', true, '', 1);
        $this->pdf->MultiCell(25, $altura, 'Total como se financia', 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
        $this->pdf->Cell(15, $altura, 'CONTADO', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(15, $altura, 'CREDITO', 1, 0, 'C', true, '', 1);
        $this->pdf->MultiCell(25, $altura, 'Total quien financia', 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);


        // ---------- Nombre de los quien financia para todas la inversiones en todas las formas de propiedad ---------
        if($this->cantidadFinancistasGenerales > 0){
            foreach ($this->financistasGenerales as $financista) {
                $this->pdf->MultiCell(25, $altura, $financista['denominacion'], 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
            }
        }
        $this->pdf->Cell(15, $altura, 'EROG LIQ', 1, 0, 'C', true, '', 1);
        $this->pdf->Cell(15, $altura, 'CTT EXT', 1, 1, 'C', true, '', 1);
    }

    private function addContenido() {

        $monedaentcup = $this->objinversion->listarMonedasEntidad(9900000103);
        $monedaentusd = $this->objinversion->listarMonedasEntidad(9900000046);

        foreach ($monedaentcup as $value345) {
            $monedaentcupp[] = $value345['idmonedaentidad'];
        }

        foreach ($monedaentusd as $value124) {
            $monedaentusdd[] = $value124['idmonedaentidad'];
        }

        $monedasentcup = implode(",", array_values($monedaentcupp));
        $monedasentusd = implode(",", array_values($monedaentusdd));

        if ($this->idforma) {
            $formaspropiedad = $this->objinversion->listarFormadadoId($this->idforma);
        } else {
            $formaspropiedad = $this->objinversion->listarForma();
        }
		
        $valormptotales = 0;
        $valorusdtotales = 0;
        $sumatoriatotalescsfinancia = 0;
        $sumatoriatotalesqfinancia = 0;
        $sumatoriatotaleserogacion = 0;
        $sumatoriatotalescontraexterna = 0;
        $valorcontadototales = 0;
        $valorcreditototales = 0;
        foreach ($formaspropiedad as $value) {
            $valormptotal = 0;
            $valorusdtotal = 0;

            $altura = $this->CalcularAltura($value['denominacion'], 50);

            if ($this->pdf->GetY() > 170) {
                self::createHeaderTable();
            }
            $this->pdf->SetFillColor(204, 255, 204);
            $this->pdf->SetFont('Times', 'B', 10);
            $this->pdf->MultiCell(50, $altura, $value['denominacion'], 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);

            //--------------- Inversiones dada la forma de propiedad --------
            $inversiones3 = $this->objinversion->getInversionesDadoFormaPropiedad($this->idejercicio, $this->entidades, $value['idformapropiedad']);

            $inversiones1 = "";
            for ($index3 = 0; $index3 < count($inversiones3); $index3++) {
                if ($index3 == (count($inversiones3) - 1)) {
                    $inversiones1 .= $inversiones3[$index3]['idinversion'];
                } else {
                    $inversiones1 .= $inversiones3[$index3]['idinversion'] . ",";
                }
            }

            if (count($inversiones3) == 0) {
                $inversiones2 = "0";
            } else {
                $inversiones2 = $inversiones1;
            }

            // ----------------------- Total MP y USD ---------------
            $params['idejercicio']= $this->idejercicio;
            $arregloMonedas = "'".CUP."'".","."'".USD."'";
            $totalPLanComponentesCUPyUSD = $this->objinversion->TotalPlanEjercicioActualComponentes($inversiones2, $params, $arregloMonedas);
            //echo '<pre>';print_r($totalPLanComponentesCUPyUSD);die;
            foreach ($totalPLanComponentesCUPyUSD as $comp) {
                if($comp['codigoiso']== 'CUP')
                {
                    $valormptotal += $comp['totalcomp'];
                    $valormptotales+= $comp['totalcomp'];
                }
                else
                {
                    $valorusdtotal += $comp['totalcomp'];
                    $valorusdtotales+= $comp['totalcomp'];
                }
            }

            $this->pdf->Cell(15, $altura, number_format($valormptotal, '3', '.', ','), 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(15, $altura, number_format($valorusdtotal, '3', '.', ','), 1, 0, 'R', true, '', 1);


            //------------------------ Como se financia ----------------
            $valorContado = $this->objinversion->TotalPlanEjercicioActualContado($inversiones2, $params, "'".USD."'");
            if(count($valorContado) > 0)
                $valorContado = $valorContado[0]['totalcontado'];
            else
                $valorContado = 0;

            $valorCredito = $this->objinversion->TotalPlanEjercicioActualCredito($inversiones2, $params, "'".USD."'");
            if(count($valorCredito) > 0)
                $valorCredito = $valorCredito[0]['totalacreedores'];
            else
                $valorCredito = 0;

            $valorcontadototales += $valorContado;
            $valorcreditototales += $valorCredito;
            $sumatoriatotalescsfinancia += $valorContado + $valorCredito;
            $this->pdf->Cell(25, $altura, number_format($valorContado + $valorCredito, '3', '.', ','), 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(15, $altura, number_format($valorContado, '3', '.', ','), 1, 0, 'R', true, '', 1);
            $this->pdf->Cell(15, $altura, number_format($valorCredito, '3', '.', ','), 1, 0, 'R', true, '', 1);

            //----------------------------Quien financia------------------------

            // ---- Total quien financia ------
            $totalquienfinancia = $this->objinversion->TotalPlanEjercicioActualQuienFinancia($inversiones2, $params, "'".USD."'");
            if(count($totalquienfinancia) > 0)
                $totalquienfinancia = $totalquienfinancia[0]['totalquienfinancia'];
            else
                $totalquienfinancia = 0;
            $sumatoriatotalesqfinancia += $totalquienfinancia;
            $this->pdf->Cell(25, $altura, number_format($totalquienfinancia, '3', '.', ','), 1, 0, 'R', true, '', 1);

            // ---- Total para cada financista ------
            $params['idejercicio'] = $this->idejercicio;
            $financistas = $this->objinversion->TotalPlanEjercicioActualPorCadaFinancista($inversiones2, $params, "'".USD."'");
            //----- Si existen financistas para esta form de propiedad se pintan los valores sino se ponen vacios
            if(count($financistas) > 0){
                foreach ($this->financistasGenerales as $i=> $fg) {
                    $encuentra = false;
                    $valorAcreedor = 0;
                    foreach ($financistas as $financista) {
                        if($fg['iddatosnomenclador'] == $financista['iddatosnomenclador'])
                        {
                            $valorAcreedor = $financista['totalacreedor'];
                            $encuentra = true;
                            break;
                        }else
                        {
                            $encuentra = false;
                        }
                    }
                    if($encuentra)
                        $this->pdf->MultiCell(25, $altura, $valorAcreedor, 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
                    else
                        $this->pdf->Cell(25, $altura, number_format(0, '3', '.', ','), 1, 0, 'L', true, '', 1);
                }
            }else{
                $auxCantidadFinancistas = $this->cantidadFinancistasGenerales;
                while($auxCantidadFinancistas!= 0){
                    $this->pdf->Cell(25, $altura, '', 1, 0, 'R', true, '', 1);
                    $auxCantidadFinancistas--;
                }
            }


            //--------------------- Erogacion ----------------------------------

            //$erogacionresult = $this->objinversion->getErogacionLiquido($monedasentcup, $inversiones2, $this->idejercicio);
            $this->indicadores = "'"."122"."'"; //122 y 123 id de los Ind. Erogacion y Contrat. externa
            $erogacionPlanActual = $this->objinversion->TotalPlanEjercicioActualOtrosIndicadores($inversiones2, $params, $this->indicadores);
            //echo '<pre>';print_r($erogacionContratacionPlanActual);die;

            if (count($erogacionPlanActual) != 0) {
                $this->pdf->Cell(15, $altura, number_format($erogacionPlanActual[0]['totalindicador'], '3', '.', ','), 1, 0, 'R', true, '', 1);
                $sumatoriatotaleserogacion += $erogacionPlanActual[0]['totalindicador'];
            } else {
                $this->pdf->Cell(15, $altura, number_format(0, '3', '.', ','), 1, 0, 'R', true, '', 1);
            }


            $this->indicadores = "'"."123"."'"; //122 y 123 id de los Ind. Erogacion y Contrat. externa
            $contratacionPlanActual = $this->objinversion->TotalPlanEjercicioActualOtrosIndicadores($inversiones2, $params, $this->indicadores);
            //echo '<pre>';print_r($erogacionContratacionPlanActual);die;

            if (count($contratacionPlanActual) != 0) {
                $this->pdf->Cell(15, $altura, number_format($contratacionPlanActual[0]['totalindicador'], '3', '.', ','), 1, 1, 'R', true, '', 1);
                $sumatoriatotalescontraexterna += $contratacionPlanActual[0]['totalindicador'];
            } else {
                $this->pdf->Cell(15, $altura, number_format(0, '3', '.', ','), 1, 1, 'R', true, '', 1);
            }



            // ----------------- valores totales por componentes ---------------------
            $this->pdf->SetFillColor(255, 255, 255);
            $this->pdf->SetFont('Times', 'N', 10);
            if($inversiones2 != "0"){
                $etapas = $this->idetapa;
                $componentesSeleccionados = $this->objinversion->ComponentesByIdEtapa($etapas);
              
				foreach ($componentesSeleccionados as $c) {
                    $valormp = 0;
                    $valorusd = 0;
                    foreach ($totalPLanComponentesCUPyUSD as $comp) {
                        if ($comp['codigoiso'] == 'CUP') {
                            if ($c['idnombreetapa']==$comp['idnombreetapa']){
                                $valormp = $comp['totalcomp'];
                                break;
                            }else
                                $valormp = 0;
                        } else {
                            if ($c['idnombreetapa']==$comp['idnombreetapa']){
                                $valorusd = $comp['totalcomp'];
                                break;
                            }else
                                $valorusd = 0;
                        }
                    }
                    //aqui se ponen los valores

                    $altura = $this->CalcularAltura($c['denominacion'], 50);
                    if ($this->pdf->GetY() > 170) {
                        self::createHeaderTable();
                    }
                    $this->pdf->MultiCell(50, $altura, $c['denominacion'], 'LTRB', 'T', true, 0, '', '', true, 0, false, true, $altura, 'T', true);
                    $this->pdf->Cell(15, $altura, number_format($valormp, '3', '.', ','), 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(15, $altura, number_format($valorusd, '3', '.', ','), 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(25, $altura, '', 1, 0, 'C', true, '', 1);
                    $this->pdf->Cell(15, $altura, '', 1, 0, 'C', true, '', 1);
                    $this->pdf->Cell(15, $altura, '', 1, 0, 'C', true, '', 1);
                    $this->pdf->Cell(25, $altura, '', 1, 0, 'C', true, '', 1);

                    $auxCantidadFinancistas = $this->cantidadFinancistasGenerales;
                    while($auxCantidadFinancistas!= 0){
                        $this->pdf->Cell(25, $altura, '', 1, 0, 'R', true, '', 1);
                        $auxCantidadFinancistas--;
                    }

                    $this->pdf->Cell(15, $altura, '', 1, 0, 'R', true, '', 1);
                    $this->pdf->Cell(15, $altura, '', 1, 1, 'R', true, '', 1);
                    if ($this->pdf->GetY() > 170) {
                        self::createHeaderTable();
                    }

                }
            }
        }

        //---------------------------------------------------TOTALES-----------------------------------------------------------------------------
        if ($this->pdf->GetY() > 170) {
            self::createHeaderTable();
        }
        $this->pdf->SetFillColor(204, 255, 204);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(50, 5, 'Total OACE', 1, 0, 'L', true, '', 1);
        $this->pdf->Cell(15, 5, number_format($valormptotales, '3', '.', ','), 1, 0, 'R', true, '', 1);
        $this->pdf->Cell(15, 5, number_format($valorusdtotales, '3', '.', ','), 1, 0, 'R', true, '', 1);
        $this->pdf->Cell(25, 5, number_format($sumatoriatotalescsfinancia , '3', '.', ','), 1, 0, 'R', true, '', 1);
        $this->pdf->Cell(15, 5, number_format($valorcontadototales, '3', '.', ','), 1, 0, 'R', true, '', 1);
        $this->pdf->Cell(15, 5, number_format($valorcreditototales, '3', '.', ','), 1, 0, 'R', true, '', 1);


        $this->pdf->Cell(25, 5, number_format($sumatoriatotalesqfinancia, '3', '.', ','), 1, 0, 'R', true, '', 1);
        if($this->cantidadFinancistasGenerales > 0)
            foreach ($this->financistasGenerales as $financista) {
                $this->pdf->Cell(25, 5, number_format($financista['totalacreedor'], '3', '.', ','), 1, 0, 'R', true, '', 1);
                //$this->pdf->MultiCell(25, 5, $financista['totalacreedor'], 'LTRB', 'T', true, 0, '', '', true, 0, false, true, 5, 'T', true);
            }

        $this->pdf->Cell(15, 5, number_format($sumatoriatotaleserogacion, '3', '.', ','), 1, 0, 'R', true, '', 1);
        $this->pdf->Cell(15, 5, number_format($sumatoriatotalescontraexterna, '3', '.', ','), 1, 1, 'R', true, '', 1);
    }

    public function PiedePagina() {
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(140, 5, 'Aprobado por: ' . $this->aprobado, 0, 0, 'L', true, '', 1);
        $this->pdf->Cell(140, 5, 'Elaborado por: ' . $this->elaborado, 0, 0, 'C', true, '', 1);
    }


    public function array_unique_callback(array $arr, callable $callback, $strict = false) {
        return array_filter(
                $arr, function ($item) use ($strict, $callback) {
                    static $haystack = array();
                    $needle = $callback($item);
                    if (in_array($needle, $haystack, $strict)) {
                        return false;
                    } else {
                        $haystack[] = $needle;
                        return true;
                    }
                }
        );
    }

    public function cargarEntidades($idorg) {
        $entidades = array();
        $dominios = $this->integrator->metadatos->DameHijosEstructura($idorg);
        if ($dominios[0] != "") {
            foreach ($dominios as $key => $k) {
                $entidades_hijas = array();
                $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                $entidades = array_merge($entidades_hijas, $entidades);
            }
        }
        return $entidades;
    }

    public function entidadesHijas($identidad, $text) {
        $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad);
        $entidades_hijas = array();
        $entidades_hijas[0]['identidad'] = $identidad;
        $entidades_hijas[0]['entidad'] = $text;
        foreach ($dominios as $key => $entidad_hija) {
            if ($entidad_hija->leaf == 1) {
                $entidades_hijas[$key + 1]['identidad'] = $entidad_hija->id;
                $entidades_hijas[$key + 1]['entidad'] = $entidad_hija->text;
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id, $entidad_hija->text));
            }
        }
        return $entidades_hijas;
    }

    public function CalcularAltura($texto, $ancho) {
        $cantidad_lineas = strlen($texto);
        $aux = $cantidad_lineas / ($ancho / 2);
        if (is_float($aux)) {
            $aux1 = explode(".", $aux);
        }
        $aux2 = $aux1[0] + 1;
        $altura = 5 * $aux2;
        return $altura;
    }

}
?>

