<?php

/**
 * Clase modelo <b>Nomenclador de desglose</b>.
 *
 * @author     Ing. Maikel Garcia Valdes
 * @package    Configuración
 * @subpackage Multimoneda/Models/Bussines
 * @copyright  XETID
 * @version    1.0-0
 */
class NomDezglozemonedasModel extends ZendExt_Model
{
    /**
     * Inicializa el padre
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Adiciona un desglose
     *
     * @param NomDezglozemonedas $objNomDezglozemonedas Desglose a ser adicionado
     *
     * @return int -1 si se adicionó correctamente, -2 si el valor ya existe, -3 si la denominación ya existe
     * @throws Doctrine_Exception
     */
    static public function Adicionar(NomDezglozemonedas $objNomDezglozemonedas)
    {
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        try {
            $result = NomDezglozemonedas::verificar($objNomDezglozemonedas);
            if ($result == -1) {
                $cc->beginTransaction();
                $objNomDezglozemonedas->save();
                $cc->commit();
                return $result;
            } else {
                return $result;
            }
        } catch (Doctrine_Exception $e) {
            $cc->rollback();
            throw $e;
        }
    }

    /**
     * Modifica un desglose
     *
     * @param NomDezglozemonedas $objNomDezglozemonedas Desglose a ser modificado
     *
     * @return int -1 si se modificó correctamente, -2 si el valor ya existe, -3 si la denominación ya existe
     * @throws Doctrine_Exception
     */
    static public function Modificar(NomDezglozemonedas $objNomDezglozemonedas)
    {
        $dm = Doctrine_Manager::getInstance();
        $cc = $dm->getCurrentConnection();
        try {
            $result = NomDezglozemonedas::verificar($objNomDezglozemonedas);
            if ($result == -1) {
                $cc->beginTransaction();
                $objNomDezglozemonedas->save();
                $cc->commit();
                return $result;
            } else {
                return $result;
            }
        } catch (Doctrine_Exception $e) {
            $cc->rollback();
            throw $e;
        }
    }

    /**
     * Elimina desgloses
     *
     * @param array $array Desgloses a ser eliminados
     * @param mixed $nosepudieronElim Elementos que no se pueden eliminar
     *
     * @return array Elementos que no se pudieron eliminar
     * @throws Doctrine_Exception
     */
    static public function eliminarDesglose(&$array, &$nosepudieronElim)
    {
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        foreach ($array as $key => $id) {
            $obj = Doctrine::getTable('NomDezglozemonedas')->find(
                $id->iddezglozemonedas
            );
            try {
                self::auxDelete($obj);
            } catch (Doctrine_Connection_Pgsql_Exception $e) {
                if ($e->getCode() == '23503') {
                    $nosepudieronElim .= (!$nosepudieronElim)
                        ? "$obj->valor $obj->denominacion"
                        : ',' . "$obj->valor $obj->denominacion";
                    unset($array[$key]);
                    array_values($array);
                    if ($conn->getTransactionLevel() != 0) {
                        $conn->rollBack();
                    }
                    self::eliminarDesglose($array, $nosepudieronElim);
                } else {
                    echo $e->getMessage();
                }
            } catch (Exception $ex) {
                echo $ex->getMessage();
            }
        }
        return $nosepudieronElim;
    }
    static private function auxDelete($obj)
    {
        if ($obj->iddezglozemonedas) {
            $obj->delete();
        }
    }
}