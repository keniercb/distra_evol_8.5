<?php

/**
 * @class RecepcionreservaModel
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright (c) 2014, XETID
 * @version 1.0
 */
class RecepcionreservaModel extends RecepcionModel
{
    /**
     * @var ConfreservaService
     */
    private $confReserva;

    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatMovrecepcionreserva',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'many',
            'relation' => 'DatMovmoneda',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'ConfCuadrobasico',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new NomIndicador(), $relations);
        $this->confReserva = new ConfreservaService();
    }

    public function cargaInicial()
    {
        $datos = parent::cargaInicial();
        $result = $this->cargarDepositos();
        $depositos = $this->objectHelper->extractValueFromArrayColumn($result['datos'], 'id');
        $datos['depositos'] = $depositos;
        $estructura = $this->estructuraHelper->getEstructura($this->global->Estructura->idestructura);
        $datos['tipo'] = $estructura[0]->tipo;
        $conf = $this->confReserva->obtenerConfiguracionGeneral();
        $datos['acumulacion'] = $conf['tipoacumulacion'];
        return $datos;
    }

    /**
     * Adiciona un documento.
     * @param Array $datosDoc Arreglo de datos del documento con sus preductos.
     * @return Integer
     */
    public function adicionarDocumento($datosDoc = array())
    {
        $iddocumento = parent::adicionarDocumento($datosDoc);
        if ($datosDoc['productos'][0]['cantacumular'] || $datosDoc['productos'][0]['acumular'] ||
            $datosDoc['productos'][0]['iddeposito']) {
            $collection = new Doctrine_Collection('DatMovrecepcionreserva');
            foreach ($datosDoc['productos'] as $value) {
                $reserva = Doctrine::getTable('DatMovrecepcionreserva')->find($value['idmovimiento']);
                if (!$reserva) {
                    $reserva = new DatMovrecepcionreserva();
                }
                $value['acumular'] = $value['acumular'] ? $value['acumular'] : 0;
                $value['cantidad'] = $value['cantacumular'];
                $value['idestructuraop'] = $value['iddeposito'];
                $reserva->synchronizeWithArray($value);
                $collection->add($reserva);
            }
            if ($collection->count() > 0) {
                $collection->save();
            }
        }
        return $iddocumento;
    }

    /**
     * Devuelve los movimientos del informe de recepción.
     * @param Doctrine_Query $query
     * @param array $filtro
     * @return array
     */
    public function devolverMovimientos($query, $filtro)
    {
        if ($filtro['cuadroBasico']) {
            $query = $this->confReserva->obtenerProductosReserva($filtro, true);
            $query->addSelect('p.idproducto AS idproducto')->innerJoin('ind.DatProductoLogistica p');
        } else {
            $query->addSelect(
                    'mr.cantidad AS cantacumular, coalesce(mr.acumular, 0) AS acumular, '
                    . 'mr.idestructuraop AS iddeposito, cf.rotacion AS rotacion, cf.idcuadrobasico AS idcuadrobasico, '
                    . 'cf.catastrofe AS catastrofe, cf.idestructura AS idestructuraconf, cf.porcentual AS porcentual, '
                    . 'cf.valoracumular AS valoracumular, cf.nivelacumulacion AS nivelacumulacion, '
                    . 'cf.observaciones AS observaciones, coalesce(movr.cantidad, 0) AS cantfactura'
                )
                ->leftJoin('mov.DatMovrecepcion movr')
                ->leftJoin('i.ConfCuadrobasico cf ON (i.idindicador = cf.idindicador OR i.idpadre = cf.idindicador)')
                ->leftJoin('mov.DatMovrecepcionreserva mr');
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Contabiliza un documento.
     * @param Integer $iddocumento (identificador de documento).
     * @return Boolean
     */
    public function contabilizarDocumento($iddocumento)
    {
        $resp = parent::contabilizarDocumento($iddocumento);
//        $fact = $this->configuracionHelper->tipoDocumentoByAliasByIdestructutra(
//            'entregaLog', $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_DIST
//        );
//        $conf = $this->confReserva->obtenerConfiguracionGeneral();
//        $padre = $this->estructuraHelper->buscarPadrePorSubordinacion(
//            array($this->idestructuracomun), array($conf['idsubordinacion'])
//        );
//        $filtros['idestructura'] = $padre[0]->id;
//        $cliente = $this->configuracionHelper->getClientesProveedorByParams(
//            null, $this->idestructuracomun, false, false, false, $filtros
//        );
//        $prod = Doctrine_Query::create()
//            ->select('m.idproducto, mr.cantidad AS cantidad, mr.idestructuraop AS idestructura')//
//            ->from('DatMovimientos m')
//            ->innerJoin('m.DatMovrecepcionreserva mr')
//            ->where('m.iddocumento = ?', $iddocumento)
//            ->fetchArray();
//        $datos = array('iddoc' => $fact->iddoc, 'idproductos' => $prod);
//        $datos['idcliente'][] = array('idcliente' => $cliente['datos'][0]['idclientesproveedores'], 'tipocliente' => 1);
//        $distribucion = new DistribucionService();
//        $iddist = $distribucion->adicionarDocDistribucionRotacion($datos);
//        $a = Doctrine_Query::create()->from('DatDocumento d')->innerJoin('d.DatDistribucion dd')
//            ->innerJoin('dd.DatProdorden dpo')->where('d.iddocumento = ?', $iddist)
//            ->fetchArray();
//        print_r($datos);die;
        return $resp;
    }

    /**
     * Devuelve un arreglo con los depósitos de la reserva
     * @return array
     */
    public function cargarDepositos()
    {
        return array('datos' => $this->confReserva->obtenerDepositos(true));
    }

}
