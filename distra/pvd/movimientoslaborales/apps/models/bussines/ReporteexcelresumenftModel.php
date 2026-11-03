<?php

$dirWWW = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirWWW . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReporteexcelresumenftModel extends ZendExt_Model
{
    public function ReporteexcelresumenftModel()
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
    
    public function fnPintarEncabezado(&$objPHPExcel, $idestructura, $fdesde, $fhasta, $titulo, $numerohoja)
    {
        $fdesdeTitulo = date('d/m/Y', strtotime($fdesde));
        $fhastaTitulo = date('d/m/Y', strtotime($fhasta));
        
        $modeloDatos = new DatosresumenftModel();
        $denomColumnas = $modeloDatos->getDenominacionColumnas();
        $cantColumnas = count($denomColumnas['denominaciones']);
        
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $entidad = $entidad[0]->denominacion;
        
        $organos = $modeloDatos->getOrganos($idestructura);
        
        $alfabeto = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N',
                    'O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB',
                    'AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM',
                    'AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX',
                    'AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BI',
                    'BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT',
                    'BU','BV','BW','BX','BY','BZ'];               
        
        $objPHPExcel->setActiveSheetIndex($numerohoja);
        $objPHPExcel->getActiveSheet()->setTitle($titulo);
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, $cantColumnas - 1, 1);
        //Concatenando la primera fila para escribir el encabezado del reporte:
        $objPHPExcel->getActiveSheet()->setCellValue(
            'A1', "RESUMEN  DE LA FUERZA DE TRABAJO     Entidad: $entidad     $fdesdeTitulo - $fhastaTitulo"
        );
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
        
        for ($i = 0; $i < $cantColumnas; $i++) { //chr($cantColumnas/27 + 64).chr($letrarecorrer + 64);
            //Dandole border 'buttoms' a la celda
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '1', 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
        }
        
        $this->fnPintarBordes($objPHPExcel, 'A2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
        $this->fnPintarBordes($objPHPExcel, 'B2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $objPHPExcel->getActiveSheet()->mergeCells('C2:H2');
        $objPHPExcel->getActiveSheet()->setCellValue('C2', 'DE ELLOS');
        $this->fnAlinearTexto($objPHPExcel, 'C2', 'center', '', 0);
        for ($i = 2; $i < 8; $i++) {
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);  
        }
        $this->fnPintarBordes($objPHPExcel, 'H2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        
        $posicionActual = 0;
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[8] . '2', 'TOTAL DE BAJAS');
        $this->fnAlinearTexto($objPHPExcel, $alfabeto[8] . '2', 'center', '', 0);
        $objPHPExcel->getActiveSheet()->mergeCells(
            $alfabeto[8] . '2' . ':' . $alfabeto[8 + $denomColumnas['totalmotivosbaja']] . '2'
        );
        for ($i = 8; $i < 8 + $denomColumnas['totalmotivosbaja'] + 1; $i++) {
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
            $posicionActual = $i;
        }
        $this->fnPintarBordes(
            $objPHPExcel, $alfabeto[$posicionActual] . '2', 'right', PHPExcel_Style_Border::BORDER_THIN
        );
        
        $posicionActual += 1;
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicionActual] . '2', 'ESCOLARIDAD');
        $this->fnAlinearTexto($objPHPExcel, $alfabeto[$posicionActual] . '2', 'center', '', 0);
        $objPHPExcel->getActiveSheet()->mergeCells(
            $alfabeto[$posicionActual] . '2' . ':' . $alfabeto[$posicionActual + $denomColumnas['totalniveleduc']] . '2'
        );
        $maximaPosicion = $posicionActual + $denomColumnas['totalniveleduc'];
        for ($i = $posicionActual; $i <= $maximaPosicion; $i++) {
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
            $posicionActual = $i;
        }
        $this->fnPintarBordes(
            $objPHPExcel, $alfabeto[$posicionActual] . '2', 'right', PHPExcel_Style_Border::BORDER_THIN
        );
        
        $posicionActual += 1;
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicionActual] . '2', 'EDADES');
        $this->fnAlinearTexto($objPHPExcel, $alfabeto[$posicionActual] . '2', 'center', '', 0);
        $objPHPExcel->getActiveSheet()->mergeCells(
            $alfabeto[$posicionActual] . '2' . ':' . $alfabeto[$posicionActual + 10] . '2'
        );
        $maximaPosicion = $posicionActual + 10;
        for ($i = $posicionActual; $i <= $maximaPosicion; $i++) {
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
            $posicionActual = $i;
        }
        $this->fnPintarBordes(
            $objPHPExcel, $alfabeto[$posicionActual] . '2', 'right', PHPExcel_Style_Border::BORDER_THIN
        );  
        
        $posicionActual += 1;
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicionActual] . '2', 'COMPOSICIÓN ÉTNICA');
        $this->fnAlinearTexto($objPHPExcel, $alfabeto[$posicionActual] . '2', 'center', '', 0);
        $objPHPExcel->getActiveSheet()->mergeCells(
            $alfabeto[$posicionActual].'2'.':'.$alfabeto[$posicionActual + $denomColumnas['totalcolorespiel']].'2'
        );
        $maximaPosicion = $posicionActual + $denomColumnas['totalcolorespiel'];
        for ($i = $posicionActual; $i <= $maximaPosicion; $i++) {
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
            $posicionActual = $i;
        }
        $this->fnPintarBordes(
            $objPHPExcel, $alfabeto[$posicionActual] . '2', 'right', PHPExcel_Style_Border::BORDER_THIN
        );  
        
        for ($i = 0; $i < $cantColumnas; $i++) {
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . '3', $denomColumnas['denominaciones'][$i]);
            $this->fnAlinearTexto($objPHPExcel, $alfabeto[$i] . '3', 'center', '', 90);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);  
        }
        
        //Para conjelar las 3 primeras filas con el encabezado:
        $objPHPExcel->getActiveSheet()->freezePane('A4');
        
        $totalTotalTrabajadores = 0;
        $totalHombres = 0;
        $totalMujeres = 0;
        $totalPCC = 0;
        $totalUJC = 0;
        $totalAltas = 0;
        $totalBajas = 0;
        $totalesMotivosBaja = array();
        $totalesEscolaridad = array();
        $totalEdadNoConocida = 0;
        $totalMenoresDeQuince = 0;
        $totalEntreQuinyDie = 0;
        $totalEntreDiecisieteyDiec = 0;
        $totalEntreVeinteyVeintinu = 0;
        $totalEntreTreintayTrenNu = 0;
        $totalEntreCuaryCuarentaN = 0;
        $totalEntreSesenteySesentacu = 0;
        $totalEntreSesentaCySesentaNu = 0;
        $totalMayoresDeSetenta = 0;
        $totalTotalEdades = 0;
        $totalesCompEtnica = array();
        
        $fila = 4;
        foreach ($organos as $value) {
            $valoresFila = $modeloDatos->getValoresFila(
                $value['idestructura'], $fdesde, $fhasta, $value['estructurapadre']
            );
            
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $value['denominacion']);
            $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);            
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $valoresFila['totaltrabajadores']);
            $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);            
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $valoresFila['hombres']);
            $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);            
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $valoresFila['mujeres']);
            $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);            
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $valoresFila['pcc']);
            $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);            
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $fila, $valoresFila['ujc']);
            $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);            
            $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, $valoresFila['altas']);
            $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);            
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $fila, $valoresFila['bajas']);
            $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            
            //Incremento los contadores de los totales:
            $totalTotalTrabajadores += $valoresFila['totaltrabajadores'];
            $totalHombres += $valoresFila['hombres'];
            $totalMujeres += $valoresFila['mujeres'];
            $totalPCC += $valoresFila['pcc'];
            $totalUJC += $valoresFila['ujc'];
            $totalAltas += $valoresFila['altas'];
            $totalBajas += $valoresFila['bajas'];
            
            $posiActual = 8;
            
            if (count($valoresFila['bajaspormotivos']) != 0) {
                $total = 0;
                foreach ($valoresFila['bajaspormotivos'] as $k => $v) {
                    $cantidad = "";
                    if ($v['cantidad'] != 0) {
                        $cantidad = $v['cantidad'];
                        $total += $cantidad;                        
                    }
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $cantidad);
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                    $totalesMotivosBaja[$k] += $v['cantidad'];
                    $llaveDelTotal = $k + 1;
                    $posiActual++;
                }
                $totalesMotivosBaja[$llaveDelTotal] += $total;
                if ($total == 0) {
                    $total = "";
                }
                $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $total);
                $this->fnPintarBordes(
                    $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                );
                $posiActual++;
            } else {
                //En caso que no haya cargos en el organo correspondiente a la
                // fila relleno todo el tramo con celdas vacias incluyendo
                // la columna total
                $totalColumnasMotivoBaja = $denomColumnas['totalmotivosbaja'];
                $maximaPosicion = $posiActual + $totalColumnasMotivoBaja;
                for ($i = $posiActual; $i <= $maximaPosicion; $i++) {
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . $fila, '');
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$i] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                }
                //Actualizo la posicion actual:
                $posiActual = $maximaPosicion + 1;
            }
            
            if (count($valoresFila['escolaridad']) != 0) {
                $totalEscolaridad = 0;
                foreach ($valoresFila['escolaridad'] as $k => $v) {
                    $cant = "";
                    if ($v['cantidad'] != 0) {
                        $cant = $v['cantidad'];
                        $totalEscolaridad += $cant;
                    }
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $cant);
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                    $totalesEscolaridad[$k] += $v['cantidad'];
                    $llaveDelTotalEsc = $k + 1;
                    $posiActual++;
                }
                $totalesEscolaridad[$llaveDelTotalEsc] += $totalEscolaridad;
                if ($totalEscolaridad == 0) {
                    $totalEscolaridad = "";
                }
                $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $totalEscolaridad);
                $this->fnPintarBordes(
                    $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                );
                $posiActual++;
            } else {
                $totalColumnasEscolaridad = $denomColumnas['totalniveleduc'];
                $maximaPosicion = $posiActual + $totalColumnasEscolaridad;
                for ($i = $posiActual; $i <= $maximaPosicion; $i++) {
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . $fila, '');
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$i] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                }
                //Actualizo la posicion actual:
                $posiActual = $maximaPosicion + 1;
            }            
            
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['edadnoconocida']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;            
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['menoresdequince']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;            
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['entre15y16']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;            
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['entre17y19']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;            
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['entre20y29']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;            
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['entre30y39']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['entre40y59']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;            
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['entre60y64']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['entre65y69']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['mayoresdesetenta']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;
            $objPHPExcel->getActiveSheet()->setCellValue(
                $alfabeto[$posiActual] . $fila, $valoresFila['totaledades']
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $posiActual++;
            
            //Incremento los contadores de los totales:
            $totalEdadNoConocida += $valoresFila['edadnoconocida'];
            $totalMenoresDeQuince += $valoresFila['menoresdequince'];
            $totalEntreQuinyDie += $valoresFila['entre15y16'];
            $totalEntreDiecisieteyDiec += $valoresFila['entre17y19'];
            $totalEntreVeinteyVeintinu += $valoresFila['entre20y29'];
            $totalEntreTreintayTrenNu += $valoresFila['entre30y39'];
            $totalEntreCuaryCuarentaN += $valoresFila['entre40y59'];
            $totalEntreSesenteySesentacu += $valoresFila['entre60y64'];
            $totalEntreSesentaCySesentaNu += $valoresFila['entre65y69'];
            $totalMayoresDeSetenta += $valoresFila['mayoresdesetenta'];
            $totalTotalEdades += $valoresFila['totaledades'];
            
            if (count($valoresFila['composicionetnica']) != 0) {
                $totalCompEtnica = 0;
                foreach ($valoresFila['composicionetnica'] as $k => $v) {
                    $canti = "";
                    if ($v['cantidad'] != 0) {
                        $canti = $v['cantidad'];
                        $totalCompEtnica += $canti;
                    }
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $canti);
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                    $totalesCompEtnica[$k] += $v['cantidad'];
                    $llaveDelTotalCompEtnica = $k + 1;
                    $posiActual++;
                }
                $totalesCompEtnica[$llaveDelTotalCompEtnica] += $totalCompEtnica;
                if ($totalCompEtnica == 0) {
                    $totalCompEtnica = "";
                }
                $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $totalCompEtnica);
                $this->fnPintarBordes(
                    $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                );
                $posiActual++;
            } else {
                $totalColumnasCompEtnica = $denomColumnas['totalcolorespiel'];
                $maximaPosicion = $posiActual + $totalColumnasCompEtnica;
                for ($i = $posiActual; $i <= $maximaPosicion; $i++) {
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . $fila, '');
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$i] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                }
            }
            
            $fila++;
        }
        
        //Pinto la fila de los totales:
        $this->fnFuenteTexto($objPHPExcel, 'A' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, 'TOTAL');
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $this->fnFuenteTexto($objPHPExcel, 'B' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('B' . $fila, $totalTotalTrabajadores);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'B' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $this->fnFuenteTexto($objPHPExcel, 'C' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('C' . $fila, $totalHombres);
        $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'C' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $this->fnFuenteTexto($objPHPExcel, 'D' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('D' . $fila, $totalMujeres);
        $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'D' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $this->fnFuenteTexto($objPHPExcel, 'E' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('E' . $fila, $totalPCC);
        $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'E' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $this->fnFuenteTexto($objPHPExcel, 'F' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('F' . $fila, $totalUJC);
        $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'F' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $this->fnFuenteTexto($objPHPExcel, 'G' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('G' . $fila, $totalAltas);
        $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'G' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $this->fnFuenteTexto($objPHPExcel, 'H' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('H' . $fila, $totalBajas);
        $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'H' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $posicion = 8;
        foreach ($totalesMotivosBaja as $value) {
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $value);
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN
            );
            $posicion++;
        }
        
        foreach ($totalesEscolaridad as $value) {
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $value);
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN
            );
            $posicion++;
        }
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalEdadNoConocida);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalMenoresDeQuince);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalEntreQuinyDie);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalEntreDiecisieteyDiec);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalEntreVeinteyVeintinu);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalEntreTreintayTrenNu);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalEntreCuaryCuarentaN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalEntreSesenteySesentacu);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalEntreSesentaCySesentaNu);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalMayoresDeSetenta);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalTotalEdades);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        foreach ($totalesCompEtnica as $value) {
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $value);
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
            );
            $this->fnPintarBordes(
                $objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN
            );
            $posicion++;
        }
        
        
        //Cambiandole la dimensión a las filas
        $objPHPExcel->getActiveSheet()->getRowDimension(3)->setRowHeight(100);
        //Cambiandole la dimensión a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(50);
        for ($i = 1; $i < $cantColumnas; $i++) {
            $objPHPExcel->getActiveSheet()->getColumnDimension($alfabeto[$i])->setWidth(5);
        }        
        
    }

    public function exportarExcel($idestructura, $fdesde, $fhasta)
    {
        $r = null;
        
        $objPHPExcel = new PHPExcel();

        $this->fnPintarEncabezado($objPHPExcel, $idestructura, $fdesde, $fhasta, 'Resumen FT', 0);

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
