<?php

class PDFLimitaciones extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial','I',9);
        $this->Cell(150, 10, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'C');
        $this->Cell(0, 10, utf8_decode('P�gina '.$this->PageNo()), 0, 0, 'R');
    }
}


class ReporteLimitacionModel extends ZendExt_Model
{


    public function ReporteLimitacionModel()
    {
        parent::ZendExt_Model();

    }

    public function exportarLimitaciones($idestructura)
    {
        $pdf = new PDFLimitaciones('L', 'mm', 'letter');
        $pdf->AddPage();
        $pdfNGeneral = $this->crearCuerpo($pdf, $idestructura);
        $pdfNGeneral->Output();
    }


    private function crearCuerpo($pdf, $idestructura)
    {
        $pdf->SetFont('Arial', 'B', 13);
        $pdf->SetLeftMargin(15);
        $pdf->Cell(230, 10, utf8_decode("Limitaciones. Listado de trabajadores "), 0, 1, "C");

        $pdf->SetFont('Arial', 'B', 11);

        $obj = new DatLimitacionModel();
        $limitaciones=$obj->getLimitacion(null,15,0, $idestructura);
        $i = 1;
        $pdf->SetFillColor(230);
                $pdf->Cell(10, 10, "No. ", '1', 0, "C", 1);
                $pdf->Cell(30, 10, "No. Identidad ", '1', 0, "C", 1);
                $pdf->Cell(75, 10, "Nombre(s) y apellidos", '1', 0, "C", 1);
                $pdf->Cell(75, 10, "Causas", '1', 0, "C", 1);
                $pdf->Cell(30, 10, "Fecha desde", '1', 0, "C", 1);
                $pdf->Cell(30, 10, "Fecha hasta", '1', 1, "C", 1);

                       if ($limitaciones) {
                           $unidad='';
                           foreach ($limitaciones->data as $key=>$ue) {



                               if($unidad != $ue['ueb']){
                                   $pdf->SetFont('Arial', 'B', 11);
                                   $pdf->Cell(250, 10, utf8_decode($ue['ueb']), 1, 1, 'L');
                               }
                               $pdf->SetFont('Arial', '', 11);
                               $pdf->Cell(10, 10, $i, 1, 0, "C");
                               $pdf->Cell(30, 10, $ue['numid'], 1, 0, "C");
                               $pdf->Cell(75, 10, utf8_decode($ue['nombreyapellidos']), 1, 0, "C");
                               $pdf->Cell(75, 10, utf8_decode($ue['causa']), 1, 0, "C");
                               $pdf->Cell(30, 10, utf8_decode($ue['fdesde']), 1, 0, "C");
                               $pdf->Cell(30, 10, utf8_decode($ue['fhasta']), 1, 1, "C");
                               $i++;
                               $unidad=$ue['ueb'];


                           }

                       }

        return $pdf;
    }
}
