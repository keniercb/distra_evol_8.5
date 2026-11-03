<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDF extends FPDF
{
    function Footer()
    {

    }
}

class ReporteSituacExcepEstaModel extends ZendExt_Model
{


    public function ReporteSituacExcepEstaModel()
    {
        parent::ZendExt_Model();

    }

    public function exportarSituacExcepE($filters, $idestructura)
    {
        $pdf = new PDF('L', 'mm', 'a3');
        $pdf->AddPage();
        $this->crearCuerpo($pdf, $filters, $idestructura);
        $pdf->Output();
    }


    private function crearCuerpo(&$pdf, $filters, $idestructura)
    {
//print_r($filters);die;
        $pdf->SetFont('Arial', 'B', 13);
        $pdf->SetLeftMargin(10);
        $pdf->Cell(560, 10, utf8_decode("Situaciones excepcionales. Resumen estadístico "), 0, 1, "C");

        $pdf->SetFont('Arial', 'B', 11);
        if (count($filters)) {
            if ($filters[0]->value != '') {
                $idestructura = $filters[0]->value;
            }
        } else {
            $idestructura = $idestructura;
        }

        $obj = new NomSituacexcepModel();
        $objNomCargoexcepModel = new NomCargoexcepModel();
        $estructsituacexcep = $obj->getSituacExcep($filters[1]->value, null, null, null);
        $cargos = $objNomCargoexcepModel->getCargoExcep($filters[2]->value, null, null, null);

        $objNomSituacexcep = new NomSituacexcep();
        $DatSituacexcepModel = new DatSituacexcepModel();
        $ueb = $objNomSituacexcep->getEntidad($idestructura);

        //Definiendo ancho columnas
        $width = $this->width(count($ueb));

        $pdf->SetFillColor(230);
        $arrtotal = [];
        foreach ($estructsituacexcep->data as $key => $cat) {
            $pdf->SetFont('Arial', 'B', 11);

            if ($ueb) {
                $pdf->Cell(80, 10, utf8_decode("Estructura:" . utf8_decode($cat['denominacion'])), 0, 1, 'L');
                $pdf->Cell(70, 65, utf8_decode("Cargo"), 1, 0, 'C', 1);
                foreach ($ueb as $ue) {
                    $totalueb = 0;
                    $pdf->SetFont('Arial', 'B', 11);
                    $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($ue['idestructura']);
                    $denominacion = (strlen($estruc[0]->denominacion) > 25) ? substr($estruc[0]->denominacion, 0, 25) . "..." : $estruc[0]->denominacion;

                    $this->addVerticalColumn($pdf, 65, $denominacion, 2, 2, $width['widthueb']);
                }


                $this->addVerticalColumn($pdf, 65, "Total", 2, 2, 9);
                $pdf->Cell(1, 65, "", 0, 1, "L");
                //$pdf->SetY(95);
                $pdf->SetFont('Arial', '', 11);

                foreach ($cargos->data as $k => $pant) {
                    $pdf->Cell(70, 10, utf8_decode($pant['denominacion']), 1, 0, "L");
                    $totalueb = 0;
                    foreach ($ueb as $u => $ue) {
                        $cant = 0;
                        $objDatServalimentacion = new DatServalimentacionModel();

                        $cargose = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);
                        foreach ($cargose as $carg) {
                            $arrcargos[] = $carg['idcargo'];
                        }

                        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);
                        //   print_r($persona);
                        if ($persona->quantity != 0) {
                            foreach ($persona->data as $a => $p) {
                                $serali = $DatSituacexcepModel->getSituacExcep(array($p['idpersona']), null, null, $filters[1]->value, $filters[2]->value);
                                if (count($serali->data) != 0) {
                                    if ($serali->data[0]['idevento'] == $cat['idevento'] && $serali->data[0]['idestalimentacion'] == $pant['idestalimentacion']) {
                                        $cant++;
                                    }
                                }
                            }
                        }
                        $totalueb += $cant;
                        $pdf->SetFont('Arial', '', 11);
                        $pdf->Cell(2 * $width['widthueb'], 10, $cant, 1, 0, "L");
                        $arrtotal[$u]['t'] += $cant;
                        $arrtotal[$u]['tt'] += $totalueb;

                    }
                    $pdf->Cell(18, 10, $totalueb, 1, 1, "L");

                }
                $pdf->SetFont('Arial', 'B', 11);
                $pdf->Cell(70, 10, "Total", 1, 0, "L", 1);
                foreach ($arrtotal as $ar) {
                    $pdf->Cell(2 * $width['widthueb'], 10, $ar['t'], 1, 0, "L");
                }
                $pdf->Cell(18, 10, $ar['tt'], 1, 0, "L");
                $pdf->Ln(12);
            } else {
                $pdf->SetLeftMargin(30);
                $pdf->Cell(80, 10, utf8_decode("Estructura:" . utf8_decode($cat['denominacion'])), 0, 1, 'L');
                $pdf->Cell(200, 10, utf8_decode("Cargo"), 1, 0, 'L', 1);
                $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
                $pdf->Cell(250, 10, utf8_decode($estruc[0]->denominacion), 1, 0, 'L', 1);
                $pdf->Cell(50, 10, "Total", 1, 1, "L", 1);
                $totalueb = 0;
                $pdf->SetFont('Arial', '', 11);
                foreach ($cargos->data as $k => $pant) {
                    $pdf->Cell(200, 10, utf8_decode($pant['denominacion']), 1, 0, "L");
                    $cant = 0;
                    $totalcargo=0;
                    $objDatServalimentacion = new DatServalimentacionModel();

                    $cargose = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);
                    foreach ($cargose as $carg) {
                        $arrcargos[] = $carg['idcargo'];
                    }

                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);
                    if ($persona->quantity != 0) {
                        foreach ($persona->data as $a => $p) {
                            $serali = $DatSituacexcepModel->getSituacExcep(array($p['idpersona']), null, null, $filters[1]->value, $filters[2]->value);
                            if (count($serali->data) != 0) {
                                if ($serali->data[0]['idevento'] == $cat['idevento'] && $serali->data[0]['idestalimentacion'] == $pant['idestalimentacion']) {
                                    $cant++;
                                    $totalcargo++;
                                }
                            }
                        }
                    }
                    $totalueb += $cant;
                    $pdf->SetFont('Arial', '', 11);
                    $pdf->Cell(250, 10, $cant, 1, 0, "L");
                    $pdf->Cell(50, 10, $totalcargo, 1, 1, "L");

                }
                $pdf->Cell(200, 10, "Total", 1, 0, "L", 1);
                $pdf->Cell(250, 10, $totalueb, 1, 0, "L");
                $pdf->Cell(50, 10, $totalueb, 1, 1, "L");

                $pdf->Ln(12);


            }
        }

        //Pie de firma
        $perfil = $_SESSION['Zeolides']['perfil'];
        $fecha = date('d/m/Y');
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetY(-30);
        $pdf->SetX(350);
        $pdf->Write(5, 'Elaborado por ' . $perfil['nombre'] . ' ' . $perfil['apellidos'] . ' (' . $perfil['usuario'] . ') ' . $fecha);

        return $pdf;
    }

    private function width($ueb)
    {
        $r = array();
        $r['widthpantry'] = 70;
        $r['widthtotal'] = 20;
        $r['widthueb'] = (320 - 90) / $ueb;
        return $r;
    }

    private function addVerticalColumn(&$pdf, $w, $text, $salto, $space = 1, $width)
    {
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->Rotate(90, $x + ($w / 2), $y + ($w / 2));
        $pdf->MultiCell($w, $space * $width, utf8_decode($text), 1, 'C');
        $pdf->SetY($y);
        $pdf->SetX($x + ($width * $salto));
        $pdf->Rotate(0);
    }


}


