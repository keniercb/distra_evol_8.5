<?php
    $dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
    //PDF
    require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
    //Excel
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
    include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class PagodestajoController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function pagodestajoAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }   

    public function obtenerMesesAction()
    {
        echo json_encode(array('datos' => NomMes::obteneTodosNomMes(), 'cantidad' => count(NomMes::obteneTodosNomMes())));
    }
    
    public function obtenerListadoConveniosAction() 
    {
        $idplantilla = $this->_getParam('idplantilla');
        $tipobusqueda = $this->_getParam('tipobusqueda');
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $limite = $this->_getParam('limite');
        $inicio = $this->_getParam('inicio');
        $periodo = $this->_getParam('periodo');
        $identidad = $this->global->Estructura->idestructura; 
        //Creando el modelo de negocio de gestion de tipos de destajo.
        $objConvenio = new DatConveniosModel();

        if ($tipobusqueda == 1) {
            //Obteniendo el listado de tipos de destajo.
            $result = $objConvenio->obtenerListadoConvenios($inicio = 0, $limite = 0, $idplantilla);
            $sumasal = DatPersonaBrigadaModel::obtenerSalarioCalculado($idplantilla);
            $monto = DatConveniosModel::obtenerMontoTotalBrigada($idplantilla);

            $coeficiente = $monto / $sumasal;

            //Imprimiendo el listado de tipos de destajo.
            echo Zend_Json::encode(array('datos' => $result, 'cantidad' => count($result), 'monto' => $monto, 'coeficiente' => $coeficiente));
        } elseif ($tipobusqueda == 2){
            $result = HisConvenios::obtenerListadoConveniosHistorico($inicio = 0, $limite = 0, $idplantilla, $idnomtipodestajo, $identidad, $periodo);

            $variables = HisConvenios::obtenerVariablesPeriodoHis($idplantilla, $idnomtipodestajo, $identidad, $periodo);//print_r($variables);die;
            $montobrigada = $variables[0]['montobrigada'];
            $coeficiente = $variables[0]['coeficiente'];
            $salariocalculado = $variables[0]['salariocalculado'];

            echo Zend_Json::encode(array('datos' => $result, 'cantidad' => count($result), 'montobrigada' => $montobrigada, 'coeficiente' => $coeficiente, 'salariocalculado' => $salariocalculado));
        }

    }     
    
    public function obtenerListadoDestajoAction() 
    {
        //Creando el modelo de negocio de gestion de tipos de destajo.
        $objTipoDestajo = new NomTipoDestajoModel();
        //Obteniendo el listado de tipos de destajo.
        $result = $objTipoDestajo->obtenerListadoDestajo($inicio = 0, $limite = 10);

        //Imprimiendo el listado de tipos de destajo.
        echo Zend_Json::encode(array('datos' => $result, 'cantidad' => count($result)));
    }     
    
    public function obtenerListadoPersonasBrigadaAction() 
    {
        $idplantilla = $this->_getParam('idplantilla');
        $limite = $this->_getParam('limite');
        $inicio = $this->_getParam('inicio');
        $tipobusqueda = $this->_getParam('tipobusqueda');
        $periodo = $this->_getParam('periodo');
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $identidad = $this->global->Estructura->idestructura; 

        if ($tipobusqueda == 1) {
            $obtDatPersBrig = new DatPersonaBrigadaModel();
            $result = $obtDatPersBrig->obtenerListadoPersonasBrigada($inicio = 0, $limite = 10, $idplantilla, $identidad);
            $sumasal = DatPersonaBrigadaModel::obtenerSalarioCalculado($idplantilla);

            echo Zend_Json::encode(array('datos' => $result, 'cantidad' => count($result), 'salariocalculado' => $sumasal));

        } elseif ($tipobusqueda == 2) {
            $result = DatPersonaBrigadaModel::obtenerListadoPersonasBrigadaHistorico($inicio = 0, $limite = 10, $idplantilla, $identidad, $periodo, $idnomtipodestajo);

            echo Zend_Json::encode(array('datos' => $result, 'cantidad' => count($result), 'salariocalculado' => $sumasal));
        }
            
    }    
    
    public function adicionarPersonasByBrigadaAction() 
    {
        $arrayidpersonas = Zend_Json::decode(stripslashes($this->_getParam('arrayidpersonas')));
        $idplantilla = $this->_getParam('idplantilla');
        $identidad = $this->global->Estructura->idestructura; 

        $respuesta = new stdClass();

        if ($idplantilla) {
            $respuesta = DatPersonaBrigadaModel::adicionarPersonasByBrigada($arrayidpersonas, $idplantilla, $identidad);  

        } else{
            $respuesta->codigo = 2;
        }
        echo Zend_Json::encode($respuesta);        
    }      
    
    public function eliminarPersonasByBrigadaAction()
    {
        $arrayidpersonabrigada = Zend_Json::decode(stripslashes($this->_getParam('arrayidpersonabrigada')));

        $respuesta = new stdClass();

        $respuesta = DatPersonaBrigadaModel::eliminarPersonasByBrigada($arrayidpersonabrigada); 

        echo Zend_Json::encode($respuesta);        
    }    
    
    public function adicionarConvenioByObraAction() 
    {
        $denominacion = $this->_getParam('denominacion');
        $obra = $this->_getParam('obra');
        $importe = $this->_getParam('importe');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $descripcion = $this->_getParam('descripcion');
        $idplantilla = $this->_getParam('idplantilla');
        $identidad = $this->global->Estructura->idestructura; 
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $fechainicioperiodo = $this->_getParam('fechainicioperiodo');
        $fechafinperiodo = $this->_getParam('fechafinperiodo');//print_r($denominacion);die;

        $result = DatConveniosModel::adicionarConvenioByObra($denominacion, $obra, $importe, $fechainicio, $fechafin, $descripcion, $idplantilla, $identidad, $idnomtipodestajo, $fechainicioperiodo, $fechafinperiodo);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($result == 1){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3'}";
        }
    }    
    
    public function modificarConvenioByObraAction() 
    {
        $idconvenio = $this->_getParam('idconvenio');
        $denominacion = $this->_getParam('denominacion');
        $obra = $this->_getParam('obra');
        $importe = $this->_getParam('importe');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $descripcion = $this->_getParam('descripcion');

        $result = DatConveniosModel::modificarConvenioByObra($idconvenio, $denominacion, $obra, $importe, $fechainicio, $fechafin, $descripcion);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($result == 1){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3'}";
        }
    }    
    
    public function eliminarConvenioAction() 
    {
        $idconvenio = $this->_getParam('idconvenio');

        $result = DatConveniosModel::eliminarConvenio($idconvenio);

        //Devolviendo una notificación de que todo ocurrió correctamente.
        if($result == 1){
            echo "{'codigo':'1'}";
        }else{
            echo "{'codigo':'3'}";
        }
    }    
    
    public function obtenerListadoPlantillaNominalAction() 
    {
        $idestructura = $this->_request->getPost('idestructura');

        $arrayplantilla = DatConveniosModel::obtenerListadoPlantillaNominal($idestructura);

        echo Zend_Json::encode(array('datos' => $arrayplantilla, 'cantidad' => count($arrayplantilla)));
    }    
    
    public function imprimierReporteListadoPersonasAction() 
    {
        $identidad = $this->_getParam('identidad');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $tipobusqueda = $this->_getParam('tipobusqueda');
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $formato = $this->_getParam('formato');
        $periodo = $this->_getParam('periodo');
        $obj = new ReporteExportarPDFPagoDestajoModel();

        $nombreentidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad)[0]->denominacion;

        if ($tipobusqueda == 1) {
            $datosper = DatPagoDestajo::validarPeriodoDestajo($fechainicio, $fechafin, $idnomtipodestajo, $identidad);  
            $datosper = unserialize($datosper[0]['datos']);       
        } elseif ($tipobusqueda == 2) {
            $datosper = DatPersonaBrigadaModel::obtenerListadoPersonasBrigadaHistorico($inicio = 0, $limite = 10000, null, $identidad, $periodo, $idnomtipodestajo);
        }


        $plantillas = array_map(function($item) {
            return $item['denominacion'];
        }, $datosper);

        $plantillas = array_unique($plantillas);

        $datos = array();
        $cont = 0;
        foreach ($datosper as $i => $value) {
            $datos[$cont]['idpersona'] = $value['idpersona'];
            $datos[$cont]['idpersonabrigada'] = $value['idpersonabrigada'];  
            $datos[$cont]['idplantillanominal'] = $value['idplantillanominal'];  
            $datos[$cont]['idgrupoescala'] = $value['idgrupoescala'];  
            $datos[$cont]['grupoescala'] = DatPersonaBrigada::denomGrupoEscala($value['idgrupoescala']) ? DatPersonaBrigada::denomGrupoEscala($value['idgrupoescala']) : '-';
            $datos[$cont]['importe'] = $value['importe'];
            $datos[$cont]['trt'] = $value['trt'];
            $datos[$cont]['ft'] = $value['ft'];
            $datos[$cont]['evaluacion'] = $value['evaluacion'];
            $datos[$cont]['salarioeval'] = $value['salarioeval'];
            $datos[$cont]['salariotrt'] = $value['salariotrt'];
            $datos[$cont]['montocobrar'] = $value['montocobrar'];
            $datos[$cont]['identidad'] = $value['identidad'];
            $datos[$cont]['denominacion'] = $value['denominacion'];
            $datos[$cont]['numid'] = $value['numid'];
            $datos[$cont]['denominacion'] = $value['denominacion'];
            $datos[$cont]['nombre'] = $value['nombre'];
            $datos[$cont]['snombre'] = $value['snombre'];
            $datos[$cont]['papel'] = $value['papel'];
            $datos[$cont]['sapel'] = $value['sapel'];       
            $datos[$cont]['ordenunico'] = $value['ordenunico'];            
            $datos[$cont]['idcargo'] = $value['idcargo'];            
            $datos[$cont]['orden'] = $value['orden'];            
            $cont++;                          
        } 

        if ($formato == 1) {
            $obj->construirReporte($identidad, $dfFInicio, $dfFFin, $idnomtipodestajo, $datos);
        } elseif ($formato == 2) {
            $obj->construirReporteExcel($identidad, $dfFInicio, $dfFFin, $idnomtipodestajo, $datos, $plantillas);
        }
    }  
    
    public function imprimierReporteListadoConveniosAction() 
    {
        $identidad = $this->_getParam('identidad');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $tipobusqueda = $this->_getParam('tipobusqueda');
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $formato = $this->_getParam('formato');
        $periodo = $this->_getParam('periodo');
        $obj = new ReporteExportarPDFPagoDestajoModel();print_r($formato);die;

        $nombreentidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($identidad)[0]->denominacion;

        if ($tipobusqueda == 1) {
            $datos = DatConvenios::obtenerListadoConveniosPeriodo($idnomtipodestajo, $fechainicio, $fechafin);            
        } elseif ($tipobusqueda == 2) {
            $datos = HisConvenios::obtenerListadoConveniosPeriodoHistorico($idnomtipodestajo, $periodo);
        }

        $plantillas = array_map(function($item) {
            return $item['brigada'];
        }, $datos);
        
        $plantillas = array_unique($plantillas);

        if ($formato == 1) {
            $obj->construirReporteConenios($identidad, $dfFInicio, $dfFFin, $idnomtipodestajo, $datos);
        } elseif ($formato == 2) {
            $obj->construirReporteConeniosExcel($identidad, $dfFInicio, $dfFFin, $idnomtipodestajo, $datos, $plantillas);
        }
    }      
    
    public function syncronisarElementosAsosiadosalCargoAction() 
    {
        $idplantilla = $this->_getParam('idplantilla');
        $identidad = $this->_getParam('identidad');
        $finicio = $this->_getParam('finicio');
        $ffin = $this->_getParam('ffin');
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');

        if ($finicio == null || $ffin == null) {
            echo "{'codigo':'4'}";
        } else{

            $respuesta = new stdClass();

            if ($idplantilla) {
                $respuesta = DatPersonaBrigadaModel::syncronisarElementosAsosiadosalCargo($idplantilla, $finicio, $ffin, $idconfreportescertificaciones, $identidad);  

            }else if($finicio == null){
                echo "{'codigo':'3'}";
            } else{
                $respuesta->codigo = 2;
            }
            
            if($respuesta->codigo == 1){
                echo "{'codigo':'1'}";
            }else if($respuesta->codigo == 2){
                echo "{'codigo':'2'}";
            }   
        }     
    }   
    
    public function calcularSalariosAction() 
    {
        $idplantilla = $this->_getParam('idplantilla');
        $identidad = $this->_getParam('identidad');
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');

        $respuesta = DatPersonaBrigadaModel::calcularSalarios($idplantilla, $identidad);  

        echo "{'codigo':'1'}"; 
    }  
    
    public function guardarEvaluacionAction() 
    {
        $idplantilla = $this->_getParam('idplantilla');
        $arraydatos = json_decode(stripslashes($this->_request->getPost('arraydatos')));

        if (count($arraydatos) > 0) {
            $respuesta = DatPersonaBrigadaModel::guardarEvaluacion($idplantilla, $arraydatos);  
    
            echo "{'codigo':'1'}"; 
        } else {
            echo "{'codigo':'2'}"; 
        }
        

    }
    
    public function guardarDatosAction() 
    {
        $idplantilla = $this->_getParam('idplantilla');
        $coeficiente = $this->_getParam('coeficiente');
        $montobrigada = $this->_getParam('montobrigada');
        $salariocalculado = $this->_getParam('salariocalculado');
        $identidad = $this->global->Estructura->idestructura; 

        if ($idplantilla != null) {        
            $respuesta = DatPersonaBrigadaModel::guardarMontoCobrar($idplantilla, $coeficiente, $identidad);
            DatVariablesPagoDestajoTemporal::guardarVariablesTablaTemporal($identidad, $coeficiente, $montobrigada, $salariocalculado, $idplantilla);
        }else {
            $respuesta->codigo = 2;
        }
         
        echo json_encode($respuesta);
    }
    
    public function obtenerListadoConfPagoDestajoAction() 
    {
        $identidad = $this->_getParam('identidad');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        if ($identidad == null) {
            $identidad = $this->global->Estructura->idestructura;   
        }

        $r = ConfPagoDestajoModel::obtenerListadoConfPagoDestajo($identidad, $start = 0, $limit = 10);
        $ioc = ZendExt_IoC_Inter::getInstance();
        foreach ($r as &$item) {
            if ($item['idformula'] != -1) {
                $datosformula = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($item['idformula']));
                $item['denomformula'] = $datosformula[0]['expresionamostrar'];
            } else
                $item['denomformula'] = '';
        }
        
        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));

    }

    public function obtenerIndicadoresConfiguracionAction()
    {
        $objConfigEstructurarModelosNomina = new ConfigEstructurarModelosNomina();
        $objConfPagoDestajo = new ConfPagoDestajo();
        $identidad = $this->_request->getPost('identidad');
        $arrInd = array();
        $arrCamposEstructuraModeloNomina = $objConfigEstructurarModelosNomina->obtenerCamposXEntidad($identidad);
        foreach ($arrCamposEstructuraModeloNomina as $k => $v) {
            $arrInd[] = array(
                'idindicador' => 'CEMN_' . $v['idestructuramodelodomina'],
                'indicador' => $v['denominacion'],
                'tipo' => $v['denomtiponomina'],
                'orden' => 0,
                'aplicarorden' => 0);
        }

        $arrCamposAgrupados = $objConfPagoDestajo->obtenerListadoConfPagoDestajo($identidad, $start = 0, $limit = 10);
        foreach ($arrCamposAgrupadosReporteCorreo as $k => $v) {
            $arrInd[] = array(
                'idindicador' => 'A_' . $v['idconfpagodestajo'],
                'indicador' => $v['denominacion'],
                'tipo' => 'Agrupadores pago destajo',
                'orden' => $v['orden'],
                'aplicarorden' => 1);
        }
        echo Zend_Json::encode(array('indicadores' => $arrInd));
    }

    //Fórmulas Reporte
    public function obtenerIndicadoresFormulasAction()
    {
        $idconfreportescertificaciones = $this->_request->getPost('idconfreportescertificaciones');
        $arrVariablesReportes = ConfReportesCertificacionesModel::obtenerTodosTiposReportesCertificacionesConVariables();
        //Arreglo de los indicadores.
        foreach ($arrVariablesReportes as $k => $v) {
            if($idconfreportescertificaciones != $v['idconfreportescertificaciones']){
                $arrR[] = array(
                    //Id de la variable del reporte
                    'idindicador' => 'F_' . $v['idvariablesconfreportescertificaciones'],
                    //Denominacion de la variable del reporte
                    'indicador' => $v['denominacionvariable'],
                    //Denominacion de cada uno de los reportes por donde se van a a grupar las variables
                    'tipo' => $v['denominacion'],
                    //'orden' => $v['orden']
                );
            }
        }
        echo Zend_Json::encode(array('variables' => $arrR));
    }

    public function obtenerOrdenDisponiblePagoDestajoAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $objModel = new ConfPagoDestajo();
        $r = $objModel->fnObtenerOrdenDisponible($identidad);
        echo Zend_Json::encode($r);
    }

    public function adicionarCamposConfiguracionAction()
    {
        $obj = new ConfPagoDestajo();
        $params = array(
            'identidad' => $this->_request->getPost('identidad'),
            'denominacion' => $this->_request->getPost('denominacion'),
            'orden' => $this->_request->getPost('orden'),
            'tipoentrada' => $this->_request->getPost('tipoentrada'),
            'entrada' => $this->_request->getPost('entrada'),
            'idformula' => $this->_request->getPost('idformula'),
            'descripcion' => $this->_request->getPost('descripcion')
        );

        $respuesta = $obj->fnAdicionarConfCamposConfiguracion($params);
        $r = '';
        if (!empty($respuesta)) {
            $r = 'ADD-' . $respuesta;
        }
        echo json_encode(array('respuesta' => $r));
    }

    public function modificarCamposConfiguracionAction()
    {
        $obj = new ConfPagoDestajo();
        $params = array(
            'idconfpagodestajo' => $this->_request->getPost('idconfpagodestajo'),
            'identidad' => $this->_request->getPost('identidad'),
            'denominacion' => $this->_request->getPost('denominacion'),
            'orden' => $this->_request->getPost('orden'),
            'tipoentrada' => $this->_request->getPost('tipoentrada'),
            'entrada' => $this->_request->getPost('entrada'),
            'idformula' => $this->_request->getPost('idformula'),
            'descripcion' => $this->_request->getPost('descripcion')
        );
        $respuesta = $obj->fnModificarCamposConfiguracion($params);
        $r = '';
        if (!empty($respuesta)) {
            $r = 'MOD-' . $respuesta;
        }
        echo json_encode(array('respuesta' => $r));
    }

    public function eliminandoCamposConfiguracionAction()
    {
        $idconfpagodestajo = $this->_request->getPost('idconfpagodestajo');
        $identidad = $this->global->Estructura->idestructura;
        $objModel = new ConfPagoDestajoModel();        
        $objModel = new ConfPagoDestajo();

        $r = $objModel->eliminandoCamposConfiguracion($idconfpagodestajo);

        $orden = $objModel->fnObtenerOrdenDisponible($identidad);
        echo Zend_Json::encode(array('succes' => $r, 'orden' => count($orden['orden'])));
    }

    public function obtenerListadoEntradaAction()
    {
        $tipoentrada = $this->_request->getPost('tipoentrada');
        $limite = $this->_request->getPost('limit');
        $inicio = $this->_request->getPost('start');

        if ($tipoentrada == 'Reportes') {
            $r = ConfPagoDestajoModel::obtenerDenominacionReporte($limite, $inicio);
        } elseif ($tipoentrada == 'Tipo de pagos') {
            $r = ConfPagoDestajoModel::obtenerDenominacionTipoPago($limite, $inicio);
        }

        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerListadoObraEntidadAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $limite = $this->_request->getPost('limit');
        $inicio = $this->_request->getPost('start');

        $r = ConfPagoDestajoModel::obtenerListadoObraEntidad($identidad, $limite, $inicio);        

        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obteneridconfreportescertificacionesAction(){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT idconfreportescertificaciones FROM mod_nomina.conf_tiporeportescertificaciones where denominacion ilike '%destajo%';";
        $r = $conn->fetchAll($sql);

        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));

    }

    public function obtenervariablesconfiguracionesreportescertificacionesAction()
    {
        $idconfreportescertificaciones = $this->_getParam('idconfreportescertificaciones');
        $objVRC = new ConfVariablesReportesCertificaciones();
        $r = $objVRC->obtenerListadoVariablesReportesCertificaciones($idconfreportescertificaciones, 0, 10000);
        $ioc = ZendExt_IoC_Inter::getInstance();
        foreach ($r as $v => $variable) {
            if (!empty($variable['calculable']) && !empty($variable['idexpresionmatematica'])) {
                $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($variable['idexpresionmatematica']));
                $r[$v]['textoexpresionmatematica'] = $rf[0]['expresionamostrar'];
            } else {
                $r[$v]['idexpresionmatematica'] =  -1;
                $r[$v]['textoexpresionmatematica'] =  '';
            }

            if (!empty($variable['calculablehistoriconominasreportes']) && !empty($variable['idexpresionmatematicahistoriconominasreportes'])) {
                $rf = $ioc->comun->BuscarTodosporarrIdExpresionMatematica(array($variable['idexpresionmatematicahistoriconominasreportes']));
                $r[$v]['textoexpresionmatematicahistoriconominasreportes'] = $rf[0]['expresionamostrar'];
            } else {
                $r[$v]['idexpresionmatematicahistoriconominasreportes'] =  -1;
                $r[$v]['textoexpresionmatematicahistoriconominasreportes'] =  '';
            }
            $denomvariable = ConfVariablesReportesCertificaciones::obtenerDenomVariablexIdVariable($r[$v]['idvariablesconfreportescertificacionesreportesanteriores']);
            $denomtiporeporte = ConfVariablesReportesCertificaciones::obtenerSoloDenomReporteXIdVarConfReportesCert($r[$v]['idvariablesconfreportescertificacionesreportesanteriores']);
            $r[$v]['denomvariablereporteanterior'] = ($r[$v]['idvariablesconfreportescertificacionesreportesanteriores'])
                                                     ?$denomvariable . ' - ' . $denomtiporeporte
                                                     :'';

            $denomvariablemesinicial = ConfVariablesReportesCertificaciones::obtenerDenomVariablexIdVariable($r[$v]['idvariablesconfreportescertiicacionesmesinicial']);
            $denomtiporeportemesinicial = ConfVariablesReportesCertificaciones::obtenerSoloDenomReporteXIdVarConfReportesCert($r[$v]['idvariablesconfreportescertiicacionesmesinicial']);
            $r[$v]['denomvariablemesinicial'] = ($r[$v]['idvariablesconfreportescertiicacionesmesinicial'])
                ?$denomvariablemesinicial . ' - ' . $denomtiporeportemesinicial
                :'';
        }
        echo json_encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function obtenerPeriodosPagoDestajoAction(){   
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        
        $r = DatPagoDestajoModel::obtenerPeriodosPagoDestajo($idnomtipodestajo);

        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));

    }

    public function aprobarPeriodoDestajoAction(){   

        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $identidad = $this->_getParam('identidad'); 
        if ($fechainicio == '' || $fechafin == '') {
            $r = 'error';
        } else {
            $r = DatPagoDestajoModel::aprobarPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad);
            //DatVariablesPagoDestajo::guardarDatosVariables($idnomtipodestajo, $fechainicio, $fechafin, $identidad);
        }        

        echo json_encode(array('respuesta' => $r));
    }

    public function desaprobarPeriodoDestajoAction()
    { 
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $identidad = $this->_getParam('identidad');
        if ($fechainicio == '' || $fechafin == '') {
            $r = 'error';
        } else {
            $r = DatPagoDestajoModel::desaprobarPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad);
        }        

        echo json_encode(array('respuesta' => $r));
    }

    public function cerrarResumenPeriodoDestajoAction()
    { 
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $identidad = $this->_getParam('identidad');
        if ($fechainicio == '' || $fechafin == '') {
            $r = 'error';
        } else {
            $estado = DatPagoDestajo::obtenerEstadoPagoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad);
            if ($estado == 1) {
                $r = DatPagoDestajoModel::cerrarResumenPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad);
            }else{
                $r = 'noaprobado';
            }
        }        

        echo json_encode(array('respuesta' => $r));
    }

    public function buscarEstadoReporteAction()
    { 
        $idnomtipodestajo = $this->_getParam('idnomtipodestajo');
        $fechainicio = $this->_getParam('fechainicio');
        $fechafin = $this->_getParam('fechafin');
        $identidad = $this->_getParam('identidad');
        if ($fechainicio == '' || $fechafin == '') {
            $r = 'error';
        } else {
            $r = DatPagoDestajo::obtenerEstadoPagoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad);
        }        

        echo json_encode(array('respuesta' => $r));
    }

    
}
