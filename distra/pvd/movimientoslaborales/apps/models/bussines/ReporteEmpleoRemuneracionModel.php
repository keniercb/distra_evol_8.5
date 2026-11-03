
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

class ReporteEmpleoRemuneracionModel extends ZendExt_Model
{
    public function ReporteEmpleoRemuneracionModel()
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

public function CrearReportePDFER($idestructura,$fdesde,$fhasta,$semi,$semf,$idesp)   
 {
        $pdf = new PDFFuerzatrabajo('L', 'mm', 'letter');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        //Donde se obtiene la informacion
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);
        if (count($cargosEstructura)>1) {
            foreach ($cargosEstructura as $key => $value) {
                $idcargos[]=$value['idcargo'];
            }
        }
        $objer = new ReporteEmpleoRemuneracion();
        $datosactual = $objer->getDatosPromediotrabActual($idestructura,$fdesde,$fhasta); 
        $datosanterior = $objer-> getDatosPromediotrabAnterior($idestructura,$fdesde,$fhasta);
        $datospromplan = $objer-> getPlanPromedioTrabaj($idestructura,$fdesde,$fhasta);
        $horasactant = $objer-> getDatosHorasTrabajadas($idestructura,$fdesde,$fhasta,$idcargos); //echo'<pre>';print_r($horasactant);die;
        $centroInformante = DatSituacionlaboralModel::getDatosCentroInformante($idestructura);
        $remuneracion = $objer->getDatosRemuneracion($idestructura,$fdesde,$fhasta,$idcargos);

        $fecha = date('d/m/Y');
        list($dia, $mes, $anno) = explode('/', $fecha);
        $dia = null;
        $this->crearEncabezadoPrincipalER($anno, $mes, $centroInformante);
        $pdfNGeneral = $this->crearCuerpoER($idestructura,$semi,$semf,$fhasta,$datosactual,$datosanterior,$fecha,$horasactant,$remuneracion,$datospromplan,$idesp,$idcargos);
        ob_end_clean(); //limpia el buffer de salida para poder generar el pdf
        $pdfNGeneral->Output();
    }

    private function crearCuerpoER($idestructura,$semi,$semf,$fhasta,$datosactual,$datosanterior,$fecha,$horasactant,$remuneracion,$datospromplan,$idesp,$idcargos)
    {
        $objer= new ReporteEmpleoRemuneracion();
        //$obj= new DatNomEspecialidad();
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Ln(2);
        $this->pdf->SetFillColor(200);
        $this->pdf->Cell(260, 6, utf8_decode('SECCIÓN 1 '), 1, 1, 'L');

        $this->pdf->Cell(80, 15.8, utf8_decode('Indicadores'), 1, 0, 'C');
        $this->pdf->Cell(18, 15.8, utf8_decode('U.M.'), 1, 0, 'C');
        $this->pdf->Cell(13, 15.8, utf8_decode('Código'), 1, 0, 'C');
        $this->pdf->Cell(65, 6, utf8_decode('Año Anterior'), 1, 0, 'C');
        $this->pdf->Cell(84, 6, utf8_decode('Año Actual'), 1, 0, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y + 6);
        $this->pdf->SetX($x - 149);
        $this->pdf->MultiCell(32.5, 9.8, utf8_decode('Real del mes'), 1, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 9.7);
        $this->pdf->SetX($x -136);
        $this->pdf->MultiCell(32.5, 9.7, utf8_decode('Real acumulado'), 1, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 9.7);
        $this->pdf->SetX($x - 103.5);
        $this->pdf->MultiCell(28, 9.7, utf8_decode('Plan acumulado'), 1,'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 9.7);
        $this->pdf->SetX($x - 75.5);
        $this->pdf->MultiCell(28, 9.7, utf8_decode('Real del mes '), 1,'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 9.7);
        $this->pdf->SetX($x - 47.5);
        $this->pdf->Cell(28.1, 9.7, utf8_decode('Real acumulado'), 1, 1, 'C');

        $this->pdf->Cell(80, 6, utf8_decode('A'), 1, 0, 'C');
        $this->pdf->Cell(18, 6, utf8_decode('B'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('C'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode('1'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode('2'), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode('3'), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode('4'), 1, 0, 'C');
        $this->pdf->Cell(28.1, 6, utf8_decode('5'), 1, 1, 'C');


        $this->pdf->Cell(260, 6, utf8_decode('INDICADORES DE EMPLEO '), 1, 1, 'L');
        $this->pdf->SetFont('Times', '', 11);
        $this->pdf->Cell(80, 6, utf8_decode('  Promedio de Trabajadores Total'), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('0100'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($datosanterior['promedio']['total']['total']), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($datosanterior['suma']['total']['total']), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode($datospromplan['suma']['total']['total']), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode($datosactual['promedio']['total']['total']), 1, 0, 'C');
        $this->pdf->Cell(28.1, 6, utf8_decode($datosactual['suma']['total']['total']), 1, 1, 'C');

        $this->pdf->Cell(80, 6, utf8_decode('        De ello: Mujeres'), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('0110'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($datosanterior['promedio']['total']['mujer']), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($datosanterior['suma']['total']['mujer']), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode(), 1, 0, 'C', 1);
        $this->pdf->Cell(28, 6, utf8_decode($datosactual['promedio']['total']['mujer']), 1, 0, 'C');
        $this->pdf->Cell(28.1, 6, utf8_decode($datosactual['suma']['total']['mujer']), 1, 1, 'C');

        $this->pdf->Cell(80, 6, utf8_decode('  Número de Trabajadores'), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('0200'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($datosanterior['suma']['total']['total']), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode(), 1, 0, 'C', 1);
        $this->pdf->Cell(28, 6, utf8_decode(), 1, 0, 'C', 1);
        $this->pdf->Cell(28, 6, utf8_decode($datosactual['suma']['total']['total']), 1, 0, 'C');
        $this->pdf->Cell(28.1, 6, utf8_decode(), 1, 1, 'C', 1);

        $this->pdf->Cell(80, 6, utf8_decode('            De ellos: mujeres'), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode('U'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('0300'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($datosanterior['suma']['total']['mujer']), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode(), 1, 0, 'C', 1);
        $this->pdf->Cell(28, 6, utf8_decode(), 1, 0, 'C', 1);
        $this->pdf->Cell(28, 6, utf8_decode($datosactual['suma']['total']['mujer']), 1, 0, 'C');
        $this->pdf->Cell(28.1, 6, utf8_decode(), 1, 1, 'C', 1);

        $this->pdf->Cell(80, 14, utf8_decode('  Tiempo trabajado '), 1, 0, 'L');
        $this->pdf->MultiCell(18, 7, utf8_decode('Hombres-  Horas'), 1, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 14);
        $this->pdf->SetX($x + 98);
        $this->pdf->Cell(13, 14, utf8_decode('0500'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 14, utf8_decode($horasactant['ant']), 1, 0, 'C');
        $this->pdf->Cell(32.5, 14, utf8_decode($horasactant['realant']), 1, 0, 'C');
        $this->pdf->Cell(28, 14, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(28, 14, utf8_decode($horasactant['act']), 1, 0, 'C');
        $this->pdf->Cell(28.1, 14, utf8_decode($horasactant['realact']), 1, 1, 'C');

        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(260, 6, utf8_decode('INDICADORES DE LA REMUNERACIÓN '), 1, 1, 'L');
        $this->pdf->SetFont('Times', '', 11);
        $this->pdf->Cell(80, 6, utf8_decode(' Salarios y sueldos devengados'), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode('MP'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('1100'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($remuneracion['ant']), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($remuneracion['realant']), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode($remuneracion['plan']), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode($remuneracion['actual']), 1, 0, 'C');
        $this->pdf->Cell(28.1, 6, utf8_decode($remuneracion['realactual']), 1, 1, 'C');

        $this->pdf->Cell(80, 6, utf8_decode('        De ello: Mujeres'), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode('MP'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('1200'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($remuneracion['mujerant']), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode( $remuneracion['mujerrealant']), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(28, 6, utf8_decode($remuneracion['mujeractual']), 1, 0, 'C');
        $this->pdf->Cell(28.1, 6, utf8_decode($remuneracion['mujerrealactual']), 1, 1, 'C');

        $this->pdf->Cell(80, 6, utf8_decode(' Otros Ingresos'), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode('MP'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('1400'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(32.5, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(28, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(28, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(28.1, 6, utf8_decode(''), 1, 1, 'C',1);

        $this->pdf->Cell(80, 6, utf8_decode(' Aporte en CUC'), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode('MCUC'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('2100'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(32.5, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(28, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(28, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(28.1, 6, utf8_decode(''), 1, 1, 'C',1);

        $this->pdf->Cell(80, 6, utf8_decode(' Gasto en CUC para la estimulación'), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode('MCUC'), 1, 0, 'C');
        $this->pdf->Cell(13, 6, utf8_decode('2200'), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(32.5, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(28, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(28, 6, utf8_decode(''), 1, 0, 'C',1);
        $this->pdf->Cell(28.1, 6, utf8_decode(''), 1, 1, 'C',1);

        $sumaant=$datosanterior['promedio']['total']['total'] + $datosanterior['promedio']['total']['mujer']+$datosanterior['suma']['total']['total']+$datosanterior['suma']['total']['mujer'] + $horasactant['sumahant'] + $remuneracion['ant']+ $remuneracion['mujerant'] ;
        $sumaacumant=$datosanterior['suma']['total']['total']+$datosanterior['suma']['total']['mujer']+$horasactant['sumahacumant']+$remuneracion['realant']+ $remuneracion['mujerrealant'];
        $sumaplan=$datospromplan['suma']['total']['total']+$remuneracion['plan'];
        $sumaact=$datosactual['promedio']['total']['total'] + $datosactual['promedio']['total']['mujer']+$datosactual['suma']['total']['total']+$datosactual['suma']['total']['mujer'] + $horasactant['sumahact'] + $remuneracion['actual']+ $remuneracion['mujeractual'] ;
        $sumaacumact=$datosactual['suma']['total']['total']+$datosactual['suma']['total']['mujer']+$horasactant['sumahacumact']+$remuneracion['realactual']+ $remuneracion['mujerrealactual'];;

        $this->pdf->SetFont('Times', 'B', 11);
        $this->pdf->Cell(80, 6, utf8_decode(' Suma de control '), 1, 0, 'L');
        $this->pdf->Cell(18, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(13, 6, utf8_decode('9999'), 1, 0, 'C');
         $this->pdf->SetFont('Times', '', 11);
        $this->pdf->Cell(32.5, 6, utf8_decode($sumaant), 1, 0, 'C');
        $this->pdf->Cell(32.5, 6, utf8_decode($sumaacumant), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode($sumaplan), 1, 0, 'C');
        $this->pdf->Cell(28, 6, utf8_decode($sumaact), 1, 0, 'C');
        $this->pdf->Cell(28.1, 6, utf8_decode($sumaacumact), 1, 1, 'C');

        $this->pdf->Ln(10);
        $this->pdf->Cell(210, 6, utf8_decode(''), 0, 0, 'C');
        $this->pdf->Cell(50, 6, utf8_decode('Pagina 2 de 3'), 0, 1, 'C');
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(260, 6, utf8_decode('SECCIÓN 2 SOLO PARA SER LLENADO POR LAS EMPLEADORAS '), 1, 1, 'L');
        $this->pdf->SetFont('Times', '', 10);
        $this->pdf->MultiCell(35, 6, utf8_decode('Código del centro  que  se informa '), 1, 'L', 'L');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        //_r($y);die;
        $this->pdf->SetY($y - 12);
        $this->pdf->SetX($x + 35);
        $this->pdf->Cell(26, 12, utf8_decode('Código DPA'), 1, 0, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        //_r($y);die;
        $this->pdf->SetY($y - 0);
        $this->pdf->SetX($x + 0);
        $this->pdf->MultiCell(40, 6, utf8_decode('Promedio de Trabajadores Total (U)'), 1, 'L', 'L');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 12);
        $this->pdf->SetX($x + 101);
        $this->pdf->Cell(79.5, 6, utf8_decode('Número de Trabajadores (U)'), 1, 0, 'C');
        $this->pdf->Cell(79.5, 6, utf8_decode('Salarios y Sueldos devengados (MP) '), 1, 0, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        //_r($y);die;
        $this->pdf->SetY($y + 6);
        $this->pdf->SetX($x - 159);
        $this->pdf->Cell(39.75, 6, utf8_decode('Total'), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode('De ellos Mujeres:'), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode('Total'), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode('De ellos Mujeres:'), 1, 1, 'C');
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(35, 6, utf8_decode('A'), 1, 0, 'C');
        $this->pdf->Cell(26, 6, utf8_decode('1'), 1, 0, 'C');
        $this->pdf->Cell(40, 6, utf8_decode('2'), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode('3'), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode('4'), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode('5'), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode('6'), 1, 1, 'C');
        $this->pdf->SetFont('Times', '', 10);

        for ($i = 0; $i <= 13; $i++) {
            $this->pdf->Cell(35, 6, utf8_decode(''), 1, 0, 'C');
            $this->pdf->Cell(26, 6, utf8_decode(''), 1, 0, 'C');
            $this->pdf->Cell(40, 6, utf8_decode(''), 1, 0, 'C');
            $this->pdf->Cell(39.75, 6, utf8_decode(''), 1, 0, 'C');
            $this->pdf->Cell(39.75, 6, utf8_decode(''), 1, 0, 'C');
            $this->pdf->Cell(39.75, 6, utf8_decode(''), 1, 0, 'C');
            $this->pdf->Cell(39.75, 6, utf8_decode(''), 1, 1, 'C');
        }

        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(35, 6, utf8_decode('Suma de control'), 1, 0, 'C');
        $this->pdf->SetFont('Times', '', 10);
        $this->pdf->Cell(26, 6, utf8_decode(''), 1, 0, 'C', 1);
        $this->pdf->Cell(40, 6, utf8_decode(''), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode(''), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode(''), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode(''), 1, 0, 'C');
        $this->pdf->Cell(39.75, 6, utf8_decode(''), 1, 1, 'C');
        $this->pdf->SetFont('Times', '', 10);

        $this->pdf->Ln(10);


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
        $texto = "Certificamos que los datos contenidos en este formulario correspon-  den a los  anotados en nuestros registros primarios; así como también, que dicho formulario se ha confeccionado de acuerdo con las    instrucciones  metodológicas vigentes   para su elaboración.";
        $cont = 0;
        while (strlen($texto) > 68) {
            $this->pdf->Cell(120, 9, utf8_decode(substr($texto, 0, 68)), 0, 1, 'L');
            $texto = substr($texto, 68, strlen($texto));
        }

        $this->pdf->Cell(120, 9, utf8_decode($texto), 0, 0, 'L');

        $this->pdf->Sety($y2);
        $this->pdf->SetX($x2);
        $this->pdf->SetFont('Times', 'B', 9);

        $this->pdf->Cell(60, 8, utf8_decode('VICEDIRECTOR ECONÓMICO'), 0, 0, 'C');
        $this->pdf->Cell(50, 9, utf8_decode('DIRECTOR'), 0, 0, 'C');
        $this->pdf->Cell(50, 9, utf8_decode('FECHA'), 0, 1, 'C');
        $this->pdf->SetX($x2);
        $this->pdf->Cell(60, 8, utf8_decode('________________________'), 0, 0, 'C');
        $this->pdf->Cell(50, 8, utf8_decode('________________________'), 0, 1, 'C');
        $this->pdf->SetX($x2);
        $this->pdf->Cell(60, 2, utf8_decode('Nombre y Apellidos'), 0, 0, 'C');
        $this->pdf->Cell(50, 2, utf8_decode('Nombre y Apellidos'), 0, 0, 'C');

        $this->pdf->SetX($x2);
        $this->pdf->Cell(60, 17, utf8_decode('____________'), 0, 0, 'C');
        $this->pdf->Cell(50, 17, utf8_decode('____________'), 0, 0, 'C');
        $this->pdf->SetFont('Times', 'B', 12);
        $this->pdf->Cell(50, 1, utf8_decode("   $fecha    "), 0, 1, 'C');
        $this->pdf->SetFont('Times', 'B', 9);
        $this->pdf->SetX($x2);
        $this->pdf->Cell(60, 23, utf8_decode('Firma'), 0, 0, 'C');
        $this->pdf->Cell(50, 23, utf8_decode('Firma'), 0, 0, 'C');
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(50, 8, utf8_decode(' Día / Mes / Año '), 0, 1, 'C');

        $this->pdf->AddPage();
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->SetLineWidth(0.5);


        $this->pdf->Ln(2);

        $this->pdf->Cell(210, 6, utf8_decode(''), 0, 0, 'C');
        $this->pdf->Cell(50, 6, utf8_decode('Pagina 3 de 3'), 0, 1, 'C');

        $this->pdf->SetFillColor(200);
        $this->pdf->Cell(259, 6, utf8_decode('SECCIÓN 3: ALTAS Y BAJAS POR CAUSAS MIGRATORIAS (PERODICIDAD SEMESTRAL) (U)  '), 1, 1, 'L');

        $this->pdf->Cell(123, 14, utf8_decode('Indicadores'), 1, 0, 'C');
        $this->pdf->Cell(12, 14, utf8_decode('Fila'), 1, 0, 'C');
        $this->pdf->MultiCell(20, 7, utf8_decode('Total año anterior '), 1, 'C');
        $x = $this->pdf->getX();
        $y = $this->pdf->getY();
        $this->pdf->SetY($y - 14);
        $this->pdf->SetX($x + 155);
        $this->pdf->Cell(42, 7, utf8_decode('Real año anterior'), 1, 0, 'C');
        $this->pdf->MultiCell(20, 7, utf8_decode('Total año actual '), 1, 'C');
        $this->pdf->SetY($y - 14);
        $this->pdf->SetX($x + 217.2);
        $this->pdf->Cell(41.8, 7, utf8_decode('Real año actual'), 1, 0, 'C');
        $x = $this->pdf->getX();
        $y = $this->pdf->getY();
        $this->pdf->SetY($y + 7);
        $this->pdf->SetX($x -104 );
        $this->pdf->MultiCell(22, 6.9, utf8_decode('Altas'), 1, 'C');
        $x = $this->pdf->getX();
        $y = $this->pdf->getY();
        $this->pdf->SetY($y - 6.9);
        $this->pdf->SetX($x + 177);
        $this->pdf->MultiCell(20, 6.9, utf8_decode('Bajas'), 1, 'C');
        $x = $this->pdf->getX();
        $y = $this->pdf->getY();
        $this->pdf->SetY($y - 7);
        $this->pdf->SetX($x + 217.2);
        $this->pdf->MultiCell(20.5, 6.9, utf8_decode('Altas'), 1, 'C');
        $x = $this->pdf->getX();
        $y = $this->pdf->getY();
        $this->pdf->SetY($y - 7);
        $this->pdf->SetX($x + 237.5);
        $this->pdf->Cell(21.5, 6.9, utf8_decode('Bajas'), 1, 1, 'C');
       // $x = $this->pdf->getX();
        $y = $this->pdf->getY();
        $this->pdf->SetY($y + 0.5);
        $this->pdf->Cell(123, 6, utf8_decode('A'), 1, 0, 'C');
        $this->pdf->Cell(12, 6, utf8_decode('B'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('1'), 1, 0, 'C');
        $this->pdf->Cell(22, 6, utf8_decode('2'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('3'), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode('4'), 1, 0, 'C');
        $this->pdf->Cell(20.5, 6, utf8_decode('5'), 1, 0, 'C');
        $this->pdf->Cell(21.5, 6, utf8_decode('6'), 1, 1, 'C');

        $this->pdf->SetFont('Times', 'B', 11);
        $fecha= $objer->periodoSemestreAnt($semi,$semf);//print_r($fecha);die;
        $semiant=$fecha['inicio']; 
        $semfant=$fecha['fin'];

        $this->pdf->Cell(123, 6, utf8_decode('Del total de trabajadores: Universitarios '), 1, 0, 'L');
        $this->pdf->Cell(12, 6, utf8_decode('2'), 1, 0, 'C');
        $this->pdf->SetFont('Times', '', 11);
        $this->pdf->Cell(20, 6, utf8_decode($objer-> CantPersonasUniversitarias($idestructura,$semiant,$semfant,$idcargos)), 1, 0,'C');
        $this->pdf->Cell(22, 6, utf8_decode($objer-> getAltasEnRangoUniv($idestructura,$semiant,$semfant,$idcargos)), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode($objer-> getBajasEnRangoUniv($idestructura,$semiant,$semfant,$idcargos)), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode($objer-> CantPersonasUniversitarias($idestructura,$semi,$semf,$idcargos)), 1, 0,'C');
        $this->pdf->Cell(20.5, 6, utf8_decode($objer->getAltasEnRangoUniv($idestructura,$semi,$semf,$idcargos)), 1, 0, 'C');
        $this->pdf->Cell(21.5, 6, utf8_decode($objer->getBajasEnRangoUniv($idestructura,$semi,$semf,$idcargos)), 1, 1, 'C');
        $cantunivant=$objer-> CantPersonasUniversitarias($idestructura,$semiant,$semfant,$idcargos);
        $cantaltunivant=$objer-> getAltasEnRangoUniv($idestructura,$semiant,$semfant,$idcargos);
        $cantbajunivant=$objer-> getBajasEnRangoUniv($idestructura,$semiant,$semfant,$idcargos);
        $cantunivact=$objer-> CantPersonasUniversitarias($idestructura,$semi,$semf,$idcargos);
        $cantaltunivact=$objer->getAltasEnRangoUniv($idestructura,$semi,$semf,$idcargos);
        $cantbajunivact=$objer->getBajasEnRangoUniv($idestructura,$semi,$semf,$idcargos);
        $fila = 3;
        $titulos=array();
        foreach ($idesp as $id){
            $this->pdf->SetFont('Times', 'B', 11);
            $this->pdf->MultiCell(123, 9, utf8_decode($objer->NOMEsp($id)), 1, 'C', 'C');
            $x = $this->pdf->GetX();
            $y = $this->pdf->GetY();
            $this->pdf->SetY($y - 8.9);
            $this->pdf->SetX($x + 123);
            $this->pdf->Cell(12, 9, utf8_decode($fila), 1,0, 'C');
            $this->pdf->SetFont('Times', '', 11);
            $this->pdf->Cell(20, 9, utf8_decode($objer->cantPersonasxIDESP($idestructura,$semiant,$semfant,$id,$idcargos)), 1,0, 'C');
            $this->pdf->Cell(22, 9, utf8_decode($objer->getAltasxESPEnRango($idestructura,$semiant,$semfant,$id,$idcargos)), 1,0, 'C');
            $this->pdf->Cell(20, 9, utf8_decode($objer->getBajasxESPEnRango($idestructura,$semiant,$semfant,$id,$idcargos)), 1, 0,'C');
            $this->pdf->Cell(20, 9, utf8_decode($objer->cantPersonasxIDESP($idestructura,$semi,$semf,$id,$idcargos)), 1,0, 'C');
            $this->pdf->Cell(20.5, 9,utf8_decode($objer->getAltasxESPEnRango($idestructura,$semi,$semf,$id,$idcargos)), 1,0, 'C');
            $this->pdf->Cell(21.5, 9,utf8_decode($objer->getBajasxESPEnRango($idestructura,$semi,$semf,$id,$idcargos)), 1, 1, 'C');
            $cantespant+=$objer->cantPersonasxIDESP($idestructura,$semiant,$semfant,$id,$idcargos);
            $cantaltespant+=$objer->getAltasxESPEnRango($idestructura,$semiant,$semfant,$id,$idcargos);
            $cantbajespant+=$objer->getBajasxESPEnRango($idestructura,$semiant,$semfant,$id,$idcargos);
            $cantespact+=$objer->cantPersonasxIDESP($idestructura,$semi,$semf,$id,$idcargos);
            $cantaltespact+=$objer->getAltasxESPEnRango($idestructura,$semi,$semf,$id,$idcargos);
            $cantbajespact+=$objer->getBajasxESPEnRango($idestructura,$semi,$semf,$id,$idcargos);
            $titulos=$objer->Titulos($id); 
            $fila++;
            if (!empty($titulos)) {
                for ($i=0; $i < count($titulos); $i++) { 
                    $this->pdf->SetFont('Times', '', 11);
                    $this->pdf->Cell(123, 9, utf8_decode($objer->FindTitulosxID($titulos[$i]['idtitulo'])), 1 , 0 , 'L');
                    $this->pdf->Cell(12, 9, utf8_decode($fila), 1, 0 , 'C');
                    $this->pdf->SetFont('Times', '', 11);
                    $this->pdf->Cell(20, 9, utf8_decode($objer->cantPersonasxIDTitulo($idestructura, $semiant, $semfant,$titulos[$i]['idtitulo'],$idcargos)), 1, 0 , 'C');
                    $this->pdf->Cell(22, 9, utf8_decode($objer->getAltasxTituloEnRango($idestructura, $semiant, $semfant,$titulos[$i]['idtitulo'],$idcargos) ), 1, 0 , 'C'); 
                    $this->pdf->Cell(20, 9, utf8_decode($objer->getBajasxTituloEnRango($idestructura, $semiant, $semfant,$titulos[$i]['idtitulo'],$idcargos) ), 1,0, 'C');
                    $this->pdf->Cell(20, 9, utf8_decode($objer->cantPersonasxIDTitulo($idestructura, $semi, $semf, $titulos[$i]['idtitulo'],$idcargos)), 1,0, 'C');
                    $this->pdf->Cell(20.5, 9, utf8_decode($objer->getAltasxTituloEnRango($idestructura, $semi, $semf,$titulos[$i]['idtitulo'],$idcargos)), 1,0, 'C');
                    $this->pdf->Cell(21.5, 9, utf8_decode($objer->getBajasxTituloEnRango($idestructura, $semi, $semf,$titulos[$i]['idtitulo'],$idcargos)), 1, 1, 'C');
                    $canttitant+=$objer->cantPersonasxIDTitulo($idestructura, $semiant, $semfant,$titulos[$i]['idtitulo'],$idcargos);
                    $cantalttitant+=$objer->getAltasxTituloEnRango($idestructura, $semiant, $semfant,$titulos[$i]['idtitulo'],$idcargos) ;
                    $cantbajtitant+=$objer->getBajasxTituloEnRango($idestructura, $semiant, $semfant,$titulos[$i]['idtitulo'],$idcargos) ;
                    $canttitact+=$objer->cantPersonasxIDTitulo($idestructura, $semi, $semf, $titulos[$i]['idtitulo'],$idcargos);
                    $cantalttitact+=$objer->getAltasxTituloEnRango($idestructura, $semi, $semf,$titulos[$i]['idtitulo'],$idcargos);
                    $cantbajtitact+=$objer->getBajasxTituloEnRango($idestructura, $semi, $semf,$titulos[$i]['idtitulo'],$idcargos);
                    $fila++;
                }
            }
        }

        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->Cell(123, 6, utf8_decode('Suma de Control'), 1, 0, 'C');
        $this->pdf->Cell(12, 6, utf8_decode('99'), 1, 0, 'C');
        $this->pdf->SetFont('Times', '', 10);
        $this->pdf->Cell(20, 6, utf8_decode($cantunivant+$cantespant+$canttitant), 1, 0, 'C');
        $this->pdf->Cell(22, 6, utf8_decode($cantaltunivant+$cantaltespant+$cantalttitant), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode($cantbajunivant+$cantbajespant+$cantbajtitant), 1, 0, 'C');
        $this->pdf->Cell(20, 6, utf8_decode($cantunivact+$cantespact+$canttitact), 1, 0, 'C');
        $this->pdf->Cell(20.5, 6, utf8_decode($cantaltunivact+$cantaltespact+$cantalttitact), 1, 0, 'C');
        $this->pdf->Cell(21.5, 6, utf8_decode($cantbajunivact+$cantbajespact+$cantbajtitact), 1, 1, 'C');

        return $this->pdf;
    }

    private function crearEncabezadoPrincipalER($anno, $mes, $centroInformante, $variantes)
    {
        $this->pdf->SetLeftMargin(10);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Times', 'B', 10);
        $this->pdf->SetLineWidth(0.5);

        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y + 5);
        $this->pdf->SetX($x);

        $this->pdf->Cell(40, 20, 'ONEI', 1, 0, 'C', 0);
        $this->pdf->Image('views/images/ONEI.png', $x + 0.5, $y + 6, 40, 19);
        $this->pdf->MultiCell(50,10, utf8_decode('Sistema de Información Estadístico Nacional (SIEN)'), 1, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 20);
        $this->pdf->SetX($x + 90);
        $this->pdf->MultiCell(120, 10, utf8_decode('INDICADORES SELECCIONADOS DEL EMPLEO Y LA REMUNERACIÓN '), 1, 'C');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 20);
        $this->pdf->SetX($x + 210);
        $this->pdf->MultiCell(50, 5, utf8_decode('         Formulario No.5202-05                  Página 1 de 3        MENSUAL / TRIMESTRAL / SEMESTRAL / ANUAL '), 1, 'R');
        $this->pdf->Cell(150, 10, utf8_decode("INFORME ACUMULADO HASTA:   MES $mes -- AÑO $anno  "), 1, 0, 'C', 0);
        $this->pdf->Cell(110, 10, utf8_decode('Unidad de medida: La indicada con un decimal '), 1, 0, 'C', 0);
        $this->pdf->SetY($y + 10);
        $this->pdf->MultiCell(260, 7, utf8_decode('Variantes:                               () 1   Entidades Estatales                                                                                               () 3     Asociaciones y fundaciones                                                                                                   () 2     Sociedades Mercantiles                                                                                      () 4   Organizaciones Políticas y de Masas   '), 1, 'L');
        $this->pdf->Cell(150, 10, utf8_decode("Centro informante: {$centroInformante['denominacion']}"), 1, 0, 'L', 0);
        $this->pdf->Cell(110, 10, utf8_decode("Código del centro informante: {$centroInformante['codigo']}"), 1, 0, 'L', 0);
        $this->pdf->Ln(13);
    }
}