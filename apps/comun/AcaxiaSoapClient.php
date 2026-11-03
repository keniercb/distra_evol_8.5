<?php

/**
 * @name AcaxiaSoapClient - Clase cliente para el consumo de servicios web usando SOAP.
 * @author Equipo de seguridad UCID.
 * @version 1.0.0
 */
class AcaxiaSoapClient
{

    /**
     * @name AcaxiaSoapClient Constructor con parametros.
     * @param String $wsdl - Dirección del wsdl de autenticación.
     */
    function AcaxiaSoapClient()
    {
    }

    /**
     * @name execSoapAcaxia     - Función usada para consumir los WS.
     * @param type $wsdl        - Dirección del WSDL a consumir
     * @param type $function    - Función a ejecutar.
     * @param type $parametros  - Parámetros de la función en caso de ser mas de uno se pasa un array con los valores.
     * @return type             - Retorna el resultado del servicio.
     */
    function execSoapAcaxia($wsdl, $function, $params = array())
    {
        if (!self::isSoapLogin()) {
            throw new SoapFault('Acceso denegado. Autentiquese.', 'ERROR');
        } else {
            try {
                $soap = new SoapClient($wsdl, array('trace' => true));
                $soap->__setCookie('PHPSESSID', $this->getSoapSession());
                if (count($params) == 0) {
                    return $soap->$function();
                } else {
                    return $soap->__soapCall($function, $params);
                }
                //return $soap->__soapCall($function, $params);
            } catch (SoapFault $exception) {
                throw new SoapFault($exception->getMessage(), $exception->getCode());
            }
        }
    }

    function getSoapSession()
    {
        return $_SESSION['SOAP_SESSION'];
    }

    /**
     * @name login          - Función inicial usada para consumir los servicios.
     * 
     * @param String $user  - Usuario.
     * @param String $pass  - Contrasena.
     * @return void 
     */
    function login($wsld, $user, $pass)
    {
        try {
            $soap = new SoapClient($wsld, array('trace' => true));
            $certificado = $soap->authenticateUserApi($user, $pass);
            if ($certificado) {
                $_SESSION['SOAP_SESSION'] = '';
                $_SESSION['SOAP_SESSION'] = $certificado;
            } else {
                return 0;
            }
        } catch (SoapFault $exception) {
            return 0;
        }
    }

    /**
     * @name isSoapLogin - Función usada para saber si está logueado antes de consumir los servicios web.
     * 
     * @return boolean 
     */
    private function isSoapLogin()
    {
        return (isset($_SESSION['SOAP_SESSION'])) ? true : false;
    }

    /**
     * @name Logout
     */
    function Logout()
    {
        unset($_SESSION['SOAP_SESSION']);
    }
}