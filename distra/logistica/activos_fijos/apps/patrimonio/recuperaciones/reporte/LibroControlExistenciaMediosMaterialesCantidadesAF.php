<?php

class LibroControlExistenciaMediosMaterialesCantidadesAF extends ElementsReport {

    public function __construct() {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->fieldName = 'entidad';
    }
    public function NumberRowsPaperFormat() {
        return $this->CasePaperFormat(array(20, 20), array(20, 20), array(20, 20), array(20, 20));
    }
    public function LengthStringPaperFormat() {        
        return $this->CasePaperFormat(array(9, 9), array(9, 9), array(9, 9), array(9, 9));
    }
    public function GetHeadTable(& $PAINTEDROWS, $argArrayBodyData, $argPageCount, & $argArrayColumns) {
        return $this->GetHtmlHeadTable(
                        $PAINTEDROWS, $argArrayBodyData, $this->generalData, $argPageCount
        );
    }
    public function GetHtmlHeadTable(& $PAINTEDROWS, $argArrayBodyData, $generalData, $PAGECOUNT) {
        $encabezado = "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
                      <tr>
                        <td colspan=\"4\" style=\"text-align:center\"><strong>LIBRO CONTROL DE EXISTENCIAS DE LOS MEDIOS MATERIALES POR CANTIDAD</strong></td>
                      </tr>
                      <tr>
                        <td colspan=\"2\"><strong>C&oacute;digo:</strong> $generalData->codigo</td>
                        <td colspan=\"2\"><strong>Descripci&oacute;n:</strong> $generalData->denominacion-$generalData->marca-$generalData->modelo</td>
                      </tr>
                      <tr>
                        <td width=\"50\" style=\"text-align:center\"><strong>Ubicaci&oacute;n</strong></td>
                        <td width=\"50\" style=\"text-align:center\"><strong>Entrada</strong></td>
                        <td width=\"50\" style=\"text-align:center\"><strong>Salida</strong></td>
                        <td width=\"50\" style=\"text-align:center\"><strong>Existencia</strong></td>
                      </tr>";
        return $encabezado;
    }
    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $pos = 1) {
        
        ($j == 0) ? $TR .= "<tr>
                        <td style=\"text-align:center\">$argData->entidad</td>
                        <td style=\"text-align:center\">$argData->entradas</td>
                        <td style=\"text-align:center\">$argData->salidas</td>
                        <td style=\"text-align:center\">$argData->existencia</td>
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