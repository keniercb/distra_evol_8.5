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

class DatEstadisticageneralModel extends ZendExt_Model
{
    protected $DatAsistencia;
    protected $NomCausaModel;
    protected $DatAsistenciaModel;
    protected $objPHPExcel;

    function __construct()
    {
        $this->DatAsistencia = new DatAsistencia();
        $this->NomCausaModel = new NomCausaModel();
        $this->DatAsistenciaModel = new DatAsistenciaModel();
        $this->objPHPExcel = new PHPExcel();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAsistenciaEstadistica($fdesde, $fhasta, $idestructura, $tiporeporte)
    {
        $r = array();
        $result = array();
        $header = array();
        $headerlimpios = array();
        $a = array();
        $est = array();
        $causasP = array();
        $causasA = array();
        $causasPres = array();
        $causasAus = array();
        $arraycargos = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];

        if ($tiporeporte == 1) {
            $est = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($idestructura);
            foreach ($est as $i => $v) {
                if ($est->idconcepto != 7) {
                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($v->id, $iddominio, true);

                    if (count($cargos) > 0) {
                        foreach ($cargos as $j => $val) {
                            $arraycargos[$v->id]['denominacion'] = $v->denominacion;
                            $arraycargos[$v->id]['cargos'][] = $val['idestructura'];
                        }
                    }
                }
            }
        } else if ($tiporeporte == 2 || $tiporeporte == 4) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, true);
            if (count($cargos) > 0) {
                $idcargos = array();
                foreach ($cargos as $j => $val) {
                    array_push($idcargos, $val['idestructura']);
                }
            }
            if ($tiporeporte == 2) {

                $arraycargos = $this->DatAsistencia->getCargosPorCatOcupacional($idcargos);
            } else if ($tiporeporte == 4) {
                $arraycargos = $this->DatAsistencia->getCargosPorSexo($idcargos, $fhasta);
            }
        }

        /*------------------Iterar por los cargos-----------------*/
        $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $t = array();
        $t['idestructura'] = $idestructura;
        $t['estructura'] = 'Total';
        $t['entidad'] = $estructura[0]->denominacion;
        $t['porplantilla'] = 0;
        $t['cubierto'] = 0;
        $t['presente'] = 0;
        $a['presentesreal'] = 0;
        $t['tarde'] = 0;
        $t['totalfuera'] = 0;
        $t['sinregistro'] = 0;
        $i = 0;
        foreach ($arraycargos as $k => $v) {
            $idscargos = $v['cargos'];
            if (count($idscargos) > 0) {
                $datoscargos = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($idscargos);
                $a = array();
                $a['idestructura'] = $k;
                $a['estructura'] = $v['denominacion'];
                $a['entidad'] = $estructura[0]->denominacion;
                $a['porplantilla'] = 0;
                if ($tiporeporte == 4)
                    $a['cubierto'] = (int)count($idscargos);
                else
                    $a['cubierto'] = (int)$this->DatAsistencia->GetCubiertosXCargos($idscargos, $fhasta)[0]['cantidad'];
                $a['presente'] = 0;
                $a['totalasistencia'] = 0;
                $a['presentesreal'] = 0;
                $a['tarde'] = 0;
                $a['totalfuera'] = 0;
                $a['sinregistro'] = 0;

                foreach ($datoscargos as $key => $idcargo) {
                    if ($idestructura) {
                        $a['porplantilla'] = $idcargo['cantidad'] + $a['porplantilla'];
                    }
                }
                $t['porplantilla'] += $a['porplantilla'];

                $result[$i] = $a;

                $asistencia = $this->DatAsistencia->GetReporteAsistRangoByCargo($idscargos, $fdesde, $fhasta);

                $result[$i]['totalfuera'] = 0;
                $result[$i]['presente'] = 0;
                /*------------------Iterar por las asistencias-----------------*/
                $var = 0;
                foreach ($asistencia as $ind => $val) {
                    if(!empty($val['fechahoraentrada']) || (!empty($val['idcausa'])))
                        $result[$i]['totalasistencia'] += 1;
                    if ($val['abreviaturacausa'] == 'T') {
                        //$var += 1;
                        $tardanza[$i]['categorias'][] = $val['nombreapellidos'];

                        $fh = explode(' ', $val['fechahoraentrada']);
                        $f = $fh[0];
                        $h = $fh[1];
                        $farr = explode('/', $f);
                        $ff = $farr[2] . "/" . $farr[1] . "/" . $farr[0];
                        $tardanza[$i]['datos'][] = $ff . " " . $h;
                    }
                    if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' || $val['abreviaturacausa'] == 'T/SA'))) {
                        $result[$i]['presentesreal'] += 1;
                    }
                    if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0)) {
                        $result[$i]['presente'] += 1;
                    } elseif ((!empty($val['idcausa']) && !empty($val['abreviaturacausa']) && $val['afectasalario'] == 1 && ($val['abreviaturacausa'] != 'T'
                        || $val['abreviaturacausa'] != 'SA' || $val['abreviaturacausa'] != 'T/SA'))
                    ) {
                        $result[$i]['totalfuera'] += 1;
                    }
                    array_push($header, $val['abreviaturacausa']);
                    if (!empty($val['idcausa']) && !empty($val['abreviaturacausa'])) {
                        if ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' ||
                            $val['abreviaturacausa'] == 'T/SA' || $val['afectasalario'] == 0
                        ) {
                            $causasP = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                            if (!$this->existecausa($causasP, $causasPres)) {
                                array_push($causasPres, $causasP);
                            }
                        } else {
                            $causasA = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                            if (!$this->existecausa($causasA, $causasAus)) {
                                array_push($causasAus, $causasA);
                            }
                        }
                    }
                    $dataindex[$val['idcausa']] = array('dataindex' => $val['idcausa']);
                    $result[$i][$val['idcausa']] += 1;
                    $t[$val['idcausa']] += 1;
                }
                $result[$i]['sinregistro'] = $a['cubierto'] - $result[$i]['totalasistencia'];

                $result[$i]['totalfuera'] = $result[$i]['totalfuera'];
                $result[$i]['presentesreal'] = $result[$i]['presentesreal'];
                $t['cubierto'] += $result[$i]['cubierto'];
                $t['totalasistencia'] += $result[$i]['totalasistencia'];
                $t['sinregistro'] += $result[$i]['sinregistro'];
                $t['presente'] += $result[$i]['presente'];
                $t['presentesreal'] += $result[$i]['presentesreal'];
                $t['totalfuera'] += $result[$i]['totalfuera'];
                $t['tarde'] += $result[$i]['tarde'];

                $headerlimpios = array_unique($header);
                $dataindexlimpios = array();
                foreach ($dataindex as $index => $obj)
                    $dataindexlimpios[] = $obj;

                //ordenando los dataindex de manera descendente
                usort($dataindexlimpios, "cmp");
            } else {
                $a = array();
                $a['idestructura'] = $k;
                $a['estructura'] = $v['denominacion'];
                $a['entidad'] = $estructura[0]->denominacion;
                $a['porplantilla'] = 0;
                $a['cubierto'] = 0;
                $a['totalasistencia'] = 0;
                $a['presente'] = 0;
                $a['presentesreal'] = 0;
                $a['tarde'] = 0;
                $a['totalfuera'] = 0;
                $a['sinregistro'] = 0;
                $result[$i] = $a;
            }
            $i++;
        }

        $tmpt = array();
        $tmpt['categorias'] = array();
        $tmpt['datos'] = array();
        foreach ($tardanza as $tar) {
            foreach ($tar['categorias'] as $key => $value) {
                array_push($tmpt['categorias'], $tar['categorias'][$key]);
                array_push($tmpt['datos'], $tar['datos'][$key]);
            }

        }
        $tardanza[count($est)] = $tmpt;

        array_push($result, $t);
        $causastodas = array();
        $causastodas = array_merge($causasPres, $causasAus);
        $resumenGrafico = array();
        $grafica = array();
        $categorias = array();
        $datos = array();
        foreach ($result as $key => $per) {
            $datos[$key]['name'] = $per['estructura'];
            $i = 0;
            foreach ($causastodas as $k => $v) {
                if (!empty($per[$v['dataindex']]) && !empty($v['denom'])) {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = $per[$v['dataindex']];
                } else {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = null;
                }
                $i++;
            }
        }
        $r['causasP'] = $causasPres;
        $r['causasA'] = $causasAus;

        $datos['name'] = 'Datos';
        $r['dataindex'] = $dataindexlimpios;
        $r['datos'] = $result;
        $r['cantidad'] = count($result);
        $r['header'] = $headerlimpios;
        $grafic['name'] = $categorias;
        $grafic['data'] = $datos;
        $grafic['tardanza'] = $tardanza;
        $r['resumen'] = $grafic;
        return $r;
    }

    public function getasistenciaByDias($fdesde, $fhasta, $idestructura)
    {
        $r = array();
        $result = array();
        $header = array();
        $headerlimpios = array();
        $a = array();
        $est = array();
        $causasP = array();
        $causasA = array();
        $causasPres = array();
        $causasAus = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $causas = $this->NomCausaModel->GetCausasMultiEncabezado();

        $fechainicio = explode('/', $fdesde);
        $fechafin = explode('/', $fhasta);
        $finicio = date_create($fechainicio[2] . '-' . $fechainicio[1] . '-' . $fechainicio[0]);
        $ffin = date_create($fechafin[2] . '-' . $fechafin[1] . '-' . $fechafin[0]);

        $columnasGrid = array();
        while ($finicio <= $ffin) {
            array_push($columnasGrid, $finicio->format('d/m/Y'));
            date_add($finicio, date_interval_create_from_date_string('1 day'));
        }

        /*------------------Iterar por las fechas-----------------*/
        $padre = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $t = array();
        $t['idestructura'] = $idestructura;
        $t['estructura'] = 'Total';
        $t['entidad'] = $padre[0]->denominacion;
        $t['presente'] = 0;
        $t['totalasistencia'] = 0;
        $t['sinregistro'] = 0;
        $a['presentesreal'] = 0;
        $t['tarde'] = 0;
        $t['totalfuera'] = 0;

        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, true);
        if (count($cargos) > 0) {
            $idcargos = array();
            foreach ($cargos as $j => $val) {
                array_push($idcargos, $val['idestructura']);
            }
        }

        $asistencia = $this->DatAsistencia->GetReporteAsistRangoCargoByFecha($idcargos, $fdesde, $fhasta);
        $cubiertos = (int)$this->DatAsistencia->GetCubiertosXCargos($idcargos, $fhasta)[0]['cantidad'];
        foreach ($columnasGrid as $i => $v) {
            $a = array();
            $a['idestructura'] = $idestructura;
            $a['estructura'] = $v;
            $a['entidad'] = $padre[0]->denominacion;
            $a['presente'] = 0;
            $a['totalasistencia'] = 0;
            $a['sinregistro'] = 0;
            $a['presentesreal'] = 0;
            $a['tarde'] = 0;
            $a['totalfuera'] = 0;
            $result[$i] = $a;
            $result[$i]['totalfuera'] = 0;
            $result[$i]['presente'] = 0;
            /*------------------Iterar por las asistencias-----------------*/
            $var = 0;
            foreach ($asistencia[$v] as $ind => $val) {
                $result[$i]['totalasistencia'] += 1;
                if ($val['abreviaturacausa'] == 'T') {
                    $var += 1;
                    $tardanza[$i]['categorias'][] = $val['nombreapellidos'];

                    $fh = explode(' ', $val['fechahoraentrada']);
                    $f = $fh[0];
                    $h = $fh[1];
                    $farr = explode('/', $f);
                    $ff = $farr[2] . "/" . $farr[1] . "/" . $farr[0];
                    $tardanza[$i]['datos'][] = $ff . " " . $h;
                }
                if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                    $result[$i]['presentesreal'] += 1;
                }
                if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && $val['abreviaturacausa'] != 'T')) {
                    $result[$i]['presente'] += 1;
                } elseif ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && (($val['abreviaturacausa'] != 'T') || $val['abreviaturacausa'] != 'SA' ||
                        $val['abreviaturacausa'] != 'T/SA'))
                ) {
                    $result[$i]['totalfuera'] += 1;
                }
                array_push($header, $val['abreviaturacausa']);
                $causas[$val['idcausa']] = array('idcausa' => $val['idcausa'], 'abreviatura' => $val['abreviaturacausa']);
                if (!empty($val['idcausa']) && !empty($val['abreviaturacausa'])) {
                    if ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' ||
                        $val['abreviaturacausa'] == 'T/SA' || $val['afectasalario'] == 0
                    ) {
                        $causasP = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                        if (!$this->existecausa($causasP, $causasPres)) {
                            array_push($causasPres, $causasP);
                        }
                    } else {
                        $causasA = array('dataindex' => $val['idcausa'], 'denom' => $val['abreviaturacausa'], 'afectasalario' => $val['afectasalario'], 'denominacion' => $val['denominacion']);
                        if (!$this->existecausa($causasA, $causasAus)) {
                            array_push($causasAus, $causasA);
                        }
                    }
                }
                $dataindex[$val['idcausa']] = array('dataindex' => $val['idcausa']);
                $result[$i][$val['idcausa']] += 1;
                $t[$val['idcausa']] += 1;
            }
            $result[$i]['sinregistro'] = $cubiertos - $result[$i]['totalasistencia'];
            $result[$i]['totalfuera'] = $result[$i]['totalfuera'];
            $result[$i]['presentesreal'] = $result[$i]['presentesreal'] + $var;
            $t['presente'] += $result[$i]['presente'];
            $t['totalasistencia'] += $result[$i]['totalasistencia'];
            $t['sinregistro'] = $cubiertos - $t['totalasistencia'];
            $t['presentesreal'] += $result[$i]['presentesreal'];
            $t['totalfuera'] += $result[$i]['totalfuera'];
            $t['tarde'] += $result[$i]['tarde'];

            $headerlimpios = array_unique($header);
            $dataindexlimpios = array();
            foreach ($dataindex as $index => $obj)
                $dataindexlimpios[] = $obj;

            //ordenando los dataindex de manera descendente
            usort($dataindexlimpios, "cmp");
        }
        $tmpt = array();
        $tmpt['categorias'] = array();
        $tmpt['datos'] = array();
        foreach ($tardanza as $tar) {
            foreach ($tar['categorias'] as $key => $value) {
                array_push($tmpt['categorias'], $tar['categorias'][$key]);
                array_push($tmpt['datos'], $tar['datos'][$key]);
            }
        }
        $tardanza[count($est)] = $tmpt;

        array_push($result, $t);
        $causastodas = array();
        $causastodas = array_merge($causasPres, $causasAus);
        $resumenGrafico = array();
        $grafica = array();
        $categorias = array();
        $datos = array();

        foreach ($result as $key => $per) {
            $datos[$key]['name'] = $per['estructura'];
            $i = 0;
            foreach ($causastodas as $k => $v) {
                if (!empty($per[$v['dataindex']]) && !empty($v['denom'])) {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = $per[$v['dataindex']];
                } else {
                    $datos[$key]['causa'][$i][0] = $v['denominacion'];
                    $datos[$key]['causa'][$i][1] = null;
                }
                $i++;
            }
        }
        $r['causasP'] = $causasPres;
        $r['causasA'] = $causasAus;

        $datos['name'] = 'Datos';
        $r['dataindex'] = $dataindexlimpios;
        $r['datos'] = $result;
        $r['cantidad'] = count($result);
        $r['header'] = $headerlimpios;
        $grafic['name'] = $categorias;
        $grafic['data'] = $datos;
        $grafic['tardanza'] = $tardanza;
        $r['resumen'] = $grafic;
        return $r;
    }

    public function getAsistenciaNominal($columnIndex, $idcausa, $desde, $hasta, $idestructura, $tiporeporte, $estructura, $agrupador, $identidad, $filtro)
    {
        $arrdatos = array();
        $cant = 0;
        $datos = $this->getAsistencia($idestructura, $identidad, $desde, $hasta, $tiporeporte, $estructura, $columnIndex, $filtro);
        if ($tiporeporte == 3) {
            if (empty($idcausa) && $columnIndex > 6 && $idcausa != 'totalfuera') {
                foreach ($datos['datos'] as $i => $val) {
                    if (is_numeric($val['idcausa']) && $val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);

            } else if (!empty($idcausa) && $columnIndex > 6 && $idcausa != 'totalfuera') {
                foreach ($datos['datos'] as $i => $val) {
                    if ($val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);
            } else {
                /*if ($columnIndex == 3) {
                    $arrResumen['datos'] = $datos['sinregistro'];
                    $arrResumen['cantidad'] = count($datos['sinregistro']);
                }else*/
                if ($columnIndex == 3) {
                    $arrResumen['datos'] = $datos['datos'];
                    $arrResumen['cantidad'] = count($datos['datos']);
                } else if ($columnIndex == 5) {
                    foreach ($datos['datos'] as $i => $val) {
                        if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && ($val['abreviaturacausa'] != 'T' || $val['abreviaturacausa'] != 'SA' || $val['abreviaturacausa'] != 'T/SA'))) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($columnIndex == 6) {
                    $var = 0;
                    foreach ($datos['datos'] as $i => $val) {
                        if ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' || $val['abreviaturacausa'] == 'T/SA') {
                            array_push($arrdatos, $val);
                        }
                        if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($idcausa == 'totalfuera') {
                    foreach ($datos['datos'] as $i => $val) {
                        if ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && ($val['abreviaturacausa'] != 'T' || $val['abreviaturacausa'] != 'SA' || $val['abreviaturacausa'] != 'T/SA') && empty($val['fechahoraentrada']))) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                }
            }
        } else if ($tiporeporte == 1 || $tiporeporte == 2) {
            if (empty($idcausa) && $columnIndex > 8 && $idcausa != 'totalfuera') {
                foreach ($datos['datos'] as $i => $val) {
                    if (is_numeric($val['idcausa']) && $val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);

            } else if (!empty($idcausa) && $columnIndex > 8 && $idcausa != 'totalfuera') {
                foreach ($datos['datos'] as $i => $val) {
                    if ($val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);
            } else {
                if ($columnIndex == 4) {
                    $arrResumen['datos'] = $datos['datos'];
                    $arrResumen['cantidad'] = count($datos['datos']);
//                } else if ($columnIndex == 5) {
//                    $arrResumen['datos'] = $datos['sinregistro'];
//                    $arrResumen['cantidad'] = count($datos['sinregistro']);
                } else if ($columnIndex == 5) {
                    $arrResumen['datos'] = $datos['datos'];
                    $arrResumen['cantidad'] = count($datos['datos']);
                } else if ($columnIndex == 7) {
                    foreach ($datos['datos'] as $i => $val) {
                        if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && ($val['abreviaturacausa'] != 'T' || $val['abreviaturacausa'] != 'SA' || $val['abreviaturacausa'] != 'T/SA'))) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($columnIndex == 8) {
                    foreach ($datos['datos'] as $i => $val) {
                        if ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' || $val['abreviaturacausa'] == 'T/SA') {
                            array_push($arrdatos, $val);
                        }
                        if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($idcausa == 'totalfuera') {
                    foreach ($datos['datos'] as $i => $val) {
                        if ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && ($val['abreviaturacausa'] != 'T' || $val['abreviaturacausa'] != 'SA' || $val['abreviaturacausa'] != 'T/SA') && empty($val['fechahoraentrada']))) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                }
            }
        } else if ($tiporeporte == 4) {
            if (empty($idcausa) && $columnIndex > 7 && $idcausa != 'totalfuera') {
                foreach ($datos['datos'] as $i => $val) {
                    if (is_numeric($val['idcausa']) && $val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);

            } else if (!empty($idcausa) && $columnIndex > 7 && $idcausa != 'totalfuera') {
                foreach ($datos['datos'] as $i => $val) {
                    if ($val['idcausa'] == $idcausa) {
                        array_push($arrdatos, $val);
                    }
                }
                $arrResumen['datos'] = $arrdatos;
                $arrResumen['cantidad'] = count($arrdatos);
            } else {
                if ($columnIndex == 3) {
                    $arrResumen['datos'] = $datos['datos'];
                    $arrResumen['cantidad'] = count($datos['datos']);
//                } else if ($columnIndex == 4) {
//                    $arrResumen['datos'] = $datos['sinregistro'];
//                    $arrResumen['cantidad'] = count($datos['sinregistro']);
                } else if ($columnIndex == 4) {
                    $arrResumen['datos'] = $datos['datos'];
                    $arrResumen['cantidad'] = count($datos['datos']);
                } else if ($columnIndex == 6) {
                    foreach ($datos['datos'] as $i => $val) {
                        if (!empty($val['fechahoraentrada']) || (!empty($val['idcausa']) && $val['afectasalario'] == 0 && ($val['abreviaturacausa'] != 'T' || $val['abreviaturacausa'] != 'SA' || $val['abreviaturacausa'] != 'T/SA'))) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($columnIndex == 7) {
                    foreach ($datos['datos'] as $i => $val) {
                        if ($val['abreviaturacausa'] == 'T' || $val['abreviaturacausa'] == 'SA' || $val['abreviaturacausa'] == 'T/SA') {
                            array_push($arrdatos, $val);
                        }
                        if (!empty($val['fechahoraentrada']) && empty($val['idcausa'])) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                } else if ($idcausa == 'totalfuera') {
                    foreach ($datos['datos'] as $i => $val) {
                        if ((!empty($val['idcausa']) && $val['afectasalario'] == 1 && ($val['abreviaturacausa'] != 'T' || $val['abreviaturacausa'] != 'SA' || $val['abreviaturacausa'] != 'T/SA') && empty($val['fechahoraentrada']))) {
                            array_push($arrdatos, $val);
                        }
                    }
                    $arrResumen['datos'] = $arrdatos;
                    $arrResumen['cantidad'] = count($arrdatos);
                }
            }
        }
        foreach ($arrResumen['datos'] as $i => $val) {
            if ($agrupador == 1) {
                if (empty($val['denomarea']))
                    $arrResumen['datos'][$i]['agrupador'] = 'Sin área';
                else
                    $arrResumen['datos'][$i]['agrupador'] = $val['denomarea'];
            } else if ($agrupador == 2) {
                if (empty($val['idcausa']) && !empty($val['fechahoraentrada']))
                    $arrResumen['datos'][$i]['agrupador'] = 'Sin causa';
                else if(!empty($val['idcausa']))
                    $arrResumen['datos'][$i]['agrupador'] = $val['denominacion'];
            } else if ($agrupador == 3) {
                if (empty($val['fecharegistro']))
                    $arrResumen['datos'][$i]['agrupador'] = 'Sin registro';
                else
                    $arrResumen['datos'][$i]['agrupador'] = $val['fecharegistro'];
            }
        }

        $r['datos'] = $arrResumen['datos'];
        $r['cantidad'] = $arrResumen['cantidad'];
        return $r;
    }

    public function getAsistencia($id, $identidad, $desde, $hasta, $tiporeporte, $estructura, $columnIndex, $filtro)
    {
        $idpersonas = array();
        $idscargos = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];

        if ($tiporeporte == 1) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($id, $iddominio, true);
            foreach ($cargos as $j => $val) {
                $idscargos[$val['id']] = $val['id'];
            }
        } else if ($tiporeporte == 2) {
            $cargos = $this->DatAsistencia->getCargosPorCatOcup($id);
            foreach ($cargos as $j => $val) {
                $idscargos[$val['idcargo']] = $val['idcargo'];
            }
        } else if ($tiporeporte == 3) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($identidad, $iddominio, true);
            foreach ($cargos as $j => $val) {
                $idscargos[$val['id']] = $val['id'];
            }
        } else if ($tiporeporte == 4) {
            $cargos = $this->DatAsistencia->getCargosBySexo($id);
            foreach ($cargos as $j => $val) {
                $idscargos[$val['idcargo']] = $val['idcargo'];
            }
        }

        if (empty($idscargos)) {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($identidad, $iddominio, true);
            foreach ($cargos as $j => $val) {
                array_push($idscargos, $val['id']);
            }
        }

        if (!empty($idscargos)) {
            if ($tiporeporte == 4 && ($id == 0 || $id == 1))
                $p = $this->DatAsistencia->GetDatosPersonaReporte($idscargos, $filtro, null, 0, $desde, $hasta, $id);
            else
                $p = $this->DatAsistencia->GetDatosPersonaReporte($idscargos, $filtro, null, 0, $desde, $hasta);
        }

        $personas = array();
        $pers = array();
        $personascargo = array();
        $idpersonasDatos = array();
        foreach ($p as $person) {
            array_push($idpersonas, $person['idpersona']);
            $personas[$person['idpersona']][$person['idcargo']] = $person;
            $pers[$person['idpersona']] = $person;
            $personascargo[] = $person['idpersona'] . '_' . $person['idcargo'];
        }

        if (count($idpersonas) > 0) {
            if (!empty($idscargos)) {
                if ($tiporeporte == 3) {
                    if ($estructura == 'Total') {
                        $datos = $this->DatAsistencia->GetReporteAsistRangoByCargo($idscargos, $desde, $hasta,$filtro);
                    } else {
                        $fecharegistro = $estructura;
                        $datos = $this->DatAsistencia->GetReporteAsistFechaCargo($idscargos, $fecharegistro,$filtro);
                    }
                } else
                    $datos = $this->DatAsistencia->GetReporteAsistRangoByCargo($idscargos, $desde, $hasta,$filtro);

                if ((($tiporeporte == 1 || $tiporeporte == 2) && $columnIndex == 4))
                    $datos = $p;
                else if ($tiporeporte == 4 && $columnIndex == 3) {
                    $datos = $p;
                }
            }
           /* if (count($datos) > 0) {
                $personasordenadas = $this->DatAsistenciaModel->ordenarInfoByCargo($idscargos, $datos);
                $datos = $personasordenadas;
            }*/

            /*$denEntAreasSR = $this->DatAsistenciaModel->GetDenomEntAreas($pers);
            $personcargo = array();
            foreach ($datos as $person) {
                $personcargo[] = $person['idpersona'] . '_' . $person['idcargo'];
            }*/
            //$posDatos = 0;
            //$diff = array_diff($personascargo, $personcargo);

           /* $datosNoRegistro = array();
            $noregistro = array();
            $sinregistro = array();
            foreach ($diff as $i => $p) {
                $percarg = explode('_', $p);
                $noregistro['nombreapellidos'] = $personas[$percarg[0]][$percarg[1]]['nombreapellidos'];
                $noregistro['denomcargo'] = $personas[$percarg[0]][$percarg[1]]['denomcargo'];
                $noregistro['denomarea'] = (is_numeric($personas[$percarg[0]][$percarg[1]]['idarea'])) ?
                    $denEntAreasSR[$personas[$percarg[0]][$percarg[1]]['idarea']]['denominacion'] : 'Sin Cargo';
                $noregistro['denomentidad'] = $denEntAreasSR[$personas[$percarg[0]][$percarg[1]]['identidad']]['denominacion'];
                $noregistro['denominacion'] = '';
                $noregistro['idpersona'] = $personas[$percarg[0]][$percarg[1]]['idpersona'];
                $noregistro['idcargo'] = $personas[$percarg[0]][$percarg[1]]['idcargo'];
                $noregistro['causa'] = 'Sin registro de asistencia';
                $datosNoRegistro[$posDatos++] = $noregistro;
            }
            if (count($datosNoRegistro) > 0) {
                $personasordenadasSR = $this->DatAsistencia->OrderPersonasByCargo($datosNoRegistro, null, 0);
                $datosNoRegistro = $personasordenadasSR;
            }*/
            $resultado = array();
            if (count($datos) > 0) {
                $denEntAreas = $this->DatAsistenciaModel->GetDenomEntAreas($datos);
                foreach ($datos as $key => $persona) {
                        if((empty($persona['fechahoraentrada']) && empty($persona['fechahorasalida']) && empty($persona['idcausa'])) && (($tiporeporte == 1 || $tiporeporte == 2) && $columnIndex != 4)){
                            unset($datos[$key]);
                        }else{
                            $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                            $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denEntAreas[$persona['idarea']]['denominacion'] : 'Sin Cargo';

                            if (!empty($persona['fechahoraentrada']) && empty($persona['idcausa'])) {
                                $datos[$key]['causa'] = 'Sin Causa';
                            } else if (!empty($persona['idcausa']))
                                $datos[$key]['causa'] = $persona['denominacion'] . '[' . $persona['abreviaturacausa'] . ']';

                            if (empty($persona['idcausa']) && empty($persona['fechahoraentrada']) && empty($persona['fechahorasalida'])) {
                                $datos[$key]['causa'] = 'Sin registro de asistencia';
                            }

                            if (!empty($persona['fechahoraentrada'])) {
                                $v = explode(' ', $persona['fechahoraentrada']);
                                $k = explode(':', $v[1]);
                                $datos[$key]['fechahoraentrada'] = (!empty($v[1])) ? $k[0] . ':' . $k[1] : null;
                                if (empty($v[0]))
                                    $datos[$key]['fechaentrada'] = $persona['fecharegistro'];
                                else
                                    $datos[$key]['fechaentrada'] = $v[0];

                                $a = explode(' ', $persona['fechahorasalida']);
                                $j = explode(':', $a[1]);
                                $datos[$key]['fechahorasalida'] = (!empty($a[1])) ? $j[0] . ':' . $j[1] : null;
                                $datos[$key]['fechasalida'] = $a[0];
                            }
                            $resultado[] = $datos[$key];
                        }


                   /* if(!empty($persona['fechahoraentrada']) || (!empty($persona['idcausa']))){
                        $datos[$key]['denomentidad'] = $denEntAreas[$persona['identidad']]['denominacion'];
                        $datos[$key]['denomarea'] = (is_numeric($persona['idarea'])) ? $denEntAreas[$persona['idarea']]['denominacion'] : 'Sin Cargo';

                        if (!empty($persona['fechahoraentrada']) && empty($persona['idcausa'])) {
                            $datos[$key]['causa'] = 'Sin Causa';
                        } else if (!empty($persona['idcausa']))
                            $datos[$key]['causa'] = $persona['denominacion'] . '[' . $persona['abreviaturacausa'] . ']';

                        if (empty($persona['idcausa']) && empty($persona['fechahoraentrada']) && empty($persona['fechahorasalida'])) {
                            $datos[$key]['causa'] = 'Sin registro de asistencia';
                        }

                        if (!empty($persona['fechahoraentrada'])) {
                            $v = explode(' ', $persona['fechahoraentrada']);
                            $k = explode(':', $v[1]);
                            $datos[$key]['fechahoraentrada'] = (!empty($v[1])) ? $k[0] . ':' . $k[1] : null;
                            if (empty($v[0]))
                                $datos[$key]['fechaentrada'] = $persona['fecharegistro'];
                            else
                                $datos[$key]['fechaentrada'] = $v[0];

                            $a = explode(' ', $persona['fechahorasalida']);
                            $j = explode(':', $a[1]);
                            $datos[$key]['fechahorasalida'] = (!empty($a[1])) ? $j[0] . ':' . $j[1] : null;
                            $datos[$key]['fechasalida'] = $a[0];
                        }
                    }else{
                        unset($datos[$key]);
                    }*/
                }
//                foreach ($datos as $key => $persona)
//                    array_push($resultado,$datos);
            } else {
                $datos = array();
                $canttotal = 0;
            }
        } else {
            $datos = array();
            $canttotal = 0;
        }
        $result['datos'] = $resultado;
        $result['sinregistro'] = $datosNoRegistro;
        $result['cantidad'] = count($resultado);
        return $result;
    }

    public function GetDatosExportarestadisticoExcel($arreglo, $tiporeporte)
    {
        $this->objPHPExcel->setActiveSheetIndex(0);
        $this->objPHPExcel->getActiveSheet()->setTitle('Reporte estadístico');

        $this->objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $rencabezado = array('Datos generales', 'Presentes', 'Ausentes');

        if ($tiporeporte == 1) {
            $rcampos = array('Estructura', 'Por plantilla', 'Real', 'Con asistencia', 'Total presentes', 'En la entidad');
            $rdimension = array(40, 15, 10, 15, 15, 15);
        } else if ($tiporeporte == 2) {
            $rcampos = array('Categoría ocupacional', 'Por plantilla', 'Real', 'Con asistencia', 'Total presentes', 'En la entidad');
            $rdimension = array(30, 15, 10, 15, 15, 15);
        } else if ($tiporeporte == 3) {
            $rcampos = array('Fecha', 'Con asistencia', 'Total presentes', 'En la entidad');
            $rdimension = array(15, 15, 15, 15);
        } else if ($tiporeporte == 4) {
            $rcampos = array('Género', 'Real', 'Con asistencia', 'Total presentes', 'En la entidad');
            $rdimension = array(20, 10, 15, 15, 15);
        }
        $dimpresentes = 0;
        $causasP = $arreglo['causasP'];
        foreach ($causasP as $key => $causa) {
            $rcampos[] = $causa['denom'];
            $rdimension[] = 10;
            $dimpresentes += 10;
        }
        $rcampos = array_merge($rcampos, array(
            'Total ausentes'
        ));
        $rdimension = array_merge($rdimension, array(15));
        $dimausentes = 0;
        $causasA = $arreglo['causasA'];
        foreach ($causasA as $key => $causa) {
            $rcampos[] = $causa['denom'];
            $rdimension[] = 10;
            $dimausentes += 10;
        }

        if ($tiporeporte == 1) {
            $rdimencabez = array(80, 30 + $dimpresentes, 15 + $dimausentes);
        } else if ($tiporeporte == 2) {
            $rdimencabez = array(70, 30 + $dimpresentes, 15 + $dimausentes);
        } else if ($tiporeporte == 3) {
            $rdimencabez = array(30, 30 + $dimpresentes, 15 + $dimausentes);
        } else if ($tiporeporte == 4) {
            $rdimencabez = array(45, 30 + $dimpresentes, 15 + $dimausentes);
        }

        $letraactualE = '';
        foreach ($rencabezado as $ind => $campo) {
            $letraactualE = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            //$objPHPExcel->getActiveSheet()->mergeCells($letraactualE. '1:D1');
            $this->objPHPExcel->getActiveSheet()->setCellValue($letraactualE . '1', $campo);
            $this->fnPintarBordes($this->objPHPExcel, $letraactualE . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($this->objPHPExcel, $letraactualE . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($this->objPHPExcel, $letraactualE . '1', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($this->objPHPExcel, $letraactualE . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        foreach ($rdimencabez as $ind => $campo) {
            $rdimencabez = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $this->objPHPExcel->getActiveSheet()->getColumnDimension($rdimencabez)->setWidth($campo);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($this->objPHPExcel, 'A1:' . $letraactualE . '1', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');


        $letraactual = '';
        foreach ($rcampos as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $this->objPHPExcel->getActiveSheet()->setCellValue($letraactual . '2', $campo);
            $this->fnPintarBordes($this->objPHPExcel, $letraactual . '2', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($this->objPHPExcel, $letraactual . '2', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($this->objPHPExcel, $letraactual . '2', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($this->objPHPExcel, $letraactual . '2', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        foreach ($rdimension as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $this->objPHPExcel->getActiveSheet()->getColumnDimension($letraactual)->setWidth($campo);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($this->objPHPExcel, 'A2:' . $letraactual . '2', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');


        foreach ($arreglo['datos'] as $key => $value) {
            $rdatos = array();

            //Arreglo de datos de la persona en cuestion
            if ($tiporeporte == 1 || $tiporeporte == 2) {
                $rdatos = array($value['estructura'], $value['porplantilla'], $value['cubierto'], $value['totalasistencia'],
                    $value['presente'], $value['presentesreal']);
            } else if ($tiporeporte == 4) {
                $rdatos = array($value['estructura'], $value['cubierto'], $value['totalasistencia'],
                    $value['presente'], $value['presentesreal']);
            } else if ($tiporeporte == 3) {
                $rdatos = array($value['estructura'], $value['totalasistencia'],
                    $value['presente'], $value['presentesreal']);
            }

            foreach ($causasP as $ind => $causa) {
                $rdatos[] = ($value[$causa['dataindex']]) ? $value[$causa['dataindex']] : '';
            }
            $rdatos = array_merge($rdatos, array($value['totalfuera']));
            foreach ($causasA as $ind => $causa) {
                $rdatos[] = ($value[$causa['dataindex']]) ? $value[$causa['dataindex']] : '';
            }

            foreach ($rdatos as $ind => $datospersona) {
                $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
                $this->objPHPExcel->getActiveSheet()->setCellValue($letraactual . intval($key + 1 + 2), $datospersona);
                $this->fnPintarBordes($this->objPHPExcel, $letraactual . intval($key + 1 + 2), 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($this->objPHPExcel, $letraactual . intval($key + 1 + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($this->objPHPExcel, $letraactual . intval($key + 1 + 2), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($this->objPHPExcel, $letraactual . intval($key + 1 + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($this->objPHPExcel, $letraactual . intval($key + 1 + 2) . '', 'left', 'center', 0);
            }
        }

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Reporte estadistico.xls" ');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($this->objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $this->objPHPExcel->disconnectWorksheets();
        unset($this->objPHPExcel);
        ini_restore("max_execution_time");
        ini_restore("max_input_time");
        ini_restore("memory_limit");
    }

    public function GetDatosExportarNominalExcel($arreglo)
    {
        $this->objPHPExcel->setActiveSheetIndex(0);
        $this->objPHPExcel->getActiveSheet()->setTitle('Reporte nominal');

        $this->objPHPExcel->getActiveSheet()->getColumnDimension("A")->setWidth(5);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("B")->setWidth(15);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("C")->setWidth(30);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("D")->setWidth(30);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("E")->setWidth(15);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("F")->setWidth(15);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("G")->setWidth(15);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("H")->setWidth(15);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("I")->setWidth(25);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("J")->setWidth(15);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("K")->setWidth(15);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("L")->setWidth(10);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("M")->setWidth(30);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("N")->setWidth(30);
        $this->objPHPExcel->getActiveSheet()->getColumnDimension("O")->setWidth(30);

        $this->objPHPExcel->getActiveSheet()->getStyle('A4')->getProtection()->setLocked(
            PHPExcel_Style_Protection::PROTECTION_PROTECTED
        );

        $rcampos = array('No', 'CI', 'Nombre y apellidos', 'Cargo', 'Fecha entrada', 'Hora entrada', 'Fecha salida', 'Hora salida',
            'Causa', 'Desde', 'Hasta', 'Perdidas', 'Controlado por', 'Modificado por', 'Certificado por');

        $letraactual = '';
        foreach ($rcampos as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $this->objPHPExcel->getActiveSheet()->setCellValue($letraactual . '1', $campo);
            $this->fnPintarBordes($this->objPHPExcel, $letraactual . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($this->objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($this->objPHPExcel, $letraactual . '1', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($this->objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($this->objPHPExcel, 'A1:' . $letraactual . '1', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');

        foreach ($arreglo['datos'] as $key => $datos) {
            $rdatos = array();

            //Arreglo de datos de la persona en cuestion
            $rdatos = array($key + 1, $datos['numid'], $datos['nombreapellidos'], $datos['denomcargo'], $datos['fechaentrada'], $datos['fechahoraentrada'],
                $datos['fechasalida'], $datos['fechahorasalida'], $datos['causa'], $datos['fdesde'], $datos['fhasta'], $datos['hrsdescontadas'],
                $datos['personacontrola'], $datos['personamodifica'], $datos['personacertifica']);

            foreach ($rdatos as $ind => $datospersona) {
                $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
                $this->objPHPExcel->getActiveSheet()->setCellValue($letraactual . intval($key + 2), $datospersona);
                $this->fnPintarBordes($this->objPHPExcel, $letraactual . intval($key + 2), 'top', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($this->objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($this->objPHPExcel, $letraactual . intval($key + 2), 'bottom', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnPintarBordes($this->objPHPExcel, $letraactual . intval($key + 2), 'right', PHPExcel_Style_Border::BORDER_THIN);
                $this->fnAlinearTexto($this->objPHPExcel, $letraactual . intval($key + 2) . '', 'left', 'center', 0);
            }
        }

        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Reporte nominal.xls" ');
        header('Pragma: no-cache');
        header('Expires: 0');
        $objWriter = PHPExcel_IOFactory::createWriter($this->objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $this->objPHPExcel->disconnectWorksheets();
        unset($this->objPHPExcel);
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

    private function existecausa($causa, $arreglocausas)
    {
        $val = false;
        foreach ($arreglocausas as $index => $obj) {
            if ($obj['dataindex'] == $causa['dataindex']) {
                $val = true;
            }
        }
        return $val;
    }

}