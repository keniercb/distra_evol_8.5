<?php

class DatCategorizacioncientificaModel extends ZendExt_Model implements IConceptoExport
{

    protected $objCategoria;
    protected $response;

    function __construct()
    {
        $this->objCategoria = new DatCategorizacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCategoriasByPersonas($idpersona, $limit = null, $start = 0)
    {
        try {
            $this->response->data = $this->objCategoria->getCategoriasByPersona(self::reflectArray($idpersona), $limit, $start);
            $this->response->quantity = $this->objCategoria->getCantCategoriasByPersona(self::reflectArray($idpersona));
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

    public function getTipoCategoria()
    {
        try {
            $objTipoCategoria = new NomTipocategoriaModel();
            return $objTipoCategoria->getTipoCategoriaActive(null, null, null, true);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNomCategorias()
    {
        try {
            $objTipoCategoria = new NomCategoriaModel();
            return $objTipoCategoria->getCategoriaActivo($filtro = null, $limit = null, $start = 0, true);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addCategorias(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatCategorizacion');
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
                        foreach ($data[$v->idcategorizacion] as $k => $val) {
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
        return $query->addSelect('dcientf.*')->leftJoin($baseAlias . '.DatCategorizacion dcientf');
    }
}

