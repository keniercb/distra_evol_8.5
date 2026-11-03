<?php

/**
 * ControlejecucionnivelesactController
 * Controlador para gestionar el control de la ejecucion de los niveles de actividad.
 *
 * @ author Yosniel
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID
 * @ version 2.0
 * */
class ControlejecucionnivelesactController extends ZendExt_Controller_Secure
{

    /**
     * init
     * Inicializar el componente
     * */
    function init()
    {
        parent::init();
    }
//aki va el metodo para el listar de Niveles de Actividad (q es el mismo listar del componente Niveles de Actividad)
    function listarNivelesAction()
    {
        ini_set("max_execution_time", 600);
        $params = array();
        $params['esrector'] = $this->_request->getPost('esrector');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['columnasamostrar'] = json_decode(
            stripslashes($this->_request->getPost('columnsToShow'))
        );

        $params['idmodelo'] = $this->_request->getPost('idmodelo');
        $params ['idaprobacion_actividad'] = array(3, 4);
        $params ['idEstructuraPadre'] = $this->_request->getPost(
            'idEstructuraPadre'
        );
        $params ['calcularrestoxdistrib'] = $this->_request->getPost(
            'calcularrestoxdistrib'
        );
        $global = ZendExt_GlobalConcept::getInstance();
        if ($this->_request->getPost('idespecialidad') != '') {
            $params['idespecialidad'] = $this->_request->getPost(
                'idespecialidad'
            );
        } else {
            $params['idespecialidad'] = $global->Estructura->idespecialidad;
        }

        $params['identidad'] = $this->_request->getPost('identidad');
        if ($params ['idEstructuraPadre'] == 'undefined') {
            $params ['idEstructuraPadre'] = $params['identidad'];
        }
        /* aki se guarda si se manda o no a calcular el importe */
        $params ['calcularimporte'] = $this->_request->getPost(
            'calcularimporte'
        );
        $isLeaf = $this->_request->getPost('is_leaf');
        if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0'
        ) {

            $arrayResFormatoUltimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();

            $params ['nivel'] = $arrayResFormatoUltimonivel[1];

            if ($this->_request->getPost('codigo') != '') {
                $params ['codigo'] = $this->_request->getPost('codigo');
            }
            if ($this->_request->getPost('denominacion') != '') {
                $params ['denominacion'] = $this->_request->getPost(
                    'denominacion'
                );
            }
            if ($this->_request->getPost('calcularimporte') != '') {
                $params ['calcularimporte'] = $this->_request->getPost(
                    'calcularimporte'
                );
            }
            if ($this->_request->getPost('idaprobacion') != '') {
                $params ['idaprobacion'] = $this->_request->getPost(
                    'idaprobacion'
                );
            }

            $params['filtros'] = $this->_request->getPost('filtros');
            $params['start'] = $this->_request->getPost('start');
            $params['limit'] = $this->_request->getPost('limit');

            $modelActEnt = new DatActividadentidadModel();
            $params['entidades_productoras'] = array('-1');
            if ($params ['calcularrestoxdistrib'] == 'true') {
                $modeloActEnt = new DatActividadentidad();
                $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                    $params ['idEstructuraPadre']
                );
            }

            if ($this->_request->getPost('glob') == 'false') {
                $params['identidad'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($params['identidad']);


                if ($params['identidad'][0] == null || $params['identidad'][0] == '' || !$params['identidad'][0]) {
                    $data->data = array();
                    $data->data[0]['idactividadentidad']=-1;
                    echo json_encode($data);
                } else {
                    $params['identidad'] =$params['identidad'][0];
                    $params['entidades'] = array('0' => $params['identidad']);
                    $datosEntidad = $this->integrator->metadatos->DameEstructura(
                        $params['identidad']
                    );
                    $params['id_especialidades'] [] = $datosEntidad [0]->idespecialidad;
                    if ($params['esrector'] == 'true') {
                        $params['idespecialidad'] = $datosEntidad [0]->idespecialidad;
                    }
                    $result = $modelActEnt->listarActsNivActPorEntidad($params);
                    if ($result == -1) {
                        $data->data = array();
                        echo json_encode($data);
                    } else {
                        echo json_encode($result);
                    }
                }
            } else {
                /* Consolidar nivels de actividad */
                $idestructura = $this->integrator->metadatos->DameEstructura(
                    $params['identidad']
                );

                $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                    $idestructura[0]->idestructura
                );
                array_push($params['entidades'], $idestructura[0]->idestructura);

                $var = implode(',', $params['entidades']);
                $params['entidades'] = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);

                if ($params['entidades'] [0] != null) {
                    $params['id_especialidades'] = array();
                    foreach ($params['entidades'] as $key => $valorIdentidad) {
                        $tempEspecialidades = 0;
                        $entidades[] = $this->integrator->metadatos->DameEstructura(
                            $valorIdentidad
                        );
                        foreach ($params['id_especialidades'] as $esp) {
                            if ($esp == $entidades [$key][0]->idespecialidad) {
                                $tempEspecialidades = 1;
                            }
                        }
                        if ($tempEspecialidades == 0) {
                            $params['id_especialidades'] [] = $entidades [$key][0]->idespecialidad;
                        }
                    }

                    $result = $modelActEnt->listarActsNivActPorEntidad($params);
                    if ($result == -1) {
                        $data->data = array();
                        echo json_encode($data);
                    } else {
                        echo json_encode($result);
                    }
                } else {
                    $data->data = array();
                    $data->total = 0;
                    echo json_encode($data);
                }
            }
        } else {
            if ($params['identidad'] == '0' || $params['identidad'] == null) {

                $data->total = 0;
                echo json_encode($data);
            } else {
                echo json_encode(
                    array('codMsg' => 3,
                        'mensaje' => 'Su secci&oacute;n ha expirado, por favor reinicie el sistema. ')
                );
            }
        }

    }

    function listarControlesAction()
    {
        ini_set("max_execution_time", 600); //10min
        $params = array();
        $model = new ControlejecucionModel();
        echo json_encode($model->listarControles($params));
    }

    function listarAjusteAction()
    {
        ini_set("max_execution_time", 600); //10min
        $params = array();
        $model = new ControlejecucionModel();
        echo json_encode($model->listarAjuste($params));
    }

    public function listarNivelesAjustarAction()
    {
        ini_set("max_execution_time", 600); //10min
        $params = array();
        $model = new ControlejecucionModel();
        echo json_encode($model->listarNivelesAjustar($params));
    }

    public function controlejecucionnivelesactAction()
    {
        $this->render();
    }

    public function ListarEjerciciosAction()
    {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual
            = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }


    /**
     * actividadentidadnae
     * Renderizar la vista
     * */
}
