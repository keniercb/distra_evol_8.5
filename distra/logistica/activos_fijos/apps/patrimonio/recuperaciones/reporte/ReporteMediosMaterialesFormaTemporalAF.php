<?php

class ReporteMediosMaterialesFormaTemporalAF extends ElementsReport {

    public function __construct() {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->fieldName = 'indicador';
    }
    public function NumberRowsPaperFormat() {
        return $this->CasePaperFormat(array(10, 10), array(10, 10), array(10, 10), array(10, 10));
    }
    public function LengthStringPaperFormat($argField) {
        $argField = 'indicador';
        return $this->CasePaperFormat(array(12, 12), array(12, 12), array(12, 12), array(12, 12));
    }
   public function GetHeadTable(& $PAINTEDROWS, $argArrayBodyData, $argPageCount, & $argArrayColumns) {
        return $this->GetHtmlHeadTable(
                        $PAINTEDROWS, $argArrayBodyData, $this->generalData, $argPageCount
        );
    }
    public function GetHtmlHeadTable(& $PAINTEDROWS, $argArrayBodyData, $generalData, $PAGECOUNT) {
        $encabezado = "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
                      <tr>
                        <td colspan=\"15\"><p align=\"center\"><strong>LIBRO PARA EL REGISTRO DE LOS MEDIOS MATERIALES QUE SE ENTREGAN DE FORMA TEMPORAL</strong></p>
                        <p align=\"center\"><strong>SRM-116</strong></p></td>
                        <td colspan=\"4\" style=\"text-align:center\"><strong>Hoja N<sup>o</sup>: $PAGECOUNT</strong></td>    
                      </tr>
                      <tr>
                        <td colspan=\"3\"><strong>Especialidad:</strong> $generalData->especialidad</td>
                        <td colspan=\"16\"><strong>Nombre y Apellidos:</strong></td>    
                      </tr>
                      <tr>
                        <td width=\"3%\" rowspan=\"4\" style=\"text-align:center\">N<sup>o</sup></td>
                        <td colspan=\"9\" style=\"text-align:center\">Entrega del medio </td>
                        <td colspan=\"9\" style=\"text-align:center\">Devoluci&oacute;n del medio </td>    
                      </tr>
                      <tr>
                        <td width=\"8%\" rowspan=\"3\" style=\"text-align:center\">Descripci&oacute;n</td>
                        <td width=\"8%\" rowspan=\"3\" style=\"text-align:center\">N<sup>o</sup> serie</td>
                        <td width=\"8%\" rowspan=\"3\" style=\"text-align:center\">N<sup>o</sup> inventario</td>
                        <td width=\"6%\" rowspan=\"3\" style=\"text-align:center\">Est.Tec</td>
                        <td colspan=\"6\" style=\"text-align:center\">Recibido por: </td>
                        <td width=\"4%\" rowspan=\"3\" style=\"text-align:center\">Cant</td>                        
                        <td width=\"5%\" rowspan=\"3\" style=\"text-align:center\">Est.Tec</td>
                        <td colspan=\"5\" style=\"text-align:center\">Devuelto por: </td>
                        <td width=\"15%\" rowspan=\"3\" style=\"text-align:center\">Recibido por: </td>    
                      </tr>
                      <tr>
                        <td width=\"7%\" rowspan=\"2\" style=\"text-align:center\">Destino</td>
                        <td width=\"9%\" rowspan=\"2\" style=\"text-align:center\">Nombres y Apellidos </td>
                        <td width=\"6%\" rowspan=\"2\" style=\"text-align:center\">Firma</td>
                        <td colspan=\"3\" style=\"text-align:center\">Fecha</td>
                        <td width=\"8%\" rowspan=\"2\" style=\"text-align:center\">Nombres y Apellidos </td>
                        <td width=\"5%\" rowspan=\"2\" style=\"text-align:center\">Firma</td>
                        <td colspan=\"3\" style=\"text-align:center\">Fecha</td>    
                      </tr>
                      <tr>
                        <td width=\"2%\" style=\"text-align:center\">D</td>
                        <td width=\"2%\" style=\"text-align:center\">M</td>
                        <td width=\"4%\" style=\"text-align:center\">A</td>
                        <td width=\"2%\" style=\"text-align:center\">D</td>
                        <td width=\"2%\" style=\"text-align:center\">M</td>
                        <td width=\"4%\" style=\"text-align:center\">A</td>
                      </tr>";
        return $encabezado;
    }
    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $pos = 1) {
        
        ($j == 0) ? $TR .="<tr>          
            <td width=\"3%\"  style=\"text-align:center\">{$pos}</td>
            <td style=\"text-align:center\">$argData->indicador</td>
            <td width=\"46\"  style=\"text-align:center\">$argData->nroserie</td>
            <td width=\"42\"  style=\"text-align:center\">$argData->nroinventario</td>
            <td width=\"48\"  style=\"text-align:center\">$argData->estado</td>
            <td width=\"48\"  style=\"text-align:center\"></td>
            <td width=\"48\"  style=\"text-align:center\">$argData->responsable_entrega</td>
            <td width=\"48\"  style=\"text-align:center\"></td>
            <td colspan=\"3\" width=\"48\"  style=\"text-align:center\">$argData->fecha_entrega</td> 
            <td width=\"33\"  style=\"text-align:center\">1</td>
            <td width=\"47\" style=\"text-align:center\">$argData->estado_devolucion</td>
            <td width=\"37\" style=\"text-align:center\">$argData->responsable_devolucion</td>
            <td width=\"37\" style=\"text-align:center\"></td>
            <td colspan=\"3\" width=\"48\"  style=\"text-align:center\">$argData->fecha_devolucion</td>
            <td width=\"37\" style=\"text-align:center\"></td>
            </tr>" : $TR .= "";
    }
    public function GetBlankRows($argArrayColumns) {
        return "";
    }
    public function GetHtmlValues($argArrayBodyData, $agHeader, $TRBODYTABLE) {
        return $this->GetHTMLBodyFormat($agHeader, $this->GetBodyTable($TRBODYTABLE), $this->getFootTable($this->footData));
    }
    public function getFootTable($param) {
        return "";
    }
}
?>