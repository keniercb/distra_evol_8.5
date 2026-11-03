<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomConfiabilidad extends BaseNomConfiabilidad
{
    public function setUp()
    {
        parent::setUp();
    }

    /**
     * Obtiene NomConfiabilidad
     *
     * @return array
     */
    public function getConfiabilidad()
    {
        $_query = Doctrine_Query::create();
        return $_query->from('NomConfiabilidad')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    /**
     * Inserta un NomConfiabilidad
     *
     * @param NomConfiabilidad $nomConfiabilidad
     *
     * @return code Código de respuesta
     */
    public function insertar(NomConfiabilidad $nomConfiabilidad)
    {

        $objvalidators = new NomencladoresValidator();
        if ($objvalidators->validarDenominacion('NomConfiabilidad', $nomConfiabilidad->denominacion)) {
            $nomConfiabilidad->save();
            return $nomConfiabilidad->idconfiabilidad;

        } else {
            throw new ZendExt_Exception('NCI06');
        }
    }

    /**
     * Modifica un NomConfiabilidad
     *
     * @param NomConfiabilidad $nomConfiabilidad
     *
     * @return code Código de respuesta
     */
    public function modificar(NomConfiabilidad $nomConfiabilidad)
    {
        $nomConfiabilidad->save();
        return $nomConfiabilidad->idconfiabilidad;

    }

    /**
     * Elimina un NomConfiabilidad
     *
     * @param NomConfiabilidad $NomConfiabilidad
     * @param mixed            $con
     *
     * @return code Código de respuesta
     * @throws Exception
     */
    public function eliminar($idconfiabilidad, $con)
    {
        $query = new Doctrine_Query();
        try {
            $query->delete()
                ->from('NomConfiabilidad')->where("idconfiabilidad = '$idconfiabilidad'")->execute();
            return true;
        } catch (Exception $e) {
            $con->commit();
            $queryDos = new Doctrine_Query();
            $queryDos->update('NomConfiabilidad')->set('fechafin=?', 'CURRENT_DATE')->where(
                "idconfiabilidad = '$idconfiabilidad'"
            )->execute();
            return false;
        }
    }

    /**
     * Busca un NomConfiabilidad
     *
     * @param int $idconfiabilidad Identificador de confiabilidad
     *
     * @return array
     */
    public function Buscar($idconfiabilidad)
    {
        return Doctrine::getTable('NomConfiabilidad')->find($idconfiabilidad);
    }

    /**
     * Obtiene todos los NomConfiabilidad
     *
     * @param mixed $denom    Denominación
     * @param int   $fechaini Fecha inicio
     * @param int   $fechafin Fecha fin
     *
     * @return array
     */
    public function GetTodos($denom, $fechaini, $fechafin)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomConfiabilidad')->orderby('idconfiabilidad');
        $result = ($denom != '') ? $result->addWhere("lower(denominacion) LIKE lower ('%$denom%')") : $result;
        $value = self::fechaGetTodos($fechafin, $fechaini);
        /* $value == 10 es equivalente a ($fechafin == '') && ($fechaini != '') */
        $result = $value == 10 ? $result->addWhere("fechaini = ('%$fechaini%')") : $result;
        /* $value == 20 es equivalente a ($fechafin != '') && ($fechaini == '') */
        $result = $value == 20 ? $result->addWhere("fechafin <= '$fechafin' ") : $result;
        /* $value == 0 es equivalente a ($fechafin != '') && ($fechaini != '') */
        $result = $value == 0 ? $result->addWhere("fechaini >= '$fechaini' and fechafin <= '$fechafin'") : $result;
        $final = $result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $final;
    }

    /**
     * Comparte las funcionalidades de GetTodos y GetPorLimite
     *
     * @param date $fechafin    Fecha fin
     * @param date $fechainicio Fecha inicio
     *
     * @return int $value Retorna '0' cuando las fechas son diferentes, '10' fechafin es vacia y fechainicio no,
     * '20' fechainicio vacia y fechafin no, y '30' ninguna es vacia.
     */
    private function fechaGetTodos($fechafin, $fechainicio)
    {
        $value = 0;
        if ($fechafin == '') {
            $value += 10;
        }
        if ($fechainicio == '') {
            $value += 20;
        }
        return $value;
    }

    /**
     * Obtiene todos los NomConfiabilidad por límites
     *
     * @param int   $limite   Límite superior
     * @param int   $inicio   Comienzo inferior
     * @param mixed $denom    Denominación
     * @param int   $fechaini Fecha inicio
     * @param int   $fechafin Fecha fin
     *
     * @return array
     */
    public function GetPorLimite($limite = 20, $inicio = 0, $denom = '', $fechaini = '', $fechafin = '')
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomConfiabilidad')->limit($limite)->offset($inicio)->orderby('idconfiabilidad');
        $result = ($denom != '') ? $result->addWhere("lower(denominacion) LIKE lower ('%$denom%')") : $result;
        $value = self::fechaGetTodos($fechafin, $fechaini);
        /* $value == 10 es equivalente a ($fechafin == '') && ($fechaini != '') */
        $result = $value == 10 ? $result->addWhere("fechaini = ('%$fechaini%')") : $result;
        /* $value == 20 es equivalente a ($fechafin != '') && ($fechaini == '') */
        $result = $value == 20 ? $result->addWhere("fechafin <= '$fechafin' ") : $result;
        /* $value == 0 es equivalente a ($fechafin != '') && ($fechaini != '') */
        $result = $value == 0 ? $result->addWhere("fechaini >= '$fechaini' and fechafin <= '$fechafin'") : $result;
        $final = $result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $final;
    }
}