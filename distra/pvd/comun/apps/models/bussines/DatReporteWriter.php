<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DatReporteWriter
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 *
 */
class DatReporteWriter
{

    var $content = '';
    var $err = '';
    var $xs = 0;
    var $cls = array();
    var $col = 0;
    var $maxcol = 0;
    var $rows = 0;
    var $cols = array();

    function DatReporteWriter()
    {

    }

    function GetXLS($download = true, $tituloReporte)
    {

        header("Expires: Mon, 15 Dec 2003 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
        header("Cache-Control: no-cache, must-revalidate");
        header("Pragma: no-cache");
        if ($download) {
            header("Content-type: application/x-msexcel");
            header("Content-Disposition: attachment; filename=\"" . basename($tituloReporte . '.xls') . "\"");
            header("Content-Description: PHP/INTERBASE Generated Data");
        }
        echo $this->GetHeaderXLS();
        echo $this->content;
        echo $this->GetFooterXLS();


    }

    function GetPDF($download = true, $tituloReporte, $usuario, $fecha, $objLogo)
    {
        $dir_www = $_SERVER['DOCUMENT_ROOT'];
        $dir_rel_mt = '/'; //Direccion del Marco de trabajo relativa a la carpeta de publicacion.
        $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt); //Direccion absoluta del marco de trabajo
        include($dir_abs_mt . 'apps/pvd/comun/recursos/Mpdf/mpdf.php');
        $mpdf = new mPDF();
        header("Expires: Mon, 15 Dec 2003 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
        header("Cache-Control: no-cache, must-revalidate");
        header("Pragma: no-cache");
        if ($download) {
            header("Content-type: application/pdf");
            header("Content-Disposition: attachment; filename=\"" . basename($tituloReporte . '.pdf') . "\"");
            header("Content-Description: PHP/INTERBASE Generated Data");
        }
        $html = $this->GetHeaderPDF_DOC($tituloReporte, $objLogo, null);
        $html .= $this->content . '</table></body></html>';
        if (!empty($usuario) && !empty($fecha)) {
            $mpdf->setFooter('Generado por:' . $usuario . '|Fecha:' . $fecha . '|Página: {PAGENO}');
        } else if (!empty($usuario) && empty($fecha)) {
            $mpdf->setFooter('Generado por: ' . $usuario . '|Página: {PAGENO}');
        } else if (!empty($fecha) && empty($usuario)) {
            $mpdf->setFooter('Fecha: ' . $fecha . '|Página: {PAGENO}');
        } else {
            $mpdf->setFooter('Página: {PAGENO}');
        }
		$mpdf->setFooter('Firma:_____________ |Fecha:________________|Página: {PAGENO}');
		
        $mpdf->WriteHTML($html);
        $mpdf->Output($tituloReporte . '.pdf', 'D');


    }

    function GetDOC($download = true, $tituloReporte, $usuario, $fecha, $objLogo)
    {

        header("Expires: Mon, 15 Dec 2003 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
        header("Cache-Control: no-cache, must-revalidate");
        header("Pragma: no-cache");
        if ($download) {
            header("Content-type: application/vnd.ms-word");
            header("Content-Disposition: attachment; filename=\"" . basename($tituloReporte . '.doc') . "\"");
            header("Content-Description: PHP/INTERBASE Generated Data");
        }
        echo $this->GetHeaderPDF_DOC($tituloReporte, $objLogo, null);
        echo $this->content;
        echo $this->GetFooterPDF_DOC($usuario, $fecha);
    }

    function GetHTML($tituloReporte, $usuario, $fecha, $objLogo)
    {

        header("Expires: Mon, 15 Dec 2003 05:00:00 GMT");
        header("Last-Modified: " . gmdate("D,d M YH:i:s") . " GMT");
        header("Cache-Control: no-cache, must-revalidate");
        header("Pragma: no-cache");
        $src_html = explode('web', $objLogo['src']);
        $objLogo['src'] = $src_html[1];
        echo $this->GetHeaderPDF_DOC($tituloReporte, $objLogo, null);
        echo $this->content;
        echo $this->GetFooterPDF_DOC($usuario, $fecha);
    }


    function Close()
    {
        $this->$content = '';
        $this->$err = '';
        $this->$newRow = false;
        $this->$cls = '';
        $this->$col = 0;
        $this->$maxcol = 0;
        $this->$cols = array();
    }

    function GetHeaderXLS()
    {
        $header = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>
                <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
                xmlns:o="urn:schemas-microsoft-com:office:office"
                xmlns:x="urn:schemas-microsoft-com:office:excel"
                xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
                xmlns:html="http://www.w3.org/TR/REC-html40">
                <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
                    <Author>XETID</Author>
                    <LastAuthor>XETID</LastAuthor>
                    <Created>' . gmdate("D,d M YH:i:s") . '</Created>
                    <LastSaved>' . gmdate("D,d M YH:i:s") . '</LastSaved>
                    <Company>XETID</Company>
                    <Version>1.0</Version>
                </DocumentProperties>
                <OfficeDocumentSettings
                xmlns="urn:schemas-microsoft-com:office:office">
                <AllowPNG/>
                </OfficeDocumentSettings>
                <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
                    <WindowHeight>10740</WindowHeight>
                    <WindowWidth>17595</WindowWidth>
                    <WindowTopX>480</WindowTopX>
                    <WindowTopY>90</WindowTopY>
                    <ProtectStructure>False</ProtectStructure>
                    <ProtectWindows>False</ProtectWindows>
                </ExcelWorkbook>
                <Styles>
                <Style ss:ID="reporte">
                   <Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>
                   <Font ss:FontName="Arial" x:Family="Swiss" ss:Bold="1"/>
                </Style>
                <Style ss:ID="Default" ss:Name="Normal">
                <Alignment ss:Vertical="Bottom"/>
                <Borders/>
                <Font ss:FontName="Arial" x:Family="Swiss"/><Interior/><NumberFormat/><Protection/></Style>
                            ' . implode($this->cls) . '

            </Styles>
            <Worksheet ss:Name="Hoja1">
            <Table ss:ExpandedColumnCount="' . $this->maxcol . '" ss:ExpandedRowCount="' . $this->rows . '" x:FullColumns="1"
            x:FullRows="1" ss:DefaultColumnWidth="60">' . "\n";
        for ($i = 0; $i < $this->maxcol; $i++) {
            if (empty($this->cols[$i]))
                $header .= "<Column ss:Index='" . ($i + 1) . "'/>\n";
            else
                $header .= "<Column ss:Index='" . ($i + 1) . "' ss:Width='" . $this->cols[$i] . "' />\n";
        }
        return $header;
    }

    function GetHeaderPDF_DOC($tituloReporte, $objLogo, $formato)
    {

        $header = "<html>
					<head>
					<title>Datos del reporte</title>
					<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
					</head>
					<body>
					<table width='100%' border='0' style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:12pt;  margin:0px'>
                <tr>";
        if ($objLogo != null) {
            $header .= "
            <td width='50%' aling='left' style='font-size:14px;font-family:Arial, Helvetica, sans-serif'>
            <img src='" . $objLogo['src'] . "' height=" . $objLogo['height'] . " width=" . $objLogo['width'] . " style='cursor:pointer;border:1px solid 000' /></td>
            <td width='50%' align='left' style='font-size:14px;font-family:Arial, Helvetica, sans-serif'><h2><u><span style='text-transform:uppercase'><strong>{$tituloReporte}</strong></span></u></h2></td>
            <td width='50%' align='left' style='font-size:14px;font-family:Arial, Helvetica, sans-serif'><h2><u><span style='text-transform:uppercase'><strong>{$tituloReporte}</strong></span></u></h2></td>
          </tr>
        </table><p>&nbsp;</p><table table width='100%' border='0' style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:12pt;  margin:0px'>";
        } else {
            $header .= "<td width='100%' align='center' style='font-size:14px;font-family:Arial, Helvetica, sans-serif'><h2><u><span style='text-transform:uppercase'><strong>{$tituloReporte}</strong></span></u></h2></td>
          </tr>
        </table><p>&nbsp;</p><table table width='100%' border='0' style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:12pt;  margin:0px'>";
        };

        return $header;
    }

    function GetFooterPDF_DOC($usuario, $fecha)
    {
        $footer = "</table><p>&nbsp;</p>
            <table width='100%' border='0' style='font-size:12px; position:relative; border-collapse:collapse; border-spacing:0px;margin-top: 300px;'><tr>";
        if (!empty($usuario)) {
            $footer .= "<td width='50%' align='left' ><strong style='text-transform:uppercase'>Generado por:</strong><span>&nbsp;&nbsp;</samp><span style='font-family:Arial, Helvetica, sans-serif;font-size:12px'>{$usuario}</span> </td>";
        }

        if (!empty($fecha)) {
            $footer .= "<td width='50%' align='right' ><strong style='text-transform:uppercase'>Fecha:</strong><span>&nbsp;&nbsp;</samp><span style='font-family:Arial, Helvetica, sans-serif;font-size:12px'>{$fecha}</span> </td>";
        }
            $footer .= "<td width='50%' align='left' ><strong style='text-transform:uppercase'>Firma:</strong><span>&nbsp;&nbsp;</samp><span style='font-family:Arial, Helvetica, sans-serif;font-size:12px'>_____________</span> </td>";
        
        $footer .= " </tr></table></body></html>";
        return $footer;

    }

    function GetFooterXLS()
    {
        return '</Table>
                  <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
                   <PageSetup>
                    <Header x:Margin="0"/>
                    <Footer x:Margin="0"/>
                    <PageMargins x:Bottom="0.98" x:Left="0.79" x:Right="0.79" x:Top="0.98"/>
                   </PageSetup>
                   <Selected/>
                   <ProtectObjects>False</ProtectObjects>
                   <ProtectScenarios>False</ProtectScenarios>
                  </WorksheetOptions>
                 </Worksheet>
                </Workbook>
                ';
    }

    function SetContent($content)
    {
        $this->content .= $content;
    }

    function WriteHeaderLine($header_arr)
    {
        foreach ($header_arr as $col)
            $this->content .= "<th width=\"4%\"  style='text-align:center; border-left: 1px solid; border-right: 1px solid; border-top: 1px solid; border-bottom: 1px solid;'>{$col}</th>";
        if ($this->maxcol <= count($header_arr))
            $this->maxcol = count($header_arr);
        $this->rows++;
    }

    function WriteLine($line_arr)
    {
        $this->content .= "<Row>";
        foreach ($line_arr as $col)
            $this->content .= "<Cell><Data ss:Type='String'>{$col}</Data></Cell>";
        $this->content .= "</Row>";
        if ($this->maxcol <= count($line_arr))
            $this->maxcol = count($line_arr);
        $this->rows++;
    }

    function WriteLineMarge($line_arr, $colums)
    {
        $this->content .= "<Row>";
        foreach ($line_arr as $col)
            $this->content .= "<Cell ss:MergeAcross='{$colums}' ss:StyleID='reporte'><Data ss:Type='String'>{$col}</Data></Cell>";
        $this->content .= "</Row>";
        if ($this->maxcol <= count($line_arr))
            $this->maxcol = count($line_arr);
        $this->rows++;
    }

    function GetContent()
    {
        return $this->content;
    }

    function OpenRow()
    {
        $this->content .= "<Row>\n";
        $this->col = 0;
    }

    function OpenRowTR()
    {
        $this->content .= "<tr>\n";
        $this->col = 0;
    }

    function CloseRowTR()
    {
        $this->content .= "</tr>\n";
        $this->col = 0;
        $this->rows++;
    }

    function CloseRow()
    {
        $this->content .= "</Row>\n";
        $this->col = 0;
        $this->rows++;
    }

    function NewCellTD($value, $autow = false, $style = array())
    {
        $rel = '';
        $cl = '';
        $class = '';
        $width = 80;
        $dnum = 0;
        $align = "";
        if (!isset($style['type']))
            $style['type'] = '';
        if (!isset($style['bold']))
            $style['bold'] = '';
        if (!isset($style['align']))
            $style['align'] = '';
        if (!isset($style['border']))
            $style['border'] = '';
        if (!isset($style['background']))
            $style['background'] = '';
        if (!isset($style['color']))
            $style['color'] = '';
        if (!isset($style['width']))
            $style['width'] = '';
        if ($style['type'] == 'numeric') {
            $this->content .= "<td style='text-align:center; border-bottom: 1px solid;font-family:Arial, Helvetica, sans-serif;font-size:12px'><span >{$value}</span></td>";
        } else {
            $this->content .= "<td style='text-align:left;  border-bottom: 1px solid;font-family:Arial, Helvetica, sans-serif;font-size:12px'><span>{$value}</span></td>";
        }

    }

    function NewCell($value, $autow = false, $style = array())
    {

        $rel = '';
        $cl = '';
        $class = '';
        $width = 80;
        $dnum = 0;
        $align = '';
        if (!isset($style['type']))
            $style['type'] = '';
        if (!isset($style['bold']))
            $style['bold'] = '';
        if (!isset($style['align']))
            $style['align'] = '';
        if (!isset($style['border']))
            $style['border'] = '';
        if (!isset($style['background']))
            $style['background'] = '';
        if (!isset($style['color']))
            $style['color'] = '';
        if (!isset($style['width']))
            $style['width'] = '';

        if ($style['type'] == 'int') {
            $rel .= 'ss:Type="Number"';
        } else if ($style['type'] == 'date') {
            $rel .= 'ss:Type="DateTime"';
            $cl .= '<NumberFormat ss:Format="Short Date"/>';
            $value = date("Y-m-d", $value) . "T00:00:00.000";
        } else {
            $rel .= 'ss:Type="String"';
        }

        if (!empty($style['align'])) {
            $cl .= '<Alignment ss:Horizontal="' . ucfirst(strtolower($style['align'])) . '" ss:Vertical="Bottom"/>';
        }

        if ($autow == true) {
            $width = strlen($value) * 18;
        } else {
            if (!empty($style['width'])) {
                $width = $style['width'];
            }
        }
        $this->cols[$this->col] = $width;
        $this->col++;
        if ($this->maxcol <= $this->col)
            $this->maxcol = $this->col;

        if (!empty($style['border'])) {
            $cl .= '<Borders>
						<Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"
						 ss:Color="#' . $style['border'] . '"/>
						<Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"
						 ss:Color="#' . $style['border'] . '"/>
						<Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"
						 ss:Color="#' . $style['border'] . '"/>
						<Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"
						 ss:Color="#' . $style['border'] . '"/>
					   </Borders>';
        }


        if ((!empty($style['color'])) || $style['bold'] == true) {
            $cl .= '<Font ss:FontName="Arial" x:Family="Swiss" ' . (empty($style['color']) ? '' : 'ss:Color="#' . $style['color'] . '"') . ' ' . (empty($style['bold']) ? '' : 'ss:Bold="1"') . '/>';
        }

        if (!empty($style['background'])) {
            $cl .= ' <Interior ss:Color="#' . $style['background'] . '" ss:Pattern="Solid"/>';
        }

        if (!empty($sty))
            $sty = "style='$sty'";

        if (!empty($cl)) {
            $this->cls[md5($cl)] = '<Style ss:ID="xs' . md5($cl) . '">' . $cl . '</Style>' . "\n";
            $class = "ss:StyleID=\"xs" . md5($cl) . "\"";
            //$this->xs++;
        }

        $this->content .= "<Cell {$class}><Data {$rel}>{$value}</Data></Cell>\n";
    }

}