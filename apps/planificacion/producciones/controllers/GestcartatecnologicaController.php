<?php

$dirWww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirRelMt = "/";
//Direccion absoluta del marco de trabajo
$dirAbsMt = str_replace(
        "//", "/", dirname($dirWww . "..") . "/" . $dirRelMt
);
$config["include_path"] = get_include_path();

$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/config/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/fonts/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/include/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
        . 'apps/planificacion/planmeta/comun/lib/tcpdf/tools/';
set_include_path($config["include_path"]);

class GestcartatecnologicaController extends ZendExt_Controller_Secure {

    public function init() {
        $this->model = new CartaTecnologicaModel();
        $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    public function gestcartatecnologicaAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function cargarUnidaddeMedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function cargarFiltrosEntidadesAction() {
        $idEstructura = $this->pIntegrator->planmeta->obtenerEntidadRectora();
        $result = DatActividadentidad::auxObtenerEntidadesHijasComun($idEstructura[0]['identidad'], true);
        $identidadLog = $this->global->Estructura->idestructura;
        echo json_encode(array('data' => $result, 'identidadLog' => $identidadLog));
    }

    public function cargarVariablesAction() {
        $result = CaracterizacionentidadModel::cargarVariables();
        echo json_encode(array('data' => $result));
    }

    public function cargarAgrupacionesAction() {
        $result = CaracterizacionentidadModel::cargarAgrupaciones();
        echo json_encode(array('data' => $result));
    }

    public function listarNomencladoresTipoCartaAction() {
        $idtipcart = $this->_request->getPost('idtipocarta');
        $dat = DatTipocartatiponomenclador::NomeAsocACarta($idtipcart);
        $total = count($dat);
        echo json_encode(array('data' => $dat, 'total' => $total));
    }

    public function listarNaturalezasAction() {
        $naturaleza = DatBasescalculoModel::obtenerNaturalezas();
        echo json_encode(array('data' => $naturaleza));
    }

    public function listarCentroBalanceAction() {
        $modelActividad = new NomActividadModel();
        echo json_encode($modelActividad->listarCentroBalance($this->integrator));
    }

    public function listarTiposCartasAction() {
        $negocio = 'dat_cartatecnologica';
        $dat->data = $this->pIntegrator->planmeta->obtenerTipoModeloNegocio($negocio);
        echo json_encode($dat);
    }

    //Para obtener columnas dinamicas y pintar grid
    public function obtenerColumnasDinamicasAction() {
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $result = $this->pIntegrator->planmeta->obtenerConfiguracionGridInterfaces($idtipomodelo);
        echo json_encode($result);
    }

    public function listarCartasAction() {
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['global'] = $this->_request->getPost('global');
        $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['integrator'] = $this->integrator;
        if ($params['global'] == 'true') {
            $params['identidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        } else
            $params['identidades'][] = $params['identidad'];
        $obj = $this->pIntegrator->planmeta->obtenerDatosTipoModelo($params['idtipomodelo']);
        $params['idtabla'] = $obj[0]['idtabla'];
        $x = $this->_meta->Metadata()->obtenerInfoTabla($params['idtabla']);
        if ($params['filtros'][0])
            $x = CartaTecnologicaModel::ordenarFiltros($params['filtros'], $x);
        $elementos = CartaTecnologicaModel::listarCartas($params, $x);
        $x = $this->_meta->Metadata()->obtenerInfoTabla($params['idtabla']);
        if ($params['filtros'][0])
            $x = CartaTecnologicaModel::ordenarFiltros($params['filtros'], $x);
        $total = CartaTecnologicaModel::listarTotalCartas($params, $x);
        $codigotm = $obj[0]['codigo'];
        $concat = $codigotm . '_id' . $codigotm;
        $llave = "mod_planificacionmeta_nom_$concat";
        $llaveprimaria = "mod_planificacionmeta_dat_$concat";
        echo json_encode(array('data' => $elementos, 'total' => $total, 'llave' => $llave, 'llaveprimaria' => $llaveprimaria));
    }

    //METODOS PARA REVISAR
    public function listarIndicadoresAction() {
        $parametros->start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros->filtros = $this->_request->getPost('filtros');
        $result = CartaTecnologicaModel::getIndicadores($parametros);
        echo json_encode(array('data' => $result, 'total' => $result[0]['total']));
    }

    public function listarActividadesAction() {
        $params = array();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['identidadCT'] = $this->_request->getPost('identidadCT');
        $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidadCT']);
        $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
        $data = CartatecnologicaModel::listarActividades($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function listarNormasAction() {
        $params = array();
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idejercicio'] = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $params['idejercicio'] = $params['idejercicio']['idejercicio'];
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = $this->pIntegrator->planmeta->ObtenerNormasSegunActividad($params);
        echo json_encode($data);
    }

    public function gestDependeciaAction() {
        $paramas = array();
        $paramas['actPadres'] = json_decode($this->_request->getPost('actPadres'));
        $paramas['actChildren'] = json_decode($this->_request->getPost('actChildren'));
        $paramas['idEntidad'] = ($this->_request->getPost('idEntidad'));
        $data = CartatecnologicaModel::setDependencia($paramas);
    }

    public function listarActividadesCTAction() {
        $params = array();
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = CartatecnologicaModel::listarActividadesCT($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function listarActividadesCTDependenciaAction() {
        $params = array();
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['actPadres'] = json_decode(stripslashes($this->_request->getPost('actPadres')));
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = CartatecnologicaModel::listarActividadesCTDependencia($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    /* Cargar todos los planes */

    public function cargarPlanesAction() {
        $data->data = DatEntidadmodelo::getModelosTodos();
        $data->data [] = array('idmodelo' => '-', 'denominacion' => '-');
        echo json_encode($data);
    }

    /* Cargar los modelos por entidad */

    public function cargarPlanesEntidadAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $data->data = DatEntidadmodelo::servBP_getModeloAsocEntidad($params['identidad'], 1);
        echo json_encode($data);
    }

    /* Gestionar carta tecnológica */

    public function adicionarCartaAction() {
        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        $params['identidadcrea'] = $this->_request->getPost('identidadcrea');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idindicador'] = $this->_request->getPost('idindicador');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['rendimiento'] = $this->_request->getPost('cartarendimiento');
        $params['idumedidarendimiento'] = $this->_request->getPost('idumedidarendimiento');
        $params['idvariable'] = $this->_request->getPost('idvariable');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $params['idtipomodelo'] = $this->_request->getPost('idtipomodelo');
        $ejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $params['idejercicioactual'] = $ejercicioactual['idejercicio'];
        $params['integrator'] = $this->integrator;
        $params['tipomodelo'] = $this->pIntegrator->planmeta->obtenerDatosTipoModelo($params['idtipomodelo']);
        $params['metafields'] = [];
        $params['accion'] = $this->_request->getPost('accion');
        foreach ($_POST as $key => $value) {
            if (strpos($key, 'mod_') === 0) {
                $params['metafields'][$key] = $value;
            }
        }
        $mensaje = null;
        $codMsg = "3";
        $codMsg = CartaTecnologicaModel::buscardenominacion($params);
        if ($codMsg == 24) {
            if ($params['accion'] == 'adicionar') {
                $mensaje = 'Add';
                $codMsg = CartatecnologicaModel:: adicionarCartaTec($params);
            } elseif ($params['accion'] == 'duplicar' && $params['idcartatecnologica'] != null) {
                $mensaje = 'Dup';
                $codMsg = CartatecnologicaModel::duplicarCartaTec($params);
            } elseif ($params['accion'] == 'modificar' && $params['idcartatecnologica'] != null) {
                $mensaje = 'Mod';
                $codMsg = CartatecnologicaModel:: modificarCartaTec($params);
            }
            echo json_encode(array('codMsg' => $codMsg, 'mensaje' => $mensaje));
        } else {
            echo json_encode(array('codMsg' => $codMsg, 'mensaje' => "La denimación de la carta ya existe."));
        }
    }

    public function eliminarCartaAction() {
        $result = null;
        $cartastecnologicas = json_decode(stripslashes($this->_request->getPost('cartas')));
        $variables = json_decode(stripslashes($this->_request->getPost('variables')));
        $idusuario = $this->global->Perfil->idusuario;

        if ($cartastecnologicas [0] != null) {
            $result = CartatecnologicaModel::eliminarCartasTecnologicas($cartastecnologicas, $variables, $idusuario);
        }
        if ($result == 1) {
            echo json_encode(array('codMsg' => 24));
        } else {
            echo json_encode(array('mensaje' => $result));
        }
    }

    /* Gestionar actividad carta tecnológica */

    public function adicionarActACartaAction() {
        $params['idactividades'] = json_decode(stripslashes($this->_request->getPost('idactividades')));
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $res = DatCartatecnologicaactividadModel::adicionarCartaActividad($params);
        echo json_encode(array('codMsg' => $res));
    }

    public function modificarActACartaAction() {
        $params['valores'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        echo json_encode(array('codMsg' => DatCartatecnologicaactividadModel::modificarCartaActividad($params)));
    }

    public function eliminarActACartaAction() {
        $arrayIdscartaactividad = json_decode(stripslashes($this->_request->getPost('idscartaactividad')));
        if ($arrayIdscartaactividad [0] != null) {
            $res = DatCartatecnologicaactividadModel::eliminarVariasCartaActividad($arrayIdscartaactividad);
        }
        echo json_encode(array('codMsg' => $res));
    }

    public function duplicarActACartaAction() {
        $params['cartatecnologicaactividad'] = json_decode(stripslashes($this->_request->getPost('cartatecnologicaactividad')));
        $params['plazos'] = json_decode(stripslashes($this->_request->getPost('dias')));
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        if ($params['cartatecnologicaactividad'][0] != null) {
            $res = DatCartatecnologicaactividadModel::duplicarVariasActividadEnCartaTec($params);
        }
        echo json_encode(array('codMsg' => $res));
    }

    public function aprobarCartaTecnologicaAction() {
        $params['cartas'] = json_decode(stripslashes($this->_request->getPost('cartas')));
        $params['idaprobacion'] = $this->_request->getPost('idaprobacion');
        $params['integrator'] = $this->integrator;
        $res = CartatecnologicaModel::aprobarCartaTecnologica($params);
        if ($res == 0)
            echo json_encode(array('codMsg' => 23));
        else
            echo json_encode(array('codMsg' => 24));
    }

    public function activarCartaTecnologicaAction() {
        $params['cartas'] = json_decode(stripslashes($this->_request->getPost('cartas')));
        $params['activar'] = $this->_request->getPost('activar');
        $res = CartatecnologicaModel::activarCartaTecnologica($params);
        echo json_encode($res);
    }

    public function generarFichaAction() {
        $params['formato'] = $_GET['formato'];
        $params['idcartatecnologica'] = $_GET['idcartatecnologica'];
        $global = ZendExt_GlobalConcept::getInstance();
        $datosEntidad = $this->integrator->metadatos->DameEstructura($global->Estructura->idestructura);
        $params['denoentidad'] = $datosEntidad [0]->denominacion;
        $params['codigoentidad'] = $datosEntidad [0]->codigo;
        $params['integrator'] = $this->integrator;
        CartatecnologicaModel::generarFicha($params);
    }

    public function permisoParaOperacionesCTAction() {
        $cartas = json_decode(stripslashes($this->_request->getPost('cartas')));
        $model = new CartatecnologicaModel();
        echo json_encode($model->validarAprobacionCT($cartas));
    }

    public function listarEtapasAction() {
        $data = CartatecnologicaModel::listarEtapas();
        echo json_encode(array('data' => $data));
    }

    public function cargaInicialAction() {
        $identidadLogueada = $this->global->Estructura->idestructura;
        $idusuario = $this->global->Perfil->idusuario;
        echo json_encode(array('identidadLog' => $identidadLogueada, 'idusuario' => $idusuario));
    }

    //fin del revisar

    public function definirDiaCeroAction() {
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idcartatecnologicaactividad'] = $this->_request->getPost('idcartatecnologicaactividad');
        $objCartaTecModel = new CartatecnologicaModel();
        $data = $objCartaTecModel->setDiaCero($params);
        echo json_encode(array('codMsg' => 'ok'));
    }

    public function cargarVariablesAddCartaAction() {
        $params->identidad = $this->_request->getPost('identidad');
        $result = CaracterizacionentidadModel::cargarVariables($params);
        echo json_encode(array('data' => $result));
    }

    public function exportarAction() {
        $params['tipo'] = $this->_request->getParam('tipo');
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idtipomodelo'] = $this->_request->getParam('idtipomodelo');
        $params['denominaciontipomodelo'] = $this->_request->getParam('denominaciontipomodelo');
        $params['global'] = $this->_request->getParam('global');
        $params['integrator'] = $this->integrator;
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        $params['entidad'] = $this->_request->getParam('entidad');
        $ejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $params['idejercicio'] = $ejercicioactual['idejercicio'];
        $params['denoejercicio'] = $ejercicioactual['ejercicio'];
        if ($params['global'] == 'true') {
            $params['identidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidad']);
        } else {
            $params['identidades'][] = $params['identidad'];
        }
        $obj = $this->pIntegrator->planmeta->obtenerDatosTipoModelo($params['idtipomodelo']);
        $cmd = $this->pIntegrator->planmeta->obtenerConfiguracionGridInterfaces($params['idtipomodelo']);
        $params['idtabla'] = $obj[0]['idtabla'];
        $x = $this->_meta->Metadata()->obtenerInfoTabla($params['idtabla']);
        $obj2 = new CartaTecnologicaModel();
        $obj2->exportar($params, $x, $cmd);
    }

    public function exportarCartaConActividadesOIndicadoresAction() {
        $params['identidad'] = $this->_request->getParam('identidad');
        $params['entidad'] = $this->_request->getParam('entidad');
        $params['denominaciontipomodelo'] = $this->_request->getParam('denominaciontipomodelo');
        $params['cartatecnologica'] = json_decode($this->_request->getParam('cartatecnologica'));
        $params['tipo'] = $this->_request->getParam('tipo');
        $ejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $params['idejercicio'] = $ejercicioactual['idejercicio'];
        $params['denoejercicio'] = $ejercicioactual['ejercicio'];
        $params['idtipomodelo'] = $this->_request->getParam('idtipomodelo');
        $cmd = $this->pIntegrator->planmeta->obtenerConfiguracionGridInterfaces($params['idtipomodelo']);
        $obj = new CartaTecnologicaModel();
        $obj->exportarCartaConActividadesOIndicadores($params, $cmd);
    }

    public function exportarFichaCostoAction() {
        $params['idcartatecnologica'] = $this->_request->getParam('idcarta');
        $params['iddatosautorficha'] = $this->_request->getParam('iddatosautorficha');
        $ejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $params['idejercicio'] = $ejercicioactual['idejercicio'];
        $params['identidad'] = $this->_request->getParam('identidad');
        $datosEntidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
        $params['denomentidad'] = $datosEntidad [0]->denominacion;
        $params['exportarfichapdf'] = $this->_request->getParam('exportarfichapdf');
        $obj = new CartatecnologicaModel();
        $obj->exportarFichaCosto($params);
    }

    public function listarautorfichaAction() {
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        $autorFicha = DatFichacostoModel::listarautorficha($params);
        echo json_encode(array('data' => $autorFicha, 'total' => $autorFicha[0]['total']));
    }

    public function obtenerDatosNomencladorUriAction() {
        $uriNomenclador = $_GET['urinom'];
        $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom($uriNomenclador);
        unset($array_ests_dnom[0]);
        $array_ests_dnom = array_values($array_ests_dnom);
        echo json_encode(array('data' => $array_ests_dnom));
    }

    //Importar fichero
    function importarFicheroAction() {
        //creando el arreglo de las columnas fijas
        $columnas = array();
        $columnas[0][0] = "Código de la actividad";
        $columnas[0][1] = 0;

        $columnas[1][0] = "Denominación";
        $columnas[1][1] = 0;

        $columnas[2][0] = "Plazo inicio";
        $columnas[2][1] = 0;

        $columnas[3][0] = "Duración en minutos";
        $columnas[3][1] = 0;

        $columnas[4][0] = "Etapa";
        $columnas[4][1] = 0;

        $columnas[5][0] = "Por ciento";
        $columnas[5][1] = 0;

        $columnas[6][0] = "Día cero";
        $columnas[6][1] = 0;



        //leyendo el excel
        $filename = $_FILES['file']['tmp_name'];
        $file = $filename;
        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($file);
        $dat = $data->sheets[0]['cells'];

        //obteniendo las columnas del excel
        $columnasExcel = array();
        foreach ($dat[0] as $k => $col) {
            $columnasExcel[$k][0] = $col;
            $columnasExcel[$k][1] = $k;
        }

        //convirtiendo el arreglo de datos en un text
        $datos = serialize($dat);

        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //eliminando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importaractividadcartaxls" . $idusuario);

        //creando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importaractividadcartaxls" . $idusuario . " (xls TEXT) WITH (OIDS = FALSE)");

        //almacenando los datos en la BD para usarlos en la próxima petición         
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importaractividadcartaxls" . $idusuario . "(xls) VALUES ('" . $datos . "')");

        echo json_encode(
                array('columnas' => $columnas, 'columnasExcel' => $columnasExcel)
        );
    }

    //validar datos a importar
    function importarDatosRelacionadosAction() {

        //obteniendo los parametros
        $relaciones = json_decode(stripslashes($this->_request->getPost('relaciones')));
        $idcartatecnologica = $this->_request->getPost('idcartatecnologica');

        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //eliminando tabla temporal dinámica
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importaractividadcarta" . $idusuario);

        //obteniendo los datos del excel guardados en BD en la petición anterior(importarfichero)    
        $query = "SELECT  xls FROM  mod_planifimportacion.temp_importaractividadcartaxls" . $idusuario;
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $datos = unserialize($result[0]);

        //preparando datos para crear tabla dinamica
        //en esta variable se guarda, de las columnas,
        //la posicion de su columna correspondiente en el excel
        $posiciones = array();

        foreach ($relaciones as $rel) {
            if ($rel->denominacionOS == "Código de la actividad") {
                $posiciones['codigo'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Denominación") {
                $posiciones['denominacion'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Plazo inicio") {
                $posiciones['plazo'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Duración en minutos") {
                $posiciones['duracion'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Etapa") {
                $posiciones['etapa'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Por ciento") {
                $posiciones['porciento'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Día cero") {
                $posiciones['diacero'] = $rel->posicioncolumnaExcel;
                continue;
            }
        }
        //creando tabla temporal dinamica  
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importaractividadcarta" . $idusuario . " (
          idtabla SERIAL,
          codigo VARCHAR(255) NOT NULL,
          plazo NUMERIC(19,0) NOT NULL,          
          duracion NUMERIC(19,2) NOT NULL,          
          etapa VARCHAR(255) NOT NULL,          
          diacero NUMERIC(19,0) NOT NULL,
          porciento NUMERIC(19,2) NOT NULL,
          iddatosnomenclador NUMERIC(19,0))");

        foreach ($datos as $j => $row) {

            //ignorando los datos del encabezado de la tabla
            if ($j == 0) {
                continue;
            }
            //dando valor a la codigo si viene vacio
            if ($row[$posiciones['codigo']]) {
                $codigo = utf8_encode($row[$posiciones['codigo']]);
            } else {
                $codigo = "-";
            }
            //dando valor al plazo si viene vacio
            $plazo = 0;
            if ($row[$posiciones['plazo']]) {
                $n = self::validarNumeric($row[$posiciones['plazo']]);
                if ($n != 'no')
                    $plazo = $n;
            }
            //dando valor al duracion si viene vacio
            $duracion = 0;
            if ($row[$posiciones['duracion']]) {
                $n = self::validarNumericPositivo($row[$posiciones['duracion']]);
                if ($n != 'no')
                    $duracion = $n;
            }
            //dando valor a la etapa si viene vacio
            if ($row[$posiciones['etapa']]) {
                $etapa = utf8_encode($row[$posiciones['etapa']]);
            } else {
                $etapa = "-";
            }
            //dando valor al diacero si viene vacio
            if ($row[$posiciones['diacero']]) {
                $diacero = utf8_encode($row[$posiciones['diacero']]);
                if ($diacero == "Si" || $diacero == "Sí" || $diacero == "sí" || $diacero == "si")
                    $diacero = 1;
                else
                    $diacero = 0;
            } else {
                $diacero = 0;
            }
            //dando valor a porciento si viene vacio
            $porciento = 0;
            if ($row[$posiciones['porciento']]) {
                $porciento = utf8_encode($row[$posiciones['porciento']]);
            } else {
                $porciento = 0;
            }

            //insertando los datos en la tabla temporal
            $conn->execute("INSERT INTO mod_planifimportacion.temp_importaractividadcarta" . $idusuario . "
                        (
                        codigo,          
                        plazo,          
                        duracion,          
                        etapa,        
                        diacero,
                        porciento)
                        VALUES (
                              '$codigo',
                              $plazo,
                              $duracion,
                              '$etapa',
                              '$diacero',
                              '$porciento'    
                        )");
        }

        self::validarDatosImportados($idusuario, $identidad);
        echo json_encode(array('campos' => 1));
    }

    //Validar datos importados
    private function validarDatosImportados($idusuario, $identidad) {
        //Buscando los datosnomenclador para los mensajes de validación 
        $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
        foreach ($array_ests_dnom as $k => $dn) {
            unset($array_ests_dnom[$k]);
            $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
        }

        $formato = NomActividad::obtener_ConfFormato_UltimoNivel();
        $idformato = $formato[0];
        $ultimoNivel = $formato[1];

        $conn = Doctrine_Manager::connection();
        $query = "SELECT e.idtabla,
                        e.codigo,
                        act.idactividad,
                        act.nivel,
                        e.etapa,
                        e.porciento,
                        COALESCE(ndn.iddatosnomenclador, '1162') AS idetapa,
                        e.iddatosnomenclador
                 FROM mod_planifimportacion.temp_importaractividadcarta" . $idusuario . " e
                      LEFT JOIN mod_planificacion.nom_actividad act ON (e.codigo = act.codigo)
                      LEFT JOIN mod_planificacion.nom_datosnomenclador ndn ON (ndn.denominacion = e.etapa AND ndn.idtiponomenclador = 239)";
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($result as $key => $value) {
            //No existe formato para las actividad
            if ($idformato == null) {
                self::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['noexisteformatoactividades']);
                continue;
            }
            if ($value['idactividad'] == null) {
                self::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['codigoactvacio']);
                continue;
            }
            if ($value['nivel'] != $ultimoNivel) {
                self::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['actividadnoesultimonivel']);
                continue;
            }
            //Validado correctamente
            self::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['ok']);
        }
    }

    //Actualizar los datos validados
    private function actualizarValidacion($idusuario, $idtabla, $iddatosnomenclador) {
        $conn2 = Doctrine_Manager::connection();
        $query = "UPDATE 
                    mod_planifimportacion.temp_importaractividadcarta" . $idusuario . " 
                  SET 
                    iddatosnomenclador = $iddatosnomenclador 
                  WHERE 
                    idtabla = $idtabla;";
        $conn2->execute($query);
    }

    //listar datos validados a importar
    function listarDatosValidadosAction() {
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;
        $start = ($this->_request->getPost('start') != null) ? $this->_request->getParam('start') : 0;
        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getParam('limit') : 20;
        $filtros = $this->_request->getPost('filtros');
        $addWhere = "where true";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " and e.codigo like '%" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion') {
                    $addWhere .= " and upper(e." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else
                if ($datos['field'] == 'plazo' || $datos['field'] == 'duracion' || $datos['field'] == 'porciento') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $addWhere .= " and e." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                } else
                if ($datos['field'] == 'etapa') {
                    $addWhere .= " and upper(e." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else
                if ($datos['field'] == 'diacero') {
                    if ($datos['data']['value'] == 'Sí') {
                        $valor = 1;
                    } else {
                        $valor = 0;
                    }
                    $addWhere .= " and e." . $datos['field'] . " =" . $valor;
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT e.idtabla,
                        e.codigo,
                        act.denominacion,
                        e.plazo,
                        e.duracion,
                        e.etapa,
                        e.diacero,
                        e.porciento,
                        ndn.denominacion as denominaciondato,
                        count(*) over () as total
                 FROM mod_planifimportacion.temp_importaractividadcarta" . $idusuario . " e
                    LEFT JOIN mod_planificacion.nom_actividad act ON (e.codigo = act.codigo)
                    LEFT JOIN mod_planificacion.nom_datosnomenclador ndn ON (
       ndn.iddatosnomenclador = e.iddatosnomenclador)
                      $addWhere 
                ORDER BY e.plazo OFFSET $start LIMIT $limit";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    //inserta todos los datos validados correctamente
    function insertarDatosImportarAction() {
        ini_set("max_execution_time", 60000);
        //obteniendo los parametros
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //adicionamos las actividades en la carta
        $conn = Doctrine_Manager::connection();
        $query = "INSERT INTO
                    mod_spouam.dat_cartatecnologicaactividad
                  (
                    idcartatecnologica,
                    idactividad,
                    plazo,
                    duracion,
                    idetapa,
                    diacero,
                    idusuario,
                    porciento
                  )
                  (
                   SELECT {$params['idcartatecnologica']} as idcartatecnologica,
                            act.idactividad,
                            e.plazo,
                            e.duracion,
                            COALESCE(ndn.iddatosnomenclador, '1162') as idetapa,
                            e.diacero,
                            " . $idusuario . ",
                            e.porciento
                     FROM mod_planifimportacion.temp_importaractividadcarta" . $idusuario . " e
                          LEFT JOIN mod_planificacion.nom_actividad act ON (e.codigo = act.codigo)
                          LEFT JOIN mod_planificacion.nom_datosnomenclador ndn ON (ndn.denominacion =
                            e.etapa AND ndn.idtiponomenclador = 239)
                     WHERE e.iddatosnomenclador = 312
                     ORDER BY e.plazo
                  );";
        $data = $conn->execute($query);

        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importaractividadcartaxls" . $idusuario);
        //eliminando tabla temporal dinámica
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importaractividadcarta" . $idusuario);

        echo json_encode(array('codMsgN' => 1));
    }

    public static function modificarCaracteresEspeciales($url) {
        $url = strtolower($url);
        //Reemplazamos caracteres especiales latinos 
        $find = array('á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'î', 'ô', 'û', 'ü', 'ã', 'õ', 'ç', 'ñ');
        $repl = array('a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u', 'u', 'a', 'o', 'c', 'n');
        $url = str_replace($find, $repl, $url);
        //Añadimos los guiones 
        $find = array(' ', '&amp;', '\r\n', '\n', '+');
        $url = str_replace($find, '_', $url);
        //Eliminamos y Reemplazamos los demas caracteres especiales 
        $find = array('/[^a-z0-9\-&lt;&gt;]/', '/[\-]+/', '/&lt;{^&gt;*&gt;/');
        $repl = array('', '-', '');
        $url = preg_replace($find, $repl, $url);
        return $url;
    }

    private function validarNumericPositivo($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor) && $valor >= 0) {
            return $valor;
        }
        return 'no';
    }

    private function validarNumeric($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor)) {
            return $valor;
        }
        return 'no';
    }

    //En adelante las acciones para asociar equipos
    public function listarEquiposCartaAction() {
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');

        $modelcarta = new CartaTecnologicaModel();
        $data = $modelcarta->listarEquiposAsocACarta($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function TotalesDepACartaAction() {
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');

        $modelcarta = new CartaTecnologicaModel();
        $data = $modelcarta->TotalesDepACarta($params);
        echo json_encode(array('data' => $data));
    }

    //listarEquipos
    public function listarEquiposAction() {
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');

        $modelcarta = new CartaTecnologicaModel();
        $data = $modelcarta->listarEquipos($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function asociarEqACartaAction() {
        $params['equipos'] = json_decode(stripslashes($this->_request->getPost('equipos')));
        $params['idcartatecnologica'] = $this->_request->getPost('idcartatecnologica');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $res = CartaTecnologicaModel::asociarEqACarta($params);
        echo json_encode(array('codMsg' => $res));
    }

    public function eliminarEquipoAsocAction() {
        $params['equipos'] = json_decode(stripslashes($this->_request->getPost('equipos')));
        $res = CartaTecnologicaModel::eliminarEquipoAsoc($params);
        echo json_encode(array('codMsg' => $res));
    }

}
