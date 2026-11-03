<?php
$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);
class PDFAnexo2 extends fpdf
{
    protected $pdf;
    protected $table;
    protected $alingsArray;
    protected $withArray;
    function Footer()
    {

    }
}
class Bajas extends ZendExt_Model
{
   public function exportarBajas($estructura, $fdesde)
   {
         $pdf = new fpdf('L', 'mm', 'a3');
         $pdf->SetTitle("Bajas absolutas por meses");
         $pdf->SetLeftMargin(2);
         $pdf->AddPage();
         $pdf->SetFont('Arial', 'B', 20);
        if ($estructura && $fdesde) {
           $pdffinal = $this->addContenido($pdf, $estructura, $fdesde);
           $pdffinal->Output();
        } else {
           $pdf->Output();
        }
   }

   public function addContenido($pdf, $estructura, $fech)
   {
         $pdf->SetLeftMargin(15);
         $pdf->SetFont('Arial', 'B', 20);
         $pdf->Cell(540, 10, utf8_decode('BAJAS ABSOLUTAS POR MESES'), 0, 0, 'C', 0);
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
         $this->withArray = [150, 25, 25, 25, 25, 25, 25, 25, 25, 35, 35,35,35,35];
         $table->SetAligns($this->alignsArray);
         $table->SetWidths($this->withArray);
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
        foreach ($datos as $estruc) {
            $enero=0;
            $febrero=0;
            $marzo=0;
            $abril=0;
            $mayo=0;
            $junio=0;
            $julio=0;
            $agosto=0;
            $septiembre=0;
            $octubre=0;
            $noviembre=0;
            $diciembre=0;
            $acumulado=0;

            $valor = explode('-', $fech);
            $mes=$valor[1];
            $ano=$valor[0];

            $bajas=DatSituacionlaboral::getBajasporFecha($estruc->id, $mes, $ano);
            $pdf->SetFont('Arial', '', 12);//
            if (count($bajas) > 0) {
                $pintar = false;
                foreach ($bajas as $b) {
                    if ($b['fluctuacion']==1) {
                        if ($b['idarea']==$estruc->id) {
                            $pintar = true;
                            $fechas[]=$b['fhasta'];
                            $fdesde[]=explode('/', $fechas[0]);

                            if ($fdesde[0][1]=='01') {
                                $enero+=1;
                                $acumulado++;
                                $acumenero++;
                            }
                            if ($fdesde[0][1]=='02') {
                                $febrero+=1;
                                $acumulado++;
                                $acumfebrero++;
                            }
                            if ($fdesde[0][1]=='03') {
                                $marzo+=1;
                                $acumulado++;
                                $acumnmarzo++;
                            }
                            if ($fdesde[0][1]=='04') {
                                $abril+=1;
                                $acumulado++;
                                $acumabril++;
                            }
                            if ($fdesde[0][1]=='05') {
                                $mayo+=1;
                                $acumulado++;
                                $acummayo++;
                            }
                            if ($fdesde[0][1]=='06') {
                                $junio+=1;
                                $acumulado++;
                                $acumjunio++;
                            }
                            if ($fdesde[0][1]=='07') {
                                $julio+=1;
                                $acumulado++;
                                $acumjulio++;
                            }
                            if ($fdesde[0][1]=='08') {
                                $agosto+=1;
                                $acumulado++;
                                $acumagosto++;
                            }
                            if ($fdesde[0][1]=='09') {
                                $septiembre+=1;
                                $acumulado++;
                                $acumseptiembre++;
                            }
                            if ($fdesde[0][1]=='10') {
                                $octubre+=1;
                                $acumulado++;
                                $acumoctubre++;
                            }
                            if ($fdesde[0][1]=='11') {
                                $noviembre+=1;
                                $acumulado++;
                                $acumnoviembre++;
                            }
                            if ($fdesde[0][1]=='12') {
                                $diciembre+=1;
                                $acumulado++;
                                $acumdiciembre++;
                            }
                        }
                        $fechas=[];
                        $fdesde=[];
                    }
                }
                if ($pintar) {
                    $pdf->Cell($this->withArray[0], 10, utf8_decode($estruc->text), 1, 0, 'L', 0);
                    $pdf->Cell(25, 10, $enero, 1, 0, 'C', 0);
                    $pdf->Cell(25, 10, $febrero, 1, 0, 'C', 0);
                    $pdf->Cell(25, 10, $marzo, 1, 0, 'C', 0);
                    $pdf->Cell(25, 10, $abril, 1, 0, 'C', 0);
                    $pdf->Cell(25, 10, $mayo, 1, 0, 'C', 0);
                    $pdf->Cell(25, 10, $junio, 1, 0, 'C', 0);
                    $pdf->Cell(25, 10, $julio, 1, 0, 'C', 0);
                    $pdf->Cell(25, 10, $agosto, 1, 0, 'C', 0);
                    $pdf->Cell(35, 10, $septiembre, 1, 0, 'C', 0);
                    $pdf->Cell(35, 10, $octubre, 1, 0, 'C', 0);
                    $pdf->Cell(35, 10, $noviembre, 1, 0, 'C', 0);
                    $pdf->Cell(35, 10, $diciembre, 1, 0, 'C', 0);
                    $pdf->Cell(35, 10, $acumulado, 1, 0, 'C', 0);
                    $pdf->Ln();
                }
            }
        }
        $pdf->Cell($this->withArray[0], 10, 'Total', 1, 0, 'C', 0);
        $pdf->Cell(25, 10, $acumenero, 1, 0, 'C', 0);
        $pdf->Cell(25, 10, $acumfebrero, 1, 0, 'C', 0);
        $pdf->Cell(25, 10, $acumnmarzo, 1, 0, 'C', 0);
        $pdf->Cell(25, 10, $acumabril, 1, 0, 'C', 0);
        $pdf->Cell(25, 10, $acummayo, 1, 0, 'C', 0);
        $pdf->Cell(25, 10, $acumjunio, 1, 0, 'C', 0);
        $pdf->Cell(25, 10, $acumjulio, 1, 0, 'C', 0);
        $pdf->Cell(25, 10, $acumagosto, 1, 0, 'C', 0);
        $pdf->Cell(35, 10, $acumseptiembre, 1, 0, 'C', 0);
        $pdf->Cell(35, 10, $acumoctubre, 1, 0, 'C', 0);
        $pdf->Cell(35, 10, $acumnoviembre, 1, 0, 'C', 0);
        $pdf->Cell(35, 10, $acumdiciembre, 1, 0, 'C', 0);
        $total=$acumenero+$acumfebrero+$acumnmarzo+$acumabril+$acummayo+$acumjunio+$acumjulio+$acumagosto+
         $acumseptiembre+$acumoctubre+$acumnoviembre+$acumdiciembre;
        $pdf->Cell(35, 10, $total, 1, 0, 'C', 0);
        return $pdf;
   }

}