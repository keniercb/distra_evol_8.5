<?php

/*
 * Clase que se encarga de implementar el reporte de documento de tipo informe.
 *
 * @package documentos
 * @copyright UCID Cuba
 * @author Leyner Patterson Tamayo
 * @version 1.0-0
 */

class reportes_map extends reportes_Instance {

    const CP_NAME = '<b>Resumen de los resultados</b>';

    /*
     * @uses Funci?n que se utiliza para poner el titulo al documento
     */

    public function addTitle(&$container, $font, $format) {
        $container->writeText(reportes_map::CP_NAME, $font, $format);
        parent::addTitle($container, $font, $format);
    }

    public function addTitleTabla(&$container, $font, $format) {
        $container->writeText(reportes_map::CP_NAME, $font, $format);
        parent::addTitle($container, $font, $format);
    }

    /**
     * @uses Funci?n que se utiliza para incluir una imagen en el documento
     * @method addChield
     * @param object &$container
     * @param object $format
     * @return
     */
    protected function addChield($container, $format) {
        $dir = $_SERVER ['DOCUMENT_ROOT'] . '/actoresfuentes/comun/recursos/iconos/logo.png';
        $container->addImage($dir, $format);
    }

    /**
     * @uses Funci?n que se utiliza para crear la tabla de resumen de los resultados
     * @method createTableResumenResultadosMap
     * @param object &$container
     * @param object $font
     * @param object $format
     * @return object
     */
    public function createTableResumenResultadosMap(&$container, $font, $format, $textonegro) {

        $layout = $container->addTable('left');
        $cantidad_filas = count($this->data['map']['resumen']);
        $layout->addRows($cantidad_filas + 1);
        $optimalSizes = reportes_Reporte::getInstance()->getOptimalCellSize(array(5,3,3,3,3));
        $layout->addColumnsList($optimalSizes);
        $layout->writeToCell(1, 1, 'Actos / Resultados', $font, FormatFactory::getInstance()->getFormat('left'));
        $layout->writeToCell(1, 2, 'Factibilidad institucional', $font, $format);
        $layout->writeToCell(1, 3, 'Factibilidad de hecho', $font, $format);
        $layout->writeToCell(1, 4, 'Estabilidad del acto', $font, $format);
        $layout->writeToCell(1, 5, 'Solidez del acto', $font, $format);

        $layout->setBackGroundOfCells('#ac2925', 1, 1, 1, 5);

        for ($i = 0; $i < $cantidad_filas + 1; $i++) {
            $layout->writeToCell($i + 2, 1, $this->data['map']['resumen'][$i]['denominacion'], $textonegro, $format);
            $layout->writeToCell($i + 2, 2, html_entity_decode(strip_tags($this->data['map']['resumen'][$i]['factibilidadinstitucional'])), $textonegro, $format);
            $layout->writeToCell($i + 2, 3, html_entity_decode(strip_tags($this->data['map']['resumen'][$i]['factibilidadhecho']), ENT_QUOTES, "UTF-8"), $textonegro, $format);
            $layout->writeToCell($i + 2, 4, html_entity_decode(strip_tags($this->data['map']['resumen'][$i]['estabilidadacto']), ENT_QUOTES, "UTF-8"), $textonegro, $format);
            $layout->writeToCell($i + 2, 5, $this->data['map']['resumen'][$i]['solidezacto'], $textonegro, $format);
        }
        $layout->setBordersOfCells(BorderFactory::getInstance()->getBorder('normal'), 1, 1, count($layout->rows), count($layout->columns));
        $cells = reportes_Reporte::getInstance()->getCells($layout, 1, 1, count($layout->rows), count($layout->columns));
        /* poner los bordes transparentes */
        reportes_Reporte::getInstance()->paintBorders($cells, false, false, false, false);
        $layout->setRowsKeepTogether();
        return $layout;
    }

    /* @uses Funci?n que se utiliza para crear el documento
     * @method generateReport
     * @return
     */

    public function generateReport() {
        //margenes del doc
        reportes_Reporte::getInstance()->setMarginsForDocument(2, 2, 2, 2);
        //Declaration of Fonts
        $arial12 = FontFactory::getInstance()->getFont('arial12');
        $arial12blanco = FontFactory::getInstance()->getFont('arial12blanco');
        $arial12blanco->setBold();
        $arial10 = FontFactory::getInstance()->getFont('arial10');
        $tableFonts = array('header' => $arial12, 'body' => $arial12);
        //$list=  ListStyleFactory::getInstance()->getListType('2',$arial8);
        //Declaration of Formats
        $centerFormat = FormatFactory::getInstance()->getFormat('center');
        $leftFormat = FormatFactory::getInstance()->getFormat('left');
        /////////////////////////////////////////////////////////////////////
        //Start Configuration of report
        parent::generateReport();
        //OTRO
        $this->addFirtsHeader(reportes_Reporte::getInstance(), $arial10, $leftFormat);


        $section = reportes_Reporte::getInstance()->addSection();
        //Tabla resumen de los resultados
        $section->writeText('<b>Resumen de los resultados del modelo de análisis político</b>', $arial12, $leftFormat);
        $section->insertEndPar();
        self::createTableResumenResultadosMap($section, $arial12blanco, $leftFormat, $arial12);
        $section->insertEndPar();
        reportes_Reporte::getInstance()->sendRtf($this->data['map']['nombrearchivo']);
    }

    protected function addFirtsHeader(&$container, $font, $format) {
        $header = $container->addHeader('first');
        $layout = $this->createHeaderLayout($header);
        $this->addLogo($layout->getCell(1, 1), $format);
        $header->insertEndPar();
        return $layout;
    }

    protected function createHeaderLayout(&$header) {
        $layout = $header->addTable('left');
        $layout->addRows(1, 0.4);
        $rest = reportes_Reporte::getInstance()->getPageActiveWidth() - 10;
        $layout->addColumnsList(array(13, $rest, 1));
        return $layout;
    }

    /**
     * @uses Adicionar imagen representativa de m�dulo del sistema o empresa que lo utiliza.
     * @method addLogo
     * @param (Container container). Elemento contenedor: secci�n, tabla o documento.
     * @param (Parformat $format). Contiene formato visual de representaci�n para textos o imagenes.
     * @return
     */
    protected function addLogo(&$container, $format) {
        $filename = $_SERVER['DOCUMENT_ROOT'] . '/actoresfuentes/comun/recursos/iconos/logoreporte.png';
        $container->addImage($filename, $format);
    }

}
