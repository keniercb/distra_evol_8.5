<?php

/**
 * Controlador para gestionar desviaciones
 *

 */
class CmpgestionardesviacionesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista cmpgestionardesviaciones.phtml
     */
    function cmpgestionardesviacionesAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    function cargardesviacionesAction()
    {
        ini_set("max_execution_time", 3600);
        $arraydesviaciones = array();
        $idusuario = $this->global->Perfil->idusuario;
        $parametros->usuario = $idusuario;
        $parametros->idincidencia = $this->_request->getPost('idincidencia');
        $parametros->accion = $this->_request->getPost('accion');
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->start = ($this->_request->getPost('start'))
            ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit'))
            ? $this->_request->getPost('limit') : 15;
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();
        $arraydesviaciones = $objcmpgestionardesviaciones->listardesviaciones(
            $idusuario, 6, $parametros
        );
        if (isset($arraydesviaciones['resultado'])) {
            echo json_encode(
                array('success' => true, 'total' => $arraydesviaciones['total'],
                      'campos'  => $arraydesviaciones['resultado'])
            );
        } else {
            echo json_encode(
                array('success' => true, 'total' => 0,
                      'campos'  => array())
            );
        }
    }

    function verificardesviacionAction()
    {

        ini_set("max_execution_time", 3600);
        $desviacion = array();
        $idusuario = $this->global->Perfil->idusuario;
        $iddesviacion = $this->_request->getPost('idelemento');
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();
        $desviacion = $objcmpgestionardesviaciones->verificardesviacion(
            $idusuario, 6, $iddesviacion
        );
        if (count($desviacion) != 0) {
            echo json_encode(
                array('mensaje'         => 1,
                      'datosdesviacion' => $desviacion['resultado'])
            );
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }


    function adicionardesviacionesAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros = new stdClass();
        $idusuario = $this->global->Perfil->idusuario;
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->tipodesviacion = $this->_request->getPost('tipodesviacion');
        $parametros->impacto = $this->_request->getPost('impacto');
        $parametros->descripcion = $this->_request->getPost('descripcion');
        $parametros->accion = $this->_request->getPost('accion');
        $parametros->idelemento = $this->_request->getPost('idelemento');


        $parametros->incidenciasasociadas = $this->_request->getPost('incidenciasasociadas' );
        if ($parametros->incidenciasasociadas) {
            $parametros->incidenciasasociadas = explode(
                ',', $parametros->incidenciasasociadas
            );
        }
        $parametros->arrayinvolucrados = json_decode(stripslashes($this->_request->getPost('involucrados')));
        $parametros->arrayidplanes = json_decode(
            stripslashes($this->_request->getPost('arrayidplanes'))
        );
        $parametros->arrayidobjetivos = json_decode(
            stripslashes($this->_request->getPost('arrayidobjetivos'))
        );
        $parametros->arrayidactividades = json_decode(
            stripslashes($this->_request->getPost('arrayidactividades'))
        );
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();

        $respuesta = $objcmpgestionardesviaciones->AdicionarDesviaciones($parametros, $idusuario);


        echo json_encode(array('mensaje' => $respuesta));

    }

    function cargartipodesviacionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 10;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        //print_r($nomencladores);die;

        if ($nomencladores != null) {
            $dat->data = array();
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idtipo'       => $val['idnomenclador'],
                                      'denominacion' => $val['denom']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    function cargarcomboincidenciasAction()
    {
        $arrayIncidencias = array();
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tipoelemento = 5;
        $objdesviacionesModel = new CmpgestionardesviacionesModel();
        $arrayIncidencias = $objdesviacionesModel->listarcomboincidencias(
            $idusuario, $tipoelemento
        );
        //print_r($arrayIncidencias);die;
        if (isset($arrayIncidencias[0])) {
            $dat->data = array();
            foreach ($arrayIncidencias as $incidencia) {
                $dat->data [] = array('idtipo'       => $incidencia['idelemento'],
                                      'denominacion' => $incidencia['denelemento']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    function eliminardesviacionAction()
    {
        ini_set("max_execution_time", 3600);
        //$idusuario = $this->global->Perfil->idusuario;
        $parametros->arrayiddesviaciones = json_decode(
            stripslashes($this->_request->getPost('array_iddesviaciones'))
        );
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();
        $respuesta = $objcmpgestionardesviaciones->EliminarDesviaciones(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function publicartodasdenominacionesAction()
    {
        ini_set("max_execution_time", 3600);
        //$idusuario = $this->global->Perfil->idusuario;
        //$parametros->espublicartodos = $this->_request->getPost('espublicartodos');
        $parametros->arrayiddesviaciones = json_decode(
            stripslashes($this->_request->getPost('arrayiddesviaciones'))
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayidusuarios'))
        );
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();
        $respuesta = $objcmpgestionardesviaciones->PublicarDesviaciones(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function despublicartodasdenominacionesAction()
    {
        ini_set("max_execution_time", 3600);
        //$idusuario = $this->global->Perfil->idusuario;
        $parametros->arrayiddesviaciones = json_decode(
            stripslashes($this->_request->getPost('arrayiddesviaciones'))
        );
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();
        $respuesta = $objcmpgestionardesviaciones->DespublicarTodasDesviaciones(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function asociarincidenciaAdesviacionAction()
    {
        ini_set("max_execution_time", 3600);
        $idusuario = $this->global->Perfil->idusuario;
        $parametros->arrayIdincidencias = json_decode(
            stripslashes($this->_request->getPost('array_idincidencias'))
        );
        $parametros->iddesviacion = $this->_request->getPost('iddesviacion');
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();
        $respuesta = $objcmpgestionardesviaciones->AsociarIncidenciaDesviacion(
            $parametros, $idusuario
        );
        echo json_encode(
            array('mensaje' => $respuesta)
        );
    }

    function cargardocumentosafectadosAction()
    {
        ini_set("max_execution_time", 3600);
        //$idusuario = $this->global->Perfil->idusuario;
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->asociadasAplanes = $this->_request->getPost(
            'asociadasAplanes'
        );
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();
        $arraydocumentos
            = $objcmpgestionardesviaciones->CargarDocumentosAfectados(
            $parametros
        );
        echo json_encode(
            array('success' => true, 'total' => $arraydesviaciones['total'],
                  'campos'  => $arraydocumentos['resultado'])
        );
    }

    function relacionarelementoAdesviacionAction()
    {
        ini_set("max_execution_time", 3600);
        $idusuario = $this->global->Perfil->idusuario;
        $parametros->arrayDesviaciones = json_decode(
            stripslashes($this->_request->getPost('array_desviaciones'))
        );
        $parametros->idelemenArelacionar = $this->_request->getPost(
            'idelemen_a_relacionar'
        );
        $objcmpgestionardesviaciones = new CmpgestionardesviacionesModel();
        $respuesta
            = $objcmpgestionardesviaciones->RelacionarElementoConDesviacion(
            $parametros, $idusuario
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function cargarcmbestadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = 3; //$this->_request->getPost('idtipodoc');
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idusuariosession, $idtipodoc
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    function desactivardesviacionAction()
    {
        ini_set("max_execution_time", 3600);
        //$idusuario = $this->global->Perfil->idusuario;
        $parametros->arraydesviacion = json_decode(
            stripslashes($this->_request->getPost('arraydesviacion'))
        );
        $parametros->activo = $this->_request->getPost('activo');
        $objcmpgestionarincidencia = new CmpgestionardesviacionesModel();
        $respuesta = $objcmpgestionarincidencia->ActivarDesactivarDesviacion(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

}


