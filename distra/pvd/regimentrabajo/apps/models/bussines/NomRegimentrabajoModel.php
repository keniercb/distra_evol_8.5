<?php

class NomRegimentrabajoModel extends ZendExt_Model
{
    protected $objRegimen;

    protected $response;

    function __construct()
    {
        $this->objRegimen = new NomRegimentrabajo();

    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

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

    /**
     * @param $filtro
     * @param $limit
     * @param $start
     * @throws Exception
     */
    public function getTipoRegimenTrabajoActive($filtro, $limit, $start,$identidades)
    {

        try {
            $this->response->data = $this->objRegimen->getRegimenTrabajoByEntidadActive($filtro, $limit, $start,$identidades);
            $this->response->quantity = ($limit > 0)
                ? $this->objRegimen->getCantTipoRegimenTrabajoActive($filtro,$identidades)
                : count($this->response->data);
			/*foreach ($this->response->data as $k => $v){
				$estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['idestructura']);
				$this->response->data[$k]['estructura'] = $estructura[0]->denominacion;
            }*/
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $objRegimen
     * @throws Exception
     */
    public function addTipoRegimenTrabajo($objRegimen)
    {
        try {
            if (!$this->objRegimen->findByIdOrDenom($objRegimen->denominacion)) {
                $obj = new NomRegimentrabajo();
                foreach ($objRegimen as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idregimentrabajo;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idregimentrabajo
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @throws Exception
     */
    public function modTipoRegimenTrabajo($idregimentrabajo, $denominacion, $descripcion, $horastrabajo, $fdesde, $fhasta,
                                          $tipofondotiempo, $fondotiempo)
    {
        try {
            if (!$this->objRegimen->findByIdOrDenom($denominacion, $idregimentrabajo)) {
                $this->objRegimen = new NomRegimentrabajo();
                $result = $this->objRegimen->modTipoRegimenTrabajo($idregimentrabajo, $denominacion, $descripcion, $horastrabajo, $fdesde, $fhasta,
                    $tipofondotiempo, $fondotiempo);
                return $result;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $arrids
     * @return Doctrine_Collection
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delTipoRegimenTrabajo($arrIds)
    {
        $array = array();
        $regimenGrupo = array();
        $objGrupo = new NomGrupodescanso();
        $obj = new NomGrupodescansoModel();
        $objRegimen = new NomRegimentrabajo();
        foreach ($arrIds as $i => $value) {
            $grupos = $objGrupo->getGrupoByRegimen($value);
            foreach ($grupos as $k => $val) {
                $array[$k] = $val['idgrupodescanso'];
            }
            $result = $obj->delGrupoDescanso($array);
            if ($result == null) {
                $query = Doctrine_Query::create();
                $query->from('NomRegimentrabajo');
                $query->where('idregimentrabajo = ?', $value);
                $r = $query->execute();
                $r->delete();
            } else {
                $denomregimen = $objRegimen->getDenomRegimenById($value);
                $result[2] = $denomregimen[0]['denominacion'];
            }
            if ($result != null) {
                array_push($regimenGrupo, $result);
            }
        }
        return $regimenGrupo;
    }

    public function getTipoRegimenTrabajoActivaByParams($ids, $in = true, $limit = null, $start = 0)
    {
        try {
            $this->response->data = $this->objRegimen->getTipoRegimenTrabajoActivaByParams(self::reflectArray($ids), $in, $limit, $start);
            $this->response->quantity = ($limit > 0)
                ? $this->objRegimen->getCantTipoRegimenTrabajoActivaByParams(self::reflectArray($ids), $in)
                : count($this->response->data);
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }


    public function GetAll()
    {
        $regimen = new NomRegimentrabajo();
        return $regimen->getRegimenTrabajoActive();
    }

    public function Getpersonas($cargos, $filtro, $start, $limit)
    {
        $regimen = new NomRegimentrabajo();
        return $regimen->Getpersonas($cargos, $filtro, $start, $limit);
    }

    public function GetCantpersonas($cargos)
    {
        $regimen = new NomRegimentrabajo();
        return $regimen->GetCantpersonas($cargos);
    }

    public function getDenomRegimenById($idregimentrabajo)
    {
        $regimen = new NomRegimentrabajo();
        $regimen = $regimen->getDenomRegimenById($idregimentrabajo);
        return $regimen[0]['denominacion'];
    }

    public function Existe($denominacion)
    {
        $regimen = Doctrine::getTable('NomRegimentrabajo')->findBy('denominacion', $denominacion);
        return $regimen;
    }

    public function Actualizar(NomRegimentrabajo $NomRegimentrabajo)
    {
        $NomRegimentrabajo->save();
    }

    public function getCantPersonaByRegimen()
    {
        $obj = new NomRegimentrabajo();
        $result = $obj->getCantPersonaByRegimen();
        return $result;

    }

    public function getPersonasByRegimen($idregimentrabajo)
    {
        $obj = new NomRegimentrabajo();
        try {
            $this->response->data = $obj->getPersonasByRegimen($idregimentrabajo);
            foreach ($this->response->data as $key => $a) {
                $this->response->data[$key]['idpersona'] = $a['idpersona'];
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(array($a['idpersona']), null, null, null, null, null);
                $this->response->data[$key]['nombreyapellidos'] = $persona->data[0]['nombreapellidos'];
                $this->response->data[$key]['numid'] = $persona->data[0]['numid'];
                $this->response->data[$key]['cargo'] = $persona->data[0]['denomcargo'];
                $this->response->data[$key]['idcargo'] = $persona->data[0]['idcargo'];
            }

            $this->response->quantity = count($this->response->data);

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }


    }
}

