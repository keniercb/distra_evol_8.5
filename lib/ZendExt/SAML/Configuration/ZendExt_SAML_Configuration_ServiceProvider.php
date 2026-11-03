<?php
use SAML2\Configuration\CertificateProvider;
use SAML2\Configuration\DecryptionProvider;
use SAML2\Configuration\EntityIdProvider;

class ZendExt_SAML_Configuration_ServiceProvider implements
    CertificateProvider,
    DecryptionProvider,
    EntityIdProvider
{
    /**
     * @var array
     */
    private $configuration;

    /**
     * @param array $configuration
     */
    public function __construct(array $configuration)
    {
        $this->configuration = $configuration;
    }

    public function get($key, $defaultValue = null)
    {
        if (!$this->has($key)) {
            return $defaultValue;
        }

        return $this->configuration[$key];
    }

    public function has($key)
    {
        return array_key_exists($key, $this->configuration);
    }
    public function getKeys()
    {
        return $this->get('keys');
    }

    public function getCertificateData()
    {
        return $this->get('certificateData');
    }

    public function getCertificateFile()
    {
        return $this->get('certificateFile');
    }

    public function getCertificateFingerprints()
    {
        return $this->get('certificateFingerprints');
    }

    public function getEntityId()
    {
        return $this->get('entityId');
    }

    public function isAssertionEncryptionRequired()
    {
        return $this->get('assertionEncryptionEnabled');
    }

    public function getSharedKey()
    {
        return $this->get('sharedKey');
    }

    public function getPrivateKey($name, $required = false)
    {
        $privateKeys = $this->get('privateKeys');
        $key         = array_filter($privateKeys, function (PrivateKey $key) use ($name) {
            return $key->getName() === $name;
        });

        $keyCount = count($key);
        if ($keyCount !== 1 && $required) {
            throw new \RuntimeException(sprintf(
                'Attempted to get privateKey by name "%s", found "%d" keys, where only one was expected. Please '
                . 'verify that your configuration is correct',
                $name,
                $keyCount
            ));
        }

        if (!$keyCount) {
            return null;
        }

        return array_pop($key);
    }

    public function getBlacklistedAlgorithms()
    {
        return $this->get('blacklistedEncryptionAlgorithms', array(XMLSecurityKey::RSA_1_5));
    }
}
