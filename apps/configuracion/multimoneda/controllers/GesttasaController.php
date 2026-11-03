<?php

/**
 * Clase controladora para gestionar las Tasas.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Multimoneda/Controllers
 * @copyright  XETID
 * @version    1.0-0
 */
class GesttasaController extends ZendExt_Controller_Secure
{

    private $exception;

    /**
     * Constuctor de la clase
     */
    function init()
    {
        parent::init();//var_dump($this->integrator->datosmaestros->calcularImporte(990000000171, 30, 9900000052));die;
        $this->model [] = new TasaModel();
        $this->model [] = new HistasaModel();
    }

    /**
     * Inicializa la vista
     *
     * @throws ZendExt_Exception
     */
    function gesttasaAction()
    {
        $idestructura = $this->global->Estructura->idestructura;
        $arrayNomMoneda = NomMoneda::buscar();
        if ($arrayNomMoneda['cant'] == 0) {
            $this->exception = new ZendExt_Exception('CONF131');
            $flashMessenger = $this->_helper->_flashMessenger;
            $flashMessenger->addMessage($this->exception->getIdException());
            $flashMessenger->addMessage($this->exception->getDescription());
            $flashMessenger->addMessage($this->exception->getMessage());
            $this->render('info');
        } else {
            $arrayMonedasEntidad = DatMonedaEntidad::obtenerMonedasByEntidad(
                array('idestructuracomun' => $idestructura)
            );
            if (count($arrayMonedasEntidad['datos']) == 0) {
                $this->exception = new ZendExt_Exception('CONF128');
                $flashMessenger = $this->_helper->_flashMessenger;
                $flashMessenger->addMessage($this->exception->getIdException());
                $flashMessenger->addMessage($this->exception->getDescription());
                $flashMessenger->addMessage($this->exception->getMessage());
                $this->render('info');
            } else {
                $arrayNomTipoTasas = NomTipotasas::buscar();
                if ($arrayNomTipoTasas['cant'] == 0) {
                    $this->exception = new ZendExt_Exception('CONF130');
                    $flashMessenger = $this->_helper->_flashMessenger;
                    $flashMessenger->addMessage($this->exception->getIdException());
                    $flashMessenger->addMessage($this->exception->getDescription());
                    $flashMessenger->addMessage($this->exception->getMessage());
                    $this->render('info');
                } else {
                    $arrayDatMoneda = DatMonedaEntidad::ObtenerMonedaContableDadoEntidad($idestructura);
                    if (count($arrayDatMoneda['datos']) == 0) {
                        $this->exception = new ZendExt_Exception('CONF132');
                        $flashMessenger = $this->_helper->_flashMessenger;
                        $flashMessenger->addMessage($this->exception->getIdException());
                        $flashMessenger->addMessage($this->exception->getDescription());
                        $flashMessenger->addMessage($this->exception->getMessage());
                        $this->render('info');
                    } else {
                        $this->render();
                    }
                }
            }
        }
    }

    public function getexcepcioncontroladaAction()
    {
        $dataException = $this->_helper->_flashMessenger->getMessages();
        echo("{detalles: '$dataException[1]', 'message': '$dataException[2]'}");
    }

    /**
     * Carga las tasas
     *
     * @return array Cantidad y datos de las tasas
     * @throws ZendExt_Exception
     */
    function cargartasaAction()
    {
        try {
            $start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
            $limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;
            $idestructuracomun = $this->_request->getPost('idestructura');
            $idestructuracomun = $idestructuracomun ? $idestructuracomun : $this->global->Estructura->idestructura;
            $condiciones = $this->_request->getPost();
            $result = DatTasa::getTasas($condiciones, $idestructuracomun, $limit, $start);
            $result = array('cant' => $result['count'], 'datos' => $result['data']);
            echo(json_encode($result));
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF127', $ee);
        }
    }

    /**
     * Carga todos los datos de tasas
     *
     * @return array Datos de las tasas
     * @throws ZendExt_Exception
     */
    function cargartipostasaAction()
    {
        try {
            $result = NomTipotasas::GetTodos();
            echo(json_encode($result));
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF127', $ee);
        }
    }

    /**
     * Obtiene monedas contables a partir del identificador de la estructura
     *
     * @return array Datos de las monedas contables
     * @throws ZendExt_Exception
     */
    function cargarmonedacontAction()
    {
        try {
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
            $result = DatMonedaEntidad::ObtenerMonedaContableDadoEntidad($idestructura);
            echo(json_encode($result));
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF132', $ee);
        }
    }

    /**
     * Obtiene monedas alternativas a partir del identificador de la estructura
     *
     * @return array Datos de las monedas alternativas
     * @throws ZendExt_Exception
     */
    function cargmonedasalternAction()
    {
        try {
            $idestructura = $this->_request->getPost('idestructura');
            $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
            $result = DatMonedaEntidad::ObtenerMonedasAlternativasDadoEntidad($idestructura);
            echo(json_encode($result));
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF132', $ee);
        }
    }

    /**
     * Obtiene clientes
     *
     * @return array Datos de los clientes
     * @throws ZendExt_Exception
     */
    function cargarclientesAction()
    {
        try {
            $result = $this->model[0]->cargarclientes($this->_request->getPost());
            echo json_encode($result);
        } catch (Doctrine_Exception $ee) {
            throw new $ee;
        }
    }

    /**
     * Obtiene fecha contable del subsistema
     *
     * @return mixed Fecha contable del subsistema
     */
    public function obtenerFechaAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idestructura = $idestructura ? $idestructura : $this->global->Estructura->idestructura;
        $fecha = $this->integrator->datosmaestros->fechaContableSubsistema($idestructura, 4);
        if(!$fecha){
            echo("{'codMsg':-2}");
            return;
        }
        echo json_encode($fecha);
    }

    /**
     * Adiciona una tasa
     *
     * @return int Código: -1 adicionó correctamente, -2 no se pudo adicionar
     * @throws ZendExt_Exception
     */
    function instasaAction()
    {
        try {
            $idestructura = $this->_request->getPost('idestructura');
            $objDatTasa = new DatTasa();
            $objDatTasa->venta = $this->_request->getPost('venta');
            $objDatTasa->compra = $this->_request->getPost('compra');
            $objDatTasa->desde = $this->_request->getPost('desde');
            if ($this->_request->getPost('idclientesproveedores')) {
                $objDatTasa->idcliente = $this->_request->getPost('idclientesproveedores');
            }
            $objDatTasa->referencia = $this->_request->getPost('referencia');
            $objDatTasa->idtipotasa = $this->_request->getPost('idtipotasa');
            $objDatTasa->factordeconversion = $this->_request->getPost('factordeconversion');
            $objDatTasa->nombretasa = $this->_request->getPost('nombretasa');
            $objDatTasa->version = 0;
            $objDatTasa->idmonedacontable = $this->_request->getPost('idmonedacontable');
            $objDatTasa->idmoneda = $this->_request->getPost('idmoneda');
            $pHasta = $this->_request->getPost('hasta');
            list($fechaFin['day'], $fechaFin['month'], $fechaFin['year']) = explode("/", $pHasta);
            if (checkdate($fechaFin['month'], $fechaFin['day'], $fechaFin['year'])) {
                $objDatTasa->hasta = $this->_request->getPost('hasta');
            }
            $result = $this->model[0]->insertarDatTasa($objDatTasa,$idestructura);
            echo("{'codMsg':$result}");
        } catch (ZendExt_Exception $ee) {
            throw new ZendExt_Exception('CONF063', $ee);
        }
    }

    /**
     * Modifica una tasa
     *
     * @return int Código: -1 modificó correctamente, -2 no se pudo modificar
     * @throws ZendExt_Exception
     */
    function modiftasaAction()
    {
        try {
            $objDatTasa = Doctrine::getTable('DatTasa')->find(
                $this->_request->getPost('idtasa')
            );

            $desde = $this->_request->getPost('desde');
            $hasta = $this->_request->getPost('hasta');
            $objDatTasa->venta = $this->_request->getPost('venta');
            $objDatTasa->compra = $this->_request->getPost('compra');
            $objDatTasa->desde = $desde ? $desde : null;
            $objDatTasa->hasta = $hasta ? $hasta : null;
            $objDatTasa->idcliente = $this->_request->getPost(
                'idclientesproveedores'
            );
            $objDatTasa->referencia = $this->_request->getPost('referencia');
            $objDatTasa->idtipotasa = $this->_request->getPost('idtipotasa');
            $objDatTasa->factordeconversion = $this->_request->getPost(
                'factordeconversion'
            );
            $objDatTasa->nombretasa = $this->_request->getPost('nombretasa');
            $objDatTasa->idmonedacontable = $this->_request->getPost(
                'idmonedacontable'
            );
            $objDatTasa->idmoneda = $this->_request->getPost('idmoneda');
            $objDatTasa->version = $this->_request->getPost('version');
            if ($this->model[0]->modificarDatTasa($objDatTasa)) {
                echo("{'codMsg':-1}");
                return;
            } else {
                echo("{'codMsg':-2}");
                return;
            }
        } catch (ZendExt_Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Elimina una tasa
     *
     * @return mixed Código y tasas que no se pudieron eliminar
     */
    function elimtasaAction()
    {
        $arrayTasas = json_decode($this->_request->getPost('idtasa'));
        $variablesModificar = "";
        $tasas = $this->model[0]->eliminarDatTasa(
            $arrayTasas, $variablesModificar
        );
        $resultTasasNomidi = ($tasas != "") ? explode(',', $tasas) : "";
        if (is_array($resultTasasNomidi)) {
            echo("{'codMsg':-2, 'tasas':'" . implode(',', $resultTasasNomidi)
                . "'}"); //hubieron tasas que no se puedieron eliminar.
        } else {
            if (count($arrayTasas) == 1) {
                echo("{'codMsg':-1, 'tasas':'" . implode(
                        ',', $resultTasasNomidi
                    ) . "'}"); //la tasa ha sido eliminada correctamente.
            } else {
                echo("{'codMsg':-3, 'tasas':'" . implode(
                        ',', $resultTasasNomidi
                    ) . "'}"); //las tasas han sido eliminadas correctamente.
            }
        }
    }

    /**
     * Adiciona una tasa
     *
     * @return mixed Código: -1 existe la tasa, 0 no existe.
     */
    function veriftasaAction()
    {
        $persn = DatTasa::buscarDatTasa(
            array('idtasa' => $this->_request->getPost('idtasa'))
        );
        $auxOne = $this->auxVerificar($persn);
        $auxTwo = $this->auxVerificarDos($persn);
        if ($auxOne && $auxTwo) {
            echo("{'retorno': '-1'}");
            return;
        }
        echo("{'retorno': '0'}");
    }

    private function auxVerificar($persn)
    {
        if ($persn['datos'][0]['venta'] == $this->_request->getPost('venta')
            && $persn['datos'][0]['compra'] == $this->_request->getPost('compra')
            && $persn['datos'][0]['nombretasa'] == $this->_request->getPost(
                'nombretasa'
            )
            && $persn['datos'][0]['desde'] == $this->_request->getPost('desde')
            && $persn['datos'][0]['hasta'] == $this->_request->getPost('hasta')
        ) {
            return true;
        }
        return false;
    }

    private function auxVerificarDos($persn)
    {
        if ($persn['datos'][0]['idcliente'] == $this->_request->getPost(
                'idlciente'
            )
            && $persn['datos'][0]['referencia'] == $this->_request->getPost(
                'referencia'
            )
            && $persn['datos'][0]['factordeconversion'] == $this->_request->getPost('factordeconversion')
            && $persn['datos'][0]['idtipotasa'] == $this->_request->getPost(
                'idtipotasa'
            )
            && $persn['datos'][0]['idmoneda'] == $this->_request->getPost(
                'idmoneda'
            )
            && $persn['datos'][0]['idmonedacontable'] == $this->_request->getPost(
                'idmonedacontable'
            )
        ) {
            return true;
        }
        return false;
    }

}
