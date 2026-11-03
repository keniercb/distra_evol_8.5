<?php

$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dir_www . '/pvd/comun/recursos/fpdf/font');
include_once($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

class AsistenciamensualController extends ZendExt_Controller_Secure
{
    protected $configSesiones;
    private $parte = array();
    private $parte1 = array();

    function init()
    {
        parent::init();
        $habSesiones = new ConfHabilitarsesiones();
        $confSesion = $habSesiones->getHabilitarsesiones();
        $this->configSesiones = $confSesion[0]['habsesion'];
    }

    function asistenciamensualAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->fecha = date('d/m/Y');
        $this->render();
    }

    function getreporteasistenciamensualAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $idestructura = $this->_request->getPost('idestructura');
        $mes = $this->_request->getPost('mes');
        $year = $this->_request->getPost('year');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $temp = $this->_request->getPost('filtro');
        $quincena = $this->_request->getPost('quincena');
        $tiporeporte = $this->_request->getPost('tiporeporte');
        $filtro = (empty($temp)) ? null : $temp;
        $analisis = $this->_request->getPost('analisis');
        $fdesde = $this->_request->getPost('fdesde');
        $fhasta = $this->_request->getPost('fhasta');
        $certificacion = $this->_request->getPost('certificacion');

        $modelAM = new DatAsistenciamensualModel();
        if ($this->configSesiones == 1) {
            $result = $modelAM->GetReporteWithSesions($idestructura, $mes, $year, $limit,
                $start, $filtro, $quincena, $tiporeporte, $analisis, $fdesde, $fhasta, $certificacion);
        } else {
            if ($analisis == 1) {
                $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
                if ($mes < 10)
                    $mes1 = '0' . $mes;
                else
                    $mes1 = $mes;
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes1 . '/' . $year;
            } else {
                $fechdesde = $fdesde;
                $fechhasta = $fhasta;
            }

            /* $datAsistenciamensual = new DatAsistenciamensual();
             $data = $datAsistenciamensual->getAsistMensualByPeriodoAndIdperson($idestructura, $fechdesde, $fechhasta);

             if(!empty($data)){
                 $result = json_decode($data[0]['asistencia'],true);
                 $r['aprobado'] = 1;
             }else{*/
            $result = $modelAM->GetReporte($idestructura, $mes, $year, $limit,
                $start, $filtro, $quincena, $tiporeporte, $analisis, $fechdesde, $fechhasta, $certificacion, 0);
            // }
        }

        $_SESSION['parte'] = $result;

        $domainFT = new ConfFondodetiempo();
        if (count($domainFT->getConfFondodetiempo()) > 0) {
            $r['trtmilitares'] = 1;
        } else {
            $r['trtmilitares'] = 0;
        }

        if ($result['cod'] != 3) {
            $r['datos'] = $result['data'];
            $r['cantidad'] = $result['cant'];
            $r['asist'] = 1;
            $r['columnas'] = $result['columnas'];
            $r['nocturnidad'] = $result['nocturnidad'];
            $r['nocturnidadfer'] = $result['nocturnidadfer'];
            $r['aprobado'] = $result['aprobado'];
        } else {
            $r['datos'] = Array();
            $r['cantidad'] = 0;
            $r['asist'] = 0;
            $r['columnas'] = $result['columnas'];
            $r['nocturnidad'] = $result['nocturnidad'];
            $r['nocturnidadfer'] = $result['nocturnidadfer'];
            $r['aprobado'] = $result['aprobado'];
            $r['cod'] = 3;
        }
        echo(json_encode($r));
    }

    function gethistoricoAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $idestructura = $this->_request->getPost('idestructura');
        $mes = $this->_request->getPost('mes');
        $year = $this->_request->getPost('year');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $temp = $this->_request->getPost('filtro');
        $quincena = $this->_request->getPost('quincena');
        $tiporeporte = $this->_request->getPost('tiporeporte');
        $filtro = (empty($temp)) ? null : $temp;
        $analisis = $this->_request->getPost('analisis');
        $fdesde = $this->_request->getPost('fdesde');
        $fhasta = $this->_request->getPost('fhasta');
        $certificacion = $this->_request->getPost('certificacion');

        $modelAM = new DatAsistenciamensualModel();
        if ($this->configSesiones == 1) {
            $result = $modelAM->GetReporteWithSesions($idestructura, $mes, $year, $limit,
                $start, $filtro, $quincena, $tiporeporte, $analisis, $fdesde, $fhasta, $certificacion);
        } else {
            if ($analisis == 1) {
                $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
                if ($mes < 10)
                    $mes1 = '0' . $mes;
                else
                    $mes1 = $mes;
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes1 . '/' . $year;
            } else {
                $fechdesde = $fdesde;
                $fechhasta = $fhasta;
            }
            $result = $modelAM->GetReporte($idestructura, $mes, $year, $limit,
                $start, $filtro, $quincena, $tiporeporte, $analisis, $fechdesde, $fechhasta, $certificacion, 1);
        }

        $_SESSION['parte'] = $result;

        $domainFT = new ConfFondodetiempo();
        if (count($domainFT->getConfFondodetiempo()) > 0) {
            $r['trtmilitares'] = 1;
        } else {
            $r['trtmilitares'] = 0;
        }

        if ($result['cod'] != 3) {
            $r['datos'] = $result['data'];
            $r['cantidad'] = $result['cant'];
            $r['asist'] = 1;
            $r['columnas'] = $result['columnas'];
            $r['nocturnidad'] = $result['nocturnidad'];
            $r['nocturnidadfer'] = $result['nocturnidadfer'];
            $r['aprobado'] = $result['aprobado'];
        } else {
            $r['datos'] = Array();
            $r['cantidad'] = 0;
            $r['asist'] = 0;
            $r['columnas'] = $result['columnas'];
            $r['nocturnidad'] = $result['nocturnidad'];
            $r['nocturnidadfer'] = $result['nocturnidadfer'];
            $r['aprobado'] = $result['aprobado'];
            $r['cod'] = 3;
        }
        echo(json_encode($r));
    }

    function getapaAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 30);
        $idestructura = $this->_request->getPost('idestructura');
        $mes = $this->_request->getPost('mes');
        $year = $this->_request->getPost('year');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $temp = $this->_request->getPost('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $quincena = $this->_request->getPost('quincena');
        $analisis = $this->_request->getPost('analisis');
        $fdesde = $this->_request->getPost('fdesde');
        $fhasta = $this->_request->getPost('fhasta');

        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;
        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                } elseif ($quincena == 3) {
                    $fechdesde = '01/' . $mes . '/' . $year;
                    $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
            $fechainicio = explode('/', $fechdesde);
            $fechafin = explode('/', $fechhasta);
            $finicio = $fechainicio[0] . '/' . $fechainicio[1] . '/' . $fechainicio[2];
            $ffin = $fechafin[0] . '/' . $fechafin[1] . '/' . $fechafin[2];
        } else {
            $finicio = $fdesde;
            $ffin = $fhasta;
        }
        $modelAM = new DatAsistenciamensualModel();
        if ($this->configSesiones == 1) {
            $result = $modelAM->GetApaWithSesions($idestructura, $finicio, $ffin, $limit, $start, $filtro);
        } else {
            /*$datAsistenciamensual = new DatAsistenciamensual();
            //$data = $datAsistenciamensual->getAsistMensualByPeriodoAndIdestruct($idestructura, $finicio, $ffin);

            if(!empty($data)){
                $result = json_decode($data[0]['apa'],true);
            }else{*/
            $result = $modelAM->GetApa($idestructura, $finicio, $ffin, $limit, $start, $filtro);
            // }
        }//print_r('<pre>');print_r($result);die;
        $_SESSION['parte1'] = $result;
        $modelo = new DatCausasreporteausenciaModel();
        $arreglo = $modelo->getCausasReporteAusencia();
        $domainFT = new ConfFondodetiempo();
        if (count($domainFT->getConfFondodetiempo()) > 0) {
            $r['trtmilitares'] = 1;
        } else {
            $r['trtmilitares'] = 0;
        }
        if ($result['cod'] != 3) {
            $r['datos'] = $result['apa'];
            $r['cantidad'] = $result['cant'];
            $r['causas'] = $result['headerlimpios']['causas'];
            $r['tienecategoria'] = $result['headerlimpios']['tienecategoria'];
            $r['nocturnidad'] = $result['nocturnidad'];
            $r['nocturnidadfer'] = $result['nocturnidadfer'];
        } else {
            $r['datos'] = array();
            $r['cantidad'] = 0;
            $r['causas'] = array();
            $r['tienecategoria'] = array();
            $r['nocturnidad'] = array();
            $r['nocturnidadfer'] = array();
            $r['cod'] = 3;
        }

        echo(json_encode($r));
    }

    function getinfoestadisticaAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $idestructura = $this->_request->getPost('idestructura');
        $mes = $this->_request->getPost('mes');
        $year = $this->_request->getPost('year');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $temp = $this->_request->getPost('filtro');
        $quincena = $this->_request->getPost('quincena');
        $filtro = (empty($temp)) ? null : $temp;
        $idconcepto = $this->_request->getPost('idconcepto');
        $analisis = $this->_request->getPost('analisis');
        $fdesde = $this->_request->getPost('fdesde');
        $fhasta = $this->_request->getPost('fhasta');
        $estr = ZendExt_IoC::getInstance()->metadatos->DameEstructura();
        $modelAM = new DatAsistenciamensualModel();

        $result = $modelAM->GetReporteEstadistico($idestructura, $estr[0]->idtipo, $mes, $year, $limit,
            $start, $filtro, $idconcepto, $quincena, $analisis, $fdesde, $fhasta);
        $r['datos'] = $result;
        $r['cantidad'] = count($result);
        echo(json_encode($r));
    }

    function getIndicadoresValoresAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idreporte = $this->_request->getPost('idreporte');
        $mes = $this->_request->getPost('mes');
        $year = $this->_request->getPost('year');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $temp = $this->_request->getPost('filtro');
        $filtro = (empty($temp)) ? null : $temp;

        $estr = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);

        $person = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array
        ($_SESSION['Zeolides']['perfil']['idpersona']), null, null, null, null, null, null);
        $modelAM = new DatAsistenciamensualModel();
        $result = $modelAM->getIndicadoresValores($idestructura, $idreporte, $mes, $year, $limit,
            $start, $filtro);

        $arr = array();
        if (is_array($result)) {
            foreach ($result as $key => $value) {
                array_push($arr, $value);
            }
            $r['datos'] = $arr;
            $r['cantidad'] = count($arr);
            $r['asist'] = 1;
        } else {
            $r['datos'] = Array();
            $r['cantidad'] = 0;
            $r['asist'] = 0;
        }
        echo(json_encode($r));
    }

    public function getReporteAction()
    {
        try {
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start');
            $query = $this->_getParam('query');
            $objModel = new NomReporteModel();
            if ($query != '') {
                $this->response = $objModel->getReporte($query, $limit, $start);
            } else {
                $this->response = $objModel->getReporte(null, $limit, $start);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
        echo(json_encode($this->response));
    }

    public function reporteasistenciaAction()
    {
        $idestructuras = json_decode(stripslashes($this->_request->getPost('idestructs')));
        $fecha = $this->_request->getPost('date');
    }

    function generarPdfReporteAction()
    {
        $data = $_SESSION['parte'];
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $idestructura = $this->_getParam('idestructura');
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $temp = $this->_getParam('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $idconcepto = $this->_request->getPost('idconcepto');
        $fecha = $this->_request->get('fecha');
        $quincena = $this->_request->get('quincena');
        $tiporeporte = $this->_request->get('tiporeporte');
        $analisis = $this->_request->get('analisis');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $resultado = array();

        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                } else {
                    $fechdesde = '01/' . $mes . '/' . $year;
                    $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }

        $modelAM = new DatAsistenciamensualModel();
        if ($this->configSesiones == 1) {
            $result = $modelAM->GetReporteWithSesions($idestructura, $mes, $year, null,
                0, $filtro, $quincena, $tiporeporte, $analisis, $fdesde, $fhasta, 0);
        } else {
            $result = $modelAM->GetReporte($idestructura, $mes, $year, null, 0, $filtro, $quincena, $tiporeporte, $analisis, $fdesde, $fhasta, 0);
        }
        $array = array();
        foreach ($result['data'] as $key => $value) {
            array_push($array, $value['denomarea']);
        }
        $resultado = array_unique($array);
        $objReportePDF = new ReportepdfAsistenciamensualModel();
        foreach ($result['data'] as $key => $fila) {
            foreach ($fila as $columna => $valor) {
                $result['data'][$key][$columna] = strip_tags($valor);
            }
        }
        foreach ($result['data'] as $key => $fila) {
            foreach ($fila as $columna => $valor) {
                $limpio = strip_tags($valor);
        
                // Eliminar viñetas o puntos al inicio de línea
                $limpio = preg_replace('/^\s*[\.\•\-\*]+\s*/m', '', $limpio);
        
                // Reemplazar puntos entre palabras por espacio (ejemplo: receso.laboral -> receso laboral)
                $limpio = preg_replace('/(?<=\w)\.(?=\w)/', ' ', $limpio);
        
                // Quitar espacios extras al inicio y final
                $limpio = trim($limpio);
        
                $result['data'][$key][$columna] = $limpio;
            }
        }
        
        $objReportePDF->CrearReportePDF($result['data'], $result['columnas'],
        $fechdesde, $fechhasta, $resultado, $tiporeporte, $this->getConfDiasTrabajadosMilitares());
        return true;
    }

    function generarPdfReporteAPAAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $idestructura = $this->_getParam('idestructura');
        $denomestructura = $this->_getParam('denomestructura');
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $temp = $this->_getParam('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $idconcepto = $this->_request->getPost('idconcepto');
        $fecha = $this->_request->get('fecha');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $tipohoja = $this->_request->get('tipohoja');

        if ($this->_request->getPost('causas') == 1) {
            $obj = new NomCausaModel();
            $causas = $obj->GetCausasMultiEncabezado();
            $r['causas'] = $causas[0];
            $r['tienecategoria'] = $causas[1];
        } else
            $r['causas'] = array();

        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }

            $fechainicio = explode('/', $fechdesde);
            $fechafin = explode('/', $fechhasta);
            $finicio = $fechainicio[0] . '/' . $fechainicio[1] . '/' . $fechainicio[2];
            $ffin = $fechafin[0] . '/' . $fechafin[1] . '/' . $fechafin[2];
        } else {
            $finicio = $fdesde;
            $ffin = $fhasta;
        }
        $modelAM = new DatAsistenciamensualModel();
        if ($this->configSesiones == 1) {
            $result = $modelAM->GetApaWithSesions($idestructura, $finicio, $ffin, null, 0, $filtro, $r['tienecategoria'], $idconcepto, $quincena);
        } else {
            $result = $modelAM->GetApa($idestructura, $finicio, $ffin, null, 0, $filtro);
        }
        $array = array();

        foreach ($result['apa'] as $key => $value) {
            array_push($array, $value['denomarea']);
        }
        $resultado = array_unique($array);

        $modelCausa = new NomCausaModel();
        $causas = $modelCausa->GetHojas();

        if ($tipohoja == 4) {
            $obj = new DatpdfAPAModel();
            $var = $obj->construirReporte($result['apa'], $result['headerlimpios']['causas'], $mes, $denomestructura, $fecha, $resultado, $fechdesde, $fechhasta, $this->getConfDiasTrabajadosMilitares());
        } else if ($tipohoja == 0 || $tipohoja == 1 || $tipohoja == 3) {
            $obj = new DatpdfAPAA3Model();
            $var = $obj->construirReporte($result['apa'], $result['headerlimpios']['causas'], $mes, $denomestructura, $fecha, $resultado, $fechdesde, $fechhasta, $this->getConfDiasTrabajadosMilitares(),$tipohoja);
        }
        echo(json_encode('ok'));
    }

    function generarJsonReporteAPAAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $idestructura = $this->_getParam('idestructura');
        $denomestructura = $this->_getParam('denomestructura');
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $temp = $this->_getParam('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $idconcepto = $this->_request->getPost('idconcepto');
        $fecha = $this->_request->get('fecha');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');

        if ($this->_request->getPost('causas') == 1) {
            $obj = new NomCausaModel();
            $causas = $obj->GetCausasMultiEncabezado();
            $r['causas'] = $causas[0];
            $r['tienecategoria'] = $causas[1];
        } else
            $r['causas'] = array();

        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }

            $fechainicio = explode('/', $fechdesde);
            $fechafin = explode('/', $fechhasta);
            $finicio = $fechainicio[0] . '/' . $fechainicio[1] . '/' . $fechainicio[2];
            $ffin = $fechafin[0] . '/' . $fechafin[1] . '/' . $fechafin[2];
        } else {
            $finicio = $fdesde;
            $ffin = $fhasta;
        }
        $modelAM = new DatAsistenciamensualModel();

        $result = $modelAM->GetApa($idestructura, $finicio, $ffin, null, 0, $filtro);

        $json = array();
        $json = json_encode($result['apa']);
        $obj = new DatjsonAPAModel();
        $var = $obj->construirReporte($json);

        echo(json_encode('ok'));
    }

    function generarPdfInfoEstAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $idestructura = $this->_getParam('idestructura');
        $denomestructura = $this->_getParam('denomestructura');
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $temp = $this->_getParam('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $idconcepto = $this->_request->getPost('idconcepto');
        $fecha = $this->_request->get('fecha');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');

        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }

        $modelAM = new DatAsistenciamensualModel();
        $result = $modelAM->GetReporteEstadistico($idestructura, null, $mes, $year, null,
            0, $filtro, $idconcepto, $quincena, $analisis, $fdesde, $fhasta);

        $objReportePDF = new DatpdfInfoEstModel();
        $objReportePDF->construirReporte($result, $mes, $denomestructura, $fecha, $fechdesde, $fechhasta);
        return true;
    }

    function getCausasAction()
    {
        $modelCausa = new NomCausaModel();
        $r = $modelCausa->GetHojas();
        echo Zend_Json::encode(array('datos' => $r));
    }

    function isPeriodoConfiguradoAction()
    {
        $result['datosq'] = DatPeriodoquincena::getPeriodo($this->_request->getPost('anno'));
        $result['datosm'] = DatPeriodomes::getPeriodo($this->_request->getPost('anno'));

        if (count($result['datosq']) > 0)
            echo "1";
        else
            if (count($result['datosm']) > 0)
                echo "2";
            else
                echo "0";
    }

    function certificarAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $idestructura = $this->_request->getPost('idestructura');
        $idpersonas = array();
        $idsasistencia = array();
        $persnocert = array();
        $idpersonas = json_decode(stripslashes($this->_request->getPost('idpersonas')));
        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }

        if (count($idpersonas) > 0) {
            $People = $idpersonas;
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

            foreach ($cargosEstructura as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $datasistencia = new DatAsistencia();
            $PersonCargo = $datasistencia->GetDatosPersonaReporte($cargosPeople, null);

            foreach ($PersonCargo as $i => $per) {
                $People[] = $per['idpersona'];
            }
        }

        $asistencia = new DatAsistencia();
        if (count($People) > 0) {
            if ($this->configSesiones == 1) {
                $asistencia = $asistencia->GetAllByDatesWithSesions($fechdesde, $fechhasta, $People);
            } else {
                $asistencia = $asistencia->GetAllByDates($fechdesde, $fechhasta, $People);
            }
        }

        $bandera = false;
        if (count($asistencia) > 0) {
            foreach ($asistencia as $i => $per) {
                if ($per['certificado'] == 0) {
                    if ($this->configSesiones == 1) {
                        $idsasistencia[] = $per['idasistencia'];
                    } else {
                        if (((!empty($per['fechahoraentrada']) && !empty($per['fechahorasalida']))
                            || (!empty($per['fechahoraentrada']) && !empty($per['fechahorasalida']) && !empty($per['idcausa']))
                            || (empty($per['fechahoraentrada']) && empty($per['fechahorasalida']) && !empty($per['idcausa'])) || $per['feriado'] == 1)/*(!empty($per['fechahoraentrada']) && !empty($per['fechahorasalida'])) || (!empty($per['idcausa']))*/
                        ) {
                            $idsasistencia[] = $per['idasistencia'];
                        } else {
                            $cod = 4;
                            $persnocert[] = $per['nombreapellidos'];

                        }
                    }
                } else {
                    $cod = 3;
                }
            }
        }

        if (count($idsasistencia) > 0/* && $bandera == false*/) {
            $model = new DatAsistenciaModel();
            $result = $model->Certificar($fechdesde, $fechhasta, $idsasistencia, $_SESSION['Zeolides']['perfil']['idpersona']);

//            $modelAM = new DatAsistenciamensualModel();
//            $asistenciamensual = $modelAM->GetReporte($idestructura, $mes, $year, null,
//                0, null, $quincena, null, $analisis, $fdesde, $fhasta, null);
//            $apa = $modelAM->GetApa($idestructura, $fechdesde, $fechhasta, null, 0, null);
//
//            $obj = new DatAsistenciamensual();
//            $obj->fdesde = $fechdesde;
//            $obj->fhasta = $fechhasta;
//            $obj->asistencia = json_encode($asistenciamensual);
//            $obj->apa = json_encode($apa);
//            $obj->save();
        } else {
            $cod = 4;
        }

        if ($result == 1) {
            $r['cod'] = $result;
        } else if ($cod == 3) {
            $r['cod'] = 3;
        } else if ($cod == 4) {
            $r['cod'] = 4;
            //$r['persnocert'] = $persnocert;
        }
        echo(json_encode($r));
    }

    function aprobarasistenciaAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 3000000);
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        $tiporeporte = $this->_request->getPost('tiporeporte');
        $idsasistencia = array();
        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }
        /*$iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

        foreach ($cargosEstructura as $in => $cargoest) {
            $cargosPeople[$in] = $cargoest['idcargo'];
        }
        $datasistencia = new DatAsistencia();
        $PersonCargo = $datasistencia->GetDatosPersonaReporte($cargosPeople, null);

        foreach ($PersonCargo as $i => $per) {
            $People[] = $per['idpersona'];
        }*/
        /* if (count($People) > 0) {
             if ($this->configSesiones == 1) {
                 $asistenciapers = $asistencia->GetAllByDatesWithSesions($fechdesde, $fechhasta, $People);
             } else {
                 $asistenciapers = $asistencia->GetAllByDates($fechdesde, $fechhasta, $People);
             }
         }*/
        /*$noaprobar = 0;
        //$arraynoaprobar = array();
        foreach ($asistenciapers as $i => $per) {
            if ($per['aprobado'] == 0) {
                if ($this->configSesiones == 1) {
                    $idsasistencia[] = $per['idasistencia'];
                } else {
                    if ($per['certificado'] == 1) {
                        $idsasistencia[] = $per['idasistencia'];
                    } else {
                        //array_push($arraynoaprobar, $per['nombreapellidos']);
                        $noaprobar = 1;
                    }
                }
            }
        }
        if (count($idsasistencia) > 0) {
            if ($noaprobar == 0) {
                $model = new DatAsistenciaModel();
                $result = $model->Aprobar($fechdesde, $fechhasta, $idsasistencia, $_SESSION['Zeolides']['perfil']['idpersona']);
            }
        }*/
        //if ($result == 1) {
        /*$modelAM = new DatAsistenciamensualModel();
        $asistenciamensual = $modelAM->GetReporte($idestructura, $mes, $year, null,
            0, $filtro, $quincena, $tiporeporte, $analisis, $fdesde, $fhasta, null);
        $apa = $modelAM->GetApa($idestructura, $fechdesde, $fechhasta, null, 0, $filtro);
        $objasistmens = new DatAsistenciamensual();
        $delete = $objasistmens->deleteAsistMensualByPeriodo($fechdesde, $fechhasta,$idestructura);
        $obj = new DatAsistenciamensual();
        $obj->fdesde = $fechdesde;
        $obj->fhasta = $fechhasta;
        $obj->asistencia = null;//json_encode($asistenciamensual);
        $obj->apa = json_encode($apa);
        $obj->idestructura = $idestructura;
        $obj->save();
        $r['cod'] = 1;*/
        /* } else {
             $r['cod'] = 3;*/
        //$r['noaprobar'] = array_unique($arraynoaprobar);
        // }
        $result = array();
        $modelAM = new DatAsistenciamensualModel();
        $objasistmens = new DatAsistenciamensual();
        /*$asistenciamensual = $modelAM->GetReporte($idestructura, $mes, $year, null,
            0, null, $quincena, $tiporeporte, $analisis, $fechdesde, $fechhasta, null);*/
        $delete = $objasistmens->deleteAsistMensualByPeriodo($idestructura, $fechdesde, $fechhasta);
        $apa = $modelAM->GetApa($idestructura, $fechdesde, $fechhasta, null, 0, null);
        foreach ($apa['apa'] as $k => $v) {
            $result[$v['idpersona'].'-'.$v['idcargo']] = $v;
        }
        $obj = new DatAsistenciamensual();
        $obj->fdesde = $fechdesde;
        $obj->fhasta = $fechhasta;
        $obj->asistencia = null;
        $obj->apa = json_encode($result);
        $obj->idestructura = $idestructura;
        $obj->save();
        $r['cod'] = 1;
        echo(json_encode($r));
    }

    function desaprobarasistenciaAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 3000000);
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }
        $objasistmens = new DatAsistenciamensual();
        $delete = $objasistmens->deleteAsistMensualByPeriodo($idestructura, $fechdesde, $fechhasta);
        $r['cod'] = 1;
        echo(json_encode($r));
    }

    function quitarcertificacionAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $idestructura = $this->_request->getPost('idestructura');
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_request->getPost('idpersonas')));

        if (count($idpersona) > 0) {
            $idpersonas = $idpersona;
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);
            foreach ($cargosEstructura as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $asistencia = new DatAsistencia();
            if (count($cargosPeople) > 0)
                $datos = $asistencia->GetDatosPersonaReporte($cargosPeople);
            foreach ($datos as $i => $per) {
                $idpersonas[] = $per['idpersona'];
            }
        }
        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }

        $model = new DatAsistenciaModel();
        $result = $model->QuitarCertificacion($fechdesde, $fechhasta, $idpersonas, $_SESSION['Zeolides']['perfil']['idpersona']);
        if ($result == 1) {
            $r['cod'] = $result;
        } else {
            $r['cod'] = 3;
        }
        echo(json_encode($r));
    }

    function personasSeleccionasAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_request->getPost('idpersonas')));
        $datAsistencia = new DatAsistencia();
        if (count($idpersona) > 0) {
            $idpersonas = $datAsistencia->getdatospersona($idpersona);
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

            foreach ($cargosEstructura as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $asistencia = new DatAsistencia();
            if (count($cargosPeople) > 0)
                $datos = $asistencia->GetDatosPersonaReporte($cargosPeople);

            foreach ($datos as $i => $per) {
                $idpersonas[$i] = $per['idpersona'];
            }
        }
        $result = count($idpersonas);

        if (count($result) > 0)
            $r['cant'] = $result;
        echo(json_encode($r));
    }

    function enviarCorreoAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $idestructura = $this->_request->getPost('idestructura');
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_request->getPost('idpersonas')));
        $datAsistencia = new DatAsistencia();
        if (count($idpersona) > 0) {
            $idpersonas = $datAsistencia->getdatospersona($idpersona);
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

            foreach ($cargosEstructura as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $asistencia = new DatAsistencia();
            if (count($cargosPeople) > 0)
                $datos = $asistencia->GetDatosPersonaReporte($cargosPeople);

            foreach ($datos as $i => $per) {
                $idpersonas[$i]['idpersona'] = $per['idpersona'];
                $idpersonas[$i]['nombreapellidos'] = $per['nombreapellidos'];
            }
        }
        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }

        $r['cantpers'] = count($idpersonas);
        $asist = new DatAsistenciaModel();
        $correo = $asist->NotificarCorreoAsistencia($fechdesde, $fechhasta, $idpersonas, $mes, $year);
        $result = $asist->enviarCorreo($correo);

        if (count($result['noenviado']) > 0)
            $r['noenviado'] = $result['noenviado'];
        if ($result['cod'] == 1) {
            $r['cod'] = 1;
        } else {
            $r['cod'] = 3;
        }
        echo(json_encode($r));
    }

    function exportarExcelAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $quincena = $this->_request->get('quincena');
        $tiporeporte = $this->_request->get('tiporeporte');
        $analisis = $this->_request->get('analisis');
        $idestructura = $this->_request->get('idestructura');
        $temp = $this->_getParam('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $trt = $this->_request->get('trt');
        $ft = $this->_request->get('ft');
        $hp = $this->_request->get('hp');
        $he = $this->_request->get('he');
        $hf = $this->_request->get('hf');
        $hft = $this->_request->get('hft');
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_request->getPost('idpersonas')));
        $datAsistencia = new DatAsistencia();
        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }

        $asist = new DatAsistenciamensualModel();

        $result = $asist->GetReporte($idestructura, $mes, $year, null,
            0, $filtro, $quincena, $tiporeporte, $analisis, $fdesde, $fhasta, 0);

        //nuevo
        $trtMilitares = $this->getConfDiasTrabajadosMilitares();
        //fin nuevo

        $asistencia = $asist->GetDatosExportarExcel($result, $trtMilitares);
        return true;
    }

    function exportarExcelAPAAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $datos = $_SESSION['parte'];
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $idestructura = $this->_request->get('idestructura');
        $temp = $this->_getParam('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $trt = $this->_request->get('trt');
        $ft = $this->_request->get('ft');
        $hp = $this->_request->get('hp');
        $he = $this->_request->get('he');
        $hf = $this->_request->get('hf');
        $hft = $this->_request->get('hft');
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_request->getPost('idpersonas')));
        $datAsistencia = new DatAsistencia();

        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }
        $asist = new DatAsistenciamensualModel();
        //nuevo
        $trtMilitares = $this->getConfDiasTrabajadosMilitares();
        //fin nuevo
        $asistencia = $asist->GetDatosExportarExcelAPA($idestructura, $fechdesde, $fechhasta, null, 0, $filtro, $trtMilitares);
        return true;
    }

    function generarhojaPdfAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        //$data = $_SESSION['parte'];
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $fdesde = $this->_getParam('fdesde');
        $fhasta = $this->_getParam('fhasta');
        $quincena = $this->_getParam('quincena');
        $analisis = $this->_getParam('analisis');
        $idestructura = $this->_getParam('idestructura');
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_getParam('idpersonas')));
        $datAsistencia = new DatAsistencia();
        if (count($idpersona) > 0) {
            $idpersonas = $idpersona;
        } else {
            $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
            $cargosEstructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, false);

            foreach ($cargosEstructura as $in => $cargoest) {
                $cargosPeople[$in] = $cargoest['idcargo'];
            }
            $asistencia = new DatAsistencia();
            if (count($cargosPeople) > 0)
                $datos = $asistencia->GetDatosPersonaReporte($cargosPeople);

            foreach ($datos as $i => $per) {
                $idpersonas[$i] = $per['idpersona'];
            }
        }

        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;
        $periodo = 0;
        if ($analisis == 1) {

            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                    $periodo = 1;
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                    $periodo = 2;
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
                $periodo = 3;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
            $periodo = 4;
        }

//        $datosgenerales = array();
//        foreach ($data['data'] as $k => $d) {
//            $datosgenerales[$d['idpersona']] = $d;
//        }

        $asistencia = $datAsistencia->GetAllByMonthYearAndArrayPerson($fechdesde, $fechhasta, $idpersonas, $mes, $year, null, $this->configSesiones);
        $person = $datAsistencia->getdatospersona($idpersonas);
        $datAsist = new DatAsistenciaModel();
        $denEntAreas = $datAsist->GetDenomEntAreas($person);
        foreach ($person as $k => $v) {
            $person[$k]['denomentidad'] = (is_numeric($v['identidad'])) ? $denEntAreas[$v['identidad']]['denominacion'] : '';
            $person[$k]['denomarea'] = (is_numeric($v['idarea'])) ? $denEntAreas[$v['idarea']]['denominacion'] : '';
        }
        if ($periodo == 3)
            $period = $this->getMes($mes) . ' / ' . $year;
        elseif ($periodo == 4) {
            $period = $fechdesde . ' - ' . $fechhasta;
        }

        $objReportePDF = new DatpdfgenerarhojaModel();
        $objReportePDF->construirReporte($asistencia, $person, $fechdesde, $fechhasta, $mes, $year, $period, $this->configSesiones/*,$datosgenerales*/);
        return true;
    }

    function restaurarHorasPerdidasAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 9000000);
        $mes = $this->_getParam('mes');
        $year = $this->_getParam('year');
        $fdesde = $this->_request->get('fdesde');
        $fhasta = $this->_request->get('fhasta');
        $quincena = $this->_request->get('quincena');
        $analisis = $this->_request->get('analisis');
        $idestructura = $this->_request->getPost('idestructura');
        $temp = $this->_request->getPost('filtro');
        $filtro = (empty($temp)) ? null : $temp;
        $idpersonas = array();
        $idpersona = json_decode(stripslashes($this->_request->getPost('idpersonas')));
        $model = new DatAsistenciaModel();

        $cantDiasMes = date('t', mktime(0, 0, 0, $mes, 1, $year));
        if ($mes < 10)
            $mes1 = '0' . $mes;
        else
            $mes1 = $mes;

        if ($analisis == 1) {
            $confFechas = new DatPeriodomes();
            $rangoFechas = $confFechas->getPeriodoMes($mes, $year);

            $confFechasQuincena = new DatPeriodoquincena();
            $rangoFechasQuincena = $confFechasQuincena->getPeriodoQuincenal($mes, $year);

            if ($rangoFechas != null) {
                $fechdesde = $rangoFechas[0]['fdesde'];
                $fechhasta = $rangoFechas[0]['fhasta'];
            } elseif ($rangoFechasQuincena != null) {
                if ($quincena == 1) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdeprimquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastaprimquincena'];
                } elseif ($quincena == 2) {
                    $fechdesde = $rangoFechasQuincena[0]['fdesdesegquincena'];
                    $fechhasta = $rangoFechasQuincena[0]['fhastasegquincena'];
                }
            } else {
                $fechdesde = '01/' . $mes . '/' . $year;
                $fechhasta = $cantDiasMes . '/' . $mes . '/' . $year;
            }
        } else {
            $fechdesde = $fdesde;
            $fechhasta = $fhasta;
        }

        $result = $model->RestaurarHorasPerdidas($fechdesde, $fechhasta);
        if ($result == true) {
            $r['cod'] = $result;
        } else {
            $r['cod'] = 3;
        }
        echo(json_encode($r));
    }

    private function getMes($mesnum)
    {
        if ($mesnum == 1) {
            return 'Enero';
        } else if ($mesnum == 2) {
            return 'Febrero';
        } else if ($mesnum == 3) {
            return 'Marzo';
        } else if ($mesnum == 4) {
            return 'Abril';
        } else if ($mesnum == 5) {
            return 'Mayo';
        } else if ($mesnum == 6) {
            return 'Junio';
        } else if ($mesnum == 7) {
            return 'Julio';
        } else if ($mesnum == 8) {
            return 'Agosto';
        } else if ($mesnum == 9) {
            return 'Septiembre';
        } else if ($mesnum == 10) {
            return 'Octubre';
        } else if ($mesnum == 11) {
            return 'Noviembre';
        } else if ($mesnum == 12) {
            return 'Diciembre';
        } else {
            return '';
        }
    }

    public function getConfDiasTrabajadosMilitares()
    {
        $domainFT = new ConfFondodetiempo();
        $trtMilitares = 0;
        if (count($domainFT->getConfFondodetiempo()) > 0) {
            $trtMilitares = 1;
        } else {
            $trtMilitares = 0;
        }
        return $trtMilitares;
    }

    function getlistadoCausasAction()
    {
        $idconcepto = $this->_request->getPost('idconcepto');
        $result = DatAsistenciamensualModel::getlistadoCausas($idconcepto);
        $r['datos'] = $result;
        echo json_encode($r);
    }

    function setConceptoCausasAction()
    {
        $idcausas = json_decode(stripslashes($this->_request->getPost('causas')));
        $idconcepto = $this->_request->getPost('concepto');
        if(!empty($idcausas) && !empty($idconcepto))
            $r = DatAsistenciamensualModel::addConceptocausas($idcausas,$idconcepto);
        echo json_encode(true);
    }

    function modelofondotiempoPdfAction()
    {
        ini_set("max_memory_limit", "1024M");
        ini_set("max_execution_time", 300);
        $trimestre = $this->_getParam('trimestre');
        $denomtrimestre = $this->_getParam('denomtrimestre');
        $year = $this->_getParam('year');
        $idestructura = $this->_getParam('idestructura');
        $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $datostrimestre = $this->getdataFondoTiempo($trimestre,$year,$idestructura,0);
        $datosacumulado = $this->getdataFondoTiempo($trimestre,$year,$idestructura,1);
        $objReportePDF = new DatpdfmodelofondotiempoModel();
        $objReportePDF->CrearReportePDF($datostrimestre,$datosacumulado,$trimestre,$denomtrimestre, $year, $idestructura,$estructura[0]->denominacion);
        return true;
    }

    function getdataFondoTiempo($trimestre,$year,$idestructura,$acumulado){
        if($acumulado == 1){
            if($trimestre == 1){
                $fdesde = '01/01/'.$year;
                $fhasta = '31/03/'.$year;
            }else if($trimestre == 2){
                $fdesde = '01/01/'.$year;
                $fhasta = '30/06/'.$year;
            }else if($trimestre == 3){
                $fdesde = '01/01/'.$year;
                $fhasta = '30/09/'.$year;
            }else if($trimestre == 4){
                $fdesde = '01/01/'.$year;
                $fhasta = '31/12/'.$year;
            }
        }else{
            if($trimestre == 1){
                $fdesde = '01/01/'.$year;
                $fhasta = '31/03/'.$year;
            }else if($trimestre == 2){
                $fdesde = '01/04/'.$year;
                $fhasta = '30/06/'.$year;
            }else if($trimestre == 3){
                $fdesde = '01/07/'.$year;
                $fhasta = '30/09/'.$year;
            }else if($trimestre == 4){
                $fdesde = '01/10/'.$year;
                $fhasta = '31/12/'.$year;
            }
        }

        $idscargos = array();
        $iddominio = $_SESSION['Zeolides']['perfil']['iddominio'];
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, $iddominio, true);
        foreach ($cargos as $cargo){
            array_push($idscargos,$cargo['id']);
        }
        $idspersona = array();
        $grupos = array();
        $objDatos = DatAsistencia::GetDatosPersonaReporte($idscargos, null, null, 0, $fdesde, $fhasta);
        foreach ($objDatos as $p => $dat) {
            if (!empty($dat['idgrupodescanso'])) {
                array_push($idspersona, $dat['idpersona']);
                array_push($grupos, $dat['idgrupodescanso']);
            }
        }

        /*Total de trabajadores según registro*/
        $totaltrab = DatAsistenciamensual::GetTotalTrabajadoresByPeriodo($idscargos, $fdesde, $fhasta);
        $result['totaltrabajadores'] = $totaltrab[0]['cantidad'];

        /*Días laborables del período*/
        $grupopredeterminado = NomGrupodescanso::getGrupoPredeterminado();
        if(!empty($grupopredeterminado[0]['idgrupodescanso'])){
            $diaslab = ConfCalendario::getDiasLaborablesPeriodo($fdesde, $fhasta, $grupopredeterminado[0]['idgrupodescanso']);
            $result['diaslaborables'] = $diaslab[0]['count'];
        }else{
            $result['diaslaborables'] = 0;
        }

        $idscausa = array();
        $causasbyconcept = array();
        $horasdiascausas = array();
        $causas = ConfConceptocausasFT::getCausasByConcepto(array(1,2,3,4,5,6,7,8));
        foreach ($causas as $causa){
            array_push($idscausa,$causa['idcausa']);
            $causasbyconcept[$causa['idconcepto']][] = $causa['idcausa'];
        }
        $cantdiashorascausas = DatAsistenciamensualModel::getdata($objDatos,$idscausa, $idspersona, $grupos, $fdesde, $fhasta, array(3, 1, 13, 8));

        foreach ($causasbyconcept as $j => $causas){
            foreach ($causas as $c){
                $horasdiascausas[$j]['dias'] += $cantdiashorascausas[$c]['dias'];
                $horasdiascausas[$j]['horas'] += $cantdiashorascausas[$c]['horas'];
                //$horasdiascausas[$j]['cant'] += $cantdiashorascausas[$c]['cant'];
            }
        }
        /*Días de vacaciones idconcepto = 1*/
        if(!empty($horasdiascausas[1]['dias'])){
            $result['diasvacaciones'] = $horasdiascausas[1]['dias'];
        }else
            $result['diasvacaciones'] = 0;

        /*Fondo de tiempo máximo utilizable*/
        $result['fondotiempomaxutiliz'] = ($result['totaltrabajadores'] * $result['diaslaborables']) - $result['diasvacaciones'];

        /*Accidentes del trabajo idconcepto = 2*/
        if(!empty($horasdiascausas[2]['dias'])){
            $result['acctrabajo'] = $horasdiascausas[2]['dias'];
        }
        else
            $result['acctrabajo'] = 0;

        /*Enfermedad profesional idconcepto = 3*/
        if(!empty($horasdiascausas[3]['dias'])){
            $result['enfprofesional'] = $horasdiascausas[3]['dias'];
        }else
            $result['enfprofesional'] = 0;

        /*Enfermedad o accidente común idconcepto = 4*/
        if(!empty($horasdiascausas[4]['dias'])){
            $result['enfacccomun'] = $horasdiascausas[4]['dias'];
        }else
            $result['enfacccomun'] = 0;

        /*Por enfermedad*/
        $result['porenfermedad'] = $result['acctrabajo'] + $result['enfprofesional'] + $result['enfacccomun'];

        /*Licencias no retribuidas idconcepto = 5*/
        if(!empty($horasdiascausas[5]['dias'])){
            $result['licnoretribuida'] = $horasdiascausas[5]['dias'];
        }else
            $result['licnoretribuida'] = 0;

        /*Ausencias justificadas idconcepto = 6*/
        if(!empty($horasdiascausas[6]['dias'])){
            $result['ausjustuficada'] = $horasdiascausas[6]['dias'];
        }else
            $result['ausjustuficada'] = 0;

        /*Por autorizaciones administrativas*/
        $result['autadministrativa'] = $result['licnoretribuida'] + $result['ausjustuficada'];

        /*Por ausencia injustificada idconcepto = 7*/
        if(!empty($horasdiascausas[7]['horas'])){
            $result['ausinjustuficada'] = $horasdiascausas[7]['horas'];
        }else
            $result['ausinjustuficada'] = 0;

        /*Total de certificados médicos recibidos idconcepto = 8*/
        if(!empty($horasdiascausas[8]['dias'])){
            $result['certmedico'] = $horasdiascausas[8]['dias'];
        }else
            $result['certmedico'] = 0;

        /*Fondo de tiempo no utilizado por ausentismo*/
        $result['fondotiemponoutilizausent'] = $result['porenfermedad'] + $result['autadministrativa'] + $result['ausinjustuficada'];

        /*% de ausentismo*/
        $result['indiceausentismo'] = $result['fondotiemponoutilizausent']/$result['fondotiempomaxutiliz']*100;
        /*% por enfermedad*/
        $result['indiceporenf'] = $result['porenfermedad']/$result['fondotiempomaxutiliz']*100;
        /*% por autorizaciones administrativas*/
        $result['indiceautadministrativa'] = $result['autadministrativa']/$result['fondotiempomaxutiliz']*100;
        /*% por ausencias injustificadas*/
        $result['indiceausenciainjust'] = $result['ausinjustuficada']/$result['fondotiempomaxutiliz']*100;

        return $result;
    }



}

?>