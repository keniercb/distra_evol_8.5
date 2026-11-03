<?php

/**
 * Jorge Luis Cuellar Mondeja
 */
class EstatusModel extends NomencladoresModel
{

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     *
     */
    public function getEstatusTecnicos($parametros)
    {
        $datos = NomEstatustecnico::getEstatusTecnicos($parametros);
        $total = NomEstatustecnico::getCantEstatusTecnicos($parametros);
        return array('cantidad' => $total, 'datos' => $datos);
    }

    /**
     *
     */
    public function getEstatusOperativos($parametros)
    {
        $datos = NomEstatusoperativo::getEstatusOperativos($parametros);
        $total = NomEstatusoperativo::getCantEstatusOperativos($parametros);

        return array('cantidad' => $total, 'datos' => $datos);
    }

    /**
     *
     */
    public function getEstatusTecById($id)
    {
        $query = Doctrine_Query::create();
        $query->from('NomEstatustecnico n')
            ->where('n.idestatustecnico = ?', $id);

        return $query->fetchArray();
    }

    /**
     *
     */
    public function eliminarEstatusTecnicos($estados, $modificar = array())
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        foreach ($estados as $key => $idestatustecnico) {

            try {
                $tabla = Doctrine::getTable('NomEstatustecnico')->find($idestatustecnico);
                $tabla->delete();
            } catch (Doctrine_Connection_Pgsql_Exception $e) {

                if ($e->getCode() == '23503') {
                    unset($estados[$key]);
                    $modificar[] = $idestatustecnico;

                    if ($conn->getTransactionLevel() != 0) {
                        $conn->rollBack();
                    }

                    self::eliminarEstatusTecnicos($estados, $modificar);
                }
            }
        }

        if (is_array($modificar) && count($modificar)) {

            $query = new Doctrine_Query();
            $query->update('NomEstatustecnico')
                ->set('estado', 0)
                ->whereIn('idestatustecnico', $modificar)
                ->execute();
        }
        return true;
    }

    /**
     *
     */
    public function insertarEstatusOperativo($parametros)
    {
        unset($parametros['idestatusoperativo']);

        if ($parametros['duplicar']) {
            $relacion = new DatEstatustecnicoEstatusoperativo();
            $relacion->idestatusoperativo = $parametros['idestatusoperativodup'];
            $relacion->idestatustecnico = $parametros['idpadre'];
            $relacion->disponible = $parametros['disponible'];
            $relacion->pordefecto = $parametros['pordefecto'];
            $relacion->afectacdt = $parametros['afectacdt'];

            $relacion->save();

            return 1;
        } else {
            /**
             * return integer (0) - No duplicado, (-1) - Duplicado con el mismo estado técnico,
             * (idestatusoperativo) - Duplicado con en otro estado técnico
             */
            $idestatusoperativo = self::isEstOperDuplicado($parametros['denominacion'], $parametros['idpadre']);

            if (!$idestatusoperativo) {
                $estadoOperativo = new NomEstatusoperativo();

                $datEstatustecnico = 'DatEstatustecnicoEstatusoperativo';

                $estadoOperativo->synchronizeWithArray($parametros);
                $estadoOperativo->$datEstatustecnico->synchronizeWithArray(
                    $parametros
                );
                $estadoOperativo->$datEstatustecnico->idestatustecnico = $parametros['idpadre'];

                if ($estadoOperativo->$datEstatustecnico->pordefecto == 1
                ) {
                    $this->quitarTodosPorDefectoByIdPadre($parametros['idpadre']);
                }

                $estadoOperativo->save();

                return 1;
            } else {
                if ($idestatusoperativo == -1) {
                    return 2;
                } else {
                    return $idestatusoperativo;
                }
            }
        }
    }

    /**
     * return integer (0) - No duplicado, (-1) - Duplicado con el mismo estado técnico,
     * (idestatusoperativo) - Duplicado
     * con en otro estado técnico
     */
    private function isEstOperDuplicado($denominacion, $pIdEstatusOperativo)
    {
        return NomEstatusoperativo::isEstOperDuplicado($denominacion, $pIdEstatusOperativo);
    }

    /**
     *
     */
    public function modificarEstatusOperativo($parametros)
    {
        if (!$parametros['disponible']) {
            $parametros['disponible'] = 0;
        }

        if (!$parametros['pordefecto']) {
            $parametros['pordefecto'] = 0;
        }

        if (!$parametros['afectacdt']) {
            $parametros['afectacdt'] = 0;
        }

        $query = new Doctrine_Query();
        $query->from('NomEstatusoperativo eo')
            ->innerJoin('eo.DatEstatustecnicoEstatusoperativo eteo');

        $query->addWhere("denominacion iLike '{$parametros['denominacion']}'");

        if ($parametros['idestatusoperativo']) {
            $query->addWhere('eo.idestatusoperativo <> ?', array($parametros['idestatusoperativo']));
        }

        // Buscar si la denominación ya existe
        $estaus = $query->count();

        if ($estaus) {
            return 2;
        }

        $estadoOperativo = Doctrine::getTable('NomEstatusoperativo')->find($parametros['idestatusoperativo']);

        $datEstatus = 'DatEstatustecnicoEstatusoperativo';

        if ($parametros['pordefecto'] == 1) {
            if ($estadoOperativo->$datEstatus->pordefecto != 1) {

                Doctrine_Query::create()->update('DatEstatustecnicoEstatusoperativo deteo')
                    ->set('deteo.pordefecto', '0')
                    ->where('deteo.idestatustecnico = ?', $parametros['idpadre'])
                    ->execute();
            }
        }

        if ($estadoOperativo->$datEstatus->pordefecto != $parametros['pordefecto']) {
            $estadoOperativo->$datEstatus->pordefecto = $parametros['pordefecto'];
        }

        $estadoOperativo->synchronizeWithArray($parametros);
        $estadoOperativo->$datEstatus->synchronizeWithArray($parametros);

        if ($estadoOperativo->$datEstatus->pordefecto == 1) {
            $this->quitarTodosPorDefectoByIdPadre($parametros['idpadre']);
        }
        $estadoOperativo->save();

        return 1;
    }

    /**
     *
     */
    private function quitarTodosPorDefectoByIdPadre($idpadre)
    {
        $query = new Doctrine_Query();
        $query->update('DatEstatustecnicoEstatusoperativo')
            ->set('pordefecto', 0)
            ->where('idestatustecnico = ?', $idpadre)
            ->execute();
    }

    /**
     *
     */
    public function eliminarEstatusOperativo($parametros, $modificar = array())
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();

        $parametros['idnom'] = explode('"', substr($parametros['idnom'], 1, strlen($parametros['idnom']) - 2));

        foreach ($parametros['idnom'] as $pos => $idEO) {
            try {
                if ($pos % 2 != 0) {

                    $query = new Doctrine_Query();
                    $count = $query->from('DatEstatustecnicoEstatusoperativo eteo')
                        ->where('eteo.idestatusoperativo = ?', array($idEO))
                        ->count();

                    $query = new Doctrine_Query();
                    if ($count > 1) {

                        $query->delete()->from('DatEstatustecnicoEstatusoperativo eteo')
                            ->where(
                                'eteo.idestatusoperativo = ? AND eteo.idestatustecnico = ?',
                                array($idEO, $parametros['idpadre'])
                            )
                            ->execute();
                    } else {

                        $query->delete()->from('NomEstatusoperativo eo')
                            ->where('eo.idestatusoperativo = ?', array($idEO))
                            ->execute();
                    }
                }
            } catch (Doctrine_Connection_Pgsql_Exception $e) {
                if ($e->getCode() == '23503') {
                    unset($parametros['idnom'][$pos]);
                    $modificar[] = $idEO;

                    if ($conn->getTransactionLevel() != 0) {
                        $conn->rollBack();
                    }

                    self::eliminarEstatusTecnicos(
                        $parametros['idnom'], $modificar
                    );
                }
            }
        }

        if ($modificar) {

            $query = new Doctrine_Query();
            $query->update('NomEstatusoperativo')
                ->set('estado', 0)
                ->whereIn('idestatusoperativo', $modificar)
                ->execute();
        }
        return true;
    }

    /**
     * @param       $alias
     * @param bool  $select
     * @param array $paramsWhere
     *
     * @return Doctrine_Query
     */
    public function getQueryNomEstatusTecnico($alias, $select = false, $paramsWhere = array())
    {
        $query = new Doctrine_Query();
        $query->from("NomEstatustecnico {$alias}");
        $query->select("{$alias}.idestatustecnico");

        if ($select) {
            $this->getSelectQueryEstatusTecnico($query, $alias, '');
        }

        if ($paramsWhere) {
            $this->getWhereQueryEstatusTecnico($query, $alias, $paramsWhere);
        }

        return $query;
    }

    /**
     * @param Doctrine_Query $query
     * @param                $alias
     * @param                $aliasExt
     * @param int            $join
     * @param bool           $select
     * @param array          $paramsWhere
     */
    public function getJoinQueryEstatusTecnico(
    Doctrine_Query &$query, $alias, $aliasExt, $join = 1, $select = false, $paramsWhere = array(), $posAlias = ''
    )
    {
        if (!$query) {
            $query = new Doctrine_Query();
            $query->from("NomEstatustecnico {$alias}");
        } else {

            if ($join) {
                $query->innerJoin("{$aliasExt}.NomEstatustecnico {$alias}");
            } else {
                $query->leftJoin("{$aliasExt}.NomEstatustecnico {$alias}");
            }
        }

        if ($select) {
            $this->getSelectQueryEstatusTecnico($query, $alias, $posAlias);
        }

        if ($paramsWhere) {
            $this->getWhereQueryEstatusTecnico($query, $alias, $paramsWhere);
        }
    }

    /**
     * @param Doctrine_Query $query
     * @param                $alias
     * @param string         $postAlias
     */
    public function getSelectQueryEstatusTecnico(Doctrine_Query &$query, $alias, $postAlias = '')
    {
        $columnNames = Doctrine::getTable('NomEstatustecnico')->getColumnNames();

        foreach ($columnNames as $columna) {
            $query->addSelect("{$alias}.{$columna} AS {$columna}$postAlias");
        }
    }

    /**
     * @param Doctrine_Query $query
     * @param                $alias
     * @param array          $paramsWhere
     */
    public function getWhereQueryEstatusTecnico(Doctrine_Query &$query, $alias, $paramsWhere = array())
    {
        ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO)->getFiltroGenerico($query, $alias, 'NomEstatustecnico', $paramsWhere);
    }

}
