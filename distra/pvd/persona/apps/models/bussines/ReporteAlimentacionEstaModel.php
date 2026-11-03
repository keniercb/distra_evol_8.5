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

class ReporteAlimentacionEstaModel extends ZendExt_Model
{


    public function ReporteAlimentacionEstaModel()
    {
        parent::ZendExt_Model();

    }

    public function exportarAlimentacionE($filters, $idestructura)
    {
        $pdf = new PDF('L', 'mm', 'a3');
        $pdf->AddPage();
        $this->crearCuerpo($pdf, $filters, $idestructura);
        $pdf->Output();
    }


    private function crearCuerpo(&$pdf, $filters, $idestructura)
    {
        $pdf->SetFont('Arial', 'B', 13);
        $pdf->SetLeftMargin(10);
        $pdf->Cell(560, 10, utf8_decode("Servicio de alimentación. Resumen estadístico "), 0, 1, "C");

        $pdf->SetFont('Arial', 'B', 11);
        if (count($filters)) {
            if ($filters[1]->value != '') {
                $idestructura = $filters[1]->value;
            }
        } else {
            $idestructura = $idestructura;
        }

        $objConfEntidad = new DatServalimentacion();
        $ueb = $objConfEntidad->getEntidad($idestructura);
        $obj = new DatServalimentacionModel();
        //Definiendo ancho columnas
        $width = $this->width(count($ueb));

        $eventos = $obj->obtenerEventosAlimentacion(null, null, null);
        $objNomEstalimentacionModel = new NomEstalimentacionModel();
        $pantry = $objNomEstalimentacionModel->getEstAlimentacionActivas(null, null, null);
        $pdf->SetFillColor(230);
        $arrtotal = [];
        foreach ($eventos as $key => $cat) {
            $pdf->SetFont('Arial', 'B', 11);
            if ($ueb) {
                $pdf->Cell(80, 10, utf8_decode("Evento:" . $cat['evento']), 0, 1, 'L');
                $pdf->Cell(70, 65, utf8_decode("Pantrys"), 1, 0, 'C', 1);
                foreach ($ueb as $ue) {
                    $totalueb = 0;
                    $totalt = 0;
                    $pdf->SetFont('Arial', 'B', 11);
                    $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($ue['idestructura']);
                    $denominacion = (strlen($estruc[0]->denominacion) > 25) ? substr($estruc[0]->denominacion, 0, 25) . "..." : $estruc[0]->denominacion;

                    $this->addVerticalColumn($pdf, 65, $denominacion, 2, 2, $width['widthueb']);
                }


                $this->addVerticalColumn($pdf, 65, "Total", 2, 2, 9);
                $pdf->Cell(1, 65, "", 0, 1, "L");
                $pdf->SetFont('Arial', '', 11);
                foreach ($pantry->data as $k => $pant) {
                    $pdf->Cell(70, 10, utf8_decode($pantry->data[$k]['denominacion']), 1, 0, "L");
                    $totalpantry = 0;
                    foreach ($ueb as $u => $ue) {
                        $cant = 0;

                        $objDatServalimentacion = new DatServalimentacionModel();

                        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);
                        foreach ($cargos as $carg) {
                            $arrcargos[] = $carg['idcargo'];
                        }

                        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);
                        if ($persona->quantity != 0) {
                            foreach ($persona->data as $a => $p) {
                                $serali = $objDatServalimentacion->obtenerServAlimentacionPorPersona($p['idpersona'], $filters[0]->value, $filters[2]->value);
                                if (count($serali->data) != 0) {
                                    if ($serali->data[0]['idevento'] == $cat['idevento'] && $serali->data[0]['idestalimentacion'] == $pant['idestalimentacion']) {
                                        $cant++;
                                    }
                                }
                            }
                        }
                        $totalpantry += $cant;
                        $pdf->SetFont('Arial', '', 11);
                        $pdf->Cell(2 * $width['widthueb'], 10, $cant, 1, 0, "L");
                        $arrtotal[$u]['t'] += $cant;
                        $arrtotal[$u]['tt'] += $totalpantry;

                    }
                    $pdf->Cell(18, 10, $totalpantry, 1, 1, "L");

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

                $pdf->Cell(80, 10, utf8_decode("Evento:" . $cat['evento']), 0, 1, 'L');
                $pdf->Cell(200, 10, utf8_decode("Pantrys"), 1, 0, 'L', 1);
                $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
                $pdf->Cell(250, 10, utf8_decode($estruc[0]->denominacion), 1, 0, 'L', 1);
                $pdf->Cell(50, 10, "Total", 1, 1, "L", 1);
                $pdf->SetFont('Arial', '', 11);
                foreach ($pantry->data as $k => $pant) {
                    $pdf->Cell(200, 10, utf8_decode($pant['denominacion']), 1, 0, "L");
                    $totalpantry = 0;
                    $cant = 0;
                    $objDatServalimentacion = new DatServalimentacionModel();

                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);
                    foreach ($cargos as $carg) {
                        $arrcargos[] = $carg['idcargo'];
                    }
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);

                    if ($persona->quantity != 0) {
                        foreach ($persona->data as $a => $p) {
                            $serali = $objDatServalimentacion->obtenerServAlimentacionPorPersona($p['idpersona'], $filters[0]->value, $filters[2]->value);
                            if (count($serali->data) != 0) {
                                if ($serali->data[0]['idevento'] == $cat['idevento'] && $serali->data[0]['idestalimentacion'] == $pant['idestalimentacion']) {
                                    $cant++;
                                    $totalpantry++;
                                }
                            }
                        }
                    }
                    $totalueb += $cant;
                    $pdf->SetFont('Arial', '', 11);
                    $pdf->Cell(250, 10, $cant, 1, 0, "L");
                    $pdf->Cell(50, 10, $totalpantry, 1, 1, "L");

                }
                $pdf->Cell(200, 10, "Total", 1, 0, "L", 1);
                $pdf->Cell(250, 10, $totalueb, 1, 0, "L");
                $pdf->Cell(50, 10, $totalueb, 1, 1, "L");

                $pdf->Ln(12);
            }

        }

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


