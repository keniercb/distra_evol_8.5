<?php

/**
 * Clase controladora para gestionar el Nomenclador de monedas.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Multimoneda/Controllers
 * @copyright  XETID
 * @version    1.0-0
 */
class GestnommonedaController extends ZendExt_Controller_Secure
{

    /**
     * Constuctor de la clase
     */
    private $utfOcho
        = array("à" => "À", "è" => "È", "ì" => "Ì", "ò" => "Ò", "ù" => "Ù",
                "á" => "Á", "é" => "É", "í" => "Í", "ó" => "Ó", "ú" => "Ú",
                "â" => "Â", "ê" => "Ê", "î" => "Î", "ô" => "Ô", "û" => "Û",
                "ç" => "Ç");

    function init()
    {
        parent::init();
        $this->model = new NomMonedaModel();
    }

    /**
     * Inicializa la vista
     */
    public function gestnommonedaAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /**
     * Obtiene las monedas
     *
     * @return array Monedas
     */
    function getmonedasAction()
    {
        $estructura = $this->_request->getPost('idestructura');
        $estructura = $estructura ? $estructura : $this->global->Estructura->idestructura;
        $start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
        $condiciones = $this->_request->getPost();
        $resultMonedas = NomMonedaModel::obtenerNomMonedas($condiciones, $start, $limit, $estructura);

        if ($condiciones['sfFiltro']) {
            include_once Zend_Registry::get('config')->dir_aplication
                . 'configuracion/comun/models/bussines/UtilesDatosMaestros.php';
            $resultMonedas['datos'] = UtilesDatosMaestros::colorSearch(
                $resultMonedas['datos'], array('nombremoneda', 'organizacion', 'codigoiso', 'codigo'),
                array($condiciones['sfFiltro'], $condiciones['sfFiltro'], $condiciones['sfFiltro'],
                      $condiciones['sfFiltro'])
            );
        }
        echo(json_encode($resultMonedas));
        return;
    }

    /**
     * Obtiene los pa&iacute;ses y organizaci&oacute; del nomenclador de pa&iacute;s
     *
     * @return array pa&iacute;ses
     */
    function getPaisesAction()
    {
        $arrCond = array('nombrepais' => $this->_request->getPost('nombrepais'));
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $paises = $this->integrator->datosmaestros->getPaises($arrCond, $start, $limit);
        echo(json_encode($paises));
    }

    /**
     * Adiciona una moneda
     *
     * @return mixed Código
     * @throws mixed
     */
    function adicionarmonedaAction()
    {
        try {
            $objNomMoneda = new NomMoneda();
            $objNomMoneda->codigoiso = strtr(
                strtoupper($this->_request->getPost('codigoiso')),
                $this->utfOcho
            );
            $objNomMoneda->nombremoneda = $this->_request->getPost(
                'nombremoneda'
            );
            $objNomMoneda->codigo = $this->_request->getPost('codigo');
            $objNomMoneda->idpais = strtr(
                strtoupper($this->_request->getPost('idpaisrawvalue')),
                $this->utfOcho
            );
            $objNomMoneda->simbolo = $this->_request->getPost('simbolo');
            $objNomMoneda->presicion = $this->_request->getPost('presicion');
            $objNomMoneda->factorredondeo = $this->_request->getPost(
                'factorredondeo'
            );
            $numVerificacion = NomMonedaModel::verificarExisteMoneda(
                $objNomMoneda
            );
            if ($numVerificacion == -1) {
                NomMonedaModel::adicionarNomMoneda($objNomMoneda);
            }
            echo "{'codMsg':$numVerificacion}";
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Adiciona un tipo de moneda
     *
     * @return mixed Código
     * @throws Doctrine_Exception
     */
    function insertartipoAction()
    {
        try {
            $monedasa = json_decode(stripslashes($this->_request->getPost('arraymoneda')));
            $response = array('code' => 1, 'clasificadas' => array(), 'errors' => array());
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
            foreach ($monedasa as $idmoneda) {
                if ($idmoneda->idmonedaentidad) {
                    $id = $idmoneda->idmonedaentidad;
                    $objDatMonedaEntidad = Doctrine::getTable('DatMonedaEntidad')->find($id);
                } else {
                    $objDatMonedaEntidad = new DatMonedaEntidad();
                    $objDatMonedaEntidad->idmoneda = $idmoneda->idmoneda;
                    $objDatMonedaEntidad->idestructuracomun = $idestructura;
                }
                $objDatMonedaEntidad->tipomoneda = $idmoneda->tipo;
                $objDatMonedaEntidad->dualidad = $idmoneda->dualidad;
                $numVerificacion = DatMonedaEntidadModel::verificarExisteMoneda(
                    $objDatMonedaEntidad->idmoneda,
                    $objDatMonedaEntidad->idestructuracomun,
                    $objDatMonedaEntidad->tipomoneda,
                    $objDatMonedaEntidad->dualidad
                );
                $aux = $this->switchVerificacionTipo(
                    $numVerificacion, $objDatMonedaEntidad, $idmoneda,
                    $response, $this->_request->getPost('idmonedaentidad')
                );
                $response = $aux;
            }
            $this->mensajeInsertarTipo($response);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    private function mensajeInsertarTipo($response)
    {
        if (count($response['errors']) == 0
            && count($response['clasificadas']) == 0
        ) {
            echo("{'codMsg':-1}");
            return;
        } else {
            if ($response['existecontable']) {
                echo("{'codMsg':-4}");
                return;
            } else {
                if ($response['existealternativa']) {
                    echo("{'codMsg':-5}");
                    return;
                } else {
                    if (count($response['clasificadas']) == 0) {
                        echo("{'codMsg':-2}");
                        return;
                    } else {
                        echo("{'codMsg':-3}");
                        return;
                    }
                }
            }
        }
    }

    /**
     * @param $numVerificacion
     * @param $objDatMonedaEntidad
     * @param $idmoneda
     * @param $response
     * @param $add
     *
     * @return mixed
     * @throws Doctrine_Exception
     * @throws Exception
     */
    private function switchVerificacionTipo(
        $numVerificacion, $objDatMonedaEntidad, $idmoneda, $response, $idmonedaentidad
    ) {
        if ($objDatMonedaEntidad->tipomoneda == 0) {
            $contable = DatMonedaEntidadModel::existeMonedaContable($objDatMonedaEntidad->idestructuracomun);
            if ($contable) {
                $response['errors'][] = array('moneda' => $idmoneda->idmoneda);
                $response['existecontable'] = true;
                return $response;
            }
        }

        if ($objDatMonedaEntidad->tipomoneda == 1 && $objDatMonedaEntidad->dualidad == 1) {
            $alternativa = DatMonedaEntidadModel::existeMonedaAlternativa($objDatMonedaEntidad->idestructuracomun);
            if ($alternativa) {
                $response['errors'][] = array('moneda' => $idmoneda->idmoneda);
                $response['existealternativa'] = true;
                return $response;
            }
        }

        switch ($numVerificacion) {
            case -1:
                if ($idmonedaentidad) {
                    if (DatMonedaEntidadModel::Modificar(
                        $objDatMonedaEntidad
                    )
                    ) {
                        $response['succes'][]
                            = array('moneda' => $idmoneda->idmoneda);
                    } else {
                        $response['errors'][]
                            = array('moneda' => $idmoneda->idmoneda);
                    }
                } else {
                    if (DatMonedaEntidadModel::Adicionar(
                        $objDatMonedaEntidad
                    )
                    ) {
                        $response['succes'][]
                            = array('moneda' => $idmoneda->idmoneda);
                    } else {
                        $response['errors'][]
                            = array('moneda' => $idmoneda->idmoneda);
                    }
                }
                break;
            case -2:
                $response['clasificadas'][]
                    = array('moneda' => $idmoneda->idmoneda);
        }
        return $response;
    }

    /**
     * Modifica una moneda
     *
     * @return mixed Código
     * @throws Doctrine_Exception
     */
    function modificarmonedaAction()
    {
        try {
            $pIdMoneda = $this->_request->getPost('idmoneda');
            $objNomMoneda = Doctrine::getTable('NomMoneda')->find($pIdMoneda);
            $objNomMoneda->codigoiso = $this->_request->getPost('codigoiso');
            $objNomMoneda->nombremoneda = $this->_request->getPost(
                'nombremoneda'
            );
            $objNomMoneda->codigo = $this->_request->getPost('codigo');
            if (is_numeric($this->_request->getPost('idpaisrawvalue'))) {
                $objNomMoneda->idpais = $this->_request->getPost('idpaisrawvalue');
            }
            $objNomMoneda->simbolo = $this->_request->getPost('simbolo');
            $objNomMoneda->presicion = $this->_request->getPost('presicion');
            $objNomMoneda->factorredondeo = $this->_request->getPost(
                'factorredondeo'
            );
            $numVerificacion = NomMonedaModel::verificarExisteMoneda(
                $objNomMoneda
            );
            switch ($numVerificacion) {
                case -1:
                    if (NomMonedaModel::modificarNomMoneda($objNomMoneda)) {
                        echo("{'codMsg':-1}");
                        return;
                    }
                    break;
                default:
                    echo("{'codMsg':-2}");
                    break;
            }
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Elimina una moneda
     *
     * @return mixed Código
     * @throws Doctrine_Exception
     */
    function eliminarmonedaAction()
    {
        try {
            $pIdMoneda = $this->_request->getPost('idmoneda');
            $arrayIdMoneda = split(",", $pIdMoneda);

            if (count($arrayIdMoneda) > 1) {
                if (NomMonedaModel::eliminarVariasMonedas($arrayIdMoneda)
                    === '-3'
                ) {
                    echo("{'codMsg':-4}");
                    return;
                } else {
                    echo("{'codMsg':-2}");
                    return;
                }
            } else {
                $objNomMoneda = Doctrine::getTable('NomMoneda')->find(
                    $pIdMoneda
                );
                if (NomMonedaModel::eliminarNomMoneda($objNomMoneda) === '-3') {
                    echo("{'codMsg':-3}");
                    return;
                } else {
                    if (NomMonedaModel::eliminarNomMoneda($objNomMoneda)) {
                        echo("{'codMsg':-1}");
                        return;
                    }
                }
            }
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Desclasifica monedas
     *
     * @return mixed Código
     * @throws Doctrine_Exception
     */
    function desclasificarAction()
    {
        try {
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
            $pIdMoneda = $this->_request->getPost('idmonedaentidad');
            $arrayIdMoneda = split(",", $pIdMoneda);
            if (count($arrayIdMoneda) > 1) {
                if (DatMonedaEntidadModel::eliminarVariasMonedas($arrayIdMoneda, $idestructura) === '-3') {
                    echo("{'codMsg':-4}");
                    return;
                } else {
                    echo("{'codMsg':-2}");
                    return;
                }
            } else {
                $objNomMonedaEntidad = Doctrine_Core::getTable('DatMonedaEntidad')->find($pIdMoneda);
                if (DatMonedaEntidadModel::Eliminar($objNomMonedaEntidad, $idestructura) === '-3') {
                    echo("{'codMsg':-3}");
                    return;
                } else {
                    echo("{'codMsg':-1}");
                    return;
                }
            }
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /**
     * Obtiene los datos de monedas para confeccionar el reporte
     *
     * @return array Datos de monedas para el reporte
     */
    public function obtenerdatosreporteAction()
    {
        echo json_encode($this->model->obtenerDatosImprimirReporte());
    }

    /**
     * Obtiene desgloses por monedas
     *
     * @return array Array con cantidad y datos de los desgloses por monedas
     */
    public function cargardezglozemonedasAction()
    {
        $start = ($this->_request->getPost('start')) ? $this->_request->getPost(
            'start'
        ) : 0;
        $limit = ($this->_request->getPost('limit')) ? $this->_request->getPost(
            'limit'
        ) : 20;
        $condiciones = $this->_request->getPost();
        $arrayDesgloses = DatDezglozemonedaModel::obtenerDesglosesMonedas(
            $condiciones, $start, $limit
        );
        echo(json_encode($arrayDesgloses));
    }

    /**
     * Obtiene desgloses
     *
     * @return array Array con cantidad y datos de los desgloses
     */
    public function cargardezglozeAction()
    {
        $start = ($this->_request->getPost('start')) ? $this->_request->getPost(
            'start'
        ) : 0;
        $limit = ($this->_request->getPost('limit')) ? $this->_request->getPost(
            'limit'
        ) : 20;
        $condiciones = $this->_request->getPost();
        $arrayDesgloses
            = DatDezglozemonedaModel::obtenerDesglosesMonedasByIdMoneda(
            $condiciones, $start, $limit
        );
        echo(json_encode($arrayDesgloses));
    }

    /**
     * Adiciona un desglose
     *
     * @return mixed Código: -1 adicionó correctamente,-2 no adicionó
     * @throws ZendExt_Exception
     */
    public function insertadesgloseAction()
    {
        try {
            if (strpos($this->_request->getPost('desgloses'), ',')) {
                $pIdDesgloses = split(
                    ",", $this->_request->getPost('desgloses')
                );
                $pIdMoneda = $this->_request->getPost('idmoneda');
                if (DatDezglozemonedaModel::AdicionarVariosDesgloses(
                    $pIdDesgloses, $pIdMoneda
                )
                ) {
                    echo("{'codMsg':-2}");
                    return;
                }
            } else {
                $objDatDezglozemoneda = new DatDezglozemoneda();
                $objDatDezglozemoneda->idmoneda = $this->_request->getPost(
                    'idmoneda'
                );
                $objDatDezglozemoneda->iddezglozemonedas
                    = $this->_request->getPost('desgloses');
                if (DatDezglozemonedaModel::Adicionar($objDatDezglozemoneda)) {
                    echo("{'codMsg':-1}");
                    return;
                }
            }
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF149', $ee);
        }
    }

    /**
     * Elimina desgloses
     *
     * @return mixed Código
     * @throws ZendExt_Exception
     */
    public function eliminardesgloseAction()
    {
        try {
            if (strpos($this->_request->getPost('desgloses'), ',')) {
                $arrayIdDesgloses = split(
                    ",", $this->_request->getPost('desgloses')
                );
                if (DatDezglozemonedaModel::EliminarVariosDesgloses(
                        $arrayIdDesgloses
                    ) === '-3'
                ) {
                    echo("{'codMsg':-4}");
                    return;
                } else {
                    echo("{'codMsg':-2}");
                    return;
                }
            } else {
                $datDezglozemoneda = Doctrine::getTable('DatDezglozemoneda')
                    ->find($this->_request->getPost('desgloses'));
                if (DatDezglozemonedaModel::Eliminar($datDezglozemoneda)
                    === '-3'
                ) {
                    echo("{'codMsg':-3}");
                    return;
                } else {
                    echo("{'codMsg':-1}");
                    return;
                }
            }
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF148', $ee);
        }
    }

}
