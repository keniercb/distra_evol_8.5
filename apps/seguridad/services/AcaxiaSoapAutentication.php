<?php

/**
 * @name AcaxiaSoapAutentication - Interfaz o Proxy utilizado por 
 * Acaxia para brindar los servicios de autenticacion.
 * @package   Acaxia
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   3.0-0
 */
class AcaxiaSoapAutentication
{

  

    /**
     * devolverIp
     * Retorna el ip de la PC Cliente que se esta autenticando
     *
     * @return string - IP de la PC Cliente.
     */
    private function devolverIp()
    {
        return $_SERVER['REMOTE_ADDR'];
    }

    /**
     * verificarIP
     * Verifica que la el IP de la PC Cliente se encuentre en 
     * la lista de accesos.
     *
     * @param string $ip      - IP de la PC Cliente.
     * @param string $arraybd - Arreglo de accesos.
     *
     * @return boolean - boolean.
     */
    private function verificarIP($ip, $arraybd)
    {
        $arraybd = explode(',', $arraybd);
        $ip = explode('/', $ip);
        foreach ($arraybd as $key => $array) {
            $result[$key] = explode('/', $array);
        }
        foreach ($result as $rest) {
            if ($this->compreobarIP($ip, $rest, $rest[1])) {
                return true;
            }
        }

        return false;
    }

    /**
     * compreobarIP
     * Verifica que la el IP de la PC Cliente se encuentre en 
     * la lista de accesos.
     *
     * @param String $valorOne - IP de la PC Cliente.
     * @param String $valorTwo - IP del Arreglo de accesos.
     * @param String $opc    - Opcion.
     *
     * @return integer - integer.
     */
    private function compreobarIP($valorOne, $valorTwo, $opc)
    {
        $resultOne = explode('.', $valorOne[0]);
        $resultTwo = explode('.', $valorTwo[0]);
        if ($opc == '0') {
            return 1;
        } elseif ($opc == '8') {
            if (($resultOne[0] == $resultTwo[0])) {
                return 1;
            }
        } elseif ($opc == '16') {
            if (($resultOne[0] == $resultTwo[0]) 
                && ($resultOne[1] == $resultTwo[1])) {
                return 1;
            }
        } elseif ($opc == '24') {
            if (($resultOne[0] == $resultTwo[0]) 
                && ($resultOne[1] == $resultTwo[1]) 
                && ($resultOne[2] == $resultTwo[2])) {
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

    /**
     * authenticateUserApi
     * Brinda el servicio de autenticacion por usuario y password.
     *
     * @param String $user     - Usuario.
     * @param String $password - Clave de acceso del usuario en formato md5.
     *
     * @return String - SESSION_ID.
     */
    public function authenticateUserApi($user, $password)
    {
        $mac = (isset($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR']
            . "_SOAP_$user" : "_SOAP_$user";
        $verificar = SegUsuario::obtenerUsuario($user);
        if (!$verificar[0]->activo) {
            throw new SoapFault('El usuario no está activo.', 'ACTIVO');
        }
        if ($verificar[0]->ip) {
            $ip = $this->devolverIp();
            $acceso = $this->verificarIP($ip, $verificar[0]->ip);
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
                        $result = $this->returnCertificate(
                            $mac, $verificar[0]->idusuario, $user
                        );
                        $_SESSION['UCID_ENTITY_SERVICES']['certificado'] = 
                            $result;

                        return session_id();
                    } else {
                        $result = $this->returnCertificate(
                            $mac, $verificar[0]->idusuario, $user
                        );
                        $_SESSION['UCID_ENTITY_SERVICES']['certificado'] = 
                            $result;

                        return session_id();
                    }
                } else {
                    throw new SoapFault('Autenticación Fallida.', 'LDAP');
                }
            } else {
                $objUsuario = new SegUsuario();
                $resultUsuario = $objUsuario->comprobarusuario(
                    $user, md5($password)
                );
                if (count($resultUsuario) > 0) {
                    $result = $this->returnCertificate(
                        $mac, $resultUsuario[0]['idusuario'], $user
                    );
                    $_SESSION['UCID_ENTITY_SERVICES']['certificado'] = $result;

                    return session_id();
                } else {
                    throw new SoapFault(
                        'Autenticación Fallida.', 'AUT_ACAXIA'
                    );
                }
            }
        }
        throw new SoapFault(
            'Su IP no tiene Acceso a este servidor.', 'RESTRICCION_IP'
        );
    }

    /**
     * AD_Autentication
     * Funcion privada que autentica contra cualquier Directorio Activo
     *
     * @param string $objLdap  - Objeto DoctrineCollection de servidor de 
     * Autenticacion del usuario.
     * @param string $user     - Usuario que se esta autenticando
     * @param string $password - Clave de acceso del usuario
     *
     * @return boolean - boolean.
     */
    private function AD_Autentication($objLdap, $user, $password)
    {
        $registro = Zend_Registry::getInstance();
        $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($registro->config->certsDirectory . 'auth' . DIRECTORY_SEPARATOR));

        $arrayOptions = array();
        $acountDomainName = ($objLdap[0][DatSerautenticacion]->basedn)
            ? $this->createAccountDomainName(
                $objLdap[0][DatSerautenticacion]->basedn
            )
            : $this->createAccountDomainName(
                $objLdap[0][DatSerautenticacion]->usuario
            );
        $arrayOptions['host'] = ($objLdap[0]->ip) ? $objLdap[0]->ip : '';
        $arrayOptions['port'] = ($objLdap[0][DatSerautenticacion]->puerto) 
            ? $objLdap[0][DatSerautenticacion]->puerto 
            : '';
        $arrayOptions['accountDomainName'] = $acountDomainName;
        $arrayOptions['useStartTls'] = ($objLdap[0][DatSerautenticacion]->tsl) 
            ? $objLdap[0][DatSerautenticacion]->tsl 
            : '';
        $arrayOptions['accountDomainNameShort'] = 
            $this->accountDomainNameShort($acountDomainName);
        $arrayOptions['baseDn'] = ($objLdap[0][DatSerautenticacion]->basedn) 
            ? $objLdap[0][DatSerautenticacion]->basedn 
            : '';
        $arrayOptions['username'] = ($objLdap[0][DatSerautenticacion]->usuario) 
            ? $objLdap[0][DatSerautenticacion]->usuario 
            : '';
        $arrayOptions['password'] = ($objLdap[0][DatSerautenticacion]->password)
            ? $rsa->decrypt($objLdap[0][DatSerautenticacion]->password)
            : '';
        $arrayOptions['optReferrals'] = true;

//        file_put_contents('/var/www/zeolides24/log/output',$rsa->decrypt($objLdap[0][DatSerautenticacion]->password));

        if ($objLdap[0][DatSerautenticacion]->tservidor == 'openldap') {
            $arrayOptions['bindRequiresDn'] = true;
        }
        $options = array('server' => $arrayOptions);
        $auth = Zend_Auth::getInstance();
        $adapter = new Zend_Auth_Adapter_Ldap($options, $user, $password);
        $result = $auth->authenticate($adapter);
        $array = $result->getMessages();
        if (!$array[0]) {
            return true;
        }

        return false;
    }

    /**
     * createAccountDomainName
     * Funcion privada usada para crear la cuenta de nombre de dominio.
     *
     * @param string $string - Cadena de busqueda puede ser el usuario 
     * (conexion DN) o el basedn.
     *
     * @return string - string.
     */
    private function createAccountDomainName($string)
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
     * accountDomainNameShort
     * Funcion privada usada para crear el nombre corto de la cuenta 
     * de nombre de dominio.
     *
     * @param string $acountDomainName - Cadena que contiene el nombre 
     * de dominio.
     *
     * @return string - string.
     */
    private function accountDomainNameShort($acountDomainName)
    {
        $acountDomainName = explode('.', $acountDomainName);

        return $acountDomainName[0];
    }

    /**
     * returnCertificate
     * Actualiza o crea un certificado al usuario autenticado
     *
     * @param integer $idusuario - Id del usuario que se esta autenticando
     * @param string  $mac       - Mac del usuario
     *
     * @return string - Certificado o token de seguridad asignado al usuario.
     */
    private function returnCertificate($mac, $idusuario, $user)
    {
        $objCertificado = new SegCertificado();
        $fecha = date('d/m/Y H:i:s');
        $arrayResult = self::createCertificate($user, $mac, $fecha);
        $resultCertificado=$objCertificado->existecertificado($idusuario, $mac);
        if (count($resultCertificado)) {
            $this->updateCertificate(
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

    /**
     * createCertificate
     * Crea un certificado a partir del identificador del usuario
     *
     * @param integer $iduser - Identificador del usuario
     *
     * @ignore - El certificado no se esta generando correctamente
     */
    private function createCertificate($usuario, $mAC, $fecha)
    {
        //$register = Zend_Registry::getInstance();
        $rSA = new ZendExt_RSA_Facade();
        $iD = md5('Quarseg' . $usuario . $fecha . $mAC);
        $tOKEN = md5(self::createToken());
        $dirXML = substr(
            $_SERVER['SCRIPT_FILENAME'],
            0,
            strrpos($_SERVER['SCRIPT_FILENAME'], '/web/')
        ) . '/apps/seguridad/comun/recursos/xml/Certificado_template.xml';
        $contenido = file_get_contents($dirXML);
        $contenido = str_replace('<FECHA_EMISION>', $fecha, $contenido);
        $contenido = str_replace('<USER_NAME>', $usuario, $contenido);
        $contenido = str_replace('<TOKEN_ID>', $tOKEN, $contenido);
        $contenido = str_replace('<IDENTIFICADOR>', $iD, $contenido);
        $contenido = str_replace('<MAC>', $mAC, $contenido);

        return array(
            'TOKEN' => $tOKEN,
            'CERTIFICADO' => $rSA->encrypt($contenido)
        );
    }

    /**
     * createToken
     * Crea el TOKEN de seguridad que tendra el certificado.
     *
     * @return string - Token de seguridad.
     */
    private function createToken()
    {
        return 'TOKEN:<' . $_SERVER['HTTP_HOST'] . '@' 
            . $_SERVER['HTTP_USER_AGENT'] . ' Quarseg >';
    }

    /**
     * updateCertificate
     * Cambia el valor del certificado asignado al usuario
     *
     * @param string  $mac           - Mac de la PC cliente
     * @param string  $idcertificate - Identificador del certificado
     * @param integer $iduser        - Identificador del usuario
     *
     * @return string - Nuevo certificado asignado al usuario
     */
    private function updateCertificate($mac, $idcertificate, $tOKEN)
    {
        $objCertificado = Doctrine::getTable('SegCertificado')
            ->find($idcertificate);
        $objCertificado->mac = $mac;
        $objCertificado->valor = $tOKEN;
        $ojjModel = new SegCertificadoModel();
        $ojjModel->updateCertificado($objCertificado);
    }

    /**
     * getUserAcl
     * Retorna el ACL del usuario autenticado.
     *
     * @param integer $certificado - Certificado del usuario Autenticado.
     * @param string  $identidad   - Identificador de la estructura accedida.
     *
     * @return array - ACL del usuario autenticado.
     */
    public function getUserAcl($certificado, $identidad)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificado);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $datosRol = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identidad
            );
            $idrol = $datosRol[0]->idrol;
            $arrayResources = DatSistemaSegRolDatFuncionalidadDatAccion::
                getAllRoleResourse($idrol);

            return self::getArrayReferencias($arrayResources);
        }
    }

    /**
     * @name          verifyAccessToResourse.
     * @method verifyAccessToResourse   - Verifica que un usuario tenga acceso 
     * al recurso solicitado.
     *
     * @param integer $certificate        - Certificado del usuario Autenticado.
     * @param string  $resourse           - Recurso.
     *
     * @return integer            - Retorna 1 si tiene acceso 0 de lo contrario.
     */
    public function verifyAccessToResourse($certificate, $resourse)
    {
        $resourse = explode('/', $resourse);
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $arrayRoles = DatEntidadSegUsuarioSegRol::getAllRolesByUserId(
                $idusuario
            );
            $arrayRoles = self::getArrayUnidimencional($arrayRoles, 'idrol');
            $access = DatRecurso::verifyAccessToResourse(
                $idusuario, $resourse, $arrayRoles
            );
            if (count($access) > 0) {
                return 1;
            } else {
                return 0;
            }
        } else {
            throw new SoapFault('Certificado inválido.', 'AUTENTICATION');
        }
    }

    private function getArrayUnidimencional($array, $indice)
    {
        $arrayResult = array();
        foreach ($array as $values) {
            $arrayResult[] = $values[$indice];
        }

        return $arrayResult;
    }

    /**
     * getArrayReferencias
     * Retorna el ACL del usuario autenticado.
     *
     * @param array $value - Arreglo de valores.
     *
     * @return array - ACL del usuario autenticado.
     */
    private function getArrayReferencias($value)
    {
        $arrayResult = array();
        $arrayTemp = array();
        foreach ($value as $url) {
            if (count(array_intersect(array($url['url']), $arrayResult)) == 0) {
                $arrayTemp[] = $url['url'];
            }
            $arrayResult[] = substr($url['url'], 0, strrpos($url['url'], '/')) 
                . '/' . $url['accion'];
        }

        return array_values(
            array_unique(array_merge($arrayTemp, $arrayResult))
        );
    }

    private function extractSecurityToken($certificate)
    {
        $rSA = new ZendExt_RSA_Facade();
        $stringCertificate = $rSA->decrypt($certificate);
        $xML = new SimpleXMLElement($stringCertificate);

        return (string)$xML->attributes()->token;
    }

    /**
     * loadProfile
     * Brinda el servicio de configuracion del perfil del usuario autenticado
     *
     * @param string $certificate - Certificado o token de seguridad asignado 
     * al usuario.
     *
     * @return array - Datos del perfil del usuario autenticado.
     */
    public function getProfile()
    {
        $integrator = ZendExt_IoC::getInstance();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken(
            $_SESSION['UCID_ENTITY_SERVICES']['certificado']
        );
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $perfil = SegUsuario::cargarperfilusuario($idusuario);
            $perfilusuario = array();
            if (count($perfil)) {
                $perfilusuario['tema'] = $perfil[0]['NomTema']['tema'];
                $perfilusuario['idioma'] = $perfil[0]['NomIdioma']['idioma'];
                $perfilusuario['portal'] = $perfil[0]['NomDesktop']['desktop'];
                $perfilusuario['idusuario'] = $perfil[0]['idusuario'];
                $perfilusuario['usuario'] = $perfil[0]['nombreusuario'];
                $persona = $integrator->pvd
                    ->obtenerDatosdePersonaparaJabber($perfil[0]['idpersona']);
                $perfilusuario['nombre'] = (isset($persona['nombre'])) 
                    ? $persona['nombre'] 
                    : " ";
                $perfilusuario['apellidos'] = (isset($persona['apellidos'])) 
                    ? $persona['apellidos'] 
                    : " ";
                $perfilusuario['sexo'] = (isset($persona['sexo'])) 
                    ? $persona['sexo'] 
                    : " ";
                $perfilusuario['iddominio'] = $perfil[0]['iddominio'];
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
	        $perfilusuario['idpersona'] = $perfil[0]['idpersona'];
            return $perfilusuario;
        } else {
            throw new SoapFault('Certificado inválido.', 'AUTENTICATION');
        }
    }

    /**
     * @method loadUserActions - Servicio que le permite obtener las acciones 
     * de un usuario.
     * @param integer $idusuario - Identificador del usuario.
     *
     * @return array - Acciones del usuario autenticado.
     */
    public function loadUserActions($idusuario)
    {
        $arracciones = array();
        $getAllRolesByUsId = DatEntidadSegUsuarioSegRol::getAllRolesByUserId(
            $idusuario
        );
        $arrayRoles = SegUtil::convertToUnidimensional(
            $getAllRolesByUsId, 
            'idrol'
        );
        $obtGRol = SegRolGrupo::obtenerGruposRol($arrayRoles);
        $arrayIds = array_merge(
            array($arrayRoles[0]),
            SegUtil::convertToUnidimensional($obtGRol, 'idgrupo')
        );
        $accionesquetiene = DatRecurso::obtenerRecursosPorArrayIdRoles(
            $arrayIds
        );
        foreach ($accionesquetiene as $valores => $valor) {
            $arracciones[$valores]['idaccion'] = $valor['idrecurso'];
            $arracciones[$valores]['abreviatura'] = $valor['abreviatura'];
            $arracciones[$valores]['denominacion'] = $valor['denominacion'];
        }

        return $arracciones;
    }

}
