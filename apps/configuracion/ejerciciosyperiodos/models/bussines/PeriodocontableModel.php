<?php

/**
 * Clase modelo <b>Periodo Contable</b>.
 *
 * @package    Configuración
 * @subpackage EjercicioPeríodo/Models/Bussines
 * @author    Ing. Miguel Diaz Riveaux
 * @copyright XETID
 * @version   2.0-0
 * @internal  Aun debe mejorarse. Revisar aquellos sin comentarios
 */
class PeriodocontableModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Adicionar un objeto de un per&iacute;odo contable.
     *
     * @param DatPeriodocontable $objDatPeriodocontable Objeto de un Per&iacute;odo Contable.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function insertarPeriodoContable(DatPeriodocontable $objDatPeriodocontable)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objDatPeriodocontable->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF68', $ee);
        }
    }

    /**
     * Eliminar un objeto de un per&iacute;odo contable.
     *
     * @param DatPeriodocontable $objDatPeriodocontable Objeto de un Per&iacute;odo Contable.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function eliminarPeriodocontable(DatPeriodocontable $objDatPeriodocontable)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();

            $objDatPeriodocontable->delete();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503) {
                return '-4';
            }
        }
    }

    /**
     * Eliminar varios objetos de per&iacute;odos contables.
     *
     * @param ArrayList $agListIdPeriodos Lista de Per&iacute;odos Contables.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function eliminarVariosPeriodosContable($agListIdPeriodos)
    {
        try {
            $arrayIdPeriodos = split(",", $agListIdPeriodos);
            $collectionPeriodos = new Doctrine_Collection('DatPeriodocontable');
            foreach ($arrayIdPeriodos as $index => $idperiodo) {
                $objPeriodo = Doctrine::getTable('DatPeriodocontable')->find($idperiodo);
                $collectionPeriodos[$index] = $objPeriodo;
            }
            $collectionPeriodos->delete();
            return true;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503) {
                return '-4';
            }
        }
    }

    /**
     * Modificar un objeto de un per&iacute;odo contable.
     *
     * @param DatPeriodocontable $objDatPeriodocontable Objeto de un Per&iacute;odo Contable.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function modificarPeriodocontable(DatPeriodocontable $objDatPeriodocontable)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objDatPeriodocontable->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF122', $ee);
        }
    }

    /**
     * Verifica la versión
     *
     * @param int $idperiodo Identificador de período
     *
     * @return int
     */
    public function verificarVersion($idperiodo)
    {
        $result = DatPeriodocontable::Periodos('', array('idperiodo' => $idperiodo));
        return $result[0]['version'];
    }

    /**
     * Obtiene la cantidad de períodos pertenecientes a una estructura
     *
     * @param int $idEstructura Identificador de estructura
     *
     * @return int
     */
    public function cantidadPeriodoIn($idEstructura)
    {

        $query = Doctrine_Query::create();
        $cantFndes = $query->select('count(u.idperiodo) as cant')
            ->from('DatPeriodocontable u')
            ->innerJoin('u.DatEjerciciocontable f')
            ->where("f.idestructuracomun ='$idEstructura'")
            ->execute();
        return $cantFndes[0]->cant;
    }

    /**
     * Inserta períodos contables pertenecientes a un ejercicio natural
     *
     * @param $obj
     *
     * @return bool
     * @throws ZendExt_Exception
     */
    public function insertarPeriodoContEjercicioNat($obj)
    {
        try {
            $cant = count($obj);
            for ($i = 0; $i < $cant; $i++) {
                $periodo = $obj[$i]->buscarPeriodo(
                    array('nombre' => $obj[$i]->nombre, 'idejercicio' => $obj[$i]->idejercicio)
                );
                if (!$periodo['cant']) {
                    $dm = Doctrine_Manager::getInstance();
                    $cc = $dm->getCurrentConnection();
                    $cc->beginTransaction();
                    $obj[$i]->save();
                    $cc->commit();
                } else {
                    return false;
                }
            }
            return true;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF69', $ee);
        }
    }

    /**
     * Modificar los per&iacute;odos contables Apertura y Cierre de Ejecicio.
     *
     * @param ArrayObject $arrayPeriodos Arreglo de Periodos Contables.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function modificarAperturaCierre($arrayPeriodos)
    {
        try {
            $collectionPeriodos = new Doctrine_Collection('DatPeriodocontable');
            foreach ($arrayPeriodos as $index => $periodo) {
                $collectionPeriodos[$index] = $periodo;
            }
            $collectionPeriodos->save();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF122', $ee);
        }
    }

}