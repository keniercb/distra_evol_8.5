<?php

abstract class ElementsReport
{

    public $gTitle;
    public $gClassification;
    public $gReportIdentifier;
    public $generalData;
    public $bodyData;
    public $footData;
    public $fieldName;
    public $arrFieldName = array();
    public $textPageBreak = "";
    public $textSummaryPage = "<b>SUMA ACUMULADA FOLIO</b>";
    public $haveAddTableFoot;
    public $HTML_PAGES;
    public $REPORT_TYPE;
    public $REPORT_ORIENTATION;
    public $REPORT_PAPERSIZE;
    public $FORMAT_PAPERSIZE;
    public $codeSeparator;
    public $arrayColumnsSaldoFolio = array();
    public $arraySumaAcumulada = array();
    public $bodyDataCopy = array();
    public $gPaintColumns = array();
    public $gHtmlRowTotal = array();

    final function GetPaperSizeFormat()
    {
        //cm
        switch ($this->FORMAT_PAPERSIZE) {
            case 'LETTER':
            {
                $sizes = array(21.6, 27.9);
            }
                BREAK;
            case 'FOLIO':
            {
                $sizes = array(21.6, 33.0);
            }
                BREAK;
            case 'LEGAL':
            {
                $sizes = array(21.6, 35.6);
            }
                BREAK;
            default:
                {
                $sizes = array(21.0, 29.7);
                }
        }
        return ($this->REPORT_ORIENTATION == "L") ? array_reverse($sizes) : $sizes;
    }

    final function HTMLStyleSheetPaint($width, $height, $HTMLINOF)
    {
        return
            "<div class = 'div1' style='margin: auto !important; position:static; border: 0.5mm solid; background: none repeat scroll 0% 0% rgb(255, 255, 255); width:"
                . $width . "cm; height:" . $height
                . "cm;'><div style='margin: 5mm 5mm 5mm 15mm;'>$HTMLINOF</div></div>";
    }

    final protected function GetSubEspecialidad(& $PAINTEDROWS, $argArrayBodyData)
    {
        $SUBESPECIALIDAD = (strlen($argArrayBodyData[0]->subespecialidad) > 0) ? $this->ExcludeLevels(
            $argArrayBodyData[0]->subespecialidad
        ) : $argArrayBodyData[0]->subespecialidad;
        if (strlen($SUBESPECIALIDAD) > 0) {
            $PAINTEDROWS++;
        }
        return $SUBESPECIALIDAD;
    }

    final public function ResetValuesColumns(& $argArrayColumns)
    {
        $this->arrayColumnsSaldoFolio = array();
        foreach ($argArrayColumns as $i => $column) {
            $this->arrayColumnsSaldoFolio[] = 0;
        }
    }

    final private function FindIndexKey($argList, $argValue)
    {
        for ($i = 0; $i < count($argList); $i++) {
            if ($argList[$i] - 1 == $argValue) {
                return $i;
            }
        }
        return -1;
    }

    final public function GetIndexKey($argList, $argValue)
    {
        for ($i = 0; $i < count($argList); $i++) {
            if ($argList[$i] == $argValue) {
                return $i;
            }
        }
        return -1;
    }

    final private function ExcludeLevels($string, $excludeLevels = array(1))
    {
        $arrayString = explode($this->codeSeparator, $string);
        $arrayStringCopy = array();
        foreach ($arrayString as $j => $string) {
            if ($this->FindIndexKey($excludeLevels, $j) < 0) {
                $arrayStringCopy[] = $string;
            }
        }
        return implode($this->codeSeparator, $arrayStringCopy);
    }

    final private function GetReportColumns($argDataColumns)
    {
        for ($m = 0; $m < count($argDataColumns); $m++) {
            if ($this->GetIndexKey($this->gPaintColumns, $argDataColumns[$m][0]) < 0) {
                $this->gPaintColumns[] = $argDataColumns[$m][0];
            }
        }
    }

    protected function Format($num, $keepCero = false)
    {
        if ($num == 0) {
            if (!$keepCero) {
                return '';
            } else {
                if ($keepCero) {
                    return number_format($num, '2', '.', ',');
                }
            }
        } elseif ($num < 0) {
            return '(' . number_format($num * -1, '2', '.', ',') . ')';
        } else {
            return number_format($num, '2', '.', ',');
        }
    }

    protected function FormatThousands($num)
    {
        if ($num == 0) {
            return '';
        } elseif ($num < 0) {
            return '(' . number_format($num * -1) . ')';
        } else {
            return number_format($num);
        }
    }

    protected function GetHTMLBodyFormat($agHeader, $agBody, $agFooter = "")
    {
        return "<div>$agHeader" . "$agBody" . "$agFooter</div>";
    }

    protected function GetBodyTable($TRBODYTABLE)
    {
        return "$TRBODYTABLE</table>";
    }

    protected function GetLetFootData($argData, $fieldName, $fieldName1, $fieldName2, $fieldName3, $fieldName4)
    {
        $result = array();
        $resultCopy = array();
        foreach ($this->footData as $data) {
            if ($argData->$fieldName == $data->$fieldName && $argData->$fieldName4 == $data->$fieldName4
                && $argData->$fieldName1 == $data->$fieldName1
                && $argData->$fieldName2 == $data->$fieldName2
                && (strcmp($argData->$fieldName3, $data->$fieldName3) === 0)
            ) {
                $result[] = $data;
            } else {
                $resultCopy[] = $data;
            }
        }
        $this->footData = $resultCopy;
        return $result;
    }

    protected function GetFootDataColumns($argArrayBodyData, $argFieldValueColumns, $argFieldValue)
    {
        $arrayFootData = array();
        for ($j = 0; $j <= count($argArrayBodyData); $j++) {
            if (isset($argArrayBodyData[$j]->$argFieldValue)) {
                $this->GetReportColumns($argArrayBodyData[$j]->$argFieldValueColumns);
                $arrayFootData[] = $argArrayBodyData[$j];
            }
        }
        return $arrayFootData;
    }

    protected function CasePaperFormat($argSizesA4, $argSizesLetter, $argSizesFolio, $argSizesLegal)
    {
        switch ($this->REPORT_PAPERSIZE) {
            CASE 'LETTER-L':
                RETURN $argSizesLetter[0];
            CASE 'LETTER':
                RETURN $argSizesLetter[1];
            CASE 'FOLIO-L':
                RETURN $argSizesFolio[0];
            CASE 'FOLIO':
                RETURN $argSizesFolio[1];
            CASE 'LEGAL-L':
                RETURN $argSizesLegal[0];
            CASE 'LEGAL':
                RETURN $argSizesLegal[1];
            CASE 'A4-L':
                RETURN $argSizesA4[0];
            DEFAULT:
                RETURN $argSizesA4[1];
        }
    }

    protected function getFootTable($DIA, $MES, $YEAR, $USUARIO)
    {
        return "<table style='font-size:9pt; position:relative; border-collapse:collapse; border-spacing:0px; width:100%'>
                  <tr style='font-size: 10pt;'>            
                    <td height='46' colspan= \"2\" align='left' valign='middle' style='border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;'><strong>CERTIFICAMOS QUE LOS DATOS CONTENIDOS EN ESTE ESTADO<br>
                      SE CORRESPONDEN CON LAS ANOTACIONES CONTABLES
                    </strong></td>
                    <td width='17%' rowspan='3' align='center' valign='top' style='border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;'><strong>APROBADO <br>
                    JEFE DE UNIDAD MILITAR</strong> </td>
                    <td colspan= \"3\" align='center' valign='middle' style='border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;'><strong>FECHA</strong></td>
                  </tr>
                  <tr style='font-size: 10pt;'>
                    <td width='23%' rowspan='2' align='left' valign='top' style='border:1px solid;'><strong>CONFECCIONADO POR:</strong><br>
                    $USUARIO</td>
                    <td width='45%' rowspan='2' align='center' valign='top' style='border:1px solid;'><strong>JEFE &Oacute;RGANO <br> ECONOM&Iacute;A/FINANZAS
                    </strong></td>
                    <td width='5%' style=' border:1px solid;font-weight:bold;text-align:center;'>D</td>
                    <td width='5%' style='border:1px solid;font-weight:bold;text-align:center;'>M</td>
                    <td width='5%' style='border:1px solid;font-weight:bold;text-align:center;'>A</td>
                  </tr>
                  <tr>
                    <td height='47' style='border:1px solid;text-align:center;'>$DIA</td>
                    <td style='border:1px solid;text-align:center;'>$MES</td>
                    <td style='border:1px solid;text-align:center;'>$YEAR</td>
                  </tr>
                </table>";
    }

    protected function getFootTable_Empresarial($DIA, $MES, $YEAR, $USUARIO)
    {
        return "<table style='font-size:9pt; border-top: 1px solid; position:relative; border-collapse:collapse; border-spacing:0px; width:100%'>
              <tr>
                <td colspan=\"2\" rowspan=\"2\" style='font-size:9pt; text-align:left;'><b>CERTIFICAMOS QUE LOS DATOS CONTENIDOS EN ESTE ESTADO
                SE CORRESPONDEN CON LAS ANOTACIONES CONTABLES </b></td>
                <td colspan=\"3\" style='font-size:9pt; text-align:center;'>&nbsp;</td>
              </tr>
              <tr>
                <td colspan=\"3\" style='font-size:9pt; text-align:center;'>&nbsp;</td>
              </tr>
              <tr>
                <td colspan=\"2\" ></td>
                <td colspan=\"3\" style='font-size:9pt; text-align:center;'><b>FECHA</b></td>
              </tr>
              <tr>
                <td style='font-size:9pt; text-align:left; vertical-align:top;'><b>CONFECCIONADO POR:</b></td>
                <td style='font-size:9pt; text-align:left; vertical-align:top;'><b>APROBADO POR:</b></td>
                <td style='font-size:9pt; text-align:center;'><b>D</b></td>
                <td style='font-size:9pt; text-align:center;'><b>M</b></td>
                <td style='font-size:9pt; text-align:center;'><b>A</b></td>
              </tr>
              <tr>
                <td width=\"25%\">
            $USUARIO</td>
                <td></td>
                <td width=\"3%\" style='text-align:center;'>$DIA</td>
                <td width=\"3%\" style='text-align:center;'>$MES</td>
                <td width=\"5%\" style='text-align:center;'>$YEAR</td>
              </tr>
            </table>";
    }

    protected function getFootTable_SCF04($argDatosGrals)
    {
        return "<table style='font-size:9pt; position:relative; border-collapse:collapse; border-spacing:0px; border-top: 1px solid; width:100%'>
                            <tr>
                                <td width=\"50%\" colspan=\"6\" style='text-align:center; border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;'>EXTRA&Iacute;DO</td>
				<td width=\"50%\" colspan=\"6\" style='text-align:center; border-bottom: 1px solid; border-right: 1px solid;'>DEPOSITADO</td>
                            </tr>
			    <tr>
                                <td width=\"25%\" style='vertical-align:top; text-align:center; border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;' colspan=\"3\" rowspan=\"2\">CHEQUE No. <br> </td>
				<td width=\"25%\" style='vertical-align:top; text-align:center; border-bottom: 1px solid; border-right: 1px solid;' colspan=\"3\" rowspan=\"2\">IMPORTE <br>
				 </td>
				<td width=\"7%\" style='text-align:center; text-align:center; border-bottom: 1px solid; border-right: 1px solid;'>D&Iacute;A</td>
				<td width=\"7%\" style='text-align:center; text-align:center; border-bottom: 1px solid; 1px solid; border-right: 1px solid;'>MES</td>
				<td width=\"22%\" style='vertical-align:top; text-align:center; border-bottom: 1px solid; border-right: 1px solid;' colspan=\"4\" rowspan=\"2\">IMPORTE <br> </td>
			    </tr>
                            <tr>
                                <td style='border-bottom: 1px solid; 1px solid; border-right: 1px solid;'><br> </td>
				<td style='border-bottom: 1px solid; 1px solid; border-right: 1px solid;'><br> </td>
                            </tr>
                        </table>
                        <table border=\"1\" style=\"font-size:9pt; position:relative; border-collapse:collapse; border-spacing:0px;border-top:hidden; width:100%;\">
                            <tr>
                                <td width=\"20%\" colspan=\"2\" rowspan=\"2\" style=\"text-align:center; vertical-align:top; border-bottom: 1px solid; border-left: 1px solid; border-right: 1px solid;\"><p>CUSTODIO: <br><br>$argDatosGrals->custodio</td>
				<td width=\"20%\" colspan=\"2\" rowspan=\"2\" style=\"text-align:center; vertical-align:top; border-bottom: 1px solid; border-right: 1px solid;\">REVISADO POR: <br><br></td>
				<td width=\"20%\" colspan=\"3\" rowspan=\"2\" style=\"text-align:center; vertical-align:top; border-bottom: 1px solid; border-right: 1px solid;\">APROBADO POR: <br><br></td>
				<td width=\"20%\" colspan=\"2\" rowspan=\"2\" style=\"text-align:center; vertical-align:top border-bottom: 1px solid; border-right: 1px solid;\">CONTABILIZADO POR: <br><br>$argDatosGrals->contabilizadoPor</td>
				<td width=\"6%\" style=\"text-align:center\">D</td>
				<td width=\"6%\" style=\"text-align:center\">M</td>
				<td width=\"10%\" style=\"text-align:center\">A</td>
                            </tr>
                            <tr>
                                <td style=\"text-align:center\"><br> </td>
				<td style=\"text-align:center\"><br> </td>
				<td style=\"text-align:center\"><br> </td>
                            </tr>
                        </table>";
    }

    protected function getFootTable_RecCaja($argDatosGrals)
    {
        return "<table border='1' style='font-size:9pt; position:relative; border-collapse:collapse; border-spacing:0px; width:100%; border-top:hidden'>
            <tr>
				<td colspan='2' rowspan='2'>Pago Recibido En Cheques </td>
				<td width='33%'><div align='center'>Fecha</div></td>
			</tr>  
			<tr>
				<td><div align='center'>fecha</div></td>
			</tr>
			<tr>
				<td width='33%'><div align='center'>N&uacute;mero</div></td>
				<td width='33%'><div align='center'>Banco</div></td>
				<td width='33%'><div align='center'>Monto</div></td>
			</tr>
			<tr>
				<td width='33%'><div align='center'>numero</div></td>
				<td width='33%'><div align='center'>banco</div></td>
				<td width='33%'><div align='center'>monto</div></td>
			</tr>
			<tr>
				<td colspan='3'>&nbsp;</td>
			</tr>
			<tr>
				<td colspan='3' style='border-top:hidden;'><div align='center'>__________________________________________________________________</div></td>
			</tr>
			<tr style='border-top:hidden;'>
				<td colspan='3'><div align='center'>Cajero</div></td>
			</tr>
		</table>";
    }

    protected function getFootTable_EstadosFinancierosMFP($DIA, $MES, $YEAR, $USUARIO)
    {
        return "<table style='width:100%; font-size:9pt; border:1px solid; border-spacing:0px; position:relative;'>
                  <tr>
                    <td colspan='2' width='35%' valign='top' style='border-bottom:hidden; border-right:hidden'> &nbsp;HECHO POR: <br /><br />$USUARIO</td>
                    <td colspan='2' width='35%' valign='top' style='border-bottom:hidden; border-left:hidden; border-right:hidden'> &nbsp;APROBADO POR: <br /><br />__________________________________</td>
                    <td colspan='4' width='30%' nowrap='nowrap' style='border-left:hidden; border-bottom:hidden'><div align='justify'>CERTIFICAMOS QUE LOS DATOS CONTENIDOS EN <br />ESTE ESTADO FINANCIERO SE CORRESPONDEN <br />CON LAS ANOTACIONES CONTABLES DE<br />ACUERDO CON LAS REGULACIONES VIGENTES. </div></td>
                  </tr>
                  <tr>
                    <td colspan='2' rowspan='2' valign='top' style='border-top:hidden; border-bottom:hidden; border-right:hidden'>&nbsp;Nombre y Apellidos: <br />__________________________________<br /><p style='text-align:center'>Firma</p></td>
                    <td colspan='2' rowspan='2' style='border-top:hidden; border-bottom:hidden; border-left:hidden; border-right:hidden'>&nbsp;Nombre y Apellidos: <br />__________________________________<br /><p style='text-align:center'>Firma</p></td>
                    <td colspan='4' rowspan='2' style='border-left:hidden; border-top:hidden; border-bottom:hidden'>
                        <table width='200' border='1' align='center' style='border: 1px solid; border-collapse:collapse; border-spacing:1px;'>
                      <tr>
                        <td align='center'>D</td>
                        <td align='center' valign='middle'>M</td>
                        <td align='center' valign='middle'>A</td>
                      </tr>
                      <tr>
                        <td align='center' valign='middle'>$DIA</td>
                        <td align='center' valign='middle'>$MES</td>
                        <td align='center' valign='middle'>$YEAR</td>
                      </tr>
                    </table>
                </table>";
    }

    public function LengthStringPaperFormat(& $argField)
    {
        $argField = '';
        return 0;
    }

    public function IsSubTotalRow($argText)
    {
        if (strpos($argText, "SUBTOTAL") !== false) {
            return true;
        }
        return false;
    }

    public function IsTotalSummaryRow($argText)
    {
        if (strpos($argText, "TOTAL") !== false) {
            return true;
        }
        return false;
    }

    public function ColumnsFormat(& $FORMATPESOCOLUMNS, $i, $valueField, $keepCero = false, $keepSignoPeso = true)
    {
        $valueField = $this->Format($valueField, $keepCero);
        if (strlen($valueField) > 0 && !isset($FORMATPESOCOLUMNS[$i])) {
            $FORMATPESOCOLUMNS[$i] = '$';
            return '$' . $valueField;
        } elseif ($keepCero && $keepSignoPeso) {
            return '$' . $valueField;
        }
        return $valueField;
    }

    public function GetSumaAcumuladaFolio($TEXTALTERNATIVO, $TEXTSALDOFOLIO, & $FORMATPESOCOLUMNS, $PREVIOUSPAGE)
    {
        return "";
    }

    public function SetSumaAcumuladaFolio(
        $TEXTALTERNATIVO, $TEXTSALDOFOLIO, $argArrayBodyData, $argFieldName, $i, $PREVIOUSPAGE, $CURRENTPAGE,
        & $FORMATPESOCOLUMNS
    ) {
        return "";
    }

    abstract public function NumberRowsPaperFormat();

    abstract public function GetHeadTable(& $painteDrows, $argArrayBodyData, $argPageCount, & $argArrayColumns);

    abstract public function RowValues(
        $j, $trText, & $tr, $argData, & $formatPesoColumns, $keepCero, $argArrayColumns, $endPage
    );

    abstract public function GetBlankRows($argArrayColumns);

    abstract public function GetHtmlValues($argArrayBodyData, $agHeader, $trBodyTable);
}

?>