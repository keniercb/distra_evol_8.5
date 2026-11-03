<?php

/**
 *
 */
class CfgEstadosEntidad extends BaseCfgEstadosEntidad
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne(
            'NomEstatustecnico', array('local' => 'idestado', 'foreign' => 'idestatustecnico')
        );
        $this->hasOne(
            'NomEstatustecnico', array('local' => 'idproximoestado', 'foreign' => 'idestatustecnico')
        );
    }

    public function getQueryEstatus($alias)
    {
        $query = new Doctrine_Query();
        $query->from("CfgEstadosEntidad $alias");

        return $query;
    }

    public function getQueryWhereEstatus(
    &$query, $alias, $idEstructuraComun, $idEstatus = false, $idOperacion = false, $idProxEstatus = false
    )
    {

        $query->addWhere("$alias.idestructuracomun = ?", $idEstructuraComun);

        if (strlen($idEstatus) > 0) {
            $query->addWhere("$alias.idestado = ?", $idEstatus);
        }
        if ($idOperacion) {
            $query->addWhere("$alias.idoperacion = ?", $idOperacion);
        }
        if ($idProxEstatus) {
            $query->addWhere("$alias.idproximoestado = ?", $idProxEstatus);
        }
    }

    /**
     *
     */
    public function getTodosEstatus(
    $idEstructuraComun, $idEstatus, $idOperacion, $idProxEstatus, $start, $limit
    )
    {
        $query = $this->getQueryEstatus('eent');
        $this->getQueryWhereEstatus($query, 'eent', $idEstructuraComun, $idEstatus, $idOperacion, $idProxEstatus);

        if ($start) {
            $query->offset($start);
        }
        if ($limit) {
            $query->limit($limit);
        }

        $query->orderBy('idestadosentidad');

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getCantTodosPorEstado(
    $idEstructuraComun, $idEstatus, $idOperacion, $idProxEstatus = false
    )
    {
        $query = $this->getQueryEstatus('eent');
        $this->getQueryWhereEstatus($query, 'eent', $idEstructuraComun, $idEstatus, $idOperacion, $idProxEstatus);
        return $query->count();
    }

    /**
     *
     */
    public function eliminarByArrIdes($rrIdes)
    {
        try {
            $query = new Doctrine_Query();
            $query->delete()->from('CfgEstadosEntidad c')->whereIn(
                'c.idestadosentidad ', $rrIdes
            )->execute();

            return true;
        } catch (Doctrine_exeption $e) {
            return false;
        }
    }

    /**
     *
     */
    public function getEstatusPorOperacion($idoperacion = false, $idEstatus = false, $idestructura = false)
    {
        $query = new Doctrine_Query();
        if ($idEstatus) {
            $query->addWhere("cfg.idestado = ?", array($idEstatus));
        }
        if ($idoperacion) {
            $query->addwhere("cfg.idoperacion = ?", array($idoperacion));
        }
        if ($idestructura) {
            $query->addwhere("cfg.idestructuracomun = ?", array($idestructura));
        }

        $query->select(
            'DISTINCT et.denominacion as denominacion, cfg.idestadosentidad, cfg.idestado as idestado,
            cfg.idproximoestado as idproximoestado'
        )
            ->from('CfgEstadosEntidad cfg')
            ->innerJoin('cfg.NomEstatustecnico et ON cfg.idproximoestado = et.idestatustecnico')
            ->innerJoin('et.DatEstatustecnicoEntidad ete')
            ->execute();

        return $query->fetchArray();
    }

    /**
     *
     */
    public function getNextEstatusTecDadoOperacion($idoperacion, $idEstatus)
    {
        $query = new Doctrine_Query();

        if ($idEstatus == 0) { // Caso de la apertura
            $query->addWhere('ee.idoperacion = ?', array($idoperacion));
        } else {
            $query->where('ee.idoperacion = ? AND ee.idestado = ?', array($idoperacion, $idEstatus));
        }

        $result = $query->select('DISTINCT (ee.idproximoestado) as idproximoestado')
            ->from('CfgEstadosEntidad ee')
            ->execute();

        return $result;
    }

    /**
     *
     */
    public function getCantProxEstatusByIdOperacion($idoperacion, $idEstatus)
    {
        $query = new Doctrine_Query();
        return $query->select('ee.idproximoestado')
                ->from('CfgEstadosEntidad ee')
                ->where('ee.idoperacion = ? AND ee.idestado = ?', array($idoperacion, $idEstatus))
                ->count();
    }

    /**
     *
     */
    public function existEstatus($parametros, $idEstructuraComun)
    {
        $query = new Doctrine_Query();
        return $query->from('CfgEstadosEntidad ee')
                ->where(
                    'ee.idestado = ? AND ee.idproximoestado = ? AND ee.idoperacion = ? AND ee.idestructuracomun = ?',
                    array(
                    $parametros->idestatustecnico,
                    $parametros->idproximoestado,
                    $parametros->idoperacion,
                    $idEstructuraComun
                    )
                )->count();
    }

    public function getEstadoSalidaOperacion($parametros, $idEstructuraComun)
    {
        $query = new Doctrine_Query();
        return $query->select('ee.idproximoestado')
                ->from('CfgEstadosEntidad ee')
                ->where(
                    'ee.idoperacion = ? AND ee.idestructuracomun = ?',
                    array(
                    $parametros->idoperacion,
                    $idEstructuraComun
                    )
                )->fetchArray();
    }

    /**
     *
     */
    public function getNextEstatusByIdEstatusEntidad($idEstatusEntidad)
    {
        return Doctrine::getTable('CfgEstadosEntidad')->find($idEstatusEntidad);
    }

}
