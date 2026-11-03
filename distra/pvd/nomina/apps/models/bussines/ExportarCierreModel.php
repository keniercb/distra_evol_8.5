
<?php
$dirWWW = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirWWW . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/$pdf.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class PDFExportar extends fpdf
{
    private $pdf;
    private $table;
    private $alingsArray;
    private $datos;

    function Footer()
    {

    }
}

class ExportarcierreModel extends ZendExt_Model
{
    public function ExportarcierreModel() {
        parent::ZendExt_Model();
    }
   
    public function CrearReportePDF($codigo,$noment,$estado,$inicio,$fin,$datos,$centros,$sinsubvac,$cargossinconfig,$sinplantilla,$doble,$servicio,$nombreperiodo,$fechaContable,$fecha,$descreten){
       
        $pdf = new PDFExportar('L', 'mm', array(440,500));
        $table = new Tableml($pdf);
        $pdf->SetLeftMargin(10);
        $pdf->AddPage();
        $pdf->SetFont('Times', 'B', 20);
        $pdf->SetLineWidth(0);
        $pdf->Cell(470, 10, utf8_decode("Reporte del cierre de la nómina"), 1, 1, 'C', 0);
        $pdf->SetFont('Times', 'B', 19);
        $pdf->Cell(200, 10, utf8_decode("$noment"), 1, 0, 'C', 0);
        if ($estado == "Cerrado") {
            $pdf->Cell(270, 10, utf8_decode("Período $nombreperiodo. desde  $inicio  hasta $fin. Período $estado "), 1, 0, 'C', 0);
        }else {
            $pdf->Cell(270, 10, utf8_decode("Período $nombreperiodo. desde  $inicio  hasta $fin. Fecha contable $fechaContable "), 1, 0, 'C', 0);
        }
      // echo '<pre>';print_r($datos);die;
        $pdf->Ln(15);
        $pdf->SetFont('Times', 'B', 22);
        $pdf->Cell(470, 8, utf8_decode("Información de las cuentas del cierre"), 0, 1, 'C', 0);
        $pdf->Cell(470, 2, utf8_decode(), 0, 1, 'C', 0);
        $pdf->SetFont('Arial', '', 19);
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->SetY($y) ;
        $pdf->SetX($x + 0);
        $pdf->MultiCell(150, 15, utf8_decode('Tipo Pago'), 1, 'C');
        $x = $pdf->GetX();
        $newy = $pdf->GetY();
        $pdf->SetY($y);
        $pdf->SetX($x + 150);
        $pdf->MultiCell(60, 15, utf8_decode('Estado'), 1, 'C' );
        $x = $pdf->GetX();
        $newy = $pdf->GetY();
        $pdf->SetY($y);
        $pdf->SetX($x + 210);
        $pdf->MultiCell(95, 15, utf8_decode('Importe Contabilidad'), 1,'C');
        $x = $pdf->GetX();
        $newy = $pdf->GetY();
        $pdf->SetY($y);
        $pdf->SetX($x+ 305);
        $pdf->MultiCell(95, 15, utf8_decode('Importe   Nómina'), 1, 'C');
        $x = $pdf->GetX();
        $newy = $pdf->GetY();
        $pdf->SetY($y);
        $pdf->SetX($x+ 400.4);
        $pdf->MultiCell(70, 15, utf8_decode('Diferencia'), 1, 'C');
       
        if ( count($datos) > 0) {
            for ($i=0; $i < count($datos) ; $i++) { 
                if ($pdf->GetY() > 390) {
                    $pdf->AddPage();
                }
                $pdf->SetFont('Arial', '', 17);
               
                $x = $pdf->GetX();
                $y = $pdf->GetY();
                $pdf->SetY($y + 0);
                $pdf->SetX($x + 0);
                $pdf->MultiCell(150, 12, utf8_decode($datos[$i]['denominacion']), 1, 'C');
                $x = $pdf->GetX();
                $newy = $pdf->GetY();
                $pdf->SetY($y);
                $pdf->SetX($x + 150);
                $pdf->Cell(60, $newy-$y, utf8_decode($datos[$i]['estado']), 1, 0,'C' );
                $pdf->Cell(95, $newy-$y, utf8_decode($datos[$i]['contab']), 1, 0, 'C');
                $pdf->Cell(95, $newy-$y, utf8_decode($datos[$i]['nomina']), 1, 0, 'C');
                $pdf->Cell(70, $newy-$y, utf8_decode($datos[$i]['diferencia']), 1, 1, 'C');
            }  

        }
         else {
            $pdf->Cell(470, 8, utf8_decode(" No existe datos para mostrar en el cierre de la nómina "), 0, 1, 'C');
        }

        if ($pdf->GetY() > 360) {
            $pdf->AddPage();
        }
        
        
        if (count($centros)) {
            $pdf->SetLeftMargin(10);
            $pdf->SetLineWidth(0);
            $pdf->Ln(20);
            $pdf->SetFont('Times', 'B', 22);
            $pdf->Cell(470, 8, utf8_decode("Las siguientes personas no están asociadas a ningún centro de costo"), 0, 1, 'C');
            $pdf->Cell(470, 2, utf8_decode(), 0, 1, 'C', 0);
            $pdf->SetFont('Arial', '', 17);
            
                for ($i=0; $i < count($centros) ; $i++) { 
                    if ($pdf->GetY() > 390) {
                        $pdf->AddPage();
                    }
                    $pdf->Cell(10, 11, utf8_decode($i), 1, 'L');
                    $x = $pdf->GetX();
                    $y = $pdf->GetY();
                    $pdf->SetY($y);
                    $pdf->SetX($x );
                    $pdf->MultiCell(460, 11, utf8_decode($centros[$i]['nombre']), 1, 'L');
                
                }
        }
        
      
        if (count($sinsubvac)) {
            $pdf->Ln(20);
            $pdf->SetFont('Times', 'B', 22);
            $pdf->Cell(470, 9, utf8_decode("Las siguientes personas no tienen inicializado el submayor de vacaciones"), 0, 1, 'C');
            $pdf->Cell(470, 2, utf8_decode(), 0, 1, 'C', 0);
            $pdf->SetFont('Arial', '', 18);
            
                for ($i=0; $i < count($sinsubvac) ; $i++) { 
                    if ($pdf->GetY() > 390) {
                        $pdf->AddPage();
                    }
                    $pdf->Cell(10, 11, utf8_decode($i), 1, 'L');
                    $x = $pdf->GetX();
                    $y = $pdf->GetY();
                    $pdf->SetY($y);
                    $pdf->SetX($x );
                    $pdf->MultiCell(460, 11, utf8_decode($sinsubvac[$i]['nombre']), 1, 'L');   
                }
        }
       


        if (count($cargossinconfig)) {
        $pdf->Ln(20);
        $pdf->SetFont('Times', 'B', 22);
        $pdf->Cell(470, 8, utf8_decode("Los siguientes cargos no se encuentran configurados en elementos salariales al cargo"), 0, 1, 'C');
        $pdf->Cell(470, 2, utf8_decode(), 0, 1, 'C', 0);
        $pdf->SetFont('Arial', '', 18);
            for ($i=0; $i < count($cargossinconfig) ; $i++) { 
                if ($pdf->GetY() > 390) {
                    $pdf->AddPage();
                }
                $pdf->Cell(10, 11, utf8_decode($i), 1, 0, 'L');
                $pdf->Cell(460, 11, utf8_decode(    $cargossinconfig[$i]['nombre']), 1, 1, 'L');
               
            }
        }
        
    
        if (count($sinplantilla)) {
            $pdf->Ln(20);
            $pdf->SetFont('Times', 'B', 22);
            $pdf->Cell(470, 8, utf8_decode("Las siguientes personas no tienen plantilla nominal"), 0, 1, 'C');
            $pdf->Cell(470, 2, utf8_decode(), 0, 1, 'C', 0);
            $pdf->SetFont('Arial', '', 18);
            
                for ($i=0; $i < count($sinplantilla) ; $i++) { 
                    if ($pdf->GetY() > 390) {
                        $pdf->AddPage();
                    }
                    $pdf->Cell(10, 11, utf8_decode($i), 1, 'L');
                    $x = $pdf->GetX();
                    $y = $pdf->GetY();
                    $pdf->SetY($y);
                    $pdf->SetX($x );
                    $pdf->MultiCell(460, 11, utf8_decode($sinplantilla[$i]['nombre']), 1, 'L');
                }
        }
   
        if (count($doble)) {
            $pdf->Ln(20);
            $pdf->SetFont('Times', 'B', 22);
            $pdf->Cell(470, 8, utf8_decode("Las siguientes personas tienen más de un cargo"), 0, 1, 'C');
            $pdf->Cell(470, 2, utf8_decode(), 0, 1, 'C', 0);
            $pdf->SetFont('Arial', '', 18);
            
                for ($i=0; $i < count($doble) ; $i++) { 
                    if ($pdf->GetY() > 390) {
                        $pdf->AddPage();
                    }
                    $pdf->Cell(10, 11, utf8_decode($i), 1, 'L');
                    $x = $pdf->GetX();
                    $y = $pdf->GetY();
                    $pdf->SetY($y);
                    $pdf->SetX($x );
                    $pdf->MultiCell(460, 11, utf8_decode(    $doble[$i]['nombre']    ), 1, 'L');
                }
        }
      

        if (count($servicio)> 0) {
            $pdf->Ln(20);
            $pdf->SetFont('Times', 'B', 22);
            $pdf->Cell(470, 8, utf8_decode("Las siguientes personas tienen su situación laboral visible en asociar personas a centros de costo"), 0, 1, 'C');
            $pdf->Cell(470, 2, utf8_decode(), 0, 1, 'C', 0);
            $pdf->SetFont('Arial', '', 18);
            
                for ($i=0; $i < count($servicio) ; $i++) { 
                    if ($pdf->GetY() > 390) {
                        $pdf->AddPage();
                    }
                    $pdf->Cell(10, 11, utf8_decode($i), 1, 'L');
                    $x = $pdf->GetX();
                    $y = $pdf->GetY();
                    $pdf->SetY($y);
                    $pdf->SetX($x );
                    $pdf->MultiCell(460, 11, utf8_decode($servicio[$i]['nombre']), 1, 'L');
                    
                }
        }

        if (count($descreten)> 0) {
            $pdf->Ln(15);
            $pdf->SetFont('Times', 'B', 22);
            $pdf->Cell(470, 8, utf8_decode("A los siguientes trabajadores se les ha aplicado descuentos o retenciones en varios tipos de pago de un mismo período"), 0, 1, 'C');
            $pdf->Cell(470, 2, utf8_decode(), 0, 1, 'C', 0);
            $pdf->SetFont('Arial', '', 18);
            
                for ($i=0; $i < count($descreten) ; $i++) { 
                    if ($pdf->GetY() > 390) {
                        $pdf->AddPage();
                    }
                    $pdf->Cell(10, 11, utf8_decode($i), 1, 'L');
                    $x = $pdf->GetX();
                    $y = $pdf->GetY();
                    $pdf->SetY($y);
                    $pdf->SetX($x );
                    $pdf->MultiCell(460, 11, utf8_decode($descreten[$i]['nombre']), 1, 'L');
                    
                }
        }

        $pdf->Ln(15);
        $pdf->SetFont('Times', 'B', 23);
        $pdf->Cell(440, 11, utf8_decode('Fecha Impresión:'), 0,0, 'R');
        $pdf->Cell(20, 11, utf8_decode($fecha), 0,1, 'L');
        $pdf->Output();
    }
 
}