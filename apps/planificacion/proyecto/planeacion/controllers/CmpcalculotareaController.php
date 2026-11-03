<?php

/**
 * Controlador para calcular tareas *
 *
 * @author
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpcalculotareaController extends ZendExt_Controller_Secure {


    /**
     * Inicializar los atributos de la clase
     */
    function init() {
        parent::init();
        $this->model = new CmpgestionarcalculoModel();

    }

    /**
     * Accion para mostrar la vista calculotarea.phtml
     */
    function cmpcalculotareaAction() {
        $this->view->extensionesPLAN = $this->pIntegrator->integracion->extensionesPLAN();
        $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
        $this->view->matrizrelacionesComponent = $this->pIntegrator->integracion->matrizrelacionesComponent();

        $this->view->getJSRelaciones
            = $this->pIntegrator->planpdo->getJSRelaciones();
        $this->view->getJSPert
            = $this->pIntegrator->planpdo->getJSPert();
         $this->render();
    }

    function guardarregistroAction(){
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idtarea = $this->_request->getPost('idtarea');
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->arrayregistro = json_decode(
            stripslashes($this->_request->getPost('arrayregistro'))
        );

        $res = $this->model->guardarRegistroMod($parametros);

        echo json_encode(
            array('success' => true )
        );

    }

    function eliminarRegistroAction(){
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idtarea = $this->_request->getPost('idtarea');
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->arrayregistro = json_decode(
            stripslashes($this->_request->getPost('arrayregistro'))
        );

        $this->model->eliminarRegistroMod($parametros);

        echo json_encode(
            array('success' => true )
        );

    }

    function obtenertareasAction(){

        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->padre = json_decode($this->_request->getPost('idproyecto'));
        $tareas =$this->model->tareasByProyectoMod($parametros);

        echo json_encode(
            array('success' => true,
                  'tareas' => $tareas,
                  'idelemento' => $parametros->padre,
                  'user'=> $this->global->Perfil->usuario
                )
        );

    }
    function modificarestAction(){

        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idtarea = $this->_request->getPost('idtarea');
        $parametros->tiempo = $this->_request->getPost('tiempo');



        $tiempo = $this->model->modificarEstimacionMod($parametros);

        echo json_encode(
            array('success' => true,
                  'newtiempo' => $tiempo
            )
        );

    }

    function registrobytareaAction(){
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idtarea = $this->_request->getPost('idtarea');
        $registrosProm  = $this->model->registrobytareaMod($parametros);

        $pesimista = $this->model->timeToSec(explode(":",$registrosProm[1][0]['pesimista']));
        $optimista = $this->model->timeToSec(explode(":",$registrosProm[1][0]['optimista']));
        $medio = $this->model->timeToSec(explode(":",$registrosProm[1][0]['medio']));

        $formula = ($optimista+(4*$medio)+$pesimista)/6;
        $xn = $this->model->secToTime($formula);

        echo json_encode(
            array('success' => true,
                'registros' => $registrosProm[0],
                'promedios' => $registrosProm[1],
                'xn'=>$xn

            )
        );


    }
    function guardarresultadosAction(){
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idejercicio = $this->_request->getPost('idejercicio');
        $action = $this->_request->getPost('action');
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;

        $parametros->data = json_decode(
            stripslashes($this->_request->getPost('data'))
        );

        $resultado = $this->model->crudResultadoMod($parametros,$action);

        echo json_encode(
            array('success' => true,
                  "resultados" =>$resultado
            )
        );

    }
    function guardarejercicioAction(){
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->proyectopadre = $this->_request->getPost('proyectopadre');
        $action = $this->_request->getPost('action');
        $parametros->data = json_decode(
            stripslashes($this->_request->getPost('data'))
        );

        switch ($action) {
            case "eliminar":
                $ejercicio = $this->model->eliminarjercicioMod($parametros);
                break;
            case "modificar":
                $ejercicio = $this->model->modificarejercicioMod($parametros);
                break;
            case "adicionar":
                $ejercicio = $this->model->adicionarejercicioMod($parametros);
                break;
        }


        echo json_encode(
            array('success' => true,
                  "ejercicio" =>$ejercicio
            )
        );
    }

    function ejerciciosbyproyAction(){
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->proyectopadre = $this->_request->getPost('proyectopadre');
        $ejercicios = $this->model->getejerciciosMod($parametros);

        $data = array();
        foreach ($ejercicios as $val) {
            unset($val[0]);
            unset($val[1]);
            unset($val[2]);
            unset($val[3]);
            unset($val[4]);
            $data[] = $val;
        }
        echo json_encode(
            array('success' => true,'ejercicios'=>$data
            )
        );
    }



}
