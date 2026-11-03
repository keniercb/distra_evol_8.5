<?php

$dirwww = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirwww . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReporteexcelpromediotrabajadoresModel extends ZendExt_Model
{
    public function ReporteexcelpromediotrabajadoresModel()
    {
        parent::ZendExt_Model();
    }

    function exportarExcel($estructura,$fdesde,$fhasta,$result)
    {
        $objPHPExcel = new PHPExcel();
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('PROMEDIO DE TRABAJADORES');
        $this->fnFuenteTexto($objPHPExcel, 'D2', 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('D2', 'PROMEDIO DE TRABAJADORES');
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($estructura);
        $objPHPExcel->getActiveSheet()->setCellValue('A4', 'ENTIDAD: '.$entidad[0]->denominacion);
        $objPHPExcel->getActiveSheet()->setCellValue('A5', 'FECHA: '. date('d/m/Y'));
        $fini = explode('-', $fdesde);
        $ff = explode('-', $fhasta);
        $finicio = substr($fini[2], 0, 2) . '/' . $fini[1] . '/' . $fini[0];
        $ffin = substr($ff[2], 0, 2) . '/' . $ff[1] . '/' . $ff[0];
        $objPHPExcel->getActiveSheet()->setCellValue('H5', 'PERÍODO: '. $finicio.' - '.$ffin);

        $objPHPExcel->getActiveSheet()->getColumnDimension("A")->setWidth(26);

        $objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(1, 7, 2, 7);

        $rcampos = array('TOTAL REGISTRO');
        $this->fnPintarBordes($objPHPExcel, 'B7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B7', 'right', PHPExcel_Style_Border::BORDER_THIN);

        $this->fnPintarBordes($objPHPExcel, 'C7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C7', 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('A7', 'DÍAS DEL');
        $this->fnPintarBordes($objPHPExcel, 'A7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'A7', 'center', '', 0);

        $objPHPExcel->getActiveSheet()->setCellValue('A8', 'CALENDARIO');
        $this->fnPintarBordes($objPHPExcel, 'A8', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A8', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A8', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'A8', 'center', '', 0);
        $colmerge = 3;
        foreach ($result['catocup'] as $cat) {
            $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow($colmerge, 7, $colmerge + 1, 7);
            $colmerge+=2;
            $rcampos[] = $cat;
        }
        $letraactual = '';
        $iterletra = 1;
        foreach ($rcampos as $ind => $campo) {
            $letraactual = (($iterletra + 1) < 27) ? chr(($iterletra + 1) + 64) : 'A' . chr(($iterletra + 1) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual . '7', $campo);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '7', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual . '7', 'center', '', 0);
            $iterletra+=2;
        }

        $iterletra = 1;
        for ($i = 0; $i < count($rcampos) * 2;$i++) {
            $letraactual = (($iterletra + 1) < 27) ? chr(($iterletra + 1) + 64) : 'A' . chr(($iterletra + 1) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual . '8', ($iterletra % 2) == 0 ? 'MUJERES' : 'TOTAL');
            $this->fnPintarBordes($objPHPExcel, $letraactual . '8', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '8', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '8', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '8', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual . '8', 'center', '', 0);

            $this->fnPintarBordes($objPHPExcel, $letraactual . '7', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '7', 'right', PHPExcel_Style_Border::BORDER_THIN);

            $iterletra++;
        }

        $row = 9;
        foreach ($result['resultado'] as $ind => $campo) {
            $objPHPExcel->getActiveSheet()->setCellValue('A'.$row, $ind);
            $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'A'.$row, 'center', '', 0);

            $objPHPExcel->getActiveSheet()->setCellValue('B'.$row, $campo['total']['total']);
            $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'B'.$row, 'center', '', 0);

            $objPHPExcel->getActiveSheet()->setCellValue('C'.$row, $campo['total']['mujer']);
            $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'C'.$row, 'center', '', 0);

            $iterletra = 4;
            foreach ($campo as $key => $v) {
                $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
                if($key != 'total'){
                    $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row, $v['total']);
                    $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
                    $iterletra++;
                    $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
                    $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row, $v['mujer']);
                    $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
                    $iterletra++;
                }
            }
            $row++;
        }

        $objPHPExcel->getActiveSheet()->setCellValue('A'.$row, 'SUMA');
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('B'.$row, $result['suma']['total']['total']);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'B'.$row, 'center', '', 0);

        $objPHPExcel->getActiveSheet()->setCellValue('C'.$row, $result['suma']['total']['mujer']);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'C'.$row, 'center', '', 0);

        $iterletra = 4;
        foreach ($result['catocup'] as $cat) {
            $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
                $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row, $result['suma'][$cat]['total']);
                $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
                $iterletra++;
                $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
                $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row,  $result['suma'][$cat]['mujer']);
                $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
                $iterletra++;
        }
        $this->fnPintarFondo($objPHPExcel, 'A'.$row.':' . $letraactual.$row, PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
        $row++;

        $objPHPExcel->getActiveSheet()->setCellValue('A'.$row, 'PROM TRAB SEGÚN REGISTRO');
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('B'.$row, $result['promedio']['total']['total']);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'B'.$row, 'center', '', 0);

        $objPHPExcel->getActiveSheet()->setCellValue('C'.$row, $result['promedio']['total']['mujer']);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'C'.$row, 'center', '', 0);

        $iterletra = 4;
        foreach ($result['catocup'] as $cat) {
            $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row, $result['promedio'][$cat]['total']);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
            $iterletra++;
            $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row,  $result['promedio'][$cat]['mujer']);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
            $iterletra++;
        }
        $this->fnPintarFondo($objPHPExcel, 'A'.$row.':' . $letraactual.$row, PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
        $row++;

        $objPHPExcel->getActiveSheet()->setCellValue('A'.$row, 'PROMEDIO ADICIONES');
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('B'.$row, '0');
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'B'.$row, 'center', '', 0);

        $objPHPExcel->getActiveSheet()->setCellValue('C'.$row, '0');
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'C'.$row, 'center', '', 0);

        $iterletra = 4;
        foreach ($result['catocup'] as $cat) {
            $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row, '0');
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
            $iterletra++;
            $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row,  '0');
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
            $iterletra++;
        }
        $this->fnPintarFondo($objPHPExcel, 'A'.$row.':' . $letraactual.$row, PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
        $row++;

        $objPHPExcel->getActiveSheet()->setCellValue('A'.$row, 'PROMEDIO DEDUCCIONES');
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('B'.$row, '0');
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'B'.$row, 'center', '', 0);

        $objPHPExcel->getActiveSheet()->setCellValue('C'.$row, '0');
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'C'.$row, 'center', '', 0);

        $iterletra = 4;
        foreach ($result['catocup'] as $cat) {
            $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row, '0');
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
            $iterletra++;
            $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row,  '0');
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
            $iterletra++;
        }
        $this->fnPintarFondo($objPHPExcel, 'A'.$row.':' . $letraactual.$row, PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
        $row++;

        $objPHPExcel->getActiveSheet()->setCellValue('A'.$row, 'PROMEDIO TOTAL GENERAL');
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('B'.$row, '0');
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'B'.$row, 'center', '', 0);

        $objPHPExcel->getActiveSheet()->setCellValue('C'.$row, '0');
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C'.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnAlinearTexto($objPHPExcel, 'C'.$row, 'center', '', 0);

        $iterletra = 4;
        foreach ($result['catocup'] as $cat) {
            $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row, '0');
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
            $iterletra++;
            $letraactual = (($iterletra) < 27) ? chr(($iterletra) + 64) : 'A' . chr(($iterletra) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual.$row,  '0');
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual.$row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, $letraactual.$row, 'center', '', 0);
            $iterletra++;
        }

        //Pintar fondo de encabezado
        $this->fnPintarFondo($objPHPExcel, 'A'.$row.':' . $letraactual.$row, PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
        $this->fnPintarFondo($objPHPExcel, 'A7:' . $letraactual . '7', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
        $this->fnPintarFondo($objPHPExcel, 'A8:' . $letraactual . '8', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');


        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Promedio de trabajadores.xls" ');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        ini_restore("max_execution_time");
        ini_restore("max_input_time");
        ini_restore("memory_limit");
    }

    public
    function fnPintarFondo(&$objPHPExcel, $celda, $tipofondo, $color)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFill()->applyFromArray(array(
            'type' => $tipofondo,
            'startcolor' => array(
                'rgb' => $color
            )
        ));
    }

    public
    function fnPintarBordes(&$objPHPExcel, $celda, $lado, $tipoborde)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()->applyFromArray(
            array(
                $lado => array(
                    'style' => $tipoborde,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
    }

    /** Funcionalidad para alinear los textos de las celdas
     */
    public
    function fnAlinearTexto(&$objPHPExcel, $celda, $hor, $ver, $rot)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getAlignment()->applyFromArray(
            array(
                'horizontal' => $hor,
                'vertical' => $ver,
                'rotation' => $rot, //0 ó 90
                'wrap' => TRUE
            )
        );
    }

    /** Funcionalidad para dar la fuente a los textos
     */
    public
    function fnFuenteTexto(&$objPHPExcel, $celda, $name, $size)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFont()->applyFromArray(
            array(
                'name' => $name,
                'bold' => TRUE,
                'italic' => FALSE,
                'strike' => FALSE,
                'size' => $size,
                'color' => array(
                    'rgb' => '000000'
                )
            )
        );
    }

    /** Funcionalidad para el formato numérico
     */
    public
    function fnFormatoNumeros(&$objPHPExcel, $celda)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getNumberFormat()->applyFromArray(
            array(
                'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
            )
        );
    }
}
