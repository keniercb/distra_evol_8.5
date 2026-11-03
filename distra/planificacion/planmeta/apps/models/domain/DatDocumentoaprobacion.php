<?php

class DatDocumentoaprobacion extends BaseDatDocumentoaprobacion {

//fd
    public function setUp() {
        parent::setUp();

        $this->hasOne(
                'NomOperacion', array('local' => 'idoperacion', 'foreign' => 'idoperacion')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
                'NomAprobacion', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatDocumentoaprobcontroldivisaindicador', array('local' => 'iddocumentoaprobacion',
            'foreign' => 'iddocumentoaprobacion')
        );


        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'idoperacion', 'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
                'NomDatosnomenclador', array('local' => 'idtipoaprobacion',
            'foreign' => 'iddatosnomenclador')
        );
        $this->hasOne(
                'NomEjercicioplanificacion', array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
                'NomAprobacion', array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
                'DatControldivisadocumentoaprobacion', array('local' => 'iddocumentoaprobacion',
            'foreign' => 'iddocumentoaprobacion')
        );
    }

    public function RecuperarCuerpoDoc($parametros) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";


        /* $cadenaSELECT = " SELECT final.idcontroldivisa,final.elmodelo as idmodelo,
          final.identidadmodelo,final.idvia, final.idindicador,sum(final.importemlc) as importefinal,
          sum(final.demandacb) as cantidad,final.precio ";

          $cadenaJOIN = self::cadenaJoin($parametros);

          $cadenaWHERE
          = " GROUP BY final.idcontroldivisa,final.elmodelo,--final.idmodelo,
          final.identidadmodelo,final.idvia,final.idindicador,final.precio"; */

        $cadenaSELECT = " SELECT cd.idcontroldivisa,sum(p.importe) AS importefinal,cim.identidadmodelo,
            CASE WHEN cim.importecredito=0 THEN sum(p.importe) ELSE cim.importecredito END AS importecredito,
        CASE WHEN cim.importeliquido=0 THEN sum(p.importe) ELSE cim.importeliquido END AS importeliquido,
        iv.idviaadquisicion as idvia,sum(p.cantidad) as cantidad,p.idindicador,p.precio ";

        $cadenaJOIN = " FROM mod_planificacion.dat_controldivisaindicadormodelo cim
                    INNER JOIN mod_planificacion.nom_controldivisa cd on
                     cim.idcontroldivisa = cd.idcontroldivisa
                     INNER JOIN mod_planificacion.dat_planificacion p
                     ON p.idindicador = cim.idindicador
                     INNER JOIN mod_planificacion.dat_entidadmodelo emp on
                     p.identidadmodelo = emp.identidadmodelo
                    INNER JOIN mod_planificacion.dat_modelo mp on (emp.idmodelo =
                     mp.idmodelo AND mp.tipoplan = 0 AND mp.balance = 1 )
                    INNER JOIN
                     mod_datosmaestros.dat_indicadorviaadquisicion
                      iv ON cim.idindicador = iv.idindicador
                    LEFT JOIN mod_planificacion.dat_entidadmodelo em on
                     cim.identidadmodelo = em.identidadmodelo
                    LEFT JOIN mod_planificacion.dat_modelo m on em.idmodelo =
                     m.idmodelo ";
        $cadenaWHERE = "  WHERE cim.idaprobacion = 4 AND p.idejercicio = {$parametros->idejercicio}
        AND p.idcentrobalance = {$parametros->idcentrobalance}
               GROUP BY cd.idcontroldivisa,iv.idviaadquisicion,p.idindicador,cim.identidadmodelo,
               p.precio,cim.importeliquido,cim.importecredito ";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;

        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();

        return $result;
    }

    public function cadenaJoin($parametros) {
        $consulta = " FROM (
        Select x.idcontroldivisa,
        q.elmodelo,
        q.identidadmodelo,
        x.idvia,
        q.idindicador,
        q.demandacb,
        q.importemlc,
         q.preciodivisa as precio
        from (
               SELECT foo.idindicador,
                      foo.codigo,
                      foo.precio,
                      foo.preciodivisa,
                      foo.numeropieza,
                      foo.denominacion,
                      foo.coberturatotalestimada,
                      foo.idmodelo as elmodelo,
                      foo.identidadmodelo,
                      SUM(foo.necesidad) -
                      (
                        SELECT COALESCE(SUM(cpe), 0) as cpe
                        FROM mod_planificacion.dat_odcte odcte
                        WHERE idindicador = foo.idindicador
                      ) -
                      (
                        SELECT COALESCE(SUM(coberturaparcialestimada), 0)
                        FROM mod_planificacion.dat_ajusteexistenciacb aecb
                        WHERE identidad = " . ($parametros->idestructura) . "

                       AND
                              idindicador = foo.idindicador
                      ) as demandacb,
                      (
                          SUM(foo.necesidad) -
                      (
                        SELECT COALESCE(SUM(cpe), 0) as cpe
                        FROM mod_planificacion.dat_odcte odcte
                        WHERE idindicador = foo.idindicador
                      ) -
                      (
                        SELECT COALESCE(SUM(coberturaparcialestimada), 0)
                        FROM mod_planificacion.dat_ajusteexistenciacb aecb
                        WHERE identidad = " . ($parametros->idestructura) . " AND
                              idindicador = foo.idindicador
                      )
                      ) * foo.preciodivisa as importemlc
               FROM (
                      SELECT i.idindicador,
                             i.codigo,
                             ip.precio,
                             ip.preciodivisa,
                             i.numeropieza,
                             i.denominacion,
                             em.idmodelo,
                             SUM(p.cantidad) as necesidad,
                             ae.coberturatotalestimada as coberturatotalestimada,
                             p.identidadmodelo
                      FROM mod_planificacion.dat_planificacion p
                           INNER JOIN mod_datosmaestros.nom_indicador i on
                            p.idindicador = i.idindicador
                           INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                            on ip.idindicador = i.idindicador
                           INNER JOIN mod_planificacion.dat_entidadmodelo em on
                            p.identidadmodelo = em.identidadmodelo
                           LEFT JOIN mod_planificacion.dat_ajusteexistencia ae
                            on (p.idindicador = ae.idindicador AND ae.identidad
                             = " . ($parametros->idestructura) . ")
                           LEFT JOIN mod_planificacion.dat_odcte odcte on (
                           i.idindicador = odcte.idindicador AND odcte.identidad
                            = em.identidad AND em.idmodelo = odcte.idmodelo)
                      WHERE p.idejercicio = " . ($parametros->idejercicio) . " AND
                            p.idcentrobalance = " . ($parametros->idcentrobalance) . "
                      Group by i.idindicador,
                               i.codigo,
                               ip.precio,
                               ip.preciodivisa,
                               i.numeropieza,
                               i.denominacion,
                               ae.coberturatotalestimada,
                               em.idmodelo, p.identidadmodelo
                      order by i.codigo
                    ) as foo
               Group by foo.idindicador,
                        foo.codigo,
                        foo.precio,
                        foo.preciodivisa,
                        foo.numeropieza,
                        foo.denominacion,
                        foo.coberturatotalestimada,
                        foo.idmodelo,
                        foo.identidadmodelo
               order by foo.codigo
             ) as q
             INNER JOIN
             (
               SELECT cd.idcontroldivisa,
                      cd.codigo as codigocd,
                      cd.denominacion as denomcontroldiv,
                      m.idmodelo ,
                      --m.denominacion as denommodelo,
                      cim.idindicador,
                      --cim.identidadmodelo,
                      i.denominacion as denomindicador,
                        iv.idviaadquisicion  as idvia
               FROM mod_planificacion.dat_controldivisaindicadormodelo cim
                    INNER JOIN mod_planificacion.nom_controldivisa cd on
                     cim.idcontroldivisa = cd.idcontroldivisa
                    INNER JOIN mod_datosmaestros.nom_indicador i on
                     cim.idindicador = i.idindicador
                    INNER JOIN
                     mod_datosmaestros.dat_indicadorviaadquisicion
                      iv ON i.idindicador = iv.idindicador
                    LEFT JOIN mod_planificacion.dat_entidadmodelo em on
                     cim.identidadmodelo = em.identidadmodelo
                    LEFT JOIN mod_planificacion.dat_modelo m on em.idmodelo =
                     m.idmodelo
               WHERE cim.idaprobacion = 4
             ) as x ON (q.idindicador = x.idindicador and (x.idmodelo =
              q.elmodelo  OR x.idmodelo is null))
      ) as final";

        return $consulta;
    }

    public function Guardardatosdeldocumento($numero, $identidad, $idejercicio, $idtipoaprobacion, $idusuario, $idoperacion, $origen, $numerodoc) {
        $dm = Doctrine_Manager::getInstance();
        $con = $dm->getCurrentConnection();
        $ed = "select last_value from mod_planificacion.sec_documentoaprobacion_seq";
        $sql = "INSERT INTO
  mod_planificacion.dat_documentoaprobacion
( numero,  version,  identidad,  idaprobacion,
  idejercicio,  idtipoaprobacion,  idusuario,
  idoperacion,  esmanual,    numeroaprobacion
)
VALUES ( $numero,    1, $identidad, 1,  $idejercicio,  $idtipoaprobacion,  $idusuario,
  null,  $origen,$numerodoc)";
        $con->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $con->commit();
        $con->beginTransaction();
        $arrayResult = $con->execute($ed)->fetchAll(PDO::FETCH_ASSOC);
        $con->commit();
        return $arrayResult[0]['last_value'];
    }

    public function probareste($parametros) {

        $condicionEntidadmodelo = ($parametros->identidadmodelo != 'notiene') ? " AND
  dam.identidadmodelo =$parametros->identidadmodelo " : "";
        $cadenaQUERY = "SELECT DISTINCT
  da.idindicador as indicador,
  da.importe,
  da.cantidad,
  nz.denominacion AS naturaleza,
  nu.denominacionunidadmedida AS idumedida,
  ni.codigo as codigoplanif,
  ni.numeropieza,
  ni.denominacion
FROM
  mod_planificacion.dat_controldivisadocumentoaprobacion da
  LEFT JOIN mod_planificacion.dat_controldivisadocumentomodelo dam ON (da.idcontroldivisadocumentoaprobacion = dam.idcontroldivisadocumentoaprobacion)
  INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion dav ON (da.idcontroldivisadocumentoaprobacion = dav.idcontroldivisadocumentoaprobacion)
  INNER JOIN mod_datosmaestros.nom_indicador ni ON (da.idindicador = ni.idindicador)
  INNER JOIN mod_datosmaestros.nom_naturaleza nz ON (ni.idnaturaleza = nz.idnaturaleza)
  INNER JOIN mod_datosmaestros.nom_unidadmedida nu ON (ni.idumedida = nu.idunidadmedida)
WHERE
  dav.idviaadquisicion =$parametros->idviaadquisicion AND
  da.idcontroldivisa = $parametros->idcontroldivisa AND
  da.iddocumentoaprobacion = $parametros->iddocumentoaprobacion
  {$condicionEntidadmodelo}";

        // $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;

        $conex = Doctrine_Manager:: connection();
        $result['cantidad'] = count($conex->execute($cadenaQUERY)->fetchAll());
        $result['datos'] = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function getImporteByIdIndCD($parametros) {
        $cadenaQUERY = "SELECT SUM(p.importe) AS importe
          FROM
          mod_planificacion.dat_controldivisaindicadormodelo da
          INNER JOIN mod_planificacion.dat_planificacion p
          ON (da.idindicador = p.idindicador AND p.idejercicio = {$parametros['idejercicio']})
          INNER JOIN mod_planificacion.dat_entidadmodelo emp on
                     p.identidadmodelo = emp.identidadmodelo
                    INNER JOIN mod_planificacion.dat_modelo mp on (emp.idmodelo =
                     mp.idmodelo AND mp.tipoplan = 0 AND mp.balance = 1 )
          INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON (edn.identidaddatosnomenclador = p.idcentrobalance
          AND edn.identidad = {$parametros['identidad']})
          INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion
                      iv ON da.idindicador = iv.idindicador

  WHERE
    da.idcontroldivisa = {$parametros['idcontroldivisa']} AND da.idejercicio = {$parametros['idejercicio']}
   ";


        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function indicadoresRelacDesglose($parametros) {
        $cadenaQUERY = "SELECT DISTINCT
  da.idindicador,
  da.idcontroldivisaindicadormodelo,
  da.cantcredito as credito,
  da.cantliquido as liquido,
  da.importecredito as importecredito,
  da.importeliquido as importeliquido,
  SUM(p.importe) AS importe,
  p.precio,
  SUM(p.cantidad) as cantidad,
  nz.denominacion AS naturaleza,
  nu.denominacionunidadmedida AS um,
  ni.codigo as codigo,
  ni.numeropieza,
  p.viasadquisicion AS via,
  ni.denominacion
  FROM
  mod_planificacion.dat_controldivisaindicadormodelo da
  INNER JOIN mod_planificacion.dat_planificacion p
  ON (da.idindicador = p.idindicador AND p.idejercicio = {$parametros['idejercicio']})
  INNER JOIN mod_planificacion.dat_entidadmodelo emp on
                     p.identidadmodelo = emp.identidadmodelo
                    INNER JOIN mod_planificacion.dat_modelo mp on (emp.idmodelo =
                     mp.idmodelo AND mp.tipoplan = 0 AND mp.balance = 1 )
  INNER JOIN mod_datosmaestros.nom_indicador ni ON (da.idindicador = ni.idindicador)
  INNER JOIN mod_datosmaestros.nom_naturaleza nz ON (ni.idnaturaleza = nz.idnaturaleza AND nz.idnaturaleza = 1000127)
  INNER JOIN mod_datosmaestros.nom_unidadmedida nu ON (ni.idumedida = nu.idunidadmedida)
  INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON (edn.identidaddatosnomenclador = p.idcentrobalance
  AND edn.identidad = {$parametros['identidad']})

  WHERE
    da.idcontroldivisa = {$parametros['idindicadorcd']} AND da.idejercicio = {$parametros['idejercicio']}
    GROUP BY
     da.idindicador,p.precio,nz.denominacion,nu.denominacionunidadmedida,da.cantcredito,
      da.cantliquido,da.importecredito,da.importeliquido,
     ni.codigo,ni.numeropieza,p.viasadquisicion, ni.denominacion,da.idcontroldivisaindicadormodelo
   ";

        $cadenaTOTAL = "SELECT sum(suma.importecredito) AS importecreditototal,
                    sum(suma.importeliquido) AS importeliquidototal
                    FROM
                    (SELECT DISTINCT
              da.idindicador,
              da.idcontroldivisaindicadormodelo,
              da.cantcredito as credito,
              da.cantliquido as liquido,
              da.importecredito as importecredito,
              da.importeliquido as importeliquido,
              SUM(p.importe) AS importe,
              p.precio,
              SUM(p.cantidad) as cantidad,
              nz.denominacion AS naturaleza,
              nu.denominacionunidadmedida AS um,
              ni.codigo as codigo,
              ni.numeropieza,
              p.viasadquisicion AS via,
              ni.denominacion
              FROM
              mod_planificacion.dat_controldivisaindicadormodelo da
              INNER JOIN mod_planificacion.dat_planificacion p
  ON (da.idindicador = p.idindicador AND p.idejercicio = {$parametros['idejercicio']})
  INNER JOIN mod_datosmaestros.nom_indicador ni ON (da.idindicador = ni.idindicador)
  INNER JOIN mod_datosmaestros.nom_naturaleza nz ON (ni.idnaturaleza = nz.idnaturaleza AND nz.idnaturaleza = 1000127)
  INNER JOIN mod_datosmaestros.nom_unidadmedida nu ON (ni.idumedida = nu.idunidadmedida)
  INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON (edn.identidaddatosnomenclador = p.idcentrobalance
  AND edn.identidad = {$parametros['identidad']})

  WHERE
    da.idcontroldivisa = {$parametros['idindicadorcd']} AND da.idejercicio = {$parametros['idejercicio']}
    GROUP BY
     da.idindicador,p.precio,nz.denominacion,nu.denominacionunidadmedida,da.cantcredito,
      da.cantliquido,da.importecredito,da.importeliquido,
     ni.codigo,ni.numeropieza,p.viasadquisicion, ni.denominacion,da.idcontroldivisaindicadormodelo) AS suma
   ";


        $conex = Doctrine_Manager:: connection();
        $result['total'] = count($conex->execute($cadenaQUERY)->fetchAll());
        $result['sumas'] = $conex->execute($cadenaTOTAL)->fetchAll();
        $result['data'] = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function probarnuevo($parametros) {
        $cadenaQUERY = "SELECT DISTINCT nz.denominacion AS naturaleza,
  nu.denominacionunidadmedida AS idumedida,
  ni.codigo AS codigoplanif,
  ni.numeropieza,
  ni.denominacion,
  nip.precio,
  coalesce(p.cantidad, 1) AS cantidad,
  (nip.precio * coalesce(p.cantidad, 1))as importe
FROM
  mod_datosmaestros.nom_indicador ni
  INNER JOIN mod_datosmaestros.nom_indicadorplanif nip ON (nip.idindicador = ni.idindicador)
  INNER JOIN mod_datosmaestros.nom_naturaleza nz ON (ni.idnaturaleza = nz.idnaturaleza)
  INNER JOIN mod_datosmaestros.nom_unidadmedida nu ON (ni.idumedida = nu.idunidadmedida)
  INNER JOIN mod_planificacion.dat_controldivisaindicadormodelo cdi ON (ni.idindicador = cdi.idindicador)
  LEFT OUTER JOIN mod_planificacion.dat_planificacion p ON (cdi.identidadmodelo = p.identidadmodelo and ni.idindicador=p.idindicador)
WHERE
  cdi.idcontroldivisa = $parametros->idcontroldivisa AND
  nz.denominacion = 'Equipo'
  GROUP by
   nz.denominacion ,
  nu.denominacionunidadmedida ,
  ni.codigo,
  ni.numeropieza,
  ni.denominacion,
  nip.precio,
  p.cantidad
 ";

        // $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conex = Doctrine_Manager:: connection();
        $result['cantidad'] = count($conex->execute($cadenaQUERY)->fetchAll());
        $result['datos'] = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function RecuperarIndicadoresCuerpoDoc($parametros) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = " Select DISTINCT (indicador),naturaleza,idumedida,numeropieza,
            denominacion,codigo as codigoplanif,sum(demandacb) as cantidad,
            sum(importemlc) as importe  ";

        $cadenaJOIN = self::cadenaJoinUno($parametros);
        $compidemodelo = ($parametros->identidadmodelo == 'notiene') ? 'identidadmodelo is null' : "identidadmodelo=" . ($parametros->identidadmodelo) . "";
        $cadenaWHERE = " WHERE    idvia="
                . ($parametros->idviaadquisicion) . "
                        AND idcontroldivisa=" . ($parametros->idcontroldivisa) . "
                        AND idorganosatisface = " . ($parametros->organo) . "
                        GROUP BY numeropieza,denominacion,codigo,indicador,idumedida,naturaleza
                        ";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conex = Doctrine_Manager:: connection();
        $result['cantidad'] = count($conex->execute($cadenaQUERY)->fetchAll());
        $result['datos'] = $conex->execute($cadenaQUERY)->fetchAll();

        return $result;
    }

    public function cadenaJoinUno($parametros) {
        $consulta = "from (SELECT foo.idindicador as indicador,foo.codigo,
                    foo.precio,foo.preciodivisa,foo.numeropieza,foo.denominacion,
                    foo.naturaleza,foo.coberturatotalestimada,
                    foo.idmodelo as elmodelo,foo.idumedida as idumedida,
                    SUM(foo.necesidad) -
                     (
                       SELECT COALESCE(SUM(cpe), 0) as cpe
                       FROM mod_planificacion.dat_odcte odcte
                       WHERE idindicador = foo.idindicador
                     ) -
                     (
                       SELECT COALESCE(SUM(coberturaparcialestimada), 0)
                       FROM mod_planificacion.dat_ajusteexistenciacb aecb
                       WHERE identidad = foo.identidad AND
                             idindicador = foo.idindicador
                     ) as demandacb,
                     (SUM(foo.necesidad) -
                     (
                       SELECT COALESCE(SUM(cpe), 0) as cpe
                       FROM mod_planificacion.dat_odcte odcte
                       WHERE idindicador = foo.idindicador
                     ) -
                     (
                       SELECT COALESCE(SUM(coberturaparcialestimada), 0)
                       FROM mod_planificacion.dat_ajusteexistenciacb aecb
                       WHERE identidad = foo.identidad AND
                             idindicador = foo.idindicador
                     )) * foo.preciodivisa as importemlc

                    FROM (SELECT i.idindicador, unidadm.abreviaturaunidadmedida as idumedida,
                     i.codigo,ip.precio,ip.preciodivisa,i.numeropieza,i.denominacion,
                     dn.denominacion as naturaleza,em.idmodelo,em.identidad,
                     SUM(p.cantidad) as necesidad,
                     COALESCE(ae.coberturatotalestimada,0) as coberturatotalestimada
                     FROM mod_planificacion.dat_planificacion p
                     INNER JOIN mod_datosmaestros.nom_indicador i
                     on p.idindicador=i.idindicador
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                     on ip.idindicador=i.idindicador
                     INNER JOIN mod_datosmaestros.nom_naturaleza dn on
                   i.idnaturaleza = dn.idnaturaleza
                      INNER JOIN mod_datosmaestros.nom_unidadmedida unidadm on
                    i.idumedida = unidadm.idunidadmedida
                     INNER JOIN mod_planificacion.dat_entidadmodelo em
                     on p.identidadmodelo = em.identidadmodelo
                     LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae
                     on (p.idindicador = ae.idindicador AND ae.identidad = em.identidad)



                    WHERE p.idejercicio = " . ($parametros->idejercicio) . "
                     AND p.idcentrobalance = " . ($parametros->idcentrobalance)
                . "
                     Group by i.idindicador, unidadm.abreviaturaunidadmedida,
                     i.codigo,ip.precio,ip.preciodivisa,i.numeropieza,
                     i.denominacion,ae.coberturatotalestimada,
                     em.idmodelo,dn.denominacion,em.identidad
                    ) as foo
                    Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.denominacion,foo.coberturatotalestimada,foo.identidad,
                    foo.idmodelo,foo.naturaleza,foo.idumedida order by foo.codigo) as q

                    INNER JOIN

                    (SELECT cd.idcontroldivisa, cd.codigo as codigocd,
                    cd.denominacion as denomcontroldiv, m.idmodelo,
                    m.denominacion as denommodelo,
                    cim.idindicador, cim.identidadmodelo,i.denominacion as denomindicador,
                    ivo.idorganosatisface,(Select iv.idviaadquisicion
                    from mod_datosmaestros.dat_indicadorviaadquisicion iv
                    INNER JOIN mod_datosmaestros.nom_viaadquisicion v
                    on iv.idviaadquisicion = v.idviaadquisicion
                    WHERE iv.idindicador = cim.idindicador
                    limit 1) as idvia
                    FROM mod_planificacion.dat_controldivisaindicadormodelo cim
                    INNER JOIN mod_planificacion.nom_controldivisa cd
                    on  cim.idcontroldivisa = cd.idcontroldivisa
                    INNER JOIN mod_datosmaestros.nom_indicador i
                    on cim.idindicador = i.idindicador
                    INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivo
                     ON i.idindicador=ivo.idindicador
                    LEFT JOIN mod_planificacion.dat_entidadmodelo em
                    on cim.identidadmodelo = em.identidadmodelo
                    LEFT JOIN mod_planificacion.dat_modelo m on em.idmodelo = m.idmodelo
                    WHERE cim.idaprobacion=4) as x
                    ON (q.indicador = x.idindicador and (x.idmodelo = q.elmodelo OR x.idmodelo is null))";
        return $consulta;
    }

    public function RecuperarIndicadoresCuerpoDocImprimir($parametros) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = " Select DISTINCT (indicador),precio,idumedida,numeropieza,
            denominacion,codigo as codigoplanif,sum(demandacb) as cantidad,
            sum(importemlc) as importe,idorganosatisface  ";

        $cadenaJOIN = self::cadenaJoinDos($parametros);
        //$compidemodelo
        //= "";
        $organo = ($parametros->organo) ? " = " . $parametros->organo . " " : "IS NULL";

        $cadenaWHERE = " WHERE  idvia=" . ($parametros->idviaadquisicion) . "
                        AND idcontroldivisa=" . ($parametros->idcontroldivisa) . " 
                        AND idorganosatisface " . $organo . "
                        GROUP BY numeropieza,denominacion,codigo,indicador,
                        idumedida,precio,idorganosatisface
                        ";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;

        $conex = Doctrine_Manager:: connection();
        $result['cantidad'] = count($conex->execute($cadenaQUERY)->fetchAll());
        $result['datos'] = $conex->execute($cadenaQUERY)->fetchAll();

        return $result;
    }

    public function cadenaJoinDos($parametros) {
        $consulta = "from (SELECT foo.idindicador as indicador,foo.codigo,
                    foo.precio,foo.preciodivisa,foo.numeropieza,foo.denominacion,
                    foo.coberturatotalestimada,foo.idmodelo as elmodelo,
                    foo.idumedida as idumedida,
                    SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                     FROM mod_planificacion.dat_odcte odcte

                     WHERE idindicador = foo.idindicador) -
                    (SELECT COALESCE(SUM(coberturaparcialestimada),0)
                     FROM mod_planificacion.dat_ajusteexistenciacb aecb
                     WHERE identidad = " . ($parametros->idestructura) . "

                       AND idindicador = foo.idindicador) as demandacb,

                    (SELECT COALESCE(SUM(coberturaparcialestimada),0)
                     FROM mod_planificacion.dat_ajusteexistenciacb aecb
                     WHERE identidad = " . ($parametros->idestructura) . "

                       AND idindicador = foo.idindicador) * foo.preciodivisa as importemlc

                    FROM (SELECT i.idindicador,unidadm.abreviatura as idumedida,
                     i.codigo,ip.precio,ip.preciodivisa,i.numeropieza,i.denominacion,
                     em.idmodelo,SUM(p.cantidad) as necesidad,
                     ae.coberturatotalestimada as coberturatotalestimada
                     FROM mod_planificacion.dat_planificacion p
                     INNER JOIN mod_datosmaestros.nom_indicador  i
                     on p.idindicador=i.idindicador
                      INNER JOIN mod_datosmaestros.nom_indicadorplanif  ip
                     on ip.idindicador=i.idindicador
                     INNER JOIN mod_datosmaestros.dat_unidadmedida unidadm
                     on i.idumedida=unidadm.idunidadmedida
                     INNER JOIN mod_planificacion.dat_entidadmodelo em
                     on p.identidadmodelo = em.identidadmodelo
                     LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae
                     on (p.idindicador = ae.idindicador AND ae.identidad = "
                . ($parametros->idestructura) . ")


                    WHERE p.idejercicio = " . ($parametros->idejercicio) . "
                     AND p.idcentrobalance = " . ($parametros->idcentrobalance)
                . "
                     Group by i.idindicador,unidadm.abreviatura,i.codigo,ip.precio,
                     ip.preciodivisa,i.numeropieza,i.denominacion,
                     ae.coberturatotalestimada,em.idmodelo
                    ) as foo
                    Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.denominacion,foo.coberturatotalestimada,
                    foo.idmodelo,foo.idumedida order by foo.codigo) as q

                    INNER JOIN

                    (SELECT cd.idcontroldivisa, cd.codigo as codigocd,
                    cd.denominacion as denomcontroldiv, m.idmodelo, m.denominacion as denommodelo,
cim.idindicador, cim.identidadmodelo,i.denominacion as denomindicador,ivo.idorganosatisface,

(Select iv.idviaadquisicion from mod_datosmaestros.dat_indicadorviaadquisicion iv
INNER JOIN mod_datosmaestros.nom_viaadquisicion v
on iv.idviaadquisicion = v.idviaadquisicion
WHERE iv.idindicador = cim.idindicador
limit 1) as idvia
FROM mod_planificacion.dat_controldivisaindicadormodelo cim
INNER JOIN mod_planificacion.nom_controldivisa cd
 on  cim.idcontroldivisa = cd.idcontroldivisa
INNER JOIN mod_datosmaestros.nom_indicador i
on cim.idindicador = i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
on ip.idindicador = i.idindicador
INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivo
ON i.idindicador=ivo.idindicador
LEFT JOIN mod_planificacion.dat_entidadmodelo em
 on cim.identidadmodelo = em.identidadmodelo
LEFT JOIN mod_planificacion.dat_modelo m on em.idmodelo = m.idmodelo


WHERE cim.idaprobacion=4 AND COALESCE(m.denominacion,'bb') NOT LIKE '%upper(operaciones comerciales)%'
) as x
ON (q.indicador = x.idindicador and (x.idmodelo = q.elmodelo OR x.idmodelo is null))
 ";
        return $consulta;
    }

    public function RecuperarIndicadoresCuerpoDocPlanOP($parametros) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = " Select DISTINCT (indicador),idumedida,numeropieza,denominacion,
            codigo as codigoplanif,sum(demandacb) as cantidad,
            sum(importemlc) as importe  ";

        $cadenaJOIN = self::cadenaJoinTres($parametros);
        //$compidemodelo
        //  = "";
        $cadenaWHERE = " WHERE  idcontroldivisa="
                . ($parametros->idcontroldivisa) . "
                        GROUP BY numeropieza,denominacion,codigo,indicador,idumedida
                        ";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conex = Doctrine_Manager:: connection();
        $result['cantidad'] = count($conex->execute($cadenaQUERY)->fetchAll());
        $result['datos'] = $conex->execute($cadenaQUERY)->fetchAll();

        return $result;
    }

    public function cadenaJoinTres($parametros) {
        $consulta = "from (SELECT foo.idindicador as indicador,foo.codigo,
                    foo.precio,foo.preciodivisa,foo.numeropieza,
                    foo.denominacion,foo.coberturatotalestimada,
                    foo.idmodelo as elmodelo,foo.idumedida as idumedida,
                    SUM(foo.necesidad) - (SELECT COALESCE(SUM(cpe),0) as cpe
                     FROM mod_planificacion.dat_odcte odcte

                     WHERE idindicador = foo.idindicador) -
                    (SELECT COALESCE(SUM(coberturaparcialestimada),0)
                     FROM mod_planificacion.dat_ajusteexistenciacb aecb
                     WHERE identidad = " . ($parametros->idestructura) . "

                       AND idindicador = foo.idindicador) as demandacb,

                    (SELECT COALESCE(SUM(coberturaparcialestimada),0)
                     FROM mod_planificacion.dat_ajusteexistenciacb aecb
                     WHERE identidad = " . ($parametros->idestructura) . "

                       AND idindicador = foo.idindicador) * foo.preciodivisa as importemlc

                    FROM (SELECT i.idindicador,unidadm.abreviatura as idumedida,
                     i.codigo,ip.precio,ip.preciodivisa,i.numeropieza,i.denominacion,
                     em.idmodelo,SUM(p.cantidad) as necesidad,
                     ae.coberturatotalestimada as coberturatotalestimada
                     FROM mod_planificacion.dat_planificacion p
                     INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
                     INNER JOIN mod_datosmaestros.nom_indicadorplanif ip on ip.idindicador=i.idindicador
                     INNER JOIN mod_datosmaestros.dat_unidadmedida unidadm on i.idumedida=unidadm.idunidadmedida
                     INNER JOIN mod_planificacion.dat_entidadmodelo em on p.identidadmodelo = em.identidadmodelo
                     LEFT JOIN  mod_planificacion.dat_modelo dm ON em.idmodelo=dm.idmodelo
                     LEFT JOIN  mod_planificacion.dat_ajusteexistencia ae
                     on (p.idindicador = ae.idindicador AND ae.identidad = "
                . ($parametros->idestructura) . ")


                    WHERE p.idejercicio = " . ($parametros->idejercicio) . "
                     AND p.idcentrobalance = " . ($parametros->idcentrobalance)
                . "
                     Group by i.idindicador,unidadm.abreviatura,i.codigo,
                     ip.precio,ip.preciodivisa,i.numeropieza,i.denominacion,
                     ae.coberturatotalestimada,em.idmodelo
                    ) as foo
                    Group by foo.idindicador,foo.codigo,foo.precio,foo.preciodivisa,
                    foo.numeropieza,foo.denominacion,foo.coberturatotalestimada,
                    foo.idmodelo,foo.idumedida order by foo.codigo) as q

                    INNER JOIN

                    (SELECT cd.idcontroldivisa, cd.codigo as codigocd,
                    cd.denominacion as denomcontroldiv, m.idmodelo,
                    m.denominacion as denommodelo,
cim.idindicador, cim.identidadmodelo,i.denominacion as denomindicador

FROM mod_planificacion.dat_controldivisaindicadormodelo cim
INNER JOIN mod_planificacion.nom_controldivisa cd
on  cim.idcontroldivisa = cd.idcontroldivisa
INNER JOIN mod_datosmaestros.nom_indicador i on p.idindicador=i.idindicador
INNER JOIN mod_datosmaestros.nom_indicadorplanif ip on ip.idindicador=i.idindicador

LEFT JOIN mod_planificacion.dat_entidadmodelo em
on cim.identidadmodelo = em.identidadmodelo
LEFT JOIN mod_planificacion.dat_modelo m
on em.idmodelo = m.idmodelo
WHERE cim.idaprobacion=4 AND m.denominacion LIKE '%upper(operaciones comerciales)%'
) as x
ON (q.indicador = x.idindicador and (x.idmodelo = q.elmodelo OR x.idmodelo is null))
 ";
        return $consulta;
    }

    public function listar($identidad, $parametros, $filtros, $start = 0, $limit = 20
    ) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = " SELECT doc.iddocumentoaprobacion,doc.numero,doc.version,
            doc.numeroaprobacion,doc.esmanual,doc.fecha,doc.idaprobacion,
            doc.idusuario,ne.ejercicio ";

        $cadenaJOIN = " FROM mod_planificacion.dat_documentoaprobacion doc
                       INNER JOIN mod_planificacion.nom_ejercicioplanificacion ne
                        ON ne.idejercicio=doc.idejercicio ";

        $cadenaWHERE = " WHERE doc.identidad = " . $identidad . " AND doc.idejercicio="
                . ($parametros->idejercicio) . " ";


        if (!empty($filtros)) {
            foreach ($filtros as $value) {
                if ($value['field'] == 'numeroaprobacion') {
                    $cadenaWHERE
                            .= " AND upper(doc.numeroaprobacion) LIKE '%"
                            . strtoupper($value['data']['value']) . "%' ";
                } else {
                    if ($value['field'] == 'version') {
                        if ($value['data']['comparison'] == 'gt') {
                            $cadenaWHERE .= " AND doc.version > "
                                    . ($value['data']['value']) . " ";
                        }
                        if ($value['data']['comparison'] == 'lt') {
                            $cadenaWHERE .= " AND doc.version < "
                                    . ($value['data']['value']) . " ";
                        }
                        if ($value['data']['comparison'] == 'eq') {
                            $cadenaWHERE .= " AND doc.version = "
                                    . ($value['data']['value']) . " ";
                        }
                    } else {
                        if ($value['field'] == 'ejercicio') {
                            $cadenaWHERE .= " AND ne.ejercicio LIKE '%"
                                    . ($value['data']['value']) . "%' ";
                        } else {
                            if ($value['field'] == 'fecha') {
                                if ($value['data']['comparison'] == 'gt') {
                                    $cadenaWHERE .= " AND doc.fecha > '"
                                            . ($value['data']['value']) . "' ";
                                }
                                if ($value['data']['comparison'] == 'lt') {
                                    $cadenaWHERE .= " AND doc.fecha < '"
                                            . ($value['data']['value']) . "' ";
                                }
                                if ($value['data']['comparison'] == 'eq') {
                                    $cadenaWHERE .= " AND doc.fecha = '"
                                            . ($value['data']['value']) . "' ";
                                }
                            } else {
                                if ($value['field'] == 'idaprobacion') {
                                    if ($value['data']['value'] == 'true') {
                                        $cadenaWHERE .= " AND doc.idaprobacion = 4 ";
                                    } else {
                                        $cadenaWHERE .= " AND doc.idaprobacion = 1 ";
                                    }
                                } else {
                                    if ($value['field'] == 'numero') {
                                        if ($value['data']['comparison'] == 'gt'
                                        ) {
                                            $cadenaWHERE .= " AND doc.numero > "
                                                    . ($value['data']['value'])
                                                    . " ";
                                        }
                                        if ($value['data']['comparison'] == 'lt'
                                        ) {
                                            $cadenaWHERE .= " AND doc.numero < "
                                                    . ($value['data']['value'])
                                                    . " ";
                                        }
                                        if ($value['data']['comparison'] == 'eq'
                                        ) {
                                            $cadenaWHERE .= " AND doc.numero = "
                                                    . ($value['data']['value'])
                                                    . " ";
                                        }
                                    } else {
                                        if ($value['field'] == 'esmanual') {
                                            if ($value['data']['value'] == 'Automático'
                                            ) {
                                                $cadenaWHERE .= " AND doc.esmanual = 0 ";
                                            } else {
                                                $cadenaWHERE .= " AND doc.esmanual = 1 ";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }


        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conex = Doctrine_Manager:: connection();
        $resultado['total'] = count($conex->execute($cadenaQUERY)->fetchAll());
        $cadenaQUERY .= " LIMIT(" . $limit . ") OFFSET(" . $start . ") ";
        $result = $conex->execute($cadenaQUERY)->fetchAll();

        $resultado['data'] = $result;
        return $resultado;
    }

    public function listartotal($identidad) {
        $query = Doctrine_Query::create();
        $query->select(
                        'da.iddocumentoaprobacion,da.idusuario,da.identidad,da.idaprobacion,
            da.fecha,da.numero,da.esmanual,da.version,ej.ejercicio as ejercicio,
            c.denominacion as concepto'
                )->from('DatDocumentoaprobacion da')
                ->innerjoin('da.NomEjercicioplanificacion ej')
                ->innerjoin('da.DatConceptoespecialidad ce')
                ->innerjoin('ce.NomConcepto c')
                ->where('da.identidad = ?', array($identidad));

        $result = $query->count();

        return $result;
    }

    public function getdatosDocumentoManual($parametros, $iddoc = 34, $start = 0, $limit = 20
    ) {
        $documento = Doctrine::getTable('DatDocumentoaprobacion')->find($iddoc);
        $select = " ";
        $joinINNER = " ";
        $joinLEFT = " ";
        if (isset($documento)) {

            if ($documento->esmanual == 0) {
                $select = " DISTINCT dm.denominacion as destino, ";
                $joinINNER = " INNER JOIN mod_planificacion.dat_controldivisaindicadormodelo dcdim
                    ON dcdim.idcontroldivisa=ncd.idcontroldivisa AND dcdim.idaprobacion=4
                    ";
                $joinLEFT = " ";
            } else {
                $select = "dcd.operacionesnc as destino,";
            }
        }
        $cadenaSELECT = " SELECT " . $select . " doc.iddocumentoaprobacion,
        doc.identidad,doc.numeroaprobacion,doc.fecha,doc.idusuario,
        doc.idtipoaprobacion,dn.denominacion as tipoaprobacion,
            case when doc.esmanual=1 then 'Manual' else 'Automático' end as origen ,
             case when doc.idaprobacion=1 then 'Desaprobado' else 'Aprobado' end as estado ,
              va.denominacion as via, dcd.importe,dcd.cantidad,
            ncd.denominacion as denominacion,ncd.codigo as codigo, dcd.idcontroldivisa,
            va.idviaadquisicion as idvia,dcdm.identidadmodelo  ";
        $cadenaJOIN = " FROM mod_planificacion.dat_documentoaprobacion doc
                        INNER JOIN mod_planificacion.nom_datosnomenclador dn
                        ON dn.iddatosnomenclador = doc.idtipoaprobacion
                        INNER JOIN mod_planificacion.dat_controldivisadocumentoaprobacion dcd
                        ON doc.iddocumentoaprobacion=dcd.iddocumentoaprobacion
                        INNER JOIN mod_planificacion.nom_controldivisa ncd
                        ON dcd.idcontroldivisa=ncd.idcontroldivisa
                        " . $joinINNER . "
                        INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion dcdv
                        ON dcdv.idcontroldivisadocumentoaprobacion=dcd.idcontroldivisadocumentoaprobacion
                        INNER JOIN mod_datosmaestros.nom_viaadquisicion va
                        ON va.idviaadquisicion=dcdv.idviaadquisicion
                        LEFT JOIN  mod_planificacion.dat_controldivisadocumentomodelo dcdm
                        ON dcdm.idcontroldivisadocumentoaprobacion=dcd.idcontroldivisadocumentoaprobacion
                        LEFT JOIN  mod_planificacion.dat_entidadmodelo de
                        ON de.identidadmodelo=dcdm.identidadmodelo
                        LEFT JOIN  mod_planificacion.dat_modelo dm
                        ON de.idmodelo=dm.idmodelo
                        " . $joinLEFT . " ";
        $cadenaWHERE = " WHERE  doc.iddocumentoaprobacion=" . ($iddoc) . "";
        $cadenaGROUPBY = "  ORDER BY  va.denominacion ";
        $cadenaQUERY = "";

        if ($iddoc) {
            if ($parametros) {
                foreach ($parametros as $p => $s) {
                    if ($s != '') {
                        if ($p == 'denominacioncd') {
                            $cadenaWHERE .= " AND upper(ncd.denominacion) LIKE '%"
                                    . (strtoupper($s)) . "%' ";
                        } else {
                            if ($p == 'codigo') {
                                $cadenaWHERE .= " AND ncd.codigo LIKE '%" . ($s)
                                        . "%' ";
                            } else {
                                if ($p == 'via') {
                                    $cadenaWHERE .= " AND upper(va.denominacion) LIKE '%"
                                            . (strtoupper($s)) . "%' ";
                                } else {
                                    if ($p == 'modelo') {
                                        $cadenaWHERE .= " AND upper(dm.denominacion) LIKE '%"
                                                . (strtoupper($s)) . "%' ";
                                    } else {
                                        if ($p == 'importemayor') {
                                            $cadenaWHERE .= " AND dcd.importe > "
                                                    . ($s) . "  ";
                                        } else {
                                            if ($p == 'importemenor') {
                                                $cadenaWHERE .= " AND dcd.importe < "
                                                        . ($s) . "  ";
                                            } else {
                                                if ($p == 'importeigual') {
                                                    $cadenaWHERE .= " AND dcd.importe = "
                                                            . ($s) . "  ";
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE
                . $cadenaGROUPBY;
        /* $total
          = "  SELECT SUM (ss.importe) as importetotal
          FROM( SELECT doc.iddocumentoaprobacion,doc.numeroaprobacion,
          doc.fecha,doc.idusuario,dn.denominacion as tipoaprobacion,
          case when doc.esmanual=1 then 'Manual' else 'Automático' end as origen ,
          va.denominacion as via, dm.denominacion as destino,dcd.importe,
          ncd.denominacion as denominacion,ncd.codigo as codigo
          FROM mod_planificacion.dat_documentoaprobacion doc
          INNER JOIN mod_planificacion.nom_datosnomenclador dn
          ON dn.iddatosnomenclador = doc.idtipoaprobacion
          INNER JOIN mod_planificacion.dat_controldivisadocumentoaprobacion dcd
          ON doc.iddocumentoaprobacion=dcd.iddocumentoaprobacion
          INNER JOIN mod_planificacion.nom_controldivisa ncd
          ON dcd.idcontroldivisa=ncd.idcontroldivisa
          " . $joinINNER . "
          INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion dcdv
          ON dcdv.idcontroldivisadocumentoaprobacion=dcd.idcontroldivisadocumentoaprobacion
          INNER JOIN mod_datosmaestros.nom_viaadquisicion va
          ON va.idviaadquisicion=dcdv.idviaadquisicion
          LEFT JOIN  mod_planificacion.dat_controldivisadocumentomodelo dcdm
          ON dcdm.idcontroldivisadocumentoaprobacion=dcd.idcontroldivisadocumentoaprobacion
          LEFT JOIN  mod_planificacion.dat_entidadmodelo de
          ON de.identidadmodelo=dcdm.identidadmodelo
          LEFT JOIN  mod_planificacion.dat_modelo dm ON de.idmodelo=dm.idmodelo
          " . $joinLEFT . "
          WHERE  doc.iddocumentoaprobacion= " . ($iddoc) . "
          GROUP BY doc.iddocumentoaprobacion,doc.numeroaprobacion,
          doc.fecha,doc.idusuario,dn.denominacion,va.denominacion , dm.denominacion ,
          dcd.importe,ncd.denominacion,ncd.codigo,doc.esmanual) as ss "; */
        $limit = ($limit) ? $limit : 20;
        $start = ($start) ? $start : 0;
        $conex = Doctrine_Manager:: connection();
        $to = $conex->execute("SELECT SUM(este.importe)
            FROM({$cadenaQUERY}) AS este")->fetchAll();
        $resultado['total'] = count($conex->execute($cadenaQUERY)->fetchAll());
        $cadenaQUERY .= " LIMIT(" . $limit . ") OFFSET(" . $start . ") ";
        $result = $conex->execute($cadenaQUERY)->fetchAll();

        $resultado['resultado'] = $result;

        $resultado['resultado'][0]['importetotal'] = $to[0]['sum'];
        return $resultado;
    }

    public function cuerpoDocumentototal($parametros) {
        $imprimirSelect = "";
        $imprimirJoin = "";
        $imprimirWhere = "";
        if ($parametros['imprimir)']) {
            $imprimirSelect = " SELECT DISTINCT(fin.idcontroldivisa),importe,numeroaprobacion,
 fecha,origen,fin.denominacion,codigo,fin.idviaadquisicion,identidad,
 case when ((uriviaadquisicion LIKE 'importacion directa'
 AND COALESCE(oqs.uriorganosatisface,'ad') LIKE 'concentracioncompras')
  OR (uriviaadquisicion LIKE 'sustitucionimportaciones'
  AND COALESCE(oqs.uriorganosatisface,'ad') LIKE 'ferreteria'))
  then oqs.denominacion else  fin.via end as via,oqs.idorganosatisface
 FROM
 ( ";
            $imprimirJoin = " ) as fin
            INNER JOIN mod_planificacion.dat_controldivisaindicadormodelo cdim
            ON cdim.idcontroldivisa=fin.idcontroldivisa
            INNER JOIN  mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface ivo
            ON ivo.idviaadquisicion=fin.idviaadquisicion AND cdim.idindicador=ivo.idindicador
            INNER JOIN  mod_datosmaestros.nom_organosatisface oqs
            ON oqs.idorganosatisface=ivo.idorganosatisface  ";
            $imprimirWhere = " WHERE cdim.idaprobacion=4 GROUP BY importe,fin.idcontroldivisa,
                numeroaprobacion,fecha,origen,fin.denominacion,
                codigo,fin.idviaadquisicion,
            identidad,uriviaadquisicion,oqs.uriorganosatisface,oqs.denominacion,
            fin.via,oqs.idorganosatisface
            ";
        }

        $cadenaSELECT = " " . $imprimirSelect . " SELECT SUM(dcd.importe) as importe,
        dcd.idcontroldivisa,doc.numeroaprobacion,doc.fecha,
            case when doc.esmanual=1 then 'Manual' else 'Automático' end as origen ,
            va.denominacion as via,
            ncd.denominacion as denominacion,ncd.codigo as codigo,
            dcdv.idviaadquisicion ,doc.identidad,va.uriviaadquisicion";
        $cadenaJOIN = " FROM mod_planificacion.dat_documentoaprobacion doc
                        INNER JOIN mod_planificacion.nom_datosnomenclador dn
                        ON dn.iddatosnomenclador = doc.idtipoaprobacion
                        INNER JOIN mod_planificacion.dat_controldivisadocumentoaprobacion dcd
                        ON doc.iddocumentoaprobacion=dcd.iddocumentoaprobacion
                        INNER JOIN mod_planificacion.nom_controldivisa ncd
                        ON dcd.idcontroldivisa=ncd.idcontroldivisa
                        INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion dcdv
                        ON dcdv.idcontroldivisadocumentoaprobacion=dcd.idcontroldivisadocumentoaprobacion
                        INNER JOIN mod_datosmaestros.nom_viaadquisicion va
                        ON va.idviaadquisicion=dcdv.idviaadquisicion
                        LEFT JOIN  mod_planificacion.dat_controldivisadocumentomodelo dcdm
                        ON dcdm.idcontroldivisadocumentoaprobacion=dcd.idcontroldivisadocumentoaprobacion
                        LEFT JOIN  mod_planificacion.dat_entidadmodelo de
                        ON de.identidadmodelo=dcdm.identidadmodelo
                        LEFT JOIN  mod_planificacion.dat_modelo dm
                        ON de.idmodelo=dm.idmodelo  ";
        $cadenaWHERE = " WHERE  doc.iddocumentoaprobacion=" . ($parametros['iddocumentoaprobacion']) . "
        AND COALESCE(dm.denominacion,'bb') NOT LIKE '%upper(operaciones comerciales)%'
            GROUP BY dcd.idcontroldivisa,doc.numeroaprobacion,doc.fecha,
            doc.esmanual, va.denominacion, ncd.denominacion,ncd.codigo,
            dcdv.idviaadquisicion,doc.identidad,va.uriviaadquisicion
             " . $imprimirJoin . " " . $imprimirWhere . " ORDER BY via ";
        $cadenaQUERY = "";


        /* $cadenaQUERY ="SELECT cd.codigo,
          cd.denominacion,
          v.denominacion as via,
          cdda.idindicador,
          n.denominacion as naturaleza,
          importe,
          cantidad,numeroaprobacion as aprobacion,
          i.denominacion as indicador,ip.precio,porciento
          FROM mod_planificacion.dat_documentoaprobacion da
          INNER JOIN mod_planificacion.dat_controldivisadocumentoaprobacion
          cdda ON
          da.iddocumentoaprobacion = cdda.iddocumentoaprobacion
          INNER JOIN mod_planificacion.nom_controldivisa cd ON
          cd.idcontroldivisa =
          cdda.idcontroldivisa
          INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion
          cddvia ON cddvia.idcontroldivisadocumentoaprobacion =
          cdda.idcontroldivisadocumentoaprobacion
          INNER JOIN mod_datosmaestros.nom_viaadquisicion v ON
          v.idviaadquisicion =
          cddvia.idviaadquisicion
          INNER JOIN mod_planificacion.dat_controldivisadocumentomodelo
          cddm ON
          cddm.idcontroldivisadocumentoaprobacion=cdda.idcontroldivisadocumentoaprobacion
          INNER JOIN mod_datosmaestros.nom_indicador i ON
          cdda.idindicador=i.idindicador
          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON
          i.idindicador=ip.idindicador
          INNER JOIN mod_planificacion.conf_contingenciaviasadq convia on v.idviaadquisicion = convia.idviaadquisicion
          and  da.idejercicio =convia.idejercicio
          INNER JOIN mod_datosmaestros.nom_naturaleza n ON
          i.idnaturaleza=n.idnaturaleza
          WHERE cdda.iddocumentoaprobacion = $iddoc AND
          (v.uriviaadquisicion <> 'balancecentral' OR v.uriviaadquisicion <> 'oace')"; */

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function cuerpoDocumentototalPlanOP($parametros) {

        $cadenaSELECT = " SELECT SUM(dcd.importe) as importe,
            dcd.idcontroldivisa,dm.denominacion as via,
            ncd.denominacion as denominacion,
            ncd.codigo as codigo,doc.identidad";
        $cadenaJOIN = " FROM mod_planificacion.dat_documentoaprobacion doc
                        INNER JOIN mod_planificacion.dat_controldivisadocumentoaprobacion dcd
                        ON doc.iddocumentoaprobacion=dcd.iddocumentoaprobacion
                        INNER JOIN mod_planificacion.nom_controldivisa ncd
                        ON dcd.idcontroldivisa=ncd.idcontroldivisa
                        LEFT JOIN  mod_planificacion.dat_controldivisadocumentomodelo dcdm
                        ON dcdm.idcontroldivisadocumentoaprobacion=dcd.idcontroldivisadocumentoaprobacion
                        LEFT JOIN  mod_planificacion.dat_entidadmodelo de
                        ON de.identidadmodelo=dcdm.identidadmodelo
                        LEFT JOIN  mod_planificacion.dat_modelo dm ON de.idmodelo=dm.idmodelo ";
        $cadenaWHERE = " WHERE  doc.iddocumentoaprobacion=" . ($parametros['iddocumentoaprobacion']) . "
        AND dm.denominacion LIKE '%upper(operaciones comerciales)%'
            GROUP BY dcd.idcontroldivisa, ncd.denominacion,
            ncd.codigo,dm.denominacion,doc.identidad
            ";
        $cadenaQUERY = "";


        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function listarOperaciones($aprobacion, $ejercicio, $identidad) {
        $query = Doctrine_Query::create();


        $cadenaQUERY = "SELECT nd.denominacion,nd.iddatosnomenclador,nt.idtiponomenclador
FROM mod_planificacion.nom_datosnomenclador nd
INNER JOIN mod_planificacion.nom_tiponomenclador nt on (nd.idtiponomenclador= nt.idtiponomenclador)

WHERE nt.uritiponomenclador = 'operaciones' AND
        nd.iddatosnomenclador Not IN (SELECT
  mod_planificacion.dat_documentoaprobacion.idoperacion
FROM
  mod_planificacion.dat_documentoaprobacion
WHERE
  mod_planificacion.dat_documentoaprobacion.idejercicio= $ejercicio AND
  mod_planificacion.dat_documentoaprobacion.identidad=$identidad
  AND
  mod_planificacion.dat_documentoaprobacion.idtipoaprobacion=$aprobacion
  )";

        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();

        /* $query->select(
          'nd.denominacion,nd.iddatosnomenclador,nt.idtiponomenclador'
          )->from('NomDatosnomenclador nd')
          ->innerjoin('nd.NomTiponomenclador nt')
          ->where("nt.uritiponomenclador = ?,nt.idoperacion=?",array('operaciones',$aprobacion))
          ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
          $result = $query->execute();
         */
        return $result;
    }

    public function listarTipoAprobacion($accion, $identidad, $parametros) {

        $query = "SELECT DISTINCT  count(d.idtipoaprobacion)as cantidad,d.idtipoaprobacion
FROM mod_planificacion.dat_documentoaprobacion d
WHERE d.identidad = $identidad AND
      d.idejercicio = $parametros->idejercicio
      GROUP BY d.idtipoaprobacion";

        $conex = Doctrine_Manager:: connection();
        $a = $conex->execute($query)->fetchAll();

        $query = Doctrine_Query::create();
        $queryAux = Doctrine_Query::create();

        foreach ($a as $value) {
            if ($value['cantidad'] > 0) {
                $comparar[] = $value['idtipoaprobacion'];
            }
        }
        $query->select(
                        'nd.denominacion,nd.iddatosnomenclador,nt.idtiponomenclador'
                )->from('NomDatosnomenclador nd')
                ->innerjoin('nd.NomTiponomenclador nt')
                ->leftjoin('nd.DatDocumentoaprobacion dc')
                ->addWhere("nt.uritiponomenclador = 'tipoaprobacion'")
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        //if ($accion == "Manual" || $accion == "Duplicar") {

        if (count($comparar) > 0) {
            $query->whereNotIn("nd.iddatosnomenclador", $comparar);
        }
        //}
        $result = $query->execute();
        return $result;
    }

    public function listarnaturaleza($parametros) {
        // $parametros->idcontroldivisa
        $query = "SELECT
 DISTINCT mod_datosmaestros.nom_naturaleza.denominacion,
 mod_datosmaestros.nom_naturaleza.idnaturaleza
FROM
  mod_planificacion.dat_controldivisaindicadormodelo
  INNER JOIN mod_datosmaestros.nom_indicador ON (mod_planificacion.dat_controldivisaindicadormodelo.idindicador = mod_datosmaestros.nom_indicador.idindicador)
  INNER JOIN mod_datosmaestros.nom_naturaleza ON (mod_datosmaestros.nom_indicador.idnaturaleza = mod_datosmaestros.nom_naturaleza.idnaturaleza)
WHERE
  mod_planificacion.dat_controldivisaindicadormodelo.idcontroldivisa =$parametros->idcontroldivisa";
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($query)->fetchAll();

        return $result;

        /* $query->select('MAX(da.numero)')
          ->from('DatDocumentoaprobacion da')
          ->where(
          "da.identidad = ? AND da.idejercicio=?",
          array($identidad, $parametros->idejercicio)
          )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
          $result = $query->execute();
          if (count($result) == 0) {
          return 1;
          }
          return $result[0]['MAX'] + 1; */
    }

    public function listarmanual($params) {

        $condicionentindad = "AND da.identidad = {$params->identidad}";
        $condicionfecha = "";
        if ($params->identidad == 0) {
            $condicionentindad = "";
        }

        if ($params->fechainicio != 'false') {
            $condicionfecha.=" AND da.fecha > '{$params->fechainicio}'";
        }
        if ($params->fechafin != 'false') {
            $condicionfecha.=" AND da.fecha < '{$params->fechafin}'";
        }

        $query = "SELECT da.identidad,
       via.denominacion as viaadq,
       via.uriviaadquisicion,
       dn.denominacion as tipooperacion,
       sum(cdda.importe) as importe,
       cdda.operacionesnc,
       COALESCE(cont.porciento,0) as contingencia
      FROM mod_planificacion.dat_documentoaprobacion da
     INNER JOIN mod_planificacion.dat_controldivisadocumentoaprobacion cdda ON
       cdda.iddocumentoaprobacion = da.iddocumentoaprobacion
     INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion
       cddvia ON cddvia.idcontroldivisadocumentoaprobacion =
       cdda.idcontroldivisadocumentoaprobacion
     INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON via.idviaadquisicion
       = cddvia.idviaadquisicion
     LEFT JOIN   mod_planificacion.conf_contingenciaviasadq cont ON (cont.idviaadquisicion=via.idviaadquisicion AND
      cont.idejercicio = $params->ejercicio)
      INNER JOIN mod_planificacion.nom_datosnomenclador dn ON dn.iddatosnomenclador = da.idoperacion
    WHERE da.idejercicio = $params->ejercicio AND da.esmanual = 1 {$condicionentindad}
    {$condicionfecha}
GROUP BY da.identidad,
         via.denominacion,
         cdda.operacionesnc,
         cont.porciento,
         dn.denominacion,
         via.uriviaadquisicion
         ORDER BY da.identidad
         ";

        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($query)->fetchAll(PDO::FETCH_ASSOC);


        return $result;
    }

    public function listarmanualReportegeneral($params) {

        $condicionentindad = "AND da.identidad = {$params['identidad']}";
        $condicionfecha = "";
        if ($params['identidad'] == 0) {
            $condicionentindad = "";
        }

        if ($params['fechainicio']) {
            $condicionfecha.=" AND da.fecha > '{$params['fechainicio']}'";
        }
        if ($params['fechafin']) {
            $condicionfecha.=" AND da.fecha < '{$params['fechafin']}'";
        }

        $query = "SELECT da.identidad,
       via.denominacion as viaadq,
       via.uriviaadquisicion,
       sum(cdda.importe) as importe,
       cdda.operacionesnc,dn.denominacion as tipoaprobacion,
       COALESCE(cont.porciento,0) as contingencia
      FROM mod_planificacion.dat_documentoaprobacion da
     INNER JOIN mod_planificacion.dat_controldivisadocumentoaprobacion cdda ON
       cdda.iddocumentoaprobacion = da.iddocumentoaprobacion
       INNER JOIN mod_planificacion.nom_datosnomenclador dn
                        ON dn.iddatosnomenclador = da.idtipoaprobacion
     INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion
       cddvia ON cddvia.idcontroldivisadocumentoaprobacion =
       cdda.idcontroldivisadocumentoaprobacion
     INNER JOIN mod_datosmaestros.nom_viaadquisicion via ON via.idviaadquisicion
       = cddvia.idviaadquisicion
     LEFT JOIN   mod_planificacion.conf_contingenciaviasadq cont ON (cont.idviaadquisicion=via.idviaadquisicion AND
      cont.idejercicio = {$params['idejercicio']})
    WHERE da.idejercicio = {$params['idejercicio']} AND da.esmanual = 1 AND da.idaprobacion = 4 AND da.iddocumentoaprobacion IN ({$params['iddocs']})
    {$condicionentindad}
    {$condicionfecha}
GROUP BY da.identidad,
         via.denominacion,
         cdda.operacionesnc,
         dn.denominacion,
         cont.porciento,
         via.uriviaadquisicion
         ORDER BY da.identidad
         ";

        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($query)->fetchAll(PDO::FETCH_ASSOC);


        return $result;
    }

    public function listarautomatico($params) {

        $condicionentindad = "AND cb.identidad = {$params->identidad}";
        if ($params->identidad == 0) {
            $condicionentindad = "";
        }

        $query = "SELECT final.idvia,
final.via as viaadq,
       final.idindicador,
       final.destino,
       final.centrobalance as identidad, final.uriviaadquisicion,
       final.tipooperacion,
       final.contingencia,
       sum(final.importemlc) as importe
FROM (
       Select
              q.elmodelo,
              x.idvia,
              x.via,x.idcontroldivisa,
              q.idindicador,
              q.importemlc,
              q.destino,
              q.centrobalance,x.uriviaadquisicion,
              x.tipooperacion,q.contingencia
       from (
              SELECT foo.idindicador,
                     foo.preciodivisa,foo.contingencia,
                     foo.coberturatotalestimada,
                     foo.idmodelo as elmodelo,
                     foo.destino,
                     foo.centrobalance,
                     SUM(foo.necesidad) -
                     (
                       SELECT COALESCE(SUM(cpe), 0) as cpe
                       FROM mod_planificacion.dat_odcte odcte
                       WHERE idindicador = foo.idindicador
                     ) -
                     (
                       SELECT COALESCE(SUM(coberturaparcialestimada), 0)
                       FROM mod_planificacion.dat_ajusteexistenciacb aecb
                       WHERE identidad = foo.identidad AND
                             idindicador = foo.idindicador
                     ) as demandacb,
                     (SUM(foo.necesidad) -
                     (
                       SELECT COALESCE(SUM(cpe), 0) as cpe
                       FROM mod_planificacion.dat_odcte odcte
                       WHERE idindicador = foo.idindicador
                     ) -
                     (
                       SELECT COALESCE(SUM(coberturaparcialestimada), 0)
                       FROM mod_planificacion.dat_ajusteexistenciacb aecb
                       WHERE identidad = foo.identidad AND
                             idindicador = foo.idindicador
                     )) * foo.preciodivisa as importemlc

              FROM (
                     SELECT i.idindicador,
                            ip.preciodivisa,ip.contingencia,
                            em.idmodelo,
                            SUM(p.cantidad) as necesidad,
                           COALESCE(ae.coberturatotalestimada,0) as coberturatotalestimada,

                            dn.denominacion as destino,
                            cb.identidad as centrobalance,
                            em.identidad
                     FROM mod_planificacion.dat_planificacion p
                          INNER JOIN mod_datosmaestros.nom_indicador i on
                            p.idindicador = i.idindicador
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip on
                            ip.idindicador = i.idindicador
                          INNER JOIN mod_planificacion.dat_entidadmodelo em on
                            p.identidadmodelo = em.identidadmodelo
                          LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on
                            (p.idindicador = ae.idindicador AND ae.identidad =
                             em.identidad)
                          LEFT JOIN mod_planificacion.dat_odcte odcte on (
                            i.idindicador = odcte.idindicador AND
                            odcte.identidad = em.identidad AND em.idmodelo =
                            odcte.idmodelo)
                          left JOIN mod_planificacionmeta.dat_004 meta ON
                            p.idplanificacion = meta.idplanificacion
                          left JOIN mod_planificacion.nom_datosnomenclador dn
                            ON dn.iddatosnomenclador = meta.n4
                           INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON p.idcentrobalance=cb.identidaddatosnomenclador
                     WHERE p.idejercicio = $params->ejercicio {$condicionentindad}
                     Group by i.idindicador,
                              ip.preciodivisa,
                              ip.contingencia,
                              ae.coberturatotalestimada,
                              em.idmodelo,
                              dn.denominacion,
                            cb.identidad,em.identidad
                   ) as foo
              Group by foo.idindicador,
                       foo.preciodivisa,
                       foo.coberturatotalestimada,
                       foo.idmodelo,
                       foo.destino,
                       foo.centrobalance,foo.identidad,foo.contingencia
            ) as q
            INNER JOIN
            (
              SELECT DISTINCT
                     m.idmodelo,
                     cim.idindicador,
                     v.uriviaadquisicion,cd.idcontroldivisa,
                     iv.idviaadquisicion as idvia,
                     v.denominacion as via,
                     dn.denominacion as tipooperacion
              FROM mod_planificacion.dat_controldivisaindicadormodelo cim
                   INNER JOIN mod_planificacion.nom_controldivisa cd on
                     cim.idcontroldivisa = cd.idcontroldivisa
                   INNER JOIN mod_datosmaestros.nom_indicador i on
                     cim.idindicador = i.idindicador
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv
                     ON i.idindicador = iv.idindicador
                      INNER JOIN mod_planificacion.dat_controldivisadocumentoaprobacion cdda ON
    					cdda.idcontroldivisa=cim.idcontroldivisa
                     INNER JOIN mod_planificacion.dat_documentoaprobacion da ON da.iddocumentoaprobacion = cdda.iddocumentoaprobacion

     INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion
       cddvia ON cddvia.idcontroldivisadocumentoaprobacion = cdda.idcontroldivisadocumentoaprobacion

                     INNER JOIN mod_datosmaestros.nom_viaadquisicion v ON iv.idviaadquisicion=v.idviaadquisicion
                   LEFT JOIN mod_planificacion.dat_entidadmodelo em on
                     cim.identidadmodelo = em.identidadmodelo
                   LEFT JOIN mod_planificacion.dat_modelo m on em.idmodelo =
                     m.idmodelo

      INNER JOIN mod_planificacion.nom_datosnomenclador dn ON dn.iddatosnomenclador = da.idoperacion
              WHERE cim.idaprobacion = 4
            ) as x ON (q.idindicador = x.idindicador and (x.idmodelo =
              q.elmodelo OR x.idmodelo is null))
     ) as final
GROUP BY
         final.elmodelo,
         final.idvia,
         final.idindicador,
         final.destino,
         final.centrobalance, final.uriviaadquisicion,
         final.via, final.tipooperacion,final.contingencia
         ";

        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($query)->fetchAll(PDO::FETCH_ASSOC);


        return $result;
    }

    public function pdtadistribuirautomatico($params) {
        $condicionentindad = "AND cb.identidad = {$params->identidad}";
        if ($params->identidad == 0) {
            $condicionentindad = "";
        }

        $query = "SELECT final.idvia,
final.via as viaadq,
       final.idindicador,
       final.destino,
       final.centrobalance as identidad, final.uriviaadquisicion,
      -- final.tipooperacion,
       final.contingencia,
       sum(final.importemlc) as importe
FROM (
       Select
              q.elmodelo,
              x.idvia, x.idcontroldivisa,
              x.via,
              q.idindicador,
              q.importemlc,
              q.destino,
              q.centrobalance,x.uriviaadquisicion,
             -- x.tipooperacion,
             q.contingencia
       from (
              SELECT foo.idindicador,
                     foo.preciodivisa,foo.contingencia,
                     foo.coberturatotalestimada,
                     foo.idmodelo as elmodelo,
                     foo.destino,
                     foo.centrobalance,
                     SUM(foo.necesidad) -
                     (
                       SELECT COALESCE(SUM(cpe), 0) as cpe
                       FROM mod_planificacion.dat_odcte odcte
                       WHERE idindicador = foo.idindicador
                     ) -
                     (
                       SELECT COALESCE(SUM(coberturaparcialestimada), 0)
                       FROM mod_planificacion.dat_ajusteexistenciacb aecb
                       WHERE identidad = foo.identidad AND
                             idindicador = foo.idindicador
                     ) as demandacb,
                     (SUM(foo.necesidad) -
                     (
                       SELECT COALESCE(SUM(cpe), 0) as cpe
                       FROM mod_planificacion.dat_odcte odcte
                       WHERE idindicador = foo.idindicador
                     ) -
                     (
                       SELECT COALESCE(SUM(coberturaparcialestimada), 0)
                       FROM mod_planificacion.dat_ajusteexistenciacb aecb
                       WHERE identidad = foo.identidad AND
                             idindicador = foo.idindicador
                     )) * foo.preciodivisa as importemlc

              FROM (
                     SELECT i.idindicador,
                            ip.preciodivisa,ip.contingencia,
                            em.idmodelo,
                            SUM(p.cantidad) as necesidad,
                           COALESCE(ae.coberturatotalestimada,0) as coberturatotalestimada,

                            dn.denominacion as destino,
                            cb.identidad as centrobalance,
                            em.identidad
                     FROM mod_planificacion.dat_planificacion p
                          INNER JOIN mod_datosmaestros.nom_indicador i on
                            p.idindicador = i.idindicador
                          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip on
                            ip.idindicador = i.idindicador
                          INNER JOIN mod_planificacion.dat_entidadmodelo em on
                            p.identidadmodelo = em.identidadmodelo
                          LEFT JOIN mod_planificacion.dat_ajusteexistencia ae on
                            (p.idindicador = ae.idindicador AND ae.identidad =
                             em.identidad)
                          LEFT JOIN mod_planificacion.dat_odcte odcte on (
                            i.idindicador = odcte.idindicador AND
                            odcte.identidad = em.identidad AND em.idmodelo =
                            odcte.idmodelo)
                          left JOIN mod_planificacionmeta.dat_991 meta ON
                            p.idplanificacion = meta.idplanificacion
                          left JOIN mod_planificacion.nom_datosnomenclador dn
                            ON dn.iddatosnomenclador = meta.n156
                           INNER JOIN mod_planificacion.dat_entidaddatosnomenclador cb ON p.idcentrobalance=cb.identidaddatosnomenclador
                     WHERE p.idejercicio = $params->ejercicio {$condicionentindad}
                     Group by i.idindicador,
                              ip.preciodivisa,
                              ip.contingencia,
                              ae.coberturatotalestimada,
                              em.idmodelo,
                              dn.denominacion,
                            cb.identidad,em.identidad
                   ) as foo
              Group by foo.idindicador,
                       foo.preciodivisa,
                       foo.coberturatotalestimada,
                       foo.idmodelo,
                       foo.destino,
                       foo.centrobalance,foo.identidad,foo.contingencia
            ) as q
            INNER JOIN
            (
              SELECT DISTINCT
                     m.idmodelo,
                     cim.idindicador, cd.idcontroldivisa,
                     v.uriviaadquisicion,
                     iv.idviaadquisicion as idvia,
                     v.denominacion as via--,

              FROM mod_planificacion.dat_controldivisaindicadormodelo cim
                   INNER JOIN mod_planificacion.nom_controldivisa cd on
                     cim.idcontroldivisa = cd.idcontroldivisa
                   INNER JOIN mod_datosmaestros.nom_indicador i on
                     cim.idindicador = i.idindicador
                   INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion iv
                     ON i.idindicador = iv.idindicador
               /* */
                     INNER JOIN mod_datosmaestros.nom_viaadquisicion v ON iv.idviaadquisicion=v.idviaadquisicion
                   LEFT JOIN mod_planificacion.dat_entidadmodelo em on
                     cim.identidadmodelo = em.identidadmodelo
                   LEFT JOIN mod_planificacion.dat_modelo m on em.idmodelo =
                     m.idmodelo


              WHERE cim.idaprobacion = 4
            ) as x ON (q.idindicador = x.idindicador and (x.idmodelo =
              q.elmodelo OR x.idmodelo is null))
     ) as final
GROUP BY
         final.elmodelo,
         final.idvia,
         final.idindicador,
         final.destino,
         final.centrobalance, final.uriviaadquisicion,
         final.via,
         final.contingencia";

        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($query)->fetchAll(PDO::FETCH_ASSOC);


        return $result;
    }

    public function ultimoNumero($identidad, $parametros) {
        $query = Doctrine_Query::create();
        $query->select('MAX(da.numero)')
                ->from('DatDocumentoaprobacion da')
                ->where(
                        "da.identidad = ? AND da.idejercicio=?", array($identidad, $parametros->idejercicio)
                )->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        if (count($result) == 0) {
            return 1;
        }
        return $result[0]['MAX'] + 1;
    }

    public function obtenerDatosdelDocumento($iddocumento) {
        $cadenaSELECT = "";
        $cadenaJOIN = "";
        $cadenaWHERE = "";
        $cadenaQUERY = "";

        $cadenaSELECT = " SELECT cd.idcontroldivisa,cd.importe,
            cdv.idviaadquisicion as idvia,cdm.identidadmodelo as idconceptoplan ";
        $cadenaJOIN = " FROM mod_planificacion.dat_controldivisadocumentoaprobacion cd
                         INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion cdv
                         ON cdv.idcontroldivisadocumentoaprobacion=cd.idcontroldivisadocumentoaprobacion
                         LEFT JOIN  mod_planificacion.dat_controldivisadocumentomodelo cdm
                         ON cdm.idcontroldivisadocumentoaprobacion=cd.idcontroldivisadocumentoaprobacion ";
        $cadenaWHERE = " WHERE cd.iddocumentoaprobacion=" . ($iddocumento)
                . " ";

        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;

        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function getLastDocsByidentidad($params) {
        $condicionentindad = "AND d.identidad = {$params['identidad']}";
        if ($params['identidad'] == 0) {
            $condicionentindad = "";
        }
        $cadenaSELECT = " SELECT max(d.iddocumentoaprobacion) as iddocumentoaprobacion ";
        $cadenaJOIN = " FROM mod_planificacion.dat_documentoaprobacion d ";
        $cadenaWHERE = " WHERE TRUE {$condicionentindad} GROUP BY d.idtipoaprobacion,d.identidad ";
        $cadenaQUERY = "";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE;

        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function getdatosAutomatico($params) {

        $select = " ";
        $joinINNER = " ";
        $joinLEFT = " ";

        $cadenaSELECT = " SELECT " . $select . " doc.iddocumentoaprobacion,
        doc.identidad,doc.numeroaprobacion,doc.fecha,doc.idusuario,
        doc.idtipoaprobacion,dn.denominacion as tipoaprobacion,
              va.denominacion as via, sum( dcd.importe) as importe,sum( dcd.cantidad) as cantidad,
            ncd.denominacion as denominacion,ncd.codigo, dcd.idcontroldivisa,
            va.idviaadquisicion as idvia,va.uriviaadquisicion,dcdm.identidadmodelo  ";
        $cadenaJOIN = " FROM mod_planificacion.dat_documentoaprobacion doc
                        INNER JOIN mod_planificacion.nom_datosnomenclador dn
                        ON dn.iddatosnomenclador = doc.idtipoaprobacion
                        INNER JOIN mod_planificacion.dat_controldivisadocumentoaprobacion dcd
                        ON doc.iddocumentoaprobacion=dcd.iddocumentoaprobacion
                        INNER JOIN mod_planificacion.nom_controldivisa ncd
                        ON dcd.idcontroldivisa=ncd.idcontroldivisa
                        " . $joinINNER . "
                        INNER JOIN mod_planificacion.dat_controldivisadocumentoviaadquisicion dcdv
                        ON dcdv.idcontroldivisadocumentoaprobacion=dcd.idcontroldivisadocumentoaprobacion
                        INNER JOIN mod_datosmaestros.nom_viaadquisicion va
                        ON va.idviaadquisicion=dcdv.idviaadquisicion
                        LEFT JOIN  mod_planificacion.dat_controldivisadocumentomodelo dcdm
                        ON dcdm.idcontroldivisadocumentoaprobacion=dcd.idcontroldivisadocumentoaprobacion
                        LEFT JOIN  mod_planificacion.dat_entidadmodelo de
                        ON de.identidadmodelo=dcdm.identidadmodelo
                        LEFT JOIN  mod_planificacion.dat_modelo dm
                        ON de.idmodelo=dm.idmodelo
                        " . $joinLEFT . " ";
        $cadenaWHERE = " WHERE  doc.iddocumentoaprobacion IN (" . ($params['iddocs']) . ") AND doc.idaprobacion = 4";
        $cadenaGROUPBY = " GROUP BY
                           doc.iddocumentoaprobacion,
        doc.identidad,doc.numeroaprobacion,doc.fecha,doc.idusuario,
        doc.idtipoaprobacion,dn.denominacion,doc.esmanual,
        va.denominacion,ncd.denominacion,ncd.codigo,dcd.idcontroldivisa,
            va.idviaadquisicion,dcdm.identidadmodelo,va.uriviaadquisicion ORDER BY  va.denominacion ";
        $cadenaQUERY = "";


        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE
                . $cadenaGROUPBY;

        $conex = Doctrine_Manager:: connection();

        $result = $conex->execute($cadenaQUERY)->fetchAll();

        $resultado = $result;

        return $resultado;
    }

    public function getTotalPlanificado($params) {
        $condicionentindad = "AND edn.identidad = {$params['identidad']}";
        if ($params['identidad'] == 0) {
            $condicionentindad = "";
        }
        $cadenaSELECT = " SELECT SUM(da.importeliquido) AS importeliquido,SUM(da.importecredito)
                          AS importecredito,via.uriviaadquisicion,
                          SUM((da.importeliquido+da.importecredito)*ip.contingencia/100) AS contingencia ";
        $cadenaJOIN = " FROM
          mod_planificacion.dat_controldivisaindicadormodelo da
          INNER JOIN mod_planificacion.dat_planificacion p
          ON (da.idindicador = p.idindicador AND p.idejercicio = {$params['idejercicio']})
          INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON ip.idindicador = p.idindicador
          INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn ON (edn.identidaddatosnomenclador = p.idcentrobalance
         {$condicionentindad})
          INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion
                      iv ON da.idindicador = iv.idindicador
          INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                     ON via.idviaadquisicion = iv.idviaadquisicion ";
        $cadenaWHERE = " WHERE da.idejercicio = {$params['idejercicio']} ";
        $cadenaGROUPBY = " GROUP BY via.uriviaadquisicion ";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN . $cadenaWHERE
                . $cadenaGROUPBY;

        $conex = Doctrine_Manager:: connection();

        $result = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

}
