<?php

/**
 * Controlador para gestionar actividades
 *

 */
class CmpclasificadorinvolController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionarplan.phtml
     */
    function cmpclasificadorinvolAction()
    {
        $this->render();
    }

    function cargarclasificadorinvolAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $nodo = $this->_request->getPost('node');
        $idusuario = $this->global->Perfil->idusuario;
        $idautor = ($this->_request->getPost('idautor'))
            ? $this->_request->getPost('idautor') : null;
        $idelemento = ($this->_request->getPost('idelemento'))
            ? $this->_request->getPost('idelemento') : undefined;
        $tipo = $this->_request->getPost('tipo');
        $idgrupo = $this->_request->getPost('idgrupo');
        $estamodificando = $this->_request->getPost('estamodificando');
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $iddominio = $this->global->Perfil->iddominio;
        if ($idautor == 'undefined' || $idautor == 'null') {
            $idautor = $idusuario;
        }
        switch ($idgrupo) {
            case 'nodo1':
                $usuario
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                echo json_encode($usuario);
                break;
            case 'nodo2':
                if ($tipoelemento == 'desviacion' && $estamodificando == 1) {
                    $arraygrupos
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        $nodo, $idusuario, $idelemento, $tipo, $idgrupo, 0,
                        $tipoelemento, $iddominio, $certificado, $idautor
                    );
                    $objclasifmodel = new ClasificadorinvolModel();
                    $arraygrupos
                        = $objclasifmodel->ObtenerPublicadosParaCargarArbolInvol(
                        $idelemento, $arraygrupos
                    );
                    if ($arraygrupos) {
                        echo json_encode($arraygrupos);
                    }
                    if (!$arraygrupos) {
                        $this->showMessage(
                            'Usted no tiene grupos gestionados.'
                        );
                    }
                } else {
                    if ($tipoelemento == 'incidencia'
                        && $estamodificando == 1
                    ) {
                        $arraygrupos
                            = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                            $nodo, $idusuario, $idelemento, $tipo, $idgrupo, 0,
                            $tipoelemento, $iddominio, $certificado, $idautor
                        );
                        $objclasifmodel = new ClasificadorinvolModel();
                        $arraygruposs
                            = $objclasifmodel->ObtenerIncidenciaPublicadaGrupo(
                            $idelemento, $arraygrupos
                        );
                        if ($arraygruposs) {
                            echo json_encode($arraygruposs);
                        }
                        if (!$arraygruposs) {
                            $this->showMessage(
                                'Usted no tiene grupos gestionados.'
                            );
                        }
                    } else {
                        $arraygrupos
                            = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                            $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                            $estamodificando, $tipoelemento, $iddominio,
                            $certificado, $idautor
                        );
                        if ($arraygrupos) {
                            echo json_encode($arraygrupos);
                        }
                        if (!$arraygrupos) {
                            $this->showMessage(
                                'Usted no tiene grupos gestionados.'
                            );
                        }
                    }
                }
                break;
            case 'nodo3':
                if ($tipoelemento == 'desviacion' && $estamodificando == 1) {
                    $usersdomain
                        = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                        $nodo, $idusuario, $idelemento, $tipo, $idgrupo, 0,
                        $tipoelemento, $iddominio, $certificado, $idautor
                    );
                    $objclasifmodel = new ClasificadorinvolModel();
                    $usersdomain
                        = $objclasifmodel->ObtenerPublicadosParaCargarArbolInvol(
                        $idelemento, $usersdomain
                    );
                    if ($usersdomain) {
                      foreach ($usersdomain as $key => $value){
                        $tooltip=self::crearInformacionTooltip($value['idusuario']);
                        $usersdomain[$key]['qtip']=$tooltip;
                      }

                      echo json_encode($usersdomain);
                    }
                    if (!$usersdomain) {
                        $this->showMessage(
                            'Usted no tiene usuarios subordinados.'
                        );
                    }
                } else {
                    if ($tipoelemento == 'incidencia'
                        && $estamodificando == 1
                    ) {
                        $arraygrupos
                            = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                            $nodo, $idusuario, $idelemento, $tipo, $idgrupo, 0,
                            $tipoelemento, $iddominio, $certificado, $idautor
                        );
                        $objclasifmodel = new ClasificadorinvolModel();
                        $arraygruposs
                            = $objclasifmodel->ObtenerIncidenciaPublicadaUsuario(
                            $idelemento, $arraygrupos
                        );
                        if ($arraygruposs) {
                          foreach ($arraygruposs as $key => $value){
                            $tooltip=self::crearInformacionTooltip($value['idusuario']);
                            $arraygruposs[$key]['qtip']=$tooltip;
                          }

                            echo json_encode($arraygruposs);
                        }
                        if (!$arraygruposs) {
                            $this->showMessage(
                                'Usted no tiene usuarios subordinados.'
                            );
                        }
                    } else {
                        $usersdomain
                            = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                            $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                            $estamodificando, $tipoelemento, $iddominio,
                            $certificado, $idautor
                        );
                        if ($usersdomain) {
                            foreach ($usersdomain as $key => $value){
                              $tooltip=self::crearInformacionTooltip($value['idusuario']);
                              $usersdomain[$key]['qtip']=$tooltip;
                            }
                            echo json_encode($usersdomain);
                        }
                        if (!$usersdomain) {
                            $this->showMessage(
                                'Usted no tiene usuarios subordinados.'
                            );
                        }
                    }
                }
                break;
            case 'nodo4':
                $otros
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                if ($otros) {
                    echo json_encode($otros);
                }
                if (!$otros) {
                    $this->showMessage(
                        'Usted no posee permisos otorgados por el nivel superior para adicionar.'
                    );
                }
                break;
            case 'nodo5':
                if ($tipoelemento == 'desviacion' && $estamodificando == 1) {
                    $estructuras
                        = $this->pIntegrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
                        $idusuario
                    );
                    $objclasifmodel = new ClasificadorinvolModel();
                    $estructuras
                        = $objclasifmodel->ObtenerPublicadosParaCargarArbolInvol(
                        $idelemento, $estructuras
                    );
                    if ($estructuras) {
                        echo json_encode($estructuras);
                    }
                    if (!$estructuras) {
                        $this->showMessage(
                            'Usted no tiene estructuras que mostrar.'
                        );
                    }
                } else {
                    if ($tipoelemento == 'incidencia'
                        && $estamodificando == 1
                    ) {
                        $arraygrupos
                            = $this->pIntegrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
                            $idusuario
                        );
                        $objclasifmodel = new ClasificadorinvolModel();
                        $arraygruposs
                            = $objclasifmodel->ObtenerIncidenciaPublicadaEstructura(
                            $idelemento, $arraygrupos
                        );
                        if ($arraygruposs) {
                            echo json_encode($arraygruposs);
                        }
                        if (!$arraygruposs) {
                            $this->showMessage(
                                'Usted no tiene estructuras que mostrar.'
                            );
                        }
                    } else {
                        $estructuras
                            = $this->pIntegrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
                            $idusuario
                        );
                        if ($estructuras) {
                            echo json_encode($estructuras);
                        }
                        if (!$estructuras) {
                            $this->showMessage(
                                'Usted no tiene estructuras que mostrar.'
                            );
                        }
                    }
                }
                break;
            default:
                $usersandgrupos
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                echo json_encode($usersandgrupos);
        }
    }


    function crearInformacionTooltip($idusuario){
      $obj=new DatUsuarioEstructura();
      $datosuser_estructura=$obj->obtenerUserEstructura($idusuario);
      $tooltip='';
      if(count($datosuser_estructura)>0){
        $entidad = $this->integrator->metadatos->DameEstructura($datosuser_estructura[0]['idestructura']);
        $tooltip="Entidad: ".$entidad[0]->denominacion;
        $tooltip.=($entidad[0]->codigo!='')?" <br/> Código: ". $entidad[0]->codigo:'';
      }
      return $tooltip;
    }

    function cargarclasificadorinvolGrupoNomAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $nodo = $this->_request->getPost('node');
        $idusuario = $this->global->Perfil->idusuario;
        $idautor = $this->_request->getPost('idautor');
        $idelemento = $this->_request->getPost('idelemento');
        $tipo = $this->_request->getPost('tipo');
        $idgrupo = $this->_request->getPost('idgrupo');
        $estamodificando = $this->_request->getPost('estamodificando');
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $iddominio = $this->global->Perfil->iddominio;
        if ($idautor == 'undefined') {
            $idautor = $idusuario;
        }
        switch ($idgrupo) {
            case 'nodo1':
                $usuario
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                echo json_encode($usuario);
                break;
            case 'nodo2':
                $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                if ($arraygrupos) {
                    if ($estamodificando && isset($arraygrupos[0])) {
                        $arraygruposs = $arraygrupos;
                        $arraygrupos = array();
                        $cont = 0;
                        foreach ($arraygruposs as $grupo) {
                            if ($grupo['idgrupo'] != $idelemento) {
                                $arraygrupos[$cont] = $grupo;
                            }
                        }
                    }
                    echo json_encode($arraygrupos);
                }
                if (!$arraygrupos) {
                    $this->showMessage('Usted no tiene grupos gestionados.');
                }
                break;
            case 'nodo3':
                $usersdomain
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                if ($usersdomain) {
                    echo json_encode($usersdomain);
                }
                if (!$usersdomain) {
                    $this->showMessage(
                        'Usted no tiene usuarios subordinados gestionados.'
                    );
                }
                break;
            case 'nodo4':
                $otros
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                if ($otros) {
                    echo json_encode($otros);
                }
                if (!$otros) {
                    $this->showMessage(
                        'Usted no tiene permisos asignados por el nivel superior para adicionar.'
                    );
                }
                break;
            case 'nodo5':
                $otros
                    = $this->pIntegrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
                    $idusuario
                );
                if ($otros) {
                    echo json_encode($otros);
                }
                if (!$otros) {
                    $this->showMessage(
                        'Usted no tiene estructuras gestionadas.'
                    );
                }
                break;
            default:
                $usersandgrupos
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                echo json_encode($usersandgrupos);
        }
    }

    function cargarclasificadorbusquedaAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $nodo = $this->_request->getPost('node');
        $idusuario = $this->global->Perfil->idusuario;
        $idautor = $this->_request->getPost('idautor');
        $idelemento = $this->_request->getPost('idelemento');
        $tipo = $this->_request->getPost('tipo');
        $idgrupo = $this->_request->getPost('idgrupo');
        $estamodificando = $this->_request->getPost('estamodificando');
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $iddominio = $this->global->Perfil->iddominio;
        if ($idautor == 'undefined' || $idautor == '' || $idautor == null) {
            $idautor = $idusuario;
        }
        switch ($idgrupo) {
            case 'nodo1':
                $usuario
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                echo json_encode($usuario);
                break;
            case 'nodo2':
                $arraygrupos
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                if ($arraygrupos) {
                    echo json_encode($arraygrupos);
                }
                if (!$arraygrupos) {
                    $this->showMessage('Usted no tiene grupos gestionados.');
                }
                break;
            case 'nodo3':
                $usersdomain
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                if ($usersdomain) {
                    echo json_encode($usersdomain);
                }
                if (!$usersdomain) {
                    $this->showMessage('Usted no tiene usuarios subordinados.');
                }
                break;
            case 'nodo4':
                $otros
                    = $this->pIntegrator->configuracionpdo->DamePermisosLeerNivelSuperior(
                    $idusuario, $idgrupo
                );
                if ($otros) {
                    echo json_encode($otros);
                }
                if (!$otros) {
                    $this->showMessage(
                        'Usted no tiene permisos de lectura otorgados por el nivel superior.'
                    );
                }
                break;
            case 'nodo5':
                $otros
                    = $this->pIntegrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
                    $idusuario
                );
                if ($otros) {
                    echo json_encode($otros);
                }
                if (!$otros) {
                    $this->showMessage(
                        'Usted no tiene estructuras que mostrar.'
                    );
                }
                break;
            default:
                $usersandgrupos
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
                    $nodo, $idusuario, $idelemento, $tipo, $idgrupo,
                    $estamodificando, $tipoelemento, $iddominio, $certificado,
                    $idautor
                );
                echo json_encode($usersandgrupos);
        }
    }

    function cargarclasificadorinvolcriterioAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        //$nodo = $this->_request->getPost('node');
        //$idusuario = $this->global->Perfil->idusuario;
        //$idautor = $this->_request->getPost('idautor');
        $idobjetivo = $this->_request->getPost('idobjetivo');
        $idcriterio = $this->_request->getPost('idcriterio');
        //$tipo = $this->_request->getPost('tipo');
        $idgrupo = $this->_request->getPost('idgrupo');
        $estamodificando = $this->_request->getPost('estamodificando');
        //$tipoelemento = $this->_request->getPost('tipoelemento');
        $objclasifmodel = new ClasificadorinvolModel();
        $arrayinvolucrados = $objclasifmodel->ObtenerClasificadorCriterio(
            $idobjetivo, $idcriterio, $estamodificando, $idgrupo
        );
        if (isset($arrayinvolucrados[0])) {
            echo json_encode($arrayinvolucrados);
        } else {
            $this->showMessage(
                'No existen involucrados en el objetivo al cual pertenece este criterio de medida.'
            );
        }
    }

    function mostrarinvolucradosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idelemento = $this->_request->getPost('idelemento');
        $idtipoelemento = $this->_request->getPost('idtipoelemento');
        $obj = new ClasificadorinvolModel();
        $result = $obj->MostrarInvolucrados($idelemento, $idtipoelemento);
        if (count($result)) {
            echo json_encode(
                array('total' => count($result), 'campos' => $result)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function mostrarInvolucradosGruposAction()
    {
      ini_set("max_execution_time", 3600); //3600 1hora
      $idelemento = $this->_request->getPost('idelemento');
      $idtipoelemento = $this->_request->getPost('idtipoelemento');
      $obj = new ClasificadorinvolModel();
      $result = $obj->mostrarInvolucradosGrupos($idelemento, $idtipoelemento);
      if (count($result)) {
        echo json_encode(
          array('total' => count($result), 'campos' => $result)
        );
      } else {
        echo json_encode(array('total' => 0, 'campos' => array()));
      }
    }

    function mostrarinvolucradoscriteriosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idcriterio = $this->_request->getPost('idcriterio');
        $idtipoelemento = 6;
        $obj = new ClasificadorinvolModel();
        $result = $obj->MostrarInvolucrados($idcriterio, $idtipoelemento);
        if (count($result)) {
            echo json_encode(
                array('total' => count($result), 'campos' => $result)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function adicionarinvolucradosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $involucrado = json_decode(
            stripslashes($this->_request->getPost('involucrado'))
        );
        $idelemento = $this->_request->getPost('idelemento');
        $idtipoelemento = $this->_request->getPost('idtipoelemento');
        $estamodificando = $this->_request->getPost('estamodificando');
        $obj = new ClasificadorinvolModel();
        $obj->Involucrar(
            $involucrado, $idelemento, $idtipoelemento, $estamodificando
        );
        echo json_encode(array('mensaje' => 1));
    }

    function eliminarinvolucradosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $involucrado = json_decode(
            stripslashes($this->_request->getPost('involucrado'))
        );
        $idelemento = $this->_request->getPost('idelemento');
        $idtipoelemento = $this->_request->getPost('idtipoelemento');
        $obj = new ClasificadorinvolModel();
        $obj->EliminarInvolucrados($involucrado, $idelemento, $idtipoelemento);
        //para generar notificaciones (ARA)
        //if($respuesta == 1){
        if ($idtipoelemento == 6) {
            $idtipoelemento = 4;
        }
        $objNotificacion = new CmpnotificacionesModel();
        $accion = 5;
        $idtipoelemento = $idtipoelemento;
        $idautor
            = /*$idusuario = */
            $this->global->Perfil->idusuario;
        $fecha = date('d/m/Y H:i:s');
        $objNotificacion->generarNotificacion(
            $accion, $idelemento, $idtipoelemento, $idautor, $fecha,
            new stdClass(), $involucrado
        );
        //}
        echo json_encode(array('mensaje' => 1));
    }

    function buscarinvolucradosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $denominacion = $this->_request->getPost('denominacion');
        $idusuario = $this->global->Perfil->idusuario;
        $estamodificando = $this->_request->getPost('estamodificando');
        $idelemento = $this->_request->getPost('idelemento');
        $idtipoelemento = $this->_request->getPost('idtipoelemento');
        $permiso = $this->_request->getPost('permiso');
        $resultado = $this->pIntegrator->configuracionpdo->BuscarInvolucrados(
            $denominacion, $idusuario, $estamodificando, $idelemento,
            $idtipoelemento, $permiso
        );
        if ($resultado) {
            echo json_encode(array('nodos' => $resultado, 'msj' => 1));
        } else {
            echo json_encode(array('msj' => 3));
        }
    }

    function buscarinvolucradosobjetivoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $denominacion = $this->_request->getPost('denominacion');
        //$idusuario = $this->global->Perfil->idusuario;
        $estamodificando = $this->_request->getPost('estamodificando');
        $idobjetivo = $this->_request->getPost('idobjetivo');
        $idcriterio = $this->_request->getPost('idcriterio');
        $objclasifmodel = new ClasificadorinvolModel();
        $resultado = $objclasifmodel->BuscarInvolucradosCriterio(
            $denominacion, $estamodificando, $idobjetivo, $idcriterio
        );
        if ($resultado) {
            echo json_encode(array('nodos' => $resultado, 'msj' => 1));
        } else {
            echo json_encode(array('msj' => 3));
        }
    }

    function reasignarAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $accion = $this->_request->getPost('accion');
        if($accion==1){
          $idelemento = json_decode(
            stripslashes($this->_request->getPost('idelemento'))
          );
        }else{
          $idelemento = $this->_request->getPost('idelemento');
        }
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $arrayinvolucrados = json_decode(
            stripslashes($this->_request->getPost('involucrados'))
        );
        $idestadoaprob = $this->_request->getPost('idestadoaprob');
        $objinvolmodel = new ClasificadorinvolModel();
        if($accion==1){
          $respuesta = 0;
          foreach ($idelemento as $id){
            $respuesta = $objinvolmodel->Reasignar(
              $id, $tipoelemento, $arrayinvolucrados, $idestadoaprob,
              $idusuariosession
            );
          }
        }else{
          $respuesta = $objinvolmodel->Reasignar(
            $idelemento, $tipoelemento, $arrayinvolucrados, $idestadoaprob,
            $idusuariosession
          );
        }

        echo json_encode(array('mensaje' => $respuesta));
    }

    function cargarclasificadorinvolprecondAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $estamodificando = $this->_request->getPost('estamodificando');
        $idgrupo = $this->_request->getPost('idgrupo');
        $idprecondicion = $this->_request->getPost('idprecondicion');
        //$nodo = $this->_request->getPost('node');
        $tipo = $this->_request->getPost('tipo');
        //$idusuario = $this->global->Perfil->idusuario;
        $idautor = $this->_request->getPost('idautor');
        if ($idautor == 0) {
            $idautor = $idusuariosession;
        }
        switch ($idgrupo) {
            case 'nodo1':
                $usuario
                    = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionarPreCond(
                    $idprecondicion, $tipo, $idgrupo, $estamodificando, $idautor
                );
                echo json_encode($usuario);
                break;
            /*
              case 'nodo2':
              $arraygrupos = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
              $nodo,$idusuario,$idelemento,$tipo,$idgrupo,$estamodificando,
              $tipoelemento,$iddominio,$certificado,$idautor);
              if($arraygrupos)
              {
              echo json_encode($arraygrupos);
              }
              if(!$arraygrupos)
              {
              $this->showMessage('Usted no tiene grupos gestionados.');
              }
              break;
              case 'nodo3':
              $usersdomain = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
              $nodo,$idusuario,$idelemento,$tipo,$idgrupo,$estamodificando,
              $tipoelemento,$iddominio,$certificado,$idautor);
              if($usersdomain){echo json_encode($usersdomain);}
              if(!$usersdomain){$this->showMessage('Usted no tiene usuarios subordinados.');}
              break;
              case 'nodo4':
              $otros = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
              $nodo,$idusuario,$idelemento,$tipo,$idgrupo,$estamodificando,
              $tipoelemento,$iddominio,$certificado,$idautor);
              if($otros){echo json_encode($otros);}
              if(!$otros){$this->showMessage(
              'Usted no tiene permisos otorgados por el nivel superior para adicionar.');}
              break;
              default:
              $usersandgrupos = $this->pIntegrator->configuracionpdo->DameInvolucradosAdicionar(
              $nodo,$idusuario,$idelemento,$tipo,$idgrupo,$estamodificando,
              $tipoelemento,$iddominio,$certificado,$idautor);
              echo json_encode($usersandgrupos); */
        }
    }

    public function cargarInvolConfPerfilAction()
    {
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $idusuario = $this->global->Perfil->idusuario;
        $tienecompinvol = 'false';
        //$involucrado = array();
        //$tiponomenclador = 9;
        $uno = 1;
        $result
            = $this->pIntegrator->configuracionpdo->getConfPerfilxtipoelytipoconf(
            $tipoelemento, 3, $idusuario
        );
        if (isset($result[0])) {
            $tienecompinvol = 'true';
            foreach ($result as $key => $value) {
                if ($value['idtipo'] == 2) {
                    $estructura = $this->integrator->metadatos->DameEstructura(
                        $value['idinvolucrado']
                    );
                    $result[$key]['nombretipo'] = 'Estructura';
                    $result[$key]['denominacion']
                        = $estructura[0]->denominacion;
                    $tipoinvol
                        = $this->pIntegrator->configuracionpdo->ObtenerNomencladorPorId(
                        $value['idtipoinvolucrado']
                    );
                    $result[$key]['tipoinvolucrado']
                        = $tipoinvol[0]['dennomenclador'];
                    $result[$key]['tipoinvol'] = 1;
                    if ($tipoinvol[0]['dennomenclador'] == 'Ejecutor') {
                        $result[$key]['tipoinvol'] = 1;
                    }
                    $result[$key]['idestructura']
                        = $estructura[0]->idestructura;
                    $result[$key]['idtipoinvolucrado']
                        = $value['idtipoinvolucrado'];
                    $result[$key]['llaveinvolucrado']
                        = $estructura[0]->idestructura . $uno;
                }
                if ($value['idtipo'] == 1) {
                    $result[$key]['denominacion']
                        = $this->integrator->seguridad->nombreUsuario(
                        $value['idinvolucrado']
                    );
                    $result[$key]['nombretipo'] = 'Usuario';
                    $result[$key]['idusuario'] = $value['idinvolucrado'];
                    $tipoinvol
                        = $this->pIntegrator->configuracionpdo->ObtenerNomencladorPorId(
                        $value['idtipoinvolucrado']
                    );
                    $result[$key]['tipoinvol'] = 1;
                    if ($tipoinvol[0]['dennomenclador'] == 'Ejecutor') {
                        $result[$key]['tipoinvol'] = 1;
                    }
                    $result[$key]['tipoinvolucrado']
                        = $tipoinvol[0]['dennomenclador'];
                    $result[$key]['idtipoinvolucrado']
                        = $value['idtipoinvolucrado'];
                    $result[$key]['llaveinvolucrado']
                        = $value['idinvolucrado'] . $uno;
                }
                if ($value['idtipo'] == 0) {
                    $grupo
                        = $this->pIntegrator->configuracionpdo->DameDatosDeGrupo(
                        $value['idinvolucrado']
                    );
                    $arraygrupo = $grupo->toArray();
                    $result[$key]['nombretipo'] = 'Grupo';
                    $result[$key]['denominacion'] = $arraygrupo['dengrupo'];
                    $result[$key]['idgrupo'] = $arraygrupo['idgrupo'];
                    $tipoinvol
                        = $this->pIntegrator->configuracionpdo->ObtenerNomencladorPorId(
                        $value['idtipoinvolucrado']
                    );
                    $result[$key]['tipoinvol'] = 1;
                    if ($tipoinvol[0]['dennomenclador'] == 'Ejecutor') {
                        $result[$key]['tipoinvol'] = 1;
                    }
                    $result[$key]['tipoinvolucrado']
                        = $tipoinvol[0]['dennomenclador'];
                    $result[$key]['idtipoinvolucrado']
                        = $value['idtipoinvolucrado'];
                    $result[$key]['llaveinvolucrado']
                        = $arraygrupo['idgrupo'] . $uno;
                }
            }
        }
        echo json_encode(
            array('array_invol' => $result, 'tienecompinvol' => $tienecompinvol)
        );
    }


}

 
