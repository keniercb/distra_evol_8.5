<?php

/**
 * Interfaz o Proxy utilizado por Quarseg para brindar los servicios de
 * autenticación, autorización, auditoria y administración de perfiles (SOAP).
 *
 * @package   Quarseg
 * @copyright XETID.
 * @author    Equipo de desarrollo Zeolides.
 * @version   3.0-0
 */
class SeguridadSoapService
{

    public function init()
    {

    }

    /**
     * - Retorna el ip de la PC Cliente que se esta autenticando
     *
     * @param - Ninguno
     * @return STRING - IP de la PC Cliente.
     */
    private function devolverIp()
    {
        return $_SERVER['REMOTE_ADDR'];
    }

    /**
     * - Verifica que la el IP de la PC Cliente se encuentre en la
     * lista de accesos.
     *
     * @param STRING       - IP de la PC Cliente.
     * @param STRING  - Listado de accesos.
     *
     * @return BOOLEAN - Verdadero o falso si el IP de la PC Cliente
     * se encuentra en la lista de accesos.
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
     * - Verifica que la el IP de la PC Cliente se encuentre en la
     * lista de accesos.
     *
     * @param STRING  - IP de la PC Cliente.
     * @param STRING  - IP del listado de accesos.
     * @param STRING  - Opción.
     *
     * @return INTEGER - Retorna 1 si el IP de la PC Cliente
     * se encuentra en la lista de accesos y 0 en caso contrario.
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
     * - Brinda el servicio de autenticación por usuario y contrase&ntilde;a
     *
     * @param STRING  - Usuario que se esta autenticando
     * @param STRING  - Clave de acceso del usuario
     *
     * @return STRING - Certificado o token de seguridad asignado al usuario.
     */
    public function authenticateUser($user, $password)
    {
        $rSA = new ZendExt_RSA_Facade();
        $password = $rSA->decrypt($password);
        $mac = $_SERVER['REMOTE_ADDR'];
        $verificar = SegUsuario::obtenerUsuario($user);
        if (!$verificar[0]->activo) {
            return 0;
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
                $result = $this->AD_Autentication($sA, $user, $password);
                if ($result) {
                    if ($verificar[0]->contrasenna != md5($password)) {
                        $objusurio = Doctrine::getTable('SegUsuario')->find(
                            $verificar[0]->idusuario
                        );
                        $objusurio->contrasenna = md5($password);
                        $objusurio->save();
                        $result = $this->returnCertificate(
                            $mac, $verificar[0]->idusuario, $user
                        );

                        return $result;
                    } else {
                        $result = $this->returnCertificate(
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
                    $result = $this->returnCertificate(
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
     * - Brinda el servicio de autenticación por usuario y contrase&ntilde;a
     *
     * @param STRING  - Usuario que se esta autenticando
     * @param STRING  - Clave de acceso del usuario
     *
     * @return STRING - Certificado o token de seguridad asignado al usuario.
     */
    public function authenticateUserApi($user, $password)
    {
        $mac = (isset($_SERVER['REMOTE_ADDR'])) ? $_SERVER['REMOTE_ADDR']
            . "_SOAP_$user" : "_SOAP_$user";
        $verificar = SegUsuario::obtenerUsuario($user);
        if (!$verificar[0]->activo) {
            return 0;
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

                        return $result;
                    } else {
                        $result = $this->returnCertificate(
                            $mac, $verificar[0]->idusuario, $user
                        );
                        $_SESSION['UCID_ENTITY_SERVICES']['certificado'] =
                            $result;

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
                    $result = $this->returnCertificate(
                        $mac, $resultUsuario[0]['idusuario'], $user
                    );
                    $_SESSION['UCID_ENTITY_SERVICES']['certificado'] = $result;

                   return $result;
                } else {
                    return 0;
                }
            }
        }

        return 0;
    }

    /**
     * Función privada que autentica contra cualquier Directorio Activo
     *
     * @param string $objLdap  - Objeto DoctrineCollection de servidor de
     *  Autenticación del usuario.
     * @param string $user     - Usuario que se esta autenticando
     * @param string $password - Clave de acceso del usuario
     *
     * @return boolean
     */
    private function AD_Autentication($objLdap, $user, $password)
    {
        $rSA = new ZendExt_RSA_Facade();
        $sDRoot = $_SERVER['DOCUMENT_ROOT'];
        $dSep = DIRECTORY_SEPARATOR;
        $dirCerts = substr($sDRoot, 0, strrpos($sDRoot, 'web')) . 'config'
            . $dSep . 'certs' . $dSep . 'auth' . $dSep;
        $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
        $arrayOptions = array();
        if ($objLdap[0][DatSerautenticacion]->basedn) {
            $acountDomainName = $this->createAccountDomainName(
                $objLdap[0][DatSerautenticacion]->basedn
            );
        } else {
            $acountDomainName = $this->createAccountDomainName(
                $objLdap[0][DatSerautenticacion]->usuario
            );
        }
        $arrayOptions['host'] = ($objLdap[0]->ip) ? $objLdap[0]->ip : '';
        if ($objLdap[0][DatSerautenticacion]->puerto) {
            $arrayOptions['port'] = $objLdap[0][DatSerautenticacion]->puerto;
        } else {
            $arrayOptions['port'] = '';
        }
        $arrayOptions['accountDomainName'] = $acountDomainName;
        if ($objLdap[0][DatSerautenticacion]->tsl) {
            $arrayOptions['useStartTls']=$objLdap[0][DatSerautenticacion]->tsl;
        } else {
            $arrayOptions['useStartTls'] = '';
        }
        $arrayOptions['accountDomainNameShort'] = $this->accountDomainNameShort(
            $acountDomainName
        );
        if ($objLdap[0][DatSerautenticacion]->basedn) {
            $arrayOptions['baseDn'] = $objLdap[0][DatSerautenticacion]->basedn;
        } else {
            $arrayOptions['baseDn'] = '';
        }
        if ($objLdap[0][DatSerautenticacion]->usuario) {
            $arrayOptions['username']=$objLdap[0][DatSerautenticacion]->usuario;
        } else {
            $arrayOptions['username'] = '';
        }
        if ($objLdap[0][DatSerautenticacion]->password) {
            $arrayOptions['password'] = $rsa->decrypt(
                $objLdap[0][DatSerautenticacion]->password
            );
        } else {
            $arrayOptions['password'] = '';
        }
        $arrayOptions['optReferrals'] = true;
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
     * Función privada usada para crear la cuenta de nombre de dominio.
     *
     * @param string $string - Cadena de búsqueda puede ser el usuario
     * (conexión DN) o el basedn.
     *
     * @return string
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
     * Función privada usada para crear el nombre corto de la cuenta de
     * nombre de dominio.
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
            $idCertf = $resultCertificado[0]['idcertificado'];
            $this->updateCertificate(
                $mac, $idCertf, $arrayResult['TOKEN']
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
     * Crea un certificado a partir del identificador del usuario
     *
     * @param integer $iduser - Identificador del usuario
     *
     * @ignore - El certificado no se esta generando correctamente
     * @return ARRAY -Token de seguridad y certificado.
     */
    private function createCertificate($usuario, $mAC, $fecha)
    {
        //$register = Zend_Registry::getInstance();
        $rSA = new ZendExt_RSA_Facade();
        $iD = md5('Quarseg Identity Provider' . $usuario . $fecha . $mAC);
        $tOKEN = md5(self::createToken($usuario, $fecha));
        $scFileN = $_SERVER['SCRIPT_FILENAME'];
        $certTemp='/apps/seguridad/comun/recursos/xml/Certificado_template.xml';
        $dirXML = substr($scFileN, 0, strrpos($scFileN, '/web/')) . $certTemp;
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
     * @method createToken($usuario, $fecha) - Crea el TOKEN de seguridad
     * que tendra el certificado.
     * @param string $usuario - Nombre de usuario.
     * @param string $fecha   - Fecha de generación del Token de Seguridad.
     *
     * @return string - Token de seguridad.
     */
    private function createToken($usuario, $fecha)
    {
        $rAddr = $_SERVER['REMOTE_ADDR'];
        $userAgnt = $_SERVER['HTTP_USER_AGENT'];

        return 'TOKEN:<' . $rAddr . ' ' . $userAgnt . ' ' . $usuario . ' '
            . $fecha . ' Quarseg_Identity_Provider >';
    }

    /**
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
        $objCertificado = Doctrine::getTable('SegCertificado')->find(
            $idcertificate
        );
        $objCertificado->mac = $mac;
        $objCertificado->valor = $tOKEN;
        $ojjModel = new SegCertificadoModel();
        $ojjModel->updateCertificado($objCertificado);
    }

    /**
     * - Retorna un listado de recursos para el usuario autenticado.
     *
     * @param STRING  - Certificado del usuario Autenticado.
     *
     * @return INTEGER - Listado de recursos del usuario autenticado.
     */
    public function obtenerArregloDeRecursos($certificado)
    {
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken(
            $_SESSION['UCID_ENTITY_SERVICES']['certificado']
        );
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $entidaduser = DatEntidadSegUsuarioSegRol::cargarentidadesusuario($idusuario);
            $identidad = $entidaduser[0]['identidad'];

            $datosRol = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identidad
            );
            $idrol = $datosRol[0]->idrol;

            $arrayResources = DatSistemaSegRolDatFuncionalidadDatAccion::
            getAllRoleResourse($idrol);
            return self::getRecursosAction($arrayResources);
        }

    }
    /**
     * - Retorna la ACL del usuario autenticado.
     *
     * @param INTEGER  - Certificado del usuario Autenticado.
     * @param STRING     - Identificador de la estructura accedida.
     *
     * @return ARRAY - ACL del usuario autenticado.
     */
    public function getUserAcl($certificado, $identidad)
    {

        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken(
            $_SESSION['UCID_ENTITY_SERVICES']['certificado']
        );

        $datos = $objcertificado->verificarcertificado($certificate);

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
     * - Verifica que un usuario tenga acceso al recurso solicitado.
     *
     * @param INTEGER      - Certificado del usuario Autenticado.
     * @param STRING          - Recurso.
     *
     * @return INTEGER                - Retorna 1 si tiene acceso 0 de
     * lo contrario.
     */
    public function verifyAccessToResourse($certificate, $resourse)
    {
        $resourse = explode('/', $resourse);
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado('09552d9d9df5cf0ff854103e87921e91');
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
            throw new SoapFault('El certificado del usuario no es válido');
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
     * Retorna el ACL del usuario autenticado.
     *
     * @param array $value - Listado de valores.
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

    /**
     * Retorna un listado con las funciones/recursos/acciones
     * del usuario autenticado.
     *
     * @param array $value - Listado de valores.
     *
     * @return array - Listado de valores.
     */
    private function getRecursosAction($value)
    {
        $arrayResult = array();
        foreach ($value as $url) {
            $arrayResult[$url['url']][$url['srcDenominacion']][] = $url['accion'];

        }
        return $arrayResult;
    }

    private function extractSecurityToken($certificate)
    {
        $rSA = new ZendExt_RSA_Facade();
        $stringCertificate = $rSA->decrypt($certificate);
        $xML = new SimpleXMLElement($stringCertificate);

        return (string)$xML->attributes()->token;
    }

    /**
     * - Brinda el servicio de configuración del perfil del usuario autenticado
     *
     * @param STRING  - Certificado o token de seguridad asignado
     * al usuario.
     *
     * @return ARRAY - Datos del perfil del usuario autenticado.
     */
    public function getProfile($certificate)
    {
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
                $perfilusuario['identidad'] = $perfil[0]['identidad'];
                $perfilusuario['idarea'] = $perfil[0]['idarea'];
                $perfilusuario['idcargo'] = $perfil[0]['idcargo'];
                $perfilusuario['iddominio'] = $perfil[0]['iddominio'];
                $entidades =$this->cantidadEstructuras($perfil[0]['iddominio']);
                if (count($entidades) == 1) {
                    $perfilusuario['cantidad'] = $entidades[0]['idestructura'];
                } else {
                    $perfilusuario['cantidad'] = 0;
                }
                $integrator = ZendExt_IoC::getInstance();
                $arrayEstructuras = $integrator->metadatos
                    ->MostrarCamposEstructuraSeguridad($perfil[0]['identidad']);
                $perfilusuario['entidad'] = $arrayEstructuras[0]['text'];
                if ($perfil[0]['idarea'] != 0) {
                    $area = $integrator->metadatos
                        ->EstructurasInternasDadoIDSeguridad(
                            $perfil[0]['idarea']
                        );
                    if (isset($area[0]['text'])) {
                        $perfilusuario['area'] = $area[0]['text'];
                    } else {
                        $perfilusuario['area'] = '';
                    }
                }
                if ($perfil[0]['idcargo'] != 0) {
                    $cargo = $integrator->metadatos->CargoDadoIDSeguridad(
                        $perfil[0]['idcargo']
                    );
                    $perfilusuario['cargo'] = $cargo[0]['denominacion'];
                }
                if (isset($perfil[0]['NomFila'])
                    && is_array($perfil[0]['NomFila']['NomValor'])) {
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
            throw new SoapFault('El certificado del usuario no es válido');
        }
    }

    /**
     * Retorna las estructuras que pertenecen al dominio.
     *
     * @param string $iddominio - Identificador del dominio.
     *
     * @return array - Entidades que pertenecen al dominio.
     */
    private function cantidadEstructuras($iddominio)
    {
        $integrator = ZendExt_IoC::getInstance();

        return $integrator->metadatos->buscarIdEstructurasDominio(
            $iddominio, array(), 1
        );
    }

    /**
     * - Obtener el dominio de entidades a la que el usuario tiene acceso
     *
     * @param STRING   - Certificado o token de seguridad asignado
     * al usuario.
     * @param INTEGER - Identificador de la estructura.
     *
     * @return ARRAY - Entidades a las que el usuario tiene acceso.
     */
    public function loadDomain($certificate, $idEstructura)
    {
        $certificate = $_SESSION['UCID_ENTITY_SERVICES']['certificado'];
        $arrayEstructuras = array();
        $objcertificado = new SegCertificado();
        $certificate = self::extractSecurityToken($certificate);
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if (count($datos)) {
            $iddominio = SegUsuario::cargardominiodeusuario($idusuario);
            $integrator = ZendExt_IoC::getInstance();
            $dom = $iddominio[0]->iddominio;
            $arrayEstructuras = $integrator->metadatos->buscarHijosEstructuras(
                $dom, $idEstructura, 0, 0, 1
            );

            return $arrayEstructuras;
        } else {
            throw new SoapFault('El certificado del usuario no es válido');
        }
    }

    /**
     * - Obtener las entidades formales a las que el usuario tiene acceso
     *
     * @param STRING  - Certificado o token de seguridad
     * asignado al usuario.
     * @param INTEGER - Id del órgano.
     *
     * @return ARRAY - Entidades formales a las que el usuario tiene acceso.
     */
    public function getEntityByIdOrgano($certificate, $param)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if (count($datos)) {
            $iddominio = SegUsuario::cargardominiodeusuario($idusuario);
            $integrator = ZendExt_IoC::getInstance();
            $arrayEstructuras = $integrator->metadatos
                ->ObtenerEstructurasPorIdOrgano(
                    $iddominio[0]->iddominio, $param
                );

            return $arrayEstructuras;
        } else {
            throw new SoapFault('El certificado del usuario no es válido');
        }
    }

    /**
     * - Obtener las estructuras a las que tiene acceso un usuario
     *
     * @param STRING   - Certificado o token de seguridad
     * asignado al usuario.
     * @param INTEGER     - Identificador de la estructura.
     *
     * @return ARRAY - Estructuras a las que tiene acceso.
     */
    public function ObtenerEstructurasNoFormales($certificate, $idnomeav)
    {
        $arrayultimas = array();
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if ($idusuario) {
            $entidades = DatEntidadSegUsuarioSegRol::cargarentidadesusuario(
                $idusuario
            );
            $entidades =$this->arregloBidimensionalToUnidimensional($entidades);
            $global = ZendExt_GlobalConcept::getInstance();
            $iddominio = $global->Perfil->iddominio;
            $integrator = ZendExt_IoC::getInstance();
            $arrayultimas = $integrator->metadatos->buscarIdEstructurasDominio(
                $iddominio, $entidades, 2, $idnomeav
            );
            $arrayultimas = $this->arregloBidimensionalToUnidimensional(
                $arrayultimas
            );

            return $arrayultimas;
        } else {
            throw new SoapFault('El certificado del usuario no es válido.');
        }
    }

    /**
     * - Obtener las estructuras a las que tiene acceso un usuario
     *
     * @param STRING  - Certificado o token de seguridad asignado
     * al usuario.
     *
     * @return ARRAY - Estructuras a las que tiene acceso
     */
    public function ObtenerEstructurasFormales($certificate)
    {
        $arrayultimas = array();
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if ($idusuario) {
            $entidades = DatEntidadSegUsuarioSegRol::cargarentidadesusuario(
                $idusuario
            );
            $entidades =$this->arregloBidimensionalToUnidimensional($entidades);
            $global = ZendExt_GlobalConcept::getInstance();
            $iddominio = $global->Perfil->iddominio;
            $integrator = ZendExt_IoC::getInstance();
            $arrayultimas = $integrator->metadatos->buscarIdEstructurasDominio(
                $iddominio, $entidades, 1
            );
            $arrayultimas = $this->arregloBidimensionalToUnidimensional(
                $arrayultimas
            );

            return $arrayultimas;
        } else {
            throw new SoapFault('El certificado del usuario no es válido.');
        }
    }

    /**
     * - Convierte un array bidimencional a unidimencional
     *
     * @param ARRAY  - Array bidimencional .
     *
     * @return ARRAY - Array unidimencional
     */
    private function arregloBidimensionalToUnidimensional($arrayEstructuras)
    {
        $array = array();
        foreach ($arrayEstructuras as $est) {
            $array[] = $est['idestructura'];
        }

        return $array;
    }

    /**
     * - Función para saber si hay algún rol aparte del de instalación creado.
     * @param - Ninguno
     * @return BOOLEAN
     */
    public function existSomeRol()
    {
        $cantRoles = SegRol::cantrol();
        if ($cantRoles > 1) {
            return true;
        }

        return false;
    }

    /**
     * - Función para saber si existe algún usuario.
     * @param - Ninguno
     * @return BOOLEAN
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
     * - Brinda el servicio de listar todos los sistemas a los que tiene
     * acceso un usuario en una entidad.
     *
     * @param STRING   - Certificado o token de seguridad
     * asignado al usuario.
     * @param INTEGER    - Identificador de la estructura.
     *
     * @return ARRAY
     */
    public function getSystems($certificate, $identidad)
    {
        $sistemaArr = array();
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $rolusuarioentidad = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identidad
            );
            $sistemaObj = DatSistema::obtenersistemas(
                $rolusuarioentidad[0]->idrol
            );
            $sistemaArr = array();
            foreach ($sistemaObj as $key => $sistema) {
                $sistemaArr[$key]['id'] = $sistema->idsistema;
                $sistemaArr[$key]['icono'] = ($sistema->icono)
                    ? $sistema->icono
                    : 'falta';
                $sistemaArr[$key]['titulo'] = $sistema->denominacion;
                $sistemaArr[$key]['externa'] = $sistema->externa;
            }

            return $sistemaArr;
        } else {
            throw new SoapFault('El certificado del usuario no es válido');
        }
    }

    /**
     * - Servicio que le permite obtener las acciones de un usuario.
     *
     * @param STRING       - Certificado o token de seguridad
     * asignado al usuario.
     * @param INTEGER        - Identificador de la entidad.
     * @param INTEGER        - Identificador del sistema.
     * @param INTEGER  -  Identificador de la funcionalidad.
     *
     * @return JSON | NULL - Las acciones del usuario autenticado.
     */
    public function loadActions(
        $identidad, $idsistema, $idfuncionalidad, $certificado
    )
    {
        $arracciones = array();
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificado);
        if ($datos) {
            //$idcertificado = $datos[0]->idcertificado;
            $idusuario = $datos[0]->idusuario;
            $rolusuarioentidad = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identidad
            );
            $accionesquetiene = DatAccion::cargaracciones(
                $idsistema, $idfuncionalidad, $rolusuarioentidad[0]->idrol
            );
            foreach ($accionesquetiene as $valores => $valor) {
                $arracciones[$valores]['idaccion'] = $valor->idaccion;
                $arracciones[$valores]['denominacion'] = $valor->denominacion;
            }

            return json_encode($arracciones);
        } else {
            throw new SoapFault('El certificado no es válido');
        }
    }

    /**
     * - Carga sistemas, subsistemas y funcionalidades.
     *
     * @param STRING   - Certificado o token de seguridad
     * asignado al usuario.
     * @param INTEGER    - Identificador del sistema.
     * @param INTEGER    - Identificador de la estructura.
     *
     * @return JSON | NULL - Los subsistemas de un sistema o las
     * funcionalidades de un subsistema.
     */
    public function getSystemsFunctions($certificate, $idsistema, $identidad)
    {
        $tmpidsistema = explode('_', $idsistema);
        if (count($tmpidsistema) >= 1) {
            $idsistema = $tmpidsistema[0];
        }
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $rolusuarioentidad = DatEntidadSegUsuarioSegRol::obtenerrol(
            $idusuario, $identidad
        );
        $idrol = $rolusuarioentidad[0]->idrol;
        $acceso = DatSistema::verificarrolsistema($idrol, $idsistema);
        if (count($acceso)) {
            $sistemas = DatSistema::cargarsistema($idsistema);
            $externa = DatSistema::buscarservidorweb($idsistema);
            $contador = 0;
            $sistemafunArr = array();
            if ($sistemas->count()) {
                foreach ($sistemas as $valores => $valor) {
                    $sistemafunArr[$contador]['id'] = $valor->id . '_'
                        . $idsistema;
                    $sistemafunArr[$contador]['idsistema'] = $valor->id;
                    $sistemafunArr[$contador]['externa'] = $valor->externa;
                    $sistemafunArr[$contador]['icono'] = $valor->icono;
                    $sistemafunArr[$contador]['text'] = $valor->text;
                    $sistemafunArr[$contador]['servidores'] = $this->servidores(
                        $valor->id
                    );
                    $contador++;
                }
            }
            $funcionalidad = DatFuncionalidad::cargarfuncionalidades(
                $idsistema, 0, 0
            );
            if ($funcionalidad->getData() != null) {
                foreach ($funcionalidad as $valores => $valor) {
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
            throw new SoapFault('El certificado del usuario no es válido');
        }
    }

    /**
     * - Obtener los módulos para el portal tipo escritorio.
     *
     * @param STRING   - Certificado o token de seguridad
     * asignado al usuario.
     * @param INTEGER    - Identificador de la entidad a la
     * que accedió el usuario.
     *
     * @return ARRAY - Listado de modulos.
     */
    public function getSystemsDesktopModules($certificate, $identidad)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $rolusuarioentidad = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identidad
            );
            $sistemas = DatSistema::obtenersistemas(
                $rolusuarioentidad[0]->idrol
            )->toArray(true);
            if (count($sistemas)) {
                foreach ($sistemas as $mdf) {
                    $resultado[] = $this->subsistemas(
                        $mdf, $rolusuarioentidad[0]->idrol
                    );
                }

                return $resultado;
            } else {
                return array();
            }
        } else {
            throw new SoapFault('El certificado del usuario no es válido');
        }
    }

    /**
     * - Obtener los módulos para el portal tipo escritorio.
     *
     * @param STRING   - Certificado o token de seguridad
     * asignado al usuario.
     * @param INTEGER    - Identificador de la entidad a la
     * que accedió el usuario.
     *
     * @return ARRAY - Listado de módulos.
     */
    public function getSystemsFunctionsDesktopModules($certificate, $identidad)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $idusuario = $datos[0]->idusuario;
            $rolusuarioentidad = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identidad
            );
            $sistemas = DatSistema::obtenersistemas(
                $rolusuarioentidad[0]->idrol
            )->toArray();
            if (count($sistemas)) {
                foreach ($sistemas as $mdf) {
                    $aux = $this->subsistemasfunc(
                        $mdf, $rolusuarioentidad[0]->idrol
                    );
                    if ($aux != 0) {
                        $resultado[] = $aux;
                    }
                }

                return $resultado;
            } else {
                return array();
            }
        } else {
            throw new SoapFault('El certificado del usuario no es válido');
        }
    }

    private function subsistemas($raiz, $idrol)
    {
        $idSist = $this->servidores($raiz['idsistema']);
        $ico = $raiz['icono'];
        $sist = $raiz['idsistema'];
        $denom = $raiz['denominacion'];
        $ext = $raiz['externa'];
        $result = array(
            'icono' => $ico,
            'id' => $sist,
            'text' => $denom,
            'externa' => $ext,
            'servidores' => $idSist
        );
        $sistemashijos = DatSistema::cargarsistemahijos(
            $raiz['idsistema'], $idrol
        );
        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    $result['menu'][] = $this->subsistemas($hijo, $idrol);
                }
            }

            return $result;
        } else {
            return $result;
        }
    }

    private function subsistemasfunc($raiz, $idrol)
    {
        $sistemashijos = DatSistema::cargarsistemahijos(
            $raiz['idsistema'], $idrol
        );
        $arrayFunc = $this->funcionalidades(
            $raiz['idsistema'], $idrol, $raiz['externa']
        );
        if ((count($sistemashijos) == 0 && count($arrayFunc) == 0)) {
            return 0;
        }
        if ($this->obtenerHijos($raiz['idsistema']) == 1) {
            $fidSist = $this->funcionalidades(
                $sistemashijos[0]['idsistema'],
                $idrol,
                $sistemashijos[0]['externa']
            );
            if (count($fidSist) == 0) {
                return 0;
            }
        }
        $result = array('icono'      => $raiz['icono'],
                        'id'         => $raiz['idsistema'],
                        'text'       => $raiz['denominacion'],
                        'externa'    => $raiz['externa'],
                        'menu'       => $arrayFunc,
                        'servidores' => $this->servidores($raiz['idsistema']));
        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    $aux = $this->subsistemasfunc($hijo, $idrol);
                    if ($aux != 0) {
                        $result['menu'][] = $aux;
                    }
                }
            }

            return $result;
        } else {
            return $result;
        }
    }

    private function obtenerHijos($idsistema)
    {
        return DatSistema::cantidadSistemasHijos($idsistema);
    }

    private function servidores($idsistema)
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

    private function funcionalidades($idsistema, $idrol, $externa)
    {
        $funcsistema = DatFuncionalidad::obtenerFuncionalidades(
            $idsistema, $idrol
        );
        $arrayFunc = array();
        if (count($funcsistema > 0)) {
            foreach ($funcsistema as $key => $funcionalidades) {
                $arrayFunc[$key]['text'] = $funcionalidades->text;
                $arrayFunc[$key]['id'] = $funcionalidades->idfuncionalidad;
                $arrayFunc[$key]['index'] = $funcionalidades->index;
                if ($externa) {
                    $arrayFunc[$key]['referencia'] = $externa . '/'
                        . $funcionalidades->referencia;
                } else {
                    $arrayFunc[$key]['referencia'] = '../../../'
                        . $funcionalidades->referencia;
                }
            }
        }

        return $arrayFunc;
    }

    /**
     * - Verifica si un usuario tiene acceso a una entidad.
     *
     * @param STRING   - Certificado o token de seguridad
     * asignado al usuario.
     * @param INTEGER     - Identificador de la entidad a la
     * que accedió el usuario.
     *
     * @return INTEGER - entero.
     */
    public function verifyAccessEntity($certificate, $identity)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if ($this->usuarioEntidad($idusuario, $identity)) {
            $roles = SegRol::obtenerrolesusuarioentidad($idusuario, $identity);
            if (count($roles)) {
                return $roles[0]['text'];
            } else {
                return '0';
            }
        }
    }

    /**
     * - Obtiene un XML con la configuración para un usuario.
     *
     * @param STRING   - Certificado o token de seguridad
     * asignado al usuario.
     * @param INTEGER     - Identificador de la entidad a la
     * que accedió el usuario.
     *
     * @return XML
     */
    public function LoadXML($certificate, $identity)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if (count($idusuario)) {
            $rolusuarioentidad = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identity
            );
            $sistemas = DatSistema::obtenersistemas(
                $rolusuarioentidad[0]->idrol
            )->toArray(true);
            if (count($sistemas)) {
                $menu = "<?xml version=\"1.0\" encoding=\"UTF-8\"<menu>";
                foreach ($sistemas as $mdf) {
                    $this->subsistemasxml(
                        $mdf, $rolusuarioentidad[0]->idrol, $menu
                    );
                }
                $menu .= "</menu>";
                header('Content-Type: text/xml');
                echo $menu;

                return $menu;
            }
        } else {
            throw new SoapFault('El certificado del usuario no es válido');
        }
    }

    /**
     * - Obtiene un XML con la configuración de un módulo dado para un usuario.
     *
     * @param STRING   - Certificado o token de seguridad
     * asignado al usuario.
     * @param STRING        - Módulo especificado.
     * @param INTEGER     - Identificador de la entidad a la que
     * accedió el usuario.
     *
     * @return XML
     */
    public function LoadXMLModule($certificate, $identity, $module)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if (count($idusuario)) {
            $rolusuarioentidad = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identity
            );
            $sistemas = DatSistema::obtenersistemasxml(
                $rolusuarioentidad[0]->idrol, $module
            )->toArray(true);
            if (count($sistemas)) {
                $menu = "<?xml version=\"1.0\" encoding=\"UTF-8\"<menu>";
                foreach ($sistemas as $mdf) {
                    $this->subsistemasxml(
                        $mdf, $rolusuarioentidad[0]->idrol, $menu
                    );
                }
                $menu .= "</menu>";
                header('Content-Type: text/xml');
                echo $menu;

                return $menu;
            }
        }

        return '';
    }

    private function subsistemasxml($raiz, $idrol, & $menu)
    {
        $menu .= "<MenuItem name=\"{$raiz['denominacion']}\" "
        . "id=\"{$raiz['idsistema']}\" "
        . "externa=\"{$raiz['externa']}\" "
        . "icon=\"{$raiz['icono']}\"  "
        . "status=\"{$raiz['descripcion']}\">";
        $this->funcionalidadesxml($raiz['idsistema'], $idrol, $menu);
        $sistemashijos = DatSistema::cargarsistemahijos(
            $raiz['idsistema'], $idrol
        );
        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    $this->subsistemasxml($hijo, $idrol, $menu);
                }
            }
        }
        $menu .= "</MenuItem>";
    }

    private function funcionalidadesxml($idsistema, $idrol, & $menu)
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

    /**
     * - Devuelve los datos del perfil de usuario.
     *
     * @param ARRAY     - Identificadores de los usuario.
     * @param STRING   - Certificado del usuario logeado.
     *
     * @return ARRAY
     */
    public function getUsersProfile($arrayusers, $certificate)
    {
        $arrayPerfil = array();
        $arraycampos = array();
        if ($this->verificateCertificate($certificate)) {
            foreach ($arrayusers as $key => $usuarios) {
                $datos = SegUsuario::nombusuario($usuarios)->toArray();
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
                $arrayPerfil[$key]['usuario'] = $datos[0]['nombreusuario'];
            }
        }

        return $arrayPerfil;
    }

    /**
     * - Devuelve la entidad, el área y el cargo de cada usuario.
     *
     * @param ARRAY - Identificadores de usuarios.
     *
     * @return ARRAY
     */
    public function getUsersEntity($array)
    {
        $arrayreturn = array();
        foreach ($array as $key => $usuarios) {
            $datos = SegUsuario::cargarentidadesareascargos($usuarios);
            $integrator = ZendExt_IoC::getInstance();
            $arrayEstructuras = $integrator->metadatos
                ->MostrarCamposEstructuraSeguridad($datos[0]['identidad']);
            $arrayreturn[$key]['entidad'] = $arrayEstructuras[0]['text'];
            $arrayreturn[$key]['identidad'] = $datos[0]['identidad'];
            if ($datos[0]['idarea'] != 0) {
                $area = $integrator->metadatos
                    ->EstructurasInternasDadoIDSeguridad($datos[0]['idarea']);
                $arrayreturn[$key]['area'] = $area[0]['denominacion'];
                $arrayreturn[$key]['idarea'] = $datos[0]['idarea'];
            }
            if ($datos[0]['idcargo'] != 0) {
                $cargo = $integrator->metadatos->CargoDadoIDSeguridad(
                    $datos[0]['idcargo']
                );
                $arrayreturn[$key]['cargo'] = $cargo[0]['denominacion'];
                $arrayreturn[$key]['idcargo'] = $datos[0]['idcargo'];
            }
            $arrayreturn[$key]['idusuario'] = $usuarios;
        }

        return $arrayreturn;
    }

    /**
     * - Devuelve las acciones de un usuario.
     *
     * @param STRING       - Certificado del usuario.
     * @param INTEGER  -  Identificador de la funcionalidad.
     * @param STRING            -  Identificador de la entidad.
     *
     * @return ARRAY
     */
    public function loadUserActions($certificate, $idfuncionalidad, $entity)
    {
        $arracciones = array();
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        //$idcertificado = $datos[0]->idcertificado;
        $idusuario = $datos[0]->idusuario;
        $rolusuarioentidad = DatEntidadSegUsuarioSegRol::obtenerrol(
            $idusuario, $entity
        );
        $accionesquetiene = DatRecurso::cargarRecursosService(
            $idfuncionalidad, $rolusuarioentidad[0]->idrol
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
     *
     * @param STRING  - Certificado del usuario.
     *
     * @return ARRAY
     */
    public function LoadUserRoles($certificate)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        //$idcertificado = $datos[0]->idcertificado;
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
     *
     * @param STRING   - Certificado del usuario.
     * @param INTEGER    - Identificador de la entidad.
     *
     * @return ARRAY
     */
    public function LoadUserRolByEntidad($certificate, $identidad)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        //$idcertificado = $datos[0]->idcertificado;
        $idusuario = $datos[0]->idusuario;
        $rolesuser = SegRol::obtenerrolesusuarioentidad($idusuario, $identidad);
        $arrayresult = new stdClass();
        $arrayresult->idrol = $rolesuser[0]->id;
        $arrayresult->denominacion = $rolesuser[0]->text;
        $arrayresult->abreviatura = $rolesuser[0]->abreviatura;

        return $arrayresult;
    }

    /**
     * - Devuelve verdadero o falso si la entidad tiene roles o usuarios.
     *
     * @param STRING  - Entidad.
     *
     * @return INTEGER
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
     * - Devuelve verdadero si se ha cambiado el estado de un usuario.
     *
     * @param STRING  - Id de usuario.
     * @param STRING     - Opción.
     *
     * @return INTEGER
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
     * - Función para cambiar el contrase&ntilde;a a un usuario.
     *
     * @param STRING  - Nombre de usuario.
     * @param STRING  - Contrase&ntilde;a vieja.
     * @param STRING  - Nueva contrase&ntilde;a.
     *
     * @return INTEGER
     */
    public function ChangePassword($usuario, $oldpass, $newpass)
    {
        $verificar = SegUsuario::obtenerUsuario($usuario);
        $oldpass = md5($oldpass);
        if ($verificar[0]->contrasenna == $oldpass) {
            if ($this->verificarpass($newpass)) {
                $objusuario = Doctrine::getTable('SegUsuario')
                    ->find($verificar[0]->idusuario);
                $objusuario->contrasenna = md5($newpass);
                $objusuario->save();

                return 1;
            } else {
                throw new ZendExt_Exception('SEG020');
            }
        } else {
            throw new ZendExt_Exception('SEG013');
        }
    }

    private function verificarpass($pass)
    {
        //$s = '/^([a-zA-Z��������])+$/';
        $sn = '/^[\da-zA-Z��������]+$/';
        //$nn = '/[\d]/';
        //$nl = '/[\!\\�\\!\@\#\$\%\^\&\*\(\)\_\+\=\{\}'
        //    . '\[\]\:\"\;\'\?\/\>\.\<\,\\\*\-]+$/';
        $clave = new SegRestricclaveacceso();
        $datos = $clave->cargarclave(0, 0);
        $resultados = array();
        //$results = array();
        if ($datos->getData() == null) {
            throw new ZendExt_Exception('SEG001');
        }
        $datosacc = $datos->toArray(true);
        if (strlen($pass) < $datosacc[0]['minimocaracteres']) {
            throw new ZendExt_Exception('SEG021');
        }
        if ($datosacc[0]['numerica'] == 1
            && $datosacc[0]['alfabetica'] == 0
            && $datosacc[0]['signos'] == 0) {
            if (!$this->hayNumeros($pass)) {
                throw new ZendExt_Exception('SEG002');
            }
        }
        if ($datosacc[0]['numerica'] == 0
            && $datosacc[0]['alfabetica'] == 1
            && $datosacc[0]['signos'] == 0) {
            if (!$this->hayLetras($pass)) {
                throw new ZendExt_Exception('SEG003');
            }
        }
        if ($datosacc[0]['numerica'] == 0
            && $datosacc[0]['alfabetica'] == 0 && $datosacc[0]['signos'] == 1) {
            $signos = preg_match($sn, $pass, $resultados);
            if ($signos == 1) {
                throw new ZendExt_Exception('SEG004');
            }
        }
        if ($datosacc[0]['numerica'] == 1
            && $datosacc[0]['alfabetica'] == 1
            && $datosacc[0]['signos'] == 0) {
            if (!$this->hayLetras($pass) || !$this->hayNumeros($pass)) {
                throw new ZendExt_Exception('SEG005');
            }
        }
        if ($datosacc[0]['numerica'] == 0
            && $datosacc[0]['alfabetica'] == 1
            && $datosacc[0]['signos'] == 1) {
            $signos = preg_match($sn, $pass, $resultados);
            if (!$this->hayLetras($pass) || !$signos) {
                throw new ZendExt_Exception('SEG006');
            }
        }
        if ($datosacc[0]['numerica'] == 1
            && $datosacc[0]['alfabetica'] == 0
            && $datosacc[0]['signos'] == 1) {
            $signos = preg_match_all($sn, $pass, $resultados);
            if (!$signos == 1 || !$this->hayNumeros($pass)) {
                throw new ZendExt_Exception('SEG007');
            }
        }
        if ($datosacc[0]['numerica'] == 1
            && $datosacc[0]['alfabetica'] == 1
            && $datosacc[0]['signos'] == 1) {
            $signos = preg_match($sn, $pass, $resultados);
            if (!$this->hayNumeros($pass) || $signos == 1
                || !$this->hayNumeros($pass)) {
                throw new ZendExt_Exception('SEG008');
            }
        }

        return true;
    }

    private function hayNumeros($cadena)
    {
        $cant = strlen($cadena);
        for ($i = 0; $i < $cant; $i++) {
            if ($cadena[$i] >= '0' && $cadena[$i] <= '9') {
                return true;
            }
        }

        return false;
    }

    private function hayLetras($cadena)
    {
        $cant = strlen($cadena);
        for ($i = 0; $i < $cant; $i++) {
            if (($cadena[$i] >= 'A' && $cadena[$i] <= 'Z')
                || ($cadena[$i] >= 'a' && $cadena[$i] <= 'z')
                || $cadena[$i] == '�'
                || $cadena[$i] == '�'
            ) {
                return true;
            }
        }

        return false;
    }

    /**
     * - Servicio para obtener todos los usuarios de un rol en una entidad.
     *
     * @param INTEGER  - Identificador de la entidad.
     * @param INTEGER      - Identificador del rol.
     *
     * @return ARRAY
     */
    public function rolAsUsersGain($identidad, $idrol)
    {
        $arrayResp = array();
        $result = SegUsuario::cargarusuarios($identidad, $idrol);
        foreach ($result as $key => $usuarios) {
            $perfil = SegUsuario::cargarperfilusuario($usuarios['idusuario']);
            if (is_array($perfil[0]['NomFila']['NomValor'])) {
                foreach ($perfil[0]['NomFila']['NomValor'] as $valor) {
                    if ($valor['idfila']) {
                        $arraycampos = NomValor::cargarcamposdadovalores(
                            $valor['idvalor']
                        );
                        $arrayResp[$key][$arraycampos[0]['NomCampo']['nombre']]
                            = $valor['valor'];
                    }
                }
            }
            $arrayResp[$key]['idusuario'] = $usuarios['idusuario'];
        }

        return $arrayResp;
    }

    /**
     * - Servicio para saber si un certificado es válido.
     *
     * @param INTEGER  - Certificado.
     *
     * @return INTEGER - Uno si existe cero de lo contrario.
     */
    public function verificateCertificate($certificate)
    {
        $existe = SegCertificado::existcertificado($certificate);
        if ($existe) {
            return 1;
        } else {
            return 0;
        }
    }

    private function usuarioEntidad($idusuario, $idEstructura)
    {
        $exist = DatEntidadSegUsuarioSegRol::obtenerrol(
            $idusuario, $idEstructura
        );
        if (count($exist)) {
            return 1;
        } else {
            return 0;
        }
    }

    private function arrayUsuariosPerfil($arrayusers)
    {
        $arrayresp = array();
        $arraycampos = array();
        foreach ($arrayusers as $key => $usuarios) {
            $perfil = SegUsuario::cargarperfilusuario($usuarios['idusuario']);
            if (is_array($perfil[0]['NomFila']['NomValor'])) {
                foreach ($perfil[0]['NomFila']['NomValor'] as $valor) {
                    if ($valor['idfila']) {
                        $arraycampos = NomValor::cargarcamposdadovalores(
                            $valor['idvalor']
                        );
                        $arrayresp[$key][$arraycampos[0]['NomCampo']['nombre']]
                            = $valor['valor'];
                    }
                }
            }
            $arrayresp[$key]['id'] = $usuarios['idusuario'];
            $arrayresp[$key]['text'] = $usuarios['nombreusuario'];
            $arrayresp[$key]['idusuario'] = $usuarios['idusuario'];
            $arrayresp[$key]['usuario'] = $usuarios['nombreusuario'];
            $arrayresp[$key]['idpadre'] = $perfil[0]['idcargo'];
            $arrayresp[$key]['leaf'] = true;
            $arrayresp[$key]['checked'] = false;
        }

        return $arrayresp;
    }

    /**
     * - Actualiza los grupos de planificación.
     *
     * @param ARRAY    - Listado de usuarios.
     * @param INTEGER   - Id del cargo del usuario.
     * @param STRING     - Acción.
     *
     * @return BOOLEAN
     */
    public function actualizarGruposDPO($usuarios, $idcargo, $accion)
    {
        $integrator = ZendExt_IoC::getInstance();
        try {
            $integrator->planificacion->actualizarGruposDPO(
                $usuarios, $idcargo, $accion
            );
        } catch (ZendExt_Exception $exception) {
            if ($exception) {
                return false;
            }
        }
    }

    /**
     * - Servicio para saber si un certificado es válido.
     *
     * @param INTEGER    - Certificado.
     * @param INTEGER   - Id de la estructura.
     * @param STRING            - Tipo.
     * @param INTEGER  - Estado.
     *
     * @return ARRAY
     */
    public function loadDomainPDO(
        $certificado, $idEstructura, $tipo, $estaendominio
    )
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificado);
        $idusuario = $datos[0]->idusuario;
        $integrator = ZendExt_IoC::getInstance();
        $arrayEstructuras = array();
        if ($idusuario) {
            $iddominio = SegUsuario::cargardominiodeusuario($idusuario);
            $idDom = $iddominio[0]->iddominio;
            if ($idEstructura == 0 || $tipo == 'externa') {
                $arrayExt = $integrator->metadatos
                    ->buscarHijosEstructuras($idDom, $idEstructura, 0, 0, 1);
                $arrayInt = $integrator->metadatos
                    ->buscarHijosEstructuras($idDom, $idEstructura, 0, 0, 2);
                $arrayId = array_merge($arrayExt, $arrayInt);
                $key = 0;
                if (count($arrayId)) {
                    foreach ($arrayId as $valores) {
                        $dominio = false;
                        $leaf = true;
                        $arrayEstructuras[$key]['id'] = $valores['id'];
                        $arrayEstructuras[$key]['idestructura'] =$valores['id'];
                        $arrayEstructuras[$key]['text'] = $valores['text'];
                        $arrayEstructuras[$key]['tipo'] = $valores['tipo'];
                        $exist = DatEntidadSegUsuarioSegRol::obtenerrol(
                            $idusuario, $valores['id']
                        );
                        if (count($exist)) {
                            $arrayEstructuras[$key]['checked'] = false;
                            $dominio = true;
                        }
                        $arrayEstructuras[$key]['dominio'] = $dominio;
                        if ($valores['tipo'] == 'externa') {
                            $icon = 'entidad';
                            $hext = $integrator->metadatos
                                ->buscarHijosEstructuras(
                                    $idDom, $valores['id'], 0, 0, 1
                                );
                            $hint = $integrator->metadatos
                                ->buscarHijosEstructuras(
                                    $idDom, $valores['id'], 0, 0, 2
                                );
                            if (count($hext) || count($hint)) {
                                $leaf = false;
                            }
                        } else {
                            $icon = 'area';
                            $hint = $integrator->metadatos
                                ->buscarHijosEstructuras(
                                    $idDom, $valores['id'], 0, 0, 2
                                );
                            $tienehijopscargos = $integrator->metadatos
                                ->BuscarCargosPorTiposSeguridad($valores['id']);
                            if (count($hint) || count($tienehijopscargos)) {
                                $leaf = false;
                            }
                        }
                        $arrayEstructuras[$key]['leaf'] = $leaf;
                        $arrayEstructuras[$key]['iconCls'] = $icon;
                        $key++;
                    }
                }
            } elseif ($tipo == 'interna') {
                $arrayId = $integrator->metadatos
                    ->buscarHijosEstructuras($idDom, $idEstructura, 0, 0, 2);
                $arraycargos = $integrator->metadatos
                    ->BuscarCargosPorTiposSeguridad($idEstructura);
                $key = 0;
                if (count($arrayId)) {
                    foreach ($arrayId as $valores) {
                        $dominio = false;
                        $arrayEstructuras[$key]['id'] = $valores['id'];
                        $arrayEstructuras[$key]['idestructura'] =$valores['id'];
                        $arrayEstructuras[$key]['text'] = $valores['text'];
                        $arrayEstructuras[$key]['tipo'] = $valores['tipo'];
                        $arrayEstructuras[$key]['iconCls'] = 'area';
                        $exist = DatEntidadSegUsuarioSegRol::obtenerrol(
                            $idusuario, $valores['id']
                        );
                        if (count($exist)) {
                            $arrayEstructuras[$key]['checked'] = false;
                            $dominio = true;
                        }
                        $arrayEstructuras[$key]['dominio'] = $dominio;
                        $hint = $integrator->metadatos
                            ->buscarHijosEstructuras(
                                $idDom, $valores['id'], 0, 0, 2
                            );
                        $tienehijopscargos = $integrator->metadatos
                            ->BuscarCargosPorTiposSeguridad($valores['id']);
                        if (count($hint) || count($tienehijopscargos)) {
                            $arrayEstructuras[$key]['leaf'] = false;
                        }
                        $key++;
                    }
                }
                if (count($arraycargos)) {
                    foreach ($arraycargos as $valoresOne) {
                        $arrayEstructuras[$key]['id'] = $valoresOne['id'];
                        $arrayEstructuras[$key]['idcargo'] = $valoresOne['id'];
                        $arrayEstructuras[$key]['text'] =
                            $valoresOne['Asignacion']['text'];
                        $arrayEstructuras[$key]['tipo'] = 'cargo';
                        $arrayEstructuras[$key]['iconCls'] = 'cargo';
                        $dominio = false;
                        $exist = DatEntidadSegUsuarioSegRol::obtenerrol(
                            $idusuario, $idEstructura
                        );
                        if (count($exist)) {
                            $arrayEstructuras[$key]['checked'] = false;
                            $dominio = true;
                        }
                        $arrayEstructuras[$key]['dominio'] = $dominio;
                        $catusuarios = SegUsuario::cantidadusuariosdelcargo(
                            $valoresOne['id']
                        );
                        if ($catusuarios) {
                            $arrayEstructuras[$key]['leaf'] = false;
                        }
                        $key++;
                    }
                }
            } elseif ($tipo == 'cargo') {
                $usuarios = SegUsuario::usuariosdelcargo($idEstructura);
                $arrayEstructuras = self::arrayUsuariosPerfil(
                    $usuarios, $estaendominio
                );
                if (count($arrayEstructuras)) {
                    foreach ($arrayEstructuras as $key => $usuario) {
                        $arrayEstructuras[$key]['iconCls'] = 'usuario';
                    }
                }
            }

            return $arrayEstructuras;
        }
        throw new SoapFault('El certificado del usuario no es válido');
    }

    /**
     * - Servicio que debuelve la entidad, el área y el cargo de un grupo
     * de usuarios.
     *
     * @param INTEGER  - Id del usuario.
     *
     * @return ARRAY
     */
    public function getUsersDates($idusuario)
    {
        $a = new SegUsuario();
        $datos = $a->cargarperfilusuario($idusuario);
        foreach ($datos as $key => $valores) {
            $result[$key]['identidad'] = $valores['identidad'];
            $result[$key]['idarea'] = $valores['idarea'];
            $result[$key]['idcargo'] = $valores['idcargo'];
        }

        return $result;
    }

    /**
     * - Devuelve el nombre del usuario.
     *
     * @param STRING - Identificador del usuarios.
     *
     * @return STRING
     */
    public function nameUsersProfile($user)
    {
        $datos = SegUsuario::nombusuario($user)->toArray();
        $nombre = $datos[0]['nombreusuario'];

        return $nombre;
    }

    /**
     * - Servicio que permite la inserción de un usuario.
     *
     * @param STRING          - Usuario.
     * @param INTEGER        - CI.
     * @param STRING        - Nombre del usuario.
     * @param STRING        - Primer apellido.
     * @param STRING        - Segundo apellido.
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
            $usuario->nombreusuario = $this->generarNombreUsuario(
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

    private function generarNombreUsuario($nombre, $papell, $sapell)
    {
        $i = 1;
        $existe = false;
        do {
            $nombreusuario = substr($nombre, 0, $i) . $papell
                . substr($sapell, 0, $i);
            $usuario = SegUsuario::contarusuario($nombreusuario);
            if ($usuario) {
                $existe = true;
            }
            $i++;
        } while ($existe);

        return strtolower($nombreusuario);
    }

    /**
     * - Devuelve le identificador del usuario dado el nombre.
     *
     * @param STRING     - Usuario.
     *
     * @return INTEGER                - Identificador del usuario.
     */
    public function obtenerIdUsuarioDadoNombre($nombreusuario)
    {
        $idusuario = SegUsuario::obtenerIdUsuarioDadoNombre($nombreusuario);

        return $idusuario;
    }

    /**
     * - Función para devolver los nombres de usuarios.
     *
     * @param ARRAY - Nombre de usuario.
     *
     * @return ARRAY
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
     * - Devuelve si un usuario tiene acceso una funcionalidad.
     *
     * @param STRING - Token de seguridad.
     * @param STRING         - Url.
     * @param INTEGER    - Identificador de la entidad.
     *
     * @return BOOLEAN
     */
    public function accessToFunctionality($certificate, $url, $identity)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $rol = DatEntidadSegUsuarioSegRol::obtenerrol($idusuario, $identity);
        $acceso = DatFuncionalidad::accesoFuncionalidad($rol[0]->idrol, $url);
        if (count($acceso)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * - Devuelve si un usuario tiene acceso a una acción.
     *
     * @param STRING  - Token de seguridad.
     * @param STRING - Denominación de la acción.
     * @param INTEGER     - Identificador de la entidad.
     *
     * @return BOOLEAN
     */
    public function accessToAction($certificate, $denominacion, $identity)
    {
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        if ($idusuario) {
            $rol = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identity
            );
            $acceso = DatAccion::accesoAccion($rol[0]->idrol, $denominacion);
            if (count($acceso)) {
                return true;
            } else {
                return false;
            }
        } else {
            throw new SoapFault('El certificado del usuario no es válido');
        }
    }

    /**
     * - Retorna todos los usuarios que pueden ser manipulados por
     * el usuario logeado.
     *
     * @param INTEGER  - Identificador del dominio.
     * @param INTEGER  - Identificador del usuario.
     *
     * @return ARRAY
     */
    public function listadoUsuariosCompartimentados($iddominio, $idusuario)
    {
        $arrayresult = array();
        //$datosusuario = array();
        //$usuariosSinDominio = array();
        $usuariosconpermisosadominios = array();
        $permisos = SegCompartimentacionusuario::cargardominioUsuario(
            $idusuario
        );
        $filtroDominio = $this->arregloToUnidimensional($permisos);
        if (count($filtroDominio)) {
            $usuariosconpermisosadominios = SegUsuario::
                cargarUsuariosconpermisosaDominios($filtroDominio);
        }
        $usuariosconpermisosadominios = $this->arregloToUnidimensionalUsuario(
            $usuariosconpermisosadominios
        );
        $usuariosdelDominio = SegUsuarioNomDominio::cargarUsuariosDominios(
            $iddominio
        );
        $usuariosdelDominio = $this->arregloToUnidimensionalUsuario(
            $usuariosdelDominio
        );
        $arrayresult = array_merge(
            $usuariosconpermisosadominios, $usuariosdelDominio
        );
        $arrayresult = array_unique($arrayresult);

        return $arrayresult;
    }

    /**
     * - Retorna todos los metadatos de los usuarios que pueden ser manipulados
     *  por el usuario logeado.
     *
     * @param INTEGER  - Identificador del dominio del
     * usuario logueado.
     * @param INTEGER  - Usuario logueado.
     *
     * @return ARRAY
     */
    public function UsuariosCompartimentados($iddominio, $idusuario)
    {
        $arrayresult = array();
        $datosusuario = array();
        //$usuariosSinDominio = array();
        $usuariosconpermisosadominios = array();
        $permisos = SegCompartimentacionusuario::cargardominioUsuario(
            $idusuario
        );
        $filtroDominio = $this->arregloToUnidimensional($permisos);
        if (count($filtroDominio)) {
            $usuariosconpermisosadominios = SegUsuario::
                cargarUsuariosconpermisosaDominios($filtroDominio);
        }
        $usuariosconpermisosadominios = $this->arregloToUnidimensionalUsuario(
            $usuariosconpermisosadominios
        );
        $usuariosdelDominio = SegUsuarioNomDominio::cargarUsuariosDominios(
            $iddominio
        );
        $usuariosdelDominio = $this->arregloToUnidimensionalUsuario(
            $usuariosdelDominio
        );
        $arrayresult = array_merge(
            $usuariosconpermisosadominios, $usuariosdelDominio
        );
        $arrayresult = array_unique($arrayresult);
        $datosusuario = SegUsuario::cargarGridUsuario($arrayresult, 100000, 0);
        $arrayusuario = self::datosGridUsuarios($datosusuario);

        return $arrayusuario;
    }

    private function arregloToUnidimensional($arrayDominios)
    {
        $array = array();
        foreach ($arrayDominios as $dominios) {
            $array[] = $dominios['iddominio'];
        }

        return $array;
    }

    private function arregloToUnidimensionalUsuario($arrayvalores)
    {
        $array = array();
        foreach ($arrayvalores as $idusuario) {
            $array[] = $idusuario['idusuario'];
        }

        return $array;
    }

    private function datosGridUsuarios($datosusuario)
    {
        $arrayusuario = array();
        foreach ($datosusuario as $key => $usuario) {
            $arrayusuario[$key]['idusuario'] = $usuario->idusuario;
            $arrayusuario[$key]['nombreusuario'] = $usuario->nombreusuario;
            $arrayusuario[$key]['ip'] = $usuario->ip;
            $arrayusuario[$key]['iddominio'] = $usuario->iddominio;
            $dominio = $this->integrator->metadatos
                ->DatosDominioDadoID($usuario->iddominio);
            $arrayusuario[$key]['dominio'] = $dominio[0]['denominacion'];
        }

        return $arrayusuario;
    }

    /**
     * - Retorna un objeto con los datos del usuario.
     *
     * @param ARRAY - Listado de identificadores de usuarios.
     *
     * @return ARRAY
     */
    public function getUsersNameById($arrayId)
    {
        $arrayResult = array();
        $arrayResult = SegUsuario::getUsersNameById($arrayId);

        return $arrayResult;
    }

    /**
     * - Retorna un objeto con los datos del usuario.
     *
     * @param INTEGER  - Identificador del usuario.
     *
     * @return ARRAY
     */
    public function getIdPersonaByIdUsuario($idusuario)
    {
        $result = array();
        $result = SegUsuarioModel::getIdPersonaByIdUsuario($idusuario);

        return $result;
    }

    /**
     * - Función que retorna un listado con las funcionalidades a las que tiene
     * acceso el usuario logueado.
     *
     * @param STRING   - Certificado del usuario usuario.
     * @param INTEGER    - Id del usuario logeado.
     * @param INTEGER    - Id de estructura del usuario logeado.
     *
     * @return ARRAY
     */
    public function getFunctionalitiesUser($certificate, $idusuario, $identidad)
    {
        $arrayFunc = array();
        $objcertificado = new SegCertificado();
        $datos = $objcertificado->verificarcertificado($certificate);
        if (count($datos)) {
            $objRol = DatEntidadSegUsuarioSegRol::obtenerrol(
                $idusuario, $identidad
            );
            $arrayFunc = DatFuncionalidad::getFuncionalidades(
                $objRol[0]->idrol
            );
        }

        return $arrayFunc;
    }

    /**
     * - Función que retorna un listado con los sistemas, funcionalidades y
     * acciones a las que el usuario tiene acceso.
     *
     * @param STRING   - Certificado del usuario usuario.
     * @param INTEGER    - Id del subsistema.
     * @param INTEGER    - Id de estructura del usuario logeado.
     *
     * @return ARRAY
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
        $datos = $objcertificado->verificarcertificado($certificate);
        $idusuario = $datos[0]->idusuario;
        $rolusuarioentidad = DatEntidadSegUsuarioSegRol::obtenerrol(
            $idusuario, $identidad
        );
        $idrol = $rolusuarioentidad[0]->idrol;
        $funcionalidad = DatFuncionalidad::cargarfuncionalidadesacciones(
            $idsistema, $idrol
        );

        return $funcionalidad;
    }
/*
    public function cargarHijosEstructura($idEstructura)
    {
        $seguridadEC = SeguridadECProxy::getInstance();
        $resp = $seguridadEC->cargarHijosEstructura($idEstructura);
        if (count($resp) == 0) {
            return 'nadaaaaaaaaaaaaaaaa';
        }
        return $resp;
    }
*/
    /**
     * - Función que retorna un listado con los datos de las personas.
     *
     * @param INTEGER    - Límite superior.
     * @param INTEGER    - Límite inferior.
     * @param STRING   - Nombre.
     * @param STRING    - Primer apellido.
     * @param STRING    - Segundo apellido.
     *
     * @return ARRAY
     */
    public function getAllPersons($limit, $start, $nombre, $papell, $sapell)
    {

        $seguridadPersona = SeguridadPersonaProxy::getInstance();
        $resp = $seguridadPersona->getAllPersons(
            ((integer)$limit), ((integer)$start), ((string)$nombre), ((string)$papell), ((string)$sapell)
        );
        return $resp;
    }
    /**
     * - Retorna una url de configuración.
     *
     * @param - Ninguno
     * @return STRING
    **/
    public function getAlfrescoUrlAPI(){
        try{
            $integrator = ZendExt_IoC::getInstance();
            return $integrator->gestordocumental->getAlfrescoUrlAPI();
        }catch (Exception $e){
            return "";
        }
    }

}
