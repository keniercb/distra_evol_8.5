<?php

/**
 *
 * @copyright  XETID
 * @package    Configuración
 * @subpackage DivisiónPolítica/Models/Domain
 * @version    1.0
 */
class NomClasificacioninformacion extends BaseNomClasificacioninformacion
{
    public function setUp()
    {
        parent::setUp();
    }

    /**
     * Inserta un NomClasificacioninformacion
     *
     * @param NomClasificacioninformacion $nomClasificacioninformacion
     *
     * @return code Código de respuesta
     */
    public function insertar(NomClasificacioninformacion $nomClasificacioninformacion)
    {

        $objvalidators = new NomencladoresValidator();
        if ($objvalidators->validarDenominacion(
            'NomClasificacioninformacion', $nomClasificacioninformacion->denominacion
        )
        ) {
            $nomClasificacioninformacion->save();
            return 1;
        } else {
            throw new ZendExt_Exception('NCI01');
        }
    }

    /**
     * Modifica un NomClasificacioninformacion
     *
     * @param NomClasificacioninformacion $nomClasificacioninformacion
     *
     * @return code Código de respuesta
     */
    public function modificar(NomClasificacioninformacion $nomClasificacioninformacion)
    {
        $nomClasificacioninformacion->save();
        return $nomClasificacioninformacion->idclasificacioninformacion;
    }

    /**
     * Elimina un NomClasificacioninformacion
     *
     * @param NomClasificacioninformacion $NomClasificacioninformacion
     *
     * @return code Código de respuesta
     * @throws Exception
     */
    public function eliminar($idclasificacioninformacion, $con)
    {
        $query = new Doctrine_Query();
        try {
            $result = $query->delete()
                ->from('NomClasificacioninformacion')
                ->where("idclasificacioninformacion = '$idclasificacioninformacion'")->execute();
            return $result == 0 ? false : true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                $con->commit();
                $queryDos = new Doctrine_Query();
                $result = $queryDos
                    ->update('NomClasificacioninformacion')
                    ->set('fechafin=?', 'CURRENT_DATE')->where(
                        "idclasificacioninformacion = '$idclasificacioninformacion'"
                    )->execute();
                return false;
            }
        }
    }

    /**
     * Busca un NomClasificacioninformacion
     *
     * @param int $idclasificacioninformacion
     *
     * @return object
     */
    public function Buscar($idclasificacioninformacion)
    {
        return Doctrine::getTable('NomClasificacioninformacion')->find($idclasificacioninformacion);
    }

    /**
     * Obtiene todos los Clasificadores
     *
     * @param mixed $denom
     * @param date  $fechaini Fecha inicio
     * @param date  $fechafin Fecha fin
     *
     * @return array
     */
    public function GetTodos($denom = '', $fechaini = '', $fechafin = '')
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomClasificacioninformacion')->orderBy('idclasificacioninformacion');
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
     * Obtiene todos los Clasificadores por límites
     *
     * @param int   $limite   Límite superior
     * @param int   $inicio   Comienzo inferior
     * @param mixed $denom
     * @param date  $fechaini Fecha inicio
     * @param date  $fechafin Fecha fin
     *
     * @return array
     */
    public function GetPorLimite($limite = 10, $inicio = 0, $denom = '', $fechaini = '', $fechafin =  '')
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomClasificacioninformacion');
        $result = ($limite) ? $result->limit($limite) : $result;
        $result = $result->offset(($inicio ? $inicio : 0))->orderby('idclasificacioninformacion');
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