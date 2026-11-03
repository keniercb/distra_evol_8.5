<?php

class RedistribucionModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }


    private function addWhereConParams(&$addwhere, &$paramsQuery, $columCond, $param)
    {
        $addwhere .= " AND " . $columCond;
        $paramsQuery[] = $param;
    }


    private function addHavigConParamsFoo(&$addHaving, $columCond, $param)
    {
        $addHaving .= " AND " . $columCond . $param;
    }

    private function addHavigConParamsHaving(&$addHaving, $columCond, $param)
    {
        $addHaving .= " AND " . $columCond . $param;
    }

    private function addWhereConParamsFoo(&$foo, $columCond, $param)
    {
        $foo .= " AND " . $columCond . $param;
    }

    public function listarIndicadoresDemandados($start, $limit, $parametros)
    {
        $conn = Doctrine_Manager::connection();
        $paramsQuery = array();
        $entidaddatosnom = $parametros['idcentrobalance'];
        $entidad = DatEntidaddatosnomenclador::getIdEntidadDadoIdDatoNom($entidaddatosnom);
        $entidad = $entidad[0]['identidad'];
        $addwhere = "";
        $foo = " Where true";
        $addHaving = "";
        $idejercicio = $parametros['idejercicio'];
        //tratamiento del filtro
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams($addwhere, $paramsQuery, "i.codigo  LIKE ? ", ("$s%"));
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(i.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(i.numeropieza)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'umedida') {
                        self::addWhereConParams($addwhere, $paramsQuery, 'i.idumedida =?', $s);
                    } elseif ($p == 'precio_condicion1' || $p == 'precio_condicion2' || $p == 'precio_condicion3') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "ipnif.precio " . $s['condicion'] . " ? ", $s['precio']
                        );
                    } elseif ($p == 'satisfecha_condicion1'
                        || $p == 'satisfecha_condicion2' || $p == 'satisfecha_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "COALESCE (re.cantidad,0) " . $s['condicion']
                            . " ? ", $s['satisfecha']
                        );
                    } elseif ($p == 'esd_condicion1' || $p == 'esd_condicion2' || $p == 'esd_condicion3') {
                        self::addWhereConParamsFoo(
                            $foo, "COALESCE((SELECT coberturatotalestimada
                            from mod_planificacion.dat_ajusteexistencia
					where idindicador = foo.idindicador and identidad = $entidad and idejercicio = $idejercicio) -
					(SELECT coalesce (sum(COALESCE(cantidad,0)),0) as c
					from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio),0)". $s['condicion'], $s['esd']
                        );
                    } elseif ($p == 'porciento_condicion1'
                        || $p == 'porciento_condicion2' || $p == 'porciento_condicion3'
                    ) {
                        self::addHavigConParamsFoo(
                            $addHaving, "ROUND(((SELECT coalesce (sum(cantidad),0) as c
                            from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio)*100)/
					(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador  AND idejercicio = $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))),3)" . $s['condicion'], $s['porciento']
                        );
                    } elseif ($p == 'dns_condicion1' || $p == 'dns_condicion2' || $p == 'dns_condicion3') {
                        self::addHavigConParamsFoo(
                            $addHaving, "(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte
                    WHERE idindicador = foo.idindicador AND idejercicio= $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idejercicio= $idejercicio
					AND idindicador = foo.idindicador),0))) - COALESCE (foo.cantidad,0)". $s['condicion'], $s['dns']
                        );
                    } elseif ($p == 'preciomlc_condicion1'
                        || $p == 'preciomlc_condicion2' || $p == 'preciomlc_condicion3'
                    ) {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "ipnif.preciodivisa " . $s['condicion'] . " ? ", $s['preciomlc']
                        );
                    } elseif ($p == 'importe_condicion1' || $p == 'importe_condicion2' || $p == 'importe_condicion3') {
                        self::addHavigConParamsFoo(
                            $addHaving, "(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * foo.precio +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte WHERE idindicador = foo.idindicador
					AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (foo.flete)/100 +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte WHERE idindicador = foo.idindicador
					AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (foo.contingencia)/100"
                            . $s['condicion'], $s['importe']
                        );
                    } elseif ($p == 'flete_condicion1' || $p == 'flete_condicion2' || $p == 'flete_condicion3') {
                        self::addHavigConParamsFoo(
                            $addHaving, "((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					+ COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (foo.flete)/100"
                            . $s['condicion'], $s['flete']
                        );

                    } elseif ($p == 'contingencia_condicion1' || $p == 'contingencia_condicion2'
                        || $p == 'contingencia_condicion3'
                    ) {
                        self::addHavigConParamsFoo(
                            $addHaving, "((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (foo.contingencia)/100"
                            . $s['condicion'], $s['contingencia']
                        );
                    } elseif ($p == 'importesatisfecha_condicion1' || $p == 'importesatisfecha_condicion2'
                        || $p == 'importesatisfecha_condicion3'
                    ) {
                        self::addHavigConParamsFoo(
                            $addHaving, "(SELECT coalesce (sum(cantidad),0) as c
                            from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio) * foo.precio +
					((SELECT coalesce (sum(cantidad),0) as c from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio) * foo.precio) * (foo.flete)/100 +
					((SELECT coalesce (sum(cantidad),0) as c from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio) * foo.precio) * (foo.contingencia)/100"
                            . $s['condicion'], $s['importesatisfecha']
                        );
                    } elseif ($p == 'importedns_condicion1' || $p == 'importedns_condicion2'
                        || $p == 'importedns_condicion3'
                    ) {
                        self::addHavigConParamsFoo(
                            $addHaving, "((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte
                    WHERE idindicador = foo.idindicador
                    AND idejercicio= $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idejercicio= $idejercicio
					AND idindicador = foo.idindicador),0))) - COALESCE(foo.cantidad,0)) * foo.precio +
					(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte
                    WHERE idindicador = foo.idindicador
                    AND idejercicio = $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                    + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0)) - (SELECT coalesce (sum(cantidad),0) as c
					from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio)) * foo.precio * (foo.flete)/100 +
					(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador
                            AND idejercicio = $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0)) - (SELECT coalesce (sum(cantidad),0) as c
					from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio)) * foo.precio * (foo.contingencia)/100"
                            . $s['condicion'], $s['importedns']
                        );
                    } elseif ($p == 'importefila_condicion1' || $p == 'importefila_condicion2'
                        || $p == 'importefila_condicion3'
                    ) {
                        self::addHavigConParamsFoo(
                            $addHaving, "	(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idindicador = foo.idindicador
					AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * foo.precio +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					+ COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (foo.flete)/100 +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (foo.contingencia)/100"
                            . $s['condicion'], $s['importefila']
                        );
                    } elseif ($p == 'demanda_condicion1' || $p == 'demanda_condicion2' || $p == 'demanda_condicion3') {
                        self::addHavigConParamsFoo(
                            $addHaving, "SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador AND idejercicio= $idejercicio) -
                 (SELECT   COALESCE((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                  + COALESCE(cantidadeconomia,0))
                        FROM mod_planificacion.dat_ajusteexistenciacb aecb
                        WHERE identidad = $entidad AND idejercicio= $idejercicio
			AND idindicador = foo.idindicador),0)) " . $s['condicion'], $s['demanda']
                        );
                    }
                }
            }
        }
        //consulta general para obtener los indicadores
        $consultageneral
            = "SELECT
                    foo.idindicador, foo.codigo, foo.precio, foo.preciodivisa as preciomlc, foo.numeropieza,
                    foo.denominacion, foo.denominacionunidadmedida as umedida, COALESCE (foo.cantidad,0) as satisfecha,
                    SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte
                    WHERE idindicador = foo.idindicador AND idejercicio= $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                    + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idejercicio= $idejercicio
					AND idindicador = foo.idindicador),0)) as demanda,
					COALESCE((SELECT coberturatotalestimada from mod_planificacion.dat_ajusteexistencia
					where idindicador = foo.idindicador and identidad = $entidad and idejercicio = $idejercicio) -
					(SELECT coalesce (sum(cantidad),0) as c from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio),0) as esd,
		            (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte
                    WHERE idindicador = foo.idindicador AND idejercicio= $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idejercicio= $idejercicio
					AND idindicador = foo.idindicador),0))) - COALESCE (foo.cantidad,0) as dns,
					((SELECT coalesce (sum(cantidad),0) as c from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio)*100)/
					(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) as porciento,
                    (SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * foo.precio +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (COALESCE(foo.flete,0))/100 +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idindicador = foo.idindicador	AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					+ COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (foo.contingencia)/100 as importe,
					COALESCE (foo.cantidad,0) * foo.precio +
					((SELECT coalesce (sum(cantidad),0) as c from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio) * foo.precio) * (foo.flete)/100 +
					((SELECT coalesce (sum(cantidad),0) as c from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio) * foo.precio) * (foo.contingencia)/100 as importesatisfecha,
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte
                    WHERE idindicador = foo.idindicador
                    AND idejercicio= $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idejercicio= $idejercicio
					AND idindicador = foo.idindicador),0))) - COALESCE (foo.cantidad,0)) * foo.precio +
					(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                    FROM mod_planificacion.dat_odcte odcte
                    WHERE idindicador = foo.idindicador  AND idejercicio = $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0)) - (SELECT coalesce (sum(cantidad),0) as c
					from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					 and idejercicio = $idejercicio)) * foo.precio * (foo.flete)/100 +
					(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0)) - (SELECT coalesce (sum(cantidad),0) as c
					from mod_planificacion.dat_redistribucionexcedente
					where idindicador = foo.idindicador and identidaddatosnomenclador = $entidaddatosnom
					and idejercicio = $idejercicio)) * foo.precio * (foo.contingencia)/100 as importedns,
                    ((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (COALESCE(foo.flete,0))/100 as flete,
                    ((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (foo.contingencia)/100 as contingencia,
					(SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idindicador = foo.idindicador AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					 + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad	AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * foo.precio +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idindicador = foo.idindicador	AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					+ COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad	AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (COALESCE(foo.flete,0))/100 +
					((SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
					FROM mod_planificacion.dat_odcte odcte
					WHERE idindicador = foo.idindicador	AND idejercicio = $idejercicio) -
					(SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
					+ COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $entidad AND idindicador = foo.idindicador
					AND idejercicio = $idejercicio),0))) * precio) * (foo.contingencia)/100 as importefila
                    FROM (SELECT i.idindicador, i.codigo,  ipnif.precio, ipnif.preciodivisa, i.numeropieza,
                            i.denominacion, ipnif.flete, ipnif.contingencia, um.denominacionunidadmedida,
                            re.cantidad, e.denominacion as denominacioncb, SUM(p.cantidad + p.ajuste) as necesidad,
                            ae.coberturatotalestimada as coberturatotalestimada
                            FROM mod_planificacion.dat_planificacion p
                            INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador = ipnif.idindicador
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um on i.idumedida = um.idunidadmedida
                            LEFT JOIN mod_planificacion.dat_redistribucionexcedente re
                            on (i.idindicador = re.idindicador
                            AND re.identidaddatosnomenclador=$entidaddatosnom)
                            INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                             on p.idcentrobalance = edn.identidaddatosnomenclador
                            INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
                            INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo = em.identidadmodelo
                            LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador = ae.idindicador
                            AND ae.identidad = $entidad AND ae.idejercicio = p.idejercicio)
                            LEFT JOIN mod_planificacion.dat_odcte odcte on (i.idindicador = odcte.idindicador
                            AND odcte.identidad= em.identidad AND odcte.idejercicio = p.idejercicio)
                            WHERE p.idejercicio = $idejercicio AND i.estado=1 AND p.idcentrobalance = $entidaddatosnom
                            $addwhere
                            Group by i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,i.numeropieza,
                            ipnif.flete,ipnif.contingencia, i.denominacion,um.denominacionunidadmedida,
                            re.cantidad,e.denominacion, ae.coberturatotalestimada
                            HAVING SUM(p.cantidad) > 0
                            order by i.codigo) as foo
                            $foo
                    Group by foo.idindicador,  foo.codigo, foo.precio, foo.preciodivisa, foo.numeropieza,
                    foo.flete, foo.contingencia, foo.denominacion, foo.denominacionunidadmedida,
                    foo.cantidad, foo.denominacioncb, foo.coberturatotalestimada
                    HAVING  SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte
                            WHERE idindicador = foo.idindicador) -
                            (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
                             + COALESCE(reservaministerial,0)
                             + COALESCE(cantidadeconomia,0))
                            FROM mod_planificacion.dat_ajusteexistenciacb aecb
                            WHERE identidad = $entidad  AND idindicador = foo.idindicador),0)) > 0
                            $addHaving
                    order by foo.codigo ";

        //Ejecutar el listar indicadores sin limite y start sin que influya en el total ya ejecutado.
        //$consultotal = $consultageneral;
        $consultageneral .= "OFFSET $start LIMIT $limit";

        //ejecutando la consulta general
        $res = $conn->execute($consultageneral, $paramsQuery);
        $arrayindicadores = $res->fetchAll(PDO::FETCH_ASSOC);

        //consulta para obtener el total de indicadores e importes



        return self::listarIndicadoresDemandadosAux($consultageneral, $paramsQuery, $arrayindicadores);
    }

    public function listarIndicadoresDemandadosAux($consultageneral, $paramsQuery, $arrayindicadores)
    {
        $conn = Doctrine_Manager::connection();
        $consultatotalimportes
            = "SELECT
         SUM(pru.importedns) as importedns, SUM(pru.importesatisfecha) as importesatisfecha,
         SUM(pru.importe) as importetotal, COUNT(pru.idindicador) as total
         FROM
         ($consultageneral) as pru";

        //ejecutando la consulta del total
        $total = $conn->execute($consultatotalimportes, $paramsQuery);
        $totales = $total->fetchAll(PDO::FETCH_ASSOC);


        $resultado['datos'] = $arrayindicadores;

        $resultado['total'] = $totales[0]['total'];
        $resultado['importetotal'] = number_format($totales[0]['importetotal'], '3', '.', ',');
        $resultado['importesatisfecha'] = number_format($totales[0]['importesatisfecha'], '3', '.', ',');
        $resultado['importedns'] = number_format($totales[0]['importedns'], '3', '.', ',');

        foreach ($resultado['datos'] as $key => $value) {
            $resultado['datos'][$key]['demanda'] = number_format($value['demanda'], '3', '.', ',');
            $resultado['datos'][$key]['importedns'] = number_format($value['importedns'], '3', '.', ',');
            $resultado['datos'][$key]['importesatisfecha'] = number_format($value['importesatisfecha'], '3', '.', ',');
            $resultado['datos'][$key]['precio'] = number_format($value['precio'], '3', '.', ',');
            $resultado['datos'][$key]['preciomlc'] = number_format($value['preciomlc'], '3', '.', ',');
            $resultado['datos'][$key]['flete'] = number_format($value['flete'], '3', '.', ',');
            $resultado['datos'][$key]['contingencia'] = number_format($value['contingencia'], '3', '.', ',');
            $resultado['datos'][$key]['satisfecha'] = number_format($value['satisfecha'], '3', '.', ',');
            $resultado['datos'][$key]['esd'] = number_format($value['esd'], '3', '.', ',');
            $resultado['datos'][$key]['porciento'] = number_format($value['porciento'], '3', '.', ',');
            $resultado['datos'][$key]['importe'] = number_format($value['importe'], '3', '.', ',');
            $resultado['datos'][$key]['dns'] = number_format($value['dns'], '3', '.', ',');
        }
        return $resultado;
    }

    public function listarIndicadoresDemandados2($params, $escontar = false)
    {

        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $idejercicio[0]['idejercicio'];

        $paramsQuery = array();
        $paramsQueryHaving = array();
        $paramsQuery[] = $idejercicio;
        $addwhere = '';
        $addhaving = '';
        $arrayParamsgroupby = array();

        if ($params['idcentrobalance'] != -1 && $params['idcentrobalance'] != null
            && $params['idcentrobalance'] != 'null'
        ) {
            $condInner = "AND edn.identidaddatosnomenclador = ? ";
            $paramsQuery [] = $params['idcentrobalance'];
        }

        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                $cond = "=";
                if ($datos['data']['comparison'] == "gt") {
                    $cond = ">";
                } elseif ($datos['data']['comparison'] == "lt") {
                    $cond = "<";
                }
                if ($datos ['field'] == 'codigo') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "alias1.codigo  LIKE ? ", ("" . $datos ['data'] ['value'] . "%")
                    );
                } elseif ($datos ['field'] == 'numeropieza') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "alias1.numeropieza  LIKE ? ", ("" . $datos ['data'] ['value'] . "%")
                    );
                } elseif ($datos ['field'] == 'denominacion') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery,
                        "upper(alias1.denominacion)  LIKE ? ", ("%" . strtoupper($datos ['data'] ['value']) . "%")
                    );
                } elseif ($datos ['field'] == 'umedida') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "alias1.idumedida = ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'precio') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "alias1.precio {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'preciomlc') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "alias1.preciomlc {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'flete') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "alias1.flete {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'contingencia') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "alias1.contingencia {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'demanda') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, " alias1.demanda {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'satisfecha') {
                    self::addWhereConParams(
                        $addhaving, $paramsQueryHaving,
                        "  SUM( COALESCE(rde.cantidad,0) ) {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'esd') {
                    $arrayParamsgroupby[] = 'alias1.sumcte';
                    self::addWhereConParams(
                        $addhaving, $paramsQueryHaving,
                        "( alias1.sumcte - SUM( COALESCE(rde.cantidad,0) ) ) {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'porciento') {
                    $arrayParamsgroupby[] = 'alias1.demanda';
                    self::addWhereConParams(
                        $addhaving, $paramsQueryHaving,
                        "round( ( ( SUM( COALESCE(rde.cantidad,0) ) * 100 ) / alias1.demanda  ) , 2 ) {$cond} ? ",
                        $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'importe') {
                    $arrayParamsgroupby[] = 'alias1.precio, alias1.flete,alias1.contingencia';
                    self::addWhereConParams(
                        $addhaving, $paramsQueryHaving, "
                            (( SUM( COALESCE(rde.cantidad,0) )*alias1.precio)
                            + ( SUM( COALESCE(rde.cantidad,0) ) * (alias1.flete/100) ) 
                            + ( SUM( COALESCE(rde.cantidad,0) ) * (alias1.contingencia/100) )) {$cond} ? ",
                        $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'denominacioncb') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, " edn.identidaddatosnomenclador = ? ", $datos ['data'] ['value']
                    );
                }
            }
        }

        $groupbytotal = '';
        $groupbyimportetot = '';
        $columnas = '';
        $coma = '';
        foreach ($arrayParamsgroupby as $value) {
            $columnas .= $coma . $value;
            $coma = ',';
        }
        if ($columnas != '') {
            $groupbytotal = ' GROUP BY ' . $columnas;
            $groupbyimportetot = ',' . $columnas;
        }
//        echo $columnas;die;

        $conn = Doctrine_Manager::connection();
        if ($escontar == false) {
            $query
                = "SELECT alias1.*,
                      SUM( COALESCE(rde.cantidad,0) ) as satisfecha, alias1.sumcte  as excedente
                FROM(
                SELECT alias.idindicador,  alias.demanda , alias.idejercicio , alias.identidad ,
                    ind.codigo,  ind.numeropieza, ind.denominacion, ind.idumedida, ipnif.precio,
                    ipnif.preciodivisa as preciomlc, ipnif.flete, ipnif.contingencia, alias.idcentrobalance,
                    SUM(COALESCE( ae.coberturatotalestimada,0)) as sumcte
                FROM(
                SELECT DISTINCT aecb.idindicador,  sum( aecb.demanda ) as demanda, aecb.idejercicio,  aecb.identidad,
                    edn.identidaddatosnomenclador as idcentrobalance
                FROM mod_planificacion.dat_ajusteexistenciacb aecb                     
                INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                ON( edn.identidad = aecb.identidad AND edn.iddatosnomenclador = 1
                 AND aecb.idejercicio = ? {$condInner} )
                WHERE aecb.demanda > 0
                GROUP BY aecb.idindicador, aecb.idejercicio,aecb.identidad,edn.identidaddatosnomenclador
                )alias 
                INNER JOIN mod_datosmaestros.nom_indicador ind
                ON( alias.idindicador = ind.idindicador )                
                INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador = ipnif.idindicador
                LEFT JOIN mod_planificacion.dat_ajusteexistencia ae
                ON( ae.idejercicio = alias.idejercicio AND ae.idindicador = alias.idindicador )
                GROUP BY alias.idindicador,  alias.demanda, alias.idejercicio, alias.identidad, ind.codigo,
                        ind.numeropieza,  ind.denominacion, ind.idumedida, ipnif.precio, ipnif.preciodivisa,
                        ipnif.flete, ipnif.contingencia, alias.idcentrobalance)alias1
                LEFT JOIN mod_planificacion.dat_redistribucionexcedente rde
                ON( rde.idejercicio = alias1.idejercicio AND rde.idindicador =  alias1.idindicador )
                WHERE  alias1.demanda > 0
                $addwhere
                GROUP BY alias1.idindicador, alias1.demanda,  alias1.idejercicio, alias1.identidad, alias1.codigo,
                alias1.numeropieza, alias1.denominacion, alias1.idumedida, alias1.precio, alias1.preciomlc,
                alias1.flete, alias1.contingencia, alias1.sumcte, alias1.idcentrobalance
                HAVING true $addhaving
                ORDER BY alias1.codigo
                OFFSET ? LIMIT ? ";
        }
        $paramsQuery = array_merge($paramsQuery, $paramsQueryHaving);
        $paramsQueryTotal = $paramsQuery;
        $paramsQuery[] = $params['start'];
        $paramsQuery[] = $params['limit'];
        if ($escontar == false) {
            $res = $conn->execute($query, $paramsQuery);
            $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
        }
        $res =self::listarIndicadoresDemandados2Aux(
            $addwhere, $condInner, $groupbyimportetot, $addhaving, $paramsQueryTotal
        );
        $data->importetotal = number_format($res[0]['importetotal'], '5', '.', ',');
        $data->total = $res[0]['total'];
        $arrayUms = array();
        $arrayCbs = array();
        $integrator = ZendExt_IoC::getInstance();
        if (is_array($data->data)) {
            foreach ($data->data as $k => $value) {
                if ($arrayCbs['ident_' . $value['identidad']] == null) {
                    $datenti = $this->integrator->metadatos->DameEstructura($value['identidad']);
                    $arrayCbs['ident_' . $value['identidad']] = $datenti[0]->denominacion;
                }
                $data->data[$k]['denominacioncb'] = $arrayCbs['ident_'. $value['identidad']];

                if ($arrayUms['idind_' . $value['idindicador']] == null) {
                    $unidades
                        = $integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($value['idumedida']));
                    $arrayUms['idind_' . $value['idindicador']] = $unidades->abreviatura;
                }
                $data->data[$k]['umedida'] = $arrayUms['idind_'. $value['idindicador']];
                $data->data[$k]['satisfecha'] = number_format($value['satisfecha'], 6, '.', '');
                $data->data[$k]['esd'] = number_format(
                    round(($value['excedente'] - $value['satisfecha']), 6), 6, '.', ''
                );
                $data->data[$k]['porciento'] = round(
                    ($data->data[$k]['satisfecha'] * 100) / $data->data[$k]['demanda'], 2
                );
                $data->data[$k]['demanda'] = number_format($value['demanda'], 5, '.', '');
                $data->data[$k]['importe'] = ($data->data[$k]['satisfecha'] * $data->data[$k]['precio']);
                $data->data[$k]['importe'] += ($data->data[$k]['satisfecha'] * ($data->data[$k]['flete'] / 100));
                $data->data[$k]['importe'] += ($data->data[$k]['satisfecha'] * ($data->data[$k]['contingencia'] / 100));
                $data->data[$k]['importe'] = number_format($data->data[$k]['importe'], 6, '.', '');
            }
        }
        return $data;
    }

    public function listarIndicadoresDemandados2Aux($addwhere, $condInner, $groupbyimportetot,
                                                    $addhaving, $paramsQueryTotal)
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT SUM(importetotal) as importetotal, COUNT(idind) as total
                FROM
                (
                SELECT  DISTINCT alias1.idindicador as idind,
                (( SUM( COALESCE(rde.cantidad,0) )*alias1.precio) + ( SUM( COALESCE(rde.cantidad,0) )
                                            * (alias1.flete/100) ) + ( SUM( COALESCE(rde.cantidad,0) )
                                             * (alias1.contingencia/100) ))  as importetotal

                FROM(
                SELECT alias.idindicador, alias.demanda , alias.idejercicio , ind.codigo, ind.numeropieza,
                    ind.denominacion,  ind.idumedida, ipnif.precio, ipnif.preciodivisa as preciomlc,
                    ipnif.flete, ipnif.contingencia,   alias.idcentrobalance,
                    SUM(COALESCE( ae.coberturatotalestimada,0)) as sumcte
                FROM(
                SELECT DISTINCT aecb.idindicador, sum( aecb.demanda ) as demanda, aecb.idejercicio,
                    edn.identidaddatosnomenclador as idcentrobalance
                FROM mod_planificacion.dat_ajusteexistenciacb aecb
                INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                ON( edn.identidad = aecb.identidad AND edn.iddatosnomenclador = 1 AND
                aecb.idejercicio = ? {$condInner} )
                WHERE aecb.demanda > 0
                GROUP BY aecb.idindicador, aecb.idejercicio,aecb.identidad,  edn.identidaddatosnomenclador)alias
                INNER JOIN mod_datosmaestros.nom_indicador ind ON( alias.idindicador = ind.idindicador )
                INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on i.idindicador = ipnif.idindicador
                LEFT JOIN mod_planificacion.dat_ajusteexistencia ae
                ON( ae.idejercicio = alias.idejercicio AND ae.idindicador = alias.idindicador )
                GROUP BY alias.idindicador,  alias.demanda, alias.idejercicio, ind.codigo, ind.numeropieza,
                        ind.denominacion, ind.idumedida, ipnif.precio, ipnif.preciodivisa, ipnif.flete,
                        ipnif.contingencia, alias.idcentrobalance)alias1
                LEFT JOIN mod_planificacion.dat_redistribucionexcedente rde
                ON( rde.idejercicio = alias1.idejercicio AND rde.idindicador =  alias1.idindicador )
                 Where true
                $addwhere
               GROUP BY alias1.precio,alias1.flete,alias1.contingencia,alias1.idindicador
               $groupbyimportetot
                HAVING true $addhaving)alias2";
        $res = $conn->execute($sql, $paramsQueryTotal);
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }

    public function listarIndicadoresDemandadosV1($params, $escontar = false)
    {
        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $idejercicio[0]['idejercicio'];
        $paramsQuery = array();
        $paramsQueryHaving = array();
        $paramsQuery[] = $idejercicio;
        $addwhere = '';
        $addhaving = '';
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                $cond = "=";
                if ($datos['data']['comparison'] == "gt") {
                    $cond = ">";
                } elseif ($datos['data']['comparison'] == "lt") {
                    $cond = "<";
                }
                if ($datos ['field'] == 'codigo') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "ind.codigo  LIKE ? ", ("" . $datos ['data'] ['value'] . "%")
                    );
                } elseif ($datos ['field'] == 'numeropieza') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "ind.numeropieza  LIKE ? ", ("" . $datos ['data'] ['value'] . "%")
                    );
                } elseif ($datos ['field'] == 'denominacion') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "upper(ind.denominacion)  LIKE ? ",
                        ("%" . strtoupper($datos ['data'] ['value']) . "%")
                    );
                } elseif ($datos ['field'] == 'umedida') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "ind.idumedida = ? ",
                        $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'precio') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "ipnif.precio {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'preciomlc') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "ipnif.preciodivisa {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'demanda') {
                    self::addWhereConParams(
                        $addhaving, $paramsQueryHaving, " SUM(aecb.demanda) {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'satisfecha') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "  COALESCE(( SELECT SUM(rde.cantidad)
                                 FROM mod_planificacion.dat_redistribucionexcedente rde
                                 WHERE rde.identidaddatosnomenclador = edn.identidaddatosnomenclador AND
                                 rde.idindicador =  aecb.idindicador  AND rde.idejercicio =  aecb.idejercicio
                                                                        ),0) {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'porciento') {
                } elseif ($datos ['field'] == 'esd') {
                } elseif ($datos ['field'] == 'importe') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, " (COALESCE(( SELECT SUM(rde.cantidad)
                                FROM mod_planificacion.dat_redistribucionexcedente rde
                                WHERE rde.identidaddatosnomenclador = edn.identidaddatosnomenclador AND
                                rde.idindicador =  aecb.idindicador AND rde.idejercicio =  aecb.idejercicio
                                ),0) * ipnif.precio) {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'denominacioncb') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, " edn.identidaddatosnomenclador = ? ", $datos ['data'] ['value']
                    );
                }
            }
        }
        if ($params['idcentrobalance'] != -1 && $params['idcentrobalance'] != null
            && $params['idcentrobalance'] != 'null'
        ) {
            self::addWhereConParams(
                $addwhere, $paramsQuery, " edn.identidaddatosnomenclador = ? ", $params['idcentrobalance']
            );
        }
        $conn = Doctrine_Manager::connection();
        if ($escontar == false) {
            $query = self::listarIndicadoresDemandadosV1Auxil($addwhere, $addhaving);
        }
        $paramsQuery = array_merge($paramsQuery, $paramsQueryHaving);
        $paramsQueryTotal = $paramsQuery;
        $paramsQuery[] = $params['start'];
        $paramsQuery[] = $params['limit'];
        if ($escontar == false) {
            $res = $conn->execute($query, $paramsQuery);
            $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
        }
        $res =self::listarIndicadoresDemandadosV1Aux($addwhere, $addhaving, $paramsQueryTotal);
        $data->total = $res[0]['total'] ? $res[0]['total'] : '0';
        $data->importetotal = number_format($res[0]['importetotal'], 6, '.', '');
        $data->importetotal = number_format($res[0]['importesatisfecha'], 6, '.', '');
        $data->importetotal = number_format($res[0]['importedns'], 6, '.', '');

        $arrayUms = array();
        $arrayCbs = array();
        $integrator = ZendExt_IoC::getInstance();
        if (is_array($data->data)) {
            foreach ($data->data as $k => $value) {

                if ($arrayCbs['ident_' . $value['identidad']] == null) {
                    $datenti = $this->integrator->metadatos->DameEstructura($value['identidad']);
                    $arrayCbs['ident_' . $value['identidad']] = $datenti[0]->denominacion;
                }
                $data->data[$k]['denominacioncb'] = $arrayCbs['ident_'. $value['identidad']];

                if ($arrayUms['idind_' . $value['idindicador']] == null) {
                    $unidades
                        = $integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($value['idumedida']));
                    $arrayUms['idind_' . $value['idindicador']] = $unidades->abreviatura;
                }
                $data->data[$k]['umedida'] = $arrayUms['idind_'. $value['idindicador']];

                $data->data[$k]['satisfecha'] = number_format($value['satisfecha'], 6, '.', '');
                $data->data[$k]['esd'] = number_format(
                    round(($value['excedente'] - $value['satisfecha']), 6), 6, '.', ''
                );
                $data->data[$k]['porciento'] = round(
                    ($data->data[$k]['satisfecha'] * 100) / $data->data[$k]['demanda'], 2
                );
                $data->data[$k]['demanda'] = number_format($value['demanda'], '3', '.', ',');
                $data->data[$k]['importe'] = number_format(
                    round(($data->data[$k]['satisfecha']   * $data->data[$k]['precio']), 6), 6, '.', ''
                );
            }
        }
        return $data;
    }

    public function listarIndicadoresDemandadosV1Auxil($addwhere, $addhaving)
    {
        $query
            = "SELECT DISTINCT aecb.idindicador,  aecb.identidad,aecb.idejercicio, SUM(aecb.demanda) as demanda,
                         ind.codigo,  ind.denominacion, ind.numeropieza, ipnif.precio, ipnif.preciodivisa as preciomlc,
                         ind.idumedida, edn.identidaddatosnomenclador as idcentrobalance,
                         COALESCE(alias.redistribucion,0) as satisfecha,
                         COALESCE(aliasae.excedente,0) as excedente
                   FROM mod_planificacion.dat_ajusteexistenciacb aecb
                   INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                   ON( edn.identidad = aecb.identidad AND edn.iddatosnomenclador = 1 AND aecb.idejercicio = ?)
                   LEFT JOIN (SELECT DISTINCT rde.idindicador,  SUM(rde.cantidad) as redistribucion, rde.idejercicio
                                     FROM mod_planificacion.dat_redistribucionexcedente rde
                                     GROUP BY rde.idindicador,rde.idejercicio ) as alias
                   ON( alias.idindicador =  aecb.idindicador AND alias.idejercicio = aecb.idejercicio)
                  LEFT JOIN (SELECT DISTINCT ae.idindicador,  SUM(ae.coberturatotalestimada) as excedente,
                                     ae.idejercicio
                                     FROM mod_planificacion.dat_ajusteexistencia ae
                                     GROUP BY ae.idindicador,ae.idejercicio ) as aliasae
                   ON( aliasae.idindicador =  aecb.idindicador
                   AND aliasae.idejercicio = aecb.idejercicio)
                   INNER JOIN mod_datosmaestros.nom_indicador ind ON( ind.idindicador = aecb.idindicador  )
                   INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador = ipnif.idindicador
                   WHERE true $addwhere
                   GROUP BY aecb.idindicador,aecb.identidad, ind.codigo,  ind.denominacion, ind.numeropieza,
                            ipnif.precio, ipnif.preciodivisa, ind.idumedida, edn.identidaddatosnomenclador,
                            aecb.idejercicio, alias.redistribucion,aliasae.excedente
                   HAVING SUM(aecb.demanda) >0 $addhaving
                   ORDER BY ind.codigo
                   OFFSET ? LIMIT ? ";
        return $query;
    }

    public function listarIndicadoresDemandadosV1Aux($addwhere, $addhaving, $paramsQueryTotal)
    {
        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT COUNT( DISTINCT aecb.idindicador ) as total, SUM(rde.cantidad * ipnif.precio) as importetotal
                         FROM mod_planificacion.dat_ajusteexistenciacb aecb
                         INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                         ON( edn.identidad = aecb.identidad AND edn.iddatosnomenclador = 1)
                         LEFT JOIN mod_planificacion.dat_redistribucionexcedente rde
                         ON( rde.idindicador =  aecb.idindicador
                         AND rde.idejercicio = aecb.idejercicio)
                         INNER JOIN mod_datosmaestros.nom_indicador ind
                         ON( ind.idindicador = aecb.idindicador AND aecb.idejercicio = ?)
                         INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif on ind.idindicador = ipnif.idindicador
                         WHERE  true $addwhere
                         HAVING SUM(aecb.demanda) >0 $addhaving
                         ";
        $res = $conn->execute($query, $paramsQueryTotal);
        return $res->fetchAll(PDO::FETCH_ASSOC);
    }


    public function listarRedistribucion($params)
    {
        $idejercicio = $params['idejercicio'];
        $paramsQuery = array();
        $paramsQuery[] = $params['idcentrobalance'];
        $paramsQuery[] = $idejercicio;
        $paramsQuery[] = $params['idindicador'];

        $addwhere = 'WHERE TRUE ';
        $addhaving = '';
        $groupby = '';
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                $cond = "=";
                if ($datos['data']['comparison'] == "gt") {
                    $cond = ">";
                } elseif ($datos['data']['comparison'] == "lt") {
                    $cond = "<";
                }
                if ($datos ['field'] == 'prioridad') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "pcb.prioridad {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'denespecialidad') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "esp.idespecialidad {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'cantdisponible') {
                    self::addWhereConParams(
                        $addhaving, $paramsQuery, "SUM( ae.coberturatotalestimada ) {$cond} ? ",
                        $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'cantasignado') {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery, "COALESCE(rde.cantidad,0)  {$cond} ? ", $datos ['data'] ['value']
                    );
                } elseif ($datos ['field'] == 'cantsindistribuir') {
                    $groupby = 'GROUP BY rde.cantidad';
                    self::addWhereConParams(
                        $addhaving, $paramsQuery, "(SUM( ae.coberturatotalestimada ) - COALESCE(rde.cantidad,0))
                        {$cond} ? ", $datos ['data'] ['value']
                    );
                }
            }
        }


        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT DISTINCT esp.idespecialidad, esp.denespecialidad,
                            SUM( ae.coberturatotalestimada ) as cantdisponible,
                            COALESCE(rde.cantidad,0) as cantasignado,
                            (SUM( ae.coberturatotalestimada ) - COALESCE(rde.cantidad,0))
                             as cantsindistribuir  , pcb.prioridad
                FROM  mod_datosmaestros.nom_especialidad esp
                INNER JOIN mod_planificacion.dat_prioridadcentrobalance pcb
                ON( pcb.idespecialidad = esp.idespecialidad AND pcb.idcentrobalance = ? )
                INNER JOIN mod_estructuracomp.dat_estructura estruc  ON( estruc.idespecialidad = esp.idespecialidad )
                INNER JOIN mod_planificacion.dat_ajusteexistencia ae
                ON( estruc.idestructura = ae.identidad AND  ae.idejercicio = ? AND ae.idindicador = ?  )
                LEFT JOIN mod_planificacion.dat_redistribucionexcedente rde
                ON( esp.idespecialidad = rde.idespecialidad AND rde.idindicador = ae.idindicador
                 AND rde.idejercicio = ae.idejercicio  )
                {$addwhere}
                GROUP BY esp.idespecialidad,esp.denespecialidad,rde.cantidad, pcb.prioridad
                HAVING SUM( ae.coberturatotalestimada ) > 0 {$addhaving}
                ORDER BY pcb.prioridad
                OFFSET ?
                LIMIT ? ";
        $paramsQueryTotal = $paramsQuery;
        $paramsQuery[] = $params['start'];
        $paramsQuery[] = $params['limit'];
        $result = $conn->execute($sql, $paramsQuery);
        $data->data = $result->fetchAll(PDO::FETCH_ASSOC);
        $data->total = self::totalListarRedistribucion($addwhere, $groupby, $addhaving, $paramsQueryTotal);
        return $data;
    }

    public function totalListarRedistribucion($addwhere, $groupby, $addhaving, $paramsQueryTotal)
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT COUNT( DISTINCT esp.idespecialidad ) as total
                FROM mod_datosmaestros.nom_especialidad esp
                INNER JOIN mod_planificacion.dat_prioridadcentrobalance pcb
                ON( pcb.idespecialidad = esp.idespecialidad AND pcb.idcentrobalance = ? )
                INNER JOIN mod_estructuracomp.dat_estructura estruc
                ON( estruc.idespecialidad = esp.idespecialidad )
                INNER JOIN mod_planificacion.dat_ajusteexistencia ae
                ON( estruc.idestructura = ae.identidad AND  ae.idejercicio = ? AND ae.idindicador = ?  )
                LEFT JOIN mod_planificacion.dat_redistribucionexcedente rde ON( esp.idespecialidad = rde.idespecialidad
                AND rde.idindicador = ae.idindicador AND rde.idejercicio = ae.idejercicio  )
                {$addwhere}
                {$groupby}
                HAVING SUM( ae.coberturatotalestimada ) > 0  {$addhaving}
                ";
        $result = $conn->execute($sql, $paramsQueryTotal);
        $data->total = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data->total[0]['total'];
    }

    public function redistribuirExcedente($params)
    {
        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $idejercicio[0]['idejercicio'];
        $paramsQuery = array("{" . $params['idcentrobalance'] . "}", $idejercicio);
        $query = "select * from mod_planificacion.f_redistribucionexcedente(?,?);";
        $conn = Doctrine_Manager::connection();
        $result = $conn->execute($query, $paramsQuery);
        $result = $result->fetchAll(PDO::FETCH_ASSOC);
        return ($result[0]['f_redistribucionexcedente']) ? '21' : '23';
    }

    public function exportar($params)
    {
        $params['start'] = '0';
        $params['limit'] = '0';
        $cant = $this->listarIndicadoresDemandados($params, true)->total;
//        header("Pragma: public");
//        header("Expires: " . date("D:M:Y"));
//        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
//        header("Content-Type: application/force-download");
//        header("Content-Type: application/octet-stream");
//        header("Content-Type: application/download");
//        header("Content-Disposition: attachment;filename=calculos.xls");
//        header("Content-Transfer-Encoding: binary ");

        echo '<caption>  </caption>';
        echo "<table border =0 ><tr> </tr></table>";
        echo "
        <table border=1 cellspacing=0 width=60%>";
        echo "<tr><td colspan = 12> <b>Demanda de indicadores</b> </td> <td colspan =5>
              <b>Especialdades abastecedoras</b> </td></tr>";

        echo "<th align=left>Centro balance</th>
             <th align=left>Código</th>
             <th align=left>Nro pieza</th>
             <th align=left >Denominacion</th>
             <th align=left >UM</th>
             <th align=left >Precio</th>
             <th align=left >Precio mlc</th>
             <th align=left >Demanda</th>
             <th align=left >Satisfecha</th>
             <th align=left >ESD</th>
             <th align=left >Porciento</th>            
             <th align=left>Importe</th> 
             <th align=left>Prioridad</th> 
             <th align=left>Especialidad</th>  
              <th align=left>Disponible</th>  
              <th align=left>Asignado</th>  
              <th align=left>Sin distribuir</th>  
        ";

        $cantxpag = 10000;
        $cantpag = (int)($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        //$offset = 0; //start
        //$paso = $cantxpag; //limit
        //$cantTuplas = 0;
        for ($i = 0; $i < $cantpag; $i++) {
            echo 'dsd';
        }
        echo '</table>';
    }

    public function listarProdPorEsp($params)
    {
        $paramsQuery = array();
        $paramsQuery[]
            = $params['idespecialidadsisplan']; //idespecialidad sisplan
        $paramsQuery[] = $params['idindicador'];
        $addwhere = '';
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                //strings
                if ($datos ['field'] == 'um'
                    || $datos ['field'] == 'deposito'
                ) {
                    self::addWhereConParams(
                        $addwhere, $paramsQuery,
                        "upper(prodconmat.{$datos ['field']}) LIKE ? ",
                        strtoupper("%" . $datos ['data'] ['value'] . "%")
                    );
                } elseif ($datos ['field'] == 'deposito' || $datos ['field'] == 'lugar'
                    || $datos ['field'] == 'existencia' || $datos ['field'] == 'cantidaddisponible'
                    || $datos ['field'] == 'importetotal' || $datos ['field'] == 'preciopromedio'
                    || $datos ['field'] == 'preciounitario'
                ) {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    self::addWhereConParams(
                        $addwhere, $paramsQuery,
                        "prodconmat.{$datos ['field']} {$cond} ? ",
                        $datos ['data'] ['value']
                    );
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT eces.idespecialidadconmat,  prodconmat.*
                FROM mod_planifintegracion.dat_espconmatentidadsisplan  eces
                INNER JOIN mod_estructuracomp.dat_estructura estop
                ON( estop.idestructura = eces.identidadsisplan AND estop.idespecialidad = ? )
                INNER JOIN mod_planifintegracion.dat_productoconmat prodconmat
                ON( prodconmat.idespecialidad = eces.idespecialidadconmat )
                INNER JOIN mod_datosmaestros.nom_indicador ind                
                ON( prodconmat.codigoprod =  ind.codigo AND ind.idindicador = ? )
                WHERE true {$addwhere}                
                OFFSET ?
                LIMIT ? "; //pcb.idcentrobalance = ? AND $addwhere WHERE  alias.idindicador = ?
        $paramsQueryTotal = $paramsQuery;
        $paramsQuery[] = $params['start'];
        $paramsQuery[] = $params['limit'];
        $result = $conn->execute($sql, $paramsQuery);
        $data->data = $result->fetchAll(PDO::FETCH_ASSOC);
        $data->total = self::listarProdPorEspAux($addwhere, $paramsQueryTotal);
        return $data;
    }
    public function listarProdPorEspAux($addwhere, $paramsQueryTotal)
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "SELECT COUNT( prodconmat.idproducto ) as total
                FROM mod_planifintegracion.dat_espconmatentidadsisplan  eces
                INNER JOIN mod_estructuracomp.dat_estructura estop
                ON( estop.idestructura = eces.identidadsisplan AND estop.idespecialidad = ? )
                INNER JOIN mod_planifintegracion.dat_productoconmat prodconmat
                ON( prodconmat.idespecialidad = eces.idespecialidadconmat )
                INNER JOIN mod_datosmaestros.nom_indicador ind
                ON( prodconmat.codigoprod =  ind.codigo AND ind.idindicador = ? )
                WHERE true {$addwhere}
                ";
        $result = $conn->execute($sql, $paramsQueryTotal);
        $data->total = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data->total[0]['total'];
    }

    public function ListarProductPadres($parametros)
    {
        $conn = Doctrine_Manager::connection();
        $paramsQuery = array();
        $myidentidad = $parametros['identidad'];
        $addwhere = "";
        //$productos = " Where true";
        //$whereViaAdq = "";
        //$situacion = "";
        //$whereOrganoSat = "";
        $demanda = "";
        $addHaving = " HAVING true";
        $centbalance = DatEntidaddatosnomenclador::getIddatosnomenclador($myidentidad);
        //comportamiento de la entidad
        $centrobalance = "false";
        $organodemandante = "false";
        foreach ($centbalance as $s) {
            if ($s['iddatosnomenclador'] == 1) {   //centro de balance
                $centrobalance = "true";
            } elseif ($s['iddatosnomenclador'] == 2) {   //organo demandante
                $organodemandante = "true";
            }
        }

        if ($centrobalance == "true") {
            $demanda
                = "SUM(productos.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte	
                                            WHERE idindicador = productos.idindicador AND idejercicio = "
                . $parametros['idejercicio'] . ") -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myidentidad
					AND idindicador = productos.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . "),0))";
        } elseif ($organodemandante == "true") {
            $demanda
                = "SUM(COALESCE(productos.necesidad,0)) - (SELECT COALESCE(SUM(cpe),0)
                            FROM mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN (SELECT f5.idfila
                                            FROM mod_estructuracomp.nom_filaestruc f5
                                            WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc
                                             f3 WHERE f3.idfila = $myidentidad)
                                            AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc
                                            f4 WHERE f4.idfila = $myidentidad))
                                            AND odcte1.idindicador = productos.idindicador
                                            AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")";
        }

        $cte = "COALESCE(ae.coberturatotalestimada,0)";
        //tratamiento del filtro
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams($addwhere, $paramsQuery, "i.codigo  LIKE ? ", ("$s%"));
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(i.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'unidadmedida') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(um.denominacionunidadmedida)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );

                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(i.numeropieza)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'denominacioncb') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(e.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'coberturatotalestimada_condicion1'  || $p == 'coberturatotalestimada_condicion2'
                        || $p == 'coberturatotalestimada_condicion3'
                    ) {
                        self::addHavigConParamsHaving(
                            $addHaving, "productos.coberturatotalestimada"
                            . $s['condicion'], $s['coberturatotalestimada']
                        );
                    } elseif ($p == 'demanda_condicion1'  || $p == 'demanda_condicion2' || $p == 'demanda_condicion3') {
                        self::addHavigConParamsHaving($addHaving, "$demanda " . $s['condicion'], $s['demanda']);
                    } elseif ($p == 'situacion') {
                        if ($s['demanda'] == 'Ocioso') {
                            self::addHavigConParamsHaving($addHaving, "$demanda " . " = ", 0);
                        }
                    }
                }
            }
        }
        //$comparacionElab = "";
        //consulta general para obtener los indicadores

        $consult
            = "SELECT
                    productos.idindicador,  productos.codigo,  productos.numeropieza, productos.denominacion,
                    productos.centrobalance,  productos.denominacioncb, productos.unidadmedida,
				(CASE WHEN $myidentidad = productos.centrobalance
	then  COALESCE(SUM(productos.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe 
                            FROM mod_planificacion.dat_odcte odcte	
                                            WHERE idindicador = productos.idindicador
                                            AND idejercicio = "
            . $parametros['idejercicio'] . ") -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
                    + COALESCE(reservaministerial,0)  + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myidentidad	AND idindicador = productos.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . "),0)),0)
	else COALESCE(SUM(COALESCE(productos.necesidad,0)) - (SELECT COALESCE(SUM(cpe),0)
                            FROM mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN (SELECT f5.idfila
                                            FROM mod_estructuracomp.nom_filaestruc f5
                                            WHERE f5.lft >= (SELECT f3.lft
                                            FROM mod_estructuracomp.nom_filaestruc f3
                                             WHERE f3.idfila = $myidentidad)  AND f5.rgt <= (SELECT f4.rgt
                                            FROM mod_estructuracomp.nom_filaestruc f4
                                            WHERE f4.idfila = $myidentidad))
                                            AND odcte1.idindicador = productos.idindicador
                                            AND odcte1.idejercicio = "
            . $parametros['idejercicio'] . "),0) end) as demanda,
					productos.cer,	productos.coberturatotalestimada
                    FROM (SELECT i.idindicador,  i.codigo, i.numeropieza, i.denominacion,
							(CASE WHEN COALESCE(p.cantidad,0)=0
		                    then  0
	                        else COALESCE($cte,0)/COALESCE(p.cantidad,0) end) as cer,
							SUM(p.cantidad + p.ajuste) as necesidad, e.denominacion as denominacioncb,
							e.idestructura as centrobalance, um.denominacionunidadmedida as unidadmedida, $cte as coberturatotalestimada
                            FROM mod_planificacion.dat_planificacion p
                            INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
                            INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                            on p.idcentrobalance = edn.identidaddatosnomenclador
                            INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
                            INNER JOIN mod_planificacion.dat_entidadmodelo em
                             on p.identidadmodelo = em.identidadmodelo
                            LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador = ae.idindicador
                            AND ae.identidad = $myidentidad AND ae.idejercicio ="
            . $parametros['idejercicio'] . ")
                            LEFT JOIN mod_planificacion.dat_odcte odcte on (i.idindicador = odcte.idindicador
                            AND odcte.identidad= em.identidad AND em.idmodelo = odcte.idmodelo
                             AND odcte.idejercicio ="
            . $parametros['idejercicio'] . ")
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
                            INNER JOIN mod_planificacion.nom_datosnomenclador dn
                            ON (dn.iddatosnomenclador = i.idnaturaleza)
                            WHERE em.identidad IN
                            (SELECT f.idfila
                            FROM mod_estructuracomp.nom_filaestruc f
                            WHERE f.lft >= (SELECT f1.lft FROM mod_estructuracomp.nom_filaestruc f1
                            WHERE f1.idfila = $myidentidad)
                            AND f.rgt <= (SELECT f2.rgt FROM mod_estructuracomp.nom_filaestruc f2
                             WHERE f2.idfila = $myidentidad)) AND i.estado=1
                            AND p.idejercicio = " . $parametros['idejercicio'] . "
							$addwhere
                            Group by i.idindicador,p.cantidad,e.idestructura,i.codigo,
                            i.numeropieza,i.denominacion, e.denominacion,um.denominacionunidadmedida,ae.coberturatotalestimada
                            order by i.codigo ) as productos
					Group by productos.idindicador, productos.codigo, productos.numeropieza, productos.denominacion,
					productos.centrobalance,  productos.denominacioncb, productos.unidadmedida,productos.cer,
                    productos.coberturatotalestimada
					$addHaving
                    order by productos.codigo";

        //cuando se exportan los datos no tiene ni limite ni start.
        if ($start != "" || $limit != "") {
            $start = $parametros['start'];
            $limit = $parametros['limit'];
            $consult .= " OFFSET $start LIMIT $limit";
        }

        $res = $conn->execute($consult, $paramsQuery);
        $arrayproductos = $res->fetchAll(PDO::FETCH_ASSOC);
        $resultado['data'] = $arrayproductos;

        foreach ($resultado['data'] as $key => $s) {
            if ($s['demanda'] == 0) {
                $resultado['data'][$key]['situacion'] = "Ocioso";
            } elseif (($s['demanda'] > 0 && $s['demanda'] < $s['coberturatotalestimada'])
                && ($s['coberturatotalestimada'] > 1)
            ) {
                $resultado['data'][$key]['situacion'] = "Lento Movimiento";
            } else {
                $resultado['data'][$key]['situacion'] = "Inventario &uacute;til";
            }
        }
        $resultado['total'] = self::totalListarProductPadres($myidentidad, $parametros, $start, $limit);
        $resultado['centrobalance'] = $centrobalance;
        $resultado['organodemandante'] = $organodemandante;

        return $resultado;

    }
    public function totalListarProductPadres($myidentidad, $parametros, $start, $limit)
    {
        $conn = Doctrine_Manager::connection();
        $tol
            = "SELECT
		count(datos.idindicador) as total
		from (SELECT  productos.idindicador
                    FROM (SELECT i.idindicador
                            FROM mod_planificacion.dat_planificacion p
                            INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif
                            on i.idindicador = ipnif.idindicador
                            INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                            on p.idcentrobalance = edn.identidaddatosnomenclador
                            INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
                            INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo = em.identidadmodelo
                            LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador = ae.idindicador
                            AND ae.identidad = $myidentidad AND ae.idejercicio ="
            . $parametros['idejercicio'] . ")
                            LEFT JOIN mod_planificacion.dat_odcte odcte on (i.idindicador = odcte.idindicador
                            AND odcte.identidad= em.identidad AND em.idmodelo = odcte.idmodelo
                             AND odcte.idejercicio ="
            . $parametros['idejercicio'] . ")
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = i.idumedida)
                            INNER JOIN mod_planificacion.nom_datosnomenclador dn
                            ON (dn.iddatosnomenclador = i.idnaturaleza)
                            WHERE em.identidad IN(SELECT f.idfila
                            FROM mod_estructuracomp.nom_filaestruc f
                            WHERE f.lft >= (SELECT f1.lft FROM mod_estructuracomp.nom_filaestruc f1
                            WHERE f1.idfila = $myidentidad)
                            AND f.rgt <= (SELECT f2.rgt FROM mod_estructuracomp.nom_filaestruc f2
                            WHERE f2.idfila = $myidentidad)) AND i.estado=1
                            AND p.idejercicio = " . $parametros['idejercicio'] . "
                            Group by i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,i.numeropieza,
                            ipnif.flete,ipnif.contingencia,
                            i.denominacion,e.denominacion,um.abreviaturaunidadmedida,dn.denominacion,ae.coberturatotalestimada
                            order by i.codigo ) as productos
                    Group by productos.idindicador
                    order by productos.idindicador) as datos";
        if ($start != "" || $limit != "") {
            $start = 0;
            $limit = 20;
            $tol .= " OFFSET $start LIMIT $limit";
        }
        $total = $conn->execute($tol);
        $tolt = $total->fetchAll(PDO::FETCH_ASSOC);
        return $tolt[0]['total'];
    }


    public function ListarProductHijas($parametros)
    {
        $conn = Doctrine_Manager::connection();
        $paramsQuery = array();
        $myidentidad = $parametros['identidad'];
        $addwhere = "";
        //$productos = " Where true";
        //$whereViaAdq = "";
        //$situacion = "";
        //$whereOrganoSat = "";
        $demanda = "";
        $addHaving = " HAVING true";
        $centbalance = DatEntidaddatosnomenclador::getIddatosnomenclador($myidentidad);
        //comportamiento de la entidad
        $centrobalance = "false";
        $organodemandante = "false";
        foreach ($centbalance as $s) {
            if ($s['iddatosnomenclador'] == 1) {   //centro de balance
                $centrobalance = "true";
            } elseif ($s['iddatosnomenclador'] == 2) {   //organo demandante
                $organodemandante = "true";
            }
        }

        if ($centrobalance == "true") {
            $demanda
                = "SUM(productos.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                            FROM mod_planificacion.dat_odcte odcte	
                                            WHERE idindicador = productos.idindicador
                                            AND idejercicio = "
                . $parametros['idejercicio'] . ") -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0) + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myidentidad AND idindicador = productos.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . "),0))";
        } elseif ($organodemandante == "true") {
            $demanda
                = "SUM(COALESCE(productos.necesidad,0)) - (SELECT COALESCE(SUM(cpe),0)
                            FROM mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN (SELECT f5.idfila
                                            FROM mod_estructuracomp.nom_filaestruc f5
                                            WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3
                                            WHERE f3.idfila = $myidentidad)
                                            AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4
                                            WHERE f4.idfila = $myidentidad))
                                            AND odcte1.idindicador = productos.idindicador
                                            AND odcte1.idejercicio = "
                . $parametros['idejercicio'] . ")";
        }

        $cte = "COALESCE(ae.coberturatotalestimada,0)";
        //tratamiento del filtro
        if ($parametros['filtros']) {
            foreach ($parametros['filtros'] as $p => $s) {
                if ($s != null) {
                    if ($p == 'codigo') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "i.codigo  LIKE ? ", ("$s%")
                        );
                    } elseif ($p == 'denominacion') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(i.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'unidadmedida') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(um.denominacionunidadmedida)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );

                    } elseif ($p == 'numeropieza') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(i.numeropieza)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'denominacioncb') {
                        self::addWhereConParams(
                            $addwhere, $paramsQuery, "upper(e.denominacion)  LIKE ? ", ("%" . strtoupper($s) . "%")
                        );
                    } elseif ($p == 'coberturatotalestimada_condicion1' || $p == 'coberturatotalestimada_condicion2'
                        || $p == 'coberturatotalestimada_condicion3'
                    ) {
                        self::addHavigConParamsHaving(
                            $addHaving, "productos.coberturatotalestimada"
                            . $s['condicion'], $s['coberturatotalestimada']
                        );
                    } elseif ($p == 'demanda_condicion1' || $p == 'demanda_condicion2' || $p == 'demanda_condicion3') {
                        self::addHavigConParamsHaving($addHaving, "$demanda " . $s['condicion'], $s['demanda']);
                    } elseif ($p == 'situacion') {
                        if ($s['demanda'] == 'Ocioso') {
                            self::addHavigConParamsHaving($addHaving, "$demanda " . " = ", 0);
                        }
                    }
                }
            }
        }
        //$comparacionElab = "";
        //consulta general para obtener los indicadores

        $consult
            = "SELECT
                    productos.idindicador, productos.codigo, productos.numeropieza, productos.denominacion,
                    productos.centrobalance, productos.denominacioncb, productos.unidadmedida,
					
				(CASE WHEN $myidentidad = productos.centrobalance
		
	then  COALESCE(SUM(productos.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe 
                            FROM mod_planificacion.dat_odcte odcte	
                                            WHERE idindicador = productos.idindicador
                                            AND idejercicio = "
            . $parametros['idejercicio'] . ") -
                    (SELECT COALESCE ((SELECT SUM(COALESCE(coberturaparcialestimada,0)
                    + COALESCE(reservaministerial,0)
                     + COALESCE(cantidadeconomia,0))
					FROM mod_planificacion.dat_ajusteexistenciacb aecb
					WHERE identidad = $myidentidad AND idindicador = productos.idindicador
					AND idejercicio = " . $parametros['idejercicio'] . "),0)),0)
	else COALESCE(SUM(COALESCE(productos.necesidad,0)) - (SELECT COALESCE(SUM(cpe),0)
                            FROM mod_planificacion.dat_odcte  odcte1
                            WHERE odcte1.identidad IN (SELECT f5.idfila
                                            FROM mod_estructuracomp.nom_filaestruc f5
                                            WHERE f5.lft >= (SELECT f3.lft
                                            FROM mod_estructuracomp.nom_filaestruc f3
                                            WHERE f3.idfila = $myidentidad) AND f5.rgt <= (SELECT f4.rgt
                                            FROM mod_estructuracomp.nom_filaestruc f4
                                            WHERE f4.idfila = $myidentidad))
                                            AND odcte1.idindicador = productos.idindicador
                                            AND odcte1.idejercicio = "
            . $parametros['idejercicio'] . "),0) end) as demanda,	productos.cer,
					productos.coberturatotalestimada,	productos.necesidad,
					(SELECT COALESCE(SUM(coberturaparcialestimada),0) 
                            FROM mod_planificacion.dat_ajusteexistenciacb aecb	
                            WHERE identidad = $myidentidad  AND idindicador = productos.idindicador
                            AND idejercicio = " . $parametros['idejercicio'] . ") as coberturaparcialestimada
                    FROM (SELECT i.idindicador,  i.codigo,  ipnif.precio, ipnif.preciodivisa, i.numeropieza,
                            i.denominacion,  ipnif.flete,
							(CASE WHEN COALESCE(p.cantidad,0)=0
		                    then  0
	                        else COALESCE($cte,0)/COALESCE(p.cantidad,0) end) as cer,
                            ipnif.contingencia,	SUM(p.cantidad + p.ajuste) as necesidad,
                            e.denominacion as denominacioncb, e.idestructura as centrobalance,
                            um.denominacionunidadmedida as unidadmedida, dn.denominacion as naturaleza,
							$cte as coberturatotalestimada
                            FROM mod_planificacion.dat_planificacion p
                            INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif
                            on i.idindicador = ipnif.idindicador
                            INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                             on p.idcentrobalance = edn.identidaddatosnomenclador
                            INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
                            INNER JOIN mod_planificacion.dat_entidadmodelo em
                            on p.identidadmodelo = em.identidadmodelo
                            LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae on (p.idindicador = ae.idindicador
                            AND ae.identidad = $myidentidad AND ae.idejercicio ="
            . $parametros['idejercicio'] . ")
                            LEFT JOIN mod_planificacion.dat_odcte odcte  on (i.idindicador = odcte.idindicador
                            AND odcte.identidad= em.identidad AND em.idmodelo = odcte.idmodelo
                            AND odcte.idejercicio ="
            . $parametros['idejercicio'] . ")
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um  ON (um.idunidadmedida = i.idumedida)
                            INNER JOIN mod_planificacion.nom_datosnomenclador dn
                            ON (dn.iddatosnomenclador = i.idnaturaleza)
                            WHERE em.identidad IN
                            (SELECT f.idfila
                            FROM mod_estructuracomp.nom_filaestruc f
                            WHERE f.lft >= (SELECT f1.lft FROM mod_estructuracomp.nom_filaestruc f1
                             WHERE f1.idfila = $myidentidad)
                            AND f.rgt <= (SELECT f2.rgt FROM mod_estructuracomp.nom_filaestruc f2
                            WHERE f2.idfila = $myidentidad)) AND i.estado=1
                            AND p.idejercicio = " . $parametros['idejercicio'] . "
							$addwhere
                            Group by i.idindicador,p.cantidad,e.idestructura,e.idespecialidad,
                            i.codigo,ipnif.precio, ipnif.preciodivisa,i.numeropieza,ipnif.flete,
                            ipnif.contingencia,i.denominacion,e.denominacion,
                            um.denominacionunidadmedida,dn.denominacion,ae.coberturatotalestimada
                            order by i.codigo ) as productos
					Group by productos.idindicador,  productos.codigo,  productos.precio,  productos.preciodivisa,
                    productos.numeropieza, productos.flete, productos.contingencia,  productos.denominacion,
					productos.centrobalance, productos.necesidad, productos.denominacioncb, productos.unidadmedida,
					productos.cer, productos.naturaleza,  productos.coberturatotalestimada
					$addHaving
                    order by productos.codigo";

        //cuando se exportan los datos no tiene ni limite ni start.
        if ($start != "" || $limit != "") {
            $start = $parametros['start'];
            $limit = $parametros['limit'];
            $consult .= " OFFSET $start LIMIT $limit";
        }

        $res = $conn->execute($consult, $paramsQuery);
        $arrayproductos = $res->fetchAll(PDO::FETCH_ASSOC);
        $resultado['data'] = $arrayproductos;

        foreach ($resultado['data'] as $key => $s) {
            if ($s['demanda'] == 0) {
                $resultado['data'][$key]['situacion'] = "Ocioso";
            } elseif (($s['demanda'] > 0 && $s['demanda'] < $s['coberturatotalestimada'])
                && ($s['coberturatotalestimada'] > 1)
            ) {
                $resultado['data'][$key]['situacion'] = "Lento Movimiento";
            } else {
                $resultado['data'][$key]['situacion'] = "Inventario &uacute;til";
            }
        }
        $resultado['total'] = self::ListarProductHijasAux($myidentidad, $parametros, $start, $limit);
        $resultado['centrobalance'] = $centrobalance;
        $resultado['organodemandante'] = $organodemandante;

        return $resultado;

    }

    public function ListarProductHijasAux($myidentidad, $parametros, $start, $limit)
    {
        $conn = Doctrine_Manager::connection();
        $tol
            = "SELECT
		count(datos.idindicador) as total
		from (SELECT  productos.idindicador
                    FROM (SELECT i.idindicador
                            FROM mod_planificacion.dat_planificacion p
                            INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif ipnif
                            on i.idindicador = ipnif.idindicador
                            INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                            on p.idcentrobalance = edn.identidaddatosnomenclador
                            INNER JOIN mod_estructuracomp.dat_estructura e on edn.identidad = e.idestructura
                            INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo = em.identidadmodelo
                            LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae
                            on (p.idindicador = ae.idindicador
                            AND ae.identidad = $myidentidad AND ae.idejercicio ="
            . $parametros['idejercicio'] . ")
                            LEFT JOIN mod_planificacion.dat_odcte odcte
                            on (i.idindicador = odcte.idindicador
                             AND odcte.identidad= em.identidad AND em.idmodelo = odcte.idmodelo
                             AND odcte.idejercicio ="
            . $parametros['idejercicio'] . ")
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (um.idunidadmedida = i.idumedida)
                            INNER JOIN mod_planificacion.nom_datosnomenclador dn
                            ON (dn.iddatosnomenclador = i.idnaturaleza)
                            WHERE em.identidad IN(SELECT f.idfila
                            FROM mod_estructuracomp.nom_filaestruc f
                            WHERE f.lft >= (SELECT f1.lft FROM mod_estructuracomp.nom_filaestruc f1
                             WHERE f1.idfila = $myidentidad)
                            AND f.rgt <= (SELECT f2.rgt FROM mod_estructuracomp.nom_filaestruc f2
                            WHERE f2.idfila = $myidentidad))  AND i.estado=1
                            AND p.idejercicio = " . $parametros['idejercicio'] . "
                            Group by i.idindicador,i.codigo,ipnif.precio,ipnif.preciodivisa,i.numeropieza,
                            ipnif.flete,ipnif.contingencia,i.denominacion,e.denominacion,um.abreviaturaunidadmedida,
                            dn.denominacion,ae.coberturatotalestimada
                            order by i.codigo ) as productos
                    Group by productos.idindicador
                    order by productos.idindicador) as datos";
        if ($start != "" || $limit != "") {
            $tol .= " OFFSET $start LIMIT $limit";
        }
        $total = $conn->execute($tol);
        $tolt = $total->fetchAll(PDO::FETCH_ASSOC);
        return $tolt[0]['total'];
    }

    public function exportarReportes($params)
    {
        $dat = $this->ListarProductHijas($params);
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=calculos.xls");
        header("Content-Transfer-Encoding: binary ");

        echo '<caption>  </caption>';
        echo "<table border =1 ><tr> </tr></table>";
        echo "
        <table border=1 cellspacing=0 width=60%>";

        echo "<th align=left>C&oacute;digo</th>
             <th align=left>Nro pieza</th>
             <th align=left >Denominaci&oacute;n</th>
             <th align=left >UM</th>
			 <th align=left>Centro balance</th>
             <th align=left >Demanda</th>
			 <th align=left >CTE</th>
			 <th align=left >CER</th>
			 <th align=left >Situaci&oacute;n</th>
        ";
        $cantxpag = 10000;
        $cantpag = (int)($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        //$offset = 0; //start
        //$paso = $cantxpag; //limit
        //$cantTuplas = 0;
        foreach ($dat['data'] as $indicador) {
            echo "<tr>\n";
            echo "<td style=\"mso-number-format:'@';\">" . $indicador['codigo']
                . "</td>\n";
            echo "<td>" . $indicador['numeropieza'] . "</td>\n";
            echo "<td>" . $indicador['denominacion'] . "</td>\n";
            echo "<td>" . $indicador['unidadmedida'] . "</td>\n";
            echo "<td>" . $indicador['denominacioncb'] . "</td>\n";
            echo "<td>" . $indicador['demanda'] . "</td>\n";
            echo "<td>" . $indicador['coberturatotalestimada'] . "</td>\n";
            echo "<td>" . $indicador['cer'] . "</td>\n";
            echo "<td>" . $indicador['situacion'] . "</td>\n";
            echo "</tr>\n";
        }


        echo "<tr>\n";
        echo "<th>Total:</th>\n";
        echo "</tr>\n";
        echo "<tr>\n";
        echo "<td>" . $dat['total'] . "</td>\n";
        echo "</tr>\n";


        echo '</table>';
    }

    public function listarCentroBalance($integrator)
    {
        $idcentrobalance = 1; //numero fijo en la BD para Nomdatosnomenclador
        $centrobalance
            = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
        foreach ($centrobalance as $k => $valor) {
            $dat [$k] ['idcentrobalance'] = $valor ['identidad'];
            $datosentidad = $integrator->metadatos->DameEstructura($valor ['identidad']);
            $dat [$k] ['denom'] = $datosentidad [0]->denominacion;
            $dat [$k] ['identidaddatosnomenclador'] = $valor ['identidaddatosnomenclador'];
        }
        return $dat;
    }
}








