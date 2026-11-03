<?php

/* aaaaaaaaaaaaaa
 * ActividadentidadnaeControler
 * Controlador para gestionar la asociacion de actividades a Niveles de
 * Actividad Economicos (NAE) del Presupuesto.
 *
 * @ author Pedro Enrique Rojas Aguilar
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID
 * @ version 2.0
 * */

class ActividadespresupuestoController extends ZendExt_Controller_Secure {
    /*     * fdfd
     * init
     * Inicializar el componente
     * */

    function init() {
        parent::init();
        1;
    }

    /**
     * actividadentidadnae
     * Renderizar la vista
     * */
    public function actividadespresupuestoAction() {
        $this->render();
    }

    /**
     * cargarEntidades
     * Lista la estructura de entidades de una entidad determinada .
     *
     * @param 'node'- identificador de la estructura padre seleccionada
     *
     * @return array, devuelve un listado con las entidades de la estructura.
     * */
    public function cargarEntidadesAction() {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $idEstructura = ($this->_request->getPost('node')) ? $this->_request->getPost('node') : 0;
        $dominios = $security->getDomain($idEstructura);
        $idEstructuraPadre = $this->_request->getPost('idEstructuraPadre');
        if ($idEstructuraPadre == 'undefined' && $idEstructura != '0') {
            $idEstructuraPadre = $idEstructura;
        }
        $result = array();
        foreach ($dominios as $key => $val) {
            $result[$key] = $val;
            $result[$key]['idEstructuraPadre'] = $idEstructuraPadre;
            $result[$key]['entidades_productoras'] = "";
        }
        echo json_encode($result);
    }

    /**
     * cargarPlanes
     * Lista los modelos de un plan de forma arborea.
     *
     * @param 'identidad'- identificador de la entidad
     *
     * @return array, devuelve un listado con los modelos de un plan.
     * */
    public function cargarPlanesAction() {
        $identidad = $this->_request->getPost('identidad');
        $isLeaf = $this->_request->getPost('is_leaf');
        if ($identidad != 'undefined') {
            $datosEntidad = $this->integrator->metadatos->DameEstructura(
                    $identidad
            );
            $idEspecialidad = $datosEntidad [0]->idespecialidad;
            unset($datosEntidad);
            $model = new DatActividadentidadnaeModel();
            if ($isLeaf == 'true') {
                $data = $model->getModeloAsocEntidadDemandados(
                        array($identidad), array($idEspecialidad)
                );
                echo json_encode($data);
            } else {
//                /* Consolidar importe de nivels de actividad demandados por las entidades de la agrupacion */
                $arrayEntidades = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $identidad
                );
                if ($arrayEntidades[0] != null) {
                    $idEspecialidades = array();
                    $tempEspecialidades = array();
                    foreach ($arrayEntidades as $valorIdentidad) {
                        $entidad = $this->integrator->metadatos->DameEstructura(
                                $valorIdentidad
                        );
                        $_idespecialidad = $entidad[0]->idespecialidad;
                        $tempEspecialidades["id_" . $_idespecialidad] = $_idespecialidad;
                    }
                    foreach ($tempEspecialidades as $valorIdesp) {
                        $idEspecialidades [] = $valorIdesp;
                    }
                    $data = $model->getModeloAsocEntidadDemandados(
                            $arrayEntidades, $idEspecialidades
                    );
                    echo json_encode($data);
                } else {
                    echo json_encode(array());
                }
            }
        } else {
            echo json_encode(array());
        }
    }

    /**
     * listarActividades
     * Lista las actividades demandadas por la especialidad.
     *
     * @param 'node'- identificador de la estructura padre seleccionada
     *
     * @return array, devuelve un listado con los modelos de un plan.
     * */
    public function listarActividadesAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['is_leaf'] = $this->_request->getPost('is_leaf');
        $params['idmodelo'] = $this->_request->getPost('idplan');
        $params ['start'] = $this->_request->getPost('start');
        $params ['limit'] = $this->_request->getPost('limit');
        $params ['filtros'] = $this->_request->getPost('filtros');
        $model = new DatActividadentidadnaeModel();
        $datosEntidad = $this->integrator->metadatos->DameEstructura(
                $params['identidad']
        );
        $params ['idespecialidad'] = $datosEntidad [0]->idespecialidad;
        echo json_encode($model->listar($params));
    }

    /**
     * listarNAE
     * Lista los niveles de actividad economica(NAE).
     *
     * @param 'start'- inicio del paginado
     * @param 'limit'- fin del paginado
     *
     * @return array, devuelve un listado de NAEs.
     * */
    public function listarNAEAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $filters = $this->_request->getPost('filtros');
        $naes = NomNae::obtenerNAE(null, $filters, $start, $limit);
        echo json_encode(array('data' => $naes));
    }

    /**
     * listarOG
     * Lista los objetos de gastos (OG).
     *
     * @param 'start'- inicio del paginado.
     * @param 'limit'- fin del paginado.
     *
     * @return array, devuelve un listado con los OG.
     * */
    public function listarOGAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $filters = $this->_request->getPost('filtros');
        $og = NomObjetogasto::obtenerOG(null, $start, $limit, $filters);
        echo json_encode(array('data' => $og));
    }

    /**
     * listarRF
     * Lista los recursos financieros.
     *
     * @param 'start'- inicio del paginado.
     * @param 'limit'- fin del paginado.
     *
     * @return array, devuelve un listado con los recursos financieros.
     * */
    public function listarRFAction() {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $filters = $this->_request->getPost('filtros');
        $rf = NomRecursofinanciero::obtenerRF($start, $limit, $filters);
        echo json_encode(array('data' => $rf));
    }

    /**
     * adicionarOG
     * Adiciona la asociacion de la Actividad con el NAE y el OG.
     *
     * @param 'actividades'- array de identificador de niveles de actividad
     * @param 'actividades'- identificador del NAE.
     * @param 'actividades'- identificador del OG.
     *
     * @return array, devuelve un código mensaje uno si la operación fue correcta.
     * */
    public function adicionarOGAction() {
        $params ['actividades'] = json_decode(
                stripslashes($this->_request->getPost('actividades'))
        );
        $params ['idnae'] = json_decode(
                stripslashes($this->_request->getPost('idnae'))
        );
        $params ['idog'] = $this->_request->getPost('idog');
        $model = new DatActividadentidadnaeModel();
        echo json_encode(
                array('codMsg' => $model->asociarNaeAOGoRF($params, true))
        );
    }

    /**
     * adicionarRFA
     * Adiciona la asociacion de la Actividad con el NAE y el RF.
     *
     * @param 'actividades'- array de identificador de niveles de actividad
     * @param 'actividades'- identificador del NAE.
     * @param 'actividades'- identificador del RF.
     *
     * @return array, devuelve un código mensaje uno si la operación fue correcta.
     * */
    public function adicionarRFAction() {
        $params ['actividades'] = json_decode(
                stripslashes($this->_request->getPost('actividades'))
        );
        $params ['idnae'] = $this->_request->getPost('idnae');
        $params ['idrf'] = $this->_request->getPost('idrf');
        $model = new DatActividadentidadnaeModel();
        echo json_encode(
                array('codMsg' => $model->asociarNaeAOGoRF($params, false))
        );
    }

    /**
     * desasociar
     * Adiciona la asociacion de la Actividad con el NAE y el RF.
     *
     * @param 'actividades'- array de identificador de asociaciones de niveles de actividad a NAE.
     *
     * @return array, devuelve un código mensaje uno si la operación fue correcta.
     * */
    public function desasociarAction() {
        $params ['idactividadentidadnae'] = json_decode(
                stripslashes($this->_request->getPost('actividades'))
        );
        $model = new DatActividadentidadnaeModel();
        echo json_encode(
                array('codMsg' => $model->desasociarNaeAOGoRF($params))
        );
    }

    /**
     * listarEspecialidades
     * Lista el nomenclador de especialidades.
     *
     * @return array, devuelve un listado con las especialidades.
     * */
    public function listarEspecialidadesAction() {
        $this->nomenclador = new ZendExt_Nomencladores_ADT();
        $especialidades = $this->nomenclador->selectParam(
                'nom_especialidad', array('idespecialidad', 'denespecialidad')
        );
        $idespLogueada = ZendExt_GlobalConcept::getInstance(
                )->Estructura->idespecialidad;
        foreach ($especialidades as $indice => $valor) {
            $especialidades[$indice]['logueada'] = ($valor['idespecialidad'] != $idespLogueada) ? false : true;
        }
        echo json_encode(array('data' => $especialidades));
    }

}
