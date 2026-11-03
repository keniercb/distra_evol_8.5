<?php class DatEjecucionoaceModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function idIndic()
    {
        $conn = Doctrine_Manager::connection();
        $sql
            = "select
	s.idindicador
	from
	mod_planificacion.dat_ejecucionoace ece  LEFT OUTER JOIN
	(select 0 as demanda, 0 as importedemanda, dei.idejecucionoace,
        dei.idindicador, 0 as idajusteexistenciacb,dei.cantidad,
        dei.idejecucionoaceindicador, 0 as idejecucionoacedemanda 
        from mod_planificacion.dat_ejecucionoaceindicador dei
         union select cb.demanda, cb.importedemanda, ed.idejecucionoace , 
         cb.idindicador, ed.idajusteexistenciacb, 0 as cantidad, 0 as 
         idejecucionoaceindicador, ed.idejecucionoacedemanda from  
         mod_planificacion.dat_ejecucionoacedemanda ed
         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb ON 
         (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s on 
         (s.idejecucionoace = ece.idejecucionoace)  
	 where 'OACE' in ( SELECT via.denominacion from 
         mod_planificacion.dat_ejecucionoace ece 
         LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd ON 
         (ece.idejecucionoace = pd.idejecucionoace)
         LEFT OUTER JOIN
         (select 0 as demanda, 0 as importedemanda, dei.idejecucionoace,
         dei.idindicador, 0 as idajusteexistenciacb,dei.cantidad,
         dei.idejecucionoaceindicador, 0 as idejecucionoacedemanda 
         from mod_planificacion.dat_ejecucionoaceindicador dei
         union select cb.demanda, cb.importedemanda, ed.idejecucionoace , 
         cb.idindicador, ed.idajusteexistenciacb, 0 as cantidad, 0 as 
         idejecucionoaceindicador, ed.idejecucionoacedemanda from  
         mod_planificacion.dat_ejecucionoacedemanda ed
         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb ON 
         (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s on
         (s.idejecucionoace = ece.idejecucionoace)  INNER JOIN 
         mod_datosmaestros.nom_indicador ni ON (ni.idindicador = s.idindicador)
         INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva 
         ON (ni.idindicador = niva.idindicador)   INNER JOIN 
         mod_datosmaestros.nom_viaadquisicion via ON (via.idviaadquisicion = 
         niva.idviaadquisicion) )
         group by s.idindicador";
        $res = $conn->execute($sql);
        $data = $res->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

    public function listarDemanda($params, $idindicador)
    {
        $EJECUTADO = "(SELECT sum(ece.ejecutado)
              FROM mod_planificacion.dat_ejecucionoace ece
         LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd ON 
         (ece.idejecucionoace = pd.idejecucionoace)
         LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador 
         edn ON (ece.identidad = edn.identidaddatosnomenclador)
         LEFT OUTER JOIN(select 0 as demanda, 0 as importedemanda, 
         dei.idejecucionoace,dei.idindicador, 0 as idajusteexistenciacb,
         dei.cantidad,dei.idejecucionoaceindicador from 
         mod_planificacion.dat_ejecucionoaceindicador dei
          union
         select cb.demanda,cb.importedemanda,ed.idejecucionoace ,cb.idindicador,
         ed.idajusteexistenciacb, 0 as cantidad, 0 as idejecucionoaceindicador
         from  mod_planificacion.dat_ejecucionoacedemanda ed
         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb ON 
         (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s on 
         (s.idejecucionoace = ece.idejecucionoace)
         INNER JOIN mod_datosmaestros.nom_indicador ni ON 
         (ni.idindicador = s.idindicador)
         INNER JOIN mod_datosmaestros.nom_indicadorplanif nip ON (
         ni.idindicador = nip.idindicador)INNER JOIN 
         mod_datosmaestros.dat_indicadorviaadquisicion niva ON (ni.idindicador = 
         niva.idindicador)INNER JOIN mod_datosmaestros.nom_viaadquisicion via 
         ON (via.idviaadquisicion = niva.idviaadquisicion)
         INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface
         nviaos
         ON (niva.idindicador = nviaos.idindicador) 
         AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
        INNER JOIN mod_datosmaestros.nom_organosatisface o 
        ON (nviaos.idorganosatisface = o.idorganosatisface)
        INNER JOIN mod_datosmaestros.nom_unidadmedida um 
        ON (ni.idumedida = um.idunidadmedida)
        INNER JOIN mod_datosmaestros.nom_naturaleza n 
        ON (ni.idnaturaleza = n.idnaturaleza)
        INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep 
        ON (ece.idejercicio = ep.idejercicio)
        WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
            . $idindicador . ")";

        $IMPORTECONTRATADO
            = "(SELECT sum(ece.contratado * ece.preciocontrado)
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda 
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                  LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador 
                          edn ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 
                            0 as importedemanda, dei.idejecucionoace
                            ,dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador 
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad, 
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb 
                         ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) 
                                 s on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni 
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip 
                            ON (ni.idindicador = nip.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via 
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
 INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface nviaos 
                            ON (niva.idindicador = nviaos.idindicador) 
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o 
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
            . $idindicador . ")";
        $ADDWHERE = "";

        $ADDSUB = "";

        $conn = Doctrine_Manager::connection();


        foreach ($params['filtros'] as $s) {
            if ($s != null) {
                if ($s['field'] == 'codigo') {
                    $ADDWHERE = $ADDWHERE . ' AND ' . " ni.codigo  LIKE '%"
                        . strtoupper($s['data']['value']) . "%'";
                }
                if ($s['field'] == 'denominacion') {
                    $ADDWHERE = $ADDWHERE . ' AND '
                        . " ni.denominacion  LIKE '%" . strtoupper(
                            $s['data']['value']
                        ) . "%'";
                }
                if ($s['field'] == 'numeropieza') {
                    $ADDWHERE = $ADDWHERE . ' AND ' . " ni.numeropieza  LIKE '%"
                        . strtoupper($s['data']['value']) . "%'";
                }
                if ($s['field'] == 'viaadquisicion') {
                    $ADDWHERE = $ADDWHERE . ' AND '
                        . " via.denominacion  LIKE '%" . strtoupper(
                            $s['data']['value']
                        ) . "%'";
                }
                if ($s['field'] == 'organosatisface') {
                    $ADDWHERE = $ADDWHERE . ' AND ' . " o.denominacion  LIKE '%"
                        . strtoupper($s['data']['value']) . "%'";
                }
                if ($s['field'] == 'um') {
                    $ADDWHERE = $ADDWHERE . ' AND '
                        . " um.denominacionunidadmedida  LIKE '%" . strtoupper(
                            $s['data']['value']
                        ) . "%'";
                }
                if ($s['field'] == 'precio') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "nip.precio" . "{$cond} "
                        . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'demanda') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "s.demanda" . "{$cond} "
                        . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'importeplanif') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "s.importedemanda"
                        . "{$cond} " . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'importecontratado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "" . $IMPORTECONTRATADO
                        . "" . "{$cond} " . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'importeejecutado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "" . $EJECUTADO
                        . " * ece.precioejecutado" . "{$cond} "
                        . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'preciocontrado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "ece.preciocontrado"
                        . "{$cond} " . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'precioejecutado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "ece.precioejecutado"
                        . "{$cond} " . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'ejecutado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . ""
                        . $EJECUTADO . " {$cond} " . ($s['data']['value']) . "";
                }
            }
        }

        if ($params['idejercicio']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ece.idejercicio="
                . $params['idejercicio'] . "";

        }
        if ($params['codigo']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ni.codigo='" . $params['codigo']
                . "'";
        }
        if ($params['nupieza']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ni.numeropieza='"
                . $params['nupieza'] . "'";
        }
        if ($params['denominacion']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ni.denominacion='"
                . $params['denominacion'] . "'";
        }
        if ($params['mes']) {
            if ($params['mes'] == 0) {
                $ADDSUB = $ADDSUB;
            } else {
                $ADDSUB = $ADDSUB . ' AND ' . "ece.mes=" . $params['mes'] . "";
            }

        }
        if ($params['idmes']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ece.mes=" . $params['idmes'] . "";

        }
        if ($params['idvalor'] == 2) {

            $ADDWHERE = $ADDWHERE . ' AND ' . " 0 in 
                (SELECT sum(ece.contratado *ece.preciocontrado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda 
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                  LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador 
                         edn ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN
                            (select 0 as demanda, 0 as importedemanda,
                            dei.idejecucionoace,dei.idindicador, 
                            0 as idajusteexistenciacb,dei.cantidad,
                            dei.idejecucionoaceindicador 
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb,
                                    0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb 
                     cb ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) 
                            s on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni 
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip 
                            ON (ni.idindicador = nip.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via 
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN 
                    mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface
                            nviaos ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o 
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                . $idindicador . ")";
        } else {
            if ($params['idvalor'] == 3) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "pd.importe <= 
                   (SELECT sum(ece.contratado *ece.preciocontrado) as contratado
                    FROM mod_planificacion.dat_ejecucionoace ece
                    LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd
                    ON (ece.idejecucionoace = pd.idejecucionoace)
               LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador edn 
                    ON (ece.identidad = edn.identidaddatosnomenclador)
                    LEFT OUTER JOIN(select 0 as demanda, 
                    0 as importedemanda, dei.idejecucionoace,
                    dei.idindicador, 0 as idajusteexistenciacb,
                    dei.cantidad,dei.idejecucionoaceindicador 
                    from mod_planificacion.dat_ejecucionoaceindicador dei
                    union
                    select cb.demanda,
                    cb.importedemanda,
                    ed.idejecucionoace ,
                    cb.idindicador,
                    ed.idajusteexistenciacb, 0 as cantidad, 0 as 
                    idejecucionoaceindicador
                    from  mod_planificacion.dat_ejecucionoacedemanda ed
                    inner JOIN mod_planificacion.dat_ajusteexistenciacb cb 
                    ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s 
                    on (s.idejecucionoace = ece.idejecucionoace)
                    INNER JOIN mod_datosmaestros.nom_indicador ni 
                    ON (ni.idindicador = s.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif nip 
                    ON (ni.idindicador = nip.idindicador)
                  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva 
                    ON (ni.idindicador = niva.idindicador)
                    INNER JOIN mod_datosmaestros.nom_viaadquisicion via 
                    ON (via.idviaadquisicion = niva.idviaadquisicion)
  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface nviaos 
                    ON (niva.idindicador = nviaos.idindicador) 
                    AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                    INNER JOIN mod_datosmaestros.nom_organosatisface o 
                    ON (nviaos.idorganosatisface = o.idorganosatisface)
                    INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                    ON (ni.idumedida = um.idunidadmedida)
                    INNER JOIN mod_datosmaestros.nom_naturaleza n 
                    ON (ni.idnaturaleza = n.idnaturaleza)
                    INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep 
                    ON (ece.idejercicio = ep.idejercicio)
                    WHERE ep.actual = 1
                    and via.denominacion= 'OACE'
                    and ece.identidad=28 and s.idindicador="
                    . $idindicador . ")";

            } else {
                if ($params['idvalor'] == 4) {
                    $ADDWHERE = $ADDWHERE . ' AND ' . "(SELECT sum(ece.ejecutado 
                        *ece.precioejecutado)
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn ON (ece.identidad = 
                            edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 0 as 
                            importedemanda, dei.idejecucionoace,dei.idindicador, 
                            0 as idajusteexistenciacb,dei.cantidad,
                            dei.idejecucionoaceindicador from mod_planificacion.
                            dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad, 
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb 
                ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s on 
                (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni 
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip 
                            ON (ni.idindicador = nip.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via 
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos 
                            ON (niva.idindicador = nviaos.idindicador) 
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o 
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                        . $idindicador . ")
                            <
                             (SELECT sum(ece.contratado *ece.preciocontrado) 
                            FROM mod_planificacion.dat_ejecucionoace ece
                         LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd 
                            ON (ece.idejecucionoace = pd.idejecucionoace)
               LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador edn 
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador 
                          from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad,
                            0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                          inner JOIN mod_planificacion.dat_ajusteexistenciacb cb 
                       ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s 
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni 
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip 
                            ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via 
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos 
                            ON (niva.idindicador = nviaos.idindicador) 
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o 
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                        . $idindicador . ")";
                } else {
                    if ($params['idvalor'] == 5) {
                        $ADDWHERE = $ADDWHERE . ' AND ' . "(SELECT sum
                            (ece.ejecutado *ece.precioejecutado)
                            FROM mod_planificacion.dat_ejecucionoace ece
                         LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd 
                            ON (ece.idejecucionoace = pd.idejecucionoace)
               LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador edn 
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador 
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad,
                            0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb
                       ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s 
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni 
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via 
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.dat_indicadorviaadquis
                            icionorganosatisface nviaos 
                            ON (niva.idindicador = nviaos.idindicador) 
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o 
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                         INNER JOIN mod_planificacion.nom_ejercicioplanificacion 
                            ep ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                            . $idindicador . ")
                            >=
                             (SELECT sum(ece.contratado *ece.preciocontrado) 
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.dat_entidad
                            datosnomenclador
                          edn ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador 
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad,
                            0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                      cb ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb))
                            s on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador 
                            ni ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif 
                            nip ON (ni.idindicador = nip.idindicador)
                        INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion 
                            niva ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion 
                           via ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.dat_indicadorvia
                            adquisicionorganosatisface nviaos 
                            ON (niva.idindicador = nviaos.idindicador) 
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface 
                           o ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida
                            um ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza 
                            n ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                            . $idindicador . ")";
                    }
                }
            }
        }
        if ($params['idcant'] == 2) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "0 in
                    (SELECT sum(ece.contratado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda 
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn 
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad, 0 as 
                            idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb = 
                            cb.idajusteexistenciacb))
                            s on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni 
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif 
                            nip ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion
                           via ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador) 
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface
                           o ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                . $idindicador . ")";
        }
        if ($params['idcant'] == 3) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "demanda <= 
                (SELECT sum(ece.contratado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn 
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador 
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad, 
                            0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb = 
                            cb.idajusteexistenciacb)) s 
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador 
                            ni ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif 
                            nip ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion 
                           via ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador) 
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface
                           o ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida 
                            um ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza 
                            n ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                . $idindicador . ")";
        } else {
            if ($params['idcant'] == 4) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "(SELECT sum(ece.ejecutado)
                    as ejecutado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn 
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb = 
                            cb.idajusteexistenciacb)) s 
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador
                            ni ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif
                            nip ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion 
                           via ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador) 
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o 
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and ni.idindicador="
                    . $idindicador . ")
                    <(SELECT sum(ece.contratado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn 
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                            from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb = 
                            cb.idajusteexistenciacb)) s 
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador) AND
                            (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o 
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                    . $idindicador . ") ";
            } else {
                if ($params['idcant'] == 5) {

                    $ADDWHERE = $ADDWHERE . ' AND ' . "
                        (SELECT sum(ece.ejecutado) as ejecutado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda 
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn 
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador 
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb 
                            cb ON (ed.idajusteexistenciacb = 
                            cb.idajusteexistenciacb)) s on 
                            (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva 
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos 
                            ON (niva.idindicador = nviaos.idindicador) 
                            AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o 
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and ni.idindicador="
                        . $idindicador . ")
                                >=
                                (SELECT sum(ece.contratado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn 
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador 
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb 
                            cb ON (ed.idajusteexistenciacb = 
                            cb.idajusteexistenciacb)) s 
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni 
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                        INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion 
                            niva ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via 
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador) 
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o 
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um 
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n 
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep 
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                        . $idindicador . ") ";
                }
            }
        }
        $expcb="";
        if($params['centrobalance']!="")
         $expcb=" AND edn.identidaddatosnomenclador= {$params['centrobalance']}";
        $query
            = "SELECT

                    ni.codigo,
                    ni.numeropieza,
                    s.idindicador,
                    ni.denominacion,
                    pd.cantidad as ejecutar,
                    via.denominacion as viaadquisicion,
                    o.denominacion as organosatisface,
                    um.denominacionunidadmedida as um,
                    n.denominacion as naturaleza,
                    ece.mes,
                    ece.idejecucionoace,
                    ece.preciocontrado as preciocontrado,
                    ece.precioejecutado as precioejecutado,
                    ece.tipo,
                    s.importedemanda,
                    nip.precio,
                     (SELECT sum(pla.cantidad) as demanda
                            FROM mod_planificacion.dat_planificacion pla
                            Where s.idindicador= pla.idindicador) as demanda,
                    (SELECT sum(pla.importe) as importeplanif
                            FROM mod_planificacion.dat_planificacion pla
                            Where s.idindicador= pla.idindicador)  as importeplanif,
                    edn.identidad,
                    s.idajusteexistenciacb,
                    s.cantidad,
                    s.idejecucionoaceindicador,

                    (SELECT ece.ejecutado as ejecutado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 0 as
                            importedemanda, dei.idejecucionoace,dei.idindicador,
                            0 as idajusteexistenciacb,dei.cantidad,
                            dei.idejecucionoaceindicador from mod_planificacion.
                            dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad, 0 as
                                    idejecucionoaceindicador
                                    from  mod_planificacion.
                                    dat_ejecucionoacedemanda ed
                                    inner JOIN mod_planificacion.
                                    dat_ajusteexistenciacb cb ON
                                    (ed.idajusteexistenciacb =
                                    cb.idajusteexistenciacb)) s on (
                                    s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador nia ON
                            (nia.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif
                            nip ON (nia.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva ON (nia.idindicador
                            = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)

                            INNER JOIN mod_datosmaestros.nom_unidadmedida um ON
                            (nia.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n ON
                            (nia.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep ON (ece.idejercicio =
                            ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
            . $idindicador . " $ADDSUB limit 1) as ejecutado,

                    (SELECT ece.contratado as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn ON (ece.identidad =
                            edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 0 as
                            importedemanda, dei.idejecucionoace,dei.idindicador,
                            0 as idajusteexistenciacb,dei.cantidad,
                            dei.idejecucionoaceindicador from mod_planificacion.
                            dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                             ed.idajusteexistenciacb, 0 as cantidad, 0 as
                             idejecucionoaceindicador
                        from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb =
                            cb.idajusteexistenciacb)) s on (s.idejecucionoace =
                            ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni ON
                            (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva ON (ni.idindicador
                            = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)

                            INNER JOIN mod_datosmaestros.nom_unidadmedida um ON
                            (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n ON (
                            ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep ON (ece.idejercicio =
                            ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
            . $idindicador . " $ADDSUB limit 1) as contratado

                    FROM mod_planificacion.dat_ejecucionoace ece
                    LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd ON
                    (ece.idejecucionoace = pd.idejecucionoace)
                   LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador
                    edn ON (ece.identidad = edn.identidaddatosnomenclador)
                    LEFT OUTER JOIN(select 0 as demanda, 0 as importedemanda,
                    dei.idejecucionoace,dei.idindicador, 0 as
                  idajusteexistenciacb,dei.cantidad,dei.idejecucionoaceindicador
                  from mod_planificacion.dat_ejecucionoaceindicador dei
                    union
                    select cb.demanda,
                    cb.importedemanda,
                    ed.idejecucionoace ,
                    cb.idindicador,
                    ed.idajusteexistenciacb, 0 as cantidad, 0 as
                    idejecucionoaceindicador
                    from  mod_planificacion.dat_ejecucionoacedemanda ed
                   inner JOIN mod_planificacion.dat_ajusteexistenciacb cb ON

                   (ed.idajusteexistenciacb = cb.idajusteexistenciacb))

                    s on

                   (s.idejecucionoace = ece.idejecucionoace)
                    INNER JOIN mod_datosmaestros.nom_indicador ni ON
                    (ni.idindicador = s.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif nip ON
                    (ni.idindicador = nip.idindicador)
                    INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion
                    niva ON (ni.idindicador = niva.idindicador)
                    INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON
                    (via.idviaadquisicion = niva.idviaadquisicion)
                    INNER JOIN mod_datosmaestros.
                    dat_indicadorviaadquisicionorganosatisface nviaos ON
                    (niva.idindicador = nviaos.idindicador)
                    AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                    INNER JOIN mod_datosmaestros.nom_organosatisface o ON
                    (nviaos.idorganosatisface = o.idorganosatisface)
                    INNER JOIN mod_datosmaestros.nom_unidadmedida um ON
                    (ni.idumedida = um.idunidadmedida)
                    INNER JOIN mod_datosmaestros.nom_naturaleza n ON
                    (ni.idnaturaleza = n.idnaturaleza)
                    INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep
                    ON (ece.idejercicio = ep.idejercicio)
                    WHERE ep.actual = 1
                    and via.denominacion= 'OACE'
                    and ece.identidad=28 and ni.idindicador= " . $idindicador .
                "$expcb$ADDWHERE $ADDSUB
                    group by ece.idejecucionoace,
                    ni.codigo
                    ,ni.numeropieza
                    ,s.idindicador
                    ,ni.denominacion
                    ,via.denominacion
                    ,o.denominacion
                    ,um.denominacionunidadmedida
                    ,n.denominacion
                    ,ece.mes
                    ,ece.preciocontrado
                     ,ece.precioejecutado
                     ,s.importedemanda
                    ,ece.tipo
                    ,s.demanda
                    ,nip.precio
                    ,pd.cantidad
                    ,edn.identidad
                    ,s.idajusteexistenciacb
                    ,s.cantidad
                    ,s.idejecucionoaceindicador
                    ORDER BY
                    ece.idejecucionoace desc
                    limit 1
                ";





        $res = $conn->execute($query);

        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);


        return $data;
    }
    public function listarreporteDemanda($params, $idindicador)
    {
        $EJECUTADO = "(SELECT sum(ece.ejecutado)
              FROM mod_planificacion.dat_ejecucionoace ece
         LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd ON
         (ece.idejecucionoace = pd.idejecucionoace)
         LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador
         edn ON (ece.identidad = edn.identidaddatosnomenclador)
         LEFT OUTER JOIN(select 0 as demanda, 0 as importedemanda,
         dei.idejecucionoace,dei.idindicador, 0 as idajusteexistenciacb,
         dei.cantidad,dei.idejecucionoaceindicador from
         mod_planificacion.dat_ejecucionoaceindicador dei
          union
         select cb.demanda,cb.importedemanda,ed.idejecucionoace ,cb.idindicador,
         ed.idajusteexistenciacb, 0 as cantidad, 0 as idejecucionoaceindicador
         from  mod_planificacion.dat_ejecucionoacedemanda ed
         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb ON
         (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s on
         (s.idejecucionoace = ece.idejecucionoace)
         INNER JOIN mod_datosmaestros.nom_indicador ni ON
         (ni.idindicador = s.idindicador)
         INNER JOIN mod_datosmaestros.nom_indicadorplanif nip ON (
         ni.idindicador = nip.idindicador)INNER JOIN
         mod_datosmaestros.dat_indicadorviaadquisicion niva ON (ni.idindicador =
         niva.idindicador)INNER JOIN mod_datosmaestros.nom_viaadquisicion via
         ON (via.idviaadquisicion = niva.idviaadquisicion)
         INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface
         nviaos
         ON (niva.idindicador = nviaos.idindicador)
         AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
        INNER JOIN mod_datosmaestros.nom_organosatisface o
        ON (nviaos.idorganosatisface = o.idorganosatisface)
        INNER JOIN mod_datosmaestros.nom_unidadmedida um
        ON (ni.idumedida = um.idunidadmedida)
        INNER JOIN mod_datosmaestros.nom_naturaleza n
        ON (ni.idnaturaleza = n.idnaturaleza)
        INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep
        ON (ece.idejercicio = ep.idejercicio)
        WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
            . $idindicador . ")";

        $IMPORTECONTRATADO
            = "(SELECT sum(ece.contratado * ece.preciocontrado)
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                  LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador
                          edn ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace
                            ,dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb
                         ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb))
                                 s on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
 INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
            . $idindicador . ")";
        $ADDWHERE = "";

        $ADDSUB = "";

        $conn = Doctrine_Manager::connection();


        foreach ($params['filtros'] as $s) {
            if ($s != null) {
                if ($s['field'] == 'codigo') {
                    $ADDWHERE = $ADDWHERE . ' AND ' . " ni.codigo  LIKE '%"
                        . strtoupper($s['data']['value']) . "%'";
                }
                if ($s['field'] == 'denominacion') {
                    $ADDWHERE = $ADDWHERE . ' AND '
                        . " ni.denominacion  LIKE '%" . strtoupper(
                            $s['data']['value']
                        ) . "%'";
                }
                if ($s['field'] == 'numeropieza') {
                    $ADDWHERE = $ADDWHERE . ' AND ' . " ni.numeropieza  LIKE '%"
                        . strtoupper($s['data']['value']) . "%'";
                }
                if ($s['field'] == 'viaadquisicion') {
                    $ADDWHERE = $ADDWHERE . ' AND '
                        . " via.denominacion  LIKE '%" . strtoupper(
                            $s['data']['value']
                        ) . "%'";
                }
                if ($s['field'] == 'organosatisface') {
                    $ADDWHERE = $ADDWHERE . ' AND ' . " o.denominacion  LIKE '%"
                        . strtoupper($s['data']['value']) . "%'";
                }
                if ($s['field'] == 'um') {
                    $ADDWHERE = $ADDWHERE . ' AND '
                        . " um.denominacionunidadmedida  LIKE '%" . strtoupper(
                            $s['data']['value']
                        ) . "%'";
                }
                if ($s['field'] == 'precio') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "nip.precio" . "{$cond} "
                        . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'demanda') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "s.demanda" . "{$cond} "
                        . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'importeplanif') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "s.importedemanda"
                        . "{$cond} " . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'importecontratado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "" . $IMPORTECONTRATADO
                        . "" . "{$cond} " . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'importeejecutado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "" . $EJECUTADO
                        . " * ece.precioejecutado" . "{$cond} "
                        . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'preciocontrado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "ece.preciocontrado"
                        . "{$cond} " . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'precioejecutado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . "ece.precioejecutado"
                        . "{$cond} " . ($s['data']['value']) . "";
                }
                if ($s['field'] == 'ejecutado') {
                    $cond = "=";
                    if ($s['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($s['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $ADDWHERE = $ADDWHERE . ' AND ' . ""
                        . $EJECUTADO . " {$cond} " . ($s['data']['value']) . "";
                }
            }
        }

        if ($params['idejercicio']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ece.idejercicio="
                . $params['idejercicio'] . "";

        }
        if ($params['codigo']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ni.codigo='" . $params['codigo']
                . "'";
        }
        if ($params['nupieza']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ni.numeropieza='"
                . $params['nupieza'] . "'";
        }
        if ($params['denominacion']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ni.denominacion='"
                . $params['denominacion'] . "'";
        }
        if ($params['mes']) {
            if ($params['mes'] == 0) {
                $ADDSUB = $ADDSUB;
            } else {
                $ADDSUB = $ADDSUB . ' AND ' . "ece.mes=" . $params['mes'] . "";
            }

        }
        if ($params['idmes']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ece.mes=" . $params['idmes'] . "";

        }
        if ($params['idvalor'] == 2) {

            $ADDWHERE = $ADDWHERE . ' AND ' . " 0 in
                (SELECT sum(ece.contratado *ece.preciocontrado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                  LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador
                         edn ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN
                            (select 0 as demanda, 0 as importedemanda,
                            dei.idejecucionoace,dei.idindicador,
                            0 as idajusteexistenciacb,dei.cantidad,
                            dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb,
                                    0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                     cb ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb))
                            s on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN
                    mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface
                            nviaos ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                . $idindicador . ")";
        } else {
            if ($params['idvalor'] == 3) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "pd.importe <=
                   (SELECT sum(ece.contratado *ece.preciocontrado) as contratado
                    FROM mod_planificacion.dat_ejecucionoace ece
                    LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd
                    ON (ece.idejecucionoace = pd.idejecucionoace)
               LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                    ON (ece.identidad = edn.identidaddatosnomenclador)
                    LEFT OUTER JOIN(select 0 as demanda,
                    0 as importedemanda, dei.idejecucionoace,
                    dei.idindicador, 0 as idajusteexistenciacb,
                    dei.cantidad,dei.idejecucionoaceindicador
                    from mod_planificacion.dat_ejecucionoaceindicador dei
                    union
                    select cb.demanda,
                    cb.importedemanda,
                    ed.idejecucionoace ,
                    cb.idindicador,
                    ed.idajusteexistenciacb, 0 as cantidad, 0 as
                    idejecucionoaceindicador
                    from  mod_planificacion.dat_ejecucionoacedemanda ed
                    inner JOIN mod_planificacion.dat_ajusteexistenciacb cb
                    ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s
                    on (s.idejecucionoace = ece.idejecucionoace)
                    INNER JOIN mod_datosmaestros.nom_indicador ni
                    ON (ni.idindicador = s.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                    ON (ni.idindicador = nip.idindicador)
                  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva
                    ON (ni.idindicador = niva.idindicador)
                    INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                    ON (via.idviaadquisicion = niva.idviaadquisicion)
  INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface nviaos
                    ON (niva.idindicador = nviaos.idindicador)
                    AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                    INNER JOIN mod_datosmaestros.nom_organosatisface o
                    ON (nviaos.idorganosatisface = o.idorganosatisface)
                    INNER JOIN mod_datosmaestros.nom_unidadmedida um
                    ON (ni.idumedida = um.idunidadmedida)
                    INNER JOIN mod_datosmaestros.nom_naturaleza n
                    ON (ni.idnaturaleza = n.idnaturaleza)
                    INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep
                    ON (ece.idejercicio = ep.idejercicio)
                    WHERE ep.actual = 1
                    and via.denominacion= 'OACE'
                    and ece.identidad=28 and s.idindicador="
                    . $idindicador . ")";

            } else {
                if ($params['idvalor'] == 4) {
                    $ADDWHERE = $ADDWHERE . ' AND ' . "(SELECT sum(ece.ejecutado
                        *ece.precioejecutado)
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn ON (ece.identidad =
                            edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 0 as
                            importedemanda, dei.idejecucionoace,dei.idindicador,
                            0 as idajusteexistenciacb,dei.cantidad,
                            dei.idejecucionoaceindicador from mod_planificacion.
                            dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb
                ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s on
                (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                        . $idindicador . ")
                            <
                             (SELECT sum(ece.contratado *ece.preciocontrado)
                            FROM mod_planificacion.dat_ejecucionoace ece
                         LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd
                            ON (ece.idejecucionoace = pd.idejecucionoace)
               LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                          from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad,
                            0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                          inner JOIN mod_planificacion.dat_ajusteexistenciacb cb
                       ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                      INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                        . $idindicador . ")";
                } else {
                    if ($params['idvalor'] == 5) {
                        $ADDWHERE = $ADDWHERE . ' AND ' . "(SELECT sum
                            (ece.ejecutado *ece.precioejecutado)
                            FROM mod_planificacion.dat_ejecucionoace ece
                         LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd
                            ON (ece.idejecucionoace = pd.idejecucionoace)
               LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad,
                            0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb
                       ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.dat_indicadorviaadquis
                            icionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                         INNER JOIN mod_planificacion.nom_ejercicioplanificacion
                            ep ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                            . $idindicador . ")
                            >=
                             (SELECT sum(ece.contratado *ece.preciocontrado)
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.dat_entidad
                            datosnomenclador
                          edn ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad,
                            0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                      cb ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb))
                            s on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador
                            ni ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif
                            nip ON (ni.idindicador = nip.idindicador)
                        INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion
                            niva ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion
                           via ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.dat_indicadorvia
                            adquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface
                           o ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida
                            um ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza
                            n ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                            . $idindicador . ")";
                    }
                }
            }
        }
        if ($params['idcant'] == 2) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "0 in
                    (SELECT sum(ece.contratado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad, 0 as
                            idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb =
                            cb.idajusteexistenciacb))
                            s on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif
                            nip ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion
                           via ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface
                           o ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                . $idindicador . ")";
        }
        if ($params['idcant'] == 3) {
            $ADDWHERE = $ADDWHERE . ' AND ' . "demanda <=
                (SELECT sum(ece.contratado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                            ed.idajusteexistenciacb, 0 as cantidad,
                            0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb =
                            cb.idajusteexistenciacb)) s
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador
                            ni ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif
                            nip ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion
                           via ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface
                           o ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida
                            um ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza
                            n ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                . $idindicador . ")";
        } else {
            if ($params['idcant'] == 4) {
                $ADDWHERE = $ADDWHERE . ' AND ' . "(SELECT sum(ece.ejecutado)
                    as ejecutado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb =
                            cb.idajusteexistenciacb)) s
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador
                            ni ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif
                            nip ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion
                           via ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and ni.idindicador="
                    . $idindicador . ")
                    <(SELECT sum(ece.contratado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                            from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb =
                            cb.idajusteexistenciacb)) s
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador) AND
                            (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                    . $idindicador . ") ";
            } else {
                if ($params['idcant'] == 5) {

                    $ADDWHERE = $ADDWHERE . ' AND ' . "
                        (SELECT sum(ece.ejecutado) as ejecutado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb =
                            cb.idajusteexistenciacb)) s on
                            (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva
                            ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                            AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and ni.idindicador="
                        . $idindicador . ")
                                >=
                                (SELECT sum(ece.contratado) as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda,
                            0 as importedemanda, dei.idejecucionoace,
                            dei.idindicador, 0 as idajusteexistenciacb,
                            dei.cantidad,dei.idejecucionoaceindicador
                           from mod_planificacion.dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad,
                                    0 as idejecucionoaceindicador
                            from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb =
                            cb.idajusteexistenciacb)) s
                            on (s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni
                            ON (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                        INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion
                            niva ON (ni.idindicador = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicionorganosatisface nviaos
                            ON (niva.idindicador = nviaos.idindicador)
                           AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                            INNER JOIN mod_datosmaestros.nom_organosatisface o
                            ON (nviaos.idorganosatisface = o.idorganosatisface)
                            INNER JOIN mod_datosmaestros.nom_unidadmedida um
                            ON (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n
                            ON (ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep
                            ON (ece.idejercicio = ep.idejercicio)
                            WHERE ep.actual = 1
                            and via.denominacion= 'OACE'
                            and ece.identidad=28 and s.idindicador="
                        . $idindicador . ") ";
                }
            }
        }
        $expcb="";
        if($params['centrobalance']!="")
            $expcb=" AND edn.identidaddatosnomenclador= {$params['centrobalance']}";
        if($params['idorgano']!="")
            $expcb=" AND o.idorganosatisface= {$params['idorgano']}";
        $query
            = "SELECT

                    ni.codigo,
                    ni.numeropieza,
                    s.idindicador,
                    ni.denominacion,
                    pd.cantidad as ejecutar,
                    via.denominacion as viaadquisicion,
                    o.denominacion as organosatisface,
                    um.denominacionunidadmedida as um,
                    n.denominacion as naturaleza,
                    ece.mes,
                    ece.idejecucionoace,
                    ece.preciocontrado as preciocontrado,
                    ece.precioejecutado as precioejecutado,
                    ece.tipo,
                    s.importedemanda,
                    nip.precio,
                     (SELECT sum(pla.cantidad) as demanda
                            FROM mod_planificacion.dat_planificacion pla
                            Where s.idindicador= pla.idindicador) as demanda,
                    (SELECT sum(pla.importe) as importeplanif
                            FROM mod_planificacion.dat_planificacion pla
                            Where s.idindicador= pla.idindicador)  as importeplanif,
                    edn.identidad,
                    s.idajusteexistenciacb,
                    s.cantidad,
                    s.idejecucionoaceindicador,

                    (SELECT ece.ejecutado as ejecutado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn
                            ON (ece.identidad = edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 0 as
                            importedemanda, dei.idejecucionoace,dei.idindicador,
                            0 as idajusteexistenciacb,dei.cantidad,
                            dei.idejecucionoaceindicador from mod_planificacion.
                            dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                                    cb.importedemanda,
                                    ed.idejecucionoace ,
                                    cb.idindicador,
                                    ed.idajusteexistenciacb, 0 as cantidad, 0 as
                                    idejecucionoaceindicador
                                    from  mod_planificacion.
                                    dat_ejecucionoacedemanda ed
                                    inner JOIN mod_planificacion.
                                    dat_ajusteexistenciacb cb ON
                                    (ed.idajusteexistenciacb =
                                    cb.idajusteexistenciacb)) s on (
                                    s.idejecucionoace = ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador nia ON
                            (nia.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif
                            nip ON (nia.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva ON (nia.idindicador
                            = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)

                            INNER JOIN mod_datosmaestros.nom_unidadmedida um ON
                            (nia.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n ON
                            (nia.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep ON (ece.idejercicio =
                            ep.idejercicio)
                            WHERE ep.actual = 1
                            and  (via.denominacion= 'OACE' OR via.uriviaadquisicion='balanceadorcentral')
                            and ece.identidad=28 and s.idindicador="
            . $idindicador . " $ADDSUB limit 1) as ejecutado,

                    (SELECT ece.contratado as contratado
                            FROM mod_planificacion.dat_ejecucionoace ece
                            LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda
                            pd ON (ece.idejecucionoace = pd.idejecucionoace)
                            LEFT OUTER JOIN mod_planificacion.
                            dat_entidaddatosnomenclador edn ON (ece.identidad =
                            edn.identidaddatosnomenclador)
                            LEFT OUTER JOIN(select 0 as demanda, 0 as
                            importedemanda, dei.idejecucionoace,dei.idindicador,
                            0 as idajusteexistenciacb,dei.cantidad,
                            dei.idejecucionoaceindicador from mod_planificacion.
                            dat_ejecucionoaceindicador dei
                            union
                            select cb.demanda,
                            cb.importedemanda,
                            ed.idejecucionoace ,
                            cb.idindicador,
                             ed.idajusteexistenciacb, 0 as cantidad, 0 as
                             idejecucionoaceindicador
                        from  mod_planificacion.dat_ejecucionoacedemanda ed
                            inner JOIN mod_planificacion.dat_ajusteexistenciacb
                            cb ON (ed.idajusteexistenciacb =
                            cb.idajusteexistenciacb)) s on (s.idejecucionoace =
                            ece.idejecucionoace)
                            INNER JOIN mod_datosmaestros.nom_indicador ni ON
                            (ni.idindicador = s.idindicador)
                            INNER JOIN mod_datosmaestros.nom_indicadorplanif nip
                            ON (ni.idindicador = nip.idindicador)
                            INNER JOIN mod_datosmaestros.
                            dat_indicadorviaadquisicion niva ON (ni.idindicador
                            = niva.idindicador)
                            INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                            ON (via.idviaadquisicion = niva.idviaadquisicion)

                            INNER JOIN mod_datosmaestros.nom_unidadmedida um ON
                            (ni.idumedida = um.idunidadmedida)
                            INNER JOIN mod_datosmaestros.nom_naturaleza n ON (
                            ni.idnaturaleza = n.idnaturaleza)
                            INNER JOIN mod_planificacion.
                            nom_ejercicioplanificacion ep ON (ece.idejercicio =
                            ep.idejercicio)
                            WHERE ep.actual = 1
                            and (via.denominacion= 'OACE' OR via.uriviaadquisicion='balanceadorcentral')
                            and ece.identidad=28 and s.idindicador="
            . $idindicador . " $ADDSUB limit 1) as contratado

                    FROM mod_planificacion.dat_ejecucionoace ece
                    LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd ON
                    (ece.idejecucionoace = pd.idejecucionoace)
                   LEFT OUTER JOIN mod_planificacion.dat_entidaddatosnomenclador
                    edn ON (ece.identidad = edn.identidaddatosnomenclador)
                    LEFT OUTER JOIN(select 0 as demanda, 0 as importedemanda,
                    dei.idejecucionoace,dei.idindicador, 0 as
                  idajusteexistenciacb,dei.cantidad,dei.idejecucionoaceindicador
                  from mod_planificacion.dat_ejecucionoaceindicador dei
                    union
                    select cb.demanda,
                    cb.importedemanda,
                    ed.idejecucionoace ,
                    cb.idindicador,
                    ed.idajusteexistenciacb, 0 as cantidad, 0 as
                    idejecucionoaceindicador
                    from  mod_planificacion.dat_ejecucionoacedemanda ed
                   inner JOIN mod_planificacion.dat_ajusteexistenciacb cb ON

                   (ed.idajusteexistenciacb = cb.idajusteexistenciacb))

                    s on

                   (s.idejecucionoace = ece.idejecucionoace)
                    INNER JOIN mod_datosmaestros.nom_indicador ni ON
                    (ni.idindicador = s.idindicador)
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif nip ON
                    (ni.idindicador = nip.idindicador)
                    INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion
                    niva ON (ni.idindicador = niva.idindicador)
                    INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON
                    (via.idviaadquisicion = niva.idviaadquisicion)
                    INNER JOIN mod_datosmaestros.
                    dat_indicadorviaadquisicionorganosatisface nviaos ON
                    (niva.idindicador = nviaos.idindicador)
                    AND (niva.idviaadquisicion = nviaos.idviaadquisicion)
                    INNER JOIN mod_datosmaestros.nom_organosatisface o ON
                    (nviaos.idorganosatisface = o.idorganosatisface)
                    INNER JOIN mod_datosmaestros.nom_unidadmedida um ON
                    (ni.idumedida = um.idunidadmedida)
                    INNER JOIN mod_datosmaestros.nom_naturaleza n ON
                    (ni.idnaturaleza = n.idnaturaleza)
                    INNER JOIN mod_planificacion.nom_ejercicioplanificacion ep
                    ON (ece.idejercicio = ep.idejercicio)
                    WHERE ep.actual = 1
                    and  (via.denominacion= 'OACE' OR via.uriviaadquisicion='balanceadorcentral')
                    and ece.identidad=28 and ni.idindicador= " . $idindicador .
            "$expcb$ADDWHERE $ADDSUB
                    group by ece.idejecucionoace,
                    ni.codigo
                    ,ni.numeropieza
                    ,s.idindicador
                    ,ni.denominacion
                    ,via.denominacion
                    ,o.denominacion
                    ,um.denominacionunidadmedida
                    ,n.denominacion
                    ,ece.mes
                    ,ece.preciocontrado
                     ,ece.precioejecutado
                     ,s.importedemanda
                    ,ece.tipo
                    ,s.demanda
                    ,nip.precio
                    ,pd.cantidad
                    ,edn.identidad
                    ,s.idajusteexistenciacb
                    ,s.cantidad
                    ,s.idejecucionoaceindicador
                    ORDER BY
                    ece.idejecucionoace desc
                    limit 1
                ";





        $res = $conn->execute($query);

        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);


        return $data;
    }

    public function listarTotal()
    {
        $conn = Doctrine_Manager::connection();
        $sql
         = "select COALESCE (sum(ece.contratado*ece.preciocontrado),0) as importecontratado,
             COALESCE (sum(ece.ejecutado*ece.precioejecutado),0) as importeejecutado,
             COALESCE (sum(s.importedemanda),0) as importeplanif
	from
	mod_planificacion.dat_ejecucionoace ece  LEFT OUTER JOIN
	(select 0 as demanda, 0 as importedemanda, dei.idejecucionoace,
        dei.idindicador, 0 as idajusteexistenciacb,dei.cantidad,
        dei.idejecucionoaceindicador, 0 as idejecucionoacedemanda 
        from mod_planificacion.dat_ejecucionoaceindicador dei
         union select cb.demanda, cb.importedemanda, ed.idejecucionoace , 
         cb.idindicador, ed.idajusteexistenciacb, 0 as cantidad, 0 as
         idejecucionoaceindicador, ed.idejecucionoacedemanda from  
         mod_planificacion.dat_ejecucionoacedemanda ed
        inner JOIN mod_planificacion.dat_ajusteexistenciacb cb ON 
        (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s on 
        (s.idejecucionoace = ece.idejecucionoace)  
        group by s.idindicador ";
        $res = $conn->execute($sql);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function getEntidadDadoComportamiento($idcentrobalance, $idejercicio)
    {
        $conn = Doctrine_Manager::connection();
        $query
    = "select d.identidad,p.puntualizar,p.idcentrobalance,p.idejecucionpermiso 
        from mod_planificacion.dat_ejecucionpermiso p inner join 
        mod_planificacion.dat_entidaddatosnomenclador d
                    on d.identidaddatosnomenclador=p.idcentrobalance 
                    where d.iddatosnomenclador=
                        " . $idcentrobalance . " and p.idejercicio="
            . $idejercicio . "";

        $res = $conn->execute($query);
        $data->data = $res->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function getDatPuntualizacion($idejecucionoace)
    {
        $conn = Doctrine_Manager::connection();
        $sql
    = "select p.importe, p.cantidad from mod_planificacion.dat_puntualdemanda p
                 where p.idejecucionoace=" . $idejecucionoace . "";
        $resprim = $conn->execute($sql);
        $dev->data = $resprim->fetchAll(PDO::FETCH_ASSOC);
        return $dev;
    }

    public function adicionarP($params)
    {
        foreach ($params as $data) {
            if ($data->puntualizar == 0) {
                $puntua = 1;
            } else {
                $puntua = 0;
            }
            if ($data->idejecucionpermiso != null) {
                $objLiq = Doctrine::getTable('DatEjecucionpermiso')->find(
                    $data->idejecucionpermiso
                );
                $objLiq->puntualizar = $puntua;
                $objLiq->idcentrobalance = $data->idcentrobalance;
                $objLiq->save();
                //$respuesta = 1;
            }
        }
    }

    public function adicionarIndicador($params)
    {

        $identidad = 28;

        foreach ($params['indicador'] as $data) {

            if ($data->idindicador != null) {
                $obj = new DatEjecucionoace();

                $obj->idejercicio = $data->idejercicio;
                $obj->identidad = $identidad;
                $obj->mes =  $params['mes'];
                $obj->tipo = 1;
                $obj->contratado = $params['cantidad'];
                $obj->save();
                $idejecucionoace = $obj->idejecucionoace;
                $objindicador = new DatEjecucionoaceindicador();

                $objindicador->idejecucionoace = $idejecucionoace;

                $objindicador->idindicador = $data->idindicador;
                $objindicador->cantidad = 0;
                $objindicador->save();
                //$respuesta = 1;
            }
        }
    }

    public function guardarEjecucion($params)
    {


            $datos = DatEjecucionoace::guardarEje($params);

        return $datos;
    }

    public function guardarPuntual($params)
    {
        $arrep = new DatPuntualdemanda();
        foreach ($params['idpuntual'] as $dat) {
            if ($dat->idejecucionoace != null) {
                $objLiq = Doctrine::getTable('DatPuntualdemanda')->findByDql(
                    "idejecucionoace=$dat->idejecucionoace"
                );

                if ($objLiq[0]->idpuntualdemanda != null) {
                    $arrep = Doctrine::getTable('DatPuntualdemanda')->find(
                        $objLiq[0]->idpuntualdemanda
                    );
                    $arrep->idejecucionoace = $dat->idejecucionoace;
                    $importe = $dat->ejecutar * $dat->precio;
                    $arrep->importe = $importe;
                    $arrep->cantidad = $dat->ejecutar;
                    $arrep->save();
                    $respuesta = 1;
                } else {
                    $arrep['idejecucionoace'] = $dat->idejecucionoace;
                    $arrep['importe'] = $dat->importeplanif;
                    $arrep['cantidad'] = $dat->ejecutar;
                    $arrep->save();
                    $respuesta = 1;

                }

            }


        }
       return $respuesta;
    }

    public function eliminar($idejecucionoace)
    {

        $query = Doctrine_Query::create();
        $query->delete('DatEjecucionoace')
            ->from('DatEjecucionoace ei ')
            ->where('ei.idejecucionoace = ?', $idejecucionoace)
            ->execute();

    }

    public function eliminarIndicador($params)
    {


        $ejecuciones = self::ejecucionesELiminar($params['indicador'][0]->idindicador,$params['mes']);

        foreach ($ejecuciones as $valor) {
            $eliminar = self::eliminar($valor['idejecucionoace']);
        }

        if ($eliminar) {
            return true;
        } else {
            return false;
        }
    }

    public function ejecucionesELiminar($idindicador,$mes)
    {
        $conn = Doctrine_Manager::connection();
        $query
            = "SELECT ei.idejecucionoace
                    FROM mod_planificacion.dat_ejecucionoaceindicador ei
                    INNER JOIN mod_planificacion.dat_ejecucionoace e ON 
                    (e.idejecucionoace = ei.idejecucionoace)
                    WHERE ei.idindicador=$idindicador AND e.mes=$mes
                ";

        $actividadesAsociadas = $conn->execute($query)->fetchAll(
            PDO::FETCH_ASSOC
        );

        return $actividadesAsociadas;
    }

    public function exportarAExcel($params)
    {
        //$dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        //$idioma = ZendExt_GlobalConcept::getInstance()->Perfil->idioma;

        $indicadores = $params['indicadores'];


        //unset($etiquetas);
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=desgloses.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; '
        . 'charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";

        echo "<th colspan = 4 align=left>Demanda</th>";
        echo "</tr>";
        echo "</tr>";
        echo "<tr>\n";
        echo "<th>C&oacute;digo</th>\n";
        echo "<th>Denominaci&oacute;n</th>\n";
        echo "<th>N&uacute;mero de pieza </th>\n";
        echo "<th>UM </th>\n";
        echo "<th>Precio </th>\n";
        echo "<th>Cantidad Aprobada </th>\n";
        echo "<th>Importe Aprobado </th>\n";
        echo "<th>Centro de Balance </th>\n";
        echo "<th>Contratado </th>\n";
        echo "<th>Precio Contratado </th>\n";
        echo "<th>Importe Contratado </th>\n";
        echo "<th>Ejecutado </th>\n";
        echo "<th>Precio Ejecutado </th>\n";
        echo "<th>Importe Ejecutado </th>\n";


        echo "</tr>";
        $cantxpag = 10000;

        $cant = 1;
        $cantpag = (int)($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        unset($cant);
        $offset = 0; //start
        $paso = $cantxpag; //limit
        for ($i = 0; $i < $cantpag; $i++) {
            foreach ($indicadores as $k => $val) {
                $data = self::listarDemanda($params, $val);

                foreach ($data->data as $k => $value) {
                    $integrator = ZendExt_IoC::getInstance();
                    $datosentidad = $integrator->metadatos->DameEstructura(
                        $value['identidad']
                    );


                  echo "<tr> <td align=right style=\"mso-number-format:'@';\" >"
                        . $value['codigo'] . "</td>
             <td align=left >" . $value['denominacion'] . "</td>
             <td>" . $value['numeropieza'] . "</td>
             <td>" . $value['um'] . "</td>
             <td>" . number_format($value['precio'], '3', '.', ',') . "</td>
             <td>" . number_format($value['demanda'], '3', '.', ',') . "</td>
        <td>" . number_format($value['importeplanif'], '3', '.', ',') . "</td>
             <td>" . $datosentidad[0]->denominacion . "</td>
            <td>" . number_format($value['contratado'], '3', '.', ',') . "</td>
    <td>" . number_format($value['preciocontrado'], '3', '.', ',') . "</td>
    <td>" . number_format($value['importecontratado'], '3', '.', ',') . "</td>
             <td>" . number_format($value['ejecutado'], '3', '.', ',') . "</td>
        <td>" . number_format($value['precioejecutado'], '3', '.', ',') . "</td>
              <td>" . number_format($value['importeejecutado'], '3', '.', ',')
                        . "</td>";


                }
                $offset += $paso;
            }
        }
        echo "</table>";
    }

    public function exportarPuntualAExcel($params)
    {
        //$dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        //$idioma = ZendExt_GlobalConcept::getInstance()->Perfil->idioma;

        $indicadores = $params['indicadores'];


        //unset($etiquetas);
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=desgloses.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; '
        . 'charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";

        echo "<th colspan = 4 align=left>Demanda</th>";
        echo "</tr>";
        echo "</tr>";
        echo "<tr>\n";
        echo "<th>C&oacute;digo</th>\n";
        echo "<th>Denominaci&oacute;n</th>\n";
        echo "<th>N&uacute;mero de pieza </th>\n";
        echo "<th>UM </th>\n";
        echo "<th>Precio </th>\n";
        echo "<th>Cantidad Aprobada </th>\n";
        echo "<th>Importe Aprobado </th>\n";
        echo "<th>Centro de Balance </th>\n";
        echo "</tr>";
        $cantxpag = 10000;

        $cant = 1;
        $cantpag = (int)($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cantpag++;
        }
        unset($cant);
        $offset = 0; //start
        $paso = $cantxpag; //limit
        for ($i = 0; $i < $cantpag; $i++) {
            foreach ($indicadores as $k => $val) {
                $data = self::listarDemanda($params, $val);

                foreach ($data->data as $k => $value) {
                    $integrator = ZendExt_IoC::getInstance();
                    $datosentidad = $integrator->metadatos->DameEstructura(
                        $value['identidad']
                    );


                  echo "<tr> <td align=right style=\"mso-number-format:'@';\" >"
                        . $value['codigo'] . "</td>
             <td align=center >" . $value['denominacion'] . "</td>
             <td>" . $value['numeropieza'] . "</td>
             <td>" . $value['um'] . "</td>
             <td>" . number_format($value['precio'], '3', '.', ',') . "</td>
             <td>" . number_format($value['demanda'], '3', '.', ',') . "</td>
          <td>" . number_format($value['importeplanif'], '3', '.', ',') . "</td>
             <td>" . $datosentidad[0]->denominacion . "</td>";


                }
                $offset += $paso;
            }
        }
        echo "</table>";
    }


}



