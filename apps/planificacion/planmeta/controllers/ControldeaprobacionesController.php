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

class ControldeAprobacionesController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function controldeaprobacionesAction() {
        try {
            //$this->view->jsreportes = $this->pIntegrator->reportes->devolverJS();
            $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
            $this->view->jsestructura = $jsestructura;
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
        $this->render();
    }

    public function AdicionarDocumentoManualAction() {
        $arraydatosdoc = json_decode(
                stripslashes($this->_request->getPost('arraydatosdoc'))
        );
        $indicadores = json_decode(
                stripslashes($this->_request->getPost('arrayindicadores'))
        );
        $origen = $this->_request->getParam('origen');

        $idoperacion = $this->_request->getParam('idoperacion');
        $identidad = ($this->_request->getParam('identidad')) ? $this->_request->getParam('identidad') : 900000257;
        $idtipoaprobacion = $this->_request->getParam('idtipoaprobacion');
        $tipoaprobacion = $this->_request->getParam('nombreaprobacion');
        $idusuario = $this->global->Perfil->idusuario;

        $idejercicio = $this->_request->getParam('idejercicio');
        $ejercicio = $this->_request->getParam('denomejercicio');
        //$arrayEnti[] = $identidad;
        // $integrator = ZendExt_IoC::getInstance();

        $datosentidad = $this->integrator->metadatos->DameEstructura(
                $identidad
        );

        $numerodoc = "'" . $datosentidad[0]->codigo . '.' . $tipoaprobacion . '.'
                . substr($ejercicio, -2) . "'";


        $objDoc = new DatDocumentoaprobacioModel();
        $resultado = $objDoc->Adicionardocumentomanual(
                $arraydatosdoc, $origen, $idoperacion, $identidad, $idtipoaprobacion, $idusuario, $idejercicio, $numerodoc, null, $indicadores
        );
        if (is_numeric($resultado)) {
            $resultado = 1;
        }
        echo json_encode($resultado);
    }

    public function AdicionarDocumentoAutomaticoAction() {
        $origen = $this->_request->getParam('origen');
        $idoperacion = $this->_request->getParam('idoperacion');
        $identidad = ($this->_request->getParam('identidad')) ? $this->_request->getParam('identidad') : 900000257;
        $idtipoaprobacion = $this->_request->getParam('idtipoaprobacion');
        //$idedemandantes=Aqui va lo que retorna el metodo que me dice las entidades asociadas a cada concepto
        $tipoaprobacion = $this->_request->getParam('nombreaprobacion');
        $idusuario = $this->global->Perfil->idusuario;
        $idejercicio = $this->_request->getParam('idejercicio');
        $ejercicio = $this->_request->getParam('denomejercicio');
        $arrayEnti[] = $identidad;
        // $integrator = ZendExt_IoC::getInstance();
        $datosentidad = $this->integrator->metadatos->DameEstructura(
                $identidad
        );


        $numerodoc = "'" . $datosentidad[0]->codigo . '.' . $tipoaprobacion . '.'
                . substr($ejercicio, -2) . "'";


        $objDoc = new DatDocumentoaprobacioModel();
        $result = $objDoc->AdicionarDocAutomatico(
                $version, $origen, $idoperacion, $identidad, $idtipoaprobacion, $idusuario, $idejercicio, $numerodoc, true, $doc, $tipoaprobacion
        );
        echo json_encode($result);
    }

    public function DuplicarDocumentoAction() {
        $iddocumento = $this->_request->getParam('iddocumentoaprobacion');
        $accion = $this->_request->getParam('accion');
        $paraduplicar = Doctrine_Core::getTable('DatDocumentoaprobacion')->find(
                $iddocumento
        );
        $numero = str_getcsv($paraduplicar->numeroaprobacion, '.');
        $numerodoc = $numero[0] . '.' . $numero[1] . '.' . $numero[2];
        $objDoc = new DatDocumentoaprobacioModel();
        $arraydatosdoc = DatDocumentoaprobacion::obtenerDatosdelDocumento(
                        $iddocumento
        );
        foreach ($arraydatosdoc as $value) {
            $miarray[] = array("idcontroldivisa" => $value['idcontroldivisa'],
                "importe" => $value['importe'],
                "idvia" => $value['idvia'],
                "idconceptoplan" => $value['idvia']);
        }
        $arraydatosdoc = (object) $miarray;

        $result = $objDoc->Adicionardocumentomanual(
                $arraydatosdoc, 1, $iddocumento, $paraduplicar->idoperacion, $paraduplicar->identidad, $paraduplicar->idtipoaprobacion, $paraduplicar->idusuario, $paraduplicar->idejercicio, $numerodoc, (isset($accion)) ? $paraduplicar->version : $paraduplicar->version + 1
        );
        $vista = DatDocumentoaprobacioModel::verDocumentoManual(
                        $result, $start, $limit, $parametros
        );
        if (count($vista) != 0) {
            $vista['resultado'][0]['usuario'] = $this->integrator->seguridad->nombreUsuario(
                    $vista['resultado'][0]['idusuario']
            );
            $integrator = ZendExt_IoC::getInstance();
            $datosentidad = $integrator->metadatos->DameEstructura($vista['resultado'][0]['identidad']);
            $vista['resultado'][0]['entidad'] = $datosentidad[0]->denominacion;
        }
        echo json_encode(
                array('data' => $vista['resultado'], 'total' => $vista['total'],
                    'iddocumento' => $result)
        );
    }

    public function ActualizarDocumentoAction() {
        $iddocumento = $this->_request->getParam('iddocumento');
        $idaprobacion = $this->_request->getParam('idaprobacion');
        $idEstructura = ($this->_request->getParam('identidad')) ? $this->_request->getParam('identidad') : 900000257;
        $objDoc = new DatDocumentoaprobacioModel();
        if ($idaprobacion == 1) {
            $paraeliminar = Doctrine::getTable(
                            'DatControldivisadocumentoaprobacion'
                    )->findByDql(
                    "iddocumentoaprobacion=$iddocumento"
            );
            if ($paraeliminar[0]->idcontroldivisadocumentoaprobacion != null) {
                foreach ($paraeliminar as $value) {
                    $value->delete();
                }
                $paramodificar = Doctrine_Core::getTable(
                                'DatDocumentoaprobacion'
                        )->find($iddocumento);
                if (isset($paramodificar)) {
                    $tipoaprobacion = explode('.', $paramodificar->numeroaprobacion);
                    $tipoaprobacion = $tipoaprobacion[1];
                    $result = $objDoc->AdicionarDocAutomatico(
                            $paramodificar->version + 1, $paramodificar->esmanual, $paramodificar->idoperacion, $idEstructura, $paramodificar->idtipoaprobacion, $paramodificar->idusuario, $paramodificar->idejercicio, $paramodificar->numeroaprobacion, false, $iddocumento, $tipoaprobacion
                    );
                }
            }
        } else {
            $paramodificar = Doctrine_Core::getTable('DatDocumentoaprobacion')
                    ->find($iddocumento);
            if (isset($paramodificar)) {
                $tipoaprobacion = explode('.', $paramodificar->numeroaprobacion);
                $tipoaprobacion = $tipoaprobacion[1];
                $result = $objDoc->AdicionarDocAutomatico(
                        $paramodificar->version + 1, $paramodificar->esmanual, $paramodificar->idoperacion, $idEstructura, $paramodificar->idtipoaprobacion, $paramodificar->idusuario, $paramodificar->idejercicio, $paramodificar->numeroaprobacion, true, $iddoc, $tipoaprobacion
                );
            }
        }
        echo json_encode($result);
    }

    public function ModificarDocumentoAction() {
        $iddocumento = $this->_request->getParam('iddocumento');
        $arraydatosdoc = json_decode(
                stripslashes($this->_request->getPost('arraydatosdoc'))
        );
        $idoperacion = $this->_request->getParam('idoperacion');
        $idtipoaprobacion = $this->_request->getParam('idtipoaprobacion');
        $tipoaprobacion = $this->_request->getParam('nombreaprobacion');
        $identidad = ($this->_request->getParam('identidad')) ? $this->_request->getParam('identidad') : 900000257;
        $objDoc = new DatDocumentoaprobacioModel();

        $paramodificar = Doctrine_Core::getTable('DatDocumentoaprobacion')->find($iddocumento);

        if ($paramodificar->esmanual == 0) {

            $modificado = $objDoc->Modificadocumentomanual(
                    $arraydatosdoc, 1, $iddocumento, $idoperacion, $identidad, $idtipoaprobacion, $paramodificar->idusuario, $paramodificar->idejercicio, $paramodificar->numeroaprobacion, $paramodificar->version + 1
            );

            $documentomodificado = (is_numeric($modificado)) ? 1 : 3;
        } else {
            $paraeliminar = Doctrine::getTable(
                            'DatControldivisadocumentoaprobacion'
                    )->findByDql(
                    "iddocumentoaprobacion=$iddocumento"
            );

            if ($paraeliminar[0]->idcontroldivisadocumentoaprobacion != null) {
                foreach ($paraeliminar as $value) {
                    $value->delete();
                }
            }
            if (isset($paramodificar)) {
                if (isset($idoperacion)) {
                    $paramodificar->idoperacion = 0;
                }

                if (isset($idtipoaprobacion)) {
                    $paramodificar->idtipoaprobacion = $idtipoaprobacion;
                }
                $paramodificar->esmanual = 1;
                if (isset($tipoaprobacion)) {
                    $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
                    $ejercicio = $idejercicio[0]['ejercicio'];
                    $idejercicio = $idejercicio[0]['idejercicio'];
                    $integrator = ZendExt_IoC::getInstance();
                    $datosentidad = $integrator->metadatos->DameEstructura($identidad);
                    $numerodoc = $datosentidad[0]->codigo . '.'
                            . $tipoaprobacion . '.' . substr($ejercicio, -2);
                    $paramodificar->numeroaprobacion = $numerodoc;
                }

                $paramodificar->save();
            }
            if (isset($arraydatosdoc)) {
                $documentomodificado = $objDoc->modificardat_documentoaprobacion(
                        $arraydatosdoc, $iddocumento
                );
            }
        }
        echo json_encode($documentomodificado);
    }

    public function listarConceptosAction() {
        $identidad = $this->global->Estructura->idestructura;

        $response = NomConcepto::listarebDocaprob($identidad);
        echo json_encode(array('data' => $response));
    }

    public function listarOperacionAction() {
        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $resp = NomOperacion::listar($start, $limit);
        echo json_encode(array('data' => $resp));
    }

    public function listarDocumentoAction() {


        $parametros;
        $identidad = $this->_request->getParam('identidad');
        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $filtros = $this->_request->getParam('filtros');
        $start = ($this->_request->getParam('start')) ? $this->_request->getParam('start') : 0;
        $limit = ($this->_request->getParam('limit')) ? $this->_request->getParam('limit') : 20;
        $resp = DatDocumentoaprobacion::listar(
                        $identidad, $parametros, $filtros, $start, $limit
        );
        if (count($resp) != 0) {
            foreach ($resp['data'] as $key => $value) {
                $resp['data'][$key]['usuario'] = $this->integrator->seguridad->nombreUsuario(
                        $value['idusuario']
                );
            }
        }
        echo json_encode(
                array('data' => $resp['data'], 'total' => $resp['total'])
        );
    }

    public function EliminarDocumentoAction() {
        $iddocumento = $this->_request->getParam('iddoc');
        $model = new DatDocumentoaprobacioModel();
        $model->eliminar($iddocumento);
        echo json_encode(1);
    }

    public function AprobarDesaprobarAction() {
        $iddocumento = $this->_request->getParam('iddoc');
        $aprobacion = $this->_request->getParam('aprobacion');
        DatDocumentoaprobacioModel::AprobarDesaprobar($iddocumento, $aprobacion);
        echo json_encode(1);
    }

    public function listarIndRelacionAction() {
        ini_set("max_execution_time", 3600);
        $identidad = $this->_request->getParam('identidad');
        $manual = $this->_request->getParam('manual');
        $idejercicio = $this->_request->getParam('idejercicio');
        $idviaadquisicion = $this->_request->getParam('idvia');
        $iddocumentoaprobacion = $this->_request->getParam('iddocumento');
        $identidadmodelo = ($this->_request->getParam('idconceptoplan')) ? $this->_request->getParam('idconceptoplan') : 'notiene';
        $idcontroldivisa = $this->_request->getParam('idcontroldivisa');
        $organo = $this->_request->getParam('organo');
        $objDoc = new DatDocumentoaprobacioModel();
        $result = $objDoc->listarRelacionconInd($manual, $idcontroldivisa, $identidadmodelo, $idviaadquisicion, $identidad, $organo, $idejercicio, $iddocumentoaprobacion
        );
        echo json_encode($result);
    }

    public function VerDocumentoManualAction() {
        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $iddocumento = $this->_request->getParam('iddocumentoaprobacion');

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'via') {
                    $parametros ['via'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'importe') {
                    if ($datos ['data'] ['comparison'] == 'gt') {
                        $parametros ['importemayor'] = $datos ['data'] ['value'];
                    } else {
                        if ($datos ['data'] ['comparison'] == 'lt') {
                            $parametros ['importemenor'] = $datos ['data'] ['value'];
                        } else {
                            if ($datos ['data'] ['comparison'] == 'eq') {
                                $parametros ['importeigual'] = $datos ['data'] ['value'];
                            }
                        }
                    }
                } elseif ($datos ['field'] == 'destino') {
                    $parametros ['modelo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['denominacioncd'] = $datos ['data'] ['value'];
                }
            }
        }
        $vista = DatDocumentoaprobacioModel::verDocumentoManual(
                        $iddocumento, $start, $limit, $parametros
        );

        if (count($vista) != 0) {
            $vista['resultado'][0]['usuario'] = $this->integrator->seguridad->nombreUsuario(
                    $vista['resultado'][0]['idusuario']
            );
            $arrayEnti[] = $vista['resultado'][0]['identidad'];
            $integrator = ZendExt_IoC::getInstance();
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $identidad
            );
            $vista['resultado'][0]['entidad'] = $datosentidad[0]->denominacion;
        }
        echo json_encode(
                array('data' => $vista['resultado'], 'total' => $vista['total'])
        );
    }

    function listarIndicadoresControlDivisaAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['desglose'] = $this->_request->getPost('desglose');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $combo = ($this->_request->getPost('combo')) ? $this->_request->getPost(
                        'combo'
                ) : false;

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                }
            }
        }
        $data = NomControldivisaModel::listarindicadoresCD(
                        $parametros, $start, $limit
        );
        echo json_encode($data);
    }

    function actualizarplanesAction() {

        $idEstructura = ($this->_request->getParam('identidad')) ? $this->_request->getParam('identidad') : $this->global->Estructura->idestructura;
        $idejercicio = $this->_request->getParam('idejercicio');
        $via = $this->_request->getParam('via');
        $plan = json_decode(stripslashes($this->_request->getParam('plan')));
        $naturaleza = json_decode(stripslashes($this->_request->getParam('naturaleza')));

        $data = NomControldivisaModel::actualizarplanes(
                        $idEstructura, $idejercicio, $via, $plan, $naturaleza
        );

        echo json_encode($data);
    }

    function listarDestinoControlDivisaAction() {

        $idEstructura = ($this->_request->getParam('identidad')) ? $this->_request->getParam('identidad') : $this->global->Estructura->idestructura;
        $idejercicio = $this->_request->getParam('idejercicio');
        $data = DatEntidadmodelo::ObtenerPlanesCDAprob(
                        $parametros, null, $idEstructura, $idejercicio
        );
        echo json_encode($data);
    }

    public function listarOperacionesAction() {
        $aprobacion = $this->_request->getParam('aprobacion');
        $ejercicio = $this->_request->getParam('idejercicio');
        $identidad = $this->_request->getParam('identidad');
        $data = DatDocumentoaprobacioModel::listarOperaciones($aprobacion, $ejercicio, $identidad);

        echo json_encode(array('data' => $data));
    }

    public function listarTipoAprobacionAction() {
        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $accion = $this->_request->getParam('accion');
        $identidad = $this->_request->getParam('identidad');
        $data = DatDocumentoaprobacioModel::listarTipoAprobacion(
                        $accion, $identidad, $parametros
        );
        echo json_encode(array('data' => $data));
    }

    public function listarNaturalezadelosplanesAction() {
        $parametros->idcontroldivisa = $this->_request->getParam('idcontroldedivisa');
        $data = DatDocumentoaprobacioModel::listarNaturalezadelindicador(
                        $parametros
        );
        /* $accion = $this->_request->getParam('accion');
          $identidad = $this->_request->getParam('identidad');
          $data = DatDocumentoaprobacioModel::listarTipoAprobacion(
          $accion, $identidad, $parametros
          ); */
        echo json_encode(array('data' => $data));
    }

    public function cargarviayplanparacontingenciaAction() {
        $idejercicio = $this->_request->getParam('idejercicio');
        $response = NomViaadquisicion::listarContingencia($idejercicio);
        echo json_encode(array('data' => $response));
    }

    public function guardarviayplanparacontingenciaAction() {
        $idejercicio = $this->_request->getParam('idejercicio');
        $arraydatos = json_decode(
                stripslashes($this->_request->getPost('data'))
        );
        echo json_encode(NomViaadquisicionModel::guardarviayplanparacontingencia($arraydatos, $idejercicio));
    }

    public function cargarviaadquisicionAction() {

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    }
                }
            }
        }
        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $total = 0;
        $response = NomViaadquisicion::listarVA($parametros, $start, $limit);
        foreach ($response as $key => $data) {
            if ($data['uriviaadquisicion'] == 'sustitucionimportaciones') {
                $response[$key]['denominacion'] = 'Servicios y Otros Pagos';
            }
        }
        $total = NomViaadquisicion::total($parametros);
        echo json_encode(array('data' => $response, 'total' => $total));
    }

    //Listar el arbol 

    public function ListarAprobacionesAction() {
        $valor = $this->_request->getParam('valor');
        $cbmodel = new DatDocumentoaprobacioModel();
        $data = $cbmodel->listarAprobaciones();

        if ($valor != null) {
            foreach ($data as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($data[$key]);
                }
            }
            $res = array();
            $i = 0;
            foreach ($data as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $data = $res;
        }

        echo json_encode($data);
    }

    function reportenuevoAction() {
        $parametros->ejercicio = $this->_request->getParam('reporta');
        $parametros->fechainicio = $this->_request->getParam('fechainicio');
        $parametros->fechafin = $this->_request->getParam('fechafin');
        $parametros->identidad = $this->_request->getParam('identidad');
        $responsable = $this->_request->getParam('responsable');
        $cbmodel = new DatDocumentoaprobacioModel();
        $resulta = $cbmodel->generardatosreporte($parametros);
        $data = $resulta->resul;
        foreach ($data as $key => $pos) {
            $oe = $this->integrator->metadatos->DameEstructura($pos['identidad']);

            $data[$key]['denentidad'] = $oe[0]->denominacion;
        }


        $parametros->datos = $data;


        $parametros->totalporcolumna = $cbmodel->sumarcadacosa($data);

        $pdteadistribuir = $cbmodel->sumarcadacosa($resulta->pendadistrib);
        $parametros->pdteadistribuir = $cbmodel->restarcadaposdelarray($parametros->totalporcolumna, $pdteadistribuir);
        $parametros->total = $cbmodel->sumarcadaposdelarray($parametros->totalporcolumna, $parametros->pdteadistribuir);
        $parametros->responsable = $responsable;
        $objPdf = new GenerarPdfControlAprobacionesGeneral($parametros);

        $objPdf->export();
    }

    //Imprimir
    function reportesAction() {

        $cbmodel = new DatDocumentoaprobacioModel();
        //  $parametros;
        $idreportes = $this->_request->getParam('reporta');
        $responsable = $this->_request->getParam('responsable');
        $identidad = $this->_request->getParam('identidad');

        $documento = Doctrine::getTable('DatDocumentoaprobacion')->find(
                $idreportes
        );
        if (isset($documento)) {
            if ($documento->esmanual == 0) {
                $parametros->imprimir = true;
            }
        }


        $datos = $cbmodel->getDatosDocumentoImprimir($idreportes, $parametros, $identidad);
        $param['datos'] = $datos;
        $param['responsable'] = $responsable;
        $objPdf = new GenerarPdfControlAprobaciones($param);
        $objPdf->export();
        //$cbmodel->generarDoc($datos);
    }

    public function gestPermisosAction() {
        $arrayReferenciaDesglosada = array();
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['identidad'] = $this->global->Estructura->idestructura;
        $params['idfuncionalidad'] = $_SERVER['REQUEST_URI'];

        $arrayReferenciaDesglosada = explode("/", $params['idfuncionalidad']);
        $params['idfuncionalidad'] = $arrayReferenciaDesglosada[1];
        for ($i = 2; $i < count($arrayReferenciaDesglosada) - 1; $i++) {
            $params['idfuncionalidad'] .= '/' . $arrayReferenciaDesglosada[$i];
        }
        $params['idfuncionalidad'] .= '/' . $arrayReferenciaDesglosada[count(
                        $arrayReferenciaDesglosada
                ) - 2];

        $modelActEnt = new DatActividadentidadModel();
        echo json_encode($modelActEnt->gestPermisos($params));
    }

    public function listarIndicadoresDesgloseAction() {
        $parametros = array();
        $data = array();
        $model = new DatDocumentoaprobacioModel();
        $parametros['idindicadorcd'] = $this->_request->getPost('idindicadorcd');
        $parametros['desglose'] = $this->_request->getPost('desglose');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');

        $data = $model->listarRelacionconIndDesglose($parametros);
        echo json_encode($data);
    }

    public function guardarDatosDesgloseAction() {
        $parametros = array();
        $data = array();
        $model = new DatDocumentoaprobacioModel();
        $parametros['idindicadorcd'] = $this->_request->getPost('idindicadorcd');
        $parametros['upgrid'] = $this->_request->getPost('upgrid');
        $parametros['automatico'] = $this->_request->getPost('tipo');
        $parametros['tipo'] = $this->_request->getPost('automatico');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['porciento'] = $this->_request->getPost('porciento');
        $parametros['datos'] = json_decode(
                stripslashes($this->_request->getPost('datos'))
        );
        $result = 3;
        $result = $model->guardarDatosDesglose($parametros);
        echo json_encode($result);
    }

    public function obtenerReporteAction() {
        ini_set("max_execution_time", 6000000);
        ini_set("memory_limit", "1024M");
        try {
            $model = new DatDocumentoaprobacioModel();
            $params = Zend_Json_Decoder::decode($this->_request->getPost('parametros'));
            $result = $model->getDatosReporte($params);
            $report = $this->pIntegrator->reportes->obtenerReporte($result);
            echo Zend_Json_Encoder::encode(array('html' => $report));
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

}
