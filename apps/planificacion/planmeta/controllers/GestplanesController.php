<?php

/**
 * GestplanesController
 * Controlador para gestionar los planes
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
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

class GestplanesController extends ZendExt_Controller_Secure {

    /**
     * funcion init()
     * Para inicializar el modulo
     *
     * @author Dionisdel Ponce Santana
     * */
    function init() {
        $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    /**
     * funcion gestplandiony()
     * Para renderizar la vista
     *
     * @author Dionisdel Ponce Santana
     * */
    public function gestplanesAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    /**
     * funcion adicionarPlan()
     * Para adicionar o modificar un plan
     */
    public function adicionarPlanAction() {
        $idplan = $this->_request->getPost('idplanm');
        $rector = $this->_request->getPost('rector') ? 1 : 0;
        $codigo = $this->_request->getPost('codigoplan');
        $denominacion = $this->_request->getPost('denominacionp');
        $descripcion = $this->_request->getPost('descripcionp');
        $idejercicio = $this->_request->getPost('idejercicio');
        $node = $this->_request->getPost('node');
        if (!$this->_request->getPost('identidad')) {
            $identidad = $this->global->Estructura->idestructura;
        } else {
            $identidad = $this->_request->getPost('identidad');
        }
        $version = 1; //despues arreglar este cableado cuando se trate la concurrencia
        if ($idplan == ""
        ) { // si no se quiere modificar, o sea, lo que se quiere es adicionar, valido el codigo
            $existecodigo = DatPlan::validarCodigo($codigo);
            if ($existecodigo >= 1
            ) { //si existe el codigo, mostrar mensaje error
                $dat->codMsg = 21;
            } else { // si el codigo no existe se inserta
                $model = new DatPlanModel();
                //adiciona el plan

                $model->Insertar(
                        $idplan, $codigo, $denominacion, $descripcion, $version, $identidad
                );
                // Devuelvo para la IU la confirmacion
                $dat->mensaje = 'Add';
                $dat->codMsgA = 1;
            }
        } else { //si viene algo en idplan es q se quiere modificar
            $model = new DatPlanModel();
            //adiciona el plan

            $model->Insertar(
                    $idplan, $codigo, $denominacion, $descripcion, $version, $identidad
            );
            // Devuelvo para la IU la confirmacion
            $dat->mensaje = 'Mod';
            $dat->codMsgA = 1;
        }
        echo json_encode($dat);
    }

    public function cargaInicialAction() {
        $identidad = $this->global->Estructura->idestructura;
        $datos = NomEjercicioplanificacion::listarEjercicioActual();

        echo json_encode(
                array('data' => $identidad,
                    'idejercicio' => $datos[0]['idejercicio'])
        );
    }

    /**
     * funcion eliminar()
     * Para eliminar un plan
     */
    public function eliminarAction() {
        if (!$this->_request->getPost('identidad')) {
            $identidad = $this->global->Estructura->idestructura;
        } else {
            $identidad = $this->_request->getPost('identidad');
        }
        $idplan = $this->_request->getPost('idplan');

        $model = new DatPlanModel();
        $dat = $model->Eliminar($idplan, $identidad);
        // Devuelvo para la IU la confirmacion

        echo json_encode($dat);
    }

    /**
     * funcion listarEjercicios()
     * Para obtener la lista de ejercicios configurados en la entidad
     */
    public function listarEjerciciosAction() {
        $datos = NomEjercicioplanificacion::listarEjercicioActual();
        echo json_encode(array('data' => $datos));
    }

    public function listCmbIndicadoresModAction() {
        $indicadores = NomIndicador::getIndicadorestoplan();
        echo json_encode(array('data' => $indicadores));
    }

    public function exportarModeloProduccionAction() {
        $parametros->identidad = $this->_request->getParam('identidad');
        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $parametros->denomentidad = $this->_request->getParam('denomentidad');
        $parametros->denomejercicio = $this->_request->getParam('denomejercicio');

        $tipoRpt = $this->_request->getParam('tipoRpt');

        $arrEntHijas = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->identidad);
        $arrEntHijas[] = $parametros->identidad;
        $parametros->identidades = implode(',', $arrEntHijas);

        switch ($tipoRpt) {
            case 1:
                $obj = new GenerarPdfModeloProduccion($parametros);
                break;

            case 2:
                $obj = new GenerarPdfModeloGastosCostos($parametros);
                break;

            case 3:
                $obj = new GenerarPdfModeloEstadoResultado($parametros);
                break;

            case 4:
                $obj = new GenerarPdfEstadoSituacion($parametros);
                break;

            case 5:
                $obj = new GenerarPdfFlujoCaja($parametros);
                break;

            case 6:
                $obj = new GenerarPdfIndicadores($parametros);
                break;
        }
        $obj->export();
    }

    public function exportarModeloGastosCostosAction() {
        $parametros->identidad = $this->_request->getParam('identidad');
        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $parametros->denomentidad = $this->_request->getParam('denomentidad');
        $parametros->denomejercicio = $this->_request->getParam('denomejercicio');

        $arrEntHijas = DatActividadentidad::auxObtenerEntidadesHijasComun($parametros->identidad);
        $arrEntHijas[] = $parametros->identidad;
        $parametros->identidades = $arrEntHijas;

        $obj = new GenerarPdfModeloGastosCostos($parametros);
        $obj->export();
    }

    /**
     * funcion listarPlanModelo()
     * Para obtener el tree de planes
     */
    public function listarPlanModeloAction() {
        if ($this->_request->getPost('ban') == 1) {
            if (!$this->_request->getPost('identidad')) {
                $identidad = $this->global->Estructura->idestructura;
            } else {
                $identidad = $this->_request->getPost('identidad');
            }

            $tipo = $this->_request->getPost('tipo');
            $node = $this->_request->getPost('node');


            $parametros['codigo'] = $this->_request->getPost('codigo');
            $parametros['denominacion'] = $this->_request->getPost(
                    'denominacion'
            );
            $model = new DatPlanModel();
            $elementos = $model->Listar($identidad, $tipo, $node);

            //marcar los planes con indicadores
            $arrayIdentmod = array();
            $arrenthijas = DatActividadentidad::auxObtenerEntidadesHijasComun($identidad);

            $arrenthijas[] = $identidad;
            $obj = new DatEntidadmodelo();

            foreach ($elementos as $key => $valor) {
                $var = $obj->obtenerIdEtidadModlo(
                        $valor['idmodelo'], $arrenthijas
                );

                $identmodor[$valor['idmodelo']] = $var;
                foreach ($var as $k => $val) {
                    $arrayIdentmod[] = $val['identidadmodelo'];
                }
            }

            $idejercicio = $this->_request->getPost('idejercicio');
            $idejer = NomEjercicioplanificacion::listarEjercicioActual();

            $idejer = ($idejercicio) ? $idejercicio : $idejer[0]['idejercicio'];
            $arrayRes = DatEntidadmodelo::tieneIndPlanifEjer(
                            $arrayIdentmod, $idejer
            );

            $arrayIdentmod = array();
            foreach ($arrayRes as $valor) {
                foreach ($identmodor as $k => $val) {
                    $temp = array();
                    foreach ($val as $va) {
                        $temp[] = $va['identidadmodelo'];
                    }
                    if (in_array($valor['identidadmodelo'], $temp)) {
                        $identmodor[$k]['planif'] = 'ok';
                    }
                }
            }


            foreach ($elementos as $key => $valor) {
                if ($identmodor[$valor['idmodelo']]['planif'] ==
                        'ok'
                ) {
                    $elementos[$key]['text'] = "<b> " . $valor['text'] . "</b>";
                }
            }
            echo json_encode($elementos);
        }
    }

    /**
     * funcion obtenerinterfazusuario()
     * Para obtener el tree de planes
     */
    public function obtenerinterfazusuarioAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $bandera = $this->_request->getPost('bandera');
        $model = new DatPlanModel();
        $result = $model->ObtenerInterfazUsuario($idmodelo);
        echo json_encode($result);
    }

    public function getgridinterfacesAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $idtipomodelo = DatModelo::ObtenerModelo($idmodelo);
        $model = new DatPlanModel();
        $result = $model->GetGridInterfaces($idtipomodelo[0]['idtipomodelo']);
        echo json_encode($result);
    }

    /**
     * @function
     *  ImportarFuenteDatosAction
     *  Realiza la importacion de datos de los elementos de un modelo a otro
     *
     * @params
     *  idfuente    El id del modelo del cual se van a tomar  los datos a importar
     *  iddestino   El id del modelo al  cual se van a copiar los datos importados
     *  validar     Una bandera para saber si el usuario desea sobre escribir los datos o no
     *  0 no valides, sobre escribe
     *  1 valida y alerta para sobre escribir o no
     *
     * @return
     * */
    public function ImportarFuenteDatosAction() {
        //Id Modelo fuente
        $modelofuente = Doctrine::getTable('DatModelo')->find(
                $this->_request->getPost('idfuente')
        );
        //Id Modelo destino
        $modelodestino = Doctrine::getTable('DatModelo')->find(
                $this->_request->getPost('iddestino')
        );
        //Bandera para saber si el usuario desea sobre escribir los datos o no
        $validar = $this->_request->getPost('validar');
        //Se manda a importar al model correspondiente
        DatModeloModel::importarFuenteDatos(
                $modelofuente, $modelodestino, $validar
        );
    }

    public function modificarindicadorAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $parametros = $this->_request->getParams();

        $modelo = DatModelo::ObtenerModelo($idmodelo);

        $tipomodelo = NomTipomodelo::Buscar($modelo[0]['idtipomodelo']);

        $this->_meta->Metadata()->modificarEnMetadatos(
                $tipomodelo[0]['idtabla'], $parametros
        );

        echo json_encode(array('codMsg' => 1));
    }

    public function listarPlanModeloDeUnTipoModeloAction() {
        $identidad = $this->global->Estructura->idestructura;
        $tipo = $this->_request->getPost('tipo');
        $idmodelo = $this->_request->getPost('idmodelo');
        $node = $this->_request->getPost('node');
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $parametros['codigo'] = $this->_request->getPost('codigo');
        $parametros['denominacion'] = $this->_request->getPost('denominacion');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');

        $model = new DatPlanModel();
        $elementos = $model->ListarModPorTipoModelo(
                $identidad, $tipo, $node, $parametros, $idtipomodelo, $idmodelo
        );
        echo json_encode($elementos);
    }

    public function cargarFormParaModificarIndModeloAction() {
        //Recibo los elementos que me envian desde la IU.
        $idmodelo = $this->_request->getPost('idmodelo');
        $idplanificacion = $this->_request->getPost('idplanificacion');
        $model = new DatPlanModel();
        $dat = $model->CargarFormParaModificarIndModelo(
                $idmodelo, $idplanificacion
        );

        echo json_encode($dat);
    }

    public function listarCentroBalanceAction() {
        $idcentrobalance = 1; //numero fijo en la BD para Nomdatosnomenclador
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                        $idcentrobalance
        );
        foreach ($centrobalance as $k => $valor) {
            $dat[$k]['idcentrobalance'] = $valor['identidad'];
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $valor['identidad']
            );
            $dat[$k]['centrobalance'] = $datosentidad[0]->denominacion;
            $dat[$k]['identidaddatosnomenclador'] = $valor['identidaddatosnomenclador'];
        }
        echo json_encode(array('data' => $dat));
    }

    public function ListarComboCentroBalanceAction() {
        $rector = $this->_request->getPost('rector');
        //   $identidad = $this->_request->getPost('identidad');
        $idestructura = ZendExt_GlobalConcept::getInstance(
                )->Estructura->idestructura;
        $cbmodel = new CentrodebalanceModel();
        $data = $cbmodel->listarCentrosBalance(
                $rector, true, null, $idestructura
        );
        if ($data == 1) {
            echo("{'codMsg':22 }");
        } else {
            echo json_encode(array('data' => $data));
        }
    }

    public function listarHijosRectorAction() {
        $identrectora = DatEntidaddatosnomenclador::obtenerEntidadRectora();
        $excluir = array(7, 8, 9, 10);
        $datosentidad = $this->integrator->metadatos->DameHijosEstructura(
                $identrectora[0]['identidad'], $excluir
        );
        foreach ($datosentidad as $k => $valor) {
            $dat[$k]['identi'] = $valor->idestructura;
            $dat[$k]['denominacion'] = $valor->denominacion;
        }
        echo json_encode(array('data' => $dat));
    }

    public function listarIndXCentroBalanceAction() {
        ini_set(
                "max_execution_time", 3600
        ); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
        //SOLUCION INICIAL
        $params['idcb'] = $this->_request->getPost('identiCB');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['identlog'] = $this->integrator->metadatos->DameEstructura(
                ZendExt_GlobalConcept::
                getInstance()->Estructura->idestructura
        );
        $params['idespecialidad'] = $params['identlog'][0]->idespecialidad;

        if ($params['idcb']) {
            $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') :
                    0;
            $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') :
                    20;
            $params['filtros'] = $this->_request->getPost('filtros');
            $filtros = $params['filtros'];
            if ($filtros) {
                foreach ($filtros as $datos) {
                    if ($datos['field'] == 'codigo') {
                        $params['codigo'] = $datos['data']['value'];
                    }
                }
            }
            $model = new DatPlanificacionModel();
            $datos = $model->listarIndXCB($params);

            echo json_encode($datos);
        } else {
            echo json_encode(array('data' => array()));
        }
    }

    public function listarEspecialidadesAction() {
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $especialidades = $this->nomenclador->selectParam(
                'nom_especialidad', array('idespecialidad',
            'denespecialidad')
        );
        $arrayFinal = array();
        foreach ($especialidades as $value) {
            $datosespecialidad = $this->integrator->datosmaestros->obtenerEspecialidadPorId(
                    $value['idespecialidad']
            );
            if ($datosespecialidad[0]->nivel == 1) {
                $arrayFinal[] = array('idespecialidad' => $datosespecialidad[0]->idespecialidad,
                    'denespecialidad' => $datosespecialidad[0]->denespecialidad);
            }
        }
        echo json_encode(array('data' => $arrayFinal));
    }

    public function listarModelosAction() {
        $global = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $global->Estructura->idestructura;
        $data->data = DatEntidadmodelo::servBP_getModeloAsocEntidad(
                        $idEstructura
        );
        $data->data[] = array('idmodelo' => '-', 'denominacion' => '-');
        echo json_encode($data);
    }

    public function listarEntidadesAction() {
        $params['idcb'] = $this->_request->getPost('identiCB');
        $params['identlog'] = $this->integrator->metadatos->DameEstructura(
                ZendExt_GlobalConcept::
                getInstance()->Estructura->idestructura
        );
        $params['idespecialidad'] = $params['identlog'][0]->idespecialidad;
        $model = new DatPlanificacionModel();
        $datos = $model->listarIndXCBEntidad($params);
        echo json_encode(array('data' => $datos));
    }

    public function CargarFuenteDeDatos() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $model = new DatPlanModel();
        $modelos = $model->CargarFuenteDeDatos($idmodelo);
        echo json_encode($modelos);
    }

    public function listarIndicadoresAction() {

        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $idejercicio = $this->_request->getPost('idejercicio');
        $tipoplan = $this->_request->getPost('tipoplan');
        $filtros = $this->_request->getPost('filtros');
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $parametros['codigo'] = $datos['data']['value'];
                }

                if ($datos['field'] == 'numeropieza') {
                    $parametros['numeropieza'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'denominacion') {
                    $parametros['denominacion'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'precio') {
                    if ($datos['data']['comparison'] == "gt") {
                        $parametros['precio_condicion1'] = array('precio' => $datos['data']['value'],
                            'condicion' => ">");
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $parametros['precio_condicion2'] = array('precio' => $datos['data']['value'],
                            'condicion' => "<");
                    } else {
                        $parametros['precio_condicion3'] = array('precio' => $datos['data']['value'],
                            'condicion' => "=");
                    }
                } elseif ($datos['field'] == 'umedida') {
                    $parametros['idumedida'] = $datos['data']['value'];
                } elseif ($datos['field'] == 'centrobalance') {
                    $parametros['identidaddatosnomenclador'] = $datos['data']['value'];
                }
            }
        }

        //Obtiene la lista de indicadores que cumplan las caracteristicas para ser mostrados en el grid,
        // aprobacion , etc dado un id padre o nodo
        $indicadores = NomIndicador::ListarIndNivelPlanif(
                        $parametros, $start, $limit, $tipoplan
        );
        $total = NomIndicador::listarTotalplanificados(
                        $parametros, $idejercicio, $tipoplan
        );

        $data = '';
        foreach ($indicadores as $k => $direction) {
            $data[$k]['codigo'] = $indicadores[$k]['codigo'];
            $data[$k]['estado'] = $indicadores[$k]['estado'];
            $data[$k]['idindicador'] = $indicadores[$k]['idindicador'];
            $data[$k]['idformato'] = $indicadores[$k]['idformato'];
            $data[$k]['denominacion'] = $indicadores[$k]['denominacion'];
            if ($tipoplan == 1)
                $data[$k]['precio'] = $indicadores[$k]['NomIndicadorplanif']['precioventa'];
            else
                $data[$k]['precio'] = $indicadores[$k]['NomIndicadorplanif']['precio'];

            $data[$k]['numeropieza'] = $indicadores[$k]['numeropieza'];
            //busco el identidad del centro de balance, dado el identidaddatosnomenclador, que es el que se almacena
            //en NomIndicador como idcentrobalance busco la denominacion del centro de balance en EyC
            foreach ($direction['DatIndicadorcentrobalance'] as $d) {
                $datosentidad = $this->integrator->metadatos->DameEstructura(
                        $d['DatEntidaddatosnomenclador']['identidad']
                );
                $data[$k]['centrobalance'] = $datosentidad[0]->denominacion;
            }
            //busco la unidad de medida por el idunidad
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($direction['idumedida'])
            );
            $data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }

        echo json_encode(array('total' => $total, 'data' => $data));
    }

    public function adicionarindicadoresAction() {
        ini_set("max_execution_time", 600); //10min
        $parametros = $this->_request->getParams();

        $idmodelo = $this->_request->getPost('idmodelo');
        $tipoplan = $this->_request->getPost('tipoplan');
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $idejercicio = $this->_request->getPost('idejercicio');

        //recibo el arreglo de indicadores
        $idindicadores = json_decode(
                stripslashes($this->_request->getPost('indicadores'))
        );

        $model = new DatPlanModel();
        //mando los indicadores para el metodo de la model que es la que los adiciona al modelo como tal
        $model->AdicionarIndicadores(
                $idindicadores, $parametros, $identidadmodelo, $idejercicio, $idmodelo, $tipoplan
        );

        // Devuelvo para la UI la confirmacion
        $dat->codMsg = 1;
        $dat->mensaje = ($idindicadores) ?
                'EL(los) indicador(es) ha(n) sido adicionado(s) satisfactoriamente.' : 'Mod';
        echo json_encode($dat);
    }

    public function listarEntidadesODAction() {
        $model = new DatPlanModel();
        $denomentidades = $model->listarEOD();
        echo json_encode(array('data' => $denomentidades));
    }

    public function listarNaeObjgastoAction() {
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $listadoIndOG->data = DatPlanificacionnae::consolidarOG(
                        $identidadmodelo
        );
        if ($listadoIndOG->data[0] == null) {
            $listadoIndOG->total = 0;
        }
        echo json_encode(
                array('data' => $listadoIndOG->data,
                    'total' => $listadoIndOG->total)
        );
    }

    public function listarNaeRecfinacieroAction() {

        $identidadmodelo = $this->_request->getPost('identidadmodelo');

        $listadoIndRF->data = DatPlanificacionnae::consolidarRF(
                        $identidadmodelo
        );
        if ($listadoIndRF->data[0] == null) {
            $listadoIndRF->total = 0;
        }
        echo json_encode($listadoIndRF);
    }

    public function cargarEntidadesDesasociarAction() {
        $idmodelo = $this->_request->getPost('idmodelo');
        $filtro = $this->_request->getPost('filtros');
        $entidades = DatEntidadmodelo::getEntidades($idmodelo);
        foreach ($entidades as $value) {

            $datosentidad = $this->integrator->metadatos->DameEstructura(
                    $value['identidad']
            ); //100000024
            $data[] = array(
                'id' => $value['identidad'],
                'identidadmodelo' => $value['identidadmodelo'],
                'tipo' => 1,
                'draggable' => false,
                'leaf' => false,
                'text' => $datosentidad[0]->denominacion,
                'checked' => false);
        }
        if ($data == null) {
            $data = array();
        }

        if ($filtro[0] != null) {
            // $tem = '';
            foreach ($data as $key => $value) {
                if (!stristr($value['text'], $filtro[0]['data']['value'])) {
                    unset($data[$key]);
                }
            }

            $result = array();
            $i = 0;
            foreach ($data as $key => $val) {
                $result[$i++] = $val;
            }
        }
        if ($result != null) {
            $data = $result;
        }

        echo json_encode($data);
    }

    public function desasociarModeloAction() {
        $entidades = json_decode(
                stripslashes($this->_request->getPost('entidades'))
        );
        $entidadmodelo = new DatEntidadmodeloModel();
        $data = $entidadmodelo->desasociarEntMod($entidades);
        if ($data == 1) {
            $dat->codMsg = 21;
        } elseif ($data == 2) {
            $dat->codMsg = 22;
        } elseif ($data == 4) {
            $dat->codMsg = 24;
        } else {
            $dat->codMsg = 3;
        }
        echo json_encode($dat);
    }

    private function datosImportar() {
        $idmodelo = $this->_request->getParam('idmodelo');
        $limit = 100000;
        $start = 0;
        $filtros = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $global = $this->_request->getParam('glob');
        if ($global == 'true') {
            $ajustar = 1;
        } else {
            $ajustar = 0;
        }
        /* if ($this->_request->getParam('hoja') == 1) {
          $ajustar = 0;
          } else {
          if ($this->_request->getParam('hoja') == 0) {
          $ajustar = 1;
          }
          } */

        $identidad = $this->_request->getParam('identidad');
        $idejercicio = $this->_request->getParam('idejercicio');
        $identidadmodelo = $this->_request->getParam('identidadmodelo');
        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->ObtenerIdTipoModelo($idmodelo);

        //OBTIENE UN OBJETO ACTIVE RECORD CON TODA LA INFORMACION DE ESA TABLA PARA
        // TRABAJAR Y HACER MAS CONSULTAS CON ELLA
        $x = $this->_meta->Metadata()->obtenerInfoTabla(
                $tipomodelo[0]['idtabla']
        );


        //$codigotm = $tipomodelo[0]['codigo'];
        //$concat = $codigotm . '_id' . $codigotm;
        // $llave = "mod_planificacionmeta_nom_$concat";
        if ($ajustar == 1) {
            $arryhijos = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $identidad
            );
            array_push($arryhijos, $identidad);
            $var = implode(',', $arryhijos);
            $arryhijos = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);
            if ($arryhijos[0] == null || $arryhijos[0] == '' || !$arryhijos[0])
                $identidadmodelo = -1;
        } else {
            $ident = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
            if ($ident[0] == null || $ident[0] == '' || !$ident[0]) {
                $identidadmodelo = -1;
            }
        }

        if ($identidadmodelo != -1) {

            if ($filtros) {
                foreach ($filtros as $key => $datos) {

                    if ($datos->field == 'codigo') {
                        $parametros['codigo'] = $datos->data->value;
                    } elseif ($datos->field == 'numeropieza') {
                        $parametros['numeropieza'] = $datos->data->value;
                    } elseif ($datos->field == 'centrobalance') {
                        $parametros['centrobalance'] = $datos->data->value;
                    } elseif ($datos->field == 'denominacion') {
                        $parametros['denominacion'] = $datos->data->value;
                    } elseif ($datos->field == 'precio') {
                        if ($datos->data->comparison == "gt") {
                            $parametros['precio_condicion1'] = array('precio' => $datos->data->value,
                                'condicion' => ">");
                        } elseif ($datos->data->comparison == "lt") {
                            $parametros['precio_condicion2'] = array('precio' => $datos->data->value,
                                'condicion' => "<");
                        } else {
                            $parametros['precio_condicion3'] = array('precio' => $datos->data->value,
                                'condicion' => "=");
                        }
                    } elseif ($datos->field == 'cantidad') {
                        if ($datos->data->comparison == "gt") {
                            $parametros['cantidad_condicion1'] = array('cantidad' => $datos->data->value,
                                'condicion' => ">");
                        } elseif ($datos->data->comparison == "lt") {
                            $parametros['cantidad_condicion2'] = array('cantidad' => $datos->data->value,
                                'condicion' => "<");
                        } else {
                            $parametros['cantidad_condicion3'] = array('cantidad' => $datos->data->value,
                                'condicion' => "=");
                        }
                    } elseif ($datos->field == 'ajuste') {
                        if ($datos->data->comparison == "gt") {
                            $parametros['ajuste_condicion1'] = array('ajuste' => $datos->data->value,
                                'condicion' => ">");
                        } elseif ($datos->data->comparison == "lt") {
                            $parametros['ajuste_condicion2'] = array('ajuste' => $datos->data->value,
                                'condicion' => "<");
                        } else {
                            $parametros['ajuste_condicion3'] = array('ajuste' => $datos->data->value,
                                'condicion' => "=");
                        }
                    } elseif ($datos->field == 'importeajustado') {
                        if ($datos->data->comparison == "gt") {
                            $parametros['importeajustado_condicion1'] = array('importeajustado' => $datos->data->value,
                                'condicion' => ">");
                        } elseif ($datos->data->comparison == "lt") {
                            $parametros['importeajustado_condicion2'] = array('importeajustado' => $datos->data->value,
                                'condicion' => "<");
                        } else {
                            $parametros['importeajustado_condicion3'] = array('importeajustado' => $datos->data->value,
                                'condicion' => "=");
                        }
                    } elseif ($datos->field == 'cantidadfinal') {
                        if ($datos->data->comparison == "gt") {
                            $parametros['cantidadfinal_condicion1'] = array('cantidadfinal' => $datos->data->value,
                                'condicion' => ">");
                        } elseif ($datos->data->comparison == "lt") {
                            $parametros['cantidadfinal_condicion2'] = array('cantidadfinal' => $datos->data->value,
                                'condicion' => "<");
                        } else {
                            $parametros['cantidadfinal_condicion3'] = array('cantidadfinal' => $datos->data->value,
                                'condicion' => "=");
                        }
                    } elseif ($datos->field == 'importefinal') {
                        if ($datos->data->comparison == "gt") {
                            $parametros['importefinal_condicion1'] = array('importefinal' => $datos->data->value,
                                'condicion' => ">");
                        } elseif ($datos->data->comparison == "lt") {
                            $parametros['importefinal_condicion2'] = array('importefinal' => $datos->data->value,
                                'condicion' => "<");
                        } else {
                            $parametros['importefinal_condicion3'] = array('importefinal' => $datos->data->value,
                                'condicion' => "=");
                        }
                    } elseif ($datos->field == 'importe') {
                        if ($datos->data->comparison == "gt") {
                            $parametros['importe_condicion1'] = array('importe' => $datos->data->value,
                                'condicion' => ">");
                        } elseif ($datos->data->comparison == "lt") {
                            $parametros['importe_condicion2'] = array('importe' => $datos->data->value,
                                'condicion' => "<");
                        } else {
                            $parametros['importe_condicion3'] = array('importe' => $datos->data->value,
                                'condicion' => "=");
                        }
                    } elseif ($datos->field == 'generadobasesplan') {

                        if ($datos->data->value[0] == "Si") {
                            $parametros['generadobasesplan'] = 1;
                        } elseif ($datos->data->value[0] == "No") {
                            $parametros['generadobasesplan'] = 0;
                        }
                    } elseif ($datos->field == 'idaprobaciondemanda') {

                        if ($datos->data->value[0] == "Si") {
                            $parametros['idaprobaciondemanda'] = 2;
                        } elseif ($datos->data->value[0] == "No") {
                            $parametros['idaprobaciondemanda'] = 1;
                        } elseif ($datos->data->value[0] == "Rector") {
                            $parametros['idaprobaciondemanda'] = 4;
                        }
                    } elseif ($datos->field == 'umedida') {
                        $parametros['idumedida'] = $datos->data->value;
                    } elseif ($datos->field == 'viaadquisicion') {
                        $parametros['viaadquisicion'] = $datos->data->value;
                    } elseif ($datos->field == 'organosatisface') {
                        $parametros['organosatisface'] = $datos->data->value;
                    }
                }
            }
            //obtiene los datos de ese modelo en metadatos con active record

            $datos = DatPlanModel::getDatos(
                            $tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $identidadmodelo, $idejercicio, $parametros, $start, $limit, $ajustar, $arryhijos, $idmodelo, null
            );



            /* if ($ajustar == 1) {
              $x = $this->_meta->Metadata()->obtenerInfoTabla(
              $tipomodelo[0]['idtabla']
              );
              $importetotal = DatPlanModel::getImportetotal(
              $x, $idejercicio, $parametros, $arryhijos, $idmodelo
              );
              } else {
              $importetotal = DatPlanificacion::importeTotal(
              $identidadmodelo, array()
              );
              } */
            $x = $this->_meta->Metadata()->obtenerInfoTabla(
                    $tipomodelo[0]['idtabla']
            );


            $importet = DatPlanModel::getDatosImporte(
                            $tipomodelo[0]['idtipomodelo'], $tipomodelo[0]['idtabla'], $x, $identidadmodelo, $idejercicio, $parametros, $ajustar, $arryhijos, $idmodelo
            );

            $arrayCampostab = DatPlanModel::camposdadoTabla(
                            $tipomodelo[0]['idtabla']
            );



            $arrayCampos = array();
            foreach ($arrayCampostab as $d) {
                $referencia[0] = "mod_planificacionmeta_dat_{$tipomodelo[0]['codigo']}_{$d['denomcampo']}";

                ////Asi estaba antes pero no salian los datos y se cambio nom por dat
                //$referencia[0] = "mod_planificacionmeta_nom_{$tipomodelo[0]['codigo']}_{$d['denomcampo']}";

                $referencia[1] = $d['denomcampo']; //n4 o n5
                $arrayCampos[] = $referencia;
            }
            unset($arrayCampostab);

            $arrayIdsDatosNomUno = array();
            $arrayIdsDatosNomDos = array();
            $arrayUms = array();
            $arrayPais = array();
            // $arrayCbs = array();




            $estructuras = $this->integrator->metadatos->DameEstructura($identidad);

            $unidadesmedida = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();

            $this->nomenclador = new ZendExt_Nomencladores_ADT();
            $paises = $this->nomenclador->selectParam(
                    'nom_pais', array('idpais',
                'nombrepais')
            );

            $misunidadesmedida = array();
            $mispaises = array();

            $total = 0;
            if (count($estructuras) > count($unidadesmedida) && count($estructuras) > count($paises)
            ) {
                $total = count($estructuras);
            } elseif (count($unidadesmedida) > count($estructuras) && count($unidadesmedida) >
                    count($paises)
            ) {
                $total = count($unidadesmedida);
            } elseif (count($paises) > count($unidadesmedida) && count($paises) > count($estructuras)
            ) {
                $total = count($paises);
            }


            $yaestructura = false;
            $yaunidadmedida = false;
            $yapais = false;
            for ($index = 0; $index < $total; $index++) {
                if (!$yaestructura) {
                    /* $misestructuras[$estructuras[$index]->idestructura]
                      = $estructuras[$index]; */

                    if ((count($estructuras) - 1) == $index) {
                        $yaestructura = true;
                    }
                }

                if (!$yaunidadmedida) {
                    $misunidadesmedida[$unidadesmedida[$index]['idunidadmedida']] = $unidadesmedida[$index];
                    if ((count($unidadesmedida) - 1) == $index) {
                        $yaunidadmedida = true;
                    }
                }

                if (!$yapais) {
                    $mispaises[$paises[$index]['idpais']] = $paises[$index];
                    if ((count($paises) - 1) == $index) {
                        $yapais = true;
                    }
                }
            }

            foreach ($datos as $k => $d) {
                $datos[$k]['centrobalance'] = $d['centrosbalance'];

                //busco la denominacion del pais.
                $idpais = $d['idpais']; //nomindicador o indicadorcontroller

                if ($arrayPais['_' . $idpais] == null) {
                    $datos[$k]['pais'] = $mispaises[$idpais]['nombrepais'];
                    $arrayPais['_' . $idpais] = $mispaises[$idpais]['nombrepais'];
                } else {
                    $datos[$k]['pais'] = $arrayPais['_' . $idpais];
                }
                //busco la unidad de medida
                /*  if ($arrayUms['_' . $d['idumedida']] == null) {
                  $datos[$k]['umedida'] = $misunidadesmedida[$d['idumedida']]['denominacionunidadmedida'];
                  $arrayUms['_' . $d['idumedida']] = $misunidadesmedida[$d['idumedida']]['denominacionunidadmedida'];
                  } else {
                  $datos[$k]['umedida'] = $arrayUms['_' . $d['idumedida']];
                  } */
                $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                        Array($d['idumedida'])
                );

                $datos[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];

                $datos[$k]['_is_leaf'] = true;
                $datos[$k]['_parent'] = null;



                foreach ($arrayCampos as $campoMeta) {
                    $campoMeta = $campoMeta[0];
                    if ($arrayIdsDatosNomUno['_' . $campoMeta] == null && $d[$campoMeta] != null
                    ) {
                        $arrayIdsDatosNomDos[] = $d[$campoMeta];
                        $arrayIdsDatosNomUno['_' . $d[$campoMeta]] = 'ok';
                    }
                }
            }
            $arrayIdsDatosNomDos = array_unique($arrayIdsDatosNomDos);
            unset($arrayIdsDatosNomUno);
            if ($arrayIdsDatosNomDos[0] != null) {
                $arrayColumnas = NomDatosnomenclador::ObtenerDatosDadoArrayIdDatosNom(
                                $arrayIdsDatosNomDos
                );
            }

            unset($arrayIdsDatosNomDos);
            if (is_array($arrayColumnas)) {
                foreach ($arrayColumnas as $key => $value) {
                    unset($arrayColumnas[$key]);
                    $arrayColumnas['_' . $value['iddatosnomenclador']] = $value['denominacion'];
                }
            }
            foreach ($datos as $k => $d) {
                foreach ($arrayCampos as $campoMeta) {
                    $datos[$k]['deno_' . $campoMeta[1]] = $arrayColumnas['_'
                            . $d[$campoMeta[0]]];
                }
            }
            $datos['importet'] = number_format(
                    $importet[0]['importetotal'], '3', '.', ','
            );
            $datos['importeajust'] = number_format(
                    $importet[0]['importeajustado'], '3', '.', ','
            );
            $datos['importefin'] = number_format(
                    $importet[0]['importefinal'], '3', '.', ','
            );
            $datos['importeflete'] = number_format(
                    $importet[0]['importeflete'], '3', '.', ','
            );
            $datos['importecontingencia'] = number_format(
                    $importet[0]['importecontingencia'], '3', '.', ','
            );
            $datos['importedivisa'] = number_format(
                    $importet[0]['importedivisa'], '3', '.', ','
            );
            //$datos['importeflete'] = $importetotal['importeflete'];
            //$datos['importecontingencia'] = $importetotal['importecontingencia'];
            //$datos['importedivisa'] = $importetotal['importedivisa'];

            $data->datos = $datos;
            $data->arrayCampos = $arrayCampos;
            $data->tipomodelo = $tipomodelo;
        } else {
            $data->datos = array();
            $data->arrayCampos = array();
            $data->tipomodelo = array();
        }
        return $data;
    }

    public function exportarAction() {
        ini_set("max_execution_time", 3600); //600 = 10min  3600 = 1hora
        $entidad = $this->_request->getParam('entidad');
        $plan = $this->_request->getParam('plan');
        //  $ejercicio = $this->_request->getParam('idejercicio');

        $data = self::datosImportar();
        $datos = $data->datos;

        //$arrayCampos = $data->arrayCampos;
        $tipomodelo = $data->tipomodelo;
        unset($data);

        $arrayEtiquetas = DatPlanModel::getEtiquetasTabla($tipomodelo[0]['idtabla']);

        $tabla = '<table border="1">
            <thead>
                <tr>
                    <td colspan="11"><b>Entidad: </b> ' . utf8_decode($entidad) .
                ' &nbsp;&nbsp;&nbsp; <b>Plan: </b> ' . $plan . ' <br></td>
                </tr>
            </thead>
            <tbody>
                <tr>';

        $columnas = '<th>C&oacute;digo</th>
                    <th>Num. piezas</th>
                    <th>Denominaci&oacute;n</th>
                    <th>UM</th>
                    <th>Precio</th>
                    <th>Necesidad</th>
                    <th>Ajuste</th>
                    <th>Cantidad Final</th>
                    <th>Centro balance</th>
                    <th>Pa&iacute;s</th>';
        //construccion de las columnas
        foreach ($arrayEtiquetas as $ind => $etiq) {
            $columnas .= '<th>' . $etiq['etiqueta'] . '</th>';
        }

        $columnas .= ' <th>Importe Inicial</th>
                    <th>Importe Ajustado</th>
                    <th>Importe Final</th>
                    <th>Flete y Seguro</th>
                    <th>Contingencia</th>
                     <th>Base plan</th>
                     <th>V&iacute;a de Aquisici&oacute;n</th>
                     <th>&Oacute;rgano que Satisface</th>
                </tr>';
        $tabla = $tabla . $columnas;
        $count = count($datos);

        for ($i = 0; $i < $count; $i++) {
            if ($datos[$i]['codigo'] != null) {
                $baseplan = $datos[$i]['generadobasesplan'] ? 'S&iacute;' : 'No';
                $numeropieza = $datos[$i]['numeropieza'] ? $datos[$i]['numeropieza'] : 0;
                $datos[$i]['flete'] = number_format(
                        $datos[$i]['flete'], '3', '.', ''
                );
                $datos[$i]['contingencia'] = number_format(
                        $datos[$i]['contingencia'], '3', '.', ''
                );
                $tabla
                        .= '<tr style="text-align:RIGHT;">
                                <td>' . $datos[$i]['codigo'] . '</td>
                                <td style="text-align:LEFT;">' . $numeropieza .
                        '</td>
                                <td style="text-align:LEFT;">' . $datos[$i]['denominacion'] .
                        '</td><td style="text-align:LEFT;">' . $datos[$i]['umedida'] . '</td>
                                <td>' . $datos[$i]['precio'] . '</td>
                                <td>' . $datos[$i]['cantidad'] . '</td>
                                <td>' . $datos[$i]['ajuste'] . '</td>
                                <td>' . $datos[$i]['cantidadfinal'] . '</td>
                                <td style="text-align:LEFT;">'
                        . $datos[$i]['centrobalance'] .
                        '</td>
                                <td style="text-align:LEFT;">'
                        . $datos[$i]['pais'] .
                        '</td>';

                foreach ($arrayEtiquetas as $ind => $etiq) {
                    $tabla .= ' <td style="text-align:LEFT;">'
                            . $datos[$i]['deno_' . $etiq['denominacion']] .
                            '</td>';
                }
                $datos[$i]['importeind'] = $datos[$i]['importe'];
                $datos[$i]['importeind'] = number_format(
                        $datos[$i]['importeind'], '3', '.', ''
                );
                $tabla .= '     <td>' . $datos[$i]['importeind'] . '</td>
                                <td>' . number_format(
                                $datos[$i]['importeajustado'], '3', '.', ''
                        ) . '</td>
                                <td>' . number_format(
                                $datos[$i]['importefinal'], '3', '.', ''
                        ) . '</td>
                                <td>' . $datos[$i]['flete'] . '</td>
                                <td>' . $datos[$i]['contingencia'] .
                        '</td>
                                <td style="text-align:LEFT;">' . $baseplan .
                        '</td>
                                <td style="text-align:LEFT;">'
                        . $datos[$i]['viaadquisicion'] .
                        '</td>
                                <td style="text-align:LEFT;">'
                        . $datos[$i]['organosatisface'] .
                        '</td>
                           </tr>';
            }
        }
        $filaResumen = ' <tr></tr><tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>';
        $cant = 0;
        foreach ($arrayEtiquetas as $ind => $etiq) {
            $filaResumen .= '<td></td>';
            $cant++;
        }
        $abc = "LMNOPQRSTUVWXYZA";
        $abcuno = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if ($cant < 16) {
            $LETRAFINAL = substr($abc, $cant, 1);
        } else {
            $LETRAFINAL = 'A' . substr($abcuno, ($cant - 16), 1);
        }
        $LETRAFINAL = 'O';

        $filaResumen
                .= '<td></td>
                                <td></td>
                                <td>Importe Total:</td>
                                <td>' . $datos['importet'] . '</td>
                                ';
        $tabla .= $filaResumen;

        $filaResumenuno = '
                                <td>' . $datos['importeajust'] . '</td>
                               ';
        $tabla .= $filaResumenuno;
        $filaResumendos = '
                                <td>' . $datos['importefin'] . '</td>
                                ';
        $tabla .= $filaResumendos;
        $tabla
                .= '
            </tbody>
        </table>';

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=planes.xls");
        header("Content-Transfer-Encoding: utf8_decode ");

        echo $tabla;
    }

    public function exportarpresupuestoAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['identidadmodelo'] = $this->_request->getParam(
                'identidadmodelo'
        );
        $parametros['idmodelo'] = $this->_request->getParam('idmodelo');
        $parametros['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $parametros['limit'] = $this->_request->getParam('limit');
        $parametros['start'] = $this->_request->getParam('start');
        $parametros['ajustar'] = $this->_request->getParam('hoja');
        $entidad = $this->_request->getParam('entidad');
        $plan = $this->_request->getParam('plan');
        $arrayIdsDatosNomUno = array();
        $arrayIdsDatosNomDos = array();
        $data = $this->buscarPresupuestos($parametros);
        $datos = $data->data;
        $tipomodelo = $data->tipomodelo;
        unset($data);

        $arrayCampostab = DatPlanModel::camposdadoTabla(
                        $tipomodelo[0]['idtabla']
        );

        $arrayCampos = array();
        foreach ($arrayCampostab as $d) {
            $referencia[0] = "mod_planificacionmeta_nom_{$tipomodelo[0]['codigo']}_{$d['denomcampo']}";
            $referencia[1] = $d['denomcampo']; //n4 o n5
            $arrayCampos[] = $referencia;
        }
        unset($arrayCampostab);

        foreach ($datos as $k => $d) {

            foreach ($arrayCampos as $campoMeta) {
                $campoMeta = $campoMeta[0];
                if ($arrayIdsDatosNomUno['_' . $campoMeta] == null && $d[$campoMeta] != null
                ) {
                    $arrayIdsDatosNomDos[] = $d[$campoMeta];
                    $arrayIdsDatosNomUno['_' . $d[$campoMeta]] = 'ok';
                }
            }
        }

        $arrayIdsDatosNomDos = array_unique($arrayIdsDatosNomDos);
        unset($arrayIdsDatosNomUno);
        if ($arrayIdsDatosNomDos[0] != null) {
            $arrayColumnas = NomDatosnomenclador::ObtenerDatosDadoArrayIdDatosNom(
                            $arrayIdsDatosNomDos
            );
        }

        unset($arrayIdsDatosNomDos);
        if (is_array($arrayColumnas)) {
            foreach ($arrayColumnas as $key => $value) {
                unset($arrayColumnas[$key]);
                $arrayColumnas['_' . $value['iddatosnomenclador']] = $value['denominacion'];
            }
        }

        foreach ($datos as $k => $d) {
            foreach ($arrayCampos as $campoMeta) {
                $datos[$k]['deno_' . $campoMeta[1]] = $arrayColumnas['_'
                        . $d[$campoMeta[0]]];
            }
        }

        $arrayEtiquetas = DatPlanModel::getEtiquetasTabla(
                        $tipomodelo[0]['idtabla']
        );
        $tabla = '<table border="1">
            <thead>
                <tr></tr>
                <tr>
                    <td colspan="11"><b>Entidad: </b> ' . utf8_decode($entidad)
                .
                ' &nbsp;&nbsp;&nbsp; <b>Plan: </b> ' . utf8_decode($plan) . ' <br></td>
                </tr>
                <tr></tr>
                <tr></tr>
            </thead>
            <tbody>
                <tr>
                    <th>C&oacute;digo</th>
                    <th>Num. piezas</th>
                    <th>Denominaci&oacute;n</th>
					<th>Asociado</th>
                    <th>UM</th>
                    <th>Precio</th>
                    <th>Necesidad</th>
                    <th>Centro balance</th>
                    <th>Importe</th>
                ';
        foreach ($arrayEtiquetas as $ind => $etiq) {
            $tabla .= '<th>' . $etiq['etiqueta'] . '</th>';
        }
        $tabla .= ' </tr> ';
        for ($i = 0; $i < count($datos); $i++) {
            $numeropieza = $datos[$i]['numeropieza'] ? $datos[$i]['numeropieza'] : 0;
            $asociado = ($datos[$i]['idplanificacionnae']) ? 'Si' : 'No';
            $unidadmedida = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(
                    Array($datos[$i]['idumedida'])
            );
            $unidadmedida = $unidadmedida->abreviatura;

            $tabla
                    .= '<tr>
                                        <td>' . $datos[$i]['codigo'] . '</td>
                                        <td>' . $numeropieza . '</td>
                                        <td>' . $datos[$i]['denominacion'] .
                    '</td>
										<td>' . $asociado . '</td>
                                        <td>' . $unidadmedida . '</td>
                                        <td>' . $datos[$i]['precio'] . '</td>
                                        <td>' . $datos[$i]['cantidad'] . '</td>
                                        <td>' . $datos[$i]['denocentrobalance']
                    .
                    '</td>
                                        <td>' . $datos[$i]['importe'] . '</td>
                                    ';
            foreach ($arrayEtiquetas as $ind => $etiq) {
                $tabla .= ' <td>' . $datos[$i]['deno_' . $etiq['denominacion']]
                        . '</td>';
            }
        }
        $tabla
                .= ' </tr>
            </tbody>
        </table>';

        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=planes.xls");
        header("Content-Transfer-Encoding: binary ");

        echo $tabla;
    }

    public function cargarClasifPlanesAction() {
        $parametros = array();
        $parametros['nodo'] = $this->_request->getPost('iddatosnomenclador');
        $parametros['uri'] = $this->_request->getPost('uri');
        $parametros['ruta'] = $this->_request->getPost('ruta');

        $objPlan = new DatPlanModel();

        $datos = $objPlan->listarArbolTipoPlanes($parametros);

        echo json_encode($datos);
    }

    public function listarNAEOGRFAction() {
        $parametros = array();
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['identidadmodelo'] = $this->_request->getPost(
                'identidadmodelo'
        );
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['filtros'] = json_decode(
                stripslashes($this->_request->getPost('filtros'))
        );
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['ajustar'] = $this->_request->getPost('hoja');
        $datos = $this->buscarPresupuestos($parametros);
        echo json_encode($datos);
    }

    private function buscarPresupuestos($parametros) {
        if (!$parametros['start']) {
            $parametros['start'] = 0;
        }

        if (!$parametros['limit']) {
            $parametros['limit'] = 20;
        }

        if ($parametros['ajustar'] == 'false') {

            $parametros['arryhijos'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $parametros['identidad']
            );
            array_push($parametros['arryhijos'], $parametros['identidad']);
        }

        $objPlan = new DatPlanModel();
        $tipomod = new NomTipomodelo();
        $tipomodelo = $tipomod->ObtenerIdTipoModelo($parametros['idmodelo']);
        //OBTIENE UN OBJETO ACTIVE RECORD CON TODA LA INFORMACION DE ESA TABLA PARA
        // TRABAJAR Y HACER MAS CONSULTAS CON ELLA
        $parametros['x'] = $this->_meta->Metadata()->obtenerInfoTabla(
                $tipomodelo[0]['idtabla']
        );
        $data = $objPlan->listarAsociados($parametros);
        // $parametros['x'] = $this->_meta->Metadata()->obtenerInfoTabla($tipomodelo[0]['idtabla']);
        //$data->total = $objPlan->listarTotalAsociados($parametros);
        $data->tipomodelo = $tipomodelo;
        return $data;
    }

    /* private function buscarPresupuestosExportar($parametros)
      {
      $parametros['start'] = 0;
      $parametros['limit'] = 1000000;

      $objPlan = new DatPlanModel();

      return $objPlan->listarAsociadosExportar($parametros);
      } */

    public function exportarDemandaAction() {
        ini_set(
                "max_execution_time", 3600
        ); //ampliar el tiempo de la conexion: 600seg (10min)  3600 = 1 horas
        $params['filtros'] = json_decode(
                stripslashes($this->_request->getParam('filtros'))
        );
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['idcb'] = $this->_request->getParam('identiCB');
        $params['start'] = 0;
        $params['limit'] = 100000;
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $especialidades = $this->nomenclador->selectParam(
                'nom_especialidad', array('idespecialidad',
            'denespecialidad')
        );

        foreach ($especialidades as $key => $valorEsp) {
            unset($especialidades[$key]);
            $especialidades['idesp' . $valorEsp['idespecialidad']] = $valorEsp['denespecialidad'];
        }
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=planes.xls");
        header("Content-Transfer-Encoding: utf8_decode ");
        $tabla = '<table border="1">
            <tbody>
                <tr>
                    <th>Especialidad</th>
                    <th>Entidad</th>
                    <th>Plan</th>
                    <th>Codigo</th>
                    <th>Nro Pieza</th>
                    <th>Denominacion</th>
                    <th>Cantidad</th>
                    <th>Importe</th>
                </tr>';

        $cant = DatPlanificacion::cantIndXCB($params);


        $cantxpag = 10000;
        $cantpag = (int) ($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        $offset = 0; //start
        $paso = $cantxpag; //limit
        for ($i = 0; $i < $cantpag; $i++) {
            $params['start'] = $offset;
            $params['limit'] = $paso;
            $datos = DatPlanificacionModel::listarIndXCBDemanda($params);
            $offset += $paso;
            foreach ($datos->data as $key => $valor) {
                $tabla
                        .= '<tr>
                                <td>' . $valor['denomentidadpadre'] . '</td>
                                <td>' . $valor['denominacionenti'] . '</td>
                                <td>' . $valor['denominacionmodelo'] . '</td>
                                <td>' . $valor['codigo'] . '</td>
                                <td>' . $valor['numeropieza'] . '</td>
                                <td>' . $valor['denominacionind'] . '</td>
                                <td>' . $valor['necesidad'] . '</td>
                                <td>' . $valor['importe'] . '</td>
                           </tr>';
            }
        }

        $tabla
                .= '
            </tbody>
        </table>';
        echo $tabla;
    }

    public function actualizarBalanceAction() {
        ini_set(
                "max_execution_time", 7200
        ); //ampliar el tiempo de la conexion: 600seg (10min)  7200 = 2 horas
        $parametros = array();
        $parametros['paso'] = $this->_request->getPost('paso');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['identidadmodelo'] = $this->_request->getPost(
                'identidadmodelo'
        );
        $parametros['idmodelo'] = $this->_request->getPost('idmodelo');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 1;

        $datos = DatPlanModel::actualizarDatosBalance($parametros);
        $cod = 3;
        switch ($parametros['paso']) {
            case '1':
                if ($datos[0]['f_actualizarbalancematerial'] == 1) {
                    $cod = 10;
                }
                break;
            case '2':
                if ($datos[0]['f_actualizarodpadre'] == 1) {
                    $cod = 10;
                }
                break;
            case '3':
                if ($datos[0]['f_actualizarcb'] == 1) {
                    $cod = 10;
                }
                break;
            default: {
                    $cod = 3;
                }
        }
        echo json_encode(array('cod' => $cod));
    }

    public function actualizarBalancePorEntidadAction() {
        ini_set(
                "max_execution_time", 36000
        ); //ampliar el tiempo de la conexion: 36000=10horas (extremo)
        $params = array();
        $params['paso'] = $this->_request->getPost('paso');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['eshoja'] = $this->_request->getPost('eshoja');

        $params['arrayhijos'] = array();
        if ($params['eshoja'] == 'false') {
            $params['arrayhijos'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            $params['identidad']
            );
        } else {
            $params['arrayhijos'][] = $params['identidad'];
        }

        $datos = DatPlanModel::actualizarDatosBalancePorEntidad($params);
        $codMsg = 10;
        switch ($params['paso']) {
            case '1':
                if ($datos[0]['f_actualizartodobalancematerialod_entidad'] == 1
                ) {
                    $codMsg = 10;
                }
                break;
            case '2':
                break;
            case '3':
                break;
            default: {
                    $codMsg = 3;
                }
        }
        echo json_encode(array('codMsg' => $codMsg));
    }

    public function getEjerciciosAction() {

        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
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

        //  $modelActEnt = new DatActividadentidadModel();
        $j = DatDocumentoaprobacioModel::gestPermisos($params);

        echo json_encode($j);
    }

    public function listarTiposComentariosAction() {
        $dat->data = NomTipocomentario::getTiposComentariosCombo();
        echo json_encode($dat);
    }

    public function cargarImporteInicialAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidadmodelo'] = $this->_request->getParam(
                'identidadmodelo'
        );

        $parametros['arrayidplanificacion'] = json_decode(
                stripslashes(
                        $this->_request->getParam('arrayidplanificacion')
                )
        );

        $modelGesPlanes = new DatPlanModel();
        $resultado = $modelGesPlanes->cargarImporteInicial($parametros);
        $resultadoDos = number_format($resultado, '3', '.', ',');
        echo json_encode(
                array('importe' => $resultado, 'importeformato' => $resultadoDos)
        );
    }

    public function calcularAjusteAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidadmodelo'] = $this->_request->getParam(
                'identidadmodelo'
        );
        $parametros['porciento'] = $this->_request->getParam('porciento');
        $parametros['arrayidplanificacion'] = json_decode(
                stripslashes(
                        $this->_request->getParam('arrayidplanificacion')
                )
        );
        $modelGesPlanes = new DatPlanModel();
        $resultado = $modelGesPlanes->calcularAjuste($parametros);
        $resultadoDos = number_format($resultado, '3', '.', ',');
        echo json_encode(
                array('importe' => $resultado, 'importeformato' => $resultadoDos)
        );
    }

    public function insertarAjusteAction() {
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['identidadmodelo'] = $this->_request->getParam(
                'identidadmodelo'
        );
        $parametros['porciento'] = $this->_request->getParam('porciento');
        $parametros['arrayidplanificacion'] = json_decode(
                stripslashes(
                        $this->_request->getParam('arrayidplanificacion')
                )
        );
        $modelGesPlanes = new DatPlanModel();
        $resultado = $modelGesPlanes->insertarAjuste($parametros);
        echo $resultado;
    }

    //importar datos al plan segun tipo de modelo
    function importarficheroAction() {

        //obteniendo parametro
        $idtipomodelo = $this->_request->getPost('idtipomodelo');

        //buscando listado de columnas dinamicas segun Tipo de Modelo
        $coldinam = NomTipomodelocolumna::ListarColumnasImportarPlan($idtipomodelo);

        //creando el arreglo de las columnas fijas
        $colfijas = array();
        $colfijas[0][0] = "Código";
        $colfijas[0][1] = "Cadena de caracteres";
        $colfijas[0][2] = 0;
        $colfijas[0][3] = 0;
        $colfijas[0][4] = 0;
        $colfijas[1][0] = "Cantidad";
        $colfijas[1][1] = "Numérico";
        $colfijas[1][2] = 1;
        $colfijas[1][3] = 1;
        $colfijas[1][4] = 1;
        $colfijas[2][0] = "Ajuste";
        $colfijas[2][1] = "Numérico";
        $colfijas[2][2] = 2;
        $colfijas[2][3] = 2;
        $colfijas[2][4] = 2;
        $colfijas[3][0] = "Aprobado";
        $colfijas[3][1] = "Cadena de caracteres";
        $colfijas[3][2] = 3;
        $colfijas[3][3] = 3;
        $colfijas[3][4] = 3;

        //obteniendo arreglo con todas las columnas
        $columnas = array_merge($colfijas, $coldinam);

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
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarplanxls" . $idusuario);

        //creando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importarplanxls" . $idusuario . " (xls TEXT) WITH (oids = false)");

        //almacenando los datos en la BD para usarlos en la próxima petición
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importarplanxls" . $idusuario . "(xls) VALUES ('" . $datos . "')");

        echo json_encode(
                array('columnas' => $columnas, 'columnasExcel' => $columnasExcel, 'columnasdinamicas' => $coldinam)
        );
    }

    //validar datos a importar al plan segun tipo de modelo
    function importarDatosRelacionadosAction() {

        //obteniendo los parametros
        $relaciones = json_decode(stripslashes($this->_request->getParam('relaciones')));
        $coldin = json_decode(stripslashes($this->_request->getParam('coldin')));
        $identidadmodelo = $this->_request->getPost('identidadmodelo');
        $idejercicio = $this->_request->getPost('idejercicio');
        $tipoplan = $this->_request->getPost('tipoplan');
        $idtipomodelo = $this->_request->getPost('idtipomodelo');

        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //buscando nombre_tabla segun Tipo de Modelo
        $nombreTabla = NomTipomodelocolumna::ListarNombreTabla($idtipomodelo);

        //eliminando tabla temporal dinánica
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_tipomodelo" . $idusuario);

        //obteniendo los datos del excel guardados en BD en la petición anterior(importarfichero)
        $query = "SELECT  xls FROM  mod_planifimportacion.temp_importarplanxls" . $idusuario;
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $datos = unserialize($result[0]);

        //preparando datos para crear tabla dinamica
        //en esta variable se guarda, de las columnas segun tipo de modelo,
        //la posicion de su columna correspondiente en el excel
        $posiciones = array();

        //en esta variable se guardan los campos y tipos de datos
        //con que se creara la tabla
        $cadenacampos = "";

        //en esta variable temporal se guardan las denominaciones
        //de las columnas sin caracteres especiales
        $tempDenomCol = "";


        foreach ($relaciones as $rel) {
            if ($rel->denomcolumna == "Código") {
                $posiciones['codigo'] = $rel->posicion;
                continue;
            } else {
                if ($rel->denomcolumna == "Cantidad") {
                    $posiciones['cantidad'] = $rel->posicion;
                    continue;
                } else {
                    if ($rel->denomcolumna == "Ajuste") {
                        $posiciones['ajuste'] = $rel->posicion;
                        continue;
                    } else {
                        if ($rel->denomcolumna == "Aprobado") {
                            $posiciones['aprobado'] = $rel->posicion;
                            continue;
                        }
                        //aqui solo entraria si es una columna dinamica
                        else {
                            $tempDenomCol = self::modificarCaracteresEspeciales($rel->denomcolumna);
                            $posiciones[$tempDenomCol] = $rel->posicion;
                            if ($rel->denomtipocolumna == "Nomenclador") {
                                $cadenacampos.=" " . $tempDenomCol . "id" . " NUMERIC(19,0),";
                                $cadenacampos.=" " . $tempDenomCol . " VARCHAR(255),";
                            } else {
                                $cadenacampos.=" " . $tempDenomCol . " $rel->nombre,";
                            }
                        }
                    }
                }
            }
        }

        //creando tabla temporal dinamica
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_tipomodelo" . $idusuario . " (
          idtabla serial,
          codigo VARCHAR(255) NOT NULL,
          idindicador NUMERIC(19,0),
          identidadmodelo NUMERIC(19,0),
          idejercicio NUMERIC(19,0) NOT NULL,
          precio NUMERIC(19,6)  DEFAULT 0 NOT NULL,
          idunidadmedida NUMERIC(19,0),
          idcentrobalance NUMERIC(19,0),
          cantidad NUMERIC(19,6) DEFAULT 0 NOT NULL,
          idaprobaciondemanda NUMERIC(19,0) DEFAULT 1 NOT NULL,
          preciodivisa NUMERIC(19,6) DEFAULT 0 NOT NULL,
          ajuste NUMERIC(19,6) DEFAULT 0 NOT NULL,
          centrosbalance VARCHAR,
          viasadquisicion VARCHAR,
          organossatisface VARCHAR, $cadenacampos
          iddatosnomenclador NUMERIC(19,0))");

        //variable que guarda la denominacion de los campos dinamicos
        $denomcampos = $coldin[0][2];

        //variable que guarda la denominacion de las columnas dinamicas
        //y su tipo de dato
        $denomcid = "";
        $denomc = "";
        $tipofilc = "";

        //en esta variable se guardan los campos
        //con que se insertara en la tabla
        $cadenacamposUpdate = "";

        //en esta variable se guardan el array de idaprobaciones
        $aprobaciones = NomAprobacion::getIdAprob();

        foreach ($datos as $j => $row) {

            //ignorando los datos del encabezado de la tabla
            if ($j == 0) {
                continue;
            }

            //dando valor al codigo si viene vacio
            if ($row[$posiciones['codigo']]) {
                $codigo = utf8_encode($row[$posiciones['codigo']]);
            } else {
                $codigo = "-";
            }

            //dando valor a la aprobación si viene vacio o incorrecto
            $idaprobaciondemanda = self::getAprobacion(utf8_encode($row[$posiciones['aprobado']]), $aprobaciones);

            //dando valor a la cantidad si viene un dato incorrecto o vacio
            $cantidad = 0.0;
            if ($row[$posiciones['cantidad']]) {
                $cant = self::validarNumericPositivo($row[$posiciones['cantidad']]);
                if ($cant != 'no')
                    $cantidad = $cant;
            }

            //dando valor al ajuste si viene un dato incorrecto o vacio
            $ajuste = 0.0;
            if ($row[$posiciones['ajuste']]) {
                $ajus = self::validarNumeric($row[$posiciones['ajuste']]);
                if ($ajus != 'no')
                    $ajuste = $ajus;
            }
            //variable que guarda los datos dinamicos
            //a insertar en la tabla temporal
            $dina = "";

            //variable para controlar el iddatosnom
            //a insertar en la tabla temporal
            $booldatonom = 2;

            //en esta variable temporal se guardan las denominaciones
            //de las columnas sin caracteres especiales
            $tempDenomCol = "";
            //en esta variable temporal se guardan los tipos
            //de las columnas sin caracteres especiales
            $tempTipoCol = "";
            //en esta variable temporal se guardan las denominaciones
            //de los campos sin caracteres especiales
            $tempDenomCampo = "";

            foreach ($coldin as $i => $value) {
                $tempDenomCol = self::modificarCaracteresEspeciales($value[0]);
                $tempTipoCol = self::modificarCaracteresEspeciales($value[1]);
                $tempDenomCampo = self::modificarCaracteresEspeciales($value[3]);

                if ($j == 1) {
                    if ($i != 0) {
                        $denomcampos.="," . $value[2];
                    }
                    $cadenacamposUpdate.=" " . $tempDenomCol . ",";
                }

                //dando valor a la fecha si viene un dato incorrecto o vacio
                if ($tempDenomCampo == "date") {
                    $fecha = Date('d/m/Y');
                    if ($row[$posiciones[$tempDenomCol]]) {
                        //saber si es una fecha
                        $fech_arr = explode('/', $row[$posiciones[$tempDenomCol]]);
                        if (count($fech_arr) == 3) {
                            if ($fech_arr[0] && $fech_arr[1] && $fech_arr[2]) {
                                if (checkdate($fech_arr[1], $fech_arr[0], $fech_arr[2])) {
                                    $fecha = utf8_encode($row[$posiciones[$tempDenomCol]]);
                                }
                            }
                        }
                    }
                    $dina.=" '" . $fecha . "',";
                }

                //dando valor al numerico si viene un dato incorrecto o vacio
                if ($tempDenomCampo == "numeric" && $value[1] != "Nomenclador") {
                    $num = 0.0;
                    if ($row[$posiciones[$tempDenomCol]]) {
                        $n = self::validarNumeric($row[$posiciones[$tempDenomCol]]);
                        if ($n != 'no')
                            $num = $n;
                    }
                    $dina.=" " . $num . ",";
                }

                //dando valor al string si viene un dato incorrecto o vacio
                if ($tempDenomCampo == "varchar" && $value[1] != "Nomenclador") {
                    if ($row[$posiciones[$tempDenomCol]]) {
                        $dina.=" '" . utf8_encode($row[$posiciones[$tempDenomCol]]) . "',";
                    } else {
                        $dina.= "'-',";
                    }
                }

                //dando valor al nomenclador si viene un dato incorrecto o vacio
                if ($value[1] == "Nomenclador") {
                    $nom = "-";
                    if ($row[$posiciones[$tempDenomCol]])
                        $nom = utf8_encode($row[$posiciones[$tempDenomCol]]);
                    $dina.=" '" . $nom . "',";
                }

                if ($value[1] == "Nomenclador") {
                    if ($j == 1) {
                        $denomc[] = $tempDenomCol;
                        if ($value[1] == "Nomenclador")
                            $tipofilc[] = "string";
                        else {
                            if ($tempDenomCampo == "varchar")
                                $tipofilc[] = "string";
                            else {
                                $tipofilc[] = $tempDenomCampo;
                            }
                        }
                        if ($i != 0) {
                            $denomcid.="," . $tempDenomCol . "id" . "-" . $tempTipoCol;
                        } else {
                            $denomcid.=$tempDenomCol . "id" . "-" . $tempTipoCol;
                        }
                        $cadenacamposUpdate.=" " . $tempDenomCol . "id,";
                    }

                    //validando columnas dinamicas nomencladas
                    $d = NomDatosnomenclador::getIddatosnom($nom, str_replace("n", "", $value[2]));
                    if ($d[0]) {
                        $dina.=$d[0][0] . ",";
                    } else {
                        $dina.=0 . ",";
                        $booldatonom = 3;
                    }
                } else {
                    if ($j == 1) {
                        $denomc[] = $tempDenomCol;
                        if ($value[1] == "Nomenclador")
                            $tipofilc[] = "string";
                        else {
                            if ($tempDenomCampo == "varchar")
                                $tipofilc[] = "string";
                            else {
                                $tipofilc[] = $tempDenomCampo;
                            }
                        }
                        if ($i != 0) {
                            $denomcid.="," . $tempDenomCol . "-" . $tempDenomCampo;
                        } else {
                            $denomcid.=$tempDenomCol . "-" . $tempDenomCampo;
                        }
                    }
                }
            }

            if ($booldatonom == 2) {
                $iddatonomenclador = 312;
            } else
                $iddatonomenclador = 1086;

            //insertando los datos en la tabla temporal
            $conn->execute("INSERT INTO mod_planifimportacion.temp_tipomodelo" . $idusuario . "
                        (
                          codigo,
                          identidadmodelo,
                          idejercicio,
                          cantidad,
                          idaprobaciondemanda,
                          $cadenacamposUpdate
                          ajuste,
                          iddatosnomenclador
                        )
                        VALUES (
                          '$codigo',
                          $identidadmodelo,
                          $idejercicio,
                          $cantidad,
                          $idaprobaciondemanda,
                          $dina
                          $ajuste,
                          $iddatonomenclador
                        )");
        }

        //ejecutando funcion de BD que valida todos los datos excepto los dinamicos
        $paramsQuery = array($tipoplan, $idusuario);
        $query = "select * from mod_planifimportacion.f_importarplanificacionxls(?,?);";
        $result = $conn->execute($query, $paramsQuery);
        $result->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(
                array('tabla' => $nombreTabla[0], 'campos' => $denomcampos, 'columnasdinamicas' => $denomcid, 'columnasdinamicasindex' => $denomc, 'tipofilc' => $tipofilc)
        );
    }

    //listar datos validados a importar al plan segun tipo de modelo
    function listarDatosValidadosAction() {
        $coldin = json_decode(stripslashes($this->_request->getParam('coldin')));
        if ($coldin[0]) {
            $coldin = implode(',', $coldin);
            $coldin = ", " . $coldin;
        } else {
            $coldin = "";
        }
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        $start = $this->_request->getParam('start');
        $limit = $this->_request->getParam('limit');
        $filtros = $this->_request->getPost('filtros');
        $addWhere = "where true";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere.= " and codigo like '%" . $datos['data']['value'] . "%'";
                } else {
                    if ($datos['field'] == 'cantidad' || $datos['field'] == 'ajuste') {
                        $cond = "=";
                        if ($datos['data']['comparison'] == "gt") {
                            $cond = ">";
                        } elseif ($datos['data']['comparison'] == "lt") {
                            $cond = "<";
                        }
                        if ($datos['field'] == 'cantidad') {
                            $addWhere.= " and cantidad" . $cond . $datos['data']['value'];
                        } else {
                            $addWhere.= " and ajuste" . $cond . $datos['data']['value'];
                        }
                    } else {
                        if ($datos['field'] == 'idaprobaciondemanda') {
                            if ($datos['data']['value'] == "Sí") {
                                $idapr = 3;
                            } elseif ($datos['data']['value'] == "No") {
                                $idapr = 1;
                            } elseif ($datos['data']['value'] == "Rector") {
                                $idapr = 4;
                            } elseif ($datos['data']['value'] == "Ajuste") {
                                $idapr = 5;
                            }
                            $addWhere.= " and idaprobaciondemanda =" . $idapr;
                        } else {
                            if ($datos['data']['type'] == 'numeric') {
                                $cond = "=";
                                if ($datos['data']['comparison'] == "gt") {
                                    $cond = ">";
                                } elseif ($datos['data']['comparison'] == "lt") {
                                    $cond = "<";
                                }
                                $addWhere.= " and " . $datos['field'] . "" . $cond . $datos['data']['value'];
                            } else {
                                if ($datos['data']['type'] == 'string') {
                                    $addWhere.= " and upper(" . $datos['field'] . ") like '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                                } else {
                                    if ($datos['data']['type'] == 'date') {
                                        $value = split('/', $datos['data']['value']);
                                        $value = "'" . $value [1] . '/' . $value [0] . '/' . $value [2] . "'";
                                        $cond = "=";
                                        if ($datos['data']['comparison'] == "gt") {
                                            $cond = ">";
                                        } elseif ($datos['data']['comparison'] == "lt") {
                                            $cond = "<";
                                        }
                                        $addWhere.= " and " . $datos['field'] . "" . $cond . $value;
                                    } else {
                                        die;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT idtabla, codigo, cantidad, ajuste, idaprobaciondemanda, dn.denominacion as denominaciondato $coldin
FROM mod_planifimportacion.temp_tipomodelo" . $idusuario . " tm
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = tm.iddatosnomenclador)
      $addWhere    OFFSET $start LIMIT $limit";
        $data->data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $query = "SELECT count(tm.idtabla)
FROM mod_planifimportacion.temp_tipomodelo" . $idusuario . " tm
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = tm.iddatosnomenclador)
     $addWhere";
        $data->total = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $data->total = $data->total[0];
        echo json_encode($data);
    }

    //inserta todos los datos validados correctamente
    function insertarDatosImportarAction() {
        //obteniendo los parametros
        $tabla = $this->_request->getParam('tabla');
        $columnasdinamicas = $this->_request->getParam('columnasdinamicas');
        $campos = $this->_request->getParam('campos');

        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //ejecutando funcion de BD que inserta todos los datos validados correctamente
        $conn = Doctrine_Manager::connection();
        $paramsQuery = array($tabla, $campos, $columnasdinamicas, $idusuario);
        $query = "select * from mod_planifimportacion.f_importarplanificacioninsertar(?,?,?,?);";
        $result = $conn->execute($query, $paramsQuery);
        $result->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(1);
    }

    public static function modificarCaracteresEspeciales($url) {
        $url = strtolower($url);
        //Reemplazamos caracteres especiales latinos
        $find = array('á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'î', 'ô', 'û', 'ã', 'õ', 'ç', 'ñ');
        $repl = array('a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u', 'a', 'o', 'c', 'n');
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

    private function getAprobacion($val, $aprobaciones) {
        if ($val != null) {
            if ($val == 'Si' || $val == 'Sí' || $val == 'sí' || $val == 'si' || $val == 'SI' || $val == 'SÍ' || $val == 'Aprobado' || $val == 'APROBADO'
            ) {
                if ($aprobaciones['Aprobado'])
                    return $aprobaciones['Aprobado'];
            }if ($val == 'Rector' || $val == 'rector' || $val == 'RECTOR'
            ) {
                if ($aprobaciones['AprobadoR'])
                    return $aprobaciones['AprobadoR'];
            }
            if ($val == 'Ajuste' || $val == 'ajuste' || $val == 'ajustado'
            ) {
                if ($aprobaciones['Aprobado Ajuste'])
                    return $aprobaciones['Aprobado Ajuste'];
            }
        }
        if ($aprobaciones['Elaboración'])
            return $aprobaciones['Elaboración'];
        else
            return 1;
    }

    private function validarNumeric($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor)) {
            return $valor;
        }
        return 'no';
    }

    private function validarNumericPositivo($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor) && $valor >= 0) {
            return $valor;
        }
        return 'no';
    }

    public function entidadODAction() {
        $identidad = $this->_request->getPost('identidad');
        $obj = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($identidad);
        if ($obj[0])
            echo json_encode(1);
        else
            echo json_encode(0);
    }

}
