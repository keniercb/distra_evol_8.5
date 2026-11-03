<?php

/**
 * Class DatOcupaciontiempoguerraModel
 */
class DatOcupaciontiempoguerraModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var DatOcupaciontiempoguerra
     */
    protected $objCargosTiempoGuerra;

    protected $fechaActual;

    protected $objEstructuraService;

    protected $objConfigGeneralService;

    /**
     *
     */
    function __construct()
    {
        $this->objCargosTiempoGuerra = new DatOcupaciontiempoguerra();
        $this->objConfigGeneralService = new ConfiguracionGeneralService();
        $this->fechaActual = date('d/m/Y');
        $this->objEstructuraService = new EyCServices();
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
     * @param $filtro
     * @param $limit
     * @param $start
     * @return mixed
     * @throws Exception
     */
    public function getCargosGuerraByPesona(array $idpersona, $filtro, $limit, $start)
    {
        try {
            $res = new stdClass();
            $res->data = $this->objCargosTiempoGuerra->getCargosByPersona($idpersona, $filtro, $limit, $start);
            $res->quantity = $this->objCargosTiempoGuerra->getCantCargosByPersona($idpersona, $filtro);
            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param $idpersona
     * @throws Exception
     */
    public function delCargosGuerra(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $this->objCargosTiempoGuerra->delCargosTiempoGuerra($data, $idpersona);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param $idpersona
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function addCargosGuerra(array $data, $idpersona)
    {
        try {
			//print_r($idpersona);die;
            if (count($data) > 0) {
                $dirOficial = $this->objCargosTiempoGuerra->getCargosOficialByPersona($this->reflectArray($idpersona));
				//print_r($dirOficial);die;
                $cant = 0;
                $collection = new Doctrine_Collection('DatOcupaciontiempoguerra');
                foreach ($data as $p => $array) {
                    foreach ($array as $k => $v) {
                        switch ($k) {
                            case 'oficial':
                                $cant += ($this->isActual($array['fdesde'], $array['fhasta']) && $v === 1) ? 1 : 0;
                                break;
                            default:
                                break;
                        }
                        $collection[$p][$k] = $v;
                    }
                    $collection[$p]['idpersona'] = $idpersona;
                }
                if (count($dirOficial) >= 1 && $cant >= 1) {
                    throw new Exception('Ya se ha registrado un cargo como principal.', 3);
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param $idpersona
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function modCargosGuerra(array $data, array $ids, $idpersona)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objCargosTiempoGuerra->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idocupaciontiempoguerra] as $k => $val) {
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
     * @param $data
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

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('docug.*')->leftJoin($baseAlias . '.DatOcupaciontiempoguerra docug');
    }

    public function getRoot($id)
    {
        $root = $this->objEstructuraService->getEstructura($id);
        $array = array();
        foreach ($root as $v) {
            $p = count($array);
            $array[$p]->id = $v->idestructura;
            $array[$p]->text = $v->denominacion;
            $array[$p]->codigo = $v->codigo;
            $array[$p]->_parent = $v->idpadre;
            $array[$p]->expanded = true;
            $array[$p]->tipo_concepto = $v->concepto;
            $array[$p]->idconcepto = $v->idconcepto;
            $array[$p]->icon = $v->icon;
            $array[$p]->children = $this->getEstructura($v->idestructura);
        }
        return $array;
    }

    public function getEstructura($id, $ext = false)
    {
        $arrEntidad = $this->objEstructuraService->getHijosEstructura($id);

        $array = array();
        foreach ($arrEntidad as $v) {
            $p = count($array);
            $array[$p] = $v;
            if ($v->cantidad != '' && $v->cantidad_real != '') {
                $array[$p]->text = $v->text . " <b>($v->cantidad | $v->cantidad_real)</b>";

            }
            if ($v->idconcepto == 7 || $v->idconcepto == 10) {


                $pers = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersonaSIAC(null, null, null, null, null, $v->id);

                $cant = $v->cantidad - count($pers);
                foreach ($pers->data as $per => $b) {
                    $grado = ZendExt_IoC::getInstance()->metadatos->dameGrado($b['idgrado']);
                    $personas[$per]['text'] = $grado[0]['grado'] . ' ' . $b['nombreapellidos'];
                    $personas[$per]['idpersona'] = $b['idpersona'];
                    $personas[$per]['nombre'] = $b['nombreapellidos'];
                    $personas[$per]['grado'] = $grado[0]['grado'];
                    $personas[$per]['icon'] = $b['foto'] ? 'data:image/jpg;base64,' . $b['foto'] : '/pvd/persona/views/images/persona/no-photo-male.png';
                    $personas[$per]['leaf'] = true;
                    $array[$p]->children = $personas;

                }

                $array[$p]->leaf = false;

            }

        }
        return $array;

    }



}

