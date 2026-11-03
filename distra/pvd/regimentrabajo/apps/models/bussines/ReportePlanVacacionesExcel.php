<?php
$dir_www = str_replace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReportePlanVacacionesExcel {
    private $excel;

    public function ReportePlanVacacionesExcel(){
        $this->excel = new PHPExcel();
    }

    public function construirReporte($result, $anno, $denomestructura, $fecha, $areas){
        $this->excel->setActiveSheetIndex(0);
        $this->excel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

//        $titulo = 'titulo'.$reporte;
//        $encabezado = 'encabezado'.$reporte;
//        $cuerpo = 'cuerpo'.$reporte;

        $this->titulo($this->excel, $anno);
        $this->encabezado($this->excel);
        $this->cuerpo($this->excel, $result, $areas);

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Plan de vacaciones '.$anno.'.xls" ');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($this->excel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $this->excel->disconnectWorksheets();
        unset($this->excel);
    }

    public function fnPintarCelda(&$objPHPExcel, $initialCell, $endCell = -1, $val, $border, $bordercolor, $borderweight, $font, $fontsize, $fontcolor, $fontweight, $alignhor, $alignver, $rotate)
    {
        $styleCell = $initialCell;
        if($endCell != -1)
            $styleCell .= ':'.$endCell;

        //Pintando el valor de la celda
        $objPHPExcel->getActiveSheet()->setCellValue($initialCell, $val);

        //Pintando los bordes a la celda
        if (!empty($border)) {
            $arrbordes = explode(',', $border);
            foreach ($arrbordes as &$bord) {
                $bord = mb_strtolower($bord);
                $realborder = '';
                switch ($bord) {
                    case 't':
                        $realborder = 'top';
                        break;
                    case 'top':
                        $realborder = 'top';
                        break;
                    case 'r':
                        $realborder = 'right';
                        break;
                    case 'right':
                        $realborder = 'right';
                        break;
                    case 'b':
                        $realborder = 'bottom';
                        break;
                    case 'bottom':
                        $realborder = 'bottom';
                        break;
                    case 'l':
                        $realborder = 'left';
                        break;
                    case 'left':
                        $realborder = 'left';
                        break;
                }

                $bweight = '';
                switch ($borderweight){
                    case 'medium':
                        $bweight = PHPExcel_Style_Border::BORDER_MEDIUM;
                        break;
                    case 'dashDot':
                            $bweight = PHPExcel_Style_Border::BORDER_DASHDOT;
                            break;
                    case 'dashDotDot':
                            $bweight = PHPExcel_Style_Border::BORDER_DASHDOTDOT;
                            break;
                    case 'dashed':
                            $bweight = PHPExcel_Style_Border::BORDER_DASHED;
                            break;
                    case 'double':
                            $bweight = PHPExcel_Style_Border::BORDER_DOUBLE;
                            break;
                    case 'hair':
                            $bweight = PHPExcel_Style_Border::BORDER_HAIR;
                            break;
                    case 'mediumDashDot':
                            $bweight = PHPExcel_Style_Border::BORDER_MEDIUMDASHDOT;
                            break;
                    case 'mediumDashDotDot':
                            $bweight = PHPExcel_Style_Border::BORDER_MEDIUMDASHDOTDOT;
                            break;
                    case 'mediumDashed':
                            $bweight = PHPExcel_Style_Border::BORDER_MEDIUMDASHED;
                            break;
                    case 'none':
                            $bweight = PHPExcel_Style_Border::BORDER_NONE;
                            break;
                    case 'SlantDashDot':
                            $bweight = PHPExcel_Style_Border::BORDER_SLANTDASHDOT;
                            break;
                    case 'thick':
                            $bweight = PHPExcel_Style_Border::BORDER_THICK;
                            break;
                    case 'dotted':
                            $bweight = PHPExcel_Style_Border::BORDER_DOTTED;
                            break;
                    default:
                            $bweight = PHPExcel_Style_Border::BORDER_THIN;
                            break;

                }

                if(!empty($bordercolor))
                    $objPHPExcel->getActiveSheet()->getStyle($styleCell)->getBorders()->applyFromArray(
                        array(
                            $realborder => array(
                                'style' => 'thin',
                                'color' => array(
                                    'rgb' => (!empty($bordercolor)) ? $bordercolor : '000000'
                                )
                            )
                        )
                    );
            }
        }

        //Dandole fuente a la celda
        $objPHPExcel->getActiveSheet()->getStyle($styleCell)->getFont()->applyFromArray(
            array(
                'name' => $font,
                'bold' => ($fontweight == 1 || $fontweight == 3) ? TRUE : FALSE,
                'italic' => ($fontweight == 2 || $fontweight == 3) ? TRUE : FALSE,
                'strike' => ($fontweight == 0) ? TRUE : FALSE,
                'size' => $fontsize,
                'color' => array(
                    'rgb' => (!empty($fontcolor)) ? $fontcolor : '000000'
                )
            )
        );

        //Centrando el texto de la celda
        $objPHPExcel->getActiveSheet()->getStyle($styleCell)->getAlignment()->applyFromArray(
            array(
                'horizontal' => $alignhor,
                'vertical' => $alignver,
                'rotation' => $rotate, //0 ó 90
                'wrap' => TRUE
            )
        );

    }


    public function titulo(&$excel, $anno){
        $excel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $excel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $excel->getActiveSheet()->getColumnDimension('C')->setWidth(15);
        $cant = 4;
        while ($cant < 28){
            $excel->getActiveSheet()->getColumnDimension($this->getLetraColumna($cant + 64))->setWidth(7);
            $cant++;
        }
        $excel->getActiveSheet()->getColumnDimension('AB')->setWidth(15);


        $excel->getActiveSheet()->mergeCells('J2:R2');
        $this->fnPintarCelda($excel,'J2', -1, 'PLAN DE VACACIONES '.$anno, null, '000000', 'thin', 'Arial', 14, '000000', 3, 'center', 'center', 0);
    }

    public function encabezado(&$excel){
        $excel->getActiveSheet()->mergeCells('A4:A5');
        $this->fnPintarCelda($excel,'A4', 'A5', 'Nombre y apellidos', 't,b,r,l', '000000', 'thin', 'Arial', 11, '000000', 1, 'center', 'center', 0);
        $excel->getActiveSheet()->mergeCells('B4:B5');
        $this->fnPintarCelda($excel,'B4', 'B5', 'Área', 't,b,r,l', '000000', 'thin', 'Arial', 11, '000000', 1, 'center', 'center', 0);
        $excel->getActiveSheet()->mergeCells('C4:C5');
        $this->fnPintarCelda($excel,'C4', 'C5', 'Vacaciones acumuladas', 't,b,r,l', '000000', 'thin', 'Arial', 11, '000000', 1, 'center', 'center', 0);

       $pdf = new DatpdfplanvacacionesModel();
        $cont = 4;
        for($t = 1; $t < 13; $t++){
            $excel->getActiveSheet()->mergeCells($this->getLetraColumna($cont  + 64).'4:'.$this->getLetraColumna($cont  + 65).'4');
            $this->fnPintarCelda($excel,$this->getLetraColumna($cont + 64).'4', $this->getLetraColumna($cont + 65).'4', $pdf->getMes($t) , 't,b,r,l', '000000', 'thin', 'Arial', 11, '000000', 1, 'center', 'center', 0);
            $cont += 2;
        }
           $cant = 4;
          while ($cant < 28){
              $this->fnPintarCelda($excel,$this->getLetraColumna($cant + 64).'5', -1, '1ra' , 't,b,r,l', '000000', 'thin', 'Arial', 11, '000000', 1, 'center', 'center', 0);
              $this->fnPintarCelda($excel,$this->getLetraColumna($cant + 65).'5', -1, '2da' , 't,b,r,l', '000000', 'thin', 'Arial', 11, '000000', 1, 'center', 'center', 0);
              $cant += 2;
          }

          $excel->getActiveSheet()->mergeCells('AB4:AB5');
          $this->fnPintarCelda($excel,'AB4', 'AB5', 'Firma', 't,b,r,l', '000000', 'thin', 'Arial', 11, '000000', 1, 'center', 'center', 0);

          $excel->getActiveSheet()->freezePane('A6');
    }

    

    public function cuerpo(&$excel, $result, $areas){
        $fila = 6;
        foreach ($areas as $index => $area) {
            $planpersonasarea = array_filter($result, function($element) use($area){
                return $element['area'] == $area;
            });
            foreach ($planpersonasarea as $ind => $planpersona) {
                $this->fnPintarCelda($excel,'A'.$fila, -1, $planpersona['nombreapellidos'], 't,b,r,l', '', 'default', 'Arial', 10, '000000', -1, 'left', 'center', 0);
                $this->fnPintarCelda($excel,'B'.$fila, -1, $planpersona['area'], 't,b,r,l', '', 'default', 'Arial', 10, '000000', -1, 'left', 'center', 0);
                $this->fnPintarCelda($excel,'C'.$fila, -1, $planpersona['vacacumuladas'], 't,b,r,l', '', 'default', 'Arial', 10, '000000', -1, 'center', 'center', 0);
                if(isset($planpersona[0])){
                    $cont = 4;
                   for ($i = 0; $i < 23; $i++){
                       $this->fnPintarCelda($excel,$this->getLetraColumna($cont + 64).$fila, -1, $planpersona[$i], 't,b,r,l', '', 'default', 'Arial', 10, '000000', -1, 'center', 'center', 0);
                       $cont++;
                   }
                }
                $fila++;
            }
        }
    }

    /**
     * @param $letra
     * @return string
     */
    public function getLetraColumna($letra)
    {
        $columna = ($letra <= 90) ? chr($letra) : 'A' . chr($letra - 26);
        return $columna;
    }


}