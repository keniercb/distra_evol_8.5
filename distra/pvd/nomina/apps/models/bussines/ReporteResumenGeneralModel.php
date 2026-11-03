<?php

/**
 * Modelo para hacer el reporte del resumen general
 *
 * @author Ing. Dainier Velazquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Models.
 * @category Clase Modelo.
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class PDFResumenGeneralModel extends fpdf
{
    function Footer()
    {
        $objReportepdfModel = new ReporteResumenGeneralModel();
        //Capturando el ancho de la hoja
        $this->Cell(0, 10, ' ' . '', 0, 0, 'R');
        $anchoHoja = $objReportepdfModel->longitudhoja;
        $altoHoja = $this->GetY();

        //Primera fila
        $this->Ln(240 - $altoHoja);
        $this->SetFont('Arial', '', $objReportepdfModel->tamannoletra - 1);
        $this->SetX($objReportepdfModel->margenizq);
        $this->Cell($anchoHoja, 10, 'ELABORADO POR : ________________________________________________________________________', 0, 1, "L", 0);
        $this->SetX($objReportepdfModel->margenizq);
        $this->Cell($anchoHoja, 10, 'REVISADO POR  : __________________________________________________________________________', 0, 1, "L", 0);
        $this->SetX($objReportepdfModel->margenizq);
        $this->Cell($anchoHoja, 10, 'APROBADO POR  : _________________________________________________________________________', 0, 1, "L", 0);
        $this->SetX(0);
        $this->Cell($anchoHoja, 10, $this->PageNo(), 0, 1, "C", 0);
    }
}

class ReporteResumenGeneralModel extends ZendExt_Model
{
    public $pdf, $identidad, $arridelaborarpagos, $datospersonas, $datospersonascajero, $estado;
    public $tamannoletra = 12;
    public $margenizq = 10;
    public $margender = 20;
    public $longitudhoja = 216;

    public function ReporteResumenGeneralModel()
    {
        parent::ZendExt_Model();
    }

    //Funcionalidad para exportar el reporte de los asm
    public function exportarResumenGeneral($identidad, $arridelaborarpagos, $datospersonas, $datospersonascajero, $estado)
    {
        $this->identidad = $identidad;
        $this->arridelaborarpagos = $arridelaborarpagos;
        $this->datospersonas = $datospersonas;
        $this->datospersonascajero = $datospersonascajero;
        $this->estado = $estado;
        $sumatotalCUP = 0;
        $cantpersonasCUP = array();
        $sumatotalCUC = 0;
        $cantpersonasCUC = array();
        $arrayfinal = array();
        $cont = 0;
        foreach ($datospersonas as $i => $arrpersonas) {
            $importenominaCUP = 0;
            $importenominaCUC = 0;
            //Recorriendo el arreglo de personas por caja
            foreach ($arrpersonas as $p => $persona) {
                if(!$this->existePersona($arrayfinal, $persona['idpersona'], $persona['importe_d'], $persona['importe_n'])){
                    $arrayfinal[$cont]['idpersona'] = $persona['idpersona'];
                    $arrayfinal[$cont]['importe_n'] = $persona['importe_n'];
                    $arrayfinal[$cont]['importe_d'] = $persona['importe_d'];
                    $importenominaCUP += $persona['importe_n'];
                    $importenominaCUC += $persona['importe_d'];
                    if ($persona['importe_n'] > 0)
                        $cantpersonasCUP[$persona['idpersona']] = $persona['idpersona'];
                    if ($persona['importe_d'] > 0)
                        $cantpersonasCUC[$persona['idpersona']] = $persona['idpersona'];
                    $cont++;
                }
            }
            $sumatotalCUP += $importenominaCUP;
            $sumatotalCUC += $importenominaCUC;
        }
        $cantpersonascajaCUP = count($cantpersonasCUP);
        $cantpersonascajaCUC = count($cantpersonasCUC);
        foreach ($datospersonascajero as $i => $arrpersonas) {
            $importenominaCUP = 0;
            $importenominaCUC = 0;
            //Recorriendo el arreglo de personas por cajero
            foreach ($arrpersonas as $p => $persona) {
                $importenominaCUP += $persona['importe_n'];
                $importenominaCUC += $persona['importe_d'];
                if (!empty($persona['cta_mnac']) && $persona['importe_n'] > 0)
                    $cantpersonasCUP[$persona['idpersona']] = $persona['idpersona'];
                if (!empty($persona['cta_mlc']) && $persona['importe_d'] > 0)
                    $cantpersonasCUC[$persona['idpersona']] = $persona['idpersona'];
            }
            $sumatotalCUP += $importenominaCUP;
            $sumatotalCUC += $importenominaCUC;
        }

        //Creando el PDF
        $this->pdf = new PDFResumenGeneralModel('P', 'mm', 'letter');
        $this->pdf->AddPage();

        //Pintando el encabezado
        $this->fnEncabezado();

        //Dibujando el resumen de Moneda Nacional (CUP)
        $this->fnDesgloseMontosXTiposPago('01', $sumatotalCUP, count($cantpersonasCUP), $cantpersonascajaCUP, $identidad);
        $this->pdf->Ln(10);

        //Dibujando el resumen de Moneda Convertible (CUC)
        $this->fnDesgloseMontosXTiposPago('02', $sumatotalCUC, count($cantpersonasCUC), $cantpersonascajaCUC, $identidad);
        $this->pdf->Output();
    }

    private function existePersona($arraypersonas, $idpersona, $importe_d, $importe_n) {
        foreach ($arraypersonas as $persona) {
            if($persona['idpersona'] == $idpersona && $persona['importe_d'] == $importe_d && $persona['importe_n'] == $importe_n) {
                return true;
            }
        }
        return false;
    }

    public function fnEncabezado()
    {
        //Denominacion del reporte
        $this->pdf->SetFont('Arial', 'B', $this->tamannoletra + 2);
        $this->pdf->Cell($this->longitudhoja, 10, utf8_decode("RESUMEN GENERAL DE NÓMINAS"), 0, 1, 'C', 0);
        //Nombre de la empresa
        //$nombreempresa = utf8_decode(ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($this->identidad)[0]->denominacion);

        //Nombre de la entidad
        $datosentidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        //Logo de la entidad
        $logo = '';
        if($datosentidad[0]->idconcepto != 3){
            $logo = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($this->identidad)[0]->logo;
            $logo = (!empty($logo)) ? $logo : $datosentidad[0]->logo;
        }else{
            $logo = $datosentidad[0]->logo;
        }
        list($imagenBase64,) = explode(';', $logo);
        list(, $extension) = explode('/', $imagenBase64);
        if (!empty($logo))
            $this->pdf->Image($logo, $this->margenizq, $this->margenizq / 2, 20, 10, $extension);

        //Empresa
        /*$this->pdf->SetX($this->margenizq);
        $this->pdf->SetFont('Arial', 'B', $this->tamannoletra);
        $empresa = "Empresa : ";
        $this->pdf->Cell($this->pdf->GetStringWidth($empresa) + 2, 10, $empresa, 1, 0, 'L', 0);
        $this->pdf->SetFont('Arial', '', $this->tamannoletra);
        $this->pdf->Cell($this->longitudhoja / 3, 10, $nombreempresa, 1, 1, 'L', 0, 0);*/

        //Entidad
        $this->pdf->SetX($this->margenizq);
        $this->pdf->SetFont('Arial', 'B', $this->tamannoletra);
        $entidad = "Entidad : ";
        $longentidad = $this->pdf->GetStringWidth($entidad) + 2;
        $this->pdf->Cell($longentidad, 5, $entidad, 0, 0, 'L', 0);
        $this->pdf->SetFont('Arial', '', $this->tamannoletra);
        $this->pdf->Cell($this->longitudhoja / 2 - $longentidad, 5, utf8_decode($datosentidad[0]->denominacion), 0, 1, 'L', 0, 0);

        //Código
        $this->pdf->SetX($this->margenizq);
        $this->pdf->SetFont('Arial', 'B', $this->tamannoletra);
        $codigo = "Código : ";
        $longcodigo = $this->pdf->GetStringWidth($codigo) + 2;
        $this->pdf->Cell($longcodigo, 10, utf8_decode($codigo), 0, 0, 'L', 0);
        $this->pdf->SetFont('Arial', '', $this->tamannoletra);
        $this->pdf->Cell($this->longitudhoja / 2 - $longcodigo, 10, utf8_decode($datosentidad[0]->codigo), 0, 1, 'L', 0, 0);
    }

    public function fnDesgloseMontosXTiposPago($moneda/*cup(01), cuc(02)*/, $sumatotalmoneda, $cantpersonas, $cantpersonascaja, $identidad)
    {
        //Obteniendo todos los tipos de pagos
        $campo = ($moneda == '01') ? 'importe_n' : 'importe_d';
        $arrtiponominas = array();
        $mayordenom = 0;
        $totalbruto = 0.00;
        foreach ($this->arridelaborarpagos as $idelaborarpagos) {
            $sumatotaltipopago = 0;
            $tiponomina = NomTipoNomina::obtenerDenominacionNominaXIdElaborarPago($idelaborarpagos);



            $arrayDatNomina = DatNomina::getNominasAprobadasCertificadas($idelaborarpagos, $identidad);

            if (count($arrayDatNomina) > 0) {

                //ARRAY DE CONCEPTOS CONTABLES
                $arrayconceptoscontables = ConfigConceptosContables::obtenerListadoTodosConfigConceptosContablesEntidad($tiponomina[0]['idtiponomina'], $identidad);
                $contccont = 0;
                if (count($arrayconceptoscontables) > 0) {
                    foreach ($arrayconceptoscontables as $iccont => $rccont) {
                        $arraydatosccont[$contccont]['denominacion'] = $rccont['denominacion'];
                        $arraydatosccont[$contccont]['idconceptoscontables'] = $rccont['idconceptoscontables'];
                        $arraydatosccont[$contccont]['idestructuramodelodomina'] = $rccont['idestructuramodelodomina'];
                        $arraydatosccont[$contccont]['importeconceptocontable'] = number_format(0, 2, '.', '');
                        $contccont++;
                    }

                    foreach ($arrayDatNomina as $i => $v) {

                        $datosnomina = DatNominaDatos::obtenerDatosNomina($v['idnomina']);
                        //RECORRIENDO LOS DATOS DE LAS NOMINAS
                        foreach ($datosnomina as $cd => $rdat) {
                            $valores = unserialize($rdat['valores']);
                            //RECORRIENDO LAS PERSONAS
                            foreach ($valores as $ip => $rp) {
                                //OBTENIENDO EL TOTAL DE LOS CONCEPTOS CONTABLES
                                foreach ($arraydatosccont as $iccf => $rccf) {
                                    $idestructurarmodelo = $rccf['idestructuramodelodomina'];
                                    $importeconccontable = $rp["c$idestructurarmodelo"];
                                    $importefinal = number_format($rccf['importeconceptocontable'], 2, '.', '') + number_format($importeconccontable, 2, '.', '');
                                    $arraydatosccont[$iccf]['importeconceptocontable'] = number_format($importefinal, 2, '.', '');
    
                                }
                            }
                        }
                    }

                    foreach ($arraydatosccont as $key => $v) {      
                        $denominacion = explode('-', $v['denominacion']);    
                        $denom = $denominacion[0];
                        $letras = str_split($denom);

                        if ($letras[0] == 'T' && $letras[1] == 'B' && $letras[2] == 'D') {
                            $tbd = $v['importeconceptocontable'];
                        } //else {
                            //$tbd = '0.00';
                        //}
                    }
                }

            }



           
            foreach ($this->datospersonas as $i => $arrpersonas) {
                $importe = 0;
                //Recorriendo el arreglo de personas por caja
                foreach ($arrpersonas as $p => $persona) {
                    $importe += ($i == $idelaborarpagos) ? $persona[$campo] : 0;
                }
                $sumatotaltipopago += $importe;
            }

            foreach ($this->datospersonascajero as $i => $arrpersonas) {
                $importe = 0;
                //Recorriendo el arreglo de personas por cajero
                foreach ($arrpersonas as $p => $persona) {
                    $importe += ($i == $idelaborarpagos) ? $persona[$campo] : 0;
                }
                $sumatotaltipopago += $importe;
            }

            $arrtiponominas[$tiponomina[0]['idtiponomina']]['denominacion'] = $tiponomina[0]['denominacion'];
            $arrtiponominas[$tiponomina[0]['idtiponomina']]['tipomoneda'] = $tiponomina[0]['tipomoneda'];
            $arrtiponominas[$tiponomina[0]['idtiponomina']]['suma'] += $sumatotaltipopago;
            $arrtiponominas[$tiponomina[0]['idtiponomina']]['totalbruto'] += $totalbruto;

            $longtiponomina = $this->pdf->GetStringWidth($tiponomina[0]['denominacion']);
            if ($longtiponomina > $mayordenom)
                $mayordenom = $longtiponomina;
        }
        $mayordenom += 2;

        //Dibujando el resumen por monedas falta un dato
        $this->pdf->SetFillColor(210);//Definiendo el color de celdas
        $this->pdf->SetFont('Arial', 'B', $this->tamannoletra);
        $this->pdf->SetX($this->margenizq);
        $this->pdf->Cell($mayordenom, 7, "TOTAL " . ($moneda == 1 ? "CUP" : "CUC"), 0, 0, "L", 1);
        $this->pdf->Cell($this->longitudhoja - $mayordenom - $this->margender - 70, 7, number_format($sumatotalmoneda, 2, ',', ''), 0, 0, "R", 1);
        $this->pdf->Cell(70, 7,"TBD", 0, 1, "R", 1);
        foreach ($arrtiponominas as $tiponomina) {
            if ($tiponomina['tipomoneda'] == $moneda) {
                $this->pdf->SetFont('Arial', '', $this->tamannoletra);
                $this->pdf->SetX($this->margenizq);
                $this->pdf->Cell($mayordenom, 10, utf8_decode($tiponomina['denominacion']), 0, 0, "L", 0);
                $this->pdf->Cell($this->longitudhoja - $mayordenom - $this->margender - 70, 10, number_format($tiponomina['suma'], 2, ',', ''), 0, 0, "R", 0);
                $this->pdf->Cell(70, 10, utf8_decode($tiponomina['totalbruto']), 0, 1, "R", 0);

                $y = $this->pdf->GetY();
                if ($y >= 220) {
                    $this->pdf->AddPage();
                }
            }
        }

        //Cantidad de personas por moneda
        $this->pdf->SetFillColor(245);//Definiendo el color de celdas
        $this->pdf->SetFont('Arial', 'B', $this->tamannoletra);
        $long = $this->pdf->GetStringWidth("Cantidad personas") + 5;
        $this->pdf->Cell($long, 7, "Cantidad personas", 0, 0, "L", 1);
        /*$this->pdf->SetFont('Arial', '', $this->tamannoletra - 3);
        $y = $this->pdf->GetY();
        $this->pdf->Cell($this->pdf->GetStringWidth("Cajero") + 2, 7 / 2, "Caja", 0, 2, "L", 1);
        $this->pdf->Cell($this->pdf->GetStringWidth("Cajero") + 2, 7 / 2, "Cajero", 0, 0, "L", 1);
        $long += $this->margenizq + $this->pdf->GetStringWidth("Cajero") + 2;
        $this->pdf->SetY($y);
        $this->pdf->SetX($long);
        $this->pdf->SetFont('Arial', 'B', $this->tamannoletra - 3);
        $this->pdf->Cell(20, 7 / 2, $cantpersonascaja, 0, 2, "R", 1);
        $this->pdf->Cell(20, 7 / 2, ($cantpersonas - $cantpersonascaja), 0, 0, "R", 1);
        $long += 20;
        $this->pdf->SetY($y);
        $this->pdf->SetX($long);*/
        $this->pdf->SetFont('Arial', 'B', $this->tamannoletra);
        $this->pdf->Cell($this->longitudhoja - $this->margender - $long, 7, number_format($cantpersonas, 0, ',', ''), 0, 1, "R", 1);


    }
}

