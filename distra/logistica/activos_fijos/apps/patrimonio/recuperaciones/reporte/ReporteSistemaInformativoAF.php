<?php
class ReporteSistemaInformativoAF extends ElementsReport {

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
        $argField = 'modelo';
        return $this->CasePaperFormat(array(8, 8), array(8, 8), array(8, 8), array(8, 8));
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
                            <td colspan=\"3\"><strong>UM:</strong> {$this->generalData->entidad}</td>
                            <td colspan=\"13\"><div align=\"center\"><strong>SIRM 1</strong></div>      <div align=\"center\"><strong>INFORME SOBRE LA EXISTENCIA Y EL ESTADO T&Eacute;CNICO DE LOS ACTIVOS FIJOS TANGIBLES </strong></div></td>
                            <td colspan=\"4\" rowspan=\"2\"><div align=\"center\"><strong>&quot;CLASIFICACI&Oacute;N&quot;</strong></div></td>
                          </tr>

                          <tr>
                            <td colspan=\"7\">ESPECIALIDAD: {$this->generalData->especialidad}</td>
                            <td colspan=\"9\">PER&Iacute;ODO TERMINADO EN: </td>
                          </tr>
                          <tr>
                            <td width=\"2%\" rowspan=\"3\"><div align=\"center\">No.</div></td>
                            <td width=\"5%\" rowspan=\"3\"><div align=\"center\">CODIGO</div></td>
                            <td width=\"9%\" rowspan=\"3\"><div align=\"center\">NOMENCLATURA</div></td>
                            <td width=\"4%\" rowspan=\"3\"><div align=\"center\">MARCA</div></td>
                            <td width=\"5%\" rowspan=\"3\"><div align=\"center\">MODELO</div></td>
                            <td width=\"4%\" rowspan=\"3\"><div align=\"center\">FECHA DE FABRIC </div></td>
                            <td width=\"5%\" rowspan=\"3\"><div align=\"center\">LLEVA PP </div></td>
                            <td colspan=\"7\"><div align=\"center\">EXISTENCIAS</div>      <div align=\"center\"></div>      <div align=\"center\"></div>      <div align=\"center\"></div>      <div align=\"center\"></div>      <div align=\"center\"></div>      <div align=\"center\"></div></td>
                            <td colspan=\"5\" rowspan=\"2\"><div align=\"center\">TOTAL POR CATEGOR&Iacute;A </div>      <div align=\"center\"></div>      <div align=\"center\"></div>      <div align=\"center\"></div>      <div align=\"center\"></div></td>
                            <td width=\"9%\" rowspan=\"3\"><div align=\"center\">SE NECESITA </div></td>
                          </tr>
                          <tr>
                            <td width=\"4%\" rowspan=\"2\">ALMAC.</td>
                            <td width=\"5%\" rowspan=\"2\">RESERV.</td>
                            <td width=\"9%\" rowspan=\"2\">CONSERVACI&Oacute;N</td>
                            <td colspan=\"3\"><div align=\"center\">EN USO O EXPLOT. </div></td>
                            <td width=\"5%\" rowspan=\"2\"><div align=\"center\">TOTAL</div></td>
                          </tr>
                          <tr>
                            <td width=\"3%\"><div align=\"center\">B</div></td>
                            <td width=\"2%\"><div align=\"center\">R</div></td>
                            <td width=\"3%\"><div align=\"center\">M</div></td>
                            <td width=\"5%\"><div align=\"center\">I</div></td>
                            <td width=\"4%\"><div align=\"center\">II</div></td>
                            <td width=\"5%\"><div align=\"center\">III</div></td>
                            <td width=\"6%\"><div align=\"center\">IV</div></td>
                            <td width=\"6%\"><div align=\"center\">V</div></td>
                          </tr>";
        return $encabezado;
    }

    public function RowValues($j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $i = 1) {

            $TR .= "<tr>
                        <td style=\"text-align:center\">{$i}</td>
                        <td style=\"text-align:center\">".$argData->codigo."</td>
                        <td style=\"text-align:center\">".$argData->denominacion."</td>
                        <td style=\"text-align:center\">".$argData->marca."</td>
                        <td style=\"text-align:center\">".$argData->modelo."</td>
                        <td style=\"text-align:center\">".$argData->annofabricacion."</td>
                        <td></td>
                        <td style=\"text-align:center\">".$argData->almacenado."</td>
                        <td style=\"text-align:center\">".$argData->reserva."</td>
                        <td style=\"text-align:center\">".$argData->conservacion."</td>
                        <td style=\"text-align:center\">".$argData->bueno."</td>
                        <td style=\"text-align:center\">".$argData->regular."</td>
                        <td style=\"text-align:center\">".$argData->malo."</td>
                        <td style=\"text-align:center\">".$argData->total."</td>
                        <td style=\"text-align:center\">".$argData->categoria1."</td>
                        <td style=\"text-align:center\">".$argData->categoria2."</td>
                        <td style=\"text-align:center\">".$argData->categoria3."</td>
                        <td style=\"text-align:center\">".$argData->categoria4."</td>
                        <td style=\"text-align:center\">".$argData->categoria5."</td>
                        <td></td>
                      </tr>";
            /*if ($j == 0) {
                $TR .= "<tr>
                          <td width=\"3%\" rowspan=\"3\" style=\"text-align:center\"></td>
                          <td width=\"5%\" rowspan=\"3\" style=\"text-align:center\">$argData->codigo</td>
                          <td width=\"9%\" rowspan=\"3\" style=\"text-align:center\"></td>
                          <td width=\"5%\" rowspan=\"3\" style=\"text-align:center\"></td>
                          <td width=\"6%\" rowspan=\"3\" style=\"text-align:center\"></td>
                          <td width=\"5%\" rowspan=\"3\" style=\"text-align:center\"></td>
                          <td width=\"5%\" rowspan=\"3\" style=\"text-align:center\"></td>
                          <td width=\"5%\" rowspan=\"2\"></td>
                          <td width=\"5%\" rowspan=\"2\"></td>
                          <td width=\"9%\" rowspan=\"2\"></td>
                          <td width=\"2%\" style=\"text-align:center\"></td>
                          <td width=\"4%\" style=\"text-align:center\"></td>
                          <td width=\"4%\" style=\"text-align:center\"></td>
                          <td width=\"5%\" rowspan=\"2\" style=\"text-align:center\"></td>
                          <td width=\"3%\" style=\"text-align:center\"></td>
                          <td width=\"4%\" style=\"text-align:center\"></td>
                          <td width=\"3%\" style=\"text-align:center\"></td>
                          <td width=\"4%\" style=\"text-align:center\"></td>
                          <td width=\"5%\" style=\"text-align:center\"></td>
                          <td width=\"9%\" rowspan=\"3\" style=\"text-align:center\"></td>
                        </tr>";
           
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