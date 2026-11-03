<?php

class DatEvaltrazas extends BaseDatEvaltrazas {

    public function setUp() {
        parent::setUp();        
        $this->hasMany('DatEvalmodelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasMany('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    public function Buscar($idtraza) {
        $temp = $this->conn->getTable('DatEvaltrazas')->find($idtraza);
        return $temp->toArray();
    }

    public function getTrazaById($idtraza) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvaltrazas')->where('idtraza = ?', $idtraza)->execute();
        return $result->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvaltrazas')->execute();
        return $result->toArray();
    }

    public function GetByLimite($limit, $start) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvaltrazas')
                ->limit($limit)
                ->offset($start)
                ->execute();
        return $result->toArray();
    }

    public function GetCantTotal() {
        try {
            $query = new Doctrine_Query ( );
            $result = $query->select('COUNT(idtraza)')->from('DatEvaltrazas')->execute();
            $arr = $result->toArray();
            return (is_array($arr) ? $arr [0] ['COUNT'] : 0);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetPorLimite($limite = 100, $inicio = 0) {
        $query = new Doctrine_Query ( );
        $result = $query->from('DatEvaltrazas')->limit($limite)->offset($inicio)->execute();
        return $result->toArray();
    }     

    
    public function verifExiste($idtraza) {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('DatEvaltrazas t')
                    ->where("t.idtraza=?", $idtraza)
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }
	public function getTrazas(
        $idmodelo, $filtro, $limit = null, $start = null      
    )
    {

        $sql = "SELECT 
				  mod_evaluaciones.dat_evaltrazas.idtraza,
				  mod_evaluaciones.dat_evaltrazas.hora,
				  mod_evaluaciones.dat_evaltrazas.fecha,
				  mod_evaluaciones.dat_evaltrazas.idpersona,
				  mod_evaluaciones.dat_evaltrazas.idmodelo,
				  mod_persona.dat_persona.nombre,
				  mod_persona.dat_persona.snombre,
				  mod_persona.dat_persona.papel,
				  mod_persona.dat_persona.sapel,
				  mod_persona.dat_docidentidad.numero
				FROM
				  mod_evaluaciones.dat_evaltrazas
				  INNER JOIN mod_persona.dat_persona ON (mod_evaluaciones.dat_evaltrazas.idpersona = mod_persona.dat_persona.idpersona)
				  INNER JOIN mod_persona.dat_docidentidad ON (mod_persona.dat_persona.idpersona = mod_persona.dat_docidentidad.idpersona)
				WHERE
				  mod_evaluaciones.dat_evaltrazas.idmodelo = {$idmodelo}";
        
		if (!empty($filtro)) {
            $sql .= " AND (mod_persona.dat_persona.nombre ILIKE '%$filtro%' OR mod_persona.dat_persona.snombre ILIKE '%$filtro%' OR mod_persona.dat_persona.papel ILIKE '%$filtro%' OR mod_persona.dat_persona.sapel ILIKE '%$filtro%')";
        }
       
		if ($limit) {
            $sql .= " LIMIT $limit";
        }

        if ($start) {
            $sql .= " OFFSET $start";
        }

        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);        
        return $result;
    }
	
	 public function getCantTrazas($idmodelo, $filtro = null)
    {
        $queryObj = Doctrine_Query::create()
            ->select('COUNT(t.idtraza) AS cantidad')
            ->from('DatEvaltrazas t')
            ->where('t.idmodelo = ?', $idmodelo);

		 if (!empty($filtro)) {
            $queryObj->addWhere(
                "p.nombre ILIKE '%$filtro%' OR p.snombre ILIKE '%$filtro%' OR p.papel ILIKE '%$filtro%' OR p.sapel ILIKE '%$filtro%'"
            );
        }
        //Agregando a la consulta de evaluados las sentencias DQL que devuelve los datos de la persona.
        $queryObj = ZendExt_IoC::getInstance()->pvd->agregarDqlDatosPersona($queryObj, 't', 'p', false, array());

        return $queryObj->fetchOne()->cantidad;
    }

}