<?php

$dirwww = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirwww . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReporteClasifPartexcelModel extends ZendExt_Model
{
    public function ReporteClasifPartexcelModel()
    {
        parent::ZendExt_Model();
    }
    
    public function fnPintarBordes(&$objPHPExcel, $celda, $lado, $tipoborde)
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

    public function fnAlinearTexto(&$objPHPExcel, $celda, $hor, $ver, $rot)
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

    public function fnFuenteTexto(&$objPHPExcel, $celda, $name, $size)
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

    public function fnFormatoNumeros(&$objPHPExcel, $celda)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getNumberFormat()->applyFromArray(
            array(
                'code' => PHPExcel_Style_NumberFormat::FORMAT_NUMBER_00
            )
        );
    }
    
    public function fnPintarEncabezado(&$objPHPExcel, $idestructura, $titulo, $numerohoja)
    {
        $estrutura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $fechaactual = date('d/m/Y');
        
        $objPHPExcel->setActiveSheetIndex($numerohoja);
        $objPHPExcel->getActiveSheet()->setTitle($titulo);
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, 7, 1);
        $objPHPExcel->getActiveSheet()->setCellValue(
            'A1', 
            'Clasificación según participación en el proceso de producción o servicios'
        );
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
        $letrarecorrer = 1;
        for ($i = 0; $i < 8; $i++) {
            $letrrecorr = chr($letrarecorrer + 64);
            //Dandole border 'buttoms' a la celda
            $this->fnPintarBordes($objPHPExcel, $letrrecorr . '1', 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
            $letrarecorrer++;
        }
        $objPHPExcel->getActiveSheet()->setCellValue('A2', 'Empresa:');
        $this->fnAlinearTexto($objPHPExcel, 'A2', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'A2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);       
        
        $objPHPExcel->getActiveSheet()->mergeCells('B2:D2');
        $objPHPExcel->getActiveSheet()->setCellValue('B2', $estrutura[0]->denominacion);
        $this->fnPintarBordes($objPHPExcel, 'B2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('E2', 'Fecha:');
        $this->fnAlinearTexto($objPHPExcel, 'E2', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'E2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('F2:H2');
        $objPHPExcel->getActiveSheet()->setCellValue('F2', $fechaactual);
        $this->fnPintarBordes($objPHPExcel, 'F2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('A3:A4');
        $objPHPExcel->getActiveSheet()->setCellValue('A3', 'Nº');
        $this->fnAlinearTexto($objPHPExcel, 'A3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'A3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('B3:B4');
        $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Denominación');
        $this->fnAlinearTexto($objPHPExcel, 'B3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'B3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('C3:D3');
        $objPHPExcel->getActiveSheet()->setCellValue('C3', 'PLANTILLA');
        $this->fnAlinearTexto($objPHPExcel, 'C3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'C3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('C4', 'Cant. de cargos');
        $this->fnAlinearTexto($objPHPExcel, 'C4', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'C4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('D4', 'Peso Específico');
        $this->fnAlinearTexto($objPHPExcel, 'D4', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'D4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('E3:F3');
        $objPHPExcel->getActiveSheet()->setCellValue('E3', 'REAL CUBIERTOS');
        $this->fnAlinearTexto($objPHPExcel, 'E3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'E3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('E4', 'Cant. de cargos');
        $this->fnAlinearTexto($objPHPExcel, 'E4', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'E4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('F4', 'Peso Específico');
        $this->fnAlinearTexto($objPHPExcel, 'F4', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'F4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('G3:H3');
        $objPHPExcel->getActiveSheet()->setCellValue('G3', 'Variación');
        $this->fnAlinearTexto($objPHPExcel, 'G3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'G3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('G4', 'Variación Absoluta');
        $this->fnAlinearTexto($objPHPExcel, 'G4', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'G4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('H4', 'Variación Porcentual');
        $this->fnAlinearTexto($objPHPExcel, 'H4', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'H4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $dir = 0;
        $dirR = 0;
        $ind = 0;
        $indR = 0;
        $total = 0;
        $totalR = 0;
        $dirV = 0;
        $indV = 0;

        $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);

        $arracargos = Array();
        foreach ($cargo as $car) {
            array_push($arracargos, $car['idcargo']);
        }

        $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arracargos);

        foreach ($datoscargo as $dat) {
            if ($dat['temporal'] == 0 && $dat['idcategoria'] != null) {
                if ($dat['directo'] == 1) {
                    $dir += $dat['cantidad'];
                    if ($dat['cantidadreal'] != 0) {
                        $dirR += $dat['cantidadreal'];
                    }
                } else {
                    $ind += $dat['cantidad'];
                    if ($dat['cantidadreal'] != 0) {
                        $indR += $dat['cantidadreal'];
                    }
                }
            }
        }
        
        $total = $dir + $ind;
        $totalR = $dirR + $indR;
        $dirV = $dir - $dirR;
        $indV = $ind - $indR;
        
        //Fila Directos:
        $objPHPExcel->getActiveSheet()->setCellValue('A5', 1);
        $this->fnAlinearTexto($objPHPExcel, 'A5', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'A5', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('B5', 'Directos');
        $this->fnPintarBordes($objPHPExcel, 'B5', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('C5', $dir);
        $this->fnAlinearTexto($objPHPExcel, 'C5', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'C5', 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('D5', round($dir * 100 / $total, 1, PHP_ROUND_HALF_UP) . '%');
        $this->fnAlinearTexto($objPHPExcel, 'D5', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'D5', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('E5', $dirR);
        $this->fnAlinearTexto($objPHPExcel, 'E5', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'E5', 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('F5', round($dirR * 100 / $totalR, 1, PHP_ROUND_HALF_UP) . '%');
        $this->fnAlinearTexto($objPHPExcel, 'F5', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'F5', 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('G5', $dirV);
        $this->fnAlinearTexto($objPHPExcel, 'G5', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'G5', 'right', PHPExcel_Style_Border::BORDER_THIN);

        $objPHPExcel->getActiveSheet()->setCellValue('H5', round($dirV / $dir * 100, 1, PHP_ROUND_HALF_UP) . '%');
        $this->fnAlinearTexto($objPHPExcel, 'H5', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'H5', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        //Fila Indirectos:
        $objPHPExcel->getActiveSheet()->setCellValue('A6', 2);
        $this->fnAlinearTexto($objPHPExcel, 'A6', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'A6', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('B6', 'Indirectos');
        $this->fnPintarBordes($objPHPExcel, 'B6', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('C6', $ind);
        $this->fnAlinearTexto($objPHPExcel, 'C6', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'C6', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('D6', round($ind * 100 / $total, 1, PHP_ROUND_HALF_UP) . '%');
        $this->fnAlinearTexto($objPHPExcel, 'D6', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'D6', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('E6', $indR);
        $this->fnAlinearTexto($objPHPExcel, 'E6', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'E6', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('F6', round($indR * 100 / $totalR, 1, PHP_ROUND_HALF_UP) . '%');
        $this->fnAlinearTexto($objPHPExcel, 'F6', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'F6', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('G6', $indV);
        $this->fnAlinearTexto($objPHPExcel, 'G6', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'G6', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('H6', round($indV / $ind * 100, 1, PHP_ROUND_HALF_UP) . '%');
        $this->fnAlinearTexto($objPHPExcel, 'H6', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'H6', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        //Fila Total:
        $objPHPExcel->getActiveSheet()->mergeCells('A7:B7');
        $objPHPExcel->getActiveSheet()->setCellValue('A7', 'Total');
        $this->fnAlinearTexto($objPHPExcel, 'A7', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'A7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'A7', 'Arial', 11);
        
        $objPHPExcel->getActiveSheet()->setCellValue('C7', $total);
        $this->fnAlinearTexto($objPHPExcel, 'C7', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'C7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'C7', 'Arial', 11);
        
        $this->fnPintarBordes($objPHPExcel, 'D7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('E7', $totalR);
        $this->fnAlinearTexto($objPHPExcel, 'E7', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'E7', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E7', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E7', 'left', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'E7', 'Arial', 11);

        $this->fnPintarBordes($objPHPExcel, 'F7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H7', 'top', PHPExcel_Style_Border::BORDER_THIN);
        
        
        //Cambiandole la dimensión a las filas
        $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(25);
        $objPHPExcel->getActiveSheet()->getRowDimension(2)->setRowHeight(20);
        $objPHPExcel->getActiveSheet()->getRowDimension(15)->setRowHeight(20);
        //Cambiandole la dimensión a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(15);  
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(15);  
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(15);  
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(15);  
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(15);  
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(15); 
        
    }

    public function exportarExcel($idestructura)
    {
        $r = null;
        
        $objPHPExcel = new PHPExcel();

        $this->fnPintarEncabezado($objPHPExcel, $idestructura, 'Part. proceso de prod. o serv.', 0);

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Reporte.xls" ');
        header('Cache-Control: max-age=0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));

        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        
        echo json_encode($r);
    }
}
