<?php

/**
 * Created by PhpStorm.
 * User: ernesto
 * Date: 28/11/14
 * Time: 8:21
 */
class ConfiguracionAccesoValidator
{

    public function verificarDominioDadoUsuario()
    {
        $records = json_decode(stripslashes($_POST['records']));
        $nombreUsuarioExistente = '';
        foreach ($records as $record) {
            $usuario = Doctrine::getTable('SegUsuario')
                ->find($record->idusuario);
            if ($usuario->nombreusuario != $record->nombreusuario 
                && self::verificarusuario($record->nombreusuario)) {
                $nombreUsuarioExistente .= $record->nombreusuario . ', ';
            }
            if ($record->iddominio != $usuario->iddominio) {
                $dEntUsRol = DatEntidadSegUsuarioSegRol::getAccess(
                    $record->idusuario
                );
                $estAcceso = array();
                $cantEstrucEntidad = array();
                $entidadEstruc = array();
                foreach ($dEntUsRol as $acceso) {
                    $temp = SeguridadECProxy::getInstance()
                        ->buscarHijosEstructurasDadoArray(
                            $acceso['identidad'], 
                            $usuario->iddominio,
                            0,
                            1
                        );
                    foreach ($temp as $estruc) {
                        if ($estruc['checked']) {
                            $entidadEstruc[$estruc['id']] = 
                                $acceso['identidad'];
                            if (!isset(
                                $cantEstrucEntidad[$acceso['identidad']]
                            )) {
                                $cantEstrucEntidad[$acceso['identidad']] = 1;
                            } else {
                                $cantEstrucEntidad[$acceso['identidad']] ++;
                            }
                            array_push($estAcceso, $estruc['id']);
                        }
                    }
                }
                $arrayEstDom = SeguridadECProxy::getInstance()
                    ->buscarHijosEstructurasDadoArray(
                        0, 
                        $record->iddominio,
                        0, 
                        1
                    );
                $arrayEstDom = SegUtil::convertToUnidimensional(
                    $arrayEstDom, 'id'
                );
                $diff = array_diff($estAcceso, $arrayEstDom);
                if (count($diff)) {
                    if ($record->confirmar != false) {
                        $entidadesEliminar = array();
                        foreach ($diff as $entidad) {
                            if (!isset(
                                $entidadesEliminar[$entidadEstruc[$entidad]]
                            )) {
                                $entidadesEliminar[$entidadEstruc[$entidad]] = 
                                    array(
                                        'padres' => array(),
                                        'estructuras' => array(),
                                        'arrayEntidadesEliminar' => array(),
                                        'arrayPadresEliminar' => array()
                                    );
                            }
                            $entidadesEliminar[$entidadEstruc[$entidad]]
                                ['arrayEntidadesEliminar'][] = $entidad;
                            $entidadesEliminar[$entidadEstruc[$entidad]]
                                ['arrayPadresEliminar'][] = $entidad;
                        }
                        foreach ($entidadesEliminar as $entidad => $array) {
                            SeguridadECProxy::getInstance()
                                ->asignarAccesoRoles(
                                    $usuario->iddominio, $entidad, $array
                                );
                            if (
                                $cantEstrucEntidad[$entidad] <= 
                                $array['arrayEntidadesEliminar']) {
                                unset($entidadesEliminar[$entidad]);
                            }
                        }
                        if (count($entidadesEliminar)) {
                            DatEntidadSegUsuarioSegRol::
                                eliminarUsuarioDadoIdEntidades(
                                    $usuario->idusuario, 
                                    array_keys($entidadesEliminar)
                                );
                        }
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
        }
        if (strlen($nombreUsuarioExistente) != 0) {
//            $nombreUsuarioExistente = substr(
//                $nombreUsuarioExistente, 0, strlen($nombreUsuarioExistente) - 2
//            );
//            throw new ZendExt_Exception(
//                'SEGUSUARIO06', null, array($nombreUsuarioExistente)
//            );
            throw new ZendExt_Exception('SEGUSUARIO06', null, null);
        }
        return true;
    }

    /**
     * @method verificarusuario($nombusuario) - Verifica que el nuevo nombre 
     * de usuario no se encuentre registrado.
     * @param string $nombusuario - Nombre de usuario.
     *
     * @return integer - 1 si existe, 0 de lo contrario.
     */
    public static function verificarusuario($nombusuario)
    {
        $usuario = SegUsuario::contarusuario($nombusuario);
        if ($usuario) {
            return 1;
        } else {
            return 0;
        }
    }

    /**
     * @method verificarPerfil - Válida que el mismo perfil no se le 
     * asigne a dos usuarios.
     * @return TRUE | ZendExt_Exception.
     */
    public function verificarPerfil()
    {
        if (SegUsuario::verificarPerfil(
            $_POST['idpersona'], $_POST['idusuario']
        ) >= 1) {
            throw new ZendExt_Exception('SEGUSUARIO01');
        }
        return true;
    }

    /**
     * @method verificarUsuarioServAutent - Válida que el usuario pertenesca 
     * al servidor de autenticacion que se aignó.
     * @return TRUE | ZendExt_Exception.
     */
    public function verificarUsuarioServAutent()
    {
        if ($_POST['idservidor']) {
            $usuario = $_POST['nombreusuario'];
            $arrayData = DatSerautenticacion::getAutenticationData(
                $_POST['idservidor']
            );
            if (self::validar(
                $arrayData[0]['DatServidor']['ip'], 
                $arrayData[0]['basedn'],
                $usuario, $arrayData[0]['usuario'], 
                $arrayData[0]['password'],
                $arrayData[0]['tservidor']
            )) {
                return true;
            } else {
                throw new ZendExt_Exception('SEGUSUARIO02');
            }
        }
        return true;
    }

    public function validarUsuarioEliminar()
    {
        $arrayUserDel = json_decode(stripslashes($_POST['ArrayUserDel']));
        $arrayAcl = $this->getStaticAcl();
        $sql = self::getSqlPart($arrayAcl['recursos']);
        $arrayUser = SegUsuario::getUsersFullAccess(
            $sql, $arrayAcl['recursos'], $arrayAcl['referencias']
        );
        $fly = false;
        if (count($arrayUser) > 0) {
            $arrayResult = array();
            $arrayResult = SegUtil::convertToUnidimensional(
                $arrayUser, 'idusuario'
            );
            $arrayResult = array_diff($arrayResult, $arrayUserDel);
            if (count($arrayResult) > 0) {
                $cantRec = count($arrayAcl['recursos']);
                foreach ($arrayResult as $idusuario) {
                    if ($cantRec == SegUtil::getValueIndexByIndex(
                        $arrayUser, 'idusuario', $idusuario, 'count'
                    )) {
                        $fly = true;
                        break;
                    }
                }
            } else {
                throw new ZendExt_Exception('SEGUSUARIO04');
            }
        }
        if ($fly) {
            return true;
        } else {
            throw new ZendExt_Exception('SEGUSUARIO04');
        }
    }

    public function actualizarAccesoEstructuras()
    {
        $arrayUserDel = json_decode(stripslashes($_POST['ArrayUserDel']));
        foreach ($arrayUserDel as $usuario) {
            $entidadesEliminar = array();
            $record = Doctrine::getTable('SegUsuario')->find($usuario);
            $dEntUsRol = DatEntidadSegUsuarioSegRol::getAccess(
                $record->idusuario
            );
            foreach ($dEntUsRol as $acceso) {
                $estAcceso = array();
                $temp = SeguridadECProxy::getInstance()
                    ->buscarHijosEstructurasDadoArray(
                        $acceso['identidad'], $record->iddominio, 0, 1
                    );
                foreach ($temp as $estruc) {
                    if ($estruc['checked']) {
                        array_push($estAcceso, $estruc['id']);
                    }
                }
                $entidadesEliminar[$acceso['identidad']] = array(
                    'padres' => array(), 
                    'estructuras' => array(),
                    'arrayEntidadesEliminar' => $estAcceso,
                    'arrayPadresEliminar' => $estAcceso
                );
            }
            if (count($entidadesEliminar)) {
                foreach ($entidadesEliminar as $entidad => $array) {
                    SeguridadECProxy::getInstance()->asignarAccesoRoles(
                        $record->iddominio, $entidad, $array
                    );
                }
            }
        }
        return true;
    }

    private static function validar(
        $server, $baseDN, $user, $rdn, $rootPass, $tServidor = null
    )
    {
        $rsa = new ZendExt_RSA_Facade();
        $pass = $rsa->decrypt($rootPass);
        $con = ldap_connect($server);
        ldap_set_option($con, LDAP_OPT_PROTOCOL_VERSION, 3);
        ldap_bind($con, $rdn, $pass);
        if ($tServidor == 'ldap') {
            $sr = ldap_search($con, $baseDN, "(sAMAccountName=$user)");
        } else {
            $sr = ldap_search($con, $baseDN, "(uid=$user)");
        }
        $result = ldap_get_entries($con, $sr);
        ldap_close($con);
        return ($result['count'] == 1) ? true : false;
    }

    private function getStaticAcl()
    {
        $register = Zend_Registry::getInstance();
        $dirXML = $register->config->xml->recursos;
        $recursosAcl = new SimpleXMLElement($dirXML, null, true);
        $arrayChildren = $recursosAcl->children();
        $arrayRef = array();
        $arrayRec = array();
        foreach ($arrayChildren as $child) {
            if (isset($child->attributes()->reference)) {
                array_push($arrayRef, (string) $child->attributes()->reference);
            }
            foreach ($child->rec as $resources) {
                array_push($arrayRec, (string) $resources->attributes()->name);
            }
        }
        return array('referencias' => $arrayRef, 'recursos' => $arrayRec);
    }

    private static function getSqlPart($array)
    {
        $sql = "";
        $cont = 0;
        $leng = count($array);
        foreach ($array as $value) {
            $sql .= "a.denominacion = ?";
            $cont++;
            if ($cont != $leng) {
                $sql .= " OR ";
            }
        }
        return $sql;
    }

    /**
     * @method validarDenominacion - Función usada para validar que 
     * no se repita la denominación de un rol o grupo.
     * @return ZendExt_Exception | TRUE
     */
    public function validarDenominacion()
    {
        $denominacion = $_POST['denominacion'];
        $type = ($_POST['type'] == 'rol') ? false : true;
        if (SegRol::validarDenominacion($denominacion, $type, null)) {
            if ($type) {
                throw new ZendExt_Exception('SEGRUPO001');
            } else {
                throw new ZendExt_Exception('SEG018');
            }
        }
        return true;
    }

    /**
     * @method validarModificacion - Función usada para validar que no 
     * se repita una vez modificado, la denominación de un rol o grupo.
     * @return ZendExt_Exception | TRUE
     */
    public function validarModificacion()
    {
        $idrol = $_POST['idrol'];
        $denominacion = $_POST['denominacion'];
        $type = ($_POST['type'] == 'rol') ? false : true;
        if (SegRol::validarDenominacion($denominacion, $type, $idrol)) {
            if ($type) {
                throw new ZendExt_Exception('SEGRUPO002');
            } else {
                throw new ZendExt_Exception('SEG019');
            }
        }
        return true;
    }

    /**
     * @method validarFuncionalidad - Función usada para validar que cuando 
     * se modifique un rol o grupo no se le quiten todas las funcionalidades.
     * @return ZendExt_Exception | TRUE
     */
    public function validarFuncionalidad()
    {
        $idrol = $_POST['idrol'];
        $type = $_POST['type'];
        //$sistfunc = json_decode(stripslashes($_POST['arraysistfun']));
        $sistemas = json_decode(stripslashes($_POST['arraysist']));
        $arrayeliminar = json_decode(stripslashes($_POST['arrayeliminar']));
        $arrayGruposAdd = json_decode(stripslashes($_POST['arrayGruposAdd']));
        $arrayGruposDel = json_decode(stripslashes($_POST['arrayGruposDel']));
        $arraypadres = json_decode(stripslashes($_POST['arraypadres']));
        $sinAccesoASist = $_POST['sinAccesoASist'];
        $sistemasRol = SegUtil::convertToUnidimensional(
            DatSistemaSegRol::sistemasdadorol($idrol), 'idsistema'
        );
        $cantSistAdd = count(array_diff($sistemas, $sistemasRol));
        $cantSistQuedan = count(array_diff($sistemasRol, $arrayeliminar));
        $cantGruposAdd = count($arrayGruposAdd);
        if ($cantSistAdd == 0 
            && ($cantSistQuedan == 0 || $sinAccesoASist == 'true') 
            && count($sistemas) == 0 
            && $cantGruposAdd == 0 
            && count($arraypadres) == 0
        ) {
            $cantGrupos = SegRolGrupo::obtenerGruposRol(array($idrol));
            if (count($cantGrupos) == 0) {
                if ($type == 'grupo') {
                    throw new ZendExt_Exception('SEGRUPO003');
                } else {
                    throw new ZendExt_Exception('SEG012');
                }
            }
        }
        if ($cantSistAdd == 0 
            && $sinAccesoASist == 'true' 
            && count($sistemas) == 0 
            && count($arrayGruposDel) > 0 
            && count($arraypadres) == 0
        ) {
            //Retorno la cantidad de grupos a los que pertenece el rol que
            // sean diferentes de los que se van a eliminar.
            if (SegRolGrupo::obtenerGruposNoRol($idrol, $arrayGruposDel) == 0 
                && DatSistemaSegRolDatFuncionalidad::cantidadsisrol($idrol) == 0
            ) {
                throw new ZendExt_Exception('SEG012');
            }
        }
        return true;
    }

    public function updateAcl()
    {
        //Obteniendo el listado de usuarios.
        $userList = array();
        if (isset($_REQUEST['arrayUsuario'])) {
            $userAndDomainList = json_decode(
                stripslashes($_REQUEST['arrayUsuario'])
            );
            foreach ($userAndDomainList as $userAndDomain) {
                $userList[] = $userAndDomain[0];
            }
        }

        //Obteniendo el listado de roles.
        $roleList = array();
        if ($_REQUEST['type'] == 'grupo') {
            $roleRecordList = $this->getRolesByGroupId($_REQUEST['idrol']);
            foreach ($roleRecordList as $roleRecord) {
                $roleList[] = $roleRecord['idrol'];
            }
        } else {
            $roleList[] = $_REQUEST['idrol'];
        }

        //Ejecutando tarea de actualización de las ACL de los usuarios 
        //con sessiones activas.
        if (((isset($_REQUEST['type']) 
            || isset($_REQUEST['idrecurso'])) 
            && count($roleList) > 0) 
            || (count($roleList) > 0 && count($userList) > 0)
        ) {
            $securityConfig = new Zend_Config_Ini(
                Zend_Registry::get('config')->security_config, 'trace'
            );
            if ($securityConfig->background) {
                $taskRunner = new Amqp_Task_Mgr();
                $taskRunner->runTask('updateAcl', array($roleList, $userList));
            } else {

                $sessionAclUpdateObj = new ZendExt_Session_Acl_Update();
                $sessionAclUpdateObj->init($roleList, $userList);
            }
        }
        return true;
    }

    private function getRolesByGroupId($groupId)
    {
        return Doctrine_Query::create()
                ->select('idrol')
                ->from('SegRolGrupo')
                ->where('idgrupo = ?', $groupId)
                ->fetchArray();
    }

}
