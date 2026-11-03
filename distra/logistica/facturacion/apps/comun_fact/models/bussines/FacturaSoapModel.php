<?php

class FacturaSoapModel extends ZendExt_Model
{

    protected $_logiticaDocHelper;
    protected $_idestructuracomun;
    protected $_iddoc;
    protected $_configuracionHelper;
    protected $_objectHelper;
    protected $_doctrineHelper;

    public function __construct()
    {
        parent::__construct();
        new DatDocfactura();
        //$this->_idestructuracomun = 200531052;
        $this->_logiticaDocHelper = LogisticaDocumentosHelper::__init();

        $this->_configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $this->_objectHelper = LogisticaObjectHelper::__init();
        $this->_doctrineHelper = LogisticaObjectHelper::__init();
    }

    function adicionarFactura($parametros){
        $objIddocFac = $this->_logiticaDocHelper->devuelveIddocByIdEstructura(
            'facturaLog', $parametros['idestructuracomun'], LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->_iddoc = $objIddocFac->iddoc;
        /*$factCliente = Doctrine_Manager::connection()->execute(
            "SELECT dd.iddocumento FROM mod_logistica.dat_documento dd
            INNER JOIN mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
			WHERE dd.estado = 1 and ddc.idcliente = {$parametros['idcliente']} 
			AND dd.idestructuracomun = {$parametros['idestructuracomun']} and dd.iddoc = {$this->_iddoc}"
        )->fetchAll(PDO::FETCH_ASSOC);*/
        $factCliente = Doctrine_Manager::connection()->execute(
            "SELECT dd.iddocumento FROM mod_logistica.dat_documento dd
            INNER JOIN mod_logfacturacion.dat_docfactura ddc on ddc.idfactura = dd.iddocumento
			WHERE dd.estado = 1 and ddc.idclienteauxiliar = {$parametros['idcliente']} 
			AND dd.idestructuracomun = {$parametros['idestructuracomun']} and dd.iddoc = {$this->_iddoc}"
        )->fetchAll(PDO::FETCH_ASSOC);
        if (count($factCliente)) {
            $iddocumento = $factCliente[0]['iddocumento'];
            $documento = Doctrine_Manager::connection()->execute(
                "SELECT dd.iddocumento, dd.numeroref, coalesce(df.factorconvercion, 1) as factorfactura, df.idmoneda FROM mod_logistica.dat_documento dd 
                inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
                where dd.iddocumento = {$iddocumento}"
            )->fetchAll(PDO::FETCH_ASSOC);
            $documento = (object) $documento[0];
            $monedaSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'MONEDA_SM'";
            $valorMoneda = Doctrine_Manager::connection()->execute(
                $monedaSql
            )->fetchAll(PDO::FETCH_ASSOC);
            if (count($valorMoneda)) {
                $idmonedaprecios = $valorMoneda[0]['valor'];
                $sqlFactor = "select tsa.factordeconversion from mod_datosmaestros.dat_tasa tsa
                             inner join mod_datosmaestros.dat_monedaentidad dme on dme.idmonedaentidad = tsa.idmonedacontable and dme.idmoneda = 9900000000
                             where tsa.idmoneda = {$idmonedaprecios} and tsa.idestructuracomun = {$parametros['idestructuracomun']} and tsa.idtipotasa = (
                             select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$parametros['idestructuracomun']} limit 1
                             ) limit 1";
                $factorDefault = Doctrine_Manager::connection()->execute(
                    $sqlFactor
                )->fetchAll(PDO::FETCH_ASSOC);
                $parametros['tasacambio'] = 1;
                $parametros['factordefault'] = 1;
                if (count($factorDefault)) {
                    $parametros['factordefault'] = $factorDefault[0]['factordeconversion'];
                    $parametros['factorfactura'] = $documento->factorfactura;
                }
            }
        } else {
            $documento = $this->adicionarDocumento($parametros);
            $documento->DatDocfactura = $this->adicionarDatosGenerales($documento, $parametros);

            if($parametros['connection']){
                Doctrine_Manager::getInstance()->setCurrentConnection($parametros['connection']);
            }
            $documento->save();
            $datDocCliente = new DatDocumentoCliente();
            $datDocCliente->iddocumento = $documento->iddocumento;
            $datDocCliente->idcliente = $parametros['idcliente'];
            $datDocCliente->tipocliente = 1;
            $datDocCliente->save();
            $iddocumento = $documento->iddocumento;
        }
        $this->addServicios($iddocumento, $parametros);
        Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        return array('iddocumento'=> $documento->iddocumento, 'nroreferencia'=> $documento->numeroref, 'param'=>$parametros);
    }

    public function getIdEstructuraByCodigo($codigo) {
        $sql = "select est.idestructura from mod_estructuracomp.v_dametodasestructuras est where est.codigo = '{$codigo}'";
        $respuesta = Doctrine_Manager::connection()->execute(
            $sql
        )->fetchAll(PDO::FETCH_ASSOC);
        if (count($respuesta)) {
             return $respuesta[0]['idestructura'];
        }
        return false;
    }

    public function getOperacionByDenominacion($denominacion) {
        $sql = "select oper.idnomoperaciones from mod_datosmaestros.nom_operacion oper where lower(oper.denominacion) = lower('{$denominacion}')";
        $respuesta = Doctrine_Manager::connection()->execute(
            $sql
        )->fetchAll(PDO::FETCH_ASSOC);
        if (count($respuesta)) {
            return $respuesta[0]['idnomoperaciones'];
        }
        return false;
    }

    public function getCentroCostoByCodigo($codigo) {
        $sql = "select cc.idcentrogrupo from mod_contabilidadcosto.nom_centrocosto cc where cc.codigocentrogrupo = '{$codigo}'";
        $respuesta = Doctrine_Manager::connection()->execute(
            $sql
        )->fetchAll(PDO::FETCH_ASSOC);
        if (count($respuesta)) {
            return $respuesta[0]['idcentrogrupo'];
        }
        return false;
    }

    public function getClienteByCodigo($codigo, $idestructura) {
        return $this->_configuracionHelper->getClientesProveedorByParams(
            null, $idestructura, true, true, null, array('codigo' => $codigo, 'nombre' => '00249.0001')
        )['datos'][0]['idclientesproveedores'];
    }

    function adicionarFacturas($parametros){
        if (is_object($parametros[0])) {
            $parametros = $this->_objectHelper->stdClassToArray($parametros[0]);
        }
        $parametros['idestructuracomun'] = $this->getIdEstructuraByCodigo($parametros['estructuracomun']);
        $parametros['idcliente'] = $this->getClienteByCodigo($parametros['cliente'],$parametros['idestructuracomun']);
        $parametros['idoperacion'] = $this->getOperacionByDenominacion($parametros['operacion']);
        $parametros['idcentrocosto'] = $this->getCentroCostoByCodigo($parametros['centrocosto']);
        $objIddocFac = $this->_logiticaDocHelper->devuelveIddocByIdEstructura(
            'facturaLog', $parametros['idestructuracomun'], LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->_iddoc = $objIddocFac->iddoc;
        $documento = $this->adicionarDocumento($parametros);
        $documento->DatDocfactura = $this->adicionarDatosGenerales($documento, $parametros);

        if($parametros['connection']){
            Doctrine_Manager::getInstance()->setCurrentConnection($parametros['connection']);
        }
        $documento->save();
        $datDocCliente = new DatDocumentoCliente();
        $datDocCliente->iddocumento = $documento->iddocumento;
        $datDocCliente->idcliente = $parametros['idcliente'];
        $datDocCliente->tipocliente = 1;
        $datDocCliente->save();
        $iddocumento = $documento->iddocumento;
        $this->addServicios($iddocumento, $parametros);
        Doctrine_Manager::getInstance()->getCurrentConnection()->commit();
        return array('iddocumento'=> $documento->iddocumento, 'nroreferencia'=> $documento->numeroref, 'param'=>$parametros);
    }

    public function addServicios($iddocumento, $parametros) {
        if (is_object($parametros['servicios'])) {
            $parametros['servicios'] = $this->_objectHelper->stdClassToArray($parametros['servicios']);
        }
        $factorConf = 1;
        $factorDoc = 1;
        if (isset($parametros['factorfactura']) && isset($parametros['factordefault'])) {
            $factorConf = $parametros['factordefault'];
            $factorDoc = $parametros['factorfactura'];
        }
        foreach ($parametros['servicios'] as $serv) {
            $serv = (array) $serv;
            $servNom = Doctrine_Manager::connection()->execute(
                "SELECT ni.idindicador, ni.precio FROM mod_datosmaestros.nom_indicador ni
                INNER JOIN mod_datosmaestros.nom_indicadorhoja nih ON nih.idindicador = ni.idindicador
			    WHERE upper(ni.numeropieza) like '%'||upper('{$serv['codigo']}')||'%' OR upper(ni.codigo) like '%'||upper('{$serv['codigo']}')||'%' OR upper(nih.codigoauxiliar) like '%'||upper('{$serv['codigo']}')||'%'"
            )->fetchAll(PDO::FETCH_ASSOC);
            if (count($servNom)) {
                foreach ($servNom as $servInterno) {
                    $existe = Doctrine_Manager::connection()->execute(
                        "select count(ef.idelementofactura) as cant from mod_logfacturacion.dat_elementosfactura ef where ef.idfactura = {$iddocumento} 
                        and ef.idexterno = '{$serv['idexterno']}'"
                    )->fetchAll(PDO::FETCH_ASSOC);
                    if ($existe[0]['cant'] == 0) {
                        $sqlInsert = "with elementoid AS (INSERT INTO 
                              mod_logfacturacion.dat_elementosfactura
                            (
                              idfactura,
                              cantidad,
                              preciotarifabase,
                              preciotarifaoriginal,
                              idexterno
                            )
                            VALUES (
                              {$iddocumento},
                              {$serv['cantidad']},
                              {$servInterno['precio']}*{$factorConf}/{$factorDoc},
                              {$servInterno['precio']}*{$factorConf}/{$factorDoc},
                              '{$serv['idexterno']}'
                            ) RETURNING idelementofactura),
                            desgloseid as (
                              INSERT INTO 
                                mod_logfacturacion.dat_desgloselemento
                              (
                                idmoneda,
                                idelementofactura,
                                preciotarifa,
                                preciotarifaoriginal
                              ) 
                              select 9900000000,idelementofactura,{$servInterno['precio']}*{$factorConf}/{$factorDoc}, {$servInterno['precio']}*{$factorConf}/{$factorDoc} from elementoid
                              RETURNING idelementofactura
                            )
                            INSERT INTO 
                              mod_logfacturacion.dat_prodservnomenclador
                            (
                              idelementofactura,
                              idindicador,
                              tipo,
                              idtipoprecio
                            )
                            select idelementofactura,{$servInterno['idindicador']}, 2,-2 from desgloseid";
                        Doctrine_Manager::connection()->fetchAll($sqlInsert);
                    }
                }
            }
        }
    }

    function adicionarDatosGenerales($documento, $parametros){
        $factura = new DatDocfactura();
        if($documento['iddocumento']){
            $factura->assignIdentifier($documento['iddocumento']);
        } else {
            $monedaSql = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'MONEDA_SM'";
            $valorMoneda = Doctrine_Manager::connection()->execute(
                $monedaSql
            )->fetchAll(PDO::FETCH_ASSOC);
            if (count($valorMoneda)) {
                $parametros['idmoneda'] = $valorMoneda[0]['valor'];
                $sqlFactor = "select tsa.factordeconversion from mod_datosmaestros.dat_tasa tsa
                             inner join mod_datosmaestros.dat_monedaentidad dme on dme.idmonedaentidad = tsa.idmonedacontable and dme.idmoneda = 9900000000
                             where tsa.idmoneda = {$valorMoneda[0]['valor']} and tsa.idestructuracomun = {$parametros['idestructuracomun']} and tsa.idtipotasa = (
                             select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$parametros['idestructuracomun']} limit 1
                             ) limit 1";
                $factor = Doctrine_Manager::connection()->execute(
                    $sqlFactor
                )->fetchAll(PDO::FETCH_ASSOC);
                $parametros['tasacambio'] = 1;
                $parametros['factorconvercion'] = 1;
                if (count($factor)) {
                    $parametros['factorconvercion'] = $factor[0]['factordeconversion'];
                }
            }
        }
        $parametros['idclienteauxiliar'] = $parametros['idcliente'];
        $factura->synchronizeWithArray($parametros);
        if ($parametros['numero'] || $parametros['fecha']) {
            $datosContrato = new DatFacturacontrato();
            $datosContrato->synchronizeWithArray($parametros);
            $factura->DatFacturacontrato = $datosContrato;
        }
        //cuenta
        $nomCliente =  $this->_configuracionHelper->getClientesProveedorByParams($parametros['idcliente']);
        if(count($nomCliente['datos'])) {
            $nomCliente = $nomCliente['datos'][0];
            foreach ($nomCliente['cuentabancaria'] as $c) {
                $parametros['datoscuentacliente'][] = array('idmoneda'=>$c['idmoneda'], 'idcuentacliente'=>$c['idcuentabancliente']);
            }
        }
        foreach ($parametros['datoscuentacliente'] as $index => $valor) {
            $cuentafacturacliente = new DatCuentafacturacliente();
            $cuentafacturacliente->synchronizeWithArray($valor);
            $factura->DatCuentafacturacliente->add($cuentafacturacliente);
        }
        //Fin cuenta
        return $factura;
    }

    public function adicionarDocumento($parametros = array()){
        $documento = new DatDocumento();
        $this->inicializarDocumento($parametros);
        if (is_array($parametros)) {
            $documento->synchronizeWithArray($parametros);
        }
        return $documento;
    }

    public function inicializarDocumento(&$datosDoc)
    {
        $datosDoc['iddoc'] = $this->_iddoc;
        //$datosDoc['idusuario'] = $this->idusuario;
        $datosDoc['idejercicio'] =
            $this->_configuracionHelper->getEjercicioActualSubsistema($datosDoc['idestructuracomun'],
                LogisticaGlobal::SUBSISTEMA_FAC);
        $datosDoc['idperiodo'] = $this->_configuracionHelper->getPeriodoActualSubsistema($datosDoc['idestructuracomun'],
                LogisticaGlobal::SUBSISTEMA_FAC);
        $datosDoc['idestructuracomun'] = $datosDoc['idestructuracomun']/*$this->_idestructuracomun*/;
        if ($datosDoc['idejercicio'] == 0) {
            unset($datosDoc['idejercicio']);
        }
        if ($datosDoc['idperiodo'] == 0) {
            unset($datosDoc['idperiodo']);
        }
        $fecha =
            $this->_configuracionHelper->getFechaContableSubsistemaObj($datosDoc['idestructuracomun'],
                LogisticaGlobal::SUBSISTEMA_FAC);
        $anno = explode('/', $fecha->fecha);
        $datosDoc['anno'] = ($anno[2]) ? $anno[2] : date('Y');
        $datosDoc['fechacontable'] = $fecha->fecha;
        $datosDoc['version'] = 1;
        $datosDoc['cronologia'] = 0;
        $datosDoc['estado'] = 1;
        $datosDoc['hora'] = date('H:i:s');
        $datosDoc['numeroref'] = ($datosDoc['numeroref'])
            ? $datosDoc['numeroref']
            : $this->devolverUltimoNumeroDoc(
                $datosDoc['iddoc'], $datosDoc['idestructuracomun'], $datosDoc['idejercicio']
            );
        $this->initOperacionDocumento($datosDoc);
        $this->_objectHelper->unsetNullValues($datosDoc);
    }

    public function devolverUltimoNumeroDoc(
        $iddoc = null, $idestructuracomun = null, $idejercicio = null, $campo = 'numeroref'
    )
    {
        $iddoc = is_null($iddoc) ? $this->iddoc : $iddoc;
        $numero = DatDocumento::devolverUltimoNumeroDoc($iddoc, $idestructuracomun, $idejercicio, $campo);
        return $numero + 1;
    }

    private function initOperacionDocumento(&$datosDoc)
    {
        if (!$datosDoc['idoperacion']) {
            $operacion = $this->_configuracionHelper->obtenerOperaciones(null, null, $datosDoc['iddoc']);
            $datosDoc['idoperacion'] = $operacion[0]['idnomoperaciones'];
        }
    }

    /**
     * Funcion para eliminar un servicio de una factura en elaboracion dado un cliente y un identificador externo
     *
     **/

    public function eliminarServByIdexterno($idcliente, $idexterno) {
        $servNom = Doctrine_Manager::connection()->execute(
            "SELECT def.idelementofactura from mod_logfacturacion.dat_elementosfactura def 
            INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = def.idfactura 
            INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = df.idfactura 
            INNER JOIN mod_logfacturacion.dat_prodservnomenclador provfc ON (provfc.idelementofactura = def.idelementofactura)
            WHERE dd.estado = 1 AND df.idcliente = {$idcliente} AND provfc.idindicador = {$idexterno}"
        )->fetchAll(PDO::FETCH_COLUMN);
        if (count($servNom)) {
            $ids = implode(',', $servNom);
            Doctrine_Manager::connection()->execute(
                "DELETE FROM mod_logfacturacion.dat_elementosfactura ef WHERE ef.idelementofactura in ({$ids})"
            );
        }
        return array('idcliente' => $idcliente, 'idexterno' => $idexterno);
    }

    public function eliminarFacturaByCliente ($idcliente, $idestructuracomun) {
        $objIddocFac = $this->_logiticaDocHelper->devuelveIddocByIdEstructura(
            'facturaLog', $idestructuracomun, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->_iddoc = $objIddocFac->iddoc;
        $factCliente = Doctrine_Manager::connection()->execute(
            "SELECT dd.iddocumento FROM mod_logistica.dat_documento dd
            INNER JOIN mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
			WHERE dd.estado = 1 and ddc.idcliente = {$idcliente} 
			AND dd.idestructuracomun = {$idestructuracomun} and dd.iddoc = {$this->_iddoc}"
        )->fetchAll(PDO::FETCH_ASSOC);
        if (count($factCliente)) {
            $documento = Doctrine_Manager::connection()->execute(
                "SELECT dd.iddocumento, dd.numeroref FROM mod_logistica.dat_documento dd
                where dd.iddocumento = {$factCliente[0]['iddocumento']}"
            )->fetchAll(PDO::FETCH_ASSOC);
            Doctrine_Manager::connection()->execute(
                "DELETE FROM mod_logistica.dat_documento dd WHERE dd.iddocumento = {$factCliente[0]['iddocumento']}"
            );
            return array('idcliente' => $idcliente, 'nroreferencia' => $documento[0]['numeroref']);
        }
        return false;
    }

}
