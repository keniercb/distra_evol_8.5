<?php

/**
 * Class DatCuentabancariaModel
 */
class DatCuentabancariaModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var DatCuentabancaria
     */
    protected $objCuenta;

    /**
     * @var
     */
    protected $response;

    /**
     *
     */
    function __construct()
    {
        $this->objCuenta = new DatCuentabancaria();
    }

    /**
     * @throws ZendExt_Exception
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param      $idpersona
     * @param null $limit
     * @param int $start
     *
     * @throws Exception
     */
    public function getCuentaBancariaByPersona($idpersona, $limit = null, $start = 0, $all)
    {
        try {
            $param = array(
                '0' => true, '1' => 'activo', '2' => 'hist');
            $param = isset($param[$all]) ? $param[$all] : true;
            $this->response->data = $this->objCuenta->getCuentaBancariaByPersona(
                self::reflectArray($idpersona), $limit, $start, $param
            );
            $this->response->quantity = $limit > 0 ? $this->objCuenta->getCantCuentaBancariaByPersona(
                self::reflectArray($idpersona), $param
            ) : count($this->response->data);
            $objService = new ConfiguracionGeneralService();
            $bancos = $objService->getBancos();
            foreach ($this->response->data as $k => $v) {
                foreach ($bancos as $j) {
                    if ($v['idbanco'] === $j->idbanco) {
                        $this->response->data[$k]['denombanco'] = $j->nombre;
                        break;
                    }
                }
                foreach ($this->getMonedas()->data as $j) {
                    if ($v['idmoneda'] === $j['idmoneda']) {
                        $this->response->data[$k]['denommoneda'] = $j['codigoiso'];
                        $this->response->data[$k]['idmoneda'] = $j['idmoneda'];
                        break;
                    }
                }
            }

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public static function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function getMonedas()
    {
        try {
            $objService = new ConfiguracionGeneralService();
            //$res = new stdClass();
            $this->res->data = $objService->getMoneda();
            $this->res->quantity = count($this->res->data);

            return $this->res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addCuentaBancaria(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatCuentabancaria');
                foreach ($data as $p => $array) {
                    foreach ($array as $k => $v) {
                        $collection[$p][$k] = (!empty($v)) ? $v : null;
                    }
                    $collection[$p]['idpersona'] = $idpersona;
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modCuentaBancaria(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objCuenta->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idcuentabancaria] as $k => $val) {
                            $collection[$p]->$k = (!empty($val)) ? $val : null;
                        }
                    }
                    if ($collection->isModified()) {
                        $collection->save();
                    }
                }
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function delCuentaBancaria($id, $idpersona)
    {
        try {
            $arrayPersonas = self::reflectArray($idpersona);
            $arrIdCuenta = self::reflectArray($id);
            $this->objCuenta->delCuentaBancaria($arrIdCuenta, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getBancos()
    {
        try {
            $objService = new ConfiguracionGeneralService();
            $this->response->data = $objService->getBancos();
            $this->response->quantity = count($this->response->data);

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dbanc.*')->leftJoin($baseAlias . '.DatCuentabancaria dbanc');
    }
}