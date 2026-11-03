<?php

class NomGrupodescansoModel extends ZendExt_Model
{

    protected $objGrupo;

    protected $response;

    function __construct()
    {
        $this->objGrupo = new NomGrupodescanso();
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
     * @param $idregimentrabajo
     * @param $filtro
     * @param $limit
     * @param $start
     * @throws Exception
     */
    public function getGrupoDescansoActive($idregimentrabajo, $filtro, $limit, $start)
    {
        try {
            $this->response->data = $this->objGrupo->getGrupoDescansoByRegimenActive($idregimentrabajo, $filtro, $limit, $start);
            $this->response->quantity = ($limit > 0)
                ? $this->objGrupo->getCantGrupoDescansoActive($idregimentrabajo, $filtro)
                : count($this->response->data);
            foreach ($this->response->data as $k => $v){
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['idestructura']);
                $this->response->data[$k]['estructura'] = $estructura[0]->denominacion;
            }
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $limit
     * @param $start
     * @throws Exception
     */
    public function getGrupoDescansoRegimenActive($criterio, $limit, $start)
    {
        try {
            $this->response->data = $this->objGrupo->getGrupoDescansoRegimenActive($criterio, $limit, $start);
            $this->response->quantity = ($limit > 0)
                ? $this->objGrupo->getCantGrupoDescansoRegimenActive($criterio)
                : count($this->response->data);
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getGrupoDescansoByEntidadActive($criterio, $limit, $start,$identidades)
    {
        try {
            $this->response->data = $this->objGrupo->getGrupoDescansoByEntidad($criterio, $limit, $start,$identidades);
            $this->response->quantity = ($limit > 0)
                ? $this->objGrupo->getCantGrupoDescansoByEntidad($criterio,$identidades)
                : count($this->response->data);
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $objGrupo
     * @throws Exception
     */
    public function addGrupoDescanso($objGrupo)
    {

        try {

            if (!$this->objGrupo->findByIdOrDenom($objGrupo->denominacion, $objGrupo->idregimentrabajo)) {

                $obj = new NomGrupodescanso();
                foreach ($objGrupo as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idgrupodescanso;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function ExisteGD($denom, $idregimentrabajo = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomGrupodescanso')
                ->Where("denominacion = '$denom'");
            if (!empty($idregimentrabajo)) {

                $query->andWhere("idregimentrabajo = ?", $idregimentrabajo);
            }
            $result = $query->count();
            if ($result > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idgrupodescanso
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @throws Exception
     */
    public function modGrupoDescanso($idgrupodescanso, $denominacion, $descripcion, $fdesde, $fhasta)
    {

        try {
            if (!$this->objGrupo->findByIdOrDenom($denominacion, $idgrupodescanso)) {

                $this->objGrupo = new NomGrupodescanso();
                $result = $this->objGrupo->modGrupoDescanso($idgrupodescanso, $denominacion, $descripcion, $fdesde, $fhasta);
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
    public function delGrupoDescanso($arrIds)
    {
        $var = null;
        $arraypersonasgrupo = array();
        $arraygrupocalendario = array();
        $result = array();
        $objCalendario = new ConfCalendario();
        $objGrupo = new NomGrupodescanso();
        $datAsistencia = new DatAsistencia();
        $arrayPersona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(array(), null, null, 0,
            array(), array(), null,'false','true','false','true');
        foreach ($arrayPersona->data as $k => $value) {
            $arrayIdsPersona[$k] = $value['idpersona'];
        }
        foreach ($arrIds as $j => $v) {
            $gruposcalendario = $objCalendario->getCalendarioByGrupo($v);

            if ($gruposcalendario == null) {
                $personasGrupo = ZendExt_IoC_Inter::getInstance()->persona->getRegimenByPerson($arrayIdsPersona,
                    null, null, null);
                foreach ($personasGrupo as $i => $val) {
                    if ($val['idgrupodescanso'] == $v) {
                        $arreglo = array();
                        $grupo = $objGrupo->getGrupoById($val['idgrupodescanso']);
                        $datospersona = $datAsistencia->getdatospersona(array($val['idpersona']));
                        $arreglo['nombreapellidos'] .=  $datospersona[0]['nombreapellidos'] . ' (' .
                            $grupo[0]['denominacion'] . '), ';
                        array_push($arraypersonasgrupo, $arreglo['nombreapellidos']);
                    }
                }
            } else {
                $grupo = $objGrupo->getGrupoById($gruposcalendario[0]['idgrupodescanso']);
                array_push($arraygrupocalendario, $grupo[0]['denominacion']);
                $personasGrupo =  ZendExt_IoC_Inter::getInstance()->persona->getRegimenByPerson($arrayIdsPersona,
                    null, null, null);
                foreach ($personasGrupo as $i => $val) {
                    if ($val['idgrupodescanso'] == $v) {
                        $arreglo = array();
                        $datospersona = $datAsistencia->getdatospersona(array($val['idpersona']));
                         $arreglo['nombreapellidos'] .= $datospersona[0]['nombreapellidos'] . ' (' .
                             $grupo[0]['denominacion'] . '), ';
                        array_push($arraypersonasgrupo, $arreglo['nombreapellidos']);
                    }
                }
            }
            if ($arraygrupocalendario == null && $arraypersonasgrupo == null) {
                $query = Doctrine_Query::create();
                $query->from('NomGrupodescanso');
                $query->where('idgrupodescanso = ?', $v);
                $r = $query->execute();
                $r->delete();
            } else {
                $result[0] = $arraygrupocalendario;
                $result[1] = $arraypersonasgrupo;
            }
        }
        return $result;

    }

    public function getGrupoDescansoActivaByParams($ids, $in = true, $limit = null, $start = 0)
    {
        try {
            $this->response->data = $this->objGrupo->getGrupoDescansoActivaByParams(self::reflectArray($ids), $in, $limit, $start);
            $this->response->quantity = ($limit > 0)
                ? $this->objGrupo->getCantGrupoDescansoActivaByParams(self::reflectArray($ids), $in)
                : count($this->response->data);
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function GetAll($idregimen)
    {
        $turnos = new NomGrupodescanso();
        return $turnos->getGrupoDescansoActive($idregimen);
    }

    public function getAllGrupoDescansoActive()
    {
        $grupos = new NomGrupodescanso();
        return $grupos->getAllGrupoDescansoActive();
    }

    public function getGrupoById($idgrupodescanso)
    {
        $turnos = new NomGrupodescanso();
        $turno = $turnos->getGrupoById($idgrupodescanso);
        return $turno[0]['denominacion'];
    }

    public function getpersonasByIdGrupoDescanso($idgrupodescanso,$filtro/*,$limit, $start*/)
    {
        $grupo = new NomGrupodescanso();
        $datAsistencia = new DatAsistencia();
        if(!empty($idgrupodescanso)){
            $idspersonas = $grupo->getpersonasByIdGrupoDescanso($idgrupodescanso/*,$limit, $start*/);
            $people = array();
            foreach ($idspersonas as $persona) {
                array_push($people, $persona['idpersona']);
            }
            if(count($people)>0){

                $arrPersonas = $datAsistencia->getdatospersona($people);

                //$personasordenadas = $datAsistencia->OrderPersonasByCargo($arrPersonas, null, 0);
                //$arrPersonas = $personasordenadas;
            }else{
                $arrPersonas = array();
            }
        }else{
            $arrPersonas = array();
        }

        $DAM = new DatAsistenciaModel();
        $denEntAreas = $DAM->GetDenomEntAreas($arrPersonas);
        foreach ($arrPersonas as $key => $per) {
            $arrPersonas[$key]['entidad'] = $denEntAreas[$per['identidad']]['denominacion'];
            $arrPersonas[$key]['area'] = (is_numeric($per['idarea']))? $denEntAreas[$per['identidad']]['denominacion'].'->'.$denEntAreas[$per['idarea']]['denominacion']:'NO ASIGNADO A CARGO';
        }
        $r['data'] = $arrPersonas;
        $r['cantidad'] = count($arrPersonas);
        return $r;
    }

    public function Existe($denominacion)
    {
        $grupo = Doctrine::getTable('NomGrupodescanso')->findBy('denominacion', $denominacion);
        return $grupo;
    }

    public function Actualizar(NomGrupodescanso $NomGrupodescanso)
    {
        $NomGrupodescanso->save();
    }


}

