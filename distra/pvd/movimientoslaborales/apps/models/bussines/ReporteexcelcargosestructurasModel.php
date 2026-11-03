<?php

$dirWWW = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirWWW . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReporteexcelcargosestructurasModel extends ZendExt_Model
{
    public function ReporteexcelcargosestructurasModel()
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
    
    public function fnPintarEncabezado(&$objPHPExcel, $idestructura, $estructura, $numerohoja, $tipo)
    {
        if ($tipo == 1) {
            $cantColumnas = 10;
            
            $alfabeto = ['A','B','C','D','E','F','G','H','I','J'];
            
            $objPHPExcel->setActiveSheetIndex($numerohoja);
            $objPHPExcel->getActiveSheet()->setTitle('Cargos');
            $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, $cantColumnas - 1, 1);
            $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 2, $cantColumnas - 1, 2);
            //Concatenando la primera fila para escribir el encabezado del reporte:

            $objPHPExcel->getActiveSheet()->setCellValue(
                'A1', "RELACIÓN DE CARGOS "
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'A2', "Estructura: ".$estructura
            );
            //Dandole formato 'center':
            $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
            //Dandole formato 'bold':
            $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
            //Dandole formato 'center':
            $this->fnAlinearTexto($objPHPExcel, 'A2', 'left', '', 0);
            //Dandole formato 'bold':
            $this->fnFuenteTexto($objPHPExcel, 'A2', 'Arial', 13);

            $columnas = array(
                    'Identidad', 'Idarea', 'Idcargo', 'Denominación del Cargo', 'Nombre', 'S. Nombre', 'P. Apellido', 'S. Apellido', 'CI', 'Sexo'
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
            $datos = $this->getCargos($idestructura);
            foreach ($datos as $k=>$value) {

                if ($value['idpadre'] != $datos[$k - 1]['idpadre']) {
                    $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $value['idpadre']);
                    $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $value['padre']);
                    for ($i = 0; $i < 10; $i++) {
                        $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
                        $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    }
                    $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, 'J' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnFuenteTexto($objPHPExcel, 'C' . $fila, 'Calibri', 11);
                    $this->fnFuenteTexto($objPHPExcel, 'D' . $fila, 'Calibri', 11);
                    $fila++;
                }

                $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $idestructura);
                $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $value['idpadre']);
                $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $value['idcargo']);
                $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $value['denominacion']);
                $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $value['nombre']);
                $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $objPHPExcel->getActiveSheet()->setCellValue('F' . $fila, $value['snombre']);
                $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, $value['papel']);
                $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                $objPHPExcel->getActiveSheet()->setCellValue('H' . $fila, $value['sapel']);
                $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                $objPHPExcel->getActiveSheet()->setCellValue('I' . $fila, $value['ci']);
                $this->fnPintarBordes($objPHPExcel, 'I' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                $objPHPExcel->getActiveSheet()->setCellValue('J' . $fila, $value['sexo']);
                $this->fnPintarBordes($objPHPExcel, 'J' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
                if ($k == count($datos)-1) {
                    for ($i = 0; $i < 10; $i++) {
                        $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    }
                }
                $fila++;
            }

            //Cambiandole la dimensión a las columnas
            $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(15);
            //$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(50);
            $anchoColumnas = array(15, 15, 50, 15, 15, 15, 15, 15, 15, 15);
            for ($i = 1; $i < count($anchoColumnas); $i++) {
                $objPHPExcel->getActiveSheet()->getColumnDimension($alfabeto[$i])->setWidth($anchoColumnas[$i-1]);
            }
        } else {
            $cantColumnas = 7;
            
            $alfabeto = ['A','B','C','D','E','F','G','H','I','J'];
            
            $objPHPExcel->setActiveSheetIndex($numerohoja);
            $objPHPExcel->getActiveSheet()->setTitle('Cargos');
            $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, $cantColumnas - 1, 1);
            $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 2, $cantColumnas - 1, 2);
            //Concatenando la primera fila para escribir el encabezado del reporte:

            $objPHPExcel->getActiveSheet()->setCellValue(
                'A1', "RELACIÓN DE CARGOS "
            );
            $objPHPExcel->getActiveSheet()->setCellValue(
                'A2', "Estructura: ".$estructura
            );
            //Dandole formato 'center':
            $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
            //Dandole formato 'bold':
            $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
            //Dandole formato 'center':
            $this->fnAlinearTexto($objPHPExcel, 'A2', 'left', '', 0);
            //Dandole formato 'bold':
            $this->fnFuenteTexto($objPHPExcel, 'A2', 'Arial', 13);

            $columnas = array(
                    'Denominación del Cargo', 'Nombre', 'S. Nombre', 'P. Apellido', 'S. Apellido', 'CI', 'Sexo'
            );
            $this->fnPintarBordes($objPHPExcel, 'A2', 'left', PHPExcel_Style_Border::BORDER_THIN);

            for ($i = 0; $i < $cantColumnas; $i++) {
                $A = $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . '3', $columnas[$i]);
                $this->fnFuenteTexto($objPHPExcel, $alfabeto[$i] . '3', 'Calibri', 11);
                $this->fnAlinearTexto($objPHPExcel, $alfabeto[$i] . '3', 'center', '', '');
                $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);//print_r( $columnas[$i]);die;
            }
            
            //Para congelar las 2 primeras filas con el encabezado:
            $objPHPExcel->getActiveSheet()->freezePane('A4');
            $fila = 4;
            $datos = $this->getCargos($idestructura);
            foreach ($datos as $k=>$value) {

                if ($value['idpadre'] != $datos[$k - 1]['idpadre']) {
                    $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $value['padre']);
                    for ($i = 0; $i < $cantColumnas; $i++) {
                        $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
                        $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    }
                    $this->fnFuenteTexto($objPHPExcel, 'C' . $fila, 'Calibri', 11);
                    $this->fnFuenteTexto($objPHPExcel, 'D' . $fila, 'Calibri', 11);
                    $fila++;
                }

                $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $value['denominacion']);
                $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $value['nombre']);
                $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $value['snombre']);
                $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $value['papel']);
                $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $value['sapel']);
                $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                $objPHPExcel->getActiveSheet()->setCellValue('F' . $fila, $value['ci']);
                $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, $value['sexo']);
                $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);

                if ($k == count($datos)-1) {
                    for ($i = 0; $i < 10; $i++) {
                        $this->fnPintarBordes($objPHPExcel, $alfabeto[$i]. $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    }
                }

                $fila++;
            }

            //Cambiandole la dimensión a las columnas
            $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(55);
            $anchoColumnas = array(15, 15, 15, 15, 15, 15, 15, 15, 15, 15);
            for ($i = 1; $i < count($anchoColumnas); $i++) {
                $objPHPExcel->getActiveSheet()->getColumnDimension($alfabeto[$i])->setWidth($anchoColumnas[$i-1]);
            }
        }
    }

    public function exportarExcel($idestructura, $estructura, $tipo)
    {
        $r = null;
        
        $objPHPExcel = new PHPExcel();

        $this->fnPintarEncabezado($objPHPExcel, $idestructura, $estructura, 0, $tipo);

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //Codigo para exportar el documento Excel. 
        //Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Reporte de cargos.xls" ');
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

    private function getCargos($idestructura)
    {
        try {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            $arrIdsCargos = array();
            foreach ($cargos as $d) {
                if(!empty($d['idcargo'])){
                    $arrIdsCargos[] = $d['idcargo'];
                }
            }
            $arrIdsCargos = array_unique($arrIdsCargos);
            if (count($arrIdsCargos) > 0) {
                $datcargos = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($arrIdsCargos);
                $datos = Array();
                foreach ($datcargos as $i => $c) {
                    array_push($datos, $c);
                    if ($c['cantidad'] > 1) {
                        $cant = $c['cantidad'] - 1;
                        while ($cant > 0) {
                            array_push($datos, $c);
                            $cant--;
                        }
                    }
                }
                $datpersonas =
                    ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(null,
                        null, null, 0, null, $arrIdsCargos, null);
                foreach ($datos as $i => $c) {
                    foreach ($datpersonas->data as $key => $p) {
                        if($c['idcargo'] == $p['idcargo']){
                            $datos[$i]['nombre'] = $p['nombre'];
                            $datos[$i]['snombre'] = $p['snombre'];
                            $datos[$i]['papel'] = $p['papel'];
                            $datos[$i]['sapel'] = $p['sapel'];
                            $datos[$i]['sexo'] = ($p['sexo'] == 0)? 'Femenino' : 'Masculino';
                            $datos[$i]['ci'] = $p['numid'];
                            unset($datpersonas->data[$key]);
                            break;
                        }
                    }
                }

            } else {
                $datos = Array();
            }
            return $datos;
        } catch (Exception $e) {
            return [];
        }
    }

}
