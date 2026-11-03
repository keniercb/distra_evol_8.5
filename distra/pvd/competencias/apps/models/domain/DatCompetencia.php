<?php

  /**
   * Descripción de la clase: Generada por Doctrine Generate
   *
   * @author    : Generada por Doctrine Generate
   * @copyright Copyright (c) 2013 xetid
   */
class DatCompetencia extends BaseDatCompetencia
{
    /**
     * Configuración de las relaciones existentes
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomClasificaciondecompetencia', array('local' => 'idclasifcompetencia', 'foreign' => 'idclasifcompetencia')
        );
        $this->hasMany('NomCompetencia', array('local' => 'idcompetencia', 'foreign' => 'idcompetencia'));
        $this->hasMany('DatCompetenciaOrg', array('local' => 'iddcompetencia', 'foreign' => 'iddcompetencia'));
        $this->hasMany('DatCompetenciaCargo', array('local' => 'iddcompetencia', 'foreign' => 'iddcompetencia'));
    }

    public function getCompetenciaByPersonaCargo($idcargo, $idpersona)
    {
        $queryObj = Doctrine_Query::create()
            ->select(
                'dc.*, dc.idvalorescala as idvalorrequerido, nc.idescala as idescala, nc.denominacion as denominacion,
                nc,descripcion as descripcion, dcp.idvalorescala as idvalorcertificado'
            )
            ->from('DatCompetencia dc')
            ->innerJoin('dc.DatCompetenciaCargo dcc')
            ->innerJoin('dc.NomCompetencia nc')
            ->leftJoin(
                "nc.DatCompetenciapersona dcp on dcp.idcompetencia = nc.idcompetencia AND dcp.idpersona = '$idpersona'"
            )
            ->orderBy('dc.orden ASC');
        if (!empty($idcargo)) {
          $queryObj->addWhere("dcc.idcargo = '$idcargo'");
        }
        return $queryObj->fetchArray();
    }

    public function getCompetenciasXEstructura($idestructura, $denominacion, $start, $limit)
    {
        $mg   = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if (!$idestructura) {
            $restriccion = "1=1";
            if ($denominacion != "") {
              $restriccion .= " and nc.denominacion ILIKE '%$denominacion%'";
            }
        } else {
            $parent = "Select parent_path from mod_estructuracomp.nom_filaestruc where idfila=$idestructura ";

            $parentp    = $conn->fetchAll($parent);
            $parent      = $parentp[0]['parent_path'];
            $restriccion = "f.parent_path operator (public.@>) '$parent'";
            if ($denominacion != "") {
              $restriccion .= " and nc.denominacion ILIKE '%$denominacion%'";
            }
        }

        $sqlCompetenciasEstructura = " Select  nc.denominacion, cc.idclasifcompetencia,cc.denominacion as clasificacion,
              e.iddcompetencia, e.idcompetencia , co.idestructura, e.fdesde, e.fhasta, nc.idescala, e.*
              from mod_competencia.dat_competencia e
              inner join  mod_competencia.dat_competenciaorg co on (co.iddcompetencia = e.iddcompetencia)
              inner join  mod_estructuracomp.nom_filaestruc f on (f.idfila = co.idestructura)
              inner join  mod_competencia.nom_competencia nc on (e.idcompetencia = nc.idcompetencia)
              inner join  mod_competencia.nom_clasifcompetencia cc on (e.idclasifcompetencia = cc.idclasifcompetencia )
              where $restriccion ORDER BY e.orden, co.idestructura limit $limit offset $start";


        $competencias = $conn->fetchAll($sqlCompetenciasEstructura);
        foreach ($competencias as $c => $comp) {
            $area = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($comp['idestructura']), false);
            $competencias[$c]['denomarea'] = $area[0]['rutaDenominacion'];
        }
        $result->datos    = $competencias;
        $result->cantidad = count($competencias);
        return $result;
    }

    public function getCompetenciasXProcesos($idestructura, $denominacion, $start, $limit)
    {
        $mg   = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($denominacion != "") {
            $restriccion = "  nc.denominacion ILIKE '%$denominacion%'";
        } else {
           $restriccion = "1=1";
        }

        if (is_numeric($idestructura)) {
            $parent = "Select parent_path from mod_estructuracomp.nom_filaestruc where idfila=$idestructura ";

            $parentp = $conn->fetchAll($parent);
            $parent   = $parentp[0]['parent_path'];
            $restriccion .= " and f.parent_path operator (public.<@) '$parent'";
        } else {
            $restriccion .= " and 1=1";
        }
        $sqlCompetenciasProcesos = "Select  nc.denominacion, pe.idestructura, cp.idcompetenciaproc,  e.iddcompetencia,
            e.idcompetencia,
            cp.idproceso, e.fdesde, e.fhasta, nc.idescala,  cp.idproceso, np.denominacion as denominacionproceso,
            cc.idclasifcompetencia, cc.denominacion as clasificacion, e.*        
            from mod_competencia.dat_competencia e
            inner join  mod_competencia.dat_competenciaproc cp on (cp.iddcompetencia = e.iddcompetencia)
            inner join  mod_competencia.nom_competencia nc on (e.idcompetencia = nc.idcompetencia)
            inner join  mod_orgtrabajo.nom_proceso np on (np.idproceso = cp.idproceso)
            inner join  mod_orgtrabajo.dat_procesoestructura pe on (pe.idproceso = np.idproceso)
            inner join  mod_estructuracomp.nom_filaestruc f on (f.idfila = pe.idestructura)
            inner join  mod_competencia.nom_clasifcompetencia cc on (e.idclasifcompetencia = cc.idclasifcompetencia)
            where $restriccion order by e.orden, cp.idproceso
            limit $limit offset $start";
           $competencias = $conn->fetchAll($sqlCompetenciasProcesos);
            foreach ($competencias as $c => $comp) {
                $area = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($comp['idestructura']), false);
                $competencias[$c]['denomarea'] = $area[0]['rutaDenominacion'];
            }
        $result->datos    = $competencias;
        $result->cantidad = count($competencias);
        return $result;
    }

    public function getCompetenciasXCargos($idestructura = false, $denominacion, $start, $limit)
    {
        $mg   = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($denominacion != "") {
          $restriccion .= "  nc.denominacion ILIKE '%$denominacion%'";
        } else {
          $restriccion = "1=1";
        }
        if (is_numeric($idestructura)) {
          $parent = "Select parent_path from mod_estructuracomp.nom_filaestruc where idfila=$idestructura ";

          $parentp = $conn->fetchAll($parent);
          $parent   = $parentp[0]['parent_path'];
          $restriccion .= " and f.parent_path operator (public.<@) '$parent'";
        } else {
          $restriccion .= " and 1=1";
        }
        $sqlCompetenciasCargos = "Select  nc.denominacion,  cca.idcompetenciacargo,  e.iddcompetencia, e.idcompetencia,
            e.fdesde, e.fhasta, nc.idescala,  cca.idcargo, cc.idclasifcompetencia, cc.denominacion as clasificacion, e.*
            from mod_competencia.dat_competencia e
            inner join  mod_competencia.dat_competenciacargo cca on (cca.iddcompetencia = e.iddcompetencia)
            inner join  mod_competencia.nom_competencia nc on (e.idcompetencia = nc.idcompetencia)
            inner join  mod_estructuracomp.nom_filaestruc f on (f.idfila = cca.idcargo)
            INNER join  mod_competencia.nom_clasifcompetencia cc on (e.idclasifcompetencia = cc.idclasifcompetencia)
            where $restriccion
            order by cca.idcargo, e.orden
            limit $limit offset $start";
        $competencias = $conn->fetchAll($sqlCompetenciasCargos);
        foreach ($competencias as $c => $comp) {
            $area = ZendExt_IoC::getInstance()->metadatos->getRutaEstructura(array($comp['idcargo']), false);
            $competencias[$c]['denomarea'] = $area[0]['rutaDenominacion'];
        }
        $result->datos    = $competencias;
        $result->cantidad = count($competencias);
        return $result;
    }

    public function getById($idcompetenciaestruc)
    {
      return Doctrine::getTable('DatCompetencia')->find($idcompetenciaestruc);
    }

    public function existeCompetencia()
    {

    }
}