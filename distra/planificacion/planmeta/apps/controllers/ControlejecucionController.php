<?php

/**
 * Recuperaciones para planificacion
 * Controlador para el control del a ejecucion
 *
 * @ author Javier Lamas Collejo
 * @ package Planificación
 * @ subpackage Planificacion material
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class ControlejecucionController extends ZendExt_Controller_Secure
{

    /**
     * funcion init()
     * Para inicializar el modulo
     * */
    function init()
    {
        parent::init();
    }

    public function controlejecucionAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarEntidadesAction()
    {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $idEstructura = ($this->_request->getPost('node'))
            ? $this->_request->getPost('node') : 0;
        $dominios = $security->getDomain($idEstructura);
        $denominacion = ($this->_request->getPost('valor'))
            ? $this->_request->getPost('valor') : null;

        if ($denominacion != null) {
            foreach ($dominios as $key => $value) {
                if (stristr($value['text'], $denominacion) == false) {
                    unset($dominios[$key]);
                }
            }
        }
        $result = array();
        $i = 0;
        foreach ($dominios as $key => $val) {
            $result[$i++] = $val;
        }
        echo json_encode($result);
    }

    public function listarActividadesAction()
    {
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['leaf'] = $this->_request->getPost('is_leaf');
        if ($params['leaf'] == 'false' && $params['identidad'] != null) {
            $security = ZendExt_Aspect_Security_Sgis::getInstance();
            $modeloActEnt = new DatActividadentidad();
            $params['identidad']
                = DatActividadentidad::auxObtenerEntidadesHijasComun(
                    $params['identidad']
                );
        }
        $modeloAct = new DatActividadentidadModel();
        echo json_encode(
            $modeloAct->listarActividadesporEntidad($params)
        );
    }

    public function listarnNivelesporActividadAction()
    {
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $integrator = $this->integrator;
        $modeloAct = new DatActividadentidadModel();
        echo json_encode(
            $modeloAct->listarnNivelesporActividad(
                $params, $integrator
            )
        );
    }

    public function adicionarNivelActividadporFecharealAction()
    {
        $params['filas'] = json_decode(
            stripslashes($this->_request->getPost('filas_nuevas'))
        );
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idusuario'] = $this->_request->getPost('usuario');
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idusuario'] = $this->_request->getPost('idusuario');
        $modeloAct = new DatActividadentidadModel();
        $codMsg = $modeloAct->adicionarNivelActividadporFechareal(
            $params
        );
        echo json_encode(array('codMsg' => $codMsg));
    }

    public function eliminarNivelActividadporFecharealAction()
    {
        $params['idnivelactividadporfechareal'] = json_decode(
            stripslashes(
                $this->_request->getPost('idnivelactividadporfechareal')
            )
        );
        $modeloAct = new DatActividadentidadModel();
        echo json_encode(
            $modeloAct->eliminarNivelActividadporFechareal(
                $params
            )
        );
    }

    public function userLogeadoAction()
    {
        $perfil['idusuario'] = $this->global->Perfil->idusuario;
        $perfil['usuario'] = $this->global->Perfil->usuario;
        echo json_encode(
            array('idusuario' => $perfil['idusuario'],
                  'usuario'   => $perfil['usuario'])
        );
    }

    public function estadoActividadAction()
    {
        $params['idnivelactividadporfechareal'] = $this->_request->getPost(
            'idnivelactividadporfechareal'
        );
        $params['idactividadentidad'] = $this->_request->getPost(
            'idactividadentidad'
        );
        $params['fin'] = $this->_request->getPost('fin');
        echo json_encode(
            DatNivelactividadporfecharealModel::estadoActividad($params)
        );
    }

    public function cargarUsuariosAction()
    {
        $modeloActEnt = new DatActividadentidad();
        $idusuarios = DatActividadentidad::ObtenerIdUsuarios();

        foreach ($idusuarios as $value) {
            $ids[] = $value['idusuario'];
        }
        $nomusuarios = $this->integrator->seguridad->obtenerNombresUsuarios(
            $ids
        );
        echo json_encode(array('data' => $nomusuarios));
    }

}
