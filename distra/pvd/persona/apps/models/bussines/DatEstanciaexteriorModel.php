<?php

/**
 * Class DatEstanciaexteriorModel
 */
class DatEstanciaexteriorModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var
     */
    protected $objEstanciaExterior;
    protected $objConfig;

    function __construct()
    {
        $this->objEstanciaExterior = new DatEstanciaexterior();
        $this->objConfig = new ConfiguracionGeneralService();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $idpersona
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getEstanciasExteriorByPersonas($idpersona, $filtro, $limit, $start)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $response->data = $this->objEstanciaExterior->getEstanciasExteriorByPersonas(
                $arrayPersonas, $filtro, $limit, $start
            );

            foreach ($response->data as $k => $v) {
                $pais=$this->objConfig->findContryById($v['idpais']);
                $response->data[$k]['denompais'] = $pais['nombrepais'];
            }

            $response->quantity = ($limit > 0) ? $this->objEstanciaExterior->getCantEstanciasExteriorByPersonas(
                $arrayPersonas, $filtro
            ) : count($response->data);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function addEstanciasExterior(array $data, $idpersona)
    {
        try {
            $collection = new Doctrine_Collection('DatEstanciaexterior');
            foreach ($data as $p => $array) {
                foreach ($array as $k => $v) {
                    $collection[$p][$k] = $v;
                }
                $collection[$p]['idpersona'] = $idpersona;
            }
            $collection->save();
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modEstanciasExterior(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objEstanciaExterior->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idestanciaexterior] as $k => $val) {
                            $collection[$p]->$k = $val;
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

    public function delEstanciasExterior($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdEstanciasExterior = $this->reflectArray($id);
            $this->objEstanciaExterior->delEstanciasExterior($arrayIdEstanciasExterior, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('deex.*')->leftJoin($baseAlias . '.DatEstanciaexterior deex');
    }
    
}

