<?php

/**
 * Modelo para hacer el reporte del desglose de billetes
 *
 * @author Ing. Dainier Velazquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Models.
 * @category Clase Modelo.
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class PDFDesgloseBilletes extends fpdf
{
    function Footer()
    {
        $objReportepdfModel = new ReporteDesgloseBilletesModel();
        //Capturando el ancho de la hoja
        $this->Cell(0, 10, ' ' . '', 0, 0, 'R');
        $anchoHoja = $this->GetX();
        $altoHoja = $this->GetY();
        $arrayposicionescolumnas = $objReportepdfModel->fnAjustarTextosEjeX($anchoHoja, 1);

        //235(-100) x 400(-200)
        //Primera fila
        $this->Ln(190 - $altoHoja);
        $this->SetFont('Arial', 'B', 10);

        $this->SetX($arrayposicionescolumnas[0] - 30);
        $this->Write(5, 'ELABORADO POR : ___________________________');
        $this->Ln();

        $this->SetX($arrayposicionescolumnas[0] - 30);
        $this->Write(5, 'REVISADO POR  : _____________________________');
        $this->Ln();

        $this->SetX($arrayposicionescolumnas[0] - 30);
        $this->Write(5, 'APROBADO POR  : ____________________________');
        $this->Ln();

        //Pintando el número de hoja
        $this->SetX($arrayposicionescolumnas[0]);
        $this->Write(10, $this->PageNo());

    }
}

class ReporteDesgloseBilletesModel extends ZendExt_Model
{
    public $identidad;

    public function ReporteDesgloseBilletesModel()
    {
        parent::ZendExt_Model();
    }

    public function fnExportarDesgloseBilletes($identidad, $datospersonas, $tiporeporte)
    {
        $this->identidad = $identidad;
        $nombreentidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad)[0]->denominacion;
        $contNominasCUP = 0;
        $contNominasCUC = 0;
        if ($tiporeporte == 1) {//Desglose de billetes por tipo de nominas
            //Obteniendo la cantidad de nominas por moneda
            foreach ($datospersonas as $i => $arrpersonas) {
                //Denominacion del tipo de nomina
                $tiponomina = NomTipoNomina::obtenerDenominacionNominaXIdElaborarPago($arrpersonas['idelaborarpago']);
                $contNominasCUP += ($tiponomina[0]['tipomoneda'] == '01') ? 1 : 0;
                $contNominasCUC += ($tiponomina[0]['tipomoneda'] == '02') ? 1 : 0;
            }
        } else {//Desglose de billetes por personas
            foreach ($datospersonas as $i => $arrpersonas) {
                foreach ($arrpersonas['personas'] as $p => $persona) {
                    $contNominasCUP += ($persona['importe_n']>0) ? 1 : 0;
                    $contNominasCUC += ($persona['importe_d']>0) ? 1 : 0;
                }
            }
        }
        //Arrays con valores de los billetes y menudos
        $arrnombilletes = NomBilleteModel::obtenerListadoBilletes();
        $arrmonedasCUP = array();//01 CUP
        $arrmonedasCUC = array();//02 CUC
        $contCUP = 0;
        $contCUC = 0;
        foreach ($arrnombilletes as $billete) {
            if ($billete['activo'] != 0) {
                if ($billete['denommoneda'] == 'CUP') {
                    $arrmonedasCUP[$contCUP] = $billete;
                    $contCUP++;
                } elseif ($billete['denommoneda'] == 'CUC') {
                    $arrmonedasCUC[$contCUC] = $billete;
                    $contCUC++;
                }
            }
        }

        //PINTANDO EL *** PDF *******************************************************************************
        $longitudhoja = 280;
//        $pdf = new PDFDesgloseBilletes('L', 'mm', array(235, $longitudhoja)); //235 x 400
        $pdf = new PDFDesgloseBilletes('L', 'mm', 'Letter'); //216(ancho) X 279(alto)
        $pdf->SetDrawColor(100);//Definiendo el color de las letras y lineas
        $pdf->AddPage();

        //PINTANDO EL DESGLOSE DE BILLETES PARA LA MONEDA NACIONAL (CUP)
        if ($contNominasCUP > 0) {
            $this->fnPintarEncabezado($pdf, $longitudhoja, 1, $tiporeporte, $nombreentidad);
            $pdf->SetX(5);
            $pdf->SetFont('Arial', 'B', 14);
            $pdf->Cell(55, 7, 'Desglose de monedas: ', 0, 0, 'L', 0);
            $pdf->SetFont('Arial', '', 14);
            $pdf->Cell(($longitudhoja - 30) / 2, 7, utf8_decode('CUP'), 0, 1, 'L', 0);
            $arrbloqueCUP = $this->fnPintarCuerpoPDF($pdf, $longitudhoja, $identidad, $datospersonas, $arrmonedasCUP, 1, $tiporeporte);
            $longitudceldas = (double)(($longitudhoja - 10) / count($arrmonedasCUP));
            if ($tiporeporte == 1)
                $this->fnPintarTotalGeneralPorTipoMoneda($pdf, $arrbloqueCUP, $longitudhoja, $longitudceldas, 1, $tiporeporte);
        }

        //PINTANDO EL DESGLOSE DE BILLETES PARA LA MONEDA CONVERTIBLE (CUC)
        if ($contNominasCUC > 0) {
            ($contNominasCUP > 0) ? $pdf->AddPage() : '';
            $this->fnPintarEncabezado($pdf, $longitudhoja, 2, $tiporeporte, $nombreentidad);
            $pdf->SetX(5);
            $pdf->SetFont('Arial', 'B', 14);
            $pdf->Cell(55, 7, 'Desglose de monedas: ', 0, 0, 'L', 0);
            $pdf->SetFont('Arial', '', 14);
            $pdf->Cell(($longitudhoja - 30) / 2, 7, utf8_decode('CUC'), 0, 1, 'L', 0);
            $arrbloqueCUC = $this->fnPintarCuerpoPDF($pdf, $longitudhoja, $identidad, $datospersonas, $arrmonedasCUC, 2, $tiporeporte);
            $longitudceldas = (double)(($longitudhoja - 10) / count($arrmonedasCUC));
            if ($tiporeporte == 1)
                $this->fnPintarTotalGeneralPorTipoMoneda($pdf, $arrbloqueCUC, $longitudhoja, $longitudceldas, 2, $tiporeporte);
        }
        //Lanzando el pdf
        $pdf->Output();
    }

    public function fnPintarCuerpoPDF(&$pdf, $longitudhoja, $identidad, $datospersonas, $arrmonedas, $bloque, $tiporeporte)
    {
        $cantcolumnas = count($arrmonedas);
        if ($tiporeporte == 1) {
            $arrcanttotalbilletes = array();
            $longitudceldas = (double)(($longitudhoja - 10) / $cantcolumnas);
            foreach ($datospersonas as $i => $arrpersonas) {
                //Cambio de hoja
                $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

                //Denominacion del tipo de nomina
                $tiponomina = NomTipoNomina::obtenerDenominacionNominaXIdElaborarPago($arrpersonas['idelaborarpago']);

                //Pintando solo las nominas que pertenecen a un mismo tipo de moneda
                if (($bloque == 1 && $tiponomina[0]['tipomoneda'] == '01') || ($bloque == 2 && $tiponomina[0]['tipomoneda'] == '02')) {
                    if (!empty($arrpersonas['personas'])) {
                        $contcanttotal = 0;
                        $importetotaldesglose = 0;
                        $arrcantbilletesdesglose = array();
                        $contdesglose = 0;
                        //Recorriendo el arreglo de personas
                        foreach ($arrpersonas['personas'] as $p => $persona) {
                            $importeadesglozar = ($bloque == 1) ? $persona['importe_n'] : $persona['importe_d'];
                            $arrcantbilletesdesglose [$contdesglose] = $this->fnDesglozarBilletes($importeadesglozar, $arrmonedas);
                            $importetotaldesglose += ($bloque == 1) ? $persona['importe_n'] : $persona['importe_d'];
                            $contdesglose++;
                        }

                        //Pintando el tipo de nomina
                        $pdf->SetFillColor(210);//Definiendo el color de celdas
                        $pdf->SetFont('Arial', 'B', 12);
                        $pdf->SetX(5);
                        $pdf->Cell($longitudhoja - 10, 7, utf8_decode('Nómina: ') . utf8_decode($tiponomina[0]['denominacion']), 1, 1, 'L', 1);
                        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

                        //Pintando la denominacion de los billetes
                        $pdf->SetFont('Arial', 'B', 10);
                        $pdf->SetX(5);
                        $contbilletes = 0;
                        foreach ($arrmonedas as $b => $billetes) {
                            $contbilletes++;
                            $saltolinea = ($contbilletes == count($arrmonedas)) ? 1 : 0;
                            $denominacionbillete = ($billetes['denominacion'] < 1) ? $billetes['denominacion'] : (int)$billetes['denominacion'];
                            ($billetes['denominacion'] < 1) ? $pdf->Cell($longitudceldas, 7, number_format($denominacionbillete, 2, '.', '') . utf8_decode(' ¢ '), 1, $saltolinea, 'C', 0) :
                                $pdf->Cell($longitudceldas, 7, utf8_decode(' $ ') . number_format($denominacionbillete, 2, '.', ''), 1, $saltolinea, 'C', 0);
                        }
                        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

                        //Creando el arreglo de cantidades
                        $arrbilletes = array();
                        $arrmenudo = array();
                        foreach ($arrcantbilletesdesglose as $d => $desglose) {
                            foreach ($desglose[0] as $b => $cantbill) {
                                $arrbilletes[$b] += $cantbill;
                            }

                            foreach ($desglose[1] as $m => $cantmen) {
                                $pos = (double)$m / 100;
                                $arrmenudo['' . $pos] += $cantmen;
                            }

                        }
                        $arrcantidades = array();
                        $contcantidades = 0;
                        foreach ($arrbilletes as $b => $bi) {
                            $arrcantidades[$contcantidades]['moneda'] = $b;
                            $arrcantidades[$contcantidades]['cantidad'] = $bi;
                            $arrcantidades[$contcantidades]['producto'] = (double)((double)$b * $bi);
                            $contcantidades++;
                        }
                        $contcantidades = count($arrcantidades);
                        foreach ($arrmenudo as $m => $me) {
                            $arrcantidades[$contcantidades]['moneda'] = $m;
                            $arrcantidades[$contcantidades]['cantidad'] = $me;
                            $arrcantidades[$contcantidades]['producto'] = (double)((double)$m * $me);
                            $contcantidades++;
                        }
                        //Adicionando las cantidades al arreglo de cantidades totales
                        foreach ($arrcantidades as $c => $can) {
                            $arrcanttotalbilletes[$contcanttotal]['moneda'] = $can['moneda'];
                            $arrcanttotalbilletes[$contcanttotal]['cantidad'] += $can['cantidad'];
                            $arrcanttotalbilletes[$contcanttotal]['producto'] += $can['producto'];
                            $contcanttotal++;
                        }

                        //Pintando la cantidad de  billetes
                        $pdf->SetFont('Arial', '', 10);
                        $pdf->SetX(5);
                        $contbilletes = 0;
                        foreach ($arrcantidades as $cant => $cantidad) {
                            $contbilletes++;
                            $saltolinea = ($contbilletes == count($arrmonedas)) ? 1 : 0;
                            $pdf->Cell($longitudceldas, 5, $cantidad['cantidad'], 1, $saltolinea, 'C', 0);
                        }
                        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

                        //Pintando los subtotales por billetes
                        $pdf->SetFont('Arial', '', 10);
                        $pdf->SetX(5);
                        $contbilletes = 0;
                        foreach ($arrcantidades as $cant => $cantidad) {
                            $contbilletes++;
                            $saltolinea = ($contbilletes == count($arrmonedas)) ? 1 : 0;
                            $pdf->Cell($longitudceldas, 5, number_format($cantidad['producto'], 2, ',', ''), 1, $saltolinea, 'C', 0);
                        }
                        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

                        //Pintando el total por tipo de nomina
                        $pdf->SetFillColor(240);//Definiendo el color de celdas
                        $pdf->SetX(5);
                        $pdf->Cell($longitudhoja - 10, 5, utf8_decode('Total en la nómina ') . '"' . utf8_decode($tiponomina[0]['denominacion']) . '" ' . ':  ' . number_format($importetotaldesglose, 2, ',', ''), 1, 1, 'L', 1);
                        $pdf->Ln(5);
                        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);
                    } else {
                        //Pintando el tipo de nomina
                        $pdf->SetFillColor(210);//Definiendo el color de celdas
                        $pdf->SetFont('Arial', 'B', 12);
                        $pdf->SetX(5);
                        $pdf->Cell($longitudhoja - 10, 7, utf8_decode('Nómina: ') . utf8_decode($tiponomina[0]['denominacion']), 1, 1, 'L', 0);
                        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

                        //Pintando la denominacion de los billetes
                        $pdf->SetFont('Arial', 'B', 10);
                        $pdf->SetX(5);
                        $contbilletes = 0;
                        foreach ($arrmonedas as $b => $billetes) {
                            $contbilletes++;
                            $saltolinea = ($contbilletes == count($arrmonedas)) ? 1 : 0;
                            $pdf->Cell($longitudceldas, 7, $billetes['denominacion'], 1, $saltolinea, 'C', 0);
                        }
                        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

                        //Pintando el total por tipo de nomina
                        $pdf->SetFillColor(240);//Definiendo el color de celdas
                        $pdf->SetX(5);
                        $pdf->Cell($longitudhoja - 10, 5, utf8_decode('Total en la nómina ') . '"' . utf8_decode($tiponomina[0]['denominacion']) . '" ' . ':  ' . number_format(0, 2, ',', ''), 1, 1, 'L', 0);
                        $pdf->Ln(5);
                        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);
                    }
                }
            }
            return $arrcanttotalbilletes;
        } else {
            $longitudceldas = (double)(($longitudhoja - 150) / $cantcolumnas);
            //Campos
            $this->fnPintarCamposPorPersonas($pdf, $arrmonedas, $longitudhoja, $bloque);
            $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte, $arrmonedas);

            $importetotaldesglose = 0;
            $arrcanttotaldesglose = array();
            $no = 0;
            foreach ($datospersonas as $centro) {
                //Pintando solo las nominas que pertenecen a un mismo tipo de moneda
                if (!empty($centro['personas'])) {
                    $arrcantsubtotalcentro = array();
                    $importesubtotalcentro = 0;
                    $pdf->SetFillColor(200);//Definiendo el color de celdas
                    $pdf->SetX(5);
                    $pdf->SetFont('Arial', 'B', 10);
                    $pdf->Cell(($longitudhoja - 10), 5, utf8_decode($centro['centro']), 1, 1, 'L', 1);
                    $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte, $arrmonedas);
                    $pdf->Line(5, $pdf->GetY(), ($longitudhoja - 10), $pdf->GetY()); //Horizontal inicial
                    //Recorriendo el arreglo de personas
                    foreach ($centro['personas'] as $p => $persona) {
                        $no++;
                        $importeadesglozar = ($bloque == 1) ? $persona['importe_n'] : $persona['importe_d'];
                        $arrcantbilletesdesglose [$persona['idpersona']] = $this->fnDesglozarBilletes($importeadesglozar, $arrmonedas);
                        $importesubtotalcentro += $importeadesglozar;

                        //Primera columna
                        $pdf->SetFont('Arial', '', 8);
                        $pdf->SetX(5);
                        $pdf->SetFillColor(245);//Definiendo el color de celdas
                        $pdf->Cell(9, 5, $no, 1, 0, "C", 1);

                        //Segunda columna ------- Codigo contable
                        $cdgocontable = ConfigPersonaCodigoContable::obtenerConfigDadoIdPersona($persona['idpersona'], $identidad);
                        $pdf->Cell(11, 5, $cdgocontable[0]['cdgocontable'], 1, 0, "C");

                        //Tercera columna
                        $pdf->Cell(25, 5, utf8_decode($persona['num_ideper']), 1, 0, "C");

                        //Cuarta columna
                        $pdf->Cell(80, 5, substr(utf8_decode($persona['nombreyapellidos']), 0, 40), 1, 0, "L");
                        //Pintando la denominacion de los billetes
                        foreach ($arrmonedas as $b => $billetes) {
                            $withcolor = ((int)$billetes['denominacion'] < 1) ? 245 : 250;
                            $pdf->SetFillColor($withcolor);//Definiendo el color de celdas de billetes y menudo
                            $valor = ((int)$billetes['denominacion'] < 1) ? $arrcantbilletesdesglose[$persona['idpersona']][1][(int)($billetes['denominacion'] * 100)] :
                                $arrcantbilletesdesglose[$persona['idpersona']][0][(int)$billetes['denominacion']];
                            $pdf->Cell($longitudceldas, 5, $valor, 1, 0, 'C', 1);

                            //Adicionando en el arreglo de subtotales por centro
                            $arrcantsubtotalcentro[$billetes['denominacion'] . ''] += $valor;
                        }
                        $pdf->SetFont('Arial', 'B', 8);
                        $pdf->Cell(15, 5, number_format($importeadesglozar, 2, '.', ''), 1, 1, "C");
                        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte, $arrmonedas);
                    }

                    //***************************Subtotal por centros*********************************
                    $pdf->SetFillColor(200);
                    $pdf->SetFont('Arial', 'B', 8);
                    $pdf->SetX(5);
                    $pdf->Cell(125, 5, 'Subtotal', 1, 0, "C", 1);
                    foreach ($arrcantsubtotalcentro as $i => $subtotal) {
                        $withcolor = ((int)$i < 1) ? 245 : 250;
                        $pdf->SetFillColor($withcolor);//Definiendo el color de celdas de billetes y menudo
                        $pdf->Cell($longitudceldas, 5, $subtotal, 1, 0, "C", 1);
                        $arrcanttotaldesglose[$i] += $subtotal;
                    }
                    $pdf->Cell(15, 5, number_format($importesubtotalcentro, 2, '.', ''), 1, 1, "C", 0);
                    $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte, $arrmonedas);
                    $importetotaldesglose += $importesubtotalcentro;
                }
            }
            //*********************************Total general************************************
            $pdf->SetFillColor(200);
            $pdf->SetFont('Arial', 'B', 8);
            $pdf->Ln(5);
            $pdf->SetX(5);
            $pdf->Cell(125, 5, 'Total', 1, 0, "C", 1);
            foreach ($arrcanttotaldesglose as $t => $total) {
                $withcolor = ((int)$t < 1) ? 245 : 250;
                $pdf->SetFillColor($withcolor);//Definiendo el color de celdas de billetes y menudo
                $pdf->Cell($longitudceldas, 5, $total, 1, 0, "C", 1);
            }
            $pdf->Cell(15, 5, number_format($importetotaldesglose, 2, '.', ''), 1, 1, "C", 0);
        }
        return;
    }

    public function fnPintarEncabezado(&$pdf, $longitudhoja, $bloque, $tiporeporte, $nombreentidad)
    {

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';',  $arrEstruct[0]->logo);
        list(,$extension) = explode('/',  $imagenBase64);
        if(!empty($arrEstruct[0]->logo)){
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }

        //$register = Zend_Registry::getInstance();
        //$direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        //$pdf->Image($direccion, 5, 5, 22, 10);


        //Titulo
        $tituloprincipal = ($tiporeporte == 1) ? "DESGLOSE DE BILLETES POR TIPOS DE NOMINAS" : "DESGLOSE DE BILLETES POR PERSONAS";
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell($longitudhoja, 10, utf8_decode($tituloprincipal), 0, 1, 'C', 0);

        $pdf->SetX(5);
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(24, 7, 'Empresa: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        //Nombre de la empresa
        $nombreempresa = '';
        if($arrEstruct[0]->idconcepto != 3){
            $nombreempresa = utf8_decode(ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($this->identidad)[0]->denominacion);
        }else{
            $nombreempresa = utf8_decode($arrEstruct[0]->denominacion);
        }

        $pdf->Cell(($longitudhoja - 30) / 2, 7, utf8_decode($nombreempresa), 0, 1, 'L', 0);

        $pdf->SetX(5);
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(21, 7, 'Entidad: ', 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 14);
        $pdf->Cell(($longitudhoja - 30) / 2, 7, utf8_decode($nombreentidad), 0, 1, 'L', 0);
    }

    public function fnPintarCamposPorPersonas(&$pdf, $arrmonedas, $longitudhoja, $bloque)
    {
        $cantcolumnas = count($arrmonedas);
        //$longitudceldas = (double)(($longitudhoja - 10 - 10 - 150 - 20) / $cantcolumnas);
        $longitudceldas = (double)(($longitudhoja - 150) / $cantcolumnas);
        //Encabezado del tipo de moneda
        $pdf->SetX(5);
        $pdf->SetFont('Arial', 'B', 10);
        //Primera columna
        $pdf->Cell(9, 5, "", "R,L,T", 0, "C");
        //Segunda columna
        $pdf->Cell(11, 5, "", "R,L,T", 0, "C");
        //Tercera columna
        $pdf->Cell(25, 5, "", "R,L,T", 0, "C");
        //Cuarta columna
        $pdf->Cell(80, 5, "", "R,L,T", 0, "C");

        //Pintando la columna billetes y menudo
        $longitudceldasbill = 0;
        $longitudceldasmen = 0;
        foreach ($arrmonedas as $b => $billetes) {
            $denominacionbillete = ($billetes['denominacion'] < 1) ? $billetes['denominacion'] : (int)$billetes['denominacion'];
            $withcolor = ($billetes['denominacion'] < 1) ? 245 : 250;
            $pdf->SetFillColor($withcolor);//Definiendo el color de celdas de billetes y menudo
            ($billetes['denominacion'] < 1) ? $longitudceldasmen += $longitudceldas : $longitudceldasbill += $longitudceldas;
        }
        $pdf->Cell($longitudceldasbill, 5, 'Billetes', 1, 0, 'C', 0);
        $pdf->Cell($longitudceldasmen, 5, 'Menudo', 1, 0, 'C', 1);
        $pdf->Cell(15, 5, "", "R,L,T", 1, "C");

        $pdf->SetX(5);
        $pdf->SetFont('Arial', 'B', 10);
        //Primera columna
        $pdf->Cell(9, 5, "No.", "R,L,B", 0, "C");
        //Segunda columna
        $pdf->Cell(11, 5, "Cod.", "R,L,B", 0, "C");
        //Tercera columna
        $pdf->Cell(25, 5, "CI", "R,L,B", 0, "C");
        //Cuarta columna
        $pdf->Cell(80, 5, "Nombre y apellidos", "R,L,B", 0, "C");
        //Pintando las denominaciones de billetes
        foreach ($arrmonedas as $b => $billetes) {
            $denominacionbillete = ($billetes['denominacion'] < 1) ? $billetes['denominacion'] : (int)$billetes['denominacion'];
            $withcolor = ($billetes['denominacion'] < 1) ? 245 : 250;
            $pdf->SetFillColor($withcolor);
            ($billetes['denominacion'] < 1) ? $pdf->Cell($longitudceldas, 5, $denominacionbillete, 1, 0, 'C', 1) :
                $pdf->Cell($longitudceldas, 5, $denominacionbillete, 1, 0, 'C', 1);

            /*($billetes['denominacion'] < 1) ? $pdf->Cell($longitudceldas, 5, number_format($denominacionbillete, 2, '.', ''), 1, 0, 'C', 1) :
                $pdf->Cell($longitudceldas, 5, number_format($denominacionbillete, 2, '.', ''), 1, 0, 'C', 1);*/
        }
        $pdf->Cell(15, 5, "T", "R,L,B", 1, "C");
    }

    public function fnAdicionarPagina(&$pdf, $longitudhoja, $bloque, $tiporeporte, $arrmonedas = null, $nombreentidad = null)
    {
        //Cambio de hoja
        $y = $pdf->GetY();
        if ($y >= '180') {
            $pdf->AddPage();
            if ($tiporeporte == 1)
                $this->fnPintarEncabezado($pdf, $longitudhoja, $bloque, $tiporeporte, $nombreentidad);
            else
                $this->fnPintarCamposPorPersonas($pdf, $arrmonedas, $longitudhoja, $bloque);
        }
    }

    public function fnPintarTotalGeneralPorTipoMoneda(&$pdf, $arrbloque, $longitudhoja, $longitudceldas, $bloque, $tiporeporte)
    {
        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);
        $importetotaldesglose = 0;

        //PINTANDO SEPARADOR DE DESGLOSE TOTAL
        $pdf->SetFont('Arial', 'B', 5);
        $pdf->Line(5, $pdf->GetY(), ($longitudhoja - 5), $pdf->GetY());
        $pdf->Ln(1);
        $pdf->Line(5, $pdf->GetY(), ($longitudhoja - 5), $pdf->GetY());
        $pdf->Ln(1);
        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

//        //Pintando el tipo de nomina
//        $pdf->SetFillColor(200);//Definiendo el color de celdas
//        $pdf->SetFont('Arial', 'B', 18);
//        $pdf->SetX(5);
//        $pdf->Cell($longitudhoja - 10, 10, utf8_decode('Total: '), 1, 0, 'L', 1);
//        $pdf->Ln(10);
//        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque);

        //Pintando la denominacion de los billetes
        $pdf->SetFillColor(230);//Definiendo el color de celdas
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetX(5);
        $contbilletes = 0;
        foreach ($arrbloque as $t => $total) {
            $contbilletes++;
            $saltolinea = ($contbilletes == count($arrbloque)) ? 1 : 0;
            $importetotaldesglose += $total['producto'];
            ($total['moneda'] < 1) ? $pdf->Cell($longitudceldas, 7, number_format($total['moneda'], 2, '.', '') . utf8_decode(' ¢ '), 1, $saltolinea, 'C', 1) :
                $pdf->Cell($longitudceldas, 7, utf8_decode(' $ ') . number_format($total['moneda'], 2, '.', ''), 1, $saltolinea, 'C', 1);
        }
        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

        //Pintando la cantidad de  billetes
        $pdf->SetFillColor(230);//Definiendo el color de celdas
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetX(5);
        $contbilletes = 0;
        foreach ($arrbloque as $t => $total) {
            $contbilletes++;
            $saltolinea = ($contbilletes == count($arrbloque)) ? 1 : 0;
            $pdf->Cell($longitudceldas, 5, $total['cantidad'], 1, $saltolinea, 'C', 1);
        }
        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

        //Pintando los subtotales por billetes
        $pdf->SetFillColor(230);//Definiendo el color de celdas
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetX(5);
        $contbilletes = 0;
        foreach ($arrbloque as $t => $total) {
            $contbilletes++;
            $saltolinea = ($contbilletes == count($arrbloque)) ? 1 : 0;
            $pdf->Cell($longitudceldas, 5, number_format($total['producto'], 2, ',', ''), 1, $saltolinea, 'C', 1);
        }
        $this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);

        //Pintando el total por tipo de nomina
        $pdf->SetFillColor(230);//Definiendo el color de celdas
        $pdf->SetFont('Arial', 'B', 10);
        $pdf->SetX(5);
        $pdf->Cell($longitudhoja - 10, 5, ($bloque == 1 ? 'Total en CUP: ' : 'Total en CUC: ') . number_format($importetotaldesglose, 2, ',', ''), 1, 1, 'L', 1);
        //$this->fnAdicionarPagina($pdf, $longitudhoja, $bloque, $tiporeporte);
    }

    public function fnDesglozarBilletes($importeadesglozar, $arrnombilletes)
    {
        $arrayfinal = array();
        $importetotal = (strlen(explode('.', $importeadesglozar)[1]) == 1) ? ($importeadesglozar . "0") : $importeadesglozar;
        $array_valor_menudos = array();
        $array_valor_billetes = array();
        $contmenudo = 0;
        $contbilletes = 0;
        foreach ($arrnombilletes as $billete) {
            $nuevobillete = (float)$billete['denominacion'];
            if ($nuevobillete < 1) {
                $array_valor_menudos[$contmenudo] = $nuevobillete * 100;
                $contmenudo++;
            } else {
                $array_valor_billetes[$contbilletes] = $nuevobillete;
                $contbilletes++;
            }
        }

        //LLenando el arreglo de billetes
        $importebillete = explode('.', $importetotal)[0];
        $arraybilletes = array();
        foreach ($array_valor_billetes as $b => $billete) {
            //Cantidad de BILLETES
            $cant_billetes = ($importebillete >= $billete) ? intval($importebillete / $billete) : 0;
            $importebillete = ($importebillete != $billete) ? (($importebillete > $billete) ? ($importebillete % $billete) : $importebillete) : 0;
            $arraybilletes[$billete] += $cant_billetes;
        }

        //LLenando el arreglo de menudo
        $importemenudo = intval((strlen(explode('.', $importetotal)[1]) == 1) ? (explode('.', $importetotal)[1] . "0") : (explode('.', $importetotal)[1]));
        $arraymenudo = array();
        foreach ($array_valor_menudos as $m => $menudo) {
            //Cantidad de MENUDO
            $cant_menudos = ($importemenudo >= $menudo) ? intval($importemenudo / $menudo) : 0;
            $importemenudo = ($importemenudo != $menudo) ? (($importemenudo > $menudo) ? ($importemenudo % $menudo) : $importemenudo) : 0;
            $arraymenudo[$menudo] += $cant_menudos;

        }
        $arrayfinal[0] = $arraybilletes;
        $arrayfinal[1] = $arraymenudo;
        return $arrayfinal;
    }

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

    public function fnCentrarTexto($longitudhoja, $longitudcadena)
    {
        return ($longitudhoja - $longitudcadena) / 2;
    }

    public function fnValidarReporte($identidad, $datospersonas)
    {
        $contNominasCUP = 0;
        $contNominasCUC = 0;
        //Obteniendo la cantidad de nominas por moneda
        foreach ($datospersonas as $i => $arrpersonas) {
            //Denominacion del tipo de nomina
            $tiponomina = NomTipoNomina::obtenerDenominacionNominaXIdElaborarPago($arrpersonas['idelaborarpago']);
            $contNominasCUP += ($tiponomina[0]['tipomoneda'] == '01') ? 1 : 0;
            $contNominasCUC += ($tiponomina[0]['tipomoneda'] == '02') ? 1 : 0;
        }

        //Arrays con valores de los billetes y menudos
        $arrnombilletes = NomBilleteModel::obtenerListadoBilletes();

        //01 CUP
        $contCUP = 0;
        $contActivasCUP = 0;

        //02 CUC
        $contCUC = 0;
        $contActivasCUC = 0;
        foreach ($arrnombilletes as $billete) {
            //CUP
            $contCUP += ($billete['denommoneda'] == 'CUP') ? 1 : 0;
            $contActivasCUP += ($billete['denommoneda'] == 'CUP' && $billete['activo'] == 1) ? 1 : 0;

            //CUC
            $contCUC += ($billete['denommoneda'] == 'CUC') ? 1 : 0;
            $contActivasCUC += ($billete['denommoneda'] == 'CUC' && $billete['activo'] == 1) ? 1 : 0;
        }

        //CUP
        //No hay configuradas monedas CUP para las nominas seleccionadas
        if ($contNominasCUP > 0 && $contCUP == 0) {
            return 2;
        }

        //No hay billetes activos CUP para las nominas seleccionadas
        if ($contActivasCUP == 0) {
            return 3;
        }

        //CUC
        //No hay configuradas monedas CUC para las nominas seleccionadas
        if ($contNominasCUC > 0 && $contCUC == 0) {
            return 4;
        }

        //No hay billetes activos CUC para las nominas seleccionadas
        if ($contActivasCUC == 0) {
            return 5;
        }

        return 1;
    }
}

