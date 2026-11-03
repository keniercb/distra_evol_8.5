<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.phpmailer.php');
include_once($dir_www . '/pvd/comun/recursos/PHPMailer_v5.1/class.smtp.php');

include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class DatParteporfechaModel extends ZendExt_Model
{

    public function GetDatosExportarNominalExcel($arreglo)
    {
        $objPHPExcel = new PHPExcel();

        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Reporte nominal');

        $objPHPExcel->getActiveSheet()->getColumnDimension("A")->setWidth(5);
        $objPHPExcel->getActiveSheet()->getColumnDimension("B")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("C")->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension("D")->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension("E")->setWidth(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension("F")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("G")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("H")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("I")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("J")->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension("K")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("L")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("M")->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension("N")->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension("O")->setWidth(25);
        $objPHPExcel->getActiveSheet()->getColumnDimension("P")->setWidth(25);

        $objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $rcampos = array('No', 'CI', 'Nombre y apellidos', 'Cargo','Área', 'Fecha entrada', 'Hora entrada', 'Fecha salida', 'Hora salida',
            'Causa', 'Desde', 'Hasta', 'Perdidas', 'Controlado por', 'Modificado por', 'Certificado por');

        $letraactual = '';
        foreach ($rcampos as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual . '1', $campo);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($objPHPExcel, 'A1:' . $letraactual . '1', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
            foreach ($arreglo as $key => $datos) {
                    $rdatos = array();
                    if ($datos['idcausa'] == -1 || $datos['idcausa'] == -2)
                        $causa = '';
                    else
                        $causa = $datos['causa'];
                    //Arreglo de datos de la persona en cuestion
                    $rdatos = array($key + 1, $datos['numid'], $datos['nombreapellidos'], $datos['denomcargo'], $datos['denomarea'], $datos['fechaentrada'], $datos['fechahoraentrada'],
                        $datos['fechasalida'], $datos['fechahorasalida'], $causa, $datos['fdesde'], $datos['fhasta'], $datos['hrsdescontadas'],
                        $datos['personacontrola'], $datos['personamodifica'], $datos['personacertifica']);

                    foreach ($rdatos as $ind => $datospersona) {
                        $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
                        $objPHPExcel->getActiveSheet()->setCellValue($letraactual . intval($key + 2), $datospersona);
                        $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'top', PHPExcel_Style_Border::BORDER_THIN);
                        $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                        $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                        $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                        $this->fnAlinearTexto($objPHPExcel, $letraactual . intval($key + 2) . '', 'left', 'center', 0);
                    }
                }

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Reporte nominal.xls" ');
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

    public function GetDatosExportarEstadisticoExcel($arreglo)
    {
        $array = array();
        $result = array();
        foreach($arreglo as $key => $value){
            $array[$value['idarea']] = $value['denomarea'];
        }
        $resultado = array_unique($array);
        foreach($resultado as $key => $value){
            foreach($arreglo as $key1 => $valor){
                $result[$key]['area'] = $value;
                if($key == $valor['idarea']){
                    $result[$key]['total'] += 1;
                    if($valor['idcausa'] == -1){
                        $result[$key]['sinregistro'] += 1;
                    }else{
                        if($valor['idcausa'] == 3){
                            $result[$key]['llegadatarde'] += 1;
                        }else if(!empty($valor['fechahoraentrada']) || (!empty($valor['idcausa']) && $valor['afectasalario'] == 0 && $valor['idcausa'] != 3)){
                            $result[$key]['presentes'] += 1;
                        }else {
                            $result[$key]['ausentes'] += 1;
                        }
                    }
                }
            }
        }

        $objPHPExcel = new PHPExcel();

        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Reporte estadístico');

        $objPHPExcel->getActiveSheet()->getColumnDimension("A")->setWidth(40);
        $objPHPExcel->getActiveSheet()->getColumnDimension("B")->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension("C")->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension("D")->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension("E")->setWidth(15);
        $objPHPExcel->getActiveSheet()->getColumnDimension("F")->setWidth(25);

        $objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $rcampos = array('Área', 'Total', 'Presentes', 'Ausentes', 'Llegadas tarde', 'Sin registro de asistencia');

        $letraactual = '';
        foreach ($rcampos as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual . '1', $campo);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($objPHPExcel, 'A1:' . $letraactual . '1', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');

        $arr = array();
        $cont = 0;
        foreach ($result as $key => $valor) {
            $arr = array(
                $valor['area']
            );
            if ($valor['total'])
                array_push($arr, $valor['total']);
            else
                array_push($arr, '0');
            if ($valor['presentes'])
                array_push($arr, $valor['presentes']);
            else
                array_push($arr, '0');
            if ($valor['ausentes'])
                array_push($arr, $valor['ausentes']);
            else
                array_push($arr, '0');
            if ($valor['llegadatarde'])
                array_push($arr, $valor['llegadatarde']);
            else
                array_push($arr, '0');
            if ($valor['sinregistro'])
                array_push($arr, $valor['sinregistro']);
            else
                array_push($arr, '0');

            foreach ($arr as $ind => $datospersona) {
                $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
                $objPHPExcel->getActiveSheet()->setCellValue($letraactual . intval($cont + 2), $datospersona);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($cont + 2), 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($cont + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($cont + 2), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($objPHPExcel, $letraactual . intval($cont + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($objPHPExcel, $letraactual . intval($cont + 2) . '', 'left', 'center', 0);
            }
            $cont++;
        }

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Reporte estadistico.xls" ');
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

    private function fnPintarFondo(&$objPHPExcel, $celda, $tipofondo, $color)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFill()->applyFromArray(array(
            'type' => $tipofondo,
            'startcolor' => array(
                'rgb' => $color
            )
        ));
    }

    private function fnPintarBordes(&$objPHPExcel, $celda, $lado, $tipoborde)
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

    private function fnAlinearTexto(&$objPHPExcel, $celda, $hor, $ver, $rot)
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

}