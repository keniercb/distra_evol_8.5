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

class DatPromediotrabajadoresModel extends ZendExt_Model
{
    protected $DatAsistencia;
    protected $ConfConceptocausas;
    protected $NomCausaModel;
    protected $NomCausa;
    protected $ConfTipocontratosituacion;

    function __construct()
    {
        $this->DatAsistencia = new DatAsistencia();
        $this->ConfConceptocausas = new ConfConceptocausas();
        $this->NomCausaModel = new NomCausaModel();
        $this->NomCausa = new NomCausa();
        $this->ConfTipocontratosituacion = new ConfTipocontratosituacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getdata($fdesde, $fhasta, $idestructura)
    {
        $conceptos = array();
        $causascondatos = array();

        $fechainicio = explode('/', $fdesde);
        $fechafin = explode('/', $fhasta);
        $finicio = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
        $fechainicio1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
        $ffin = date_create($fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0]);

        $columnasGrid = array();
        while ($fechainicio1 <= $ffin) {
            $fi = explode('/', $fechainicio1->format('d/m/Y'));
            array_push($columnasGrid, $fi[0] . '/' . $fi[1]);
            date_add($fechainicio1, date_interval_create_from_date_string('1 day'));
            $FITEMPORAL = explode('/', $fechainicio1->format('d/m/Y'));
            $fechainicio1 = date_create($FITEMPORAL[2] . '-' . $FITEMPORAL[1] . '-' . $FITEMPORAL[0]);
        }

        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);
        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $reporte = $this->DatAsistencia->GetDatosPersonaReporte($cargosPeople, null, null, 0, $fdesde, $fhasta);

        $asistencia = $this->DatAsistencia->GetReporteAsistRangoByCargo($cargosPeople, $fdesde, $fhasta);

        $conceptosFT[0]['concepto'] = 'Trabajadores fijos';
        $conceptosFT[1]['concepto'] = 'Trabajadores Contratados';
        $conceptosFT[2]['concepto'] = 'Nombramiento Provisional';
        $conceptosFT[3]['concepto'] = 'Período de Prueba';
        $conceptosFT[4]['concepto'] = 'Total de Trabajadores';

        $causas = $this->ConfConceptocausas->getCausas();
        foreach ($causas as $i => $causa) {
            $denomcausa = $this->NomCausa->GetCausasById($causa['idcausa']);
            $conceptos[$i]['concepto'] = $denomcausa[0]['denominacion'];
            $conceptos[$i]['idcausa'] = $causa['idcausa'];
        }

        $conceptosTotales[1]['concepto'] = 'Total de Deducciones';
        $conceptosTotales[2]['concepto'] = 'Promedio de Trabajadores';

        foreach ($conceptosFT as $kctf => $valctf) {
            foreach ($columnasGrid as $col) {
                $conceptosFT[$kctf][$col] = 0;
            }
        }

        foreach ($conceptos as $k => $val) {
            foreach ($columnasGrid as $col) {
                $conceptos[$k][$col] = 0;
            }
        }

        foreach ($conceptosTotales as $kct => $valct) {
            foreach ($columnasGrid as $col) {
                $conceptosTotales[$kct][$col] = 0;
                $conceptosTotales[2][$col] = $conceptosFT[4][$col] - $conceptosTotales[1][$col];
            }
        }

        $tipocontratosituacion = $this->ConfTipocontratosituacion->gettipocontratosituacion();
        $resp = array();
        $tipocontrato = array();
        $situacion = array();
        foreach ($tipocontratosituacion as $i => $v) {
            if($v['idconcepto'] != $tipocontratosituacion[$i-1]['idconcepto']){
                $tipocontrato = array();
                $situacion = array();
            }
            array_push($tipocontrato,$v['idtipocontrato']);
            array_push($situacion,$v['idsituacion']);
            $resp[intval($v['idconcepto'])][0] = array_unique($tipocontrato);
            $resp[intval($v['idconcepto'])][1] = array_unique($situacion);
        }

        foreach ($reporte as $i => $person) {
            foreach ($columnasGrid as $col) {
                /*if ($person['idtipocontrato'] == 6 || $person['idtipocontrato'] == 31 || $person['idtipocontrato'] == 38 || $person['idtipocontrato'] == 40)
                    $conceptosFT[0][$col] += 1;
                if ($person['idtipocontrato'] == 5 && ($person['idsituacion'] != 9 && $person['idsituacion'] != 12 && $person['idsituacion'] != 13))
                    $conceptosFT[1][$col] += 1;
                if ($person['idtipocontrato'] == 41 || $person['idtipocontrato'] == 39 || $person['idtipocontrato'] == 8)
                    $conceptosFT[2][$col] += 1;
                if ($person['idtipocontrato'] == 5 && ($person['idsituacion'] == 9 || $person['idsituacion'] == 12 || $person['idsituacion'] == 13))
                    $conceptosFT[3][$col] += 1;*/
                if(in_array($person['idtipocontrato'],$resp[1][0]) || in_array($person['idsituacion'],$resp[1][1])){
                    $conceptosFT[0][$col] += 1;
                }else if(in_array($person['idtipocontrato'],$resp[2][0])){
                    if(in_array($person['idsituacion'],$resp[4][1])){
                        $conceptosFT[3][$col] += 1;
                    }else{
                        $conceptosFT[1][$col] += 1;
                    }
                }else if(in_array($person['idtipocontrato'],$resp[3][0]) || in_array($person['idsituacion'],$resp[3][1])){
                    $conceptosFT[2][$col] += 1;
                }
                $conceptosFT[4][$col] += 1;
            }
        }


        foreach ($asistencia as $j => $valor) {
            if ($this->ExisteCausaConcepto($valor['idcausa'], $causas) == true) {
                if (!$this->ExisteCausaConcepto($valor['idcausa'], $causascondatos))
                    array_push($causascondatos, $valor['idcausa']);
                if (empty($valor['fdesde']) && empty($valor['fhasta'])) {
                    $fech = explode('/', $valor['fecharegistro']);
                    $conceptosTotales[1][$fech[0] . '/' . $fech[1]] += 1;
                    $conceptos = $this->SumCausasConcepto($valor, $conceptos, $causas, $fech);
                } else {
                    $fdesde = explode('/', $valor['fdesde']);
                    $fhasta = explode('/', $valor['fhasta']);
                    $fd = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                    $fh = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);

                    $temphasta = $fh > $ffin ? $ffin : $fh;
                    $tempinicio = $fd < $finicio ? $finicio : $fd;

                    if (($fd >= $finicio && $fd <= $ffin) && ($fh >= $finicio && $fh <= $ffin)) {
                        $fecha1 = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                        $fecha2 = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);
                        while ($fecha1 <= $fecha2) {
                            $f1 = explode('/', $fecha1->format('d/m/Y'));
                            $conceptosTotales[1][$f1[0] . '/' . $f1[1]] += 1;
                            $conceptos = $this->SumCausasConcepto($valor, $conceptos, $causas, $f1);
                            date_add($fecha1, date_interval_create_from_date_string('1 days'));
                        }
                    } else {
                        if (($fd < $finicio) && ($fh >= $finicio && $fh <= $ffin)) {
                            $fecha1 = new DateTime($finicio->format("Y-m-d"));
                            $fecha2 = date_create($fhasta[2] . '-' . $fhasta[1] . '-' . $fhasta[0]);
                            while ($fecha1 <= $fecha2) {
                                $f1 = explode('/', $fecha1->format('d/m/Y'));
                                $conceptosTotales[1][$f1[0] . '/' . $f1[1]] += 1;
                                $conceptos = $this->SumCausasConcepto($valor, $conceptos, $causas, $f1);
                                date_add($fecha1, date_interval_create_from_date_string('1 days'));
                            }
                        } else {
                            if (($fd >= $finicio && $fd <= $ffin) && ($fh > $ffin)) {
                                $fecha1 = date_create($fdesde[2] . '-' . $fdesde[1] . '-' . $fdesde[0]);
                                $fecha2 = $ffin;
                                while ($fecha1 <= $fecha2) {
                                    $f1 = explode('/', $fecha1->format('d/m/Y'));
                                    $conceptosTotales[1][$f1[0] . '/' . $f1[1]] += 1;
                                    $conceptos = $this->SumCausasConcepto($valor, $conceptos, $causas, $f1);
                                    date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                }
                            } else {
                                $fecha1 = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
                                $fecha2 = $ffin;
                                while ($fecha1 <= $fecha2) {
                                    $f1 = explode('/', $fecha1->format('d/m/Y'));
                                    $conceptosTotales[1][$f1[0] . '/' . $f1[1]] += 1;
                                    $conceptos = $this->SumCausasConcepto($valor, $conceptos, $causas, $f1);
                                    date_add($fecha1, date_interval_create_from_date_string('1 days'));
                                }
                            }
                        }
                    }
                }
            }
        }
        $uniquecausasdatos = array_unique($causascondatos);
        foreach ($conceptos as $k => $v) {
            if (!in_array($v['idcausa'], $uniquecausasdatos)) {
                unset($conceptos[$k]);
            }
        }

        foreach ($conceptosTotales as $kct => $valct) {
            $suma = 0;
            $cont = 0;
            foreach ($columnasGrid as $col) {
                $conceptosTotales[2][$col] = $conceptosFT[4][$col] - $conceptosTotales[1][$col];
                $suma = $suma + $conceptosTotales[2][$col];
                $cont++;
            }
        }

        $promedio = $suma / $cont;
        $promediototal = round($promedio, 0);

        $conceptos = array_merge($conceptosFT, $conceptos);
        $conceptos = array_merge($conceptos, $conceptosTotales);
        $conceptos = array_values($conceptos);

        $r['columnas'] = $columnasGrid;
        $r['datos'] = $conceptos;
        $r['promediototal'] = $promediototal;
        return $r;
    }

    private function SumCausasConcepto($asistencia, $conceptos, $causaconcepto, $fech)
    {
        foreach ($conceptos as $key => $concepto) {
            if (!empty($causaconcepto[$key])) {
                if ($causaconcepto[$key]['idcausa'] == $asistencia['idcausa']) {
                    $conceptos[$key][$fech[0] . '/' . $fech[1]] += 1;
                }
            }
        }
        return $conceptos;
    }

    private function ExisteCausaConcepto($idcausa, $causaconcepto)
    {
        $val = false;
        foreach ($causaconcepto as $key => $causa) {
            if ($causa['idcausa'] == $idcausa) {
                $val = true;
            }
        }
        return $val;
    }

    public function GetDatosExportarExcel($arreglo)
    {
        $objPHPExcel = new PHPExcel();

        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('Promedio de trabajadores');

        $objPHPExcel->getActiveSheet()->getColumnDimension("A")->setWidth(30);

        $objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $rcampos = array('Conceptos/Días');
        $columnas = $arreglo['columnas'];
        foreach ($columnas as $key => $col) {
            $rcampos[] = $col;
        }

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

        foreach ($arreglo['datos'] as $key => $value) {
            $rdatos = array();
            //Arreglo de datos de la persona en cuestion
            $rdatos = array($value['concepto']);
            foreach ($columnas as $ind => $col) {
                $rdatos[] = ($value[$col]) ? $value[$col] : '';
            }

            foreach ($rdatos as $ind => $datospersona) {
                $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
                if ($rdatos[0] == 'Total de Trabajadores' || $rdatos[0] == 'Total de Deducciones' || $rdatos[0] == 'Promedio de Trabajadores') {
                    $objPHPExcel->getActiveSheet()->setCellValue($letraactual . intval($key + 2), $datospersona);
                    $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'top', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnAlinearTexto($objPHPExcel, $letraactual . intval($key + 2) . '', 'left', 'center', 0);
                    $this->fnPintarFondo($objPHPExcel, $letraactual . intval($key + 2), PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
                } else {
                    $objPHPExcel->getActiveSheet()->setCellValue($letraactual . intval($key + 2), $datospersona);
                    $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'top', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnPintarBordes($objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                    $this->fnAlinearTexto($objPHPExcel, $letraactual . intval($key + 2) . '', 'left', 'center', 0);
                }

            }
        }
        $objPHPExcel->getActiveSheet()->setCellValue('A' . intval($key + 4), 'Promedio de trabajadores: ' . $arreglo['promediototal']);
        $this->fnPintarFondo($objPHPExcel, 'A' . intval($key + 4), PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');
        $this->fnPintarBordes($objPHPExcel, 'A' . intval($key + 4), 'top', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . intval($key + 4), 'right', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . intval($key + 4), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
        $this->fnPintarBordes($objPHPExcel, 'A' . intval($key + 4), 'right', PHPExcel_Style_Border::BORDER_THIN);

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Promedio de trabajadores.xls" ');
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