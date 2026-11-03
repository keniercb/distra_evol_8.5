<?php

/**
 * Clase controladora para gestionar el Nomenclador de desgloses.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage Multimoneda/Controllers
 * @copyright  XETID
 * @version    1.0-0
 */
class GestnomdesgloseController extends ZendExt_Controller_Secure
{
    /**
     * Constuctor de la clase
     */
    public function init()
    {
        parent::init();
    }

    /**
     * Inicializa la vista
     */
    public function gestnomdesgloseAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /**
     * Obtiene los desgloses
     *
     * @return mixed Desgloses
     * @throws Doctrine_Exception
     */
    public function getnomdesgloseAction()
    {
        try {
            $params['start'] = $this->_request->getPost('start');
            $params['limit'] = $this->_request->getPost('limit');
            $params['sfFiltro'] = $this->_request->getPost('sfFiltro');
            $result = NomDezglozemonedas::GetNomDesglosesMonedasByRange(
                $params
            );
            echo(json_encode($result));
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    /**
     * Adiciona un desglose
     *
     * @return int -1 si se adicionó correctamente,-2 si ya existe el valor,-3 si existe la denominación
     * @throws Doctrine_Exception
     */
    public function addnomdesgloseAction()
    {
        try {
            $objDesglose = new NomDezglozemonedas();
            $objDesglose->valor = $this->_request->getPost('valor');
            $objDesglose->categoria = $this->_request->getPost('idcategoria');
            $objDesglose->denominacion = $this->_request->getPost(
                'denominacion'
            );
            $result = NomDezglozemonedasModel::Adicionar($objDesglose);
            echo("{'codMsgg':$result}");
            return;
        } catch (Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Modifica un desglose
     *
     * @return int -1 si se modificó correctamente,-2 si ya existe el valor,-3 si ya existe la denominación
     * @throws Doctrine_Exception
     */
    public function modnomdesgloseAction()
    {
        try {
            $objDesglose = Doctrine::getTable('NomDezglozemonedas')->find(
                $this->_request->getPost('iddezglozemonedas')
            );
            $objDesglose->valor = $this->_request->getPost('valor');
            $objDesglose->categoria = $this->_request->getPost('idcategoria');
            $objDesglose->denominacion = $this->_request->getPost(
                'denominacion'
            );
            $result = NomDezglozemonedasModel::Modificar($objDesglose);
            echo("{'codMsgg':$result}");
            return;
        } catch (Exception $ee) {
            throw $ee;
        }
    }

    /**
     * Elimina un desglose
     *
     * @return mixed Codigo de confirmación y desgloses que no pudieron eliminarse
     * @throws Doctrine_Connection_Pgsql_Exception
     * @throws Doctrine_Exception
     */
    public function delnomdesgloseAction()
    {
        try {
            $pIdDesglose = json_decode(
                stripslashes($this->_request->getPost('iddezglozemonedas'))
            );
            $variablesModificar = "";
            $result = NomDezglozemonedasModel::eliminarDesglose(
                $pIdDesglose, $variablesModificar
            );
            $resultDelDesglose = ($result != "") ? explode(',', $result) : "";
            if (is_array($resultDelDesglose)) {
                echo("{'codMsg':-3, 'desgloses':'" . implode(
                        ', ', $resultDelDesglose
                    ) . "'}");
            } else {
                if (count($pIdDesglose) == 1) {
                    echo("{'codMsg':-1, 'desgloses':'" . implode(
                            ',', $resultDelDesglose
                        ) . "'}");
                } else {
                    echo("{'codMsg':-2, 'desgloses':'" . implode(
                            ',', $resultDelDesglose
                        ) . "'}");
                }
            }
        } catch (Exception $ee) {
            throw $ee;
        }
    }

}