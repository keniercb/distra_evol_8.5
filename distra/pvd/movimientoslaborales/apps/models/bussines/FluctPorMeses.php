<?php
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
class FluctPorMeses extends ZendExt_Model
{

    protected $_pdf;
    protected $_table;
    protected $_alingsArray;
    protected $_withArray;
    //Reporte
    public function exportarFluctPorMeses($estructura, $fdesde)
    {
        $pdf = new fpdf('L', 'mm', 'a3');
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

    public function cabeceraReporte($pdf,$estructura, $fech)
    {

        $pdf->SetLeftMargin(15);
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->Cell(540, 10, utf8_decode('FLUCTUACIÓN POR MESES'), 0, 0, 'C', 0);
        $pdf->Ln(15);

        $valores = array();
        $valores[] = 'Organos y U.C';
        $valores[] = 'Enero';
        $valores[] = 'Febrero';
        $valores[] = 'Marzo';
        $valores[] = 'Abril';
        $valores[] = 'Mayo';
        $valores[] = 'Junio';
        $valores[] = 'Julio';
        $valores[] = 'Agosto';
        $valores[] = 'Septiembre';
        $valores[] = 'Octubre';
        $valores[] = 'Noviembre';
        $valores[] = 'Diciembre';
        $valores[] = 'Acumulado';

        $table = new Tableml($pdf);
        $this->alignsArray = ['L'];
        $this->_withArray = [150, 25, 25, 25, 25, 25, 25, 25, 25, 35, 35,35,35,35];
        $table->SetAligns($this->alignsArray);
        $table->SetWidths($this->_withArray);
        $pdf->SetFont('Arial', 'B', 14);
        $table->Row($valores);

        $datos = ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($estructura);
        $acumenero=0;
        $acumfebrero=0;
        $acumnmarzo=0;
        $acumabril=0;
        $acummayo=0;
        $acumjunio=0;
        $acumjulio=0;
        $acumagosto=0;
        $acumseptiembre=0;
        $acumoctubre=0;
        $acumnoviembre=0;
        $acumdiciembre=0;

        $finalenero=0;
        $finalfebrero=0;
        $finalmarzo=0;
        $finalabril=0;
        $finalmayo=0;
        $finaljunio=0;
        $finaljulio=0;
        $finalagosto=0;
        $finalseptiembre=0;
        $finaloctubre=0;
        $finalnoviembre=0;
        $finaldiciembre=0;
        
        //echo'<pre>';print_r($datos);die;
        for ($i=0; $i < count($datos) ; $i++) { 
            
        /*}
        foreach ($datos as $estruc) {*/
            $pdf->SetFont('Arial', '', 12);
            $enero = 0;
            $febrero = 0;
            $marzo = 0;
            $abril = 0;
            $mayo = 0;
            $junio = 0;
            $julio = 0;
            $agosto = 0;
            $septiembre = 0;
            $octubre = 0;
            $noviembre = 0;
            $diciembre = 0;
            $acumulado = 0;
            $total = 0;
            $contindetenero=0;
            $contindetfebrero=0;
            $contindetmarzo=0;
            $contindetabril=0;
            $contindetmayo=0; 
            $contindetjunio=0;
            $contindetjulio=0;
            $contindetagosto=0;
            $contindetseptiembre=0;
            $contindetoctubre=0;
            $contindetnoviembre=0;
            $contindetdiciembre=0;

        $valor=explode('-', $fech);
            $mes=$valor[1];
            $ano=$valor[0];
            $bajas=DatSituacionlaboral:: getBajasTodas($datos[$i]->id, $mes, $ano); 
            // $contindet=DatSituacionlaboral::getContratosIndet($datos[$i]->id);
            // $arregloindet[]=count($contindet);
            if (count($bajas)>0) {
                $pintar = false;
                foreach ($bajas as $b) {
                    if ($b['fluctuacion'] == 2){ //la fluctuacion estaba igualada a 1 y la cambie por 2, debido a los datos que carga la base de datos en la tabla nom_motivobaja
                        if ($b['idarea'] == $datos[$i]->id) {
                            $pintar = true;
                            $fechas[] = $b['fhasta'];
                            $fdesde[] = explode('/', $fechas[0]);
                            
                            if ($fdesde[0][1] == '01') {
                                $enero++;
                                $acumenero++;
                                $acumulado++;
                                $contindetenero=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '01', $fdesde[0][2]);
                            }                            
                            if ($fdesde[0][1] == '02') {
                                $febrero++;
                                $acumulado++;
                                $acumfebrero++;
                                $contindetfebrero=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '02', $fdesde[0][2]);
                            }
                            if ($fdesde[0][1] == '03') {
                                $marzo++;
                                $acumulado++;
                                $acumnmarzo++;
                                $contindetmarzo=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '03', $fdesde[0][2]);
                            }
                            if ($fdesde[0][1] == '04') {
                                $abril++;
                                $acumulado++;
                                $acumabril++;
                                $contindetabril=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '04', $fdesde[0][2]);

                            }
                            if ($fdesde[0][1] == '05') {
                                $mayo++;
                                $acumulado++;
                                $acummayo++;
                                $contindetmayo=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '05', $fdesde[0][2]);
                            }
                            if ($fdesde[0][1] == '06') {
                                $junio++;
                                $acumulado++;
                                $acumjunio++;
                                $contindetjunio=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '06', $fdesde[0][2]);
                            }
                            if ($fdesde[0][1] == '07') {
                                $julio++;
                                $acumulado++;
                                $acumjulio++;
                                $contindetjulio=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '07', $fdesde[0][2]);
                            }
                            if ($fdesde[0][1] == '08') {
                                $agosto++;
                                $acumulado++;
                                $acumagosto++;
                                $contindetagosto=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '08', $fdesde[0][2]); 
                            }
                            if ($fdesde[0][1] == '09') {
                                $septiembre++;
                                $acumulado++;
                                $acumseptiembre++;
                                $contindetseptiembre=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '09', $fdesde[0][2]);
                            }
                            if ($fdesde[0][1] == '10') {
                                $octubre++;
                                $acumulado++;
                                $acumoctubre++;
                                $contindetoctubre=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '10', $fdesde[0][2]);
                            }
                            if ($fdesde[0][1] == '11') {
                                $noviembre++;
                                $acumulado++;
                                $acumnoviembre++;
                                $contindetnoviembre=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '11', $fdesde[0][2]);
                            }
                            if ($fdesde[0][1] == '12') {
                                $diciembre++;
                                $acumulado++;
                                $acumdiciembre++;
                                $contindetdiciembre=DatSituacionlaboral::getContratosIndeterPorMeses($datos[$i]->id, '12', $fdesde[0][2]);
                            }
                        }
                        $fechas = [];
                        $fdesde = [];
                    }
                }
                if ($pintar) {
                    $fluctenero=$enero/count($contindetenero)*100;
                    $fluctfebrero=$febrero/count($contindetfebrero)*100;
                    $fluctmarzo=$marzo/count($contindetmarzo)*100;
                    $fluctabril=$abril/count($contindetabril)*100;
                    $fluctmayo=$mayo/count($contindetmayo)*100;
                    $fluctjunio=$junio/count($contindetjunio)*100;
                    $fluctjulio=$julio/count($contindetjulio)*100;
                    $fluctagosto=$agosto/count($contindetagosto)*100;
                    $fluctseptiembre=$septiembre/count($contindetseptiembre)*100;
                    $fluctoctubre=$octubre/count($contindetoctubre)*100;
                    $fluctnoviembre=$noviembre/count($contindetnoviembre)*100;
                    $fluctdiciembre=$diciembre/count($contindetdiciembre)*100;
                    $total=$fluctenero+$fluctfebrero+$fluctmarzo+$fluctabril+$fluctmayo+$fluctjunio+$fluctjulio+
                    $fluctagosto+$fluctseptiembre+$fluctoctubre+$fluctnoviembre+$fluctdiciembre;
                    if ($total > 0) {
                        $pdf->Cell($this->_withArray[0], 10, utf8_decode($datos[$i]->text), 1, 0, 'L', 0);
                        $pdf->Cell(25, 10, round($fluctenero, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(25, 10, round($fluctfebrero, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(25, 10, round($fluctmarzo, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(25, 10, round($fluctabril, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(25, 10, round($fluctmayo, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(25, 10, round($fluctjunio, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(25, 10, round($fluctjulio, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(25, 10, round($fluctagosto, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(35, 10, round($fluctseptiembre, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(35, 10, round($fluctoctubre, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(35, 10, round($fluctnoviembre, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(35, 10, round($fluctdiciembre, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
                        $pdf->Cell(35, 10, round($total, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);

                        $pdf->Ln();
                    }

                    $finalenero+= $fluctenero;
                    $finalfebrero+= $fluctfebrero;
                    $finalmarzo+= $fluctmarzo;
                    $finalabril+= $fluctabril;
                    $finalmayo+= $fluctmayo;
                    $finaljunio+= $fluctjunio;
                    $finaljulio+= $fluctjulio;
                    $finalagosto+= $fluctagosto;
                    $finalseptiembre+= $fluctseptiembre;
                    $finaloctubre+= $fluctoctubre;
                    $finalnoviembre+= $fluctnoviembre;
                    $finaldiciembre+= $fluctdiciembre;
                }
            }
        }//die;
        
        // $suma=array_sum($arregloindet);
        // $finalenero=$acumenero/$suma*100;
        // $finalfebrero=$acumfebrero/$suma*100;
        // $finalmarzo=$acumnmarzo/$suma*100;
        // $finalabril=$acumabril/$suma*100;
        // $finalmayo=$acummayo/$suma*100;
        // $finaljunio=$acumjunio/$suma*100;
        // $finaljulio=$acumjulio/$suma*100;
        // $finalagosto= $acumagosto/$suma*100;
        // $finalseptiembre=$acumseptiembre/$suma*100;
        // $finaloctubre=$acumoctubre/$suma*100;
        // $finalnoviembre=$acumnoviembre/$suma*100;
        // $finaldiciembre= $acumdiciembre/$suma*100;
        $pdf->Cell($this->_withArray[0], 10, 'Total', 1, 0, 'C', 0);
        $pdf->Cell(25, 10, round($finalenero, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(25, 10, round($finalfebrero, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(25, 10, round($finalmarzo, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(25, 10, round($finalabril, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(25, 10, round($finalmayo, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(25, 10, round($finaljunio, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(25, 10, round($finaljulio, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(25, 10, round($finalagosto, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(35, 10, round($finalseptiembre, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(35, 10, round($finaloctubre, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(35, 10, round($finalnoviembre, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $pdf->Cell(35, 10, round($finaldiciembre, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        $total = $finalenero + $finalfebrero + $finalmarzo + $finalabril + $finalmayo + $finaljunio + $finaljulio +
            $finalagosto + $finalseptiembre + $finaloctubre + $finalnoviembre + $finaldiciembre;
        $pdf->Cell(35, 10, round($total, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 0);
        return $pdf;
    }
}