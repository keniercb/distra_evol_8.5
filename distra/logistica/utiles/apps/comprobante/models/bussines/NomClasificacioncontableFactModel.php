<?php

/**
 * @class      ClasificacioncontableModel
 *
 *
 * @package    Inventario
 * @subpackage Inventario
 * @author     Maricet Estevez
 * @copyright  XETID-GE
 * @version    1.0
 */
class NomClasificacioncontableFactModel extends NomencladoresModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $obj['facturacion'] = 1;
        $resultados = parent::buscar($obj, $arrIdsInsertados, $returnobj);
        $cacheCuentas = array();
        foreach ($resultados['datos'] as &$clasififacion) {
            if (!array_key_exists($clasififacion['idcuenta'], $cacheCuentas)) {
                $cacheCuentas[$clasififacion['idcuenta']] = ServiciosContabilidadFinanzasHelper::__init()
                    ->obtenerCuentaPorId($clasififacion['idcuenta']);
            }
            if (!array_key_exists($clasififacion['idcuentaalt'], $cacheCuentas)) {
                $cacheCuentas[$clasififacion['idcuentaalt']] = ServiciosContabilidadFinanzasHelper::__init()
                    ->obtenerCuentaPorId($clasififacion['idcuentaalt']);
            }
            $clasififacion['cuenta'] = $cacheCuentas[$clasififacion['idcuenta']]->text;
            $clasififacion['cuentaalt'] = $cacheCuentas[$clasififacion['idcuentaalt']]->text;
        }
        return $resultados;
    }

    public function buscarEntidad($obj, $devolvequery = false){
        $obj['facturacion'] = 1;
        return parent::buscarEntidad($obj, $devolvequery);
    }

    public function obtenerClasificacion($idClasificacion = null)
    {
        $query = new Doctrine_Query();
        $query->from('NomClasificacioncontablelog c')
            ->select(
                'c.idclasificacioncontable as id, c.denominacion as clasificacion, c.idcuenta as cuenta, c.codigo'
            );
        if ($idClasificacion) {
            $query->andWhere('c.idclasificacioncontable = ? ', array($idClasificacion));
        }
        return $query->fetchArray();
    }

    public function addSelectClasificacion(Doctrine_Query $dql, $alias, $campoId = 'idclasificacioncontable')
    {
        $dql->addSelect(
            "(SELECT c.denominacion FROM NomClasificacioncontablelog c"
            . " WHERE c.idclasificacioncontable = {$alias}.{$campoId}) as clasificacioncontable"
        );
    }

    public static function getInstance()
    {
        return new NomClasificacioncontableModel;
    }
    
    public function getJoinClasificacionCont($dql, $aliasE, $join= 'left', $aliasI='cc')
    {
        if($join== 'left'){
            $dql->leftJoin("{$aliasE}.NomClasificacioncontablelog {$aliasI}");
        }else{
            $dql->innerJoin("{$aliasE}.NomClasificacioncontablelog {$aliasI}");
        }
        return $dql->addSelect(
                "cc.idclasificacioncontable as idclasificacioncontable, "
            . "cc.denominacion as clasificacioncont, cc.idcuenta as cuenta, cc.idcuentaalt as cuentaalt"
        );
    }

}
