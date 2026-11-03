<?php

/**
 * ZendExt_RSA_Facade
 * Configurador de la aplicacion
 * 
 * @author Darien Garc�a Tejo
 * @package ZendExt
 * @subpackage ZendExt_RSA
 * @copyright UCID - ERP Cuba
 * @version 1.0-0
 */
class ZendExt_RSA_Facade {

    /**
     * Constructor de la clase.
     */
    public function __construct() {
        
    }

    /**
     * Funcion encargada de encriptar la informacion.
     *
     * @param string $string - Mensaje a encriptar.
     * @return string , Mensaje encriptado
     */
    function encrypt($string) {
        $RSA = new ZendExt_RSA();
        $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
        $encoded = $RSA->encrypt($string, $keys[1], $keys[0], 3);
        return $encoded;
    }

    /**
     * Funcion encargada de desencriptar la informacion.
     *
     * @param string $encoded - Mensaje a desencriptar.
     * @return string , Mensaje desencriptado
     */
    function decrypt($encoded) {
        $RSA = new ZendExt_RSA();
        $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
        $decoded = $RSA->decrypt($encoded, $keys[2], $keys[0]);
        return $decoded;
    }

    /**
     * Funcion encargada de encriptar la informacion a partir de la clave publica suministrada.
     *
     * @param string $string - Mensaje a encriptar.
     * @param string $pub_key - Clave publica
     * @return string , Mensaje encriptado
     */
    function myencrypt($string, $pub_key) {
        $RSA = new ZendExt_RSA();
        $encoded = $RSA->encrypt($string, $pub_key[1], $pub_key[0], 3);
        return $encoded;
    }

    /**
     * Funcion encargada de desencriptar la informacion a partir de la clave privada suministrada.
     *
     * @param string $encoded - Mensaje a desencriptar.
     * @param string $priv_key - Clave privada
     * @return string , Mensaje desencriptado
     */
    function mydecrypt($encoded, $priv_key) {
        $RSA = new ZendExt_RSA();
        $decoded = $RSA->decrypt($encoded, $priv_key[1], $priv_key[0]);
        return $decoded;
    }

    /**
     * Funcion encargada de realizar la firma digital
     *
     * @param string $message - Mensaje que se desea firmar digitalmente.
     * @return string , Firma digital
     */
    function signMessage($message) {
        $RSA = new ZendExt_RSA();
        $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
        $signature = $RSA->sign($message, $keys[2], $keys[0]);
        return $signature;
    }

    /**
     * Funcion encargada de comprobar la validez de la firma digital.
     *
     * @param string $message - Mensaje firmado digitalmente.
     * @param string $signature - Firma digital
     * @return boolean , Resultado de la correspondencia de la firma con el mensaje
     */
    function proveMessage($message, $signature) {
        $RSA = new ZendExt_RSA();
        $keys = $RSA->generate_keys('9990454949', '9990450271', 0);
        $response = $RSA->prove($message, $signature, $keys[1], $keys[0]);
        return $response;
    }

    /**
     * Funcion encargada de realizar la firma digital
     *
     * @param string $message - Mensaje que se desea firmar digitalmente.
     * @param string $priv_key - Clave privada
     * @return string , Firma digital
     */
    function mysignMessage($message, $priv_key) {
        $RSA = new ZendExt_RSA();
        $signature = $RSA->sign($message, $priv_key[1], $priv_key[0]);
        return $signature;
    }

    /**
     * Funcion encargada de comprobar la validez de la firma digital.
     *
     * @param string $message - Mensaje firmado digitalmente.
     * @param string $signature - Firma digital
     * @return boolean , Resultado de la correspondencia de la firma con el mensaje
     */
    function myproveMessage($message, $signature, $pub_key) {
        $RSA = new ZendExt_RSA();
        $response = $RSA->prove($message, $signature, $pub_key[1], $pub_key[0]);
        return $response;
    }

}
