<?php

/**
 * Class ReporteProyecto
 */
class ReporteProyecto extends fpdf
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
     * @var int
     */
    private $widthInd;
    /**
     * @var
     */
    private $datosProyecto;
    /**
     * @var bool
     */
    private $flag = false;

    /**
     * Constructor de la clase que inicializa el pdf y la tabla para la construccion de las mismas.
     *
     * @param $datosProyecto
     */
    public function __construct($datosProyecto)
    {
        $this->pdf = new fpdf('P', 'mm', 'Letter');
        $this->table = new Table($this->pdf);
        $this->widthInd = 300;
        $this->datosProyecto = $datosProyecto;
    }

    /**
     * Funcion encargada de la creacion del contenido del pdf
     * setea los margenes y el color de relleno para las cabeceras de las tablas,
     * asi como la propiedad de autoPageBreak para el salto de contenido
     */
    public function createPDF($idproyecto = 0)
    {
        ob_start();
        $this->pdf->SetLeftMargin(10);
        $this->pdf->SetRightMargin(12);
        $this->pdf->SetFillColor(79, 129, 189);
        $this->pdf->SetAutoPageBreak(true, 20);
        $cantAdd = count($this->datosProyecto['ajustes']['add']);
        $cantMod = count($this->datosProyecto['ajustes']['mod']);
        $cantDel = count($this->datosProyecto['ajustes']['del']);
        $this->flag = ($cantAdd + $cantMod + $cantDel) > 0;
        if (!$this->flag) {
            echo(Zend_Json::encode(
                          array(
                              "codMsg"  => "1",
                              "mensaje" => "No existen datos disponibles de modificaciones en el proyecto.")
            ));
        } else {
            $this->headerReport();
            if ($cantAdd > 0) {
                $this->setTemplateForAddDel();
            }
            if ($cantMod > 0) {
                $this->setModifyEstructuras();
            }
            if ($cantDel > 0) {
                $this->setTemplateForAddDel(true);
            }

            $pdf = $this->pdf->Output('', 'S');
            $r = $this->guardarPdf($pdf, $idproyecto);
            $this->pdf->Output();
            ob_flush();
        }
    }

    public function guardarPdf($pdf, $idproyecto)
    {
        $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
        $sqlnombreproyecto = "SELECT idproyecto, denominacion, descripcion, idusuario, fecha, modificado, 
         idpadre, aprobado, fechafin
         FROM mod_estructuracomp.dat_proyecto
         WHERE idproyecto= $idproyecto;";
        $proyecto = $conn->fetchAll($sqlnombreproyecto);
        // print_r($proyecto);die;
        $hoy = date("m.d.y");
        $nombreproyecto = $proyecto[0]['denominacion'];
        $nombrereporte = $nombreproyecto . '_' . $hoy;

        $file_location = $_SERVER['DOCUMENT_ROOT'] . "/metadatos/proyecto/reportescambios/" . $nombrereporte . ".pdf";
        file_put_contents($file_location, $pdf);
        $sqlidreporteplantilla = "SELECT idreportecambios
                   FROM mod_estructuracomp.his_reportecambios
                  WHERE nombrereporte='$nombrereporte';";

        $idreporteplantilla = $conn->fetchAll($sqlidreporteplantilla);

        if (!$idreporteplantilla[0]) {
            $sqldoc = "INSERT INTO mod_estructuracomp.his_reportecambios(
                nombrereporte, fecha, nombreproyecto,idproyecto)
              VALUES ('$nombrereporte', now(), '$nombreproyecto',$idproyecto);";

            $r = $conn->fetchAll($sqldoc);
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
        $this->pdf->MultiCell(0, 5, 'Reporte Informativo de', 0, 'C');
        $this->pdf->MultiCell(0, 5, 'Cambios Organizacionales', 0, 'C');
        /**
         * Muestra el texto de contenido inicial del reporte
         */
        $this->pdf->Ln(10);
        $datos = $this->datosProyecto['proyecto'];
        $this->pdf->SetFont('Arial', '', 10);
        $this->pdf->Cell(18, 5, 'Proyecto: ', 0, 0, 'L');
        $this->pdf->SetFont('Arial', 'B', 10);
        $this->pdf->Cell(0, 5, utf8_decode($datos['denominacion']), 0, 1, 'L');
        $this->pdf->SetFont('Arial', '', 10);
        $this->pdf->Ln(2);
        $this->pdf->MultiCell(0, 5, utf8_decode($datos['descripcion']), 0);
        $textoInicial
            = "Relación de las modificaciones en la estructura organizacional aprobada con la
        creación del proyecto en cuestión el " . $datos['fecha'] . " por " . $datos['usuario'] . ".";
        $this->pdf->Ln(10);
        $this->pdf->MultiCell(0, 5, utf8_decode($textoInicial), 0);
    }

    /**
     * Plantilla encargada de construir los datos para las estructuras adicionadas o eliminadas
     *
     * @param bool $isEliminar Especifica si sera utilizada para los datos de eliminacion
     */
    private function setTemplateForAddDel($isEliminar = false)
    {
        $textoAccion = $isEliminar ? 'eliminado' : 'adicionado';
        $posArray = $isEliminar ? 'del' : 'add';
        /**
         * Texto segun la accion que se vaya a mostrar segun la funcion
         */
        $textoInsertar = "En la estructura aprobada se han " . $textoAccion . " los siguientes elementos:";
        $this->pdf->Ln(10);
        $this->pdf->MultiCell(0, 5, utf8_decode($textoInsertar), 0);
        $this->pdf->Ln(1);
        $valores = $this->datosProyecto['ajustes'][$posArray];
        $vinetas = 1;
        //print_r($valores);die;
        foreach ($valores as $idconcepto => $estructuras) {
            /**
             * Comprobacion del espacio disponible en la pagina para el salto de pagina si el contenido se
             * queda a medias
             */
            $this->testStatusPage(4);
            /**
             * Cabecera viñetada de los conceptos que se trataran en la función
             */
            $this->headerByConcept($idconcepto, $vinetas++);
            /**
             * Contruccion de la configuracion para la tabla de contenido según el concepto
             */
            $config = $this->headerTableByConcept($idconcepto);

            foreach ($estructuras as $estructura) {
                /**
                 * Construccion de las filas con los valores de las estructuras segun la configuracion obtenida
                 */
                $this->putTablesByConcept($config, $estructura,$idconcepto);
            }
        }
    }

    /**
     * Funcion encargada de construir las viñetas segun los conceptos a tratar
     *
     * @param $idconcepto
     * @param $numberVineta
     *
     * @return array
     */
    public function headerByConcept($idconcepto, $numberVineta)
    {
        $tipoConcepto = $minTipoConcepto = "";
        $conceptos = array(
            1 => array('tipoConcepto' => 'Órganos: ', 'minTipoConcepto' => 'órgano'),
            2 => array('tipoConcepto' => 'Agrupaciones: ', 'minTipoConcepto' => 'agrupación'),
            3 => array('tipoConcepto' => 'Entidades: ', 'minTipoConcepto' => 'entidad'),
            4 => array('tipoConcepto' => 'Organizaciones: ', 'minTipoConcepto' => 'organización'),
            5 => array('tipoConcepto' => 'Órganos internos: ', 'minTipoConcepto' => 'órgano interno'),
            6 => array('tipoConcepto' => 'Agrupaciones internas: ', 'minTipoConcepto' => 'agrupación interna'),
            7 => array('tipoConcepto' => 'Cargos: ', 'minTipoConcepto' => 'cargo'),
            8 => array('tipoConcepto' => 'Estructuras no formales: ', 'minTipoConcepto' => 'estructura no formal'),
            9 => array('tipoConcepto' => 'Medios: ', 'minTipoConcepto' => 'medios'));
        foreach ($conceptos as $key => $value) {
            if ($key == $idconcepto) {
                $tipoConcepto .= $value['tipoConcepto'];
                $minTipoConcepto .= $value['minTipoConcepto'];
            }
        }
        $this->pdf->Ln(5);
        $this->pdf->SetX(15);
        $this->pdf->MultiCell(60, 5, utf8_decode($numberVineta . '- ' . $tipoConcepto), 0);
        $this->pdf->Ln(5);

        return array('cabecera' => $tipoConcepto, 'concepto' => $minTipoConcepto, 'idconcepto' => $idconcepto);
    }

    /**
     * Funcion encargada de construir la configuracion para la tabla de contenido segun el concepto a tratar
     *
     * @param      $idconcepto
     * @param bool $paint
     *
     * @return array
     */
    private function headerTableByConcept($idconcepto, $paint = true)
    {
        $cabecera = array(array('text' => utf8_decode('Denominación'), 'index' => 'denominacion'));
        if ($idconcepto <= 6) {
            $cabecera[] = array('text' => utf8_decode('Abreviatura'), 'index' => 'abreviatura');
        }
        $cabecera = $this->cabecerasTablas($idconcepto, $cabecera);
        if ($paint) {
            /**
             * Si el concepto no es ni entidad, organizacion, ni cargo, los cuales tienen mucho contenido se reajustan
             * los tamaños de las celdas para que no sean tan grandes, sino se toma un tamaño parejo para todas según
             * el espacio disponible
             */
            $size = $this->sizeChange($idconcepto, $cabecera);
            $alignsTable = array();
            $widthTable = array();
            /**
             * Construccion de la cabecera de las tablas
             */
            foreach ($cabecera as $index => $header) {
                $alignsTable[] = 'C';
                $widthTable[] = $index == 0 ? $size + 20 : $size;
                $valores[] = $header['text'];
            }
            $this->table->SetAligns($alignsTable);
            $this->table->SetWidths($widthTable);
            $this->pdf->SetX(20);
            $this->pdf->SetTextColor(255, 255, 255);
            $this->table->Row($valores, 1, 1);
            $this->pdf->SetTextColor(0, 0, 0);
        }

        return array('cabecera' => $cabecera, 'width' => $widthTable);
    }

    /**
     * Funcion encargada de construir las filas de los contenidos de las estructuras agregando ademas la fila de ruta
     * de la misma para que el usuario conozca donde es que se encuentra la estructura que se menciona
     *
     * @param $config
     * @param $estructuras
     */
    private function putTablesByConceptOld($config, $estructuras)
    {


        $cabecera = $config['cabecera'];
        $widthTable = $config['width'];
        /*CONSTRUCCION DE LA TABLA DE CONTENIDO*/
        $this->pdf->SetTextColor(0, 0, 0);
        $alignsArray = array();
        $valores = array();
        foreach ($cabecera as $head) {
            $pos = $head['index'];
            $alignsArray[] = 'L';
            $valores[] = utf8_decode($estructuras[$pos]);
        }
        $this->pdf->SetX(20);
        $this->pdf->SetFont('Arial', '', 8);
        /*Construccion de la fila para la ruta de la estructura*/
        /*Suma de todas las dimensiones*/
        $totalWidth = array_sum($widthTable);
        $widthRuta = count($widthTable) == 1 ? ($widthTable[0] / 2) - 40 : $widthTable[0] / 2;
        $widthForRuta = array($widthRuta, $totalWidth - $widthRuta);
        $alignForRuta = array('L', 'L');
        $this->table->SetAligns($alignForRuta);
        $this->table->SetWidths($widthForRuta);
        $datosRuta = array(
            array('text' => utf8_decode('Ubicación'), 'border' => 'LR', 'black' => 1, 'size' => 8),
            utf8_decode($estructuras['ruta']));
        $this->table->Row($datosRuta);
        /*CONSTRUCCION DE LOS DATOS DE LA ESTRUCTURA*/
        $this->pdf->SetX(20);
        $this->table->SetWidths($widthTable);
        $this->table->SetAligns($alignsArray);
        $this->pdf->SetX(20);
        $this->table->Row($valores);
        $this->pdf->SetFont('Arial', '', 10);
    }

    private function putTablesByConcept($config, $estructuras1, $idconcepto)
    {

        /*Construccion de la fila para la ruta de la estructura*/
        $this->pdf->SetX(20);
        $this->pdf->SetFont('Arial', '', 8);
        $widthTable = $config['width'];

        /*Suma de todas las dimensiones*/
        $totalWidth = array_sum($widthTable);
        $widthRuta = count($widthTable) == 1 ? ($widthTable[0] / 2) - 40 : $widthTable[0] / 2;
        $widthForRuta = array(/*$widthRuta,*/ $totalWidth /*- $widthRuta*/);
        // print_r($widthForRuta);die;
        $alignForRuta = array(/*'L',*/ 'L');
        $this->table->SetAligns($alignForRuta);
        $this->table->SetWidths($widthForRuta);

        $espacio1 = '                                                  ';
        $espacio = '                                                                                              '.$espacio1;
        $datosRuta = array(
            // array('text' => utf8_decode('Ubicación:'),  'black' => 1, 'size' => 9),
            array('text' => utf8_decode($estructuras1[0]['ruta'] . $espacio),'black' => 1, 'size' => 400)

        );

        //$this->pdf->SetFillColor(200, 200, 200);
        $this->pdf->SetX(20);
        $this->table->Row($datosRuta);
        //$this->pdf->SetFillColor(79, 129, 189);
        //$this->pdf->SetFillColor(0, 0, 0);
        $haSaltado = $this->testStatusPage(3);
        if ($haSaltado) {
            $this->headerTableByConcept($idconcepto);
            $this->pdf->SetX(20);
        }

        foreach ($estructuras1 as $estructuras) {
            //Verificar los saltos de pagina y pintar encabezado
            $haSaltado = $this->testStatusPage(3);
            if ($haSaltado) {
                $this->headerTableByConcept($idconcepto);
                $this->pdf->SetX(20);
            }

            $cabecera = $config['cabecera'];
            $widthTable = $config['width'];
            /*CONSTRUCCION DE LA TABLA DE CONTENIDO*/
            $this->pdf->SetTextColor(0, 0, 0);
            $alignsArray = array();
            $valores = array();

            //print_r($estructuras);die;
            foreach ($cabecera as $head) {
                $pos = $head['index'];
                $alignsArray[] = 'L';

                if ($pos == 'decisorio' || $pos == 'principal') {
                    $texto = ($estructuras[$pos] == 1) ? 'Sí' : 'No';
                } else {
                    if ($pos == 'denominacion') {
                        $ep = ($estructuras['principal'] == 1) ? ' ( EP ) ' : '';
                        $jb = ($estructuras['jefebrigada'] == 1) ? ' ( JB ) ' : '';
                        $alias = $estructuras['alias'];
                        $texto = $estructuras[$pos] . ' '.$alias . $ep . $jb;
                    } else {
                        $texto = $estructuras[$pos];
                    }

                }

                $valores[] = utf8_decode($texto);
            }
//print_r($valores);die;
            //Verificar los saltos de pagina y pintar encabezado
            $haSaltado = $this->testStatusPage(3);
            if ($haSaltado) {
                $this->headerTableByConcept($idconcepto);
                $this->pdf->SetX(20);
            }
            $this->table->SetWidths($widthTable);
            $this->table->SetAligns($alignsArray);
            $this->pdf->SetX(20);
            $this->table->Row($valores);
            $this->pdf->SetX(20);
            $this->pdf->SetFont('Arial', '', 10);

        }

    }

    /**
     *
     */
    private function setModifyEstructuras()
    {
        $textoInsertar = "En la estructura aprobada se han modificado los siguientes elementos:";
        $this->pdf->Ln(10);
        $this->pdf->MultiCell(0, 5, utf8_decode($textoInsertar), 0);
        $this->pdf->Ln(1);
        $valores = $this->datosProyecto['ajustes']['mod'];
        $vinetas = 1;
        foreach ($valores as $idconcepto => $estructuras) {
            /**
             * Comprobacion del espacio disponible en la pagina para el salto de pagina si el contenido se
             * queda a medias
             */
            $this->testStatusPage(4);
            /**
             * Cabecera viñetada de los conceptos que se trataran en la función
             */
            $header = $this->headerByConcept($idconcepto, $vinetas++);
            foreach ($estructuras as $modificado) {
                $this->constructModifyContent($header, $modificado);
            }
        }
    }

    /**
     * @param $header
     * @param $datos
     */
    private function constructModifyContent($header, $datos)
    {
        $original = $datos['aprobado'];
        $ajuste = $datos['ajuste'];
        $concepto = $header['concepto'];
        $text = 'De la ' . $concepto;
        $idconcepto = $header['idconcepto'];
        if ($idconcepto == 1 || $idconcepto == 5 || $idconcepto == 7 || $idconcepto == 9) {
            $text = 'Del ' . $concepto;
        }
        $text .= ' [ ' . $original['denominacion'] . ' ]  se han modificado los siguientes atributos';
        $this->pdf->SetX(30);
        $this->pdf->MultiCell(0, 5, utf8_decode($text), 0);
        $this->pdf->Ln(2);
        $config = $this->headerTableByConcept($idconcepto, false);
        $config = $config['cabecera'];
        $this->setValuesTableComparacion($config, $original, $ajuste);
    }

    /**
     * @param bool $paint
     *
     * @return array
     */
    private function construirHeaderTableComparacion($paint = true)
    {
        $valores = array('Atributo', 'Valor aprobado', utf8_decode('Modificación'));
        $alignValues = array('C', 'C', 'C');
        $widthValues = array(50, 70, 70);
        if ($paint) {
            $this->table->SetAligns($alignValues);
            $this->table->SetWidths($widthValues);
            $this->pdf->SetFont('Arial', '', 10);
            $this->pdf->SetTextColor(255, 255, 255);
            $this->pdf->SetX(50);
            $this->table->Row($valores, 1, 1);
            $this->pdf->SetTextColor(0, 0, 0);
        }

        return $widthValues;
    }

    /**
     * @param $config
     * @param $original
     * @param $ajuste
     */
    private function setValuesTableComparacion($config, $original, $ajuste)
    {
        $ruta = $ajuste['ruta'];
        $datos = array();
        foreach ($config as $configuracion) {
            $valores = array();
            $index = $configuracion['index'];
            $header = $configuracion['text'];
            if ($original[$index] != $ajuste[$index]) {
                $valores [] = array('text' => $header, 'black' => 1, 'size' => 8);
                $valores [] = utf8_decode($original[$index]);
                $valores [] = utf8_decode($ajuste[$index]);
            }
            $datos [] = $valores;
        }
        $this->testStatusPage(count($datos) + 1);
        $this->pdf->SetFont('Arial', '', 8);
        $widthTable = $this->construirHeaderTableComparacion(false);
        $totalWidth = array_sum($widthTable);
        $valores = array(
            array('text' => utf8_decode('Ubicación'), 'black' => true, 'size' => 8), utf8_decode($ruta));
        $alignValues = array('L', 'L');
        $widthRuta = array($widthTable[0] / 2, $totalWidth - $widthTable[0] / 2);
        $this->table->SetAligns($alignValues);
        $this->table->SetWidths($widthRuta);
        $this->pdf->SetX(50);
        $this->table->Row($valores);
        $this->construirHeaderTableComparacion();
        foreach ($datos as $data) {
            $alignValues = array('L', 'L', 'L');
            $this->table->SetAligns($alignValues);
            $this->pdf->SetTextColor(0, 0, 0);
            $this->pdf->SetX(50);
            $this->table->Row($data);
        }
        $this->pdf->Ln(5);
        $this->pdf->SetFont('Arial', '', 10);
    }

    /**
     * Funcion encargada de comprobar si queda espacio disponible para mostrar el contenido, sino, salto de linea
     *
     * @param $countToTest
     */
    private function testStatusPage($countToTest)
    {
        $maxPos = $this->pdf->hPt / $this->pdf->k - 20;
        if (($this->pdf->GetY() + ($countToTest * 10)) >= $maxPos) {
            $this->newPage();
            return true;
        }
        return false;
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
     * @param $idconcepto
     * @param $cabecera
     *
     * @return array
     */
    private function cabecerasTablas($idconcepto, $cabecera)
    {
        switch ($idconcepto){
            case 1:
                $cabecera [] = array('text' => utf8_decode('Tipo de órgano'), 'index' => 'organo');
                break;
            case 2:
                $cabecera [] = array('text' => utf8_decode('Tipo de agrupación'), 'index' => 'organo');
                break;
            case 3:
            case 4:
                $cabecera [] = array('text' => utf8_decode('Reup'), 'index' => 'codigo');
                $cabecera [] = array('text' => utf8_decode('Tipo escala'), 'index' => 'tipoescala');
                $cabecera [] = array('text' => utf8_decode('Especialidad'), 'index' => 'especialidad');
                break;
            case 5:
                $cabecera [] = array('text' => utf8_decode('Tipo de órgano interno'), 'index' => 'organo');
                break;
            case 6:
                $cabecera [] = array('text' => utf8_decode('Tipo de agrupación interna'), 'index' => 'organo');
                break;
            case 7:
                $cabecera [] = array('text' => utf8_decode('Cantidad'), 'index' => 'cantidad');
                $cabecera [] = array('text' => utf8_decode('Esp.Prepa'), 'index' => 'especialidad_preparacion');
                $cabecera [] = array('text' => utf8_decode('Esp.Empleo'), 'index' => 'especialidad_empleo');
                $cabecera [] = array('text' => utf8_decode('Categoría'), 'index' => 'categocup');
                $cabecera [] = array('text' => utf8_decode('Grado'), 'index' => 'grado');
                $cabecera [] = array('text' => utf8_decode('Preparación'), 'index' => 'preparacion');
                $cabecera [] = array('text' => utf8_decode('Salario'), 'index' => 'grupo_salario');
                break;
            case 9:
                $cabecera [] = array('text' => utf8_decode('Tipo de medio'), 'index' => 'tipomedio');
                $cabecera [] = array('text' => utf8_decode('Cantidad'), 'index' => 'cantidad');
                break;
        }
        return $cabecera;
    }

    /**
     * @param $idconcepto
     * @param $cabecera
     *
     * @return float
     */
    private function sizeChange($idconcepto, $cabecera)
    {
        if ($idconcepto != 3 && $idconcepto != 4 && $idconcepto != 7) {
            if ($idconcepto != 8) {
                $size = $this->pdf->fw / count($cabecera) - 25;

                return $size;
            } else {
                $size = $this->pdf->fw / count($cabecera) - 100;

                return $size;
            }
        } else {
            $size = $this->pdf->fw / count($cabecera);

            return $size;
        }
    }
}