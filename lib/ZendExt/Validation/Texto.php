<?php

class ZendExt_Validation_Texto
{

    public function __construct()
    {

    }

    static public function getInstance()
    {
        static $instance;
        if (!isset($instance)) {
            $instance = new self();
        }
        return $instance;
    }

    static public function Ascii($_text)
    {
        $_text = htmlentities($_text, ENT_QUOTES, 'UTF-8');
        $_text = trim(strtolower($_text));
        $patron = array(
            // Vocales
            //Acento invertido à,è,ì,ò,ù
            '/&agrave;/' => 'a',
            '/&egrave;/' => 'e',
            '/&igrave;/' => 'i',
            '/&ograve;/' => 'o',
            '/&ugrave;/' => 'u',
            //Acento comun á,é,í,ó,ú
            '/&aacute;/' => 'a',
            '/&eacute;/' => 'e',
            '/&iacute;/' => 'i',
            '/&oacute;/' => 'o',
            '/&uacute;/' => 'u',
            //Acento circunflujo ^ â,ê,î,ô,û
            '/&acirc;/'  => 'a',
            '/&ecirc;/'  => 'e',
            '/&icirc;/'  => 'i',
            '/&ocirc;/'  => 'o',
            '/&ucirc;/'  => 'u',
            //Tilde ~ ã,õ,
            '/&atilde;/' => 'a',
            '/&etilde;/' => 'e',
            '/&itilde;/' => 'i',
            '/&otilde;/' => 'o',
            '/&utilde;/' => 'u',
            //Acento diacritico ä,ë,ï,ö,ü
            '/&auml;/'   => 'a',
            '/&euml;/'   => 'e',
            '/&iuml;/'   => 'i',
            '/&ouml;/'   => 'o',
            '/&uuml;/'   => 'u',
            // Otras letras y caracteres especiales (å)            
            '/&aring;/'  => 'a',

            //Consonantes
            //Acento diacritico ÿ
            '/&yuml;/'   => 'y',
            //Acento comun ý
            '/&yacute;/' => 'y'
        );

        $_text = preg_replace(array_keys($patron), array_values($patron), $_text);
        return $_text;
    }

}

