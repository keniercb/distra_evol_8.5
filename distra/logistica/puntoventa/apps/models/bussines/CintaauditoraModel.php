<?php

class CintaauditoraModel extends ComunpuntoventaModel
{ 
    public function __construct()
    {
        parent::__construct();
    }

    public function cargarAuditoras($params) {
        $filter = '';
        if (isset($params['fecha'])) {
            $params['fecha'] = date("d/m/Y", strtotime($params['fecha']));
            $filter = " and aud.fecha = '{$params['fecha']}' ";
        } else if (isset($params['comparaciones']) && count($params['comparaciones'])) {
            foreach ($params['comparaciones'] as &$compare) {
                $compare['valor'] = date("d/m/Y", strtotime($compare['valor']));
                $filter .= " and aud.fecha {$compare['signo']} '{$compare['valor']}' ";
            }
        }
        $sql = "SELECT aud.iddescarga, aud.fecha, aud.denominacion, aud.identificador, COUNT(*) OVER() as total 
                FROM mod_logpuntoventa.dat_cintaauditora aud 
                WHERE aud.idareaventa = {$params['idareaventa']} {$filter} 
               ";
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            $sql
        )->fetchAll(PDO::FETCH_ASSOC);

        return array('datos' => $respuesta, 'total'=>(count($respuesta)) ? $respuesta[0]['total'] : 0);
    }

    public function devolverInformacion($params) {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT * from mod_logpuntoventa.f_getinfoauditora({$params['iddescarga']})"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function descargarAuditoraOLD($params)//este funciono mientras la api llamaba en el mismo servicio los comandos de tipos de cajas diferentes
    {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "select c.identificador, case when c.idtiporegistradora = 1 then 'qpos' else 'apos' end as modelo, c.ip,
             cr.url as urlapi  
             from mod_logpuntoventa.dat_caja c
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
            inner join mod_logpuntoventa.dat_infoconexioncr cr on cr.idinfoconexioncr = av.idinfoconexioncr
            where c.idareaventa = {$params['idareaventa']} and c.activo = 1 and c.idtiporegistradora is not null "
        )->fetchAll(PDO::FETCH_ASSOC);

        $formatoApi = json_encode(array('datos' => $respuesta));
        $this->tpvApiHelper->setApiUrl($respuesta[0]['urlapi']);//'http://10.12.24.38:10430'

        try {
            $respuesta = $this->tpvApiHelper->exceuteCommand(TpvApiService::DOWNLOAD_AUDT_TAPE_COMMAND, $formatoApi);
            if (isset($respuesta['data'])) {
                $infoCajas = $respuesta['data'];
                foreach ($infoCajas as $info) {
                    if (isset($info['code']) && $info['code'] == '000') {
                        $auditora = $info['info'];
                        $receiptnumber = -1;
                        $denominacion = 'Sin Nombre';
                        $counter = Doctrine_Manager::connection()->fetchAll(
                            "SELECT * FROM mod_logpuntoventa.f_getreceiptnumberbyinfo(
                          $$'{$auditora}'$$)"
                        );
                        if (count($counter)) {
                            $receiptnumber = $counter[0]['f_getreceiptnumberbyinfo'];
                        }
                        $getName = Doctrine_Manager::connection()->fetchAll(
                            "SELECT * FROM mod_logpuntoventa.f_getnombrecajainfo(
                          $$'{$auditora}'$$)"
                        );
                        if (count($getName)) {
                            $denominacion = $getName[0]['f_getnombrecajainfo'];
                        }
                        if ($receiptnumber != -1) {
                            $sqlExist = "select pt.iddescarga as existe from mod_logpuntoventa.dat_cintaauditora pt 
                                  where
                                  pt.idareaventa = ? and
                                  pt.identificador = ? and  
                                  pt.receiptnumber = ?::numeric and 
                                  pt.fecha = now() limit 1";
                            $count = Doctrine_Manager::connection()->fetchAll(
                                $sqlExist, array($params['idareaventa'], $info['identificador'], $receiptnumber)
                            );
                            if (!count($count)) {
                                $sql = "INSERT INTO
                          mod_logpuntoventa.dat_cintaauditora
                        (
                          fecha,idestructuracomun,
                          idareaventa,idusuario,identificador,denominacion,infoauditora,receiptnumber
                        )
                        VALUES (
                          now(),{$this->global->estructura->idestructura},
                          {$params['idareaventa']},{$this->global->Perfil->idusuario},'{$info['identificador']}',
                          $$'{$denominacion}'$$,$$'{$auditora}'$$,{$receiptnumber}
                        ) returning iddescarga";
                                $idpedidoAux = Doctrine_Manager::connection()->fetchAll(
                                    $sql
                                );
                                $idpedido = $idpedidoAux[0]['iddescarga'];
                            } else {

                                $sql = "update 
                          mod_logpuntoventa.dat_cintaauditora
                          set infoauditora = $$'{$auditora}'$$
                          where iddescarga = ?
                          ";
                                Doctrine_Manager::connection()->fetchAll(
                                    $sql, array($count[0]['existe'])
                                );
                                $idpedido = $count[0]['existe'];
                            }
                        }
                    }
                }
            }
            return true;
        } catch (Exception $e) {
            if ($e->getCode() == 1001) {
                throw new ZendExt_Exception('LOG_LB_PUNTOVENTA_010');
            }
        }
    }

    public function descargarAuditora($params)
    {
        $respuestaQpos = $this->doctrineHelper->getConnection()->execute(
            "select c.identificador, 'qpos' as modelo, c.ip,
             cr.url as urlapi  
             from mod_logpuntoventa.dat_caja c
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
            inner join mod_logpuntoventa.dat_infoconexioncr cr on cr.idinfoconexioncr = av.idinfoconexioncr
            where c.idareaventa = {$params['idareaventa']} and c.activo = 1 and c.idtiporegistradora = 1 "
        )->fetchAll(PDO::FETCH_ASSOC);

        $respuestaApos = $this->doctrineHelper->getConnection()->execute(
            "select c.identificador, 'apos' as modelo, c.ip,
             cr.url as urlapi  
             from mod_logpuntoventa.dat_caja c
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
            inner join mod_logpuntoventa.dat_infoconexioncr cr on cr.idinfoconexioncr = av.idinfoconexioncr
            where c.idareaventa = {$params['idareaventa']} and c.activo = 1 and c.idtiporegistradora = 2 "
        )->fetchAll(PDO::FETCH_ASSOC);

        try {
            $respuestaApiQpos = $respuestaApiAndroid = array();
            if (count($respuestaQpos)) {
                $formatoApiQpos = json_encode(array('datos' => $respuestaQpos));
                $this->tpvApiHelper->setApiUrl($respuestaQpos[0]['urlapi']);//'http://10.12.24.38:10430'
                $respuestaApiQpos = $this->tpvApiHelper->exceuteCommand(TpvApiService::DOWNLOAD_AUDT_TAPE_COMMAND, $formatoApiQpos);
            }

            if (count($respuestaApos)) {
                $formatoApiApos = json_encode(array('datos' => $respuestaApos));
                $this->tpvApiHelper->setApiUrl($respuestaApos[0]['urlapi']);//'http://10.12.24.38:10430'
                $respuestaApiAndroid = $this->tpvApiHelper->exceuteCommand(TpvApiService::DOWNLOAD_AUDT_TAPE_COMMAND_ANDROID, $formatoApiApos);
            }

            $infoCajas = array();
            if (isset($respuestaApiQpos['data']) && isset($respuestaApiAndroid['data'])) {
                $infoCajas = array_merge($respuestaApiQpos['data'], $respuestaApiAndroid['data']);
            } else if (isset($respuestaApiQpos['data'])) {
                $infoCajas = $respuestaApiQpos['data'];
            } else if (isset($respuestaApiAndroid['data'])) {
                $infoCajas = $respuestaApiAndroid['data'];
            }
            foreach ($infoCajas as $info) {
                if (isset($info['code']) && $info['code'] == '000') {
                    $auditora = $info['info'];
                    $receiptnumber = -1;
                    $denominacion = 'Sin Nombre';
                    $counter = Doctrine_Manager::connection()->fetchAll(
                        "SELECT * FROM mod_logpuntoventa.f_getreceiptnumberbyinfo(
                          $$'{$auditora}'$$)"
                    );
                    if (count($counter)) {
                        $receiptnumber = $counter[0]['f_getreceiptnumberbyinfo'];
                    }
                    $getName = Doctrine_Manager::connection()->fetchAll(
                        "SELECT * FROM mod_logpuntoventa.f_getnombrecajainfo(
                          $$'{$auditora}'$$)"
                    );
                    if (count($getName)) {
                        $denominacion = $getName[0]['f_getnombrecajainfo'];
                    }
                    if ($receiptnumber != -1) {
                        $sqlExist = "select pt.iddescarga as existe from mod_logpuntoventa.dat_cintaauditora pt 
                                  where
                                  pt.idareaventa = ? and
                                  pt.identificador = ? and  
                                  pt.receiptnumber = ?::numeric and 
                                  pt.fecha = current_date limit 1";
                        $count = Doctrine_Manager::connection()->fetchAll(
                            $sqlExist, array($params['idareaventa'], $info['identificador'], $receiptnumber)
                        );
                        if (!count($count)) {
                            $sql = "INSERT INTO
                          mod_logpuntoventa.dat_cintaauditora
                        (
                          fecha,idestructuracomun,
                          idareaventa,idusuario,identificador,denominacion,infoauditora,receiptnumber
                        )
                        VALUES (
                          now(),{$this->global->estructura->idestructura},
                          {$params['idareaventa']},{$this->global->Perfil->idusuario},'{$info['identificador']}',
                          $$'{$denominacion}'$$,$$'{$auditora}'$$,{$receiptnumber}
                        ) returning iddescarga";
                            $idpedidoAux = Doctrine_Manager::connection()->fetchAll(
                                $sql
                            );
                            $idpedido = $idpedidoAux[0]['iddescarga'];
                        } else {

                            $sql = "update 
                          mod_logpuntoventa.dat_cintaauditora
                          set infoauditora = $$'{$auditora}'$$
                          where iddescarga = ?
                          ";
                            Doctrine_Manager::connection()->fetchAll(
                                $sql, array($count[0]['existe'])
                            );
                            $idpedido = $count[0]['existe'];
                        }
                    }
                }
            }
            return true;
        } catch (Exception $e) {
            if ($e->getCode() == 1001) {
                throw new ZendExt_Exception('LOG_LB_PUNTOVENTA_010');
            }
        }
    }

    public function getDataDescarga($params) {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "select * from mod_logpuntoventa.dat_cintaauditora where iddescarga = {$params['iddescarga']} "
        )->fetchAll(PDO::FETCH_ASSOC);

        return $respuesta;
    }

}