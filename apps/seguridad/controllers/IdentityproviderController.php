<?php

/**
 * Created by PhpStorm.
 * User: ernesto
 * Date: 15/03/16
 * Time: 14:04
 */
class IdentityproviderController extends ZendExt_Controller_Secure
{
    private $data;

    public function ssoAction()
    {
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $saml = ZendExt_SAML_Service::getInstance();
        $config = $saml->getGlogalConfiguration();
        $idpMetadata = $saml->getIdpMetadataConfiguration(true);
        $request = $this->getRequest();
        $binding = $saml->getCurrentBinding($request);
        $sigData = null;
        $request = $binding->receive($request,$sigData);
        $spEntityId = $request->getIssuer();
        if ($spEntityId === NULL) {
            /* Without an issuer we have no way to respond to the message. */
            throw new ZendExt_Exception("SEGSAML002");
        }
        $spMetadata = $saml->getSpMetadataConfiguration(false,$spEntityId);
        if ($spMetadata === NULL) {
            throw new ZendExt_Exception("SEGSAML003");
        }
        $signRequired = $idpMetadata->get('signAuthnRequest',NULL);
        if($signRequired === NULL)
            $signRequired = $spMetadata->get('signAuthnRequest',false);
        if(!$signRequired || $saml->validateMessage($request,$sigData,$spMetadata)) {
            $relayState = $request->getRelayState();
            $requestId = $request->getId();
            $IDPList = $request->getIDPList();
            $proxyCount = $request->getProxyCount();
            if ($proxyCount !== null)
                $proxyCount--;
            $requesterID = $request->getRequesterID();
            $forceAuthn = $request->getForceAuthn();
            $isPassive = $request->getIsPassive();
            $consumerURL = $request->getAssertionConsumerServiceURL();
            $protocolBinding = $request->getProtocolBinding();
            $consumerIndex = $request->getAssertionConsumerServiceIndex();
            $extensions = $request->getExtensions();
            $nameIdPolicy = $request->getNameIdPolicy();
            if (isset($nameIdPolicy['Format'])) {
                $nameIDFormat = $nameIdPolicy['Format'];
            } else {
                $nameIDFormat = null;
            }
            if (isset($nameIdPolicy['AllowCreate'])) {
                $allowCreate = $nameIdPolicy['AllowCreate'];
            } else {
                $allowCreate = FALSE;
            }

            $supportedBindings = $saml->getIdpSuportedBindings($idpMetadata);

            $acsEndpoint = $saml->getAssertionConsumerService($supportedBindings,$spMetadata, $consumerURL, $protocolBinding, $consumerIndex);
            $IDPList = array_unique(array_merge($IDPList, $spMetadata->get('IDPList', array())));
            if ($proxyCount == null) $proxyCount = $spMetadata->get('proxyCount', null);

            if (!$forceAuthn) {
                $forceAuthn = $spMetadata->get('forceAuthn', FALSE);
            }

            $state = array(
                'SPEntityId' => $spEntityId,
                'relayState' => $relayState,
                'requestId' => $requestId,
                'IDPList' => $IDPList,
                'proxyCount' => $proxyCount,
                'requesterID' => $requesterID,
                'forceAuthn' => $forceAuthn,
                'isPassive' => $isPassive,
                'consumerURL' => $acsEndpoint['location'],
                'binding' => $acsEndpoint['binding'],
                'nameIDFormat' => $nameIDFormat,
                'allowCreate' => $allowCreate,
                'extensions' => $extensions,
            );
            if(!$securitySession->IDP)
                $securitySession->IDP = array();
            if(!$this->processAuthenticationRequest($state,$config)){
                $securitySession->IDP['AuthState'][$requestId] = $state;
                $this->redirectToLogin($requestId);
            }else{
                $securitySession->IDP['AuthState'][$requestId] = $state;
                Zend_Controller_Front::getInstance()->setResponse($this->sendResponse($requestId));
            }
        }else{
            throw new ZendExt_Exception("SEGSAML001");
        }
    }

    public function sloAction(){
        $request = $this->getRequest();
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $saml = ZendExt_SAML_Service::getInstance();
        $config = $saml->getGlogalConfiguration();
        $binding = $saml->getCurrentBinding($request);
        $sigData = null;
        $request = $binding->receive($request,$sigData);
        $idpMetadata = $saml->getIdpMetadataConfiguration(true);

        $spEntityId = $request->getIssuer();
        if ($spEntityId === NULL) {
            /* Without an issuer we have no way to respond to the message. */
            throw new ZendExt_Exception("SEGSAML002");
        }
        $spMetadata = $saml->getSpMetadataConfiguration(false,$spEntityId);
        if ($spMetadata === NULL) {
            throw new ZendExt_Exception("SEGSAML003");
        }
        $signRequired = $idpMetadata->get('signSloMessage',NULL);
        if($signRequired === NULL)
            $signRequired = $spMetadata->get('signSloMessage',false);
        if(!$signRequired || $saml->validateMessage($request,$sigData,$spMetadata)){
            $isLogoutResponse = $saml->isLogoutResponse($request);
            if($isLogoutResponse === 1) {
                $statsData = array(
                    'spEntityID' => $spEntityId,
                    'idpEntityID' => $idpMetadata->get('entityId'),
                );
                if (!$request->isSuccess()) {
                    $statsData['error'] = $request->getStatus();
                }
                $relayState = $request->getRelayState();
                Zend_Controller_Front::getInstance()->setResponse(
                    $this->onLogoutResponse($spEntityId,$relayState,$spMetadata,$idpMetadata,$statsData['error'])
                );
            }else if($isLogoutResponse === 2){
                $spStatsId = $spMetadata->get('core:statistics-id', $spEntityId);
                $state = array(
                    'spEntityId' => $spEntityId,
                    'relayState' => $request->getRelayState(),
                    'requestId' => $request->getId(),
                );
                $this->terminateAssociation($spEntityId);
                $state["logoutRemaining"] =  $securitySession->IDP['Association'];
                if($securitySession->IDP['AuthData']){
                    unset($securitySession->IDP['AuthData']);
                    $stateId = $saml->generateId();
                    Zend_Controller_Front::getInstance()->setResponse(
                        $this->logoutNextSP($state,$spMetadata,$idpMetadata,$stateId)
                    );
                }
            }
        }else{
            throw new ZendExt_Exception("SEGSAML001");
        }
    }

    public function metadataAction(){
        $metadata = SamlServicesAdapter::getIdpMetadataConfiguration($this->samlconfiguration->surfnet_saml);
        $metadataFactory = SamlServicesAdapter::getMetadataFactory(
            $this->view,$this->router,SamlServicesAdapter::getSigningService(SamlServicesAdapter::getKeyLoader(),SamlServicesAdapter::getPrivateKeyLoader()),$metadata
        );
        $this->view->disable();
        return new XMLResponse($metadataFactory->generate());

    }

    public function loginAction(){
        $this->view->captcha = $this->getRequest()->get("id_captcha");
        $this->view->stateId = $this->getRequest()->get("stateId");
        $this->view->error = $this->getRequest()->get("error");
        $this->view->url_login = "authenticate";
        $this->render();
    }

    public function checkcertificateAction () {
        $objCache = ZendExt_Cache::getInstance();
        $idCache = "seguridad_checkcertificate";
        $utils = new ZendExt_OpenSSLUtils();
        $cert = $_REQUEST['certificate'];
        if(!$_REQUEST['data']) {
            $certState = $utils->OCSPRequest($cert);
            if ($certState == "good") {
                $secret = $this->generateRandomString();
                $objCache->save($secret, $idCache);
                $signData = "";
                openssl_public_encrypt($secret, $signData, openssl_get_publickey($cert));
                file_put_contents(DIR_ABS_MT."session/client_cert.pem", $cert);
                file_put_contents(DIR_ABS_MT."session/s_cert.pem", $_SERVER['SSL_SERVER_CERT']);
                $serverPubKey = shell_exec("openssl x509 -pubkey -noout -in ".DIR_ABS_MT."session/s_cert.pem");
                unlink(DIR_ABS_MT."session/s_cert.pem");
                echo json_encode(array("error" => 0, "data" => base64_encode($signData), "s_cert" => $serverPubKey));
            } else if($certState == "revoked" || $certState == "unknown") {
                echo json_encode(array("error" => 1, "data" => "Certificado revocado o desconocido."));
            } else {
                echo json_encode(array("error" => 1, "data" => "Certificado invalido."));
            }
        } else {
            $rsa = new ZendExt_RSA_Facade();
            $encData = base64_decode($_REQUEST['data']);
            $secret = $objCache->load($idCache);
            $objCache->remove($idCache);
            $decData = "";
            $cert_location = parse_ini_file(DIR_ABS_MT.'config/certs/server/certificate.ini')['cert_location'];
            $privateKeyName = parse_ini_file(DIR_ABS_MT.'config/certs/server/certificate.ini')['privateKey'];
            $passPhrase = parse_ini_file(DIR_ABS_MT.'config/certs/server/certificate.ini')['passPhrase'];
            $passPhrase = $passPhrase != '' ? $rsa->decrypt($passPhrase) : '';
            $privateKey = openssl_pkey_get_private("file://".$cert_location.$privateKeyName, $passPhrase);
            openssl_private_decrypt($encData, $decData, $privateKey);
            if($decData == $secret){
                $client_cert = file_get_contents(DIR_ABS_MT."session/client_cert.pem");
                unlink(DIR_ABS_MT."session/client_cert.pem");
                echo json_encode(array("error" => 0, "username" => $utils->SubjectFromX509($client_cert), "password" => $utils->SkiFromX509($client_cert)));
            } else {
                echo json_encode(array("error" => 1, "data" => "Handshake fallido."));
            }
        }
    }

    public function authenticateAction(){
        $result = $this->loginCheck();
        if($result["SUCCESS"]){
            $session = new Zend_Session_Namespace('Zeolides');
            $securitySession = new Zend_Session_Namespace('Quarseg');
            $session->certificado = $securitySession->SP['authData']['certificado'];
            Zend_Controller_Front::getInstance()->setResponse($this->sendResponse());
        }else{
            $this->redirectToLogin($this->getRequest()->get('stateId'),$result['ERROR']);
        }
    }

    private function loginCheck()
    {
        $securitySession = new Zend_Session_Namespace('Quarseg');
        if (isset($securitySession->IDP['AuthData']))
            return array("SUCCESS"=>true);
        $request = $this->getRequest();
        if($this->validateCaptcha($request->get("id_captcha"),$request->get("captchabox"))){
            $dirCerts = substr($_SERVER['DOCUMENT_ROOT'], 0, strrpos($_SERVER['DOCUMENT_ROOT'], 'web')) . 'config/certs/auth/';
            $rsaCert = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
            $RSA = new ZendExt_RSA_Facade();
            $integrator = ZendExt_IoC::getInstance();

            $password = $rsaCert->decrypt($request->get('password'));
            if($request->get('cert')){
                $autheData = $integrator->seguridad->AutenticarUsuarioCertificado(
                    $request->get('username'), $RSA->encrypt($password)
                );
            } else {
                $autheData = $integrator->seguridad->AutenticarUsuario(
                    $request->get('username'), $RSA->encrypt($password)
                );
            }
            if($autheData['SUCCESS']) {
                ZendExt_IoC::getInstance()->seguridad->ejecutarAccionesAnteViolacionIntegridadFichero();
                ZendExt_IoC::getInstance()->seguridad->ejecutarComprobacionAutomaticaIntegridadFichero();
                $saml = ZendExt_SAML_Service::getInstance();
                $config = $saml->getGlogalConfiguration();
                $autheData['Profile']['passw'] = $RSA->encrypt($password);
                $autheData['Profile']['certificado'] = $autheData['Token'];
                $autheData['Profile']['authnInstant'] = time();
                $sessionDuration = $config['sessionDuration'] ? $config['sessionDuration'] : 8 * 60 * 60;
                $maxSessionExpire = time() + $sessionDuration;
                $autheData['Profile']['Expire'] = $maxSessionExpire;
                $securitySession->IDP['AuthData'] = $autheData['Profile'];
            }
            return $autheData;
        }
        return array("ERROR"=>"Captcha incorrecto");

    }

    private function processAuthenticationRequest(array &$state, $config) {

        if (isset($state['SPMetadata']['entityId'])) {
            $spEntityId = $state['SPMetadata']['entityId'];
        }else {
            $spEntityId = NULL;
        }

        if (isset($state['forceAuthn']) && (bool)$state['forceAuthn']) {
            $needAuth = TRUE;
        } elseif (isset($state['IDPList']) && sizeof($state['IDPList']) > 0) {
            $needAuth = !in_array($this->getIDP(), $state['IDPList'], TRUE);
        } else {
            $needAuth = !$this->isAuthenticated();
        }

        if ($needAuth) {
             return false;
        } else {
             $this->reauthenticate($state);
             return true;
        }

    }

    private function sendResponse($localStateId = null){
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $stateId = $this->getRequest()->get('stateId');
        if(!$localStateId && !$securitySession->IDP['AuthState'][$stateId]) {
//            throw new ZendExt_Exception("SEGSAML009");
            header("Location: portal/");
            return null;
        }
        $state = !$localStateId ? $securitySession->IDP['AuthState'][$stateId] : $securitySession->IDP['AuthState'][$localStateId];
        $authData = $securitySession->IDP['AuthData'];
        $state['Profile'] = array();
        foreach($authData as $key=>$value){
            $state['Profile'][$key] = array($value);
        }
        $saml = ZendExt_SAML_Service::getInstance();
        $config = $saml->getGlogalConfiguration();
        $spMetadata = $saml->getSpMetadataConfiguration(false,$state['SPEntityId']);
        $spEntityId = $spMetadata->getEntityId();

        $requestId = $state['requestId'];
        $relayState = $state['relayState'];
        $consumerURL = $state['consumerURL'];
        $protocolBinding = $state['binding'];
        $idpMetadata = $saml->getIdpMetadataConfiguration(true);
        $assertion = $saml->getAssertion($idpMetadata, $spMetadata, $config, $state);
        if (isset($state['authenticatingAuthority'])) {
            $assertion->setAuthenticatingAuthority($state['authenticatingAuthority']);
        }
        /* Create the session association (for logout). */
        $association = array(
            'id' => $spEntityId,
            'Expires' => $assertion->getSessionNotOnOrAfter(),
            'entityId' => $spEntityId,
            'nameId' => $state['nameId'],
            'sessionIndex' => $assertion->getSessionIndex()
        );
        $assertion = $saml->encryptAssertion($idpMetadata, $spMetadata, $assertion);

        /* Create the response. */
        $ar = $saml->getResponse($idpMetadata, $spMetadata, $consumerURL);
        $ar->setInResponseTo($requestId);
        $ar->setRelayState($relayState);
        $ar->setAssertions(array($assertion));

        /* Register the session association with the IdP. */
        $this->addAssociation($association);

        $binding = $saml->getBinding($protocolBinding);
        return $binding->send($ar);
    }

    private function isAuthenticated(){
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $authdata = $securitySession->IDP['AuthData'];
        if($authdata !== NULL){
            return true;
        }
        return false;
    }

    private function getIDP(){
//        $authdata = $this->session->get('IDPAuthData');
//        if($authdata !== NULL){
//            return $authdata['idp'];
//        }
        return NULL;
    }

    private function sendLogoutResponse($idpMetadata,$state){
        $saml = ZendExt_SAML_Service::getInstance();
        $config = $saml->getGlogalConfiguration();
        $spMetadata = $saml->getSpMetadataConfiguration(false,$state["spEntityId"]);
        $logoutResponse = $saml->getLogoutResponse($idpMetadata,$spMetadata,$state);
        return $saml->sendLogoutMessage($logoutResponse,$idpMetadata,$spMetadata);
    }

    private function onLogoutResponse($assocId, $relayState,$spMetadata,$idpMetadata, $error){
        $securitySession = new Zend_Session_Namespace('Quarseg');
        if ($relayState === NULL) {
            throw new ZendExt_Exception('SEGSAML010');
        }

        $state = $securitySession->IDP['AuthState'];
        $state = $state[$relayState];

        if ($error === NULL) {
            $this->terminateAssociation($assocId);
        } else {
            $state['core:Failed'] = TRUE;
        }
        return $this->logoutNextSP($state,$spMetadata,$idpMetadata,$relayState);
    }

    private function logoutNextSP(&$state,$spMetadata,$idpMetadata,$relayState){

        $securitySession = new Zend_Session_Namespace('Quarseg');
        $saml = ZendExt_SAML_Service::getInstance();
        $config = $saml->getGlogalConfiguration();
        $association = array_pop($state['logoutRemaining']);
        if (!isset($relayState)) {
            $relayState = $state['stateId'];
        }
        $securitySession->IDP['AuthState'][$relayState] = $state;
        if ($association === NULL) {
            $securitySession->__unset('IDP');
            return $this->sendLogoutResponse($idpMetadata,$state);
        }else {
            $id = $association['id'];
            try {
                $spMetadata = $saml->getSpMetadataConfiguration(false,$id);
                $request = $saml->getLogoutRequest($idpMetadata, $spMetadata);
                $request->setRelayState($relayState);
                $request->setSessionIndex($association['sessionIndex']);
                $request->setNameId($association['nameId']);
                $assertionLifetime = $spMetadata->get('assertionLifetime', NULL);
                if ($assertionLifetime === NULL) {
                    $assertionLifetime = $idpMetadata->get('assertionLifetime', 300);
                }
                $request->setNotOnOrAfter(time() + $assertionLifetime);
                $encryptNameId = $spMetadata->get('nameIdEncryption', NULL);
                if ($encryptNameId === NULL) {
                    $encryptNameId = $idpMetadata->get('nameIdEncryption', FALSE);
                }
                if ($encryptNameId) {
                    $request->encryptNameId($saml->getEncryptionKey($spMetadata));
                }
                return $saml->sendLogoutMessage($request, $idpMetadata, $spMetadata);

            } catch (Exception $e) {
                $this->terminateAssociation($id);
                $state['core:Failed'] = TRUE;
                return $this->logoutNextSP($state, $spMetadata, $idpMetadata, $relayState);
            }
        }
    }

    private function addAssociation($association){
        $securitySession = new Zend_Session_Namespace('Quarseg');
        if(!$securitySession->IDP['Association'])
            $securitySession->IDP['Association'] = array();
        $securitySession->IDP['Association'][$association['id']] = $association;
    }

    private function terminateAssociation($id){
        $securitySession = new Zend_Session_Namespace('Quarseg');
        if($securitySession->IDP['Association'][$id])
            unset($securitySession->IDP['Association'][$id]);
    }

    private function reauthenticate(&$state){
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $securitySession->IDP['AuthState'] = $state;
    }

    private function redirectToLogin($stateId = null,$error = null){
        $response = new Zend_Controller_Response_Http();
        $url = "/seguridad/index.php/identityprovider/login";
        $idCaptcha = $this->generateCaptcha();
        $params = array();
        if($idCaptcha)
            $params["id_captcha"]=$idCaptcha;
        if($stateId)
            $params["stateId"]=$stateId;
        if($stateId)
            $params["error"]=$error;
        $template = Zend_Registry::getInstance()->config->dir_aplication."/../config/xml/saml/templates/post.tpl";
        $classview = new ZendExt_Templates_h2o($template);
        $plantilla = $classview->render(array('url'=>$url,'data'=>$params));
        $response = new Zend_Controller_Response_Http();
        $response->setBody($plantilla);
        Zend_Controller_Front::getInstance()->setResponse($response);
    }

    /**
     * Método para utilización de captcha. Genera session, crea la imagen y devuelve el id.
     *
     * @return string Identificador del captcha generado.
     */
    private function generateCaptcha()
    {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini($register->config->security_config, 'captcha');
        if($config->enabled=="on"){
            $bgColor = $config->bgColor;
            $dotNoiseColor = $config->dotNoiseColor;
            $lineNoiseColor = $config->lineNoiseColor;
            $textColor = $config->textColor;
            $captcha = new ZendExt_Captcha_Image();
            $captcha->setTimeout($config->timeout)
                ->setWordLen($config->wordLen)
                ->setDotNoiseColor($config->$dotNoiseColor)
                ->setLineNoiseColor($config->$lineNoiseColor)
                ->setBgColor($config->$bgColor)
                ->setTextColor($config->$textColor)
                ->setWidth($config->width)
                ->setDotNoiseLevel($config->dotNoiseLevel)
                ->setLineNoiseLevel($config->lineNoiseLevel)
                ->setHeight($config->height)
                ->setFont($_SERVER['DOCUMENT_ROOT'] . $config->dirFont . $config->activeFont)
                ->setFontSize($config->fontSize)
                ->setImgDir($_SERVER['DOCUMENT_ROOT'] . $config->dirCaptcha);
            $captcha->generate();
            if(file_exists($_SERVER['DOCUMENT_ROOT'] . $config->dirCaptcha.$captcha->getId().'.png')){
                return $captcha->getId();
            }else{
                throw new ZendExt_Exception('STD08');
            }
        }else{
            return null;
        }

    }

    /**
     * Valida el captcha
     *
     * @param string $idCaptcha - Id del captcha.
     * @param string $captchaBox - Texto captcha introducido por el usuario.
     * @return boolean
     */
    private function validateCaptcha($idCaptcha, $captchaBox)
    {
        $register = Zend_Registry::getInstance();
        $config = new Zend_Config_Ini($register->config->security_config, 'captcha');
        if($config->enabled=="off")
            return true;
        $captchaSession = new Zend_Session_Namespace('Zend_Form_Captcha_' . $idCaptcha);
        $captchaIterator = $captchaSession->getIterator();
        unlink($_SERVER['DOCUMENT_ROOT'] . $config->dirCaptcha . $idCaptcha . '.png');
        if ($captchaBox != $captchaIterator['word'])
            return false;
        return true;
    }

    private function generateRandomString ($length = 50) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        $this->data = $randomString;
        return $randomString;
    }
}
