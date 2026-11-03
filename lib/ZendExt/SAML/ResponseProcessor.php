<?php

class ZendExt_SAML_ResponseProcessor {
    /**
     * @var \Psr\Log\LoggerInterface
     */
    private $logger;

    /**
     * @var SAML2_Response_Validation_PreconditionValidator
     */
    private $preconditionValidator;

    /**
     * @var SAML2_Signature_Validator
     */
    private $signatureValidator;

    /**
     * @var SAML2_Certificate_KeyLoader
     *
     */
    private $keyLoader;

    /**
     * @var SAML2_Assertion_Processor
     */
    private $assertionProcessor;

    /**
     * Indicates whether or not the response was signed. This is required in order to be able to check whether either
     * the reponse or one of its assertions was signed
     *
     * @var bool
     */
    private $responseIsSigned = FALSE;

    /**
     * @param \Psr\Log\LoggerInterface        $logger
     *
     */
    public function __construct(\Psr\Log\LoggerInterface $logger)
    {
        $this->logger = $logger;

        $this->signatureValidator = new \SAML2\Signature\Validator($logger);
        $this->keyLoader = new \SAML2\Certificate\KeyLoader();
    }

    /**
     * @param \SAML2_Configuration_ServiceProvider  $serviceProviderConfiguration
     * @param \SAML2_Configuration_IdentityProvider $identityProviderConfiguration
     * @param \SAML2_Configuration_Destination      $currentDestination
     * @param \SAML2_Response                       $response
     * @param array                                $signData
     *
     * @return SAML2_Assertion[] Collection (SAML2_Utilities_ArrayCollection) of SAML2_Assertion objects
     */
    public function process(
        \SAML2\Configuration\ServiceProvider $serviceProviderConfiguration,
        \SAML2\Configuration\IdentityProvider $identityProviderConfiguration,
        \SAML2\Configuration\Destination $currentDestination,
        \SAML2\Response $response,
        array $signData = null
    ) {
        $this->preconditionValidator = new \SAML2\Response\Validation\PreconditionValidator($currentDestination);
        $this->assertionProcessor = \SAML2\Assertion\ProcessorBuilder::build(
            $this->logger,
            $this->signatureValidator,
            $currentDestination,
            $identityProviderConfiguration,
            $serviceProviderConfiguration,
            $response
        );

        $this->enforcePreconditions($response);
        $this->verifySignature($response, $signData, $identityProviderConfiguration);
        return $this->processAssertions($response);
    }

    /**
     * Checks the preconditions that must be valid in order for the response to be processed.
     *
     * @param SAML2_Response $response
     */
    private function enforcePreconditions(\SAML2\Response $response)
    {
        $result = $this->preconditionValidator->validate($response);

        if (!$result->isValid()) {
            throw SAML2\Response\Exception\PreconditionNotMetException::createFromValidationResult($result);
        }
    }

    /**
     * @param SAML2_Response                       $response
     * @param SAML2_Configuration_IdentityProvider $identityProviderConfiguration
     */
    private function verifySignature(
        \SAML2\Response $response,
        $signData ,
        \SAML2\Configuration\IdentityProvider $identityProviderConfiguration
    ) {
        if (!$response->isMessageConstructedWithSignature() && !isset($signData)) {
            $this->logger->info(sprintf(
                'SAMLResponse with id "%s" was not signed at root level, not attempting to verify the signature of the'
                . ' reponse itself',
                $response->getId()
            ));

            return;
        }

        $this->logger->info(sprintf(
            'Attempting to verify the signature of SAMLResponse with id "%s"',
            $response->getId()
        ));

        $this->responseIsSigned = TRUE;

        if(isset($signData)){
            $keys = $this->keyLoader->extractPublicKeys($identityProviderConfiguration);
            $x509Keys = $keys->filter(function (\SAML2\Certificate\Key $key) {
                return $key instanceof \SAML2\Certificate\X509;
            });
            $valid = false;

            foreach ($x509Keys as $key) {
                $publickey = new RobRichards\XMLSecLibs\XMLSecurityKey(
                    RobRichards\XMLSecLibs\XMLSecurityKey::RSA_SHA1, array('type' => 'public')
                );
                $key->loadKey($key->getCertificate());
                if ($this->validateSignature($signData, $publickey)) {
                    $valid = true;
                    break;
                }
            }
            if(!$valid)
                throw new \SAML2\Response\Exception\InvalidResponseException();
        }else {
            if (!$this->signatureValidator->hasValidSignature($response, $identityProviderConfiguration)) {
                throw new \SAML2\Response\Exception\InvalidResponseException();
            }
        }
    }

    /**
     * @param SAML2_Response $response
     *
     * @return SAML2_Assertion[]
     */
    private function processAssertions(\SAML2\Response $response)
    {
        if($response instanceof \SAML2\LogoutResponse){
            return $this->assertionProcessor->processAssertions([]);
        }
        $assertions = $response->getAssertions();
        if (empty($assertions)) {
            throw new \SAML2\Response\Exception\NoAssertionsFoundException('No assertions found in response from IdP.');
        }

        if (!$this->responseIsSigned) {
            foreach ($assertions as $assertion) {
                if (!$assertion->getWasSignedAtConstruction()) {
                    throw new \SAML2\Response\Exception\UnsignedResponseException(
                        'Both the response and the assertion it containes are not signed.'
                    );
                }
            }
        }
        return $this->assertionProcessor->processAssertions($assertions);
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
}
