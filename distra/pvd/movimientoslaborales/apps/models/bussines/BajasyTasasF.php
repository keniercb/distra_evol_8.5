<?php
/**
 * @name FluctuacionModel - Clase de lógica de negocio del reporte de movimiento de nomina.
 * @package movimientoslaborales.
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @version 1.0
 */
$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);

class PDFAnexo2 extends fpdf
{
    protected $_pdf;
    protected $_table;
    protected $_alingsArray;
    protected $_withArray;

    function Footer()
    {

    }
}

class BajasyTasasF extends ZendExt_Model
{

    protected $_pdf;
    protected $_table;
    protected $_alingsArray;
    protected $_withArray;

    //Reporte
    public function exportarBajasyTasasF($estructura, $fdesde, $fhasta)
    {
		if (empty($fech)) {
            $fech = date ("Y-m-d");
        }
        if (empty($fhasta)) {
            $fhasta = null;
        }
        //Lo anterior es para que el Jenkins no de error porque la variable
        //$fhasta no se utiliza en el metodo.
        
        
        $pdf = new fpdf('L', 'mm', 'a3');

        $pdf->SetTitle("Comportamiento de las bajas y la tasa de fluctuación");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 20);

        if ($estructura && $fdesde) {
            $pdffinal = $this->cabeceraReporte($pdf, $estructura, $fdesde);
            $pdffinal->Output();
        } else {
            $pdf->Output();
        }

    }
    public function cabeceraReporte($pdf, $estructura, $fech)
    {

        $pdf->SetLeftMargin(15);
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->Cell(540, 10, utf8_decode('COMPORTAMIENTO DE LAS BAJAS Y LA TASA DE FLUCTUACION'), 0, 0, 'C', 0);
        $pdf->Ln(15);

        $motivo = MovimientoslaboralesService::getActiveMotivosBaja();

        $datos = ZendExt_IoC::getInstance()->metadatos->obtenerEstructurasDadoPadre($estructura);
        //$cant=count($motivo);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(130, 60, 'Organos y U.C', 1, 0, 'C', 0);
        $arraymotivos=array();

        foreach ($motivo as $key => $m) {
            $arraymotivos[]=$m;
            if ($m['children']) {
                foreach ($m['children'] as $n) {
                    $arraymotivos[] = $n;
                }
            }
        }

        $this->addVerticalColumn($pdf, 60, 'PromTrab CTTO IND', 2, 2);

        foreach ($arraymotivos as $key => $m) {
            $cau = ($pdf->GetStringWidth($m['denominacion']) > 25) ? '.' : '';
            $this->addVerticalColumn($pdf, 60, substr($m['denominacion'], 0, 25) . $cau, 2, 2);
        }
        $this->addVerticalColumn($pdf, 60, 'Total de bajas', 2, 2);
        $this->addVerticalColumn($pdf, 60, utf8_decode('Tasa Fluctuación'), 2, 2);
        $pdf->Ln(60);

        $valor = explode('-', $fech);
        $mes = $valor[1];
        $ano = $valor[0];

        $arreglo = array();
        $arreglocant=array();
        foreach ($datos as $estruc) {
            $pdf->SetFont('Arial', '', 12);
            $obj=new DatSituacionlaboral();

            $fecha= explode('T', $fech);
            $m = date("n", strtotime($fecha[0]));
            $arraycargos = $obj->getTotaltrabajadores($estruc['idfila'], $fecha[0]);

            $prom = $arraycargos[0]['count'] / $m;

            $bajas = DatSituacionlaboral::getBajasTodas($estruc['idfila'], $mes, $ano);

            $pdf->Cell(130, 10, utf8_decode($estruc['text']), 1, 0, 'L', 0);
            $pdf->Cell(16, 10, round($prom, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
            $arregloprom[]=$prom;

            $contador=0;
            $contadorbajas=0;
            //$c=0;
            foreach ($arraymotivos as $key => $m) {
                if (count($bajas) > 0) {
                    foreach ($bajas as $b) {
                        if ($b['fluctuacion']==1) {
                            if ($b['idarea'] == $estruc['idfila']) {
                                if ($m['idmotivobaja'] == $b['idmotivo']) {
                                    $contadorbajas+=1;
                                    $arreglo[$key]['denominacion'] = utf8_decode($estruc['text']);
                                    $arreglo[$key]['idmotivobaja'] = $m['idmotivobaja'];
                                    $arreglo[$key]['cantidad'] += 1;

                                } else {
                                    $arreglo[$key]['denominacion'] = utf8_decode($estruc['text']);
                                    $arreglo[$key]['idmotivobaja'] = $m['idmotivobaja'];
                                    $arreglo[$key]['cantidad'] += 0;
                                }
                            }
                        } else if ($b['fluctuacion']==2) {
                            if ($b['idarea'] == $estruc['idfila']) {
                                if ($m['idmotivobaja'] == $b['idmotivo']) {
                                    $contador+=1;
                                    $arreglo[$key]['denominacion'] = utf8_decode($estruc['text']);
                                    $arreglo[$key]['idmotivobaja'] = $m['idmotivobaja'];
                                    $arreglo[$key]['cantidad'] += 1;

                                } else {
                                    $arreglo[$key]['denominacion'] = utf8_decode($estruc['text']);
                                    $arreglo[$key]['idmotivobaja'] = $m['idmotivobaja'];
                                    $arreglo[$key]['cantidad'] += 0;

                                }

                            }
                        } else {
                            if ($b['idarea'] == $estruc['idfila']) {
                                if ($m['idmotivobaja'] == $b['idmotivo']) {
                                    $arreglo[$key]['denominacion'] = utf8_decode($estruc['text']);
                                    $arreglo[$key]['idmotivobaja'] = $m['idmotivobaja'];
                                    $arreglo[$key]['cantidad'] += 1;

                                } else {
                                    $arreglo[$key]['denominacion'] = utf8_decode($estruc['text']);
                                    $arreglo[$key]['idmotivobaja'] = $m['idmotivobaja'];
                                    $arreglo[$key]['cantidad'] += 0;

                                }


                            }
                        }

                    }

                } else {
                    $arreglo[$key]['denominacion'] = utf8_decode($estruc['text']);
                    $arreglo[$key]['idmotivobaja'] = $m['idmotivobaja'];
                    $arreglo[$key]['cantidad'] = 0;

                }

            }
            foreach ($arreglo as $key => $arr) {
                $pdf->Cell(16, 10, $arr['cantidad'], 1, 0, 'C', 0);
            }
            if ($contador==0) {
                $fluct = $contadorbajas / $prom * 100;
                $pdf->Cell(16, 10, count($bajas), 1, 0, 'C', 0);

                $sumabajas[]=count($bajas);
            } else {
                $fluct = (count($bajas)- $contador)/ $prom * 100;
                $pdf->Cell(16, 10, count($bajas)- $contador, 1, 0, 'C', 0);

            }
            $arreglofluct[]=$fluct;

            $pdf->Cell(16, 10, round($fluct, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
            $pdf->Ln();

            for ($i = 0; $i < count($arreglo); $i++) {
                $arreglocant[$i]+=$arreglo[$i]['cantidad'];
            }

            $arreglo = [];

        }

        $sum=array_sum($arregloprom);
        $pdf->Cell(130, 10, 'Total', 1, 0, 'C', 0);
        $pdf->Cell(16, 10, round($sum, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        for ($i=0;$i<count($arreglocant);$i++) {
            $pdf->Cell(16, 10, round($arreglocant[$i], 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        }
        $totalbajas=array_sum($sumabajas);
        $totalfluct=array_sum($arreglofluct);
        $pdf->Cell(16, 10, $totalbajas, 1, 0, 'C', 0);
        $pdf->Cell(16, 10, round($totalfluct, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);

        return $pdf;
    }

    private function addVerticalColumn($pdf,$w, $text, $salto, $space = 1)
    {
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->Rotate(90, $x + ($w / 2), $y + ($w / 2));
        $pdf->MultiCell($w, $space * 8, utf8_decode($text), 1, 'C');
        $pdf->SetY($y);
        $pdf->SetX($x + (8 * $salto));
        $pdf->Rotate(0);
    }


}