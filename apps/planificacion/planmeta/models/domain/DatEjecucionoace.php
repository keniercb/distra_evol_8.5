<?php

class DatEjecucionoace extends BaseDatEjecucionoace {

    public function setUp() {
        parent:: setUp();
    }

    public function listarIndicadores($params) {
        if ($params['idmes']) {
            $ADDSUB = $ADDSUB . ' AND ' . "ee.mes=" . $params['idmes'] . "";
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idm.codigo, idm.numeropieza,idm.idindicador,
idm.denominacion,um.denominacionunidadmedida,ip.precio
		FROM mod_datosmaestros.nom_indicador idm
		INNER JOIN mod_datosmaestros.nom_unidadmedida um
		ON idm.idumedida = um.idunidadmedida
                INNER JOIN mod_datosmaestros.nom_indicadorplanif ip
                ON idm.idindicador = ip.idindicador
                INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion
                ivia ON idm.idindicador = ivia.idindicador
                INNER JOIN mod_datosmaestros.nom_viaadquisicion via
                ON ivia.idviaadquisicion = via.idviaadquisicion
                WHERE(via.uriviaadquisicion = 'oace' OR via.uriviaadquisicion = 'balanceadorcentral')
                and
                idm.idindicador not in  (select e.idindicador
                from mod_planificacion.dat_ejecucionoaceindicador e
                 inner join mod_planificacion.dat_ejecucionoace  ee on ee.idejecucionoace= e.idejecucionoace
                inner join
                mod_datosmaestros.nom_indicador dm on e.idindicador=dm.idindicador
                $ADDSUB
                )
                and (idm.idindicador not in (sELECT ae.idindicador
                FROM mod_planificacion.dat_ejecucionoacedemanda d inner join
                mod_planificacion.dat_ajusteexistenciacb ae
                on d.idajusteexistenciacb = ae.idajusteexistenciacb ))";
        $result = $conn->execute($query);
        $data->data = $result->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function guardarEje($params) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        foreach ($params['idejecucion'] as $dat) {

            $eje = Doctrine::getTable('DatEjecucionoace')->findByDql(
                    "idejecucionoace=$dat->idejecucionoace"
            );

            //
            $eje[0]->identidad = 28;
            $eje[0]->idejercicio = $params['idejercicio'];
            $eje[0]->contratado = $dat->contratado;
            $eje[0]->preciocontrado = $dat->preciocontrado;
            $eje[0]->ejecutado = $dat->ejecutado;
            $eje[0]->precioejecutado = $dat->precioejecutado;
            $eje[0]->tipo = $dat->tipo;
            $eje[0]->mes = $params['mes'];

            $eje->save();
            // $con->beginTransaction();

            $idejecucionoace = $eje[0]->idejecucionoace;

            if ($dat->tipo == 1) {
                $ejecind = new DatEjecucionoaceindicador();
                $ejecind->idindicador = $dat->idindicador;
                $ejecind->cantidad = $dat->demanda;
                $ejecind->idejecucionoace = $idejecucionoace;
                $ejecind->save();
                return 1;
            } else {
                $idejecuciondem = $eje->idejecucionoace;
                $ejdem = new DatEjecucionoacedemanda();
                $ejdem->idejecucionoace = $idejecuciondem;
                $ejdem->idajusteexistenciacb = $dat->idajusteexistenciacb;
                $ejdem->save();
            }
        }
        return 1;
    }

    public function UltimoEjecucion() {
        $conn = Doctrine_Manager::connection();
        $sql = "select
		ece.idejecucionoace
	from
	mod_planificacion.dat_ejecucionoace ece  LEFT OUTER JOIN
	(select 0 as demanda, 0 as importedemanda, dei.idejecucionoace,
	dei.idindicador, 0 as idajusteexistenciacb,dei.cantidad,dei.idejecucionoaceindicador,
	0 as idejecucionoacedemanda from mod_planificacion.dat_ejecucionoaceindicador dei
         union select cb.demanda, cb.importedemanda, ed.idejecucionoace ,
         cb.idindicador, ed.idajusteexistenciacb, 0 as cantidad,
         0 as idejecucionoaceindicador, ed.idejecucionoacedemanda
         from  mod_planificacion.dat_ejecucionoacedemanda ed
         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb
         ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s on (s.idejecucionoace = ece.idejecucionoace)
	 where 'OACE' in ( SELECT via.denominacion
	 from mod_planificacion.dat_ejecucionoace ece
         LEFT OUTER JOIN mod_planificacion.dat_puntualdemanda pd
         ON (ece.idejecucionoace = pd.idejecucionoace)
         LEFT OUTER JOIN
         (select 0 as demanda, 0 as importedemanda, dei.idejecucionoace,dei.idindicador,
          0 as idajusteexistenciacb,dei.cantidad,dei.idejecucionoaceindicador,
          0 as idejecucionoacedemanda from mod_planificacion.dat_ejecucionoaceindicador dei
         union select cb.demanda, cb.importedemanda, ed.idejecucionoace ,
          cb.idindicador, ed.idajusteexistenciacb, 0 as cantidad, 0 as idejecucionoaceindicador,
          ed.idejecucionoacedemanda from  mod_planificacion.dat_ejecucionoacedemanda ed
         inner JOIN mod_planificacion.dat_ajusteexistenciacb cb
          ON (ed.idajusteexistenciacb = cb.idajusteexistenciacb)) s
          on (s.idejecucionoace = ece.idejecucionoace)
          INNER JOIN mod_datosmaestros.nom_indicador ni ON (ni.idindicador = s.idindicador)
         INNER JOIN mod_datosmaestros.dat_indicadorviaadquisicion niva
         ON (ni.idindicador = niva.idindicador)
         INNER JOIN mod_datosmaestros.nom_viaadquisicion via
         ON (via.idviaadquisicion = niva.idviaadquisicion) )
        order by  ece.idejecucionoace ";
        $res = $conn->execute($sql);
        $data = $res->fetchAll(PDO::FETCH_ASSOC);

        return $data;
    }

}
