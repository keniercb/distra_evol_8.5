<?php

class PDFNomina extends fpdf
{
    public $datospiepagina;
    public $longitudhoja;
    public $firmapagina;

    function fnSetAnchoHoja($longitudhoja)
    {
        $this->longitudhoja = $longitudhoja;
    }

    function fnGetAnchoHoja()
    {
        return $this->longitudhoja;
    }

    function fnSetDatosPiePagina($datospiepagina)
    {
        $this->datospiepagina = $datospiepagina;
    }

    function fnGetDatosPiePagina()
    {
        return $this->datospiepagina;
    }

    function fnSetFirmaPagina($firmapagina)
    {
        $this->firmapagina = $firmapagina;
    }

    function fnGetFirmaPagina()
    {
        return $this->firmapagina;
    }

    function Footer()
    {
        $objReportepdfModel = new ReportepdfModel();
        //$arrayposicionescolumnas = $objReportepdfModel->fnAjustarTextosEjeX($anchoHoja, 2);

        $altoHoja = $this->GetY();
        $anchoHoja = $this->fnGetAnchoHoja();
        $datospiepagina = $this->fnGetDatosPiePagina();

        //if ($this->firmapagina == 1) {
            $this->SetFont('Arial', '', 8);
            //Primera fila
            $this->Ln(190 - $altoHoja);

            $contcolumnas = 0;
            foreach ($datospiepagina as $firma) {
                $saltolinea = ($contcolumnas % 2 == 0) ? 0 : 1;
                $this->Cell($anchoHoja / 2 - 2, 10, utf8_decode($firma['piefirma'] . ': ' . $firma['nombre'] . ' ______________'), 0, $saltolinea, "L");
                $contcolumnas++;
            }
        //}
    }
}

class ReportepdfModel extends ZendExt_Model
{
    public $identidad = null;

    public $tamannosubtotales = 7;
    public $longitudhoja = 280;

    public function ReportepdfModel()
    {
        parent::ZendExt_Model();

    }

    public function CrearReportePDF($identidad, $tipovisualizacion, $datos, $estado)
    {

        $this->identidad = $identidad;
        $objNomina = new DatNomina();
        $objConfigEstModelNomina = new ConfigEstructurarModelosNomina();
        $objConfigPersonaCodigoContable = new ConfigPersonaCodigoContable();
        $datosnomina = $objNomina->obtenerObj($datos[0]['idnomina']);
        $datelaborarpago = Doctrine::getTable('DatElaborarPagos')->find($datosnomina->idelaborarpago);
        $nomtipopago = Doctrine::getTable('NomTipoPago')->find($datelaborarpago->idtipopago);
        $arrtiponomina = ConfigModeloNomina::obtenerConfigModelosNominaporTipoPago($datelaborarpago->idtipopago);
        $objdatosperiodo = array();
        $clasificacionpago = $nomtipopago->clasificacionpago;
        $objdatosperiodo['clasificacionpago'] = $clasificacionpago;
        $objdatosperiodo['fechainicioperiodo'] = explode('/', $datelaborarpago->fechainicioperiodo);
        $objdatosperiodo['fechafinperiodo'] = explode('/', $datelaborarpago->fechafinperiodo);
        $objdatosperiodo['fechapago'] = explode('/', $datelaborarpago->fechapago);
        $objdatosperiodo['mespago'] = $this->fnDenominacionMeses($objdatosperiodo['fechapago'][1]);
        $ioc = ZendExt_IoC::getInstance();
        $objdatosperiodo['datosentidad'] = $ioc->metadatos->DameEstructura($identidad);

        $objdatosperiodo['tiponomina'] = $arrtiponomina[0]['tiponomina'];
        $acumulavacaciones = $arrtiponomina[0]['acumulavacaciones'];

        // Año del periodo
        list(, , $annoperiodo) = explode('/', $datelaborarpago->fechainicioperiodo);
        if ($estado == 0) {
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();

            //Obteniendo los tipos de pago que tienen consecutivo de nomina
            $sql = "select idtipopago from mod_nomina.nom_tipopago where consecutivonomina = 1;";
            $arrconsecutivos = $conn->fetchAll($sql);
            $consecutivos = '';
            foreach ($arrconsecutivos as $c) {
                $consecutivos .= $c['idtipopago'] . ',';
            }
            $consecutivos = trim($consecutivos, ',');
            if (!empty($consecutivos)) {
                //Definiendo el numero de la nomina
                $sqlconsecutivos = "select count(distinct dep.idelaborarpagos) as cantidad
                from mod_nomina.dat_elaborarpagos dep
                inner join mod_nomina.dat_nomina dn on (dn.idelaborarpago = dep.idelaborarpagos and dn.aprobada <> 0)
                where dep.identidad = ?
                and dep.idelaborarpagos <> ?
                and date_part('year', dep.fechainicioperiodo::timestamp) = '" . $annoperiodo . "' 
                and dep.idtipopago in (" . $consecutivos . ");";
                $cantnumerosconsecutivosnominas = $conn->fetchOne($sqlconsecutivos, array($identidad, $datosnomina->idelaborarpago));
            } else
                $cantnumerosconsecutivosnominas = 0;

            $objdatosperiodo['numeronomina'] = ($cantnumerosconsecutivosnominas + 1) . "/" . $annoperiodo;
        } else {
            //Obteniendo el numero consecutivo de la nomina en dat_consecutivosnominaporpagos
            $objDatConsecutivosNominaPorPagos = DatConsecutivosNominaPorPagos::obtenerDatConsecutivosNominaPorIdElaborarPagos($datosnomina->idelaborarpago);
            $objdatosperiodo['numeronomina'] = (!empty($objDatConsecutivosNominaPorPagos)) ? $objDatConsecutivosNominaPorPagos->consecutivo . "/" . $annoperiodo : "_1/" . $annoperiodo;
        }


        //Obteniendo el array de codigos contables por personas
        $arrcodigoscontables = $objConfigPersonaCodigoContable->obtenerConfigDadoIdEntidad($identidad);
        $arrcodigospersonas = array();
        foreach ($arrcodigoscontables as $codigopersona) {
            $arrcodigospersonas[$codigopersona['idpersona']] = $codigopersona['cdgocontable'];
        }

        //Cantidad de columnas visibles
        $arrcolumna = unserialize($datos[0]['campos']);
        $arridestructuramodelnom = array();
        foreach ($arrcolumna as $c => $col) {
            if ($c < count($arrcolumna) - 1) {
                if (substr($col['indice'], 1, strlen($col['indice']) - 1)) {
                    $arridestructuramodelnom[] = substr($col['indice'], 1, strlen($col['indice']) - 1);
                }

            }
        }
        $arr = $objConfigEstModelNomina->obtenerDatosEstNominaxIdEstModeloNomina($arridestructuramodelnom);
        $cantidadcolumnas = 0;
        $arrcampos = array();
        $tiporporte = ($estado == 1) ? 'sc_4_06' : 'sc_4_01';
        foreach ($arr as $a) {
            if ($a[$tiporporte] == 1) {
                $arrcampos[] = $a;
                $cantidadcolumnas++;
            }
        }
        //Definiendo la longitudes de las celdas de datos de la persona y datos salariales
        $ArrayAncho = $this->fnDefinirLongitudCampos($arrcampos, $this->longitudhoja, $acumulavacaciones);

        //Formato de la hoja
        $pdf = new PDFNomina('L', 'mm', 'Letter'); //216(ancho) X 279(alto)

        //Guardando el arreglo de valores que se mostrarán en el footer
        $datospiefirma = $this->getPieFirmaDocumentoXIdEntidad($identidad);
        $arrdatosfirmas = array();
        foreach ($datospiefirma as $pfirma) {
            $pnombre = trim($pfirma['nombre']);
            $snombre = trim($pfirma['snombre']);
            $papell = trim($pfirma['papel']);
            $sapell = trim($pfirma['sapel']);
            $nombrecompleto = (empty($pfirma['snombre'])) ? $pnombre . ' ' . $papell . ' ' . $sapell :
                $pnombre . ' ' . $snombre . ' ' . $papell . ' ' . $sapell;
            $arrdatosfirmas[$pfirma['orden']]['idpersona'] = $pfirma['idpersona'];
            $arrdatosfirmas[$pfirma['orden']]['piefirma'] = $pfirma['denominacion'];
            $arrdatosfirmas[$pfirma['orden']]['nombre'] = $nombrecompleto;
        }
        $pdf->fnSetAnchoHoja($this->longitudhoja);
        $pdf->fnSetDatosPiePagina($arrdatosfirmas);
        $pdf->fnSetFirmaPagina(0);


        //Nomina General
        $pdf->SetLeftMargin(2);
        $pdf->SetTopMargin(2);
        $pdf->AddPage();

        $cantidadpersonas = $this->obtenerCantidadPersonas($datos);

        $this->fnPintarEncabezado($pdf, $objdatosperiodo, $estado, $cantidadpersonas);
        $this->crearCuerpo($pdf, $tipovisualizacion, $datos, $arrcampos, $arrcodigospersonas, $ArrayAncho, 0, $objdatosperiodo, $datosnomina->idelaborarpago, $this->longitudhoja, $estado, $acumulavacaciones, $cantidadpersonas);
        /*
         if ($estado == 1) {
             //Nomina Cajero
             $pdf->SetLeftMargin(2);
             $pdf->AddPage();
             $pdf->SetFont('Arial', 'B', 20);
             $pdf->SetLineWidth(0.5);
             $pdf->Text($this->fnCentrarTexto($longitudhoja, $pdf->GetStringWidth('NOMINA EN CAJERO')), 10, 'NOMINA EN CAJERO');
             $ArrayAncho = $this->fnPintarEncabezado($pdf, $objdatosperiodo, $longitudhoja);
             $pdf = $this->crearCuerpo($pdf, $datos, $ArrayAncho, 2, 0, $objdatosperiodo, $datosnomina->idelaborarpago, $longitudhoja, $estado);

             //Nomina Efectivo
             $pdf->SetLeftMargin(2);
             $pdf->AddPage();
             $pdf->SetFont('Arial', 'B', 20);
             $pdf->SetLineWidth(0.5);
             $pdf->Text($this->fnCentrarTexto($longitudhoja, $pdf->GetStringWidth('NOMINA EN EFECTIVO')), 10, 'NOMINA EN EFECTIVO');
             $ArrayAncho = $this->fnPintarEncabezado($pdf, $objdatosperiodo, $longitudhoja);
             $pdf = $this->crearCuerpo($pdf, $datos, $ArrayAncho, 1, 1, $objdatosperiodo, $datosnomina->idelaborarpago, $longitudhoja, $estado);

             //Creando el desglose de billetes al final
             $this->crearDesgloseBilletes($pdf, $datosnomina->idelaborarpago);
         }   */
        //Lanzando el pdf
        $pdf->Output();
    }


    public function crearCuerpo(&$pdf, $tipovisualizacion, $datos, $arrcampos, $arrcodigospersonas, $ArrayAncho, $tipo, $objdatosperiodo, $idelaborarpago, $longitudhoja, $estado, $acumulavacaciones, $cantidadpersonas)
    {
        //Agregando las columnas dinamicamente
        //$arrcolumnaaux = unserialize($datos[0]['campos']);
        $objConfigEstModelNomina = new ConfigEstructurarModelosNomina();

        //Obteniendo el id del campo del importe para el desglose de billetes (NETO)
        $idcampodevengar = $objConfigEstModelNomina->obtenerCampoADevengar($idelaborarpago, 1);

        if ($tipo == 1) {
            //Variable para guardar la suma total del campo para el desglose de billetes y el array de cantidades de billetes por persona
            $importetotaldesglose = 0;
            $arrcantbilletesdesglose = array();
            $contdesglose = 0;
        }

        $arrcolumna = $this->fnReestructurarArreglosCamposPersonas(1, $arrcampos, null, $acumulavacaciones);

        $cantidadColumnasDatosPersona = 0;
        $this->fnPintarDenominacionCampos($pdf, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $idcampodevengar);

        //Agregando los datos de las personas
        if ($datos[0]) {
            $objPlantillaNominal = new ConfPlantillaNominal();
            $arrayCentros = array();
            foreach ($datos as $v => $value) {
                //datos de las personas
                $arrValores = unserialize($value['valores']);
                //Definiendo para cada persona el tipo de pago, por CAJA o CAJERO
                foreach ($arrValores as $i => $valores) {
                    $arrValores[$i]['cajacajero'] = $value['cajacajero'];
                }

                //Uniendo las personas de Caja con las de Cajero
                $arrayCentros[$value['idplantillanominal']]->centro = $objPlantillaNominal->obtenerDenomXId($value['idplantillanominal']);
                foreach ($arrValores as $i => $p) {
                    $arrayCentros[$value['idplantillanominal']]->personas[] = $p;
                }
            }
            //Ordenando las personas por el cargo
            $arrayCentros = $this->ordenarPersonasPorCargo($arrayCentros);

            $sumSubtotalGeneral = array();
            $sumTiempoImporteVacTotal = array();
            //Pintando los datos por cada centro  *********************************************************************
            $contcentros = 0;
            foreach ($arrayCentros as $c => $centro) {
                
                $contcentros++;
                $sumPorCentro = array();
                $sumTiempoImporteVacCentro = array();
                //Pintando las plantillas nominales
                $this->fnAdicionarPagina($pdf, $objdatosperiodo, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $estado, $idcampodevengar);
                $pdf->SetFillColor(230);//Definiendo el color de celdas
                $pdf->SetFont('Arial', 'B', 8);
                $pdf->Cell(($longitudhoja - 6) + 2, 5, utf8_decode($centro->centro . ' : (' . count($centro->personas) . ' ' . ((count($centro->personas) > 1) ? 'personas' : 'persona') . ')'), 1, 1, 'L', 1);

                $pdf->Line(2, $pdf->GetY(), 276 + 2, $pdf->GetY()); //Horizontal inicial

                //Pintando los datos por cada persona******************************************************************
                foreach ($centro->personas as $p => $persona) {
                    $this->fnAdicionarPagina($pdf, $objdatosperiodo, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $estado, $idcampodevengar);
                    //Pintando el codigo contable por persona
                    $idpersona = explode('-', $persona['id'])[0];
                    $pdf->SetFont('Arial', '', 6);
                    $pdf->Cell($ArrayAncho['longcodigocontable'], 5, $arrcodigospersonas[$idpersona], 0, 0, 'C', 0);

                    //Pintando los datos de las personas
                    $camposrestantes = '';
                    $persona = $this->fnReestructurarArreglosCamposPersonas(2, $arrcolumna, $persona, $acumulavacaciones);
                    foreach ($persona as $keyP => $valuePersona) {
                        //Para obiar el primer elmento del arreglo
                        if ($keyP != 'id') {
                            $fillcolorcampos = ($keyP == 'c' . $idcampodevengar) ? 1 : 0;
                            $fillbordecampos = ($keyP == 'c' . $idcampodevengar) ? 1 : 0;
                            $pdf->SetFillColor(230);
                            //Cambio de hoja
                            if ($arrcolumna[$keyP]['idtipocampo'] == 1) {//Campos que son string
                                if ($arrcolumna[$keyP]['escampopersona'] == 'nombreapellidos') {
                                    $tamletras = 6;
                                    $cantletras = 50;
                                    $bordletras = 'B';
                                    $centletra = 'L';
                                    $valuePersona = strtoupper($valuePersona);//convirtiendo los nombres a mayuscula
                                } else {
                                    $tamletras = 6;
                                    $cantletras = 12;
                                    $centletra = 'C';
                                    $bordletras = '';
                                }
                                //Si es el campo de nombre -- cambiar el formato
                                $pdf->SetTextColor(0);//Definiendo el color de la letra
                                $pdf->SetFont('Arial', $bordletras, $tamletras);
                                $pdf->Cell($ArrayAncho[$keyP]['longitud'], 5, utf8_decode(substr(($valuePersona), 0, $cantletras)), 0, 0, $centletra, 0);
                            } elseif ($arrcolumna[$keyP]['idtipocampo'] == 2 || $arrcolumna[$keyP]['idtipocampo'] == 3 || $arrcolumna[$keyP]['idtipocampo'] == 4) {//Compruebo que la columna sea un valor salarial

                                //Excluyendo los campos que acumulan vacaciones
                                if ($keyP != 'c' . $ArrayAncho['camposvacaciones'][0]['idcampo'] && $keyP != 'c' . $ArrayAncho['camposvacaciones'][1]['idcampo']) {
                                    $sumPorCentro[$keyP] = $sumPorCentro[$keyP] + $valuePersona;
                                    if ($arrcolumna[$keyP]['vacacionesdiasimporte'] == 0 && $ArrayAncho[$keyP]['escampoencabezado'] == 1) {    //pintando las 15 primeras columnas salariales en el encabezado
                                        $pdf->SetTextColor(0);//Definiendo el color de celdas
                                        $pdf->SetFont('Arial', '', 6);
                                        $pdf->Cell($ArrayAncho[$keyP]['longitud'], 5, utf8_decode($valuePersona), $fillbordecampos, 0, 'C', $fillcolorcampos);
                                    } else {
                                        if (intval($valuePersona) > 0) {
                                            $camposrestantes .= $ArrayAncho[$keyP]['denominacion'] . ":" . $valuePersona . "  ";
                                        }

                                    }
                                }
                            }
                        }
                    }

                    //Campo de firma
                    $saltofirma = (!empty($ArrayAncho['camposvacaciones'])) ? 0 : 1;
                    $pdf->SetFont('Arial', '', 6);
                    $pdf->Cell($ArrayAncho['longfirma'], 5, ($persona['cajacajero'] == 2) ? "Cajero" : "_____", 0, $saltofirma, 'C', 0);

                    //Suma de subtotales por centro de los campos de vacaciones
                    if (!empty($ArrayAncho['camposvacaciones'])) {
                        if (count($ArrayAncho['camposvacaciones']) == 1) {
                            $pdf->Cell($ArrayAncho['longvacaciones'], 5, $persona['c' . $ArrayAncho['camposvacaciones'][0]['idcampo']], 0, 1, 'C', 0);
                            $sumTiempoImporteVacCentro[0] += $persona['c' . $ArrayAncho['camposvacaciones'][0]['idcampo']];
                        } else {
                            $pdf->Cell($ArrayAncho['longvacaciones'] / 2, 5, $persona['c' . $ArrayAncho['camposvacaciones'][0]['idcampo']], 0, 0, 'C', 0);
                            $sumTiempoImporteVacCentro[0] += $persona['c' . $ArrayAncho['camposvacaciones'][0]['idcampo']];
                            $pdf->Cell($ArrayAncho['longvacaciones'] / 2, 5, $persona['c' . $ArrayAncho['camposvacaciones'][1]['idcampo']], 0, 1, 'C', 0);
                            $sumTiempoImporteVacCentro[1] += $persona['c' . $ArrayAncho['camposvacaciones'][1]['idcampo']];
                        }

                    }

                    //Pintando debajo de cada persona los valores de los campos restantes, solo si es necesario.
                    if ($ArrayAncho['cantidadcsalarios'] > 15) {
                        //Campos de cadenas concatenadas
                        $pdf->Cell($ArrayAncho['longcampospersonas'], 5, '', 0, 0);
                        $pdf->MultiCell($ArrayAncho['longcampossalario'], 5, utf8_decode($camposrestantes), 0, 'L');
                    }


                    //Pintando las lineas horizontales por personas
                    $this->fnPintarLineasHorizPorPersonas($pdf);
                }

                //Sumando los subtotales por centros
                foreach ($arrcolumna as $keycol => $valuecol) {
                    if ($valuecol['idtipocampo'] == 2 || $valuecol['idtipocampo'] == 3 || $valuecol['idtipocampo'] == 4) {//Compruebo que la columna sea un valor numerico
                        $sumSubtotalGeneral[$keycol] = $sumSubtotalGeneral[$keycol] + $sumPorCentro[$keycol];
                    }
                }

                $this->fnAdicionarPagina($pdf, $objdatosperiodo, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $estado, $idcampodevengar);

                //Pintando los subtotales por campos
                $pdf->SetFillColor(230);
                $pdf->SetFont('Arial', 'B', 8);
                $pdf->Cell($ArrayAncho['longcampospersonas'], 5, 'Subtotales', 1, 0, 'C', 1);
                $camposrestantes = '';
                foreach ($arrcolumna as $keycol => $valuecol) {
                    $fillcolorcampos = ($keycol == 'c' . $idcampodevengar) ? 1 : 0;
                    $fillbordecampos = ($keycol == 'c' . $idcampodevengar) ? 1 : 0;
                    $pdf->SetFillColor(230);
                    //Compruebo que la columna sea un valor numérico
                    if ($valuecol['idtipocampo'] == 2 || $valuecol['idtipocampo'] == 3 || $valuecol['idtipocampo'] == 4) {//Compruebo que la columna sea un valor salarial
                        if ($valuecol['vacacionesdiasimporte'] == 0 && $ArrayAncho[$keycol]['escampoencabezado'] == 1) {
                            $pdf->SetFont('Arial', 'B', $this->tamannosubtotales);
                            $pdf->Cell($ArrayAncho[$keycol]['longitud'], 5, number_format($sumPorCentro[$keycol], 2, '.', ''), $fillbordecampos, 0, 'C', $fillcolorcampos);
                        } else {
                            if (intval($sumPorCentro[$keycol]) > 0) {
                                $camposrestantes .= $ArrayAncho[$keycol]['denominacion'] . ":" . number_format($sumPorCentro[$keycol], 2, '.', '') . "  ";
                            }
                        }
                    }
                }
                //Sumando el total de los campos tiempo e importe del submayor  y pintando los subtotales por centro
                if (!empty($ArrayAncho['camposvacaciones'])) {
                    if (count($ArrayAncho['camposvacaciones']) == 1) {
                        $pdf->SetFont('Arial', 'B', $this->tamannosubtotales);
                        $pdf->Cell($ArrayAncho['longfirma'], 5, "     ", 0, 0, 'C', 0);
                        $pdf->Cell($ArrayAncho['longvacaciones'], 5, number_format($sumTiempoImporteVacCentro[0], 2, '.', ''), 0, 1, 'C', 0);
                        $sumTiempoImporteVacTotal[0] += $sumTiempoImporteVacCentro[0];
                    } else {
                        $pdf->SetFont('Arial', 'B', $this->tamannosubtotales);
                        $pdf->Cell($ArrayAncho['longfirma'], 5, "     ", 0, 0, 'C', 0);
                        $pdf->Cell($ArrayAncho['longvacaciones'] / 2, 5, number_format($sumTiempoImporteVacCentro[0], 2, '.', ''), 0, 0, 'C', 0);
                        $sumTiempoImporteVacTotal[0] += $sumTiempoImporteVacCentro[0];
                        $pdf->Cell($ArrayAncho['longvacaciones'] / 2, 5, number_format($sumTiempoImporteVacCentro[1], 2, '.', ''), 0, 1, 'C', 0);
                        $sumTiempoImporteVacTotal[1] += $sumTiempoImporteVacCentro[1];
                    }
                }

                $pdf->SetFont('Arial', 'B', $this->tamannosubtotales);
                if ($ArrayAncho['cantidadcsalarios'] > 15) {
                    $pdf->Cell($ArrayAncho['longcampospersonas'], 5, '', 0, 0, 'C', 0);
                    $pdf->MultiCell($ArrayAncho['longcampossalario'], 5, utf8_decode($camposrestantes), 0, 'L');
                } else
                    $pdf->Ln();

                //Tipo de visualizacion -- por Plantillas o General
                if ($tipovisualizacion == 'Plantillas' && $contcentros != count($arrayCentros)) {
                    $this->fnAdicionarPaginaPorPlantilla($pdf, $objdatosperiodo, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $estado, $idcampodevengar);
                }
            }

            //Pintando el total general*****************************************************************************
            $pdf->fnSetFirmaPagina(1);
            $this->fnAdicionarPagina($pdf, $objdatosperiodo, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $estado, $idcampodevengar);
            $this->fnPintarMarcoPorHojas($pdf);
            //Agregando total general
            $pdf->SetFillColor(230);//Definiendo el color de celdas
            $pdf->SetFont('Arial', 'B', 8);
            $pdf->Cell($ArrayAncho['longcampospersonas'], 5, 'Total general:'.'(' .$cantidadpersonas. ')' , 1, 0, 'C', 1);
            //Pintando los totales por campos
            $camposrestantes = '';
            foreach ($arrcolumna as $keycol => $valuecol) {
                $fillcolorcampos = ($keycol == 'c' . $idcampodevengar) ? 1 : 0;
                $pdf->SetFillColor(230);
                //Compruebo que la columna sea un valor numérico
                if ($valuecol['idtipocampo'] == 2 || $valuecol['idtipocampo'] == 3 || $valuecol['idtipocampo'] == 4) {//Compruebo que la columna sea un valor salarial
                    if ($valuecol['vacacionesdiasimporte'] == 0 && $ArrayAncho[$keycol]['escampoencabezado'] == 1) {
                        $pdf->SetFont('Arial', 'B', $this->tamannosubtotales - 0.2);
                        $pdf->Cell($ArrayAncho[$keycol]['longitud'], 5, number_format($sumSubtotalGeneral[$keycol], 2, '.', ''), 1, 0, 'C', $fillcolorcampos);
                    } else {
                        $pdf->SetFont('Arial', 'B', $this->tamannosubtotales - 0.2);
                        if (intval($sumSubtotalGeneral[$keycol]) > 0) {
                            $camposrestantes .= $ArrayAncho[$keycol]['denominacion'] . ":" . number_format($sumSubtotalGeneral[$keycol], 2, '.', '') . "  ";
                        }
                    }
                }
            }

            //Pintando los totales de los campos dias e importe de las vacaciones
            if (!empty($ArrayAncho['camposvacaciones'])) {
                if (count($ArrayAncho['camposvacaciones']) == 1) {
                    $pdf->SetFont('Arial', 'B', $this->tamannosubtotales - 0.2);
                    $pdf->Cell($ArrayAncho['longvacaciones'] + $ArrayAncho['longfirma'] + 2, 5, number_format($sumTiempoImporteVacTotal[0], 2, '.', ''), 0, 1, 'R', 0);
                } else {
                    $pdf->SetFont('Arial', 'B', $this->tamannosubtotales - 0.2);
                    $pdf->Cell($ArrayAncho['longvacaciones'] / 2 + $ArrayAncho['longfirma'], 5, number_format($sumTiempoImporteVacTotal[0], 2, '.', ''), 1, 0, 'R', 0);
                    $pdf->Cell($ArrayAncho['longvacaciones'] / 2 + 2, 5, number_format($sumTiempoImporteVacTotal[1], 2, '.', ''), 1, 1, 'C', 0);
                }
            }
            $pdf->SetFont('Arial', 'B', $this->tamannosubtotales - 0.2);
            if ($ArrayAncho['cantidadcsalarios'] > 15) {
                $pdf->Cell($ArrayAncho['longcampospersonas'], 5, '', 0, 0, 'C', 0);
                $pdf->MultiCell($ArrayAncho['longcampossalario'], 5, utf8_decode($camposrestantes), 0, 'L');
            }
        }

    }

    public function obtenerCantidadPersonas($datos){
        $cantidad = 0;
        if(count($datos)>0){
            $cantidad = 0;
            foreach ($datos as $dt){
                $val = unserialize($dt['valores']);
                $cantidad += count($val);
            }
        }
        return $cantidad;
    }

    public function fnReestructurarArreglosCamposPersonas($numeroarray, $arraycampos = null, $arrayvalorespersona = null, $acumulavacaciones)
    {

        $r = array();
        //Reestructurando arreglo de CAMPOS
        if ($numeroarray == 1) {
            foreach ($arraycampos as $c => $campo) {
                $r['c' . $campo['idestructuramodelodomina']] = $campo;
                /* if ($campo['idtipocampo'] == 1) {
                     $r['c' . $campo['idestructuramodelodomina']] = $campo;
                 }

                 if (($campo['idtipocampo'] == 2 || $campo['idtipocampo'] == 3) && empty($campo['vacacionesdiasimporte'])) {
                     $r['c' . $campo['idestructuramodelodomina']] = $campo;
                 }

                 if (($campo['idtipocampo'] == 2 || $campo['idtipocampo'] == 4) && $campo['vacacionesdiasimporte'] > 0) {
                     $r['c' . $campo['idestructuramodelodomina']] = $campo;
                 }*/
            }

        } else {//Reestructurando arreglo de VALORES de la persona
            $r['id'] = $arrayvalorespersona['id'];
            foreach ($arraycampos as $c => $campo) {
                $r['c' . $campo['idestructuramodelodomina']] = $arrayvalorespersona['c' . $campo['idestructuramodelodomina']];
            }
            $r['plantillanominal'] = $arrayvalorespersona['plantillanominal'];
            $r['idnomina'] = $arrayvalorespersona['idnomina'];
            $r['cajacajero'] = $arrayvalorespersona['cajacajero'];
        }

        //print_r($r);die;
        return $r;
    }

    public function fnDefinirLongitudCampos($arrcampos, $longitudhoja, $acumulavacaciones)
    {
        //Arreglo de ancho de columnas
        $ArrayAncho = array();

        //Campos personas
        $cantidadcpersonas = 0;
        $longcampospersonas = 0;

        //Campos salarios
        $cantidadcsalarios = 0;
        $contpers = 0;

        //Codigo
        $cantidadcodigo = 1;
        $longitudcodigocontable = 7;

        //Firma
        $longitudfirma = 8;

        //Vacaciones
        $contcamposvacaciones = 0;
        $arrcamposvacaciones = array();
        $contvac = 0;

        //Definiendo los campos salariales de acumulacion de vacaciones
        foreach ($arrcampos as $c => $campo) {
            if ($campo['vacacionesdiasimporte'] > 0) {
                $arrcamposvacaciones['tipoacumulacion'] = $acumulavacaciones;
                if ($campo['idtipocampo'] == 2 || $campo['idtipocampo'] == 3 || $campo['idtipocampo'] == 4) {
                    $contcamposvacaciones++;
                    $arrcamposvacaciones[$contvac]['tipo'] = $campo['vacacionesdiasimporte'];
                    $arrcamposvacaciones[$contvac]['idcampo'] = $campo['idestructuramodelodomina'];
                    $arrcamposvacaciones[$contvac]['denominacion'] = ($campo['vacacionesdiasimporte'] == 1) ? 'Tiem.' : 'Imp.';
                    $arrcamposvacaciones[$contvac]['denominacionreal'] = $campo['denominacion'];
                    $contvac++;
                }
            }
        }
        $longvacaciones = ($contcamposvacaciones > 0) ? 16 : 0;

        // print_r($arrcampos);die;
        //Definiendo los campos personas
        foreach ($arrcampos as $c => $campo) {
            if ($campo['idtipocampo'] == 1) {
                $contpers++;
                if ($contpers <= 5) { //Solo 5 campos de personas
                    if ($campo['escampopersona'] == 'numidentidad') {
                        $longcampospersonas += 14;
                        $ArrayAncho['c' . $campo['idestructuramodelodomina']]['longitud'] = 14;
                        $ArrayAncho['c' . $campo['idestructuramodelodomina']]['denominacion'] = $campo['denominacion'];
                    } elseif ($campo['escampopersona'] == 'nombreapellidos') {
                        $longcampospersonas += 48;
                        $ArrayAncho['c' . $campo['idestructuramodelodomina']]['longitud'] = 48;
                        $ArrayAncho['c' . $campo['idestructuramodelodomina']]['denominacion'] = $campo['denominacion'];
                    } else {
                        $longcampospersonas += 10;
                        $ArrayAncho['c' . $campo['idestructuramodelodomina']]['longitud'] = 10;
                        $ArrayAncho['c' . $campo['idestructuramodelodomina']]['denominacion'] = $campo['denominacion'];
                    }
                    $cantidadcpersonas++;
                } else {
                    $ArrayAncho['c' . $campo['idestructuramodelodomina']]['longitud'] = 0;
                    $ArrayAncho['c' . $campo['idestructuramodelodomina']]['denominacion'] = $campo['denominacion'];
                }
            } elseif ($campo['idtipocampo'] == 2 || $campo['idtipocampo'] == 3 || $campo['idtipocampo'] == 4) {
                $cantidadcsalarios += ($campo['vacacionesdiasimporte'] == 0) ? 1 : 0;
            }
        }

        //Definiendo los campos salariales
        $longcampossalario = $longitudhoja - $longitudcodigocontable - $longcampospersonas - $longitudfirma - $longvacaciones - 6;
        $cont = 0;//Contador para pintar solo los 15 primeros campos de salario
        foreach ($arrcampos as $c => $campo) {
            if (($campo['idtipocampo'] == 2 || $campo['idtipocampo'] == 3 || $campo['idtipocampo'] == 4) && $campo['vacacionesdiasimporte'] == 0) {
                $cont++;
                $ArrayAncho['c' . $campo['idestructuramodelodomina']]['longitud'] = ($cantidadcsalarios <= 15) ? ($longcampossalario / $cantidadcsalarios) : $longcampossalario / 15;
                $ArrayAncho['c' . $campo['idestructuramodelodomina']]['denominacion'] = $campo['denominacion'];
                $ArrayAncho['c' . $campo['idestructuramodelodomina']]['escampoencabezado'] = ($cont <= 15) ? 1 : 0;
            }
        }

        //Otros campos
        $ArrayAncho['camposencabezado'] = ($cantidadcsalarios <= 15) ? $cantidadcodigo + $cantidadcpersonas + $cantidadcsalarios : $cantidadcodigo + $cantidadcpersonas + 15;
        $ArrayAncho['cantidadcsalarios'] = $cantidadcsalarios;
        $ArrayAncho['longcodigocontable'] = $longitudcodigocontable;
        $ArrayAncho['longcampospersonas'] = $longcampospersonas + $longitudcodigocontable;
        $ArrayAncho['longcampossalario'] = $longcampossalario;
        $ArrayAncho['longfirma'] = $longitudfirma;
        $ArrayAncho['camposvacaciones'] = ($contcamposvacaciones > 0) ? $arrcamposvacaciones : null;
        $ArrayAncho['longvacaciones'] = $longvacaciones;
        //print_r($ArrayAncho);die;
        return $ArrayAncho;

    }

    /**
     * Función para pintar el encabezado en cada hoja nueva*/
    public function fnPintarEncabezado(&$pdf, $objdatosperiodo, $estado, $cantidadpersonas)
    {
        //Nombre de la empresa
        $datosentidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        $logo = '';
        $nombreempresa = '';
        if($datosentidad[0]->idconcepto != 3){
            $nombreempresa = utf8_decode(ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($this->identidad)[0]->denominacion);
            $logo = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($this->identidad)[0]->logo;
            $logo = (!empty($logo)) ? $logo : $datosentidad[0]->logo;
        }else{
            $nombreempresa = $datosentidad[0]->denominacion;
            $logo = $datosentidad[0]->logo;
        }

        //Logo de la entidad

        list($imagenBase64,) = explode(';', $logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($logo)) {
            $pdf->Image($logo, 2, 1, 22, 10, $extension);
        }

        //$register = Zend_Registry::getInstance();
        //$direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        //$pdf->Image($direccion, 5, 5, 22, 10);


        //Titulo
        $pdf->SetFont('Arial', 'B', 10);
        $tituloprincipal = ($estado != 1) ? 'MODELO SC-4-01 CONTROL DATOS NOMINAS' : 'MODELO SC-4-06 NOMINA';
        $pdf->Cell($this->longitudhoja, 10, $tituloprincipal, 0, 1, 'C', 0);

        //Nombre de la Empresa
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->SetX(2);
        $pdf->Cell(20, 5, 'Empresa: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(175, 5, $nombreempresa, 0, 0, 'L', 0);

        //Fecha y hora
        $date = DatNominaModel::fnFechaHora();
        $fecha = $date['fecha'];
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(50, 5, "Cant. Trabajadores:". $cantidadpersonas, 0, 0, 'C', 0);
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(25, 5, "Fecha: $fecha", 0, 1, 'L', 0);

        $pdf->SetFillColor(245);//Definiendo el color de celdas
        $pdf->SetTextColor(0);//Definiendo el color de la letra
        //Primera fila-------------------------------------
        $pdf->Ln(2);
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(105, 5, 'Entidad', 1, 0, 'C', 0);
        $pdf->Cell(57, 5, 'Cheque', 1, 0, 'C', 0);
        $pdf->Cell(20, 5, utf8_decode('Nómina No.'), 1, 0, 'C', 0);
        $pdf->Cell(20, 5, 'Hoja No.', 1, 0, 'C', 0);
        $pdf->Cell(21, 5, utf8_decode('Período:'), 'T', 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(11, 5, $objdatosperiodo['fechainicioperiodo'][1], 'T', 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(20, 5, 'Mes de pago:', 'T', 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(22, 5, $objdatosperiodo['mespago'], 'T,R', 1, 'L', 0);

        //Segunda fila-------------------------------------
        
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(85, 15, '', 1, 0, 'C', 0);
        $pdf->Cell(20, 15, '', 1, 0, 'C', 0);
        $pdf->Cell(30, 5, '   No:', 1, 0, 'L', 0);
        $pdf->Cell(27, 5, '   Fecha:', 1, 0, 'L', 0);
        $pdf->Cell(20, 5, $objdatosperiodo['numeronomina'], 1, 0, 'C', 0);
        $pdf->Cell(20, 5, $pdf->PageNo(), 1, 0, 'C', 0);
        $pdf->Cell(36, 5, 'Desde', 1, 0, 'C', 0);
        $pdf->Cell(38, 5, 'Hasta', 1, 1, 'C', 0);


        //Tercera fila-------------------------------------
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(85, 5, 'Nombre', 0, 0, 'C', 0);
        $pdf->Cell(20, 5, utf8_decode('Código'), 0, 0, 'C', 0);
        $pdf->Cell(97, 5, utf8_decode('Tipo de Nómina'), 0, 0, 'C', 0);
        $pdf->Cell(12, 5, utf8_decode('Día'), 1, 0, 'C', 0);
        $pdf->Cell(12, 5, 'Mes', 1, 0, 'C', 0);
        $pdf->Cell(12, 5, utf8_decode('Año'), 1, 0, 'C', 0);
        $pdf->Cell(12, 5, utf8_decode('Día'), 1, 0, 'C', 0);
        $pdf->Cell(12, 5, 'Mes', 1, 0, 'C', 0);
        $pdf->Cell(14, 5, utf8_decode('Año'), 1, 1, 'C', 0);

        //cuarta fila-------------------------------------
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(85, 5, utf8_decode($objdatosperiodo['datosentidad'][0]->denominacion), 1, 0, 'C', 0);
        $pdf->Cell(20, 5, utf8_decode($objdatosperiodo['datosentidad'][0]->codigo), 1, 0, 'C', 0);
        $pdf->Cell(97, 5, utf8_decode($objdatosperiodo['tiponomina']), 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechainicioperiodo'][0], 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechainicioperiodo'][1], 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechainicioperiodo'][2], 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechafinperiodo'][0], 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechafinperiodo'][1], 1, 0, 'C', 0);
        $pdf->Cell(14, 5, $objdatosperiodo['fechafinperiodo'][2], 1, 1, 'C', 0);
    }

    /** Función para pintar la denominación de los campos
     *
     */
    public function fnPintarDenominacionCampos(&$pdf, $arrcolumna, $ArrayAncho, &$cantidadColumnasDatosPersona, $idcampodevengar)
    {
        $pdf->SetFont('Arial', 'B', 6);
        $pdf->Cell($ArrayAncho['longcodigocontable'], 5, utf8_decode('Cod'), 1, 0, 'C', 0);
        foreach ($arrcolumna as $keycol => $valuecol) {
            $colorcampos = ($keycol == 'c' . $idcampodevengar) ? 230 : 250;
            $pdf->SetFillColor($colorcampos);
            if ($valuecol['idtipocampo'] == 1) {
                $pdf->Cell($ArrayAncho[$keycol]['longitud'], 5, utf8_decode($valuecol['denominacion']), 1, 0, 'C', 0);
                $cantidadColumnasDatosPersona++;
            } else if ($valuecol['idtipocampo'] == 2 || $valuecol['idtipocampo'] == 3 || $valuecol['idtipocampo'] == 4) {// Si los campos son numéricos
                if ($valuecol['vacacionesdiasimporte'] == 0 && $ArrayAncho[$keycol]['escampoencabezado'] == 1) {
                    $pdf->Cell($ArrayAncho[$keycol]['longitud'], 5, utf8_decode(substr(($valuecol['denominacion']), 0, 9)), 1, 0, 'C', 1);
                }
            }
        }
        //Campo de FIRMA
        $saltofirma = (!empty($ArrayAncho['camposvacaciones'])) ? 0 : 1;
        $borderfirma = (!empty($ArrayAncho['camposvacaciones'])) ? 1 : 'L,T,B';
        $pdf->Cell($ArrayAncho['longfirma'], 5, "Firma", $borderfirma, $saltofirma, 'C', 0);

        //Campo de VACACIONES
        if (!empty($ArrayAncho['camposvacaciones'])) {
            //Preguntando si es una nomina de liquidacion
            $tipoacumulacion = ($ArrayAncho['camposvacaciones']['tipoacumulacion'] == 2) ? "Saldos Vac." : "Acum. Vac.";
            if (count($ArrayAncho['camposvacaciones']) == 1) {
                $pdf->Cell($ArrayAncho['longvacaciones'] + 2, 2, $tipoacumulacion, 1, 1, 'C', 0);
                $longhastavac = $ArrayAncho['longcampospersonas'] + $ArrayAncho['longcampossalario'] + $ArrayAncho['longfirma'];
                $pdf->Cell($longhastavac, 5, '', 0, 0, 'C', 0);
                $pdf->Cell($ArrayAncho['longvacaciones'] + 2, 3, $ArrayAncho['camposvacaciones'][0]['denominacion'], 1, 1, 'C', 0);
            } else {
                $pdf->Cell($ArrayAncho['longvacaciones'] + 2, 2, $tipoacumulacion, 1, 1, 'C', 0);
                $longhastavac = $ArrayAncho['longcampospersonas'] + $ArrayAncho['longcampossalario'] + $ArrayAncho['longfirma'];
                $pdf->Cell($longhastavac, 3, '', 0, 0, 'C', 0);
                $pdf->Cell($ArrayAncho['longvacaciones'] / 2, 3, $ArrayAncho['camposvacaciones'][0]['denominacion'], 1, 0, 'C', 0);
                $pdf->Cell($ArrayAncho['longvacaciones'] / 2 + 2, 3, $ArrayAncho['camposvacaciones'][1]['denominacion'], 1, 1, 'C', 0);
            }
        }

        $pdf->Line(2, $pdf->GetY(), 276 + 2, $pdf->GetY()); //Horizontal
    }

    public function fnPintarLineasHorizPorPersonas(&$pdf)
    {
        $pdf->Line(2, $pdf->GetY(), 276 + 2, $pdf->GetY()); //Horizontal por persona
        //$pdf->Ln(1);
    }

    public function fnPintarMarcoPorHojas(&$pdf)
    {
        $x_inicial = 2;
        $x_final = 276;
        $y_inicial = 30;
        $y_final = ($pdf->GetY() != 180) ? $pdf->GetY() : 180;

        $pdf->Line($x_inicial, $y_final, $x_final + 2, $y_final); //Horizontal final
        $pdf->Line($x_inicial, $y_inicial, $x_inicial, $y_final); //Vertical izquierda
        $pdf->Line($x_final + 2, $y_inicial, $x_final + 2, $y_final); //Vertical derecha
        $pdf->Ln(5);
    }

    public function crearDesgloseBilletes(&$pdf, $idelaborarpago)
    {
        $datos = DatNominaDatos::obtenerDatosNominaEfectivoPorElaborarPago($idelaborarpago);
        //Variable para guardar la suma total del campo para el desglose de billetes y el array de cantidades de billetes por persona
        $importetotaldesglose = 0;
        $arrcantbilletesdesglose = array();
        $contdesglose = 0;
        //Agregando las columnas dinamicamente
        $objConfigEstModelNomina = new ConfigEstructurarModelosNomina();
        /*Obteniendo el Neto total para el desglose de billetes*/
        $idcampodevengar = $objConfigEstModelNomina->obtenerCampoADevengar($idelaborarpago, 1);
        foreach ($datos as $keyGen => $valueGen) {//Por cada centro
            $arrayDatosPersona = unserialize($valueGen['valores']);
            //Para cada persona
            foreach ($arrayDatosPersona as $keyPersona => $valuePersona) {
                if (!empty($valuePersona['c' . $idcampodevengar])) {
                    $arrcantbilletesdesglose [$contdesglose] = $this->fnDesglozarBilletes($valuePersona['c' . $idcampodevengar]);
                    $importetotaldesglose += $valuePersona['c' . $idcampodevengar];
                    $contdesglose++;
                }
            }
        }
        //Pintando Desglose de Billetes
        $this->fnPintarDesglosePDF($pdf, $importetotaldesglose, $arrcantbilletesdesglose);
    }

    public function fnDesglozarBilletes($importeadesglozar)
    {
        $importetotal = (strlen(explode('.', $importeadesglozar)[1]) == 1) ? ($importeadesglozar . "0") : $importeadesglozar;
        //Arrays con valores de los billetes y menudos
        $array_valor_billetes = [100, 50, 20, 10, 5, 3, 1];
        $array_valor_menudos = [20, 5, 1];
        $importebillete = explode('.', $importetotal)[0];
        $importemenudo = intval((strlen(explode('.', $importetotal)[1]) == 1) ? (explode('.', $importetotal)[1] . "0") : (explode('.', $importetotal)[1]));
        $arraybilletes = array();
        $arraymenudo = array();
        $arrayfinal = array();
        //LLenando las columnas de billetes y menudos con sus respectivos valores
        foreach ($array_valor_billetes as $b => $billete) {
            //Cantidad de BILLETES
            $cant_billetes = ($importebillete >= $billete) ? intval($importebillete / $billete) : 0;
            $importebillete = ($importebillete != $billete) ? (($importebillete > $billete) ? ($importebillete % $billete) : $importebillete) : 0;
            $arraybilletes[$billete] += $cant_billetes;

            //Cantidad de MENUDO
            if ($b < count($array_valor_menudos)) {
                $cant_menudos = ($importemenudo >= $array_valor_menudos[$b]) ? intval($importemenudo / $array_valor_menudos[$b]) : 0;
                $importemenudo = ($importemenudo != $array_valor_menudos[$b]) ? (($importemenudo > $array_valor_menudos[$b]) ? ($importemenudo % $array_valor_menudos[$b]) : $importemenudo) : 0;
                $arraymenudo[$array_valor_menudos[$b]] += $cant_menudos;
            }
        }
        $arrayfinal[0] = $arraybilletes;
        $arrayfinal[1] = $arraymenudo;
        return $arrayfinal;
    }

    public function fnPintarDesglosePDF(&$pdf, $importetotaldesglose, $arrcantbilletesdesglose)
    {
        $pdf->AddPage();
        //Importe total a devengar
        $importetotal = (strlen(explode('.', $importetotaldesglose)[1]) == 1) ? ($importetotaldesglose . "0") : $importetotaldesglose;

        //Extrayendo las cantidades de billetes del array $arrcantbilletesdesglose
        //Arrays con valores de los billetes y menudos
        $array_billetes = [100, 50, 20, 10, 5, 3, 1];
        $array_cant_billetes = array();
        $array_menudo = [20, 5, 1];
        $array_cant_menudo = array();
        foreach ($arrcantbilletesdesglose as $desglosepersona) {
            foreach ($array_billetes as $bill) {
                $array_cant_billetes[$bill] += $desglosepersona[0][$bill];
            }
            foreach ($array_menudo as $men) {
                $array_cant_menudo[$men] += $desglosepersona[1][$men];
            }
        }
        //Escribiendo DESGLOSE DE BILLETES
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Ln();
        $pdf->SetX(300);
        $pdf->Write(10, 'DESGLOSE DE BILLETES (' . number_format($importetotal, 2, ',', '') . ')');

        //Escribiendo Billetes, Cant., Menudo, Cant.
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 10);

        $pdf->SetX(150);
        $pdf->Write(10, 'BILLETES' . utf8_decode(' ( $ )'));
        $pdf->SetX($this->longitudhoja);
        $pdf->Write(10, 'CANTIDAD');
        $pdf->SetX(420);
        $pdf->Write(10, 'MENUDO' . utf8_decode(' ( ¢ )'));
        $pdf->SetX(550);
        $pdf->Write(10, 'CANTIDAD');
        $pdf->Ln();

        /*Escribiendo El contenido de la tabla*********************************************/
        //LLenando las columnas de billetes y menudos con sus respectivos valores
        $contmenudo = 0;
        foreach ($array_cant_billetes as $b => $billete) {
            //Escribiendo los valores de los billetes y sus cantidades
            $pdf->SetFont('Arial', '', 10);
            $pdf->SetX(150);
            $pdf->Write(10, $b);
            $pdf->SetX($this->longitudhoja);
            $pdf->Write(10, $billete);

            //Cantidad de MENUDO
            if ($contmenudo < count($array_menudo)) {
                $pdf->SetX(420);
                $pdf->Write(10, $array_menudo[$contmenudo]);
                $pdf->SetX(550);
                $pdf->Write(10, $array_cant_menudo[$array_menudo[$contmenudo]]);
            }
            $contmenudo++;
            $pdf->Ln();
        }
        return $pdf;
    }

    /** Función para ampliar las ultimas celdas del pdf hasta el final a partir de una coordenada x y la cantidad de celdas(iguales)
     * $longitudhoja       - Longitud total de la hoja
     * $x                  - Coordenada del eje x
     * $cantceldasiguales  - Cantidad de celdas iguales a ampliar
     * $margenderecho      - Margen derecho
     * Retorna la longitud de cada celda a pintar a partir de esa coordenada x
     */
    public function fnPintarCeldasIgualesHastaFinal($longitudhoja, $x, $cantceldasiguales, $margenderecho)
    {
        return ($longitudhoja - $x) / $cantceldasiguales - ($margenderecho / $cantceldasiguales);
    }

    /** Función para pintar celdas vacias desde la última celda numérica hasta el campo firma
     * $longitudhoja       - Longitud total de la hoja
     * $resto              - Longitud que resta desde la última celda numérica hasta el final
     * $margenderecho      - Margen derecho
     * Retorna un arreglo: en la 1era posición guarda la cantidad de celdas a pintar y en la
     * 2da posición guarda la longitud de cada celda
     */
    public function fnPintarCeldasVaciasHastaFirma($longitudhoja, $resto, $margenderecho)
    {
        $array = array();
        $cantidadceldas = round(($longitudhoja - $resto - $margenderecho) / 15);
        $longceldas = ($longitudhoja - $resto - $margenderecho) / $cantidadceldas;
        $array[0] = $cantidadceldas;
        $array[1] = $longceldas;
        return $array;
    }

    /** Función para centrar el título de un reporte
     * $longitudhoja        - Longitud total de la hoja
     * $longitudcadena      - Longitud de la cadena título
     * $cantidadcolumnas    - Cantidad de columnas que tiene el texto a centrar
     * Retorna la coordenada x donde deberá pintarse el título
     */
    public function fnCentrarTexto($longitudhoja, $longitudcadena)
    {
        return ($longitudhoja - $longitudcadena) / 2;
    }

    public function ajustarTamannoHoja($pos)
    {
        //Llenando el arreglo
        $arraylongitudes = array();
        $incremento = 25;
        for ($l = 0; $l < 100; $l++) {
            $arraylongitudes[$l] = ($l <= 13) ? 465 : 465 + $incremento;
            $incremento += ($l <= 13) ? 0 : 25;
        }
        return $arraylongitudes[$pos];
    }

    /** Función para centrar los textos de varias columnas en una fila
     * $longitudhoja        - Longitud total de la hoja
     * $cantidadcolumnas    - Cantidad de columnas que tiene el texto a centrar
     * Retorna la coordenada x donde deberá pintarse el título
     */
    public function fnAjustarTextosEjeX($longitudhoja, $cantidadcolumnas)
    {
        $arrposiciones = array();
        if ($cantidadcolumnas > 0) {
            for ($i = 0; $i < $cantidadcolumnas; $i++) {
                $arrposiciones[$i] = ($i + 1) * $longitudhoja / ($cantidadcolumnas + 1);
            }
        }
        return $arrposiciones;
    }

    public function fnAdicionarPagina(&$pdf, $objdatosperiodo, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $estado, $idcampodevengar)
    {
        //Cambio de hoja
        $y = $pdf->GetY();
        $alto = ($pdf->fnGetFirmaPagina() == 1) ? 180 : 200;
        if ($y >= 180) {
            $this->fnPintarMarcoPorHojas($pdf);
            $pdf->AddPage();
            $this->fnPintarEncabezado($pdf, $objdatosperiodo, $estado);
            $this->fnPintarDenominacionCampos($pdf, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $idcampodevengar);
        }
    }

    public function fnAdicionarPaginaPorPlantilla(&$pdf, $objdatosperiodo, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $estado, $idcampodevengar)
    {
        //Cambio de hoja
        $this->fnPintarMarcoPorHojas($pdf);
        $pdf->AddPage();
        $this->fnPintarEncabezado($pdf, $objdatosperiodo, $estado);
        $this->fnPintarDenominacionCampos($pdf, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $idcampodevengar);
    }

    public function fnDenominacionMeses($numero_mes)
    {
        $mes = array(0 => "Enero", 1 => "Febrero", 2 => "Marzo", 3 => "Abril", 4 => "Mayo", 5 => "Junio", 6 => "Julio", 7 => "Agosto", 8 => "Septiembre", 9 => "Octubre", 10 => "Noviembre", 11 => "Diciembre");
        return $mes[$numero_mes - 1];
    }

    public function getPieFirmaDocumentoXIdEntidad($identidad)
    {
        $sql = "select cfd.*,ntf.denominacion, dp.nombre, dp.snombre, dp.papel, dp.sapel
                from mod_rrhhmaestro.conf_firmadocumento cfd
                inner join mod_rrhhmaestro.nom_tipofirma ntf on (ntf.idtipofirma = cfd.idtipofirma)
                inner join mod_persona.dat_persona dp on (dp.idpersona = cfd.idpersona)
                where cfd.identidad = ? and cfd.iddocumentofirma = 1 order by cfd.orden;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        return $conn->fetchAll($sql, array($identidad));
    }

    public function ordenarPersonasPorCargo(&$arrayCentros)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select distinct(dp.idpersona), nfe.nivel  from mod_persona.dat_persona dp
                   inner join mod_nomina.dat_cargosocupados dco on(dco.idpersona = dp.idpersona)
                   LEFT JOIN mod_estructuracomp.dat_cargo dc on (dc.idcargo = dco.idcargo and dc.idproyecto = 0)
                   INNER JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = dc.idcargo)
		           where dco.identidad = ? and dco.fechavencimiento is null;";
        $rordencargo = $conn->fetchAll($sql, array($this->identidad));
        $rord = array();
        foreach ($rordencargo as &$per) {
            $rord[$per['idpersona']] = $per['nivel'];
        }

        foreach ($arrayCentros as $c => $centro) {
            $rordencargo = null;
            foreach ($centro->personas as $p => &$persona) {
                $persona['ordencargo'] = ($rord[$persona['idpersona']] != null) ? $rord[$persona['idpersona']] : 9999999999;
                $rordencargo[$p] = ($rord[$persona['idpersona']] != null) ? $rord[$persona['idpersona']] : 9999999999;
            }
            array_multisort($rordencargo, SORT_ASC, $centro->personas);
        }
        return $arrayCentros;
    }
}
