<?php

/**
 * Class DatDireccionModel
 */
class DatDireccionModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var DatDireccion
     */
    protected $objDirecciones;

    protected $fechaActual;

    protected $objConfigGeneralService;

    /**
     *
     */
    function __construct()
    {
        $this->objDirecciones = new DatDireccion();
        $this->objConfigGeneralService = new ConfiguracionGeneralService();
        $this->fechaActual = date('d/m/Y');
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
    public function getDireccionesByPesona(array $idpersona, $filtro, $limit, $start)
    {
        try {
            $this->objDirecciones = new DatDireccion();
            $res = new stdClass();
            $res->data = $this->objDirecciones->getDireccionesByPesona($idpersona, $filtro, $limit, $start);
            $res->quantity = $this->objDirecciones->getCantDireccionesByPesona($idpersona, $filtro);
            foreach ($res->data as $k => $v) {
                $pais = ZendExt_IoC::getInstance()->datosmaestros->obtenerPais($v['idpais']);
                $prov = ZendExt_IoC::getInstance()->datosmaestros->getElementoid($v['idprovincia']);
                $muni = ZendExt_IoC::getInstance()->datosmaestros->getElementoid($v['idmunicipio']);
                $res->data[$k]['pais'] = $pais['nombrepais'];
                $res->data[$k]['denomprov'] = $prov[0]['denominacion'];
                $res->data[$k]['denommunic'] = $muni[0]['denominacion'];
            }

            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @return mixed
     * @throws Exception
     */
    public function getProvMuni($idPais = null)
    {
        try {
            $res = new stdClass();
            $res->prov = $this->objConfigGeneralService->getNivelEstructuralPorPais($idPais, 16);
            $res->muni = $this->objConfigGeneralService->getNivelEstructuralPorPais($idPais, 14);
            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param       $id
     * @param array $array
     *
     * @return string
     */
    public function findInDpa($id, array $array)
    {
        if (count($array) > 0) {
            foreach ($array as $k => $v) {
                if ($v['iddpt'] == $id) {
                    return $v['denominacion'];
                }
            }
        }

        return '';
    }

    /**
     * @return array
     * @throws Exception
     */
    public function getTreeProvMuni($idPais = null) //Antes estaba en 1
    {
        try {
            $tree = array();
            $prov_muni = $this->getProvMuni($idPais);
            $prov = $prov_muni->prov;
            $mun = $prov_muni->muni;
            foreach ($prov as $k => $v) {
                $tree[$k] = $this->formatTree($v, false);
                $tree[$k]['children'] = $this->getSons($mun, $v['iddpt']);
            }
            return $tree;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param bool $leaf
     *
     * @return array
     */
    protected function formatTree(array $data, $leaf = false)
    {
        return array(
            'text' => $data['denominacion'],
            'leaf' => $leaf,
            'iddpt' => $data['iddpt'],
            'idpais' => $data['idpais']
        );
    }

    /**
     * @param array $sons
     * @param       $idpadre
     *
     * @return array
     */
    protected function getSons(array $sons, $idpadre)
    {
        $sonsFound = array();
        foreach ($sons as $k => $v) {
            if ($v['idpadre'] == $idpadre) {
                $sonsFound[] = $this->formatTree($v, true);
            }
        }

        return $sonsFound;
    }

    /**
     * @param array $data
     * @param       $idpersona
     *
     * @throws Exception
     */
    public function delDirecciones(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $this->objDirecciones->delDirecciones($data, $idpersona);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param       $idpersona
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function addDirecciones(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $dirOficial = $this->objDirecciones->getDireccionOficialByPersona($this->reflectArray($idpersona));
                $cant = 0;
                $collection = new Doctrine_Collection('DatDireccion');
                foreach ($data as $p => $array) {
                    list($cant, $collection) = $this->setDataAdd($array, $cant, $collection, $p);
                    $collection[$p]['idpersona'] = $idpersona;
                }
                if (count($dirOficial) >= 1 && $cant >= 1) {
                    throw new Exception('', 3);
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
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
     * @param $array
     * @param $cant
     * @param $collection
     * @param $p
     *
     * @return array
     */
    private function setDataAdd($array, $cant, $collection, $p)
    {
        foreach ($array as $k => $v) {
            switch ($k) {
                case 'oficial':
                    $cant += ($this->isActual($array['fdesde'], $array['hasta']) && $v === 1) ? 1 : 0;
                    break;
                default:
                    break;
            }
            $collection[$p][$k] = $v;
        }

        return array($cant, $collection);
    }

    protected function isActual($fi, $ff)
    {
        if (!empty($ff)) {
            $arrfi = explode('/', $fi);
            $arrff = explode('/', $ff);
            $arrfa = explode('/', $this->fechaActual);
            $fi = $arrfi[2] + $arrfi[1] + $arrfi[0];
            $ff = $arrff[2] + $arrff[1] + $arrff[0];
            $fa = $arrfa[2] + $arrfa[1] + $arrfa[0];

            return ($fi <= $fa && $fa <= $ff) ? true : false;
        }

        return true;
    }

    /**
     * @param array $data
     * @param       $idpersona
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function modDirecciones(array $data, array $ids, $idpersona)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objDirecciones->getById($ids);
                $this->setDataMod($data, $collection);
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param       $collection
     */
    private function setDataMod(array $data, $collection)
    {
        if (count($collection) > 0) {
            foreach ($collection as $p => $v) {
                foreach ($data[$v->iddireccion] as $k => $val) {
                    $collection[$p]->$k = $val;
                }
            }
            if ($collection->isModified()) {
                $collection->save();
            }
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('ddir.*')->leftJoin($baseAlias . '.DatDireccion ddir');
    }

    protected function verifExist($val, $index, $array, $id = null)
    {
        $cantd = count($array);
        if ($cantd > 0) {
            while ($cantd > 0) {
                $arr = $array[$cantd - 1];
                if ((isset($id) && isset($arr['iddireccion'])) && $arr['iddireccion'] == $id) {
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
}