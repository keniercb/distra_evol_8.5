<?php

class DatAfiliacionModel extends ZendExt_Model implements IConceptoExport
{
    protected $objAfiliones;

    function __construct()
    {
        $this->objAfiliones = new  DatAfiliacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAfiliacionesByPersonas($idpersona, $filtro, $limit, $start)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $response->data = $this->objAfiliones->getAfiliacionesByPersona($arrayPersonas, $filtro, $limit, $start);
            $response->quantity = ($limit > 0) ? $this->objAfiliones->getCantAfiliacionesByPersona(
                $arrayPersonas, $filtro
            ) : count($response->data);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

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

    public function addAfiliaciones(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatAfiliacion');
                foreach ($data as $p => $array) {
                    foreach ($array as $k => $v) {
                        if ($k === 'DatCargoorganizacion') {
                            foreach ($v as $j => $rec) {
                                foreach ($rec as $c => $record) {
                                    $collection[$p]['DatCargoorganizacion'][$j][$c] = (!empty($record)) ? $record : null;
                                }
                            }
                        } else {
                            $collection[$p][$k] = $v;
                        }
                    }
                    $collection[$p]['idpersona'] = $idpersona;
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modAfiliaciones(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objAfiliones->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idafiliacion] as $k => $val) {
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

    public function delAfiliaciones($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdAfiliaciones = $this->reflectArray($id);
            $this->objAfiliones->delAfiliaciones($arrayIdAfiliaciones, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dafi.*')->leftJoin($baseAlias . '.DatAfiliacion dafi');
    }
}

