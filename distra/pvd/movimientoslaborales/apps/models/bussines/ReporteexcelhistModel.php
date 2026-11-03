<?php

$dirWWW = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirWWW . '/pvd/comun/recursos/PHPExcel.php');
//include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
//include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Reader/Excel5.php');
//include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReporteexcelhistModel extends ZendExt_Model
{
    public function ReporteexcelcuadroModel()
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
    
    public function fnPintarEncabezado(&$objPHPExcel, $idestructura, $idcategocup, $categocup, $decisorios, $idfacultado, $facultado, $finicio, $ffin, $numerohoja)
    {
        $cantColumnas = 14;
        
        $alfabeto = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N'];
        
        $objPHPExcel->setActiveSheetIndex($numerohoja);
        $objPHPExcel->getActiveSheet()->setTitle('Cuadros');
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, $cantColumnas - 1, 1);
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 2, $cantColumnas - 1, 2);
        //Concatenando la primera fila para escribir el encabezado del reporte:
        $enc = '';
        if (!empty($categocup)) {
            $enc .= $categocup;
        }
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
        if (!empty($finicio) || !empty($ffin)) {
            $enc .= ', Desde: '.$finicio.'  Hasta: '.$ffin;
        }
        $objPHPExcel->getActiveSheet()->setCellValue(
            'A1', "RELACIÓN DE CARGOS HISTÓRICO "
        );
        $objPHPExcel->getActiveSheet()->setCellValue(
            'A2', $enc
        );
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A2', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A2', 'Arial', 13);

        $columnas = array(
                'Denominación del Cargo', 'Categ. Ocup.', 'Nombres y Apellidos', 'Sexo', 'Color de la piel',
                'Fecha de Nacimiento', 'Edad', 'Militancia Política', 'Nivel Escolar', 'Título de Graduado',
                'Fecha de Nombram.', 'Fecha de Movim.', 'Tiempo en cargo', 'Causa del movimiento'
            );
        $this->fnPintarBordes($objPHPExcel, 'A2', 'left', PHPExcel_Style_Border::BORDER_THIN);
        for ($i = 0; $i < $cantColumnas; $i++) {
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . '3', $columnas[$i]);
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$i] . '3', 'Calibri', 11);
            $this->fnAlinearTexto($objPHPExcel, $alfabeto[$i] . '3', 'center', '', '');
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        }
        
        //Para congelar las 3 primeras filas con el encabezado:
        $objPHPExcel->getActiveSheet()->freezePane('A3');
        $fila = 4;
        $objDS = new DatSituacionlaboralModel();
        $datos = $objDS->getReportHist($idestructura, $idcategocup, $decisorios, $idfacultado, $finicio, $ffin);
        foreach ($datos as $k=>$value) {
            if ($value['idarea'] != $datos[$k - 1]['idarea']) {
                $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($value['idarea']);
                $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $area[0]->denominacion);
                for ($i = 0; $i < 14; $i++) {
                    $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                }
                $this->fnPintarBordes($objPHPExcel, 'N' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnFuenteTexto($objPHPExcel, 'A' . $fila, 'Calibri', 11);
                $fila++;
            }
            $neduc = ZendExt_IoC_Inter::getInstance()->persona->getNivelEduByPersona($value['idpersona']);
            $niv = (isset($neduc[0]['neabr'])) ? $neduc[0]['neabr'] : $neduc[0]['niveleducacional'];
            $abrtitulo = (isset($neduc[0]['tituloabr'])) ? $neduc[0]['tituloabr'] : $neduc[0]['titulo'];
            $causa = (!empty($value['mm']))? $value['mm']: $value['mb'];
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $value['cargo']);
            $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $value['coabrev']);
            $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'B' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $value['nombreyapellidos']);
            $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $value['sexo']);
            $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'D' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $value['colorpiel']);
            $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'E' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $fila, $value['fechanacimiento']);
            $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'F' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, $value['edad']);
            $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'G' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $fila, $value['militancia']);
            $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'H' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('I' . $fila, $niv);
            $this->fnPintarBordes($objPHPExcel, 'I' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'I' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('J' . $fila, $abrtitulo);
            $this->fnPintarBordes($objPHPExcel, 'J' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'J' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('K' . $fila, $value['fnombr']);
            $this->fnPintarBordes($objPHPExcel, 'K' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'K' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('L' . $fila, $value['fmov']);
            $this->fnPintarBordes($objPHPExcel, 'L' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'L' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('M' . $fila, $value['tiempoa'].' a '.$value['tiempom'].' m');
            $this->fnPintarBordes($objPHPExcel, 'M' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'M' . $fila, 'center', '', '');
            $objPHPExcel->getActiveSheet()->setCellValue('N' . $fila, $causa);
            $this->fnPintarBordes($objPHPExcel, 'N' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnAlinearTexto($objPHPExcel, 'N' . $fila, 'center', '', '');
            if ($k == count($datos)-1) {
                for ($i = 0; $i < 14; $i++) {
                    $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                }
            }
            $fila++;
        }

        //Cambiandole la dimensión a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(40);
        $anchoColumnas = array(10, 35, 7, 10, 12, 7, 15, 10, 20, 12, 12, 10, 20);
        for ($i = 1; $i < 14; $i++) {
            $objPHPExcel->getActiveSheet()->getColumnDimension($alfabeto[$i])->setWidth($anchoColumnas[$i-1]);
        }        
        
    }

    public function exportarExcel($idestructura, $idcategocup, $categocup, $decisorio, $idfacultado, $facultado, $finicio, $ffin)
    {
        $r = null;
        
        $objPHPExcel = new PHPExcel();

        $this->fnPintarEncabezado($objPHPExcel, $idestructura, $idcategocup, $categocup, $decisorio, $idfacultado, $facultado, $finicio, $ffin, 0);

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //Codigo para exportar el documento Excel. 
        //Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Historico.xls" ');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));

        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
    }
}
