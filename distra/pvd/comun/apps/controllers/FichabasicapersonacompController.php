<?php
class FichabasicapersonacompController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function fichabasicapersonacompAction()
    {
        $this->render();
    }
    function getdatospersonaAction(){
        $errorWSDL = false;
        try {
            $objectClientSeguridad =
                new soapClient("http://10.12.162.218:5900/seguridad/webservices/server.wsdl.php");
            $certificado = $objectClientSeguridad->authenticateUserApi( 'administrador', 'administrador');
              if (!empty($certificado) || $certificado != "") {

            $opts =  array(
                'http'=>array(
                    'user_agent' => 'PHPSoapClient'
                ),
                'ssl' => array(
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                    'allow_self_signed' => true
                )
            );

                $cliente = new SoapClient(
                    "http://10.12.162.218:5900/pvd/persona/services/webservices/server.wsdl.php"
                    ,array('encoding' => 'UTF-8',
                        'verifypeer' => false,
                        'cache_wsdl' => WSDL_CACHE_NONE,
                        'verifyhost' => false,
                        'soap_version' => SOAP_1_2,
                        'trace' => 1,
                        'exceptions' => 1,
                        'connection_timeout' => 180,
                        'stream_context' => stream_context_create($opts))
                );

                $params = array();
                //$params->certificado = $certificado;
                $numid = $this->_request->getPost('numid');
                $idsuin = $this->_request->getPost('idsuin');
                $parametros = array('numid' => $numid, 'idsuin' => $idsuin);
                $params['operacion'] = 'getDatosFichaBasicaPersona';
                $params['parametros'] =  $parametros;
                $datospersona = $cliente->servicios($params);
               // print_r($datospersona->respuesta[0]);die;
                if(!empty($datospersona->respuesta[0]))
                {
                    $result['respuesta'] = $datospersona->respuesta[0];
                    $result['codigo'] = 1;
                }
                else
                {
                    $result['respuesta'] = array('numid'=>'Persona no encontrada');
                    $result['codigo'] = 1;
                }

            }
            else{
                $result['respuesta'] = 'Usuario o contraseña incorrectos.';
                $result['codigo'] = 3;
            }
        } catch (Exception $e) {

            $result['respuesta'] = 'Ha ocurrido un error en el servicio SOAP.';
            $result['codigo'] = 3;
        }

            echo (json_encode ($result));


    }
}