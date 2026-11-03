<?php

/**
 * Created by PhpStorm.
 * User: ernesto
 * Date: 15/03/16
 * Time: 14:01
 */
class ServiceProviderController extends ZendExt_Controller_Secure
{
    /**
     * @method init() - Constructor de la clase.
     * @return void
     */
    public function init()
    {
        parent::init();
    }

    public function indexAction()
    {
        $state = array();
        $saml = ZendExt_SAML_Service::getInstance();
        $config = $saml->getGlogalConfiguration();
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $sp = $saml->getSpMetadataConfiguration(true);
        $idp = $sp->get('idp');
        $state['idp'] = $idp;
        $idp = $saml->getIdpMetadataConfiguration(false, $idp);
        $authreq = $saml->getAuthnRequest($sp, $idp);
        $authreq->setAssertionConsumerServiceURL($sp->get("assertionConsumerRoute"));
        $b = $saml->getBinding($authreq->getProtocolBinding());
        $stateId = $saml->generateId();
        $authreq->setId($stateId);
        $state["stateId"] = $stateId;
        if (!$securitySession->SP) {
            $securitySession->SP = array();
        }
        $securitySession->SP['RequestStore'][$stateId] = $state;
        Zend_Controller_Front::getInstance()->setResponse($saml->sendSAML2AuthnRequest($b, $authreq));
    }

    /**
     * @throws ZendExt_Exception
     * @throws Zend_Controller_Exception
     */
    public function acsAction()
    {

        session_regenerate_id(true);
        $request = $this->getRequest();
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $saml = ZendExt_SAML_Service::getInstance();
        $config = $saml->getGlogalConfiguration();
        $b = $saml->getCurrentBinding($request);
        $sigData = null;
        $response = $b->receive($request, $sigData);
        $stateId = $response->getInResponseTo();
        $idp = $response->getIssuer();
        if ($idp === NULL) {
            throw new ZendExt_Exception("SEGSAML002");
        }
        $stateData = $securitySession->SP['RequestStore'];
        if (isset($stateData[$stateId])) {
            $state = $stateData[$stateId];
            if ($idp !== $state['idp']) {
                throw new ZendExt_Exception("SEGSAML004");
            }
        } else {
            $state = array(
                'isUnsolicited' => TRUE,
                'relayState' => $response->getRelayState(),
            );
        }
        $spMetadata = $saml->getSpMetadataConfiguration(true);
        $idpMetadata = $saml->getIdpMetadataConfiguration(false, $idp);

        if ($idpMetadata === NULL) {
            throw new ZendExt_Exception("SEGSAML003");
        }
        $r = $saml->processResponse($spMetadata, $idpMetadata, $response);
        if(!is_object($r)){
            header("Location:/seguridad/index.php/serviceprovider/index");
        }
        $authenticatingAuthority = $r->getAuthenticatingAuthority();
        $att = array();
        foreach ($r->getAttributes() as $key => $value) {
            $att[$key] = $value[0];
        }

        $nameId = $r->getNameId();
        $sessionIndex = $r->getSessionIndex();
        $expire = $r->getSessionNotOnOrAfter();

        $logoutState = array(
            'idP' => $idpMetadata->getEntityId(),
            'nameID' => $nameId,
            'sessionIndex' => $sessionIndex,
        );
        $securitySession->SP['logoutState'] = $logoutState;
        unset($stateData[$stateId]);
        $securitySession->SP['RequestStore'] = $stateData;

        $objSegUsuario = new SegUsuario();
        $user = $objSegUsuario->getUserByUsername($att['username']);
        if ($user->count() > 0) {
            $service = new SeguridadProxyService();
            $userData = $user->toArray()[0];
            $userData['certificado'] = $service->madeCertificateData($_SERVER['REMOTE_ADDR'], $userData['idusuario'], $userData['nombreusuario']);
            $userData['dinamico'] = array();
            $userData['usuario'] = $userData['nombreusuario'];
            $userData['contrasenna'] =  (new ZendExt_RSA_Facade())->encrypt($userData['contrasenna']);
            $userData['authnInstant'] = $r->getAuthnInstant();
            $sessionDuration = $config['sessionDuration'] ?: 8 * 60 * 60;
            $userData['Expire'] = $r->getAuthnInstant() + $sessionDuration;
            foreach($userData as $key=>$value){
                $att[$key] = $value;
            }
            $securitySession->SP['authData'] = $att;
            $nameId = $r->getNameId();
            $nameId['Format'] = 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient';
            $nameId['SPNameQualifier'] = 'splocal';


            $sessionIndex = $r->getSessionIndex();
            //$expire = $r->getSessionNotOnOrAfter();

            $logoutState = array(
                'idP' => $idpMetadata->getEntityId(),
                'nameID' => $nameId,
                'sessionIndex' => $sessionIndex,
            );
            $securitySession->SP['logoutState'] = $logoutState;
            $securitySession->SP['RequestStore'] = $stateData;
            $response = new Zend_Controller_Response_Http();
            $response->setRedirect("/portal/");
            Zend_Controller_Front::getInstance()->setResponse($response);
        } else {
            throw new ZendExt_Exception('EP020');
        }
    }

    public function sloAction()
    {
        session_regenerate_id(true);
        $request = $this->getRequest();
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $saml = ZendExt_SAML_Service::getInstance();
        $config = $saml->getGlogalConfiguration();
        $binding = $saml->getCurrentBinding($request);
        $sigData = null;
        $request = $binding->receive($request, $sigData);
        $sp = $saml->getSpMetadataConfiguration(true);
        $spEntityId = $sp->get('entityId');
        $idpEntityId = $request->getIssuer();
        if ($idpEntityId === NULL) {
            throw new ZendExt_Exception("SEGSAML002");
        }
        $idp = $saml->getIdpMetadataConfiguration(false, $idpEntityId);
        if ($idp === NULL) {
            throw new ZendExt_Exception("SEGSAML003");
        }
        $signRequired = $idp->get('signSloMessage', NULL);
        if ($signRequired === NULL)
            $signRequired = $sp->get('signSloMessage', false);
        if (!$signRequired || $saml->validateMessage($request, $sigData, $idp)) {
            $isLogoutResponse = $saml->isLogoutResponse($request);
            if ($isLogoutResponse === 1) {
                $relayState = $request->getRelayState();
                if ($relayState === NULL) {
                    throw new ZendExt_Exception('SEGSAML008');
                }

                if (!$request->isSuccess()) {
                    throw new ZendExt_Exception('SEGSAML005');
                }
                $this->doLogout();
                $response = new Zend_Controller_Response_Http();
                $response->setRedirect("/portal/");
                Zend_Controller_Front::getInstance()->setResponse($response);
            } else if ($isLogoutResponse === 2) {
                $saml->decryptNameId($request, $idp, $sp);
                $state = array(
                    'requestId' => $request->getId(),
                    'relayState' => $request->getRelayState()
                );
                $nameId = $request->getNameId();
                $sessionIndexes = $request->getSessionIndexes();
                $this->doLogout();
                $numLoggedOut = count($sessionIndexes);
                $lr = $saml->getLogoutResponse($sp, $idp, $state);
                Zend_Controller_Front::getInstance()->setResponse(
                    $saml->sendLogoutMessage($lr, $sp, $idp)
                );
            }
        } else {
            throw new ZendExt_Exception("SEGSAML001");
        }
    }

    public function logoutAction()
    {
        $securitySession = new Zend_Session_Namespace('Quarseg');
        if ($securitySession->SP['logoutState']) {
            $saml = ZendExt_SAML_Service::getInstance();
            $config = $saml->getGlogalConfiguration();
            $logoutState = $securitySession->SP['logoutState'];
            //print_r($logoutState);
            if ($logoutState) {
                $idp = $logoutState['idP'];
                $nameId = $logoutState['nameID'];
                $sessionIndex = $logoutState['sessionIndex'];
                $stateId = $saml->generateId();
                $securitySession->SP['logoutState']['logoutRequest'] = $stateId;
                $idp = $saml->getIdpMetadataConfiguration(false, $idp);
                $sp = $saml->getSpMetadataConfiguration(true);

                $logoutRequest = $saml->getLogoutRequest($sp, $idp);
                $logoutRequest->setId($stateId);
                $logoutRequest->setNameId($nameId);
                $logoutRequest->setSessionIndex($sessionIndex);
                $logoutRequest->setRelayState($stateId);

                $encryptNameId = $idp->get('nameIdEncryption', NULL);
                if ($encryptNameId === NULL) {
                    $encryptNameId = $sp->get('nameIdEncryption', FALSE);
                }
                if ($encryptNameId) {
                    $logoutRequest->encryptNameId($saml->getEncryptionKey($idp));
                }
                $securitySession->unsetAll();
                Zend_Controller_Front::getInstance()->setResponse($saml->sendLogoutMessage($logoutRequest, $sp, $idp));
            }
        }
    }

    private function doLogout()
    {
        $securitySession = new Zend_Session_Namespace('Quarseg');
        $securitySession->__unset('SP');
    }

}
