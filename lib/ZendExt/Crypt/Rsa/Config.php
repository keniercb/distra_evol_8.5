<?php

class ZendExt_Crypt_Rsa_Config
{

    /**
     * Clave publica
     *
     * @var string
     */
    public $publicKey;

    /**
     *  Clave privada
     *
     * @var string
     */
    public $privateKey;

    /**
     * Certificado digital
     *
     * @var string
     */
    public $certificate;

    /**
     * Frase
     *
     * @var string
     */
    public $phrase;

    /**
     * Algoritmo de encriptacion
     *
     * @var string
     */
    public $algorithm;

    /**
     * Constructor de la clase
     *
     * @param string $configDirectory - Direccion en el sistema de los ficheros de configuracion.
     * @param string $configFileName - Nombre del fichero que contiene la configuracion dle sistema
     * por omision es rsa.ini
     */
    //TODO Arreglar en el codigo la linea referente al certificado 
    public function __construct($configDirectory, $configFileName = 'rsa.ini')
    {
        $config = new Zend_Config_Ini($configDirectory . $configFileName);
        $this->privateKey = $configDirectory . $config->files->privateKey;
        $this->publicKey = $configDirectory . $config->files->publicKey;
        $this->cert = $configDirectory . $config->files->cert;
        $this->phrase = $config->config->phrase;
        $this->algorithm = $config->config->algorithm;
    }

}
