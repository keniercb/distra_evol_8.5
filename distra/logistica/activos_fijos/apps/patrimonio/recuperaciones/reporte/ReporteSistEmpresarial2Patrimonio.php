<?php

class ReporteSistEmpresarial2Patrimonio extends ElementsReport implements IEStrategySetSummary {

    public function __construct() {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->fieldName = 'denominacion';
        $this->gTitle = 'ESTADO DEL REGISTRO Y CONTROL DE LOS BIENES PATRIMONIALES DE LAS FAR';        
    }

    public function NumberRowsPaperFormat() {
        return $this->CasePaperFormat(array(15, 25), array(15, 25), array(15, 25), array(15, 25));
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
  return "<table width=\"100%\" border=\"0\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
              <tr>
                <td><p align='center' style='font-size:12pt; font-weight:bold; text-align:center; border-left:hidden; border-right:hidden;'>$this->gTitle</p></td>
                <td><p align='right' style='font-size:12pt; font-weight:bold; border-left:hidden; border-right:hidden;'>TABLA N<sup>o</sup>: 3</p></td>
              </tr>
              <tr>
                <td><p align='center' style='font-size:12pt; font-weight:bold; text-align:center; border-left:hidden; border-right:hidden;'>SITUACIÓN DEL REGISTRO CONTABLE, VALOR Y CERTIFICADO CONTABLE</p></td>
                <td>&nbsp;</td>
              </tr>
              
        <table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt; margin: 0 0 0 -20px'>
            <tr>
                <td  rowspan='2' valign='center' nowrap='nowrap'><p align='center' style='font-size:12px;font-weight: bold;'>EMPRESAS/PROVINCIAS</p></td>
                <td colspan='4' valign='bottom' nowrap='nowrap'><p align='center' style='font-size:12px;font-weight: bold;'>CIERRE AÑO ANTERIOR</p></td>
                <td colspan='4' valign='bottom' nowrap='nowrap'><p align='center' style='font-size:12px;font-weight: bold;'>CIERRE TRIMESTRE N<sup>o</sup> $generalData->numtrimestre</p></td>
                <td colspan='3' valign='bottom' nowrap='nowrap'><p align='center' style='font-size:12px;font-weight: bold;'>VARIACIÓN ATENDIENDO AL CIERRE DE AÑO</p></td>
            </tr>  
            <tr height='100'>                
                  <td width='5%'><div align='center' style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. total <br> inmuebles</div></td>
                  <td width='3%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles en el registro contable</div></td>
                  <td width='7%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Valor MMP de los inmuebles en Reg. Cont.</div></td>
                  <td width='7%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles con certificado contable</div></td>
                  <td width='1%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. total inmuebles</div></td>
                  <td width='6%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles en el registro contable</div></td>
                  <td width='10%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Valor MMP <br> de los inmuebles <br> en Reg. Cont.</div></td>
                  <td width='3%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles con certificado contable</div></td>
                  <td width='1%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de <br> inmuebles en el registro contable</div></td>
                  <td width='7%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Valor MMP de los inmuebles en <br> Reg. Cont.</div></td>
                  <td width='7%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de <br> inmuebles con certificado contable</div></td>
            </tr>
            <tr >                
                  <td width='3%'><div align='center'  font-size: 10.5px;font-weight: bold;'>1</div></td>
                  <td width='3%'><div align='center'  font-size: 10.5px;font-weight: bold;'>2</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>3</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>4</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>5</div></td>
                  <td width='7%'<div align='center'  font-size: 10.5px;font-weight: bold;'>6</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>7</div></td>
                  <td width='3%'><div align='center'  font-size: 10.5px;font-weight: bold;'>8</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>9</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>10</div></td>
                  <td width='3%'><div align='center'  font-size: 10.5px;font-weight: bold;'>11</div></td>                  
                  <td width='3%'><div align='center'  font-size: 10.5px;font-weight: bold;'>12</div></td>                  
           </tr>";
    }

    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $pos = 1) {
     ($j == 0) ? $TR .= "<tr>               
                  <td width='3%'><div align='left'  font-size: 10.5px;font-weight: bold;'>$argData->denominacion</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna2</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna3</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna4</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna5</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna6</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna7</div></td>                  
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna8</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna9</div></td>
                  <td width='7%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna10</div></td>
                  <td width='3%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna11</div></td>
                  <td width='3%'><div align='center'  font-size: 10.5px;font-weight: bold;'>$argData->columna12</div></td>                  
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
               <td colspan=\"6\">Certificamos que los datos contenidos en este modelo se corresponden con las anotaciones contables de acuerdo con las regulaciones vigentes.</td>
               </tr>
               <tr>
                  <td width=\"31%\"><p align=\"center\">DESIGNADO ATENCIÓN PATRIMONIO</p>
                  <p align=\"center\">Nombres y Apellidos </p></td>
                  <td width=\"32%\"><p align=\"center\">JEFE ÓRGANO DE ECONOMÍA</p>
                  <p align=\"center\">Nombres y Apellidos </p></td>
                  <td colspan=\"4\"><p align=\"center\">DIRECTOR UNIÓN O GRUPO EMPRESARIAL</p>
                  <p align=\"center\">Nombres y Apellidos </p></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td colspan=\"4\">&nbsp;</td>
                </tr>
                <tr>
                  <td>Firma:</td>
                  <td>Firma:</td>
                  <td width=\"22%\">Firma: </td>
                  <td width=\"5%\">D:</td>
                  <td width=\"5%\">M:</td>
                  <td width=\"5%\">A:</td>
                </tr>
              </table>";
    }
}
?>
