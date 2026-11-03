<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDFEstruc extends fpdf
{
}

class ReportestructuraftModel extends ZendExt_Model
{
    public function ReportestructuraftModel()
    {
        parent::ZendExt_Model();

    }

    public function reportEstructuraFTA($idestructura)
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
        $pdf->SetLeftMargin(35);
        $pdf->AddPage();

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(50, 11, utf8_decode("Empresa:"), 1, 0, 'C');
        $pdf->Cell(150, 11, "", 1, 0, 'C');
//        $pdf->Cell(50, 11, utf8_decode("OSD:"), 1, 0, 'C');
//        $pdf->SetFont('Times', 'B', 10);
//        $pdf->Cell(150, 11, "", 1, 1, 'C');
//        $pdf->Cell(50, 11, utf8_decode("UEB:"), 1, 0, 'C');
//        $pdf->Cell(150, 11, "", 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(50, 11, utf8_decode("Fecha:"), 1, 0, 'C');
        $pdf->Cell(150, 11, "", 1, 1, 'C');

        $pdf->Cell(20, 22, utf8_decode('Nº '), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(80, 22, utf8_decode("Categorías Ocupacionales"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("PLANTILLA"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("Contratos Indeterminados"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("Contratos Determinados"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("Variación CI"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("Variación CD"), 1, 1, 'C');
        $pdf->SetX(135);
        $pdf->Cell(40, 12, utf8_decode("Cant. de cargos "), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Peso Específico"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Cant. de cargos"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Peso Específico"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Cant. de cargos"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Peso Específico"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Variación absoluta"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Variación Porcentual"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Variación absoluta"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Variación Porcentual"), 1, 1, 'C');
        return $pdf;
    }

    public function crearCuerpo($pdf, $idestructura)
    {
        $estrutura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $fechaactual = date('Y/m/d');
        $pdf->SetLeftMargin(35);
        $pdf->AddPage();

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(50, 11, utf8_decode("Empresa:"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(150, 11, utf8_decode($estrutura[0]->denominacion), 1, 0, 'L');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(50, 11, utf8_decode("Fecha:"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(250, 11, $fechaactual, 1, 1, 'L');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 22, utf8_decode('Nº '), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(80, 22, utf8_decode("Categorías Ocupacionales"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("PLANTILLA"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("Contratos Indeterminados"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("Contratos Determinados"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("Variación CI"), 1, 0, 'C');
        $pdf->Cell(80, 10, utf8_decode("Variación CD"), 1, 1, 'C');
        $pdf->SetX(135);
        $pdf->Cell(40, 12, utf8_decode("Cant. de cargos "), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Peso Específico"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Cant. de cargos"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Peso Específico"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Cant. de cargos"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Peso Específico"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Variación absoluta"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Variación Porcentual"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Variación absoluta"), 1, 0, 'C');
        $pdf->Cell(40, 12, utf8_decode("Variación Porcentual"), 1, 1, 'C');
        $pdf->SetFont('Times', '', 10);

        $variacionabs=0;
        $variacionabs1=0;
        $total=0;
        $totalR=0;
        $totalV=0;
        $totalR1=0;
        $totalV1=0;

        $categorias = ZendExt_IoC::getInstance()->metadatos->dameCategoriaOcupacional(true);
        $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);

        $arracargos = Array();
        foreach ($cargo as $car) {
            array_push($arracargos, $car['idcargo']);
        }
        $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arracargos);

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT 
                  sl.*,tc.determinado
                FROM mod_persona.dat_situacionlaboral sl
                inner join mod_fuerzatrabajo.nom_tipocontrato tc on (tc.idtipocontrato = sl.idtipocontrato)
                where sl.idcargo in (".implode(',',$arracargos).") and sl.fhasta >= now() and tc.determinado = 1";
        $datossitLab = $conn->fetchAll($sql);
        $cargos = array();

        foreach ($datossitLab as $k => $sl){
            $cargos[$sl['idcargo']] = $sl;
        }
        foreach ($datoscargo as $dat) {
            foreach ($categorias as $key => $cat) {
                $cont = 0;
                if ($dat['idcategoria'] == $cat['idcategocup']) {
                    if ($dat['temporal'] == 0) {
                        $categorias[$key]['cant'] += $dat['cantidad'];
                        $total += $dat['cantidad'];
                        if ($dat['cantidadreal'] != 0) {
                            $categorias[$key]['cantreal'] += $dat['cantidadreal'];
                            $totalR += $dat['cantidadreal'];
//                            if ($dat['cantidadreal'] != 1) {
//                                $categorias[$key]['cantreal1'] += $dat['cantidadreal'];
//                                $totalR1 += $dat['cantidadreal'];
//                            }
                        } else {
                            $categorias[$key]['cantreal'] += 0;
                            $categorias[$key]['cantreal1'] += 0;
                        }
                        if($cargos[$dat['idcargo']]){
                            $cont++;
                            $categorias[$key]['cantreal1'] += $cont;
                            $totalR1 += $cont;
                        }
                }
                } else {
                    $categorias[$key]['cant'] += 0;
                    $categorias[$key]['cantreal'] += 0;
                    $categorias[$key]['cantreal1'] += 0;
                }
            }
        }
        $i = 1;
        foreach ($categorias as $key => $cat) {
            $pdf->Cell(20, 12, $i, 1, 0, 'C');
            $pdf->Cell(80, 12, utf8_decode($cat['denominacion']), 1, 0, 'C');
            $pdf->Cell(40, 12, $cat['cant'], 1, 0, 'C'); //can
            $pdf->Cell(40, 12, round($cat['cant'] * 100 / $total, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C'); //peso %
            $pdf->Cell(40, 12, $cat['cantreal'], 1, 0, 'C'); //can
            $pdf->Cell(40, 12, round($cat['cantreal'] * 100 / $totalR, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C'); //peso %
            $pdf->Cell(40, 12, $cat['cantreal1'], 1, 0, 'C'); //can
            $pdf->Cell(40, 12, round($cat['cantreal1'] * 100 / $totalR1, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C'); //peso %
            $variacionabs = $cat['cant'] -  $cat['cantreal'];
            $totalV+=$variacionabs;
            $variacionabs1 = $cat['cant'] -  $cat['cantreal1'];
            $totalV1+=$variacionabs1;
            $pdf->Cell(40, 12, $variacionabs, 1, 0, 'C');
            $pdf->Cell(40, 12, round($variacionabs /  $cat['cant'] * 100, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
            $pdf->Cell(40, 12, $variacionabs1, 1, 0, 'C');
            $pdf->Cell(40, 12, round($variacionabs1 /  $cat['cant'] * 100, 1, PHP_ROUND_HALF_UP) . '%', 1, 1, 'C');
            $i++;
        }

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(100, 12, utf8_decode('TOTAL'), 1, 0, 'L');
        $pdf->Cell(40, 12, $total, 1, 0, 'C');
       // $pdf->Cell(40, 12, '100%', 1, 0, 'C');
        $pdf->Cell(40, 12, round($total / $total * 100, 0, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $totalR, 1, 0, 'C');
        //$pdf->Cell(40, 12, '100%', 1, 0, 'C');
        $pdf->Cell(40, 12, round($totalR / $total * 100, 0, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $totalR1, 1, 0, 'C');
        //$pdf->Cell(40, 12, '100%', 1, 0, 'C');
        $pdf->Cell(40, 12, round($totalR1 / $total * 100, 0, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $totalV, 1, 0, 'C');
        //$pdf->Cell(40, 12, '100%', 1, 0, 'C');
        $pdf->Cell(40, 12, round($totalV / $total * 100, 0, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $totalV1, 1, 0, 'C');
        //$pdf->Cell(40, 12, '100%', 1, 0, 'C');
        $pdf->Cell(40, 12, round($totalV1 / $total * 100, 1, PHP_ROUND_HALF_UP) . '%', 1, 1, 'C');
        return $pdf;
    }

}

