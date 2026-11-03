<?php

class DatCategoriaModel extends ZendExt_Model implements IConceptoExport
{
    protected $objCategoria;

    protected $response;

    function __construct()
    {
        $this->objCategoria = new DatCategoria();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCategoriasByPersonas($idpersona, $limit = null, $start = 0)
    {
        try {
            $this->response->data = $this->objCategoria->getCategoriasByPersona(
                self::reflectArray($idpersona), $limit, $start
            );
            $this->response->quantity = $limit > 0 ? $this->objCategoria->getCantCategoriasByPersona(
                self::reflectArray($idpersona)
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

    public function addCategorias(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatCategoria');
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

    public function modCategorias(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objCategoria->getById($ids);
             
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idcategoria] as $k => $val) {
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

    public function delCategorias($id, $idpersona)
    {
        try {
            $arrayPersonas = self::reflectArray($idpersona);
            $arrayIdCategorias = self::reflectArray($id);
            $this->objCategoria->delCategorias($arrayIdCategorias, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dcateg.*')->leftJoin($baseAlias . '.DatCategoria dcateg');
    }
}