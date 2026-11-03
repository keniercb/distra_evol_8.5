<?php

/**
 * GestcartatecnologicaController
 * Controlador para gestionar las Cartas Tecnologicas
 *
 * @ author Damian Oscar Falcon Borras
 * @ package Planificaci?n
 * @ subpackage Planificaci?n Empresarial y Presupuestaria
 * @ copyright SPO-UAM
 * @ version 1.0-0
 * */
class DemandaproduccionController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar el componente
     * */
    public function init() {
        parent::init();
    }

    public function demandaproduccionAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargarEntidadesAction() {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $idEstructura = ($this->_request->getPost('node')) ? $this->_request->getPost('node') : 0;
        $dominios = $security->getDomain($idEstructura);
        echo json_encode($dominios);
    }

    //fin de la función cargarEntidades
    //lista todas las especilidades existentes en el nomenclador de especialidades
    public function listarEspecialidadesRectorAction() {
        $params ['idespecialidad'] = $this->_request->getPost('idespecialidad');
        $modeloDemanda = new DatDemandaproduccionModel();
        $idespecialidadesRectoreo = $modeloDemanda->listarIdEspecialidadesRectoreo(
                $params
        );
        if ($idespecialidadesRectoreo[0] != "") {
            $excluir = array(7, 8, 9, 10);
            $especialidades = $this->integrator->metadatos->DameHijosEstructura(
                    $idespecialidadesRectoreo[0], $excluir
            );
        }


        echo json_encode(array('data' => $especialidades));
    }

    public function listarEspecialidadesProductorAction() {
        $params ['idespecialidad'] = $this->_request->getPost('idespecialidad');
        $modeloDemanda = new DatDemandaproduccionModel();
        $idespecialidades = $modeloDemanda->listarIdEspecialidadesQueHanDemandado(
                $params
        );
        if ($idespecialidades[0] != "") {
            $excluir = array(7, 8, 9, 10);
            $idespecialidadesRectoreo = $this->integrator->metadatos->DameHijosEstructura(
                    $idespecialidades[0], $excluir
            );
        }
        echo json_encode(array('data' => $idespecialidadesRectoreo));
    }

    /*     * ****IU1 Demanda al rector **************************************************************** */

    public function listarActividadesRectoreadasAction() {
        $params ['start'] = $this->_request->getPost('start');
        $params ['limit'] = $this->_request->getPost('limit');
        $params ['idespecialidad'] = $this->_request->getPost('idespecialidad');
        $params ['idespecialidadrector'] = $this->_request->getPost(
                'idespecialidadrector'
        );
        $params ['superrector'] = $this->_request->getPost('superrector');
        $params ['filtros'] = $this->_request->getPost('filtros');
        $modeloDemanda = new DatDemandaproduccionModel();

        $res = $modeloDemanda->listarDemandaRector($params);
        echo json_encode($res);
    }

    /*     * ******IU2 Demanda del productor ************************************************************** */

    public function listarActividadesDemandadasAlProductorPorElRectorAction() {
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params ['idespecialidad'] = $this->_request->getPost('idespecialidad');
        $params ['superrector'] = $this->_request->getPost('superrector');
        $params ['idespecialidadrector'] = $this->_request->getPost(
                'idespecialidadrector'
        );
        $params ['filtros'] = $this->_request->getPost('filtros');
        $modeloActEnt = new DatActividadentidad();
        $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                        ZendExt_GlobalConcept::getInstance()->Estructura->idestructura
        );
        $modeloDemanda = new DatDemandaproduccionModel();
        $res = $modeloDemanda->listarDemandaProductor($params);
        echo json_encode($res);
    }

    public function adicionarModificarNivelActAEjecutarAction() {
        $niveles = json_decode(
                stripslashes($this->_request->getPost('niveles'))
        );
        $modelDatDemProd = new DatDemandaproduccionModel();
        $actualizados = $modelDatDemProd->adicionarNivelProduccion($niveles);
        echo json_encode(array('si' => 1, mods => $actualizados));
    }

    public function listarEspecialidadesSuperRectorAction() {
        $modeloDemanda = new DatDemandaproduccionModel();
        $res = $modeloDemanda->listarEspecialidadesSuper();


        $resp = array();
        if ($res[0] != "") {
            $excluir = array(7, 8, 9, 10);
            $especialidades = $this->integrator->metadatos->DameHijosEstructura(
                    $res[1], $excluir
            );
        }
        foreach ($especialidades as $valor) {
            $resp[] = $valor[0];
        }

        echo json_encode(array('data' => $resp));
    }

    public function cargarconfiguracionpermisosiuAction() {
        $modeloDemanda = new DatDemandaproduccionModel();
        $res = $modeloDemanda->cargarconfiguracionpermisos();
        echo json_encode($res);
    }

    public function guardaraprobacionAction() {
        $params['actividades'] = json_decode(
                stripslashes($this->_request->getPost('actividades'))
        );
        $params['tipo'] = $this->_request->getPost('tipo');
        $params['rectorseguridad'] = $this->_request->getPost(
                'rectorseguridad'
        );
        $params['idaprobacion'] = $this->_request->getPost('idaprobacion');
        $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
        $params['idespecialidadproductor'] = $this->_request->getPost(
                'idespecialidadproductor'
        );
        $params['idespecialidadrector'] = $this->_request->getPost(
                'idespecialidadrector'
        );
        $params['idesplogeada'] = ZendExt_GlobalConcept::getInstance(
                )->Estructura->idespecialidad;

        $modeloDemanda = new DatDemandaproduccionModel();
        $res = $modeloDemanda->guardaraprobacion($params);
        echo json_encode($res);
    }

    public function listarProductoresAction() {
        $modeloDemanda = new DatDemandaproduccionModel();
        $especialidades = $modeloDemanda->listarEspecialidadesProductoras();
        if ($especialidades[0] != "") {
            $excluir = array(7, 8, 9, 10);
            $res = $this->integrator->metadatos->DameHijosEstructura(
                    $especialidades[0], $excluir
            );
        }
        $resp = array();
        foreach ($res as $valor) {
            $resp[] = $valor[0];
        }
        echo json_encode(array('data' => $resp));
    }

    public function exportarAction() {
        $params ['idespecialidad'] = $this->_request->getParam(
                'idespecialidad'
        );
        $params ['idespecialidadrector'] = $this->_request->getParam(
                'idespecialidadrector'
        );
        $params ['superrector'] = $this->_request->getParam('superrector');
        $params ['filtros'] = $this->_request->getParam('fxc');
        $params ['tipo'] = $this->_request->getParam('tipo');
        if ($params ['tipo'] == 'productor') {
            $modeloActEnt = new DatActividadentidad();
            $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                            ZendExt_GlobalConcept::getInstance()->Estructura->idestructura
            );
        }
        $modeloDemanda = new DatDemandaproduccionModel();
        $modeloDemanda->exportarAExcel($params);
    }

}
