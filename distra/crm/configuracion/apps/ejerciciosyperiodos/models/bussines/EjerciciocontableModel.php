<?php

/**
 * Clase modelo <b>Ejercicio Contable</b>.
 *
 * @package    Configuración
 * @subpackage EjercicioPeríodo/Models/Bussines
 * @author    Ing. Miguel Diaz Riveaux
 * @copyright XETID
 * @version   2.0-0
 * @internal  Aun debe mejorarse. Revisar aquellos sin comentarios
 */
class EjerciciocontableModel extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Inserta un DatEjerciciocontable
     *
     * @param DatEjerciciocontable $objDatEjerciciocontable
     *
     * @return bool
     * @throws ZendExt_Exception
     */
    public function insertarDatEjerciciocontable(DatEjerciciocontable &$objDatEjerciciocontable)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objDatEjerciciocontable->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF66', $ee);
        }
    }

    /**
     * Elimina un DatEjerciciocontable
     *
     * @param DatEjerciciocontable $objDatEjerciciocontable
     *
     * @return bool|string
     * @throws Doctrine_Exception|Exception
     */
    public function eliminarDatEjerciciocontable(DatEjerciciocontable &$objDatEjerciciocontable)
    {
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        $cc->beginTransaction();
        try {
            self::actualizarAntecesorEjercicioSgte($objDatEjerciciocontable);
            $objDatEjerciciocontable->delete();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $ee) {
            $cc->rollback();
            if ($ee->getCode() == 23503) {
                return '-4';
            } else {
                throw $ee;
            }
        }
    }

    /**
     * Al eliminar un ejercicio se actualiza al siguiente ejercicio el antecesor.
     *
     * @param DatEjerciciocontable $objDatEjerciciocontableActual Objeto ejercicio actual.
     */
    static public function actualizarAntecesorEjercicioSgte(DatEjerciciocontable $objDatEjerciciocontableActual)
    {
        $idEjercicioAntecesor = $objDatEjerciciocontableActual->antecesor;
        $idejercicio = $objDatEjerciciocontableActual->idejercicio;
        $idEjercicioSgte = DatEjerciciocontable::ejercicioSiguiente($idejercicio);
        if (isset($idEjercicioSgte) && strlen($idEjercicioSgte) > 0) {
            $objDatEjercicioSgte = Doctrine::getTable('DatEjerciciocontable')->find($idEjercicioSgte);
            $objDatEjercicioSgte->antecesor = $idEjercicioAntecesor;
            $objDatEjercicioSgte->save();
        }
    }

    /**
     * Eliminar varios objetos de ejercicios contables.
     *
     * @param array $agListIdEjercicio Lista de Ejercicios Contables.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    public function eliminarVariosEjerciciosContable($agListIdEjercicio)
    {
        try {
            $arrayIdEjercicios = split(",", $agListIdEjercicio);
            $collectionEjercicio = new Doctrine_Collection('DatEjerciciocontable');
            foreach ($arrayIdEjercicios as $index => $idEjercicio) {
                $collectionEjercicio[$index] = Doctrine::getTable('DatEjerciciocontable')->find($idEjercicio);
                self::actualizarAntecesorEjercicioSgte($collectionEjercicio[$index]);
            }
            $collectionEjercicio->delete();
            return true;
        } catch (Doctrine_Exception $ee) {
            if ($ee->getCode() == 23503) {
                return '-4';
            } else {
                throw $ee;
            }
        }
        /*
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        $cc->beginTransaction();
        try {
            for($i=0; i<count($agListIdEjercicio); $i++){
                $this->actualizarAntecesorEjercicioSgte($agListIdEjercicio[$i]);
                $agListIdEjercicio[$i]->delete();
            }
            $cc->commit();
            return '-1';
        } catch (Doctrine_Exception $ee) {
            $cc->rollback();
            if ($ee->getCode() == 23503) {
                return '-4';
            } else {
                throw $ee;
            }
        }*/

    }

    /**
     * Modifica un DatEjerciciocontable
     *
     * @param $obj
     *
     * @return bool
     * @throws ZendExt_Exception
     */
    public function modificarDatEjerciciocontable($obj)
    {
        try {
            $nombre = $obj->nombre;
            $inicio = $obj->inicio;
            $fin = $obj->fin;
            $idejercicio = $obj->idejercicio;
            $version = $obj->version;
            $versiono = self::verificarVersion($idejercicio);
            if ($versiono != $version) {
                throw new ZendExt_Exception('CONF07');
            }
            $obj->nombre = $nombre;
            $obj->inicio = $inicio;
            $obj->fin = $fin;
            $obj->idejercicio = $idejercicio;
            $obj->save();
            return true;
        } catch (Doctrine_Exception $ee) {
            throw new ZendExt_Exception('CONF67', $ee);
        }
    }

    /**
     * Verifica la versión
     *
     * @param int $idejercicio Identificador de ejercicio
     *
     * @return array
     */
    public function verificarVersion($idejercicio)
    {
        $result = DatEjerciciocontable::Ejercicios('', array('idejercicio' => $idejercicio));
        return $result[0]['version'];
    }

    /**
     * Obtiene la cantidad de ejercicio
     *
     * @param array $cond
     *
     * @return int
     */
    public function CantidadEjercicios($cond = array())
    {
        $result = DatEjerciciocontable::CantidadEjercicios($cond);
        return $result;
    }

    /**
     * Obtiene la cantidad de ejercicios asociados a una estructura
     *
     * @param int $idEstructura Identificador de estructura
     *
     * @return int
     */
    public function cantidadEjercicioIn($idEstructura)
    {

        $query = Doctrine_Query::create();
        $cantFndes = $query->select('count(u.idejercicio) as cant')
            ->from('DatEjerciciocontable u')
            ->where("u.idestructuracomun ='$idEstructura'")
            ->execute();
        return $cantFndes[0]->cant;
    }

    /**
     * Convertir el a&ntilde;o natural a uno no natural.
     *
     * @param DatEjerciciocontable $objEjercicioContable Objeto de un Ejercicio Contable basado en a&ntilde;o natural.
     *
     * @throws Doctrine_Exception $exception Excepci&oacute;n de doctrine ocurrida durante la transacci&oacute;n.
     * @return Boolean Devuelve verdadero si fue realizada la operaci&oacute;n, falso de lo contrario.
     */
    static public function desNaturalizarAnno(DatEjerciciocontable $objEjercicioContable)
    {
        try {
            $dm = Doctrine_Manager::getInstance();
            $cc = $dm->getCurrentConnection();
            $cc->beginTransaction();
            $objEjercicioContable->set('annonatural', 0);
            $objEjercicioContable->save();
            $cc->commit();
            return true;
        } catch (Doctrine_Exception $exc) {
            throw new ZendExt_Exception('CONF67', $exc->getMessage());
        }
    }

}