<?php

class PdfVistaPreviaNomina extends fpdf
{
    function Footer()
    {
    }
}

class ReporteVistaPreviaNominaModel extends ZendExt_Model
{
    public $identidad = null;
    public $idtiponomina = null;
    public $denomtiponomina = null;
    public $longitudhoja = 280;

    public function ReporteVistaPreviaNominaModel()
    {
        parent::ZendExt_Model();

    }

    public function fnCrearReportePDF($identidad, $idtiponomina)
    {
        $this->identidad = $identidad;
        $this->idtiponomina = $idtiponomina;
        $this->denomtiponomina = NomTipoNomina::obtenerDenominacion($idtiponomina);
        $objConfigEstructurarModelosNomina = new ConfigEstructurarModelosNomina();
        $objDatNominaModel = new DatNominaModel();
        $arr = $objConfigEstructurarModelosNomina->obtenerAllDatosModeloNominaxIdTipoNomina($identidad, $idtiponomina);
        $arr = $objDatNominaModel->ordenarArrayPorClave($arr, 'ordenreporte');
        $cantidadcolumnas = 0;
        $arrcampos = array();
        foreach ($arr as $a) {
            if ($a['sc_4_06'] == 1) {
                $arrcampos[] = $a;
                $cantidadcolumnas++;
            }
        }
        //Definiendo la longitudes de las celdas de datos de la persona y datos salariales
        $ArrayAncho = $this->fnDefinirLongitudCampos($arrcampos, $this->longitudhoja, 1);

        //Formato de la hoja
        $pdf = new PdfVistaPreviaNomina('L', 'mm', 'Letter'); //216(ancho) X 279(alto)
        //Nomina General
        $pdf->SetLeftMargin(2);
        $pdf->SetTopMargin(2);
        $pdf->AddPage();
        $this->fnPintarEncabezado($pdf);
        $this->crearCuerpo($pdf, $arrcampos, $ArrayAncho, $this->longitudhoja, 1);
        //Lanzando el pdf
        $pdf->Output();
    }

    public function fnPintarEncabezado(&$pdf)
    {
        $ioc = ZendExt_IoC::getInstance();
        $datosentidad = $ioc->metadatos->DameEstructura($this->identidad);
        //Nombre de la empresa
        $nombreempresa = utf8_decode(ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($this->identidad)[0]->denominacion);
        //Logo de la entidad
        $logo = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($this->identidad)[0]->logo;
        $logo = (!empty($logo)) ? $logo : ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad)[0]->logo;
        list($imagenBase64,) = explode(';', $logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($logo)) {
            $pdf->Image($logo, 2, 1, 22, 10, $extension);
        }

        //Titulo
        $pdf->SetFont('Arial', 'B', 10);
        $tituloprincipal = 'MODELO SC-4-06 NOMINA';
        $pdf->Cell($this->longitudhoja, 10, $tituloprincipal, 0, 1, 'C', 0);

        //Nombre de la Empresa
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->SetX(2);
        $pdf->Cell(20, 5, 'Empresa: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(180, 5, $nombreempresa, 0, 0, 'L', 0);

        //Fecha y hora
        $date = DatNominaModel::fnFechaHora();
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(50, 5, 'Fecha: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(20, 5, $date['fecha'], 0, 1, 'L', 0);

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
        $pdf->Cell(11, 5, '', 'T', 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(20, 5, 'Mes de pago:', 'T', 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(22, 5, '', 'T,R', 1, 'L', 0);

        //Segunda fila-------------------------------------
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(85, 15, '', 1, 0, 'C', 0);
        $pdf->Cell(20, 15, '', 1, 0, 'C', 0);
        $pdf->Cell(30, 5, '   No:', 1, 0, 'L', 0);
        $pdf->Cell(27, 5, '   Fecha:', 1, 0, 'L', 0);
        $pdf->Cell(20, 5, '', 1, 0, 'C', 0);
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
        $pdf->Cell(85, 5, utf8_decode($datosentidad[0]->denominacion), 1, 0, 'C', 0);
        $pdf->Cell(20, 5, utf8_decode($datosentidad[0]->codigo), 1, 0, 'C', 0);
        $pdf->Cell(97, 5, utf8_decode($this->denomtiponomina), 1, 0, 'C', 0);
        $pdf->Cell(12, 5, '', 1, 0, 'C', 0);
        $pdf->Cell(12, 5, '', 1, 0, 'C', 0);
        $pdf->Cell(12, 5, '', 1, 0, 'C', 0);
        $pdf->Cell(12, 5, '', 1, 0, 'C', 0);
        $pdf->Cell(12, 5, '', 1, 0, 'C', 0);
        $pdf->Cell(14, 5, '', 1, 1, 'C', 0);
    }

    public function crearCuerpo(&$pdf, $arrcampos, $ArrayAncho, $longitudhoja, $acumulavacaciones)
    {
        //Obteniendo el id del campo del importe para el desglose de billetes (NETO)
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select cemn.idestructuramodelodomina from mod_nomina.conf_estructuramodelosnomina cemn
                inner join mod_nomina.conf_estructuramodelosnominaentidad cemne On(cemne.idestructuramodelodomina = cemn.idestructuramodelodomina)
                where cemne.idestructura = ? and cemn.idtiponomina = ? and cemn.esconceptopagosalario = 1";
        $idcampodevengar = $conn->fetchOne($sql, array($this->identidad, $this->idtiponomina));

        $arrcolumna = array();
        foreach ($arrcampos as $c => $campo) {
            $arrcolumna['c' . $campo['idestructuramodelodomina']] = $campo;
        }

        $cantidadColumnasDatosPersona = 0;
        $this->fnPintarDenominacionCampos($pdf, $arrcolumna, $ArrayAncho, $cantidadColumnasDatosPersona, $idcampodevengar);
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
        $ArrayAncho['longcodigocontable'] = $longitudcodigocontable;
        $ArrayAncho['longcampospersonas'] = $longcampospersonas + $longitudcodigocontable;
        $ArrayAncho['longcampossalario'] = $longcampossalario;
        $ArrayAncho['longfirma'] = $longitudfirma;
        $ArrayAncho['camposvacaciones'] = ($contcamposvacaciones > 0) ? $arrcamposvacaciones : null;
        $ArrayAncho['longvacaciones'] = $longvacaciones;
        return $ArrayAncho;

    }

    public function fnPintarDenominacionCampos(&$pdf, $arrcolumna, $ArrayAncho, &$cantidadColumnasDatosPersona, $idcampodevengar)
    {
        $pdf->SetFont('Arial', 'B', 6);
        $pdf->Cell($ArrayAncho['longcodigocontable'], 5, utf8_decode('Cod'), 1, 0, 'C', 0);
        $camposrestantes = '';
        foreach ($arrcolumna as $keycol => $valuecol) {
            $colorcampos = ($keycol == 'c' . $idcampodevengar) ? 230 : 250;
            $pdf->SetFillColor($colorcampos);
            if ($valuecol['idtipocampo'] == 1) {
                $pdf->Cell($ArrayAncho[$keycol]['longitud'], 5, utf8_decode($valuecol['denominacion']), 1, 0, 'C', 0);
                $cantidadColumnasDatosPersona++;
            } else if ($valuecol['idtipocampo'] == 2 || $valuecol['idtipocampo'] == 3 || $valuecol['idtipocampo'] == 4) {// Si los campos son numéricos
                if ($valuecol['vacacionesdiasimporte'] == 0) {
                    if ($ArrayAncho[$keycol]['escampoencabezado'] == 1) {
                        $pdf->Cell($ArrayAncho[$keycol]['longitud'], 5, utf8_decode(substr(($valuecol['denominacion']), 0, 9)), 1, 0, 'C', 1);
                    } else {
                        $camposrestantes.= $valuecol['denominacion'].' ;   ';
                    }
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

        //Campos restantes
        $pdf->SetFont('Arial', '', 6);
        $pdf->Cell($ArrayAncho['longcampospersonas'], 5, '', 0, 0, 'C');
        $pdf->MultiCell($ArrayAncho['longcampossalario'], 5, utf8_decode(trim($camposrestantes,' ;   ')), 0, 'L');
    }
}
