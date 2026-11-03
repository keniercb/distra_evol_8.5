<?php

/**
 * @name GestservidorController - Clase controladora de Servidores.
 * @package   seguridad
 * @copyright UCID
 * @author    Darien García Tejo.
 * @version   2.0-0
 */
class GestservidorController extends SeguridadController
{

    /**
     * @method init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @method gestservidorAction() - Función principal de la clase,
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    function gestservidorAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertarservAction - Función usada para
     *  adicionar un nuevo servidor.
     */
    function insertarservAction()
    {
        $servidor = new DatServidor();
        $servidor->denominacion = $this->_request->getPost('denominacion');
        $servidor->descripcion = $this->_request->getPost('descripcion');
        $servidor->tiposervidor = $this->_request->getPost('tiposervidor');
        /**
         * Si se cumple la condicional es un dominio
         * lo que viene en la variable ip.
         * Funcion dns_get_record de PHP para obtener el ip dado un dominio,
         * no funciona en plataforma Windows
         * */
        if (filter_var($this->_request->getPost('ip'), FILTER_VALIDATE_IP)) {
            $servidor->ip = $this->_request->getPost('ip');
        } else {
            $ip = dns_get_record($this->_request->getPost('ip'), DNS_A);
            $servidor->ip = $ip[0]['ip'];
        }
        if (self::verificadatosservidor($servidor->denominacion)) {
            throw new ZendExt_Exception('SEG050');
        }
        $servidor->save();
        if ($this->_request->getPost('tiposervidor') == 'autenticaci&oacute;n') {
            $servAuth = new DatSerautenticacion();
            $servAuth->idservidor = $servidor->idservidor;
            $servAuth->tservidor = ($this->_request->getPost('openldap') == 'on')
                ? 'openldap' : 'ldap';
            $servAuth->basedn = $this->_request->getPost('basedn');
            $servAuth->usuario = $this->_request->getPost('user');
            $servAuth->puerto = $this->_request->getPost('puerto');
            $servAuth->ssl = ($this->_request->getPost('chekssl') == 'true')
                ? true : false;
            $servAuth->tsl = ($this->_request->getPost('chektsl') == 'true')
                ? true : false;
            $servAuth->password = $this->_request->getPost('passw');

            //-------   filtros del ldap   --------------------------
            $objectClass = $this->_request->getPost('objectclass');
            $fnombre = $this->_request->getPost('fnombre');
            $fapellidos = $this->_request->getPost('fapellidos');
            $fusuario = $this->_request->getPost('fusuario');

            $servAuth->objectclass = $objectClass;
            $servAuth->fnombre = $fnombre;
            $servAuth->fapellidos = $fapellidos;
            $servAuth->fusuario = $fusuario;

            $model = new DatSerautenticacionModel();
            $model->insertar($servAuth);
            $this->showMessage(
                'El servidor de autenticaci&oacute;n '
                . 'ha sido adicionado satisfactoriamente.'
            );
        } else if ($this->_request->getPost('tiposervidor') == 'bd') {
            $servidorbd = new DatServidorbd();
            $servidorbd->idservidor = $servidor->idservidor;
            $model = new DatServidorModel();
            $model->insertar($servidorbd);
            $this->showMessage(
                'El servidor de base de datos ha '
                . 'sido adicionado satisfactoriamente.'
            );
        } else if ($this->_request->getPost('tiposervidor') == 'email') {
            $servemail = new DatServidoremail();
            $servemail->idservidor = $servidor->idservidor;
            $servemail->usuario = $this->_request->getPost('user');
            $servemail->fqdn = $this->_request->getPost('fqdn');
            $servemail->puerto = $this->_request->getPost('puerto');
            $servemail->ssl = ($this->_request->getPost('chekssl') == 'true')
                ? true : false;
            $servemail->tsl = ($this->_request->getPost('chektsl') == 'true')
                ? true : false;
            $servemail->password = $this->_request->getPost('passw');
            $model = new DatServidoremailModel();
            $model->insertarServidoremail($servemail);
            $this->showMessage(
                'El servidor de correo electr&oacute;nico '
                . 'ha sido adicionado satisfactoriamente.'
            );
        } else {
            $servxmpp = new DatServidorxmpp();
            $servxmpp->idservidor = $servidor->idservidor;
            $servxmpp->usuario = $this->_request->getPost('user');
            $servxmpp->fqdn = $this->_request->getPost('fqdn');
            $servxmpp->puerto = $this->_request->getPost('puerto');
            $servxmpp->ssl = ($this->_request->getPost('chekssl') == 'true')
                ? true : false;
            $servxmpp->tsl = ($this->_request->getPost('chektsl') == 'true')
                ? true : false;
            $servxmpp->password = $this->_request->getPost('passw');
            $model = new DatServidorxmppModel();
            $model->insertarServidorxmpp($servxmpp);
            $this->showMessage(
                'El servidor de mensajer&iacute;a xmpp '
                . 'ha sido adicionado satisfactoriamente.'
            );
        }
    }

    /**
     * @method modificarservAction - Función usada para modificar un servidor.
     */
    function modificarservAction()
    {
        $model = new DatServidorModel();
        $idservidor = $this->_request->getPost('idservidor');
        $descripcion = $this->_request->getPost('descripcion');
        $denominacion = $this->_request->getPost('denominacion');
        $tpservaux = $this->_request->getPost('tiposervidor');
        $passw = $this->_request->getPost('passw');
        $user = $this->_request->getPost('user');
        $ip = $this->_request->getPost('ip');

        $objectClass = $this->_request->getPost('objectclass');
        $fnombre = $this->_request->getPost('fnombre');
        $fapellidos = $this->_request->getPost('fapellidos');
        $fusuario = $this->_request->getPost('fusuario');

        $tipoServidor = ($this->_request->getPost('openldap') == 'on')
            ? 'openldap' : 'ldap';
        $puerto = $this->_request->getPost('puerto');
        $chekssl = ($this->_request->getPost('chekssl') == 'true')
            ? true : false;
        $chektsl = ($this->_request->getPost('chektsl') == 'true')
            ? true : false;
        $cadenaconexion = $this->_request->getPost('basedn');
        $fqdname = $this->_request->getPost('fqdn');
        $serverMod = Doctrine::getTable('DatServidor')->find($idservidor);
        if ($serverMod->denominacion != $denominacion) {
            if (self::verificadatosservidor($denominacion, '')) {
                throw new ZendExt_Exception('SEG051');
            }
        }
        $cantservsist = DatSistemaDatServidores::obtenercantservsistema(
            $idservidor
        );
        if ($cantservsist > 0) {
            throw new ZendExt_Exception('SEG010');
        }
        $tiposervidor = DatServidor::gettiposerv($idservidor);
        $tiposerv = $tiposervidor[0]->tiposervidor;
        if (($tpservaux != $tiposerv)
            && ($tpservaux == 'autenticaci&oacute;n')
        ) {
            $cantServBdSist = DatSistemaDatServidores::obtenercantservsistema(
                $idservidor
            );
            if ($cantServBdSist != 0) {
                throw new ZendExt_Exception('SEG010');
            }
            if (($cantServBdSist == 0)) {
                $serbd = new DatServidorbd();
                $serbd = Doctrine::getTable('DatServidorbd')->find($idservidor);
                $serbdm = new DatServidorbdModel();
                $serbdm->eliminarservbd($serbd);
                $serauth = new DatSerautenticacion();
                $serauthm = new DatSerautenticacionModel();
                $serauth->idservidor = $idservidor;
                $serauth->tservidor = $tipoServidor;
                $serauth->basedn = $cadenaconexion;
                $serauth->usuario = $user;
                $serauth->puerto = $puerto;
                $serauth->ssl = $chekssl;
                $serauth->tsl = $chektsl;
                if ($passw) {
                    $serauth->password = $passw;
                }
                $servidor = Doctrine::getTable('DatServidor')
                    ->find($idservidor);
                $servidor->descripcion = $descripcion;
                $servidor->denominacion = $denominacion;
                $servidor->tiposervidor = $tpservaux;
                $servidor->ip = $ip;
                $model->modificarservidor($servidor);
                //print_r($serauth);
                $serauthm->modificarservidor($serauth);
                $this->showMessage(
                    'El servidor de bases de datos ha sido '
                    . 'modificado satisfactoriamente.'
                );
            }
        } elseif (($tpservaux != $tiposerv) && ($tpservaux == 'bd')) {
            $cantServAutUser = SegUsuarioDatSerautenticacion::obtenercantservuser(
                $idservidor
            );
            if ($cantServAutUser > 0) {
                throw new ZendExt_Exception('SEG010');
            }
            if ($cantServAutUser == 0) {
                $serautenticacion = new DatSerautenticacion();
                $serautenticacion = Doctrine::getTable('DatSerautenticacion')
                    ->find($idservidor);
                $serautenticacionmodel = new DatSerautenticacionModel();
                $serautenticacionmodel->eliminarservauth($serautenticacion);
                $serbd = new DatServidorbd();
                $serbd->idservidor = $idservidor;
                $servidor = Doctrine::getTable('DatServidor')
                    ->find($idservidor);
                $servidor->descripcion = $descripcion;
                $servidor->denominacion = $denominacion;
                $servidor->tiposervidor = $tpservaux;
                $servidor->ip = $ip;
                $model->modificarservidor($servidor);
                $this->showMessage(
                    'El servidor de base de datos ha '
                    . 'sido modificado satisfactoriamente.'
                );
            }
        } else {
            if (($tpservaux == $tiposerv)
                && ($tpservaux == 'autenticaci&oacute;n')
            ) {
                $cantServBdSist = DatSistemaDatServidores::obtenercantservsistema(
                    $idservidor
                );
                if ($cantServBdSist != 0) {
                    throw new ZendExt_Exception('SEG010');
                }
                if (($cantServBdSist == 0)) {
                    $serauthm = new DatSerautenticacionModel();
                    $servidor = Doctrine::getTable('DatServidor')
                        ->find($idservidor);
                    $serauth = Doctrine::getTable('DatSerautenticacion')
                        ->find($idservidor);
                    $serauth->tservidor = $tipoServidor;
                    $serauth->basedn = $cadenaconexion;
                    $serauth->usuario = $user;
                    $serauth->puerto = $puerto;
                    $serauth->ssl = $chekssl;
                    $serauth->tsl = $chektsl;
                    if ($passw) {
                        $serauth->password = $passw;
                    }
                    $servidor->descripcion = $descripcion;
                    $servidor->denominacion = $denominacion;
                    $servidor->tiposervidor = $tpservaux;
                    $servidor->ip = $ip;

                    $serauth->objectclass = $objectClass;
                    $serauth->fnombre = $fnombre;
                    $serauth->fapellidos = $fapellidos;
                    $serauth->fusuario = $fusuario;

                    $model->modificarservidor($servidor);
                    $serauthm->modificarservidor($serauth);
                    $this->showMessage(
                        'El servidor de autenticaci&oacute;n ha '
                        . 'sido modificado satisfactoriamente.'
                    );
                }
            } elseif (($tpservaux == $tiposerv) && ($tpservaux == 'bd')) {
                $servidor = Doctrine::getTable('DatServidor')
                    ->find($idservidor);
                $servidor->descripcion = $descripcion;
                $servidor->denominacion = $denominacion;
                $servidor->tiposervidor = $tpservaux;
                $servidor->ip = $ip;
                $model->modificarservidor($servidor);
                $this->showMessage(
                    'El servidor de bases de datos ha '
                    . 'sido modificado satisfactoriamente.'
                );
            } elseif ($tpservaux == 'email') {
                $servemailm = new DatServidoremailModel();
                $servidor = Doctrine::getTable('DatServidor')
                    ->find($idservidor);
                $servemail = Doctrine::getTable('DatServidoremail')
                    ->find($idservidor);
                $servemail->fqdn = $fqdname;
                $servemail->usuario = $user;
                $servemail->puerto = $puerto;
                $servemail->ssl = $chekssl;
                $servemail->tsl = $chektsl;
                if ($passw) {
                    $servemail->password = $passw;
                }
                $servidor->descripcion = $descripcion;
                $servidor->denominacion = $denominacion;
                $servidor->tiposervidor = $tpservaux;
                $servidor->ip = $ip;
                $model->modificarservidor($servidor);
                $servemailm->modificarServidoremail($servemail);
                $this->showMessage(
                    'El servidor de correo electr&oacute;nico ha '
                    . 'sido modificado satisfactoriamente.'
                );
            } elseif ($tpservaux == 'xmpp') {
                $servxmppm = new DatServidorxmppModel();
                $servidor = Doctrine::getTable('DatServidor')
                    ->find($idservidor);
                $servxmpp = Doctrine::getTable('DatServidorxmpp')
                    ->find($idservidor);
                $servxmpp->fqdn = $fqdname;
                $servxmpp->usuario = $user;
                $servxmpp->puerto = $puerto;
                $servxmpp->ssl = $chekssl;
                $servxmpp->tsl = $chektsl;
                if ($passw) {
                    $servxmpp->password = $passw;
                }
                $servidor->descripcion = $descripcion;
                $servidor->denominacion = $denominacion;
                $servidor->tiposervidor = $tpservaux;
                $servidor->ip = $ip;
                $model->modificarservidor($servidor);
                $servxmppm->modificarServidorxmpp($servxmpp);
                $this->showMessage(
                    'El servidor de mensajer&iacute;a xmpp ha '
                    . 'sido modificado satisfactoriamente.'
                );
            }
        }
    }

    /**
     * @method comprobarservidorAction - Función usada para
     * eliminar servidores.
     */
    function comprobarservidorAction()
    {
        $arrayServ = json_decode(
            stripcslashes($this->_request->getPost('arrayServ'))
        );
        $arrayElim = array();
        foreach ($arrayServ as $servidor) {
            if (DatSerautenticacion::obtenercantidad($servidor) == 0
                && DatSistemaDatServidores::obtenercantservsistema($servidor) == 0
            ) {
                $arrayElim[] = $servidor;
            }
        }
        if (count($arrayServ) == count($arrayElim)) {
            DatServidor::elimirarServidores($arrayServ);
            $this->showMessage(
                'El (Los) servidor(es) ha(n) '
                . 'sido eliminado(s) satisfactoriamente.'
            );
        } elseif (count($arrayElim) > 0) {
            DatServidor::elimirarServidores($arrayElim);
            $this->showMessage(
                'Alg&uacute;n(os) servidor(es) seleccionado(s) '
                . 'no se puede(n) eliminar debido a que est&aacute;(n) en uso.'
            );
        } else {
            $this->showMessage(
                'Alg&uacute;n(os) servidor(es) seleccionado(s) '
                . 'no se puede(n) eliminar debido a que est&aacute;(n) en uso.'
            );
        }
    }

    /**
     * @method cargarservidoresAction - Función usada para
     * listar los servidores por lotes.
     */
    function cargarservidoresAction()
    {
        $objLim = $this->_request->getPost("limit");
        $objStart = $this->_request->getPost("start");
        $array = array('cantidad_filas' => DatServidor::obtenercantserv(),
            'datos' => DatServidor::cargarListadoServidores($objLim, $objStart));
        echo json_encode($array);
    }

    /**
     * @method probarConexionAction - Función usada para
     * verificar que se establescan las conecciones con el
     * servidor de autenticación que se quiere adicionar.
     */
    function probarConexionAction()
    {

        $dirCerts = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR
            . 'auth' . DIRECTORY_SEPARATOR;
        $rSA = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));

        /*$openldap = ($this->_request->getPost('openldap') == 'on')
            ? true
            : false;
        $baseDN = $this->_request->getPost('basedn');
        $passw = $rSA->decrypt($this->_request->getPost('passw'));
        $userDN = $this->_request->getPost('user');
        $puerto = $this->_request->getPost('puerto');
        //$chbssl = $this->_request->getPost('chbssl');
        $chbtsl = $this->_request->getPost('chbtsl');
        //$denominacion = $this->_request->getPost('denominacion');
        //$descripcion = $this->_request->getPost('descripcion');
        $host = $this->_request->getPost('ip');
        $password = $rSA->decrypt($this->_request->getPost('password'));
        $usuario = $this->_request->getPost('usuario');
        $arrayOptions = array();
        $acountDomainName = ($baseDN)
            ? self::createAccountDomainName($baseDN)
            : self::createAccountDomainName($userDN);
        $arrayOptions['host'] = $host;
        $arrayOptions['port'] = $puerto;
        $arrayOptions['accountDomainName'] = $acountDomainName;
        $arrayOptions['useStartTls'] = $chbtsl;
        //$arrayOptions['accountDomainNameShort'] = 
        //self::accountDomainNameShort($acountDomainName);
        $arrayOptions['baseDn'] = $baseDN;
        $arrayOptions['username'] = $userDN;
        $arrayOptions['password'] = $passw;
        $arrayOptions['optReferrals'] = true;
        $arrayOptions['bindRequiresDn'] = $openldap;
        if (self::AD_Autentication($arrayOptions, $usuario, $password)) {
            $this->showMessage('Conexión satisfactoria.');
        } else {
            throw new ZendExt_Exception('SEGSERV051');
        }*/

        $ipservidor = $this->_request->getPost("ip");
        $puerto = $this->_request->getPost("puerto");
        $user = $this->_request->getPost("usuario");
        $basedn = $this->_request->getPost('basedn');
        $acountDomainName = self::createAccountDomainName($this->_request->getPost('user'));
        $password = $rSA->decrypt($this->_request->getPost('password'));
        if (!$acountDomainName) {
            $acountDomainName = self::createAccountDomainName($basedn);
        }

        if ($this->_request->getPost("openldap") == "on") {
            $basedn = $this->_request->getPost('basedn');
            $tservidor = "openldap";
        } else {
            $basedn = self::createAccountDomainName($basedn);
            $tservidor = "ldap";
        }

        $conn = ldap_connect($ipservidor, $puerto);

        if ($conn) {
            ldap_set_option($conn, LDAP_OPT_PROTOCOL_VERSION, 3);
//            ldap_set_option(NULL, LDAP_OPT_DEBUG_LEVEL, 7);
            ldap_set_option($conn, LDAP_OPT_REFERRALS, 0);
            if ($tservidor == 'ldap') {
//                var_dump(ldap_bind($conn, $user . "@" . $acountDomainName, $password));die;
                if (ldap_bind($conn, $user . "@" . $acountDomainName, $password)) {
//                if (@ldap_sasl_bind($conn, null, $password,
//                    'DIGEST_MD5', NULL, $user . "@" . $acountDomainName)) {
                    $this->showMessage('Conexión satisfactoria.');
                } else {

                    throw new ZendExt_Exception('SEGSERV051');
                }
            } else {
                if (ldap_bind($conn, "uid=" . $user . "," . $basedn, $password)) {
                    $this->showMessage('Conexión satisfactoria.');
                } else {
                    throw new ZendExt_Exception('SEGSERV051');
                }
            }
        }
    }

    private static function AD_Autentication($arrayOptions, $user, $password)
    {
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
            throw new ZendExt_Exception(
                'SEGSERV051', new Exception($errorMessage)
            );
        }
        return true;
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

    /*private static function accountDomainNameShort($acountDomainName)
    {
        $acountDomainName = explode('.', $acountDomainName);

        return $acountDomainName[0];
    }*/

    private static function verificadatosservidor($denominacion)
    {
        $datosservidor = DatServidor::comprobardatosservidor($denominacion);
        if ($datosservidor) {
            return 1;
        } else {
            return 0;
        }
    }
//
//    public function cargarFiltroldapAction()
//    {
//        print_r("llega al controlador");die;
//        $datos = NomAtributosldap::getAll();
//
//
//    }

}
