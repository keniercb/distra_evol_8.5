<?php

class DatEvalindicadoresplanilla extends BaseDatEvalindicadoresplanilla
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatEvalplanillasevaluativas', array('local' => 'idplanilla', 'foreign' => 'idplanilla'));
        $this->hasMany('DatEvalindicadoresplanilla', array('local' => 'idpadre', 'foreign' => 'idindicadorplanilla'));
        $this->hasOne('DatEvalindicadoresplanilla', array('local' => 'idindicadorplanilla', 'foreign' => 'idpadre'));
        $this->hasOne('DatEvalindicadorescalculado', array('local' => 'idindicadorplanilla', 'foreign' => 'idindicadorplanilla'));
        $this->hasOne('DatEvalindicadoresevaluar', array('local' => 'idindicadorplanilla', 'foreign' => 'idindicadorplanilla'));
        $this->hasOne('NomEvalindicadortexto', array('local' => 'idindicador', 'foreign' => 'idindicadortexto'));
    }

    public function Buscar($idindicadorplanilla)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalindicadoresplanilla r')
            ->where("r.idindicadorplanilla='$idindicadorplanilla'")
            ->setHydrationMode(Doctrine:: HYDRATE_ARRAY)
            ->execute();

        return $result;
    }

    /**
     * Devuelve todos los indicadores de una planilla evaluativa
     * @param $idplanilla
     *
     * @return array|Doctrine_Exception|Exception
     */
    public function BuscarIdPlanilla($idplanilla)
    {
        try {
            $query = new Doctrine_Query ();
            $result = $query->from('DatEvalindicadoresplanilla')
                ->where("idplanilla =$idplanilla")
                ->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetTodos()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalindicadoresplanilla')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 100, $inicio = 0)
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalindicadoresplanilla')->limit($limite = 100)->offset($inicio = 0)->execute();

        return $result->toArray();
    }

    public function GetIndicadoresPorPlanilla($idplanilla, $idnodopadre)
    {
        try {
            $result = array();
            $sqlWhere = "";
            if (empty($idnodopadre)) {
                $sqlWhere = "ip.idplanilla=$idplanilla";
            } else if ($idnodopadre == -1) {
                $sqlWhere = "ip.idplanilla=$idplanilla and ip.idindicadorplanilla = ip.idpadre";
            } else {
                $sqlWhere
                    = "ip.idplanilla=$idplanilla and ip.idpadre = $idnodopadre and ip.idindicadorplanilla <> ip.idpadre";
            }

            //Utilizo esta forma de conexi�n y consulta a la BD pues la anterior me estaba dando problemas.			
            $query = Doctrine_Manager::getInstance();
            $sql
                = "SELECT ip.idindicadorplanilla,ip.idindicador,ip.tipo,ip.abreviatura,ip.idpadre,ip.calculado,ip.ayuda,die.idescala,die.complementotextual, ip.eshoja, dic.idindicadorcalculado,
                  idexpresionmatematica
					FROM mod_evaluaciones.dat_evalindicadoresplanilla ip
					left JOIN mod_evaluaciones.dat_evalindicadoresevaluar die ON (ip.idindicadorplanilla = die.idindicadorplanilla) 
                                        left JOIN mod_evaluaciones.dat_evalindicadorescalculado dic ON (ip.idindicadorplanilla = dic.idindicadorplanilla)
					WHERE " . $sqlWhere.' ORDER BY ip.idindicadorplanilla ASC';


            $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function obtenerListadoIndicadoresXPlanilla($idplanilla)
    {
        try {
            $query = Doctrine_Manager::getInstance();
            $sql = "SELECT ip.idindicadorplanilla,ip.idindicador,ip.tipo,ip.abreviatura,ip.idpadre,ip.calculado,ip.ayuda,die.idescala,die.complementotextual
					FROM mod_evaluaciones.dat_evalindicadoresplanilla ip
					INNER JOIN mod_evaluaciones.dat_evalindicadoresevaluar die ON (ip.idindicadorplanilla = die.idindicadorplanilla)
					WHERE ip.idplanilla = {$idplanilla}";
            $result = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function GetLastIdIP()
    {
        $query = new Doctrine_Query ();
        $result = $query->from('DatEvalindicadoresplanilla ip')
            ->orderBy('ip.idindicadorplanilla DESC')
            ->execute();
        $objLastIP = $result->toArray();

        return $objLastIP[0]['idindicadorplanilla'];
    }

    public function GetHijosNodo($idplanilla, $idnodo)
    {
        /* $query = new Doctrine_Query ();
          $result = $query->select('ip.idindicadorplanilla, ip.idpadre, ip.calculado')
          ->from ('DatEvalindicadoresplanilla ip')
          ->where("ip.idplanilla = $idplanilla and
          ip.idpadre = $idnodo and
          ip.idindicadorplanilla = ip.idpadre")
          ->setHydrationMode( Doctrine:: HYDRATE_ARRAY )
          ->execute ();
          return $result; */

        $query = Doctrine_Manager::getInstance();
        $sql = " SELECT ip.idindicadorplanilla,ip.idplanilla,ip.idpadre, ip.calculado
				   FROM mod_evaluaciones.dat_evalindicadoresplanilla ip
				   WHERE ip.idplanilla = $idplanilla AND
						 ip.idpadre = $idnodo AND
						 ip.idindicadorplanilla <> ip.idpadre;";
        return $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getListIndicadoresHojasByPlanilla($idplanilla)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('ip.idindicadorplanilla, ip.idindicador, ip.tipo, ip.abreviatura, ip.idpadre, ip.ayuda,
            ip.idplanilla, ip.eshoja, ip.calculado, ie.idescala as idescala, ie.complementotextual as complementotextual')
            ->from('DatEvalindicadoresplanilla ip')
            ->leftJoin('ip.DatEvalindicadoresevaluar ie')
            ->where("ip.idplanilla = {$idplanilla} and ip.eshoja = 1")
            ->execute();
        return $result->toArray();
    }

    public function existeIndicadorPlanilla($idplanilla, $idindicador, $tipo)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('idindicadorplanilla')
            ->from('DatEvalindicadoresplanilla')
            ->where("idplanilla = {$idplanilla} and idindicador = {$idindicador} and tipo = {$tipo}")
            ->execute();
        return $result->toArray();
    }

    public static function existeIndicador($idindicador)
    {
        $query = Doctrine_Query::create();
        return $query->select('idindicadorplanilla')
            ->from('DatEvalindicadoresplanilla')
            ->where('idindicador = ?', $idindicador)
            ->fetchArray();
    }

}
