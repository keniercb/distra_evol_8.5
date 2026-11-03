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

class ReporteAlojamientoEstaModel extends ZendExt_Model
{


    public function ReporteAlojamientoEstaModel()
    {
        parent::ZendExt_Model();

    }

    public function exportarAlojamiento($filters, $idestructura)
    {
        $pdf = new PDF('L', 'mm', 'a3');
        $pdf->AddPage();
        $pdfNGeneral = $this->crearCuerpo($pdf, $filters, $idestructura);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $filters, $idestructura)
    {
        $pdf->SetFont('Arial', 'B', 13);
        $pdf->SetLeftMargin(10);
        $pdf->Cell(560, 10, utf8_decode("Servicio de alojamiento. Resumen estadístico "), 0, 1, "C");

        $pdf->SetFont('Arial', 'B', 11);
        if (count($filters) != 0) {
            if ($filters[0]->value != '') {
                $idestructura = $filters[0]->value;
            }
        } else {
            $idestructura = $idestructura;
        }

        $objConfEntidad = new DatServalimentacion();
        $ueb = $objConfEntidad->getEntidad($idestructura);

        $objNomestructalojamientoModel = new NomestructalojamientoModel();
        $objNomestructalojamiento = new Nomestructalojamiento();

        $objDatServalojamientoModel = new DatServalojamientoModel();
        $objDatPersonaentidadModel = new DatPersonaentidadModel();

        $estransp = $objNomestructalojamiento->getEstructAlojamiento();

        $pdf->SetFillColor(230);
        $bool = '';
        foreach ($estransp as $key => $rut) {

            foreach ($estransp as $k => $r) {
                if ($rut['idestructuraalojamiento'] != $r['idestructuraalojamiento']) {

                    if ($rut['idestructuraalojamiento'] != $r['idpadre']) {
                        $bool = true;
                    } else {
                        $bool = false;
                    }
                }
            }
            if ($bool == true) {
                $hojas[] = $rut;
            }
        }
        $rut = [];

        foreach ($hojas as $key => $hj) {
            $ruta = $objNomestructalojamientoModel->getRutaAlojamiento($hj['idestructuraalojamiento'], $rut);
            $f = implode('->', $ruta);
            $hojas[$key]['ruta'] = $f;;
        }

        $objNomestructalojamientoModel = new NomestructalojamientoModel();
        $objNomestructalojamiento = new Nomestructalojamiento();

        $objDatServalojamientoModel = new DatServalojamientoModel();
        $totalueb = 0;
        $totalt = 0;

        //Definiendo ancho columnas
        $width = $this->width(count($ueb));
        $arrtotal = [];
        if ($ueb) {
            $pdf->Cell(70, 65, utf8_decode("Estructura de alojamiento"), 1, 0, 'C', 1);
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
            foreach ($hojas as $key => $hj) {
                $pdf->Cell(70, 10, utf8_decode($hj['ruta']), 1, 0, "L");
                $totalueb = 0;

                foreach ($ueb as $u => $ue) {
                    $totalt = 0;
                    $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($ue['idestructura']);


                    $pdf->SetFont('Arial', '', 11);
                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);

                    foreach ($cargos as $carg) {
                        $arrcargos[] = $carg['idcargo'];
                    }
                    $cant = 0;
                    $totalruta = 0;
                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);
                    if ($persona->quantity != 0) {
                        foreach ($persona->data as $a => $p) {
                            $serali = $objDatServalojamientoModel->obtenerServAlojPorPersona($p['idpersona'] /*, $filters[0]->value, $filters[1]->value*/);
                            if (count($serali->data) != 0) {
                                foreach ($serali->data as $ser) {
                                    if ($ser['idestructuraalojamiento'] == $hj['idestructuraalojamiento']) {
                                        $cant++;
                                    }
                                }
                            }
                        }

                    }
                    $totalueb += $cant;
                    $pdf->Cell(2 * $width['widthueb'], 10, $cant, 1, 0, "L");
                    $arrtotal[$u]['t'] += $cant;
                    $arrtotal[$u]['tt'] += $totalueb;
                }
                $pdf->Cell(18, 10, $totalueb, 1, 1, "L");
            }
            $pdf->Cell(70, 10, "Total", 1, 0, "L", 1);
            foreach ($arrtotal as $ar) {
                $pdf->Cell(2 * $width['widthueb'], 10, $ar['t'], 1, 0, "L");
            }
            $pdf->Cell(18, 10, $ar['tt'], 1, 0, "L");
        } else {
            $pdf->SetLeftMargin(30);
            $pdf->Cell(200, 10, utf8_decode("Estructura de alojamiento"), 1, 0, 'C', 1);
            $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
            $pdf->Cell(250, 10, utf8_decode($estruc[0]->denominacion), 1, 0, 'C', 1);
            $pdf->Cell(50, 10, "Total", 1, 1, "C", 1);

            foreach ($hojas as $key => $hj) {
                $totalueb = 0;

                $pdf->SetFont('Arial', '', 11);
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);

                foreach ($cargos as $carg) {
                    $arrcargos[] = $carg['idcargo'];
                }
                $cant = 0;
                $totalruta = 0;
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);
                if ($persona->quantity != 0) {
                    foreach ($persona->data as $a => $p) {
                        $serali = $objDatServalojamientoModel->obtenerServAlojPorPersona($p['idpersona'], $filters[0]->value, $filters[1]->value);
                        if (count($serali->data) != 0) {
                            foreach ($serali->data as $ser) {
                                if ($ser['idestructuraalojamiento'] == $hj['idestructuraalojamiento']) {
                                    $cant++;
                                    $totalruta++;
                                }
                            }
                        }
                    }
                    $totalueb += $cant;
                    $pdf->Cell(200, 10, utf8_decode($hj['ruta']), 1, 0, "L");
                    $pdf->Cell(250, 10, $cant, 1, 0, "C");
                    $pdf->Cell(50, 10, $totalruta, 1, 1, "C");
                }

            }
            $pdf->Cell(200, 10, "Total", 1, 0, "L", 1);
            $pdf->Cell(250, 10, $totalueb, 1, 0, "C");
            $pdf->Cell(50, 10, $totalueb, 1, 0, "C");
        }
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
