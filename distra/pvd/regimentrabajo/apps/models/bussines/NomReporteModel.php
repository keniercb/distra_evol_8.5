<?php

class NomReporteModel extends ZendExt_Model
{
    protected $objRegimen;

    protected $response;

    function __construct()
    {
        $this->objRegimen = new NomReporte();
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
    public function getReporte($filtro, $limit, $start)
    {

        try {
            $this->response->data = $this->objRegimen->getReporte($filtro, $limit, $start);
            $this->response->quantity = ($limit > 0)
                ? $this->objRegimen->getReporte($filtro)
                : count($this->response->data);


            $fechaactual =date('d/m/Y');
            $fechai=explode('/',$fechaactual);
            $fechai[0]=1;
            $fi = new DateTime($fechai[2].'-'.$fechai[1].'-'.$fechai[0]);
            $dtFI = date_add($fi, date_interval_create_from_date_string('1 month'));

            $ffin = date_add($dtFI, date_interval_create_from_date_string('-1 day'));
            $FIT = explode('/', $dtFI->format('d/m/Y'));
            $dtFI = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
            $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
            $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);

            $this->response->estructura=$estructura[0]->denominacion;
           $this->response->idestructura=$estructura[0]->idestructura;
            $this->response->fechainicio=implode('/',$fechai);
            $this->response->fechafin=date_format($ffin,'d/m/Y');

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
    public function modTipoRegimenTrabajo($idregimentrabajo, $denominacion, $descripcion, $horastrabajo, $fdesde, $fhasta)
    {
        try {
            if (!$this->objRegimen->findByIdOrDenom($denominacion, $idregimentrabajo)) {
                $this->objRegimen = new NomRegimentrabajo();
                $result = $this->objRegimen->modTipoRegimenTrabajo($idregimentrabajo, $denominacion, $descripcion, $horastrabajo, $fdesde, $fhasta);
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


}

