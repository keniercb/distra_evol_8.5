<?php

class DatPlanificacion extends BaseDatPlanificacion {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasOne(
                'NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
                'NomAprobacion', array('local' => 'idaprobaciondemanda', 'foreign' => 'idaprobacion')
        );
        $this->hasOne(
                'DatEntidadmodelo', array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasOne(
                'DatEntidaddatosnomenclador', array('local' => 'idcentrobalance',
            'foreign' => 'identidaddatosnomenclador')
        );
        $this->hasMany(
                'DatAjustedemanda', array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
        $this->hasMany(
                'DatControlejecucionplan', array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
        /* 	
          $this->hasMany(
          'DatDesviacionplanxsustitucion',
          array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
          ); */
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasMany(
                'DatPlanificacionnae', array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
        $this->hasMany(
                'DatAjusteplanificacion', array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
        $this->hasMany(
                'DatPlanificacionporfecha', array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
        $this->hasMany(
                'DatContrataciondemanda', array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
        $this->hasMany(
                'DatPlanificacioncuenta', array('local' => 'idplanificacion', 'foreign' => 'idplanificacion')
        );
    }

    public function obtenerDatPlanificacionNAE($idplanificacion) {
        $query = Doctrine_Query::create();
        $query->from('DatPlanificacion planif')->leftJoin(
                        'planif.DatPlanificacionnae planifnae'
                )->leftJoin('planifnae.DatPlanificacionnaegeneral naegeneral')
                ->leftJoin('naegeneral.DatPlanificacionnaeobjetogasto objgasto')
                ->leftJoin('naegeneral.DatPlanificacionnaeingreso ingrso')
                ->where('planif.idplanificacion = ?', $idplanificacion);
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function BuscarIndP($idindicador) {
        $query = new Doctrine_Query();

        $arr = $query->select('n.idindicador')
                        ->from('DatPlanificacion n')->where('n.idindicador= ?', $idindicador)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if ($arr[0]['idindicador'] != null) {
            return true;
        }
        return false;
    }

    public function BuscarIndicador($indicador) {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlanificacion')
                        ->where('idindicador=?', $indicador)->execute()->count();
        return $result;
    }

    public function verificarCB($identidaddatosnomenclador, $idplanificacion) {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlanificacion n')
                        ->where(
                                'n.idplanificacion=? AND n.idcentrobalance=?', array($idplanificacion, $identidaddatosnomenclador)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function importeTotal($identidadmodelo, $parametros) {
        $query = new Doctrine_Query();

        if ($parametros) {
            foreach ($parametros as $p => $f) {
                if ($p == 'precio_condicion1') {
                    $query->addWhere('pla.precio >?', $f['precio']);
                }
                if ($p == 'precio_condicion2') {
                    $query->addWhere('pla.precio <?', $f['precio']);
                }
                if ($p == 'precio_condicion3') {
                    $query->addWhere('pla.precio=?', $f['precio']);
                }

                if ($p == 'flete_condicion1') {
                    $query->addWhere(
                            '(((ind.precio*pla.cantidad)*ind.flete)/100)>?', $f['flete']
                    );
                }
                if ($p == 'flete_condicion2') {
                    $query->addWhere(
                            '(((ind.precio*pla.cantidad)*ind.flete)/100)<?', $f['flete']
                    );
                }
                if ($p == 'flete_condicion3') {
                    $query->addWhere(
                            '(((ind.precio*pla.cantidad)*ind.flete)/100)=?', $f['flete']
                    );
                }

                if ($p == 'contingencia_condicion1') {
                    $query->addWhere(
                            '(((ind.precio*pla.cantidad)*ind.contingencia)/100) >?', $f['contingencia']
                    );
                }
                if ($p == 'contingencia_condicion2') {
                    $query->addWhere(
                            '(((ind.precio*pla.cantidad)*ind.contingencia)/100) <?', $f['contingencia']
                    );
                }
                if ($p == 'contingencia_condicion3') {
                    $query->addWhere(
                            '(((ind.precio*pla.cantidad)*ind.contingencia)/100)=?', $f['contingencia']
                    );
                }

                if ($p == 'cantidad_condicion1') {
                    $query->addWhere('pla.cantidad >?', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion2') {
                    $query->addWhere('pla.cantidad <?', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion3') {
                    $query->addWhere('pla.cantidad=?', $f['cantidad']);
                }

                if ($p == 'importe_condicion1') {
                    $query->addWhere(
                            '(ind.precio*pla.cantidad) >?', $f['importe']
                    );
                }
                if ($p == 'importe_condicion2') {
                    $query->addWhere(
                            '(ind.precio*pla.cantidad) <?', $f['importe']
                    );
                }
                if ($p == 'importe_condicion3') {
                    $query->addWhere(
                            '(ind.precio*pla.cantidad)=?', $f['importe']
                    );
                }
                if ($p == 'generadobasesplan') {
                    if ($f == 1) {
                        $query->addWhere('pla.generadobasesplan=?', $f);
                    } elseif ($f == 0) {
                        $query->addWhere('pla.generadobasesplan=?', $f);
                    }
                }
                if ($p == 'idaprobaciondemanda') {
                    if ($f == 2) {
                        $query->addWhere('pla.idaprobaciondemanda=?', $f);
                    } elseif ($f == 1) {
                        $query->addWhere('pla.idaprobaciondemanda=?', $f);
                    } elseif ($f == 4) {
                        $query->addWhere('pla.idaprobaciondemanda=?', $f);
                    }
                }

                if ($p == 'codigo' || $p == 'numeropieza') {
                    $query->addWhere(
                            "upper(ind.$p) LIKE '%" . strtoupper($f) . "%'"
                    );
                }
                if ($p == 'denominacion') {
                    $query->addWhere(
                            "upper(ind.denominacion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'idumedida') {
                    $query->addWhere('ind.idumedida=?', $f);
                }
            }
        }


        $result = $query->select(
                                'sum((pla.precio*pla.cantidad) + ((pla.precio*pla.cantidad)*indp.flete)/100
            + ((pla.precio*pla.cantidad)*indp.contingencia)/100 ) as suma,
            sum((indp.precio*pla.cantidad)*(indp.flete/100)) as importeflete,
            sum((indp.precio*pla.cantidad)*(indp.contingencia/100)) as importecontingencia,
            sum((indp.preciodivisa*pla.cantidad)) as importedivisa '
                        )->from('DatPlanificacion pla')->innerjoin('pla.NomIndicador ind ')
                        ->innerjoin('ind.NomIndicadorplanif indp ')
                        ->addwhere('pla.identidadmodelo=? ', $identidadmodelo)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        $result[0]['suma'] = number_format($result[0]['suma'], '3', '.', ',');
        $result[0]['importeflete'] = number_format(
                $result[0]['importeflete'], '3', '.', ','
        );
        $result[0]['importecontingencia'] = number_format(
                $result[0]['importecontingencia'], '3', '.', ','
        );
        $result[0]['importedivisa'] = number_format(
                $result[0]['importedivisa'], '3', '.', ','
        );
        return $result[0];
    }

    public function importeDivisaTotal($identidadmodelo) {
        $query = new Doctrine_Query();
        $result = $query->select('sum(importedivisa) as suma')
                        ->from('DatPlanificacion')->where('identidadmodelo=?', $identidadmodelo)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        $result[0]['suma'] = number_format($result[0]['suma'], '3', '.', ',');
        return $result[0]['suma'];
    }

    public function demandaTotalIndicador($identidadmodelo, $idejercicio, $idindicador
    ) {
        $query = new Doctrine_Query();
        $result = $query->select('sum(cantidad) as suma')
                        ->from('DatPlanificacion')
                        ->where(
                                'identidadmodelo=? AND idejercicio=? AND idindicador=?', array($identidadmodelo, $idejercicio, $idindicador)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function Buscar($idPlanificacion) {
        $temp = $this->conn->getTable('DatPlanificacion')->find($idPlanificacion);
        return $temp->toArray();
    }

    public function GetTodos() {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlanificacion')->execute();
        return $result->toArray();
    }

    public function GetPorLimite($limite = 0, $inicio = 20) {
        $query = new Doctrine_Query();
        $result = $query->from('DatPlanificacion')->limit($limite = 0)->offset(
                        $inicio = 20
                )->execute();
        return $result->toArray();
    }

    public function idIndicadoresDeUnModelo($identidadmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select('m.idindicador')
                        ->from('DatPlanificacion m')->where('m.identidadmodelo =?', $identidadmodelo)
                        ->execute()->toArray();
        return $res;
    }

    public function ctdadIndicadoresDeUnModelo($identidadmodelo, $parametros) {
        $query = new Doctrine_Query();
        if ($parametros) {
            foreach ($parametros as $p => $f) {
                if ($p == 'precio_condicion1') {
                    $query->addWhere('pla.precio >?', $f['precio']);
                }
                if ($p == 'precio_condicion2') {
                    $query->addWhere('pla.precio <?', $f['precio']);
                }
                if ($p == 'precio_condicion3') {
                    $query->addWhere('pla.precio=?', $f['precio']);
                }

                if ($p == 'flete_condicion1') {
                    $query->addWhere(
                            '((pla.importe*ind.flete)/100)>?', $f['flete']
                    );
                }
                if ($p == 'flete_condicion2') {
                    $query->addWhere(
                            '((pla.importe*ind.flete)/100)<?', $f['flete']
                    );
                }
                if ($p == 'flete_condicion3') {
                    $query->addWhere(
                            '((pla.importe*ind.flete)/100)=?', $f['flete']
                    );
                }

                if ($p == 'contingencia_condicion1') {
                    $query->addWhere(
                            '((pla.importe*ind.contingencia)/100) >?', $f['contingencia']
                    );
                }
                if ($p == 'contingencia_condicion2') {
                    $query->addWhere(
                            '((pla.importe*ind.contingencia)/100) <?', $f['contingencia']
                    );
                }
                if ($p == 'contingencia_condicion3') {
                    $query->addWhere(
                            '((pla.importe*ind.contingencia)/100)=?', $f['contingencia']
                    );
                }

                if ($p == 'cantidad_condicion1') {
                    $query->addWhere('pla.cantidad >?', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion2') {
                    $query->addWhere('pla.cantidad <?', $f['cantidad']);
                }
                if ($p == 'cantidad_condicion3') {
                    $query->addWhere('pla.cantidad=?', $f['cantidad']);
                }

                if ($p == 'importe_condicion1') {
                    $query->addWhere('pla.importe >?', $f['importe']);
                }
                if ($p == 'importe_condicion2') {
                    $query->addWhere('pla.importe <?', $f['importe']);
                }
                if ($p == 'importe_condicion3') {
                    $query->addWhere('pla.importe=?', $f['importe']);
                }
                if ($p == 'generadobasesplan') {
                    if ($f == 1) {
                        $query->addWhere('pla.generadobasesplan=?', $f);
                    } elseif ($f == 0) {
                        $query->addWhere('pla.generadobasesplan=?', $f);
                    }
                }
                if ($p == 'idaprobaciondemanda') {
                    if ($f == 2) {
                        $query->addWhere('pla.idaprobaciondemanda=?', $f);
                    } elseif ($f == 1) {
                        $query->addWhere('pla.idaprobaciondemanda=?', $f);
                    } elseif ($f == 4) {
                        $query->addWhere('pla.idaprobaciondemanda=?', $f);
                    }
                }

                if ($p == 'codigo' || $p == 'numeropieza') {
                    $query->addWhere(
                            "upper(ind.$p) LIKE '%" . strtoupper($f) . "%'"
                    );
                }
                if ($p == 'denominacion') {
                    $query->addWhere(
                            "upper(ind.denominacion) LIKE '%" . strtoupper($f)
                            . "%'"
                    );
                }
                if ($p == 'idumedida') {
                    $query->addWhere('ind.idumedida=?', $f);
                }
            }
        }
        $res = $query->select('COUNT(*) as cantidadtotal')
                        ->from('DatPlanificacion pla')->innerjoin('pla.NomIndicador ind ')
                        ->addwhere('pla.identidadmodelo =?', $identidadmodelo)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function ObtenerIdPlanificacion($identidadmodelo) {
        $query = new Doctrine_Query();
        $result = $query->select('m.idplanificacion')
                        ->from('DatPlanificacion m')->where('m.identidadmodelo =?', $identidadmodelo)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function getIndEntidad($identidadmodelo, $idcb, $start, $limit) {
        $query = new Doctrine_Query();
        $res = $query->select(
                                'm.idplanificacion, m.cantidad,m.idindicador,m.precio,m.importe,
            m.idaprobaciondemanda,f.demanda,f.necesidad,f.coberturaparcialestimada,
            f.ajustepornivelactividad, f.ajustepornivelactividadneg,
            f.reservaministerial,f.cantidadeconomia,f.idajustedemanda'
                        )
                        ->from(
                                'DatPlanificacion m, m.DatEntidaddatosnomenclador d, m.DatAjustedemanda f'
                        )
                        ->where(
                                'm.identidadmodelo =? AND d.identidad=?', array($identidadmodelo, $idcb)
                        )->offset($start)->limit($limit)->orderby('m.idindicador')
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function TotalIndEntidad($identidadmodelo, $idcb) {
        $query = new Doctrine_Query();
        $res = $query->select(
                                'm.idplanificacion, m.cantidad,m.idindicador,
            m.precio,m.importe,f.demanda,f.necesidad,
            f.coberturaparcialestimada, f.ajustepornivelactividad,
            f.ajustepornivelactividadneg,f.reservaministerial,
            f.cantidadeconomia,f.idajustedemanda'
                        )
                        ->from(
                                'DatPlanificacion m, m.DatEntidaddatosnomenclador d, m.DatAjustedemanda f'
                        )
                        ->where(
                                'm.identidadmodelo =? AND d.identidad=? ', array($identidadmodelo, $idcb)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    //LISTAR LOS INDICADORES QUE PERTENECEN AL EJERCICIO ACTUAL, ES DECIR LOS INDICADORES QUE PERTENECEN AL
    //ANNO EN CURSO
    public function indEntEjercActual($identidadmodelo, $idindicador) {
        $query = new Doctrine_Query();
        $res = $query->from('DatPlanificacion m, m.NomEjercicioplanificacion e')
                        ->where(
                                'm.identidadmodelo =? AND m.idindicador=?  AND e.actual=?', array($identidadmodelo, $idindicador, 1)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function CantidadPorIndicador($idindicador) {
        $query = new Doctrine_Query();
        $res = $query->select('dp.idplanificacion, dp.idindicador, dp.cantidad')
                        ->from('DatPlanificacion dp')
                        ->where('dp.idindicador =? ', $idindicador)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function IndEntModEjer($identidadmodelo) {
        $query = new Doctrine_Query();
        $res = $query->from(
                                'DatPlanificacion d, d.NomEjercicioplanificacion ne'
                        )
                        ->where(
                                'd.identidadmodelo =? AND d.idaprobaciondemanda>? AND ne.actual=?', array($identidadmodelo, 1, 1)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function DameIndPlanDadoAjuste($idindicador, $identidadmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select(
                                'dp.idindicador, dp.idaprobaciondemanda,dp.idplanificacion'
                        )
                        ->from('DatPlanificacion dp')
                        ->where(
                                'dp.idindicador =? AND dp.idaprobaciondemanda >? AND dp.identidadmodelo=?', array($idindicador, 1, $identidadmodelo)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function indicadoresModelo($idplanificacion) {
        $query = new Doctrine_Query();
        $res = $query->select('dp.idindicador, dp.identidadmodelo')
                        ->from('DatPlanificacion dp,dp.NomEjercicioplanificacion ej')
                        ->where(
                                'dp.idplanificacion =? AND ej.actual=?', array($idplanificacion, 1)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function SeRepiten($idindicador, $identidadmodelo) {
        $query = new Doctrine_Query();
        $res = $query->select(
                                'dp.idindicador, dp.identidadmodelo,dp.cantidad,dp.idcentrobalance'
                        )
                        ->from('DatPlanificacion dp,dp.NomEjercicioplanificacion ej')
                        ->where(
                                'dp.idindicador =? AND ej.actual=? AND dp.identidadmodelo=?', array($idindicador, 1, $identidadmodelo)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function AquienDemando($identidadmodelo, $idcentrobalance) {
        $query = new Doctrine_Query();
        $res = $query->select('dp.idindicador')
                        ->from('DatPlanificacion dp')
                        ->where(
                                'dp.idcentrobalance =? AND dp.identidadmodelo=?', array($idcentrobalance, $identidadmodelo)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();


        return $res;
    }

    public function select() {
        $consulta = "SELECT
                    DISTINCT dp.idindicador,ind.codigo,ind.denominacion,
                    ind.numeropieza,dae.idajusteexistencia,
                    dae.cantidadeninventario as inventario,
                    dae.cantidadcontratado as contratado,
                    dae.mercanciaentransito as pendarribo,
                    dae.necesidadannoactual as necesidad,
                    dae.coberturatotalestimada as CTE,daecb.cantidadreservaministro as RM,
                    daecb.cantidadeconomia as economia,daecb.idajusteexistencia as idajustecb";
        return $consulta;
    }

    public function AquienDemando1($identOD, $start, $limit) {
        $conn = Doctrine_Manager::connection();
        $select = self::select();
        $query = "$select FROM mod_planificacion.dat_planificacion dp
                               INNER JOIN mod_datosmaestros.nom_indicador ind
                               ON(dp.idindicador = ind.idindicador)
                               INNER JOIN mod_planificacion.dat_ajusteexistencia dae
                               On(ind.idindicador = dae.idindicador)
                               LEFT JOIN mod_planificacion.dat_ajusteexistenciacentrobalance daecb
                               ON(dae.idajusteexistencia = daecb.idajusteexistencia)
                               INNER JOIN mod_planificacion.dat_entidadmodelo dem
                               ON(dem.identidadmodelo = dp.identidadmodelo)
                               WHERE dem.identidad = ? 
                               OFFSET ?
                               LIMIT ?";
        $res = $conn->execute($query, array($identOD, $start, $limit));
        $result = $res->fetchAll();

        return $result;
    }

    public function existeIndicadorEnModeloEjer($idejercicio, $idindicador) {
        $query = new Doctrine_Query();
        $result = $query->select('n.idindicador')
                        ->from('DatPlanificacion n')
                        ->where(
                                'idejercicio=? AND idindicador=?', array($idejercicio, $idindicador)
                        )->execute();
        return ($result->toArray()) ? true : false;
    }

    public function AquienDemando2($identCB, $start, $limit) {
        $query = new Doctrine_Query();
        $res = $query->select(
                                'DISTINCT (dae.idindicador) as idindicador,dae.identidad,
                        ind.codigo,ind.denominacion,ind.numeropieza
                        ,dae.idajusteexistencia, dae.cantidadeninventario as inventario,
                        dae.cantidadcontratado as contratado,
                        dae.mercanciaentransito as pendarribo,
                        dae.necesidadannoactual as necesidad,
                        dae.coberturatotalestimada as CTE,
                        dae.idajusteexistencia as idajustecb'
                        )->from('DatAjusteexistencia dae, dae.NomIndicador ind')
                        ->where('dae.identidad =?', $identCB)->offset($start)
                        ->limit($limit)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function AquienDemando3($identCB) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT COUNT(DISTINCT dae.idindicador)
                       FROM mod_planificacion.dat_ajusteexistencia dae
                       LEFT JOIN mod_planificacion.dat_indicadorcentrobalance daecb
                       ON(dae.idindicador = daecb.idindicador)
                       INNER JOIN mod_datosmaestros.nom_indicador ind
                       ON(daecb.idindicador = ind.idindicador)
                       WHERE dae.identidad =? ";
        $res = $conn->execute($query, array($identCB));
        $result = $res->fetchAll();
        return $result;
    }

    public function aprobadoRector($idplanificacion) {
        $query = new Doctrine_Query();
        $result = $query->select('n.idplanificacion')
                        ->from('DatPlanificacion n')
                        ->where(
                                'n.idplanificacion=? AND n.idaprobaciondemanda=4', $idplanificacion
                        )->execute();
        return ($result->toArray()) ? true : false;
    }

    //devuelve true 1 si el id planificacion tiene necesidad mayor que cero, y false 0 si tiene necesidad en cero o nula
    public function chequearNecesidad($idplanificacion) {
        $query = new Doctrine_Query();
        $result = $query->select('n.idindicador')
                ->from('DatPlanificacion n')
                ->where('n.cantidad>0 AND n.idplanificacion=?', $idplanificacion)
                ->execute();
        return ($result->toArray()) ? true : false;
    }

    public function demandaAprobacion($idplanificacion) {
        $query = new Doctrine_Query();
        $result = $query->select('n.idplanificacion')
                        ->from('DatPlanificacion n')
                        ->where(
                                'idaprobaciondemanda>=2 AND n.idplanificacion=?', $idplanificacion
                        )->execute();
        return ($result->toArray()) ? true : false;
    }

    public function esUnicoPalCB($idindicador, $idcentrobalance) {

        $query = new Doctrine_Query();
        $res = $query
                        ->from('DatPlanificacion dp,dp.NomEjercicioplanificacion ej')
                        ->where(
                                'dp.idindicador =? AND ej.actual=? AND dp.idcentrobalance=?', array($idindicador, 1, $idcentrobalance)
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function validardadoIdIndicador($idindicador) {
        $query = new Doctrine_Query();
        $res = $query->select(
                        'dp.idplanificacion, dem.identidadmodelo, dm.idmodelo, dm.denominacion'
                )
                ->from('DatPlanificacion dp')->innerJoin('dp.DatEntidadmodelo dem')
                ->innerJoin('dem.DatModelo dm')->where('dp.idindicador =?', $idindicador)
                ->offset(0)->limit(1)->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        $resAux = $query->select(
                                'dn.idnorma, da.idactividad, da.codigo, da.denominacion'
                        )->from('DatNorma dn')->innerJoin('dn.NomActividad da')
                        ->where('dn.idindicador =?', $idindicador)->offset(0)
                        ->limit(1)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        if ($res[0] != null || $resAux[0] != null) {
            echo("{'codMsg':21 }");
        } else {
            echo("{'codMsg':22 }");
        }
    }

    public function listarActividades($params) {
        $query = new Doctrine_Query();
        $querytotal = new Doctrine_Query();
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {

                if ($datos['field'] == 'codigo') {
                    $query->addWhere(
                            "upper(da.codigo) LIKE '%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%'"
                    );
                    $querytotal->addWhere(
                            "upper(da.codigo) LIKE  '%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%'"
                    );
                }
                if ($datos['field'] == 'denominacion') {
                    $query->addWhere(
                            "upper(da.denominacion) LIKE '%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%'"
                    );
                    $querytotal->addWhere(
                            "upper(da.denominacion) LIKE '%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%'"
                    );
                }
            }
        }
        $data->data = $query->select(
                                'dn.idnorma, da.idactividad, da.codigo, da.denominacion'
                        )
                        ->from('DatNorma dn')
                        ->innerJoin('dn.NomActividad da')
                        ->addWhere(
                                'dn.idindicador =? AND dn.idejercicio =?', array($params['idindicador'], $params['idejercicio'])
                        )->offset($params['start'])->limit($params['limit'])
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $data->total = $querytotal->select('COUNT(*) as total')
                        ->from('DatNorma dn')->innerJoin('dn.NomActividad da')
                        ->addWhere(
                                'dn.idindicador =? AND dn.idejercicio =?', array($params['idindicador'], $params['idejercicio'])
                        )->offset($params['start'])->limit($params['limit'])
                        ->execute()->getFirst()->total;
        return $data;
    }

    public function listarPlanes($params) {
        $query = new Doctrine_Query();
        $querytotal = new Doctrine_Query();
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $query->addWhere(
                            "upper(dm.denominacion) LIKE '%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%'"
                    );
                    $querytotal->addWhere(
                            "upper(dm.denominacion) LIKE '%" . strtoupper(
                                    $datos['data']['value']
                            ) . "%'"
                    );
                }
            }
        }


        $data->data = $query->select(
                                'dp.idplanificacion, dem.identidadmodelo, dm.idmodelo, dm.denominacion'
                        )->from('DatPlanificacion dp')->innerJoin('dp.DatEntidadmodelo dem')
                        ->innerJoin('dem.DatModelo dm')
                        ->addWhere(
                                'dp.idindicador =? AND dp.idejercicio =?', array($params['idindicador'], $params['idejercicio'])
                        )->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $data->total = $querytotal->select('COUNT(*) as total')
                        ->from('DatPlanificacion dp')
                        ->innerJoin('dp.DatEntidadmodelo dem')->innerJoin('dem.DatModelo dm')
                        ->addWhere(
                                'dp.idindicador =? AND dp.idejercicio =?', array($params['idindicador'], $params['idejercicio'])
                        )->offset($params['start'])->limit($params['limit'])
                        ->execute()->getFirst()->total;
        return $data;
    }

    public function selectCuatro() {
        $consulta = "pla.idindicador,pla.idplanificacion,pla.idaprobaciondemanda,
                     SUM(pla.cantidad) as cantidad,pla.generadobasesplan,
                                edn.identidad,sum(pla.importe) as importe,
                                sum(pla.importedivisa) as importedivisa,
                                ind.codigo,ind.denominacion,dpnae.idplanificacionnae,
                                ind.idpais,ind.idformato,ind.estado,ind.nivel,
                                ind.descripcion,ind.idnaturaleza,indpl.precio,
                                indpl.preciodivisa,ind.idumedida,dpg.idplanificacionnaegeneral,
                                dpnog.idobjetogasto,dpni.idingreso,
                                (COALESCE(nomnae.codigo,'')  ||  COALESCE('-','-') ||
                                COALESCE(nomnae.denominacion,'') || COALESCE('-','-') ||
                                COALESCE(nomog.codigo,'') || COALESCE(nomrf.codigo,'-') ||
                                COALESCE(nomog.denominacion,'-') ||
                                COALESCE(nomrf.denominacion,'')) as datos,
                                ind.numeropieza,
                                ((sum(pla.importe)*indpl.flete)/100) as flete,
                                ((sum(pla.importe)*indpl.contingencia)/100) as contingencia,

                                sum(pla.importedivisa) as importemlc,
                                nomva.denominacion as viaadquisicion,
                                nomos.denominacion as organosatisface";
        return $consulta;
    }

    public function groupBy($cadena) {

        $consulta = "pla.idindicador,pla.idplanificacion {$cadena} pla.idaprobaciondemanda,
                pla.generadobasesplan,edn.identidad,ind.codigo,ind.denominacion,ind.idpais,
                ind.idformato,ind.estado,dpnae.idplanificacionnae,
				dpg.idplanificacionnaegeneral,dpnog.idobjetogasto,
				dpni.idingreso,nomnae.codigo,nomnae.denominacion,
				nomog.codigo,nomrf.codigo,nomog.denominacion,nomrf.denominacion,
                ind.nivel,ind.descripcion,ind.idnaturaleza,
                indpl.precio,indpl.preciodivisa,ind.idumedida,ind.numeropieza,
                indpl.flete, indpl.contingencia,nomva.denominacion,nomos.denominacion";
        return $consulta;
    }

    public function selectCinco() {
        $consulta = "pla.idplanificacion,pla.idaprobaciondemanda,pla.cantidad,
                     pla.generadobasesplan,edn.identidad,
                                pla.importe,pla.importedivisa,pla.idindicador,
                                dpnae.idplanificacionnae,ind.codigo,ind.denominacion,
                                ind.idpais,ind.idformato,ind.estado,ind.nivel,ind.descripcion,
                                ind.idnaturaleza,indpl.precio,indpl.preciodivisa,
                                ind.idumedida,ind.numeropieza,dpg.idplanificacionnaegeneral,
                                dpnog.idobjetogasto,dpni.idingreso,
                                (COALESCE(nomnae.codigo,'')  ||  COALESCE('-','-') ||
                                COALESCE(nomnae.denominacion,'') || COALESCE('-','-') ||
                                COALESCE(nomog.codigo,'') || COALESCE(nomrf.codigo,'-') ||
                                COALESCE(nomog.denominacion,'-') ||
                                COALESCE(nomrf.denominacion,'')) as datos,
                                ((pla.importe*indpl.flete)/100) as flete,
                                ((pla.importe*indpl.contingencia)/100) as contingencia,
                                (contingencia + flete) as importet,
                                pla.importedivisa as importemlc ,
                                nomva.denominacion as viaadquisicion,
                                nomos.denominacion as organosatisface";
        return $consulta;
    }

    public function obtenerAsociadosNAE($parametros) {
        $arraySqlparams = array();
        $arraySqlparams[] = $parametros['identidadmodelo'];
        $arraySqlparams[] = $parametros['idejercicio'];
        $pru = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicioactual = $pru[0]['idejercicio'];
        if ($parametros['idejercicio'] == $idejercicioactual) {
            $parametros['x']->where('ind.estado', 1);
        }

        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $key => $datos) {
                if ($datos->field == 'codigo') {
                    $parametros['x']->where(
                            "ind.codigo  LIKE '%" . $datos->data->value . "%'"
                    );
                } elseif ($datos->field == 'denominacion') {
                    $parametros['x']->where(
                            "upper(ind.denominacion) LIKE '%" . strtoupper(
                                    $datos->data->value
                            ) . "%'"
                    );
                } elseif ($datos->field == 'denoum') {
                    $parametros['x']->where(
                            "ind.idumedida", $datos->data->value
                    );
                } elseif ($datos->field == 'denocentrobalance') {
                    $parametros['x']->where(
                            "edn.identidad", $datos->data->value
                    );
                } elseif ($datos->field == 'importe') {

                    if ($datos->data->comparison == "gt") {
                        $parametros['x']->where(
                                "pla.importe > ", $datos->data->value
                        );
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros['x']->where(
                                "pla.importe < ", $datos->data->value
                        );
                    } else {
                        $parametros['x']->where(
                                "pla.importe", $datos->data->value
                        );
                    }
                } elseif ($datos->field == 'cantidad') {
                    if ($datos->data->comparison == "gt") {
                        $parametros['x']->where(
                                "pla.cantidad > ", $datos->data->value
                        );
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros['x']->where(
                                "pla.cantidad < ", $datos->data->value
                        );
                    } else {
                        $parametros['x']->where(
                                "pla.cantidad", $datos->data->value
                        );
                    }
                } elseif ($datos->field == 'precio') {
                    if ($datos->data->comparison == "gt") {
                        $parametros['x']->where(
                                "ind.precio > ", $datos->data->value
                        );
                    } elseif ($datos->data->comparison == "lt") {
                        $parametros['x']->where(
                                "ind.precio < ", $datos->data->value
                        );
                    } else {
                        $parametros['x']->where(
                                "ind.precio", $datos->data->value
                        );
                    }
                } elseif ($datos->field == 'idplanificacionnae') {
                    if ($datos->data->value[0] == "Si") {
                        $parametros['x']->where(
                                "dpnae.idplanificacionnae IS NOT NULL"
                        );
                    } else {
                        $parametros['x']->where(
                                "dpnae.idplanificacionnae IS NULL"
                        );
                    }
                } elseif ($datos->field == 'idobjetogasto') {
                    if ($datos->data->value[0] == "Si") {
                        $parametros['x']->where(
                                "dpnog.idplanificacionnaegeneral IS NOT NULL"
                        );
                    } else {
                        $parametros['x']->where(
                                "dpnog.idplanificacionnaegeneral IS NULL"
                        );
                    }
                } elseif ($datos->field == 'idingreso') {
                    if ($datos->data->value[0] == "Si") {
                        $parametros['x']->where(
                                "dpni.idplanificacionnaegeneral IS NOT NULL"
                        );
                    } else {
                        $parametros['x']->where(
                                "dpni.idplanificacionnaegeneral IS NULL"
                        );
                    }
                } elseif ($datos->field == 'datos') {
                    $parametros['x']->where(
                            "( COALESCE(nomog.codigo,'') || COALESCE(nomog.codigo,'-') ||
                                            COALESCE(nomog.denominacion,'-') ||
                                            COALESCE(nomog.denominacion,'') ) LIKE '%"
                            . strtoupper(
                                    $datos->data->value
                            ) . "%'"
                    );
                }
            }
        }


        if ($parametros['ajustar'] == 'false') {
            $cadena = '';
            foreach ($parametros['x']->ar_select as $key => $value) {
                if ($key != 0 && $key != 1 && $key != 6 && $key != 7 && $key != 9
                ) {
                    $expresion = explode(" as ", $value);
                    $v = $expresion[0];
                    $cadena = $cadena . ',' . $v;
                }
            }
            $tem = '';
            //$p = '';
            foreach ($parametros['x']->ar_join as $key => $value) {
                $expresion = explode(" = ", $value);
                $expresionAux = split('"', $expresion[1]);
                foreach ($expresionAux as $v) {
                    $tem = $tem . $v;
                }
                $tem = $tem . ',';
            }

            $cadena = $cadena . ',' . $tem;

            unset($parametros['x']->ar_select[6]);
            unset($parametros['x']->ar_select[0]);
            unset($parametros['x']->ar_select[1]);
            unset($parametros['x']->ar_select[7]);
            unset($parametros['x']->ar_select[9]);

            $identmod = DatEntidadmodelo::obtenerIdEtidadModlo(
                            $parametros['idmodelo'], $parametros['arryhijos']
            );

            $array = Array();
            foreach ($identmod as $key => $value) {

                $array[$key] = $value['identidadmodelo'];
            }
            //$rober = implode(',', $array);
            $select = self::selectCuatro();
            $parametros['x']->select($select, false);

            $parametros['x']->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );
            $parametros['x']->join(
                    'mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );

            $parametros['x']->join(
                    'mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador'
            );

            $parametros['x']->join(
                    'mod_datosmaestros.dat_indicadorviaadquisicion diva', 'diva.idindicador = ind.idindicador'
            );
            $parametros['x']->join(
                    'mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface dios', 'dios.idindicador = diva.idindicador
                AND diva.idviaadquisicion = dios.idviaadquisicion'
            );
            $parametros['x']->join(
                    'mod_datosmaestros.nom_viaadquisicion nomva', 'nomva.idviaadquisicion = dios.idviaadquisicion'
            );
            $parametros['x']->join(
                    'mod_datosmaestros.nom_organosatisface nomos', 'nomos.idorganosatisface = dios.idorganosatisface'
            );

            $parametros['x']->join(
                    'mod_datosmaestros.dat_indicadorcentrobalance cb', 'pla.idindicador = cb.idindicador'
            );

            $parametros['x']->join(
                    'mod_planificacion.dat_entidaddatosnomenclador edn', 'edn.identidaddatosnomenclador = cb.identidaddatosnomenclador'
            );
            $parametros['x']->join(
                    'mod_planificacion.dat_planificacionnae dpnae', 'pla.idplanificacion = dpnae.idplanificacion', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.dat_planificacionnaegeneral dpg', 'dpnae.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.dat_planificacionnaeobjetogasto dpnog', 'dpnog.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral', 'left'
            );

            $parametros['x']->join(
                    'mod_planificacion.dat_planificacionnaeingreso dpni', 'dpni.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.nom_objetogasto nomog', 'nomog.idobjetogasto = dpnog.idobjetogasto', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.nom_recursofinanciero nomrf', 'nomrf.idrecursofinanciero = dpni.idingreso', 'left'
            );

            $parametros['x']->join(
                    'mod_planificacion.nom_nae nomnae', 'dpnae.idnae = nomnae.idnae', 'left'
            );
            $parametros['x']->where_in('pla.identidadmodelo', $array);

            $parametros['x']->where(
                    'pla.idejercicio', $parametros['idejercicio']
            );
            $groupBy = self::groupBy($cadena);


            $parametros['x']->offset($parametros['start']);
            $parametros['x']->limit($parametros['limit']);
            $parametros['x']->groupby($groupBy);
            $parametros['x']->orderby('ind.codigo asc');
            $data->data = $parametros['x']->get()->result_array();
            $data->total = count($data->data);
        } else {

            $selectUno = self::selectCinco();
            $parametros['x']->select($selectUno, false);
            $parametros['x']->join(
                    'mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion'
            );

            $parametros['x']->join(
                    'mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador'
            );

            $parametros['x']->join(
                    'mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador'
            );
            $parametros['x']->join(
                    'mod_datosmaestros.dat_indicadorviaadquisicion diva', 'diva.idindicador = ind.idindicador', 'left'
            );
            $parametros['x']->join(
                    'mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface dios', 'dios.idindicador = diva.idindicador
                AND diva.idviaadquisicion = dios.idviaadquisicion', 'left'
            );
            $parametros['x']->join(
                    'mod_datosmaestros.nom_viaadquisicion nomva', 'nomva.idviaadquisicion = diva.idviaadquisicion', 'left'
            );
            $parametros['x']->join(
                    'mod_datosmaestros.nom_organosatisface nomos', 'nomos.idorganosatisface = dios.idorganosatisface', 'left'
            );


            $parametros['x']->join(
                    'mod_datosmaestros.dat_indicadorcentrobalance cb', 'pla.idindicador = cb.idindicador'
            );

            $parametros['x']->join(
                    'mod_planificacion.dat_entidaddatosnomenclador edn', 'edn.identidaddatosnomenclador = cb.identidaddatosnomenclador'
            );
            $parametros['x']->join(
                    'mod_planificacion.dat_planificacionnae dpnae', 'pla.idplanificacion = dpnae.idplanificacion', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.dat_planificacionnaegeneral dpg', 'dpnae.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.dat_planificacionnaeobjetogasto dpnog', 'dpnog.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.dat_planificacionnaeingreso dpni', 'dpni.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.nom_objetogasto nomog', 'nomog.idobjetogasto = dpnog.idobjetogasto', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.nom_recursofinanciero nomrf', 'nomrf.idrecursofinanciero = dpni.idingreso', 'left'
            );
            $parametros['x']->join(
                    'mod_planificacion.nom_nae nomnae', 'dpnae.idnae = nomnae.idnae', 'left'
            );

            $parametros['x']->where(
                    'pla.identidadmodelo', $parametros['identidadmodelo']
            );

            $parametros['x']->where(
                    'pla.idejercicio', $parametros['idejercicio']
            );

            $parametros['x']->orderby('ind.codigo asc');

            if ($parametros['limit']) {
                $parametros['x']->offset($parametros['start']);
                $parametros['x']->limit($parametros['limit']);
            }
            $data->data = $parametros['x']->get()->result_array();
            $data->total = count($data->data);
        }
        return $data;
    }

    public function obtenerAsociadosNAEExportar($parametros) {
        $condiciones = array();
        $arraySqlparams = array();
        $arraySqlparams[] = $parametros['identidadmodelo'];
        $arraySqlparams[] = $parametros['idejercicio'];

        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $datos) {
                if ($datos->field == 'codigo') {
                    $condiciones[] = " ind.codigo  LIKE ? ";

                    $arraySqlparams[] = "%" . $datos->data->value . "%";
                } elseif ($datos->field == 'denominacion') {
                    $condiciones[] = " upper(ind.denominacion) LIKE ? ";
                    $arraySqlparams[] = "%" . strtoupper($datos->data->value)
                            . "%";
                } elseif ($datos->field == 'denoum') {
                    $condiciones[] = " ind.idumedida = ? ";
                    $arraySqlparams[] = $datos->data->value;
                } elseif ($datos->field == 'denocentrobalance') {
                    $condiciones[] = " edn.identidad = ? ";
                    $arraySqlparams[] = $datos->data->value;
                } elseif ($datos->field == 'importe') {
                    $cond = "=";
                    if ($datos->data->comparison == "gt") {
                        $cond = ">";
                    } elseif ($datos->data->comparison == "lt") {
                        $cond = ">";
                    }
                    $condiciones[] = "pla.importe " . $cond . "?";
                    $arraySqlparams[] = $datos->data->value;
                } elseif ($datos->field == 'cantidad') {
                    $cond = "=";
                    if ($datos->data->comparison == "gt") {
                        $cond = ">";
                    } elseif ($datos->data->comparison == "lt") {
                        $cond = ">";
                    }
                    $condiciones[] = "pla.cantidad " . $cond . "?";
                    $arraySqlparams[] = $datos->data->value;
                } elseif ($datos->field == 'precio') {
                    $cond = "=";
                    if ($datos->data->comparison == "gt") {
                        $cond = ">";
                    } elseif ($datos->data->comparison == "lt") {
                        $cond = ">";
                    }
                    $condiciones[] = "ind.precio " . $cond . "?";
                    $arraySqlparams[] = $datos->data->value;
                } elseif ($datos->field == 'idplanificacionnae') {
                    if ($datos->data->value == "Si") {
                        $condiciones[] = "  dpnae.idplanificacionnae IS NOT NULL";
                    } else {
                        $condiciones[] = "  dpnae.idplanificacionnae IS NULL";
                    }
                } elseif ($datos->field == 'idobjetogasto') {
                    if ($datos->data->value == "Si") {
                        $condiciones[] = " dpnog.idplanificacionnaegeneral IS NOT NULL";
                    } else {
                        $condiciones[] = " dpnog.idplanificacionnaegeneral IS NOT NULL";
                    }
                } elseif ($datos->field == 'idingreso') {
                    if ($datos->data->value == "Si") {
                        $condiciones[] = " dpni.idplanificacionnaegeneral IS NOT NULL";
                    } else {
                        $condiciones[] = " dpni.idplanificacionnaegeneral IS NOT NULL";
                    }
                } elseif ($datos->field == 'datos') {
                    $condiciones[] = " ( COALESCE(nomog.codigo,'') || COALESCE(nomog.codigo,'-') ||
                    COALESCE(nomog.denominacion,'-')
                    || COALESCE(nomog.denominacion,'') ) LIKE '{$datos->data->value}%'";
                }
            }
        }

        $where = "";
        foreach ($condiciones as $cond) {
            $where = $where . " AND " . $cond;
        }

        $conn = Doctrine_Manager::connection();
        $select = self::selectUno();
        $sql = "$select as datos FROM mod_planificacion.dat_planificacion pla
                    INNER JOIN mod_datosmaestros.nom_indicador ind
                    ON(pla.idindicador = ind.idindicador)
                    INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance cb
                    ON(ind.idindicador = cb.idindicador)
                    INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                    ON(cb.identidaddatosnomenclador = edn.identidaddatosnomenclador)

                    LEFT JOIN  mod_planificacion.dat_planificacionnae dpnae
                    ON( pla.idplanificacion = dpnae.idplanificacion )
                    LEFT JOIN  mod_planificacion.dat_planificacionnaegeneral dpg
                    ON( dpnae.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral )

                    LEFT JOIN  mod_planificacion.dat_planificacionnaeobjetogasto dpnog
                    ON( dpnog.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral )

                    LEFT JOIN  mod_planificacion.dat_planificacionnaeingreso dpni
                    ON( dpni.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral )

                    LEFT JOIN  mod_planificacion.nom_objetogasto nomog
                    ON( nomog.idobjetogasto = dpnog.idobjetogasto )

                    LEFT JOIN  mod_planificacion.nom_recursofinanciero nomrf
                    ON( nomrf.idrecursofinanciero = dpni.idingreso )

                    LEFT JOIN  mod_planificacion.nom_nae nomnae
                    ON( dpnae.idnae = nomnae.idnae ) WHERE pla.identidadmodelo =?
                    AND pla.idejercicio=? {$where} OFFSET ? LIMIT ? ";

        $arraySqlparamsTotal = $arraySqlparams;
        $arraySqlparams[] = $parametros['start'];
        $arraySqlparams[] = $parametros['limit'];
        $data->data = $conn->execute($sql, $arraySqlparams)->fetchAll(
                PDO::FETCH_CLASS
        );

        $sql = "SELECT  COUNT(pla.idplanificacion) as total
                    FROM mod_planificacion.dat_planificacion pla
                    INNER JOIN mod_datosmaestros.nom_indicador ind
                    ON(pla.idindicador = ind.idindicador)
                    INNER JOIN 'mod_datosmaestros.dat_indicadorcentrobalance cb
                    ON(ind.idindicador = cb.idindicador)
                    INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                    ON(cb.identidaddatosnomenclador = edn.identidaddatosnomenclador)

                    LEFT JOIN  mod_planificacion.dat_planificacionnae dpnae
                    ON( pla.idplanificacion = dpnae.idplanificacion )
                    LEFT JOIN  mod_planificacion.dat_planificacionnaegeneral dpg
                    ON( dpnae.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral )

                    LEFT JOIN  mod_planificacion.dat_planificacionnaeobjetogasto dpnog
                    ON( dpnog.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral )

                    LEFT JOIN  mod_planificacion.dat_planificacionnaeingreso dpni
                    ON( dpni.idplanificacionnaegeneral = dpg.idplanificacionnaegeneral )

                    LEFT JOIN  mod_planificacion.nom_objetogasto nomog
                    ON( nomog.idobjetogasto = dpnog.idobjetogasto )

                    LEFT JOIN  mod_planificacion.nom_recursofinanciero nomrf
                    ON( nomrf.idrecursofinanciero = dpni.idingreso )

                    LEFT JOIN  mod_planificacion.nom_nae nomnae
                    ON( dpnae.idnae = nomnae.idnae ) WHERE pla.identidadmodelo =?
                    AND pla.idejercicio=? {$where} ";

        $result = $conn->execute($sql, $arraySqlparamsTotal)->fetchAll(
                PDO::FETCH_CLASS
        ); //PDO::FETCH_UNIQUE |
        $data->total = $result[0]->total;

        return $data;
    }

    public function selectUno() {
        $consulta = "SELECT  pla.idplanificacion,pla.idaprobaciondemanda,
                pla.cantidad,pla.generadobasesplan,edn.identidad,pla.importe,
                pla.idindicador,ind.codigo as codigo,ind.denominacion as denominacion,
                ind.idpais,ind.idformato,ind.estado,ind.nivel,ind.descripcion,
                ind.idnaturaleza,ind.precio as precio,ind.idumedida as idumedida,
                ind.numeropieza as numeropieza,edn.identidaddatosnomenclador,
                cb.idindicadorcentrobalance,dpnae.idplanificacionnae,
                dpg.idplanificacionnaegeneral,dpnog.idobjetogasto,dpni.idingreso,
                ( COALESCE(nomog.codigo,'') || COALESCE(nomog.codigo,'-') ||
                COALESCE(nomog.denominacion,'-') || COALESCE(nomog.denominacion,'') )";
        return $consulta;
    }

    public function indXCBEntidad($params) {

        $arrayParams[] = $params['identidaddatosnomenclador'];
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "Select DISTINCT(dem.identidad)
                           from mod_planificacion.dat_planificacion dp                           
                           inner join mod_planificacion.dat_entidadmodelo dem
                           ON dp.identidadmodelo = dem.identidadmodelo
                           where dp.idcentrobalance = ? ";
        $data = $conn->execute($sqlQuery, $arrayParams);
        $data->data = $data->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    private function addHavigConParams(&$addHaving, $columCond, $param) {
        if ($addHaving != "") {
            $addHaving .= " OR " . $columCond . $param;
        } else {
            $addHaving .= "HAVING " . $columCond . $param;
        }
    }

    public function indXCB($params) {
        if ($params['identidaddatosnomenclador'] != "") {
            $WHERE = "AND dp.idcentrobalance = " . $params['identidaddatosnomenclador'] . "";
        } else {
            $WHERE = "";
        }    
        //$prueba = $params['identidaddatosnomenclador'];
        if ($params['exportar'] != 1) {
            //el delimitador solo se pone si es el listar
            $delimitador = "OFFSET {$params['start']} LIMIT {$params['limit']}";
        }

        $conn = Doctrine_Manager::connection();
        $addHaving = "";
        $val = "";
        $esp = "";
        $arrayParams = array();
//        $cantidad = " OFFSET ?   LIMIT ?";
//        if ($params['filtros']) {
//            foreach ($params['filtros'] as $s) {
//                switch ($s['field']) {
//                    case 'importe': {
//                            if ($s['data']['comparison'] == 'gt') {
//                                $val = $val . ' AND importe > ? ';
//                                $arrayParams[] = $s['data']['value'];
//                            } elseif ($s['data']['comparison'] == 'lt') {
//                                $val = $val . ' AND importe < ? ';
//                                $arrayParams[] = $s['data']['value'];
//                            } elseif ($s['data']['comparison'] == 'eq') {
//                                $val = $val . ' AND importe = ? ';
//                                $arrayParams[] = $s['data']['value'];
//                            }
//                        }
//                        break;
//                    case 'denominacionind': {
//                            $val = $val . " AND upper(n.denominacion) LIKE ? ";
//                            $arrayParams[] = "%" . strtoupper($s['data']['value'])
//                                    . "%";
//                        }
//                        break;
//
//                    case 'numeropieza': {
//                            $val = $val . " AND upper(n.numeropieza) LIKE ? ";
//                            $arrayParams[] = "%" . strtoupper($s['data']['value'])
//                                    . "%";
//                        }
//                        break;
//                    case 'codigo': {
//                            $val = $val . " AND n.codigo LIKE ? ";
//                            $arrayParams[] = strtoupper($s['data']['value'] . "%");
//                        }
//                        break;
//                    case 'denominacionmodelo': {
//                            $val = $val . " AND dm.idmodelo = ? ";
//                            $arrayParams[] = $s['data']['value'];
//                        }
//                        break;
//                    case 'entidad': {
//                            $cantidad = "";
//                        }
//                        break;
//                    case 'denomentidadpadre': {
//
//                            $esp = $esp . " AND e1.idestructura = \""
//                                    . $s['data']['value'] . "\"";
//                            $val = $val . " AND (Select e1.denominacion
//                                        from mod_estructuracomp.nom_filaestruc f1 
//                                        inner join mod_estructuracomp.dat_estructura e1
//                                        ON f1.idfila = e1.idestructura
//                                        where f1.idpadre = (Select ed.identidad 
//                                        from mod_planificacion.dat_entidaddatosnomenclador ed
//                                        inner join mod_planificacion.nom_datosnomenclador nd
//                                        ON ed.iddatosnomenclador = nd.iddatosnomenclador
//                                        where nd.uridatosnomenclador = 'rectorbalance') 
//                                        AND ( e1.lft <= e.lft AND e1.rgt >= e.rgt) 
//                                        AND (e1.idestructura <> e1.idpadre)) ='"
//                                    . $s['data']['value'] . "'        ";
//                        }
//                        break;
//                    case 'necesidad': {
//                            $cantidad = "";
//
//                            if ($s['data']['comparison'] == 'gt') {
//                                self::addHavigConParams(
//                                        $addHaving, "SUM(dp.cantidad + dp.ajuste) >", $s['data']['value']
//                                );
//                            } elseif ($s['data']['comparison'] == 'lt') {
//                                self::addHavigConParams(
//                                        $addHaving, "SUM(dp.cantidad + dp.ajuste) <", $s['data']['value']
//                                );
//                            } elseif ($s['data']['comparison'] == 'eq') {
//                                self::addHavigConParams(
//                                        $addHaving, "SUM(dp.cantidad + dp.ajuste) =", $s['data']['value']
//                                );
//                            }
//                        }
//                        break;
//                    case 'cantidadreal': {
//                            if ($s['data']['comparison'] == 'gt') {
//                                self::addHavigConParams(
//                                        $addHaving, "SUM(dp.cantidad) >", $s['data']['value']
//                                );
//                            } elseif ($s['data']['comparison'] == 'lt') {
//                                self::addHavigConParams(
//                                        $addHaving, "SUM(dp.cantidad) <", $s['data']['value']
//                                );
//                            } elseif ($s['data']['comparison'] == 'eq') {
//                                self::addHavigConParams(
//                                        $addHaving, "SUM(dp.cantidad) =", $s['data']['value']
//                                );
//                            }
//                        }
//                        break;
//                    case 'ajuste': {
//                            if ($s['data']['comparison'] == 'gt') {
//                                self::addHavigConParams(
//                                        $addHaving, "SUM(dp.ajuste) >", $s['data']['value']
//                                );
//                            } elseif ($s['data']['comparison'] == 'lt') {
//                                self::addHavigConParams(
//                                        $addHaving, "SUM(dp.ajuste) <", $s['data']['value']
//                                );
//                            } elseif ($s['data']['comparison'] == 'eq') {
//                                self::addHavigConParams(
//                                        $addHaving, "SUM(dp.ajuste) =", $s['data']['value']
//                                );
//                            }
//                        }
//                }
//            }
//        } else {
//            $val = " 0=0";
//        }
        $sqlQuery = " Select n.denominacion as denominacionind,
                n.codigo, dm.denominacion as denominacionmodelo,dem.identidad,
                o.denominacion as denominacionenti,
      (
          SELECT CASE
                   WHEN e.idestructura is not null THEN e.denominacion
                   ELSE eop.denominacion
                 END as entidad
          from mod_estructuracomp.nom_filaestruc f1
               LEFT JOIN mod_estructuracomp.dat_estructura e ON f1.idfila = e.idestructura
               LEFT JOIN mod_estructuracomp.dat_estructuraop eop ON f1.idfila = eop.idestructuraop
          WHERE parent_path = subltree((
                                         SELECT parent_path
                                         from mod_estructuracomp.nom_filaestruc
                                         where idfila = dem.identidad
                ), 0, 2)
        ) as denomentidadpadre,
      SUM(dp.cantidad + dp.ajuste ) as necesidad,SUM(dp.cantidad ) as cantidadreal,
      SUM(dp.ajuste) as ajuste,ip.precio,(SUM(dp.cantidad)*ip.precio) as importe,
      n.numeropieza,count(*) OVER() as total 
      from mod_planificacion.dat_planificacion dp
      inner join mod_datosmaestros.nom_indicador n ON dp.idindicador = n.idindicador
      inner join mod_datosmaestros.nom_indicadorplanif ip on n.idindicador =
      ip.idindicador
      inner join mod_planificacion.dat_entidadmodelo dem ON dp.identidadmodelo =
       dem.identidadmodelo
      inner join mod_estructuracomp.nom_filaestruc f
      ON dem.identidad = f.idfila
      inner join (SELECT  idestructura, denominacion,idconcepto,idorgano
      FROM mod_estructuracomp.dat_estructura where idproyecto = 0
      union
      SELECT idestructuraop as idestructura, denominacion,idconcepto,idorgano
      FROM mod_estructuracomp.dat_estructuraop where idproyecto = 0) e
      on (f.idfila = e.idestructura) inner join mod_estructuracomp.nom_organo o
      on (o.idorgano = e.idorgano and o.idconcepto = e.idconcepto)
      inner join mod_planificacion.dat_modelo dm ON dm.idmodelo = dem.idmodelo
      inner join mod_datosmaestros.dat_indicadorcentrobalance dicb
      ON dicb.idindicador = n.idindicador
      inner join mod_planificacion.dat_entidaddatosnomenclador dedn
      ON dicb.identidaddatosnomenclador =dedn.identidaddatosnomenclador
     where /*$val and */ dp.idejercicio = " . $params['idejercicio'] . " $WHERE
     GROUP BY n.denominacion,n.codigo,dm.denominacion,dem.identidad,ip.precio,
                  n.numeropieza,o.denominacion  $addHaving
                  $delimitador";  
        //print_r($sqlQuery);die;
        $dat = $conn->execute($sqlQuery, $arrayParams);
        $data->data = $dat->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->data[0]['total'];        
        return $data;
    }

    /* se emplea en el exportar demanda */

    public function cantIndXCB($params) {
        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom(
                        $params['idcb']
        );

        $arrayParams[] = $entidaddatosnom[0]['identidaddatosnomenclador'];
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "Select COUNT(dp.idplanificacion) as total
               from mod_planificacion.dat_planificacion dp
                           inner join mod_datosmaestros.nom_indicador n
                           ON dp.idindicador = n.idindicador
                           inner join mod_planificacion.dat_entidadmodelo dem
                           ON dp.identidadmodelo = dem.identidadmodelo
                           inner join mod_planificacion.dat_modelo dm
                           ON dm.idmodelo = dem.idmodelo
                           inner join mod_datosmaestros.dat_indicadorcentrobalance dicb
                           ON dicb.idindicador = n.idindicador
                           inner join mod_planificacion.dat_entidaddatosnomenclador dedn
                           ON dicb.identidaddatosnomenclador =dedn.identidaddatosnomenclador
                           where dp.idcentrobalance = ? ";
        $res = $conn->execute($sqlQuery, $arrayParams);
        $res = $res->fetchAll(PDO::FETCH_CLASS);
        return $res[0]->total;
    }

    //Se repite el metodo para el exportar del ver demanda de plan con el ejercicio utilizado.
    public function cantIndXCBDemanda($params) {
        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom(
                        $params['idcb']
        );
        $arrayParams[] = $entidaddatosnom[0]['identidaddatosnomenclador'];
        $conn = Doctrine_Manager::connection();
        $sqlQuery = "Select COUNT(dp.idplanificacion) as total
                           from mod_planificacion.dat_planificacion dp
                           inner join mod_datosmaestros.nom_indicador n
                           ON dp.idindicador = n.idindicador
                           inner join mod_planificacion.dat_entidadmodelo dem
                           ON dp.identidadmodelo = dem.identidadmodelo
                           inner join mod_planificacion.dat_modelo dm
                           ON dm.idmodelo = dem.idmodelo
                           inner join mod_planificacion.dat_indicadorcentrobalance dicb
                           ON dicb.idindicador = n.idindicador
                           inner join mod_planificacion.dat_entidaddatosnomenclador dedn
                           ON dicb.identidaddatosnomenclador =dedn.identidaddatosnomenclador
                           where dp.idcentrobalance = ? AND dp.idejercicio = "
                . $params['idejercicio'];
        $res = $conn->execute($sqlQuery, $arrayParams);
        $res = $res->fetchAll(PDO::FETCH_CLASS);
        return $res[0]->total;
    }

    public function listarIndicadoresPorFecha($params) {
        $params['idejercicio'] = NomEjercicioplanificacion::listarEjercicioActual();
        $params['idejercicio'] = $params['idejercicio'][0]['idejercicio'];

        $arrayParametros = array();
        $arrayParametrosTotal = array();
        $arrayParametros[] = $params['identidadmodelo'];
        $arrayParametros[] = $params['idejercicio'];
        $WHERE = "";

        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $WHERE .= " AND ind.codigo LIKE ?";
                    $arrayParametros[] = ($datos ['data']['value'] . '%');
                } else {
                    if ($datos ['field'] == 'denominacion') {
                        $WHERE .= " AND upper(ind.denominacion) LIKE ?";
                        $arrayParametros[] = (strtoupper(
                                        $datos ['data']['value']
                                ) . "%");
                    }
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql = ' SELECT DISTINCT p.idindicador,SUM(p.cantidad) as cantplanif,
           0 as cantpordesglozar,ind.codigo,ind.denominacion,ind.descripcion,
           p.identidadmodelo FROM mod_planificacion.dat_planificacion p
                INNER JOIN mod_datosmaestros.nom_indicador ind
                ON( ind. idindicador = p.idindicador )WHERE p.identidadmodelo = ?
                AND p.idejercicio = ?' . $WHERE . '
                GROUP BY p.idindicador ,ind.codigo,ind.denominacion,ind.descripcion,
                p.identidadmodelo OFFSET ? LIMIT ? ';

        $arrayParametrosTotal = $arrayParametros;
        $arrayParametros[] = $params['start'];
        $arrayParametros[] = $params['limit'];
        $res = $conn->execute($sql, $arrayParametros);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);

        $sql = ' SELECT COUNT( DISTINCT p.idindicador ) as total
                FROM mod_planificacion.dat_planificacion p
                INNER JOIN mod_datosmaestros.nom_indicador ind
                ON( ind. idindicador = p.idindicador ) WHERE p.identidadmodelo = ?
                AND p.idejercicio = ? ' . $WHERE . ' ';
        $res = $conn->execute($sql, $arrayParametrosTotal);
        $data->total = $res->fetchAll(PDO::FETCH_ASSOC);
        $data->total = $data->total[0]['total'];
        return $data;
    }

    public function obtenerIndicadoresRecuperaciones() {
        $cadenaQUERY = 'SELECT  p.idindicador, i.denominacion, i.codigo, i.precio,
						u.nombreum, m.denominacion AS plan, m.idmodelo AS idplan';
        $cadenaJOIN = ' FROM mod_planificacion.dat_planificacion p
						INNER JOIN mod_datosmaestros.nom_indicador i
						ON p.idindicador = i.idindicador
						INNER JOIN mod_datosmaestros.dat_unidadmedida u
						ON i.idumedida = u.idunidadmedida
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.identidadmodelo = p.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelo m
						ON m.idmodelo = em.idmodelo ';
        $cadenaWHERE = ' ';

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;

        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerCantidadPorIdViaAdquisicion($idviaadquisicion, $idindicador, $idplan
    ) {
        $cadenaQUERY = 'SELECT SUM(p.cantidad) as cantidad';
        $cadenaJOIN = ' FROM mod_planificacion.dat_planificacion p
						INNER JOIN mod_datosmaestros.nom_indicador i
						ON p.idindicador = i.idindicador
						INNER JOIN mod_datosmaestros.dat_unidadmedida u
						ON i.idumedida = u.idunidadmedida
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.identidadmodelo = p.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelo m
						ON m.idmodelo = em.idmodelo
						INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva
						ON iva.idindicador = i.idindicador';
        $cadenaWHERE = ' WHERE  iva.idviaadquisicion = ' . $idviaadquisicion
                . ' AND p.idindicador = ' . $idindicador . '
						AND m.idmodelo = ' . $idplan;

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;

        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerIndicadoresPorIdViaAdquisicionIdPlan($idviaadquisicion, $idplan
    ) {
        $cadenaQUERY = 'SELECT  p.idindicador, i.denominacion, i.codigo, i.precio,
						u.nombreum, m.denominacion AS plan, m.idmodelo AS idplan,
						SUM(p.cantidad) as cantidad';
        $cadenaJOIN = ' FROM mod_planificacion.dat_planificacion p
						INNER JOIN mod_datosmaestros.nom_indicador i
						 ON p.idindicador = i.idindicador
						INNER JOIN mod_datosmaestros.dat_unidadmedida u
						ON i.idumedida = u.idunidadmedida
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.identidadmodelo = p.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelo m
						ON m.idmodelo = em.idmodelo
						INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva
						ON iva.idindicador = i.idindicador';
        $cadenaWHERE = ' WHERE  iva.idviaadquisicion = ' . $idviaadquisicion
                . ' AND m.idmodelo = ' . $idplan . '
						GROUP BY p.idindicador, i.denominacion, i.codigo, i.precio, 
						u.nombreum, m.denominacion, m.idmodelo';

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;

        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerIndicadoresPorArrayIdViaAdquisicionIdPlan($arrayidvias, $idplan
    ) {
        $cadenaQUERY = 'SELECT  DISTINCT(p.idindicador),p.idindicador, i.denominacion, i.codigo, i.precio,
						u.nombreum, m.denominacion AS plan, m.idmodelo AS idplan,
						iva.idviaadquisicion';
        $cadenaJOIN = ' FROM mod_planificacion.dat_planificacion p
						INNER JOIN mod_datosmaestros.nom_indicador i
						ON p.idindicador = i.idindicador
						INNER JOIN mod_datosmaestros.dat_unidadmedida u
						ON i.idumedida = u.idunidadmedida
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.identidadmodelo = p.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelo m
						ON m.idmodelo = em.idmodelo
						INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva
						ON iva.idindicador = i.idindicador';
        $cadenaWHERE = ' WHERE  iva.idviaadquisicion IN(' . $arrayidvias
                . ') AND m.idmodelo = ' . $idplan;

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;

        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerIndicadoresPorIdPlan($idplan) {

        $cadenaQUERY = 'SELECT  distinct(p.idindicador),p.idindicador, i.denominacion,
            i.codigo, i.precio,
						u.nombreum, m.denominacion AS plan,
						 m.idmodelo AS idplan,
						iva.idviaadquisicion';
        $cadenaJOIN = ' FROM mod_planificacion.dat_planificacion p
						INNER JOIN mod_datosmaestros.nom_indicador i
						ON p.idindicador = i.idindicador
						INNER JOIN mod_datosmaestros.dat_unidadmedida u
						ON i.idumedida = u.idunidadmedida
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.identidadmodelo = p.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelo m
						ON m.idmodelo = em.idmodelo
						INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva
						ON iva.idindicador = i.idindicador';
        $cadenaWHERE = ' WHERE  m.idmodelo = ' . $idplan;

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;

        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerPlanesExistentesPorEjercicio($idejercicio) {
        $query = new Doctrine_Query();
        $resultado = $query->select('m.idmodelo, m.denominacion')
                        ->from('DatModelo m')->innerJoin('m.DatEntidadmodelo em')
                        ->innerJoin('em.DatPlanificacion p')->where('p.idejercicio =? ', $idejercicio)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $resultado;
    }

    public function obtenerPlanesTodos() {
        $query = new Doctrine_Query();
        $resultado = $query->select('m.idmodelo, m.denominacion')
                ->from('DatModelo m')->innerJoin('m.DatEntidadmodelo em')
                ->innerJoin('em.DatPlanificacion p')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $resultado;
    }

    public function obtenerPlanesPorEjercicio($idejercicio, $denclasificplan) {
        $addclasif = " ";
        $comilla = "'";
        if ($denclasificplan) {
            $addclasif = " AND m.uriruta like   $comilla%$denclasificplan%$comilla ";
        }
        $cadena = "SELECT distinct(m.idmodelo),m.idmodelo,m.denominacion, m.idtipomodelo
						FROM mod_planificacion.dat_modelo m
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.idmodelo = m.idmodelo
						INNER JOIN mod_planificacion.dat_planificacion p
						ON p.identidadmodelo = em.identidadmodelo
						WHERE  p.idejercicio =  $idejercicio  $addclasif  ";

        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();

        return $resultado;
    }

    public function obtenerIndicadorTotalizadoXPlanViaXViaAdq($idindicador, $idviaadquisicion, $idplan
    ) {
        $cadenaQUERY = 'SELECT SUM(p.cantidad) as cantidad';
        $cadenaJOIN = ' FROM mod_planificacion.dat_planificacion p
						INNER JOIN mod_datosmaestros.nom_indicador i
						ON p.idindicador = i.idindicador
						INNER JOIN mod_datosmaestros.dat_unidadmedida u
						ON i.idumedida = u.idunidadmedida
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.identidadmodelo = p.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelo m
						ON m.idmodelo = em.idmodelo
						INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva
						ON iva.idindicador = i.idindicador';
        $cadenaWHERE = ' WHERE  iva.idviaadquisicion = ' . $idviaadquisicion
                . ' AND i.idindicador = ' . $idindicador . '
						AND m.idmodelo = ' . $idplan;

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;

        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerIndicadoresReporteResumenPorViaAdquisicion($parametros
    ) {
        $arrentmod = DatEntidadmodelo::obtenerIdEtidadModlo(
                        $parametros->idplan, $parametros->arrayidorganos
        );

        $arrayidentmod = Array();
        foreach ($arrentmod as $key => $value) {

            $arrayidentmod[$key] = $value['identidadmodelo'];
        }

        $identidadmodelos = implode(',', $arrayidentmod);
        $parametros->identidadmodelo = $identidadmodelos;
        //sentencias obligatorias
        $cadenaQUERY = 'SELECT i.idindicador, 
                               round(p.precio, 3) as precio,
                               i.codigo,
                                i.denominacion as nombreindicador,
                                u.denominacionunidadmedida as nombreum,
                                SUM(p.cantidad+p.ajuste) as cantidad,
                            round((SUM(p.cantidad+p.ajuste)*p.precio) +
                            ((SUM(p.cantidad+p.ajuste)*p.precio) * indplanif.flete / 100) + 
                            ((SUM(p.cantidad+p.ajuste)*p.precio) * indplanif.contingencia / 100), 3) as importe,

COALESCE(SUM(odcte.cpe),0) AS ajuste,
COALESCE(SUM(odcte.cpe * indplanif.precio),0) AS valorajuste,
COALESCE(SUM(odcte.demanda),0) AS demanda,
COALESCE(SUM(odcte.demanda * indplanif.precio),0) AS valordemanda,
m.denominacion as nombreplan,
(SELECT va.idviaadquisicion FROM mod_datosmaestros.dat_indicadorviaadquisicion iva
INNER JOIN mod_datosmaestros.nom_viaadquisicion va ON (iva.idviaadquisicion = va.idviaadquisicion)
WHERE iva.idindicador = i.idindicador AND iva.idviaadquisicion IN('
                . $parametros->arrayidviasUnidimensional
                . ') limit 1) AS idviaadquisicion';

        $cadenaJOIN = '	FROM mod_planificacion.dat_planificacion p
						INNER JOIN mod_datosmaestros.nom_indicador i
						ON i.idindicador = p.idindicador
                        INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif
                        ON indplanif.idindicador = i.idindicador
						INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva
						ON iva.idindicador = i.idindicador
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						 ON em.identidadmodelo = p.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelo m
						ON m.idmodelo = em.idmodelo
						INNER JOIN mod_datosmaestros.nom_unidadmedida u
						ON i.idumedida = u.idunidadmedida
						LEFT JOIN mod_planificacion.dat_odcte odcte
						ON (odcte.identidad =
       em.identidad and odcte.idmodelo =m.idmodelo and odcte.idejercicio=p.idejercicio and odcte.idindicador=i.idindicador)					';


        $cadenaWHERE = ' WHERE m.idmodelo = ' . $parametros->idplan . ' 
			 AND i.estado = 1 
			 AND p.identidadmodelo IN (' . $parametros->identidadmodelo . ') 
             AND p.idejercicio = ' . $parametros->idejercicio . '

            AND indplanif.idaprobacion > 2
			AND iva.idviaadquisicion = (SELECT va.idviaadquisicion
			FROM mod_datosmaestros.dat_indicadorviaadquisicion iva
						INNER JOIN mod_datosmaestros.nom_viaadquisicion va
						 ON (iva.idviaadquisicion = va.idviaadquisicion)
						WHERE iva.idindicador = i.idindicador AND iva.idviaadquisicion IN('
                . $parametros->arrayidviasUnidimensional . ') limit 1) ';


        //filtro por centros de balance
        if (isset($parametros->arrayidcentrosbalance[0])) {

            $cadenaJOIN
                    .= ' INNER JOIN mod_planificacion.dat_indicadorcentrobalance icb
                ON icb.idindicador = i.idindicador
							INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
							ON edn.identidaddatosnomenclador = icb.identidaddatosnomenclador
							INNER JOIN mod_estructuracomp.dat_estructura e
							ON e.idestructura = edn.identidad';
            $cadenaWHERE .= ' AND edn.identidad IN('
                    . $parametros->arrayidcentrobalanceUnidimensional . ')';
        }

        //filtro por organos demandates(preguntarle a galban la duda si CB = OD en algun momento)

        if (isset($parametros->arrayidorganos[0])) {

            $cadenaWHERE .= ' AND em.identidad IN('
                    . $parametros->arrayidorganosUnidimensional . ')';
        }

        //filtro por nivel arbol
        if ($parametros->idnivel) {
            $cadenaWHERE .= ' AND i.nivel= ' . $parametros->idnivel;
        } else {
            $cadenaWHERE .= ' AND i.nivel IN (1,2,3,4)';
        }

        //filtro por codigo
        if ($parametros->codigo != null) {
            $cadenaWHERE .= " AND upper(i.codigo) LIKE '%" . strtoupper(
                            $parametros->codigo
                    ) . "%' ";
        }

        //filtro por numero pieza
        if ($parametros->numpieza != null) {
            $cadenaWHERE .= " AND upper(i.numeropieza) LIKE '%" . strtoupper(
                            $parametros->numpieza
                    ) . "%' ";
        }

        //filtro por denominacion
        if ($parametros->denominacion != null) {
            $cadenaWHERE .= " AND upper(i.denominacion) LIKE '%" . strtoupper(
                            $parametros->denominacion
                    ) . "%' ";
        }

        //termina la sentencia obligatoria
        $cadenaWHERE
                .= ' GROUP BY i.idindicador,p.precio, i.codigo, i.denominacion,u.denominacionunidadmedida,
             m.denominacion,indplanif.flete,indplanif.contingencia,(SELECT va.idviaadquisicion
						FROM mod_datosmaestros.dat_indicadorviaadquisicion iva
						INNER JOIN mod_datosmaestros.nom_viaadquisicion va
						ON (iva.idviaadquisicion = va.idviaadquisicion)
						WHERE iva.idindicador = i.idindicador AND iva.idviaadquisicion IN('
                . $parametros->arrayidviasUnidimensional . ') limit 1)
						ORDER BY m.denominacion';

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;
        $objconexion = Doctrine_Manager:: connection();

        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerIndicadoresReporteResumenComparativoPlanPorConceptos($parametros) {

        if ($parametros->arrayviasadquisicion[0]->idvia != "") {
            $viasarr = [];
            foreach ($parametros->arrayviasadquisicion as $key => $vias) {
                $viasarr[$key] = $vias->idvia;
            }
            $parametros->arrayviasseparadas = implode(',', $viasarr);
        } else {
            $parametros->arrayviasseparadas = 2;
        }

        $cadenaQUERY = "SELECT DISTINCT(i.idindicador),i.idarbol,round(p.precio, 2) as precio,
                               i.codigo,i.denominacion as nombreindicador,u.denominacionunidadmedida,
				round(SUM(p.cantidad+p.ajuste), 2) as cantidad,
                                
                                round((SUM(p.cantidad+p.ajuste)*p.precio) +
                            ((SUM(p.cantidad+p.ajuste)*p.precio) * indplanif.flete / 100) + 
                            ((SUM(p.cantidad+p.ajuste)*p.precio) * indplanif.contingencia / 100), 3) as importe,
                                                
						COALESCE(SUM(odcte.cpe),0) AS ajuste,
                                                COALESCE(SUM(odcte.cpe * p.precio),0) AS valorajuste,
                                                
						COALESCE(SUM(odcte.demanda),0) AS demanda,
                                                COALESCE(SUM(odcte.demanda * p.precio),0) AS valordemanda
                ,os.denominacion as organodemandante ";
        if ($parametros->idnivel == 3) {
            $cadenaQUERY.=',substr(i.codigo,1,6) as codigoespecifico,(SELECT denominacion as nombreindicador
                FROM mod_datosmaestros.nom_indicador ind
          where ind.idarbol = i.idarbol AND ind.nivel = ' . $parametros->idnivel . ' AND ind.codigo=substr(i.codigo,1,6)) as denominacionespecifico';
        } elseif ($parametros->idnivel == 2) {
            $cadenaQUERY.=',substr(i.codigo,1,4) as codigosubgenerico,(SELECT denominacion as nombreindicador
                FROM mod_datosmaestros.nom_indicador ind
          where ind.idarbol = i.idarbol AND ind.nivel = ' . $parametros->idnivel . ' AND ind.codigo=substr(i.codigo,1,4)) as denominacionsubgenerico ';
        } elseif ($parametros->idnivel == 1) {
            $cadenaQUERY.=',substr(i.codigo,1,3) as codigogenerico,(SELECT denominacion as nombreindicador
                FROM mod_datosmaestros.nom_indicador ind
          where ind.idarbol = i.idarbol AND ind.nivel = ' . $parametros->idnivel . ' AND ind.codigo=substr(i.codigo,1,3)) as denominaciongenerico ';
        }
        $cadenaJOIN = "FROM mod_datosmaestros.nom_indicador i
            INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif ON i.idindicador = indplanif.idindicador
						INNER JOIN mod_planificacion.dat_planificacion p ON i.idindicador = p.idindicador
						INNER JOIN mod_planificacion.dat_entidadmodelo em ON em.identidadmodelo = p.identidadmodelo
                        INNER JOIN mod_estructuracomp.nom_filaestruc e ON em.identidad = e.idfila
                        INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON (edn.identidad = e.idfila AND edn.iddatosnomenclador=2)
						INNER JOIN mod_planificacion.dat_modelo m ON m.idmodelo = em.idmodelo
						INNER JOIN mod_datosmaestros.nom_unidadmedida u ON i.idumedida = u.idunidadmedida
						INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva ON iva.idindicador = i.idindicador AND iva.idviaadquisicion in($parametros->arrayviasseparadas)
						INNER JOIN mod_datosmaestros.nom_viaadquisicion va ON va.idviaadquisicion = iva.idviaadquisicion
						left JOIN mod_planificacion.dat_odcte odcte ON (odcte.identidad =
       em.identidad and odcte.idmodelo =m.idmodelo and odcte.idejercicio=p.idejercicio and odcte.idindicador=i.idindicador)";

        //la via con id 2 es la de OACE
        $cadenaWHERE = " WHERE va.idviaadquisicion = 2";
        $cadenaJOIN
                .= ' LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivo ON (ivo.idindicador = iva.idindicador AND ivo.idviaadquisicion = iva.idviaadquisicion)
								LEFT JOIN mod_datosmaestros.nom_organosatisface os ON ivo.idorganosatisface = os.idorganosatisface ';

        //$cadenaWHERE .= ')';
        $cadenaWHERE .= '  AND p.idejercicio = ' . $parametros->idejercicio;
        //filtro por centros de balance
        if ($parametros->totalcentrobalance > 0) {
            $cadenaJOIN
                    .= ' INNER JOIN mod_planificacion.dat_indicadorcentrobalance icb ON icb.idindicador = i.idindicador
							INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON edn.identidaddatosnomenclador = icb.identidaddatosnomenclador
							INNER JOIN mod_estructuracomp.dat_estructura e ON e.idestructura = edn.identidad';
            $cadenaWHERE .= ' AND edn.identidad IN(' . $parametros->arrayidcentrobalance_unidimensional . ')';
        }
        /* if (count($parametros->arraysect) > 0) {
          $cadenaWHERE .= ' AND md.n5 IN(' . $idnom5 . ')';
          } */
        //filtro por organos demandates(preguntarle a galban la duda si CB = OD en algun momento)
        if (isset($parametros->arrayidorganos[0])) {
            $cadenaWHERE .= ' AND em.identidad IN(' . $parametros->arrayidorganos_unidimensional . ')';
        }

        //filtro por nivel arbol
        if ($parametros->idnivel == 4) {
            $cadenaWHERE .= ' AND i.nivel= ' . $parametros->idnivel;
        }

        //filtro por planes
        if ($parametros->totalplanes > 0) {
            $cadenaWHERE .= ' AND m.idmodelo IN(' . $parametros->arrayunidimensional_idplan . ') ';
        }

        //filtro por codigo
        if ($parametros->codigo != null) {
            $cadenaWHERE .= " AND upper(i.codigo) LIKE '%" . strtoupper($parametros->codigo) . "%' ";
        }

        //filtro por numero pieza
        if ($parametros->numpieza != null) {
            $cadenaWHERE .= " AND upper(i.numeropieza) LIKE '%" . strtoupper($parametros->numpieza) . "%' ";
        }

        //filtro por denominacion
        if ($parametros->denominacion != null) {
            $cadenaWHERE .= " AND upper(i.denominacion) LIKE '%" . strtoupper($parametros->denominacion) . "%' ";
        }

        $cadenaWHERE
                .= " GROUP BY i.idindicador,p.precio,i.codigo, i.denominacion,u.denominacionunidadmedida,indplanif.flete,indplanif.contingencia
				,os.denominacion
				order by os.denominacion, i.codigo";

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;
        $objconexion = Doctrine_Manager :: connection();

        $resultado = $objconexion->execute($cadena)->fetchAll();

        return $resultado;
    }

    public function obtenerIndicadoresReporteResumenProductosSIPorOrganoSatisface($parametros
    ) {
        $cadenaQUERY = "SELECT i.idindicador,round(p.precio,3) as precio ,i.codigo,
            i.denominacion as nombreindicador,u.denominacionunidadmedida as nombreum,
						SUM( p.cantidad+p.ajuste) as cantidad,
                                                round(
                                                (SUM( p.cantidad+p.ajuste)*p.precio) +
						 ((SUM( p.cantidad+p.ajuste)*p.precio) * indplanif.flete/100 +
						 (SUM( p.cantidad+p.ajuste)*p.precio) * indplanif.contingencia/100),3) as importe,
						SUM(odcte.cpe) AS ajuste,SUM(odcte.cpe * indplanif.precio) AS valorajuste,
						SUM(odcte.demanda) AS demanda,
						SUM(odcte.demanda * indplanif.precio) AS valordemanda,
						os.idorganosatisface AS idoace";

        $cadenaJOIN = "	FROM mod_datosmaestros.nom_indicador i
            INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif ON (i.idindicador = indplanif.idindicador)
						INNER JOIN mod_planificacion.dat_planificacion p
						ON i.idindicador = p.idindicador
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.identidadmodelo = p.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelo m
						ON m.idmodelo = em.idmodelo
						INNER JOIN mod_datosmaestros.nom_unidadmedida u
						ON i.idumedida = u.idunidadmedida
						INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva
						ON iva.idindicador = i.idindicador
						INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivos
						 ON (ivos.idindicador = iva.idindicador AND ivos.idviaadquisicion = iva.idviaadquisicion)
						INNER JOIN mod_datosmaestros.nom_organosatisface os
						ON os.idorganosatisface = ivos.idorganosatisface
						INNER JOIN mod_datosmaestros.nom_viaadquisicion va
						ON va.idviaadquisicion = iva.idviaadquisicion
						INNER JOIN mod_planificacion.dat_odcte odcte
						ON (odcte.identidad = em.identidad
						AND odcte.idmodelo = em.idmodelo and i.idindicador = odcte.idindicador)";

        if ($parametros->origenreporte == 1) { //para mostrar el reporte fisico
            $cadenaWHERE = " WHERE va.idviaadquisicion IN
							(SELECT va1.idviaadquisicion 
							 FROM mod_datosmaestros.nom_viaadquisicion va1
							 INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva1
							 ON iva1.idviaadquisicion = va1.idviaadquisicion
							 INNER JOIN mod_datosmaestros.nom_indicador i1
							 ON i1.idindicador = iva1.idindicador
							 WHERE  i1.idindicador = i.idindicador limit 1) 
							 AND va.uriviaadquisicion = 'sustitucionimportaciones'";
            if ($parametros->totalOACE > 0) {
                $cadenaWHERE .= " AND os.idorganosatisface IN ("
                        . $parametros->arrayidoaceUnidimensional . ")";
            }
        }


        $cadenaWHERE .= "  AND p.idejercicio = " . $parametros->idejercicio;
        if ($parametros->idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $parametros->idejercicio
            ) {
                $cadenaWHERE .= "  AND i.estado = " . 1;
            }
        }
        //filtro por centros de balance
        if (isset($parametros->arrayidcentrosbalance[0])) {
            $cadenaJOIN
                    .= " INNER JOIN mod_planificacion.dat_indicadorcentrobalance icb
                ON icb.idindicador = i.idindicador
							INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
							ON edn.identidaddatosnomenclador = icb.identidaddatosnomenclador
							INNER JOIN mod_estructuracomp.dat_estructura e
							ON e.idestructura = edn.identidad";
            $cadenaWHERE .= " AND edn.identidad IN("
                    . $parametros->arrayidcentrobalanceUnidimensional . ")";
        }

        //filtro por organos demandates(preguntarle a galban la duda si CB = OD en algun momento)
        if (isset($parametros->arrayidorganos[0])) {
            $cadenaWHERE .= " AND em.identidad IN("
                    . $parametros->arrayidorganosUnidimensional . ")";
        }

        //filtro por nivel arbol
        if ($parametros->idnivel) {
            $cadenaWHERE .= " AND i.nivel= " . $parametros->idnivel;
        }

        //filtro por planes
        if ($parametros->totalplanes > 0) {
            $cadenaWHERE .= ' AND m.idmodelo IN('
                    . $parametros->arrayunidimensionalIdplan . ') ';
        }

        //filtro por codigo
        if ($parametros->codigo != null) {
            $cadenaWHERE .= " AND upper(i.codigo) LIKE '%" . strtoupper(
                            $parametros->codigo
                    ) . "%' ";
        }

        //filtro por numero pieza
        if ($parametros->numpieza != null) {
            $cadenaWHERE .= " AND upper(i.numeropieza) LIKE '%" . strtoupper(
                            $parametros->numpieza
                    ) . "%' ";
        }

        //filtro por denominacion
        if ($parametros->denominacion != null) {
            $cadenaWHERE .= " AND upper(i.denominacion) LIKE '%" . strtoupper(
                            $parametros->denominacion
                    ) . "%' ";
        }

        //termina la sentencia obligatoria
        $cadenaWHERE
                .= " GROUP BY i.idindicador,p.precio,i.codigo,
            i.denominacion,u.denominacionunidadmedida,indplanif.flete,indplanif.contingencia,
						os.idorganosatisface";

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    /* private function addWhereConParams(&$where, &$paramsQuery, $columCond,
      $param
      )
      {
      $where .= " AND " . $columCond;
      $paramsQuery[] = $param;
      } */

    public function obtPlanesRepBal($parametros) {
        $datosNomGastos = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        'planmaterial'
        );
        $query = new Doctrine_Query();
        if ($parametros->balancear == 'true') {
            $query->addWhere('planif.cantidad > 0');
            $model = $query->select(
                            'mod.idmodelo,mod.uriruta,mod.denominacion,
                em.identidadmodelo as identidadmodelo ,
                em.prioridad as prioridad, em.identidad as identidad'
                    )
                    ->from('DatModelo mod')->innerJoin('mod.DatEntidadmodelo em')
                    ->leftJoin('em.DatPlanificacion planif')
                    ->whereIn('planif.idcentrobalance', $parametros->idcentrosb)
                    ->addWhere(
                            'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador'] . '-%',
                        $parametros->idejercicio)
                    )->orderby('em.prioridad')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                    ->execute();
        } else {
            if ($parametros->comportamiento != 2) {
                $query->addWhere('planif.cantidad > 0');
                $model = $query->select(
                                'mod.idmodelo,mod.uriruta,mod.denominacion,
                    em.identidadmodelo as identidadmodelo ,
                    em.prioridad as prioridad, em.identidad as identidad'
                        )->from('DatModelo mod')->innerJoin('mod.DatEntidadmodelo em')
                        ->leftJoin('em.DatPlanificacion planif')
                        ->whereIn('em.identidad', $parametros->hijosentidad)
                        ->whereIn(
                                'planif.idcentrobalance', $parametros->paraobtplanes
                        )->addWhere(
                                'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador'] . '-%',
                            $parametros->idejercicio)
                        )->orderby('em.prioridad')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
            } else {
                $query->addWhere('planif.cantidad > 0');
                $model = $query->select(
                                'mod.idmodelo,mod.uriruta,mod.denominacion,
                    em.identidadmodelo as identidadmodelo ,
                    em.prioridad as prioridad, em.identidad as identidad'
                        )->from('DatModelo mod')->innerJoin('mod.DatEntidadmodelo em')
                        ->leftJoin('em.DatPlanificacion planif')
                        ->whereIn('em.identidad', $parametros->hijosentidad)
                        ->addWhere(
                                'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador'] . '-%',
                            $parametros->idejercicio)
                        )->orderby('em.prioridad')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                        ->execute();
            }
        }
        return $model;
    }

    public function obtPlanesRepAjuste($parametros) {
        $datosNomGastos = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        'planmaterial'
        );
        $query = new Doctrine_Query();
        $query->addWhere('planif.cantidad > 0');
        $model = $query->select(
                        'mod.idmodelo,mod.uriruta,mod.denominacion,
            em.identidadmodelo as identidadmodelo ,
            em.prioridad as prioridad, em.identidad as identidad'
                )->from('DatModelo mod')->innerJoin('mod.DatEntidadmodelo em')
                ->leftJoin('em.DatPlanificacion planif')
                ->whereIn('em.identidad', $parametros->hijosentidad)
                ->addWhere(
                        'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador'] . '-%',
                    $parametros->idejercicio)
                )->orderby('em.prioridad')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();
        return $model;
    }

    public function obtPlanesRepDifPrecio($parametros, $idejercicio) {
        $datosNomGastos = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        'planmaterial'
        );
        $query = new Doctrine_Query();
        $query->addWhere('planif.cantidad > 0');
        $model = $query->select(
                        'mod.idmodelo,mod.uriruta,mod.denominacion,
            em.identidadmodelo as identidadmodelo ,
            em.prioridad as prioridad, em.identidad as identidad'
                )->from('DatModelo mod')->innerJoin('mod.DatEntidadmodelo em')
                ->leftJoin('em.DatPlanificacion planif')
                ->whereIn('em.identidad', $parametros->hijosentidad)
                ->addWhere(
                        'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador'] . '-%',
                    $idejercicio)
                )->orderby('em.prioridad')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $model;
    }

    public function obtImportesIniFinAjuste($parametros) {

        $query = new Doctrine_Query();
        if ($parametros->arrayviasadquisicion[0]->idvia != null && $parametros->arrayviasadquisicion[0]->idvia != ''
        ) {
            $query->whereIn('iva.idviaadquisicion', $parametros->arrayidvias);
        }

        $model = $query->select(
                                'sum(planif.importe/1000) as importeincial,
            sum((planif.ajuste*planif.precio)/1000) as ajuste,
            sum( (planif.importe + (planif.ajuste * planif.precio))/1000 ) as importefinal'
                        )->from('DatPlanificacion planif')->innerJoin('planif.DatEntidadmodelo em')
                        ->innerJoin('em.DatModelo mod')->innerjoin('planif.NomIndicador ind')
                        ->innerjoin('ind.DatIndicadorviaadquisicion iva')
                        ->whereIn('em.identidad', $parametros->hijosentidad)
                        ->addWhere('mod.idmodelo = ?', $parametros->idplan)
                        ->addWhere('planif.idejercicio = ?', $parametros->idejercicio)
                        ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $model;
    }

    public function obtIndicadoresDiferenciaPrecio($parametros, $idejercicio) {
        if (isset($parametros->hijosentidad[0])) {
            $entidades = implode(',', $parametros->hijosentidad);
        }
        if (isset($parametros->idcentrosb[0])) {
            $centrobalance = implode(',', $parametros->idcentrosb);
        }
        $addwhere = " ";
        $innerJoin = " ";
        if (isset($parametros->arrayidplan[0])) {
            $arrayidplan = implode(',', $parametros->arrayidplan);
            $addwhere .= " AND em.idmodelo IN($arrayidplan) ";
        }
        if (isset($parametros->arrayidoace[0])) {
            $innerJoin
                    .= " INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva
                ON iva.idindicador = ind.idindicador
		        INNER JOIN mod_planificacion.dat_indicadorviaadquisicionorganosatisface ivos
		        ON ivos.idindicador = iva.idindicador
		         INNER JOIN mod_planificacion.nom_organosatisface os
		         ON os.idorganosatisface = ivos.idorganosatisface ";
            $addwhere .= " AND os.idorganosatisface IN($parametros->arrayidoace) ";
        }
        if ($parametros->codigo) {
            $addwhere .= " AND upper(ind.codigo) LIKE '%" . strtoupper(
                            $parametros->codigo
                    ) . "%' ";
        }
        if ($parametros->numpieza) {
            $addwhere .= " AND upper(ind.numeropieza) LIKE '%" . strtoupper(
                            $parametros->numpieza
                    ) . "%' ";
        }
        if ($parametros->denominacion) {
            $addwhere .= " AND upper(ind.denominacion) LIKE '%" . strtoupper(
                            $parametros->denominacion
                    ) . "%' ";
        }

        $conn = Doctrine_Manager::connection();
        $query = "  SELECT ind.codigo as codigo, 
                           ind.denominacion as denominacion,
                            round(((planif.cantidad + planif.ajuste) * planif.precio) +
                            ((planif.cantidad + planif.ajuste) * planif.precio * indplanif.flete / 100) + 
                            ((planif.cantidad + planif.ajuste) * planif.precio * indplanif.contingencia / 100), 3) as importe,
                           planif.precio as precio,
                           planif.cantidad + planif.ajuste as cantidad, 
                           um.abreviaturaunidadmedida as unimed
                         FROM mod_planificacion.dat_planificacion planif 
                            INNER JOIN mod_datosmaestros.nom_indicador ind
                            ON (planif.idindicador = ind.idindicador)
                                INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif
                            ON (indplanif.idindicador = ind.idindicador)
                               INNER JOIN mod_planificacion.dat_entidadmodelo em
                               ON planif.identidadmodelo = em.identidadmodelo
                                  INNER JOIN mod_datosmaestros.nom_unidadmedida um
                                  ON planif.idunidadmedida = um.idunidadmedida
                                     $innerJoin
                        WHERE planif.idcentrobalance IN($centrobalance) and planif.idejercicio = $idejercicio and em.identidad IN($entidades)
                                          $addwhere";
        $dato = $conn->execute($query);
        $datos = $dato->fetchAll();

        return $datos;
    }

    public function obtenerIndicadoresReporteBalanceCB($parametros) {

        //obteniendo la cadena de iddatosnomenclador de los cb a filtrar
        //dependiendo de la seleccion o de la entidad logueada
        if ($parametros->idcentrosb[0]->idcentrobalance != null) {
            foreach ($parametros->idcentrosb as $p => $s) {
                $idcentrosb[$p] = $s->idcentrobalance;
            }
        } else {
            if ($parametros->esrector != 'true') {
                $idcentrosb[] = $parametros->identidadlog;
            } else {
                $arrcb = DatEntidaddatosnomenclador::getCB();
                foreach ($arrcb as $p => $s) {
                    $idcentrosb[$p] = $s['identidad'];
                }
            }
        }
        $entidaddatosnom = DatEntidaddatosnomenclador::getIdsDatosNomemclador(
                        $idcentrosb
        );
        foreach ($entidaddatosnom as $p => $s) {
            $entidaddatosnom[$p] = $s['identidaddatosnomenclador'];
        }

        //obteniendo la cadena de identidades de los od a filtrar
        //dependiendo de la seleccion o de la entidad logueada
        $espcompcb = 0;
        if ($parametros->esrector == 'true') {
            if ($parametros->comportamiento == 2) {
                $arrayorganosdemandantes = DatEntidaddatosnomenclador::obtenerEntidadRectora();
                if (isset($arrayorganosdemandantes[0])) {
                    $excluir = array(7,8,9,10);
                    $arrayorganosdemandantes = $parametros->integ->metadatos->DameHijosEstructura(
                            $arrayorganosdemandantes[0]['identidad'],$excluir
                    );
                }
                foreach ($arrayorganosdemandantes as $key => $k) {
                    $parametros->hijosentidad[$key] = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                    $k->idestructura
                    );
                }
            } else {
                $espcompcb = 3;
                $parametros->hijosentidad = self::obtenerEntidadesQueDemandanByIdCentrosB(
                                $entidaddatosnom
                );
            }
        } else {
            $espcompcb = 2;
            if ($parametros->comportamiento == 2) {
                $parametros->hijosentidad = DatActividadentidad::auxObtenerEntidadesHijasComun(
                                $parametros->identidadlog
                );
                array_push(
                        $parametros->hijosentidad, $parametros->identidadlog
                );
            } else {
                $par['identidadlog'] = $parametros->identidadlog;
                $objrec = new RecuperacionesModel();
                $parametros->hijosentidad = $objrec->EntidadesQueDemandanAUnCB(
                        $par
                );
            }
        }

        $identdem = array();
        if ($espcompcb != 2 && $espcompcb != 3) {
            foreach ($parametros->hijosentidad as $p => $s) {
                $identdem = array_merge($identdem, $s);
            }
        } else {
            if ($espcompcb == 3) {
                foreach ($parametros->hijosentidad as $p => $s) {
                    $identdem[$p] = $s['identidad'];
                }
            } else {
                $identdem = $parametros->hijosentidad;
            }
        }

        //obteniendo la cadena de idmodelos  a filtrar
        $query = new Doctrine_Query();
        $datosNomGastos = NomDatosnomenclador::getDatosNomPorUriDatosNom(
                        'planmaterial'
        );
        $query->addWhere('planif.cantidad >0');
        $model = $query->select(
                        'mod.idmodelo, mod.uriruta, mod.denominacion,
            em.identidadmodelo as identidadmodelo, em.prioridad as prioridad'
                )->from('DatModelo mod')->innerJoin('mod.DatEntidadmodelo em')
                ->leftJoin('em.DatPlanificacion planif')->whereIn('em.identidad', $identdem)
                ->whereIn('planif.idcentrobalance', $entidaddatosnom)
                ->addWhere(
                        'mod.uriruta like ? and planif.idejercicio = ?', array($datosNomGastos[0]['iddatosnomenclador'] . '-%',
                    $parametros->idejercicio)
                )->orderby('em.prioridad')->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        $idmodelo = array();

        foreach ($model as $p => $s) {
            $idmodelo[$p] = $s['idmodelo'];
        }

        //$entidaddatosnom es un arreglo que guarda los iddatosnomenclador de los cb cuando 
        //el comportamiento es cb como para balancear el comportamiento tiene que ser cb nunca estara indefinido
        $entidaddatosnom = implode(', ', $entidaddatosnom);

        //$identdem es un arreglo que guarda los identidad de los od para los dos comportamientos 
        //nunca esta indefinido
        $identdem = implode(', ', $identdem);

        //$idmodelo es un arreglo que guarda los idmodelos de los modelos  
        //nunca esta indefinido
        $idmodelo = implode(', ', $idmodelo);


        $conn = Doctrine_Manager::connection();

        $identidadmodelo = DatEntidadmodelo::getIdentidadmodelo(
                        $parametros->idmodelo, $parametros->idcentrob
        );
        $parametros->identidadmodelo = $identidadmodelo[0]['identidadmodelo'];

        $entidaddatosnom = DatEntidaddatosnomenclador::getIdDatosNom(
                        $parametros->idcentrob
        );
        $parametros->identidaddatosnomenclador = $entidaddatosnom[0]['identidaddatosnomenclador'];


        $paramsQuery = array();
        $myentidad = $parametros->idcentrob;
        $mymodelo = $parametros->idmodelo;
        $myentdatnom = $parametros->identidaddatosnomenclador;

        $addwhere = "";
        $foo = " Where true  ";
        $addHaving = "Having true ";
        $consultageneral = "SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
               foo.numeropieza,foo.denominacion,foo.denominacioncb,
               foo.coberturatotalestimada,foo.viaadquisicion,foo.organosatisface,
               SUM(foo.necesidad) as necesidadod,COALESCE((SELECT idaprobacion
               FROM mod_planificacion.dat_ajusteexistenciacb WHERE identidad = $myentidad
               AND idmodelo = $mymodelo AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . "),1) as idaprobacion,
              SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
              FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
              AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") as necesidad,
              (SELECT COALESCE(SUM(coberturaparcialestimada),0)
               FROM mod_planificacion.dat_ajusteexistenciacb aecb
              WHERE identidad = $myentidad AND idmodelo = $mymodelo
              AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") as coberturaparcialestimada,
              SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
              FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
              AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") -
              (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
              COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
			  FROM mod_planificacion.dat_ajusteexistenciacb aecb
			  WHERE identidad = $myentidad AND idmodelo = $mymodelo
			  AND idindicador = foo.idindicador
			  AND idejercicio = " . $parametros->idejercicio . "),0)) as demanda,
			 (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
             FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
             AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") -
			(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
			COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
			FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
			AND idmodelo = $mymodelo AND idindicador = foo.idindicador
			AND idejercicio = " . $parametros->idejercicio . "),0))) * foo.precio as importe,
           (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
            FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
            AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") -
			(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
			COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
			FROM mod_planificacion.dat_ajusteexistenciacb aecb
			WHERE identidad = $myentidad AND idmodelo = $mymodelo
			AND idindicador = foo.idindicador AND idejercicio = " . $parametros->idejercicio . "),0))) *
			foo.preciodivisa as importemlc,((SUM(foo.necesidad)
			- (SELECT COALESCE(SUM(cpe),0) as cpe FROM mod_planificacion.dat_odcte odcte
           WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ")
            - (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
			COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
			FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
			AND idmodelo = $mymodelo AND idindicador = foo.idindicador
			AND idejercicio = " . $parametros->idejercicio . "),0))) * precio) *
			(foo.flete)/100 as flete, ((SUM(foo.necesidad)
			- (SELECT COALESCE(SUM(cpe),0) as cpe FROM mod_planificacion.dat_odcte odcte
            WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") -
			(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
			COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
			FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
			AND idmodelo = $mymodelo AND idindicador = foo.idindicador
			AND idejercicio = " . $parametros->idejercicio . "),0))) * precio) *
			(foo.contingencia)/100 as contingencia,(SUM(foo.necesidad)
			- (SELECT COALESCE(SUM(cpe),0) as cpe FROM mod_planificacion.dat_odcte odcte
			WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
			AND idejercicio = " . $parametros->idejercicio . ") -
			(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
			COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
			FROM mod_planificacion.dat_ajusteexistenciacb aecb
			WHERE identidad = $myentidad AND idmodelo = $mymodelo AND idindicador = foo.idindicador
			AND idejercicio = " . $parametros->idejercicio . "),0))) * foo.precio +
			((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
			FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
			AND idindicador = foo.idindicador AND idejercicio = " . $parametros->idejercicio . ") -
			(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
			COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
			FROM mod_planificacion.dat_ajusteexistenciacb aecb
			WHERE identidad = $myentidad AND idmodelo = $mymodelo
			AND idindicador = foo.idindicadorAND idejercicio =
			" . $parametros->idejercicio . "),0))) * precio) *(foo.flete)/100 +
			((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
			FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
			AND idindicador = foo.idindicador AND idejercicio = " . $parametros->idejercicio . ") -
			(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
			COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
			FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
			AND idmodelo = $mymodelo AND idindicador = foo.idindicador
			AND idejercicio = " . $parametros->idejercicio . "),0))) * precio) *
			(foo.contingencia)/100 as importefila FROM (SELECT i.idindicador,
             i.codigo,i.precio,i.preciodivisa,i.numeropieza,i.denominacion,
             i.flete,i.contingencia,e.denominacion as denominacioncb,
             SUM(p.cantidad) as necesidad,ae.coberturatotalestimada as coberturatotalestimada,
            (SELECT va.denominacion FROM mod_planificacion.nom_viaadquisicion va
             INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva
             on va.idviaadquisicion = iva.idviaadquisicion
            WHERE iva.idindicador = i.idindicador limit 1) as viaadquisicion,
            (SELECT os.denominacion FROM mod_planificacion.dat_indicadorviaadquisicion iva
             INNER JOIN  mod_planificacion.dat_indicadorviaadquisicionorganosatisface ivaos
             on (iva.idindicador = ivaos.idindicador
             AND iva.idviaadquisicion = ivaos.idviaadquisicion)
             INNER JOIN mod_planificacion.nom_organosatisface os
             on ivaos.idorganosatisface = os.idorganosatisface
             WHERE iva.idindicador = i.idindicador limit 1) as organosatisface
              FROM mod_planificacion.dat_planificacion p
              INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
             INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
              on p.idcentrobalance = edn.identidaddatosnomenclador
              INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
              INNER JOIN mod_planificacion.dat_entidadmodelo em
               on p.identidadmodelo = em.identidadmodelo
               LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae
              on (p.idindicador = ae.idindicador AND ae.identidad = $myentidad)
              LEFT JOIN mod_planificacion.dat_odcte odcte
              on (i.idindicador = odcte.idindicador AND odcte.identidad= em.identidad
              AND em.idmodelo = odcte.idmodelo) WHERE em.idmodelo = $mymodelo
              AND p.idejercicio = " . $parametros->idejercicio . " AND i.estado=1
              AND p.idcentrobalance = $myentdatnom $addwhere
              Group by i.idindicador,i.codigo,i.precio,i.preciodivisa,i.numeropieza,
              i.flete,i.contingencia,i.denominacion,e.denominacion,ae.coberturatotalestimada
              order by i.codigo) as foo $foo Group by foo.idindicador,foo.codigo,
              foo.precio,foo.preciodivisa,foo.numeropieza,foo.flete,foo.contingencia,
              foo.denominacion,foo.denominacioncb,foo.coberturatotalestimada,
              foo.viaadquisicion,foo.organosatisface $addHaving order by foo.codigo ";

        //ejecutando la consulta general
        $res = $conn->execute($consultageneral, $paramsQuery);
        $arrayindicadores = $res->fetchAll(PDO::FETCH_ASSOC);

        $consultatotalimportes = "SELECT SUM(pru.importeMN) as importeMN,SUM(pru.importemlc) as importemlc,
SUM(pru.importeflete) as importeflete,SUM(pru.importecontingencia) as importecontingencia,
SUM(pru.importetotal) as importetotal,SUM(pru.importenecesidad) as importenecesidad,
sum(pru.importeajustado) as importeajustado,COUNT(pru.idindicador) as total
FROM(SELECT foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,foo.numeropieza,
    foo.denominacion,foo.denominacioncb,foo.coberturatotalestimada,foo.viaadquisicion,
    foo.organosatisface,SUM(foo.necesidad) as necesidadod,(SELECT idaprobacion
FROM mod_planificacion.dat_ajusteexistenciacb WHERE identidad = $myentidad AND idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = " . $parametros->idejercicio . ") as idaprobacion,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") as necesidad,
(SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") as coberturaparcialestimada,
SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") -
SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros->idejercicio . "),0)) as demanda,
(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros->idejercicio . "),0))) * foo.precio as importeMN,
(SELECT COALESCE(SUM(coberturaparcialestimada),0)  FROM mod_planificacion.dat_ajusteexistenciacb aecb
WHERE identidad = $myentidad AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros->idejercicio . ")  * foo.precio +
(SELECT COALESCE(SUM(coberturaparcialestimada),0) FROM mod_planificacion.dat_ajusteexistenciacb aecb
 WHERE identidad = $myentidad AND idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ")  * foo.precio * (foo.flete)/100 +
(SELECT COALESCE(SUM(coberturaparcialestimada),0)
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ")  * foo.precio * (foo.contingencia)/100 as importeajustado,
(SUM(foo.necesidad)) * foo.precio + (SUM(foo.necesidad)) * foo.precio * (foo.flete)/100 +
(SUM(foo.necesidad)) * foo.precio * (foo.contingencia)/100 as importenecesidad,
(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
 FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") -
(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
FROM mod_planificacion.dat_ajusteexistenciacb aecb WHERE identidad = $myentidad
AND idmodelo = $mymodelo AND idindicador = foo.idindicador
AND idejercicio = " . $parametros->idejercicio . "),0))) *foo.preciodivisa as importemlc,
((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
FROM mod_planificacion.dat_odcte odcte WHERE idmodelo = $mymodelo
AND idindicador = foo.idindicador AND idejercicio = "
                . $parametros->idejercicio . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
					COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros->idejercicio . "),0))) * precio) *
					(foo.flete)/100 as importeflete,
                                            
                    ((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe 
                            FROM mod_planificacion.dat_odcte odcte

                            WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
                                            AND idejercicio = "
                . $parametros->idejercicio . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
					COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros->idejercicio . "),0))) * precio) *
					(foo.contingencia)/100 as importecontingencia,

					(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe 
					FROM mod_planificacion.dat_odcte odcte	

					WHERE idmodelo = $mymodelo AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros->idejercicio . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
					COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros->idejercicio . "),0))) * foo.precio +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe 
					FROM mod_planificacion.dat_odcte odcte	

					WHERE idmodelo = $mymodelo 	AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros->idejercicio . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
					COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros->idejercicio . "),0))) * precio) *
					 (foo.flete)/100 +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe 
					FROM mod_planificacion.dat_odcte odcte	

					WHERE idmodelo = $mymodelo 	AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros->idejercicio . ") -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) +
					 COALESCE(reservaministerial,0) + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myentidad AND idmodelo = $mymodelo
					AND idindicador = foo.idindicador
					AND idejercicio = " . $parametros->idejercicio . "),0))) * precio) *
					(foo.contingencia)/100 as importetotal

                    FROM (SELECT i.idindicador,i.codigo,i.precio,i.preciodivisa,
                            i.numeropieza,i.denominacion,i.flete,i.contingencia,
                            e.denominacion as denominacioncb, SUM(p.cantidad) as necesidad,
                            ae.coberturatotalestimada as coberturatotalestimada ,
                             (SELECT va.denominacion
                             FROM mod_planificacion.nom_viaadquisicion va
                            INNER JOIN mod_planificacion.dat_indicadorviaadquisicion iva
                            on va.idviaadquisicion = iva.idviaadquisicion
                             WHERE iva.idindicador = i.idindicador limit 1) as viaadquisicion,

                            (SELECT os.denominacion
                            FROM mod_planificacion.dat_indicadorviaadquisicion iva
                            INNER JOIN  mod_planificacion.dat_indicadorviaadquisicionorganosatisface ivaos
                            on (iva.idindicador = ivaos.idindicador AND iva.idviaadquisicion = ivaos.idviaadquisicion)
                            INNER JOIN mod_planificacion.nom_organosatisface os
                            on ivaos.idorganosatisface = os.idorganosatisface
                            WHERE iva.idindicador = i.idindicador limit 1) as organosatisface

                            FROM mod_planificacion.dat_planificacion p
                            INNER JOIN mod_datosmaestros.nom_indicador i
                            on p.idindicador=i.idindicador
                            INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                            on p.idcentrobalance = edn.identidaddatosnomenclador
                            INNER JOIN mod_estructuracomp.dat_estructura e
                            on edn.identidad = e.idestructura
                            INNER JOIN mod_planificacion.dat_entidadmodelo em
                            on p.identidadmodelo = em.identidadmodelo
                            LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae
                            on (p.idindicador = ae.idindicador AND ae.identidad = $myentidad)
                            LEFT JOIN mod_planificacion.dat_odcte odcte
                             on (i.idindicador = odcte.idindicador
                             AND odcte.identidad= em.identidad AND em.idmodelo = odcte.idmodelo)

                            WHERE em.idmodelo = $mymodelo
                            AND p.idejercicio = 1
                            AND p.idcentrobalance = $myentdatnom
                            $addwhere
                            Group by i.idindicador,i.codigo,i.precio,i.preciodivisa,
                            i.numeropieza,i.flete,i.contingencia,i.denominacion,
                            e.denominacion,ae.coberturatotalestimada
                            order by i.codigo) as foo
                            $foo
                    Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.flete,foo.contingencia,foo.denominacion,
                    foo.denominacioncb,foo.coberturatotalestimada,foo.viaadquisicion,
                    foo.organosatisface $addHaving order by foo.codigo) as pru";
        //ejecutando la consulta del total
        $total = $conn->execute($consultatotalimportes, $paramsQuery);
        $totales = $total->fetchAll(PDO::FETCH_ASSOC);
        $resultado['datos'] = $arrayindicadores;
        $resultado['total'] = $totales[0]['total'];
        $resultado['importetotal'] = $totales[0]['importetotal'];
        $resultado['importeflete'] = $totales[0]['importeflete'];
        $resultado['importecontingencia'] = $totales[0]['importecontingencia'];
        $resultado['importenecesidad'] = $totales[0]['importenecesidad'];
        $resultado['importeajustado'] = $totales[0]['importeajustado'];
        $resultado['importemn'] = $totales[0]['importemn'];
        $resultado['importemlc'] = $totales[0]['importemlc'];

        return $resultado;
    }

    public function obtenerIndicadoresReporteDemandaPlanInversiones($parametros) {
        $idejercicio = $parametros->idejercicio;
        $cadenaWHEREEjercicio = "";
        if ($idejercicio == null) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            $idejercicio = $arrayIdejercicio[0]['idejercicio'];
        }


        if ($idejercicio) {
            $arrayIdejercicio = NomEjercicioplanificacion::listarEjercicioActual();
            if ($arrayIdejercicio[0]['idejercicio'] == $idejercicio) {
                /* $cadenaWHEREEjercicio = ' AND i.estado=1 AND p.idejercicio='
                  . $idejercicio . ' AND i.nivel=1  AND indplanif.idaprobacion > 2'; */
                $cadenaWHEREEjercicio = ' AND i.estado=1 AND p.idejercicio='
                        . $idejercicio . ' AND indplanif.idaprobacion > 2';
            }
        }
        $cadenaQUERY = 'SELECT i.idindicador,round(p.precio, 3) as precio,i.codigo,
            i.denominacion as nombreindicador,u.denominacionunidadmedida as nombreum, 
            SUM( p.cantidad+p.ajuste) as cantidad,
        round((SUM( p.cantidad+p.ajuste)*p.precio), 3) AS importemn,
        round(((SUM(p.cantidad + p.ajuste) * p.precio) * indplanif.flete / 100), 3) AS importefs,
        round(((SUM(p.cantidad + p.ajuste) * p.precio) * indplanif.contingencia / 100), 3) AS importecont,
               round((SUM(p.cantidad+p.ajuste)*p.precio) +
       ((SUM(p.cantidad+p.ajuste)*p.precio) * indplanif.flete / 100) + 
       ((SUM(p.cantidad+p.ajuste)*p.precio) * indplanif.contingencia / 100), 3) as importetotal,
       
        os.denominacion AS organosatisface, e.denominacion AS centrobalance,
        e1.denominacion AS organodemandante,i.numeropieza AS numeropieza,
        (SELECT va.denominacion FROM mod_datosmaestros.dat_indicadorviaadquisicion iva
        INNER JOIN mod_datosmaestros.nom_viaadquisicion va
        ON (iva.idviaadquisicion = va.idviaadquisicion)
        WHERE iva.idindicador = i.idindicador AND iva.idviaadquisicion IN('
                . $parametros->arrayidviasUnidimensional
                . ') limit 1) AS viaadquisicion';
        $cadenaJOIN = ' FROM mod_datosmaestros.nom_indicador i
            INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif ON indplanif.idindicador = i.idindicador
        LEFT JOIN mod_planificacion.dat_planificacion p
        ON i.idindicador = p.idindicador
        LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicion iva
        ON iva.idindicador = i.idindicador
        LEFT JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivos
        ON (ivos.idindicador = iva.idindicador
        AND ivos.idviaadquisicion = iva.idviaadquisicion)
        
        LEFT JOIN mod_datosmaestros.nom_organosatisface os
        ON os.idorganosatisface = ivos.idorganosatisface
        
        LEFT JOIN mod_planificacion.dat_entidadmodelo em
        ON em.identidadmodelo = p.identidadmodelo
        LEFT JOIN mod_estructuracomp.dat_estructura e1
        ON e1.idestructura = em.identidad
        LEFT JOIN mod_planificacion.dat_modelo m
        ON m.idmodelo = em.idmodelo
        LEFT JOIN mod_datosmaestros.nom_unidadmedida u
        ON i.idumedida = u.idunidadmedida
        LEFT JOIN mod_planificacion.dat_odcte odcte
        ON (odcte.identidad = em.identidad
        AND odcte.idmodelo = em.idmodelo and i.idindicador = odcte.idindicador)';

        if ($parametros->origenreporte == 1) { //para mostrar el reporte fisico
            $cadenaWHERE = ' WHERE m.idmodelo = ' . $parametros->idplan . '
            AND iva.idviaadquisicion = (SELECT va.idviaadquisicion
            FROM mod_datosmaestros.dat_indicadorviaadquisicion iva
        INNER JOIN mod_datosmaestros.nom_viaadquisicion va
        ON (iva.idviaadquisicion = va.idviaadquisicion)
        WHERE iva.idindicador = i.idindicador AND iva.idviaadquisicion IN('
                    . $parametros->arrayidviasUnidimensional . ') limit 1) ';
        } else {
            $cadenaWHERE = ' WHERE m.idmodelo IN('
                    . $parametros->arrayidplanesUnidimensional . ') ';
        }
        //filtro por destinos
        //filtro por centros de balance
        if (isset($parametros->arrayidcentrosbalance[0])) {
            $comp = ' INNER';
            $cadenaWHERE .= ' AND edn.identidad IN('
                    . $parametros->arrayidcentrobalanceUnidimensional . ')';
        } else {
            $comp = ' LEFT';
        }
        $cadenaJOIN
                .= $comp
                . ' JOIN mod_datosmaestros.dat_indicadorcentrobalance icb
            ON icb.idindicador = i.idindicador'
                .
                $comp
                . ' JOIN mod_planificacion.dat_entidaddatosnomenclador edn
            ON edn.identidaddatosnomenclador = icb.identidaddatosnomenclador '
                .
                $comp
                . ' JOIN mod_estructuracomp.dat_estructura e
            ON e.idestructura = edn.identidad';

        //filtro por organos demandates(preguntarle a galban la duda si CB = OD en algun momento)

        $cadenaWHERE .= $cadenaWHEREEjercicio;
        if (isset($parametros->arrayidorganos[0])) {
            $cadenaWHERE .= ' AND em.identidad IN('
                    . $parametros->arrayidorganosUnidimensional . ')';
        }

        //filtro por nivel arbol
        if ($parametros->idnivel != "") {
            $cadenaWHERE .= ' AND i.nivel = ' . $parametros->idnivel;
        }

        //filtro por codigo
        if ($parametros->codigo != null) {
            $cadenaWHERE .= " AND upper(i.codigo) LIKE '%" . strtoupper(
                            $parametros->codigo
                    ) . "%' ";
        }

        //filtro por numero pieza
        if ($parametros->numpieza != null) {
            $cadenaWHERE .= " AND upper(i.numeropieza) LIKE '%" . strtoupper(
                            $parametros->numpieza
                    ) . "%' ";
        }

        //filtro por denominacion
        if ($parametros->denominacion != null) {
            $cadenaWHERE .= " AND upper(i.denominacion) LIKE '%" . strtoupper(
                            $parametros->denominacion
                    ) . "%' ";
        }

        //termina la sentencia obligatoria
        $cadenaWHERE
                .= 'GROUP BY i.idindicador,p.precio,i.codigo,i.denominacion,u.denominacionunidadmedida,
            m.denominacion,indplanif.flete,indplanif.contingencia,os.denominacion,e.denominacion,
        i.numeropieza,e1.denominacion,(SELECT va.idviaadquisicion
        FROM mod_datosmaestros.dat_indicadorviaadquisicion iva
        INNER JOIN mod_datosmaestros.nom_viaadquisicion va
        ON (iva.idviaadquisicion = va.idviaadquisicion)
        WHERE iva.idindicador = i.idindicador AND iva.idviaadquisicion IN('
                . $parametros->arrayidviasUnidimensional . ') limit 1)
        ORDER BY m.denominacion';
        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerPlanesPorEjercicioTipoGasto($parametros) {
        $cadena = "SELECT distinct(m.idmodelo),m.idmodelo,m.denominacion,
mdn.iddatosnomenclador,dn.uridatosnomenclador
						FROM mod_planificacion.dat_modelo m
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.idmodelo = m.idmodelo
						INNER JOIN mod_planificacion.dat_planificacion p
						ON p.identidadmodelo = em.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelodatosnomenclador mdn
						ON mdn.idmodelo = m.idmodelo
						INNER JOIN mod_planificacion.nom_datosnomenclador dn
						ON dn.iddatosnomenclador = mdn.iddatosnomenclador
						WHERE  p.idejercicio = " . $parametros->idejercicio
                . " AND dn.uridatosnomenclador IN('"
                . $parametros->arrayunidimensionalUritipogasto . "')";
        //die($cadena);
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerPlanesPorEjercicioTipoGastoReporte_3($parametros) {
        $cadena = "SELECT distinct(m.idmodelo),m.idmodelo,m.denominacion,
mdn.iddatosnomenclador,dn.uridatosnomenclador
						FROM mod_planificacion.dat_modelo m
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.idmodelo = m.idmodelo
						INNER JOIN mod_planificacion.dat_planificacion p
						 ON p.identidadmodelo = em.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelodatosnomenclador mdn
						ON mdn.idmodelo = m.idmodelo
						INNER JOIN mod_planificacion.nom_datosnomenclador dn
						ON dn.iddatosnomenclador = mdn.iddatosnomenclador
						WHERE  (p.idejercicio = " . $parametros->idejercicio
                . "OR p.idejercicio = " . $parametros->idejercicioanterior
                . ") AND dn.uridatosnomenclador IN('"
                . $parametros->arrayunidimensionalUritipogasto . "')";
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerPlanesPorEjercicioTipoGastoUni($parametros) {
        $cadena = "SELECT distinct(m.idmodelo),m.idmodelo,m.denominacion
						FROM mod_planificacion.dat_modelo m
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.idmodelo = m.idmodelo
						INNER JOIN mod_planificacion.dat_planificacion p
						ON p.identidadmodelo = em.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelodatosnomenclador mdn
						ON mdn.idmodelo = m.idmodelo
						INNER JOIN mod_planificacion.nom_datosnomenclador dn
						ON dn.iddatosnomenclador = mdn.iddatosnomenclador
						WHERE  p.idejercicio = " . $parametros->idejercicio
                . " AND dn.uridatosnomenclador IN("
                . $parametros->arrayunidimensionalUritipogasto . ")";
        //die($cadena);
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function obtenerPlanesPorEjercicioTipoGastoUniAnterior($parametros) {
        $cadena = "SELECT distinct(m.idmodelo),m.idmodelo,m.denominacion
						FROM mod_planificacion.dat_modelo m
						INNER JOIN mod_planificacion.dat_entidadmodelo em
						ON em.idmodelo = m.idmodelo
						INNER JOIN mod_planificacion.dat_planificacion p
						ON p.identidadmodelo = em.identidadmodelo
						INNER JOIN mod_planificacion.dat_modelodatosnomenclador mdn
						ON mdn.idmodelo = m.idmodelo
						INNER JOIN mod_planificacion.nom_datosnomenclador dn
						ON dn.iddatosnomenclador = mdn.iddatosnomenclador
						WHERE  (p.idejercicio = " . $parametros->idejercicio
                . " OR p.idejercicio = " . $parametros->idejercicioante
                . ") AND dn.uridatosnomenclador IN("
                . $parametros->arrayunidimensionalUritipogasto . ")";
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        return $resultado;
    }

    public function consulta3_1($parametros, $ejercicio) {
        $cadenaQUERY = 'SELECT SUM(todo.total_importe) as total_importe
        FROM (SELECT i.idindicador, i.codigo, i.denominacion as denominacion_indicador,
         u.denominacionunidadmedida as UM, m.denominacion,
        SUM( p.cantidad) as total_cantidad, round((SUM( p.importe) +
        SUM( p.importe) * indplanif.flete/100 +
        SUM( p.importe) * indplanif.contingencia/100), 3) as total_importe,
        m.denominacion as Plan';

        $cadenaJOIN = ' FROM mod_planificacion.dat_planificacion p
                        INNER JOIN mod_datosmaestros.nom_indicador i
                        ON (i.idindicador = p.idindicador)
                        INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif
                      ON (i.idindicador = indplanif.idindicador)
                        INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb
                        ON (i.idindicador = icb.idindicador)
                        INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv
                        ON (i.idindicador = iv.idindicador)
                        INNER JOIN mod_datosmaestros.nom_viaadquisicion v
                        ON (iv.idviaadquisicion = v.idviaadquisicion)
                        INNER JOIN mod_datosmaestros.nom_unidadmedida u
                         ON (i.idumedida = u.idunidadmedida)
                        INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivos
                        ON (ivos.idindicador = i.idindicador AND ivos.idviaadquisicion = iv.idviaadquisicion)
                        INNER JOIN mod_datosmaestros.nom_organosatisface os
                        ON (ivos.idorganosatisface = os.idorganosatisface)
                        INNER JOIN mod_planificacion.dat_entidaddatosnomenclador ed
                        ON (icb.identidaddatosnomenclador = ed.identidaddatosnomenclador)
                        INNER JOIN mod_estructuracomp.dat_estructura e
                        ON (ed.identidad = e.idestructura)
                        INNER JOIN mod_planificacion.dat_entidadmodelo em
                         ON (p.identidadmodelo = em.identidadmodelo)
                        INNER JOIN mod_planificacion.dat_modelo m
                        ON (em.idmodelo = m.idmodelo)
                        INNER JOIN mod_planificacion.dat_modelodatosnomenclador md
                        ON (m.idmodelo = md.idmodelo)
                        INNER JOIN mod_planificacion.nom_datosnomenclador dn
                        ON (md.iddatosnomenclador = dn.iddatosnomenclador)';


        if ($parametros->origenreporte == 1) { //para mostrar el reporte fisico
            $cadenaWHERE = " WHERE  p.idejercicio = " . $ejercicio . " and
                m.idmodelo = " . $parametros->idplan . "
					AND lower(v.uriviaadquisicion) = lower('oace')
					AND lower(os.uriorganosatisface) = lower('mep')";
        } else {
            $cadenaWHERE = " WHERE p.idejercicio = " . $ejercicio . " and
                m.idmodelo IN(" . $parametros->arrayidplanesUnidimensional . ")
					AND lower(v.uriviaadquisicion) = lower('oace') 
					AND lower(os.uriorganosatisface) = lower('mep')";
        }
        //filtro para tipos de gasto del modelo
        if (isset($parametros->arraytipogastos[0])) {

            $cadenaWHERE .= " AND dn.uridatosnomenclador IN("
                    . $parametros->arrayunidimensionalUritipogasto . ")";
        }

        //filtro por centros de balance
        if (isset($parametros->arrayidcentrosbalance[0])) {
            $cadenaWHERE .= ' AND edn.identidad IN('
                    . $parametros->arrayidcentrobalanceUnidimensional . ')';
        }

        //filtro por organos demandates(preguntarle a galban la duda si CB = OD en algun momento)
        if (isset($parametros->arrayidorganos[0])) {
            $cadenaWHERE .= ' AND em.identidad IN('
                    . $parametros->arrayidorganosUnidimensional . ')';
        }

        //filtro por codigo
        if ($parametros->codigo != null) {
            $cadenaWHERE .= " AND upper(i.codigo) LIKE '%" . strtoupper(
                            $parametros->codigo
                    ) . "%' ";
        }

        //filtro por numero pieza
        if ($parametros->numpieza != null) {
            $cadenaWHERE .= " AND upper(i.numeropieza) LIKE '%" . strtoupper(
                            $parametros->numpieza
                    ) . "%' ";
        }

        //filtro por denominacion
        if ($parametros->denominacion != null) {
            $cadenaWHERE .= " AND upper(i.denominacion) LIKE '%" . strtoupper(
                            $parametros->denominacion
                    ) . "%' ";
        }


        //termina la sentencia obligatoria
        $cadenaWHERE
                .= 'GROUP BY i.idindicador, i.codigo, i.denominacion,
            u.denominacionunidadmedida, indplanif.flete, indplanif.contingencia, m.denominacion
        ORDER BY m.denominacion) as todo';

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        if ($resultado[0]['total_importe'] == null || $resultado[0]['total_importe'] == ''
        ) {
            return $resultadoAux = 0.00;
        } else {
            return $resultadoAux = $resultado[0]['total_importe'];
        }
    }

    public function consulta3_2($parametros, $ejercicio) {
        $cadenaQUERY = 'SELECT SUM(todo.total_importe) as total_importe
        FROM (SELECT i.idindicador, i.codigo, i.denominacion as denominacion_indicador,
        u.denominacionunidadmedida as UM, m.denominacion,
        SUM( p.cantidad) as total_cantidad, round((SUM( p.importe) +
        SUM( p.importe) * indplanif.flete/100 + SUM( p.importe) * indplanif.contingencia/100), 3) as total_importe,
         m.denominacion as Plan';

        $cadenaJOIN = ' FROM mod_datosmaestros.dat_planificacion p
                      INNER JOIN mod_datosmaestros.nom_indicador i
                      ON (i.idindicador = p.idindicador)
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif
                      ON (i.idindicador = indplanif.idindicador)
                      INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb
                      ON (i.idindicador = icb.idindicador)
                      INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv
                       ON (i.idindicador = iv.idindicador)
                      INNER JOIN mod_planificacion.nom_viaadquisicion v
                      ON (iv.idviaadquisicion = v.idviaadquisicion)
                      INNER JOIN mod_datosmaestros.nom_unidadmedida u
                      ON (i.idumedida = u.idunidadmedida)
                      INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivos
                       ON (ivos.idindicador = i.idindicador AND ivos.idviaadquisicion = iv.idviaadquisicion)
                      INNER JOIN mod_planificacion.nom_organosatisface os
                      ON (ivos.idorganosatisface = os.idorganosatisface)
                      INNER JOIN mod_planificacion.dat_entidaddatosnomenclador ed
                      ON (icb.identidaddatosnomenclador = ed.identidaddatosnomenclador)
                      INNER JOIN mod_estructuracomp.dat_estructura e
                      ON (ed.identidad = e.idestructura)
                      INNER JOIN mod_planificacion.dat_entidadmodelo em
                      ON (p.identidadmodelo = em.identidadmodelo)
                      INNER JOIN mod_planificacion.dat_modelo m ON (em.idmodelo = m.idmodelo)
                      INNER JOIN mod_planificacion.dat_modelodatosnomenclador md
                      ON (m.idmodelo = md.idmodelo)
                      INNER JOIN mod_planificacion.nom_datosnomenclador dn
                      ON (md.iddatosnomenclador = dn.iddatosnomenclador)';


        if ($parametros->origenreporte == 1) { //para mostrar el reporte fisico
            $cadenaWHERE = " WHERE p.idejercicio = " . $ejercicio . " and
                m.idmodelo = " . $parametros->idplan . "
					AND lower(v.uriviaadquisicion) IN
					(lower('sustitucionimportaciones'),lower('importacion directa'))";
        } else {
            $cadenaWHERE = " WHERE p.idejercicio = " . $ejercicio . " and
                m.idmodelo IN(" . $parametros->arrayidplanesUnidimensional . ")
					AND lower(v.uriviaadquisicion) IN
					(lower('sustitucionimportaciones'),lower('importacion directa'))";
        }
        //filtro para tipos de gasto del modelo
        if (isset($parametros->arraytipogastos[0])) {
            $cadenaWHERE .= " AND dn.uridatosnomenclador IN("
                    . $parametros->arrayunidimensionalUritipogasto . ")";
        }

        //filtro por centros de balance
        if (isset($parametros->arrayidcentrosbalance[0])) {

            $cadenaWHERE .= ' AND edn.identidad IN('
                    . $parametros->arrayidcentrobalanceUnidimensional . ')';
        }

        //filtro por organos demandates(preguntarle a galban la duda si CB = OD en algun momento)
        if (isset($parametros->arrayidorganos[0])) {
            $cadenaWHERE .= ' AND em.identidad IN('
                    . $parametros->arrayidorganosUnidimensional . ')';
        }

        //filtro por codigo
        if ($parametros->codigo != null) {
            $cadenaWHERE .= " AND upper(i.codigo) LIKE '%" . strtoupper(
                            $parametros->codigo
                    ) . "%' ";
        }

        //filtro por numero pieza
        if ($parametros->numpieza != null) {
            $cadenaWHERE .= " AND upper(i.numeropieza) LIKE '%" . strtoupper(
                            $parametros->numpieza
                    ) . "%' ";
        }

        //filtro por denominacion
        if ($parametros->denominacion != null) {
            $cadenaWHERE .= " AND upper(i.denominacion) LIKE '%" . strtoupper(
                            $parametros->denominacion
                    ) . "%' ";
        }


        //termina la sentencia obligatoria
        $cadenaWHERE
                .= 'GROUP BY i.idindicador, i.codigo, i.denominacion,
            u.denominacionunidadmedida, indplanif.flete, indplanif.contingencia, m.denominacion
        ORDER BY m.denominacion) as todo';

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        if ($resultado[0]['total_importe'] == null || $resultado[0]['total_importe'] == ''
        ) {
            return $resultadoAux = 0.00;
        } else {
            return $resultadoAux = $resultado[0]['total_importe'];
        }
    }

    public function consulta3_3($parametros, $ejercicio) {
        $cadenaQUERY = 'SELECT SUM(todo.total_importe) as total_importe
        FROM (SELECT i.idindicador, i.codigo, i.denominacion as denominacion_indicador,
        u.denominacionunidadmedida as UM, m.denominacion,SUM( p.cantidad) as total_cantidad,
        round((SUM( p.importe) + SUM( p.importe) * indplanif.flete/100 + SUM( p.importe)
        * indplanif.contingencia/100), 3) as total_importe,m.denominacion as Plan';
        $cadenaJOIN = '  FROM mod_planificacion.dat_planificacion p
                         INNER JOIN mod_datosmaestros.nom_indicador i
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif indplanif
                      ON (i.idindicador = indplanif.idindicador)
                         ON (i.idindicador = p.idindicador)
                         INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance icb
                         ON (i.idindicador = icb.idindicador)
                         INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv
                         ON (i.idindicador = iv.idindicador)
                         INNER JOIN mod_datosmaestros.nom_viaadquisicion v
                         ON (iv.idviaadquisicion = v.idviaadquisicion)
                         INNER JOIN mod_datosmaestros.nom_unidadmedida u
                         ON (i.idumedida = u.idunidadmedida)
                         INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivos
                         ON (ivos.idindicador = i.idindicador
                         AND ivos.idviaadquisicion = iv.idviaadquisicion)
                         INNER JOIN mod_datosmaestros.nom_organosatisface os
                         ON (ivos.idorganosatisface = os.idorganosatisface)
                         INNER JOIN mod_planificacion.dat_entidaddatosnomenclador ed
                         ON (icb.identidaddatosnomenclador = ed.identidaddatosnomenclador)
                         INNER JOIN mod_estructuracomp.dat_estructura e
                         ON (ed.identidad = e.idestructura)
                         INNER JOIN mod_planificacion.dat_entidadmodelo em
                         ON (p.identidadmodelo = em.identidadmodelo)
                         INNER JOIN mod_planificacion.dat_modelo m ON (em.idmodelo = m.idmodelo)
                         INNER JOIN mod_planificacion.dat_modelodatosnomenclador md
                         ON (m.idmodelo = md.idmodelo)
                         INNER JOIN mod_planificacion.nom_datosnomenclador dn
                         ON (md.iddatosnomenclador = dn.iddatosnomenclador)';


        if ($parametros->origenreporte == 1) { //para mostrar el reporte fisico
            $cadenaWHERE = " WHERE p.idejercicio = " . $ejercicio . " and
                m.idmodelo = " . $parametros->idplan . "
					AND lower(v.uriviaadquisicion) IN (lower('oace'))
					AND lower(os.uriorganosatisface) <> lower ('mep')";
        } else {
            $cadenaWHERE = " WHERE p.idejercicio = " . $ejercicio . " and
                m.idmodelo IN(" . $parametros->arrayidplanesUnidimensional . ")
					AND lower(v.uriviaadquisicion) IN (lower('oace'))
					AND lower(os.uriorganosatisface) <> lower ('mep')";
        }
        //filtro para tipos de gasto del modelo
        if (isset($parametros->arraytipogastos[0])) {
            $cadenaWHERE .= " AND dn.uridatosnomenclador IN("
                    . $parametros->arrayunidimensionalUritipogasto . ")";
        }

        //filtro por centros de balance
        if (isset($parametros->arrayidcentrosbalance[0])) {
            $cadenaWHERE .= ' AND edn.identidad IN('
                    . $parametros->arrayidcentrobalanceUnidimensional . ')';
        }

        //filtro por organos demandates(preguntarle a galban la duda si CB = OD en algun momento)
        if (isset($parametros->arrayidorganos[0])) {
            $cadenaWHERE .= ' AND em.identidad IN('
                    . $parametros->arrayidorganosUnidimensional . ')';
        }

        //filtro por codigo
        if ($parametros->codigo != null) {
            $cadenaWHERE .= " AND upper(i.codigo) LIKE '%" . strtoupper(
                            $parametros->codigo
                    ) . "%' ";
        }

        //filtro por numero pieza
        if ($parametros->numpieza != null) {
            $cadenaWHERE .= " AND upper(i.numeropieza) LIKE '%" . strtoupper(
                            $parametros->numpieza
                    ) . "%' ";
        }

        //filtro por denominacion
        if ($parametros->denominacion != null) {
            $cadenaWHERE .= " AND upper(i.denominacion) LIKE '%" . strtoupper(
                            $parametros->denominacion
                    ) . "%' ";
        }

        //termina la sentencia obligatoria
        $cadenaWHERE
                .= 'GROUP BY i.idindicador, i.codigo, i.denominacion,
            u.denominacionunidadmedida, i.flete, i.contingencia, m.denominacion
        ORDER BY m.denominacion) as todo';

        $cadena = $cadenaQUERY . $cadenaJOIN . $cadenaWHERE;
        $objconexion = Doctrine_Manager:: connection();
        $resultado = $objconexion->execute($cadena)->fetchAll();
        if ($resultado[0]['total_importe'] == null || $resultado[0]['total_importe'] == ''
        ) {
            return $resultadoAux = 0.00;
        } else {
            return $resultadoAux = $resultado[0]['total_importe'];
        }
    }

    public function obtenerEntidadesQueDemandanByIdCB($parametros) {
        $query = new Doctrine_Query();
        $result = $query->select('em.identidad')
                        ->from('DatEntidadmodelo em')->innerJoin('em.DatPlanificacion n')
                        ->where('n.idcentrobalance = ?', array($parametros))->fetchArray();
        return $result;
    }

    public function obtenerEntidadesQueDemandanByIdCentrosB($parametros) {
        $query = new Doctrine_Query();
        $result = $query->select('DISTINCT em.identidad')
                        ->from('DatEntidadmodelo em')->innerJoin('em.DatPlanificacion n')
                        ->whereIn('n.idcentrobalance', $parametros)->fetchArray();
        return $result;
    }

    public static function validarExistenciaDatos($idejercicio, $entidades) {
        //Devolviendo la cantidad.
        return Doctrine_Query::create()->select(
                                'COUNT(p.idplanificacion) AS cantidad'
                        )->from('DatPlanificacion p')
                        ->innerjoin('p.DatEntidadmodelo em WITH p.identidadmodelo = em.identidadmodelo')
                        ->whereIn('em.identidad', $entidades)
                        ->addWhere('p.idejercicio = ?', $idejercicio)
                        ->fetchOne()->cantidad;
    }

    public function damecantInd($idindicadores, $identidadmodelo, $idejercicio) {
        return Doctrine_Query::create()->select(
                                'COUNT(d.idindicador) AS cantidad'
                        )
                        ->from('DatPlanificacion d')
                        ->where(
                                'd.identidadmodelo = ? and d.idejercicio = ?
                and d.idindicador = ?
         ', array($identidadmodelo, $idejercicio, $idindicadores)
                        )->fetchOne()->cantidad;
    }

    public function listarPlanesConIndicador($params) {
        $addWhere = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'plan') {
                    $addWhere .= "AND dm.idmodelo =" . $datos ['data'] ['value']
                            . "";
                }
                if ($datos['field'] == 'especialidad') {
                    $addWhere
                            .= "AND (Select nor.denorgano
                                                from mod_estructuracomp.nom_filaestruc f1
                                                inner join mod_estructuracomp.dat_estructura e1
                                                ON f1.idfila = e1.idestructura
                                                inner join mod_estructuracomp.nom_organo nor
                                                ON  e1.idnomeav= nor.idnomeav and  e1.idorgano= nor.idorgano
                                                where f1.idpadre = (Select ed.identidad
                                                from mod_planificacion.dat_entidaddatosnomenclador ed
                                                inner join mod_planificacion.nom_datosnomenclador nd
                                                ON ed.iddatosnomenclador = nd.iddatosnomenclador
                                                where nd.uridatosnomenclador = 'rectorbalance')
                                                AND ( f1.lft <= f.lft AND f1.rgt >= f.rgt)
                                                AND f1.idfila <> f1.idpadre )  LIKE '%"
                            . $datos ['data'] ['value'] . "%'";
                }
                if ($datos['field'] == 'plan') {
                    $addWhere .= "AND dm.idmodelo =" . $datos ['data'] ['value']
                            . "";
                }
                if ($datos ['field'] == 'importetotal') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= "AND dp.importe >"
                                . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= "AND dp.importe <"
                                . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= "AND dp.importe ="
                                . $datos ['data'] ['value'] . "";
                    }
                }
                if ($datos ['field'] == 'necesidad') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $addWhere .= "AND dp.cantidad >"
                                . $datos ['data'] ['value'] . "";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $addWhere .= "AND dp.cantidad <"
                                . $datos ['data'] ['value'] . "";
                    } else {
                        $addWhere .= "AND dp.cantidad ="
                                . $datos ['data'] ['value'] . "";
                    }
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT dp.idplanificacion,(dp.cantidad + dp.ajuste) as necesidad,
                        dp.importe as importetotal,dem.identidad ,
                        (Select nor.denorgano
                                from mod_estructuracomp.nom_filaestruc f1
                                inner join mod_estructuracomp.dat_estructura e1
                                ON f1.idfila = e1.idestructura
                                inner join mod_estructuracomp.nom_organo nor
                                ON  e1.idnomeav= nor.idnomeav and  e1.idorgano= nor.idorgano
                                where f1.idpadre = (Select ed.identidad
                                from mod_planificacion.dat_entidaddatosnomenclador ed
                                inner join mod_planificacion.nom_datosnomenclador nd
                                ON ed.iddatosnomenclador = nd.iddatosnomenclador
                                where nd.uridatosnomenclador = 'rectorbalance')
                                AND ( f1.lft <= f.lft AND f1.rgt >= f.rgt)
                                AND f1.idfila <> f1.idpadre ) as denomentidadpadre,
                                (Select e1.idestructura
                                from mod_estructuracomp.nom_filaestruc f1
                                inner join mod_estructuracomp.dat_estructura e1
                                ON f1.idfila = e1.idestructura
                                where f1.idpadre = (Select ed.identidad
                                from mod_planificacion.dat_entidaddatosnomenclador ed
                                inner join mod_planificacion.nom_datosnomenclador nd
                                ON ed.iddatosnomenclador = nd.iddatosnomenclador
                                where nd.uridatosnomenclador = 'rectorbalance')
                                AND ( f1.lft <= f.lft AND f1.rgt >= f.rgt)
                                AND f1.idfila <> f1.idpadre ) as identidadpadre,
                        dm.denominacion as plan
                FROM mod_planificacion.dat_planificacion dp
                LEFT JOIN mod_planificacion.dat_entidadmodelo dem
                ON dp.identidadmodelo = dem.identidadmodelo
                LEFT join mod_estructuracomp.nom_filaestruc f
                 ON dem.identidad = f.idfila
                LEFT join mod_estructuracomp.dat_estructura e
                ON f.idfila = e.idestructura
                LEFT JOIN mod_planificacion.dat_modelo dm
                ON dem.idmodelo = dm.idmodelo
                WHERE dp.idindicador = {$params['idindicador']}
                AND dp.idejercicio = {$params['idejercicio']}
                $addWhere OFFSET ? LIMIT ?";

        if ($params['start']) {
            $arrayParametros [] = $params['start'];
        } else {
            $arrayParametros [] = null;
        }
        if ($params['limit']) {
            $arrayParametros [] = $params['limit'];
        } else {
            $arrayParametros [] = null;
        }

        $res = $conn->execute($query, $arrayParametros);
        $data->data = $res->fetchAll();

        $querytotal = "SELECT COUNT(dp.idplanificacion)
FROM mod_planificacion.dat_planificacion dp
LEFT JOIN mod_planificacion.dat_entidadmodelo dem
ON dp.identidadmodelo = dem.identidadmodelo
LEFT join mod_estructuracomp.nom_filaestruc f
ON dem.identidad = f.idfila
LEFT join mod_estructuracomp.dat_estructura e
ON f.idfila = e.idestructura
LEFT JOIN mod_planificacion.dat_modelo dm
ON dem.idmodelo = dm.idmodelo
WHERE dp.idindicador = {$params['idindicador']}
AND dp.idejercicio = {$params['idejercicio']} $addWhere ";
        $res = $conn->execute($querytotal);
        $varaux = $res->fetchAll();
        $data->total = $varaux[0]['count'];
        return $data;
    }

    public function listarHijosRector() {

        $conn = Doctrine_Manager::connection();
        $query = "SELECT DISTINCT (Select e1.idestructura
                                                from mod_estructuracomp.nom_filaestruc f1
                                                inner join mod_estructuracomp.dat_estructura e1
                                                ON f1.idfila = e1.idestructura
                                                where f1.idpadre = (Select ed.identidad
                                                from mod_planificacion.dat_entidaddatosnomenclador ed
                                                inner join mod_planificacion.nom_datosnomenclador nd
                                                ON ed.iddatosnomenclador = nd.iddatosnomenclador
                                                where nd.uridatosnomenclador = 'rectorbalance')
                                                AND ( f1.lft <= f.lft AND f1.rgt >= f.rgt)
                                                AND f1.idfila <> f1.idpadre ) as identidadpadre,
                        (Select nor.denorgano
                                                from mod_estructuracomp.nom_filaestruc f1
                                                inner join mod_estructuracomp.dat_estructura e1
                                                ON f1.idfila = e1.idestructura
                                                inner join mod_estructuracomp.nom_organo nor
                                                ON  e1.idnomeav= nor.idnomeav and  e1.idorgano= nor.idorgano
                                                where f1.idpadre = (Select ed.identidad
                                                from mod_planificacion.dat_entidaddatosnomenclador ed
                                                inner join mod_planificacion.nom_datosnomenclador nd
                                                ON ed.iddatosnomenclador = nd.iddatosnomenclador
                                                where nd.uridatosnomenclador = 'rectorbalance')
                                                AND ( f1.lft <= f.lft AND f1.rgt >= f.rgt)
                                                AND f1.idfila <> f1.idpadre ) as denomentidadpadre
                                                
FROM  mod_estructuracomp.nom_filaestruc f 
LEFT join mod_estructuracomp.dat_estructura e
ON f.idfila = e.idestructura
order by identidadpadre";
        $res = $conn->execute($query);
        $data = $res->fetchAll();
        return $data;
    }

    public function eliminarPlanif($identidadmodelo, $idejercicio) {
        $sqlQuery = " DELETE FROM mod_planificacion.dat_planificacion p
 WHERE p.identidadmodelo = $identidadmodelo
 and p.idejercicio = $idejercicio and p.generadobasesplan = 0";
        $conn = Doctrine_Manager::connection();
        $conn->execute($sqlQuery);
    }

    public function masValiosos($identidad, $idejercicio) {
        $sqlQuery = " WITH valioso AS (
SELECT
  p.idindicador,
  i.denominacion as indicador,



  round(sum(p.importe + ((p.importe*ip.flete)/100)
                 + ((p.importe*ip.contingencia)/100)),3) as importe,

       round((SUM(p.ajuste)*p.precio) +
                 (((SUM(p.ajuste)*p.precio)*ip.flete)/100)
                 + (((SUM(p.ajuste)*p.precio)*ip.contingencia)/100),3) as importeajuste,


       round(((sum(p.precio*(p.cantidad+p.ajuste))
                 *ip.flete)/100),3) as importeflete,

                  round(((sum(p.precio*(p.cantidad+p.ajuste))
                 *ip.contingencia)/100),3) as importecontingencia,

                   round((sum(p.importe + ((p.importe*ip.flete)/100)
                 + ((p.importe*ip.contingencia)/100)))
                  + ((SUM(p.ajuste)*p.precio) +
                 (((SUM(p.ajuste)*p.precio)*ip.flete)/100)
                 + (((SUM(p.ajuste)*p.precio)*ip.contingencia)/100)) +
                  (((sum(p.precio*(p.cantidad+p.ajuste))
                 *ip.flete)/100)) + (((sum(p.precio*(p.cantidad+p.ajuste))
                 *ip.contingencia)/100)),3)  as total


FROM
  mod_planificacion.dat_planificacion p
  INNER JOIN mod_datosmaestros.nom_indicador i ON p.idindicador=i.idindicador
  INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador=i.idindicador
WHERE
idejercicio = $idejercicio

 GROUP BY
 p.idindicador,i.denominacion,p.precio,ip.flete,ip.contingencia)

 SELECT v.idindicador,v.indicador,v.importe,
  v.importeajuste,v.importeflete,v.importecontingencia, v.total
  FROM valioso v
 ORDER BY v.total DESC
 Limit 10
 ";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($sqlQuery);
        $data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function buscarEntidadesPlanif($identidades, $idejercicio) {
        $query = "SELECT p.idplanificacion
FROM  mod_planificacion.dat_entidadmodelo em
     INNER JOIN mod_planificacion.dat_planificacion p ON em.identidadmodelo = p.identidadmodelo
      INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = p.idindicador
WHERE (em.identidad IN ($identidades) AND
      (p.idejercicio = $idejercicio AND
      (p.cantidad + p.ajuste) > 0 AND
      p.idaprobaciondemanda >= 4)AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4)
      limit 1";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function listarDetalles($identidades, $idejercicio, $modelos, $porciento) {
        $query = "WITH 
consulta AS (
SELECT i.codigo,
       i.denominacion,       
       um.abreviaturaunidadmedida,
       ((sum(p.cantidad + p.ajuste)) * $porciento) / 100 as cantidad,
        ((COALESCE(CASE
                  WHEN m.tipoplan = 0 THEN round((sum(p.precio *(p.cantidad +
                    p.ajuste) +((p.precio *(p.cantidad + p.ajuste) * ip.flete) /
                    100) +((p.precio *(p.cantidad + p.ajuste) * ip.contingencia)
                    / 100))), 3)
                END, 0))*$porciento)/100 as importegasto,
      (( COALESCE(CASE
                  WHEN m.tipoplan = 1 THEN round((sum(p.precio *(p.cantidad +
                    p.ajuste) +((p.precio *(p.cantidad + p.ajuste) * ip.flete) /
                    100) +((p.precio *(p.cantidad + p.ajuste) * ip.contingencia)
                    / 100))), 3)
                END, 0))*$porciento)/100 as importeingreso
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
       em.identidadmodelo
     INNER JOIN mod_planificacion.dat_modelo m ON em.idmodelo = m.idmodelo
     INNER JOIN mod_datosmaestros.nom_indicador i ON p.idindicador =
       i.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       i.idindicador
     INNER JOIN mod_datosmaestros.nom_unidadmedida um ON i.idumedida =
       um.idunidadmedida
WHERE em.identidad IN ($identidades) AND
      em.idmodelo IN ($modelos) AND
      p.idejercicio = $idejercicio AND
      (p.cantidad + p.ajuste) > 0 AND
      p.idaprobaciondemanda >= 4 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4
GROUP BY i.codigo,
         i.denominacion,
         um.abreviaturaunidadmedida,         
         m.tipoplan)

SELECT e.codigo,
       e.denominacion,
       e.abreviaturaunidadmedida,      
       e.cantidad,
       sum(e.importegasto) as importegasto,
       sum(e.importeingreso) as importeingreso
FROM consulta e
GROUP BY e.codigo,
         e.denominacion,
         e.abreviaturaunidadmedida,
         e.cantidad
         order by e.codigo
         ";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarDetallescont($identidades, $idejercicio, $modelos) {
        $query = "
SELECT count(DISTINCT p.idindicador) as cont
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
       em.identidadmodelo
     INNER JOIN mod_planificacion.dat_modelo m ON em.idmodelo = m.idmodelo
     INNER JOIN mod_datosmaestros.nom_indicador i ON p.idindicador =
       i.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       i.idindicador
     INNER JOIN mod_datosmaestros.nom_unidadmedida um ON i.idumedida =
       um.idunidadmedida
WHERE em.identidad IN ($identidades) AND
      em.idmodelo IN ($modelos) AND
      p.idejercicio = $idejercicio AND
      (p.cantidad + p.ajuste) > 0 AND
      p.idaprobaciondemanda >= 4 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function listarDetallesB($identidades, $idejercicio, $modelos, $porciento) {
        $query = "--proyeccion de la planificacion
--ver detalles balance mat
WITH 
consulta AS (
SELECT i.codigo,
       i.denominacion,
       um.abreviaturaunidadmedida,
       ((sum(p.cantidad + p.ajuste) - COALESCE(SUM(cpe), 0)) * $porciento) / 100 as
         cantidad,
       ((COALESCE(CASE
                    WHEN m.tipoplan = 0 THEN round((sum(p.precio *(p.cantidad +
                      p.ajuste) +((p.precio *(p.cantidad + p.ajuste) * ip.flete)
                      / 100) +((p.precio *(p.cantidad + p.ajuste) *
                      ip.contingencia) / 100)) -(COALESCE(SUM(cpe * ip.precio),
                      0))), 3)
                  END, 0)) * $porciento) / 100 as importegasto,
       ((COALESCE(CASE
                    WHEN m.tipoplan = 1 THEN round((sum(p.precio *(p.cantidad +
                      p.ajuste) +((p.precio *(p.cantidad + p.ajuste) * ip.flete)
                      / 100) +((p.precio *(p.cantidad + p.ajuste) *
                      ip.contingencia) / 100)) -(COALESCE(SUM(cpe * ip.precio),
                      0))), 3)
                  END, 0)) * $porciento) / 100 as importeingreso
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
       em.identidadmodelo
     INNER JOIN mod_planificacion.dat_modelo m ON em.idmodelo = m.idmodelo
     INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador =
       p.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       i.idindicador
     INNER JOIN mod_datosmaestros.nom_unidadmedida um ON i.idumedida =
       um.idunidadmedida
     LEFT JOIN mod_planificacion.dat_odcte odcte on (p.idindicador =
       odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
       odcte.idmodelo AND odcte.idejercicio = $idejercicio)
WHERE em.identidad IN ($identidades) AND
      em.idmodelo IN ($modelos) AND
      p.idejercicio = $idejercicio AND
      (p.cantidad + p.ajuste) > 0 AND
      p.idaprobaciondemanda >= 4 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4
GROUP BY i.codigo,
         i.denominacion,
         um.abreviaturaunidadmedida,
         m.tipoplan)

SELECT e.codigo,
       e.denominacion,
       e.abreviaturaunidadmedida,
       e.cantidad,
       sum(e.importegasto) as importegasto,
       sum(e.importeingreso) as importeingreso
FROM consulta e
GROUP BY e.codigo,
         e.denominacion,
         e.abreviaturaunidadmedida,
         e.cantidad
         order by e.codigo";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarDetallesBcont($identidades, $idejercicio, $modelos) {
        $query = "
SELECT count(DISTINCT p.idindicador) as cont
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
       em.identidadmodelo
     INNER JOIN mod_planificacion.dat_modelo m ON em.idmodelo = m.idmodelo
     INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador =
       p.idindicador
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       i.idindicador
     INNER JOIN mod_datosmaestros.nom_unidadmedida um ON i.idumedida =
       um.idunidadmedida
     LEFT JOIN mod_planificacion.dat_odcte odcte on (p.idindicador =
       odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
       odcte.idmodelo AND odcte.idejercicio = $idejercicio)
WHERE em.identidad IN ($identidades) AND
      em.idmodelo IN ($modelos) AND
      p.idejercicio = $idejercicio AND
      (p.cantidad + p.ajuste) > 0 AND
      p.idaprobaciondemanda >= 4 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function calcularImporteTotal($parametros) {
        $query = "WITH 
consulta AS (
SELECT COALESCE( CASE
                  WHEN m.tipoplan = 0 THEN round((sum(p.precio *(p.cantidad +
                    p.ajuste) +((p.precio *(p.cantidad + p.ajuste) * ip.flete) /
                    100) +((p.precio *(p.cantidad + p.ajuste) * ip.contingencia)
                    / 100))), 3)                   
                END, 0) as importegasto,
       COALESCE(CASE
                  WHEN m.tipoplan = 1 THEN round((sum(p.precio *(p.cantidad +
                    p.ajuste) +((p.precio *(p.cantidad + p.ajuste) * ip.flete) /
                    100) +((p.precio *(p.cantidad + p.ajuste) * ip.contingencia)
                    / 100))), 3)
                END, 0) as importeingreso
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
       em.identidadmodelo
        INNER JOIN mod_planificacion.dat_modelo m ON em.idmodelo = m.idmodelo
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       p.idindicador
WHERE em.identidad IN ({$parametros['identidades']})
AND em.idmodelo IN ({$parametros['planes']})
AND idejercicio = {$parametros['idejercicio']} AND
    (p.cantidad + p.ajuste) > 0 AND
      p.idaprobaciondemanda >= 4 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4
GROUP BY m.tipoplan)
SELECT ((sum(e.importegasto))* {$parametros['porc']})/100  as importegasto,
     ((sum(e.importeingreso))* {$parametros['porc']})/100 as importeingreso
FROM consulta e";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function calcularImporteTotalB($parametros) {
        $query = " --proyeccion de la planificacion
--importe balance      
      WITH 
consulta AS (
SELECT COALESCE(CASE
                  WHEN m.tipoplan = 0 THEN round((sum(p.precio *(p.cantidad +
                    p.ajuste) +((p.precio *(p.cantidad + p.ajuste) * ip.flete) /
                    100) +((p.precio *(p.cantidad + p.ajuste) * ip.contingencia)
                    / 100)) -(COALESCE(SUM(cpe * ip.precio), 0))), 3)
                END, 0) as importegasto,
       COALESCE(CASE
                  WHEN m.tipoplan = 1 THEN round((sum(p.precio *(p.cantidad +
                    p.ajuste) +((p.precio *(p.cantidad + p.ajuste) * ip.flete) /
                    100) +((p.precio *(p.cantidad + p.ajuste) * ip.contingencia)
                    / 100)) -(COALESCE(SUM(cpe * ip.precio), 0))), 3)
                END, 0) as importeingreso
FROM mod_planificacion.dat_planificacion p
     INNER JOIN mod_planificacion.dat_entidadmodelo em ON p.identidadmodelo =
       em.identidadmodelo
     INNER JOIN mod_planificacion.dat_modelo m ON em.idmodelo = m.idmodelo
     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador =
       p.idindicador
     LEFT JOIN mod_planificacion.dat_odcte odcte on (p.idindicador =
       odcte.idindicador AND odcte.identidad = em.identidad AND em.idmodelo =
       odcte.idmodelo AND odcte.idejercicio = {$parametros['idejercicio']})
WHERE em.identidad IN ({$parametros['identidades']}) AND
      p.idejercicio = {$parametros['idejercicio']} AND
      em.idmodelo IN ({$parametros['planes']}) AND
      (p.cantidad + p.ajuste) > 0 AND
      p.idaprobaciondemanda >= 4 AND
      ip.nivelplanif = 1 AND
      ip.idaprobacion = 4
GROUP BY m.tipoplan)

SELECT ((sum(e.importegasto))*{$parametros['porc']})/100 as importegasto,
       ((sum(e.importeingreso))*{$parametros['porc']})/100 as importeingreso
FROM consulta e";

        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function buscarIdTablasPorTipoModelo($idtipomodelo) {
        $query = "SELECT mod.idtabla FROM mod_planificacion.nom_tipomodelo mod
                  WHERE mod.idtipomodelo = {$idtipomodelo};";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }

    public function eliminarPlanifGenerado($identidad, $idmodelo, $idejercicio, $generado) {
        $sqlQuery = "DELETE
                        FROM mod_planificacion.dat_planificacion p
                        WHERE p.idejercicio = $idejercicio AND
                              p.generadobasesplan = $generado AND
                              p.identidadmodelo =
                              (
                                SELECT em.identidadmodelo
                                FROM mod_planificacion.dat_entidadmodelo em
                                WHERE em.identidad = $identidad AND
                                      em.idmodelo = $idmodelo
                              )";
        $conn = Doctrine_Manager::connection();
        $conn->execute($sqlQuery);
    }

    public function obtenerDatos($params) {
        //manejo de parametros
        $idtipomodelo = $params['tipomodelo'][0]['idtipomodelo'];
        $x = $params['x'];

        //Obtiene los campos Numericos del tipo de modelo 
        $dat = DatPlanModel::camposNumericosDadoTabla($params['tipomodelo'][0]['idtabla']);

        //conforma el select de los campos dinamicos
        foreach ($dat as $key => $d) {
            $temp = $d['denomcampo'];
            $campos[$key] = "SUM(meta.$temp) as dat_$idtipomodelo$temp";
        }
        $x->ar_select = $campos;
        
        //agrega los elementos estaticos a la consulta
        $x->select("pla.organossatisface as organosatisface,
                    em.identidad,
                    SUM(pla.importedivisa) as divisa,
                    SUM(pla.importe) as demanda");

        $x->join('mod_planificacion.dat_planificacion pla', 'pla.idplanificacion = meta.idplanificacion');
        $x->join('mod_planificacion.dat_entidadmodelo em', 'pla.identidadmodelo = em.identidadmodelo');
        $x->join('mod_datosmaestros.nom_indicador ind', 'pla.idindicador = ind.idindicador');
        $x->join('mod_datosmaestros.nom_indicadorplanif indpl', 'indpl.idindicador = ind.idindicador');
        $x->where_in('em.identidad', $params['identidades']);
        $x->where_in('pla.organossatisface', $params['oace']);
        $x->where('pla.idejercicio', $params['idejercicio']);
        $x->where('em.idmodelo', $params['idmodelo']);
        $x->where('indpl.nivelplanif', 1);
        $x->where('indpl.idaprobacion = 4');
        $x->groupby('em.identidad,pla.organossatisface');
        $x->orderby('pla.organossatisface');
        $query = $x->get()->result_array();
        return $query;
    }

}
