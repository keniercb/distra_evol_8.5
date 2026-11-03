<?php

$dirwww = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirwww . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReportestructuraftexcelModel extends ZendExt_Model
{
    public function ReportestructuraftexcelModel()
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
        //Concatenando la primera fila para escribir "Clasificacion por categorias ocupacionales"
        $objPHPExcel->getActiveSheet()->setCellValue('A1', 'Clasificación por categorías ocupacionales');
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
        $letrarecorrer = 1;
        for ($i = 0; $i < 8; $i++) {
            $letraconvertidarecorrer = chr($letrarecorrer + 64);
            //Dandole border 'buttoms' a la celda
            $this->fnPintarBordes(
                $objPHPExcel,
                $letraconvertidarecorrer . '1',
                'bottom',
                PHPExcel_Style_Border::BORDER_MEDIUM
            );
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
        $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Categorías Ocupacionales');
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
        
        $variacionabs = 0;
        $total = 0;
        $totalR = 0;
        $totalV = 0;

        $categorias = ZendExt_IoC::getInstance()->metadatos->dameCategoriaOcupacional(true);
        $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);

        $arracargos = Array();
        foreach ($cargo as $car) {
            array_push($arracargos, $car['idcargo']);
        }
        $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arracargos);
        foreach ($datoscargo as $dat) {
            foreach ($categorias as $key => $cat) {
                if ($dat['idcategoria'] == $cat['idcategocup']) {
                    if ($dat['temporal'] == 0) {
                        $categorias[$key]['cant'] += $dat['cantidad'];
                        $total += $dat['cantidad'];
                        if ($dat['cantidadreal'] != 0) {
                            $categorias[$key]['cantreal'] += $dat['cantidadreal'];
                            $totalR += $dat['cantidadreal'];
                        } else {
                            $categorias[$key]['cantreal'] += 0;
                        }
                    }
                } else {
                    $categorias[$key]['cant'] += 0;
                    $categorias[$key]['cantreal'] += 0;
                }
            }
        }
        
        $i = 1;
        $j = 5;
        foreach ($categorias as $key => $cat) {
            $objPHPExcel->getActiveSheet()->setCellValue('A'.$j, $i);
            $this->fnAlinearTexto($objPHPExcel, 'A'.$j, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'A'.$j, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('B'.$j, $cat['denominacion']);
            $this->fnPintarBordes($objPHPExcel, 'B'.$j, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('C'.$j, $cat['cant']);
            $this->fnAlinearTexto($objPHPExcel, 'C'.$j, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'C'.$j, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue(
                'D'.$j,
                round($cat['cant'] * 100 / $total, 1, PHP_ROUND_HALF_UP) . '%'
            );
            $this->fnAlinearTexto($objPHPExcel, 'D'.$j, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'D'.$j, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('E'.$j, $cat['cantreal']);
            $this->fnAlinearTexto($objPHPExcel, 'E'.$j, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'E'.$j, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue(
                'F'.$j,
                round($cat['cantreal'] * 100 / $totalR, 1, PHP_ROUND_HALF_UP) . '%'
            );
            $this->fnAlinearTexto($objPHPExcel, 'F'.$j, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'F'.$j, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $variacionabs = $cat['cant'] -  $cat['cantreal'];
            $totalV += $variacionabs;
            
            $objPHPExcel->getActiveSheet()->setCellValue('G'.$j, $variacionabs);
            $this->fnAlinearTexto($objPHPExcel, 'G'.$j, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'G'.$j, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue(
                'H'.$j,
                round($variacionabs /  $cat['cant'] * 100, 1, PHP_ROUND_HALF_UP) . '%'
            );
            $this->fnAlinearTexto($objPHPExcel, 'H'.$j, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'H'.$j, 'right', PHPExcel_Style_Border::BORDER_THIN);

            $i++;
            $j++;
        }
        
        $objPHPExcel->getActiveSheet()->mergeCells('A15:B15');
        $objPHPExcel->getActiveSheet()->setCellValue('A15', 'Total');
        $this->fnAlinearTexto($objPHPExcel, 'A15', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'A15', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A15', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B15', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B15', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B15', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'A15', 'Arial', 11);
        
        $objPHPExcel->getActiveSheet()->setCellValue('C15', $total);
        $this->fnAlinearTexto($objPHPExcel, 'C15', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'C15', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C15', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C15', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'C15', 'Arial', 11);
        
        $objPHPExcel->getActiveSheet()->setCellValue('D15', '100%');
        $this->fnAlinearTexto($objPHPExcel, 'D15', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'D15', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D15', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D15', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'D15', 'Arial', 11);
        
        $objPHPExcel->getActiveSheet()->setCellValue('E15', $totalR);
        $this->fnAlinearTexto($objPHPExcel, 'E15', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'E15', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E15', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E15', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'E15', 'Arial', 11);
        
        $objPHPExcel->getActiveSheet()->setCellValue('F15', '100%');
        $this->fnAlinearTexto($objPHPExcel, 'F15', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'F15', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F15', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F15', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'F15', 'Arial', 11);
        
        $objPHPExcel->getActiveSheet()->setCellValue('G15', $totalV);
        $this->fnAlinearTexto($objPHPExcel, 'G15', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'G15', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G15', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G15', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'G15', 'Arial', 11);
        
        $objPHPExcel->getActiveSheet()->setCellValue('H15', round($totalV / $total * 100, 1, PHP_ROUND_HALF_UP) . '%');
        $this->fnAlinearTexto($objPHPExcel, 'H15', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'H15', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H15', 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H15', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'H15', 'Arial', 11);
        

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

        $this->fnPintarEncabezado($objPHPExcel, $idestructura, 'Clasif. por Cat. Ocup.', 0);

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //Codigo para exportar el documento Excel. Para salvar en un directorio usar la direccion en el save;
        // echo($objWriter->save('directorio'));
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
