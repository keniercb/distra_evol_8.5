<?php

/**
 * Clase modelo <b>Monedas-Entidad</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Bussines
 * @copyright  XETID
 * @version    1.0-0
 */
class DatMonedaEntidadModel extends ZendExt_Model
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Verifica si existe una moneda.
     *
     * @param mixed $idmoneda Identificador de moneda
     * @param mixed $estructura Estructura de moneda
     * @param mixed $tipomoneda Tipo de moneda
     *
     * @return int -2 ya existe, -1 no existe
     */
    static public function verificarExisteMoneda($idmoneda, $estructura, $tipomoneda, $dualidad)
    {
        $query = Doctrine_Query::create();
        $moneda = $query->select('me.idmoneda')
            ->from('DatMonedaEntidad me')
            ->where("me.idmoneda='$idmoneda' AND me.idestructuracomun='$estructura' AND
            me.tipomoneda='$tipomoneda' AND me.dualidad = '$dualidad'")
            ->execute();
        if ($moneda->count() > 0) {
            return -2;
        }
        return -1;
    }

    /**
     * Adiciona una moneda.
     *
     * @param DatMonedaEntidad $objDatMonedaEntidad Objeto a adicionar
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function Adicionar(DatMonedaEntidad $objDatMonedaEntidad)
    {
        try {
            $global = ZendExt_GlobalConcept::getInstance();
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objDatMonedaEntidad->save();
            if ($objDatMonedaEntidad->tipomoneda == 0) {
                $objTasaBase = new DatTasa();
                $objTasaBase->idestructuracomun
                    = $global->Estructura->idestructura;
                $objTasaBase->factordeconversion = 1;
                $objTasaBase->version = 0;
                $objTasaBase->compra = 1;
                $objTasaBase->venta = 1;
                $objTasaBase->idtipotasa = 2;
                $objTasaBase->desde = null;
                $objTasaBase->hasta = null;
                $objTasaBase->idcliente = null;
                $objTasaBase->referencia = 'Tasa moneda contable uno por uno';
                $objTasaBase->nombretasa = 'Tasa moneda contable uno por uno';
                $objTasaBase->idmoneda = $objDatMonedaEntidad->idmoneda;
                $objTasaBase->idmonedacontable = $objDatMonedaEntidad->idmonedaentidad;

                TasaModel::adicionarTasaBase($objTasaBase);
            }
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * Adiciona varias monedas.
     *
     * @param array $agArrayIdMonedas Identificadores de monedas
     * @param mixed $agIdEntidad      Identificador de estructura común
     * @param mixed $agIdPais         Identificador de país
     *
     * @return boolean
     * @throws ZendExt_Exception
     */
    static public function AdicionarVariasMonedaEntidad(
        $agArrayIdMonedas, $agIdEntidad, $agIdPais
    ) {
        try {
            $dcMonedaEntidad = new Doctrine_Collection('DatMonedaEntidad');
            foreach ($agArrayIdMonedas as $index => $idNomMoneda) {
                $dcMonedaEntidad[$index]->idnommoneda = $idNomMoneda;
                $dcMonedaEntidad[$index]->idpais = $agIdPais;
                $dcMonedaEntidad[$index]->idestructuracomun = $agIdEntidad;
                $dcMonedaEntidad[$index]->version = 0;
            }
            $dcMonedaEntidad->save();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF130', $ee);
        }
    }

    /**
     * Modifica una moneda.
     *
     * @param DatMonedaEntidad $objDatMonedaEntidad Objeto a modificar
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function Modificar(DatMonedaEntidad $objDatMonedaEntidad)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objDatMonedaEntidad->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $dex) {
            throw $dex;
        }
    }

    /**
     * Elimina una moneda.
     *
     * @param DatMonedaEntidad $objDatMonedaEntidad Objeto a eliminar
     *
     * @return mixed "true" si elimina correctamente, -3 en caso de excepción
     */
    static public function Eliminar($objDatMonedaEntidad, $estructurea)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            if ($objDatMonedaEntidad->tipomoneda == 0) {
                $objTasaBase = Doctrine_Core::getTable('DatTasa')->findBySql(
                    "idtipotasa = ? and compra = ? and venta = ? and factordeconversion = ? and idmonedacontable = ?
                    and idestructuracomun = ? and nombretasa = ? and idmoneda = ?
                    and desde is null and hasta is null and idcliente is null",
                    array(2, 1, 1, 1, $objDatMonedaEntidad->idmonedaentidad,
                          $estructurea, 'Tasa moneda contable uno por uno',
                          $objDatMonedaEntidad->idmoneda),
                    Doctrine_Core::HYDRATE_RECORD
                );
                if ($objTasaBase->count() > 0) {
                    if ($objTasaBase->delete()) {
                        $objDatMonedaEntidad->delete();
                    }
                } else {
                    $objDatMonedaEntidad->delete();
                }
            } else {
                $objDatMonedaEntidad->delete();
            }
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $e) {
            //if ($e->getCode() == 23503) {
            return '-3';
            //}
        }
    }

    /**
     * Elimina varias monedas.
     *
     * @param array $agArrayIdMonedas Identificadores de monedas
     *
     * @return mixed "true" si elimina correctamente, -3 en caso de excepción
     */
    static public function eliminarVariasMonedas(
        $agArrayIdMonedas, $estructurea
    ) {
        try {
            $collectionMonedas = new Doctrine_Collection('DatMonedaEntidad');
            foreach ($agArrayIdMonedas as $indexMoneda => $idMoneda) {
                $objDatMonedaEntidad = Doctrine::getTable(
                    'DatMonedaEntidad'
                )->find($idMoneda);
                if ($objDatMonedaEntidad->tipomoneda == 0) {
                    $idMoneda = $objDatMonedaEntidad->idmoneda;
                    $idMonedaContable = $objDatMonedaEntidad->idmonedacontable;
                    //$idEstructuraComun = $global->Estructura->idestructura;
                    $objTasaBase = Doctrine_Core::getTable('DatTasa')
                        ->findBySql(
                            "idtipotasa = ? and compra = ? and venta = ? and factordeconversion = ?
                            and idmonedacontable = ? and idestructuracomun = ? and nombretasa = ? and idmoneda = ?
                            and desde is null and hasta is null and idcliente is null",
                            array(2, 1, 1, 1, $idMonedaContable, $estructurea,
                                  'Tasa moneda contable uno por uno',
                                  $idMoneda), Doctrine_Core::HYDRATE_RECORD
                        );
                    if ($objTasaBase->count() > 0) {
                        if ($objTasaBase->delete()) {
                            $collectionMonedas[$indexMoneda]
                                = $objDatMonedaEntidad;
                        }
                    } else {
                        $collectionMonedas[$indexMoneda] = $objDatMonedaEntidad;
                    }
                } else {
                    $collectionMonedas[$indexMoneda] = $objDatMonedaEntidad;
                }
            }
            $collectionMonedas->delete();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                return '-3';
            }
        }
    }

    /**
     * Elimina varias monedas.
     *
     * @param int $idestrucutra Identificador de la estructura
     *
     * @return array Monedas
     */
    static public function ObtenerMonedasTasasConfiguradas($idestructura)
    {
        $result = DatMonedaEntidad::ObtenerMonedasTasasConfiguradas($idestructura);
        return array('datos' => $result);
    }

    /**
     * Verifica si la entidad ya posee una moneda contable.
     *
     * @param numeric $idestrucutura identificador de la estructura
     *
     * @return mixed "true" si exite false si no.
     */
    static public function existeMonedaContable($idestructura)
    {
        $result = DatMonedaEntidad::ObtenerMonedaContableDadoEntidad($idestructura,0);
        if (count($result['datos']) != 0) {
            return true;
        }
        return false;
    }

    /**
     * Verifica si la entidad ya posee una moneda contable.
     *
     * @param numeric $idestrucutura identificador de la estructura
     *
     * @return mixed "true" si exite false si no.
     */
    static public function existeMonedaAlternativa($idestructura)
    {
        $result = DatMonedaEntidad::ObtenerMonedasAlternativasDadoEntidad($idestructura);
        if (count($result['datos']) != 0) {
            foreach ($result['datos'] as $monedas) {
                if ($monedas['dualidad'] == 1) {
                    return true;
                }
            }
        }
        return false;
    }

}
