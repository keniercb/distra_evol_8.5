<?php

class PortalController extends IndexController
{

    public function indexAction()
    {
        //Se redirecciona hacia la pagina de inicio del portal
        header("Location:../");
    }

    public function portalAction()
    {
        $this->view->entidadaccedida = $this->global->Estructura->denominacion;
        $this->view->mostrarentidad = Zend_Registry::getInstance()->session->perfil['mostrarentidad'];

        $perfil = $this->getPerfil();
        if ($perfil->idrol == null || $perfil->idrol == 0) {
            header("Location:/portal");
        } else {

            $idusuario = $this->global->Perfil->idusuario;
            $idpersona = $this->integrator->seguridad->getIdPersonaByIdUsuario(
                $idusuario
            );
            $arraysDestinbatario = $this->integrator->notification->getIdsDestinatarioByIdPersona(
                array($idpersona[0]['idpersona'])
            );
            $this->view->iddestinatario = $arraysDestinbatario[0];
            if ($perfil->tema) {
//                $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
//                $this->view->jsayudaconSoporte = $this->integrator->gestornc->devolverJS();
                //$this->view->gestornc = $this->integrator->gestornc->devolverJS();
                if ($perfil->portal == 'tabsautomaticos') {
                    $this->render('tabsautomaticos');
                } else {
                    try {
                        $this->view->includeperfilseguridad = $this->integrator->pvd->mostrarIUPerfilSeguridadPersona();
                    } catch (ZendExt_FastResponse_Exception $e) {
                        if (Zend_Registry::get('config')->development) {
                            $exceptionLog = new ZendExt_Exception_Log(
                                new ZendExt_Exception('NOCONTROLLED', $e)
                            );
                            $exceptionLog->handle();
                        }
                        $this->view->includeperfilseguridad = '';
                    }
                    $this->render();
                }
            } else {
                throw new ZendExt_Exception('EP002');
            }
        }
    }

    public function cargarperfilAction()
    {
        $perfil = $this->getPerfil();
        $perfil->entidad = $this->global->Estructura->denominacion;
        echo json_encode($perfil);
    }

    public function cargarperfilAndBackgroundAction()
    {
        $perfil = $this->getPerfil();
        $objApariencia = DatApariencia::devolverAparienciaUsuario(
            $perfil->idusuario
        );
        $objApariencia = $objApariencia->toArray();
        $resultado = array(
            'perfil' => $perfil,
            'background' => $objApariencia['fondo']
        );
        echo json_encode($resultado);
    }

    public function cargarperfilJabberAction()
    {
        $perfil = array('exist' => false);
        $username = $this->_request->getPost('username');
        if ($username) {
            $array = $this->integrator->seguridad->getIdPersona($username);
            $idpersona = $array[0]['idpersona'];
            if (isset($idpersona) && $idpersona) {
                $result = $array = $this->integrator->pvd->obtenerDatosdePersonaparaJabber(
                    $idpersona
                );
                $perfil['jabber'] = $result;
                $perfil['exist'] = true;
            }
        }
        echo json_encode($perfil);
    }

    public function cargarfotoperfilAction()
    {
        $perfil = $this->getPerfil();
        $result = "/seguridad/views/imgs/persona.jpg";
        $idpersona = $perfil->idpersona;
        if (isset($idpersona) && $idpersona) {
            $arreglofoto = $this->integrator->pvd->obtenerFotoPersona($idpersona);
            $result = $arreglofoto["foto"];
        }
        echo json_encode($result);
    }

    public function cargarsistemasAction()
    {
        $session = Zend_Registry::get('session');
        $certificate = $session->certificado;
        $idestructura = $this->global->Estructura->idestructura;
        $systemsArray = $this->integrator->seguridad->ObtenerSistemas(
            $certificate,
            $idestructura
        );
        if (count($systemsArray)) {
            echo json_encode(array('menu' => $systemsArray));
        } else {
            throw new ZendExt_Exception('EP007');
        }
    }

    public function cargarconceptosAction()
    {
        $perfil = $this->getPerfil();
        header("Content-type:text/xml");
        echo file_get_contents(
            "comun/recursos/xml/conceptos_{$perfil->idioma}.xml"
        );
    }

    public function cargarmodfuncAction()
    {
        $session = Zend_Registry::get('session');
        $certificate = $session->certificado;
        $idestructura = $this->global->Estructura->idestructura;
        $idsistema = $this->_request->getPost('node');
        $systemsArray = $this->integrator->seguridad->ObtenerModulosFuncionalidades(
            $certificate,
            $idsistema,
            $idestructura
        );
        if (count($systemsArray)) {
            echo json_encode($systemsArray);
        } else {
            echo json_encode($systemsArray = array());
        }
    }

    public function cargardesktopAction()
    {
        $register = Zend_Registry::getInstance();
        $certifcate = $register->session->certificado;
        $idestructura = $this->global->Estructura->idestructura;
        $systemsArray = $this->integrator->seguridad->ObtenerSistemasFuncionalidadesDesktopModulos(
            $certifcate,
            $idestructura
        );
        if (count($systemsArray)) {
            echo json_encode($systemsArray);
        } else {
            throw new ZendExt_Exception('EP007');
        }
    }

    public function json_encode_desktop($modulofunc, $padre)
    {
        echo '[';
        $ini = true;
        foreach ($modulofunc as $key => $mdf) {
            if ($padre || $mdf instanceof Funcionalidad || (!$padre && $mdf->idmodulo != $mdf->idmodpadre)
            ) {
                if ($ini) {
                    if ($mdf->icono) {
                        echo "{icono:'{$this->view->dir_ext_ccs}
                        images/iconos/{$mdf->icono}.png'";
                    } else {
                        echo "{icono:'{$this->view->dir_ext_ccs}
                        images/iconos/funcionalidad.png'";
                    }
                    $ini = false;
                } else {
                    if ($mdf->icono) {
                        echo ",{icono:'{$this->view->dir_ext_ccs}
                        images/iconos/{$mdf->icono}.png'";
                    } else {
                        echo ",{icono:'{$this->view->dir_ext_ccs}
                        images/iconos/funcionalidad.png'";
                    }
                }
                if ($mdf instanceof Funcionalidad) {
                    echo ",id:'{$mdf->idfuncionalidad}'";
                    echo ",text:'{$mdf->denominacion}'";
                    if ($mdf->referencia) {
                        echo ",referencia:'..\/..\/..\/{$mdf->referencia}'";
                    } else {
                        echo ",referencia:''";
                    }
                } else {
                    echo ",id:'{$mdf->idmodulo}'";
                    echo ",text:'{$mdf->nombre}'";
                    if ($mdf->Funcionalidad->count()) {
                        echo ",menu:";
                        $this->json_encode_desktop($mdf->Funcionalidad, 0);
                    } elseif ($mdf->Hijos->count()) {
                        echo ",menu:";
                        $this->json_encode_desktop($mdf->Hijos, 0);
                    } else {
                        echo ",menu:[]";
                    }
                }
                echo "}";
            }
        }
        echo ']';
    }

    public function cargardesktopmoduloAction()
    {
        $session = Zend_Registry::get('session');
        $certifcate = $session->certificado;
        $idestructura = $this->global->Estructura->idestructura;
        $systemsArray = $this->integrator->seguridad->ObtenerSistemasDesktopModulos(
            $certifcate,
            $idestructura
        );
        if (count($systemsArray)) {
            echo json_encode($systemsArray);
        } else {
            throw new ZendExt_Exception('EP008');
        }
    }

    public function json_encode_desktopmodulo($modulofunc, $padre)
    {
        echo '[';
        $ini = true;
        foreach ($modulofunc as $key => $mdf) {
            if ($padre || (!$padre && $mdf->idmodulo != $mdf->idmodpadre)) {
                if ($ini) {
                    if ($mdf->icono) {
                        echo "{icono:'{$this->view->dir_ext_ccs}images/iconos/
                        {$mdf->icono}.png'";
                    } else {
                        echo "{icono:'{$this->view->dir_ext_ccs}
                        images/iconos/funcionalidad.png'";
                    }
                    $ini = false;
                } else {
                    if ($mdf->icono) {
                        echo ",{icono:'{$this->view->dir_ext_ccs}
                        images/iconos/{$mdf->icono}.png'";
                    } else {
                        echo ",{icono:'{$this->view->dir_ext_ccs}
                        images/iconos/funcionalidad.png'";
                    }
                }
                echo ",id:'{$mdf->idmodulo}'";
                echo ",text:'{$mdf->nombre}'";
                if ($mdf->Hijos->count() && !($mdf->Hijos->count() == 1 && $mdf->idmodulo == $mdf->idmodpadre)
                ) {
                    echo ",menu:";
                    $this->json_encode_desktopmodulo($mdf->Hijos, 0);
                }
                echo "}";
            }
        }
        echo ']';
    }

    public function closeportalAction()
    {
        $trace = ZendExt_Aspect_Trace::getInstance();
        $trace->traceCierreSesion();
        $registro = Zend_Registry::getInstance();
        $registro->session->close = true;
        echo json_encode(array('close' => true));
    }

    public function geticonmenuAction()
    {
        header('Content-type: image/gif');
        $img = imagecreatefromgif(
            "{$this->view->dir_ext_ccs}images/iconos/{$_GET['icon']}.png"
        );
        imagegif($img);
    }

    public function cargardatostabpanelAction()
    {
        //  $idestructura = $this->global->Estructura->idestructura;
        try {
            $entidadconfigurada = true;
        } catch (Exception $e) {
            $entidadconfigurada = true;
        }
        if ($entidadconfigurada) {
            echo '{"success": 1}';
        } else {
            header('Location: ../../comun/recursos/xml/carga_inicial.xml');
        }
    }

    public function dameserviciocargainicialAction()
    {
        $idServ = $_GET['id'];
        if ($idServ) {
            switch ($idServ) {
                case 1:
                    $this->integrator->parametros->Bienvenida();
                    break;
                case 2:
                    $this->integrator->parametros->Ejercicio();
                    break;
                case 3:
                    $this->integrator->parametros->Fecha();
                    break;
                case 4:
                    $this->integrator->parametros->Cierre();
                    break;
                case 5:
                    $this->integrator->parametros->MonedaC();
                    break;
                case 6:
                    $this->integrator->parametros->MonedaE();
                    break;
                case 7:
                    $this->integrator->parametros->Finalizar();
                    break;
            }
        }
    }

    public function cambiarpasswordAction()
    {
        $this->render('cambiarpassword');
    }

    /**
     * @author Darien García Tejo.
     * @method nuevopasswordAction - Función usada para cambiar
     * el password del usuario.
     * @return json | ZendExt_Exception - Satisfactorio o una
     * excepción controlada.
     */
    public function nuevopasswordAction()
    {
        $oldpass = $this->_request->getPost('oldpass');
        $newpass = $this->_request->getPost('contrasenap');
        if (!strcmp($oldpass, $newpass) == 0) {
            $result = $this->integrator->seguridad->CambiarContrasenna(
                $this->global->Perfil->usuario,
                $oldpass,
                $newpass
            );
            /*print_r($result);
            die; */
            if ($result) {
                $register = Zend_Registry::getInstance();
                $register->session->perfil['caduca'] = $result;
                echo '{success: true}';
            } else {
                throw new ZendExt_Exception('EP011');
            }
        } else {
            throw new ZendExt_Exception('EP012');
        }

    }

    public function loginAction()
    {
        $this->render();
    }

    public function cargarfuncionalidadesAction()
    {
        // $register = Zend_Registry::getInstance();
        $arrFunc = $this->integrator->seguridad->ObtenerFuncionalidadesByRol();
        echo json_encode($arrFunc);
    }

    /*Servicio para obtener la información del sistema
    @autores: Ing.Ernesto Martinez y Ing.Juan Luis R.guez
    @fecha de modificación: 16/Dic/14
    */
    public function getacercadeAction()
    {
        $referencia = $this->_getParam('uri');
        if ($referencia[0] == '/' && $referencia[strlen($referencia) - 1] == '/'
        ) {
            $referencia = substr($referencia, 1, -1);
        }
        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $arrays = explode('/', $referencia);
        $cantidad = count($arrays);
        for ($i = $cantidad - 1; $i > 0; $i--) {
            $ref = implode('/', $arrays);
            $dirjson = $dirApps . $ref . '/comun/acercade.json';
            if (file_exists($dirjson)) {
                echo file_get_contents($dirjson);

                return;
            }
            unset($arrays[$i]);
        }
        $dirjson = $dirApps . implode('/', $arrays) . '/comun/acercade.json';
        if (file_exists($dirjson)) {
            echo file_get_contents($dirjson);

            return;
        }
        echo "{'code':6}";
    }

    public function getayudaAction()
    {
        $referencia = $this->_getParam('uri');
        if ($referencia[0] == '/' && $referencia[strlen($referencia) - 1] == '/'
        ) {
            $referencia = substr($referencia, 1, -1);
        }
        $dirApps = Zend_Registry::getInstance()->config->dir_webaplication;
        $arrays = explode('/', $referencia);
        $cantidad = count($arrays);
        for ($i = $cantidad - 1; $i > 0; $i--) {
            $ref = implode('/', $arrays);
            $dirjson = $dirApps . $ref . '/help/index.html';
            if (file_exists($dirjson)) {
                echo "{'dir':" . '"' . $ref . '/help/index.html' . '"' . "}";

                return;
            }
            unset($arrays[$i]);
        }
        $ref = implode('/', $arrays);
        $dirjson = $dirApps . $ref . '/help/index.html';
        if (file_exists($dirjson)) {
            echo "{'dir':" . '"' . $ref . '/help/index.html' . '"' . "}";

            return;
        }
        echo "{'code':6}";
    }

    public function obtenerModoInicioAction()
    {

        try {
            $usuario = $this->global->Perfil->idusuario;
            $resultado = NomDesktopModel::obtenerModoInicio($usuario);
            echo json_encode($resultado);
            return $resultado;
        } catch (Exception $e) {
            print_r($e->getMessage());
        }


    }


}

