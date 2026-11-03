<?php

/**
 * Created by PhpStorm.
 * User: ernesto
 * Date: 22/03/17
 * Time: 16:49
 */
class ZendExt_Soap_AutoDiscover extends Zend_Soap_AutoDiscover
{
    public function setClass($class, $namespace = '', $argv = null)
    {
        $uri = $this->getUri();

        $wsdl = new ZendExt_Soap_Wsdl($class, $uri, $this->_strategy);
        // The wsdl:types element must precede all other elements (WS-I Basic Profile 1.1 R2023)
        $wsdl->addSchemaTypeSection();

        $port = $wsdl->addPortType($class . 'Port');
        $binding = $wsdl->addBinding($class . 'Binding', 'tns:' .$class. 'Port');

        $wsdl->addSoapBinding($binding, $this->_bindingStyle['style'], $this->_bindingStyle['transport']);
        $wsdl->addService($class . 'Service', $class . 'Port', 'tns:' . $class . 'Binding', $uri);
        foreach ($this->_reflection->reflectClass($class)->getMethods() as $method) {
            $this->_addFunctionToWsdl($method, $wsdl, $port, $binding);
        }
        $this->_wsdl = $wsdl;
    }
}