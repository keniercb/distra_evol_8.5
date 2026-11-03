<?php

/**
 * Created by PhpStorm.
 * User: alejo
 * Date: 28/03/2017
 * Time: 15:10
 */
class WSClient
{

    private $dirWS, $wsClient, $config;

    function __construct()
    {
        $this->config = $config_ini = parse_ini_file("wsconfig.ini");
        $this->dirWS = $config_ini['WS_MTH'] == 'rest' ? $config_ini['URL_WS_REST'] : $config_ini['URL_WS_SOAP'];
        if ($config_ini['WS_MTH'] == 'rest') {
            $this->wsClient = new RESTClient('distra-beta.prod.xetid.cu', null, 'logistica/utiles/webservices/index.php/api', 'v1', 'administrador', 'admin', 'basic');
        } else {
            $clientAuth = new stdClass();
            $clientAuth->wssToken = LogisticaJWTHelper::__init()->encode();
            $headers = array(
                new SoapHeader($this->dirWS, 'authHeader', $clientAuth)
            );
            $this->wsClient = new SoapClient($this->dirWS);
            $this->wsClient->__setSoapHeaders($headers);
        }
    }

    /**
     * @param null $idEspecialidad
     * @param null $criterio
     * @param int $offset
     * @param int $limit
     * @return string
     */
    public function devolverSurtidos($idEspecialidad = null, $criterio = null, $offset = 0, $limit = 30)
    {
        try {
            if ($this->config['WS_MTH'] == 'rest') {
                $params = array(
                    'idEspecialidad' => $idEspecialidad,
                    'criterio' => $criterio,
                    'offset' => $offset,
                    'limit' => $limit
                );
                $request = new RESTRequest('GET', 'pgm/devolverSurtidos', $params);
                return $this->wsClient->json($this->wsClient->send($request));
            }
            return json_decode($this->wsClient->devolverSurtidos($idEspecialidad, $criterio, $offset, $limit));

        } catch (SoapFault $e) {
            echo $this->wsClient->__getLastRequest();
            echo PHP_EOL;
            echo $this->wsClient->__getLastResponse();
            print_r($e);
            die();
        } catch (Exception $e) {
            echo $e->getMessage();
            echo PHP_EOL;
            print_r($e);
            die();
        }
    }

    /**
     * @param null $idEspecialidad
     * @param null $criterio
     * @param null $idAlmacen
     * @param null $idNomenclador
     * @param int $offset
     * @param int $limit
     * @return string
     */
    public function devolverMediosAlmacenados($idEspecialidad = null, $criterio = null, $idAlmacen = null, $idNomenclador = null, $offset = 0, $limit = 30)
    {
        try {
            if ($this->config['WS_MTH'] == 'rest') {
                $params = array(
                    'idEspecialidad' => $idEspecialidad,
                    'criterio' => $criterio,
                    'idAlmacen' => $idAlmacen,
                    'idNomenclador' => $idNomenclador,
                    'offset' => $offset,
                    'limit' => $limit
                );
                $request = new RESTRequest('GET', 'pgm/devolverMediosAlmacenados', $params);
                return $this->wsClient->json($this->wsClient->send($request));
            }
        } catch (SoapFault $e) {
            echo $this->wsClient->__getLastRequest();
            echo PHP_EOL;
            echo $this->wsClient->__getLastResponse();
            print_r($e);
            die();
        } catch (Exception $e) {
            echo $e->getMessage();
            echo PHP_EOL;
            print_r($e);
            return array('cantidad' => 0, 'datos' => [], 'success' => false, 'codigoMsg' => 3, 'message' => $e->getMessage() . PHP_EOL);
            die;
        }
        return json_decode($this->wsClient->devolverSurtidosdevolverMediosAlmacenados($idEspecialidad, $criterio, $idAlmacen, $idNomenclador, $offset, $limit));
    }

    /**
     * @param $idEspecialidad
     * @param $criterio
     * @param null $idEntidad
     * @param null $idNomenclador
     * @param null $offset
     * @param null $limit
     * @return string
     */
    public function devolverActivos($idEspecialidad, $criterio, $idEntidad = null, $idNomenclador = null, $offset = null, $limit = null)
    {

        try {
            if ($this->config['WS_MTH'] == 'rest') {
                $params = array(
                    'idEspecialidad' => $idEspecialidad,
                    'criterio' => $criterio,
                    'idEntidad' => $idEntidad,
                    'idNomenclador' => $idNomenclador,
                    'offset' => $offset,
                    'limit' => $limit
                );
                $request = new RESTRequest('GET', 'pgm/devolverActivos', $params);
                $response = $this->wsClient->send($request);
                print_r($response);die;
                return $this->wsClient->json($response);
            }
            return json_decode($this->wsClient->devolverActivos($idEspecialidad, $criterio, $idEntidad, $idNomenclador, $offset, $limit));
        } catch (SoapFault $e) {
            echo $this->wsClient->__getLastRequest();
            echo PHP_EOL;
            echo $this->wsClient->__getLastResponse();
            print_r($e);
            die();
        } catch (Exception $e) {
            echo $e->getMessage();
            echo PHP_EOL;
            print_r($e);
            return array('cantidad' => 0, 'datos' => [], 'success' => false, 'codigoMsg' => 3, 'message' => $e->getMessage() . PHP_EOL);
            die;
        }
    }

    public function devolverEntidadesActivos($idEspecialidad, $criterio, $idEntidad = null, $idNomenclador = null, $offset = null, $limit = null)
    {
        try {
            if ($this->config['WS_MTH'] == 'rest') {
                $params = array(
                    'idEspecialidad' => $idEspecialidad,
                    'criterio' => $criterio,
                    'idEntidad' => $idEntidad,
                    'idNomenclador' => $idNomenclador,
                    'offset' => $offset,
                    'limit' => $limit
                );
                $request = new RESTRequest('GET', 'pgm/devolverEntidadesActivos', $params);
                return $this->wsClient->json($this->wsClient->send($request));
            }

            return json_decode($this->wsClient->devolverEntidadesActivos($idEspecialidad, $criterio, $idEntidad, $idNomenclador, $offset, $limit));
        } catch (SoapFault $e) {
            echo $this->wsClient->__getLastRequest();
            echo PHP_EOL;
            echo $this->wsClient->__getLastResponse();
            print_r($e);
            die();
        } catch (Exception $e) {
            echo $e->getMessage();
            echo PHP_EOL;
            print_r($e);
            return array('cantidad' => 0, 'datos' => [], 'success' => false, 'codigoMsg' => 3, 'message' => $e->getMessage() . PHP_EOL);
            die;
        }
    }

    /**
     * @param $idIndicador
     * @return string
     */
    public
    function obtenerDatosMedioPorId($idIndicador)
    {
        try {
            if ($this->config['WS_MTH'] == 'rest') {
                $params = array(
                    'idIndicador' => $idIndicador
                );
                $request = new RESTRequest('GET', 'pgm/obtenerDatosMedioPorId', $params);
                return $this->wsClient->json($this->wsClient->send($request));
            }

            return json_decode($this->wsClient->obtenerDatosMedioPorId($idIndicador));
        } catch (SoapFault $e) {
            echo $this->wsClient->__getLastRequest();
            echo PHP_EOL;
            echo $this->wsClient->__getLastResponse();
            print_r($e);
            die();
        } catch (Exception $e) {
            echo $e->getMessage();
            echo PHP_EOL;
            print_r($e);
            return array('cantidad' => 0, 'datos' => [], 'success' => false, 'codigoMsg' => 3, 'message' => $e->getMessage() . PHP_EOL);
            die;
        }
    }

    /**
     * @param $nomenclador
     * @param $extraParams
     *
     * @return string
     * Obtener las naturalezas del sistema
     */
    public
    function obtenerNomencladorCategorias($nomenclador, $extraParams)
    {
        try {
            if ($this->config['WS_MTH'] == 'rest') {
                $params = array(
                    'nomenclador' => $nomenclador,
                    'extraParams' => $extraParams
                );
                $request = new RESTRequest('GET', 'pgm/obtenerNomencladorCategorias', $params);
                return $this->wsClient->json($this->wsClient->send($request));
            }
            return json_decode($this->wsClient->obtenerNomencladorCategorias($nomenclador, $extraParams));
        } catch (SoapFault $e) {
            echo $this->wsClient->__getLastRequest();
            echo PHP_EOL;
            echo $this->wsClient->__getLastResponse();
            print_r($e);
            die();
        } catch (Exception $e) {
            echo $e->getMessage();
            echo PHP_EOL;
            print_r($e);
            return array('cantidad' => 0, 'datos' => [], 'success' => false, 'codigoMsg' => 3, 'message' => $e->getMessage() . PHP_EOL);
            die;
        }
    }


    /**
     * @param $naturaleza
     * @param $extraParams
     *
     * @return string
     * Obtener los datos de los RN dado una naturaleza
     */
    public
    function obtenerNomencladorArbol($nomenclador, $naturaleza, $extraParams)
    {
        try {
            if ($this->config['WS_MTH'] == 'rest') {
                $params = array(
                    'nomenclador' => $nomenclador,
                    'naturaleza' => $naturaleza,
                    'extraParams' => $extraParams
                );
                $request = new RESTRequest('GET', 'pgm/obtenerNomencladorArbol', $params);
                return $this->wsClient->json($this->wsClient->send($request));

            }
            return json_decode($this->wsClient->obtenerNomencladorArbol($nomenclador, $naturaleza, $extraParams));
        } catch (SoapFault $e) {
            echo $this->wsClient->__getLastRequest();
            echo PHP_EOL;
            echo $this->wsClient->__getLastResponse();
            print_r($e);
            die();
        } catch (Exception $e) {
            echo $e->getMessage();
            echo PHP_EOL;
            print_r($e);
            return array('cantidad' => 0, 'datos' => [], 'success' => false, 'codigoMsg' => 3, 'message' => $e->getMessage() . PHP_EOL);
            die;
        }
    }

    /**
     * @param $nomenclador
     * @param $naturaleza
     * @param $activo
     * @param $extraParams
     *
     * @return string
     * @throws Zend_Exception
     */
    public
    function obtenerNomencladorDetalles($nomenclador, $naturaleza, $activo, $extraParams)
    {
        try {
            if ($this->config['WS_MTH'] == 'rest') {
                $params = array(
                    'nomenclador' => $nomenclador,
                    'naturaleza' => $naturaleza,
                    'activo' => $activo,
                    'extraParams' => $extraParams
                );
                $request = new RESTRequest('GET', 'pgm/obtenerNomencladorDetalles', $params);
                return $this->wsClient->json($this->wsClient->send($request));
            }

            return json_decode($this->wsClient->obtenerNomencladorDetalles($nomenclador, $naturaleza, $activo, $extraParams));
        } catch (SoapFault $e) {
            echo $this->wsClient->__getLastRequest();
            echo PHP_EOL;
            echo $this->wsClient->__getLastResponse();
            print_r($e);
            die();
        } catch (Exception $e) {
            echo $e->getMessage();
            echo PHP_EOL;
            print_r($e);
            return array('cantidad' => 0, 'datos' => [], 'success' => false, 'codigoMsg' => 3, 'message' => $e->getMessage() . PHP_EOL);
            die;
        }
    }

}