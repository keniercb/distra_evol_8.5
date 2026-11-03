<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ExportarResumenAusentismoExcelModel extends ZendExt_Model
{
    public function ExportarResumenAusentismoExcelModel()
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
    
    public function fnPintarEncabezado(&$objPHPExcel, $result, $titulo, $numerohoja)
    {
        $alfabeto = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT','BU','BV','BW','BX','BY','BZ'];               
       
        $mes = $result['mes'];
        $mes = $this->getMes($mes);
        $year = $result['year'];
        
        $objPHPExcel->setActiveSheetIndex($numerohoja);
        $objPHPExcel->getActiveSheet()->setTitle($titulo);
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, 27, 1);
        //Concatenando la primera fila para escribir el encabezado del reporte:
        $objPHPExcel->getActiveSheet()->setCellValue('A1', "REPORTE DE AUSENTISMO ANEXO AL MODELO 18             RESUMEN EMPRESA             $mes $year");
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
        
        for ($i = 0; $i < 28; $i++) {
            //Dandole border 'buttoms' a la celda
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '1', 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
        }
        
        $columnas = ['ÓRGANOS', 'Días naturales del mes', 'Total de trabajadores', 'Fondo de Tiempo Calendario', 'Tiempo no laborable del mes', 'Vacaciones', 'Tiempo no trabajado por alta',
                        'Tiempo no trabajado por baja', 'Fondo de tiempo máximo utilizable', 'Fondo de tiempo no utilizado', 'Licencia al amparo ley maternidad', 'Licencia de Maternidad',
                        'Prestacion Social', 'Licencia sin sueldo por ley maternidad', 'Autorizaciones Legales vigentes', 'Interrupciones de dias completos', 'Accidente de trabajo y trayecto',
                        'Accidente de trabajo', 'Accidente de trayecto', 'Enfermedad (Certificado médico)', 'Autorizaciones administrativas', 'Ausencias Justificadas', 'Fondo de tiempo utilizado',
                        'Índice de utilización Fondo de Tiempo', 'Índice de ausencia', 'Índice de ausentismo', 'Hombres/Días Trabajado', 'Porciento de ausentismo total'];
        
        
        for ($i = 0; $i < count($columnas); $i++) {
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . '2', $columnas[$i]);
            if ($i == 0) {
                $this->fnAlinearTexto($objPHPExcel, $alfabeto[$i] . '2', 'center', '', 0);
            } else {
                $this->fnAlinearTexto($objPHPExcel, $alfabeto[$i] . '2', 'center', '', 90);
            }
            if ($i == 4) {
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->getStartColor()->setRGB('FFE4B5');
            }
            if ($i == 8 || $i == 9 || $i == 25 || $i == 27) {
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->getStartColor()->setRGB('FFFFE0');
            }
            if ($i == 10 || $i == 16 || $i == 22 || $i == 23) {
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->getStartColor()->setRGB('CCFFCC');
            }
            if ($i == 24) {
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->getStartColor()->setRGB('FFDAB9');
            }
            if ($i == 26) {
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
                $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$i] . '2')->getFill()->getStartColor()->setRGB('FFFF00');
            }
                
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        }
        
        //Para congelar las 2 primeras filas con el encabezado:
        $objPHPExcel->getActiveSheet()->freezePane('A3');
        
        $fila = 3;
        foreach ($result['reporte'] as $key => $value) {
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $value['organo']);
            $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN); 
            $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
            
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $value['diasnaturales']);
            $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $value['totaltrabajadores']);
            $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $value['fondotiempocalendario']);
            $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $value['tiemponolaborable']);
            $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getFill()->getStartColor()->setRGB('FFE4B5');
            
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $fila, $value['vacaciones']);
            $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, $value['tiemponotrabporalta']);
            $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $fila, $value['tiemponotrabporbaja']);
            $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('I' . $fila, $value['fdotiempomaxutilizable']);
            $this->fnPintarBordes($objPHPExcel, 'I' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'I' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('I' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('I' . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
            
            $objPHPExcel->getActiveSheet()->setCellValue('J' . $fila, $value['fdotiemponoutilizado']);
            $this->fnPintarBordes($objPHPExcel, 'J' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'J' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('J' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('J' . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
            
            $objPHPExcel->getActiveSheet()->setCellValue('K' . $fila, $value['licenciaamparoleymatern']);
            $this->fnPintarBordes($objPHPExcel, 'K' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'K' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('K' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('K' . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
            
            $objPHPExcel->getActiveSheet()->setCellValue('L' . $fila, $value['licenciamaternidad']);
            $this->fnPintarBordes($objPHPExcel, 'L' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'L' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('M' . $fila, $value['prestacionsocial']);
            $this->fnPintarBordes($objPHPExcel, 'M' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'M' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('N' . $fila, $value['licsinsueldxleymatern']);
            $this->fnPintarBordes($objPHPExcel, 'N' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'N' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('O' . $fila, $value['autorizlegalesvigentes']);
            $this->fnPintarBordes($objPHPExcel, 'O' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'O' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('P' . $fila, $value['interrupcionesdiascomletos']);
            $this->fnPintarBordes($objPHPExcel, 'P' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'P' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('Q' . $fila, $value['accidentetrabytray']);
            $this->fnPintarBordes($objPHPExcel, 'Q' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'Q' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('Q' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('Q' . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
            
            $objPHPExcel->getActiveSheet()->setCellValue('R' . $fila, $value['accidentetrabajo']);
            $this->fnPintarBordes($objPHPExcel, 'R' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'R' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('S' . $fila, $value['accidentetrayecto']);
            $this->fnPintarBordes($objPHPExcel, 'S' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'S' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('T' . $fila, $value['enfermedad']);
            $this->fnPintarBordes($objPHPExcel, 'T' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'T' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('U' . $fila, $value['autorizadministrativas']);
            $this->fnPintarBordes($objPHPExcel, 'U' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'U' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('V' . $fila, $value['ausenciajustif']);
            $this->fnPintarBordes($objPHPExcel, 'V' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'V' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            
            $objPHPExcel->getActiveSheet()->setCellValue('W' . $fila, $value['fondotiempoutilizado']);
            $this->fnPintarBordes($objPHPExcel, 'W' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);  
            $this->fnPintarBordes($objPHPExcel, 'W' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('W' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('W' . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
            
            $objPHPExcel->getActiveSheet()->setCellValue('X' . $fila, $value['Indiceutilizfdotpo']);
            $this->fnPintarBordes($objPHPExcel, 'X' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);   
            $this->fnPintarBordes($objPHPExcel, 'X' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('X' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('X' . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
            
            $objPHPExcel->getActiveSheet()->setCellValue('Y' . $fila, $value['indiceausencia']);
            $this->fnPintarBordes($objPHPExcel, 'Y' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'Y' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('Y' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('Y' . $fila)->getFill()->getStartColor()->setRGB('FFDAB9');
            
            $objPHPExcel->getActiveSheet()->setCellValue('Z' . $fila, $value['indiceausentismo']);
            $this->fnPintarBordes($objPHPExcel, 'Z' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'Z' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('Z' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('Z' . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
            
            $objPHPExcel->getActiveSheet()->setCellValue('AA' . $fila, $value['hombresxdiastrabajado']);
            $this->fnPintarBordes($objPHPExcel, 'AA' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, 'AA' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('AA' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('AA' . $fila)->getFill()->getStartColor()->setRGB('FFFF00');
            
            $objPHPExcel->getActiveSheet()->setCellValue('AB' . $fila, $value['porcientoausentismototal']);
            $this->fnPintarBordes($objPHPExcel, 'AB' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);     
            $this->fnPintarBordes($objPHPExcel, 'AB' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $objPHPExcel->getActiveSheet()->getStyle('AB' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle('AB' . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
            
            $fila++;
        }
        
        //Pinto la fila de los totales:
        $totales = $result['totales'];
        
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, "TOTAL");
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'A' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $totales['tdiasnaturales']);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'B' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $totales['ttotaltrabajadores']);
        $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'C' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $totales['tfondotiempocalendario']);
        $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'D' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $totales['ttiemponolaborable']);
        $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'E' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('E' . $fila)->getFill()->getStartColor()->setRGB('FFE4B5');
        
        $objPHPExcel->getActiveSheet()->setCellValue('F' . $fila, $totales['tvacaciones']);
        $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'F' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, $totales['ttiemponotrabporalta']);
        $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'G' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('H' . $fila, $totales['ttiemponotrabporbaja']);
        $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'H' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('I' . $fila, $totales['tfdotiempomaxutilizable']);
        $this->fnPintarBordes($objPHPExcel, 'I' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'I' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'I' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('I' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('I' . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
        
        $objPHPExcel->getActiveSheet()->setCellValue('J' . $fila, $totales['tfdotiemponoutilizado']);
        $this->fnPintarBordes($objPHPExcel, 'J' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'J' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'J' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('J' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('J' . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
        
        $objPHPExcel->getActiveSheet()->setCellValue('K' . $fila, $totales['tlicenciaamparoleymatern']);
        $this->fnPintarBordes($objPHPExcel, 'K' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'K' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'K' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('K' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('K' . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
        
        $objPHPExcel->getActiveSheet()->setCellValue('L' . $fila, $totales['tlicenciamaternidad']);
        $this->fnPintarBordes($objPHPExcel, 'L' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'L' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'L' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('M' . $fila, $totales['tprestacionsocial']);
        $this->fnPintarBordes($objPHPExcel, 'M' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'M' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'M' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('N' . $fila, $totales['tlicsinsueldxleymatern']);
        $this->fnPintarBordes($objPHPExcel, 'N' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'N' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'N' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('O' . $fila, $totales['tautorizlegalesvigentes']);
        $this->fnPintarBordes($objPHPExcel, 'O' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'O' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'O' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('P' . $fila, $totales['tinterrupcionesdiascomletos']);
        $this->fnPintarBordes($objPHPExcel, 'P' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'P' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'P' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('Q' . $fila, $totales['taccidentetrabytray']);
        $this->fnPintarBordes($objPHPExcel, 'Q' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'Q' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'Q' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('Q' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('Q' . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
        
        $objPHPExcel->getActiveSheet()->setCellValue('R' . $fila, $totales['taccidentetrabajo']);
        $this->fnPintarBordes($objPHPExcel, 'R' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'R' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'R' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('S' . $fila, $totales['taccidentetrayecto']);
        $this->fnPintarBordes($objPHPExcel, 'S' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'S' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'S' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('T' . $fila, $totales['tenfermedad']);
        $this->fnPintarBordes($objPHPExcel, 'T' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'T' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'T' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('U' . $fila, $totales['tautorizadministrativas']);
        $this->fnPintarBordes($objPHPExcel, 'U' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'U' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'U' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('V' . $fila, $totales['tausenciajustif']);
        $this->fnPintarBordes($objPHPExcel, 'V' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'V' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'V' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('W' . $fila, $totales['tfondotiempoutilizado']);
        $this->fnPintarBordes($objPHPExcel, 'W' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'W' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'W' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('W' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('W' . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
        
        $objPHPExcel->getActiveSheet()->setCellValue('X' . $fila, $totales['tIndiceutilizfdotpo']);
        $this->fnPintarBordes($objPHPExcel, 'X' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'X' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'X' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('X' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('X' . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
        
        $objPHPExcel->getActiveSheet()->setCellValue('Y' . $fila, $totales['tindiceausencia']);
        $this->fnPintarBordes($objPHPExcel, 'Y' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'Y' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'Y' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('Y' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('Y' . $fila)->getFill()->getStartColor()->setRGB('FFDAB9');
        
        $objPHPExcel->getActiveSheet()->setCellValue('Z' . $fila, $totales['tindiceausentismo']);
        $this->fnPintarBordes($objPHPExcel, 'Z' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'Z' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'Z' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('Z' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('Z' . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
        
        $objPHPExcel->getActiveSheet()->setCellValue('AA' . $fila, $totales['thombresxdiastrabajado']);
        $this->fnPintarBordes($objPHPExcel, 'AA' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'AA' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'AA' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('AA' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('AA' . $fila)->getFill()->getStartColor()->setRGB('FFFF00');
        
        $objPHPExcel->getActiveSheet()->setCellValue('AB' . $fila, $totales['tporcientoausentismototal']);
        $this->fnPintarBordes($objPHPExcel, 'AB' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'AB' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'AB' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('AB' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('AB' . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
        
        $fila = $fila + 2;
        $promhombresdianotrab = $result['promhombresdianotrab'];
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, "Promedio hombres/dia no trabajado");
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'A' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
        
        for ($i = 0; $i < 13; $i++) {
            $j = $i + 9;
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$j] . $fila, $promhombresdianotrab[$i]);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j] . $fila, 'left', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$j] . $fila, 'Arial', 10);
            $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$j] . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$j] . $fila)->getFill()->getStartColor()->setRGB('CCFFCC');
        }
        
        $fila = $fila + 2;
        $porccausalesxcanthrsnotrab = $result['porccausalesxcanthrsnotrab'];
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, "Porciento de las causales contra el total de horas dejadas de trabajar");
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'A' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
        $objPHPExcel->getActiveSheet()->getStyle('A' . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
        
        for ($i = 0; $i < 12; $i++) {
            $j = $i + 10;
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$j] . $fila, $porccausalesxcanthrsnotrab[$i]);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j] . $fila, 'left', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$j] . $fila, 'Arial', 10);
            $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$j] . $fila)->getFill()->setFillType(PHPExcel_Style_Fill::FILL_SOLID);
            $objPHPExcel->getActiveSheet()->getStyle($alfabeto[$j] . $fila)->getFill()->getStartColor()->setRGB('FFFFE0');
        }
        
        $fila = $fila + 2;
        $tmponolabmes = $result['tmponolabmes'];
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, "Tiempo no laborable del mes");
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'A' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $tmponolabmes);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'B' . $fila, 'Arial', 10);
        
        $fila = $fila + 2;
        $canthrslabmes = $result['canthrslabmes'];
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, "Cantidad de horas laborables en el mes");
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'A' . $fila, 'Arial', 10);
        
        $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $canthrslabmes);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnFuenteTexto($objPHPExcel, 'B' . $fila, 'Arial', 10);
        
        
        //Cambiandole la dimensión a las filas
        $objPHPExcel->getActiveSheet()->getRowDimension(2)->setRowHeight(140);
        //Cambiandole la dimensión a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(65);
        for ($i = 1; $i < 28; $i++) {
            $objPHPExcel->getActiveSheet()->getColumnDimension($alfabeto[$i])->setWidth(5);
        }
        
    }

    public function exportarExcel($result)
    {
        $r = null;
        
        $objPHPExcel = new PHPExcel();

        $this->fnPintarEncabezado($objPHPExcel, $result, 'Resumen Ausentismo', 0);

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        //Codigo para exportar el documento Excel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
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
    
    private function getMes($mesnum)
    {
        if ($mesnum == 1) {
            return 'ENERO';
        } else if ($mesnum == 2) {
            return 'FEBRERO';
        } else if ($mesnum == 3) {
            return 'MARZO';
        } else if ($mesnum == 4) {
            return 'ABRIL';
        } else if ($mesnum == 5) {
            return 'MAYO';
        } else if ($mesnum == 6) {
            return 'JUNIO';
        } else if ($mesnum == 7) {
            return 'JULIO';
        } else if ($mesnum == 8) {
            return 'AGOSTO';
        } else if ($mesnum == 9) {
            return 'SEPTIEMBRE';
        } else if ($mesnum == 10) {
            return 'OCTUBRE';
        } else if ($mesnum == 11) {
            return 'NOVIEMBRE';
        } else if ($mesnum == 12) {
            return 'DICIEMBRE';
        } else {
            return '';
        }
    }
}
