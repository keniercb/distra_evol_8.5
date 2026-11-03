<?php

class ReporteSistemaInformativoSIRM2 extends ElementsReport {

    private $estructura;

    public function __construct() {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->fieldName = 'denominacion';
        $this->textPageBreak = '<#break#>';
        $this->estructura = $global->Estructura->idestructura;
    }

    public function NumberRowsPaperFormat() {
        return $this->CasePaperFormat(array(10, 10), array(10, 10), array(10, 10), array(10, 10));
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
                        <td colspan=\"2\" align=\"LEFT\"><strong>UM:</strong> {$this->generalData->entidad}</td>
                        <td colspan=\"14\" style=\"text-align:center\"><p class=\"style\"><strong>SIRM 2</strong></p>
                        <p><strong>INFORME SOBRE LA EXISTENCIA Y EL ESTADO T&Eacute;CTICO DE AGREGADOS, PIEZAS, PARTES, ÚTILES Y</strong></p>
                        <p><strong>HERRAMIENTAS Y OTROS MEDIOS MATERIALES</strong></p></td>
                        <td colspan=\"4\" rowspan=\"2\" style=\"text-align:center\"><strong>&quot;CLASIFICACI&Oacute;N&quot;</strong></td>
                      </tr>
                      <tr>
                        <td colspan=\"7\"><span class=\"style6\">Especialidad: {$this->generalData->especialidad}</span></td>
                        <td colspan=\"9\"><span class=\"style6\">Periodo terminado en: {$this->generalData->fechafin}</span></td>
                      </tr>
                      <tr>
                        <td width=\"3%\" rowspan=\"3\" style=\"text-align:center\">N.<sup>o </sup></td>
                        <td width=\"5%\" rowspan=\"3\" colspan=\"2\" style=\"text-align:center\">C&oacute;digo</td>
                        <td width=\"9%\" rowspan=\"3\"  colspan=\"3\" style=\"text-align:center\">Nomenclatura</td>
                        <td width=\"5%\" rowspan=\"3\" style=\"text-align:center\">Lleva PP </td>
                        <td colspan=\"7\" style=\"text-align:center\">Existencias</td>
                        <td rowspan=\"2\" colspan=\"5\" style=\"text-align:center\">Total por categor&iacute;a </td>
                        <td width=\"9%\" rowspan=\"3\" style=\"text-align:center\">Necesita
                        <p>(Cobertura)</p></td>
                      </tr>
                      <tr>
                        <td width=\"5%\" rowspan=\"2\" style=\"text-align:center\">Almac.</td>
                        <td width=\"5%\" rowspan=\"2\" style=\"text-align:center\">Reserv</td>
                        <td width=\"9%\" rowspan=\"2\" style=\"text-align:center\">Conservaci&oacute;n</td>
                        <td colspan=\"3\" style=\"text-align:center\">En uso o explot </td>
                        <td width=\"5%\" rowspan=\"2\" style=\"text-align:center\">Total</td>
                      </tr>
                      <tr>
                        <td width=\"2%\" style=\"text-align:center\">B</td>
                        <td width=\"4%\" style=\"text-align:center\">R</td>
                        <td width=\"4%\" style=\"text-align:center\">M</td>
                        <td width=\"3%\" style=\"text-align:center\">I</td>
                        <td width=\"4%\" style=\"text-align:center\">II</td>
                        <td width=\"3%\" style=\"text-align:center\">III</td>
                        <td width=\"4%\" style=\"text-align:center\">IV</td>
                        <td width=\"5%\" style=\"text-align:center\">V</td>
                      </tr>";

        return $encabezado;
    }

    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $i = 1) {



        $TR .= "<tr>
                          <td width=\"3%\" style=\"text-align:center\">{$i}</td>
                          <td width=\"5%\" colspan=\"2\" style=\"text-align:center\">".$argData->codigo."</td>
                          <td width=\"9%\" colspan=\"3\" style=\"text-align:center\">".$argData->denominacion."</td>
                          <td width=\"5%\" style=\"text-align:center\"></td>
                          <td width=\"5%\" style=\"text-align:center\">".$argData->almacenado."</td>
                          <td width=\"5%\" style=\"text-align:center\">".$argData->reserva."</td>
                          <td width=\"9%\" style=\"text-align:center\">".$argData->conservacion."</td>
                          <td width=\"2%\" style=\"text-align:center\">".$argData->bueno."</td>
                          <td width=\"4%\" style=\"text-align:center\">".$argData->regular."</td>
                          <td width=\"4%\" style=\"text-align:center\">".$argData->malo."</td>
                          <td width=\"5%\" style=\"text-align:center\">".$argData->total."</td>
                          <td width=\"3%\" style=\"text-align:center\">".$argData->categoria1."</td>
                          <td width=\"4%\" style=\"text-align:center\">".$argData->categoria2."</td>
                          <td width=\"3%\" style=\"text-align:center\">".$argData->categoria3."</td>
                          <td width=\"4%\" style=\"text-align:center\">".$argData->categoria4."</td>
                          <td width=\"5%\" style=\"text-align:center\">".$argData->categoria5."</td>
                           <td></td>
                        </tr>";


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
                      <td rowspan=\"2\" style=\"text-align:center\">&nbsp;".date('d')."</td>
                      <td rowspan=\"2\" style=\"text-align:center\">&nbsp;".date('m')."</td>
                      <td rowspan=\"2\" style=\"text-align:center\">&nbsp;".date('Y')."</td>
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