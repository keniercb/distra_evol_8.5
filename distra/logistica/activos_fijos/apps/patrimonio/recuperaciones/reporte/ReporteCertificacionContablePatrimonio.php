<?php

class ReporteCertificacionContablePatrimonio extends ElementsReport {

    public function __construct() {
      $global = ZendExt_GlobalConcept::getInstance();
      $this->fieldName = 'numerodeldocumento';
      }

      public function NumberRowsPaperFormat() {
      return $this->CasePaperFormat(array(12, 12), array(12, 12), array(12, 12), array(12, 12));
      }

      public function LengthStringPaperFormat(&$argField) {
      //$argField = 'operaciondoc';
      return $this->CasePaperFormat(array(17, 17), array(17, 17), array(17, 17), array(17, 17));
      }

      public function GetHeadTable(& $PAINTEDROWS, $argArrayBodyData, $argPageCount, & $argArrayColumns) {
       return $this->GetHtmlHeadTable($PAINTEDROWS, $argArrayBodyData, $this->generalData, $argPageCount);
      }
      
      public function GetHtmlHeadTable(& $PAINTEDROWS, $argArrayBodyData, $generalData, $PAGECOUNT) {
      $DIA = date('d');
      $MES = date('m');
      $ANNO = date('Y');
      $encabezado = "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
      <tr>
      <td colspan=\"2\" rowspan=\"2\"><p><strong>MINFAR</strong></p>
      <p><strong>UM:</strong></p></td>
      <td colspan=\"4\" rowspan=\"2\"><div align=\"center\"><strong>CERTIFICACI&Oacute;N CONTABLE, SCF-57 </strong></div></td>
      <td width=\"5%\"><div align=\"center\"><strong>D</strong></div></td>
      <td width=\"5%\"><div align=\"center\"><strong>M</strong></div></td>
      <td width=\"5%\"><div align=\"center\"><strong>A</strong></div></td>
      </tr>
      <tr>
      <td height=\"23\" style=\"text-align:center\">$DIA</td>
      <td style=\"text-align:center\">$MES</td>
      <td style=\"text-align:center\">$ANNO</td>
      </tr>
      <tr>
      <td colspan=\"4\"><strong>ESPECIALIDAD:</strong> $generalData->especialidad</td>

      <td colspan=\"5\"><strong>PER&Iacute;ODO TERMINADO EN:</strong></td>
      </tr>
      <tr>
      <td width=\"9%\" rowspan=\"2\"><div align=\"center\"><strong>N.<sup>o</sup></strong></div></td>
      <td colspan=\"2\"><div align=\"center\"><strong>DOCUMENTO</strong></div></td>
      <td rowspan=\"2\"><div align=\"center\"><strong>INVENTARIO N.<sup>o</sup></strong></div></td>
      <td width=\"25%\" rowspan=\"2\"><div align=\"center\"><strong>VALOR</strong></div></td>
      <td rowspan=\"2\" colspan=\"4\"><div align=\"center\"><strong>DENOMINACIÓN</strong></div></td>
      </tr>
      <tr>
      <td width=\"11%\"><div align=\"center\"><strong>CLAVE</strong></div></td>
      <td width=\"11%\"><div align=\"center\"><strong>N.<sup>o</sup></strong></div></td>
      </tr>";

      return $encabezado;
      }

      public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $pos = 1) {
      ($j == 0) ? $TR .="<$pos>
      <td width=\"9%\" style=\"text-align:center\">{$pos}</td>
      <td width=\"11%\" style=\"text-align:center\">$argData->operaciondoc</td>
      <td width=\"11%\" style=\"text-align:center\">$argData->numerodeldocumento</td>
      <td colspan=\"1\" style=\"text-align:center\">$argData->nroinventario</td>
      <td colspan=\"1\" style=\"text-align:center\">$argData->valorinmueble</td>
      <td colspan=\"4\" style=\"text-align:center\">$argData->denominacion</td>
      <tr>" : $TR .= "<tr>
      <td width=\"9%\" style=\"text-align:center\"></td>
      <td width=\"11%\" style=\"text-align:center\"></td>
      <td width=\"11%\" style=\"text-align:center\"></td>
      <td colspan=\"2\" style=\"text-align:center\"></td>
      <td colspan=\"4\" style=\"text-align:center\"></td>
      </tr>";
      }

      public function GetBlankRows($argArrayColumns) {
      return "";
      }

      public function GetHtmlValues($argArrayBodyData, $agHeader, $TRBODYTABLE) {
      return $this->GetHTMLBodyFormat($agHeader, $this->GetBodyTable($TRBODYTABLE), $this->getFootTable($this->footData));
      }

      public function getFootTable($param) {
      return "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
      <tr>
        <td width=\"21%\" style=\"text-align:center\"><strong>CERTIFICADO POR:</strong></td>
        <td colspan=\"4\" style=\"text-align:center\"><strong>REVISADO POR:</strong></td>
        <td colspan=\"4\" style=\"text-align:center\"><strong>APROBADO POR:</strong></td>
        <td colspan=\"4\" style=\"text-align:center\"><strong>CONTABILIZADO POR:</strong></td>
        <td width=\"8%\" rowspan=\"4\"><strong>N.<sup>o</sup></strong></td>
      </tr>
      <tr>
        <td><div align=\"center\">
        <p><strong>NOMBRE Y APELLIDOS</strong></p>
        <p>&nbsp; </p>
        </div></td>
        <td colspan=\"4\"><div align=\"center\">
        <p><strong>NOMBRE Y APELLIDOS</strong></p>
        <p>&nbsp; </p>
        </div></td>
        <td colspan=\"4\"><div align=\"center\">
        <p><strong>NOMBRE Y APELLIDOS</strong></p>
        <p>&nbsp;</p>
        </div></td>
        <td colspan=\"4\"><p align=\"center\"><strong>NOMBRE Y APELLIDOS</strong></p>
        <p>&nbsp;</p></td>
      </tr>
      <tr>
        <td rowspan=\"2\"><strong>FIRMA</strong></td>
        <td width=\"6%\" rowspan=\"2\"><strong>FIRMA</strong></td>
        <td width=\"3%\"><div align=\"center\"><strong>D</strong></div></td>
        <td width=\"4%\"><div align=\"center\"><strong>M</strong></div></td>
        <td width=\"8%\"><div align=\"center\"><strong>A</strong></div></td>
        <td width=\"13%\" rowspan=\"2\"><strong>FIRMA</strong></td>
        <td width=\"4%\"><div align=\"center\"><strong>D</strong></div></td>
        <td width=\"4%\"><div align=\"center\"><strong>M</strong></div></td>
        <td width=\"7%\"><div align=\"center\"><strong>A</strong></div></td>
        <td width=\"11%\" rowspan=\"2\"><strong>FIRMA</strong></td>
        <td width=\"4%\"><div align=\"center\"><strong>D</strong></div></td>
        <td width=\"3%\"><div align=\"center\"><strong>M</strong></div></td>
        <td width=\"4%\"><div align=\"center\"><strong>A</strong></div></td>
      </tr>
      <tr>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
        <td>&nbsp;</td>
      </tr>
      </table>";
      } 
}

?>
