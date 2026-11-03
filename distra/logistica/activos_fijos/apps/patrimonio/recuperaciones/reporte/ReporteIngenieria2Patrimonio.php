<?php

class ReporteIngenieria2Patrimonio extends ElementsReport implements IEStrategySetSummary {

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
       

        return " <table width=\"100%\" border=\"0\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -35px'>
              <tr>
                <td><p align='center' style='font-size:12pt; font-weight:bold; text-align:center; border-left:hidden; border-right:hidden;'>$this->gTitle</p></td>
                <td><p align='right' style='font-size:10pt;  border-left:hidden; border-right:hidden;'>LIMITADO</p></td>
                <td><p align='right' style='font-size:10pt;  border-left:hidden; border-right:hidden;'> TABLA N<sup>o</sup>: 2</p></td>
              </tr>
              <tr>
                <td><p align='center' style='font-size:12pt; font-weight:bold; text-align:center; border-left:hidden; border-right:hidden;'>DIRECCIÓN DE INGENIERÍA</p></td>
                <td><p align='right' style='font-size:10pt;  border-left:hidden; border-right:hidden;'>Ejemplar N<sup>o</sup>: </p></td>
              </tr> 
              
        <table width=\"103%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 15px 0 0 -35px'>
            <tr>
                <td colspan='15'><p align='center' style='font-size:12pt; font-weight:bold; text-align:center; border-left:hidden; border-right:hidden;'>SITUACIÓN DEL REGISTRO CONTABLE, VALOR Y CERTIFICADO CONTABLE</p></td>
            </tr>
            <tr>
                <td rowspan='2'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>MANDO</div></td>
                <td rowspan='2' width='15%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Región Militar</div></td>                
                <td colspan='4' valign='bottom' nowrap='nowrap'><p align='center' style='font-size:12px;font-weight: bold;'>CIERRE DEL AÑO ANTERIOR</p></td>
                <td colspan='4' valign='bottom' nowrap='nowrap'><p align='center' style='font-size:12px;font-weight: bold;'>CIERRE TRIMESTRE N<sup>o</sup>: $generalData->numtrimestre</p></td>
                <td colspan='2' valign='bottom' nowrap='nowrap'><p align='center' style='font-size:12px;font-weight: bold;'>VARIACIÓN</p></td>
            </tr>  
            <tr height='100'>                
                  <td width='7%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles</div></td>
                  <td width='3%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles en el Reg. Cont</div></td>
                  <td width='3%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Valor de los inmuebles en el Reg. Cont</div></td>
                  <td width='5%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. inmuebles con Cert. Contable</div></td>
                  <td width='5%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles</div></td>
                  <td width='5%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles en el Reg. Cont</div></td>
                  <td width='6%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Valor de los inmuebles  en el Reg. Cont</div></td>
                  <td width='6%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles  con Cert. Contable</div></td>
                  <td width='3%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Cant. de inmuebles en el Reg. Cont</div></td>
                  <td width='7%'><div align='center'  style='-moz-transform: rotate(-90deg) ;-webkit-transform: rotate(-90deg);font-size: 10.5px;font-weight: bold;'>Valor de los inmueble con Reg. Cont</div></td>
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
           </tr>
        ";
    }

    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $pos = 1) {
    ($j == 0) ? $TR .= "<tr>               
                  <td width='3%' colspan='2'><div align='left'  font-size: 10.5px;font-weight: bold;'>$argData->denominacion</div></td>
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
        return "<table width=\"103%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -35px'>
                 <tr>
                    <td colspan=\"6\" style=\"text-align:justify\">Certificamos que los datos que en el presente informe aparecen, corresponden a las cifras registradas contablemente en la contabilidad material y financiera.</td>
                  </tr>
               <tr>
                  <td width=\"31%\"><p align=\"center\">Oficial de Aseguramiento Ingeniero</p>
                  <p align=\"center\">Nombres y Apellidos</p></td>
                  <td width=\"32%\"><p align=\"center\">Jefe V Departamento</p>
                  <p align=\"center\">Nombres y Apellidos</p></td>
                  <td colspan=\"4\"><p align=\"center\">Jefe UM</p>
                  <p align=\"center\">Nombres y Apellidos</p></td>
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
