<?php
class ConfCompproceso extends BaseConfCompproceso
{
	public function setUp()
    {
        parent :: setUp();
        $this->hasMany('DatProceso', array('local' => 'idproceso', 'foreign' => 'idproceso'));
    }
	
	/**
	* Función que devuelve las configuraciones dado un id.
	* @param $id
	*/
	public function getById($id)
    {
        return Doctrine::getTable('ConfCompproceso')->find($id);
    }

    public function getEntidadesByIdProceso($idproceso)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('ConfCompproceso p')
            ->where("p.idproceso = '$idproceso'")
            ->execute();
        return $result->toArray();
    }

    public function getProcesosByIdEstructura($idestructura, $arrayCargos)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('p.*, dp.denominacion as denominacion, dp.idestructura as identidad')
            ->from('ConfCompproceso p')
            ->innerJoin('p.DatProceso dp')
            ->innerJoin('dp.DatProcesocargo dpc')
            ->where("p.idestructura = '$idestructura'");
        if (count($arrayCargos)>0) {
            $query->whereIn('dpc.idcargo',$arrayCargos);
        }
        return $result->fetchArray();
    }

    public function deleteByIdProceso($idproceso)
    {
        $query = new Doctrine_Query ();
        $result = $query->delete()
            ->from('ConfCompproceso p')
            ->where("p.idproceso = '$idproceso'")
            ->execute();
    }
}
