<?php

class RegistroMueblesOtrosEquiposUsoAF extends ElementsReport {
    
    public function __construct() {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->fieldName = 'nroserie'; 
        $this->estructura = $global->Estructura->idestructura;
        
    }
    public function NumberRowsPaperFormat() {
        return $this->CasePaperFormat(array(10, 15), array(10, 15), array(10, 15), array(10, 15));
    }
     public function LengthStringPaperFormat(&$argField) {
        $argField = 'denominacion';
        return $this->CasePaperFormat(array(10, 10), array(10, 10), array(10, 10), array(10, 10));
    }
    public function GetHeadTable(& $PAINTEDROWS, $argArrayBodyData, $argPageCount, & $argArrayColumns) {
        return $this->GetHtmlHeadTable(
                        $PAINTEDROWS, $argArrayBodyData, $this->generalData, $argPageCount
        );
    }
    public function GetHtmlHeadTable(& $PAINTEDROWS, $argArrayBodyData, $generalData, $PAGECOUNT) {
        $DIA = date('d');
        $MES = date('m');
        $ANNO = date('Y');        
        $encabezado = "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
                        <tr>
                          <td colspan=\"6\" rowspan=\"4\"><p align=\"LEFT\" class=\"style1 style3\">MINFAR</p>
                          <p align=\"LEFT\" class=\"style1 style3\">UM: $generalData->entidad </p></td>
                          <td colspan=\"11\" rowspan=\"4\"><p align=\"center\" class=\"style1 style3\"><strong>REGISTRO DE MUEBLES Y OTROS EQUIPOS EN USO</strong></p>
                          <p align=\"center\" class=\"style1 style3\"><strong>SRM - 132</strong></p> </td>
                          <td colspan=\"4\"><p>Autorizado por:</p>
                          </td>
                        </tr>
                      <tr>
                        <td colspan=\"3\" style=\"text-align:center\">Fecha</td>
                        <td width=\"6%\" rowspan=\"3\">N.<sup>o</sup></td>    
                      </tr>
                      <tr>
                        <td width=\"4%\" style=\"text-align:center\">D</td>
                        <td width=\"6%\" style=\"text-align:center\">M</td>
                        <td width=\"4%\" style=\"text-align:center\">A</td>    
                      </tr>
                      <tr>
                        <td style=\"text-align:center\">{$DIA}</td>
                        <td style=\"text-align:center\">{$MES}</td>
                        <td style=\"text-align:center\">{$ANNO}</td>    
                      </tr>
                      <tr>
                        <td colspan=\"7\">Dependencia</td>
                        <td colspan=\"7\">&Aacute;rea: $generalData->arearesp</td>
                        <td colspan=\"7\">Local</td>    
                      </tr>
                      <tr>
                        <td colspan=\"13\" style=\"text-align:center\">Alta</td>
                        <td colspan=\"8\" style=\"text-align:center\">Baja o Traslado </td>    
                      </tr>
                      <tr>
                        <td width=\"3%\" rowspan=\"3\" style=\"text-align:center\">N.<sup>o</sup></td>
                        <td colspan=\"4\" style=\"text-align:center\">Documento</td>
                        <td width=\"4%\" rowspan=\"3\" style=\"text-align:center\">N.<sup>o </sup>Invent</td>
                        <td width=\"6%\" rowspan=\"3\" style=\"text-align:center\">N.<sup>o </sup>Serie </td>
                        <td width=\"8%\" rowspan=\"3\" style=\"text-align:center\"><div align=\"center\">Descripci&oacute;n</div></td>
                        <td colspan=\"3\" rowspan=\"3\" style=\"text-align:center\">Estado</td>
                        <td width=\"4%\" rowspan=\"3\" style=\"text-align:center\">U/M</td>
                        <td width=\"8%\" rowspan=\"3\" style=\"text-align:center\">Precio Unitario </td>
                        <td colspan=\"4\" rowspan=\"2\" style=\"text-align:center\">Documento</td>
                        <td rowspan=\"3\" colspan=\"2\" style=\"text-align:center\">Motivos / Destinos </td>
                        <td rowspan=\"3\" colspan=\"2\" style=\"text-align:center\">Firma</td>    
                      </tr>
                      <tr>
                        <td colspan=\"3\" rowspan=\"2\" style=\"text-align:center\">Fecha</td>
                        <td width=\"10%\" rowspan=\"2\" style=\"text-align:center\">Clave y n&uacute;mero </td>    
                      </tr>
                      <tr> 
                        <td colspan=\"3\" style=\"text-align:center\">Fecha</td>
                        <td width=\"9%\"  style=\"text-align:center\">Clave y N.<sup>o </sup> </td>   
                      </tr>";
        return $encabezado;
    }
    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $pos = 1) {
        $clave = $argData->concepto. (($argData->nrodoc != null) ? ' - '.$argData->nrodoc : '');
        $clavesalida = $argData->conceptosalida. (($argData->nrodocsalida != null) ? ' - '.$argData->nrodocsalida : '');
        ($j == 0) ? $TR .="<tr>
            <td width=\"3%\"  style=\"text-align:center\">{$pos}</td>
            <td colspan=\"3\"  style=\"text-align:center\">$argData->fechacontable</td>
            <td width=\"7%\"  style=\"text-align:center\">$clave</td>
            <td width=\"4%\"  style=\"text-align:center\">$argData->nroinventario</td>
            <td width=\"6%\"  style=\"text-align:center\">$argData->nroserie</td>
            <td width=\"8%\"  style=\"text-align:center\">$argData->denominacion</td>
            <td colspan=\"3\"  style=\"text-align:center\">$argData->estado</td>
            <td width=\"9%\"  style=\"text-align:center\">$argData->nombreum</td>
            <td width=\"8%\"  style=\"text-align:center\">$argData->valorcontable</td>
            <td colspan=\"3\" style=\"text-align:center\">$argData->fechasalida</td>           
            <td width=\"9%\"  style=\"text-align:center\">$clavesalida</td>
            <td  colspan=\"2\" style=\"text-align:center\">$argData->motivodestino</td>
            <td  colspan=\"2\" style=\"text-align:center\"></td>
            </tr>" : $TR .= "";
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
                      <td colspan=\"6\"><p>Observaciones</p>
                      <p>&nbsp;</p></td>       
                    </tr>
                    <tr>
                      <td colspan=\"3\">Custodiado por: </td>
                      <td colspan=\"3\">Revisado por: </td>
                    </tr>
                    <tr>
                      <td width=\"31%\">Grado militar, nombres y apellidos </td>
                      <td width=\"9%\" style=\"text-align:center\">Fecha</td>
                      <td width=\"9%\" style=\"text-align:center\">Firma</td>
                      <td width=\"32%\">Grado militar, nombres y apellidos </td>
                      <td width=\"9%\" style=\"text-align:center\">Fecha</td>
                      <td width=\"9%\" style=\"text-align:center\">Firma</td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr>
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
