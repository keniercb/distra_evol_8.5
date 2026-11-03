<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDFEstruc extends fpdf
{
}

class ReporteClasifPartModel extends ZendExt_Model
{
    public function ReporteClasifPartModel()
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
        $pdf->SetLeftMargin(35);
        $pdf->AddPage();

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(50, 11, utf8_decode("Empresa:"), 1, 0, 'C');
        $pdf->Cell(150, 11, "", 1, 0, 'C');
        $pdf->Cell(50, 11, utf8_decode("OSD:"), 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(150, 11, "", 1, 1, 'C');
        $pdf->Cell(50, 11, utf8_decode("UEB:"), 1, 0, 'C');
        $pdf->Cell(150, 11, "", 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(50, 11, utf8_decode("Fecha:"), 1, 0, 'C');
        $pdf->Cell(150, 11, "", 1, 1, 'C');

        $pdf->Cell(20, 22, utf8_decode('Nº '), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(80, 22, utf8_decode("Categorías Laborales"), 1, 0, 'C');
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
        $pdf->Cell(50, 11, utf8_decode("Fecha:"), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(250, 11, $fechaactual, 1, 1, 'L');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(20, 22, utf8_decode('Nº '), 1, 0, 'C');
        $pdf->SetFont('Times', '', 10);
        $pdf->Cell(80, 22, utf8_decode("Denominación"), 1, 0, 'C');
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

        $dir = 0;
        $dirR = 0;
        $dirR1 = 0;
        $dirV = 0;
        $dirV1 = 0;
        $ind = 0;
        $indR = 0;
        $indR1 = 0;
        $indV = 0;
        $indV1 = 0;
        $total = 0;
        $totalR = 0;
        $totalR1 = 0;
        $totalV = 0;
        $totalV1 = 0;

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
        
        //Conteo por cantidades y cantidades reales de un mismo cargo y teniendo en cuenta si el cargo
        // es temporal o no y que tenga un idcategoria ocupacional (que sea un cargo civil):
        foreach ($datoscargo as $dat) {
            $cont = 0;
            $cont1 = 0;
            if ($dat['temporal'] == 0 && $dat['idcategoria'] != null) {
                if ($dat['directo'] == 1) {
                    $dir += $dat['cantidad'];
                    if ($dat['cantidadreal'] != 0) {
                        $dirR += $dat['cantidadreal'];
                    }
                    if($cargos[$dat['idcargo']]){
                        $cont++;
                        $datoscargo['cantidadreal'] += $cont;
                        $dirR1 += $cont;
                    }
                } else {
                    $ind += $dat['cantidad'];
                    if ($dat['cantidadreal'] != 0) {
                        $indR += $dat['cantidadreal'];
                    }
                if($cargos[$dat['idcargo']]){
                    $cont1++;
                    $datoscargo['cantidadreal'] += $cont1;
                    $indR1 += $cont1;
                }
            }
        }
    }

        $total = $dir + $ind;
        $totalR = $dirR + $indR;
        $totalR1 = $dirR1 + $indR1;
        $dirV = $dir - $dirR;
        $indV = $ind - $indR;
        $totalV = $dirV + $indV;
        $dirV1 = $dir - $dirR1;
        $indV1 = $ind - $indR1;
        $totalV1 = $dirV1 + $indV1;
        
        $pdf->Cell(20, 12, '1', 1, 0, 'C');
        $pdf->Cell(80, 12, 'Directos', 1, 0, 'C');
        $pdf->Cell(40, 12, $dir, 1, 0, 'C'); //can
        $pdf->Cell(40, 12, round($dir * 100 / $total, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C'); 
        $pdf->Cell(40, 12, $dirR, 1, 0, 'C'); //can
        $pdf->Cell(40, 12, round($dirR * 100 / $totalR, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C'); //peso %
        $pdf->Cell(40, 12, $dirR1, 1, 0, 'C');
        $pdf->Cell(40, 12, round($dirR1 * 100 / $totalR1, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C'); //peso %
        $pdf->Cell(40, 12, $dirV, 1, 0, 'C');
        $pdf->Cell(40, 12, round($dirV * 100 / $totalV, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $dirV1, 1, 0, 'C');
        $pdf->Cell(40, 12, round($dirV1 * 100 / $totalV1, 1, PHP_ROUND_HALF_UP) . '%', 1, 1, 'C');

        $pdf->Cell(20, 12, '2', 1, 0, 'C');
        $pdf->Cell(80, 12, 'Indirectos', 1, 0, 'C');
        $pdf->Cell(40, 12, $ind, 1, 0, 'C'); //can
        $pdf->Cell(40, 12, round($ind * 100 / $total, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C'); //peso %
        $pdf->Cell(40, 12, $indR, 1, 0, 'C'); //can
        $pdf->Cell(40, 12, round($indR * 100 / $totalR, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C'); //peso %
        $pdf->Cell(40, 12, $indR1, 1, 0, 'C');
        $pdf->Cell(40, 12, round($indR1 * 100 / $totalR1, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C'); //peso %
        $pdf->Cell(40, 12, $indV, 1, 0, 'C');
        $pdf->Cell(40, 12, round($indV * 100 / $totalV, 1, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $indV1, 1, 0, 'C');
        $pdf->Cell(40, 12, round($indV1 * 100 / $totalV1, 1, PHP_ROUND_HALF_UP) . '%', 1, 1, 'C');

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(100, 12, utf8_decode('TOTAL'), 1, 0, 'L');
        $pdf->Cell(40, 12, $total, 1, 0, 'C');
      //  $pdf->Cell(40, 12, '', 1, 0, 'C');
        $pdf->Cell(40, 12, round($total / $total * 100, 0, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $totalR, 1, 0, 'C');
       // $pdf->Cell(40, 12, '', 1, 0, 'C');
        $pdf->Cell(40, 12, round($totalR / $total * 100, 0, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $totalR1, 1, 0, 'C');
      //  $pdf->Cell(40, 12, '', 1, 0, 'C');
        $pdf->Cell(40, 12, round($totalR1 / $total * 100, 0, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $totalV, 1, 0, 'C');
       // $pdf->Cell(40, 12, '', 1, 0, 'C');
        $pdf->Cell(40, 12, round($totalV / $total * 100, 0, PHP_ROUND_HALF_UP) . '%', 1, 0, 'C');
        $pdf->Cell(40, 12, $totalV1, 1, 0, 'C');
      //  $pdf->Cell(40, 12, '', 1, 1, 'C');
        $pdf->Cell(40, 12, round($totalV1 / $total * 100, 1, PHP_ROUND_HALF_UP) . '%', 1, 1, 'C');
        return $pdf;
    }
}
