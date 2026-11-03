<?php

/**
 * Class DatSituacionModel
 */
class DatSituacionModel extends ZendExt_Model
{
    /**
     * @var
     */
    protected $objAccesoSinDominio;
    /**
     * @var EyCServices
     */
    protected $objEstructuraService;
    /**
     * @var
     */
    protected $fechaActual;
    /**
     * @var
     */
    protected $response;
    /**
     * @var SituacionLaboralRepository
     */
    protected $objSituacionLaboral;

    /**
     *
     */
    function __construct()
    {
        $this->objSituacionLaboral = new SituacionLaboralRepository();
        $this->objEstructuraService = new EyCServices();
    }

    /**
     * @param Doctrine_Collection $collection
     * @param                     $data
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public static function linkCollectionToSave(Doctrine_Collection $collection, $data)
    {
        try {
            foreach ($data as $k => $v) {
                if (!empty($v)) {
                    $collection[0][$k] = $v;
                }
            }

            return $collection;
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    /**
     * @throws ZendExt_Exception
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param     $filtro
     * @param     $idEntidad
     * @param     $idcargo
     * @param     $limit
     * @param int $start
     *
     * @return mixed
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getPersonasConSituacionLaboral(
        $filtro = null, $idEntidad = null, $idcargo = null, $limit = null, $start = 0
    )
    {
        $cargos = array();
        if ($idEntidad !== $idcargo || empty($idEntidad)) {
            $cargos = empty($idcargo) ? $this->getArryOfCargos(
                ZendExt_GlobalConcept::getInstance()->Perfil->idestructuracomun, true
            ) : $this->getArryOfCargos($idcargo, true);
            $idEntidad = null;
        }
        $this->response->data = $this->objSituacionLaboral->getPersonaConSituacionLaboral(
            $filtro, $idEntidad, $cargos, $limit, $start
        );
        $this->response->quantity = $limit > 0 ? $this->objSituacionLaboral->getCantPersonaConSituacionLaboral(
            $filtro, $idEntidad, $cargos
        ) : count($this->response->data);
        $data = array();
        foreach ($this->response->data as $k => $v) {
            $data[$k] = array(
                'idsituacionlaboralp' => $v['dme_idsituacionlaboralp'],
                'idpersonaentidad' => $v['dpen_idpersonaentidad'],
                'idpersona' => $v['dp_idpersona'], 'identidad' => $v['dpen_identidad'],
                'idcargo' => $v['dme_idcargo'], 'idarea' => $v['dme_idarea'], //'area' => $v['dme_area'],
                //'cargo' => $v['dme_cargo'],
                'falta' => $v['dpen_falta'], 'fbaja' => $v['dpen_fbaja'], 'fdesde' => $v['dme_fdesde'],
                'fhasta' => $v['dme_fhasta'], 'salario' => $v['dcs_salario'],
                'categoria' => $v['dcdcccategocup_categoria'], 'grupocomplejidad' => $v['dcgc_grupocomplejidad'],
                'nivel_preparacion' => $v['dcnpre_preparacion'], 'numid' => $v['dpident_numid'],
                'nombreapellidos' => $v['dp_nombreapellidos'], 'sexo' => $v['dp_sexo'], 'foto' => $v['dpfot_foto'],
                'idsituacion' => $v['dme_idsituacion'], 'asociadocargo' => $v['ns_asociadocargo'],
                'denomsituacion' => $v['ns_denomsituacion'], 'color' => $v['ns_color'],
                'idprocedenciasocial' => $v['npsc_idprocedenciasocial'],
                'denomprocedenciasocial' => $v['npsc_denomprocedenciasocial']
                //'idmotivobaja' => $v['npsc_denomprocedenciasocial']
            );
            $entidad = $this->objEstructuraService->getEstructura($v['dpen_identidad']);
            $data[$k]['entidad'] = $entidad[0]->denominacion ? $entidad[0]->denominacion : $v['dpen_entidad'];
            if (!empty($v['dme_idarea'])) {
                $area = $this->objEstructuraService->getEstructura($v['dme_idarea']);
                $data[$k]['ruta'] = $data[$k]['entidad'] . '->' . $area[0]->denominacion;
            } else {
                if (!empty($v['dme_idsituacion'])) {
                    $data[$k]['ruta'] = $data[$k]['entidad'] . '-> Situaciones sin cargo';
                } else {
                    $str = '-> <span style="color:red;">Sin situaci&oacute;n definida</span>';
                    $data[$k]['ruta'] = $data[$k]['entidad'] . $str;
                }
            }
            if (!empty($v['dme_idcargo'])) {
                $ruta = $this->objEstructuraService->getRutaEstructura(array($v['dme_idcargo']));
                $data[$k]['rutaids'] = $ruta[0]['rutaId'];
            }
        }
        $this->response->data = $data;

        return $this->response;
    }

    /**
     * @param      $id
     * @param bool $noImplode
     *
     * @throws Exception
     */
    public function getArryOfCargos($id, $noImplode = false)
    {
        try {
            $arrCargos = $this->objEstructuraService->getCargosByEstructura($id);
            $array = array();
            foreach ($arrCargos as $v) {
                $array[] = $v['idcargo'];
            }
            if ($noImplode) {
                return $array;
            }

            return count($array) > 0 ? implode(',', $array) : $array;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param null $filtro
     * @param      $idEntidad
     * @param      $idCargo
     * @param null $limit
     * @param int $start
     *
     * @return mixed
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getPersonaToMov($filtro = null, $idEntidad, $idCargo, $limit = null, $start = 0)
    {
        $this->response->data = $this->objSituacionLaboral->getPersonaToMov(
            $filtro, $idEntidad, $idCargo, $limit, $start
        );
        $this->response->quantity = $limit > 0 ? $this->objSituacionLaboral->getCantPersonaToMov(
            $filtro, $idEntidad, $idCargo
        ) : count($this->response->data);

        return $this->response;
    }

    /**
     * @param     $filtro
     * @param     $idEntidad
     * @param     $limit
     * @param int $start
     *
     * @throws Exception
     */
    public function getPersonaToAlta($filtro, $idEntidad, $limit, $start = 0)
    {
        try {
            $objPersona = new DatPersona();
            $this->response->data = $objPersona->getPersonaToAlta($idEntidad, $filtro, $limit, $start);
            $this->response->quantity = $limit > 0
                ? $objPersona->getCantPersonaToAlta($idEntidad, $filtro)
                : count(
                    $this->response->data
                );

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $id
     */
    public function removeRegister($id)
    {
        $objDomain = new DatSituacionlaboral();
        $cargosUpdate = $this->getCargosToSync($id);
        $objDomain->removeRecord($id);
        $this->syncCompletamientoCargo($cargosUpdate);
    }

    /**
     * @param null $idSituacion
     * @param null $idPersonaEntidad
     *
     * @return array
     */
    public function getCargosToSync($idSituacion = null, $idPersonaEntidad = null)
    {
        $objSituacion = new DatSituacionlaboral();
        $cargos = $objSituacion->getCargosByIds($idSituacion, $idPersonaEntidad);
        $cargosUpdate = array();
        if (count($cargos) > 0) {
            foreach ($cargos as $v) {
                foreach ($v as $r) {
                    if (array_search($r, $cargosUpdate) === false) {
                        array_push($cargosUpdate, $r);
                    }
                }
            }
        }

        return $cargosUpdate;
    }

    /**
     * @param array $idcargo
     *
     * @throws Exception
     */
    public function syncCompletamientoCargo(array $idcargo)
    {
        $objDomain = new DatSituacionlaboral();
        foreach ($idcargo as $v) {
            $cantByCargo = $objDomain->getCantPersonaCargo($v);
            if ($cantByCargo != -1) {
                $this->objEstructuraService->syncCompletamientoCargo($v, $cantByCargo);
            }
        }
    }

    /**
     * @param $situacionActual
     * @param $personaEntidad
     * @param $newSituacion
     *
     * @throws Exception
     */
    public function movimientoSituacion($situacionActual, $personaEntidad, $newSituacion)
    {
        $cargosUpdate = array();
        $objDomain = new DatSituacionlaboral();
        if (count($situacionActual) > 0) {
            list($k, $v, $cargosUpdate) = $this->setDataModSituacion($situacionActual, $newSituacion, $objDomain);
        }
        $collection = new Doctrine_Collection('DatSituacionlaboral');
        foreach ($personaEntidad as $p => $id) {
            $collection[$p]['idpersonaentidad'] = $id;
            foreach ($newSituacion as $k => $v) {
                if (!empty($v)) {
                    $collection[$p][$k] = $v;
                    if ($k === 'idcargo') {
                        if (array_search($v, $cargosUpdate) === false) {
                            array_push($cargosUpdate, $v);
                        }
                    }
                }
            }
        }
        $collection->save();
        $this->syncCompletamientoCargo($cargosUpdate);
    }

    /**
     * @param $situacionActual
     * @param $newSituacion
     * @param $objDomain
     *
     * @return array
     */
    private function setDataModSituacion($situacionActual, $newSituacion, $objDomain)
    {
        $oldData = $objDomain->getById($situacionActual);
        if (count($oldData) > 0) {
            foreach ($oldData as $k => $v) {
                //if (empty($v->fhasta)) {
                $fd = explode('/', $newSituacion['fdesde']);
                $oldData[$k]->fhasta = date('d/m/Y', strtotime("-1 day", mktime(0, 0, 0, $fd[1], $fd[0], $fd[2])));
                //}
                if (!empty($v->idcargo)) {
                    array_push($cargosUpdate, $v->idcargo);
                }
            }
        }
        if ($oldData->isModified(true)) {
            $oldData->save();

            return array($k, $v, $cargosUpdate);
        }

        return array($k, $v, $cargosUpdate);
    }

    /**
     * @param null $filtro
     * @param null $idEntidad
     * @param null $idCargo
     * @param null $limit
     * @param int $start
     *
     * @throws Exception
     */
    public function getHistorico($filtro = null, $idEntidad = null, $idCargo = null, $limit = null, $start = 0)
    {
        try {
            $cargos = array();
            if ($idEntidad !== $idCargo) {
                $cargos = empty($idCargo) ? $this->getArryOfCargos(
                    ZendExt_GlobalConcept::getInstance()->Perfil->idestructuracomun, true
                ) : $this->getArryOfCargos($idCargo, true);
                $idEntidad = null;
            }
            $this->response->data = $this->objSituacionLaboral->getHistorico(
                $filtro, $idEntidad, $cargos, $limit, $start
            );
            $this->response->quantity = $limit > 0 ? $this->objSituacionLaboral->getCantHistorico(
                $filtro, $idEntidad, $cargos
            ) : count($this->response->data);

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param       $ids
     * @param array $data
     *
     * @throws Exception
     */
    public function updateSituacionActual($ids, array $data)
    {
        if (isset($ids) && count($data)) {
            $cargosUpdate = array();
            try {
                $objDomain = new DatSituacionlaboral();
                $record = $objDomain->getById($ids);
                if ($record) {
                    $this->setUpdateSituacion($data, $record, $cargosUpdate);
                }
            } catch (Exception $e) {
                throw $e;
            }
        }
    }

    /**
     * @param array $data
     * @param       $record
     * @param       $cargosUpdate
     */
    private function setUpdateSituacion(array $data, $record, $cargosUpdate)
    {
        foreach ($record as $p => $r) {
            if (!empty($r->idcargo)) {
                if (array_search($r->idcargo, $cargosUpdate) === false) {
                    array_push($cargosUpdate, $r->idcargo);
                }
            }
            foreach ($data as $k => $v) {
                if ($r->$k !== $v) {
                    $record[$p]->$k = $v !== '' ? $v : null;
                }
            }
        }
        if ($record->isModified(true)) {
            $record->save();
            $this->syncCompletamientoCargo($cargosUpdate);
        }
    }
}