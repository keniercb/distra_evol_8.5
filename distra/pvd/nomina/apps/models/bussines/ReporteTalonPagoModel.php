<?php

/**
 * @author Ing. Dainier Valazquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class PdfTalonPago extends fpdf
{
    function Footer()
    {
    }
}

class ReporteTalonPagoModel extends ZendExt_Model
{
    //Variables de configuracion del PDF
    private $longituhoja = 279;
    private $tamannofuente = 8;
    private $bordervalordenom = 'T,L,B';
    private $bordervalorcelda = 'T,R,B';
    /*private $bordervalordenom = 0;
    private $bordervalorcelda = 0;*/

    /*private $bordervalordenompers = 'T,L,B';
    private $bordervalorceldapers =  'T,L,B';*/
    private $bordervalordenompers = 0;
    private $bordervalorceldapers = 0;
    private $cantcolumnaspersonas = 4;
    private $cantcolumnassalario = 6;
    private $altocelda = 5;
    private $margenizquierdo = 1;

    //Variables globales de datos
    private $identidad = null;
    private $personas = null;
    private $columnas = null;
    private $arrcamposdevengar = null;
    private $idelaborarpagos = array();
    private $mostrardesglose = null;

    public function ReporteTalonPagoModel()
    {
        parent::ZendExt_Model();
    }

    public function fnExportarReporte($identidad, $personas, $columnas, $idelaborarpagos, $mostrardesglose)
    {
        $this->identidad = $identidad;
        $this->personas = $personas;
        $this->arrcamposdevengar = ConfigEstructurarModelosNomina::obtenerCampoADevengarTalonario($idelaborarpagos, 1);
        $this->columnas = $columnas;
        $this->idelaborarpagos = $idelaborarpagos;
        $this->mostrardesglose = $mostrardesglose;
        $pdf = new PdfTalonPago('l', 'mm', 'Letter');//279mm x 216mm
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', $this->tamannofuente);//El GetStringWith no funciona si no tiene una fuente definida
        $this->fnCrearCuerpo($pdf);
        $pdf->Output();
    }

    private function fnCrearCuerpo(&$pdf)
    {
        $pdf->SetFillColor(230);
        $pdf->SetY(2);
        //Arrays con valores de los billetes
        $arrnombilletes = NomBilleteModel::obtenerListadoBilletes();
        $arrmonedasCUP = array();//01 CUP
        $contCUP = 0;
        foreach ($arrnombilletes as $billete) {
            if ($billete['activo'] != 0) {
                if ($billete['denommoneda'] == 'CUP') {
                    $arrmonedasCUP[$contCUP] = $billete;
                    $contCUP++;
                }
            }
        }

        foreach ($this->personas as $p => &$persona) {
            $pdf->SetX($this->margenizquierdo);
            //Campo concepto pago de salario total(neto total a pagar)**************************************************
            $sumatotalneto = 0;
            foreach ($persona as $c => $campo) {
                //Sumando todos los conceptos de pago de salario(Neto)
                foreach ($this->arrcamposdevengar as $campodev) {
                    if ($c == 'c' . $campodev['idestructuramodelodomina']) {
                        $sumatotalneto += $campo;
                    }
                }
            }
            $persona['salario'] = $sumatotalneto;
            $longreal = 0;
            foreach ($persona as $c => $campo) {
                if ($this->columnas[$c]['idtipocampo'] == 1) {
                    $pdf->SetFont('Arial', 'B', $this->tamannofuente);
                    $longdenominacioncampo = $pdf->GetStringWidth(utf8_decode($this->columnas[$c]['denominacion']) . ': ');
                    $pdf->SetFont('Arial', '', $this->tamannofuente);
                    $longvalorcampo = $pdf->GetStringWidth(utf8_decode($campo));
                    $longreal += $longdenominacioncampo + $longvalorcampo;
                }
            }

            //Campos personales y  salario total************************************************************************
            foreach ($persona as $c => $campo) {
                if ($this->columnas[$c]['idtipocampo'] == 1) {
                    if ($this->columnas[$c]['escampopersona'] == 'salario') {
                        $fillcolor = 1;
                        $greencolor = 130;
                    } else {
                        $fillcolor = 0;
                        $greencolor = 0;
                    }

                    //Pintando la denominacion del campo
                    $pdf->SetFont('Arial', 'B', $this->tamannofuente);
                    $longdenominacioncampo = $pdf->GetStringWidth(utf8_decode($this->columnas[$c]['denominacion']) . ': ');
                    $pdf->Cell($longdenominacioncampo, $this->altocelda, utf8_decode($this->columnas[$c]['denominacion'] . ': '), $this->bordervalordenompers, 0, 'L', $fillcolor);

                    //Pintando el valor del campo
                    $pdf->SetTextColor(0, $greencolor, 0);
                    $pdf->SetFont('Arial', '', $this->tamannofuente);
                    $longvalorcampo = $pdf->GetStringWidth(utf8_decode($campo));
                    $longvalorcampo = ($longvalorcampo + ($this->longituhoja - $longreal - 2) / $this->cantcolumnaspersonas);
                    $pdf->Cell($longvalorcampo, $this->altocelda, utf8_decode($campo), $this->bordervalorceldapers, 0, 'L', $fillcolor);
                    $pdf->SetTextColor(0, 0, 0);
                }
            }
            $pdf->Cell(0.01, $this->altocelda, '', 0, 1);

            //Campos salariales*****************************************************************************************
            $longitudestandarcampos = ($this->longituhoja / $this->cantcolumnassalario) - ($this->margenizquierdo / $this->cantcolumnassalario);
            $cantcampos = 0;
            $pdf->SetX($this->margenizquierdo);
            foreach ($persona as $c => $campo) {
                $valorcampo = (is_numeric($campo) && $this->columnas[$c]['idtipocampo'] != 1) ? number_format($campo, 2, ',', '') : $campo;
                if ($valorcampo > 0) {
                    if ($this->columnas[$c]['idtipocampo'] != 1) {//0,2,3 ó 4
                        $cantcampos++;

                        if ($cantcampos % $this->cantcolumnassalario == 0 && $cantcampos) {
                            $saltolinea = 1;
                        } else {
                            $saltolinea = 0;
                        }
                        //Pintando la denominacion del campo
                        $fillcolor = 0;
                        $pdf->SetFont('Arial', 'B', $this->tamannofuente);
                        $x1 = $pdf->GetX();
                        $longdenominacioncampo = $pdf->GetStringWidth(utf8_decode($this->columnas[$c]['denominacion']) . ': ');
                        $pdf->Cell($longdenominacioncampo, $this->altocelda + 2, utf8_decode($this->columnas[$c]['denominacion'] . ': '), $this->bordervalordenom, 0, 'L', $fillcolor);

                        //Pintando el tipo de nomina
                        $tiponomina = $this->columnas[$c]['tiponomina'];
                        if (!empty($tiponomina)) {
                            $pdf->SetFont('Arial', '', $this->tamannofuente - 2);
                            $pdf->Text($x1 + 1, $pdf->GetY() + $this->altocelda + 1.5, '(' . utf8_decode($this->columnas[$c]['tiponomina']) . ')');
                        }

                        //Pintando el valor del campo
                        $pdf->SetFont('Arial', '', $this->tamannofuente);
                        $longval = $longitudestandarcampos - $longdenominacioncampo - ($this->margenizquierdo / $this->cantcolumnassalario);
                        $pdf->Cell($longval, $this->altocelda + 2, utf8_decode($valorcampo), $this->bordervalorcelda, $saltolinea, 'R', $fillcolor);
                    }
                }
                if ($saltolinea == 1)
                    $pdf->SetX($this->margenizquierdo);
            }

            //Mostrar el Desglose de billetes***************************************************************************
            if ($this->mostrardesglose == 1) {
                if (!empty($idcampodevengar)) {
                    $pdf->Cell(0.1, 1, '', 0, 1);
                    $importeadesglozar = $persona['c' . $idcampodevengar];
                    $desglosebilletes = $this->fnDesglozarBilletes($arrmonedasCUP, $importeadesglozar);

                    //Pintando la denominacion de los billetes
                    foreach ($arrmonedasCUP as $b => $billetes) {
                        $color = ((int)$billetes['denominacion'] < 1) ? 230 : 250;
                        $pdf->SetFillColor($color);//Definiendo el color de celdas de billetes y menudo
                        $denominacion = ((int)$billetes['denominacion'] < 1)
                            ? number_format((int)($billetes['denominacion'] * 100), 0, ',', '') . utf8_decode('¢')
                            : utf8_decode('$') . number_format((int)($billetes['denominacion']), 0, ',', '');
                        $pdf->SetFont('Arial', 'B', $this->tamannofuente);
                        $pdf->Cell(12, $this->altocelda, $denominacion, 1, 0, 'C', 1);
                    }
                    $pdf->Cell(0.1, 1, '', 0, 1);
                    //Pintando el valor de los billetes
                    foreach ($arrmonedasCUP as $b => $billetes) {
                        $color = ((int)$billetes['denominacion'] < 1) ? 230 : 250;
                        $pdf->SetFillColor($color);//Definiendo el color de celdas de billetes y menudo
                        $pdf->SetFont('Arial', '', $this->tamannofuente);
                        $valor = ((int)$billetes['denominacion'] < 1)
                            ? $desglosebilletes[1][(int)($billetes['denominacion'] * 100)]
                            : $desglosebilletes[0][(int)$billetes['denominacion']];
                        $pdf->Cell(12, $this->altocelda, $valor, 1, 0, 'C', 1);
                    }
                }
            }
            
            $this->fnPintarCorteDiscontinuo($pdf);
            $this->fnAdicionarPagina($pdf);
        }
    }

    private function fnDesglozarBilletes($arrnombilletes, $importeadesglozar)
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

    private function fnPintarCorteDiscontinuo(&$pdf)
    {
        $register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'views/images/tigera.jpg';

        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Ln();
        $pdf->Cell(10, 3, ($pdf->Image($direccion, 1, $pdf->GetY() + 1, 3, 2)), 0, 0, 'R', 0);
        $pdf->SetX(3);
        $pdf->Cell(260, 3, '- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
        
        ', 0, 1, 'L', 0);
    }

    private function fnAdicionarPagina(&$pdf)
    {
        //Cambio de hoja
        $y = $pdf->GetY();
        if ($y >= '134') {
            $pdf->SetY(1);
            $pdf->AddPage();
        }
    }
}





