<?php

use SAML2\Constants;

abstract class ZendExt_SAML_Binding {
    protected $destination;

    public static function getBinding($urn)
    {
        switch ($urn) {
            case Constants::BINDING_HOK_SSO:
            case Constants::BINDING_HTTP_POST:
                return new ZendExt_SAML_HTTPPost();
            case Constants::BINDING_HTTP_REDIRECT:
                return new ZendExt_SAML_HTTPRedirect();
            default:
                throw new Exception('Unsupported binding: ' . var_export($urn, TRUE));
        }
    }

    public static function getCurrentBinding(Zend_Controller_Request_Http $request)
    {
        switch ($request->getMethod()) {
            case 'GET':
                if ($request->get('SAMLRequest') || $request->get('SAMLResponse')) {
                    return new ZendExt_SAML_HTTPRedirect();
                }
                break;
            case 'POST':
                if ($request->get('SAMLRequest') || $request->get('SAMLResponse')) {
                    return new ZendExt_SAML_HTTPPost();
                }
                break;
        }
        throw new Exception('Unable to find the current binding.');
    }

    public function getDestination()
    {
        return $this->destination;
    }

    public function setDestination($destination)
    {
        $this->destination = $destination;
    }

    abstract public function send(SAML2\Message $message);

    abstract public function receive(Zend_Controller_Request_Http $request, &$sigData);
}