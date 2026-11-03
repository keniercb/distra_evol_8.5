<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/../lib/PHPExcel.php');

class htmlExcelClass
{

    private $gHtmlTable;
    private $gDomDocument;
    private $gTables;
    private $objPhpExcel;

    public function __construct($agTitle, $agHtmlTable)
    {

        $this->gHtmlTable = strip_tags($agHtmlTable, "<table><tr><th><thead><tbody><tfoot><td><br><b><span>");
        $this->gHtmlTable = str_replace("<br />", "\n", $this->gHtmlTable);
        $this->gHtmlTable = str_replace("<br/>", "\n", $this->gHtmlTable);
        $this->gHtmlTable = str_replace("<br>", "\n", $this->gHtmlTable);
        $this->gHtmlTable = str_replace("&nbsp;", " ", $this->gHtmlTable);
        $this->gHtmlTable = str_replace("\n\n", "\n", $this->gHtmlTable);

        $this->gDomDocument = new domDocument;
        $this->gDomDocument->loadHTML($this->gHtmlTable);
        $this->gDomDocument->preserveWhiteSpace = false;

        $this->gTables = $this->gDomDocument->getElementsByTagName('table');
        $this->objPhpExcel = new PHPExcel();
        $this->objPhpExcel->getDefaultStyle()->getFont()->setName('Arial');
        $this->objPhpExcel->getDefaultStyle()->getFont()->setSize(9);

        $this->objPhpExcel->getProperties()->setCreator("Maarten Balliauw");
        $this->objPhpExcel->getProperties()->setLastModifiedBy("Maarten Balliauw");
        $this->objPhpExcel->getProperties()->setTitle("Office 2007 XLSX Test Document");
        $this->objPhpExcel->getProperties()->setSubject("Office 2007 XLSX Test Document");
        $this->objPhpExcel->getProperties()->setDescription(
            "Test document for Office 2007 XLSX, generated using PHP classes."
        );
        $this->objPhpExcel->getProperties()->setKeywords("Exported File");
        $this->objPhpExcel->getProperties()->setCategory("Export");

        $this->initExport();
    }

    public function initExport()
    {
        $tbcnt = $this->gTables->length;
        for ($z = 0; $z < $tbcnt; $z++) {
            $maxcols = 0;
            $totrows = 0;
            $headrows = array();
            $bodyrows = array();
            $r = 0;
            $h = 0;
            $rows = $this->gTables->item($z)->getElementsByTagName('tr');
            $totrows = $rows->length;

            foreach ($rows as $row) {
                $ths = $row->getElementsByTagName('th');
                if (is_object($ths)) {
                    if ($ths->length > 0) {
                        $headrows[$h]['colcnt'] = $ths->length;
                        if ($ths->length > $maxcols) {
                            $maxcols = $ths->length;
                        }
                        $nodes = $ths->length - 1;
                        for ($x = 0; $x <= $nodes; $x++) {
                            $thishdg = $ths->item($x)->nodeValue;
                            $headrows[$h]['th'][] = $thishdg;
                            $headrows[$h]['bold'][] = $this->findBoldText($this->innerHTML($ths->item($x)));
                            if ($ths->item($x)->hasAttribute('style')) {
                                $style = $ths->item($x)->getAttribute('style');
                                $stylecolor = $this->findStyleColor($style);
                                if ($stylecolor == '') {
                                    $headrows[$h]['color'][] = $this->findSpanColor($this->innerHTML($ths->item($x)));
                                } else {
                                    $headrows[$h]['color'][] = $stylecolor;
                                }
                            } else {
                                $headrows[$h]['color'][] = $this->findSpanColor($this->innerHTML($ths->item($x)));
                            }
                            if ($ths->item($x)->hasAttribute('colspan')) {
                                $headrows[$h]['colspan'][] = $ths->item($x)->getAttribute('colspan');
                            } else {
                                $headrows[$h]['colspan'][] = 1;
                            }
                            if ($ths->item($x)->hasAttribute('align')) {
                                $headrows[$h]['align'][] = $ths->item($x)->getAttribute('align');
                            } else {
                                $headrows[$h]['align'][] = 'left';
                            }
                            if ($ths->item($x)->hasAttribute('valign')) {
                                $headrows[$h]['valign'][] = $ths->item($x)->getAttribute('valign');
                            } else {
                                $headrows[$h]['valign'][] = 'top';
                            }
                            if ($ths->item($x)->hasAttribute('bgcolor')) {
                                $headrows[$h]['bgcolor'][] = str_replace(
                                    "#", "", $ths->item($x)->getAttribute('bgcolor')
                                );
                            } else {
                                $headrows[$h]['bgcolor'][] = 'FFFFFF';
                            }
                        }
                        $h++;
                    }
                }
            }
            foreach ($rows as $row) {
                $tds = $row->getElementsByTagName('td');
                if (is_object($tds)) {
                    if ($tds->length > 0) {
                        $bodyrows[$r]['colcnt'] = $tds->length;
                        if ($tds->length > $maxcols) {
                            $maxcols = $tds->length;
                        }
                        $nodes = $tds->length - 1;
                        for ($x = 0; $x <= $nodes; $x++) {
                            $thistxt = $tds->item($x)->nodeValue;
                            $bodyrows[$r]['td'][] = $thistxt;
                            $bodyrows[$r]['bold'][] = $this->findBoldText($this->innerHTML($tds->item($x)));
                            if ($tds->item($x)->hasAttribute('style')) {
                                $style = $tds->item($x)->getAttribute('style');
                                $stylecolor = $this->findStyleColor($style);
                                if ($stylecolor == '') {
                                    $bodyrows[$r]['color'][] = $this->findSpanColor($this->innerHTML($tds->item($x)));
                                } else {
                                    $bodyrows[$r]['color'][] = $stylecolor;
                                }
                            } else {
                                $bodyrows[$r]['color'][] = $this->findSpanColor($this->innerHTML($tds->item($x)));
                            }
                            if ($tds->item($x)->hasAttribute('colspan')) {
                                $bodyrows[$r]['colspan'][] = $tds->item($x)->getAttribute('colspan');
                            } else {
                                $bodyrows[$r]['colspan'][] = 1;
                            }
                            if ($tds->item($x)->hasAttribute('align')) {
                                $bodyrows[$r]['align'][] = $tds->item($x)->getAttribute('align');
                            } else {
                                $bodyrows[$r]['align'][] = 'left';
                            }
                            if ($tds->item($x)->hasAttribute('valign')) {
                                $bodyrows[$r]['valign'][] = $tds->item($x)->getAttribute('valign');
                            } else {
                                $bodyrows[$r]['valign'][] = 'top';
                            }
                            if ($tds->item($x)->hasAttribute('bgcolor')) {
                                $bodyrows[$r]['bgcolor'][] = str_replace(
                                    "#", "", $tds->item($x)->getAttribute('bgcolor')
                                );
                            } else {
                                $bodyrows[$r]['bgcolor'][] = 'FFFFFF';
                            }
                        }
                        $r++;
                    }
                }
            }
            if ($z > 0) {
                $this->objPhpExcel->createSheet($z);
            }
            $suf = $z + 1;
            $tablevar = 'asdasd';
            $tableid = $tablevar . $suf;
            $wksheetname = ucfirst($tableid);
            $this->objPhpExcel->setActiveSheetIndex($z); // each sheet corresponds to a table in html
            $this->objPhpExcel->getActiveSheet()->setTitle($wksheetname); // tab name
            $worksheet = $this->objPhpExcel->getActiveSheet(); // set worksheet we're working on
            $style_overlay = array('font'      =>
                                   array('color'                          =>
                                         array('rgb' => '000000'), 'bold' => false,),
                                   'fill'      =>
                                   array('type'  => PHPExcel_Style_Fill::FILL_SOLID,
                                         'color' => array('rgb' => 'CCCCFF')),
                                   'alignment' =>
                                   array('wrap' => true, 'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
                                         'vertical' => PHPExcel_Style_Alignment::VERTICAL_TOP),
                                   'borders'   => array('top'    => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                                                        'bottom' => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                                                        'left'   => array('style' => PHPExcel_Style_Border::BORDER_THIN),
                                                        'right'  => array('style' => PHPExcel_Style_Border::BORDER_THIN)),
            );
            $xcol = '';
            $xrow = 1;
            $usedhdrows = 0;
            $heightvars = array(1 => '42', 2 => '42', 3 => '48', 4 => '52', 5 => '58', 6 => '64', 7 => '68', 8 => '76',
                                9 => '82');
            for ($h = 0; $h < count($headrows); $h++) {
                $th = $headrows[$h]['th'];
                $colspans = $headrows[$h]['colspan'];
                $aligns = $headrows[$h]['align'];
                $valigns = $headrows[$h]['valign'];
                $bgcolors = $headrows[$h]['bgcolor'];
                $colcnt = $headrows[$h]['colcnt'];
                $colors = $headrows[$h]['color'];
                $bolds = $headrows[$h]['bold'];
                $usedhdrows++;
                $mergedcells = false;
                for ($t = 0; $t < count($th); $t++) {
                    if ($xcol == '') {
                        $xcol = 'A';
                    } else {
                        $xcol++;
                    }
                    $thishdg = $th[$t];
                    $thisalign = $aligns[$t];
                    $thisvalign = $valigns[$t];
                    $thiscolspan = $colspans[$t];
                    $thiscolor = $colors[$t];
                    $thisbg = $bgcolors[$t];
                    $thisbold = $bolds[$t];
                    $strbold = ($thisbold == true) ? 'true' : 'false';
                    if ($thisbg == 'FFFFFF') {
                        $style_overlay['fill']['type'] = PHPExcel_Style_Fill::FILL_NONE;
                    } else {
                        $style_overlay['fill']['type'] = PHPExcel_Style_Fill::FILL_SOLID;
                    }
                    $style_overlay['alignment']['vertical'] = $thisvalign; // set styles for cell
                    $style_overlay['alignment']['horizontal'] = $thisalign;
                    $style_overlay['font']['color']['rgb'] = $thiscolor;
                    $style_overlay['font']['bold'] = $thisbold;
                    $style_overlay['fill']['color']['rgb'] = $thisbg;
                    $worksheet->setCellValue($xcol . $xrow, $thishdg);
                    $worksheet->getStyle($xcol . $xrow)->applyFromArray($style_overlay);

                    if ($thiscolspan > 1) { // spans more than 1 column
                        $mergedcells = true;
                        $lastxcol = $xcol;
                        for ($j = 1; $j < $thiscolspan; $j++) {
                            $lastxcol++;
                            $worksheet->setCellValue($lastxcol . $xrow, '');
                            $worksheet->getStyle($lastxcol . $xrow)->applyFromArray($style_overlay);
                        }
                        $cellRange = $xcol . $xrow . ':' . $lastxcol . $xrow;

                        $worksheet->mergeCells($cellRange);
                        $worksheet->getStyle($cellRange)->applyFromArray($style_overlay);
                        $num_newlines = substr_count($thishdg, "\n"); // count number of newline chars
                        if ($num_newlines > 1) {
                            $rowheight = $heightvars[1]; // default to 35
                            if (array_key_exists($num_newlines, $heightvars)) {
                                $rowheight = $heightvars[$num_newlines];
                            } else {
                                $rowheight = 75;
                            }
                            $worksheet->getRowDimension($xrow)->setRowHeight($rowheight); // adjust heading row height
                        }
                        $xcol = $lastxcol;
                    }
                }
                $xrow++;
                $xcol = '';
            }
            //Put an auto filter on last row of heading only if last row was not merged
            if (!$mergedcells) {
                $worksheet->setAutoFilter(
                    "A$usedhdrows:" . $worksheet->getHighestColumn() . $worksheet->getHighestRow()
                );
            }

            // Freeze heading lines starting after heading lines
            $usedhdrows++;
            $worksheet->freezePane("A$usedhdrows");

            //
            // Loop thru data rows and write them out
            //
            $xcol = '';
            $xrow = $usedhdrows;
            for ($b = 0; $b < count($bodyrows); $b++) {
                $td = $bodyrows[$b]['td'];
                $colcnt = $bodyrows[$b]['colcnt'];
                $colspans = $bodyrows[$b]['colspan'];
                $aligns = $bodyrows[$b]['align'];
                $valigns = $bodyrows[$b]['valign'];
                $bgcolors = $bodyrows[$b]['bgcolor'];
                $colors = $bodyrows[$b]['color'];
                $bolds = $bodyrows[$b]['bold'];
                for ($t = 0; $t < count($td); $t++) {
                    if ($xcol == '') {
                        $xcol = 'A';
                    } else {
                        $xcol++;
                    }
                    $thistext = $td[$t];
                    $thisalign = $aligns[$t];
                    $thisvalign = $valigns[$t];
                    $thiscolspan = $colspans[$t];
                    $thiscolor = $colors[$t];
                    $thisbg = $bgcolors[$t];
                    $thisbold = $bolds[$t];
                    $strbold = ($thisbold == true) ? 'true' : 'false';
                    if ($thisbg == 'FFFFFF') {
                        $style_overlay['fill']['type'] = PHPExcel_Style_Fill::FILL_NONE;
                    } else {
                        $style_overlay['fill']['type'] = PHPExcel_Style_Fill::FILL_SOLID;
                    }
                    $style_overlay['alignment']['vertical'] = $thisvalign; // set styles for cell
                    $style_overlay['alignment']['horizontal'] = $thisalign;
                    $style_overlay['font']['color']['rgb'] = $thiscolor;
                    $style_overlay['font']['bold'] = $thisbold;
                    $style_overlay['fill']['color']['rgb'] = $thisbg;
                    if ($thiscolspan == 1) {
                        $worksheet->getColumnDimension($xcol)->setWidth(25);
                    }
                    $worksheet->setCellValue($xcol . $xrow, $thistext);

                    $worksheet->getStyle($xcol . $xrow)->applyFromArray($style_overlay);
                    if ($thiscolspan > 1) { // spans more than 1 column
                        $lastxcol = $xcol;
                        for ($j = 1; $j < $thiscolspan; $j++) {
                            $lastxcol++;
                        }
                        $cellRange = $xcol . $xrow . ':' . $lastxcol . $xrow;

                        $worksheet->mergeCells($cellRange);
                        $worksheet->getStyle($cellRange)->applyFromArray($style_overlay);
                        $xcol = $lastxcol;
                    }
                }
                $xrow++;
                $xcol = '';
            }
            // autosize columns to fit data
            $azcol = 'A';
            for ($x = 1; $x == $maxcols; $x++) {
                $worksheet->getColumnDimension($azcol)->setAutoSize(true);
                $azcol++;
            }
            $this->objPhpExcel->setActiveSheetIndex(0);
            $file = $tablevar . ".xlsx";
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header("Content-Disposition: attachment;filename= $file");
            header('Cache-Control: max-age=0');

            $objWriter = PHPExcel_IOFactory::createWriter($this->objPhpExcel, 'Excel2007');
            $objWriter->save('php://output');
            exit;
        }
    }

    function innerHTML($node)
    {
        $doc = $node->ownerDocument;
        $frag = $doc->createDocumentFragment();
        foreach ($node->childNodes as $child) {
            $frag->appendChild($child->cloneNode(TRUE));
        }
        return $doc->saveXML($frag);
    }

    function findSpanColor($node)
    {
        $pos = stripos($node, "color:"); // ie: looking for style='color: #FF0000;'
        if ($pos === false) { //                        12345678911111
            return '000000'; //                                 01234
        }
        $node = substr($node, $pos); // truncate to color: start
        $start = "#"; // looking for html color string
        $end = ";"; // should end with semicolon
        $node = " " . $node; // prefix node with blank
        $ini = stripos($node, $start); // look for #
        if ($ini === false) {
            return "000000";
        } // not found, return default color of black
        $ini += strlen($start); // get 1 byte past start string
        $len = stripos($node, $end, $ini) - $ini; // grab substr between start and end positions
        return substr($node, $ini, $len); // return the RGB color without # sign
    }

    function findStyleColor($style)
    {
        $pos = stripos($style, "color:"); // ie: looking for style='color: #FF0000;'
        if ($pos === false) { //                        12345678911111
            return ''; //                                 01234
        }
        $style = substr($style, $pos); // truncate to color: start
        $start = "#"; // looking for html color string
        $end = ";"; // should end with semicolon
        $style = " " . $style; // prefix node with blank
        $ini = stripos($style, $start); // look for #
        if ($ini === false) {
            return "";
        } // not found, return default color of black
        $ini += strlen($start); // get 1 byte past start string
        $len = stripos($style, $end, $ini) - $ini; // grab substr between start and end positions
        return substr($style, $ini, $len); // return the RGB color without # sign
    }

    function findBoldText($node)
    {
        $pos = stripos($node, "<b>"); // ie: looking for bolded text
        if ($pos === false) { //                        12345678911111
            return false; //                                 01234
        }
        return true; // found <b>
    }

}

?>
