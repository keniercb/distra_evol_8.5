<?php
include 'PDF_MC_Table.php';
class PDFPlanVacaciones extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($datentidad->idestructura);
        $this->SetY(-15);
        $this->SetFont('Arial','I',7);
        $this->Cell(70, 10, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        if(!empty($arrEstruct[0]->direccion)){
            $this->MultiCell(0, 5, "". utf8_decode($arrEstruct[0]->direccion),0,'R',0);
            $this->Cell(0, 5, utf8_decode(' Teléfono: '.$arrEstruct[0]->telefono), 0, 0, 'R');
        }else{
            $this->Cell(100, 10, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'R');
            $this->Cell(0, 10, utf8_decode('Página '.$this->PageNo()), 0, 0, 'R');
        }

    }
}


class DatpdfplanvacacionesModel extends ZendExt_Model
{

    public function DatpdfplanvacacionesModel()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte($result,$anno,$denomestructura,$fecha,$areas)
    {
        $pdf = new PDFPlanVacaciones('L', 'mm','a4'
            /*'A3'*/);
        $pdf->AddPage();
        $pdffinal = $this->cabeceraReportePrincipal($pdf, $anno,$denomestructura,$fecha);
        $pdffinal = $this->cuerpoReporte($pdf, $result, $anno,$denomestructura,$fecha,$areas);
        ob_clean();
        $pdffinal->Output();
    }

    public function cuerpoReporte($pdf, $result, $anno,$denomestructura,$fecha,$areas)
    {
        $cont = 1;
        foreach ($areas as $j => $val) {
            $pdf->SetX(5);
            $pdf->SetFont('Arial', '', 7);
            $pdf->Cell(273, 5, "" . utf8_decode("" . $val), 1, 1, "",true);
            foreach ($result as $i => $datos) {
                if ($val == $datos['area']) {
                    $pdf->SetFont('Arial', '', 7);
                    $y = $pdf->GetY();
                    if ($y >= '185') {
                        $pdf->AddPage();
                        $this->cabeceraReporte($pdf, $anno, $denomestructura, $fecha);
                    }
                    $pdf->SetX(5);
                    $pdf->Cell(50, 5, "" . utf8_decode("" . $datos['nombreapellidos']), 1, 0, "");

                    $pdf->SetX(55);
                    $pdf->Cell(15, 5, "" . utf8_decode("" . $datos['vacacumuladas']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinenero']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinenero']), 1, 0, "");

                    $pdf->SetX(86);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinfebrero']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinfebrero']), 1, 0, "");

                    $pdf->SetX(102);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinmarzo']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinmarzo']), 1, 0, "");

                    $pdf->SetX(118);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinabril']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinabril']), 1, 0, "");

                    $pdf->SetX(134);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinmayo']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinmayo']), 1, 0, "");

                    $pdf->SetX(150);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinjunio']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinjunio']), 1, 0, "");

                    $pdf->SetX(166);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinjulio']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinjulio']), 1, 0, "");

                    $pdf->SetX(182);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinagosto']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinagosto']), 1, 0, "");

                    $pdf->SetX(198);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinseptiembre']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinseptiembre']), 1, 0, "");

                    $pdf->SetX(214);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinoctubre']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinoctubre']), 1, 0, "");

                    $pdf->SetX(230);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquinnoviembre']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquinnoviembre']), 1, 0, "");

                    $pdf->SetX(246);
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['priquindiciembre']), 1, 0, "");
                    $pdf->Cell(8, 5, "" . utf8_decode("" . $datos['segquindiciembre']), 1, 0, "");

                    $pdf->SetX(262);
                    $pdf->Cell(16, 5, " ", 1, 0, "");

                    $pdf->Ln(5);
                    $cont++;
                }
            }
        }
        $pdf->Ln(30);
        $pdf->SetX(30);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Cell(70, 5, utf8_decode('Autorizado'), "T", 0, 'C', 0);
        $pdf->Cell(90, 5, "", 0, 0, 'C', 0);
        $pdf->Cell(70, 5, utf8_decode('Aprobado'), "T", 0, 'C', 0);
        $pdf->Ln(5);


        return $pdf;
    }

    public function cabeceraReportePrincipal($pdf, $anno,$denomestructura,$fecha)
    {
        $datentidad = $_SESSION['Zeolides']['entidad'];
//        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($datentidad->idestructura);
       /* if(!empty($arrEstruct[0]->logo)){
            $image = explode(';',$arrEstruct[0]->logo);
            $extension = explode('/',$image[0]);
            $pdf->Image($arrEstruct[0]->logo,110,10,90,20,$extension[1]);
        }*/
        $pdf->Ln(10);

        $pdf->SetFont('Arial', 'B', 10);
        $pdf->Text(130, 20, "PLAN DE VACACIONES DEL ".$anno);
        $pdf->Ln(10);

        $F = explode('/',$fecha);
        $mes = $this->getMes($F[1]);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Text(5, 35, "" . utf8_decode("" . $F[0].' de '.$mes.' de '.$F[2]));
        $pdf->Ln(10);

        $pdf->SetFont('Arial', '', 10);
        $pdf->Text(5, 43, "" . utf8_decode("Entidad: " . ($datentidad->abreviatura)?$datentidad->abreviatura:$datentidad->denominacion));
        $pdf->Ln(15);

        $pdf->SetFont('Arial', 'B', 7);

        $pdf->SetX(5);
        $pdf->SetFillColor(200);
        $pdf->Cell(50, 10, "Nombre y apellidos", 1, 0, "C",true);
        $pdf->Cell(15, 5, "Vacaciones", 'T', 0, "C",true);

        $pdf->Cell(16, 5, "Enero", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Febrero", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Marzo", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Abril", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Mayo", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Junio", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Julio", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Agosto", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Septiembre", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Octubre", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Noviembre", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Diciembre", 1, 0, "C",true);
        $pdf->Cell(16, 10, "Firma", 1, 0, "C",true);

        $pdf->Ln(5);
        $pdf->SetX(55);
        $pdf->Cell(15, 5, "acumuladas", 'B', 0, "C",true);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(86);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(102);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(118);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(134);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(150);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(166);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(182);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(198);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(214);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(230);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(246);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->Ln(5);
        $pdf->SetFont('Arial', '', 7);

        return $pdf;
    }

    public function cabeceraReporte($pdf, $anno,$denomestructura,$fecha)
    {
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 7);
        $pdf->SetX(5);
        $pdf->SetFillColor(200);
        $pdf->Cell(50, 10, "Nombre y apellidos", 1, 0, "C",true);
        $pdf->Cell(15, 5, "Vacaciones", 'T', 0, "C",true);

        $pdf->Cell(16, 5, "Enero", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Febrero", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Marzo", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Abril", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Mayo", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Junio", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Julio", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Agosto", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Septiembre", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Octubre", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Noviembre", 1, 0, "C",true);
        $pdf->Cell(16, 5, "Diciembre", 1, 0, "C",true);
        $pdf->Cell(16, 10, "Firma", 1, 0, "C",true);

        $pdf->Ln(5);
        $pdf->SetX(55);
        $pdf->Cell(15, 5, "acumuladas", "B", 0, "C",true);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(86);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(102);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(118);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(134);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(150);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(166);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(182);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(198);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(214);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(230);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->SetX(246);
        $pdf->Cell(8, 5, "1ra", 1, 0, "C",true);
        $pdf->Cell(8, 5, "2da", 1, 0, "C",true);

        $pdf->Ln(5);
        $pdf->SetFont('Arial', '', 7);

        return $pdf;
    }

    private function getMes($mesnum)
    {
        if ($mesnum == 1) {
            return 'Enero';
        } else if ($mesnum == 2) {
            return 'Febrero';
        } else if ($mesnum == 3) {
            return 'Marzo';
        } else if ($mesnum == 4) {
            return 'Abril';
        } else if ($mesnum == 5) {
            return 'Mayo';
        } else if ($mesnum == 6) {
            return 'Junio';
        } else if ($mesnum == 7) {
            return 'Julio';
        } else if ($mesnum == 8) {
            return 'Agosto';
        } else if ($mesnum == 9) {
            return 'Septiembre';
        } else if ($mesnum == 10) {
            return 'Octubre';
        } else if ($mesnum == 11) {
            return 'Noviembre';
        } else if ($mesnum == 12) {
            return 'Diciembre';
        } else {
            return '';
        }
    }
}