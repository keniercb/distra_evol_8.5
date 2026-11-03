<?php

  class NomCompetencia extends BaseNomCompetencia
  {
    public function setUp()
    {
      parent::setUp();
      $this->hasMany('DatCompetenciapersona', array('local' => 'idcompetencia', 'foreign' => 'idcompetencia'));
    }

    public function getById($idcompetencia)
    {
      return Doctrine::getTable('NomCompetencia')->findOneBy('idcompetencia',$idcompetencia);
    }

    public function getCompetenciasActivas()
    {
      $queryObj = Doctrine_Query::create()
        ->select('c.*')
        ->from('NomCompetencia c')
        ->where('c.fdesde <= now() and (now() <= c.fhasta or c.fhasta is null)');
      return $queryObj->fetchArray();
    }

    public function getCompetencias($filtro, $start, $limit)
    {
      $queryObj = Doctrine_Query::create()
        ->select('c.*')
        ->from('NomCompetencia c')
        ->limit($limit)
        ->offset($start);
      if ($filtro) {
        $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
      }
      $resultado = $queryObj->fetchArray();
      foreach ($resultado as $i => $result) {
        $escala                  = ZendExt_IoC_Inter::getInstance()->maestro->obtenerEscalasPorId($result['idescala']);
        $resultado[$i]['escala'] = $escala['denominacion'];
      }

      return $resultado;
    }

    public function cantCompetencias($filtro)
    {
      $queryObj = Doctrine_Query::create()
        ->select('c.idcompetencia')
        ->from('NomCompetencia c');
      if ($filtro) {
        $queryObj->addWhere("c.denominacion ILIKE '%$filtro%' OR c.descripcion ILIKE '%$filtro%'");
      }
      return count($queryObj->fetchArray());
    }

    public function existeDenom($denominacion)
    {
      $denominacion = strtoupper($denominacion);
      $queryObj     = Doctrine_Query::create()
        ->select('c.denominacion, c.idcompetencia')
        ->from('NomCompetencia c')
        ->where("UPPER(TRIM(c.denominacion)) = UPPER(TRIM('$denominacion'))");
      return $queryObj->fetchArray();
    }

    public function getEscalaEvaluativa()
    {

      $mg            = Doctrine_Manager::getInstance();
      $conn          = $mg->getCurrentConnection();
      $sqlEscalaEval = "Select e.denom as denominacion, e.idescala ,e.tipoescala 
                        from mod_evaluaciones.dat_evalescala e";

      $escala = $conn->fetchAll($sqlEscalaEval);
      return $escala;
    }
  }