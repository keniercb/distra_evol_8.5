<?php

/**
 * ZendExt_Crypt_Rsa
 *
 * Clase encargada de descifrar la informacion codificada por el sistema
 * a partir de los ficheros de configuracion.
 *
 * @author desconocido
 * @package ZendExt
 * @copyright UCID-ERP Cuba.
 * @version 1.0-0
 */
class ZendExt_Crypt_Rsa {

    /**
     * Configuracion definida en los ficheros del sistema
     *
     * @var ZendExt_Crypt_Rsa_Config
     */
    public $config;

    /**
     * Constructor de la clase
     *
     * @param ZendExt_Crypt_Rsa_Config $config - Configuracion definida en los ficheros del sistema.
     */
    public function __construct(ZendExt_Crypt_Rsa_Config $config) {
        $this->config = $config;
    }

    /**
     * Funcion encargada de desencriptar la informacion
     *
     * @param string $encrypted - Mensaje a desencriptar.
     * @return string , Mensaje desencriptado
     */
    public function decrypt($encrypted) {
        $rsa = new Zend_Crypt_Rsa(array('pemPath' => $this->config->privateKey, 'passPhrase' => $this->config->phrase));
        return $rsa->decrypt($encrypted, $rsa->getPrivateKey(), strtolower($this->config->algorithm));
    }
     
     /* Funcion encargada de encriptar la informacion
     *
     * @param string $encrypted - Mensaje a encriptar.
     * @return string , Mensaje encriptado
     */
    public function encrypt($encrypted) {
        $rsa = new Zend_Crypt_Rsa(array('pemPath' => $this->config->privateKey, 'passPhrase' => $this->config->phrase));
        return $rsa->encrypt($encrypted, $rsa->getPublicKey(), strtolower($this->config->algorithm));
    }



}
