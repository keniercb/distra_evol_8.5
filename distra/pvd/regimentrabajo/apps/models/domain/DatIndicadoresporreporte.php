<?php

class DatIndicadoresporreporte extends BaseDatIndicadoresporreporte
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasOne ('DatIndicador', array ('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne ('NomCausa', array ('local' => 'idcausa', 'foreign' => 'idcausa'));

    }

    public function getByid($idrotacion)
    {
        return Doctrine::getTable('DatIndicadoresporreporte')->find($idrotacion);
    }


	public static function getIndicadores($idreporte,$filtro = null, $limit = null, $start = 0)
{
	try {
		$query = Doctrine_Query::create()
			->select('datc.idindicadorporreporte,datc.orden as orden,ind.idindicador as indicador,ind.denominacion as denominacion, ind.fdesde as fdesde, ind.fhasta as fhasta, ind.descripcion as descripcion,
			ind.unidadmedida as unidadmedida,ind.idexpresionmatematica as idexpresionmatematica')
			->from('DatIndicadoresporreporte datc')
			->innerJoin('datc.DatIndicador ind')
			->where("datc.idreporte='$idreporte'");
		if ($limit) {
			$query->limit($limit)
				->offset($start);
		}
		if ($filtro != null) {
			$query->andWhere("ind.denominacion ilike '%$filtro%' or ind.descripcion ilike '%$filtro%'");
		}
		return $query->execute()->toArray();
	} catch (Doctrine_Exception $e) {
		throw $e;
	}
}

	public static function getIndicadoresCausa($idreporte,$filtro = null, $limit = null, $start = 0)
	{
		try {
			$query = Doctrine_Query::create()
				->select('ind.idcausa as idcausa,datc.idindicadorporreporte,,datc.orden as orden,ind.denominacion as denominacion, ind.fdesde as fdesde, ind.fhasta as fhasta, ind.descripcion as descripcion')
				->from('DatIndicadoresporreporte datc')
				->innerJoin('datc.NomCausa ind')
				->where("datc.idreporte='$idreporte'");
			if ($limit) {
				$query->limit($limit)
					->offset($start);
			}
			if ($filtro != null) {
				$query->andWhere("ind.denominacion ilike '%$filtro%' or ind.descripcion ilike '%$filtro%'");
			}
			return $query->execute()->toArray();
		} catch (Doctrine_Exception $e) {
			throw $e;
		}
	}

	public function delIndicadoresReporte($idreporte){
		try {
			$sqlCriterio= " DELETE FROM mod_regimentrabajo.dat_indicadoresporreporte WHERE mod_regimentrabajo.dat_indicadoresporreporte.idreporte=".$idreporte.";";
			$mg = Doctrine_Manager::getInstance();
			$conn = $mg->getCurrentConnection();
			$r = $conn->fetchAll($sqlCriterio);
			return $r;
		} catch (Doctrine_Exception $e) {
			return $e;
		}

	}


}

