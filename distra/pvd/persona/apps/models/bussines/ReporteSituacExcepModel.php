<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class ReporteSituacExcepModel extends ZendExt_Model
{

    public function ReporteSituacExcepModel()
    {
        parent::ZendExt_Model();

    }

    public function exportarSituacExcep($filters, $idestructura)
    {
        $pdf = new fpdf('L', 'mm', 'A4');
        $pdf->AddPage();
        $pdfNGeneral = $this->crearCuerpo($pdf, $filters, $idestructura);
        $pdfNGeneral->Output();
    }


    private function crearCuerpo($pdf, $filters, $idestructura)
    {
        $pdf->SetFont('Arial', 'B', 13);
        $pdf->SetLeftMargin(40);
        $pdf->Cell(233, 10, utf8_decode("Situaciones excepcionales. Listado de trabajadores "), 0, 1, "C");

        $pdf->SetFont('Arial', 'B', 11);
        if (count($filters) != 0) {
            if ($filters[0]->value != '') {
                $idestructura = $filters[0]->value;
            }
        } else {
            $idestructura = $idestructura;
        }

        $obj = new NomSituacexcepModel();
        $estructsituacexcep = $obj->getSituacExcep($filters[1]->value, null, null, null);

        $objNomSituacexcep = new NomSituacexcep();
        $DatSituacexcepModel = new DatSituacexcepModel();
        $ueb = $objNomSituacexcep->getEntidad($idestructura);

        $i = 1;
        foreach ($estructsituacexcep->data as $estruct) {

            $pdf->SetFont('Arial', 'B', 11);
            $pdf->Cell(80, 10, utf8_decode("Estructura para situaciones excepcionales:" . $estruct['denominacion']), 0, 1, 'L');
            $pdf->SetFillColor(230);
            $pdf->Cell(20, 10, "No. ", '1', 0, "C", 1);
            $pdf->Cell(30, 10, "No. Identidad ", '1', 0, "C", 1);
            $pdf->Cell(75, 10, "Nombre(s) y apellidos", '1', 0, "C", 1);
            $pdf->Cell(85, 10, "Cargo", '1', 1, "C", 1);
            $pdf->SetFont('Arial', '', 11);

            if ($ueb) {
                foreach ($ueb as $ue) {
                    $persona = array();
                    $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($ue['idestructura']);
                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);

                    foreach ($cargos as $carg) {
                        $arrcargos[] = $carg['idcargo'];
                    }

                    $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);
//print_r($persona);
                    if ($persona->quantity != 0) {
                        foreach ($persona->data as $a => $p) {
                            $serali = $DatSituacexcepModel->getSituacExcep(array($p['idpersona']), null, null, $filters[1]->value, $filters[2]->value);

                            if (count($serali) != 0) {
                                foreach ($serali->data as $ser) {
                                    if ($ser['idestructuratransportacion'] == $estruct['idestructuratransportacion']) {
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
                    }
                    $i = 1;
                }
            }else{
                $estruc = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estruc[0]->idestructura);

                foreach ($cargos as $carg) {
                    $arrcargos[] = $carg['idcargo'];
                }

                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(null, null, null, null, null, $arrcargos, null, 0, 0, 0, 0);

                if ($persona->quantity != 0) {
                    foreach ($persona->data as $a => $p) {
                        $serali = $DatSituacexcepModel->getSituacExcep(array($p['idpersona']), null, null, $filters[1]->value, $filters[2]->value);

                        if (count($serali) != 0) {
                            foreach ($serali->data as $ser) {
                                if ($ser['idestructuratransportacion'] == $estruct['idestructuratransportacion']) {
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
                }
                $i = 1;
            }
            $pdf->Ln(12);
        }//die;
        $perfil = $_SESSION['Zeolides']['perfil'];
        $fecha = date('d/m/Y');
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetY(-30);
        $pdf->SetX(38);
        $pdf->Write(5, 'Elaborado por ' . $perfil['nombre'] . ' ' . $perfil['apellidos'] . ' (' . $perfil['usuario'] . ') '  . $fecha);
        return $pdf;
    }
}
