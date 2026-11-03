
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

class ReportepdfmodeloModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {
        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura)
    {
        $pdf = new PDFFuerzatrabajo('L', 'mm', 'a3');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        //Aqui se obtiene los arreglos de datos para nutrir el pdf:
        $datos = DatSituacionlaboralModel::getTrabajadoresPorCategoria($idestructura);
        $datosPorMunicipioResult = DatSituacionlaboralModel::getTrabajadoresPorCategoriaPorMunicipio($idestructura);
        $datosPorMunicipio = $datosPorMunicipioResult['datos'];
        $datosPorMuniSuma = $datosPorMunicipioResult['sumadatos'];
        $centroInformante = DatSituacionlaboralModel::getDatosCentroInformante($idestructura);
        $fecha = date('d/m/Y');
        list($dia, $mes, $anno) = explode('/', $fecha);
        $dia = null;
        $this->crearEncabezadoPrincipal($anno, $mes, $centroInformante);
        $pdfNGeneral = $this->crearCuerpo($datos, $fecha, $centroInformante, $datosPorMunicipio, $datosPorMuniSuma);
        ob_end_clean();                           //limpia el buffer de salida para poder generar el pdf
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($datos, $fecha, $centroInformante, $datosPorMunicipio, $datosPorMuniSuma)
    {
        $this->pdf->Cell(258, 8, utf8_decode(''), 0, 0, 'L', 0);
        $this->pdf->Cell(272, 8, utf8_decode('Categoría ocupacional'), 1, 0, 'C', 0);
        $this->pdf->Ln(8);

        $this->pdf->Cell(80, 18, utf8_decode('Nivel escolar terminado'), 1, 0, 'C', 0);
        $this->pdf->MultiCell(15, 9, utf8_decode('Fila No.'), 1, 'C');

        $denominacion = ['Total', 'Mayores de la edad laboral', 'Menores de la edad laboral', 'Operarios', 'Servicios', 'Técnicos', 'Administrativos', 'Directivos'];
        $sum = 0;
        $aux = 12;
        foreach ($denominacion as $value) {
            if (strlen($value) > 17) {
                $aux = 6;
            } else {
                $aux = 12;
            }
            $x = $this->pdf->GetX();
            $y = $this->pdf->GetY();
            $x += 95 + $sum;
            $y -= 18;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(54.375, $aux, utf8_decode($value), 1, 'C');
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(27.1875, 6, utf8_decode('Total'), 1, 'C');
            $this->pdf->SetY($y + 12);
            $this->pdf->SetX($x + 27.1875);
            $this->pdf->MultiCell(27.1875, 6, utf8_decode('Mujer'), 1, 'C');
            $sum += 54.375;
        }
        $this->pdf->Cell(80, 6, utf8_decode('A'), 1, 0, 'C', 0);
        $this->pdf->Cell(15, 6, utf8_decode('B'), 1, 0, 'C', 0);
        $numeracion = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
        foreach ($numeracion as $valor) {
            $this->pdf->Cell(27.1875, 6, utf8_decode($valor), 1, 0, 'C', 0);
        }

        $this->pdf->Ln(6);
        //Aqui lleno la tabla con las estadisticas obtenidas de la BD:
        $incremento = 1;
        foreach ($datos as $k => $valores) {
            $this->pdf->SetFont('Times', 'B', 16);
            $this->pdf->Cell(80, 7, utf8_decode($valores['niveleducacional']), 1, 0, 'L', 0);
            $this->pdf->Cell(15, 7, utf8_decode($incremento), 1, 0, 'C', 0);

            foreach ($valores as $key => $v) {
                $this->pdf->SetFont('Times', '', 16);
                if ($key != 'niveleducacional') {
                    $n = $v;
                    if (empty($v)) {
                        $n = 0;
                    }
                    $this->pdf->Cell(27.1875, 7, $n, 1, 0, 'C', 0);
                }
            }

            $this->pdf->Ln(7);
            $incremento += 1;
        }
        $this->pdf->SetFont('Times', 'B', 16);
        $this->pdf->Ln(7);

        $this->pdf->Cell(530, 7, utf8_decode('Certificamos que los datos contenidos en este modelo corresponden a los anotados en nuestros registros primarios y de acuerdo a las intrucciones vigentes para la elaboración del mismo'), 1, 0, 'L', 0);
        $this->pdf->Ln(7);
        $this->pdf->Cell(215, 8, utf8_decode('VICEDIRECTOR ECONÓMICO'), 1, 0, 'L', 0);
        $this->pdf->Cell(215, 8, utf8_decode('DIRECTOR'), 1, 0, 'L', 0);
        $this->pdf->MultiCell(100, 10.666, utf8_decode("   Fecha                                                                                            $fecha                                                 Día Mes Año "), 1, 'L');
        $y = $this->pdf->GetY();
        $x = $this->pdf->GetX();
        $this->pdf->SetY($y - 24);
        $this->pdf->Cell(215, 8, utf8_decode('Nombre y apellidos'), 1, 0, 'L', 0);
        $this->pdf->Cell(215, 8, utf8_decode('Nombre y apellidos'), 1, 0, 'L', 0);
        $this->pdf->SetY($y - 16);
        $this->pdf->SetX($x - 564.6);
        $this->pdf->Cell(215, 16, utf8_decode('Firma'), 1, 0, 'L', 0);
        $this->pdf->Cell(215, 16, utf8_decode('Firma'), 1, 0, 'L', 0);

        //Reverso:
        $this->pdf->AddPage();

        $this->pdf->Cell(530, 7, utf8_decode('Solo para ser llenado por las entidades que reportan centralmente sus establecimientos                                                                                                                                                                                                           Página 2 de 2'), 1, 0, 'L', 0);
        $this->pdf->Ln(7);
        $this->pdf->Cell(530, 7, utf8_decode('                                                                                                                                                                                                                                                                                                                                            Unidad de medida: UNO'), 0, 0, 'L', 0);
        $this->pdf->Ln(7);
        $this->pdf->Cell(420, 14, utf8_decode("Centro informante: {$centroInformante['denominacion']}"), 1, 0, 'L', 0);
        $this->pdf->MultiCell(110, 7, utf8_decode("Código del centro                          informante:                         {$centroInformante['codigo']}"), 1, 'L');
        $this->pdf->Ln(3);


        $this->pdf->Cell(73, 18, utf8_decode('Municipio'), 1, 0, 'C', 0);
        $this->pdf->MultiCell(22, 9, utf8_decode('Código DPA'), 1, 'C');

        $denominacion = ['Total', 'Mayores de la edad laboral', 'Menores de la edad laboral', 'Operarios', 'Servicios', 'Técnicos', 'Administrativos', 'Directivos'];
        $sum = 0;
        $aux = 12;
        foreach ($denominacion as $value) {
            if (strlen($value) > 17) {
                $aux = 6;
            } else {
                $aux = 12;
            }
            $x = $this->pdf->GetX();
            $y = $this->pdf->GetY();
            $x += 95 + $sum;
            $y -= 18;
            $this->pdf->SetY($y);
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(54.375, $aux, utf8_decode($value), 1, 'C');
            $this->pdf->SetX($x);
            $this->pdf->MultiCell(27.1875, 6, utf8_decode('Total'), 1, 'C');
            $this->pdf->SetY($y + 12);
            $this->pdf->SetX($x + 27.1875);
            $this->pdf->MultiCell(27.1875, 6, utf8_decode('Mujer'), 1, 'C');
            $sum += 54.375;
        }

        $this->pdf->Cell(73, 6, utf8_decode('A'), 1, 0, 'C', 0);
        $this->pdf->Cell(22, 6, utf8_decode('B'), 1, 0, 'C', 0);
        $numeracion = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];
        foreach ($numeracion as $valor) {
            $this->pdf->Cell(27.1875, 6, utf8_decode($valor), 1, 0, 'C', 0);
        }
        $this->pdf->Ln(6);

        //Aqui lleno la tabla con las estadisticas obtenidas de la BD:

        foreach ($datosPorMunicipio as $k => $valoresm) {
            $this->pdf->SetFont('Times', 'B', 16);
            $this->pdf->Cell(73, 7, utf8_decode($valoresm['municipio']), 1, 0, 'L', 0);
            $this->pdf->Cell(22, 7, utf8_decode($valoresm['codigodpa']), 1, 0, 'C', 0);

            foreach ($valoresm as $key => $v) {
                $this->pdf->SetFont('Times', '', 16);
                if ($key != 'municipio' && $key != 'codigodpa') {
                    $n = $v;
                    if (empty($v)) {
                        $n = 0;
                    }
                    $this->pdf->Cell(27.1875, 7, $n, 1, 0, 'C', 0);
                }
            }

            $this->pdf->Ln(7);
        }
        $this->pdf->SetFont('Times', 'B', 16);

        $this->pdf->MultiCell(73, 7, utf8_decode('Suma de control            (Página 2 de 2)'), 1, 'L');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $x += 73;
        $y -= 14;
        $this->pdf->SetY($y);
        $this->pdf->SetX($x);
        $this->pdf->SetFillColor(192, 192, 192);
        $this->pdf->Cell(22, 14, utf8_decode(''), 1, 0, 'C', 1);

        foreach ($datosPorMuniSuma as $key => $value) {
            $this->pdf->Cell(27.1875, 14, utf8_decode($value), 1, 0, 'C', 0);
        }
        return $this->pdf;
    }

    private function crearEncabezadoPrincipal($anno, $mes, $centroInformante)
    {
        $this->pdf->SetLeftMargin(15);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Times', 'B', 16);
        $this->pdf->SetLineWidth(0.5);

        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y + 20);
        $this->pdf->SetX($x);

        $this->pdf->Cell(80, 25, 'ONEI', 1, 0, 'C', 0);
        $this->pdf->Image('views/images/ONEI.png', $x + 1, $y + 21, 78, 23);
        $this->pdf->MultiCell(65, 8.33, utf8_decode('Sistema de Información Estadístico Nacional (SIEN)'), 1, 'L');
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->SetY($y - 25);
        $this->pdf->SetX($x + 145);
        $this->pdf->Cell(
            330, 25, utf8_decode('NÚMERO DE TRABAJADORES POR CATEGORÍA OCUPACIONAL, SEXO Y NIVEL DE ESCOLARIDAD'),
            1, 0, 'C', 0
        );
        $this->pdf->MultiCell(55, 8.33, utf8_decode('Modelo No. 5205-01 Página 1 de 2 ANUAL'), 1, 'C');
        $this->pdf->Cell(370, 10, utf8_decode("INFORME ACUMULADO HASTA: MES $mes AÑO $anno"), 1, 0, 'C', 0);
        $this->pdf->Cell(160, 10, utf8_decode('Unidad de medida: UNO'), 1, 0, 'C', 0);
        $this->pdf->SetY($y + 10);
        $this->pdf->MultiCell(530, 10, utf8_decode('Entidades Estatales             () 1                                                                                                                                      Asociaciones y fundaciones                       () 3                                                                                                         Sociedades Mercantiles       () 2                                                                                                                                      Organizaciones Políticas y de Masas       () 4'), 1, 'L');
        $this->pdf->Cell(400, 10, utf8_decode("Centro informante: {$centroInformante['denominacion']}"), 1, 0, 'L', 0);
        $this->pdf->Cell(
            130, 10, utf8_decode("Código del centro informante: {$centroInformante['codigo']}"), 1, 0, 'L', 0
        );
        $this->pdf->Ln(15);
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

}