<?php

/**
 * Controlador para gestionar actividades
 *

 */
class CmpgestionararcController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase
     */
    function init() {
        parent::init();
    }

    /**
     * Accion para mostrar la vista cmpgestionararc.phtml
     */
    function cmpgestionararcAction() {
        try {
            $usargd = true; //$this->pIntegrator->planpdo->verificarGestorDoc();
        } catch (Exception $e) {
            $usargd = false;
        }
        if ($usargd) {
            $this->view->gestdoc
                    = ''; //$this->integrator->gestordocumental->devolverJSContenido();
            $this->view->usarGD = '<script> var usarGD = false; </script>';
        } else {
            $this->view->usarGD = '<script> var usarGD = false; </script>';
            $this->view->gestdoc = '';
        }
        $this->render();
    }

    /**
     * Accion para cargar las arc
     */
    function cargararcAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idarc = $this->_request->getPost("idarc");
        $filtros = $this->_request->getPost('filtros');
        $idarc = $this->_request->getPost('anode');
        $start = ($this->_request->getPost("start") > 0) ? $this->_request->getPost("start") : 0;
        $limit = $this->_request->getPost("limit");
        $arrayautores = json_decode(stripslashes($this->_request->getPost('arrayautores')));
        $arrayinvolucrados = json_decode(stripslashes($this->_request->getPost('arrayinvolucrados')));
        $arrayelementosrelacionados = json_decode(stripslashes($this->_request->getPost('arrayelementosrelacionados')));

        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $autor) {
                $arrayautoresact[]['idusuariocrea'] = $autor->idautor;
            }
        }
        $cero = 0;
        $uno = 1;
        if (isset($arrayinvolucrados[0])) {
            foreach ($arrayinvolucrados as $involucrado) {
                $id = $involucrado->idusuario;
                if ($involucrado->tipo == 0) {
                    $id = $involucrado->idgrupo;
                }
                $arrayinvolact[]['llaveinvolucrado'] = $id . $cero;
                $arrayinvolact[]['llaveinvolucrado'] = $id . $uno;
                if ($involucrado->tipo == 1) {
                    $arraygrupos = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario($id);
                    if (isset($arraygrupos[0])) {
                        foreach ($arraygrupos as $grupo) {
                            $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $cero;
                            $arrayinvolact[]['llaveinvolucrado'] = $grupo['idgrupo'] . $uno;
                        }
                    }
                }
            }
        }
        if (!isset($arrayautores[0]) && !isset($arrayinvolucrados[0])) {
            $arrayautoresact[]['idusuariocrea'] = $idusuariosession;
            $arrayinvolact[]['llaveinvolucrado'] = $idusuariosession . $cero;
            $arrayinvolact[]['llaveinvolucrado'] = $idusuariosession . $uno;
            $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                    $idusuariosession
            );
            if (isset($arraygrupos[0])) {
                foreach ($arraygrupos as $grupo) {
                    $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $cero;
                    $arrayinvolact[]['llaveinvolucrado']
                            = $grupo['idgrupo'] . $uno;
                }
            }
        }
        $objcmparcmodel = new CmpgestionararcModel();
        $arrayareas = $objcmparcmodel->CargarAreas(
                $idarc, $idusuariosession, $start, $limit, $arrayautoresact, $arrayinvolact, $arrayelementosrelacionados, $filtros
        );
        if (isset($arrayareas['resultado'])) {
            echo json_encode(
                    array('success' => true, 'total' => $arrayareas['total'],
                        'campos' => $arrayareas['resultado'])
            );
        }
        if (!isset($arrayareas)) {
            echo json_encode(
                    array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

    /**
     * Accion para adicionar las arc
     */
    function adicionararcAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros=new stdClass();
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denarc = $this->_request->getPost('tfdenominacionarc');
        $parametros->descarc = $this->_request->getPost('hedescripcionarc');
        $parametros->fechainicio = $this->_request->getPost('finiarc');
        $parametros->fechafin = $this->_request->getPost('ffinarc');
        $parametros->orden = $this->_request->getPost('orden');
        $parametros->idarcp = $this->_request->getPost('idarcp');
        $parametros->eshija = $this->_request->getPost('eshija');
        $parametros->escapitulo = $this->_request->getPost('escapitulo');
        $parametros->arrayinvolucrados = json_decode(
                stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayelementosrelacionados = json_decode(
                stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        $objcmpgestionararcmodel = new CmpgestionararcModel();
        $temp = $objcmpgestionararcmodel->AdicionarArc(
          $parametros
        );
        if ($temp != 2 && $temp != 0) {
            $temp = DatArc::ExisteArcNombre($parametros->idusuariocrea, $parametros->denarc);
            $objarcc['idarc'] = $temp[0]['idarc'];
            $objarcc['activo'] = $temp[0]['activo'];
            $objarcc['fdesde'] = $temp[0]['fechainicio'];
            $objarcc['fhasta'] = $temp[0]['fechafin'];
            $area = $objcmpgestionararcmodel->ActivarArea($area);
            $area = $objcmpgestionararcmodel->DesactivarArea($area);
            //se crea el objeto 'arc-involucrados' y se registra
            if (isset($parametros->arrayinvolucrados[0])) {
                $objclasificadorinvolmodel = new ClasificadorinvolModel();
                foreach ($parametros->arrayinvolucrados as $involucrado) {
                    $objclasificadorinvolmodel->Involucrar(
                            $involucrado, $temp[0]['idarc'], $idtipoelemento = 5, $estamodificando = 0
                    );
                }
            }
            //se crea el objeto 'relacion' y se registra
            if (isset($arrayelementosrelacionados[0])) {
                $objclasificadorinvolmodel = new CmprelacionesModel();
                $objclasificadorinvolmodel->RelacionarElementos(
                        $temp[0]['idarc'], $idtipoelemento = 5, $parametros->arrayelementosrelacionados, $parentrelacidelemento = 'hijo', $parametros->idusuariocrea
                );
            }
            $temp = 1;
        }
        echo json_encode(array('mensaje' => $temp));
    }

    /**
     * Accion para modificar las arc
     */
    function modificararcAction() {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros=new stdClass();
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idarc = $this->_request->getPost('idarc');
        $parametros->denarc = $this->_request->getPost('tfdenominacionarc');
        $parametros->descarc = $this->_request->getPost('hedescripcionarc');
        $parametros->fechainicio = $this->_request->getPost('finiarc');
        $parametros->fechafin = $this->_request->getPost('ffinarc');
        $parametros->orden = $this->_request->getPost('orden');
        $parametros->arrayinvolucrados = json_decode(
                stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $objcmpgestionararcmodel = new CmpgestionararcModel();
        $temp = $objcmpgestionararcmodel->ModificarArc(
          $parametros
        );
        echo json_encode(array('mensaje' => $temp));
    }

    /**
     * Accion para eliminar las arc
     */
    function eliminararcAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrayidarc = json_decode(
                stripslashes($this->_request->getPost('arrayidarc'))
        );
        $objcmparcmodel = new CmpgestionararcModel();
        $resp = $objcmparcmodel->EliminarArc($arrayidarc);
        echo json_encode(array('mensaje' => $resp));
    }

    /**
     * Accion para activar o desactivar las arc
     */
    function activardesactivararcAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrayidarc = json_decode(
                stripslashes($this->_request->getPost('arrayidarc'))
        );
        $accion = $this->_request->getPost('accion');
        $objcmparcmodel = new CmpgestionararcModel();
        $resp = $objcmparcmodel->ActivarDesactivarARC($arrayidarc, $accion);
        echo json_encode(array('mensaje' => $resp));
    }

    /**
     * Funcion para cargar un arc en el formulario
     */
    function cargarFormArcAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idarc = $this->_request->getPost('idarc');
        $objarc = Doctrine::getTable('DatArc')->find($idarc);
        if (isset($objarc)) {
            $dat->data [] = array(
                'idarc' => $objarc->idarc,
                'denarc' => $objarc->denarc,
                'descrip' => empty($objarc->descrip) ? '' : $objarc->descrip,
                'fechainicio' => $objarc->fechainicio,
                'orden' => $objarc->orden,
                'autor' => $this->integrator->seguridad->nombreUsuario(
                        $objarc->idusuariocrea
                ),
                'fechafin' => $objarc->fechafin, 'mensaje' => 1
            );
            echo json_encode($dat);
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function cargarcmbestadosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuariosession, $idtipodoc = 0
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

}

