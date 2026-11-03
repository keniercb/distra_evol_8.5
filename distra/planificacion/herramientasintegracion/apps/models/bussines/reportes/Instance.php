<?php

/**
 * @author Daniel Barrios Cardoso
 * @package reportes_Instance
 * @copyright UCID 2011
 */
abstract class reportes_Instance { 

    protected static $instance;
    protected $countAnexo = 0;
    protected $data;
    protected $locale;
    protected $paperH = false;

    protected function __construct() {
        
    }

    protected function setHorizontalOrientation() {
        /* @var reportes_Reporte $reporte */
        $reporte = reportes_Reporte::getInstance();
        $reporte->setLandscape();
        $this->paperH = true;
    }

    public function getData() {
        return $this->data;
    }

    protected function getLocaleContents() {
        
    }

    public static function getInstance($type) {
        if (!isset(self::$instance [$type])) {
            self::$instance [$type] = new $type ();
        }
        return self::$instance [$type];
    }

    protected function lineBreak(&$container) {
        $container->emptyParagraph(FontFactory::getInstance()->getFont('arial10'), FormatFactory::getInstance()->getFormat('left'));
    }

    public function flexSetter($indexer, $info) {
        $this->data [$indexer] = $info;
    }

    public function setPageSize($width, $height) {
        reportes_Reporte::getInstance()->setPageSize($width, $height);
    }

    protected function addTitle(&$container, $font, $format) {
        $container->writeText($this->data ['title'], $font, $format);
    }

    protected function insertDataTable_Template1(&$container, $tableInfo, Font $font, ParFormat $format) {
        $layout = $container->addTable('left');
        $layout->setRowAsHeader(0);
        $columnSizes = array();
        for ($row = 1; $row <= count($tableInfo); $row++) {
            $layout->addRow();
            for ($column = 1; $column <= count($tableInfo [$row]); $column++) {
                if ($row == 1) {
                    $columnWidth = reportes_CalculoTipografico::getInstance()->calculateMaxWordWidth($tableInfo [$row] [$column], $font);
                    $columnWidth = reportes_CalculoTipografico::getInstance()->convertPtosToCM($columnWidth);
                    $columnWidth *= 1.2;
                    $layout->addColumn($columnWidth);
                    $cell = $layout->getCell($row, $column);
                    $cell->writeText($tableInfo [$row] [$column], $font, $format);
                    $cell->setBackGround('#eae8e8');
                    $columnSizes [] = $columnWidth;
                } else {
                    if ($layout->checkIfCellExists($row, $column)) {
                        $cell = $layout->getCell($row, $column);
                        $cell->writeText($tableInfo [$row] [$column], $font, $format);
                    }
                }
                $optimizedSizes = reportes_Reporte::getInstance()->getOptimalCellSize($columnSizes);
                $layout->setOptimalCellSize($optimizedSizes, $row, 1, count($columnSizes));
            }
            $layout->setVerticalAlignmentOfCells('center', 1, 1, count($layout->rows), count($layout->columns));
        }

        $layout->setBordersOfCells(BorderFactory::getInstance()->getBorder('normal'), 1, 1, count($layout->rows), count($layout->columns));
    }

    protected function mapDataInTable(&$layout, $data, $font, $format) {
        $iterator = new ArrayIterator($data);
        foreach ($iterator as $rows) {
            $layout->addRow();
            $innerIterator = new ArrayIterator($rows);
            foreach ($innerIterator as $column => $value) {
                if ($layout->checkIfCellExists(count($layout->rows), $column)) {
                    $layout->getCell(count($layout->rows), $column)->writeText($value, $font, $format);
                }
            }
        }
    }

    protected function &createTableByStdObject(&$container, $object, $fonts, $formats) {
        $layout = null;
        if (isset($object->header)) {
            $method = $object->header;
            $layout = $this->$method($container, $fonts ['header'], $formats ['header']);
        }
        if (isset($object->items)) {
            $items = new ArrayIterator($object->items);
            foreach ($items as $item) {
                switch ($item->type) {
                    case 'groupGridV' :
                        $this->processObjectGroupByGridToTableV($layout, $item, $fonts ['body']);
                        break;
                    case 'groupGridH' :
                        $this->processObjectGroupByGridToTableH($layout, $item, $fonts ['body'], $formats ['body']);
                        break;
                    case 'grid' :
                        $this->processGridObject($layout, $item, $fonts ['body']);
                        break;
                    case 'total' :
                        $this->processTotalObject($layout, $item, $fonts ['body']);
                        break;
                }
            }
        }
        return $layout;
    }

    protected function processGridObject(&$layout, $object, Font $font) {

        if (is_object($object) && isset($object->data) && is_array($object->data)) {
            $temp = count($layout->rows);
            $rows = new ArrayIterator($object->data);
            foreach ($rows as $row) {
                $layout->addRow();
                $columns = new ArrayIterator($row);
                foreach ($columns as $column => $value) {
                    if ($layout->checkIfCellExists(count($layout->rows), $column)) {
                        $cell = $layout->getCell(count($layout->rows), $column);

                        if (is_object($value)) {
                            $this->processSimpleObject($cell, $value, $font);
                        }
                    }
                }
            }

            // $layout->setVerticalAlignmentOfCells('center', $temp + 1, 1, count($layout->rows), count($layout->columns));
        }
    }

    protected function processSimpleObject(&$cell, &$object, Font $font) {
        if (isset($object->align)) {
            switch ($object->align) {
                case 'left' :
                    $object->align = FormatFactory::getInstance()->getFormat('left');
                    break;
                case 'justify' :
                    $object->align = FormatFactory::getInstance()->getFormat('justify');
                    ;
                    break;
                case 'center' :
                    $object->align = FormatFactory::getInstance()->getFormat('center');
                    ;
                    break;
                case 'right' :
                    $object->align = FormatFactory::getInstance()->getFormat('right');
                    ;
                    break;
                default :
                    $object->align = FormatFactory::getInstance()->getFormat('left');
            }
        }
        if (isset($object->borderLeft) || isset($object->borderTop) || isset($object->borderRight) || isset($object->borderBottom)) {
            $object->borderLeft = isset($object->borderLeft) ? true : false;
            $object->borderTop = isset($object->borderTop) ? true : false;
            $object->borderRight = isset($object->borderRight) ? true : false;
            $object->borderBottom = isset($object->borderBottom) ? true : false;
            $cell->setBordersOverride(BorderFactory::getInstance()->getBorder('normal'), $object->borderLeft, $object->borderTop, $object->borderRight, $object->borderBottom);
        }
        if (isset($object->text)) {
            $cell->writeText($object->text, $font, $object->align);
        }
    }

    protected function prepareLayout(&$layout) {
        $layout->addRow();
        $layout->mergeCells(count($layout->rows), 1, count($layout->rows), count($layout->columns));
    }

    protected function processInfoObject(&$layout, &$object, Font $font, $format) {
        if (isset($object->text)) {
            $this->prepareLayout($layout);
            $cell = $layout->getCell(count($layout->rows), 1);
            $cell->writeText($object->text, $font, $format);
        }
    }

    protected function processObjectListToTable(&$layout, &$object, Font $font, $format, $listStyle) {
        if (isset($object->text)) {
            $this->prepareLayout($layout);
            $cell = $layout->getCell(count($layout->rows), 1);
            $cell->writeListNumberToText($object->text, $font, $format, $listStyle);
        }
    }

    protected function processObjectGroupByGridToTableV(Table & $layout, $object, Font $font, $columnStart = 1) {
        if (isset($object->data)) {
            $startRow = count($layout->rows) + 1;
            $this->processGridObject($layout, $object->data, $font);
            $layout->mergeCells($startRow, $columnStart, (int) count($layout->rows), $columnStart);
            $cell = $layout->getCell($startRow, $columnStart);
            $cell->setVerticalAlignment('center');
            if (isset($object->text)) {
                $this->processSimpleObject($cell, $object->text, $font);
            }
        }
    }

    protected function processObjectGroupByGridToTableH(Table & $layout, $object, Font $font, ParFormat $format) {
        if (isset($object->text)) {
            $this->processInfoObject($layout, $object, $font, $format);
            if (isset($object->data)) {
                $this->processGridObject($layout, $object->data, $font);
            }
        }
    }

    protected function processTotalObject(&$layout, $object, $font) {
        //print 'efbasdnbambsv';die;
        $layout->addRow();
        $iterator = new ArrayIterator($object->data);
        foreach ($iterator as $column => $value) {
            if ($layout->checkIfCellExists(count($layout->rows), $column)) {
                $cell = $layout->getCell(count($layout->rows), $column);
                if (is_object($value)) {
                    $this->processSimpleObject($cell, $value, $font);
                }
            }
        }
        unset($iterator);
        $cell = reportes_Reporte::getCells($layout, count($layout->rows), 1, count($layout->rows), 1);
        reportes_Reporte::paintBorders($cell, false, false, false, true);
        $cells = reportes_Reporte::getInstance()->getCells($layout, (count($layout->rows)), 2, count($layout->rows), count($layout->columns));
        reportes_Reporte::getInstance()->paintBorders($cells, false, true, false, true);
    }

    public function generateReport() {
        $this->getLocaleContents();
        reportes_Reporte::getInstance()->generateReport();
    }

}