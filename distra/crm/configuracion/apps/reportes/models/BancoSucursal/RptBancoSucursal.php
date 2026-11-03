<?php

class RptBancoSucursal extends ElementsReport
{

    private $pageCount = 0;

    public function __construct()
    {
        $this->gTitle = "NOMENCLADOR DE BANCO Y SUCURSAL";
        $this->fieldName = 'nombre';
    }

    public function GetBlankRows($argArrayColumns)
    {
        return "<tr><td>&nbsp;</td><td colspan=\"5\">&nbsp;</td></tr>";
    }

    public function GetHeadTable(&$painteDrows, $argArrayBodyData, $argPageCount, &$argArrayColumns)
    {
        $this->pageCount = $argPageCount;
        return $this->GetHtmlHeadTable($this->generalData);
    }

    public function GetFootTable()
    {
        return "<table style='font-size:10pt; position:relative; border-collapse:collapse; border-spacing:0px;
                width:100%;'><tr style='text-align:right;'><td>$this->pageCount</td></tr></table>";
    }

    public function GetHtmlValues($argArrayBodyData, $agHeader, $trBodyTable)
    {
        return $this->GetHTMLBodyFormat($agHeader, $this->GetBodyTable($trBodyTable), $this->GetFootTable());
    }

    public function NumberRowsPaperFormat()
    {
        return $this->CasePaperFormat(array(31, 45), array(30, 43), array(33, 55), array(32, 60));
    }

    public function LengthStringPaperFormat()
    {
        return $this->CasePaperFormat(array(150, 110), array(150, 110), array(150, 110), array(150, 110));
    }

    public function RowValues($j, $trText, &$tr, $argData, &$formatPesoColumns, $keepCero, $argArrayColumns, $endPage)
    {
        if($argData->direccion == 'BANCO: '){
            $tr .= "<tr><td colspan=\"5\" style='text-align:left;border-bottom:1px solid !important; font-weight: bold;'>" . $argData->direccion . $argData->codigo. " ". $trText
                . "</td></tr>";
        }elseif($argData->direccion == 'SUCURSAL'){
            $tr .= "<tr><td colspan=\"5\" style='text-align:center;border-bottom:1px solid !important; font-weight: bold;'>" . $argData->direccion
                . "</td></tr>";
        }elseif($argData->direccion == 'DIRECCI&Oacute;N'){
            $tr .= "<tr>
                  <td colspan=\"1\" style='text-align:left; border-bottom:1px solid !important; font-weight: bold;'>
                  N&Uacute;MERO</td>
                  <td colspan=\"4\" style='text-align:left; border-bottom:1px solid !important; font-weight: bold;'>
                  DIRECCI&Oacute;N</td>
                </tr>";
        }else{
            $tr .= "<tr><td colspan=\"1\" style='text-align:left;'>" . $argData->numero
                . "</td><td colspan=\"4\" style='text-align:left;'>" . $argData->direccion
                . "</td></tr>";
        }

        /*if($trText != '&nbsp'){
            $tr .= "<tr><td colspan=\"1\" style='text-align:left;border-bottom:1px solid !important;'>" . $argData->codigo
                . "</td><td colspan=\"1\" style='text-align:left;border-bottom:1px solid !important;'>" . $trText
                . "</td>";
            $tr .= "<td colspan=\"1\" style='text-align:left;'>" . $argData->numero
                . "</td><td colspan=\"2\" style='text-align:left;'>" . $argData->direccion
                . "</td></tr>";
        }else{
            $tr .= "<tr><td colspan=\"1\" style='text-align:left;'>" . $argData->codigo
                . "</td><td colspan=\"1\" style='text-align:left;'>" . $trText
                . "</td>";
            $tr .= "<td colspan=\"1\" style='text-align:left;border-bottom:1px solid !important;'>" . $argData->numero
                . "</td><td colspan=\"2\" style='text-align:left;border-bottom:1px solid !important;'>" . $argData->direccion
                . "</td></tr>";
        }*/
    }

    public function GetHtmlHeadTable($gData)
    {
        $utf8 = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò", "ù" => "Ù", "á" => "Á", "é" => "É", "í" => "Í",
                      "ó" => "Ó", "ú" => "Ú", "â" => "Â", "ê" => "Ê", "î" => "Î", "ô" => "Ô", "û" => "Û", "ç" => "Ç");
        return "<table style='font-size:10pt; position:relative; border-collapse:collapse; border-spacing:0px;
        width:100%;'>
                <tr>
                <td colspan=\"5\" style='font-size:13pt; text-align:center; font-weight: bold;'>$this->gTitle</td></tr>
                <tr>
                  <td colspan=\"4\" style='font-size:11pt; text-align:left;'><b>ENTIDAD:</b> " . strtr(
            strtoupper($gData->Entidad), $utf8
        ) . "</td>
                  <td style='font-size:11pt; text-align:left;'><b>FECHA IMPRESI&Oacute;N: </b> $gData->fechaactual</td>
                </tr><tr rowspan=\"2\"><td colspan=\"5\">&nbsp;</td></tr>
                ";
    }

}