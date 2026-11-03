<?php

$dirWWW = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);

include_once($dirWWW . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirWWW . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class ReporteexcelnivelescolarrangoedadesgeModel extends ZendExt_Model
{
    public function ReporteexcelnivelescolarrangoedadesgeModel()
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
        
        $modeloDatos = new DatosnivelescolarrangoedadesgeModel();
        
        $denomColumnas = $modeloDatos->getDenominacionColumnas();
        
        //No hacer nada y devolver un mensaje de error si esta vacio el nomenclador de Nivel eduacional:
        if (empty($denomColumnas['totalniveleduc'])) {
            print_r("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link href='/lib/ExtJS
                    /temas/default/css/icon-clases.css' rel='stylesheet' type='text/css' media='screen'/></head><body><pre
                    ><table width='100%' border='0'><tr><td width='7%'><div class='iconoERROR' style='margin:10 0 0 10'>
                    </div></td><td width='93%'><div style='margin:10px 0px 0px 0px;font-size:9pt' ><b>ERROR</b><br>Imposible 
                    crear el reporte ya que el nomenclador Nivel educacional se encuentra vacío.</div></td></tr></table></pre></body
                    >");die;
        }
        
        //No hacer nada y devolver un mensaje de error si esta vacia la configuracion de rangos de edades:
        if (empty($denomColumnas['totalrangoedades'])) {
            print_r("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link href='/lib/ExtJS
                    /temas/default/css/icon-clases.css' rel='stylesheet' type='text/css' media='screen'/></head><body><pre
                    ><table width='100%' border='0'><tr><td width='7%'><div class='iconoERROR' style='margin:10 0 0 10'>
                    </div></td><td width='93%'><div style='margin:10px 0px 0px 0px;font-size:9pt' ><b>ERROR</b><br>Imposible 
                    crear el reporte ya que la configuración Rango de edades se encuentra vacía.</div></td></tr></table></pre></body
                    >");die;
        }
        
        $cantColumnas = count($denomColumnas['denominaciones']);
        
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $entidad = $entidad[0]->denominacion;
        
        $gruposEscala = $modeloDatos->getGruposEscala($idestructura);
        
        //NO hacer nada y devolver un mensaje de error si no existen cargos o personas ubicadas en cargo en la estructura que se selecciono:
        if (empty($gruposEscala)) {
            print_r("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link href='/lib/ExtJS
                    /temas/default/css/icon-clases.css' rel='stylesheet' type='text/css' media='screen'/></head><body><pre
                    ><table width='100%' border='0'><tr><td width='7%'><div class='iconoERROR' style='margin:10 0 0 10'>
                    </div></td><td width='93%'><div style='margin:10px 0px 0px 0px;font-size:9pt' ><b>ERROR</b><br>Imposible 
                    crear el reporte ya que no existen cargos o no existen personas ubicadas en cargo en la estructura
                    seleccionada.</div></td></tr></table></pre></body
                    >");die;
        }
        
        $alfabeto = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N',
                    'O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB',
                    'AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM',
                    'AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX',
                    'AY','AZ','BA','BB','BC','BD','BE','BF','BG','BH','BI',
                    'BJ','BK','BL','BM','BN','BO','BP','BQ','BR','BS','BT',
                    'BU','BV','BW','BX','BY','BZ'];
        
        $objPHPExcel->setActiveSheetIndex($numerohoja);
        $objPHPExcel->getActiveSheet()->setTitle($titulo);
        
        //Concatenando la primera fila para escribir el encabezado del reporte:
        $objPHPExcel->getActiveSheet()->mergeCellsByColumnAndRow(0, 1, ($cantColumnas * 2 - 1) - 1, 1);        
        $objPHPExcel->getActiveSheet()->setCellValue(
            'A1', "DISTRIBUCIÓN DE LOS TRABAJADORES POR NIVEL ESCOLAR, RANGO DE EDADES Y GRUPO DE LA ESCALA     Entidad: $entidad     $fechaactual"
        );        
        //Dandole formato 'center':
        $this->fnAlinearTexto($objPHPExcel, 'A1', 'center', '', 0);
        //Dandole formato 'bold':
        $this->fnFuenteTexto($objPHPExcel, 'A1', 'Arial', 13);
        
        for ($i = 0; $i < $cantColumnas * 2 - 1; $i++) { //chr($cantColumnas/27 + 64).chr($letrarecorrer + 64);
            //Dandole border 'buttoms' a la celda
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '1', 'bottom', PHPExcel_Style_Border::BORDER_MEDIUM);
        }
        
        //Fila 2:
        $this->fnPintarBordes($objPHPExcel, 'A2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
        
        $posicionActual = 1;
        
        $textoNivelEsc = "NIVEL DE ESCOLARIDAD";
        if ($denomColumnas['totalniveleduc'] == 1) {
            $textoNivelEsc = "NE";
        }
        
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicionActual] . '2', $textoNivelEsc);
        $this->fnAlinearTexto($objPHPExcel, $alfabeto[$posicionActual] . '2', 'center', '', 0);
        $objPHPExcel->getActiveSheet()->mergeCells(
            $alfabeto[$posicionActual] . '2' . ':' . $alfabeto[$posicionActual + ($denomColumnas['totalniveleduc'] * 2) - 1] . '2'
        );
        $maximaPosicion = $posicionActual + ($denomColumnas['totalniveleduc'] * 2 - 1);
        for ($i = $posicionActual; $i <= $maximaPosicion; $i++) {
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
            $posicionActual = $i;
        }
        $this->fnPintarBordes(
            $objPHPExcel, $alfabeto[$posicionActual] . '2', 'right', PHPExcel_Style_Border::BORDER_THIN
        );
        
        $posicionActual += 1;        
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicionActual] . '2', 'RANGO DE EDADES');
        $this->fnAlinearTexto($objPHPExcel, $alfabeto[$posicionActual] . '2', 'center', '', 0);
        $objPHPExcel->getActiveSheet()->mergeCells(
            $alfabeto[$posicionActual] . '2' . ':' . $alfabeto[$posicionActual + ($denomColumnas['totalrangoedades'] * 2) - 1] . '2'
        );
        $maximaPosicion = $posicionActual + ($denomColumnas['totalrangoedades'] * 2 - 1);
        for ($i = $posicionActual; $i <= $maximaPosicion; $i++) {
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
            $posicionActual = $i;
        }
        $this->fnPintarBordes(
            $objPHPExcel, $alfabeto[$posicionActual] . '2', 'right', PHPExcel_Style_Border::BORDER_THIN
        );  
        
        $posicionActual += 1;        
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicionActual] . '2', 'JUBILACIÓN');
        $this->fnAlinearTexto($objPHPExcel, $alfabeto[$posicionActual] . '2', 'center', '', 0);
        $objPHPExcel->getActiveSheet()->mergeCells(
            $alfabeto[$posicionActual] . '2' . ':' . $alfabeto[$posicionActual + 1] . '2'
        );
        $maximaPosicion = $posicionActual + 1;
        for ($i = $posicionActual; $i <= $maximaPosicion; $i++) {
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
            $posicionActual = $i;
        }
        $this->fnPintarBordes(
            $objPHPExcel, $alfabeto[$posicionActual] . '2', 'right', PHPExcel_Style_Border::BORDER_THIN
        ); 
        
        $posicionActual += 1;        
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicionActual] . '2', 'TOTAL');
        $this->fnAlinearTexto($objPHPExcel, $alfabeto[$posicionActual] . '2', 'center', '', 0);
        $objPHPExcel->getActiveSheet()->mergeCells(
            $alfabeto[$posicionActual] . '2' . ':' . $alfabeto[$posicionActual + 1] . '2'
        );
        $maximaPosicion = $posicionActual + 1;
        for ($i = $posicionActual; $i <= $maximaPosicion; $i++) {
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$i] . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN); 
            $posicionActual = $i;
        }
        $this->fnPintarBordes(
            $objPHPExcel, $alfabeto[$posicionActual] . '2', 'right', PHPExcel_Style_Border::BORDER_THIN
        ); 
        
        //Fila 3:
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[0] . '3', $denomColumnas['denominaciones'][0]);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[0] . '3', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[0] . '3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);  
        $j = 1;
        for ($i = 1; $i < $cantColumnas; $i++) {
            $objPHPExcel->getActiveSheet()->mergeCells($alfabeto[$j] . '3' . ':' . $alfabeto[$j + 1] . '3');
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$j] . '3', $denomColumnas['denominaciones'][$i]);
            $this->fnAlinearTexto($objPHPExcel, $alfabeto[$j] . '3', 'center', '', 90);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j+1] . '3', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j] . '3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$j+1] . '3', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $j+=2;
        }
        
        //Fila 4:
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[0] . '4', 'A');
        $this->fnAlinearTexto($objPHPExcel, $alfabeto[0] . '4', 'center', '', 0);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[0] . '4', 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[0] . '4', 'bottom', PHPExcel_Style_Border::BORDER_THIN);  
        for ($i = 1; $i < $cantColumnas * 2 - 1; $i++) {
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
        
        //Para congelar las 4 primeras filas con el encabezado y la primera columna con los Grupo Escala:
        $objPHPExcel->getActiveSheet()->freezePane('B5');
        
        
        //A partir de la fila 5:
        
        $totalesEscolaridad = array();
        $totalesRangosEdad = array();       
        $totalEnEdadJubilacion = 0;
        $totalMujeresEnEdadJubilacion = 0;
        $totalTotalTotal = 0;
        $totalMujeresTotal = 0;
        
        $fila = 5;
        foreach ($gruposEscala as $value) {
            
            $valoresFila = $modeloDatos->getValoresFila($value['idgrupocomplejidad'], $idestructura);
            
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, $value['grupoescala']);
            $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);  
            
            $posiActual = 1;
          
            if (count($valoresFila['escolaridad']) != 0) {
                foreach ($valoresFila['escolaridad'] as $k => $v) {
                    $cant = "";
                    $cantMujeres = "";
                    if ($v['cantidad'] != 0) {
                        $cant = $v['cantidad'];
                    }
                    if ($v['cantidadmujeres'] != 0) {
                        $cantMujeres = $v['cantidadmujeres'];
                    }
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $cant);
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                    $posiActual++;
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $cantMujeres);
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                    $posiActual++;
                    $totalesEscolaridad[$k]['total'] += $v['cantidad'];
                    $totalesEscolaridad[$k]['totalmujeres'] += $v['cantidadmujeres'];
                }
            } else {
                $totalColumnasEscolaridad = $denomColumnas['totalniveleduc'];
                $maximaPosicion = $posiActual + $totalColumnasEscolaridad * 2 - 1;
                for ($i = $posiActual; $i <= $maximaPosicion; $i++) {
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . $fila, '');
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$i] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                }
                //Actualizo la posicion actual:
                $posiActual = $maximaPosicion + 1;
            }
            
            if (count($valoresFila['rangosedades']) != 0) {
                foreach ($valoresFila['rangosedades'] as $k => $v) {
                    $cant = "";
                    $cantMujeres = "";
                    if ($v['cantidad'] != 0) {
                        $cant = $v['cantidad'];
                    }
                    if ($v['cantidadmujeres'] != 0) {
                        $cantMujeres = $v['cantidadmujeres'];
                    }
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $cant);
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                    $posiActual++;
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $cantMujeres);
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                    $posiActual++;
                    $totalesRangosEdad[$k]['total'] += $v['cantidad'];
                    $totalesRangosEdad[$k]['totalmujeres'] += $v['cantidadmujeres'];
                }
            } else {
                $totalColumnasRangosEdad = $denomColumnas['totalrangoedades'];
                $maximaPosicion = $posiActual + $totalColumnasRangosEdad * 2 - 1;
                for ($i = $posiActual; $i <= $maximaPosicion; $i++) {
                    $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$i] . $fila, '');
                    $this->fnPintarBordes(
                        $objPHPExcel, $alfabeto[$i] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN
                    );
                }
                //Actualizo la posicion actual:
                $posiActual = $maximaPosicion + 1;
            }
                        
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $valoresFila['enedadjubilacion']);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $posiActual++;
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $valoresFila['enedadjubilacionmujeres']);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $posiActual++;
            
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $valoresFila['totaltotal']);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $posiActual++;
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posiActual] . $fila, $valoresFila['totalmujeres']);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posiActual] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $posiActual++;
            
            //Incremento los contadores de los totales:
            
            $totalEnEdadJubilacion += $valoresFila['enedadjubilacion'];
            $totalMujeresEnEdadJubilacion += $valoresFila['enedadjubilacionmujeres'];
            
            $totalTotalTotal += $valoresFila['totaltotal'];
            $totalMujeresTotal += $valoresFila['totalmujeres'];
            
            
            $fila++;
        }
        
        //Pinto la fila de los totales:
        $this->fnFuenteTexto($objPHPExcel, 'A' . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue('A' . $fila, 'TOTAL');
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        
        $posicion = 1;
        
        foreach ($totalesEscolaridad as $llave => $valor) {
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $valor['total']);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $posicion++;
            
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $valor['totalmujeres']);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $posicion++;
        }
        
        foreach ($totalesRangosEdad as $llave => $valor) {
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $valor['total']);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $posicion++;
            
            $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
            $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $valor['totalmujeres']);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $posicion++;
        }

        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalEnEdadJubilacion);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalMujeresEnEdadJubilacion);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalTotalTotal);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        $this->fnFuenteTexto($objPHPExcel, $alfabeto[$posicion] . $fila, 'Arial', 10);
        $objPHPExcel->getActiveSheet()->setCellValue($alfabeto[$posicion] . $fila, $totalMujeresTotal);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, $alfabeto[$posicion] . $fila, 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $posicion++;
        
                
        //Cambiandole la dimensión a las filas
        $objPHPExcel->getActiveSheet()->getRowDimension(3)->setRowHeight(110);
        //Cambiandole la dimensión a las columnas
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(12);
        for ($i = 1; $i < $cantColumnas * 2 - 1; $i++) {
            $objPHPExcel->getActiveSheet()->getColumnDimension($alfabeto[$i])->setWidth(9);
        }
        
        
    }

    public function exportarExcel($idestructura, $fdesde, $fhasta)
    {
        $r = null;
        
        $objPHPExcel = new PHPExcel();

        $this->fnPintarEncabezado($objPHPExcel, $idestructura, 'Niv. Esc., Rango Edades y GE', 0);

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
