<?php
class DatPlanconteom extends BaseDatPlanconteom
{
    public function setUp()
    {
        $this->hasOne('DatPlanconteo', array('local' => 'idplan', 'foreing' => 'idplan'));
        $this->hasMany('DatPlanconteomDocs', array('local' => 'idplanconteom', 'foreing' => 'idplanconteom'));
        parent::setUp();
    }

    public function eliminarPlanConteoMensual($idplan)
    {
        $q = Doctrine_Query::create();
        return $q->delete()
            ->from('DatPlanconteom')
            ->where('idplan=?', $idplan)
            ->execute();
    }

    public function eliminarMesPlan($idplan, $mes)
    {
        $q = Doctrine_Query::create();
        return $q->delete()
            ->from('DatPlanconteom')
            ->where('idplan=? and mes=?', array($idplan, $mes))
            ->execute();
    }

    public function verificarExistePlanMensual($idmes, $idgrupo, $idplan)
    {
        $query = Doctrine_Query::create();
        return $query->select('dpcm.mes')
            ->from('DatPlanconteom dpcm')
            ->where("dpcm.mes = $idmes and dpcm.idgrupo = $idgrupo AND idplan = '$idplan'")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
    }

    public function actualizaEstadoMes($idplanconteom, $estado)
    {
        $query = Doctrine_Query::create();
        return $query->update('DatPlanconteom dpcm')
            ->set('estado', $estado)
            ->where("dpcm.idplanconteom =?", array($idplanconteom))
            ->execute();
    }

    public function actualizaPorcientoDadoIdplanconteom($idplanconteom, $porciento)
    {
        $query = Doctrine_Query::create();
        return $query->update('DatPlanconteom dpcm')
            ->set('dpcm.porciento', round($porciento))
            ->where("dpcm.idplanconteom =? ", $idplanconteom)
            ->execute();
    }

    public function aplicarPorcientoDadoIdplan($idplan, $porciento)
    {
        $query = Doctrine_Query::create();
        return $query->update('DatPlanconteom dpcm')
            ->set('dpcm.porciento', round($porciento))
            ->where("dpcm.estado=1 and dpcm.idplan =? ", $idplan)
            ->execute();
    }

    public function obtenerPorCientoMes($idejercicio, $idestructura, $idmes)
    {

        $query = Doctrine_Query::create();
        return $query->select('dpcm.porciento')
            ->from('DatPlanconteom dpcm')
            ->innerjoin('dpcm.DatPlanconteo dpc')
            ->where(
                    'dpc.idejercicio = ? and dpc.idestructuraop = ? and dpcm.idperiodo =?',
                array($idejercicio, $idestructura, $idmes)
            )
            ->fetchArray();
    }

    public function obtenerMesesParaInventario($idplan)
    {
        $conn = Zend_Registry::get('conexion');
        $sql
            = "select DISTINCT dpcm.*
				from dat_planconteom dpcm
				where dpcm.idplan = $idplan  AND dpcm.estado = 5";
        $a = $conn->execute($sql);
        return $a->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPeriodosParaInventario($idplan)
    {
        $conn = Zend_Registry::get('conexion');
        $sql
            = "select DISTINCT dpcm.*
				from dat_planconteom dpcm
				where dpcm.idplan = $idplan  AND dpcm.estado = 5";
        $a = $conn->execute($sql);
        return $a->fetchAll(PDO::FETCH_ASSOC);
    }

    public function cantidadMesesAprobadosConfirmados($idplan)
    {
        $conn = Zend_Registry::get('conexion');
        $sql
            = "select DISTINCT count(dpcm.idperiodo) as cantidad
				from dat_planconteom dpcm
				where dpcm.idplan = $idplan AND dpcm.estado IN (2,5)";
        $a = $conn->execute($sql);
        return $a->fetchAll(PDO::FETCH_ASSOC);
    }


    public function verificarTodosPeriodosEstadoELaboracion($idplan)
    {
        $query = Doctrine_Query::create();
        $cantidad = $query->from('DatPlanconteom dpcm')
            ->where('dpcm.idplan=? and dpcm.estado !=?', array($idplan, 1))
            ->count();
        if ($cantidad == 0) {
            return true;
        } else {
            return false;
        }
    }

}