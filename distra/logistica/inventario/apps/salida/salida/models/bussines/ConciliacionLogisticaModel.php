<?php

/**
 * @class GestDocumentoConciliacionModel
 * (Descripcion de la clase, objetivo)
 * @package Inventario
 * @subpackage Salida
 * @author Daniel Arias Espinosa
 * @copyright XETID
 * @version 1.0
 */
class ConciliacionLogisticaModel extends DocumentoLogisticaModel
{
    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatConciliacion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento'
            )
        );
        parent::__construct($datosDoc);
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatConciliaciontransferencia',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idtransferencia'
            )
        );
        $this->logisticaDoctrine->tryInyectRelactions(
            new DatDocumento(), $relations
        );
    }

    /**
     * Metodo para devolver los documentos de ajuste de inventario
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     * @return array
     */
    public function devolverDocumentos($parametros = array())
    {

        $dql = parent::devolverDocumentos($parametros);

        $select = 'con.iddocumento as idconciliacion, '
            . 'con.idusuarioconsolida as conciliadopor, '
            . 'con.cantidad as cantidadtrans ';
        $dql->innerJoin('d.DatConciliacion con')
            ->addSelect($select);
        $this->addFiltersQueryConciliacion($dql, $parametros, 'con');

        return array(
            'cantidad' => $dql->count(),
            'datos' => $this->cargarClientesDocumentos(
                $this->doctrineHelper->addQueryLimits($dql, $parametros)->fetchArray()
            )
        );
    }

    public function addFiltersQueryConciliacion(Doctrine_Query $dql, $parametros, $alias = 'con')
    {
        if ($parametros['conciliadopor']) {
            $dql->addWhere("{$alias}.idusuarioconsolida = ? ", array($parametros['conciliadopor']));
        }
        if ($parametros['nroTransf'] || $parametros['hastaTransf'] || $parametros['desdeTrnasf']) {
            $parametrosTrans = array();
            $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
                'transferenciaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
            );

            $parametrosTrans['iddoc'] = $objDocPrim->iddoc;
            $parametrosTrans['desde'] = $parametros['desdeTrnasf'];
            $parametrosTrans['nrodoc'] = $parametros['nroTransf'];
            $parametrosTrans['hasta'] = $parametros['hastaTransf'];
            $queryDoc = parent::devolverDocumentos($parametrosTrans);
            $parametros['idtransferencia'] = $this->objectHelper->extractValueFromArrayColumn($queryDoc->fetchArray(),
                'iddocumento');
            array_push($parametros['idtransferencia'], -1);
            $dql->innerJoin("$alias.DatConciliaciontransferencia dct")->whereIn("dct.idtransferencia",
                $parametros['idtransferencia']);
        }
        return $dql;
    }

    /*
     * Adicionar documento conciliacion
     *
     * @param array $datosDoc
     * @return DatDocumento
     */
    public function adicionarDocumento($datosDoc = array())
    {
        if (!$datosDoc['iddocumento']) {
            foreach ($datosDoc['conciliacion'] as $datcon) {
                $datcon['iddocumento'] = $this->obtenerTransferenciaAdicionar(array($datcon));
                if ($datcon['cantidad'] != 0) {
                    $doc = parent::adicionarDocumento($datosDoc);
                    $doc->save();
                    $objConciliacion = $this->prepararDocConciliacion($doc, $datcon);
                    $objConciliacion->save();
                    $idClientes = array();
                    $idClientes[] = array(
                        'idcliente' => $datcon['idcliente'],
                        'tipocliente' => $datcon['tipocliente']
                    );
                    $this->adicionarClientes($doc->iddocumento, $idClientes, false);
                }
            }
        } else {

            $doc = parent::adicionarDocumento($datosDoc);
            $doc->save();

            if ($datosDoc['transferencia']) {
                $this->actualizarConciliacion($datosDoc);
                $this->estadoModel->setEstadoDocumento(
                    $datosDoc['iddocumento'], EstadoDocumentoModel::ESTADO_CONCILIADO
                );
            }
        }
        return array(
            'iddocumento' => $doc->iddocumento, 'idcliente' => $datcon['idcliente'],
            'estado' => $doc->estado, 'observaciones' => $doc->observaciones
        );
    }

    /**
     * @param array $datosDoc
     * @param $doc
     * @param $idcliente
     * @return DatConciliacion|mixed
     */
    public function prepararDocConciliacion($doc, $datcon)
    {
        $colltransf = new Doctrine_Collection('DatConciliaciontransferencia');
        $objConciliacion = new DatConciliacion();
        $objConciliacion->iddocumento = $doc->iddocumento;
        $objConciliacion->cantidad = $datcon['cantidad'];

        foreach ($datcon['iddocumento'] as $transf) {

            $obtransferanci = new DatConciliaciontransferencia();
            $obtransferanci->idconciliacion = $doc->iddocumento;
            $obtransferanci->idtransferencia = $transf;
            $colltransf->add($obtransferanci);
        }


        $objConciliacion->DatConciliaciontransferencia = $colltransf;
        return $objConciliacion;
    }

    /**
     * @param $objConciliacion
     * @param $datosDoc
     * @return mixed
     */
    public function actualizarConciliacion($datosDoc)
    {
        $conciliacion = Doctrine::getTable('DatConciliacion')->find($datosDoc['iddocumento']);
        $conciliacion->idusuarioconsolida = $this->idusuario;

        $conciliacion->save();
        if ($datosDoc['transferencia']) {
            $colltransf = new Doctrine_Collection('DatConciliaciontransferencia');
            foreach ($datosDoc['transferencia'] as $valor) {
                $obtransferanci = Doctrine::getTable('DatConciliaciontransferencia')
                    ->find($valor['idconciliaciontransferencia']);
                $obtransferanci->motivo = $valor['motivo'];
                $obtransferanci->recibido = ($valor['recibido']) ? 1 : 0;
                $colltransf->add($obtransferanci);
            }
            $colltransf->save();
        }
    }

    /**
     * Elimina transferencias que ya esten en una conciliacion para el cliente especificado
     * @param array $datosDoc
     * @return array
     */
    public function obtenerTransferenciaAdicionar($datosDoc)
    {
        $datostransf = array();
        foreach ($datosDoc[0]['iddocumento'] as $value) {
            $query = Doctrine_Query::create();
            $query->select('dc.iddocumento')
                ->from('DatConciliacion dc')
                ->innerJoin('dc.DatConciliaciontransferencia dct')
                ->innerJoin('dc.DatDocumento dd')
                ->innerJoin('dd.DatDocumentoCliente ddc')
                ->where('dct.idtransferencia = ?', array($value));
            $tempExluidos = array(
                EstadoDocumentoModel::ESTADO_CANCELADO, EstadoDocumentoModel::ESTADO_ELIMINADO,
                EstadoDocumentoModel::ESTADO_ANULADO, EstadoDocumentoModel::ESTADO_CANCELADO_DUPLICADO
            );
            $query->andWhereNotIn("dd.estado", $tempExluidos);

            if ($query->count() == 0) {
                $datostransf[] = $value;
            }
        }
        if ($datostransf) {
            return $datostransf;
        } else {
            return array();
        }
    }

    /**
     * @return array
     */
    public function cargarClientesConTranferecia($datos)
    {
        $serSalida = new DocumentosalidaService();
        return $serSalida->devolverClientesTransferencias($datos);
    }

    /**
     * @return array
     */
    public function devolverTransfConciliacion($datos)
    {
        $serSalida = new DocumentosalidaService();
        $query = Doctrine_Query::create()
            ->select('dct.idconciliaciontransferencia,dct.motivo,dct.recibido')
            ->from('DatConciliaciontransferencia dct')
            ->innerJoin('dct.DatConciliacion dc')
            ->addWhere('dct.idconciliacion = ?', $datos['iddocumento']);
        $serSalida->devolverTransfereciasQuery($query, 'dct');
        if (isset($datos['criterio'])) {
            if (is_numeric($datos['criterio'])) {
                $query->andWhere('d.nrodoc = ?', array($datos['criterio']));
            } else {
                $query->andWhere('d.nrodoc = ?', -1);
            }
        }
        $query->addGroupBy('dct.idconciliaciontransferencia, dct.motivo, dct.recibido');
        return array('cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $datos)->fetchArray());
    }

    /**
     * Metodo para cargar los usuarios del combo de la buqueda avanzada
     * @param type $param
     */
    public function devolverTodosUsuarios($param)
    {
        $usuariosCreadores = $this->devolverUsuarios();
        $usuariosOtros = $this->devolverUsuarios('aprobadopor');
        $dql = Doctrine_Query::create()->select("dc.idusuarioconsolida as  id")->from('DatConciliacion dc')
            ->innerJoin('dc.DatDocumento d');
        if ($this->iddoc) {
            $dql->addWhere('d.iddoc = ?', array($this->iddoc));
        }
        $queryResults = $dql->fetchArray();
        $usuariosDevueltos = array();
        if ($queryResults) {
            foreach ($queryResults as $idusuario) {
                if (!array_search($idusuario['id'], $usuariosDevueltos)) {
                    array_push($usuariosDevueltos, $idusuario['id']);
                }
            }
            $usuariosConcialiado = ServiciosSeguridadHelper::__init()->getUsersNameById($usuariosDevueltos);
        }
        $auxiliar = array_merge(array($usuariosCreadores, $usuariosOtros, $usuariosConcialiado));
        $usarios = array_unique($auxiliar);
        return $usarios;
    }

    /**
     * Metodo para validar si ya existe una conciliacion para un clinete con todas sus tranferencias
     * contabilizadas
     * @param array $param
     * @return boolean
     */
    public function validarExistenciaConciliacion($param)
    {

        foreach ($param['data']['conciliacion'] as $value) {
            $aregiddocumt['iddocumento'] = $this->obtenerTransferenciaAdicionar(array($value));
            if (count($aregiddocumt['iddocumento']) == 0) {
                return false;
            }
        }

        return true;
    }

}
