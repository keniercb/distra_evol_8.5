<?php

class ReporteSistemaInformativoSIRM4 extends ElementsReport {

    private $estructura;

    public function __construct() {
        $global = ZendExt_GlobalConcept::getInstance();
        $this->fieldName = 'denominacion';
        $this->estructura = $global->Estructura->idestructura;
    }

    public function NumberRowsPaperFormat() {
        return $this->CasePaperFormat(array(10, 10), array(10, 10), array(10, 10), array(10, 10));
    }

    public function LengthStringPaperFormat($argField) {
        $argField = 'marca';
        return $this->CasePaperFormat(array(17, 17), array(17, 17), array(17, 17), array(17, 17));
    }

 
    public function GetHeadTable(& $PAINTEDROWS, $argArrayBodyData, $argPageCount, & $argArrayColumns) {
        return $this->GetHtmlHeadTable(
                        $PAINTEDROWS, $argArrayBodyData, $this->generalData->trimestre, $this->generalData->diaf, $this->generalData->mesf, $this->generalData->anno, $argPageCount
        );
    } 

    public function GetHtmlHeadTable(& $PAINTEDROWS, $argArrayBodyData, $TRIMESTRE, $DIA, $MES, $ANNO, $PAGECOUNT) {
        /*print_r($argArrayBodyData);
        print_r($this->generalData);die;*/
        $fecha = date('d/m/Y');
        $encabezado = "<table width=\"100%\" border=\"1\" style='position:relative; border-collapse:collapse; border-spacing:0px; font-size:10pt;  margin: 0 0 0 -20px'>
                     <tr>
                        <td colspan=\"2\" align=\"LEFT\"><strong>UM:</strong> {$this->generalData->entidad}</td>
                        <td colspan=\"6\" style=\"text-align:center\"><p class=\"style\"><strong>SIRM 4</strong></p>
                        <p><strong>INFORME SOBRE LOS MOVIMIENTOS DE LAS EXISTENCIAS</strong></p></td>
                        <td colspan=\"3\" style=\"text-align:center\"><strong>&quot;CLASIFICACI&Oacute;N&quot;</strong></td>
                      </tr>
                      <tr>                       
                        <td colspan=\"11\" align=\"LEFT\">Periodo terminado en: {$this->generalData->fechafin}</td>
                      </tr>
                      <tr>                       
                        <td width=\"6%\" rowspan=\"2\" style=\"text-align:center\">Código</td>
                         <td width=\"13%\" rowspan=\"2\" style=\"text-align:center\">Descripción</td>
                         <td colspan=\"2\" style=\"text-align:center\">Datos de producción</td>
                         <td width=\"14%\" rowspan=\"2\" style=\"text-align:center\">Existencias al inicio del período</td>
                         <td colspan=\"2\" width=\"8%\" style=\"text-align:center\">Movimientos</td>
                         <td width=\"10%\" rowspan=\"2\" style=\"text-align:center\">Existencia al final del período</td>
                         <td width=\"10%\" rowspan=\"2\" style=\"text-align:center\">Consumo</td>
                         <td colspan=\"2\" width=\"10%\" style=\"text-align:center\">Pérdidas Naturales</td>
                      </tr>
                      <tr>
                        <td width=\"8%\" style=\"text-align:center\">Partida</td>
                        <td width=\"5%\" style=\"text-align:center\">Año</td>
                        <td width=\"4%\" style=\"text-align:center\">Entradas</td>
                        <td width=\"4%\" style=\"text-align:center\">Salidas</td>
                        <td width=\"10%\" style=\"text-align:center\">De Exist. Cons.</td>
                        <td width=\10%\" style=\"text-align:center\">De Exist. Reserv.</td> 
                      </tr>";

        return $encabezado;
    }

    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $i = 1) {

        $TR .= "<tr>
                          <td width=\"13%\" style=\"text-align:center\">$argData->codigo</td>
                          <td width=\"8%\" style=\"text-align:center\">$argData->denominacion $argData->marca $argData->modelo</td>
                          <td width=\"5%\" style=\"text-align:center\"></td>
                          <td width=\"14%\" style=\"text-align:center\">$argData->annofabricacion</td>
                          <td width=\"9%\" style=\"text-align:center\">$argData->existenciainicio</td>
                          <td width=\"9%\" style=\"text-align:center\">$argData->cantidadentrada</td>
                          <td width=\"13%\"  style=\"text-align:center\">$argData->cantidadsalida</td>
                          <td width=\"10%\" style=\"text-align:center\">$argData->existenciafin</td>
                          <td width=\"6%\" style=\"text-align:center\"></td>
                          <td width=\"7%\" style=\"text-align:center\"></td>
                          <td width=\"7%\" style=\"text-align:center\"></td>
                        </tr>";



        /*

        if (!$this->Match($TR_TEXT, '<#break#>')) {
            if ($j == 0) {
                $TR .= "<tr>
                          <td width=\"6%\" style=\"text-align:center\">Código</td>
                          <td width=\"13%\" style=\"text-align:center\">Descripción</td>
                          <td width=\"8%\" style=\"text-align:center\">Partida</td>
                          <td width=\"5%\" style=\"text-align:center\">Año</td>
                          <td width=\"14%\" style=\"text-align:center\">Existencias al inicio del período</td>
                          <td width=\"9%\" style=\"text-align:center\">Entradas</td>
                          <td width=\"9%\" style=\"text-align:center\">Salidas</td>
                          <td width=\"13%\"  style=\"text-align:center\">Existencia al final del período</td>
                          <td width=\"10%\" style=\"text-align:center\">Consumo</td>
                          <td width=\"6%\" style=\"text-align:center\">De Exist. Cons.</td>
                          <td width=\7%\" style=\"text-align:center\">De Exist. Reserv.</td> 
                        </tr>";
            } else {
                $TR .= "<tr>                            
                          <td width=\"6%\" style=\"text-align:center\"></td>
                          <td width=\"13%\" style=\"text-align:center\"></td>
                          <td width=\"8%\" style=\"text-align:center\"></td>
                          <td width=\"5%\" style=\"text-align:center\"></td>
                          <td width=\"14%\" style=\"text-align:center\"></td>
                          <td width=\"9%\" style=\"text-align:center\"></td>
                          <td width=\"9%\" style=\"text-align:center\"></td>
                          <td width=\"13%\"  style=\"text-align:center\"></td>
                          <td width=\"10%\" style=\"text-align:center\"></td>
                          <td width=\"6%\" style=\"text-align:center\"></td>
                          <td width=\7%\" style=\"text-align:center\"></td> 
              </tr>";
            }
        }*/
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