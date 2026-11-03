<?php

/**
 * @name GestusuarioController - Componente de autenticación..
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestusuarioController extends SeguridadController
{

    /**
     * @method init() - Constructor de la clase.
     * @return void
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @method gestusuarioAction() - Función encargada de darle render
     *                        a la vista correspondiente e incluye ademas otras
     *                        vistas para la integración a nivel de interfaz
     *
     * @return void
     */
    public function gestusuarioAction()
    {
        try {
            $this->view->includeperfilseguridad = $this->integrator->pvd
                ->mostrarIUPerfilSeguridadPersona();
            $this->view->mostrarIUBuscarPersona = $this->integrator->pvd
                ->mostrarIUBuscarPersona();
        } catch (ZendExt_FastResponse_Exception $e) {
            if (Zend_Registry::get('config')->development) {
                $exceptionLog = new ZendExt_Exception_Log(
                    new ZendExt_Exception('NOCONTROLLED', $e)
                );
                $exceptionLog->handle();
            }
            $this->view->includeperfilseguridad = '';
            $this->view->mostrarIUBuscarPersona = '';
        }
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->arrayTemas = $this->cargarComboTemas();
        $this->view->arrayDomIns = $this->cargarcombodominio();
        $this->view->arrayDomBusc = $this->cargarComboDominioBuscar();
        $this->view->arrayCombDesk = $this->cargarcombodesktop();
        $this->view->arrayCombIdio = $this->cargarcomboidioma();
        $this->view->arrayComServA = $this->cargarcomboservidoresaut();
        $this->view->profile = $this->loadProfile();
        $this->render();
    }

    /**
     * @method insertarusuarioAction() - Función usada para la creación de un 
     * nuevo usuario en el sistema.
     * @return void.
     */
    public function insertarusuarioAction()
    {
        $dirCerts = substr(
            $_SERVER['DOCUMENT_ROOT'], 
            0, 
            strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
        ) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR 
            . 'auth' . DIRECTORY_SEPARATOR;
        $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
        $usuario = new SegUsuario();
        $idservidorauth = $this->_request->getPost('idservidor');
        $usuario->nombreusuario = $this->_request->getPost('nombreusuario');
        $estado = $this->_request->getPost('estado');
        $passw = ($this->_request->getPost('passw1')) ? $rsa
                ->decrypt($this->_request->getPost('passw1')) : ' ';
        if (!$estado) {
            self::verificarpass($passw);
        }
        $usuario->accesoconcurrente = !$this->_request->getPost('simpleacceso') 
            ? true : false;
        $usuario->reescribirsesion = ($this->_request->getPost('simpleacceso') 
            && $this->_request->getPost(
                'reescribirsesion'
            )) ? true : false;
        $usuario->contrasenna = md5($passw);
        $usuario->ip = $this->_request->getPost('ip');
        $usuario->idtema = $this->_request->getPost('idtema');
        $usuario->iddominio = $this->_request->getPost('iddominio');
        $usuario->ididioma = $this->_request->getPost('ididioma');
        $usuario->iddesktop = $this->_request->getPost('iddesktop');
        $usuario->caduca = null;
        $usuario->creadopor = $this->global->Perfil->idusuario;
        $usuario->fcreado = date('d-M-Y H:i:s');

        if (!self::verificarusuario($usuario->nombreusuario)) {
            $usuario->save();
            $objusuarioDominio = new SegUsuarioNomDominio();
            $objusuarioDominio->idusuario = $usuario->idusuario;
            $objusuarioDominio->iddominio = $this->global->Perfil->iddominio;
            $modelusuarioDominio = new SegUsuarioNomDominioModel();
            $modelusuarioDominio->insertar($objusuarioDominio);
            if ($idservidorauth) {
                $sistemaservautenticacion = new SegUsuarioDatSerautenticacion();
                $sistemaservautenticacion->idusuario = $usuario->idusuario;
                $sistemaservautenticacion->idservidor = $idservidorauth;
                $model = new SegUsuarioModel();
                $model->insertarservidoraut($sistemaservautenticacion);
            } else {
                $modelClave = new SegClaveaccesoModel();
                $modelClave->insertar(
                    $usuario->idusuario, $usuario->contrasenna
                );
            }
            $this->showMessage(
                'El usuario ha sido adicionado satisfactoriamente.'
            );
        } else {
            throw new ZendExt_Exception('SEG009');
        }
    }

    /**
     * @method modificarusuarioAction() - Función usada para la actualización 
     * de los metadatos del usuario.
     * @return void
     */
    public function modificarusuarioAction()
    {
        $idUsuario = $this->_request->getPost('idusuario');
        $usuario = Doctrine::getTable('SegUsuario')->find($idUsuario);
        $nombreusuario = $this->_request->getPost('nombreusuario');
        $usuario->ip = $this->_request->getPost('ip');
        $usuario->idtema = $this->_request->getPost('idtema');
        $usuario->modificadopor = $this->global->Perfil->idusuario;
        $usuario->fmodificado = date('d-M-Y H:i:s');
        //Acceso Concurrente
        $usuario->accesoconcurrente = !$this->_request->getPost('simpleacceso')
            ? true : false;
        $usuario->reescribirsesion = ($this->_request->getPost('simpleacceso') 
            && $this->_request->getPost(
                'reescribirsesion'
            )) ? true : false;
        if (!$usuario->iddominio) {
            $objCompartUsuario = new SegUsuarioNomDominio();
            $objCompartUsuario->idusuario = $idUsuario;
            $objCompartUsuario->iddominio = $this->global->Perfil->iddominio;
            $objCompartUsuario->save();
        }
        $usuario->iddominio = $this->_request->getPost('iddominio');
        $usuario->ididioma = $this->_request->getPost('ididioma');
        $usuario->iddesktop = $this->_request->getPost('iddesktop');
        $idservidorauth = $this->_request->getPost('idservidor');
        if ($usuario->nombreusuario != $nombreusuario) {
            if (!self::verificarusuario(
                $this->_request->getPost('nombreusuario')
            )
            ) {
                $usuario->nombreusuario = 
                    $this->_request->getPost('nombreusuario');
                if ($idservidorauth) {
                    $sistemaservautenticacion = 
                        new SegUsuarioDatSerautenticacion();
                    $sistemaservautenticacion->idusuario = $usuario->idusuario;
                    $sistemaservautenticacion->idservidor = $idservidorauth;
                    $usuario->caduca = null;
                    SegClaveacceso::deleteRowsByIdUsuario($idUsuario);
                } elseif ($idservidorauth == 0) {
                    if (SegUsuarioDatSerautenticacion::
                        existUserAutenticationServer($idUsuario)
                    ) {
                        SegUsuarioDatSerautenticacion::
                            eliminarusuarioservidoraut($idUsuario);
                        $usuario->contrasenna = md5($nombreusuario);
                        $usuario->caduca = null;
                        $modelClave = new SegClaveaccesoModel();
                        $modelClave->insertar(
                            $usuario->idusuario, $usuario->contrasenna
                        );
                    }
                }
                $model = new SegUsuarioModel();
                $model->modificarusuario($sistemaservautenticacion, $usuario);
                $this->showMessage(
                    'El usuario ha sido modificado satisfactoriamente.'
                );
            } else {
                throw new ZendExt_Exception('SEGUSUARIO03');
            }
        } else {
            $usuario->nombreusuario = $this->_request->getPost('nombreusuario');
            $sistemaservautenticacion = null;
            if ($idservidorauth) {
                $sistemaservautenticacion = new SegUsuarioDatSerautenticacion();
                $sistemaservautenticacion->idusuario = $usuario->idusuario;
                $sistemaservautenticacion->idservidor = $idservidorauth;
                $usuario->caduca = null;
                SegClaveacceso::deleteRowsByIdUsuario($idUsuario);
            } elseif ($idservidorauth == 0) {
                if (SegUsuarioDatSerautenticacion::existUserAutenticationServer(
                    $idUsuario
                )
                ) {
                    SegUsuarioDatSerautenticacion::eliminarusuarioservidoraut(
                        $idUsuario
                    );
                    $usuario->contrasenna = md5($nombreusuario);
                    $usuario->caduca = null;
                    $modelClave = new SegClaveaccesoModel();
                    $modelClave->insertar(
                        $usuario->idusuario, $usuario->contrasenna
                    );
                }
            }
            $model = new SegUsuarioModel();
            $model->modificarusuario($sistemaservautenticacion, $usuario);
            $this->showMessage(
                'El usuario ha sido modificado satisfactoriamente.'
            );
        }
    }

    /**
     * @method eliminarusuarioAction() - Función encargada de eliminar 
     * los usuarios que no esten bloqueados
     * (estado en 1).
     *
     * @return void.
     */
    public function eliminarusuarioAction()
    {
        $arrayUserDel = json_decode(
            stripslashes($this->_request->getPost('ArrayUserDel'))
        );
        $arrayTemp = SegUsuario::comprovarestado($arrayUserDel);
        if (count($arrayTemp) > 0) {
            if (count($arrayUserDel) == count($arrayTemp)) {
                SegUsuario::eliminarUsuarios($arrayUserDel);
                $this->showMessage(
                    'El(Los) usuario(s) ha(n) sido '
                    . 'eliminado(s) satisfactoriamente.'
                );
            } else {
                $arrayElim = array_intersect(
                    $arrayUserDel, 
                    SegUtil::convertToUnidimensional($arrayTemp, 'idusuario')
                );
                SegUsuario::eliminarUsuarios($arrayElim);
                $this->showMessage(
                    'No todos los usuarios han sido eliminados '
                    . 'debido a que se encuentran bloqueados.'
                );
            }
        } else {
            $this->showMessage(
                'No todos los usuarios han sido eliminados'
                . ' debido a que se encuentran bloqueados.'
            );
        }
    }

    /**
     * @method cargarusuarioAction() - Función que se encarga de listar los 
     * usuarios compartimentados con todos sus metadatos. El listado se hace 
     * por lotes y se pueden realizar busquedas por nombre 
     * de usuario, dominio o estado.
     *
     * @return void;
     */
    public function cargarusuarioAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idusuario = $this->global->Perfil->idusuario;
        $nombreusuario = $this->_request->getPost('nombreusuario');
        $dominiobuscar = $this->_request->getPost('dominiobuscar');
        $iddominio = $this->global->Perfil->iddominio;
        $activar = $this->_request->getPost('activar');
        if ($nombreusuario || $dominiobuscar || $activar) {
            $datosusuario = SegUsuario::cargarGridUsuarioBuscados(
                $nombreusuario, 
                $idusuario, 
                $iddominio, 
                $dominiobuscar, 
                $activar, 
                $limit, 
                $start
            );
            $cantf = SegUsuario::cantidadFilasUsuariosBuscados(
                $nombreusuario, 
                $idusuario, 
                $iddominio, 
                $dominiobuscar, 
                $activar
            );
        } else {
            $datosusuario = SegUsuario::cargarGridUsuario(
                $idusuario, $iddominio, $limit, $start
            );
            $cantf = SegUsuario::cantidadFilas($idusuario, $iddominio);
        }
        $arrayusuario = array();
        if (count($datosusuario)) {
            $arrayusuario = self::datosGridUsuarios($datosusuario);
        }
        echo json_encode(
            array('cantidad_filas' => $cantf, 'datos' => $arrayusuario)
        );
    }

    /**
     * @method cargarRolesUsuarioAction() - Función que carga todos los roles 
     * que estan asociados a un usuario.
     * @return void
     */
    public function cargarRolesUsuarioAction()
    {
        $idusuario = $this->_request->getPost('idusuario');
        $roles = SegRol::obtenerrolesusuario($idusuario)->toArray(true);
        $cantidad = SegRol::obtenerCantRolesUsuario($idusuario);
        echo json_encode(
            array('cantidad_filas' => $cantidad, 'datos' => $roles)
        );
    }

    /**
     * @method cargarrolesAction() - Función usada para llenar
     *  el grid de roles 
     * (Compartimentados pos dominios).
     * @return json
     */
    public function cargarrolesAction()
    {
        $start = (int) $this->_request->getPost("start");
        $limit = (int) $this->_request->getPost("limit");
        $idusuario = $this->_request->getPost("idusuario");
        $rolbuscado = $this->_request->getPost("rolbuscado");
        $filtroDominio = $this->global->Perfil->iddominio;
        $result = array();
        $arrayRolesDominio = SegRolNomDominio::RolesdelDominio($filtroDominio);
        $arrayRolesDominio = SegUtil::convertToUnidimensional(
            $arrayRolesDominio, 'idrol'
        );
        $arrayRolesPermisoDominio=SegCompartimentacionroles::cargarRolesDominio(
            $filtroDominio
        );
        $arrayRolesPermisoDominio = SegUtil::convertToUnidimensional(
            $arrayRolesPermisoDominio, 'idrol'
        );
        $arrayResult=array_merge($arrayRolesDominio, $arrayRolesPermisoDominio);
        if (count($arrayResult) > 0) {
            if (!$rolbuscado) {
                $result = SegRol::obtenerrolesasociados(
                    $limit, $start, $idusuario, $arrayResult
                );
                $cantrol = SegRol::cantrolesDominio($arrayResult);
            } else {
                $result = SegRol::obtenerRolesBuscado(
                    $rolbuscado, $limit, $start, $idusuario, $arrayResult
                );
                $cantrol = SegRol::cantrolBuscados(
                    $rolbuscado, $arrayResult, false
                );
            }
            if (count($result)) {
                foreach ($result as $key => $rol) {
                    $arrayroles[$key]['idrol'] = $rol['idrol'];
                    $arrayroles[$key]['denominacion'] = $rol['denominacion'];
                    $arrayroles[$key]['abreviatura'] = $rol['abreviatura'];
                    $arrayroles[$key]['descripcion'] = $rol['descripcion'];
                    if (count($rol['DatEntidadSegUsuarioSegRol'])) {
                        $arrayroles[$key]['estado'] = 1;
                    } else {
                        $arrayroles[$key]['estado'] = 0;
                    }
                }
                $result = array(
                    'cantidad_filas' => $cantrol, 
                    'datos' => $arrayroles
                );
            } else {
                $result = array('cantidad_filas' => 0, 'datos' => array());
            }
        }
        echo json_encode($result);
    }

    public function cargarentidadesReporteAction()
    {
        $idusuario = $this->_request->getPost("idusuario");
        $idrol = $this->_request->getPost("idrol");
        $idEstructura = $this->_request->getPost("node");
        $iddominio = $this->_request->getPost("iddominio");
        $arrayEst = DatEntidadSegUsuarioSegRol::cargarentidadesusuariorol(
            $idusuario, $idrol
        );
        $arrayEst = SegUtil::convertToUnidimensional($arrayEst, 'idestructura');
        $arrayEstNoRol =DatEntidadSegUsuarioSegRol::cargarentidadesusuarionorol(
            $idusuario, $idrol
        );
        $arrayEstNoRol = SegUtil::convertToUnidimensional(
            $arrayEstNoRol, 'idestructura'
        );
        $arrayEstructuras = SeguridadECProxy::getInstance()
            ->buscarHijosEstructurasDadoArray(
                $iddominio, $idEstructura, 1, $arrayEst
            );
        $estructuras = array();
        foreach ($arrayEstructuras as $key => $est) {
            $estructuras[$key] = $est;
            $estructuras[$key]['disabled'] = true;
            if ($est['unchecked'] 
                || !$est['checked'] 
                || count(array_intersect($arrayEstNoRol, array($est['id'])))) {
                unset($estructuras[$key]['checked']);
            }
        }
        echo json_encode($estructuras);

        return;
    }

    /**
     * @method cargarentidadesAction() - Función usada para cargar el 
     * árbol de estructuras
     * (Asignación de roles a usuarios).
     *
     * @return json
     */
    public function cargarentidadesAction()
    {
        $idusuario = $this->_request->getPost("idusuario");
        $idrol = $this->_request->getPost("idrol");
        $idEstructura = $this->_request->getPost("node");
        $iddominio = $this->_request->getPost("iddominio");
        $estructuras = array();
        $arrayNoAcceso = array();
        $tuplas = DatEntidadSegUsuarioSegRol::comprobarExisteRol(
            $idusuario, $idrol
        );
        $acceso = (count($tuplas)) ? $tuplas[0]['identidad'] : 0;
        $arrayEstructuras = SeguridadECProxy::getInstance()
            ->buscarHijosEstructurasDadoArray(
                $acceso, $iddominio, $idEstructura, 1
            );
        $arrayEst = SegUtil::convertToUnidimensional($arrayEstructuras, 'id');
        $arrayEstNoRol =DatEntidadSegUsuarioSegRol::cargarentidadesusuarionorol(
            $idusuario, $idrol
        );
        if (count($arrayEstNoRol)) {
            $arrayNoAcceso = SeguridadECProxy::getInstance()
                ->accesoDadoArrayNoRol($iddominio, $arrayEstNoRol, $arrayEst);
        }
        foreach ($arrayEstructuras as $key => $est) {
            $estructuras[$key] = $est;
            if (count($arrayNoAcceso)) {
                if ($est['unchecked'] 
                    || count(
                        array_intersect($arrayNoAcceso, array($est['id']))
                    )
                ) {
                    unset($estructuras[$key]['checked']);
                }
            } elseif ($est['unchecked']) {
                unset($estructuras[$key]['checked']);
            }
        }
        echo json_encode($estructuras);

        return;
    }

    /**
     * @method asignarrolesAction() - Función usada para la asignación 
     * de roles a usuario.
     * @return json
     */
    public function asignarrolesAction()
    {
        $arrayUsuario = json_decode(
            stripslashes($this->_request->getPost('arrayUsuario'))
        );
        $idrol = $this->_request->getPost("idrol");
        $flat = $this->_request->getPost("opcion");
        $arrayTiene = json_decode(
            stripslashes($this->_request->getPost('arrayTiene'))
        );        
        $arrayEstructuras = json_decode(
            stripslashes($this->_request->getPost('arrayEntidades'))
        );
        $arrayEstructurasEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayEntidadesEliminar'))
        );
        $arrayPadres = json_decode(
            stripslashes($this->_request->getPost('arrayPadres'))
        );
        $arrayPadresEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayPadresEliminar'))
        );
        if (count($arrayTiene)) {
            if (self::array_equal($arrayPadres, $arrayEstructuras, $arrayTiene) 
                && !count($arrayPadresEliminar) 
                && !count($arrayEstructurasEliminar)
            ) {
                echo "{'bien':3}";

                return;
            }
        }
        if (count($arrayTiene)) { 
            if (count($arrayEstructurasEliminar)) {
                $arrayTiene =array_diff($arrayTiene, $arrayEstructurasEliminar);
            }
            if (count($arrayPadres)) {
                $arrayPadres = array_diff($arrayPadres, $arrayTiene);
            }
            if (count($arrayEstructuras)) {
                $arrayEstructuras = array_diff($arrayEstructuras, $arrayTiene);
            }
        }
        foreach ($arrayUsuario as $idusuario) {            
            if (count($arrayEstructuras)) {                
                $todasNoRol = DatEntidadSegUsuarioSegRol::
                    cargarentidadesusuarionorol($idusuario[0], $idrol);
                if (!SeguridadECProxy::getInstance()
                    ->verificarAccesoEstrucExternas(
                        $idusuario[1], $todasNoRol, $arrayEstructuras
                    )
                ) {
                    echo "{'bien':2}";

                    return;
                }
            }
            $arrayEntidad=DatEntidadSegUsuarioSegRol::cargarentidadesusuariorol(
                $idusuario[0], $idrol
            );
            if (count($arrayEntidad) > 0) {
                $elimArray = array(
                    'estructuras' => $arrayEstructuras,
                    'arrayEntidadesEliminar' => $arrayEstructurasEliminar, 
                    'padres' => $arrayPadres,
                    'arrayPadresEliminar' => $arrayPadresEliminar
                );
                SeguridadECProxy::getInstance()->asignarAccesoRoles(
                    $idusuario[1], $arrayEntidad[0]['identidad'], $elimArray
                );
                if (count($arrayEstructurasEliminar) 
                    || count($arrayPadresEliminar)
                ) {
                    if (SeguridadECProxy::getInstance()->cantAccesoFilas(
                        $arrayEntidad[0]['identidad'], $idusuario[1]
                    ) == 0
                    ) {
                        DatEntidadSegUsuarioSegRol::eliminarusuariorol(
                            $idusuario[0], $idrol
                        );
                    }
                }
            } elseif (count($arrayEstructuras) || count($arrayPadres)) {
                try {
                    $accsesoFila = DatEntidadSegUsuarioSegRol::nextId();
                    $elimnArray = array(
                        'estructuras' => $arrayEstructuras,
                        'arrayEntidadesEliminar' => $arrayEstructurasEliminar, 
                        'padres' => $arrayPadres,
                        'arrayPadresEliminar' => $arrayPadresEliminar
                    );
                    $this->integrator->metadatos->asignarAccesoRoles(
                        $idusuario[1], $accsesoFila, $elimnArray
                    );
                } catch (ZendExt_FastResponse_Exception $e) {
                    $accsesoFila = 1;
                    $exceptionLog = new ZendExt_Exception_Log(
                        new ZendExt_Exception('NOCONTROLLED', $e)
                    );
                    $exceptionLog->handle();
                }
                $entidadusuariorolins = new DatEntidadSegUsuarioSegRol();
                $entidadusuariorolins->idusuario = $idusuario[0];
                $entidadusuariorolins->idrol = $idrol;
                $entidadusuariorolins->identidad = $accsesoFila;
                $entidadusuariorolins->save();
            }
        }
        if ($flat != 'apl') {
            echo "{'bien':3}";

            return;
        } else {
            echo "{'bien':1}";

            return;
        }
    }

    /**
     * @author Darien García Tejo.
     * @method cambiarpasswordAction() - Función usada para cambiarle la 
     * contraseña al usuario seleccionado.
     */
    public function cambiarpasswordAction()
    {
        $dirCerts = substr(
            $_SERVER['DOCUMENT_ROOT'],
            0, 
            strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
        ) .
            'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR 
            . 'auth' . DIRECTORY_SEPARATOR;
        $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
        $usuario = $this->_request->getPost('usuariop');
        $idusuario = $this->_request->getPost('idusuario');
        $newpass = $rsa->decrypt($this->_request->getPost('contrasenap'));
        $servidorAuth = DatServidor::getServidorAuth($idusuario);
        if (count($servidorAuth) > 0) {
            $servAutB = $servidorAuth[0]['DatSerautenticacion']['basedn'];
            $servAut = $servidorAuth[0]['DatSerautenticacion'];
            if (self::changePassword(
                $servidorAuth[0]['ip'], $servAutB, $usuario, $newpass, $servAut
            )
            ) {
                self::savePassw($idusuario, $newpass);
            } else {
                return false;
            }
        } else {
            if ($this->verificarpass($newpass)) {
                if (self::verificarHistorialClave($idusuario, $newpass)) {
                    throw new ZendExt_Exception('SEGCLAVES002');
                }
                // Actualiza el usuario.
                $newpass = md5($newpass);
                $objusuario =Doctrine::getTable('SegUsuario')->find($idusuario);
                $objusuario->contrasenna = $newpass;
                $objusuario->caduca = null;
                $objusuario->save();
                // Actualiza la última clave de acceso.
                $datosClave = SegClaveacceso::obtenerDatosUltClave($idusuario);
                if (count($datosClave) > 0 && $datosClave[0]->idclaveacceso) {
                    $objModificar = Doctrine::getTable('SegClaveacceso')
                        ->find($datosClave[0]->idclaveacceso);
                    $objModificar->valor = false;
                    $objModificar->fechafin = date('d-m-Y');
                    $objModificar->save();
                }
                // Crea un nuevo registro en la tabla seg_claveacceso.
                $objInsert = new SegClaveaccesoModel();
                $objInsert->insertar($idusuario, $newpass);
            } else {
                return false;
            }
        }
        $this->showMessage(
            'La contrase&ntilde;a ha sido cambiada satisfactoriamente.'
        );
    }

    public function validarasignacionrolesAction()
    {
        $arrayUsuario = json_decode(
            stripslashes($this->_request->getPost('ArrayUsuarios'))
        );        
        $result = SegUsuario::validarasignacionroles($arrayUsuario);
        $recorrer = $result[0]['DatEntidadSegUsuarioSegRol'];
        $temp = array();
        $temp = self::borrarCampoUsurio($recorrer);
        unset($result[0]);
        foreach ($result as $record) {
            if (!self::compararArreglos(
                $temp, 
                self::borrarCampoUsurio($record['DatEntidadSegUsuarioSegRol'])
            )
            ) {
                throw new ZendExt_Exception('SEG022');
            }
        }
        echo "{success: true}";
    }

    /**
     * @method ActivarUsuarioAction() - Función usada para activar 
     * cuentas de usuario.
     * return string
     */
    public function ActivarUsuarioAction()
    {
        $arrayUserActivar = json_decode(
            stripslashes($this->_request->getPost('arrUsuarioAct'))
        );
        SegUsuario::activarUsuarios($arrayUserActivar);
        echo "{success: true}";
    }

    /**
     * @method DesactivarUsuarioAction() - Función usada para desactivar 
     * cuentas de usuario.
     * return string
     */
    public function DesactivarUsuarioAction()
    {
        $arrUsuarioDesact = json_decode(
            stripslashes($this->_request->getPost('arrUsuarioDesact'))
        );
        SegUsuario::DesactivarUsuarios($arrUsuarioDesact);
        echo "{success: true}";
    }

    /**
     * @method guardarPerfilAction() - Función usada para asociar al 
     * usuario con la persona a la que corresponde.
     */
    public function guardarPerfilAction()
    {
        $idpersona = $this->_request->getPost('idpersona');
        $idusuario = $this->_request->getPost('idusuario');
        try {
            SegUsuario::guardarPerfil($idusuario, $idpersona);
            $this->showMessage(
                'El perfil ha sido adicionado satisfactoriamente.'
            );
        } catch (Exception $err) {
            $this->showMessage($err->getMessage());
        }
    }

    /**
     * @author Darien García Tejo.
     * @method geticonAction() - Función usada para cargar los iconos 
     * de las estructuras.
     */
    public function geticonAction()
    {
        header('Content-type: image/gif');
        $img = imagecreatefromgif(
            '../metadatos/comun/recursos/iconos/' . $_GET ['icon'] . '.gif'
        );
        imagegif($img);
    }

    /**
     * @method datosGridUsuarios($datosusuario) - Función encargada de parcial 
     * los datos y formar la
     * lista de usuarios a mostrar.
     *
     * @param DoctrineCollection $datosusuario - Colección de objetos de la 
     * entidad SegUsuario.
     *
     * @return Array - Arreglo con los datos de los usuarios.
     */
    private static function datosGridUsuarios($datosusuario)
    {
        $arrayusuario = array();
        foreach ($datosusuario as $key => $usuario) {
            $arrayusuario[$key] = $usuario;
            $dominio = SeguridadECProxy::getInstance()->DatosDominioDadoID(
                $usuario['iddominio']
            );
            $arrayusuario[$key]['dominio'] = $dominio[0]['denominacion'];
        }

        return $arrayusuario;
    }

    /**
     * @method verificarusuario($nombusuario) - Verifica que el nuevo nombre de 
     * usuario no se encuentre registrado.
     * @param string $nombusuario - Nombre de usuario.
     *
     * @return integer - 1 si existe, 0 de lo contrario.
     */
    private static function verificarusuario($nombusuario)
    {
        $usuario = SegUsuario::contarusuario($nombusuario);
        if ($usuario) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * @author Darien García Tejo.
     * @method changePassword($server, $baseDN, $user, $newPassword, $array) - 
     * Función usada para cambiar
     *         la contraseña del usuario en el directorio.
     *
     * @param string $server      - IP del servidor.
     * @param string $baseDN      - Dominio base para realizar las busquedas.
     * @param string $user        - Nombre de usuario.
     * @param string $newPassword - Contraseña en texto claro.
     * @param Array  $array       - Contiene los datos de administración 
     * (Usuario y Contraseña).
     *
     * @return bool - TRUE en caso de cambiarla correctamente, 
     * FALSE de lo contrario.
     */
    private static function changePassword(
        $server, $baseDN, $user, $newPassword, $array
    )
    {
        $userDN = "uid=$user," . "$baseDN";
        $rSA = new ZendExt_RSA_Facade();
        $con = ldap_connect($server);
        ldap_set_option($con, LDAP_OPT_PROTOCOL_VERSION, 3);
        $sr = ldap_search($con, $baseDN, "(uid=$user)");
        ldap_get_entries($con, $sr);
        if (ldap_bind(
            $con, $array['usuario'], 
            $rSA->decrypt($array['password'])
        ) === false
        ) {
            throw new ZendExt_Exception('SEG013');
        }
        $entry = array();
        $entry["userPassword"] = "{MD5}" 
            . base64_encode(pack("H*", md5($newPassword)));
        if (@ldap_mod_replace($con, $userDN, $entry) === false) {
            self::errorReporting(ldap_errno($con));

            return false;
        }
        ldap_close($con);

        return true;
    }

    /**
     * @author Darien García Tejo.
     * @method errorReporting($opcion) - Retorna una expción controlada en 
     * dependencia del tipo de código.
     *
     * @param string $opcion - Código del error lanzado por el servidor 
     * de autenticación.
     *
     * @return ZendExt_Exception - Retorna una expción controlada.
     * @ignore - Falta revisar los códigos de error para cuando se establescan 
     * las políticas de expiración de claves.
     */
    private static function errorReporting($opcion)
    {
        switch ($opcion) {
            case '32':
                throw new ZendExt_Exception('SEGUSUARIO02');
                break;
        }
    }

    /**
     * @author Darien García Tejo.
     * @method savePassw($idusuario, $newpass) - Función usada para cambiar 
     * la contraseña de usuario en base de datos.
     *
     * @param string $idusuario - Identificador del usuario.
     * @param type   $newpass   - Contraseña en texto claro.
     *
     * @return void.
     */
    private static function savePassw($idusuario, $newpass)
    {
        $objusuario = Doctrine::getTable('SegUsuario')->find($idusuario);
        $objusuario->contrasenna = md5($newpass);
        $objusuario->save();
    }

    /**
     * @author Darien García Tejo.
     * @method verificarHistorialClave($idusuario, $newpass) - 
     * Verifica que la clave no se repita en el
     *         tiempo establecido.
     *
     * @param integer $idusuario - Identificador del usuario.
     * @param type    $newpass   - Contraseña en formato md5.
     *
     * @return bool - TRUE en caso de poder cambiarse, FALSE de lo contrario.
     */
    private static function verificarHistorialClave($idusuario, $newpass)
    {
        $restrict = SegRestricclaveacceso::cargarclave(1, 0);
        $cantidad = SegClaveacceso::obtenerClaveFechaFin($idusuario, $newpass);
        if ($cantidad > $restrict[0]['historicoPass']) {
            return true;
        }

        return false;
    }

    /**
     * @method verificarpass($pass) - Función usada para validar 
     * que la contraseña cumpla con las
     * restricciones de la clave.
     *
     * @param string $pass - Contraseña del usuario en texto claro.
     *
     * @return bool - TRUE en caso de cumplir las restricciones, 
     * ZendExt_Exception de lo contrario.
     */
    private function verificarpass($pass)
    {
        $letras = '/[[:alpha:]]/';
        $numeros = '/[\d]/';
        $signos = '/[[:punct:]]/';
        $mayusculas = '/[[:upper:]]/';
        $datosacc = SegRestricclaveacceso::cargarclave(0, 0);
        if (count($datosacc) == 0) {
            throw new ZendExt_Exception('SEG001');
        }
        if (strlen($pass) < $datosacc[0]['minimocaracteres']) {
            throw new ZendExt_Exception(
                'SEG021', null, array($datosacc[0]['minimocaracteres'])
            );
        }
        if ($datosacc[0]['numerica'] == 1) {
            if (preg_match($numeros, $pass) == 0) {
                throw new ZendExt_Exception('SEG002');
            }
        }
        if ($datosacc[0]['alfabetica'] == 1) {
            if (preg_match($letras, $pass) == 0) {
                throw new ZendExt_Exception('SEG003');
            }
        }
        if ($datosacc[0]['signos'] == 1) {
            if (preg_match($signos, $pass) == 0) {
                throw new ZendExt_Exception('SEG004');
            }
        }
        if ($datosacc[0]['mayuscula'] == 1) {
            if (preg_match($mayusculas, $pass) == 0) {
                throw new ZendExt_Exception('SEG027');
            }
        }

        return true;
    }

    private static function borrarCampoUsurio($recorrer)
    {
        $temporal = $recorrer;
        $arrayKeys=  array_keys($recorrer);
        foreach ($arrayKeys as $key) {
            unset($temporal[$key]['idusuario']);
        }

        return $temporal;
    }

    private static function compararArreglos($arrayOne, $arrayTwo)
    {
        foreach ($arrayOne as $key => $value) {
            if (!(isset($arrayTwo[$key]) 
                && $value['idrol'] == $arrayTwo[$key]['idrol'] 
                && $value['identidad'] 
                == $arrayTwo[$key]['identidad']
            )
            ) {
                return false;
            }
        }

        return true;
    }

    private static function array_equal($arrayOne, $arrayTwo, $arrayThree)
    {
        $result = array_intersect($arrayOne, $arrayTwo);
        if (count($result) == count($arrayOne) 
            && count($result) == count($arrayTwo) 
            && count($result) == count($arrayThree)
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @return string Listado de todos los temas registrados en la 
     * aplicacion codificado con Base64.
     */
    private function cargarComboTemas()
    {
        return base64_encode(json_encode(NomTema::cargarcombotema()));
    }

    /**
     * Función usada para llenar el listado de dominios.
     *
     * @return string Listado de dominios codificados con Base64.
     */
    private function cargarcombodominio()
    {
        $arraydominios = SeguridadECProxy::getInstance()->BuscarDominio(0, 0);

        return base64_encode(json_encode($arraydominios));
    }

    /**
     * Función usada para llenar el listado de dominios a buscar.
     *
     * @return string Listado de dominios compartimentados 
     * codificados con Base64.
     */
    private function cargarComboDominioBuscar()
    {
        $idusuario = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $permisos=SegCompartimentacionusuario::cargardominioUsuario($idusuario);
        $dominios = SegUsuario::obtenerIdDominios($iddominio);
        $dominios = SegUtil::convertToUnidimensional($dominios, 'iddominio');
        $permisos = SegUtil::convertToUnidimensional($permisos, 'iddominio');
        $filtroDominio = array_merge($dominios, $permisos);
        $arraydominios = SeguridadECProxy::getInstance()
            ->cargarComboDominioBuscar($filtroDominio);

        return base64_encode(json_encode($arraydominios));
    }

    /**
     * Función usada para cargar el listado de tipos de escritorios.
     *
     * @return string Listado de escritorios codificados con Base64.
     */
    private function cargarcombodesktop()
    {
        return base64_encode(json_encode(NomDesktop::cargarcombodesktop()));
    }

    /**
     * Función usada para llenar el listado de idiomas.
     *
     * @return string Listado de idiomas codificados con Base64.
     */
    private function cargarcomboidioma()
    {
        return base64_encode(json_encode(NomIdioma::cargarcomboidioma()));
    }

    /**
     * Función usada para listar los servidores de autenticación.
     *
     * @return string Listado de servidores de autenticacion
     *  codificados con Base64.
     */
    private function cargarcomboservidoresaut()
    {
        return base64_encode(
            json_encode(DatServidor::cargarcomboservidoresaut())
        );
    }

    private function loadProfile()
    {
        $totalProfile = SegUsuario::cargarperfilusuario(
            ZendExt_GlobalConcept::getInstance()->Perfil->idusuario
        );
        $minProfile = array();
        $minProfile['ididioma'] = $totalProfile[0]['NomIdioma']['ididioma'];
        $minProfile['idtema'] = $totalProfile[0]['NomTema']['idtema'];
        $minProfile['iddesktop'] = $totalProfile[0]['NomDesktop']['iddesktop'];
        $minProfile['iddominio'] = $totalProfile[0]['iddominio'];

        return base64_encode(Zend_Json::encode($minProfile));
    }

}
