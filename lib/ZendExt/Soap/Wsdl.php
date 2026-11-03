<?php

/**
 * Created by PhpStorm.
 * User: ernesto
 * Date: 22/03/17
 * Time: 16:41
 */
class ZendExt_Soap_Wsdl extends Zend_Soap_Wsdl
{
    const XML_NS            = 'xmlns';
    const XML_NS_URI        = 'http://www.w3.org/2000/xmlns/';
    const WSDL_NS           = 'wsdl';
    const WSDL_NS_URI       = 'http://schemas.xmlsoap.org/wsdl/';
    const SOAP_11_NS        = 'soap';
    const SOAP_11_NS_URI    = 'http://schemas.xmlsoap.org/wsdl/soap/';
    const SOAP_12_NS        = 'soap12';
    const SOAP_12_NS_URI    = 'http://schemas.xmlsoap.org/wsdl/soap12/';
    const SOAP_ENC_NS       = 'soap-enc';
    const SOAP_ENC_URI      = 'http://schemas.xmlsoap.org/soap/encoding/';
    const XSD_NS            = 'xsd';
    const XSD_NS_URI        = 'http://www.w3.org/2001/XMLSchema';
    const TYPES_NS          = 'tns';

    public function __construct($name, $uri, $strategy = true)
    {
        if ($uri instanceof Zend_Uri_Http) {
            $uri = $uri->getUri();
        }
        $this->_uri = $uri;
        $this->_dom      = $this->getDOMDocument($name, $this->_uri);

        if (!$this->_dom) {
            require_once 'Zend/Server/Exception.php';
            throw new Zend_Server_Exception('Unable to create DomDocument');
        } else {
            $this->_wsdl     = $this->_dom->documentElement;
        }

        $this->setComplexTypeStrategy($strategy);
    }

    protected function getDOMDocument($name, $uri = null)
    {
        $dom = new DOMDocument();
        $dom->preserveWhiteSpace    = false;
        $dom->formatOutput          = false;
        $dom->resolveExternals      = false;
        $dom->encoding              = 'UTF-8';
        $dom->substituteEntities    = false;
        $definitions = $dom->createElementNS(self::WSDL_NS_URI, 'definitions');
        $dom->appendChild($definitions);
        $uri = $this->sanitizeUri($uri);
        $this->setAttributeWithSanitization($definitions, 'name', $name);
        $this->setAttributeWithSanitization($definitions, 'targetNamespace', $uri);
        $definitions->setAttributeNS(self::XML_NS_URI, 'xmlns:'. self::WSDL_NS, self::WSDL_NS_URI);
        $definitions->setAttributeNS(self::XML_NS_URI, 'xmlns:'. self::TYPES_NS, $uri);
        $definitions->setAttributeNS(self::XML_NS_URI, 'xmlns:'. self::SOAP_11_NS, self::SOAP_11_NS_URI);
        $definitions->setAttributeNS(self::XML_NS_URI, 'xmlns:'. self::XSD_NS, self::XSD_NS_URI);
        $definitions->setAttributeNS(self::XML_NS_URI, 'xmlns:'. self::SOAP_ENC_NS, self::SOAP_ENC_URI);
        $definitions->setAttributeNS(self::XML_NS_URI, 'xmlns:'. self::SOAP_12_NS, self::SOAP_12_NS_URI);
        return $dom;
    }

    public function sanitizeUri($uri)
    {
        if ($uri instanceof Zend_Uri_Http) {
            $uri = $uri->toString();
        }
        $uri = trim($uri);
        $uri = htmlspecialchars($uri, ENT_QUOTES, 'UTF-8', false);
        if (empty($uri)) {
            throw new Zend_Uri_Exception('Uri contains invalid characters or is empty');
        }
        return $uri;
    }

    protected function setAttributeWithSanitization(DOMNode $node, $attributeName, $attributeValue)
    {
        $attributeValue = $this->sanitizeAttributeValueByName($attributeName, $attributeValue);
        $this->setAttribute($node, $attributeName, $attributeValue);
    }

    protected function sanitizeAttributeValueByName($name, $value)
    {
        switch (strtolower($name)) {
            case 'targetnamespace':
            case 'encodingstyle':
            case 'soapaction':
            case 'location':
                return $this->sanitizeUri($value);
            default:
                return $value;
        }
    }

    protected function setAttribute(DOMNode $node, $attributeName, $attributeValue)
    {
        $attributeNode = $node->ownerDocument->createAttribute($attributeName);
        $node->appendChild($attributeNode);
        $attributeNodeValue = $node->ownerDocument->createTextNode($attributeValue);
        $attributeNode->appendChild($attributeNodeValue);
    }

}