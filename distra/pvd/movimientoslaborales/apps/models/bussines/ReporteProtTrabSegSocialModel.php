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

class ReporteProtTrabSegSocialModel extends ZendExt_Model
{
    public function ReporteProtTrabSegSocialModel()
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


    public function CrearReportePDFPTSC($idestructura,$iniciot,$fint,$inicios,$fins)
    {
        $pdf = new PDFFuerzatrabajo('L', 'mm', 'letter');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        //Aqui se obtiene los arreglos de datos para nutrir el pdf:
        $objprot=new ReporteProtTrabSegSocialDatos();
        $datost=$objprot->datosTrimestre($idestructura,$iniciot,$fint);
        $datostrimestreactual= $datost['act'];
        $datostrimestreanterior= $datost['ant'];
        $datostrimestreanterior1= $datost['ant1'];
        $datostrimestreanterior2= $datost['ant2'];
       //////////////////////////
        $datos = $objprot->DatosSemestre($idestructura,$inicios,$fins);//
        $datossemestre=$datos['act'];
        $datossemestreanterior=$datos['ant'];
        ///////////////////
        $saldo= $objprot->Saldo($idestructura,$inicios,$fins);
        $saldoactual=$saldo['act'];
        $saldoanterior=$saldo['ant'];

        $centroInformante = DatSituacionlaboralModel::getDatosCentroInformante($idestructura);
        $fecha = date('d/m/Y');
        list($dia, $mes, $anno) = explode('/', $fecha);
        $dia = null;
        $this->crearEncabezadoPrincipalPTSC($anno, $mes, $centroInformante);
        $pdfNGeneral = $this->crearCuerpoPTSC($fecha,$datostrimestreactual,$datostrimestreanterior,$datostrimestreanterior1,$datostrimestreanterior2, $datossemestre,$datossemestreanterior,$saldoactual,$saldoanterior);
        ob_end_clean();                           
        $pdfNGeneral->Output();
    }

    private function crearCuerpoPTSC($fecha,$datostrimestreactual,$datostrimestreanterior,$datostrimestreanterior1,$datostrimestreanterior2,$datossemestre,$datossemestreanterior,$saldoactual,$saldoanterior)
    {
        $this->pdf->SetFillColor(200);
        $this->pdf->Ln(2);

        $this->pdf->Cell(105, 10, utf8_decode('Indicadores'), 1, 0, 'C');
        $this->pdf->Cell(15, 10, utf8_decode('U.M.'), 1, 0, 'C');
        $this->pdf->Cell(20, 10, utf8_decode('Fila No.'), 1, 0, 'C');
        $this->pdf->Cell(120, 5, utf8_decode('Real'), 1, 0, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();

        $this->pdf->SetY($y + 5);
        $this->pdf->SetX($x - 120);
        $this->pdf->Cell(60, 5, utf8_decode('Año Actual '), 1, 0, 'C');
        $this->pdf->Cell(60, 5, utf8_decode('Año Anterior'), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('A'), 1, 0, 'C');
        $this->pdf->Cell(15, 6, utf8_decode('B'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('C'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode('1'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode('2'), 1, 1, 'C');

        $this->pdf->Cell(260, 6, utf8_decode('PERIODICIDAD TRIMESTRAL '), 1, 1, 'l');

        $this->pdf->Cell(105, 6, utf8_decode('Total de accidentes de trabajo'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('01'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['acctrab']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['acctrab']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('    De ello: Mortales'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('02'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['fallecidos']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['fallecidos']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Total de accidentes equiparados al de trabajo'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('03'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['accequiptrab']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['accequiptrab']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('      De ello: Mortales'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('04'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['fallecidosequip']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['fallecidosequip']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Lesionados por accidente de trabajo '), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('05'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['acctrab']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['acctrab']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('      De ello: Mujeres'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('06'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['acctrabmujer']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['acctrabmujer']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Fallecidos por accidentes de trabajo'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('07'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['fallecidos']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['fallecidos']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('     De ello: Mujeres'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('08'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['fallecidosmujer']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['fallecidosmujer']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Lesionados por accidentes equiparados al de trabajo'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('09'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['accequiptrab']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['accequiptrab']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('     De ello: Mujeres'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('10'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['accequiptrabmujer']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['accequiptrabmujer']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Hombres-Días perdidos por accidentes de trabajo'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('11'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreactual['diasperdidos']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datostrimestreanterior['diasperdidos']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('    De ello: De años anteriores'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('12'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode(floatval($datostrimestreanterior1['diasperdidos'])), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode(floatval($datostrimestreanterior2['diasperdidos'])), 1, 1, 'C');

        $this->pdf->Cell(260, 6, utf8_decode('PERIODICIDAD SEMESTRAL '), 1, 1, 'l');

        $this->pdf->Cell(105, 6, utf8_decode('Trabajadores subvencionados por:'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(20, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(60, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(60, 6, utf8_decode(''), 1, 1, 'C', 1);

        $this->pdf->Cell(105, 6, utf8_decode('Enfermedad y accidente común'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('13'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestre['contencom']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestreanterior['contencom']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Accidente de trabajo'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('14'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestre['contat']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestreanterior['contat']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Accidente equiparado al de trabajo'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('15'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestre['contaet']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestreanterior['contaet']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Enfermedad profesional'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('16'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestre['contenfprof']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestreanterior['contenfprof']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Invalidez parcial por accidente de trabajo y enfermedad profesional'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('17'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestre['contparcial']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestreanterior['contparcial']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Invalidez Total por accidente de trabajo y enfermedad profesional '), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('18'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestre['conttotal']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($datossemestreanterior['conttotal']), 1, 1, 'C');


        $this->pdf->Cell(105, 6, utf8_decode('Subvenciones pagadas por:'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(20, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(60, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(60, 6, utf8_decode(''), 1, 1, 'C', 1);


        $this->pdf->Cell(105, 6, utf8_decode('Enfermedad y accidente común'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('P'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('19'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($saldoactual['importepENF']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($saldoanterior['importepENF']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Accidente de trabajo '), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('P'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('20'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($saldoactual['importeAT']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($saldoanterior['importeAT']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Accidente equiparado al de trabajo'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('P'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('21'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($saldoactual['importeAET']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($saldoanterior['importeAET']), 1, 1, 'C');

        $this->pdf->Cell(105, 6, utf8_decode('Enfermedad profesional'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode('P'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('22'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($saldoactual['importepPROF']), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($saldoanterior['importepPROF']), 1, 1, 'C');

        $totalact=$datostrimestreactual['acctrab']+ $datostrimestreactual['fallecidos']+ $datostrimestreactual['accequiptrab']+
                 $datostrimestreactual['fallecidosequip']+ $datostrimestreactual['acctrab']+ $datostrimestreactual['acctrabmujer']+
                 $datostrimestreactual['fallecidos']+ $datostrimestreactual['fallecidosmujer']+ $datostrimestreactual['accequiptrab']+
                 $datostrimestreactual['accequiptrabmujer']+ $datostrimestreactual['diasperdidos']+ $datostrimestreanterior1['diasperdidos']+
                 $datossemestre['contencom']+ $datossemestre['contat']+ $datossemestre['contaet']+ $datossemestre['contenfprof']+
                 $datossemestre['contparcial']+ $datossemestre['conttotal']+ $saldoactual['sumENF']+ $saldoactual['sumAT']+
                 $saldoactual['sumAET']+ $saldoactual['sumPROF'];

        $totalant= $datostrimestreanterior['acctrab']+ $datostrimestreanterior['fallecidos']+ $datostrimestreanterior['accequiptrab']+
                    $datostrimestreanterior['fallecidosequip']+ $datostrimestreanterior['acctrab']+ $datostrimestreanterior['acctrabmujer']+
                    $datostrimestreanterior['fallecidos']+ $datostrimestreanterior['fallecidosmujer']+ $datostrimestreanterior['accequiptrab']+ 
                    $datostrimestreanterior['accequiptrabmujer']+ $datostrimestreanterior['diasperdidos']+ 
                    $datostrimestreanterior2['diasperdidos']+ $datossemestreanterior['contencom']+ $datossemestreanterior['contat']+
                    $datossemestreanterior['contaet']+ $datossemestreanterior['contenfprof']+
                    $datossemestreanterior['contparcial']+ $datossemestreanterior['conttotal']+
                    $saldoanterior['sumENF']+ $saldoanterior['sumAT']+ $saldoanterior['sumAET']+ $saldoanterior['sumPROF'];
        $objprot=new ReporteProtTrabSegSocialDatos();
        $this->pdf->Cell(105, 6, utf8_decode('Suma de Control'), 1, 0, 'L');
        $this->pdf->Cell(15, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(20, 6, utf8_decode('9999'), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($objprot->numberFormat($totalact)), 1, 0, 'C');
        $this->pdf->Cell(60, 6, utf8_decode($objprot->numberFormat($totalant)), 1, 1, 'C');

        $this->pdf->Ln(7);


        $this->pdf->Ln(5);


        $x = $this->pdf->getX();
        $y = $this->pdf->getY();
        $this->pdf->Cell(105, 39.9, utf8_decode(''), 1, 0, 'L');
        $x2 = $this->pdf->getX();
        $y2 = $this->pdf->getY();
        $this->pdf->Cell(60, 39.9, utf8_decode(''), 1, 0, 'L');

        $this->pdf->Cell(50, 39.9, utf8_decode(''), 1, 0, 'L');

        $this->pdf->Cell(45, 39.9, utf8_decode(''), 1, 1, 'L');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x);
        $this->pdf->SetFont('Times', 'B', 10);
        $texto = "Certificamos que los datos contenidos en este formulario    corresponden a los  anotados en nuestros registros primarios; así como también, que dicho formulario se ha confeccionado de acuerdo con las    instrucciones  metodológicas vigentes   para su elaboración.";
        $cont = 0;
        while (strlen($texto) > 68) {
            $this->pdf->Cell(120, 9, utf8_decode(substr($texto, 0, 68)), 0, 1, 'L');
            $texto = substr($texto, 68, strlen($texto));
        }

        $this->pdf->Cell(120, 9, utf8_decode($texto), 0, 0, 'L');

        $this->pdf->Sety($y2);
        $this->pdf->SetX($x2);
        $this->pdf->SetFont('Times', 'B', 9);
        list($dia, $mes, $anno) = explode('/', $fecha);
        $this->pdf->Cell(60, 8, utf8_decode('VICEDIRECTOR ECONÓMICO'), 0, 0, 'C');
        $this->pdf->Cell(50, 9, utf8_decode('DIRECTOR'), 0, 0, 'C');
        $this->pdf->Cell(50, 9, utf8_decode('FECHA'), 0, 1, 'C');
        $this->pdf->SetX($x2);
        $this->pdf->Cell(60, 8, utf8_decode('________________________'), 0, 0, 'C');
        $this->pdf->Cell(50, 8, utf8_decode('________________________'), 0, 1, 'C');
        $this->pdf->SetX($x2);
        $this->pdf->Cell(60, 2, utf8_decode('Nombre y Apellidos'), 0, 0, 'C');
        $this->pdf->Cell(50, 2, utf8_decode('Nombre y Apellidos'), 0, 0, 'C');
        $this->pdf->Cell(50, 0, utf8_decode(), 0, 1, 'C');
        $this->pdf->SetX($x2);
        $this->pdf->Cell(60, 17, utf8_decode('____________'), 0, 0, 'C');
        $this->pdf->Cell(50, 17, utf8_decode('____________'), 0, 0, 'C');
        $this->pdf->Cell(50, 1, utf8_decode($dia.' |    '.$mes. ' |    '.$anno), 0, 1, 'C');
        $this->pdf->SetX($x2);
        $this->pdf->Cell(60, 23, utf8_decode('Firma'), 0, 0, 'C');
        $this->pdf->Cell(50, 23, utf8_decode('Firma'), 0, 0, 'C');
        $this->pdf->Cell(50, 8, utf8_decode('  Día    Mes     Año '), 0, 1, 'C');


        return $this->pdf;
    }

    private function crearEncabezadoPrincipalPTSC($anno, $mes, $centroInformante)
    {
        $this->pdf->SetLeftMargin(10);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->SetLineWidth(0.5);

        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y + 5);
        $this->pdf->SetX($x);

        $this->pdf->Cell(40, 25, 'ONEI', 1, 0, 'C', 0);
        $this->pdf->Image('views/images/ONEI.png', $x + 2, $y + 6, 35, 23);
        $this->pdf->MultiCell(50, 12.5, utf8_decode('Sistema de Información Estadístico Nacional (SIEN)'), 1, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 25);
        $this->pdf->SetX($x + 90);
        $this->pdf->MultiCell(120, 12.5, utf8_decode('INDICADORES SELECCIONADOS DE  PROTECCIÓN DEL TRABAJO   Y SEGURIDAD SOCIAL '), 1, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 25);
        $this->pdf->SetX($x + 210);
        $this->pdf->MultiCell(50, 8.33, utf8_decode('         Formulario No. 5201-06               Página 1 de 2        TRIMESTRAL/SEMESTRAL '), 1, 'R');
        $this->pdf->MultiCell(150, 6.5, utf8_decode("INFORME ACUMULADO HASTA:                             () Marzo 31             ()  Septiembre 30     Año: $anno                                                                           () Junio 30                () Diciembre 31     "), 1, 'L');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 13);
        $this->pdf->SetX($x + 150);
        $this->pdf->Cell(110, 13, utf8_decode('Unidad de medida: La indicada con un decimal '), 1, 1, 'C');
        $this->pdf->Cell(150, 10, utf8_decode("Centro informante: {$centroInformante['denominacion']}"), 1, 0, 'L', 0);
        $this->pdf->Cell(110, 10, utf8_decode("Código del centro informante: {$centroInformante['codigo']}"), 1, 0, 'L', 0);
        $this->pdf->Ln(13);
    }


 
}