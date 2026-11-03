<?php

use Psr\Log\LoggerInterface;
use RobRichards\XMLSecLibs\XMLSecurityKey;
use SAML2\Response;
use Psr\Log\NullLogger;
use SAML2\Assertion;

class ZendExt_SAML_Service
{

    private $globalConfiguration = null;

    private $privateKeyLoader = null;

    private $keyLoader = null;

    private static $instance = null;

    private function __construct($configuration)
    {
        $register = Zend_Registry::getInstance();

        $dirModulesConfig = $register->config->yml->saml;
        $data = @file_get_contents($dirModulesConfig);
        if (!$data)
            throw new ZendExt_Exception("SEGSAML011");
        $this->globalConfiguration = Doctrine_Parser::load($data, 'yml');
        $this->privateKeyLoader = new SAML2\Certificate\PrivateKeyLoader();
        $this->keyLoader = new SAML2\Certificate\KeyLoader();
    }

    public static function getInstance()
    {
        if (!self::$instance) {
            self::$instance = new self();
            return self::$instance;
        } else
            return self::$instance;
    }

    public function getGlogalConfiguration()
    {
        return $this->globalConfiguration;
    }

    public function getIdpMetadataConfiguration($hosted, $entityId = null)
    {
        $config = null;
        if ($hosted) {
            $config = $this->globalConfiguration['seguridad']['hosted']['identity_provider'];
            if (isset($config['privateKeys'])) {
                foreach ($config['privateKeys'] as $key => $value) {
                    $config["privateKeys"][$key] = new SAML2\Configuration\PrivateKey(
                        $this->resolveCertPath((string)$value), (string)$key
                    );
                }
            }
        } else {
            $config = $this->globalConfiguration['seguridad']['remote']['identity_providers'][$entityId];
        }
        if (isset($config['certificateFile'])) {
            $config['certificateFile'] = $this->resolveCertPath($config['certificateFile']);
        }
        if (isset($config)) {
            $metadata = new SAML2\Configuration\IdentityProvider($config);
            return $metadata;
        } else {
            return NULL;
        }
    }

    public function getSpMetadataConfiguration($hosted, $entityId = null)
    {
        $config = null;
        if ($hosted) {
            $config = $this->globalConfiguration['seguridad']['hosted']['service_provider'];
            if (isset($config['privateKeys'])) {
                foreach ($config['privateKeys'] as $key => $value) {
                    $config["privateKeys"][$key] = new SAML2\Configuration\PrivateKey(
                        $this->resolveCertPath((string)$value), (string)$key
                    );
                }
            }
        } else {
            $config = $this->globalConfiguration['seguridad']['remote']['service_providers'][$entityId];
        }
        if (isset($config['certificateFile'])) {
            $config['certificateFile'] = self::resolveCertPath($config['certificateFile']);
        }
        if (isset($config)) {
            $metadata = new SAML2\Configuration\ServiceProvider($config);
            return $metadata;
        } else {
            return NULL;
        }
    }

//    public function getMetadataFactory(
//        View $templateEngine,
//        Router $router,
//        SigningService $signingService,
//        MetadataConfiguration $metadataConfiguration
//    )
//    {
//        return new MetadataFactory($templateEngine, $router, $signingService, $metadataConfiguration);
//    }

    public function getSamlAuthenticationLogger(LoggerInterface $logger)
    {
        return new SamlAuthenticationLogger($logger);
    }

    public function getBridgeContainer(LoggerInterface $logger)
    {
        return new BridgeContainer($logger);
    }

    public function getCurrentBinding(Zend_Controller_Request_Http $request)
    {
        return ZendExt_SAML_Binding::getCurrentBinding($request);
    }

    public function getBinding($protocol)
    {
        return ZendExt_SAML_Binding::getBinding($protocol);
    }

    public function getAuthnRequest(
        SAML2\Configuration\ServiceProvider  $spMetadata,
        SAML2\Configuration\IdentityProvider $idpMetadata
    )
    {
        $authreq = new SAML2\AuthnRequest();

        if ($spMetadata->has('nameIDPolicy')) {
            $nameIdPolicy = $spMetadata->get('nameIDFormat', SAML2\Constants::NAMEID_TRANSIENT);
        } else {
            $nameIdPolicy = NULL;
        }

        if ($nameIdPolicy !== NULL) {
            $authreq->setNameIdPolicy(array(
                'Format' => $nameIdPolicy,
                'AllowCreate' => TRUE,
            ));
        }

        $authreq->setForceAuthn($spMetadata->get('forceAuthn', FALSE));
        $authreq->setIsPassive($spMetadata->get('isPassive', FALSE));
        $protocolbinding = $spMetadata->get('protocolBinding', SAML2\Constants::BINDING_HTTP_POST);
        $authreq->setProtocolBinding($protocolbinding);
        $authreq->setIssuer($spMetadata->getEntityId());
        $authreq->setDestination($idpMetadata->get("singleSignOnService"));

        $signRequired = $spMetadata->get('signAuthnRequest', NULL);
        if ($signRequired === NULL)
            $signRequired = $idpMetadata->get('signAuthnRequest', false);
        if ($signRequired)
            $this->addSign($spMetadata, $idpMetadata, $authreq);

        return $authreq;

    }

    public function getSignatureValidator()
    {
        $logger = new NullLogger();
        return new SAML2\Signature\Validator($logger);
    }

    public function validateMessage(
        SAML2\SignedElement                     $signedElement, $sigData,
        SAML2\Configuration\CertificateProvider $configuration
    )
    {
        if (!isset($sigData)) {
            $validator = $this->getSignatureValidator();
            return $validator->hasValidSignature($signedElement, $configuration);
        } else {
            $keys = $this->keyLoader->extractPublicKeys($configuration);
            $x509Keys = $keys->filter(function (\SAML2\Certificate\Key $key) {
                return $key instanceof \SAML2\Certificate\X509;
            });
            foreach ($x509Keys as $key) {
                $publickey = new RobRichards\XMLSecLibs\XMLSecurityKey(
                    RobRichards\XMLSecLibs\XMLSecurityKey::RSA_SHA1, array('type' => 'public')
                );
                $publickey->loadKey($key->getCertificate());
                if ($this->validateSignature($sigData, $publickey)) {
                    return true;
                }
            }
            return false;
        }
    }

    public function getResponse(
        SAML2\Configuration\IdentityProvider $idpMetadata,
        SAML2\Configuration\ServiceProvider  $spMetadata,
                                             $consumerURL
    )
    {
        $r = new SAML2\Response();

        $r->setIssuer($idpMetadata->get('entityId'));
        $r->setDestination($consumerURL);

        $signRequired = $idpMetadata->get('signResponse', NULL);
        if ($signRequired === NULL)
            $signRequired = $spMetadata->get('signResponse', false);
        if ($signRequired)
            $this->addSign($idpMetadata, $spMetadata, $r);

        return $r;
    }

    public function getAssertion(
        SAML2\Configuration\IdentityProvider $idpMetadata,
        SAML2\Configuration\ServiceProvider  $spMetadata,
                                             $config, &$state
    )
    {
        $a = new SAML2\Assertion();
        $signRequired = $idpMetadata->get('signAssertion', NULL);

        if ($signRequired === NULL)
            $signRequired = $spMetadata->get('signAssertion', false);
        if ($signRequired) {
            $this->addSign($idpMetadata, $spMetadata, $a);
        }
        $a->setIssuer($idpMetadata->get('entityId'));
        $a->setValidAudiences(array($spMetadata->get('entityId')));
        $a->setNotBefore(time() - 30);
        $assertionLifetime = $spMetadata->get('assertionLifetime', NULL);
        if ($assertionLifetime === NULL) {
            $assertionLifetime = $idpMetadata->get('assertionLifetime', 300);
        }
        $a->setNotOnOrAfter(time() + $assertionLifetime);
        if (isset($state['authnContextClassRef'])) {
            $a->setAuthnContext($state['authnContextClassRef']);
        } else {
            $a->setAuthnContext(SAML2\Constants::AC_PASSWORD);
        }
        $a->setAuthnInstant($state['Profile']['authnInstant'][0]);
        $sessionLifetime = $config['saml']['sessionDuration'] ? $config['saml']['sessionDuration'] : 8 * 60 * 60;
        $a->setSessionNotOnOrAfter(time() + $sessionLifetime);
        $a->setSessionIndex(SAML2\Utils::getContainer()->generateId());

        $sc = new SAML2\XML\saml\SubjectConfirmation();
        $sc->SubjectConfirmationData = new SAML2\XML\saml\SubjectConfirmationData();
        $sc->SubjectConfirmationData->NotOnOrAfter = time() + $assertionLifetime;
        $sc->SubjectConfirmationData->Recipient = $state['consumerURL'];
        $sc->SubjectConfirmationData->InResponseTo = $state['requestId'];

        /* ProtcolBinding of SP's <AuthnRequest> overwrites IdP hosted metadata configuration. */
        $hokAssertion = NULL;
        if ($state['binding'] === SAML2\Constants::BINDING_HOK_SSO) {
            $hokAssertion = TRUE;
        }
        if ($hokAssertion === NULL) {
            $hokAssertion = $idpMetadata->get('saml20.hok.assertion', FALSE);
        }

        if ($hokAssertion) {
            /* TODO Holder-of-Key */
            $sc->Method = SAML2\Constants::CM_HOK;
//            if (SimpleSAML\Utilities::isHTTPS()) {
//                if (isset($_SERVER['SSL_CLIENT_CERT']) && !empty($_SERVER['SSL_CLIENT_CERT'])) {
//                    /* Extract certificate data (if this is a certificate). */
//                    $clientCert = $_SERVER['SSL_CLIENT_CERT'];
//                    $pattern = '/^-----BEGIN CERTIFICATE-----([^-]*)^-----END CERTIFICATE-----/m';
//                    if (preg_match($pattern, $clientCert, $matches)) {
//                        /* We have a client certificate from the browser which we add to the HoK assertion. */
//                        $x509Certificate = new SAML2\XML\ds\X509Certificate();
//                        $x509Certificate->certificate = str_replace(array("\r", "\n", " "), '', $matches[1]);
//
//                        $x509Data = new SAML2\XML\ds\X509Data();
//                        $x509Data->data[] = $x509Certificate;
//
//                        $keyInfo = new SAML2\XML\ds\KeyInfo();
//                        $keyInfo->info[] = $x509Data;
//
//                        $sc->SubjectConfirmationData->info[] = $keyInfo;
//                    } //else throw new SimpleSAML_Error_Exception('Error creating HoK assertion: No valid client certificate provided during TLS handshake with IdP');
//                } //else throw new SimpleSAML_Error_Exception('Error creating HoK assertion: No client certificate provided during TLS handshake with IdP');
//            } //else throw new SimpleSAML_Error_Exception('Error creating HoK assertion: No HTTPS connection to IdP, but required for Holder-of-Key SSO');
        } else {
            /* Bearer */
            $sc->Method = SAML2\Constants::CM_BEARER;
        }
        $a->setSubjectConfirmation(array($sc));

        if ($spMetadata->get('samlAttributes', TRUE)) {
            $attributeNameFormat = self::getAttributeNameFormat($idpMetadata, $spMetadata);
            $a->setAttributeNameFormat($attributeNameFormat);
            $attributes = self::encodeAttributes($idpMetadata, $spMetadata, $state['Profile']);
            $a->setAttributes($attributes);
        }
        if (isset($state['nameIdFormat'])) {
            $nameIdFormat = $state['nameIdFormat'];
        } else {
            $nameIdFormat = "urn:oasis:names:tc:SAML:2.0:nameid-format:transient";
        }

        if ($nameIdFormat === NULL || !isset($state['nameId'][$nameIdFormat])) {
            /* Either not set in request, or not set to a format we supply. Fall back to old generation method. */
            $nameIdFormat = $spMetadata->get('nameIDFormat', 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient');
        }

        if (isset($state['nameId'][$nameIdFormat])) {
            $nameId = $state['nameId'][$nameIdFormat];
            $nameId['Format'] = $nameIdFormat;
        } else {
            $spNameQualifier = $spMetadata->get('spNameQualifier', NULL);
            if ($spNameQualifier === NULL) {
                $spNameQualifier = $spMetadata->get('entityId');
            }

            if ($nameIdFormat === SAML2\Constants::NAMEID_TRANSIENT) {
                /* generate a random id */
                $nameIdValue = SAML2\Utils::getContainer()->generateId();
            } else {
                /* this code will end up generating either a fixed assigned id (via nameid.attribute)
                   or random id if not assigned/configured */
                $nameIdValue = $this->generateNameIdValue($idpMetadata, $spMetadata, $state);

                if ($nameIdValue === NULL) {
                    $nameIdFormat = SAML2\Constants::NAMEID_TRANSIENT;
                    $nameIdValue = SAML2\Utils::getContainer()->generateId();
                }
            }

            $nameId = array(
                'Format' => $nameIdFormat,
                'Value' => $nameIdValue,
                'SPNameQualifier' => $spNameQualifier,
            );
        }
        $state['nameId'] = $nameId;
        $a->setNameId($nameId);

        $encryptNameId = (bool)$spMetadata->get('nameIdEncryption', FALSE);
        if (!$encryptNameId) {
            $encryptNameId = (bool)$idpMetadata->get('nameIdEncryption', FALSE);
        }
        if ($encryptNameId) {
            $a->encryptNameId($this->getEncryptionKey($spMetadata));
        }


        return $a;
    }

    public function getIssuerFromAssertions(SAML2\Response $response)
    {
        foreach ($response->getAssertions() as $a) {
            if ($a instanceof SAML2\Assertion) {
                $idp = $a->getIssuer();
                break;
            }
        }
        if ($idp === NULL) {
            throw new Exception('Missing <saml:Issuer> in message delivered to AssertionConsumerService.');
        }
        return $idp;
    }

    public function getLogoutRequest($srcMetadata, $dstMetadata)
    {
        $lr = new SAML2\LogoutRequest();
        $lr->setIssuer($srcMetadata->get('entityId'));

        $signRequired = $srcMetadata->get('signSloMessage', NULL);
        if ($signRequired === NULL)
            $signRequired = $dstMetadata->get('signSloMessage', false);
        if ($signRequired)
            $this->addSign($srcMetadata, $dstMetadata, $lr);

        return $lr;
    }

    public function getLogoutResponse($srcMetadata, $dstMetadata, $state)
    {
        $lr = new SAML2\LogoutResponse();
        $lr->setIssuer($srcMetadata->get('entityId'));
        $lr->setInResponseTo($state['requestId']);
        $lr->setRelayState($state['relayState']);

        if (isset($state['core:Failed']) && $state['core:Failed']) {
            $lr->setStatus(array(
                'Code' => SAML2\Constants::STATUS_SUCCESS,
                'SubCode' => SAML2\Constants::STATUS_PARTIAL_LOGOUT,
            ));
        }
        $signRequired = $srcMetadata->get('signSloMessage', NULL);
        if ($signRequired === NULL)
            $signRequired = $dstMetadata->get('signSloMessage', false);
        if ($signRequired)
            $this->addSign($srcMetadata, $dstMetadata, $lr);

        return $lr;
    }

    public function sendLogoutMessage($logoutMesagge, $srcMetadata, $dstMetadata)
    {
        $dst = $this->getLogoutDefaultEndpoint(
            $dstMetadata,
            array(SAML2\Constants::BINDING_HTTP_REDIRECT, SAML2\Constants::BINDING_HTTP_POST),
            SAML2\Constants::BINDING_HTTP_POST
        );

        $logoutMesagge->setDestination($dst['location']);
        $b = $this->getBinding($dst['binding']);
        return $b->send($logoutMesagge);
    }

    public function isLogoutResponse($message)
    {
        if ($message instanceof SAML2\LogoutResponse)
            return 1;
        else if ($message instanceof SAML2\LogoutRequest)
            return 2;
    }

    public function encryptAssertion(
        SAML2\Configuration\IdentityProvider $idpMetadata,
        SAML2\Configuration\ServiceProvider  $spMetadata,
        SAML2\Assertion                      $assertion
    )
    {

        $encryptAssertion = $spMetadata->get('assertionEncryption', NULL);
        if ($encryptAssertion === NULL) {
            $encryptAssertion = $idpMetadata->get('assertionEncryption', FALSE);
        }
        if (!$encryptAssertion) {
            /* We are _not_ encrypting this assertion, and are therefore done. */
            return $assertion;
        }

        $key = $this->getEncryptionKey($spMetadata);
        $ea = new SAML2\EncryptedAssertion();
        $ea->setAssertion($assertion, $key);
        return $ea;
    }

    public function decryptNameId(
        \SAML2\Message $msg, \SAML2\Configuration\DecryptionProvider $src, \SAML2\Configuration\DecryptionProvider $dst
    )
    {
        if (!$msg->isNameIdEncrypted()) {
            return $msg;
        }

        $decryptionKeys = $this->privateKeyLoader->loadDecryptionKeys($src, $dst);
        $blacklistedKeys = $src->getBlacklistedAlgorithms();
        if (is_null($blacklistedKeys)) {
            $blacklistedKeys = $dst->getBlacklistedAlgorithms();
        }

        foreach ($decryptionKeys as $index => $key) {
            try {
                $msg->decryptNameId($key, $blacklistedKeys);
            } catch (\Exception $e) {

            }
        }

        if ($msg->isNameIdEncrypted()) {
            throw new ZendExt_Exception('SEGSAML006');
        }

        return $msg;
    }

    public function getAssertionConsumerService(
        array $supportedBindings, $spMetadata,
              $assertionConsumerServiceURL, $protocolBinding, $assertionConsumerServiceIndex
    )
    {
        $bindings = $spMetadata->get('assertionConsumerService');
        $firstNotFalse = NULL;
        $firstFalse = NULL;
        foreach ($bindings as $ep) {

            if ($assertionConsumerServiceURL !== NULL && $ep['location'] !== $assertionConsumerServiceURL) {
                continue;
            }
            if ($protocolBinding !== NULL && $ep['binding'] !== $protocolBinding) {
                continue;
            }
            if ($assertionConsumerServiceIndex !== NULL && $ep['index'] !== $assertionConsumerServiceIndex) {
                continue;
            }

            if (!in_array($ep['binding'], $supportedBindings, TRUE)) {
                /* The endpoint has an unsupported binding. */
                continue;
            }

            /* We have an endpoint that matches all our requirements. Check if it is the best one. */

            if (array_key_exists('isDefault', $ep)) {
                if ($ep['isDefault'] === TRUE) {
                    /* This is the first matching endpoint with isDefault set to TRUE. */
                    return $ep;
                }
                /* isDefault is set to FALSE, but the endpoint is still useable. */
                if ($firstFalse === NULL) {
                    /* This is the first endpoint that we can use. */
                    $firstFalse = $ep;
                }
            } else if ($firstNotFalse === NULL) {
                /* This is the first endpoint without isDefault set. */
                $firstNotFalse = $ep;
            }
        }

        if ($firstNotFalse !== NULL) {
            return $firstNotFalse;
        } elseif ($firstFalse !== NULL) {
            return $firstFalse;
        }
    }

    public function getIdpSuportedBindings($idpMetadata)
    {
        $supportedBindings = array(SAML2\Constants::BINDING_HTTP_POST, SAML2\Constants::BINDING_HTTP_REDIRECT);
        if ($idpMetadata->get('samlSendArtifact', FALSE)) {
            $supportedBindings[] = SAML2\Constants::BINDING_HTTP_ARTIFACT;
        }
        if ($idpMetadata->get('samlHokAssertion', FALSE)) {
            $supportedBindings[] = SAML2\Constants::BINDING_HOK_SSO;
        }
        return $supportedBindings;

    }

    public static function getResponseError(SAML2\StatusResponse $response)
    {

        $status = $response->getStatus();
        return new sspmod_saml_Error($status['Code'], $status['SubCode'], $status['Message']);
    }

    private function addSign(
        SAML2\Configuration\CertificateProvider $srcMetadata,
        SAML2\Configuration\CertificateProvider $dstMetadata, SAML2\SignedElement $element
    )
    {
        $key = $srcMetadata->getPrivateKey("default");
        $keyloader = new SAML2\Certificate\PrivateKeyLoader();
        $key = $keyloader->loadPrivateKey($key);

        $certArray = SAML2\Certificate\KeyLoader::extractPublicKeys($srcMetadata);

        $algo = $dstMetadata->get('signatureAlgorithm', NULL);
        if ($algo === NULL) {
            $algo = $srcMetadata->get('signatureAlgorithm', XMLSecurityKey::RSA_SHA1);
        }

        $privateKey = new XMLSecurityKey($algo, array('type' => 'private'));
        $privateKey->passphrase = $key->getPassphrase();
        $privateKey->loadKey($key->getKeyAsString(), FALSE);

        $element->setSignatureKey($privateKey);

        if ($certArray === NULL) {
            /* We don't have a certificate to add. */
            return;
        }
        $element->setCertificates(array($certArray->first()->getCertificate()));
    }

    public function getEncryptionKey(SAML2\Configuration\CertificateProvider $dstMetadata)
    {
        $sharedKey = $dstMetadata->get('sharedKey', NULL);
        $key = null;
        if ($sharedKey !== NULL) {
            $key = new XMLSecurityKey(XMLSecurityKey::AES128_CBC);
            $key->loadKey($sharedKey);
        } else {
            $certArray = SAML2\Certificate\KeyLoader::extractPublicKeys($dstMetadata);
            foreach ($certArray as $publicKey) {
                if ($publicKey instanceof SAML2\Certificate\X509) {
                    $key = new XMLSecurityKey(XMLSecurityKey::RSA_OAEP_MGF1P, array('type' => 'public'));
                    $key->loadKey($publicKey->getCertificate());
                } else {
                    throw new ZendExt_Exception('SEGSAML007');
                }
            }
        }
        return $key;
    }

    private function resolveCertPath($name)
    {
        $keyDirs = $this->globalConfiguration['seguridad']['hosted']['keysDir'];
        return $_SERVER['DOCUMENT_ROOT'] . '/../' . $keyDirs . '/' . $name;
    }

    private static function getAttributeNameFormat(
        SAML2\Configuration\IdentityProvider $idpMetadata,
        SAML2\Configuration\ServiceProvider  $spMetadata
    )
    {

        /* Try SP metadata first. */
        $attributeNameFormat = $spMetadata->get('attributesNameFormat', NULL);
        if ($attributeNameFormat !== NULL) {
            return $attributeNameFormat;
        }
        $attributeNameFormat = $idpMetadata->get('attributeNameFormat', NULL);
        if ($attributeNameFormat !== NULL) {
            return $attributeNameFormat;
        }

        /* Default. */
        return 'urn:oasis:names:tc:SAML:2.0:attrname-format:basic';
    }

    private function validateSignature(array $data, \RobRichards\XMLSecLibs\XMLSecurityKey $key)
    {
        $query = $data['Query'];
        $sigAlg = $data['SigAlg'];
        $signature = $data['Signature'];

        $signature = base64_decode($signature);

        if ($key->type !== XMLSecurityKey::RSA_SHA1) {
            throw new \Exception('Invalid key type for validating signature on query string.');
        }
        if ($key->type === XMLSecurityKey::RSA_SHA1 && $sigAlg !== $key->type) {
            $key = \SAML2\Utils::castKey($key, $sigAlg);
        }
        return $key->verifySignature($query, $signature);
    }

    private function generateNameIdValue(SAML2\Configuration\IdentityProvider $idpMetadata,
                                         SAML2\Configuration\ServiceProvider  $spMetadata, array &$state)
    {

        $attribute = $spMetadata->get('nameIdAttribute', NULL);
        if ($attribute === NULL) {
            $attribute = $idpMetadata->get('nameIdAttribute', NULL);
            if ($attribute === NULL) {
                $attributeValue = $state['userId'];
                $idpEntityId = $idpMetadata->get('entityId');
                $spEntityId = $spMetadata->get('entityId');

                $secretSalt = $this->globalConfiguration['seguridad']['hosted']['secretSalt'];

                $uidData = 'uidhashbase' . $secretSalt;
                $uidData .= strlen($idpEntityId) . ':' . $idpEntityId;
                $uidData .= strlen($spEntityId) . ':' . $spEntityId;
                $uidData .= strlen($attributeValue) . ':' . $attributeValue;
                $uidData .= $secretSalt;

                return hash('sha1', $uidData);
            }
        }

        $attributes = $state['Profile'];

        if (!array_key_exists($attribute, $attributes)) {
            SimpleSAML_Logger::error('Unable to add NameID: Missing ' . var_export($attribute, TRUE) .
                ' in the attributes of the user.');
            return NULL;
        }

        return $attributes[$attribute][0];
    }

    private static function encodeAttributes(
        SAML2\Configuration\IdentityProvider $idpMetadata,
        SAML2\Configuration\ServiceProvider  $spMetadata,
        array                                $attributes
    )
    {

        $base64Attributes = $spMetadata->get('base64Attributes', NULL);
        if ($base64Attributes === NULL) {
            $base64Attributes = $idpMetadata->get('base64Attributes', FALSE);
        }

        if ($base64Attributes) {
            $defaultEncoding = 'base64';
        } else {
            $defaultEncoding = 'string';
        }

        $srcEncodings = $idpMetadata->get('attributeEncodings', array());
        $dstEncodings = $spMetadata->get('attributeEncodings', array());
        $encodings = array_merge($srcEncodings, $dstEncodings);

        $ret = array();
        foreach ($attributes as $name => $values) {
            $ret[$name] = array();
            if (array_key_exists($name, $encodings)) {
                $encoding = $encodings[$name];
            } else {
                $encoding = $defaultEncoding;
            }
            foreach ($values as $value) {
                $ret[$name][] = self::encodeAttribute($encoding, $value);
            }
        }
        return $ret;
    }

    private static function encodeAttribute($encoding, $value)
    {
        switch ($encoding) {
            case 'string':
                $value = (string)$value;
                break;
            case 'base64':
                $value = base64_encode((string)$value);
                break;
            case 'raw':
                if (is_string($value)) {
                    $doc = new DOMDocument();
                    $doc->loadXML('<root>' . $value . '</root>');
                    $value = $doc->firstChild->childNodes;
                }
                assert('$value instanceof DOMNodeList');
                break;
        }
        return $value;
    }

    private function getLogoutDefaultEndpoint($dst, $bindings, $default)
    {

        $endpoints = $dst->get('singleLogoutService');
        if (!is_array($endpoints)) {
            return array('binding' => $default, 'location' => $endpoints);
        }
        $defaultEndpoint = $this->getDefaultEndpoint($endpoints, $bindings);
        if ($defaultEndpoint !== NULL) {
            return $defaultEndpoint;
        }
    }

    private function getDefaultEndpoint(array $endpoints, array $bindings = NULL)
    {

        $firstNotFalse = NULL;
        $firstAllowed = NULL;

        foreach ($endpoints as $i => $ep) {
            if ($bindings !== NULL && !in_array($ep['binding'], $bindings, TRUE)) {
                continue;
            }

            if (array_key_exists('isDefault', $ep)) {
                if ($ep['isDefault'] === TRUE) {
                    return $ep;
                }
                if ($firstAllowed === NULL) {
                    $firstAllowed = $ep;
                }
            } else {
                if ($firstNotFalse === NULL) {
                    $firstNotFalse = $ep;
                }
            }
        }

        if ($firstNotFalse !== NULL) {
            return $firstNotFalse;
        }

        return $firstAllowed;
    }

    public function sendSAML2AuthnRequest(SamlBinding $binding, SAML2\AuthnRequest $ar)
    {
        return $binding->send($ar);
    }

    public function processResponse(
        SAML2\Configuration\ServiceProvider  $serviceProviderConfiguration,
        SAML2\Configuration\IdentityProvider $identityProviderConfiguration,
        SAML2\Response                       $response,
                                             $signData
    )
    {
        $logger = new NullLogger();
        $procesor = new ZendExt_SAML_ResponseProcessor($logger);
        $assertion = $procesor->process(
            $serviceProviderConfiguration,
            $identityProviderConfiguration,
            new SAML2\Configuration\Destination($serviceProviderConfiguration->get("assertionConsumerRoute")),
            $response,
            $signData
        );
        if (count($assertion)) {
            return $assertion->getOnlyElement();
        }
    }

    public function generateID()
    {
        return SAML2\Utils::getContainer()->generateId();
    }
}