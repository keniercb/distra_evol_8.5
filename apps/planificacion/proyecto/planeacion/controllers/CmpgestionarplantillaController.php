<?php

/**
 * Controlador para gestionar proyectos/plantillas *
 *
 * @author
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class CmpgestionarplantillaController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
        $this->model[] = new CmpgestionarplantillaModel();  //0
        $this->model[] = new CmpgestionarhitoModel();  //1
        $this->model[] = new CmpgestionartareaModel();  //2
        $this->setearIncludePath();
    }

    public function setearIncludePath()
    {
        $dir = split("apps/", __FILE__);
        //apps/planificacion/pdo/plan
        $dir_abs_mt = $dir[0];
        $include_path =
            PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain' . DIRECTORY_SEPARATOR . 'generated'
            . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain'
            . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'pdo' . DIRECTORY_SEPARATOR . 'plan' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'bussines';
        set_include_path(get_include_path() . $include_path);
    }

    /**
     * Accion para mostrar la vista gestionarplantilla.phtml
     */
    function cmpgestionarplantillaAction()
    {
        $this->view->extensionesPLAN
            = $this->pIntegrator->integracion->extensionesPLAN();
        $this->view->pyeComun = $this->pIntegrator->integracion->pyeComun();
        $this->view->matrizrelacionesComponent
            = $this->pIntegrator->integracion->matrizrelacionesComponent();
        $this->view->getJSRelaciones
            = $this->pIntegrator->planpdo->getJSRelaciones();
        $this->view->getJSPert = $this->pIntegrator->planpdo->getJSPert();
        $this->view->jsreportes = $this->pIntegrator->reportes->devolverJS();
        $this->render();
    }

    /**
     * Accion para cargar las plantillas
     */
    function cargarplantillasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->padre = json_decode(stripslashes($this->_request->getPost('padre')));
        $parametros->inProyecto = $this->_request->getPost('inProyecto');
        $parametros->inPlantilla = $this->_request->getPost('inPlantilla');
        $parametros->incluProyecto = $this->_request->getPost('incluProyecto');
        $parametros->incluPlantilla = $this->_request->getPost('incluPlantilla');
        $parametros->incluRepeticiones = $this->_request->getPost('incluRepeticiones');
        $parametros->incluReasignaciones = $this->_request->getPost('incluReasignaciones');
        $parametros->anode = $this->_request->getPost('anode');
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->dependenciaTotal = $this->_request->getPost('dependenciaTotal');
        $parametros->dependenciaPorcentual = $this->_request->getPost('dependenciaPorcentual');
        $parametros->dependenciaPuertaAbierta = $this->_request->getPost('dependenciaPuertaAbierta');
        $parametros->idelementoafiltrar = $this->_request->getPost('idelementoafiltrar');
        $parametros->relacionarTareas = $this->_request->getPost('relacionarTareas');
        $parametros->tipoelemento = $this->_request->getPost('tipoelemento');
        $parametros->idproyectoParaFiltro = $this->_request->getPost('idproyectoParaFiltro');
        $parametros->limit = $this->_request->getPost('limit');
        $parametros->start = $this->_request->getPost('start');

        $parametros->arrayautores = json_decode(stripslashes($this->_request->getPost('arrayautores')));
        $parametros->arrayinvolucrados = json_decode(stripslashes($this->_request->getPost('arrayinvolucrados')));
        $parametros->idEstructura = json_decode(stripslashes($this->_request->getPost('idEstructura')));
        if (($parametros->idEstructura == '' || $parametros->idEstructura == 'node2') && $parametros->anode == ''
        ) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        } else {
            $arrayProyectos = $this->model[0]->cargarProyectos($parametros);
            if (isset($arrayProyectos['resultado'])) {
                echo json_encode(
                    array('success' => true,
                        'total' => $arrayProyectos['total'],
                        'campos' => $arrayProyectos['resultado'])
                );
            } else {
                echo json_encode(
                    array('success' => true, 'total' => 0, 'campos' => array())
                );
            }
        }
    }

    /**
     * Accion para adicionar los proyectos/plantillas
     */
    function adicionarProyectoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost('tfdenominacion');

//        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 10;
        //$parametros->descelemento = $this->_request->getPost('hedescripcion');
        $parametros->descelemento = ($this->_request->getPost('hedescripcion')) ? $this->_request->getPost('hedescripcion') : '';
        $parametros->idcategoria = $this->_request->getPost('idnomenclador');
        $parametros->idprioridad = $this->_request->getPost('idprioridad') ? $this->_request->getPost('idprioridad') : null;
        $parametros->idestadocump = $this->_request->getPost('estadoCumpl');
        $parametros->fechainicio = $this->_request->getPost('fini');
        $parametros->fechafin = $this->_request->getPost('ffin');
        $parametros->duracionE = $this->_request->getPost('duracionE');
        $parametros->duracionEstimadaDias = $this->_request->getPost(
            'duracionEstimadaDias'
        );
        $parametros->duracionEstimadaHoras = $this->_request->getPost(
            'duracionEstimadaHoras'
        );
        $parametros->duracionEstimadaMinutos = $this->_request->getPost(
            'duracionEstimadaMinutos'
        );
        $parametros->identificacion = $this->_request->getPost(
            'identificacion'
        );
        $parametros->duracionR = $this->_request->getPost('duracionR');
        $parametros->identificacion = $this->_request->getPost(
            'identificacion'
        );
        $parametros->idrecursoasociado = json_decode(
            stripslashes($this->_request->getPost('asociados'))
        );
        $parametros->porcientocump = $this->_request->getPost('porcientocump');
        $parametros->plantilla = $this->_request->getPost('plantilla');
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->idEstructura = json_decode(
            stripslashes($this->_request->getPost('idEstructura'))
        );
        $parametros->verificartiempoinvol = $this->_request->getPost(
            'verificartiempoinvol'
        );
//        print_r($parametros);die;
        $temp = $this->model[0]->adicionarProyecto($parametros);
        //is_array($temp)
        if (isset($temp['mensaje']) != '') {
            echo json_encode(array('mensaje' => $temp));
        } else {
            if ($temp != 0) {
                echo json_encode(array('mensaje' => 1));
            } else {
                echo json_encode(
                    array('mensaje' => 0, 'identificador' => 'existe')
                );
            }
        }
    }

    /**
     * Accion para adicionar los hitos
     */
    function adicionarHitoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost('tfdenominacion');
        $parametros->descelemento = $this->_request->getPost('hedescripcion');
        $parametros->idcategoria = $this->_request->getPost('idnomenclador');
        $parametros->idestadocump = $this->_request->getPost('estadoCumpl');
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $parametros->fechainicio = $this->_request->getPost('fini');
        $parametros->fechafin = $this->_request->getPost('ffin');
        $parametros->duracionE = $this->_request->getPost('duracionE');
        $parametros->duracionEstimadaDias = $this->_request->getPost(
            'duracionEstimadaDias'
        );
        $parametros->duracionEstimadaHoras = $this->_request->getPost(
            'duracionEstimadaHoras'
        );
        $parametros->duracionEstimadaMinutos = $this->_request->getPost(
            'duracionEstimadaMinutos'
        );
        $parametros->duracionR = $this->_request->getPost('duracionR');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->porcientocump = $this->_request->getPost('porcientocump');
        $parametros->plantilla = $this->_request->getPost('plantilla');
        $parametros->idpadre = $this->_request->getPost('idpadre');
        $parametros->idautorpadre = $this->_request->getPost('idautorpadre');
        $parametros->tipopadre = $this->_request->getPost('tipopadre');
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->verificartiempoinvol = $this->_request->getPost(
            'verificartiempoinvol'
        );
        $temp = $this->model[1]->adicionarHito($parametros);
        if (isset($temp['mensaje'])) {
            echo json_encode(array('mensaje' => $temp));
        } else {
            if ($temp != 0) {
                echo json_encode(array('mensaje' => 1));
            } else {
                echo json_encode(array('mensaje' => 0));
            }
        }
    }

    function duplicarHitoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost('tfdenominacion');
        $parametros->descelemento = $this->_request->getPost('hedescripcion');
        $parametros->idcategoria = $this->_request->getPost('idnomenclador');
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $parametros->idestadocump = $this->_request->getPost('estadoCumpl');
        if ($parametros->plantilla != 1) {
            $parametros->fechainicio = $this->_request->getPost('fini');
            $parametros->fechafin = $this->_request->getPost('ffin');
            $parametros->duracionR = $this->_request->getPost('duracionR');
        }
        $parametros->duracionE = $this->_request->getPost('duracionE');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->porcientocump = $this->_request->getPost('porcientocump');
        $parametros->plantilla = $this->_request->getPost('plantilla');
        $parametros->idpadre = $this->_request->getPost('idpadre');
        $parametros->idautorpadre = $this->_request->getPost('idautorpadre');
        $parametros->tipopadre = $this->_request->getPost('tipopadre');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $objhitoModel = new CmpgestionarhitoModel();
        $resultados = $objhitoModel->duplicarHito($parametros);
        $objTareaModel = new CmpgestionarplantillaModel();
        if ($parametros->plantilla != 1) {
            $parametros->tareas = $resultados['tareas'];
            $objTareaModel->funcionSetFechas($parametros);
            $objTareaModel->adicionarfechaHitos($resultados['idhito']);
        }
        echo json_encode(array('mensaje' => 1));
    }

    /**
     * Accion para adicionar las tareas
     */
    function adicionarTareaAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost('tfdenominacion');
        $parametros->descelemento = $this->_request->getPost('hedescripcion');
        $parametros->idcategoria = $this->_request->getPost('idnomenclador');
        $parametros->idestadocump = $this->_request->getPost('estadoCumpl');
        $parametros->fechainicio = $this->_request->getPost('fini');
        $parametros->fechafin = $this->_request->getPost('ffin');
        $parametros->horainicio = $this->_request->getPost('tmfhoraini');
        $parametros->horafin = $this->_request->getPost('tmfhorafin');
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $parametros->duracionE = number_format($this->_request->getPost('duracionE'), 2);

        $parametros->duracionEstimadaDias = $this->_request->getPost('duracionEstimadaDias');
        $parametros->duracionEstimadaHoras = $this->_request->getPost('duracionEstimadaHoras');
        $parametros->duracionEstimadaMinutos = $this->_request->getPost('duracionEstimadaMinutos');

        $parametros->tiempooptimistaDias = $this->_request->getPost('tiempooptimistaDias');
        $parametros->tiempooptimistaHoras = $this->_request->getPost('tiempooptimistaHoras');
        $parametros->tiempooptimistaMinutos = $this->_request->getPost('tiempooptimistaMinutos');

        $parametros->tiempomedioDias = $this->_request->getPost('tiempomedioDias');
        $parametros->tiempomedioHoras = $this->_request->getPost('tiempomedioHoras');
        $parametros->tiempomedioMinutos = $this->_request->getPost('tiempomedioMinutos');

        $parametros->tiempopesimistaDias = $this->_request->getPost('tiempopesimistaDias');
        $parametros->tiempopesimistaHoras = $this->_request->getPost('tiempopesimistaHoras');
        $parametros->tiempopesimistaMinutos = $this->_request->getPost('tiempopesimistaMinutos');

        $parametros->duracionR = $this->_request->getPost('duracionR');
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->porcientocump = $this->_request->getPost('porcientocump');
        $parametros->criterioeval = $this->_request->getPost('ideval');
        $parametros->idtipotarea = $this->_request->getPost('idtipotarea');
        $parametros->lugar = $this->_request->getPost('tflugar');
        $parametros->principal = $this->_request->getPost('principal');
        $parametros->plantilla = $this->_request->getPost('plantilla');
        $parametros->idpadre = $this->_request->getPost('idpadre');
        $parametros->idautorpadre = $this->_request->getPost('idautorpadre');
        $parametros->evento = $this->_request->getPost('evento');
        $parametros->tipopadre = $this->_request->getPost('tipopadre');
        $parametros->arrayrepeticiones = json_decode(
            stripslashes($this->_request->getPost('arrayrepeticiones'))
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayelementosrelacionados = json_decode(
            stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        $parametros->recursoasociado = json_decode(
            stripslashes($this->_request->getPost('asociados'))
        );
        $parametros->verificartiempoinvol = $this->_request->getPost(
            'verificartiempoinvol'
        );
        $parametros->idSubsistema = $this->_request->getPost(
            'isSubsistema'
        );

        $parametros->unidadmedida = $this->_request->getPost('unidadmedida') ? $this->_request->getPost('unidadmedida') : null;
        $parametros->valorreal = $this->_request->getPost('valorreal') ? $this->_request->getPost('valorreal') : null;
        $parametros->valormeta = $this->_request->getPost('valormeta') ? $this->_request->getPost('valormeta') : null;
        $parametros->costo = $this->_request->getPost('costo') ? $this->_request->getPost('costo') : null;
        $parametros->clave = $this->_request->getPost('tfclave');
//      print_r($parametros);die;

        $temp = $this->model[2]->adicionarTarea($parametros);
        if (isset($temp['mensaje'])) {
            echo json_encode(array('mensaje' => $temp));
        } else {
            if ($temp != 0) {
                echo json_encode(array('mensaje' => 1));
            } else {
                echo json_encode(array('mensaje' => 0));
            }
        }
    }

    function actualizarTiempoEstimadoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idtarea = $this->_request->getPost('idtarea');
        //si el tiempo estimado es menor que 1, le pongo 1 abligado para garantizar que una tarea al menos debe durar 1 min
        $parametros->tiempoEstimado = ($this->_request->getPost('tiempoEstimado') == 0) ? 1 : $this->_request->getPost('tiempoEstimado');

        $parametros->tiempooptimista = $this->_request->getPost('tiempooptimista');
        $parametros->tiempomedio = $this->_request->getPost('tiempomedio');
        $parametros->tiempopesimista = $this->_request->getPost('tiempopesimista');

        $this->model[2]->actualizarTiempoEstimadoTarea($parametros);

        echo json_encode(array('success' => true));
    }

    function duplicarTareaAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost('tfdenominacion');
        $parametros->descelemento = $this->_request->getPost('hedescripcion');
        $parametros->idcategoria = $this->_request->getPost('idnomenclador');
        $parametros->idestadocump = $this->_request->getPost('estadoCumpl');
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        if ($parametros->plantilla != 1) {
            $parametros->fechainicio = $this->_request->getPost('fini');
            $parametros->fechafin = $this->_request->getPost('ffin');
            $parametros->horainicio = $this->_request->getPost('tmfhoraini');
            $parametros->horafin = $this->_request->getPost('tmfhorafin');
            $parametros->duracionR = $this->_request->getPost('duracionR');
        }
        $parametros->duracionE = number_format(
            $this->_request->getPost('duracionE'), 2
        );
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->porcientocump = $this->_request->getPost('porcientocump');
        $parametros->criterioeval = $this->_request->getPost('ideval');
        $parametros->idtipotarea = $this->_request->getPost('idtipotarea');
        $parametros->lugar = $this->_request->getPost('tflugar');
        $parametros->principal = $this->_request->getPost('principal');
        $parametros->plantilla = $this->_request->getPost('plantilla');
        $parametros->idpadre = $this->_request->getPost('idpadre');
        $parametros->idautorpadre = $this->_request->getPost('idautorpadre');
        $parametros->evento = $this->_request->getPost('evento');
        $parametros->tipopadre = $this->_request->getPost('tipopadre');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->arrayrepeticiones = json_decode(
            stripslashes($this->_request->getPost('arrayrepeticiones'))
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayelementosrelacionados = json_decode(
            stripslashes($this->_request->getPost('arrayelementosrelacionados'))
        );
        $parametros->recursoasociado = json_decode(
            stripslashes($this->_request->getPost('asociados'))
        );

        $parametros->unidadmedida = $this->_request->getPost('unidadmedida') ? $this->_request->getPost('unidadmedida') : null;
        $parametros->valorreal = $this->_request->getPost('valorreal') ? $this->_request->getPost('valorreal') : null;
        $parametros->valormeta = $this->_request->getPost('valormeta') ? $this->_request->getPost('valormeta') : null;
        $parametros->costo = $this->_request->getPost('costo') ? $this->_request->getPost('costo') : null;
        $parametros->clave = $this->_request->getPost('tfclave');

        $parametros->_is_leaf = $this->_request->getPost('_is_leaf');
        $resultados = CmpgestionartareaModel::duplicarTarea($parametros);
        $objTareaModel = new CmpgestionarplantillaModel();
        if ($parametros->plantilla != 1 && $parametros->_is_leaf == false) {
            $parametros->tareas = $resultados['tareas'];
            $objTareaModel->funcionSetFechas($parametros);
        }
        if ($resultados['idtarea'] != 0) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    /**
     * Accion para modificar proyecto o plantilla
     */
    function modificarElementoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost('tfdenominacion');
        $parametros->descelemento = $this->_request->getPost('hedescripcion');
        $parametros->tipo = $this->_request->getPost('tipo');
        $parametros->plantilla = $this->_request->getPost('plantilla');
        if ($parametros->plantilla != 1) {
            $parametros->fechainicio = $this->_request->getPost('fini');
            $parametros->fechafin = $this->_request->getPost('ffin');
            $parametros->duracionR = $this->_request->getPost('duracionR');
            $parametros->idestadocump = $this->_request->getPost('estadoCumpl');
            $parametros->porcientocump = $this->_request->getPost(
                'porcientocump'
            );
        }
        $parametros->idcategoria = $this->_request->getPost('idnomenclador');
        $parametros->duracionE = $this->_request->getPost('duracionE');
        $parametros->duracionEstimadaDias = $this->_request->getPost(
            'duracionEstimadaDias'
        );
        $parametros->duracionEstimadaHoras = $this->_request->getPost(
            'duracionEstimadaHoras'
        );
        $parametros->duracionEstimadaMinutos = $this->_request->getPost(
            'duracionEstimadaMinutos'
        );
        $parametros->identificacion = $this->_request->getPost(
            'identificacion'
        );
        $parametros->idprioridad = $this->_request->getPost('idprioridad');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayinvolucradoseliminar = json_decode(
            stripslashes(
                $this->_request->getPost('arrayinvolucradoseliminar')
            )
        );
        $parametros->verificartiempoinvol = $this->_request->getPost(
            'verificartiempoinvol'
        );
        $temp = $this->model[0]->modificarProyecto($parametros);
        echo json_encode(array('mensaje' => $temp));
    }

    function modificarHitoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost('tfdenominacion');
        $parametros->descelemento = $this->_request->getPost('hedescripcion');
        $parametros->idcategoria = $this->_request->getPost('idnomenclador') ? $this->_request->getPost('idnomenclador') : null;
        if ($parametros->plantilla != 1) {
            $parametros->fechainicio = $this->_request->getPost('fini');
            $parametros->fechafin = $this->_request->getPost('ffin');
            $parametros->duracionR = $this->_request->getPost('duracionR');
            $parametros->criterioeval = $this->_request->getPost(
                'criterioeval'
            );
            $parametros->porcientocump = $this->_request->getPost(
                'porcientocump'
            );
            $parametros->idestadocump = $this->_request->getPost('estadoCumpl');
        }
        $parametros->duracionE = $this->_request->getPost('duracionE');
        $parametros->duracionEstimadaDias = $this->_request->getPost(
            'duracionEstimadaDias'
        );
        $parametros->duracionEstimadaHoras = $this->_request->getPost(
            'duracionEstimadaHoras'
        );
        $parametros->duracionEstimadaMinutos = $this->_request->getPost(
            'duracionEstimadaMinutos'
        );
        $parametros->peso = $this->_request->getPost('peso');
        $parametros->plantilla = $this->_request->getPost('plantilla');
        $parametros->idpadre = $this->_request->getPost('idpadre');
        $parametros->idautorpadre = $this->_request->getPost('idautorpadre');
        $parametros->tipopadre = $this->_request->getPost('tipopadre');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayinvolucradoseliminar = json_decode(
            stripslashes(
                $this->_request->getPost('arrayinvolucradoseliminar')
            )
        );
        $parametros->verificartiempoinvol = $this->_request->getPost(
            'verificartiempoinvol'
        );
        $temp = $this->model[1]->modificarHito($parametros);
        echo json_encode(array('mensaje' => $temp));
    }

    function modificarTareaAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->denelemento = $this->_request->getPost('tfdenominacion');
        $parametros->plantilla = $this->_request->getPost('plantilla');
        $parametros->evento = $this->_request->getPost('evento');
        if ($parametros->plantilla != 1) {
            $parametros->fechainicio = $this->_request->getPost('fini');
            $parametros->fechafin = $this->_request->getPost('ffin');
            $parametros->duracionR = $this->_request->getPost('duracionR');
            //$parametros->criterioeval = $this->_request->getPost('criterioeval');
            $parametros->ideval = $this->_request->getPost('ideval');
            $parametros->porcientocump = $this->_request->getPost(
                'porcientocump'
            );
            $parametros->idestadocump = $this->_request->getPost('estadoCumpl');
        }
        $parametros->horainicio = $this->_request->getPost('tmfhoraini');
        $parametros->horafin = $this->_request->getPost('tmfhorafin');
        $parametros->descelemento = $this->_request->getPost('hedescripcion');
        $parametros->idcategoria = $this->_request->getPost('idnomenclador');

        $parametros->duracionEstimadaDias = $this->_request->getPost('duracionEstimadaDias');
        $parametros->duracionEstimadaHoras = $this->_request->getPost('duracionEstimadaHoras');
        $parametros->duracionEstimadaMinutos = $this->_request->getPost('duracionEstimadaMinutos');

        $parametros->tiempooptimistaDias = $this->_request->getPost('tiempooptimistaDias');
        $parametros->tiempooptimistaHoras = $this->_request->getPost('tiempooptimistaHoras');
        $parametros->tiempooptimistaMinutos = $this->_request->getPost('tiempooptimistaMinutos');

        $parametros->tiempomedioDias = $this->_request->getPost('tiempomedioDias');
        $parametros->tiempomedioHoras = $this->_request->getPost('tiempomedioHoras');
        $parametros->tiempomedioMinutos = $this->_request->getPost('tiempomedioMinutos');

        $parametros->tiempopesimistaDias = $this->_request->getPost('tiempopesimistaDias');
        $parametros->tiempopesimistaHoras = $this->_request->getPost('tiempopesimistaHoras');
        $parametros->tiempopesimistaMinutos = $this->_request->getPost('tiempopesimistaMinutos');

        $parametros->peso = $this->_request->getPost('peso');
        $parametros->idtipotarea = $this->_request->getPost('idtipotarea');
        $parametros->lugar = $this->_request->getPost('tflugar');
        $parametros->principal = $this->_request->getPost('principal');
        $parametros->idpadre = $this->_request->getPost('idpadre');
        $parametros->idautorpadre = $this->_request->getPost('idautorpadre');
        $parametros->tipopadre = $this->_request->getPost('tipopadre');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayinvolucradoseliminar = json_decode(
            stripslashes(
                $this->_request->getPost('arrayinvolucradoseliminar')
            )
        );
        $parametros->recursoasociado = json_decode(
            stripslashes($this->_request->getPost('asociados'))
        );
        $parametros->verificartiempoinvol = $this->_request->getPost(
            'verificartiempoinvol'
        );
        $parametros->idSubsistema = $this->_request->getPost(
            'isSubsistema'
        );

        $parametros->unidadmedida = $this->_request->getPost('unidadmedida') ? $this->_request->getPost('unidadmedida') : null;
        $parametros->valorreal = $this->_request->getPost('valorreal') ? $this->_request->getPost('valorreal') : null;
        $parametros->valormeta = $this->_request->getPost('valormeta') ? $this->_request->getPost('valormeta') : null;
        $parametros->costo = $this->_request->getPost('costo') ? $this->_request->getPost('costo') : null;
        $parametros->clave = $this->_request->getPost('tfclave');

//        print_r($parametros);die;

        $temp = $this->model[2]->modificarTarea($parametros);
        echo json_encode(array('mensaje' => $temp));
    }

    /**
     * Accion para eliminar elemento(proyecto/hito/tarea)
     */
    function eliminarElementoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arrayidelementos = json_decode(
            stripslashes($this->_request->getPost('arrayidelementos'))
        );
        $this->model[0]->eliminarProyecto($arrayidelementos);
        $respuesta = 1;
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para cargar nomencladores(categorias)
     */
    function cargarNomencladorAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = $this->_request->getPost('tiponom');
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idnomenclador' => $val['idnomenclador'],
                    'denominacion' => $val['denom']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Accion para cargar tipo tarea
     */
    function cargartipoTareaAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = $this->_request->getPost('tiponom');
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idtipotarea' => $val['idnomenclador'],
                    'denominacion' => $val['denom']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Accion para cargar tipo tarea
     */
    function cargarEvalAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = $this->_request->getPost('tiponom');
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                $dat->data [] = array('ideval' => $val['idnomenclador'],
                    'denominacion' => $val['denom']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Accion para cargar prioridad tarea
     */
    function cargarPrioridadAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = $this->_request->getPost('tiponom');
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idprioridad' => $val['idnomenclador'],
                    'denominacion' => $val['denom']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    function cargarRepeticionesTareaAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idtarea = $this->_request->getPost('idtarea');
        $parametros->idelementopadre = $this->_request->getPost(
            'idelementopadre'
        );
        $parametros->limit = $limit = $this->_request->getPost('limit');
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->idusuariosession
            = $idusuariosession = $this->global->Perfil->idusuario;
        $objTareaModel = new CmpgestionartareaModel();
        $arrayrepeticiones = $objTareaModel->ObtenerRepeticionesTareaPaginado(
            $parametros
        );
        if ($arrayrepeticiones['total'] > 0) {
            echo json_encode(
                array('total' => $arrayrepeticiones['total'],
                    'campos' => $arrayrepeticiones['resultado'])
            );
        } else {
            echo json_encode(array('campos' => array(), 'total' => 0));
        }
    }

    function adicionarrepeticionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idtarea = $this->_request->getPost('idtarea');
        $idelementopadre = $this->_request->getPost('idelementopadre');
        $arrayrepeticiones = json_decode(
            stripslashes($this->_request->getPost('arrayrepeticiones'))
        );
        $objTareaModel = new CmpgestionartareaModel();
        foreach ($arrayrepeticiones as $key => $repeticion) {
            $fechainicio = $repeticion->fechainicioRe;
            $fechafin = $repeticion->fechafinRe;
            $tiporepeticion = $repeticion->tipoDeRep;
            $arrayrepeticiones[$key]->fechainicio
                = $objTareaModel->ConvertirFecha($fechainicio, 'T');
            $arrayrepeticiones[$key]->fechafin
                = $objTareaModel->ConvertirFecha($fechafin, 'T');
            $arrayrepeticiones[$key]->tiporepeticion = $tiporepeticion;
        }
        $objDatProyecto = new DatProyecto();
        $objElemento = $objDatProyecto->buscarElementoPorId($idtarea);
        if (isset($objElemento[0])) {
            $parametros->porcientocump = $objElemento[0]['gradocumplimiento'];
            $parametros->denelemento = $objElemento[0]['denelemento'];
            $parametros->descelemento = $objElemento[0]['descelemento'];
            $parametros->peso = $objElemento[0]['peso'];
            $parametros->idusuariocrea = $objElemento[0]['idusuariocrea'];

            $objTareaModel = new CmpgestionartareaModel();
            $objTarea = Doctrine::getTable('DatTarea')->find(
                $idtarea
            );
            $parametros->arrayrepeticiones = $arrayrepeticiones;
            $parametros->idpadre = $idelementopadre;
            $parametros->duracionE = $objTarea->duracionestimada;
            $parametros->duracionR = $objTarea->duracionreal;
            $parametros->plantilla = $objTarea->plantilla;
            $parametros->criterioeval = $objTarea->idevaluacion;
            $parametros->principal = $objTarea->esprincipal;
            $idcategoria = $objDatProyecto->buscarNomencladorDadoId(
                $idtarea, 16
            );
            $parametros->idcategoria = $idcategoria[0]['idnomenclador'];
            $idtipotarea = $objDatProyecto->buscarNomencladorDadoId(
                $idtarea, 17
            );
            $parametros->idtipotarea = $idtipotarea[0]['idnomenclador'];
            $objTareaModel->adicionarRepeticiones($parametros);

            $respuesta = 1;
        } else {
            $respuesta = 0;
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    function modificarrepeticionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->fechainicio = $this->_request->getPost(
            'dffechainiciorepaleatoria'
        );
        $parametros->fechafin = $this->_request->getPost(
            'dffechafinrepaleatoria'
        );
        $parametros->lugar = $this->_request->getPost('tflugarrepaleatoria');
        $parametros->tiporepeticion = 2;
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->idtarearepeticion = $this->_request->getPost(
            'idtarearepeticion'
        );
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayinvolucradoseliminar = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucradoseliminar'))
        );
        $objTareaModel = new CmpgestionartareaModel();
        $respuesta = $objTareaModel->modificarRepeticion($parametros);
        echo json_encode(array('mensaje' => $respuesta));
    }

    function eliminarrepeticionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idtarea = $this->_request->getPost('idtarea');
        $parametros->arrayrepeticiones = json_decode(
            stripslashes($this->_request->getPost('arrayrepeticiones'))
        );
        $objTareaModel = new CmpgestionartareaModel();
        $respuesta = $objTareaModel->eliminarRepeticion(
            $parametros
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function duplicarProyectoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->denelemento = $this->_request->getPost('tfdenominacion');
        $parametros->descelemento = $this->_request->getPost('hedescripcion');
        $parametros->tipo = $this->_request->getPost('tipo');
        $parametros->plantilla = $this->_request->getPost('plantilla');
        if ($parametros->plantilla != 1) {
            $parametros->fechainicio = $this->_request->getPost('fini');
            $parametros->fechafin = $this->_request->getPost('ffin');
            $parametros->duracionR = $this->_request->getPost('duracionR');
            $parametros->idestadocump = $this->_request->getPost('estadoCumpl');
            $parametros->porcientocump = $this->_request->getPost(
                'porcientocump'
            );
        }
        $parametros->idcategoria = $this->_request->getPost('idnomenclador');
        $parametros->duracionE = $this->_request->getPost('duracionE');
        $parametros->identificacion = $this->_request->getPost(
            'identificacion'
        );
        $parametros->generarproyecto = 0;
        $parametros->idprioridad = $this->_request->getPost('idprioridad');
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('arrayinvolucrados'))
        );
        $parametros->arrayinvolucradoseliminar = json_decode(
            stripslashes(
                $this->_request->getPost('arrayinvolucradoseliminar')
            )
        );
        $parametros->idEstructura = json_decode(
            stripslashes($this->_request->getPost('idEstructura'))
        );
        $objTareaModel = new CmpgestionarplantillaModel();
        $resultados = $objTareaModel->generarProyectodeInsertandoNodo($parametros);
        if ($resultados['existe_identificador'] != 'existe') {
            if ($parametros->plantilla != 1) {
                $parametros->tareas = $resultados['tareas'];
                $objTareaModel->funcionSetFechas($parametros);
                $objTareaModel->adicionarfechaProyecto(
                    $resultados['tareas'], $resultados['idproyecto']
                );
                $objTareaModel->adicionarfechaHitos($resultados['idproyecto']);
            } else {
                $objTareaModel->adicionarDuracionPlantilla(
                    $resultados['tareas'], $resultados['idproyecto']
                );
                $objTareaModel->adicionarDuracionHitos($resultados['idproyecto']);
            }
            if ($resultados['idproyecto'] != 0) {
                echo json_encode(array('mensaje' => 1));
            } else {
                echo json_encode(array('mensaje' => 0));
            }
        } else {
            echo json_encode(array('mensaje' => 0, 'msg' => 'Existe un proyecto con esta identificación.'));
        }
    }

    function generarProyectodePlantillaAction()
    {

        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros = json_decode(stripslashes($this->_request->getPost('proyecto')));
        $parametros->fechainicio = $this->_request->getPost('fechainicio');

        if ($this->_request->getPost('horainicio') != '') {
            $parametros->horainicio = $this->_request->getPost('horainicio');
        } else {
            $parametros->horainicio = 0;
        }
        if ($this->_request->getPost('compresion')) {
            $parametros->compresion = json_decode(
                stripslashes($this->_request->getPost('compresion'))
            );
        }
        $parametros->denelemento = $this->_request->getPost('denominacion');
        $parametros->identificacion = $this->_request->getPost('identificacion');
        $parametros->generarproyecto = 1;
        $parametros->plantilla = $this->_request->getPost('plantilla');
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idEstructura = json_decode(stripslashes($this->_request->getPost('idEstructura')));
        $parametros->ignorarFinSemana = $this->_request->getPost('ignorarFinSemana');
        $parametros->regimen8hrs = $this->_request->getPost('regimen8hrs');
        $parametros->idfondotiempo = $this->_request->getPost('idfondotiempo');

        $objTareaModel = new CmpgestionarplantillaModel();
        $resultados = $objTareaModel->generarProyectodeInsertandoNodo($parametros);
        if ($resultados['existe_identificador'] != 'existe') {
            $parametros->tareas = $resultados['tareas'];
            if ($parametros->plantilla == 0) {
                $result = $objTareaModel->funcionSetFechas($parametros);
                if (isset($result['mensaje']) && ($result['mensaje'] == 2)) {
                    $proyecto->id = $resultados['idproyecto'];
                    $this->model[0]->eliminarProyecto(array($proyecto));
                    echo json_encode(array('mensaje' => $result['mensaje'], 'msg' => $result['msg']));
                } else {
                    $objTareaModel->adicionarfechaProyecto($resultados['tareas'], $resultados['idproyecto']);
                    $objTareaModel->adicionarfechaHitos($resultados['idproyecto']);
                    echo json_encode(array('mensaje' => 1));
                }
            } else {
                $objTareaModel->adicionarfechaProyecto($resultados['tareas'], $resultados['idproyecto']);
                $objTareaModel->adicionarfechaHitos($resultados['idproyecto']);
                echo json_encode(array('mensaje' => 1));
            }
        } else {
            echo json_encode(array('mensaje' => 0, 'msg' => 'Existe un proyecto con esta identificación.'));
        }
    }

    function cargarFormElementoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->tipo = $this->_request->getPost('tipo');
        $parametros->plantilla = $this->_request->getPost('plantilla');

        $objelemento = $this->model[0]->buscarProyecto($parametros->idelemento);

        if (isset($objelemento[0]['idelemento'])) {

            $arrayestadosaprob = $this->pIntegrator->workflow->DenomEstado($objelemento->idestadoaprob);
            $parametros->idusuariocrea = $objelemento[0]['idusuariocrea'];
            $dat->data [] = array(
                'idelemento' => $objelemento[0]['idelemento'],
                'autor' => $this->integrator->seguridad->nombreUsuario($objelemento[0]['idusuariocrea']),
                'denominacion' => $objelemento[0]['denelemento'],
                'descripcion' => empty($objelemento[0]['descelemento']) ? '' : $objelemento[0]['descelemento'],
                /* 'categoria'           => array('idcategoria'  => $categoriaactividad->idnomenclador,
                  'denominacion' => $categoriaactividad->dennomenclador), */
                'gradocumplimiento' => $objelemento[0]['gradocumplimiento'],
                'estadocumplimiento' => $objelemento[0]['estadocumplimiento'],
                'mensaje' => 1,
                'peso' => $objelemento[0]['peso'],
                'plantilla' => $parametros->plantilla
            );

            if (isset($arrayestadosaprob[0])) {
                $nombreestadoapro = $arrayestadosaprob[0]->denominacion;
            }

            if ($parametros->tipo == 10) {

                $objproy = Doctrine::getTable('DatTarea')->find($parametros->idelemento);
                $dat->data[0]['idtarea'] = $objproy->idtarea;
                $dat->data[0]['lugar'] = $objproy->lugar;
                $dat->data[0]['principal'] = $objproy->esprincipal;
                $dat->data[0]['evaluacion'] = $objproy->idevaluacion;
                $dat->data[0]['horainicio'] = $objproy->horainicio;
                $dat->data[0]['horafin'] = $objproy->horafin;
                $dat->data[0]['evento'] = $objproy->evento;

                $dat->data[0]['unidadmedida'] = $objproy->unidadmedida;
                $dat->data[0]['valorreal'] = $objproy->valorreal;
                $dat->data[0]['valormeta'] = $objproy->valormeta;
                $dat->data[0]['costo'] = $objproy->costo;
                $dat->data[0]['clave'] = $objproy->clave;

                $dat->data[0]['tiempooptimista'] = $objproy->tiempooptimista;
                $minutos = $dat->data[0]['tiempooptimista']; // * 60;
                $tiempodesglosado = self::toHours($minutos, '');
                $dat->data[0]['diasOpt'] = $tiempodesglosado['dias'];
                $dat->data[0]['horasOpt'] = $tiempodesglosado['horas'];
                $dat->data[0]['minutosOpt'] = $tiempodesglosado['minutos'];

                $dat->data[0]['tiempomedio'] = $objproy->tiempomedio;
                $minutos = $dat->data[0]['tiempomedio']; // * 60;
                $tiempodesglosado = self::toHours($minutos, '');
                $dat->data[0]['diasMed'] = $tiempodesglosado['dias'];
                $dat->data[0]['horasMed'] = $tiempodesglosado['horas'];
                $dat->data[0]['minutosMed'] = $tiempodesglosado['minutos'];

                $dat->data[0]['tiempopesimista'] = $objproy->tiempopesimista;
                $minutos = $dat->data[0]['tiempopesimista']; // * 60;
                $tiempodesglosado = self::toHours($minutos, '');
                $dat->data[0]['diasPes'] = $tiempodesglosado['dias'];
                $dat->data[0]['horasPes'] = $tiempodesglosado['horas'];
                $dat->data[0]['minutosPes'] = $tiempodesglosado['minutos'];

                $tipotarea = $this->model[0]->buscarNomencladorId(17, $parametros->idusuariocrea, $parametros->idelemento);
                $dat->data[0]['tipotarea'] = array('idtipotarea' => $tipotarea->idnomenclador, 'denominacion' => $tipotarea->dennomenclador);

                //categoria tarea
                $cattarea = $this->model[0]->buscarNomencladorId(16, $parametros->idusuariocrea, $parametros->idelemento);
                $dat->data[0]['categoria'] = array('idnomenclador' => $cattarea->idnomenclador, 'denominacion' => $cattarea->dennomenclador);

                //criterio de evaluacion
                if ($objproy->idevaluacion != "") {
                    $idevaluacion = $objproy->idevaluacion;
                    $evaltarea = $this->model[0]->buscarCriterioId($idevaluacion);
                    $dat->data[0]['criterioeval'] = array('ideval' => $evaltarea[0]->idnomenclador, 'denominacion' => $evaltarea[0]->dennomenclador);
                }
            }
            if ($parametros->tipo == 9) {
                $objproy = Doctrine::getTable('DatHito')->find($parametros->idelemento);
                $dat->data[0]['idhito'] = $objproy->idhito;
                //categoria del hito
                $cattarea = $this->model[0]->buscarNomencladorId(
                    15, $parametros->idusuariocrea, $parametros->idelemento
                );
                $dat->data[0]['categoria']
                    = array('idnomenclador' => $cattarea->idnomenclador,
                    'denominacion' => $cattarea->dennomenclador);
                /* $objproy->duracionestimada = round(
                  ($objproy->duracionestimada / 24) / 60
                  ); */
            }
            if ($parametros->tipo == 8) {
                $objproy = Doctrine::getTable('DatProyecto')->find($parametros->idelemento);
                $dat->data[0]['identificador'] = $objproy->identificador;
                $dat->data[0]['idproyecto'] = $objproy->idproyecto;
                //cargar prioridad proyecto
                $priotarea = $this->model[0]->buscarNomencladorId(19, $parametros->idusuariocrea, $parametros->idelemento);
                $dat->data[0]['prioridad']
                    = array('idprioridad' => $priotarea->idnomenclador,
                    'denominacion' => $priotarea->dennomenclador);
                //cargar categoria proyecto
                $cattarea = $this->model[0]->buscarNomencladorId(
                    14, $parametros->idusuariocrea, $parametros->idelemento
                );
                $dat->data[0]['categoria']
                    = array('idnomenclador' => $cattarea->idnomenclador,
                    'denominacion' => $cattarea->dennomenclador);
                /* $objproy->duracionestimada = round(
                  ($objproy->duracionestimada / 24) / 60
                  ); */
            }
            $dat->data[0]['fechainicio'] = $objproy->fechainicio;
            $dat->data[0]['fechafin'] = $objproy->fechafin;
            $dat->data[0]['duracionreal'] = $objproy->duracionreal;

            $dat->data[0]['duracionestimada'] = $objproy->duracionestimada;
            $minutos = $dat->data[0]['duracionestimada']; // * 60;
            $tiempodesglosado = self::toHours($minutos, '');
            $dat->data[0]['dias'] = $tiempodesglosado['dias'];
            $dat->data[0]['horas'] = $tiempodesglosado['horas'];
            $dat->data[0]['minutos'] = $tiempodesglosado['minutos'];

            echo json_encode($dat);
        } else {
            echo json_encode(array('mensaje' => 0));
        }
        /*   $categoriaactividad
          = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
          $idactividad, 2, 3
          );
          $tipoactividad
          = $objcmpelementosmodel->DameNomencladorDadoIdElemento(
          $idactividad, 3, 3
          );
          $puedeActualizarporciento = self::verificarDependencias(
          $idactividad
          );
          $porcientocumpli = DatElementos::obtenerPorcientoCmplimiento(
          $idactividad
          ); */
    }

    public function toHours($min, $type)
    {
        //obtener segundos
        $sec = $min * 60;
        //dias es la division de n segs entre 86400 segundos que representa un dia
        $dias = floor($sec / 86400);
        //mod_hora es el sobrante, en horas, de la division de dÃ¯Â¿Â½as;
        $mod_hora = $sec % 86400;
        //hora es la division entre el sobrante de horas y 3600 segundos que representa una hora;
        $horas = floor($mod_hora / 3600);
        //mod_minuto es el sobrante, en minutos, de la division de horas;
        $mod_minuto = $mod_hora % 3600;
        //minuto es la division entre el sobrante y 60 segundos que representa un minuto;
        $minutos = floor($mod_minuto / 60);

        $text['dias'] = ($dias < 0) ? 0 : $dias;
        $text['horas'] = ($horas < 0) ? 0 : $horas;
        $text['minutos'] = $minutos;

        return $text;
    }

    /**
     * Accion para reorganizar subElementos
     */
    function reorganizarElementosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->arraysubElementos = json_decode(
            stripslashes($this->_request->getPost('arraysubElementos'))
        );
        $parametros->elementoPadre = json_decode(
            stripslashes($this->_request->getPost('elementoPadre'))
        );
        $respuesta = $this->model[2]->reorganizarSubElementos($parametros);
        echo json_encode(array('mensaje' => $respuesta));
    }

    public function actualizarCumplimientoTareasAntecedenAction()
    {
        $parametros->arrayidelementos = json_decode(
            stripslashes($this->_request->getPost('arrayidtareas'))
        );

        $arrayResultado = array();
        foreach ($parametros->arrayidelementos as $elemento) {

            $this->model[0]->getDependenciasSuperiores($elemento->id, $arrayResultado);
            $arrayResultado[count($arrayResultado)] = $elemento->id;
            $respuesta = $this->model[0]->actualizarCumplimientoTareasAnteceden($arrayResultado);
        }
        $arrayidelementos = self::eliminarRepetidos($arrayResultado);

        echo json_encode(
            array('respuesta' => $respuesta,
                'arrayidTareas' => $arrayidelementos)
        );
    }

    function eliminarRepetidos($array)
    {
        $nuevoArray = Array();
        // bucle recorriendo
        $pos = 0;
        for ($i = 0; $i < count($array); $i++) {
            $repetido = false;
            # por cada posicion que recorremos, revisamos que no este
            # ya en el array de valores, reviando desde el primer elemento
            # hasta el que estamos revisando
            for ($j = 0; $j < $i; $j++) {
                if ($array[$i] == $array[$j])
                    $repetido = true;
            }
            if (!$repetido) {
                $nuevoArray[$pos]['id'] = $array[$i];
                $nuevoArray[$pos]['gradocumplimiento'] = 100;
                $pos++;
            }
        }
        return $nuevoArray;
    }

    public function actualizarCumplimientoAction()
    {
        $parametros->cumplimiento = ($this->_request->getPost('cumplimiento') != null) ? $this->_request->getPost('cumplimiento') : 100;
        $parametros->arrayidelementos = json_decode(
            stripslashes($this->_request->getPost('arrayidtareas'))
        );

        if ($parametros->cumplimiento >= 100) {
            foreach ($parametros->arrayidelementos as $key => $elemento) {
                $arrayDependencias = DatProyecto::getDependenciasAnteriores($elemento->id);

                if (count($arrayDependencias) != 0) {
                    $respuesta = $this->model[2]->verificarCumplimientoTareas($arrayDependencias);
                }
            }

            for ($i = 0; $i < count($arrayDependencias); $i++) {
                $arrayidelementos[$i]['id'] = $arrayDependencias[$i]['idelementopadre'];
                $arrayidelementos[$i]['gradocumplimiento'] = $parametros->cumplimiento;
            }
            for ($i = count($arrayDependencias); $i < count($arrayDependencias) + 1; $i++) {
                $arrayidelementos[$i]['id'] = $parametros->arrayidelementos[0]->id;
                $arrayidelementos[$i]['gradocumplimiento'] = $parametros->cumplimiento;
            }
        }

        if ($respuesta == 'no') {
            echo json_encode(
                array('respuesta' => '0',
                    'arrayidTareas' => $arrayidelementos)
            );
        } else {
            $parametros->metodo = $this->_request->getPost('metodo');
            $respuesta = $this->model[2]->actualizarCumplimiento($parametros);
            echo json_encode(
                array('respuesta' => $respuesta,
                    'arrayidTareas' => $parametros->arrayidelementos)
            );
        }
    }

    public function cargarMatrizRecursoAction()
    {
        $parametros->idproyecto = $this->_request->getPost('idproyecto');
        $parametros->denproyecto = $this->_request->getPost('denproyecto');
        $respuesta = $this->model[0]->cargarMatrizRecurso($parametros);
        echo json_encode($respuesta);
    }

    public function cargarMatrizHibridaAction()
    {
        $parametros->idproyecto = $this->_request->getPost('idproyecto');
        $parametros->denproyecto = $this->_request->getPost('denproyecto');
        $respuesta = $this->model[0]->cargarMatrizHibrida($parametros);
        echo json_encode($respuesta);
    }

    public function cargarMatrizHibridaTareasAction()
    {
        $parametros->idproyecto = $this->_request->getPost('idproyecto');
        $parametros->denproyecto = $this->_request->getPost('denproyecto');
        $respuesta = $this->model[0]->cargarMatrizHibridaTareas($parametros);
        echo json_encode($respuesta);
    }

    public function cargarMatrizTiemposAction()
    {
        $parametros->idproyecto = $this->_request->getPost('idproyecto');
        $parametros->denproyecto = $this->_request->getPost('denproyecto');
        $respuesta = $this->model[0]->cargarMatrizTiempos($parametros);
        echo json_encode($respuesta);
    }

    public function exportardatoselementosAction()
    {
        $parametros->idelemento = $this->_request->getPost('idelemento');
        $parametros->denelemento = $this->_request->getPost('denelemento');
        $parametros->tipo = $this->_request->getPost('tipo');
        $parametros->nombrefichero = $this->_request->getPost('nombrefichero');
        $parametros->encrypt = $this->_request->getPost('encrypt');
        $respuesta = $this->model[0]->exportardatoselementos($parametros);
        echo json_encode($respuesta);
    }

    public function importardatoselementosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $resultado = 1;
        try {
            $parametros->idusuariocrea = $this->global->Perfil->idusuario;
            $parametros->idpersona = $this->global->Perfil->idpersona;
            $parametros->idelemento = $this->_request->getPost('idelemento');
            $parametros->tipo = $this->_request->getPost('tipo');
            $parametros->idEstructura = json_decode(
                stripslashes($this->_request->getPost('idEstructura'))
            );
            $session = Zend_Registry::get('session');
            $certificado = $session->certificado;

            // obtener el tamano maximo aceptado por el servidor
            $uploadmax = (Integer)substr(ini_get('upload_max_filesize'), 0, strlen(ini_get('upload_max_filesize')) - 1);
            // obtener el tamano maximo que se puede enviar por POST
            $maxsize = (Integer)substr(ini_get('post_max_size'), 0, strlen(ini_get('post_max_size')) - 1);
            // comprobando cual de ambos valores son menosres para entonces utilizar ese como referencia
            if ($uploadmax < $maxsize) {
                $maxsize = $uploadmax;
            }
            if ($_FILES['file']) {

                $filename = $_FILES['file']['tmp_name'];
                $params['file'] = $filename;
                $fileextension = $_FILES['file']['type'];
                $filename = explode('.', $_FILES['file']['name']);
                if ($fileextension == 'application/vnd.ms-excel'
                    || $fileextension == 'application/xls'
                    || $fileextension == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    || $filename[count($filename) - 1] == 'xls'
                    || $filename[count($filename) - 1] == 'xlsx'
                ) {

                    $ruta = '../models/bussines/ReaderModel.php';
                    include_once(dirname(__FILE__) . $ruta);
                    $data = new ReaderModel();
                    $data->setOutputEncoding('CP1251');
                    $data->read($params['file']);

                    if ($data->ole->data) {
                        $busca_cadena = "<th>Nro</th>
                        <th>Nivel</th>
                        <th>Denominacion</th> 
                        <th>Fecha inicio</th>
                        <th>Fecha fin </th> 
                        <th>Hora inicio </th>
                        <th>Hora fin </th>
                        <th>Padre</th>
                        <th>Duracion estimada</th>
                        <th>Plantilla</th>";

                        $pos = strpos($data->ole->data, $busca_cadena);

                        if ($pos === false) {
                            $informacion = $this->model[0]->seguridad("AES-128-ECB", $data->ole->data, "descrypt");
                        } else {
                            $informacion = $data->ole->data;
                        }
                        $dom = new DOMDocument();
                        // The @ in front of $dom will suppress any warnings
                        $domHtml = @$dom->loadHTML($informacion);

                        //discard white space
                        $dom->preserveWhiteSpace = false;

                        //the table by its tag name
                        $tables = $dom->getElementsByTagName('tbody');

                        //get all rows from the table
                        $rows = $tables->item(0)->getElementsByTagName('tr');

                        $primeraNivel = $rows[0]->getElementsByTagName('td');

                        switch ($primeraNivel->item(1)->nodeValue . $primeraNivel->item(9)->nodeValue) {
                            case "hito0":
                                if ($parametros->tipo !== "proyecto") {
                                    $resultado = 2;
                                }
                                break;
                            case "hito1":
                                if ($parametros->tipo !== "plantilla") {
                                    $resultado = 3;
                                }
                                break;
                            case "tarea0":
                                if ($parametros->tipo === "") {
                                    $resultado = 4;
                                } else if ($parametros->tipo !== "proyecto") {
                                    $resultado = 5;
                                } else if ($parametros->tipo !== "plantilla") {
                                    $resultado = 6;
                                }
                                break;
                        }

                        // loop over the table rows
                        if ($resultado == 1) {
                            $i = 0;
                            $liste_element = array();
                            foreach ($rows as $row) {
                                // get each column by tag name
                                $cols = $row->getElementsByTagName('td');
                                // echo the values
                                $liste_element[$i]['nro'] = $cols->item(0)->nodeValue;
                                $liste_element[$i]['nivel'] = $cols->item(1)->nodeValue;
                                $liste_element[$i]['denominacion'] = $cols->item(2)->nodeValue;
                                $liste_element[$i]['fechainicio'] = $cols->item(3)->nodeValue;
                                $liste_element[$i]['fechafin'] = $cols->item(4)->nodeValue;
                                $liste_element[$i]['horainicio'] = $cols->item(5)->nodeValue;
                                $liste_element[$i]['horafin'] = $cols->item(6)->nodeValue;
                                $liste_element[$i]['padre'] = $cols->item(7)->nodeValue;
                                $liste_element[$i]['duracionestimada'] = $cols->item(8)->nodeValue;
                                $liste_element[$i]['plantilla'] = $cols->item(9)->nodeValue;
                                $liste_element[$i]['CAR'] = $cols->item(10)->nodeValue;
                                $liste_element[$i]['dependencia'] = $cols->item(11)->nodeValue;
                                $liste_element[$i]['idelementosistema'] = '';

                                $i++;
                            }
                            $resultado = $this->model[0]->adicionarElementoImportado($parametros, $liste_element);
                        }
                    }
                }
            }
        } catch (Exception $e) {
            $resultado = 7;
        }
        echo json_encode(array('mensaje' => $resultado, 'msgText' => 'Exito')); // mensaje de error
    }

    public function obtenerReporteAction()
    {
        ini_set("max_execution_time", 6000000);
        ini_set("memory_limit", "1024M");
        try {
            $data = Zend_Json_Decoder::decode($this->_request->getPost('parametros'));
            $result = $this->model[0]->getDatosReporte($data);

            $report = $this->pIntegrator->reportes->obtenerReporte($result);
            echo Zend_Json_Encoder::encode(array('html' => $report));
        } catch (Exception $exc) {
            echo Zend_Json::encode(array('success' => false, 'codMsg' => 4, 'mensaje' => $exc->getMessage(), 'detalles' => $exc->getTraceAsString()));
        }
    }

    public function getAllTareasByProyectoAction()
    {
        $idproyecto = json_decode($this->_request->getPost('idproyecto'));
        $respuesta = array();
        $respuesta = $this->model[0]->getTareasProyecto(
            $idproyecto, $respuesta, 0
        );
        $data = array();
        foreach ($respuesta as $val) {
            unset($val[0]);
            unset($val[1]);
            unset($val[2]);
            unset($val[3]);
            unset($val[4]);
            $data[] = $val;
        }
        echo json_encode(
            array(
                'success' => true,
                'tareas' => $data,
                'idelemento' => $parametros->padre,
                'user' => $this->global->Perfil->usuario
            )
        );
    }

    public function getAllTareasByEjercicioAction()
    {
        $idejercicio = json_decode($this->_request->getPost('idejercicio'));
        $data = CmpgestionarejercicioModel::getTareasEjercicio($idejercicio);
        echo json_encode(
            array(
                'success' => true,
                'tareas' => $data
            )
        );
    }

    function obtenerTareasParaChequearAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariosession = $this->global->Perfil->idusuario;
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 10;
        $arrayTareas = $this->model[0]->obtenerTareasParaChequear($parametros);
        if (isset($arrayTareas['resultado'][0])) {
            echo json_encode(
                array('success' => true,
                    'total' => $arrayTareas['total'],
                    'data' => $arrayTareas['resultado'])
            );
        } elseif ($arrayTareas['total'] == 0) {
            echo json_encode(
                array('success' => true,
                    'total' => 0,
                    'data' => array())
            );
        }
    }

    public function cargarArbolEstructurasAction()
    {
        $idEstructura = ($this->_request->getPost('node') && $this->_request->getPost('node') != 'nodo2') ? $this->_request->getPost('node') : 0;
        $valor = $this->_request->getPost('denominacion');
        $iddominio = $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
            $iddominio, $idEstructura, 0, 0, 3
        );
        $result = array();
        foreach ($dominios as $key => $val) {
            if ($valor != null) {
                $flag = stristr($val['text'], $valor);
            }
            if ($val['tipo'] != 7) {
                $result[$key] = $val;
                $result[$key]['qtip'] = $val['text'];
            }
        }
        if ($valor != null) {
            foreach ($result as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($result[$key]);
                }
            }
            $res = array();
            $i = 0;
            foreach ($result as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $result = $res;
        }
        echo json_encode($result);
    }

    function _xml2array($xmlObject, $out = array())
    {
        foreach ((array)$xmlObject as $index => $node) {

            $out[$index] = (is_object($node)) ? _xml2array($node) : $node;
        }

        return $out;
//        print_r($out->Task[10];die;
    }

    function rmDir_rf($carpeta)
    {
        $folderCont = scandir($carpeta);
        foreach ($folderCont as $clave => $valor) {
            if (is_dir($folderCont[$clave] . '/' . $valor) && $valor != '.' && $valor != '..') {
                rmDir_rf($carpeta . '/' . $folderCont[$clave]);
            } else {
                unlink($carpeta . '/' . $folderCont[$clave]);
            }
        }
//        rmdir($carpeta);
    }

    function diffDias($fechaInicio, $fechaFin)
    {
        $fechaInicial = explode('-', $fechaInicio);
        $fechaFinal = explode('-', $fechaFin);


        $timestamp1 = mktime(0, 0, 0, $fechaInicial[1], $fechaInicial[2], $fechaInicial[0]);
        $timestamp2 = mktime(0, 0, 0, $fechaFinal[1], $fechaFinal[2], $fechaFinal[0]);

        $segundos_diferencia = $timestamp1 - $timestamp2;
        $dias_diferencia = $segundos_diferencia / (60 * 60 * 24);
        $dias_diferencia = abs($dias_diferencia);
        $dias_diferencia = floor($dias_diferencia);

        return $dias_diferencia;
    }

    function importarProyectoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');

        // obtener el tamano maximo aceptado por el servidor
        $uploadmax = (Integer)substr(ini_get('upload_max_filesize'), 0, strlen(ini_get('upload_max_filesize')) - 1);
        // obtener el tamano maximo que se puede enviar por POST
        $maxsize = (Integer)substr(ini_get('post_max_size'), 0, strlen(ini_get('post_max_size')) - 1);
        // comprobando cual de ambos valores son menosres para entonces utilizar ese como referencia
        if ($uploadmax < $maxsize) {
            $maxsize = $uploadmax;
        }

        if ($_FILES['file']) {

            $filename = $_FILES['file']['tmp_name'];
            $fileextension = $_FILES['file']['type'];
            $filename1 = explode('.', $_FILES['file']['name']);
            if ($fileextension == 'text/xml' ||
                $fileextension == 'text/xml' ||
                $filename1[count($filename1) - 1] == 'xml' ||
                $filename1[count($filename1) - 1] == 'xml'
            ) {

                $xml = file_get_contents($filename, true);
                $file = new SimpleXMLElement($xml);

                $resta = 2;
                $arrayIdPadres = array();

                try {

                    //recorremos por cada tarea
                    foreach ($file->Tasks as $tipo) {

                        foreach ($tipo->Task as $c => $Tarea) {

                            if ((String)$Tarea->OutlineNumber == 0 && (String)$Tarea->OutlineLevel == 0) {
                                //no hago nada porque en esta posicion esta el nombre del documento que estoy importando
                            } else {

                                $fini = explode('T', (String)$Tarea->Start);
                                $ffin = explode('T', (String)$Tarea->Finish);

                                //insertamos al padre del proyecto
                                if ((String)$Tarea->OutlineNumber == 1 && (String)$Tarea->OutlineLevel == 1) {

                                    $parametros->denelemento = (String)$Tarea->Name;
                                    $parametros->descelemento = (String)$Tarea->Notes ? (String)$Tarea->Notes : '';
                                    $parametros->idcategoria = null;
                                    $parametros->idestadocump = (((String)$Tarea->PercentComplete == 100) ? 'Cumplida' : ((String)$Tarea->PercentComplete == 0) ? 'Sin cumplir' : 'Parcialmente cumplida');

                                    $parametros->fechainicio = $fini[0];
                                    $parametros->fechafin = $ffin[0];

                                    $parametros->duracionE = 25.016666666666666;
                                    $parametros->duracionEstimadaDias = self::diffDias($fini[0], $ffin[0]);
                                    $parametros->duracionEstimadaHoras = 0;
                                    $parametros->duracionEstimadaMinutos = 0;

                                    $parametros->identificacion = rand(1, 1000000000);
                                    $parametros->duracionR = 0;
                                    $parametros->idrecursoasociado = '';
                                    $parametros->idprioridad = null;
                                    $parametros->porcientocump = (String)$Tarea->PercentWorkComplete;
                                    $parametros->plantilla = 0;
                                    $parametros->arrayinvolucrados = Array();
                                    $parametros->verificartiempoinvol = 0;

                                    //guardo el id del proyecto para poder insertar sus hijos
                                    $idproyecto = $this->model[0]->adicionarProyecto($parametros);
                                    //almaceno el id del proyecto
                                    $arrayIdPadres[(String)$Tarea->OutlineNumber] = $idproyecto;
                                } else {

//                        $pos = explode('.', (String)$Tarea->OutlineNumber);
                                    // si es 0 el id padre es el unico valor que tiene el arreglo
                                    if (((String)$Tarea->OutlineLevel - $resta) == 0) {

                                        $idPadre = $arrayIdPadres[1];

                                        $parametros->denelemento = (String)$Tarea->Name;
                                        $parametros->descelemento = (String)$Tarea->Notes ? (String)$Tarea->Notes : '';
                                        $parametros->idcategoria = null;
                                        $parametros->idestadocump = '';

                                        $parametros->fechainicio = $fini[0];
                                        $parametros->fechafin = $ffin[0];

                                        $parametros->horainicio = '08:00:00';
                                        $parametros->horafin = '17:00:00';

                                        $parametros->duracionE = '25.02';
                                        $parametros->duracionEstimadaDias = self::diffDias($fini[0], $ffin[0]);
                                        $parametros->duracionEstimadaHoras = 0;
                                        $parametros->duracionEstimadaMinutos = 0;

                                        $parametros->duracionR = '0';
                                        $parametros->peso = '1';
                                        $parametros->porcientocump = '0';

                                        $parametros->criterioeval = null;
                                        $parametros->idtipotarea = null;
                                        $parametros->lugar = '';
                                        $parametros->principal = '0';

                                        /* $parametros->unidadmedida = null;
                                          $parametros->valorreal = null;
                                          $parametros->valormeta = null; */

                                        $parametros->plantilla = '0';
                                        $parametros->idpadre = $idPadre;
                                        $parametros->idautorpadre = $parametros->idusuariocrea;
                                        $parametros->evento = 'vacio';
                                        $parametros->tipopadre = '8';
                                        $parametros->arrayrepeticiones = Array();
                                        $parametros->arrayinvolucrados = Array();
                                        $parametros->arrayelementosrelacionados = Array();
                                        $parametros->recursoasociado = Array();
                                        $parametros->verificartiempoinvol = '0';
                                        $parametros->idSubsistema = '';

                                        if ((String)$Tarea->OutlineLevel == 2) {  // si es 2 los inserto como Hitos
                                            $idPadre = $this->model[1]->adicionarHito($parametros);
                                        } else {
                                            $idPadre = $this->model[2]->adicionarTarea($parametros);
                                        }

                                        $arrayIdPadres[(String)$Tarea->OutlineNumber] = $idPadre;
                                    } else {

                                        $pos = explode('.', (String)$Tarea->OutlineNumber);

                                        $longitud = (String)$Tarea->OutlineLevel - $resta;

                                        $posId = '';

                                        for ($i = 0; $i <= $longitud; $i++) {
                                            $posId .= $pos[$i];
                                            if ($i < $longitud) {
                                                $posId .= '.';
                                            }
                                        }

                                        $idPadre = $arrayIdPadres[$posId];

                                        $parametros->denelemento = (String)$Tarea->Name;
                                        $parametros->descelemento = (String)$Tarea->Notes ? (String)$Tarea->Notes : '';
                                        $parametros->idcategoria = null;
                                        $parametros->idestadocump = '';

                                        $parametros->fechainicio = $fini[0];
                                        $parametros->fechafin = $ffin[0];

                                        $parametros->horainicio = '08:00:00';
                                        $parametros->horafin = '17:00:00';

                                        $parametros->duracionE = '25.02';
                                        $parametros->duracionEstimadaDias = self::diffDias($fini[0], $ffin[0]);
                                        $parametros->duracionEstimadaHoras = 0;
                                        $parametros->duracionEstimadaMinutos = 0;

                                        $parametros->duracionR = '0';
                                        $parametros->peso = '1';
                                        $parametros->porcientocump = '0';

                                        $parametros->criterioeval = null;
                                        $parametros->idtipotarea = null;

                                        $parametros->lugar = '';
                                        $parametros->principal = '0';

                                        /* $parametros->unidadmedida = null;
                                          $parametros->valorreal = null;
                                          $parametros->valormeta = null; */

                                        $parametros->plantilla = '0';
                                        $parametros->idpadre = $idPadre;
                                        $parametros->idautorpadre = $parametros->idusuariocrea;
                                        $parametros->evento = 'vacio';
                                        $parametros->tipopadre = '8';
                                        $parametros->arrayrepeticiones = Array();
                                        $parametros->arrayinvolucrados = Array();
                                        $parametros->arrayelementosrelacionados = Array();
                                        $parametros->recursoasociado = Array();
                                        $parametros->verificartiempoinvol = '0';
                                        $parametros->idSubsistema = '';

                                        if ((String)$Tarea->OutlineLevel == 2) { // si es 2 los inserto como Hitos
                                            $idPadre = $this->model[1]->adicionarHito($parametros);
                                        } else {
                                            $idPadre = $this->model[2]->adicionarTarea($parametros);
                                        }

                                        $arrayIdPadres[(String)$Tarea->OutlineNumber] = $idPadre;
                                    }
                                }
                            }
                        }
                    }

                    if (count($arrayIdPadres) == 0) {
                        echo json_encode(array('mensaje' => 2)); //no se pudo importar el archivo
                    } else {
                        echo json_encode(array('mensaje' => 1)); // se importo correctamente
                    }
                } catch (Exception $e) {
                    echo json_encode(array('mensaje' => 3, 'msgText' => $e->getMessage())); // mensaje de error
                }
            } else {
                echo json_encode(array('cod' => 4, 'mensaje' => 'El fichero importado no tiene el formato establecido.'));
                return;
            }
        } else {
            echo json_encode(array('success' => false, 'max_file_size' => true, 'max_upload_size' => $maxsize, 'mensaje' => ('El tama&ntilde;o del archivo excede el l&iacute;mite de ' . $maxsize . ' permitido por el servidor.')));
            return;
        }
    }

    //Importar tareas con el excell que contiene las duraciones de To, Tp, Tm
    function importarTareav2Action()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $parametros->idpadre = $this->_request->getPost('idpadre');
        $parametros->plantilla = $this->_request->getPost('plantilla');

        // obtener el tamano maximo aceptado por el servidor
        $uploadmax = (Integer)substr(ini_get('upload_max_filesize'), 0, strlen(ini_get('upload_max_filesize')) - 1);
        // obtener el tamano maximo que se puede enviar por POST
        $maxsize = (Integer)substr(ini_get('post_max_size'), 0, strlen(ini_get('post_max_size')) - 1);
        // comprobando cual de ambos valores son menosres para entonces utilizar ese como referencia
        if ($uploadmax < $maxsize) {
            $maxsize = $uploadmax;
        }
        try {
            if ($_FILES['file']) {

                $filename = $_FILES['file']['tmp_name'];
                $params['file'] = $filename;
                $parametros->file = $filename;
                $fileextension = $_FILES['file']['type'];
                $filename = explode('.', $_FILES['file']['name']);
                if ($fileextension == 'application/vnd.ms-excel' || $fileextension == 'application/xls' || $fileextension == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || $filename[count($filename) - 1] == 'xls' || $filename[count($filename) - 1] == 'xlsx'
                ) {
                    $result = $this->model[0]->importarTareas($parametros);
                    if (isset($result['cod'])) {
                        if ($result['cod'] == 1) echo json_encode(array('mensaje' => 1));
                        elseif ($result['cod'] == 6) {
                            echo json_encode(array('cod' => 6, 'mensaje' => 'Existen valores en la primera columna con formatos incorrectos. Debe poner los valores con formato tipo TEXTO codificados a UTF-8.'));
                            return;
                        } elseif ($result['cod'] == 7) {
                            echo json_encode(array('cod' => 7, 'mensaje' => 'Existen filas con valores incorrectos o vacíos. Debe llenar todas las celdas de la fila No. ' . $result['fila'] . '.'));
                            return;
                        }

                    }
                } else {
                    echo json_encode(array('cod' => 4, 'mensaje' => 'El fichero importado no tiene el formato establecido.'));
                    return;
                }
            } else {
                echo json_encode(array('success' => false, 'max_file_size' => true, 'max_upload_size' => $maxsize, 'mensaje' => ('El tama&ntilde;o del archivo excede el l&iacute;mite de ' . $maxsize . ' MB(s) permitido(s) por el servidor.')));
                return;
            }
        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 3, 'msgText' => $e->getMessage())); // mensaje de error
        }
    }

    //Importar tareas con el excel basico
    function importarTareav1Action()
    {
        ini_set("max_execution_time", 3600); //3600 1hora

        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idEstructura = $this->_request->getPost('idEstructura');
        $parametros->idpadre = $this->_request->getPost('idpadre');
        $idpadre = $this->_request->getPost('idpadre');
        $plantilla = $this->_request->getPost('plantilla');

        // obtener el tamano maximo aceptado por el servidor
        $uploadmax = (Integer)substr(ini_get('upload_max_filesize'), 0, strlen(ini_get('upload_max_filesize')) - 1);
        // obtener el tamano maximo que se puede enviar por POST
        $maxsize = (Integer)substr(ini_get('post_max_size'), 0, strlen(ini_get('post_max_size')) - 1);
        // comprobando cual de ambos valores son menosres para entonces utilizar ese como referencia
        if ($uploadmax < $maxsize) {
            $maxsize = $uploadmax;
        }

        try {
            if ($_FILES['file']) {

                $filename = $_FILES['file']['tmp_name'];
                $params['file'] = $filename;
                $fileextension = $_FILES['file']['type'];
                $filename = explode('.', $_FILES['file']['name']);
                if ($fileextension == 'application/vnd.ms-excel' || $fileextension == 'application/xls' || $fileextension == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || $filename[count($filename) - 1] == 'xls' || $filename[count($filename) - 1] == 'xlsx'
                ) {

                    $ruta = '../models/bussines/ReaderModel.php';
                    include_once(dirname(__FILE__) . $ruta);
                    $data = new ReaderModel();
                    $data->setOutputEncoding('CP1251');
                    $data->read($params['file']);
                    $clientesAux = $data->sheets[0]['cells'];

                    $salto = 0;
                    $arrayId = array();
                    $arrayPadres = array();
                    //print_r($clientesAux);die;
                    foreach ($clientesAux as $key => $value) {
                        if ($salto != 0) {
                            if (!empty($value[0])) {
                                $fechaInicial = explode('/', $value[4]);
                                $fechaFinal = explode('/', $value[6]);

                                $fechaI = $fechaInicial[2] . '-' . $fechaInicial[1] . '-' . $fechaInicial[0];
                                $fechaF = $fechaFinal[2] . '-' . $fechaFinal[1] . '-' . $fechaFinal[0];

                                $parametros->denelemento = utf8_encode($value[1]);
                                $parametros->descelemento = '';
                                $parametros->idcategoria = null;
                                $parametros->idestadocump = '';

                                $parametros->fechainicio = $value[4];
                                $parametros->fechafin = $value[6];

                                $parametros->horainicio = $value[5] ? $value[5] : '08:00';
                                $parametros->horafin = $value[7] ? $value[7] : '17:00';

                                $parametros->duracionE = '25.02';
                                $parametros->duracionEstimadaDias = self::diffDias($fechaI, $fechaF);
                                $parametros->duracionEstimadaHoras = 0;
                                $parametros->duracionEstimadaMinutos = 0;

                                $parametros->duracionR = '0';
                                $parametros->peso = '1';
                                $parametros->porcientocump = '0';

                                $parametros->criterioeval = null;
                                $parametros->idtipotarea = null;
                                $parametros->lugar = '';
                                $parametros->principal = '0';

                                /* $parametros->unidadmedida = null;
                                  $parametros->valorreal = null;
                                  $parametros->valormeta = null; */

                                $parametros->plantilla = $plantilla;
                                $parametros->idautorpadre = $parametros->idusuariocrea;
                                $parametros->evento = 'vacio';
                                $parametros->tipopadre = '8';
                                $parametros->arrayrepeticiones = Array();

                                $parametros->arrayinvolucrados = Array();

                                //creo el array de dependencias de la actividad
                                $relaciones = Array();
                                if (isset($value[3])) {
                                    $dep = explode(';', $value[3]);
                                    $a = 0;
                                    foreach ($arrayId as $key => $id) {
                                        foreach ($dep as $rel) {
                                            if ($key == $rel) {
                                                $relaciones[$a]->idplan = null;
                                                $relaciones[$a]->idarc = null;
                                                $relaciones[$a]->idobjetivo = null;
                                                $relaciones[$a]->idfip = null;
                                                $relaciones[$a]->iddesviacion = null;
                                                $relaciones[$a]->idactividad = $id;
                                                $relaciones[$a]->tipoelemento = 10;
                                                $relaciones[$a]->origen = 6;
                                                $relaciones[$a]->porcientoinicio = null;
                                                $a++;

                                                $parametros->arrayelementosrelacionados = $relaciones;
                                            }
                                        }
                                    }
                                } else {
                                    $parametros->arrayelementosrelacionados = Array();
                                }

                                $parametros->recursoasociado = Array();
                                $parametros->verificartiempoinvol = '0';
                                $parametros->idSubsistema = '';


                                $parametros->idpadre = $idpadre;
                                $result = $this->model[2]->adicionarTarea($parametros);
                                $arrayId[$value[0]] = $result;

                                //guardo los id de los objetivos
                                if (fmod($value[0], 1) === 0.00) {
                                    $arrayPadres[$value[0]] = $result;
                                }
                            } else {
                                echo json_encode(array('cod' => 6, 'mensaje' => 'Existen valores en la columna CLAVE con formatos incorrectos. Debe poner los valores con formato tipo TEXTO codificados a UTF-8.'));
                                return;
                            }
                        }
                        $salto++;
                    }

                    if (isset($result)) {
                        echo json_encode(array('mensaje' => 1));
                    }
                } else {
                    echo json_encode(array('cod' => 4, 'mensaje' => 'El fichero importado no tiene el formato establecido.'));
                    return;
                }
            } else {
                echo json_encode(array('success' => false, 'max_file_size' => true, 'max_upload_size' => $maxsize, 'mensaje' => ('El tama&ntilde;o del archivo excede el l&iacute;mite de ' . $maxsize . ' permitido por el servidor.')));
                return;
            }
        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 3, 'msgText' => $e->getMessage())); // mensaje de error
        }
    }

    function obtenerPlanesParaFiltroAction()
    {

        $parametros->idEstructura = json_decode(stripslashes($this->_request->getPost('idEstructura')));
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->soloProyectos = $this->_request->getPost('soloProyectos');
        $arrayProyectos = $this->model[0]->obtenerPlanesParaFiltro($parametros);

        if (isset($arrayProyectos['resultado'])) {
            echo json_encode(array('data' => $arrayProyectos['resultado']));
        } else {
            echo json_encode(array('data' => array()));
        }
    }

    function obtenerHitosParaFiltroAction()
    {

        $parametros->idEstructura = json_decode(stripslashes($this->_request->getPost('idEstructura')));
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;
        $parametros->idelementopadre = $this->_request->getPost('idelementopadre');
        $arrayHitos = $this->model[0]->obtenerHitosParaFiltro($parametros);

        if (isset($arrayHitos['resultado'])) {
            echo json_encode(array('data' => $arrayHitos['resultado']));
        } else {
            echo json_encode(array('data' => array()));
        }
    }

    function obtenerInfoComprimirProyectoAction()
    {

        ini_set("max_execution_time", 6000000);
        ini_set("memory_limit", "1024M");
        try {
            $parametros = Zend_Json_Decoder::decode($this->_request->getPost('parametros'))[0];
            $resultado = $this->model[0]->getTareasProyectoComprimir($parametros, 0);
            echo json_encode(array('data' => $resultado));
        } catch (Exception $exc) {
            echo json_encode(array('data' => []));
        }
    }

    function obtenerDatosGeneralesProyectoAction()
    {

        ini_set("max_execution_time", 6000000);
        ini_set("memory_limit", "1024M");
        try {
            $parametros = Zend_Json_Decoder::decode($this->_request->getPost('parametros'))[0];
            $resultado = $this->model[0]->getVerDatosGeneralesProyectoComprimir($parametros, 1);
            echo json_encode(array('data' => $resultado));
        } catch (Exception $exc) {
            echo json_encode(array('data' => []));
        }
    }

    function involucrarUsuariosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros->idusuariocrea = $this->global->Perfil->idusuario;

        $parametros->involucrarelementoshijos = $this->_request->getPost('involucrarelementoshijos');
        $parametros->arrayinvolucrados = json_decode(stripslashes($this->_request->getPost('arrayinvolucrados')));
        $parametros->arrayelementosseleccionados = json_decode(stripslashes($this->_request->getPost('arrayelementosseleccionados')));

        $temp = $this->model[0]->involucrarUsuarios($parametros);

        if ($temp != 0) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function reorganizarElementoAction()
    {
        ini_set("max_execution_time", 3600);

        $parametros->arrayidelementopegar = json_decode(stripslashes($this->_request->getPost('arrayidelementopegar')));
        $parametros->idpadre = $this->_request->getPost('idpadre');
        $parametros->tipopadre = $this->_request->getPost('tipopadre');
        $parametros->idautorpadre = $this->_request->getPost('idautorpadre');
        //print_r($parametros->arrayidelementopegar);die;

        $temp = $this->model[0]->reorganizarElemento($parametros);

        if ($temp != 0) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function asociarRecursosAction()
    {
        ini_set("max_execution_time", 3600);

        $parametros->arrayidrecursos = json_decode(stripslashes($this->_request->getPost('arrayidrecursos')));
        $parametros->arrayidelementos = json_decode(stripslashes($this->_request->getPost('arrayidelementos')));
        //print_r($parametros->arrayidelementopegar );die;

        $temp = $this->model[2]->asociarRecursos($parametros);

        if ($temp != 0) {
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function obtenerTareasDadoProyectoAction()
    {

        $parametros->idproyecto = json_decode(stripslashes($this->_request->getPost('idproyecto')));
        $parametros->idtarea = json_decode(stripslashes($this->_request->getPost('idtarea')));
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 15;
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->filtros = $this->_request->getPost('filtros');
        $arrayTareas = $this->model[0]->obtenerTareasDadoProyecto($parametros);

        if (isset($arrayTareas['resultado'])) {
            echo json_encode(array('success' => true, 'total' => $arrayTareas['total'], 'campos' => $arrayTareas['resultado']));
        } else {
            echo json_encode(array('success' => true, 'total' => 0, 'campos' => array()));
        }
    }

    function realPorFechaEjecutadoAction()
    {

        $parametros->idtarea = json_decode(stripslashes($this->_request->getPost('idtarea')));
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 15;
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->filtros = $this->_request->getPost('filtros');
        $arrayEjecutados = $this->model[0]->realPorFechaEjecutado($parametros);

        if (isset($arrayEjecutados['resultado'])) {
            echo json_encode(array('success' => true, 'total' => $arrayEjecutados['total'], 'campos' => $arrayEjecutados['resultado']));
        } else {
            echo json_encode(array('success' => true, 'total' => 0, 'campos' => array()));
        }
    }

    function guardarEjecutadosAction()
    {

        $parametros->arrayEjecutadosAdicionados = json_decode(stripslashes($this->_request->getPost('arrayEjecutadosAdicionados')));
        $parametros->arrayEjecutadosEliminados = json_decode(stripslashes($this->_request->getPost('arrayEjecutadosEliminados')));

        $respuesta = $this->model[0]->guardarEjecutados($parametros);
        echo json_encode(array('mensaje' => $respuesta));
    }

    function eliminarEjecutadosAction()
    {

        $parametros->idtarea = $this->_request->getPost('idtarea');
        $parametros->valorreal = $this->_request->getPost('valorreal');

        $respuesta = $this->model[0]->actualizarValorReal($parametros);

        echo json_encode(array('mensaje' => $respuesta));
    }
    
    function obtenerCL2Action()
    {
        $parametros->idproyecto = $this->_request->getPost('idproyecto');
        $respuesta = $this->model[0]->obtenerCL2($parametros);

        echo json_encode(array('success' => true, 'total' => 0, 'campos' => array()));
    }

}