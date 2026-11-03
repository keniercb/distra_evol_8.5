<?php

class DatPeriodoabierto extends BaseDatPeriodoabierto {

    public function setUp() {
        parent::setUp();
    }

    public function listarEjerciciosContables() {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                    idejercicio,
                    nombre,
                    inicio,
                    fin,
                    annonatural,
                    antecesor,
                    version,
                    idestructuracomun
                  FROM 
                    mod_datosmaestros.dat_ejerciciocontable ;";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function cargarPeriodosContables($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idperiodo,
                        nombre,
                        inicio,
                        fin
                 FROM mod_datosmaestros.dat_periodocontable
                 WHERE idejercicio = {$params['idejercicio']} 
                 ORDER BY inicio;";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function cargarSubsistemas($params) {
        $conn = Doctrine_Manager::connection();
        $query = " SELECT 
                    idsubsistema,
                    denominacion
                  FROM 
                    mod_datosmaestros.nom_subsistema ; ";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function cargarEstructuras($params) {
        $conn = Doctrine_Manager::connection();
        $query = " SELECT 
                    idestructurae,
                    descripcion
                  FROM 
                    mod_contabilidad.dat_estructurae ; ";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function obtenerEjercicioContableActual() {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idejercicio,
                        nombre,
                        inicio,
                        fin,
                        annonatural,
                        antecesor,
                        version,
                        idestructuracomun
                 FROM mod_datosmaestros.dat_ejerciciocontable
                 WHERE now() BETWEEN inicio AND fin
                 ";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data[0];
    }

    public function listarSolicitudes($params) {
        $addWhereFiltros = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['data']['value'] == "" && $datos['data']['value'] != 0) {
                    continue;
                }
                if ($datos['field'] == 'periodo') {
                    $addWhereFiltros .= " AND p.idperiodo = {$datos['data']['value']}";
                } elseif ($datos['field'] == 'subsistema') {
                    $addWhereFiltros .= " AND pa.idsubsistema = {$datos['data']['value']}";
                } elseif ($datos['field'] == 'entidad') {
                    $addWhereFiltros .= " AND e.idestructurae = '{$datos['data']['value']}'";
                } elseif ($datos['field'] == 'estado') {
                    $addWhereFiltros .= " AND pa.estado = {$datos['data']['value']}";
                } elseif ($datos['field'] == 'tieneoperaciones') {
                    if ($datos['data']['value'] == 0) {
                        $addWhereFiltros .= " AND hist.idperiodoabierto IS NULL";
                    } else {
                        $addWhereFiltros .= " AND hist.idperiodoabierto IS NOT NULL";
                    }
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = " SELECT pa.idperiodoabierto,
                            p.nombre as periodo,
                            pa.idsubsistema,
                            s.denominacion as subsistema,
                            e.descripcion,
                            pa.idusuariosolicitud,
                            u.nombreusuario as usuariosolicitud,
                            pa.fechasolicitud,
                            pa.observacionsolicitud,
                            pa.idusuarioaprobacion,
                            u1.nombreusuario as usuarioaprobacion,
                            pa.fechaaprobacion,
                            pa.observacionaprobacion,
                            pa.estado,
                            u2.nombreusuario as usuariocierre,
                            pa.fechacierre,
                            COALESCE(hist.historial, 0) as tieneoperaciones,
                            count(*) OVER() as total
                     FROM mod_datosmaestros.dat_periodoabierto pa
                          INNER JOIN mod_datosmaestros.dat_periodocontable p ON pa.idperiodo = p.idperiodo
                          INNER JOIN mod_datosmaestros.dat_estructurasubsist es ON es.idestructurasubsist = pa.idestructurasubsist
                          INNER JOIN mod_contabilidad.dat_estructurae e ON e.idestructuracomun = es.idestructuracomun
                          INNER JOIN mod_datosmaestros.nom_subsistema s ON s.idsubsistema = pa.idsubsistema
                          INNER JOIN mod_seguridad.seg_usuario u ON u.idusuario = pa.idusuariosolicitud
                          LEFT JOIN mod_seguridad.seg_usuario u1 ON u1.idusuario = pa.idusuarioaprobacion
                          LEFT JOIN mod_seguridad.seg_usuario u2 ON u2.idusuario = pa.idusuariocierre
                          LEFT JOIN 
                          (
                            SELECT count(his.idhistorialcmp) as historial,
                                   pa.idperiodoabierto
                            FROM mod_datosmaestros.dat_periodoabierto pa
                                 INNER JOIN mod_datosmaestros.dat_estructurasubsist es ON es.idestructurasubsist = pa.idestructurasubsist
                                 INNER JOIN mod_contabilidad.dat_estructurae ee ON ee.idestructuracomun = es.idestructuracomun
                                 INNER JOIN mod_contabilidad.dat_comprobante comp ON comp.idsubsistema = es.idsubsistema AND comp.idestructurae = ee.idestructurae AND
                                   comp.idperiodo = pa.idperiodo
                                 INNER JOIN mod_contabilidad.dat_historialcmp his ON his.idcomprobante = comp.idcomprobante
                            WHERE (pa.estado = 1 OR
                                  pa.estado = 3) AND
                                  (CASE
                                     WHEN pa.estado = 3 THEN his.fechasistema BETWEEN pa.fechaaprobacion AND pa.fechacierre
                                     ELSE his.fechasistema > pa.fechaaprobacion
                                   END)
                            GROUP BY pa.idperiodoabierto
                          ) hist ON pa.idperiodoabierto = hist.idperiodoabierto
                     WHERE p.idejercicio = {$params['idejercicio']} $addWhereFiltros 
                     ORDER BY p.inicio,
                              pa.fechasolicitud,
                              s.denominacion ";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function exportarOperaciones($params) {
        $conn = Doctrine_Manager::connection();
        $query = " SELECT comp.numerocomprobante,
                            comp.descripcion,
                            comp.fechaemision as fechacontable,
                            u.nombreusuario as usuariocomprobante,
                            his.accion,
                            his.fechasistema,
                            u1.nombreusuario as usuarioaccion
                     FROM mod_datosmaestros.dat_periodoabierto pa
                          INNER JOIN mod_datosmaestros.dat_estructurasubsist es ON es.idestructurasubsist = pa.idestructurasubsist
                          INNER JOIN mod_contabilidad.dat_estructurae ee ON ee.idestructuracomun = es.idestructuracomun
                          INNER JOIN mod_contabilidad.dat_comprobante comp ON comp.idsubsistema = es.idsubsistema AND comp.idestructurae = ee.idestructurae AND
                            comp.idperiodo = pa.idperiodo
                          INNER JOIN mod_contabilidad.dat_historialcmp his ON his.idcomprobante = comp.idcomprobante
                          INNER JOIN mod_seguridad.seg_usuario u ON u.idusuario = comp.idusuario
                          INNER JOIN mod_seguridad.seg_usuario u1 ON u1.idusuario = his.usuario::NUMERIC
                     WHERE (pa.estado = 1 OR
                           pa.estado = 3) AND
                           pa.idperiodoabierto = {$params['idperiodoabierto']} AND
                           (CASE
                              WHEN pa.estado = 3 THEN his.fechasistema BETWEEN pa.fechaaprobacion AND pa.fechacierre
                              ELSE his.fechasistema > pa.fechaaprobacion
                            END)
                     ORDER BY comp.idcomprobante,
                              his.fechasistema ";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

}
