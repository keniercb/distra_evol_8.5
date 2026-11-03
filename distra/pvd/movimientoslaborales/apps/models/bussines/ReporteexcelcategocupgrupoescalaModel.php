<?php

$dirWWW = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirWWW . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReporteexcelcategocupgrupoescalaModel extends ZendExt_Model
{
    public function ReporteexcelcategocupgrupoescalaModel()
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
        $fechaactual = date('d/m/Y');
        
        $modeloDatos = new DatoscategocupgrupoescalaModel();
        $datos = $modeloDatos->getDatos($idestructura);
        
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $entidad = $entidad[0]->denominacion;
        
        $alfabeto = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N',
                    'O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB',
                    'AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM',
                    'AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX',
                    'AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BI',
                    'BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT',
                    'BU','BV','BW','BX','BY','BZ'];               
        
        $objPHPExcel->setActiveSheetIndex($numerohoja);
        $objPHPExcel->getActiveSheet()->setTitle($titulo);
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, 12, 1);
        
        //Concatenando la primera fila para escribir el encabezado del reporte:
        $objPHPExcel->getActiveSheet()->setCellValue(
            'A1', "Distribución de los Trabajadores por Categoría Ocupacional y Grupo de la Escala"
        );
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
        
        
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 2, 12, 2);
        
        //Concatenando la segunda fila para escribir el encabezado del reporte:
        $objPHPExcel->getActiveSheet()->setCellValue(
            'A2', "Entidad: $entidad     $fechaactual"
        );
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A2', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A2', 'Arial', 11);
        
        for ($i = 0; $i < 13; $i++) {
            //Dandole border 'buttoms' a la celda
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
        }
        
        
        $objPHPExcel->getActiveSheet()->setCellValue('A3', 'Grupo Escala');
        $this->fnPintarBordes($objPHPExcel, 'A3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A3', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
        
        $objPHPExcel->getActiveSheet()->mergeCells('B3:C3');
        $objPHPExcel->getActiveSheet()->setCellValue('B3', 'Operarios');
        $this->fnAlinearTexto($objPHPExcel, 'B3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'B3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('D3:E3');
        $objPHPExcel->getActiveSheet()->setCellValue('D3', 'Servicio');
        $this->fnAlinearTexto($objPHPExcel, 'D3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'D3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('F3:G3');
        $objPHPExcel->getActiveSheet()->setCellValue('F3', 'Administrativos');
        $this->fnAlinearTexto($objPHPExcel, 'F3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'F3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('H3:I3');
        $objPHPExcel->getActiveSheet()->setCellValue('H3', 'Técnicos');
        $this->fnAlinearTexto($objPHPExcel, 'H3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'H3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'I3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'I3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('J3:K3');
        $objPHPExcel->getActiveSheet()->setCellValue('J3', 'Cuadros');
        $this->fnAlinearTexto($objPHPExcel, 'J3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'J3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'K3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'K3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('L3:M3');
        $objPHPExcel->getActiveSheet()->setCellValue('L3', 'Total');
        $this->fnAlinearTexto($objPHPExcel, 'L3', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'L3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'M3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'M3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->setCellValue('A4', 'A');
        $this->fnAlinearTexto($objPHPExcel, 'A4', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, 'A4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        for ($i = 1; $i < 13; $i++) {
            if ($i % 2 == 0) {
                $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . '4', 'Mujeres');
                $this->fnAlinearTexto($objPHPExcel, $alfabeto[$i] . '4', 'center', '', 0);
                $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '4', 'right', PHPExcel_Style_Border::BORDER_THIN);
            } else {
                $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . '4', 'Total');
                $this->fnAlinearTexto($objPHPExcel, $alfabeto[$i] . '4', 'center', '', 0);
                $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '4', 'right', PHPExcel_Style_Border::BORDER_THIN);
            }
        }
        
        //Para conjelar las 4 primeras filas con el encabezado:
        $objPHPExcel->getActiveSheet()->freezePane('A5');
        
        $row = 5;
        foreach ($datos as $key => $value) {
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $row, $value['denominacion']);
            $this->fnAlinearTexto($objPHPExcel, 'A' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'A' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'A' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $row, $value['totaloperarios']);
            $this->fnAlinearTexto($objPHPExcel, 'B' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'B' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'B' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $row, $value['mujeresoperarios']);
            $this->fnAlinearTexto($objPHPExcel, 'C' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'C' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'C' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $row, $value['totalservicio']);
            $this->fnAlinearTexto($objPHPExcel, 'D' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'D' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'D' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $row, $value['mujeresservicio']);
            $this->fnAlinearTexto($objPHPExcel, 'E' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'E' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'E' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $row, $value['totaladministrativos']);
            $this->fnAlinearTexto($objPHPExcel, 'F' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'F' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('G' . $row, $value['mujeresadministrativos']);
            $this->fnAlinearTexto($objPHPExcel, 'G' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'G' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'G' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $row, $value['totaltecnicos']);
            $this->fnAlinearTexto($objPHPExcel, 'H' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'H' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'H' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('I' . $row, $value['mujerestecnicos']);
            $this->fnAlinearTexto($objPHPExcel, 'I' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'I' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'I' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('J' . $row, $value['totalcuadros']);
            $this->fnAlinearTexto($objPHPExcel, 'J' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'J' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'J' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('K' . $row, $value['mujerescuadros']);
            $this->fnAlinearTexto($objPHPExcel, 'K' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'K' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'K' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('L' . $row, $value['total']);
            $this->fnAlinearTexto($objPHPExcel, 'L' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'L' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'L' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('M' . $row, $value['mujerestotal']);
            $this->fnAlinearTexto($objPHPExcel, 'M' . $row, 'center', '', 0);
            $this->fnPintarBordes($objPHPExcel, 'M' . $row, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'M' . $row, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            $row++;
        }
        
        //Cambiandole la dimensión a las filas
        $objPHPExcel->getActiveSheet()->getRowDimension(3)->setRowHeight(20);
        //Cambiandole la dimensión a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(12);
        
    }

    public function exportarExcel($idestructura, $fdesde, $fhasta)
    {
        $r = null;
        
        $objPHPExcel = new PHPExcel();

        $this->fnPintarEncabezado($objPHPExcel, $idestructura, 'Categ. Ocupacional y GE', 0);

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //Codigo para exportar el documento Excel. 
        //Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Reporte.xls" ');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));

        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        
        echo json_encode($r);
    }
}
