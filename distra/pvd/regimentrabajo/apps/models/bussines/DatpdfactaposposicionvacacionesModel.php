<?php
include 'PDF_MC_Table.php';

class PDFActaPosposicionVacaciones extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        //f$arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($datentidad->idestructura);
        $entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($datentidad->idestructura);
        $this->SetY(-15);
        $this->SetX(30);
        $this->SetFont('Arial', 'I', 7);
        $this->Cell(70, 10, utf8_decode($entidad[0]->denominacion . ' [' . $entidad[0]->abreviatura . ']'), 0, 0, 'L');
        $this->MultiCell(85, 5, "" . utf8_decode($entidad[0]->direccion . ' Teléfono: ' . $entidad[0]->telefono), 0, 'R', 0);
    }
}


class DatpdfactaposposicionvacacionesModel extends ZendExt_Model
{

    public function DatpdfactaposposicionvacacionesModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($result, $anno, $denomestructura, $fecha/*, $denEntAreas*/, $director,$seccionsindical,$regmodelovac/*,$denomarea*/)
    {
        $pdf = new PDFActaPosposicionVacaciones('P', 'mm', 'a4');
        foreach ($result as $k => $v) {
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['idarea']);
            if (!empty($v['ueb'])) {
                $ueb = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['ueb']);
                $result[$k]['area'] = $ueb[0]->denominacion;
            } else {
                $result[$k]['area'] = $area[0]->denominacion;
            }
            //$result[$k]['area'] = $denEntAreas[$result[$k]['idarea']]['denominacion'];
            $this->cabeceraReporte($pdf, $anno, $denomestructura, $fecha);
            $pdffinal = $this->cuerpoReporte($pdf, $result[$k], $anno, $denomestructura, $fecha, $director,$seccionsindical);
        }
        $this->crearEncabezadoPrincipal($pdf, $anno);
        $pdfNGeneral = $this->crearCuerpo($pdf, $regmodelovac/*,$denomarea*/);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $person, $anno, $denomestructura, $fecha, $director,$seccionsindical)
    {
        $pdf->SetLeftMargin(30);
        $pdf->SetFont('Arial', '', 10);
        $pdf->Ln(30);
        $datentidad = $_SESSION['Zeolides']['entidad'];
        try {
            $servicionomina = ZendExt_IoC::getInstance()->pvd->getDiasImpAcumuladosVacPersEntidad($person['idpersona'], $person['identidad']);
            if ($servicionomina->dias != 0) {
                $vacacumuladas = round($servicionomina->dias, 2);
            } else {
                $vacacumuladas = 0;
            }
        } catch (Exception $e) {
            $vacacumuladas = "";
        }
        $entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($person['identidad']);

        //$F = explode('/', $fecha);
        //$mes = $this->getMes($F[1]);
        $mes1 = date('m', strtotime('-1 month')) ;
        $mes = $this->getMes($mes1);
        $anno = date('Y');
        $dia = date('d');// print_r($dia);die;
        $pdf->MultiCell(155, 5, "" . utf8_decode("El trabajador ". $person['nombreapellidos'] . " con Carné de Identidad " . $person['noidentidad'] . ", que ocupa el cargo de " . $person['denomcargo'] . " en el área de " . $person['area'] . " del Bicsa y tiene un acumulado de " . $vacacumuladas . " días de vacaciones al cierre del mes de " . $mes . " del " . $anno . " . "), 0, 'J', 0);
        $pdf->MultiCell(155, 5, "" . utf8_decode("Por situaciones excepcionales que demandan su permanencia en el puesto de trabajo se le posponen las vacaciones planificadas por un período de " . '________________ .'), 0, 'J', 0);
        $pdf->SetX(143);
        $pdf->Ln(5);
        $pdf->MultiCell(155, 5, "" . utf8_decode("Si decursado el período máximo de posposición (90 días) se incumple con el acuerdo pactado y el trabajador no sale de vacaciones, se efectuará la liquidación en efectivo del tiempo que tenía pendiente al momento en que dichas vacaciones fueron pospuestas sin derecho al disfrute de las mismas, descontando de este el tiempo que hubiera disfrutado."), 0, 'J', 0);
        $pdf->Ln(5);
        $pdf->MultiCell(155, 5, "" . utf8_decode("Estando de acuerdo las partes interesadas, firman en el día " . $dia . " del mes de " . $mes . " año " . $anno . " . "), 0, 'J', 0);
        $pdf->Ln(20);

        /*$pdf->MultiCell(155, 5, "" . utf8_decode("El Artículo 107 de la Ley No. 116 Código del Trabajo establece que los períodos de vacaciones programadas se disfrutan dentro del año de trabajo. Si transcurrido el tiempo acumulado para disfrutar dichos períodos, surgen circunstancias excepcionales que demandan la permanencia del trabajador en su actividad, el empleador oído el criterio de la organización sindical, puede posponer su disfrute o acordar con el trabajador simultanear el cobro de las vacaciones acumuladas y el salario por el trabajo realizado, garantizando el descanso efectivo de siete días al año como mínimo. El trabajador y el empleador dejan constancia escrita de lo acordado."), 0, 'J', 0);
        $pdf->MultiCell(155, 5, "" . utf8_decode("Los días trabajados por esta razón acumulan tiempo y salarios a los fines del nuevo período vacacional."), 0, 'J', 0);
        $pdf->MultiCell(155, 5, "" . utf8_decode("Por lo antes expuesto y por necesidades imprescindibles de su trabajo, se le pospone las vacaciones a: "), 0, 'J', 0);
        $pdf->MultiCell(155, 5, "" . utf8_decode($person['nombreapellidos'] . " con Carné de Identidad " . $person['noidentidad'] . ", que tiene un acumulado de " . $vacacumuladas . " días de vacaciones al cierre del mes de " . $mes . " de " . $anno . " y que presta servicios como " . $person['denomcargo'] . " en el área " . $person['area'] . " del " . $entidad[0]->abreviatura) . ".", 0, 'J', 0);
        $pdf->Ln(5);
        $pdf->MultiCell(155, 5, "" . utf8_decode("Estando de acuerdo las partes interesadas, firman en el día de la fecha: "), 0, 'J', 0);
        $pdf->SetX(143);
        $pdf->Write(0, '________________ .');
        $pdf->Ln(30);*/

        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(60, 5, utf8_decode($director->nombrepersona), "T", 0, 'C', 0);
        $pdf->Cell(35, 5, "", 0, 0, 'C', 0);
        $pdf->Cell(60, 5, utf8_decode($seccionsindical->nombrepersona), "T", 0, 'C', 0);
        $pdf->Ln(5);
        $pdf->Cell(60, 5, utf8_decode($director->cargopersona), 0, 0, 'C', 0);
        $pdf->Cell(35, 5, "", 0, 0, 'C', 0);
        $pdf->Cell(60, 5, utf8_decode('Miembro de la Sección Sindical'), 0, 0, 'C', 0);
        $pdf->Ln(30);
        $pdf->Cell(45, 5, "", 0, 0, 'C', 0);
        $pdf->Cell(60, 5, utf8_decode($person['nombreapellidos']), "T", 0, 'C', 0);
        $pdf->Cell(45, 5, "", 0, 0, 'C', 0);
        $pdf->Ln(5);
        $pdf->Cell(45, 5, "", 0, 0, 'C', 0);
        $pdf->Cell(60, 5, 'Trabajador', 0, 0, 'C', 0);
        $pdf->Cell(45, 5, "", 0, 0, 'C', 0);

        return $pdf;
    }

    public function cabeceraReporte($pdf, $anno, $denomestructura, $fecha)
    {
        $pdf->SetLeftMargin(30);
        $pdf->AddPage();
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($datentidad->idestructura);
        $entidad = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad($datentidad->idestructura);
       if (!empty($entidad[0]->logo)) {
           $image = explode(';', $entidad[0]->logo);
           $extension = explode('/', $image[0]);
          $pdf->Image($entidad[0]->logo, 30, 20, 60, 20, $extension[1]);
      }

        // $F = explode('/', $fecha);
        // $mes = $this->getMes($F[1]);
        // $pdf->SetFont('Arial', '', 10);
        // $pdf->Text(30, 50, "" . utf8_decode("" . $F[0] . ' de ' . $mes . ' de ' . $F[2]));
        // $pdf->Ln(5);

        $pdf->SetFont('Arial', '', 10);
        $pdf->Text(130, 36, utf8_decode("Modelo 120-016"));
        $pdf->Text(130, 40, utf8_decode("Acta de Posposición de vacaciones"));
        $pdf->Ln(25);

        /*$pdf->SetFont('Arial', '', 10);
        $pdf->Text(75, 65, utf8_decode("Modelo 120-016"));
        $pdf->Text(75, 68, utf8_decode("Acta de Posposición de vacaciones"));
        $pdf->Ln(25);*/

        return $pdf;
    }

    private function crearCuerpo($pdf, $regmodelovac/*,$denomarea*/)
    {
        $pdf->SetLeftMargin(5);
        $pdf->SetFont('Arial', '', 6);
        $DAM = new DatAsistenciaModel();
        $denEntAreas = $DAM->GetDenomEntAreas($regmodelovac);
        foreach ($regmodelovac as $k => $v) {
            //$regmodelovac[$k]['area'] = $denEntAreas[$v['idarea']]['denominacion'];
            //$entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['identidad']);
            $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['idarea']);
            if (!empty($v['ueb'])) {
                $ueb = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['ueb']);
                $regmodelovac[$k]['area'] = /*$entidad[0]->denominacion.'->'.*/$ueb[0]->denominacion.'->'.
                    $area[0]->denominacion;
            } else {
                $regmodelovac[$k]['area'] = /*$entidad[0]->denominacion.'->'.*/$area[0]->denominacion;
            }
            //$regmodelovac[$k]['area'] = (is_numeric($v['idarea'])) ? $denomarea[$v['idarea']] : 'NO ASIGNADO A CARGO';
            $y = $pdf->GetY();
            if ($y >= '250') {
                $pdf->AddPage();
                $this->getEncabezado($pdf);
            }
            $pdf->Cell(5, 5, utf8_decode($k + 1), 1, 0, 'C', 0);
            $pdf->Cell(20, 5, $v['noidentidad'], 1, 0, '', 0);
            $pdf->Cell(45, 5, utf8_decode($v['nombreapellidos']), 1, 0, '', 0);
            $pdf->Cell(75, 5, utf8_decode($regmodelovac[$k]['area']), 1, 0, '', 0);
            $pdf->Cell(15, 5, '', 1, 0, 'C', 0);
            $pdf->Cell(20, 5, '', 1, 0, 'C', 0);
            $pdf->Cell(15, 5, '', 1, 0, 'C', 0);
            $pdf->Ln(5);
        }
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $anno)
    {
        $pdf->SetLeftMargin(5);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Ln(10);
        $pdf->Cell(200, 0, utf8_decode('REGISTRO DE ACTAS DE POSPOSICIÓN DE VACACIONES'), 0, 0, 'C', 0);
        $pdf->Ln(1);
        $pdf->Cell(200, 6, utf8_decode('AÑO ' . $anno), 0, 0, 'C', 0);
        $pdf->SetFillColor(200);
        $pdf->SetFont('Arial', 'B', 6);
        $pdf->Ln(10);
        $pdf->Cell(5, 5, utf8_decode('No'), 1, 0, 'C', 1);
        $pdf->Cell(20, 5, 'Carnet de identidad', 1, 0, 'C', 1);
        $pdf->Cell(45, 5, 'Nombres y apellidos', 1, 0, 'C', 1);
        $pdf->Cell(75, 5, utf8_decode('Área'), 1, 0, 'C', 1);
        $pdf->Cell(15, 5, 'Vence', 1, 0, 'C', 1);
        $pdf->Cell(20, 5, utf8_decode('Liquidación'), 1, 0, 'C', 1);
        $pdf->Cell(15, 5, 'Disfrute', 1, 0, 'C', 1);
        $pdf->Ln(5);
    }

    private function getEncabezado(&$pdf)
    {
        $pdf->SetLeftMargin(5);
        $pdf->SetFillColor(200);
        $pdf->SetFont('Arial', '', 6);
        $pdf->Ln(5);
        $pdf->Cell(5, 5, utf8_decode('No'), 1, 0, 'C', 1);
        $pdf->Cell(20, 5, 'Carnet de identidad', 1, 0, 'C', 1);
        $pdf->Cell(45, 5, 'Nombres y apellidos', 1, 0, 'C', 1);
        $pdf->Cell(75, 5, utf8_decode('Área'), 1, 0, 'C', 1);
        $pdf->Cell(15, 5, 'Vence', 1, 0, 'C', 1);
        $pdf->Cell(20, 5, utf8_decode('Liquidación'), 1, 0, 'C', 1);
        $pdf->Cell(15, 5, 'Disfrute', 1, 0, 'C', 1);
        $pdf->Ln(5);
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