<?php

$dirWWW = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirWWW . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReporteexcelrelacioncargoModel extends ZendExt_Model
{
    public function ReporteexcelrelacioncargoModel()
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
    
    public function fnPintarEncabezado(&$objPHPExcel, $idestructura, $decisorios, $idfacultado, $facultado, $numerohoja)
    {
        $cantColumnas = 6;
        
        $alfabeto = ['A','B','C','D','E','F'];
        
        $objPHPExcel->setActiveSheetIndex($numerohoja);
        $objPHPExcel->getActiveSheet()->setTitle('Cuadros');
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, $cantColumnas - 1, 1);
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 2, $cantColumnas - 1, 2);
        //Concatenando la primera fila para escribir el encabezado del reporte:
        $enc = '';
        if (!empty($decisorios)) {
            if ($enc != '') {
                $enc .= ', ';
            }
            $enc .= 'Decisorio';
        }
        if (!empty($facultado)){
            if ($enc != '') {
                $enc .= ', ';
            }
            $enc .= 'FACULTAD: '.$facultado;
        }
        $objPHPExcel->getActiveSheet()->setCellValue('A1', "RELACIÓN DE CARGOS");
        $objPHPExcel->getActiveSheet()->setCellValue('A2', $enc);
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A2', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A2', 'Arial', 13);

        $columnas = array(
                'Denominación Órgano / Cargo', 'Categoría', 'Cantidad', 'Nivel de Preparación', 'Decisorio', 'Facultad'
            );
        $this->fnPintarBordes($objPHPExcel, 'A2', 'left', PHPExcel_Style_Border::BORDER_THIN);
        for ($i = 0; $i < $cantColumnas; $i++) {
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . '3', $columnas[$i]);
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$i] . '3', 'Calibri', 11);
            $this->fnAlinearTexto($objPHPExcel, $alfabeto[$i] . '3', 'center', '', '');
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        }
        
        //Para congelar las 2 primeras filas con el encabezado:
        $objPHPExcel->getActiveSheet()->freezePane('A4');
        $fila = 4;
        $datos = ReportepdfrelacioncargosModel::obtenerDatos($idestructura, $decisorios, $idfacultado);
        foreach ($datos as $k=>$value) {
            if ($value['idarea'] != $datos[$k - 1]['idarea']) {
                $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($value['idarea']);
                $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $area[0]->denominacion);
                for ($a = 0; $a < 6; $a++) {
                    $this->fnPintarBordes($objPHPExcel, $alfabeto[$a]. $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $alfabeto[$a]. $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                }
                $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnFuenteTexto($objPHPExcel, 'A' . $fila, 'Calibri', 11);
                $fila++;
            }
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $value['denomcargo']);
            $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $value['categocup']);
            $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'B' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $value['cantidad']);
            $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'C' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $value['denompreparacion']);
            $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, ($value['decisorio']==1)?'Si':'No');
            $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'E' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $fila, $value['facultad']);
            $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'F' . $fila, 'center', '', '');
            if ($k == count($datos)-1) {
                for ($i = 0; $i < 6; $i++) {
                    $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                }
            }
            $fila++;
        }

        //Cambiandole la dimensión a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(40);
        $anchoColumnas = array(20, 10, 20, 15, 40);
        for ($i = 1; $i < count($anchoColumnas); $i++) {
            $objPHPExcel->getActiveSheet()->getColumnDimension($alfabeto[$i])->setWidth($anchoColumnas[$i-1]);
        }        
        
    }

    public function exportarExcel($idestructura, $decisorio, $idfacultado, $facultado)
    {
        $r = null;
        
        $objPHPExcel = new PHPExcel();

        $this->fnPintarEncabezado($objPHPExcel, $idestructura, $decisorio, $idfacultado, $facultado, 0);

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //Codigo para exportar el documento Excel. 
        //Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Relacion_cuadros.xls" ');
        header(
        'Pragma: no-cache');
        header('Expires: 0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));

        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        
        echo json_encode($r);
    }
}
