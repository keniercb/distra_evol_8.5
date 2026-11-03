<?php

class ReabrirperiodocontableModel extends ZendExt_Model {

    function cargarEjerciciosContables() {
        $result['data'] = DatPeriodoabierto::listarEjerciciosContables();
        $result['ejercicioActual'] = DatPeriodoabierto::obtenerEjercicioContableActual();

        return $result;
    }

    function cargarPeriodosContables($params) {
        $result['data'] = DatPeriodoabierto::cargarPeriodosContables($params);

        return $result;
    }

    function cargarSubsistemas($params) {
        $result['data'] = DatPeriodoabierto::cargarSubsistemas($params);

        return $result;
    }

    function cargarEstructuras($params) {
        $result['data'] = DatPeriodoabierto::cargarEstructuras($params);

        return $result;
    }

    function listarSolicitudes($params) {
        $result = DatPeriodoabierto::listarSolicitudes($params);
        return $result;
    }

    function aprobarSolicitud($params) {
        $params['estado'] = 2;
        if ($params['accion'] == 'aprobar') {
            $params['estado'] = 1;
        }
        $result = self::aprobarSolicitudAbrirPeriodoPorSubsistema($params);
        return $result;
    }

    public function aprobarSolicitudAbrirPeriodoPorSubsistema($params) {
        $idsubsistema = $params['idsubsistema'];
        $subsistema = $params['subsistema'];
        $observacion = $params['observacion'];
        $estado = $params['estado'];
        $idperiodoabierto = $params['idperiodoabierto'];
        unset($params);

        if ($estado == 1) {
            //si se esta aprobando
            $idestructuracomun = $this->global->EstructuraEconomica->idestructuracomun;
            $result = self::abrirPeriodoPorSubsistema($idsubsistema, $idestructuracomun);
            if ($result['code'] != 4) {
                return $result;
            }
        }
        $periodoAnteriorSubsistema = $result['periodo'];
        // Obteniendo la fecha actual del sistema con PHP
        $fechaActual = date('Y-m-d H:i:s');

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $query = " UPDATE mod_datosmaestros.dat_periodoabierto
                    SET observacionaprobacion = '$observacion',
                        idusuarioaprobacion = {$this->global->perfil->idusuario},
                        fechaaprobacion = '{$fechaActual}',
                        estado = $estado
                    WHERE idperiodoabierto = $idperiodoabierto ";
        $conn->execute($query);

        $result['message'] = 'El período <u>' . $periodoAnteriorSubsistema->nombre . '</u> se encuentra habilitado para continuar con el registro de operaciones en el subsistema <b>' . $subsistema . '</b>.';
        $result['code'] = 3;
        if ($estado != 1) {
            $result['message'] = 'Se ha rechazado la solicitud de apertura del período ' . $periodoAnteriorSubsistema->nombre . '.';
        }
        return $result;
    }

    public function abrirPeriodoPorSubsistema($idsubsistema, $idestructuracomun) {
        $result = $this->integrator->datosmaestros->validarCondicionesGeneralesAbrirPeriodo($idsubsistema, $idestructuracomun);
        if ($result['code'] != 10 && $result['code'] != 11) {
            $result['message'] = 'No existen solicitudes pendientes para abrir el periodo contable';
            $result['code'] = 16;
            return $result;
        }
        /*if ($result['idusuariosolicitud'] == $this->global->perfil->idusuario) {
            $result['message'] = 'Ud. no puede aprobar su propia solicitud de apertura. No se cumplen las condiciones de validación cruzada.';
            $result['code'] = 17;
            return $result;
        }*/

        $idperiodoActual = $this->integrator->datosmaestros->periodoActualSubsistema($idestructuracomun, $idsubsistema);
        $periodoAnteriorSubsistema = $this->integrator->datosmaestros->periodoAnterior($idperiodoActual);
        unset($idperiodoActual);

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $query = "UPDATE mod_datosmaestros.dat_fecha
                        SET fecha = '{$periodoAnteriorSubsistema->fin}'
                        WHERE idestructurasubsist = (
                        SELECT idestructurasubsist
                        FROM mod_datosmaestros.dat_estructurasubsist
                        WHERE idestructuracomun = $idestructuracomun
                        and idsubsistema = $idsubsistema
                        )";
        $conn->execute($query);
        $query = "UPDATE mod_datosmaestros.dat_cierre
                        SET idperiodoactual = {$periodoAnteriorSubsistema->idperiodo}
                        WHERE idestructurasubsist = (
                        SELECT idestructurasubsist
                        FROM mod_datosmaestros.dat_estructurasubsist
                        WHERE idestructuracomun = $idestructuracomun
                        and idsubsistema = $idsubsistema
                        )";
        $conn->execute($query);
        //se eliminan los registros de la tabla dat_cierreperiodo
        $query = "DELETE
                    FROM mod_datosmaestros.dat_cierreperiodo
                    WHERE idestructurasubsist = (
                        SELECT idestructurasubsist
                        FROM mod_datosmaestros.dat_estructurasubsist
                        WHERE idestructuracomun = $idestructuracomun
                        and idsubsistema = $idsubsistema
                        ) AND
                          idperiodo = {$periodoAnteriorSubsistema->idperiodo}";
        $conn->execute($query);

        $result['message'] = 'El subsistema ha reabierto el período contable anterior. '
                . '<span style="color: red"><b> Este proceso tendrá consecuencias y podrá efectar la integridad de funcionamiento de otros subsistemas contables. '
                . 'Las operaciones realizadas bajo estas condiciones tendrán un tratamiento especial</b></span>';
        $result['code'] = 4;
        $result['periodo'] = $periodoAnteriorSubsistema;
        return $result;
    }

    //metodo usado como servicio
    public function servicio_validarCondicionesGeneralesAbrirPeriodo($idsubsistema, $idestructuracomun) {
        $result['message'] = 'Validado correctamente';
        $result['code'] = 1;

        $idPeriodoActualSubsistema = $this->integrator->datosmaestros->periodoActualSubsistema($idestructuracomun, $idsubsistema);

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        //buscando datos iniciales de validacion
        $query = " SELECT s.denominacion
                    FROM mod_datosmaestros.nom_subsistema s
                    WHERE s.idsubsistema = $idsubsistema ";
        $datos = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        $idejercicio = $this->integrator->datosmaestros->ejercicioActualSubsistema($idestructuracomun, $idsubsistema);
        $primerPeriodo = $this->integrator->datosmaestros->primerPeriodo($idejercicio);

        $periodoAnteriorSubsistema = $this->integrator->datosmaestros->periodoAnterior($idPeriodoActualSubsistema);
        if ($periodoAnteriorSubsistema->idperiodo != null) {
            $query = " SELECT observacionsolicitud,
                            idusuariosolicitud,
                            fechasolicitud
                     FROM mod_datosmaestros.dat_periodoabierto
                     WHERE idperiodo = {$periodoAnteriorSubsistema->idperiodo} AND
                           idsubsistema = $idsubsistema AND
                           estado = 0 ";
            $solicitudPendienteAbrirPeriodo = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        }

        //si no existe una solicitud de abrir pendiente de aprobacion
        if ($solicitudPendienteAbrirPeriodo[0]['idusuariosolicitud'] == null) {
            //si el periodo actual no es enero...
            if ($primerPeriodo != $idPeriodoActualSubsistema) {
                $query = " SELECT es.idsubsistema,
                                    s.denominacion,
                                    p.nombre
                             FROM mod_datosmaestros.dat_subsistemaprecedencia sp
                                  INNER JOIN mod_datosmaestros.dat_estructurasubsist es ON es.idestructurasubsist = sp.idestructurasubsist AND es.idestado = 1 AND es.cierra = 1 AND es.idestructuracomun = $idestructuracomun
                                  INNER JOIN mod_datosmaestros.nom_subsistema s ON s.idsubsistema = es.idsubsistema
                                  INNER JOIN mod_datosmaestros.dat_cierre c ON c.idestructurasubsist = es.idestructurasubsist
                                  INNER JOIN mod_datosmaestros.dat_periodocontable p ON p.idperiodo = c.idperiodoactual
                             WHERE sp.idprecedente = $idsubsistema and
                                   p.inicio > '{$periodoAnteriorSubsistema->inicio}' ";
                $precedentesAbiertos = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
                //si el subsistema es precedente de algun subsistema que ya esta cerrado
                if (count($precedentesAbiertos) == 0) {
                    //revisamos comportamientos por subsistema
                    if ($idsubsistema == 4) {
                        //Contabilidad general
                        //¿?
                    } else
                    if ($idsubsistema == 5) {
                        //Contabilidad de costos
                        //¿?
                    } else
                    if ($idsubsistema == 6 || $idsubsistema == 12 || $idsubsistema == 14) {
                        //6-Cobros y pagos, 12-Banco, 14-Caja
                        $query = " SELECT count(iddocumento)
                                FROM mod_finanzas.dat_documentofnz doc
                                WHERE doc.idperiodo = $idPeriodoActualSubsistema AND
                                      doc.idsubsistema = $idsubsistema AND doc.identidad = $idestructuracomun AND
                                      doc.idestadodoccomunfinanzas <> 7 ";
                        $documentosAbiertos = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
                        if ($documentosAbiertos[0] == 0) {
                            //si los subsistemas de finanzas no tienen documentos abiertos
                            if ($idsubsistema == 6) {
                                //en Cobros y pagos, se analizan los anticipos...
                                $query = " SELECT count(idderechouobligacion)
                                        FROM mod_cobroypago.dat_derechouobligacion duo
                                        WHERE duo.idperiodo = $idPeriodoActualSubsistema AND
                                              duo.idestructuracomun = $idestructuracomun AND
                                              duo.idestadodocumento <> 1 ";
                                $anticiposAbiertos = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
                                if ($anticiposAbiertos[0] == 0) {
                                    return $result;
                                } else {
                                    $result['message'] = "El subsistema " . $datos[0]['denominacion'] . " tiene operaciones en el período. No se podrán reabrir períodos hasta tanto no cancele todas sus operaciones en el período actual.";
                                    $result['code'] = 15;
                                    return $result;
                                }
                            }
                        } else {
                            $result['message'] = "El subsistema " . $datos[0]['denominacion'] . " tiene documentos activos en el período. No se podrán reabrir períodos hasta tanto no cancele todas sus operaciones en el período actual.";
                            $result['code'] = 14;
                            return $result;
                        }
                    } else
                    if ($idsubsistema == 10) {
                        //10-Inventario
                        //¿?
                        return $result;
                    } else
                    if ($idsubsistema == 11) {
                        //11-Activos fijos
                        //¿?
                        return $result;
                    } else
                    if ($idsubsistema == 13) {
                        //13-Facturacion
                        //¿?
                        return $result;
                    }
                } else {
                    $result['message'] = "El subsistema " . $datos[0]['denominacion'] . " no puede reabrir el período <u>" . $periodoAnteriorSubsistema->nombre .
                            "</u>, debido a que tiene relaciones de precedencia con el subsistema <b>" . $precedentesAbiertos[0]['denominacion'] . "</b> que ya realizó su cierre.";
                    $result['code'] = 13;
                    return $result;
                }
            } else {
                $result['message'] = "El subsistema <b>" . $datos[0]['denominacion'] . "</b> se encuentra en el mes de enero. No se pueden reabrir períodos correspondientes a ejercicios terminados.";
                $result['code'] = 12;
                return $result;
            }
        } else {
            $result['idusuariosolicitud'] = $solicitudPendienteAbrirPeriodo[0]['idusuariosolicitud'];
            //si fue el mismo usuario el que solicitó abrir
            if ($this->global->perfil->idusuario == $solicitudPendienteAbrirPeriodo[0]['idusuariosolicitud']) {
                $result['message'] = "Ya Ud. tiene registrada una solicitud para reabrir el período que está pendiente de aprobación.";
                $result['code'] = 11;
                return $result;
            } else {
                $result['message'] = "Ya existe una solicitud pendiente de aprobación para reabrir el período.";
                $result['code'] = 10;
                return $result;
            }
        }

        return $result;
    }

    //metodo usado como servicio
    public function servicio_solicitarAbrirPeriodoPorSubsistema($idsubsistema, $idestructuracomun, $observacion) {
        $result = $this->integrator->datosmaestros->validarCondicionesGeneralesAbrirPeriodo($idsubsistema, $idestructuracomun);
        if ($result['code'] != 1) {
            return $result;
        }

        $idperiodoActual = $this->integrator->datosmaestros->periodoActualSubsistema($idestructuracomun, $idsubsistema);
        $periodoAnteriorSubsistema = $this->integrator->datosmaestros->periodoAnterior($idperiodoActual);

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $query = "INSERT INTO 
                    mod_datosmaestros.dat_periodoabierto
                  (
                    idperiodo,
                    idestructurasubsist,
                    idsubsistema,
                    observacionsolicitud,
                    idusuariosolicitud
                  )
                  VALUES (
                    {$periodoAnteriorSubsistema->idperiodo},
                    (
                        SELECT idestructurasubsist
                        FROM mod_datosmaestros.dat_estructurasubsist
                        WHERE idestructuracomun = $idestructuracomun
                        and idsubsistema = $idsubsistema
                        ),
                    $idsubsistema,
                    '$observacion',
                    {$this->global->perfil->idusuario}
                  );";
        $conn->execute($query);

        $result['message'] = 'Su solicitud de apertura para el período ' . $periodoAnteriorSubsistema->nombre . ' ha sido enviada para su aprobación.';
        $result['code'] = 2;
        return $result;
    }

    //metodo usado como servicio
    public function servicio_cerrarPeriodoReabiertoPorSubsistema($idsubsistema, $idestructuracomun) {
        $idperiodoActual = $this->integrator->datosmaestros->periodoActualSubsistema($idestructuracomun, $idsubsistema);
        $periodoAnteriorSubsistema = $this->integrator->datosmaestros->periodoAnterior($idperiodoActual);
        $periodoAnteriorSubsistema = $periodoAnteriorSubsistema->idperiodo;

        // Obteniendo la fecha actual del sistema con PHP
        $fechaActual = date('Y-m-d H:i:s');

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $query = "UPDATE mod_datosmaestros.dat_periodoabierto
                    SET idusuariocierre = {$this->global->perfil->idusuario},
                        fechacierre = '$fechaActual',
                        estado = 3
                    WHERE estado = 1 AND
                          idsubsistema = $idsubsistema AND
                          idperiodo = $periodoAnteriorSubsistema AND
                          idestructurasubsist = (
                                                SELECT idestructurasubsist
                                                FROM mod_datosmaestros.dat_estructurasubsist
                                                WHERE idestructuracomun = $idestructuracomun
                                                and idsubsistema = $idsubsistema
                                                );";
        $conn->execute($query);

        $result['message'] = 'OK';
        $result['code'] = 1;
        return $result;
    }

    public function exportarSolicitudes($params) {
        //Creando el encabezado
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=solicitudes_reabrirSubsistema.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo"<H2 align=center>Solicitudes de reabrir períodos contables</H2>";
        echo"<H3>Ejercicio: {$params['denoejercicio']}</H3>";
        echo "<tr >";

        echo "<table border=1 cellspacing=0 width=60%>
             <th align=center>Período</th>
             <th align=center>Subsistema</th>
             <th align=center>Entidad</th>
             
             <th align=center>Solicitado por</th>
             <th align=center>Motivo de la solicitud</th>
             <th align=center>Fecha de la solicitud</th>
             
             <th align=center>Aprobado/rechazado por</th>
             <th align=center>Observación</th>
             <th align=center>Fecha de la aprobación</th>
             
             <th align=center>Estado</th>
             <th align=center>Fecha de cierre</th>
             <th align=center>Cerrado por</th>";
        echo "</tr>";

        //Obteniendo los datos
        $datos = self::listarSolicitudes($params);
        //Mostrando los datos   
        foreach ($datos as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['periodo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['subsistema'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['entidad'] . "</td>";

            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['usuariosolicitud'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['observacionsolicitud'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['fechasolicitud'] . "</td>";

            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['usuarioaprobacion'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['observacionaprobacion'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['fechaaprobacion'] . "</td>";

            if ($value['estado'] == 1) {
                echo"<td align=left style=\"mso-number-format:'@';\">Aprobado</td>";
            } else if ($value['estado'] == 2) {
                echo"<td align=left style=\"mso-number-format:'@';\">Rechazado</td>";
            } else if ($value['estado'] == 3) {
                echo"<td align=left style=\"mso-number-format:'@';\">Cerrado</td>";
            } else {
                echo"<td align=left style=\"mso-number-format:'@';\">Pendiente</td>";
            }

            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['fechacierre'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['usuariocierre'] . "</td>";

            echo "</tr>";
        }

        echo "</table>\n";
        $fecha = date('d/m/Y H:i:s');
        echo"<H6 align=right>Fecha: {$fecha}</H6>";
        echo '</BODY></HTML>';
    }

    public function exportarOperaciones($params) {
        //Creando el encabezado
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=operaciones_subsistemaReabierto.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo"<H2 align=center>Operaciones realizadas con subsistema reabierto</H2>";

        echo"<H4>";
        echo"Período: {$params['periodoabierto']->periodo}";
        echo" / Subsistema: {$params['periodoabierto']->subsistema}";
        echo" / Entidad: {$params['periodoabierto']->entidad}";
        echo "</H4>";
        echo"<H4>";
        echo"Solicitado por: {$params['periodoabierto']->usuariosolicitud}";
        echo" / Motivo de la solicitud: {$params['periodoabierto']->observacionsolicitud}";
        echo" / Fecha de la solicitud: {$params['periodoabierto']->fechasolicitud}";
        echo "</H4>";
        echo"<H4>";
        echo"Aprobado por: {$params['periodoabierto']->usuarioaprobacion}";
        echo" / Observación: {$params['periodoabierto']->observacionaprobacion}";
        echo" / Fecha de la aprobación: {$params['periodoabierto']->fechaaprobacion}";
        echo "</H4>";
        echo"<H4>";
        if ($value['estado'] == 1) {
            echo"Estado: Aprobado";
        } else if ($value['estado'] == 3) {
            echo"Estado: Cerrado";
            echo" / Cerrado por: {$params['periodoabierto']->usuariocierre}";
            echo" / Fecha de cierre: {$params['periodoabierto']->fechacierre}";
        }
        echo "</H4>";
        echo "<br>";

        echo "<table border=1 cellspacing=0 width=60%>
             <th align=center>No. comprobante</th>
             <th align=center>Descripcción</th>
             <th align=center>Fecha contable</th>
             <th align=center>Usuario que contabiliza</th>
             
             <th align=center>Acción</th>
             <th align=center>Fecha de la acción</th>
             <th align=center>Usuario de la acción</th>";
        echo "</tr>";

        //Obteniendo los datos
        $params['idperiodoabierto'] = $params['periodoabierto']->idperiodoabierto;
        $datos = DatPeriodoabierto::exportarOperaciones($params);
        //Mostrando los datos   
        foreach ($datos as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['numerocomprobante'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['descripcion'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['fechacontable'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['usuariocomprobante'] . "</td>";

            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['accion'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['fechasistema'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['usuarioaccion'] . "</td>";
            echo "</tr>";
        }

        echo "</table>\n";
        $fecha = date('d/m/Y H:i:s');
        echo"<H6 align=right>Fecha: {$fecha}</H6>";
        echo '</BODY></HTML>';
    }

}
