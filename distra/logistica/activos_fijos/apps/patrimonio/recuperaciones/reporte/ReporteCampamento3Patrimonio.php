<?php
class ReporteCampamento3Patrimonio extends ElementsReport implements IEStrategySetSummary {

    public function __construct() {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->fieldName = 'denominacion';
        $this->gTitle = 'ESTADO DEL REGISTRO CONTABLE DE LOS BIENES INMUEBLES DE LAS FAR';        
    }

    public function NumberRowsPaperFormat() {
        return $this->CasePaperFormat(array(30, 25), array(30, 25), array(30, 25), array(30, 25));
    }

    public function LengthStringPaperFormat() {
        return $this->CasePaperFormat(array(21, 22), array(26, 18), array(30, 17), array(30, 17));
    }

    public function GetHeadTable(& $PAINTEDROWS, $argArrayBodyData, $argPageCount, & $argArrayColumns) {
        return $this->GetHtmlHeadTable(
                        $PAINTEDROWS, $argArrayBodyData, $this->generalData, $argPageCount
        );
    }

    public function GetHtmlHeadTable (& $PAINTEDROWS, $argArrayBodyData, $generalData, $PAGECOUNT) {       
   return " <table width=\"100%\" border=\"0\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>               
              <tr>
                <td ><div align=\"right\"; class=\"style1\"><strong> $this->gTitle<strong></div></td>
                <td width=\"13%\" align=\"right\";>LIMITADO <br> Ejemplar N<sup>o</sup>:</td>
                <td width=\"13%\" align=\"right\";>TABLA N<sup>o</sup>: 3</td>
              </tr>
              <tr>
                <td width=\"33%\"><div align=\"left\"><strong>MANDO:<strong></div></td>
                <td colspan=\"2\" align=\"left\"><strong>UM:<strong></td>
              </tr>
              <tr>
                <td><div align=\"left\"><strong>ESPECIALIDAD: $generalData->denoespecialidad<strong></div></td>
                <td colspan=\"2\">&nbsp;</td>
              </tr>
              <tr>
                <td><strong>EN:<strong></td>
                <td colspan=\"2\">&nbsp;</td>
              </tr>
        <table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt; margin: 0 0 0 -20px'>
            <tr>
                <td rowspan=\"2\" style=\"text-align:center\"><strong>N<sup>o<sup></strong></td>
                <td rowspan=\"2\" style=\"text-align:center\"><strong>Mando/Unidad Militar</strong></td>
                <td rowspan=\"2\" style=\"text-align:center\"><strong>Código N<sup>o<sup></strong></td>
                <td colspan=\"2\" style=\"text-align:center\"><strong>Inmuebles Controlados</strong></td>
                <td colspan=\"2\" style=\"text-align:center\"><strong>Registrado por el Órgano Financiero</strong></td>
                <td colspan=\"2\" style=\"text-align:center\"><strong>De ellos: con certificado contable</strong></td>
              </tr>
              <tr>
                <td style=\"text-align:center\"><strong>Cant.</strong></td>
                <td style=\"text-align:center\"><strong>Valor</strong></td>
                <td style=\"text-align:center\"><strong>Cant.</strong></td>
                <td style=\"text-align:center\"><strong>Importe</strong></td>
                <td style=\"text-align:center\"><strong>Cant.</strong></td>
                <td style=\"text-align:center\"><strong>Importe</strong></td>
              </tr>
        ";
    }

    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $pos = 1) {
     ($j == 0) ? $TR .= "<tr>
                  <td width='1%'><div align='center'  font-size: 10.5px;font-weight: bold;'>{$pos}</div></td>
                  <td width='14%'><div align='left'  font-size: 10.5px;font-weight: bold;'>$argData->denominacion</div></td>
                  <td width='4%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna7</div></td>                  
                  <td width='4%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna8</div></td>
                  <td width='6%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna9</div></td>
                  <td width='4%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna10</div></td>
                  <td width='6%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna11</div></td>
                  <td width='4%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna12</div></td>
                  <td width='6%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna13</div></td>                                    
                 </tr>" : $TR .= "";                          
    }

    public function GetBlankRows($argArrayColumns) {
        return "";
    }

    public function GetHtmlValues($argArrayBodyData, $agHeader, $TRBODYTABLE) {
        return $this->GetHTMLBodyFormat($agHeader, $this->GetBodyTable($TRBODYTABLE), $this->getFootTable($this->footData));
    }

    public function getFootTable($param) {
        return "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt; margin: 0 0 0 -20px'>
                  <tr>
                    <td colspan=\"3\" style=\"text-align:justify\">Certificamos que los datos que en el presente informe aparecen, corresponden a las cifras registradas contablemente en la contabilidad material y financiera.</td>
                  </tr>                  
                  <tr>
                    <td width=\"34%\" style=\"text-align:center\">JEFE ESPECIALIDAD</td>
                    <td width=\"38%\" style=\"text-align:center\">JEFE ÓRGANO DE ECONOMÍA</td>
                    <td style=\"text-align:center\">APROBADO <br> JEFE UNIDAD MILITAR</td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>                    
                  </tr>
                  <tr>
                    <td style=\"text-align:center\">Grado, Nombre y Apellidos</td>
                    <td style=\"text-align:center\">Grado, Nombre y Apellidos</td>
                    <td style=\"text-align:center\">Grado, Nombre y Apellidos</td>                    
                  </tr>
                  <tr>
                    <td>Firma:</td>                                       
                    <td>Firma:</td>                                       
                    <td>Firma:</td>                                       
                  </tr>
              </table>";
    }
}
?>
