<?php

class DatCargoorganizacionModel extends ZendExt_Model implements IConceptoExport
{
    protected $objCargosOrganizacion;

    function __construct()
    {
        $this->objCargosOrganizacion = new  DatCargoorganizacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCargosByOrganizacion($idpersona, $filtro, $limit, $start)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $response->data = $this->objCargosOrganizacion->getCargosByOrganizacion(
                $arrayPersonas, $filtro, $limit, $start
            );
            $response->quantity = ($limit > 0) ? $this->objCargosOrganizacion->getCantCargosByOrganizacion(
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

    public function addCargosOrganizacion(array $data)
    {
        try {
            $collection = new Doctrine_Collection('DatCargoorganizacion');
            foreach ($data as $p => $array) {
                foreach ($array as $k => $v) {
                    $collection[$p][$k] = $v;
                }
            }
            $collection->save();
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modCargosOrganizacion(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objCargosOrganizacion->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idcargoorganizacionp] as $k => $val) {
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

    public function delCargosOrganizacion($id, $idpersona, $idafiliacion)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdCargoOrganizacion = $this->reflectArray($id);
            $arrayIdAfiliaciones = $this->reflectArray($idafiliacion);
            $this->objCargosOrganizacion->delCargosByOrganizacion(
                $arrayIdCargoOrganizacion, $arrayPersonas, $arrayIdAfiliaciones
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('ca.*')->leftJoin($baseAlias . '.DatCargoorganizacion ca');
    }

}

