<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
  class DatNivelCompetencia extends BaseDatNivelCompetencia
  {
      /**
       * Configuración de las relaciones existentes
       */
      public function setUp()
      {
          parent::setUp();
          $this->hasMany('DatCompetencia', array('local' => 'iddcompetencia', 'foreign' => 'iddcompetencia'));
          // $this->hasMany('DatEvalescala', array('local' => 'idescala', 'foreign' => 'idescala'));
      }

      public function mostrarNiveles($idescala, $iddcompetencia, $denominacion, $start = 0, $limit = 15)
      {
          $mg      = Doctrine_Manager::getInstance();
          $conn    = $mg->getCurrentConnection();
          $esc = "select ce.tipo
            from mod_rrhhmaestro.conf_escala ce where ce.idescala = '$idescala'";
          $resc = $conn->fetchAll($esc)[0];
          if ($resc['tipo'] == 1) {
              $niveles = "select  dnc.idnivelcompetencia, dnc.iddcompetencia, dnc.descripcion, nc.idescala, 
                dnc.idvalorescala, nvc.denominacion as valorescala, dec.peso
                from mod_competencia.dat_nivelcompetencia dnc
                inner join mod_competencia.dat_competencia c on (c.iddcompetencia = dnc.iddcompetencia)
                inner join mod_competencia.nom_competencia nc on (nc.idcompetencia = c.idcompetencia)
                inner join mod_rrhhmaestro.dat_escalacualitativa dec on (dec.idescala = nc.idescala and 
                  dec.idvalorcualitativo = dnc.idvalorescala)
                inner join mod_rrhhmaestro.nom_valorcualitativo nvc on (dec.idvalorcualitativo = nvc.idvalorcualitativo)
                where dnc.idescala = $idescala  and dnc.iddcompetencia = $iddcompetencia order by dec.peso ASC
                offset $start limit $limit";
          } else {
              $niveles = "select  dnc.idnivelcompetencia, dnc.iddcompetencia, dnc.descripcion, nc.idescala
                , den.valor as valorescala
                from mod_competencia.dat_nivelcompetencia dnc
                inner join mod_competencia.dat_competencia c on (c.iddcompetencia = dnc.iddcompetencia)
                inner join mod_competencia.nom_competencia nc on (nc.idcompetencia = c.idcompetencia)
                inner join mod_rrhhmaestro.dat_escalanumerica den on (den.idescala = nc.idescala 
                  and den.idescalanumerica = dnc.idvalorescala)
                where dnc.idescala = $idescala  and dnc.iddcompetencia = $iddcompetencia order by den.valor ASC
                offset $start limit $limit";
          }
          $resultado = $conn->fetchAll($niveles);
          return $resultado;
      }

      public function getById($idnivelcompetencia)
      {
          return Doctrine::getTable('DatNivelCompetencia')->find($idnivelcompetencia);
      }

  }