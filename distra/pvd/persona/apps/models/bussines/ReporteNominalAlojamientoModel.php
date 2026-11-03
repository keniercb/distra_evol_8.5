<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class ReporteNominalAlojamientoModel extends ZendExt_Model
{

    public function ReporteNominalAlojamientoModel()
    {
        parent::ZendExt_Model();
    }

    public function exportarAlojamiento($filters, $idestructura)
    {
        $pdf = new fpdf('L', 'mm', 'letter');
        $pdf->AddPage();
        $pdfNGeneral = $this->crearCuerpo($pdf, $filters, $idestructura);
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $filters, $idestructura)
    {
        $pdf->SetFont('Arial', 'B', 13);
        $pdf->SetLeftMargin(34);
        $pdf->Cell(230, 10, utf8_decode("Servicio de alojamiento. Listado de trabajadores "), 0, 1, "C");

        $pdf->SetFont('Arial', 'B', 11);
        if (count($filters) != 0) {
            if ($filters[2]->value != '') {
                $idestructura = $filters[2]->value;
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
        $i = 1;
        $rut = [];
        foreach ($hojas as $key => $hj) {
            $rutaresu = '';
            $ruta = $objNomestructalojamientoModel->getRutaAlojamiento($hj['idestructuraalojamiento'], $rut);
            $f = implode('->', $ruta);

            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(50, 10, utf8_decode("Estructura de alojamiento: "), 0, 0, 'L');
            $pdf->SetFont('Arial', '', 11);
            $pdf->Cell(150, 10, utf8_decode($f), 0, 1, 'L');
            $pdf->SetFont('Arial', 'B', 11);
            $pdf->SetFillColor(230);
            $pdf->Cell(20, 10, "No. ", '1', 0, "C", 1);
            $pdf->Cell(30, 10, "No. Identidad ", '1', 0, "C", 1);
            $pdf->Cell(75, 10, "Nombre(s) y apellidos", '1', 0, "C", 1);
            $pdf->Cell(85, 10, "Cargo", '1', 1, "C", 1);

            $pdf->SetFont('Arial', '', 11);
            if ($ueb) {
                foreach ($ueb as $ue) {
                    $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($ue['idestructura']);
                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);

                    foreach ($cargos as $carg) {
                        $arrcargos[] = $carg['idcargo'];
                    }

                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);
                    if ($persona->quantity != 0) {
                        foreach ($persona->data as $a => $p) {
                            $serali = $objDatServalojamientoModel->obtenerServAlojPorPersona($p['idpersona'] /*, $filters[0]->value, $filters[1]->value*/);
                            if (count($serali) != 0) {
                                foreach ($serali->data as $ser) {
                                    if ($ser['idestructuraalojamiento'] == $hj['idestructuraalojamiento']) {
                                        $pdf->Cell(210, 10, utf8_decode($estruc[0]->denominacion), 1, 1, 'L');
                                        $pdf->Cell(20, 10, $i, 1, 0, "C");
                                        $pdf->Cell(30, 10, $p['numid'], 1, 0, "C");
                                        $pdf->Cell(75, 10, utf8_decode($p['nombreapellidos']), 1, 0, "C");
                                        $pdf->Cell(85, 10, utf8_decode($p['denomcargo']), 1, 1, "C");
                                        $i++;
                                    }
                                }
                            }
                        }
                        $i = 1;
                    }
                }
            } else {
                $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
                $pdf->Cell(210, 10, utf8_decode($estruc[0]->denominacion), 1, 1, 'L');

                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);
                foreach ($cargos as $carg) {
                    $arrcargos[] = $carg['idcargo'];
                }

                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);
                if ($persona->quantity != 0) {
                    foreach ($persona->data as $a => $p) {
                        $serali = $objDatServalojamientoModel->obtenerServAlojPorPersona($p['idpersona'] /*, $filters[0]->value, $filters[1]->value*/);
                        if (count($serali) != 0) {
                            foreach ($serali->data as $ser) {
                                if ($ser['idestructuraalojamiento'] == $hj['idestructuraalojamiento']) {
                                    $pdf->Cell(20, 10, $i, 1, 0, "C");
                                    $pdf->Cell(30, 10, $p['numid'], 1, 0, "C");
                                    $pdf->Cell(75, 10, utf8_decode($p['nombreapellidos']), 1, 0, "C");
                                    $pdf->Cell(85, 10, utf8_decode($p['denomcargo']), 1, 1, "C");
                                    $i++;
                                }
                            }
                        }
                    }
                }
            }
            $i = 1;
            $pdf->Ln(8);
        }
        $perfil = $_SESSION['Zeolides']['perfil'];
        $fecha = date('d/m/Y');
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetY(-30);
        $pdf->SetX(34);
        $pdf->Write(5, 'Elaborado por ' . $perfil['nombre'] . ' ' . $perfil['apellidos'] . ' (' . $perfil['usuario'] . ') ' . $fecha);
        return $pdf;
    }
}
