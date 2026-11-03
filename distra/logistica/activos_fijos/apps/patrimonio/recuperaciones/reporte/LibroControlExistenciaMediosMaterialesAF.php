<?php

class LibroControlExistenciaMediosMaterialesAF extends ElementsReport {

    public function __construct() {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->fieldName = 'nroserie';
    }
    public function NumberRowsPaperFormat() {
        return $this->CasePaperFormat(array(17, 17), array(17, 17), array(17, 17), array(17, 17));
    }
    public function LengthStringPaperFormat(&$argField) {
        $argField = 'ubicacion';
        return $this->CasePaperFormat(array(18, 18), array(18, 18), array(18, 18), array(18, 18));
    }
    public function GetHeadTable(& $PAINTEDROWS, $argArrayBodyData, $argPageCount, & $argArrayColumns) {
        return $this->GetHtmlHeadTable(
                        $PAINTEDROWS, $argArrayBodyData, $this->generalData, $argPageCount
        );
    }
    public function GetHtmlHeadTable(& $PAINTEDROWS, $argArrayBodyData, $generalData, $PAGECOUNT) {
        $encabezado = "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
                      <tr>
                        <td colspan=\"16\" style=\"text-align:center\"><strong>LIBRO CONTROL DE EXISTENCIAS DE LOS MEDIOS MATERIALES</strong></td>
                        <td width=\"19\" rowspan=\"5\" style=\"text-align:center\">N<sup>o</sup></td>
                        <td rowspan=\"5\"  style=\"text-align:center\">Ubicaci&oacute;n</td>   
                        <td colspan=\"4\" rowspan=\"2\" style=\"text-align:center\">Hoja N<sup>o</sup>: $PAGECOUNT </td>
                      </tr>
                      <tr>
                        <td colspan=\"7\">C&oacute;digo: $generalData->codigo</td>
                        <td colspan=\"6\">Descripci&oacute;n: $generalData->denominacion-$generalData->marca-$generalData->modelo</td>
                        <td colspan=\"3\">Unidad de medida: </td>     
                      </tr>
                      <tr>
                        <td width=\"18\" rowspan=\"3\" style=\"text-align:center\">N<sup>o</sup></td>
                        <td colspan=\"5\" style=\"text-align:center\">Documento</td>
                        <td width=\"48\" rowspan=\"3\" style=\"text-align:center\">Serie</td>
                        <td width=\"64\" rowspan=\"3\" style=\"text-align:center\">N<sup>o</sup> Inventario </td>
                        <td width=\"33\" rowspan=\"3\" style=\"text-align:center\">N<sup>o</sup> Caja </td>
                        <td colspan=\"3\" rowspan=\"2\" style=\"text-align:center\">Total</td>
                        <td width=\"45\" rowspan=\"3\" style=\"text-align:center\">Categ.</td>
                        <td colspan=\"2\" rowspan=\"2\" style=\"text-align:center\">Conserv.</td>
                        <td width=\"45\" rowspan=\"3\" style=\"text-align:center\">Valor</td>       
                        <td width=\"10%\" rowspan=\"3\" style=\"text-align:center\">Referencia</td>
                        <td rowspan=\"3\" colspan=\"3\" style=\"text-align:center\">Estado T&eacute;cnico </td>    
                      </tr>
                      <tr>
                        <td colspan=\"3\" style=\"text-align:center\">Fecha</td>
                        <td width=\"46\" rowspan=\"2\" style=\"text-align:center\">Clave</td>
                        <td width=\"42\" rowspan=\"2\" style=\"text-align:center\">N<sup>o</sup></td>       
                      </tr>
                      <tr>
                        <td width=\"11\" style=\"text-align:center\">D</td>
                        <td width=\"14\" style=\"text-align:center\">M</td>
                        <td width=\"11\" style=\"text-align:center\">A</td>
                        <td width=\"47\" style=\"text-align:center\">Entrada</td>
                        <td width=\"37\" style=\"text-align:center\">Salida</td>
                        <td width=\"35\" style=\"text-align:center\">Existencia</td>
                        <td width=\"39\" style=\"text-align:center\">A&ntilde;o</td>
                        <td width=\"46\" style=\"text-align:center\">Tipo</td>
                      </tr>";
        return $encabezado;
    }
    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $pos = 1) {
        if ($argData->nrodoc === 'Va al' || $argData->nrodoc === 'Viene') {
            $pos = '';
        } else {
            $pos -= $argData->countInterno;
        }
        ($j == 0) ? $TR .="<tr>          
            <td width=\"3%\"  style=\"text-align:center\">{$pos}</td>
            <td colspan=\"3\" style=\"text-align:center\">$argData->fechacontable</td>
            <td width=\"46\"  style=\"text-align:center\">$argData->operacion</td>
            <td width=\"42\"  style=\"text-align:center\">$argData->nrodoc</td>
            <td width=\"48\"  style=\"text-align:center\">$argData->nroserie</td>
            <td width=\"64\"  style=\"text-align:center\">$argData->nroinventario</td>
            <td width=\"33\"  style=\"text-align:center\"></td>
            <td width=\"47\" style=\"text-align:center\">$argData->entrada</td>
            <td width=\"37\" style=\"text-align:center\">$argData->salida</td>
            <td width=\"35\" style=\"text-align:center\">$argData->existencia</td>
            <td width=\"45\" style=\"text-align:center\"></td>
            <td width=\"39\" style=\"text-align:center\"></td>
            <td width=\"46\" style=\"text-align:center\"></td>
            <td width=\"45\" style=\"text-align:center\">$argData->sumvalor</td>
            <td width=\"18\" style=\"text-align:center\">{$pos}</td>
            <td style=\"text-align:center\">$argData->ubicacion</td>
            <td width=\"10%\" style=\"text-align:center\"></td>
            <td colspan=\"3\" style=\"text-align:center\">$argData->estado</td>
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