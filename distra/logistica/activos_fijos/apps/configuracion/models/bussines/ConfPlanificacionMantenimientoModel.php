<?php

/**
 * Daniel Arias Espinosa
 * 07/12/15
 */
class ConfPlanificacionMantenimientoModel extends ZendExt_Model
{
    protected $_serviciosPlanificacion, $_logisticaDoctrine;

    public function __construct()
    {
        parent::__construct();
        $doctrineHelper = LogisticaDoctrineHelper::__init();
        $relationsInd[] = array('cardinalidad' => 'many', 'relation' => 'CfgPlanificacionMantenimiento',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $relationsInd[] = array(
            'cardinalidad' => 'many',
            'relation' => 'CfgMedioSistemaMedio',
            'properties' => array('local' => 'idpadre', 'foreign' => 'idindicador'));
        $relationsInd[] = array(
            'cardinalidad' => 'many',
            'relation' => 'ConfActividad',
            'properties' => array('local' => 'idactividad', 'foreign' => 'idactividad'));
        $this->_serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $doctrineHelper->tryInyectRelactions(new NomIndicador, $relationsInd);
        $this->_logisticaDoctrine = LogisticaDoctrineHelper::__init();
    }

    public function adicionarPlanificacion($parametros = array())
    {
        $plan = new CfgPlanificacionMantenimiento();
        if ($parametros['idplanificacionmantenimiento']) {
            $plan->assignIdentifier($parametros['idplanificacionmantenimiento']);
        } else {
            $idPlanf = $this->existePlanificacion($parametros);
            if ($idPlanf) {
                $plan->assignIdentifier($idPlanf['idplanificacionmantenimiento']);
            }
        }
        $planif['idindicador'] = $parametros['idindicador'];
        $planif['recursoconsumido'] = $parametros['recursoconsumido'];
        $planif['periodo'] = $parametros['periodo'];
        $plan->synchronizeWithArray($planif);
        $plan->save();
        $activAdicionadas = Zend_Json::decode($parametros['actividades']);
        $actividadesAddArray = new Doctrine_Collection('CfgPlanificacionMantenimiento');
        foreach ($activAdicionadas as $actv) {
            $actividad['idconfactividadsistemamedio'] = $actv;
            $actividad['idplanificacionmantenimiento'] = $plan->idplanificacionmantenimiento;
            $idActvPlanf = $this->existeActvidadPlanificacion($actividad);
            $objActividad = new CfgActividadPlanificacion();
            if (!$idActvPlanf) {
                $objActividad->synchronizeWithArray($actividad);
                $actividadesAddArray[] = $objActividad;
            }
        }
        if ($actividadesAddArray->count()) {
            $actividadesAddArray->save();
        }
    }

    private function existePlanificacion($parametros = array())
    {
        return Doctrine_Query::create()->select('idplanificacionmantenimiento')->from('CfgPlanificacionMantenimiento')
            ->where('idindicador = ? ', array($parametros['idindicador']))
            ->andWhere('recursoconsumido = ?', array($parametros['recursoconsumido']))
            ->andWhere('periodo = ?', array($parametros['periodo']))
            ->fetchOne();
    }

    private function existeActvidadPlanificacion($parametros = array())
    {
        return Doctrine_Query::create()->select('idactividadplanificacion')->from('CfgActividadPlanificacion')
            ->where('idconfactividadsistemamedio = ? ', array($parametros['idconfactividadsistemamedio']))
            ->andWhere('idplanificacionmantenimiento = ?', array($parametros['idplanificacionmantenimiento']))
            ->fetchOne();
    }

    public function cargarPlanificaciones($parametros = array())
    {
        $query = Doctrine_Query::create();

        $query
            ->from('CfgPlanificacionMantenimiento pm')
            ->innerJoin('pm.NomIndicador ind')
            ->innerJoin('ind.NomIndicadorhoja indh')
            ->orderBy('pm.periodo,pm.recursoconsumido,pm.idplanificacionmantenimiento')
            ->groupBy(
                'pm.idplanificacionmantenimiento, pm.idindicador, ind.denominacion, nmar.denominacion, nm.denominacion,
                pm.periodo, pm.recursoconsumido'
            );
        if ($parametros['idindicador']) {
            $query->andWhere('pm.idindicador = ?', array($parametros['idindicador']));
        }

        $mProducto = new MaestroProductoModel();
        $mProducto->addQueryJoinMarcaModelo($query, 'indh', 'nmar', 'nm', true, true, 'ind');

        $query->select(
            'pm.idplanificacionmantenimiento, pm.periodo, pm.recursoconsumido, pm.idindicador,
            ind.denominacion as denominacion, nmar.denominacion as marca, nm.denominacion as modelo '
        );

        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    public function eliminarPlanificacion($parametros)
    {
        $parametros['idplanificacionmantenimiento'] = Zend_Json::decode($parametros['planificaciones']);
        Doctrine_Query::create()->delete('CfgActividadPlanificacion ap')
            ->whereIn('ap.idplanificacionmantenimiento ', $parametros['idplanificacionmantenimiento'])
            ->execute();
        return Doctrine_Query::create()->delete('CfgPlanificacionMantenimiento')
            ->whereIn('idplanificacionmantenimiento ', $parametros['idplanificacionmantenimiento'])
            ->execute();
    }

    public function cargarActvidadesPlanificadas($parametros = array())
    {
        $parametros['idplanificacionmantenimiento'] = Zend_Json::decode($parametros['idplanificacionmantenimiento']);
        $query = Doctrine_Query::create();
        $query->select(
            'ap.idactividadplanificacion, ap.idconfactividadsistemamedio, sis.denominacion as sistema,
            asm.idactividad as idactividad '
        )
            ->from('CfgActividadPlanificacion ap')
            ->innerJoin('ap.CfgActividadSistemaMedio asm')
            ->innerJoin('asm.NomSistemaMedio sis');
        if ($parametros['idplanificacionmantenimiento']) {
            if (!is_array($parametros['idplanificacionmantenimiento'])) {
                $parametros['idplanificacionmantenimiento'] = array($parametros['idplanificacionmantenimiento']);
            }
        } else {
            $parametros['idplanificacionmantenimiento'] = array(1);
        }
        $query->whereIn('ap.idplanificacionmantenimiento ', $parametros['idplanificacionmantenimiento']);
        $this->_logisticaDoctrine->addQueryLimits($query, $parametros);
        $actividades = $query->fetchArray();
        foreach ($actividades as $index => $act) {
            $result = $this->_serviciosPlanificacion
                ->obtenerActividadyNorma(4, $act['idactividad'], null, null, null, 0);
            $actividades[$index]['denominacion'] = $result['datos'][0]['denominacion'];
        }
        return array('cantidad' => $query->count(), 'datos' => $actividades);
    }

    public function cargarActividadesDelMedioSistema($parametros = array())
    {

        $parametros['idpadre'] = Zend_Json::decode($parametros['idpadre']);
        $conn = Zend_Registry::get('conexion');
        $select = 'select asm.idconfactividadsistemamedio, msm.idconfmediosistemamedio as idconfmediosistemamedio,
            asm.idactividad as idactividad,ca.denominacion as denominacion,
            sis.idnomsistemamedio as idnomsistemamedio, sis.denominacion as sistema';
        $from = " FROM mod_logactivofijotangible.conf_actividadsistemamedio asm inner join mod_logtaller.conf_actividad ca on asm.idactividad = ca.idactividad " .
            " inner join mod_logactivofijotangible.nom_sistemamedio sis on asm.idnomsistemamedio = sis.idnomsistemamedio " .
            " inner join mod_logactivofijotangible.conf_mediosistemamedio msm on sis.idnomsistemamedio = msm.idnomsistemamedio ";
        $where = " where msm.idindicador = {$parametros['idpadre']}";
        $decode= Zend_Json::decode($parametros['excluir']);
        if ($decode) {
            $where .= " and asm.idconfactividadsistemamedio not in (" . implode(",", $decode) . ")";
        }

        $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($select . $from . $where)
            ->fetchAll(PDO::FETCH_ASSOC);
        $datos = $conn->execute($select . $from . $where)->fetchAll();

        return array('datos' => $datos, 'cantidad' => count($total));
    }

    public function cargarMedios($parametros = array())
    {
        $mProducto = new MaestroProductoModel();
        return $mProducto->devolverPadresHojas($parametros);
    }

    public function eliminarActividadPlanificada($parametros)
    {
        $actv = Zend_Json::decode($parametros['actividades']);
        Doctrine_Query::create()->delete('CfgActividadPlanificacion ap')
            ->whereIn('ap.idactividadplanificacion ', $actv)
            ->execute();
    }

    public function cargarActvidadesPlanificadasParaOrden($parametros = array())
    {
        $parametros['idplanificacionmantenimiento'] = Zend_Json::decode($parametros['idplanificacionmantenimiento']);
        $query = Doctrine_Query::create();
        $query->select(
            'ap.idactividadplanificacion, ap.idconfactividadsistemamedio, sis.denominacion as sistema,
            asm.idactividad as idactividad '
        )
            ->from('CfgActividadPlanificacion ap')
            ->innerJoin('ap.CfgActividadSistemaMedio asm')
            ->innerJoin('asm.NomSistemaMedio sis');
        if ($parametros['idplanificacionmantenimiento']) {
            if (!is_array($parametros['idplanificacionmantenimiento'])) {
                $parametros['idplanificacionmantenimiento'] = array($parametros['idplanificacionmantenimiento']);
            }
        } else {
            $parametros['idplanificacionmantenimiento'] = array(1);
        }
        $query->whereIn('ap.idplanificacionmantenimiento ', $parametros['idplanificacionmantenimiento']);
        $actividades = $query->fetchArray();
        $ids = array();
        foreach ($actividades as $index => $act) {
            $ids[] = $act['idactividad'];
        }
        $result = $this->_serviciosPlanificacion->obtenerActividadyNorma(4, $ids, null, null, null, 0);

        return array('cantidad' => $result['totalpaginado'], 'datos' => $result['datos']);
    }

}
