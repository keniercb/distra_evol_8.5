<?php

/**
 * Description of MaestroPlanificacionModel
 * @author kenier
 */
class MaestroPlanificacionModel extends BaseModel
{
    private $sussesor, $maestroProducto;

    public function __construct()
    {
        parent::__construct(true);
        $this->initRelactions();
    }

    public function setMaestroProducto(MaestroProductoModel $maestroProducto)
    {
        $this->maestroProducto = $maestroProducto;
    }

    public function beforeInsertIndicador(NomIndicador $indicador, $dataIndicador = array())
    {
        $indicadorPlanif = new NomIndicadorplanif();
        if ($dataIndicador['idindicador']) {
            $indicadorPlanif->assignIdentifier($dataIndicador['idindicador']);
        }
        /*if (isset($dataIndicador['precioplanif'])) {
            $dataIndicador['precio'] = $dataIndicador['precioplanif'];
        }*/
        $indicadorPlanif->synchronizeWithArray($dataIndicador);
        $indicador->NomIndicadorplanif = $indicadorPlanif;
    }

    public function postInsertIndicador(NomIndicador $indicador, $dataIndicador = array())
    {
        $arrayorganos = explode(",", $dataIndicador['idorganosatisface']);
        $arraycentrobalance = explode(",", $dataIndicador['idcentrobalance']);
        $arrayvia = explode(",", $dataIndicador['idviaadquisicion']);
        $this->salvarCentrosBalance($arraycentrobalance, $indicador->idindicador);
        $this->salvarViasAdquisicion($arrayvia, $indicador->idindicador);
        $this->salvarOrganos($arrayorganos, $arrayvia, $indicador->idindicador);
        $this->salvarPlanDirecto($dataIndicador, $indicador->idindicador);
    }

    public function salvarPlanDirecto($dataIndicador, $idIndicador)
    {
        if ($dataIndicador['plandirecto']) {
            Doctrine_Query::create()->delete('DatIndicadormodelo')
                ->where('idindicador = ?', array($idIndicador))->execute();
            $indModelo = new DatIndicadormodelo();
            $indModelo->idindicador = $idIndicador;
            $indModelo->idmodelo = $dataIndicador['plandirecto'];
            $indModelo->save();
        }
    }

    public function salvarViasAdquisicion($arrIdVias, $idindicador)
    {
        Doctrine_Query::create()->delete('DatIndicadorviaadquisicion')
            ->where('idindicador = ?', array($idindicador))->execute();
        if (count($arrIdVias)) {
            $viaadquisicion = new Doctrine_Collection('DatIndicadorviaadquisicion');
            foreach ($arrIdVias as $value) {
                if (!empty($value)) {
                    $viaadquiobj = new DatIndicadorviaadquisicion();
                    $viaadquiobj->idviaadquisicion = $value;
                    $viaadquiobj->idindicador = $idindicador;
                    $viaadquisicion->add($viaadquiobj);
                }
            }
            if ($viaadquisicion->count()) {
                $viaadquisicion->save();
            }
        }
    }

    public function salvarCentrosBalance($arrIdCentro, $idindicador)
    {
        Doctrine_Query::create()->delete('DatIndicadorcentrobalance')
            ->where('idindicador = ?', array($idindicador))->execute();
        if (count($arrIdCentro)) {
            $centrobalacecollect = new Doctrine_Collection('DatIndicadorcentrobalance');
            foreach ($arrIdCentro as $value) {
                if (!empty($value)) {
                    $centrobalobj = new DatIndicadorcentrobalance();
                    $centrobalobj->identidaddatosnomenclador = $value;
                    $centrobalobj->idindicador = $idindicador;
                    $centrobalacecollect->add($centrobalobj);
                }
            }
            if ($centrobalacecollect->count()) {
                $centrobalacecollect->save();
            }
        }
    }

    public function salvarOrganos($arrIdOrganos, $arrIdVias, $idIndicador)
    {
        Doctrine_Query::create()->delete('DatIndicadorviaadquisicionorganosatisface')
            ->where('idindicador = ?', array($idIndicador))->execute();
        $cacheOrganos = $cacheVias = array();
        if (count($arrIdOrganos) && count($arrIdVias)) {

            $viaorganosatisface = new Doctrine_Collection('DatIndicadorviaadquisicionorganosatisface');
            foreach ($arrIdVias as $value) {
                if ($cacheVias[$value]) {
                    continue;
                }
                $cacheVias[$value] = true;
                foreach ($arrIdOrganos as $v) {
                    if ($cacheOrganos[$v]) {
                        continue;
                    }
                    $cacheOrganos[$v] = true;
                    if (!empty($value) && !empty($v)) {
                        $viaorganobj = new DatIndicadorviaadquisicionorganosatisface();
                        $viaorganobj->idviaadquisicion = $value;
                        $viaorganobj->idorganosatisface = $v;
                        $viaorganobj->idindicador = $idIndicador;
                        $viaorganosatisface->add($viaorganobj);
                    }
                }
            }
            if ($viaorganosatisface->count()) {
                $viaorganosatisface->save();
            }
        }
    }

    public function aprobarClasificador($params = array())
    {
        Doctrine_Query::create()
            ->update()
            ->from('NomIndicadorplanif p')
            ->set('idaprobacion', $params['nivel'])
            ->whereIn('p.idindicador', $params['id'])
            ->execute();
        return true;
    }

    public function getSussesor()
    {
        return $this->sussesor;
    }

    public function setSussesor($sussesor)
    {
        $this->sussesor = $sussesor;
    }

    public function addQueryJoinNomIndicadorPlanif(
        Doctrine_Query $dql, $aliasExterno = 'ind', $alias = 'indp', $parametros = array()
    )
    {
        $dql->leftJoin("{$aliasExterno}.NomIndicadorplanif {$alias}");
        $dql->addSelect($this->getSelectStringForQueryIndicador($alias));
        $dql->leftJoin($aliasExterno . '.DatIndicadorcentrobalance indcb')
            ->addSelect('indcb.identidaddatosnomenclador');
        $dql->leftJoin($aliasExterno . '.DatIndicadormodelo indmod')->addSelect('indmod.idmodelo');
        $dql->leftJoin($aliasExterno . '.DatIndicadorviaadquisicion indva')
            ->addSelect(
                'indva.idviaadquisicion,'
                . "(SELECT  array_to_string( array_agg(adq.denominacion), ', ') FROM DatIndicadorviaadquisicion indva1"
                . " LEFT JOIN indva1.NomViaadquisicion adq ON indva1.idviaadquisicion=adq.idviaadquisicion"
                . " WHERE ind.idindicador = indva1.idindicador) as denominacionadquisicion"
            );
        $dql->leftJoin($aliasExterno . '.DatIndicadorviaadquisicionorganosatisface indvao')
            ->addSelect(
                'indvao.idorganosatisface,'
                .
                "(SELECT array_to_string(array_agg(nomorg.denominacion), ', ') FROM DatIndicadorviaadquisicionorganosatisface indv"
                . " LEFT JOIN indv.NomOrganosatisface nomorg ON indv.idorganosatisface=nomorg.idorganosatisface"
                . " WHERE ind.idindicador = indv.idindicador) as denominacionorganosatisface"
            );
    }

    public function setDataPlanificacion($arrayIndicadores)
    {
        foreach ($arrayIndicadores as &$ind) {
            if (count($ind['DatIndicadorcentrobalance'])) {
                $ind['idcentrobalance'] = implode(
                    ',',
                    $this->objectHelper->extractValueFromArrayColumn(
                        $ind['DatIndicadorcentrobalance'], 'identidaddatosnomenclador'
                    )
                );
            }
            unset($ind['DatIndicadorcentrobalance']);
            if (count($ind['DatIndicadorviaadquisicion'])) {
                $ind['idviaadquisicion'] = implode(
                    ',',
                    $this->objectHelper->extractValueFromArrayColumn(
                        $ind['DatIndicadorviaadquisicion'], 'idviaadquisicion'
                    )
                );
            }
            unset($ind['DatIndicadorviaadquisicion']);
            if (count($ind['DatIndicadorviaadquisicionorganosatisface'])) {
                $ind['idorganosatisface'] = implode(
                    ',',
                    $this->objectHelper->extractValueFromArrayColumn(
                        $ind['DatIndicadorviaadquisicionorganosatisface'], 'idorganosatisface'
                    )
                );
            }
            unset($ind['DatIndicadorviaadquisicionorganosatisface']);
            if (count($ind['DatIndicadormodelo'])) {
                $ind['plandirecto'] = $ind['DatIndicadormodelo']['idmodelo'];
            }
            unset($ind['DatIndicadormodelo']);
        }
        return $arrayIndicadores;
    }

    public function getSelectStringForQueryIndicador($alias = 'indp')
    {
        $arrayQueryStrings = array(
            'nivelplanif' => '_t.nivelplanif',
            'idaprobacion' => '_t.idaprobacion',
            'flete' => '_t.flete',
            'contingencia' => '_t.contingencia',
            'precioventa' => '_t.precioventa',
            'balanceable' => '_t.balanceable',
            'cobertura' => '_t.cobertura',
            'margencomercial' => '_t.margencomercial',
            'preciodivisa' => '_t.preciodivisa',
            'precioplanif' => '_t.precio'

        );
        return $this->doctrineHelper->getStrSelectString($arrayQueryStrings, $alias, '_t');
    }

    public function cargarCentrosBalance()
    {
        $idEspec = LogisticaObjectHelper::__init()->extractValueFromArrayColumn(DatosMaestrosHelper::__init()
            ->obtenerEspecialidades(array('restringir' => 1)), 'idespecialidad');

        $entidadesDominio = $this->estructuraHelper->idEstructurasDominio($this->global->Perfil->iddominio);
        $centrosBalance = $this->planificacionHelper->obtenerCentrosDeBalance($entidadesDominio, $idEspec);
        foreach ($centrosBalance as &$centro) {
            $estructura = $this->estructuraHelper->getEstructura($centro['identidad']);
            $centro['denominacion'] = $estructura[0]->denominacion;
            $centro['id'] = $centro['identidaddatosnomenclador'];
        }
        return $centrosBalance;
    }

    public function cargarPlanes()
    {
        // print_r($this->planificacionHelper->obtenerModelos());die;
        // return $this->planificacionHelper->obtenerModelos($this->global->Estructura->idestructura);
        return $this->planificacionHelper->obtenerModelos();
    }

    /*
     * params:$idIndicador ->id del indicador
     * return: si el indicador es de nivel planificacion lo cambia y retorna treu,
     * falso si no.
     */

    private function comprobaryCambiarNivelPlanificacion($idIndicador)
    {
        $indEstablecidos = Doctrine_Query::create()->from('NomIndicadorplanif nipf')
            ->where('nivelplanif = ?', array(1))
            ->andWhereIn('idindicador', $idIndicador)
            ->count();
        if ($indEstablecidos != 0) {
            Doctrine_Query::create()
                ->update('NomIndicadorplanif')
                ->set('nivelplanif', 0)
                ->whereIn('idindicador', $idIndicador)
                ->execute();
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param type $idIndicador
     * @return boolean
     */
    public function establecerNivelPlanificacion($idIndicador)
    {
        if ($this->comprobaryCambiarNivelPlanificacion($idIndicador)) {
            return true;
        }
        $rama = $this->maestroProducto->getIdIndicadoresRama($idIndicador, true);
        $idndicadores = array_merge($rama['inferior'], $rama['superior']);
        $dql = new Doctrine_Query();
        $indEstablecidos = $dql->from('NomIndicadorplanif nipf')
            ->where('nivelplanif = ?', array(1))
            ->andWhereIn('idindicador', $idndicadores)
            ->count();
        if ($indEstablecidos == 0) {
            Doctrine_Query::create()
                ->update('NomIndicadorplanif')
                ->set('nivelplanif', 1)
                ->whereIn('idindicador', $idIndicador)
                ->execute();
            return true;
        }
        return false;
    }

    /**
     *
     */
    public function initRelactions()
    {
        $relations = array(
            array(
                'cardinalidad' => 'many',
                'relation' => 'DatIndicadorcentrobalance',
                'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
            ),
            array(
                'cardinalidad' => 'many',
                'relation' => 'DatIndicadorviaadquisicion',
                'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
            ),
            array(
                'cardinalidad' => 'many',
                'relation' => 'DatIndicadorviaadquisicionorganosatisface',
                'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
            ), array(
                'cardinalidad' => 'one',
                'relation' => 'DatIndicadormodelo',
                'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
            ),
        );
        $this->doctrineHelper->tryInyectRelactions(new NomIndicador, $relations);

        $relations = array(
            array(
                'cardinalidad' => 'one',
                'relation' => 'NomViaadquisicion',
                'properties' => array('local' => 'idviaadquisicion', 'foreign' => 'idviaadquisicion')
            ),
        );
        $this->doctrineHelper->tryInyectRelactions(new DatIndicadorviaadquisicion, $relations);

        $relations = array(
            array(
                'cardinalidad' => 'one',
                'relation' => 'NomOrganosatisface',
                'properties' => array('local' => 'idorganosatisface', 'foreign' => 'idorganosatisface')
            ),
        );
        $this->doctrineHelper->tryInyectRelactions(new DatIndicadorviaadquisicionorganosatisface, $relations);
    }
}
