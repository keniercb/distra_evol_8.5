<?php

/**
 * Class ReporteCargos
 */
class ReporteCargos extends fpdf
{
    /**
     * @var fpdf
     */
    private $pdf;
    /**
     * @var Table
     */
    private $table;
    /**
     * @var
     */
    private $config;
    /**
     * @var
     */
    private $datosPlantilla;
    /**
     * @var bool
     */
    private $flag = false;
    /**
     * @var
     */
    private $widthFormato;
    /**
     * @var
     */
    private $heightFormato;
    /**
     * @var
     */
    private $valorComprobante;
    /**
     * @var EstructuraModel
     */
    private $estructura;
    /**
     * @var DatEstructuraModel
     */
    private $datestructura;
    /**
     * @var
     */
    private $indice;

    /**
     * Constructor de la clase
     *
     * @author Ing. Osvaldo M. Gonzales
     *
     * @param $config
     * @param $datos
     */
    public function __construct($config, $datos)
    {
        $this->estructura = new EstructuraModel();
        $this->datestructura = new DatEstructuraModel();
        $this->pdf = new fpdf('L', 'mm', $config['formato']);
        $this->table = new Table($this->pdf);
        $this->pdf->SetMargins(5, 5, 50);
        $this->config = $config;
        $this->widthFormato = $this->pdf->fwPt;
        $this->heightFormato = $this->pdf->fhPt;
        $this->valorComprobante();
        $this->asignaValores($config, $datos, $entidades, $estructuras);
        $entidades = array_merge($entidades, $estructuras);
        $this->asignarValoresTemporales($entidades, $aPadres);
        $this->datosPlantilla['datos'] = $this->estructura->dameCategoriasPorEntidad($aPadres, $config['idproyecto']);

    }

    /**
     * Funcion para asignar los totales a las tablas
     *
     * @param $pos
     * @param $alingsArray
     * @param $flagBreak
     * @param $heads
     * @param $valores
     * @param $withArray
     */
    private static function asignarTotales($pos, &$alingsArray, $flagBreak, $heads, &$valores, &$withArray)
    {
        $alingsArray[] = 'C';
        if ($flagBreak == count($heads) && $pos != 0) {
            $alingsArray[] = 'C';
            $valores [] = array('text' => utf8_decode('SubTotal'));
            $withArray[] = 20;
            $valores [] = array('text' => utf8_decode('Total'));
            $withArray[] = 15;
        } else {
            if ($flagBreak == count($heads) && $pos == 0) {
                $valores [] = array('text' => utf8_decode('Total'));
                $withArray[] = 15;
            } else {
                $valores [] = array('text' => utf8_decode('SubTotal'));
                $withArray[] = 20;
            }
        }
    }

    /**
     * Se inicializa la clase pdf
     *
     * @author Ing. Osvaldo M. Gonzales
     */
    public function createPDF()
    {
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(12);
        $this->pdf->SetFillColor(79, 129, 189);
        $this->pdf->SetAutoPageBreak(true);
        $this->resumen();
    }

    /**
     * Funcion encargada de construir el reporte
     *
     * @author: Ing. Osvaldo M. Gonzales
     * @modify: Ing. Daymel Machado
     */
    public function resumen()
    {
        ob_start();
        $this->generateResumen();
        if (!$this->flag) {
            echo(Zend_Json::encode(
                          array(
                              "codMsg" => "1", "mensaje" => "No existen valores disponibles para generar el reporte.")
            ));
        } else {
            $this->pdf->Output();
            ob_flush();
        }
    }

    /**
     * Funcion para crear el encabezado de la tabla
     *
     * @author Ing. Osvaldo M. Gonzales
     * @modify Ing. Daymel Machado
     *
     * @param $inicial
     * @param $text
     */
    private function createHeader($inicial, $text)
    {
        $this->pdf->SetFont('Arial', '', 10);
        $this->crearHeaderProyecto($inicial);
        $this->pdf->SetY(15);
        $this->pdf->SetFont('Arial', 'B', 12);
        $this->pdf->Cell(0, 5, utf8_decode('Tabla de organización'), 0, 0, 'C');
        $this->pdf->Ln();
        $this->pdf->SetFont('Arial', '', 10);
        $this->pdf->Cell(0, 5, utf8_decode(Util::fixTitle($text)), 0, 0, 'C');
    }

    /**
     * Función para crear las cabeceras
     *
     * @param $inicial
     * @param $esGrado
     *
     * @author: Ing. Osvaldo M. Gonzales
     * @modify: Ing. Daymel Machado Cabrera
     */
    private function headers($inicial, $esGrado)
    {
        $text = 'Cargos ';
        if ($esGrado) {
            if ($this->config['militares']) {
                $text .= 'Militares';
            }
        } else {
            if ($this->config['militares']) {
                $text .= 'Civiles';
            }
        }
        $this->newPage($inicial, $text);
    }

    /**
     * Función para crear la tabla de los grados
     *
     * @author: Ing. Osvaldo M. Gonzales
     * @modify: Ing. Daymel Machado Cabrera
     *
     * @param        $pos
     * @param int    $totalGeneral
     * @param string $concepto
     * @param int    $esGrado
     */
    private function createContenido($pos = 0, $totalGeneral = 0, $concepto = 'categorias', $esGrado = 0)
    {
        $heads = $this->datosPlantilla['datos']['cabecera'][$concepto];
        $init = ($pos == 0);
        self::headers($init, $esGrado);
        $init = $pos;
        $wArray = array();
        $wTotal = 0;
        $flagBreak = count($heads);
        $aAlings = array('L');
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->Ln(10);
        $this->pdf->Cell(135, 10, ''); //Celda Vacia
        $this->pdf->Ln(5);
        //  Cabecera de la tabla
        $valores = array();
        $wArray[] = 60;
        $wTotal += 60;
        $valores [] = array('text' => utf8_decode('Denominación'));
        $this->calcWidthColumna($pos, $heads, $wTotal, $wArray, $aAlings, $valores, $index, $value, $flagBreak);
        self::asignarTotales($pos, $aAlings, $flagBreak, $heads, $valores, $wArray);
        $this->table->SetWidths($wArray);
        $this->table->SetAligns($aAlings);
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->table->Row($valores);
        $this->pdf->SetTextColor(0, 0, 0);
        $this->pdf->SetFont('Arial', '', 10);
        $totales = array();
        $entidades = $this->datosPlantilla['entidades'];
        $datos = $this->datosPlantilla['datos']['entidades'];
        $orden = 0;
        foreach ($entidades as $estructura) {
            $valores = array();
            $valores [] = array('text' => utf8_decode($estructura['denominacion']));
            $columnas = array_merge(array(), $heads);
            foreach ($columnas as $index => $value) {
                $columnas[$index]['cantidad'] = 0;
            }
            foreach ($heads as $index => $head) {
                if ($index >= $pos && $index < $flagBreak) {
                    foreach ($datos as $data) {
                        if ($data['identidad'] == $estructura['idfila'] && $data['id'] == $head['id'] &&
                            $data['esgrado'] == $esGrado
                        ) {
                            $columnas[$index]['cantidad'] += $data['cantidad'];
                        }
                    }
                }
            }
            $total = 0;
            foreach ($columnas as $index => $value) {
                if ($index >= $pos && $index < $flagBreak) {
                    $total += $value['cantidad'];
                    $valores [] = $value['cantidad'];
                }
            }
            $totales[$orden] = $totalGeneral[$orden] + $total;
            if ($totales[$orden]) {
                if ($flagBreak == count($heads) && $pos != 0) {
                    $valores [] = array('text' => $total, 'black' => true);
                    $valores [] = array('text' => $totalGeneral[$orden] + $total, 'black' => true);
                } else {
                    if ($flagBreak == count($heads) && $pos == 0) {
                        $valores [] = array('text' => $total, 'black' => true);
                    } else {
                        $valores [] = array('text' => $total, 'black' => true);
                    }
                }
                $this->table->Row($valores);
            }
            $orden++;
        }
        if ($flagBreak < count($heads)) {
            $this->createContenido($flagBreak, $totales, $concepto, $esGrado);
        }
    }

    /**
     * Funcion para asignar los valores a los arreglos
     *
     * @param $config
     * @param $datos
     * @param $entidades
     * @param $estructuras
     */
    public function asignaValores($config, $datos, &$entidades, &$estructuras)
    {
        $entidades = array();
        $estructuras = array();
        foreach ($datos as $identificador) {
            $elemento = $this->datestructura->damePadresEntidades($identificador, $config['idproyecto'], true);
            if (count($elemento) > 0) {
                $entidades = array_merge($entidades, $elemento);
            } else {
                $elemento = $this->estructura->dameDatosEstructura($identificador, $config['idproyecto']);
                $estructuras [] = $elemento[0];
            }
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
    private function newPage($inicial, $text)
    {
        $this->pdf->AddPage('L');
        $this->setTopPage();
        $this->createHeader($inicial, $text);
    }

    /**
     * Funcion para asignarle valor, segun el tamaño de la pagina
     */
    private function valorComprobante()
    {
        switch ($this->widthFormato){
            case 841.89: //A3
                $this->switchValorComprovante($this->heightFormato);
                break;
            case 595.28: //A4
                $this->switchValorComprovante($this->heightFormato);
                break;
            case 612:
                $this->switchValorComprovante($this->heightFormato);
                break;
        }
    }

    /**
     * @param $heightFormato
     */
    private function switchValorComprovante($heightFormato)
    {
        switch ($heightFormato){
            case 1600.55: //A3
                $this->valorComprobante = 10;
                break;
            case 841.89: //A4
                $this->valorComprobante = 50;
                break;
            case 792: //A4
                $this->valorComprobante = 70;
                break;
            case 1008: //LEGAL
                $this->valorComprobante = 40;
                break;
        }
    }

    /**
     * Funcion para llenar los datos del reporte
     *
     * @param $entidades
     * @param $aPadres
     */
    private function asignarValoresTemporales($entidades, &$aPadres)
    {
        $valoresTemporal = array();
        foreach ($entidades as $est) {
            $valoresTemporal[$est['idfila']] = $est;
        }
        $this->datosPlantilla['entidades'] = $valoresTemporal;
        $aPadres = array();
        foreach ($this->datosPlantilla['entidades'] as $index => $value) {
            if (is_numeric($index)) {
                $aPadres[$index] = $value['idfila'];
            }
        }
    }

    /**
     * Funcion para generar el Reporte de tablas de organización
     */
    private function generateResumen()
    {
        $categorias = $this->datosPlantilla['datos']['cabecera']['categorias'];
        if (count($categorias) > 0 && $this->config['civiles']) {
            $this->flag = true;
            self::createContenido();
        }
        $grados = $this->datosPlantilla['datos']['cabecera']['grados'];
        if (count($grados) > 0 && $this->config['militares']) {
            $this->flag = true;
            self::createContenido(0, 0, 'grados', 1);
        }
    }

    /**
     * Funcion para crear el encabezado  de la pag
     *
     * @param $inicial
     */
    private function crearHeaderProyecto($inicial)
    {
        if ($inicial) {
            $this->pdf->Cell(0, 10, utf8_decode('Anexo No. 2'), 0, 0, 'R');
            $this->pdf->SetY(10);
            $datos = $this->config['proyecto'];
            if ($datos && $this->config['infoProyecto']) {
                $this->pdf->SetFont('Arial', 'B', 10);
                $this->pdf->Cell(0, 5, 'PROYECTO', 0, 1, 'L');
                $this->pdf->SetFont('Arial', '', 8);
                $this->pdf->MultiCell(60, 5, utf8_decode(Util::fixTitle($datos)), 0, 1, 'L');
            }
        } else {
            $this->pdf->Cell(0, 10, utf8_decode('- ' . $this->pdf->PageNo() . ' -'), 0, 0, 'R');
        }
    }

    /**
     * Funcion para calcular el tamaño de las cabeceras de las celdas
     *
     * @param $pos
     * @param $heads
     * @param $wTotal
     * @param $wArray
     * @param $aAlings
     * @param $values
     * @param $index
     * @param $value
     * @param $flagBreak
     */
    private function calcWidthColumna(
        $pos, $heads, $wTotal, &$wArray, &$aAlings, &$values, &$index, &$value, &$flagBreak
    )
    {
        foreach ($heads as $index => $value) {
            if ($index >= $pos) {
                $this->calculaIndice($value);
                if (!empty($value['abreviatura'])) {
                    $text = $value['abreviatura'];
                    $isMini = true;
                } else {
                    $text = $value['denominacion'];
                }
                $widthColumna = strlen($text) * $this->indice + ($isMini ? 10 : 0);
                $wTotal += $widthColumna + $this->valorComprobante;
                if ($wTotal <= $this->widthFormato) {
                    $wArray[] = $widthColumna;
                    $aAlings[] = 'C';
                    $values[] = array('text' => utf8_decode($text));
                } else {
                    $flagBreak = $index;
                    break;
                }
            }
        }
    }

    /**
     * Función para calcular los indices
     *
     * @param $value
     */
    private function calculaIndice(&$value)
    {
        if (strlen($value['denominacion']) > 14) {
            $this->indice = 1.7;
        } else {
            $this->indice = 3.5;
        }
    }
}