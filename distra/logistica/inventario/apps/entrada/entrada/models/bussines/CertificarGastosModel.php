<?php
/**
 * Created by PhpStorm.
 * User: kenier
 * Date: 28/10/2017
 * Time: 10:22
 */

class CertificarGastosModel extends BaseModel
{
    const ESTADO_CERTIFICACION_ELAB = 1;
    const ESTADO_CERTIFICACION_CONF = 2;
    const ESTADO_CERTIFICACION_APROB = 3;

    public function __construct()
    {
        parent::__construct(true);
    }

    public function salvarCertificacion($parametros)
    {
        $fcert = Doctrine_Query::create()->from('DatCertificaciongasto')
            ->where('iddocumento = ?', $parametros['iddocumento'])->fetchOne();
        if (is_object($fcert) && $fcert->estado != 1) {
            throw new ZendExt_Exception('LOG_INV_CERT_002');
        }
        $certificacion = new DatCertificaciongasto();
        $existCert = $this->obtenerCertificacion($parametros['iddocumento'], $parametros['idcuenta']);
        $idCertificacion = (!is_null($parametros['idcertificaciongasto'])) ?
            $parametros['idcertificaciongasto'] :
            (is_object($existCert) ? $existCert->idcertificaciongasto : null);
        if (!is_null($idCertificacion)) {
            $certificacion->assignIdentifier($idCertificacion);
        }
        $certificacion->idusuarioregistra = $this->global->Perfil->idusuario;
        $certificacion->synchronizeWithArray($parametros);
        $certificacion->save();
        return array('success' => true);
    }

    public function obtenerCertificacion($idDocumento, $idCuenta)
    {
        return Doctrine_Query::create()
            ->from('DatCertificaciongasto cg')
            ->where('cg.iddocumento = ?', $idDocumento)
            ->andWhere('cg.idcuenta = ?', $idCuenta)
            ->fetchOne();
    }

    public function obtenerCertificaciones($parametros)
    {
        $query = Doctrine_Query::create()->from('DatCertificaciongasto')
            ->where('iddocumento = ?', $parametros['iddocumento']);
        $arrayData = array('cantidad' => $query->count());
        $tempData = $this->doctrineHelper->addQueryLimits($query, $parametros)->fetchArray();
        $cacheCuentas = array();
        $cacheUsuario = array();
        foreach ($tempData as $index => $cuenta) {
            if (!$cacheCuentas[$cuenta['idcuenta']]) {
                $cacheCuentas[$cuenta['idcuenta']] = $this->contabilidadHelper->obtenerCuentaPorId($cuenta['idcuenta']);
            }
            if (!$cacheUsuario[$cuenta['idusuarioaprueba']]) {
                $cacheCuentas[$cuenta['idusuarioaprueba']] = $this->seguridadHelper->getNombreUsuario($cuenta['idusuarioaprueba']);
            }
            if (!$cacheUsuario[$cuenta['idusuariocertifica']]) {
                $cacheCuentas[$cuenta['idusuariocertifica']] = $this->seguridadHelper->getNombreUsuario($cuenta['idusuariocertifica']);
            }
            $tempData[$index]['cuenta'] = $cacheCuentas[$cuenta['idcuenta']]->text;
            $tempData[$index]['cetificador'] = $cacheCuentas[$cuenta['idusuariocertifica']];
            $tempData[$index]['aprobador'] = $cacheCuentas[$cuenta['idusuarioaprueba']];
        }
        $arrayData['datos'] = $tempData;
        return $arrayData;
    }

    public function devolverCunetasGasto()
    {
        $sql = "select DISTINCT  nc.idcuenta,nc.concatctax||' '||nc.descripcion as descripcioncta
            from mod_contabilidad.nom_cuenta nc
            inner join mod_contabilidad.dat_estructurae ee on ee.idestructurae = nc.idestructurae
            left join mod_contabilidad.dat_estructuraeatiendecomun eea on ee.idestructurae = eea.idestructurae
            left join mod_contabilidad.nom_tipocuenta tc on tc.idtipocuenta = nc.idtipocta        
        where (ee.idestructuracomun = {$this->global->Estructura->idestructura} OR 
                eea.idestructuracomun = {$this->global->Estructura->idestructura})";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        return array('cantidad' => count($data), 'datos' => $data);
    }

    public function eliminarCertificacion($id)
    {
        $fcert = Doctrine_Query::create()->from('DatCertificaciongasto')
            ->where('idcertificaciongasto = ?', $id)->fetchOne();
        if (is_object($fcert) && $fcert->estado != 1) {
            throw new ZendExt_Exception('LOG_INV_CERT_003');
        }
        Doctrine_Query::create()->delete('DatCertificaciongasto')
            ->whereIn('idcertificaciongasto', $id)->execute();
        return array('success' => true);
    }

    public function confirmarCertifiacion($id)
    {
        $fcert = Doctrine_Query::create()->from('DatCertificaciongasto')
            ->where('iddocumento = ?', $id)->fetchOne();
        if (!is_object($fcert) || $fcert->estado != 1) {
            return array('success' => true, 'codMsg' => 1, 'mensaje' => 'La certificacion no puede ser confirmada.' .
                ' Revise que se han registrado los datos y que no haya sido aprobada.');
        }

        $this->validarImporte($id);
        Doctrine_Query::create()->update('DatCertificaciongasto')
            ->set('idusuariocertifica', $this->global->Perfil->idusuario)
            ->set('estado', CertificarGastosModel::ESTADO_CERTIFICACION_CONF)
            ->where('iddocumento = ?', $id)->execute();
        return array('success' => true);
    }

    public function aprobarCertifiacion($id)
    {
        $fcert = Doctrine_Query::create()->from('DatCertificaciongasto')
            ->where('iddocumento = ?', $id)->fetchOne();
        if (!is_object($fcert) || $fcert->estado != 2) {
            return array('success' => true, 'codMsg' => 1, 'mensaje' => 'La certificacion no puede ser aprobada.' .
                ' Revise que se han registrado los datos y que haya sido confirmada.');
        }
        Doctrine_Query::create()->update('DatCertificaciongasto')
            ->set('idusuarioaprueba', $this->global->Perfil->idusuario)
            ->set('estado', CertificarGastosModel::ESTADO_CERTIFICACION_APROB)
            ->where('iddocumento = ?', $id)->execute();
        return array('success' => true);
    }

    public function validarImporte($iddocumento)
    {
        $sql = "select sum(round(m.importecontable,2))
                    = (
                        select sum(round(cg.importe,2)) 
                            from mod_loginventario.dat_cetificaciongastos cg
                            where cg.iddocumento = {$iddocumento}
                    ) as valido from mod_logistica.dat_movimiento m
                    where m.iddocumento = {$iddocumento}";
        $validar = $this->doctrineHelper->getConnection()->fetchAll($sql);
        if (!$validar[0]['valido']) {
            throw new ZendExt_Exception('LOG_INV_CERT_001');
        }
        return true;
    }

}