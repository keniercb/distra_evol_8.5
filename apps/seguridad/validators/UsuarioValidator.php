<?php

/**
 * @name UsuarioValidator - Clase de validación de Usuario.
 * @package seguridad
 * @copyright UCID
 * @author Equipo de seguridad UCID.
 * @version 2.0-0
 */
class UsuarioValidator
{

    public function verificarDominioDadoUsuario()
    {
        $confirmar = $_POST['confirmar'];
        $iddominio = $_POST['iddominio'];
        $idusuario = $_POST['idusuario'];
        $iddominioold = SegUsuario::obtenerIdDominioDadoIdUsuario($idusuario);
        if ($iddominio != $iddominioold) {
            $arrayId = SeguridadECProxy::getInstance()
                ->buscarIdEstructurasDominio($iddominio, array(), 0);
            $arrayId = SegUtil::convertToUnidimensional(
                $arrayId, 'idestructura'
            );
            if ($confirmar != 'false') {
                $arrayEntNoAsign = DatEntidadSegUsuarioSegRol::
                    obtenerEntidadesNoAsignadasDadoUsuario(
                        $idusuario, $arrayId
                    );
                $arrayIdEntNoAsign = SegUtil::convertToUnidimensional(
                    $arrayEntNoAsign, 'idestructura'
                );
                DatEntidadSegUsuarioSegRol::eliminarUsuarioDadoIdEntidades(
                    $idusuario, $arrayIdEntNoAsign
                );
            } else {
                $cantEntNoAsign = DatEntidadSegUsuarioSegRol::
                    cantidadEntidadesNoAsignadasDadoUsuario(
                        $idusuario, $arrayId
                    );
                if ($cantEntNoAsign > 0)
                    return false;
            }
        }
        return true;
    }

    public function verificarDominio()
    {
        $arrayEntidadesEliminar = json_decode(
            stripslashes($_POST['arrayEntidadesEliminar'])
        );
        if (is_array($arrayEntidadesEliminar) 
            && count($arrayEntidadesEliminar)) {
            $iddominio = $_POST['iddominio'];
            $arrayIdUsuarios = SegUsuario::obtenerIdUsuariosDadoIdDominio(
                $iddominio, 1
            );
            if (is_array($arrayIdUsuarios) && count($arrayIdUsuarios)) {
                $arrayIdUsuariosSimples = array();
                foreach ($arrayIdUsuarios as $usuario)
                    $arrayIdUsuariosSimples[] = $usuario['idusuario'];
                $cantEntNoAsign = DatEntidadSegUsuarioSegRol::
                    cantidadEntidadesNoAsignadasDadoArrayUsuarios(
                        $arrayIdUsuariosSimples, $arrayEntidadesEliminar
                    );
                if ($cantEntNoAsign > 0)
                    return false;
            }
        }
        return true;
    }

    /**
     * @method verificarPerfil - Válida que el mismo perfil no se le asigne
     *  a dos usuarios.
     * @return TRUE | ZendExt_Exception.
     */
    public function verificarPerfil()
    {
        if (SegUsuario::verificarPerfil(
            $_POST['idpersona'], $_POST['idusuario']
        ) >= 1)
            throw new ZendExt_Exception('SEGUSUARIO01');
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
                $usuario, 
                $arrayData[0]['usuario'], 
                $arrayData[0]['password'], 
                $arrayData[0]['tservidor']
            ))
                return true;
            else
                throw new ZendExt_Exception('SEGUSUARIO02');
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
            } else
                throw new ZendExt_Exception('SEGUSUARIO04');
        }
        if ($fly)
            return true;
        else
            throw new ZendExt_Exception('SEGUSUARIO04');
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
            $sr = ldap_search(
                $con, $baseDN, "(|(sAMAccountName=$user)(mail=$user))"
            );
        } else {
            $sr = ldap_search($con, $baseDN, "(|(uid=$user)(mail=$user))");
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
            if (isset($child->attributes()->reference))
                array_push($arrayRef, (string) $child->attributes()->reference);
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
            if ($cont != $leng)
                $sql .= " OR ";
        }
        return $sql;
    }

}
