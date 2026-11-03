<?php
$dirWWW = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirWWW . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class PDFFuerzatrabajo extends fpdf
{
    private $pdf;
    private $table;
    private $alingsArray;
    private $datos;

    function Footer()
    {

    }
}

class ExportarDeficitModel extends ZendExt_Model
{
    public function ExportarDeficitModel()
    {
        parent::ZendExt_Model();
    }
    public function arrayToString($array)
     {
        $string = '';
        foreach ($array as $key => $value) {
            if ($key == 0) {
                $string .= $value;
            } else {
                $string .= ',' . $value;
            }
        }
        return $string;
    }


    public function CrearReporte($r,$fechac,$idest)
    {
        $pdf = new PDFFuerzatrabajo('L', 'mm', 'letter');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        $ses = $_SESSION['Zeolides']['entidad'];
        $idestructura = ($idest == 0 || $idest == null) ? $ses->idestructura : $idest;
        $fecha = ($fechac == 0 || $fechac == null) ? date('d/m/Y') : $fechac;
        $centroInformante = DatSituacionlaboralModel::getDatosCentroInformante($idestructura);
        $this->crearEncabezadoPrincipal($centroInformante,$fecha);
        $pdfNGeneral = $this->crearCuerpo($r);
        //ob_end_clean();                           
        $pdfNGeneral->Output();
    }

     private function crearCuerpo($r)
     {
        $this->pdf->SetFillColor(200);
        $this->pdf->Ln(2);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(140 , 10, utf8_decode('Cargo'), 1, 0, 'C');
        $this->pdf->Cell(40 , 10, utf8_decode('Por plantilla'), 1, 0, 'C');
        $this->pdf->Cell(40 , 10, utf8_decode('Cubiertos'), 1, 0, 'C');
        $this->pdf->Cell(40 , 10, utf8_decode('Déficit'), 1, 1, 'C');
       

        $this->pdf->Cell(140, 7, utf8_decode('A'), 1, 0, 'C');
        $this->pdf->Cell(40 , 7, utf8_decode('B'), 1, 0, 'C');
        $this->pdf->Cell(40 , 7, utf8_decode('C'), 1, 0, 'C');
        $this->pdf->Cell(40 , 7, utf8_decode('D'), 1, 1, 'C');

      foreach ($r as $key => $value) {
        $this->pdf->Cell(140, 6, utf8_decode($value['1']), 1, 0, 'L');
        $this->pdf->Cell(40 , 6, utf8_decode($value['2']), 1, 0, 'C');
        $this->pdf->Cell(40 , 6, utf8_decode($value['3']), 1, 0, 'C');
        $this->pdf->Cell(40 , 6, utf8_decode($value['4']), 1, 1, 'C');
      }
      return $this->pdf;
     }

    private function crearEncabezadoPrincipal( $centroInformante,$fecha)
    {
        $this->pdf->SetLeftMargin(10);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Times', 'B', 18);
        $this->pdf->SetLineWidth(0.5);
        
       
        $this->pdf->Cell(200, 15, utf8_decode('Déficit de las Fuerzas de Trabajo'), 1,0, 'C');
        $this->pdf->SetFont('Times', 'B', 15);
        $this->pdf->Cell(60, 15, utf8_decode("Fecha: {$fecha}"), 1,1, 'C');
        $this->pdf->Cell(160, 10, utf8_decode("Centro informante: {$centroInformante['denominacion']}"), 1, 0, 'L', 0);
        $this->pdf->Cell(100, 10, utf8_decode("Código del centro informante: {$centroInformante['codigo']}"), 1, 0, 'L', 0);
        $this->pdf->Ln(13);
    }


 
}