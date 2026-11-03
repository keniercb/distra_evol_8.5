<?php

class JSONAPA extends fpdf
{

}


class DatjsonAPAModel extends ZendExt_Model
{

    public function DatjsonAPAModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($result)
    {
        $pdf = new JSONAPA('P', 'mm', 'A4');
        $pdf->AddPage();
        $pdffinal = $this->cuerpoReporte($pdf, $result);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $result)
    {
        $pdf->SetFont('Arial', '', 7);
        $pdf->MultiCell(185, 5, "" . utf8_decode($result), 0, 'J', 0);
        return $pdf;
    }

}