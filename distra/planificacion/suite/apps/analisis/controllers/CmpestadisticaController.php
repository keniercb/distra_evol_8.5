<?php

/**
 * Controlador para el control de las graficas de Proyecto
 *
 * @author    Osleidy Quiala Fernandez
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpestadisticaController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
        $this->model[] = new CmpestadisticaModel();  //0
    }

    /**
     * Accion para mostrar la vista graficas.phtml
     */
    function cmpestadisticaAction()
    {
        $this->render();
    }

    /**
     * Accion para cargar el combo proyecto
     */
    function cargarComboProyectosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $respuesta = $this->model[0]->cargarComboProyectos($parametros);
        if ($respuesta != null) {
            foreach ($respuesta as $val) {
                $dat->data [] = array('idproyecto'   => $val['idproyecto'],
                                      'denominacion' => $val['denelemento']

                );
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Accion para cargar el combo hitos
     */
    function cargarComboHitosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $parametros->idproy = $this->_request->getPost('idproy');
        $respuesta = $this->model[0]->cargarComboHitos($parametros);
        if ($respuesta != null) {
            foreach ($respuesta as $val) {
                $dat->data [] = array('idhito'       => $val['idhito'],
                                      'denominacion' => $val['denelemento']

                );
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    public function cargarDisciplinaAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idproy = $this->_request->getPost('idproy');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');

        if ($parametros->idproy == '') {
            $result = $this->model[0]->cargarDisciplina($parametros);
        } else {
            $result = $this->model[0]->cargarDisciplinaProy($parametros);
        }
        echo json_encode(array('data' => $result));
    }

    public function cargarBalanceAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idproy = $this->_request->getPost('idproy');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        if ($parametros->idproy == '') {
            $result = $this->model[0]->cargarBalance($parametros);
        } else {
            $result = $this->model[0]->cargarBalanceProy($parametros);
        }
        echo json_encode(array('data' => $result));
    }

    public function cargarTipoActAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idproy = $this->_request->getPost('idproy');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->tiponom = $this->_request->getPost('tiponom');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        if ($parametros->idproy == '') {
            $result = $this->model[0]->cargarTipoTarea($parametros);
        } else {
            $result = $this->model[0]->cargarTipoTareaProy($parametros);
        }
        echo json_encode(array('data' => $result));
    }

    public function cargarTiempoPlanAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idproy = $this->_request->getPost('idproy');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->cumplimiento = $this->_request->getPost('cumplimiento');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $result = $this->model[0]->cargarTiempoPlanif($parametros);
        echo json_encode(array('data' => $result));
    }

    public function cargarEjecucionAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idproy = $this->_request->getPost('idproy');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->trimestre = $this->_request->getPost('trimestre');
        $parametros->ejecucion = $this->_request->getPost('ejecucion');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $result = $this->model[0]->cargarEjecucion($parametros);
        echo json_encode(array('data' => $result));
    }

    /**Accion para mostrar la calidad de la planificacion teniendo en cuenta
     * los criterios de evaluacion
     */
    public function cargarCalidadAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idproy = $this->_request->getPost('idproy');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->tiponom = $this->_request->getPost('tiponom');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        if ($parametros->idproy == '') {
            $result = $this->model[0]->cargarCalidad($parametros);
        } else {
            $result = $this->model[0]->cargarCalidadProy($parametros);
        }
        echo json_encode(array('data' => $result));
    }

    public function cargarCalidadTriAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idproy = $this->_request->getPost('idproy');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->tiponom = $this->_request->getPost('tiponom');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        if ($parametros->idproy == '') {
            $result = $this->model[0]->cargarCalidadTri($parametros);
        } else {
            $result = $this->model[0]->cargarCalidadTriProy($parametros);
        }
        echo json_encode(array('data' => $result));
    }


}
