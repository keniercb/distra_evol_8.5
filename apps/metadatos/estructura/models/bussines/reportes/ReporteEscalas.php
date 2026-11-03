<?php

class ReporteEscalas extends fpdf
{
    private $pdf;
    private $table;
    private $widthInd;
    private $datosEscalas;

    /**
     * Constructor de la clase que inicializa el pdf y la tabla para la construccion de las mismas.
     *
     * @param $datosEscalas
     */
    public function __construct($datosEscalas)
    {
        $this->pdf = new fpdf('P', 'mm', 'Letter');
        $this->table = new Table($this->pdf);
        $this->widthInd = 300;
        $this->datosEscalas = $datosEscalas;
    }

    /**
     * Funcion encargada de la creacion del contenido del pdf
     * setea los margenes y el color de relleno para las cabeceras de las tablas,
     * asi como la propiedad de autoPageBreak para el salto de contenido
     */
    public function createPDF()
    {
        ob_start();
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(12);
        $this->pdf->SetFillColor(220, 220, 220);
        $this->pdf->SetAutoPageBreak(true, 20);
        $datos = $this->datosEscalas['datos'];
        $escalas = $this->datosEscalas['escalas'];
        if (count($datos) && count($escalas)) {
            $this->headerReport();
            $this->constructHeaderTable();
            $this->constructValuesTable();
            $this->pdf->Output();
            ob_flush();
        } else {
            echo(Zend_Json::encode(
                          array(
                              "codMsg" => "1", "mensaje" => "No existen valores disponibles para generar el reporte.")
            ));
        }
    }

    /**
     * Construye la cabecera del reporte, incluyendo el texto inicial de los datos del proyectp
     */
    public function headerReport()
    {
        /**
         * Inserta una nueva pagina lateral con la imagen de fondo superior y el numero de la pagina
         */
        $this->newPage();
        /**
         * Construye el titulo del reporte
         */
        $this->pdf->SetFont('Arial', '', 12);
        $this->pdf->SetY(20);
        $this->pdf->MultiCell(0, 5, 'Reporte', 0, 'C');
        $this->pdf->MultiCell(0, 5, 'Escalas salariales', 0, 'C');
        $this->pdf->Ln(10);
    }

    public function constructHeaderTable()
    {
        $this->Ln(10);
        $datos = $this->datosEscalas['escalas'];
        $size = $size = $this->pdf->fw / count($datos) + 4;
        $widthTable = array(15);
        $alignTable = array('C');
        $valores = array('G/P');
        foreach ($datos as $tipoEscalas) {
            $denominacion = utf8_decode($tipoEscalas['denominacion']);
            $valores[] = $denominacion;
            $widthTable[] = $size;
            $alignTable[] = 'C';
        }
        $this->table->SetAligns($alignTable);
        $this->table->SetWidths($widthTable);
        $this->pdf->SetFont('Arial', 'B', 9);
        $this->pdf->Ln(2);
        $this->table->Row($valores);
        $this->pdf->SetFont('Arial', '', 9);
    }

    public function constructValuesTable()
    {
        $datos = $this->datosEscalas['datos'];
        $escalas = $this->datosEscalas['escalas'];
        foreach ($datos as $grupocomplejidad => $tiposEscalas) {
            $valores = array(utf8_decode($grupocomplejidad));
            foreach ($tiposEscalas as $escala) {
                $salarios = $escala['salarios'];
                if (is_array($salarios)) {
                    $dataSalario = '';
                    $existe = false;
                    foreach ($salarios as $salario) {
                        if (!$existe && $salario['existe']) {
                            $existe = true;
                        }
                        $dataSalario = $this->asignaValorDataSalario($dataSalario, $salario);
                    }
                    $valores = $this->asignaValores($existe, $dataSalario, $valores);
                } else {
                    foreach ($escalas as $escala) {
                        $valores[] = '';
                    }
                }
            }
            $this->testStatusPage(4);
            $this->pdf->SetFont('Arial', '', 10);
            $this->table->Row($valores);
        }
    }

    /**
     * Funcion encargada de comprobar si queda espacio disponible para mostrar el contenido, sino, salto de linea
     *
     * @param $countToTest
     */
    private function testStatusPage($countToTest)
    {
        $maxPos = $this->pdf->hPt / $this->pdf->k - 20;
        if (($this->pdf->GetY() + ($countToTest * 2)) >= $maxPos) {
            $this->newPage();
            $this->pdf->SetY(20);
            $this->constructHeaderTable();
        }
    }

    /**
     * Funcion para añadir la imagen de fondo superior de las paginas
     */
    private function setTopPage()
    {
        $this->pdf->SetY(10);
        $dir = $_SERVER['DOCUMENT_ROOT'] . '/metadatos/comun/recursos/imagenes/borde.jpg';
        $this->pdf->Image($dir, 0, 0, 0, 30, 'jpg', '');
    }

    /**
     * Funcion encargada de crear una nueva pagina con todos los elementos necesarios en la misma, dígase
     * fondo superior, numero de pagina y orientacion horizontal
     */
    private function newPage()
    {
        $this->pdf->AddPage('L');
        $this->setTopPage();
        $this->pdf->SetFont('Arial', '', 10);
        $this->pdf->Cell(0, 5, utf8_decode('Página: ' . $this->pdf->PageNo()), 0, 0, 'R');
    }

    /**
     * @param $dataSalario
     * @param $salario
     *
     * @return string
     */
    private function asignaValorDataSalario($dataSalario, $salario)
    {
        if ($dataSalario == '') {
            $dataSalario = $salario['salario'];

            return $dataSalario;
        } else {
            $dataSalario = $dataSalario . ', ' . $salario['salario'];

            return $dataSalario;
        }
    }

    /**
     * @param $existe
     * @param $dataSalario
     * @param $valores
     *
     * @return array
     */
    private function asignaValores($existe, $dataSalario, $valores)
    {
        if (!$existe) {
            $valores[] = array('text' => $dataSalario);

            return $valores;
        } else {
            $valores[] = array(
                'text' => $dataSalario, 'border' => 1, 'black' => $existe, 'fill' => 1, 'size' => 9);

            return $valores;
        }
    }
}