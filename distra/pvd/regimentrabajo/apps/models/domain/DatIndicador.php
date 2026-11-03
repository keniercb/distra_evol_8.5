<?php

class DatIndicador extends BaseDatIndicador
{

    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idrotacion)
    {
        return Doctrine::getTable('DatIndicador')->find($idrotacion);
    }


	public static function getIndicadoresNoGestionables($filtro = null, $limit = null, $start = 0)
{
	try {
		$query = Doctrine_Query::create()
			->select('idindicador,gestionable,denominacion, fdesde, fhasta, descripcion,unidadmedida,idexpresionmatematica')
			->from('DatIndicador')
		 ->where('gestionable=0');
		if ($limit) {
			$query->limit($limit)
				->offset($start);
		}
		if ($filtro != null) {
			$query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
		}
		return $query->execute()->toArray();
	} catch (Doctrine_Exception $e) {
		throw $e;
	}
}

	public static function getTodosIndicadores($filtro = null, $limit = null, $start = 0)
	{
		try {
			$query = Doctrine_Query::create()
				->select('idindicador,denominacion,gestionable, fdesde, fhasta, descripcion,unidadmedida,idexpresionmatematica')
				->from('DatIndicador');
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }
            if ($limit) {
                $query->limit($limit)
                    ->offset($start);
            }
            return $query->execute()->toArray();
		} catch (Doctrine_Exception $e) {
			throw $e;
		}
	}

	public static function getRegimenTrabajoActive($filtro = null, $limit = null, $start = 0)
	{
		try {
			$query = Doctrine_Query::create()
				->select('idregimentrabajo,denominacion, fdesde, fhasta, descripcion')
				->from('NomRegimentrabajo')
				->where('fdesde <= current_date and (current_date <= fhasta or fhasta is null)');
			if ($filtro != null) {
				$query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
			}
			if ($limit) {
				$query->limit($limit)
					->offset($start);
			}
			return $query->fetchArray();
		} catch (Doctrine_Exception $e) {
			throw $e;
		}
	}

	/**
	 * @param null $filtro
	 * @throws Doctrine_Exception
	 * @throws Exception
	 */
	public function getCantTipoRegimenTrabajoActive($filtro = null)
	{
		try {
			$query = Doctrine_Query::create()
				->from('NomRegimentrabajo')
				->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
			if ($filtro != null) {
				$query->andWhere("denominacion ilike '%$filtro%'");
			}
			return $query->count();
		} catch (Doctrine_Exception $e) {
			throw $e;
		}
	}

	/**
	 * @param $idregimentrabajo
	 * @param $denominacion
	 * @param $descripcion
	 * @param $fdesde
	 * @param $fhasta
	 */
	public function modTipoRegimenTrabajo($idregimentrabajo, $denominacion, $descripcion,$horastrabajo, $fdesde, $fhasta)
	{
		try {
			$query = Doctrine_Query::create()
				->update('NomRegimentrabajo')
				->where('idregimentrabajo= ? ', $idregimentrabajo);
			if ($denominacion != '') {
				$query->set('denominacion', '?', $denominacion);
			}
			if ($descripcion != '') {
				$query->set('descripcion', '?', $descripcion);
			} else {
				$query->set('descripcion', 'null');
			}
			if ($horastrabajo != '') {
				$query->set('horastrabajo', '?', $horastrabajo);
			}
			if ($fdesde != '') {
				$query->set('fdesde', '?', $fdesde);
			}
			if ($fhasta != '') {
				$query->set('fhasta', '?', $fhasta);
			} else {
				$query->set('fhasta', 'null');
			}
			$result = $query->execute();
			if ($result) {
				return true;
			} else {
				return false;
			}
		} catch (Exception $exc) {
			echo $exc->getTraceAsString();
		}
	}

	/**
	 * @param $denom
	 * @param null $idregimentrabajo
	 * @throws Doctrine_Exception
	 * @throws Exception
	 */
	public function findByIdOrDenom($denom, $idregimentrabajo = null)
	{
		try {
			$query = Doctrine_Query::create();
			$query->from('NomRegimentrabajo')
				// ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
				->Where("denominacion = '$denom'");
			if (!empty($idregimentrabajo)) {
				$query->andWhere("idregimentrabajo <> ?", $idregimentrabajo);
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
	 * Funcion para obteners los tipos de categorias dado un array de identificadores
	 *
	 * @param array $ids
	 * @param bool $in True para buscar solo por el array de ids y false para buscar todos los que no esten en el array
	 * @param null $limit
	 * @param int $start
	 * @throws Doctrine_Exception
	 * @return array
	 */
	public function getTipoRegimenTrabajoActivaByParams(array $ids, $in = true, $limit = null, $start = 0)
	{
		try {
			$query = Doctrine_Query::create()
				->select('idregimentrabajo,idregimentrabajo as idnomenclador, denominacion, fdesde, fhasta, descripcion')
				->from('NomRegimentrabajo')
				->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
			if ($limit) {
				$query->limit($limit)
					->offset($start);
			}
			if (count($ids) > 0) {
				if ($in) {
					$query->andWhereIn('idregimentrabajo', $ids);
				} else {
					$query->andWhereNotIn('idregimentrabajo', $ids);
				}
				return $query->execute()->toArray();
			}
			return array();
		} catch (Doctrine_Exception $e) {
			throw $e;
		}
	}

	/**
	 * Funcion para obtener la cantidad de tipos de categorias dado un array de identificadores
	 *
	 * @param array $ids
	 * @param bool $in True para buscar solo por el array de ids y false para buscar todos los que no esten en el array
	 * @throws Doctrine_Exception
	 * @return int
	 */
	public function getCantTipoRegimenTrabajoActivaByParams(array $ids, $in = true){
		try {
			$query = Doctrine_Query::create()
				->from('NomRegimentrabajo')
				->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
			if (count($ids) > 0) {
				if ($in) {
					$query->andWhereIn('idregimentrabajo', $ids);
				} else {
					$query->andWhereNotIn('idregimentrabajo', $ids);
				}
				return $query->count();
			}
			return 0;
		} catch (Doctrine_Exception $e) {
			throw $e;
		}
	}

	public function getDenomRegimenById($idregimentrabajo)
	{
		$query = Doctrine_Query::create()
			->select('g.denominacion')
			->from('NomRegimentrabajo g')
			->where("g.idregimentrabajo = '$idregimentrabajo'");
		return $query->execute()->toArray();
	}

	public function GetTodos()
	{
		$query = new Doctrine_Query ();
		$result = $query->from('NomRegimentrabajo')->execute ();
		return $result->toArray();

	}

	public function Getpersonas($cargos,$filtro, $start= 0, $limit= 15)
	{
		$query = new Doctrine_Query ();
		ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($query,'pers','per','InnerJoin',true,true);
		ZendExt_IoC_Inter::getInstance()->persona->addDQLOcupacion($query, 'per', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true);
		ZendExt_IoC_Inter::getInstance()->persona->addDQLRegimenTrabajo($query, 'pers', 'drt', 'leftJoin', true);
		$result = $query->select('pers.*,drt.idregimentrabajo as regimen,dpentd.*,dslab.*,drt.*,ddi.numero')
			->from('DatPersona pers')
			->leftJoin('pers.DatDocidentidad ddi')
			->leftJoin('pers.DatRegimentrabajo drt')
			->innerJoin('pers.DatPersonaentidad dpentd')
			->leftJoin('dpentd.DatSituacionlaboral dslab')
			->where('dslab.idcargo in ('.implode(',',$cargos).')')
			->limit($limit)
			->offset($start);
		if(!empty($filtro)){
			$result->addWhere("ddi.numero ilike '%$filtro%' or pers.nombre ilike '%$filtro%' or pers.snombre ilike '%$filtro%' or pers.papel ilike '%$filtro%' or pers.sapel ilike '%$filtro%'");
		}
		return $result->execute()->toArray();
	}

	public function GetCantpersonas($cargos){
		$query = new Doctrine_Query ();
		ZendExt_IoC_Inter::getInstance()->persona->addDQLPersona($query,'pers','per','InnerJoin',true,true);
		ZendExt_IoC_Inter::getInstance()->persona->addDQLOcupacion($query, 'per', array('dpentd', 'dslab', 'nsitu'), 'leftjoin', true, true);
		ZendExt_IoC_Inter::getInstance()->persona->addDQLRegimenTrabajo($query, 'pers', 'drt', 'leftJoin', true);
		$result = $query->select('pers.*,drt.idregimentrabajo as regimen,dpentd.*,dslab.*,drt.*,ddi.numero')
			->from('DatPersona pers')
			->leftJoin('pers.DatDocidentidad ddi')
			->leftJoin('pers.DatRegimentrabajo drt')
			->innerJoin('pers.DatPersonaentidad dpentd')
			->leftJoin('dpentd.DatSituacionlaboral dslab')
			->where('dslab.idcargo in ('.implode(',',$cargos).')');
		return $result->count();
	}


}

