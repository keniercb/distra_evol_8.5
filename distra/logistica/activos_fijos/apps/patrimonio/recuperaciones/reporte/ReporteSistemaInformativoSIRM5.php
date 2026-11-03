<?php

class ReporteSistemaInformativoSIRM5 extends ElementsReport {

    private $estructura;

    public function __construct() {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->fieldName = 'noserie';
        $this->textPageBreak = '<#break#>';
        $this->estructura = $global->Estructura->idestructura;
    }

    public function NumberRowsPaperFormat() {
        return $this->CasePaperFormat(array(15, 25), array(15, 25), array(15, 25), array(15, 25));
    }

    public function LengthStringPaperFormat() {
        return $this->CasePaperFormat(array(21, 20), array(26, 20), array(30, 26), array(30, 26));
    }

 
    public function GetHeadTable(& $PAINTEDROWS, $argArrayBodyData, $argPageCount, & $argArrayColumns) {
        return $this->GetHtmlHeadTable(
                        $PAINTEDROWS, $argArrayBodyData, $this->generalData->trimestre, $this->generalData->diaf, $this->generalData->mesf, $this->generalData->anno, $argPageCount
        );
    } 

    public function GetHtmlHeadTable(& $PAINTEDROWS, $argArrayBodyData, $TRIMESTRE, $DIA, $MES, $ANNO, $PAGECOUNT) {
        $fecha = date('d/m/Y');
        $encabezado = "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
                     <tr>
                        <td colspan=\"2\" align=\"LEFT\">MINFAR
                        <p>UM:</p></td>
                        <td colspan=\"8\" style=\"text-align:center\"><p class=\"style\"¨>SIRM 5</p>
                        <p>INFORME SOBRE LOS MEDIOS MATERIALES RECIBIDOS DE LOS ÓRGANOS SUMINISTRADORES</p></td>
                        <td colspan=\"2\" style=\"text-align:center\">&quot;CLASIFICACI&Oacute;N&quot;</td>
                      </tr>
                      <tr>                       
                        <td colspan=\"12\" align=\"LEFT\">Periodo terminado en:</td>    
                      </tr>
                      <tr>
                         <td width=\"4%\" rowspan=\"2\" style=\"text-align:center\">N<sup>o</sup></td>
                         <td width=\"9%\" rowspan=\"2\" style=\"text-align:center\">Código</td>
                         <td width=\"17%\" rowspan=\"2\" style=\"text-align:center\">Descripción</td>
                         <td width=\"5%\" rowspan=\"2\" style=\"text-align:center\">U/M</td>
                         <td colspan=\"8\" style=\"text-align:center\">Recibido de:</td>                         
                      </tr>
                      <tr>
                        <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                        <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                        <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                        <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                        <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                        <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                        <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                        <td width=\9%\" style=\"text-align:center\">TOTAL</td> 
                      </tr>";

        return $encabezado;
    }

    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $i = 1) {

        if (!$this->Match($TR_TEXT, '<#break#>')) {
            if ($j == 0) {
                $TR .= "<tr>
                          <td width=\"4%\" rowspan=\"2\" style=\"text-align:center\">N<sup>o</sup></td>
                          <td width=\"9%\" rowspan=\"2\" style=\"text-align:center\">Código</td>
                          <td width=\"17%\" rowspan=\"2\" style=\"text-align:center\">Descripción</td>
                          <td width=\"5%\" rowspan=\"2\" style=\"text-align:center\">U/M</td>
                          <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                          <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                          <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                          <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                          <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                          <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                          <td width=\"8%\" style=\"text-align:center\">&nbsp;</td>
                        </tr>";
            } else {
                $TR .= "<tr>                            
                          <td width=\"4%\" rowspan=\"2\" style=\"text-align:center\"></td>
                          <td width=\"9%\" rowspan=\"2\" style=\"text-align:center\"></td>
                          <td width=\"17%\" rowspan=\"2\" style=\"text-align:center\"></td>
                          <td width=\"5%\" rowspan=\"2\" style=\"text-align:center\"></td>
                          <td width=\"8%\" style=\"text-align:center\"></td>
                          <td width=\"8%\" style=\"text-align:center\"></td>
                          <td width=\"8%\" style=\"text-align:center\"></td>
                          <td width=\"8%\" style=\"text-align:center\"></td>
                          <td width=\"8%\" style=\"text-align:center\"></td>
                          <td width=\"8%\" style=\"text-align:center\"></td>
                          <td width=\"8%\" style=\"text-align:center\"></td>
              </tr>";
            }
        }
    }

    public function Match($text, $pattern) {
        return strpos($text, $pattern) !== false;
    }

    public function GetBlankRows($argArrayColumns) {
        return "";
    }

     public function GetHtmlValues($argArrayBodyData, $agHeader, $TRBODYTABLE) {
        return $this->GetHTMLBodyFormat(
                        $agHeader, $this->GetBodyTable($TRBODYTABLE), $this->getFootTable($this->footData)
        );
    }

    public function getFootTable($param) {
        $inicial = "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
                    <tr>
                      <td colspan=\"5\">Certificamos que los datos contenidos en este informe se corresponden con las anotaciones realizadas en los registros y modelos habilitados para el control de los medios materiales. </td>    
                    </tr>
                    <tr>
                      <td width=\"41%\">Confeccionado por: </td>
                      <td width=\"41%\">Aprobado por: </td>
                      <td colspan=\"3\" style=\"text-align:center\">Fecha</td>	
                    </tr>
                    <tr>
                      <td>Nombres y apellidos:</td>
                      <td>Nombres y apellidos: </td>
                      <td width=\"5%\" style=\"text-align:center\">D</td>
                      <td width=\"5%\" style=\"text-align:center\">M</td>
                      <td width=\"5%\" style=\"text-align:center\">A</td>
                    </tr>
                    <tr>
                      <td>Cargo:</td>
                      <td>Cargo:</td>
                      <td rowspan=\"2\">&nbsp;</td>
                      <td rowspan=\"2\">&nbsp;</td>
                      <td rowspan=\"2\">&nbsp;</td>
                    </tr>
                    <tr>
                      <td>Firma:</td>
                      <td>Firma:</td>    
                    </tr>
                  </table>";

        return $inicial;
    }
}
?>