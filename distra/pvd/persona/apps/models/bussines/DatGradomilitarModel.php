<?php

/**
 * Class DatGradomilitarModel
 */
class DatGradomilitarModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var DatGradomilitar
     */
    protected $objGrado;
    /**
     * @var bool|string
     */
    protected $fechaActual;
    /**
     * @var ConfiguracionGeneralService
     */
    protected $objEstructuraService;

    /**
     *
     */
    public function __construct()
    {
        $this->objGrado = new DatGradomilitar();
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
     * @param     $idpersona
     * @param     $filtro
     * @param     $limit
     * @param int $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getGradosMilitaresByPersona($idpersona, $filtro, $limit, $start = 0)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $grados = $this->getNomMilitaryDegrees();
            $response->data = $this->objGrado->getGradosMilitaresByPersona($arrayPersonas, $filtro, $limit, $start);
            $response->quantity = ($limit > 0) ? $this->objGrado->getCantGradosMilitaresByPersona(
                $arrayPersonas, $filtro
            ) : count($response->data);
            foreach ($response->data as $k => $v) {
                foreach ($grados as $rec) {
                    if ($rec['idgrado'] === $v['idgrado']) {
                        $response->data[$k]['denomgrado'] = $rec['denominacion'];
                        $response->data[$k]['icongrado'] = $rec['icono'];
                        $response->data[$k]['jerarquia'] = $rec['orden'];
                        $response->data[$k]['marina'] = $rec['marina'];
                        break;
                    }
                }
            }

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

    /**
     * @return mixed
     */
    public function getNomMilitaryDegrees()
    {
        return $this->objEstructuraService->getNomMilitaryDegrees();
    }

    /**
     * @param array $data
     * @param       $idpersona
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function addGradosMilitares(array $data, $idpersona)
    {
        try {
            $collection = new Doctrine_Collection('DatGradomilitar');
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

    /**
     * @param array $data
     * @param array $ids
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function modGradosMilitares(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objGrado->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idgradomilitar] as $k => $val) {
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
     * @param $id
     * @param $idpersona
     *
     * @throws Exception
     */
    public function delGradosMilitares($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrIdGrados = $this->reflectArray($id);
            $this->objGrado->delGradosMilitares($arrIdGrados, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getGradoActual($idpersona)
    {
        $response->data = $this->objGrado->getGradoActual($this->reflectArray($idpersona));
        if (count($response->data) > 0) {
            $grados = $this->getNomMilitaryDegrees();
        }
        foreach ($response->data as $k => $v) {
            foreach ($grados as $rec) {
                if ($rec['idgrado'] === $v['idgrado']) {
                    $response->data[$k]['denomgrado'] = $rec['denominacion'];
                    $response->data[$k]['icongrado'] = $rec['icono'];
                    $response->data[$k]['jerarquia'] = $rec['orden'];
                    $response->data[$k]['marina'] = $rec['marina'];
                    break;
                }
            }
        }

        return $response->data;

    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dgm.*')->leftJoin($baseAlias . '.DatGradomilitar dgm');
    }
}

