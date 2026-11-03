<?php

class DatEstadosaludModel extends ZendExt_Model implements IConceptoExport
{
    protected $objEstadoSalud;

    private $response;

    function __construct()
    {
        $this->objEstadoSalud = new DatEstadosalud();
    }

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
    public function getEstadoSaludByPersona($idpersona, $filtro, $limit, $start)
    {
        try {
            $this->response->data = $this->objEstadoSalud->getEstadoSaludByPersona(
                $this->reflectArray($idpersona), $filtro, $limit, $start
            );
            $this->response->quantity = ($limit > 0) ? $this->objEstadoSalud->getCantEstadoSaludByPersona(
                $this->reflectArray($idpersona), $filtro
            ) : count($this->response->data);

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

    public function addEstadoSalud(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatEstadosalud');
                foreach ($data as $p => $array) {
                    foreach ($array as $k => $v) {
                        $collection[$p][$k] = $v;
                    }
                    $collection[$p]['idpersona'] = $idpersona;
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modEstadoSalud(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objEstadoSalud->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idestadosalud] as $k => $val) {
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

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('desta.*')->leftJoin($baseAlias . '.DatEstadosalud desta');
    }
}

