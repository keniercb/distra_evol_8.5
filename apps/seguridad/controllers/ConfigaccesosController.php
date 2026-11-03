<?php

class ConfigaccesosController extends SeguridadController
{

    /**
     * @method init() - Constructor de la clase.
     * @return void
     */
    public function init()
    {
        parent::init();
    }

    public function configaccesosAction()
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
        $this->view->arrayDomBusc = $this->cargarcombodominio();
        $this->view->arrayCombDesk = $this->cargarcombodesktop();
        $this->view->arrayCombIdio = $this->cargarcomboidioma();
        $this->view->arrayComServA = $this->cargarcomboservidoresaut();
        $this->view->profile = $this->loadProfile();
        $this->render();
    }

    /**
     * @method cargarusuariodominioAction - Función usada para
     * listar los usuarios compartimentados por lotes.
     */
    public function cargarusuarioAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idUsuario = $this->global->Perfil->idusuario;
        $nombreUsuario = $this->_request->getPost('nombreusuario');
        $dominioBuscar = $this->_request->getPost('dominiobuscar');
        $idGrupo = $this->_request->getPost('idgrupo');
        $idRol = $this->_request->getPost('idrol');
        $idDominio = $this->global->Perfil->iddominio;
        $activar = $this->_request->getPost('activar');

        $datos = self::getUsers($nombreUsuario, $dominioBuscar, $idGrupo, $idRol, $activar,
                                     $idUsuario, $idDominio, $start, $limit);

        $arrayUsuario = $datos[0];
        $cantf = $datos[1];
        echo json_encode(
            array('cantidad_filas' => $cantf, 'datos' => $arrayUsuario)
        );
    }


    private static function getUsers($nombreUsuario, $dominioBuscar, $idGrupo, $idRol, $activar,
                                     $idUsuario, $idDominio, $start, $limit)
    {
        try {
            $sqlDominios = "select distinct nhijo.iddominio, nhijo.denominacion, nhijo.idpadre
                from mod_estructuracomp.nom_dominio dominio
                left join mod_estructuracomp.nom_dominio nhijo ON nhijo.lft >= dominio.lft and nhijo.rgt <= dominio.rgt
                where dominio.iddominio = {$idDominio} ";
            $dominios = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sqlDominios);
            
            $arrayDomainSearch = SegUtil::convertToUnidimensional($dominios, 'iddominio');
            if ($dominioBuscar) {
                $arrayDomainSearch = array($dominioBuscar);
            }
            $estado = $activar == 'Activar' ? 1 : ($activar == 'Desactivar' ? 2 : false);
            $datos = SegUsuario::buscarUsuariosByParams($idUsuario, $idDominio, $arrayDomainSearch, $nombreUsuario, $estado, $limit, $start, $idRol, $idGrupo);
            $arrayDatos = array($datos['datos'], $datos['cantidad']);
            return $arrayDatos;
        } catch (Exception $e) {
            throw new ZendExt_Exception('NOCONTROLLED');
        }
    }

    private static function datosGridUsuarios($datosusuario)
    {
        $arrayUsuario = array();
        foreach ($datosusuario as $key => $usuario) {
            $arrayUsuario[$key] = $usuario;
            $dominio = SeguridadECProxy::getInstance()
                ->DatosDominioDadoID($usuario['iddominio']);
            $arrayUsuario[$key]['dominio'] = $dominio[0]['denominacion'];
        }

        return $arrayUsuario;
    }

    private function cargarComboTemas()
    {
        return base64_encode(json_encode(NomTema::cargarcombotema()));
    }

    private function cargarcombodominio()
    {
        $perfil = ZendExt_GlobalConcept::getInstance()->Perfil;
        try {
            $denomdominio = ZendExt_IoC::getInstance()->metadatos->DatosDominioDadoID($perfil->iddominio)[0]['denominacion'];
            $arraydominios[0] = array(
                "iddominio" => $perfil->iddominio,
                "denominacion" => $denomdominio,
                "descripcion" => $denomdominio
            );
            $dominiosHijos = ZendExt_IoC::getInstance()->metadatos->buscarArbolHijosDominio(array($perfil->iddominio));
            $arraydominios = array_merge($arraydominios, $dominiosHijos);
        } catch (ZendExt_FastResponse_Exception $e) {
            $arraydominios = array(
                "iddominio" => $perfil->iddominio,
                "denominacion" => $denomdominio,
                "descripcion" => $denomdominio
            );
        }
        $arraydominios[] = array(
            "iddominio" => 0,
            "denominacion" => "S/D",
            "descripcion" => "S/D"
        );
        $arrayDominios = array(
            "cant" => count($arraydominios),
            "datos" => $arraydominios
        );

        return base64_encode(json_encode($arrayDominios));
    }

    private static function chequear($id, $rol, $idSistema)
    {
        $arreglo = DatSistemaSegRolDatFuncionalidad::obtenerfunrol(
            $rol, $idSistema
        );
        foreach ($arreglo as $val) {
            if ($val['idfuncionalidad'] == $id) {
                return true;
            }
        }

        return false;
    }

    /**
     * Función usada para llenar el listado de dominios a buscar.
     *
     * @return string Listado de dominios
     * compartimentados codificados con Base64.
     */
    private function cargarComboDominioBuscar()
    {
        $idUsuario = $this->global->Perfil->idusuario;
        $idDominio = $this->global->Perfil->iddominio;
        $permisos = SegCompartimentacionusuario::cargardominioUsuario($idUsuario);
        $dominios = SegUsuario::obtenerIdDominios($idDominio);
        $dominios = SegUtil::convertToUnidimensional($dominios, 'iddominio');
        $permisos = SegUtil::convertToUnidimensional($permisos, 'iddominio');
        $filtroDominio = array_merge($dominios, $permisos);
        $arrayDominios = SeguridadECProxy::getInstance()
            ->cargarComboDominioBuscar($filtroDominio);

        return base64_encode(json_encode($arrayDominios));
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
     * @return string Listado de servidores de
     * autenticacion codificados con Base64.
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

    /**
     * @method insertarusuarioAction() -
     * Función usada para la creación de un nuevo usuario en el sistema.
     * @return void.
     */
    public function insertarusuarioAction()
    {
        $dirCerts = substr(
                $_SERVER['DOCUMENT_ROOT'], 0,
                strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
            )
            . 'config' . DIRECTORY_SEPARATOR . 'certs'
            . DIRECTORY_SEPARATOR . 'auth' . DIRECTORY_SEPARATOR;
        $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
        $usuario = new SegUsuario();
        $usuarioADD = json_decode($this->_request->getPost('usuario'));
        $idServidorAuth = $usuarioADD->idservidor;
        $usuario->nombreusuario = $usuarioADD->nombreusuario;
        $estado = $this->_request->getPost('estado');
        $passw = ($usuarioADD->contrasenna) ? $rsa
            ->decrypt($usuarioADD->contrasenna) : ' ';
        if ($estado === false || $estado === "false") {
            if (!self::verificarpass($passw)) {
                return;
            }
        }
        /*$usuario->accesoconcurrente = !$usuarioADD->simpleacceso;
        $usuario->reescribirsesion = $usuarioADD->simpleacceso &&
            $usuarioADD->reescribirsesion;*/
        $usuario->accesoconcurrente = false;
        $usuario->reescribirsesion = false;
        $usuario->contrasenna = md5($passw);
        $usuario->ip = $usuarioADD->ip;
        /*if($usuario->ip==='0.0.0.0/0'){
            echo json_encode(array(
                'cod'=>3,
                'errorcode'=>6
            ));
            return;
        }*/
        $usuario->email = $usuarioADD->email;
        $usuario->idtema = $usuarioADD->idtema;
        $usuario->iddominio = $usuarioADD->iddominio;
        $usuario->ididioma = $usuarioADD->ididioma;
        $usuario->iddesktop = $usuarioADD->iddesktop;
        $query = SegRestricclaveacceso::cargarclave(0, 0);
        $exp = $query[0]['diascaducidad'];
        $date = new DateTime(date("d-m-Y"));
        $cadena = "-" . $exp . " day";
        $date->modify($cadena);
        $caduca = $date->format("d-m-Y");

        $usuario->caduca = $caduca;;
        $usuario->activo = false;//$usuarioADD->activo;
        $usuario->creadopor = $this->global->Perfil->idusuario;
        $usuario->fcreado = date('d-M-Y H:i:s');
        if (self::verificarEmail($usuarioADD->email) != 0) {
            throw new ZendExt_Exception('SEG017');
        }
        if(self::verificarusuario($usuarioADD->nombreusuario)){
            throw new ZendExt_Exception('SEG009');
        }
        $usuario->save();

        $objUsuarioDominio = new SegUsuarioNomDominio();
        $objUsuarioDominio->idusuario = $usuario->idusuario;
        $objUsuarioDominio->iddominio = $this->global->Perfil->iddominio;
        $modelUsuarioDominio = new SegUsuarioNomDominioModel();
        $modelUsuarioDominio->insertar($objUsuarioDominio);
        if ($idServidorAuth) {
            $sistServAuth = new SegUsuarioDatSerautenticacion();
            $sistServAuth->idusuario = $usuario->idusuario;
            $sistServAuth->idservidor = $idServidorAuth;
            $model = new SegUsuarioModel();
            $model->insertarservidoraut($sistServAuth);
        } else {
            $modelClave = new SegClaveaccesoModel();
            $modelClave->insertar(
                $usuario->idusuario,
                $usuario->contrasenna
            );
        }
        $objectUsuario = json_encode($usuario->toArray());
        echo "{'cod':1,'usuario': '$objectUsuario'}";
    }

    /**
     * @method modificarusuarioAction() - Función usada
     * para la actualización de los metadatos del usuario.
     * @return void
     */
    public function modificarusuarioAction()
    {
        $records = json_decode(
            stripslashes($this->_request->getPost('records'))
        );

        foreach ($records as $record) {
            $idUsuario = $record->idusuario;
            $usuario = Doctrine::getTable('SegUsuario')->find($idUsuario);
            $nombreUsuario = $record->nombreusuario;
            $usuario->ip = $record->ip;
            $usuario->email = $record->email;
            $usuario->idtema = $record->idtema;
            $usuario->activo = isset($record->activo) ? $record->activo : true;

            if (self::verificarEmail($record->email, $idUsuario) != 0) {
                throw new ZendExt_Exception('SEG017');
            }
            //Acceso Concurrente
           /* $usuario->accesoconcurrente = !$record->simpleacceso ? true : false;
            $usuario->reescribirsesion = ($record->simpleacceso &&
                $record->reescribirsesion
            ) ? true : false;*/
            $usuario->accesoconcurrente =  false;
            if (!$usuario->iddominio) {
                $objCompartUsuario = new SegUsuarioNomDominio();
                $objCompartUsuario->idusuario = $idUsuario;
                $objCompartUsuario->iddominio = $this->global->Perfil->iddominio;
                $objCompartUsuario->save();
            }
            $usuario->iddominio = $record->iddominio;
            $usuario->ididioma = $record->ididioma;
            $usuario->iddesktop = $record->iddesktop;
            $usuario->modificadopor = $this->global->Perfil->idusuario;
            $usuario->fmodificado = date('d-M-Y H:i:s');
            $idServidorAuth = $record->idservidor;
            /*if ($usuario->nombreusuario != $nombreUsuario) {
                if (!self::verificarusuario($record->nombreusuario)) {
                    //$usuario->nombreusuario = $record->nombreusuario;*/
                    if ($idServidorAuth) {
                        $sistServAuth = new SegUsuarioDatSerautenticacion();
                        $sistServAuth->idusuario = $usuario->idusuario;
                        $sistServAuth->idservidor = $idServidorAuth;
                        $usuario->caduca = date('d-m-Y');
                        SegClaveacceso::deleteRowsByIdUsuario($idUsuario);
                    } elseif ($idServidorAuth == 0) {
                        if (SegUsuarioDatSerautenticacion::
                        existUserAutenticationServer($idUsuario)
                        ) {
                            SegUsuarioDatSerautenticacion::
                            eliminarusuarioservidoraut($idUsuario);
                            $usuario->contrasenna = md5($nombreUsuario);
                            $usuario->caduca = date('d-m-Y');
                            $modelClave = new SegClaveaccesoModel();
                            $modelClave->insertar(
                                $usuario->idusuario,
                                $usuario->contrasenna
                            );
                        }
                    }
                    $model = new SegUsuarioModel();
                    $model->modificarusuario($sistServAuth, $usuario);
               /* } else {
                    throw new ZendExt_Exception('SEGUSUARIO03');
                }
            } else {
                $usuario->nombreusuario = $record->nombreusuario;
                $sistServAuth = null;
                if ($idServidorAuth) {
                    $sistServAuth = new SegUsuarioDatSerautenticacion();
                    $sistServAuth->idusuario = $usuario->idusuario;
                    $sistServAuth->idservidor = $idServidorAuth;
                    $usuario->caduca = date('d-m-Y');
                    SegClaveacceso::deleteRowsByIdUsuario($idUsuario);
                } elseif ($idServidorAuth == 0) {
                    if (SegUsuarioDatSerautenticacion::
                    existUserAutenticationServer($idUsuario)
                    ) {
                        SegUsuarioDatSerautenticacion::
                        eliminarusuarioservidoraut($idUsuario);
                        $usuario->contrasenna = md5($nombreUsuario);
                        $usuario->caduca = date('d-m-Y');
                        $modelClave = new SegClaveaccesoModel();
                        $modelClave->insertar(
                            $usuario->idusuario,
                            $usuario->contrasenna
                        );
                    }
                }*/
                $model = new SegUsuarioModel();
                $model->modificarusuario($sistServAuth, $usuario);
            /*}*/
        }
        echo "{'cod':1}";
    }

    public function cargarUsuariosLdapAction()
    {
        $dirCerts = substr(
                $_SERVER['DOCUMENT_ROOT'],
                0,
                strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
            ) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR
            . 'auth' . DIRECTORY_SEPARATOR;
        $rSA = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));

        $servidorEnv = $this->_request->getPost('servidor');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $filter = '*';
        $grupo = "cn=*";
        if ($this->_request->getPost('criterio') != '') {
            $filter = "*{$this->_getParam('criterio')}*";
        } else {
            $filter = "*";
        }
        if ($this->_request->getPost('criterio2') != '') {
            $grupo = "ou:dn:=" . $this->_request->getPost('criterio2') . "";
        }
        $servidor = Doctrine::getTable('DatServidor')->find($servidorEnv);
        $servidorAutenticacion = Doctrine::getTable('DatSerautenticacion')
            ->find($servidorEnv);
        $ldapConn = @ldap_connect($servidor->ip, $servidorAutenticacion->puerto);

        if ($ldapConn) {
            if (@ldap_set_option($ldapConn, LDAP_OPT_PROTOCOL_VERSION, 3) &&
                @ldap_set_option($ldapConn, LDAP_OPT_REFERRALS, 0)
            ) {
                if ($servidorAutenticacion->ssl || $servidorAutenticacion->tsl) {
                    @ldap_start_tls($ldapConn);
                }
            }
            $password = $rSA->decrypt($servidorAutenticacion->password);
            $binduser = self::parseUserForLdapConnect($servidorAutenticacion->usuario);
            if (!$binduser) {
                $binduser = $servidorAutenticacion->usuario;
            }
            $binddn = self::createAccountDomainName($servidorAutenticacion->basedn);
            if ($servidorAutenticacion->tservidor == 'ldap') {
                $ldapBind = @ldap_bind($ldapConn, $binduser . '@' . $binddn, $password);
            } else {
                ldap_set_option($ldapConn, LDAP_OPT_PROTOCOL_VERSION, 3);
                $ldapBind = @ldap_bind($ldapConn, $servidorAutenticacion->usuario, $password);
            }
            if ($ldapBind) {
                if ($servidorAutenticacion->tservidor == 'ldap') {
                    //$filtros = "(&($grupo)(|(sAMAccountName=$filter)(mail=$filter)(memberOf=$filter)(cn=$filter)))";
                    $filtros = "(&(sAMAccountName={$filter})(cn={$filter}))";
                    $result = ldap_search(
                        $ldapConn,
                        $servidorAutenticacion->basedn,
                        $filtros,
                        array('ou', 'cn', 'sn', 'givenname', 'mail', 'sAMAccountName', 'dn')
                    );
                } else {
                    $filtros = "(|(uid={$filter})(cn={$filter}))";
                    $result = ldap_search(
                        $ldapConn,
                        $servidorAutenticacion->basedn,
                        $filtros,
                        array('ou', 'cn', 'sn', 'givenname', 'mail', 'uid', 'dn')
                    );
                }
                $result = ldap_get_entries($ldapConn, $result);
            } else {
                throw new ZendExt_Exception('SEG029');
            }
        } else {
            throw new ZendExt_Exception('SEG030');
        }
        //construir datos para enviar a la vista
        $total = count($result) - 1;
        $resp = array();
        for ($i = $start; $i < $start + $limit && $i < $total; $i++) {
            $result[$i]['existe'] = false;
            $tmp = explode(',', $result[$i]['dn']);
            $grupo = '';
            for ($y = count($tmp) - 1; $y >= 0; $y--) {
                if (strpos($tmp[$y], "ou=") !== false) {
                    $grupo .= str_replace("ou=", '/', $tmp[$y]);
                }
            }
            $result[$i]['grupo'] = $grupo;
            if ($servidorAutenticacion->tservidor == 'ldap') {
                $result[$i]['nombreusuario'] = $result[$i]['samaccountname'][0];
            } else {
                $result[$i]['nombreusuario'] = $result[$i][$servidorAutenticacion->fusuario][0];
            }

            if ($servidorAutenticacion->tservidor == 'ldap') {
                $result[$i]["nombre"] = $result[$i]["cn"][0];
            } else {
                if ($servidorAutenticacion->fapellidos != null || $servidorAutenticacion->fapellidos != '') {
                    $result[$i]['nombre'] = $result[$i][$servidorAutenticacion->fnombre][0]
                        . " " . $result[$i][$servidorAutenticacion->fapellidos][0];
                } else {
                    $result[$i]['nombre'] = $result[$i][$servidorAutenticacion->fnombre][0];
                }
            }
            $usuario = SegUsuario::obtenerUsuario(
                $result[$i]['nombreusuario']
            )->toArray();
            if (count($usuario) > 0) {
                $result[$i]['existe'] = true;
            }


            array_push($resp, $result[$i]);
        }
        $resp = json_encode($resp);
        echo "{'cantidad_filas':$total,'datos':$resp}";
    }

    public function importarUsuariosLdapAction()
    {
        $usuarios = json_decode($this->_request->getPost('usuarios'));
        $conf = json_decode($this->_request->getPost('configuracion'));
        $resp = array();
        foreach ($usuarios as $user) {
            $usuario = new SegUsuario();
            $usuarioADD = json_decode($this->_request->getPost('usuario'));
            $idservidorauth = $conf->idservidor;
            $usuario->nombreusuario = $user;
            $usuario->accesoconcurrente = !$conf->simpleacceso ? true : false;
            $usuario->reescribirsesion = ($conf->simpleacceso &&
                $conf->reescribirsesion
            ) ? true : false;
            $usuario->ip = $conf->ip;
            $usuario->contrasenna = md5(' ');
            $usuario->idtema = $conf->idtema;
            $usuario->iddominio = $conf->iddominio;
            $usuario->ididioma = $conf->ididioma;
            $usuario->iddesktop = $conf->iddesktop;
            $usuario->caduca = null;
            $usuario->activo = $conf->activo;
            if (!self::verificarusuario($usuarioADD->nombreusuario)) {
                $usuario->save();
                array_push($resp, $usuario->idusuario);
                $objusuarioDominio = new SegUsuarioNomDominio();
                $objusuarioDominio->idusuario = $usuario->idusuario;
                $objusuarioDominio->iddominio = $this->global->Perfil->iddominio;
                $modelusuarioDominio = new SegUsuarioNomDominioModel();
                $modelusuarioDominio->insertar($objusuarioDominio);
                if ($idservidorauth) {
                    $sistServAuth = new SegUsuarioDatSerautenticacion();
                    $sistServAuth->idusuario = $usuario->idusuario;
                    $sistServAuth->idservidor = $idservidorauth;
                    $model = new SegUsuarioModel();
                    $model->insertarservidoraut($sistServAuth);
                } else {
                    $modelClave = new SegClaveaccesoModel();
                    $modelClave->insertar(
                        $usuario->idusuario, $usuario->contrasenna
                    );
                }
            } else {
                throw new ZendExt_Exception('SEG009');
            }
        }
        echo "{'cod':1,'usuarios': " . json_encode($resp) . "}";
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
        $result = "{'cod': 1}";
        $idusuarioactual = $this->global->perfil->idusuario;
        $arrayUserDel = json_decode(
            stripslashes($this->_request->getPost('ArrayUserDel'))
        );
        if (in_array($idusuarioactual, $arrayUserDel)) {
            $arrayUserDel = array_diff($arrayUserDel, array($idusuarioactual));
            $result = "{'cod': 8}";
        }
        SegUsuario::eliminarUsuarios($arrayUserDel);
        echo $result;
        /*$arrayTemp = SegUsuario::comprovarestado($arrayUserDel);
        if (count($arrayTemp) > 0) {
            if (count($arrayUserDel) == count($arrayTemp)) {
                SegUsuario::eliminarUsuarios($arrayUserDel);
                echo $result;
            } else {
                echo "{'cod': 8}";
            }
        } else {
            echo "{'cod': 8}";
        }*/
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

    /**
     * @method cambiarpasswordAction() - Función usada para cambiarle
     * la contraseña al usuario seleccionado.
     */
    public function cambiarpasswordAction()
    {
        $dirCerts = substr(
                $_SERVER['DOCUMENT_ROOT'], 0,
                strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
            ) . 'config' . DIRECTORY_SEPARATOR . 'certs' .
            DIRECTORY_SEPARATOR . 'auth' . DIRECTORY_SEPARATOR;
        $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
        $usuario = $this->_request->getPost('usuariop');
        $idusuario = $this->_request->getPost('idusuario');
        $newpass = $rsa->decrypt($this->_request->getPost('contrasenap'));
        $servidorAuth = DatServidor::getServidorAuth($idusuario);
        if (count($servidorAuth) > 0) {
            if (self::changePassword(
                $servidorAuth[0], $usuario, $newpass
            )
            ) {
                //self::savePassw($idusuario, $newpass);
            } else {
                return false;
            }
        } else {

            if ($this->verificarpass($newpass)) {
                $newpass = md5($newpass);
                self::verificarHistorialClave($idusuario, $newpass);
                // Actualiza el usuario.
                $objusuario = Doctrine::getTable('SegUsuario')->find($idusuario);
                $objusuario->contrasenna = $newpass;
                $query = SegRestricclaveacceso::cargarclave(0, 0);
                $exp = $query[0]['diascaducidad'];
                $date = new DateTime(date("d-m-Y"));
                $cadena = "-" . $exp . " day";
                $date->modify($cadena);
                $caduca = $date->format("d-m-Y");
                $objusuario->caduca = $caduca;
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
        echo "{'cod':1}";
    }

    /**
     * @method changePassword($servidorAuth, $usuario, $newpass) -
     * Función usada para cambiar
     *         la contraseña del usuario en el directorio.
     *
     * @param string $servidorAuth - Servidor de autenticacion.
     * @param string $usuario - Nombre de usuario.
     * @param string $newpass - Contraseña en texto claro.
     *
     * @return bool - TRUE en caso de cambiarla correctamente,
     *  FALSE de lo contrario.
     */
    private static function changePassword($servidorAuth, $usuario, $newpass)
    {

        $ip = $servidorAuth['ip'];
        if ($servidorAuth['DatSerautenticacion']["tservidor"] === "ldap") {
            putenv('LDAPTLS_REQCERT=allow');//No comprueba el certificado
            $ldap = ldap_connect("ldaps://{$ip}", 636);
            //Tiempo de espera para la respuesta del ldap 10s
//            ldap_set_option($ldap, LDAP_OPT_NETWORK_TIMEOUT, 10);
//            ldap_set_option($ldap, LDAP_OPT_TIMELIMIT, 10);
//            ldap_set_option($ldap, LDAP_OPT_TIMEOUT, 10);

            //Lanzo una excepcion si no se puede conectar al servidor ldap (AD)
            if (!$ldap) {
                throw new ZendExt_Exception('EP016');
            }

            ldap_set_option($ldap, LDAP_OPT_PROTOCOL_VERSION, 3);
            ldap_set_option($ldap, LDAP_OPT_REFERRALS, 0);

            //DN del usuario con privilegios para cambiar la contraseña
            $adminDn = $servidorAuth['DatSerautenticacion']["usuario"];
            //Password del usuario con privilegios
            $dirCerts = substr($_SERVER['DOCUMENT_ROOT'],0,strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR . 'auth' . DIRECTORY_SEPARATOR;
            $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
            $adminPs = $rsa->decrypt($servidorAuth['DatSerautenticacion']["password"]);
            $adminBn = ldap_bind($ldap,$adminDn,$adminPs);

            if (!$adminBn) {
//                throw new ZendExt_Exception('EP017');
                throw new ZendExt_Exception('EP016');
            }

            $recurso = ldap_search(
                $ldap,//Conexion
                $servidorAuth['DatSerautenticacion']["basedn"],//DN
                "(sAMAccountName={$usuario})");

            if(!is_resource($recurso)){
                throw new ZendExt_Exception('EP018');
            }
            $entry = ldap_first_entry($ldap, $recurso);
            $usuarioDn = ldap_get_dn($ldap, $entry);

            $adminBn = ldap_bind($ldap,$adminDn,$adminPs);
            if (!$adminBn) {
//                throw new ZendExt_Exception('EP017');
                throw new ZendExt_Exception('EP016');
            }

            $np= array();
            //TODO probar con UTF-8
            $np['unicodePwd'] = mb_convert_encoding('"'.$newpass.'"',"UTF-16LE");
            $result = ldap_mod_replace($ldap,$usuarioDn,$np);

            if(!$result) {
                throw new ZendExt_Exception('EP019');
            }
            ldap_close($ldap);
            return $result;

        }else {
            $baseDN = $servidorAuth['DatSerautenticacion']['basedn'];
            $array = $servidorAuth['DatSerautenticacion'];
            $userDN = "uid=$usuario," . "$baseDN";
            $rSA = new ZendExt_RSA_Facade();
            $con = ldap_connect($ip);
            ldap_set_option($con, LDAP_OPT_PROTOCOL_VERSION, 3);
            if (ldap_bind(
                    $con, $array['usuario'], $rSA->decrypt($array['password'])
                ) === false
            ) {
                throw new ZendExt_Exception('SEG013');
            }
            $entry = array();
            $entry["userPassword"] = "{MD5}" . base64_encode(
                    pack("H*", md5($newpass))
                );
            if (@ldap_mod_replace($con, $userDN, $entry) === false) {
                self::errorReporting(ldap_errno($con));
                return false;
            }
            ldap_close($con);

            return true;
        }




    }

    /**
     * @method ActivarUsuarioAction() - Función usada para
     * activar cuentas de usuario.
     * return string
     */
    public function ActivarUsuarioAction()
    {
        $arrayUserActivar = json_decode(
            stripslashes($this->_request->getPost('arrUsuarioAct'))
        );
        SegUsuario::activarUsuarios($arrayUserActivar);
        echo "{'cod': 1}";
    }

    /**
     * @method DesactivarUsuarioAction() - Función usada para
     * desactivar cuentas de usuario.
     * return string
     */
    public function DesactivarUsuarioAction()
    {
        $arrUsuarioDesact = json_decode(
            stripslashes($this->_request->getPost('arrUsuarioDesact'))
        );
        SegUsuario::DesactivarUsuarios($arrUsuarioDesact);
        echo "{'cod': 1}";
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
            echo "{'cod':1, 'msg': 'success'}";
        } catch (Exception $err) {
            $msg = $err->getMessage();
            "{'cod':6, 'msg': $msg}";
        }
    }

    /**
     * @method cargarrolesAction() - Función usada para llenar el grid
     * de roles (Compartimentados pos dominios).
     * @return json
     */
    public function cargarrolesAction()
    {
        $start = (int)$this->_request->getPost("start");
        $limit = (int)$this->_request->getPost("limit");
        $idusuario = $this->_request->getPost("idusuario");
        $rolbuscado = $this->_request->getPost("rolbuscado");
        $filtroDominio = $this->global->Perfil->iddominio;
        $result = array();
        //todos los roles del dominio
        /*$arrayRolesDominio = SegRolNomDominio::RolesdelDominio($filtroDominio);
        $arrayRolesDominio = SegUtil::convertToUnidimensional(
            $arrayRolesDominio,
            'idrol'
        );
        $arrayRolesPermisoDominio=SegCompartimentacionroles::cargarRolesDominio(
            $filtroDominio
        );
        $arrayRolesPermisoDominio = SegUtil::convertToUnidimensional(
            $arrayRolesPermisoDominio,
            'idrol'
        );
        $arrayResult = array_merge(
            $arrayRolesDominio,
            $arrayRolesPermisoDominio
        );*/
        $arrayResult = SegUtil::convertToUnidimensional(SegRolModel::loadArbol(NULL, null), 'idrol');
        if (count($arrayResult) > 0) {
            if (!$rolbuscado) {
                $result = SegRol::obtenerrolesasociados(
                    $limit,
                    $start,
                    $idusuario,
                    $arrayResult
                );
                $cantrol = SegRol::cantrolesDominio($arrayResult);
            } else {
                $result = SegRol::obtenerRolesBuscado(
                    $rolbuscado,
                    $limit,
                    $start,
                    $idusuario,
                    $arrayResult
                );
                $cantrol = SegRol::cantrolBuscados(
                    $rolbuscado,
                    $arrayResult,
                    false
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
                $result = array('cantidad_filas' => $cantrol,
                    'datos' => $arrayroles
                );
            } else {
                $result = array('cantidad_filas' => 0, 'datos' => array());
            }
        }
        echo json_encode($result);
    }

    /**
     * @method cargarentidadesAction() - Función usada para
     * cargar el árbol de estructuras
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
            $idusuario,
            $idrol
        );

        $acceso = (count($tuplas)) ? $tuplas[0]['identidad'] : 0;
        // print_r($tuplas);die;
        $arrayEstructuras = SeguridadECProxy::getInstance()
            ->buscarHijosEstructurasDadoArray(
                $acceso,
                $iddominio,
                $idEstructura,
                1
            );
        $arrayEst = SegUtil::convertToUnidimensional($arrayEstructuras, 'id');
        $arrayEstNoRol = DatEntidadSegUsuarioSegRol::cargarentidadesusuarionorol(
            $idusuario, $idrol
        );
        if (count($arrayEstNoRol)) {
            $arrayNoAcceso = SeguridadECProxy::getInstance()
                ->accesoDadoArrayNoRol($iddominio, $arrayEstNoRol, $arrayEst);
        }
        foreach ($arrayEstructuras as $key => $est) {
            $estructuras[$key] = $est;
            if (count($arrayNoAcceso)) {
                if ($est['unchecked'] ||
                    count(array_intersect($arrayNoAcceso, array($est['id'])))
                ) {
                    unset($estructuras[$key]['checked']);
                }
            } elseif ($est['unchecked']) {
                unset($estructuras[$key]['checked']);
            }
            $estructuras[$key]['uiProvider'] = 'ui';
        }
        echo json_encode($estructuras);

        return;
    }

    /**
     * @method errorReporting($opcion) - Retorna una expción
     * controlada en dependencia del tipo de código.
     *
     * @param string $opcion - Código del error lanzado por
     * el servidor de autenticación.
     *
     * @return ZendExt_Exception - Retorna una expción controlada.
     * @ignore - Falta revisar los códigos de error para cuando se
     * establescan las políticas de expiración de claves.
     *
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
     * @method asignarrolesAction() - Función usada para
     * la asignación de roles a usuario.
     * @return json
     */
    public function asignarrolesAction()
    {
        $asignaciones = json_decode(
            stripslashes($this->_request->getPost('asignaciones'))
        );
        foreach ($asignaciones as $asignacion) {
            $arrayUsuario = $asignacion->arrayUsuario;
            $idrol = $asignacion->idrol;
            $flat = $asignacion->opcion;
            $arrayTiene = $asignacion->arrayTiene;
            //estructura chekeadas
            $arrayEstructuras = $asignacion->arrayEntidades;
            //estructuras a eliminar ke son las ke se deschekearon
            $arrayEstructurasEliminar = $asignacion->arrayEntidadesEliminar;
            //array de nodos marcados sin desplegar, es decir
            //los ke hay ke buscar sus hijos y ponerlos como chekeados
            $arrayPadres = $asignacion->arrayPadres;
            //array de nodos desmarcados sin desplegar,
            //hay ke buscar sus hijos y ponerlos en el array a eliminar
            $arrayPadresEliminar = $asignacion->arrayPadresEliminar;
            if (count($arrayTiene)) {
                if (self::array_equal(
                        $arrayPadres,
                        $arrayEstructuras,
                        $arrayTiene
                    ) &&
                    !count($arrayPadresEliminar) &&
                    !count($arrayEstructurasEliminar)
                ) {
                    echo "{'bien':3}";
                    return;
                }
            }
            if (count($arrayTiene)) {//Descartando nodos que ya estan insertados.
                if (count($arrayEstructurasEliminar)) {
                    $arrayTiene = array_diff(
                        $arrayTiene,
                        $arrayEstructurasEliminar
                    );
                }
                if (count($arrayPadres)) {
                    $arrayPadres = array_diff($arrayPadres, $arrayTiene);
                }
                if (count($arrayEstructuras)) {
                    $arrayEstructuras = array_diff(
                        $arrayEstructuras,
                        $arrayTiene
                    );
                }
            }
            foreach ($arrayUsuario as $idusuario) {
                // Verifico que este marcada al menos una entidad
                // para uno de los roles que tenga el usuario
                if (count($arrayEstructuras)) {
                    //Cargo el acceso de todos los roles
                    //diferentes al que tengo seleccionado.
                    $todasNoRol = DatEntidadSegUsuarioSegRol::
                    cargarentidadesusuarionorol($idusuario[0], $idrol);
                    if (!SeguridadECProxy::getInstance()
                        ->verificarAccesoEstrucExternas(
                            $idusuario[1],
                            $todasNoRol,
                            $arrayEstructuras
                        )
                    ) {
                        //Se verifica que tenga acceso
                        //al menos a una estructura externa.
                        echo "{'bien':2}";
                        return;
                    }
                }
                $arrayEnt = DatEntidadSegUsuarioSegRol::cargarentidadesusuariorol(
                    $idusuario[0],
                    $idrol
                );
                if (count($arrayEnt) > 0) {
                    $elimArray = array(
                        'estructuras' => $arrayEstructuras,
                        'arrayEntidadesEliminar' => $arrayEstructurasEliminar,
                        'padres' => $arrayPadres,
                        'arrayPadresEliminar' => $arrayPadresEliminar
                    );
                    SeguridadECProxy::getInstance()->asignarAccesoRoles(
                        $idusuario[1],
                        $arrayEnt[0]['identidad'],
                        $elimArray
                    );
                    if (count($arrayEstructurasEliminar) ||
                        count($arrayPadresEliminar)
                    ) {
                        if (SeguridadECProxy::getInstance()
                                ->cantAccesoFilas(
                                    $arrayEnt[0]['identidad'],
                                    $idusuario[1]
                                ) == 0
                        ) {
                            DatEntidadSegUsuarioSegRol::eliminarusuariorol(
                                $idusuario[0], $idrol
                            );
                        }
                    }
                } elseif (count($arrayEstructuras) || count($arrayPadres)) {
                    $accsesoFila = DatEntidadSegUsuarioSegRol::nextId();
                    try {
                        $elimnArray = array('estructuras' => $arrayEstructuras,
                            'arrayEntidadesEliminar' => $arrayEstructurasEliminar,
                            'padres' => $arrayPadres,
                            'arrayPadresEliminar' => $arrayPadresEliminar);
                        $this->integrator->metadatos->asignarAccesoRoles(
                            $idusuario[1],
                            $accsesoFila,
                            $elimnArray
                        );
                    } catch (ZendExt_FastResponse_Exception $e) {
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
        }
        if ($flat != 'apl') {
            echo "{'bien':3}";
            return;
        } else {
            echo "{'bien':1}";
            return;
        }
    }

    private static function array_equal($firstArray, $secondArray, $thirdArray)
    {
        $result = array_intersect($firstArray, $secondArray);
        if (count($result) == count($firstArray) &&
            count($result) == count($secondArray) &&
            count($result) == count($thirdArray)
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @method verificarHistorialClave($idusuario, $newpass) -
     * Verifica que la clave no se repita en el
     *         tiempo establecido.
     *
     * @param integer $idusuario - Identificador del usuario.
     * @param type $newpass - Contraseña en formato md5.
     *
     * @return bool - TRUE en caso de poder cambiarse, FALSE de lo contrario.
     */
    /* private static function verificarHistorialClave($idusuario, $newpass)
     {
         /*$restrict = SegRestricclaveacceso::cargarclave(1, 0);
         $cantidad = SegClaveacceso::obtenerClaveFechaFin($idusuario, $newpass);
         if ($cantidad > $restrict[0]['historicoPass']) {
             return true;
         }
         return false;
     }*/

    /**
     * @method verificarHistorialClave($idusuario, $newpass) -
     * Verifica que en el historico de claves  solo se almacenen las claves del
     * usuario según las restricciones establecidas y esta no se repita en el historial
     *
     * @param integer $idusuario - Identificador del usuario.
     * @param type $newpass - Contraseña en formato md5.
     *
     */
    private static function verificarHistorialClave($idusuario, $newpass)
    {
        $restrict = SegRestricclaveacceso::cargarclave(1, 0)[0]['historicoPass'];
        $historicoClaves = SegClaveacceso::obtenerHistoricoClaves($idusuario);
//      se compara si la cantidad de claves almecenadas es mayor que el límite permitido
        if (count($historicoClaves) > $restrict) {
//          se calcula el excedente almacenado
            $cant = count($historicoClaves) - $restrict;
//          se extren las claves más viejas en un arreglo para eliminarlas
            $eliminar = array_slice($historicoClaves, 0, $cant);
            $arrayId = array();
//          se guardan en un arreglo solo los id de esas claves
            foreach ($eliminar as $e) {
                array_push($arrayId, $e['idclaveacceso']);
            }
            SegClaveacceso::eliminarClaveMasAntigua($arrayId);
//          se eliminan del arreglo las claves eliminadas de BD
            array_splice($historicoClaves, 0, $cant);
        }
        $existeEnHistorial = null;
        foreach ($historicoClaves as $his) {
            if ($newpass == $his['clave']) {
                $existeEnHistorial = $his['idclaveacceso'];
                break;
            }
        }

        if (is_null($existeEnHistorial)) {
            if (count($historicoClaves) >= $restrict) {
                SegClaveacceso::eliminarClaveMasAntigua($historicoClaves[0]['idclaveacceso']);
            }
        }else{
            SegClaveacceso::eliminarClaveById($existeEnHistorial);
        }
    }

    /**
     * @method savePassw($idusuario, $newpass) -
     * Función usada para cambiar la contraseña de usuario en base de datos.
     *
     * @param string $idusuario - Identificador del usuario.
     * @param type $newpass - Contraseña en texto claro.
     *
     * @return void.
     */
    private static function savePassw($idusuario, $newpass)
    {
        $objusuario = Doctrine::getTable('SegUsuario')->find($idusuario);
        $objusuario->contrasenna = md5($newpass);
        $objusuario->save();
    }

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
            echo "{'cod':3, 'errorcode': 1,'min': " . $datosacc[0]['minimocaracteres'] . "}";
            return false;
        }
        if ($datosacc[0]['numerica'] == 1) {
            if (preg_match($numeros, $pass) == 0) {
                echo "{'cod':3, 'errorcode': 2}";
                return false;
            }
        }
        if ($datosacc[0]['alfabetica'] == 1) {
            if (preg_match($letras, $pass) == 0) {
                echo "{'cod':3, 'errorcode': 3}";
                return false;
            }
        }
        if ($datosacc[0]['signo'] == 1) {
            if (preg_match($signos, $pass) == 0) {
                echo "{'cod':3, 'errorcode': 4}";
                return false;
            }
        }
        if ($datosacc[0]['mayuscula'] == 1) {
            if (preg_match($mayusculas, $pass) == 0) {
                echo "{'cod':3, 'errorcode': 5}";
                return false;
            }
        }

        return true;
    }

    /**
     * @method verificarusuario($nombusuario) -
     * Verifica que el nuevo nombre de usuario no se encuentre registrado.
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

    private static function verificarEmail($email, $idUsuario = null){
        $filtro = !is_null($idUsuario) ? " and idusuario <> {$idUsuario}" :"";
        return Doctrine_Query::create()->select('idusuario')
            ->from('SegUsuario')
            ->where("email = ? {$filtro}", $email)
            ->count();
}

    public function comboRolesAction()
    {
        $denominacion = null;
        $datosRol = SegRolModel::loadArbol($denominacion, "FALSE");
        foreach ($datosRol as $valores => $valor) {
            $datos[$valores]['idrol'] = $valor['idrol'];
            $datos[$valores]['denominacion'] = $valor['denominacion'];
//            $datos[$valores]['iconCls'] = 'asignaroles';

        }

        echo json_encode(array('datos' => $datos));

    }

    public function comboGrupoAction()
    {
        $denominacion = null;
        $datosGrupo = SegRolModel::loadArbol($denominacion, "TRUE");

        foreach ($datosGrupo as $valores => $valor) {
            $datos[$valores]['idrol'] = $valor['idrol'];
            $datos[$valores]['denominacion'] = $valor['denominacion'];
        }

        echo json_encode(array('datos' => $datos));

    }


    public function cargarrolAction()
    {
        $denominacion = null;
        $datosRol = SegRolModel::loadArbol($denominacion, "FALSE");
        $datosGrupo = SegRolModel::loadArbol($denominacion, "TRUE");
        $childrensRol = array();
        if (count($datosRol) > 0) {
            foreach ($datosRol as $valores => $valor) {
                $childrensRol[$valores]['idrol'] = $valor['idrol'];
                $childrensRol[$valores]['text'] = $valor['denominacion'];
                $childrensRol[$valores]['abreviatura'] = $valor['abreviatura'];
                $childrensRol[$valores]['descripcion'] = $valor['descripcion'];
                $childrensRol[$valores]['regular'] = $valor['regular'];
                $childrensRol[$valores]['leaf'] = true;
                $childrensRol[$valores]['type'] = 'rol';
                $childrensRol[$valores]['isTarget'] = false;
                $childrensRol[$valores]['iconCls'] = 'asignaroles';
            }
        }

        $childrensGrupo = array();
        if (count($datosGrupo) > 0) {
            foreach ($datosGrupo as $valores => $valor) {
                $roles = SegRolModel::loadRolesGrupo($valor['idrol']);
                $childrensGrupo[$valores]['idrol'] = $valor['idrol'];
                $childrensGrupo[$valores]['text'] = $valor['denominacion'];
                $childrensGrupo[$valores]['abreviatura'] = $valor['abreviatura'];
                $childrensGrupo[$valores]['descripcion'] = $valor['descripcion'];
                $childrensGrupo[$valores]['regular'] = $valor['regular'];
                $childrensGrupo[$valores]['draggable'] = false;
                $childrensGrupo[$valores]['leaf'] = false;
                $childrensGrupo[$valores]['type'] = 'grupo';
                $childrensGrupo[$valores]['iconCls'] = 'folder';
                $rolesAsociados = array();
                if ($roles) {
                    foreach ($roles as $valoresRoles => $valorRoles) {
                        $rolesAsociados[$valoresRoles]['idrol'] =
                            $valorRoles['idrol'];
                        $rolesAsociados[$valoresRoles]['text'] =
                            $valorRoles['denominacion'];
                        $rolesAsociados[$valoresRoles]['abreviatura'] =
                            $valorRoles['abreviatura'];
                        $rolesAsociados[$valoresRoles]['descripcion'] =
                            $valorRoles['descripcion'];
                        $rolesAsociados[$valoresRoles]['regular'] =
                            $valorRoles['regular'];
                        $rolesAsociados[$valoresRoles]['leaf'] = true;
                        $rolesAsociados[$valoresRoles]['type'] = 'rol';
                        $rolesAsociados[$valoresRoles]['isTarget'] = false;
                        $rolesAsociados[$valoresRoles]['iconCls'] = 'asignaroles';
                    }
                }
                $childrensGrupo[$valores]['children'] = $rolesAsociados;
            }
        }
        $grupos = array(
            'text' => 'Grupos',
            'type' => 'raiz',
            'draggable' => false,
            'allowDrop' => false,
            'expanded' => true,
            'children' => $childrensGrupo,
            'leaf' => false,
            'iconCls' => 'folder'
        );
        $roles = array(
            'text' => 'Roles',
            'type' => 'raiz',
            'draggable' => false,
            'allowDrop' => false,
            'expanded' => true,
            'children' => $childrensRol,
            'leaf' => false,
            'iconCls' => 'folder'
        );
        $response = array($grupos, $roles);
        echo json_encode($response);
    }

    /**
     * @method modificarrolAction -
     * Función usada para modificar el rol seleccionado.
     * @return string
     */
    public function modificarrolAction()
    {
        $idrol = $this->_request->getPost('idrol');
        $denominacion = $this->_request->getPost('denominacion');
        $abreviatura = $this->_request->getPost('abreviatura');
        $descripcion = $this->_request->getPost('descripcion');
        //$type = $this->_request->getPost('type');
        $arraypadres = json_decode(
            stripslashes($this->_request->getPost('arraypadres'))
        );
        $sistfun = json_decode(
            stripslashes($this->_request->getPost('arraysistfun'))
        );
        $sistemas = json_decode(
            stripslashes($this->_request->getPost('arraysist'))
        );
        $arrayeliminar = json_decode(
            stripslashes($this->_request->getPost('arrayeliminar'))
        );
        $arrayGruposAdd = json_decode(
            stripslashes($this->_request->getPost('arrayGruposAdd'))
        );
        $arrayGruposDel = json_decode(
            stripslashes($this->_request->getPost('arrayGruposDel'))
        );
        $class = $this->_request->getPost('clase') . 'Model';
        $arrayModf = array(
            $idrol,
            $denominacion,
            $descripcion,
            $abreviatura,
            $sistfun,
            $sistemas,
            $arrayGruposAdd,
            $arrayGruposDel,
            $arraypadres,
            $arrayeliminar
        );
        call_user_func_array(array($class, 'modificarrol'), $arrayModf);
        echo "{'cod': 1}";
    }

    /**
     * @method insertarAction - Función usada para adicionar un nuevo rol.
     * @return string
     */
    public function insertarrolAction()
    {
        $denominacion = ($this->_request->getPost('denominacion'));
        $descripcion = $this->_request->getPost('descripcion');
        $abreviatura = $this->_request->getPost('abreviatura');
        $arraypadres = json_decode(
            stripslashes($this->_request->getPost('arraypadres'))
        );
        $type = $this->_request->getPost('type');
        $arrayFunc = json_decode(
            stripslashes($this->_request->getPost('arraysistfun'))
        );
        $arraySistemas = json_decode(
            stripslashes($this->_request->getPost('arraysist'))
        );
        $arrayGrupos = ($type == 'rol') ? json_decode(
            stripslashes($this->_request->getPost('arrayGrupo'))
        ) : array();
        $class = $this->_request->getPost('clase') . 'Model';
        $arrayInsert = array(
            $denominacion,
            $descripcion,
            $abreviatura,
            $arrayFunc,
            $arraySistemas,
            $arrayGrupos,
            $arraypadres
        );
        call_user_func_array(array($class, 'insertarRol'), $arrayInsert);
        echo "{'cod': 1}";
    }

    /**
     * @author Darien García Tejo.
     * @method eliminarAction - Función usada para eliminar uno o varios roles.
     * @return string
     */
    public function eliminarrolAction()
    {
        $arrayDel = json_decode(
            stripslashes($this->_request->getPost('arrayRolesElim'))
        );
        $class = $this->_request->getPost('clase') . 'Model';
        echo call_user_func(array($class, 'eliminar'), $arrayDel);
    }

    public function validarasignacionrolesAction()
    {
        $arrayUsuario = json_decode(
            stripslashes($this->_request->getPost('ArrayUsuarios'))
        );
        $obj = new SeguridadProxyService();
        $usuarioComparar = array();
        $usuarioComparar["idusuario"] = $arrayUsuario[0];
        $usuarioComparar["idroles"] = SegUtil::convertToUnidimensional(
            DatEntidadSegUsuarioSegRol::cargarentidadesusuario(
                $arrayUsuario[0]
            ), "idrol"
        );
        $usuarioComparar["entidades"] = $obj->getIdsEntityByUser(
            $arrayUsuario[0]
        );
        unset($arrayUsuario[0]);
        foreach ($arrayUsuario as $usuario) {
            $usuarioActual = array();
            $usuarioActual["idusuario"] = $usuario;
            $usuarioActual["identidades"] =
                DatEntidadSegUsuarioSegRol::cargarentidadesusuario($usuario);
            $usuarioActual["idroles"] = SegUtil::convertToUnidimensional(
                DatEntidadSegUsuarioSegRol::cargarentidadesusuario(
                    $usuario
                ), "idrol"
            );
            if (count($usuarioComparar["idroles"]) !=
                count($usuarioActual["idroles"]) ||
                array_diff(
                    $usuarioComparar["idroles"], $usuarioActual["idroles"]
                )
            ) {
                throw new ZendExt_Exception('SEG028');
            } else {
                $usuarioActual["entidades"] = $obj->getIdsEntityByUser($usuario);
                if (array_diff(
                        $usuarioActual["entidades"], $usuarioComparar["entidades"]
                    ) || count(
                        $usuarioComparar["entidades"]
                    ) != count($usuarioActual["entidades"])
                )
                    throw new ZendExt_Exception('SEG028');
            }
        }
        echo "{cod: 1}";
    }

    /**
     * @author Darien García Tejo.
     * @method cargarGridGruposAction -
     * Función usada para listar los grupos compartimentados.
     * @return json
     */
    public function cargarGridGruposAction()
    {
        $objstart = $this->_request->getPost("start");
        $objlimit = $this->_request->getPost("limit");
        $objidrol = $this->_request->getPost("idrol");
        echo json_encode(
            SegGrupoModel::cargarGridGrupos($objstart, $objlimit, $objidrol)
        );
    }

    /**
     * @method cargarsistemafuncionalidadesAction -
     * Función usada para cargar el árbol de sistemas
     * hasta nivel de funcionalidades.
     * Este árbol es usado a la hora de adicionar y
     * modificar los accesos del rol.
     *
     * @return void
     */
    public function cargarsistemafuncionalidadesAction()
    {
        $idnodo = $this->_request->getPost('node');
        $idsistema = $this->_request->getPost('idsistema');
        $rol = $this->_request->getPost('idrol');
        $index = 0;
        $sistemafunArr = array();
        if ($idnodo == 0) {
            $sistemas = DatSistema::cargarArbolSistemasCompartimentacion(
                $idnodo
            );
            if (!count($sistemas)) {
                echo json_encode(array());

                return;
            }
        } else {
            $sistemas = DatSistema::cargarArbolSistemasCompartimentacion(
                $idsistema
            );
        }
        if (count($sistemas)) {
            foreach ($sistemas as $valor) {
                $sistemafunArr[$index]['id'] = $valor->id . '_' . $idnodo;
                $sistemafunArr[$index]['idsistema'] = $valor->id;
                $sistemafunArr[$index]['text'] = $valor->text;
                if (DatSistemaSegRolDatFuncionalidad::tieneFuncionalidad(
                        $rol, $valor->id
                    ) > 0
                ) {
                    $sistemafunArr[$index]['tiene'] = true;
                } else {
                    $sistemafunArr[$index]['tiene'] = false;
                }
                if (DatSistema::verificarrolsistema($rol, $valor->id)) {
                    $sistemafunArr[$index]['checked'] = true;
                } else {
                    $sistemafunArr[$index]['checked'] = false;
                }
                if ($valor->leaf) {
                    if (!DatFuncionalidad::obtenerCantFuncRecursosCompart(
                        $valor->id
                    )
                    ) {
                        $sistemafunArr[$index]['leaf'] = true;
                    } else {
                        $sistemafunArr[$index]['leaf'] = false;
                    }
                } else {
                    $sistemafunArr[$index]['leaf'] = false;
                }
                $index++;
            }
        }
        if ($idsistema != 0) {
            $funcionalidad = DatFuncionalidad::cargarFuncionalidadesRecursos(
                $idsistema
            );
            if (count($funcionalidad) > 0) {
                foreach ($funcionalidad as $valor) {
                    if (count($valor['DatRecurso']) > 0) {
                        $sistemafunArr[$index]['id'] =
                            $valor ['id'] . '_' . $idnodo;
                        $sistemafunArr[$index]['idfuncionalidad'] =
                            $valor ['id'];
                        $sistemafunArr[$index]['text'] = $valor['text'];
                        $sistemafunArr[$index]['leaf'] = true;
                        if ($rol) {
                            $chequear = self::chequear(
                                $valor ['id'], $rol, $idsistema
                            );
                            if ($chequear) {
                                $sistemafunArr[$index]['checked'] = true;
                            } else {
                                $sistemafunArr[$index]['checked'] = false;
                            }
                        } else {
                            $sistemafunArr[$index]['checked'] = false;
                        }
                        $index++;
                    }
                }
            }
        }
        echo json_encode($sistemafunArr);

        return;
    }

    /**
     * @method insertarrelacionAction -
     * Función usada para asignar un rol a varios grupos.
     * @return string
     */
    public function insertarrelacionAction()
    {
        $arrayGruposAdd = json_decode(
            stripslashes($this->_request->getPost('arrayGruposAdd'))
        );
        $idrol = $this->_request->getPost('idrol');
        SegRolModel::insertarRelacionRolGrupo($idrol, $arrayGruposAdd);
        echo json_encode(array('cod' => 1));
    }

    public function eliminarrelacionAction()
    {
        $arrayGruposAdd = json_decode(
            stripslashes($this->_request->getPost('arrayGruposAdd'))
        );
        $idrol = $this->_request->getPost('idrol');
        SegRolModel::eliminarRelacionRolGrupo($idrol, $arrayGruposAdd);
        echo json_encode(array('cod' => 1));
    }

    /**
     * @author Darien García Tejo.
     * @method cargaraccionesquetieneAction -
     * Función usada para listar todos los recursos a los que un rol
     *         tiene acceso.
     * @return void
     */
    public function cargaraccionesquetieneAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $idrol = $this->_request->getPost('idrol');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $datos = DatRecurso::cargarRecursosPermitidos(
            $idsistema, $idrol, $idfuncionalidad, $limit, $start
        );
        $cantfilas = DatRecurso::cantRecursosPermitidos(
            $idsistema, $idrol, $idfuncionalidad
        );
        echo json_encode(
            array('cantidad_filas' => $cantfilas, 'datos' => $datos)
        );

        return;
    }

    /**
     * @author Darien García Tejo.
     * @method cargaraccionesquenotieneAction -
     * Función usada para listar todos los recursos registrados a los
     *         que el rol no tiene acceso.
     * @return void
     */
    public function cargaraccionesquenotieneAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $idrol = $this->_request->getPost('idrol');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
//        $acciones = DatRecurso::obtenerRecursosPermitidos(
//            $idsistema, $idrol, $idfuncionalidad
//        );
        $acciones = DatRecurso::obtenerRecursosPermitidosI(
            $idsistema, $idrol, $idfuncionalidad
        );
        $arrayRecursos = SegUtil::convertToUnidimensional(
            $acciones, 'idrecurso'
        );
//        $accionesNoTiene = DatRecurso::obtenerRecursosNoPermitidos(
//            $idfuncionalidad, $arrayRecursos, $limit, $start
//        );
        $accionesNoTiene = DatRecurso::obtenerRecursosNoPermitidosI(
            $idfuncionalidad, $arrayRecursos, $limit, $start
        );

        $cantidad = DatRecurso::cantidadRecursosNoPermitidos(
            $idfuncionalidad, $arrayRecursos
        );
        echo json_encode(
            array('cantidad_filas' => $cantidad, 'datos' => $accionesNoTiene)
        );
    }

    /**
     * @method cargarsistemafuncAction -
     * Función usada para cargar el árbol de sistemas
     * hasta nivel de funcionalidad.
     * Esta acción es usada para gestionar a partir de
     * ella los recursos que tiene o no
     * asignado una funcionalidad.
     *
     * @return void
     */
    public function cargarsistemafuncAction()
    {
        $idnodo = $this->_request->getPost('node');
        $idsistema = ($this->_request->getPost('idsistema') != 'undefined')
            ? $this->_request->getPost('idsistema') : 0;
        $rol = $this->_request->getPost('idrol');
        $index = 0;

        if ($idnodo == 0) {
            $sistemas = DatSistema::cargarsistemasdelrol($idnodo, $rol);
        } else {
            $sistemas = DatSistema::cargarsistemasdelrol($idsistema, $rol);
        }

        if (count($sistemas)) {
            foreach ($sistemas as $valor) {
                $sistemaArr[$index]['id'] = $valor['id'] . '_' . $idnodo;
                $sistemaArr[$index]['idsistema'] = $valor['id'];
                $sistemaArr[$index]['text'] = $valor['text'];
                $index++;
            }
            if ($idsistema != 0) {
                $funcionalidad = DatSistemaSegRolDatFuncionalidad::
                cargarsist_funcionalidades($idsistema, $rol);
                if (count($funcionalidad) > 0) {
                    foreach ($funcionalidad as $valor) {
                        if (count($valor['DatRecurso']) > 0) {
                            $sistemaArr[$index]['id'] = $valor->id . '_' . $idnodo;
                            $sistemaArr[$index]['idfuncionalidad'] = $valor->id;
                            $sistemaArr[$index]['text'] = $valor->text;
                            $sistemaArr[$index]['idsistema'] = $valor->idsistema;
                            $sistemaArr[$index]['leaf'] = true;
                            $index++;
                        }
                    }
                }
            }
            echo json_encode($sistemaArr);

            return;
        } else {
            $funcionalidad = DatSistemaSegRolDatFuncionalidad::
            cargarsist_funcionalidades($idsistema, $rol);
            if (count($funcionalidad) > 0) {
                foreach ($funcionalidad as $valor) {
                    $funcionalidadArr[$index]['id'] = $valor->id . '_' . $idnodo;
                    $funcionalidadArr[$index]['idfuncionalidad'] = $valor->id;
                    $funcionalidadArr[$index]['text'] = $valor->text;
                    $funcionalidadArr[$index]['idsistema'] = $valor->idsistema;
                    $funcionalidadArr[$index]['leaf'] = true;
                    $index++;
                }
                echo json_encode($funcionalidadArr);

                return;
            } else {
                $func = $funcionalidad->toArray();
                echo json_encode($func);

                return;
            }
        }
    }

    /**
     * @method adicionaraccionAction -
     * Función usada para adicionar recursos a un rol.
     * @return void
     */
    public function adicionaraccionAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $idrol = $this->_request->getPost('idrol');
        $arrayRecursos = json_decode(
            stripslashes($this->_request->getPost('idrecurso'))
        );
//        $recAccs=DatFuncionalidadDatAccion::obtenerAccionesByArrayIdsRecursos(
//            $idfuncionalidad, $arrayRecursos
//        );

        $recAccs = DatFuncionalidadDatAccion::obtenerAccionesByArrayIdsRecursosI(
            $idfuncionalidad, $arrayRecursos
        );

        //print_r($arrayRecAcc);die;
        foreach ($recAccs as $recursos) {
            $recurso = new DatSistemaSegRolDatFuncionalidadDatAccion();
            $recurso->idsistema = $idsistema;
            $recurso->idfuncionalidad = $idfuncionalidad;
            $recurso->idrol = $idrol;
            $recurso->idaccion = $recursos['idaccion'];
            $recurso->idrecurso = $recursos['idrecurso'];
            $arrayObjRecursos[] = $recurso;
        }
        $model = new SegRolModel();
        $model->adicionaRecursos($arrayObjRecursos);
        //echo "{'tiene':1}";
        echo json_encode(array('success' => true));
    }

    /**
     * @method eliminaraccionAction -
     * Función usada para eliminar recursos de un rol.
     * @return void
     */
    public function eliminaraccionAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $idrol = $this->_request->getPost('idrol');
        $idfuncionalidad = $this->_request->getPost('idfuncionalidad');
        $arrayRecursos = json_decode(
            stripslashes($this->_request->getPost('idrecurso'))
        );
        DatSistemaSegRolDatFuncionalidadDatAccion::eliminaraccion(
            $idsistema, $idfuncionalidad, $idrol, $arrayRecursos
        );
        //echo "{'tiene':1}";
        echo json_encode(array('success' => true));

    }

    /**
     * @method cargarcamposAction - Función usada para cargar los campos.
     */
    public function cargarcamposformAction()
    {
        $campos = NomCampo::cargarcampo(0, 0);
        $result = array('cantidad' => count($campos), 'campos' => $campos);
        echo json_encode($result);
    }

    /**
     * @method cargarcamposAction -
     * Función usada para cargar el listado de campos.
     */
    public function cargarcamposAction()
    {
        $datosacc = NomCampo::cargarcampoArbol();
//        $filas = NomCampo::obtenercantcampos();
        $campos = array();
        foreach ($datosacc as $index => $user) {
            $campos[$index]['idcampo'] = $user['idcampo'];
            $campos[$index]['tipo'] = $user['tipo'];
            $campos[$index]['text'] = $user['nombre'];
            $campos[$index]['nombreamostrar'] = $user['nombreamostrar'];
            $campos[$index]['longitud'] = $user['longitud'];
            $campos[$index]['visible'] = $user['visible'];
            $campos[$index]['idexpresiones'] = $user['idexpresion'];
            $campos[$index]['tipocampo'] = $user['tipocampo'];
            $campos[$index]['descripcion'] = $user['descripcion'];
            $campos[$index]['expresion'] = $user['NomExpresiones']['expresion'];
            $campos[$index]['denominacion'] =
                $user['NomExpresiones']['denominacion'];
            $campos[$index]['leaf'] = true;
        }
        echo json_encode($campos);
    }

    /**
     * @method insertarcampoAction -
     * Función usada para adicionar un nuevo campo.
     */
    public function insertarcampoAction()
    {
        $campo = new NomCampo();
        $campo->tipo = $this->_request->getPost('tipo');
        $campo->nombre = $this->_request->getPost('nombre');
        $campo->nombreamostrar = $this->_request->getPost('alias');
        $campo->longitud = $this->_request->getPost('longitud');
        $campo->visible = $this->_request->getPost('visible');
        $campo->idexpresion = $this->_request->getPost('idexpresiones');
        $campo->descripcion = $this->_request->getPost('descripcion');
        $campo->tipocampo = $this->_request->getPost('tipocampo');
        if (self::verificarCampos('nombre', $campo->nombre, null) > 0) {
//            throw new ZendExt_Exception('SEGCAMPO01');
            echo json_encode(array('cod' => 6, 'mensaje' => 'Ya existe un campo con esta denominación.'));
            return;
        }
        if (self::verificarCampos(
                'nombreamostrar', $campo->nombreamostrar, null
            ) > 0
        ) {
//            throw new ZendExt_Exception('SEGCAMPO02');
            echo json_encode(array('cod' => 6, 'mensaje' => 'Ya existe un campo con este nombre.'));
            return;
        }
        $model = new NomCampoModel();
        $model->insertarcampo($campo);
        echo json_encode(array('cod' => 1));
//        $this->showMessage('El campo ha sido adicionado satisfactoriamente.');
    }

    /**
     * @method modificarcampoAction -
     * Función usada para modificar el campo seleccionado.
     */
    public function modificarcampoAction()
    {
        $campo = new NomCampo();
        $idcampo = $this->_request->getPost('idcampo');
        $nombre = $this->_request->getPost('nombre');
        $nombreMostrar = $this->_request->getPost('alias');
        $campo = Doctrine::getTable('NomCampo')->find($idcampo);
        $campo->tipo = $this->_request->getPost('tipo');
        $campo->longitud = $this->_request->getPost('longitud');
        $campo->visible = $this->_request->getPost('visible');
        $campo->idexpresion = $this->_request->getPost('idexpresiones');
        $campo->descripcion = $this->_request->getPost('descripcion');
        $campo->tipocampo = $this->_request->getPost('tipocampo');
        if ($campo->nombre != $nombre) {
            if (self::verificarCampos('nombre', $nombre, $idcampo) > 0) {
                throw new ZendExt_Exception('SEGCAMPO01');
            }
        }
        if ($campo->nombreamostrar != $nombreMostrar) {
            if (self::verificarCampos(
                    'nombreamostrar', $nombreMostrar, $idcampo
                ) > 0
            ) {
                throw new ZendExt_Exception('SEGCAMPO02');
            }
        }
        $campo->nombre = $nombre;
        $campo->nombreamostrar = $nombreMostrar;
        $model = new NomCampoModel();
        $model->modificarcampo($campo);
        echo json_encode(array('cod' => 1));
//        $this->showMessage('El campo ha sido modificado satisfactoriamente.');
    }

    /**
     * @method eliminarcampoAction -
     * Función usada para eliminar el campo seleccionado.
     */
    public function eliminarcampoAction()
    {
        $idcampo = $this->_request->getPost('idcampo');
        if (NomCampo::verificarCampoEliminar($idcampo) > 0) {
            throw new ZendExt_Exception('SEGCAMPO03');
        }
        $campo = new NomCampo();
        $campo = Doctrine::getTable('NomCampo')->find($idcampo);
        $model = new NomCampoModel();
        $model->eliminarcampo($campo);
        echo json_encode(array('cod' => 1));
//        $this->showMessage('El campo ha sido eliminado satisfactoriamente.');
    }

    private function verificarCampos($campo, $valor, $idcampo)
    {
        return NomCampo::comprobarCampo($campo, $valor, $idcampo);
    }

    /**
     * @method insertarperfilAction -
     * Función usada para adicionarle datos al perfil de usuario.
     */
    public function insertarperfilAction()
    {
        $campos = NomCampo::cargarcampo(0, 0);
        $arrayCampos = $campos;
        $objFila = new NomFila();
        $objFila->idusuario = $this->_request->getPost('idusuario');
        $objFila->save();
        foreach ($arrayCampos as $campo) {
            $objValor = new NomValor();
            $objValor->valor = $this->_request->getPost($campo['nombre']);
            $objValor->idcampo = $campo['idcampo'];
            $objValor->idfila = $objFila->idfila;
            $result[] = $objValor;
        }
        $model = new SegUsuarioModel();
        $model->insertarperfil($result);
        $this->showMessage('El perfil ha sido adicionado satisfactoriamente.');
    }

    /**
     * @method modificarperfilAction -
     * Función usada para modificar el perfil del usuario seleccionado.
     */
    public function modificarperfilAction()
    {
        $campos = NomCampo::cargarcampo(0, 0);
        if ($this->_request->getPost('idfila')) {
            $idfila = $this->_request->getPost('idfila');
        } else {
            $objFila = new NomFila();
            $objFila->idusuario = $this->_request->getPost('idusuario');
            $objFila->save();
            $idfila = $objFila->idfila;
        }
        $arrayCampos = $campos;
        $cantvaloresfila = NomValor::cantvaloresdadofila($idfila);
        $k = 0;
        $resultAdicionar = array();
        $resultModificar = array();
        $resultEliminar = array();
        foreach ($arrayCampos as $campo) {
            $valornuevo = $this->_request->getPost($campo['nombre']);
            $idcampo = $campo['idcampo'];
            $valor = NomValor::cargaridvalor($idfila, $idcampo);
            $objNomValor = Doctrine::getTable('NomValor')->find(
                $valor[0]['idvalor']
            );
            if ($objNomValor) {
                if ($valornuevo != "") {
                    $objNomValor->valor = $valornuevo;
                    $resultModificar[] = $objNomValor;
                } else {
                    $cantvaloresfila--;
                    $resultEliminar[] = $objNomValor;
                }
                unset($objNomValor);
            } else if ($valornuevo != "") {
                $objValor = new NomValor();
                $objValor->idvalor = $objValor->genId() + $k;
                $objValor->valor = $valornuevo;
                $objValor->idcampo = $campo['idcampo'];
                $objValor->idfila = $idfila;
                $resultAdicionar[] = $objValor;
                $cantvaloresfila++;
                $k++;
            }
        }
        $model = new SegUsuarioModel();
        if ($cantvaloresfila != 0) {
            $model->modificarperfil(
                $resultModificar, $resultEliminar, $resultAdicionar
            );
        } else {
            NomFila::eliminarfila($idfila);
        }
        echo json_encode(array('cod' => 1));
    }

    /**
     * @method modificarperfilesAction -
     * Función usada para modificar el perfil de varios usuarios seleccionados.
     */
    public function modificarperfilesAction()
    {
        $records = json_decode($this->_request->getPost('records'));
        $campos = NomCampo::cargarcampo(0, 0);
        $arrayCampos = $campos;
        foreach ($records as $record) {
            if ($record->idfila) {
                $idfila = $record->idfila;
            } else {
                $objFila = new NomFila();
                $objFila->idusuario = $record->idusuario;
                $objFila->save();
                $idfila = $objFila->idfila;
            }
            $cantvaloresfila = NomValor::cantvaloresdadofila($idfila);
            $k = 0;
            $resultAdicionar = array();
            $resultModificar = array();
            $resultEliminar = array();
            foreach ($arrayCampos as $campo) {
                $idcampo = $campo['idcampo'];
                $valor = NomValor::cargaridvalor($idfila, $idcampo);
                $objNomValor = Doctrine::getTable('NomValor')->find(
                    $valor[0]['idvalor']
                );
                if ($objNomValor) {
                    if ($record->$campo['nombre'] != "") {
                        $objNomValor->valor = $record->$campo['nombre'];
                        $resultModificar[] = $objNomValor;
                    } else {
                        $cantvaloresfila--;
                        $resultEliminar[] = $objNomValor;
                    }
                    unset($objNomValor);
                } else if ($record->$campo['nombre'] != "") {
                    $objValor = new NomValor();
                    $objValor->idvalor = $objValor->genId() + $k;
                    $objValor->valor = $record->$campo['nombre'];
                    $objValor->idcampo = $campo['idcampo'];
                    $objValor->idfila = $idfila;
                    $resultAdicionar[] = $objValor;
                    $cantvaloresfila++;
                    $k++;
                }
            }
            $model = new SegUsuarioModel();
            if ($cantvaloresfila != 0) {
                $model->modificarperfil(
                    $resultModificar, $resultEliminar, $resultAdicionar
                );
            } else {
                NomFila::eliminarfila($idfila);
            }
        }
        echo json_encode(array('cod' => 1));
    }

    /**
     * @method configurargridAction -
     * Función usada para crear dinamicamente las columnas del grid.
     */
    public function configurargridAction()
    {
        $arregloResult = NomCampo::cargarcampo(0, 0);
        $columna[] = array('hidden' => true, 'hideable' => false,
            'dataIndex' => 'idusuario');
        $columna[] = array('hidden' => true, 'hideable' => false,
            'dataIndex' => 'idfila');
        $columna[] = array('id' => 'expandir', 'header' => 'Usuario',
            'width' => 200,
            'dataIndex' => 'nombreusuario', 'editor' => '', 'sortable' => true);
        $campoStore[] = array('name' => 'idusuario', 'mapping' => 'idusuario');
        $campoStore[] = array('name' => 'idfila', 'mapping' => 'idfila');
        $campoStore[] = array('name' => 'nombreusuario',
            'mapping' => 'nombreusuario');
        foreach ($arregloResult as $campo) {
            if ($campo['tipocampo'] == 'datefield') {
                $campoStore[] = array(
                    'name' => $campo['nombre'], 'type' => 'date', 'mapping' => $campo['nombre']
                );
            } else {
                $campoStore[] = array('name' => $campo['nombre'],
                    'mapping' => $campo['nombre']);
            }
            $columna[] = array('header' => $campo['nombreamostrar'],
                'width' => 100,
                'dataIndex' => $campo['nombre'],
                'editor' => '', 'sortable' => true,
                'type' => $campo['tipocampo'],
                'idexpresion' => $campo['idexpresion'],
                'longitud' => $campo['longitud'],
                'visible' => $campo['visible']
            );
        }
        $parteStore = array('store' => $campoStore);
        $parteColumna = array('columns' => $columna);
        echo json_encode(array($parteColumna, $parteStore));
    }

    /**
     * @method cargargridAction - Función
     * usada para cargar el grid de usuarios compartimentados.
     */
    public function cargargridAction()
    {
        $nombreusuario = ($this->_request->getPost('nombreusuario')) ?
            $this->_request->getPost('nombreusuario') : '';
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idrol = $this->_request->getPost('idrol');
        $activar = $this->_request->getPost('activar');
        $idGrupo = $this->_request->getPost('idgrupo');
        $dominiobuscar = $this->_request->getPost('dominiobuscar');
        $iddominio = $this->global->Perfil->iddominio;
        $idusuario = $this->global->Perfil->idusuario;
        $result = array();
        $cont = 0;
        $campos = NomCampo::gridUsuarioDominio(
            $nombreusuario, $idusuario,
            $iddominio, $limit, $start, $idrol,
            $dominiobuscar, $activar, $idGrupo
        );
        foreach ($campos as $valor) {
            $indice = $this->existeYa($result, $valor['idusuario']);
            if ($indice === false) {
                $result[$cont]['idusuario'] = $valor['idusuario'];
                $result[$cont]['nombreusuario'] = $valor['nombreusuario'];
                if ($valor['idvalor'] != null) {
                    $result[$cont]['idfila'] = $valor['idfila'];
                    $arrayvalores = NomValor::cargarcamposdadovalores(
                        $valor['idvalor']
                    );
                    $result[$cont][$arrayvalores[0]['NomCampo']['nombre']] =
                        $valor['valor'];
                }
            } else {
                $arrayvalores = NomValor::cargarcamposdadovalores(
                    $valor['idvalor']
                );
                $result[$indice][$arrayvalores[0]['NomCampo']['nombre']] =
                    $valor['valor'];
                $cont--;
            }
            $cont++;
        }
        $cantFila = NomCampo::cantGridUsuarioDominio(
            $idusuario, $iddominio, $nombreusuario, $idrol, $dominiobuscar,
            $activar, $idGrupo
        );
        echo json_encode(array('cant_fila' => $cantFila, 'datos' => $result));
    }

    private function existeYa($result, $idusuario)
    {
        $k = 0;
        foreach ($result as $valor) {
            if ($valor['idusuario'] == $idusuario) {
                return $k;
            }
            $k++;
        }

        return false;
    }


    public function exportarUsuariosAction()
    {

        $usuariosexportar = json_decode($this->_request->getPost('usuariosexportar'));
        $idserverldap = json_decode($this->_request->getPost('idservidorldap'));
        $ou = json_decode($this->_request->getPost('ou'));

        $dirCerts = substr(
                $_SERVER['DOCUMENT_ROOT'],
                0,
                strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
            ) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR
            . 'auth' . DIRECTORY_SEPARATOR;
        $rSA = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
        $servidorEnv = $idserverldap;
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $filter = '*';
        $grupo = "cn=*";
        if ($this->_request->getPost('criterio') != '') {
            $filter = "*" . $this->_request->getPost('criterio') . "*";
        }
        $yaexisteEnLdap = [];
        $nopersona = [];
        $insertadosEnLdap = [];
        $importados = false;
        $servidor = Doctrine::getTable('DatServidor')->find($idserverldap);
        $servidorAutenticacion = Doctrine::getTable('DatSerautenticacion')->find($servidorEnv);
        $ldapConn = ldap_connect($servidor->ip, $servidorAutenticacion->puerto);
        if ($ldapConn) {
            if (@ldap_set_option($ldapConn, LDAP_OPT_PROTOCOL_VERSION, 3) &&
                @ldap_set_option($ldapConn, LDAP_OPT_REFERRALS, 0)
            ) {
                if ($servidorAutenticacion->ssl || $servidorAutenticacion->tsl) {
                    @ldap_start_tls($ldapConn);
                }
            }
            $password = $rSA->decrypt($servidorAutenticacion->password);
            $ldapBind = ldap_bind(
                $ldapConn,
                $servidorAutenticacion->usuario,
                $password
            );
            if ($ldapBind) {
                foreach ($usuariosexportar as $u) {
                    $filtross = "(uid=$u)";
                    $ldapsearch = ldap_search(
                        $ldapConn,
                        $servidorAutenticacion->basedn,
                        $filtross,
                        array('dn')
                    );
                    $existe = ldap_get_entries($ldapConn, $ldapsearch);
                    if (!$existe[0]['dn']) {
                        //print_r($existe[0]['dn']);
                        $tmp = SegUsuario::obtenerUsuario($u)->toArray();
                        $info[$servidorAutenticacion->fusuario] = $tmp[0]['nombreusuario'];
                        $info["objectclass"] = "inetOrgPerson";

                        if ($tmp[0]['idpersona'] != null || $tmp[0]['idpersona'] != "") {
                            $persona = $this->integrator->pvd->getNombreApellidos($tmp[0]['idpersona']);

                            if ($persona[0]['snombre'] == "" || $persona[0]['snombre'] == null) {
                                $info[$servidorAutenticacion->fnombre] = $persona[0]['nombre'] . " " . $persona[0]['papel'];
                                if ($servidorAutenticacion->fapellidos != null || $servidorAutenticacion->fapellidos != "") {
                                    $info[$servidorAutenticacion->fapellidos] = $persona[0]['sapel'];
                                    $cns = $info[$servidorAutenticacion->fnombre] . " " . $info[$servidorAutenticacion->fapellidos];
                                } else {
                                    //$info["sn"] = $persona[0]['papel'] . " " . $persona[0]['sapel'];
                                    $info["sn"] = $persona[0]['sapel'];
                                    $cns = $info[$servidorAutenticacion->fnombre] . " " . $info["sn"];
                                }
                            } else {
                                $info[$servidorAutenticacion->fnombre] = $persona[0]['nombre'] . " " . $persona[0]['snombre'] . " " . $persona[0]['papel'];
                                if ($servidorAutenticacion->fapellidos != null || $servidorAutenticacion->fapellidos != "") {
                                    $info[$servidorAutenticacion->fapellidos] = $persona[0]['sapel'];
                                    $cns = $info[$servidorAutenticacion->fnombre] . " " . $info[$servidorAutenticacion->fapellidos];
                                } else {
                                    //                    $info["sn"] = $persona[0]['papel'] . " " . $persona[0]['sapel'];
                                    $info["sn"] = $persona[0]['sapel'];
                                    $cns = $info[$servidorAutenticacion->fnombre] . " " . $info["sn"];
                                }
                            }
//                        $dn = "ou=personas,dc=xetid,dc=cu";
//                        $baseDn = "cn=$cns,$servidorAutenticacion->basedn";
                            $dn = "ou=" . $ou . "," . $servidorAutenticacion->basedn;
                            $baseDn = "cn=$cns,$dn";
                            $ldapBind1 = ldap_add($ldapConn, $baseDn, $info);
                            if ($ldapBind1) {
//                                $tmp = [];
//                                $tmp['user'] = $u;
//                                $tmp['existe'] = true;
//                                array_push($insertadosEnLdap,$tmp);
                                $importados = true;
                            }

                        } else {
                            $tmp = [];
                            $tmp['nopersona'] = $u;
                            $tmp['nop'] = 2;
                            array_push($nopersona, $tmp);
                        }
                    } else {
                        $tmp = [];
                        $tmp['user'] = $u;
                        $tmp['existe'] = 1;
                        array_push($yaexisteEnLdap, $tmp);
                    }
                }
            } else {
                throw new ZendExt_Exception('SEG029');
            }
        } else {
            throw new ZendExt_Exception('SEG030');
        }

//        if($importados){
//            $msg = "Se insertaron correctamente los usuarios al openldap";
//            echo json_encode(array($yaexisteEnLdap, $nopersona, $msg));
//        } else {
//            $msg = "No se insertaron todos los usuarios al openldap";
        echo json_encode(array($yaexisteEnLdap, $nopersona, $importados));
//            echo json_encode(array($insertadosEnLdap, $importados));
//        }
    }

    private static function createAccountDomainName($string)
    {
        $string = strtolower($string);
        $stringResult = '';
        $string = substr($string, strpos($string, 'dc'), strlen($string));
        $array = explode(',', $string);
        $cant = count($array);
        foreach ($array as $dc) {
            $result = explode('dc=', $dc);
            if ($cant == 1) {
                $stringResult .= $result[1];
            } else {
                $stringResult .= $result[1] . '.';
                $cant--;
            }
        }

        return $stringResult;
    }

    private static function parseUserForLdapConnect($string)
    {
        $string = strtolower($string);
        $array = explode('=', $string);
        $array = explode(',', $array[1]);
        return $array[0];
    }

    public function exportarPdfAction()
    {
        $arraysParameters = $this->getRequest()->getParams();
        $start = $arraysParameters['start'];
        $limit = $arraysParameters['limit'];
        $nombreUsuario = $arraysParameters['nombreusuario'];
        $dominioBuscar = $arraysParameters['dominiobuscar'];
        $idGrupo = $arraysParameters['idgrupo'];
        $idRol = $arraysParameters['idrol'];
        $activar = $arraysParameters['activar'];
        $idUsuario = $this->global->Perfil->idusuario;
        $idDominio = $this->global->Perfil->iddominio;

        $datos = self::getUsers($nombreUsuario, $dominioBuscar, $idGrupo, $idRol, $activar,
            $idUsuario, $idDominio, $start, $limit);

        $arrayUsuario = $datos[0];
        $usuarios = array();
        foreach ($arrayUsuario as $user) {
            $tmp = array(
                'usuario'=>$user['nombreusuario'],
                'estado'=> $user['activo']
            );
            array_push($usuarios, $tmp);
        }

        $tpl = array(
            '0'=>array('nombre'=>'Usuario','columna'=>'usuario','width'=>'30'),
            '1'=>array('nombre'=>'Estado','columna'=>'estado','width'=>'30')
        );

        return ReportPdf::printerPdf("prueba", 'historial', $usuarios, $tpl);
    }

    public function deleteProfileOrRoleToUserAction(){
        $idusuario = $this->_request->getPost('idusuario');
        $entity = $this->_request->getPost('entity');
        SegUsuario::deleteProfileOrRole($idusuario, $entity, $this->global->Perfil->idusuario);
        //$usuario->modificadopor = 
        echo "{'success' : 1}";
    }

}
