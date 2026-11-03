<?php

class NomConfiguracion extends BaseNomConfiguracion
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasMany('DatCampo', array('local' => 'idconfiguracion', 'foreign' => 'idconfiguracion'));
    }

    /**
     * Devuelve el listado de configuraciones
     *
     * @param     $denom Denominacion de la configuracion
     * @param int $limit
     * @param int $start
     *
     * @return array Listado de configuraciones
     */
    public function GetPorLimite($denom, $limit = 15, $start = 0)
    {
        $query = Doctrine_Query::create()
            ->from('NomConfiguracion');

        if ($limit && $start) {
            $query->limit($limit)->offset($start);
        }

        if (!empty($denom)) {
            $query->addWhere("denominacion ILIKE '%$denom%'");
        }

        return $query->fetchArray();
    }

    /**
     * Devuelve la cantidad total que tiene la tabla
     *
     * @param $denom Denominacion de la configuracion
     *
     * @return Doctrine_Exception|Exception|int
     */
    public function GetCantTotal($denom)
    {
        try {
            $query = Doctrine_Query::create()
                ->select('COUNT(idconfiguracion)')
                ->from('NomConfiguracion');
            if (!empty($denom)) {
                $query->addWhere("denominacion ILIKE '%$denom%'");
            }
            $arr = $query->fetchArray();

            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    /**
     * Obtiene una configuracion especifica
     *
     * @param $idconfiguracion
     *
     * @return array Datos de la configuracion
     */
    public function getConfiguracion($idconfiguracion)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('NomConfiguracion')
            ->where('idconfiguracion = ?', $idconfiguracion)
            ->execute();
        return $result->toArray();
    }
	public function existe($idconfiguracion) {
			$query = new Doctrine_Query ( );
			$result = $query->select('idconfiguracion')
				->from('NomConfiguracion')
				->where('idconfiguracion = ?', $idconfiguracion)
				->execute();
			if(count($result->toArray())>0){
				return true;			
			}
		return false;
    }

    /**
     * Agregar a una consulta las sentencias necesarias para obtener los datos de la configuracion.
     *
     * @param Doctrine_Query $objDoctrineQuery Consulta a la cual se le quiere agregar las sentencias DQL.
     * @param string $aliasTablaReferencia Alias de la clase de dominio que tiene relación con la clase.
     * @param string $aliasTabla Alias para la tabla NomConfiguracion.
     * @param string $includeDqlSelect Si se van a devolver datos de la configuracion.
     * @return Doctrine_Query Consulta modificada con las sentencias que devuelven los datos de la configuracion.
     */
    public function addDqlNomConfiguracion(Doctrine_Query $objDoctrineQuery, $aliasTablaReferencia, $aliasTabla, $includeDqlSelect)
    {
        if ($includeDqlSelect) {
            $objDoctrineQuery->addSelect("$aliasTabla.servidor AS servidor, 
                $aliasTabla.puerto AS puerto, $aliasTabla.basedato AS basedato, 
                $aliasTabla.usuario AS usuario, $aliasTabla.contrasena AS contrasena");
        }
        $objDoctrineQuery->innerJoin("$aliasTablaReferencia.NomConfiguracion $aliasTabla");
        
        return $objDoctrineQuery;
    }
}
