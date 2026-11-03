<?php

class AnexoResumenPersonal
{
    private $pdf;
    private $table;
    private $config;
    private $datosCargos;
    private $proyecto;
    private $marginPersonal;
    private $pageNum;
    private $datestructura;

    public function __construct($pdf, $table, $config, $datos)
    {
        $this->datestructura = new DatEstructuraModel();
        $this->pdf = $pdf;
        $this->table = $table;
        $this->config = $config;
        $this->datosCargos = $this->datestructura->dameCargosResumenPersonal($datos['resumen'], $config);
        $proyecto = $datos['proyecto'];
        $this->proyecto = $proyecto;
        $this->pageNum = $this->config['hoja'];
        $this->marginPersonal = 60;
        $this->pdf->SetX(0);
        $this->pdf->SetY(0);
    }

    public function createPresentation()
    {
        $this->buildResumenPersonal();
        $this->buildResumenCargos();

        return $this->pageNum;
    }

    private function buildResumenPersonal()
    {
        $this->newPage();
        $this->headerResumenPersonal();
        $this->headerTableResumen();
        $this->contentResumen();
    }

    private function headerResumenPersonal()
    {
     //   Util::msg($this->config);
        $this->pdf->Ln(10);
        switch ($this->config['idresolucion']){
            case 'GAE':
                $this->pdf->SetFont('Arial', 'BI', 13);
                $this->pdf->Cell(0, 10, 'Resumen de personal', 0, 1, 'C');
                if ($this->config['idresolucion'] && $this->config['header']) {
                    $this->pdf->Cell(0, 10, utf8_decode($this->config['resolucion']), 0, 1, 'C');
                }
                break;
            default:
                $this->pdf->SetX(0);
                if ($this->config['idresolucion'] && $this->config['header']) {
                    $this->pdf->SetFont('Arial', 'B', 10);
                    $this->pdf->Cell(0, 10, utf8_decode('Ministerio de Trabajo y Seguridad Social'), 0, 1, 'C');
                    $this->pdf->Cell(0, 10, utf8_decode($this->config['resolucion']), 0, 1, 'C');
                }
                $this->pdf->SetFont('Arial', 'B', 12);
                if ($this->config['idresolucion'] != 'GAE') {
                    $this->pdf->Cell(0, 10, 'ANEXO No. 2', 0, 1, 'C');
                }
                $this->pdf->Cell(0, 10, 'Resumen de personal', 0, 1, 'C');
                break;
        }
        $this->pdf->SetFont('Arial', '', 10);
        $this->pdf->Ln(5);
    }

    private function addPageNo()
    {
        $this->pdf->SetFont('Arial', 'B', 10);
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $maxPos = $this->pdf->hPt / $this->pdf->k - 21;
        $this->pdf->SetY($maxPos);
        $this->pdf->Cell(0, '', $this->pageNum, 0, 1, 'C');
        $this->pageNum++;
        $this->pdf->SetX($x);
        $this->pdf->SetY($y);
        $this->pdf->SetFont('Arial', '', 8);
    }

    private function headerTableResumen()
    {
        $this->pdf->SetX($this->marginPersonal);
        $this->pdf->SetFont('Arial', 'B', 10);
        $withArray = array(10, 60, 20);
        $alingsArray = array('C', 'L', 'C');
        $this->pdf->Cell($withArray[0], 5, utf8_decode('No'), 1, 0, 'C');
        $this->pdf->Cell($withArray[1], 5, utf8_decode('Personal'), 1, 0, 'L');
        $this->pdf->Cell($withArray[2], 5, utf8_decode('Cantidad'), 1, 1, 'C');
        $this->table->SetWidths($withArray);
        $this->table->SetAligns($alingsArray);
    }

    private function contentResumen()
    {
        $tablaCategorias = $this->datosCargos['resumen'];
        $cantidad = 1;
        $cantidadCivil = $tablaCategorias['cantidad']['civil'];
        $cantidadMilitar = $tablaCategorias['cantidad']['militar'];
        $this->pdf->SetFont('Arial', '', 8);
        if ($cantidadCivil > 0) {
            foreach ($tablaCategorias['civiles'] as $datos) {
                $fila = array($cantidad++, utf8_decode($datos['denominacion']), $datos['cantidad']);
                $this->pdf->SetX($this->marginPersonal);
                if ($this->testStatusPage(4)) {
                    $this->headerTableResumen();
                }
                $this->table->Row($fila, 0);
            }
            if ($this->config['militares']) {
                $this->pdf->SetFont('Arial', 'BI', 8);
                $fila = array('', array('text' => 'Subtotal civiles ', 'align' => 'R'), $cantidadCivil);
                $this->pdf->SetX($this->marginPersonal);
                $this->table->Row($fila, 0);
            }
        }
        
        $this->pdf->SetFont('Arial', '', 8);
        if ($cantidadMilitar > 0) {
            if ($this->config['militares']) {
                foreach ($tablaCategorias['militares'] as $datos) {
                    $fila = array($cantidad++, utf8_decode($datos['denominacion']), $datos['cantidad']);
                    $this->pdf->SetX($this->marginPersonal);
                    $this->table->Row($fila, 0);
                }
                if ($this->config['civiles']) {
                    $this->pdf->SetFont('Arial', 'BI', 8);
                    $fila = array('', array('text' => 'Subtotal militares ', 'align' => 'R'), $cantidadMilitar);
                    $this->pdf->SetX($this->marginPersonal);
                    $this->table->Row($fila, 0);
                }
            }
        }
       
        $total = ($cantidadCivil + $cantidadMilitar);
        $this->pdf->SetFont('Arial', 'B', 8);
        $fila = array('', array('text' => 'TOTAL ', 'align' => 'R'), $total);
        $this->pdf->SetX($this->marginPersonal);
        $this->table->Row($fila, 1, 1);
        $this->pdf->SetFont('Arial', '', 8);
    }

    private function buildResumenCargos()
    {
        $this->newPage();
        $this->headerResumenCargos();
        $withArray = array(115, 20, 20);
        $alingsArray = array('L', 'C', 'C');
        $this->headerTableCargos($withArray, $alingsArray);
        $this->contentResumenCargos($withArray, $alingsArray);
    }

    private function headerResumenCargos()
    {
        $this->pdf->Ln(10);
        $this->pdf->SetFont('Arial', 'B', 12);
        $this->pdf->Cell(0, 10, 'Cargos del organismo', 0, 1, 'C');
        $this->pdf->SetFont('Arial', '', 10);
        $this->pdf->Ln(10);
    }

    private function headerTableCargos($withArray, $alingsArray)
    {
        $this->pdf->SetX($this->marginPersonal-20);
        $this->pdf->SetFont('Arial', 'B', 10);
        if ($this->config['civiles'] && $this->config['militares']) {
            $y = $this->pdf->GetY();
            $x = $this->pdf->GetX();
            $this->pdf->Cell($withArray[0], 10, utf8_decode('Cargos'), 1, 1, 'C');
            $this->pdf->SetY($y);
            $this->pdf->SetX($x + $withArray[0]);
            $this->pdf->Cell(($withArray[1] + $withArray[2]), 5, utf8_decode('Cantidad'), 1, 1, 'C');
            $this->pdf->SetY($y + 5);
            $this->pdf->SetX($x + ($withArray[0]));
            $this->pdf->Cell(($withArray[1]), 5, utf8_decode('Militares'), 1, 0, 'C');
            $this->pdf->Cell(($withArray[2]), 5, utf8_decode('Civiles'), 1, 1, 'C');
        } else {
            $this->pdf->Cell($withArray[0], 5, utf8_decode('Cargos'), 1, 0, 'C');
            $this->pdf->Cell(($withArray[1]), 5, utf8_decode('Cantidad'), 1, 1, 'C');
        }
        $this->table->SetWidths($withArray);
        $this->table->SetAligns($alingsArray);
        $this->pdf->SetFont('Arial', '', 10);
    }

    private function contentResumenCargos($withArray, $alingsArray)
    {
        $margen=20;
        $this->pdf->SetFont('Arial', '', 10);
        $cantCivil = 0;
        $cantMilitar = 0;
        $tablaCargos = $this->datosCargos['tabla'];
        foreach ($tablaCargos as $cargos) {
            $civiles = $cargos['cantidadCivil'];
            $militares = $cargos['cantidadMilitar'];
            $text = utf8_decode($cargos['text']);
            $cantMilitar += $militares;
            $cantCivil += $civiles;
            if ($this->config['civiles'] && $this->config['militares']) {
                $arr = array($text, $militares, $civiles);
            } else {
                $arr = $this->asignaValorArr($text, $militares, $civiles);
            }
            if ($this->testStatusPage(5)) {
                $this->pdf->SetY(25);
                $this->headerTableCargos($withArray, $alingsArray);
            }
            $this->pdf->SetX($this->marginPersonal-$margen);
            $this->table->Row($arr);
        }
        $this->pdf->SetFont('Arial', 'B', 10);
        if ($this->config['civiles'] && $this->config['militares']) {
            $this->pdf->SetFont('Arial', 'BI', 10);
            $arr = array(array('text' => 'Subtotales', 'align' => 'R'), $cantMilitar, $cantCivil);
            $this->pdf->SetX($this->marginPersonal-$margen);
            $this->table->Row($arr, 1, 1);
            $this->pdf->SetFont('Arial', 'B', 10);
            $this->pdf->SetX($this->marginPersonal);
            $this->pdf->Cell($withArray[0], 5, 'Total', 1, 0, 'R', 1);
            $this->pdf->Cell(($withArray[1] + $withArray[2]), 5, $cantCivil + $cantMilitar, 1, 1, 'C', 1);
        } else {
            $this->pdf->SetFont('Arial', 'B', 10);
            $text = array('text' => 'Total', 'align' => 'R');
            $arr = $this->asignaValorArr($text, $cantMilitar, $cantCivil);
            $this->pdf->SetX($this->marginPersonal-$margen);
            $this->table->Row($arr, 1, 1);
        }
    }

    private function createHeaderProyecto()
    {
        $this->pdf->SetY(10);
        $dir = $_SERVER['DOCUMENT_ROOT'] . '/metadatos/comun/recursos/imagenes/borde.jpg';
        $this->pdf->Image($dir, 0, 0, 0, 30, 'jpg', '');
        $datos = $this->proyecto;
        if ($datos && $this->config['infoProyecto']) {
            $this->pdf->SetFont('Arial', 'B', 10);
            $this->pdf->Cell(0, 5, 'PROYECTO', 0, 1, 'L');
            $this->pdf->SetFont('Arial', '', 8);
            $this->pdf->MultiCell(60, 5, utf8_decode(Util::fixTitle($datos)), 0, 1, 'L');
        }
    }

    /**
     * Funcion encargada de comprobar si queda espacio disponible para mostrar el contenido, sino, salto de linea
     *
     * @param $countToTest
     *
     * @return bool
     */
    private function testStatusPage($countToTest)
    {
        $maxPos = $this->pdf->hPt / $this->pdf->k - 20;
        if (($this->pdf->GetY() + ($countToTest * 10)) >= $maxPos) {
            $this->newPage();

            return true;
        }
    }

    /**
     * Funcion encargada de crear una nueva pagina con todos los elementos necesarios en la misma, dígase
     * fondo superior, numero de pagina y orientacion horizontal
     */
    private function newPage()
    {
        $this->pdf->AddPage('P');
        $this->createHeaderProyecto();
        $this->addPageNo();
    }

    /**
     * @param $text
     * @param $militares
     * @param $civiles
     *
     * @return array
     */
    private function asignaValorArr($text, $militares, $civiles)
    {
        if ($this->config['militares']) {
            $arr = array($text, $militares);

            return $arr;
        } else {
            $arr = array($text, $civiles);

            return $arr;
        }
    }
}