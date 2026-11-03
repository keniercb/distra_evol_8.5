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

class ReporteEstadisticoTransModel extends ZendExt_Model
{


    public function ReporteEstadisticoTransModel()
    {
        parent::ZendExt_Model();

    }

    public function exportarTransportacion($filters, $idestructura)
    {
        $pdf = new PDF('L', 'mm', 'a3');
        $pdf->AddPage();
        $pdfNGeneral = $this->crearCuerpo($pdf, $filters, $idestructura);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $filters, $idestructura)
    {
        $pdf->SetFont('Arial', 'B', 13);
        $pdf->SetLeftMargin(8);
        $pdf->Cell(560, 11, utf8_decode("Servicio de transportación. Resumen estadístico "), 0, 1, "C");

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

        $objNomEstructransportacionModel = new NomEstructransportacionModel();
        $objNomEstructransportacion = new NomEstructransportacion();
        $estransp = $objNomEstructransportacion->getEstrucTransportacion();

        $bool = '';
        foreach ($estransp as $key => $rut) {

            foreach ($estransp as $k => $r) {
                if ($rut['idestructuratransportacion'] != $r['idestructuratransportacion']) {

                    if ($rut['idestructuratransportacion'] != $r['idpadre']) {
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
        //  print_r($hojas);die;
        $rut = [];
        foreach ($hojas as $key => $hj) {
            $ruta = $objNomEstructransportacionModel->getRutaTransportacion($hj['idestructuratransportacion'], $rut);
            $f = implode('->', $ruta);
            $rutas[$key]['denominacion'] = $f;
            $rutas[$key]['idestructuratransportacion'] = $hj['idestructuratransportacion'];
        }

        //Definiendo ancho columnas
        $width = $this->width(count($ueb));

        $objDatServtransportacionModel = new DatServtransportacionModel();
        $totalueb = 0;
        $totalt = 0;
        $pdf->SetFillColor(230);
        if ($ueb) {

            $pdf->Cell(70, 65, "Ruta", 1, 0, "C", 1);
            $arrtotal = [];
            $i = 0;
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

            $pdf->SetFillColor(230);
            $pdf->SetFont('Arial', '', 11);
            $totalueb = 0;

            foreach ($rutas as $key => $hj) {
                $pdf->Cell(70, 10, utf8_decode($hj['denominacion']), 1, 0, "L");

                $totalruta = 0;
                foreach ($ueb as $u => $ue) {
                    $pdf->SetFont('Arial', '', 11);
                    $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($ue['idestructura']);

                    $totalt = 0;
                    $cant = 0;

                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);

                    foreach ($cargos as $carg) {
                        $arrcargos[] = $carg['idcargo'];
                    }

                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);
                    if ($persona->quantity != 0) {
                        foreach ($persona->data as $a => $p) {
                            $serali = $objDatServtransportacionModel->obtenerServTranspPorPersona($p['idpersona'], $rut, $filters[0]->value, $filters[1]->value);
                            if (count($serali->data) != 0) {
                                foreach ($serali->data as $ser) {
                                    if ($ser['idestructuratransportacion'] == $hj['idestructuratransportacion']) {
                                        $cant++;
                                    }
                                }
                            }
                        }
                    }
                    $totalruta += $cant;
                    $pdf->Cell(2 * $width['widthueb'], 10, $cant, 1, 0, "L");
                    $arrtotal[$u]['t'] += $cant;
                    $arrtotal[$u]['tt'] += $totalruta;
                }
                $pdf->Cell(18, 10, $totalruta, 1, 1, "L");

            }
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(70, 10, "Total", 1, 0, "L", 1);
            $pdf->SetFont('Arial', '', 11);
            foreach ($arrtotal as $ar) {
                $pdf->Cell(2 * $width['widthueb'], 10, $ar['t'], 1, 0, "L");
            }
            $pdf->Cell(18, 10, $ar['tt'], 1, 0, "L");

        } else {
            $pdf->SetLeftMargin(30);
            $pdf->Cell(200, 10, "Ruta", 1, 0, 'L', 1);
            $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);

            $pdf->Cell(250, 10, utf8_decode($estruc[0]->denominacion), 1, 0, 'L', 1);
            $pdf->Cell(50, 10, "Total", 1, 1, "L", 1);

            $totalueb = 0;
            $totalfinal = 0;
            foreach ($rutas as $key => $hj) {
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
                        $serali = $objDatServtransportacionModel->obtenerServTranspPorPersona($p['idpersona'], $filters[0]->value, $filters[1]->value);

                        if (count($serali->data) != 0) {
                            foreach ($serali->data as $ser) {
                                if ($ser['idestructuratransportacion'] == $hj['idestructuratransportacion']) {
                                    $cant++;
                                    $totalruta++;
                                }
                            }
                        }
                    }

                }
                $totalueb += $cant;
                $pdf->Cell(200, 10, utf8_decode($hj['denominacion']), 1, 0, "L");
                $pdf->Cell(250, 10, $cant, 1, 0, "L");
                $pdf->Cell(50, 10, $totalruta, 1, 1, "L");

            }
            $pdf->Cell(200, 10, "Total", 1, 0, "L", 1);
            $pdf->Cell(250, 10, $totalueb, 1, 0, "L");
            $pdf->Cell(50, 10, $totalueb, 1, 0, "L");

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
