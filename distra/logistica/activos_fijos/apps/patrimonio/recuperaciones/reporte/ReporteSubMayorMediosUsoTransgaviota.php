<?php

class ReporteSubMayorMediosUsoTransgaviota extends ElementsReport
{
    public function __construct()
    {
        $global = ZendExt_GlobalConcept::getInstance();

        $this->fieldName = 'nroserie';        
        $dirImg = '/logistica/utiles/configuracion/views/images/configuraciongeneral/getlogo.jpg';


        $this->gTitle
            = '
        <table width="98%" border="0">
          <tr>
            <td width="95" rowspan="2"><img src="' . $dirImg . '" width="86" height="80" /></td>
            <td width="80%" height="15">'
            . '<p style="margin-left: 10px; margin-top: 10px; font-family: Arial, Helvetica, sans-serif; font-weight: bold; font-size:14px">_entidad_</p>'
            . '<p style="margin-left: 10px; margin-top: 10px; font-family: Arial, Helvetica, sans-serif; font-weight: bold; font-size:13px">Listado de medios / Acta de responsabilidad</p>'
            . '</tr>
          <tr>
            <td width="100%">
              <p align="right" style="margin: 10px; margin-top: 0px; font-family: Arial, Helvetica, sans-serif; font-size:10px"><strong></strong></p></td>
          </tr>
        </table>
        ';

        $this->textPageBreak = '<b>Total:</b>';
    }

    public function NumberRowsPaperFormat()
    {
        return $this->CasePaperFormat(array(30, 41), array(30, 42), array(30, 59), array(30, 62));
    }

    public function LengthStringPaperFormat()
    {
        return $this->CasePaperFormat(array(21, 22), array(26, 18), array(30, 17), array(30, 17));
    }

    public function GetHeadTable(& $PAINTEDROWS, $argArrayBodyData, $argPageCount, & $argArrayColumns)
    {
        return $this->GetHtmlHeadTable(
            $PAINTEDROWS, $argArrayBodyData, $this->generalData, $argPageCount
        );
    }

    public function GetHtmlHeadTable(& $PAINTEDROWS, $argArrayBodyData, $generalData, $PAGECOUNT)
    {
        $this->gTitle = str_replace('_entidad_', $generalData->entidad, $this->gTitle);

        return "
             <p align='right' style='margin-left: 10px; margin-top: 10px; font-family: Arial, Helvetica, sans-serif; font-weight: bold; font-size:12px'>N.<sup>o</sup> $PAGECOUNT</p> <!-- Numero de la pagina-->
            $this->gTitle

            <table width='98%' border='0' cellspacing='0' cellpadding='1' style='margin-left: 1px; margin-top: 1px; font-family: Arial, Helvetica, sans-serif; font-size:11px'>
                <tr style='font-weight: bold; font-size:12px'>
                    <td align='center'>N.<sup>o</sup></td>
                    <td align='left'>Tipo</td>
                    <td align='center'>Marca - modelo</td>
                    <td align='left'>N.<sup>o</sup> inventario</td>
                    <td align='center'>N.<sup>o</sup> registro</td>
                    <td align='center'>V. contable</td>
                    <td align='center'>D. acumulada</td>
                    <td align='center'>Estatus t&eacute;cnico
                    <td align='center'>Estructura</td>
                    <td align='center'>&Aacute;rea resp</td>
                    <td align='center'>Responsable</td>
               </tr>
            ";
    }

    public function RowValues(
        $j, $TR_TEXT, & $TR, $argData, & $FORMATPESOCOLUMNS, $keepCero, $argArrayColumns, $ENDPAGE, $pos = 1
    ) {

        $marcaModelo = '';
        if (strlen($argData->marca)) {
            $marcaModelo = $argData->marca;
        }

        if (strlen($argData->modelo) && strlen(marcaModelo)) {
            $marcaModelo .= ' - ' . $argData->modelo;
        }

        ($j == 0)
            ? $TR .= "<tr>
            <td align='center'>{$pos}</td>
            <td align='left'>$argData->denominacion</td>
            <td align='left'>$marcaModelo</td>
            <td align='center'>$argData->nroinventario</td>
            <td align='left'>&$argData->nroserie</td>
            <td align='center'>$argData->valorcontable&nbsp;</td>
            <td align='center'>$argData->depreciacionacumulada&nbsp;</td>
            <td align='center'>$argData->estado</td>
            <td align='left'>$argData->entidad</td>
            <td align='center'>$argData->arearesponsabilidad</td>
            <td align='center'>$argData->responsable</td>
            </tr>"
            : $TR
            .= "
            <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            </tr>";
    }

    public function GetBlankRows($argArrayColumns)
    {
        return "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
    }

    public function GetHtmlValues($argArrayBodyData, $agHeader, $TRBODYTABLE)
    {
        return $this->GetHTMLBodyFormat($agHeader, $this->GetBodyTable($TRBODYTABLE));
    }
}

?>