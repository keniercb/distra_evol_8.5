<?php

/**
 * Class SituacionLaboralRepository
 */
class SituacionLaboralRepository extends ZendExt_Model
{
    protected $objEstructuraService;

    /**
     * @throws ZendExt_Exception
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param      $filtro
     * @param      $idcargo
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getPersonaConSituacionLaboral($filtro, $idEntidad, $idcargo, $limit = null, $start = 0)
    {
        try {
            $this->objEstructuraService = new EyCServices();
            $objPersona = new DatPersona();
            /*$select = 'dp.idpersona,
                       dpen.idpersonaentidad as idpersonaentidad,
                       dpen.identidad as identidad,
                       dpen.entidad as entidad,
                       dpen.fdesde as falta,
                       dpen.fhasta as fbaja,
                       npsc.idprocedenciasocial as idprocedenciasocial,
                       npsc.denominacion as denomprocedenciasocial,
                       dme.idsituacionlaboralp as idsituacionlaboralp,
                       dme.idcargo as idcargo,
                       dme.cargo as cargo,
                       dme.idarea as idarea,
                       dme.area as area,
                       dme.fdesde as fdesde,
                       dme.fhasta as fhasta,
                       dme.idsituacion as idsituacion,
                       ns.denominacion as denomsituacion,
                       ns.asociadocargo as asociadocargo,
                       ns.color as color';*/
            $select
                = 'dp.idpersona,
                       dpen.idpersonaentidad as idpersonaentidad,
                       dpen.identidad as identidad,
                       dpen.fdesde as falta,
                       dpen.fhasta as fbaja,
                       npsc.idprocedenciasocial as idprocedenciasocial,
                       npsc.denominacion as denomprocedenciasocial,
                       dme.idsituacionlaboralp as idsituacionlaboralp,
                       dme.idcargo as idcargo,
                       dme.idarea as idarea,
                       dme.fdesde as fdesde,
                       dme.fhasta as fhasta,
                       dme.idsituacion as idsituacion,
                       ns.denominacion as denomsituacion,
                       ns.asociadocargo as asociadocargo,
                       ns.color as color';
            $innerPersonaentidad
                = 'dp.DatPersonaentidad dpen WITH dpen.fdesde <= now()
                 AND (now() <= dpen.fhasta OR dpen.fhasta is null)';
            $leftDatSituacion
                = 'dpen.DatSituacionlaboral dme WITH dme.fdesde <= now()
                 AND (now() <= dme.fhasta OR dme.fhasta is null)';
            $query = Doctrine_Query::create()->select($select)->from('DatPersona dp')->innerJoin($innerPersonaentidad)
                ->leftJoin('dpen.NomProcedenciasocial npsc')->leftJoin($leftDatSituacion)->leftJoin(
                    'dme.NomSituacion ns'
                )->setHydrationMode(Doctrine::HYDRATE_SCALAR)->orderBy('dme.idarea');
            $objPersona->addSelectDQLPersona($query, 'dp', true);
            Utiles::personaBy($query, $filtro, 'dp', 'dpident');
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }
            if (!empty($idEntidad)) {
                $query->andWhere('dpen.identidad = ?', $idEntidad);
            } elseif (count($idcargo) > 0) {
                $query->andWhere('dme.idcargo IN (' . implode(',', $idcargo) . ') OR dme.idcargo IS NULL');
            }
            $query = $this->objEstructuraService->agregarDQLDatosCargo($query, 'dme', 'dc', 'leftJoin', true);

            return $query->execute();

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $filtro
     * @param $idcargo
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantPersonaConSituacionLaboral($filtro, $idEntidad, $idcargo)
    {
        try {
            $this->objEstructuraService = new EyCServices();
            $innerPersonaentidad
                = 'dp.DatPersonaentidad dpen WITH dpen.fdesde <= now()
                AND (now() <= dpen.fhasta OR dpen.fhasta is null)';
            $leftDatSituacion
                = 'dpen.DatSituacionlaboral dme WITH dme.fdesde <= now()
                AND (now() <= dme.fhasta OR dme.fhasta is null)';
            $query = Doctrine_Query::create()->from('DatPersona dp')->leftJoin(
                "dp.DatDocidentidad dpident WITH dpident.principal = 1"
            )->innerJoin($innerPersonaentidad)->leftJoin('dpen.NomProcedenciasocial npsc')->leftJoin($leftDatSituacion)
                ->leftJoin('dme.NomSituacion ns');
            Utiles::personaBy($query, $filtro, 'dp', 'dpident');
            if (!empty($idEntidad)) {
                $query->andWhere('dpen.identidad = ?', $idEntidad);
            } elseif (count($idcargo) > 0) {
                $query->andWhere('dme.idcargo IN (' . implode(',', $idcargo) . ') OR dme.idcargo IS NULL');
//                $query->andWhereIn('dme.idcargo', $idcargo);
            }
            $query = $this->objEstructuraService->agregarDQLDatosCargo($query, 'dme', 'dc', 'leftJoin', false);

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param      $filtro
     * @param      $idcargo
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Connection_Exception
     */
    public function getHistorico($filtro, $idEntidad, $idcargo, $limit = null, $start = 0)
    {
        $objPersona = new DatPersona();
        $select
            = 'dp.idpersona, dpen.entidad, dpen.fdesde, dpen.fhasta, dme.cargo, dme.area, dme.fdesde, dme.fhasta
            , ns.denominacion, dme.idsituacionlaboralp, dme.idcargo, dme.idarea, dpen.idpersonaentidad, dpen.identidad
            , nmb.denominacion';
        $query = Doctrine_Query::create()->select($select)->from('DatPersona dp')->innerJoin(
            'dp.DatPersonaentidad dpen'
        )->leftJoin('dpen.NomProcedenciasocial npsc')->leftJoin('dpen.NomMotivobaja nmb')->leftJoin(
            'dpen.DatSituacionlaboral dme WITH now() > dme.fhasta'
        )->leftJoin('dme.NomSituacion ns')->setHydrationMode(Doctrine::HYDRATE_SCALAR)->orderBy('dme.fdesde');
        $objPersona->addSelectDQLPersona($query, 'dp', true);
        Utiles::personaBy($query, $filtro, 'dp', 'dpident');
        if (!empty($limit)) {
            $query->limit($limit)->offset($start);
        }
        if (!empty($idEntidad)) {
            $query->andWhere('dpen.identidad = ?', $idEntidad);
        } elseif (count($idcargo) > 0) {
            $query->andWhere('dme.idcargo IN (' . implode(',', $idcargo) . ')');
        }

        return $query->execute();
    }

    /**
     * @param $filtro
     * @param $idcargo
     *
     * @return mixed
     * @throws Doctrine_Connection_Exception
     */
    public function getCantHistorico($filtro, $idEntidad, $idcargo)
    {
        $query = Doctrine_Query::create()->from('DatPersona dp')->leftJoin(
            "dp.DatDocidentidad dpident WITH dpident.principal = 1"
        )->innerJoin('dp.DatPersonaentidad dpen')->leftJoin('dpen.NomProcedenciasocial npsc')->leftJoin(
            'dpen.NomMotivobaja nmb'
        )->leftJoin('dpen.DatSituacionlaboral dme WITH now() > dme.fhasta')->leftJoin('dme.NomSituacion ns');
        Utiles::personaBy($query, $filtro, 'dp', 'dpident');
        if (!empty($idEntidad)) {
            $query->andWhere('dpen.identidad = ?', $idEntidad);
        } elseif (count($idcargo) > 0) {
            $query->andWhere('dme.idcargo IN (' . implode(',', $idcargo) . ')');
        }

        return $query->count();
    }

    /**
     * @param Doctrine_Query $objDQ
     * @param                $aTR
     * @param array $aliasTablas
     * @param string $typeR
     * @param bool $active
     * @param bool $inDQL
     * @param bool $inOT
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function addDQLOcupacion(
        Doctrine_Query &$objDQ, $aTR, array $aliasTablas = array('dpe0', 'dsl0', 'nst0'), $typeR = 'leftJoin',
        $active = true, $inDQL = false, $inOT = false
    )
    {

        $aT = self::checkFormatoAlias($aliasTablas);
        $this->objEstructuraService = new EyCServices();
        $with
            = $active ? "WITH $aT[0].fdesde <= now() AND (now() <= $aT[0].fhasta OR $aT[0].fhasta is null)" : '';
        try {
            switch (strtolower($typeR)) {
                case 'leftjoin':
                    $leftDatpersonaentidad
                        = "$aT[0].DatSituacionlaboral $aT[1] WITH $aT[1].fdesde <= now()
                         AND (now() <= $aT[1].fhasta OR $aT[1].fhasta is null)";
                    $objDQ->leftJoin("$aTR.DatPersonaentidad $aT[0] $with")->leftJoin($leftDatpersonaentidad)->leftJoin(
                        "$aT[1].NomSituacion $aT[2]"
                    );
                    break;
                default:
                    $innerDatSituacion
                        = "$aT[0].DatSituacionlaboral $aT[1] WITH $aT[1].fdesde <= now()
                         AND (now() <= $aT[1].fhasta OR $aT[1].fhasta is null)";
                    $objDQ->innerJoin("$aTR.DatPersonaentidad $aT[0] $with")->innerJoin($innerDatSituacion)->innerJoin(
                        "$aT[1].NomSituacion $aT[2]"
                    );
                    break;
            }
            if ($inDQL) {
                $this->addSelectDQLOcupacion($objDQ, $aT, true);


            } elseif ($inOT === true) {

                $objDQ = $this->objEstructuraService->agregarDQLDatosCargo($objDQ, $aT[1], 'dcargo0', $typeR);
            }

            //return $objDQ;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    private static function checkFormatoAlias($alias)
    {
        $aT = array('dpe0', 'dsl0', 'nst0');
        $aliasFormated = array();
        $p = 0;
        if (is_array($alias)) {
            foreach ($alias as $v) {
                $aliasFormated[$p] = isset($v) ? $v : $aT[$p];
                $p++;
            }
        } else {
            $aliasFormated[] = is_string($alias) || is_numeric($alias) ? $alias : $aT[0];
            $aliasFormated[] = $aT[1];
            $aliasFormated[] = $aT[2];
        }

        return count($aliasFormated > 0) ? $aliasFormated : $aT;
    }

    /**
     * @param Doctrine_Query $objDQ
     * @param array $aliasTablas
     * @param bool $inOT
     *
     * @throws Exception
     */
    
    public function addSelectDQLOcupacion(Doctrine_Query &$objDQ,
                                          array $aliasTablas = array('dpe0', 'dsl0', 'nst0'), $inOT = false)
    {
        $this->objEstructuraService = ($this->objEstructuraService instanceof EyCServices)
            ? $this->objEstructuraService : new EyCServices();

        $aT = self::checkFormatoAlias($aliasTablas);

        if ($inOT === true) {
         /*   $objDQ->leftJoin("$aT[0].NomProcedenciasocial nprdsocial")
                ->leftJoin("$aT[0].NomMotivobaja nmtvobaja");*/
            $objDQ = $this->objEstructuraService->agregarDQLDatosCargo($objDQ, $aT[1], 'dcargo0', 'leftJoin', true);

        }

       /* $otherData = $inOT === true
            ? ", $aT[0].fhasta as fbaja, nprdsocial.idprocedenciasocial as idprocedenciasocial,
             nprdsocial.denominacion as denomprocedenciasocial,
            nmtvobaja.idmotivobaja as idmotivobaja, nmtvobaja.denominacion as demonmotivobaja"
            : ' ';*/

        $select = "$aT[0].idpersonaentidad, $aT[0].idpersonaentidad as idpersonaentidad,
         $aT[0].identidad as identidad, $aT[0].fdesde as falta,
        $aT[1].idsituacionlaboralp as idsituacionlaboral,
         $aT[1].idcargo as idcargo, $aT[1].idarea as idarea,
                $aT[1].fdesde as fdesdecargo, $aT[1].fhasta as fhastacargo,
                 $aT[2].denominacion as denomsituacionlaboral "/*$otherData*/;

        $objDQ->addSelect($select);
        //return $objDQ;
    }
    /*public function addSelectDQLOcupacion(
        Doctrine_Query &$objDQ, array $aliasTablas = array('dpe0', 'dsl0', 'nst0'), $inOT = false
    )
    {

        $this->objEstructuraService =
            ($this->objEstructuraService instanceof EyCServices) ? $this->objEstructuraService : new EyCServices();

        $aT = self::checkFormatoAlias($aliasTablas);
        if ($inOT === true) {
            $objDQ = $this->objEstructuraService->agregarDQLDatosCargo($objDQ, $aT[1], 'dcargo0', 'leftJoin', true);
        }

        $select
            = "$aT[0].idpersonaentidad, $aT[0].idpersonaentidad as idpersonaentidad,
         $aT[0].identidad as identidad,$aT[0].entidad as entidad, $aT[0].fdesde as falta,
        $aT[1].idsituacionlaboralp as idsituacionlaboral,
         $aT[1].idcargo as idcargo,$aT[1].cargo as cargo, $aT[1].idarea as idarea,$aT[1].area as area,
                $aT[1].fdesde as fdesdecargo, $aT[1].fhasta as fhastacargo,
                 $aT[2].denominacion as denomsituacionlaboral "
        ;
        $objDQ->addSelect($select);
        //return $objDQ;
    }*/

    public function getPersonaToMov($filtro, $idEntidad, $idCargo, $limit = null, $start = 0)
    {
        try {
            $objPersona = new DatPersona();
            $select
                = 'dp.idpersona, dpen.idpersonaentidad as idpersonaentidad, dpen.entidad as entidad,
                dpen.fdesde as falta, dpen.fhasta as fbaja, dme.fdesde as fdesde, dme.fhasta as fhasta,
                dme.idsituacionlaboralp as idsituacionlaboralp, dme.cargo as cargo, dme.area as area,
                ns.denominacion as denomsituacion, ns.color as color, drc.idreservacargo as idreservacargo';
            $innerPersonaentidad
                = 'dp.DatPersonaentidad dpen WITH dpen.fdesde <= now()
                 AND (now() <= dpen.fhasta OR dpen.fhasta is null)';
            $leftDatReserva
                = "dpen.DatReservacargo drc WITH drc.fdesde <= now()
                 AND (now() <= drc.fhasta OR drc.fhasta is null) AND drc.idcargo = $idCargo";
            $leftDatSituacion
                = 'dpen.DatSituacionlaboral dme WITH dme.fdesde <= now()
                 AND (now() <= dme.fhasta OR dme.fhasta is null)';
            $query = Doctrine_Query::create()->select($select)->from('DatPersona dp')->innerJoin($innerPersonaentidad)
                ->leftJoin($leftDatReserva)->leftJoin($leftDatSituacion)->leftJoin(
                    'dme.NomSituacion ns'
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            $objPersona->addSelectDQLPersona($query, 'dp', true);
            Utiles::personaBy($query, $filtro, 'dp', 'dpident');
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }
            if (!empty($idEntidad)) {
                $query->andWhere('dpen.identidad = ?', $idEntidad);
            }
            if (!empty($idCargo)) {
                $query->andWhere('dme.idcargo <> ? OR dme.idcargo IS NULL', $idCargo);
            }

            return $query->execute();

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantPersonaToMov($filtro, $idEntidad, $idCargo)
    {
        try {
            $objPersona = new DatPersona();
            $innerDatReserva
                = 'dp.DatPersonaentidad dpen WITH dpen.fdesde <= now()
                AND (now() <= dpen.fhasta OR dpen.fhasta is null)';
            $leftDatResrva
                = "dpen.DatReservacargo drc WITH drc.fdesde <= now()
                 AND (now() <= drc.fhasta OR drc.fhasta is null) AND drc.idcargo = $idCargo";
            $leftDatSiruacion
                = 'dpen.DatSituacionlaboral dme WITH dme.fdesde <= now()
                 AND (now() <= dme.fhasta OR dme.fhasta is null)';
            $query = Doctrine_Query::create()->from('DatPersona dp')->innerJoin($innerDatReserva)->leftJoin(
                $leftDatResrva
            )->leftJoin($leftDatSiruacion)->leftJoin('dme.NomSituacion ns')->setHydrationMode(
                Doctrine::HYDRATE_ARRAY
            );
            $objPersona->addSelectDQLPersona($query, 'dp', true);
            Utiles::personaBy($query, $filtro, 'dp', 'dpident');
            if (!empty($idEntidad)) {
                $query->andWhere('dpen.identidad = ?', $idEntidad);
            }
            if (!empty($idCargo)) {
                $query->andWhere('dme.idcargo <> ?', $idCargo);
            }

            return $query->count();

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getPersonaEntidadRegistros($filtro = null, $idEntidad = null, $limit = null, $start = 0)
    {
        $objPersona = new DatPersona();
        $objDireccion = new DatDireccion();
        $query = Doctrine_Query::create()->select('dpen.fdesde, dpen.fhasta, npsc.denominacion, nmb.denominacion')
            ->from(
                'DatPersona dp'
            )->innerJoin('dp.DatPersonaentidad dpen')->leftJoin(
                'dpen.NomProcedenciasocial npsc'
            )->leftJoin(
                'dpen.NomMotivobaja nmb'
            )->setHydrationMode(Doctrine::HYDRATE_SCALAR);
        $objPersona->addSelectDQLPersona($query, 'dp', true);
        $objDireccion->addDQLDireccion($query, 'dp', 'dd', 'leftjoin', true, true);
        Utiles::personaBy($query, $filtro, 'dp', 'dpident');
        if (!empty($limit)) {
            $query->limit($limit)->offset($start);
        }
        if (!empty($idEntidad)) {
            $query->andWhere('dpen.identidad = ?', $idEntidad);
        }

        return $query->execute();
    }
}