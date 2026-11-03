<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDFEstruc extends fpdf
{
}

class ReportActivFunModel extends ZendExt_Model
{
    public function ReportActivFunModel()
    {
        parent::ZendExt_Model();

    }

    public function clasificacionxparticipacion($idestructura)
    {
        $pdf = new PDFEstruc('L', 'mm', 'a3');
        if ($idestructura) {
            $pdfNGeneral = $this->crearCuerpo($pdf, $idestructura);
        } else {
            $pdfNGeneral = $this->crearEncabezado($pdf);
        }

        $pdfNGeneral->Output();
    }

    private function crearEncabezado($pdf)
    {
        $pdf->SetLeftMargin(130);
        $pdf->AddPage();

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 11, utf8_decode("Empresa:"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(110, 11, '', 1, 0, 'L');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 11, utf8_decode("OSD:"), 1, 0, 'C');
        $pdf->Cell(97, 11, "", 1, 1, 'C');
        $pdf->Cell(20, 11, utf8_decode("UEB:"), 1, 0, 'C');
        $pdf->Cell(110, 11, "", 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 11, utf8_decode("Fecha:"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(97, 11, '', 1, 1, 'L');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 20, utf8_decode('Nº '), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(130, 20, utf8_decode("Categorías Laborales"), 1, 0, 'C');
        //  $pdf->Cell(50, 12, utf8_decode("REAL"), 1, 1, 'C');
        $pdf->Cell(97, 10, utf8_decode("PLANTILLA"), 1, 1, 'C');
        // $pdf->Cell(100, 10, utf8_decode("REAL CUBIERTOS"), 1, 0, 'C');
        // $pdf->Cell(100, 10, utf8_decode("Variación"), 1, 0,'C');
        $pdf->SetX(280);
        $pdf->Cell(49, 10, utf8_decode("Cant. de cargos "), 1, 0, 'C');
        $pdf->Cell(48, 10, utf8_decode("Peso Específico"), 1, 1, 'C');
        /* $pdf->Cell(50, 12, utf8_decode("Cant. de cargos"), 1, 0, 'C');
         $pdf->Cell(50, 12, utf8_decode("Peso Específico"), 1, 0, 'C');
         $pdf->Cell(50, 12, utf8_decode("Variación absoluta"), 1, 0, 'C');
         $pdf->Cell(50, 12, utf8_decode("Variación Porcentual"), 1, 1, 'C');*/
        $pdf->SetFont('Times', '', 10);

        return $pdf;
    }

    public function crearCuerpo($pdf, $idestructura)
    {
        $vioc = ZendExt_IoC::getInstance();
        $estrutura = $vioc->metadatos->DameEstructura($idestructura);
        $fechaactual = date('Y/m/d');
        $pdf->SetLeftMargin(130);
        $pdf->AddPage();
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 11, utf8_decode("Empresa:"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(110, 11, utf8_decode($estrutura[0]->denominacion), 'T', 0, 'L');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 11, utf8_decode("OSD:"), 'LT', 0, 'C');
        $pdf->Cell(97, 11, "", 1, 1, 'C');
        $pdf->Cell(20, 11, utf8_decode("UEB:"), 'L', 0, 'C');
        $pdf->Cell(110, 11, "", 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 11, utf8_decode("Fecha:"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(97, 11, $fechaactual, 'R', 1, 'L');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 20, utf8_decode('Nº '), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(130, 20, utf8_decode("Programas  Laborales"), 0, 0, 'C');
        $pdf->Cell(97, 10, utf8_decode("PLANTILLA"), 1, 1, 'C');
        $pdf->SetX(280);
        $pdf->Cell(49, 10, utf8_decode("Cant. de cargos "), 'LR', 0, 'C');
        $pdf->Cell(48, 10, utf8_decode("Peso Específico"), 'R', 1, 'C');
        $pdf->SetFont('Times', '', 10);
        $total = 0;
        $res = $vioc->metadatos->DameEstructura($idestructura);
        if ($res[0]->idtipo != 7) {
            if ($res[0]->idtipo == 3) {
                $persona = $vioc->pvd->getPrincipalesDatosPersona(
                    null,
                    null,
                    null,
                    null,
                    $idestructura,
                    null, null,
                    0,
                    0,
                    0,
                    0
                );
            } else {
                $persona = $vioc->pvd->getPrincipalesDatosPersona(
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    $idestructura,
                    0,
                    0,
                    0,
                    0
                );
            }
        }
        $objplab = new NomProgramaconstructivo();
        $programasconst = $objplab->getProgramaconstructivo();

        if ($persona->quantity != 0) {
            foreach ($persona->data as $p) {
                if ($p['idsituacionlaboral'] != '') {
                    $prp = $objplab->getProgramaconstructivoxidsituacion(
                        $p['idsituacionlaboral']
                    );
                    if (count($prp) != 0) {
                        $idpl = $prp[0]['idprogramalaboral'];
                        foreach ($programasconst as $k => $pg) {
                            if ($idpl == $pg['idprogramalaboral']) {
                                $programasconst[$k]['cant'] += 1;
                                $total += 1;
                            } else {
                                $programasconst[$k]['cant'] += 0;
                            }
                        }

                    }
                }
            }
        }

        $i = 1;
        foreach ($programasconst as $prog) {
            $pdf->Cell(20, 12, $i, 'LB', 0, 'C');
            $pdf->Cell(130, 12, $prog['denominacion'], 'LT', 0, 'C');
            $pdf->Cell(49, 12, $prog['cant'], 1, 0, 'C');
            $pdf->Cell(48, 12, round($prog['cant'] * 100 / $total, 1, PHP_ROUND_HALF_UP) . '%', 1, 1, 'C'); //peso %
            $i++;
        }

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(150, 12, utf8_decode('TOTAL'), 1, 0, 'L');
        $pdf->Cell(49, 12, $total, 'RB', 0, 'C');
        $pdf->Cell(48, 12, '', 'RB', 0, 'C');
        return $pdf;
    }

}
