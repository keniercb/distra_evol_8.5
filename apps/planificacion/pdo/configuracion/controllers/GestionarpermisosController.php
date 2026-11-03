<?php

/**
 * Controlador para gestionar permisos
 *
 * @author    Nestor Bernal Vidal
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class GestionarpermisosController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase
     *
     */
    function init() {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionarpermisos.phtml
     *
     */
    function gestionarpermisosAction() {
        $this->render();
    }

    /**
     * Accion para cargar los permisos que tiene el usuario por defecto
     *
     */
    function cargarmispermisosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $limit = 80;
        if ($this->_request->getPost('limit') != null) {
            $limit = $this->_request->getPost('limit');
        }
        $start = 0;
        if ($this->_request->getPost('start') != null) {
            $start = $this->_request->getPost('start');
        }
        $filters = $this->_request->getPost('filtros');
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $objpermiso = new GestionarpermisosModel();
        $arraypermisos = $objpermiso->CargarPermisosOtorgadosParaMi(
                $idusuario, $certificado, $iddominio, $limit, $start, $filters
        );
        if ($arraypermisos['total'] > 0) {
            echo json_encode(
                    array('total' => $arraypermisos['total'],
                        'campos' => $arraypermisos['resultado'])
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    /**
     * Accion para cargar los permisos otorgados por el usuario
     *
     */
    function cargarpermisosotorgadosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $limit = 80;
        if ($this->_request->getPost('limit') != null) {
            $limit = $this->_request->getPost('limit');
        }
        $start = 0;
        if ($this->_request->getPost('start') != null) {
            $start = $this->_request->getPost('start');
        }
        $filters = $this->_request->getPost('filtros');
        $objpermiso = new GestionarpermisosModel();
        $arraypermisos = $objpermiso->CargarPermisosOtorgadosPorMi(
                $idusuariocrea, $limit, $start, $filters
        );
        if ($arraypermisos['total'] > 0) {
            echo json_encode(
                    array('total' => $arraypermisos['total'],
                        'campos' => $arraypermisos['resultado'])
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    /**
     * Accion para adicionar permisos
     *
     */
    function adicionarpermisosAction() {        
        //print_r('esa');die;
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arraypermsospara = $this->_request->getPost('arraypermsospara');
        $arraypermsossobre = $this->_request->getPost('arraypermsossobre');
        $arraypermisos = $this->_request->getPost('arraypermisos');
        $arraypermsospara = stripslashes($arraypermsospara);
        $arraypermsossobre = stripslashes($arraypermsossobre);
        $arraypermisos = stripslashes($arraypermisos);
        $arraypermsospara = json_decode($arraypermsospara);
        $arraypermsossobre = json_decode($arraypermsossobre);
        $arraypermisos = json_decode($arraypermisos);
        $objpermiso = new GestionarpermisosModel();
        $return = $objpermiso->AdicionarPermiso(
                $idusuariocrea, $arraypermsospara, $arraypermsossobre, $arraypermisos
        );
        $respuesta = 1;
        if ($return == 4) {
            $respuesta = 4;
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para modificar permisos
     *
     */
    function modificarpermisosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arrayidpermiso = $this->_request->getPost('arrayidpermiso');
        $arraypermisos = $this->_request->getPost('arraypermisos');
        $arrayidpermiso = stripslashes($arrayidpermiso);
        $arraypermisos = stripslashes($arraypermisos);
        $arrayidpermiso = json_decode($arrayidpermiso);
        $arraypermisos = json_decode($arraypermisos);
        $objpermiso = new GestionarpermisosModel();
        $objpermiso->ModificarPermiso(
                $idusuariocrea, $arrayidpermiso, $arraypermisos
        );
        $respuesta = 1;
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para eliminar permisos
     *
     */
    function eliminarpermisosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arrayidpermiso = $this->_request->getPost('arrayidpermiso');
        $arrayidpermiso = stripslashes($arrayidpermiso);
        $arrayidpermiso = json_decode($arrayidpermiso);
        $objpermiso = new GestionarpermisosModel();
        $objpermiso->EliminarPermiso($idusuariocrea, $arrayidpermiso);
        $respuesta = 1;
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para obtener los permisos sobre mis subordinados
     *
     */
    function configurarpermisossubAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $objpermisomodel = new GestionarpermisosModel();
        $arraysubordinados = json_decode(
                stripslashes($this->_request->getPost('arraysubordinados'))
        );
        $arraysubordinadoseliminar = json_decode(
                stripslashes($this->_request->getPost('arraysubordinadoseliminar'))
        );
        $idusuariosession = $this->global->Perfil->idusuario;
        //$respuesta = 0;
        $arraysubalreves = array();
        $respuestaadicionar = 0;
        $respuestaeliminar = 0;
        if (isset($arraysubordinados[0])) {
            $numpermiso = 15;
            $nombreusuariosession = $this->global->Perfil->usuario;
            $cantsubalreves = 0;
            $cont = 0;
            foreach ($arraysubordinados as $key => $subordinado) {
                $idpsobre = $subordinado->idusuario;
                $denpsobre = $subordinado->denominacion;
                /* verificando que la subordinacion no exista al reves */
                $existesubalreves = Doctrine::getTable('DatPermiso')->findByDql(
                        "idppara = $idpsobre AND idpsobre = $idusuariosession AND subordinado = 1"
                );
                if (isset($existesubalreves[0]->idpermiso) && $existesubalreves[0]->idpermiso !=
                        '' && $existesubalreves[0]->idpermiso != null
                ) {
                    $arraysubalreves[$cantsubalreves]['denominacion']
                            = $denpsobre;
                    $cantsubalreves++;
                } else {
                    $uri = $idusuariosession . $idpsobre . $idusuariosession;
                    $existepermiso = DatPermiso::GetPermisoPorURIPermiso($uri);
                    if (!isset($existepermiso[0]['idpermiso'])) {
                        $objpermiso = new DatPermiso();
                        $objpermiso->uri = $uri;
                        $objpermiso->idpsobre = $idpsobre;
                        $objpermiso->idppara = $idusuariosession;
                        $objpermiso->numpermiso = $numpermiso;
                        $objpermiso->tipopsobre = 1;
                        $objpermiso->idusuariocrea = $idusuariosession;
                        $objpermiso->fechacreacion = date("d-m-Y");
                        $objpermiso->tipoppara = 1;
                        $objpermiso->idgrupopara = null;
                        $objpermiso->idgruposobre = null;
                        $objpermiso->denppara = $nombreusuariosession;
                        $objpermiso->denpsobre = $denpsobre;
                        $objpermiso->subordinado = 1;
                        $objpermiso->save();
                        $cont++;
                        $nivelrelacion = 1;
                        $objpermisomodel->ActualizarSubordinacionDescendente(
                                $accion = 'adicionar', $idusuariosession, $idpsobre, $nivelrelacion
                        );
                    }
                }
            }
            if ($cantsubalreves == 0) {
                $respuestaadicionar = 1;
                /* se crearon todos los permisos bien */
            }
            if ($cantsubalreves > 0) {
                $respuestaadicionar = 2;
                /* por defecto todos estaban configurados como jefes sobre el usuario en sesion */
                if ($cantsubalreves != $cont) {
                    $respuestaadicionar = 3;
                    /* al menos existian algunos configurados como jefes sobre el usuario en sesion */
                }
            }
            //$respuesta = 1;
        }
        if (isset($arraysubordinadoseliminar[0])) {
            foreach ($arraysubordinadoseliminar as $key => $subordinadoeliminar) {
                $idpsobre = $subordinadoeliminar->idusuario;
                $uri = $idusuariosession . $idpsobre . $idusuariosession;
                $arrayuripermisoseliminar[] = $uri;
                $arrayidpsobre[] = $idpsobre;
            }
            DatPermiso::EliminarPermisosPorURI($arrayuripermisoseliminar);
            $arrayidpsobre = implode(',', $arrayidpsobre);
            DatPermiso::EliminarPermisosPSobre(
                    $arrayidpsobre, $idusuariosession
            );
            $objpermisomodel->ActualizarSubordinacionDescendente(
                    $accion = 'eliminar', $idusuariosession, $idpsobre, $nivelrelacion
            );
            $respuestaeliminar = 1;
        }
        echo json_encode(
                array(
                    'mensajeadicionar' => $respuestaadicionar,
                    'mensajeeliminar' => $respuestaeliminar,
                    'subordinadosinversos' => $arraysubalreves,
                    'cantidad' => $cantsubalreves)
        );
    }

    /**
     * Accion para cargar el arbol con los usuarios subordinados
     *
     */
    function cargarsubordinadosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $nodo = $this->_request->getPost('nodo');
        $idgrupo = $this->_request->getPost('idgrupo');
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;

        /*$objpermiso = new GestionarpermisosModel();
        $arrausersdomain = $objpermiso->ObtenerUsuariosDelDominio($idusuario, $iddominio);*/
        $arrausersdomain = DatPermiso::obtenerSubordinados($idusuario);
        //print_r($arrausersdomain);die;
        //$objpermiso->CargarGruposyUsuariosPara($nodo, $idgrupo, $idusuario, $estamodificando, $iddominio, $certificado);

        $arrayusuariosdominio = array();
        if (isset($arrausersdomain[0])) {
            $arraysubpermisos = DatPermiso::ObtenerPermisosSobreSubordinados($idusuario);
            $cont = 0;
            foreach ($arrausersdomain as $userdomain) {
                if ($idusuario != $userdomain['idusuario']) {
                    $checked = false;
                    $chekeado = 0;
                    if (isset($arraysubpermisos[0])) {
                        foreach ($arraysubpermisos as $permiso) {
                            if ($permiso['idpsobre'] == $userdomain['idusuario']
                            ) {
                                $checked = true;
                                $chekeado = 1;
                            }
                        }
                    }
                    $arrayusuariosdominio[$cont]['id'] = $userdomain['idusuario'];
                    $arrayusuariosdominio[$cont]['text']
//                        = '<span class = icondistra-usuario' . '>' . ' ' . $objpermiso->DameDenominacion($userdomain['idusuario'], 'usuario');
                            // = $userdomain['nombreusuario'];
                            = '<span class = icondistra-usuario' . '>' . ' ' . $userdomain['nombrecompleto'];
                    $arrayusuariosdominio[$cont]['idusuario'] = $userdomain['idusuario'];
                    $arrayusuariosdominio[$cont]['leaf'] = true;
                    $arrayusuariosdominio[$cont]['checked'] = $checked;
                    $arrayusuariosdominio[$cont]['chekeado'] = $chekeado;
                    $arrayusuariosdominio[$cont]['tipo'] = 1;
                    $arrayusuariosdominio[$cont]['iconCls'] = 'imagen-none';
                    $arrayusuariosdominio[$cont]['draggable'] = false;
                    $cont++;
                }
            }
        }
        if (isset($arrayusuariosdominio[0])) {
            echo json_encode($arrayusuariosdominio);
        } else {
            $this->showMessage('Usted no tiene usuarios subordinados.');
        }
    }

    /**
     * Accion para cargar el arbol con los grupos de usuarios sobre los cuales les voy a dar permiso
     *
     */
    function cargargruposyusuarioschecksobreAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $nodo = $this->_request->getPost('nodo');
        $idgrupo = $this->_request->getPost('idgrupo');
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $objpermiso = new GestionarpermisosModel();
        switch ($idgrupo) {
            case 'nodo1':
                $objpermiso->CargarGruposyUsuariosSobre(
                        $nodo, $idgrupo, $idusuario, $estamodificando
                );
                break;
            case 'nodo2':
                $arraygrupos = $objpermiso->CargarGruposyUsuariosSobre(
                        $nodo, $idgrupo, $idusuario, $estamodificando
                );
                if ($arraygrupos) {
                    echo json_encode($arraygrupos);
                }
                if (!$arraygrupos) {
                    $this->showMessage('Usted no tiene grupos gestionados.');
                }
                break;
            case 'nodo3':
                $arrayusersdomain = $objpermiso->CargarGruposyUsuariosSobre(
                        $nodo, $idgrupo, $idusuario, $estamodificando
                ); //CargarUsuariosDelDominio($certificado,$iddominio,$idusuario);
                if ($arrayusersdomain) {
                    echo json_encode($arrayusersdomain);
                }
                if (!$arrayusersdomain) {
                    $this->showMessage(
                            'Usted no tiene usuarios subordinados gestionados.'
                    );
                }
                break;
            case 'nodo4':
                $otros = $objpermiso->CargarGruposyUsuariosSobre(
                        $nodo, $idgrupo, $idusuario, $estamodificando
                );
                if ($otros) {
                    echo json_encode($otros);
                }
                if (!$otros) {
                    $this->showMessage(
                            'Usted no tiene permisos otorgados por el nivel superior.'
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
                $objpermiso->CargarGruposyUsuariosSobre(
                        $nodo, $idgrupo, $idusuario, $estamodificando
                );
        }
    }

    /**
     * Accion para cargar el arbol con los grupos de usuarios a los cuales les voy a dar permiso
     *
     */
    function buscargruposyusuarioscheckparaAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $nodo = $this->_request->getPost('nodo');
        //$idgrupo = $this->_request->getPost('idgrupo');
        $denominacionbuscar = $this->_request->getPost('denominacion');
        $funcAsoc = $this->_request->getPost('funcionalidadAsoc');
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $estamodificando = $this->_request->getPost('estamodificando');
        $objpermiso = new GestionarpermisosModel();
        if ($denominacionbuscar) {
            $arraygrupos = $objpermiso->CargarGruposyUsuariosPara(
                    $nodo, 'nodo1', $idusuario, $estamodificando, $iddominio, $certificado, null
            );
            //$misgrupos=$objpermiso->Buscardenominacion($arraygrupos,$denominacionbuscar);
            $data[0] = $objpermiso->Buscardenominacion(
                    $arraygrupos, $denominacionbuscar
            );
            $arrausersdomain = $objpermiso->CargarGruposyUsuariosPara(
                    $nodo, 'nodo2', $idusuario, $estamodificando, $iddominio, $certificado, $funcAsoc
            );
            $data[1] = $objpermiso->Buscardenominacion(
                    $arrausersdomain, $denominacionbuscar
            );
            $otros
                    = $this->pIntegrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
                    $idusuario
            );
            $data[2] = $objpermiso->Buscardenominacion(
                    $otros, $denominacionbuscar
            );
            echo json_encode(array('data' => $data));
        }
    }

    function buscargruposyusuarioschecksobreAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $nodo = $this->_request->getPost('nodo');
        //$idgrupo = $this->_request->getPost('idgrupo');
        $denominacionbuscar = $this->_request->getPost('denominacion');
        //$funcAsoc = $this->_request->getPost('funcionalidadAsoc');
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $estamodificando = $this->_request->getPost('estamodificando');
        $objpermiso = new GestionarpermisosModel();
        if ($denominacionbuscar) {
            $arraygrupos2 = $objpermiso->CargarGruposyUsuariosPara(
                    $nodo, 'nodo1', $idusuario, $estamodificando, $iddominio, $certificado, null
            );
            // $misgrupos=$objpermiso->Buscardenominacion($arraygrupos2,$denominacionbuscar);
            $data[0] = $objpermiso->Buscardenominacion(
                    $arraygrupos2, $denominacionbuscar
            );

            if ($data[0]) {
                $data[1] = null;
            } else {
                $arrausersdomain = $objpermiso->CargarGruposyUsuariosSobre(
                        $nodo, 'nodo2', $idusuario, $estamodificando
                );     //$objpermiso->CargarGruposyUsuariosPara($nodo, 'nodo2',
                //     $idusuario, $estamodificando, $iddominio, $certificado, $funcAsoc);
                $data[1] = $objpermiso->Buscardenominacion(
                        $arrausersdomain, $denominacionbuscar
                );
            }

            $arrausersdomain2 = $objpermiso->CargarGruposyUsuariosSobre(
                    $nodo, 'nodo3', $idusuario, $estamodificando
            );     //$objpermiso->CargarGruposyUsuariosPara($nodo, 'nodo2',
            //     $idusuario, $estamodificando, $iddominio, $certificado, $funcAsoc);
            $data[2] = $objpermiso->Buscardenominacion(
                    $arrausersdomain2, $denominacionbuscar
            );
            $arrausersdomain3 = $objpermiso->CargarGruposyUsuariosSobre(
                    $nodo, 'nodo4', $idusuario, $estamodificando
            );     //$objpermiso->CargarGruposyUsuariosPara($nodo, 'nodo2',
            //     $idusuario, $estamodificando, $iddominio, $certificado, $funcAsoc);
            $data[3] = $objpermiso->Buscardenominacion(
                    $arrausersdomain3, $denominacionbuscar
            );
            $otros
                    = $this->pIntegrator->configuracionpdo->DameEstructurasRelacionadasbyIduser(
                    $idusuario
            );
            $data[4] = $objpermiso->Buscardenominacion(
                    $otros, $denominacionbuscar
            );
            $search = strtolower($denominacionbuscar);
            $denomuser = $this->integrator->seguridad->nombreUsuario($idusuario);
            $text = strtolower($denomuser);
            $pos = strpos($text, $search);
            if ($pos !== false) {
                $data[5] = array(
                    'text' => $denomuser,
                    'id' => 'nodo1' . $idusuario,
                    'leaf' => true,
                    'checked' => false,
                    'idusuario' => $idusuario,
                    'draggable' => false,
                    'iconCls' => 'usuario',
                    'tipo' => 1
                );
            }
            echo json_encode(array('data' => $data));
        }
    }

    function cargargruposyusuarioscheckparaAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $nodo = $this->_request->getPost('nodo');
        $idgrupo = $this->_request->getPost('idgrupo');
        //$denominacionbuscar = $this->_request->getPost('denominacion');
        $funcAsoc = $this->_request->getPost('funcionalidadAsoc');
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $estamodificando = $this->_request->getPost('estamodificando');
        $objpermiso = new GestionarpermisosModel();
        switch ($idgrupo) {
            case 'nodo1':
                $arraygrupos = $objpermiso->CargarGruposyUsuariosPara(
                        $nodo, $idgrupo, $idusuario, $estamodificando, $iddominio, $certificado, null
                );
                if ($arraygrupos) {
                    echo json_encode($arraygrupos);
                }
                if (!$arraygrupos) {
                    $this->showMessage('Usted no tiene grupos gestionados.');
                }
                break;
            case 'nodo2':
                $arrausersdomain = $objpermiso->CargarGruposyUsuariosPara(
                        $nodo, $idgrupo, $idusuario, $estamodificando, $iddominio, $certificado, $funcAsoc
                );
                if ($arrausersdomain) {
                    echo json_encode($arrausersdomain);
                }
                if (!$arrausersdomain) {
                    $this->showMessage(
                            'Usted no tiene usuarios subordinados gestionados.'
                    );
                }
                break;
            case 'nodo3':
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
                /* $arrausersgrups = */
                $objpermiso->CargarGruposyUsuariosPara(
                        $nodo, $idgrupo, $idusuario, $estamodificando, $iddominio, $certificado, null
                );
        }
    }

    function actualizarpermisosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $objpermisosmodel = new GestionarpermisosModel();
        $respuesta = $objpermisosmodel->ActualizarPermisos($idusuariocrea);
        echo json_encode(array('mensaje' => $respuesta));
    }

    function reorganizarsubordinacionAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idppara = $this->global->Perfil->idusuario;
        $objpermisomodel = new GestionarpermisosModel();
        $respuesta = $objpermisomodel->reorganizarSubordinacion($datos);
        echo json_encode(array('mensaje' => $respuesta));
    }

    function cargarcadenasubordinacionAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idautoractividad =  $this->_request->getPost('idautoractividad');  //Integracion con actividades
        $idusuariosession = (empty($idautoractividad)) ? $this->global->Perfil->idusuario : $idautoractividad;
        $idsubordinado = $this->_request->getPost('idsubordinado');
        $objpermisosmodel = new GestionarpermisosModel();
        $arraysubordinados = $objpermisosmodel->cargarCadenaSubordinacion(
                $idusuariosession, $idsubordinado
        );
        echo json_encode($arraysubordinados);
    }

    function cargarUsuariosDominioAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $objpermiso = new GestionarpermisosModel();
        $arrayusersdomain = $objpermiso->cargarUsuariosDominio(
                $idusuario, $iddominio
        );
        if (isset($arrayusersdomain[0])) {
            echo json_encode(
                    array('success' => true, 'total' => count($arrayusersdomain),
                        'campos' => $arrayusersdomain)
            );
        } else {
            echo json_encode(
                    array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
    }

}
