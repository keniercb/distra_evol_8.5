<?php

/**
 * Class DatContactoModel
 */
class DatContactoModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var DatContacto
     */
    protected $objContacto;

    /**
     *
     */
    function __construct()
    {
        $this->objContacto = new DatContacto();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     * @param       $limit
     * @param       $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getContactos(array $idpersona, $filtro, $limit, $start)
    {
        try {
            $response->data = $this->objContacto->getContactos($idpersona, $filtro, $limit, $start);
            $response->quantity = ($limit > 0)
                ? $this->objContacto->getCantContactos($idpersona, $filtro)
                : count(
                    $response->data
                );

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param       $idpersona
     *
     * @throws Exception
     */
    public function addContactos(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $dirOficial = $this->objContacto->getContactosOficiales($this->reflectArray($idpersona));
                $datosActuales = $this->objContacto->getContactos(array($idpersona));
                $cant = 0;
                $contactos = null;
                $collection = new Doctrine_Collection('DatContacto');
                foreach ($data as $p => $array) {
                    foreach ($array as $k => $v) {
                        switch ($k) {
                            case 'oficial':
                                $cant += ($v == true) ? 1 : 0;
                                break;
                            case 'contacto':
                                $contactos = $this->verifExist($v, 'contacto', $datosActuales) ? $v : $contactos;
                                break;
                            default:
                                break;
                        }
                        $collection[$p][$k] = $v;
                    }
                    $collection[$p]['idpersona'] = $idpersona;
                }
                /*if (count($dirOficial) >= 1 && $cant >= 1) {
                    throw new Exception('Ya se ha registrado un contacto como principal.', 3);
                }*/
                if (!empty($contactos)) {
                    throw new Exception("El contacto $contactos ya existe", 3);
                }
                $collection->save();
            }
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

    /**
     * @param      $val
     * @param      $index
     * @param      $array
     * @param null $id
     *
     * @return bool
     */
    protected function verifExist($val, $index, $array, $id = null)
    {
        $cantd = count($array);
        if ($cantd > 0) {
            while ($cantd > 0) {
                $arr = $array[$cantd - 1];
                if ((isset($id) && isset($arr['idcontacto'])) && $arr['idcontacto'] == $id) {
                    $cantd--;
                } elseif ($arr[$index] == $val) {
                    return true;
                } else {
                    $cantd--;
                }
            }
        }

        return false;
    }

    /**
     * @param array $data
     * @param array $ids
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function modContactos(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objContacto->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idcontacto] as $k => $val) {
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

    /**
     * @param array $ids
     * @param array $idpersona
     *
     * @throws Exception
     */
    public function delContactos($ids, $idpersona)
    {
        try {
            $this->objContacto->delContactos($this->reflectArray($ids), $this->reflectArray($idpersona));
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getContactoByMedio($idpersona, $idmedio, $limit = null, $start = 0)
    {
        try {
            $response->data = $this->objContacto->getContactoByMedio(
                $this->reflectArray($idpersona), $this->reflectArray($idmedio), $limit, $start
            );
            $response->quantity = ($limit > 0) ? $this->objContacto->getCantContactoByMedio(
                $this->reflectArray($idpersona), $this->reflectArray($idmedio)
            ) : count($response->data);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dcont.*')->leftJoin($baseAlias . '.DatContacto dcont');
    }

    /**
     * @param $idpersona
     * @param $todos
     * @return mixed
     */
    public function obtenerCorreoByIdpPers($idpersona, $todos) {
        try {
            $obj = new DatContacto();
            return $obj->obtenerCorreoByIdPers($idpersona, $todos);
        } catch (Exception $e) {}
    }
}

