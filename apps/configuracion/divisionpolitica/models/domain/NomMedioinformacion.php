<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomMedioinformacion extends BaseNomMedioinformacion
{
    public function getTiposMedios()
    {
        $_query = Doctrine_Query::create();
        return $_query->from('NomMedioinformacion')
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
    }

    public function setUp()
    {
        parent::setUp();
    }

    /**
     * Inserta un NomMedioinformacion
     *
     * @param NomMedioinformacion $nomMedioinformacion
     *
     * @return code Código de respuesta
     */
    public function insertar(NomMedioinformacion $nomMedioinformacion)
    {
        $objvalidators = new NomencladoresValidator();
        if ($objvalidators->validarDenominacion('NomMedioinformacion', $nomMedioinformacion->denominacion)) {
            $nomMedioinformacion->save();
            return $nomMedioinformacion->idmedioinformacion;
        } else {
            throw new ZendExt_Exception('NCI03');
        }
    }

    /**
     * Modifica un NomMedioinformacion
     *
     * @param NomMedioinformacion $nomMedioinformacion
     *
     * @return code Código de respuesta
     */
    public function modificar(NomMedioinformacion $nomMedioinformacion)
    {
        $nomMedioinformacion->save();
        return $nomMedioinformacion->idmedioinformacion;
    }

    /**
     * Elimina un NomMedioinformacion
     *
     * @param int   $idmedioinformacion
     * @param mixed $con
     *
     * @return code Código de respuesta
     * @throws Exception
     */
    public function eliminar($idmedioinformacion, $con)
    {
        $query = new Doctrine_Query();
        try {
            $query->delete()->from('NomMedioinformacion')->where("idmedioinformacion = '$idmedioinformacion'")
                ->execute();
            return true;
        } catch (Exception $e) {
            $con->commit();
            $queryDos = new Doctrine_Query();
            $queryDos->update('NomMedioinformacion')->set('fechafin=?', 'CURRENT_DATE')->where(
                "idmedioinformacion = '$idmedioinformacion'"
            )->execute();
            return false;
        }
    }

    /**
     * Busca un NomMedioinformacion
     *
     * @param int $idmedioinformacion
     *
     * @return array
     */
    public function Buscar($idmedioinformacion)
    {
        return Doctrine::getTable('NomMedioinformacion')->find($idmedioinformacion);
    }

    /**
     * Obtiene todos los  NomMedioinformacion
     *
     * @param mixed $denom    Denominación
     * @param date  $fechaini Fecha inicio
     * @param date  $fechafin Fecha fin
     *
     * @return array
     */
    public function GetTodos($denom, $fechaini, $fechafin)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomMedioinformacion')->orderby('idmedioinformacion');
        $result = ($denom != '') ? $result->addWhere("lower(denominacion) LIKE lower ('%$denom%')") : $result;
        $value = self::fechaGetTodos($fechafin, $fechaini);
        /* $value == 10 es equivalente a ($fechafin == '') && ($fechaini != '') */
        $result = $value == 10 ? $result->addWhere("fechaini = ('%$fechaini%')") : $result;
        /* $value == 20 es equivalente a ($fechafin != '') && ($fechaini == '') */
        $result = $value == 20 ? $result->addWhere("fechafin <= '$fechafin' ") : $result;
        /* $value == 0 es equivalente a ($fechafin != '') && ($fechaini != '') */
        $result = $value == 0 ? $result->addWhere("fechaini >= '$fechaini' and fechafin <= '$fechafin'") : $result;
        $final = $result->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        //print_r($query->getDql());die;
        //print_r($final);die;
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
     * Obtiene todos los  NomMedioinformacion
     *
     * @param int   $limite   Límite superior
     * @param int   $inicio   Comienzo inferior
     * @param mixed $denom    Denominación
     * @param date  $fechaini Fecha inicio
     * @param date  $fechafin Fecha fin
     *
     * @return array
     */
    public function GetPorLimite($limite = 20, $inicio = 0, $denom = null, $fechaini = null, $fechafin = null)
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomMedioinformacion')->limit($limite)->offset($inicio)->orderby('idmedioinformacion');
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