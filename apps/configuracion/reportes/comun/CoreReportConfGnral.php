<?php

//Scale factor
define('_SF', (72 / 2.54));
define('_SFpx', (96 / 72)); // Will only use px

class CoreReportConfGnral
{

    private $_mPDF;
    private $_htmlExcel;
    private $objDBF;
    private $objReport;
    private $gMETA = "<meta http-equiv= 'Content-Type' content= 'text/html; charset=UTF-8' />";
    private $gDATAHTML = "";
    private $PAGE_COUNT = 0;
    private $gDatoCuerpoWithoutPaging;
    private $gTextTruncated;
    private $gArrayTextTruncated;
    private $gCountArrayTextTruncated;
    private $gWidth;
    private $gHeight;

    public function __construct($argReportFormat, $agArrayReport)
    {
        foreach ($agArrayReport as $this->objReport) {
            $this->PAGE_COUNT++;
            $this->objReport->REPORT_TYPE = $argReportFormat[0];
            $this->objReport->REPORT_ORIENTATION = ($argReportFormat[1] == "Horizontal") ? "L" : "P";
            $this->objReport->REPORT_PAPERSIZE = ($this->objReport->REPORT_ORIENTATION == "L") ?
                $argReportFormat[2] . "-" . $this->objReport->REPORT_ORIENTATION : $argReportFormat[2];
            $this->objReport->FORMAT_PAPERSIZE = $argReportFormat[2];
            $this->gDatoCuerpoWithoutPaging = array();
            $this->gTextTruncated = "";
            $this->gArrayTextTruncated = array();
            $this->gCountArrayTextTruncated = 0;
            $this->HtmlWritenPagingRows(
                $this->objReport, $this->objReport->bodyData, array(), $this->objReport->fieldName
            );
        }
        $DATAHTMLBODY = "<body style='font-family: sans-serif; font-size:9pt;'>$this->gDATAHTML</body>";
        $tituloRpt = strtoupper(str_replace(" ", "_", $this->objReport->generalData->titulo));
        switch ($this->objReport->REPORT_TYPE) {
            case "PDF":
            {
                if (file_exists(
                    Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/mPDFClass.php"
                )
                ) {
                    require_once(
                        Zend_Registry::get('config')->dir_aplication . "/configuracion/reportes/comun/mPDFClass.php");
                    $this->_mPDF
                        = new mPDFClass($this->objReport->REPORT_PAPERSIZE, $this->objReport->REPORT_ORIENTATION);
                    return $this->_mPDF->add_html("<html><head>$this->gMETA</head>$DATAHTMLBODY</html>")->download(
                        $tituloRpt
                    );
                } else {
                    die('LA CLASE <b>mPDFClass</b> NO HA SIDO ENCONTRADA EN EL SERVIDOR.');
                }
            }
                break;
            case "HTML":
                echo ("<html><head>$this->gMETA" . $this->GetSTYLECSSHTML() . "</head>$DATAHTMLBODY</html>");
                break;
            case "EXCEL":
            {
//                    $file = $this->objReport->generalData->titulo . "1";
//                    header('Cache-Control: no-store, no-cache, must-revalidate');
//                    header('Cache-Control: pre-check=0, post-check=0, max-age=0');
//                    header("Expires: 0");
//                    header('Content-Transfer-Encoding: UTF-8');
//                    header('Content-Type: application/vnd.ms-excel;');
//                    header("Content-type: application/x-msexcel");
//                    header("Content-Disposition: attachment; filename = $file.xls");
//                    header('Content-type: application/vnd.ms-word');
//                    header("Content-Disposition: attachment; filename= $file.doc");
                //$this->_htmlExcel = new htmlExcelClass('asdasd', $this->gDATAHTML);
                //echo "EN DESARROLLO";
                //
//          este es el que pincha          
//                    header("Content-Type: application/force-download");
//                    header('Content-type: application/vnd.ms-excel');
//                    header("Content-Disposition: attachment; filename=$tituloRpt.xls");
//                    header("Pragma: no-cache");
//                    header("Expires: 0");
//                    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
//                    print "<head>$this->gMETA</head>" . $this->gDATAHTML;

                header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
                header("Content-Type: application/force-download");
                header("Content-type: application/vnd.ms-excel");
                header("Content-Disposition: attachment; filename = $tituloRpt.xls;\n\n");
                header("Content-Transfer-Encoding: binary");
                header("Cache-Control: no-store, no-cache, must-revalidate");
                header("Cache-Control: post-check = 0, pre-check=0");
                header("Pragma: no-cache");
                header("Expires: -1");
                print "<head>$this->gMETA</head>" . $this->gDATAHTML;


//                aqui para usar PHPEXCEL
//                    $this->objReport->propertiesExcel = array(
//                        'creator             ' => ($this->objReport->generalData->usuario) ? $this->objReport->generalData->usuario : 'Miguel Diaz Riveaux',
//                        'title' => $this->objReport->generalData->titulo,
//                        'subject' => $this->objReport->generalData->titulo,
//                        'description' => $this->objReport->generalData->titulo
//                    );
//                    $this->objReport->columnModel = array(
//                        0 => new ColumnModel('CONCEPTOS', 'descripcionpartida'),
//                        1 => new ColumnModel('PLAN ANUAL', 'sacumulado', PHPExcel_Cell_DataType::TYPE_NUMERIC, PHPExcel_Style_NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1),
//                        2 => new ColumnModel('APERTURA', 'sinicial', PHPExcel_Cell_DataType::TYPE_NUMERIC, PHPExcel_Style_NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1),
//                        3 => new ColumnModel('REAL HASTA LA FECHA', 'speriodo', PHPExcel_Cell_DataType::TYPE_NUMERIC, PHPExcel_Style_NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1)
//                    );
//                    $this->objReport->excelType = "2007x2003";
//                    $argReportFormat[3] = "Porcentaje";
//                    $argReportFormat[4] = 100;
//                    return new PhpExcelRpt($this->objReport, $argReportFormat);
            }
                break;
            case "DBF":
            {
                if (file_exists(
                    Zend_Registry::get('config')->dir_aplication . "/contabilidad/comun/SCFPrintView/comun/PHP_DBF.php"
                )
                ) {
                    require_once(Zend_Registry::get('config')->dir_aplication
                        . "/contabilidad/comun/SCFPrintView/comun/PHP_DBF.php");
//                        $dir = array_search('uri', array_flip(stream_get_meta_data($GLOBALS[mt_rand()] = tmpfile())));
                    mkdir(
                        Zend_Registry::get('config')->dir_aplication . "/contabilidad/comun/SCFPrintView/temp", 0777,
                        true
                    );
                    $dirPath = Zend_Registry::get('config')->dir_aplication . "/contabilidad/comun/SCFPrintView/temp";
                    $dir = tempnam($dirPath, "tmp");
                    rename($dir, $dir .= '.dbf');
//                        if (file_exists($dir) && fopen($dir, "w+")) {
//                        if (fopen($dir, "w+")) {
                    register_shutdown_function(create_function('', "unlink('{$dir}');"));
                    $this->objDBF = new PHP_DBF($this->objReport);
                    $this->objDBF->exportarDBF($dir);
                    set_time_limit(0);
                    $file_path = $dir;
                    $this->objDBF->outputFile($file_path, "$tituloRpt.dbf");
//                        } else {
//                            die('No tiene permisos.');
//                        }
                } else {
                    die('LA CLASE <b>PHP_DBF</b> NO HA SIDO ENCONTRADA EN EL SERVIDOR.');
                }
            }
                break;
            case "WORD":
            {
                header("Content-Type: application/force-download");
                header('Content-type: application/vnd.ms-word');
                header("Content-Disposition: attachment; filename=$tituloRpt.doc");
                header("Pragma: no-cache");
                header("Expires: 0");
                header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                print "<head>$this->gMETA</head>" . $this->gDATAHTML;
            }
                break;
        }
        exit;
    }

    private function exportarExcel($datosRpt)
    {
        header("Content-Type: application/force-download");
        header('Content-type: application/vnd.ms-excel'); //application/vnd.ms-excel
        setlocale(LC_CTYPE, "es_ES");
        $tituloRpt = str_replace(" ", "_", $datosRpt[0]->gTitle);
        header("Content-Disposition: attachment; filename=" . strtoupper($tituloRpt) . ".xls");
        header("Pragma: no-cache");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        $rows = "";
        $rows .= "<table style='font-size:9pt; position:relative; border-left: 1px solid; border-right: 1px solid; border-top: 1px solid; border-bottom: 1px solid; width:100%;'>";
        $rows .= "<tr><td colspan=\"6\" style='text-align:center;'><h1>" . strtoupper(
            $datosRpt[0]->gTitle . " " . $datosRpt[0]->generalData->titulo
        ) . "</h1></td></tr>";
        $rows
            .= "<tr>
                        <td bgcolor=\"#D6D6D6\" style='font-size: 9pt; font-weight:bold; border-top: 1px solid; border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid; text-align:center;'> PARTIDA </td>
                        <td bgcolor=\"#D6D6D6\" width='15%' style='font-size: 9pt; font-weight:bold; border-top: 1px solid; border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid; text-align:center;'> SALDO INICIO </td>
                        <td bgcolor=\"#D6D6D6\" width='15%' style='font-size: 9pt; font-weight:bold; border-top: 1px solid; border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid; text-align:center;'> SALDO PERIODO </td>
                        <td bgcolor=\"#D6D6D6\" width='15%' style='font-size: 9pt; font-weight:bold; border-top: 1px solid; border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid; text-align:center;'> SALDO ACUMULADO </td>
                        <td bgcolor=\"#D6D6D6\" width='15%' style='font-size: 9pt; font-weight:bold; border-top: 1px solid; border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid; text-align:center;'> SALDO DIFERENCIA </td>
                        <td bgcolor=\"#D6D6D6\" width='15%' style='font-size: 9pt; font-weight:bold; border-top: 1px solid; border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid; text-align:center;'> SALDO EJERCICIO ANTERIOR </td>
                    </tr>";
        foreach ($datosRpt[0]->bodyData as $rowData) {
            $rows .= "<tr>";
            $rows
                .=
                "<td style='text-align:left; border-left: 1px solid; border-right: 1px solid; border-top: 1px solid; border-bottom: 1px solid;'>"
                    . $rowData->descripcionpartida . "</td>";
            $rows
                .=
                "<td style='text-align:right; border-left: 1px solid; border-right: 1px solid; border-top: 1px solid; border-bottom: 1px solid;'>"
                    . $rowData->sinicial . "</td>";
            $rows
                .=
                "<td style='text-align:right; border-left: 1px solid; border-right: 1px solid; border-top: 1px solid; border-bottom: 1px solid;'>"
                    . $rowData->speriodo . "</td>";
            $rows
                .=
                "<td style='text-align:right; border-left: 1px solid; border-right: 1px solid; border-top: 1px solid; border-bottom: 1px solid;'>"
                    . $rowData->sacumulado . "</td>";
            $rows
                .=
                "<td style='text-align:right;border-left: 1px solid; border-right: 1px solid; border-top: 1px solid; border-bottom: 1px solid;'>"
                    . $rowData->sdiferencia . "</td>";
            $rows
                .=
                "<td style='text-align:right; border-left: 1px solid; border-right: 1px solid; border-top: 1px solid; border-bottom: 1px solid;'>"
                    . $rowData->sejercicioanterior . "</td>";
            $rows .= "</tr>";
        }
        $rows .= "</table>";
        print $rows;
    }

    public function HtmlWritenPagingRows(
        $argReport, $argArrayBodyData, $argArrayColumns, $argFieldName, $argInitialEntry = true
    ) {
        $ROWSTOPAINT = $argReport->NumberRowsPaperFormat();
        $PAINTEDROWS = 0;
        $TRBODYTABLE = "";
        $COUNT = count($argArrayBodyData);
        $REMAINING = $COUNT;
        $FLAGDECREMNT = false;
        $ENDREPORTPAGE = false;
        $FORMATPESOCOLUMNS = array();
        $HEADTABLE = $argReport->GetHeadTable($PAINTEDROWS, $argArrayBodyData, $this->PAGE_COUNT, $argArrayColumns);
        if (count($argArrayColumns) > 0) {
            $argReport->ResetValuesColumns($argArrayColumns);
        }
        foreach ($argArrayBodyData as $i => $data) {
            if ($PAINTEDROWS < $ROWSTOPAINT) {
                if ($argReport instanceof IEStrategyAdicionalPages) {
                    $this->gDatoCuerpoWithoutPaging[] = $data;
                }
                if ($data->$argFieldName == $argReport->textPageBreak || $i == ($COUNT - 1)) {
                    $ENDREPORTPAGE = true;
                    $TRLASTPAGE = $this->GetRowValues(
                        $argReport, $data, $argFieldName, $PAINTEDROWS, $ROWSTOPAINT, $FORMATPESOCOLUMNS,
                        $argArrayBodyData, $i, $REMAINING, $FLAGDECREMNT, $argArrayColumns
                    );
                    $TRWHITE = $this->PaintBlankRows(
                        $PAINTEDROWS, $ROWSTOPAINT, $argReport->GetBlankRows($argArrayColumns)
                    );
                    $TRBODYTABLE .= ($data->$argFieldName == $argReport->textPageBreak) ? $TRWHITE . $TRLASTPAGE
                        : $TRLASTPAGE . $TRWHITE;
                    $this->AddHtml($argReport->GetHtmlValues($argArrayBodyData, $HEADTABLE, $TRBODYTABLE));
                    if ($argInitialEntry) {
                        $argReport->gPaintColumns = array();
                    }
                    if ($argReport instanceof IEStrategyAdicionalPages) {
                        $this->HtmlWritenAdicionalPage($argReport, $this->gDatoCuerpoWithoutPaging, $data);
                    }
                } else {
                    $TRBODYTABLE .= $this->GetRowValues(
                        $argReport, $data, $argFieldName, $PAINTEDROWS, $ROWSTOPAINT, $FORMATPESOCOLUMNS,
                        $argArrayBodyData, $i, $REMAINING, $FLAGDECREMNT, $argArrayColumns,
                        $this->IsRowSummarizingSaldo($argReport, $data->$argFieldName), false
                    );
                }
            } elseif (!$ENDREPORTPAGE) {
                $this->AddHtml($argReport->GetHtmlValues($argArrayBodyData, $HEADTABLE, $TRBODYTABLE));
                BREAK;
            } else {
                BREAK;
            }
        }
        if ($REMAINING > 0 || (!$argInitialEntry && count($argReport->bodyDataCopy) > 0)) {
            $this->NewPage($argReport->REPORT_PAPERSIZE);
            if ($REMAINING > 0) {
                $argArrayBodyData = $this->UpdateArrayBodyData(
                    ($FLAGDECREMNT) ? ($i - 1) : $i, $argArrayBodyData, $COUNT
                );
                $this->HtmlWritenPagingRows(
                    $argReport, $argArrayBodyData, $argArrayColumns, $argFieldName, $argInitialEntry
                );
            } else {
                $this->HtmlWritenPagingRowsAndColumns(
                    $argReport, $argReport->bodyDataCopy, $argReport->generalData->columnas, $argFieldName
                );
            }
        } elseif ($argInitialEntry) {
            return $this->gDATAHTML .= $argReport->HTML_PAGES;
        }
    }

    public function HtmlWritenPagingRowsAndColumns($argReport, $argArrayBodyData, $arrayColumnsAdd, $argFieldName)
    {
        $pagingColumns = $argReport->NumberColumnsPaperFormat();
        $argReport->bodyDataCopy = array();
        $this->gDatoCuerpoWithoutPaging = array();
        return $this->HtmlWritenPagingRows(
            $argReport, $argArrayBodyData, $this->GetPaggingColumns($argReport, $arrayColumnsAdd, $pagingColumns),
            $argFieldName, false
        );
    }

    public function HtmlWritenAdicionalPage($argReport, $argArrayBodyData, $argData)
    {
        $arrayFootData = ($argReport instanceof IEStrategyColumns) ? $argReport->GetNewObjectWithAdditionalData(
            $argArrayBodyData
        ) : $argReport->GetNewObjectWithAdditionalData($argData);
        if (count($arrayFootData) > 0) {
            $this->NewPage($argReport->REPORT_PAPERSIZE);
            $newObjReport = $argReport->InstanceFactoryCreate($arrayFootData);
            if ($argReport instanceof IEStrategyColumns) {
                $this->HtmlWritenPagingRowsAndColumns(
                    $newObjReport, $arrayFootData, $newObjReport->gPaintColumns, $newObjReport->fieldName
                );
            } else {
                $this->HtmlWritenPagingRows($newObjReport, $arrayFootData, array(), $newObjReport->fieldName, false);
            }
        }
    }

    public function GetRowValues(
        $argReport, $argData, $argFieldName, & $PAINTEDROWS, & $ROWSTOPAINT, & $FORMATPESOCOLUMNS, $argArrayBodyData,
        $i, & $REMAINING, & $FLAGDECREMNT, $argArrayColumns, $keepCero = true, $ENDPAGE = true
    ) {
        $TEXTLENGTH = $argReport->LengthStringPaperFormat($argField);
        $TEXT = (strlen($argField) > 0) ? $argData->$argField : $argData->$argFieldName;

        if (strcmp($this->gTextTruncated, $TEXT) !== 0) {
            $this->gArrayTextTruncated = ($TEXTLENGTH > 0 && strlen($TEXT) > 0 && !$argReport->IsSubTotalRow($TEXT)
                && $TEXT != $argReport->textPageBreak) ? $this->myTruncate($TEXT, $TEXTLENGTH) : array($TEXT);
            $this->gTextTruncated = $TEXT;
            $this->gCountArrayTextTruncated = count($this->gArrayTextTruncated);
        }
        if ($i == 0 && $argReport instanceof IEStrategySetSummary) {
            $CURRENTPAGE = $this->PAGE_COUNT;
            $PREVIOUSPAGE = $CURRENTPAGE - 1;
            $TR = $this->GetSumaAcumuladaFolio(
                $argReport, "<b>VIENEN DEL FOLIO No.$PREVIOUSPAGE</b>", $FORMATPESOCOLUMNS, $PREVIOUSPAGE
            );
            if (strlen($TR) > 0) {
                $PAINTEDROWS++;
            }
        }
        $TOTAL_ROWS = $PAINTEDROWS + $this->gCountArrayTextTruncated;
        $ADICIONAL_ROWS = ($argReport instanceof IEStrategySetSummary) ? 2 : 0;
        $LEFTONE_ADICIONAL_ROWS = ($ADICIONAL_ROWS > 0) ? 1 : 0;
        if ($TOTAL_ROWS < $ROWSTOPAINT - $ADICIONAL_ROWS || $TOTAL_ROWS <= $ROWSTOPAINT && $ENDPAGE
            || (($TOTAL_ROWS <= $ROWSTOPAINT - $LEFTONE_ADICIONAL_ROWS && $TOTAL_ROWS >= $ROWSTOPAINT - $ADICIONAL_ROWS)
                && ((!$argReport->IsSubTotalRow($argArrayBodyData[$i]->$argFieldName)
                    && !$argReport->IsSubTotalRow($argArrayBodyData[$i + 1]->$argFieldName))
                    || ($argReport->IsSubTotalRow($argArrayBodyData[$i]->$argFieldName)
                        && ($argArrayBodyData[$i + 1]->$argFieldName == $argReport->textPageBreak
                            || !$argReport->IsSubTotalRow($argArrayBodyData[$i + 1]->$argFieldName)))))
        ) {
            $this->RowValues(
                $argReport, $TR, $argData, $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $PAINTEDROWS
            );
            $REMAINING--;
        } else {
            $FLAGDECREMNT = true;
        }
        if ((($FLAGDECREMNT && $TOTAL_ROWS >= $ROWSTOPAINT - $ADICIONAL_ROWS)
            || (!$FLAGDECREMNT && $TOTAL_ROWS == $ROWSTOPAINT - $LEFTONE_ADICIONAL_ROWS))
            && !$ENDPAGE
            && ($argReport instanceof IEStrategySetSummary || $argReport instanceof IEStrategySummary)
        ) {
            $CURRENTPAGE = $this->PAGE_COUNT;
            $PREVIOUSPAGE = $CURRENTPAGE - 1;
            $NEXTPAGE = $CURRENTPAGE + 1;
            $TRSALDOFOLIO = $this->SetSumaAcumuladaFolio(
                $argReport, "<b>PASAN AL FOLIO No.$NEXTPAGE</b>",
                (count($argReport->arrayColumnsSaldoFolio) > 0) ? $argReport->arrayColumnsSaldoFolio
                    : $argArrayBodyData, $argFieldName, ($FLAGDECREMNT) ? $i - 1 : $i, $FORMATPESOCOLUMNS, $CURRENTPAGE,
                $PREVIOUSPAGE
            );
            if (strlen($TRSALDOFOLIO) > 0) {
                $TR .= $TRSALDOFOLIO;
                $PAINTEDROWS++;
            }
            $TR .= $this->PaintBlankRows($PAINTEDROWS, $ROWSTOPAINT, $argReport->GetBlankRows($argArrayColumns));
        }
        return $TR;
    }

    public function myTruncate($cadena, $long_min, & $arrayCadena = array())
    {
        $cadena = rtrim(trim($cadena));
        if (strlen($cadena) <= $long_min) {
            $subCadena = $cadena;
        } else {
            $subCadena = substr($cadena, 0, $long_min);
            $posFinCadena = strrpos($subCadena, " ");
            if ($posFinCadena != false) {
                $subCadena = substr($cadena, 0, $posFinCadena);
            }
        }
        $arrayCadena[] = $subCadena;
        $cadenaResto = substr($cadena, strlen($subCadena), strlen($cadena));
        if (strlen($cadenaResto) > 0) {
            $this->myTruncate($cadenaResto, $long_min, $arrayCadena);
        }
        return $arrayCadena;
    }

    public function GetSumaAcumuladaFolio($argReport, $TEXTSALDOFOLIO, & $FORMATPESOCOLUMNS, $PREVIOUSPAGE)
    {
        $TEXTALTERNATIVO = "<b>DEL FOLIO No. $PREVIOUSPAGE</b>";
        if (isset($argReport->arraySumaAcumulada[$PREVIOUSPAGE])) {
            if (count($argReport->arraySumaAcumulada[$PREVIOUSPAGE]) > 0) {
                return $argReport->GetSumaAcumuladaFolio(
                    $TEXTALTERNATIVO, $TEXTSALDOFOLIO, $FORMATPESOCOLUMNS, $PREVIOUSPAGE
                );
            }
        }
        return "";
    }

    public function SetSumaAcumuladaFolio(
        $argReport, $TEXTSALDOFOLIO, $argArrayBodyData, $argFieldName, $i, & $FORMATPESOCOLUMNS, $CURRENTPAGE,
        $PREVIOUSPAGE
    ) {
        $TEXTALTERNATIVO = "<b>AL FOLIO No." . ($CURRENTPAGE + 1) . "</b>";
        return $argReport->SetSumaAcumuladaFolio(
            $TEXTALTERNATIVO, $TEXTSALDOFOLIO, $argArrayBodyData, $argFieldName, $i, $PREVIOUSPAGE, $CURRENTPAGE,
            $FORMATPESOCOLUMNS
        );
    }

    public function RowValues(
        $argReport, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, & $PAINTEDROWS
    ) {
        foreach ($this->gArrayTextTruncated as $j => $TR_TEXT) {
            if ($argReport instanceof IEStrategyColumnsGrow) {
                $this->rowValuesColumns(
                    $argReport, $argReport->gClassification, $j, $TR_TEXT, $TR, $argData, $FORMATPESOCOLUMNS, $keepCero,
                    $argArrayColumns, $ENDPAGE
                );
            } else {
                $argReport->RowValues(
                    $j, $TR_TEXT, $TR, $argData, $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE
                );
            }

            $PAINTEDROWS++;
        }
    }

    public function rowValuesColumns(
        $argReport, $fieldValueContainColumns, $j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero,
        $argArrayColumns, $ENDPAGE
    ) {
        $ARRAYTDCOLUMNS = array();
        $COLUMNASFORUPDATE = array();
        $sumaParcialFila = 0;
        foreach ($argArrayColumns as $columns) {
            $ARRAYTDCOLUMNS[]
                = "<td style='border-top:1px solid !important; text-align:right; vertical-align:middle;'>&nbsp;</td>";
        }
        if ($ENDPAGE) {
            $argReport->gHtmlRowTotal = $ARRAYTDCOLUMNS;
        }
        $countColumnsDato = count($argData->$fieldValueContainColumns);
        if ($countColumnsDato > 0) {
            foreach ($argData->$fieldValueContainColumns as $COLUMN) {
                $index = $argReport->GetIndexKey($argArrayColumns, $COLUMN[0]);
                if ($index >= 0) {
                    $sumaParcialFila += $COLUMN[1];
                    $ARRAYTDCOLUMNS[$index] = str_replace(
                        "&nbsp;",
                        $argReport->ColumnsFormat($FORMATPESOCOLUMNS, $COLUMN[0], $COLUMN[1], $keepCero, $keepCero),
                        $ARRAYTDCOLUMNS[$index]
                    );
                    $argReport->arrayColumnsSaldoFolio[$index] = (isset($argReport->arrayColumnsSaldoFolio[$index])) ?
                        $argReport->arrayColumnsSaldoFolio[$index] + $COLUMN[1] : $COLUMN[1];
                } else {
                    $COLUMNASFORUPDATE [] = $COLUMN;
                }
            }
        }
        $argReport->arrayColumnsSaldoFolio[-1] += $sumaParcialFila;
        if (count($COLUMNASFORUPDATE) <= $countColumnsDato) {
            if (count($COLUMNASFORUPDATE) > 0) {
                $argData->$fieldValueContainColumns = $COLUMNASFORUPDATE;
                $argReport->bodyDataCopy[] = $argData;
                if (count($COLUMNASFORUPDATE) == $countColumnsDato) {
                    return '';
                }
            }
        }
        $TR .= $argReport->RowValueColumn($argData, $sumaParcialFila, $FORMATPESOCOLUMNS, $keepCero) . str_replace(
            'border-top:1px solid !important;', '', implode('', $ARRAYTDCOLUMNS)
        ) . "</tr>";
        if ($ENDPAGE) {
            foreach ($argReport->arrayColumnsSaldoFolio as $k => & $importe) {
                $CURRENTPAGE = $this->PAGE_COUNT;
                $PREVIOUSPAGE = $CURRENTPAGE - 1;
                if (isset($argReport->arraySumaAcumulada[$PREVIOUSPAGE])) {
                    if (count($argReport->arraySumaAcumulada[$PREVIOUSPAGE]) > 0) {
                        $importe += $argReport->arraySumaAcumulada[$PREVIOUSPAGE][$k];
                    }
                }
                $argReport->gHtmlRowTotal[$k] = str_replace(
                    "&nbsp;", $argReport->ColumnsFormat($FORMATPESOCOLUMNS, $k, $importe, true),
                    $argReport->gHtmlRowTotal[$k]
                );
            }
            $argReport->RowValues(
                $j, $TR_TEXT, $TR, $argData, $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE
            );
        }
    }

    function PaintBlankRows(& $PAINTEDROWS, $ROWSTOPAINT, $tr_ROW)
    {
        $ROWS = '';
        if ($PAINTEDROWS < $ROWSTOPAINT) {
            $PAINTROWS = $ROWSTOPAINT - $PAINTEDROWS;
            $PAINTEDROWS += $PAINTROWS;
            WHILE ($PAINTROWS > 0) {
                $ROWS .= $tr_ROW;
                $PAINTROWS--;
            }
        }
        return $ROWS;
    }

    public function IsRowSummarizingSaldo($argReport, $agText)
    {
        if ((strpos($agText, "SUBTOTAL") !== false && strpos($agText, "SUBTOTAL") >= 0)
            || (strpos($agText, "SALDO ACUMULADO") !== false && strpos($agText, "SALDO ACUMULADO") >= 0)
            || (strpos($agText, $argReport->textPageBreak) !== false && strpos($agText, $argReport->textPageBreak) >= 0)
        ) {
            return true;
        }
        return false;
    }

    public function AddHtml($HTMLINBODYOF)
    {
        if ($this->objReport->REPORT_TYPE == "HTML") {
            list($this->gWidth, $this->gHeight) = $this->objReport->GetPaperSizeFormat(
                $this->FORMAT_PAPERSIZE, $this->REPORT_ORIENTATION
            );
            $this->objReport->HTML_PAGES .= $this->objReport->HTMLStyleSheetPaint(
                $this->gWidth, $this->gHeight, $HTMLINBODYOF
            );
        } else {
            $this->objReport->HTML_PAGES .= $HTMLINBODYOF;
        }
    }

    public function NewPage($PAGEFORMAT)
    {
        switch ($this->objReport->REPORT_TYPE) {
            case "PDF":
            {
                $PAGEBREAK = "<pagebreak sheet-size = \"{$PAGEFORMAT}\" />";
            }
                break;
            case "HTML":
            {
                $PAGEBREAK
                    = "<br clear= 'all'/><div style = 'page-break-after:always; height: 0.5mm !important;'></div>";
            }
                break;
            case "EXCEL":
            {
                $PAGEBREAK = "";
            }
                break;
        }
        $this->objReport->HTML_PAGES .= $PAGEBREAK;
        $this->PAGE_COUNT++;
    }

    public function UpdateArrayBodyData($i, $argArrayBodyData, $COUNT)
    {
        $arrayResult = array();
        for ($j = 0; $j < $COUNT; $j++) {
            if ($j >= $i) {
                $arrayResult[] = $argArrayBodyData[$j];
            }
        }
        return $arrayResult;
    }

    public function GetSTYLECSSHTML()
    {
        return "<style type='text/css'> 
                 @media all {body{display: block; background: none no-repeat scroll 100% 100% #333333;}}
                 @media print {*{visibility: visible; margin: 0 !important; padding: 0 !important; float:none !important;} div{visibility: hidden; top:0; right:0; bottom:0; left:0; height: auto !important; width: auto !important; margin : 0px auto;}}
                 @page {size : A4}                 
                </style>";
    }

    public function GetPaggingColumns($argReport, $columns, $pagingColumns)
    {
        $columnsAdd = array();
        $columnsForUp = array();
        foreach ($columns as $i => $column) {
            if ($i < $pagingColumns) {
                $columnsAdd[] = $column;
            } else {
                $columnsForUp[] = $column;
            }
        }
        $argReport->generalData->columnas = $columnsForUp;
        return $columnsAdd;
    }

}

?>