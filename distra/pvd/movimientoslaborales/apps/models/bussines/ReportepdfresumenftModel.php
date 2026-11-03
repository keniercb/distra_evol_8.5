<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
        "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);

class PDFResumenft extends fpdf {
    
}

class ReportepdfresumenftModel extends ZendExt_Model {

    public function ReportepdfresumenftModel() {
        parent::ZendExt_Model();
    }

    public function construirReporte($idestructura, $fdesde, $fhasta) {
        $modeloDatos = new DatosresumenftModel();
        $organos = $modeloDatos->getOrganos($idestructura);
//        $organos2[] = $organos[4];
////        print_r($organos2);
////        die;
//        $organos = $organos2;
        $denomColumnas = $modeloDatos->getDenominacionColumnas();

        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $entidad = $entidad[0]->denominacion;

        //Creo un objeto PDFResumenft temporal para calcular el ancho de la columna Organos:
        $anchopdftemp = 280; //Ancho del pdf en formato carta - hoja horizontal
        $altopdftemp = 216; //Alto del pdf en formato carta - hoja horizontal
        $pdfTemp = new PDFResumenft('L', 'mm', $anchopdftemp, $altopdftemp);
        $mayorlongorgano = 0;
        $pdfTemp->SetFont('Times', '', 14);  //El GetStringWith no funciona si no tiene una fuente definida
        foreach ($organos as $organo) {
            $mayorlongorgano = ($pdfTemp->GetStringWidth($organo['denominacion']) > $mayorlongorgano) ?
                    $pdfTemp->GetStringWidth($organo['denominacion']) : $mayorlongorgano;
        }
        $tamannoOrganosyUC = $pdfTemp->GetStringWidth('Organos y U.C');
        if ($mayorlongorgano < $tamannoOrganosyUC) {
            $mayorlongorgano = $tamannoOrganosyUC + 2;
        }
        $mayorlongorgano = round($mayorlongorgano, 0, PHP_ROUND_HALF_UP) + 1;

        $longdinamica = 15 * (count($denomColumnas['denominaciones']) - 1); // -1 para descontar la columna Organos y UC

        $anchopdf = $mayorlongorgano + $longdinamica + 20; //Se le suman 20 para los margenes.
        $altopdf = $anchopdf * 0.6; //El alto va a ser igual al 60% del ancho.

        $pdf = new PDFResumenft('L', 'mm', array($altopdf, $anchopdf));
        $pdf->SetTopMargin(5);
        $pdf->AddPage();

        $pdffinal = $this->cabeceraReporte($pdf, $fdesde, $fhasta, $denomColumnas, $mayorlongorgano, $entidad);
        $pdffinal = $this->cuerpoReporte(
                $pdf, $mayorlongorgano, $organos, $modeloDatos, $fdesde, $fhasta, $denomColumnas
        );

        $pdf->Output();
    }

    public function cuerpoReporte(&$pdf, $mayorlongorgano, $organos, $modeloDatos, $fdesde, $fhasta, $denomColumnas) {
        $totalTotalTrabajadores = 0;
        $totalHombres = 0;
        $totalMujeres = 0;
        $totalPCC = 0;
        $totalUJC = 0;
        $totalAltas = 0;
        $totalBajas = 0;
        $totalesMotivosBaja = array();
        $totalesEscolaridad = array();
        $totalEdadNoConocida = 0;
        $totalMenoresDeQuince = 0;
        $totalEntreQyD = 0;
        $totalEntreDyD = 0;
        $totalEntreVyV = 0;
        $totalEntreTyT = 0;
        $totalEntreCyC = 0;
        $totalEntreSySc = 0;
        $totalEntreSySn = 0;
        $totalMayoresDeSetenta = 0;
        $totalTotalEdades = 0;
        $totalesCompEtnica = array();

        $pdf->SetFont('Times', '', 14);

        foreach ($organos as $value) {
            $valoresFila = $modeloDatos->getValoresFila(
                    $value['idestructura'], $fdesde, $fhasta, $value['estructurapadre']
            );

//            print_r($valoresFila);
//            die;

            $pdf->Cell($mayorlongorgano, 10, "" . utf8_decode("" . $value['denominacion']), 1, 0, "");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['totaltrabajadores']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['hombres']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['mujeres']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['pcc']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['ujc']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['altas']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['bajas']), 1, 0, "C");

            //Incremento los contadores de los totales:
            $totalTotalTrabajadores += $valoresFila['totaltrabajadores'];
            $totalHombres += $valoresFila['hombres'];
            $totalMujeres += $valoresFila['mujeres'];
            $totalPCC += $valoresFila['pcc'];
            $totalUJC += $valoresFila['ujc'];
            $totalAltas += $valoresFila['altas'];
            $totalBajas += $valoresFila['bajas'];

            if (count($valoresFila['bajaspormotivos']) != 0) {
                $total = 0;
                foreach ($valoresFila['bajaspormotivos'] as $k => $v) {
                    $cantidad = "";
                    if ($v['cantidad'] != 0) {
                        $cantidad = $v['cantidad'];
                        $total += $cantidad;
                    }
                    $pdf->Cell(15, 10, "" . utf8_decode("" . $cantidad), 1, 0, "C");
                    $totalesMotivosBaja[$k] += $v['cantidad'];
                    $llaveDelTotal = $k + 1;
                }
                $totalesMotivosBaja[$llaveDelTotal] += $total;
                if ($total == 0) {
                    $total = "";
                }
                $pdf->Cell(15, 10, "" . utf8_decode("" . $total), 1, 0, "C");
            } else {
                //En caso que no haya cargos en el organo correspondiente a la fila relleno 
                //todo el tramo con celdas vacias incluyendo la columna total
                $totalColumnasMotivoBaja = $denomColumnas['totalmotivosbaja'];
                for ($i = 0; $i <= $totalColumnasMotivoBaja; $i++) {
                    $pdf->Cell(15, 10, "", 1, 0, "C");
                }
            }

            if (count($valoresFila['escolaridad']) != 0) {
                $totalEscolaridad = 0;
                foreach ($valoresFila['escolaridad'] as $k => $v) {
                    $cant = "";
                    if ($v['cantidad'] != 0) {
                        $cant = $v['cantidad'];
                        $totalEscolaridad += $cant;
                    }
                    $pdf->Cell(15, 10, "" . utf8_decode("" . $cant), 1, 0, "C");
                    $totalesEscolaridad[$k] += $v['cantidad'];
                    $llaveDelTotalEsc = $k + 1;
                }
                $totalesEscolaridad[$llaveDelTotalEsc] += $totalEscolaridad;
                if ($totalEscolaridad == 0) {
                    $totalEscolaridad = "";
                }
                $pdf->Cell(15, 10, "" . utf8_decode("" . $totalEscolaridad), 1, 0, "C");
            } else {
                $totalColumnasEscolaridad = $denomColumnas['totalniveleduc'];
                for ($i = 0; $i <= $totalColumnasEscolaridad; $i++) {
                    $pdf->Cell(15, 10, "", 1, 0, "C");
                }
            }

            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['edadnoconocida']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['menoresdequince']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['entre15y16']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['entre17y19']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['entre20y29']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['entre30y39']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['entre40y59']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['entre60y64']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['entre65y69']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['mayoresdesetenta']), 1, 0, "C");
            $pdf->Cell(15, 10, "" . utf8_decode("" . $valoresFila['totaledades']), 1, 0, "C");

            //Incremento los contadores de los totales:
            $totalEdadNoConocida += $valoresFila['edadnoconocida'];
            $totalMenoresDeQuince += $valoresFila['menoresdequince'];
            $totalEntreQyD += $valoresFila['entre15y16'];
            $totalEntreDyD += $valoresFila['entre17y19'];
            $totalEntreVyV += $valoresFila['entre20y29'];
            $totalEntreTyT += $valoresFila['entre30y39'];
            $totalEntreCyC += $valoresFila['entre40y59'];
            $totalEntreSySc += $valoresFila['entre60y64'];
            $totalEntreSySn += $valoresFila['entre65y69'];
            $totalMayoresDeSetenta += $valoresFila['mayoresdesetenta'];
            $totalTotalEdades += $valoresFila['totaledades'];

            if (count($valoresFila['composicionetnica']) != 0) {
                $totalCompEtnica = 0;
                foreach ($valoresFila['composicionetnica'] as $k => $v) {
                    $canti = "";
                    if ($v['cantidad'] != 0) {
                        $canti = $v['cantidad'];
                        $totalCompEtnica += $canti;
                    }
                    $pdf->Cell(15, 10, "" . utf8_decode("" . $canti), 1, 0, "C");
                    $totalesCompEtnica[$k] += $v['cantidad'];
                    $llaveDelTotalCompEtnica = $k + 1;
                }
                $totalesCompEtnica[$llaveDelTotalCompEtnica] += $totalCompEtnica;
                if ($totalCompEtnica == 0) {
                    $totalCompEtnica = "";
                }
                $pdf->Cell(15, 10, "" . utf8_decode("" . $totalCompEtnica), 1, 0, "C");
            } else {
                $totalColumnasCompEtnica = $denomColumnas['totalcolorespiel'];
                for ($i = 0; $i <= $totalColumnasCompEtnica; $i++) {
                    $pdf->Cell(15, 10, "", 1, 0, "C");
                }
            }

            $pdf->Ln(10);
        }

        //Pinto la fila de los totales:
        $pdf->SetFont('Times', 'B', 14);
        $pdf->Cell($mayorlongorgano, 10, "" . utf8_decode("TOTAL"), 1, 0, "");
        $pdf->Cell(15, 10, "" . utf8_decode($totalTotalTrabajadores), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalHombres), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalMujeres), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalPCC), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalUJC), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalAltas), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalBajas), 1, 0, "C");
        foreach ($totalesMotivosBaja as $value) {
            $pdf->Cell(15, 10, "" . utf8_decode($value), 1, 0, "C");
        }
        foreach ($totalesEscolaridad as $value) {
            $pdf->Cell(15, 10, "" . utf8_decode($value), 1, 0, "C");
        }
        $pdf->Cell(15, 10, "" . utf8_decode($totalEdadNoConocida), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalMenoresDeQuince), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalEntreQyD), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalEntreDyD), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalEntreVyV), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalEntreTyT), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalEntreCyC), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalEntreSySc), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalEntreSySn), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalMayoresDeSetenta), 1, 0, "C");
        $pdf->Cell(15, 10, "" . utf8_decode($totalTotalEdades), 1, 0, "C");
        foreach ($totalesCompEtnica as $value) {
            $pdf->Cell(15, 10, "" . utf8_decode($value), 1, 0, "C");
        }

        return $pdf;
    }

    public function cabeceraReporte(&$pdf, $fdesde, $fhasta, $denomColumnas, $mayorlongorgano, $entidad) {
        $fdesde = date('d/m/Y', strtotime($fdesde));
        $fhasta = date('d/m/Y', strtotime($fhasta));

        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(0, 10, utf8_decode("RESUMEN DE LA FUERZA DE TRABAJO"), 0, 0, 'C', 0);
        $pdf->Ln(10);
        $pdf->Cell(0, 10, utf8_decode("Entidad: $entidad      " . $fdesde . ' - ' . $fhasta), 0, 0, 'C', 0);
        $pdf->Ln(10);

        $pdf->SetFont('Times', 'B', 14);

        $x = $pdf->GetX();
        $pdf->SetX($mayorlongorgano + $x);
        $pdf->Cell(15, 10, "", 1, 0, "C", 0);
        $pdf->Cell(15 * 6, 10, "DE ELLOS", 1, 0, "C", 0);
        $pdf->Cell(15 * ($denomColumnas['totalmotivosbaja'] + 1), 10, "TOTAL DE BAJAS", 1, 0, "C", 0);
        $pdf->Cell(15 * ($denomColumnas['totalniveleduc'] + 1), 10, "ESCOLARIDAD", 1, 0, "C", 0);
        $pdf->Cell(15 * 11, 10, "EDADES", 1, 0, "C", 0); // 11 es el total de rangos de edad mas la columna del total
        $pdf->Cell(
                15 * ($denomColumnas['totalcolorespiel'] + 1),
                10,
                utf8_decode('COMPOSICIÓN ÉTNICA'), 1, 0, "C", 0
        );

        $pdf->Ln(10);

        $altoCelda = 0;
        foreach ($denomColumnas['denominaciones'] as $columna) {
            $altoCelda = ($pdf->GetStringWidth($columna) > $altoCelda) ? $pdf->GetStringWidth($columna) : $altoCelda;
        }
        $altoCelda = round($altoCelda, 0, PHP_ROUND_HALF_UP) + 1;

        $pdf->Cell($mayorlongorgano, $altoCelda, "" . utf8_decode($denomColumnas['denominaciones'][0]), 1, 0, "C", 0);

        foreach ($denomColumnas['denominaciones'] as $value) {
            if ($denomColumnas['denominaciones'][0] != $value) {
                $this->addVerticalColumn($altoCelda, $value, 1.875, 1.875, $pdf);
            }
        }

        $pdf->Ln($altoCelda);

        return $pdf;
    }

    private function addVerticalColumn($w, $text, $salto, $space = 1, &$pdf, $fill = 0) {
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->Rotate(90, $x + ($w / 2), $y + ($w / 2));
        $pdf->MultiCell($w, $space * 8, utf8_decode($text), 1, 'C', $fill);
        $pdf->SetY($y);
        $pdf->SetX($x + (8 * $salto));
        $pdf->Rotate(0);
    }

}
