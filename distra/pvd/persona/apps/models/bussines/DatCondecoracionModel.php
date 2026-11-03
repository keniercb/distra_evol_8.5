<?php

class DatCondecoracionModel extends ZendExt_Model implements IConceptoExport
{
    protected $objCondecoraciones;

    function __construct()
    {
        $this->objCondecoraciones = new  DatCondecoracion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCondecoracionesByPersonas($idpersona, $filtro, $limit, $start)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $response->data = $this->objCondecoraciones->getCondecoracionesByPersona(
                $arrayPersonas, $filtro, $limit, $start
            );
            $response->quantity = ($limit > 0) ? $this->objCondecoraciones->getCantCondecoracionesByPersona(
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

    public function addCondecoraciones(array $data, $idpersona)
    {
        try {
            $collection = new Doctrine_Collection('DatCondecoracion');
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

    public function modCondecoraciones(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objCondecoraciones->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idcondecoracionp] as $k => $val) {
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

    public function delCondecoraciones($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdCondecoraciones = $this->reflectArray($id);
            $this->objCondecoraciones->delCondecoraciones($arrayIdCondecoraciones, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getOnlyCondecoraciones($idpersona, $filtro, $limit, $start)
    {
        try {
            $response->data = $this->objCondecoraciones->getOnlyCondecoraciones($idpersona, $filtro, $limit, $start);
            $response->quantity = ($limit > 0) ? $this->objCondecoraciones->getCantOnlyCondecoraciones(
                $idpersona, $filtro
            ) : count($response->data);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dcond.*')->leftJoin($baseAlias . '.DatCondecoracion dcond');
    }
}

