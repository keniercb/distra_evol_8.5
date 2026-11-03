<?php

/**
 * Controlador para gestionar la asignacion de entidades a usuario
 *

 */
class CmpgestionarincidenciasController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista cmpasignarentidades.phtml
     */
    function cmpgestionarincidenciasAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        // $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    /**
     * Acci�n para adicionar incidencias
     */
    function adicionarincidenciasAction()
    {
        ini_set("max_execution_time", 3600);
        $idusuario = $this->global->Perfil->idusuario;
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->tipo = $this->_request->getPost('tipoIncidencias');
        $parametros->impacto = $this->_request->getPost('impacto');
        if ($parametros->impacto == 'Bajo') {
            $parametros->impacto = 1;
        }
        $parametros->descripcion = $this->_request->getPost('descripcion');
        $parametros->desviacion = json_decode(
            stripslashes($this->_request->getPost('desviacion'))
        );
        $parametros->involucrados = json_decode(
            stripslashes($this->_request->getPost('involucrados'))
        );
        $objcmpgestionarincidencias = new CmpgestionarincidenciasModel();
        $respuesta = $objcmpgestionarincidencias->AdicionarIncidencias(
            $parametros, $idusuario
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function modificarincidenciasAction()
    {
        ini_set("max_execution_time", 3600);
        $idusuario = $this->global->Perfil->idusuario;
        $parametros = new stdClass();
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->tipo = $this->_request->getPost('tipoIncidencias');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->impacto = $this->_request->getPost('impacto');

        if ($parametros->impacto == ' Bajo') {
            $parametros->impacto = 1;
        } else {
            if ($parametros->impacto == ' Medio') {
                $parametros->impacto = 2;
            } else {
                if ($parametros->impacto == ' Alto') {
                    $parametros->impacto = 3;
                }
            }
        }
        $parametros->descripcion = $this->_request->getPost('descripcion');
        $parametros->desviacion = json_decode(stripslashes($this->_request->getPost('desviacion'))
        );
        $parametros->involucrados = json_decode(stripslashes($this->_request->getPost('involucrados')));
        $objcmpgestionarincidencias = new CmpgestionarincidenciasModel();
        $respuesta = $objcmpgestionarincidencias->modificarincidencia($parametros, $idusuario);
        echo json_encode(array('mensaje' => $respuesta));
    }

    /* function cargarcombodesviacionesAction() {
      ini_set("max_execution_time", 3600);
      $arraydesviaciones = array();
      $idusuario = $this->global->Perfil->idusuario;
      $incidencias = $this->_request->getPost('idelemento');
      $temporal=$objAdicionarIncidencias->CargarIncidencias($incidencias);
      $respuesta= $temporal[0];
      $dat->data [] =  array('idelemento' => $respuesta['desviacion'],
      'denominacion' => $respuesta['dendesviacion']);
      echo json_encode($dat);
      }
     */

    function cargartiposincidenciasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 6;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        //print_r($nomencladores);die;
        if ($nomencladores != null) {
            $dat->data = array();
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idnomenclador'  => $val['idnomenclador'],
                                      'dennomenclador' => $val['denom'],
                                      'incidencia'     => $val['incidencia']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    function insertarrelacionAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idincidencia');
        $parametros->desviacion = json_decode(
            stripslashes($this->_request->getPost('desviacion'))
        );
        $idusuario = $this->global->Perfil->idusuario;
        $objcmpgestionarincidencias = new CmpgestionarincidenciasModel();
        $respuesta
            = $objcmpgestionarincidencias->InsertarRelacionIncidenciaDesviacion(
            $parametros, $idusuario
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function cargarincidenciasAction()
    {
        ini_set("max_execution_time", 3600);
        $cont = 0;
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->iddesviacion = $this->_request->getPost('iddesviacion');
        $parametros->accion = $this->_request->getPost('accion');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->start = ($this->_request->getPost('start'))
            ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit'))
            ? $this->_request->getPost('limit') : 15;
        $objIncidencias = new CmpgestionarincidenciasModel();
        $respuesta = $objIncidencias->cargarIncid($parametros);
        if (isset($respuesta['resultado'])) {
            echo json_encode(
                array('success' => true, 'total' => $respuesta['total'],
                      'campos'  => $respuesta['resultado'])
            );
        }
        if (!isset($respuesta)) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

    function eliminarincidenciasAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->arrayidincidencias = json_decode(
            stripslashes($this->_request->getPost('arrayIdIncidencia'))
        );
        $objcmpgestionarincidencias = new CmpgestionarincidenciasModel();
        $respuesta = $objcmpgestionarincidencias->EliminarIncidencias(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function verificarincidenciaAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->start = 0;
        $parametros->limit = 1;
        $obIncidencias = new CmpgestionarincidenciasModel();
        $respuesta = $obIncidencias->cargarIncid($parametros);
        echo json_encode(array('data' => $respuesta['resultado']));
    }

    function publicartodasincidenciasAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->arrayidincidencias = json_decode(
            stripslashes($this->_request->getPost('arrayidincidencias'))
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayidusuarios'))
        );
        $objcmpgestionarincidencia = new CmpgestionarincidenciasModel();
        $respuesta = $objcmpgestionarincidencia->PublicarDesviaciones(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function despublicartodasincidenciasAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->arrayidincidencias = json_decode(
            stripslashes($this->_request->getPost('arrayidincidencias'))
        );
        $objcmpgestionarincidencia = new CmpgestionarincidenciasModel();
        $respuesta = $objcmpgestionarincidencia->DespublicarTodasIncidencias(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function desactivarAction()
    {
        ini_set("max_execution_time", 3600);
        $parametros->arrayidincidencias = json_decode(
            stripslashes($this->_request->getPost('arrayIdIncidencia'))
        );
        $parametros->activo = $this->_request->getPost('activo');
        $objcmpgestionarincidencia = new CmpgestionarincidenciasModel();
        $respuesta = $objcmpgestionarincidencia->ActivarIncidencia($parametros);
        echo json_encode(array('mensaje' => $respuesta));
    }

}

