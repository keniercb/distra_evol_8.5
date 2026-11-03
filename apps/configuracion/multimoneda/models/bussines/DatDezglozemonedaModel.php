<?php

/**
 * Clase modelo <b>Desglose de monedas</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Bussines
 * @copyright  XETID
 * @version    1.0-0
 */
class DatDezglozemonedaModel extends ZendExt_Model
{

    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Adiciona un desglose.
     *
     * @param DatDezglozemoneda $objDatDezglozemoneda Objeto a adicionar
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function Adicionar(DatDezglozemoneda $objDatDezglozemoneda)
    {
        try
        {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objDatDezglozemoneda->save();
            $cc->commit();
            return true;
        }
        catch (Doctrine_Exception $ee)
        {
            Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
            throw $ee;
        }
    }

    /**
     * Adiciona varios desgloses.
     *
     * @param array $agListIdDesgloses Identificadores de desgloses
     * @param array $agIdMoneda        Identificadores de monedas
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function AdicionarVariosDesgloses(
    $agListIdDesgloses, $agIdMoneda
    )
    {
        try
        {
            $dcDatDezglozemoneda = new Doctrine_Collection('DatDezglozemoneda');
            foreach ($agListIdDesgloses as $index => $iddesglose) {
                $dcDatDezglozemoneda[$index]->idmoneda = $agIdMoneda;
                $dcDatDezglozemoneda[$index]->iddezglozemonedas = $iddesglose;
            }
            $dcDatDezglozemoneda->save();
            return true;
        }
        catch (Doctrine_Exception $ee)
        {
            throw $ee;
        }
    }

    /**
     * Modifica un desglose.
     *
     * @param DatDezglozemoneda $objDatDezglozemoneda Objeto a modificar
     *
     * @return boolean
     * @throws Doctrine_Exception
     */
    static public function Actualizar(DatDezglozemoneda $objDatDezglozemoneda)
    {
        try
        {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objDatDezglozemoneda->save();
            $cc->commit();
            return true;
        }
        catch (Doctrine_Exception $ee)
        {
            Doctrine_Manager::getInstance()->getCurrentConnection()->rollback();
            throw $ee;
        }
    }

    /**
     * Elimina un desglose.
     *
     * @param DatDezglozemoneda $objDatDezglozemoneda Objeto a eliminar
     *
     * @return mixed "true" si elimina correctamente, -3 en caso de excepción
     */
    static public function Eliminar(DatDezglozemoneda $objDatDezglozemoneda)
    {
        try
        {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objDatDezglozemoneda->delete();
            $cc->commit();
            return true;
        }
        catch (Doctrine_Exception $e)
        {
            if ($e->getCode() == 23503) {
                return '-3';
            }
        }
    }

    /**
     * Elimina varios desgloses.
     *
     * @param array $agListIdDesgloses Identificadores de desgloses
     *
     * @return mixed "true" si elimina correctamente, -3 en caso de excepción
     */
    static public function EliminarVariosDesgloses($agListIdDesgloses)
    {
        try
        {
            $dcDatDezglozemoneda = new Doctrine_Collection('DatDezglozemoneda');
            foreach ($agListIdDesgloses as $index => $iddesglose) {
                $dcDatDezglozemoneda[$index] = Doctrine::getTable(
                                'DatDezglozemoneda'
                        )->find($iddesglose);
            }
            $dcDatDezglozemoneda->delete();
            return true;
        }
        catch (Doctrine_Exception $e)
        {
            if ($e->getCode() == 23503) {
                return '-3';
            }
        }
    }

    /**
     * Obtiene desgloses.
     *
     * @param array $agArrayFilterSql Filtro SQL
     * @param mixed $agStart          Inicio
     * @param mixed $agLimit          Límite
     *
     * @return array Cantidad y datos de los desgloses
     * @throws Doctrine_Exception
     */
    static public function obtenerDesglosesMonedas(
    $agArrayFilterSql, $agStart, $agLimit
    )
    {
        try
        {
            $arrayDesgloseMonedas = DatDezglozemoneda::getDesglosesByIdNomMoneda(
                            $agArrayFilterSql, $agStart, $agLimit
            );
            $cant = count(DatDezglozemoneda::getDesglosesByIdNomMonedaSQL($agArrayFilterSql));
            return array('cant' => $cant, 'datos' => $arrayDesgloseMonedas);
        }
        catch (Doctrine_Exception $exc)
        {
            throw $exc;
        }
    }

    /**
     * Obtiene desgloses por el identificador de moneda.
     *
     * @param array $agArrayFilterSql Filtro SQL
     * @param mixed $agStart          Inicio
     * @param mixed $agLimit          Límite
     *
     * @return array Cantidad y datos de los desgloses
     * @throws Doctrine_Exception
     */
    static public function obtenerDesglosesMonedasByIdMoneda(
    $agArrayFilterSql, $agStart, $agLimit
    )
    {
        try
        {
            $arrayDatDesgloses = DatDezglozemoneda::getDesglosesByIdNomMoneda(
                            $agArrayFilterSql, $agStart, $agLimit
            );
            $arrayIdNomDesgloses = array();
            foreach ($arrayDatDesgloses as $datDesglose) {
                $arrayIdNomDesgloses[] = $datDesglose['iddezglozemonedas'];
            }
            $arrayDesgloseMonedas = NomDezglozemonedas::getNomDesglosesSinAsociarAun(
                            $arrayIdNomDesgloses, $agStart, $agLimit
            );
            $cant = count($arrayDesgloseMonedas);
            return array('cant' => $cant, 'datos' => $arrayDesgloseMonedas);
        }
        catch (Exception $exc)
        {
            throw $exc;
        }
    }

    /**
     * Obtiene monedas contables alternativas a partir de la estructura común.
     *
     * @param mixed $agIdEntidad Identificador de estructura común
     *
     * @return array Cantidad y datos de las monedas
     * @throws Doctrine_Exception
     * @throws ZendExt_Exception
     */
    static public function obtenerMonedasContAlternByEntidad($agIdEntidad)
    {
        try
        {
            $arrayMonedasContAltern = DatMoneda::getMonedasContableAlternativasByEntidad(
                            $agIdEntidad
            );
            $cant = count($arrayMonedasContAltern);
            if ($cant > 0) {
                return array('cant' => $cant,
                    'datos' => $arrayMonedasContAltern);
            } else {
                throw new ZendExt_Exception('CONF128');
            }
        }
        catch (Exception $exc)
        {
            throw $exc;
        }
    }

}
