<?php

/**
 * @author Daniel Barrios Cardoso
 * @package reportes_Reporte
 * @copyright UCID 2011
 */
class reportes_Reporte extends Rtf {

    private static $instance = null;
    public $lists;
    public $listsOverride;
    protected $pageWidth = 21.59;
    protected $pageHeight = 27.94;
    protected $pageMargins = array('top' => 1.5, 'left' => 1.5, 'bottom' => 1.5, 'right' => 1.5);

    protected function __construct() {
        parent::__construct();
    }

    public static function getInstance() {
        if (self::$instance === null) {
            $className = __class__;
            self::$instance = new $className ();
        }
        return self::$instance;
    }

    public function getListTable() {
        $content = '{\*\listtable';
        if (isset($this->lists) && is_array($this->lists) && count($this->lists) > 0) {
            foreach ($this->lists as $list) {
                $content .= $list->getContent();
            }
        }
        $content .= '}';
        return $content;
    }

    public function getListOverrideTable() {
        $content = '{\*\listoverridetable';
        if (isset($this->listsOverride) && is_array($this->listsOverride) && count($this->listsOverride) > 0) {
            foreach ($this->listsOverride as $listOverride) {
                $content .= $listOverride->getContent();
            }
        }
        $content .= '}';
        return $content;
    }

    public function setMarginsForDocument($left = 0, $top = 0, $right = 0, $bottom = 0) {
        if ($left != 0)
            $this->pageMargins ['left'] = $left;
        if ($top != 0)
            $this->pageMargins ['top'] = $top;
        if ($right != 0)
            $this->pageMargins ['right'] = $right;
        if ($bottom != 0)
            $this->pageMargins ['bottom'] = $bottom;
        parent::setMargins($this->pageMargins ['left'], $this->pageMargins ['top'], $this->pageMargins ['right'], $this->pageMargins ['bottom']);
    }

    /**
     * Establece las dimensiones del documento, si no se suministran parametros setea la configuracion por defecto.
     * @param float width (Determina el ancho del documento).
     * @param float height (Determina el alto del documento).
     * @param (opcional) Se usa para determinar la orientación [Vertical ó Horizontal] del documento.
     * @access public
     */
    public function setPageSize($width = null, $height = null) {
        $this->pageWidth = !is_null($width) ? $width : $this->pageWidth;
        $this->pageHeight = !is_null($height) ? $height : $this->pageHeight;
        $this->setPaperWidth($this->pageWidth);
        $this->setPaperHeight($this->pageHeight);
    }

    public function getPageWidth() {
        return $this->pageWidth;
    }

    public function getPageHeight() {
        return $this->pageHeight;
    }

    public function setDocumentColumns($cant, $arrayWidth = null) {
        if (is_array($arrayWidth) && isset($arrayWidth)) {
            $this->setColumns($arrayWidth);
        } else if (isset($cant))
            $this->setColumnsCount($cant);
        return;
    }

    public function getPageActiveWidth() {
        if (isset($this->pageWidth)) {
            $pageLayout = $this->pageWidth;
            return $pageLayout - ($this->pageMargins ['left'] + $this->pageMargins ['right']);
        } else
            throw new ZendExt_Exception('EC035');
    }

    public function getPageActiveHeight() {
        if (isset($this->pageHeight)) {
            $pageLayout = $this->pageHeight;
            return $pageLayout - ($this->marginTop + $this->marginBottom);
        } else
            throw new Exception('EC036');
    }

    public function paintBorders(&$elements, $left = true, $top = true, $right = true, $bottom = true) {
        foreach ($elements as & $element) {
            $element->setBordersOverride(BorderFactory::getInstance()->getBorder('normal'), $left, $top, $right, $bottom);
        }
    }

    public function setVerticalAlignmentOfElements(&$elements, $aligment) {
        foreach ($elements as & $element) {
            $element->setVerticalAlignment($aligment);
        }
    }

    public function getCells(&$layout, $startRow, $startColumn, $endRow, $endColumn) {
        for ($row = isset($startRow) ? $startRow : 1; $row <= $endRow; $row++) {
            for ($column = isset($startColumn) ? $startColumn : 1; $column <= $endColumn; $column++) {
                $cells [] = &$layout->getCell($row, $column);
            }
        }
        return $cells;
    }

    public function getOptimalCellSize($arraySizes, $maxSize = null) {
        $sumSizes = array_sum($arraySizes);
        $maxSize = is_null($maxSize) ? $this->getPageActiveWidth() : $maxSize;
        $dif = $maxSize - $sumSizes;
        //print $dif;die;
        if ($dif < 0)
            throw new Exception('Error : El tamaño total de las celdas excede el espacio disponible de la página');
        $div = (double) $dif / count($arraySizes);
        $rest = ($dif - ($div * (count($arraySizes))));
        if ($rest != 0) {
            $bigger = $arraySizes [0];
            $tempKey = 0;
            foreach ($arraySizes as $key => $value) {
                if ($value > $bigger) {
                    $bigger = $value;
                    $tempKey = $key;
                }
                $arraySizes [$key] += $div;
            }
            $arraySizes [$tempKey] += $rest;
        } else {
            foreach ($arraySizes as $key => $value) {
                $arraySizes[$key] += $div;
            }
        }
        return $arraySizes;
    }

    public function mergeHorizontalCells($layout, $row, $startColumn, $endColumn) {
        $layout->mergeCells($row, $startColumn, $row, $endColumn);
    }

    public function mergeVerticalCells($layout, $startRow, $column, $endRow, $column) {
        $layout->mergeCells($startRow, $column, $endRow, $column);
    }

    public function addPageNumber(&$container, $font, $format) {
        //$container->insertLineBreak();
        $container->writeText('- <PAGENUM> -', $font, $format);
    }

    public function setDefaults() {
        $this->setMarginsForDocument();
        self::setPageSize();
        self::setZoom(100);
    }

    public function generateReport() {
        $this->setDefaults();
    }

    public function prepare() {
        echo '{\rtf\ansi\deff0 \r\n';
        echo $this->getFontTable();
        echo $this->getColorTable();
        echo $this->getListTable();
        echo $this->getListOverrideTable();
        echo $this->getInfoPart();

        //page properties
        echo!empty($this->landscape) ? '\landscape ' : '';

        echo '\deftab' . round(TWIPS_IN_CM * $this->defaultTabWidth) . ' ';

        echo '\paperw' . round(TWIPS_IN_CM * $this->paperWidth) . ' ';

        echo '\paperh' . round(TWIPS_IN_CM * $this->paperHeight) . ' ';

        echo '\margl' . round(TWIPS_IN_CM * $this->marginLeft) . ' ';

        echo '\margr' . round(TWIPS_IN_CM * $this->marginRight) . ' ';

        echo '\margt' . round(TWIPS_IN_CM * $this->marginTop) . ' ';

        echo '\margb' . round(TWIPS_IN_CM * $this->marginBottom) . ' ';

        if (isset($this->gutter)) {
            echo '\gutter' . round($this->gutter * TWIPS_IN_CM) . ' ';
        }

        if (!empty($this->mirrorMargins)) {
            echo '\margmirror ';
        }

        if (!empty($this->viewMode)) {
            echo '\viewkind' . ($this->viewMode) . ' ';
        }

        if (!empty($this->zoomKind)) {
            echo '\viewzk' . $this->zoomKind . ' ';
        }

        if (!empty($this->zoom)) {
            echo '\viewscale' . $this->zoom . ' ';
        }

        if (!empty($this->sections [0]) && !empty($this->sections [0]->bordered)) {
            echo $this->sections [0]->bordered->getContent($this, '\pg');
        } else if (!empty($this->bordered)) {
            echo $this->bordered->getContent($this, '\pg');
        }

        //headers and footers properties
        echo!empty($this->oddEvenDifferent) ? '\facingp ' : '';
        echo!empty($this->titlepg) ? '\titlepg ' : '';

        //headers and footers if there are no sections
        if (count($this->sections) == 0) {
            foreach ($this->headers as $value) {
                echo $value->getContent();
            }

            foreach ($this->footers as $value) {
                echo $value->getContent();
            }
        }
        //sections
        foreach ($this->sections as $key => $section) {
            echo $section->getContent();
            unset($this->sections [$key]);
        }

        echo '}';
        /* echo '<br>'.(((memory_get_usage()/8)/1024)/1024).' M ';
          die(); */
    }

}

