<?php

class DatEntidadmodelo extends BaseDatEntidadmodelo {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasMany(
                'DatPlanificacion', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasMany(
                'DatAjusteexistenciaod', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasMany(
                'DatAjusteexistenciacb', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasMany(
                'DatAjusteplanificacion', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasMany(
                'DatControldivisadocumentomodelo', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasMany(
                'DatControldivisaindicadormodelo', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasMany(
                'DatDesviacionplan', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasMany(
                'DatContrataciondemanda', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
    }

    public function buscartm($id) {
        $query = new Doctrine_Query();
        $result = $query->select('d.idmodelo,m.idtipomodelo,t.idtabla')
                ->from('DatEntidadmodelo d,d.DatModelo m,m.NomTipomodelo t')
                ->where('d.identidadmodelo=?', $id)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function buscarentidadmodelodadoentidad($id) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT
 em.identidadmodelo
FROM
  mod_planificacion.dat_entidadmodelo em
WHERE
  em.identidad in ($id)";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        $entidades = $ent = implode(',', $result);

        return $entidades;
    }

    //LISTAR LOS IDENTIDADMODELO QUE PORTENESCAN AL MODELO PASODO POR PARAMETROS
    public function listarEntMod($idmodelo) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidadmodelo')
                ->from('DatEntidadmodelo d')
                ->where('d.idmodelo=?', $idmodelo)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

//LISTAR LOS IDENTIDADMODELO QUE PORTENESCAN AL MODELO y ENTIDAD PASADO POR PARAMETRO
    public function listarEntModEnt($idmodelo, $identidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT d.identidadmodelo
                FROM mod_planificacion.dat_entidadmodelo d
                WHERE  d.idmodelo=$idmodelo and d.identidad in($identidad)";
        $result = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function actualizarplanes($idEstructura, $idejercicio, $via, $plan, $naturaleza) {
        $cadenawhere = "";
        $conn = Doctrine_Manager::connection();
        if ($via) {
            $cadenawhere.=" and iv.idviaadquisicion=$via ";
        }if ($plan) {
            $cadenawhere.=" and m.idmodelo in($plan) ";
        }if ($naturaleza) {
            $cadenawhere.=" and n.idnaturaleza in($naturaleza) ";
        }
        $sql = "SELECT
  i.denominacion AS indicador,
   i.idindicador AS idindicador,
  n.denominacion AS naturaleza,
  m.denominacion AS plan,
  cd.denominacion AS controldivisa,
  iv.idviaadquisicion,
  n.idnaturaleza,
 m.idmodelo as identidadmodelo,
  cd.idcontroldivisa,cd.codigo
FROM
  mod_datosmaestros.nom_indicador i
  INNER JOIN mod_datosmaestros.nom_naturaleza n ON (i.idnaturaleza = n.idnaturaleza)
  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv ON (i.idindicador = iv.idindicador)
  INNER JOIN mod_planificacion.dat_planificacion p ON (i.idindicador = p.idindicador)
  INNER JOIN mod_planificacion.dat_entidadmodelo em ON (p.identidadmodelo = em.identidadmodelo)
  INNER JOIN mod_planificacion.dat_modelo m ON (em.idmodelo = m.idmodelo)
  LEFT OUTER JOIN mod_planificacion.dat_controldivisaindicadormodelo cdim ON (i.idindicador = cdim.idindicador)
  INNER JOIN mod_planificacion.nom_controldivisa cd ON (cdim.idcontroldivisa = cd.idcontroldivisa)
WHERE  p.idcentrobalance=$idEstructura and p.idejercicio=$idejercicio" . $cadenawhere;

        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function ObtenerPlanesCDAprob($parametros, $idcontroldivisa, $idEstructura, $idejercicio
    ) {
        $idcontroldivisa = ($idcontroldivisa) ?
                $idcontroldivisa = $idcontroldivisa : $idcontroldivisa = -1;
        $query = new Doctrine_Query();

        if ($parametros['indicadores']) {
            $consulta = implode(',', $parametros['indicadores']);
            $query->select(
                    'm.idmodelo, m.denominacion ,em.identidadmodelo as identidadmodelo,
                 ( case when ( dcd.idcontroldivisa = '
                    . $idcontroldivisa . ' and dcd.idindicador in (' . $consulta
                    . ') ) then 1 else 0 end ) as pintar  ,
                dcd.idcontroldivisa as idcontroldivisa, dcd.idindicador as indicador '
            );
        } else {
            $query->select(
                    'm.idmodelo, m.denominacion ,em.identidadmodelo as identidadmodelo,
                ( case when dcd.idcontroldivisa = '
                    . $idcontroldivisa
                    . ' then 1 else 0 end ) as pintar  ,
                dcd.idcontroldivisa as idcontroldivisa'
            );
        }

        $temp->data = $query->from('DatModelo m')
                ->innerjoin('m.DatEntidadmodelo em')
                ->leftjoin('em.DatControldivisaindicadormodelo dcd')
                ->addWhere('em.identidad=?', $idEstructura)
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                ->execute();
        $temp->total = $query->count();
        return $temp;
    }

    public function ObtenerPlanesCD($parametros, $idcontroldivisa, $idEstructura
    ) {
        $idcontroldivisa = ($idcontroldivisa) ?
                $idcontroldivisa = $idcontroldivisa : $idcontroldivisa = -1;
        $query = new Doctrine_Query();
        if (!empty($parametros)) {
            foreach ($parametros as $p => $s) {
                if ($s != '') {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                                "upper(m.denominacion) LIKE '" . strtoupper($s)
                                . "%'"
                        );
                    }
                }
            }
        }

        if ($parametros['rector']) {
            $querySub = new Doctrine_Query();
            if ($parametros['indicadores']) {
                $querySub->whereIn(
                        'dcd.idindicador', $parametros['indicadores']
                );
            }

            $consulta = '0,0,0';
            $cons = $querySub->select('m.idmodelo,em.identidadmodelo')
                    ->from('DatModelo m')
                    ->innerjoin('m.DatEntidadmodelo em')
                    ->innerjoin('em.DatControldivisaindicadormodelo dcd')
                    ->addWhere('dcd.idcontroldivisa=? ', array($idcontroldivisa))
                    ->offset($parametros['start'])
                    ->limit($parametros['limit'])
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            if (count($cons) > 0) {
                $consulta = array();
                foreach ($cons as $valor) {
                    $consulta[] = $valor['idmodelo'];
                }
                $consulta = implode(',', $consulta);
            }
            $temp->data = $query->select(
                            'm.idmodelo, m.denominacion ,em.identidadmodelo as identidadmodelo,
                ( case when m.idmodelo in ('
                            . $consulta
                            . ') then 1 else 0 end ) as pintar  ,
                dcd.idcontroldivisa as idcontroldivisa'
                    )
                    ->from('DatModelo m')
                    ->leftjoin('m.DatEntidadmodelo em')
                    ->leftjoin('em.DatControldivisaindicadormodelo dcd')
                    ->addWhere('em.identidad=? ', $idEstructura)
                    ->offset($parametros['start'])
                    ->limit($parametros['limit'])
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            $temp->total = $query->count();
        } else {

            if ($parametros['indicadores']) {

                $consulta = implode(',', $parametros['indicadores']);
                $query->select(
                        'm.idmodelo, m.denominacion ,em.identidadmodelo as identidadmodelo,
                     ( case when ( dcd.idcontroldivisa = '
                        . $idcontroldivisa . ' and dcd.idindicador in (' . $consulta
                        . ') ) then 1 else 0 end ) as pintar  ,
                     dcd.idcontroldivisa as idcontroldivisa,
                     dcd.idindicador as indicador '
                );
            } else {

                $query->select(
                        'm.idmodelo, m.denominacion ,
                    em.identidadmodelo as identidadmodelo,
                     ( case when dcd.idcontroldivisa = '
                        . $idcontroldivisa
                        . ' then 1 else 0 end ) as pintar  ,
                     dcd.idcontroldivisa as idcontroldivisa'
                );
            }
            $temp->data = $query->from('DatModelo m')
                    ->innerjoin('m.DatEntidadmodelo em')
                    ->leftjoin('em.DatControldivisaindicadormodelo dcd')
                    ->addWhere('em.identidad=? ', $idEstructura)
                    ->offset($parametros['start'])
                    ->limit($parametros['limit'])
                    ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
                    ->execute();
            $temp->total = $query->count();
        }
        return $temp;
    }

    public function enModelo($idmodelo) {
        $query = new Doctrine_Query();
        $result = $query->select('d.idmodelo')
                        ->from('DatEntidadmodelo d')
                        ->where('d.idmodelo=? ', $idmodelo)
                        ->execute()->count();
        return $result;
    }

    public function ListarEntIndic($idmodelo, $idindicador) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidad')
                ->ffrom('DatEntidadmodelo d, d.DatPlanificacion m')
                ->where(
                        'd.idmodelo=? AND m.idindicador=?', array($idmodelo, $idindicador)
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    //SELECCIONA LAS ENTIDADES A LAS QUE SE LE ASIGNO EL MODELO ESPESIFICADO
    public function getIdentidadmodelo($idmodelo, $identidad) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidadmodelo')
                ->from('DatEntidadmodelo d')
                ->where(
                        'd.idmodelo=? AND d.identidad=?', array($idmodelo, $identidad)
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function obtenerIdEtidadModlo($idmodelo, $identidad) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidadmodelo as identidadmodelo')
                ->from('DatEntidadmodelo d')
                ->addwhere('d.idmodelo=?', $idmodelo)
                ->whereIn('d.identidad', $identidad)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function todosIdentidadmodelo($identidad) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidadmodelo')
                ->from('DatEntidadmodelo d')
                ->where('d.identidad=?', $identidad)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getModeloAsocEntidad($identidad) {
        /* $query = new Doctrine_Query();
          $result = $query->select('mod.idmodelo,mod.denominacion')
          ->from('DatModelo mod')
          ->innerJoin('mod.DatEntidadmodelo em')
          ->innerJoin('em.DatAjusteexistenciaod daeod')
          ->innerJoin('daeod.DatAjusteexistencia dae')
          ->innerJoin('dae.DatAjusteexistenciacb daecb')
          ->where('em.identidad = ?  ', array($identidad))
          ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
          return $result; */

        $query = "SELECT DISTINCT(mod.idmodelo),mod.denominacion
                    FROM mod_planificacion.dat_modelo mod
                    INNER JOIN mod_planificacion.dat_entidadmodelo em ON (mod.idmodelo = em.idmodelo)
                    INNER JOIN mod_planificacion.dat_ajusteexistenciaod ajod ON (ajod.idmodelo = em.idmodelo)
                    INNER JOIN mod_planificacion.dat_ajusteexistenciacb ajcb ON (ajcb.idmodelo = em.idmodelo)
                    --INNER JOIN mod_planificacion.dat_ajusteexistencia aj ON (aj.identidad = em.identidad)
                    WHERE em.identidad = {$identidad}";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

//LISTA LOS PLANES ASICIADOS A LAS ENTIDADES ORDENADOS POR PREORIDAD. NO MODIFICAR, PK SE EMPLEA EN OTROS COMPONENTES
    public function getModeloAsocEntidadPrioridad($parametros) {
        $query = new Doctrine_Query();
        if ($parametros['chek'] == 1) {
            $uri = 'plandepresupuesto';
        } else {
            $uri = 'planmaterial';
        }
        $datosNomGastos = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        $uri
        );
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {

                if ($s != null) {
                    if ($p == 'denominacion') {
                        $query->addWhere(
                                "upper(mod.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'prioridad_condicion1' || $p == 'prioridad_condicion2' || $p == 'prioridad_condicion3'
                    ) {
                        $query->addWhere(
                                "em.prioridad " . $s['condicion'] . " ? ", $s['prioridad']
                        );
                    }
                }
            }
        }

        $model = $query->select(
                        'mod.idmodelo,mod.uriruta,mod.denominacion,em.identidadmodelo as identidadmodelo ,em.prioridad as prioridad'
                )
                ->from('DatModelo mod')
                ->innerJoin('mod.DatEntidadmodelo em')
                ->addWhere(
                        'em.identidad = ? AND mod.uriruta like ?', array($parametros['identidad'],
                    $datosNomGastos[0]['iddatosnomenclador'] . '-%')
                )
                ->orderby('em.prioridad')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $model;
    }

//LISTA LOS PLANES QUE SON DE TIPO PLAN MATERIAL Y TIENEN ELEMENTOS PLANIFICADOS
//ESTE METODO SE EMPLEA EN BALANCE MATERIAL Y EN DESGLOSE POR VIA DE ADQUISICION
    public function obtenerPlanesBalance($parametros) {

        //Listar dado ejercicio - se filtro en las 3 consultas
        $arrayIdejercicio[0]['idejercicio'] = $parametros['idejercicio'];

        $arrayEnti = array();

        array_push($parametros['hijosentidad'], $parametros['identidad']);
        $arrayEnti = $parametros['hijosentidad'];
        $query = new Doctrine_Query();
        $datosNomGastos = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        'planmaterial'
        );
        if ($parametros['check'] == 1) {
            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom(
                            $parametros['idcb']
            );
            $entidades = DatAjusteexistencia::indsXCB(
                            $entidaddatosnom[0]['identidaddatosnomenclador']
            );
            $query->addWhere('planif.cantidad >0');
            $model = $query->select(
                            'mod.idmodelo,mod.uriruta,mod.denominacion,
              em.identidadmodelo as identidadmodelo ,em.prioridad as prioridad'
                    )
                    ->from('DatModelo mod')
                    ->innerJoin('mod.DatEntidadmodelo em')
                    ->leftJoin('em.DatPlanificacion planif')
                    ->whereIn('em.identidad', $entidades)
                    /* ->addWhere(
                      'mod.uriruta like ? AND planif.idcentrobalance =? and planif.idejercicio = ?',
                      array($datosNomGastos[0]['iddatosnomenclador'] . '-%',$entidaddatosnom[0]['identidaddatosnomenclador'],
                      $arrayIdejercicio[0]['idejercicio'])

                      ) */
                    ->addWhere(
                            'planif.idcentrobalance =? and planif.idejercicio = ?', array($entidaddatosnom[0]['identidaddatosnomenclador'],
                        $arrayIdejercicio[0]['idejercicio'])
                    )
                    ->orderby('mod.denominacion')//;
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
        } else {
            $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom(
                            $parametros['idcb']
            );
            if ($parametros['cb'] == 1) {
                $query->addWhere(
                        'planif.idcentrobalance =?', $entidaddatosnom[0]['identidaddatosnomenclador']
                );
            }
            $query->addWhere('planif.cantidad > 0');
            $model = $query->select(
                            'mod.idmodelo,mod.uriruta,mod.denominacion,
              em.identidadmodelo as identidadmodelo ,em.prioridad as prioridad'
                    )
                    ->from('DatModelo mod')
                    ->innerJoin('mod.DatEntidadmodelo em')
                    ->leftJoin('em.DatPlanificacion planif')
                    ->whereIn('em.identidad', $arrayEnti)
                    /* ->addWhere(
                      'mod.uriruta like ? and planif.idejercicio = ?',
                      array($datosNomGastos[0]['iddatosnomenclador'] . '-%', $arrayIdejercicio[0]['idejercicio'])
                      ) */
                    ->addWhere(
                            'planif.idejercicio = ?', array($arrayIdejercicio[0]['idejercicio'])
                    )
                    ->orderby('mod.denominacion')//;
                    ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
        }
        //$var=$query->getSqlQuery();
        return $model;
    }

    //LISTA LOS PLANES QUE SON DE TIPO PLAN MATERIAL Y TIENEN ELEMENTOS PLANIFICADOS
//ESTE METODO SE EMPLEA EN RECUPERACIONES
    public function obtenerPlanesRecuperacion($parametros) {

        $arrayIdejercicio[0]['idejercicio'] = $parametros['idejercicio'];
        $arrayEntiODNorector = $parametros['hijosentidad'];
        $arrayEnti = array();
        foreach ($parametros['hijosentidad'] as $value) {
            $arrayEnti = array_merge($arrayEnti, $value);
        }


        if ($parametros['idcb'][0] != null) {
            $idcentrosb = explode(",", $parametros['idcb']);
            $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                            $idcentrosb
            );
            foreach ($entidaddatosnom as $p => $s) {
                $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
            }
            $entidaddatosnomcad = implode(',', $entidaddatosnom);
        } else {
            if ($parametros['esrector'] != 'true') {
                $idcentrosb[] = $parametros['identidadlog'];
            } else {
                $arrcb = DatEntidaddatosnomenclador::getCB();
                foreach ($arrcb as $p => $s) {
                    $idcentrosb[$p] = $s['identidad'];
                }
            }
            $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                            $idcentrosb
            );
            foreach ($entidaddatosnom as $p => $s) {
                $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
            }
            $entidaddatosnomcad = implode(',', $entidaddatosnom);
        }


        $query = new Doctrine_Query();
        $datosNomGastos = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        'planmaterial'
        );

        if ($parametros['check'] == 1) {
            if ($entidaddatosnom[0] != null) {
                $entidades = DatAjusteexistencia::idEntidadesXCB(
                                $entidaddatosnomcad
                );
            }

            if ($entidades[0] != null) {
                if ($entidaddatosnom[0] != null) {
                    $query->addWhere('planif.cantidad >0');
                    $model = $query->select(
                                    'mod.idmodelo,mod.uriruta,mod.denominacion,
                        em.identidadmodelo as identidadmodelo ,
                        em.prioridad as prioridad'
                            )
                            ->from('DatModelo mod')
                            ->innerJoin('mod.DatEntidadmodelo em')
                            ->leftJoin('em.DatPlanificacion planif')
                            ->whereIn('em.identidad', $entidades)
                            ->whereIn('planif.idcentrobalance', $entidaddatosnom)
                            ->addWhere(
                                    'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador']
                                . '-%',
                                $parametros['idejercicio'])
                            )
                            ->orderby('em.prioridad')
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                            ->execute();
                } else {
                    $query->addWhere('planif.cantidad >0');
                    $model = $query->select(
                                    'mod.idmodelo,mod.uriruta,mod.denominacion,
                        em.identidadmodelo as identidadmodelo ,
                        em.prioridad as prioridad'
                            )
                            ->from('DatModelo mod')
                            ->innerJoin('mod.DatEntidadmodelo em')
                            ->leftJoin('em.DatPlanificacion planif')
                            ->whereIn('em.identidad', $entidades)
                            ->addWhere(
                                    'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador']
                                . '-%',
                                $parametros['idejercicio'])
                            )
                            ->orderby('em.prioridad')
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                            ->execute();
                }
            } else {
                if ($entidaddatosnom[0] != null) {
                    $query->addWhere('planif.cantidad >0');
                    $model = $query->select(
                                    'mod.idmodelo,mod.uriruta,mod.denominacion,
                        em.identidadmodelo as identidadmodelo ,
                        em.prioridad as prioridad'
                            )
                            ->from('DatModelo mod')
                            ->innerJoin('mod.DatEntidadmodelo em')
                            ->leftJoin('em.DatPlanificacion planif')
                            ->whereIn('planif.idcentrobalance', $entidaddatosnom)
                            ->addWhere(
                                    'mod.uriruta like ?  and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador']
                                . '-%',
                                $parametros['idejercicio'])
                            )
                            ->orderby('em.prioridad')
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                            ->execute();
                } else {
                    $query->addWhere('planif.cantidad >0');
                    $model = $query->select(
                                    'mod.idmodelo,mod.uriruta,mod.denominacion,
                        em.identidadmodelo as identidadmodelo ,
                        em.prioridad as prioridad'
                            )
                            ->from('DatModelo mod')
                            ->innerJoin('mod.DatEntidadmodelo em')
                            ->leftJoin('em.DatPlanificacion planif')
                            ->addWhere(
                                    'mod.uriruta like ?  and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador']
                                . '-%',
                                $parametros['idejercicio'])
                            )
                            ->orderby('em.prioridad')
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                            ->execute();
                }
            }
        } else {

            if ($parametros['comportamiento'] != 2) {
                if ($parametros['esrector'] != 'true' && $parametros['selectent'] == 0
                ) {
                    $arrayEnti = $arrayEntiODNorector;
                }
                if ($arrayEnti[0] == null)
                    $arrayEnti = $parametros['hijosentidad'];
                $query->addWhere('planif.cantidad > 0');
                $model = $query->select(
                                'mod.idmodelo,mod.uriruta,mod.denominacion,
                    em.identidadmodelo as identidadmodelo ,
                    em.prioridad as prioridad'
                        )
                        ->from('DatModelo mod')
                        ->innerJoin('mod.DatEntidadmodelo em')
                        ->leftJoin('em.DatPlanificacion planif')
                        ->whereIn('em.identidad', $arrayEnti)
                        ->whereIn('planif.idcentrobalance', $entidaddatosnom)
                        ->addWhere(
                                'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador'] . '-%',
                            $arrayIdejercicio[0]['idejercicio'])
                        )
                        ->orderby('em.prioridad')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
            } else {
                if ($parametros['esrector'] != 'true' && $parametros['selectent'] == 0
                ) {
                    $arrayEnti = $arrayEntiODNorector;
                }
                if ($arrayEnti[0] == null)
                    $arrayEnti = $parametros['hijosentidad'];
                $query->addWhere('planif.cantidad > 0');
                $model = $query->select(
                                'mod.idmodelo,mod.uriruta,mod.denominacion,
                    em.identidadmodelo as identidadmodelo ,em.prioridad as prioridad'
                        )
                        ->from('DatModelo mod')
                        ->innerJoin('mod.DatEntidadmodelo em')
                        ->leftJoin('em.DatPlanificacion planif')
                        ->whereIn('em.identidad', $arrayEnti)
                        ->addWhere(
                                'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador'] . '-%',
                            $arrayIdejercicio[0]['idejercicio'])
                        )
                        ->orderby('em.prioridad')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
            }
        }

        return $model;
    }

    public function getTotalModeloAsocEntidadPrioridad($parametros) {

        $queryTotal = new Doctrine_Query();
        if ($parametros['chek'] == 1) {
            $uri = 'plandepresupuesto';
        } else {
            $uri = 'planmaterial';
        }
        $datosNomGastos = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        $uri
        );
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {

                if ($s != null) {
                    if ($p == 'denominacion') {
                        $queryTotal->addWhere(
                                "upper(mod.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'prioridad_condicion1' || $p == 'prioridad_condicion2' || $p == 'prioridad_condicion3'
                    ) {
                        $queryTotal->addWhere(
                                "em.prioridad " . $s['condicion'] . " ? ", $s['prioridad']
                        );
                    }
                }
            }
        }

        $total = $queryTotal->select('COUNT(mod.idmodelo)')
                ->from('DatModelo mod')
                ->innerJoin('mod.DatEntidadmodelo em')
                ->addWhere(
                        'em.identidad = ? AND mod.uriruta like ?', array($parametros['identidad'],
                    $datosNomGastos[0]['iddatosnomenclador'] . '-%')
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        $result = $total[0]['COUNT'];
        return $result;
    }

    public function getIdentidad($identidadmodelo) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidad')
                ->from('DatEntidadmodelo d')
                ->where('d.identidadmodelo=?', $identidadmodelo)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function existeModeloEnLaEntidad($idmodelo, $identidad) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidadmodelo')
                ->from('DatEntidadmodelo d')
                ->where(
                        "d.idmodelo =? AND d.identidad=?", array($idmodelo, $identidad)
                )
                ->execute();

        return ($result->toArray()) ? true : false;
    }

    public function ultimaPrioridad($identidad) {
        /* $query = new Doctrine_Query();
          $result = $query->select('MAX(d.prioridad)')
          ->from('DatEntidadmodelo d')
          ->where("d.identidad=?", $identidad)
          ->execute()->toArray();


          return $result; */

        $conn = Doctrine_Manager::connection();
        $sql = "SELECT MAX(d.prioridad) FROM mod_planificacion.dat_entidadmodelo d WHERE d.identidad = $identidad ";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function existeModeloEnLaEntidad1($idmodelo, $identidad) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidadmodelo')
                ->from('DatEntidadmodelo d')
                ->where(
                        "d.idmodelo =? AND d.identidad=?", array($idmodelo, $identidad)
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $result;
    }

    public function getOD($idmodelo) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidad,identidadmodelo')
                ->from('DatEntidadmodelo d')
                ->where('d.idmodelo=?', $idmodelo)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $result;
    }

    public function obtidentidadmodeloCB($identidaddatosnomenclador, $idmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('dem.identidadmodelo')
                ->from('DatEntidadmodelo dem,dem.DatEntidaddatosnomenclador dedn')
                ->where(
                        'dem.identidad = dedn.identidad AND dedn.identidaddatosnomenclador=? AND dem.idmodelo=?', array($identidaddatosnomenclador, $idmodelo)
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $res;
    }

    public function obtenerIdmodelo($identidadmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('dem.idmodelo')
                ->from('DatEntidadmodelo dem')
                ->where(' dem.identidadmodelo=?', $identidadmodelo)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $res;
    }

    public function getEntidades($idmodelo) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidad,identidadmodelo')
                ->from('DatEntidadmodelo d')
                ->where('d.idmodelo=?', $idmodelo)
                ->orderby('d.identidad')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $result;
    }

    public function prioridadMayorQue($identidad, $valor) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidad,d.identidadmodelo,d.prioridad')
                ->from('DatEntidadmodelo d')
                ->where('d.identidad=? AND d.prioridad >? ', array($identidad, $valor))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function prioridadMayorQueEnt($identidad, $idmodelo, $valor) {
        $query = new Doctrine_Query();
        $result = $query->select('d.identidad,d.identidadmodelo,d.prioridad')
                ->from('DatEntidadmodelo d')
                ->where(
                        'd.identidad=? AND d.idmodelo=? AND d.prioridad >? ', array($identidad, $idmodelo, $valor)
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $result;
    }

    public function updatePrioridad($identidad, $valor) {
        $query = new Doctrine_Query();

        $result = $query->update('DatEntidadmodelo em')
                ->set('em.prioridad ', '?', 1)
                ->where(
                        'em.identidad=? AND em.prioridad >? ', array($identidad, $valor)
                )
                ->execute();

        return $result;
    }

    //Utilizado como servicio
    //tipo: Este campo representa si el plan es de ingreso(1) o de gasto(0).
    public function servBP_getModeloAsocEntidad($identidad, $tipo = null) {
        $query = new Doctrine_Query();
        $query->select('mod.idmodelo,mod.denominacion')
                ->from('DatModelo mod')
                ->innerJoin('mod.DatEntidadmodelo em');
        if ($identidad) {
            $query->where('em.identidad = ?  ', array($identidad));
        }
        if ($tipo != null) {
            $query->where('mod.tipoplan = ?  ', array($tipo));
        }
        $query->orderBy("upper(mod.denominacion)");
        $query->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

    public function servBP_getModeloAsocEntidades($identidades, $idejercicio) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT m.idmodelo,
       m.denominacion
FROM mod_planificacion.dat_modelo m
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON em.idmodelo = m.idmodelo
     INNER JOIN mod_planificacion.dat_planificacion p ON em.identidadmodelo = p.identidadmodelo
      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = p.idindicador
WHERE em.identidad IN ($identidades) AND
      (p.idejercicio = $idejercicio AND
      (p.cantidad + p.ajuste) > 0 AND
      p.idaprobaciondemanda >= 4)AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function getEntidadesAsocModelo($identidades, $idmodelo) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT em.identidad
                FROM mod_planificacion.dat_entidadmodelo em
                WHERE em.identidad IN ($identidades) AND
                      em.idmodelo = $idmodelo";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        return $arrayResult;
    }

    public function servBP_getModeloAsocEntidadesN($identidades, $idejercicio) {
        $nivel = NomActividad::getNivel();
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT m.idmodelo, m.denominacion
FROM mod_planificacion.dat_modelo m
     INNER JOIN mod_planificacion.dat_actividadmodelo am
     ON (m.idmodelo = am.idmodelo)
     LEFT JOIN mod_datosmaestros.dat_indicadormodelo im
     ON (m.idmodelo = im.idmodelo)
     INNER JOIN mod_planificacion.nom_actividad a
     ON (am.idactividad = a.idactividad)
     INNER JOIN mod_planificacion.dat_actividadentidad ae
     ON (ae.idactividad =  a.idactividad)
     LEFT JOIN mod_planificacion.dat_actividadentidadmanual aem
     ON ae.idactividadentidad = aem.idactividadentidad
     LEFT JOIN mod_planificacion.dat_actividadentidadautomatico aea
     ON  ae.idactividadentidad = aea.idactividadentidad
     LEFT JOIN mod_planificacion.dat_actividadentidadproduccion aep
     ON  ae.idactividadentidad = aep.idactividadentidad
WHERE ae.identidad IN ($identidades) AND
      ae.idejercicio = $idejercicio AND
      (COALESCE(aem.nivelactividadmanual, 0) +
      COALESCE(aea.nivelactividadautomatico, 0) +
      COALESCE(aep.nivelactividadproduccion, 0)) > 0 AND
      a.nivel = {$nivel} AND
      a.idaprobacion = 4 AND
      a.estado = 1 AND
      (ae.idaprobacion = 5 OR
      ae.idaprobacion = 4)";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function getModelosTodos() {
        $query = new Doctrine_Query();
        $result = $query->select('mod.idmodelo,mod.denominacion')
                ->from('DatModelo mod')
                ->innerJoin('mod.DatEntidadmodelo em')
                ->orderby('mod.denominacion')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $result;
    }

    public function getModelEntidPrioridad($parametros) {
        $query = new Doctrine_Query();


        $result = $query->select(
                        'em.identidadmodelo as identidadmodelo ,em.prioridad as prioridad'
                )
                ->from('DatEntidadmodelo em')
                ->addWhere('em.identidad = ?', array($parametros['identidad']))
                ->orderby('em.prioridad')
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();


        return $result;
    }

    public function servDesgloseIndicadorPorFecha_getModeloAsocEntidad($identidad
    ) {
        $query = new Doctrine_Query();
        $result = $query->select(
                        'mod.idmodelo,mod.denominacion,em.identidadmodelo'
                )
                ->from('DatModelo mod')
                ->innerJoin('mod.DatEntidadmodelo em')
                ->where('em.identidad = ?  ', array($identidad))
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        foreach ($result as $key => $value) {
            $result[$key]['identidadmodelo'] = $value['DatEntidadmodelo'][0]['identidadmodelo'];
            unset($result[$key]['DatEntidadmodelo']);
        }
        return $result;
    }

    public function tieneIndPlanifEjer($arrayindmod, $idejercicio) {
        $query = new Doctrine_Query();

        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {

                $result = $query->select('DISTINCT em.identidadmodelo')
                        ->from('DatEntidadModelo em')
                        ->innerJoin('em.DatPlanificacion p')
                        ->innerJoin('p.NomIndicador ind')
                        ->innerJoin('ind.NomIndicadorplanif indp')
                        ->whereIn('em.identidadmodelo', $arrayindmod)
                        ->addWhere('p.idejercicio = ?', $idejercicio)
                        ->addWhere('indp.nivelplanif = ?', 1)
                        ->addWhere('ind.estado = ?', 1)
                        ->addWhere('indp.idaprobacion > ?', 2)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
                return $result;
            } else {
                $result = $query->select('DISTINCT em.identidadmodelo')
                        ->from('DatEntidadModelo em')
                        ->innerJoin('em.DatPlanificacion p')
                        ->innerJoin('p.NomIndicador ind')
                        ->innerJoin('ind.NomIndicadorplanif indp')
                        ->whereIn('em.identidadmodelo', $arrayindmod)
                        ->addWhere('p.idejercicio = ?', $idejercicio)
                        ->addWhere('indp.nivelplanif = ?', 1)
                        ->addWhere('indp.idaprobacion > ?', 2)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
                return $result;
            }
        }
    }

    //este método se emplea para listar el combo de los planes en el componente Control de la ejecución
    // de la planificación
    public function obtenerPlanesEntidadPlanif($parametros) {

        if ($parametros['idejercicio']) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros['idejercicio']) {
                $addwhere = 'AND i.estado= 1';
            }
        }

        $ent = implode(',', $parametros['hijosentidad']);
        $conn = Doctrine_Manager::connection();
        $comillas = "'";
        if ($parametros['uri'] != null && $parametros['uri'] != '')
            $var = "AND dn.uridatosnomenclador = $comillas{$parametros['uri']}$comillas";
        $sql = "SELECT DISTINCT mod.idmodelo, mod.denominacion
         FROM mod_planificacion.dat_planificacion planif
         INNER JOIN mod_planificacion.dat_entidadmodelo em ON planif.identidadmodelo =
      em.identidadmodelo
      INNER JOIN mod_planificacion.dat_modelo mod ON mod.idmodelo = em.idmodelo
       INNER JOIN mod_datosmaestros.nom_indicador i ON planif.idindicador = i.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = i.idindicador
     INNER JOIN mod_planificacion.dat_modelodatosnomenclador md ON md.idmodelo =
      mod.idmodelo
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON
      dn.iddatosnomenclador = md.iddatosnomenclador
         WHERE em.identidad IN($ent)
         AND planif.idejercicio ={$parametros['idejercicio']}
         $var
         AND planif.cantidad > 0
         AND ip.nivelplanif = 1
         AND ip.idaprobacion = 4
         AND (planif.idaprobaciondemanda = 4 OR planif.idaprobaciondemanda = 5)
         $addwhere";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function obtenerPlanesEntidadPlanifdemanda($parametros) {
        $conn = Doctrine_Manager::connection();
        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom($parametros['identidad']);
        $sql = "SELECT DISTINCT mod.idmodelo, mod.denominacion
         FROM mod_planificacion.dat_entidadmodelo em
         INNER JOIN mod_planificacion.dat_planificacion p ON  p.identidadmodelo = em.identidadmodelo
         INNER JOIN mod_planificacion.dat_modelo mod ON mod.idmodelo = em.idmodelo
         WHERE p.idcentrobalance = {$entidaddatosnom[0]['identidaddatosnomenclador']}";
        $arrayResult = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $arrayResult;
    }

    public function getModelosdadoEntidades($entidades, $uri, $idmodelos/* , $idcentros, $denclasificplan */) {
        if ($idmodelos) {
            $ADDWHERE = "AND em.idmodelo IN($idmodelos)";
        } else {
            $ADDWHERE = "";
        }
        $comilla = "'";
        if ($uri[1]) {
            $ADDWHEREUri = " AND (m.uriruta ilike   $comilla%$uri[0]%$comilla OR m.uriruta ilike   $comilla%$uri[1]%$comilla )";
        } else {
            $ADDWHEREUri = " AND (m.uriruta ilike   $comilla%$uri[0]%$comilla)";
        }
        /* $ADDWHERE1 = "";
          if ($idcentros) {
          $ADDWHERE1 = "AND entnm.identidad IN($idcentros)";
          } else {
          $ADDWHERE1 = "";
          }

          $ADDCLASIF = " ";
          $comilla = "'";
          if ($denclasificplan) {
          $ADDCLASIF = " AND m.uriruta like $comilla%$denclasificplan%$comilla ";
          } */
        $cadena = " SELECT DISTINCT (m.idmodelo), m.denominacion,
            CASE WHEN m.uriruta ILIKE '%gastos corriente%'
                    THEN 1
                    ELSE 0 END AS tipogasto

                    FROM mod_planificacion.dat_modelo m
                    INNER JOIN mod_planificacion.dat_entidadmodelo em on(m.idmodelo = em.idmodelo)
                    WHERE em.identidad in($entidades) $ADDWHERE  $ADDWHEREUri";
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);

        return $resultado;
    }

    public function getTotalCantidadAjustePorVia($entidades, $idvia, $idejercicio, $idmodelo) {
        $cadena = " SELECT SUM((COALESCE(planif.precio, 0) *(COALESCE(planif.cantidad, 0) +  COALESCE(planif.ajuste, 0)))
                    +(((COALESCE(planif.precio, 0) *(COALESCE(planif.cantidad, 0) + COALESCE(planif.ajuste, 0))) * COALESCE(indplanif.flete, 0)) /100)
                    +(((COALESCE(planif.precio, 0) *(COALESCE(planif.cantidad, 0) + COALESCE(planif.ajuste, 0))) * COALESCE(indplanif.contingencia, 0)) / 100)) as total
                    FROM mod_planificacion.dat_planificacion planif
                    INNER JOIN mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = planif.identidadmodelo)
                    INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion indvia on(indvia.idindicador = planif.idindicador)
                   INNER JOIN mod_datosmaestros.nom_indicador ind on(ind.idindicador = planif.idindicador)
                   INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif on(ind.idindicador = indplanif.idindicador)
                    WHERE em.identidad in($entidades) AND indvia.idviaadquisicion = $idvia AND planif.idejercicio = $idejercicio AND em.idmodelo IN($idmodelo)";
        if ($idmodelo) {
            $objconexion = Doctrine_Manager:: connection();
            $resultado = $objconexion->execute($cadena)->fetchAll();
        } else
            $resultado = array();
        return $resultado;
    }

    public function getCantidadAjustePorEntModelo($entidades, $idmodelo, $idvia, $idejercicio) {
        $cadena = " SELECT planif.cantidad, planif.ajuste,planif.precio,em.identidadmodelo,via.idviaadquisicion,via.denominacion,indplanif.flete,indplanif.contingencia
                    FROM mod_planificacion.dat_planificacion planif
                    INNER JOIN mod_planificacion.dat_entidadmodelo em on(em.identidadmodelo = planif.identidadmodelo)
                    INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion indvia on(indvia.idindicador = planif.idindicador)
                    INNER JOIN mod_datosmaestros.nom_viaadquisicion via on(via.idviaadquisicion = indvia.idviaadquisicion)
                    INNER JOIN mod_datosmaestros.nom_indicador ind on(ind.idindicador = planif.idindicador)
                   INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif on(ind.idindicador = indplanif.idindicador)
                    WHERE em.identidad in($entidades)AND em.idmodelo=$idmodelo  AND indvia.idviaadquisicion = $idvia AND planif.idejercicio =$idejercicio ";
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function getModeloPorEntModelo($identidadmodelo) {
        $cadena = "SELECT mod.denominacion FROM mod_planificacion.dat_modelo mod
INNER JOIN mod_planificacion.dat_entidadmodelo entmod ON(mod.idmodelo = entmod.idmodelo)
WHERE entmod.identidadmodelo = $identidadmodelo";
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function getModeloEntidad($identidad) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT mod.idmodelo, mod.denominacion
        FROM mod_planificacion.dat_modelo mod
        INNER JOIN mod_planificacion.dat_entidadmodelo entmod ON (mod.idmodelo = entmod.idmodelo)
        WHERE entmod.identidad = $identidad
        ORDER BY mod.denominacion";
        $result->data = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
